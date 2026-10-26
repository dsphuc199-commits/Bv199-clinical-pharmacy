const load = require("./tsrun.cjs");
const E = load("lib/antibiotics/selection-engine.ts");
const K = load("data/antibiotics/empiric/catalog.ts");

let pass = 0, fail = 0;
function check(name, ok, detail) {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}
const ids = (list) => list.map((d) => d.id);
const base = { population: "adult", pregnant: "no", penicillinAllergy: "no", renal: "normal" };
const allOpts = (r) => (r.groups || []).flatMap((g) => g.options);

// ---------- Tim kiem ----------
check("Tìm ICD J18 → CAP người lớn + trẻ em", ["v8-1", "v8-101"].every((id) => ids(E.searchDiseases("J18")).includes(id)));
check("Tìm ICD A41.9 → Sepsis", ids(E.searchDiseases("A41.9")).includes("v8-11"));
check("Tìm tên 'viem phoi' (không dấu)", ids(E.searchDiseases("viem phoi")).includes("v8-4"));
check("Tìm chuỗi vô nghĩa → rỗng", E.searchDiseases("zzzz").length === 0);

// ---------- Thieu du lieu: khong coi la binh thuong ----------
let r = E.evaluate("v8-11", {});
check("Sepsis không nhập gì → need-input", r.status === "need-input", JSON.stringify(r.missing));
check("Thiếu dữ liệu: liệt kê Đối tượng, Thai kỳ, Dị ứng, Chức năng thận",
  r.status === "need-input" && ["Đối tượng", "Đang mang thai", "Dị ứng penicillin", "Chức năng thận"].every((m) => r.missing.includes(m)));
r = E.evaluate("v8-11", { ...base, renal: "impaired" });
check("Suy thận nhưng chưa nhập CrCl → need-input CrCl", r.status === "need-input" && r.missing.includes("CrCl (mL/phút)"));
r = E.evaluate("v8-11", { ...base, penicillinAllergy: undefined });
check("Chưa biết dị ứng → không khuyến cáo", r.status === "need-input" && r.missing.includes("Dị ứng penicillin"));

// ---------- Sepsis: chon tinh huong ----------
const qs = E.questionsFor("v8-11", { ...base, mdr: "no" });
const scnQ = qs.find((q) => q.key === "scenario");
check("Sepsis: có câu hỏi nguy cơ đa kháng theo tiêu chí nguồn", qs.some((q) => q.key === "mdr"));
r = E.evaluate("v8-11", { ...base, mdr: "no" });
check("Sepsis chưa chọn tình huống → need-input", r.status === "need-input" && r.missing.includes("Tình huống lâm sàng (theo nguồn)"));
const firstScn = scnQ && scnQ.options.find((o) => o.value.startsWith("Chưa rõ ổ nhiễm khuẩn, không nguy cơ"));
r = E.evaluate("v8-11", { ...base, mdr: "no", scenario: firstScn && firstScn.value });
check("Sepsis đủ dữ liệu → ready", r.status === "ready", r.status === "ready" ? r.scenarioLabel : JSON.stringify(r));
check("Sepsis: nhóm 'Lựa chọn theo nguồn' (không tự gán ưu tiên)", r.status === "ready" && r.groups[0].label === "Lựa chọn theo nguồn");
check("Sepsis: có liều, nguồn QĐ 708", r.status === "ready" && allOpts(r)[0].drugs[0].dose.includes("Bảng II.11") && r.sourceSummary.includes("708"));
r = E.evaluate("v8-11", { ...base, penicillinAllergy: "yes", mdr: "no", scenario: firstScn && firstScn.value });
check("Dị ứng + pip-tazo là một lựa chọn → giữ, cảnh báo bỏ penicillin",
  r.status === "ready" && allOpts(r).length > 0 && allOpts(r)[0].warnings.some((w) => w.includes("không phải penicillin")));
r = E.evaluate("v8-11", { ...base, micro: "mrsa", mdr: "yes" });
check("Vi sinh MRSA → chỉ còn tình huống MRSA", r.status === "ready" ? /MRSA/.test(r.scenarioLabel) : r.status === "need-input" && r.candidates >= 1);

// ---------- Uu tien/thay the theo nguon ----------
r = E.evaluate("v8-43", { ...base });
check("ESBL (Bảng II.10 có cột lựa chọn): ready", r.status === "ready");
r = E.evaluate("v8-13", { ...base, scenario: "Staphylococcus aureus nhạy methicilin (MSSA)" });
check("S. aureus MSSA: nguồn có lựa chọn + thay thế → nhãn 'Ưu tiên (theo nguồn)'",
  r.status === "ready" && r.groups.some((g) => g.label === "Ưu tiên (theo nguồn)") && r.groups.some((g) => g.kind === "alternative"));
r = E.evaluate("v8-13", { ...base, penicillinAllergy: "yes", scenario: "Staphylococcus aureus nhạy methicilin (MSSA)" });
check("MSSA + dị ứng: loại oxacilin (bắt buộc), giữ vancomycin",
  r.status === "ready" && r.excluded.some((e) => /Oxacilin/.test(e.title)) && allOpts(r).some((o) => o.drugs.some((d) => /Vancomycin/.test(d.name))));

// ---------- COPD theo QĐ 2767 (2023) ----------
r = E.evaluate("v8-6", { ...base });
check("COPD (QĐ 2767) thiếu nguy cơ → need-input", r.status === "need-input" && r.missing.some((m) => m.startsWith("Nguy cơ kháng thuốc")));
const copdQ = E.questionsFor("v8-6", { ...base, mdr: "no" }).find((q) => q.key === "scenario");
check("COPD không nguy cơ: không còn tình huống Pseudomonas", !!copdQ && copdQ.options.every((o) => /không có nguy cơ|không có yếu tố nguy cơ/.test(o.value)), copdQ && copdQ.options.map(o=>o.value.slice(0,40)).join(" | "));
r = E.evaluate("v8-6", { ...base, mdr: "no", scenario: copdQ && copdQ.options.find((o) => o.value.startsWith("Nội trú"))?.value });
check("COPD nội trú không nguy cơ Pseudomonas → ready, nguồn QĐ 2767, 7–10 ngày", r.status === "ready" && r.sourceSummary.includes("2767") && allOpts(r).some((o) => o.duration.includes("7–10")));

// ---------- Doi tuong / thai ky ----------
r = E.evaluate("v8-101", { ...base });
check("CAP trẻ em với người lớn → no-match", r.status === "no-match");
r = E.evaluate("v8-16", { ...base, pregnant: "yes" });
check("Viêm bàng quang + thai → tình huống phụ nữ có thai", r.status === "ready" && /có thai/i.test(r.scenarioLabel));
r = E.evaluate("v8-16", { ...base, pregnant: "no" });
check("Viêm bàng quang không thai → không gợi ý tình huống thai kỳ",
  r.status === "need-input" ? true : r.status === "ready" && !/có thai/i.test(r.scenarioLabel));

// ---------- Nguon khong neu lieu ----------
r = E.evaluate("v9-1", { ...base, scenario: E.questionsFor("v9-1", base).find((q) => q.key === "scenario")?.options[0].value });
const dfiQs = E.questionsFor("v9-1", base);
check("Bàn chân ĐTĐ: hỏi mức độ theo Wagner/PEDIS", dfiQs.some((q) => q.key === "severity" && q.help.some((h) => /Wagner/.test(h))));
r = E.evaluate("v9-1", { ...base, severity: "mild", mdr: "no" });
const dfiReady = r.status === "ready" ? r : E.evaluate("v9-1", { ...base, severity: "mild", mdr: "no", scenario: E.questionsFor("v9-1", { ...base, severity: "mild", mdr: "no" }).find((q) => q.key === "scenario")?.options[0].value });
check("Bàn chân ĐTĐ: nguồn không nêu liều → certainty 'limited'", dfiReady.status === "ready" && dfiReady.certainty === "limited");

// ---------- CAP (QĐ 2147) ----------
r = E.evaluate("v8-1", {});
check("CAP không nhập → need-input", r.status === "need-input");
r = E.evaluate("v8-1", { ...base, capSetting: "outpatient", capSevere: "yes", capRisk: "no" });
check("CAP ngoại trú nhưng nặng → no-match (cần nhập viện)", r.status === "no-match");
r = E.evaluate("v8-1", { ...base, capSetting: "outpatient", capSevere: "no", capRisk: "no" });
check("CAP ngoại trú nguy cơ thấp → nhánh 'Ngoại trú – nguy cơ thấp'", r.status === "ready" && r.scenarioLabel === "Ngoại trú – nguy cơ thấp");
check("CAP: không tự xếp hạng ('Lựa chọn theo nguồn')", r.status === "ready" && r.groups[0].label === "Lựa chọn theo nguồn");
check("CAP: macrolid có điều kiện → trường hợp đặc biệt", r.status === "ready" && r.groups.some((g) => g.kind === "special" && g.options.some((o) => /Azithromycin/.test(o.title))));
r = E.evaluate("v8-1", { ...base, penicillinAllergy: "yes", capSetting: "outpatient", capSevere: "no", capRisk: "no" });
check("CAP dị ứng: loại amoxicillin, hiện quinolon dị ứng ở nhóm thay thế",
  r.status === "ready" && r.excluded.some((e) => /Amoxicillin đơn trị/.test(e.title)) && r.groups.some((g) => g.kind === "alternative"));
r = E.evaluate("v8-1", { ...base, capSetting: "ward", pseudoRisk: "no", mrsaRisk: "no" });
check("CAP nội trú không nguy cơ Pseudomonas → loại phác đồ chống Pseudomonas",
  r.status === "ready" && r.excluded.some((e) => /chống Pseudomonas/.test(e.title)));
check("CAP nội trú: ceftarolin 'nghi PRSP/MRSA' vào trường hợp đặc biệt, không bị loại",
  r.status === "ready" && r.groups.some((g) => g.kind === "special" && g.options.some((o) => /Ceftarolin/.test(o.title))));
r = E.evaluate("v8-1", { ...base, capSetting: "icu", pseudoRisk: "no", mrsaRisk: "yes" });
check("CAP ICU nghi MRSA → phác đồ thêm thuốc chống MRSA", r.status === "ready" && allOpts(r).some((o) => /MRSA/.test(o.title)));
r = E.evaluate("v8-1", { ...base, population: "child" });
check("CAP người lớn với trẻ em → no-match", r.status === "no-match");

// ---------- HAP / VAP ----------
r = E.evaluate("v8-4", { ...base, hapSevere: "yes", mdrRisk: "no", mrsaRisk: "yes" });
check("HAP nặng + MRSA → nhánh nặng/đa kháng + MRSA", r.status === "ready" && /MRSA/.test(r.scenarioLabel));
check("HAP: certainty 'limited' (khuyến cáo hội, không phải BYT)", r.status === "ready" && r.certainty === "limited");
r = E.evaluate("v8-5", { ...base, mdrRisk: "no", mrsaRisk: "no" });
check("VAP thiếu tỷ lệ kháng tại đơn vị → need-input", r.status === "need-input");
r = E.evaluate("v8-5", { ...base, mdrRisk: "no", mrsaRisk: "no", unitResistance: "unknown" });
check("VAP tỷ lệ kháng 'chưa biết' → nhánh phối hợp (theo nguồn)", r.status === "ready" && /đa kháng/i.test(r.scenarioLabel));
r = E.evaluate("v8-5", { ...base, mdrRisk: "no", mrsaRisk: "no", unitResistance: "lt10" });
check("VAP không nguy cơ, đơn vị < 10% → nhánh đơn trị", r.status === "ready" && /đơn trị/i.test(r.scenarioLabel));

// ---------- Toan bo danh muc: toi da 3 nhom ----------
let maxGroups = 0, readyCount = 0, crash = 0;
for (const d of K.DISEASES) {
  try {
    let input = { ...base };
    for (let i = 0; i < 6; i++) {
      const res = E.evaluate(d.id, input);
      if (res.status !== "need-input") { if (res.status === "ready") { readyCount++; maxGroups = Math.max(maxGroups, res.groups.length); } break; }
      const q = E.questionsFor(d.id, input).find((x) => x.required && input[x.key] === undefined);
      if (!q) break;
      input = { ...input, [q.key]: q.kind === "number" ? 50 : q.options[0].value };
    }
  } catch (e) { crash++; console.log("CRASH", d.id, e.message); }
}
check("Toàn bộ 69 mặt bệnh chạy không lỗi", crash === 0);
check("Không kết quả nào quá 3 nhóm", maxGroups <= 3, `max=${maxGroups}, ready=${readyCount}`);

console.log(`\n${pass} passed, ${fail} failed`);

// ---------- Bo sung: tinh huong chi danh cho nguoi di ung ----------
{
  const b = { population: "adult", pregnant: "no", penicillinAllergy: "no", renal: "normal" };
  const r1 = E.evaluate("v9-1", { ...b, severity: "mild", mdr: "no" });
  console.log((r1.status === "ready" && !/dị ứng/.test(r1.scenarioLabel) ? "PASS" : "FAIL") + "  Bàn chân ĐTĐ nhẹ, không dị ứng → tự chọn tình huống không phức tạp  — " + (r1.scenarioLabel || r1.status));
  const r2 = E.questionsFor("v9-1", { ...b, penicillinAllergy: "yes", severity: "mild", mdr: "no" }).find((q) => q.key === "scenario");
  console.log((r2 && r2.options.some((o) => /dị ứng/.test(o.value)) ? "PASS" : "FAIL") + "  Bàn chân ĐTĐ nhẹ, CÓ dị ứng → có tình huống dị ứng để chọn");
}
