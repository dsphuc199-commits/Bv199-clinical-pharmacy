/** Presentation records preserve source wording; they do not assign a patient. */
export type TreatmentSetting = "outpatient" | "inpatient";
export type ScenarioChoice = { value:string; label:string; setting?:TreatmentSetting; criteria?:string[]; exclusions?:string[]|null; regimenIds?:string[]; sources?:string[]; reviewNotes?:string[]; definitionNotes?:string[] };
export type PatientGroup = { id:string; name:string; context:TreatmentSetting|"source-context"; criteria:string[]; exclusions:string[]|null; regimenIds:string[]; sourceLocations:string[]; reviewNotes:string[]; definitions:string[]; criteriaStatus:"documented"|"label-only"; selection:"manual" };
export function settingInSourceLabel(label:string):TreatmentSetting|undefined {
  if (/ngoại trú/i.test(label)) return "outpatient";
  if (/nội trú/i.test(label)) return "inpatient";
  return undefined;
}
export function patientGroupsFor(choices:ScenarioChoice[]):PatientGroup[] {
  return choices.map(choice=>({id:choice.value,name:choice.label,context:choice.setting??settingInSourceLabel(choice.label)??"source-context",criteria:choice.criteria??[],exclusions:choice.exclusions??null,regimenIds:choice.regimenIds??[],sourceLocations:choice.sources??[],reviewNotes:choice.reviewNotes??[],definitions:choice.definitionNotes??[],criteriaStatus:choice.criteria?.length?"documented":"label-only",selection:"manual"}));
}
/** Missing inputs and overlapping matches must never silently select a group. */
export function unambiguousGroup(matches:PatientGroup[],complete:boolean):PatientGroup|undefined {
  return complete&&matches.length===1?matches[0]:undefined;
}
