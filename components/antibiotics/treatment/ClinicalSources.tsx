import { ARCHIVED_SOURCE_LINKS } from "@/lib/antibiotics/presentation-source-links";
import { getReconciliationNote } from "@/data/antibiotics/empiric/source-reconciliation";
import type { ReactNode } from "react";

export default function ClinicalSources({ sources, diseaseId, originalNotes=[], extra }: { sources:string[]; diseaseId?:string; originalNotes?:string[]; extra?:ReactNode }) {
  const numbers=new Set(sources.flatMap(text=>[...text.matchAll(/QĐ\s*(\d+)/g)].map(m=>`VN${m[1]}`)));
  const links=ARCHIVED_SOURCE_LINKS.filter(s=>numbers.has(s.id));
  const related=diseaseId?getReconciliationNote(diseaseId)?.sources??[]:[];
  return <details className="tp-card-source"><summary>Nguồn và đối chiếu</summary>
    <ul>{sources.map((source,i)=><li key={`${i}-${source}`}>{source}</li>)}</ul>
    {links.map(link=><p key={link.id}><a href={link.url} target="_blank" rel="noreferrer">{link.label}</a> · đối chiếu kế thừa {link.checkedOn}<br />{link.scope}<br />{link.limitations}</p>)}
    {related.length>0 && <details><summary>Tài liệu liên quan trong hồ sơ đối chiếu</summary><ul>{related.map((source,i)=><li key={i}>{source.url?<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>:source.label}</li>)}</ul></details>}
    {originalNotes.length>0 && <details><summary>Ghi chú nguyên văn và vị trí nguồn</summary><ul>{originalNotes.map((note,i)=><li key={i}>{note}</li>)}</ul></details>}
    {extra}
  </details>;
}
