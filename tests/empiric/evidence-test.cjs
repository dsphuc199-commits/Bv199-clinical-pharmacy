const EXP = require("./expected-status.cjs");
const load = require("./tsrun.cjs");
const E = load("lib/antibiotics/evidence-status.ts");
const R = load("data/antibiotics/empiric/regimens/index.ts");
const V = load("data/antibiotics/empiric/verification/official-dose-check.json");
const DE = load("data/antibiotics/empiric/evidence.ts");

let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${d ? "  — " + d : ""}`); };
const all = E.evaluateAll();
const by = (id) => all.find((e) => e.disease.id === id);
const s = E.summarize();

check("Tổng 69 mặt bệnh, không bỏ sót", all.length === 69 && s.VERIFIED_SOURCE + s.NEEDS_REVIEW + s.MISSING_EVIDENCE === 69, JSON.stringify(s));
const M = load("data/antibiotics/empiric/verification/manual-checks.ts");
check("Đối chiếu: mọi phương án lệch tự động đều đã đối chiếu thủ công", V.results.filter((r) => r.status === "mismatch").every((r) => M.manualCheckFor(r.id)), JSON.stringify(V.summary));

// Bat bien VERIFIED
const badVerified = all.filter((e) => e.status === "VERIFIED_SOURCE" && (e.verification.mismatch > 0 || e.verification.partial > 0 || e.reasons.length > 0));
check("VERIFIED: không lệch liều, không liều Dược thư chưa đối chiếu, không lý do thẩm định", badVerified.length === 0, badVerified.map((e) => e.disease.id).join(","));
const notOfficial = all.filter((e) => e.status === "VERIFIED_SOURCE" && R.getRegimensForDisease(e.disease.id).filter(R.isConcreteRegimen).some((r) => !["official-text-checked", "government-copy-checked"].includes(DE.DOC_EVIDENCE[r.source.doc].check)));
check("VERIFIED: mọi phương án có liều thuộc văn bản đã đối chiếu bản chính thức", notOfficial.length === 0, notOfficial.map((e) => e.disease.id).join(","));
check("NEEDS_REVIEW và MISSING_EVIDENCE luôn có lý do", all.filter((e) => e.status !== "VERIFIED_SOURCE").every((e) => e.reasons.length > 0));

// Van ban moi nhat / SUPERSEDED
const copd = by("v8-6");
check("COPD: QĐ 2767 mới nhất, QĐ 708 SUPERSEDED", copd.docs[0].number.startsWith("2767") && copd.docs.some((d) => d.role === "superseded" && d.number.startsWith("708")) && copd.superseded.length > 0);
const typh = by("v8-135");
check("Thương hàn: QĐ 5642 mới nhất, QĐ 708 SUPERSEDED", typh.docs[0].number.startsWith("5642") && typh.superseded.every((x) => x.doc === "byt708") && typh.superseded.length > 0);
const cap = by("v8-1");
check("CAP: QĐ 2147 mới nhất; QĐ 1493 (CAP nặng) SUPERSEDED; QĐ 1493 cũ vẫn áp dụng phần viêm phổi hít", cap.docs[0].number.startsWith("2147") && cap.superseded.length === 5 && cap.docs.some((d) => d.number.startsWith("1493") && d.role === "older-applied"));
check("CAP: module đối chiếu 25/25 với bản chính thức", cap.module && cap.module.match === cap.module.total && cap.module.total > 0, cap.module && `${cap.module.match}/${cap.module.total}`);
const men = by("v8-36");
check("Viêm màng não: giữ cả QĐ 5642 và QĐ 708 → NEEDS_REVIEW", men.status === "NEEDS_REVIEW" && men.reasons.some((r) => r.startsWith("Nhiều văn bản BYT")));
check("Bàn chân ĐTĐ: MISSING_EVIDENCE (nguồn không nêu liều)", by("v9-1").status === "MISSING_EVIDENCE");
check("Sepsis: NEEDS_REVIEW (liều Dược thư + cờ liều)", by("v8-11").status === "NEEDS_REVIEW");
check("v8-2: NEEDS_REVIEW – phác đồ BYT chỉ bao phủ một phần hội chứng (ESBL đã tách)", by("v8-2").status === "NEEDS_REVIEW" && by("v8-2").reasons.some((r) => r.includes("chỉ bao phủ một phần")));
check("v8-14: NEEDS_REVIEW do ô thuốc thiếu tên trong bản in", by("v8-14").status === "NEEDS_REVIEW");
check("Nấm (QĐ 3429, bản Sở Y tế Gia Lai): VERIFIED", ["v8-3", "v8-50", "v8-51"].every((id) => by(id).status === "VERIFIED_SOURCE"));
check("Cryptococcus ngoài TKTW: NEEDS_REVIEW vì có phương án không nêu liều", by("v8-128").status === "NEEDS_REVIEW");
check("Áp xe da (QĐ 4416 bản ký số): VERIFIED, QĐ 708 SUPERSEDED", by("v8-28").status === "VERIFIED_SOURCE" && by("v8-28").superseded.length > 0);
check("Lao màng não (QĐ 162): NEEDS_REVIEW – thiếu liều streptomycin trẻ em", by("v8-141").status === "NEEDS_REVIEW" && by("v8-141").reasons.some((r) => r.includes("streptomycin")));
check("Lao phổi (QĐ 162): VERIFIED nhờ liều Phụ lục 6 CÙNG văn bản, có ghi chú bổ sung", by("v8-142").status === "VERIFIED_SOURCE" && by("v8-142").notes.some((n) => n.includes("CÙNG văn bản")));
check("Viêm họng liên cầu: VERIFIED theo CDC, có ghi chú liều quốc tế", ["v8-8", "v8-54"].every((id) => by(id).status === "VERIFIED_SOURCE" && by(id).notes.some((n) => n.includes("CDC"))));
check("Viêm xoang, viêm tai giữa (module chưa đối chiếu lại): NEEDS_REVIEW", ["v8-7", "v8-58", "v8-60", "v8-99"].every((id) => by(id).status === "NEEDS_REVIEW"));
check("Không mặt bệnh nào ở trạng thái SUPERSEDED (chỉ áp dụng cho nội dung)", all.every((e) => e.status !== "SUPERSEDED"));

console.log(`\n${pass} passed, ${fail} failed`);
