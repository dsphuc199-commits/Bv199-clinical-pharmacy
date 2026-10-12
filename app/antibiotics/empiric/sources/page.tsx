"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  allGuidelineSectionIndexes,
  guidelineSources,
  sourcePdfUrl,
  type GuidelineSourceId,
} from "../../../../data/antibiotics/guideline-source-index";
import {
  umc2023ExactPages,
  searchUmc2023Exact,
} from "../../../../data/antibiotics/umc-2023-exact";
import { umc2023RegimenExtracts } from "../../../../data/antibiotics/umc-2023-regimen-extracts";

export default function GuidelineSourcesPage() {
  const [sourceId, setSourceId] = useState<GuidelineSourceId>("UMC2023");
  const [query, setQuery] = useState("");

  const source = guidelineSources.find((s) => s.id === sourceId)!;
  const sections = allGuidelineSectionIndexes.filter((s) => s.sourceId === sourceId);

  const exactPages = useMemo(() => {
    if (sourceId !== "UMC2023") return [];
    if (!query.trim()) return umc2023ExactPages.filter((p) => p.pdfPage >= 9);
    return searchUmc2023Exact(query);
  }, [sourceId, query]);

  const regimenExtracts = useMemo(() => {
    if (sourceId !== "UMC2023") return [];
    const q = query.trim().toLocaleLowerCase("vi-VN");
    if (!q) return umc2023RegimenExtracts;
    return umc2023RegimenExtracts.filter((x) => x.text.toLocaleLowerCase("vi-VN").includes(q));
  }, [sourceId, query]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">SOURCE VERIFICATION</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">Nguồn hướng dẫn gốc</h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                Khu vực đối chiếu nguyên nguồn. UMC 2023 có lớp text nên hiển thị nguyên văn theo trang.
                Bạch Mai 2023 và Xanh Pôn 2025 là bản scan; app chỉ mở trang PDF gốc để tránh biến lỗi OCR thành phác đồ lâm sàng.
              </p>
            </div>
            <Link href="/antibiotics/empiric" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">
              ← Điều trị kinh nghiệm
            </Link>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <b>Nguyên tắc:</b> không coi dữ liệu OCR từ PDF scan là liều/phác đồ đã xác minh. Mọi thuốc, liều, đường dùng và khoảng cách liều cần đối chiếu PDF gốc và quy trình BV199 trước khi đưa vào production.
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-3">
            {guidelineSources.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setSourceId(s.id); setQuery(""); }}
                className={[
                  "rounded-xl border p-4 text-left transition",
                  sourceId === s.id ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                <p className="font-black text-slate-900">{s.name}</p>
                <p className="mt-1 text-xs text-slate-500">{s.year} · {s.sourceFormat === "TEXT_PDF" ? "Text PDF" : "Scanned PDF"}</p>
              </button>
            ))}
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm thuốc, bệnh, liều, tác nhân..."
            className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500"
          />
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">{source.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{source.note}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <div key={section.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-black text-slate-900">{section.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Trang in: {section.printedStart ?? "-"}-{section.printedEnd ?? "-"} · PDF: {section.pdfStart}-{section.pdfEnd}
                </p>
                {source.localPdfPath && (
                  <a
                    href={sourcePdfUrl(sourceId, section.pdfStart)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex rounded-lg bg-white px-3 py-2 text-xs font-bold text-teal-700 ring-1 ring-slate-200"
                  >
                    Mở PDF gốc tại trang →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {sourceId === "UMC2023" && (
          <>
            <section className="mt-5 rounded-2xl border border-teal-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Khối thuốc/liều trích nguyên nguồn</h2>
              <p className="mt-2 text-sm text-slate-600">
                {regimenExtracts.length} khối có thông tin thuốc/liều/đường dùng được lấy từ lớp text của PDF UMC 2023 và giữ số trang PDF.
              </p>
              <div className="mt-4 space-y-3">
                {regimenExtracts.slice(0, 100).map((x) => (
                  <article key={x.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">PDF trang {x.pdfPage}</span>
                      <a href={sourcePdfUrl("UMC2023", x.pdfPage)} target="_blank" rel="noreferrer" className="text-xs font-bold text-teal-700">Mở trang gốc</a>
                    </div>
                    <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{x.text}</pre>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">Nguyên văn theo trang</h2>
              <p className="mt-2 text-sm text-slate-600">Tìm thấy {exactPages.length} trang.</p>
              <div className="mt-4 space-y-4">
                {exactPages.slice(0, 40).map((p) => (
                  <article key={p.pdfPage} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-black text-slate-900">PDF trang {p.pdfPage}</span>
                      <a href={sourcePdfUrl("UMC2023", p.pdfPage)} target="_blank" rel="noreferrer" className="text-xs font-bold text-teal-700">Mở PDF gốc</a>
                    </div>
                    <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-4 font-sans text-sm leading-6 text-slate-700">{p.text}</pre>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
