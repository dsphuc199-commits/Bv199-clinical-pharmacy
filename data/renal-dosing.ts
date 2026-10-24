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

  /* ---- Truong bo sung (tuy chon, khong anh huong trang may tinh than) ---- */
  adultDoseText?: string[];
  pediatricDoseText?: string[];
  hepaticNote?: string;
  elderlyNote?: string;

  /*
   * "chua-xac-nhan": da nhap tu nguon nhung CHUA duoc duoc si lam sang BV199 xac nhan.
   * "da-doi-chieu-nguon": da doi chieu lai voi trang nguon (anh trang) boi nguoi nhap.
   * Khong dung gia tri nao co nghia "BV199 phe duyet".
   */
  verification?: "chua-xac-nhan" | "da-doi-chieu-nguon";

  source: {
    organization: string;
    title: string;
    year: number;
    url?: string;
    page?: string;
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

        minCrCl: 25,
        maxCrCl: 50,

        minInclusive: false,
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

        minCrCl: 25,
        maxCrCl: 50,

        minInclusive: false,
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

  /* =======================================================
     MEROPENEM - Duoc thu quoc gia Viet Nam lan xuat ban thu ba (2023)
     Chuyen luan "Meropenem": PDF tr. 1079-1081 (trang in 1086-1087; so trang in = so trang PDF + 6)
     Doi chieu lai bang van ban trich tu PDF; CHUA duoc duoc si lam sang xac nhan.
  ======================================================= */

  {
    id: "meropenem-dtqg2023",

    ingredientId: "meropenem",

    ingredientName: "Meropenem",

    keywords: [
      "meropenem",
      "meropenem trihydrat",
      "meropenem trihydrate",
    ],

    indicationId: "dtqg-adult",

    indicationLabel:
      "Người lớn – viêm phổi, NKTN có biến chứng, NK ổ bụng có biến chứng, NK da – mô mềm (Dược thư 2023)",

    normalDose: "500 mg hoặc 1 g",

    normalInterval: "Mỗi 8 giờ",

    route: "IV",

    adultDoseText: [
      "Viêm phổi (cộng đồng hoặc bệnh viện), nhiễm khuẩn tiết niệu có biến chứng, nhiễm khuẩn trong ổ bụng có biến chứng, nhiễm khuẩn trong và sau sinh, nhiễm khuẩn da và tổ chức dưới da: 500 mg hoặc 1 g, mỗi 8 giờ.",
      "Viêm phế quản phổi ở bệnh nhân xơ nang, viêm màng não: 2 g mỗi 8 giờ.",
      "Sốt do giảm bạch cầu: 1 g mỗi 8 giờ.",
    ],

    pediatricDoseText: [
      "Trẻ 3 tháng – 11 tuổi, < 50 kg: viêm phổi, NKTN có biến chứng, NK ổ bụng có biến chứng, NK sau đẻ, NK da – mô mềm: 10 mg/kg hoặc 20 mg/kg mỗi 8 giờ.",
      "Trẻ 3 tháng – 11 tuổi, < 50 kg: viêm phế quản phổi ở bệnh nhân xơ nang, viêm màng não: 40 mg/kg mỗi 8 giờ.",
      "Trẻ 3 tháng – 11 tuổi, < 50 kg: sốt giảm bạch cầu: 20 mg/kg mỗi 8 giờ.",
      "Trẻ ≥ 50 kg dùng liều như người lớn.",
      "Chưa có kinh nghiệm ở trẻ suy thận.",
    ],

    ranges: [
      {
        label: "CrCl > 50 mL/phút",

        minCrCl: 50,
        minInclusive: false,

        dose: "Liều thông thường",

        interval: "Mỗi 8 giờ",
      },

      {
        label: "CrCl 26–50 mL/phút",

        minCrCl: 25,
        maxCrCl: 50,

        minInclusive: false,
        maxInclusive: true,

        dose: "Liều thông thường",

        interval: "Mỗi 12 giờ",
      },

      {
        label: "CrCl 10–25 mL/phút",

        minCrCl: 10,
        maxCrCl: 25,

        minInclusive: true,
        maxInclusive: true,

        dose: "Một nửa liều thông thường",

        interval: "Mỗi 12 giờ",
      },

      {
        label: "CrCl < 10 mL/phút",

        maxCrCl: 10,
        maxInclusive: false,

        dose: "Một nửa liều thông thường",

        interval: "Mỗi 24 giờ",
      },
    ],

    dialysisNote:
      "Meropenem bị thải loại khi thẩm tách máu: cần đưa thêm thuốc sau mỗi lần thẩm tách máu (Dược thư 2023 không nêu liều bổ sung cụ thể).",

    hepaticNote:
      "Suy gan: không cần hiệu chỉnh liều meropenem.",

    elderlyNote:
      "Người cao tuổi: không cần điều chỉnh liều nếu CrCl ≥ 50 mL/phút.",

    verification: "chua-xac-nhan",

    source: {
      organization:
        "Bộ Y tế – Hội đồng Dược thư quốc gia Việt Nam",

      title:
        "Dược thư quốc gia Việt Nam, lần xuất bản thứ ba – chuyên luận Meropenem",

      year: 2023,

      page:
        "PDF tr. 1080–1081 (trang in 1086–1087)",
    },
  },
];
