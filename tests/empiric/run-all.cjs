// Chay toan bo unit test module Khang sinh kinh nghiem: npm run test:empiric
const { spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const files = fs.readdirSync(__dirname).filter((f) => f.endsWith("-test.cjs")).sort();
let failed = 0;
for (const f of files) {
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { encoding: "utf8" });
  const out = (r.stdout || "") + (r.stderr || "");
  const summary = out.match(/(\d+) passed, (\d+) failed/);
  const fails = out.split("\n").filter((l) => l.startsWith("FAIL"));
  console.log(`${f.padEnd(28)} ${summary ? summary[0] : "LỖI CHẠY"}`);
  for (const l of fails) console.log("   " + l);
  if (r.status !== 0 || !summary || summary[2] !== "0") failed++;
}
console.log(failed ? `\n${failed} bộ test có lỗi` : "\nTất cả bộ test PASS");
process.exit(failed ? 1 : 0);
