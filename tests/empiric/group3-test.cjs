// Unit test Buoc 4D Nhom 3. Chay: PROJ=<repo> node group3-test.cjs
const EXP = require("./expected-status.cjs");
const fs = require("fs"), path = require("path");
const load = require("./tsrun.cjs");
const R = load("data/antibiotics/empiric/regimens/index.ts");
const I = load("data/antibiotics/empiric/international.ts");
const C = load("data/antibiotics/empiric/dose-conflicts.ts");
const A = load("data/antibiotics/empiric/safety-alerts.ts");
const CMP = load("data/antibiotics/empiric/comparison.ts");
const REC = load("data/antibiotics/empiric/source-reconciliation.ts");
const E = load("lib/antibiotics/evidence-status.ts");
const SE = load("lib/antibiotics/selection-engine.ts");
const before = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "byt-regimens-baseline.json"), "utf8"));
let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${!ok && d ? "  — " + JSON.stringify(d).slice(0, 300) : ""}`); };
const G3 = ["v8-39", "v8-2", "v8-17", "v8-33", "v9-1"];
const byId = new Map(R.ALL_REGIMENS.map((r) => [r.id, r]));

// 1. BYT goc giu nguyen
const prev = new Map(before.regimens.map((r) => [r.id, r]));
const changed = R.ALL_REGIMENS.filter((r) => { const p = prev.get(r.id); return !p || JSON.stringify([r.drugs, r.scenario, r.duration ?? null, r.source, r.role, r.diseaseIds]) !== JSON.stringify([p.drugs, p.scenario, p.duration, p.source, p.role, p.diseaseIds]); });
check("300 phương án BYT giữ nguyên thuốc/liều/kịch bản/thời gian/nguồn", R.ALL_REGIMENS.length === 300 && changed.length === 0, changed.map((r) => r.id));
const PFX = "KHÔNG ÁP DỤNG MẶC ĐỊNH CHO TRẺ SƠ SINH – nguyên văn BYT (ghi chung cho viêm màng não): ";
const notesBad = R.ALL_REGIMENS.filter((r) => { const p = prev.get(r.id); const n = r.notes ?? []; return !p.notes.every((o, i) => n[i] === o || n[i] === PFX + o) || !n.slice(p.notes.length).every((x) => x.startsWith("ĐỐI CHIẾU LIỀU – ")); });
check("Ghi chú BYT gốc giữ nguyên; chỉ thêm ghi chú ĐỐI CHIẾU LIỀU", notesBad.length === 0, notesBad.map((r) => r.id));

// 2. Trang thai
const s = E.summarize();
check(`69 bệnh: ${EXP.totals.VERIFIED_SOURCE} VERIFIED_SOURCE / ${EXP.totals.NEEDS_REVIEW} NEEDS_REVIEW / ${EXP.totals.MISSING_EVIDENCE} MISSING_EVIDENCE / 0 APPROVED (baseline + thay đổi có chủ đích)`, s.total === 69 && s.VERIFIED_SOURCE === EXP.totals.VERIFIED_SOURCE && s.NEEDS_REVIEW === EXP.totals.NEEDS_REVIEW && s.MISSING_EVIDENCE === EXP.totals.MISSING_EVIDENCE && s.APPROVED_FOR_CLINICAL_USE === 0, s);
check("Nhóm 3: không tự nâng VERIFIED_SOURCE; v9-1 vẫn MISSING_EVIDENCE", G3.filter((x) => x !== "v9-1").every((id) => E.evidenceFor(id).status === "NEEDS_REVIEW") && E.evidenceFor("v9-1").status === "MISSING_EVIDENCE");

// 3. Nguon quoc te
for (const id of G3) {
  const e = I.getIntlEntry(id);
  check(`${id}: có mục quốc tế, nguồn có tổ chức/năm/URL/vị trí`, !!e && e.guidelineIds.every((g) => I.INTL_GUIDELINES[g] && /^https:\/\//.test(I.INTL_GUIDELINES[g].url) && I.INTL_GUIDELINES[g].published) && e.recommendations.every((r) => r.locator && I.INTL_GUIDELINES[r.guidelineId]) && e.regimens.every((r) => r.locator && I.INTL_GUIDELINES[r.guidelineId]));
  check(`${id}: có so sánh BYT/quốc tế và ghi chú nguồn`, !!CMP.getComparison(id) && !!REC.getReconciliationNote(id));
}
const ie = I.getIntlEntry("v8-39");
const ieEmp = ie.regimens.filter((r) => r.kind === "empiric");
check("Viêm nội tâm mạc: ESC 2023 Bảng 10 (kinh nghiệm) tách người lớn / trẻ em, có dị ứng beta-lactam", ieEmp.length === 3 && ieEmp.every((r) => r.options.some((o) => o.startsWith("Người lớn")) && r.options.some((o) => o.startsWith("Trẻ em"))) && ieEmp.some((r) => /Dị ứng beta-lactam/.test(r.scenario)));
check("Viêm nội tâm mạc: chú thích chưa đọc được ghi CHƯA XÁC MINH", ie.regimens.some((r) => /CHƯA XÁC MINH/.test(r.note ?? "")));
const t21 = I.getIntlEntry("v8-17").regimens.find((r) => r.locator === "Table 2.1");
check("IDSA cUTI Bảng 2.1 ghi rõ là liều thử nghiệm, không phải liều khuyến cáo", !!t21 && /KHÔNG phải bảng liều khuyến cáo/.test(t21.scenario));
check("v8-2 (4D.4): không còn phác đồ ESBL theo tác nhân; ESBL nằm ở v8-43", !I.getIntlEntry("v8-2").regimens.some((r) => r.guidelineId === "idsa-amr-2026") && I.getIntlEntry("v8-43").regimens.some((r) => /ESBL-E NKTN phức tạp/.test(r.scenario) && r.kind === "pathogen-directed"));
check("Viêm khớp: nguồn quốc tế giới hạn CHỈ TRẺ EM, không có liều tự suy diễn", /CHỈ TRẺ EM/.test(I.getIntlEntry("v8-33").scope) && I.getIntlEntry("v8-33").regimens.length === 0);
check("v9-1: không thêm liều (nguồn không có bảng liều)", I.getIntlEntry("v9-1").regimens.length === 0);

// 4. Doi chieu lieu & canh bao
const g3c = C.DOSE_CONFLICTS.filter((c) => c.diseaseIds.some((d) => G3.includes(d)));
check("Nhóm 3: có mục đối chiếu cho 4 bệnh có liều (v8-39, v8-2, v8-17, v8-33)", ["v8-39", "v8-2", "v8-17", "v8-33"].every((d) => g3c.some((c) => c.diseaseIds.includes(d))));
check("Đối chiếu Nhóm 3: mỗi mục có BYT + quốc tế + URL + cảnh báo + HĐT&ĐT", g3c.every((c) => c.byt.length && c.intl.length && c.intl.every((r) => /^https:\/\//.test(r.url ?? "")) && c.warning && /HĐT&ĐT/.test(c.decision)));
check("Đối chiếu Nhóm 3: regimenId tồn tại, đúng mặt bệnh", g3c.every((c) => c.regimenIds.every((id) => byId.has(id) && byId.get(id).diseaseIds.some((d) => c.diseaseIds.includes(d)))));
const FLAG_RE = /CẦN DƯỢC SĨ XÁC NHẬN|LIỀU NGHI SAI|CHƯA XÁC MINH|không có trong bản in|thiếu tên hoạt chất/;
check("Ghi chú đối chiếu không chứa từ khóa làm đổi trạng thái", R.ALL_REGIMENS.every((r) => (r.notes ?? []).filter((n) => n.startsWith("ĐỐI CHIẾU")).every((n) => !FLAG_RE.test(n))));
check("Cảnh báo NGUY CƠ CAO: ciprofloxacin trẻ em viêm nội tâm mạc (thiếu /kg)", A.safetyAlertsFor("r-ie-native-peds")[0]?.level === "critical");
check("Cảnh báo bàn chân ĐTĐ: mọi 10 phác đồ có cảnh báo không có liều", R.getRegimensForDisease("v9-1").length === 10 && R.getRegimensForDisease("v9-1").every((r) => A.safetyAlertsFor(r.id).some((a) => a.id === "dfi-no-dose")));
check("Cảnh báo K. kingae cho phác đồ kinh nghiệm viêm khớp", ["r-sa-empiric-1", "r-sa-empiric-2"].every((id) => A.safetyAlertsFor(id).some((a) => /Kingella/.test(a.title))));
check("Cảnh báo tắc nghẽn sỏi + amoxicilin-clavulanat tiêm", A.safetyAlertsFor("r-stone-complic-bl").some((a) => a.id === "stone-obstruction") && A.safetyAlertsFor("r-py-iv-bl").some((a) => a.id === "pyelo-amoxclav-iv"));
check("Mọi regimenId cảnh báo tồn tại", A.SAFETY_ALERTS.every((a) => a.regimenIds.every((id) => byId.has(id))));

// 5. Safety gate engine van giu
const base = { population: "adult", pregnant: "no", penicillinAllergy: "no", renal: "normal", micro: "none" };
const ieRes = SE.evaluate("v8-39", { ...base, scenario: byId.get("r-ie-native-1").scenario });
check("Engine: viêm nội tâm mạc ready, NOT_APPROVED, cần bác sĩ/dược sĩ quyết định", ieRes.status === "ready" && ieRes.approval === "NOT_APPROVED" && ieRes.clinicalUse === "clinician-decision-required", ieRes.status);
const peds = SE.evaluate("v8-39", { ...base, population: "child", scenario: byId.get("r-ie-native-peds").scenario });
check("Engine (4D.4): phác đồ trẻ em có ciprofloxacin thiếu /kg bị KHÓA đề xuất", peds.status === "ready" && !peds.groups.flatMap((g) => g.options).some((o) => o.id === "r-ie-native-peds") && peds.excluded.some((e) => /ĐÃ KHÓA/.test(e.reason) && /ciprofloxacin/.test(e.reason)), peds.status);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
