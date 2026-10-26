// Unit test Buoc 4D.1 – doi chieu lieu Nhom 1. Chay: PROJ=<repo> node dose-conflict-test.cjs
const EXP = require("./expected-status.cjs");
const fs = require("fs"), path = require("path");
const load = require("./tsrun.cjs");
const R = load("data/antibiotics/empiric/regimens/index.ts");
const C = load("data/antibiotics/empiric/dose-conflicts.ts");
const I = load("data/antibiotics/empiric/international.ts");
const CMP = load("data/antibiotics/empiric/comparison.ts");
const E = load("lib/antibiotics/evidence-status.ts");
const before = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "byt-regimens-baseline.json"), "utf8"));

let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${!ok && d ? "  — " + d : ""}`); };
const GROUP1 = ["v8-11", "v8-12", "v8-4", "v8-5", "v8-14"];
const GROUP2 = ["v8-36", "v8-104", "v8-113", "v8-116", "v8-13"];
const R_CMP = load("data/antibiotics/empiric/source-reconciliation.ts");
const byId = new Map(R.ALL_REGIMENS.map((r) => [r.id, r]));

// 1. Gan dung phuong an
const missing = C.DOSE_CONFLICTS.flatMap((c) => c.regimenIds.filter((id) => !byId.has(id)).map((id) => `${c.id}:${id}`));
check("Mọi regimenId của đối chiếu liều tồn tại", missing.length === 0, missing.join(", "));
const wrongDisease = C.DOSE_CONFLICTS.flatMap((c) => c.regimenIds.filter((id) => byId.has(id) && !byId.get(id).diseaseIds.some((d) => c.diseaseIds.includes(d))).map((id) => `${c.id}:${id}`));
check("Phương án được gắn thuộc đúng mặt bệnh của mục đối chiếu", wrongDisease.length === 0, wrongDisease.join(", "));
const GROUP3 = ["v8-39", "v8-2", "v8-17", "v8-33", "v9-1"];
check("Chỉ gắn cho mặt bệnh Nhóm 1–3", C.DOSE_CONFLICTS.every((c) => c.diseaseIds.every((d) => GROUP1.includes(d) || GROUP2.includes(d) || GROUP3.includes(d))));

// 2. Nguon day du, hien thi rieng BYT / quoc te
check("Mỗi mục có ≥ 1 nguồn BYT/Việt Nam và ≥ 1 nguồn quốc tế", C.DOSE_CONFLICTS.every((c) => c.byt.length > 0 && c.intl.length > 0));
const refs = C.DOSE_CONFLICTS.flatMap((c) => [...c.byt, ...c.intl]);
check("Mỗi nguồn có tên hướng dẫn/tổ chức/năm, vị trí và nội dung liều", refs.every((r) => r.source && /\(\d{4}\)/.test(r.source) && r.locator && r.dose));
check("Nguồn quốc tế đều có URL chính thức", C.DOSE_CONFLICTS.every((c) => c.intl.every((r) => /^https:\/\//.test(r.url ?? ""))));
check("Nguồn QĐ 708 có URL kcb.vn", refs.filter((r) => r.source.includes("QĐ 708")).every((r) => (r.url ?? "").includes("kcb.vn")));
check("Mỗi mục có cảnh báo và nội dung cần HĐT&ĐT phê duyệt", C.DOSE_CONFLICTS.every((c) => c.warning && /HĐT&ĐT/.test(c.decision)));
const note = C.doseConflictNotes("r-sepsis-a-mrsa").join(" ");
check("Ghi chú tách riêng 'Theo BYT' và 'Theo quốc tế'", /Theo BYT:.*Theo quốc tế:.*Cảnh báo:.*Cần phê duyệt:/.test(note));

// 3. Khong doi phac do / lieu BYT
const prev = new Map(before.regimens.map((r) => [r.id, r]));
const changed = [];
for (const r of R.ALL_REGIMENS) {
  const p = prev.get(r.id);
  if (!p) { changed.push(r.id + " (mới)"); continue; }
  const same = JSON.stringify([r.diseaseIds, r.scenario, r.role, r.drugs, r.duration ?? null, r.source]) === JSON.stringify([p.diseaseIds, p.scenario, p.role, p.drugs, p.duration, p.source]);
  const notes = r.notes ?? [];
  // 4D.2: ghi chu dexamethason o phac do so sinh duoc gan nhan, NGUYEN VAN giu nguyen o phan sau.
  const PFX = "KHÔNG ÁP DỤNG MẶC ĐỊNH CHO TRẺ SƠ SINH – nguyên văn BYT (ghi chung cho viêm màng não): ";
  const prefixOk = p.notes.every((orig, i) => notes[i] === orig || notes[i] === PFX + orig);
  const addedOk = notes.slice(p.notes.length).every((n) => n.startsWith("ĐỐI CHIẾU LIỀU – "));
  if (!same || !prefixOk || !addedOk) changed.push(r.id);
}
check("Không phương án BYT nào đổi thuốc/liều/kịch bản/thời gian/nguồn (300 phương án)", changed.length === 0 && R.ALL_REGIMENS.length === before.regimens.length, changed.join(", "));
const added = R.ALL_REGIMENS.reduce((n, r) => n + (r.notes ?? []).filter((x) => x.startsWith("ĐỐI CHIẾU LIỀU")).length, 0);
check("Ghi chú đối chiếu chỉ được thêm vào mục Lưu ý", added === C.DOSE_CONFLICTS.reduce((n, c) => n + c.regimenIds.length, 0), `added=${added}`);

// 4. Trang thai bang chung khong doi
const now = Object.fromEntries(E.evaluateAll().map((e) => [e.disease.id, e.status]));
const diff = Object.keys(EXP.expected).filter((k) => EXP.expected[k] !== now[k]);
check("Trạng thái 69 mặt bệnh = baseline + thay đổi có chủ đích (fixtures/status-changes.json) – không tự nâng VERIFIED", diff.length === 0 && Object.keys(now).length === 69, diff.join(", "));
check("Nhóm 1 vẫn NEEDS_REVIEW", GROUP1.every((id) => now[id] === "NEEDS_REVIEW"));
check("Nhóm 2 vẫn NEEDS_REVIEW (không tự nâng VERIFIED)", GROUP2.every((id) => now[id] === "NEEDS_REVIEW"));
const FLAG_RE = /CẦN DƯỢC SĨ XÁC NHẬN|LIỀU NGHI SAI|CHƯA XÁC MINH|không có trong bản in|thiếu tên hoạt chất/;
check("Ghi chú đối chiếu không chứa từ khóa cảnh báo làm đổi trạng thái", R.ALL_REGIMENS.every((r) => (r.notes ?? []).filter((n) => n.startsWith("ĐỐI CHIẾU LIỀU")).every((n) => !FLAG_RE.test(n))));

// 8. Nhom 2 – nguon quoc te
for (const id of GROUP2) {
  const e = I.getIntlEntry(id);
  check(`${id}: có mục quốc tế với nguồn đã trích, có URL và vị trí`, !!e && e.guidelineIds.every((g) => I.INTL_GUIDELINES[g]?.status === "extracted" && /^https:\/\//.test(I.INTL_GUIDELINES[g].url)) && e.recommendations.length > 0 && e.recommendations.every((r) => r.locator));
  check(`${id}: có so sánh BYT/quốc tế và ghi chú nguồn`, !!CMP.getComparison(id) && !!R_CMP.getReconciliationNote(id));
}
check("Không dùng hướng dẫn IDSA đã ARCHIVED làm nguồn quốc tế", !Object.values(I.INTL_GUIDELINES).some((g) => /2004|2010|2011/.test(g.published) && g.status === "extracted" && /IDSA/.test(g.org)));
const men = I.getIntlEntry("v8-104");
check("Viêm màng não trẻ em: tách liều trẻ > 1 tháng và sơ sinh", men.regimens.some((r) => /Trẻ > 1 tháng/.test(r.scenario)) && men.regimens.some((r) => /sơ sinh/.test(r.scenario)));
const neoCon = C.DOSE_CONFLICTS.find((c) => c.id === "dexamethasone-neonate");
check("Cảnh báo corticosteroid sơ sinh gắn vào mọi phác đồ sơ sinh", ["r-men-neo-first", "r-men-neo-alt", "r-vmn42-neo-first", "r-vmn42-neo-alt"].every((id) => neoCon.regimenIds.includes(id) && byId.get(id).notes.some((n) => n.includes("Corticosteroid ở trẻ sơ sinh"))));
check("Viêm màng não: có nội dung thấm dịch não tủy và điều trị bổ trợ", I.getIntlEntry("v8-36").recommendations.some((r) => /Thấm dịch não tủy/.test(r.text)) && I.getIntlEntry("v8-36").recommendations.some((r) => /dexamethason/i.test(r.text)));
check("Viêm màng não không gắn đích AUC vancomycin 2020", ["v8-36", "v8-104"].every((id) => !I.getIntlEntry(id).guidelineIds.includes("ashp-idsa-vanco-2020")));
const fn = I.getIntlEntry("v8-116");
check("Sốt giảm bạch cầu: có phân tầng nguy cơ, Pseudomonas, nấm và thời điểm đánh giá lại", ["phân tầng", "Pseudomonas", "nấm", "72–96 giờ"].every((k) => fn.recommendations.some((r) => r.text.includes(k))));
const fnCol = C.DOSE_CONFLICTS.find((c) => c.id === "fn-colistin");
check("Colistin sốt giảm bạch cầu: nêu 18 MIU/ngày so với tối đa 12 MIU, có nhãn đơn vị", /18 MIU/.test(fnCol.byt[0].dose) && /12 MIU/.test(fnCol.byt[1].dose) && [...fnCol.byt, ...fnCol.intl.slice(0, 1)].every((r) => /\[đơn vị (MIU|mg CBA)/.test(r.dose)));
const sab = I.getIntlEntry("v8-13");
check("S. aureus: có MSSA/MRSA, cấy máu kiểm tra, nội tâm mạc (TTE/TEE), ổ nhiễm sâu, phân tầng", ["cấy máu kiểm tra", "TEE", "ổ nhiễm sâu", "phân tầng"].every((k) => sab.recommendations.some((r) => r.text.toLowerCase().includes(k.toLowerCase()))) && sab.gaps.some((g) => /MSSA\/MRSA/.test(g)));
check("Khuyến cáo vancomycin 2020 ghi rõ phạm vi người lớn/MRSA nặng", I.getIntlEntry("v8-11").recommendations.filter((r) => r.guidelineId === "ashp-idsa-vanco-2020").every((r) => /người lớn|MRSA nặng/.test(r.text)));

// 5. Don vi
check("Ghi chú đơn vị vancomycin dùng mg/L và giữ nguyên văn 'mg/mL' của ATS", /mg\/L/.test(C.VANCO_UNIT_NOTE) && /KHÔNG quy đổi/.test(C.VANCO_UNIT_NOTE));
check("Ghi chú colistin phân biệt MIU, mg CBA, mg CMS", ["MIU", "mg CBA", "mg CMS"].every((u) => C.COLISTIN_UNIT_NOTE.includes(u)) && /không tự quy đổi/.test(C.COLISTIN_UNIT_NOTE));
const col = C.DOSE_CONFLICTS.find((c) => c.id === "colistin");
check("Mỗi liều colistin có nhãn đơn vị hoặc ghi rõ không có số liều", [...col.byt, ...col.intl].every((r) => /\[đơn vị (MIU|mg CBA)\]|không ghi số liều|chưa trích/.test(r.dose)));
const vanRecs = I.INTL_ENTRIES.flatMap((e) => e.recommendations).filter((r) => r.guidelineId === "ashp-idsa-vanco-2020");
check("Khuyến cáo vancomycin 2020: AUC24/MIC 400–600, giả định MIC = 1 mg/L", vanRecs.some((r) => /AUC24\/MIC 400–600/.test(r.text) && /MIC.*= 1 mg\/L/.test(r.text)));
check("Khuyến cáo vancomycin ghi nồng độ bằng mg/L (không µg/mL)", vanRecs.every((r) => !/µg\/mL/.test(r.text)));

// 6. Khong suy dien phac do tu IDSA AMR
for (const id of ["v8-11", "v8-12"]) {
  const e = I.getIntlEntry(id);
  check(`${id}: không có phác đồ kinh nghiệm từ IDSA AMR 2026 ở tab quốc tế`, !e.guidelineIds.includes("idsa-amr-2026") && e.regimens.every((r) => r.guidelineId !== "idsa-amr-2026"));
}
check("Mọi liều IDSA AMR trong đối chiếu ghi rõ 'chỉ khi đã xác định/nghi kháng thuốc' hoặc chỉ dẫn chiếu", C.DOSE_CONFLICTS.flatMap((c) => c.intl).filter((r) => r.source.includes("AMR")).every((r) => /chỉ khi|dẫn chiếu/.test(r.locator + r.dose)));

// 7. Noi dung quoc te yeu cau
const hap = I.getIntlEntry("v8-4"), vap = I.getIntlEntry("v8-5"), sep = I.getIntlEntry("v8-11");
check("HAP/VAP: thời gian 7 ngày theo ATS/IDSA 2016, điều chỉnh theo đáp ứng", [hap, vap].every((e) => e.recommendations.some((r) => /7 ngày/.test(r.text) && /tùy/.test(r.text))));
check("Sepsis: SSC 2026 có khuyến cáo lựa chọn (đa kháng) và xuống thang", sep.recommendations.some((r) => r.guidelineId === "ssc-2026" && /đa kháng/.test(r.text)) && sep.recommendations.some((r) => r.guidelineId === "ssc-2026" && /Xuống thang/.test(r.text)));
const unknownGl = I.INTL_ENTRIES.flatMap((e) => [...e.guidelineIds, ...e.recommendations.map((r) => r.guidelineId), ...e.regimens.map((r) => r.guidelineId)]).filter((g) => !I.INTL_GUIDELINES[g]);
check("Mọi guidelineId tham chiếu đều có trong danh mục", unknownGl.length === 0, unknownGl.join(", "));
const sepCmp = CMP.getComparison("v8-11");
check("Tab So sánh sepsis không dùng IDSA AMR làm nguồn quốc tế", !/AMR/.test(sepCmp.intl));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
