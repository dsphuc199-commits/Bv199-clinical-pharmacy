"use client";
/* Thẻ "Chọn kháng sinh nhanh" – mọi dòng hiển thị lấy từ dữ liệu có citation qua lib/ent/decide.ts. */
import { useMemo, useState } from "react";
import type { Citation, Decision, Disease, Dose, Inputs, Source } from "@/types/ent";
import { decide } from "@/lib/ent/decide";

const DECISION_LABEL: Record<Decision, string> = {
  antibiotic: "Chỉ định kháng sinh",
  antibiotic_or_observe: "Kháng sinh hoặc theo dõi chờ đợi (watchful waiting) – quyết định cùng người bệnh/gia đình",
  antibiotic_or_refer: "Kháng sinh ngay hoặc chuyển chuyên khoa tai mũi họng – ngoài phạm vi viêm xoang không biến chứng",
  reassess_switch: "Đánh giá lại (xác nhận chẩn đoán, loại trừ nguyên nhân khác, tìm biến chứng); xác nhận viêm xoang cấp do vi khuẩn thì đổi kháng sinh",
  no_antibiotic: "Không dùng kháng sinh",
  test_first: "Xét nghiệm trước khi quyết định",
  no_primary: "Không có nguồn chính đã xác minh – không xuất lựa chọn đầu tay",
};

export function Badge({ c, sources }: { c: Citation; sources: Source[] }) {
  const s = sources.find((x) => x.id === c.sourceId);
  if (!s) return <span className="ent-badge ent-badge-x">nguồn?</span>;
  return (
    <span className={`ent-badge ent-tier-${s.tier}`} title={`${s.title}. ${c.locator}`}>
      {s.org} {s.year} · {s.tier === "REF" ? "Tham khảo" : `Tier ${s.tier}`} · {c.locator}
    </span>
  );
}

function DoseRow({ d, sources, computed }: { d: Dose; sources: Source[]; computed?: string }) {
  return (
    <li className="ent-dose">
      <div className="ent-dose-h"><b>{d.drug}</b>{d.status !== "EXTRACTED" && <span className="ent-nv">Chưa xác minh</span>}</div>
      <div>{d.dose}; {d.route}{d.interval ? `; ${d.interval}` : ""}{d.duration ? `; ${d.duration}` : ""}</div>
      <div className="ent-muted">Liều tối đa: {d.max ?? "Nguồn không nêu"}{d.condition ? ` · Điều kiện: ${d.condition}` : ""}</div>
      {computed && <div className="ent-calc">Tính theo cân nặng: {computed}</div>}
      {(d.strength || d.quality) && <div className="ent-muted">Mức khuyến cáo/bằng chứng theo nguồn: {[d.strength, d.quality].filter(Boolean).join("; ")}</div>}
      {d.note && <div className="ent-muted">{d.note}</div>}
      <Badge c={d.citation} sources={sources} />
    </li>
  );
}

export default function QuickCard({ disease, sources }: { disease: Disease; sources: Source[] }) {
  const [inp, setInp] = useState<Inputs>({});
  const set = (k: string, v: string | number | boolean | undefined) => setInp((p) => ({ ...p, [k]: v === "" ? undefined : v }));
  const r = useMemo(() => decide(disease, inp), [disease, inp]);
  const calc = (id: string) => r.computed.find((c) => c.doseId === id)?.text;
  const noPrimary = disease.primarySources.length === 0 || r.decision?.value === "no_primary";

  return (
    <section className="ent-card" aria-label="Chọn kháng sinh nhanh">
      <h2>Chọn kháng sinh nhanh</h2>
      {r.redFlags.length > 0 && (
        <div className="ent-red">
          <b>Cờ đỏ – chuyển tuyến/hội chẩn</b>
          <ul>{r.redFlags.map((f) => <li key={f.id}>{f.text} {f.status !== "EXTRACTED" && <span className="ent-nv">Chưa xác minh</span>} <Badge c={f.citation} sources={sources} /></li>)}</ul>
        </div>
      )}
      {disease.inputs.length > 0 && (
        <div className="ent-inputs">
          {disease.inputs.map((s) => (
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
        <div className="ent-gap">
          <b>Khoảng trống bằng chứng</b>
          <ul>{(disease.evidenceGap ?? []).map((g) => <li key={g}>{g}</li>)}</ul>
          {r.reference.statements.length > 0 && (
            <>
              <b>Chỉ tham khảo, không phải khuyến cáo hội chuyên môn</b>
              <ul>{r.reference.statements.map((s) => <li key={s.id}>{s.text} {s.status !== "EXTRACTED" && <span className="ent-nv">Chưa xác minh</span>} <Badge c={s.citation} sources={sources} /></li>)}</ul>
            </>
          )}
        </div>
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
            <p className="ent-muted">Không có dòng liều phù hợp với đầu vào hiện tại (ví dụ dị ứng penicillin nặng): Nguồn không nêu – cần đánh giá lâm sàng.</p>
          )}
        </>
      )}
      {r.comparison.length > 0 && (
        <details className="ent-cmp" open={noPrimary}>
          <summary>Đối chiếu nguồn khác ({r.comparison.length})</summary>
          <ul className="ent-list">{r.comparison.map((d) => <DoseRow key={d.id} d={d} sources={sources} computed={calc(d.id)} />)}</ul>
        </details>
      )}
      {r.unverified.length > 0 && (
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
      {r.notStated.length > 0 && (
        <div className="ent-ns">
          <b>Nguồn không nêu – cần đánh giá lâm sàng</b>
          <ul>{r.notStated.map((n) => <li key={n}>{n}</li>)}</ul>
          <p className="ent-muted">Tương tác và chống chỉ định: kiểm tra theo tờ thông tin thuốc, nằm ngoài phạm vi hướng dẫn.</p>
        </div>
      )}
    </section>
  );
}
