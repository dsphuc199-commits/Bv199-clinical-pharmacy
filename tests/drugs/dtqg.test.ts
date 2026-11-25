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

/* ===== Chuyên luận đầy đủ (các mục lâm sàng) ===== */
import { existsSync, readFileSync } from "node:fs";
import { flaggedSections, loadMonograph, textOk } from "../../lib/drugs/dtqg";
import monoIndex from "../../data/dtqg-index.json";

test("textOk rejects broken Vietnamese (split or doubled tone marks) and formula images, accepts valid one-letter words", () => {
  const p = (text: string) => [{ t: "p" as const, runs: [{ text }] }];
  assert.equal(textOk(p("Người lớn chức năng thận b ì nh thường:")), false);
  assert.equal(textOk(p("thậần trọng")), false);
  assert.equal(textOk(p("Chú ý ở người châu Á; nhiễm khuẩn ổ bụng; thời gian ủ bệnh; ù tai, ợ hơi, ứ mật.")), true);
  assert.equal(textOk([{ t: "img", src: "/x.webp", w: 1, h: 1, alt: "" }]), false);
});

test("every monograph in the index has its data file; every shown (non-flagged) section passes textOk", async () => {
  const items = (monoIndex as { items: { id: string; keys: string[] }[] }).items;
  assert.ok(items.length > 300);
  for (const it of items) {
    assert.ok(existsSync(`data/dtqg/${it.id}.json`), it.id);
    const m = JSON.parse(readFileSync(`data/dtqg/${it.id}.json`, "utf8"));
    const flagged = flaggedSections(it.id);
    for (const [k, blocks] of Object.entries(m.sections)) if (!flagged.has(k as never)) assert.ok(textOk(blocks as never), `${it.id}/${k}`);
  }
  assert.equal((await loadMonograph("amikacin"))?.name, "Amikacin");
  assert.equal(await loadMonograph("../etc"), null);
});

import { fixSubscripts } from "../../lib/dosing/dtqg-text";
test("fixSubscripts re-attaches displaced Clcr / Css subscripts without touching other words", () => {
  assert.equal(fixSubscripts("Cl (ml/phút) cr"), "Clcr (ml/phút)");
  assert.equal(fixSubscripts("dùng 50% liều nếu Cl < 50 ml/phút. cr"), "dùng 50% liều nếu Clcr < 50 ml/phút.");
  assert.equal(fixSubscripts("Liều để đạt C mục tiêu = 2 mg/lít ss"), "Liều để đạt Css mục tiêu = 2 mg/lít");
  assert.equal(fixSubscripts("Cl bệnh nhân/cr Cl bình thường cr"), "Clcr bệnh nhân/Clcr bình thường");
  assert.equal(fixSubscripts("Clcr ≥ 80 ml/phút; creatinin huyết thanh"), "Clcr ≥ 80 ml/phút; creatinin huyết thanh");
});
