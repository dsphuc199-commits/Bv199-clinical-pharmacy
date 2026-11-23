"use client";

import { useEffect, useRef, type ReactNode } from "react";
import CapByt2026, { CAP_SCENARIOS } from "../CapByt2026";
import HapVap2023, { HAPVAP_SCENARIOS } from "../HapVap2023";
import BytRegimenView from "./BytRegimenView";
import { DiseaseMonitoring, DiseaseOverviewSummary } from "./DiseaseOverview";
import StratificationPanel, { isVn } from "./StratificationPanel";
import { getRegimensForDisease } from "@/data/antibiotics/empiric/regimens";
import type { StratColumn, Stratification } from "@/data/antibiotics/empiric/stratification";
import { DOSE_CONFLICTS } from "@/data/antibiotics/empiric/dose-conflicts";
import { stratifiedText } from "@/lib/antibiotics/presentation-text";

const MODULES: Record<string, "cap" | "hap" | "vap"> = { "v8-1": "cap", "v8-4": "hap", "v8-5": "vap" };

function Scenario({ label, selected, criteria, children }: { label: string; selected: boolean; criteria?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: "nearest" });
  }, [selected]);
  return (
    <section ref={ref} data-selected-scenario={selected || undefined} className={`min-w-0 space-y-2 rounded-lg p-2 ${selected ? "ring-2 ring-teal-700" : ""}`}>
      <h5 className="font-semibold text-slate-900">{stratifiedText(label)}</h5>
      {criteria && <p className="text-sm text-slate-700">{stratifiedText(criteria)}</p>}
      {children}
    </section>
  );
}

export default function IntegratedVnStratification({ data, diseaseId, scenario }: {
  data: Stratification;
  diseaseId: string;
  scenario?: string | null;
}) {
  const respiratoryModule = MODULES[diseaseId];
  const regimens = getRegimensForDisease(diseaseId);
  const covered = new Set([...data.columns.flatMap((column) => column.byt), ...(data.focus ?? []).flatMap((focus) => focus.byt)]);
  const additional = regimens.filter((regimen) => !covered.has(regimen.id)).map((regimen) => regimen.id);
  const matches = (...values: string[]) => !!scenario && values.includes(scenario);
  const hasComparison = DOSE_CONFLICTS.some((conflict) => conflict.diseaseIds.includes(diseaseId));

  function renderByt(ids: string[], columnId?: string) {
    const groups = new Map<string, string[]>();
    for (const regimen of regimens) {
      if (!ids.includes(regimen.id)) continue;
      const group = groups.get(regimen.scenario) ?? [];
      group.push(regimen.id);
      groups.set(regimen.scenario, group);
    }
    return Array.from(groups, ([label, rows], index) => (
      <Scenario key={label} label={label} selected={matches(label, ...rows) || (index === 0 && !!columnId && matches(columnId))}>
        <BytRegimenView diseaseId={diseaseId} stratifiedRegimenIds={rows} />
      </Scenario>
    ));
  }

  function renderColumn(column: StratColumn) {
    if (!respiratoryModule) return renderByt(column.byt, column.id);
    if (respiratoryModule === "cap") {
      return CAP_SCENARIOS.filter((entry) => column.vnScenarioIds?.includes(entry.id)).map((entry) => (
        <Scenario key={entry.id} label={entry.name} selected={matches(entry.id, entry.name, column.id, ...entry.regimens.map(({ id }) => id))}>
          <CapByt2026 stratifiedScenarioId={entry.id} />
        </Scenario>
      ));
    }
    return HAPVAP_SCENARIOS[respiratoryModule].filter((entry) => column.vnScenarioIds?.includes(entry.id)).map((entry, index) => (
      <Scenario key={entry.id} label={entry.title} criteria={entry.description} selected={matches(entry.id, entry.title, ...entry.regimens.map(({ id }) => id)) || (index === 0 && matches(column.id))}>
        <HapVap2023 kind={respiratoryModule} stratifiedScenarioId={entry.id} />
      </Scenario>
    ));
  }

  return <StratificationPanel data={data} family="vn" content={{
    overview: <DiseaseOverviewSummary diseaseId={diseaseId} stratified={{
      pathogens: data.pathogens.filter(({ source }) => isVn(source)),
      sampling: respiratoryModule === "vap" ? data.sampling.filter(({ source }) => isVn(source)) : [],
    }} />,
    monitoring: <DiseaseMonitoring diseaseId={diseaseId} stratified />,
    column: renderColumn,
    focus: renderByt,
    additionalTreatment: <>
      {additional.length > 0 && (
        <details open={regimens.some(({ id, scenario: name }) => additional.includes(id) && matches(id, name))} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
          <summary className="cursor-pointer font-bold text-slate-900">Phương án của Bộ Y tế theo bệnh cảnh</summary>
          {renderByt(additional)}
        </details>
      )}
      {hasComparison && <a className="font-semibold text-teal-800 underline" href={`?disease=${diseaseId}&tab=compare#doi-chieu-lieu`}>Đối chiếu liều giữa các hướng dẫn</a>}
    </>,
  }} />;
}
