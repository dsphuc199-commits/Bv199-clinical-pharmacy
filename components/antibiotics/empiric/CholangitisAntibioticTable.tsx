import type { ReactNode } from "react";
import type { OutItem } from "@/lib/intl-rules";
import type { IntlGuideline } from "@/schema/intl-guideline";
import { cholangitisTableDose } from "./cholangitis-dose";

export type CholangitisAntibioticGroup = {
  label: string;
  items: readonly OutItem[];
  relation: (item: OutItem) => string;
  choose?: (role: string) => void;
};

const columns = [
  { title: "Kháng sinh", width: "w-[16%]" },
  { title: "Hàm lượng chế phẩm", width: "w-[15%]" },
  { title: "Liều mỗi lần", width: "w-[12%]" },
  { title: "Số lần dùng", width: "w-[13%]" },
  { title: "Đường dùng và cách dùng", width: "w-[21%]" },
  { title: "Đơn trị / phối hợp", width: "w-[23%]" },
];

const cell = "block min-w-0 break-words px-3 py-1.5 text-left align-top @min-[48rem]:table-cell @min-[48rem]:py-3";
const tableRow = "grid grid-cols-2 border-t border-slate-200 py-1 @min-[48rem]:table-row @min-[48rem]:py-0";

function Cell({ label, wide = false, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <td role="cell" className={wide ? `${cell} col-span-2` : cell}>
      <span className="mb-0.5 block text-[11px] font-semibold text-slate-600 @min-[48rem]:hidden">{label}</span>
      {children}
    </td>
  );
}

export default function CholangitisAntibioticTable({ groups, sources, selected, renalAdjustment }: {
  groups: readonly CholangitisAntibioticGroup[];
  sources: IntlGuideline["sources"];
  selected: readonly string[];
  renalAdjustment: boolean;
}) {
  const formulary = sources.find(({ id }) => id === "bv199-formulary");
  return (
    <div className="@container min-w-0 rounded-xl border border-slate-200 bg-white">
      <table role="table" aria-label="Liều và cách dùng kháng sinh TG18" className="block w-full border-collapse text-xs leading-relaxed text-slate-800 @min-[48rem]:table @min-[48rem]:table-fixed">
        <thead role="rowgroup" className="sr-only bg-slate-100 @min-[48rem]:not-sr-only @min-[48rem]:table-header-group">
          <tr role="row">
            {columns.map(({ title, width }) => (
              <th key={title} role="columnheader" scope="col" className={`${width} px-3 py-2.5 text-left align-top font-bold text-slate-900`}>{title}</th>
            ))}
          </tr>
        </thead>
        {groups.filter(({ items }) => items.length > 0).map((group) => (
          <tbody key={group.label} role="rowgroup" className="block @min-[48rem]:table-row-group">
            <tr role="row" className="block border-t border-slate-200 bg-teal-50 @min-[48rem]:table-row">
              <th role="rowheader" scope="rowgroup" colSpan={columns.length} className={`${cell} font-bold text-teal-950`}>{group.label}</th>
            </tr>
            {group.items.map((item) => {
              const dose = item.dose ? cholangitisTableDose(item.dose) : null;
              const active = selected.includes(item.role);
              const separator = item.role.indexOf("/");
              const name = separator > 0 ? <>{item.role.slice(0, separator + 1)}<wbr />{item.role.slice(separator + 1)}</> : item.role;
              const doseSources = sources.filter(({ id }) => id.startsWith("dose-") && item.source_ids.includes(id));
              const fromFormulary = formulary && item.source_ids.includes(formulary.id);
              return (
                <tr key={item.role} role="row" className={`${tableRow} ${active ? "bg-teal-50/60" : ""}`}>
                  <th role="rowheader" scope="row" aria-label={item.role} className={`${cell} col-span-2 font-bold text-slate-900`}>
                    {group.choose ? (
                      <button type="button" onClick={() => group.choose?.(item.role)} aria-label={item.role} aria-pressed={active}
                        className="max-w-full cursor-pointer rounded-md border border-teal-200 bg-white px-2 py-1 text-left font-semibold text-teal-900 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-700 aria-pressed:border-teal-800 aria-pressed:bg-teal-800 aria-pressed:text-white">
                        {name}
                      </button>
                    ) : name}
                  </th>
                  <Cell label="Hàm lượng chế phẩm">
                    <span className="font-semibold">{item.preparation ?? "Đối chiếu nhãn chế phẩm"}</span>
                    {fromFormulary ? (
                      <a href={formulary.url} className="mt-0.5 block text-[11px] font-medium text-teal-800 underline underline-offset-2" target="_blank" rel="noreferrer">Danh mục BV199</a>
                    ) : item.preparation && <span className="mt-0.5 block text-[11px] text-slate-600">Theo nhãn chế phẩm</span>}
                  </Cell>
                  <Cell label="Liều mỗi lần">
                    {renalAdjustment ? "Cần hiệu chỉnh" : dose ? (
                      <>
                        {dose.loadingDose && <span className="block"><strong>{dose.loadingDose}</strong> liều đầu</span>}
                        <span className="block font-bold text-teal-950">{dose.dose}{dose.loadingDose && " duy trì"}</span>
                        {dose.qualifier && <span className="block text-slate-600">{dose.qualifier}</span>}
                      </>
                    ) : "Đối chiếu nguồn liều"}
                  </Cell>
                  <Cell label="Số lần dùng">
                    {renalAdjustment ? "Theo lịch hiệu chỉnh" : (
                      <>
                        {dose?.dosesPerDay && <strong className="block">{dose.dosesPerDay} lần/24 giờ{dose.loadingDose && " khi duy trì"}</strong>}
                        <span className="block first-letter:uppercase">{dose?.frequency ?? "Đối chiếu hướng dẫn liều"}</span>
                      </>
                    )}
                  </Cell>
                  <Cell label="Đường dùng và cách dùng" wide>
                    {dose?.route && <strong className="block first-letter:uppercase">{dose.route}</strong>}
                    {!renalAdjustment && item.administration && <span className="block">{item.administration}</span>}
                    {doseSources.length > 0 && (
                      <span className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-teal-800">
                        {doseSources.map((source) => (
                          <a key={source.id} href={source.url} className="underline underline-offset-2" target="_blank" rel="noreferrer">{source.short_title ?? source.org}</a>
                        ))}
                      </span>
                    )}
                  </Cell>
                  <Cell label="Đơn trị / phối hợp" wide>
                    <strong className="block text-teal-950">{group.relation(item)}</strong>
                    <span className="block">{item.text}</span>
                  </Cell>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}
