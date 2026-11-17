// Quet moi to hop dau vao cua 9 benh: quyet dinh co dung khang sinh (hoac xem truoc khi xet nghiem duong tinh) thi phai co dong lieu.
const load = require("../empiric/tsrun.cjs");
const { DISEASES } = load("data/ent/index.ts");
const { buildView, ABX_DECISIONS } = load("lib/ent/view.ts");
const SAMPLE = { weightKg: [undefined, 10, 30, 70], ageMonths: [6, 18, 30, 80], ageYears: [1.5, 5, 13] };
function vals(s) {
  if (s.type === "select") return [undefined, ...s.options.map((o) => o.value)];
  if (s.type === "boolean") return [undefined, true];
  return SAMPLE[s.field] || [undefined];
}
function sweep(d) {
  let combos = [{}];
  for (const s of d.inputs) combos = combos.flatMap((c) => vals(s).map((v) => (v === undefined ? c : { ...c, [s.field]: v })));
  const bad = []; let n = 0, shownDose = 0;
  for (const inp of combos) {
    const v = buildView(d, inp);
    if (!v.ready || !v.r.ok) continue;
    n++;
    const abx = ABX_DECISIONS.includes(v.r.decision.value) || !!v.previewLabel;
    const k = v.firsts.length + v.adds.length + v.algs.length + v.fails.length + v.inlineCmp.length;
    if (k) shownDose++;
    if (abx && !k) bad.push(JSON.stringify(inp) + " -> " + v.r.decision.value);
  }
  return { n, shownDose, bad };
}
module.exports = { sweep };
if (require.main === module) {
  for (const d of DISEASES) { if (d.crossRef) continue; const { n, shownDose, bad } = sweep(d); console.log(`${d.id}: ${n} trạng thái đủ đầu vào, ${shownDose} có liều, ${bad.length} thiếu liều`); bad.slice(0, 6).forEach((b) => console.log("   - " + b)); }
}
