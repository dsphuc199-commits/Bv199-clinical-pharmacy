"use client";

import { PKPD_HREF, SHOW_PKPD } from "@/lib/feature-flags";
import Link from "next/link";
import { useMemo, useState } from "react";


import rawData from "@/data/antibiotics/antibiogram-bv199.json";

import {
  reportRows,
  gramNegativePanel,
  gramPositivePanel,
  type ReportCell,
} from "@/data/antibiotics/antibiogram-report";

import {
  clsiConfig,
} from "@/data/microbiology/clsi-config";

/* =========================================================
   TYPES
========================================================= */

type RawRecord = {
  id: string;
  department: string;
  specimen: string;
  organismId: string;
  organismName: string;
  antibioticId: string;
  antibioticName: string;
  n: number;
  sCount: number;
  iCount: number;
  rCount: number;
  susceptiblePercent: number;
  increasedExposurePercent: number;
  resistantPercent: number;
  lowN: boolean;
  organismGroup: string;
  intrinsicResistance?: boolean;
  noBreakpoint?: boolean;
  clsiNote?: string;
};

type RawDatabase = {
  metadata: {
    hospital: string;
    source: string;
    period: {
      id: string;
      label: string;
    };
    isolateCount: number;
    rawIsolateCount: number;
    method: string;
    breakpointNote?: string;
    status: string;
    departmentNote: string;
    intrinsicNote: string;
    departments: string[];
    specimens: string[];
    organisms: {
      id: string;
      name: string;
    }[];
    privacy: string;
  };
  records: RawRecord[];
};

const database = rawData as RawDatabase;

export function RawSource({
  initialAntibioticId = "",
  initialOrganismId = "",
}: {
  initialAntibioticId?: string;
  initialOrganismId?: string;
}) {
  const metadata = database.metadata;
  const records = database.records;

  /* Danh sach khang sinh co trong du lieu goc (de loc va kiem tra tham so URL). */
  const antibioticOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of records) {
      map.set(item.antibioticId, item.antibioticName);
    }
    return Array.from(map, ([value, label]) => ({ value, label })).sort(
      (a, b) => a.label.localeCompare(b.label, "vi")
    );
  }, [records]);

  const [organismId, setOrganismId] =
    useState(() =>
      metadata.organisms.some(
        (item) => item.id === initialOrganismId
      )
        ? initialOrganismId
        : ""
    );

  const [antibioticId, setAntibioticId] =
    useState(() =>
      antibioticOptions.some(
        (item) => item.value === initialAntibioticId
      )
        ? initialAntibioticId
        : ""
    );

  const [department, setDepartment] =
    useState("Toàn viện");

  const [specimen, setSpecimen] =
    useState("Tất cả");

  const [minimumN, setMinimumN] =
    useState("0");

  const [search, setSearch] =
    useState("");

  const filtered = useMemo(
    () => {
      const q =
        search.trim().toLowerCase();

      const minN =
        Number(minimumN);

      return records.filter((item) => {
        if (
          item.department !==
          department
        ) {
          return false;
        }

        if (
          item.specimen !==
          specimen
        ) {
          return false;
        }

        if (
          organismId &&
          item.organismId !==
            organismId
        ) {
          return false;
        }

        if (
          antibioticId &&
          item.antibioticId !==
            antibioticId
        ) {
          return false;
        }

        if (
          minN > 0 &&
          item.n < minN
        ) {
          return false;
        }

        if (q) {
          const text = [
            item.organismName,
            item.antibioticName,
          ]
            .join(" ")
            .toLowerCase();

          if (
            !text.includes(q)
          ) {
            return false;
          }
        }

        return true;
      });
    },
    [
      records,
      organismId,
      antibioticId,
      department,
      specimen,
      minimumN,
      search,
    ]
  );

  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => {
          const organism =
            a.organismName.localeCompare(
              b.organismName,
              "vi"
            );

          if (
            organism !== 0
          ) {
            return organism;
          }

          /* Khang tu nhien xep cuoi, khong de %S tu vai ket qua le day len dau. */
          const rank = (x: RawRecord) =>
            x.intrinsicResistance || x.noBreakpoint ? -1 : x.susceptiblePercent;

          return rank(b) - rank(a);
        }
      ),
    [filtered]
  );

  const summary = useMemo(
    () => {
      const lowNCount =
        sorted.filter(
          (item) =>
            item.lowN
        ).length;

      return {
        totalRows:
          sorted.length,

        lowNCount,
      };
    },
    [sorted]
  );

  function clearFilters() {
    setOrganismId("");
    setAntibioticId("");
    setDepartment("Toàn viện");
    setSpecimen("Tất cả");
    setMinimumN("0");
    setSearch("");
  }

  return (
    <div className="mt-6">

      {/* SOURCE INFO */}

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-bold text-emerald-950">
          Nguồn 1 – Dữ liệu vi sinh gốc BV199
        </p>

        <p className="mt-2 text-sm leading-6 text-emerald-900">
          {metadata.source}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>
            {metadata.isolateCount}
            {" "}
            phân lập đầu tiên
          </Badge>

          <Badge>
            {metadata.organisms.length}
            {" "}
            loại vi khuẩn
          </Badge>

          <Badge>
            {metadata.departments.length}
            {" "}
            phạm vi
          </Badge>

          <Badge>
            {metadata.period.label}
          </Badge>
        </div>

        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-emerald-900">
          <li>
            {metadata.method}
            {" "}
            Tổng {metadata.rawIsolateCount} phân lập, còn {metadata.isolateCount} phân lập đầu tiên.
          </li>
          <li>{metadata.departmentNote}</li>
          {metadata.breakpointNote && <li>{metadata.breakpointNote}</li>}
          <li>{metadata.intrinsicNote}</li>
          <li>{metadata.privacy}</li>
        </ul>

        <p className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
          {metadata.status}
        </p>
      </section>

      {/* FILTER */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              Bộ lọc
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Tra cứu chi tiết theo loài vi khuẩn và bệnh phẩm
            </h2>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Xóa bộ lọc
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">

          <SelectBox
            label="Vi khuẩn"
            value={organismId}
            onChange={setOrganismId}
            options={[
              {
                value: "",
                label: "Tất cả",
              },
              ...metadata.organisms.map(
                (organism) => ({
                  value: organism.id,
                  label: organism.name,
                })
              ),
            ]}
          />

          <SelectBox
            label="Phạm vi"
            value={department}
            onChange={setDepartment}
            options={[
              {
                value:
                  "Toàn viện",
                label:
                  "Toàn viện",
              },
              ...metadata.departments
                .filter(
                  (item) =>
                    item !==
                    "Toàn viện"
                )
                .map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                ),
            ]}
          />

          <SelectBox
            label="Bệnh phẩm"
            value={specimen}
            onChange={setSpecimen}
            options={[
              {
                value:
                  "Tất cả",
                label:
                  "Tất cả",
              },
              ...metadata.specimens
                .filter(
                  (item) =>
                    item !==
                    "Tất cả"
                )
                .map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                ),
            ]}
          />

          <SelectBox
            label="Kháng sinh"
            value={antibioticId}
            onChange={setAntibioticId}
            options={[
              { value: "", label: "Tất cả" },
              ...antibioticOptions,
            ]}
          />

          <SelectBox
            label="n tối thiểu"
            value={minimumN}
            onChange={setMinimumN}
            options={[
              {
                value: "0",
                label:
                  "Không giới hạn",
              },
              {
                value: "10",
                label: "≥ 10",
              },
              {
                value: "20",
                label: "≥ 20",
              },
              {
                value: "30",
                label: "≥ 30",
              },
            ]}
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tìm kháng sinh
            </label>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Ví dụ: meropenem"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-400"
            />
          </div>

        </div>
      </section>

      {/* SUMMARY */}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          label="Vi khuẩn"
          value={
            organismId
              ? metadata.organisms.find(
                  (item) =>
                    item.id ===
                    organismId
                )?.name ??
                "Đã chọn"
              : "Tất cả"
          }
        />

        <SummaryCard
          label="Phạm vi"
          value={department}
        />

        <SummaryCard
          label="Số dòng AST"
          value={
            summary.totalRows.toString()
          }
        />

        <SummaryCard
          label="Dòng n < 30"
          value={
            summary.lowNCount.toString()
          }
        />

      </section>

      {/* CLSI EXPLANATION */}

      <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="font-bold text-blue-950">
          Cách đọc kết quả theo CLSI
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-3">

          <ExplanationBox
            title="S – Nhạy"
            text={
              clsiConfig
                .interpretation
                .S
                .description
            }
          />

          <ExplanationBox
            title="I – Trung gian"
            text={
              clsiConfig
                .interpretation
                .I
                .description
            }
          />

          <ExplanationBox
            title="R – Kháng"
            text={
              clsiConfig
                .interpretation
                .R
                .description
            }
          />

        </div>
      </section>

      {/* TABLE */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              Kết quả AST
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Antibiogram dữ liệu gốc
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {metadata.period.label}
              {" • "}
              CLSI M100 Ed
              {clsiConfig.edition}
            </p>
          </div>

          <p className="text-sm text-slate-500">
            {sorted.length}
            {" "}
            kết quả
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            Không có dữ liệu phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">

            <table className="min-w-full border-collapse">

              <thead>
                <tr className="bg-slate-50">

                  <TH>
                    Vi khuẩn
                  </TH>

                  <TH>
                    Kháng sinh
                  </TH>

                  <TH>
                    n
                  </TH>

                  <TH>
                    %S
                    <br />
                    Nhạy
                  </TH>

                  <TH>
                    %I
                    <br />
                    Trung gian
                  </TH>

                  <TH>
                    %R
                    <br />
                    Kháng
                  </TH>

                  <TH>
                    Ghi chú
                  </TH>

                </tr>
              </thead>

              <tbody>

                {sorted.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50"
                    >

                      <TD>
                        <strong className="text-slate-900">
                          {
                            item.organismName
                          }
                        </strong>
                      </TD>

                      <TD>
                        {
                          item.antibioticName
                        }
                      </TD>

                      <TD>
                        {
                          item.n
                        }
                      </TD>

                      {item.intrinsicResistance ? (
                        /* Khang tu nhien: hien R nhu bang Excel, khong hien %S tu vai ket qua le. */
                        <>
                          <TD>
                            <span className="inline-flex min-w-[60px] justify-center rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-900">
                              R
                            </span>
                          </TD>
                          <TD>
                            <span className="text-slate-400">—</span>
                          </TD>
                          <TD>
                            <span className="text-slate-400">—</span>
                          </TD>
                        </>
                      ) : item.noBreakpoint ? (
                        /* Khong co diem gay CLSI: khong hien %S/%I/%R. */
                        <>
                          <TD><span className="text-slate-400">—</span></TD>
                          <TD><span className="text-slate-400">—</span></TD>
                          <TD><span className="text-slate-400">—</span></TD>
                        </>
                      ) : (
                        <>
                          <TD>
                            <PercentBadge
                              value={
                                item.susceptiblePercent
                              }
                              type="S"
                            />
                          </TD>

                          <TD>
                            <PercentBadge
                              value={
                                item.increasedExposurePercent
                              }
                              type="I"
                            />
                          </TD>

                          <TD>
                            <PercentBadge
                              value={
                                item.resistantPercent
                              }
                              type="R"
                            />
                          </TD>
                        </>
                      )}

                      <TD>
                        {item.intrinsicResistance && (
                          <span className="mb-1 inline-flex rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-900">
                            Kháng tự nhiên
                          </span>
                        )}
                        {item.noBreakpoint && (
                          <span className="mb-1 inline-flex rounded-full bg-slate-200 px-2 py-1 text-xs font-bold text-slate-800">
                            Không có điểm gãy CLSI
                          </span>
                        )}
                        {item.clsiNote && (
                          <p className="mb-1 text-xs leading-5 text-slate-700">{item.clsiNote}</p>
                        )}
                        {item.lowN ? (
                          <div className="space-y-1">

                            <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">
                              n &lt; 30
                            </span>

                            <p className="text-xs text-amber-700">
                              Diễn giải thận trọng
                            </p>

                          </div>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </TD>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

        <div className="mt-5 rounded-xl bg-slate-50 p-4">

          <p className="text-xs leading-5 text-slate-600">
            <strong>
              Lưu ý:
            </strong>
            {" "}
            %S là tỷ lệ nhạy.
            %I và %R được báo cáo riêng theo CLSI; I tính là không nhạy.
          </p>

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   SOURCE 2 — REPORT
========================================================= */

export function ReportSource() {
  const [
    block,
    setBlock,
  ] = useState<
    "HSCC" |
    "Khối nội" |
    "Khối ngoại"
  >("HSCC");

  const [
    organismId,
    setOrganismId,
  ] = useState("");

  const rows = useMemo(
    () =>
      reportRows.filter(
        (row) => {
          if (
            row.block !==
            block
          ) {
            return false;
          }

          if (
            organismId &&
            row.organismId !==
              organismId
          ) {
            return false;
          }

          return true;
        }
      ),
    [
      block,
      organismId,
    ]
  );

  const organismOptions =
    useMemo(
      () =>
        Array.from(
          new Map(
            reportRows
              .filter(
                (row) =>
                  row.block ===
                  block
              )
              .map(
                (row) => [
                  row.organismId,
                  {
                    value:
                      row.organismId,
                    label:
                      row.organismName,
                  },
                ]
              )
          ).values()
        ),
      [block]
    );

  return (
    <div className="mt-6">

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

        <p className="font-bold text-blue-950">
          Nguồn 2 – Báo cáo tổng hợp KKS BV199
        </p>

        <p className="mt-2 text-sm leading-6 text-blue-900">
          Số liệu giữ theo phân nhóm tại thời điểm lập báo cáo.
          Xem phân nhóm khoa hiện hành tại Bảng tích lũy và Tra cứu chi tiết.
        </p>

        <p className="mt-2 text-xs leading-5 text-blue-800">
          Ký hiệu R trong một số ô của báo cáo nguồn có thể biểu thị
          đề kháng tự nhiên theo chính báo cáo gốc.
        </p>

      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="grid gap-4 md:grid-cols-2">

          <SelectBox
            label="Phạm vi báo cáo"
            value={block}
            onChange={(value) => {
              setBlock(
                value as
                  | "HSCC"
                  | "Khối nội"
                  | "Khối ngoại"
              );

              setOrganismId("");
            }}
            options={[
              {
                value:
                  "HSCC",
                label:
                  "HSCC",
              },
              {
                value:
                  "Khối nội",
                label:
                  "Khối nội",
              },
              {
                value:
                  "Khối ngoại",
                label:
                  "Khối ngoại",
              },
            ]}
          />

          <SelectBox
            label="Vi khuẩn"
            value={organismId}
            onChange={setOrganismId}
            options={[
              {
                value: "",
                label:
                  "Tất cả",
              },
              ...organismOptions,
            ]}
          />

        </div>

      </section>

      <div className="mt-6 space-y-6">

        {rows.map(
          (row) => {
            const panel =
              row.panel ===
              "gram-negative"
                ? gramNegativePanel
                : gramPositivePanel;

            return (
              <section
                key={row.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                      {
                        row.block
                      }
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {
                        row.organismName
                      }
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Báo cáo tổng hợp – không thay thế dữ liệu AST gốc
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <Link
                        href="/antibiotics/organism"
                        className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100"
                      >
                        KS theo vi khuẩn →
                      </Link>

                      {SHOW_PKPD && <Link
                        href={PKPD_HREF}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        PK/PD →
                      </Link>}

                    </div>

                  </div>

                  <div className="rounded-xl bg-slate-50 px-5 py-3 text-center">

                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Số phân lập
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {
                        row.isolates
                      }
                    </p>

                  </div>

                </div>

                {row.isolates < 30 && (

                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <strong>
                      Cảnh báo:
                    </strong>
                    {" "}
                    số phân lập nhỏ
                    {" "}
                    (n = {row.isolates}).
                    Tỷ lệ cần được diễn giải thận trọng.
                  </div>

                )}

                <div className="mt-5 overflow-x-auto">

                  <table className="min-w-full">

                    <thead>
                      <tr className="bg-slate-50">

                        <TH>
                          Kháng sinh
                        </TH>

                        <TH>
                          Kết quả báo cáo
                        </TH>

                      </tr>
                    </thead>

                    <tbody>

                      {panel.map(
                        (antibiotic) => (
                          <tr
                            key={
                              antibiotic.id
                            }
                          >

                            <TD>
                              {
                                antibiotic.name
                              }
                            </TD>

                            <TD>
                              <ReportValueDisplay
                                result={
                                  row.results[
                                    antibiotic.id
                                  ]
                                }
                              />
                            </TD>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </section>
            );
          }
        )}

      </div>

    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange:
    (
      value: string
    ) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-400"
      >

        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          )
        )}

      </select>

    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function Badge({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
      {children}
    </span>
  );
}

function ExplanationBox({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-blue-200 bg-white p-4">

      <p className="font-semibold text-blue-950">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-blue-800">
        {text}
      </p>

    </div>
  );
}

function TH({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function TD({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
      {children}
    </td>
  );
}

function PercentBadge({
  value,
  type,
}: {
  value: number;
  type:
    | "S"
    | "I"
    | "R";
}) {
  let style =
    "bg-slate-100 text-slate-700";

  if (
    type === "S"
  ) {
    style =
      "bg-emerald-100 text-emerald-900";
  }

  if (
    type === "I"
  ) {
    style =
      "bg-amber-100 text-amber-900";
  }

  if (
    type === "R"
  ) {
    style =
      "bg-rose-100 text-rose-900";
  }

  return (
    <span
      className={`inline-flex min-w-[60px] justify-center rounded-full px-3 py-1 text-xs font-bold ${style}`}
    >
      {value}%
    </span>
  );
}

function ReportValueDisplay({
  result,
}: {
  result:
    | ReportCell
    | undefined;
}) {
  if (
    !result ||
    result.type ===
      "na"
  ) {
    return (
      <span className="text-slate-400">
        —
      </span>
    );
  }

  if (
    result.type ===
    "intrinsic"
  ) {
    return (
      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-900">
        R – đề kháng tự nhiên
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
      {result.value}%
    </span>
  );
}
