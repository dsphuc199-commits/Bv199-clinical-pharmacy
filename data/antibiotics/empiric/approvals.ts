/*
  FILE: data/antibiotics/empiric/approvals.ts

  PHE DUYET CUA HOI DONG THUOC VA DIEU TRI BV199 (Buoc 4D.2).
  Tach rieng voi trang thai nguon:
  - VERIFIED_SOURCE: nguon da duoc xac minh (lib/antibiotics/evidence-status.ts).
  - APPROVED_FOR_CLINICAL_USE: HĐT&ĐT BV199 da ban hanh quyet dinh ap dung.
  VERIFIED_SOURCE KHONG dong nghia APPROVED_FOR_CLINICAL_USE.

  Chi them ban ghi khi co quyet dinh chinh thuc (so, ngay). Ung dung KHONG tu tao phe duyet.
  Hien tai: chua co quyet dinh nao duoc nhap.
*/

export type ApprovalStatus = "APPROVED_FOR_CLINICAL_USE" | "NOT_APPROVED";

export type ApprovalRecord = {
  diseaseId: string;
  /* De trong = ap dung cho moi phuong an cua mat benh */
  regimenIds?: string[];
  decisionNumber: string;
  decisionDate: string;
  note?: string;
};

export const HDTDT_APPROVALS: ApprovalRecord[] = [];

export const APPROVAL_TEXT: Record<ApprovalStatus, string> = {
  APPROVED_FOR_CLINICAL_USE: "Đã được HĐT&ĐT BV199 phê duyệt áp dụng",
  NOT_APPROVED: "Chưa được HĐT&ĐT BV199 phê duyệt – không tự động áp dụng; bác sĩ/dược sĩ quyết định cho từng người bệnh",
};

export function approvalFor(diseaseId: string, regimenId?: string): { status: ApprovalStatus; record?: ApprovalRecord } {
  const record = HDTDT_APPROVALS.find(
    (a) => a.diseaseId === diseaseId && (!a.regimenIds || !regimenId || a.regimenIds.includes(regimenId))
  );
  return record ? { status: "APPROVED_FOR_CLINICAL_USE", record } : { status: "NOT_APPROVED" };
}

/* Phuong an chi duoc coi la phe duyet khi MOI mat benh cua no deu co quyet dinh. */
export function regimenApproval(regimenId: string, diseaseIds: string[]): ApprovalStatus {
  return diseaseIds.length > 0 && diseaseIds.every((d) => approvalFor(d, regimenId).status === "APPROVED_FOR_CLINICAL_USE")
    ? "APPROVED_FOR_CLINICAL_USE"
    : "NOT_APPROVED";
}
