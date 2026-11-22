import assert from "node:assert/strict";
import { test } from "node:test";
import { cholangitisTableDose } from "../../components/antibiotics/empiric/cholangitis-dose";
import { INTL_GUIDELINE_JSON } from "../../data/guidelines/intl";
import { cholangitisChoices, cholangitisCombination, cholangitisCourse, tg18Diagnosis, tg18Severity } from "../../lib/antibiotics/cholangitis-plan";
import { effectiveState, resolve } from "../../lib/intl-rules";
import { intlGuideline } from "../../schema/intl-guideline";

const guideline = intlGuideline.parse(INTL_GUIDELINE_JSON["v8-24"]);
const plan = (severity: string, setting: string, anastomosis = false, vre = false) =>
  resolve(guideline, effectiveState(guideline.axes, { severity, setting, anastomosis: anastomosis ? "present" : "absent", vre_risk: vre, vre_community: vre }));

test("TG18 requires both severity and acquisition setting before showing drug options", () => {
  for (const result of [plan("pending", "pending"), plan("pending", "healthcare"), plan("iii", "pending", true)]) {
    assert.equal(result.blocks.length, 0);
    assert.ok(!result.after.some(({ id }) => id === "duration"));
  }
});

test("TG18 resolves every completed scenario with its drug, drainage and duration sections", () => {
  for (const severity of ["i", "ii", "iii"]) {
    for (const setting of ["community", "healthcare"]) {
      const result = plan(severity, setting);
      assert.equal(result.conflicts.length, 0);
      assert.ok(result.blocks.some(({ items }) => items.length > 0));
      assert.ok(result.before.some(({ id }) => id === `drainage-${severity}`));
      assert.match(result.after.find(({ id }) => id === "duration")!.items[0].text, /4–7 ngày sau khi kiểm soát/);
      const options = result.blocks.flatMap(({ items }) => items);
      for (const option of options) {
        assert.ok(option.dose && option.administration);
        assert.ok(option.source_ids.includes("tg18-antibiotics"));
        assert.ok(option.source_ids.some((id) => id.startsWith("dose-")));
      }
      const allDrugs = options.map(({ role }) => role).join(" ");
      if (severity === "iii" || setting === "healthcare") {
        assert.match(allDrugs, /aztreonam/i);
        assert.match(allDrugs, /vancomycin/i);
        assert.doesNotMatch(allDrugs, /fluoroquinolon/i);
      } else {
        assert.match(allDrugs, /fluoroquinolon|ciprofloxacin/i);
        assert.doesNotMatch(allDrugs, /vancomycin/i);
      }
    }
  }
});

test("TG18 adds the anaerobic section for a biliary-enteric anastomosis", () => {
  const hasAnaerobicSection = (result: ReturnType<typeof plan>) => result.blocks.some(({ title }) => title.includes("miệng nối mật–ruột"));
  assert.equal(hasAnaerobicSection(plan("ii", "community")), false);
  assert.equal(hasAnaerobicSection(plan("ii", "community", true)), true);
  assert.equal(hasAnaerobicSection(plan("i", "healthcare", true)), true);
  assert.equal(guideline.review.state, "draft_ai");
  assert.equal(guideline.sources.filter(({ id }) => id.startsWith("tg18-")).length, 3);
});

test("TG18 table separates verified formulation strength, dose and timing", () => {
  const medicines = new Map<string, string>();
  for (const severity of ["i", "ii", "iii"]) {
    for (const context of ["community", "healthcare"]) {
      for (const vre of [false, true]) {
        const rows = plan(severity, context, true, vre).blocks.flatMap(({ items }) => items);
        for (const item of rows) {
          assert.ok(item.preparation && item.dose, item.role);
          const validSource = item.role === "Aztreonam" ? "dose-aztreonam"
            : item.role === "Daptomycin" ? "dose-daptomycin-label"
              : "bv199-formulary";
          assert.ok(item.source_ids.includes(validSource), item.role);
          const parts = cholangitisTableDose(item.dose);
          assert.ok(parts.dose && parts.route && parts.frequency, item.role);
          if (item.role !== "Vancomycin") assert.ok(parts.dosesPerDay, item.role);
          medicines.set(item.role, item.dose);
        }
      }
    }
  }
  assert.equal(medicines.size, 16);

  const cefuroxime = cholangitisTableDose(medicines.get("Cefuroxim")!);
  assert.equal(cefuroxime.dose, "1,5 g");
  assert.equal(cefuroxime.dosesPerDay, 3);

  const piperacillin = cholangitisTableDose(medicines.get("Piperacillin/tazobactam")!);
  assert.equal(piperacillin.loadingDose, "4,5 g");
  assert.equal(piperacillin.dose, "4,5 g");
  assert.equal(piperacillin.dosesPerDay, 3);

  const vancomycin = cholangitisTableDose(medicines.get("Vancomycin")!);
  assert.match(vancomycin.frequency ?? "", /Nạp một lần.*Duy trì.*TDM/);
  assert.equal(vancomycin.dosesPerDay, undefined);

  const daptomycin = cholangitisTableDose(medicines.get("Daptomycin")!);
  assert.equal(daptomycin.dosesPerDay, 1);
  assert.match(daptomycin.qualifier ?? "", /CrCl >30 mL\/phút/);
});

test("community grade I and II expose distinct TG18 backbones and susceptibility conditions", () => {
  const mild = cholangitisChoices(plan("i", "community"), false);
  assert.deepEqual(mild.base.map(({ role }) => role), ["Cefazolin", "Cefuroxim", "Ceftriaxon", "Cefotaxim"]);
  assert.match(mild.alternativesLead ?? "", /Ampicillin\/sulbactam.*>80%/);
  assert.ok(mild.base.find(({ role }) => role === "Cefuroxim")?.source_ids.includes("dose-cefuroxime"));

  const moderate = cholangitisChoices(plan("ii", "community"), true);
  assert.deepEqual(moderate.base.map(({ role }) => role), ["Piperacillin/tazobactam"]);
  assert.deepEqual(moderate.alternatives.map(({ role }) => role), ["Cefepim", "Ceftazidim"]);
  assert.equal(moderate.baseLead, undefined);

  for (const setting of ["community", "healthcare"]) {
    const severe = cholangitisChoices(plan("iii", setting), false);
    const backbones = [...severe.base, ...severe.alternatives].map(({ role }) => role);
    assert.doesNotMatch(backbones.join(" "), /Ceftriaxon|Cefuroxim|Ampicillin\/sulbactam|Ertapenem|Ciprofloxacin/);
    assert.ok(severe.enterococcus);
  }
});

test("a VRE substitution replaces vancomycin without removing the Gram-negative backbone", () => {
  const options = (setting: string, enabled: boolean) => plan("iii", setting, false, enabled).blocks.flatMap(({ items }) => items.map(({ role }) => role));
  assert.ok(options("healthcare", false).includes("Vancomycin"));
  assert.ok(!options("healthcare", false).includes("Linezolid"));
  const substitute = options("healthcare", true);
  assert.ok(!substitute.includes("Vancomycin"));
  assert.ok(substitute.includes("Linezolid") && substitute.includes("Daptomycin"));
  assert.ok(substitute.includes("Cefepim"));
  assert.ok(options("community", true).includes("Linezolid"));
  assert.ok(!options("community", true).includes("Vancomycin"));
  assert.ok(!plan("ii", "community", false, true).blocks.some(({ title }) => title.includes("VRE")));
});

test("a TG18 checklist requires enough assessed criteria and prioritizes organ dysfunction", () => {
  const empty = { organFindings: [], noOrganDysfunction: false, moderateFindings: [], moderateReviewed: false };
  const excludedOrganDysfunction = { ...empty, noOrganDysfunction: true };
  const twoModerateFindings = ["fever", "age"];
  assert.equal(tg18Severity(empty), "pending");
  assert.equal(tg18Severity({ ...empty, moderateFindings: twoModerateFindings }), "pending");
  assert.equal(tg18Severity({ ...excludedOrganDysfunction, moderateFindings: ["fever"] }), "pending");
  assert.equal(tg18Severity({ ...excludedOrganDysfunction, moderateReviewed: true }), "i");
  assert.equal(tg18Severity({ ...excludedOrganDysfunction, moderateFindings: ["fever"], moderateReviewed: true }), "i");
  assert.equal(tg18Severity({ ...excludedOrganDysfunction, moderateFindings: twoModerateFindings }), "ii");
  assert.equal(tg18Severity({ ...empty, organFindings: ["renal"] }), "iii");
  assert.equal(tg18Severity({ ...excludedOrganDysfunction, organFindings: ["renal"], moderateFindings: twoModerateFindings }), "iii");
  assert.match(tg18Diagnosis(true, false, true), /nghi ngờ/);
  assert.match(tg18Diagnosis(true, true, true), /xác định/);
});

test("a selected backbone controls anaerobic duplication and unresolved coverage", () => {
  assert.deepEqual(cholangitisCombination("Cefuroxim", "present", false, false), { addAnaerobic: true, mode: "Phối hợp" });
  assert.deepEqual(cholangitisCombination("Ceftriaxon", "present", false, false), { addAnaerobic: true, mode: "Phối hợp" });
  assert.deepEqual(cholangitisCombination("Piperacillin/tazobactam", "present", false, false), { addAnaerobic: false, mode: "Đơn trị theo dữ kiện đã chọn" });
  assert.match(cholangitisCombination("Ceftriaxon", "pending", false, false).mode, /xác nhận/);
  assert.match(cholangitisCombination("Aztreonam", "absent", false, false).mode, /xác nhận/);
  assert.equal(cholangitisChoices(plan("i", "community"), true).base.length, 0);
  assert.deepEqual(cholangitisChoices(plan("ii", "community"), true).alternatives.map(({ role }) => role), ["Cefepim", "Ceftazidim"]);
});

test("the 4–7 day plan is conditional on source control and longer-course factors", () => {
  assert.match(cholangitisCourse("controlled", "none").title, /^4–7 ngày/);
  assert.match(cholangitisCourse("uncontrolled", "none").title, /^Chưa tính/);
  assert.match(cholangitisCourse("controlled", "pending").title, /^Chờ xác nhận/);
  assert.match(cholangitisCourse("controlled", "gram-positive").detail, /tối thiểu 2 tuần/);
  assert.match(cholangitisCourse("controlled", "abscess").title, /áp-xe gan/);
});
