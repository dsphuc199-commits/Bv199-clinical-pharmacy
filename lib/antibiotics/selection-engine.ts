/*
  FILE: lib/antibiotics/selection-engine.ts

  NHIEM VU 4B – CLINICAL ANTIBIOTIC SELECTION ENGINE.

  Nguyen tac (bat buoc):
  - Chi dung du lieu phac do da kiem chung trong ung dung:
      + Phac do BYT: data/antibiotics/empiric/regimens (QĐ 708, 1493, 1530, ...)
      + Module CAP (QĐ 2147/2026) va HAP/VAP (Hoi 2023) – tai su dung dung du lieu module
        va quy tac dinh tuyen lib/antibiotics/select-regimens.ts.
  - Bien bat buoc CHUA NHAP -> khong dua khuyen cao (status "need-input"), khong mac
    dinh "binh thuong" (vd. chuc nang than, di ung, thai ky).
  - Khong tu xep hang thuoc: chi dung nhan "Uu tien/Thay the" khi nguon phan biet
    (role first + alternative trong cung tinh huong). Trong nhom: giu thu tu nguon.
  - Phan loai muc do/nguy co dua tren tieu chi ghi trong ten tinh huong cua nguon.
  - Toi da 3 nhom: chinh, thay the, truong hop dac biet.
*/

import { autoRecommendBlocks, safetyAlertsFor } from "@/data/antibiotics/empiric/safety-alerts";
import { approvalFor, type ApprovalStatus } from "@/data/antibiotics/empiric/approvals";
import {
  doseEvidenceOf,
  doseSupplementFor,
  missingDoseReason,
  type DoseEvidence,
} from "@/data/antibiotics/empiric/dose-supplements";
import {
  CAP_SCENARIOS,
  type CapRegimen,
} from "@/components/antibiotics/CapByt2026";
import {
  HAPVAP_RISK,
  HAPVAP_SCENARIOS,
  type HapVapRegimen,
} from "@/components/antibiotics/HapVap2023";
import { DISEASES, normalize } from "@/data/antibiotics/empiric/catalog";
import { icdOf } from "@/data/antibiotics/empiric/icd10";
import { getIntlEntry } from "@/data/antibiotics/empiric/international";
import {
  DOCS,
  getRegimensForDisease,
  type Regimen,
} from "@/data/antibiotics/empiric/regimens";
import type { Disease } from "@/data/antibiotics/empiric/types";

import { betaLactamFlags, mdrOf, severityOf } from "./clinical-filters";
import { findDrugs } from "./drug-links";
import { inFormulary } from "./formulary";
import { DEFAULT_CONTEXT, selectScenario, type PatientContext } from "./select-regimens";

/* ======================= Kieu du lieu ======================= */

export type YesNo = "yes" | "no";
/* Master Task 5: bien chua biet ghi "unknown" – KHONG hieu la am tinh. */
export type YesNoUnknown = "yes" | "no" | "unknown";
export type Eligibility = "ELIGIBLE" | "CONDITIONAL" | "NOT_ELIGIBLE" | "SAFETY_BLOCKED";

export type PatientInput = {
  population?: "adult" | "child";
  pregnant?: YesNoUnknown;
  penicillinAllergy?: YesNoUnknown;
  renal?: "normal" | "impaired" | "unknown";
  crcl?: number;
  micro?: "none" | "mssa" | "mrsa" | "pseudomonas" | "esbl" | "anaerobe";
  /* Truc phan loai chung (BYT) */
  severity?: "mild" | "severe" | "unknown";
  mdr?: YesNoUnknown;
  scenario?: string;
  /* CAP */
  capSetting?: "outpatient" | "ward" | "icu";
  capSevere?: YesNo;
  capRisk?: YesNo;
  pseudoRisk?: YesNo;
  mrsaRisk?: YesNo;
  /* HAP / VAP */
  hapSevere?: YesNo;
  mdrRisk?: YesNo;
  unitResistance?: "lt10" | "gt10" | "unknown";
};

export type QuestionKey = keyof PatientInput;

export type Question = {
  key: QuestionKey;
  label: string;
  options: { value: string; label: string }[];
  required: boolean;
  /* Tieu chi cua nguon de nguoi dung danh gia (nguyen van/trich). */
  help?: string[];
  kind?: "select" | "number";
};

export type DrugLine = { name: string; dose: string; route?: string; caution?: string };

export type Option = {
  id: string;
  title: string;
  drugs: DrugLine[];
  duration: string;
  reason: string;
  warnings: string[];
  source: string;
  noDose: boolean;
  /* Buoc 4D.2: canh bao an toan cua phuong an (hien thi ngay, khong an trong Luu y) */
  alerts?: { level: "critical" | "high"; title: string; text: string; checklist?: string[] }[];
  /* Buoc 4D.3: gan boi evaluate() */
  approved?: boolean;
  requiresReview?: boolean;
  /* Master Task 5: phan loai va dieu kien con phai xac nhan (gan boi evaluate()) */
  eligibility?: Eligibility;
  conditions?: string[];
  /* Hoat chat khong co trong danh muc BV199 */
  notInFormulary?: string[];
  /* Master Task 5 – Final: nguon goc lieu. MISSING_DOSE_EVIDENCE -> khong de xuat lieu. */
  doseEvidence?: DoseEvidence;
  /* Lieu bo sung co dan nguon (khong phai nguyen van phuong an BYT). */
  supplement?: {
    kind: "same-document" | "international";
    items: { drug: string; dose: string }[];
    scope?: string;
    source: string;
    url?: string;
    complete: boolean;
    stillMissing?: string[];
  };
  missingDoseReason?: string;
};

export type Group = {
  kind: "main" | "alternative" | "special";
  label: string;
  note: string;
  options: Option[];
};

export type Excluded = { title: string; reason: string; eligibility?: Eligibility };

export type Result =
  | { status: "need-input"; missing: string[]; candidates: number }
  | { status: "no-match"; message: string }
  | {
      status: "ready";
      certainty: "complete" | "limited";
      scenarioLabel: string;
      criteria: string[];
      groups: Group[];
      excluded: Excluded[];
      warnings: string[];
      limits: string[];
      sourceSummary: string;
      pool?: { title: string; drugs: DrugLine[] }[];
      intlAvailable: boolean;
      /* Buoc 4D.3: phe duyet HĐT&ĐT – luon co sau evaluate() */
      approval?: ApprovalStatus;
      clinicalUse?: "approved" | "clinician-decision-required";
      /* Master Task 5: so phuong an theo phan loai */
      eligibilityCount?: Record<Eligibility, number>;
      unknowns?: string[];
    };

const YES_NO = [
  { value: "yes", label: "Có" },
  { value: "no", label: "Không" },
];

/* ======================= Tim kiem ======================= */

export function searchDiseases(query: string): Disease[] {
  const q = normalize(query.trim());
  if (!q) return [];
  const qCode = query.trim().toUpperCase().replace(/\s+/g, "");
  // Truy van dang ma ICD-10 (chu cai + so, vd. "J18", "A41.9") -> tim theo ma.
  const isCode = /^[A-Z]\d/.test(qCode);
  return DISEASES.filter((disease) => {
    if (isCode) {
      return icdOf(disease.id).some((code) => {
        const c = code.toUpperCase();
        return c.startsWith(qCode) || qCode.startsWith(c);
      });
    }
    return normalize(`${disease.title} ${disease.specialty}`).includes(q);
  }).slice(0, 12);
}

/* ======================= Phan loai ======================= */

type Kind = "cap" | "hap" | "vap" | "generic";

function kindOf(diseaseId: string): Kind {
  if (diseaseId === "v8-1") return "cap";
  if (diseaseId === "v8-4") return "hap";
  if (diseaseId === "v8-5") return "vap";
  return "generic";
}

function populationOf(text: string): "child" | "obstetric" | "unspecified" {
  const t = text.toLocaleLowerCase("vi");
  if (/trẻ|sơ sinh|nhũ nhi|tháng tuổi|nhi khoa|ngày tuổi/.test(t)) return "child";
  if (/thai|hậu sản|sản khoa|sản phụ/.test(t)) return "obstetric";
  return "unspecified";
}

function diseaseAudience(disease: Disease): "child" | "adult" | "any" {
  const t = normalize(disease.title);
  if (t.includes("tre em") || t.includes("so sinh")) return "child";
  if (t.includes("nguoi lon")) return "adult";
  return "any";
}

const MICRO_RE: Record<Exclude<NonNullable<PatientInput["micro"]>, "none">, RegExp> = {
  mssa: /MSSA|nhạy methicilin/i,
  mrsa: /MRSA|kháng methicilin/i,
  pseudomonas: /Pseudomonas|P\. aeruginosa/i,
  esbl: /ESBL/i,
  anaerobe: /kỵ khí|kị khí/i,
};

type Scn = { name: string; items: Regimen[] };

function scenariosOf(diseaseId: string): Scn[] {
  const order: string[] = [];
  const map = new Map<string, Regimen[]>();
  for (const regimen of getRegimensForDisease(diseaseId)) {
    if (!map.has(regimen.scenario)) {
      order.push(regimen.scenario);
      map.set(regimen.scenario, []);
    }
    map.get(regimen.scenario)!.push(regimen);
  }
  return order.map((name) => ({ name, items: map.get(name)! }));
}

/* ======================= Cau hoi theo benh ======================= */

const COMMON_HELP = {
  renal:
    "Chọn \"Bình thường (đã đánh giá)\" hoặc nhập CrCl. \"Không rõ\": kết quả chỉ ở mức CÓ ĐIỀU KIỆN.",
  allergy: "Tiền sử dị ứng penicillin. \"Không rõ\": không coi là không dị ứng – phương án beta-lactam ở mức CÓ ĐIỀU KIỆN.",
};

/*
  Master Task 5 – Final: bien theo tung benh (khong bat nhap thong so khong lien quan).
  - Di ung penicillin: chi hoi khi phac do cua benh co beta-lactam.
  - Chuc nang than: chi hoi khi co thuoc dung toan than (khong hoi neu moi phuong an la thuoc
    tra mat/nho mat/boi/dat tai cho).
  CAP/HAP/VAP luon hoi (module co beta-lactam va thuoc toan than).
*/
const TOPICAL_RE = /nhỏ mắt|tra mắt|tại mắt|thuốc mỡ tra|bôi|gel |đặt âm đạo|nhỏ tai|tại chỗ/i;

export function relevanceOf(diseaseId: string): { allergy: boolean; renal: boolean } {
  if (kindOf(diseaseId) !== "generic") return { allergy: true, renal: true };
  const regs = getRegimensForDisease(diseaseId);
  if (regs.length === 0) return { allergy: true, renal: true };
  const texts = regs.flatMap((r) => r.drugs.map((d) => `${d.name}: ${d.dose}`));
  const bl = betaLactamFlags(texts);
  const allergy = bl.penicillin || bl.cephalosporin || bl.carbapenem || bl.unspecified;
  const renal = regs.some((r) => !TOPICAL_RE.test(`${r.scenario} ${r.drugs.map((d) => `${d.name} ${d.dose}`).join(" ")}`));
  return { allergy, renal };
}

function baseQuestions(
  input: PatientInput,
  askPopulation: boolean,
  relevance: { allergy: boolean; renal: boolean } = { allergy: true, renal: true }
): Question[] {
  const qs: Question[] = [];
  if (askPopulation) {
    qs.push({
      key: "population",
      label: "Đối tượng",
      required: true,
      options: [
        { value: "adult", label: "Người lớn" },
        { value: "child", label: "Trẻ em / sơ sinh" },
      ],
    });
  }
  if (input.population !== "child") {
    qs.push({
      key: "pregnant",
      label: "Đang mang thai",
      required: true,
      options: [
        { value: "no", label: "Không / không áp dụng" },
        { value: "yes", label: "Có" },
        { value: "unknown", label: "Không rõ" },
      ],
    });
  }
  if (relevance.allergy) {
    qs.push({ key: "penicillinAllergy", label: "Dị ứng penicillin", required: true, options: [...YES_NO, { value: "unknown", label: "Không rõ" }], help: [COMMON_HELP.allergy] });
  }
  if (!relevance.renal) return qs;
  qs.push({
    key: "renal",
    label: "Chức năng thận",
    required: true,
    options: [
      { value: "normal", label: "Bình thường (đã đánh giá)" },
      { value: "impaired", label: "Suy giảm – nhập CrCl" },
      { value: "unknown", label: "Không rõ" },
    ],
    help: [COMMON_HELP.renal],
  });
  if (input.renal === "impaired") {
    qs.push({ key: "crcl", label: "CrCl (mL/phút)", required: true, options: [], kind: "number" });
  }
  return qs;
}

function genericCandidates(diseaseId: string, input: PatientInput) {
  const disease = DISEASES.find((d) => d.id === diseaseId)!;
  const all = scenariosOf(diseaseId);
  const notes: string[] = [];
  let list = all;

  // 1. Doi tuong
  if (input.population === "child") {
    const kids = list.filter((s) => populationOf(s.name) === "child");
    if (kids.length > 0) list = kids;
    else {
      list = list.filter((s) => populationOf(s.name) === "unspecified");
      if (list.length > 0) notes.push("Nguồn không có tình huống ghi riêng cho trẻ em; các tình huống dưới đây không ghi nhóm tuổi – kiểm tra liều trẻ em.");
    }
  } else if (input.population === "adult") {
    list = list.filter((s) => populationOf(s.name) !== "child");
  }

  // 2. Thai ky
  if (input.pregnant === "yes") {
    const ob = list.filter((s) => populationOf(s.name) === "obstetric");
    if (ob.length > 0) list = ob;
    else notes.push("Nguồn không có phác đồ riêng cho thai kỳ ở mặt bệnh này – kiểm tra chống chỉ định từng thuốc (module An toàn thai kỳ).");
  } else if (input.pregnant === "no" && diseaseAudience(disease) !== "child") {
    const nonOb = list.filter((s) => populationOf(s.name) !== "obstetric");
    if (nonOb.length > 0) list = nonOb;
  }

  // 2b. Tinh huong chi danh cho nguoi di ung (vd. QĐ 1530 "di ung hoac khong dung nap
  //     β-lactam"): bo khi nguoi benh DA XAC NHAN khong di ung.
  if (input.penicillinAllergy === "no") {
    const nonAllergy = list.filter((s) => !s.items.every((i) => i.role === "allergy"));
    if (nonAllergy.length > 0) list = nonAllergy;
  }

  // 3. Muc do / nguy co da khang (theo tieu chi trong ten tinh huong)
  const sevClasses = new Set(list.map((s) => severityOf(s.name, s.items.every((i) => i.role === "severe") ? "severe" : undefined)));
  const needSeverity = sevClasses.has("mild") && sevClasses.has("severe");
  if (needSeverity && (input.severity === "mild" || input.severity === "severe")) {
    list = list.filter((s) => {
      const sev = severityOf(s.name, s.items.every((i) => i.role === "severe") ? "severe" : undefined);
      return sev === "unspecified" || sev === input.severity;
    });
  }
  const mdrClasses = new Set(list.map((s) => mdrOf(s.name)));
  const needMdr = mdrClasses.has("low") && mdrClasses.has("high");
  if (needMdr && (input.mdr === "yes" || input.mdr === "no")) {
    const want = input.mdr === "yes" ? "high" : "low";
    list = list.filter((s) => {
      const m = mdrOf(s.name);
      return m === "unspecified" || m === want;
    });
  }

  // 4. Vi sinh (tuy chon)
  if (input.micro && input.micro !== "none") {
    const re = MICRO_RE[input.micro];
    const hit = list.filter((s) => re.test(s.name));
    if (hit.length > 0) list = hit;
    else notes.push("Nguồn không có tình huống riêng cho tác nhân đã chọn ở mặt bệnh này – xem module Theo tác nhân và Antibiogram BV199.");
  }

  return { disease, all, list, notes, needSeverity, needMdr };
}

export function questionsFor(diseaseId: string, input: PatientInput): Question[] {
  const kind = kindOf(diseaseId);
  const disease = DISEASES.find((d) => d.id === diseaseId);
  if (!disease) return [];

  if (kind === "cap") {
    const qs = baseQuestions(input, true);
    if (input.population === "child") return qs;
    qs.push({
      key: "capSetting",
      label: "Nơi điều trị theo mức độ (QĐ 2147)",
      required: true,
      options: [
        { value: "outpatient", label: "Ngoại trú" },
        { value: "ward", label: "Nội trú – không ICU" },
        { value: "icu", label: "Nặng – ICU" },
      ],
      help: CAP_SCENARIOS.map((s) => `${s.name}: ${s.description}`),
    });
    if (input.capSetting === "outpatient") {
      qs.push({ key: "capSevere", label: "Đánh giá nặng (không phù hợp ngoại trú)", required: true, options: YES_NO });
      qs.push({
        key: "capRisk",
        label: "≥ 65 tuổi, bệnh đồng mắc, suy giảm miễn dịch, kháng sinh trong 3 tháng hoặc nguy cơ kháng thuốc",
        required: true,
        options: YES_NO,
      });
    }
    if (input.capSetting === "ward" || input.capSetting === "icu") {
      qs.push({ key: "pseudoRisk", label: "Nguy cơ nhiễm P. aeruginosa", required: true, options: YES_NO });
      qs.push({ key: "mrsaRisk", label: "Nghi MRSA / chưa loại trừ S. aureus", required: true, options: YES_NO });
    }
    return qs;
  }

  if (kind === "hap" || kind === "vap") {
    const qs = baseQuestions(input, true);
    if (input.population === "child") return qs;
    const risk = HAPVAP_RISK[kind];
    if (kind === "hap") {
      qs.push({ key: "hapSevere", label: "Nguy cơ tử vong cao (thở máy do VPBV hoặc sốc nhiễm khuẩn)", required: true, options: YES_NO, help: [risk[0]] });
      qs.push({ key: "mdrRisk", label: "Nguy cơ vi khuẩn đa kháng", required: true, options: YES_NO, help: [risk[1], risk[2]] });
      qs.push({ key: "mrsaRisk", label: "Nguy cơ MRSA", required: true, options: YES_NO, help: [risk[3]] });
    } else {
      qs.push({ key: "mdrRisk", label: "Nguy cơ vi khuẩn đa kháng", required: true, options: YES_NO, help: [risk[0], risk[1]] });
      qs.push({ key: "mrsaRisk", label: "Nguy cơ MRSA", required: true, options: YES_NO, help: [risk[2]] });
      qs.push({
        key: "unitResistance",
        label: "Tỷ lệ Gram âm kháng thuốc định đơn trị tại đơn vị",
        required: true,
        options: [
          { value: "lt10", label: "< 10%" },
          { value: "gt10", label: "> 10%" },
          { value: "unknown", label: "Chưa biết" },
        ],
        help: ["Theo nguồn, chưa biết tỷ lệ được xử lý như > 10%."],
      });
    }
    return qs;
  }

  // Generic (phac do BYT)
  const audience = diseaseAudience(disease);
  const qs = baseQuestions(input, audience === "any", relevanceOf(diseaseId));
  const c = genericCandidates(diseaseId, { ...input, population: input.population ?? (audience === "child" ? "child" : audience === "adult" ? "adult" : undefined) });
  if (c.needSeverity) {
    const examples = c.list.map((s) => s.name).filter((n) => severityOf(n) !== "unspecified").slice(0, 6);
    qs.push({
      key: "severity",
      label: "Mức độ (theo tiêu chí của nguồn)",
      required: true,
      options: [
        { value: "mild", label: "Nhẹ / ngoại trú" },
        { value: "severe", label: "Nặng / ICU" },
        { value: "unknown", label: "Không rõ" },
      ],
      help: examples,
    });
  }
  if (c.needMdr) {
    const examples = c.list.map((s) => s.name).filter((n) => mdrOf(n) !== "unspecified").slice(0, 6);
    qs.push({ key: "mdr", label: "Nguy cơ kháng thuốc / nhiễm khuẩn bệnh viện (theo tiêu chí của nguồn)", required: true, options: [...YES_NO, { value: "unknown", label: "Không rõ" }], help: examples });
  }
  qs.push({
    key: "micro",
    label: "Vi sinh / tác nhân nghi ngờ (nếu có)",
    required: false,
    options: [
      { value: "none", label: "Chưa có" },
      { value: "mssa", label: "S. aureus nhạy methicilin" },
      { value: "mrsa", label: "MRSA" },
      { value: "pseudomonas", label: "P. aeruginosa" },
      { value: "esbl", label: "Vi khuẩn sinh ESBL" },
      { value: "anaerobe", label: "Vi khuẩn kỵ khí" },
    ],
  });
  const ready = (!c.needSeverity || input.severity) && (!c.needMdr || input.mdr);
  /* "Khong ro" muc do/nguy co: khong loc tinh huong theo truc do (xem genericCandidates). */
  if (ready && c.list.length > 1) {
    qs.push({
      key: "scenario",
      label: "Tình huống lâm sàng (theo nguồn)",
      required: true,
      options: c.list.map((s) => ({ value: s.name, label: s.name })),
    });
  }
  return qs;
}

/* ======================= Danh gia ======================= */

function missingOf(questions: Question[], input: PatientInput): string[] {
  return questions
    .filter((q) => q.required)
    .filter((q) => {
      const v = input[q.key];
      if (q.kind === "number") return typeof v !== "number" || !Number.isFinite(v) || v < 0;
      return v === undefined || v === "";
    })
    .map((q) => q.label);
}

function docLabel(regimen: Regimen): string {
  const doc = DOCS[regimen.source.doc];
  return `QĐ ${doc.number} (${doc.date}) · ${regimen.source.section} · ${regimen.source.page}`;
}

const NO_DOSE_RE = /không nêu liều/i;

/* Lua chon (hoac / mot trong / chon mot) -> penicillin khong bat buoc. */
const CHOICE_RE = /hoặc|một trong|chọn một|chọn tối đa/i;

/*
  "mandatory": penicillin la thanh phan bat buoc -> loai khi di ung.
  "optional": penicillin chi la mot lua chon trong danh sach -> giu, canh bao bo thanh phan penicillin.
*/
function penicillinUse(drugs: { name: string; dose: string }[]): "none" | "mandatory" | "optional" {
  let found: "none" | "optional" = "none";
  for (const d of drugs) {
    const text = `${d.name}: ${d.dose}`;
    if (!betaLactamFlags([text]).penicillin) continue;
    if (!CHOICE_RE.test(text)) return "mandatory";
    /* Master Task 5: "oxacilin hoac nafcilin" – moi lua chon deu la penicillin -> van bat buoc. */
    const alternatives = text
      .split(/;|\bhoặc\b|\bmột trong\b|,/i)
      .map((s) => s.trim())
      .filter((s) => findDrugs([s]).length > 0 || betaLactamFlags([s]).penicillin);
    if (alternatives.length > 0 && alternatives.every((s) => betaLactamFlags([s]).penicillin)) return "mandatory";
    found = "optional";
  }
  return found;
}

const PEN_OPTIONAL_WARN =
  "Dị ứng penicillin: phương án có lựa chọn thuộc nhóm penicillin – chỉ dùng các lựa chọn không phải penicillin trong danh sách.";

function fromRegimen(regimen: Regimen, reason: string): Option {
  return {
    id: regimen.id,
    title: regimen.scenario,
    drugs: regimen.drugs.map((d) => ({ name: d.name, dose: d.dose })),
    duration: regimen.duration ?? "Nguồn không ghi thời gian ở phương án này",
    reason,
    warnings: regimen.notes ?? [],
    source: docLabel(regimen),
    noDose: doseEvidenceOf(regimen) === "MISSING_DOSE_EVIDENCE" || regimen.drugs.some((d) => NO_DOSE_RE.test(d.dose)),
    alerts: safetyAlertsFor(regimen.id).map((a) => ({ level: a.level, title: a.title, text: a.text, checklist: a.checklist })),
    doseEvidence: doseEvidenceOf(regimen),
    supplement: supplementOf(regimen.id),
    missingDoseReason: doseEvidenceOf(regimen) === "MISSING_DOSE_EVIDENCE" ? missingDoseReason(regimen.id) : undefined,
  };
}

function supplementOf(regimenId: string): Option["supplement"] {
  const sup = doseSupplementFor(regimenId);
  if (!sup) return undefined;
  return {
    kind: sup.kind,
    items: sup.items,
    scope: sup.scope,
    source: `${sup.source.title} · ${sup.source.locator} (xác minh ${sup.checkedOn})`,
    url: sup.source.url,
    complete: sup.coversAll,
    stillMissing: sup.stillMissing,
  };
}

function allergyWarnings(texts: string[], allergic: boolean): string[] {
  if (!allergic) return [];
  const f = betaLactamFlags(texts);
  const out: string[] = [];
  if (f.cephalosporin || f.carbapenem || f.unspecified) {
    out.push("Dị ứng penicillin: phương án có beta-lactam khác (cephalosporin/carbapenem) – đánh giá phản ứng chéo theo module Dị ứng kháng sinh trước khi dùng.");
  }
  return out;
}

function evaluateGeneric(diseaseId: string, input: PatientInput): Result {
  const disease = DISEASES.find((d) => d.id === diseaseId)!;
  const audience = diseaseAudience(disease);
  const effective: PatientInput = {
    ...input,
    population: input.population ?? (audience === "child" ? "child" : audience === "adult" ? "adult" : undefined),
  };
  if (audience === "child" && input.population === "adult") {
    return { status: "no-match", message: "Mặt bệnh này dành cho trẻ em/sơ sinh." };
  }
  if (audience === "adult" && input.population === "child") {
    return { status: "no-match", message: "Mặt bệnh này dành cho người lớn." };
  }

  const questions = questionsFor(diseaseId, effective);
  const c = genericCandidates(diseaseId, effective);
  const missing = missingOf(questions, effective);

  if (c.all.length === 0) {
    return { status: "no-match", message: "Không có phác đồ BYT trong cơ sở dữ liệu cho mặt bệnh này." };
  }
  if (c.list.length === 0) {
    return { status: "no-match", message: "Không có tình huống nào của nguồn khớp với thông tin người bệnh đã nhập." };
  }
  if (missing.length > 0) {
    return { status: "need-input", missing, candidates: c.list.length };
  }

  const scn = c.list.length === 1 ? c.list[0] : c.list.find((s) => s.name === effective.scenario);
  if (!scn) {
    return { status: "need-input", missing: ["Tình huống lâm sàng (theo nguồn)"], candidates: c.list.length };
  }

  const allergic = effective.penicillinAllergy === "yes";
  const excluded: Excluded[] = [];
  const kept: Regimen[] = [];
  for (const item of scn.items) {
    if (allergic && penicillinUse(item.drugs) === "mandatory") {
      excluded.push({ title: item.drugs.map((d) => d.name).join(" + "), reason: "Penicillin là thành phần bắt buộc – người bệnh dị ứng penicillin." });
      continue;
    }
    if (!allergic && item.role === "allergy") {
      excluded.push({ title: item.drugs.map((d) => d.name).join(" + "), reason: "Phương án dành cho người dị ứng – người bệnh không dị ứng penicillin." });
      continue;
    }
    kept.push(item);
  }

  const sourcePriority = scn.items.some((i) => i.role === "first") && scn.items.some((i) => i.role === "alternative");
  const main = kept.filter((i) => i.role === "first" || i.role === "severe");
  const alt = kept.filter((i) => i.role === "alternative" || i.role === "allergy");
  const special = kept.filter((i) => i.role === "pathogen" || i.role === "adjunct");

  const mk = (item: Regimen): Option => {
    const texts = item.drugs.map((d) => `${d.name}: ${d.dose}`);
    const reasonParts = [`Khớp tình huống của nguồn: "${scn.name}".`];
    if (item.role === "allergy") reasonParts.push("Nguồn ghi cho người dị ứng/không dung nạp.");
    if (item.role === "pathogen") reasonParts.push("Nguồn ghi theo tác nhân nghi ngờ/xác định.");
    if (item.role === "adjunct") reasonParts.push("Nguồn ghi là điều trị kèm theo.");
    const opt = fromRegimen(item, reasonParts.join(" "));
    const penWarn = allergic && penicillinUse(item.drugs) === "optional" ? [PEN_OPTIONAL_WARN] : [];
    opt.warnings = [...penWarn, ...allergyWarnings(texts, allergic), ...opt.warnings];
    return opt;
  };

  const groups: Group[] = [];
  if (main.length > 0) {
    groups.push({
      kind: "main",
      label: sourcePriority ? "Ưu tiên (theo nguồn)" : "Lựa chọn theo nguồn",
      note: sourcePriority
        ? "Nguồn phân biệt lựa chọn ưu tiên và thay thế. Trong nhóm: không xếp hạng, giữ thứ tự của nguồn."
        : "Nguồn không xác định thứ tự ưu tiên giữa các phương án – hệ thống không xếp hạng.",
      options: main.map(mk),
    });
  }
  if (alt.length > 0) {
    groups.push({ kind: "alternative", label: "Thay thế (theo nguồn)", note: "Giữ thứ tự của nguồn.", options: alt.map(mk) });
  }
  if (special.length > 0) {
    groups.push({ kind: "special", label: "Trường hợp đặc biệt", note: "Chỉ áp dụng khi đúng điều kiện nguồn ghi.", options: special.map(mk) });
  }

  const limits: string[] = [...c.notes];
  if (groups.flatMap((g) => g.options).some((o) => o.noDose)) {
    limits.push("Có phương án mà nguồn BYT không nêu liều – không dùng làm khuyến cáo liều; xem Hiệu chỉnh liều/Dược thư.");
  }
  if (groups.length === 0) {
    limits.push("Tất cả phương án của tình huống này bị loại theo thông tin người bệnh (xem danh sách bị loại).");
  }

  const docs = Array.from(new Set(scn.items.map((i) => `QĐ ${DOCS[i.source.doc].number}`)));
  return {
    status: "ready",
    certainty: limits.length > 0 ? "limited" : "complete",
    scenarioLabel: scn.name,
    criteria: [scn.name],
    groups,
    excluded,
    warnings: [],
    limits,
    sourceSummary: `Phác đồ Bộ Y tế: ${docs.join(", ")}`,
    intlAvailable: (getIntlEntry(diseaseId)?.guidelineIds.length ?? 0) > 0,
  };
}

/* ---------- CAP (QĐ 2147) ---------- */

function capOption(r: CapRegimen, reason: string, allergic: boolean): Option {
  const texts = r.drugs.map((d) => `${d.name}: ${d.dose}`);
  return {
    id: r.id,
    title: r.name,
    drugs: r.drugs.map((d) => ({ name: d.name, dose: d.dose, route: d.route, caution: d.caution })),
    duration: "Theo Mục 5.2 và 5.6.2 của QĐ 2147 (xem module CAP)",
    reason,
    warnings: [...allergyWarnings(texts, allergic), ...(r.caution ? [r.caution] : []), ...r.drugs.flatMap((d) => (d.caution ? [d.caution] : []))],
    source: `QĐ 2147/QĐ-BYT (15/07/2026) · ${r.source}`,
    noDose: false,
  };
}

function evaluateCap(input: PatientInput): Result {
  if (input.population === "child") {
    return { status: "no-match", message: "Module CAP (QĐ 2147) áp dụng cho người lớn. Trẻ em: chọn mặt bệnh \"Viêm phổi cộng đồng ở trẻ em\"." };
  }
  const missing = missingOf(questionsFor("v8-1", input), input);
  if (missing.length > 0) return { status: "need-input", missing, candidates: CAP_SCENARIOS.length };

  const ctx: PatientContext = {
    ...DEFAULT_CONTEXT,
    isAdult: true,
    setting: input.capSetting!,
    severe: input.capSevere === "yes",
    elderlyOrComorbid: input.capRisk === "yes",
    penicillinAllergy: input.penicillinAllergy === "yes",
    renalImpaired: input.renal === "impaired",
    pregnant: input.pregnant === "yes",
  };
  const sel = selectScenario("cap", ctx);
  if (!sel.eligible || !sel.scenarioId) return { status: "no-match", message: sel.reason };
  const scn = CAP_SCENARIOS.find((s) => s.id === sel.scenarioId)!;
  const allergic = input.penicillinAllergy === "yes";

  const main: Option[] = [];
  const alt: Option[] = [];
  const special: Option[] = [];
  const excluded: Excluded[] = [];

  for (const r of scn.regimens) {
    const name = r.name;
    const isAllergy = /dị ứng/i.test(name);
    // Chi loai khi ten phuong an ghi ro thuoc "chong Pseudomonas/MRSA"; "nghi ..." -> truong hop dac biet.
    const needsPseudo = /chống Pseudomonas/i.test(name);
    const needsMrsa = /chống MRSA/i.test(name);
    const suspected = /nghi /i.test(name);
    if (allergic && penicillinUse(r.drugs) === "mandatory") {
      excluded.push({ title: name, reason: "Penicillin là thành phần bắt buộc – người bệnh dị ứng penicillin." });
      continue;
    }
    if (needsPseudo && input.pseudoRisk !== "yes") {
      excluded.push({ title: name, reason: "Nguồn chỉ dùng khi có nguy cơ P. aeruginosa – người bệnh không có nguy cơ." });
      continue;
    }
    if (needsMrsa && input.mrsaRisk !== "yes") {
      excluded.push({ title: name, reason: "Nguồn dùng khi nghi MRSA – người bệnh không có nguy cơ." });
      continue;
    }
    if (isAllergy && !allergic) {
      excluded.push({ title: name, reason: "Phương án cho người dị ứng – người bệnh không dị ứng penicillin." });
      continue;
    }
    const reason = `${sel.reason} ${r.indication}`;
    const opt = capOption(r, reason, allergic);
    if (allergic && penicillinUse(r.drugs) === "optional") opt.warnings.unshift(PEN_OPTIONAL_WARN);
    if (isAllergy) alt.push(opt);
    else if (needsPseudo || needsMrsa || suspected || /có điều kiện|khi nhiều khả năng/i.test(name)) special.push(opt);
    else main.push(opt);
  }

  const groups: Group[] = [];
  if (main.length) groups.push({ kind: "main", label: "Lựa chọn theo nguồn", note: "QĐ 2147 nêu các lựa chọn ngang nhau ở nhánh này; hệ thống không xếp hạng. Đọc chỉ định của từng phương án.", options: main });
  if (alt.length) groups.push({ kind: "alternative", label: "Thay thế – dị ứng", note: "Theo ghi chú dị ứng của nguồn.", options: alt });
  if (special.length) groups.push({ kind: "special", label: "Trường hợp đặc biệt", note: "Có điều kiện riêng của nguồn (kháng thuốc, tác nhân).", options: special });

  const limits: string[] = [];
  if (input.pregnant === "yes") limits.push("Module CAP chưa có dữ liệu riêng cho thai kỳ – kiểm tra chống chỉ định từng thuốc (module An toàn thai kỳ).");
  if (groups.length === 0) limits.push("Tất cả phương án của nhánh này bị loại theo thông tin người bệnh.");

  return {
    status: "ready",
    certainty: limits.length ? "limited" : "complete",
    scenarioLabel: scn.name,
    criteria: [scn.description],
    groups,
    excluded,
    warnings: scn.alerts,
    limits,
    sourceSummary: "QĐ 2147/QĐ-BYT (15/07/2026) – Hướng dẫn chẩn đoán và điều trị VPMPCĐ ở người lớn",
    intlAvailable: true,
  };
}

/* ---------- HAP / VAP (Hoi 2023) ---------- */

function hvOption(r: HapVapRegimen, reason: string, allergic: boolean): Option {
  const texts = r.drugs.map((d) => `${d.name}: ${d.dose}`);
  return {
    id: r.id,
    title: r.name,
    drugs: r.drugs.map((d) => ({ name: d.name, dose: d.dose, route: d.route, caution: d.caution })),
    duration: "Theo Mục 1.3 và Mục 4 của khuyến cáo (xem module HAP/VAP)",
    reason,
    warnings: [...allergyWarnings(texts, allergic), ...r.notes, ...r.drugs.flatMap((d) => (d.caution ? [d.caution] : []))],
    source: `Khuyến cáo Hội Hô hấp VN & Hội HSCC-CĐ VN 2023 · ${r.source}`,
    noDose: false,
  };
}

function evaluateHapVap(kind: "hap" | "vap", input: PatientInput): Result {
  if (input.population === "child") {
    return { status: "no-match", message: `Module ${kind.toUpperCase()} áp dụng cho người lớn.` };
  }
  const id = kind === "hap" ? "v8-4" : "v8-5";
  const missing = missingOf(questionsFor(id, input), input);
  if (missing.length > 0) return { status: "need-input", missing, candidates: HAPVAP_SCENARIOS[kind].length };

  const ctx: PatientContext = {
    ...DEFAULT_CONTEXT,
    isAdult: true,
    severe: input.hapSevere === "yes",
    mdrRisk: input.mdrRisk === "yes",
    mrsaRisk: input.mrsaRisk === "yes",
    unitResistance: input.unitResistance ?? "unknown",
    penicillinAllergy: input.penicillinAllergy === "yes",
    renalImpaired: input.renal === "impaired",
    pregnant: input.pregnant === "yes",
  };
  const sel = selectScenario(kind, ctx);
  if (!sel.eligible || !sel.scenarioId) return { status: "no-match", message: sel.reason };
  const scn = HAPVAP_SCENARIOS[kind].find((s) => s.id === sel.scenarioId)!;
  const allergic = input.penicillinAllergy === "yes";
  const excluded: Excluded[] = [];
  const opts: Option[] = [];
  for (const r of scn.regimens) {
    if (allergic && penicillinUse(r.drugs) === "mandatory") {
      excluded.push({ title: r.name, reason: "Penicillin là thành phần bắt buộc – người bệnh dị ứng penicillin." });
      continue;
    }
    const opt = hvOption(r, `${sel.reason} ${r.indication}`, allergic);
    if (allergic && penicillinUse(r.drugs) === "optional") opt.warnings.unshift(PEN_OPTIONAL_WARN);
    opts.push(opt);
  }
  const limits: string[] = [
    "Đây là khuyến cáo hội chuyên ngành (không phải văn bản BYT); văn bản BYT (QĐ 708/1493) xem Tab Bộ Y tế.",
  ];
  if (input.pregnant === "yes") limits.push("Khuyến cáo chưa có dữ liệu riêng cho thai kỳ – kiểm tra chống chỉ định từng thuốc.");
  if (opts.length === 0) limits.push("Tất cả tổ hợp ví dụ bị loại; xây dựng tổ hợp từ danh sách thuốc theo quy tắc của bảng.");

  return {
    status: "ready",
    certainty: "limited",
    scenarioLabel: scn.title,
    criteria: [scn.description],
    groups: opts.length
      ? [{ kind: "main", label: "Tổ hợp ví dụ theo nguồn", note: "Nguồn nêu quy tắc chọn thuốc; các tổ hợp là ví dụ, không xếp hạng.", options: opts }]
      : [],
    excluded,
    warnings: [],
    limits,
    sourceSummary: "Khuyến cáo chẩn đoán và điều trị VPBV/VPLQTM 2023 – Hội Hô hấp VN & Hội HSCC-CĐ VN",
    pool: scn.pool?.map((p) => ({ title: p.title, drugs: p.drugs.map((d) => ({ name: d.name, dose: d.dose, route: d.route, caution: d.caution })) })),
    intlAvailable: true,
  };
}

/* ======================= API chinh ======================= */

function evaluateRaw(diseaseId: string, input: PatientInput): Result {
  const disease = DISEASES.find((d) => d.id === diseaseId);
  if (!disease) return { status: "no-match", message: "Không tìm thấy mặt bệnh." };
  const kind = kindOf(diseaseId);
  if (kind === "cap") return evaluateCap(input);
  if (kind === "hap" || kind === "vap") return evaluateHapVap(kind, input);
  return evaluateGeneric(diseaseId, input);
}

/*
  Buoc 4D.3 – Safety Gate o tang engine (khong chi nhan UI):
  - Moi ket qua "ready" mang trang thai phe duyet HĐT&ĐT (approvals.ts). Chua phe duyet ->
    clinicalUse = "clinician-decision-required": chi la tham khao theo nguon, KHONG tu dong ap dung.
  - Phuong an co canh bao an toan muc "critical" -> requiresReview = true va certainty
    ha xuong "limited", kem gioi han neu ro ly do.
*/
export function evaluate(diseaseId: string, input: PatientInput): Result {
  const result = evaluateRaw(diseaseId, input);
  if (result.status !== "ready") return result;
  const approval = approvalFor(diseaseId).status;
  /* Buoc 4D.4: khoa de xuat tu dong voi phuong an co loi lieu/duong dung nghiem trong
     chua giai quyet, hoac lieu khong dung cho nhom doi tuong (vd. lieu nguoi lon cho tre em). */
  const excluded = [...result.excluded];
  const blockedGroups = result.groups.map((g) => ({
    ...g,
    options: g.options.filter((o) => {
      const blocks = autoRecommendBlocks(o.id, input.population);
      if (blocks.length === 0) return true;
      excluded.push({
        title: o.title,
        reason: `ĐÃ KHÓA ĐỀ XUẤT TỰ ĐỘNG – ${blocks.map((b) => b.blockReason ?? b.title).join(" ")} Phương án vẫn xem được ở module Kinh nghiệm; cần HĐT&ĐT quyết định.`,
        eligibility: "SAFETY_BLOCKED",
      });
      return false;
    }),
  })).filter((g) => g.options.length > 0);
  const groups = blockedGroups.map((g) => ({
    ...g,
    options: g.options.map((o) => {
      const requiresReview = (o.alerts ?? []).some((a) => a.level === "critical");
      const { conditions, notInFormulary } = conditionsFor(o, g.kind, input, requiresReview);
      return {
        ...o,
        approved: approval === "APPROVED_FOR_CLINICAL_USE",
        requiresReview,
        conditions,
        notInFormulary,
        eligibility: (conditions.length > 0 ? "CONDITIONAL" : "ELIGIBLE") as Eligibility,
      };
    }),
  }));
  for (const e of excluded) if (!e.eligibility) e.eligibility = "NOT_ELIGIBLE";
  const allOpts = groups.flatMap((g) => g.options);
  const eligibilityCount: Record<Eligibility, number> = {
    ELIGIBLE: allOpts.filter((o) => o.eligibility === "ELIGIBLE").length,
    CONDITIONAL: allOpts.filter((o) => o.eligibility === "CONDITIONAL").length,
    NOT_ELIGIBLE: excluded.filter((e) => e.eligibility === "NOT_ELIGIBLE").length,
    SAFETY_BLOCKED: excluded.filter((e) => e.eligibility === "SAFETY_BLOCKED").length,
  };
  const unknowns = unknownsOf(input);
  const critical = groups.flatMap((g) => g.options).filter((o) => o.requiresReview);
  const limits = [...result.limits];
  const blockedCount = excluded.length - result.excluded.length;
  if (blockedCount > 0) {
    limits.unshift(`${blockedCount} phương án bị khóa đề xuất tự động do lỗi liều/đường dùng nghiêm trọng chưa giải quyết hoặc không phù hợp nhóm đối tượng (xem danh sách bị loại).`);
  }
  if (groups.length === 0) limits.unshift("Không còn phương án đủ điều kiện đề xuất tự động cho tình huống này.");
  if (critical.length > 0) {
    limits.unshift(`${critical.length} phương án có cảnh báo NGUY CƠ CAO – cần dược sĩ/HĐT&ĐT xác nhận trước khi dùng.`);
  }
  return {
    ...result,
    groups,
    limits,
    excluded,
    certainty: critical.length > 0 || blockedCount > 0 ? "limited" : result.certainty,
    approval,
    clinicalUse: approval === "APPROVED_FOR_CLINICAL_USE" ? "approved" : "clinician-decision-required",
    eligibilityCount,
    unknowns,
  };
}

/* ---- Master Task 5: dieu kien con phai xac nhan cho tung phuong an ---- */
const UNKNOWN_LABEL: Partial<Record<QuestionKey, string>> = {
  penicillinAllergy: "dị ứng penicillin",
  pregnant: "thai kỳ",
  renal: "chức năng thận",
  severity: "mức độ nặng",
  mdr: "nguy cơ kháng thuốc",
};

function unknownsOf(input: PatientInput): string[] {
  return (Object.keys(UNKNOWN_LABEL) as QuestionKey[])
    .filter((k) => input[k] === "unknown")
    .map((k) => UNKNOWN_LABEL[k] as string);
}

function conditionsFor(
  o: Option,
  groupKind: Group["kind"],
  input: PatientInput,
  requiresReview: boolean
): { conditions: string[]; notInFormulary: string[] } {
  const texts = o.drugs.map((d) => `${d.name}: ${d.dose}`);
  const bl = betaLactamFlags(texts);
  const anyBetaLactam = bl.penicillin || bl.cephalosporin || bl.carbapenem || bl.unspecified;
  const out: string[] = [];
  if (input.penicillinAllergy === "unknown" && anyBetaLactam) out.push("Chưa rõ tiền sử dị ứng penicillin – xác nhận trước khi dùng beta-lactam.");
  if (input.pregnant === "unknown") out.push("Chưa rõ thai kỳ – kiểm tra chống chỉ định từng thuốc.");
  if (input.renal === "unknown") out.push("Chưa đánh giá chức năng thận – liều trên là liều chức năng thận bình thường.");
  if (input.renal === "impaired") out.push(`Suy thận${typeof input.crcl === "number" ? ` (CrCl ${input.crcl} mL/phút)` : ""} – hiệu chỉnh liều từng thuốc.`);
  if (input.severity === "unknown") out.push("Chưa rõ mức độ nặng – đối chiếu tiêu chí tình huống của nguồn.");
  if (input.mdr === "unknown") out.push("Chưa rõ nguy cơ kháng thuốc – đối chiếu tiêu chí tình huống của nguồn.");
  /* Ly do chi tiet nam trong option.missingDoseReason (hien o khung rieng) – dieu kien chi ghi ngan. */
  if (o.noDose) out.push("MISSING_DOSE_EVIDENCE – không đề xuất liều; đối chiếu chuyên luận qua nút Hiệu chỉnh liều.");
  if (o.supplement?.kind === "international" && o.supplement.complete) {
    out.push("Liều bổ sung theo guideline quốc tế (văn bản BYT không nêu liều) – cần dược sĩ/HĐT&ĐT thẩm định trước khi áp dụng.");
  }
  for (const m of o.supplement?.stillMissing ?? []) out.push(`Còn thiếu: ${m}`);
  if (groupKind === "special") out.push("Chỉ áp dụng khi đúng điều kiện nguồn ghi (tác nhân, dị ứng hoặc điều trị kèm).");
  if (requiresReview) out.push("Có cảnh báo NGUY CƠ CAO – cần dược sĩ/HĐT&ĐT xác nhận.");
  const notInFormulary = findDrugs(texts).filter((d) => !inFormulary(d.ingredientId)).map((d) => d.name);
  if (notInFormulary.length > 0) out.push(`Không có trong danh mục BV199: ${notInFormulary.join(", ")}.`);
  return { conditions: out, notInFormulary };
}
