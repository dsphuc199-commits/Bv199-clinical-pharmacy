"use client";
/* Lao phổi / lao màng não – công cụ chọn phác đồ theo WHO consolidated guidelines on tuberculosis,
   Module 4: treatment and care (2025), Chương 1–2 và Phụ lục 1. */
import { useState } from "react";
import { AGE_TEXT, RES_TEXT, tbPlan, type TbAge, type TbFq, type TbRes } from "./tb-who2025";
import { Row, Rx, RxToolStyle, Seg, SourceList } from "./rx-tool";
import { citeIntlSources } from "@/lib/antibiotics/source-citation";

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}

export default function TbWho2025({ site }: { site: "ptb" | "tbm" }) {
  const tbm = site === "tbm";
  const [res, setRes] = useState<TbRes>("ds");
  const [fq, setFq] = useState<TbFq>("unknown");
  const [age, setAge] = useState<TbAge>("adult");
  const [severe, setSevere] = useState(false);
  const [wt, setWt] = useState(55);
  const [renal, setRenal] = useState(false);
  const [preg, setPreg] = useState(false);
  const [hiv, setHiv] = useState(false);
  const [cd4, setCd4] = useState(false);
  const [sam, setSam] = useState(false);
  const [prior2y, setPrior2y] = useState(false);
  const [highE, setHighE] = useState(false);
  const child = age !== "adult";
  const ds = res === "ds";
  const o = tbPlan({ site, res, fq, age, severe: !tbm && severe, wt: wt > 0 ? wt : 55, renal, preg, hiv, cd4lt100: hiv && cd4, sam: child && sam, prior2y: child && prior2y, highE: child && highE });
  const dx = `${tbm ? "Lao màng não" : "Lao phổi"} ${RES_TEXT[res]}${res === "mdr" ? (fq === "s" ? ", nhạy fluoroquinolon" : fq === "r" ? ", kháng fluoroquinolon (pre-XDR-TB)" : ", chưa rõ nhạy fluoroquinolon") : ""} – ${AGE_TEXT[age]}${hiv ? ", nhiễm HIV" : ""}${preg ? ", có thai / cho con bú" : ""}`;

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Điều trị – WHO 2025</p>
        <h3>{tbm ? "Viêm màng não do lao" : "Lao phổi"}</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Kháng thuốc</li><li>Tuổi, nhóm đặc biệt</li><li>Phác đồ, thời gian</li>{tbm && <li>Corticoid bổ trợ</li>}<li>HIV, ART</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Kháng thuốc">
          <Seg label="Kháng thuốc" value={res} onChange={setRes} options={[
            { id: "ds", label: "Nhạy cảm thuốc" },
            { id: "hr", label: "Kháng isoniazid, nhạy rifampicin" },
            { id: "mdr", label: "Kháng rifampicin / MDR" },
          ] as const} />
        </Row>
        {res === "mdr" && (
          <Row label="Fluoroquinolon">
            <Seg label="Fluoroquinolon" value={fq} onChange={setFq} options={[
              { id: "unknown", label: "Chưa có kết quả" },
              { id: "s", label: "Nhạy" },
              { id: "r", label: "Kháng (pre-XDR)" },
            ] as const} />
          </Row>
        )}
        <Row label="Tuổi">
          <Seg label="Tuổi" value={age} onChange={setAge} options={[
            { id: "lt3m", label: AGE_TEXT.lt3m },
            { id: "child", label: AGE_TEXT.child },
            { id: "a12", label: AGE_TEXT.a12 },
            { id: "a14", label: AGE_TEXT.a14 },
            { id: "adult", label: AGE_TEXT.adult },
          ] as const} />
        </Row>
        <Row label="Cân nặng">
          <label className="sa24-chk"><input type="number" min={2} max={200} step={0.5} value={wt} onChange={(e) => setWt(Number(e.target.value))} style={{ width: 80 }} aria-label="Cân nặng (kg)" /> kg</label>
        </Row>
        <Row label="Người bệnh">
          {!tbm && (ds || res === "mdr") && (
            <Chk on={severe} set={setSevere}>{ds && child ? "Lao phổi không thuộc nhóm “không nặng” (có hang, hai bên, hình ảnh kê, nhiều thùy)" : "Bệnh lan rộng: hang hai bên hoặc tổn thương nhu mô lan rộng trên X-quang"}</Chk>
          )}
          <Chk on={preg} set={setPreg}>Có thai, cho con bú hoặc sau sinh</Chk>
          <Chk on={hiv} set={setHiv}>Nhiễm HIV</Chk>
          <Chk on={renal} set={setRenal}>Độ thanh thải creatinin &lt; 30 mL/phút hoặc lọc máu</Chk>
          {hiv && !tbm && ds && <Chk on={cd4} set={setCd4}>CD4 &lt; 100 tế bào/mm³</Chk>}
          {!tbm && ds && child && age !== "lt3m" && (
            <>
              <Chk on={sam} set={setSam}>Suy dinh dưỡng cấp nặng (WHZ &lt; −3 hoặc MUAC &lt; 115 mm)</Chk>
              <Chk on={prior2y} set={setPrior2y}>Đã điều trị lao trong 2 năm trước</Chk>
            </>
          )}
          {!tbm && ds && child && <Chk on={highE} set={setHighE}>Nơi tỷ lệ HIV cao hoặc tỷ lệ kháng isoniazid cao</Chk>}
        </Row>
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {dx}</p>
          <p><b>Phác đồ</b> {o.headline}</p>
          <p><b>Hướng dẫn</b> WHO Module 4 (2025) – guidelines và operational handbook</p>
        </div>
        {o.blocks.map((b) => (
          <div key={b.title}>
            <h4>{b.title}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            <Rx items={b.items} />
          </div>
        ))}
        {o.avoid.length > 0 && (<><h4>Không khuyến cáo / không áp dụng</h4><Rx items={o.avoid} /></>)}
        {o.notes.length > 0 && (<><h4>Lưu ý</h4><ul className="sp-notes">{o.notes.map((n) => <li key={n}>{n}</li>)}</ul></>)}
      </section>
      <SourceList sources={citeIntlSources(["who-tb-module4-2025", "who-tb-handbook-module4-2025"])} notes={["Liều trẻ em < 25 kg: mg/kg theo khuyến cáo 2014."]} />
      <RxToolStyle />
      <style>{`.sp-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }`}</style>
    </article>
  );
}
