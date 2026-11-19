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

check("CAP trẻ em: mở IDSA 2011 trước và chờ chọn bệnh cảnh", () => {
  const landing = resolve(guideline, { ...severeIv, source: "idsa" });
  assert.equal(landing.primary.id, "pids-archive");
  assert.deepEqual(landing.primary.source_ids, ["pids2011"]);
  assert.deepEqual(landing.blocks, []);
  assert.deepEqual(landing.summary, []);
  assert.deepEqual(dosesIn({}), []);
  assert.deepEqual(guideline.axes.find(({ id }) => id === "idsa_version").options.map(({ id }) => id), ["archive", "effusion"]);
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
      { drug: "Amoxicillin", source: "nice250", dose, route: "uống", freq: "3 lần/ngày", duration },
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
  const atypicalIv = { ...severeIv, nice_age: "young", nice_atypical: true };
  assert.deepEqual(dosesIn(atypicalIv), dosesIn(severeIv));
  const combined = dosesIn({ ...atypicalIv, nice_macrolide_route: "iv" });
  assert.equal(combined.length, 2);
  assert.equal(combined[1].dose, "7,5 mg/kg/liều, tối đa 500 mg/liều");
  assert.equal(combined[1].route, "tĩnh mạch");
  const oralMacrolide = dosesIn({ ...atypicalIv, nice_macrolide_route: "oral" });
  assert.equal(oralMacrolide[0].route, "tĩnh mạch");
  assert.ok(oralMacrolide.slice(1).every(({ route, freq }) => route === "uống" && freq === "2 lần/ngày"));
  assert.equal(oralMacrolide.length, 6);
  assert.equal(dosesIn({ ...severeIv, nice_macrolide_route: "oral" }).length, 1);
  const ivItem = itemsIn(severeIv)[0];
  assert.match(ivItem.course, /^Tổng đợt 5 ngày/);
  assert.match(ivItem.administration, /25 mg amoxicillin \+ 5 mg clavulanat\/kg/);
  assert.match(ivItem.administration, /Claminat 600.*dưới 3 tuổi/);
  assert.match(ivItem.administration, /Claminat 1,2 g.*dưới 40 kg.*dưới 1.000 mg \+ 200 mg/);
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
        dose: "40 mg/kg/liều (liều tối thiểu)", route: "uống", freq: "2 lần/ngày", duration: "5 ngày",
      },
    ]);
  }
  assert.deepEqual(dosesIn({ source: "who", who_case: "other" }), []);
  assert.equal(dosesIn({ source: "who", who_case: "fast", who_low_hiv: true })[0].duration, "3 ngày");
  assert.equal(dosesIn({ source: "who", who_case: "indrawing", who_low_hiv: true })[0].duration, "5 ngày");
});

check("IDSA/PIDS: Phần 1 năm 2026 không hiện liều và tài liệu lưu trữ tách riêng", () => {
  const effusion = { ...severeIv, source: "idsa", idsa_version: "effusion" };
  assert.deepEqual(dosesIn(effusion), []);
  const current = resolve(guideline, effusion);
  assert.deepEqual(current.primary.source_ids, ["pids2026"]);
  assert.ok(current.summary.some(({ text }) => text.includes("Chưa có khuyến cáo liều kháng sinh")));
  const archive = { source: "idsa", idsa_version: "archive" };
  assert.deepEqual(dosesIn(archive), []);
  const typical = dosesIn({ ...archive, idsa_case: "typical", idsa_age: "five-to-seven" });
  assert.deepEqual(typical.map(({ drug }) => drug), ["Amoxicillin", "Amoxicillin/clavulanat", "Azithromycin", "Azithromycin"]);
  assert.ok(typical.slice(0, 2).every(({ source, dose }) => source === "pids2011" && dose.includes("tối đa 4 g/ngày")));
  assert.equal(dosesIn({ ...archive, idsa_case: "typical", idsa_age: "under-five" }).length, 2);
  const empiric = { ...archive, idsa_case: "inpatient", idsa_inpatient: "standard", idsa_suspect_staph: true };
  assert.deepEqual(dosesIn(empiric), []);
  assert.match(itemsIn(empiric)[2].text, /Vancomycin hoặc clindamycin/);
  const targeted = dosesIn({ ...archive, idsa_case: "pneumo", idsa_mic: "high" });
  assert.deepEqual(targeted.map(({ drug, dose, freq }) => [drug, dose, freq]), [["Ceftriaxone", "100 mg/kg/ngày", "chia mỗi 12–24 giờ"]]);
});

check("IDSA/PIDS 2011: đúng giới hạn tuổi doxycycline và phác đồ tràn dịch lưu trữ", () => {
  const atypical = { source: "idsa", idsa_case: "atypical" };
  for (const idsa_age of ["under-five", "five-to-seven"]) {
    assert.ok(dosesIn({ ...atypical, idsa_age }).every(({ drug }) => drug !== "Doxycycline"));
  }
  assert.ok(dosesIn({ ...atypical, idsa_age: "over-seven" }).some(({ drug }) => drug === "Doxycycline"));
  const pneumococcus = { source: "idsa", idsa_case: "pneumo", idsa_mic: "low" };
  assert.deepEqual(dosesIn(pneumococcus).filter(({ route }) => route === "uống").map(({ dose, freq }) => [dose, freq]), [
    ["45 mg/kg/liều (90 mg/kg/ngày)", "2 lần/ngày"],
    ["15 mg/kg/liều (45 mg/kg/ngày)", "3 lần/ngày"],
  ]);
  const pleural = itemsIn({ source: "idsa", idsa_case: "pleural-antibiotics" });
  assert.match(pleural.at(-1).text, /2–4 tuần/);
  assert.ok(pleural.every((row) => row.source_ids[0] === "pids2011"));
  assert.match(pleural.at(-1).ref, /KC 71/);
});

console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
