"use client";
import { useState } from "react";
import type { EntDisease } from "./EntEmpiricGuidelines";
import TreatmentPanel, { type TxCard } from "./treatment/TreatmentPanel";
import { structureOptionLines } from "@/lib/antibiotics/regimen-structure";
import ClinicalNotes from "./treatment/ClinicalNotes";

export default function EntGuidelinePresentation({ disease, initialScenarioId }: { disease?:EntDisease; initialScenarioId?:string }) {
  const [active,setActive]=useState(initialScenarioId??'');
  if(!disease) return <p>Chưa tìm thấy dữ liệu cho mặt bệnh này.</p>;
  const scenario=disease.scenarios.find(s=>s.id===active)??disease.scenarios[0];
  if(!scenario) return <p>Chưa có bệnh cảnh được trích xuất.</p>;
  const cards:TxCard[]=scenario.regimens.map((r,i)=>{
    const structured=structureOptionLines(r.drugs);
    return { id:`ent-${scenario.id}-${i}`,condition:r.indication,groups:structured.groups,status:structured.status,duration:r.duration,sources:[r.source],flags:[],extra:r.note?<ClinicalNotes items={[r.note]}/>:undefined };
  });
  return <TreatmentPanel scenarios={disease.scenarios.map(s=>({value:s.id,label:s.title,criteria:[s.criteria],regimenIds:s.regimens.map((_,i)=>`ent-${s.id}-${i}`),sources:[...new Set(s.regimens.map(r=>r.source))]}))} scenario={scenario.id} initialChoice={initialScenarioId} onScenario={setActive} scenarioHint={scenario.criteria} sections={[{key:'equal',title:'Kháng sinh theo kinh nghiệm',itemLabel:'Phác đồ',cards}]} notes={[scenario.urgency,...scenario.warnings]} sources={[...new Set(scenario.regimens.map(r=>r.source))]} />;
}
