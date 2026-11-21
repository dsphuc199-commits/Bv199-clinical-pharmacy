import Link from "next/link";
import AntibiogramTables from "@/components/antibiotics/AntibiogramTables";
import BackBar from "@/components/antibiotics/links/BackBar";
import { PKPD_HREF, SHOW_PKPD } from "@/lib/feature-flags";
import rawData from "@/data/antibiotics/antibiogram-bv199.json";
import { clsiConfig } from "@/data/microbiology/clsi-config";
import { RawSource, ReportSource } from "./AntibiogramDetails";

const route = "/antibiotics/antibiogram";
const views = [
  { id: "matrix", label: "Bảng tích lũy" },
  { id: "details", label: "Tra cứu chi tiết" },
  { id: "report", label: "Báo cáo tổng hợp" },
] as const;

export default async function AntibiogramPage({ searchParams }: PageProps<"/antibiotics/antibiogram">) {
  const params = await searchParams;
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const antibiotic = get("antibiotic");
  const organism = get("organism");
  const from = get("from");
  const fromLabel = get("fromLabel");
  const requestedView = get("view");
  const defaultView = antibiotic || organism ? "details" : "matrix";
  const view = views.find(({ id }) => id === requestedView)?.id ?? defaultView;

  return (
    <main className="min-h-screen min-w-0 bg-slate-50 px-3 py-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <BackBar
          from={from}
          fromLabel={fromLabel}
          fallbackHref="/antibiotics"
          fallbackLabel="Kháng sinh & AMS"
        />

        <header className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Kháng sinh đồ BV199</h1>
        </header>

        <nav aria-label="Chế độ xem kháng sinh đồ" className="mb-4 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1">
          {views.map(({ id, label }) => {
            const query = new URLSearchParams();
            for (const [key, value] of Object.entries({ antibiotic, organism, from, fromLabel })) {
              if (value) query.set(key, value);
            }
            if (id !== defaultView) query.set("view", id);
            const href = query.size ? `${route}?${query}` : route;
            return (
              <Link
                key={id}
                href={href}
                aria-current={view === id ? "page" : undefined}
                className={`rounded-lg px-2.5 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                  view === id ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {view === "matrix" && <AntibiogramTables status={rawData.metadata.status} />}
        {view === "details" && (
          <RawSource
            key={JSON.stringify([antibiotic, organism])}
            initialAntibioticId={antibiotic}
            initialOrganismId={organism}
          />
        )}
        {view === "report" && <ReportSource />}

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-teal-800">
          <a href={clsiConfig.source.url} target="_blank" rel="noreferrer">
            {clsiConfig.standard} {clsiConfig.document}, ấn bản {clsiConfig.edition} ({clsiConfig.year}) ↗
          </a>
          <Link href="/antibiotics/empiric/guideline-v9">Kinh nghiệm</Link>
          <Link href="/antibiotics/organism">KS theo vi khuẩn</Link>
          <Link href="/antibiotics/dosing">Hiệu chỉnh liều</Link>
          {SHOW_PKPD && <Link href={PKPD_HREF}>PK/PD</Link>}
        </div>
      </div>
    </main>
  );
}
