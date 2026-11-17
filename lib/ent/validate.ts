/*
  Module Nhiễm khuẩn tai mũi họng – kiểm tra dữ liệu (chạy trong test và có thể gọi lúc build).
*/
import type { Disease, Source } from "@/types/ent";

export const QUOTE_MAX_WORDS = 15;
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function validateDisease(d: Disease, sources: Source[]): string[] {
  const errs: string[] = [];
  const reg = new Map(sources.map((s) => [s.id, s]));
  const rolesOf: Record<string, string[]> = {
    primary: d.primarySources, diagnosis: d.diagnosisSources ?? [], comparison: d.comparisonSources, reference: d.referenceSources,
  };
  const all = [...d.primarySources, ...(d.diagnosisSources ?? []), ...d.comparisonSources, ...d.referenceSources];
  for (const id of all) if (!reg.has(id)) errs.push(`${d.id}: nguồn ${id} không có trong registry`);
  for (const id of d.primarySources) {
    const s = reg.get(id);
    if (s?.tier === "REF") errs.push(`${d.id}: nguồn REF ${id} không được làm nguồn chính`);
    if (id === "IDSA-2025-GAS-part1") errs.push(`${d.id}: IDSA-2025-GAS-part1 chỉ được dùng ở vai trò chẩn đoán`);
  }
  const records = [
    ...d.redFlags.map((x) => ({ rec: "Statement" as const, ...x })),
    ...d.statements.map((x) => ({ rec: "Statement" as const, ...x })),
    ...d.doses.map((x) => ({ rec: "Dose" as const, ...x })),
  ];
  const ids = new Set<string>();
  for (const r of records) {
    if (ids.has(r.id)) errs.push(`${d.id}: trùng id ${r.id}`);
    ids.add(r.id);
    const c = r.citation;
    if (!c || !c.sourceId || !c.locator) { errs.push(`${d.id}/${r.id}: thiếu citation`); continue; }
    if (!reg.has(c.sourceId)) errs.push(`${d.id}/${r.id}: sourceId ${c.sourceId} không có trong registry`);
    if (!(rolesOf[r.role] ?? []).includes(c.sourceId)) errs.push(`${d.id}/${r.id}: nguồn ${c.sourceId} không thuộc vai trò ${r.role} của bệnh`);
    if (c.quote && words(c.quote) > QUOTE_MAX_WORDS) errs.push(`${d.id}/${r.id}: trích dẫn > ${QUOTE_MAX_WORDS} từ`);
    if (c.sourceId === "IDSA-2025-GAS-part1" && r.role !== "diagnosis") errs.push(`${d.id}/${r.id}: IDSA-2025 chỉ ở vai trò diagnosis`);
    if (!["EXTRACTED", "NOT_VERIFIED"].includes(r.status)) errs.push(`${d.id}/${r.id}: status không hợp lệ (${r.status})`);
    const src = reg.get(c.sourceId);
    if (src && (src.access === "not_downloaded" || src.access === "paywalled") && r.status === "EXTRACTED") errs.push(`${d.id}/${r.id}: nguồn ${c.sourceId} chưa truy cập được nhưng bản ghi EXTRACTED`);
    if (src?.tier === "REF" && r.role !== "reference") errs.push(`${d.id}/${r.id}: nguồn REF phải ở vai trò reference`);
  }
  for (const s of d.statements) if (reg.get(s.citation.sourceId)?.tier === "REF" && s.kind !== "reference_note") errs.push(`${d.id}/${s.id}: nội dung UCSF phải là reference_note`);
  const doseIds = new Set(d.doses.map((x) => x.id));
  const stIds = new Set(d.statements.map((x) => x.id));
  for (const r of d.rules) {
    for (const id of r.doseIds ?? []) if (!doseIds.has(id)) errs.push(`${d.id}/rule ${r.id}: dose ${id} không tồn tại`);
    for (const id of r.statementIds ?? []) if (!stIds.has(id)) errs.push(`${d.id}/rule ${r.id}: statement ${id} không tồn tại`);
    if (!reg.has(r.citation.sourceId)) errs.push(`${d.id}/rule ${r.id}: citation sai nguồn`);
    for (const c of r.when) if (!d.inputs.some((s) => s.field === c.field)) errs.push(`${d.id}/rule ${r.id}: trường ${c.field} không có trong inputs`);
  }
  for (const x of d.doses) for (const c of x.when ?? []) if (!d.inputs.some((s) => s.field === c.field)) errs.push(`${d.id}/${x.id}: trường ${c.field} không có trong inputs`);
  for (const s of d.inputs) if (!reg.has(s.citation.sourceId)) errs.push(`${d.id}/input ${s.field}: citation sai nguồn`);
  if (d.primarySources.length === 0) {
    if (!d.evidenceGap?.length) errs.push(`${d.id}: không có nguồn chính nhưng thiếu evidenceGap`);
    if (d.doses.some((x) => x.role !== "reference")) errs.push(`${d.id}: không có nguồn chính nhưng có Dose`);
    if (d.rules.some((r) => r.decision !== "no_primary")) errs.push(`${d.id}: không có nguồn chính nhưng có luật xuất lựa chọn`);
  }
  for (const c of d.conflicts) {
    if (c.sides.length < 2) errs.push(`${d.id}/conflict ${c.id}: cần ≥ 2 nguồn`);
    for (const s of c.sides) if (!reg.has(s.sourceId) || reg.get(s.sourceId)!.year !== s.year) errs.push(`${d.id}/conflict ${c.id}: nguồn/năm không khớp registry (${s.sourceId} ${s.year})`);
  }
  if (JSON.stringify(d).includes("\"REVIEWED\"")) errs.push(`${d.id}: không được đặt status REVIEWED`);
  return errs;
}
