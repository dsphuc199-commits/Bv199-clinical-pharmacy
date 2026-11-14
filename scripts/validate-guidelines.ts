/*
  scripts/validate-guidelines.ts – kiểm tra JSON "Hướng dẫn quốc tế" theo schema/intl-guideline.ts.
  Dùng: npm run validate:guidelines [-- [--include-reference] [<thư mục hoặc tệp .json> ...]]
        Mặc định quét data/guidelines/intl (cả thư mục con), BỎ QUA _reference/ trừ khi có --include-reference.
        Tệp chỉ định trực tiếp luôn được kiểm.
  Lỗi → mã thoát 1. Cảnh báo không làm hỏng lệnh.
*/
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { combos, matches, type AxisState } from "../lib/intl-rules";
import { NEED, gradeSystem, intlGuideline, type IntlAxis, type IntlGuideline, type IntlWhen } from "../schema/intl-guideline";

export const TRUSTED = [
  "idsociety.org", "ashp.org", "aap.org", "publications.aap.org", "nice.org.uk", "who.int", "cdc.gov", "espid.org",
  "escmid.org", "sccm.org", "thoracic.org", "ersnet.org", "kdigo.org", "diabetesjournals.org", "pubmed.ncbi.nlm.nih.gov",
  "ncbi.nlm.nih.gov", "doi.org", "moh.gov.vn", "kcb.vn",
  "ecil-leukaemia.com", // trang chính thức của ECIL (European Conference on Infections in Leukaemia) – thêm 14/11/2026
];
const MAX_MULTI_OPTIONS = 14; // 2^14 tập con – giới hạn liệt kê
const MAX_LIST = 10;          // số mục ví dụ in ra mỗi loại

function files(p: string, includeRef: boolean, top = true): string[] {
  const st = statSync(p);
  if (st.isFile()) return p.endsWith(".json") ? [p] : [];
  if (!top && !includeRef && basename(p) === "_reference") return [];
  return readdirSync(p).sort().flatMap((n) => files(join(p, n), includeRef, false));
}
const show = (c: AxisState) => Object.entries(c).map(([k, v]) => `${k}=${Array.isArray(v) ? `[${v.join(",")}]` : v}`).join(" ");

/* ---------------- tham chiếu trục trong điều kiện ---------------- */
function checkWhen(g: IntlGuideline, w: IntlWhen | undefined, where: string, allowed: Set<string>, err: (m: string) => void) {
  if (!w) return;
  const byId = new Map<string, IntlAxis>(g.axes.map((a) => [a.id, a]));
  for (const [k, c] of Object.entries(w)) {
    const a = byId.get(k);
    if (!a) { err(`${where}: trục "${k}" không tồn tại`); continue; }
    if (!allowed.has(k)) err(`${where}: trục "${k}" phải khai báo trước trục đang xét`);
    const ids = new Set((a.options ?? []).map((o) => o.id));
    const vals: string[] = typeof c === "string" ? [c] : Array.isArray(c) ? c : typeof c === "object" ? [...(c.includes_any ?? []), ...(c.includes_none ?? [])] : [];
    if (typeof c === "boolean" && a.type !== "check") err(`${where}: trục "${k}" không phải check`);
    if (typeof c === "object" && !Array.isArray(c) && a.type !== "multi") err(`${where}: điều kiện tập hợp chỉ dùng cho trục multi ("${k}")`);
    if (a.type === "check" && typeof c !== "boolean") err(`${where}: trục check "${k}" cần true/false`);
    for (const v of vals) if (!ids.has(v)) err(`${where}: giá trị "${v}" không có trong trục "${k}"`);
  }
}

/* ---------------- duyệt cây ---------------- */
function walk(o: unknown, path: string, fn: (path: string, key: string, v: unknown, parent: Record<string, unknown>) => void) {
  if (Array.isArray(o)) o.forEach((x, i) => walk(x, `${path}[${i}]`, fn));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) { fn(`${path}.${k}`, k, v, o as Record<string, unknown>); walk(v, `${path}.${k}`, fn); }
}

export function validate(raw: unknown, now = new Date()): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const p = intlGuideline.safeParse(raw);
  if (!p.success) {
    for (const i of p.error.issues) errors.push(`schema: ${i.path.join(".") || "(gốc)"} – ${i.message}`);
    return { errors, warnings };
  }
  const g = p.data;

  // nguồn: id không trùng; source_ids tồn tại; hệ phân mức của grade khớp nguồn
  const srcById = new Map(g.sources.map((s) => [s.id, s]));
  if (srcById.size !== g.sources.length) errors.push("sources: có id trùng");
  const used = new Set<string>();
  walk(g, "$", (path, key, v, parent) => {
    if (key !== "source_ids" || !Array.isArray(v)) return;
    for (const s of v as string[]) { used.add(s); if (!srcById.has(s)) errors.push(`${path}: source_id "${s}" không có trong sources`); }
    const gr = parent.grade;
    if (typeof gr === "string") {
      const sys = gradeSystem(gr);
      const allowed = (v as string[]).map((s) => srcById.get(s)?.grade_system).filter(Boolean);
      if (sys && !allowed.includes(sys)) errors.push(`${path.replace(/\.source_ids$/, ".grade")}: mã "${gr}" thuộc hệ ${sys}, nhưng nguồn ${(v as string[]).join(", ")} khai báo hệ ${allowed.join(", ") || "?"} – cấm quy đổi giữa các hệ`);
    }
  });
  for (const [i, d] of g.discordance.entries()) for (const s of [d.primary_source_id, d.other_source_id]) {
    used.add(s);
    if (!srcById.has(s)) errors.push(`discordance[${i}]: source_id "${s}" không có trong sources`);
  }
  for (const s of srcById.keys()) if (!used.has(s)) warnings.push(`sources: "${s}" không được nội dung nào trích dẫn`);

  // năm, ngày truy cập, domain, quần thể
  for (const [i, s] of g.sources.entries()) {
    if (s.year > now.getFullYear()) errors.push(`sources[${i}].year = ${s.year} lớn hơn năm hiện tại (${now.getFullYear()})`);
    if (new Date(s.accessed) > now) errors.push(`sources[${i}].accessed = ${s.accessed} ở tương lai`);
    const host = new URL(s.url).hostname.replace(/^www\./, "");
    if (!TRUSTED.some((d) => host === d || host.endsWith("." + d))) warnings.push(`sources[${i}].url: domain "${host}" ngoài danh sách tin cậy`);
    if (!s.population.some((x) => g.population.includes(x))) warnings.push(`sources[${i}].population không giao với population của bệnh`);
  }

  // kiểm duyệt
  if (g.review.state !== "draft_ai" && !g.review.verified_by) errors.push(`review.state = ${g.review.state} nhưng thiếu verified_by`);
  if (g.review.state !== "draft_ai" && !g.review.verified_date) warnings.push(`review.state = ${g.review.state} nhưng thiếu verified_date`);

  // CẦN XÁC MINH
  let need = 0;
  walk(g, "$", (path, _k, v) => { if (typeof v === "string" && v.includes(NEED)) { need++; if (need <= MAX_LIST) warnings.push(`${path}: "${NEED}"`); } });
  if (need) warnings.push(`Tổng số mục "${NEED}": ${need}`);

  // tham chiếu trục (lỗi ở đây chặn bước kiểm tính đầy đủ)
  const before = errors.length;
  const seen = new Set<string>();
  const ids = new Set<string>();
  for (const [i, a] of g.axes.entries()) {
    if (ids.has(a.id)) errors.push(`axes[${i}]: id trùng "${a.id}"`);
    ids.add(a.id);
    checkWhen(g, a.visible_when, `axes[${i}].visible_when`, seen, (m) => errors.push(m));
    if (a.type === "multi" && (a.options?.length ?? 0) > MAX_MULTI_OPTIONS) errors.push(`axes[${i}]: multi có > ${MAX_MULTI_OPTIONS} lựa chọn – không liệt kê được`);
    const optIds = (a.options ?? []).map((o) => o.id);
    const def = a.default;
    if (typeof def === "string" && a.type !== "check" && !optIds.includes(def)) errors.push(`axes[${i}].default "${def}" không có trong options`);
    if (Array.isArray(def)) for (const d of def) if (!optIds.includes(d)) errors.push(`axes[${i}].default chứa "${d}" không có trong options`);
    seen.add(a.id);
  }
  const ruleIds = new Set<string>();
  for (const [i, r] of g.rules.entries()) {
    if (ruleIds.has(r.id)) errors.push(`rules: id trùng "${r.id}"`);
    ruleIds.add(r.id);
    checkWhen(g, r.when, `rules[${i}] (${r.id}).when`, ids, (m) => errors.push(m));
    r.blocks.forEach((b, bi) => {
      checkWhen(g, b.show_when, `rules[${i}].blocks[${bi}].show_when`, ids, (m) => errors.push(m));
      b.items.forEach((it, ii) => checkWhen(g, it.show_when, `rules[${i}].blocks[${bi}].items[${ii}].show_when`, ids, (m) => errors.push(m)));
    });
    r.avoid.forEach((it, ii) => checkWhen(g, it.show_when, `rules[${i}].avoid[${ii}].show_when`, ids, (m) => errors.push(m)));
    r.notes.forEach((n, ni) => checkWhen(g, n.show_when, `rules[${i}].notes[${ni}].show_when`, ids, (m) => errors.push(m)));
  }
  for (const [i, s] of g.sections.entries()) {
    checkWhen(g, s.show_when, `sections[${i}] (${s.id}).show_when`, ids, (m) => errors.push(m));
    s.items.forEach((it, ii) => checkWhen(g, it.show_when, `sections[${i}].items[${ii}].show_when`, ids, (m) => errors.push(m)));
    for (const c of s.controls ?? []) {
      const a = g.axes.find((x) => x.id === c);
      if (!a) errors.push(`sections[${i}].controls: trục "${c}" không tồn tại`);
      else if (a.placement !== "output") errors.push(`sections[${i}].controls: trục "${c}" cần placement "output"`);
    }
  }
  for (const a of g.axes) if (a.placement === "output" && !g.sections.some((s) => s.controls?.includes(a.id))) errors.push(`axes "${a.id}": placement "output" nhưng không section nào khai báo trong controls`);
  if (errors.length > before) return { errors, warnings };

  // tính đầy đủ: mỗi tổ hợp hợp lệ khớp ĐÚNG 1 luật primary
  if (g.status === "extracted") {
    const primaries = g.rules.filter((r) => r.kind === "primary");
    const hit = new Map<string, number>(g.rules.map((r) => [r.id, 0]));
    const secHit = new Map<string, number>(g.sections.map((s) => [s.id, 0]));
    const missing: string[] = [];
    const conflict: string[] = [];
    let total = 0, nMissing = 0, nConflict = 0;
    for (const c of combos(g.axes)) {
      total++;
      const m = primaries.filter((r) => matches(c, r.when));
      for (const r of g.rules) if (matches(c, r.when)) hit.set(r.id, (hit.get(r.id) ?? 0) + 1);
      for (const s of g.sections) if (matches(c, s.show_when)) secHit.set(s.id, (secHit.get(s.id) ?? 0) + 1);
      if (m.length === 0) { nMissing++; if (missing.length < MAX_LIST) missing.push(show(c)); }
      if (m.length > 1) { nConflict++; if (conflict.length < MAX_LIST) conflict.push(`${show(c)} → ${m.map((r) => r.id).join(", ")}`); }
    }
    if (nMissing) errors.push(`Thiếu luật primary cho ${nMissing}/${total} tổ hợp, ví dụ:\n      ${missing.join("\n      ")}`);
    if (nConflict) errors.push(`Mâu thuẫn (> 1 luật primary) ở ${nConflict}/${total} tổ hợp, ví dụ:\n      ${conflict.join("\n      ")}`);
    for (const r of g.rules) if (!hit.get(r.id)) warnings.push(`rules "${r.id}" không khớp tổ hợp hợp lệ nào (luật chết)`);
    for (const s of g.sections) if (!secHit.get(s.id)) warnings.push(`sections "${s.id}" không bao giờ hiển thị`);
    warnings.push(`Đã kiểm ${total} tổ hợp lựa chọn hợp lệ; ${primaries.length} luật primary, ${g.rules.length - primaries.length} luật addon`);
  }
  return { errors, warnings };
}

function main() {
  const args = process.argv.slice(2);
  const includeRef = args.includes("--include-reference");
  const targets = args.filter((a) => !a.startsWith("--"));
  const list = (targets.length ? targets : ["data/guidelines/intl"]).flatMap((t) => {
    try { return files(t, includeRef); } catch { console.error(`Không đọc được: ${t}`); process.exitCode = 1; return []; }
  });
  if (!list.length) { console.log("Không có tệp .json nào để kiểm tra (đã bỏ qua _reference; dùng --include-reference để quét)."); return; }
  let bad = 0;
  for (const f of list) {
    let raw: unknown;
    let res: { errors: string[]; warnings: string[] };
    try { raw = JSON.parse(readFileSync(f, "utf8")); res = validate(raw); } catch (e) { res = { errors: [`JSON không hợp lệ: ${(e as Error).message}`], warnings: [] }; }
    console.log(`\n${res.errors.length ? "✗" : "✓"} ${relative(process.cwd(), f)}`);
    for (const e of res.errors) console.log(`  LỖI: ${e}`);
    for (const w of res.warnings) console.log(`  cảnh báo: ${w}`);
    if (res.errors.length) bad++;
  }
  console.log(`\n${list.length - bad}/${list.length} tệp đạt.`);
  if (bad) process.exitCode = 1;
}
if (process.argv[1] && /validate-guidelines\.ts$/.test(process.argv[1].replace(/\\/g, "/"))) main();
