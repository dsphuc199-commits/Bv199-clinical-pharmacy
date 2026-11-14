"use client";
/* Hiển thị chung cho JSON "Hướng dẫn quốc tế" (schema/intl-guideline.ts) theo đúng khung công cụ tab Quốc tế
   (rx-tool.tsx). Dữ liệu parse bằng zod; lỗi parse → không render dữ liệu, chỉ báo lỗi.
   Logic điều kiện dùng chung với scripts qua lib/intl-rules.ts.
   Cờ NEXT_PUBLIC_SHOW_DRAFT_GUIDELINES (mặc định bật): "0" → ẩn nội dung bản nháp AI. */
import { Fragment, useMemo, useState } from "react";
import { defaultState, effectiveState, isVisible, resolve, type AxisState, type AxisVal, type OutItem } from "@/lib/intl-rules";
import { intlGuideline, type IntlAxis, type IntlGuideline } from "@/schema/intl-guideline";
import { Row, Rx, RxToolStyle, Seg } from "./rx-tool";

const SHOW_DRAFT = process.env.NEXT_PUBLIC_SHOW_DRAFT_GUIDELINES !== "0";
const POP_TEXT: Record<string, string> = { adult: "người lớn", child: "trẻ em", neonate: "sơ sinh" };
const REVIEW_TEXT: Record<string, string> = { pharmacist_verified: "Dược sĩ đã thẩm định", physician_verified: "Bác sĩ đã thẩm định" };

function AxisControl({ a, value, set }: { a: IntlAxis; value: AxisVal; set: (v: AxisVal) => void }) {
  if (a.type === "seg") return <Seg label={a.label} value={value as string} onChange={set} options={a.options ?? []} />;
  if (a.type === "select")
    return (
      <select className="igv-sel" value={value as string} onChange={(e) => set(e.target.value)} aria-label={a.label}>
        {(a.options ?? []).map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    );
  return null;
}
function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}

/** Vẽ các trục placement "form": gom checkbox liền nhau cùng group vào một hàng; multi tách hàng theo option.group. */
function Form({ g, raw, eff, set }: { g: IntlGuideline; raw: AxisState; eff: AxisState; set: (id: string, v: AxisVal) => void }) {
  const rows: React.ReactNode[] = [];
  const axes = g.axes.filter((a) => a.placement === "form" && isVisible(g.axes, eff, a.id));
  for (let i = 0; i < axes.length; i++) {
    const a = axes[i];
    if (a.type === "check") {
      const label = a.group ?? a.label;
      const run: IntlAxis[] = [a];
      while (i + 1 < axes.length && axes[i + 1].type === "check" && (axes[i + 1].group ?? axes[i + 1].label) === label && a.group) run.push(axes[++i]);
      rows.push(
        <Row key={`c-${a.id}`} label={label}>
          {run.map((x) => <Chk key={x.id} on={eff[x.id] === true} set={(v) => set(x.id, v)}>{x.label}</Chk>)}
          {run.map((x) => x.tip && <p key={`t-${x.id}`} className="sa24-tip">{x.tip}</p>)}
        </Row>,
      );
      continue;
    }
    if (a.type === "multi") {
      const sel = (Array.isArray(eff[a.id]) ? eff[a.id] : []) as string[];
      const groups = [...new Set((a.options ?? []).map((o) => o.group ?? a.label))];
      groups.forEach((gr, gi) =>
        rows.push(
          <Row key={`m-${a.id}-${gr}`} label={gr}>
            {(a.options ?? []).filter((o) => (o.group ?? a.label) === gr).map((o) => (
              <label key={o.id} className="sa24-chk">
                <input type="checkbox" checked={sel.includes(o.id)} onChange={(e) => set(a.id, e.target.checked ? [...sel, o.id] : sel.filter((x) => x !== o.id))} />{" "}
                {o.label}{o.suffix ? ` ${o.suffix}` : ""}
              </label>
            ))}
            {gi === groups.length - 1 && a.tip && <p className="sa24-tip">{a.tip}</p>}
          </Row>,
        ),
      );
      continue;
    }
    rows.push(
      <Row key={a.id} label={a.label}>
        <AxisControl a={a} value={raw[a.id] ?? eff[a.id]} set={(v) => set(a.id, v)} />
        {a.tip && <p className="sa24-tip">{a.tip}</p>}
      </Row>,
    );
  }
  return <div className="sa24-form">{rows}</div>;
}

function Section({ s, g, eff, set }: { s: ReturnType<typeof resolve>["after"][number]; g: IntlGuideline; eff: AxisState; set: (id: string, v: AxisVal) => void }) {
  return (
    <>
      {s.title && <h4>{s.title}</h4>}
      {s.lead && <p className="sa24-lead">{s.lead}</p>}
      {(s.controls ?? []).map((cid) => {
        const a = g.axes.find((x) => x.id === cid);
        return a ? <Row key={cid} label={a.label}><AxisControl a={a} value={eff[cid]} set={(v) => set(cid, v)} /></Row> : null;
      })}
      {s.antibiogram_reminder && <p className="igv-abg">Đối chiếu Antibiogram BV199: {s.antibiogram_reminder}</p>}
      <Rx items={s.items as OutItem[]} />
      {s.bullets.length > 0 && <ul className="igv-notes">{s.bullets.map((n) => <li key={n.text}>{n.text}</li>)}</ul>}
    </>
  );
}

function Sources({ g }: { g: IntlGuideline }) {
  return (
    <details className="igv-sources">
      <summary>Nguồn ({g.sources.length}) – tổ chức, năm, phiên bản, ngày truy cập</summary>
      <ul>
        {g.sources.map((s) => (
          <li key={s.id}>
            <b>{s.org}</b> ({s.year}). {s.title}. {s.version}. <a href={s.url} target="_blank" rel="noreferrer">{s.url}</a>. Truy cập {s.accessed}. Quần thể: {s.population.map((p) => POP_TEXT[p] ?? p).join(", ")}. Hệ phân mức: {s.evidence_system}.
          </li>
        ))}
      </ul>
    </details>
  );
}

function ReviewBadge({ g }: { g: IntlGuideline }) {
  if (g.review.state === "draft_ai")
    return (
      <div className="igv-draft" role="note">
        <b>Bản nháp AI – chưa kiểm duyệt</b>
        <span>Cần dược sĩ/bác sĩ xác nhận trước khi áp dụng.</span>
      </div>
    );
  return <div className="igv-verified" role="note"><b>{REVIEW_TEXT[g.review.state]}</b><span>{g.review.verified_by} · {g.review.verified_date}</span></div>;
}

function Body({ g }: { g: IntlGuideline }) {
  const [raw, setRaw] = useState<AxisState>(() => defaultState(g.axes));
  const eff = useMemo(() => effectiveState(g.axes, raw), [g.axes, raw]);
  const r = useMemo(() => resolve(g, eff), [g, eff]);
  const set = (id: string, v: AxisVal) => setRaw((s) => ({ ...s, [id]: v }));

  if (g.status !== "extracted")
    return (
      <section className="sa24-out">
        <p className="sa24-warn">{g.status === "no_specific_guideline" ? "Chưa có hướng dẫn quốc tế riêng cho quần thể này – xem tab Việt Nam." : "Đã xác định nguồn quốc tế nhưng chưa trích khuyến cáo."}</p>
        {g.status_note && <p className="sa24-tip">{g.status_note}</p>}
      </section>
    );
  return (
    <>
      <Form g={g} raw={raw} eff={eff} set={set} />
      <section className="sa24-out" aria-live="polite">
        {!r.primary ? (
          <p className="sa24-warn">Dữ liệu lỗi: {r.conflicts.length ? `nhiều luật cùng khớp (${r.conflicts.join(", ")})` : "không có luật khớp tổ hợp đã chọn"}. Không hiển thị khuyến cáo.</p>
        ) : (
          <>
            <div className="sa24-dx">{r.summary.map((s) => <p key={s.label}><b>{s.label}</b> {s.text}</p>)}</div>
            {r.antibiogram.map((t) => <p key={t} className="igv-abg">Đối chiếu Antibiogram BV199: {t}</p>)}
            {r.before.map((s) => <Section key={s.id} s={s} g={g} eff={eff} set={set} />)}
            {r.blocks.map((b, i) => (
              <div key={`${b.title}-${i}`}>
                <h4>{b.title}</h4>
                {b.lead && <p className="sa24-lead">{b.lead}</p>}
                <Rx items={b.items} />
              </div>
            ))}
            {r.avoid.length > 0 && (<><h4>Không dùng</h4><Rx items={r.avoid} /></>)}
            {r.notes.length > 0 && (<><h4>Lưu ý</h4><ul className="igv-notes">{r.notes.map((n, i) => <li key={i}>{n.text}</li>)}</ul></>)}
            {r.after.map((s) => <Fragment key={s.id}><Section s={s} g={g} eff={eff} set={set} /></Fragment>)}
          </>
        )}
      </section>
    </>
  );
}

export default function IntlGuidelineView({ data }: { data: unknown }) {
  const parsed = useMemo(() => intlGuideline.safeParse(data), [data]);
  if (!parsed.success)
    return (
      <article className="sa24 igv" data-intl-error="">
        <p className="sa24-warn">Không hiển thị hướng dẫn quốc tế: dữ liệu không hợp lệ ({parsed.error.issues.length} lỗi, ví dụ “{parsed.error.issues[0]?.path.join(".")}: {parsed.error.issues[0]?.message}”).</p>
        <RxToolStyle />
      </article>
    );
  const g = parsed.data;
  const hidden = g.review.state === "draft_ai" && !SHOW_DRAFT;
  return (
    <article className="sa24 igv" data-intl-guideline={g.slug} data-review={g.review.state}>
      <header>
        <p className="sa24-eyebrow">{g.header.eyebrow}</p>
        <h3>{g.header.title}</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">{g.header.flow.map((f) => <li key={f}>{f}</li>)}</ol>
      </header>
      {hidden ? (
        <p className="sa24-warn" data-intl-pending="">Đang chờ thẩm định.</p>
      ) : (
        <>
          <ReviewBadge g={g} />
          <Body g={g} />
          {g.discordance.length > 0 && (
            <div className="igv-disc">
              <h4>Khác biệt giữa các hướng dẫn</h4>
              <ul className="igv-notes">{g.discordance.map((d) => <li key={d.topic}><b>{d.topic}:</b> {d.description}</li>)}</ul>
            </div>
          )}
          <p className="sa24-src">{g.source_text}</p>
          <Sources g={g} />
        </>
      )}
      <RxToolStyle />
      <style>{`.igv-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }
        .igv-sel { width: 100%; max-width: 520px; padding: 7px 10px; border: 1px solid #cfdde6; border-radius: 8px; font-size: 13.5px; background: #fff; color: #10243e; }
        .igv-draft, .igv-verified { display: grid; gap: 2px; border-radius: 10px; padding: 8px 12px; font-size: 13px; line-height: 1.5; }
        .igv-draft { background: #fff4ed; border: 2px solid #f59e0b; color: #7c2d12; }
        .igv-draft b { font-size: 14px; letter-spacing: .02em; text-transform: uppercase; }
        .igv-verified { background: #eef8f2; border: 1px solid #b7e0c6; color: #0b6b3a; }
        .igv-abg { margin: 0; font-size: 13px; line-height: 1.55; color: #1d4f8a; background: #e6f0fb; border-radius: 8px; padding: 6px 10px; }
        .igv-sources { font-size: 12px; color: #4b6576; }
        .igv-sources summary { cursor: pointer; font-weight: 700; color: #0b3a5b; }
        .igv-sources ul { margin: 6px 0 0; padding-left: 18px; display: grid; gap: 4px; line-height: 1.5; overflow-wrap: anywhere; }
        .igv-disc h4 { margin: 0 0 4px; font-size: 14px; color: #0b3a5b; }`}</style>
    </article>
  );
}
