// Trang thai ky vong = anh chup baseline + cac thay doi CO CHU DICH ghi trong fixtures/status-changes.json.
// Dung chung cho cac bo test de khong phai sua tay con so tong o nhieu noi.
const fs = require("fs");
const path = require("path");

const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "byt-regimens-baseline.json"), "utf8"));
const { changes } = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "status-changes.json"), "utf8"));

const norm = (s) => (s === "VERIFIED" ? "VERIFIED_SOURCE" : s);
const expected = Object.fromEntries(Object.entries(baseline.status).map(([k, v]) => [k, norm(v)]));
for (const c of changes) {
  if (expected[c.id] !== c.from) throw new Error(`status-changes.json: ${c.id} baseline la ${expected[c.id]}, khong phai ${c.from}`);
  if (!c.reason || !c.step) throw new Error(`status-changes.json: ${c.id} thieu ly do/buoc`);
  expected[c.id] = c.to;
}
const count = (s) => Object.values(expected).filter((v) => v === s).length;
const totals = {
  total: Object.keys(expected).length,
  VERIFIED_SOURCE: count("VERIFIED_SOURCE"),
  NEEDS_REVIEW: count("NEEDS_REVIEW"),
  MISSING_EVIDENCE: count("MISSING_EVIDENCE"),
};

module.exports = { expected, totals, changes };
