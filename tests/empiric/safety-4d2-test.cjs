// Unit test Buoc 4D.2 – canh bao an toan, phe duyet HĐT&ĐT. Chay: PROJ=<repo> node safety-4d2-test.cjs
const EXP = require("./expected-status.cjs");
const fs = require("fs"), path = require("path");
const load = require("./tsrun.cjs");
const R = load("data/antibiotics/empiric/regimens/index.ts");
const A = load("data/antibiotics/empiric/safety-alerts.ts");
const P = load("data/antibiotics/empiric/approvals.ts");
const E = load("lib/antibiotics/evidence-status.ts");
const SE = load("lib/antibiotics/selection-engine.ts");
const before = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "byt-regimens-baseline.json"), "utf8"));

let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${!ok && d ? "  — " + d : ""}`); };
const byId = new Map(R.ALL_REGIMENS.map((r) => [r.id, r]));
const prev = new Map(before.regimens.map((r) => [r.id, r]));

// 0. Du lieu BYT nguyen ban
const changed = R.ALL_REGIMENS.filter((r) => { const p = prev.get(r.id); return !p || JSON.stringify([r.drugs, r.scenario, r.duration ?? null, r.source, r.role]) !== JSON.stringify([p.drugs, p.scenario, p.duration, p.source, p.role]); });
check("Thuốc/liều/kịch bản/thời gian/nguồn BYT không đổi (300 phương án)", changed.length === 0 && R.ALL_REGIMENS.length === 300, changed.map((r) => r.id).join(","));
check("Mọi regimenId của cảnh báo an toàn tồn tại", A.SAFETY_ALERTS.every((a) => a.regimenIds.every((id) => byId.has(id))), A.SAFETY_ALERTS.flatMap((a) => a.regimenIds.filter((id) => !byId.has(id))).join(","));
check("Mỗi cảnh báo có tiêu đề, nội dung, nguồn", A.SAFETY_ALERTS.every((a) => a.title && a.text && a.sources.length > 0));

// 1. Colistin
const colistinDosed = R.ALL_REGIMENS.filter((r) => r.drugs.some((d) => /colistin/i.test(d.name + " " + d.dose)) && r.drugs.some((d) => /colistin/i.test(d.name + " " + d.dose) && /\d/.test(d.dose) && !/không nêu liều|chỉ nêu tên/.test(d.dose)));
const noUnitAlert = colistinDosed.filter((r) => !A.safetyAlertsFor(r.id).some((a) => /colistin/i.test(a.title)));
check(`Mọi phác đồ có liều colistin (${colistinDosed.length}) đều có cảnh báo đơn vị`, noUnitAlert.length === 0, noUnitAlert.map((r) => r.id).join(","));
const crit = A.safetyAlertsFor("r-fn-add-colistin").find((a) => a.level === "critical");
check("Colistin 6 MIU mỗi 8 giờ: cảnh báo NGUY CƠ CAO, nêu 18 MIU/ngày và tối đa 12 MIU", !!crit && /18 MIU/.test(crit.text) && /12 MIU/.test(crit.text));
check("Không đề xuất liều colistin thay thế", /không đề xuất liều thay thế/i.test(crit.text));
const unit = A.SAFETY_ALERTS.find((a) => a.id === "colistin-unit");
check("Cảnh báo đơn vị phân biệt MIU, mg CBA, mg CMS", ["MIU", "mg CBA", "mg CMS"].every((u) => unit.text.includes(u)) && /không tự quy đổi/i.test(unit.text));
check("Colistin QĐ 2767 (mg/kg không rõ đơn vị): CHƯA XÁC MINH", A.safetyAlertsFor("r-copd23-in-mdr-pseudo").some((a) => /CHƯA XÁC MINH/.test(a.title)));
check("Nguyên văn liều colistin QĐ 708 tr. 254 giữ nguyên", byId.get("r-fn-add-colistin").drugs[0].dose === "6.000.000 đơn vị (tương đương 200 mg colistin base) mỗi 8 giờ");

// 2. Viem mang nao
for (const id of A.NEONATAL_MENINGITIS_REGIMENS) {
  const r = byId.get(id);
  const dexa = r.notes.filter((n) => /dexamethason/i.test(n) && !n.startsWith("ĐỐI CHIẾU"));
  check(`${id}: dexamethason không hiển thị như khuyến cáo mặc định`, dexa.every((n) => n.startsWith(A.NEONATAL_DEXA_PREFIX)) && A.safetyAlertsFor(id)[0].level === "critical" && /sơ sinh/i.test(A.safetyAlertsFor(id)[0].title));
}
const adultMen = R.ALL_REGIMENS.filter((r) => r.id.startsWith("r-men-") && r.diseaseIds.includes("v8-36"));
check("Người lớn (QĐ 708): ghi chú dexamethason giữ nguyên, không gắn nhãn sơ sinh", adultMen.every((r) => (r.notes ?? []).every((n) => !n.startsWith(A.NEONATAL_DEXA_PREFIX))));
const childIds = ["r-men-1-3m-first", "r-men-3m-18y-first", "r-vmn42-1to3m-first", "r-vmn42-3m18y-first"];
check("Trẻ em: cảnh báo liều tối đa khi tính mg/kg", childIds.every((id) => A.safetyAlertsFor(id).some((a) => /liều tối đa/i.test(a.text) && /4 g\/ngày/.test(a.text))));
check("Người lớn QĐ 5642 (mg/kg): cảnh báo NGUY CƠ CAO vượt liều tối đa", ["r-vmn42-18to50-first", "r-vmn42-over50-first", "r-vmn42-immuno-first"].every((id) => A.safetyAlertsFor(id).some((a) => a.level === "critical" && /vượt liều tối đa/.test(a.title))));
check("Liều chưa xác minh (1–3 tháng, <2 kg, ô bảng không rõ) có cảnh báo", ["r-men-1-3m-first", "r-vmn42-trauma-alt", "r-men-neo-first"].every((id) => A.safetyAlertsFor(id).some((a) => /CHƯA XÁC MINH/.test(a.title + a.text))));

// 3. S. aureus
const sab = A.SAFETY_ALERTS.find((a) => a.id === "sab-checklist");
check("SAB: checklist gắn mọi phác đồ S. aureus", ["r-bsi-mssa", "r-bsi-mssa-alt", "r-bsi-mrsa", "r-bsi-mrsa-alt"].every((id) => A.safetyAlertsFor(id).some((a) => a.id === "sab-checklist")));
check("SAB: có cấy máu kiểm tra, TTE, TEE, ổ nhiễm sâu", ["Cấy máu kiểm tra", "TTE", "TEE", "ổ nhiễm sâu"].every((k) => sab.checklist.some((c) => c.includes(k))));
check("SAB: không mặc định 14 ngày", /KHÔNG mặc định 14 ngày/.test(sab.text) && sab.checklist.some((c) => /14 ngày.*CHỈ KHI/.test(c)) && sab.checklist.some((c) => /không áp dụng 14 ngày/.test(c)));
check("SAB: dẫn IDSA/ESCMID 2026 Part 1", sab.sources.some((s) => /IDSA\/ESCMID 2026.*Part 1/.test(s)));
check("Phác đồ S. aureus BYT không có thời gian mặc định 14 ngày", ["r-bsi-mssa", "r-bsi-mssa-alt", "r-bsi-mrsa", "r-bsi-mrsa-alt"].every((id) => !/14 ngày/.test(byId.get(id).duration ?? "")));

// 4. Bo chon khang sinh: canh bao di kem phuong an
const base = { population: "adult", pregnant: "no", penicillinAllergy: "no", renal: "normal", micro: "none" };
const rSab = SE.evaluate("v8-13", { ...base, scenario: "Staphylococcus aureus nhạy methicilin (MSSA)" });
check("Bộ chọn: phương án S. aureus mang checklist", rSab.status === "ready" && rSab.groups.flatMap((g) => g.options).every((o) => o.alerts.some((a) => a.checklist && a.checklist.length >= 7)));
const rCol = SE.evaluate("v8-116", { ...base, scenario: "Nhiễm khuẩn nặng đe dọa tính mạng do Gram-âm kháng carbapenem" });
check("Bộ chọn: colistin 6 MIU bị KHÓA đề xuất tự động (4D.4), nêu lý do trong danh sách loại", rCol.status === "ready" && !rCol.groups.flatMap((g) => g.options).some((o) => o.id === "r-fn-add-colistin") && rCol.excluded.some((e) => /ĐÃ KHÓA ĐỀ XUẤT TỰ ĐỘNG/.test(e.reason) && /18 MIU/.test(e.reason)));

// 5. Phe duyet HĐT&ĐT
const all = E.evaluateAll();
const s = E.summarize();
check("Không có bản ghi phê duyệt tự tạo", P.HDTDT_APPROVALS.length === 0);
check(`VERIFIED_SOURCE tách khỏi APPROVED_FOR_CLINICAL_USE (${EXP.totals.VERIFIED_SOURCE} nguồn đã xác minh, 0 phê duyệt)`, s.VERIFIED_SOURCE === EXP.totals.VERIFIED_SOURCE && s.APPROVED_FOR_CLINICAL_USE === 0, JSON.stringify(s));
check("Mặt bệnh VERIFIED_SOURCE vẫn NOT_APPROVED", all.filter((e) => e.status === "VERIFIED_SOURCE").every((e) => e.approval.status === "NOT_APPROVED"));
check("Mọi mặt bệnh có trạng thái phê duyệt kèm diễn giải", all.every((e) => e.approval && /HĐT&ĐT/.test(e.approval.text)));
check("Phương án chưa phê duyệt: regimenApproval = NOT_APPROVED", R.ALL_REGIMENS.every((r) => P.regimenApproval(r.id, r.diseaseIds) === "NOT_APPROVED"));
check("Nhãn chưa phê duyệt ghi rõ không tự động áp dụng", /không tự động áp dụng/.test(P.APPROVAL_TEXT.NOT_APPROVED));
check("Không còn mã trạng thái 'VERIFIED' cũ", !all.some((e) => e.status === "VERIFIED") && s.VERIFIED === undefined);
check(`Tổng trạng thái = baseline + thay đổi có chủ đích: ${EXP.totals.VERIFIED_SOURCE} / ${EXP.totals.NEEDS_REVIEW} / ${EXP.totals.MISSING_EVIDENCE}`, s.VERIFIED_SOURCE === EXP.totals.VERIFIED_SOURCE && s.NEEDS_REVIEW === EXP.totals.NEEDS_REVIEW && s.MISSING_EVIDENCE === EXP.totals.MISSING_EVIDENCE);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
