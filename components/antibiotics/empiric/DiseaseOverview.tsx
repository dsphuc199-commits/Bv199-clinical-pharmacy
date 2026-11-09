/*
  FILE: components/antibiotics/empiric/DiseaseOverview.tsx

  TEMPLATE DUNG CHUNG – Tang 1 (Tong quan quyet dinh) va Tang 4 (Theo doi, an toan)
  cho moi mat benh co du lieu trong data/antibiotics/empiric/overviews.ts.
  Doc EMPIRIC_TREATMENT_UI_RULES: khong hien vi tri trang inline; nguon gom vao
  "Nguồn và căn cứ" (mac dinh dong). Khong hien bang hieu chinh lieu/tuong tac – chi lien ket.
*/

import { getDiseaseOverview, type Point } from "@/data/antibiotics/empiric/overviews";
import { EMPIRIC_TREATMENT_UI_RULES as RULES, SPECIALIZED_MODULE_LINKS } from "@/lib/antibiotics/empiric-ui-rules";

export function hasDiseaseOverview(diseaseId: string): boolean {
  return !!getDiseaseOverview(diseaseId);
}

/* Bo cuc dong deu moi mat benh: muc nao nguon khong neu thi ghi ro, khong an muc, khong tu bo sung noi dung. */
function List({ points, empty }: { points: Point[]; empty: string }) {
  return points.length > 0 ? <ul>{points.map((p) => <Item key={p.text} p={p} />)}</ul> : <p className="do-empty">{empty}</p>;
}

function Item({ p }: { p: Point }) {
  return <li>{p.text}{RULES.showPageNumbersInline && <span className="do-ref"> ({p.ref})</span>}</li>;
}

export function DiseaseOverviewSummary({ diseaseId }: { diseaseId: string }) {
  const o = getDiseaseOverview(diseaseId);
  if (!o) return null;
  return (
    <section className="do" aria-label="Tổng quan quyết định lâm sàng">
      <div className="do-cards">
        {o.cards.slice(0, 4).map((c) => (
          <div key={c.label} className="do-card">
            <h4>{c.label}</h4>
            <ul>{c.points.map((p) => <Item key={p.text} p={p} />)}</ul>
          </div>
        ))}
      </div>
      <div className="do-control">
        <h4>Kiểm soát ổ nhiễm và can thiệp</h4>
        <List points={o.sourceControl} empty="Văn bản không nêu biện pháp kiểm soát ổ nhiễm hoặc can thiệp riêng cho bệnh này." />
      </div>
      <DiseaseOverviewStyle />
    </section>
  );
}

export function DiseaseMonitoring({ diseaseId }: { diseaseId: string }) {
  const o = getDiseaseOverview(diseaseId);
  if (!o) return null;
  return (
    <section className="do do-monitor" aria-label="Theo dõi và an toàn">
      <h3>Theo dõi, đánh giá lại và an toàn</h3>
      <div className="do-mon-grid">
        <div><h4>Theo dõi hiệu quả</h4><List points={o.monitoring.efficacy} empty="Văn bản không nêu chỉ số theo dõi riêng." /></div>
        <div><h4>Đánh giá lại điều trị</h4><List points={o.monitoring.reassessment} empty="Văn bản không nêu thời điểm đánh giá lại riêng." /></div>
      </div>
      <details className="do-safety">
        <summary>Cảnh báo an toàn thiết yếu ({o.monitoring.safety.length})</summary>
        <List points={o.monitoring.safety} empty="Văn bản không nêu cảnh báo an toàn riêng cho bệnh này." />
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
      .do { display:grid; gap:14px; margin:0 0 18px; color:#12283c; min-width:0; }
      .do h4 { margin:0 0 6px; font-size:12px; font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:#1e3a5f; }
      .do ul { margin:0; padding-left:16px; font-size:13.5px; line-height:1.55; }
      .do li + li { margin-top:5px; }
      .do-cards { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; }
      .do-card { background:#fff; border:1px solid #dbe4ec; border-top:3px solid #1e3a5f; border-radius:8px; padding:10px 12px; min-width:0; }
      .do-card:nth-child(4) { border-top-color:#2f7d5b; }
      .do-control { border-left:3px solid #d97706; background:#fffaf2; border-radius:0 8px 8px 0; padding:10px 14px; }
      .do-control h4 { color:#9a4f00; }
      .do-monitor { border-top:1px solid #dfe8ee; padding-top:16px; margin-top:8px; }
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
