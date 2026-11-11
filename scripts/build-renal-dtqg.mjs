/*
  Trich phan "hieu chinh lieu o nguoi suy than" tu Duoc thu quoc gia Viet Nam (lan xuat ban thu ba, 2023)
  cho cac thuoc trong danh muc BV199 + khang sinh uu tien quan ly theo QD 5631/QD-BYT (Phu luc 2).

  Moi thuoc: doan van NGUYEN VAN (khong dien giai) + anh cat dung vung trang Duoc thu chua doan do
  (bang lieu theo CrCl giu nguyen nhu sach). Khong tu suy ra lieu.

  Dau ra: data/renal-dtqg.json, public/duoc-thu/*.webp
  Can: pdfjs-dist + @napi-rs/canvas (LEAFLET_TOOLS), sharp (dependency cua du an).
  Chay: LEAFLET_TOOLS=<tools> node scripts/build-renal-dtqg.mjs "<duong dan Duoc thu 2023.pdf>" [--only ten] [--no-images]
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
const NO_IMAGES = args.includes("--no-images");
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
const PAGE_OFFSET = 6; // trang in = trang PDF + 6 (theo du lieu da doi chieu: PDF tr. 202 = trang in 208)

/* ---------- Dong chu theo vi tri (trang, cot, y) ---------- */
const lineCache = new Map();
async function pageLines(n) {
  if (lineCache.has(n)) return lineCache.get(n);
  const page = await pdf.getPage(n);
  const vp = page.getViewport({ scale: 1 });
  const tc = await page.getTextContent();
  const mid = vp.width / 2;
  const rows = [];
  const items = tc.items.filter((it) => it.str && it.str.trim()).map((it) => ({ x: it.transform[4], y: it.transform[5], h: Math.abs(it.transform[3]) || 9, w: it.width || 0, s: it.str }));
  const hs = items.map((i) => i.h).sort((a, b) => a - b);
  const medH = hs[Math.floor(hs.length / 2)] || 10;
  // Chu nho (chi so tren/duoi: m², Clcr, HbA1c) gan vao dong chinh gan nhat, noi lien khong cach.
  const small = (it) => it.h < medH * 0.8 && it.s.trim().length <= 4;
  for (const it of items.filter((i) => !small(i))) {
    const col = it.x + it.w / 2 < mid ? 0 : 1;
    let r = rows.find((q) => q.col === col && Math.abs(q.y - it.y) < 2.2);
    if (!r) { r = { col, y: it.y, h: it.h, parts: [] }; rows.push(r); }
    r.parts.push({ x: it.x, s: it.s });
    r.h = Math.max(r.h, it.h);
  }
  for (const it of items.filter(small)) {
    const col = it.x + it.w / 2 < mid ? 0 : 1;
    const near = rows.filter((q) => q.col === col && Math.abs(q.y - it.y) < medH * 0.9).sort((a, b) => Math.abs(a.y - it.y) - Math.abs(b.y - it.y))[0];
    const sup = near && it.y > near.y;
    if (near) near.parts.push({ x: it.x, s: sup && /^\d$/.test(it.s.trim()) ? ({ 2: "²", 3: "³" }[it.s.trim()] ?? it.s.trim()) : it.s.trim(), glue: true });
    else rows.push({ col, y: it.y, h: it.h, parts: [{ x: it.x, s: it.s }] });
  }
  // Dong tieu de trang (chay qua 2 cot) xep vao cot trai.
  const lines = rows
    // Bo dong tieu de chay (dau trang) va so trang (cuoi trang).
    .filter((r) => r.y < vp.height - 52 && r.y > 36)
    .map((r) => ({ page: n, col: r.col, y: r.y, h: r.h, text: r.parts.sort((a, b) => a.x - b.x).reduce((acc, q) => (q.glue ? acc.replace(/\s+$/, "") + q.s + " " : acc + q.s + " "), "").replace(/\s+/g, " ").replace(/\s+([,.;:)])/g, "$1").trim() }))
    .sort((a, b) => a.col - b.col || b.y - a.y);
  const res = { lines, width: vp.width, height: vp.height };
  lineCache.set(n, res);
  page.cleanup();
  return res;
}

/* ---------- Chi muc chuyen luan ---------- */
const index = [];
/* Dong "Ten chung quoc te": PDF co the tach ky tu ("Tên chung qu ố c t ế") -> so sanh sau khi bo khoang trang. */
const isInnLine = (t) => t.replace(/\s+/g, "").startsWith("Tênchungquốctế");
const innOf = (t) => {
  let i = 0, seen = 0;
  const target = "Tênchungquốctế";
  while (i < t.length && seen < target.length) { if (!/\s/.test(t[i])) seen++; i++; }
  return t.slice(i).replace(/^\s*:?\s*/, "").replace(/\.$/, "").replace(/\s+/g, " ").trim();
};
for (let n = 100; n <= pdf.numPages; n++) {
  const { lines } = await pageLines(n);
  const i = lines.findIndex((l) => isInnLine(l.text));
  if (i < 0) continue;
  const head = lines.slice(Math.max(0, i - 4), i).map((l) => l.text).filter((t) => t === t.toUpperCase() && /[A-ZĐ]{3}/.test(t));
  index.push({ page: n, vn: head[head.length - 1] || "", inn: innOf(lines[i].text) });
}
// Pham vi gom ca trang co chuyen luan ke tiep (chuyen luan sau co the bat dau giua trang).
for (let i = 0; i < index.length; i++) index[i].end = index[i + 1]?.page ?? pdf.numPages;
console.log("Chuyen luan:", index.length);

/* ---------- Danh sach can trich ---------- */
const products = JSON.parse(readFileSync(join(ROOT, "data", "drug-products.json"), "utf8"));
const formularyKeys = new Set();
for (const p of products) {
  const ing = key(String(p.ingredientName).replace(/^.*?ch[uư]a\s*:/i, ""));
  if (!ing) continue;
  const parts = ing.split(" ");
  formularyKeys.add(ing); formularyKeys.add(parts[0]); formularyKeys.add(parts.slice(0, 2).join(" "));
}

/* QD 5631/QD-BYT - Phu luc 2: khang sinh uu tien quan ly. */
const QD5631_N1 = ["ceftolozan", "tigecyclin", "colistin", "fosfomycin", "linezolid", "amphotericin", "caspofungin", "micafungin", "voriconazol", "ceftazidim avibactam", "meropenem", "imipenem", "doripenem", "ertapenem", "vancomycin", "teicoplanin", "aciclovir", "valganciclovir", "posaconazol"];
const QD5631_N2 = ["amikacin", "gentamicin", "tobramycin", "netilmicin", "ciprofloxacin", "levofloxacin", "lomefloxacin", "moxifloxacin", "norfloxacin", "ofloxacin", "pefloxacin", "sparfloxacin"];
const ANTIMICROBIAL = /(cef|penem|cillin|cilin|mycin|micin|floxacin|cyclin|azol|fungin|vir\b|ciclovir|ganciclovir|colistin|polymyxin|sulfamethoxazol|trimethoprim|metronidazol|tinidazol|linezolid|vancomycin|teicoplanin|fosfomycin|rifampicin|isoniazid|ethambutol|pyrazinamid|clindamycin|amphotericin|nystatin|griseofulvin|terbinafin|aztreonam|chloramphenicol|nitrofurantoin|oseltamivir|entecavir|tenofovir|lamivudin|zidovudin|abacavir|ribavirin|ivermectin|albendazol|mebendazol|praziquantel|cloroquin|quinin|artesunat|primaquin)/;

const groupOf = (k) => QD5631_N1.some((x) => k.includes(x)) ? "ks-n1" : QD5631_N2.some((x) => k.includes(x)) ? "ks-n2" : ANTIMICROBIAL.test(k) ? "khang-sinh" : "thuoc-khac";

/* ---------- Trich doan suy than trong phan "Lieu luong va cach dung" ---------- */
/* Cum mo dau doan trich (lien quan lieu o nguoi suy than). "tham tach/loc mau" chi de keo dai doan, khong mo doan moi. */
const RENAL = /suy thận|chức năng tim\s*-\s*thận|tình trạng tim\s*-\s*thận|suy giảm chức năng thận|theo chức năng thận|Cl\s*cr\b|ClCr|thanh thải creatinin|eGFR|mức lọc cầu thận|độ lọc cầu thận/i;
const RENAL_CONT = /suy thận|thận|Cl\s*cr|ClCr|thanh thải creatinin|thẩm tách|thẩm phân|lọc máu|eGFR|lọc cầu thận/i;
const STOP_SECTION = /^(Tương tác thuốc|Tương kỵ|Quá liều|Độ ổn định|Thông tin qui chế|Thông tin quy chế|Dạng thuốc và hàm lượng)\b/;
const POP_HEAD = /^(Người cao tuổi|Người suy gan|Suy gan|Bệnh nhân suy gan|Trẻ em|Trẻ sơ sinh|Trẻ nhỏ|Người lớn|Cách dùng|Người béo|Phụ nữ|Người mang thai|Dự phòng|Điều trị|Liều thông thường|Tiêm|Uống|Đường uống|Bệnh nhân suy gan|Người bệnh suy gan|Liều dùng cho người (cao tuổi|suy gan|béo|nhẹ cân)|Liều dùng trong suy gan)/i;

async function extract(m) {
  const all = [];
  for (let n = m.page; n <= m.end; n++) all.push(...(await pageLines(n)).lines);
  // Chuyen luan co the bat dau giua trang: bo phan cua chuyen luan dung truoc (truoc dong "Ten chung quoc te").
  const startAt = all.findIndex((l) => l.page === m.page && isInnLine(l.text) && innOf(l.text).startsWith(m.inn.slice(0, 10)));
  if (startAt > 0) all.splice(0, startAt);
  // ... va ket thuc truoc tieu de cua chuyen luan ke tiep.
  const nextAt = all.findIndex((l, i) => i > 0 && isInnLine(l.text));
  if (nextAt > 0) all.splice(Math.max(1, nextAt - 3));
  const a = all.findIndex((l) => /^Liều lượng và cách dùng/.test(l.text));
  if (a < 0) return null;
  let b = all.findIndex((l, i) => i > a && STOP_SECTION.test(l.text));
  if (b < 0) b = all.length;
  const sec = all.slice(a + 1, b);
  const picked = new Set();
  for (let i = 0; i < sec.length; i++) {
    if (!RENAL.test(sec[i].text) || picked.has(i)) continue;
    // Bat dau doan: lui ve dau cau/tieu de.
    let s = i;
    while (s > 0 && !/[.:;]$/.test(sec[s - 1].text) && i - s < 6) s--;
    // Ket thuc: den tieu de nhom doi tuong khac hoac het muc, toi da 70 dong.
    let e = i;
    while (e + 1 < sec.length && e - i < 70) {
      const nx = sec[e + 1].text;
      if (POP_HEAD.test(nx) && !RENAL.test(nx) && /[.:;]$/.test(sec[e].text)) break;
      e++;
      // Doan van ket thuc bang dau cham va dong sau khong lien quan than, khong phai bang -> dung.
      if (/[.]$/.test(sec[e].text) && e + 1 < sec.length && !RENAL_CONT.test(sec[e + 1].text) && sec[e + 1].text.length > 40 && !/^\d|^[<>≤≥]/.test(sec[e + 1].text)) {
        const ahead = sec.slice(e + 1, e + 4).some((l) => RENAL_CONT.test(l.text) || /^\d|^[<>≤≥]/.test(l.text));
        if (!ahead) break;
      }
    }
    for (let k = s; k <= e; k++) picked.add(k);
  }
  const lines = [...picked].sort((x, y) => x - y).map((i) => sec[i]);
  return { dose: lines.length ? lines : null, ci: renalSentences(all, "Chống chỉ định", false), caution: renalSentences(all, "Thận trọng", true) };
}

/* Cau lien quan than trong muc "Chong chi dinh" / "Than trong" (nguyen van).
   Than trong: chi lay cau co nguong so (Clcr/eGFR...) de tranh cau chung chung. */
const MAJOR = /^(Chỉ định|Chống chỉ định|Thận trọng|Thời kỳ mang thai|Thời kỳ cho con bú|Tác dụng không mong muốn|Liều lượng và cách dùng|Tương tác thuốc|Tương kỵ|Quá liều|Độ ổn định|Dược lực học|Dược động học|Dạng thuốc và hàm lượng|Hướng dẫn cách xử trí ADR)\b/;
function renalSentences(all, heading, needThreshold) {
  const a = all.findIndex((l) => new RegExp(`^${heading}\\b`).test(l.text));
  if (a < 0) return [];
  let b = all.findIndex((l, i) => i > a && MAJOR.test(l.text));
  if (b < 0) b = Math.min(all.length, a + 80);
  const text = all.slice(a + 1, b).map((l) => l.text).join(" ").replace(/(\S)- (\S)/g, "$1-$2").replace(/\s+/g, " ");
  const sentences = text.split(/(?<=[.;])\s+(?=[\p{Lu}(])/u);
  return sentences
    .filter((s) => RENAL.test(s) && (!needThreshold || /(Cl\s*cr|ClCr|thanh thải creatinin|eGFR|lọc cầu thận)[^.]{0,40}\d/i.test(s)))
    .map((s) => s.replace(/Cl\s+cr\b/g, "Clcr").trim())
    .slice(0, 6);
}

/* Gop dong thanh doan; doan nhieu dong ngan (bang) -> danh dau "bang". */
function toBlocks(lines) {
  const blocks = [];
  let buf = [];
  const flush = () => {
    if (!buf.length) return;
    const shortRatio = buf.filter((l) => l.text.length < 34).length / buf.length;
    if (buf.length >= 4 && shortRatio > 0.6) blocks.push({ t: "table", text: buf.map((l) => l.text).join(" | ") });
    else blocks.push({ t: "p", text: buf.map((l) => l.text).join(" ").replace(/(\S)- (\S)/g, "$1-$2").replace(/\s+/g, " ").trim() });
    buf = [];
  };
  let prevShort = null;
  for (const l of lines) {
    const short = l.text.length < 34;
    if (buf.length && (prevShort !== null && short !== prevShort && buf.length >= 3)) flush();
    buf.push(l);
    if (/[.:]$/.test(l.text) && !short) flush();
    prevShort = short;
  }
  flush();
  return blocks;
}

/* Anh cat: moi (trang, cot) mot anh, tu dong dau den dong cuoi cua doan trich. */
async function clips(lines, id) {
  const groups = new Map();
  for (const l of lines) {
    const k = `${l.page}-${l.col}`;
    const g = groups.get(k) || { page: l.page, col: l.col, top: -Infinity, bottom: Infinity };
    g.top = Math.max(g.top, l.y + l.h);
    g.bottom = Math.min(g.bottom, l.y);
    groups.set(k, g);
  }
  const out = [];
  let n = 0;
  for (const g of groups.values()) {
    const page = await pdf.getPage(g.page);
    const scale = 2.4;
    const vp = page.getViewport({ scale });
    const { width, height } = await pageLines(g.page);
    const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    page.cleanup();
    const pad = 6;
    // Cat sat cot (tranh lan chu cot ben canh); mep ngoai chua le bang.
    const x0 = g.col === 0 ? 30 : width / 2 + 1;
    const x1 = g.col === 0 ? width / 2 - 1 : width - 30;
    const y0 = Math.max(0, height - g.top - pad);
    const y1 = Math.min(height, height - g.bottom + pad + 3);
    const left = Math.round(x0 * scale), top = Math.round(y0 * scale);
    const w = Math.round((x1 - x0) * scale), h = Math.round((y1 - y0) * scale);
    const file = `${id}-${++n}.webp`;
    if (!NO_IMAGES) {
      await sharp(canvas.toBuffer("image/png")).extract({ left, top, width: w, height: h }).webp({ quality: 72 }).toFile(join(OUT_IMG, file));
    }
    out.push({ src: `/duoc-thu/${file}`, page: g.page, printedPage: g.page + PAGE_OFFSET, w, h });
  }
  return out;
}

/* ---------- Chay ---------- */
const results = [];
for (const m of index) {
  const k = key(`${m.vn} ${m.inn}`);
  const inFormulary = [key(m.vn), key(m.inn)].some((x) => x && (formularyKeys.has(x) || formularyKeys.has(x.split(" ")[0]) && x.split(" ")[0].length > 5));
  const group = groupOf(k);
  const priority = group === "ks-n1" || group === "ks-n2";
  if (!inFormulary && !priority) continue;
  if (ONLY && !k.includes(ONLY)) continue;
  const ex = await extract(m);
  const empty = !ex || (!ex.dose && !ex.ci.length && !ex.caution.length);
  if (empty && !priority) continue;
  if (empty) {
    // Khang sinh uu tien quan ly (QD 5631) co chuyen luan nhung khong neu hieu chinh theo than: van dua vao, ghi ro.
    results.push({ id: slug(m.vn || m.inn).slice(0, 60), name: m.vn ? m.vn.charAt(0) + m.vn.slice(1).toLowerCase() : m.inn, inn: m.inn, group, inFormulary,
      pages: { pdf: [m.page, m.end], printed: [m.page + PAGE_OFFSET, m.end + PAGE_OFFSET] }, noAdjust: false, noRenalText: true, blocks: [], clips: [], contraindications: [], cautions: [] });
    console.log(`${group.padEnd(10)} ${m.vn || m.inn} | Duoc thu khong neu hieu chinh theo than`);
    continue;
  }
  const lines = ex.dose ?? [];
  const id = slug(m.vn || m.inn).slice(0, 60);
  const blocks = toBlocks(lines);
  const text = blocks.map((b) => b.text).join(" ");
  const noAdjust = /không cần (phải )?(điều|hiệu) chỉnh liều/i.test(text) && !/giảm liều|điều chỉnh liều theo|hiệu chỉnh liều như sau|khoảng cách|mỗi \d+ giờ|Cl\s*cr\s*[<≤]/i.test(text);
  results.push({
    id, name: m.vn ? m.vn.charAt(0) + m.vn.slice(1).toLowerCase() : m.inn, inn: m.inn, group, inFormulary,
    pages: { pdf: [m.page, m.end], printed: [m.page + PAGE_OFFSET, m.end + PAGE_OFFSET] },
    noAdjust, blocks, clips: lines.length ? await clips(lines, id) : [],
    contraindications: ex.ci, cautions: ex.caution,
  });
  console.log(`${group.padEnd(10)} ${m.vn || m.inn} | lieu: ${blocks.length} doan | CCD: ${ex.ci.length} | TT: ${ex.caution.length} ${noAdjust ? "| khong can HC" : ""}`);
}
// --only: gop vao du lieu da co (thay muc cung id), khong ghi de toan bo.
if (ONLY) {
  try {
    const prev = JSON.parse(readFileSync(join(ROOT, "data", "renal-dtqg.json"), "utf8")).items;
    const ids = new Set(results.map((r) => r.id));
    results.push(...prev.filter((r) => !ids.has(r.id)));
  } catch { /* chua co du lieu */ }
}
results.sort((a, b) => a.name.localeCompare(b.name, "vi"));
writeFileSync(join(ROOT, "data", "renal-dtqg.json"), JSON.stringify({
  source: "Bộ Y tế – Hội đồng Dược thư quốc gia Việt Nam. Dược thư quốc gia Việt Nam, lần xuất bản thứ ba (2023)",
  extractedAt: new Date().toISOString().slice(0, 10),
  note: "Trích nguyên văn phần hiệu chỉnh liều ở người suy thận trong mục Liều lượng và cách dùng; ảnh cắt từ trang gốc. Chưa được dược sĩ lâm sàng BV199 xác nhận.",
  items: results,
}, null, 1));
console.log("Tong:", results.length, "| theo nhom:", JSON.stringify(results.reduce((a, r) => ((a[r.group] = (a[r.group] || 0) + 1), a), {})));
