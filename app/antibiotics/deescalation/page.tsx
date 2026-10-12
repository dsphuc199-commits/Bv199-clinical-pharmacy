"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  deescalationAntibiotics,
  deescalationOrganisms,
  deescalationRules,
  type Susceptibility,
} from "@/data/antibiotics/deescalation";

/* =========================================================
   TYPES
========================================================= */

type ASTResult = {
  antibioticId: string;

  result: Susceptibility;
};

type Severity =
  | "stable"
  | "severe"
  | "shock";

type SourceControl =
  | "controlled"
  | "not-controlled"
  | "unknown";

/* =========================================================
   PAGE
========================================================= */

export default function DeescalationPage() {
  /* CURRENT THERAPY */

  const [
    currentTherapy,
    setCurrentTherapy,
  ] = useState("");

  /* ORGANISM */

  const [
    organismId,
    setOrganismId,
  ] = useState("");

  /* INFECTION */

  const [
    infectionSite,
    setInfectionSite,
  ] = useState("");

  /* PATIENT STATUS */

  const [
    severity,
    setSeverity,
  ] =
    useState<Severity>(
      "stable"
    );

  const [
    sourceControl,
    setSourceControl,
  ] =
    useState<SourceControl>(
      "controlled"
    );

  const [
    polymicrobial,
    setPolymicrobial,
  ] = useState(false);

  const [
    severeBetaLactamAllergy,
    setSevereBetaLactamAllergy,
  ] = useState(false);

  /* AST */

  const [
    astResults,
    setAstResults,
  ] = useState<
    ASTResult[]
  >([]);

  /* =======================================================
     CURRENT ANTIBIOTIC
  ======================================================= */

  const selectedCurrentAntibiotic =
    useMemo(
      () =>
        deescalationAntibiotics.find(
          (item) =>
            item.id ===
            currentTherapy
        ),
      [
        currentTherapy,
      ]
    );

  /* =======================================================
     ORGANISM RULE
  ======================================================= */

  const activeRule =
    useMemo(
      () =>
        deescalationRules.find(
          (rule) =>
            rule.organismId ===
            organismId
        ),
      [
        organismId,
      ]
    );

  /* =======================================================
     AST
  ======================================================= */

  function getAST(
    antibioticId: string
  ) {
    return (
      astResults.find(
        (item) =>
          item.antibioticId ===
          antibioticId
      )?.result ??
      "NA"
    );
  }

  function setAST(
    antibioticId: string,
    result: Susceptibility
  ) {
    setAstResults(
      (current) => {
        const exists =
          current.some(
            (item) =>
              item.antibioticId ===
              antibioticId
          );

        if (exists) {
          return current.map(
            (item) =>
              item.antibioticId ===
              antibioticId
                ? {
                    ...item,
                    result,
                  }
                : item
          );
        }

        return [
          ...current,
          {
            antibioticId,
            result,
          },
        ];
      }
    );
  }

  /* =======================================================
     CANDIDATES

     Chỉ xem S là ứng viên tự động.
     I cần đánh giá theo breakpoint/exposure.
  ======================================================= */

  const susceptibleCandidates =
    useMemo(
      () => {
        if (
          !activeRule
        ) {
          return [];
        }

        return activeRule.preferredOptions
          .filter(
            (option) =>
              getAST(
                option.id
              ) === "S"
          )
          .filter(
            (option) => {
              if (
                !selectedCurrentAntibiotic
              ) {
                return true;
              }

              return (
                option.spectrumRank <
                selectedCurrentAntibiotic.spectrumRank
              );
            }
          )
          .sort(
            (
              a,
              b
            ) =>
              a.spectrumRank -
              b.spectrumRank
          );
      },
      [
        activeRule,
        astResults,
        selectedCurrentAntibiotic,
      ]
    );

  /* =======================================================
     BLOCKERS
  ======================================================= */

  const blockers =
    useMemo(
      () => {
        const result:
          string[] = [];

        if (
          severity ===
          "shock"
        ) {
          result.push(
            "Người bệnh đang sốc hoặc huyết động chưa ổn định."
          );
        }

        if (
          sourceControl ===
          "not-controlled"
        ) {
          result.push(
            "Ổ nhiễm chưa được kiểm soát."
          );
        }

        if (
          sourceControl ===
          "unknown"
        ) {
          result.push(
            "Chưa xác định tình trạng kiểm soát ổ nhiễm."
          );
        }

        if (
          polymicrobial
        ) {
          result.push(
            "Nghi ngờ hoặc xác định nhiễm đa vi khuẩn."
          );
        }

        if (
          severeBetaLactamAllergy
        ) {
          result.push(
            "Có tiền sử dị ứng beta-lactam nghiêm trọng; cần đánh giá lựa chọn thuốc riêng."
          );
        }

        return result;
      },
      [
        severity,
        sourceControl,
        polymicrobial,
        severeBetaLactamAllergy,
      ]
    );

  const hasBlocker =
    blockers.length >
    0;

  /* =======================================================
     AST COMPLETENESS
  ======================================================= */

  const astEntered =
    useMemo(
      () =>
        astResults.some(
          (item) =>
            item.result !==
            "NA"
        ),
      [
        astResults,
      ]
    );

  /* =======================================================
     CURRENT DRUG SPECTRUM
  ======================================================= */

  const currentDrugIsBroadForRule =
    useMemo(
      () => {
        if (
          !activeRule ||
          !selectedCurrentAntibiotic
        ) {
          return false;
        }

        return activeRule.currentTherapyKeywords.some(
          (keyword) =>
            selectedCurrentAntibiotic.ingredientId.includes(
              keyword
            )
        );
      },
      [
        activeRule,
        selectedCurrentAntibiotic,
      ]
    );

  /* =======================================================
     FINAL STATUS
  ======================================================= */

  const status =
    useMemo(
      () => {
        if (
          !selectedCurrentAntibiotic ||
          !activeRule
        ) {
          return "incomplete";
        }

        if (
          !astEntered
        ) {
          return "waiting-ast";
        }

        if (
          hasBlocker
        ) {
          return "blocked";
        }

        if (
          susceptibleCandidates.length >
          0
        ) {
          return "candidate";
        }

        return "no-narrower-option";
      },
      [
        selectedCurrentAntibiotic,
        activeRule,
        astEntered,
        hasBlocker,
        susceptibleCandidates,
      ]
    );

  /* =======================================================
     RESET
  ======================================================= */

  function clearAll() {
    setCurrentTherapy("");

    setOrganismId("");

    setInfectionSite("");

    setSeverity(
      "stable"
    );

    setSourceControl(
      "controlled"
    );

    setPolymicrobial(
      false
    );

    setSevereBetaLactamAllergy(
      false
    );

    setAstResults(
      []
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="mb-8">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Kháng sinh & AMS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Đánh giá xuống thang kháng sinh
          </h1>

          <p className="mt-3 max-w-4xl leading-7 text-slate-600">
            Hỗ trợ đánh giá khả năng
            thu hẹp phổ kháng sinh
            sau khi có kết quả vi sinh
            và kháng sinh đồ.
          </p>

        </header>

        {/* =================================================
            STEP 1
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                01
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Kháng sinh hiện tại
              </h2>

            </div>

            <button
              type="button"
              onClick={
                clearAll
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Xóa dữ liệu
            </button>

          </div>

          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Kháng sinh đang sử dụng
            </label>

            <select
              value={
                currentTherapy
              }
              onChange={
                (
                  event
                ) =>
                  setCurrentTherapy(
                    event
                      .target
                      .value
                  )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >

              <option value="">
                Chọn kháng sinh
              </option>

              {deescalationAntibiotics.map(
                (
                  antibiotic
                ) => (

                  <option
                    key={
                      antibiotic.id
                    }
                    value={
                      antibiotic.id
                    }
                  >
                    {
                      antibiotic.label
                    }
                  </option>

                )
              )}

            </select>

          </div>

          {selectedCurrentAntibiotic && (

            <div className="mt-4 rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-semibold uppercase text-slate-400">
                Điều trị hiện tại
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {
                  selectedCurrentAntibiotic.label
                }
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Mức phổ tương đối:
                {" "}
                {
                  selectedCurrentAntibiotic.spectrumRank
                }
                /10
              </p>

            </div>

          )}

        </section>

        {/* =================================================
            STEP 2
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            02
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Vi sinh
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Vi khuẩn phân lập
              </label>

              <select
                value={
                  organismId
                }
                onChange={
                  (
                    event
                  ) => {
                    setOrganismId(
                      event
                        .target
                        .value
                    );

                    setAstResults(
                      []
                    );
                  }
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >

                <option value="">
                  Chọn vi khuẩn
                </option>

                {deescalationOrganisms.map(
                  (
                    organism
                  ) => (

                    <option
                      key={
                        organism.id
                      }
                      value={
                        organism.id
                      }
                    >
                      {
                        organism.name
                      }
                    </option>

                  )
                )}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ổ nhiễm khuẩn
              </label>

              <input
                type="text"
                value={
                  infectionSite
                }
                onChange={
                  (
                    event
                  ) =>
                    setInfectionSite(
                      event
                        .target
                        .value
                    )
                }
                placeholder="Ví dụ: tiết niệu, phổi, ổ bụng..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />

            </div>

          </div>

        </section>

        {/* =================================================
            STEP 3 AST
        ================================================= */}

        {activeRule && (

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              03
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Kháng sinh đồ
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Nhập kết quả S / I / R
              theo kháng sinh đồ thực tế.
            </p>

            <div className="mt-5 overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-slate-50">

                    <th className="border-b border-slate-200 p-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Kháng sinh
                    </th>

                    <th className="border-b border-slate-200 p-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Kết quả
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {activeRule.preferredOptions.map(
                    (
                      antibiotic
                    ) => (

                      <tr
                        key={
                          antibiotic.id
                        }
                      >

                        <td className="border-b border-slate-100 p-3">

                          <p className="font-semibold text-slate-900">
                            {
                              antibiotic.label
                            }
                          </p>

                          {antibiotic.route && (

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                antibiotic.route
                              }
                            </p>

                          )}

                        </td>

                        <td className="border-b border-slate-100 p-3">

                          <select
                            value={
                              getAST(
                                antibiotic.id
                              )
                            }
                            onChange={
                              (
                                event
                              ) =>
                                setAST(
                                  antibiotic.id,
                                  event
                                    .target
                                    .value as
                                    Susceptibility
                                )
                            }
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2"
                          >

                            <option value="NA">
                              Chưa nhập
                            </option>

                            <option value="S">
                              S – Nhạy
                            </option>

                            <option value="I">
                              I – Nhạy khi tăng phơi nhiễm
                            </option>

                            <option value="R">
                              R – Kháng
                            </option>

                          </select>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

            <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
              Với EUCAST, ký hiệu
              <strong> I </strong>
              được hiểu là
              “nhạy khi tăng phơi nhiễm”;
              module không tự động coi
              I giống S.
            </div>

          </section>

        )}

        {/* =================================================
            STEP 4 CLINICAL
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            04
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Điều kiện lâm sàng
          </h2>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mức độ hiện tại
              </label>

              <select
                value={
                  severity
                }
                onChange={
                  (
                    event
                  ) =>
                    setSeverity(
                      event
                        .target
                        .value as
                        Severity
                    )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >

                <option value="stable">
                  Ổn định
                </option>

                <option value="severe">
                  Nặng nhưng huyết động ổn
                </option>

                <option value="shock">
                  Sốc / huyết động chưa ổn
                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Kiểm soát ổ nhiễm
              </label>

              <select
                value={
                  sourceControl
                }
                onChange={
                  (
                    event
                  ) =>
                    setSourceControl(
                      event
                        .target
                        .value as
                        SourceControl
                    )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >

                <option value="controlled">
                  Đã kiểm soát
                </option>

                <option value="not-controlled">
                  Chưa kiểm soát
                </option>

                <option value="unknown">
                  Chưa xác định
                </option>

              </select>

            </div>

          </div>

          <div className="mt-5 space-y-3">

            <CheckRow
              checked={
                polymicrobial
              }
              onChange={
                setPolymicrobial
              }
              label="Nghi ngờ hoặc xác định nhiễm đa vi khuẩn"
            />

            <CheckRow
              checked={
                severeBetaLactamAllergy
              }
              onChange={
                setSevereBetaLactamAllergy
              }
              label="Tiền sử dị ứng beta-lactam nghiêm trọng"
            />

          </div>

        </section>

        {/* =================================================
            STEP 5 RESULT
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            05. Đánh giá
          </p>

          {status ===
            "incomplete" && (

            <MessageBox
              type="neutral"
              title="Chưa đủ thông tin"
              text="Chọn kháng sinh đang sử dụng và vi khuẩn phân lập để bắt đầu đánh giá."
            />

          )}

          {status ===
            "waiting-ast" && (

            <MessageBox
              type="warning"
              title="Chưa có kháng sinh đồ"
              text="Nhập ít nhất một kết quả S/I/R trước khi đánh giá xuống thang."
            />

          )}

          {status ===
            "blocked" && (

            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-5">

              <h3 className="font-bold text-rose-950">
                Chưa nên tự động xuống thang
              </h3>

              <p className="mt-2 text-sm leading-6 text-rose-900">
                Có yếu tố cần đánh giá
                thêm trước khi thu hẹp phổ:
              </p>

              <ul className="mt-3 space-y-2 text-sm text-rose-900">

                {blockers.map(
                  (
                    blocker
                  ) => (

                    <li
                      key={
                        blocker
                      }
                    >
                      • {blocker}
                    </li>

                  )
                )}

              </ul>

            </div>

          )}

          {status ===
            "candidate" && (

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

              <h3 className="text-lg font-bold text-emerald-950">
                Có thể cân nhắc xuống thang
              </h3>

              <p className="mt-2 text-sm leading-6 text-emerald-900">
                Kháng sinh đồ có lựa chọn
                hẹp phổ hơn và hiện chưa
                ghi nhận yếu tố cản trở
                trong các mục đã nhập.
              </p>

              <div className="mt-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Lựa chọn hẹp phổ hơn
                </p>

                <div className="mt-3 grid gap-3 md:grid-cols-2">

                  {susceptibleCandidates.map(
                    (
                      candidate
                    ) => (

                      <div
                        key={
                          candidate.id
                        }
                        className="rounded-xl border border-emerald-200 bg-white p-4"
                      >

                        <p className="font-bold text-slate-900">
                          {
                            candidate.label
                          }
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          AST:
                          {" "}
                          <strong className="text-emerald-700">
                            S
                          </strong>
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Đường dùng:
                          {" "}
                          {
                            candidate.route ??
                            "--"
                          }
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Mức phổ tương đối:
                          {" "}
                          {
                            candidate.spectrumRank
                          }
                          /10
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )}

          {status ===
            "no-narrower-option" && (

            <MessageBox
              type="warning"
              title="Chưa xác định được lựa chọn hẹp phổ phù hợp"
              text="Kiểm tra lại kháng sinh đồ, cơ chế đề kháng, vị trí nhiễm và bệnh cảnh lâm sàng. Không tự động đổi thuốc nếu dữ liệu chưa đủ."
            />

          )}

          {selectedCurrentAntibiotic &&
            activeRule && (

            <div className="mt-5 rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Đánh giá phổ
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                Điều trị hiện tại:
                {" "}
                <strong>
                  {
                    selectedCurrentAntibiotic.label
                  }
                </strong>

                {" • "}

                Vi khuẩn:
                {" "}
                <strong>
                  {
                    activeRule.organismName
                  }
                </strong>
              </p>

              {!currentDrugIsBroadForRule && (

                <p className="mt-2 text-sm text-amber-700">
                  Thuốc hiện tại không nằm
                  trong nhóm điều trị phổ rộng
                  được định nghĩa cho rule này;
                  cần đánh giá riêng.
                </p>

              )}

            </div>

          )}

        </section>

        {/* =================================================
            RETAIN COVERAGE
        ================================================= */}

        {activeRule &&
          activeRule.retainBroadCoverageWhen &&
          activeRule.retainBroadCoverageWhen.length >
            0 && (

          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

            <h2 className="font-bold text-amber-950">
              Khi nào cần thận trọng trước khi thu hẹp phổ?
            </h2>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">

              {activeRule.retainBroadCoverageWhen.map(
                (
                  item
                ) => (

                  <li
                    key={
                      item
                    }
                  >
                    • {item}
                  </li>

                )
              )}

            </ul>

          </section>

        )}

        {/* =================================================
            SOURCE
        ================================================= */}

        {activeRule && (

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Nguồn / quy tắc
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              {
                activeRule.source
                  .organization
              }
              {" – "}
              {
                activeRule.source
                  .title
              }
              {" ("}
              {
                activeRule.source
                  .year
              }
              {")"}
            </p>

            {activeRule.source
              .url && (

              <a
                href={
                  activeRule.source
                    .url
                }
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                Mở tài liệu nguồn →
              </a>

            )}

          </section>

        )}

        {/* =================================================
            SAFETY NOTE
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">

          <h2 className="font-bold text-blue-950">
            Nguyên tắc sử dụng
          </h2>

          <div className="mt-3 space-y-2 text-sm leading-6 text-blue-900">

            <p>
              • De-escalation không đồng nghĩa
              với chọn thuốc có phổ hẹp nhất
              bằng mọi giá.
            </p>

            <p>
              • Lựa chọn cuối cùng phải xem xét
              vị trí nhiễm, liều, khả năng thấm
              mô, dị ứng, chức năng cơ quan,
              kiểm soát ổ nhiễm và tình trạng
              lâm sàng.
            </p>

            <p>
              • Kháng sinh đồ là một thành phần
              hỗ trợ quyết định, không thay thế
              đánh giá lâm sàng.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;

  onChange:
    (
      value: boolean
    ) => void;

  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">

      <input
        type="checkbox"
        checked={
          checked
        }
        onChange={
          (
            event
          ) =>
            onChange(
              event
                .target
                .checked
            )
        }
        className="mt-1 h-4 w-4"
      />

      <span className="text-sm leading-6 text-slate-700">
        {label}
      </span>

    </label>
  );
}

function MessageBox({
  type,
  title,
  text,
}: {
  type:
    | "neutral"
    | "warning";

  title: string;

  text: string;
}) {
  const style =
    type === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`mt-4 rounded-2xl border p-5 ${style}`}>

      <p className="font-bold">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6">
        {text}
      </p>

    </div>
  );
}