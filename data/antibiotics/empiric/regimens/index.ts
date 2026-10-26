/*
  FILE: data/antibiotics/empiric/regimens/index.ts
  Gop toan bo phac do BYT; tra cuu theo mat benh.
*/

import { ANTIFUNGAL } from "./antifungal";
import { CARDIOLOGY } from "./cardiology";
import { COPD_2767 } from "./copd-2767";
import { CRITICAL_CARE } from "./critical-care";
import { ENDOCRINE } from "./endocrine";
import { ENT } from "./ent";
import { GASTRO } from "./gastro";
import { INFECTIOUS_5642 } from "./infectious-5642";
import { MUSCULOSKELETAL } from "./musculoskeletal";
import { NEURO } from "./neuro";
import { OBSTETRICS } from "./obstetrics";
import { OPHTHALMOLOGY } from "./ophthalmology";
import { RESPIRATORY } from "./respiratory";
import { RESPIRATORY_ICU } from "./respiratory-icu";
import { SKIN } from "./skin";
import { TUBERCULOSIS } from "./tuberculosis";
import { UROLOGY } from "./urology";
import { DOCS } from "./sources";
import type { DocId, Regimen } from "./types";
import { doseConflictNotes } from "../dose-conflicts";
import { NEONATAL_DEXA_PREFIX, NEONATAL_MENINGITIS_REGIMENS } from "../safety-alerts";

export { DOCS };
export type { Regimen, RegimenRole, DocId, DocInfo } from "./types";
export { ROLE_TEXT } from "./types";

const RAW_REGIMENS: Regimen[] = [
  ...ANTIFUNGAL,
  ...CARDIOLOGY,
  ...COPD_2767,
  ...CRITICAL_CARE,
  ...ENDOCRINE,
  ...ENT,
  ...GASTRO,
  ...INFECTIOUS_5642,
  ...MUSCULOSKELETAL,
  ...NEURO,
  ...OBSTETRICS,
  ...OPHTHALMOLOGY,
  ...RESPIRATORY,
  ...RESPIRATORY_ICU,
  ...SKIN,
  ...TUBERCULOSIS,
  ...UROLOGY,
];

/*
  Mat benh DA BO khoi danh muc vi khong co lua chon khang sinh CU THE (thuoc + lieu so)
  va khong co module rieng co lieu. Du lieu goc trong cac tep chuyen khoa duoc GIU de
  doi chieu; ID nay chi bi loai khi gop.
  - v8-15, v8-108: nhiem khuan lien quan catheter - chi neu ten thuoc, khong lieu
  - v8-55, v8-63, v8-64, v8-67, v8-100: tai mui hong - chi nhom thuoc/ten thuoc, khong lieu
  - v8-89, v8-118, v8-131: nam - chi nhom thuoc/ten thuoc, khong lieu
*/
export const REMOVED_DISEASE_IDS: string[] = [
  "v8-15",
  "v8-108",
  "v8-55",
  "v8-63",
  "v8-64",
  "v8-67",
  "v8-100",
  "v8-89",
  "v8-118",
  "v8-131",
];

/* Buoc 4D.1: gan ghi chu doi chieu lieu BYT – quoc te vao muc "Luu y" (khong doi lieu).
   Buoc 4D.2: phac do so sinh – ghi chu dexamethason (ghi chung cua BYT) giu nguyen van
   nhung gan nhan "khong ap dung mac dinh cho tre so sinh". */
function withDoseConflictNotes(regimen: Regimen): Regimen {
  const extra = doseConflictNotes(regimen.id);
  const neonatal = NEONATAL_MENINGITIS_REGIMENS.includes(regimen.id);
  const base = (regimen.notes ?? []).map((note) =>
    neonatal && /dexamethason/i.test(note) ? NEONATAL_DEXA_PREFIX + note : note
  );
  return extra.length > 0 || neonatal ? { ...regimen, notes: [...base, ...extra] } : regimen;
}

export const ALL_REGIMENS: Regimen[] = RAW_REGIMENS.map((regimen) => withDoseConflictNotes({
  ...regimen,
  diseaseIds: regimen.diseaseIds.filter(
    (id) => !REMOVED_DISEASE_IDS.includes(id)
  ),
})).filter((regimen) => regimen.diseaseIds.length > 0);

/*
  "Cu the" = phuong an co it nhat mot thuoc kem lieu so (mg, g, don vi, mg/kg, ...),
  moi thuoc con lai deu co lieu so hoac tham chieu "nhu tren" trong cung phuong an.
  Muc "Ho tro: ..." (dung kem) khong tinh vao dieu kien.
  Phuong an chi neu ten nhom thuoc / khong neu lieu -> khong "cu the".
*/
const NUMERIC_DOSE =
  /\d+([.,]\d+)?\s*(–\s*\d+([.,]\d+)?\s*)?(mg|g\b|µg|mcg|triệu|đơn vị|UI|ml|mL|viên|%)/i;
const REFERS_ABOVE = /(như trên|như mục|liều như|như các mục)/i;

export function isConcreteRegimen(regimen: Regimen): boolean {
  const core = regimen.drugs.filter((drug) => !/^hỗ trợ/i.test(drug.name));
  if (core.length === 0) return false;
  const numeric = core.filter((drug) => NUMERIC_DOSE.test(drug.dose));
  if (numeric.length === 0) return false;

  return core.every(
    (drug) =>
      NUMERIC_DOSE.test(drug.dose) ||
      (REFERS_ABOVE.test(drug.dose) && !/không nêu/i.test(drug.dose))
  );
}

/*
  QUY TAC "VAN BAN MOI NHAT THAY THE VAN BAN CU" (cung mot mat benh):
  neu mat benh co phuong an cu the tu nhieu van ban BYT, chi giu van ban co ngay ban
  hanh MOI NHAT; phuong an tu van ban cu hon bi an (khong dung lam phac do hien hanh).
  Ngay ban hanh lay tu DOCS (dd/mm/yyyy; neu chi co nam thi tinh 01/01 cua nam do).
  Ngoai le KEEP_ALL_SOURCES: van ban moi khong bao phu het tinh huong cua van ban cu
  (bo sung nhau, khong mau thuan) -> giu ca hai, moi phuong an van ghi ro nguon + ngay.
  - v8-97: QĐ 708 (2015) chi co viem bang quang thai ky; QĐ 315 bo sung viem than - be than cap.
*/
/*
  - v8-36, v8-104 (viem mang nao): QĐ 5642 (31/12/2015) moi hon nhung bang lieu tinh theo kg,
    khong tach nguoi lon; QĐ 708 co lieu nguoi lon co dinh -> giu ca hai, can tham dinh.
  - v8-26: QĐ 5642 chi co ly truc khuan (Shigella); QĐ 708 bao phu tieu chay do vi khuan noi chung.
*/
export const KEEP_ALL_SOURCES: string[] = ["v8-97", "v8-36", "v8-104", "v8-26"];

function docTime(doc: DocId): number {
  const raw = DOCS[doc]?.date ?? "";
  const full = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (full) return Date.UTC(+full[3], +full[2] - 1, +full[1]);
  const year = raw.match(/(19|20)\d{2}/);
  return year ? Date.UTC(+year[0], 0, 1) : 0;
}

export type SupersededNote = {
  diseaseId: string;
  kept: DocId;
  dropped: DocId[];
};

export const SUPERSEDED_LOG: SupersededNote[] = [];

const BY_DISEASE = new Map<string, Regimen[]>();
for (const reg of ALL_REGIMENS) {
  for (const id of reg.diseaseIds) {
    const list = BY_DISEASE.get(id);
    if (list) list.push(reg);
    else BY_DISEASE.set(id, [reg]);
  }
}

for (const [id, list] of BY_DISEASE) {
  if (KEEP_ALL_SOURCES.includes(id)) continue;
  const docs = Array.from(
    new Set(list.filter(isConcreteRegimen).map((r) => r.source.doc))
  );
  if (docs.length < 2) continue;
  const newest = docs.reduce((a, b) => (docTime(b) > docTime(a) ? b : a));
  const dropped = Array.from(
    new Set(list.map((r) => r.source.doc).filter((doc) => doc !== newest))
  );
  BY_DISEASE.set(
    id,
    list.filter((r) => r.source.doc === newest)
  );
  SUPERSEDED_LOG.push({ diseaseId: id, kept: newest, dropped });
}

/*
  VAN BAN BYT MOI HON NAM TRONG MODULE RIENG (khong nam trong RAW_REGIMENS):
  quy tac tren chi so sanh cac van ban trong thu vien regimens/, nen phai khai bao
  ro tung phuong an cu da duoc van ban moi bao phu. Chi bo dung ID liet ke;
  tinh huong van ban moi chua co thi GIU (khong suy dien).
  - v8-1: QĐ 2147/QĐ-BYT (15/07/2026, thay QĐ 4815/2020; xac minh tren kcb.vn
    25/10/2026) la huong dan BYT rieng cho viem phoi mac phai cong dong o nguoi lon,
    gom ca CAP nang/ICU, nguy co Pseudomonas va MRSA (module CapByt2026, Muc 5.3.2.2).
    Giu "r-icu-cap-aspiration": module chua co muc rieng cho viem phoi do hit.
*/
export type ModuleSupersede = {
  diseaseId: string;
  kept: DocId;
  dropped: DocId;
  regimenIds: string[];
  reason: string;
};

export const MODULE_SUPERSEDES: ModuleSupersede[] = [
  {
    diseaseId: "v8-1",
    kept: "byt2147",
    dropped: "byt1493",
    regimenIds: [
      "r-icu-cap-nonpseudo-1",
      "r-icu-cap-nonpseudo-2",
      "r-icu-cap-pseudo-1",
      "r-icu-cap-pseudo-2",
      "r-icu-cap-mrsa",
    ],
    reason:
      "QĐ 2147/QĐ-BYT (15/07/2026) là hướng dẫn BYT riêng cho viêm phổi mắc phải cộng đồng ở người lớn, bao gồm CAP nặng/ICU, nguy cơ Pseudomonas và MRSA; phác đồ hiện hành hiển thị trong module CAP bên dưới. Các phương án CAP nặng của QĐ 1493/QĐ-BYT (2015) đã được ẩn. Hiệu lực QĐ 2147 đã xác minh trên kcb.vn (Cục Quản lý Khám, chữa bệnh) ngày 25/10/2026.",
  },
];

for (const rule of MODULE_SUPERSEDES) {
  const list = BY_DISEASE.get(rule.diseaseId);
  if (!list) continue;
  const remaining = list.filter(
    (r) => !(r.source.doc === rule.dropped && rule.regimenIds.includes(r.id))
  );
  if (remaining.length === list.length) continue;
  BY_DISEASE.set(rule.diseaseId, remaining);
  SUPERSEDED_LOG.push({
    diseaseId: rule.diseaseId,
    kept: rule.kept,
    dropped: [rule.dropped],
  });
}

export function getModuleSupersedes(diseaseId: string): ModuleSupersede[] {
  return MODULE_SUPERSEDES.filter((rule) => rule.diseaseId === diseaseId);
}

export function getRegimensForDisease(diseaseId: string): Regimen[] {
  return BY_DISEASE.get(diseaseId) ?? [];
}

export function diseaseIdsWithRegimens(): string[] {
  return Array.from(BY_DISEASE.keys());
}

export function getConcreteRegimensForDisease(diseaseId: string): Regimen[] {
  return getRegimensForDisease(diseaseId).filter(isConcreteRegimen);
}
