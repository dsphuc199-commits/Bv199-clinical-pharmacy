import type { DoseConflict, DoseRef } from "@/data/antibiotics/empiric/dose-conflicts";
import ClinicalNotes from "../treatment/ClinicalNotes";

/** Split presentation only; retain punctuation and source wording. */
function References({label,refs}:{label:string;refs:DoseRef[]}) {
  return <section className="dc-side"><h5>{label}</h5>{refs.map((r,i)=><div key={i}>
    <ClinicalNotes items={[r.dose]}/>
    <details><summary>Tài liệu tham khảo</summary><p>{r.source}</p><p>{r.locator}</p>{r.url&&<a href={r.url} target="_blank" rel="noopener noreferrer">Mở tài liệu</a>}</details>
  </div>)}</section>;
}
export default function DoseConflictComparison({conflicts}:{conflicts:DoseConflict[]}) {
  if(!conflicts.length)return null;
  return <details className="dc-root">
    <summary>Đối chiếu liều giữa các hướng dẫn · cần thẩm định chuyên môn</summary>
    {conflicts.map(c=><article key={c.id} className="dc-item">
      <h4>{c.topic}</h4>
      <div className="dc-sources"><References label="Hướng dẫn Bộ Y tế" refs={c.byt}/><References label="Hướng dẫn quốc tế" refs={c.intl}/></div>
      <h5>Điểm cần lưu ý</h5><ClinicalNotes items={[c.warning]}/>
      <h5>Nội dung cần quyết định</h5><ClinicalNotes items={[c.decision]}/>
    </article>)}
    <style>{`
      .dc-root { padding: 14px 18px; border: 1px solid #dfe8ee; border-radius: 10px; color: #17364b; font-size: 13px; line-height: 1.75; overflow-wrap: anywhere; }
      .dc-root summary { cursor: pointer; font-weight: 700; color: #0b6b8a; }
      .dc-item + .dc-item { margin-top: 20px; padding-top: 16px; border-top: 1px solid #dfe8ee; }
      .dc-item h4 { margin: 14px 0 10px; font-size: 14px; }
      .dc-item h5 { margin: 12px 0 6px; font-size: 13px; font-weight: 700; }
      .dc-item ul { padding-left: 22px; margin: 6px 0 12px; }
      .dc-item li + li { margin-top: 8px; }
      .dc-item details { margin: 6px 0 12px; font-size: 12px; }
      .dc-item p { margin: 6px 0; }
      .dc-sources { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px 24px; }
      .dc-side { min-width: 0; }
      @media(max-width:768px) { .dc-sources { grid-template-columns: minmax(0,1fr); } }
    `}</style>
  </details>;
}
