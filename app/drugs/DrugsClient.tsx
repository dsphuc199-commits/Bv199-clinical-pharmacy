"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { catalogProducts, drugMatches, type DrugPublication } from "@/lib/drugs/catalog";
import type { LeafletSource, RegistryStatus } from "@/lib/drugs/registry";

type Reg = { s: RegistryStatus; h: LeafletSource };
type RegistryMap = Record<string, Reg>;
/** m: có chuyên luận Dược thư; r: Dược thư – suy thận; p: Dược thư – thai kỳ, cho con bú; l: thuộc danh mục LASA. */
export type DrugFlags = { m: boolean; r: boolean; p: boolean; l: boolean };

/* Bộ lọc nội dung: chỉ nguồn chính thức. */
const CONTENT_FILTERS: { value: string; label: string; test: (r: Reg | undefined, f: DrugFlags | undefined) => boolean }[] = [
  { value: "", label: "Tất cả", test: () => true },
  { value: "hdsd", label: "Có tờ HDSD gốc (Cục QLD)", test: (r) => r?.h === "dav" },
  { value: "mono", label: "Có chuyên luận Dược thư", test: (_, f) => !!f?.m },
  { value: "renal", label: "Có liều suy thận (Dược thư)", test: (_, f) => !!f?.r },
  { value: "preg", label: "Có thai kỳ, cho con bú (Dược thư)", test: (_, f) => !!f?.p },
  { value: "lasa", label: "Thuốc LASA", test: (_, f) => !!f?.l },
  { value: "intl", label: "Tài liệu nước ngoài (tiếng Anh)", test: (r) => r?.h === "intl" },
  { value: "none", label: "Chưa có tờ HDSD gốc", test: (r) => r?.h !== "dav" },
];
const STATUS_FILTERS: { value: string; label: string; test: (r?: Reg) => boolean }[] = [
  { value: "", label: "Tất cả", test: () => true },
  { value: "canh-bao", label: "Hết hạn hoặc đã rút", test: (r) => r?.s === "het-han" || r?.s === "da-rut" },
  { value: "cho-gia-han", label: "Hết hạn – chờ gia hạn", test: (r) => r?.s === "cho-gia-han" },
  { value: "sap-het-han", label: "Sắp hết hạn (≤ 6 tháng)", test: (r) => r?.s === "sap-het-han" },
  { value: "khong-tim-thay", label: "Không tìm thấy SĐK", test: (r) => r?.s === "khong-tim-thay" },
];

const STATUS_BADGE: Partial<Record<RegistryStatus, { text: string; cls: string }>> = {
  "da-rut": { text: "Đã rút SĐK", cls: "bg-red-100 text-red-900" },
  "het-han": { text: "SĐK hết hiệu lực", cls: "bg-red-100 text-red-900" },
  "cho-gia-han": { text: "SĐK chờ gia hạn", cls: "bg-amber-100 text-amber-900" },
  "sap-het-han": { text: "SĐK sắp hết hạn", cls: "bg-amber-100 text-amber-900" },
  "khong-tim-thay": { text: "Không tìm thấy SĐK", cls: "bg-slate-100 text-slate-600" },
};
const PILL = "rounded-full px-2.5 py-0.5 text-xs font-bold";

function Badges({ r, f }: { r?: Reg; f?: DrugFlags }) {
  const b = r && STATUS_BADGE[r.s];
  return (
    <>
      {f?.l && <span className={`${PILL} bg-orange-100 text-orange-900`}>LASA</span>}
      {b && <span className={`${PILL} ${b.cls}`}>{b.text}</span>}
      {r?.h === "dav" && <span className={`${PILL} bg-sky-100 text-sky-900`}>Tờ HDSD gốc</span>}
      {f?.m && <span className={`${PILL} bg-emerald-100 text-emerald-900`}>Dược thư</span>}
      {f?.r && <span className={`${PILL} bg-teal-100 text-teal-900`}>Suy thận</span>}
      {f?.p && <span className={`${PILL} bg-teal-100 text-teal-900`}>Thai kỳ</span>}
    </>
  );
}

export default function DrugsClient({ registry, syncedAt, publications, flags }: { registry: RegistryMap; syncedAt: string; publications: DrugPublication[]; flags: Record<string, DrugFlags> }) {
  const [keyword, setKeyword] = useState("");
  const [route, setRoute] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [limit, setLimit] = useState(60);
  const drugs = useMemo(() => catalogProducts(publications).filter((d) => d.active), [publications]);
  const routes = useMemo(() => Array.from(new Set(drugs.map((d) => d.route).filter((r): r is string => Boolean(r)))).sort((a, b) => a.localeCompare(b, "vi")), [drugs]);
  const contentTest = (CONTENT_FILTERS.find((f) => f.value === content) ?? CONTENT_FILTERS[0]).test;
  const statusTest = (STATUS_FILTERS.find((f) => f.value === status) ?? STATUS_FILTERS[0]).test;

  const results = useMemo(() => drugs.filter((d) => {
    if (route && d.route !== route) return false;
    const r = d.registryMatches ? registry[d.id] : undefined;
    if (!contentTest(r, flags[d.id]) || !statusTest(r)) return false;
    return !keyword.trim() || drugMatches(d, keyword);
  }), [drugs, keyword, route, contentTest, statusTest, registry, flags]);
  const filtered = Boolean(keyword || route || content || status);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Thông tin thuốc</h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">Danh mục thuốc Bệnh viện 199 · tờ HDSD gốc của Cục Quản lý Dược · Dược thư quốc gia 2023.</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <label htmlFor="drug-q" className="sr-only">Tìm thuốc</label>
          <div className="relative">
            <Search size={18} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input id="drug-q" type="search" value={keyword} onChange={(e) => { setKeyword(e.target.value); setLimit(60); }}
              placeholder="Tên thuốc, hoạt chất, mã thuốc, số đăng ký…"
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-base outline-none focus:border-[#087f89]" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Select label="Đường dùng" value={route} onChange={setRoute} options={[{ value: "", label: "Tất cả" }, ...routes.map((r) => ({ value: r, label: r }))]} />
            <Select label="Thông tin có sẵn" value={content} onChange={setContent} options={CONTENT_FILTERS} />
            <Select label="Số đăng ký" value={status} onChange={setStatus} options={STATUS_FILTERS} />
          </div>
          <p className="mt-3 text-xs text-slate-500">Số đăng ký và tờ HDSD đối chiếu Cổng tra cứu thuốc – Cục Quản lý Dược, cập nhật {syncedAt.split("-").reverse().join("/")}.</p>
        </section>

        <div className="my-4 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600"><strong>{results.length}</strong> / {drugs.length} thuốc</p>
          {filtered && (
            <button type="button" onClick={() => { setKeyword(""); setRoute(""); setContent(""); setStatus(""); setLimit(60); }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">Xóa bộ lọc</button>
          )}
        </div>

        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {results.slice(0, limit).map((d) => (
            <li key={d.id}>
              <Link href={`/drugs/${encodeURIComponent(d.id)}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 focus-visible:bg-slate-50">
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-900">{d.brandName || "—"}</span>
                  <span className="block text-sm text-slate-600">{[d.ingredientName, d.strength].filter(Boolean).join(" · ")}</span>
                  <span className="mt-1.5 flex flex-wrap gap-1.5">
                    {[d.dosageForm, d.route].filter(Boolean).map((t) => <span key={t} className={`${PILL} bg-slate-100 font-semibold text-slate-600`}>{t}</span>)}
                    <Badges r={d.registryMatches ? registry[d.id] : undefined} f={flags[d.id]} />
                  </span>
                </span>
                <ChevronRight size={18} aria-hidden className="flex-none text-slate-400" />
              </Link>
            </li>
          ))}
          {results.length === 0 && <li className="px-4 py-6 text-sm text-slate-600">Không có thuốc khớp. Thử tên hoạt chất hoặc bỏ bớt bộ lọc.</li>}
        </ul>

        {results.length > limit && (
          <div className="mt-4 text-center">
            <button type="button" onClick={() => setLimit((n) => n + 60)} className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-[#0b3a5b] hover:bg-slate-50">
              Xem thêm ({results.length - limit} thuốc)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-normal">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
