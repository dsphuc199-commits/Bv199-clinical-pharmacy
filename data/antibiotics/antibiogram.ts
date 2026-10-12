/* =========================================================
   TYPES
========================================================= */

export type AntibiogramRecord = {
  id: string;

  year: number;

  department:
    | "Toàn viện"
    | "ICU"
    | "Nội"
    | "Ngoại"
    | "Khác";

  specimen:
    | "Tất cả"
    | "Máu"
    | "Nước tiểu"
    | "Hô hấp"
    | "Mủ/dịch"
    | "Khác";

  organismId: string;

  organismName: string;

  antibioticId: string;

  antibioticName: string;

  n: number;

  susceptiblePercent: number;

  increasedExposurePercent?: number;

  resistantPercent: number;

  method:
    | "EUCAST"
    | "CLSI";

  notes?: string[];

  source: {
    organization: string;

    title: string;

    year: number;

    url?: string;
  };
};

/* =========================================================
   ORGANISMS
========================================================= */

export const antibiogramOrganisms = [
  {
    id: "ecoli",
    name: "Escherichia coli",
  },

  {
    id: "klebsiella-pneumoniae",
    name: "Klebsiella pneumoniae",
  },

  {
    id: "pseudomonas-aeruginosa",
    name: "Pseudomonas aeruginosa",
  },

  {
    id: "acinetobacter-baumannii",
    name: "Acinetobacter baumannii",
  },

  {
    id: "staphylococcus-aureus",
    name: "Staphylococcus aureus",
  },
];

/* =========================================================
   SAMPLE DATA
   QUAN TRỌNG:
   Đây chỉ là dữ liệu DEMO để kiểm tra giao diện.
   KHÔNG sử dụng cho quyết định điều trị thật.
========================================================= */

export const antibiogramData:
  AntibiogramRecord[] = [
    {
      id: "2026-ecoli-ceftriaxone",

      year: 2026,

      department:
        "Toàn viện",

      specimen:
        "Tất cả",

      organismId:
        "ecoli",

      organismName:
        "Escherichia coli",

      antibioticId:
        "ceftriaxone",

      antibioticName:
        "Ceftriaxone",

      n: 120,

      susceptiblePercent:
        45,

      increasedExposurePercent:
        0,

      resistantPercent:
        55,

      method:
        "EUCAST",

      notes: [
        "Dữ liệu demo – phải thay bằng antibiogram BV199 đã thẩm định.",
      ],

      source: {
        organization:
          "Bệnh viện 199",

        title:
          "Antibiogram BV199 – dữ liệu mẫu",

        year:
          2026,
      },
    },

    {
      id: "2026-ecoli-meropenem",

      year: 2026,

      department:
        "Toàn viện",

      specimen:
        "Tất cả",

      organismId:
        "ecoli",

      organismName:
        "Escherichia coli",

      antibioticId:
        "meropenem",

      antibioticName:
        "Meropenem",

      n: 118,

      susceptiblePercent:
        94,

      increasedExposurePercent:
        1,

      resistantPercent:
        5,

      method:
        "EUCAST",

      notes: [
        "Dữ liệu demo – phải thay bằng antibiogram BV199 đã thẩm định.",
      ],

      source: {
        organization:
          "Bệnh viện 199",

        title:
          "Antibiogram BV199 – dữ liệu mẫu",

        year:
          2026,
      },
    },

    {
      id: "2026-ecoli-ciprofloxacin",

      year: 2026,

      department:
        "Toàn viện",

      specimen:
        "Tất cả",

      organismId:
        "ecoli",

      organismName:
        "Escherichia coli",

      antibioticId:
        "ciprofloxacin",

      antibioticName:
        "Ciprofloxacin",

      n: 116,

      susceptiblePercent:
        48,

      increasedExposurePercent:
        5,

      resistantPercent:
        47,

      method:
        "EUCAST",

      notes: [
        "Dữ liệu demo.",
      ],

      source: {
        organization:
          "Bệnh viện 199",

        title:
          "Antibiogram BV199 – dữ liệu mẫu",

        year:
          2026,
      },
    },

    {
      id: "2026-klebsiella-meropenem",

      year: 2026,

      department:
        "Toàn viện",

      specimen:
        "Tất cả",

      organismId:
        "klebsiella-pneumoniae",

      organismName:
        "Klebsiella pneumoniae",

      antibioticId:
        "meropenem",

      antibioticName:
        "Meropenem",

      n: 98,

      susceptiblePercent:
        78,

      increasedExposurePercent:
        2,

      resistantPercent:
        20,

      method:
        "EUCAST",

      notes: [
        "Dữ liệu demo.",
      ],

      source: {
        organization:
          "Bệnh viện 199",

        title:
          "Antibiogram BV199 – dữ liệu mẫu",

        year:
          2026,
      },
    },

    {
      id: "2026-pseudomonas-cefepime",

      year: 2026,

      department:
        "Toàn viện",

      specimen:
        "Tất cả",

      organismId:
        "pseudomonas-aeruginosa",

      organismName:
        "Pseudomonas aeruginosa",

      antibioticId:
        "cefepime",

      antibioticName:
        "Cefepime",

      n: 82,

      susceptiblePercent:
        68,

      increasedExposurePercent:
        14,

      resistantPercent:
        18,

      method:
        "EUCAST",

      notes: [
        "Dữ liệu demo.",
      ],

      source: {
        organization:
          "Bệnh viện 199",

        title:
          "Antibiogram BV199 – dữ liệu mẫu",

        year:
          2026,
      },
    },

    {
      id: "2026-pseudomonas-piptazo",

      year: 2026,

      department:
        "Toàn viện",

      specimen:
        "Tất cả",

      organismId:
        "pseudomonas-aeruginosa",

      organismName:
        "Pseudomonas aeruginosa",

      antibioticId:
        "piperacillin-tazobactam",

      antibioticName:
        "Piperacillin/tazobactam",

      n: 80,

      susceptiblePercent:
        72,

      increasedExposurePercent:
        10,

      resistantPercent:
        18,

      method:
        "EUCAST",

      notes: [
        "Dữ liệu demo.",
      ],

      source: {
        organization:
          "Bệnh viện 199",

        title:
          "Antibiogram BV199 – dữ liệu mẫu",

        year:
          2026,
      },
    },
  ];