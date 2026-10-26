/*
  FILE: lib/antibiotics/clinical-filters.ts

  Ham thuan cho bo loc lam sang (Buoc 4A). Phan loai DUA TREN TU KHOA trong ten tinh
  huong / van ban cua nguon – khong suy luan lam sang. Tinh huong khong ghi muc do
  hoac nguy co thi xep "khong neu" va VAN hien thi khi loc.
*/

import { renalDosingDatabase, type RenalDoseRange } from "@/data/renal-dosing";

import { findDrugs, normalizeForMatch, pickProfile, type DrugMatch } from "./drug-links";
import { inFormulary } from "./formulary";

export type Severity = "all" | "mild" | "severe";
export type MdrRisk = "all" | "low" | "high";

export type ClinicalFilterState = {
  severity: Severity;
  mdr: MdrRisk;
  penicillinAllergy: boolean;
  hidePenicillin: boolean;
  crcl: string;
  formularyOnly: boolean;
};

export const DEFAULT_FILTERS: ClinicalFilterState = {
  severity: "all",
  mdr: "all",
  penicillinAllergy: false,
  hidePenicillin: false,
  crcl: "",
  formularyOnly: false,
};

export function isFilterActive(f: ClinicalFilterState): boolean {
  return (
    f.severity !== "all" ||
    f.mdr !== "all" ||
    f.penicillinAllergy ||
    f.crcl.trim() !== "" ||
    f.formularyOnly
  );
}

/* ---------- Muc do / nguy co (theo tu khoa nguon) ---------- */

const SEVERE_RE = /nặng|ICU|hồi sức|sốc|nguy kịch|đe dọa tính mạng|rất nặng/i;
const MILD_RE = /nhẹ|ngoại trú|không biến chứng|thông thường|không nặng/i;

export function severityOf(text: string, role?: string): "mild" | "severe" | "unspecified" {
  // "không nặng" la nhe, xet truoc "nặng".
  if (/không nặng/i.test(text)) return "mild";
  if (role === "severe" || SEVERE_RE.test(text)) return "severe";
  if (MILD_RE.test(text)) return "mild";
  return "unspecified";
}

const MDR_HIGH_RE =
  /đa kháng|ESBL|MRSA|kháng methicilin|Pseudomonas|P\. aeruginosa|bệnh viện|kháng carbapenem|DTR|kháng thuốc|kháng sinh gần đây|VPBV muộn/i;
const MDR_LOW_RE = /không (có )?nguy cơ|không có yếu tố phức tạp|VPBV sớm/i;

export function mdrOf(text: string): "low" | "high" | "unspecified" {
  if (MDR_LOW_RE.test(text)) return "low";
  if (MDR_HIGH_RE.test(text)) return "high";
  return "unspecified";
}

/* ---------- Nhom beta-lactam (di ung) ---------- */

const PENICILLIN_IDS = new Set([
  "amoxicillin", "amoxicillin-clavulanate", "ampicillin", "ampicillin-sulbactam",
  "piperacillin-tazobactam", "benzylpenicillin", "benzathine-benzylpenicillin",
  "cloxacillin", "oxacillin", "ticarcillin-clavulanate",
]);
const CARBAPENEM_IDS = new Set(["meropenem", "imipenem-cilastatin", "ertapenem", "doripenem"]);

export type BetaLactamFlags = {
  penicillin: boolean;
  cephalosporin: boolean;
  carbapenem: boolean;
  unspecified: boolean;
};

export function betaLactamFlags(texts: string[]): BetaLactamFlags {
  const drugs = findDrugs(texts);
  const norm = normalizeForMatch(texts.join(" "));
  return {
    penicillin:
      drugs.some((d) => PENICILLIN_IDS.has(d.ingredientId)) ||
      /penicil|penicillin|amoxicil|ampicil|piperacil|ticarcil|oxacil|cloxacil|nafcil/.test(norm),
    cephalosporin:
      drugs.some((d) => d.ingredientId.startsWith("cef")) ||
      /cephalosporin|cefalosporin/.test(norm),
    carbapenem:
      drugs.some((d) => CARBAPENEM_IDS.has(d.ingredientId)) || /carbapenem/.test(norm),
    // "β-lactam" sau chuan hoa con "lactam" (ky tu β bi loai).
    unspecified: /(^| )(beta )?lactam\b/.test(norm),
  };
}

export function isPenicillinClass(ingredientId: string): boolean {
  return PENICILLIN_IDS.has(ingredientId);
}

export function isOtherBetaLactam(ingredientId: string): boolean {
  return ingredientId.startsWith("cef") || CARBAPENEM_IDS.has(ingredientId);
}

/* ---------- Danh muc BV199 ---------- */

/* null: khong nhan dien duoc thuoc nao -> khong ket luan. */
export function anyInFormulary(texts: string[]): boolean | null {
  const drugs = findDrugs(texts);
  if (drugs.length === 0) return null;
  return drugs.some((d) => inFormulary(d.ingredientId));
}

/* ---------- Lieu theo CrCl (nguyen van du lieu Hieu chinh lieu) ---------- */

function matchesRange(crcl: number, range: RenalDoseRange): boolean {
  if (range.minCrCl !== undefined) {
    if (range.minInclusive === false ? crcl <= range.minCrCl : crcl < range.minCrCl) return false;
  }
  if (range.maxCrCl !== undefined) {
    if (range.maxInclusive === false ? crcl >= range.maxCrCl : crcl > range.maxCrCl) return false;
  }
  return true;
}

export type RenalLookup =
  | { kind: "dose"; label: string; dose: string; interval: string; indication: string }
  | { kind: "multi" }
  | { kind: "narrative" }
  | { kind: "no-range" };

export function renalDoseFor(
  match: DrugMatch,
  crcl: number,
  diseaseId?: string
): RenalLookup {
  const profiles = renalDosingDatabase.filter((p) => p.ingredientId === match.ingredientId);
  if (profiles.length === 0) return { kind: "no-range" };
  const pick = pickProfile(match.ingredientId, match.segment, diseaseId);
  const profile =
    profiles.length === 1
      ? profiles[0]
      : pick
        ? profiles.find((p) => p.indicationId === pick.indicationId)
        : undefined;
  if (!profile) return { kind: "multi" };
  if (profile.ranges.length === 0) return { kind: "narrative" };
  const range = profile.ranges.find((r) => matchesRange(crcl, r));
  if (!range) return { kind: "no-range" };
  return {
    kind: "dose",
    label: range.label,
    dose: range.dose,
    interval: range.interval,
    indication: profile.indicationLabel,
  };
}

export function parseCrcl(value: string): number | null {
  const n = Number(value.replace(",", "."));
  return value.trim() !== "" && Number.isFinite(n) && n >= 0 && n < 400 ? n : null;
}
