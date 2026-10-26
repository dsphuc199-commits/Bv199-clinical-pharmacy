/*
  FILE: lib/antibiotics/formulary.ts

  Kiem tra hoat chat co trong danh muc thuoc BV199 hay khong.
  Du lieu: data/antibiotics/bv199-formulary-antimicrobials.json (sinh tu
  data/drug-products.json bang scripts/build-formulary-antimicrobials.mjs).

  San pham phoi hop duoc nhan dien o muc ca san pham (vd. "Amoxicilin ...;
  Acid clavulanic ...") de khong gan nham sang hoat chat don le. Phoi hop khong
  co trong du lieu Hieu chinh lieu (vd. cefoperazon + sulbactam) -> khong gan.
*/

import formulary from "@/data/antibiotics/bv199-formulary-antimicrobials.json";

import { findDrugs, normalizeForMatch } from "./drug-links";

export type FormularyProduct = {
  id: string;
  brandName: string;
  ingredientName: string;
  strength: string;
  route: string;
  dosageForm: string;
  sourceSheet: string;
};

/* Phoi hop: tat ca thanh phan phai co mat. id = null: phoi hop khong co du lieu. */
const COMBINATIONS: { parts: string[]; id: string | null }[] = [
  { parts: ["cefoperazon", "sulbactam"], id: null },
  { parts: ["amoxicilin", "sulbactam"], id: null },
  { parts: ["ceftazidim", "avibactam"], id: null },
  { parts: ["ceftolozan", "tazobactam"], id: null },
  { parts: ["imipenem", "relebactam"], id: null },
  { parts: ["meropenem", "vaborbactam"], id: null },
  { parts: ["amoxicilin", "clavulan"], id: "amoxicillin-clavulanate" },
  { parts: ["amoxicillin", "clavulan"], id: "amoxicillin-clavulanate" },
  { parts: ["ampicilin", "sulbactam"], id: "ampicillin-sulbactam" },
  { parts: ["ampicillin", "sulbactam"], id: "ampicillin-sulbactam" },
  { parts: ["piperacilin", "tazobactam"], id: "piperacillin-tazobactam" },
  { parts: ["piperacillin", "tazobactam"], id: "piperacillin-tazobactam" },
  { parts: ["ticarcilin", "clavulan"], id: "ticarcillin-clavulanate" },
  { parts: ["imipenem", "cilastatin"], id: "imipenem-cilastatin" },
  { parts: ["sulfamethoxazol", "trimethoprim"], id: "sulfamethoxazole-trimethoprim" },
];

function ingredientIdOf(product: FormularyProduct): string | undefined {
  const norm = normalizeForMatch(product.ingredientName);
  const words = new Set(norm.split(" "));
  const has = (part: string) =>
    words.has(part) || [...words].some((w) => w.startsWith(part));

  for (const combo of COMBINATIONS) {
    if (combo.parts.every(has)) return combo.id ?? undefined;
  }

  // Don chat: chi gan khi van ban san pham chi chua dung MOT hoat chat co du lieu.
  const found = findDrugs([product.ingredientName.replace(/;/g, ",")]);
  return found.length === 1 ? found[0].ingredientId : undefined;
}

const BY_INGREDIENT: Map<string, FormularyProduct[]> = (() => {
  const map = new Map<string, FormularyProduct[]>();
  for (const product of formulary.items as FormularyProduct[]) {
    const id = ingredientIdOf(product);
    if (!id) continue;
    const list = map.get(id);
    if (list) list.push(product);
    else map.set(id, [product]);
  }
  return map;
})();

export const FORMULARY_SOURCE: string = formulary.source;

export function formularyProducts(ingredientId: string): FormularyProduct[] {
  return BY_INGREDIENT.get(ingredientId) ?? [];
}

export function inFormulary(ingredientId: string): boolean {
  return BY_INGREDIENT.has(ingredientId);
}

export function formularyIngredientIds(): string[] {
  return Array.from(BY_INGREDIENT.keys());
}
