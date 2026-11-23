"use client";
/*
  Tab "Phân tầng": bố cục phân tầng nguy cơ nhiễm khuẩn (cộng đồng / bệnh viện / nhóm đặc biệt),
  ghép phác đồ Bộ Y tế (ALL_REGIMENS), khuyến cáo quốc tế đã đối chiếu và kháng sinh đồ BV199
  tách hồi sức và không hồi sức. Dữ liệu: data/antibiotics/empiric/stratification.ts.
*/
import Link from "next/link";
import { useState } from "react";
import tablesData from "@/data/antibiotics/antibiogram-bv199-tables.json";
import { ALL_REGIMENS, DOCS, type Regimen } from "@/data/antibiotics/empiric/regimens";
import type { StratCite, StratColumn, StratIntl, Stratification } from "@/data/antibiotics/empiric/stratification";
import { Rx, RxToolStyle } from "./rx-tool";
import { clinicalText } from "@/lib/antibiotics/presentation-text";
import { structureOf } from "@/lib/antibiotics/regimen-structure";
import DoseTable from "../treatment/DoseTable";

/* Ghi chú quy trình soạn (vị trí trong văn bản, nguồn không nêu…) không hiển thị trên giao diện lâm sàng. */
const PROCESS = /không nêu|văn bản|theo nguồn|nguyên văn|cần xác minh|bảng\s|table\s|(^|[\s(])tr\.\s*\d|trang\s/iu;
/* Bỏ chú thích vị trí tài liệu trong câu liều (QĐ 708 Bảng…, DTQG…); giữ nguyên liều. */
const stripDose = (text: string) => text
  .replace(/\s*\([^()]*?(?:QĐ 708|DTQG|Bảng|chương)[^()]*\)/gu, "")
  .split(/;\s*/)
  .map((part) => part.replace(/\s*[–.]\s*(?:DTQG|Bảng)\b.*$/u, "").trim())
  .join("; ");
const shown = (text: string) => { const t = clinicalText(text).trim(); return t && !PROCESS.test(t) ? t : ""; };

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

function Cites({ items }: { items: StratCite[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
      {items.map((c) => <li key={c.text}>{c.text} <span className="text-xs text-slate-500" title={c.ref}>({c.source}{PROCESS.test(c.ref) ? "" : `, ${c.ref}`})</span></li>)}
    </ul>
  );
}

function BytRegimen({ regimen }: { regimen: Regimen }) {
  const notes = (regimen.notes ?? []).map(shown).filter(Boolean);
  const structure = structureOf({ ...regimen, drugs: regimen.drugs.map((drug) => ({ ...drug, dose: stripDose(drug.dose) })) });
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-2">
      <p className="text-sm font-semibold text-slate-900">{shown(regimen.scenario) || regimen.scenario}</p>
      <DoseTable groups={structure.groups} status={structure.status} duration={regimen.duration} />
      {notes.length > 0 && (
        <details className="mt-1 text-xs text-slate-600">
          <summary className="cursor-pointer">Chú thích</summary>
          <ul className="list-disc pl-4">{notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </details>
      )}
      <p className="mt-1 text-xs text-slate-500" title={regimen.source.page}>{DOCS[regimen.source.doc]?.number ? `QĐ ${DOCS[regimen.source.doc].number}` : "Bộ Y tế"}{PROCESS.test(regimen.source.section) ? "" : `, ${regimen.source.section}`}</p>
    </div>
  );
}

function BytList({ ids }: { ids: string[] }) {
  const items = ids.map((id) => ALL_REGIMENS.find((r) => r.id === id)).filter((r): r is Regimen => Boolean(r));
  return <div className="space-y-2">{items.map((r) => <BytRegimen key={r.id} regimen={r} />)}</div>;
}

function Intl({ block }: { block: StratIntl }) {
  return (
    <div className="min-w-0 max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-white p-2">
      <p className="text-sm font-semibold text-slate-900">{block.source}</p>
      {block.lead && <p className="text-xs text-slate-600">{block.lead}</p>}
      <Rx items={block.items} />
    </div>
  );
}

type Family = "vn" | "intl";
/* Nguồn Việt Nam: văn bản Bộ Y tế, khuyến cáo hội chuyên ngành Việt Nam. */
const isVn = (source: string) => /^(QĐ|Hội|Bộ Y tế)/u.test(source);
const ofFamily = (items: StratCite[], family: Family) => items.filter((c) => isVn(c.source) === (family === "vn"));

function Column({ col, family }: { col: StratColumn; family: Family }) {
  const criteria = ofFamily(col.criteria, family);
  const pathogens = col.pathogens ? ofFamily(col.pathogens, family) : [];
  const vn = family === "vn";
  return (
    <section className={`min-w-0 rounded-xl border-2 p-3 ${TONE[col.tone]}`} aria-label={col.label}>
      <h4 className="text-base font-bold text-slate-900">{col.label}</h4>
      {criteria.length > 0 && <><h5 className="mt-2 text-sm font-semibold text-slate-700">Tiêu chí</h5><Cites items={criteria} /></>}
      {pathogens.length > 0 && <><h5 className="mt-2 text-sm font-semibold text-slate-700">Tác nhân lưu ý</h5><Cites items={pathogens} /></>}
      {vn && (col.byt.length > 0 || (col.vn?.length ?? 0) > 0) && <h5 className="mt-3 text-sm font-semibold text-slate-700">Kháng sinh gợi ý</h5>}
      {vn && col.byt.length > 0 && <BytList ids={col.byt} />}
      {vn && col.vn && <div className="space-y-2">{col.vn.map((b) => <Intl key={b.source} block={b} />)}</div>}
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

export default function StratificationPanel({ data, family }: { data: Stratification; family: Family }) {
  const vn = family === "vn";
  const sampling = ofFamily(data.sampling, family);
  const pathogens = ofFamily(data.pathogens, family);
  const columns = data.columns.filter((c) => vn
    ? ofFamily(c.criteria, "vn").length > 0 || c.byt.length > 0 || (c.vn?.length ?? 0) > 0
    : ofFamily(c.criteria, "intl").length > 0 || c.intl.length > 0 || Boolean(c.links));
  const sources = data.sources.filter((s) => /^(Bộ Y tế|Hội)/u.test(s) === vn);
  if (!columns.length) return null;
  return (
    <details open className="mb-4 min-w-0 max-w-full rounded-2xl border border-teal-200 bg-teal-50/40 p-3">
      <RxToolStyle />
      <summary className="cursor-pointer">
        <span className="text-xs font-bold uppercase tracking-wide text-teal-800">Phân tầng theo nguy cơ nhiễm khuẩn – {vn ? "hướng dẫn Việt Nam" : "hướng dẫn quốc tế"}</span>
        <span className="block text-lg font-bold text-slate-900">{data.title}</span>
      </summary>
      <div className="mt-2 space-y-3">
        {sources.length > 0 && <p className="text-xs text-slate-600">Nguồn: {sources.join(" ")}</p>}
        {sampling.length > 0 && (
          <section className="rounded-xl border border-amber-300 bg-amber-50 p-3">
            <h4 className="text-sm font-bold text-amber-950">Gửi bệnh phẩm trước kháng sinh</h4>
            <Cites items={sampling} />
          </section>
        )}
        {pathogens.length > 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-3">
            <h4 className="text-sm font-bold text-slate-900">Tác nhân lưu ý</h4>
            <Cites items={pathogens} />
          </section>
        )}
        <div className={`grid min-w-0 gap-3 ${vn ? "lg:grid-cols-2 2xl:grid-cols-3" : "2xl:grid-cols-2"}`}>
          {columns.map((col) => <Column key={col.id} col={col} family={family} />)}
        </div>
        {vn && data.focus && (
          <details className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer font-bold text-slate-900">{data.focusTitle}</summary>
            <div className="mt-2 grid min-w-0 gap-3 lg:grid-cols-2">
              {data.focus.map((f) => (
                <div key={f.label} className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{f.label}{f.diseaseId && <> – <Link className="text-teal-800 underline" href={`/antibiotics/empiric/guideline-v9?disease=${f.diseaseId}`}>mở mặt bệnh</Link></>}</p>
                  <BytList ids={f.byt} />
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
        <p className="text-xs text-slate-600">Chỉnh liều theo chức năng thận và hướng dẫn liều BV199. Chi tiết từng phương án ở phần bên dưới.</p>
      </div>
    </details>
  );
}
