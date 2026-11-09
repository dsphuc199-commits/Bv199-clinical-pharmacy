/*
  Trich noi dung To huong dan su dung (HDSD) cong bo tren Cong Cuc Quan ly Duoc.
  Dau vao : data/drug-registry.json (tao boi scripts/sync-dav-registry.cjs)
  Dau ra  : data/leaflets/<davId>.json  { sections: { chiDinh, lieuDung, ... }, method, confidence, ... }

  PDF co lop chu -> doc truc tiep; PDF scan -> OCR tieng Viet (Tesseract). Ket qua OCR co the sai
  (dac biet bang lieu), nen web app luon hien thi kem nhan "CAN THAM DINH" va link ban goc.

  Cong cu khong nam trong dependencies cua web app (tranh lam nang Vercel). Cai rieng:
    mkdir <TOOLS> && cd <TOOLS> && npm i tesseract.js@5.1.1 pdfjs-dist@5.3.31 @napi-rs/canvas@0.1.65
  Chay:
    LEAFLET_TOOLS=<TOOLS> LEAFLET_CACHE=<thu muc tam PDF> node scripts/extract-leaflets.mjs [--force] [--limit N]
*/
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOOLS = process.env.LEAFLET_TOOLS;
const CACHE = process.env.LEAFLET_CACHE || join(ROOT, ".leaflet-cache");
const OUT_DIR = join(ROOT, "data", "leaflets");
const MAX_PAGES = 40;
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
if (!TOOLS) { console.error("Thieu LEAFLET_TOOLS (thu muc da cai tesseract.js, pdfjs-dist, @napi-rs/canvas)"); process.exit(1); }

const mod = (p) => import(pathToFileURL(join(TOOLS, "node_modules", p)).href);
const { getDocument } = await mod("pdfjs-dist/legacy/build/pdf.mjs");
const { createCanvas } = await mod("@napi-rs/canvas/index.js");
const { createWorker } = await mod("tesseract.js/src/index.js");

mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

/* ---------- Tach muc theo cau truc HDSD (TT 01/2018/TT-BYT) va SmPC ---------- */
const plain = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();

// Thu tu quan trong: cum dai/cu the dat truoc.
const HEADINGS = [
  ["thanhPhan", /^(thanh phan|cong thuc)\b/],
  ["dangBaoChe", /^(dang bao che|mo ta san pham)\b/],
  ["chiDinh", /^chi dinh( dieu tri)?\b(?! *(va|,) *lieu)/],
  ["lieuDung", /^(lieu (dung|luong)|cach dung|lieu va cach dung|lieu luong va cach dung|cach dung,? lieu)/],
  ["chongChiDinh", /^chong chi dinh\b/],
  ["canhBao", /^(canh bao|than trong|nhung luu y|luu y (dac biet|khi dung)|canh bao va than trong)/],
  ["thaiKy", /^(su dung (thuoc )?(cho|o|trong) phu nu|phu nu co thai|thoi ky mang thai|thai ky|kha nang sinh san|mang thai)/],
  ["laiXe", /^(anh huong (cua thuoc )?(len|den|toi) kha nang lai xe|lai xe)/],
  ["tuongTac", /^tuong tac\b/],
  ["tuongKy", /^tuong ky\b/],
  ["tacDungPhu", /^(tac dung (khong mong muon|phu)|phan ung (co hai|bat loi|khong mong muon))/],
  ["quaLieu", /^qua lieu\b/],
  ["duocLuc", /^(dac tinh )?duoc luc hoc\b/],
  ["duocDong", /^(dac tinh )?duoc dong hoc\b/],
  ["dongGoi", /^(quy cach dong goi|dong goi)\b/],
  ["baoQuan", /^(dieu kien )?bao quan\b/],
  ["hanDung", /^han dung\b/],
];

export const SECTION_TITLES = {
  thanhPhan: "Thành phần", dangBaoChe: "Dạng bào chế", chiDinh: "Chỉ định", lieuDung: "Liều dùng và cách dùng",
  chongChiDinh: "Chống chỉ định", canhBao: "Cảnh báo và thận trọng", thaiKy: "Phụ nữ có thai và cho con bú",
  laiXe: "Ảnh hưởng lên khả năng lái xe, vận hành máy", tuongTac: "Tương tác thuốc", tuongKy: "Tương kỵ",
  tacDungPhu: "Tác dụng không mong muốn", quaLieu: "Quá liều và cách xử trí", duocLuc: "Dược lực học",
  duocDong: "Dược động học", dongGoi: "Quy cách đóng gói", baoQuan: "Bảo quản", hanDung: "Hạn dùng",
};

/* Chi coi la tieu de khi dong ngan va co dau hieu tieu de (IN HOA, danh so, hoac ket thuc bang ":"),
   tranh nham cau van thuong bat dau bang "Liều dùng ..." la tieu de muc. */
function headingKey(line) {
  const t = line.trim();
  if (t.length < 4 || t.length > 80) return null;
  const letters = t.replace(/[^\p{L}]/gu, "");
  const upper = letters.length > 3 && letters === letters.toUpperCase();
  const numbered = /^\s*(\d+(\.\d+)*[.)]?|[IVX]+\.)\s+\p{L}/u.test(t);
  const colon = /[:：]/.test(t) && t.indexOf(":") < 45;
  if (!upper && !numbered && !colon && t.length > 40) return null;
  if (!upper && !numbered && !colon && /[.;,]$/.test(t)) return null;
  const p = plain(t).replace(/^[\s\d.)\-–•*:ivx]+(?=[a-z])/, "").replace(/^[\s\d.)\-–•*:]+/, "").trim();
  for (const [key, re] of HEADINGS) if (re.test(p)) return key;
  return null;
}

const STOP = /^(tuq\.?|k\/?t\.? ?cuc truong|cuc truong|pho cuc truong|truong phong|p\.? ?truong phong|bo y te\b|cong hoa xa hoi|doc lap - tu do|cuc quan ly duoc|ten,? dia chi (cua )?(co so|nha san xuat)|(co so |nha )?san xuat (boi|tai)\b|nha san xuat\s*:|co so dang ky\s*:|doc ky huong dan su dung truoc khi dung|de xa tam tay tre em|ngay (xem xet|sua doi|cap nhat) (lai )?(noi dung )?(to )?huong dan)/;

function splitSections(text) {
  const found = {};
  let cur = null;
  let buf = [];
  const flush = () => {
    if (!cur) return;
    const body = buf
      .filter((l) => !/^\W{0,3}$/u.test(l.trim()) || l.trim() === "") // ky tu le do OCR
      .filter((l) => !/^(trang\s*)?\d{1,3}\s*\/\s*\d{1,3}$/i.test(l.trim())) // so trang "16/17"
      .map((l) => l.replace(/\s+[^\p{L}\p{N}\s(),.%°]{1,2}$/u, "").replace(/^\s*-\s*\.\s*/, "- "))
      .join("\n")
      // Noi dong bi ngat giua cau trong PDF (dong sau bat dau bang chu thuong) de doc tren dien thoai.
      .replace(/([^\n.:;!?])\n(?=[\p{Ll}(])/gu, "$1 ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    // Mot muc co the lap lai (ban cho nguoi benh + ban cho can bo y te): giu ban day du nhat.
    if (body.length > 15 && body.length > (found[cur]?.length ?? 0)) found[cur] = body;
  };
  for (const line of text.split("\n")) {
    // Ket thuc muc khi gap phan hanh chinh (con dau, ten co so, quoc hieu) de khong dinh rac vao noi dung.
    if (STOP.test(plain(line.trim()))) { flush(); cur = null; buf = []; continue; }
    const key = headingKey(line);
    if (key) {
      flush();
      cur = key;
      // Phan noi dung nam cung dong voi tieu de (vd. "Chỉ định: Điều trị ...").
      const rest = line.split(/[:：]/).slice(1).join(":").trim();
      buf = rest ? [rest] : [];
    } else if (cur) buf.push(line);
  }
  flush();
  for (const k of Object.keys(found)) found[k] = found[k].slice(0, 12000);
  return found;
}

/* ---------- Doc PDF: lop chu hoac OCR ---------- */
const OCR_WORKERS = Number(process.env.LEAFLET_WORKERS || 6);
const workers = await Promise.all(Array.from({ length: OCR_WORKERS }, () => createWorker("vie", 1, { cachePath: join(TOOLS, "tessdata") })));
const idle = [...workers];
const waiting = [];
async function ocr(png) {
  const w = idle.pop() ?? (await new Promise((r) => waiting.push(r)));
  try { return (await w.recognize(png)).data; } finally { const next = waiting.shift(); if (next) next(w); else idle.push(w); }
}

async function pdfToText(buf) {
  const pdf = await getDocument({ data: new Uint8Array(buf), verbosity: 0 }).promise;
  const n = Math.min(pdf.numPages, MAX_PAGES);
  const pages = [];
  const jobs = [];
  let ocrPages = 0;
  let confSum = 0;
  for (let i = 1; i <= n; i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    let lines = [];
    let lastY = null;
    for (const it of tc.items) {
      const y = Math.round(it.transform?.[5] ?? 0);
      if (lastY !== null && Math.abs(y - lastY) > 2) lines.push("\n");
      lines.push(it.str);
      lastY = y;
    }
    let text = lines.join("").replace(/[ \t]+/g, " ");
    if (text.replace(/\s/g, "").length < 80) {
      const viewport = page.getViewport({ scale: 2 });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
      const idx = i - 1;
      ocrPages++;
      jobs.push(ocr(canvas.toBuffer("image/png")).then((data) => { pages[idx] = data.text; confSum += data.confidence; }));
      text = "";
    }
    pages[i - 1] = text;
    page.cleanup();
  }
  await Promise.all(jobs);
  await pdf.destroy();
  return { text: pages.join("\n"), pages: n, totalPages: pdf.numPages, ocrPages, confidence: ocrPages ? Math.round(confSum / ocrPages) : null };
}

async function download(url, file) {
  if (existsSync(file)) return readFileSync(file);
  for (let a = 0; a < 3; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "BV199-Clinical-Pharmacy/1.0" }, signal: AbortSignal.timeout(120000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.subarray(0, 4).toString() !== "%PDF") throw new Error("not pdf");
      writeFileSync(file, buf);
      return buf;
    } catch (e) {
      if (a === 2) throw e;
      await new Promise((r) => setTimeout(r, 3000 * (a + 1)));
    }
  }
}

/* ---------- Chay ---------- */
const registry = JSON.parse(readFileSync(join(ROOT, "data", "drug-registry.json"), "utf8")).items;
const byDav = new Map();
for (const rec of Object.values(registry)) if (!rec.notFound && rec.hdsd?.length && !byDav.has(rec.davId)) byDav.set(rec.davId, rec);

let done = 0;
let failed = 0;
const ONLY = args.includes("--only") ? Number(args[args.indexOf("--only") + 1]) : null;
const todo = [...byDav.values()]
  .filter((r) => (ONLY ? r.davId === ONLY : FORCE || !existsSync(join(OUT_DIR, `${r.davId}.json`))))
  .slice(0, LIMIT);
console.log(`Can trich: ${todo.length} / ${byDav.size} thuoc co HDSD`);

for (const rec of todo) {
  const t0 = Date.now();
  try {
    let best = null;
    for (const [i, f] of rec.hdsd.entries()) {
      const buf = await download(f.url, join(CACHE, `${rec.davId}-${i}.pdf`));
      const txtFile = join(CACHE, `${rec.davId}-${i}.txt`);
      const r = existsSync(txtFile) && !FORCE ? JSON.parse(readFileSync(txtFile, "utf8")) : await pdfToText(buf);
      writeFileSync(txtFile, JSON.stringify(r)); // luu van ban tho de tach lai muc khong can OCR lai
      const sections = splitSections(r.text);
      const score = Object.keys(sections).length;
      if (!best || score > best.score) best = { ...r, sections, score, file: f };
    }
    const out = {
      davId: rec.davId,
      soDangKy: rec.soDangKy,
      tenThuoc: rec.tenThuoc,
      source: { title: best.file.title || "Tờ hướng dẫn sử dụng", url: best.file.url },
      method: best.ocrPages ? (best.ocrPages === best.pages ? "ocr" : "mixed") : "text",
      confidence: best.confidence,
      pages: best.pages,
      totalPages: best.totalPages,
      extractedAt: new Date().toISOString().slice(0, 10),
      reviewed: false,
      sections: best.sections,
      // Khong tach duoc muc nao: luu van ban tho de van tra cuu duoc.
      ...(best.score < 2 ? { rawText: best.text.slice(0, 30000) } : {}),
    };
    writeFileSync(join(OUT_DIR, `${rec.davId}.json`), JSON.stringify(out, null, 1));
    done++;
    console.log(`[${done + failed}/${todo.length}] ${rec.tenThuoc} | ${out.method} ${best.pages}tr | ${Object.keys(best.sections).length} muc | ${Math.round((Date.now() - t0) / 1000)}s`);
  } catch (e) {
    failed++;
    // Ghi nhan file loi tren cong Cuc QLD (vd. HTTP 500) de web app bao "khong mo duoc", khong thu lai moi lan.
    writeFileSync(join(OUT_DIR, `${rec.davId}.json`), JSON.stringify({ davId: rec.davId, soDangKy: rec.soDangKy, tenThuoc: rec.tenThuoc, failed: true, error: String(e.message).slice(0, 120), extractedAt: new Date().toISOString().slice(0, 10) }, null, 1));
    console.log(`[${done + failed}/${todo.length}] LOI ${rec.tenThuoc}: ${e.message}`);
  }
}
await Promise.all(workers.map((w) => w.terminate()));
await import("./build-leaflet-index.mjs"); // cap nhat chi muc cho trang danh sach
console.log(`Xong: ${done} thanh cong, ${failed} loi`);
