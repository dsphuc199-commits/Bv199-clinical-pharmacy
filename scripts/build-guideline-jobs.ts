/*
  scripts/build-guideline-jobs.ts – sinh/cập nhật data/guideline-jobs/jobs.yaml từ danh mục bệnh của app.
  Idempotent: job đã có (theo disease_id) GIỮ NGUYÊN mọi trường; chỉ thêm job mới, bổ sung trường thiếu,
  và chuyển todo → done_handwritten khi bệnh đã có công cụ viết tay/module/_reference. Không xóa job.
  Dùng: npm run build:guideline-jobs   (thêm -- --dry để chỉ in thay đổi)
  Nguồn dữ liệu:
    - data/antibiotics/empiric/catalog.ts: DISEASES (id, title, specialty), getStream, getPopulationHint
    - data/antibiotics/empiric/icd10.ts: ICD10
    - components/antibiotics/empiric/GuidelineTabs.tsx (IntlTab): bệnh có công cụ viết tay
    - data/antibiotics/empiric/international.ts: mục có module riêng
    - data/guidelines/intl/_reference/*.json: disease_id
*/
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { DISEASES, getPopulationHint, getStream } from "../data/antibiotics/empiric/catalog";
import { ICD10 } from "../data/antibiotics/empiric/icd10";
import { getIntlEntry } from "../data/antibiotics/empiric/international";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "data", "guideline-jobs");
const OUT = join(OUT_DIR, "jobs.yaml");
export const JOB_STATUSES = ["todo", "drafted", "audited", "needs_update", "blocked_no_fulltext", "no_intl_guideline", "held_by_gate", "published", "done_handwritten"] as const;

type Job = {
  id: string; disease_id: string; disease_vi: string; disease_en: string | null; icd10: string[] | null; category: string;
  population: "adult" | "child" | "neonate" | null; class: "antibacterial" | "antifungal" | "both" | "unknown";
  priority: number; preferred_orgs: string[]; status: (typeof JOB_STATUSES)[number];
  last_checked: string | null; published_at: string | null; notes: string;
};
const KEYS: (keyof Job)[] = ["id", "disease_id", "disease_vi", "disease_en", "icd10", "category", "population", "class", "priority", "preferred_orgs", "status", "last_checked", "published_at", "notes"];

const slug = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function handwritten(): Map<string, string> {
  const m = new Map<string, string>();
  const src = readFileSync(join(ROOT, "components/antibiotics/empiric/GuidelineTabs.tsx"), "utf8");
  const start = src.indexOf("export function IntlTab");
  const end = src.indexOf("INTL_GUIDELINE_JSON[diseaseId]", start);
  for (const x of src.slice(start, end < 0 ? undefined : end).matchAll(/diseaseId === "(v\d+-\d+)"/g)) m.set(x[1], "công cụ viết tay trong IntlTab (GuidelineTabs.tsx)");
  for (const d of DISEASES) { const e = getIntlEntry(d.id); if (e?.module && !m.has(d.id)) m.set(d.id, `module riêng "${e.module}" (international.ts)`); }
  const refDir = join(ROOT, "data/guidelines/intl/_reference");
  if (existsSync(refDir)) for (const f of readdirSync(refDir).filter((x) => x.endsWith(".json"))) {
    const id = JSON.parse(readFileSync(join(refDir, f), "utf8")).disease_id as string;
    m.set(id, `${m.get(id) ? m.get(id) + "; " : ""}JSON mẫu _reference/${f}`);
  }
  return m;
}
function population(hint: string): Job["population"] {
  if (hint === "Sơ sinh") return "neonate";
  if (hint === "Trẻ em") return "child";
  if (hint === "Người lớn") return "adult";
  return null; // "Thai kỳ / hậu sản", "Chưa phân loại…" → không đoán
}
function klass(stream: string): Job["class"] {
  if (stream === "antifungal") return "antifungal";
  if (stream === "empiric" || stream === "pathogen" || stream === "prophylaxis") return "antibacterial";
  return "unknown"; // tuberculosis: enum không có nhóm riêng → để người dùng quyết định
}

const dry = process.argv.includes("--dry");
const hw = handwritten();
const existing: Job[] = existsSync(OUT) ? ((YAML.parse(readFileSync(OUT, "utf8")) as { jobs?: Job[] } | null)?.jobs ?? []) : [];
const byDisease = new Map(existing.map((j) => [j.disease_id, j]));
const changes: string[] = [];
const jobs: Job[] = [...existing];
for (const d of DISEASES) {
  const hint = getPopulationHint(d);
  const fresh: Job = {
    id: slug(d.title),
    disease_id: d.id,
    disease_vi: d.title,
    disease_en: null,
    icd10: ICD10[d.id]?.length ? ICD10[d.id] : null,
    category: d.specialty,
    population: population(hint),
    class: klass(getStream(d)),
    priority: 3,
    preferred_orgs: [],
    status: hw.has(d.id) ? "done_handwritten" : "todo",
    last_checked: null,
    published_at: null,
    notes: [hw.get(d.id), `population từ getPopulationHint ("${hint}"); class từ getStream ("${getStream(d)}")`].filter(Boolean).join(". "),
  };
  const cur = byDisease.get(d.id);
  if (!cur) { jobs.push(fresh); changes.push(`+ ${d.id} ${d.title} (${fresh.status})`); continue; }
  for (const k of KEYS) if (!(k in cur)) { (cur as Record<string, unknown>)[k] = fresh[k]; changes.push(`~ ${d.id}: bổ sung trường ${k}`); }
  if (cur.status === "todo" && hw.has(d.id)) { cur.status = "done_handwritten"; changes.push(`~ ${d.id}: todo → done_handwritten (${hw.get(d.id)})`); }
  if (cur.disease_vi !== d.title) changes.push(`! ${d.id}: tên trong danh mục đã đổi "${cur.disease_vi}" → "${d.title}" (giữ nguyên, sửa tay nếu cần)`);
}
const ids = new Set(DISEASES.map((d) => d.id));
for (const j of existing) if (!ids.has(j.disease_id)) changes.push(`! ${j.disease_id} không còn trong danh mục (giữ nguyên job)`);
const dupIds = jobs.map((j) => j.id).filter((x, i, a) => a.indexOf(x) !== i);
for (const x of dupIds) changes.push(`! id job trùng: ${x}`);

const header = `# data/guideline-jobs/jobs.yaml – hàng đợi soạn hướng dẫn quốc tế (lệnh /guideline-run, /guideline-live, /guideline-update).
# Sinh/cập nhật bằng: npm run build:guideline-jobs (giữ nguyên job đã có; chỉ thêm job mới, bổ sung trường thiếu).
# status: ${JOB_STATUSES.join(" | ")}
# population: adult | child | neonate | null (null = chưa xác định – người dùng điền, không đoán)
# class: antibacterial | antifungal | both | unknown
# priority: số nhỏ chạy trước (mặc định 3). preferred_orgs: tổ chức ưu tiên khi chọn nguồn (vd. [IDSA, ESCMID]).
# last_checked / published_at: YYYY-MM-DD.
`;
const body = YAML.stringify({ jobs: jobs.map((j) => Object.fromEntries(KEYS.map((k) => [k, j[k]]))) }, { lineWidth: 0 });
const counts = jobs.reduce<Record<string, number>>((a, j) => ((a[j.status] = (a[j.status] ?? 0) + 1), a), {});
console.log(changes.length ? changes.join("\n") : "Không có thay đổi.");
console.log(`Tổng ${jobs.length} job: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}`);
const nullPop = jobs.filter((j) => j.population === null && j.status !== "done_handwritten").map((j) => j.disease_id);
const unkClass = jobs.filter((j) => j.class === "unknown").map((j) => j.disease_id);
console.log(`population null (chưa làm): ${nullPop.length}; class unknown: ${unkClass.join(", ") || "không"}`);
if (!dry) { mkdirSync(OUT_DIR, { recursive: true }); writeFileSync(OUT, header + body, "utf8"); console.log("Đã ghi data/guideline-jobs/jobs.yaml"); }
