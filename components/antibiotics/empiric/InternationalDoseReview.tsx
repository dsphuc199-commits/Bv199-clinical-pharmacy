import { INTERNATIONAL_DOSE_REVIEWS } from "@/data/antibiotics/empiric/international-dose-review";
import type { DrugGroup } from "@/lib/antibiotics/regimen-structure";
import DoseTable from "../treatment/DoseTable";
import ClinicalNotes from "../treatment/ClinicalNotes";

export default function InternationalDoseReview({diseaseId}:{diseaseId:string}) {
  const reviews=INTERNATIONAL_DOSE_REVIEWS.filter(r=>r.diseaseIds.includes(diseaseId));
  if(!reviews.length)return null;
  return <section aria-label="Đối chiếu liều quốc tế">
    <h3>Liều quốc tế · đối chiếu chuyên môn</h3>
    <p className="gt199-note">Đã đối chiếu các giá trị trong bảng nguồn.</p>
    {reviews.map(r=>{
      const groups:DrugGroup[]=r.rows.map(o=>({rule:"all",optional:false,ambiguous:false,raw:[{name:o.drug,dose:[o.dose,o.route,o.interval,o.condition].filter(Boolean).join("; ")}],options:[{name:o.drug,dose:o.dose,route:o.route,interval:o.interval,context:o.condition,doseBasis:"unknown",population:r.population ?? "adult",ingredientIds:[],flags:[],complete:false,raw:[o.dose,o.route,o.interval,o.condition].filter(Boolean).join("; ")}]}));
      return <details key={r.id} className="gt199-reg" data-dose-review={r.id}>
        <summary>{r.source} · {r.published} · Liều tham khảo {r.population === "child" ? "trẻ em" : "người lớn"}</summary>
        <ClinicalNotes items={[r.condition]}/>
        <DoseTable groups={groups} status="PARTIAL" independent duration={r.duration}/>
        <ClinicalNotes items={r.cautions}/>
        <details className="gt199-loc"><summary>Tài liệu tham khảo</summary><a href={r.url} target="_blank" rel="noopener noreferrer">{r.source} · {r.published}</a><p>{r.locator}</p></details>
      </details>;
    })}
  </section>;
}
