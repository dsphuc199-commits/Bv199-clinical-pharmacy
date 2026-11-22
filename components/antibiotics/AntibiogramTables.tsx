"use client";

/*
  Bang khang sinh do tich luy BV199 – cung bo cuc workbook Excel
  (BANG_TOAN_VIEN / BANG_HSCC / BANG_KHOI_NOI / BANG_KHOI_NGOAI / BANG_THEO_KHOA).
  Du lieu: data/antibiotics/antibiogram-bv199-tables.json, tao boi
  scripts/import-antibiogram-normalized.mjs va da doi chieu tung o voi workbook.
*/

import { useState } from "react";
import tablesData from "@/data/antibiotics/antibiogram-bv199-tables.json";

type Cell = { t: string; s?: number; n?: number; g?: number };
type Row = { group: string; n: number; nText: string; share: number; cells: Cell[] };
type Panel = { columns: { code: string; name: string }[]; rows: Row[] };
type Table = {
  id: string;
  kind: "scope" | "ward";
  label: string;
  group?: string;
  n: number;
  gramNegative: Panel;
  gramPositive: Panel;
};
type TablesFile = {
  period: string;
  minN: number;
  minTestedRatio: number;
  greenThreshold: number;
  tables: Table[];
};

const data = tablesData as TablesFile;
const scopes = data.tables.filter((table) => table.kind === "scope");
const wards = data.tables.filter((table) => table.kind === "ward");

export default function AntibiogramTables({ status, departmentNote }: { status: string; departmentNote: string }) {
  const [tableId, setTableId] = useState(scopes[0].id);
  const table = data.tables.find((item) => item.id === tableId) ?? scopes[0];
  const isWard = table.kind === "ward";

  return (
    <section aria-labelledby="antibiogram-scope" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
      <h2 id="antibiogram-scope" className="text-lg font-bold text-slate-900">
        {table.label} · {table.n} phân lập
      </h2>
      <p className="text-sm text-slate-600">{data.period} · Tỷ lệ nhạy cảm (%S)</p>
      <p className="mt-1 text-xs font-semibold text-amber-900">{status}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {scopes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTableId(t.id)}
            aria-pressed={t.id === table.id}
            className={`min-h-9 rounded-lg px-2.5 py-1.5 text-xs font-semibold sm:px-3 sm:text-sm ${
              t.id === table.id ? "bg-teal-700 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
        <select
          aria-label="Theo khoa"
          value={isWard ? table.id : ""}
          onChange={(event) => setTableId(event.target.value || scopes[0].id)}
          className="min-h-9 min-w-0 max-w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 sm:text-sm"
        >
          <option value="">Chọn khoa</option>
          {wards.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}{t.group ? ` – ${t.group}` : ""} (n={t.n})
            </option>
          ))}
        </select>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-600">{departmentNote}</p>

      {isWard && table.n < data.minN && (
        <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900">
          Khoa có dưới {data.minN} phân lập. Chỉ dùng để tham khảo, không dùng chọn kháng sinh kinh nghiệm.
        </p>
      )}

      <p className="mt-3 text-xs text-slate-500 sm:hidden">Vuốt ngang bảng để xem thêm kháng sinh.</p>
      <MatrixPanel title="Vi khuẩn Gram âm" panel={table.gramNegative} minN={data.minN} />
      <MatrixPanel title="Vi khuẩn Gram dương" panel={table.gramPositive} minN={data.minN} />

      <ul className="mt-5 space-y-1 text-xs leading-5 text-slate-600">
        <li>^: tỷ lệ nhạy cảm của một cặp vi khuẩn – kháng sinh được tính từ phân lập đầu tiên của mỗi loài trên mỗi người bệnh (CLSI M39); %S = S/(S+I+R), I tính là không nhạy.</li>
        <li>*: tỷ lệ nhạy cảm được tính từ kết quả xét nghiệm của dưới {Math.round(data.minTestedRatio * 100)}% số phân lập.</li>
        <li>a: số phân lập dưới {data.minN}; dòng in nghiêng, màu xám.</li>
        <li>R: kháng tự nhiên; danh mục chưa đối chiếu với CLSI M100 và EUCAST.</li>
        <li>-: kháng sinh không làm xét nghiệm hoặc không chỉ định.</li>
        <li>b: tỷ lệ nhạy cảm dựa trên cefoxitin (chỉ điểm methicillin) cho Staphylococcus; chưa suy ra cho β-lactam khác.</li>
        <li>
          <span className="mr-1 inline-block h-3 w-3 rounded-sm bg-emerald-200 align-middle" />
          Ô xanh: tỷ lệ nhạy ≥{data.greenThreshold}% với các chủng ≥{data.minN} phân lập và xét nghiệm ≥{Math.round(data.minTestedRatio * 100)}% số chủng.
        </li>
        <li>Rê chuột vào ô để xem số nhạy / số có xét nghiệm.</li>
      </ul>
    </section>
  );
}

function MatrixPanel({ title, panel, minN }: { title: string; panel: Panel; minN: number }) {
  if (!panel.rows.length) return null;
  return (
    <div className="mt-3 sm:mt-5">
      <h3 className="mb-2 text-sm font-bold text-slate-900">{title}</h3>
      <div role="region" aria-label={title} tabIndex={0} className="max-w-full overflow-x-auto rounded-xl border border-slate-200">
        <table aria-label={title} className="w-max border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th scope="col" className="sticky left-0 z-10 w-32 border-b border-r border-slate-200 bg-slate-100 px-2 py-2 text-left font-bold sm:w-44">
                Vi khuẩn
              </th>
              <th scope="col" className="w-14 border-b border-r border-slate-200 px-2 py-2 font-bold">Số phân lập</th>
              <th scope="col" className="w-12 border-b border-r border-slate-200 px-2 py-2 font-bold">Tỷ lệ (%)</th>
              {panel.columns.map((c) => (
                <th key={c.code} scope="col" className="border-b border-r border-slate-200 px-1 py-2 align-bottom font-semibold">
                  <span className="inline-block whitespace-nowrap [writing-mode:vertical-rl] rotate-180" title={c.name}>
                    {c.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {panel.rows.map((r) => {
              const low = r.n < minN;
              return (
                <tr key={r.group} className={low ? "italic text-slate-500" : "text-slate-900"}>
                  <th scope="row" className={`sticky left-0 z-10 w-32 border-b border-r border-slate-200 px-2 py-1.5 text-left font-semibold sm:w-44 ${low ? "bg-slate-50" : "bg-white"}`}>
                    {r.group}
                  </th>
                  <td className="border-b border-r border-slate-200 px-2 py-1.5 text-center">{r.nText}</td>
                  <td className="border-b border-r border-slate-200 px-2 py-1.5 text-center">{r.share}</td>
                  {r.cells.map((c, i) => (
                    <td
                      key={panel.columns[i].code}
                      title={c.n ? `${panel.columns[i].name}: ${c.s}/${c.n} nhạy` : c.t === "R" ? "Kháng tự nhiên" : "Không làm xét nghiệm"}
                      className={`whitespace-nowrap border-b border-r border-slate-200 px-1.5 py-1.5 text-center ${
                        c.g ? "bg-emerald-200 font-bold text-emerald-950" : c.t === "R" ? "font-bold text-rose-800" : c.t === "-" ? "text-slate-400" : ""
                      }`}
                    >
                      {c.t}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
