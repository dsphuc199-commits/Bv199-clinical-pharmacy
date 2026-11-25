import drugData from "@/data/drug-products.json";

export const DRUG_FIELDS = {
  drugCode: "Mã thuốc",
  brandName: "Tên thuốc",
  ingredientName: "Hoạt chất",
  strength: "Hàm lượng",
  dosageForm: "Dạng bào chế",
  route: "Đường dùng",
  registrationNumber: "Số đăng ký / GPNK",
  manufacturer: "Nhà sản xuất",
  country: "Nước sản xuất",
  packageSize: "Quy cách đóng gói",
  unit: "Đơn vị tính",
} as const;

export type DrugField = keyof typeof DRUG_FIELDS;
export type DrugFields = Record<DrugField, string>;
export type DrugProduct = DrugFields & { id: string; ingredientId: string; sourceSheet: string };
export type DrugPublication = { id: string; fields: DrugFields; active: boolean };
export type CatalogProduct = DrugProduct & { active: boolean; registryMatches: boolean };

export const BASE_DRUGS: DrugProduct[] = drugData;
export const DRUG_FIELD_KEYS = Object.keys(DRUG_FIELDS) as DrugField[];
export const DRUG_FIELD_MAX_LENGTH = 2048;
const baseById = new Map(BASE_DRUGS.map((drug) => [drug.id, drug]));

const REGISTRY_FIELDS: readonly DrugField[] = [
  "brandName", "ingredientName", "strength", "dosageForm", "route", "registrationNumber", "manufacturer", "country", "packageSize",
];

export function drugFields(drug: DrugFields): DrugFields {
  return Object.fromEntries(DRUG_FIELD_KEYS.map((key) => [key, drug[key]])) as DrugFields;
}

export function baseDrug(id: string): DrugProduct | undefined {
  return baseById.get(id);
}

function normalizedIdentity(value: string): string {
  return value.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
}

export function getCatalogProduct(id: string, approved?: DrugPublication): CatalogProduct | undefined {
  const base = baseById.get(id);
  if (!approved) return base && { ...base, active: true, registryMatches: true };
  const { fields, active } = approved;
  const registryMatches = !!base && REGISTRY_FIELDS.every(
    (key) => normalizedIdentity(fields[key]) === normalizedIdentity(base[key])
  );
  const sameIngredient = !!base && normalizedIdentity(fields.ingredientName) === normalizedIdentity(base.ingredientName);
  return { ...fields, id, active, registryMatches, ingredientId: sameIngredient ? base.ingredientId : "", sourceSheet: base?.sourceSheet ?? "" };
}

export function catalogProducts(approved: DrugPublication[]): CatalogProduct[] {
  const changes = new Map(approved.map((drug) => [drug.id, drug]));
  const ids = new Set([...baseById.keys(), ...changes.keys()]);
  return Array.from(ids, (id) => getCatalogProduct(id, changes.get(id))!);
}

export function searchText(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

/** Chuỗi tìm kiếm đã chuẩn hóa của một thuốc – tính một lần, dùng lại cho mọi lần gõ. */
export function drugSearchKey(drug: DrugProduct): string {
  const terms = [
    drug.drugCode, drug.brandName, drug.ingredientName, drug.ingredientId, drug.strength, drug.route,
    drug.dosageForm, drug.packageSize, drug.registrationNumber, drug.manufacturer, drug.country, drug.unit,
  ];
  return searchText(terms.filter(Boolean).join(" "));
}

export function drugMatches(drug: DrugProduct, query: string): boolean {
  return drugSearchKey(drug).includes(searchText(query.trim()));
}
