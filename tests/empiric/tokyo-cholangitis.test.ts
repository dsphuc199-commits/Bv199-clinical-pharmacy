import assert from "node:assert/strict";
import { test } from "node:test";
import { INTL_GUIDELINE_JSON } from "../../data/guidelines/intl";
import { effectiveState, resolve } from "../../lib/intl-rules";
import { intlGuideline } from "../../schema/intl-guideline";

const guideline = intlGuideline.parse(INTL_GUIDELINE_JSON["v8-24"]);
const plan = (severity: string, setting: string, anastomosis = false) =>
  resolve(guideline, effectiveState(guideline.axes, { severity, setting, anastomosis }));

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
      assert.ok(!result.blocks.some(({ items }) => items.some(({ dose }) => Boolean(dose))));
      const allDrugs = result.blocks.flatMap(({ items }) => items).map(({ text }) => text).join(" ");
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
  assert.equal(guideline.sources.length, 3);
});
