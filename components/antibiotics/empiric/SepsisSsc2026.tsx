"use client";
/* Sepsis chua ro nguon / soc nhiem khuan (nguoi lon) – cong cu theo SSC 2026, IDSA AMR 2026 (dieu tri kinh nghiem), ASHP 2020 (vancomycin). */
import { useState } from "react";
import { LIKELY_TEXT, RISKS, sepsisPlan, type Culture, type Hemo, type Likely, type Phase, type RiskId } from "./sepsis-ssc2026";
import { VANCO, VANCO_COMMON, VANCO_POP, type VancoPop } from "./sab-intl";
import { Row, Rx, RxToolStyle, Seg } from "./rx-tool";

const ashp = (items: typeof VANCO_COMMON) => items.map((it) => ({ ...it, text: it.text.replace(/(KC (d+))/g, "(ASHP KC $1)").replace(/(([AB]-I+), KC (d+))/g, "($1, ASHP KC $2)") }));
const ADULT_POP = VANCO_POP.filter((p) => p.id !== "ped" && p.id !== "neo");
const HEMO_TEXT: Record<Hemo, string> = { stable: "chưa giảm tưới máu", hypoperf: "giảm tưới máu do sepsis", shock: "sốc nhiễm khuẩn" };

export default function SepsisSsc2026({ initialShock = false }: { initialShock?: boolean }) {
  const [likely, setLikely] = useState<Likely>("probable");
  const [hemo, setHemo] = useState<Hemo>(initialShock ? "shock" : "stable");
  const [prehosp, setPrehosp] = useState(false);
  const [delay60, setDelay60] = useState(false);
  const [phase, setPhase] = useState<Phase>("initial");
  const [culture, setCulture] = useState<Culture>("pathogen");
  const [risks, setRisks] = useState<RiskId[]>([]);
  const [pop, setPop] = useState<VancoPop>("std");
  const toggle = (id: RiskId) => setRisks((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  const o = sepsisPlan({ likely, hemo, prehosp, delay60, phase, culture, risks });

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Điều trị kinh nghiệm – người lớn</p>
        <h3>Sepsis chưa rõ nguồn, sốc nhiễm khuẩn</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Khả năng sepsis, huyết động</li><li>Thời điểm kháng sinh</li><li>Phổ kháng sinh</li><li>Hồi sức, kiểm soát ổ</li><li>Đánh giá lại, xuống thang</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Giai đoạn">
          <Seg label="Giai đoạn" value={phase} onChange={setPhase} options={[{ id: "initial", label: "Ban đầu" }, { id: "reassess", label: "Đánh giá lại – có kết quả cấy" }] as const} />
        </Row>
        {phase === "initial" ? (
          <>
            <Row label="Khả năng sepsis">
              <Seg label="Khả năng sepsis" value={likely} onChange={setLikely} options={[
                { id: "probable", label: "Chắc chắn / khả năng cao" },
                { id: "possible", label: "Có thể" },
                { id: "low", label: "Khả năng nhiễm khuẩn thấp" },
              ] as const} />
            </Row>
            <Row label="Huyết động">
              <Seg label="Huyết động" value={hemo} onChange={setHemo} options={[
                { id: "stable", label: "Chưa giảm tưới máu" },
                { id: "hypoperf", label: "Giảm tưới máu (tụt HA hoặc lactat tăng)" },
                { id: "shock", label: "Sốc nhiễm khuẩn" },
              ] as const} />
            </Row>
            <Row label="Bối cảnh">
              <label className="sa24-chk"><input type="checkbox" checked={prehosp} onChange={(e) => setPrehosp(e.target.checked)} /> Trên xe cấp cứu / máy bay (trước viện)</label>
              {prehosp && <label className="sa24-chk"><input type="checkbox" checked={delay60} onChange={(e) => setDelay60(e.target.checked)} /> Dự kiến &gt; 60 phút mới được đánh giá tại viện</label>}
            </Row>
          </>
        ) : (
          <Row label="Kết quả">
            <Seg label="Kết quả" value={culture} onChange={setCulture} options={[
              { id: "pathogen", label: "Có tác nhân và kháng sinh đồ" },
              { id: "negative", label: "Cấy cuối cùng âm tính" },
              { id: "noninfect", label: "Nguyên nhân không nhiễm khuẩn" },
            ] as const} />
          </Row>
        )}
        <Row label="Yếu tố người bệnh">
          {RISKS.filter((x) => phase === "initial" || x.id === "fungal" || x.id === "vent").map((x) => (
            <label key={x.id} className="sa24-chk"><input type="checkbox" checked={risks.includes(x.id)} onChange={() => toggle(x.id)} /> {x.label}</label>
          ))}
        </Row>
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {phase === "initial" ? `Sepsis ${LIKELY_TEXT[likely]}, ${HEMO_TEXT[hemo]}${prehosp ? ", trước viện" : ""}` : "Sepsis đang điều trị kháng sinh kinh nghiệm – đánh giá lại"}</p>
          <p><b>Phác đồ</b> {o.headline}</p>
          <p><b>Hướng dẫn</b> Surviving Sepsis Campaign 2026</p>
        </div>
        {o.blocks.map((b) => (
          <div key={b.title}>
            <h4>{b.title}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            <Rx items={b.items} />
          </div>
        ))}
        {o.showVanco && (
          <div>
            <h4>Vancomycin khi nghi MRSA nặng – ASHP 2020</h4>
            <Row label="Nhóm người bệnh"><Seg label="Nhóm người bệnh" value={pop} onChange={setPop} options={ADULT_POP} /></Row>
            <Rx items={ashp(VANCO[pop])} />
            <Rx items={ashp(VANCO_COMMON)} />
          </div>
        )}
        {o.avoid.length > 0 && (<><h4>Không khuyến cáo</h4><Rx items={o.avoid} /></>)}
        {o.notes.length > 0 && (<><h4>Lưu ý</h4><ul className="sp-notes">{o.notes.map((n) => <li key={n}>{n}</li>)}</ul></>)}
      </section>
      <p className="sa24-src">Nguồn: Surviving Sepsis Campaign – International Guidelines for Management of Sepsis and Septic Shock 2026 (Prescott HC, Antonelli M và cs., Crit Care Med 2026;54:725–812), “KC n” là số khuyến cáo trong bảng 1, mức GRADE giữ nguyên của SSC; IDSA 2026 – hướng dẫn điều trị Gram âm kháng thuốc (Tamma PD và cs., Clin Infect Dis 2026; doi:10.1093/cid/ciag481), mục Empiric Therapy, Duration – không xếp mức GRADE; ASHP/IDSA/PIDS/SIDP 2020 – theo dõi vancomycin (Rybak MJ và cs., Am J Health-Syst Pharm 2020;77:835–864). SSC 2026 không nêu tên thuốc và liều cho phác đồ kinh nghiệm nên công cụ không đưa liều kháng sinh (trừ vancomycin theo ASHP 2020). Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt; đối chiếu dịch tễ, kháng sinh đồ và danh mục thuốc tại chỗ.</p>
      <RxToolStyle />
      <style>{`.sp-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }`}</style>
    </article>
  );
}
