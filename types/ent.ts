/*
  Module Nhiễm khuẩn tai mũi họng – kiểu dữ liệu.
  Quy tắc: mọi Statement/Dose có Citation {sourceId, locator}; giá trị thiếu căn cứ -> status "NOT_VERIFIED".
  Không có trạng thái "REVIEWED" trong dữ liệu do máy tạo (chỉ người duyệt gán).
*/

export type Tier = "A" | "B" | "REF";
export type Status = "EXTRACTED" | "NOT_VERIFIED";
/** Vai trò của nguồn trong một bệnh. */
export type SourceRole = "primary" | "diagnosis" | "comparison" | "reference";
/** Loại nội dung: khuyến cáo hội chuyên môn / bằng chứng / ghi chú tham khảo (UCSF). */
export type StatementKind = "recommendation" | "evidence" | "reference_note";

export interface Source {
  id: string;
  org: string;
  title: string;
  year: number;
  tier: Tier;
  /** Nhãn hiển thị theo tier (B: "Bản cũ – đối chiếu thêm"; REF: "Chỉ tham khảo, không phải khuyến cáo hội chuyên môn"). */
  tierLabel: string;
  url: string;
  doi?: string;
  population: string;
  scope: string;
  /** Tình trạng truy cập văn bản nguồn trong lần trích xuất. */
  access: "downloaded" | "user_provided" | "webfetch" | "screenshot" | "not_downloaded" | "paywalled";
  accessNote: string;
  /** Tệp văn bản nguồn trong ./guidelines (không commit). */
  file?: string;
  checkedOn: string;
}

export interface Citation {
  sourceId: string;
  /** Mục/trang/bảng trong nguồn. */
  locator: string;
  /** Trích nguyên văn ≤ 15 từ (tùy chọn). */
  quote?: string;
}

export type Population = "adult" | "child" | "all";

export interface Statement {
  id: string;
  kind: StatementKind;
  role: SourceRole;
  /** Câu tóm tắt bằng lời của người biên soạn: hành động – quần thể – điều kiện. */
  text: string;
  /** Mức khuyến cáo đúng như nguồn ghi; không có thì để trống. */
  strength?: string;
  /** Chất lượng bằng chứng đúng như nguồn ghi; không có thì để trống. */
  quality?: string;
  population?: Population;
  citation: Citation;
  status: Status;
  note?: string;
}

/** Tham số tính liều theo cân nặng (chỉ khi nguồn ghi mg/kg). */
export interface WeightDosing {
  /** mg/kg/ngày [min, max] hoặc mg/kg/lần [min, max]. */
  basis: "per_day" | "per_dose";
  mgPerKg: [number, number];
  /** Số lần chia trong ngày (với per_day) hoặc số lần dùng/ngày (với per_dose). */
  dosesPerDay: number[];
  /** Liều tối đa mỗi lần (mg) nếu nguồn ghi. */
  maxPerDoseMg?: number;
  /** Liều tối đa mỗi ngày (mg) nếu nguồn ghi. */
  maxPerDayMg?: number;
  /** Đơn vị khác mg (ví dụ đơn vị quốc tế) – không dùng cho tính toán. */
  unit?: "mg";
}

export type DoseLine = "first" | "alternative_allergy" | "failure" | "failure_alternative" | "severe" | "risk_resistance" | "step_down" | "reference";

export interface Dose {
  id: string;
  role: SourceRole;
  line: DoseLine;
  drug: string;
  /** Liều đúng như nguồn ghi (diễn đạt tiếng Việt, giữ nguyên số). */
  dose: string;
  route: string;
  interval?: string;
  duration?: string;
  /** Liều tối đa đúng như nguồn ghi; không có -> để trống (giao diện ghi "Nguồn không nêu"). */
  max?: string;
  population: Population;
  /** Điều kiện áp dụng theo nguồn. */
  condition?: string;
  /** Mức độ dị ứng penicillin mà dòng này dành cho (nếu nguồn phân biệt). */
  allergy?: ("none" | "nonsevere" | "severe")[];
  /** Điều kiện bổ sung theo đầu vào (tất cả phải đúng) để dòng liều được hiển thị. */
  when?: Cond[];
  weight?: WeightDosing;
  strength?: string;
  quality?: string;
  citation: Citation;
  status: Status;
  note?: string;
}

/** Điều kiện của luật quyết định (so khớp với đầu vào). */
export interface Cond {
  field: string;
  op: "eq" | "in" | "gte" | "lt" | "lte" | "gt" | "truthy" | "falsy";
  value?: string | number | boolean | (string | number)[];
}

export type Decision = "antibiotic" | "antibiotic_or_observe" | "antibiotic_or_refer" | "reassess_switch" | "no_antibiotic" | "test_first" | "no_primary";

export interface DecisionRule {
  id: string;
  /** Tất cả điều kiện phải đúng. Thứ tự luật = thứ tự ưu tiên (luật đầu tiên khớp được dùng). */
  when: Cond[];
  decision: Decision;
  /** Dose id hiển thị khi luật khớp, theo nhóm. */
  doseIds?: string[];
  statementIds?: string[];
  citation: Citation;
}

export interface ConflictSide {
  sourceId: string;
  year: number;
  text: string;
  citation: Citation;
}
export interface Conflict {
  id: string;
  topic: string;
  sides: ConflictSide[];
}

export interface InputOption { value: string; label: string }
export interface InputSpec {
  field: string;
  label: string;
  type: "select" | "number" | "boolean";
  options?: InputOption[];
  min?: number;
  max?: number;
  unit?: string;
  /** Nguồn dùng trường này để phân nhánh. */
  citation: Citation;
}

export interface Disease {
  id: string;
  title: string;
  titleEn: string;
  population: string;
  primarySources: string[];
  diagnosisSources?: string[];
  comparisonSources: string[];
  referenceSources: string[];
  scopeNote?: string;
  crossRef?: string;
  evidenceGap?: string[];
  redFlags: Statement[];
  statements: Statement[];
  doses: Dose[];
  rules: DecisionRule[];
  conflicts: Conflict[];
  /** Nội dung nguồn không nêu – hiển thị "Nguồn không nêu – cần đánh giá lâm sàng". */
  notStated: string[];
  inputs: InputSpec[];
  dataVersion: string;
  sourcesCheckedOn: string;
}

export type InputValue = string | number | boolean | undefined;
export type Inputs = Record<string, InputValue>;

export interface ComputedDose {
  doseId: string;
  /** Kết quả tính theo cân nặng (đã giới hạn bởi liều tối đa của nguồn nếu có). */
  text: string;
  capped: boolean;
}

export interface DecideResult {
  ok: boolean;
  errors: string[];
  decision?: { value: Decision; ruleId: string; citation: Citation };
  first: Dose[];
  alternatives: Dose[];
  failure: Dose[];
  other: Dose[];
  computed: ComputedDose[];
  redFlags: Statement[];
  conflicts: Conflict[];
  notStated: string[];
  evidenceGap: string[];
  reference: { statements: Statement[]; doses: Dose[] };
  comparison: Dose[];
  unverified: Dose[];
}
