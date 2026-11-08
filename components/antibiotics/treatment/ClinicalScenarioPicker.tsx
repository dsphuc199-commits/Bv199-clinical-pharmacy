"use client";

import { useState, type ReactNode } from "react";
import { patientGroupsFor, settingInSourceLabel, type ScenarioChoice } from "@/lib/antibiotics/patient-groups";
import SettingTabs from "./SettingTabs";
import PatientGroupSelect from "./PatientGroupSelect";

export { settingInSourceLabel, type ScenarioChoice } from "@/lib/antibiotics/patient-groups";
export default function ClinicalScenarioPicker({ scenarios,value,onChange,indication }:{scenarios:ScenarioChoice[];value?:string;onChange:(value:string)=>void;indication?:ReactNode}) {
  const groups=patientGroupsFor(scenarios);
  const both=groups.some(group=>group.context==='outpatient')&&groups.some(group=>group.context==='inpatient');
  const [context,setContext]=useState<string>(()=>scenarios.find(s=>s.value===value)?.setting??settingInSourceLabel(scenarios.find(s=>s.value===value)?.label??'')??'outpatient');
  const contexts=both?[{value:'outpatient',label:'Ngoại trú'},{value:'inpatient',label:'Nội trú'},...(groups.some(group=>group.context==='source-context')?[{value:'source-context',label:'Bối cảnh khác'}]:[])]:[];
  const visible=both?groups.filter(group=>group.context===context):groups;
  return <div className="clinical-scenario-picker">
    <SettingTabs items={contexts} value={context} onChange={next=>{setContext(next);onChange('');}}>{indication}<PatientGroupSelect key={context} groups={visible} value={value} onChange={onChange}/></SettingTabs>
  </div>;
}
