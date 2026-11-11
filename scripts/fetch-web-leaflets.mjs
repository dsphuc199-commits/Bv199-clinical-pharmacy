/*
  Lay thong tin HDSD tu trang web cong khai cho cac thuoc KHONG co HDSD tren Cong Cuc Quan ly Duoc.

  Nguon (chi doc sitemap + trang san pham, tuan thu robots.txt; khong dung trang tim kiem bi cam):
    1. thuocbietduoc.com.vn   (uu tien: noi dung sat HDSD, co So dang ky trong du lieu cau truc)
    2. trungtamthuoc.com
  KHONG dung Pharmacity (Content-Signal cam AI) va Long Chau (chan truy cap tu dong).

  Chi CHAP NHAN trang khi So dang ky tren trang TRUNG voi SDK cua thuoc trong danh muc
  (so trong danh muc, so moi/so cu theo Cuc QLD) -> tranh gan nham san pham khac cung ten.

  Dau ra: data/web-leaflets/<productId>.json (cung dinh dang muc voi data/leaflets), luon "CAN THAM DINH".
  Chay:   WEB_CACHE=<thu muc tam> node scripts/fetch-web-leaflets.mjs [--force] [--limit N] [--only <productId>]
*/
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = process.env.WEB_CACHE || join(ROOT, ".web-cache");
const OUT_DIR = join(ROOT, "data", "web-leaflets");
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const RETRY = args.includes("--retry-missing");
const RELAXED = args.includes("--relaxed");
const UA = "Mozilla/5.0 (compatible; BV199-Clinical-Pharmacy/1.0)";
const MAX_CANDIDATES = 6;
const DELAY_MS = 600;

mkdirSync(join(CACHE, "pages"), { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const plain = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
const slugify = (s) => plain(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const normSdk = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

/* ---------- Tai trang (co cache) ---------- */
const lastHit = new Map();
async function get(url, { cache = true } = {}) {
  const file = join(CACHE, "pages", createHash("sha1").update(url).digest("hex") + ".html");
  if (cache && existsSync(file)) return readFileSync(file, "utf8");
  const host = new URL(url).host;
  const wait = (lastHit.get(host) ?? 0) + DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastHit.set(host, Date.now());
  for (let a = 0; a < 3; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "vi" }, redirect: "follow", signal: AbortSignal.timeout(45000) });
      if (res.status === 404) { if (cache) writeFileSync(file, ""); return ""; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      if (cache) writeFileSync(file, html);
      return html;
    } catch (e) {
      if (a === 2) { console.log(`  ! ${url}: ${e.message}`); return null; }
      await sleep(3000 * (a + 1));
    }
  }
}

async function sitemapUrls(name, indexUrls) {
  const file = join(CACHE, `${name}-urls.json`);
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  const urls = new Set();
  for (const u of indexUrls) {
    const xml = (await get(u, { cache: false })) || "";
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) urls.add(m[1].replace(/&amp;/g, "&"));
  }
  const list = [...urls];
  writeFileSync(file, JSON.stringify(list));
  return list;
}

/* ---------- HTML -> van ban ---------- */
const ENT = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", ndash: "–", mdash: "—", hellip: "…", deg: "°", micro: "µ", plusmn: "±", ge: "≥", le: "≤", times: "×" };
function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n] ?? ENT[n.toLowerCase()] ?? accented(n) ?? m);
}

/* Thuc the HTML co dau: &agrave; &Ecirc; &otilde; ... -> ky tu Unicode. */
const MARKS = { grave: "̀", acute: "́", circ: "̂", tilde: "̃", uml: "̈", ring: "̊", cedil: "̧" };
function accented(name) {
  const m = name.match(/^([a-zA-Z])(grave|acute|circ|tilde|uml|ring|cedil)$/);
  return m ? (m[1] + MARKS[m[2]]).normalize("NFC") : undefined;
}
function htmlToText(html) {
  return decode(
    html
      .replace(/<(script|style|noscript|svg|button|form)[^]*?<\/\1>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<\/(p|div|li|tr|h\d|ul|ol|table)>/gi, "\n")
      .replace(/<\/t[dh]>/gi, " | ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* Tieu de muc tren web -> khoa muc chuan (giong data/leaflets). null = bo qua muc (gia, mua o dau, ...). */
function webHeadingKey(title) {
  const p = plain(title);
  if (/gia bao nhieu|mua .*o dau|o dau (ban|mua)|nha san xuat|tai lieu tham khao|hinh anh|thong tin ve hoat chat|san pham tuong tu|hoi dap|danh gia|uu diem|nhuoc diem|so sanh|tin tuc|bai viet/.test(p)) return null;
  if (/chong chi dinh/.test(p)) return "chongChiDinh";
  if (/qua lieu|quen lieu/.test(p)) return "quaLieu";
  if (/tuong tac/.test(p)) return "tuongTac";
  if (/tuong ky/.test(p)) return "tuongKy";
  if (/tac dung phu|tac dung khong mong muon|phan ung (phu|co hai|bat loi)/.test(p)) return "tacDungPhu";
  if (/lieu (dung|luong)|cach dung/.test(p)) return "lieuDung";
  if (/chi dinh|cong dung/.test(p)) return "chiDinh";
  if (/phu nu co thai|thai ky|mang thai|cho con bu/.test(p)) return "thaiKy";
  if (/lai xe|van hanh may/.test(p)) return "laiXe";
  if (/than trong|luu y|canh bao|chu y de phong|chu y khi/.test(p)) return "canhBao";
  if (/duoc luc/.test(p)) return "duocLuc";
  if (/duoc dong/.test(p)) return "duocDong";
  if (/bao quan/.test(p)) return "baoQuan";
  if (/thanh phan/.test(p)) return "thanhPhan";
  if (/dang bao che/.test(p)) return "dangBaoChe";
  if (/han (dung|su dung)/.test(p)) return "hanDung";
  if (/quy cach|dong goi/.test(p)) return "dongGoi";
  return undefined; // tieu de phu khong xac dinh: giu muc dang doc
}

function splitHtmlSections(html) {
  const parts = html.split(/(<h[2-4][^>]*>[^]*?<\/h[2-4]>)/i);
  const out = {};
  let cur = null;
  for (const part of parts) {
    const h = part.match(/^<h[2-4][^>]*>([^]*?)<\/h[2-4]>$/i);
    if (h) {
      const key = webHeadingKey(htmlToText(h[1]));
      if (key === null) cur = null;
      else if (key) cur = key;
      continue;
    }
    if (!cur) continue;
    const text = htmlToText(part);
    if (text.length <= 3) continue;
    // Trang co the lap lai cung noi dung (vd. "Chi dinh" trong khoi chi tiet va muc "Cong dung"): bo phan trung.
    const key = (s) => plain(s).replace(/[^a-z0-9]/g, "");
    if (!out[cur]) out[cur] = text;
    else if (key(out[cur]).includes(key(text))) continue;
    else if (key(text).includes(key(out[cur]))) out[cur] = text;
    else out[cur] = `${out[cur]}\n${text}`;
  }
  // Tieu de dang dong chu thuong (vd. "Quá liều", "Bảo quản:") nam trong muc khac -> tach sang dung muc.
  for (const k of Object.keys(out)) {
    const keep = [];
    let target = k;
    for (const line of out[k].split("\n")) {
      const t = line.trim().replace(/:$/, "");
      const hk = t.length <= 40 && !/^[-+•–]/.test(t) ? webHeadingKey(t) : undefined;
      if (hk && hk !== target && plain(t).split(" ").length <= 6) { target = hk; continue; }
      if (target === k) keep.push(line);
      else out[target] = out[target] && out[target] !== "" ? `${out[target]}\n${line}` : line;
    }
    out[k] = keep.join("\n");
  }
  for (const k of Object.keys(out)) {
    out[k] = out[k]
      .split("\n")
      .map((l) => l.trim().replace(/\s*\|\s*$/, "").replace(/^\|\s*/, "").replace(/\s*\|\s*/g, " – ").trim())
      .filter((l) => !/^(null|undefined|-|–)$/i.test(l))
      // Bo dong trong (trang web dung nhieu <div><br></div> gay gian dong roi rac) va dong quang cao.
      .filter((l) => l && !/(giá bao nhiêu|mua .* ở đâu|liên hệ|hotline|zalo|đặt hàng|tư vấn mua|©|&copy;|bản quyền|copyright)/i.test(l))
      .join("\n")
      .trim()
      .slice(0, 12000);
    if (out[k].length < 10) delete out[k];
  }
  // Bang thanh phan dang "1 hoạt chất / Tên hoạt chất / Hàm lượng" mat gia tri khi chuyen van ban -> bo (da co thanh phan tu danh muc/Cuc QLD).
  if (out.thanhPhan && /^\d+ hoạt chất\b|^Tên hoạt chất/m.test(out.thanhPhan)) delete out.thanhPhan;
  return out;
}

/* ---------- Trich theo tung trang ---------- */
const SITES = [
  {
    id: "thuocbietduoc",
    label: "Thuốc biệt dược (thuocbietduoc.com.vn)",
    sitemaps: async () => {
      const idx = (await get("https://thuocbietduoc.com.vn/sitemap.xml", { cache: false })) || "";
      return [...idx.matchAll(/<loc>([^<]*sitemap-drugs[^<]*)<\/loc>/g)].map((m) => m[1]);
    },
    slugOf: (u) => (u.match(/\/thuoc-\d+\/([^/?#]+)\.aspx/i) || [])[1] || "",
    sdk(html) {
      const m = html.match(/"name"\s*:\s*"Số đăng ký"\s*,\s*"value"\s*:\s*"([^"]+)"/) || htmlToText(html).match(/Số đăng ký\s*\n\s*([A-Z0-9][A-Z0-9\-\/ ]{4,30})/);
      return m ? m[1].trim() : null;
    },
    content(html) {
      const start = html.search(/<h2[^>]*id="section-1"/i);
      const body = start >= 0 ? html.slice(start) : html;
      // Truoc muc "section-1" la "Thong tin chi tiet" (Chi dinh/Chong chi dinh dang h3) -> lay ca khoi chi tiet.
      const detail = html.search(/Thông tin chi tiết về/);
      return detail >= 0 ? html.slice(detail) : body;
    },
  },
  {
    id: "trungtamthuoc",
    label: "Trung Tâm Thuốc (trungtamthuoc.com)",
    sitemaps: async () => Array.from({ length: 10 }, (_, i) => `https://trungtamthuoc.com/sitemap_pro${i + 1}.xml`),
    slugOf: (u) => (u.match(/trungtamthuoc\.com\/([^/?#]+)$/i) || [])[1] || "",
    sdk(html) {
      // Bang thong tin: <td>Số đăng ký<td>893210187625
      const m = html.match(/Số đăng ký\s*(?:<\/t[dh]>)?\s*<t[dh][^>]*>\s*([A-Z0-9][A-Z0-9\-\/ ]{4,30})/i) || htmlToText(html).match(/Số đăng ký[\s|:]*([A-Z0-9][A-Z0-9\-\/ ]{4,30})/);
      return m ? m[1].trim() : null;
    },
    content(html) {
      const i = html.search(/Tóm tắt nội dung|class="[^"]*(content|noi-dung)[^"]*"/i);
      return i >= 0 ? html.slice(i) : html;
    },
  },
];

/* Ung vien: slug chua cac tu khoa cua ten thuoc (bo don vi/ham luong de khong bo sot). */
function candidates(index, brandRaw, strength) {
  // Bo phan ghi chu trong ngoac (co so dong goi, dia chi...) khoi ten thuoc.
  const brand = String(brandRaw || "").replace(/\([^)]*\)?/g, " ").trim();
  const full = slugify(brand);
  const words = full.split("-").filter((w) => w.length > 1 && !/^(mg|ml|g|mcg|iu|vien|ong|lo|chai|tablets?|capsules?|injection)$/.test(w));
  if (!words.length) return [];
  // Tim theo ca tu dau tien va tu dac trung nhat (vd. "3B-Betalgine" -> "3b" va "betalgine").
  const longest = [...words].filter((w) => /[a-z]{3,}/.test(w)).sort((a, b) => b.length - a.length)[0];
  const heads = [...new Set([words[0], longest].filter(Boolean))];
  return [...new Set(heads.flatMap((h) => rank(index, h, words, full, brand, strength)))].slice(0, MAX_CANDIDATES + 2);
}

function rank(index, head, words, full, brand, strength) {
  const num = (plain(`${brand} ${strength}`).match(/\d+([.,]\d+)?/) || [""])[0].replace(",", ".");
  const scored = [];
  for (const [slug, url] of index) {
    if (!slug.includes(head)) continue;
    let score = 0;
    for (const w of words) if (slug.includes(w)) score += w.length;
    if (slug === full) score += 50;
    if (slug.startsWith(head)) score += 5;
    if (num && slug.replace(/-/g, ".").includes(num)) score += 4;
    if (score >= Math.min(full.replace(/-/g, "").length, 6)) scored.push({ url, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, MAX_CANDIDATES).map((x) => x.url);
}

/* Cung san pham theo ten + nha san xuat: slug trang = ten thuoc (bo phan trong ngoac), va trang co ten nha san xuat. */
const GENERIC_WORDS = /^(cong|ty|co|phan|tnhh|duoc|pham|trung|uong|tw|ltd|limited|pvt|inc|gmbh|sa|ag|spa|s|a|c|the|and|pharma|pharmaceutical|pharmaceuticals|laboratories|industries|corporation|corp|company|hoa|chi|nhanh|mot|thanh|vien|so|chuc|hang|nha|may|xuat|khau|nhap|viet|nam)$/;
function sameProductByName(site, url, html, p) {
  const brandSlug = slugify(String(p.brandName || "").replace(/\([^)]*\)?/g, " "));
  const slug = site.slugOf(url).replace(/^thuoc-/, "");
  if (!brandSlug || brandSlug.length < 4) return false;
  if (slug !== brandSlug && slug !== `${brandSlug}-${slugify(p.strength || "")}`) return false;
  const words = slugify(p.manufacturer || "").split("-").filter((w) => w.length >= 3 && !GENERIC_WORDS.test(w));
  if (!words.length) return false;
  const page = slugify(htmlToText(html).slice(0, 20000));
  return words.filter((w) => page.includes(w)).length >= Math.min(2, words.length);
}

/* ---------- Chay ---------- */
const products = JSON.parse(readFileSync(join(ROOT, "data", "drug-products.json"), "utf8"));
const registry = JSON.parse(readFileSync(join(ROOT, "data", "drug-registry.json"), "utf8")).items;
const leafletOk = new Set();
for (const f of existsSync(join(ROOT, "data", "leaflets")) ? readdirSync(join(ROOT, "data", "leaflets")) : []) {
  const x = JSON.parse(readFileSync(join(ROOT, "data", "leaflets", f), "utf8"));
  if (!x.failed) leafletOk.add(x.davId);
}

// Thuoc can lay tu web: khong co HDSD Cuc QLD trich duoc.
const seen = new Set();
const todo = products.filter((p) => {
  if (seen.has(p.id)) return false;
  seen.add(p.id);
  if (ONLY) return p.id === ONLY;
  const rec = registry[p.id];
  if (rec && !rec.notFound && leafletOk.has(rec.davId)) return false;
  const file = join(OUT_DIR, `${p.id}.json`);
  if (FORCE || !existsSync(file)) return true;
  // --retry-missing: tim lai cac thuoc lan truoc chua thay (vd. sau khi sua bo nhan dang).
  return RETRY && JSON.parse(readFileSync(file, "utf8")).notFound === true;
}).slice(0, LIMIT);

const indexes = {};
for (const site of SITES) {
  const urls = await sitemapUrls(site.id, await site.sitemaps());
  indexes[site.id] = urls.map((u) => [site.slugOf(u), u]).filter(([s]) => s);
  console.log(`${site.id}: ${indexes[site.id].length} trang san pham`);
}
console.log(`Can tim: ${todo.length} thuoc`);

let found = 0;
let n = 0;
async function work(p) {
  const rec = registry[p.id];
  const wanted = new Set(
    [...String(p.registrationNumber || "").split(/[\s();,]+/), rec?.soDangKy, rec?.soDangKyCu, rec?.thayTheSdk]
      .map(normSdk)
      .filter((x) => x.length >= 6),
  );
  let result = null;
  // Ung vien theo ten biet duoc; them ung vien theo ten hoat chat (trang co the dat ten khac). Van bat buoc trung SDK.
  const ingredient = String(p.ingredientName || "").split(/[;,(+]/)[0].replace(/\d.*$/, "").trim();
  outer: for (const site of SITES) {
    const urls = [...new Set([
      ...candidates(indexes[site.id], p.brandName, p.strength),
      ...(RETRY && ingredient.length > 3 ? candidates(indexes[site.id], ingredient, p.strength) : []),
    ])];
    for (const url of urls) {
      const html = await get(url);
      if (!html) continue;
      const sdk = site.sdk(html);
      let matchedBy = "sdk";
      if (!sdk || !wanted.has(normSdk(sdk))) {
        // --relaxed: chap nhan khi trang TRUNG TEN thuoc (slug) va ghi DUNG nha san xuat (thuong la cung san pham doi SDK).
        if (!RELAXED || !sameProductByName(site, url, html, p)) continue;
        matchedBy = "ten-nha-san-xuat";
      }
      const sections = splitHtmlSections(site.content(html));
      if (Object.keys(sections).length < 2) continue;
      const title = decode((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "").trim();
      result = { site, url, sdk, sections, title, matchedBy };
      break outer;
    }
  }
  n++;
  const out = result
    ? {
        productId: p.id,
        brandName: p.brandName,
        soDangKy: result.sdk,
        matchedBy: result.matchedBy,
        source: { title: result.title || p.brandName, url: result.url, site: result.site.label },
        method: "web",
        extractedAt: new Date().toISOString().slice(0, 10),
        reviewed: false,
        sections: result.sections,
      }
    : { productId: p.id, brandName: p.brandName, notFound: true, tried: [...wanted], extractedAt: new Date().toISOString().slice(0, 10) };
  writeFileSync(join(OUT_DIR, `${p.id}.json`), JSON.stringify(out, null, 1));
  if (result) found++;
  console.log(`[${n}/${todo.length}] ${result ? "OK " + result.site.id : "-- khong thay"} | ${p.brandName}`);
}

// Moi trang web co gioi han toc do rieng (DELAY_MS/host); chay 3 thuoc song song.
const queue = [...todo];
await Promise.all(Array.from({ length: 3 }, async () => { while (queue.length) await work(queue.shift()); }));
console.log(`Xong: tim thay ${found}/${todo.length}`);
await import("./build-leaflet-index.mjs"); // cap nhat chi muc cho trang danh sach
