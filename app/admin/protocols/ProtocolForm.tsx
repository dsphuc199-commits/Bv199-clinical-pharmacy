"use client";

import { useActionState, type ReactNode } from "react";
import type { BiliaryContent } from "@/lib/antibiotics/biliary-protocol";
import { saveProtocol } from "./actions";

const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal";
const button = "rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white disabled:opacity-60";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1 text-sm font-semibold">{label}{children}</label>;
}

type Props = {
  content: BiliaryContent;
  basedOn: string;
  revision: string;
  reason: string;
  groups: { id: string; title: string; rows: { id: string; drug: string; baseline: string }[] }[];
};

export function ProtocolForm({ content, basedOn, revision, reason, groups }: Props) {
  const [state, action, pending] = useActionState(saveProtocol, {});
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="intent" value="save" />
      <input type="hidden" name="basedOn" value={basedOn} />
      <input type="hidden" name="revision" value={revision} />
      <fieldset disabled={pending} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tên tài liệu đối chiếu"><input className={input} required maxLength={200} name="sourceTitle" defaultValue={content.source.title} /></Field>
          <Field label="Mục, bảng hoặc số trang"><input className={input} required maxLength={200} name="sourceLocator" defaultValue={content.source.locator} /></Field>
        </div>
        <Field label="Đường dẫn tài liệu gốc (HTTPS)"><input className={input} type="url" required maxLength={2048} name="sourceUrl" defaultValue={content.source.url} /></Field>
        {groups.map((group) => (
          <details key={group.id} className="rounded-xl border border-slate-200 p-3">
            <summary className="cursor-pointer font-semibold text-teal-900">{group.title}</summary>
            <div className="mt-3 grid gap-3">
              {group.rows.map((row) => (
                <Field key={row.id} label={row.drug}>
                  <textarea className={input} required rows={2} maxLength={400} name={`dose:${row.id}`} defaultValue={content.doses[row.id] ?? row.baseline} />
                </Field>
              ))}
            </div>
          </details>
        ))}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Thời gian thể nhẹ"><input className={input} required maxLength={250} name="mildDuration" defaultValue={content.mildDuration} /></Field>
          <Field label="Thời gian thể trung bình và nặng"><input className={input} required maxLength={250} name="moderateSevereDuration" defaultValue={content.moderateSevereDuration} /></Field>
        </div>
        <Field label="Lý do cập nhật"><textarea className={input} required rows={2} maxLength={1000} name="reason" defaultValue={reason} /></Field>
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <button className={button} disabled={pending}>{pending ? "Đang lưu…" : "Lưu bản nháp"}</button>
        {state.message && <p role="status" className={state.saved ? "text-teal-800" : "text-red-700"}>{state.message}</p>}
      </div>
    </form>
  );
}

export function ProtocolReview({ revision, stale }: { revision: string; stale: boolean }) {
  const [state, action, pending] = useActionState(saveProtocol, {});
  return (
    <form action={action} className="mt-4 flex flex-wrap items-center gap-3">
      <input type="hidden" name="revision" value={revision} />
      <button className={button} name="intent" value="publish" disabled={pending || stale}>
        {pending ? "Đang xử lý…" : "Duyệt và phát hành phác đồ"}
      </button>
      <button className="rounded-lg border border-slate-300 px-4 py-2 font-semibold" name="intent" value="discard" disabled={pending}>Bỏ bản nháp</button>
      {state.message && <p role="status" className={state.saved ? "text-teal-800" : "text-red-700"}>{state.message}</p>}
    </form>
  );
}
