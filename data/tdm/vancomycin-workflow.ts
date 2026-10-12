/* =========================================================
   VANCOMYCIN TDM WORKFLOW
   BỆNH VIỆN 199

   Nguồn nội bộ:
   QT.C7.38
   Quy trình giám sát nồng độ thuốc vancomycin
   trong máu ở người lớn

   Mục tiêu:
   - Chuẩn hóa workflow trước khi chuyển sang SmartDose AI
   - Không thay thế quyết định lâm sàng
   - Không tự xây lại Bayesian engine
========================================================= */

/* =========================================================
   TYPES
========================================================= */

export type YesNo =
  | "yes"
  | "no"
  | "";

export type RenalStatus =
  | "stable"
  | "unstable"
  | "aki"
  | "intermittent-hd"
  | "crrt"
  | "unknown";

export type VancomycinTdmIndication = {
  id: string;
  label: string;
  description: string;
};

export type WorkflowStatus =
  | "ready"
  | "warning"
  | "incomplete";

/* =========================================================
   TDM INDICATIONS
========================================================= */

export const vancomycinTdmIndications:
  VancomycinTdmIndication[] = [
    {
      id:
        "severe-mrsa",

      label:
        "Nhiễm MRSA nặng",

      description:
        "Người bệnh nhiễm khuẩn nặng do Staphylococcus aureus kháng methicillin.",
    },

    {
      id:
        "nephrotoxic-drugs",

      label:
        "Dùng đồng thời thuốc tăng nguy cơ độc thận",

      description:
        "Ví dụ aminoglycoside, piperacillin/tazobactam, amphotericin B, ciclosporin, cisplatin, lợi tiểu quai hoặc thuốc có nguy cơ độc thận khác.",
    },

    {
      id:
        "renal-dysfunction",

      label:
        "Suy thận hoặc chức năng thận không ổn định",

      description:
        "Bao gồm suy thận, thay đổi chức năng thận hoặc tình trạng cần đánh giá lại khả năng thải trừ vancomycin.",
    },

    {
      id:
        "obesity",

      label:
        "Béo phì",

      description:
        "BMI ≥ 30 kg/m² theo quy trình BV199.",
    },

    {
      id:
        "poor-response",

      label:
        "Đáp ứng lâm sàng kém",

      description:
        "Đáp ứng lâm sàng kém sau khoảng 3–5 ngày điều trị.",
    },
  ];

/* =========================================================
   AUC TARGET
========================================================= */

export const vancomycinAucTarget = {
  min:
    400,

  max:
    600,

  unit:
    "mg·h/L",

  micAssumption:
    1,

  micUnit:
    "mg/L",

  context:
    "Theo SOP BV199 đối với mục tiêu AUC0–24 khi MIC giả định 1 mg/L.",
} as const;

/* =========================================================
   INFUSION RULES FROM BV199 SOP
========================================================= */

export const infusionRules = [
  {
    maxDoseMg:
      1000,

    minimumMinutes:
      60,

    label:
      "Liều ≤ 1000 mg",
  },

  {
    maxDoseMg:
      1500,

    minimumMinutes:
      90,

    label:
      "Liều >1000 đến 1500 mg",
  },

  {
    maxDoseMg:
      null,

    minimumMinutes:
      120,

    label:
      "Liều ≥1500 mg",
  },
] as const;

/* =========================================================
   LOADING DOSE
========================================================= */

export const loadingDoseRule = {
  mgPerKg:
    25,

  maxMg:
    3000,

  weightBasis:
    "Cân nặng thực tế",

  note:
    "Liều nạp trong SOP BV199: 25 mg/kg, tối đa 3 g, dựa trên cân nặng thực tế.",
} as const;

/* =========================================================
   SAMPLING
========================================================= */

export const vancomycinSampling = {
  intermittent: {
    title:
      "Truyền tĩnh mạch ngắt quãng",

    description:
      "SOP BV199 quy định lấy mẫu phục vụ hiệu chỉnh theo lịch dùng thuốc và thời điểm truyền.",

    warning:
      "Không lấy mẫu trong khi đang truyền vancomycin hoặc quá gần thời điểm kết thúc truyền nếu không đúng protocol.",
  },

  continuous: {
    title:
      "Truyền tĩnh mạch liên tục",

    description:
      "Lấy mẫu khi nồng độ đã đạt trạng thái ổn định theo quy trình.",

    targetConcentration:
      "20–30 mg/L",
  },
} as const;

/* =========================================================
   HELPER — BMI
========================================================= */

export function calculateBmi(
  weightKg: number,
  heightCm: number
) {
  if (
    !Number.isFinite(
      weightKg
    ) ||
    !Number.isFinite(
      heightCm
    ) ||
    weightKg <= 0 ||
    heightCm <= 0
  ) {
    return null;
  }

  const heightM =
    heightCm /
    100;

  return (
    weightKg /
    (heightM *
      heightM)
  );
}

/* =========================================================
   HELPER — LOADING DOSE
========================================================= */

export function calculateLoadingDose(
  weightKg: number
) {
  if (
    !Number.isFinite(
      weightKg
    ) ||
    weightKg <= 0
  ) {
    return null;
  }

  const calculated =
    weightKg *
    loadingDoseRule.mgPerKg;

  return Math.min(
    calculated,
    loadingDoseRule.maxMg
  );
}

/* =========================================================
   HELPER — MINIMUM INFUSION TIME
========================================================= */

export function getMinimumInfusionMinutes(
  doseMg: number
) {
  if (
    !Number.isFinite(
      doseMg
    ) ||
    doseMg <= 0
  ) {
    return null;
  }

  if (
    doseMg <=
    1000
  ) {
    return 60;
  }

  if (
    doseMg <
    1500
  ) {
    return 90;
  }

  return 120;
}

/* =========================================================
   HELPER — AUC INTERPRETATION
========================================================= */

export function interpretVancomycinAuc(
  auc24: number
) {
  if (
    !Number.isFinite(
      auc24
    ) ||
    auc24 <= 0
  ) {
    return {
      status:
        "incomplete" as WorkflowStatus,

      title:
        "Chưa có AUC hợp lệ",

      message:
        "Nhập AUC24 được xác định từ SmartDose AI hoặc phương pháp PK/TDM được bệnh viện chấp thuận.",
    };
  }

  if (
    auc24 <
    vancomycinAucTarget.min
  ) {
    return {
      status:
        "warning" as WorkflowStatus,

      title:
        "AUC dưới khoảng mục tiêu",

      message:
        `AUC24 ${auc24.toFixed(
          0
        )} mg·h/L thấp hơn ${vancomycinAucTarget.min} mg·h/L. Cần đánh giá cùng MIC, chức năng thận, đáp ứng lâm sàng và đề xuất SmartDose.`,
    };
  }

  if (
    auc24 >
    vancomycinAucTarget.max
  ) {
    return {
      status:
        "warning" as WorkflowStatus,

      title:
        "AUC trên khoảng mục tiêu",

      message:
        `AUC24 ${auc24.toFixed(
          0
        )} mg·h/L cao hơn ${vancomycinAucTarget.max} mg·h/L. Cần đánh giá nguy cơ độc tính và regimen theo SmartDose.`,
    };
  }

  return {
    status:
      "ready" as WorkflowStatus,

    title:
      "AUC trong khoảng mục tiêu",

    message:
      `AUC24 ${auc24.toFixed(
        0
      )} mg·h/L nằm trong khoảng ${vancomycinAucTarget.min}–${vancomycinAucTarget.max} mg·h/L theo SOP BV199 trong bối cảnh MIC phù hợp.`,
  };
}