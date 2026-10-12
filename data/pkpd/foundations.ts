import type {
  PKPDModule,
} from "@/lib/types/pkpd";

export const foundationsModule:
  PKPDModule = {

  slug:
    "foundations",

  title:
    "Nền tảng PK/PD kháng sinh",

  shortTitle:
    "Nền tảng PK/PD",

  category:
    "foundation",

  description:
    "Hệ thống hóa các khái niệm nền tảng về dược động học, dược lực học và các chỉ số PK/PD của kháng sinh.",

  objectives: [
    "Phân biệt vai trò của PK và PD trong sử dụng kháng sinh.",
    "Hiểu các khái niệm MIC, MBC và PAE.",
    "Hiểu các thông số PK gồm Vd, CL, t1/2, Cmax, Cmin và AUC.",
    "Phân biệt các chỉ số fT>MIC, Cmax/MIC và AUC24/MIC.",
    "Liên hệ các chỉ số PK/PD với chiến lược tối ưu hóa chế độ liều.",
  ],

  keywords: [
    "PK",
    "PD",
    "MIC",
    "MBC",
    "PAE",
    "Vd",
    "CL",
    "t1/2",
    "Cmax",
    "Cmin",
    "AUC",
    "fT>MIC",
    "Cmax/MIC",
    "AUC24/MIC",
  ],

  originalLecture: {

    title:
      "PK/PD CỦA KHÁNG SINH - Tổng quan và phương pháp xác định",

    sourceId:
      "lecture-pkpd-overview-2026",

    blocks: [

      {
        id:
          "foundation-objective",

        sourceId:
          "lecture-pkpd-overview-2026",

        page: 6,

        heading:
          "Các mảnh ghép trong điều trị với kháng sinh",

        lines: [
          "Dược động học (PK) / Dược lực học (PD) đối với kháng sinh:",
          "Tối đa hóa hiệu quả điều trị",
          "Giảm độc tính của thuốc KS",
          "Ngăn ngừa xuất hiện VK đề kháng KS",
        ],
      },

      {
        id:
          "foundation-mic-mbc",

        sourceId:
          "lecture-pkpd-overview-2026",

        page: 6,

        heading:
          "Dược lực học (Pharmacodynamics - PD)",

        lines: [
          "MIC vs MBC: thông số chủ yếu để xác định hiệu lực kháng khuẩn in vitro của kháng sinh đối với các chủng VK",
          "MIC (Minimum Inhibitory Concentration)",
          "Nồng độ tối thiểu của KS gây ức chế sự tăng trưởng của vi khuẩn ở mức có thể quan sát được.",
          "MBC (Minimum Bactericidal Concentration)",
          "Nồng độ tối thiểu cần thiết để tiêu diệt vi khuẩn.",
          "MBC/MIC ≥ 4  Kháng sinh có hiệu lực kìm khuẩn",
          "MBC/MIC =1  Kháng sinh có hiệu lực diệt khuẩn",
        ],
      },

      {
        id:
          "foundation-mic-limit",

        sourceId:
          "lecture-pkpd-overview-2026",

        page: 8,

        heading:
          "Hạn chế của MIC",

        lines: [
          "Khó dự đoán đáp ứng lâm sàng do:",
          "- Ảnh hưởng bởi tỷ lệ gắn của kháng sinh với protein huyết tương",
          "- Môi trường tại mô nhiễm: mức độ toan, lượng oxy",
          "- Tải lượng vi khuẩn",
          "- Tình trạng đề kháng",
          "- Hiệu ứng chủng",
          "Thử nghiệm xác định MIC trong môi trường “nhân tạo”, nồng độ kháng sinh không thay đổi theo thời gian",
        ],
      },

      {
        id:
          "foundation-time-vs-concentration",

        sourceId:
          "lecture-pkpd-overview-2026",

        page: 8,

        heading:
          "KS phụ thuộc thời gian vs nồng độ",

        lines: [
          "Kháng sinh phụ thuộc nồng độ: tốc độ và mức độ diệt khuẩn phụ thuộc vào nồng độ kháng sinh trong máu.",
          "Ví dụ: Aminoglycosid, fluoroquinolon",
          "Kháng sinh phụ thuộc thời gian: tốc độ và mức độ diệt khuẩn phụ thuộc chủ yếu vào thời gian vi khuẩn tiếp xúc với kháng sinh.",
          "Ví dụ: β-lactam, glycopeptid",
        ],
      },

      {
        id:
          "foundation-pae",

        sourceId:
          "lecture-pkpd-overview-2026",

        page: 9,

        heading:
          "PAE: Post-Antibiotic Effect",

        lines: [
          "In vitro: thời gian cần thiết để VK hồi phục về số lượng sau khi tiếp xúc với kháng sinh.",
          "In vivo: sự khác biệt về thời gian để VK ↑10 lần/nhóm điều trị KS vs nhóm không điều trị, tính từ lúc [thuốc]/máu, mô nhiễm giảm < MIC.",
        ],
      },
    ],
  },

  evidenceUpdates: [
    {
      id:
        "foundation-current-ast",

      title:
        "Diễn giải MIC theo tiêu chuẩn hiện hành",

      statement:
        "Khi sử dụng MIC trong thực hành lâm sàng, cần đối chiếu với breakpoint và phương pháp thử độ nhạy đang được áp dụng tại cơ sở xét nghiệm.",

      sourceIds: [
        "clsi-m100-2026",
        "eucast-breakpoints-2026",
      ],

      evidenceLevel:
        "guideline",

      updatedAt:
        "2026-10",
    },

    {
      id:
        "foundation-beta-lactam",

      title:
        "β-lactam và fT>MIC",

      statement:
        "Đối với β-lactam, mức độ giảm tải lượng vi khuẩn liên quan đến thời gian nồng độ thuốc tự do duy trì trên MIC trong khoảng liều.",

      sourceIds: [
        "beta-lactam-consensus-2023",
      ],

      evidenceLevel:
        "consensus",

      updatedAt:
        "2026-10",
    },
  ],

  learningPoints: [
    {
      id:
        "learning-pk",

      title:
        "Dược động học — PK",

      explanation:
        "PK mô tả sự thay đổi nồng độ thuốc trong cơ thể theo thời gian.",

      clinicalMeaning:
        "Các thông số PK như Vd, CL và t1/2 quyết định nồng độ và mức phơi nhiễm thuốc ở từng người bệnh.",

      remember:
        "PK giúp trả lời: nồng độ thuốc trong cơ thể sẽ thay đổi như thế nào?",
    },

    {
      id:
        "learning-pd",

      title:
        "Dược lực học — PD",

      explanation:
        "PD mô tả mối quan hệ giữa phơi nhiễm kháng sinh và tác động lên vi khuẩn.",

      clinicalMeaning:
        "MIC, MBC và PAE là các khái niệm quan trọng khi đánh giá đặc tính dược lực của kháng sinh.",

      remember:
        "PD giúp trả lời: mức phơi nhiễm thuốc đó tạo ra hiệu quả kháng khuẩn như thế nào?",
    },

    {
      id:
        "learning-combine",

      title:
        "PK + PD",

      explanation:
        "PK và PD được kết hợp để liên hệ nồng độ thuốc ở người bệnh với độ nhạy của vi khuẩn.",

      clinicalMeaning:
        "Từ đó hình thành các chỉ số như fT>MIC, Cmax/MIC và AUC24/MIC.",

      remember:
        "PK/PD là cầu nối giữa người bệnh — thuốc — vi khuẩn.",
    },
  ],

  formulas: [
    {
      id:
        "formula-cmax-mic",

      name:
        "Cmax/MIC",

      formula:
        "Cmax ÷ MIC",

      numerator:
        "Nồng độ đỉnh",

      denominator:
        "MIC",

      interpretation:
        "Phản ánh mức nồng độ đỉnh đạt được so với MIC.",
    },

    {
      id:
        "formula-ft-mic",

      name:
        "fT>MIC",

      formula:
        "Thời gian nồng độ thuốc tự do > MIC / khoảng liều × 100%",

      numerator:
        "Thời gian nồng độ thuốc tự do vượt MIC",

      denominator:
        "Khoảng liều",

      interpretation:
        "Phản ánh tỷ lệ thời gian trong một khoảng liều mà nồng độ thuốc tự do duy trì trên MIC.",
    },

    {
      id:
        "formula-auc-mic",

      name:
        "AUC24/MIC",

      formula:
        "AUC24 ÷ MIC",

      numerator:
        "Tổng phơi nhiễm thuốc trong 24 giờ",

      denominator:
        "MIC",

      interpretation:
        "Phản ánh tổng phơi nhiễm kháng sinh trong 24 giờ so với MIC.",
    },
  ],

  quiz: [
    {
      id:
        "foundation-q1",

      question:
        "Thông số nào phản ánh tổng mức phơi nhiễm thuốc trong 24 giờ so với MIC?",

      options: [
        "Cmax/MIC",
        "AUC24/MIC",
        "T1/2",
        "Vd",
      ],

      answer:
        1,

      explanation:
        "AUC24/MIC liên hệ tổng mức phơi nhiễm thuốc trong 24 giờ với MIC.",

      sourceIds: [
        "lecture-time-dependent-2026",
      ],
    },

    {
      id:
        "foundation-q2",

      question:
        "Thông số PK/PD quan trọng đối với β-lactam là gì?",

      options: [
        "Cmax/MIC",
        "fT>MIC",
        "Cmin đơn độc",
        "Vd/MIC",
      ],

      answer:
        1,

      explanation:
        "β-lactam có đặc tính diệt khuẩn phụ thuộc thời gian; fT>MIC là chỉ số PK/PD trọng tâm.",

      sourceIds: [
        "lecture-time-dependent-2026",
        "beta-lactam-consensus-2023",
      ],
    },
  ],

  references: [
    "lecture-pkpd-overview-2026",
    "lecture-time-dependent-2026",
    "beta-lactam-consensus-2023",
    "clsi-m100-2026",
    "eucast-breakpoints-2026",
  ],
};