/*
  FILE: components/antibiotics/treatment/DoseTable.tsx

  MASTER TASK 6 – BANG LIEU DUNG CHUNG (69 mat benh, bo chon, khuyen cao quoc te, module CAP/HAP).

  Hien thi du lieu co cau truc tu lib/antibiotics/regimen-structure.ts:
    - Moi nhom thuoc la mot bang: Thuoc | Lieu/lan | Duong dung | Khoang cach | Thoi gian.
    - Giua cac nhom: "+ PHOI HOP" (bat buoc) hoac "± THEM NEU CO CHI DINH" (tuy chon).
    - Nhom "chon 1": ghi ro "Chon 1 trong N". Nhom co dinh nhieu thuoc (vd. lao HRZE): "Dung dong thoi".
    - O trong (—) = nguon khong neu; KHONG tu dien.
    - NEEDS_STRUCTURED_REVIEW / NO_DOSE: hien NGUYEN VAN, khong ve bang lieu.
  Mobile (< 640 px): moi hang thanh the thuoc, khong cuon ngang.
*/

import {
  optionsFor,
  type DrugGroup,
  type StructureStatus,
  type StructuredDrug,
} from "@/lib/antibiotics/regimen-structure";
import { Fragment } from "react";
import RegimenDrugTools from "./RegimenDrugTools";
import { clinicalText } from "@/lib/antibiotics/presentation-text";
import { EMPIRIC_TREATMENT_UI_RULES } from "@/lib/antibiotics/empiric-ui-rules";

type Props = {
  groups: DrugGroup[];
  status: StructureStatus;
  /* Thoi gian dieu tri cua ca phac do (hien mot lan duoi bang). */
  duration?: string;
  /* Doi tuong dang xem: loc hang lieu nguoi lon / tre em. */
  population?: "adult" | "child";
  /* Cac dong la lua chon doc lap (khuyen cao quoc te): khong noi bang "+ phoi hop". */
  independent?: boolean;
  hideDailyDose?: boolean;
  durationColumn?: boolean;
  hideRegimenDuration?: boolean;
  sourceDoseAbsent?: boolean;
  /* The chua da co canh bao "Cần thẩm định" cua tinh trang lieu: khong nhac lai trong bang. */
  hideReviewNote?: boolean;
};

const MISSING_DOSE = "Cần xác minh liều";

function doseText(o: StructuredDrug): string {
  if (!o.dose) return MISSING_DOSE;
  // Preserve explicit daily context when the legacy parser omitted it from the
  // structured unit. Do not convert a daily total into a per-administration dose.
  const primaryDose = o.raw.split(/[;(\n]/u)[0];
  if (/\/\s*(?:ngày|day|24\s*h)/iu.test(primaryDose) && !/\/\s*(?:ngày|day|24\s*h)/iu.test(o.doseUnit ?? "")) return clinicalText(o.raw);
  return clinicalText(`${o.dose} ${o.doseUnit ?? ""}`.trim());
}

/* Cau lieu goc da ghi duong dung / cach chia thi khong gan lai (tranh "TM/ngày chia 4 lần · Tĩnh mạch · chia 4 lần"). */
const ROUTE_IN_TEXT: Record<string, RegExp> = {
  "tĩnh mạch": /(?:^|[^\p{L}])(?:TM|tĩnh mạch|truyền)(?:[^\p{L}]|$)/iu,
  "uống": /(?:^|[^\p{L}])uống(?:[^\p{L}]|$)/iu,
  "tiêm bắp": /(?:^|[^\p{L}])(?:TB|tiêm bắp)(?:[^\p{L}]|$)/iu,
};
function routeAlreadyStated(dose: string, route?: string): boolean {
  if (!route) return false;
  const re = ROUTE_IN_TEXT[route.trim().toLowerCase()];
  return re ? re.test(dose) : dose.toLowerCase().includes(route.trim().toLowerCase());
}
function intervalAlreadyStated(dose: string, interval?: string): boolean {
  return !!interval && dose.toLowerCase().includes(interval.trim().toLowerCase());
}

const SOURCE_WORDING_FLAG = /xem nguyên văn|liều như trên/iu;
/* Chi phan bo sung sau menh de dau (da the hien trong o "Cách dùng"), tranh lap lai. */
function sourceExtra(o: StructuredDrug): string {
  const raw = clinicalText(o.raw);
  const cut = raw.indexOf(";");
  return cut > 0 && raw.slice(cut + 1).trim() ? `Lưu ý theo văn bản: ${raw.slice(cut + 1).trim()}` : `Theo văn bản: ${raw}`;
}
function needsSourceWording(o: StructuredDrug): boolean {
  return o.flags.some((f) => SOURCE_WORDING_FLAG.test(f));
}

function ruleText(g: DrugGroup, n: number): string | undefined {
  if (g.rule === "one-of") return `Chọn 1 trong ${n}`;
  if (g.rule === "by-population") return "Liều theo đối tượng";
  if (n > 1) return "Dùng đồng thời";
  return undefined;
}

function Row({ o, showCourse, duration, hideDailyDose, marker = "", showRelation }: { o: StructuredDrug; showCourse: boolean; duration?:string; hideDailyDose?: boolean; marker?: string; showRelation:boolean }) {
  const critical = o.flags.filter((f) => f.startsWith("KIỂM TRA"));
  const dose = doseText(o);
  const showRoute = !routeAlreadyStated(dose, o.route);
  const showInterval = !intervalAlreadyStated(dose, o.interval);
  return (
    <tr className={critical.length ? "tx-row tx-row-warn" : "tx-row"}>
      {showRelation && <td className="tx-marker" data-label="Quan hệ lựa chọn">{marker}</td>}
      <td data-label="Hoạt chất" className="tx-drug">
        <strong>{o.name}</strong>
        {o.populationLabel && <span className="tx-pop">{o.populationLabel}</span>}
        {o.context && <span className="tx-ctx">{o.context}</span>}
        {critical.map((f) => (
          <span key={f} className="tx-crit" role="alert">{f}</span>
        ))}
      </td>
      <td data-label="Cách dùng">
        <div>
          <span data-dose="">{dose}</span>{showRoute && o.route && <><span className="tx-separator"> · </span><span data-route="">{clinicalText(o.route)}</span></>}{showInterval && o.interval && <><span className="tx-separator"> · </span><span data-interval="">{clinicalText(o.interval)}</span></>}
          {o.dailyDose && !hideDailyDose && EMPIRIC_TREATMENT_UI_RULES.showCalculatedDailyDose && <span className="tx-sub">= {o.dailyDose}</span>}
          {o.maxDose && <span className="tx-sub">{o.maxDose}</span>}
          {o.infusionDuration && <span className="tx-sub">{o.infusionDuration}</span>}
          {/* Ghi chu can doc cau nguon (giai doan, muc do, phoi hop...): hien cau nguon ngay trong o, thay cho khoi chi tiet rieng. */}
          {needsSourceWording(o) && <span className="tx-sub tx-source-line">{sourceExtra(o)}</span>}
          {o.flags.filter((f) => f.startsWith("Ghi chú kèm")).map((f) => <span key={f} className="tx-sub">{clinicalText(f.replace(/^Ghi chú kèm:\s*/u, ""))}</span>)}
        </div>
      </td>
      {showCourse && <td data-label="Thời gian"><div>{clinicalText(o.course || duration || "") || "—"}</div></td>}
    </tr>
  );
}

/* Nhom "chon mot" ma cau nguon co phoi hop nam giua cau (vd. "hoặc ampicilin kết hợp gentamycin",
   "ABLC + flucytosin"): khong tu tach thanh cac lua chon don le – hien nguyen cau nguon. */
const MID_COMBINATION = /[\p{L}\d)]\s+(?:kết hợp|phối hợp)\s+\p{L}|[\p{L}\d)*]\s\+\s\p{L}/iu;
function hidesCombination(groups: DrugGroup[]): boolean {
  return groups.some((g) => g.rule === "one-of" && g.raw.some((r) => MID_COMBINATION.test(`${r.name} ${r.dose ?? ""}`)));
}

export default function DoseTable({ groups, status, duration, population, independent, hideDailyDose, durationColumn, hideRegimenDuration, hideReviewNote }: Props) {
  if (status === "NEEDS_STRUCTURED_REVIEW" || status === "NO_DOSE" || hidesCombination(groups)) {
    return (
      <div className="tx">
        {status === "NO_DOSE" && !hideReviewNote && <p className="tx-dur">Liều dùng theo tờ hướng dẫn sử dụng của chế phẩm.</p>}
        {/* Cau lieu goc hien ngay duoi ten thuoc (da bo Phu luc/Bang/trang); khong tach khoi "Nguon va doi chieu" rieng. */}
        <ul className="tx-listed">{groups.flatMap(g=>g.raw).map((r,i)=><li key={`${r.name}-${i}`}><strong>{r.name}</strong>{r.dose && <span className="tx-raw-dose">: {clinicalText(r.dose)}</span>}{EMPIRIC_TREATMENT_UI_RULES.showDrugToolsInRegimen && <RegimenDrugTools name={r.name} texts={[`${r.name}: ${r.dose}`]}/>}</li>)}</ul>
        {duration && clinicalText(duration) && !hideRegimenDuration && <p className="tx-dur"><span>Thời gian điều trị</span> {clinicalText(duration)}</p>}
        <TxStyle />
      </div>
    );
  }

  return (
    <div className="tx">
      {groups.map((g, i) => {
        const opts = optionsFor(g, population);
        const courses = [...new Set(opts.map(o=>o.course).filter(Boolean))];
        const showCourse = !!durationColumn || courses.length > 1 || (courses.length > 0 && opts.some(o=>!o.course));
        const sharedCourse = courses.length === 1 && opts.every(o=>!!o.course) ? courses[0] : undefined;
        const rule = ruleText(g, opts.length);
        const showRelation=opts.length>1&&(g.rule==='one-of'||g.rule==='all');
        return (
          <div key={i} className="tx-group">
            {i > 0 && !independent && (
              <div className={g.optional ? "tx-join tx-join-opt" : g.phase ? "tx-join tx-join-seq" : "tx-join"}>
                {g.phase ? "→ Sau đó" : g.optional ? "± Thêm nếu có chỉ định" : "+ Phối hợp"}
                {g.condition ? ` – ${g.condition}` : ""}
              </div>
            )}
            {(g.label || rule) && (
              <div className="tx-ghead">
                {g.label && g.label !== "Phối hợp" && <strong>{g.label}</strong>}
                {rule && <span className="tx-rule">{rule}</span>}
                {i === 0 && g.condition && <span className="tx-cond">{g.condition}</span>}
              </div>
            )}
            <table className={`tx-table${showRelation?'':' tx-table-no-relation'}`}>
              <thead>
                <tr>
                  {showRelation && <th className="tx-marker"><span className="tx-sr">Quan hệ lựa chọn</span></th>}
                  <th>Hoạt chất</th>
                  <th>Cách dùng</th>
                  {showCourse && <th>Thời gian</th>}
                </tr>
              </thead>
              <tbody>
                {opts.map((o, j) => <Fragment key={`${o.name}-${j}`}>
                  <Row o={o} showCourse={showCourse} duration={duration} hideDailyDose={hideDailyDose} showRelation={showRelation} marker={j === 0 ? "" : g.rule === "one-of" ? "Hoặc" : g.rule === "all" ? "+" : ""} />
                  {EMPIRIC_TREATMENT_UI_RULES.showDrugToolsInRegimen && <tr className="tx-tools-row"><td colSpan={2+Number(showRelation)+Number(showCourse)}><RegimenDrugTools name={o.name} texts={[o.raw]} /></td></tr>}
                </Fragment>)}
              </tbody>
            </table>
            {sharedCourse && clinicalText(sharedCourse) && !duration && !showCourse && <p className="tx-dur"><span>Thời gian điều trị</span> {clinicalText(sharedCourse)}</p>}
          </div>
        );
      })}
      {duration && clinicalText(duration) && !durationColumn && !hideRegimenDuration && <p className="tx-dur"><span>Thời gian điều trị</span> {clinicalText(duration)}</p>}
      {/* Khong lap "Chi tiết cách dùng theo văn bản": cach dung da the hien trong bang; truong chua xac minh hien ngay trong o. */}
      <TxStyle />
    </div>
  );
}

export function TxStyle() {
  return (
    <style>{`
      .tx { display: grid; gap: 6px; min-width: 0; }
      .tx-group { min-width: 0; }
      .tx-ghead { display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; margin: 2px 0 4px; font-size: 12.5px; }
      .tx-rule { font-size: 11px; font-weight: 800; color: #075985; background: #e0f2fe; border-radius: 999px; padding: 1px 8px; }
      .tx-cond { font-size: 12px; color: #7c2d12; }
      .tx-join { font-size: 11.5px; font-weight: 800; color: #0b6b8a; letter-spacing: .02em; margin: 2px 0; }
      .tx-join-opt { color: #92400e; }
      .tx-join-seq { color: #4b5563; }
      .tx-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 13px; }
      .tx-table th { text-align: left; font-size: 11px; font-weight: 700; color: #4b6576; border-bottom: 1px solid #dce6ed; padding: 4px 6px; }
      .tx-table td { vertical-align: top; padding: 6px; border-bottom: 1px solid #edf2f6; overflow-wrap: break-word; }
      .tx-table th.tx-marker, .tx-table td.tx-marker { width: 64px; min-width: 64px; text-align:center; font-weight:700; color:#087f89; white-space: nowrap; word-break: keep-all; hyphens: none; }
      .tx-table-no-relation th:first-child, .tx-table:not(.tx-table-no-relation) th:nth-child(2), .tx-table td.tx-drug { width: 32%; }
      .tx-tools-row td { padding-left:44px; }
      .tx-table-no-relation .tx-tools-row td { padding-left:0; }
      .tx-sr { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); }
      .tx-table th { overflow-wrap: break-word; }
      .tx-src summary:focus-visible { outline: 3px solid #087f89; outline-offset: 3px; }
      .tx-drug strong { display: block; }
      .tx-pop, .tx-ctx, .tx-sub { display: block; font-size: 11px; color: #5b7384; }
      .tx-pop { color: #075985; font-weight: 700; }
      .tx-crit { display: block; margin-top: 3px; font-size: 11px; font-weight: 800; color: #9f1239; }
      .tx-row-warn td { background: #fff1f2; }
      .tx-dur { font-size: 12.5px; margin: 2px 0 0; }
      .tx-dur span { font-weight: 700; color: #4b6576; margin-right: 4px; }
      .tx-src { font-size: 12px; color: #4b6576; }
      .tx-src summary { cursor: pointer; font-weight: 700; color: #087f89; }
      .tx-src ul { margin: 4px 0 0; padding-left: 18px; }
      .tx-notes { color: #7c2d12; }
      .tx-status { justify-self: start; font-size: 11px; font-weight: 800; border-radius: 999px; padding: 2px 8px; background: #fff7ed; color: #9a3412; border: 1px dashed #c2410c; }
      .tx-raw { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; font-size: 13px; }
      .tx-raw li { display: grid; gap: 2px; padding: 6px 8px; background: #f7fafc; border-radius: 8px; overflow-wrap: break-word; }
      .tx-listed { list-style:none; padding:0; margin:8px 0; }.tx-listed > li { padding:10px 0; border-bottom:1px solid #e1e9ee; }
      .tx-table th { background:#f3f6f8; padding:9px 8px; color:#132b43; font-size:13px; }.tx-table td { padding:10px 8px; }.tx-rule { border-radius:3px; background:transparent; padding:0; font-weight:600; }
      @media (max-width: 640px) {
        /* Mobile: ten thuoc mot dong; Lieu dung | Duong dung | Khoang cach lieu thanh 3 cot – van tach truong */
        .tx-table, .tx-table tbody { display: block; width: 100% !important; }
        .tx-table thead { display: none; }
        .tx-table tr { display: grid; grid-template-columns: 56px minmax(0,1fr); gap: 8px 4px; border: 0; border-bottom: 1px solid #edf2f6; padding: 10px 0; margin: 0; }
        .tx-table tr:last-child { border-bottom: 0; }
        .tx-table td { display: block; width: auto !important; border: 0; padding: 0; }
        .tx-table td::before { content: attr(data-label); display: block; font-size: 10.5px; font-weight: 700; color: #6b8293; }
        .tx-table tr > td { grid-column:2; }.tx-table td.tx-marker { grid-column:1; grid-row:1 / span 5; }
        .tx-table td.tx-marker::before { content:none; }
        .tx-table tr.tx-tools-row { display:block; padding-left:56px; }
        .tx-table td.tx-drug { grid-column: 2; }
        .tx-table td.tx-drug::before { content: none; }
        .tx-table-no-relation tr { grid-template-columns:minmax(0,1fr); }
        .tx-table-no-relation tr > td,.tx-table-no-relation td.tx-drug { grid-column:1; }
        .tx-table-no-relation tr.tx-tools-row { padding-left:0; }
      }
    `}</style>
  );
}
