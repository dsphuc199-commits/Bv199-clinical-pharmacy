"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  ivToPoData,
  type IVPOConversion,
} from "@/data/antibiotics/iv-to-po";

export default function IVToPOPage() {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedId,
    setSelectedId,
  ] = useState("");

  const [
    checkedRequired,
    setCheckedRequired,
  ] = useState<string[]>(
    []
  );

  const [
    checkedExclusions,
    setCheckedExclusions,
  ] = useState<string[]>(
    []
  );

  const normalizeText = (
    value: string
  ) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(/đ/g, "d")
      .trim();

  const searchResults =
    useMemo(() => {
      const q =
        normalizeText(
          search
        );

      if (!q) {
        return [];
      }

      return ivToPoData.filter(
        (item) => {
          const text =
            normalizeText(
              [
                item.ingredientName,
                item.ivDrug,
                item.poDrug,
              ].join(" ")
            );

          return text.includes(
            q
          );
        }
      );
    }, [search]);

  const selectedItem:
    IVPOConversion |
    undefined =
    useMemo(
      () =>
        ivToPoData.find(
          (item) =>
            item.id ===
            selectedId
        ),
      [selectedId]
    );

  const requiredComplete =
    useMemo(() => {
      if (!selectedItem) {
        return false;
      }

      return selectedItem.requiredCriteria.every(
        (criterion) =>
          checkedRequired.includes(
            criterion
          )
      );
    }, [
      selectedItem,
      checkedRequired,
    ]);

  const hasExclusion =
    checkedExclusions.length >
    0;

  const eligible =
    requiredComplete &&
    !hasExclusion;

  function toggleRequired(
    criterion: string
  ) {
    setCheckedRequired(
      (current) =>
        current.includes(
          criterion
        )
          ? current.filter(
              (item) =>
                item !==
                criterion
            )
          : [
              ...current,
              criterion,
            ]
    );
  }

  function toggleExclusion(
    criterion: string
  ) {
    setCheckedExclusions(
      (current) =>
        current.includes(
          criterion
        )
          ? current.filter(
              (item) =>
                item !==
                criterion
            )
          : [
              ...current,
              criterion,
            ]
    );
  }

  function selectDrug(
    item: IVPOConversion
  ) {
    setSelectedId(
      item.id
    );

    setSearch(
      item.ingredientName
    );

    setCheckedRequired(
      []
    );

    setCheckedExclusions(
      []
    );
  }

  function clearAll() {
    setSearch("");

    setSelectedId("");

    setCheckedRequired(
      []
    );

    setCheckedExclusions(
      []
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="mb-8">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Kháng sinh & AMS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Chuyển kháng sinh IV → PO
          </h1>

          <p className="mt-3 max-w-4xl leading-7 text-slate-600">
            Hỗ trợ đánh giá khả năng
            chuyển kháng sinh từ đường
            tĩnh mạch sang đường uống
            dựa trên đặc tính thuốc và
            tiêu chí lâm sàng.
          </p>

        </header>

        {/* SEARCH */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between gap-4">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                01. Chọn kháng sinh
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tìm theo hoạt chất hoặc
                tên thuốc IV/PO.
              </p>

            </div>

            <button
              type="button"
              onClick={
                clearAll
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Xóa dữ liệu
            </button>

          </div>

          <div className="relative mt-5">

            <input
              type="text"
              value={
                search
              }
              onChange={
                (
                  event
                ) => {
                  setSearch(
                    event
                      .target
                      .value
                  );

                  setSelectedId(
                    ""
                  );

                  setCheckedRequired(
                    []
                  );

                  setCheckedExclusions(
                    []
                  );
                }
              }
              placeholder="Ví dụ: levofloxacin, ciprofloxacin, linezolid..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500"
            />

            {search &&
              !selectedId &&
              searchResults.length >
                0 && (

              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                {searchResults.map(
                  (item) => (

                    <button
                      key={
                        item.id
                      }
                      type="button"
                      onClick={
                        () =>
                          selectDrug(
                            item
                          )
                      }
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
                    >

                      <p className="font-semibold text-slate-900">
                        {
                          item.ingredientName
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          item.ivDrug
                        }
                        {" → "}
                        {
                          item.poDrug
                        }
                      </p>

                    </button>

                  )
                )}

              </div>

            )}

          </div>

        </section>

        {/* SELECTED DRUG */}

        {selectedItem && (

          <>
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                02. Thông tin chuyển IV → PO
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                <DrugBox
                  label="Thuốc IV"
                  value={
                    selectedItem.ivDrug
                  }
                />

                <DrugBox
                  label="Thuốc PO"
                  value={
                    selectedItem.poDrug
                  }
                />

              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <InfoCard
                  label="Sinh khả dụng đường uống"
                  value={
                    selectedItem.oralBioavailability ??
                    "--"
                  }
                />

                <InfoCard
                  label="Tỷ lệ chuyển"
                  value={
                    selectedItem.conversionRatio ??
                    "--"
                  }
                />

                <InfoCard
                  label="Ví dụ liều IV"
                  value={
                    selectedItem.ivDoseExample ??
                    "--"
                  }
                />

                <InfoCard
                  label="Ví dụ liều PO"
                  value={
                    selectedItem.poDoseExample ??
                    "--"
                  }
                />

              </div>

            </section>

            {/* CRITERIA */}

            <section className="mt-6 grid gap-6 lg:grid-cols-2">

              {/* REQUIRED */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                  03
                </p>

                <h2 className="mt-2 text-lg font-bold text-slate-900">
                  Tiêu chí cần đạt
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Đánh dấu khi người bệnh
                  đáp ứng tiêu chí.
                </p>

                <div className="mt-5 space-y-3">

                  {selectedItem.requiredCriteria.map(
                    (
                      criterion,
                      index
                    ) => {

                      const checked =
                        checkedRequired.includes(
                          criterion
                        );

                      return (
                        <label
                          key={
                            criterion
                          }
                          className={
                            checked
                              ? "flex cursor-pointer gap-3 rounded-xl border border-teal-300 bg-teal-50 p-4"
                              : "flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                          }
                        >

                          <input
                            type="checkbox"
                            checked={
                              checked
                            }
                            onChange={
                              () =>
                                toggleRequired(
                                  criterion
                                )
                            }
                            className="mt-1 h-4 w-4"
                          />

                          <div>

                            <p className="text-xs font-semibold text-slate-400">
                              Tiêu chí{" "}
                              {
                                index +
                                1
                              }
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-700">
                              {
                                criterion
                              }
                            </p>

                          </div>

                        </label>
                      );
                    }
                  )}

                </div>

              </div>

              {/* EXCLUSIONS */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
                  04
                </p>

                <h2 className="mt-2 text-lg font-bold text-slate-900">
                  Chống chỉ định / loại trừ
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Đánh dấu nếu người bệnh
                  có yếu tố loại trừ.
                </p>

                <div className="mt-5 space-y-3">

                  {selectedItem.exclusionCriteria.map(
                    (
                      criterion,
                      index
                    ) => {

                      const checked =
                        checkedExclusions.includes(
                          criterion
                        );

                      return (
                        <label
                          key={
                            criterion
                          }
                          className={
                            checked
                              ? "flex cursor-pointer gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4"
                              : "flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                          }
                        >

                          <input
                            type="checkbox"
                            checked={
                              checked
                            }
                            onChange={
                              () =>
                                toggleExclusion(
                                  criterion
                                )
                            }
                            className="mt-1 h-4 w-4"
                          />

                          <div>

                            <p className="text-xs font-semibold text-slate-400">
                              Yếu tố{" "}
                              {
                                index +
                                1
                              }
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-700">
                              {
                                criterion
                              }
                            </p>

                          </div>

                        </label>
                      );
                    }
                  )}

                </div>

              </div>

            </section>

            {/* RESULT */}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                05. Kết luận
              </p>

              {!requiredComplete ? (

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">

                  <p className="font-bold text-amber-950">
                    Chưa đủ tiêu chí chuyển IV → PO
                  </p>

                  <p className="mt-2 text-sm leading-6 text-amber-900">
                    Cần xác nhận đầy đủ các
                    tiêu chí lâm sàng trước
                    khi cân nhắc chuyển đường dùng.
                  </p>

                </div>

              ) : hasExclusion ? (

                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-5">

                  <p className="font-bold text-rose-950">
                    Chưa nên chuyển IV → PO
                  </p>

                  <p className="mt-2 text-sm leading-6 text-rose-900">
                    Người bệnh có ít nhất
                    một yếu tố loại trừ.
                    Cần đánh giá lại trước
                    khi chuyển đường uống.
                  </p>

                </div>

              ) : eligible ? (

                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                  <p className="font-bold text-emerald-950">
                    Có thể cân nhắc chuyển IV → PO
                  </p>

                  <p className="mt-2 text-sm leading-6 text-emerald-900">
                    Người bệnh đáp ứng toàn bộ
                    tiêu chí cần thiết và hiện
                    không có yếu tố loại trừ
                    đã được đánh dấu.
                  </p>

                  <div className="mt-4 rounded-xl bg-white/70 p-4">

                    <p className="text-xs font-semibold uppercase text-emerald-700">
                      Gợi ý chuyển
                    </p>

                    <p className="mt-2 text-lg font-bold text-emerald-950">
                      {
                        selectedItem.ivDrug
                      }
                      {" → "}
                      {
                        selectedItem.poDrug
                      }
                    </p>

                    {selectedItem.conversionRatio && (

                      <p className="mt-2 text-sm text-emerald-800">
                        Tỷ lệ / nguyên tắc:
                        {" "}
                        <strong>
                          {
                            selectedItem.conversionRatio
                          }
                        </strong>
                      </p>

                    )}

                  </div>

                </div>

              ) : null}

            </section>

            {/* NOTES */}

            {selectedItem.notes &&
              selectedItem.notes.length >
                0 && (

              <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

                <h2 className="font-bold text-amber-950">
                  Lưu ý
                </h2>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">

                  {selectedItem.notes.map(
                    (
                      note
                    ) => (

                      <li
                        key={
                          note
                        }
                      >
                        • {note}
                      </li>

                    )
                  )}

                </ul>

              </section>

            )}

            {/* SOURCE */}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Nguồn tài liệu
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {
                  selectedItem.source.organization
                }
                {" – "}
                {
                  selectedItem.source.title
                }
                {" ("}
                {
                  selectedItem.source.year
                }
                {")"}
              </p>

              {selectedItem.source.url && (

                <a
                  href={
                    selectedItem.source.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline"
                >
                  Mở tài liệu nguồn →
                </a>

              )}

            </section>

          </>

        )}

        {/* EMPTY */}

        {!selectedItem && (

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

            <p className="font-semibold text-slate-700">
              Chưa chọn kháng sinh
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Nhập tên hoạt chất để
              bắt đầu đánh giá IV → PO.
            </p>

          </div>

        )}

      </div>

    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function DrugBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-6 text-slate-900">
        {value}
      </p>

    </div>
  );
}