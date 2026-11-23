"use client";
/*
  Tab "Phân tầng": bố cục phân tầng nguy cơ nhiễm khuẩn (cộng đồng / bệnh viện / nhóm đặc biệt),
  ghép phác đồ Bộ Y tế (ALL_REGIMENS), khuyến cáo quốc tế đã đối chiếu và kháng sinh đồ BV199
  tách hồi sức và không hồi sức. Dữ liệu: data/antibiotics/empiric/stratification.ts.
*/
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import tablesData from "@/data/antibiotics/antibiogram-bv199-tables.json";
import { ALL_REGIMENS, DOCS, type Regimen } from "@/data/antibiotics/empiric/regimens";
import { cleanRef, type StratCite, type StratColumn, type StratIntl, type Stratification } from "@/data/antibiotics/empiric/stratification";
import { safetyAlertsFor } from "@/data/antibiotics/empiric/safety-alerts";
import { anyInFormulary, betaLactamFlags, mdrOf, severityOf } from "@/lib/antibiotics/clinical-filters";
import { SPECIALIZED_MODULE_LINKS } from "@/lib/antibiotics/empiric-ui-rules";
import { useClinicalFilters } from "./ClinicalFilters";
import { Grade, Rx, RxToolStyle } from "./rx-tool";
import { clinicalText } from "@/lib/antibiotics/presentation-text";
import { structureOf } from "@/lib/antibiotics/regimen-structure";
import DoseTable from "../treatment/DoseTable";

/* Ghi chú quy trình soạn (vị trí trong văn bản, nguồn không nêu…) không hiển thị trên giao diện lâm sàng. */
const PROCESS = /không nêu|văn bản|theo nguồn|nguyên văn|cần xác minh|bảng\s|table\s|(^|[\s(])tr\.\s*\d|trang\s/iu;
const vnText = (text: string) => clinicalText(cleanRef(text));
const foreign = /SWAB|IDSA|SSC\s+2026|nhãn FDA|tham khảo quốc tế/iu;
const selectedClass = "ring-2 ring-teal-700";

function compactNote(text: string): string {
  if (/^ĐỐI CHIẾU LIỀU|^Tham khảo quốc tế/iu.test(text)) return "";
  return vnText(text
    .replace(/^Liều bổ sung ngày[^]*?(?=Liều cho người lớn|Người suy thận)/u, "")
    .split(/(?<=\.)\s+(?=\p{Lu})/u)
    .filter((sentence) => !foreign.test(sentence))
    .join(" ")
    .replace(/^(?:CẦN DƯỢC SĨ XÁC NHẬN|LIỀU NGHI SAI TRONG NGUỒN):\s*/u, "Đối chiếu liều: "));
}

function DoseLink() {
  const link = SPECIALIZED_MODULE_LINKS.doseAdjustment;
  return <Link className="text-xs font-semibold text-teal-800 underline" href={link.href}>{link.label}</Link>;
}

type Cell = { t: string; s?: number; n?: number; g?: number };
type Panel = { columns: { code: string; name?: string }[]; rows: { group: string; n: number; cells: Cell[] }[] };
type TablesFile = { period: string; minN: number; clsiNotes: { mark: string; text: string }[]; tables: { id: string; label: string; n: number; gramNegative: Panel; gramPositive: Panel }[] };
const tables = tablesData as TablesFile;

const SCOPES = [
  { id: "hscc", label: "Hồi sức (HSCC)" },
  { id: "khoi-noi", label: "Khối nội" },
  { id: "khoi-ngoai", label: "Khối ngoại" },
  { id: "toan-vien", label: "Toàn viện" },
] as const;

const TONE: Record<StratColumn["tone"], string> = {
  community: "border-emerald-300 bg-emerald-50/60",
  hospital: "border-rose-300 bg-rose-50/60",
  special: "border-sky-300 bg-sky-50/60",
};

function Cites({ items, hideLocator }: { items: StratCite[]; hideLocator?: boolean }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
      {items.map((c) => <li key={c.text}>{hideLocator ? vnText(c.text) : c.text} <span className="text-xs text-slate-500" title={hideLocator ? undefined : c.ref}>({c.source}{hideLocator || PROCESS.test(c.ref) ? "" : `, ${c.ref}`})</span>{c.grade && <> <Grade g={c.grade} /></>}</li>)}
    </ul>
  );
}

function BytRegimen({ regimen, selected }: { regimen: Regimen; selected?: boolean }) {
  const notes = (regimen.notes ?? []).map(compactNote).filter(Boolean);
  const alerts = safetyAlertsFor(regimen.id);
  const flag = alerts.some(({ autoRecommend }) => autoRecommend === "block") ? "Khóa đề xuất tự động"
    : alerts.some(({ blockFor }) => blockFor?.includes("child")) ? "Liều người lớn" : undefined;
  const { groups, status } = structureOf(regimen);
  const doseGroups = groups.map((group) => ({
    ...group,
    label: group.label && vnText(group.label),
    condition: group.condition && vnText(group.condition),
    raw: group.raw.map((drug) => ({ ...drug, name: vnText(drug.name), dose: cleanRef(drug.dose) })),
    options: group.options.map((option) => ({
      ...option, name: vnText(option.name), raw: cleanRef(option.raw),
      context: option.context && vnText(option.context),
      flags: option.flags.map(vnText),
    })),
  }));
  return (
    <div data-regimen={regimen.id} data-selected-scenario={selected || undefined} className={`min-w-0 rounded-lg border border-slate-200 bg-white p-2${selected ? ` ${selectedClass}` : ""}`}>
      <p className="text-sm font-semibold text-slate-900">{vnText(regimen.scenario)}</p>
      <DoseTable groups={doseGroups} status={status} duration={regimen.duration && vnText(regimen.duration)} showSourceDose hideReviewNote />
      {alerts.length > 0 && (
        <div className="strat-safety mt-1 rounded bg-orange-50 px-2 py-1 text-xs text-orange-900">
          {flag && <strong>{flag}</strong>}
          {alerts.map((alert) => (
            <p key={alert.id}>
              <strong>{vnText(alert.title)}.</strong>{" "}
              {vnText(alert.id === "colistin-unit"
                ? alert.text.replace(/Tương đương gần đúng theo nguồn: [^;]+; nhãn thuốc/u, "Nhãn thuốc")
                : alert.text)}
              {alert.checklist && <span> {alert.checklist.map(vnText).join(" ")}</span>}
            </p>
          ))}
        </div>
      )}
      {notes.length > 0 && (
        <details className="mt-1 text-xs text-slate-600">
          <summary className="cursor-pointer">Chú thích</summary>
          <ul className="list-disc pl-4">{notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </details>
      )}
      <p className="mt-1 flex flex-wrap items-baseline justify-between gap-x-2 text-xs text-slate-500">
        <span>{DOCS[regimen.source.doc]?.number ? `QĐ ${DOCS[regimen.source.doc].number}` : "Bộ Y tế"}</span>
        <DoseLink />
      </p>
    </div>
  );
}

function BytList({ ids, selectedRegimen }: { ids: string[]; selectedRegimen?: string | null }) {
  const filters = useClinicalFilters();
  const items = ids.flatMap((id) => {
    const regimen = ALL_REGIMENS.find((r) => r.id === id);
    if (!regimen || !filters) return regimen ? [regimen] : [];
    const texts = regimen.drugs.map(({ name, dose }) => `${name}: ${dose}`);
    const severity = severityOf(regimen.scenario, regimen.role);
    const mdr = mdrOf(regimen.scenario);
    const excluded = (filters.hidePenicillin && betaLactamFlags(texts).penicillin)
      || (filters.formularyOnly && anyInFormulary(texts) === false)
      || (filters.severity !== "all" && severity !== "unspecified" && severity !== filters.severity)
      || (filters.mdr !== "all" && mdr !== "unspecified" && mdr !== filters.mdr);
    return excluded ? [] : [regimen];
  });
  return items.length > 0
    ? <div className="space-y-2">{items.map((r) => <BytRegimen key={r.id} regimen={r} selected={r.id === selectedRegimen} />)}</div>
    : <p className="text-sm text-slate-600">Bộ lọc đang ẩn các phương án.</p>;
}

function Intl({ block, vn }: { block: StratIntl; vn?: boolean }) {
  const items = vn ? block.items.map((item) => ({
    ...item, role: vnText(item.role), text: vnText(item.text), preparation: item.preparation && vnText(item.preparation),
  })) : block.items;
  const groups = [...new Set(items.map(({ group }) => group))];

  return (
    <div className={`min-w-0 max-w-full rounded-lg border border-slate-200 bg-white p-2 space-y-2 ${vn ? "strat-rx-vn" : "overflow-x-auto"}`}>
      <p className="text-sm font-semibold text-slate-900">{block.source}</p>
      {block.lead && <p className="text-xs text-slate-600">{vn ? vnText(block.lead) : block.lead}</p>}
      {groups.length > 1 ? groups.map((group) => (
        <div key={group ?? ""} className="min-w-0">
          {group && <p className="mb-1 text-xs font-bold text-slate-700">{group}</p>}
          <Rx items={items.filter((item) => item.group === group)} />
        </div>
      )) : <Rx items={items} />}
      {vn && <p className="mt-1"><DoseLink /></p>}
    </div>
  );
}

type Family = "vn" | "intl";
/* Nguồn Việt Nam: văn bản Bộ Y tế, khuyến cáo hội chuyên ngành Việt Nam. */
const isVn = (source: string) => /^(QĐ|Hội|Bộ Y tế)/u.test(source);
const ofFamily = (items: StratCite[], family: Family) => items.filter((c) => isVn(c.source) === (family === "vn"));

function Column({ col, family, selected }: { col: StratColumn; family: Family; selected?: boolean }) {
  const criteria = ofFamily(col.criteria, family);
  const pathogens = col.pathogens ? ofFamily(col.pathogens, family) : [];
  const vn = family === "vn";
  return (
    <section className={`min-w-0 rounded-xl border-2 p-3 ${TONE[col.tone]}${selected ? ` ${selectedClass}` : ""}`} aria-label={col.label} data-strat-column={vn ? col.id : undefined} data-selected-scenario={selected || undefined}>
      <h4 className="text-base font-bold text-slate-900">{col.label}</h4>
      {criteria.length > 0 && <><h5 className="mt-2 text-sm font-semibold text-slate-700">Tiêu chí</h5><Cites items={criteria} hideLocator={vn} /></>}
      {pathogens.length > 0 && <><h5 className="mt-2 text-sm font-semibold text-slate-700">Tác nhân lưu ý</h5><Cites items={pathogens} hideLocator={vn} /></>}
      {vn && (col.byt.length > 0 || (col.vn?.length ?? 0) > 0) && <h5 className="mt-3 text-sm font-semibold text-slate-700">Kháng sinh gợi ý</h5>}
      {vn && col.byt.length > 0 && <BytList ids={col.byt} />}
      {vn && col.vn && <div className="space-y-2">{col.vn.map((b) => <Intl key={b.source} block={b} vn />)}</div>}
      {!vn && col.intl.length > 0 && <><h5 className="mt-3 text-sm font-semibold text-slate-700">Kháng sinh gợi ý</h5><div className="space-y-2">{col.intl.map((b) => <Intl key={b.source} block={b} />)}</div></>}
      {!vn && col.links && (
        <p className="mt-3 text-sm">Khuyến cáo chi tiết: {col.links.map((l, i) => (
          <span key={l.diseaseId}>{i > 0 && "; "}<Link className="font-semibold text-teal-800 underline" href={`/antibiotics/empiric/guideline-v9?disease=${l.diseaseId}&tab=intl`}>{l.label}</Link></span>
        ))}</p>
      )}
    </section>
  );
}

function Antibiogram({ spec }: { spec: Stratification["antibiogram"] }) {
  const [scope, setScope] = useState<string>(spec.defaultScope);
  const table = tables.tables.find(({ id }) => id === scope);
  if (!table) return null;
  const grid = (panel: Panel, organisms: string[], codes: string[]) => {
    const cols = codes.map((code) => ({ code, index: panel.columns.findIndex((c) => c.code === code) })).filter(({ index }) => index >= 0);
    const rows = organisms.map((name) => panel.rows.find(({ group }) => group === name)).filter((r): r is Panel["rows"][number] => Boolean(r));
    return (
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-[36rem] border-collapse text-sm">
          <thead><tr><th className="border border-slate-300 bg-slate-100 px-2 py-1 text-left">Vi khuẩn (n)</th>{cols.map(({ code }) => <th key={code} className="border border-slate-300 bg-slate-100 px-2 py-1">{code}</th>)}</tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.group}>
                <th scope="row" className="border border-slate-300 px-2 py-1 text-left font-medium"><i>{row.group}</i> ({row.n})</th>
                {cols.map(({ code, index }) => {
                  const cell = row.cells[index];
                  return <td key={code} className={`border border-slate-300 px-2 py-1 text-center ${cell?.g ? "bg-emerald-100 font-semibold" : ""}`} title={cell?.n ? `${cell.s}/${cell.n} nhạy` : undefined}>{cell?.t ?? "-"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <details className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
      <summary className="cursor-pointer text-base font-bold text-slate-900">Kháng sinh đồ BV199 (%S) – {tables.period}</summary>
      <div role="tablist" aria-label="Phạm vi khoa" className="my-2 flex flex-wrap gap-2">
        {SCOPES.map((s) => (
          <button key={s.id} type="button" role="tab" aria-selected={scope === s.id} onClick={() => setScope(s.id)}
            className={`rounded-full border px-3 py-1 text-sm ${scope === s.id ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300 bg-white text-slate-800"}`}>
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-600">{table.label}: {table.n} phân lập. {spec.note}</p>
      <h5 className="mt-2 text-sm font-semibold text-slate-700">Gram âm</h5>
      {grid(table.gramNegative, spec.gramNegative.organisms, spec.gramNegative.codes)}
      <h5 className="mt-2 text-sm font-semibold text-slate-700">Gram dương</h5>
      {grid(table.gramPositive, spec.gramPositive.organisms, spec.gramPositive.codes)}
      <p className="mt-2 text-xs text-slate-600">
        Ô xanh: %S ≥ 80% với ≥ {tables.minN} phân lập. * dưới {tables.minN} phân lập hoặc ít chủng được thử, chỉ tham khảo; R: kháng tự nhiên; -: không thử hoặc không có điểm gãy.
        b: tỷ lệ nhạy dựa trên cefoxitin (chỉ điểm methicilin) ở Staphylococcus.
        {tables.clsiNotes.filter((c) => c.mark !== "s").map((c) => ` ${c.mark}: ${c.text}`).join("")}{" "}
        Xem đầy đủ tại <Link className="font-semibold text-teal-800 underline" href="/antibiotics/antibiogram">Kháng sinh đồ BV199</Link>.
      </p>
    </details>
  );
}

function VietnameseTableStyle() {
  return <style>{`
    [data-stratification="vn"] { overflow-wrap: anywhere; }
    .strat-rx-vn { container: strat-rx / inline-size; }
    .strat-rx-vn .sa24-rx:not(.has-dose) {
      table-layout: fixed;
      width: 100%;
      border: 0;
      overflow: visible;
    }
    .strat-rx-vn .sa24-rx:not(.has-dose) th { width: 32%; color: #17364b; }
    .strat-rx-vn .sa24-rx :is(th, td) { white-space: normal; overflow-wrap: anywhere; }
    .strat-rx-vn .sa24-rx .sa24-gc:empty { display: none; }
    [data-stratification="vn"] .tx-table :is(th, td):not(.tx-marker) { overflow-wrap: anywhere; }

    @container strat-rx (max-width: 25rem) {
      .strat-rx-vn .sa24-rx:not(.has-dose) { display: block; width: 100% !important; }
      .strat-rx-vn .sa24-rx:not(.has-dose) tbody { display: block; }
      .strat-rx-vn .sa24-rx:not(.has-dose) tr { display: block; padding: 8px 6px; }
      .strat-rx-vn .sa24-rx:not(.has-dose) tr + tr { border-top: 1px solid #e3eaf0; }
      .strat-rx-vn .sa24-rx:not(.has-dose) :is(th, td) { display: block; width: auto; border: 0; padding: 0; }
      .strat-rx-vn .sa24-rx:not(.has-dose) th { margin-bottom: 3px; }
      .strat-rx-vn .sa24-rx:not(.has-dose) .sa24-gc:empty { display: none; }
    }
  `}</style>;
}

export default function StratificationPanel({ data, family, overview, monitoring, scenario }: {
  data: Stratification;
  family: Family;
  overview?: ReactNode;
  monitoring?: ReactNode;
  scenario?: string | null;
}) {
  const vn = family === "vn";
  const sampling = ofFamily(data.sampling, family);
  const pathogens = ofFamily(data.pathogens, family);
  const columns = data.columns.filter((c) => vn
    ? ofFamily(c.criteria, "vn").length > 0 || c.byt.length > 0 || (c.vn?.length ?? 0) > 0
    : ofFamily(c.criteria, "intl").length > 0 || c.intl.length > 0 || Boolean(c.links));
  const sources = data.sources.filter(isVn);
  const vnGrid = columns.length > 1
    ? `lg:grid-cols-2${columns.length === 3 ? " 2xl:grid-cols-3" : ""}`
    : "";
  const targetColumn = vn && scenario ? columns.find((col) => col.id === scenario || col.byt.includes(scenario)
    || col.vnScenarioIds?.includes(scenario) || col.vn?.some((block) => block.items.some(({ ref }) => ref === scenario))) : undefined;
  const targetFocus = vn && scenario && !targetColumn ? data.focus?.find(({ byt }) => byt.includes(scenario)) : undefined;
  const frame = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (targetColumn || targetFocus) frame.current?.querySelector("[data-selected-scenario=true]")?.scrollIntoView({ block: "start" });
  }, [scenario, targetColumn, targetFocus]);
  if (!columns.length) return null;
  return (
    <details ref={frame} open data-stratification={vn ? "vn" : undefined} className="mb-4 min-w-0 max-w-full rounded-2xl border border-teal-200 bg-teal-50/40 p-3">
      <RxToolStyle />
      {vn && <VietnameseTableStyle />}
      <summary className="cursor-pointer">
        <span className="text-xs font-bold uppercase tracking-wide text-teal-800">Phân tầng theo nguy cơ nhiễm khuẩn – {vn ? "hướng dẫn Việt Nam" : "hướng dẫn quốc tế"}</span>
        <span className="block text-lg font-bold text-slate-900">{data.title}</span>
      </summary>
      <div className="mt-2 space-y-3">
        {vn && overview}
        {!(vn && overview) && sampling.length > 0 && (
          <section className="rounded-xl border border-amber-300 bg-amber-50 p-3">
            <h4 className="text-sm font-bold text-amber-950">Gửi bệnh phẩm trước kháng sinh</h4>
            <Cites items={sampling} />
          </section>
        )}
        {!(vn && overview) && pathogens.length > 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-3">
            <h4 className="text-sm font-bold text-slate-900">Tác nhân lưu ý</h4>
            <Cites items={pathogens} />
          </section>
        )}
        <div className={`grid min-w-0 gap-3 ${vn ? `items-start ${vnGrid}` : "2xl:grid-cols-2"}`}>
          {columns.map((col) => <Column key={col.id} col={col} family={family} selected={col === targetColumn} />)}
        </div>
        {vn && data.focus && (
          <details open={targetFocus ? true : undefined} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer font-bold text-slate-900">{data.focusTitle && vnText(data.focusTitle)}</summary>
            <div className={`mt-2 grid min-w-0 items-start gap-3 ${data.focus.length > 1 ? "lg:grid-cols-2" : ""}`}>
              {data.focus.map((f) => (
                <div key={f.label} className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{f.label}{f.diseaseId && <> – <Link className="text-teal-800 underline" href={`/antibiotics/empiric/guideline-v9?disease=${f.diseaseId}`}>mở mặt bệnh</Link></>}</p>
                  <BytList ids={f.byt} selectedRegimen={f === targetFocus ? scenario : undefined} />
                </div>
              ))}
            </div>
          </details>
        )}
        {!vn && (
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
            <h4 className="text-sm font-bold text-slate-900">Nguyên tắc phủ phổ kinh nghiệm</h4>
            <Intl block={data.principles} />
          </section>
        )}
        <Antibiogram spec={data.antibiogram} />
        {vn && monitoring}
        {vn && sources.length > 0 && (
          <footer data-strat-references className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            <h3 className="font-bold text-slate-900">Tài liệu tham khảo</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 leading-relaxed">
              {sources.map((source) => <li key={source}>{source}</li>)}
            </ul>
          </footer>
        )}
        {!vn && <p className="text-xs text-slate-600">Chỉnh liều theo chức năng thận và hướng dẫn liều BV199.</p>}
      </div>
    </details>
  );
}
