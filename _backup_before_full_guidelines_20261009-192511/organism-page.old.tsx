"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import {
  pathogenGroups,
  pathogenGuidance,
  sourceMap,
} from "@/data/antibiotics/full-guidelines-base";

export default function OrganismPage() {
  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    group,
    setGroup,
  ] =
    useState(
      "Tất cả"
    );

  const [
    openId,
    setOpenId,
  ] =
    useState<
      string | null
    >(null);

  const filtered =
    useMemo(
      () => {
        const q =
          query
            .trim()
            .toLowerCase();

        return pathogenGuidance.filter(
          (
            item
          ) => {

            const groupOk =
              group ===
                "Tất cả" ||
              item.group ===
                group;

            const text =
              [
                item.name,
                item.group,
                item.phenotype ??
                  "",
                ...item.commonSites,
                ...item.preferred,
                ...item.avoid,
              ]
                .join(
                  " "
                )
                .toLowerCase();

            return (
              groupOk &&
              (
                !q ||
                text.includes(
                  q
                )
              )
            );
          }
        );
      },
      [
        query,
        group,
      ]
    );

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-24">

      <div className="mx-auto max-w-7xl">

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                TARGETED ANTIMICROBIAL THERAPY
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                Lựa chọn kháng sinh theo tác nhân
              </h1>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                Dùng sau khi có định danh vi sinh,
                AST và vị trí nhiễm.
              </p>

            </div>

            <div className="flex gap-2">

              <Link
                href="/antibiotics/empiric"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold"
              >
                ← Điều trị kinh nghiệm
              </Link>

              <Link
                href="/antibiotics/antibiogram"
                className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white"
              >
                Antibiogram BV199
              </Link>

            </div>

          </div>

        </section>

        <section className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <b>CLSI:</b>{" "}
          S/I/R phải lấy từ AST theo CLSI của labo.
          PK/PD không tự biến một chủng R thành S.
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

          <input
            value={
              query
            }
            onChange={
              (
                e
              ) =>
                setQuery(
                  e.target.value
                )
            }
            placeholder="E. coli, ESBL, CRE, MRSA, CRAB, Pseudomonas..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <div className="mt-4 flex flex-wrap gap-2">

            {pathogenGroups.map(
              (
                item
              ) => (

                <button
                  key={
                    item
                  }
                  onClick={() =>
                    setGroup(
                      item
                    )
                  }
                  className={[
                    "rounded-xl px-3 py-2 text-xs font-bold",

                    group ===
                    item
                      ? "bg-violet-700 text-white"
                      : "bg-slate-100 text-slate-600",
                  ].join(
                    " "
                  )}
                >
                  {
                    item
                  }
                </button>

              )
            )}

          </div>

        </section>

        <div className="mt-5 space-y-4">

          {filtered.map(
            (
              item
            ) => {

              const open =
                openId ===
                  item.id;

              return (
                <article
                  key={
                    item.id
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >

                  <button
                    onClick={() =>
                      setOpenId(
                        open
                          ? null
                          : item.id
                      )
                    }
                    className="flex w-full items-start justify-between p-5 text-left"
                  >

                    <div>

                      <div className="flex gap-2">

                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                          {
                            item.group
                          }
                        </span>

                        {item.phenotype && (

                          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                            {
                              item.phenotype
                            }
                          </span>

                        )}

                      </div>

                      <h2 className="mt-3 text-xl font-black">
                        {
                          item.name
                        }
                      </h2>

                    </div>

                    <span className="text-2xl font-bold text-violet-700">
                      {
                        open
                          ? "−"
                          : "+"
                      }
                    </span>

                  </button>

                  {open && (

                    <div className="border-t border-slate-100 p-5">

                      <div className="grid gap-5 xl:grid-cols-2">

                        <section className="rounded-xl border border-teal-200 bg-teal-50 p-4">

                          <h3 className="font-black">
                            Lựa chọn ưu tiên
                          </h3>

                          {item.preferred.map(
                            (
                              value
                            ) => (

                              <p
                                key={
                                  value
                                }
                                className="mt-2 text-sm leading-6"
                              >
                                • {
                                  value
                                }
                              </p>

                            )
                          )}

                        </section>

                        <section className="rounded-xl border border-rose-200 bg-rose-50 p-4">

                          <h3 className="font-black text-rose-900">
                            Không nên / cần tránh
                          </h3>

                          {item.avoid.map(
                            (
                              value
                            ) => (

                              <p
                                key={
                                  value
                                }
                                className="mt-2 text-sm leading-6 text-rose-800"
                              >
                                • {
                                  value
                                }
                              </p>

                            )
                          )}

                        </section>

                      </div>

                      <section className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4">

                        <h3 className="font-black">
                          Nguồn
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">

                          {item.sourceIds.map(
                            (
                              id
                            ) => {

                              const source =
                                sourceMap[
                                  id
                                ];

                              if (
                                !source
                              ) {
                                return null;
                              }

                              return (
                                <span
                                  key={
                                    id
                                  }
                                  className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700"
                                >
                                  {
                                    source.name
                                  }
                                </span>
                              );
                            }
                          )}

                        </div>

                      </section>

                    </div>

                  )}

                </article>
              );
            }
          )}

        </div>

      </div>

    </main>
  );
}