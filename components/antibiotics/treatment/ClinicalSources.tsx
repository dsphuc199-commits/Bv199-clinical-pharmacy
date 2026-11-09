import type { ReactNode } from "react";
import { citeSources } from "@/lib/antibiotics/source-citation";

/*
  "Nguồn và đối chiếu": chi ghi co quan ban hanh, so quyet dinh, ten van ban, nam (moi nhat truoc).
  Vi tri muc/bang/trang va ho so doi chieu noi bo khong hien o day (van giu trong du lieu).
  `diseaseId`, `originalNotes` giu trong chu ky de tuong thich noi goi.
*/
export default function ClinicalSources({ sources, extra }: { sources:string[]; diseaseId?:string; originalNotes?:string[]; extra?:ReactNode }) {
  const citations = citeSources(sources);
  if (citations.length === 0 && !extra) return null;
  return <details className="tp-card-source"><summary>Nguồn và đối chiếu</summary>
    <ul>{citations.map(c=><li key={c.key}>{c.url?<a href={c.url} target="_blank" rel="noreferrer">{c.label}</a>:c.label}</li>)}</ul>
    {extra}
  </details>;
}
