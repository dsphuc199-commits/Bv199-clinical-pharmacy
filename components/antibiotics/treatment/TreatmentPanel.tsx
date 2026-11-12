"use client";

/*
  FILE: components/antibiotics/treatment/TreatmentPanel.tsx

  TEMPLATE CHUAN CDSS – DUNG CHUNG CHO 69 BENH (phac do BYT, module CAP QĐ 2147, HAP/VAP Hoi 2023).
  Thu tu co dinh:
    (2) Benh canh lam sang – danh sach chon
    (3) Phac do khang sinh kinh nghiem – cac muc theo phan loai CUA NGUON:
          co phan cap  -> "Lua chon uu tien" / "Lua chon thay the"  (the: Phac do 1, 2…)
          ngang hang   -> "Cac lua chon duoc khuyen cao"           (the: Lua chon 1, 2…)
    (4) Luu y lam sang (chi luu y cua phac do dang xem) + Theo doi hieu qua va an toan
    (5) Nguon tham khao – MOT dong
  (1) Thong tin benh ly nam o dau trang (page), khong lap lai o day.
  Component chi trinh bay: du lieu va phan loai do noi goi truyen vao (khong tu xep hang).
*/

import { useState, type ReactNode } from "react";

import DrugActionLinks from "@/components/antibiotics/links/DrugActionLinks";
import type { DrugGroup, StructureStatus } from "@/lib/antibiotics/regimen-structure";

import DoseTable from "./DoseTable";
import { clinicalText } from "@/lib/antibiotics/presentation-text";
import ClinicalNotes from "./ClinicalNotes";
import ClinicalScenarioPicker from "./ClinicalScenarioPicker";
import { useAbxLinkContext } from "../links/AbxLinkContext";
import { DISEASES, getStream } from "@/data/antibiotics/empiric/catalog";
import ClinicalSources from "./ClinicalSources";
import { citeSources } from "@/lib/antibiotics/source-citation";
import type { ScenarioChoice } from "@/lib/antibiotics/patient-groups";
import type { Rationale } from "@/data/antibiotics/empiric/rationale";
import { EMPIRIC_TREATMENT_UI_RULES, SPECIALIZED_MODULE_LINKS } from "@/lib/antibiotics/empiric-ui-rules";

export type TxAlert = {
  id: string;
  level: "critical" | "high";
  title: string;
  text: string;
  checklist?: string[];
  sources?: string[];
};

export type TxCard = {
  id: string;
  /* Dieu kien ap dung cua phac do (vd. di ung beta-lactam, nghi MRSA). */
  condition?: string;
  groups: DrugGroup[];
  status: StructureStatus;
  duration?: string;
  hideDailyDose?: boolean;
  sourceDoseAbsent?: boolean;
  alerts?: TxAlert[];
  /* Nhan an toan ngan (vd. "Khóa đề xuất tự động"). */
  flags?: { text: string; title?: string; tone: "lock" | "warn" | "info" }[];
  /* Noi dung bo sung co dan nguon (vd. lieu bo sung). */
  extra?: ReactNode;
  linkTexts?: string[];
  linkScenario?: string;
  sources?: string[];
};

export type TxSection = {
  key: string;
  title: string;
  /* "Phác đồ" (co phan cap) hoac "Lựa chọn" (ngang hang). */
  itemLabel: "Phác đồ" | "Lựa chọn";
  cards: TxCard[];
  /* So thu tu bat dau (de danh so lien tuc giua cac muc ngang hang). */
  startAt?: number;
  /* Muc phu (theo tac nhan, kem theo): thu gon, tu mo khi co canh bao nguy co cao. */
  collapsible?: boolean;
  defaultOpen?: boolean;
};

type Props = {
  scenarios?: ScenarioChoice[];
  scenario?: string;
  initialChoice?: string;
  onScenario?: (value: string) => void;
  scenarioHint?: ReactNode;
  /* Ten nguon ngan o dau khung (vd. "Bộ Y tế"). */
  sourceTag?: string;
  sections: TxSection[];
  emptyText?: string;
  notes?: string[];
  /* Ghi chu chi tiet dai (vd. doi chieu lieu BYT – quoc te): thu gon rieng trong muc Luu y. */
  detailNotes?: { title: string; items: string[] };
  comparison?: ReactNode;
  monitoring?: string[];
  sources: string[];
  footer?: ReactNode;
  /* Tang 3 – tieu chi lua chon cua nhanh dang xem (mac dinh dong). */
  rationale?: Rationale;
};

/* Tieu chi -> Y nghia lam sang -> Anh huong den lua chon khang sinh (mac dinh dong, nguon tung tieu chi). */
export function RationaleAccordion({ rationale }: { rationale: Rationale }) {
  const open = EMPIRIC_TREATMENT_UI_RULES.showCriteriaByDefault;
  return (
    <details className="tp-rationale" open={open || undefined}>
      <summary>Vì sao chọn phác đồ này?</summary>
      {rationale.status === "requires_review" && <p className="tp-rationale-review">Điều kiện áp dụng:</p>}
      <dl className="tp-rationale-list">
        {/* Chi giu tieu chi dan toi lua chon thuoc (co "Anh huong den lua chon") hoac canh bao CAN THAM DINH. */}
        {rationale.items.filter((c) => rationale.status !== "authored" || !!c.treatmentImplication || /CẦN THẨM ĐỊNH/u.test(`${c.condition} ${c.clinicalMeaning ?? ""}`)).filter((c) => clinicalText(c.condition)).map((c, i) => (
          <div key={i} className="tp-rationale-item">
            <dt>{rationale.status === "authored" && <span className="tp-rationale-k">Tiêu chí</span>}{clinicalText(c.condition)}</dt>
            {c.clinicalMeaning && <dd><span className="tp-rationale-k">Ý nghĩa lâm sàng</span>{clinicalText(c.clinicalMeaning)}</dd>}
            {c.treatmentImplication && <dd><span className="tp-rationale-k">Ảnh hưởng đến lựa chọn</span>{clinicalText(c.treatmentImplication)}</dd>}
          </div>
        ))}
      </dl>
      {rationale.reassessment && rationale.reassessment.length > 0 && <p className="tp-rationale-re"><strong>Đánh giá lại:</strong> {rationale.reassessment.map((r) => clinicalText(r)).join(" ")}</p>}
      {/* Can cu gop mot dong: chi ten van ban (vi tri muc/trang giu trong du lieu). */}
      {(() => { const cites = citeSources(rationale.items.flatMap((c) => c.sources ?? [])); return cites.length > 0 && <p className="tp-rationale-src">Căn cứ: {cites.map((c) => c.label).join("; ")}</p>; })()}
      {/* CSS di kem khoi de hien thi giong nhau o moi noi dung (khung chung, module COPD). */}
      <style>{`
      .tp-rationale { margin-top: 14px; border: 1px solid #dce6ed; border-radius: 8px; background: #f7fafc; padding: 10px 14px; }
      .tp-rationale > summary { font-size: 13px; font-weight: 700; color: #1e3a5f; }
      .tp-rationale-review { margin: 8px 0 0; font-size: 12.5px; color: #92400e; }
      .tp-rationale-list { margin: 8px 0 0; display: grid; gap: 10px; }
      .tp-rationale-item { display: grid; gap: 3px; padding-left: 10px; border-left: 3px solid #2f7d5b; }
      .tp-rationale-item dt { font-size: 13px; font-weight: 600; color: #12283c; }
      .tp-rationale-item dd { margin: 0; font-size: 13px; line-height: 1.55; color: #33505f; }
      .tp-rationale-k { display: inline-block; min-width: 150px; margin-right: 6px; font-size: 11px; font-weight: 800; letter-spacing: .03em; text-transform: uppercase; color: #557080; }
      .tp-rationale-src { font-size: 11.5px !important; color: #6b8293 !important; }
      .tp-rationale-re { margin: 10px 0 0; font-size: 13px; }
      @media (max-width: 640px) { .tp-rationale-k { display: block; min-width: 0; } }
      `}</style>
    </details>
  );
}

const NOTE_LIMIT = 5;

export function cardLabel(section: TxSection, index: number): string | undefined {
  if (section.cards.length <= 1) return undefined;
  return `Phác đồ ${(section.startAt ?? 1) + index}`;
}

/* Mot phac do = mot hang: cot trai nhan ("Phac do 1"/"Lua chon 1") + nhan an toan; cot phai noi dung. */
function Card({ card, label, durationColumn, hideRegimenDuration }: { card: TxCard; label?: string; durationColumn?:boolean; hideRegimenDuration?:boolean }) {
  const critical = (card.alerts ?? []).filter((a) => a.level === "critical");
  const high = (card.alerts ?? []).filter((a) => a.level !== "critical");
  /* Co nhan (Phac do N / Lua chon N) -> cot trai; khong nhan -> nhan an toan thanh mot hang tren noi dung. */
  const hasFlags = (card.flags?.length ?? 0) > 0;
  const head = (label || hasFlags) && (
    <header className={label ? "byt199-card-head tp-card-head" : "byt199-card-head tp-card-head tp-card-head-row"}>
      {label && <strong className="tp-card-label">{label}</strong>}
      {card.flags?.map((f) => (
        <span key={f.text} className={f.tone === "lock" ? "byt199-locked tp-flag tp-flag-lock" : `tp-flag tp-flag-${f.tone}`} title={f.title}>
          {f.text}
        </span>
      ))}
    </header>
  );
  return (
    <article className={label ? "byt199-card tp-card" : "byt199-card tp-card tp-card-noside"} data-regimen={card.id}>
      {label && head}
      <div className="tp-card-main">
        {!label && head}
        {card.condition && <p className="tp-cond">{clinicalText(card.condition)}</p>}
        

        {critical.map((a) => (
          <div key={a.id} className="byt199-alert byt199-alert-critical tp-alert tp-alert-critical" role="alert">
            <strong>NGUY CƠ CAO – {clinicalText(a.title)}</strong>
            <p>{clinicalText(a.text)}</p>
            {a.sources && <details><summary>Nguồn chứng cứ</summary><span className="tp-alert-src">{a.sources.join("; ")}</span></details>}
          </div>
        ))}

        <DoseTable groups={card.groups} status={card.status} duration={card.duration} hideDailyDose={card.hideDailyDose} durationColumn={durationColumn} hideRegimenDuration={hideRegimenDuration} sourceDoseAbsent={card.sourceDoseAbsent} hideReviewNote/>
        {card.extra}
        {/* Nguon cua the gop vao mot khoi "Nguồn và đối chiếu" cuoi khung phac do. */}

        {high.map((a) => (
          <details key={a.id} className="byt199-alert byt199-alert-high tp-alert tp-alert-high" open={!!a.checklist}>
            <summary>{clinicalText(a.title)}</summary>
            <p>{clinicalText(a.text)}</p>
            {a.checklist && (
              <ul>
                {a.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {a.sources && <details><summary>Nguồn chứng cứ</summary><span className="tp-alert-src">{a.sources.join("; ")}</span></details>}
          </details>
        ))}

        {card.linkTexts && card.linkTexts.length > 0 && (
          <DrugActionLinks compact navigation={false} texts={card.linkTexts} scenario={card.linkScenario} />
        )}
      </div>
    </article>
  );
}

function Section({ section }: { section: TxSection }) {
  const durationColumn=new Set(section.cards.map(card=>card.duration)).size>1;
  const commonDuration=!durationColumn?section.cards[0]?.duration:undefined;
  const body = (
    <div className="tp-cards">
      {section.cards.map((card, i) => (
        <div key={card.id}>{i > 0 && section.key !== 'adjunct' && !(card.condition && section.cards[i-1].condition && card.condition !== section.cards[i-1].condition) && <div className="tp-or"><span>Hoặc</span></div>}<Card card={card} label={cardLabel(section,i)} durationColumn={durationColumn} hideRegimenDuration={!!commonDuration}/></div>
      ))}
      {commonDuration&&<p className="tp-duration-common"><strong>Thời gian điều trị:</strong> {clinicalText(commonDuration)}</p>}
    </div>
  );
  if (section.collapsible) {
    return (
      <details className="tp-section tp-section-collapsible" open={section.defaultOpen}>
        <summary className="tp-section-title">
          {section.title} ({section.cards.length})
        </summary>
        {body}
      </details>
    );
  }
  return (
    <section className="tp-section">
      {section.key !== 'equal' && <h4 className="tp-section-title">{section.title}</h4>}
      {body}
    </section>
  );
}

export default function TreatmentPanel({
  scenarios,
  scenario,
  initialChoice,
  onScenario,
  scenarioHint,
  sourceTag,
  sections,
  emptyText,
  notes = [],
  detailNotes,
  comparison,
  monitoring = [],
  sources,
  footer,
  rationale,
}: Props) {
  const [picked,setPicked] = useState<string>(initialChoice ?? '');
  const context=useAbxLinkContext();
  const disease=DISEASES.find(d=>d.id===context.diseaseId);
  const stream=disease?getStream(disease):'empiric';
  const heading=stream==='antifungal'?'Điều trị kháng nấm':stream==='tuberculosis'?'Phác đồ điều trị lao':stream==='pathogen'?'Điều trị theo tác nhân':stream==='prophylaxis'?'Dự phòng nhiễm khuẩn':'Kháng sinh theo kinh nghiệm';
  const hasSelection=!scenarios || scenarios.length<=1 || (!!picked && scenarios.some(s=>s.value===picked) && picked===scenario);
  const shownNotes = notes.slice(0, NOTE_LIMIT);
  const moreNotes = notes.slice(NOTE_LIMIT);
  const hasNotes = notes.length > 0 || monitoring.length > 0 || (detailNotes?.items.length ?? 0) > 0;
  /* Mot khoi nguon duy nhat cho ca khung: nguon chung + nguon tung the, khong trung lap, moi nhat truoc. */
  const allCitations = citeSources([...(sources.length ? sources : sourceTag ? [sourceTag] : []), ...sections.flatMap((sec) => sec.cards.flatMap((c) => c.sources ?? []))]);
  return (
    <div className="tp">
      {/* (2) Benh canh lam sang – mot hang: nhan | danh sach chon */}
      {scenarios && scenarios.length > 1 && <ClinicalScenarioPicker scenarios={scenarios} value={picked} onChange={value=>{setPicked(value);onScenario?.(value);}} />}
      {scenarios && scenarios.length === 1 && ((scenarios[0].criteria?.length ?? 1) > 0 || !!scenarioHint) && (
        <div className="tp-box tp-scn">
          <strong className="tp-scn-label">Tiêu chí áp dụng</strong>
          {(
            <span className="tp-scn-single">{scenarios[0].label}</span>
          )}
          {scenarioHint && <div className="tp-scn-hint">{scenarioHint}</div>}
        </div>
      )}

      {/* (3) Phac do khang sinh kinh nghiem */}
      {!hasSelection && <ClinicalSources sources={sourceTag?[sourceTag]:[]} diseaseId={context.diseaseId} />}
      {hasSelection && scenarioHint && scenarios && scenarios.length > 1 && !scenarios.find(s=>s.value===picked)?.criteria?.includes(typeof scenarioHint==='string'?scenarioHint:'') && <p className="tp-selected-context">{typeof scenarioHint==='string'?clinicalText(scenarioHint):scenarioHint}</p>}
      {hasSelection && <><section className="tp-box tp-regimens">
        <div className="tp-box-head">
          <h3>{heading}</h3>
        </div>
        {sections.length > 0 ? sections.map((s) => <Section key={s.key} section={s} />) : <p className="tp-empty">{emptyText ?? "Không có phác đồ cho bệnh cảnh này."}</p>}
        {rationale && EMPIRIC_TREATMENT_UI_RULES.explainClinicalRationale && <RationaleAccordion rationale={rationale} />}
        {footer}
        {!EMPIRIC_TREATMENT_UI_RULES.showDrugToolsInRegimen && sections.length > 0 && (
          <p className="tp-module-links">Hiệu chỉnh liều theo chức năng thận, gan và kiểm tra tương tác thuốc: xem module{" "}
            <a href={SPECIALIZED_MODULE_LINKS.doseAdjustment.href}>{SPECIALIZED_MODULE_LINKS.doseAdjustment.label}</a> và{" "}
            <a href={SPECIALIZED_MODULE_LINKS.interactions.href}>{SPECIALIZED_MODULE_LINKS.interactions.label}</a>.</p>
        )}
      </section>
      {comparison}

      {/* (4) Luu y lam sang + (5) Nguon tham khao (mot dong, cuoi khung) */}
      {(hasNotes || allCitations.length > 0) && (
        <section className="tp-box tp-notes">
          {hasNotes && (
            <div className="tp-notes-body">
              <span className="tp-info" aria-hidden="true">i</span>
              <div>
                <h3>Lưu ý lâm sàng</h3>
                {shownNotes.length > 0 && (
                  <ClinicalNotes items={shownNotes}/>
                )}
                {moreNotes.length > 0 && (
                  <details>
                    <summary>Thêm {moreNotes.length} lưu ý</summary>
                    <ClinicalNotes items={moreNotes}/>
                  </details>
                )}
                {detailNotes && detailNotes.items.length > 0 && (
                  <details className="tp-detail-notes">
                    <summary>{detailNotes.title} ({detailNotes.items.length})</summary>
                    <ClinicalNotes items={detailNotes.items}/>
                  </details>
                )}
                {monitoring.length > 0 && (
                  <>
                    <h4>Theo dõi hiệu quả và an toàn</h4>
                    <ClinicalNotes items={monitoring}/>
                  </>
                )}
              </div>
            </div>
          )}
          {allCitations.length > 0 && (
            <details className="tp-sources">
              <summary>Nguồn và đối chiếu</summary>
              <ul>{allCitations.map((c) => <li key={c.key}>{c.url ? <a href={c.url} target="_blank" rel="noreferrer">{c.label}</a> : c.label}</li>)}</ul>
            </details>
          )}
        </section>
      )}
      </>}
      <TpStyle />
    </div>
  );
}

function TpStyle() {
  return (
    <style>{`
      .tp { display: grid; gap: 12px; min-width: 0; color: #17364b; }
      .tp summary { cursor: pointer; color: #0b6b8a; font-weight: 600; }
      .tp :is(a, button, select, summary):focus-visible { outline: 3px solid #087f89; outline-offset: 3px; }
      .tp-cond, .tp-alert, .tp-card-label { overflow-wrap: break-word; }
      .tp-review-status { margin: 6px 0 12px; padding: 7px 10px; border-left: 3px solid #d97706; background: #fffbeb; color: #78350f; font-size: 12px; line-height: 1.6; }
      .tp-box { background: #fff; border: 1px solid #dfe8ee; border-radius: 10px; padding: 14px 18px; min-width: 0; }
      .tp-scn { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 6px 14px; align-items: center; }
      .tp-scn-label { font-size: 13px; font-weight: 700; }
      .tp-scn-select { width: 100%; min-width: 0; padding: 8px 10px; border: 1px solid #c9d8e2; border-radius: 7px; background: #fff; font-size: 13.5px; color: #17364b; }
      .tp-scn-single { font-size: 13.5px; }
      .tp-scn-hint { grid-column: 2; font-size: 12px; color: #5b7384; }
      .tp-box-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; flex-wrap: wrap; padding-bottom: 10px; margin: 0 -18px 4px; padding-left: 18px; padding-right: 18px; border-bottom: 1px solid #edf2f6; }
      .tp-box h3 { margin: 0; font-size: 15px; font-weight: 800; }
      .tp-source-tag { font-size: 12px; color: #6b8293; }
      .tp-section { display: grid; gap: 8px; margin-top: 12px; }
      .tp-section-title { margin: 0; font-size: 13px; font-weight: 800; color: #0b6b8a; padding-left: 8px; border-left: 3px solid #0b6b8a; }
      details.tp-section > summary { cursor: pointer; }
      details.tp-section .tp-cards { margin-top: 8px; }
      .tp-cards { display: grid; gap: 8px; }
      .tp-card { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 4px 14px; border: 1px solid #e3ebf1; border-radius: 8px; padding: 10px 14px; min-width: 0; }
      .tp-card-noside { grid-template-columns: minmax(0, 1fr); }
      .tp-card-head { display: flex; flex-direction: column; align-items: flex-start; gap: 5px; padding-top: 2px; }
      .tp-card-label { font-size: 13px; color: #12324a; }
      .tp-card-head-row { flex-direction: row; flex-wrap: wrap; align-items: center; padding-top: 0; }
      .tp-card-main { display: grid; gap: 6px; min-width: 0; }
      .tp-or { display:grid; grid-template-columns:64px minmax(0,1fr); margin:5px 0; font-size:12px; color:#587183; }.tp-or span { text-align:center; font-weight:700; white-space:nowrap; }
      .tp-review { margin:3px 0; padding:6px 9px; background:#fffbeb; border-left:3px solid #d69525; font-size:12px; color:#92400e; }
      .tp-card-source { font-size:12px; }.tp-card-source ul { padding-left:18px; }.tp-selected-context { font-size:13px; }
      .tp-flag { font-size: 10.5px; font-weight: 700; border-radius: 999px; padding: 1px 7px; line-height: 1.5; }
      .tp-flag-lock { background: #9f1239; color: #fff; }
      .tp-flag-warn { background: #fff7ed; color: #9a3412; border: 1px solid #fdba74; }
      .tp-flag-info { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
      .tp-module-links { margin: 10px 0 0; font-size: 12.5px; color: #4b6576; }
      .tp-module-links a { color: #087f89; font-weight: 700; text-decoration: underline; }
      .tp-cond { margin: 0; font-size: 13px; font-weight: 600; color: #0b4f6c; }
      .tp-alert { border-radius: 8px; padding: 8px 10px; font-size: 12.5px; }
      .tp-alert p { margin: 4px 0; }
      .tp-alert ul { margin: 4px 0; padding-left: 18px; }
      .tp-alert-critical { background: #fff1f2; border: 1px solid #fda4af; color: #881337; }
      .tp-alert-high { background: #fffbeb; border: 1px solid #fcd34d; color: #78350f; }
      .tp-alert-high > summary { cursor: pointer; font-weight: 700; }
      .tp-alert-src { display: block; font-size: 11px; opacity: .85; }
      .tp-empty { font-size: 13px; color: #5b7384; }
      .tp-notes-body { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 10px; align-items: start; }
      .tp-info { width: 22px; height: 22px; border-radius: 6px; background: #e6f1f6; color: #0b6b8a; font: 800 12px/22px Georgia, serif; text-align: center; }
      .tp-notes h3 { margin: 1px 0 4px; font-size: 14px; }
      .tp-notes ul { margin: 4px 0 0; padding-left: 18px; font-size: 13px; line-height: 1.55; }
      .tp-notes li + li { margin-top: 7px; }
      .tp-notes h4 { margin: 10px 0 0; font-size: 13px; }
      .tp-notes details { font-size: 13px; margin-top: 4px; }
      .tp-notes summary { cursor: pointer; color: #087f89; font-weight: 700; font-size: 12px; }
      .tp-detail-notes ul { color: #4b6576; font-size: 12.5px; }
      .tp-sources { margin: 12px -18px 0; padding: 10px 18px 0; border-top: 1px solid #edf2f6; font-size: 12px; color: #4b6576; overflow-wrap: break-word; }
      .tp-notes:not(:has(.tp-notes-body)) .tp-sources { margin-top: 0; padding-top: 0; border-top: 0; }
      /* UI9: single white column, flat treatment rows. */
      .tp { color:#12283c; gap:20px; }.tp-box { border:0; border-radius:0; padding:0; }
      .tp-box-head { margin:0 0 8px; padding:16px 0 12px; border-top:1px solid #d8e4ea; border-bottom:0; }
      .tp-box h3 { font-size:20px; color:#10243e; }.tp-card,.tp-card-noside { display:block; border:0; border-radius:0; padding:12px 0; border-bottom:1px solid #dfe8ee; }
      .tp-card-head { flex-direction:row; flex-wrap:wrap; margin-bottom:8px; }.tp-card-label { font-size:12px; color:#557080; }
      .tp-notes { border-top:1px solid #dfe8ee; padding-top:16px; }.tp-sources { margin:12px 0 0; padding:12px 0 0; }.tp-scn { display:block; }
      @media (max-width: 640px) {
        .tp-box { padding: 12px; }
        .tp-box-head { margin: 0 -12px 4px; padding-left: 12px; padding-right: 12px; }
        .tp-sources { margin: 12px -12px 0; padding: 10px 12px 0; }
        .tp-scn { grid-template-columns: minmax(0, 1fr); }
        .tp-scn-hint { grid-column: 1; }
        .tp-card { grid-template-columns: minmax(0, 1fr); padding: 10px 12px; }
        .tp-card-head { flex-direction: row; flex-wrap: wrap; align-items: center; }
      }
    `}</style>
  );
}
