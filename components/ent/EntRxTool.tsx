"use client";
/*
  Công cụ chọn kháng sinh Tai Mũi Họng trong tab Quốc tế (khung sa24 dùng chung).
  Bản gọn: chỉ thuốc – liều – cách dùng – thời gian – nguồn; các phần căn cứ, đối chiếu gộp vào một khối đóng.
  Mọi dòng lấy từ dữ liệu có trích dẫn qua decide(); không sinh nội dung tự do.
*/
import { useMemo, useState, type ReactNode } from "react";
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
  no_primary: "Phác đồ tham khảo (không có hướng dẫn hội chuyên môn)",
};

const src = (id: string) => SOURCES.find((s) => s.id === id);
const short = (s?: Source) => (s ? `${s.org.replace(" (DailyMed)", "").replace("UCSF IDMP", "UCSF")} ${s.year}` : "");
const tip = (c: Citation) => `${src(c.sourceId)?.title ?? ""}. ${c.locator}`;

/** Nhãn nguồn gọn; vị trí trong nguồn ở chú thích khi rê chuột/nhấn giữ. */
function Src({ c, prefix }: { c: Citation; prefix?: string }) {
  const s = src(c.sourceId);
  const cls = s?.tier === "A" ? "sa24-g-a" : s?.tier === "B" ? "sa24-g-c" : "sa24-g-gps";
  return <span className={`sa24-g ${cls}`} title={tip(c)}>{prefix}{short(s)}</span>;
}

function role(d: Dose): { label: string; cls?: string } {
  if (d.role === "comparison") return { label: short(src(d.citation.sourceId)) };
  if (d.addOn) return { label: "Phối hợp thêm", cls: "is-pref" };
  if (d.line === "failure" || d.line === "failure_alternative") return { label: "Thất bại điều trị" };
  if (d.line === "alternative_allergy" || (d.allergy && !d.allergy.includes("none"))) return { label: "Dị ứng beta-lactam", cls: "is-alg" };
  if (d.line === "severe") return { label: "Nặng, nội trú" };
  return { label: "Ưu tiên", cls: "is-pref" };
}

function Rows({ doses, computed, showCond }: { doses: Dose[]; computed: { doseId: string; text: string }[]; showCond?: boolean }) {
  if (!doses.length) return null;
  return (
    <table className="sa24-rx has-dose ent-tab">
      <thead><tr><th scope="col">Thuốc</th><th scope="col">Liều dùng – cách dùng</th><th scope="col">Thời gian</th><th scope="col">Nguồn</th></tr></thead>
      <tbody>
        {doses.map((d) => {
          const r = role(d);
          const calc = computed.find((c) => c.doseId === d.id)?.text;
          return (
            <tr key={d.id} className={r.cls}>
              <th scope="row"><span className="ent-role">{r.label}</span>{d.addOn ? "+ " : ""}{d.drug}</th>
              <td>
                <div><b>{d.dose}</b>{d.interval ? `, ${d.interval}` : ""}</div>
                <div className="ent-sub">{d.route}{d.max ? ` · tối đa ${d.max}` : ""}</div>
                {calc && <div className="ent-calc">{calc}</div>}
                {d.caution && <div className="ent-caution">{d.caution}</div>}
                {showCond && d.condition && <div className="ent-sub">{d.condition}</div>}
                {d.link && <Link className="ent-link" href={d.link.href}>{d.link.label}</Link>}
              </td>
              <td className="ent-dur">{d.duration ?? ""}</td>
              <td className="ent-src">
                {d.choiceCitation && <Src c={d.choiceCitation} prefix="Thuốc: " />}
                <Src c={d.citation} prefix={d.choiceCitation ? "Liều: " : ""} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Notes({ items }: { items: Statement[] }) {
  return <ul className="ent-notes">{items.map((s) => <li key={s.id}>{s.text} <Src c={s.citation} /></li>)}</ul>;
}

export default function EntRxTool({ id, population }: { id: string; population?: ReactNode }) {
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
  const ready = !(noPrimary && missing.length) && !!r.decision;
  const failCmp = r.comparison.filter((x) => x.line === "failure" || x.line === "failure_alternative");
  const main = noPrimary ? (missing.length ? [] : r.reference.doses) : [...r.first, ...r.alternatives, ...r.other];
  const fail = noPrimary ? [] : [...r.failure, ...failCmp];
  const cmp = r.comparison.filter((x) => !failCmp.includes(x));
  const rule = r.decision ? d.rules.find((x) => x.id === r.decision!.ruleId) : undefined;
  const why = (rule?.statementIds ?? []).map((sid) => d.statements.find((s) => s.id === sid)).filter((s): s is Statement => !!s && s.status === "EXTRACTED");
  const flags = r.redFlags.filter((f) => f.status === "EXTRACTED" && (f.role === "primary" || noPrimary));
  const stmts = d.statements.filter((s) => s.status === "EXTRACTED" && !why.includes(s));

  return (
    <article className="sa24 ent-rx">
      <h3>{res.page.title}</h3>

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
        {!ready ? (
          <p className="ent-prompt">Chọn {missing.length ? missing.join(", ") : "các yếu tố ở trên"} để xem phác đồ.</p>
        ) : (
          <>
            <div className="sa24-dx">
              <p><b>Quyết định</b> {DECISION[r.decision!.value]}</p>
              {main.length > 0 && <p><b>Phác đồ</b> {regimenSummary(main)}</p>}
            </div>
            <Rows doses={main} computed={r.computed} />
            {fail.length > 0 && (<><h4>Thất bại điều trị</h4><Rows doses={fail} computed={r.computed} /></>)}
            {!main.length && !fail.length && !["no_antibiotic", "test_first"].includes(r.decision!.value) && <p className="sa24-tip">Không có dòng thuốc phù hợp với lựa chọn hiện tại.</p>}
          </>
        )}
        {flags.length > 0 && (
          <div className="ent-flags"><b>Chuyển tuyến/hội chẩn khi:</b><Notes items={flags} /></div>
        )}
      </section>

      <details className="sa24-more">
        <summary>Căn cứ và đối chiếu</summary>
        {why.length > 0 && (<><h5>Căn cứ của quyết định</h5><Notes items={why} /></>)}
        {cmp.length > 0 && (<><h5>Liều theo các hướng dẫn đối chiếu</h5><Rows doses={cmp} computed={r.computed} showCond /></>)}
        {r.conflicts.length > 0 && (
          <><h5>Chỗ các hướng dẫn khác nhau</h5>
            <ul className="ent-notes">{r.conflicts.map((c) => <li key={c.id}><b>{c.topic}:</b> {c.sides.map((s, i) => <span key={s.sourceId}>{i ? " · " : ""}<Src c={s.citation} /> {s.text}</span>)}</li>)}</ul>
          </>
        )}
        {stmts.length > 0 && (<><h5>Khuyến cáo khác</h5><Notes items={stmts} /></>)}
        {noPrimary && (d.evidenceGap ?? []).length > 0 && (<><h5>Vì sao chỉ là tham khảo</h5><ul className="ent-notes">{d.evidenceGap!.map((g) => <li key={g}>{g}</li>)}</ul></>)}
      </details>

      <p className="sa24-src">
        Nguồn chính: {noPrimary ? "không có hướng dẫn hội chuyên môn; thuốc theo UCSF, liều người lớn theo thông tin kê đơn FDA" : d.primarySources.filter((sid) => src(sid)?.access !== "paywalled").map((sid) => `${src(sid)!.title} (${short(src(sid))})`).join("; ")}. Chưa phải phác đồ BV199 phê duyệt. <Link href={`/ent/${res.page.id}`}>Trang đầy đủ</Link>
      </p>
      <RxToolStyle />
      <style>{`
        .ent-rx h3 { margin: 0; }
        .ent-rx h5 { margin: 10px 0 4px; font-size: 13px; font-weight: 800; color: #0b3a5b; }
        .ent-rx .ent-num { width: 140px; border: 1px solid #cfdde6; border-radius: 10px; padding: 7px 10px; font: inherit; font-size: 13.5px; }
        .ent-rx .ent-prompt { margin: 0; font-size: 13.5px; color: #33505f; }
        .ent-rx .ent-tab thead th { font-size: 12px; font-weight: 800; color: #4b6576; background: #f4f8fa; border-top: 0; }
        .ent-rx .ent-tab th[scope=row] { width: 24%; color: #10243e; font-size: 13.5px; }
        .ent-rx .ent-role { display: block; font-size: 11.5px; font-weight: 800; color: #0b6b3a; text-transform: uppercase; letter-spacing: .02em; }
        .ent-rx tr.is-alg .ent-role { color: #9a3412; }
        .ent-rx .ent-dur { width: 14%; font-size: 13px; color: #33505f; }
        .ent-rx .ent-src { width: 150px; display: table-cell; }
        .ent-rx .ent-src .sa24-g { display: inline-block; margin: 0 4px 3px 0; white-space: normal; }
        .ent-rx .ent-sub { font-size: 12.5px; color: #4b6576; }
        .ent-rx .ent-calc { font-size: 13px; color: #1d4f8a; font-weight: 800; }
        .ent-rx .ent-caution { font-size: 12.5px; color: #9a3412; font-weight: 600; }
        .ent-rx .ent-link { font-weight: 700; color: #087f89; font-size: 13px; }
        .ent-rx .ent-flags { border-top: 1px solid #dcebed; padding-top: 8px; font-size: 13px; color: #7c2d12; }
        .ent-rx .ent-notes { margin: 4px 0 0; padding-left: 18px; display: grid; gap: 5px; font-size: 13px; line-height: 1.55; color: #33505f; }
        .ent-rx .sa24-src a { color: #087f89; }
        @media (max-width: 640px) { .ent-rx .ent-tab thead { display: none; } .ent-rx .ent-dur:empty { display: none; } .ent-rx .ent-src { display: block; padding-top: 4px; } }
      `}</style>
    </article>
  );
}
