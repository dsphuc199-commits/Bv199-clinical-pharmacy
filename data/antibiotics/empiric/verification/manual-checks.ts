/*
  FILE: data/antibiotics/empiric/verification/manual-checks.ts

  DOI CHIEU THU CONG (Nhiem vu 4C) – dung khi lieu nam trong BANG ma script
  scripts/verify-official-doses.mjs khong tach duoc (don vi o tieu de cot, so viet "05").
  Moi muc ghi trang PDF va noi dung da so. Chi ghi khi TAT CA lieu cua phuong an khop.
*/

export type ManualCheck = {
  regimenId: string;
  doc: string;
  copy: string;
  pages: string;
  note: string;
  checkedOn: string;
};

const COPY_162 = "bvdkbaclieu.gov.vn – bản QĐ 162/QĐ-BYT (PDF ký số)";
const COPY_4416 = "benhviennhi.gialai.gov.vn – bản QĐ 4416/QĐ-BYT ký số (Ký bởi: Bộ Y tế)";
const ABSCESS_PAGE = "PDF tr. 15 (Nhọt – mục 3.2.2, bảng liều người lớn/trẻ em; bảng hai cột bị ngắt dòng khi trích chữ)";

export const MANUAL_CHECKS: ManualCheck[] = [
  {
    regimenId: "r-abscess-4416-clox",
    doc: "byt4416",
    copy: COPY_4416,
    pages: ABSCESS_PAGE,
    note: "Người lớn: uống hoặc tiêm bắp hoặc TM cứ 6 giờ 250–500 mg; trẻ < 20 kg: cứ 6 giờ 12,5–25 mg/kg; > 20 kg như người lớn – khớp.",
    checkedOn: "25/10/2026",
  },
  {
    regimenId: "r-abscess-4416-azi",
    doc: "byt4416",
    copy: COPY_4416,
    pages: ABSCESS_PAGE,
    note: "Người lớn: uống 500 mg ngày đầu, sau đó 250 mg/ngày trong 4 ngày tiếp; trẻ em: 10 mg/kg/ngày x 3 ngày – khớp.",
    checkedOn: "25/10/2026",
  },
  {
    regimenId: "r-abscess-4416-clinda",
    doc: "byt4416",
    copy: COPY_4416,
    pages: ABSCESS_PAGE,
    note: "Người lớn: TM 600 mg x 3 lần/ngày hoặc uống 300–450 mg x 4 lần/ngày; trẻ em: uống hoặc truyền TM 10–20 mg/kg/ngày chia ba lần – khớp.",
    checkedOn: "25/10/2026",
  },
  {
    regimenId: "r-tb-a1",
    doc: "byt162",
    copy: COPY_162,
    pages: "PDF tr. 180 (Phụ lục – bảng liều theo cân nặng)",
    note: "Người lớn hàng ngày: isoniazid 5 (4–6) mg/kg, tối đa 300 mg; rifampicin 10 (8–12) mg/kg; pyrazinamid 25 (20–30) mg/kg; ethambutol 15 (15–20) mg/kg – khớp.",
    checkedOn: "25/10/2026",
  },
  {
    regimenId: "r-tb-b1",
    doc: "byt162",
    copy: COPY_162,
    pages: "PDF tr. 180 (Phụ lục – bảng liều theo cân nặng)",
    note: "Cùng bảng liều người lớn như phác đồ A1 – khớp.",
    checkedOn: "25/10/2026",
  },
  {
    regimenId: "r-tb-a1a",
    doc: "byt162",
    copy: COPY_162,
    pages: "PDF tr. 184 (Bảng số 9 – phác đồ HPZM 4 tháng)",
    note: "40–<50 kg và 50–<65 kg: H 300 mg, P 1200 mg, M 400 mg, Z 1500–1600 mg; ≥ 65 kg: Z 2000 mg – khớp.",
    checkedOn: "25/10/2026",
  },
  {
    regimenId: "r-tb-b2a",
    doc: "byt162",
    copy: COPY_162,
    pages: "PDF tr. 183 (Bảng số 7 – lao màng não trẻ em 6RHZEto)",
    note: "Isoniazid 15–20, rifampicin 22,5–30, pyrazinamid 35–45, ethionamid 17,5–22,5 mg/kg/ngày – khớp.",
    checkedOn: "25/10/2026",
  },
];

export function manualCheckFor(regimenId: string): ManualCheck | undefined {
  return MANUAL_CHECKS.find((m) => m.regimenId === regimenId);
}
