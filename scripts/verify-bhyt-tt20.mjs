/*
  Kiểm tra data/bhyt-tt20.json so với PDF Thông tư 20/2022/TT-BYT:
  1. Đủ STT 1–1037.
  2. Mọi chữ (tên, đường dùng, ghi chú) có NGUYÊN VĂN trong lớp chữ PDF (so theo cụm 25 ký tự, bỏ khoảng trắng).
  3. Tổng số dấu "+" ở cột hạng (Phụ lục I) bằng tổng số hạng trích được.
  Chạy: LEAFLET_TOOLS=<tools> node scripts/verify-bhyt-tt20.mjs "<20_2022_TT-BYT.pdf>"
*/
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { getDocument } = await import(pathToFileURL(join(process.env.LEAFLET_TOOLS, "node_modules", "pdfjs-dist/legacy/build/pdf.mjs")).href);
const pdf = await getDocument({ data: new Uint8Array(readFileSync(process.argv[2])), verbosity: 0 }).promise;
const data = JSON.parse(readFileSync(join(ROOT, "data", "bhyt-tt20.json"), "utf8")).items;
const squash = (s) => String(s).normalize("NFC").replace(/\s+/g, "");
let raw = "", plus = 0;
for (let n = 11; n <= 83; n++) {
  const p = await pdf.getPage(n);
  const tc = await p.getTextContent();
  raw += squash(tc.items.map((i) => i.str).join(""));
  plus += tc.items.filter((i) => i.str.trim() === "+" && i.transform[4] >= 333 && i.transform[4] < 420).length;
  p.cleanup();
}
const stts = new Set(data.map((d) => d.stt));
const missing = Array.from({ length: 1037 }, (_, i) => i + 1).filter((i) => !stts.has(i));
let chunks = 0, bad = 0;
const report = [];
for (const d of data) {
  for (const t of [d.name, ...d.routes.flatMap((r) => [r.route, r.note])]) {
    const s = squash(t);
    for (let i = 0; i < s.length; i += 25) {
      const c = s.slice(i, i + 25);
      if (c.length < 6) continue;
      chunks++;
      if (!raw.includes(c)) { bad++; report.push(`${d.stt} ${d.name}: «${c}»`); }
    }
  }
}
const hang = data.reduce((a, d) => a + d.routes.reduce((b, r) => b + r.hang.filter(Boolean).length, 0), 0);
console.log(`Thuốc: ${data.length}; thiếu STT: ${missing.length ? missing.join(",") : "không"}`);
console.log(`Cụm chữ: ${chunks}; không khớp nguyên văn: ${bad}`);
console.log(`Dấu "+" trong PDF: ${plus}; hạng trích được: ${hang}; ${plus === hang ? "KHỚP" : "LỆCH"}`);
for (const r of report.slice(0, 60)) console.log("  " + r);
