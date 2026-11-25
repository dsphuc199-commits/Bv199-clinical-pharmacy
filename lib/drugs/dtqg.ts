/*
  FILE: lib/drugs/dtqg.ts

  Ghép thuốc trong danh mục BV199 với chuyên luận Dược thư quốc gia Việt Nam 2023 đã trích nguyên văn:
  - data/renal-dtqg.json: liều ở người suy thận, chống chỉ định/thận trọng liên quan thận;
  - data/pregnancy-dtqg.json: thời kỳ mang thai, cho con bú.
  Ghép CHẶT để không gán nhầm chuyên luận: chỉ khớp khi bộ hoạt chất (bỏ muối, dạng muối, phần trong ngoặc) trùng
  hoàn toàn với tên Việt hoặc tên INN của chuyên luận. Không khớp thì không hiện – trang thuốc chỉ còn tờ HDSD gốc.
*/
import renal from "@/data/renal-dtqg.json";
import pregnancy from "@/data/pregnancy-dtqg.json";
import type { DtqgItem } from "@/lib/dosing/catalog";
import type { PregnancyItem } from "@/components/safety/PregnancyModule";

const RENAL = (renal as { source: string; items: DtqgItem[] }).items;
const PREG = (pregnancy as { source: string; items: PregnancyItem[] }).items;
export const DTQG_BOOK = (renal as { source: string }).source;

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
/* Muối, dạng muối và từ nối không thuộc tên hoạt chất. */
const SALT = new Set(["natri", "sodium", "kali", "potassium", "calci", "calcium", "magnesi", "hydroclorid", "hydrochlorid", "hydrochloride", "hcl",
  "dihydroclorid", "sulfat", "sulphate", "sulfate", "phosphat", "phosphate", "mesylat", "mesilat", "besylat", "besilat", "maleat", "fumarat",
  "tartrat", "succinat", "acetat", "citrat", "trihydrat", "monohydrat", "dihydrat", "hydrat", "bromid", "clorid", "nitrat", "lactat",
  "gluconat", "dinatri", "disodium", "hyclat", "pentahydrat"]);
/* Cùng hoạt chất, khác cách viết giữa danh mục và Dược thư. */
const ALIAS: Record<string, string> = { "acid clavulanic": "clavulanat", "clavulanic acid": "clavulanat", clavulanate: "clavulanat", acetaminophen: "paracetamol" };

/** Bộ hoạt chất chuẩn hóa: "Amoxicilin (dưới dạng ...) + Acid clavulanic" → "amoxicilin|clavulanat". */
export function ingredientKey(name: string): string {
  const parts = plain(name).replace(/\*/g, "").replace(/\([^)]*\)?/g, " ")
    .split(/\s*(?:\+|;|,|\bva\b|\band\b|\/)\s*/u)
    .map((p) => p.replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim())
    .map((p) => ALIAS[p] ?? p)
    .map((p) => p.split(" ").filter((w) => !SALT.has(w)).join(" "))
    .map((p) => ALIAS[p] ?? p)
    .filter(Boolean);
  return Array.from(new Set(parts)).sort().join("|");
}

function index<T extends { name: string; inn: string }>(items: T[]) {
  const m = new Map<string, T>();
  for (const it of items) for (const n of [it.name, it.inn]) { const k = ingredientKey(n); if (k && !m.has(k)) m.set(k, it); }
  return m;
}
const RENAL_BY = index(RENAL);
const PREG_BY = index(PREG);

export type DtqgMatch = { renal?: DtqgItem; pregnancy?: PregnancyItem };
/** Chuyên luận Dược thư của một hoạt chất trong danh mục (không khớp chặt thì trả về rỗng). */
export function dtqgFor(ingredientName?: string | null): DtqgMatch {
  if (!ingredientName) return {};
  const k = ingredientKey(ingredientName);
  return { renal: RENAL_BY.get(k), pregnancy: PREG_BY.get(k) };
}
