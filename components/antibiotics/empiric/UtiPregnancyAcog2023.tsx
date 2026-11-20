"use client";
/* Nhiem khuan tiet nieu thai ky – cong cu chon khang sinh theo ACOG Clinical Consensus No. 4 (2023) va IDSA 2019 (khuan nieu khong trieu chung). Du lieu: uti-preg-acog2023.ts */
import { useState } from "react";
import { ALLERGY_OPTS, FORM_OPTS, TRI_OPTS, utiPlan, type BlAllergy, type Trimester, type UtiForm } from "./uti-preg-acog2023";
import { Row, Rx, RxToolStyle, Seg, SourceList } from "./rx-tool";
import { citeIntlSources } from "@/lib/antibiotics/source-citation";

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}

export default function UtiPregnancyAcog2023() {
  const [form, setForm] = useState<UtiForm>("cystitis");
  const [trimester, setTrimester] = useState<Trimester>("t23");
  const [allergy, setAllergy] = useState<BlAllergy>("none");
  const [empiric, setEmpiric] = useState(true);
  const [smxRes, setSmxRes] = useState(false);
  const [g6pd, setG6pd] = useState(false);
  const [afterPyelo, setAfterPyelo] = useState(false);
  const f = FORM_OPTS.find((x) => x.id === form)!;
  const o = utiPlan({ form, trimester, allergy, empiric, smxRes, g6pd, afterPyelo });
  const lower = form === "asb" || form === "cystitis";

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo chẩn đoán</p>
        <h3>Nhiễm khuẩn tiết niệu thai kỳ</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Thể bệnh</li><li>Tuổi thai, dị ứng</li><li>Phác đồ</li><li>Thời gian</li><li>Theo dõi, dự phòng</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Thể bệnh">
          <Seg label="Thể bệnh" value={form} onChange={setForm} options={FORM_OPTS} />
          <p className="sa24-tip">{f.criteria}</p>
        </Row>
        {form !== "pyelo" && (
          <Row label="Tuổi thai">
            <Seg label="Tuổi thai" value={trimester} onChange={setTrimester} options={TRI_OPTS} />
          </Row>
        )}
        <Row label="Dị ứng beta-lactam">
          <Seg label="Dị ứng beta-lactam" value={allergy} onChange={setAllergy} options={ALLERGY_OPTS} />
        </Row>
        {(lower || form === "suppress") && (
          <Row label="Yếu tố bổ sung">
            {form === "cystitis" && <Chk on={empiric} set={setEmpiric}>Chưa có kết quả cấy, kháng sinh đồ</Chk>}
            {form === "cystitis" && empiric && <Chk on={smxRes} set={setSmxRes}>Tỷ lệ kháng sulfamethoxazol-trimethoprim tại chỗ &gt; 20%</Chk>}
            {form === "suppress" && <Chk on={afterPyelo} set={setAfterPyelo}>Sau điều trị viêm thận bể thận</Chk>}
            <Chk on={g6pd} set={setG6pd}>Thiếu men G6PD</Chk>
          </Row>
        )}
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Thể bệnh</b> {f.label}</p>
          <p><b>Phác đồ</b> {o.headline}</p>
          <p><b>Hướng dẫn</b> ACOG 2023{form === "asb" ? "; IDSA 2019" : ""}</p>
        </div>
        {o.blocks.map((b) => (
          <div key={b.title}>
            <h4>{b.title}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            <Rx items={b.items} />
          </div>
        ))}
        {o.avoid.length > 0 && (<><h4>Không khuyến cáo</h4><Rx items={o.avoid} /></>)}
        {o.notes.length > 0 && (<><h4>Lưu ý</h4><ul className="sp-notes">{o.notes.map((n) => <li key={n}>{n}</li>)}</ul></>)}
      </section>
      <SourceList sources={citeIntlSources(["acog-uti-pregnancy-2023", "idsa-asb-2019"])} notes={["ACOG: khuyến cáo được hội đồng bỏ phiếu đạt đồng thuận từ 75%, không xếp mức GRADE.","IDSA: GRADE mạnh, yếu; bằng chứng cao, trung bình, thấp.","Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt."]} />
      <RxToolStyle />
      <style>{`.sp-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }`}</style>
    </article>
  );
}
