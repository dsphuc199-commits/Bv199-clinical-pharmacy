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
import type { Regimen } from "./types";

export { DOCS } from "./sources";
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

const BY_DISEASE = new Map<string, Regimen[]>();
for (const reg of ALL_REGIMENS) {
  for (const id of reg.diseaseIds) {
    const list = BY_DISEASE.get(id);
    if (list) list.push(reg);
    else BY_DISEASE.set(id, [reg]);
  }
}

export function getRegimensForDisease(diseaseId: string): Regimen[] {
  return BY_DISEASE.get(diseaseId) ?? [];
}

export function diseaseIdsWithRegimens(): string[] {
  return Array.from(BY_DISEASE.keys());
}

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

export function getConcreteRegimensForDisease(diseaseId: string): Regimen[] {
  return getRegimensForDisease(diseaseId).filter(isConcreteRegimen);
}
