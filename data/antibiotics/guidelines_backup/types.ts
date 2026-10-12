export type VerificationLevel =
  | "VERIFIED_EXACT"
  | "VERIFIED_SUMMARY"
  | "INDEXED";

export type GuidelineSourceKind =
  | "hospital"
  | "national"
  | "international";

export type GuidelineSource = {
  id: string;
  name: string;
  title: string;
  year: number;
  kind: GuidelineSourceKind;
  url?: string;
  note?: string;
};

export type SourceRef = {
  sourceId: string;
  pages?: string;
  note?: string;
};

export type TreatmentOption = {
  title: string;

  drugs: string[];

  indication?: string[];

  avoid?: string[];

  notes?: string[];

  sources: SourceRef[];
};

export type ClinicalSyndrome = {
  id: string;

  category: string;

  title: string;

  aliases?: string[];

  population:
    | "Người lớn"
    | "Trẻ em"
    | "Cả hai";

  setting: string[];

  severity: string[];

  verification: VerificationLevel;

  commonPathogens: string[];

  assessment: string[];

  sourceControl?: string[];

  firstLine: TreatmentOption[];

  alternatives?: TreatmentOption[];

  addOn?: TreatmentOption[];

  duration: string[];

  reassessment: string[];

  deEscalation: string[];

  renalAdjustment: boolean;

  tdm?: string[];

  sourceRefs: SourceRef[];

  requiresBV199Validation: boolean;
};

export type PathogenGuidance = {
  id: string;

  name: string;

  aliases?: string[];

  group:
    | "Gram âm"
    | "Gram dương"
    | "Kỵ khí"
    | "Không điển hình"
    | "Nấm"
    | "Kiểu đề kháng";

  phenotype?: string;

  commonSites: string[];

  verification: VerificationLevel;

  preferred: TreatmentOption[];

  alternatives?: TreatmentOption[];

  avoid?: string[];

  notes: string[];

  sourceRefs: SourceRef[];

  requiresBV199Validation: boolean;
};