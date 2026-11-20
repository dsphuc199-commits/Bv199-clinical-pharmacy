"use client";
/* Benh lay truyen qua duong tinh duc – cong cu chon phac do theo CDC STI Treatment Guidelines 2021. Du lieu: sti-cdc2021.ts */
import { useState } from "react";
import { SUB_OPTS, SYN_GROUPS, SYN_LABEL, defaultSub, stiPlan, type Syn } from "./sti-cdc2021";
import { Row, Rx, RxToolStyle, Seg, SourceList } from "./rx-tool";
import { citeIntlSources } from "@/lib/antibiotics/source-citation";

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}

const GC_LIKE: Syn[] = ["gc", "gcPharynx", "dgi"];
const CEPH: Syn[] = ["gc", "pid", "epid"];
const HEAVY: Syn[] = ["gc", "gcPharynx", "pid", "epid", "proctitis"];
const HIV_SYN: Syn[] = ["syphilis", "herpes", "trich", "vvc"];
const NO_PREG: Syn[] = ["epid", "ngu"];

export default function StiCdc2021({ initial = "gc" }: { initial?: Syn }) {
  const [syn, setSynRaw] = useState<Syn>(initial);
  const [sub, setSub] = useState<string>(defaultSub(initial));
  const [pregnant, setPregnant] = useState(false);
  const [hiv, setHiv] = useState(false);
  const [pcnAllergy, setPcnAllergy] = useState(false);
  const [cephAllergy, setCephAllergy] = useState(false);
  const [heavy, setHeavy] = useState(false);
  const [ctNotExcluded, setCt] = useState(true);
  const setSyn = (s: Syn) => { setSynRaw(s); setSub(defaultSub(s)); };
  const so = SUB_OPTS[syn];
  const preg = pregnant && !NO_PREG.includes(syn);
  const o = stiPlan({ syn, sub, pregnant: preg, hiv, pcnAllergy, cephAllergy, heavy, ctNotExcluded });
  /* Viem vung chau khi mang thai: CDC chi dinh nhap vien, khang sinh tinh mach -> hien dung hinh thuc */
  const subLabel = syn === "pid" && preg ? "Đường tiêm (nội trú)" : so?.opts.find((x) => x.id === sub)?.label ?? "";

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn phác đồ theo chẩn đoán</p>
        <h3>Bệnh lây truyền qua đường tình dục</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Hội chứng, tác nhân</li><li>Thể, giai đoạn</li><li>Thai kỳ, dị ứng, HIV</li><li>Phác đồ</li><li>Theo dõi, bạn tình</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Chẩn đoán">
          <select className="sti-sel" aria-label="Chẩn đoán" value={syn} onChange={(e) => setSyn(e.target.value as Syn)}>
            {SYN_GROUPS.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.items.map((it) => <option key={it.id} value={it.id}>{it.label}</option>)}
              </optgroup>
            ))}
          </select>
        </Row>
        {so && (
          <Row label={so.label}>
            <Seg label={so.label} value={sub} onChange={setSub} options={so.opts} />
          </Row>
        )}
        <Row label="Yếu tố bổ sung">
          {!NO_PREG.includes(syn) && <Chk on={pregnant} set={setPregnant}>Đang mang thai</Chk>}
          {GC_LIKE.includes(syn) && <Chk on={ctNotExcluded} set={setCt}>Chưa loại trừ nhiễm Chlamydia</Chk>}
          {CEPH.includes(syn) && <Chk on={cephAllergy} set={setCephAllergy}>Dị ứng cephalosporin</Chk>}
          {(syn === "syphilis" || syn === "epid") && <Chk on={pcnAllergy} set={setPcnAllergy}>Dị ứng penicilin</Chk>}
          {HIV_SYN.includes(syn) && <Chk on={hiv} set={setHiv}>Nhiễm HIV</Chk>}
          {HEAVY.includes(syn) && <Chk on={heavy} set={setHeavy}>Cân nặng ≥ 150 kg</Chk>}
        </Row>
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {SYN_LABEL[syn]}{so ? ` – ${subLabel}` : ""}{preg ? " (thai kỳ)" : ""}</p>
          <p><b>Phác đồ</b> {o.headline}</p>
          <p><b>Hướng dẫn</b> CDC STI 2021</p>
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
      <SourceList sources={citeIntlSources(["cdc-sti-bv-2021"])} notes={["CDC không xếp mức GRADE cho từng khuyến cáo.","Phạm vi người lớn và vị thành niên."]} />
      <RxToolStyle />
      <style>{`.sp-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }
.sti-sel { width: 100%; max-width: 560px; min-height: 40px; padding: 8px 10px; border: 1px solid #b9cdd6; border-radius: 8px; background: #fff; color: #17323f; font: inherit; font-size: 14px; }`}</style>
    </article>
  );
}
