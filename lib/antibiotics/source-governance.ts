/** Presentation metadata only. Never changes treatment selection or approval. */
export type SourceRole =
  | "CURRENT_APPLICABLE" | "FOCUSED_UPDATE" | "HISTORICAL"
  | "CONFLICT" | "SOURCE_NOT_VERIFIED" | "REVIEW_REQUIRED";

export const SOURCE_ROLE_TEXT: Record<SourceRole, string> = {
  CURRENT_APPLICABLE: "Hiện hành trong phạm vi đã xác minh",
  FOCUSED_UPDATE: "Cập nhật một phần",
  HISTORICAL: "Lịch sử hướng dẫn",
  CONFLICT: "Khác biệt cần phản biện",
  SOURCE_NOT_VERIFIED: "Chưa xác minh nguồn",
  REVIEW_REQUIRED: "Cần thẩm định chuyên môn",
};

export type SourceAssessment = {
  originalRead: boolean;
  scopeConfirmed: boolean;
  publicationConfirmed: boolean;
  /** An explicit replacement decision for this organisation and clinical scope. */
  replacementConfirmed?: boolean;
  focusedUpdateConfirmed?: boolean;
  currentApplicabilityConfirmed?: boolean;
  conflictConfirmed?: boolean;
};

export function sourceRole(a: SourceAssessment): SourceRole {
  if (!a.originalRead || !a.publicationConfirmed) return "SOURCE_NOT_VERIFIED";
  if (a.conflictConfirmed) return "CONFLICT";
  if (a.replacementConfirmed && a.scopeConfirmed) return "HISTORICAL";
  if (!a.scopeConfirmed) return "REVIEW_REQUIRED";
  if (a.focusedUpdateConfirmed) return "FOCUSED_UPDATE";
  if (a.currentApplicabilityConfirmed) return "CURRENT_APPLICABLE";
  return "REVIEW_REQUIRED";
}

/** Publication/lifecycle evidence; not verification of any dose in a table. */
export const CONFIRMED_SOURCE_LIFECYCLE = {
  byt2147: {
    role: "CURRENT_APPLICABLE",
    scope: "CAP người lớn; thay QĐ4815/2020 theo thông báo của Cục Quản lý Khám, chữa bệnh",
    url: "https://kcb.vn/tin-tuc/huong-dan-chan-doan-va-dieu-tri-viem-phoi-mac-phai-cong-dong-o-nguoi-lon.html",
    checkedOn: "2026-11-06",
  },
  "byt4815-2020": {
    role: "HISTORICAL",
    scope: "CAP người lớn; QĐ2147 thay thế từ15/7/2026",
    url: "https://kcb.vn/tin-tuc/huong-dan-chan-doan-va-dieu-tri-viem-phoi-mac-phai-cong-dong-o-nguoi-lon.html",
    checkedOn: "2026-11-06",
  },
  "atsidsa-hapvap-2016": {
    role: "CURRENT_APPLICABLE",
    scope: "HAP/VAP người lớn; trang IDSA ghi CURRENT cho bản2016. Chưa xác minh được bản ATS/IDSA2026 chính thức; không gắn nhãn2026.",
    url: "https://www.idsociety.org/practice-guideline/hap_vap/",
    checkedOn: "2026-11-06",
  },
} satisfies Record<string, {role: SourceRole; scope: string; url: string; checkedOn: string}>;

export function confirmedLifecycle(key: string) {
  return Object.prototype.hasOwnProperty.call(CONFIRMED_SOURCE_LIFECYCLE,key)
    ? CONFIRMED_SOURCE_LIFECYCLE[key as keyof typeof CONFIRMED_SOURCE_LIFECYCLE]
    : undefined;
}
