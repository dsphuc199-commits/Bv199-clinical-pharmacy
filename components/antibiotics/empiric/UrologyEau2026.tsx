"use client";
/* Tiet nieu – cong cu chon khang sinh theo EAU 2026 (Urological Infections, Urolithiasis). Du lieu: urology-eau2026.ts */
import { useState } from "react";
import { EAU_UROLOGY_FORMS } from "./urology-eau2026";
import { ReadHint, Row, Rx, RxToolStyle, Seg, SourceList } from "./rx-tool";
import { citeIntlSources } from "@/lib/antibiotics/source-citation";

const TITLE: Record<string, string> = {
  "v8-16": "Viêm bàng quang",
  "v8-17": "Viêm thận bể thận",
  "v8-2": "Nhiễm khuẩn tiết niệu phức tạp",
};

export default function UrologyEau2026({ diseaseId, showReferences }: { diseaseId: string; showReferences?: boolean }) {
  const forms = EAU_UROLOGY_FORMS[diseaseId];
  const [id, setId] = useState(forms[0].id);
  const f = forms.find((x) => x.id === id) ?? forms[0];

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo EAU 2026</p>
        <h3>{TITLE[diseaseId]}</h3>
      </header>
      <div className="sa24-form">
        <Row label="Tình huống">
          <Seg label="Tình huống" value={f.id} onChange={setId} options={forms} />
          <p className="sa24-tip">{f.criteria}</p>
        </Row>
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Tình huống</b> {f.label}</p>
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
        {f.avoid.length > 0 && (<div><h4>Không khuyến cáo</h4><Rx items={f.avoid} /></div>)}
        {f.notes.length > 0 && (<div><h4>Lưu ý</h4><ul className="eau26-notes">{f.notes.map((n) => <li key={n}>{n}</li>)}</ul></div>)}
      </section>
      <SourceList sources={citeIntlSources(["eau-ui-2026", "eau-urolithiasis-2026"])} showReferences={showReferences} />
      <RxToolStyle />
      <style>{`.eau26-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }`}</style>
    </article>
  );
}
