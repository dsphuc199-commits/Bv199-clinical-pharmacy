// Unit test Master Task 5 – Final: lop lieu bo sung, MISSING_DOSE_EVIDENCE, chay engine cho ca 69 benh,
// Safety Gate, bien theo tung benh, nguon quoc te Nhom 4, route cu. Chay: node tests/empiric/mt5-final-test.cjs
const fs = require("fs"), path = require("path");
const load = require("./tsrun.cjs");
const ROOT = path.resolve(__dirname, "..", "..");
const SE = load("lib/antibiotics/selection-engine.ts");
const R = load("data/antibiotics/empiric/regimens/index.ts");
const D = load("data/antibiotics/empiric/dose-supplements.ts");
const A = load("data/antibiotics/empiric/safety-alerts.ts");
const I = load("data/antibiotics/empiric/international.ts");
const C = load("data/antibiotics/empiric/catalog.ts");
let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${!ok && d !== undefined ? "  — " + JSON.stringify(d).slice(0, 400) : ""}`); };
const byId = new Map(R.ALL_REGIMENS.map((r) => [r.id, r]));
const opts = (res) => (res.status === "ready" ? res.groups.flatMap((g) => g.options) : []);

/* ---------- 1. Lop lieu bo sung ---------- */
const sups = D.DOSE_SUPPLEMENTS;
check("Mọi liều bổ sung gắn với phương án BYT có thật", sups.every((s) => byId.has(s.regimenId)), sups.filter((s) => !byId.has(s.regimenId)).map((s) => s.regimenId));
check("Mọi liều bổ sung có nguồn: tên, vị trí (mục/trang), ngày xác minh", sups.every((s) => s.source.title && s.source.locator && /\d/.test(s.source.locator) && /\d{2}\/\d{2}\/\d{4}/.test(s.checkedOn)));
const docNum = (id) => R.DOCS[byId.get(id).source.doc].number.split("/")[0].trim();
check("Liều 'cùng văn bản' trích đúng số quyết định của phương án", sups.filter((s) => s.kind === "same-document").every((s) => s.source.title.includes(`QĐ ${docNum(s.regimenId)}`)), sups.filter((s) => s.kind === "same-document").map((s) => [s.regimenId, docNum(s.regimenId), s.source.title.slice(0, 20)]));
check("Không bổ sung cho phương án đã có liều nguyên văn", sups.every((s) => !R.isConcreteRegimen(byId.get(s.regimenId))));
check("Liều bổ sung không chứa cờ CHƯA XÁC MINH", sups.every((s) => s.items.every((it) => !/CHƯA XÁC MINH/.test(it.dose))));
check("Phương án bị khóa an toàn không nhận liều bổ sung", sups.every((s) => A.autoRecommendBlocks(s.regimenId).length === 0));

const shown = new Map();
for (const d of C.DISEASES) for (const r of R.getRegimensForDisease(d.id)) shown.set(r.id, r);
const sum = D.doseEvidenceSummary([...shown.values()]);
check(`Phân loại liều ${shown.size} phương án đang hiển thị: ${sum.SOURCE_DOSE} nguyên văn / ${sum.SUPPLEMENTED} bổ sung / ${sum.MISSING_DOSE_EVIDENCE} MISSING`, sum.SOURCE_DOSE + sum.SUPPLEMENTED + sum.MISSING_DOSE_EVIDENCE === shown.size && sum.SOURCE_DOSE === [...shown.values()].filter(R.isConcreteRegimen).length);
const missing = [...shown.values()].filter((r) => D.doseEvidenceOf(r) === "MISSING_DOSE_EVIDENCE");
check("Mọi phương án MISSING_DOSE_EVIDENCE có lý do hiển thị", missing.every((r) => D.missingDoseReason(r.id).length > 20));
check("Clindamycin gel (BYT) KHÔNG nhận liều kem CDC – khác dạng bào chế", ["r-bv-clinda-gel", "r-bv-preg-gel"].every((id) => !D.doseSupplementFor(id) && D.doseEvidenceOf(byId.get(id)) === "MISSING_DOSE_EVIDENCE"));
check("Lao màng não trẻ em: ghi rõ còn thiếu liều streptomycin trẻ em", (D.doseSupplementFor("r-tb-b2")?.stillMissing ?? []).some((m) => /Streptomycin/.test(m)));

/* ---------- 2. Engine cho ca 69 benh ---------- */
function answer(id, base, mode) {
  let input = { ...base };
  for (let i = 0; i < 12; i++) {
    const qs = SE.questionsFor(id, input);
    const todo = qs.filter((q) => q.required && q.key !== "scenario" && (input[q.key] === undefined || input[q.key] === ""));
    if (!todo.length) break;
    for (const q of todo) {
      if (q.kind === "number") { input[q.key] = 45; continue; }
      const vals = q.options.map((o) => o.value);
      const known = vals.filter((v) => v !== "unknown");
      input[q.key] = mode === "unknown" && vals.includes("unknown") ? "unknown" : mode === "alt" ? known[known.length - 1] : known[0];
    }
  }
  const sq = SE.questionsFor(id, input).find((q) => q.key === "scenario");
  const scns = sq ? sq.options.map((o) => o.value) : [undefined];
  return scns.map((s) => ({ input: { ...input, scenario: s }, res: SE.evaluate(id, { ...input, scenario: s }) }));
}

const errors = [], blockedShown = [], badMissing = [], badElig = [], noSource = [], orderBad = [], unknownEligible = [];
const readyByDisease = new Map();
let paths = 0;
for (const d of C.DISEASES) {
  for (const population of ["adult", "child"]) {
    for (const mode of ["known", "alt", "unknown"]) {
      let runs;
      try { runs = answer(d.id, { population, micro: "none" }, mode); } catch (e) { errors.push(`${d.id}: ${e.message}`); continue; }
      for (const { res } of runs) {
        paths++;
        if (res.status !== "ready") continue;
        readyByDisease.set(d.id, (readyByDisease.get(d.id) ?? 0) + 1);
        const srcOrder = R.getRegimensForDisease(d.id).map((r) => r.id);
        for (const g of res.groups) {
          const idx = g.options.map((o) => srcOrder.indexOf(o.id)).filter((i) => i >= 0);
          if (idx.some((v, i) => i > 0 && v < idx[i - 1])) orderBad.push(`${d.id}/${g.kind}`);
        }
        for (const o of opts(res)) {
          if (A.autoRecommendBlocks(o.id, population).length > 0) blockedShown.push(`${d.id}:${o.id}`);
          if (!["ELIGIBLE", "CONDITIONAL"].includes(o.eligibility)) badElig.push(`${d.id}:${o.id}`);
          if (!o.source) noSource.push(`${d.id}:${o.id}`);
          if (o.doseEvidence === "MISSING_DOSE_EVIDENCE" && !(o.noDose && o.eligibility === "CONDITIONAL" && o.conditions.some((c) => c.includes("MISSING_DOSE_EVIDENCE")))) badMissing.push(`${d.id}:${o.id}`);
          // Bien "Khong ro" LIEN QUAN den phuong an -> khong duoc ELIGIBLE.
          // Ngoai le hop ly: chi chua ro di ung penicillin va phuong an khong co beta-lactam.
          const unk = res.unknowns ?? [];
          const relevantUnknown = unk.some((u) => u !== "dị ứng penicillin") || (unk.includes("dị ứng penicillin") && o.conditions.some((c) => /dị ứng penicillin/.test(c)));
          if (relevantUnknown && o.eligibility === "ELIGIBLE") unknownEligible.push(`${d.id}:${o.id}`);
        }
      }
    }
  }
}
check(`Engine chạy 69 bệnh × 2 đối tượng × 3 chế độ nhập (${paths} tình huống) không lỗi`, errors.length === 0, errors);
const withRegimens = C.DISEASES.filter((d) => R.getRegimensForDisease(d.id).length > 0 || ["v8-1", "v8-4", "v8-5"].includes(d.id));
check(`Mọi bệnh có phác đồ đều ra ít nhất một kết quả (${readyByDisease.size}/${withRegimens.length})`, withRegimens.every((d) => readyByDisease.has(d.id)), withRegimens.filter((d) => !readyByDisease.has(d.id)).map((d) => d.id));
check("Không phương án bị khóa an toàn nào xuất hiện trong nhóm đề xuất (mọi bệnh, mọi tình huống)", blockedShown.length === 0, blockedShown);
check("Mọi phương án đề xuất có phân loại ELIGIBLE/CONDITIONAL và có nguồn", badElig.length === 0 && noSource.length === 0, { badElig, noSource });
check("Phương án MISSING_DOSE_EVIDENCE luôn CONDITIONAL, có cờ noDose và điều kiện ghi rõ", badMissing.length === 0, badMissing);
check("Biến 'Không rõ' liên quan → không phương án nào ELIGIBLE (không coi thiếu dữ liệu là bình thường)", unknownEligible.length === 0, unknownEligible);
check("Không tự xếp hạng: trong mỗi nhóm giữ thứ tự của nguồn", orderBad.length === 0, orderBad);

// Phuong an khoa xuat hien o danh sach bi loai voi SAFETY_BLOCKED
const lockedIds = [...shown.keys()].filter((id) => A.autoRecommendBlocks(id).length > 0);
const lockedSeen = new Set();
for (const id of lockedIds) {
  const r = byId.get(id);
  for (const did of r.diseaseIds) for (const population of ["adult", "child"]) {
    const res = SE.evaluate(did, { population, pregnant: "no", penicillinAllergy: "no", renal: "normal", severity: "unknown", mdr: "unknown", micro: "none", scenario: r.scenario });
    if (res.status === "ready" && res.excluded.some((e) => e.eligibility === "SAFETY_BLOCKED" && e.title === r.scenario)) lockedSeen.add(id);
  }
}
check(`12 phương án khóa vẫn khóa và hiện ở mục "Không đề xuất" với SAFETY_BLOCKED (${lockedSeen.size}/${lockedIds.length})`, lockedIds.length === 12 && lockedSeen.size === lockedIds.length, lockedIds.filter((id) => !lockedSeen.has(id)));

// Lieu bo sung hien thi kem nguon; quoc te -> dieu kien tham dinh
const bv = SE.evaluate("v8-95", { population: "adult", pregnant: "no", renal: "normal", micro: "none", scenario: byId.get("r-bv-metro-gel").scenario });
const metro = opts(bv).find((o) => o.id === "r-bv-metro-gel");
check("Gel metronidazol: liều CDC hiển thị là 'bổ sung quốc tế' kèm nguồn và điều kiện thẩm định", !!metro && metro.doseEvidence === "SUPPLEMENTED" && metro.supplement?.kind === "international" && /CDC/.test(metro.supplement.source) && metro.eligibility === "CONDITIONAL" && metro.conditions.some((c) => /guideline quốc tế/.test(c)), metro);

/* ---------- 3. Bien theo tung benh ---------- */
const keys = (id, inp) => SE.questionsFor(id, inp).map((q) => q.key);
check("Lao phổi: không hỏi dị ứng penicillin (phác đồ không có beta-lactam)", !keys("v8-142", { population: "adult" }).includes("penicillinAllergy"));
const noRenal = C.DISEASES.filter((d) => !keys(d.id, { population: "adult" }).includes("renal") && !keys(d.id, { population: "child" }).includes("renal")).map((d) => d.id);
check(`Chỉ bỏ câu hỏi chức năng thận khi mọi phương án là thuốc tại chỗ (${noRenal.length} bệnh)`, noRenal.every((id) => !SE.relevanceOf(id).renal), noRenal);
check("Viêm kết mạc có phác đồ toàn thân (lậu cầu) → vẫn hỏi chức năng thận", keys("v8-83", { population: "adult" }).includes("renal"));
check("CAP: vẫn hỏi dị ứng và chức năng thận", ["penicillinAllergy", "renal"].every((k) => keys("v8-1", { population: "adult" }).includes(k)));
check("Viêm thận bể thận: hỏi dị ứng, thai kỳ, chức năng thận", ["penicillinAllergy", "pregnant", "renal"].every((k) => keys("v8-17", { population: "adult" }).includes(k)));

/* ---------- 4. Nguon quoc te Nhom 4 ---------- */
const G4 = ["v8-6", "v8-142", "v8-141", "v8-84", "v8-83", "v8-88", "v8-128", "v8-97", "v8-95", "v8-60", "v8-99", "v8-7", "v8-58", "v8-26"];
const g4Missing = G4.filter((id) => !I.getIntlEntry(id));
check("14 bệnh Nhóm 4 đều có mục rà soát quốc tế", g4Missing.length === 0, g4Missing);
const badRef = I.INTL_ENTRIES.flatMap((e) => [...e.guidelineIds, ...e.recommendations.map((r) => r.guidelineId), ...e.regimens.map((r) => r.guidelineId)]).filter((g) => !I.INTL_GUIDELINES[g]);
check("Mọi khuyến cáo quốc tế trỏ tới guideline đã đăng ký", badRef.length === 0, badRef);
check("Mọi khuyến cáo/phác đồ quốc tế có vị trí trích dẫn", I.INTL_ENTRIES.every((e) => [...e.recommendations, ...e.regimens].every((r) => r.locator && r.locator.trim().length >= 2)));
check("Guideline 'identified' (chưa trích) không có phác đồ liều", I.INTL_ENTRIES.every((e) => e.regimens.every((r) => I.INTL_GUIDELINES[r.guidelineId].status !== "identified")));
check("Viêm túi lệ: ghi rõ không có guideline quốc tế lớn (không gán nguồn khu vực)", I.getIntlEntry("v8-88").guidelineIds.length === 0 && (I.getIntlEntry("v8-88").gaps ?? []).length > 0);

/* ---------- 5. Route cu dung chung Safety Gate ---------- */
const LEGACY = ["cdss-v11", "cdss-v12", "cdss-v13", "clinical", "decision", "decision-center", "unified-v10", "empiric", "page.backup.txt"];
const notGated = LEGACY.filter((r) => {
  const f = path.join(ROOT, "app", "antibiotics", "empiric", r, "layout.tsx");
  return !fs.existsSync(f) || !/redirect\("\/antibiotics\/empiric\/guideline-v9"\)/.test(fs.readFileSync(f, "utf8"));
});
check(`${LEGACY.length} route cũ có liều riêng đều chuyển hướng về module chính (Safety Gate)`, notGated.length === 0, notGated);
check("Dữ liệu route cũ không bị xóa (page.tsx còn nguyên)", LEGACY.every((r) => fs.existsSync(path.join(ROOT, "app", "antibiotics", "empiric", r, "page.tsx"))));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
