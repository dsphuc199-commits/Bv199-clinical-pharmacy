import { INTERNATIONAL_DOSE_REVIEWS, type DoseReview } from "@/data/antibiotics/empiric/international-dose-review";
import type { DrugGroup } from "@/lib/antibiotics/regimen-structure";
import type { Citation } from "@/lib/antibiotics/source-citation";
import DoseTable from "../treatment/DoseTable";
import ClinicalNotes from "../treatment/ClinicalNotes";
import ClinicalSources from "../treatment/ClinicalSources";

export function doseReviewsFor(diseaseId: string, exclude: readonly string[] = []): DoseReview[] {
  return INTERNATIONAL_DOSE_REVIEWS.filter((review) => review.diseaseIds.includes(diseaseId) && !exclude.includes(review.id));
}

export function doseReviewCitation(review: DoseReview): Citation {
  return {
    key: review.id,
    label: review.source,
    detail: review.published,
    year: Number(review.published.match(/\b(?:19|20)\d{2}\b/)?.[0]) || undefined,
    url: review.url,
    note: review.locator,
  };
}

export default function InternationalDoseReview({ diseaseId, exclude, showReferences = true }: {
  diseaseId: string;
  exclude?: readonly string[];
  showReferences?: boolean;
}) {
  const reviews = doseReviewsFor(diseaseId, exclude);
  if(!reviews.length)return null;
  return <section aria-label="Đối chiếu liều quốc tế">
    <h3>Liều theo khuyến cáo quốc tế</h3>
    {reviews.map(r=>{
      const groups:DrugGroup[]=r.rows.map(o=>({rule:"all",optional:false,ambiguous:false,raw:[{name:o.drug,dose:[o.dose,o.route,o.interval,o.condition].filter(Boolean).join("; ")}],options:[{name:o.drug,dose:o.dose,route:o.route,interval:o.interval,context:o.condition,doseBasis:"unknown",population:r.population ?? "adult",ingredientIds:[],flags:[],complete:false,raw:[o.dose,o.route,o.interval,o.condition].filter(Boolean).join("; ")}]}));
      return <details key={r.id} className="gt199-reg" data-dose-review={r.id}>
        <summary>{r.source} · {r.published} · Liều tham khảo {r.population === "child" ? "trẻ em" : "người lớn"}</summary>
        <ClinicalNotes items={[r.condition]}/>
        <DoseTable groups={groups} status="PARTIAL" independent duration={r.duration}/>
        <ClinicalNotes items={r.cautions}/>
      </details>;
    })}
    {showReferences && <ClinicalSources sources={reviews.map(doseReviewCitation)} />}
  </section>;
}
