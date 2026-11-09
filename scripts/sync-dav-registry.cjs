/*
  Dong bo danh muc thuoc (data/drug-products.json) voi Cong tra cuu thuoc - Cuc Quan ly Duoc
  (https://dichvucong.dav.gov.vn/congbothuoc/index), tra theo so dang ky.

  Ket qua: data/drug-registry.json  { syncedAt, source, items: { [productId]: RegistryRecord } }
  Chay:    node scripts/sync-dav-registry.cjs            (chay lai chi tra cac thuoc chua co)
           node scripts/sync-dav-registry.cjs --all      (tra lai toan bo)
*/
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const PRODUCTS = path.join(ROOT, "data", "drug-products.json");
const OUT = path.join(ROOT, "data", "drug-registry.json");
const API = "https://dichvucong.dav.gov.vn/api/services/app/soDangKy/GetAllPublicServerPaging";
const FILE_VIEW = "https://dichvucong.dav.gov.vn/File/GoToViewTaiLieu?url=";
const CONCURRENCY = 3;
const DELAY_MS = 350;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s || "").toUpperCase().replace(/\s+/g, "");

/* "893110467624 (VD-24694-16)" -> ["893110467624", "VD-24694-16"] */
function candidateNumbers(raw) {
  return [...new Set(String(raw || "").split(/[\s();,]+/).map((x) => x.trim()).filter((x) => /\d/.test(x) && x.length >= 6))];
}

function parseFiles(json) {
  if (!json) return [];
  let list;
  try { list = JSON.parse(json); } catch { list = [{ duongDanTep: json }]; }
  if (!Array.isArray(list)) list = [list];
  return list
    .filter((f) => f && f.duongDanTep)
    .map((f) => ({ title: f.moTaTep || "", url: fileUrl(f.duongDanTep) }));
}

/* Duong dan tren cong da co the chua ky tu ma hoa san (vd. "%2c"): giai ma truoc roi ma hoa 1 lan. */
function fileUrl(p) {
  let raw = String(p).replace(/\\+/g, "\\");
  try { raw = decodeURIComponent(raw); } catch { /* giu nguyen */ }
  return FILE_VIEW + encodeURIComponent(raw);
}

const day = (s) => (s ? String(s).slice(0, 10) : null);

function toRecord(it, matchedBy) {
  const dk = it.thongTinDangKyThuoc || {};
  const cb = it.thongTinThuocCoBan || {};
  const sx = it.congTySanXuat || {};
  const reg = it.congTyDangKy || {};
  const tl = it.thongTinTaiLieu || {};
  return {
    davId: it.id,
    matchedBy,
    tenThuoc: it.tenThuoc || null,
    soDangKy: it.soDangKy || null,
    soDangKyCu: it.soDangKyCu || null,
    hoatChat: cb.hoatChatChinh || it.hoatChatChinh || null,
    hamLuong: cb.hamLuong || it.hamLuong || null,
    dangBaoChe: cb.dangBaoChe || it.dangBaoChe || null,
    dongGoi: cb.dongGoi || it.dongGoi || null,
    tieuChuan: cb.tieuChuan || null,
    tuoiTho: cb.tuoiTho || null,
    coSoSanXuat: sx.tenCongTySanXuat || null,
    nuocSanXuat: sx.nuocSanXuat || null,
    coSoDangKy: reg.tenCongTyDangKy || null,
    ngayCap: day(dk.ngayCapSoDangKy),
    ngayHetHan: day(dk.ngayHetHanSoDangKy),
    soQuyetDinh: dk.soQuyetDinh || null,
    hetHan: it.isHetHan === true,
    daRutSoDangKy: it.isDaRutSoDangKy === true,
    // Ho so gia han da nop (thuoc co the tiep tuc luu hanh trong thoi gian xem xet gia han).
    hoSoGiaHan: it.maSoHoSoGiaHan || null,
    ngayNopGiaHan: day(it.ngayTiepNhanHSGiaHan),
    ngayGiaHan: day(dk.ngayGiaHanSoDangKy),
    hdsd: [...parseFiles(tl.urlHuongDanSuDung), ...parseFiles(tl.urlNhanVaHDSD)],
    mauNhan: parseFiles(tl.urlNhan),
  };
}

/* Tra theo truong cu the (nhanh ~1 s); filterText tim toan van rat cham (~10 s) nen chi dung cuoi cung. */
async function query(sdk, mode) {
  const filter = mode === "moi" ? { soDangKy: sdk } : mode === "cu" ? { soDangKyCu: sdk } : {};
  const filterText = mode === "toan-van" ? sdk : "";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "BV199-Clinical-Pharmacy/1.0" },
        body: JSON.stringify({ filterText, SoDangKyThuoc: filter, KichHoat: true, skipCount: 0, maxResultCount: 10, sorting: null }),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      return body?.result?.items || [];
    } catch {
      await sleep(2000 * (attempt + 1));
    }
  }
  return null; // loi mang: de lan chay sau thu lai
}

async function lookup(product) {
  const nums = candidateNumbers(product.registrationNumber);
  let networkError = false;
  for (const mode of ["moi", "cu", "toan-van"]) {
    for (const sdk of nums) {
      const items = await query(sdk, mode);
      await sleep(DELAY_MS);
      if (items === null) { networkError = true; continue; }
      const exact = items.find((x) => norm(x.soDangKy) === norm(sdk)) || items.find((x) => norm(x.soDangKyCu) === norm(sdk));
      if (exact && exact.isHetHan === true && norm(exact.soDangKy) === norm(sdk)) {
        // SDK trong danh muc da het han: tim SDK moi thay the (ban ghi co soDangKyCu = so nay).
        const next = await query(sdk, "cu");
        await sleep(DELAY_MS);
        const successor = (next || []).find((x) => norm(x.soDangKyCu) === norm(sdk) && x.isHetHan !== true && norm(x.soDangKy) !== norm(sdk));
        if (successor) return { ...toRecord(successor, sdk), thayTheSdk: sdk };
      }
      if (exact) return toRecord(exact, sdk);
    }
  }
  return networkError ? null : { notFound: true, tried: nums };
}

(async () => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS, "utf8"));
  const all = process.argv.includes("--all");
  const prev = !all && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")).items || {} : {};
  // --recheck-expired: tra lai cac thuoc het han/da rut (cap nhat ho so gia han, SDK moi thay the).
  const recheck = process.argv.includes("--recheck-expired");
  const todo = products.filter((p) => !prev[p.id] || prev[p.id].notFound || (recheck && (prev[p.id].hetHan || prev[p.id].daRutSoDangKy)));
  const items = { ...prev };
  let done = 0;
  const save = () => {
    const ordered = {};
    for (const p of products) if (items[p.id]) ordered[p.id] = items[p.id];
    fs.writeFileSync(OUT, JSON.stringify({ syncedAt: new Date().toISOString().slice(0, 10), source: "Cổng tra cứu thuốc – Cục Quản lý Dược (dichvucong.dav.gov.vn)", items: ordered }, null, 1));
  };

  const queue = [...todo];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const p = queue.shift();
      const rec = await lookup(p);
      if (rec) items[p.id] = rec;
      if (++done % 50 === 0) { save(); console.log(`${done}/${todo.length}`); }
    }
  }));
  save();

  const vals = Object.values(items);
  const found = vals.filter((x) => !x.notFound);
  console.log(JSON.stringify({
    products: products.length,
    found: found.length,
    notFound: vals.filter((x) => x.notFound).length,
    missing: products.length - vals.length,
    withHdsd: found.filter((x) => x.hdsd.length).length,
    withLabel: found.filter((x) => x.mauNhan.length).length,
    expired: found.filter((x) => x.hetHan).length,
    withdrawn: found.filter((x) => x.daRutSoDangKy).length,
  }, null, 1));
})();
