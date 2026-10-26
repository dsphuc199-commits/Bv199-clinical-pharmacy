/*
  DOI CHIEU LIEU PHAC DO VOI BAN CHINH THUC (Nhiem vu 4C)

  Moi lieu (so + don vi) trong du lieu phac do duoc tim trong VAN BAN TRANG cua ban PDF
  chinh thuc, trong cua so trang duoc trich dan (± 1 trang). Ket qua ghi vao
  data/antibiotics/empiric/verification/official-dose-check.json.

  Chay:
    node scripts/verify-official-doses.mjs --text-dir <thu-muc> [--write]

  <thu-muc> chua tep van ban theo trang, ten = ma van ban:
    byt708.txt, byt2147.txt, byt2767.txt, byt5642.txt, byt1530.txt, vnrs2023.txt
  Moi trang bat dau bang dong "===== PDF PAGE <n> / <tong> =====".
  Tao tep bang pdfjs-dist (vd. `npx -y -p pdfjs-dist@4.10.38 node scripts/pdf-to-pages.mjs a.pdf > byt708.txt`).

  Gioi han co chu dich: chi kiem tra SO + DON VI lieu (khong kiem tra ten thuoc, khoang
  cach lieu dang chu). Lieu dan nguon Duoc thu (DTQG) khong co ban chinh thuc -> "unverifiable".
*/

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

/* ---------- Nap TS/TSX (alias @/) ---------- */
const Module = require("node:module");
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request.startsWith("@/")) request = path.join(ROOT, request.slice(2));
  return origResolve.call(this, request, parent, ...rest);
};
for (const ext of [".ts", ".tsx"]) {
  require.extensions[ext] = (mod, filename) => {
    const src = fs.readFileSync(filename, "utf8");
    const out = ts.transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: filename,
    });
    mod._compile(out.outputText, filename);
  };
}
const tryExt = (p) => [p, `${p}.ts`, `${p}.tsx`, path.join(p, "index.ts")].find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
Module._resolveFilename = ((prev) =>
  function (request, parent, ...rest) {
    if (request.startsWith("@/") || request.startsWith(".")) {
      const base = request.startsWith("@/") ? path.join(ROOT, request.slice(2)) : path.resolve(path.dirname(parent.filename), request);
      const hit = tryExt(base);
      if (hit) return hit;
    }
    return prev.call(this, request, parent, ...rest);
  })(origResolve);

/* ---------- Tham so ---------- */
const args = process.argv.slice(2);
const textDir = args[args.indexOf("--text-dir") + 1];
const write = args.includes("--write");
if (!textDir || args.indexOf("--text-dir") < 0) {
  console.error("Thieu --text-dir");
  process.exit(1);
}

/* So trang in -> so trang PDF */
const OFFSET = { byt162: 1, byt5643: 1, byt708: 0, byt5642: 0, byt1530: 0, byt2767: 1, byt2147: 10, vnrs2023: 0 };
/* Chua xac dinh do lech trang in/PDF -> tim tren toan van ban. */
const WHOLE_DOC = new Set([]);
/* Ban sao dung de doi chieu (khong phai kcb.vn): do lech trang tu do (-30..+30). */
const COPIES = {
  byt315: { kind: "government-copy", url: "https://elib.bvdktuthainguyen.gov.vn/uploads/d0/6c/d06c3841337245a338276a861dfcb18c_1605357395.pdf" },
  byt162: { kind: "government-copy", url: "https://bvdkbaclieu.gov.vn/upload/1000079/20240524/291_Quyet_dinh-162-QD-BYT_3d3c0ac03e.pdf" },
  byt4416: { kind: "government-copy", url: "https://benhviennhi.gialai.gov.vn/Upload/FileUpload/6383762003562310864494%20[G%E1%BB%ACI%20K%C3%88M]%20HD%20ch%20n%20%20o%C3%A1n%20v%C3%A0%20%20i%20u%20tr%20%20b%20nh%20da%20li%20u%204416.signed.pdf" },
  // SHA-256 739fd281…ebee02 – trung khop ban tren benhvienhatrung.vn.
  byt3429: { kind: "government-copy", url: "https://syt.gialai.gov.vn/index.php/vi/download/Thu-vien-Huong-dan-chan-doan-dieu-tri-Quy-trinh-ky-thuat-va-cac-Tai-lieu-chuyen-mon-kham-chua-benh/Quyet-dinh-so-3429-QD-BYT-14-07-2021-cua-Bo-Y-te-V-v-ban-hanh-tai-lieu-chuyen-mon-Huong-dan-chan-doan-va-dieu-tri-nhiem-nam-xam-lan.html" },
};
const AUTO_OFFSET = new Set(["byt315", "byt3429", "byt4416"]); // byt162: do lech +1 xac dinh tu so trang in (PDF 47 = tr. 46)
const OFFSET_CHOSEN = {};
const DOC_BY_NUMBER = { "5643": "byt5643", "708": "byt708", "2147": "byt2147", "2767": "byt2767", "5642": "byt5642", "1530": "byt1530" };

function loadPages(id) {
  const file = path.join(textDir, `${id}.txt`);
  if (!fs.existsSync(file)) return null;
  const pages = new Map();
  let cur = 0;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^===== PDF PAGE (\d+) \//);
    if (m) { cur = Number(m[1]); pages.set(cur, ""); continue; }
    if (cur) pages.set(cur, pages.get(cur) + " " + line);
  }
  for (const [k, v] of pages) pages.set(k, norm(v));
  return pages;
}

function norm(s) {
  return s
    .normalize("NFKC") // µ (micro) -> μ, khoang trang dac biet
    .toLowerCase()
    .replace(/[¦|]/g, "")
    .replace(/[–—−‐‑]/g, "-")
    .replace(/(\d)[.\s](?=\d{3}(?!\d))/g, "$1") // dau phan cach hang nghin: 100.000 / 100 000
    .replace(/(\d)\.(\d)/g, "$1,$2") // dau thap phan kieu Anh: 12.5 -> 12,5
    .replace(/\s+/g, "");
}

const UNIT = "(mg\\/kg\\/ngày|mg\\/kg|mg|g|μg|mcg|triệu đơn vị|triệu đv|đơn vị|đv|ui|ml)";
const NUM = "\\d{1,3}(?:[.\\s]\\d{3})+(?!\\d)|\\d+(?:,\\d+)?";
const DOSE_RE = new RegExp(`((?:${NUM})(?:\\s*[-–]\\s*(?:${NUM}))?)\\s*${UNIT}(?![a-zà-ỹ])`, "giu");

/* Tra ve [{ token, at }] – vi tri dung de gan voi trich dan gan nhat phia sau. */
function tokensOf(text) {
  const out = [];
  const src = text.normalize("NFKC").toLowerCase().replace(/[–‐‑]/g, "-");
  for (const m of src.matchAll(DOSE_RE)) {
    const num = m[1].replace(/(\d)[.\s](?=\d{3}(?!\d))/g, "$1").replace(/\s+/g, "");
    const unit = m[2].startsWith("mg/kg") ? "mg/kg" : m[2].replace(/\s+/g, "");
    const base = unit.split("/")[0];
    // Dang tuong duong: "1-2g" = "1g-2g"; "75-100mg/kg" = "75mg-100mg/kg" = "75mg/kg-100mg/kg".
    const alts = num.includes("-") ? [num.replace("-", unit + "-") + unit, num.replace("-", base + "-") + unit] : [];
    out.push({ token: num + unit, alts, at: m.index });
  }
  return out;
}

function findIn(hay, token) {
  let from = 0;
  for (;;) {
    const at = hay.indexOf(token, from);
    if (at < 0) return false;
    const prev = hay[at - 1];
    const prev2 = hay[at - 2];
    // Khong dung giua mot so khac (vd. "11g", "1,5g"); "..." / "…" truoc so van hop le.
    const insideNumber = !!prev && (/[0-9]/.test(prev) || (/[.,]/.test(prev) && !!prev2 && /[0-9]/.test(prev2)));
    if (!insideNumber) return true;
    from = at + 1;
  }
}

function pageRange(ref) {
  const m = String(ref).match(/(\d+)(?:\s*[–-]\s*(\d+))?/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2] ?? m[1])];
}

function windowText(pages, docId, range) {
  if (!range || WHOLE_DOC.has(docId)) return [...pages.values()].join(" ");
  const off = OFFSET[docId] ?? 0;
  const parts = [];
  for (let p = range[0] - 1 + off; p <= range[1] + 1 + off; p++) if (pages.has(p)) parts.push(pages.get(p));
  return parts.join(" ");
}

/* ---------- Kiem tra ---------- */
const { ALL_REGIMENS } = require(path.join(ROOT, "data/antibiotics/empiric/regimens/index.ts"));
const { CAP_SCENARIOS } = require(path.join(ROOT, "components/antibiotics/CapByt2026.tsx"));
const { HAPVAP_SCENARIOS } = require(path.join(ROOT, "components/antibiotics/HapVap2023.tsx"));

const cache = new Map();
const pagesOf = (id) => (cache.has(id) ? cache.get(id) : (cache.set(id, loadPages(id)), cache.get(id)));

/*
  lines: moi dong la lieu cua mot thuoc. Moi lieu gan voi trich dan "(QĐ … tr. N)" hoac
  "(DTQG …)" GAN NHAT PHIA SAU no trong cung dong; khong co -> trang cua phuong an.
  wholeDocFallback: khong thay trong cua so trang -> tim ca van ban (ghi "elsewhere").
*/
function checkSegments(lines, defaultDoc, defaultRange, wholeDocFallback = false) {
  let total = 0, found = 0, unverifiable = 0, elsewhere = 0;
  const missing = [];
  for (const line of lines) {
    const src = line.normalize("NFKC");
    const cites = [];
    for (const m of src.matchAll(/QĐ\s*(\d+)[^;()]*?tr\.\s*(?:PDF\s*)?(\d+(?:\s*[–-]\s*\d+)?)/g)) {
      cites.push({ at: m.index, end: m.index + m[0].length, docId: DOC_BY_NUMBER[m[1]], range: pageRange(m[2]) });
    }
    for (const m of src.matchAll(/DTQG|Dược thư/g)) cites.push({ at: m.index, end: m.index + m[0].length, dtqg: true });
    cites.sort((a, b) => a.at - b.at);
    for (const t of tokensOf(src)) {
      const cite = cites.find((c) => c.at > t.at);
      if (cite?.dtqg) { unverifiable++; continue; }
      const docId = cite?.docId ?? defaultDoc;
      const range = cite?.docId ? cite.range : defaultRange;
      const pages = pagesOf(docId);
      if (!pages) { unverifiable++; continue; }
      total++;
      const hay = windowText(pages, docId, range);
      if (findIn(hay, t.token) || t.alts.some((x) => findIn(hay, x))) { found++; continue; }
      if (wholeDocFallback) {
        const all = windowText(pages, docId, null);
        if (findIn(all, t.token) || t.alts.some((x) => findIn(all, x))) { found++; elsewhere++; continue; }
      }
      missing.push(t.token);
    }
  }
  return { total, found, missing, unverifiable, elsewhere };
}

const results = [];

/* Tu do do lech trang cho ban sao: chon do lech cho nhieu lieu khop nhat. */
for (const docId of AUTO_OFFSET) {
  if (!pagesOf(docId)) continue;
  const regs = ALL_REGIMENS.filter((r) => r.source.doc === docId);
  let best = { off: 0, found: -1 };
  for (let off = -30; off <= 30; off++) {
    OFFSET[docId] = off;
    let found = 0;
    for (const reg of regs) {
      const range = /PDF/.test(reg.source.page) ? null : pageRange(reg.source.page);
      found += checkSegments(reg.drugs.map((d) => `${d.name}: ${d.dose}`), docId, range).found;
    }
    if (found > best.found || (found === best.found && Math.abs(off) < Math.abs(best.off))) best = { off, found };
  }
  OFFSET[docId] = best.off;
  OFFSET_CHOSEN[docId] = best.off;
}

function statusOf(c, hasText) {
  if (!hasText && c.total === 0) return "no-official-text";
  if (c.total === 0 && c.unverifiable === 0) return "no-dose";
  if (c.missing.length > 0) return "mismatch";
  if (c.unverifiable > 0) return "partial";
  return "match";
}

for (const reg of ALL_REGIMENS) {
  const lines = reg.drugs.map((d) => `${d.name}: ${d.dose}`);
  const range = /PDF/.test(reg.source.page) ? null : pageRange(reg.source.page);
  const c = checkSegments(lines, reg.source.doc, range);
  const hasText = !!pagesOf(reg.source.doc);
  const noDoseInData = tokensOf(lines.join(" ")).length === 0;
  const status = noDoseInData ? "no-dose" : statusOf(c, hasText);
  results.push({ kind: "byt", id: reg.id, doc: reg.source.doc, diseaseIds: reg.diseaseIds, tokens: c.total, found: c.found, missing: c.missing, unverifiable: c.unverifiable, status });
}

for (const scn of CAP_SCENARIOS) {
  for (const r of scn.regimens) {
    const c = checkSegments(r.drugs.map((d) => d.dose), "byt2147", [60, 63], true);
    results.push({ kind: "module-cap", id: r.id, doc: "byt2147", diseaseIds: ["v8-1"], tokens: c.total, found: c.found, missing: c.missing, unverifiable: c.unverifiable, elsewhere: c.elsewhere, status: statusOf(c, true) });
  }
}

for (const [kind, list] of Object.entries(HAPVAP_SCENARIOS)) {
  for (const scn of list) {
    for (const r of scn.regimens) {
      const c = checkSegments(r.drugs.map((d) => d.dose), "vnrs2023", kind === "hap" ? [53, 58] : [60, 64], true);
      results.push({ kind: `module-${kind}`, id: r.id, doc: "vnrs2023", diseaseIds: [kind === "hap" ? "v8-4" : "v8-5"], tokens: c.total, found: c.found, missing: c.missing, unverifiable: c.unverifiable, elsewhere: c.elsewhere, status: statusOf(c, true) });
    }
  }
}

for (const [docId, off] of Object.entries(OFFSET_CHOSEN)) console.log(`Do lech trang tu do ${docId}: ${off}`);
const summary = {};
for (const r of results) summary[r.status] = (summary[r.status] ?? 0) + 1;

const out = {
  generatedOn: new Date().toISOString().slice(0, 10),
  method:
    "Tìm từng liều (số + đơn vị) của phương án trong văn bản trang của bản PDF chính thức, cửa sổ trang trích dẫn ± 1. Không kiểm tra tên thuốc và cách dùng dạng chữ. Liều dẫn Dược thư (DTQG) không có bản chính thức → unverifiable.",
  sources: {
    byt708: "https://kcb.vn/upload/2005611/20210723/Hướng-dẫn-sử-dụng-kháng-sinh-Cập-nhật-lần-cuối-khi-in-09.01.2015.pdf",
    byt2147: "https://kcb.vn/upload/2005611/20260723/Huong_dan_CD_v__DT_VPMPCD_singed_5fa4c.pdf",
    byt2767: "https://kcb.vn/upload/2005611/20231028/2767__QD__HD_chan_doan_va_dieu_tri_COPD_2023final_signed_e5721.pdf",
    byt5642: "https://kcb.vn/upload/2005611/20210723//Truyen-nhiem-1.pdf",
    byt5643: "https://kcb.vn/upload/2005611/20210723//HD%C4%90T-TMH.pdf",
    byt1530: "https://kcb.vn/upload/2005611/20230421/QD_2023_1530_Quyet_dinh_ban_hanh_tai_lieu_chuyen_mon__Huong_dan_chan_doan_va_dieu_tri_Loet_ban_chan_do_dai_thao_duong__25013.pdf",
    vnrs2023: "https://hoihohapvietnam.org/upload/attach/VNRS-20231130151558.pdf",
  },
  copies: COPIES,
  autoOffset: OFFSET_CHOSEN,
  summary,
  results,
};

console.log(JSON.stringify(summary));
for (const r of results.filter((x) => x.status === "mismatch")) console.log("MISMATCH", r.kind, r.id, r.doc, r.missing.join(", "));
if (write) {
  const file = path.join(ROOT, "data/antibiotics/empiric/verification/official-dose-check.json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out, null, 1) + "\n");
  console.log("Wrote", path.relative(ROOT, file));
}
