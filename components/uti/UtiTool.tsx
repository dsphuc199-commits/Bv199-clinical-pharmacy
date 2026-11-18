"use client";
/* Công cụ chọn kháng sinh điều trị nhiễm khuẩn tiết niệu: chọn tuần tự, kết quả trên một thẻ. */
import { useMemo, useState } from "react";
import { RotateCcw, Search, Printer } from "lucide-react";
import { UTI_BRIEFS } from "@/data/uti-antibiotics/briefs";
import { TIER_LABEL } from "@/data/uti-antibiotics/config";
import type { Condition, PublicRegimen } from "@/data/uti-antibiotics/types";
import { formsOf, populationsOf, resolveCondition, searchConditions, sitesOf } from "@/lib/uti/flow";

type Props = {
  conditions: Condition[];
  regimens: PublicRegimen[];
  config: { sources: readonly string[]; citedSources: readonly string[]; effectiveStatus: string; disclaimer: string };
  /* Hướng dẫn hiệp hội quốc tế dùng ở tab Quốc tế và Đối chiếu của mặt bệnh. */
  intlSources?: { label: string; url?: string }[];
  /* Nhúng vào tab Hướng dẫn Việt Nam của trang phác đồ kinh nghiệm. */
  embedded?: boolean;
  initial?: { site: string; form?: string };
  scopeNote?: string;
};

function Choice({ step, title, options, value, onPick }: { step: number; title: string; options: string[]; value: string | null; onPick: (v: string) => void }) {
  return (
    <fieldset className="uti-step">
      <legend><span>{step}</span>{title}</legend>
      <div className="uti-opts">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onPick(o)}>{o}</button>
        ))}
      </div>
    </fieldset>
  );
}

export default function UtiTool({ conditions, regimens, config, intlSources = [], embedded = false, initial, scopeNote }: Props) {
  const Root = embedded ? "div" : "main";
  const [site, setSite] = useState<string | null>(initial?.site ?? null);
  const [form, setForm] = useState<string | null>(initial?.form ?? null);
  const [population, setPopulation] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const forms = site ? formsOf(conditions, site) : [];
  const populations = site && form ? populationsOf(conditions, site, form) : [];
  const condition = site && form ? resolveCondition(conditions, site, form, population) : null;
  const rows = condition ? regimens.filter((r) => r.conditionId === condition.id) : [];
  const hits = useMemo(() => searchConditions(conditions, regimens, query), [conditions, regimens, query]);

  const briefs = site ? UTI_BRIEFS[site] ?? [] : [];

  const reset = () => { setSite(initial?.site ?? null); setForm(initial?.form ?? null); setPopulation(null); setQuery(""); };
  const open = (c: Condition) => { setSite(c.group); setForm(c.form); setPopulation(c.population); setQuery(""); };

  return (
    <Root className={`uti-page${embedded ? " uti-embedded" : ""}`}>
      <header className="uti-head">
        {!embedded && <h1>Kháng sinh điều trị nhiễm khuẩn tiết niệu</h1>}
        <div className="uti-tools">
          <label className="uti-search">
            <Search size={16} aria-hidden />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kháng sinh hoặc thể bệnh" aria-label="Tìm kháng sinh hoặc thể bệnh" />
          </label>
          <button type="button" className="uti-btn" onClick={reset}><RotateCcw size={15} aria-hidden /> Đặt lại</button>
          <button type="button" className="uti-btn" onClick={() => window.print()}><Printer size={15} aria-hidden /> In</button>
        </div>
      </header>

      {query.trim() && (
        <ul className="uti-hits">
          {hits.map((c) => <li key={c.id}><button type="button" onClick={() => open(c)}>{c.name}</button></li>)}
          {!hits.length && <li className="uti-empty">Không tìm thấy kháng sinh hoặc thể bệnh phù hợp.</li>}
        </ul>
      )}

      {scopeNote && <p className="uti-scope">{scopeNote}</p>}

      <section className="uti-flow">
        <Choice step={1} title="Vị trí nhiễm khuẩn" options={sitesOf(conditions)} value={site} onPick={(v) => { setSite(v); setForm(null); setPopulation(null); }} />
        {site && <Choice step={2} title="Thể bệnh, mức độ" options={forms} value={form} onPick={(v) => { setForm(v); setPopulation(null); }} />}
        {site && form && populations.length > 1 && <Choice step={3} title="Đối tượng" options={populations} value={population} onPick={setPopulation} />}
      </section>

      {condition && (
        <article className="uti-card">
          <h2>{condition.name}{condition.nameEn && <span> ({condition.nameEn})</span>}</h2>
          {(condition.classification || condition.severity) && (
            <p className="uti-tags">{[condition.classification, condition.severity].filter(Boolean).map((t) => <span key={t}>{t}</span>)}</p>
          )}
          {rows.length > 0 && (
            <>
              {condition.choiceRule && <p className="uti-rule">{condition.choiceRule}</p>}
              <div className="uti-table">
                <table>
                  <thead><tr><th>Bậc</th><th>Kháng sinh</th><th>Liều và đường dùng</th><th>Thời gian</th><th>Ghi chú</th></tr></thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td data-label="Bậc">{r.tier && <span className={`uti-tier uti-tier-${r.tier}`}>{TIER_LABEL[r.tier]}</span>}</td>
                        <td data-label="Kháng sinh"><b>{r.antibiotic}</b></td>
                        <td data-label="Liều và đường dùng">
                          {r.dose && <div>{r.dose}</div>}
                          {r.route && <div className="uti-sub">{r.route}</div>}
                          {r.interval && <div className="uti-sub">{r.interval}</div>}
                        </td>
                        <td data-label="Thời gian">{r.duration}</td>
                        <td data-label="Ghi chú">
                          {r.applicability && <div><b>{r.applicability}</b></div>}
                          {r.note && <div>{r.note}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {condition.notes.length > 0 && (
            <section className="uti-notes">
              <h3>Lưu ý lâm sàng</h3>
              <ul>{condition.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            </section>
          )}
          <p className="uti-warn">{config.disclaimer}</p>
        </article>
      )}

      {briefs.length > 0 && (
        <section className="uti-briefs" aria-label="Tổng quan">
          {briefs.map((b) => (
            <div key={b.label} className="uti-brief">
              <h3>{b.label}</h3>
              <ul>{b.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          ))}
        </section>
      )}

      <footer className="uti-foot">
        <h3>Nguồn và đối chiếu</h3>
        <h4>Bộ Y tế</h4>
        <ol>{config.sources.map((s) => <li key={s}>{s}</li>)}</ol>
        <h4>Hiệp hội chuyên ngành trong tài liệu tham khảo của Quyết định 708/QĐ-BYT</h4>
        <ol start={config.sources.length + 1}>{config.citedSources.map((s) => <li key={s}>{s}</li>)}</ol>
        {intlSources.length > 0 && (
          <>
            <h4>Hiệp hội quốc tế (tab Quốc tế và Đối chiếu)</h4>
            <ol start={config.sources.length + config.citedSources.length + 1}>
              {intlSources.map((s) => <li key={s.label}>{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a> : s.label}</li>)}
            </ol>
          </>
        )}
        <p>{config.effectiveStatus}</p>
      </footer>

      <style>{`
        .uti-page { max-width: 1040px; margin: 0 auto; padding: 16px; color: #10243e; font-size: 14px; line-height: 1.55; display: grid; gap: 12px; }
        .uti-head { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; }
        .uti-head h1 { margin: 0; font-size: 21px; color: #0b3a5b; }
        .uti-tools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .uti-search { display: flex; align-items: center; gap: 6px; min-height: 38px; padding: 0 10px; border: 1px solid #b9cdd6; border-radius: 8px; background: #fff; color: #4b6576; }
        .uti-search input { border: 0; outline: 0; font: inherit; width: 220px; max-width: 52vw; background: transparent; color: #10243e; }
        .uti-btn { display: inline-flex; align-items: center; gap: 6px; min-height: 38px; padding: 0 12px; border: 1px solid #b9cdd6; border-radius: 8px; background: #fff; color: #0b3a5b; font: inherit; font-weight: 700; cursor: pointer; }
        .uti-hits { margin: 0; padding: 6px; list-style: none; border: 1px solid #cfdde6; border-radius: 10px; background: #fff; display: grid; gap: 2px; }
        .uti-hits button { width: 100%; text-align: left; border: 0; background: transparent; padding: 7px 8px; border-radius: 6px; font: inherit; color: #0b3a5b; cursor: pointer; }
        .uti-hits button:hover { background: #eef6fa; }
        .uti-empty { padding: 7px 8px; color: #4b6576; }
        .uti-flow { display: grid; gap: 10px; border: 1px solid #cfdde6; border-radius: 12px; padding: 12px; background: #fff; }
        .uti-step { border: 0; margin: 0; padding: 0; min-width: 0; }
        .uti-step legend { padding: 0; margin-bottom: 6px; font-weight: 800; color: #0b3a5b; display: flex; align-items: center; gap: 7px; }
        .uti-step legend span { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #0b6b8a; color: #fff; font-size: 12px; }
        .uti-opts { display: flex; flex-wrap: wrap; gap: 6px; }
        .uti-opts button { min-height: 38px; padding: 5px 12px; border: 1px solid #b9cdd6; border-radius: 8px; background: #fff; color: #10243e; font: inherit; text-align: left; cursor: pointer; }
        .uti-opts button[aria-pressed=true] { background: #0b6b8a; border-color: #0b6b8a; color: #fff; font-weight: 700; }
        .uti-card { border: 1px solid #cfdde6; border-radius: 12px; padding: 14px; background: #fff; display: grid; gap: 10px; min-width: 0; }
        .uti-card h2 { margin: 0; font-size: 17px; color: #0b3a5b; }
        .uti-card h2 span { font-weight: 400; font-size: 14px; color: #4b6576; }
        .uti-tags { margin: 0; display: flex; flex-wrap: wrap; gap: 6px; }
        .uti-tags span { font-size: 12px; font-weight: 700; color: #1d4f8a; background: #e6f0fb; border-radius: 6px; padding: 1px 8px; }
        .uti-rule { margin: 0; font-weight: 700; color: #0b6b3a; }
        .uti-table { overflow-x: auto; }
        .uti-table table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .uti-table th { text-align: left; padding: 7px 8px; background: #eef6fa; color: #0b3a5b; white-space: nowrap; }
        .uti-table td { padding: 8px; border-top: 1px solid #e3eaf0; vertical-align: top; }
        .uti-sub { color: #4b6576; font-size: 12.5px; }
        .uti-tier { display: inline-block; font-size: 12px; font-weight: 700; border-radius: 6px; padding: 1px 7px; background: #eceff1; color: #455a64; white-space: nowrap; }
        .uti-tier-first-line { background: #e8f5e9; color: #1b5e20; }
        .uti-tier-alternative { background: #fff3d6; color: #8a5a00; }
        .uti-tier-culture-guided { background: #e6f0fb; color: #1d4f8a; }
        .uti-notes h3 { margin: 0 0 4px; font-size: 14px; color: #0b3a5b; }
        .uti-notes ul { margin: 0; padding-left: 18px; display: grid; gap: 4px; }
        .uti-warn { margin: 0; padding: 8px 10px; border: 1px solid #f6cfb5; border-radius: 8px; background: #fff4ed; color: #7c2d12; font-size: 13px; }
        .uti-foot { border-top: 1px solid #e3eaf0; padding-top: 8px; font-size: 12.5px; color: #4b6576; }
        .uti-foot h3 { margin: 0 0 4px; font-size: 13px; color: #0b3a5b; }
        .uti-foot h4 { margin: 8px 0 3px; font-size: 12.5px; font-weight: 700; color: #17364b; }
        .uti-foot ol { margin: 0 0 6px; padding-left: 20px; list-style: decimal; }
        .uti-foot li { display: list-item; margin-bottom: 3px; }
        .uti-foot p { margin: 0; }
        .uti-embedded { max-width: none; padding: 0; }
        .uti-embedded .uti-head { justify-content: flex-end; }
        .uti-scope { margin: 0; padding: 8px 10px; border-left: 3px solid #0b6b8a; border-radius: 6px; background: #eef6fa; color: #0b3a5b; font-weight: 600; }
        .uti-briefs { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        .uti-brief { min-width: 0; border: 1px solid #cfdde6; border-top: 3px solid #0b6b8a; border-radius: 10px; padding: 10px 12px; background: #fff; }
        .uti-brief h3 { margin: 0 0 6px; font-size: 13px; font-weight: 800; color: #0b3a5b; }
        .uti-brief ul { margin: 0; padding-left: 17px; display: grid; gap: 4px; font-size: 13px; list-style: disc; }
        .uti-brief li, .uti-notes li { display: list-item; }
        .uti-notes h3, .uti-foot h3 { font-weight: 800; }
        .uti-notes ul { list-style: disc; }
        @media (max-width: 720px) {
          .uti-table thead { display: none; }
          .uti-table table, .uti-table tbody, .uti-table tr, .uti-table td { display: block; width: 100%; }
          .uti-table tr { border-top: 1px solid #cfdde6; padding: 6px 0; }
          .uti-table td { border: 0; padding: 3px 0; }
          .uti-table td:empty { display: none; }
          .uti-table td::before { content: attr(data-label); display: block; font-size: 11.5px; font-weight: 700; color: #4b6576; }
        }
        @media print {
          .uti-tools, .uti-hits, .uti-flow { display: none; }
          .uti-page { max-width: none; padding: 0; font-size: 11px; }
          .uti-card { border: 0; padding: 0; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>
    </Root>
  );
}
