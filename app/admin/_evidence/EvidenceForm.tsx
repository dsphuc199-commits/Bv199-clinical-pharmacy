"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import type { EvidenceFields, EvidenceKind } from "@/lib/admin/guideline-library";
import { saveEvidence } from "./actions";

const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2";
const primary = "rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white disabled:opacity-60";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1 text-sm font-semibold">{label}{children}</label>;
}

type Props = {
  kind: EvidenceKind;
  id: string;
  fields?: EvidenceFields;
  reason?: string;
  basedOn: string;
  draftRevision: string;
  diseases: { id: string; title: string }[];
};

export function EvidenceForm({ kind, id, fields, reason, basedOn, draftRevision, diseases }: Props) {
  const [state, action, pending] = useActionState(saveEvidence, {});
  const guideline = kind === "guidelines";
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="intent" value="save" />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="basedOn" value={basedOn} />
      <input type="hidden" name="draftRevision" value={draftRevision} />
      <fieldset disabled={pending} className="grid gap-3 sm:grid-cols-2">
        <Field label="Tên tài liệu *"><input className={input} name="title" required maxLength={200} defaultValue={fields?.title} /></Field>
        <Field label="Cơ quan hoặc tổ chức ban hành *"><input className={input} name="issuer" required maxLength={150} defaultValue={fields?.issuer} /></Field>
        <Field label="Đường dẫn tài liệu gốc (HTTPS) *"><input className={input} name="url" type="url" required maxLength={2048} defaultValue={fields?.url} /></Field>
        <Field label={guideline ? "Số hiệu hoặc phiên bản *" : "Số hiệu hoặc phiên bản"}><input className={input} name="version" required={guideline} maxLength={100} defaultValue={fields?.version} /></Field>
        <Field label="Ngày ban hành"><input className={input} name="issuedOn" type="date" defaultValue={fields?.issuedOn} /></Field>
        <Field label="Ngày hiệu lực"><input className={input} name="effectiveOn" type="date" defaultValue={fields?.effectiveOn} /></Field>
        <Field label="Phạm vi áp dụng *"><input className={input} name="scope" required maxLength={250} defaultValue={fields?.scope} /></Field>
        <Field label="Bệnh cảnh liên quan">
          <select className={input} name="diseaseId" defaultValue={fields?.diseaseId ?? ""}>
            <option value="">Không gắn với bệnh cảnh cụ thể</option>
            {diseases.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
          </select>
        </Field>
        <Field label="Trạng thái thư viện">
          <select className={input} name="visible" defaultValue={fields?.visible === false ? "no" : "yes"}>
            <option value="yes">Hiển thị sau khi duyệt</option>
            <option value="no">Lưu trữ</option>
          </select>
        </Field>
        <Field label="Lý do hoặc tóm tắt cập nhật *"><textarea className={input} name="reason" rows={2} required maxLength={1000} defaultValue={reason} /></Field>
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <button className={primary} disabled={pending}>{pending ? "Đang lưu…" : "Lưu bản nháp"}</button>
        {state.message && (
          <p role="status" className={state.saved ? "text-teal-800" : "text-red-700"}>
            {state.message}{" "}
            {!id && state.draftId && <Link className="font-semibold underline" href={`/admin/${kind}?edit=${state.draftId}`}>Mở bản nháp</Link>}
          </p>
        )}
      </div>
    </form>
  );
}

export function EvidenceReview({ kind, id, revision, stale }: { kind: EvidenceKind; id: string; revision: string; stale: boolean }) {
  const [state, action, pending] = useActionState(saveEvidence, {});
  return (
    <form action={action} className="mt-4 flex flex-wrap items-center gap-3">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="draftRevision" value={revision} />
      <button className={primary} name="intent" value="publish" disabled={stale || pending}>
        {pending ? "Đang xử lý…" : "Duyệt và cập nhật thư viện"}
      </button>
      <button className="rounded-lg border border-slate-300 px-4 py-2 font-semibold" name="intent" value="discard" disabled={pending}>Bỏ bản nháp</button>
      {state.message && <p role="status" className={state.saved ? "text-teal-800" : "text-red-700"}>{state.message}</p>}
    </form>
  );
}
