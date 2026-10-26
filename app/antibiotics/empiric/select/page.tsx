"use client";

/*
  FILE: app/antibiotics/empiric/select/page.tsx
  NHIEM VU 4B – Lua chon khang sinh theo nguoi benh (Clinical Antibiotic Selection Engine).
  ?disease=v8-N: mo san mat benh. useSearchParams can Suspense khi build tinh (Next 16).
*/

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import BackBar from "@/components/antibiotics/links/BackBar";
import SelectionEngine from "@/components/antibiotics/selection/SelectionEngine";

function SelectFromUrl() {
  const params = useSearchParams();
  return <SelectionEngine initialDisease={params.get("disease") ?? undefined} />;
}

export default function AntibioticSelectPage() {
  return (
    <main className="mx-auto w-full max-w-[1500px] p-3 md:p-5">
      <BackBar
        fallbackHref="/antibiotics"
        fallbackLabel="Kháng sinh & AMS"
        links={[
          { href: "/antibiotics/empiric/guideline-v9", label: "Phác đồ kinh nghiệm" },
          { href: "/antibiotics/dosing", label: "Hiệu chỉnh liều" },
          { href: "/antibiotics/antibiogram", label: "Antibiogram BV199" },
        ]}
      />
      <header className="mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
          Khoa Dược · Bệnh viện 199
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">
          Chọn kháng sinh theo người bệnh
        </h1>
      </header>
      <Suspense fallback={<div className="text-sm text-slate-500">Đang tải…</div>}>
        <SelectFromUrl />
      </Suspense>
    </main>
  );
}
