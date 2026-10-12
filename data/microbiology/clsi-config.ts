/* =========================================================
   CLSI CONFIGURATION
   BỆNH VIỆN 199

   Chuẩn sử dụng:
   CLSI M100, 36th Edition, 2026

   LƯU Ý:
   - S = Susceptible = Nhạy
   - I = Intermediate = Trung gian
   - R = Resistant = Kháng

   - S + I KHÔNG được gọi là "tỷ lệ nhạy".
   - Breakpoint CLSI dùng để biện giải AST.
   - PK/PD không thay thế breakpoint CLSI.
========================================================= */

export const clsiConfig = {
  standard: "CLSI",

  document: "M100",

  edition: 36,

  year: 2026,

  hospital:
    "Bệnh viện 199 – Bộ Công an",

  interpretation: {
    S: {
      code: "S",

      label:
        "Susceptible",

      labelVi:
        "Nhạy",

      description:
        "Chủng vi khuẩn được phân loại nhạy theo breakpoint CLSI tương ứng.",
    },

    I: {
      code: "I",

      label:
        "Intermediate",

      labelVi:
        "Trung gian",

      description:
        "Chủng vi khuẩn thuộc mức trung gian theo breakpoint CLSI tương ứng.",
    },

    R: {
      code: "R",

      label:
        "Resistant",

      labelVi:
        "Kháng",

      description:
        "Chủng vi khuẩn được phân loại kháng theo breakpoint CLSI tương ứng.",
    },
  },

  reportingRules: {
    susceptible:
      "%S được sử dụng để biểu thị tỷ lệ nhạy.",

    intermediate:
      "%I phải được hiển thị riêng.",

    resistant:
      "%R phải được hiển thị riêng.",

    sPlusI:
      "S+I chỉ được sử dụng như chỉ số thống kê bổ sung, không được gọi là tỷ lệ nhạy.",
  },

  pkpdRules: {
    mic:
      "MIC là nồng độ ức chế tối thiểu của kháng sinh đối với vi khuẩn.",

    breakpoint:
      "Breakpoint CLSI được sử dụng để phân loại AST thành S, I hoặc R.",

    pkpd:
      "PK/PD đánh giá mối liên quan giữa mức phơi nhiễm của kháng sinh và MIC.",

    warning:
      "Không sử dụng PK/PD để thay thế breakpoint CLSI.",
  },

  source: {
    organization:
      "Clinical and Laboratory Standards Institute",

    title:
      "M100: Performance Standards for Antimicrobial Susceptibility Testing",

    edition:
      "36th Edition",

    year:
      2026,

    url:
      "https://clsi.org/shop/standards/m100/",
  },
} as const;

export type AstCategory =
  | "S"
  | "I"
  | "R";

export function getAstInterpretation(
  category: AstCategory
) {
  return clsiConfig.interpretation[
    category
  ];
}