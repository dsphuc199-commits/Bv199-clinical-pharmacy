/* =========================================================
   BV199 CLINICAL PHARMACY
   ANTIBIOTIC GUIDELINE DATABASE

   NGUYÊN TẮC:
   1. Điều trị kinh nghiệm = syndrome-based
   2. Điều trị đích = pathogen-based
   3. Antibiogram BV199 tách riêng
   4. CLSI dùng cho S/I/R
   5. PK/PD không thay thế CLSI breakpoint
   6. AST có kết quả -> chuyển targeted/de-escalation
========================================================= */

export type SourceId =
  | "BACH_MAI_2023"
  | "XANH_PON_2025"
  | "UMC_2023"
  | "BYT_708"
  | "BYT_5631"
  | "SSC_2026"
  | "IDSA_AMR_2026"
  | "IDSA_CUTI_2025"
  | "IDSA_SAB_2026"
  | "ATS_IDSA_CAP_2019"
  | "ATS_IDSA_HAP_VAP_2016"
  | "IDSA_IAI_2024"
  | "IWGDF_IDSA_DFI_2023"
  | "ACCP_BETA_LACTAM_2026";

export type SourceRef = {
  sourceId: SourceId;
  pages?: string;
  note?: string;
};

export type Regimen = {
  title: string;
  drugs: string[];
  conditions?: string[];
  warnings?: string[];
  sources: SourceRef[];
};

export type EmpiricScenario = {
  id: string;

  syndrome: string;

  category:
    | "Nhiễm khuẩn huyết"
    | "Hô hấp"
    | "Tiết niệu"
    | "Ổ bụng - hệ mật"
    | "Da - mô mềm"
    | "Thần kinh"
    | "Xương - khớp"
    | "Tim mạch"
    | "Khác";

  setting:
    | "Cộng đồng"
    | "Nội trú"
    | "ICU"
    | "Bệnh viện"
    | "Ngoại trú"
    | "Mọi bối cảnh";

  severity:
    | "Nhẹ"
    | "Trung bình"
    | "Nặng"
    | "Sốc"
    | "Theo phân tầng";

  riskTags: string[];

  pathogens: string[];

  assessment: string[];

  firstLine: Regimen[];

  alternatives?: Regimen[];

  addOn?: Regimen[];

  duration: string[];

  reassessment: string[];

  sources: SourceRef[];
};

export type PathogenGuidance = {
  id: string;

  name: string;

  aliases?: string[];

  group:
    | "Gram âm"
    | "Gram dương"
    | "Kỵ khí"
    | "Không điển hình";

  resistance?: string;

  sites: string[];

  preferred: Regimen[];

  alternatives?: Regimen[];

  avoid?: string[];

  notes: string[];

  sources: SourceRef[];
};

/* =========================================================
   SOURCE DATABASE
========================================================= */

export const sourceDatabase = {
  BACH_MAI_2023: {
    name: "Bệnh viện Bạch Mai 2023",
    description:
      "Hướng dẫn sử dụng kháng sinh trong lâm sàng tại Bệnh viện Bạch Mai.",
  },

  XANH_PON_2025: {
    name: "Bệnh viện Đa khoa Xanh Pôn 2025",
    description:
      "Hướng dẫn sử dụng kháng sinh năm 2025.",
  },

  UMC_2023: {
    name: "BV Đại học Y Dược TP.HCM 2023",
    description:
      "Hướng dẫn sử dụng kháng sinh ban hành kèm QĐ 2626/QĐ-BVĐHYD.",
  },

  BYT_708: {
    name: "Bộ Y tế - QĐ 708/QĐ-BYT",
    description:
      "Hướng dẫn sử dụng kháng sinh.",
  },

  BYT_5631: {
    name: "Bộ Y tế - QĐ 5631/QĐ-BYT",
    description:
      "Hướng dẫn thực hiện quản lý sử dụng kháng sinh trong bệnh viện.",
  },

  SSC_2026: {
    name: "Surviving Sepsis Campaign 2026",
    description:
      "International Guidelines for Management of Sepsis and Septic Shock.",
  },

  IDSA_AMR_2026: {
    name: "IDSA AMR Guidance 2026",
    description:
      "ESBL-E, AmpC-E, CRE, DTR P. aeruginosa, CRAB, S. maltophilia.",
  },

  IDSA_CUTI_2025: {
    name: "IDSA cUTI 2025",
    description:
      "Complicated urinary tract infection.",
  },

  IDSA_SAB_2026: {
    name: "IDSA/ESCMID SAB 2026",
    description:
      "Staphylococcus aureus bacteremia.",
  },

  ATS_IDSA_CAP_2019: {
    name: "ATS/IDSA CAP",
    description:
      "Community-acquired pneumonia in adults.",
  },

  ATS_IDSA_HAP_VAP_2016: {
    name: "ATS/IDSA HAP/VAP",
    description:
      "Hospital-acquired and ventilator-associated pneumonia.",
  },

  IDSA_IAI_2024: {
    name: "IDSA cIAI 2024",
    description:
      "Complicated intra-abdominal infection.",
  },

  IWGDF_IDSA_DFI_2023: {
    name: "IWGDF/IDSA DFI 2023",
    description:
      "Diabetes-related foot infection.",
  },

  ACCP_BETA_LACTAM_2026: {
    name: "ACCP β-lactam 2026",
    description:
      "Beta-lactam dose individualization in acutely ill patients.",
  },
} satisfies Record<
  SourceId,
  {
    name: string;
    description: string;
  }
>;

/* =========================================================
   EMPIRIC THERAPY
========================================================= */

export const empiricScenarios: EmpiricScenario[] = [

  /* =======================================================
     SEPSIS
  ======================================================= */

  {
    id: "sepsis-community-icu",

    syndrome:
      "Nhiễm khuẩn huyết / Sepsis - nguồn cộng đồng",

    category:
      "Nhiễm khuẩn huyết",

    setting:
      "ICU",

    severity:
      "Nặng",

    riskTags: [
      "Sepsis",
      "ICU",
      "MRSA",
      "Gram âm",
    ],

    pathogens: [
      "Streptococcus pneumoniae",
      "Staphylococcus aureus",
      "Escherichia coli",
      "Klebsiella pneumoniae",
    ],

    assessment: [
      "Lấy tối thiểu 2 bộ cấy máu càng sớm càng tốt nếu không gây trì hoãn điều trị.",
      "Lấy bệnh phẩm tại ổ nhiễm nghi ngờ.",
      "Đánh giá kiểm soát nguồn nhiễm.",
      "Kiểm tra kháng sinh đã sử dụng trong 90 ngày.",
      "Kiểm tra vi sinh và AST trước đó.",
      "Đối chiếu antibiogram BV199.",
    ],

    firstLine: [
      {
        title:
          "Phác đồ Gram âm phổ rộng",

        drugs: [
          "Piperacillin/tazobactam 4,5 g IV liều tải trong 30 phút → mỗi 6 giờ, truyền kéo dài 4 giờ",

          "HOẶC cefepime 2 g IV liều tải trong 30 phút → mỗi 8 giờ, truyền kéo dài 3-4 giờ",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",

            pages:
              "Nhiễm khuẩn huyết ICU",
          },
        ],
      },
    ],

    addOn: [
      {
        title:
          "Nếu sốc / cần mở rộng Gram âm",

        drugs: [
          "Amikacin 15-25 mg/kg IV mỗi 24 giờ",

          "HOẶC gentamicin 4-6 mg/kg IV mỗi 24 giờ",
        ],

        warnings: [
          "Đánh giá chức năng thận.",
          "TDM khi phù hợp.",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },
        ],
      },

      {
        title:
          "Nếu có nguy cơ MRSA",

        drugs: [
          "Vancomycin theo AUC/TDM",

          "HOẶC linezolid 600 mg IV/PO mỗi 12 giờ",

          "Daptomycin nếu nguồn ngoài phổi và phù hợp chỉ định",
        ],

        warnings: [
          "Không dùng daptomycin điều trị viêm phổi.",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },

          {
            sourceId:
              "IDSA_SAB_2026",
          },
        ],
      },
    ],

    duration: [
      "Không áp dụng một thời gian cố định cho mọi sepsis.",
      "Theo ổ nhiễm, tác nhân, kiểm soát nguồn và đáp ứng.",
      "Ưu tiên liệu trình ngắn nhất có hiệu quả khi source control đầy đủ.",
    ],

    reassessment: [
      "Đánh giá lại trong 24-48 giờ.",
      "Đọc kết quả cấy và AST.",
      "Thu hẹp phổ khi có thể.",
      "Nếu không còn bằng chứng nhiễm khuẩn: cân nhắc ngừng kháng sinh.",
    ],

    sources: [
      {
        sourceId:
          "UMC_2023",
      },

      {
        sourceId:
          "SSC_2026",
      },

      {
        sourceId:
          "BYT_5631",
      },
    ],
  },

  {
    id:
      "sepsis-hospital-mdr",

    syndrome:
      "Sepsis - nguồn bệnh viện / nguy cơ MDR",

    category:
      "Nhiễm khuẩn huyết",

    setting:
      "ICU",

    severity:
      "Sốc",

    riskTags: [
      "MDR",
      "ESBL",
      "CRE",
      "CRAB",
      "Pseudomonas",
      "MRSA",
    ],

    pathogens: [
      "ESBL-producing Enterobacterales",
      "CRE",
      "Pseudomonas aeruginosa",
      "Acinetobacter baumannii",
      "MRSA",
    ],

    assessment: [
      "Cấy máu và bệnh phẩm ổ nhiễm.",
      "Xem AST 12 tháng trước.",
      "Xem kháng sinh trong 3 tháng trước.",
      "Xem antibiogram BV199.",
      "Đánh giá nguy cơ CRE/DTR-Pseudomonas/CRAB.",
    ],

    firstLine: [
      {
        title:
          "Kháng sinh beta-lactam phổ rộng",

        drugs: [
          "Ampicillin/sulbactam theo phác đồ bệnh viện khi nghi Acinetobacter còn nhạy sulbactam",

          "HOẶC meropenem",

          "HOẶC imipenem/cilastatin",

          "Lựa chọn phải dựa trên ổ nhiễm + AST trước đó + antibiogram BV199",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },

          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    addOn: [
      {
        title:
          "Gram âm nặng / sốc",

        drugs: [
          "Amikacin hoặc gentamicin trong giai đoạn kinh nghiệm khi phù hợp",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },
        ],
      },

      {
        title:
          "MRSA",

        drugs: [
          "Vancomycin theo AUC/TDM",

          "HOẶC linezolid",

          "Daptomycin trong bacteremia/ổ ngoài phổi khi phù hợp",
        ],

        sources: [
          {
            sourceId:
              "IDSA_SAB_2026",
          },
        ],
      },
    ],

    duration: [
      "Theo ổ nhiễm.",
      "Nếu phác đồ kinh nghiệm ban đầu không có hoạt tính, với nhiễm khuẩn xâm lấn cần tính liệu trình điều trị đích từ lúc bắt đầu thuốc có hoạt tính.",
    ],

    reassessment: [
      "Đánh giá AST ngay khi có.",
      "Chuyển sang module Lựa chọn theo tác nhân.",
      "De-escalation khi phù hợp.",
    ],

    sources: [
      {
        sourceId:
          "SSC_2026",
      },

      {
        sourceId:
          "IDSA_AMR_2026",
      },

      {
        sourceId:
          "UMC_2023",
      },
    ],
  },

  /* =======================================================
     CAP
  ======================================================= */

  {
    id:
      "cap-inpatient",

    syndrome:
      "Viêm phổi cộng đồng - nội trú",

    category:
      "Hô hấp",

    setting:
      "Nội trú",

    severity:
      "Trung bình",

    riskTags: [
      "CAP",
      "cộng đồng",
    ],

    pathogens: [
      "Streptococcus pneumoniae",
      "Haemophilus influenzae",
      "Moraxella catarrhalis",
      "Legionella spp.",
      "Mycoplasma pneumoniae",
      "Chlamydia pneumoniae",
    ],

    assessment: [
      "Đánh giá mức độ nặng.",
      "Đánh giá chỉ định ICU.",
      "Đánh giá MRSA/Pseudomonas dựa trên tiền sử thực tế.",
    ],

    firstLine: [
      {
        title:
          "Beta-lactam + macrolide",

        drugs: [
          "Ceftriaxone + azithromycin",

          "HOẶC beta-lactam phù hợp + clarithromycin",
        ],

        sources: [
          {
            sourceId:
              "XANH_PON_2025",
          },

          {
            sourceId:
              "ATS_IDSA_CAP_2019",
          },
        ],
      },
    ],

    alternatives: [
      {
        title:
          "Fluoroquinolone hô hấp",

        drugs: [
          "Levofloxacin",

          "HOẶC moxifloxacin",
        ],

        warnings: [
          "Đánh giá QT, tương tác, nguy cơ C. difficile và kháng thuốc.",
        ],

        sources: [
          {
            sourceId:
              "ATS_IDSA_CAP_2019",
          },
        ],
      },
    ],

    duration: [
      "Theo ổn định lâm sàng.",
      "Không kéo dài thường quy khi đáp ứng tốt.",
    ],

    reassessment: [
      "Đánh giá 48-72 giờ.",
      "Chuyển IV → PO khi đủ điều kiện.",
    ],

    sources: [
      {
        sourceId:
          "BACH_MAI_2023",
      },

      {
        sourceId:
          "XANH_PON_2025",
      },

      {
        sourceId:
          "UMC_2023",
      },

      {
        sourceId:
          "ATS_IDSA_CAP_2019",
      },
    ],
  },

  /* =======================================================
     HAP / VAP
  ======================================================= */

  {
    id:
      "hap",

    syndrome:
      "Viêm phổi bệnh viện",

    category:
      "Hô hấp",

    setting:
      "Bệnh viện",

    severity:
      "Theo phân tầng",

    riskTags: [
      "HAP",
      "MRSA",
      "Pseudomonas",
      "MDR",
    ],

    pathogens: [
      "Enterobacterales",
      "Pseudomonas aeruginosa",
      "Acinetobacter baumannii",
      "Staphylococcus aureus",
    ],

    assessment: [
      "Cấy bệnh phẩm hô hấp.",
      "Đánh giá nguy cơ MRSA.",
      "Đánh giá nguy cơ Gram âm kháng.",
      "Xem antibiogram BV199.",
    ],

    firstLine: [
      {
        title:
          "Không nguy cơ MDR cao",

        drugs: [
          "Piperacillin/tazobactam",

          "HOẶC cefepime",

          "HOẶC ceftazidime",

          "HOẶC levofloxacin",

          "HOẶC carbapenem kháng Pseudomonas khi có chỉ định",
        ],

        sources: [
          {
            sourceId:
              "XANH_PON_2025",
          },

          {
            sourceId:
              "ATS_IDSA_HAP_VAP_2016",
          },
        ],
      },
    ],

    addOn: [
      {
        title:
          "Nguy cơ MRSA",

        drugs: [
          "Vancomycin theo AUC/TDM",

          "HOẶC linezolid",
        ],

        sources: [
          {
            sourceId:
              "ATS_IDSA_HAP_VAP_2016",
          },
        ],
      },
    ],

    duration: [
      "Ưu tiên liệu trình ngắn khi đáp ứng tốt.",
      "Kéo dài khi có biến chứng hoặc kiểm soát nguồn chưa đầy đủ.",
    ],

    reassessment: [
      "48-72 giờ.",
      "De-escalation theo AST.",
    ],

    sources: [
      {
        sourceId:
          "BACH_MAI_2023",
      },

      {
        sourceId:
          "XANH_PON_2025",
      },

      {
        sourceId:
          "UMC_2023",
      },

      {
        sourceId:
          "ATS_IDSA_HAP_VAP_2016",
      },
    ],
  },

  {
    id:
      "vap",

    syndrome:
      "Viêm phổi liên quan thở máy",

    category:
      "Hô hấp",

    setting:
      "ICU",

    severity:
      "Nặng",

    riskTags: [
      "VAP",
      "Pseudomonas",
      "CRAB",
      "MRSA",
    ],

    pathogens: [
      "Pseudomonas aeruginosa",
      "Acinetobacter baumannii",
      "Enterobacterales",
      "MRSA",
    ],

    assessment: [
      "Cấy bệnh phẩm hô hấp.",
      "Cấy máu khi phù hợp.",
      "Đánh giá kháng sinh IV 90 ngày trước.",
      "Đánh giá ngày thở máy.",
    ],

    firstLine: [
      {
        title:
          "Beta-lactam kháng Pseudomonas",

        drugs: [
          "Chọn piperacillin/tazobactam, cefepime, ceftazidime, meropenem hoặc imipenem tùy antibiogram BV199 và nguy cơ MDR.",
        ],

        sources: [
          {
            sourceId:
              "ATS_IDSA_HAP_VAP_2016",
          },
        ],
      },
    ],

    addOn: [
      {
        title:
          "Nếu nguy cơ MRSA",

        drugs: [
          "Vancomycin",

          "HOẶC linezolid",
        ],

        sources: [
          {
            sourceId:
              "ATS_IDSA_HAP_VAP_2016",
          },
        ],
      },
    ],

    duration: [
      "Cá thể hóa theo đáp ứng và tác nhân.",
    ],

    reassessment: [
      "De-escalation theo AST.",
      "Nếu DTR Pseudomonas hoặc CRAB → chuyển Lựa chọn theo tác nhân.",
    ],

    sources: [
      {
        sourceId:
          "XANH_PON_2025",
      },

      {
        sourceId:
          "IDSA_AMR_2026",
      },
    ],
  },

  /* =======================================================
     UTI
  ======================================================= */

  {
    id:
      "cuti",

    syndrome:
      "Nhiễm khuẩn niệu phức tạp / viêm thận-bể thận",

    category:
      "Tiết niệu",

    setting:
      "Nội trú",

    severity:
      "Theo phân tầng",

    riskTags: [
      "cUTI",
      "ESBL",
      "Pseudomonas",
    ],

    pathogens: [
      "Escherichia coli",
      "Klebsiella pneumoniae",
      "Proteus mirabilis",
      "Enterococcus spp.",
      "Pseudomonas aeruginosa",
    ],

    assessment: [
      "Cấy nước tiểu trước kháng sinh.",
      "Cấy máu nếu có sepsis.",
      "Đánh giá tắc nghẽn.",
      "Đánh giá catheter/dụng cụ đường niệu.",
    ],

    firstLine: [
      {
        title:
          "Nguy cơ đề kháng thấp",

        drugs: [
          "Ceftriaxone hoặc beta-lactam phù hợp theo dịch tễ địa phương.",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },
        ],
      },

      {
        title:
          "Nguy cơ ESBL",

        drugs: [
          "Ertapenem nếu không cần phủ Pseudomonas.",

          "Meropenem hoặc imipenem khi bệnh nặng / cần phủ Pseudomonas.",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    alternatives: [
      {
        title:
          "Khi AST xác nhận nhạy",

        drugs: [
          "TMP-SMX",

          "Ciprofloxacin",

          "Levofloxacin",
        ],

        sources: [
          {
            sourceId:
              "IDSA_CUTI_2025",
          },

          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    duration: [
      "IDSA cUTI 2025: nếu cải thiện lâm sàng, thường 5-7 ngày với fluoroquinolone hoặc 7 ngày với thuốc không phải fluoroquinolone.",
      "Cá thể hóa nếu prostatitis, áp xe, tắc nghẽn hoặc đáp ứng chậm.",
    ],

    reassessment: [
      "48-72 giờ.",
      "Chuyển IV → PO khi ổn định và có thuốc uống còn nhạy.",
    ],

    sources: [
      {
        sourceId:
          "BACH_MAI_2023",
      },

      {
        sourceId:
          "XANH_PON_2025",
      },

      {
        sourceId:
          "UMC_2023",
      },

      {
        sourceId:
          "IDSA_CUTI_2025",
      },
    ],
  },

  /* =======================================================
     INTRA-ABDOMINAL
  ======================================================= */

  {
    id:
      "intra-abdominal",

    syndrome:
      "Nhiễm khuẩn ổ bụng",

    category:
      "Ổ bụng - hệ mật",

    setting:
      "Mọi bối cảnh",

    severity:
      "Theo phân tầng",

    riskTags: [
      "ổ bụng",
      "kỵ khí",
      "source control",
    ],

    pathogens: [
      "E. coli",
      "Klebsiella pneumoniae",
      "Enterococcus spp.",
      "Bacteroides fragilis",
      "Pseudomonas aeruginosa",
    ],

    assessment: [
      "Đánh giá kiểm soát nguồn.",
      "Cấy dịch ổ bụng nếu có thủ thuật source control trong cIAI.",
      "Đánh giá MDR và healthcare-associated infection.",
    ],

    firstLine: [
      {
        title:
          "Cộng đồng - nguy cơ thấp",

        drugs: [
          "Ceftriaxone + metronidazole",

          "HOẶC beta-lactam/beta-lactamase inhibitor phù hợp",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },
        ],
      },

      {
        title:
          "Bệnh viện / nguy cơ MDR",

        drugs: [
          "Piperacillin/tazobactam",

          "HOẶC carbapenem kháng Pseudomonas tùy nguy cơ ESBL/MDR",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },

          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    duration: [
      "Phụ thuộc source control.",
      "Tránh kéo dài không cần thiết sau kiểm soát nguồn hiệu quả.",
    ],

    reassessment: [
      "Đánh giá source control.",
      "Thu hẹp theo cấy dịch ổ bụng.",
    ],

    sources: [
      {
        sourceId:
          "UMC_2023",
      },

      {
        sourceId:
          "IDSA_IAI_2024",
      },
    ],
  },

  /* =======================================================
     DIABETIC FOOT
  ======================================================= */

  {
    id:
      "diabetic-foot",

    syndrome:
      "Nhiễm khuẩn bàn chân đái tháo đường",

    category:
      "Da - mô mềm",

    setting:
      "Mọi bối cảnh",

    severity:
      "Theo phân tầng",

    riskTags: [
      "DFI",
      "MRSA",
      "Pseudomonas",
      "osteomyelitis",
    ],

    pathogens: [
      "Staphylococcus aureus",
      "Streptococcus spp.",
      "Enterobacterales",
      "Kỵ khí",
    ],

    assessment: [
      "Xác định có nhiễm khuẩn thực sự.",
      "Phân mức độ IWGDF/IDSA.",
      "Ưu tiên lấy mô sâu để cấy.",
      "Đánh giá viêm xương.",
      "Đánh giá tưới máu.",
    ],

    firstLine: [
      {
        title:
          "Nhẹ",

        drugs: [
          "Phủ Gram dương phù hợp.",
        ],

        sources: [
          {
            sourceId:
              "IWGDF_IDSA_DFI_2023",
          },
        ],
      },

      {
        title:
          "Trung bình / nặng",

        drugs: [
          "Mở rộng Gram âm/kỵ khí dựa trên mức độ, kháng sinh trước đó và vi sinh.",

          "Thêm MRSA/Pseudomonas khi có yếu tố nguy cơ cụ thể.",
        ],

        sources: [
          {
            sourceId:
              "IWGDF_IDSA_DFI_2023",
          },
        ],
      },
    ],

    duration: [
      "Theo mô mềm hay xương.",
      "Theo debridement và đáp ứng.",
    ],

    reassessment: [
      "Debridement.",
      "Off-loading.",
      "Đánh giá mạch máu.",
      "Kiểm soát đường huyết.",
    ],

    sources: [
      {
        sourceId:
          "UMC_2023",
      },

      {
        sourceId:
          "IWGDF_IDSA_DFI_2023",
      },
    ],
  },

  /* =======================================================
     MENINGITIS
  ======================================================= */

  {
    id:
      "meningitis",

    syndrome:
      "Viêm màng não mủ người lớn",

    category:
      "Thần kinh",

    setting:
      "Nội trú",

    severity:
      "Nặng",

    riskTags: [
      "CNS",
      "meningitis",
    ],

    pathogens: [
      "Streptococcus pneumoniae",
      "Neisseria meningitidis",
      "Listeria monocytogenes",
    ],

    assessment: [
      "Cấy máu trước kháng sinh nếu không gây trì hoãn.",
      "Chọc dò DNT khi không chống chỉ định.",
      "Không trì hoãn kháng sinh ở ca nghi ngờ cao.",
    ],

    firstLine: [
      {
        title:
          "Kinh nghiệm người lớn",

        drugs: [
          "Cephalosporin thế hệ 3 + vancomycin",

          "Thêm ampicillin khi cần phủ Listeria theo tuổi/yếu tố nguy cơ",
        ],

        sources: [
          {
            sourceId:
              "XANH_PON_2025",

            pages:
              "Viêm màng não mủ",
          },

          {
            sourceId:
              "BACH_MAI_2023",
          },
        ],
      },
    ],

    duration: [
      "Theo tác nhân.",
    ],

    reassessment: [
      "Điều trị đích ngay khi có PCR/cấy/AST.",
    ],

    sources: [
      {
        sourceId:
          "XANH_PON_2025",
      },

      {
        sourceId:
          "BACH_MAI_2023",
      },
    ],
  },

  /* =======================================================
     POST NEUROSURGERY
  ======================================================= */

  {
    id:
      "healthcare-cns",

    syndrome:
      "Nhiễm khuẩn CNS sau phẫu thuật / thiết bị",

    category:
      "Thần kinh",

    setting:
      "Bệnh viện",

    severity:
      "Nặng",

    riskTags: [
      "neurosurgery",
      "MRSA",
      "Pseudomonas",
    ],

    pathogens: [
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
      "Đánh giá source control.",
    ],

    firstLine: [
      {
        title:
          "Phác đồ kinh nghiệm",

        drugs: [
          "Vancomycin + beta-lactam kháng Pseudomonas có thấm CNS phù hợp.",
        ],

        sources: [
          {
            sourceId:
              "XANH_PON_2025",
          },

          {
            sourceId:
              "UMC_2023",
          },
        ],
      },
    ],

    duration: [
      "Theo tác nhân và thiết bị.",
    ],

    reassessment: [
      "Điều trị đích theo cấy DNT.",
      "Đánh giá tháo/thay thiết bị khi chỉ định.",
    ],

    sources: [
      {
        sourceId:
          "XANH_PON_2025",
      },

      {
        sourceId:
          "UMC_2023",
      },
    ],
  },

  /* =======================================================
     BRAIN ABSCESS
  ======================================================= */

  {
    id:
      "brain-abscess",

    syndrome:
      "Áp xe não",

    category:
      "Thần kinh",

    setting:
      "Nội trú",

    severity:
      "Nặng",

    riskTags: [
      "áp xe",
      "kỵ khí",
      "MRSA",
    ],

    pathogens: [
      "Streptococcus spp.",
      "Staphylococcus aureus",
      "Enterobacterales",
      "Kỵ khí",
    ],

    assessment: [
      "Xác định nguồn: tai-xoang-răng, chấn thương, phẫu thuật hoặc đường máu.",
      "Hội chẩn ngoại thần kinh.",
      "Cấy mủ khi dẫn lưu.",
    ],

    firstLine: [
      {
        title:
          "Nguồn tai-xoang-răng / cộng đồng",

        drugs: [
          "Cephalosporin thế hệ 3 + metronidazole.",
        ],

        sources: [
          {
            sourceId:
              "XANH_PON_2025",
          },
        ],
      },
    ],

    addOn: [
      {
        title:
          "Sau phẫu thuật/chấn thương hoặc nguy cơ MRSA",

        drugs: [
          "Thêm vancomycin.",
        ],

        sources: [
          {
            sourceId:
              "XANH_PON_2025",
          },
        ],
      },
    ],

    duration: [
      "Thường kéo dài.",
      "Theo dẫn lưu, tác nhân và đáp ứng hình ảnh.",
    ],

    reassessment: [
      "Theo dõi hình ảnh.",
      "Thu hẹp theo cấy.",
    ],

    sources: [
      {
        sourceId:
          "XANH_PON_2025",
      },

      {
        sourceId:
          "BACH_MAI_2023",
      },
    ],
  },

  /* =======================================================
     VERTEBRAL OSTEOMYELITIS
  ======================================================= */

  {
    id:
      "vertebral-osteomyelitis",

    syndrome:
      "Viêm đốt sống / nhiễm khuẩn cột sống",

    category:
      "Xương - khớp",

    setting:
      "Nội trú",

    severity:
      "Theo phân tầng",

    riskTags: [
      "osteomyelitis",
      "S. aureus",
    ],

    pathogens: [
      "Staphylococcus aureus",
      "Streptococcus spp.",
      "Enterobacterales",
    ],

    assessment: [
      "Bệnh nhân ổn định: cố gắng lấy bệnh phẩm trước kháng sinh.",
      "Nếu sốc hoặc thiếu hụt thần kinh tiến triển: khởi trị ngay sau cấy máu.",
    ],

    firstLine: [
      {
        title:
          "Khi bắt buộc dùng kinh nghiệm",

        drugs: [
          "Vancomycin + cephalosporin phổ Gram âm phù hợp.",

          "Mở rộng Pseudomonas nếu có nguy cơ.",
        ],

        sources: [
          {
            sourceId:
              "XANH_PON_2025",
          },
        ],
      },
    ],

    duration: [
      "Thường cần liệu trình kéo dài.",
      "Theo tác nhân, áp xe và can thiệp.",
    ],

    reassessment: [
      "Điều trị đích theo cấy máu/sinh thiết.",
    ],

    sources: [
      {
        sourceId:
          "XANH_PON_2025",
      },

      {
        sourceId:
          "BACH_MAI_2023",
      },
    ],
  },

  /* =======================================================
     ENDOCARDITIS
  ======================================================= */

  {
    id:
      "endocarditis",

    syndrome:
      "Viêm nội tâm mạc nhiễm khuẩn",

    category:
      "Tim mạch",

    setting:
      "Nội trú",

    severity:
      "Nặng",

    riskTags: [
      "endocarditis",
      "SAB",
      "Enterococcus",
      "prosthetic valve",
    ],

    pathogens: [
      "Staphylococcus aureus",
      "Viridans streptococci",
      "Enterococcus spp.",
      "Coagulase-negative staphylococci",
    ],

    assessment: [
      "Lấy nhiều bộ cấy máu trước kháng sinh khi có thể.",
      "Xác định van tự nhiên / van nhân tạo / thiết bị.",
      "Siêu âm tim.",
    ],

    firstLine: [
      {
        title:
          "Nguyên tắc",

        drugs: [
          "Không sử dụng một phác đồ duy nhất cho mọi VNTMNK.",

          "Chọn theo loại van, nguồn cộng đồng/bệnh viện và nguy cơ MRSA/Enterococcus.",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },
        ],
      },
    ],

    duration: [
      "Theo tác nhân, loại van và biến chứng.",
    ],

    reassessment: [
      "Điều trị đích khi có cấy.",
      "Đánh giá chỉ định phẫu thuật.",
    ],

    sources: [
      {
        sourceId:
          "UMC_2023",
      },
    ],
  },
];

/* =========================================================
   PATHOGEN-BASED THERAPY
========================================================= */

export const pathogenGuidance: PathogenGuidance[] = [

  {
    id:
      "esbl",

    name:
      "Enterobacterales sinh ESBL",

    aliases: [
      "ESBL-E",
      "E. coli ESBL",
      "Klebsiella ESBL",
    ],

    group:
      "Gram âm",

    resistance:
      "ESBL-E",

    sites: [
      "Tiết niệu",
      "Nhiễm khuẩn huyết",
      "Ổ bụng",
      "Hô hấp",
    ],

    preferred: [
      {
        title:
          "cUTI / pyelonephritis",

        drugs: [
          "TMP-SMX nếu AST nhạy",

          "Ciprofloxacin nếu AST nhạy",

          "Levofloxacin nếu AST nhạy",

          "Carbapenem nếu không sử dụng được các thuốc trên hoặc bệnh nặng",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },

      {
        title:
          "Nhiễm ngoài đường niệu",

        drugs: [
          "Ertapenem",

          "Imipenem",

          "Meropenem",

          "Bệnh nhân nguy kịch hoặc giảm albumin: ưu tiên meropenem/imipenem hơn ertapenem",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    alternatives: [
      {
        title:
          "Chuyển uống",

        drugs: [
          "TMP-SMX",

          "Ciprofloxacin",

          "Levofloxacin",
        ],

        conditions: [
          "AST nhạy.",
          "Ổn định huyết động.",
          "Hấp thu đường tiêu hóa tốt.",
          "Đạt nồng độ tại ổ nhiễm.",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    avoid: [
      "Không mặc định dùng piperacillin/tazobactam cho ESBL bacteremia/invasive infection chỉ dựa trên một MIC thuận lợi.",
    ],

    notes: [
      "Thời gian điều trị không cần kéo dài chỉ vì ESBL.",
    ],

    sources: [
      {
        sourceId:
          "IDSA_AMR_2026",
      },
    ],
  },

  {
    id:
      "ampc",

    name:
      "Enterobacterales nguy cơ AmpC",

    aliases: [
      "Enterobacter cloacae complex",
      "Klebsiella aerogenes",
      "Citrobacter freundii",
    ],

    group:
      "Gram âm",

    resistance:
      "AmpC-E",

    sites: [
      "Bacteremia",
      "UTI",
      "Ổ bụng",
      "Hô hấp",
    ],

    preferred: [
      {
        title:
          "Nhiễm xâm lấn",

        drugs: [
          "Cefepime khi AST phù hợp",

          "Carbapenem khi nặng hoặc không phù hợp cefepime",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    avoid: [
      "Hạn chế cephalosporin thế hệ 3 kéo dài trong nhiễm xâm lấn do loài có nguy cơ AmpC cảm ứng đáng kể.",
    ],

    notes: [
      "Cần xác định đúng loài vi khuẩn.",
    ],

    sources: [
      {
        sourceId:
          "IDSA_AMR_2026",
      },
    ],
  },

  {
    id:
      "cre",

    name:
      "Enterobacterales kháng carbapenem",

    aliases: [
      "CRE",
      "KPC",
      "NDM",
      "OXA-48-like",
    ],

    group:
      "Gram âm",

    resistance:
      "CRE",

    sites: [
      "Bacteremia",
      "UTI",
      "Ổ bụng",
      "Hô hấp",
    ],

    preferred: [
      {
        title:
          "Lựa chọn theo carbapenemase",

        drugs: [
          "Chọn beta-lactam/beta-lactamase inhibitor mới hoặc cefiderocol dựa trên loại carbapenemase và AST.",

          "KPC, MBL/NDM và OXA-48-like không được xử trí như nhau.",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    avoid: [
      "Không dùng polymyxin thường quy nếu còn beta-lactam mới phù hợp.",
    ],

    notes: [
      "Ưu tiên xác định carbapenemase.",
    ],

    sources: [
      {
        sourceId:
          "IDSA_AMR_2026",
      },
    ],
  },

  {
    id:
      "dtr-pseudomonas",

    name:
      "Pseudomonas aeruginosa khó điều trị",

    aliases: [
      "DTR P. aeruginosa",
      "CRPA",
    ],

    group:
      "Gram âm",

    resistance:
      "DTR P. aeruginosa",

    sites: [
      "Hô hấp",
      "Bacteremia",
      "UTI",
      "Ổ bụng",
    ],

    preferred: [
      {
        title:
          "Nhiễm ngoài đường niệu",

        drugs: [
          "Ceftazidime/avibactam",

          "Ceftolozane/tazobactam",

          "Imipenem/relebactam",

          "Trong pneumonia do DTR Pseudomonas: IDSA 2026 ưu tiên ceftolozane/tazobactam trong nhóm thuốc ưu tiên",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    alternatives: [
      {
        title:
          "Thay thế",

        drugs: [
          "Cefiderocol khi AST phù hợp.",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    notes: [
      "Theo dõi xuất hiện kháng trong quá trình điều trị.",
    ],

    sources: [
      {
        sourceId:
          "IDSA_AMR_2026",
      },
    ],
  },

  {
    id:
      "crab",

    name:
      "Acinetobacter baumannii kháng carbapenem",

    aliases: [
      "CRAB",
    ],

    group:
      "Gram âm",

    resistance:
      "CRAB",

    sites: [
      "Hô hấp",
      "Bacteremia",
      "Vết thương",
    ],

    preferred: [
      {
        title:
          "Nhiễm CRAB xâm lấn",

        drugs: [
          "Sulbactam/durlobactam + carbapenem khi thuốc sẵn có và phù hợp AST.",

          "Nếu chưa sẵn có: chiến lược nền sulbactam liều cao + thuốc thứ hai theo IDSA/AST.",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    avoid: [
      "Không điều trị colonization.",
      "Không mặc định đơn trị colistin nếu còn lựa chọn ưu tiên tốt hơn.",
    ],

    notes: [
      "Đặc biệt cần phân biệt colonization và infection ở bệnh phẩm hô hấp.",
    ],

    sources: [
      {
        sourceId:
          "IDSA_AMR_2026",
      },
    ],
  },

  {
    id:
      "stenotrophomonas",

    name:
      "Stenotrophomonas maltophilia",

    group:
      "Gram âm",

    resistance:
      "Kháng tự nhiên nhiều beta-lactam",

    sites: [
      "Hô hấp",
      "Bacteremia",
      "Catheter",
    ],

    preferred: [
      {
        title:
          "Điều trị đích",

        drugs: [
          "Lựa chọn dựa trên AST và IDSA AMR 2026.",

          "TMP-SMX",

          "Minocycline",

          "Levofloxacin",

          "Cefiderocol hoặc chiến lược phối hợp khi phù hợp",
        ],

        sources: [
          {
            sourceId:
              "IDSA_AMR_2026",
          },
        ],
      },
    ],

    avoid: [
      "Không điều trị colonization hô hấp nếu không có bằng chứng nhiễm khuẩn.",
    ],

    notes: [
      "Phân biệt colonization rất quan trọng.",
    ],

    sources: [
      {
        sourceId:
          "IDSA_AMR_2026",
      },
    ],
  },

  {
    id:
      "mssa",

    name:
      "Staphylococcus aureus nhạy methicillin",

    aliases: [
      "MSSA",
    ],

    group:
      "Gram dương",

    sites: [
      "Bacteremia",
      "Da-mô mềm",
      "Xương-khớp",
      "Nội tâm mạc",
    ],

    preferred: [
      {
        title:
          "Nhiễm xâm lấn MSSA",

        drugs: [
          "Oxacillin/nafcillin",

          "HOẶC cefazolin theo vị trí nhiễm và guideline",
        ],

        sources: [
          {
            sourceId:
              "IDSA_SAB_2026",
          },
        ],
      },
    ],

    avoid: [
      "Vancomycin không phải lựa chọn tối ưu cho MSSA bacteremia khi dùng được beta-lactam thích hợp.",
    ],

    notes: [
      "SAB 2026: lấy cấy máu theo dõi để xác nhận clearance.",
      "Tìm ổ nhiễm sâu/di căn.",
    ],

    sources: [
      {
        sourceId:
          "IDSA_SAB_2026",
      },
    ],
  },

  {
    id:
      "mrsa",

    name:
      "Staphylococcus aureus kháng methicillin",

    aliases: [
      "MRSA",
    ],

    group:
      "Gram dương",

    resistance:
      "MRSA",

    sites: [
      "Bacteremia",
      "Pneumonia",
      "Da-mô mềm",
      "Xương-khớp",
    ],

    preferred: [
      {
        title:
          "Bacteremia",

        drugs: [
          "Vancomycin theo AUC/TDM",

          "HOẶC daptomycin khi phù hợp",
        ],

        sources: [
          {
            sourceId:
              "IDSA_SAB_2026",
          },
        ],
      },

      {
        title:
          "MRSA pneumonia",

        drugs: [
          "Vancomycin",

          "HOẶC linezolid",
        ],

        sources: [
          {
            sourceId:
              "ATS_IDSA_HAP_VAP_2016",
          },
        ],
      },
    ],

    avoid: [
      "Không dùng daptomycin cho pneumonia.",
    ],

    notes: [
      "Đánh giá source control.",
      "Theo dõi clearance cấy máu trong SAB.",
    ],

    sources: [
      {
        sourceId:
          "IDSA_SAB_2026",
      },
    ],
  },

  {
    id:
      "enterococcus",

    name:
      "Enterococcus spp.",

    aliases: [
      "E. faecalis",
      "E. faecium",
      "VRE",
    ],

    group:
      "Gram dương",

    sites: [
      "UTI",
      "Ổ bụng",
      "Bacteremia",
      "Endocarditis",
    ],

    preferred: [
      {
        title:
          "Nhạy ampicillin",

        drugs: [
          "Ampicillin/amoxicillin khi vị trí nhiễm phù hợp.",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },
        ],
      },

      {
        title:
          "VRE / kháng ampicillin",

        drugs: [
          "Linezolid",

          "HOẶC daptomycin liều thích hợp theo vị trí nhiễm",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },
        ],
      },
    ],

    avoid: [
      "Cephalosporin không có vai trò điều trị Enterococcus.",
    ],

    notes: [
      "Phân biệt E. faecalis và E. faecium.",
    ],

    sources: [
      {
        sourceId:
          "UMC_2023",
      },
    ],
  },

  {
    id:
      "pneumococcus",

    name:
      "Streptococcus pneumoniae",

    aliases: [
      "Phế cầu",
    ],

    group:
      "Gram dương",

    sites: [
      "CAP",
      "Meningitis",
      "Bacteremia",
    ],

    preferred: [
      {
        title:
          "CAP",

        drugs: [
          "Beta-lactam theo mức độ bệnh và AST.",

          "CAP nội trú/nặng: phối hợp macrolide khi phù hợp guideline.",
        ],

        sources: [
          {
            sourceId:
              "ATS_IDSA_CAP_2019",
          },
        ],
      },

      {
        title:
          "Meningitis",

        drugs: [
          "Điều trị theo breakpoint CNS và phác đồ viêm màng não.",
        ],

        sources: [
          {
            sourceId:
              "XANH_PON_2025",
          },
        ],
      },
    ],

    notes: [
      "Breakpoint phụ thuộc vị trí nhiễm, đặc biệt CNS.",
    ],

    sources: [
      {
        sourceId:
          "XANH_PON_2025",
      },
    ],
  },

  {
    id:
      "bacteroides",

    name:
      "Bacteroides fragilis group",

    aliases: [
      "B. fragilis",
    ],

    group:
      "Kỵ khí",

    sites: [
      "Ổ bụng",
      "Áp xe",
      "Nhiễm đa vi khuẩn",
    ],

    preferred: [
      {
        title:
          "Phủ kỵ khí",

        drugs: [
          "Metronidazole",

          "HOẶC beta-lactam/beta-lactamase inhibitor có hoạt tính kỵ khí",

          "HOẶC carbapenem khi có chỉ định",
        ],

        sources: [
          {
            sourceId:
              "UMC_2023",
          },

          {
            sourceId:
              "IDSA_IAI_2024",
          },
        ],
      },
    ],

    notes: [
      "Source control là yếu tố quyết định trong abscess/cIAI.",
    ],

    sources: [
      {
        sourceId:
          "IDSA_IAI_2024",
      },
    ],
  },
];

export const empiricCategories = [
  "Tất cả",
  "Nhiễm khuẩn huyết",
  "Hô hấp",
  "Tiết niệu",
  "Ổ bụng - hệ mật",
  "Da - mô mềm",
  "Thần kinh",
  "Xương - khớp",
  "Tim mạch",
] as const;

export const pathogenGroups = [
  "Tất cả",
  "Gram âm",
  "Gram dương",
  "Kỵ khí",
  "Không điển hình",
] as const;