/* =========================================================
   BV199 CLINICAL PHARMACY
   FULL ANTIMICROBIAL GUIDELINE DATABASE

   Quy ước:
   VERIFIED_EXACT
   = đã đối chiếu được phác đồ cụ thể từ nguồn.

   VERIFIED_SUMMARY
   = nguyên tắc điều trị được nguồn hỗ trợ,
     nhưng không khẳng định toàn bộ liều chi tiết.

   INDEXED
   = mặt bệnh có trong guideline nhưng chưa nhập
     phác đồ chi tiết từ bản scan.

   Không dùng database này để tự động kê đơn.
========================================================= */

export type VerificationLevel =
  | "VERIFIED_EXACT"
  | "VERIFIED_SUMMARY"
  | "INDEXED";

export type SourceKind =
  | "hospital"
  | "national"
  | "international";

export type GuidelineSource = {
  id: string;
  name: string;
  year: number;
  kind: SourceKind;
  url?: string;
};

export type TreatmentOption = {
  title: string;
  drugs: string[];
  notes?: string[];
};

export type ClinicalSyndrome = {
  id: string;
  category: string;
  title: string;

  population: "Người lớn";

  setting: string[];
  severity: string[];

  verification: VerificationLevel;

  commonPathogens: string[];

  assessment: string[];

  sourceControl?: string[];

  firstLine: TreatmentOption[];

  alternatives?: TreatmentOption[];

  duration: string[];

  reassessment: string[];

  deEscalation: string[];

  renalAdjustment: boolean;

  tdm?: string[];

  sourceIds: string[];

  requiresBV199Validation: boolean;
};

export type PathogenGuidance = {
  id: string;

  name: string;

  group:
    | "Gram âm"
    | "Gram dương"
    | "Kỵ khí"
    | "Không điển hình"
    | "Nấm"
    | "Kiểu đề kháng";

  phenotype?: string;

  commonSites: string[];

  verification: VerificationLevel;

  preferred: string[];

  avoid: string[];

  notes: string[];

  sourceIds: string[];

  requiresBV199Validation: boolean;
};

/* =========================================================
   SOURCES
========================================================= */

export const guidelineSources: GuidelineSource[] = [
  {
    id: "bach-mai-2023",
    name: "Bệnh viện Bạch Mai 2023",
    year: 2023,
    kind: "hospital",
  },

  {
    id: "xanh-pon-2025",
    name: "Bệnh viện Đa khoa Xanh Pôn 2025",
    year: 2025,
    kind: "hospital",
  },

  {
    id: "umd-2023",
    name: "BV Đại học Y Dược TP.HCM 2023",
    year: 2023,
    kind: "hospital",
  },

  {
    id: "moh-708",
    name: "Bộ Y tế - QĐ 708/QĐ-BYT",
    year: 2015,
    kind: "national",
    url:
      "https://kcb.vn/van-ban/tai-lieu-huong-dan-su-dung-khang-sinh.html",
  },

  {
    id: "moh-5631",
    name: "Bộ Y tế - QĐ 5631/QĐ-BYT",
    year: 2020,
    kind: "national",
  },

  {
    id: "ssc-2026",
    name: "Surviving Sepsis Campaign 2026",
    year: 2026,
    kind: "international",
    url:
      "https://sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026",
  },

  {
    id: "idsa-amr-2026",
    name: "IDSA AMR Guidance 2026",
    year: 2026,
    kind: "international",
    url:
      "https://www.idsociety.org/practice-guideline/amr-guidance",
  },

  {
    id: "idsa-cuti-2025",
    name: "IDSA cUTI 2025",
    year: 2025,
    kind: "international",
    url:
      "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/",
  },

  {
    id: "eau-uti-2026",
    name: "EAU Urological Infections 2026",
    year: 2026,
    kind: "international",
    url:
      "https://uroweb.org/guidelines/urological-infections",
  },

  {
    id: "idsa-sab-2026",
    name: "IDSA/ESCMID SAB 2026",
    year: 2026,
    kind: "international",
    url:
      "https://www.idsociety.org/practice-guideline/staphylococcus-aureus-bacteremia/",
  },

  {
    id: "esc-ie-2023",
    name: "ESC Endocarditis 2023",
    year: 2023,
    kind: "international",
    url:
      "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/endocarditis/",
  },

  {
    id: "idsa-iai-2024",
    name: "IDSA cIAI 2024",
    year: 2024,
    kind: "international",
    url:
      "https://www.idsociety.org/practice-guideline/intra-abdominal-infections/",
  },

  {
    id: "iwgdf-dfi-2023",
    name: "IWGDF/IDSA DFI 2023",
    year: 2023,
    kind: "international",
    url:
      "https://www.idsociety.org/practice-guideline/diabetic-foot-infections/",
  },

  {
    id: "ats-idsa-cap",
    name: "ATS/IDSA CAP",
    year: 2019,
    kind: "international",
    url:
      "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults/",
  },

  {
    id: "ats-idsa-hap",
    name: "ATS/IDSA HAP/VAP",
    year: 2016,
    kind: "international",
    url:
      "https://www.idsociety.org/practice-guideline/hap_vap/",
  },
];

export const sourceMap =
  Object.fromEntries(
    guidelineSources.map(
      (source) => [
        source.id,
        source,
      ]
    )
  );

/* =========================================================
   HELPER
========================================================= */

function syndrome(
  value: Partial<ClinicalSyndrome> &
    Pick<
      ClinicalSyndrome,
      "id" | "category" | "title"
    >
): ClinicalSyndrome {
  return {
    id: value.id,

    category:
      value.category,

    title:
      value.title,

    population:
      "Người lớn",

    setting:
      value.setting ??
      ["Mọi bối cảnh"],

    severity:
      value.severity ??
      ["Theo phân tầng"],

    verification:
      value.verification ??
      "INDEXED",

    commonPathogens:
      value.commonPathogens ??
      [],

    assessment:
      value.assessment ??
      [
        "Đánh giá lâm sàng, cận lâm sàng và vị trí nhiễm khuẩn.",
        "Lấy bệnh phẩm vi sinh trước kháng sinh khi phù hợp và không gây trì hoãn nguy hiểm.",
        "Đối chiếu AST trước đó và antibiogram BV199.",
      ],

    sourceControl:
      value.sourceControl,

    firstLine:
      value.firstLine ??
      [
        {
          title:
            "Chưa chuẩn hóa phác đồ chi tiết",

          drugs: [
            "Mặt bệnh đã được lập chỉ mục từ guideline.",
            "Cần đối chiếu nguyên trang nguồn trước khi đưa liều cụ thể vào production.",
          ],
        },
      ],

    alternatives:
      value.alternatives,

    duration:
      value.duration ??
      [
        "Theo tác nhân, vị trí nhiễm, source control và đáp ứng.",
      ],

    reassessment:
      value.reassessment ??
      [
        "Đánh giá lại sau 24–72 giờ tùy mức độ.",
        "Xem lại cấy và AST ngay khi có kết quả.",
      ],

    deEscalation:
      value.deEscalation ??
      [
        "Thu hẹp phổ theo tác nhân và AST.",
        "Ngừng kháng sinh khi không còn bằng chứng nhiễm khuẩn.",
      ],

    renalAdjustment:
      value.renalAdjustment ??
      true,

    tdm:
      value.tdm,

    sourceIds:
      value.sourceIds ??
      [
        "bach-mai-2023",
        "xanh-pon-2025",
      ],

    requiresBV199Validation:
      true,
  };
}

/* =========================================================
   DETAILED / VERIFIED-SUMMARY SYNDROMES
========================================================= */

const detailedSyndromes: ClinicalSyndrome[] = [

  syndrome({
    id:
      "sepsis-community",

    category:
      "Nhiễm khuẩn huyết",

    title:
      "Sepsis - nguồn cộng đồng",

    setting: [
      "Nội trú",
      "ICU",
    ],

    severity: [
      "Nặng",
      "Sốc",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Streptococcus pneumoniae",
      "Staphylococcus aureus",
      "Escherichia coli",
      "Klebsiella pneumoniae",
    ],

    assessment: [
      "Lấy ít nhất 2 bộ cấy máu nếu không làm chậm điều trị.",
      "Lấy bệnh phẩm tại ổ nhiễm nghi ngờ.",
      "Đánh giá source control.",
      "Xem AST trước đó.",
      "Đối chiếu antibiogram BV199.",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Beta-lactam phổ rộng phù hợp với ổ nhiễm và dịch tễ BV199.",
          "Cân nhắc aminoglycoside ngắn hạn khi sốc hoặc nguy cơ Gram âm kháng.",
          "Phủ MRSA khi có yếu tố nguy cơ.",
        ],
      },
    ],

    duration: [
      "Theo ổ nhiễm, source control, tác nhân và đáp ứng.",
      "Ưu tiên thời gian ngắn nhất có hiệu quả.",
    ],

    tdm: [
      "Vancomycin: AUC-guided TDM.",
      "Aminoglycoside: TDM khi phù hợp.",
    ],

    sourceIds: [
      "umd-2023",
      "ssc-2026",
      "moh-5631",
    ],
  }),

  syndrome({
    id:
      "sepsis-hospital",

    category:
      "Nhiễm khuẩn huyết",

    title:
      "Sepsis - nguồn bệnh viện / nguy cơ MDR",

    setting: [
      "ICU",
    ],

    severity: [
      "Nặng",
      "Sốc",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "ESBL-E",
      "CRE",
      "DTR Pseudomonas aeruginosa",
      "CRAB",
      "MRSA",
    ],

    assessment: [
      "Cấy máu và bệnh phẩm ổ nhiễm.",
      "Xem vi sinh 12 tháng trước.",
      "Xem kháng sinh đã sử dụng trong 3 tháng.",
      "Đánh giá nguy cơ ESBL/CRE/DTR/CRAB.",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Carbapenem kháng Pseudomonas khi nguy cơ ESBL/MDR phù hợp.",
          "Phủ MRSA khi có chỉ định.",
          "Khi có carbapenemase/AST: chuyển điều trị đích theo cơ chế kháng.",
        ],
      },
    ],

    sourceIds: [
      "umd-2023",
      "ssc-2026",
      "idsa-amr-2026",
    ],
  }),

  syndrome({
    id:
      "sab",

    category:
      "Nhiễm khuẩn huyết",

    title:
      "Staphylococcus aureus bacteremia",

    setting: [
      "Nội trú",
    ],

    severity: [
      "Nặng",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "MSSA",
      "MRSA",
    ],

    assessment: [
      "Cấy máu theo dõi đến clearance.",
      "Đánh giá ổ nhiễm sâu và ổ di căn.",
      "TTE/TEE theo phân tầng nguy cơ.",
      "Đánh giá source control.",
    ],

    firstLine: [
      {
        title:
          "MSSA",

        drugs: [
          "Ưu tiên beta-lactam kháng tụ cầu hoặc cefazolin khi phù hợp.",
        ],
      },

      {
        title:
          "MRSA",

        drugs: [
          "Vancomycin theo AUC/TDM.",
          "Hoặc daptomycin khi vị trí nhiễm phù hợp.",
        ],
      },
    ],

    sourceIds: [
      "idsa-sab-2026",
      "bach-mai-2023",
    ],

    tdm: [
      "Vancomycin AUC-guided TDM.",
    ],
  }),

  syndrome({
    id:
      "cap-outpatient",

    category:
      "Hô hấp",

    title:
      "Viêm phổi cộng đồng - ngoại trú",

    setting: [
      "Ngoại trú",
    ],

    severity: [
      "Nhẹ",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Streptococcus pneumoniae",
      "Haemophilus influenzae",
      "Moraxella catarrhalis",
      "Mycoplasma pneumoniae",
      "Chlamydia pneumoniae",
    ],

    assessment: [
      "Đánh giá tiêu chí nhập viện.",
      "Đánh giá bệnh đồng mắc.",
      "Kháng sinh sử dụng gần đây.",
      "Nguy cơ MRSA/Pseudomonas.",
    ],

    firstLine: [
      {
        title:
          "Không bệnh đồng mắc đáng kể",

        drugs: [
          "Amoxicillin hoặc lựa chọn phù hợp theo guideline và dịch tễ.",
        ],
      },

      {
        title:
          "Có bệnh đồng mắc",

        drugs: [
          "Beta-lactam/beta-lactamase inhibitor + macrolide hoặc doxycycline.",
          "Hoặc fluoroquinolone hô hấp khi phù hợp.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
      "ats-idsa-cap",
    ],
  }),

  syndrome({
    id:
      "cap-inpatient",

    category:
      "Hô hấp",

    title:
      "Viêm phổi cộng đồng - nội trú",

    setting: [
      "Nội trú",
    ],

    severity: [
      "Trung bình",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Streptococcus pneumoniae",
      "Haemophilus influenzae",
      "Legionella spp.",
      "Mycoplasma pneumoniae",
    ],

    firstLine: [
      {
        title:
          "Phác đồ ưu tiên",

        drugs: [
          "Beta-lactam + macrolide.",
          "Hoặc fluoroquinolone hô hấp khi phù hợp.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
      "umd-2023",
      "ats-idsa-cap",
    ],
  }),

  syndrome({
    id:
      "cap-severe",

    category:
      "Hô hấp",

    title:
      "Viêm phổi cộng đồng nặng - ICU",

    setting: [
      "ICU",
    ],

    severity: [
      "Nặng",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Streptococcus pneumoniae",
      "Haemophilus influenzae",
      "Staphylococcus aureus",
      "Legionella spp.",
      "Gram âm",
    ],

    assessment: [
      "Cấy máu.",
      "Bệnh phẩm hô hấp.",
      "Đánh giá nguy cơ MRSA.",
      "Đánh giá nguy cơ Pseudomonas.",
    ],

    firstLine: [
      {
        title:
          "CAP nặng",

        drugs: [
          "Beta-lactam + macrolide.",
          "Hoặc beta-lactam + fluoroquinolone hô hấp.",
          "Thêm vancomycin/linezolid khi nguy cơ MRSA.",
          "Mở rộng Pseudomonas khi có yếu tố nguy cơ.",
        ],
      },
    ],

    sourceIds: [
      "xanh-pon-2025",
      "umd-2023",
      "ats-idsa-cap",
    ],
  }),

  syndrome({
    id:
      "hap",

    category:
      "Hô hấp",

    title:
      "Viêm phổi bệnh viện - HAP",

    setting: [
      "Bệnh viện",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Enterobacterales",
      "Pseudomonas aeruginosa",
      "Acinetobacter baumannii",
      "MRSA",
    ],

    assessment: [
      "Cấy bệnh phẩm hô hấp.",
      "Đánh giá MRSA.",
      "Đánh giá MDR.",
      "Dùng antibiogram BV199.",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Beta-lactam kháng Pseudomonas theo antibiogram BV199.",
          "Thêm vancomycin hoặc linezolid khi nguy cơ MRSA.",
          "Hai thuốc kháng Pseudomonas chỉ trong nhóm nguy cơ cao phù hợp guideline.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
      "umd-2023",
      "ats-idsa-hap",
    ],
  }),

  syndrome({
    id:
      "vap",

    category:
      "Hô hấp",

    title:
      "Viêm phổi liên quan thở máy - VAP",

    setting: [
      "ICU",
    ],

    severity: [
      "Nặng",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Pseudomonas aeruginosa",
      "Acinetobacter baumannii",
      "Enterobacterales",
      "MRSA",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Beta-lactam kháng Pseudomonas theo antibiogram BV199.",
          "Phủ MRSA khi có nguy cơ.",
          "Nếu DTR Pseudomonas/CRAB: chuyển điều trị theo tác nhân.",
        ],
      },
    ],

    sourceIds: [
      "xanh-pon-2025",
      "ats-idsa-hap",
      "idsa-amr-2026",
    ],
  }),

  syndrome({
    id:
      "meningitis",

    category:
      "Thần kinh",

    title:
      "Viêm màng não mủ người lớn",

    setting: [
      "Nội trú",
    ],

    severity: [
      "Nặng",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Streptococcus pneumoniae",
      "Neisseria meningitidis",
      "Listeria monocytogenes",
    ],

    assessment: [
      "Cấy máu.",
      "Chọc dò DNT khi không chống chỉ định.",
      "Không trì hoãn kháng sinh khi nghi ngờ cao.",
    ],

    firstLine: [
      {
        title:
          "Kinh nghiệm",

        drugs: [
          "Cephalosporin thế hệ 3 + vancomycin.",
          "Thêm ampicillin khi cần phủ Listeria.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],

    tdm: [
      "Vancomycin AUC-guided TDM.",
    ],
  }),

  syndrome({
    id:
      "healthcare-cns",

    category:
      "Thần kinh",

    title:
      "Viêm màng não / viêm não thất liên quan chăm sóc y tế",

    setting: [
      "Bệnh viện",
      "Ngoại thần kinh",
    ],

    severity: [
      "Nặng",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Staphylococcus spp.",
      "MRSA",
      "Pseudomonas aeruginosa",
      "Acinetobacter spp.",
      "Enterobacterales",
    ],

    assessment: [
      "Cấy DNT.",
      "Cấy máu.",
      "Đánh giá shunt/dẫn lưu.",
      "Source control.",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Vancomycin + beta-lactam kháng Pseudomonas có thấm CNS phù hợp.",
        ],
      },
    ],

    sourceIds: [
      "xanh-pon-2025",
      "umd-2023",
    ],

    tdm: [
      "Vancomycin AUC-guided TDM.",
    ],
  }),

  syndrome({
    id:
      "pyelonephritis",

    category:
      "Tiết niệu - sinh dục",

    title:
      "Viêm thận - bể thận cấp",

    setting: [
      "Ngoại trú",
      "Nội trú",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Escherichia coli",
      "Klebsiella pneumoniae",
      "Proteus spp.",
      "Pseudomonas aeruginosa ở người nguy cơ",
    ],

    assessment: [
      "Cấy nước tiểu.",
      "Cấy máu nếu sepsis.",
      "Đánh giá tắc nghẽn/sỏi.",
      "Đánh giá thai kỳ.",
    ],

    firstLine: [
      {
        title:
          "Nguy cơ kháng thấp",

        drugs: [
          "Ceftriaxone hoặc beta-lactam phù hợp.",
        ],
      },

      {
        title:
          "Nguy cơ ESBL",

        drugs: [
          "Carbapenem khi phù hợp.",
        ],
      },
    ],

    alternatives: [
      {
        title:
          "Chuyển uống khi AST nhạy",

        drugs: [
          "TMP-SMX.",
          "Ciprofloxacin.",
          "Levofloxacin.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
      "umd-2023",
      "idsa-cuti-2025",
      "eau-uti-2026",
    ],
  }),

  syndrome({
    id:
      "cuti",

    category:
      "Tiết niệu - sinh dục",

    title:
      "Nhiễm khuẩn niệu phức tạp",

    setting: [
      "Nội trú",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Escherichia coli",
      "Klebsiella pneumoniae",
      "Proteus spp.",
      "Enterococcus spp.",
      "Pseudomonas aeruginosa",
    ],

    firstLine: [
      {
        title:
          "Điều trị",

        drugs: [
          "Chọn theo mức độ nặng và nguy cơ kháng.",
          "Carbapenem khi nguy cơ ESBL/MDR phù hợp.",
          "Phủ Pseudomonas khi có yếu tố nguy cơ.",
        ],
      },
    ],

    duration: [
      "Ở người bệnh cải thiện tốt, IDSA 2025 ưu tiên liệu trình ngắn hơn; cá thể hóa nếu prostatitis, áp xe, tắc nghẽn hoặc nhóm ngoại lệ.",
    ],

    sourceIds: [
      "umd-2023",
      "idsa-cuti-2025",
      "idsa-amr-2026",
      "eau-uti-2026",
    ],
  }),

  syndrome({
    id:
      "ciai",

    category:
      "Ổ bụng - tiêu hóa - hệ mật",

    title:
      "Nhiễm khuẩn ổ bụng phức tạp",

    setting: [
      "Nội trú",
      "ICU",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Enterobacterales",
      "Streptococcus spp.",
      "Enterococcus spp.",
      "Bacteroides fragilis",
      "Pseudomonas aeruginosa ở nguy cơ",
    ],

    assessment: [
      "Đánh giá source control.",
      "Lấy cấy dịch ổ bụng khi có can thiệp phù hợp.",
      "Đánh giá nguy cơ ESBL/MDR.",
    ],

    sourceControl: [
      "Dẫn lưu/phẫu thuật khi có chỉ định.",
      "Không dùng kháng sinh thay cho source control.",
    ],

    firstLine: [
      {
        title:
          "Cộng đồng - nguy cơ thấp",

        drugs: [
          "Ceftriaxone + metronidazole.",
          "Hoặc beta-lactam/beta-lactamase inhibitor phù hợp.",
        ],
      },

      {
        title:
          "Bệnh viện / nguy cơ MDR",

        drugs: [
          "Piperacillin/tazobactam hoặc carbapenem phù hợp.",
          "MRSA/VRE coverage chỉ khi có chỉ định cụ thể.",
        ],
      },
    ],

    sourceIds: [
      "umd-2023",
      "idsa-iai-2024",
      "idsa-amr-2026",
    ],
  }),

  syndrome({
    id:
      "dfi",

    category:
      "Da - mô mềm",

    title:
      "Nhiễm khuẩn bàn chân đái tháo đường",

    setting: [
      "Ngoại trú",
      "Nội trú",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Staphylococcus aureus",
      "Streptococcus spp.",
      "Gram âm",
      "Kỵ khí",
    ],

    assessment: [
      "Phân mức độ IWGDF/IDSA.",
      "Lấy mô sâu để cấy.",
      "Đánh giá viêm xương.",
      "Đánh giá tưới máu.",
      "Debridement.",
    ],

    firstLine: [
      {
        title:
          "Nhiễm nhẹ",

        drugs: [
          "Ưu tiên phủ Gram dương.",
        ],
      },

      {
        title:
          "Trung bình / nặng",

        drugs: [
          "Mở rộng theo vi sinh và yếu tố nguy cơ.",
          "MRSA/Pseudomonas chỉ khi có nguy cơ cụ thể.",
        ],
      },
    ],

    sourceIds: [
      "umd-2023",
      "xanh-pon-2025",
      "iwgdf-dfi-2023",
    ],
  }),

  syndrome({
    id:
      "ie",

    category:
      "Tim mạch",

    title:
      "Viêm nội tâm mạc nhiễm khuẩn",

    setting: [
      "Nội trú",
    ],

    severity: [
      "Nặng",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Staphylococcus aureus",
      "Viridans streptococci",
      "Enterococcus spp.",
      "Coagulase-negative staphylococci",
    ],

    assessment: [
      "Lấy nhiều bộ cấy máu trước kháng sinh nếu có thể.",
      "TTE/TEE.",
      "Xác định van tự nhiên/van nhân tạo/thiết bị.",
      "Đánh giá biến chứng và chỉ định ngoại khoa.",
    ],

    firstLine: [
      {
        title:
          "Nguyên tắc",

        drugs: [
          "Không sử dụng một phác đồ duy nhất cho mọi trường hợp.",
          "Phác đồ phụ thuộc loại van, thời điểm, nguồn nhiễm và tác nhân dự kiến.",
          "Chuyển điều trị đích ngay khi có cấy.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
      "umd-2023",
      "esc-ie-2023",
    ],
  }),

  syndrome({
    id:
      "febrile-neutropenia",

    category:
      "Suy giảm miễn dịch",

    title:
      "Sốt giảm bạch cầu hạt",

    setting: [
      "Nội trú",
      "Ngoại trú chọn lọc",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Enterobacterales",
      "Pseudomonas aeruginosa",
      "Gram dương liên quan catheter",
      "Nấm khi sốt kéo dài",
    ],

    assessment: [
      "ANC.",
      "Huyết động.",
      "MASCC/CISNE khi phù hợp.",
      "Cấy máu.",
      "Đánh giá catheter và ổ nhiễm.",
    ],

    firstLine: [
      {
        title:
          "Nguy cơ cao",

        drugs: [
          "Beta-lactam kháng Pseudomonas.",
          "Không thêm vancomycin thường quy nếu không có chỉ định.",
          "Sốt kéo dài: đánh giá nấm xâm lấn.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  syndrome({
    id:
      "candidemia",

    category:
      "Nấm",

    title:
      "Candidemia / Candida xâm lấn",

    setting: [
      "ICU",
      "Nội trú",
    ],

    severity: [
      "Nặng",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Candida spp.",
    ],

    assessment: [
      "Cấy máu.",
      "Source control catheter.",
      "Xác định loài và độ nhạy.",
      "Đánh giá ổ di căn.",
    ],

    firstLine: [
      {
        title:
          "Điều trị ban đầu",

        drugs: [
          "Echinocandin thường là lựa chọn đầu ở người bệnh nặng.",
          "Step-down fluconazole khi ổn định, chủng nhạy và đã kiểm soát nhiễm.",
        ],
      },
    ],

    sourceIds: [
      "xanh-pon-2025",
      "bach-mai-2023",
    ],
  }),

  syndrome({
    id:
      "pcp",

    category:
      "HIV / OI",

    title:
      "Pneumocystis jirovecii pneumonia",

    setting: [
      "Ngoại trú",
      "Nội trú",
    ],

    verification:
      "VERIFIED_SUMMARY",

    commonPathogens: [
      "Pneumocystis jirovecii",
    ],

    assessment: [
      "Tình trạng miễn dịch.",
      "PaO2 / A-a gradient.",
      "PCR/soi khi phù hợp.",
    ],

    firstLine: [
      {
        title:
          "Điều trị",

        drugs: [
          "TMP-SMX là lựa chọn ưu tiên.",
          "Corticosteroid hỗ trợ khi thiếu oxy đủ tiêu chuẩn.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
    ],
  }),
];

/* =========================================================
   FULL INDEX
   Các bệnh chưa có detailedSyndrome vẫn xuất hiện trên app.
========================================================= */

const fullIndex = [

  /* NHIỄM KHUẨN HUYẾT */

  ["Nhiễm khuẩn huyết", "Sepsis - nguồn cộng đồng"],
  ["Nhiễm khuẩn huyết", "Sepsis - nguồn bệnh viện / nguy cơ MDR"],
  ["Nhiễm khuẩn huyết", "Sốc nhiễm khuẩn"],
  ["Nhiễm khuẩn huyết", "Nhiễm khuẩn huyết chưa rõ ổ"],
  ["Nhiễm khuẩn huyết", "Nhiễm khuẩn liên quan catheter"],
  ["Nhiễm khuẩn huyết", "Staphylococcus aureus bacteremia"],

  /* HÔ HẤP */

  ["Hô hấp", "Viêm phổi cộng đồng - ngoại trú"],
  ["Hô hấp", "Viêm phổi cộng đồng - nội trú"],
  ["Hô hấp", "Viêm phổi cộng đồng nặng - ICU"],
  ["Hô hấp", "Viêm phổi bệnh viện - HAP"],
  ["Hô hấp", "Viêm phổi liên quan thở máy - VAP"],
  ["Hô hấp", "Viêm phổi hít"],
  ["Hô hấp", "Đợt cấp COPD nghi nhiễm khuẩn"],
  ["Hô hấp", "Giãn phế quản bội nhiễm"],
  ["Hô hấp", "Viêm phế quản cấp"],
  ["Hô hấp", "Áp xe phổi"],
  ["Hô hấp", "Cúm - đánh giá bội nhiễm vi khuẩn"],
  ["Hô hấp", "Ho gà"],

  /* THẦN KINH */

  ["Thần kinh", "Viêm màng não mủ người lớn"],
  ["Thần kinh", "Viêm màng não liên quan chăm sóc y tế"],
  ["Thần kinh", "Viêm não thất liên quan dẫn lưu"],
  ["Thần kinh", "Áp xe não"],
  ["Thần kinh", "Tụ mủ dưới màng cứng"],
  ["Thần kinh", "Viêm não Herpes simplex"],

  /* TIẾT NIỆU */

  ["Tiết niệu - sinh dục", "Viêm bàng quang cấp"],
  ["Tiết niệu - sinh dục", "Viêm thận - bể thận cấp"],
  ["Tiết niệu - sinh dục", "Nhiễm khuẩn niệu phức tạp"],
  ["Tiết niệu - sinh dục", "Urosepsis"],
  ["Tiết niệu - sinh dục", "CAUTI"],
  ["Tiết niệu - sinh dục", "Khuẩn niệu không triệu chứng"],
  ["Tiết niệu - sinh dục", "Viêm tuyến tiền liệt cấp"],
  ["Tiết niệu - sinh dục", "Áp xe tuyến tiền liệt"],
  ["Tiết niệu - sinh dục", "Áp xe thận"],
  ["Tiết niệu - sinh dục", "Áp xe quanh thận"],
  ["Tiết niệu - sinh dục", "Viêm niệu đạo"],
  ["Tiết niệu - sinh dục", "Viêm mào tinh hoàn"],
  ["Tiết niệu - sinh dục", "Viêm tinh hoàn"],

  /* SẢN PHỤ KHOA */

  ["Sản - phụ khoa", "Viêm âm đạo"],
  ["Sản - phụ khoa", "Viêm phần phụ / PID"],
  ["Sản - phụ khoa", "Nhiễm khuẩn hậu sản"],
  ["Sản - phụ khoa", "Nhiễm khuẩn sản khoa"],

  /* Ổ BỤNG */

  ["Ổ bụng - tiêu hóa - hệ mật", "cIAI - cộng đồng"],
  ["Ổ bụng - tiêu hóa - hệ mật", "cIAI - bệnh viện"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Viêm phúc mạc"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Áp xe ổ bụng"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Viêm ruột thừa cấp"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Viêm túi thừa"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Viêm đường mật cấp"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Viêm túi mật cấp"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Áp xe gan"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Hoại tử tụy nhiễm khuẩn"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Tiêu chảy cấp nghi nhiễm khuẩn"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Nhiễm Clostridioides difficile"],
  ["Ổ bụng - tiêu hóa - hệ mật", "Nhiễm Helicobacter pylori"],

  /* DA */

  ["Da - mô mềm", "Cellulitis"],
  ["Da - mô mềm", "Erysipelas"],
  ["Da - mô mềm", "Áp xe da"],
  ["Da - mô mềm", "Chốc"],
  ["Da - mô mềm", "Viêm nang lông"],
  ["Da - mô mềm", "Viêm cân mạc hoại tử"],
  ["Da - mô mềm", "Nhiễm khuẩn vết mổ"],
  ["Da - mô mềm", "Nhiễm khuẩn bàn chân đái tháo đường"],
  ["Da - mô mềm", "Vết cắn người"],
  ["Da - mô mềm", "Vết cắn động vật"],

  /* XƯƠNG KHỚP */

  ["Xương - khớp", "Viêm xương tủy cấp"],
  ["Xương - khớp", "Viêm xương tủy mạn"],
  ["Xương - khớp", "Viêm đốt sống nhiễm khuẩn"],
  ["Xương - khớp", "Viêm khớp nhiễm khuẩn"],
  ["Xương - khớp", "Nhiễm khuẩn khớp nhân tạo"],
  ["Xương - khớp", "Viêm bao hoạt dịch nhiễm khuẩn"],
  ["Xương - khớp", "Viêm xương ức"],
  ["Xương - khớp", "Viêm xương nền sọ"],

  /* TIM MẠCH */

  ["Tim mạch", "Viêm nội tâm mạc - van tự nhiên"],
  ["Tim mạch", "Viêm nội tâm mạc - van nhân tạo sớm"],
  ["Tim mạch", "Viêm nội tâm mạc - van nhân tạo muộn"],
  ["Tim mạch", "Nhiễm khuẩn thiết bị nội tim"],

  /* SUY GIẢM MIỄN DỊCH */

  ["Suy giảm miễn dịch", "Sốt giảm bạch cầu hạt"],
  ["Suy giảm miễn dịch", "Nhiễm khuẩn ở bệnh nhân ung thư"],
  ["Suy giảm miễn dịch", "Nhiễm khuẩn khi dùng corticosteroid kéo dài"],
  ["Suy giảm miễn dịch", "Nhiễm khuẩn sau ghép tạng"],

  /* NẤM */

  ["Nấm", "Candidemia"],
  ["Nấm", "Candida xâm lấn"],
  ["Nấm", "Aspergillosis xâm lấn"],
  ["Nấm", "Cryptococcosis"],

  /* HIV / OI */

  ["HIV / OI", "Pneumocystis jirovecii pneumonia"],
  ["HIV / OI", "Toxoplasmosis não"],
  ["HIV / OI", "Cryptococcal meningitis"],
  ["HIV / OI", "CMV disease"],
  ["HIV / OI", "Talaromycosis"],
  ["HIV / OI", "Histoplasmosis"],
  ["HIV / OI", "Mycobacterium avium complex"],
  ["HIV / OI", "Cryptosporidiosis"],
  ["HIV / OI", "Cystoisosporiasis"],
] as const;

/* =========================================================
   MERGE FULL INDEX + DETAILED RECORDS
========================================================= */

function slugify(
  text: string
) {
  return text
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
}

const detailedByTitle =
  new Map(
    detailedSyndromes.map(
      (item) => [
        item.title,
        item,
      ]
    )
  );

export const allSyndromes:
  ClinicalSyndrome[] =
  fullIndex.map(
    ([category, title]) => {

      const detailed =
        detailedByTitle.get(
          title
        );

      if (
        detailed
      ) {
        return detailed;
      }

      return syndrome({
        id:
          slugify(
            title
          ),

        category,

        title,

        verification:
          "INDEXED",

        sourceIds: [
          "bach-mai-2023",
          "xanh-pon-2025",
        ],
      });
    }
  );

/* =========================================================
   PATHOGEN DATABASE
========================================================= */

export const pathogenGuidance:
  PathogenGuidance[] = [

  {
    id:
      "esbl",

    name:
      "Enterobacterales sinh ESBL",

    group:
      "Kiểu đề kháng",

    phenotype:
      "ESBL-E",

    commonSites: [
      "Tiết niệu",
      "Máu",
      "Ổ bụng",
      "Hô hấp",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "cUTI/pyelonephritis: TMP-SMX hoặc fluoroquinolone khi AST nhạy; carbapenem khi cần.",
      "Nhiễm ngoài đường niệu: carbapenem là lựa chọn nền tảng theo vị trí và mức độ.",
    ],

    avoid: [
      "Không mặc định dùng piperacillin/tazobactam cho nhiễm ESBL xâm lấn chỉ vì MIC thuận lợi.",
    ],

    notes: [
      "Thời gian điều trị không cần kéo dài chỉ vì ESBL.",
    ],

    sourceIds: [
      "idsa-amr-2026",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "ampc",

    name:
      "Enterobacterales nguy cơ AmpC",

    group:
      "Kiểu đề kháng",

    phenotype:
      "AmpC-E",

    commonSites: [
      "Máu",
      "Tiết niệu",
      "Ổ bụng",
      "Hô hấp",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "Cefepime khi AST và bối cảnh phù hợp.",
      "Carbapenem khi bệnh nặng hoặc cefepime không phù hợp.",
    ],

    avoid: [
      "Hạn chế cephalosporin thế hệ 3 kéo dài trong nhiễm xâm lấn do loài nguy cơ AmpC cao.",
    ],

    notes: [
      "Xác định đúng loài vi khuẩn.",
    ],

    sourceIds: [
      "idsa-amr-2026",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "cre",

    name:
      "Enterobacterales kháng carbapenem",

    group:
      "Kiểu đề kháng",

    phenotype:
      "CRE",

    commonSites: [
      "Máu",
      "Tiết niệu",
      "Ổ bụng",
      "Hô hấp",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "Lựa chọn theo carbapenemase: KPC, MBL/NDM hoặc OXA-48-like.",
      "Ưu tiên beta-lactam/beta-lactamase inhibitor mới hoặc cefiderocol khi phù hợp AST và cơ chế kháng.",
    ],

    avoid: [
      "Không mặc định polymyxin nếu còn beta-lactam mới có hoạt tính.",
    ],

    notes: [
      "Xác định carbapenemase rất quan trọng.",
    ],

    sourceIds: [
      "idsa-amr-2026",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "dtr-pseudomonas",

    name:
      "DTR Pseudomonas aeruginosa",

    group:
      "Kiểu đề kháng",

    phenotype:
      "DTR",

    commonSites: [
      "Hô hấp",
      "Máu",
      "Tiết niệu",
      "Ổ bụng",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "Ceftolozane/tazobactam.",
      "Ceftazidime/avibactam.",
      "Imipenem/relebactam.",
      "Cefiderocol trong tình huống phù hợp.",
    ],

    avoid: [
      "Không suy rộng nhạy cảm giữa các thuốc mới nếu chưa có AST.",
    ],

    notes: [
      "Theo dõi xuất hiện kháng trong quá trình điều trị.",
    ],

    sourceIds: [
      "idsa-amr-2026",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "crab",

    name:
      "Acinetobacter baumannii kháng carbapenem",

    group:
      "Kiểu đề kháng",

    phenotype:
      "CRAB",

    commonSites: [
      "Hô hấp",
      "Máu",
      "Vết thương",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "Ưu tiên chiến lược có sulbactam.",
      "Sulbactam/durlobactam khi thuốc sẵn có và phù hợp.",
      "Nếu chưa có: chiến lược sulbactam liều cao + thuốc thứ hai theo AST/guideline.",
    ],

    avoid: [
      "Không điều trị colonization.",
      "Không mặc định colistin đơn trị.",
    ],

    notes: [
      "Phân biệt colonization và infection, đặc biệt bệnh phẩm hô hấp.",
    ],

    sourceIds: [
      "idsa-amr-2026",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "mssa",

    name:
      "Staphylococcus aureus nhạy methicillin",

    group:
      "Gram dương",

    phenotype:
      "MSSA",

    commonSites: [
      "Máu",
      "Da - mô mềm",
      "Xương - khớp",
      "Nội tâm mạc",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "Nhiễm xâm lấn: ưu tiên beta-lactam kháng tụ cầu hoặc cefazolin khi phù hợp.",
    ],

    avoid: [
      "Không ưu tiên vancomycin cho MSSA bacteremia nếu sử dụng được beta-lactam phù hợp.",
    ],

    notes: [
      "Đánh giá ổ nhiễm sâu và clearance cấy máu.",
    ],

    sourceIds: [
      "idsa-sab-2026",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "mrsa",

    name:
      "Staphylococcus aureus kháng methicillin",

    group:
      "Gram dương",

    phenotype:
      "MRSA",

    commonSites: [
      "Máu",
      "Hô hấp",
      "Da - mô mềm",
      "Xương - khớp",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "Bacteremia: vancomycin theo AUC/TDM hoặc daptomycin khi phù hợp.",
      "Pneumonia: vancomycin hoặc linezolid.",
    ],

    avoid: [
      "Không dùng daptomycin điều trị pneumonia.",
    ],

    notes: [
      "Source control và clearance cấy máu rất quan trọng.",
    ],

    sourceIds: [
      "idsa-sab-2026",
      "ats-idsa-hap",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "enterococcus",

    name:
      "Enterococcus spp.",

    group:
      "Gram dương",

    commonSites: [
      "Tiết niệu",
      "Máu",
      "Ổ bụng",
      "Nội tâm mạc",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "E. faecalis nhạy ampicillin: ưu tiên ampicillin/amoxicillin khi phù hợp.",
      "VRE/E. faecium: linezolid hoặc daptomycin tùy vị trí và AST.",
    ],

    avoid: [
      "Cephalosporin không điều trị Enterococcus.",
    ],

    notes: [
      "Phân biệt E. faecalis và E. faecium.",
    ],

    sourceIds: [
      "umd-2023",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "pneumococcus",

    name:
      "Streptococcus pneumoniae",

    group:
      "Gram dương",

    commonSites: [
      "Hô hấp",
      "CNS",
      "Máu",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "CAP: beta-lactam theo mức độ và AST.",
      "Meningitis: lựa chọn theo breakpoint CNS.",
    ],

    avoid: [
      "Không sử dụng breakpoint non-CNS để diễn giải meningitis.",
    ],

    notes: [],

    sourceIds: [
      "xanh-pon-2025",
      "ats-idsa-cap",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "bacteroides",

    name:
      "Bacteroides fragilis group",

    group:
      "Kỵ khí",

    commonSites: [
      "Ổ bụng",
      "Áp xe",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "Metronidazole.",
      "Hoặc beta-lactam/BLI/carbapenem có hoạt tính kỵ khí tùy vị trí.",
    ],

    avoid: [
      "Không bỏ qua source control.",
    ],

    notes: [],

    sourceIds: [
      "umd-2023",
      "idsa-iai-2024",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "legionella",

    name:
      "Legionella spp.",

    group:
      "Không điển hình",

    phenotype:
      "Nội bào",

    commonSites: [
      "Hô hấp",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "Macrolide hoặc fluoroquinolone hô hấp theo bối cảnh.",
    ],

    avoid: [
      "Beta-lactam đơn trị không bao phủ Legionella.",
    ],

    notes: [],

    sourceIds: [
      "ats-idsa-cap",
      "xanh-pon-2025",
    ],

    requiresBV199Validation:
      true,
  },

  {
    id:
      "mycoplasma",

    name:
      "Mycoplasma pneumoniae",

    group:
      "Không điển hình",

    phenotype:
      "Không có thành tế bào",

    commonSites: [
      "Hô hấp",
    ],

    verification:
      "VERIFIED_SUMMARY",

    preferred: [
      "Macrolide, doxycycline hoặc fluoroquinolone hô hấp tùy đối tượng.",
    ],

    avoid: [
      "Beta-lactam không có tác dụng do không có thành tế bào.",
    ],

    notes: [],

    sourceIds: [
      "ats-idsa-cap",
    ],

    requiresBV199Validation:
      true,
  },
];

/* =========================================================
   CATEGORY HELPERS
========================================================= */

export const syndromeCategories = [
  "Tất cả",
  ...Array.from(
    new Set(
      allSyndromes.map(
        (item) =>
          item.category
      )
    )
  ),
];

export const categoryCounts =
  Object.fromEntries(
    syndromeCategories
      .filter(
        (item) =>
          item !==
          "Tất cả"
      )
      .map(
        (category) => [
          category,

          allSyndromes.filter(
            (item) =>
              item.category ===
              category
          ).length,
        ]
      )
  );

export const pathogenGroups = [
  "Tất cả",
  ...Array.from(
    new Set(
      pathogenGuidance.map(
        (item) =>
          item.group
      )
    )
  ),
];