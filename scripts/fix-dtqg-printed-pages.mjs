/*
  Số trang in của chuyên luận Dược thư = số in trên tiêu đề chạy đầu trang (độ lệch trang PDF/trang in thay đổi trong
  sách: đầu sách +6, nửa sau +5). Đọc số đó từ chính trang PDF và ghi lại pages.printed cho data/dtqg/*.json và
  data/dtqg-index.json.
  Chạy: LEAFLET_TOOLS=<tools> node scripts/fix-dtqg-printed-pages.mjs "<Duoc thu 2023.pdf>"
*/
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { getDocument } = await import(pathToFileURL(join(process.env.LEAFLET_TOOLS, "node_modules", "pdfjs-dist/legacy/build/pdf.mjs")).href);
const pdf = await getDocument({ data: new Uint8Array(readFileSync(process.argv[2])), verbosity: 0 }).promise;

const cache = new Map();
/** Số trang in đọc từ tiêu đề chạy (vùng trên cùng) hoặc chân trang; không đọc được thì null. */
async function printedOf(n) {
  if (cache.has(n)) return cache.get(n);
  const p = await pdf.getPage(n);
  const H = p.getViewport({ scale: 1 }).height;
  const tc = await p.getTextContent();
  const edge = tc.items.filter((i) => i.str.trim() && (i.transform[5] >= H - 52 || i.transform[5] <= 36));
  const nums = edge.map((i) => i.str.trim().match(/^(\d{1,4})(?!\d)/)?.[1]).filter(Boolean).map(Number).filter((x) => x - n >= 4 && x - n <= 7); // trang in = trang PDF + 4…7
  p.cleanup();
  const v = nums.length ? nums[0] : null;
  cache.set(n, v);
  return v;
}

const dir = join(ROOT, "data", "dtqg");
const fixed = new Map();
let changed = 0, unread = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const m = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const [a, b] = m.pages.pdf;
  const pa = await printedOf(a), pb = await printedOf(b);
  if (pa == null || pb == null) { unread++; console.log("Khong doc duoc so trang:", m.id, a, b); continue; }
  const printed = [pa, pb];
  if (printed.join() !== m.pages.printed.join()) { changed++; m.pages.printed = printed; writeFileSync(join(dir, f), JSON.stringify(m)); }
  fixed.set(m.id, printed);
}
const idxFile = join(ROOT, "data", "dtqg-index.json");
const idx = JSON.parse(readFileSync(idxFile, "utf8"));
for (const it of idx.items) if (fixed.has(it.id)) it.pages.printed = fixed.get(it.id);
writeFileSync(idxFile, JSON.stringify(idx, null, 1));
console.log(`Da sua ${changed} chuyen luan; khong doc duoc ${unread}`);
