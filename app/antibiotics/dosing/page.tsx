"use client";

import { useMemo, useState } from "react";

import drugData from "@/data/drug-products.json";

import {
  antibioticDoseRules,
} from "@/data/antibiotics/dosing";

type Drug = {
  id: string;
  brandName?: string;
  ingredientName?: string;
  ingredientId?: string;
  strength?: string;
  route?: string;
  dosageForm?: string;
};

const drugs = drugData as Drug[];

function normalizeText(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\*/g, "")
    .trim();
}

function findRenalRule(
  rules:
    | {
        minCrCl?: number;
        maxCrCl?: number;
        dose: string;
        interval: string;
        note?: string;
      }[]
    | undefined,
  crcl: number
) {
  if (!rules) return undefined;

  return rules.find((rule) => {
    const minOk =
      rule.minCrCl === undefined ||
      crcl >= rule.minCrCl;

    const maxOk =
      rule.maxCrCl === undefined ||
      crcl <= rule.maxCrCl;

    return minOk && maxOk;
  });
}

export default function AntibioticDosingPage() {
  const [search, setSearch] = useState("");
  const [selectedDrugId, setSelectedDrugId] =
    useState("");
  const [selectedRuleId, setSelectedRuleId] =
    useState("");
  const [crcl, setCrcl] = useState("");

  const searchResults = useMemo(() => {
    const q = normalizeText(search);

    if (!q) return [];

    return drugs
      .filter((drug) => {
        const text = normalizeText(
          [
            drug.brandName,
            drug.ingredientName,
            drug.ingredientId,
            drug.strength,
          ]
            .filter(Boolean)
            .join(" ")
        );

        return text.includes(q);
      })
      .slice(0, 15);
  }, [search]);

  const selectedDrug = useMemo(
    () =>
      drugs.find(
        (drug) => drug.id === selectedDrugId
      ),
    [selectedDrugId]
  );

  const availableRules = useMemo(() => {
    if (!selectedDrug) return [];

    const ingredientId = normalizeText(
      selectedDrug.ingredientId
    );

    const ingredientName = normalizeText(
      selectedDrug.ingredientName
    );

    return antibioticDoseRules.filter(
      (rule) =>
        normalizeText(rule.ingredientId) ===
          ingredientId ||
        ingredientName.includes(
          normalizeText(rule.ingredientName)
        )
    );
  }, [selectedDrug]);

  const selectedRule = useMemo(() => {
    if (!availableRules.length) {
      return undefined;
    }

    if (selectedRuleId) {
      return availableRules.find(
        (rule) =>
          `${rule.ingredientId}-${rule.indicationId}` ===
          selectedRuleId
      );
    }

    return availableRules[0];
  }, [availableRules, selectedRuleId]);

  const crclNumber = Number(crcl);

  const renalRule = useMemo(() => {
    if (
      !selectedRule ||
      !crcl ||
      Number.isNaN(crclNumber)
    ) {
      return undefined;
    }

    return findRenalRule(
      selectedRule.renal,
      crclNumber
    );
  }, [
    selectedRule,
    crcl,
    crclNumber,
  ]);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Kháng sinh & AMS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Liều kháng sinh
          </h1>

          <p className="mt-3 max-w-4xl leading-7 text-slate-600">
            Chọn thuốc từ danh mục BV199,
            chọn chỉ định và nhập CrCl
            để xem liều khuyến nghị.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="grid gap-5 lg:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tìm thuốc
              </label>

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedDrugId("");
                  setSelectedRuleId("");
                }}
                placeholder="Ví dụ: meropenem..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />

              {search &&
                !selectedDrugId &&
                searchResults.length > 0 && (
                  <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border bg-white shadow-lg">

                    {searchResults.map(
                      (drug) => (
                        <button
                          key={drug.id}
                          type="button"
                          onClick={() => {
                            setSelectedDrugId(
                              drug.id
                            );

                            setSearch(
                              drug.brandName ??
                                drug.ingredientName ??
                                ""
                            );
                          }}
                          className="block w-full border-b px-4 py-3 text-left hover:bg-slate-50"
                        >
                          <p className="font-semibold text-slate-900">
                            {drug.brandName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {drug.ingredientName}
                            {drug.strength
                              ? ` • ${drug.strength}`
                              : ""}
                          </p>
                        </button>
                      )
                    )}

                  </div>
                )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                CrCl
              </label>

              <div className="flex">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={crcl}
                  onChange={(e) =>
                    setCrcl(e.target.value)
                  }
                  placeholder="Ví dụ: 35"
                  className="min-w-0 flex-1 rounded-l-xl border border-slate-300 px-4 py-3"
                />

                <div className="flex items-center rounded-r-xl border border-l-0 border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
                  mL/phút
                </div>
              </div>
            </div>
          </div>

          {selectedDrug && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">

              <p className="text-xs font-semibold uppercase text-slate-400">
                Thuốc đã chọn
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {selectedDrug.brandName}
              </h2>

              <p className="mt-1 font-semibold text-blue-700">
                {selectedDrug.ingredientName}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedDrug.strength && (
                  <Badge>
                    {selectedDrug.strength}
                  </Badge>
                )}

                {selectedDrug.route && (
                  <Badge>
                    {selectedDrug.route}
                  </Badge>
                )}

                {selectedDrug.dosageForm && (
                  <Badge>
                    {selectedDrug.dosageForm}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {selectedDrug &&
            availableRules.length === 0 && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">

                <p className="font-semibold text-amber-900">
                  Chưa có dữ liệu liều được thẩm định cho hoạt chất này.
                </p>

              </div>
            )}

          {availableRules.length > 0 && (
            <div className="mt-6">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Chỉ định
              </label>

              <select
                value={
                  selectedRule
                    ? `${selectedRule.ingredientId}-${selectedRule.indicationId}`
                    : ""
                }
                onChange={(e) =>
                  setSelectedRuleId(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                {availableRules.map(
                  (rule) => (
                    <option
                      key={`${rule.ingredientId}-${rule.indicationId}`}
                      value={`${rule.ingredientId}-${rule.indicationId}`}
                    >
                      {rule.indicationLabel}
                    </option>
                  )
                )}
              </select>

            </div>
          )}

        </section>

        {selectedRule && (
          <section className="mt-6 grid gap-5 lg:grid-cols-2">

            <div className="rounded-2xl border bg-white p-6 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Liều chuẩn
              </p>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {selectedRule.dose}
                {" • "}
                {selectedRule.interval}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Đường dùng:{" "}
                <strong>
                  {selectedRule.route}
                </strong>
              </p>

              {selectedRule.infusion && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {selectedRule.infusion}
                </p>
              )}

              {selectedRule.pkpdTarget && (
                <div className="mt-4 rounded-xl bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase text-blue-600">
                    PK/PD target
                  </p>

                  <p className="mt-1 font-bold text-blue-900">
                    {selectedRule.pkpdTarget}
                  </p>
                </div>
              )}

            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Liều theo chức năng thận
              </p>

              {!crcl ? (
                <p className="mt-3 text-sm text-emerald-800">
                  Nhập CrCl để nhận khuyến nghị.
                </p>
              ) : renalRule ? (
                <>
                  <p className="mt-3 text-2xl font-bold text-emerald-950">
                    {renalRule.dose}
                    {" • "}
                    {renalRule.interval}
                  </p>

                  {renalRule.note && (
                    <p className="mt-3 text-sm leading-6 text-emerald-800">
                      {renalRule.note}
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-3 text-sm text-emerald-800">
                  Không tìm thấy ngưỡng CrCl phù hợp.
                </p>
              )}

            </div>

          </section>
        )}

        {selectedRule && (
          <section className="mt-5 rounded-2xl border bg-white p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Nguồn
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
              {selectedRule.source.organization}
              {" – "}
              {selectedRule.source.title}
              {" ("}
              {selectedRule.source.year}
              {")"}
            </p>

          </section>
        )}

      </div>
    </main>
  );
}

function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}