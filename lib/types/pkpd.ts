export type EvidenceLevel =
  | "guideline"
  | "consensus"
  | "systematic-review"
  | "clinical-study"
  | "lecture"
  | "educational";

export type SourceStatus =
  | "current"
  | "historical"
  | "needs-review";

export type PKPDSource = {
  id: string;
  title: string;
  shortTitle?: string;
  authors?: string;
  organization?: string[];
  year: number;
  type: EvidenceLevel;
  language?: "vi" | "en";
  doi?: string;
  url?: string;
  version?: string;
  status: SourceStatus;
  accessedAt?: string;
  note?: string;
};

export type VerbatimBlock = {
  id: string;
  sourceId: string;
  page?: number;
  slide?: number;
  heading?: string;

  /**
   * Giữ nguyên câu chữ theo slide.
   * Không paraphrase.
   */
  lines: string[];
};

export type EvidenceStatement = {
  id: string;
  title?: string;
  statement: string;
  sourceIds: string[];
  evidenceLevel: EvidenceLevel;
  updatedAt: string;
  note?: string;
};

export type LearningPoint = {
  id: string;
  title: string;
  explanation: string;
  clinicalMeaning?: string;
  remember?: string;
};

export type PKPDFormula = {
  id: string;
  name: string;
  formula: string;
  numerator?: string;
  denominator?: string;
  interpretation: string;
};

export type ClinicalCase = {
  id: string;
  title: string;
  scenario: string;
  questions: string[];
  learningObjectives: string[];
  sourceId?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  sourceIds?: string[];
};

export type PKPDModule = {
  slug: string;
  title: string;
  shortTitle: string;

  category:
    | "foundation"
    | "time-dependent"
    | "concentration-dependent"
    | "exposure-dependent"
    | "resistance"
    | "tdm";

  description: string;

  objectives: string[];

  keywords: string[];

  originalLecture?: {
    title: string;
    sourceId: string;
    blocks: VerbatimBlock[];
  };

  evidenceUpdates: EvidenceStatement[];

  learningPoints: LearningPoint[];

  formulas?: PKPDFormula[];

  cases?: ClinicalCase[];

  quiz?: QuizQuestion[];

  references: string[];
};