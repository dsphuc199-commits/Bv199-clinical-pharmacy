/* =========================================================
   PK/PD ANTIBIOTICS - BV199

   Nguồn nền:
   - Bộ Y tế: QĐ 708/QĐ-BYT
   - Bộ Y tế: QĐ 5631/QĐ-BYT
   - CLSI M100 Ed36 (2026)
   - ACCP/IDSA/ESCMID/SCCM/SIDP prolonged infusion consensus
   - IDSA AMR Guidance 2026
   - ASHP/IDSA/PIDS/SIDP Vancomycin Consensus

   Lưu ý:
   - Breakpoint S/I/R phải theo CLSI hiện hành.
   - PK/PD target không thay thế breakpoint CLSI.
   - Không tự suy diễn MIC từ S/I/R.
========================================================= */

export type PkPdIndex =
  | "fT>MIC"
  | "fAUC/MIC"
  | "AUC24/MIC"
  | "Cmax/MIC";

export type AntibioticPkPd = {
  id: string;

  name: string;

  group: string;

  pkpdIndex: PkPdIndex;

  principle: string;

  targetLabel: string;

  targetValue?: {
    min?: number;
    max?: number;
    unit: string;
  };

  clinicalMeaning: string;

  optimization: string[];

  tdmRecommended: boolean;

  renalAdjustment: boolean;

  clsiNote: string;

  sources: {
    organization: string;
    title: string;
    year: number;
    url: string;
  }[];
};

/* =========================================================
   SOURCES
========================================================= */

export const pkpdSources = [
  {
    id: "byt-708",
    organization: "Bộ Y tế",
    title:
      "Tài liệu Hướng dẫn sử dụng kháng sinh – Quyết định 708/QĐ-BYT",
    year: 2015,
    url:
      "https://kcb.vn/van-ban/tai-lieu-huong-dan-su-dung-khang-sinh.html",
  },

  {
    id: "byt-5631",
    organization: "Bộ Y tế",
    title:
      "Hướng dẫn thực hiện quản lý sử dụng kháng sinh trong bệnh viện – Quyết định 5631/QĐ-BYT",
    year: 2020,
    url:
      "https://thuvienphapluat.vn/van-ban/The-thao-Y-te/Quyet-dinh-5631-QD-BYT-2020-tai-lieu-Huong-dan-quan-ly-su-dung-khang-sinh-trong-benh-vien-461349.aspx",
  },

  {
    id: "clsi-m100-36",
    organization: "CLSI",
    title:
      "M100: Performance Standards for Antimicrobial Susceptibility Testing, 36th Edition",
    year: 2026,
    url:
      "https://clsi.org/shop/standards/m100/",
  },

  {
    id: "clsi-bit",
    organization: "CLSI",
    title:
      "Breakpoint Implementation Toolkit – updated March 2026",
    year: 2026,
    url:
      "https://clsi.org/resources/breakpoint-implementation-toolkit/",
  },

  {
    id: "beta-lactam-pi",
    organization:
      "ACCP / IDSA / ESCMID / SCCM / SIDP",
    title:
      "International Consensus Recommendations for the Use of Prolonged-Infusion Beta-Lactam Antibiotics",
    year: 2023,
    url:
      "https://www.idsociety.org/practice-guideline/accp_prolonged_infusion_beta_lactums/",
  },

  {
    id: "idsa-amr-2026",
    organization: "IDSA",
    title:
      "IDSA 2026 Guidance on the Treatment of Antimicrobial Resistant Gram-Negative Infections",
    year: 2026,
    url:
      "https://www.idsociety.org/practice-guideline/amr-guidance",
  },

  {
    id: "vanco-2020",
    organization:
      "ASHP / IDSA / PIDS / SIDP",
    title:
      "Therapeutic Monitoring of Vancomycin for Serious MRSA Infections",
    year: 2020,
    url:
      "https://pubmed.ncbi.nlm.nih.gov/32227354/",
  },
];

/* =========================================================
   PK/PD DATABASE
========================================================= */

export const antibioticPkPd:
  AntibioticPkPd[] = [

    /* =====================================================
       MEROPENEM
    ===================================================== */

    {
      id: "meropenem",

      name: "Meropenem",

      group:
        "Carbapenem / β-lactam",

      pkpdIndex:
        "fT>MIC",

      principle:
        "Hiệu quả diệt khuẩn của β-lactam liên quan chủ yếu đến thời gian nồng độ thuốc tự do duy trì trên MIC trong khoảng liều.",

      targetLabel:
        "Mục tiêu PK/PD được lựa chọn theo bối cảnh lâm sàng; ở người bệnh nặng thường cần tối ưu mức phơi nhiễm cao hơn mục tiêu tối thiểu.",

      clinicalMeaning:
        "MIC tăng hoặc độ thanh thải thuốc tăng có thể làm giảm thời gian nồng độ tự do trên MIC.",

      optimization: [
        "Đảm bảo liều nạp/khởi đầu phù hợp trong nhiễm khuẩn nặng.",
        "Cân nhắc truyền kéo dài để tăng fT>MIC.",
        "Hiệu chỉnh liều duy trì theo chức năng thận.",
        "Xem xét MIC thực tế của tác nhân.",
        "Đối chiếu breakpoint CLSI M100 hiện hành.",
      ],

      tdmRecommended:
        false,

      renalAdjustment:
        true,

      clsiNote:
        "S/I/R phải được lấy từ AST và breakpoint CLSI M100 Ed36; không suy ra S/I/R chỉ từ mô phỏng PK/PD.",

      sources: [
        {
          organization:
            "Bộ Y tế",
          title:
            "Hướng dẫn sử dụng kháng sinh – QĐ 708/QĐ-BYT",
          year: 2015,
          url:
            "https://kcb.vn/van-ban/tai-lieu-huong-dan-su-dung-khang-sinh.html",
        },

        {
          organization:
            "ACCP/IDSA/ESCMID/SCCM/SIDP",
          title:
            "International Consensus Recommendations for Prolonged-Infusion Beta-Lactams",
          year: 2023,
          url:
            "https://www.idsociety.org/practice-guideline/accp_prolonged_infusion_beta_lactums/",
        },

        {
          organization:
            "IDSA",
          title:
            "AMR Guidance",
          year: 2026,
          url:
            "https://www.idsociety.org/practice-guideline/amr-guidance",
        },

        {
          organization:
            "CLSI",
          title:
            "M100 Ed36",
          year: 2026,
          url:
            "https://clsi.org/shop/standards/m100/",
        },
      ],
    },

    /* =====================================================
       PIPERACILLIN/TAZOBACTAM
    ===================================================== */

    {
      id:
        "piperacillin-tazobactam",

      name:
        "Piperacillin/tazobactam",

      group:
        "Penicillin kháng Pseudomonas / β-lactam",

      pkpdIndex:
        "fT>MIC",

      principle:
        "Là β-lactam phụ thuộc thời gian; hiệu quả liên quan thời gian nồng độ tự do trên MIC.",

      targetLabel:
        "Tối ưu fT>MIC; mục tiêu cụ thể phụ thuộc mức độ nặng và chiến lược điều trị.",

      clinicalMeaning:
        "Truyền kéo dài có thể tăng xác suất đạt mục tiêu PK/PD, đặc biệt khi MIC cao hoặc PK biến thiên.",

      optimization: [
        "Đánh giá CrCl.",
        "Cân nhắc truyền kéo dài ở người bệnh nặng.",
        "Đối chiếu MIC và AST.",
        "Đánh giá nguy cơ Pseudomonas.",
      ],

      tdmRecommended:
        false,

      renalAdjustment:
        true,

      clsiNote:
        "Biện giải AST theo CLSI M100 phiên bản đang áp dụng tại BV199.",

      sources: [
        {
          organization:
            "ACCP/IDSA/ESCMID/SCCM/SIDP",
          title:
            "Prolonged-Infusion Beta-Lactam Consensus",
          year: 2023,
          url:
            "https://www.idsociety.org/practice-guideline/accp_prolonged_infusion_beta_lactums/",
        },

        {
          organization:
            "CLSI",
          title:
            "M100 Ed36",
          year: 2026,
          url:
            "https://clsi.org/shop/standards/m100/",
        },
      ],
    },

    /* =====================================================
       CEFEPIME
    ===================================================== */

    {
      id: "cefepime",

      name: "Cefepime",

      group:
        "Cephalosporin thế hệ 4",

      pkpdIndex:
        "fT>MIC",

      principle:
        "Cefepime là β-lactam phụ thuộc thời gian.",

      targetLabel:
        "Tối ưu thời gian nồng độ tự do trên MIC.",

      clinicalMeaning:
        "Cần đặc biệt chú ý tích lũy thuốc khi suy thận do nguy cơ độc tính thần kinh.",

      optimization: [
        "Hiệu chỉnh liều theo chức năng thận.",
        "Có thể cân nhắc truyền kéo dài ở bối cảnh phù hợp.",
        "Theo dõi độc tính thần kinh.",
        "Đối chiếu AST/MIC.",
      ],

      tdmRecommended:
        false,

      renalAdjustment:
        true,

      clsiNote:
        "Phân loại S/I/R sử dụng breakpoint CLSI, không dùng ngưỡng PK/PD thay thế breakpoint.",

      sources: [
        {
          organization:
            "ACCP/IDSA/ESCMID/SCCM/SIDP",
          title:
            "Prolonged-Infusion Beta-Lactam Consensus",
          year: 2023,
          url:
            "https://www.idsociety.org/practice-guideline/accp_prolonged_infusion_beta_lactums/",
        },

        {
          organization:
            "CLSI",
          title:
            "M100 Ed36",
          year: 2026,
          url:
            "https://clsi.org/shop/standards/m100/",
        },
      ],
    },

    /* =====================================================
       VANCOMYCIN
    ===================================================== */

    {
      id: "vancomycin",

      name: "Vancomycin",

      group:
        "Glycopeptide",

      pkpdIndex:
        "AUC24/MIC",

      principle:
        "Chỉ số liên quan hiệu quả và an toàn tốt nhất trong điều trị nhiễm MRSA nặng là AUC24/MIC.",

      targetLabel:
        "AUC24/MIC 400–600 khi MIC BMD = 1 mg/L đối với nhiễm MRSA nặng.",

      targetValue: {
        min: 400,
        max: 600,
        unit:
          "AUC24/MIC",
      },

      clinicalMeaning:
        "Phơi nhiễm dưới mục tiêu có nguy cơ giảm hiệu quả; phơi nhiễm quá cao làm tăng nguy cơ độc tính thận.",

      optimization: [
        "Ưu tiên theo dõi AUC thay vì chỉ trough ở nhiễm MRSA nặng.",
        "Đánh giá chức năng thận.",
        "Thực hiện TDM.",
        "Kiểm tra MIC và phương pháp xác định MIC.",
      ],

      tdmRecommended:
        true,

      renalAdjustment:
        true,

      clsiNote:
        "MIC dùng trong tỷ số AUC/MIC không thay thế việc phân loại AST theo CLSI.",

      sources: [
        {
          organization:
            "ASHP/IDSA/PIDS/SIDP",
          title:
            "Vancomycin Therapeutic Monitoring Consensus Guideline",
          year: 2020,
          url:
            "https://pubmed.ncbi.nlm.nih.gov/32227354/",
        },

        {
          organization:
            "CLSI",
          title:
            "M100 Ed36",
          year: 2026,
          url:
            "https://clsi.org/shop/standards/m100/",
        },
      ],
    },

    /* =====================================================
       AMIKACIN
    ===================================================== */

    {
      id: "amikacin",

      name: "Amikacin",

      group:
        "Aminoglycoside",

      pkpdIndex:
        "Cmax/MIC",

      principle:
        "Aminoglycoside có đặc điểm diệt khuẩn phụ thuộc nồng độ; mức đỉnh so với MIC là một chỉ số PK/PD quan trọng.",

      targetLabel:
        "Mục tiêu phải được xác định theo chỉ định, MIC và quy trình TDM của bệnh viện.",

      clinicalMeaning:
        "Nồng độ đỉnh không đủ có thể làm giảm khả năng diệt khuẩn; tích lũy làm tăng độc tính thận và tai.",

      optimization: [
        "Cá thể hóa liều theo cân nặng và chức năng thận.",
        "TDM khi có chỉ định.",
        "Theo dõi độc tính thận và tai.",
        "Đối chiếu MIC.",
      ],

      tdmRecommended:
        true,

      renalAdjustment:
        true,

      clsiNote:
        "AST phải sử dụng breakpoint CLSI tương ứng loài vi khuẩn và thuốc.",

      sources: [
        {
          organization:
            "Bộ Y tế",
          title:
            "Hướng dẫn sử dụng kháng sinh – QĐ 708/QĐ-BYT",
          year: 2015,
          url:
            "https://kcb.vn/van-ban/tai-lieu-huong-dan-su-dung-khang-sinh.html",
        },

        {
          organization:
            "CLSI",
          title:
            "M100 Ed36",
          year: 2026,
          url:
            "https://clsi.org/shop/standards/m100/",
        },
      ],
    },

    /* =====================================================
       CIPROFLOXACIN
    ===================================================== */

    {
      id:
        "ciprofloxacin",

      name:
        "Ciprofloxacin",

      group:
        "Fluoroquinolone",

      pkpdIndex:
        "fAUC/MIC",

      principle:
        "Fluoroquinolone có hiệu quả liên quan tổng phơi nhiễm của thuốc so với MIC.",

      targetLabel:
        "Mục tiêu AUC/MIC phụ thuộc tác nhân và bối cảnh lâm sàng; không sử dụng một ngưỡng duy nhất cho mọi trường hợp.",

      clinicalMeaning:
        "MIC tăng làm giảm AUC/MIC ở cùng một chế độ liều.",

      optimization: [
        "Đánh giá chức năng thận.",
        "Xem MIC và vị trí nhiễm.",
        "Theo dõi tương tác và nguy cơ kéo dài QT.",
      ],

      tdmRecommended:
        false,

      renalAdjustment:
        true,

      clsiNote:
        "S/I/R phải lấy theo CLSI M100; không suy diễn từ AUC/MIC giả định.",

      sources: [
        {
          organization:
            "Bộ Y tế",
          title:
            "Hướng dẫn sử dụng kháng sinh – QĐ 708/QĐ-BYT",
          year: 2015,
          url:
            "https://kcb.vn/van-ban/tai-lieu-huong-dan-su-dung-khang-sinh.html",
        },

        {
          organization:
            "CLSI",
          title:
            "M100 Ed36",
          year: 2026,
          url:
            "https://clsi.org/shop/standards/m100/",
        },
      ],
    },
  ];

/* =========================================================
   UTILS
========================================================= */

export function getPkPdDrug(
  id: string
) {
  return antibioticPkPd.find(
    (
      drug
    ) =>
      drug.id === id
  );
}