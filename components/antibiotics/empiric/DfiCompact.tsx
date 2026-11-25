"use client";
/* Nhiem trung ban chan dai thao duong – bang gon cho tab Viet Nam (QĐ 1530) va Quoc te (IWGDF/IDSA 2023). Du lieu: dfi-data.ts */
import { Grade, RxToolStyle, SourceList } from "./rx-tool";
import { citeIntlSources, citeSources } from "@/lib/antibiotics/source-citation";
import { SPECIALIZED_MODULE_LINKS } from "@/lib/antibiotics/empiric-ui-rules";
import {
  BYT_FOOT, BYT_GROUPS, BYT_LEGEND, BYT_POINTS, IWGDF_AVOID, IWGDF_DURATION, IWGDF_GRADES, IWGDF_GRADE_NOTE,
  IWGDF_GROUPS, IWGDF_MRSA_RISK, IWGDF_OSTEO_DX, IWGDF_POINTS, type DfiGroup, type DfiPoint,
} from "./dfi-data";

function RegimenTable({ groups }: { groups: DfiGroup[] }) {
  return (
    <div className="dfi-tbl" role="table" aria-label="Phác đồ kinh nghiệm">
      <div className="dfi-hd" role="row">
        <span role="columnheader">Yếu tố</span><span role="columnheader">Tác nhân</span><span role="columnheader">Chọn một</span>
      </div>
      {groups.map((g) => (
        <div key={g.label} role="rowgroup">
          <p className="dfi-grp" role="row"><b>{g.label}</b> · {g.sub}</p>
          {g.rows.map((r) => (
            <div key={r.factor} className="dfi-row" role="row">
              <span className="dfi-f" role="cell">{r.factor}</span>
              <span className="dfi-b" role="cell">{r.bugs}</span>
              <span className="dfi-rx" role="cell">
                {r.lead && <em>{r.lead}</em>}
                <ul>{r.rx.map((x) => <li key={x}>{x}</li>)}</ul>
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Points({ items, refs }: { items: DfiPoint[]; refs?: boolean }) {
  return (
    <dl className="dfi-pts">
      {items.map((p) => (
        <div key={p.k}>
          <dt>{p.k}</dt>
          <dd>{p.t}{refs && <span className="dfi-ref"> {p.ref}</span>}{p.g && <> <Grade g={p.g} /></>}</dd>
        </div>
      ))}
    </dl>
  );
}

const DoseLink = ({ text }: { text: string }) => (
  <p className="dfi-note">{text} Hiệu chỉnh theo chức năng thận, gan: <a href={SPECIALIZED_MODULE_LINKS.doseAdjustment.href}>{SPECIALIZED_MODULE_LINKS.doseAdjustment.label}</a>.</p>
);

export function DfiByt1530() {
  return (
    <article className="sa24 dfi">
      <header>
        <p className="sa24-eyebrow">Phác đồ kinh nghiệm · QĐ 1530/QĐ-BYT</p>
      </header>
      <RegimenTable groups={BYT_GROUPS} />
      <div className="dfi-notes">
        <p className="dfi-note">{BYT_LEGEND} <span className="dfi-ref">tr. 32–33</span></p>
        {BYT_FOOT.map((n) => <p key={n} className="dfi-note">{n} <span className="dfi-ref">tr. 33</span></p>)}
        <DoseLink text="Liều dùng: theo tờ hướng dẫn sử dụng của chế phẩm." />
      </div>
      <h4>Nguyên tắc</h4>
      <Points items={BYT_POINTS} refs />
      <SourceList sources={citeSources(["QĐ 1530/QĐ-BYT"])} />
      <RxToolStyle /><DfiStyle />
    </article>
  );
}

export function DfiIwgdf2023() {
  return (
    <article className="sa24 dfi">
      <header>
        <p className="sa24-eyebrow">Phác đồ kinh nghiệm · IWGDF/IDSA 2023</p>
      </header>
      <dl className="dfi-pts dfi-grades">
        {IWGDF_GRADES.map((g) => <div key={g.g}><dt>{g.g}</dt><dd>{g.t}</dd></div>)}
      </dl>
      <p className="dfi-note">{IWGDF_GRADE_NOTE}</p>
      <RegimenTable groups={IWGDF_GROUPS} />
      <div className="dfi-notes">
        <p className="dfi-note">{IWGDF_MRSA_RISK}</p>
        <DoseLink text="Liều thông thường cho nhiễm trùng nặng; viêm xương: mức cao của khoảng liều." />
      </div>
      <h4>Thời gian</h4>
      <table className="dfi-dur">
        <tbody>{IWGDF_DURATION.map((d) => <tr key={d.k}><th scope="row">{d.k}</th><td>{d.route}</td><td><b>{d.d}</b></td></tr>)}</tbody>
      </table>
      <h4>Khuyến cáo chính</h4>
      <Points items={IWGDF_POINTS} />
      <details className="dfi-more"><summary>Chẩn đoán viêm xương</summary><Points items={IWGDF_OSTEO_DX} /></details>
      <details className="dfi-more"><summary>Không khuyến cáo</summary><Points items={IWGDF_AVOID} /></details>
      <SourceList sources={citeIntlSources(["iwgdf-idsa-2023"])} notes={["Mức khuyến cáo GRADE: mạnh hoặc có điều kiện; độ tin cậy cao, trung bình, thấp; TH tốt = thực hành tốt."]} />
      <RxToolStyle /><DfiStyle />
    </article>
  );
}

function DfiStyle() {
  return <style>{`
    .dfi h4 { margin: 0; font-size: 13px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: #0b3a5b; }
    .dfi-tbl { border: 1px solid #dfe8ee; border-radius: 12px; overflow: hidden; font-size: 13.5px; line-height: 1.5; color: #10243e; }
    .dfi-hd, .dfi-row { display: grid; grid-template-columns: 200px 190px minmax(0,1fr); gap: 12px; padding: 7px 12px; }
    .dfi-hd { background: #f1f6f9; font-size: 12px; font-weight: 800; color: #0b3a5b; }
    .dfi-grp { margin: 0; padding: 6px 12px; background: #e6f4ef; color: #0b4d34; font-size: 13px; border-top: 1px solid #d3e7de; }
    .dfi-row { border-top: 1px solid #edf2f6; }
    .dfi-f { font-weight: 700; }
    .dfi-b { color: #4b6576; font-size: 12.5px; }
    .dfi-rx ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 2px; }
    .dfi-rx li { padding-left: 12px; position: relative; }
    .dfi-rx li::before { content: ""; position: absolute; left: 2px; top: .65em; width: 4px; height: 4px; border-radius: 50%; background: #087f89; }
    .dfi-rx em { display: block; font-style: normal; font-weight: 700; color: #9a4f00; font-size: 12.5px; }
    .dfi-notes { display: grid; gap: 4px; }
    .dfi-note { margin: 0; font-size: 12.5px; line-height: 1.55; color: #4b6576; }
    .dfi-note a { color: #087f89; font-weight: 700; }
    .dfi-ref { font-size: 11.5px; color: #8097a6; white-space: nowrap; }
    .dfi-pts { margin: 0; display: grid; border: 1px solid #e3eaf0; border-radius: 10px; overflow: hidden; }
    .dfi-pts > div { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 12px; padding: 6px 12px; border-top: 1px solid #edf2f6; font-size: 13.5px; line-height: 1.5; }
    .dfi-pts > div:first-child { border-top: 0; }
    .dfi-pts dt { font-weight: 700; color: #0b3a5b; }
    .dfi-pts dd { margin: 0; color: #1f3347; }
    .dfi-dur { width: 100%; border-collapse: collapse; font-size: 13.5px; border: 1px solid #e3eaf0; }
    .dfi-dur th, .dfi-dur td { padding: 6px 10px; border-top: 1px solid #edf2f6; text-align: left; vertical-align: top; }
    .dfi-dur th { font-weight: 600; color: #1f3347; }
    .dfi-dur td { color: #4b6576; }
    .dfi-dur td:last-child { white-space: nowrap; color: #10243e; }
    .dfi-more { border: 1px solid #dce6ed; border-radius: 8px; padding: 8px 12px; background: #f7fafc; }
    .dfi-more > summary { cursor: pointer; font-size: 13px; font-weight: 700; color: #1e3a5f; }
    .dfi-more .dfi-pts { margin-top: 8px; background: #fff; }
    @media (max-width: 720px) {
      .dfi-hd { display: none; }
      .dfi-row { grid-template-columns: minmax(0,1fr); gap: 2px; }
      .dfi-pts > div { grid-template-columns: minmax(0,1fr); gap: 0; }
      .dfi-dur td:nth-child(2) { display: none; }
    }
  `}</style>;
}
