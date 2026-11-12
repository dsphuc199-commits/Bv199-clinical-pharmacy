/*
  Danh muc module "Hieu chinh lieu" (chi dung phia may chu):
    - renalDosingDatabase (data/renal-dosing.ts): bang lieu theo CrCl da nhap va doi chieu.
    - data/renal-dtqg.json: trich NGUYEN VAN Duoc thu quoc gia VN 2023 (lieu o nguoi suy than,
      chong chi dinh/than trong lien quan than) + anh cat trang goc.
    - QD 5631/QD-BYT (31/12/2020) Phu luc 2: khang sinh uu tien quan ly (Nhom 1) va can giam sat (Nhom 2).
*/
import dtqg from "@/data/renal-dtqg.json";
import drugProducts from "@/data/drug-products.json";
import { renalDosingDatabase } from "@/data/renal-dosing";

export type DoseGroup = "ks-n1" | "ks-n2" | "khang-sinh" | "thuoc-khac";

export const GROUP_LABEL: Record<DoseGroup, string> = {
  "ks-n1": "Kháng sinh cần hội chẩn (Nhóm 1)",
  "ks-n2": "Kháng sinh cần giám sát (Nhóm 2)",
  "khang-sinh": "Kháng sinh, kháng nấm, kháng virus khác",
  "thuoc-khac": "Thuốc khác",
};

/* Noi dung nguyen van co cau truc: doan (giu dam/nghieng), bang (o gop), anh cong thuc. */
export type DtqgRun = { text: string; b?: boolean; i?: boolean };
export type DtqgCell = { text: string; b?: boolean; rs?: number; cs?: number };
export type DtqgBlock =
  | { t: "p"; runs: DtqgRun[]; head?: boolean }
  | { t: "table"; rows: DtqgCell[][] }
  | { t: "img"; src: string; w: number; h: number; alt: string };
export type DtqgClip = { src: string; page: number; printedPage: number; w: number; h: number };
export type DtqgItem = {
  id: string;
  name: string;
  inn: string;
  group: DoseGroup;
  inFormulary: boolean;
  pages: { pdf: number[]; printed: number[] };
  noAdjust: boolean;
  /* Chuyen luan co, nhung khong neu hieu chinh theo chuc nang than (khang sinh uu tien quan ly). */
  noRenalText?: boolean;
  content: DtqgBlock[];
  clips: DtqgClip[];
  contraindications: string[];
  cautions: string[];
};

export type DoseEntry = {
  key: string;
  name: string;
  inn?: string;
  group: DoseGroup;
  /* ingredientId trong renalDosingDatabase (co bang lieu theo CrCl) */
  profileId?: string;
  dtqg?: DtqgItem;
  /* Thuoc uu tien quan ly theo QD 5631 nhung Duoc thu 2023 khong co chuyen luan */
  outside?: string;
  /* So che pham trong danh muc BV199 + 1 lien ket mau toi trang thuoc */
  formulary: { count: number; sampleId?: string; sampleName?: string };
  search: string;
};

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
const key = (s: string) => plain(s).replace(/\([^)]*\)?/g, " ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const QD5631_N1 = ["ceftolozan", "tigecyclin", "colistin", "fosfomycin", "linezolid", "amphotericin", "caspofungin", "micafungin", "voriconazol", "avibactam", "meropenem", "imipenem", "doripenem", "ertapenem", "vancomycin", "teicoplanin", "aciclovir", "valganciclovir", "posaconazol"];
const QD5631_N2 = ["amikacin", "gentamicin", "tobramycin", "netilmicin", "ciprofloxacin", "levofloxacin", "lomefloxacin", "moxifloxacin", "norfloxacin", "ofloxacin", "pefloxacin", "sparfloxacin"];
export function qd5631Group(name: string): DoseGroup | null {
  const k = key(name);
  if (QD5631_N1.some((x) => k.includes(x))) return "ks-n1";
  if (QD5631_N2.some((x) => k.includes(x))) return "ks-n2";
  return null;
}

/* Khang sinh uu tien quan ly ma Duoc thu 2023 khong co chuyen luan (doi chieu chi muc 733 chuyen luan). */
const OUTSIDE_DTQG: { name: string; group: DoseGroup; note: string }[] = [
  { name: "Ceftolozan + tazobactam", group: "ks-n1", note: "Dược thư 2023 không có chuyên luận. Tra tờ HDSD được phê duyệt của chế phẩm (có bảng hiệu chỉnh theo CrCl)." },
  { name: "Ceftazidim + avibactam", group: "ks-n1", note: "Dược thư 2023 không có chuyên luận. Tra tờ HDSD được phê duyệt của chế phẩm (có bảng hiệu chỉnh theo CrCl)." },
  { name: "Caspofungin", group: "ks-n1", note: "Dược thư 2023 không có chuyên luận. Theo tờ HDSD: không cần hiệu chỉnh theo chức năng thận; hiệu chỉnh khi suy gan – đối chiếu tờ HDSD của chế phẩm." },
  { name: "Micafungin", group: "ks-n1", note: "Dược thư 2023 không có chuyên luận. Tra tờ HDSD được phê duyệt của chế phẩm." },
  { name: "Valganciclovir", group: "ks-n1", note: "Dược thư 2023 không có chuyên luận. Tra tờ HDSD được phê duyệt của chế phẩm (có bảng hiệu chỉnh theo CrCl)." },
  { name: "Posaconazol", group: "ks-n1", note: "Dược thư 2023 không có chuyên luận. Tra tờ HDSD được phê duyệt của chế phẩm." },
  { name: "Lomefloxacin", group: "ks-n2", note: "Dược thư 2023 không có chuyên luận. Tra tờ HDSD được phê duyệt của chế phẩm." },
  { name: "Sparfloxacin", group: "ks-n2", note: "Dược thư 2023 không có chuyên luận. Tra tờ HDSD được phê duyệt của chế phẩm." },
];

type Product = { id: string; brandName: string; ingredientName: string };
const products = drugProducts as Product[];
function formularyFor(name: string) {
  const first = key(name).split(" ").filter((w) => w.length > 2)[0];
  if (!first) return { count: 0 };
  const hits = products.filter((p) => key(p.ingredientName).split(" ").includes(first));
  return { count: hits.length, sampleId: hits[0]?.id, sampleName: hits[0]?.brandName };
}

let cache: DoseEntry[] | null = null;
export function doseEntries(): DoseEntry[] {
  if (cache) return cache;
  const items = (dtqg as { items: DtqgItem[] }).items;
  const entries = new Map<string, DoseEntry>();
  const firstWord = (s: string) => key(s).split(" ")[0];

  // 1. Thuoc co trich Duoc thu.
  for (const it of items) {
    entries.set(it.id, {
      key: it.id, name: it.name, inn: it.inn, group: it.group, dtqg: it,
      formulary: formularyFor(it.name), search: plain(`${it.name} ${it.inn}`),
    });
  }
  // 2. Thuoc co bang lieu theo CrCl: gan vao muc Duoc thu cung hoat chat, hoac tao muc rieng.
  // Ten chuan hoa: "A + B" = "A và B" = "A - B"; bo "đơn chất".
  const SKIP = ["va", "don", "chat", "dang", "thong", "thuong", "natri", "kali", "hydroclorid", "mesylat", "besylat", "phosphat", "sulfat", "trihydrat", "calci"];
  const canon = (s: string) => key(s).replace(/\bpenicilin g\b/g, "benzylpenicilin").split(" ").filter((w) => !SKIP.includes(w)).join(" ");
  const seen = new Set<string>();
  for (const prof of renalDosingDatabase) {
    if (seen.has(prof.ingredientId)) continue;
    seen.add(prof.ingredientId);
    const k = canon(prof.ingredientName);
    const single = (s: string) => canon(s).split(" ").length === 1;
    const dt = [...entries.values()].filter((e) => e.dtqg && !e.profileId);
    const match =
      dt.find((e) => canon(e.name) === k) ??
      dt.find((e) => single(e.name) && single(prof.ingredientName) && firstWord(e.name) === firstWord(prof.ingredientName));
    if (match && !match.profileId) {
      match.profileId = prof.ingredientId;
      match.name = prof.ingredientName;
      match.search += ` ${plain(prof.ingredientName)} ${prof.keywords.map(plain).join(" ")}`;
    } else {
      entries.set(`p-${prof.ingredientId}`, {
        key: `p-${prof.ingredientId}`, name: prof.ingredientName, group: qd5631Group(prof.ingredientName) ?? "khang-sinh",
        profileId: prof.ingredientId, formulary: formularyFor(prof.ingredientName),
        search: plain(`${prof.ingredientName} ${prof.keywords.join(" ")}`),
      });
    }
  }
  // 3. Uu tien quan ly nhung ngoai Duoc thu.
  for (const o of OUTSIDE_DTQG) {
    entries.set(`o-${key(o.name).replace(/ /g, "-")}`, {
      key: `o-${key(o.name).replace(/ /g, "-")}`, name: o.name, group: o.group, outside: o.note,
      formulary: formularyFor(o.name), search: plain(o.name),
    });
  }
  // Nhom theo QD 5631 uu tien hon nhom suy ra tu ten.
  for (const e of entries.values()) e.group = qd5631Group(`${e.name} ${e.inn ?? ""}`) ?? e.group;

  cache = [...entries.values()].sort((a, b) => a.name.localeCompare(b.name, "vi"));
  return cache;
}

export const DTQG_SOURCE = (dtqg as { source: string }).source;
export const DTQG_NOTE = (dtqg as { note: string }).note;
