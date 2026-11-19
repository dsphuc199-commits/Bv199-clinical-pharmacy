"use client";
/* Nhiem khuan tiet nieu phuc tap – cong cu chon khang sinh theo IDSA 2025. Du lieu: uti-idsa2025.ts, empPlan (gnb-bsi-intl.ts). */
import { useState } from "react";
import { empPlan, type Sev } from "./gnb-bsi-intl";
import { CUTI_CRITERIA, CUTI_SCOPE, DURATION_NOTES, ORAL_HIGH_DOSE, ORAL_PK, OTHER_DRUGS, SWITCH_ROWS, durationRows } from "./uti-idsa2025";
import { Row, Rx, RxToolStyle, Seg, SourceList } from "./rx-tool";

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}

const SEV_TEXT: Record<Sev, string> = { shock: "Sốc nhiễm khuẩn", sepsis: "Sepsis không sốc", none: "Không sepsis" };

export default function UtiIdsa2025({ title }: { title: string }) {
  const [sev, setSev] = useState<Sev>("none");
  const [oral, setOral] = useState(false);
  const [priorEsbl, setPriorEsbl] = useState(false);
  const [priorFqR, setPriorFqR] = useState(false);
  const [fq12m, setFq12m] = useState(false);
  const [priorPtzR, setPriorPtzR] = useState(false);
  const [priorTmpR, setPriorTmpR] = useState(false);
  const [bacteremia, setBacteremia] = useState(false);
  const [prostatitis, setProstatitis] = useState(false);

  const risk = { priorEsbl, priorFqR, fq12m, priorPtzR, priorTmpR };
  const isOral = sev === "none" && oral;
  const plan = empPlan({ sev, oral: isOral, ...risk });
  const step = empPlan({ sev: "none", oral: true, ...risk });
  const blocks = plan.blocks.filter((b) => b.items.length > 0);
  const stepBlocks = step.blocks.filter((b) => b.items.length > 0);

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo IDSA 2025</p>
        <h3>{title}</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Mức độ nặng</li><li>Nguy cơ kháng thuốc</li><li>Đặc điểm người bệnh</li><li>Kháng sinh đồ tại chỗ</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Mức độ nặng">
          <Seg label="Mức độ nặng" value={sev} onChange={setSev} options={[{ id: "none", label: "Không sepsis" }, { id: "sepsis", label: "Sepsis không sốc" }, { id: "shock", label: "Sốc nhiễm khuẩn" }] as const} />
          {sev === "none" && <Chk on={oral} set={setOral}>Điều trị đường uống</Chk>}
          <p className="sa24-tip">{CUTI_CRITERIA}</p>
        </Row>
        <Row label="Nguy cơ kháng thuốc">
          <Chk on={fq12m} set={setFq12m}>Đã dùng fluoroquinolon trong 12 tháng qua</Chk>
          <Chk on={priorFqR} set={setPriorFqR}>Cấy nước tiểu trước đây kháng fluoroquinolon</Chk>
          <Chk on={priorEsbl} set={setPriorEsbl}>Cấy nước tiểu gần đây có vi khuẩn sinh ESBL</Chk>
          <Chk on={priorPtzR} set={setPriorPtzR}>Cấy nước tiểu trước đây kháng piperacilin-tazobactam</Chk>
          <Chk on={priorTmpR} set={setPriorTmpR}>Cấy nước tiểu trước đây kháng trimethoprim-sulfamethoxazol</Chk>
        </Row>
        <Row label="Đặc điểm người bệnh">
          <Chk on={bacteremia} set={setBacteremia}>Nhiễm khuẩn huyết Gram âm</Chk>
          <Chk on={prostatitis} set={setProstatitis}>Nam giới, nghi viêm tuyến tiền liệt cấp</Chk>
          <p className="sa24-tip">Kiểm tra dị ứng, chống chỉ định, tương tác thuốc; tránh kháng sinh người bệnh đang dùng khi khởi phát hoặc vừa mới dùng.</p>
        </Row>
      </div>

      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Mức độ</b> {SEV_TEXT[sev]}{isOral ? ", đường uống" : ""}</p>
          <p><b>Phác đồ</b> {plan.headline}</p>
        </div>
        {blocks.map((b) => (
          <div key={b.title}>
            <h4>{b.title}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            <Rx items={b.items} />
          </div>
        ))}
        <div><h4>Thời gian điều trị</h4><Rx items={durationRows({ bacteremia, prostatitis })} /><ul className="cuti-notes">{DURATION_NOTES.map((n) => <li key={n}>{n}</li>)}</ul></div>
        <div><h4>Chuyển đường uống</h4><Rx items={SWITCH_ROWS} /></div>
        {!isOral && stepBlocks.map((b) => (
          <div key={b.title}>
            <h4>Thuốc uống khi chuyển: {b.title.toLowerCase()}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            <Rx items={b.items} />
          </div>
        ))}
        <p className="sa24-tip">{ORAL_HIGH_DOSE}</p>
        {plan.avoid.length > 0 && <div><h4>Không dùng</h4><Rx items={plan.avoid} /></div>}
        <div><h4>Thuốc khác</h4><Rx items={OTHER_DRUGS} /></div>
        <details className="sa24-more">
          <summary>Hấp thu và thải trừ của thuốc uống</summary>
          <table className="sa24-rx cuti-pk">
            <thead><tr><th scope="col">Thuốc</th><th scope="col">Hấp thu đường uống (%)</th><th scope="col">Thải qua nước tiểu (%)</th></tr></thead>
            <tbody>{ORAL_PK.map(([d, a, u]) => <tr key={d}><th scope="row">{d}</th><td>{a}</td><td>{u}</td></tr>)}</tbody>
          </table>
        </details>
        <div><h4>Lưu ý</h4><ul className="cuti-notes">{plan.notes.map((n) => <li key={n}>{n}</li>)}</ul></div>
      </section>
      <SourceList sources={["IDSA 2025 – Guideline on Management and Treatment of Complicated Urinary Tract Infections"]} notes={[CUTI_SCOPE, "Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt."]} />
      <RxToolStyle />
      <style>{`.cuti-notes { margin: 6px 0 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }
        .cuti-pk thead th { background: #f1f6f9; color: #0b3a5b; font-size: 12px; }
        .cuti-pk tbody th { width: 40%; }`}</style>
    </article>
  );
}
