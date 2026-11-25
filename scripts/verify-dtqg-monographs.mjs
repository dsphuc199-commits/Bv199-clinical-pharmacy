/*
  Kiem tra do trung thuc cua data/dtqg/*.json so voi lop chu PDF Duoc thu quoc gia 2023.
  Moi doan/o bang da trich duoc cat thanh cum 30 ky tu (bo khoang trang); moi cum phai co NGUYEN VAN trong chu cua cac
  trang chuyen luan (bo khoang trang). Cum khong khop -> in ra de doi chieu anh trang goc.
  Chay: LEAFLET_TOOLS=<tools> node scripts/verify-dtqg-monographs.mjs "<Duoc thu 2023.pdf>"
*/
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { getDocument } = await import(pathToFileURL(join(process.env.LEAFLET_TOOLS, "node_modules", "pdfjs-dist/legacy/build/pdf.mjs")).href);
const pdf = await getDocument({ data: new Uint8Array(readFileSync(process.argv[2])), verbosity: 0 }).promise;
/* "m²" trong PDF là "m" + chữ số mũ riêng: so sánh không phân biệt ký tự mũ. */
const squash = (s) => String(s).normalize("NFC").replace(/²/g, "2").replace(/³/g, "3").replace(/\s+/g, "");
const pageText = new Map();
/* Chu trang theo THU TU DOC (cot trai -> cot phai, tren -> duoi, trai -> phai), bo tieu de chay va so trang –
   cung quy tac voi buoc trich; chi so ky tu mu (², ³) nam lech dong duoc gop vao dong gan nhat. */
async function textOf(n) {
  if (!pageText.has(n)) {
    const p = await pdf.getPage(n);
    const { width: W, height: H } = p.getViewport({ scale: 1 });
    const tc = await p.getTextContent();
    const items = tc.items.filter((i) => i.str && i.str.trim() && i.transform[5] < H - 52 && i.transform[5] > 36)
      .map((i) => ({ x: i.transform[4], y: i.transform[5], h: Math.abs(i.transform[3]) || 9, w: i.width || 0, s: i.str }));
    const hs = items.map((i) => i.h).sort((a, b) => a - b);
    const medH = hs[Math.floor(hs.length / 2)] || 10;
    const rows = [];
    for (const it of items.sort((a, b) => b.h - a.h)) {
      const col = it.x + it.w / 2 < W / 2 ? 0 : 1;
      const r = rows.filter((q) => q.col === col && Math.abs(q.y - it.y) < medH * 0.9).sort((a, b) => Math.abs(a.y - it.y) - Math.abs(b.y - it.y))[0];
      if (r) r.parts.push(it); else rows.push({ col, y: it.y, parts: [it] });
    }
    rows.sort((a, b) => a.col - b.col || b.y - a.y);
    pageText.set(n, { flow: squash(rows.map((r) => r.parts.sort((a, b) => a.x - b.x).map((q) => q.s).join("")).join("")), stream: squash(tc.items.map((i) => i.str).join("")) });
    p.cleanup();
  }
  return pageText.get(n);
}
/* Từ tiếng Việt hỏng do lớp chữ PDF lệch dấu (kiểm tra nguyên văn không bắt được vì PDF cũng hỏng như vậy):
   một âm tiết có từ 2 dấu thanh ("dầụ", "thậần", "khuẩnễ"), hoặc chữ có dấu thanh đứng riêng ("ễ") – trừ các từ
   một chữ hợp lệ: ở, ý (chú ý), ổ (ổ bụng), ù (ù tai), ợ (ợ hơi), ứ (ứ mật), ồ, Á (châu Á), ủ (ủ bệnh). */
const TONE = /[àáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/giu;
const ONE_OK = new Set(["ở", "ý", "ổ", "ù", "ợ", "ứ", "ồ", "á", "ủ"]);
const badWord = (w) => (w.match(TONE) || []).length >= 2 || (w.length === 1 && (w.match(TONE) || []).length === 1 && !ONE_OK.has(w.toLowerCase()));
const dir = join(ROOT, "data", "dtqg");
let chunks = 0, bad = 0;
const report = [];
/* Mục chưa đạt: ẩn chữ trên trang thuốc, chỉ chỉ số trang Dược thư. */
const review = {};
const flag = (id, sec) => { review[id] = Array.from(new Set([...(review[id] ?? []), sec])); };
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const m = JSON.parse(readFileSync(join(dir, f), "utf8"));
  let flow = "", stream = "";
  for (let n = m.pages.pdf[0]; n <= m.pages.pdf[1]; n++) { const t = await textOf(n); flow += t.flow; stream += t.stream; }
  const raw = { includes: (c) => flow.includes(c) || stream.includes(c) };
  for (const [sec, blocks] of Object.entries(m.sections)) {
    const texts = blocks.flatMap((b) => (b.t === "p" ? [b.runs.map((r) => r.text).join("")] : b.t === "table" ? b.rows.flat().map((c) => c.text) : []));
    if (blocks.some((b) => b.t === "img")) flag(m.id, sec); // công thức dạng ảnh: chưa kiểm được bằng chữ
    for (const t of texts) {
      const s = squash(t);
      for (let i = 0; i < s.length; i += 30) {
        const c = s.slice(i, i + 30);
        if (c.length < 8) continue;
        chunks++;
        if (!raw.includes(c)) { bad++; report.push(`${m.id} / ${sec}: «${c}»`); flag(m.id, sec); }
      }
      const words = t.normalize("NFC").split(/[^\p{L}]+/u).filter((w) => { TONE.lastIndex = 0; return badWord(w); });
      if (words.length) { report.push(`${m.id} / ${sec}: từ hỏng ${words.slice(0, 5).join(" ")}`); flag(m.id, sec); }
    }
  }
}
writeFileSync(join(ROOT, "data", "dtqg-review.json"), JSON.stringify({ note: "Mục chưa đạt kiểm tra nguyên văn hoặc có từ hỏng dấu – ẩn chữ, chỉ số trang.", items: review }, null, 1));
const nSec = Object.values(review).reduce((a, v) => a + v.length, 0);
console.log(`Cum kiem tra: ${chunks}; khong khop nguyen van: ${bad} (${((bad / Math.max(1, chunks)) * 100).toFixed(3)}%); muc an: ${nSec} o ${Object.keys(review).length} chuyen luan`);
for (const r of report.slice(0, 400)) console.log("  " + r);
