/* ============================================================
   BV199 CLINICAL PHARMACY
   Antibiotic / AMS shared types
============================================================ */

export type EvidenceSourceType =
  | "hospital-guideline"
  | "national-guideline"
  | "international-guideline"
  | "consensus"
  | "study"
  | "lecture";

export type EvidenceSource = {
  id: string;

  title: string;

  organization?: string;

  year: number;

  type: EvidenceSourceType;

  url?: string;

  note?: string;
};


/* ============================================================
   DRUG
============================================================ */

export type HospitalDrug = {
  id: string;

  genericName: string;

  brandName?: string;

  strength: string;

  dosageForm: string;

  routes: string[];

  manufacturer?: string;

  isAntibiotic: boolean;

  isAntifungal?: boolean;

  isAntiviral?: boolean;

  isLASA?: boolean;

  active: boolean;
};


/* ============================================================
   DOSING
============================================================ */

export type DoseRegimen = {
  indication?: string;

  population?: string;

  dose: string;

  interval?: string;

  route: string;

  infusionTime?: string;

  maximumDose?: string;

  note?: string;

  sourceIds: string[];
};


export type RenalDose = {
  minCrCl?: number;

  maxCrCl?: number;

  dose: string;

  interval?: string;

  dialysis?: string;

  note?: string;

  sourceIds: string[];
};


/* ============================================================
   PK/PD
============================================================ */

export type PKPDProfile = {
  class:
    | "time-dependent"
    | "concentration-dependent"
    | "exposure-dependent"
    | "mixed";

  primaryIndex: string;

  target?: string;

  interpretation?: string;

  moduleHref?: string;

  sourceIds: string[];
};


/* ============================================================
   TDM
============================================================ */

export type TDMProfile = {
  required: boolean;

  parameter?: string;

  target?: string;

  sampling?: string;

  moduleHref?: string;

  sourceIds: string[];
};


/* ============================================================
   ANTIBIOTIC MONOGRAPH
============================================================ */

export type AntibioticMonograph = {
  drugId: string;

  pharmacologicClass: string;

  spectrum: string[];

  indications: string[];

  usualDose: DoseRegimen[];

  renalDose?: RenalDose[];

  hepaticDose?: string[];

  pkpd?: PKPDProfile;

  tdm?: TDMProfile;

  adverseEffects: string[];

  contraindications?: string[];

  monitoring?: string[];

  references: string[];
};


/* ============================================================
   INFECTION GUIDELINE
============================================================ */

export type InfectionGuideline = {
  id: string;

  name: string;

  site:
    | "bloodstream"
    | "respiratory"
    | "urinary"
    | "intra-abdominal"
    | "skin-soft-tissue"
    | "cns"
    | "endocarditis"
    | "other";

  acquisition:
    | "community"
    | "hospital"
    | "both";

  severity?: string[];

  suspectedOrganisms: string[];

  riskFactors?: string[];

  empiricTherapy: AntibioticRegimen[];

  targetedTherapy?: TargetedTherapy[];

  duration?: string;

  monitoring?: string[];

  sourceIds: string[];
};


export type AntibioticRegimen = {
  id: string;

  title: string;

  antibiotics: string[];

  condition?: string;

  notes?: string[];

  sourceIds: string[];
};


export type TargetedTherapy = {
  organism: string;

  susceptibility?: string;

  preferredDrugIds: string[];

  alternativeDrugIds?: string[];

  note?: string;

  sourceIds: string[];
};


/* ============================================================
   DE-ESCALATION
============================================================ */

export type DeescalationAction =
  | "narrow-spectrum"
  | "stop-unnecessary"
  | "combination-to-monotherapy"
  | "iv-to-po"
  | "stop-antibiotics";


export type DeescalationRule = {
  id: string;

  title: string;

  action: DeescalationAction;

  conditions: string[];

  recommendation: string;

  sourceIds: string[];
};


/* ============================================================
   IV → PO
============================================================ */

export type IVPOCriteria = {
  id: string;

  label: string;

  required: boolean;
};


export type IVPOConversion = {
  id: string;

  ivDrugId: string;

  poDrugId: string;

  ivRegimen: string;

  poRegimen: string;

  oralBioavailability?: string;

  notes?: string[];

  sourceIds: string[];
};


/* ============================================================
   LASA
============================================================ */

export type LASAType =
  | "look-alike"
  | "sound-alike"
  | "look-and-sound-alike"
  | "same-name-strength"
  | "same-name-form";


export type LASAPair = {
  id: string;

  drugAId: string;

  drugBId: string;

  type: LASAType;

  reasons: string[];

  riskStage: (
    | "prescribing"
    | "transcribing"
    | "dispensing"
    | "administration"
  )[];

  prevention: string[];

  sourceIds: string[];

  active: boolean;
};


/* ============================================================
   ANTIBIOGRAM
============================================================ */

export type AntibiogramEntry = {
  departmentGroup:
    | "ICU"
    | "medical"
    | "surgical";

  organism: string;

  isolates: number;

  antibioticId: string;

  susceptibilityPercent:
    | number
    | null;

  intrinsicResistance?: boolean;

  period: string;
};