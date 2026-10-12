import type { PKPDSource } from "@/lib/types/pkpd";

export const pkpdSources: PKPDSource[] = [
  {
    id: "lecture-pkpd-overview-2026",
    title:
      "PK/PD CỦA KHÁNG SINH - Tổng quan và phương pháp xác định",
    authors: "PGS. TS. Huỳnh Ngọc Trinh",
    organization: [
      "BM Dược Lý – Trường Dược",
    ],
    year: 2026,
    type: "lecture",
    language: "vi",
    status: "current",
  },

  {
    id: "lecture-time-dependent-2026",
    title:
      "ÁP DỤNG PK/PD TRONG LỰA CHỌN KHÁNG SINH TRONG ĐIỀU TRỊ ĐỐI VỚI CÁC KHÁNG SINH PHỤ THUỘC THỜI GIAN",
    authors: "PGS. TS. Đặng Nguyễn Đoan Trang",
    organization: [
      "Trường Dược, ĐH Y Dược TP HCM",
      "Khoa Dược, BV ĐH Y Dược TP HCM",
    ],
    year: 2026,
    type: "lecture",
    language: "vi",
    status: "current",
  },

  {
    id: "lecture-concentration-dependent-2026",
    title:
      "PK/PD đ/v KHÁNG SINH PHỤ THUỘC NỒNG ĐỘ",
    authors: "PGS. TS. Huỳnh Ngọc Trinh",
    organization: [
      "BM Dược Lý – Trường Dược",
    ],
    year: 2026,
    type: "lecture",
    language: "vi",
    status: "current",
  },

  {
    id: "lecture-resistance-2017",
    title:
      "PKPD của Kháng sinh và đề kháng KS",
    year: 2017,
    type: "lecture",
    language: "vi",
    status: "historical",
  },

  {
    id: "beta-lactam-consensus-2023",
    title:
      "International consensus recommendations for the use of prolonged-infusion beta-lactam antibiotics",
    shortTitle:
      "β-lactam prolonged infusion consensus",
    organization: [
      "ACCP",
      "BSAC",
      "CFF",
      "ESCMID",
      "IDSA",
      "SCCM",
      "SIDP",
    ],
    year: 2023,
    type: "consensus",
    language: "en",
    doi:
      "10.1002/phar.2842",
    status: "current",
  },

  {
    id: "vancomycin-consensus-2020",
    title:
      "Therapeutic monitoring of vancomycin for serious methicillin-resistant Staphylococcus aureus infections",
    shortTitle:
      "Vancomycin monitoring consensus",
    organization: [
      "ASHP",
      "IDSA",
      "PIDS",
      "SIDP",
    ],
    year: 2020,
    type: "consensus",
    language: "en",
    doi:
      "10.1093/ajhp/zxaa036",
    status: "current",
  },

  {
    id: "polymyxin-consensus-2019",
    title:
      "International Consensus Guidelines for the Optimal Use of the Polymyxins",
    shortTitle:
      "Polymyxin consensus",
    organization: [
      "ACCP",
      "ESCMID",
      "IDSA",
      "ISAP",
      "SCCM",
      "SIDP",
    ],
    year: 2019,
    type: "guideline",
    language: "en",
    doi:
      "10.1002/phar.2209",
    status: "current",
  },

  {
    id: "clsi-m100-2026",
    title:
      "CLSI M100: Performance Standards for Antimicrobial Susceptibility Testing",
    shortTitle:
      "CLSI M100 Ed36",
    organization: [
      "CLSI",
    ],
    year: 2026,
    version:
      "36th Edition",
    type: "guideline",
    language: "en",
    status: "current",
  },

  {
    id: "eucast-breakpoints-2026",
    title:
      "EUCAST Clinical Breakpoint Tables for interpretation of MICs and zone diameters",
    shortTitle:
      "EUCAST Clinical Breakpoints",
    organization: [
      "EUCAST",
    ],
    year: 2026,
    version:
      "16.1",
    type: "guideline",
    language: "en",
    status: "current",
  },
];

export function getPKPDSource(
  id: string
) {
  return pkpdSources.find(
    (source) => source.id === id
  );
}