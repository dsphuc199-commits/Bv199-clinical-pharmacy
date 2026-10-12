"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import {
  calculateAucMic,
  interpretVancomycinAucMic,
  interpretAminoglycoside,
  interpretBetaLactamFtMic,
  type PkPdMode,
  type CalculationResult,
} from "@/data/pkpd/calculators";

/* =========================================================
   PAGE
========================================================= */

export default function PkPdCalculatorPage() {
  const [
    mode,
    setMode,
  ] = useState<PkPdMode>(
    "beta-lactam"
  );

  const [
    mic,
    setMic,
  ] = useState("");

  const [
    ftMic,
    setFtMic,
  ] = useState("");

  const [
    auc24,
    setAuc24,
  ] = useState("");

  const [
    cmax,
    setCmax,
  ] = useState("");

  /* =======================================================
     CALCULATE
  ======================================================= */

  const result =
    useMemo<
      CalculationResult | null
    >(
      () => {
        const micValue =
          Number(
            mic
          );

        /* -------------------------------------------------
           BETA-LACTAM
        ------------------------------------------------- */

        if (
          mode ===
          "beta-lactam"
        ) {
          const ft =
            Number(
              ftMic
            );

          return (
            interpretBetaLactamFtMic(
              ft
            )
          );
        }

        /* -------------------------------------------------
           VANCOMYCIN
        ------------------------------------------------- */

        if (
          mode ===
          "vancomycin"
        ) {
          const auc =
            Number(
              auc24
            );

          const ratio =
            calculateAucMic(
              auc,
              micValue
            );

          if (
            ratio === null
          ) {
            return null;
          }

          return (
            interpretVancomycinAucMic(
              ratio
            )
          );
        }

        /* -------------------------------------------------
           AMINOGLYCOSIDE
        ------------------------------------------------- */

        if (
          mode ===
          "aminoglycoside"
        ) {
          const peak =
            Number(
              cmax
            );

          return (
            interpretAminoglycoside(
              peak,
              micValue
            )
          );
        }

        return null;
      },
      [
        mode,
        mic,
        ftMic,
        auc24,
        cmax,
      ]
    );

  /* =======================================================
     RESET INPUT
  ======================================================= */

  function resetInputs() {
    setMic("");
    setFtMic("");
    setAuc24("");
    setCmax("");
  }

  function changeMode(
    nextMode:
      PkPdMode
  ) {
    setMode(
      nextMode
    );

    resetInputs();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-6xl">

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="mb-5 flex flex-wrap gap-2">

          <Link
            href="/pkpd"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← PK/PD
          </Link>

          <Link
            href="/antibiotics/antibiogram"
            className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100"
          >
            Antibiogram BV199 →
          </Link>

          <Link
            href="/tdm"
            className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100"
          >
            TDM →
          </Link>

        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <header>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            PK/PD Calculator
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Tính và diễn giải chỉ số PK/PD
          </h1>

          <p className="mt-3 max-w-4xl leading-7 text-slate-600">
            Hỗ trợ tính toán các chỉ số PK/PD khi đã có
            dữ liệu phơi nhiễm hoặc kết quả TDM phù hợp.
          </p>

        </header>

        {/* =================================================
            WARNING
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <p className="font-bold text-amber-950">
            Giới hạn của calculator
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-900">
            Công cụ không tự suy ra AUC, Cmax hoặc
            fT&gt;MIC từ liều. AUC hoặc nồng độ thuốc cần
            đến từ TDM, Bayesian software hoặc mô hình
            PK đã được thẩm định.
          </p>

        </section>

        {/* =================================================
            MODE SELECTION
        ================================================= */}

        <section className="mt-6">

          <p className="text-sm font-bold text-slate-900">
            Chọn nhóm PK/PD
          </p>

          <div className="mt-3 grid gap-4 md:grid-cols-3">

            <ModeCard
              active={
                mode ===
                "beta-lactam"
              }
              title="β-lactam"
              subtitle="fT > MIC"
              description="Meropenem, cefepime, piperacillin/tazobactam..."
              onClick={() =>
                changeMode(
                  "beta-lactam"
                )
              }
            />

            <ModeCard
              active={
                mode ===
                "vancomycin"
              }
              title="Vancomycin"
              subtitle="AUC24 / MIC"
              description="Theo dõi AUC trong nhiễm MRSA nặng."
              onClick={() =>
                changeMode(
                  "vancomycin"
                )
              }
            />

            <ModeCard
              active={
                mode ===
                "aminoglycoside"
              }
              title="Aminoglycoside"
              subtitle="Cmax / MIC"
              description="Amikacin, gentamicin, tobramycin."
              onClick={() =>
                changeMode(
                  "aminoglycoside"
                )
              }
            />

          </div>

        </section>

        {/* =================================================
            INPUT
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                Dữ liệu đầu vào
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Thông số PK/PD
              </h2>

            </div>

            <button
              type="button"
              onClick={
                resetInputs
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Xóa dữ liệu
            </button>

          </div>

          {/* ===============================================
              BETA-LACTAM INPUT
          ================================================ */}

          {mode ===
            "beta-lactam" && (

            <div className="mt-6">

              <NumberField
                label="% fT > MIC"
                value={
                  ftMic
                }
                onChange={
                  setFtMic
                }
                placeholder="Ví dụ: 80"
                suffix="%"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Nhập giá trị đã được xác định từ PK/TDM hoặc mô hình PK.
                Giá trị hợp lệ từ 0–100%.
              </p>

            </div>

          )}

          {/* ===============================================
              VANCOMYCIN INPUT
          ================================================ */}

          {mode ===
            "vancomycin" && (

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <NumberField
                label="MIC (mg/L)"
                value={
                  mic
                }
                onChange={
                  setMic
                }
                placeholder="Ví dụ: 1"
                suffix="mg/L"
              />

              <NumberField
                label="AUC24 (mg·h/L)"
                value={
                  auc24
                }
                onChange={
                  setAuc24
                }
                placeholder="Ví dụ: 500"
                suffix="mg·h/L"
              />

            </div>

          )}

          {/* ===============================================
              AMINOGLYCOSIDE INPUT
          ================================================ */}

          {mode ===
            "aminoglycoside" && (

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <NumberField
                label="MIC (mg/L)"
                value={
                  mic
                }
                onChange={
                  setMic
                }
                placeholder="Ví dụ: 2"
                suffix="mg/L"
              />

              <NumberField
                label="Cmax (mg/L)"
                value={
                  cmax
                }
                onChange={
                  setCmax
                }
                placeholder="Nhập nồng độ đỉnh"
                suffix="mg/L"
              />

            </div>

          )}

        </section>

        {/* =================================================
            RESULT
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Kết quả
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Phân tích PK/PD
          </h2>

          {!result ? (

            <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-10 text-center">

              <p className="font-semibold text-slate-700">
                Chưa đủ dữ liệu để tính.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Nhập đầy đủ thông số tương ứng ở phía trên.
              </p>

            </div>

          ) : (

            <div className="mt-5">

              <div className="grid gap-4 md:grid-cols-3">

                <ResultCard
                  label="Chỉ số"
                  value={
                    result.index
                  }
                />

                <ResultCard
                  label="Kết quả"
                  value={
                    result.unit ===
                    "%"
                      ? `${result.value.toFixed(
                          1
                        )}%`
                      : result.value.toFixed(
                          1
                        )
                  }
                />

                <ResultCard
                  label="Đánh giá"
                  value={
                    result.title
                  }
                />

              </div>

              <StatusBox
                status={
                  result.status
                }
                title={
                  result.title
                }
                text={
                  result.interpretation
                }
              />

              {result.warning && (

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">

                  <p className="text-sm font-bold text-amber-950">
                    Lưu ý
                  </p>

                  <p className="mt-1 text-sm leading-6 text-amber-900">
                    {
                      result.warning
                    }
                  </p>

                </div>

              )}

            </div>

          )}

        </section>

        {/* =================================================
            EXPLANATION
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Nội hàm
          </p>

          <h2 className="mt-1 text-lg font-bold text-blue-950">
            PK/PD đang đánh giá điều gì?
          </h2>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">

            <ExplanationCard
              title="β-lactam"
              index="fT > MIC"
              text="Đánh giá tỷ lệ thời gian trong khoảng liều mà nồng độ thuốc tự do cao hơn MIC."
            />

            <ExplanationCard
              title="Vancomycin"
              index="AUC24 / MIC"
              text="Đánh giá tổng mức phơi nhiễm vancomycin trong 24 giờ so với độ nhạy của vi khuẩn."
            />

            <ExplanationCard
              title="Aminoglycoside"
              index="Cmax / MIC"
              text="Đánh giá mức nồng độ đỉnh của thuốc so với MIC của tác nhân gây bệnh."
            />

          </div>

        </section>

        {/* =================================================
            CLSI
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">

          <p className="font-bold text-rose-950">
            PK/PD ≠ CLSI breakpoint
          </p>

          <p className="mt-2 text-sm leading-6 text-rose-900">
            MIC là cầu nối giữa vi sinh và PK/PD.
            CLSI sử dụng MIC hoặc đường kính vòng vô khuẩn
            cùng breakpoint để biện giải S / I / R.
            PK/PD sử dụng MIC kết hợp với mức phơi nhiễm
            của người bệnh để đánh giá khả năng đạt mục tiêu điều trị.
          </p>

          <Link
            href="/antibiotics/antibiogram"
            className="mt-3 inline-flex rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100"
          >
            Xem Antibiogram BV199 →
          </Link>

        </section>

      </div>

    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function ModeCard({
  active,
  title,
  subtitle,
  description,
  onClick,
}: {
  active: boolean;

  title: string;

  subtitle: string;

  description: string;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={
        active
          ? "rounded-2xl border border-teal-400 bg-teal-50 p-5 text-left shadow-sm"
          : "rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-teal-200"
      }
    >

      <p className="text-lg font-bold text-slate-900">
        {
          title
        }
      </p>

      <p className="mt-1 font-semibold text-teal-700">
        {
          subtitle
        }
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {
          description
        }
      </p>

    </button>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  suffix,
}: {
  label: string;

  value: string;

  onChange:
    (
      value: string
    ) => void;

  placeholder: string;

  suffix?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {
          label
        }
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          step="any"
          value={
            value
          }
          onChange={
            (
              event
            ) =>
              onChange(
                event.target.value
              )
          }
          placeholder={
            placeholder
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-24 outline-none focus:border-teal-400"
        />

        {suffix && (

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            {
              suffix
            }
          </span>

        )}

      </div>

    </div>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {
          label
        }
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {
          value
        }
      </p>

    </div>
  );
}

function StatusBox({
  status,
  title,
  text,
}: {
  status: string;

  title: string;

  text: string;
}) {
  let style =
    "border-blue-200 bg-blue-50 text-blue-900";

  if (
    status ===
    "target"
  ) {
    style =
      "border-emerald-200 bg-emerald-50 text-emerald-900";
  }

  if (
    status ===
    "below"
  ) {
    style =
      "border-amber-200 bg-amber-50 text-amber-900";
  }

  if (
    status ===
    "above"
  ) {
    style =
      "border-rose-200 bg-rose-50 text-rose-900";
  }

  return (
    <div
      className={`mt-4 rounded-xl border p-5 ${style}`}
    >

      <p className="font-bold">
        {
          title
        }
      </p>

      <p className="mt-2 text-sm leading-6">
        {
          text
        }
      </p>

    </div>
  );
}

function ExplanationCard({
  title,
  index,
  text,
}: {
  title: string;

  index: string;

  text: string;
}) {
  return (
    <div className="rounded-xl border border-blue-200 bg-white p-4">

      <p className="font-bold text-slate-900">
        {
          title
        }
      </p>

      <p className="mt-1 text-lg font-bold text-blue-700">
        {
          index
        }
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-600">
        {
          text
        }
      </p>

    </div>
  );
}