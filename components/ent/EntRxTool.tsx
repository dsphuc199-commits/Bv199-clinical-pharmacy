"use client";
/*
  Công cụ chọn kháng sinh Tai Mũi Họng trong tab Quốc tế – cùng bộ khung giao diện với các công cụ khác
  (sa24: thanh trình tự, hàng nút chọn, khối kết quả, bảng thuốc). Mọi dòng lấy từ dữ liệu có trích dẫn qua decide().
*/
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Citation, Decision, Disease, Dose, Source, Statement } from "@/types/ent";
import { decide } from "@/lib/ent/decide";
import { SOURCES, resolveDisease } from "@/data/ent";
import { RxToolStyle } from "@/components/antibiotics/empiric/rx-tool";
import { regimenSummary, visibleInputs } from "./QuickCard";

const DECISION: Record<Decision, string> = {
  antibiotic: "Chỉ định kháng sinh",
  antibiotic_or_observe: "Kháng sinh hoặc theo dõi chờ đợi – quyết định cùng người bệnh",
  antibiotic_or_refer: "Kháng sinh ngay hoặc chuyển chuyên khoa tai mũi họng",
  reassess_switch: "Đánh giá lại; xác nhận chẩn đoán thì đổi kháng sinh",
  no_antibiotic: "Không dùng kháng sinh",
  test_first: "Xét nghiệm trước khi quyết định",
  no_primary: "Không có hướng dẫn hội chuyên môn – phác đồ tham khảo",
};

const src = (id: string) => SOURCES.find((s) => s.id === id);
const short = (s?: Source) => (s ? `${s.org.replace(" (DailyMed)", "")} ${s.year}` : "");

function Cite({ c }: { c: Citation }) {
  const s = src(c.sourceId);
  return <details className="ent-cite"><summary>Xem chứng cứ</summary>{s?.title}. {c.locator}</details>;
}

function roleOf(d: Dose): { role: string; cls?: string } {
  if (d.role === "comparison") return { role: short(src(d.citation.sourceId)) };
  if (d.addOn) return { role: "Phối hợp thêm", cls: "is-pref" };
  if (d.line === "alternative_allergy" || (d.allergy && !d.allergy.includes("none"))) return { role: "Dị ứng beta-lactam", cls: "is-alg" };
  if (d.line === "failure") return { role: "Thất bại điều trị" };
  if (d.line === "failure_alternative") return { role: "Thay thế khi thất bại", cls: "is-alg" };
  if (d.line === "first" || d.line === "reference") return { role: "Ưu tiên", cls: "is-pref" };
  return { role: "Tình huống khác" };
}

function DoseTable({ doses, computed }: { doses: Dose[]; computed: { doseId: string; text: string }[] }) {
  if (!doses.length) return null;
  return (
    <table className="sa24-rx has-dose">
      <tbody>
        {doses.map((d) => {
          const r = roleOf(d);
          const calc = computed.find((c) => c.doseId === d.id)?.text;
          const grade = [d.strength, d.quality].filter(Boolean).join(" · ");
          return (
            <tr key={d.id} className={r.cls}>
              <th scope="row">{r.role}</th>
              <td className="sa24-drug">{d.drug}</td>
              <td className="sa24-dose">
                {d.dose}; {d.route}{d.interval ? `; ${d.interval}` : ""}{d.duration ? `; ${d.duration}` : ""}
                {d.max && <div className="ent-sub">Tối đa: {d.max}</div>}
                {calc && <div className="ent-calc">Tính theo cân nặng: {calc}</div>}
                {d.condition && <div className="ent-sub">Điều kiện: {d.condition}</div>}
                {d.note && <div className="ent-sub">{d.note}</div>}
                {d.link && <div><Link className="ent-link" href={d.link.href}>{d.link.label}</Link></div>}
                <Cite c={d.citation} />
              </td>
              <td className="sa24-gc">
                <span className={`sa24-g ${src(d.citation.sourceId)?.tier === "A" ? "sa24-g-a" : src(d.citation.sourceId)?.tier === "B" ? "sa24-g-c" : "sa24-g-gps"}`}>{short(src(d.citation.sourceId))}</span>
                {grade && <div className="ent-sub">{grade}</div>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function StList({ items }: { items: Statement[] }) {
  return (
    <ul className="sp-notes">
      {items.map((s) => (
        <li key={s.id}>{s.text}{(s.strength || s.quality) && <span className="ent-sub"> ({[s.strength, s.quality].filter(Boolean).join("; ")})</span>} <span className="sa24-g sa24-g-gps">{short(src(s.citation.sourceId))}</span><Cite c={s.citation} /></li>
      ))}
    </ul>
  );
}

export default function EntRxTool({ id, population }: { id: string; population?: React.ReactNode }) {
  const res = resolveDisease(id);
  const d = res?.data as Disease;
  const [inp, setInp] = useState<Record<string, string | number | boolean | undefined>>({});
  const set = (k: string, v: string | number | boolean | undefined) => setInp((p) => ({ ...p, [k]: v === "" ? undefined : v }));
  const { shown, eff } = useMemo(() => visibleInputs(d, inp), [d, inp]);
  const r = useMemo(() => decide(d, eff), [d, eff]);
  if (!res) return null;
  const noPrimary = d.primarySources.length === 0;
  const selects = shown.filter((s) => s.type !== "boolean");
  const checks = shown.filter((s) => s.type === "boolean");
  const missing = shown.filter((s) => s.type === "select" && eff[s.field] === undefined).map((s) => s.label);
  const rule = r.decision ? d.rules.find((x) => x.id === r.decision!.ruleId) : undefined;
  const why = (rule?.statementIds ?? []).map((sid) => d.statements.find((s) => s.id === sid)).filter((s): s is Statement => !!s && s.status === "EXTRACTED");
  const main = noPrimary ? (missing.length ? [] : r.reference.doses) : [...r.first, ...r.alternatives, ...r.failure, ...r.other];
  const allFlags = r.redFlags.filter((f) => f.status === "EXTRACTED");
  const topFlags = allFlags.filter((f) => f.role === "primary" || f.role === "diagnosis" || (noPrimary && allFlags.every((x) => x.role !== "primary")));
  const flags = topFlags.length ? topFlags : allFlags;
  const moreFlags = allFlags.filter((f) => !flags.includes(f));
  const stmts = d.statements.filter((s) => s.status === "EXTRACTED" && !(noPrimary && s.kind === "reference_note"));
  const refNotes = noPrimary ? r.reference.statements.filter((s) => s.status === "EXTRACTED") : [];
  const primaryNames = noPrimary ? "Không có (tham khảo: UCSF; liều người lớn theo nhãn FDA)" : d.primarySources.filter((sid) => src(sid)?.access !== "paywalled").map((sid) => short(src(sid))).join(", ");
  const steps = noPrimary ? ["Đối tượng", "Nơi điều trị, dị ứng", "Phác đồ tham khảo", "Hội chẩn, chuyển viện"] : ["Tiêu chuẩn, mức độ", "Quyết định kháng sinh", "Thuốc và liều", "Dị ứng, thất bại", "Đối chiếu nguồn"];
  const groupOf = (x: Dose) => (x.line === "failure" || x.line === "failure_alternative" ? "Thất bại điều trị" : "Phác đồ");
  const groups = [...new Set(main.map(groupOf))];

  return (
    <article className="sa24 ent-rx">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo chẩn đoán</p>
        <h3>{res.page.title} <span className="ent-en">({res.page.titleEn})</span></h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
      </header>

      {flags.length > 0 && (
        <div className="sa24-warn"><b>Cờ đỏ – chuyển tuyến/hội chẩn:</b>
          <ul className="sp-notes">{flags.map((f) => <li key={f.id}>{f.text} <span className="sa24-g sa24-g-gps">{short(src(f.citation.sourceId))}</span><Cite c={f.citation} /></li>)}</ul>
        </div>
      )}

      <div className="sa24-form">
        {population}
        {selects.map((s) => (
          <div className="sa24-row" key={s.field}>
            <div className="sa24-lab">{s.label}{s.unit ? ` (${s.unit})` : ""}</div>
            <div className="sa24-ctl">
              {s.type === "select" ? (
                <div className="sa24-seg" role="group" aria-label={s.label}>
                  {s.options!.map((o) => (
                    <button key={o.value} type="button" className={eff[s.field] === o.value ? "on" : undefined} aria-pressed={eff[s.field] === o.value} onClick={() => set(s.field, eff[s.field] === o.value ? undefined : o.value)}>{o.label}</button>
                  ))}
                </div>
              ) : (
                <input className="ent-num" type="number" inputMode="decimal" min={s.min} max={s.max} aria-label={s.label} value={(inp[s.field] as number | undefined) ?? ""} onChange={(e) => set(s.field, e.target.value === "" ? undefined : Number(e.target.value))} />
              )}
            </div>
          </div>
        ))}
        {checks.length > 0 && (
          <div className="sa24-row">
            <div className="sa24-lab">Yếu tố lâm sàng</div>
            <div className="sa24-ctl">
              {checks.map((s) => <label key={s.field} className="sa24-chk"><input type="checkbox" checked={inp[s.field] === true} onChange={(e) => set(s.field, e.target.checked ? true : undefined)} /> {s.label}</label>)}
            </div>
          </div>
        )}
      </div>
      {r.errors.length > 0 && <p className="sa24-warn">{r.errors.join("; ")}</p>}

      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Quyết định</b> {r.decision && !(noPrimary && missing.length) ? DECISION[r.decision.value] : `Chọn: ${missing.join(", ") || "các yếu tố ở trên"}`}</p>
          {main.length > 0 && <p><b>Phác đồ</b> {regimenSummary(main.filter((x) => groupOf(x) === "Phác đồ")) || regimenSummary(main)}</p>}
          <p><b>Hướng dẫn</b> {primaryNames}</p>
        </div>
        {noPrimary && main.length > 0 && <p className="sa24-lead">Phác đồ tham khảo của cơ sở (UCSF), không phải khuyến cáo hội chuyên môn. Mỗi dòng “Ưu tiên” hoặc “Dị ứng beta-lactam” là một lựa chọn; dòng “Phối hợp thêm” dùng đồng thời.</p>}
        {groups.map((g) => (
          <div key={g}>
            <h4>{g}</h4>
            <DoseTable doses={main.filter((x) => groupOf(x) === g)} computed={r.computed} />
          </div>
        ))}
        {!noPrimary && r.decision && !main.length && !["no_antibiotic", "test_first"].includes(r.decision.value) && (
          <p className="sa24-tip">Không có dòng thuốc phù hợp với lựa chọn hiện tại; đánh giá lâm sàng và hội chẩn.</p>
        )}
        {why.length > 0 && (
          <details className="sa24-more"><summary>Vì sao chọn phác đồ này?</summary><StList items={why} /></details>
        )}
      </section>

      {moreFlags.length > 0 && (
        <details className="sa24-more"><summary>Cờ đỏ – các hướng dẫn đối chiếu ({moreFlags.length})</summary>
          <ul className="sp-notes">{moreFlags.map((f) => <li key={f.id}>{f.text} <span className="sa24-g sa24-g-gps">{short(src(f.citation.sourceId))}</span><Cite c={f.citation} /></li>)}</ul>
        </details>
      )}
      {r.comparison.length > 0 && (
        <details className="sa24-more"><summary>Đối chiếu nguồn khác ({r.comparison.length})</summary><DoseTable doses={r.comparison} computed={r.computed} /></details>
      )}
      {r.conflicts.length > 0 && (
        <details className="sa24-more"><summary>Chỗ các nguồn khác nhau ({r.conflicts.length})</summary>
          <div className="ent-conf">
            {r.conflicts.map((c) => (
              <div key={c.id} className="ent-conf-row"><div className="ent-conf-t">{c.topic}</div>
                <div className="ent-conf-cols">{c.sides.map((s) => <div key={s.sourceId}><b>{short(src(s.sourceId))}</b><div>{s.text}</div><Cite c={s.citation} /></div>)}</div>
              </div>
            ))}
          </div>
        </details>
      )}
      {stmts.length > 0 && (
        <details className="sa24-more"><summary>Khuyến cáo và bằng chứng ({stmts.length})</summary><StList items={stmts} /></details>
      )}
      {refNotes.length > 0 && (
        <details className="sa24-more"><summary>Ghi chú tham khảo UCSF ({refNotes.length})</summary><StList items={refNotes} /></details>
      )}
      {noPrimary && (d.evidenceGap ?? []).length > 0 && (
        <details className="sa24-more"><summary>Vì sao chỉ là tham khảo</summary><ul className="sp-notes">{d.evidenceGap!.map((g) => <li key={g}>{g}</li>)}</ul></details>
      )}

      <p className="sa24-src">
        Nguồn: {[...new Set([...d.primarySources, ...(d.diagnosisSources ?? []), ...d.comparisonSources, ...d.referenceSources])].map((sid) => src(sid)).filter(Boolean).map((s) => `${s!.title} (${s!.org}, ${s!.year})`).join("; ")}.
        {" "}Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt; chưa đối chiếu antibiogram bệnh viện. <Link href={`/ent/${res.page.id}`}>Mở trang đầy đủ</Link>
      </p>
      <RxToolStyle />
      <style>{`
        .ent-rx .ent-en { font-weight: 400; color: #4b6576; font-size: 14px; }
        .ent-rx .sp-notes { margin: 4px 0 0; padding-left: 18px; display: grid; gap: 6px; font-size: 13px; line-height: 1.6; color: #33505f; }
        .ent-rx .ent-sub { font-size: 12px; color: #4b6576; line-height: 1.5; }
        .ent-rx .ent-calc { font-size: 12.5px; color: #1d4f8a; font-weight: 700; }
        .ent-rx .ent-link { font-weight: 700; color: #087f89; font-size: 13px; }
        .ent-rx .ent-cite { font-size: 11.5px; color: #4b6576; }
        .ent-rx .ent-cite > summary { cursor: pointer; color: #087f89; }
        .ent-rx .ent-num { width: 140px; border: 1px solid #cfdde6; border-radius: 10px; padding: 7px 10px; font: inherit; font-size: 13.5px; }
        .ent-rx .ent-conf { display: grid; gap: 8px; }
        .ent-rx .ent-conf-row { border: 1px solid #e3eaf0; border-radius: 10px; padding: 8px 10px; font-size: 13px; }
        .ent-rx .ent-conf-t { font-weight: 800; color: #0b3a5b; margin-bottom: 4px; }
        .ent-rx .ent-conf-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; }
        .ent-rx .sa24-src a { color: #087f89; }
        .ent-rx .sa24-rx th { width: 17%; }
        .ent-rx .sa24-rx.has-dose .sa24-drug { width: 18%; }
        .ent-rx .sa24-rx .sa24-gc { width: 150px; white-space: normal; }
      `}</style>
    </article>
  );
}
