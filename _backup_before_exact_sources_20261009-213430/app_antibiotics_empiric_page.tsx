"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import {
  allSyndromes,
  categoryCounts,
  fullGuidelineMeta,
  sourceMap,
  syndromeCategories,
  type ClinicalSyndrome,
  type TreatmentOption,
  type VerificationLevel,
} from "../../../data/antibiotics/full-guidelines";

export default function EmpiricPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allSyndromes.filter((item) => {
      const categoryOk = category === "Tất cả" || item.category === category;
      const text = [
        item.title,
        item.category,
        ...item.setting,
        ...item.severity,
        ...item.commonPathogens,
        ...item.assessment,
        ...item.firstLine.flatMap((x) => x.drugs),
        ...(item.alternatives?.flatMap((x) => x.drugs) ?? []),
        ...(item.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return categoryOk && (!q || text.includes(q));
    });
  }, [query, category]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">
                ANTIMICROBIAL STEWARDSHIP
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">
                Điều trị kháng sinh theo kinh nghiệm
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                Thư viện hội chứng nhiễm khuẩn người lớn, chuẩn hóa từ các tài liệu
                bệnh viện đã cung cấp và các nguồn quốc gia/quốc tế. Khi đã có định danh
                và AST, chuyển sang lựa chọn điều trị theo tác nhân.
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-400">
                Database: {fullGuidelineMeta.totalSyndromes} mặt bệnh/hội chứng · cập nhật nguồn:{" "}
                {fullGuidelineMeta.lastClinicalSourceReview}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/antibiotics/organism"
                className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
              >
                Lựa chọn theo tác nhân →
              </Link>
              <Link
                href="/antibiotics/antibiogram"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                Antibiogram BV199
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-900">
            <b>Lưu ý an toàn:</b> công cụ hỗ trợ quyết định, không tự động kê đơn.
            Trước khi áp dụng cần đánh giá dị ứng, CrCl/eGFR, gan, thai kỳ, tương tác,
            source control, kháng sinh đã dùng, AST trước đó và antibiogram BV199.
            Các mục “Chỉ mục – cần đối chiếu” chưa được xem là phác đồ hoàn chỉnh.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm: viêm phổi, viêm xoang, sepsis, cUTI, MRSA, ESBL, Candida..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {syndromeCategories.map((item) => {
              const active = category === item;
              const count =
                item === "Tất cả" ? allSyndromes.length : categoryCounts[item] ?? 0;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={[
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-bold transition",
                    active
                      ? "bg-teal-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  ].join(" ")}
                >
                  <span className="pr-3">{item}</span>
                  <span className={active ? "text-teal-100" : "text-slate-400"}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-xs font-semibold text-slate-400">
            Đang hiển thị {filtered.length}/{allSyndromes.length} mặt bệnh / hội chứng.
          </p>
        </section>

        <div className="mt-5 space-y-4">
          {filtered.map((item) => {
            const open = openId === item.id;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-start justify-between gap-5 p-5 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Tag>{item.category}</Tag>
                      {item.setting.slice(0, 2).map((x) => (
                        <Tag key={x}>{x}</Tag>
                      ))}
                      {item.severity.slice(0, 1).map((x) => (
                        <Tag key={x}>{x}</Tag>
                      ))}
                    </div>

                    <h2 className="mt-3 text-xl font-black text-slate-950">
                      {item.title}
                    </h2>

                    {!!item.commonPathogens.length && (
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Tác nhân lưu ý: {item.commonPathogens.join(" · ")}
                      </p>
                    )}
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl font-black text-teal-700">
                    {open ? "−" : "+"}
                  </span>
                </button>

                {open && <SyndromeBody item={item} />}
              </article>
            );
          })}

          {!filtered.length && (
            <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-black text-slate-800">Không tìm thấy mặt bệnh phù hợp</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("Tất cả");
                }}
                className="mt-4 rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white"
              >
                Hiển thị tất cả
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function SyndromeBody({ item }: { item: ClinicalSyndrome }) {
  return (
    <div className="border-t border-slate-100 p-5">
      <div className="mb-5 flex flex-wrap gap-2">
        <VerificationBadge value={item.verification} />
        {item.requiresBV199Validation && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
            Cần phê duyệt BV199
          </span>
        )}
        {item.renalAdjustment && (
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold text-sky-700 ring-1 ring-sky-200">
            Kiểm tra chức năng thận
          </span>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <InfoBox title="Đánh giá trước điều trị" items={item.assessment} />
        <InfoBox
          title="Tác nhân cần lưu ý"
          items={
            item.commonPathogens.length
              ? item.commonPathogens
              : ["Chưa chuẩn hóa danh sách tác nhân chi tiết."]
          }
        />
      </div>

      {!!item.sourceControl?.length && (
        <div className="mt-5">
          <InfoBox
            title="Kiểm soát ổ nhiễm / Source control"
            items={item.sourceControl}
            tone="amber"
          />
        </div>
      )}

      <section className="mt-5">
        <h3 className="text-lg font-black text-slate-950">Lựa chọn điều trị</h3>
        <div className="mt-3 grid gap-4 xl:grid-cols-2">
          {item.firstLine.map((x, i) => (
            <TreatmentCard key={`${item.id}-first-${i}`} option={x} />
          ))}
        </div>
      </section>

      {!!item.alternatives?.length && (
        <section className="mt-5">
          <h3 className="text-lg font-black text-slate-950">Lựa chọn thay thế</h3>
          <div className="mt-3 grid gap-4 xl:grid-cols-2">
            {item.alternatives.map((x, i) => (
              <TreatmentCard key={`${item.id}-alt-${i}`} option={x} secondary />
            ))}
          </div>
        </section>
      )}

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <InfoBox title="Thời gian / nguyên tắc" items={item.duration} />
        <InfoBox title="Đánh giá lại" items={item.reassessment} />
        <InfoBox title="De-escalation" items={item.deEscalation} />
      </div>

      {!!item.tdm?.length && (
        <div className="mt-5">
          <InfoBox title="TDM / PK-PD" items={item.tdm} tone="blue" />
        </div>
      )}

      {!!item.evidenceNotes?.length && (
        <div className="mt-5">
          <InfoBox title="Ghi chú bằng chứng / xác minh" items={item.evidenceNotes} tone="amber" />
        </div>
      )}

      <section className="mt-5 rounded-xl border border-violet-200 bg-violet-50/50 p-4">
        <h3 className="font-black text-slate-900">Nguồn hướng dẫn</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.sourceIds.map((id) => {
            const source = sourceMap[id];
            if (!source) return null;

            const badge = (
              <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-bold text-violet-700 ring-1 ring-violet-200">
                {source.name} · {source.year}
              </span>
            );

            return source.url ? (
              <a key={id} href={source.url} target="_blank" rel="noreferrer" className="hover:opacity-80">
                {badge}
              </a>
            ) : (
              <span key={id}>{badge}</span>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TreatmentCard({
  option,
  secondary = false,
}: {
  option: TreatmentOption;
  secondary?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border p-4",
        secondary ? "border-slate-200 bg-slate-50" : "border-teal-200 bg-teal-50/50",
      ].join(" ")}
    >
      <h4 className="font-black text-slate-900">{option.title}</h4>
      <div className="mt-3 space-y-2">
        {option.drugs.map((drug, index) => (
          <p key={`${drug}-${index}`} className="text-sm leading-6 text-slate-700">
            <span className="mr-2 font-black text-teal-700">•</span>
            {drug}
          </p>
        ))}
      </div>
    </div>
  );
}

function VerificationBadge({ value }: { value: VerificationLevel }) {
  if (value === "VERIFIED_EXACT") {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
        Đã đối chiếu chi tiết
      </span>
    );
  }

  if (value === "GUIDELINE_SYNTHESIS") {
    return (
      <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200">
        Tổng hợp guideline
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
      Chỉ mục – cần đối chiếu
    </span>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
      {children}
    </span>
  );
}

function InfoBox({
  title,
  items,
  tone = "default",
}: {
  title: string;
  items: string[];
  tone?: "default" | "blue" | "amber";
}) {
  let style = "border-slate-200 bg-slate-50";
  if (tone === "blue") style = "border-blue-200 bg-blue-50";
  if (tone === "amber") style = "border-amber-200 bg-amber-50";

  return (
    <section className={`rounded-xl border p-4 ${style}`}>
      <h3 className="font-black text-slate-900">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <p key={`${item}-${index}`} className="text-sm leading-6 text-slate-700">
            <span className="mr-2 font-black text-slate-400">•</span>
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
