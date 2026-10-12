/* =========================================================
   EMPIRIC THERAPY ENGINE
   BỆNH VIỆN 199

   LƯU Ý:
   - Đây là khung hỗ trợ quyết định lâm sàng.
   - Không thay thế phác đồ chính thức.
   - Từng khuyến cáo cần được Khoa Dược /
     Hội đồng Thuốc và Điều trị / KSNK thẩm định.
========================================================= */

/* =========================================================
   TYPES
========================================================= */

export type InfectionId =
  | "cap"
  | "hap-vap"
  | "uti"
  | "intra-abdominal"
  | "ssti"
  | "sepsis";

export type Severity =
  | "mild"
  | "moderate"
  | "severe";

export type RiskFlag =
  | "mrsa"
  | "pseudomonas"
  | "esbl";

export type RegimenStatus =
  | "preferred"
  | "alternative"
  | "conditional";

export type EmpiricOption = {
  id: string;

  antibioticIds: string[];

  antibioticNames: string[];

  status: RegimenStatus;

  label: string;

  doseNote: string;

  route: string;

  infusionNote?: string;

  coverage: string[];

  requires?: RiskFlag[];

  excludes?: RiskFlag[];

  avoidIfSevereBetaLactamAllergy?: boolean;

  renalAdjustmentRequired?: boolean;

  stewardshipNotes: string[];

  sourceNote: string;
};

export type EmpiricRule = {
  id: string;

  infectionId: InfectionId;

  infectionLabel: string;

  severity:
    | Severity
    | "all";

  description: string;

  likelyPathogens: string[];

  options: EmpiricOption[];
};

/* =========================================================
   INFECTION OPTIONS
========================================================= */

export const infectionOptions: {
  id: InfectionId;
  label: string;
  shortDescription: string;
}[] = [
  {
    id: "cap",
    label:
      "Viêm phổi cộng đồng",
    shortDescription:
      "Nhiễm khuẩn hô hấp mắc phải ngoài bệnh viện.",
  },

  {
    id: "hap-vap",
    label:
      "Viêm phổi bệnh viện / VAP",
    shortDescription:
      "Nhiễm khuẩn hô hấp liên quan chăm sóc y tế.",
  },

  {
    id: "uti",
    label:
      "Nhiễm khuẩn tiết niệu",
    shortDescription:
      "Bao gồm UTI có biến chứng và viêm thận-bể thận.",
  },

  {
    id: "intra-abdominal",
    label:
      "Nhiễm khuẩn ổ bụng",
    shortDescription:
      "Nhiễm khuẩn đường mật, phúc mạc hoặc ổ bụng.",
  },

  {
    id: "ssti",
    label:
      "Nhiễm khuẩn da – mô mềm",
    shortDescription:
      "Viêm mô tế bào, áp-xe hoặc nhiễm khuẩn mô mềm.",
  },

  {
    id: "sepsis",
    label:
      "Sepsis / nhiễm khuẩn huyết",
    shortDescription:
      "Nhiễm khuẩn nặng cần đánh giá nguồn nhiễm và bao phủ sớm.",
  },
];

/* =========================================================
   SEVERITY OPTIONS
========================================================= */

export const severityOptions: {
  id: Severity;
  label: string;
}[] = [
  {
    id: "mild",
    label:
      "Nhẹ",
  },

  {
    id: "moderate",
    label:
      "Trung bình",
  },

  {
    id: "severe",
    label:
      "Nặng / nguy kịch",
  },
];

/* =========================================================
   RULE DATABASE
========================================================= */

export const empiricRules:
  EmpiricRule[] = [

    /* =====================================================
       CAP
    ===================================================== */

    {
      id:
        "cap-all",

      infectionId:
        "cap",

      infectionLabel:
        "Viêm phổi cộng đồng",

      severity:
        "all",

      description:
        "Khung điều trị kinh nghiệm viêm phổi cộng đồng. Cần hiệu chỉnh theo mức độ nặng, bệnh nền và nguy cơ tác nhân kháng thuốc.",

      likelyPathogens: [
        "Streptococcus pneumoniae",
        "Haemophilus influenzae",
        "Tác nhân không điển hình",
      ],

      options: [
        {
          id:
            "cap-ceftriaxone",

          antibioticIds: [
            "ceftriaxone",
          ],

          antibioticNames: [
            "Ceftriaxone",
          ],

          status:
            "preferred",

          label:
            "Beta-lactam nền",

          doseNote:
            "Liều cụ thể cần theo phác đồ điều trị và chức năng cơ quan.",

          route:
            "IV",

          coverage: [
            "Phế cầu",
            "H. influenzae",
            "Một số Enterobacterales",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            false,

          stewardshipNotes: [
            "Đánh giá nhu cầu phối hợp thuốc bao phủ tác nhân không điển hình.",
            "Đánh giá lại sau 48–72 giờ.",
            "Giảm phổ khi có kết quả vi sinh.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ CAP chính thức của BV199.",
        },

        {
          id:
            "cap-levofloxacin",

          antibioticIds: [
            "levofloxacin",
          ],

          antibioticNames: [
            "Levofloxacin",
          ],

          status:
            "alternative",

          label:
            "Phương án thay thế có điều kiện",

          doseNote:
            "Cần hiệu chỉnh theo chức năng thận và chỉ định cụ thể.",

          route:
            "IV / PO",

          coverage: [
            "Phế cầu",
            "H. influenzae",
            "Tác nhân không điển hình",
          ],

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Không ưu tiên sử dụng rộng rãi khi có lựa chọn hẹp phổ phù hợp.",
            "Đánh giá nguy cơ kéo dài QT và tương tác thuốc.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ CAP chính thức của BV199.",
        },
      ],
    },

    /* =====================================================
       HAP / VAP
    ===================================================== */

    {
      id:
        "hap-vap-all",

      infectionId:
        "hap-vap",

      infectionLabel:
        "Viêm phổi bệnh viện / VAP",

      severity:
        "all",

      description:
        "Ưu tiên đánh giá nguy cơ Pseudomonas, MRSA, ESBL và dữ liệu antibiogram tại đơn vị điều trị.",

      likelyPathogens: [
        "Pseudomonas aeruginosa",
        "Klebsiella spp.",
        "Acinetobacter baumannii",
        "Staphylococcus aureus",
      ],

      options: [
        {
          id:
            "hap-piptazo",

          antibioticIds: [
            "piperacillin-tazobactam",
          ],

          antibioticNames: [
            "Piperacillin/tazobactam",
          ],

          status:
            "preferred",

          label:
            "Beta-lactam kháng Pseudomonas",

          doseNote:
            "Liều và thời gian truyền cần tối ưu PK/PD và hiệu chỉnh theo CrCl.",

          route:
            "IV",

          infusionNote:
            "Cân nhắc truyền kéo dài theo phác đồ PK/PD của bệnh viện.",

          coverage: [
            "Pseudomonas",
            "Enterobacterales",
            "Một số vi khuẩn Gram âm bệnh viện",
          ],

          requires: [
            "pseudomonas",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Đối chiếu antibiogram BV199.",
            "Không mặc định bao phủ MRSA nếu không có yếu tố nguy cơ.",
            "Đánh giá de-escalation sau khi có AST.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ HAP/VAP chính thức BV199.",
        },

        {
          id:
            "hap-meropenem",

          antibioticIds: [
            "meropenem",
          ],

          antibioticNames: [
            "Meropenem",
          ],

          status:
            "conditional",

          label:
            "Carbapenem khi nguy cơ ESBL/MDR phù hợp",

          doseNote:
            "Liều và chế độ truyền cần cá thể hóa theo CrCl, mức độ nặng và mục tiêu PK/PD.",

          route:
            "IV",

          infusionNote:
            "Có thể cần truyền kéo dài theo mục tiêu fT>MIC.",

          coverage: [
            "ESBL-producing Enterobacterales",
            "Pseudomonas tùy mức nhạy",
          ],

          requires: [
            "esbl",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Hạn chế carbapenem khi chưa có chỉ định hợp lý.",
            "Ưu tiên de-escalation nếu vi khuẩn còn nhạy với thuốc hẹp phổ hơn.",
            "Kiểm tra dữ liệu meropenem của antibiogram BV199.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ HAP/VAP và ESBL chính thức BV199.",
        },

        {
          id:
            "hap-mrsa",

          antibioticIds: [
            "vancomycin",
          ],

          antibioticNames: [
            "Vancomycin",
          ],

          status:
            "conditional",

          label:
            "Bổ sung bao phủ MRSA",

          doseNote:
            "Cần áp dụng TDM và cá thể hóa liều.",

          route:
            "IV",

          coverage: [
            "MRSA",
          ],

          requires: [
            "mrsa",
          ],

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Chỉ bổ sung khi nguy cơ MRSA đủ mạnh.",
            "Ngừng sớm nếu không còn bằng chứng MRSA.",
            "Theo dõi độc tính thận và mục tiêu TDM.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ MRSA/TDM vancomycin BV199.",
        },
      ],
    },

    /* =====================================================
       UTI
    ===================================================== */

    {
      id:
        "uti-all",

      infectionId:
        "uti",

      infectionLabel:
        "Nhiễm khuẩn tiết niệu",

      severity:
        "all",

      description:
        "Lựa chọn phụ thuộc mức độ nặng, vị trí nhiễm, tiền sử ESBL và antibiogram E. coli/Klebsiella tại BV199.",

      likelyPathogens: [
        "Escherichia coli",
        "Klebsiella spp.",
        "Proteus spp.",
        "Enterococcus spp.",
      ],

      options: [
        {
          id:
            "uti-ceftriaxone",

          antibioticIds: [
            "ceftriaxone",
          ],

          antibioticNames: [
            "Ceftriaxone",
          ],

          status:
            "preferred",

          label:
            "Điều trị kinh nghiệm không nguy cơ MDR cao",

          doseNote:
            "Liều cần theo mức độ nhiễm khuẩn và phác đồ bệnh viện.",

          route:
            "IV",

          coverage: [
            "E. coli",
            "Klebsiella spp. nhạy cảm",
            "Proteus spp.",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            false,

          stewardshipNotes: [
            "Đối chiếu tỷ lệ nhạy của E. coli/Klebsiella tại BV199.",
            "Không dùng dữ liệu antibiogram đơn độc để lựa chọn.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ UTI chính thức BV199.",
        },

        {
          id:
            "uti-meropenem",

          antibioticIds: [
            "meropenem",
          ],

          antibioticNames: [
            "Meropenem",
          ],

          status:
            "conditional",

          label:
            "Nguy cơ ESBL hoặc nhiễm khuẩn nặng",

          doseNote:
            "Cá thể hóa theo CrCl và mức độ nặng.",

          route:
            "IV",

          requires: [
            "esbl",
          ],

          coverage: [
            "ESBL-producing Enterobacterales",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Xác nhận nguy cơ ESBL trước khi lựa chọn carbapenem.",
            "Giảm phổ khi có AST.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ ESBL/UTI chính thức BV199.",
        },
      ],
    },

    /* =====================================================
       INTRA-ABDOMINAL
    ===================================================== */

    {
      id:
        "intra-abdominal-all",

      infectionId:
        "intra-abdominal",

      infectionLabel:
        "Nhiễm khuẩn ổ bụng",

      severity:
        "all",

      description:
        "Cần xem xét kiểm soát nguồn nhiễm song song với kháng sinh.",

      likelyPathogens: [
        "Enterobacterales",
        "Vi khuẩn kỵ khí",
        "Enterococcus trong một số bối cảnh",
      ],

      options: [
        {
          id:
            "iab-piptazo",

          antibioticIds: [
            "piperacillin-tazobactam",
          ],

          antibioticNames: [
            "Piperacillin/tazobactam",
          ],

          status:
            "preferred",

          label:
            "Bao phủ Gram âm + kỵ khí",

          doseNote:
            "Hiệu chỉnh theo CrCl và mức độ nặng.",

          route:
            "IV",

          coverage: [
            "Enterobacterales",
            "Pseudomonas",
            "Vi khuẩn kỵ khí",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Kiểm soát nguồn nhiễm là thành phần điều trị quan trọng.",
            "Đánh giá giảm phổ khi có kết quả cấy.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ nhiễm khuẩn ổ bụng BV199.",
        },

        {
          id:
            "iab-meropenem",

          antibioticIds: [
            "meropenem",
          ],

          antibioticNames: [
            "Meropenem",
          ],

          status:
            "conditional",

          label:
            "Nguy cơ ESBL / nhiễm khuẩn nặng",

          doseNote:
            "Cá thể hóa theo CrCl và chiến lược PK/PD.",

          route:
            "IV",

          requires: [
            "esbl",
          ],

          coverage: [
            "ESBL-producing Enterobacterales",
            "Kỵ khí",
            "Pseudomonas tùy mức nhạy",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Tránh dùng carbapenem nếu không có chỉ định hợp lý.",
            "Đánh giá de-escalation sớm.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ ổ bụng/ESBL BV199.",
        },
      ],
    },

    /* =====================================================
       SSTI
    ===================================================== */

    {
      id:
        "ssti-all",

      infectionId:
        "ssti",

      infectionLabel:
        "Nhiễm khuẩn da – mô mềm",

      severity:
        "all",

      description:
        "Đánh giá mủ/áp-xe, nguy cơ MRSA, nhiễm khuẩn hoại tử và nhu cầu can thiệp ngoại khoa.",

      likelyPathogens: [
        "Streptococcus spp.",
        "Staphylococcus aureus",
        "MRSA trong nhóm nguy cơ",
      ],

      options: [
        {
          id:
            "ssti-beta-lactam",

          antibioticIds: [
            "cefazolin",
          ],

          antibioticNames: [
            "Cefazolin",
          ],

          status:
            "preferred",

          label:
            "Không nguy cơ MRSA",

          doseNote:
            "Liều cần theo mức độ nặng và chức năng thận.",

          route:
            "IV",

          coverage: [
            "MSSA",
            "Streptococcus spp.",
          ],

          excludes: [
            "mrsa",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Đánh giá dẫn lưu nếu có ổ mủ.",
            "Không cần mở rộng Gram âm thường quy nếu không có chỉ định.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ SSTI chính thức BV199.",
        },

        {
          id:
            "ssti-vancomycin",

          antibioticIds: [
            "vancomycin",
          ],

          antibioticNames: [
            "Vancomycin",
          ],

          status:
            "conditional",

          label:
            "Có nguy cơ MRSA",

          doseNote:
            "Liều cần cá thể hóa theo TDM và chức năng thận.",

          route:
            "IV",

          requires: [
            "mrsa",
          ],

          coverage: [
            "MRSA",
            "MSSA",
            "Streptococcus spp.",
          ],

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Đánh giá TDM.",
            "Giảm phổ khi loại trừ MRSA.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ MRSA/TDM BV199.",
        },
      ],
    },

    /* =====================================================
       SEPSIS
    ===================================================== */

    {
      id:
        "sepsis-all",

      infectionId:
        "sepsis",

      infectionLabel:
        "Sepsis / nhiễm khuẩn huyết",

      severity:
        "all",

      description:
        "Cần xác định ổ nhiễm, lấy mẫu cấy phù hợp và lựa chọn kháng sinh theo nguy cơ tác nhân kháng thuốc.",

      likelyPathogens: [
        "Phụ thuộc ổ nhiễm",
        "Enterobacterales",
        "Pseudomonas",
        "Staphylococcus aureus",
      ],

      options: [
        {
          id:
            "sepsis-piptazo",

          antibioticIds: [
            "piperacillin-tazobactam",
          ],

          antibioticNames: [
            "Piperacillin/tazobactam",
          ],

          status:
            "preferred",

          label:
            "Bao phủ Gram âm rộng",

          doseNote:
            "Cần tối ưu liều sớm, đánh giá CrCl và mục tiêu PK/PD.",

          route:
            "IV",

          infusionNote:
            "Cân nhắc truyền kéo dài theo chiến lược PK/PD.",

          coverage: [
            "Enterobacterales",
            "Pseudomonas",
            "Một số kỵ khí",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Lựa chọn phải phù hợp ổ nhiễm.",
            "Đối chiếu antibiogram BV199.",
            "Đánh giá lại kháng sinh hàng ngày.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ sepsis chính thức BV199.",
        },

        {
          id:
            "sepsis-meropenem",

          antibioticIds: [
            "meropenem",
          ],

          antibioticNames: [
            "Meropenem",
          ],

          status:
            "conditional",

          label:
            "Nguy cơ ESBL/MDR cao",

          doseNote:
            "Cá thể hóa theo CrCl, mức độ nặng và mục tiêu PK/PD.",

          route:
            "IV",

          infusionNote:
            "Xem xét truyền kéo dài.",

          requires: [
            "esbl",
          ],

          coverage: [
            "ESBL-producing Enterobacterales",
            "Pseudomonas tùy độ nhạy",
          ],

          avoidIfSevereBetaLactamAllergy:
            true,

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Không dùng carbapenem thường quy nếu không có nguy cơ ESBL/MDR.",
            "De-escalation khi có AST.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ sepsis/ESBL BV199.",
        },

        {
          id:
            "sepsis-mrsa",

          antibioticIds: [
            "vancomycin",
          ],

          antibioticNames: [
            "Vancomycin",
          ],

          status:
            "conditional",

          label:
            "Bổ sung nếu nguy cơ MRSA",

          doseNote:
            "Cần TDM và cá thể hóa theo chức năng thận.",

          route:
            "IV",

          requires: [
            "mrsa",
          ],

          coverage: [
            "MRSA",
          ],

          renalAdjustmentRequired:
            true,

          stewardshipNotes: [
            "Không bổ sung thường quy nếu nguy cơ MRSA thấp.",
            "Ngừng khi dữ liệu vi sinh không hỗ trợ MRSA.",
          ],

          sourceNote:
            "Cần đối chiếu phác đồ MRSA/TDM BV199.",
        },
      ],
    },
  ];

/* =========================================================
   UTILS
========================================================= */

export function getEmpiricRule(
  infectionId: InfectionId,
  severity: Severity
) {
  return empiricRules.find(
    (rule) =>
      rule.infectionId ===
        infectionId &&
      (
        rule.severity ===
          severity ||
        rule.severity ===
          "all"
      )
  );
}

export function optionMatchesRisk(
  option: EmpiricOption,
  risks: RiskFlag[]
) {
  if (
    option.requires &&
    option.requires.length > 0
  ) {
    const matches =
      option.requires.every(
        (risk) =>
          risks.includes(
            risk
          )
      );

    if (!matches) {
      return false;
    }
  }

  if (
    option.excludes &&
    option.excludes.some(
      (risk) =>
        risks.includes(
          risk
        )
    )
  ) {
    return false;
  }

  return true;
}