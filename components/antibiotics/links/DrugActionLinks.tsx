"use client";

/*
  FILE: components/antibiotics/links/DrugActionLinks.tsx
  Nut chuyen nhanh tu mot phac do sang:
    - Hieu chinh lieu (/antibiotics/dosing) voi hoat chat + chi dinh (neu khop) + CrCl
    - Antibiogram BV199 (/antibiotics/antibiogram) loc theo khang sinh
  Khi trang co Bo loc lam sang: danh dau di ung penicillin, thuoc ngoai danh muc
  BV199, va hien lieu theo CrCl NGUYEN VAN tu module Hieu chinh lieu.
  Khong tu tao lieu.
*/

import Link from "next/link";

import { useClinicalFilters } from "@/components/antibiotics/empiric/ClinicalFilters";
import {
  isOtherBetaLactam,
  isPenicillinClass,
  parseCrcl,
  renalDoseFor,
} from "@/lib/antibiotics/clinical-filters";
import {
  antibiogramHref,
  antibiogramIdFor,
  dosingHref,
  findDrugs,
} from "@/lib/antibiotics/drug-links";
import { formularyProducts } from "@/lib/antibiotics/formulary";

import { useAbxLinkContext } from "./AbxLinkContext";

type Props = {
  /* Van ban phac do (ten thuoc + lieu), moi phan tu mot dong. */
  texts: string[];
  /* Tinh huong / ten phac do, ghi vao ngu canh gui sang trang dich. */
  scenario?: string;
  compact?: boolean;
};

function routesOf(ingredientId: string): string {
  const routes = new Set(formularyProducts(ingredientId).map((p) => p.route).filter(Boolean));
  return Array.from(routes).join(", ");
}

export default function DrugActionLinks({ texts, scenario, compact }: Props) {
  const ctx = useAbxLinkContext();
  const filters = useClinicalFilters();
  const drugs = findDrugs(texts);

  if (drugs.length === 0) return null;

  const crcl = filters ? parseCrcl(filters.crcl) : null;
  const linkCtx = {
    ...ctx,
    context: [ctx.context, scenario].filter(Boolean).join(" · "),
    crcl: crcl !== null ? String(crcl) : undefined,
  };

  return (
    <div className={"bv199-drug-links mt-2 " + (compact ? "text-[11px]" : "text-xs")}>
      <div
        className="flex flex-wrap items-center gap-1.5"
        aria-label="Chuyển sang module liên quan"
      >
        <span className="mr-0.5 font-semibold text-slate-500">
          Hiệu chỉnh liều · Kháng sinh đồ BV199:
        </span>
        {drugs.map((drug) => {
          const abId = antibiogramIdFor(drug.ingredientId);
          const pen = filters?.penicillinAllergy && isPenicillinClass(drug.ingredientId);
          const otherBL = filters?.penicillinAllergy && isOtherBetaLactam(drug.ingredientId);
          const products = filters ? formularyProducts(drug.ingredientId) : [];
          const outOfFormulary = !!filters && products.length === 0;
          return (
            <span
              key={drug.ingredientId}
              className={
                "inline-flex overflow-hidden rounded-full border bg-white " +
                (pen
                  ? "border-red-400"
                  : outOfFormulary
                    ? "border-dashed border-slate-400"
                    : "border-teal-300")
              }
            >
              <Link
                href={dosingHref(drug, linkCtx)}
                className={
                  "inline-flex min-h-8 items-center gap-1 px-2.5 font-semibold hover:bg-teal-50 " +
                  (pen ? "text-red-700" : outOfFormulary ? "text-slate-500" : "text-teal-800")
                }
                title={
                  `Mở Hiệu chỉnh liều: ${drug.name}` +
                  (filters
                    ? products.length > 0
                      ? ` · Có trong danh mục BV199 (${products.length} sản phẩm; ${routesOf(drug.ingredientId)})`
                      : " · Không tìm thấy trong danh mục BV199"
                    : "")
                }
              >
                {drug.name}
                {pen && <span className="rounded bg-red-100 px-1 text-[10px]">penicillin</span>}
                {otherBL && <span className="rounded bg-amber-100 px-1 text-[10px] text-amber-800">β-lactam</span>}
                {outOfFormulary && <span className="text-[10px] font-normal">· ngoài DM</span>}
              </Link>
              {abId && (
                <Link
                  href={antibiogramHref({ antibioticId: abId }, ctx)}
                  className="inline-flex min-h-8 items-center border-l border-teal-200 bg-teal-50 px-2 font-semibold text-teal-700 hover:bg-teal-100"
                  title={`Antibiogram BV199: ${drug.name}`}
                  aria-label={`Antibiogram BV199 cho ${drug.name}`}
                >
                  Kháng sinh đồ
                </Link>
              )}
            </span>
          );
        })}
      </div>

      {crcl !== null && (
        <ul className="mt-1.5 grid gap-0.5 rounded-lg bg-slate-50 p-2 leading-5 text-slate-700">
          {drugs.map((drug) => {
            const r = renalDoseFor(drug, crcl, ctx.diseaseId);
            return (
              <li key={drug.ingredientId}>
                <strong>{drug.name}</strong> – CrCl {crcl}:{" "}
                {r.kind === "dose"
                  ? `${r.dose} · ${r.interval} (${r.label}; ${r.indication})`
                  : r.kind === "multi"
                    ? "nhiều chỉ định, bấm tên thuốc để chọn chỉ định"
                    : r.kind === "narrative"
                      ? "nguồn mô tả dạng văn bản, bấm tên thuốc để xem"
                      : "không có mức liều cho CrCl này trong dữ liệu – không tự suy ra"}
              </li>
            );
          })}
        </ul>
      )}

      {filters?.penicillinAllergy &&
        drugs.some((d) => isPenicillinClass(d.ingredientId) || isOtherBetaLactam(d.ingredientId)) && (
          <p className="mt-1 text-[11px] text-red-700">
            Dị ứng penicillin: thuốc viền đỏ thuộc nhóm penicillin; nhãn β-lactam cần
            đánh giá phản ứng chéo theo{" "}
            <Link href="/antibiotics/allergy" className="font-semibold underline">
              module Dị ứng kháng sinh
            </Link>
            .
          </p>
        )}
    </div>
  );
}
