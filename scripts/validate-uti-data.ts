/*
  Kiểm tra dữ liệu module nhiễm khuẩn tiết niệu.
  Chạy: npm run validate:uti
  Đối chiếu thêm với văn bản trích từ nguồn: UTI_SOURCE_TXT=<đường dẫn> npm run validate:uti
*/
import { existsSync, readFileSync } from "node:fs";
import { z } from "zod";
import { CONDITIONS } from "../data/uti-antibiotics/conditions";
import { REGIMENS } from "../data/uti-antibiotics/regimens";
import { UTI_BRIEFS } from "../data/uti-antibiotics/briefs";
import { UTI_CONFIG } from "../data/uti-antibiotics/config";
import { ConditionSchema, RegimenSchema } from "../data/uti-antibiotics/types";

const FORBIDDEN = /trang\s*\d+|pdf|văn bản|xem (bảng|mục|phần)|như (đã )?nêu|\.docx?|file/i;
const errors: string[] = [];
const fail = (m: string) => errors.push(m);

for (const [name, schema, rows] of [["condition", ConditionSchema, CONDITIONS], ["regimen", RegimenSchema, REGIMENS]] as const) {
  const res = z.array(schema as z.ZodTypeAny).safeParse(rows);
  if (!res.success) fail(`Schema ${name}: ${res.error.message}`);
}

const dup = (ids: string[]) => ids.filter((x, i) => ids.indexOf(x) !== i);
for (const id of dup(CONDITIONS.map((c) => c.id))) fail(`Trùng id condition: ${id}`);
for (const id of dup(REGIMENS.map((r) => r.id))) fail(`Trùng id regimen: ${id}`);

const condIds = new Set(CONDITIONS.map((c) => c.id));
for (const r of REGIMENS) if (!condIds.has(r.conditionId)) fail(`Regimen mồ côi: ${r.id} -> ${r.conditionId}`);
for (const c of CONDITIONS) {
  const n = REGIMENS.filter((r) => r.conditionId === c.id).length;
  if (!c.noSpecificRegimen && n === 0) fail(`Thể bệnh không có phác đồ: ${c.id}`);
  if (c.noSpecificRegimen && n > 0) fail(`Thể bệnh đánh dấu không có phác đồ nhưng có dữ liệu: ${c.id}`);
  if (c.noSpecificRegimen && c.notes.length === 0) fail(`Thể bệnh không có nội dung hiển thị: ${c.id}`);
}

const scan = (where: string, v: string | null) => { if (v && FORBIDDEN.test(v)) fail(`Chuỗi cấm tại ${where}: ${v}`); };
for (const c of CONDITIONS) {
  for (const k of ["name", "nameEn", "group", "form", "classification", "severity", "population", "choiceRule"] as const) scan(`${c.id}.${k}`, c[k]);
  c.notes.forEach((n, i) => scan(`${c.id}.notes[${i}]`, n));
}
for (const r of REGIMENS) {
  for (const k of ["antibiotic", "dose", "route", "interval", "duration", "applicability", "note"] as const) scan(`${r.id}.${k}`, r[k]);
}
for (const [k, v] of Object.entries(UTI_CONFIG)) for (const s of typeof v === "string" ? [v] : v) scan(`config.${k}`, s);
const briefPoints = Object.entries(UTI_BRIEFS).flatMap(([site, list]) => list.flatMap((b) => b.points.map((p) => ({ site, label: b.label, p }))));
for (const b of briefPoints) { scan(`brief.${b.site}.${b.label}`, b.label); scan(`brief.${b.site}.${b.label}`, b.p); }
for (const site of new Set(CONDITIONS.map((c) => c.group))) if (!UTI_BRIEFS[site]?.length) fail(`Thiếu tổng quan: ${site}`);
for (const site of Object.keys(UTI_BRIEFS)) if (!CONDITIONS.some((c) => c.group === site)) fail(`Tổng quan mồ côi: ${site}`);

/* Mọi con số trong liều, thời gian, khoảng cách liều phải có trong đoạn nguồn. */
const nums = (s: string) => s.match(/\d+(?:[.,]\d+)?/g) ?? [];
for (const r of REGIMENS) {
  const src = new Set(nums(r.sourceText));
  for (const k of ["dose", "interval", "duration"] as const) for (const n of nums(r[k] ?? "")) if (!src.has(n)) fail(`${r.id}.${k}: số ${n} không có trong đoạn nguồn`);
}

/* Đối chiếu đoạn nguồn với văn bản trích (không bắt buộc). */
/* Chuẩn hóa ký hiệu độ C và lỗi chính tả tên vi khuẩn của bản trích trước khi so khớp. */
const canon = (s: string) => s.replace(/°\s*C/g, "oC").replace(/(\d\d)0C\b/g, "$1oC").replace(/Staphylococus/g, "Staphylococcus").replace(/Pseudomoras/g, "Pseudomonas");
const squash = (s: string) => canon(s).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const srcPath = process.env.UTI_SOURCE_TXT;
let matched: number | null = null;
if (srcPath && existsSync(srcPath)) {
  /* Bỏ dòng chỉ có số trang chen giữa đoạn văn. */
  const hay = squash(readFileSync(srcPath, "utf8").replace(/^\s*\d{1,3}\s*$/gm, ""));
  matched = 0;
  for (const text of new Set(REGIMENS.map((r) => r.sourceText))) {
    if (hay.includes(squash(text))) matched++;
    else fail(`Đoạn nguồn không khớp: ${text.slice(0, 90)}`);
  }
  for (const b of briefPoints) if (!hay.includes(squash(b.p))) fail(`Tổng quan không khớp nguồn: ${b.p.slice(0, 90)}`);
}

if (errors.length) { console.error(errors.join("\n")); console.error(`\nFAIL: ${errors.length} lỗi`); process.exit(1); }
console.log(`PASS: ${CONDITIONS.length} thể bệnh, ${REGIMENS.length} phác đồ.${matched === null ? " Chưa đối chiếu văn bản trích (không đặt UTI_SOURCE_TXT)." : ` Đoạn nguồn khớp: ${matched}/${new Set(REGIMENS.map((r) => r.sourceText)).size}.`}`);
