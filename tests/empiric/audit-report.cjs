// Sinh bao cao kiem toan 69 mat benh x 20 muc tu du lieu that: npm run audit:empiric
// Ghi ra docs/empiric/AUDIT.md (khong sua du lieu).
const fs = require("fs"), path = require("path");
const load = require("./tsrun.cjs");
const ROOT = path.resolve(__dirname, "..", "..");
const P = load("lib/antibiotics/disease-profile.ts");
const E = load("lib/antibiotics/evidence-status.ts");
const R = load("data/antibiotics/empiric/regimens/index.ts");
const A = load("data/antibiotics/empiric/safety-alerts.ts");

const all = P.allProfiles();
const keys = all[0].fields.map((f) => f.key);
const labels = Object.fromEntries(all[0].fields.map((f) => [f.key, f.label]));
const MARK = { available: "✓", partial: "◐", mentioned: "•", missing: "–" };
const s = E.summarize();
const shown = all.flatMap((p) => R.getRegimensForDisease(p.id));
const uniqShown = Array.from(new Map(shown.map((r) => [r.id, r])).values());
const dosed = uniqShown.filter(R.isConcreteRegimen);
const blocked = uniqShown.filter((r) => A.autoRecommendBlocks(r.id).length > 0);

let md = `# Kiểm toán module Kháng sinh kinh nghiệm\n\n`;
md += `Sinh tự động bằng \`npm run audit:empiric\` ngày ${new Date().toISOString().slice(0, 10)} từ dữ liệu trong mã nguồn. Không chỉnh tay.\n\n`;
md += `## Tổng quan\n\n`;
md += `| Chỉ số | Giá trị |\n|---|---|\n`;
md += `| Mặt bệnh | ${s.total} |\n| VERIFIED_SOURCE / NEEDS_REVIEW / MISSING_EVIDENCE | ${s.VERIFIED_SOURCE} / ${s.NEEDS_REVIEW} / ${s.MISSING_EVIDENCE} |\n| APPROVED_FOR_CLINICAL_USE | ${s.APPROVED_FOR_CLINICAL_USE} |\n`;
const DS = load("data/antibiotics/empiric/dose-supplements.ts");
const de = DS.doseEvidenceSummary(uniqShown);
const I = load("data/antibiotics/empiric/international.ts");
const intlDiseases = all.filter((p) => (I.getIntlEntry(p.id)?.guidelineIds.length ?? 0) > 0).length;
const intlReviewed = all.filter((p) => !!I.getIntlEntry(p.id)).length;
md += `| Phương án BYT gốc (toàn bộ) | ${R.ALL_REGIMENS.length} |\n| Phương án đang hiển thị (không tính bị thay thế) | ${uniqShown.length} |\n| Có liều nguyên văn trong văn bản | ${dosed.length} |\n| Có liều bổ sung có dẫn nguồn (cùng văn bản / quốc tế) | ${de.SUPPLEMENTED} |\n| MISSING_DOSE_EVIDENCE (không đề xuất liều) | ${de.MISSING_DOSE_EVIDENCE} |\n| Phương án khóa đề xuất tự động | ${blocked.length} |\n`;
md += `| Mặt bệnh đã rà soát quốc tế (có mục) / có guideline quốc tế | ${intlReviewed} / ${intlDiseases} |\n| Guideline quốc tế đã đăng ký | ${Object.keys(I.INTL_GUIDELINES).length} |\n`;
md += `| Độ phủ trung bình | ${(all.reduce((a, p) => a + p.coverage, 0) / all.length).toFixed(1)} / 20 mục |\n\n`;

md += `## Độ phủ theo mục\n\n| Mục | ✓ | ◐ | • | – |\n|---|---|---|---|---|\n`;
for (const k of keys) {
  const c = { available: 0, partial: 0, mentioned: 0, missing: 0 };
  for (const p of all) c[p.fields.find((f) => f.key === k).status]++;
  md += `| ${labels[k]} | ${c.available} | ${c.partial} | ${c.mentioned} | ${c.missing} |\n`;
}
md += `\n✓ có dữ liệu · ◐ một phần · • có đề cập trong nguồn · – chưa có (không tự suy diễn)\n\n`;

md += `## Theo mặt bệnh (sắp theo độ phủ tăng dần)\n\n| Mã | Mặt bệnh | Trạng thái | Độ phủ | ${keys.map((k, i) => i + 1).join(" | ")} |\n|---|---|---|---|${keys.map(() => "---").join("|")}|\n`;
for (const p of all.slice().sort((a, b) => a.coverage - b.coverage)) {
  const st = E.evidenceFor(p.id)?.status ?? "";
  md += `| ${p.id} | ${p.title} | ${st} | ${p.coverage}/20 | ${p.fields.map((f) => MARK[f.status]).join(" | ")} |\n`;
}
md += `\nCột 1–20: ${keys.map((k, i) => `${i + 1}. ${labels[k]}`).join("; ")}.\n`;

const out = path.join(ROOT, "docs", "empiric", "AUDIT.md");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, md);
console.log("Đã ghi", path.relative(ROOT, out), "–", all.length, "mặt bệnh");
