/*
  Trich phan "hieu chinh lieu o nguoi suy than" tu Duoc thu quoc gia Viet Nam (lan xuat ban thu ba, 2023)
  cho cac thuoc trong danh muc BV199 + khang sinh uu tien quan ly theo QD 5631/QD-BYT (Phu luc 2).

  Ket qua la VAN BAN NGUYEN VAN co cau truc (khong dien giai, khong tu suy ra lieu):
    - doan van: giu chu dam / nghieng nhu ban goc, ngat doan theo ban goc;
    - bang: dung lai tu duong ke bang tren trang (nhan dien duong ke tren anh trang), dat chu vao dung o,
      ho tro o gop (rowspan/colspan);
    - chong chi dinh / than trong lien quan than: cau nguyen van.
  Kem anh cat trang goc de doi chieu.

  Dau ra: data/renal-dtqg.json, public/duoc-thu/*.webp
  Can: pdfjs-dist + @napi-rs/canvas (LEAFLET_TOOLS), sharp (dependency cua du an).
  Chay: LEAFLET_TOOLS=<tools> node scripts/build-renal-dtqg.mjs "<Duoc thu 2023.pdf>" [--only ten] [--no-images]
*/
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOOLS = process.env.LEAFLET_TOOLS;
const PDF = process.argv[2];
const args = process.argv.slice(3);
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1].toLowerCase() : null;
if (!TOOLS || !PDF) { console.error("Thieu LEAFLET_TOOLS hoac duong dan PDF"); process.exit(1); }

const mod = (p) => import(pathToFileURL(join(TOOLS, "node_modules", p)).href);
const { getDocument } = await mod("pdfjs-dist/legacy/build/pdf.mjs");
const { createCanvas } = await mod("@napi-rs/canvas/index.js");

const OUT_IMG = join(ROOT, "public", "duoc-thu");
mkdirSync(OUT_IMG, { recursive: true });
const plain = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
const key = (s) => plain(s).replace(/\([^)]*\)?/g, " ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const slug = (s) => key(s).replace(/ /g, "-");

const pdf = await getDocument({ data: new Uint8Array(readFileSync(PDF)), verbosity: 0 }).promise;
const PAGE_OFFSET = 6; // trang in = trang PDF + 6 (da doi chieu: PDF tr. 202 = trang in 208)
const S = 2; // ti le dung anh de nhan dien duong ke bang

/* =================== Doc trang: chu (co kieu chu) + bang =================== */
const pageCache = new Map();
async function readPage(n) {
  if (pageCache.has(n)) return pageCache.get(n);
  const page = await pdf.getPage(n);
  const vp = page.getViewport({ scale: 1 });
  const W = vp.width, H = vp.height, mid = W / 2;
  const tc = await page.getTextContent();
  await page.getOperatorList();
  const style = {};
  const styleOf = (f) => {
    if (style[f]) return style[f];
    let name = "";
    try { name = page.commonObjs.get(f)?.name || ""; } catch { /* */ }
    return (style[f] = { b: /Bold|Black|Heavy/i.test(name), i: /Italic|Oblique/i.test(name) });
  };
  const raw = tc.items.filter((it) => it.str && it.str.trim()).map((it) => ({
    x: it.transform[4], y: it.transform[5], w: it.width || 0, h: Math.abs(it.transform[3]) || 9, s: it.str, ...styleOf(it.fontName),
  }));
  // Bo tieu de chay dau trang va so trang cuoi trang.
  const items = raw.filter((i) => i.y < H - 52 && i.y > 36);
  const hs = items.map((i) => i.h).sort((a, b) => a - b);
  const medH = hs[Math.floor(hs.length / 2)] || 10;

  /* ---- Nhan dien duong ke bang tren anh trang ---- */
  const vpS = page.getViewport({ scale: S });
  const canvas = createCanvas(Math.ceil(vpS.width), Math.ceil(vpS.height));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vpS }).promise;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const CW = canvas.width, CH = canvas.height;
  // Duong ke manh (0,5 pt) khi dung anh co mau xam -> nguong 175.
  const dark = (x, y) => { const o = (y * CW + x) * 4; return img.data[o] < 175 && img.data[o + 1] < 175 && img.data[o + 2] < 175; };
  const hSeg = [], vSeg = [];
  const MIN_H = 70 * S, MIN_V = 14 * S;
  for (let y = 0; y < CH; y++) {
    let run = 0;
    for (let x = 0; x <= CW; x++) {
      if (x < CW && dark(x, y)) run++;
      else { if (run >= MIN_H) hSeg.push({ y, x0: x - run, x1: x - 1 }); run = 0; }
    }
  }
  for (let x = 0; x < CW; x++) {
    let run = 0;
    for (let y = 0; y <= CH; y++) {
      if (y < CH && dark(x, y)) run++;
      else { if (run >= MIN_V) vSeg.push({ x, y0: y - run, y1: y - 1 }); run = 0; }
    }
  }
  // Gop cac duong day (nhieu pixel) thanh 1.
  const mergeH = [];
  for (const s of hSeg.sort((a, b) => a.y - b.y || a.x0 - b.x0)) {
    const m = mergeH.find((q) => Math.abs(q.y - s.y) <= 3 && s.x0 <= q.x1 + 4 && s.x1 >= q.x0 - 4);
    if (m) { m.x0 = Math.min(m.x0, s.x0); m.x1 = Math.max(m.x1, s.x1); m.y = (m.y + s.y) / 2; } else mergeH.push({ ...s });
  }
  const mergeV = [];
  for (const s of vSeg.sort((a, b) => a.x - b.x || a.y0 - b.y0)) {
    const m = mergeV.find((q) => Math.abs(q.x - s.x) <= 3 && s.y0 <= q.y1 + 4 && s.y1 >= q.y0 - 4);
    if (m) { m.y0 = Math.min(m.y0, s.y0); m.y1 = Math.max(m.y1, s.y1); m.x = (m.x + s.x) / 2; } else mergeV.push({ ...s });
  }
  // Nhom duong ke thanh bang: cac duong ngang chong lan theo x va duoc noi boi duong doc.
  // Hai duong ngang lien tiep cung 1 bang CHI KHI co duong doc noi lien khoang giua chung
  // (tranh gop cac bang dung sat nhau cung doan van o giua).
  const tables = [];
  for (const h of mergeH) {
    let t = tables.find((tb) => h.x0 < tb.x1 - 10 && h.x1 > tb.x0 + 10 && h.y > tb.y1 &&
      mergeV.some((v) => v.x >= Math.max(tb.x0, h.x0) - 4 && v.x <= Math.min(tb.x1, h.x1) + 4 && v.y0 <= tb.y1 + 3 && v.y1 >= h.y - 3));
    if (!t) { t = { x0: h.x0, x1: h.x1, y0: h.y, y1: h.y, h: [] }; tables.push(t); }
    t.h.push(h); t.x0 = Math.min(t.x0, h.x0); t.x1 = Math.max(t.x1, h.x1); t.y1 = Math.max(t.y1, h.y);
  }
  const grids = [];
  for (const t of tables) {
    if (t.h.length < 2) continue;
    const vs = mergeV.filter((v) => v.x >= t.x0 - 4 && v.x <= t.x1 + 4 && v.y1 > t.y0 + 2 && v.y0 < t.y1 - 2);
    if (vs.length < 2) continue;
    const uniq = (arr) => arr.sort((a, b) => a - b).reduce((acc, v) => (acc.length && v - acc[acc.length - 1] <= 5 ? acc : [...acc, v]), []);
    const xs = uniq(vs.map((v) => v.x));
    const ys = uniq(t.h.map((h) => h.y));
    if (xs.length < 2 || ys.length < 2) continue;
    const hasH = (y, xa, xb) => t.h.some((h) => Math.abs(h.y - y) <= 5 && h.x0 <= (xa + xb) / 2 && h.x1 >= (xa + xb) / 2);
    const hasV = (x, ya, yb) => vs.some((v) => Math.abs(v.x - x) <= 5 && v.y0 <= (ya + yb) / 2 && v.y1 >= (ya + yb) / 2);
    const R = ys.length - 1, C = xs.length - 1;
    // owner[r][c] = o goc (o gop)
    const owner = Array.from({ length: R }, () => Array(C).fill(null));
    const cells = [];
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      if (owner[r][c]) continue;
      let cs = 1, rs = 1;
      while (c + cs < C && !hasV(xs[c + cs], ys[r], ys[r + 1])) cs++;
      while (r + rs < R && !hasH(ys[r + rs], xs[c], xs[c + cs])) rs++;
      const cell = { r, c, rs, cs, x0: xs[c], x1: xs[c + cs], y0: ys[r], y1: ys[r + rs], items: [] };
      for (let rr = r; rr < r + rs; rr++) for (let cc = c; cc < c + cs; cc++) owner[rr][cc] = cell;
      cells.push(cell);
    }
    // Toa do PDF (diem) cua bang.
    grids.push({ cells, R, C, x0: xs[0] / S, x1: xs[xs.length - 1] / S, top: H - ys[0] / S, bottom: H - ys[ys.length - 1] / S });
  }

  // Gan chu vao o bang; chu con lai la dong van.
  const free = [];
  for (const it of items) {
    const px = (it.x + it.w / 2) * S, py = (H - it.y - it.h * 0.35) * S;
    let placed = false;
    for (const g of grids) {
      const cell = g.cells.find((c) => px >= c.x0 && px <= c.x1 && py >= c.y0 && py <= c.y1);
      if (cell) { cell.items.push(it); placed = true; break; }
    }
    if (!placed) free.push(it);
  }

  /* ---- Dong van theo cot (cot trai -> cot phai), co chi so tren/duoi ---- */
  const small = (it) => it.h < medH * 0.8 && it.s.trim().length <= 4;
  const rows = [];
  for (const it of free.filter((i) => !small(i))) {
    const col = it.x + it.w / 2 < mid ? 0 : 1;
    let r = rows.find((q) => q.col === col && Math.abs(q.y - it.y) < 2.2);
    if (!r) { r = { col, y: it.y, h: it.h, parts: [] }; rows.push(r); }
    r.parts.push(it); r.h = Math.max(r.h, it.h);
  }
  for (const it of free.filter(small)) {
    const col = it.x + it.w / 2 < mid ? 0 : 1;
    const near = rows.filter((q) => q.col === col && Math.abs(q.y - it.y) < medH * 0.9).sort((a, b) => Math.abs(a.y - it.y) - Math.abs(b.y - it.y))[0];
    if (near) near.parts.push({ ...it, glue: true, sup: it.y > near.y });
    else rows.push({ col, y: it.y, h: it.h, parts: [it] });
  }
  const colRight = (col) => (col === 0 ? mid - 8 : W - 36);
  const lines = rows.map((r) => {
    const parts = r.parts.sort((a, b) => a.x - b.x);
    // Dong "ro rac" (khoang trong lon giua cac cum chu) – dau hieu cong thuc/phan so.
    let gappy = false;
    for (let i = 1; i < parts.length; i++) if (parts[i].x - (parts[i - 1].x + parts[i - 1].w) > 22) gappy = true;
    return { kind: "line", page: n, col: r.col, y: r.y, h: r.h, x0: parts[0].x, x1: Math.max(...parts.map((p) => p.x + p.w)), right: colRight(r.col), gappy, runs: toRuns(parts) };
  });
  const tablesOut = grids.map((g) => ({
    kind: "table", page: n, col: (g.x0 + g.x1) / 2 < mid ? 0 : 1, y: g.top, top: g.top, bottom: g.bottom, x0: g.x0, x1: g.x1,
    rows: gridRows(g),
  }));
  // Thu tu doc: cot trai tren xuong, roi cot phai.
  const elements = [...lines, ...tablesOut].sort((a, b) => a.col - b.col || b.y - a.y);
  const res = { elements, W, H, canvas };
  pageCache.set(n, res);
  page.cleanup();
  if (pageCache.size > 6) { const k = pageCache.keys().next().value; pageCache.delete(k); }
  return res;
}

/* Chuoi cac doan chu cung kieu (dam/nghieng). */
function toRuns(parts) {
  const runs = [];
  for (const p of parts) {
    let s = p.s;
    if (p.glue) s = p.sup && /^\d$/.test(s.trim()) ? ({ 2: "²", 3: "³" }[s.trim()] ?? s.trim()) : s.trim();
    const last = runs[runs.length - 1];
    if (last && last.b === p.b && last.i === p.i) last.text += p.glue ? s : (needSpace(last.text, s) ? " " : "") + s;
    else {
      if (last && !p.glue && needSpace(last.text, s)) last.text += " ";
      runs.push({ text: p.glue && last ? s : s, b: !!p.b, i: !!p.i });
      if (p.glue && last && last.b === !!p.b) { /* da xu ly */ }
    }
  }
  return runs.map((r) => ({ ...r, text: r.text.replace(/\s+/g, " ") }));
}
const needSpace = (a, b) => a && !/\s$/.test(a) && !/^\s/.test(b) && !/^[,.;:)\]%]/.test(b) && !/[(\[/]$/.test(a);

/* Chu trong o: noi dong bi ngat (dong sau chu thuong / dong truoc ket thuc dau phay...) ; giu xuong dong giua cac gia tri. */
function cellText(cell) {
  const rs = [];
  for (const it of cell.items.sort((a, b) => b.y - a.y || a.x - b.x)) {
    let r = rs.find((q) => Math.abs(q.y - it.y) < 2.5);
    if (!r) { r = { y: it.y, parts: [] }; rs.push(r); }
    r.parts.push(it);
  }
  const ls = rs.sort((a, b) => b.y - a.y).map((r) => ({ text: r.parts.sort((a, b) => a.x - b.x).map((p) => p.s).join(" ").replace(/\s+/g, " ").trim(), b: r.parts.every((p) => p.b) }));
  let out = "";
  ls.forEach((l, i) => {
    if (i === 0) { out = l.text; return; }
    const join = /[,/–-]$/.test(out) || /^[\p{Ll}(]/u.test(l.text);
    out += (join ? (/[/]$/.test(out) ? "" : " ") : "\n") + l.text;
  });
  return { text: out.replace(/ +\n/g, "\n").trim(), b: ls.length > 0 && ls.every((l) => l.b) };
}
function gridRows(g) {
  const rows = Array.from({ length: g.R }, () => []);
  for (const c of g.cells.sort((a, b) => a.r - b.r || a.c - b.c)) {
    const t = cellText(c);
    rows[c.r].push({ text: t.text, b: t.b, ...(c.rs > 1 ? { rs: c.rs } : {}), ...(c.cs > 1 ? { cs: c.cs } : {}) });
  }
  return rows;
}

/* =================== Chi muc chuyen luan =================== */
const lineText = (el) => (el.kind === "line" ? el.runs.map((r) => r.text).join("") : "");
const isInnLine = (t) => t.replace(/\s+/g, "").startsWith("Tênchungquốctế");
const innOf = (t) => {
  let i = 0, seen = 0;
  while (i < t.length && seen < 14) { if (!/\s/.test(t[i])) seen++; i++; }
  return t.slice(i).replace(/^\s*:?\s*/, "").replace(/\.$/, "").replace(/\s+/g, " ").trim();
};
const raw0 = await pdf.getPage(1);
raw0.cleanup();
const index = [];
for (let n = 100; n <= pdf.numPages; n++) {
  const page = await pdf.getPage(n);
  const tc = await page.getTextContent();
  const text = tc.items.map((i) => i.str).join("\n");
  page.cleanup();
  const flat = text.replace(/\s+/g, "");
  const k = flat.indexOf("Tênchungquốctế");
  if (k < 0) continue;
  // Ten tieng Viet: dong IN HOA ngay truoc; INN: sau "Ten chung quoc te:".
  const ls = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const li = ls.findIndex((l, i) => isInnLine(ls.slice(i, i + 6).join("")) && /^T/.test(l));
  const before = ls.slice(Math.max(0, li - 6), li).filter((t) => t === t.toUpperCase() && /[A-ZĐ]{3}/.test(t));
  const innLine = ls.slice(li, li + 8).join(" ");
  index.push({ page: n, vn: before[before.length - 1] || "", inn: innOf(innLine).split(/\.\s/)[0].replace(/Mã ATC.*$/, "").trim() });
}
for (let i = 0; i < index.length; i++) index[i].end = index[i + 1]?.page ?? pdf.numPages;
console.log("Chuyen luan:", index.length);

/* =================== Danh sach can trich =================== */
const products = JSON.parse(readFileSync(join(ROOT, "data", "drug-products.json"), "utf8"));
const formularyKeys = new Set();
for (const p of products) {
  const ing = key(String(p.ingredientName).replace(/^.*?ch[uư]a\s*:/i, ""));
  if (!ing) continue;
  const parts = ing.split(" ");
  formularyKeys.add(ing); formularyKeys.add(parts[0]); formularyKeys.add(parts.slice(0, 2).join(" "));
}
const QD5631_N1 = ["ceftolozan", "tigecyclin", "colistin", "fosfomycin", "linezolid", "amphotericin", "caspofungin", "micafungin", "voriconazol", "ceftazidim avibactam", "meropenem", "imipenem", "doripenem", "ertapenem", "vancomycin", "teicoplanin", "aciclovir", "valganciclovir", "posaconazol"];
const QD5631_N2 = ["amikacin", "gentamicin", "tobramycin", "netilmicin", "ciprofloxacin", "levofloxacin", "lomefloxacin", "moxifloxacin", "norfloxacin", "ofloxacin", "pefloxacin", "sparfloxacin"];
const ANTIMICROBIAL = /(cef|penem|cillin|cilin|mycin|micin|floxacin|cyclin|azol|fungin|vir\b|ciclovir|ganciclovir|colistin|polymyxin|sulfamethoxazol|trimethoprim|metronidazol|tinidazol|linezolid|vancomycin|teicoplanin|fosfomycin|rifampicin|isoniazid|ethambutol|pyrazinamid|clindamycin|amphotericin|nystatin|griseofulvin|terbinafin|aztreonam|chloramphenicol|nitrofurantoin|oseltamivir|entecavir|tenofovir|lamivudin|zidovudin|abacavir|ribavirin|ivermectin|albendazol|mebendazol|praziquantel|cloroquin|quinin|artesunat|primaquin)/;
const groupOf = (k) => QD5631_N1.some((x) => k.includes(x)) ? "ks-n1" : QD5631_N2.some((x) => k.includes(x)) ? "ks-n2" : ANTIMICROBIAL.test(k) ? "khang-sinh" : "thuoc-khac";

/* =================== Doan van tu dong =================== */
const RENAL = /suy thận|chức năng tim\s*-\s*thận|tình trạng tim\s*-\s*thận|suy giảm chức năng thận|theo chức năng thận|Cl\s*cr\b|Clcr|ClCr|thanh thải creatinin|eGFR|mức lọc cầu thận|độ lọc cầu thận/i;
const RENAL_CONT = /suy thận|Cl\s*cr|Clcr|ClCr|thanh thải creatinin|thẩm tách|thẩm phân|lọc máu|eGFR|lọc cầu thận|chức năng thận/i;
const STOP_SECTION = /^(Tương tác thuốc|Tương kỵ|Quá liều|Độ ổn định|Thông tin qui chế|Thông tin quy chế|Dạng thuốc và hàm lượng)\b/;
const MAJOR = /^(Chỉ định|Chống chỉ định|Thận trọng|Thời kỳ mang thai|Thời kỳ cho con bú|Tác dụng không mong muốn|Liều lượng và cách dùng|Tương tác thuốc|Tương kỵ|Quá liều|Độ ổn định|Dược lực học|Dược động học|Dạng thuốc và hàm lượng|Hướng dẫn cách xử trí ADR)\b/;

/* Ghep dong -> doan: ngat doan khi dong truoc ket thuc som (khong cham le phai) hoac dong moi bat dau bang chu dam/nghieng. */
function toBlocks(els) {
  const blocks = [];
  let cur = null;
  const push = () => { if (cur) { cur.runs = mergeRuns(cur.runs); blocks.push(cur); cur = null; } };
  els.forEach((el, idx) => {
    if (el.kind === "table") { push(); blocks.push({ t: "table", rows: el.rows, src: [el] }); return; }
    // Cong thuc/phan so (dong ro rac, co "=" hoac "x" trong cum dong ro rac) -> giu dang anh.
    if (el.gappy) {
      const near = els.slice(Math.max(0, idx - 2), idx + 3).filter((e) => e.kind === "line" && e.gappy);
      if (near.some((e) => /=|×|\bx\b/.test(lineText(e)))) {
        push();
        const last = blocks[blocks.length - 1];
        if (last && last.t === "formula") last.src.push(el); else blocks.push({ t: "formula", src: [el] });
        return;
      }
    }
    const startsStyled = el.runs[0] && (el.runs[0].b || el.runs[0].i) && el.runs[0].text.trim().length > 2;
    const prev = els[idx - 1];
    // Dong tieu de rieng (toan bo dam/nghieng, ngan) -> khoi tieu de doc lap, giong ban goc.
    const lt0 = lineText(el).trim();
    if (el.runs.length && el.runs.every((r) => r.b || r.i || !r.text.trim()) && lt0.length <= 70 && !/[.;]$/.test(lt0)) {
      const next = els[idx + 1];
      const nextStyledAll = next && next.kind === "line" && next.runs.every((r) => r.b || r.i || !r.text.trim());
      if (!nextStyledAll) {
        push();
        blocks.push({ t: "p", head: true, runs: mergeRuns(el.runs.map((r) => ({ ...r }))), src: [el] });
        return;
      }
    }
    const prevEnded = !prev || prev.kind === "table" || prev.page !== el.page && false || (prev.kind === "line" && (prev.right - prev.x1 > 14) && /[.:;!?)]$/.test(lineText(prev).trim()));
    if (!cur || prevEnded || startsStyled && prevEndedSoft(prev)) { push(); cur = { t: "p", runs: [], src: [] }; }
    const last = cur.runs[cur.runs.length - 1];
    const lt = last ? last.text : "";
    const first = el.runs[0];
    if (last && first) {
      const glueNoSpace = /\/$/.test(lt) || /^[,.;:)]/.test(first.text);
      if (!glueNoSpace && !/\s$/.test(lt)) last.text += " ";
    }
    cur.runs.push(...el.runs.map((r) => ({ ...r })));
    cur.src.push(el);
  });
  push();
  // Gom vung cong thuc: cac khoi "formula" sat nhau va dong chu ngan nam trong vung (tu so/mau so) -> 1 khoi.
  for (let changed = true; changed;) {
    changed = false;
    for (let i = 0; i < blocks.length; i++) {
      const f = blocks[i];
      if (f.t !== "formula") continue;
      const ys = f.src.map((e) => e.y), lo = Math.min(...ys) - 34, hi = Math.max(...ys) + 34;
      const inZone = (b) => b && (b.t === "formula" || (b.t === "p" && b.runs.map((r) => r.text).join("").length < 70)) &&
        b.src.every((e) => e.page === f.src[0].page && e.col === f.src[0].col && e.y >= lo && e.y <= hi);
      for (const j of [i + 1, i - 1]) {
        if (inZone(blocks[j])) {
          f.src = [...f.src, ...blocks[j].src].sort((a, b) => b.y - a.y);
          blocks.splice(j, 1);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }
  return blocks;
}
const prevEndedSoft = (prev) => !prev || prev.kind === "table" || /[.:;]$/.test(lineText(prev).trim());
function mergeRuns(runs) {
  const out = [];
  for (const r of runs) {
    const last = out[out.length - 1];
    if (last && last.b === r.b && last.i === r.i) last.text += r.text;
    else if (r.text) out.push({ ...r });
  }
  return out.map((r, i) => ({ ...r, text: (i === 0 ? r.text.trimStart() : r.text).replace(/\s+/g, " ") })).map((r, i, a) => (i === a.length - 1 ? { ...r, text: r.text.trimEnd() } : r));
}
const blockText = (b) => (b.t === "p" ? b.runs.map((r) => r.text).join("") : b.t === "table" ? b.rows.flat().map((c) => c.text).join(" ") : b.src.map(lineText).join(" "));

/* =================== Trich 1 chuyen luan =================== */
async function extract(m) {
  const all = [];
  for (let n = m.page; n <= m.end; n++) all.push(...(await readPage(n)).elements);
  const startAt = all.findIndex((e) => e.page === m.page && isInnLine(lineText(e)));
  if (startAt > 0) all.splice(0, startAt);
  const nextAt = all.findIndex((e, i) => i > 0 && isInnLine(lineText(e)));
  if (nextAt > 0) all.splice(Math.max(1, nextAt - 3));

  const sectionEls = (re) => {
    const a = all.findIndex((e) => re.test(lineText(e).trim()));
    if (a < 0) return [];
    let b = all.findIndex((e, i) => i > a && MAJOR.test(lineText(e).trim()));
    if (b < 0) b = all.length;
    return all.slice(a + 1, b);
  };
  // Lieu luong va cach dung -> doan/bang lien quan than.
  const dose = (() => {
    const a = all.findIndex((e) => /^Liều lượng và cách dùng/.test(lineText(e).trim()));
    if (a < 0) return [];
    let b = all.findIndex((e, i) => i > a && STOP_SECTION.test(lineText(e).trim()));
    if (b < 0) b = all.length;
    return all.slice(a + 1, b);
  })();
  const blocks = toBlocks(dose);
  const keep = new Set();
  /* Tieu muc rieng ve suy than (dong dau doan in dam/nghieng chua "thận"/Clcr/creatinin, vd. "Người suy thận:")
     -> chi lay tieu muc do, den tieu muc in dam/nghieng tiep theo khong lien quan than. */
  const styledHead = (b) => b.t === "p" && b.runs[0] && (b.runs[0].b || b.runs[0].i) && b.runs[0].text.trim().length > 3 ? b.runs[0].text : "";
  const RENAL_HEAD = /suy thận|chức năng thận|Cl\s*cr|Clcr|creatinin|thẩm tách|lọc máu|thẩm phân/i;
  const STOP_HEAD = /^(Người (cao tuổi|già|suy gan|lớn|béo|nhẹ cân|mang thai|bệnh suy gan)|Bệnh nhân (suy gan|cao tuổi|béo|nhi)|Suy gan|Trẻ|Phụ nữ|Thiếu niên|Cách dùng|Liều (dùng |lượng )?(cho|ở|trong) (người|trẻ|bệnh nhân|suy gan)(?!.*thận)|Chế độ dùng thuốc|Dự phòng|Điều trị|Nhiễm|Viêm|Bệnh|Hội chứng|Ung thư|Đau|Tăng|Giảm|Chống|Gây|Phẫu thuật|Thời gian|Quá liều|Liều thông thường|Liều tối đa)/i;
  const heads = blocks.map((b, i) => (RENAL_HEAD.test(styledHead(b)) ? i : -1)).filter((i) => i >= 0);
  if (heads.length) {
    for (const h of heads) {
      keep.add(h);
      for (let j = h + 1; j < blocks.length; j++) {
        const sh = styledHead(blocks[j]).trim();
        // Dung o tieu de nhom doi tuong/chu de khac; tieu de con (Cách 1, Đường uống, Liều duy trì...) thi di tiep.
        if (sh && !RENAL_HEAD.test(sh) && STOP_HEAD.test(sh)) break;
        keep.add(j);
      }
    }
  }
  for (let i = 0; i < blocks.length && !heads.length; i++) {
    if (blocks[i].t !== "p" || !RENAL.test(blockText(blocks[i]))) continue;
    keep.add(i);
    // Tieu de ngan ngay truoc (vd. "Đường uống:", "Người suy thận:") neu doan nay la phan tiep.
    if (i > 0 && blocks[i - 1].t === "p" && /:$/.test(blockText(blocks[i - 1]).trim()) && blockText(blocks[i - 1]).length < 90) keep.add(i - 1);
    for (let j = i + 1; j < blocks.length; j++) {
      const b = blocks[j], t = blockText(b);
      const nextIsTable = blocks[j + 1]?.t === "table";
      if (b.t === "table" || RENAL_CONT.test(t) || (/:$/.test(t.trim()) && t.length < 120 && (nextIsTable || RENAL.test(blockText(blocks[j + 1] ?? { t: "p", runs: [] }))))) keep.add(j);
      else break;
    }
  }
  const picked = [...keep].sort((a, b) => a - b).map((i) => blocks[i]);
  const sentences = (re, needThreshold) => {
    const text = toBlocks(sectionEls(re)).map(blockText).join(" ").replace(/\s+/g, " ");
    return text.split(/(?<=[.;])\s+(?=[\p{Lu}(])/u)
      .filter((s) => RENAL.test(s) && (!needThreshold || /(Cl\s*cr|Clcr|ClCr|thanh thải creatinin|eGFR|lọc cầu thận)[^.]{0,40}\d/i.test(s)))
      .map((s) => s.replace(/Cl\s+cr\b/g, "Clcr").trim()).slice(0, 6);
  };
  return { blocks: picked, ci: sentences(/^Chống chỉ định\b/, false), caution: sentences(/^Thận trọng\b/, true) };
}

/* Anh cat cho cong thuc: vung bao cac dong (cung trang, cung cot). */
async function cropLines(els, id) {
  const e0 = els[0];
  const { W, H, canvas } = await readPage(e0.page);
  const same = els.filter((e) => e.page === e0.page && e.col === e0.col);
  const top = Math.max(...same.map((e) => e.y + e.h)), bottom = Math.min(...same.map((e) => e.y));
  const x0 = e0.col === 0 ? 30 : W / 2 + 1, x1 = e0.col === 0 ? W / 2 - 1 : W - 30;
  const left = Math.round(x0 * S), y = Math.round(Math.max(0, H - top - 5) * S), w = Math.round((x1 - x0) * S), h = Math.round((top - bottom + 11) * S);
  const file = id + ".webp";
  await sharp(canvas.toBuffer("image/png")).extract({ left, top: y, width: w, height: Math.min(h, Math.round(H * S) - y) }).webp({ quality: 80 }).toFile(join(OUT_IMG, file));
  return { src: "/duoc-thu/" + file, w, h };
}

/* =================== Chay =================== */
const results = [];
for (const m of index) {
  const k = key(`${m.vn} ${m.inn}`);
  const inFormulary = [key(m.vn), key(m.inn)].some((x) => x && (formularyKeys.has(x) || (formularyKeys.has(x.split(" ")[0]) && x.split(" ")[0].length > 5)));
  const group = groupOf(k);
  const priority = group === "ks-n1" || group === "ks-n2";
  if (!inFormulary && !priority) continue;
  if (ONLY && !k.includes(ONLY)) continue;
  /* Ten chuyen luan mat phan hoat chat (vd "(DUNG TRONG HO HAP)"): ghep ten INN goc vao truoc. */
  const base = m.inn.replace(/s*(.*$/, "").trim();
  const vn = m.vn && /^s*(/.test(m.vn) ? `${base} ${m.vn.toLowerCase()}` : m.vn;
  const id = slug(vn || m.inn).slice(0, 60);
  const name = (vn ? vn.charAt(0) + vn.slice(1).toLowerCase() : m.inn).replace(/((i{1,3}|iv|v))/g, (x) => x.toUpperCase());
  const pages = { pdf: [m.page, m.end], printed: [m.page + PAGE_OFFSET, m.end + PAGE_OFFSET] };
  const ex = await extract(m);
  const empty = !ex.blocks.length && !ex.ci.length && !ex.caution.length;
  if (empty && !priority) continue;
  if (empty) {
    results.push({ id, name, inn: m.inn, group, inFormulary, pages, noAdjust: false, noRenalText: true, content: [], contraindications: [], cautions: [] });
    console.log(`${group.padEnd(10)} ${name} | Duoc thu khong neu hieu chinh theo than`);
    continue;
  }
  const text = ex.blocks.map(blockText).join(" ");
  const noAdjust = /không cần (phải )?(điều|hiệu) chỉnh liều/i.test(text) && !/giảm liều|điều chỉnh liều theo|hiệu chỉnh liều như sau|khoảng cách|mỗi \d+ giờ|Cl\s*cr\s*[<≤]|Clcr\s*[<≤]/i.test(text);
  const content = [];
  let fi = 0;
  for (const b of ex.blocks) {
    if (b.t === "p") content.push({ t: "p", runs: b.runs, ...(b.head ? { head: true } : {}) });
    else if (b.t === "table") content.push({ t: "table", rows: b.rows });
    else content.push({ t: "img", ...(await cropLines(b.src, id + "-ct" + ++fi)), alt: blockText(b) });
  }
  results.push({ id, name, inn: m.inn, group, inFormulary, pages, noAdjust, content, contraindications: ex.ci, cautions: ex.caution });
  console.log(`${group.padEnd(10)} ${name} | ${content.filter((c) => c.t === "p").length} doan, ${content.filter((c) => c.t === "table").length} bang | CCD ${ex.ci.length} | TT ${ex.caution.length}${noAdjust ? " | khong can HC" : ""}`);
}
if (ONLY) {
  try {
    const prev = JSON.parse(readFileSync(join(ROOT, "data", "renal-dtqg.json"), "utf8")).items;
    const ids = new Set(results.map((r) => r.id));
    results.push(...prev.filter((r) => !ids.has(r.id)));
  } catch { /* */ }
}
results.sort((a, b) => a.name.localeCompare(b.name, "vi"));
writeFileSync(join(ROOT, "data", "renal-dtqg.json"), JSON.stringify({
  source: "Bộ Y tế – Hội đồng Dược thư quốc gia Việt Nam. Dược thư quốc gia Việt Nam, lần xuất bản thứ ba (2023)",
  extractedAt: new Date().toISOString().slice(0, 10),
  note: "Trích nguyên văn phần hiệu chỉnh liều ở người suy thận (mục Liều lượng và cách dùng), chống chỉ định và thận trọng liên quan chức năng thận; bảng dựng lại theo đường kẻ của trang gốc. Chưa được dược sĩ lâm sàng BV199 xác nhận.",
  items: results,
}, null, 1));
console.log("Tong:", results.length, "| theo nhom:", JSON.stringify(results.reduce((a, r) => ((a[r.group] = (a[r.group] || 0) + 1), a), {})));
