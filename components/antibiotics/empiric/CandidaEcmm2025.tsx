"use client";
/* Nhiem Candida xam lan – cong cu chon thuoc khang nam theo ECMM/ISHAM/ASM 2025. Du lieu: candida-ecmm2025.ts */
import { useState } from "react";
import { CANDIDA_FORMS, initialCandidaForm } from "./candida-ecmm2025";
import { ReadHint, Row, Rx, RxToolStyle, Seg, SourceList } from "./rx-tool";

export default function CandidaEcmm2025({ diseaseId }: { diseaseId: string }) {
  const [id, setId] = useState(initialCandidaForm(diseaseId));
  const f = CANDIDA_FORMS.find((x) => x.id === id) ?? CANDIDA_FORMS[0];
  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn thuốc kháng nấm theo ECMM 2025</p>
        <h3>Nhiễm Candida xâm lấn – người lớn</h3>
      </header>
      <div className="sa24-form">
        <Row label="Thể bệnh">
          <Seg label="Thể bệnh" value={f.id} onChange={setId} options={CANDIDA_FORMS} />
          <p className="sa24-tip">{f.criteria}</p>
        </Row>
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Thể bệnh</b> {f.label}</p>
          <p><b>Hướng xử trí</b> {f.headline}</p>
        </div>
        <ReadHint />
        {f.blocks.map((b) => (
          <div key={b.title}>
            <h4>{b.title}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            <Rx items={b.items} />
          </div>
        ))}
        {f.avoid.length > 0 && <div><h4>Không khuyến cáo</h4><Rx items={f.avoid} /></div>}
        {f.notes.length > 0 && <div><h4>Lưu ý</h4><ul className="cand-notes">{f.notes.map((n) => <li key={n}>{n}</li>)}</ul></div>}
      </section>
      <SourceList
        sources={["ECMM/ISHAM/ASM 2025 – Global guideline for the diagnosis and management of candidiasis"]}
        notes={["Mức khuyến cáo: mạnh, vừa, yếu, không khuyến cáo.", "Liều cho người lớn. Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt; đối chiếu dịch tễ và kháng nấm đồ tại chỗ."]}
      />
      <RxToolStyle />
      <style>{`.cand-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }`}</style>
    </article>
  );
}
