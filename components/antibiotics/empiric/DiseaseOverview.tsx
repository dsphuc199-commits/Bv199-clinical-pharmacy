/*
  FILE: components/antibiotics/empiric/DiseaseOverview.tsx

  TEMPLATE DUNG CHUNG – Tang 1 (Tong quan quyet dinh) va Tang 4 (Theo doi, an toan)
  cho moi mat benh co du lieu trong data/antibiotics/empiric/overviews.ts.
  Doc EMPIRIC_TREATMENT_UI_RULES: khong hien vi tri trang inline; nguon gom vao
  "Nguồn và căn cứ" (mac dinh dong). Khong hien bang hieu chinh lieu/tuong tac – chi lien ket.
*/

import { getDiseaseOverview, type Point } from "@/data/antibiotics/empiric/overviews";
import { clinicalText, stratifiedText } from "@/lib/antibiotics/presentation-text";
import { EMPIRIC_TREATMENT_UI_RULES as RULES, SPECIALIZED_MODULE_LINKS } from "@/lib/antibiotics/empiric-ui-rules";

export function hasDiseaseOverview(diseaseId: string): boolean {
  return !!getDiseaseOverview(diseaseId);
}

/* Bo cuc dong deu moi mat benh: muc nao nguon khong neu thi ghi ro, khong an muc, khong tu bo sung noi dung. */
function List({ points, empty, stratified }: { points: Point[]; empty: string; stratified?: boolean }) {
  return points.length > 0 ? <ul>{points.map((p) => <Item key={p.text} p={p} stratified={stratified} />)}</ul> : empty ? <p className="do-empty">{empty}</p> : null;
}

export function overviewPointText(text: string): string {
  if (text === "Đã biết vi khuẩn: theo Bảng II.10.") return "Đã biết vi khuẩn: chọn kháng sinh theo tác nhân.";
  return stratifiedText(text);
}

function Item({ p, stratified }: { p: Point; stratified?: boolean }) {
  const t = stratified ? overviewPointText(p.text) : clinicalText(p.text);
  if (!t) return null;
  return <li>{t}{!stratified && RULES.showPageNumbersInline && <span className="do-ref"> ({p.ref})</span>}</li>;
}

export function DiseaseOverviewSummary({ diseaseId, durationPoints, stratified }: {
  diseaseId: string;
  durationPoints?: Point[];
  stratified?: { pathogens: Point[]; sampling: Point[] };
}) {
  const o = getDiseaseOverview(diseaseId);
  if (!o) return null;
  const cards = o.cards.slice(0, 4).map((card) => ({ ...card, points: [...card.points] }));
  if (stratified) {
    for (const [label, points] of [["Tác nhân", stratified.pathogens], ["Trước kháng sinh", stratified.sampling]] as const) {
      if (points.length === 0) continue;
      const existing = cards.find((card) => card.label.startsWith(label));
      if (!existing) cards.push({ label, points });
      else for (const point of points) {
        if (!existing.points.some((p) => overviewPointText(p.text) === overviewPointText(point.text))) existing.points.push(point);
      }
    }
    if (!cards.some((card) => card.label === "Thời gian")) {
      const duration = o.monitoring.reassessment.filter((p) => /thời gian điều trị/iu.test(p.text));
      if (duration.length) cards.push({ label: "Thời gian", points: duration });
    }
  }
  return (
    <section className="do" aria-label="Tổng quan quyết định lâm sàng">
      <div className="do-cards">
        {cards.map((c) => (
          <div key={c.label} className="do-card">
            <h4>{c.label}</h4>
            <ul>{(c.label === "Thời gian" && durationPoints ? durationPoints : c.points).map((p) => <Item key={p.text} p={p} stratified={!!stratified} />)}</ul>
          </div>
        ))}
      </div>
      {o.sourceControl.length > 0 && (
        <div className="do-control">
          <h4>Kiểm soát ổ nhiễm và can thiệp</h4>
          <List points={o.sourceControl} empty="" stratified={!!stratified} />
        </div>
      )}
      {!!o.prevention?.length && (
        <div>
          <h4>Dự phòng</h4>
          <List points={o.prevention} empty="" stratified={!!stratified} />
        </div>
      )}
      <DiseaseOverviewStyle />
    </section>
  );
}

export function DiseaseMonitoring({ diseaseId, stratified }: { diseaseId: string; stratified?: boolean }) {
  const o = getDiseaseOverview(diseaseId);
  if (!o) return null;
  return (
    <section className="do do-monitor" aria-label="Theo dõi và an toàn">
      <h3>Theo dõi, đánh giá lại và an toàn</h3>
      <div className="do-mon-grid">
        {o.monitoring.efficacy.length > 0 && <div><h4>Theo dõi hiệu quả</h4><List points={o.monitoring.efficacy} empty="" stratified={stratified} /></div>}
        {o.monitoring.reassessment.length > 0 && <div><h4>Đánh giá lại điều trị</h4><List points={o.monitoring.reassessment} empty="" stratified={stratified} /></div>}
      </div>
      <details className="do-safety">
        <summary>Cảnh báo an toàn trong điều trị</summary>
        <List points={o.monitoring.safety} empty="" stratified={stratified} />
        {!RULES.showDoseAdjustmentTables && (
          <p className="do-link">Hiệu chỉnh liều theo chức năng thận, gan: xem module <a href={SPECIALIZED_MODULE_LINKS.doseAdjustment.href}>{SPECIALIZED_MODULE_LINKS.doseAdjustment.label}</a>.</p>
        )}
      </details>
      {/* Nguon gop vao khoi "Nguồn và đối chiếu" cua khung phac do (ten van ban, nam); vi tri tung y giu trong du lieu. */}
      <DiseaseOverviewStyle />
    </section>
  );
}

function DiseaseOverviewStyle() {
  return (
    <style>{`
      .do { display:grid; gap:var(--clinical-group-gap, 12px); margin:0 0 18px; color:#12283c; min-width:0; }
      .do h4 { margin:0 0 6px; font-size:12px; font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:#1e3a5f; }
      .do ul { margin:0; padding-left:16px; font-size:13.5px; line-height:1.55; }
      .do li + li { margin-top:4px; }
      .do-cards { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:var(--clinical-group-gap, 12px); }
      .do-card { background:#fff; border:1px solid #dbe4ec; border-top:3px solid #1e3a5f; border-radius:8px; padding:10px 12px; min-width:0; }
      .do-card:nth-child(4) { border-top-color:#2f7d5b; }
      .do-control { border-left:3px solid #d97706; background:#fffaf2; border-radius:0 8px 8px 0; padding:8px 12px; }
      .do-control h4 { color:#9a4f00; }
      .do-monitor { border-top:1px solid #dfe8ee; padding-top:var(--clinical-group-gap, 12px); margin-top:8px; }
      .do-monitor h3 { margin:0; font-size:18px; font-weight:800; color:#10243e; }
      .do-mon-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
      .do details { border:1px solid #dce6ed; border-radius:8px; padding:9px 14px; background:#f7fafc; }
      .do details > summary { cursor:pointer; font-size:13px; font-weight:700; color:#1e3a5f; }
      .do details ul { margin-top:8px; }
      .do-safety { border-color:#f3c6c6 !important; background:#fff7f7 !important; }
      .do-safety > summary { color:#9b1c1c !important; }
      .do-link { margin:8px 0 0; font-size:12.5px; color:#4b6576; }
      .do-ref { font-size:11.5px; color:#6b8293; }
      .do-empty { margin:0; font-size:13px; color:#6b8293; font-style:italic; }
      .do-sources { font-size:12.5px; color:#4b6576; }
      .do :is(summary,a):focus-visible { outline:3px solid #087f89; outline-offset:3px; }
      @media (max-width: 1000px) { .do-cards { grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media (max-width: 640px) { .do-cards, .do-mon-grid { grid-template-columns:minmax(0,1fr); } }
    `}</style>
  );
}
