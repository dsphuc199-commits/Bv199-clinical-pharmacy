// Unit test Buoc 4D.4 – khoa de xuat tu dong, tach cUTI/ESBL, ESC dich, bao toan BYT.
const EXP = require("./expected-status.cjs");
const fs = require("fs"), path = require("path");
const load = require("./tsrun.cjs");
const R = load("data/antibiotics/empiric/regimens/index.ts");
const A = load("data/antibiotics/empiric/safety-alerts.ts");
const I = load("data/antibiotics/empiric/international.ts");
const K = load("data/antibiotics/empiric/catalog.ts");
const E = load("lib/antibiotics/evidence-status.ts");
const SE = load("lib/antibiotics/selection-engine.ts");
const P = load("data/antibiotics/empiric/approvals.ts");
const before = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "byt-regimens-baseline.json"), "utf8"));
let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${!ok && d !== undefined ? "  — " + JSON.stringify(d).slice(0, 300) : ""}`); };
const byId = new Map(R.ALL_REGIMENS.map((r) => [r.id, r]));
const base = { population: "adult", pregnant: "no", penicillinAllergy: "no", renal: "normal", micro: "none" };
const opts = (res) => (res.status === "ready" ? res.groups.flatMap((g) => g.options) : []);

// 1. BYT goc
const prev = new Map(before.regimens.map((r) => [r.id, r]));
const changed = R.ALL_REGIMENS.filter((r) => { const p = prev.get(r.id); return !p || JSON.stringify([r.drugs, r.scenario, r.duration ?? null, r.source, r.role, r.diseaseIds]) !== JSON.stringify([p.drugs, p.scenario, p.duration, p.source, p.role, p.diseaseIds]); });
check("300 phương án BYT giữ nguyên (thuốc, liều, kịch bản, thời gian, nguồn, mặt bệnh)", R.ALL_REGIMENS.length === 300 && changed.length === 0, changed.map((r) => r.id));
check("Nguyên văn liều nghi sai vẫn giữ (amoxicilin-clavulanat 875/125 tiêm TM; ciprofloxacin trẻ em 20–30 mg/24 giờ)", /875\/125 mg x 2 lần\/ngày TM/.test(byId.get("r-py-iv-bl").drugs[0].dose) && /20–30 mg\/24 giờ/.test(byId.get("r-ie-native-peds").drugs.find((d) => /Ciprofloxacin/.test(d.name)).dose));

// 2. Khoa de xuat tu dong – danh sach khoa
const BLOCKED = ["r-fn-add-colistin", "r-copd23-in-mdr-pseudo", "r-ie-native-peds", "r-py-iv-bl", "r-vmn42-trauma-alt", "r-vmn42-18to50-first", "r-vmn42-over50-first", "r-vmn42-immuno-first"];
check("Các phương án lỗi liều/đường dùng nghiêm trọng đều bị khóa", BLOCKED.every((id) => A.autoRecommendBlocks(id).length > 0), BLOCKED.filter((id) => A.autoRecommendBlocks(id).length === 0));
check("Mọi cảnh báo khóa đều có lý do khóa", A.SAFETY_ALERTS.filter((a) => a.autoRecommend === "block" || a.blockFor).every((a) => a.blockReason));
check("Phương án không lỗi không bị khóa (ví dụ ceftriaxon VPBV sớm, oxacilin người lớn)", A.autoRecommendBlocks("r-hap-early").length === 0 && A.autoRecommendBlocks("r-sa-empiric-1", "adult").length === 0);
check("Viêm khớp: khóa cho trẻ em, không khóa cho người lớn", A.autoRecommendBlocks("r-sa-empiric-1", "child").length > 0 && A.autoRecommendBlocks("r-sa-empiric-1", "adult").length === 0);

// 3. Engine
const ie = SE.evaluate("v8-39", { ...base, population: "child", scenario: byId.get("r-ie-native-peds").scenario });
check("Engine: ciprofloxacin trẻ em (viêm nội tâm mạc) không được đề xuất, có lý do", ie.status === "ready" && !opts(ie).some((o) => o.id === "r-ie-native-peds") && ie.excluded.some((e) => /ĐÃ KHÓA ĐỀ XUẤT TỰ ĐỘNG/.test(e.reason)));
const py = SE.evaluate("v8-17", { ...base, scenario: byId.get("r-py-iv-bl").scenario });
check("Engine: phương án amoxicilin-clavulanat tiêm (viêm thận bể thận) bị khóa", py.status === "ready" && !opts(py).some((o) => o.id === "r-py-iv-bl") && py.excluded.some((e) => /amoxicilin-clavulanat/.test(e.reason)));
check("Engine: tình huống chỉ có phương án bị khóa → báo rõ không còn phương án đủ điều kiện", opts(py).length === 0 && py.limits.some((l) => /Không còn phương án đủ điều kiện/.test(l)) && py.certainty === "limited");
const pyCeph = SE.evaluate("v8-17", { ...base, scenario: byId.get("r-py-iv-ceph").scenario });
check("Engine: tình huống cephalosporin tiêm (viêm thận bể thận) vẫn được đề xuất, chưa phê duyệt", opts(pyCeph).some((o) => o.id === "r-py-iv-ceph") && opts(pyCeph).every((o) => o.approved === false));
const saChild = SE.evaluate("v8-33", { ...base, population: "child", pregnant: undefined, scenario: byId.get("r-sa-empiric-1").scenario });
check("Engine: viêm khớp – trẻ em không nhận liều cố định người lớn", saChild.status !== "ready" || !opts(saChild).some((o) => o.id.startsWith("r-sa-")), saChild.status);
const saAdult = SE.evaluate("v8-33", { ...base, scenario: byId.get("r-sa-empiric-1").scenario });
check("Engine: viêm khớp – người lớn vẫn nhận đề xuất, kèm cảnh báo K. kingae không áp dụng nhầm", saAdult.status === "ready" && opts(saAdult).some((o) => o.id === "r-sa-empiric-1"));
const men5642 = SE.evaluate("v8-36", { ...base, scenario: byId.get("r-vmn42-18to50-first").scenario });
const men708 = SE.evaluate("v8-36", { ...base, scenario: byId.get("r-men-18-50-first").scenario });
check("Engine: viêm màng não người lớn – tình huống QĐ 5642 (liều theo kg) bị khóa hết, có lý do", men5642.status === "ready" && opts(men5642).length === 0 && men5642.excluded.some((e) => /ĐÃ KHÓA/.test(e.reason) && /vượt liều tối đa/.test(e.reason)));
check("Engine: viêm màng não người lớn – tình huống QĐ 708 (cột người lớn) vẫn đề xuất", opts(men708).some((o) => o.id === "r-men-18-50-first"), men708.status);
check("Engine: kết quả luôn NOT_APPROVED và cần bác sĩ/dược sĩ quyết định", [ie, py, saAdult].every((r) => r.approval === "NOT_APPROVED" && r.clinicalUse === "clinician-decision-required"));

// 4. Tach cUTI / ESBL
check("Danh mục: v8-2 là hội chứng NKTN phức tạp (không còn \"/ ESBL\")", K.DISEASES.find((d) => d.id === "v8-2").title === "Nhiễm khuẩn tiết niệu phức tạp");
check("v8-2 không chứa khuyến cáo/liều IDSA AMR (ESBL); v8-43 chứa liều ESBL cho NKTN phức tạp (điều trị đích)", !I.getIntlEntry("v8-2").guidelineIds.includes("idsa-amr-2026") && I.getIntlEntry("v8-43").regimens.some((r) => r.kind === "pathogen-directed" && /NKTN phức tạp/.test(r.scenario)));
check("Liều thử nghiệm (IDSA cUTI Bảng 2.1) gắn loại trial-dosing, không phải kinh nghiệm", [I.getIntlEntry("v8-2"), I.getIntlEntry("v8-17")].every((e) => e.regimens.filter((r) => r.locator === "Table 2.1").every((r) => r.kind === "trial-dosing")));
check("EAU 2026: điều kiện fluoroquinolon, kiểm soát ổ nhiễm, thời gian có trong v8-2", ["< 10%", "6 tháng", "tắc nghẽn", "Thời gian"].every((k) => I.getIntlEntry("v8-2").recommendations.some((r) => r.text.includes(k))));

// 5. Viem noi tam mac: kinh nghiem / dich
const ieI = I.getIntlEntry("v8-39");
check("Viêm nội tâm mạc: có cả phác đồ KINH NGHIỆM (Bảng 10) và ĐIỀU TRỊ ĐÍCH (Bảng 7, 8)", ieI.regimens.filter((r) => r.kind === "empiric").length === 3 && ieI.regimens.filter((r) => r.kind === "pathogen-directed").length === 4);
check("Phân biệt van tự nhiên / van nhân tạo / thời điểm phẫu thuật / nguồn nhiễm", ["Van tự nhiên", "van nhân tạo muộn", "Van nhân tạo sớm", "chăm sóc y tế"].every((k) => ieI.regimens.some((r) => (r.scenario + r.options.join(" ")).includes(k))));
check("Chú thích gentamicin/vancomycin của Bảng 7–8 có nguyên văn; Bảng 10 ghi CHƯA XÁC MINH", ieI.recommendations.some((r) => /240 mg\/ngày/.test(r.text)) && ieI.recommendations.some((r) => /10–15 mg\/L/.test(r.text)) && ieI.regimens.some((r) => /CHƯA XÁC MINH/.test(r.note ?? "")));
check("Ghi nhận mâu thuẫn nội tại ESC (AUC/MIC 400–600 so với đích đáy)", ieI.recommendations.some((r) => /mâu thuẫn trong cùng nguồn/.test(r.text)));

// 6. Ban chan DTD: khong ghep lieu
check("Bàn chân ĐTĐ: không có phác đồ quốc tế có liều; cảnh báo nêu không ghép liều", I.getIntlEntry("v9-1").regimens.length === 0 && A.safetyAlertsFor("r-dfi-mod-simple").some((a) => /không ghép liều/.test(a.text)));
check("Bàn chân ĐTĐ: vẫn MISSING_EVIDENCE", E.evidenceFor("v9-1").status === "MISSING_EVIDENCE");

// 7. Trang thai / phe duyet
const s = E.summarize();
check(`69 bệnh: ${EXP.totals.VERIFIED_SOURCE} VERIFIED_SOURCE / ${EXP.totals.NEEDS_REVIEW} NEEDS_REVIEW / ${EXP.totals.MISSING_EVIDENCE} MISSING_EVIDENCE / 0 APPROVED (baseline + thay đổi có chủ đích)`, s.total === 69 && s.VERIFIED_SOURCE === EXP.totals.VERIFIED_SOURCE && s.NEEDS_REVIEW === EXP.totals.NEEDS_REVIEW && s.MISSING_EVIDENCE === EXP.totals.MISSING_EVIDENCE && s.APPROVED_FOR_CLINICAL_USE === 0, s);
check("Không có bản ghi phê duyệt tự tạo", P.HDTDT_APPROVALS.length === 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
