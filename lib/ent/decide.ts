/*
  Module Nhiễm khuẩn tai mũi họng – hàm quyết định (hàm thuần, không sinh văn bản tự do).
  Đầu vào: dữ liệu bệnh (JSON có citation) + đầu vào người dùng. Đầu ra: chỉ các bản ghi có sẵn trong dữ liệu
  và kết quả tính liều theo cân nặng (giới hạn bởi liều tối đa do nguồn ghi).
  Quy tắc an toàn:
  - Dose status NOT_VERIFIED không bao giờ vào nhóm "đầu tay"/"thay thế"; chỉ vào danh sách "chưa xác minh".
  - Bệnh không có nguồn chính: không xuất lựa chọn đầu tay; chỉ khoảng trống bằng chứng và nội dung tham khảo
    (liều tham khảo nguồn REF, lọc theo đầu vào, hiển thị riêng với nhãn tham khảo).
  - Dose role "comparison" chỉ vào danh sách đối chiếu.
*/
import type { Cond, ComputedDose, DecideResult, Disease, Dose, Inputs, InputSpec } from "@/types/ent";

export function validateInputs(d: Disease, inp: Inputs): string[] {
  const errs: string[] = [];
  for (const spec of d.inputs) {
    const v = inp[spec.field];
    if (v === undefined || v === "") continue;
    if (spec.type === "number") {
      if (typeof v !== "number" || Number.isNaN(v)) { errs.push(`${spec.label}: giá trị không hợp lệ`); continue; }
      if (spec.min !== undefined && v < spec.min) errs.push(`${spec.label}: ngoài phạm vi áp dụng của nguồn (tối thiểu ${spec.min}${spec.unit ? " " + spec.unit : ""})`);
      if (spec.max !== undefined && v > spec.max) errs.push(`${spec.label}: ngoài phạm vi áp dụng của nguồn (tối đa ${spec.max}${spec.unit ? " " + spec.unit : ""})`);
    } else if (spec.type === "select") {
      if (!spec.options?.some((o) => o.value === v)) errs.push(`${spec.label}: lựa chọn không hợp lệ`);
    } else if (typeof v !== "boolean") {
      errs.push(`${spec.label}: giá trị không hợp lệ`);
    }
  }
  for (const k of Object.keys(inp)) if (inp[k] !== undefined && !d.inputs.some((s: InputSpec) => s.field === k)) errs.push(`Trường không dùng cho bệnh này: ${k}`);
  return errs;
}

export function condTrue(c: Cond, inp: Inputs): boolean {
  const v = inp[c.field];
  switch (c.op) {
    case "truthy": return v === true;
    case "falsy": return v !== true;
    case "eq": return v === c.value;
    case "in": return Array.isArray(c.value) && v !== undefined && (c.value as (string | number)[]).includes(v as string | number);
    case "gte": return typeof v === "number" && v >= (c.value as number);
    case "gt": return typeof v === "number" && v > (c.value as number);
    case "lt": return typeof v === "number" && v < (c.value as number);
    case "lte": return typeof v === "number" && v <= (c.value as number);
  }
}

const fmt = (n: number) => (n >= 100 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toString().replace(".", ","));

/** Tính liều theo cân nặng từ tham số của nguồn; giới hạn bởi liều tối đa nguồn ghi. */
export function computeDose(dose: Dose, weightKg: number): ComputedDose | null {
  const w = dose.weight;
  if (!w || !(weightKg > 0)) return null;
  const parts: string[] = [];
  let capped = false;
  for (const n of w.dosesPerDay) {
    let perDose: [number, number];
    if (w.basis === "per_day") {
      let lo = w.mgPerKg[0] * weightKg, hi = w.mgPerKg[1] * weightKg;
      if (w.maxPerDayMg !== undefined) { if (hi > w.maxPerDayMg) capped = true; lo = Math.min(lo, w.maxPerDayMg); hi = Math.min(hi, w.maxPerDayMg); }
      perDose = [lo / n, hi / n];
    } else {
      perDose = [w.mgPerKg[0] * weightKg, w.mgPerKg[1] * weightKg];
    }
    if (w.maxPerDoseMg !== undefined) { if (perDose[1] > w.maxPerDoseMg) capped = true; perDose = [Math.min(perDose[0], w.maxPerDoseMg), Math.min(perDose[1], w.maxPerDoseMg)]; }
    if (w.maxPerDayMg !== undefined && perDose[1] * n > w.maxPerDayMg) { capped = true; perDose = [Math.min(perDose[0], w.maxPerDayMg / n), Math.min(perDose[1], w.maxPerDayMg / n)]; }
    const r = perDose[0] === perDose[1] ? fmt(perDose[0]) : `${fmt(perDose[0])}–${fmt(perDose[1])}`;
    parts.push(`${r} mg/lần × ${n} lần/ngày`);
  }
  return { doseId: dose.id, text: `${weightKg} kg: ${parts.join(" hoặc ")}${capped ? " (đã giới hạn theo liều tối đa của nguồn)" : ""}`, capped };
}

/** Liều tính được không vượt mức tối đa của nguồn (dùng cho kiểm thử). */
export function perDoseUpper(dose: Dose, weightKg: number, n: number): number | null {
  const w = dose.weight;
  if (!w) return null;
  let hi = w.basis === "per_day" ? Math.min(w.mgPerKg[1] * weightKg, w.maxPerDayMg ?? Infinity) / n : w.mgPerKg[1] * weightKg;
  if (w.maxPerDoseMg !== undefined) hi = Math.min(hi, w.maxPerDoseMg);
  if (w.maxPerDayMg !== undefined) hi = Math.min(hi, w.maxPerDayMg / n);
  return hi;
}

function allergyOk(dose: Dose, inp: Inputs): boolean {
  const a = (inp.allergy as string | undefined) ?? "none";
  return !dose.allergy || dose.allergy.includes(a as "none" | "nonsevere" | "severe");
}

export function decide(d: Disease, inp: Inputs): DecideResult {
  const errors = validateInputs(d, inp);
  const base: DecideResult = {
    ok: errors.length === 0, errors, first: [], alternatives: [], failure: [], other: [], computed: [],
    redFlags: d.redFlags, conflicts: d.conflicts, notStated: d.notStated, evidenceGap: d.evidenceGap ?? [],
    reference: { statements: d.statements.filter((s) => s.role === "reference"), doses: [] }, comparison: [], unverified: [],
  };
  if (!base.ok) return base;
  if (d.primarySources.length === 0) {
    const r = d.rules.find((x) => x.decision === "no_primary");
    if (r) base.decision = { value: "no_primary", ruleId: r.id, citation: r.citation };
    // Lieu tham khao (nguon REF) loc theo dau vao; khong bao gio vao nhom dau tay.
    const wk = typeof inp.weightKg === "number" ? inp.weightKg : undefined;
    for (const dose of d.doses) {
      if (dose.role !== "reference") continue;
      if (dose.status !== "EXTRACTED") { base.unverified.push(dose); continue; }
      if (!allergyOk(dose, inp)) continue;
      if (dose.when && !dose.when.every((x) => condTrue(x, inp))) continue;
      base.reference.doses.push(dose);
      if (wk !== undefined) { const cd = computeDose(dose, wk); if (cd) base.computed.push(cd); }
    }
    return base;
  }
  const rule = d.rules.find((r) => r.when.every((c) => condTrue(c, inp)));
  if (!rule) return base;
  base.decision = { value: rule.decision, ruleId: rule.id, citation: rule.citation };
  const byId = new Map(d.doses.map((x) => [x.id, x]));
  const picked = (rule.doseIds ?? []).map((id) => byId.get(id)).filter((x): x is Dose => !!x);
  const w = typeof inp.weightKg === "number" ? inp.weightKg : undefined;
  for (const dose of picked) {
    if (dose.status !== "EXTRACTED") { base.unverified.push(dose); continue; }
    if (!allergyOk(dose, inp)) continue;
    if (dose.when && !dose.when.every((c) => condTrue(c, inp))) continue;
    if (dose.role === "comparison" || dose.role === "reference") base.comparison.push(dose);
    else if (dose.role !== "primary") base.other.push(dose);
    else if (dose.line === "first") base.first.push(dose);
    else if (dose.line === "alternative_allergy") base.alternatives.push(dose);
    else if (dose.line === "failure" || dose.line === "failure_alternative") base.failure.push(dose);
    else base.other.push(dose);
    if (w !== undefined) { const c = computeDose(dose, w); if (c) base.computed.push(c); }
  }
  return base;
}
