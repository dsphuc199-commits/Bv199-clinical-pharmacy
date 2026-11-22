import assert from "node:assert/strict";
import { test } from "node:test";
import { INTL_GUIDELINE_JSON } from "../../data/guidelines/intl";
import { effectiveState, resolve } from "../../lib/intl-rules";
import { intlGuideline } from "../../schema/intl-guideline";

const guideline = intlGuideline.parse(INTL_GUIDELINE_JSON["v8-24"]);
const plan = (severity: string, setting: string, anastomosis = false, vre = false) =>
  resolve(guideline, effectiveState(guideline.axes, { severity, setting, anastomosis, vre_risk: vre, vre_community: vre }));

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
