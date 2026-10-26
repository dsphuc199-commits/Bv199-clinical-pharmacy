// Unit test Buoc 4D.3 – cong phe duyet o tang engine. Chay: PROJ=<repo> node gate-4d3-test.cjs
const load = require("./tsrun.cjs");
const SE = load("lib/antibiotics/selection-engine.ts");
const RC = load("lib/calculations/renal.ts");
let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${!ok && d ? "  — " + JSON.stringify(d).slice(0, 300) : ""}`); };
const base = { population: "adult", pregnant: "no", penicillinAllergy: "no", renal: "normal", micro: "none" };

const col = SE.evaluate("v8-116", { ...base, scenario: "Nhiễm khuẩn nặng đe dọa tính mạng do Gram-âm kháng carbapenem" });
check("Engine: kết quả có approval = NOT_APPROVED", col.status === "ready" && col.approval === "NOT_APPROVED", col.approval);
check("Engine: clinicalUse = clinician-decision-required (không tự động áp dụng)", col.clinicalUse === "clinician-decision-required");
const opts = col.groups.flatMap((g) => g.options);
check("Engine: mọi phương án còn lại approved = false", opts.every((o) => o.approved === false));
check("Engine (4D.4): colistin 6 MIU bị khóa – không nằm trong nhóm đề xuất, có trong danh sách loại", !opts.some((o) => o.id === "r-fn-add-colistin") && col.excluded.some((e) => /ĐÃ KHÓA ĐỀ XUẤT TỰ ĐỘNG/.test(e.reason)));
check("Engine: có phương án bị khóa → certainty 'limited' và giới hạn nêu lý do", col.certainty === "limited" && col.limits.some((l) => /bị khóa đề xuất tự động/.test(l)));

const fn = SE.evaluate("v8-116", { ...base, scenario: "Sốt giảm bạch cầu hạt trung tính nguy cơ cao – khởi đầu" });
check("Engine: phương án không có cảnh báo nguy cơ cao → requiresReview = false", fn.status === "ready" && fn.groups.flatMap((g) => g.options).every((o) => o.requiresReview === false));
check("Engine: vẫn NOT_APPROVED dù không có cảnh báo nguy cơ cao", fn.approval === "NOT_APPROVED" && fn.clinicalUse === "clinician-decision-required");

const cap = SE.evaluate("v8-1", { population: "adult" });
check("Engine: kết quả chưa đủ dữ liệu không mang trạng thái 'ready'", cap.status !== "ready" || cap.approval === "NOT_APPROVED", cap.status);

const sab = SE.evaluate("v8-13", { ...base, scenario: "Staphylococcus aureus nhạy methicilin (MSSA)" });
check("Engine: S. aureus mang checklist, không có thời gian mặc định 14 ngày", sab.status === "ready" && sab.groups.flatMap((g) => g.options).every((o) => o.alerts.some((a) => a.checklist?.length === 8) && !/14 ngày/.test(o.duration)));

// Ham tinh than – xac nhan cac gia tri bien can duoc chan o giao dien (khong sua cong thuc)
check("renal.ts: calculateCrClCG trả 0 khi tuổi ≥ 140 (giá trị sentinel → giao diện phải chặn)", RC.calculateCrClCG(150, 60, 1, "male") === 0);
check("renal.ts: calculateIBW = 0 khi chiều cao rất thấp (→ giao diện phải chặn)", RC.calculateIBW("male", 80) === 0);
check("renal.ts: Cockcroft-Gault giá trị chuẩn (60 tuổi, 70 kg, SCr 1, nam) ≈ 77,8", Math.abs(RC.calculateCrClCG(60, 70, 1, "male") - 77.78) < 0.1);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
