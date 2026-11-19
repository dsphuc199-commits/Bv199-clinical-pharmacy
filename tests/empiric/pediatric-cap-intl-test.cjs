const assert = require("node:assert/strict");
const load = require("./tsrun.cjs");
const guideline = require("../../data/guidelines/intl/viem-phoi-cong-dong-o-tre-em.json");
const { resolve } = load("lib/intl-rules.ts");
const { parseDose } = load("components/antibiotics/empiric/rx-dose-parts.ts");

const dosesIn = (selection) => resolve(guideline, selection).blocks
  .flatMap((block) => block.items)
  .filter((item) => item.dose)
  .map((item) => ({ drug: item.text, source: item.source_ids[0], ...parseDose(item.dose) }));
const standard = { source: "nice", nice_case: "standard" };
const severe = { source: "nice", nice_age: "teen", nice_case: "severe" };
const severeIv = { ...severe, nice_route: "iv" };

let passed = 0;
let failed = 0;
function check(name, verify) {
  try {
    verify();
    passed++;
    console.log(`PASS ${name}`);
  } catch (error) {
    failed++;
    console.log(`FAIL ${name} — ${error.message}`);
  }
}

check("CAP trẻ em: chưa biết tuổi, ngoài tuổi và chuyển đánh giá không hiện liều", () => {
  for (const state of [
    {},
    { ...standard, nice_age: "outside" },
    { ...severe, nice_case: "allergy", nice_route: "iv", nice_atypical: true },
    { ...severe, nice_case: "urgent", nice_route: "iv" },
  ]) assert.deepEqual(dosesIn(state), []);
});

check("CAP trẻ em: chưa chọn tổ chức và chọn IDSA không lấy liều NICE", () => {
  assert.equal(resolve(guideline, {}).primary.id, "choose-organization");
  assert.deepEqual(dosesIn({ ...severeIv, source: "unset" }), []);
  assert.equal(resolve(guideline, { ...severeIv, source: "idsa" }).primary.id, "pids-effusion");
});

check("NICE: đúng liều mỗi lần và mốc 3 hoặc 5 ngày theo tuổi", () => {
  const expected = [
    ["infant", "125 mg/liều", "3 ngày"],
    ["young", "250 mg/liều", "3 ngày"],
    ["five", "500 mg/liều", "3 ngày"],
    ["child", "500 mg/liều", "3 ngày"],
    ["teen", "500 mg/liều", "5 ngày"],
  ];
  for (const [nice_age, dose, duration] of expected) {
    assert.deepEqual(dosesIn({ ...standard, nice_age }), [
      { drug: "Amoxicillin", source: "nice250", dose, route: "uống", freq: "mỗi 8 giờ", duration },
    ]);
  }
});

check("NICE: chờ chọn đường, giữ tổng liều 5:1 và chỉ phối hợp khi có chỉ định", () => {
  assert.deepEqual(dosesIn(severe), []);
  assert.deepEqual(dosesIn(severeIv).map(({ dose, route }) => [dose, route]), [
    ["30 mg/kg/liều (tổng hai thành phần), tối đa 1,2 g/liều", "tĩnh mạch"],
  ]);
  const combined = dosesIn({ ...severeIv, nice_age: "young", nice_atypical: true });
  assert.equal(combined.length, 2);
  assert.equal(combined[1].dose, "7,5 mg/kg/liều, tối đa 500 mg/liều");
  assert.equal(combined[1].route, "tĩnh mạch");
});

check("WHO: liều tối thiểu 40 mg/kg/lần, chỉ cho hai bệnh cảnh đủ điều kiện", () => {
  for (const who_case of ["fast", "indrawing"]) {
    assert.deepEqual(dosesIn({ ...severeIv, source: "who", who_case }), [
      {
        drug: "Amoxicillin", source: "who2024",
        dose: "40 mg/kg/liều (liều tối thiểu)", route: "uống", freq: "mỗi 12 giờ", duration: "5 ngày",
      },
    ]);
  }
  assert.deepEqual(dosesIn({ source: "who", who_case: "other" }), []);
});

check("IDSA/PIDS: Phần 1 năm 2026 không hiện liều và tài liệu lưu trữ tách riêng", () => {
  assert.deepEqual(dosesIn({ ...severeIv, source: "idsa" }), []);
  const archive = dosesIn({ source: "idsa", idsa_version: "archive" });
  assert.equal(archive.length, 4);
  assert.ok(archive.every(({ source }) => source === "pids2011"));
  assert.match(archive[1].dose, /tối đa 4 g\/ngày/);
});

console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
