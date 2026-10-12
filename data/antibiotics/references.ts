export type AntibioticSource = {
  id: string;

  title: string;

  organization?: string;

  year: number;

  type:
    | "hospital-guideline"
    | "national-guideline"
    | "international-guideline"
    | "consensus"
    | "lecture";

  note?: string;
};


export const antibioticSources:
  AntibioticSource[] = [
  {
    id:
      "bvdhyd-antibiotic-2023",

    title:
      "Hướng dẫn sử dụng kháng sinh năm 2023",

    organization:
      "Bệnh viện Đại học Y Dược TP.HCM",

    year:
      2023,

    type:
      "hospital-guideline",
  },

  {
    id:
      "lecture-deescalation",

    title:
      "Xuống thang kháng sinh trong điều trị",

    year:
      2026,

    type:
      "lecture",
  },

  {
    id:
      "bv199-antibiogram-2025-2026",

    title:
      "Dữ liệu kháng sinh đồ Bệnh viện 199",

    organization:
      "Bệnh viện 199",

    year:
      2026,

    type:
      "hospital-guideline",
  },

  {
    id:
      "bv199-lasa-2025-2026",

    title:
      "Danh mục thuốc LASA năm 2025–2026",

    organization:
      "Khoa Dược – Bệnh viện 199",

    year:
      2026,

    type:
      "hospital-guideline",
  },
];


export function getAntibioticSource(
  id: string
) {
  return antibioticSources.find(
    (source) =>
      source.id === id
  );
}