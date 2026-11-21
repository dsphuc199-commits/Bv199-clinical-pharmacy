"use client";

/*
  Bang khang sinh do tich luy BV199 – cung bo cuc workbook Excel
  (BANG_TOAN_VIEN / BANG_HSCC / BANG_KHOI_NOI / BANG_KHOI_NGOAI / BANG_THEO_KHOA).
  Du lieu: data/antibiotics/antibiogram-bv199-tables.json, tao boi
  scripts/import-antibiogram-normalized.mjs va da doi chieu tung o voi workbook.
*/

import { useMemo, useState } from "react";
import tablesData from "@/data/antibiotics/antibiogram-bv199-tables.json";

type Cell = { t: string; s?: number; n?: number; g?: number };
type Row = { group: string; n: number; nText: string; share: number; cells: Cell[] };
type Panel = { columns: { code: string; name: string }[]; rows: Row[] };
type Table = {
  id: string;
  kind: "scope" | "ward";
  label: string;
  heading: string;
  group?: string;
  n: number;
  title: string;
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

export default function AntibiogramTables() {
  const scopes = data.tables.filter((t) => t.kind === "scope");
  const wards = data.tables.filter((t) => t.kind === "ward");
  const [tableId, setTableId] = useState(scopes[0].id);
  const table = useMemo(() => data.tables.find((t) => t.id === tableId) ?? scopes[0], [tableId, scopes]);
  const isWard = table.kind === "ward";

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Kháng sinh đồ tích lũy</p>
      <h2 className="mt-1 text-lg font-bold text-slate-900">Bảng tỷ lệ nhạy cảm theo phạm vi</h2>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {scopes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTableId(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              t.id === table.id ? "bg-teal-700 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.label} (n={t.n})
          </button>
        ))}
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span className="font-semibold">Theo khoa</span>
          <select
            value={isWard ? table.id : ""}
            onChange={(e) => e.target.value && setTableId(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Chọn khoa</option>
            {wards.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label} – {t.group} (n={t.n})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-bold leading-6 text-slate-900">{table.title}</p>
        <p className="mt-1 text-sm text-slate-600">Giai đoạn báo cáo: {data.period}</p>
        <p className="text-sm text-slate-600">Tỷ lệ nhạy cảm với kháng sinh (%)^, ngưỡng phiên giải CLSI</p>
        {isWard && table.n < data.minN && (
          <p className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            Khoa có {table.n} phân lập, dưới {data.minN}: chỉ dùng để tham khảo, không dùng chọn kháng sinh kinh nghiệm.
          </p>
        )}
      </div>

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
    <div className="mt-5">
      <p className="mb-2 text-sm font-bold text-slate-900">{title}</p>
      <div className="max-w-full overflow-x-auto rounded-xl border border-slate-200">
        <table className="border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="sticky left-0 z-10 min-w-[150px] border-b border-r border-slate-200 bg-slate-100 px-2 py-2 text-left font-bold">
                Vi khuẩn
              </th>
              <th className="border-b border-r border-slate-200 px-2 py-2 font-bold">Số chủng phân lập</th>
              <th className="border-b border-r border-slate-200 px-2 py-2 font-bold">Tỷ lệ (%)</th>
              {panel.columns.map((c) => (
                <th key={c.code} className="h-36 border-b border-r border-slate-200 px-1 py-2 align-bottom font-semibold">
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
                  <th className={`sticky left-0 z-10 border-b border-r border-slate-200 px-2 py-1.5 text-left font-semibold ${low ? "bg-slate-50" : "bg-white"}`}>
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
