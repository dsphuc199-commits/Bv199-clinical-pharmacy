/*
  Chi muc nho cho trang danh sach thuoc: data/leaflet-index.json
    ok     : davId co HDSD Cuc QLD trich duoc
    failed : davId co file HDSD nhung Cong Cuc QLD bao loi
    web    : productId co thong tin HDSD tu trang web (khop so dang ky)
  Chay sau scripts/extract-leaflets.mjs va scripts/fetch-web-leaflets.mjs:  node scripts/build-leaflet-index.mjs
*/
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (dir) =>
  existsSync(join(ROOT, "data", dir))
    ? readdirSync(join(ROOT, "data", dir)).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(ROOT, "data", dir, f), "utf8")))
    : [];

const dav = read("leaflets");
const web = read("web-leaflets");
const index = {
  ok: dav.filter((x) => !x.failed).map((x) => x.davId).sort((a, b) => a - b),
  failed: dav.filter((x) => x.failed).map((x) => x.davId).sort((a, b) => a - b),
  web: web.filter((x) => !x.notFound).map((x) => x.productId).sort(),
};
/* Thuoc chua co HDSD rieng -> chon 1 thuoc khac trong danh muc CUNG hoat chat + CUNG duong dung da co HDSD
   (uu tien cung dang bao che, cung ham luong, nguon Cuc QLD) de hien thi tham khao, ghi ro la cua thuoc khac. */
const plain = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase().trim();
/* Bo tien to "Mỗi ống 2ml chứa:" truoc ten hoat chat. */
const stripPrefix = (s) => s.replace(/^.*?\bchua\s*:\s*/, "");
const ingredientKey = (p) => stripPrefix(plain(p.ingredientName)).replace(/\([^)]*\)?/g, " ").replace(/chlor/g, "clor").replace(/ph/g, "f").replace(/\d.*$/, "").replace(/\s+/g, " ").trim();
/* Thuoc 1 hoat chat (bo phan trong ngoac nhu "dưới dạng ..."); loai phoi hop va duoc lieu dang cao/hon hop. */
const singleIngredient = (p) => {
  const ing = stripPrefix(plain(p.ingredientName)).replace(/\([^)]*\)?/g, " ");
  return !/[;,+&/]| va | voi /.test(ing) && !/^(cao|bot|hon hop|duoc lieu)\b|duoc lieu|cao (dac|kho|long)/.test(ing) && ingredientKey(p).length >= 4;
};
const routeKey = (p) => plain(p.route).replace(/tiem truyen tinh mach|truyen tinh mach|tiem truyen/, "tiem truyen");
const products = JSON.parse(readFileSync(join(ROOT, "data", "drug-products.json"), "utf8"));
const registry = JSON.parse(readFileSync(join(ROOT, "data", "drug-registry.json"), "utf8")).items;
const davOk = new Set(index.ok);
const webOk = new Set(index.web);
const sourceOf = (p) => {
  const rec = registry[p.id];
  if (rec && !rec.notFound && davOk.has(rec.davId)) return "dav";
  return webOk.has(p.id) ? "web" : null;
};
/* Thuoc phoi hop (khong phai duoc lieu): khoa = bo hoat chat da sap xep, vd. "acid clavulanic+amoxicilin". */
const isHerbal = (p) => /cao (dac|kho|long)|duoc lieu|hon hop|tuong (duong|ung) voi/.test(plain(p.ingredientName) + " " + plain(p.strength));
const comboKey = (p) => {
  if (isHerbal(p)) return null;
  const parts = stripPrefix(plain(p.ingredientName)).replace(/\([^)]*\)?/g, " ").replace(/chlor/g, "clor").replace(/ph/g, "f")
    .split(/[;,+&/]| va | voi /)
    .map((s) => s.replace(/\d.*$/, "").replace(/\s+/g, " ").trim())
    .filter((s) => s.length >= 3);
  // 2-4 hoat chat (thuoc phoi hop tan duoc); >4 thanh phan thuong la bai thuoc dong duoc -> khong ghep.
  return parts.length >= 2 && parts.length <= 4 ? [...new Set(parts)].sort().join("+") : null;
};
const groups = new Map();
const unique = [...new Map(products.map((p) => [p.id, p])).values()];
for (const p of unique) {
  const src = sourceOf(p);
  const ing = ingredientKey(p);
  // Chi ghep hoat chat don (khong ghep thuoc phoi hop nhieu hoat chat de tranh nham).
  if (!src) continue;
  const combo = comboKey(p);
  if (combo) groups.set(`${combo}|${routeKey(p)}`, [...(groups.get(`${combo}|${routeKey(p)}`) || []), { p, src }]);
  if (!singleIngredient(p)) continue;
  const k = `${ing}|${routeKey(p)}`;
  groups.set(k, [...(groups.get(k) || []), { p, src }]);
}
const siblings = {};
for (const p of unique) {
  if (sourceOf(p)) continue;
  const combo = comboKey(p);
  if (!combo && !singleIngredient(p)) continue;
  const list = groups.get(`${combo ?? ingredientKey(p)}|${routeKey(p)}`);
  if (!list) continue;
  // Nhom phu thuoc nong do (dich truyen, dien giai, insulin, heparin) hoac ham luong dang %: bat buoc cung ham luong.
  const critical = /natri clorid|kali clorid|glucose|dextrose|magnesi sulfat|calci clorid|calci gluconat|natri bicarbonat|natri hydrocarbonat|ringer|insulin|heparin|kali clorid|albumin|nhu dich|lipid|acid amin|amino|sodium|potassium|manitol|mannitol/.test(ingredientKey(p)) || /%/.test(`${p.strength} ${p.brandName}`) || /truyen/.test(routeKey(p));
  const sameStrength = (q) => plain(q.strength).replace(/\s+/g, "") === plain(p.strength).replace(/\s+/g, "");
  const pool = critical ? list.filter(({ p: q }) => sameStrength(q)) : list;
  if (!pool.length) continue;
  const score = ({ p: q, src }) => (plain(q.dosageForm) === plain(p.dosageForm) ? 4 : 0) + (plain(q.strength) === plain(p.strength) ? 3 : 0) + (src === "dav" ? 1 : 0);
  const best = [...pool].sort((a, b) => score(b) - score(a))[0];
  siblings[p.id] = { id: best.p.id, brand: best.p.brandName, strength: best.p.strength || "", form: best.p.dosageForm || "", src: best.src };
}
index.siblings = siblings;

writeFileSync(join(ROOT, "data", "leaflet-index.json"), JSON.stringify(index));
console.log(`HDSD Cuc QLD: ${index.ok.length} | file loi: ${index.failed.length} | tu web: ${index.web.length} | web khong thay: ${web.length - index.web.length} | tham khao cung hoat chat: ${Object.keys(siblings).length}`);
