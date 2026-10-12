export type RenalDoseRange = {
  label: string;

  minCrCl?: number;
  maxCrCl?: number;

  minInclusive?: boolean;
  maxInclusive?: boolean;

  dose: string;
  interval: string;

  note?: string;
};

export type RenalDoseProfile = {
  id: string;

  ingredientId: string;

  ingredientName: string;

  /*
   * Dùng để nhận diện những ingredientId
   * khác nhau nhưng cùng một hoạt chất.
   */
  keywords: string[];

  indicationId: string;

  indicationLabel: string;

  normalDose: string;

  normalInterval: string;

  route?: string;

  ranges: RenalDoseRange[];

  dialysisNote?: string;

  source: {
    organization: string;
    title: string;
    year: number;
    url: string;
  };
};

/* =========================================================
   DATABASE HIỆU CHỈNH LIỀU
   Chỉ đưa dữ liệu đã được thẩm định vào đây.
========================================================= */

export const renalDosingDatabase: RenalDoseProfile[] = [
  /* =======================================================
     MEROPENEM
     FDA MERREM IV Prescribing Information 2025
  ======================================================= */

  {
    id: "meropenem-csssi",

    ingredientId: "meropenem",

    ingredientName: "Meropenem",

    keywords: [
      "meropenem",
      "meropenem trihydrat",
      "meropenem trihydrate",
    ],

    indicationId: "csssi",

    indicationLabel:
      "Nhiễm khuẩn da và cấu trúc da phức tạp",

    normalDose: "500 mg",

    normalInterval: "Mỗi 8 giờ",

    route: "IV",

    ranges: [
      {
        label: "CrCl > 50 mL/phút",

        minCrCl: 50,

        minInclusive: false,

        dose: "500 mg",

        interval: "Mỗi 8 giờ",

        note:
          "Liều khuyến cáo ở chức năng thận không cần hiệu chỉnh.",
      },

      {
        label: "CrCl 26–50 mL/phút",

        minCrCl: 26,
        maxCrCl: 50,

        minInclusive: true,
        maxInclusive: true,

        dose: "500 mg",

        interval: "Mỗi 12 giờ",
      },

      {
        label: "CrCl 10–25 mL/phút",

        minCrCl: 10,
        maxCrCl: 25,

        minInclusive: true,
        maxInclusive: true,

        dose: "250 mg",

        interval: "Mỗi 12 giờ",

        note:
          "Một nửa liều khuyến cáo.",
      },

      {
        label: "CrCl < 10 mL/phút",

        maxCrCl: 10,

        maxInclusive: false,

        dose: "250 mg",

        interval: "Mỗi 24 giờ",

        note:
          "Một nửa liều khuyến cáo.",
      },
    ],

    dialysisNote:
      "Nhãn MERREM IV ghi nhận chưa đủ thông tin để đưa ra khuyến cáo chuẩn cho người bệnh thẩm tách máu hoặc thẩm phân phúc mạc.",

    source: {
      organization:
        "U.S. Food and Drug Administration",

      title:
        "MERREM IV Prescribing Information",

      year: 2025,

      url:
        "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/050706s045lbl.pdf",
    },
  },

  {
    id: "meropenem-ciai",

    ingredientId: "meropenem",

    ingredientName: "Meropenem",

    keywords: [
      "meropenem",
      "meropenem trihydrat",
      "meropenem trihydrate",
    ],

    indicationId: "ciai",

    indicationLabel:
      "Nhiễm khuẩn ổ bụng phức tạp",

    normalDose: "1 g",

    normalInterval: "Mỗi 8 giờ",

    route: "IV",

    ranges: [
      {
        label: "CrCl > 50 mL/phút",

        minCrCl: 50,

        minInclusive: false,

        dose: "1 g",

        interval: "Mỗi 8 giờ",
      },

      {
        label: "CrCl 26–50 mL/phút",

        minCrCl: 26,
        maxCrCl: 50,

        minInclusive: true,
        maxInclusive: true,

        dose: "1 g",

        interval: "Mỗi 12 giờ",
      },

      {
        label: "CrCl 10–25 mL/phút",

        minCrCl: 10,
        maxCrCl: 25,

        minInclusive: true,
        maxInclusive: true,

        dose: "500 mg",

        interval: "Mỗi 12 giờ",

        note:
          "Một nửa liều khuyến cáo.",
      },

      {
        label: "CrCl < 10 mL/phút",

        maxCrCl: 10,

        maxInclusive: false,

        dose: "500 mg",

        interval: "Mỗi 24 giờ",

        note:
          "Một nửa liều khuyến cáo.",
      },
    ],

    dialysisNote:
      "Nhãn MERREM IV ghi nhận chưa đủ thông tin để đưa ra khuyến cáo chuẩn cho người bệnh thẩm tách máu hoặc thẩm phân phúc mạc.",

    source: {
      organization:
        "U.S. Food and Drug Administration",

      title:
        "MERREM IV Prescribing Information",

      year: 2025,

      url:
        "https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/050706s045lbl.pdf",
    },
  },
];