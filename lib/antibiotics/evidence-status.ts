/*
  FILE: lib/antibiotics/evidence-status.ts

  PHAN LOAI BANG CHUNG THEO MAT BENH (Nhiem vu 4C).

  Trang thai mat benh (uu tien tu tren xuong):
  - MISSING_EVIDENCE: khong co phac do CO LIEU tu nguon da xac minh hoac module.
  - NEEDS_REVIEW: co phac do co lieu nhung con it nhat mot ly do can tham dinh chuyen mon
    (chua doi chieu ban chinh thuc, lieu dan Duoc thu chua doi chieu, co canh bao lieu,
    nguon khong neu lieu, nhieu van ban cung ap dung, chi co module quoc te...).
  - VERIFIED_SOURCE: moi phac do co lieu dang hien thi da khop ban chinh thuc, khong con ly do tren.
  SUPERSEDED: ap dung cho TUNG PHAN NOI DUNG bi van ban moi hon thay the (danh sach rieng).

  VERIFIED_SOURCE = da xac minh NGUON; KHONG thay the phe duyet cua Hoi dong Thuoc va Dieu tri BV199.
  Phe duyet ap dung lam sang (APPROVED_FOR_CLINICAL_USE) la truong rieng `approval`, lay tu
  data/antibiotics/empiric/approvals.ts (Buoc 4D.2) – khong suy ra tu trang thai nguon.
*/

import { DISEASES } from "@/data/antibiotics/empiric/catalog";
import {
  CONTENT_ISSUES,
  DOC_EVIDENCE,
  INTL_MODULE_CHECKS,
  DOC_CHECK_TEXT,
  type DocCheck,
} from "@/data/antibiotics/empiric/evidence";
import { INTL_GUIDELINES, getIntlEntry } from "@/data/antibiotics/empiric/international";
import {
  ALL_REGIMENS,
  DOCS,
  KEEP_ALL_SOURCES,
  getRegimensForDisease,
  isConcreteRegimen,
  type DocId,
  type Regimen,
} from "@/data/antibiotics/empiric/regimens";
import verification from "@/data/antibiotics/empiric/verification/official-dose-check.json";
import { manualCheckFor } from "@/data/antibiotics/empiric/verification/manual-checks";
import type { Disease } from "@/data/antibiotics/empiric/types";

import { findDrugs } from "./drug-links";
import { mdrOf, severityOf } from "./clinical-filters";
import { renalDosingDatabase } from "@/data/renal-dosing";
import { APPROVAL_TEXT, approvalFor, type ApprovalStatus } from "@/data/antibiotics/empiric/approvals";
import { doseEvidenceOf, doseSupplementFor } from "@/data/antibiotics/empiric/dose-supplements";

export type EvidenceStatus = "VERIFIED_SOURCE" | "NEEDS_REVIEW" | "MISSING_EVIDENCE" | "SUPERSEDED";

export const STATUS_TEXT: Record<EvidenceStatus, string> = {
  VERIFIED_SOURCE: "Đã xác minh nguồn (chưa phải phê duyệt HĐT&ĐT)",
  NEEDS_REVIEW: "Cần thẩm định chuyên môn",
  MISSING_EVIDENCE: "Chưa đủ bằng chứng",
  SUPERSEDED: "Nội dung đã bị thay thế",
};

type VerifyRow = {
  kind: string;
  id: string;
  doc: string;
  diseaseIds: string[];
  tokens: number;
  found: number;
  missing: string[];
  unverifiable: number;
  status: "match" | "partial" | "mismatch" | "no-dose" | "no-official-text";
};

const ROWS = (verification as { results: VerifyRow[] }).results;
const BYT_ROW = new Map(ROWS.filter((r) => r.kind === "byt").map((r) => [r.id, r]));
export const VERIFICATION_META = {
  generatedOn: (verification as { generatedOn: string }).generatedOn,
  method: (verification as { method: string }).method,
  sources: (verification as { sources: Record<string, string> }).sources,
  summary: (verification as { summary: Record<string, number> }).summary,
};

/* Mat benh dung module rieng co lieu (khong nam trong thu vien regimens/). */
const MODULE_ROWS: Record<string, { kind: string; label: string; verifiedSource: boolean }> = {
  "v8-1": { kind: "module-cap", label: "Module CAP – QĐ 2147/QĐ-BYT (2026)", verifiedSource: true },
  "v8-4": { kind: "module-hap", label: "Module HAP – Khuyến cáo Hội 2023", verifiedSource: true },
  "v8-5": { kind: "module-vap", label: "Module VAP – Khuyến cáo Hội 2023", verifiedSource: true },
};

/* Module quoc te co lieu nhung chua doi chieu lai trong dot nay. */
const INTL_MODULE_DISEASES = new Set(["v8-7", "v8-58", "v8-8", "v8-54", "v8-60", "v8-99"]);

const FLAG_RE = /CẦN DƯỢC SĨ XÁC NHẬN|LIỀU NGHI SAI|CHƯA XÁC MINH|không có trong bản in|thiếu tên hoạt chất/;

export type DocUse = {
  doc: DocId;
  number: string;
  date: string;
  role: "latest" | "older-applied" | "superseded";
  check: DocCheck;
  checkText: string;
};

export type DiseaseEvidence = {
  disease: Disease;
  status: Exclude<EvidenceStatus, "SUPERSEDED">;
  reasons: string[];
  /* Ghi chu thong tin (khong anh huong trang thai), vd. lieu theo guideline quoc te. */
  notes: string[];
  docs: DocUse[];
  superseded: { id: string; doc: DocId; scenario: string }[];
  verification: { regimens: number; match: number; partial: number; mismatch: number; noDose: number; noText: number };
  module?: { label: string; match: number; total: number };
  intl: { status: "extracted" | "identified" | "module" | "none"; guidelines: string[] };
  stratified: boolean;
  durationCoverage: { withDuration: number; dosed: number };
  renalCoverage: { withData: number; drugs: number };
  /* Phe duyet HĐT&ĐT – doc lap voi trang thai nguon */
  approval: { status: ApprovalStatus; text: string; decision?: string };
};

function docTime(doc: DocId): number {
  const raw = DOCS[doc]?.date ?? "";
  const full = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (full) return Date.UTC(+full[3], +full[2] - 1, +full[1]);
  const year = raw.match(/(19|20)\d{2}/);
  return year ? Date.UTC(+year[0], 0, 1) : 0;
}

const RENAL_IDS = new Set(renalDosingDatabase.map((p) => p.ingredientId));

export function evaluateDisease(disease: Disease): DiseaseEvidence {
  const id = disease.id;
  const shown = getRegimensForDisease(id);
  const all = ALL_REGIMENS.filter((r) => r.diseaseIds.includes(id));
  const shownIds = new Set(shown.map((r) => r.id));
  const superseded = all
    .filter((r) => !shownIds.has(r.id))
    .map((r) => ({ id: r.id, doc: r.source.doc, scenario: r.scenario }));

  const reasons: string[] = [];
  const notes: string[] = [];

  /* ---- Van ban ---- */
  const shownDocs = Array.from(new Set(shown.map((r) => r.source.doc)));
  if (id === "v8-1" && !shownDocs.includes("byt2147")) shownDocs.push("byt2147");
  const supDocs = Array.from(new Set(superseded.map((s) => s.doc))).filter((d) => !shownDocs.includes(d));
  const latestTime = Math.max(0, ...shownDocs.map(docTime));
  const docs: DocUse[] = [
    ...shownDocs
      .sort((a, b) => docTime(b) - docTime(a))
      .map<DocUse>((doc) => ({
        doc,
        number: DOCS[doc].number,
        date: DOCS[doc].date,
        role: docTime(doc) === latestTime ? "latest" : "older-applied",
        check: DOC_EVIDENCE[doc].check,
        checkText: DOC_CHECK_TEXT[DOC_EVIDENCE[doc].check],
      })),
    ...supDocs.map<DocUse>((doc) => ({
      doc,
      number: DOCS[doc].number,
      date: DOCS[doc].date,
      role: "superseded",
      check: DOC_EVIDENCE[doc].check,
      checkText: DOC_CHECK_TEXT[DOC_EVIDENCE[doc].check],
    })),
  ];

  /* ---- Doi chieu lieu ---- */
  const v = { regimens: shown.length, match: 0, partial: 0, mismatch: 0, noDose: 0, noText: 0 };
  for (const r of shown) {
    const row = BYT_ROW.get(r.id);
    // Lieu nam trong bang khong tach tu dong duoc: dung ket qua doi chieu thu cong neu co.
    const st = row?.status === "mismatch" && manualCheckFor(r.id) ? "match" : row?.status ?? "no-official-text";
    if (st === "match") v.match++;
    else if (st === "partial") v.partial++;
    else if (st === "mismatch") v.mismatch++;
    else if (st === "no-dose") v.noDose++;
    else v.noText++;
  }

  /* Master Task 5: tinh ca phuong an co lieu bo sung du (dose-supplements.ts). */
  const dosedShown = shown.filter((r) => isConcreteRegimen(r) || doseEvidenceOf(r) === "SUPPLEMENTED");
  const missingDose = shown.filter((r) => doseEvidenceOf(r) === "MISSING_DOSE_EVIDENCE");
  const supplemented = shown.filter((r) => doseEvidenceOf(r) === "SUPPLEMENTED");
  const moduleInfo = MODULE_ROWS[id];
  let moduleInfoResult: DiseaseEvidence["module"];
  if (moduleInfo) {
    const rows = ROWS.filter((r) => r.kind === moduleInfo.kind);
    moduleInfoResult = { label: moduleInfo.label, match: rows.filter((r) => r.status === "match").length, total: rows.length };
  }
  const intlEntry = getIntlEntry(id);
  const intlStatuses = intlEntry?.guidelineIds.map((g) => INTL_GUIDELINES[g]?.status) ?? [];
  const intl: DiseaseEvidence["intl"] = {
    status: intlStatuses.includes("extracted") ? "extracted" : intlStatuses.includes("module") ? "module" : intlStatuses.includes("identified") ? "identified" : "none",
    guidelines: intlEntry?.guidelineIds.map((g) => `${INTL_GUIDELINES[g].org} ${INTL_GUIDELINES[g].published.match(/\d{4}/)?.[0] ?? ""}`) ?? [],
  };
  const hasIntlModule = INTL_MODULE_DISEASES.has(id);

  const hasDose = dosedShown.length > 0 || !!moduleInfoResult || hasIntlModule;

  /* ---- Ly do can tham dinh ---- */
  const dosedChecks = dosedShown.map((r) => ({ r, row: BYT_ROW.get(r.id) }));
  const VERIFIABLE: DocCheck[] = ["official-text-checked", "government-copy-checked"];
  const unofficialCopy = dosedChecks.filter(({ r }) => DOC_EVIDENCE[r.source.doc].check === "unofficial-copy-checked");
  if (unofficialCopy.length > 0) {
    const nums = Array.from(new Set(unofficialCopy.map(({ r }) => `QĐ ${DOCS[r.source.doc].number}`)));
    reasons.push(`${unofficialCopy.length} phương án có liều chỉ đối chiếu được với bản sao không chính thức (${nums.join(", ")}); chưa có bản chính thức.`);
  }
  const notOfficial = dosedChecks.filter(({ r }) => !VERIFIABLE.includes(DOC_EVIDENCE[r.source.doc].check) && DOC_EVIDENCE[r.source.doc].check !== "unofficial-copy-checked");
  if (notOfficial.length > 0) {
    const nums = Array.from(new Set(notOfficial.map(({ r }) => `QĐ ${DOCS[r.source.doc].number}`)));
    reasons.push(`${notOfficial.length} phương án có liều đọc từ bản PDF người dùng cung cấp, chưa đối chiếu được bản chính thức (${nums.join(", ")}).`);
  }
  if (v.mismatch > 0) reasons.push(`${v.mismatch} phương án có liều không khớp bản chính thức.`);
  if (v.partial > 0) reasons.push(`${v.partial} phương án có liều dẫn Dược thư 2023 chưa đối chiếu trang gốc.`);
  const flagged = shown.filter((r) => [...(r.notes ?? []), ...r.drugs.map((d) => d.dose + " " + d.name)].some((t) => FLAG_RE.test(t)));
  if (flagged.length > 0) reasons.push(`${flagged.length} phương án có cảnh báo liều/nội dung cần dược sĩ xác nhận.`);
  if (dosedShown.length > 0 && missingDose.length > 0) reasons.push(`${missingDose.length} phương án nguồn BYT không nêu liều (MISSING_DOSE_EVIDENCE – không đề xuất liều).`);
  const intlSupp = supplemented.filter((r) => doseSupplementFor(r.id)?.kind === "international");
  if (intlSupp.length > 0) reasons.push(`${intlSupp.length} phương án dùng liều bổ sung từ guideline quốc tế (BYT không nêu liều) – cần thẩm định.`);
  const sameDocSupp = supplemented.filter((r) => doseSupplementFor(r.id)?.kind === "same-document");
  if (sameDocSupp.length > 0) notes.push(`${sameDocSupp.length} phương án có liều bổ sung từ phụ lục/mục khác của CÙNG văn bản BYT (đã đọc trực tiếp ${doseSupplementFor(sameDocSupp[0].id)!.checkedOn}).`);
  if (KEEP_ALL_SOURCES.includes(id) && shownDocs.length > 1) {
    reasons.push(`Nhiều văn bản BYT cùng áp dụng (${shownDocs.map((d) => `QĐ ${DOCS[d].number}`).join(", ")}) – cần thống nhất khi khác nhau.`);
  }
  if (moduleInfoResult && moduleInfoResult.match < moduleInfoResult.total) reasons.push(`${moduleInfoResult.total - moduleInfoResult.match} phương án module chưa khớp bản chính thức.`);
  if (CONTENT_ISSUES[id]) reasons.push(CONTENT_ISSUES[id]);
  const intlCheck = INTL_MODULE_CHECKS[id];
  if (hasIntlModule && intlCheck) {
    notes.push(`Văn bản BYT không nêu liều; liều theo guideline quốc tế – ${intlCheck.source}, đối chiếu lại ngày ${intlCheck.checkedOn}: ${intlCheck.result}`);
  } else if (hasIntlModule) reasons.push("Văn bản BYT không nêu liều; liều chỉ có trong module quốc tế (NICE NG91/UpToDate, đối chiếu 13/10/2026). Kiểm tra lại 26/10/2026: CDC (2024) xác nhận thuốc ưu tiên/thay thế nhưng không nêu liều; trang NICE chặn truy cập tự động, UpToDate cần tài khoản – liều module CHƯA đối chiếu lại được.");
  if (id === "v8-4" || id === "v8-5") reasons.push("Module là khuyến cáo hội chuyên ngành (đã đối chiếu bản chính thức), không phải văn bản BYT; văn bản BYT hiện hành là QĐ 708/1493 (2015).");

  let status: DiseaseEvidence["status"];
  if (!hasDose) {
    status = "MISSING_EVIDENCE";
    reasons.unshift(
      shown.length > 0
        ? "Văn bản BYT chỉ nêu tên thuốc/nhóm thuốc, không có liều; chưa có guideline quốc tế đã trích có liều."
        : "Không có phác đồ BYT hoặc guideline đã xác minh trong cơ sở dữ liệu."
    );
  } else if (reasons.length > 0) {
    status = "NEEDS_REVIEW";
  } else {
    status = "VERIFIED_SOURCE";
  }

  /* ---- Do bao phu ---- */
  const scenarioNames = Array.from(new Set(shown.map((r) => r.scenario)));
  const stratified =
    !!moduleInfoResult ||
    scenarioNames.length > 1 ||
    scenarioNames.some((n) => severityOf(n) !== "unspecified" || mdrOf(n) !== "unspecified");
  const approvalInfo = approvalFor(id);
  const drugs = findDrugs(dosedShown.flatMap((r) => r.drugs.map((d) => `${d.name}: ${d.dose}`)));

  return {
    disease,
    status,
    reasons,
    notes,
    docs,
    superseded,
    verification: v,
    module: moduleInfoResult,
    intl,
    stratified,
    durationCoverage: { withDuration: dosedShown.filter((r) => !!r.duration).length, dosed: dosedShown.length },
    renalCoverage: { withData: drugs.filter((d) => RENAL_IDS.has(d.ingredientId)).length, drugs: drugs.length },
    approval: {
      status: approvalInfo.status,
      text: APPROVAL_TEXT[approvalInfo.status],
      decision: approvalInfo.record ? `${approvalInfo.record.decisionNumber} (${approvalInfo.record.decisionDate})` : undefined,
    },
  };
}

let CACHE: DiseaseEvidence[] | null = null;

export function evaluateAll(): DiseaseEvidence[] {
  if (!CACHE) CACHE = DISEASES.map(evaluateDisease);
  return CACHE;
}

export function evidenceFor(diseaseId: string): DiseaseEvidence | undefined {
  return evaluateAll().find((e) => e.disease.id === diseaseId);
}

export function summarize() {
  const list = evaluateAll();
  const count = (s: string) => list.filter((e) => e.status === s).length;
  return {
    total: list.length,
    VERIFIED_SOURCE: count("VERIFIED_SOURCE"),
    APPROVED_FOR_CLINICAL_USE: list.filter((e) => e.approval.status === "APPROVED_FOR_CLINICAL_USE").length,
    NEEDS_REVIEW: count("NEEDS_REVIEW"),
    MISSING_EVIDENCE: count("MISSING_EVIDENCE"),
    supersededItems: list.reduce((n, e) => n + e.superseded.length, 0),
    diseasesWithSuperseded: list.filter((e) => e.superseded.length > 0).length,
  };
}

export type { Regimen };
