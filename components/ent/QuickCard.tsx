"use client";
/* Thẻ "Chọn kháng sinh nhanh" – mọi dòng hiển thị lấy từ dữ liệu có citation qua lib/ent/decide.ts. */
import { createContext, useContext, useMemo, useState } from "react";
import Link from "next/link";
import type { Citation, Decision, Disease, Dose, Inputs, Source } from "@/types/ent";
import { decide } from "@/lib/ent/decide";

const tierText = (s: Source) => (s.tier === "REF" ? "Tham khảo" : s.tier === "LABEL" ? "Nhãn FDA" : `Tier ${s.tier}`);

import { regimenSummary, visibleInputs } from "@/lib/ent/view";
export { regimenSummary, visibleInputs };

const DECISION_LABEL: Record<Decision, string> = {
  antibiotic: "Chỉ định kháng sinh",
  antibiotic_or_observe: "Kháng sinh hoặc theo dõi chờ đợi (watchful waiting) – quyết định cùng người bệnh/gia đình",
  antibiotic_or_refer: "Kháng sinh ngay hoặc chuyển chuyên khoa tai mũi họng – ngoài phạm vi viêm xoang không biến chứng",
  reassess_switch: "Đánh giá lại (xác nhận chẩn đoán, loại trừ nguyên nhân khác, tìm biến chứng); xác nhận viêm xoang cấp do vi khuẩn thì đổi kháng sinh",
  no_antibiotic: "Không dùng kháng sinh",
  test_first: "Xét nghiệm trước khi quyết định",
  no_primary: "Không có nguồn chính đã xác minh – không xuất lựa chọn đầu tay",
};

/** true khi module được nhúng trong tab Quốc tế: vị trí nguồn vào khối đóng "Xem chứng cứ", ẩn ghi chú quy trình. */
export const EntEmbedded = createContext(false);

export function Badge({ c, sources }: { c: Citation; sources: Source[] }) {
  const embedded = useContext(EntEmbedded);
  const s = sources.find((x) => x.id === c.sourceId);
  if (!s) return <span className="ent-badge ent-badge-x">nguồn?</span>;
  if (embedded) return (
    <>
      <span className={`ent-badge ent-tier-${s.tier}`}>{s.org} {s.year} · {tierText(s)}</span>
      <details className="ent-cite"><summary>Xem chứng cứ</summary>{s.title}. {c.locator}</details>
    </>
  );
  return (
    <span className={`ent-badge ent-tier-${s.tier}`} title={`${s.title}. ${c.locator}`}>
      {s.org} {s.year} · {tierText(s)} · {c.locator}
    </span>
  );
}

function DoseRow({ d, sources, computed }: { d: Dose; sources: Source[]; computed?: string }) {
  const embedded = useContext(EntEmbedded);
  const meta = [d.max || !embedded ? `Liều tối đa: ${d.max ?? "Nguồn không nêu"}` : "", d.condition ? `Điều kiện: ${d.condition}` : ""].filter(Boolean).join(" · ");
  return (
    <li className="ent-dose">
      <div className="ent-dose-h"><b>{d.addOn ? "+ " : ""}{d.drug}</b>{d.addOn && <span className="ent-badge">phối hợp thêm</span>}{d.status !== "EXTRACTED" && <span className="ent-nv">Chưa xác minh</span>}</div>
      <div>{d.dose}; {d.route}{d.interval ? `; ${d.interval}` : ""}{d.duration ? `; ${d.duration}` : ""}</div>
      {meta && <div className="ent-muted">{meta}</div>}
      {computed && <div className="ent-calc">Tính theo cân nặng: {computed}</div>}
      {(d.strength || d.quality) && <div className="ent-muted">Mức khuyến cáo/bằng chứng theo nguồn: {[d.strength, d.quality].filter(Boolean).join("; ")}</div>}
      {d.note && <div className="ent-muted">{d.note}</div>}
      {d.link && <div><Link className="ent-link" href={d.link.href}>{d.link.label}</Link></div>}
      <Badge c={d.citation} sources={sources} />
    </li>
  );
}

export default function QuickCard({ disease, sources }: { disease: Disease; sources: Source[] }) {
  const [inp, setInp] = useState<Inputs>({});
  const set = (k: string, v: string | number | boolean | undefined) => setInp((p) => ({ ...p, [k]: v === "" ? undefined : v }));
  const { shown, eff } = useMemo(() => visibleInputs(disease, inp), [disease, inp]);
  const r = useMemo(() => decide(disease, eff), [disease, eff]);
  const missing = shown.filter((s) => s.type === "select" && eff[s.field] === undefined).map((s) => s.label.replace(/^d+.s*/, ""));
  const calc = (id: string) => r.computed.find((c) => c.doseId === id)?.text;
  const noPrimary = disease.primarySources.length === 0 || r.decision?.value === "no_primary";
  const embedded = useContext(EntEmbedded);
  const redFlags = embedded ? r.redFlags.filter((f) => f.status === "EXTRACTED") : r.redFlags;
  const refStatements = embedded ? r.reference.statements.filter((s) => s.status === "EXTRACTED") : r.reference.statements;

  return (
    <section className="ent-card" aria-label="Chọn kháng sinh nhanh">
      <h2>Chọn kháng sinh nhanh</h2>
      {redFlags.length > 0 && (
        <div className="ent-red">
          <b>Cờ đỏ – chuyển tuyến/hội chẩn</b>
          <ul>{redFlags.map((f) => <li key={f.id}>{f.text} {f.status !== "EXTRACTED" && <span className="ent-nv">Chưa xác minh</span>} <Badge c={f.citation} sources={sources} /></li>)}</ul>
        </div>
      )}
      {shown.length > 0 && (
        <div className="ent-inputs">
          {shown.map((s) => (
            <label key={s.field} className="ent-in">
              <span>{s.label}{s.unit ? ` (${s.unit})` : ""}</span>
              {s.type === "number" && <input type="number" inputMode="decimal" min={s.min} max={s.max} value={(inp[s.field] as number | undefined) ?? ""} onChange={(e) => set(s.field, e.target.value === "" ? undefined : Number(e.target.value))} />}
              {s.type === "select" && (
                <select value={(inp[s.field] as string | undefined) ?? ""} onChange={(e) => set(s.field, e.target.value)}>
                  <option value="">—</option>
                  {s.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              )}
              {s.type === "boolean" && <input type="checkbox" checked={inp[s.field] === true} onChange={(e) => set(s.field, e.target.checked ? true : undefined)} />}
            </label>
          ))}
        </div>
      )}
      {r.errors.length > 0 && <ul className="ent-err">{r.errors.map((e) => <li key={e}>{e}</li>)}</ul>}

      {noPrimary ? (
        <>
          {disease.doses.some((d) => d.role === "reference") && (
            r.reference.doses.length > 0 && !missing.length ? (
              <div className="ent-refdose">
                <b>Phác đồ tham khảo theo lựa chọn – không phải khuyến cáo hội chuyên môn</b>
                <p className="ent-regimen">{regimenSummary(r.reference.doses)}</p>
                <ul className="ent-list">{r.reference.doses.map((d) => <DoseRow key={d.id} d={d} sources={sources} computed={calc(d.id)} />)}</ul>
              </div>
            ) : (
              <p className="ent-decision">{missing.length ? `Chọn: ${missing.join(", ")} để xem phác đồ.` : "Không có phác đồ tham khảo cho lựa chọn này."}</p>
            )
          )}
          <div className="ent-gap">
            <details open={!embedded}>
              <summary><b>Khoảng trống bằng chứng – vì sao chỉ là tham khảo ({(disease.evidenceGap ?? []).length})</b></summary>
              <ul>{(disease.evidenceGap ?? []).map((g) => <li key={g}>{g}</li>)}</ul>
            </details>
            {refStatements.length > 0 && (
              <details open={!embedded}>
                <summary><b>Ghi chú tham khảo, không phải khuyến cáo hội chuyên môn ({refStatements.length})</b></summary>
                <ul>{refStatements.map((s) => <li key={s.id}>{s.text} {s.status !== "EXTRACTED" && <span className="ent-nv">Chưa xác minh</span>} <Badge c={s.citation} sources={sources} /></li>)}</ul>
              </details>
            )}
          </div>
        </>
      ) : (
        <>
          {r.decision ? (
            <p className="ent-decision"><b>{DECISION_LABEL[r.decision.value]}</b> <Badge c={r.decision.citation} sources={sources} /></p>
          ) : (
            <p className="ent-muted">Chọn đủ các trường có trong nguồn để xem quyết định.</p>
          )}
          {r.first.length > 0 && (<><h3>Lựa chọn đầu tay</h3><ul className="ent-list">{r.first.map((d) => <DoseRow key={d.id} d={d} sources={sources} computed={calc(d.id)} />)}</ul></>)}
          {r.alternatives.length > 0 && (<><h3>Thay thế khi dị ứng penicillin</h3><ul className="ent-list">{r.alternatives.map((d) => <DoseRow key={d.id} d={d} sources={sources} computed={calc(d.id)} />)}</ul></>)}
          {r.failure.length > 0 && (<><h3>Thất bại điều trị</h3><ul className="ent-list">{r.failure.map((d) => <DoseRow key={d.id} d={d} sources={sources} computed={calc(d.id)} />)}</ul></>)}
          {r.other.length > 0 && (<><h3>Tình huống khác theo nguồn</h3><ul className="ent-list">{r.other.map((d) => <DoseRow key={d.id} d={d} sources={sources} computed={calc(d.id)} />)}</ul></>)}
          {r.decision && !r.first.length && !r.alternatives.length && !r.failure.length && r.decision.value !== "no_antibiotic" && r.decision.value !== "test_first" && r.decision.value !== "antibiotic_or_refer" && (
            <p className="ent-muted">{embedded ? "Không có dòng liều phù hợp với đầu vào hiện tại; đánh giá lâm sàng và hội chẩn." : "Không có dòng liều phù hợp với đầu vào hiện tại (ví dụ dị ứng penicillin nặng): Nguồn không nêu – cần đánh giá lâm sàng."}</p>
          )}
        </>
      )}
      {r.comparison.length > 0 && (
        <details className="ent-cmp" open={noPrimary}>
          <summary>Đối chiếu nguồn khác ({r.comparison.length})</summary>
          <ul className="ent-list">{r.comparison.map((d) => <DoseRow key={d.id} d={d} sources={sources} computed={calc(d.id)} />)}</ul>
        </details>
      )}
      {!embedded && r.unverified.length > 0 && (
        <details className="ent-cmp"><summary>Chưa xác minh ({r.unverified.length})</summary>
          <ul className="ent-list">{r.unverified.map((d) => <DoseRow key={d.id} d={d} sources={sources} />)}</ul>
        </details>
      )}
      {r.conflicts.length > 0 && (
        <div className="ent-conf">
          <b>Chỗ nguồn bất đồng</b>
          {r.conflicts.map((c) => (
            <div key={c.id} className="ent-conf-row">
              <div className="ent-conf-t">{c.topic}</div>
              <div className="ent-conf-cols">
                {c.sides.map((s) => <div key={s.sourceId}><b>{s.sourceId.split("-")[0]} {s.year}</b><div>{s.text}</div><Badge c={s.citation} sources={sources} /></div>)}
              </div>
            </div>
          ))}
        </div>
      )}
      {!embedded && r.notStated.length > 0 && (
        <div className="ent-ns">
          <b>Nguồn không nêu – cần đánh giá lâm sàng</b>
          <ul>{r.notStated.map((n) => <li key={n}>{n}</li>)}</ul>
          <p className="ent-muted">Tương tác và chống chỉ định: kiểm tra theo tờ thông tin thuốc, nằm ngoài phạm vi hướng dẫn.</p>
        </div>
      )}
    </section>
  );
}
