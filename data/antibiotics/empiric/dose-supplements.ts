/*
  FILE: data/antibiotics/empiric/dose-supplements.ts

  LOP LIEU BO SUNG CO DAN NGUON (Master Task 5 – Final).

  - KHONG sua nguyen van phac do BYT (300 phuong an giu nguyen; kiem bang
    tests/empiric/fixtures/byt-regimens-baseline.json).
  - Chi them lieu khi nguon DA DOC TRUC TIEP va khop dung thuoc + dang bao che + tinh huong:
      "same-document": cung van ban BYT cua phuong an (vd. Phu luc lieu cua QĐ 162).
      "international": huong dan quoc te, ghi ro ten, muc, trang, ngay xac minh.
  - Khong ghep thuoc tu nhieu nguon thanh phac do moi: lieu bo sung chi gan vao dung
    thuoc da co trong phuong an BYT.
  - coversAll = true: lieu bo sung phu du MOI thuoc chinh con thieu lieu -> phuong an
    duoc tinh la "co lieu (bo sung)". false: chi la thong tin mot phan (vd. tan suat tra
    mat) -> phuong an van la MISSING_DOSE_EVIDENCE.
  - Phuong an thieu lieu khong co nguon: ghi ly do trong MISSING_DOSE_REASON,
    engine KHONG de xuat lieu, giao dien dan sang chuyen luan (Hieu chinh lieu / Duoc thu).
*/

import { ALL_REGIMENS, isConcreteRegimen, type Regimen } from "./regimens";

export type DoseEvidence = "SOURCE_DOSE" | "SUPPLEMENTED" | "MISSING_DOSE_EVIDENCE";

export type DoseSupplement = {
  regimenId: string;
  kind: "same-document" | "international";
  /* Tung dong: thuoc (dung ten trong phuong an) -> lieu nguyen van nguon (dich tieng Viet). */
  items: { drug: string; dose: string }[];
  /* Pham vi/dieu kien ap dung cua lieu bo sung, neu nguon gioi han. */
  scope?: string;
  source: { title: string; locator: string; url?: string };
  checkedOn: string;
  coversAll: boolean;
  /* Phan van con thieu sau khi bo sung (hien thi ro, khong an). */
  stillMissing?: string[];
};

const CHECKED = "26/10/2026";

const BYT162 = {
  title: "QĐ 162/QĐ-BYT (19/01/2024) – Hướng dẫn chẩn đoán, điều trị và dự phòng bệnh lao",
  url: "https://bvdkbaclieu.gov.vn/upload/1000079/20240524/291_Quyet_dinh-162-QD-BYT_3d3c0ac03e.pdf",
};
const PL6 = "Phụ lục 6, Bảng 1 – Liều dùng các thuốc chống lao theo cân nặng, tr. 179";
const M33 = "Phần III, mục 3.3 – Sử dụng Corticosteroid trong một số trường hợp, tr. 71";

const CHILD_H = "10 (7–15) mg/kg/ngày, tổng liều tối đa 300 mg; giới hạn cao áp dụng cho trẻ nhỏ";
const CHILD_R = "15 (10–20) mg/kg/ngày";
const CHILD_Z = "35 (30–40) mg/kg/ngày";
const CHILD_E = "20 (15–25) mg/kg/ngày";
const ADULT_H = "5 (4–6) mg/kg/ngày, tổng liều tối đa 300 mg";
const ADULT_R = "10 (8–12) mg/kg/ngày";
const ADULT_E = "15 (15–20) mg/kg/ngày";
const CHILD_NOTE = "Trẻ em có cân nặng từ 25 kg trở lên dùng thuốc theo thang cân nặng của người lớn (chú thích Bảng 1).";
const DEXA =
  "Tuần 1: 0,4 mg/kg tiêm tĩnh mạch × 7 ngày; tuần 2: 0,3 mg/kg × 7 ngày; tuần 3: 0,2 mg/kg × 7 ngày; tuần 4: 0,1 mg/kg × 7 ngày; từ tuần 5 chuyển uống, bắt đầu 4 mg, giảm 1 mg sau mỗi 7 ngày, trong 4 tuần";

export const DOSE_SUPPLEMENTS: DoseSupplement[] = [
  /* ---------- Lao (cung van ban QĐ 162) ---------- */
  {
    regimenId: "r-tb-a2",
    kind: "same-document",
    items: [
      { drug: "Duy trì 4 tháng: Rifampicin (R)", dose: CHILD_R },
      { drug: "Duy trì 4 tháng: Isoniazid (H)", dose: CHILD_H },
    ],
    scope: CHILD_NOTE,
    source: { title: BYT162.title, locator: PL6, url: BYT162.url },
    checkedOn: CHECKED,
    coversAll: true,
  },
  {
    regimenId: "r-tb-a2a",
    kind: "same-document",
    items: [
      { drug: "Tấn công 2 tháng: H", dose: CHILD_H },
      { drug: "Tấn công 2 tháng: R", dose: CHILD_R },
      { drug: "Tấn công 2 tháng: Z", dose: CHILD_Z },
      { drug: "Tấn công 2 tháng: E", dose: CHILD_E },
      { drug: "Duy trì 2 tháng: R + H", dose: `R ${CHILD_R}; H ${CHILD_H}` },
      { drug: "Duy trì: E (nếu dùng theo mô tả của tài liệu gốc)", dose: CHILD_E },
    ],
    scope: CHILD_NOTE,
    source: { title: BYT162.title, locator: PL6, url: BYT162.url },
    checkedOn: CHECKED,
    coversAll: true,
  },
  {
    regimenId: "r-tb-b1",
    kind: "same-document",
    items: [
      { drug: "Duy trì 10 tháng: Rifampicin (R)", dose: ADULT_R },
      { drug: "Duy trì 10 tháng: Isoniazid (H)", dose: ADULT_H },
      { drug: "Duy trì 10 tháng: Ethambutol (E)", dose: ADULT_E },
      { drug: "Hỗ trợ: Dexamethason (lao màng não)", dose: DEXA },
    ],
    scope: "Liều dexamethason: mục 3.3 \"Khuyến cáo dùng Corticosteroide cho điều trị lao màng não\" (cùng văn bản).",
    source: { title: BYT162.title, locator: `${PL6}; ${M33}`, url: BYT162.url },
    checkedOn: CHECKED,
    coversAll: true,
  },
  {
    regimenId: "r-tb-b2",
    kind: "same-document",
    items: [
      { drug: "Tấn công 2 tháng: H", dose: CHILD_H },
      { drug: "Tấn công 2 tháng: R", dose: CHILD_R },
      { drug: "Tấn công 2 tháng: Z", dose: CHILD_Z },
      { drug: "Tấn công 2 tháng: E", dose: CHILD_E },
      { drug: "Duy trì 10 tháng: R + H", dose: `R ${CHILD_R}; H ${CHILD_H}` },
      { drug: "Hỗ trợ: Dexamethason (lao màng não)", dose: DEXA },
    ],
    scope: `${CHILD_NOTE} Liều dexamethason theo mục 3.3 (cùng văn bản; mục không tách người lớn/trẻ em).`,
    source: { title: BYT162.title, locator: `${PL6}; ${M33}`, url: BYT162.url },
    checkedOn: CHECKED,
    coversAll: true,
    stillMissing: ["Streptomycin trẻ em: Phụ lục 6 Bảng 1 chỉ có cột người lớn 15 (12–18) mg/kg – không có liều trẻ em trong văn bản."],
  },

  /* ---------- Gian phe quan (QĐ 708, muc 4.3): van ban ghi "nhu muc tren" ---------- */
  ...["r-bronch-bli", "r-bronch-gramneg"].map<DoseSupplement>((regimenId) => ({
    regimenId,
    kind: "same-document",
    items: [{ drug: "Aminoglycosid (gentamycin hoặc amikacin)", dose: "gentamycin 3–5 mg/kg/ngày tiêm bắp 1 lần; amikacin 15 mg/kg/ngày pha truyền TM trong 250 ml NaCl 0,9%" }],
    scope: "Liều aminoglycosid văn bản nêu một lần ở phương án \"phối hợp beta-lactam + aminoglycosid\" cùng mục; các phương án sau ghi \"như mục trên\"/không nhắc lại liều.",
    source: { title: "QĐ 708/QĐ-BYT (2015) – Hướng dẫn sử dụng kháng sinh", locator: "Giãn phế quản, mục 4.3, tr. 68–69" },
    checkedOn: CHECKED,
    coversAll: true,
  })),
  {
    regimenId: "r-bronch-anaer",
    kind: "same-document",
    items: [
      { drug: "Amoxicilin-clavulanat", dose: "3–6 g chia 3–6 lần/ngày, tiêm TM" },
      { drug: "hoặc Penicilin G", dose: "10–50 triệu đơn vị/ngày tùy tình trạng và cân nặng, pha truyền TM chia 3–4 lần/ngày" },
    ],
    scope: "Văn bản ghi \"beta-lactam (như các mục trên)\" – liều lấy từ các phương án trên của cùng mục.",
    source: { title: "QĐ 708/QĐ-BYT (2015) – Hướng dẫn sử dụng kháng sinh", locator: "Giãn phế quản, mục 4.3, tr. 68–69" },
    checkedOn: CHECKED,
    coversAll: true,
  },

  /* ---------- Candida mau – xuong thang (QĐ 3429): "theo lieu duy tri o tren" ---------- */
  {
    regimenId: "r-fung-candidemia-stepdown",
    kind: "same-document",
    items: [{ drug: "Fluconazol (xuống thang)", dose: "liều duy trì 400 mg (6 mg/kg)/ngày" }],
    scope: "Liều duy trì fluconazol nêu ở phương án thay thế cùng mục 4.1.1a (liều nạp 800 mg chỉ dùng khi khởi đầu bằng fluconazol).",
    source: { title: "QĐ 3429/QĐ-BYT (2021) – Hướng dẫn chẩn đoán và điều trị nhiễm nấm", locator: "Mục 4.1.1a Candida máu, tr. 49" },
    checkedOn: CHECKED,
    coversAll: true,
  },

  /* ---------- Viem am dao do vi khuan (CDC 2021) ---------- */
  {
    regimenId: "r-bv-metro-gel",
    kind: "international",
    items: [{ drug: "Gel metronidazol 0,75%", dose: "1 ống bơm đầy (5 g) đặt âm đạo, 1 lần/ngày × 5 ngày" }],
    scope: "Người lớn không mang thai; CDC ghi người mang thai có thể dùng bất kỳ phác đồ khuyến cáo nào cho người không mang thai.",
    source: {
      title: "CDC – Sexually Transmitted Infections Treatment Guidelines, 2021: Bacterial Vaginosis",
      locator: "Recommended Regimens for Bacterial Vaginosis (Last Reviewed 22/07/2021)",
      url: "https://www.cdc.gov/std/treatment-guidelines/bv.htm",
    },
    checkedOn: CHECKED,
    coversAll: true,
  },

  /* ---------- Mat (AAO 2023) – thong tin mot phan, KHONG du lieu ---------- */
  ...["r-ker-grampos", "r-ker-gramneg"].map<DoseSupplement>((regimenId) => ({
    regimenId,
    kind: "international",
    items: [
      {
        drug: "Kháng sinh tra mắt",
        dose: "Viêm giác mạc trung tâm hoặc nặng (thâm nhiễm nhu mô sâu hoặc > 2 mm, nhiều mủ): liều nạp mỗi 5–15 phút, sau đó tra thường xuyên, ví dụ mỗi giờ",
      },
    ],
    scope:
      "AAO: ciprofloxacin 0,3%, ofloxacin 0,3% và levofloxacin 1,5% được FDA chấp thuận cho viêm giác mạc do vi khuẩn; moxifloxacin, gatifloxacin không có chỉ định FDA cho viêm giác mạc. Kháng sinh tăng cường (fortified): theo Phụ lục 6 của AAO – chưa trích.",
    source: {
      title: "AAO – Bacterial Keratitis Preferred Practice Pattern (P88, duyệt 22/09/2023)",
      locator: "Management – Initial Treatment, tr. P106",
      url: "https://aao.org/Assets/6dd86c3a-c71f-44c8-aec1-fd833faca6d2/638434423305070000/bacterial-keratitis-ppp-pdf",
    },
    checkedOn: CHECKED,
    coversAll: false,
    stillMissing: ["Nồng độ/tần suất cho viêm giác mạc không nặng; nồng độ kháng sinh tăng cường (Bảng 4 AAO – bản trích văn bản không tách được cột, chưa nhập)."],
  })),
  ...["r-conj-topical", "r-conj-topical-40"].map<DoseSupplement>((regimenId) => ({
    regimenId,
    kind: "international",
    items: [{ drug: "Kháng sinh tra mắt phổ rộng", dose: "Đợt 5–7 ngày thường có hiệu quả; không có bằng chứng thuốc nào ưu thế hơn" }],
    scope: "Viêm kết mạc do vi khuẩn mức độ nhẹ (thường tự khỏi). Mức độ trung bình–nặng: chọn theo kết quả xét nghiệm; lậu cầu cần điều trị toàn thân.",
    source: {
      title: "AAO – Conjunctivitis Preferred Practice Pattern (P135, duyệt 22/09/2023)",
      locator: "Management – Bacterial Conjunctivitis, tr. P176",
      url: "https://aao.org/Assets/76c4baa7-869e-42ad-9ffc-215781185a7b/638434228319430000/conjunctivitis-ppp-pdf",
    },
    checkedOn: CHECKED,
    coversAll: false,
    stillMissing: ["Nồng độ từng chế phẩm: theo nhãn thuốc/Dược thư (nguồn không nêu)."],
  })),
];

/* Ly do con thieu lieu (khong tim duoc nguon hop le de bo sung) – hien thi cho nguoi dung. */
export const MISSING_DOSE_REASON: Record<string, string> = {
  "r-bv-clinda-gel": "CDC 2021 chỉ nêu liều clindamycin dạng KEM 2% (cream), không phải gel như văn bản BYT – khác dạng bào chế, không áp liều.",
  "r-bv-preg-gel": "CDC 2021 chỉ nêu liều clindamycin dạng KEM 2% (cream), không phải gel như văn bản BYT – khác dạng bào chế, không áp liều.",
  "r-dfi-mild-simple": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-dfi-mild-allergy": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-dfi-mild-recent-abx": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-dfi-mild-mrsa": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-dfi-mod-simple": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-dfi-mod-recent-abx": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-dfi-mod-pseudo": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-dfi-mod-ischemic": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-dfi-mod-mrsa": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-dfi-mod-esbl": "IWGDF/IDSA 2023 không nêu liều cụ thể; QĐ 1530 chỉ nêu nhóm thuốc.",
  "r-icu-hap-nomdr": "QĐ 1493 không nêu liều. Liều HAP/VAP có trong module Khuyến cáo Hội 2023 (nguồn khác) – không ghép vào phương án này.",
  "r-icu-hap-mdr": "QĐ 1493 không nêu liều. Liều HAP/VAP có trong module Khuyến cáo Hội 2023 (nguồn khác) – không ghép vào phương án này.",
  "r-icu-cap-aspiration": "QĐ 1493 không nêu liều; QĐ 2147 (CAP 2026) không có mục riêng viêm phổi hít.",
  "r-fn-add-aminoglyc": "QĐ 708 ghi liều theo độ thanh thải creatinin nhưng không nêu số – tra chuyên luận từng aminoglycosid.",
  "r-ent-pharyngitis": "QĐ 5643 không nêu liều. Liều CDC (đã đối chiếu 25/10/2026) nằm ở module Tai Mũi Họng – tab Quốc tế.",
  "r-ent-aom-child": "QĐ 5643 chỉ nêu nhóm thuốc; liều NICE NG91 trong module Tai Mũi Họng chưa đối chiếu lại được (trang NICE chặn truy cập tự động 26/10/2026).",
  "r-ent-sinus-moderate": "QĐ 5643 không nêu liều; CDC 2024 chỉ nêu thuốc ưu tiên (amoxicilin ± clavulanat), không nêu liều.",
  "r-ent-sinus-allergy-adult": "QĐ 5643 không nêu liều; CDC 2024 nêu doxycyclin hoặc fluoroquinolon hô hấp cho người dị ứng penicillin, không nêu liều.",
  "r-ent-sinus-recent-adult": "QĐ 5643 không nêu liều.",
  "r-ent-sinus-recent-adult-allergy": "QĐ 5643 không nêu liều.",
  "r-vmn42-trauma-alt": "Bảng QĐ 5642 không tách rõ ô phối hợp – chưa xác định được phác đồ; đang khóa đề xuất tự động.",
  "r-fung-crypto-hiv-extra": "QĐ 3429 ghi \"điều trị như viêm màng não\"; WHO 2022 chỉ nêu liều cho viêm màng não – không tự suy ra cho thể ngoài TKTW.",
  "r-neo-late-gramneg": "QĐ 315 không nêu liều imipenem cho sơ sinh – tra chuyên luận.",
};

const BY_ID = new Map(DOSE_SUPPLEMENTS.map((s) => [s.regimenId, s]));

export function doseSupplementFor(regimenId: string): DoseSupplement | undefined {
  return BY_ID.get(regimenId);
}

export function doseEvidenceOf(regimen: Regimen): DoseEvidence {
  if (isConcreteRegimen(regimen)) return "SOURCE_DOSE";
  return BY_ID.get(regimen.id)?.coversAll ? "SUPPLEMENTED" : "MISSING_DOSE_EVIDENCE";
}

export function missingDoseReason(regimenId: string): string {
  return (
    MISSING_DOSE_REASON[regimenId] ??
    "Nguồn chỉ nêu tên thuốc/nhóm thuốc, không nêu liều; chưa tìm được nguồn hợp lệ để bổ sung – đối chiếu chuyên luận (Dược thư Quốc gia 2023 qua module Hiệu chỉnh liều)."
  );
}

export const DOSE_EVIDENCE_TEXT: Record<DoseEvidence, string> = {
  SOURCE_DOSE: "Liều theo nguyên văn nguồn",
  SUPPLEMENTED: "Liều bổ sung có dẫn nguồn",
  MISSING_DOSE_EVIDENCE: "MISSING_DOSE_EVIDENCE – chưa có liều từ nguồn",
};

/* Thong ke (bao cao/kiem thu). */
export function doseEvidenceSummary(regimens: Regimen[] = ALL_REGIMENS) {
  const out: Record<DoseEvidence, number> = { SOURCE_DOSE: 0, SUPPLEMENTED: 0, MISSING_DOSE_EVIDENCE: 0 };
  for (const r of regimens) out[doseEvidenceOf(r)]++;
  return out;
}
