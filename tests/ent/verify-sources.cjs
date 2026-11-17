// Buoc 5 – doi chieu lan hai: mo lai dung tep nguon (./guidelines), tim dong goc va so khop tung gia tri so.
// Chay: node tests/ent/verify-sources.cjs  (can thu muc ./guidelines da tai; thieu tep -> KHONG TIM THAY)
// Ghi bang doi chieu ra guidelines/verification-table.md (khong commit).
const fs = require("fs"), path = require("path");
const load = require("../empiric/tsrun.cjs");
const ROOT = path.resolve(__dirname, "..", "..");
const { DISEASES, SOURCES } = load("data/ent/index.ts");

const norm = (s) => s
  .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl")
  .replace(/[–—−]/g, "-")
  .replace(/(\d)[ ,   ](?=\d{3}(\D|$))/g, "$1")
  .replace(/(\d),(\d)/g, "$1.$2")
  .toLowerCase()
  .replace(/\bbd\b/g, "2 times").replace(/\btds\b/g, "3 times").replace(/\bqds\b/g, "4 times").replace(/\bbid\b/g, "2 times").replace(/\btid\b/g, "3 times").replace(/\bqid\b/g, "4 times").replace(/\bod\b/g, "1 time").replace(/\btwice\b/g, "2").replace(/\bthree\b/g, "3").replace(/\bfour\b/g, "4").replace(/\bfive\b/g, "5").replace(/\bten\b/g, "10").replace(/\bsix\b/g, "6").replace(/\beight\b/g, "8").replace(/\s+/g, " ");
const SYN = { cefalexin: ["cephalexin", "cefalexin"], "penicillin g": ["penicillin"], "amoxicillin-clavulanate": ["amoxicillin-clavulanate", "amoxicillin/clavulanate", "amoxicillin-clavulanic"], "ampicillin-sulbactam": ["ampicillin-sulbactam", "ampicillin/sulbactam", "unasyn"] };
const textCache = {};
function srcText(id) {
  if (id in textCache) return textCache[id];
  const s = SOURCES.find((x) => x.id === id);
  let t = null;
  if (s && s.file && fs.existsSync(path.join(ROOT, s.file))) {
    t = fs.readFileSync(path.join(ROOT, s.file), "utf8");
    // Them ban -raw cua PDF (thu tu dong noi dung, khong xen cot) neu co.
    const raw = path.join(ROOT, "guidelines", id + ".raw.txt"); if (fs.existsSync(raw)) t += "\n" + fs.readFileSync(raw, "utf8");
    // Bang IDSA 2012 ABRS: them ban -table de khop cot.
    if (id === "IDSA-2012-ABRS") { const tb = path.join(ROOT, "guidelines/IDSA-2012-ABRS.table.txt"); if (fs.existsSync(tb)) t += "\n" + fs.readFileSync(tb, "utf8"); }
  }
  return (textCache[id] = t === null ? null : norm(t));
}
const numbersOf = (s) => (norm(s).match(/\d+(?:\.\d+)?/g) || []).filter((n) => !/^(1|2|3)$/.test(n) || true);
function drugKeys(drug) {
  const first = norm(drug).split(/ \+ |, | \(|;| có | hoặc /)[0].trim();
  const base = first.replace(/ \(.*$/, "").replace(/ liều (chuẩn|cao)$/, "").trim();
  return SYN[base] || [base];
}
function windowsFor(t, keys, span) {
  const out = [];
  for (const k of keys) { let i = t.indexOf(k); while (i >= 0) { out.push(t.slice(Math.max(0, i - span), i + span)); i = t.indexOf(k, i + 1); } }
  return out;
}
const rows = [];
function check(disease, rec, kind) {
  const c = rec.citation;
  const t = srcText(c.sourceId);
  const value = kind === "Dose" ? `${rec.drug}: ${rec.dose}${rec.interval ? "; " + rec.interval : ""}${rec.duration ? "; " + rec.duration : ""}${rec.max ? "; tối đa " + rec.max : ""}` : rec.text;
  if (rec.status !== "EXTRACTED") { rows.push({ d: disease.id, id: rec.id, value, loc: `${c.sourceId} – ${c.locator}`, res: "NOT_VERIFIED (đã đánh dấu)" }); return; }
  if (!t) { rows.push({ d: disease.id, id: rec.id, value, loc: `${c.sourceId} – ${c.locator}`, res: "KHÔNG TÌM THẤY (không có tệp nguồn)" }); return; }
  const nums = [...new Set(numbersOf(kind === "Dose" ? [rec.dose, rec.interval, rec.duration, rec.max].filter(Boolean).join(" ") : rec.text))];
  let res = "KHỚP", miss = [];
  if (kind === "Dose") {
    const keys = drugKeys(rec.drug);
    const wins = windowsFor(t, keys, 1600);
    if (!wins.length) res = "KHÔNG TÌM THẤY";
    else { miss = nums.filter((n) => !wins.some((w) => new RegExp(`(^|[^\\d.])${n.replace(".", "\\.")}([^\\d]|$)`).test(w))); if (miss.length) res = "LỆCH"; }
  } else {
    miss = nums.filter((n) => !new RegExp(`(^|[^\\d.])${n.replace(".", "\\.")}([^\\d]|$)`).test(t));
    for (const g of [rec.strength, rec.quality].filter(Boolean)) if (!t.includes(norm(g).replace(/^evidence quality: /, ""))) miss.push(`mức "${g}"`);
    if (c.quote && !t.includes(norm(c.quote))) miss.push("trích dẫn");
    if (miss.length) res = "LỆCH";
  }
  rows.push({ d: disease.id, id: rec.id, value, loc: `${c.sourceId} – ${c.locator}`, res: miss.length ? `${res}: thiếu ${miss.join(", ")}` : res });
}
for (const d of DISEASES) {
  for (const x of d.doses) check(d, x, "Dose");
  for (const x of [...d.redFlags, ...d.statements]) check(d, x, "Statement");
}
const count = (p) => rows.filter((r) => r.res.startsWith(p)).length;
const md = ["| Bệnh | Mục | Giá trị trong dữ liệu | Vị trí trong nguồn | Kết quả |", "|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.d} | ${r.id} | ${r.value.replace(/\|/g, "/")} | ${r.loc} | ${r.res} |`)].join("\n");
const out = path.join(ROOT, "guidelines", "verification-table.md");
if (fs.existsSync(path.dirname(out))) fs.writeFileSync(out, md + "\n");
console.log(`KHỚP ${count("KHỚP")} | LỆCH ${count("LỆCH")} | KHÔNG TÌM THẤY ${count("KHÔNG TÌM THẤY")} | NOT_VERIFIED ${count("NOT_VERIFIED")} | tổng ${rows.length}`);
for (const r of rows.filter((r) => !r.res.startsWith("KHỚP") && !r.res.startsWith("NOT_VERIFIED"))) console.log(`- ${r.d}/${r.id}: ${r.res} [${r.loc}]`);
module.exports = { rows };
