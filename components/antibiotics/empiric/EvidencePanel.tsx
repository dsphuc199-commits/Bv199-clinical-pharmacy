"use client";

/*
  FILE: components/antibiotics/empiric/EvidencePanel.tsx
  Nhan va khung trang thai bang chung (Nhiem vu 4C): VERIFIED / NEEDS_REVIEW /
  MISSING_EVIDENCE; noi dung SUPERSEDED liet ke rieng.
  VERIFIED = da xac minh nguon, KHONG thay phe duyet cua HĐT&ĐT BV199.
*/

import Link from "next/link";

import { APPROVAL_TEXT, type ApprovalStatus } from "@/data/antibiotics/empiric/approvals";

import { DOCS } from "@/data/antibiotics/empiric/regimens";
import {
  STATUS_TEXT,
  VERIFICATION_META,
  evidenceFor,
  type EvidenceStatus,
} from "@/lib/antibiotics/evidence-status";

const TONE: Record<EvidenceStatus, string> = {
  VERIFIED_SOURCE: "ev199-verified",
  NEEDS_REVIEW: "ev199-review",
  MISSING_EVIDENCE: "ev199-missing",
  SUPERSEDED: "ev199-superseded",
};

export function EvidenceBadge({ status }: { status: EvidenceStatus }) {
  return (
    <span className={`ev199-badge ${TONE[status]}`} title={STATUS_TEXT[status]}>
      {status}
      <span className="ev199-badge-text"> · {STATUS_TEXT[status]}</span>
      <EvStyle />
    </span>
  );
}

/* Phe duyet HĐT&ĐT – tach rieng voi trang thai nguon (Buoc 4D.2). */
export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const approved = status === "APPROVED_FOR_CLINICAL_USE";
  return (
    <span className={`ev199-badge ${approved ? "ev199-approved" : "ev199-notapproved"}`} title={APPROVAL_TEXT[status]}>
      {approved ? "APPROVED_FOR_CLINICAL_USE" : "CHƯA PHÊ DUYỆT HĐT&ĐT"}
      <EvStyle />
    </span>
  );
}

const ROLE_TEXT = {
  latest: "Mới nhất – đang áp dụng",
  "older-applied": "Cũ hơn – vẫn áp dụng cho phần chưa bị thay thế",
  superseded: "SUPERSEDED – phần nội dung đã bị thay thế",
} as const;

export function EvidencePanel({ diseaseId }: { diseaseId: string }) {
  const e = evidenceFor(diseaseId);
  if (!e) return null;
  const v = e.verification;

  return (
    <section className="ev199-panel" aria-label="Trạng thái bằng chứng">
      <div className="ev199-head">
        <strong>Trạng thái bằng chứng</strong>
        <span className="ev199-badges">
          <EvidenceBadge status={e.status} />
          <ApprovalBadge status={e.approval.status} />
        </span>
      </div>
      <p className={e.approval.status === "APPROVED_FOR_CLINICAL_USE" ? "ev199-note" : "ev199-approval"}>
        {e.approval.text}
        {e.approval.decision ? ` – Quyết định ${e.approval.decision}` : ""}
      </p>
      <p className="ev199-note">
        VERIFIED_SOURCE chỉ có nghĩa nguồn đã được xác minh; không thay thế phê duyệt của Hội đồng
        Thuốc và Điều trị BV199 (APPROVED_FOR_CLINICAL_USE).
      </p>

      {e.reasons.length > 0 && (
        <>
          <h4>Lý do {e.status === "MISSING_EVIDENCE" ? "thiếu bằng chứng" : "cần thẩm định"}</h4>
          <ul>
            {e.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      )}

      {e.notes.length > 0 && (
        <>
          <h4>Ghi chú</h4>
          <ul>
            {e.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </>
      )}

      <h4>Văn bản và vai trò</h4>
      <ul>
        {e.docs.map((d) => (
          <li key={d.doc}>
            <strong>QĐ {d.number}</strong> ({d.date}) – {ROLE_TEXT[d.role]}
            <span className="ev199-sub">{d.checkText}</span>
          </li>
        ))}
      </ul>

      <h4>Đối chiếu liều với bản chính thức</h4>
      <p className="ev199-stat">
        {v.regimens} phương án BYT: {v.match} khớp · {v.partial} khớp một phần (liều dẫn Dược thư) ·{" "}
        {v.mismatch} không khớp · {v.noDose} nguồn không nêu liều · {v.noText} chưa có bản chính thức để đối chiếu
        {e.module && (
          <>
            <br />
            {e.module.label}: {e.module.match}/{e.module.total} phương án khớp bản chính thức
          </>
        )}
      </p>

      <h4>Độ bao phủ</h4>
      <p className="ev199-stat">
        Phân tầng theo mức độ/nguy cơ: {e.stratified ? "có" : "không"} · Thời gian điều trị:{" "}
        {e.durationCoverage.withDuration}/{e.durationCoverage.dosed} phương án có liều ghi thời gian · Hiệu chỉnh
        theo thận: {e.renalCoverage.withData}/{e.renalCoverage.drugs} hoạt chất có dữ liệu · Quốc tế:{" "}
        {e.intl.status === "none" ? "chưa xác minh" : `${e.intl.status} (${e.intl.guidelines.join(", ")})`}
      </p>

      {e.superseded.length > 0 && (
        <details>
          <summary>SUPERSEDED – {e.superseded.length} phương án đã bị văn bản mới hơn thay thế</summary>
          <ul>
            {e.superseded.map((s) => (
              <li key={s.id}>
                QĐ {DOCS[s.doc].number}: {s.scenario}
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="ev199-note">
        Phương pháp đối chiếu ({VERIFICATION_META.generatedOn}): {VERIFICATION_META.method}{" "}
        <Link href="/antibiotics/empiric/evidence">Báo cáo tổng hợp</Link>
      </p>
      <EvStyle />
    </section>
  );
}

function EvStyle() {
  return (
    <style>{`
      .ev199-badge { display: inline-flex; align-items: center; gap: 2px; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; letter-spacing: .2px; }
      .ev199-badge-text { font-weight: 600; }
      .ev199-verified { background: #dcfce7; color: #166534; }
      .ev199-review { background: #fef3c7; color: #92400e; }
      .ev199-missing { background: #fee2e2; color: #991b1b; }
      .ev199-superseded { background: #e5e7eb; color: #374151; }
      .ev199-approved { background: #dbeafe; color: #1e40af; }
      .ev199-notapproved { background: #fff; color: #9a3412; border: 1px solid #fdba74; }
      .ev199-badges { display: inline-flex; flex-wrap: wrap; gap: 6px; }
      .ev199-approval { margin: 6px 0 0; font-size: 12px; font-weight: 700; color: #9a3412; }
      .ev199-panel { border: 1px solid #dbe6ed; border-radius: 12px; padding: 12px 14px; background: #fff; margin-bottom: 12px; font-size: 13px; line-height: 1.6; }
      .ev199-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; justify-content: space-between; }
      .ev199-panel h4 { margin: 12px 0 4px; font-size: 13px; }
      .ev199-panel ul { margin: 0; padding-left: 18px; }
      .ev199-sub { display: block; font-size: 11px; color: #647b8c; }
      .ev199-stat { margin: 0; font-size: 12px; color: #33505f; }
      .ev199-note { margin: 6px 0 0; font-size: 11px; color: #647b8c; }
      .ev199-panel summary { cursor: pointer; font-weight: 700; margin-top: 10px; color: #374151; }
      @media (max-width: 520px) { .ev199-badge-text { display: none; } }
    `}</style>
  );
}
