/*
  scripts/build-intl-index.ts – sinh data/guidelines/intl/index.ts: import tĩnh mọi JSON trong data/guidelines/intl
  (bỏ qua _reference/), parse zod lúc build, ánh xạ theo disease_id.
  Dùng: npm run build:intl-index            (ghi file)
        npm run build:intl-index -- --check (chỉ kiểm file đã đồng bộ; lệch → mã thoát 1)
  Lỗi parse, trùng disease_id, disease_id không có trong danh mục → mã thoát 1, không ghi file.
*/
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DISEASES } from "../data/antibiotics/empiric/catalog";
import { intlGuideline } from "../schema/intl-guideline";

const DIR = join(process.cwd(), "data", "guidelines", "intl");
const OUT = join(DIR, "index.ts");

export function renderIndex(): { content: string; errors: string[]; entries: { file: string; disease_id: string; state: string }[] } {
  const errors: string[] = [];
  const entries: { file: string; disease_id: string; state: string }[] = [];
  const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith(".json")).sort() : [];
  const known = new Set(DISEASES.map((d) => d.id));
  for (const f of files) {
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(join(DIR, f), "utf8")); } catch (e) { errors.push(`${f}: JSON lỗi – ${(e as Error).message}`); continue; }
    const p = intlGuideline.safeParse(raw);
    if (!p.success) { errors.push(`${f}: ${p.error.issues.slice(0, 3).map((i) => `${i.path.join(".")} – ${i.message}`).join("; ")}`); continue; }
    if (!known.has(p.data.disease_id)) errors.push(`${f}: disease_id "${p.data.disease_id}" không có trong data/antibiotics/empiric/catalog.ts`);
    if (entries.some((e) => e.disease_id === p.data.disease_id)) errors.push(`${f}: trùng disease_id "${p.data.disease_id}"`);
    entries.push({ file: f, disease_id: p.data.disease_id, state: p.data.review.state });
  }
  const lines = [
    "/* TỰ ĐỘNG SINH bởi scripts/build-intl-index.ts – KHÔNG sửa tay. Chạy: npm run build:intl-index */",
    ...entries.map((e, i) => `import g${i} from "./${e.file}";`),
    "",
    "/** JSON hướng dẫn quốc tế theo disease_id (chưa parse – IntlGuidelineView parse lại bằng zod). */",
    `export const INTL_GUIDELINE_JSON: Record<string, unknown> = {${entries.length ? "\n" + entries.map((e, i) => `  "${e.disease_id}": g${i}, // ${e.file} – ${e.state}`).join("\n") + "\n" : ""}};`,
    "",
  ];
  return { content: lines.join("\n"), errors, entries };
}

const { content, errors, entries } = renderIndex();
if (errors.length) { for (const e of errors) console.error("LỖI: " + e); process.exit(1); }
if (process.argv.includes("--check")) {
  const cur = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
  if (cur !== content) { console.error("data/guidelines/intl/index.ts chưa đồng bộ – chạy: npm run build:intl-index"); process.exit(1); }
  console.log(`index.ts đồng bộ (${entries.length} hướng dẫn).`);
} else {
  writeFileSync(OUT, content, "utf8");
  console.log(`Đã ghi data/guidelines/intl/index.ts – ${entries.length} hướng dẫn${entries.length ? ": " + entries.map((e) => `${e.disease_id} (${e.file})`).join(", ") : ""}.`);
}
