import type { DrugGroup } from "@/lib/antibiotics/regimen-structure";
import DoseTable from "./DoseTable";

export type ReferenceDrug = { name:string; dose:string; route:string; interval:string };
/** Explicit presentation fields only, supplied by the original reference module. */
export default function ClinicalReferenceDose({ rows, rule = "all", condition }: { rows:ReferenceDrug[]; rule?:DrugGroup['rule']; condition?:string }) {
  const group:DrugGroup={rule,condition,optional:false,ambiguous:false,raw:rows.map(r=>({name:r.name,dose:[r.dose,r.route,r.interval].join('; ')})),options:rows.map(r=>({name:r.name,dose:r.dose,route:r.route,interval:r.interval,raw:[r.name,r.dose,r.route,r.interval].join('; '),population:'adult',doseBasis:'unknown',complete:true,flags:[],ingredientIds:[]}))};
  return <DoseTable groups={[group]} status="STRUCTURED" independent />;
}
