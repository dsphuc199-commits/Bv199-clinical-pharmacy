/*
  FILE: data/antibiotics/empiric/regimens/index.ts
  Gop toan bo phac do BYT; tra cuu theo mat benh.
*/

import { ANTIFUNGAL } from "./antifungal";
import { CARDIOLOGY } from "./cardiology";
import { CRITICAL_CARE } from "./critical-care";
import { ENT } from "./ent";
import { GASTRO } from "./gastro";
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

export { DOCS };
export type { Regimen, RegimenRole, DocId, DocInfo } from "./types";
export { ROLE_TEXT } from "./types";

const RAW_REGIMENS: Regimen[] = [
  ...ANTIFUNGAL,
  ...CARDIOLOGY,
  ...CRITICAL_CARE,
  ...ENT,
  ...GASTRO,
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

export const ALL_REGIMENS: Regimen[] = RAW_REGIMENS.map((regimen) => ({
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
export const KEEP_ALL_SOURCES: string[] = ["v8-97"];

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

export function getRegimensForDisease(diseaseId: string): Regimen[] {
  return BY_DISEASE.get(diseaseId) ?? [];
}

export function diseaseIdsWithRegimens(): string[] {
  return Array.from(BY_DISEASE.keys());
}

export function getConcreteRegimensForDisease(diseaseId: string): Regimen[] {
  return getRegimensForDisease(diseaseId).filter(isConcreteRegimen);
}
