/*
  Luu ban sao To HDSD (PDF) tu Cong Cuc Quan ly Duoc vao kho file rieng tu cua web app (Vercel Blob, private),
  de nguoi dung xem HDSD ngay trong ung dung (khong phai mo Cong Cuc QLD).

  - File nho (<= 1.5 MB) giu nguyen ban goc.
  - File lon (thuong la ban scan): dung lai tung trang thanh anh JPEG do phan giai ~110 dpi -> PDF moi
    (doc ro, nhe hon nhieu). Neu ban nen khong nho hon thi giu ban goc.
  Ket qua: data/leaflet-files.json  { [davId]: [{ path, bytes, originalBytes, pages, compressed, title }] }

  Can: BLOB_READ_WRITE_TOKEN (trong .env.local sau "vercel env pull") va cong cu PDF cai rieng:
    cd <TOOLS> && npm i pdfjs-dist@5.3.31 @napi-rs/canvas@0.1.65 pdf-lib@1.17.1
  Chay: LEAFLET_TOOLS=<TOOLS> LEAFLET_CACHE=<thu muc PDF tam> node scripts/store-leaflet-pdfs.mjs [--force] [--limit N]
*/
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { put } from "@vercel/blob";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOOLS = process.env.LEAFLET_TOOLS;
const CACHE = process.env.LEAFLET_CACHE || join(ROOT, ".leaflet-cache");
const OUT = join(ROOT, "data", "leaflet-files.json");
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
const KEEP_ORIGINAL_BELOW = 1.5 * 1024 * 1024;
const MAX_PAGES = 80;
const SCALE = 1.55; // 72 dpi * 1.55 ~ 112 dpi
const JPEG_QUALITY = 60;

// Doc token tu .env.local (khong in ra man hinh).
if (!process.env.BLOB_READ_WRITE_TOKEN && existsSync(join(ROOT, ".env.local"))) {
  for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^BLOB_READ_WRITE_TOKEN=(.*)$/);
    if (m) process.env.BLOB_READ_WRITE_TOKEN = m[1].replace(/^"|"$/g, "");
  }
}
if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error("Thieu BLOB_READ_WRITE_TOKEN"); process.exit(1); }
if (!TOOLS) { console.error("Thieu LEAFLET_TOOLS"); process.exit(1); }

const mod = (p) => import(pathToFileURL(join(TOOLS, "node_modules", p)).href);
const { getDocument } = await mod("pdfjs-dist/legacy/build/pdf.mjs");
const { createCanvas } = await mod("@napi-rs/canvas/index.js");
const { PDFDocument } = await mod("pdf-lib/cjs/index.js");

async function download(url, file) {
  if (existsSync(file)) return readFileSync(file);
  for (let a = 0; a < 3; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "BV199-Clinical-Pharmacy/1.0" }, signal: AbortSignal.timeout(180000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.subarray(0, 4).toString() !== "%PDF") throw new Error("khong phai PDF");
      writeFileSync(file, buf);
      return buf;
    } catch (e) {
      if (a === 2 || /HTTP 5|HTTP 4/.test(e.message)) throw e;
      await new Promise((r) => setTimeout(r, 3000 * (a + 1)));
    }
  }
}

async function compress(buf) {
  const src = await getDocument({ data: new Uint8Array(buf), verbosity: 0 }).promise;
  const n = Math.min(src.numPages, MAX_PAGES);
  const out = await PDFDocument.create();
  for (let i = 1; i <= n; i++) {
    const page = await src.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: SCALE });
    const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const jpg = await out.embedJpg(canvas.toBuffer("image/jpeg", JPEG_QUALITY));
    const p = out.addPage([base.width, base.height]);
    p.drawImage(jpg, { x: 0, y: 0, width: base.width, height: base.height });
    page.cleanup();
  }
  const pages = src.numPages;
  await src.destroy();
  return { bytes: Buffer.from(await out.save()), pages, truncated: pages > n };
}

const registry = JSON.parse(readFileSync(join(ROOT, "data", "drug-registry.json"), "utf8")).items;
const result = existsSync(OUT) && !FORCE ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const byDav = new Map();
for (const rec of Object.values(registry)) if (!rec.notFound && rec.hdsd?.length && !byDav.has(rec.davId)) byDav.set(rec.davId, rec);
const todo = [...byDav.values()].filter((r) => !result[r.davId]).slice(0, LIMIT);
console.log(`Can luu: ${todo.length} / ${byDav.size} thuoc co HDSD`);

let done = 0;
let totalIn = 0;
let totalOut = 0;
for (const rec of todo) {
  const files = [];
  for (const [i, f] of rec.hdsd.entries()) {
    try {
      const orig = await download(f.url, join(CACHE, `${rec.davId}-${i}.pdf`));
      let body = orig;
      let pages = null;
      let compressed = false;
      if (orig.length > KEEP_ORIGINAL_BELOW) {
        const c = await compress(orig);
        pages = c.pages;
        if (c.bytes.length < orig.length * 0.8 && !c.truncated) { body = c.bytes; compressed = true; }
      }
      const path = `hdsd/${createHash("sha1").update(f.url).digest("hex").slice(0, 20)}.pdf`;
      await put(path, body, { access: "private", contentType: "application/pdf", addRandomSuffix: false, allowOverwrite: true });
      files.push({ path, bytes: body.length, originalBytes: orig.length, pages, compressed, title: f.title || "Tờ hướng dẫn sử dụng" });
      totalIn += orig.length;
      totalOut += body.length;
    } catch (e) {
      files.push({ error: String(e.message).slice(0, 100) });
    }
  }
  result[rec.davId] = files;
  done++;
  writeFileSync(OUT, JSON.stringify(result));
  const f0 = files[0];
  console.log(`[${done}/${todo.length}] ${rec.tenThuoc} | ${f0?.error ? "LOI " + f0.error : `${(f0.originalBytes / 1e6).toFixed(1)}MB -> ${(f0.bytes / 1e6).toFixed(1)}MB${f0.compressed ? " (nen)" : ""}`}`);
}
console.log(`Xong. Tong: ${(totalIn / 1e6).toFixed(0)}MB -> ${(totalOut / 1e6).toFixed(0)}MB`);
