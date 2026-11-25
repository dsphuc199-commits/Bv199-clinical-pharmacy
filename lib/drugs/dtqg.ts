/*
  FILE: lib/drugs/dtqg.ts

  Ghép thuốc trong danh mục BV199 với chuyên luận Dược thư quốc gia Việt Nam 2023 đã trích nguyên văn:
  - data/renal-dtqg.json: liều ở người suy thận, chống chỉ định/thận trọng liên quan thận;
  - data/pregnancy-dtqg.json: thời kỳ mang thai, cho con bú;
  - data/dtqg-index.json + data/dtqg/<id>.json: các mục lâm sàng (chỉ định, chống chỉ định, thận trọng, tác dụng không
    mong muốn, hướng dẫn xử trí ADR, liều lượng và cách dùng, tương tác, quá liều) – scripts/build-renal-dtqg.mjs
    --monograph, kiểm tra nguyên văn bằng scripts/verify-dtqg-monographs.mjs.
  Ghép CHẶT để không gán nhầm chuyên luận: chỉ khớp khi bộ hoạt chất (bỏ muối, dạng muối, phần trong ngoặc) trùng
  hoàn toàn với tên Việt hoặc tên INN của chuyên luận. Không khớp thì không hiện – trang thuốc chỉ còn tờ HDSD gốc.
*/
import renal from "@/data/renal-dtqg.json";
import pregnancy from "@/data/pregnancy-dtqg.json";
import monoIndex from "@/data/dtqg-index.json";
import review from "@/data/dtqg-review.json";
import type { DtqgBlock, DtqgItem } from "@/lib/dosing/catalog";
import type { PregnancyItem } from "@/components/safety/PregnancyModule";

const RENAL = (renal as { source: string; items: DtqgItem[] }).items;
const PREG = (pregnancy as { source: string; items: PregnancyItem[] }).items;
export const DTQG_BOOK = (renal as { source: string }).source;

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
/* Muối, dạng muối và từ nối không thuộc tên hoạt chất. */
const SALT = new Set(["natri", "kali", "calci", "magnesi", "hydroclorid", "hydrochlorid", "hydrochloride", "hcl",
  "dihydroclorid", "sulfat", "sulphate", "sulfate", "phosphat", "phosphate", "mesylat", "mesilat", "besylat", "besilat", "maleat", "fumarat",
  "tartrat", "succinat", "acetat", "citrat", "bromid", "clorid", "nitrat", "lactat", "gluconat", "dinatri", "hyclat", "hydrocarbonat"]);
/* Nước kết tinh: không bao giờ là tên hoạt chất – luôn bỏ. */
const HYDRATE = /^(mono|di|tri|tetra|penta|hexa|hepta|sesqui)?hydrat(e)?$|^khan$|^anhydrous$/;
/* Tên muối tiếng Anh → tiếng Việt theo từng từ, để thuốc chỉ gồm muối so được đúng cả cation và anion
   (potassium chloride ↔ kali clorid; natri chlorid ↔ natri clorid; KHÔNG để natri clorid trùng kali clorid). */
const WORD: Record<string, string> = {
  potassium: "kali", sodium: "natri", disodium: "dinatri", calcium: "calci", magnesium: "magnesi",
  chloride: "clorid", chlorid: "clorid", bicarbonate: "hydrocarbonat", bicarbonat: "hydrocarbonat", hydrogencarbonate: "hydrocarbonat",
};
/* Cùng hoạt chất, khác cách viết giữa danh mục và Dược thư / Thông tư 20. */
const ALIAS: Record<string, string> = {
  "acid clavulanic": "clavulanat", "clavulanic acid": "clavulanat", clavulanate: "clavulanat", acetaminophen: "paracetamol",
  adrenalin: "epinephrin", noradrenalin: "nor epinephrin", "nor adrenalin": "nor epinephrin",
  "povidon iod": "povidon iodin", "povidone iodine": "povidon iodin",
};

/* Chuẩn hóa chính tả Anh – Việt, áp cho CẢ HAI phía khi so: bỏ "e" cuối của -ine/-one/-ide/-ole/-ate
   (amiodarone ↔ amiodaron, fluconazole ↔ fluconazol, cefuroxime ↔ cefuroxim), ph → f (cephalexin ↔ cefalexin), y → i (acyclovir ↔ aciclovir). */
const fold = (w: string) => w.replace(/ph/g, "f").replace(/y/g, "i").replace(/(in|on|id|ol|at|im)e$/, "$1");
const SALT_F = new Set([...SALT].map(fold));

/** Bộ hoạt chất chuẩn hóa: "Amoxicilin (dưới dạng ...) + Acid clavulanic" → "amoxicilin|clavulanat".
    Trong mỗi hoạt chất: bỏ từ chỉ muối (trừ khi tên chỉ gồm muối, vd. natri clorid), sắp thứ tự từ, bỏ dấu cách
    (methyl prednisolon ↔ methylprednisolon, acid tranexamic ↔ tranexamic acid). */
export function ingredientKey(name: string): string {
  const parts = plain(name).replace(/\*/g, "").replace(/\([^)]*\)?/g, " ")
    .split(/\s*(?:\+|;|,|\bva\b|\band\b|\/)\s*/u)
    .map((p) => p.replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim())
    .map((p) => ALIAS[p] ?? p)
    .map((p) => {
      const words = p.split(" ").filter(Boolean).map((w) => WORD[w] ?? w).filter((w) => !HYDRATE.test(w)).map(fold);
      const kept = words.filter((w) => !SALT_F.has(w));
      return (kept.length ? kept : words).sort().join("");
    })
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

/* Chuyên luận đầy đủ (các mục lâm sàng, nguyên văn): chỉ mục nhỏ nạp sẵn, nội dung từng chuyên luận nạp khi mở trang. */
export type MonoKey = "chiDinh" | "chongChiDinh" | "thanTrong" | "adr" | "adrXuTri" | "lieuDung" | "tuongTac" | "quaLieu";
export type MonoIndexItem = { id: string; name: string; inn: string; pages: { pdf: number[]; printed: number[] }; keys: MonoKey[] };
export type Monograph = MonoIndexItem & { sections: Partial<Record<MonoKey, DtqgBlock[]>> };
const MONO = (monoIndex as { items: MonoIndexItem[] }).items;
const MONO_BY = index(MONO);

export type DtqgMatch = { renal?: DtqgItem; pregnancy?: PregnancyItem; mono?: MonoIndexItem };
/** Chuyên luận Dược thư của một hoạt chất trong danh mục (không khớp chặt thì trả về rỗng). */
export function dtqgFor(ingredientName?: string | null): DtqgMatch {
  if (!ingredientName) return {};
  const k = ingredientKey(ingredientName);
  return { renal: RENAL_BY.get(k), pregnancy: PREG_BY.get(k), mono: MONO_BY.get(k) };
}
/* Mục chưa đạt kiểm tra (scripts/verify-dtqg-monographs.mjs): không khớp nguyên văn PDF, công thức dạng ảnh, hoặc từ hỏng dấu. */
const REVIEW = (review as { items: Record<string, MonoKey[]> }).items;
export const flaggedSections = (id: string) => new Set<MonoKey>(REVIEW[id] ?? []);

/* Từ tiếng Việt hỏng do lớp chữ PDF lệch dấu: một âm tiết có ≥ 2 dấu thanh ("thậần"), hoặc chữ có dấu đứng riêng ("b ì nh")
   – trừ từ một chữ hợp lệ. Dùng cho dữ liệu suy thận, thai kỳ (trích trước đó): có từ hỏng thì ẩn chữ, chỉ số trang. */
const TONE = /[àáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/giu;
const ONE_OK = new Set(["ở", "ý", "ổ", "ù", "ợ", "ứ", "ồ", "á", "ủ"]);
const badWord = (w: string) => (w.match(TONE) ?? []).length >= 2 || (w.length === 1 && (w.match(TONE) ?? []).length === 1 && !ONE_OK.has(w.toLowerCase()));
const blockText = (b: DtqgBlock) => (b.t === "p" ? b.runs.map((r) => r.text).join("") : b.t === "table" ? b.rows.flat().map((c) => c.text).join(" ") : "");
/** Chữ sạch (không có từ hỏng dấu, không có công thức dạng ảnh) – được phép hiển thị nguyên văn. */
export function textOk(blocks: DtqgBlock[] = [], extra: string[] = []): boolean {
  if (blocks.some((b) => b.t === "img")) return false;
  return ![...blocks.map(blockText), ...extra].some((t) => t.normalize("NFC").split(/[^\p{L}]+/u).some(badWord));
}

/** Nội dung nguyên văn các mục lâm sàng của một chuyên luận. */
export async function loadMonograph(id: string): Promise<Monograph | null> {
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  try {
    return (await import(`@/data/dtqg/${id}.json`)).default as Monograph;
  } catch {
    return null;
  }
}
