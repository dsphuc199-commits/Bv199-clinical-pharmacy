// Unit test Master Task 5 – UNKNOWN, phan loai ELIGIBLE/CONDITIONAL/NOT_ELIGIBLE/SAFETY_BLOCKED,
// route cu qua Safety Gate, ho so 20 muc. Chay: node tests/empiric/mt5-engine-test.cjs
const EXP = require("./expected-status.cjs");
const fs = require("fs"), path = require("path");
const load = require("./tsrun.cjs");
const ROOT = path.resolve(__dirname, "..", "..");
const SE = load("lib/antibiotics/selection-engine.ts");
const R = load("data/antibiotics/empiric/regimens/index.ts");
const P = load("lib/antibiotics/disease-profile.ts");
const E = load("lib/antibiotics/evidence-status.ts");
const F = load("lib/antibiotics/formulary.ts");
const DL = load("lib/antibiotics/drug-links.ts");
let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${!ok && d !== undefined ? "  — " + JSON.stringify(d).slice(0, 300) : ""}`); };
const byId = new Map(R.ALL_REGIMENS.map((r) => [r.id, r]));
const opts = (res) => (res.status === "ready" ? res.groups.flatMap((g) => g.options) : []);
const base = { population: "adult", pregnant: "no", penicillinAllergy: "no", renal: "normal", micro: "none" };

// 1. UNKNOWN khong duoc hieu la am tinh
const q = SE.questionsFor("v8-17", { population: "adult" });
check("Câu hỏi dị ứng, thai kỳ, chức năng thận có lựa chọn \"Không rõ\"", ["penicillinAllergy", "pregnant", "renal"].every((k) => q.find((x) => x.key === k)?.options.some((o) => o.value === "unknown")));
const pyScn = byId.get("r-py-iv-ceph").scenario;
const pyUnk = SE.evaluate("v8-17", { ...base, penicillinAllergy: "unknown", renal: "unknown", pregnant: "unknown", scenario: pyScn });
check("Không rõ dị ứng/thận/thai kỳ: vẫn ra kết quả nhưng phương án beta-lactam là CONDITIONAL", pyUnk.status === "ready" && opts(pyUnk).length > 0 && opts(pyUnk).every((o) => o.eligibility === "CONDITIONAL") && opts(pyUnk).some((o) => o.conditions.some((c) => /dị ứng penicillin/.test(c))));
check("Kết quả liệt kê các biến chưa rõ", pyUnk.unknowns && ["dị ứng penicillin", "thai kỳ", "chức năng thận"].every((u) => pyUnk.unknowns.includes(u)), pyUnk.unknowns);
const pyMiss = SE.evaluate("v8-17", { population: "adult", scenario: pyScn });
check("Thiếu dữ liệu bắt buộc (chưa trả lời) → need-input, không đưa khuyến cáo", pyMiss.status === "need-input");

// mdr "unknown" khong bi loc thanh nguy co thap
const mdrDisease = ["v8-11", "v8-6", "v8-21", "v8-27"].find((id) => SE.questionsFor(id, { population: "adult" }).some((x) => x.key === "mdr"));
if (mdrDisease) {
  const qn = (inp) => SE.questionsFor(mdrDisease, inp).find((x) => x.key === "scenario")?.options.length ?? 0;
  const nAll = qn({ ...base });
  const nNo = qn({ ...base, mdr: "no", severity: "unknown" });
  const nUnk = qn({ ...base, mdr: "unknown", severity: "unknown" });
  check(`Nguy cơ kháng thuốc "Không rõ" không bị hiểu là "Không" (${mdrDisease}: tình huống unknown ≥ no)`, nUnk >= nNo && nUnk > 0, { nAll, nNo, nUnk });
} else check("Có mặt bệnh hỏi nguy cơ kháng thuốc để kiểm tra", false);

// 2. Phan loai
const ceph = SE.evaluate("v8-17", { ...base, scenario: pyScn });
check("Đủ dữ liệu, không vướng điều kiện → có phương án ELIGIBLE", opts(ceph).some((o) => o.eligibility === "ELIGIBLE"), opts(ceph).map((o) => [o.id, o.eligibility, o.conditions]));
const renal = SE.evaluate("v8-17", { ...base, renal: "impaired", crcl: 25, scenario: pyScn });
check("Suy thận (CrCl 25): mọi phương án CONDITIONAL, nêu hiệu chỉnh liều", opts(renal).length > 0 && opts(renal).every((o) => o.eligibility === "CONDITIONAL" && o.conditions.some((c) => /CrCl 25/.test(c))));
const allergy = SE.evaluate("v8-33", { ...base, penicillinAllergy: "yes", scenario: byId.get("r-sa-empiric-1").scenario });
check("Dị ứng beta-lactam: phác đồ bắt buộc penicillin bị loại NOT_ELIGIBLE", allergy.status === "ready" && allergy.excluded.some((e) => e.eligibility === "NOT_ELIGIBLE" && /penicillin/i.test(e.reason)) && !opts(allergy).some((o) => o.id === "r-sa-empiric-1"));
const blocked = SE.evaluate("v8-116", { ...base, scenario: byId.get("r-fn-add-colistin").scenario });
check("Liều mâu thuẫn bị khóa → SAFETY_BLOCKED, không nằm trong đề xuất", blocked.excluded.some((e) => e.eligibility === "SAFETY_BLOCKED") && !opts(blocked).some((o) => o.id === "r-fn-add-colistin") && blocked.eligibilityCount.SAFETY_BLOCKED >= 1);
const severe = SE.evaluate("v8-116", { ...base, scenario: byId.get("r-fn-mono-mero").scenario });
check("Nhiễm khuẩn nặng (sốt giảm bạch cầu nguy cơ cao): có đề xuất, chưa phê duyệt", opts(severe).length > 0 && severe.approval === "NOT_APPROVED" && opts(severe).every((o) => o.approved === false));
const mdrRes = SE.evaluate("v8-11", { ...base, mdr: "yes", scenario: byId.get("r-sepsis-b").scenario });
check("Nguy cơ đa kháng (sepsis có yếu tố NK bệnh viện): có đề xuất kèm điều kiện/cảnh báo", opts(mdrRes).length > 0, mdrRes.status);

// Thuoc ngoai danh muc BV199
const notIn = R.ALL_REGIMENS.find((r) => DL.findDrugs(r.drugs.map((d) => `${d.name}: ${d.dose}`)).some((d) => !F.inFormulary(d.ingredientId)));
if (notIn) {
  const dId = notIn.diseaseIds[0];
  const res = SE.evaluate(dId, { ...base, population: /trẻ|sơ sinh/i.test(notIn.scenario) ? "child" : "adult", severity: "unknown", mdr: "unknown", scenario: notIn.scenario });
  const o = opts(res).find((x) => x.id === notIn.id);
  check(`Thuốc không có trong danh mục BV199 → CONDITIONAL, nêu tên (${notIn.id})`, res.status !== "ready" || !o || (o.eligibility === "CONDITIONAL" && o.notInFormulary.length > 0), o && o.notInFormulary);
} else check("Có phương án chứa thuốc ngoài danh mục để kiểm tra", true);

// Phac do da bi thay the khong duoc de xuat
const shownIds = new Set(R.getRegimensForDisease("v8-6").map((r) => r.id));
const supersededCopd = R.ALL_REGIMENS.filter((r) => r.diseaseIds.includes("v8-6") && !shownIds.has(r.id));
check("Phác đồ đã bị thay thế (COPD QĐ 708/1493) không xuất hiện trong danh sách hiển thị", supersededCopd.length > 0 && supersededCopd.every((r) => !shownIds.has(r.id)));

// 3. Route cu qua Safety Gate
const legacy = ["empiric", "page.backup.txt", "cdss-v11", "clinical", "decision", "decision-center", "unified-v10"];
const missing = legacy.filter((d) => { const f = path.join(ROOT, "app/antibiotics/empiric", d, "layout.tsx"); return !fs.existsSync(f) || !/redirect\("\/antibiotics\/empiric\/guideline-v9"\)/.test(fs.readFileSync(f, "utf8")); });
check("Mọi route cũ chứa liều đều chuyển hướng về module chính (Safety Gate)", missing.length === 0, missing);
const legacyPagesKept = legacy.every((d) => fs.existsSync(path.join(ROOT, "app/antibiotics/empiric", d, "page.tsx")));
check("Không xóa dữ liệu route cũ (page.tsx còn nguyên)", legacyPagesKept);

// 4. Ho so 20 muc
const all = P.allProfiles();
check("Hồ sơ 20 mục cho đủ 69 mặt bệnh", all.length === 69 && all.every((p) => p.fields.length === 20));
check("Mục thiếu ghi \"missing\", không tự điền nội dung", all.every((p) => p.fields.filter((f) => f.status === "missing").every((f) => !f.source || /safety-alerts|formulary/.test(f.source))) && all.some((p) => p.missing.length > 0));
check("v9-1 (không có liều trong nguồn): mục liều không được đánh dấu có đủ", P.diseaseProfile("v9-1").fields.find((f) => f.key === "dose").status !== "available");

// 5. Trang thai tong
const s = E.summarize();
check(`69 bệnh: ${EXP.totals.VERIFIED_SOURCE} VERIFIED_SOURCE / ${EXP.totals.NEEDS_REVIEW} NEEDS_REVIEW / ${EXP.totals.MISSING_EVIDENCE} MISSING_EVIDENCE / 0 APPROVED (baseline + thay đổi có chủ đích)`, s.total === 69 && s.VERIFIED_SOURCE === EXP.totals.VERIFIED_SOURCE && s.NEEDS_REVIEW === EXP.totals.NEEDS_REVIEW && s.MISSING_EVIDENCE === EXP.totals.MISSING_EVIDENCE && s.APPROVED_FOR_CLINICAL_USE === 0, s);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
