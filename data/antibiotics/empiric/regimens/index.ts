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

export const ALL_REGIMENS: Regimen[] = [
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
