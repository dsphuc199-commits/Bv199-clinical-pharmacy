const assert = require("node:assert/strict");
const load = require("./tsrun.cjs");
const guideline = require("../../data/guidelines/intl/viem-phoi-cong-dong-o-tre-em.json");
const { resolve } = load("lib/intl-rules.ts");
const { parseDose } = load("components/antibiotics/empiric/rx-dose-parts.ts");

const itemsIn = (selection) => resolve(guideline, selection).blocks.flatMap((block) => block.items);
const dosesIn = (selection) => itemsIn(selection)
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
  const infant = itemsIn({ ...standard, nice_age: "infant" })[0];
  assert.match(infant.preparation, /250 mg\/5 mL/);
  assert.match(infant.administration, /2,5 mL\/liều/);
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
  const ivItem = itemsIn(severeIv)[0];
  assert.match(ivItem.course, /^Tổng đợt 5 ngày/);
  assert.match(ivItem.administration, /25 mg amoxicillin \+ 5 mg clavulanat\/kg/);
  assert.match(ivItem.administration, /Claminat/);
});

check("NICE: dạng hỗn dịch thay thế 4:1 giữ đúng định lượng và nhóm tuổi", () => {
  const oral = itemsIn({ ...severe, nice_age: "young", nice_route: "oral" });
  assert.equal(oral.length, 2);
  assert.match(oral[0].preparation, /125 mg.*31,25 mg.*5 mL/);
  assert.match(oral[1].preparation, /250 mg.*62,5 mg.*5 mL/);
  assert.equal(parseDose(oral[1].dose).dose, "5 mL/liều");
  assert.equal(itemsIn({ ...severe, nice_age: "infant", nice_route: "oral" }).length, 1);
});

check("NICE: thai kỳ chỉ hiện erythromycin khi chọn thuốc thay thế", () => {
  for (const [nice_age, duration] of [["child-older", "3 ngày"], ["teen", "5 ngày"]]) {
    const rows = dosesIn({ source: "nice", nice_case: "alternative", nice_age, nice_pregnant: true });
    assert.equal(rows.length, 1);
    assert.equal(rows[0].drug, "Erythromycin");
    assert.equal(rows[0].duration, duration);
  }
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
  assert.equal(dosesIn({ source: "who", who_case: "fast", who_low_hiv: true })[0].duration, "3 ngày");
  assert.equal(dosesIn({ source: "who", who_case: "indrawing", who_low_hiv: true })[0].duration, "5 ngày");
});

check("IDSA/PIDS: Phần 1 năm 2026 không hiện liều và tài liệu lưu trữ tách riêng", () => {
  assert.deepEqual(dosesIn({ ...severeIv, source: "idsa" }), []);
  const archive = { source: "idsa", idsa_version: "archive" };
  assert.deepEqual(dosesIn(archive), []);
  const typical = dosesIn({ ...archive, idsa_case: "typical", idsa_age: "five-plus" });
  assert.equal(typical.length, 2);
  assert.ok(typical.every(({ source, dose }) => source === "pids2011" && dose.includes("tối đa 4 g/ngày")));
  const empiric = { ...archive, idsa_case: "inpatient", idsa_inpatient: "standard", idsa_suspect_staph: true };
  assert.deepEqual(dosesIn(empiric), []);
  assert.match(itemsIn(empiric)[2].text, /Vancomycin hoặc clindamycin/);
  const targeted = dosesIn({ ...archive, idsa_case: "pneumo", idsa_mic: "high" });
  assert.deepEqual(targeted.map(({ drug, dose }) => [drug, dose]), [["Ceftriaxone", "100 mg/kg/ngày"]]);
});

console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
