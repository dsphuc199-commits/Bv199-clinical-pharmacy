export type InfectionSite =
  | "sepsis"
  | "pneumonia"
  | "uti"
  | "intra-abdominal"
  | "skin-soft-tissue"
  | "cns";

export type EmpiricRegimen = {
  id: string;

  title: string;

  drugIds: string[];

  conditions?: string[];

  notes?: string[];

  sourceIds: string[];
};

export type InfectionGuidance = {
  id: string;

  name: string;

  site: InfectionSite;

  acquisition:
    | "community"
    | "hospital"
    | "both";

  severity:
    | "non-severe"
    | "severe"
    | "both";

  suspectedOrganisms: string[];

  riskFactors?: string[];

  empiricRegimens:
    EmpiricRegimen[];

  duration?: string;

  monitoring?: string[];

  sourceIds: string[];
};