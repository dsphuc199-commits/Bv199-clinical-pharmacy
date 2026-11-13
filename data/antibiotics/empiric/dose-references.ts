/*
  FILE: data/antibiotics/empiric/dose-references.ts

  GIAI THAM CHIEU "LIEU NHU TREN" TRONG CUNG VAN BAN, CUNG MUC.
  - Khong sua nguyen van phac do BYT (du lieu goc giu nguyen, kiem bang baseline).
  - Lieu thay the duoc LAY BANG CODE tu phuong an ma nguon tham chieu (cung van ban, cung muc,
    cung trang), khong go lai so lieu -> luon khop nguyen van phuong an goc.
  - Chi ap dung khi phuong an duoc tham chieu la duy nhat; truong hop mo ho (vd. vancomycin tre em
    van nhan tao: "nhu tren" co the la lieu nguoi lon hoac lieu tre em van tu nhien) -> KHONG giai.
*/

import type { DrugItem, Regimen } from "./regimens/types";
import { MUSCULOSKELETAL } from "./regimens/musculoskeletal";
import { NEURO } from "./regimens/neuro";
import { RESPIRATORY } from "./regimens/respiratory";
import { RESPIRATORY_ICU } from "./regimens/respiratory-icu";
import { CARDIOLOGY } from "./regimens/cardiology";

const POOL = new Map<string, Regimen>([...MUSCULOSKELETAL, ...NEURO, ...RESPIRATORY, ...RESPIRATORY_ICU, ...CARDIOLOGY].map((r) => [r.id, r]));

function dose(regimenId: string, drug: string): string {
  const v = POOL.get(regimenId)?.drugs.find((x) => x.name === drug)?.dose;
  if (!v) throw new Error(`dose-references: thieu ${regimenId} / ${drug}`);
  return v;
}
/* Lay cac lua chon (tach boi ";") bat dau bang ten thuoc. */
function pick(regimenId: string, drug: string, names: string[]): string {
  const parts = dose(regimenId, drug).split(";").map((s) => s.trim());
  return names.map((n) => {
    const hit = parts.find((p) => p.toLowerCase().startsWith(n));
    if (!hit) throw new Error(`dose-references: thieu ${n} trong ${regimenId}`);
    return hit;
  }).join("; ");
}

/* "fluoroquinolon khang phe cau (A; B; C) hoac macrolid (D; E; F)" -> "A; B; C; D; E; F" (chi bo nhan nhom, giu nguyen tung lieu). */
function flatGroups(text: string): string {
  return text.replace(/^[^(]*\(/, "").replace(/\)\s*hoặc\s+[^(]*\(/g, "; ").replace(/\)\s*$/, "");
}

type Ref = { regimenId: string; drug: string; dose: () => string };

const REFS: Ref[] = [
  /* Viem khop nhiem khuan (QĐ 708, tr. 164): MSSA theo khang sinh do -> lieu phac do ban dau cung muc. */
  { regimenId: "r-sa-mssa", drug: "Một trong",
    dose: () => `oxacilin ${dose("r-sa-empiric-1", "Oxacilin hoặc nafcilin")}; nafcilin ${dose("r-sa-empiric-1", "Oxacilin hoặc nafcilin")}; clindamycin ${dose("r-sa-empiric-2", "Clindamycin")}` },
  /* Viem mang nao mu (Bang II.19–II.20): cot thay the tham chieu lieu cot uu tien cung dong. */
  { regimenId: "r-men-18-50-alt", drug: "Kết hợp ceftriaxon hoặc cefotaxim", dose: () => dose("r-men-18-50-first", "Ceftriaxon hoặc cefotaxim") },
  { regimenId: "r-men-50-alt", drug: "Kết hợp ceftriaxon hoặc cefotaxim", dose: () => dose("r-men-50-first", "Ceftriaxon hoặc cefotaxim") },
  { regimenId: "r-men-1-3m-alt", drug: "Kết hợp ceftriaxon hoặc cefotaxim", dose: () => dose("r-men-1-3m-first", "Kết hợp ceftriaxon hoặc cefotaxim") },
  { regimenId: "r-men-3m-18y-alt", drug: "Kết hợp ceftriaxon hoặc cefotaxim", dose: () => dose("r-men-3m-18y-first", "Ceftriaxon hoặc cefotaxim") },
  /* Viem phoi cong dong nang tai hoi suc (muc 5.3a): fluoroquinolon/macrolid theo phuong an 1. */
  { regimenId: "r-icu-cap-nonpseudo-2", drug: "Kết hợp", dose: () => flatGroups(dose("r-icu-cap-nonpseudo-1", "Kết hợp một trong")) },
  { regimenId: "r-icu-cap-pseudo-1", drug: "Kết hợp fluoroquinolon kháng phế cầu hoặc macrolid", dose: () => flatGroups(dose("r-icu-cap-nonpseudo-1", "Kết hợp một trong")) },
  /* Ap xe phoi (muc 3.1.1): aminoglycosid theo phac do phoi hop dau muc. */
  { regimenId: "r-lungabs-bl", drug: "Kết hợp aminoglycosid", dose: () => dose("r-lungabs-pen", "Kết hợp gentamycin hoặc amikacin") },
  { regimenId: "r-lungabs-gramneg", drug: "Kết hợp aminoglycosid", dose: () => dose("r-lungabs-pen", "Kết hợp gentamycin hoặc amikacin") },
  { regimenId: "r-lungabs-staph", drug: "Kết hợp amikacin khi nghi tụ cầu kháng thuốc", dose: () => pick("r-lungabs-pen", "Kết hợp gentamycin hoặc amikacin", ["amikacin"]) },
  /* VPLQTM (Bang II.9): carbapenem nhom A, fluoroquinolon nhom B. */
  { regimenId: "r-vap-colistin", drug: "Phối hợp (không dùng colistin đơn độc)",
    dose: () => `${pick("r-vap-mdr", "Nhóm A (một trong)", ["imipenem", "meropenem"])}; ${pick("r-vap-mdr", "Kết hợp nhóm B (một trong)", ["ciprofloxacin", "levofloxacin"])}; rifampicin: văn bản không ghi liều` },
  /* VNTMNK van nhan tao tre em: gentamycin cung lieu nguoi lon va tre em van tu nhien (3 mg/kg/24 gio chia 3 lan). */
  { regimenId: "r-ie-prosth-early-peds", drug: "Gentamycin", dose: () => dose("r-ie-prosth-early", "Gentamycin sulfat") },
];

const BY_REGIMEN = new Map<string, Map<string, string>>();
for (const ref of REFS) {
  if (!BY_REGIMEN.has(ref.regimenId)) BY_REGIMEN.set(ref.regimenId, new Map());
  BY_REGIMEN.get(ref.regimenId)!.set(ref.drug, ref.dose());
}

/* Danh sach thuoc cua phuong an voi "lieu nhu tren" da duoc thay bang lieu cu the (neu giai duoc). */
export function resolvedDrugs(regimen: Pick<Regimen, "id" | "drugs">): DrugItem[] {
  const m = BY_REGIMEN.get(regimen.id);
  if (!m) return regimen.drugs;
  return regimen.drugs.map((x) => (m.has(x.name) ? { ...x, dose: m.get(x.name)! } : x));
}

export const RESOLVED_REGIMEN_IDS = [...BY_REGIMEN.keys()];

/*
  PHUONG AN DUNG CHUNG CHO NHIEU TINH HUONG (chi hien thi, khong nhan ban du lieu nguon).
  QĐ 708, Viem khop nhiem khuan, tr. 164 – "Truong hop cay mau, dich khop duong tinh thi dieu tri theo
  khang sinh do: ... tu cau vang khang methicilin thi dung vancomycin, hoac daptomycin, hoac teicoplanin
  (lieu nhu tren) trong 4 tuan" -> phuong an MRSA (r-sa-mrsa) cung thuoc tinh huong "theo ket qua cay".
*/
export const SHARED_SCENARIO_REGIMENS: { scenario: string; regimenId: string; after: string; condition: string }[] = [
  {
    scenario: "Viêm khớp không do lậu cầu – điều chỉnh theo kết quả cấy máu, dịch khớp và kháng sinh đồ",
    regimenId: "r-sa-mrsa",
    after: "r-sa-mssa",
    condition: "Tụ cầu vàng kháng methicilin (MRSA)",
  },
];
