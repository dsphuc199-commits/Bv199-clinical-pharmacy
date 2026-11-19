const assert = require("node:assert/strict");
const load = require("./tsrun.cjs");
const sepsis = require("../../data/guidelines/intl/nhiem-khuan-huyet-so-sinh.json");
const pneumonia = require("../../data/guidelines/intl/viem-phoi-so-sinh.json");
const { combos, resolve } = load("lib/intl-rules.ts");
const { intlGuideline } = load("schema/intl-guideline.ts");
const { parseDose } = load("components/antibiotics/empiric/rx-dose-parts.ts");

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

const items = (guideline, state) => resolve(guideline, state).blocks.flatMap((block) => block.items);
const doses = (guideline, state) => items(guideline, state).filter((item) => item.dose).map((item) => {
  const parts = parseDose(item.dose);
  assert.ok(parts, item.dose);
  return [item.text, parts.dose, parts.route, parts.freq, item.course ?? parts.duration];
});
const nice = { source: "nice", nice_scope: "within" };
const who = { source: "who", who_profile: "standard" };

check("WHO: đúng hai thuốc, liều, đường dùng và thời gian theo tuổi và bệnh cảnh", () => {
  const cases = [
    { guideline: sepsis, standardCase: "sepsis", ages: ["first-week", "later"], days: 10 },
    { guideline: pneumonia, standardCase: "pneumonia", ages: ["week-one", "after-week-one"], days: 7 },
  ];
  for (const { guideline, standardCase, ages, days } of cases) {
    for (const [who_case, betaLactam] of [[standardCase, "Ampicillin"], ["staph", "Cloxacillin"]]) {
      for (const [index, who_age] of ages.entries()) {
        const state = { ...who, who_case, who_age };
        const route = "tiêm bắp hoặc tĩnh mạch";
        assert.deepEqual(doses(guideline, state), [
          [betaLactam, "50 mg/kg/liều", route, index === 0 ? "mỗi 12 giờ" : "mỗi 8 giờ", `Ít nhất ${days} ngày`],
          ["Gentamicin", index === 0 ? "5 mg/kg/liều" : "7,5 mg/kg/liều", route, "1 lần/ngày", `Ít nhất ${days} ngày`],
        ]);
        assert.match(items(guideline, state).find(({ text }) => text === "Gentamicin").administration, /nồng độ/i);
      }
    }
  }
});

check("WHO: chỉ hiện liều sau khi xác nhận bệnh cảnh nội trú và nhóm đủ điều kiện", () => {
  for (const [g, who_age, standardCase, invasive] of [
    [sepsis, "first-week", "sepsis", "meningitis"],
    [pneumonia, "week-one", "pneumonia", "invasive"],
  ]) {
    for (const state of [
      {},
      { ...who, who_age: "outside", who_case: standardCase },
      { ...who, who_age, who_case: "referral" },
      { ...who, who_age, who_case: invasive },
      { source: "who", who_age, who_case: standardCase },
      { source: "who", who_age, who_case: standardCase, who_profile: "special" },
    ]) assert.deepEqual(doses(g, state), []);
  }
});

check("NICE: liều tĩnh mạch khởi phát sớm và đánh giá lại sau 36 giờ", () => {
  const state = { ...nice, nice_case: "early" };
  assert.deepEqual(doses(sepsis, state), [
    ["Benzylpenicillin natri", "25 mg/kg/liều", "tĩnh mạch", "mỗi 12 giờ", undefined],
    ["Gentamicin", "5 mg/kg/liều (khởi đầu)", "tĩnh mạch", "1 liều", undefined],
  ]);
  const [penicillin, gentamicin] = items(sepsis, state);
  assert.match(penicillin.administration, /mỗi 8 giờ/);
  assert.match(gentamicin.administration, /liều thứ hai thường sau 36 giờ/i);
  const notes = resolve(sepsis, state).notes.map(({ text }) => text).join(" ");
  assert.match(notes, /Ngừng ở 36 giờ.*bốn tiêu chí/);
  assert.match(notes, /tổng 7 ngày.*cấy máu dương tính/);
});

check("NICE: chuyển uống cần xác nhận và khởi phát muộn có mốc 48 giờ", () => {
  const oral = { ...nice, nice_case: "early-oral" };
  assert.deepEqual(items(sepsis, oral), []);
  assert.deepEqual(doses(sepsis, { ...oral, nice_switch: true }), []);
  assert.match(items(sepsis, { ...oral, nice_switch: true })[0].text, /Amoxicillin uống/);
  const late = { ...nice, nice_case: "late-unit" };
  assert.deepEqual(doses(sepsis, late), []);
  assert.match(items(sepsis, late)[0].text, /Flucloxacillin tĩnh mạch/);
  assert.match(resolve(sepsis, late).notes.map(({ text }) => text).join(" "), /48 giờ/);
  for (const nice_case of ["late-home", "meningitis", "special"]) {
    assert.deepEqual(doses(sepsis, { ...nice, nice_case, nice_switch: true }), []);
  }
  assert.deepEqual(doses(sepsis, { ...nice, nice_scope: "outside", nice_case: "early" }), []);
});

check("Hai mô-đun sơ sinh: tất cả tổ hợp hợp lệ tách đúng nguồn khuyến cáo", () => {
  for (const raw of [sepsis, pneumonia]) {
    const guideline = intlGuideline.parse(raw);
    for (const state of combos(guideline.axes)) {
      const result = resolve(guideline, state);
      assert.ok(result.primary, JSON.stringify(state));
      const org = state.source === "nice" ? "NICE" : "WHO";
      const expected = guideline.sources.filter((source) => source.org === org).map(({ id }) => id);
      assert.deepEqual(result.primary.source_ids, expected);
      for (const item of result.blocks.flatMap((block) => block.items)) {
        assert.deepEqual(item.source_ids, expected);
      }
    }
  }
});

console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
