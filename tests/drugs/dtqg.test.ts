import test from "node:test";
import assert from "node:assert/strict";
import { dtqgFor, ingredientKey } from "../../lib/drugs/dtqg";

test("ingredientKey drops salts, parentheses and joins combinations order-independently", () => {
  assert.equal(ingredientKey("Amikacin (dưới dạng Amikacin sulfat)"), "amikacin");
  assert.equal(ingredientKey("Meropenem*"), "meropenem");
  assert.equal(ingredientKey("Bisoprolol fumarat"), "bisoprolol");
  assert.equal(ingredientKey("Amoxicilin + Acid clavulanic"), ingredientKey("Amoxicilin và kali clavulanat"));
  assert.equal(ingredientKey("Sulbactam + Ampicillin"), ingredientKey("Ampicillin + Sulbactam"));
});

test("strict match: single-ingredient products get their monograph; combinations never get a single-ingredient monograph", () => {
  assert.equal(dtqgFor("Amikacin (dưới dạng Amikacin sulfat)").renal?.name, "Amikacin");
  assert.equal(dtqgFor("Voriconazole").renal?.name, "Voriconazol");
  assert.equal(dtqgFor("Ampicillin (dưới dạng Ampicillin natri) + Sulbactam (dưới dạng Sulbactam natri)").renal?.name, "Ampicilin và sulbactam");
  assert.equal(dtqgFor("Glimepirid + Metformin hydroclorid").renal, undefined);
  assert.equal(dtqgFor("Glimepirid + Metformin hydroclorid").pregnancy, undefined);
  assert.deepEqual(dtqgFor(""), {});
  assert.deepEqual(dtqgFor(null), {});
});

test("every matched monograph carries printed page numbers for citation", () => {
  for (const n of ["Amikacin", "Lisinopril", "Clarithromycin", "Fluconazol"]) {
    const m = dtqgFor(n);
    for (const it of [m.renal, m.pregnancy]) if (it) assert.ok(it.pages.printed.length > 0, n);
  }
});
