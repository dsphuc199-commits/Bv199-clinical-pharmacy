/*
  Thay the thuoc trong danh muc BV199: tim che pham CUNG HOAT CHAT (cung thanh phan) de dung khi het thuoc.
  Chi doi chieu du lieu danh muc (hoat chat, ham luong, duong dung, dang bao che); khong de xuat thuoc khac hoat chat.
*/
import drugProducts from "@/data/drug-products.json";

export type SubProduct = {
  id: string; brandName: string; ingredientName: string; strength: string; route: string;
  dosageForm: string; manufacturer: string; country: string; unit: string;
};

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
const UNIT = "(?:mg|mcg|µg|ug|g|ml|l|iu|ui|đv|dv|%|mmol|meq|kcal|trieu|million|tr|units?|dvqt|ius?)";
const STRENGTH = new RegExp(`\\d[\\d.,]*\\s*${UNIT}(?:\\s*\\/\\s*\\d*[\\d.,]*\\s*${UNIT})?`, "gi");
/* Muoi/dang hoa hoc khong lam doi hoat chat (de "amlodipin besilat" = "amlodipin"). */
const SALT = /\b(hydroclorid|hydrochlorid|hydrochloride|hcl|natri|sodium|kali|potassium|calci|calcium|magnesi|besilat|besylat|maleat|mesylat|mesilat|tartrat|succinat|fumarat|citrat|sulfat|sulphat|phosphat|acetat|dihydrat|monohydrat|trihydrat|hemihydrat|khan|anhydrous|bromid|clorid|nitrat|lactat|gluconat|propionat|furoat|dipropionat|valerat|base|dang|duoi|tuong ung|tuong duong|voi|chua|moi|vien|ong|lo|goi)\b/g;

function ingredientKey(raw: string): string {
  /* Insulin: hoa tan / isophane / tron san / analog khac nhau ve tac dung – chi gop khi mo ta thanh phan trung khop. */
  if (/^\s*insulin/i.test(plain(raw))) return plain(raw).replace(/[^a-z0-9%/ ]/g, " ").replace(/\s+/g, " ").trim();
  const parts = plain(raw)
    .replace(/^.*?\bchua\s*:/, "") // "Moi 500 ml dung dich chua: ..."
    .replace(/\([^)]*\)/g, " ") // ten muoi/dang trong ngoac
    .split(/;|\+|\s-\s|\bva\b|,(?!\d)/);
  const clean = (x: string) => x.replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  /* Ten Anh/Viet: "ceftriaxone" = "ceftriaxon", "amlodipine" = "amlodipin". */
  const spell = (x: string) => x.split(" ").map((w) => (w.length > 5 && /[^aeiou]e$/.test(w) ? w.slice(0, -1) : w)).join(" ");
  const names = parts
    .map((x) => {
      // Bo ham luong (giu so dinh lien chu: B12, D3); bo so le con lai.
      const noDose = spell(clean(x.replace(STRENGTH, " ").replace(/(?<![a-z\d])\d[\d.,]*/g, " ")));
      // Bo ten muoi, nhung neu ca thanh phan chi la muoi (vd "natri clorid", "kali clorid") thi giu nguyen.
      const noSalt = clean(noDose.replace(SALT, " "));
      return noSalt.length > 2 ? noSalt : noDose;
    })
    // "Vitamin B1 + B6 + B12": thanh phan viet tat B6, B12 -> "vitamin b6", "vitamin b12".
    .map((x, _i, all) => (/^b\d{1,2}$/.test(x) && all.some((y) => y.startsWith("vitamin")) ? `vitamin ${x}` : x))
    .filter((x) => x.length > 2);
  return [...new Set(names)].sort().join(" + ");
}

let cache: { groups: Map<string, SubProduct[]>; keyOf: Map<string, string> } | null = null;
function index() {
  if (cache) return cache;
  const groups = new Map<string, SubProduct[]>();
  const keyOf = new Map<string, string>();
  for (const p of drugProducts as (SubProduct & { ingredientName: string })[]) {
    const k = ingredientKey(p.ingredientName);
    if (!k) continue;
    keyOf.set(p.id, k);
    const v: SubProduct = { id: p.id, brandName: p.brandName, ingredientName: p.ingredientName, strength: p.strength, route: p.route, dosageForm: p.dosageForm, manufacturer: p.manufacturer, country: p.country, unit: p.unit };
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(v);
  }
  return (cache = { groups, keyOf });
}

/* Danh sach rut gon cho o tim kiem (client). */
export function substitutionCatalog() {
  const { groups, keyOf } = index();
  return (drugProducts as SubProduct[]).filter((p) => keyOf.has(p.id)).map((p) => ({
    id: p.id, brandName: p.brandName, ingredientName: p.ingredientName, strength: p.strength, route: p.route, dosageForm: p.dosageForm,
    manufacturer: p.manufacturer, country: p.country, unit: p.unit, key: keyOf.get(p.id)!, siblings: groups.get(keyOf.get(p.id)!)!.length - 1,
  }));
}
