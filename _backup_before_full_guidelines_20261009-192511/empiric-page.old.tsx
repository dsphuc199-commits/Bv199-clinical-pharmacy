"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  allSyndromes,
  categoryCounts,
  sourceMap,
  syndromeCategories,
  type ClinicalSyndrome,
  type TreatmentOption,
  type VerificationLevel,
} from "../../../data/antibiotics/full-guidelines";

/* =========================================================
   BV199 CLINICAL PHARMACY
   ĐIỀU TRỊ KHÁNG SINH THEO KINH NGHIỆM
========================================================= */

export default function EmpiricPage() {
  const [query, setQuery] =
    useState("");

  const [category, setCategory] =
    useState("Tất cả");

  const [openId, setOpenId] =
    useState<string | null>(null);

  /* =======================================================
     FILTER
  ======================================================= */

  const filtered =
    useMemo(() => {
      const keyword =
        query
          .trim()
          .toLowerCase();

      return allSyndromes.filter(
        (item) => {
          const categoryMatch =
            category === "Tất cả" ||
            item.category === category;

          const searchText = [
            item.title,
            item.category,
            ...item.setting,
            ...item.severity,
            ...item.commonPathogens,
            ...item.assessment,

            ...item.firstLine.flatMap(
              (option) =>
                option.drugs
            ),

            ...(
              item.alternatives?.flatMap(
                (option) =>
                  option.drugs
              ) ?? []
            ),
          ]
            .join(" ")
            .toLowerCase();

          const searchMatch =
            !keyword ||
            searchText.includes(
              keyword
            );

          return (
            categoryMatch &&
            searchMatch
          );
        }
      );
    }, [
      query,
      category,
    ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-24">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

            <div className="min-w-0">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">
                ANTIMICROBIAL STEWARDSHIP
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                Điều trị kháng sinh theo kinh nghiệm
              </h1>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                Lựa chọn theo hội chứng, vị trí nhiễm,
                bối cảnh, mức độ nặng và nguy cơ vi khuẩn
                đề kháng. Khi đã có định danh vi sinh và AST,
                chuyển sang lựa chọn điều trị theo tác nhân.
              </p>

            </div>

            <div className="flex shrink-0 flex-wrap gap-2">

              <Link
                href="/antibiotics/organism"
                className="
                  rounded-xl
                  bg-teal-700
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-teal-800
                "
              >
                Lựa chọn theo tác nhân →
              </Link>

              <Link
                href="/antibiotics/antibiogram"
                className="
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                Antibiogram BV199
              </Link>

            </div>

          </div>

        </section>

        {/* =================================================
            CLINICAL SAFETY
        ================================================= */}

        <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">

          <p className="text-sm leading-6 text-amber-900">

            <b>Lưu ý lâm sàng:</b>{" "}

            trước khi lựa chọn phác đồ cần đánh giá
            dị ứng thuốc, CrCl/eGFR, chức năng gan,
            thai kỳ, tương tác thuốc, source control,
            AST trước đó, kháng sinh đã sử dụng
            và antibiogram BV199.

          </p>

        </section>

        {/* =================================================
            SEARCH + CATEGORY
        ================================================= */}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <input
            value={query}

            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }

            placeholder="Tìm bệnh: viêm phổi, viêm xoang, viêm họng, viêm tai, sepsis, cUTI, áp xe..."

            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              text-sm
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-teal-500
              focus:ring-2
              focus:ring-teal-100
            "
          />

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {syndromeCategories.map(
              (item) => {
                const active =
                  category === item;

                const count =
                  item === "Tất cả"
                    ? allSyndromes.length
                    : categoryCounts[item] ?? 0;

                return (
                  <button
                    key={item}
                    type="button"

                    onClick={() =>
                      setCategory(item)
                    }

                    className={[
                      "flex",
                      "items-center",
                      "justify-between",
                      "rounded-xl",
                      "px-3",
                      "py-2.5",
                      "text-left",
                      "text-xs",
                      "font-bold",
                      "transition",

                      active
                        ? "bg-teal-700 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                    ].join(" ")}
                  >

                    <span className="pr-3">
                      {item}
                    </span>

                    <span
                      className={
                        active
                          ? "text-teal-100"
                          : "text-slate-400"
                      }
                    >
                      {count}
                    </span>

                  </button>
                );
              }
            )}

          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

            <p className="text-xs font-semibold text-slate-400">

              Đang hiển thị{" "}

              <span className="font-black text-slate-600">
                {filtered.length}
              </span>

              /

              <span className="font-black text-slate-600">
                {allSyndromes.length}
              </span>

              {" "}
              mặt bệnh / hội chứng.

            </p>

            {category !== "Tất cả" && (

              <button
                type="button"

                onClick={() =>
                  setCategory(
                    "Tất cả"
                  )
                }

                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Xóa bộ lọc
              </button>

            )}

          </div>

        </section>

        {/* =================================================
            LIST
        ================================================= */}

        <div className="mt-5 space-y-4">

          {filtered.map(
            (item) => {
              const open =
                openId === item.id;

              return (
                <article
                  key={item.id}

                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition
                    hover:border-slate-300
                  "
                >

                  <button
                    type="button"

                    onClick={() =>
                      setOpenId(
                        open
                          ? null
                          : item.id
                      )
                    }

                    className="
                      flex
                      w-full
                      items-start
                      justify-between
                      gap-5
                      p-5
                      text-left
                    "
                  >

                    <div className="min-w-0">

                      <div className="flex flex-wrap gap-2">

                        <Tag>
                          {item.category}
                        </Tag>

                        {item.setting
                          .slice(0, 2)
                          .map(
                            (value) => (
                              <Tag key={value}>
                                {value}
                              </Tag>
                            )
                          )}

                        {item.severity
                          .slice(0, 1)
                          .map(
                            (value) => (
                              <Tag key={value}>
                                {value}
                              </Tag>
                            )
                          )}

                      </div>

                      <h2 className="mt-3 text-xl font-black text-slate-950">
                        {item.title}
                      </h2>

                      {item.commonPathogens.length >
                        0 && (

                        <p className="mt-2 text-sm leading-6 text-slate-500">

                          Tác nhân lưu ý:{" "}

                          {
                            item.commonPathogens.join(
                              " · "
                            )
                          }

                        </p>

                      )}

                    </div>

                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-teal-50
                        text-xl
                        font-black
                        text-teal-700
                      "
                    >
                      {open ? "−" : "+"}
                    </span>

                  </button>

                  {open && (
                    <SyndromeBody
                      item={item}
                    />
                  )}

                </article>
              );
            }
          )}

          {filtered.length === 0 && (

            <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <p className="text-base font-black text-slate-800">
                Không tìm thấy mặt bệnh phù hợp
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Thử từ khóa khác hoặc chọn lại nhóm bệnh.
              </p>

              <button
                type="button"

                onClick={() => {
                  setQuery("");
                  setCategory(
                    "Tất cả"
                  );
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

/* =========================================================
   SYNDROME CONTENT
========================================================= */

function SyndromeBody({
  item,
}: {
  item: ClinicalSyndrome;
}) {
  return (
    <div className="border-t border-slate-100 p-5">

      <div className="mb-5 flex flex-wrap gap-2">

        <VerificationBadge
          value={
            item.verification
          }
        />

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

      {/* ===================================================
          ASSESSMENT
      =================================================== */}

      <div className="grid gap-5 xl:grid-cols-2">

        <InfoBox
          title="Đánh giá trước điều trị"
          items={
            item.assessment
          }
        />

        <InfoBox
          title="Tác nhân cần lưu ý"

          items={
            item.commonPathogens.length
              ? item.commonPathogens
              : [
                  "Chưa chuẩn hóa danh sách tác nhân chi tiết.",
                ]
          }
        />

      </div>

      {/* ===================================================
          SOURCE CONTROL
      =================================================== */}

      {item.sourceControl?.length ? (

        <div className="mt-5">

          <InfoBox
            title="Kiểm soát ổ nhiễm / Source control"

            items={
              item.sourceControl
            }

            tone="amber"
          />

        </div>

      ) : null}

      {/* ===================================================
          FIRST LINE
      =================================================== */}

      <section className="mt-5">

        <h3 className="text-lg font-black text-slate-950">
          Lựa chọn điều trị
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Đối chiếu dị ứng, chức năng thận/gan,
          vị trí nhiễm, antibiogram và AST trước khi áp dụng.
        </p>

        <div className="mt-3 grid gap-4 xl:grid-cols-2">

          {item.firstLine.map(
            (
              option,
              index
            ) => (

              <TreatmentCard
                key={
                  `${item.id}-first-${index}`
                }

                option={
                  option
                }
              />

            )
          )}

        </div>

      </section>

      {/* ===================================================
          ALTERNATIVES
      =================================================== */}

      {item.alternatives?.length ? (

        <section className="mt-5">

          <h3 className="text-lg font-black text-slate-950">
            Lựa chọn thay thế
          </h3>

          <div className="mt-3 grid gap-4 xl:grid-cols-2">

            {item.alternatives.map(
              (
                option,
                index
              ) => (

                <TreatmentCard
                  key={
                    `${item.id}-alternative-${index}`
                  }

                  option={
                    option
                  }

                  secondary
                />

              )
            )}

          </div>

        </section>

      ) : null}

      {/* ===================================================
          DURATION
      =================================================== */}

      <div className="mt-5 grid gap-5 xl:grid-cols-3">

        <InfoBox
          title="Thời gian / nguyên tắc"

          items={
            item.duration
          }
        />

        <InfoBox
          title="Đánh giá lại"

          items={
            item.reassessment
          }
        />

        <InfoBox
          title="De-escalation"

          items={
            item.deEscalation
          }
        />

      </div>

      {/* ===================================================
          TDM
      =================================================== */}

      {item.tdm?.length ? (

        <div className="mt-5">

          <InfoBox
            title="TDM / PK-PD"

            items={
              item.tdm
            }

            tone="blue"
          />

        </div>

      ) : null}

      {/* ===================================================
          SOURCES
      =================================================== */}

      <section className="mt-5 rounded-xl border border-violet-200 bg-violet-50/50 p-4">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>

            <h3 className="font-black text-slate-900">
              Nguồn hướng dẫn
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Hiển thị riêng nguồn bệnh viện,
              Bộ Y tế và guideline quốc tế.
            </p>

          </div>

          <Link
            href="/antibiotics/antibiogram"

            className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-teal-700 ring-1 ring-slate-200"
          >
            Antibiogram BV199 →
          </Link>

        </div>

        <div className="mt-4 flex flex-wrap gap-2">

          {item.sourceIds.map(
            (id) => {
              const source =
                sourceMap[id];

              if (!source) {
                return null;
              }

              const badge = (
                <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-bold text-violet-700 ring-1 ring-violet-200">

                  {source.name}

                  {" · "}

                  {source.year}

                </span>
              );

              if (source.url) {
                return (
                  <a
                    key={id}

                    href={
                      source.url
                    }

                    target="_blank"

                    rel="noreferrer"

                    className="transition hover:opacity-80"
                  >
                    {badge}
                  </a>
                );
              }

              return (
                <span key={id}>
                  {badge}
                </span>
              );
            }
          )}

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   TREATMENT CARD
========================================================= */

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
        "rounded-xl",
        "border",
        "p-4",

        secondary
          ? "border-slate-200 bg-slate-50"
          : "border-teal-200 bg-teal-50/50",
      ].join(" ")}
    >

      <h4 className="font-black text-slate-900">
        {option.title}
      </h4>

      <div className="mt-3 space-y-2">

        {option.drugs.map(
          (
            drug,
            index
          ) => (

            <p
              key={
                `${drug}-${index}`
              }

              className="text-sm leading-6 text-slate-700"
            >

              <span className="mr-2 font-black text-teal-700">
                •
              </span>

              {drug}

            </p>

          )
        )}

      </div>

      {option.notes?.length ? (

        <div className="mt-4 border-t border-slate-200 pt-3">

          {option.notes.map(
            (
              note,
              index
            ) => (

              <p
                key={
                  `${note}-${index}`
                }

                className="text-xs leading-5 text-slate-500"
              >
                {note}
              </p>

            )
          )}

        </div>

      ) : null}

    </div>
  );
}

/* =========================================================
   VERIFICATION BADGE
========================================================= */

function VerificationBadge({
  value,
}: {
  value: VerificationLevel;
}) {
  if (
    value === "VERIFIED_EXACT"
  ) {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
        Đã đối chiếu chi tiết
      </span>
    );
  }

  if (
    value === "VERIFIED_SUMMARY"
  ) {
    return (
      <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200">
        Đã chuẩn hóa nguyên tắc
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
      Đã lập danh mục
    </span>
  );
}

/* =========================================================
   TAG
========================================================= */

function Tag({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
      {children}
    </span>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  title,
  items,
  tone = "default",
}: {
  title: string;

  items: string[];

  tone?:
    | "default"
    | "blue"
    | "amber";
}) {
  let style =
    "border-slate-200 bg-slate-50";

  if (tone === "blue") {
    style =
      "border-blue-200 bg-blue-50";
  }

  if (tone === "amber") {
    style =
      "border-amber-200 bg-amber-50";
  }

  return (
    <section
      className={`rounded-xl border p-4 ${style}`}
    >

      <h3 className="font-black text-slate-900">
        {title}
      </h3>

      <div className="mt-3 space-y-2">

        {items.map(
          (
            item,
            index
          ) => (

            <p
              key={
                `${item}-${index}`
              }

              className="text-sm leading-6 text-slate-700"
            >

              <span className="mr-2 font-black text-slate-400">
                •
              </span>

              {item}

            </p>

          )
        )}

      </div>

    </section>
  );
}