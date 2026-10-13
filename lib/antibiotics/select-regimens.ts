/*
  FILE: lib/antibiotics/select-regimens.ts

  Bo chon NHANH phac do kinh nghiem. Ham thuan (khong React), chi dinh tuyen
  nguoi dung toi nhanh (scenario) DA CO trong module tuong ung, theo dung tieu
  chi mo ta trong nguon cua module. KHONG tu chon thuoc, KHONG suy dien.

  Khong du du lieu / ngoai pham vi module -> eligible=false, scenarioId=null.
*/

export type ModuleKey = "cap" | "hap" | "vap" | "ent";

export type Setting = "outpatient" | "ward" | "icu";
export type UnitResistance = "lt10" | "gt10" | "unknown";

export type PatientContext = {
  isAdult: boolean;
  setting: Setting;
  severe: boolean;
  elderlyOrComorbid: boolean;
  recentAntibiotic: boolean;
  immunosuppressed: boolean;
  mdrRisk: boolean;
  mrsaRisk: boolean;
  unitResistance: UnitResistance;
  penicillinAllergy: boolean;
  renalImpaired: boolean;
  pregnant: boolean;
  antibioticIndicated: boolean;
  gasConfirmed: boolean;
};

export const DEFAULT_CONTEXT: PatientContext = {
  isAdult: true,
  setting: "ward",
  severe: false,
  elderlyOrComorbid: false,
  recentAntibiotic: false,
  immunosuppressed: false,
  mdrRisk: false,
  mrsaRisk: false,
  unitResistance: "unknown",
  penicillinAllergy: false,
  renalImpaired: false,
  pregnant: false,
  antibioticIndicated: false,
  gasConfirmed: false,
};

export type SelectionResult = {
  eligible: boolean;
  scenarioId: string | null;
  reason: string;
  notes: string[];
};

function safetyNotes(ctx: PatientContext): string[] {
  const notes: string[] = [];

  if (ctx.penicillinAllergy) {
    notes.push(
      "Có dị ứng penicillin/β-lactam: phân loại phản ứng (tức thì hay không tức thì) và chọn nhánh có ghi rõ phương án dị ứng trong module; không tự đổi thuốc ngoài nội dung module."
    );
  }

  if (ctx.renalImpaired) {
    notes.push(
      "Chức năng thận giảm: liều trong module là liều thường dùng của nguồn; cần hiệu chỉnh theo Clcr/eGFR và hội chẩn dược lâm sàng, ứng dụng chưa tự tính."
    );
  }

  if (ctx.pregnant) {
    notes.push(
      "Thai kỳ: module chưa có dữ liệu riêng cho thai kỳ; kiểm tra chống chỉ định từng thuốc (ví dụ doxycyclin, quinolon, clarithromycin) trước khi dùng."
    );
  }

  notes.push(
    "Gợi ý chỉ chuyển tới nhánh trong module, chưa phải y lệnh. Đối chiếu kháng sinh đồ, danh mục thuốc BV199 và thẩm định chuyên môn."
  );

  return notes;
}

function notEligible(reason: string, ctx: PatientContext): SelectionResult {
  return {
    eligible: false,
    scenarioId: null,
    reason,
    notes: safetyNotes(ctx),
  };
}

function selectCap(ctx: PatientContext): SelectionResult {
  if (!ctx.isAdult) {
    return notEligible(
      "Module CAP áp dụng cho người lớn. Chưa có dữ liệu đã xác minh cho trẻ em: không đủ điều kiện gợi ý.",
      ctx
    );
  }

  if (ctx.setting === "icu") {
    return {
      eligible: true,
      scenarioId: "icu",
      reason:
        "CAP nặng/ICU (suy hô hấp, sốc, nguy cơ tử vong cao) → nhánh 'CAP nặng – ICU'.",
      notes: safetyNotes(ctx),
    };
  }

  if (ctx.setting === "ward") {
    return {
      eligible: true,
      scenarioId: "ward",
      reason: "Nội trú không ICU → nhánh 'Nội trú – không ICU'.",
      notes: safetyNotes(ctx),
    };
  }

  const hasRisk =
    ctx.elderlyOrComorbid ||
    ctx.immunosuppressed ||
    ctx.recentAntibiotic ||
    ctx.mdrRisk;

  if (ctx.severe) {
    return notEligible(
      "Ngoại trú nhưng đánh giá nặng: không phù hợp điều trị ngoại trú theo module. Cân nhắc nhập viện rồi chọn lại nhánh Nội trú/ICU.",
      ctx
    );
  }

  return {
    eligible: true,
    scenarioId: hasRisk ? "risk" : "low",
    reason: hasRisk
      ? "Ngoại trú có tuổi > 65, bệnh đồng mắc, suy giảm miễn dịch, dùng kháng sinh trong 3 tháng hoặc nguy cơ kháng thuốc → nhánh 'Ngoại trú – có bệnh đồng mắc/nguy cơ'."
      : "Ngoại trú, < 65 tuổi, không bệnh đi kèm, không dùng kháng sinh 3 tháng, không nguy cơ kháng thuốc → nhánh 'Ngoại trú – nguy cơ thấp'.",
    notes: safetyNotes(ctx),
  };
}

function selectHap(ctx: PatientContext): SelectionResult {
  if (!ctx.isAdult) {
    return notEligible(
      "Module HAP áp dụng cho người lớn: không đủ điều kiện gợi ý cho trẻ em.",
      ctx
    );
  }

  const gramNegHigh = ctx.severe || ctx.mdrRisk;

  let scenarioId: string;
  let reason: string;

  if (gramNegHigh && ctx.mrsaRisk) {
    scenarioId = "hap-mdr-mrsa";
    reason =
      "HAP nặng hoặc có nguy cơ đa kháng, kèm nguy cơ MRSA → nhánh 'Nặng/nguy cơ đa kháng + xem xét chống MRSA' (Bảng 3.1, cột 2).";
  } else if (gramNegHigh) {
    scenarioId = "hap-mdr";
    reason =
      "HAP nặng hoặc có nguy cơ đa kháng → nhánh 'Nặng hoặc có nguy cơ đa kháng' (Bảng 3.1, cột 2).";
  } else if (ctx.mrsaRisk) {
    scenarioId = "hap-mrsa";
    reason =
      "HAP không nặng nhưng có nguy cơ MRSA → nhánh 'Không nặng nhưng có nguy cơ MRSA' (Bảng 3.1, cột 3).";
  } else {
    scenarioId = "hap-low";
    reason =
      "HAP không nặng, không nguy cơ đa kháng → nhánh 'Không nặng – không nguy cơ đa kháng' (Bảng 3.1, cột 1).";
  }

  return {
    eligible: true,
    scenarioId,
    reason,
    notes: safetyNotes(ctx),
  };
}

function selectVap(ctx: PatientContext): SelectionResult {
  if (!ctx.isAdult) {
    return notEligible(
      "Module VAP áp dụng cho người lớn: không đủ điều kiện gợi ý cho trẻ em.",
      ctx
    );
  }

  const lowResistanceUnit = ctx.unitResistance === "lt10";
  const gramNegHigh = ctx.mdrRisk || !lowResistanceUnit;

  let scenarioId: string;
  let reason: string;

  if (ctx.mrsaRisk) {
    scenarioId = "vap-mrsa";
    reason =
      "VAP có nguy cơ MRSA → nhánh 'Có nguy cơ MRSA' (Bảng 3.2). Nhánh này gồm cả ví dụ khi đồng thời có nguy cơ Gram âm đa kháng.";
  } else if (gramNegHigh) {
    scenarioId = "vap-mdr";
    reason =
      ctx.mdrRisk
        ? "VAP có yếu tố nguy cơ đa kháng → nhánh 'Có nguy cơ đa kháng – phối hợp hai nhóm' (Bảng 3.2)."
        : "Đơn vị có > 10% Gram âm kháng thuốc định đơn trị hoặc chưa biết tỷ lệ nhạy cảm → nhánh 'Có nguy cơ đa kháng – phối hợp hai nhóm' theo Bảng 3.2.";
  } else {
    scenarioId = "vap-low";
    reason =
      "VAP không yếu tố nguy cơ đa kháng và đơn vị có < 10% Gram âm kháng thuốc định đơn trị → nhánh 'Không nguy cơ đa kháng – đơn trị'.";
  }

  return {
    eligible: true,
    scenarioId,
    reason,
    notes: safetyNotes(ctx),
  };
}

function normalizeTitle(value: string) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function selectEnt(ctx: PatientContext, title: string): SelectionResult {
  const t = normalizeTitle(title);

  if (t.includes("viem xoang cap")) {
    if (!ctx.isAdult) {
      return notEligible(
        "Module viêm xoang cấp áp dụng cho người lớn: không đủ điều kiện gợi ý cho trẻ em.",
        ctx
      );
    }

    return {
      eligible: true,
      scenarioId: ctx.antibioticIndicated
        ? "sinus-antibiotic"
        : "sinus-watch",
      reason: ctx.antibioticIndicated
        ? "Đã đánh giá viêm mũi xoang cấp do vi khuẩn và quyết định dùng kháng sinh → nhánh 'Có chỉ định kháng sinh'."
        : "Chưa có quyết định dùng kháng sinh → nhánh 'Không biến chứng – có thể theo dõi'.",
      notes: safetyNotes(ctx),
    };
  }

  if (
    t.includes("viem hong lien cau") ||
    t.includes("viem hong do lien cau")
  ) {
    if (!ctx.gasConfirmed) {
      return {
        eligible: true,
        scenarioId: "strep-test",
        reason:
          "Chưa xác nhận liên cầu nhóm A → nhánh 'Chưa xác nhận liên cầu nhóm A' (đánh giá/xét nghiệm trước khi kê kháng sinh).",
        notes: safetyNotes(ctx),
      };
    }

    return {
      eligible: true,
      scenarioId: ctx.penicillinAllergy
        ? "strep-allergy"
        : "strep-confirmed",
      reason: ctx.penicillinAllergy
        ? "GAS đã xác nhận, có tiền sử dị ứng penicillin → nhánh 'Có tiền sử dị ứng penicillin'."
        : "GAS đã xác nhận, không dị ứng penicillin → nhánh 'GAS đã xác nhận – không dị ứng penicillin'.",
      notes: safetyNotes(ctx),
    };
  }

  if (t.includes("viem tai giua cap")) {
    if (ctx.isAdult) {
      return notEligible(
        "Nhánh có chỉ định kháng sinh của module chỉ dành cho trẻ em (NICE NG91). Không đủ điều kiện gợi ý cho người lớn.",
        ctx
      );
    }

    return {
      eligible: true,
      scenarioId: ctx.antibioticIndicated
        ? "aom-treatment"
        : "aom-watch",
      reason: ctx.antibioticIndicated
        ? "Trẻ em, viêm tai giữa cấp có chỉ định kháng sinh → nhánh 'Trẻ em có chỉ định dùng kháng sinh'."
        : "Trẻ em chưa có chỉ định dùng kháng sinh ngay → nhánh 'Không biến chứng – có thể theo dõi'.",
      notes: safetyNotes(ctx),
    };
  }

  return {
    eligible: true,
    scenarioId: null,
    reason:
      "Mặt bệnh này chỉ có một tình huống trong module, hiển thị bên dưới. Nhiều phương án chưa có liều đã xác minh: xem cờ 'Cần thẩm định'.",
    notes: safetyNotes(ctx),
  };
}

export function selectScenario(
  moduleKey: ModuleKey,
  ctx: PatientContext,
  diseaseTitle = ""
): SelectionResult {
  switch (moduleKey) {
    case "cap":
      return selectCap(ctx);
    case "hap":
      return selectHap(ctx);
    case "vap":
      return selectVap(ctx);
    case "ent":
      return selectEnt(ctx, diseaseTitle);
  }
}
