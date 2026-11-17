// Kiem thu module Nhiem khuan tai mui hong: du lieu, bang quyet dinh, bien, gioi han lieu, ca chuan.
// Chay: npm run test:ent
const fs = require("fs"), path = require("path");
const load = require("../empiric/tsrun.cjs");
const ROOT = path.resolve(__dirname, "..", "..");
const { DISEASES, SOURCES, getDisease, resolveDisease } = load("data/ent/index.ts");
const { validateDisease, QUOTE_MAX_WORDS } = load("lib/ent/validate.ts");
const { decide, perDoseUpper, computeDose } = load("lib/ent/decide.ts");
let pass = 0, fail = 0;
function check(n, ok, info) { if (ok) pass++; else fail++; console.log(`${ok ? "PASS" : "FAIL"} ${n}${!ok && info ? " – " + info : ""}`); }
const reg = new Set(SOURCES.map((s) => s.id));
const IDS = ["pta", "rpa", "dni", "gas-pharyngitis", "strep-pharyngitis", "aom-adult", "aom-peds", "abrs-peds", "abrs-adult"];
const NO_PRIMARY = ["pta", "rpa", "dni", "aom-adult"];

// ---------- Du lieu ----------
const errs = DISEASES.flatMap((d) => validateDisease(d, SOURCES));
check("validateDisease: 0 lỗi trên 9 bệnh", errs.length === 0, errs.slice(0, 5).join("; "));
check("Đủ 9 bệnh trong dữ liệu", IDS.every((id) => !!getDisease(id)) && DISEASES.length === 9);
check("Đủ 9 trang bệnh app/ent/<id>/page.tsx", IDS.every((id) => fs.existsSync(path.join(ROOT, "app/ent", id, "page.tsx"))));
const allRecs = DISEASES.flatMap((d) => [...d.redFlags, ...d.statements, ...d.doses]);
check("Mọi Statement/Dose có citation với sourceId trong registry", allRecs.every((r) => r.citation && reg.has(r.citation.sourceId) && r.citation.locator));
check("Không có Dose nào không dẫn nguồn", DISEASES.flatMap((d) => d.doses).every((x) => x.citation && x.citation.sourceId && x.citation.locator));
check(`Trích dẫn ≤ ${QUOTE_MAX_WORDS} từ`, allRecs.every((r) => !r.citation.quote || r.citation.quote.trim().split(/\s+/).length <= QUOTE_MAX_WORDS));
check("Không có trạng thái REVIEWED", !JSON.stringify(DISEASES).includes("REVIEWED"));
const tierOf = (id) => SOURCES.find((s) => s.id === id).tier;
check("Không nguồn REF nào ở vai trò chính", DISEASES.every((d) => d.primarySources.every((id) => tierOf(id) !== "REF")));
check("IDSA-2025 chỉ ở vai trò chẩn đoán", DISEASES.every((d) => !d.primarySources.includes("IDSA-2025-GAS-part1") && !d.comparisonSources.includes("IDSA-2025-GAS-part1")) && allRecs.filter((r) => r.citation.sourceId === "IDSA-2025-GAS-part1").every((r) => r.role === "diagnosis"));
check("Nội dung UCSF chỉ là ghi chú tham khảo", DISEASES.every((d) => [...d.redFlags, ...d.statements].filter((s) => tierOf(s.citation.sourceId) === "REF").every((s) => s.kind === "reference_note" && s.role === "reference")));
check("Nguồn chưa truy cập được không có bản ghi EXTRACTED", allRecs.filter((r) => ["not_downloaded", "paywalled"].includes(SOURCES.find((s) => s.id === r.citation.sourceId).access)).every((r) => r.status === "NOT_VERIFIED"));

// ---------- Kiem thu am tinh: validator bat duoc du lieu sai ----------
const clone = (o) => JSON.parse(JSON.stringify(o));
const bad1 = clone(getDisease("aom-peds")); bad1.primarySources.push("UCSF-peds-resp-head-neck");
check("Âm tính: validator bắt nguồn REF ở vai trò chính", validateDisease(bad1, SOURCES).some((e) => e.includes("REF")));
const bad2 = clone(getDisease("aom-peds")); delete bad2.doses[0].citation;
check("Âm tính: validator bắt Dose thiếu citation", validateDisease(bad2, SOURCES).some((e) => e.includes("thiếu citation")));
const bad3 = clone(getDisease("aom-peds")); bad3.statements[0].citation.quote = "một hai ba bốn năm sáu bảy tám chín mười mười một mười hai mười ba";
check("Âm tính: validator bắt trích dẫn > 15 từ", validateDisease(bad3, SOURCES).some((e) => e.includes("trích dẫn")));
const bad4 = clone(getDisease("pta")); bad4.doses.push(clone(getDisease("aom-peds").doses[0]));
check("Âm tính: validator bắt bệnh không nguồn chính có Dose", validateDisease(bad4, SOURCES).some((e) => e.includes("có Dose")));
const bad5 = clone(getDisease("gas-pharyngitis")); bad5.primarySources.push("IDSA-2025-GAS-part1");
check("Âm tính: validator bắt IDSA-2025 ở vai trò chính", validateDisease(bad5, SOURCES).some((e) => e.includes("IDSA-2025")));
const bad6 = clone(getDisease("aom-peds")); bad6.statements[0].status = "REVIEWED";
check("Âm tính: validator bắt status REVIEWED", validateDisease(bad6, SOURCES).some((e) => e.includes("REVIEWED")));
const bad7 = clone(getDisease("aom-peds")); bad7.doses[0].status = "NOT_VERIFIED";
check("Âm tính: Dose NOT_VERIFIED không vào lựa chọn đầu tay", (() => { const r = decide(bad7, { ageMonths: 12, laterality: "bilateral", allergy: "none" }); return r.first.length === 0 && r.unverified.some((x) => x.id === "aom-amox"); })());

// ---------- Benh khong nguon chinh ----------
for (const id of NO_PRIMARY) {
  const d = getDisease(id);
  const r = decide(d, {});
  check(`${id}: có evidenceGap, không có Dose, thẻ nhanh không xuất lựa chọn đầu tay`, d.evidenceGap.length > 0 && d.doses.every((x) => x.role === "reference") && r.first.length === 0 && r.alternatives.length === 0 && r.decision && r.decision.value === "no_primary");
}
check("aom-adult: evidenceGap ghi NICE NG91 chỉ < 18 tuổi, không ngoại suy", getDisease("aom-adult").evidenceGap.some((g) => g.includes("NICE NG91 chỉ áp dụng cho trẻ em và thanh thiếu niên < 18 tuổi; không ngoại suy")));
check("rpa: cờ đỏ đường thở ở đầu", getDisease("rpa").redFlags[0].text.startsWith("Tắc nghẽn đường thở"));
check("abrs-adult: nguồn chính AAO-HNSF 2025 đã trích xuất – không còn bản ghi NOT_VERIFIED, không evidenceGap", (() => { const d = getDisease("abrs-adult"); return d.primarySources[0] === "AAOHNSF-2025" && !(d.evidenceGap ?? []).length && [...d.statements, ...d.doses, ...d.redFlags].every((x) => x.status === "EXTRACTED"); })());
check("abrs-adult: KAS 6 ghi rõ mức khuyến cáo không thống nhất trong nguồn (Recommendation / Option)", (() => { const s = getDisease("abrs-adult").statements.find((x) => x.id === "abrsa-aao-kas6"); return s.strength === "Recommendation" && /Policy level: Option/.test(s.note); })());
check("strep-pharyngitis tham chiếu chéo gas-pharyngitis, không nhân đôi dữ liệu", (() => { const r = resolveDisease("strep-pharyngitis"); return r.data.id === "gas-pharyngitis" && r.page.doses.length === 0 && r.page.scopeNote.includes("Chỉ áp dụng khi xác định là liên cầu nhóm A"); })());

// ---------- Bang quyet dinh: phu moi nhanh ----------
function grid(spec) { return spec.reduce((acc, [k, vals]) => acc.flatMap((o) => vals.map((v) => ({ ...o, [k]: v }))), [{}]); }
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
function coverage(id, spec) {
  const d = getDisease(id);
  const hit = new Set(); let allCited = true, allOk = true;
  for (const inp of grid(spec)) {
    const r = decide(d, clean(inp));
    if (!r.ok) { allOk = false; continue; }
    if (r.decision) hit.add(r.decision.ruleId);
    for (const x of [...r.first, ...r.alternatives, ...r.failure, ...r.other, ...r.comparison]) if (!x.citation || !reg.has(x.citation.sourceId)) allCited = false;
    if (r.decision && !reg.has(r.decision.citation.sourceId)) allCited = false;
  }
  const missing = d.rules.map((x) => x.id).filter((x) => !hit.has(x));
  check(`${id}: phủ mọi nhánh của bảng quyết định`, missing.length === 0, "chưa phủ " + missing.join(", "));
  check(`${id}: mọi kết quả decide có citation`, allCited && allOk);
}
coverage("aom-peds", [["ageMonths", [6, 23, 24, 144]], ["weightKg", [undefined, 12]], ["laterality", ["unilateral", "bilateral"]], ["otorrhea", [undefined, true]], ["severe", [undefined, true]], ["allergy", ["none", "nonsevere", "severe"]], ["amoxRecent", [undefined, true]], ["failure", [undefined, true]]]);
coverage("abrs-peds", [["ageYears", [1, 1.9, 2, 18]], ["weightKg", [undefined, 20]], ["presentation", ["persistent", "worsening", "severe"]], ["riskResistance", [undefined, true]], ["highNonsusceptible", [undefined, true]], ["allergy", ["none", "nonsevere", "severe"]], ["initialTx", [undefined, "observation", "amoxicillin", "amoxclav"]]]);
coverage("gas-pharyngitis", [["ageGroup", ["lt3", "child", "adolescent", "adult"]], ["weightKg", [undefined, 26.9, 27, 70]], ["viralFeatures", [undefined, true]], ["testResult", ["not_tested", "positive", "negative"]], ["allergy", ["none", "nonsevere", "severe"]]]);
coverage("abrs-adult", [["criteria", [undefined, "met", "not_met"]], ["complicated", [undefined, true]], ["severe", [undefined, true]], ["wwException", [undefined, true]], ["failure", [undefined, true]], ["allergy", ["none", "nonsevere", "severe"]], ["amoxClavRisk", [undefined, true]], ["pnsRisk", [undefined, true]]]);

// ---------- Bien ----------
const aom = getDisease("aom-peds");
const ruleOf = (d, inp) => decide(d, inp).decision?.ruleId;
check("Biên tuổi 23/24 tháng – một bên không nặng: KAS 3C rồi KAS 3D", ruleOf(aom, { ageMonths: 23, laterality: "unilateral" }) === "aom-r-young-unilateral" && ruleOf(aom, { ageMonths: 24, laterality: "unilateral" }) === "aom-r-older");
check("Biên tuổi 23/24 tháng – hai bên: kháng sinh rồi kháng sinh hoặc theo dõi", decide(aom, { ageMonths: 23, laterality: "bilateral" }).decision.value === "antibiotic" && decide(aom, { ageMonths: 24, laterality: "bilateral" }).decision.value === "antibiotic_or_observe");
const gas = getDisease("gas-pharyngitis");
const bpg = (w) => decide(gas, { testResult: "positive", ageGroup: "child", weightKg: w, allergy: "none" }).first.filter((x) => x.drug.startsWith("Benzathine")).map((x) => x.id);
check("Biên cân nặng 27 kg – benzathine penicillin G: < 27 kg 600 000 U; ≥ 27 kg 1 200 000 U", JSON.stringify(bpg(26.9)) === '["gas-bpg-lt27"]' && JSON.stringify(bpg(27)) === '["gas-bpg-ge27"]');
const abrsp = getDisease("abrs-peds");
const std = (age) => decide(abrsp, { presentation: "severe", ageYears: age, allergy: "none" }).first.some((x) => x.id === "abrsp-amox-std");
check("Biên tuổi 2 – viêm xoang trẻ em: amoxicillin liều chuẩn chỉ từ 2 tuổi", !std(1.9) && std(2));

// ---------- Lieu mg/kg khong vuot muc toi da cua nguon ----------
let capOk = true; const capFail = [];
for (const d of DISEASES) for (const x of d.doses) if (x.weight && (x.weight.maxPerDoseMg || x.weight.maxPerDayMg)) for (let w = 1; w <= 200; w += 0.5) for (const n of x.weight.dosesPerDay) {
  const hi = perDoseUpper(x, w, n);
  if ((x.weight.maxPerDoseMg && hi > x.weight.maxPerDoseMg + 1e-9) || (x.weight.maxPerDayMg && hi * n > x.weight.maxPerDayMg + 1e-9)) { capOk = false; capFail.push(`${x.id}@${w}`); }
}
check("Liều tính theo mg/kg không vượt mức tối đa của nguồn (1–200 kg)", capOk, capFail.slice(0, 3).join(", "));
check("Ví dụ: amoxicillin 50 mg/kg ở 30 kg bị giới hạn 1000 mg", computeDose(gas.doses.find((x) => x.id === "gas-amox-qd"), 30).text.startsWith("30 kg: 1000 mg/lần") && computeDose(gas.doses.find((x) => x.id === "gas-amox-qd"), 30).capped);
check("Ví dụ: amoxicillin 80–90 mg/kg/ngày chia 2 ở 15 kg = 600–675 mg/lần (nguồn không nêu tối đa)", computeDose(aom.doses.find((x) => x.id === "aom-amox"), 15).text === "15 kg: 600–675 mg/lần × 2 lần/ngày");

// ---------- Dau vao ngoai khoang bi tu choi ----------
const rej = (d, inp) => !decide(d, inp).ok;
check("Từ chối tuổi ngoài phạm vi AAP (5 tháng, 145 tháng)", rej(aom, { ageMonths: 5 }) && rej(aom, { ageMonths: 145 }));
check("Từ chối cân nặng âm, lựa chọn lạ, trường lạ", rej(aom, { weightKg: -1 }) && rej(aom, { laterality: "x" }) && rej(aom, { foo: 1 }) && rej(abrsp, { ageYears: 0.5 }));

// ---------- Ca chuan (golden case) – doi chieu noi dung nguon ----------
const ids = (r, k) => r[k].map((x) => x.id).sort().join(",");
const golden = [
  ["aom-peds", "12 tháng, hai bên, không nặng, không dị ứng → kháng sinh; amoxicillin 80–90 mg/kg/ngày chia 2 (KAS 3B tr. e965; Bảng 5 tr. e983)", { ageMonths: 12, laterality: "bilateral", allergy: "none" }, (r) => r.decision.value === "antibiotic" && ids(r, "first") === "aom-amox"],
  ["aom-peds", "18 tháng, một bên, không nặng → kháng sinh hoặc theo dõi (KAS 3C tr. e965)", { ageMonths: 18, laterality: "unilateral" }, (r) => r.decision.value === "antibiotic_or_observe" && r.decision.ruleId === "aom-r-young-unilateral"],
  ["aom-peds", "30 tháng, một bên, không nặng → kháng sinh hoặc theo dõi (KAS 3D tr. e965)", { ageMonths: 30, laterality: "unilateral" }, (r) => r.decision.value === "antibiotic_or_observe" && r.decision.ruleId === "aom-r-older"],
  ["aom-peds", "Đã dùng amoxicillin 30 ngày → amoxicillin-clavulanate 90/6,4 mg/kg/ngày (KAS 4B tr. e965; Bảng 5 chú thích a)", { ageMonths: 36, laterality: "bilateral", severe: true, amoxRecent: true, allergy: "none" }, (r) => ids(r, "first") === "aom-amoxclav"],
  ["aom-peds", "Dị ứng không nặng → cefdinir, cefuroxime, cefpodoxime, ceftriaxone (Bảng 5 tr. e983; tr. e984)", { ageMonths: 36, laterality: "bilateral", severe: true, allergy: "nonsevere" }, (r) => r.first.length === 0 && ids(r, "alternatives") === "aom-cefdinir,aom-cefpodoxime,aom-ceftriaxone-allergy,aom-cefuroxime"],
  ["aom-peds", "Dị ứng nặng → không có cephalosporin (AAP chỉ khuyến cáo khi không có phản ứng nặng, tr. e984)", { ageMonths: 36, laterality: "bilateral", severe: true, allergy: "severe" }, (r) => r.first.length === 0 && r.alternatives.length === 0],
  ["aom-peds", "Thất bại 48–72 giờ → amoxicillin-clavulanate, ceftriaxone 3 ngày; thay thế clindamycin (Bảng 5 tr. e983)", { ageMonths: 36, laterality: "bilateral", failure: true }, (r) => ids(r, "failure") === "aom-fail-amoxclav,aom-fail-ceftriaxone,aom-fail-clinda"],
  ["abrs-peds", "Khởi phát nặng → kháng sinh (KAS 3A tr. e267)", { presentation: "severe", ageYears: 5, allergy: "none" }, (r) => r.decision.value === "antibiotic" && ids(r, "first") === "abrsp-amox-std"],
  ["abrs-peds", "Kéo dài > 10 ngày → kháng sinh hoặc theo dõi 3 ngày (KAS 3B tr. e268)", { presentation: "persistent", ageYears: 5 }, (r) => r.decision.value === "antibiotic_or_observe"],
  ["abrs-peds", "< 2 tuổi/đi nhà trẻ → amoxicillin-clavulanate liều cao, tối đa 2 g/lần (tr. e271)", { presentation: "worsening", ageYears: 1.5, riskResistance: true, allergy: "none", weightKg: 30 }, (r) => ids(r, "first") === "abrsp-amoxclav-high" && r.computed.find((c) => c.doseId === "abrsp-amoxclav-high").text.startsWith("30 kg: 1200–1350 mg/lần")],
  ["abrs-peds", "Đang dùng amoxicillin-clavulanate liều cao, nặng lên 72 giờ → clindamycin + cefixime, linezolid + cefixime, hoặc levofloxacin (Bảng 4 tr. e276)", { initialTx: "amoxclav" }, (r) => ids(r, "failure") === "abrsp-fail-after-amoxclav"],
  ["gas-pharyngitis", "RADT dương tính, trẻ em, không dị ứng → penicillin V 250 mg 2–3 lần/ngày, amoxicillin, benzathine penicillin G (CDC; IDSA 2012 Bảng 2)", { testResult: "positive", ageGroup: "child", weightKg: 20, allergy: "none" }, (r) => r.decision.value === "antibiotic" && ids(r, "first") === "gas-amox-bid,gas-amox-qd,gas-bpg-lt27,gas-penv-child"],
  ["gas-pharyngitis", "Quá mẫn tức thì → không cefalexin/cefadroxil (IDSA 2012 Bảng 2 chú thích b; CDC)", { testResult: "positive", ageGroup: "adult", weightKg: 70, allergy: "severe" }, (r) => !r.alternatives.some((x) => /Cefalexin|Cefadroxil/.test(x.drug)) && r.alternatives.some((x) => x.drug === "Clindamycin")],
  ["gas-pharyngitis", "Biểu hiện virus rõ → không kháng sinh (CDC; IDSA 2012 khuyến cáo 1)", { viralFeatures: true, testResult: "not_tested", ageGroup: "adult" }, (r) => r.decision.value === "no_antibiotic"],
  ["gas-pharyngitis", "Trẻ em RADT âm tính → cấy họng xác nhận (IDSA 2012 khuyến cáo 1; CDC)", { testResult: "negative", ageGroup: "child" }, (r) => r.decision.value === "test_first"],
  ["gas-pharyngitis", "Người lớn RADT âm tính → không cần cấy lại thường quy, không kháng sinh (IDSA 2012 khuyến cáo 2)", { testResult: "negative", ageGroup: "adult" }, (r) => r.decision.value === "no_antibiotic"],
  ["gas-pharyngitis", "Azithromycin: hiển thị cả IDSA 2012 và CDC 2025 (mâu thuẫn)", { testResult: "positive", ageGroup: "adult", weightKg: 70, allergy: "nonsevere" }, (r) => r.alternatives.some((x) => x.id === "gas-azithro-idsa") && r.alternatives.some((x) => x.id === "gas-azithro-cdc") && r.conflicts.some((c) => c.id === "gas-c-azithro")],
  ["abrs-adult", "Đủ tiêu chuẩn, không biến chứng, khỏe mạnh → theo dõi chờ đợi hoặc kháng sinh; amoxicillin 500 mg × 3 hoặc 875 mg × 2 (KAS 4 tr. S16; tr. S20)", { criteria: "met", allergy: "none" }, (r) => r.decision.value === "antibiotic_or_observe" && ids(r, "first") === "abrsa-aao-amox"],
  ["abrs-adult", "Có yếu tố nguy cơ kháng amoxicillin → amoxicillin-clavulanate 500/125 × 3 hoặc 875/125 × 2 (tr. S20; Bảng 7 tr. S21)", { criteria: "met", amoxClavRisk: true }, (r) => ids(r, "first") === "abrsa-aao-amoxclav"],
  ["abrs-adult", "Nguy cơ phế cầu không nhạy penicillin → amoxicillin-clavulanate 2 g/125 mg × 2 (tr. S20)", { criteria: "met", amoxClavRisk: true, pnsRisk: true }, (r) => ids(r, "first") === "abrsa-aao-amoxclav-high"],
  ["abrs-adult", "Quá mẫn type 1 → doxycycline; fluoroquinolon chỉ khi không còn lựa chọn; không cephalosporin (tr. S21)", { criteria: "met", allergy: "severe" }, (r) => r.first.length === 0 && ids(r, "alternatives") === "abrsa-aao-doxy,abrsa-aao-levo,abrsa-aao-moxi"],
  ["abrs-adult", "Quá mẫn không type 1 → doxycycline hoặc cefixime/cefpodoxime ± clindamycin (tr. S21)", { criteria: "met", allergy: "nonsevere" }, (r) => ids(r, "alternatives") === "abrsa-aao-cefixime,abrsa-aao-cefpodoxime,abrsa-aao-doxy"],
  ["abrs-adult", "Thất bại sau 3–5 ngày → đánh giá lại, đổi kháng sinh: amoxicillin-clavulanate liều cao 4 g/ngày; fluoroquinolon nếu không có thuốc khác (KAS 6 tr. S21; tr. S23)", { failure: true }, (r) => r.decision.value === "reassess_switch" && ids(r, "failure") === "abrsa-aao-fail-amoxclav,abrsa-aao-fail-levo,abrsa-aao-fail-moxi"],
  ["abrs-adult", "Chưa đủ tiêu chuẩn (nghĩ do virus) → không kháng sinh (KAS 1a tr. S6; KAS 2 tr. S13)", { criteria: "not_met" }, (r) => r.decision.value === "no_antibiotic" && r.first.length === 0],
  ["abrs-adult", "Bệnh nặng (39 °C, mủ ≥ 3–4 ngày) → kháng sinh (tr. S18)", { severe: true }, (r) => r.decision.value === "antibiotic" && r.decision.ruleId === "abrsa-r-severe"],
  ["abrs-adult", "Nghi biến chứng lan ngoài xoang → kháng sinh ngay hoặc chuyển tai mũi họng, không xuất phác đồ ngoại trú (tr. S18)", { complicated: true, criteria: "met" }, (r) => r.decision.value === "antibiotic_or_refer" && r.first.length === 0 && r.alternatives.length === 0],
  ["abrs-adult", "Suy giảm miễn dịch → ngoại lệ theo dõi chờ đợi, kháng sinh (KAS 4 tr. S16)", { criteria: "met", wwException: true }, (r) => r.decision.value === "antibiotic" && r.decision.ruleId === "abrsa-r-exception"],
  ["abrs-adult", "Đối chiếu: NICE NG79 phenoxymethylpenicillin, IDSA 2012 amoxicillin-clavulanate hiển thị ở mục đối chiếu, có bảng bất đồng", { criteria: "met", allergy: "none" }, (r) => r.comparison.some((x) => x.id === "abrsa-nice-penv") && r.comparison.some((x) => x.id === "abrsa-idsa-amoxclav") && r.conflicts.some((c) => c.id === "abrsa-c-first")],
  ["aom-peds", "Đối chiếu NICE NG91: 12 tháng hai bên → amoxicillin theo tuổi ở mục đối chiếu và bất đồng AAP–NICE", { ageMonths: 12, laterality: "bilateral", allergy: "none" }, (r) => r.comparison.some((x) => x.id === "aom-nice-amox") && r.conflicts.some((c) => c.id === "aom-c-bilateral")],
  ["gas-pharyngitis", "Đối chiếu NICE NG84: người lớn → phenoxymethylpenicillin người lớn, không hiển thị liều trẻ em", { testResult: "positive", ageGroup: "adult", weightKg: 70, allergy: "none" }, (r) => r.comparison.some((x) => x.id === "gas-nice-penv-adult") && !r.comparison.some((x) => x.id === "gas-nice-penv-child")],
];
for (const [id, name, inp, ok] of golden) { const r = decide(getDisease(id), inp); check(`Ca chuẩn ${id}: ${name}`, r.ok && ok(r)); }
const perDisease = (id) => golden.filter((g) => g[0] === id).length;
check("Mỗi bệnh có nguồn chính đã xác minh có ≥ 3 ca chuẩn", ["aom-peds", "abrs-peds", "gas-pharyngitis", "abrs-adult"].every((id) => perDisease(id) >= 3));

// ---------- Lieu tham khao UCSF cho benh khong nguon chinh; anh xa Phac do kinh nghiem ----------
{
  const pta = getDisease("pta"); const refIds = (inp) => decide(pta, inp).reference.doses.map((x) => x.id).sort().join(",");
  const r1 = decide(pta, { ageGroup: "child", weightKg: 20, setting: "inpatient", mrsaChild: true, allergy: "none" });
  check("PTA trẻ 20 kg nội trú + tiêu chí MRSA → ampicillin-sulbactam 1000 mg × 4 + vancomycin; không vào lựa chọn đầu tay", refIds({ ageGroup: "child", weightKg: 20, setting: "inpatient", mrsaChild: true, allergy: "none" }) === "pta-ucsf-sam,pta-ucsf-vanco" && r1.first.length === 0 && r1.computed.find((c) => c.doseId === "pta-ucsf-sam").text.startsWith("20 kg: 1000 mg/lần × 4"));
  check("PTA trẻ ngoại trú → amoxicillin-clavulanate 45 mg/kg/lần, tối đa 1000 mg", refIds({ ageGroup: "child", setting: "outpatient", allergy: "none" }) === "pta-ucsf-amoxclav" && computeDose(pta.doses.find((x) => x.id === "pta-ucsf-amoxclav"), 40).text.startsWith("40 kg: 1000 mg/lần"));
  check("PTA trẻ dị ứng nguy cơ cao → clindamycin TM (tối đa 900 mg) hoặc uống (tối đa 600 mg), không beta-lactam", refIds({ ageGroup: "child", setting: "inpatient", allergy: "severe" }) === "pta-ucsf-clinda-iv,pta-ucsf-clinda-po" && computeDose(pta.doses.find((x) => x.id === "pta-ucsf-clinda-iv"), 100).text.startsWith("100 kg: 900 mg/lần"));
  check("PTA người lớn, không dị ứng → ampicillin-sulbactam 1,5–3 g mỗi 6 giờ (thuốc UCSF người lớn, liều nhãn FDA)", refIds({ ageGroup: "adult", allergy: "none" }) === "pta-adult-sam" && pta.doses.find((x) => x.id === "pta-adult-sam").citation.sourceId === "FDA-Unasyn");
  check("PTA người lớn, dị ứng beta-lactam nặng + nguy cơ MRSA → clindamycin + vancomycin (phối hợp), có liên kết TDM", (() => { const r = decide(pta, { ageGroup: "adult", allergy: "severe", mrsaAdult: true }); const QC = load("components/ent/QuickCard.tsx"); return r.reference.doses.map((x) => x.id).sort().join() === "pta-adult-clinda,pta-adult-vanco" && QC.regimenSummary(r.reference.doses) === "Phối hợp: Clindamycin tĩnh mạch + Vancomycin tĩnh mạch" && r.reference.doses.find((x) => x.addOn).link.href === "/tdm/vancomycin"; })());
  check("Ẩn trường không áp dụng: người lớn không hỏi cân nặng/nơi điều trị; giá trị ẩn không được dùng", (() => { const QC = load("components/ent/QuickCard.tsx"); const v = QC.visibleInputs(pta, { ageGroup: "adult", weightKg: 20, setting: "inpatient", mrsaChild: true }); return !v.shown.some((s) => ["weightKg", "setting", "mrsaChild"].includes(s.field)) && v.eff.weightKg === undefined && v.eff.mrsaChild === undefined && v.shown.some((s) => s.field === "mrsaAdult"); })());
  check("Tóm tắt phác đồ trẻ em: đơn trị ampicillin-sulbactam; dị ứng: chọn 1 clindamycin tĩnh mạch hoặc uống", (() => { const QC = load("components/ent/QuickCard.tsx"); return QC.regimenSummary(decide(pta, { ageGroup: "child", setting: "inpatient", allergy: "none" }).reference.doses) === "Đơn trị: Ampicillin-sulbactam tĩnh mạch" && QC.regimenSummary(decide(pta, { ageGroup: "child", allergy: "severe" }).reference.doses) === "Chọn 1: Clindamycin tĩnh mạch hoặc Clindamycin uống"; })());
  check("Nhiễm khuẩn khoang cổ sâu người lớn → ampicillin-sulbactam; dị ứng → clindamycin (nhãn FDA)", decide(getDisease("dni"), { allergy: "none" }).reference.doses.map((x) => x.id).join() === "dni-adult-sam" && decide(getDisease("dni"), { allergy: "severe" }).reference.doses.map((x) => x.id).join() === "dni-adult-clinda");
  check("RPA dùng cùng phác đồ UCSF nhi khoa", decide(getDisease("rpa"), { ageGroup: "child", setting: "outpatient", allergy: "none" }).reference.doses.map((x) => x.id).join() === "rpa-ucsf-amoxclav");
  const { ENT_EMPIRIC_MAP } = load("data/ent/index.ts");
  check("Phác đồ kinh nghiệm: 9 mặt bệnh Tai Mũi Họng (v8-7, 8, 54, 56, 57, 58, 60, 66, 99) ánh xạ tới trang ENT có thật", ["v8-7", "v8-8", "v8-54", "v8-56", "v8-57", "v8-58", "v8-60", "v8-66", "v8-99"].every((k) => (ENT_EMPIRIC_MAP[k] || []).length && ENT_EMPIRIC_MAP[k].every((o) => getDisease(o.id))));
}

// ---------- Doi chieu nguon (buoc 5) ----------
if (fs.existsSync(path.join(ROOT, "guidelines"))) {
  const { rows } = require("./verify-sources.cjs");
  check("Đối chiếu nguồn: không còn mục LỆCH hoặc KHÔNG TÌM THẤY", rows.every((r) => r.res.startsWith("KHỚP") || r.res.startsWith("NOT_VERIFIED")));
} else console.log("SKIP đối chiếu nguồn: không có thư mục ./guidelines (không commit)");

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
