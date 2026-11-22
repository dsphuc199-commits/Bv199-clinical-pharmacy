import type { OutItem } from "@/lib/intl-rules";
import type { IntlGuideline } from "@/schema/intl-guideline";

export default function CholangitisCards({ items, sources }: { items: OutItem[]; sources: IntlGuideline["sources"] }) {
  if (!items.length) return null;
  return (
    <ul className={`m-0 grid list-none gap-2 p-0${items.length > 1 ? " lg:grid-cols-2" : ""}`}>
      {items.map((item) => {
        const doseSources = sources.filter((source) => source.id.startsWith("dose-") && item.source_ids.includes(source.id));
        return (
          <li key={`${item.role}-${item.ref}-${item.text}`} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 text-sm leading-relaxed">
            <strong className="block text-slate-900">{item.role}</strong>
            {item.dose && <p className="m-0 mt-1 font-semibold text-teal-900">{item.dose}</p>}
            {item.administration && <p className="m-0 mt-1 text-slate-700">{item.administration}</p>}
            <p className="m-0 mt-1 text-slate-700">{item.text}</p>
            {doseSources.length > 0 && (
              <p className="m-0 mt-2 flex flex-wrap items-baseline gap-x-2 text-xs text-slate-600">
                <span>Nguồn liều và cách dùng</span>
                {doseSources.map((source) => (
                  <a key={source.id} className="font-semibold text-teal-800 underline underline-offset-2" href={source.url} target="_blank" rel="noreferrer">
                    {source.short_title ?? source.org}
                  </a>
                ))}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
