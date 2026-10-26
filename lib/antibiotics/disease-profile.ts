/*
  FILE: lib/antibiotics/disease-profile.ts

  MASTER TASK 5 – HO SO MAT BENH 20 MUC (kiem toan + "Chi tiet benh" tren giao dien).

  Nguyen tac:
  - Chi GHEP du lieu da co nguon trong ung dung (phac do BYT, module, guideline quoc te,
    canh bao an toan, danh muc BV199, Duoc thu trong module Hieu chinh lieu).
  - Muc khong co du lieu ghi "missing" – KHONG tu suy dien noi dung lam sang.
  - Muc phat hien bang tim tu khoa trong van ban nguon ghi "mentioned" kem vi tri nguon,
    khong dien giai them.
*/

import { DISEASES } from "@/data/antibiotics/empiric/catalog";
import { icdOf } from "@/data/antibiotics/empiric/icd10";
import { INTL_GUIDELINES, getIntlEntry } from "@/data/antibiotics/empiric/international";
import { DOCS, getRegimensForDisease, isConcreteRegimen, type Regimen } from "@/data/antibiotics/empiric/regimens";
import { autoRecommendBlocks, safetyAlertsFor } from "@/data/antibiotics/empiric/safety-alerts";
import { doseEvidenceOf } from "@/data/antibiotics/empiric/dose-supplements";
import { renalDosingDatabase } from "@/data/renal-dosing";

import { mdrOf, severityOf } from "./clinical-filters";
import { findDrugs } from "./drug-links";
import { evidenceFor } from "./evidence-status";
import { inFormulary } from "./formulary";

export type FieldStatus = "available" | "partial" | "mentioned" | "missing";

export type ProfileField = {
  key: string;
  label: string;
  status: FieldStatus;
  /* Tom tat ngan (khong dien giai lam sang) */
  value: string;
  /* Nguon/vi tri */
  source?: string;
};

export type DiseaseProfile = {
  id: string;
  title: string;
  fields: ProfileField[];
  /* So muc co du lieu (available + partial + mentioned) / 20 */
  coverage: number;
  missing: string[];
};

const MODULE_DISEASES: Record<string, string> = {
  "v8-1": "Module CAP – QĐ 2147/QĐ-BYT (2026)",
  "v8-4": "Module HAP – Khuyến cáo Hội Hô hấp VN & Hội HSCC-CĐ VN (2023)",
  "v8-5": "Module VAP – Khuyến cáo Hội Hô hấp VN & Hội HSCC-CĐ VN (2023)",
};

const RENAL_IDS = new Set(renalDosingDatabase.map((p) => p.ingredientId));

function textsOf(regs: Regimen[]): string[] {
  return regs.flatMap((r) => [r.scenario, ...r.drugs.map((d) => `${d.name}: ${d.dose}`), r.duration ?? "", ...(r.notes ?? []).filter((n) => !n.startsWith("ĐỐI CHIẾU LIỀU"))]);
}

function docList(regs: Regimen[]): string {
  return Array.from(new Set(regs.map((r) => `QĐ ${DOCS[r.source.doc].number}`))).join(", ");
}

function mention(regs: Regimen[], intlTexts: string[], re: RegExp): { hit: boolean; where: string } {
  const r = regs.find((x) => textsOf([x]).some((t) => re.test(t)));
  if (r) return { hit: true, where: `QĐ ${DOCS[r.source.doc].number} ${r.source.section}` };
  const i = intlTexts.find((t) => re.test(t));
  if (i) return { hit: true, where: "Khuyến cáo quốc tế (tab Quốc tế)" };
  return { hit: false, where: "" };
}

export function diseaseProfile(diseaseId: string): DiseaseProfile | undefined {
  const d = DISEASES.find((x) => x.id === diseaseId);
  if (!d) return undefined;
  const regs = getRegimensForDisease(diseaseId);
  /* Master Task 5 – Final: tinh ca phuong an co lieu bo sung du (co dan nguon). */
  const dosed = regs.filter((r) => isConcreteRegimen(r) || doseEvidenceOf(r) === "SUPPLEMENTED");
  const supplemented = regs.filter((r) => doseEvidenceOf(r) === "SUPPLEMENTED").length;
  const intl = getIntlEntry(diseaseId);
  const intlTexts = intl ? [...intl.recommendations.map((r) => r.text), ...intl.regimens.flatMap((r) => [r.scenario, ...r.options, r.note ?? ""])] : [];
  const ev = evidenceFor(diseaseId);
  const moduleLabel = MODULE_DISEASES[diseaseId];
  const docs = docList(regs);
  const F: ProfileField[] = [];
  /* Muc "missing" khong gan nguon (tranh hieu nham la co du lieu), tru muc tong hop
     chi ro noi da kiem tra (hieu chinh lieu, danh muc). */
  const add = (key: string, label: string, status: FieldStatus, value: string, source?: string) =>
    F.push({ key, label, status, value, source: status === "missing" && key !== "adjust" && key !== "formulary" ? undefined : source || undefined });

  // 1–3
  const icd = icdOf(diseaseId);
  add("name", "Tên bệnh / ICD-10", icd.length ? "available" : "partial", `${d.title}${icd.length ? ` · ICD-10 ${icd.join(", ")}` : " · chưa gán ICD-10"}`);
  add("specialty", "Chuyên khoa", "available", d.specialty);
  const pops = new Set(regs.map((r) => (/trẻ|sơ sinh|tháng tuổi|nhi/i.test(r.scenario) ? "Trẻ em/sơ sinh" : /thai|sản/i.test(r.scenario) ? "Thai kỳ" : "Không ghi riêng (thường là người lớn)")));
  add("population", "Đối tượng", regs.length || moduleLabel ? "available" : "missing", regs.length ? Array.from(pops).join("; ") : moduleLabel ? "Theo module" : "", docs || moduleLabel);

  // 4 Tieu chuan chan doan lien quan khang sinh
  const dx = mention(regs, intlTexts, /chẩn đoán|tiêu chuẩn|cấy máu|cấy nước tiểu|dịch não tủy|siêu âm tim|TTE|TEE|Duke/i);
  add("diagnosis", "Tiêu chuẩn chẩn đoán liên quan kháng sinh", dx.hit ? "mentioned" : "missing", dx.hit ? "Có đề cập trong nguồn" : "Chưa có trong dữ liệu", dx.where);

  // 5 Phan tang muc do
  const sev = new Set(regs.map((r) => severityOf(r.scenario, r.role)).filter((s) => s !== "unspecified"));
  add("severity", "Phân tầng mức độ", sev.size > 1 || moduleLabel ? "available" : sev.size === 1 ? "partial" : "missing",
    moduleLabel ? "Theo module" : sev.size ? Array.from(sev).map((s) => (s === "mild" ? "nhẹ/ngoại trú" : "nặng/ICU")).join(", ") : "Nguồn không phân tầng mức độ", docs || moduleLabel);

  // 6 Tac nhan
  const pat = mention(regs, intlTexts, /S\. aureus|tụ cầu|liên cầu|phế cầu|E\. coli|Klebsiella|Pseudomonas|P\. aeruginosa|Enterobacter|kỵ khí|kị khí|Listeria|não mô cầu|H\. influenzae|Gram[- ]?(âm|dương)|MRSA|vi khuẩn/i);
  add("pathogens", "Tác nhân thường gặp", pat.hit ? "mentioned" : "missing", pat.hit ? "Có nêu trong tình huống/ghi chú nguồn" : "Chưa có", pat.where);

  // 7 Yeu to nguy co khang thuoc
  const mdr = new Set(regs.map((r) => mdrOf(r.scenario)).filter((s) => s !== "unspecified"));
  const mdrMention = mention(regs, intlTexts, /đa kháng|kháng thuốc|ESBL|MRSA|nhiễm khuẩn bệnh viện|kháng sinh gần đây|kháng carbapenem/i);
  add("mdrRisk", "Yếu tố nguy cơ kháng thuốc", mdr.size > 0 || moduleLabel ? "available" : mdrMention.hit ? "mentioned" : "missing",
    moduleLabel ? "Theo module" : mdr.size ? "Có tình huống phân theo nguy cơ" : mdrMention.hit ? "Có đề cập" : "Chưa có", mdrMention.where || docs);

  // 8 Dieu kien can dung khang sinh
  const ind = mention(regs, intlTexts, /chỉ định kháng sinh|không dùng kháng sinh|không cần kháng sinh|khi có dấu hiệu nhiễm/i);
  add("indication", "Điều kiện cần dùng kháng sinh", ind.hit ? "mentioned" : "missing", ind.hit ? "Có đề cập" : "Chưa có", ind.where);

  // 9–12
  add("empiric", "Phác đồ kinh nghiệm", regs.length || moduleLabel ? "available" : "missing", moduleLabel ? `${moduleLabel}${regs.length ? ` + ${regs.length} phương án BYT` : ""}` : `${regs.length} phương án`, docs || moduleLabel);
  const first = regs.filter((r) => r.role === "first" || r.role === "severe");
  add("preferred", "Thuốc ưu tiên", first.length || moduleLabel ? "available" : "missing", moduleLabel ? "Theo module" : `${first.length} phương án`, docs);
  const alt = regs.filter((r) => r.role === "alternative");
  add("alternative", "Thuốc thay thế", alt.length || moduleLabel ? "available" : "missing", moduleLabel ? "Theo module" : alt.length ? `${alt.length} phương án` : "Nguồn không ghi thuốc thay thế", docs);
  const special = regs.filter((r) => r.role === "allergy" || r.role === "pathogen" || r.role === "adjunct");
  add("special", "Dị ứng / tình huống đặc biệt", special.length || moduleLabel ? "available" : "missing", moduleLabel ? "Theo module" : special.length ? `${special.length} phương án` : "Chưa có", docs);

  // 13–14
  add("dose", "Liều / số lần / đường dùng", dosed.length === regs.length && regs.length ? "available" : dosed.length || moduleLabel ? "partial" : "missing",
    moduleLabel ? "Theo module" : `${dosed.length}/${regs.length} phương án có liều${supplemented ? ` (${supplemented} liều bổ sung có dẫn nguồn)` : ""}${dosed.length < regs.length ? `; ${regs.length - dosed.length} MISSING_DOSE_EVIDENCE` : ""}`, docs);
  const load = mention(regs, intlTexts, /liều nạp|loading|tấn công/i);
  add("loading", "Liều nạp", load.hit ? "mentioned" : "missing", load.hit ? "Có nêu (xem nguồn)" : "Nguồn không nêu", load.where);

  // 15 Thoi gian
  const withDur = dosed.filter((r) => !!r.duration).length;
  add("duration", "Thời gian điều trị", withDur === dosed.length && dosed.length ? "available" : withDur || moduleLabel ? "partial" : "missing", moduleLabel ? "Theo module" : `${withDur}/${dosed.length} phương án có liều ghi thời gian`, docs);

  // 16 Hieu chinh lieu + canh bao
  const drugs = findDrugs(textsOf(regs));
  const uniq = Array.from(new Map(drugs.map((x) => [x.ingredientId, x])).values());
  const renal = uniq.filter((x) => RENAL_IDS.has(x.ingredientId)).length;
  const alerts = Array.from(new Set(regs.flatMap((r) => safetyAlertsFor(r.id).map((a) => a.id))));
  const blocked = regs.filter((r) => autoRecommendBlocks(r.id).length > 0).length;
  add("adjust", "Hiệu chỉnh liều và cảnh báo", uniq.length ? (renal === uniq.length ? "available" : "partial") : "missing",
    `${renal}/${uniq.length} hoạt chất có dữ liệu Dược thư (thận); ${alerts.length} cảnh báo an toàn; ${blocked} phương án khóa đề xuất`, "Module Hiệu chỉnh liều; data/antibiotics/empiric/safety-alerts.ts");

  // 17–18
  const re = mention(regs, intlTexts, /đánh giá lại|48[–-]72 giờ|72[–-]96 giờ|sau 48 giờ|không cải thiện/i);
  add("reassess", "Tiêu chí đánh giá lại", re.hit ? "mentioned" : "missing", re.hit ? "Có đề cập" : "Chưa có", re.where);
  const sw = mention(regs, intlTexts, /xuống thang|kháng sinh đồ|chuyển (sang )?(đường )?uống|chuyển uống|theo tác nhân/i);
  add("switch", "Chuyển điều trị đích / IV → PO", sw.hit ? "mentioned" : "missing", sw.hit ? "Có đề cập" : "Chưa có", sw.where);

  // 19 Danh muc BV199
  const inForm = uniq.filter((x) => inFormulary(x.ingredientId)).length;
  add("formulary", "Danh mục thuốc BV199", uniq.length ? (inForm === uniq.length ? "available" : "partial") : "missing", `${inForm}/${uniq.length} hoạt chất có trong danh mục`, "data/antibiotics/bv199-formulary-antimicrobials.json");

  // 20 Nguon
  const intlNames = intl ? intl.guidelineIds.map((g) => `${INTL_GUIDELINES[g]?.org} ${INTL_GUIDELINES[g]?.published.match(/\d{4}/)?.[0] ?? ""}`) : [];
  add("sources", "Nguồn tài liệu", docs || moduleLabel || intlNames.length ? "available" : "missing", [docs, moduleLabel, ...intlNames].filter(Boolean).join("; "),
    ev ? `Trạng thái nguồn: ${ev.status}; phê duyệt: ${ev.approval.status}` : undefined);

  const have = F.filter((x) => x.status !== "missing").length;
  return { id: d.id, title: d.title, fields: F, coverage: have, missing: F.filter((x) => x.status === "missing").map((x) => x.label) };
}

export function allProfiles(): DiseaseProfile[] {
  return DISEASES.map((d) => diseaseProfile(d.id)).filter((p): p is DiseaseProfile => !!p);
}
