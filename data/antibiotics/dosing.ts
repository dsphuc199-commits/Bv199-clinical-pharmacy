export type AntibioticDoseRule = {
  ingredientId: string;
  ingredientName: string;

  indicationId: string;
  indicationLabel: string;

  dose: string;
  interval: string;
  route: string;

  infusion?: string;

  renal?: {
    minCrCl?: number;
    maxCrCl?: number;
    dose: string;
    interval: string;
    note?: string;
  }[];

  pkpdTarget?: string;

  source: {
    organization: string;
    title: string;
    year: number;
    url?: string;
  };
};

export const antibioticDoseRules: AntibioticDoseRule[] = [
  {
    ingredientId: "meropenem",
    ingredientName: "Meropenem",

    indicationId: "severe-infection",
    indicationLabel: "Nhiễm khuẩn nặng",

    dose: "1 g",
    interval: "Mỗi 8 giờ",
    route: "IV",

    infusion:
      "Có thể cân nhắc truyền kéo dài theo mục tiêu PK/PD trong nhiễm khuẩn nặng.",

    renal: [
      {
        minCrCl: 51,
        dose: "1 g",
        interval: "Mỗi 8 giờ",
      },
      {
        minCrCl: 26,
        maxCrCl: 50,
        dose: "1 g",
        interval: "Mỗi 12 giờ",
      },
      {
        minCrCl: 10,
        maxCrCl: 25,
        dose: "500 mg",
        interval: "Mỗi 12 giờ",
      },
      {
        maxCrCl: 9,
        dose: "500 mg",
        interval: "Mỗi 24 giờ",
      },
    ],

    pkpdTarget: "%fT > MIC",

    source: {
      organization: "FDA",
      title: "MERREM IV Prescribing Information",
      year: 2025,
    },
  },

  {
    ingredientId: "ceftriaxone",
    ingredientName: "Ceftriaxone",

    indicationId: "standard",
    indicationLabel: "Nhiễm khuẩn thông thường",

    dose: "1–2 g",
    interval: "Mỗi 24 giờ",
    route: "IV/IM",

    infusion:
      "Liều phụ thuộc loại và mức độ nhiễm khuẩn.",

    renal: [
      {
        minCrCl: 0,
        dose: "Thường không cần hiệu chỉnh riêng chỉ dựa trên chức năng thận",
        interval: "Theo chỉ định",
        note:
          "Cần thận trọng nếu đồng thời suy gan và suy thận.",
      },
    ],

    source: {
      organization: "Product information",
      title: "Ceftriaxone prescribing information",
      year: 2025,
    },
  },
];