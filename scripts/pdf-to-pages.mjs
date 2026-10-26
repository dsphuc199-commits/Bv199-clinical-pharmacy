/*
  Trich van ban PDF theo trang (dung cho scripts/verify-official-doses.mjs).
  Can pdfjs-dist (khong phai phu thuoc cua du an):
    npx -y -p pdfjs-dist@4.10.38 node scripts/pdf-to-pages.mjs <file.pdf> > <ma-van-ban>.txt
*/

import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/pdf-to-pages.mjs <file.pdf>");
  process.exit(1);
}

const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), verbosity: 0 }).promise;

for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const content = await page.getTextContent();
  const rows = new Map();
  for (const item of content.items) {
    if (!("str" in item) || !item.str.trim()) continue;
    const y = Math.round(item.transform[5]);
    const key = [...rows.keys()].find((k) => Math.abs(k - y) <= 2) ?? y;
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key).push({ x: item.transform[4], s: item.str });
  }
  console.log(`===== PDF PAGE ${p} / ${doc.numPages} =====`);
  for (const y of [...rows.keys()].sort((a, b) => b - a)) {
    console.log(rows.get(y).sort((a, b) => a.x - b.x).map((i) => i.s).join(" | "));
  }
}
