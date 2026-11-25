/*
  Trích Phụ lục I Thông tư 20/2022/TT-BYT (danh mục thuốc hóa dược, sinh phẩm thuộc phạm vi BHYT; tỷ lệ, điều kiện
  thanh toán) thành data/bhyt-tt20.json – NGUYÊN VĂN, không diễn giải.
  - Ranh giới ô lấy từ ĐƯỜNG KẺ BẢNG nhận diện trên ảnh trang (ô gộp: một ghi chú dùng chung cho nhiều thuốc, một thuốc
    nhiều đường dùng mỗi đường một dòng hạng riêng).
  - Cột: STT | tên hoạt chất | đường dùng | hạng 4 (đặc biệt, I) | 5 (II) | 6 (III, IV) | 7 (trạm y tế xã) | ghi chú (cột 8).
  - Thuốc có dấu (*) sau tên: phải hội chẩn trước khi sử dụng (Điều 5 khoản 7).
  Chạy: LEAFLET_TOOLS=<tools> node scripts/build-bhyt-tt20.mjs "<20_2022_TT-BYT.pdf>"
*/
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOOLS = process.env.LEAFLET_TOOLS;
const mod = (p) => import(pathToFileURL(join(TOOLS, "node_modules", p)).href);
const { getDocument } = await mod("pdfjs-dist/legacy/build/pdf.mjs");
const { createCanvas } = await mod("@napi-rs/canvas/index.js");
const pdf = await getDocument({ data: new Uint8Array(readFileSync(process.argv[2])), verbosity: 0 }).promise;

const S = 2;
/* Biên cột (pt) – đo trên trang mẫu. */
const COL = { stt: [70, 104], name: [104, 255], route: [255, 333], h: [[333, 352], [352, 375], [375, 398], [398, 420]], note: [420, 560] };
const inside = (x, [a, b]) => x >= a && x < b;

/* Đường kẻ ngang trong một dải x (tỉ lệ ảnh), trả về y (pt, hệ PDF: gốc dưới). */
function hRules(img, CW, CH, x0, x1, H) {
  const dark = (x, y) => { const o = (y * CW + x) * 4; return img.data[o] < 160 && img.data[o + 1] < 160 && img.data[o + 2] < 160; };
  const a = Math.round(x0 * S) + 3, b = Math.round(x1 * S) - 3, need = (b - a) * 0.8;
  const ys = [];
  for (let y = 0; y < CH; y++) {
    let n = 0;
    for (let x = a; x < b; x++) if (dark(x, y)) n++;
    if (n >= need) ys.push(y);
  }
  const merged = [];
  for (const y of ys) if (!merged.length || y - merged[merged.length - 1] > 3) merged.push(y);
  return merged.map((y) => H - y / S);
}

/* Ghép các mảnh chữ trong một ô: cùng dòng (|dy| nhỏ) theo x; chèn dấu cách khi có khoảng trống. */
function cellText(items) {
  const lines = [];
  for (const it of items.sort((p, q) => q.y - p.y || p.x - q.x)) {
    const l = lines.find((L) => Math.abs(L.y - it.y) < 3);
    if (l) l.parts.push(it); else lines.push({ y: it.y, parts: [it] });
  }
  return lines.sort((p, q) => q.y - p.y).map((L) => {
    let s = "", end = -1e9;
    for (const p of L.parts.sort((a, b) => a.x - b.x)) {
      if (s && p.x - end > 1.2 && !/\s$/.test(s) && !/^\s/.test(p.s)) s += " ";
      s += p.s; end = p.x + p.w;
    }
    return s.trim();
  }).join("\n");
}
const clean = (s) => s.normalize("NFC").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim();
/* Xuống dòng ngay sau dấu gạch nối ("DL-lysin-⏎acetylsalicylat") là ngắt dòng trong cùng một từ: nối liền. */
const oneLine = (s) => clean(s).replace(/-\n/g, "-").replace(/\n+/g, " ").replace(/\s+([,.;:)])/g, "$1").replace(/\(\s+/g, "(").trim();

const drugs = [];
let group = "", sub = "", last = null;
const startPage = 11, endPage = 83;
for (let n = startPage; n <= endPage; n++) {
  const page = await pdf.getPage(n);
  const vp = page.getViewport({ scale: 1 }), H = vp.height;
  const vpS = page.getViewport({ scale: S });
  const canvas = createCanvas(Math.ceil(vpS.width), Math.ceil(vpS.height));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vpS }).promise;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const tc = await page.getTextContent();
  const items = tc.items.filter((i) => i.str.trim()).map((i) => ({ x: i.transform[4], y: i.transform[5], w: i.width || 0, s: i.str }));
  page.cleanup();

  /* Ranh giới hàng theo cột tên (hàng thuốc / tiêu đề nhóm), cột đường dùng (dòng đường dùng con), cột ghi chú (ô gộp). */
  const rName = hRules(img, canvas.width, canvas.height, ...COL.name, H).sort((a, b) => b - a);
  const rRoute = hRules(img, canvas.width, canvas.height, ...COL.route, H).sort((a, b) => b - a);
  const rNote = hRules(img, canvas.width, canvas.height, ...COL.note, H).sort((a, b) => b - a);
  if (rName.length < 2) continue;
  const segs = (rules) => rules.slice(0, -1).map((top, i) => ({ top, bot: rules[i + 1] }));
  const inSeg = (it, s) => it.y < s.top - 0.5 && it.y > s.bot + 0.5;
  /* Trang nối tiếp KHÔNG có đường kẻ trên cùng: nếu vùng trên đường kẻ đầu tiên có số STT thì đó là một hàng thuốc mới
     (thêm đường kẻ ảo ở đỉnh vùng chữ cho cả 3 cột); nếu không, đó là phần nối tiếp hàng cuối của trang trước. */
  const above = items.filter((it) => it.y > rName[0] + 0.5 && it.y < H - 40);
  if (above.some((it) => inside(it.x, COL.stt) && /^\d+$/.test(it.s.trim()))) {
    const top = Math.max(...above.map((it) => it.y)) + 12;
    for (const r of [rName, rRoute, rNote]) r.unshift(top);
  }
  const topCut = rName[0];
  const carry = items.filter((it) => it.y > topCut + 0.5 && it.y < H - 40);
  const headText = oneLine(cellText(carry));
  if (carry.length && (/^\d+\.\d+(\.\d+)?\.?\s/.test(headText) || /^\d+\.\s+\p{Lu}/u.test(headText))) {
    /* Đầu trang là tiêu đề nhóm (không có đường kẻ trên cùng): ghi nhận nhóm, không nối vào thuốc trước. */
    if (/^\d+\.\d+/.test(headText)) sub = headText; else { group = headText; sub = ""; }
  } else if (last && carry.length) {
    const plusY = carry.filter((it) => it.s.trim() === "+" && it.x >= COL.h[0][0] && it.x < COL.h[3][1]).map((it) => it.y);
    const lastRoute = last.routes[last.routes.length - 1];
    const sharesNote = (r) => r.noteIds.some((id) => lastRoute.noteIds.includes(id));
    const t = (its, c) => clean(cellText(its.filter((it) => inside(it.x, c))));
    if (plusY.length) {
      /* Dòng đường dùng mới của thuốc trước (vắt trang), có hạng riêng. Chữ ghi chú nằm phía trên dòng "+" là phần
         nối tiếp ghi chú của đường dùng trước. */
      const y0 = Math.max(...plusY) + 3;
      const before = carry.filter((it) => it.y > y0), row = carry.filter((it) => it.y <= y0);
      const prevNote = t(before, COL.note);
      if (prevNote) last.routes.forEach((r) => { if (sharesNote(r) || r === lastRoute) r.note += "\n" + prevNote; });
      last.routes.push({ route: oneLine(t(row, COL.route)), hang: COL.h.map((c) => row.some((it) => it.s.trim() === "+" && inside(it.x, c))), note: t(row, COL.note), noteIds: [`${n}-carry`] });
    } else {
      const name = t(carry, COL.name), route = t(carry, COL.route), note = t(carry, COL.note);
      if (name) last.name += " " + name;
      if (route) lastRoute.route += " " + route;
      if (note) last.routes.forEach((r) => { if (sharesNote(r) || r === lastRoute) r.note += "\n" + note; });
    }
  }
  /* Ô ghi chú trên trang (có thể gộp nhiều hàng). */
  const noteCells = segs(rNote).map((s, i) => ({ id: `${n}-${i}`, ...s, text: clean(cellText(items.filter((it) => inside(it.x, COL.note) && inSeg(it, s)))) }));
  for (const seg of segs(rName)) {
    const its = items.filter((it) => inSeg(it, seg));
    const stt = clean(cellText(its.filter((it) => inside(it.x, COL.stt))));
    const name = oneLine(cellText(its.filter((it) => inside(it.x, COL.name))));
    const hasPlus = its.some((it) => it.s.trim() === "+" && it.x >= COL.h[0][0] && it.x < COL.h[3][1]);
    if (!stt && !hasPlus) {
      /* Tiêu đề nhóm: "6.2.1. Thuốc nhóm beta-lactam" hoặc "6. THUỐC ..." (chữ trải sang cột khác). */
      const full = oneLine(cellText(its));
      if (/^\d+\.\d+(\.\d+)?\.?\s/.test(full) || /^Thuốc điều trị lao kháng thuốc/.test(full)) sub = full;
      else if (/^\d+\.\s/.test(full)) { group = full; sub = ""; }
      continue;
    }
    if (!stt) continue;
    /* Dòng đường dùng con trong hàng thuốc. */
    const rs = segs(rRoute).filter((r) => r.top <= seg.top + 1 && r.bot >= seg.bot - 1);
    const routeRows = (rs.length ? rs : [seg]).map((r) => {
      const ri = its.filter((it) => inSeg(it, r));
      const hang = COL.h.map((c) => ri.some((it) => it.s.trim() === "+" && inside(it.x, c)));
      const cells = noteCells.filter((c) => c.top > r.bot + 1 && c.bot < r.top - 1);
      return { route: oneLine(cellText(ri.filter((it) => inside(it.x, COL.route)))), hang, note: cells.map((c) => c.text).filter(Boolean).join("\n"), noteIds: cells.map((c) => c.id) };
    });
    last = { stt: Number(stt.replace(/\D/g, "")), name, group, sub, page: n, routes: routeRows };
    drugs.push(last);
  }
}
/* Bỏ hàng tiêu đề bảng ("Tên hoạt chất", "(2)") lặp ở đầu bảng. */
for (let i = drugs.length - 1; i >= 0; i--) if (/^(\(\d\)|Tên hoạt chất)$/.test(drugs[i].name)) drugs.splice(i, 1);
for (const d of drugs) {
  d.consult = /\*/.test(d.name);
  d.name = d.name.replace(/\s*\(\*\)|\*/g, "").trim();
  d.routes = d.routes.map(({ route, hang, note }) => ({ route: oneLine(route), hang, note: oneLine(note) }));
}
writeFileSync(join(ROOT, "data", "bhyt-tt20.json"), JSON.stringify({
  source: "Bộ Y tế. Thông tư 20/2022/TT-BYT ngày 31/12/2022 – Danh mục và tỷ lệ, điều kiện thanh toán đối với thuốc hóa dược, sinh phẩm, thuốc phóng xạ và chất đánh dấu thuộc phạm vi được hưởng của người tham gia bảo hiểm y tế (Phụ lục I). Hiệu lực từ 01/03/2023.",
  hangLabels: ["Hạng đặc biệt, hạng I", "Hạng II", "Hạng III, IV", "Trạm y tế xã"],
  extractedAt: new Date().toISOString().slice(0, 10),
  items: drugs,
}, null, 1));
console.log("Thuoc:", drugs.length, "| STT max:", Math.max(...drugs.map((d) => d.stt)));
