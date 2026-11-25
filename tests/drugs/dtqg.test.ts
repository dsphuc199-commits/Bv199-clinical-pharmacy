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

/* ===== Ghép muối và chính tả Anh – Việt; Thông tư 20/2022 (BHYT) ===== */
import { bhytFor, routeMatches } from "../../lib/drugs/bhyt";
import tt20 from "../../data/bhyt-tt20.json";
test("salt-only drugs keep cation AND anion (sodium chloride never matches potassium chloride); English spellings fold to Vietnamese", () => {
  assert.equal(ingredientKey("Sodium chloride"), ingredientKey("Natri clorid"));
  assert.equal(ingredientKey("Potassium chloride"), ingredientKey("Kali clorid"));
  assert.notEqual(ingredientKey("Natri Chlorid"), ingredientKey("Kali clorid"));
  assert.equal(dtqgFor("Sodium chloride").mono?.id, dtqgFor("Natri clorid").mono?.id);
  assert.notEqual(dtqgFor("Sodium chloride").mono?.id, "kali-clorid");
  assert.equal(ingredientKey("Calcium lactate pentahydrat"), ingredientKey("Calci lactat"));
  assert.equal(ingredientKey("Amiodarone hydrochloride"), ingredientKey("Amiodaron hydroclorid"));
  assert.equal(ingredientKey("Cefuroxime (dưới dạng Cefuroxime Sodium)"), ingredientKey("Cefuroxim"));
  assert.equal(ingredientKey("Methylprednisolon"), ingredientKey("Methyl prednisolon"));
  assert.equal(ingredientKey("Acid tranexamic"), ingredientKey("Tranexamic acid"));
});

test("TT 20/2022: complete STT 1–1037, consult star, merged notes, multi-route rows, BV199 matching", () => {
  const items = (tt20 as { items: { stt: number; name: string; consult: boolean; routes: { route: string; hang: boolean[]; note: string }[] }[] }).items;
  const stts = new Set(items.map((i) => i.stt));
  for (let i = 1; i <= 1037; i++) assert.ok(stts.has(i), `STT ${i}`);
  const mero = bhytFor("Meropenem (dưới dạng Meropenem trihydrat)");
  assert.equal(mero.length, 1);
  assert.equal(mero[0].consult, true);
  assert.deepEqual(mero[0].routes[0].hang, [true, true, false, false]);
  const ppi = ["Omeprazol", "Esomeprazol", "Pantoprazol", "Rabeprazol"].map((n) => bhytFor(n)[0].routes[0].note);
  assert.ok(ppi.every((n) => n === ppi[0] && /stress ở bệnh nhân hồi sức tích cực\.$/.test(n)));
  const cipro = bhytFor("Ciprofloxacin")[0];
  assert.deepEqual(cipro.routes.map((r) => r.route), ["Tiêm", "Uống, nhỏ mắt, nhỏ tai"]);
  assert.deepEqual(cipro.routes[1].hang, [true, true, true, true]);
  assert.equal(bhytFor("Levofloxacin").length, 2);
  assert.ok(routeMatches("Tiêm truyền tĩnh mạch", "Tiêm"));
  assert.ok(!routeMatches("Uống", "Tiêm"));
});
