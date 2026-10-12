"use client";

import Link from "next/link";

import {
  useState,
} from "react";

import type {
  TdmModule,
} from "@/data/tdm/tdm-modules";

type TabId =
  | "overview"
  | "workflow"
  | "tools"
  | "record";

export default function TdmDrugPage({
  module,
}: {
  module: TdmModule;
}) {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<TabId>(
      "overview"
    );

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl">

        {/* ===============================================
            BREADCRUMB
        ================================================ */}

        <div className="mb-5 flex flex-wrap gap-2">

          <Link
            href="/tdm"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Tổng quan TDM
          </Link>

          <Link
            href="/pkpd"
            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
          >
            PK/PD →
          </Link>

        </div>

        {/* ===============================================
            HEADER
        ================================================ */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-lg font-black text-violet-700">
                {
                  module.code
                }
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                  TDM
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                  {
                    module.name
                  }
                </h1>

                <p className="mt-1 font-semibold text-violet-700">
                  {
                    module.subtitle
                  }
                </p>

              </div>

            </div>

            <StatusBadge
              status={
                module.status
              }
              label={
                module.statusLabel
              }
            />

          </div>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-600">
            {
              module.description
            }
          </p>

          <div className="mt-4 flex flex-wrap gap-2">

            {module.pkpdIndex && (

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                PK/PD:
                {" "}
                {
                  module.pkpdIndex
                }
              </span>

            )}

            {module.externalTool && (

              <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                {
                  module.externalTool.name
                }
              </span>

            )}

          </div>

        </section>

        {/* ===============================================
            TABS
        ================================================ */}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">

            <TabButton
              active={
                activeTab ===
                "overview"
              }
              onClick={() =>
                setActiveTab(
                  "overview"
                )
              }
              number="1"
              title="Tổng quan"
            />

            <TabButton
              active={
                activeTab ===
                "workflow"
              }
              onClick={() =>
                setActiveTab(
                  "workflow"
                )
              }
              number="2"
              title="Quy trình"
            />

            <TabButton
              active={
                activeTab ===
                "tools"
              }
              onClick={() =>
                setActiveTab(
                  "tools"
                )
              }
              number="3"
              title="Công cụ / TDM"
            />

            <TabButton
              active={
                activeTab ===
                "record"
              }
              onClick={() =>
                setActiveTab(
                  "record"
                )
              }
              number="4"
              title="Ghi nhận & can thiệp"
            />

          </div>

        </div>

        {/* ===============================================
            OVERVIEW
        ================================================ */}

        {activeTab ===
          "overview" && (

          <div className="mt-5 grid gap-5 lg:grid-cols-3">

            <ClinicalCard
              title="Khi nào cần lưu ý TDM?"
              items={
                module
                  .overview
                  .indication
              }
            />

            <ClinicalCard
              title="Thông số cần theo dõi"
              items={
                module
                  .overview
                  .monitoring
              }
            />

            <ClinicalCard
              title="An toàn"
              items={
                module
                  .overview
                  .safety
              }
            />

          </div>

        )}

        {/* ===============================================
            WORKFLOW
        ================================================ */}

        {activeTab ===
          "workflow" && (

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
              WORKFLOW
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Quy trình thực hiện
            </h2>

            <div className="mt-6 space-y-3">

              {module.workflow.map(
                (
                  step,
                  index
                ) => (

                  <div
                    key={
                      step.title
                    }
                    className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-700">
                      {
                        index +
                        1
                      }
                    </div>

                    <div>

                      <p className="font-bold text-slate-900">
                        {
                          step.title
                        }
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {
                          step.description
                        }
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        {/* ===============================================
            TOOLS
        ================================================ */}

        {activeTab ===
          "tools" && (

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              CLINICAL TOOL
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Công cụ hỗ trợ
            </h2>

            {module.externalTool ? (

              <div className="mt-5 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">

                <h3 className="text-xl font-bold text-slate-900">
                  {
                    module.externalTool.name
                  }
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Sử dụng công cụ chuyên biệt để hỗ trợ phân tích
                  dược động học/TDM. App BV199 đóng vai trò
                  chuẩn hóa workflow và ghi nhận can thiệp.
                </p>

                <a
                  href={
                    module.externalTool.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
                >
                  Mở
                  {" "}
                  {
                    module.externalTool.name
                  }
                  {" "}
                  ↗
                </a>

              </div>

            ) : (

              <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

                <p className="font-semibold text-slate-700">
                  Chưa tích hợp công cụ chuyên biệt.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Module hiện sử dụng workflow và hướng dẫn lâm sàng.
                </p>

              </div>

            )}

          </section>

        )}

        {/* ===============================================
            RECORD
        ================================================ */}

        {activeTab ===
          "record" && (

          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              CLINICAL PHARMACY INTERVENTION
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Ghi nhận đánh giá
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <SimpleField
                label="Kết quả TDM / nồng độ"
                placeholder="Nhập kết quả..."
              />

              <SimpleField
                label="Đề xuất regimen"
                placeholder="Nhập liều / khoảng cách liều..."
              />

            </div>

            <div className="mt-4">

              <label className="text-sm font-semibold text-slate-700">
                Đánh giá của Dược sĩ lâm sàng
              </label>

              <textarea
                rows={
                  6
                }
                placeholder="Đánh giá hiệu quả, an toàn, chức năng thận, tương tác, kế hoạch TDM lại..."
                className="mt-2 w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-teal-400"
              />

            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              <select className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm">
                <option>
                  Chưa xác định mức độ chấp nhận
                </option>

                <option>
                  Bác sĩ chấp nhận đề xuất
                </option>

                <option>
                  Bác sĩ chấp nhận một phần
                </option>

                <option>
                  Không chấp nhận
                </option>
              </select>

              <input
                type="datetime-local"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

            </div>

          </section>

        )}

      </div>

    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function TabButton({
  active,
  onClick,
  number,
  title,
}: {
  active: boolean;

  onClick:
    () => void;

  number: string;

  title: string;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={[
        "flex",
        "items-center",
        "gap-3",
        "rounded-xl",
        "px-4",
        "py-3",
        "text-left",
        "transition",

        active
          ? "bg-violet-600 text-white shadow-sm"
          : "bg-slate-50 text-slate-700 hover:bg-slate-100",
      ].join(
        " "
      )}
    >

      <span
        className={[
          "flex",
          "h-7",
          "w-7",
          "items-center",
          "justify-center",
          "rounded-lg",
          "text-xs",
          "font-bold",

          active
            ? "bg-white/20"
            : "bg-white",
        ].join(
          " "
        )}
      >
        {
          number
        }
      </span>

      <span className="text-sm font-bold">
        {
          title
        }
      </span>

    </button>
  );
}

function ClinicalCard({
  title,
  items,
}: {
  title: string;

  items: string[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <h2 className="font-bold text-slate-900">
        {
          title
        }
      </h2>

      <div className="mt-4 space-y-3">

        {items.map(
          (
            item
          ) => (

            <div
              key={
                item
              }
              className="flex gap-3"
            >

              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />

              <p className="text-sm leading-6 text-slate-600">
                {
                  item
                }
              </p>

            </div>

          )
        )}

      </div>

    </section>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: string;

  label: string;
}) {
  return (
    <span
      className={
        status ===
        "ready"
          ? "rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800"
          : "rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800"
      }
    >
      {
        label
      }
    </span>
  );
}

function SimpleField({
  label,
  placeholder,
}: {
  label: string;

  placeholder: string;
}) {
  return (
    <div>

      <label className="text-sm font-semibold text-slate-700">
        {
          label
        }
      </label>

      <input
        placeholder={
          placeholder
        }
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-400"
      />

    </div>
  );
}