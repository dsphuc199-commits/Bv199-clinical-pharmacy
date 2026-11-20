"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { DrugField, DrugFields } from "@/lib/drugs/catalog";
import { changeDrug } from "./actions";

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2";
const primaryButton = "rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white disabled:opacity-60";

type EditorProps = {
  id: string;
  inputs: { key: DrugField; label: string; required: boolean; maxLength: number }[];
  fields?: DrugFields;
  active: boolean;
  reason: string;
  baseRevision: string;
  draftRevision: string;
};

export function DrugEditor({ id, inputs, fields, active, reason, baseRevision, draftRevision }: EditorProps) {
  const [state, action, pending] = useActionState(changeDrug, {});
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="intent" value="save" />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="baseRevision" value={baseRevision} />
      <input type="hidden" name="draftRevision" value={draftRevision} />
      <fieldset disabled={pending} className="grid gap-3 sm:grid-cols-2">
        {inputs.map(({ key, label, required, maxLength }) => (
          <label key={key} className="grid gap-1 text-sm font-semibold">
            {label}{required ? " *" : ""}
            <input className={inputClass} name={key} defaultValue={fields?.[key]} maxLength={maxLength} required={required} />
          </label>
        ))}
        <label className="grid gap-1 text-sm font-semibold">
          Trạng thái sử dụng
          <select className={inputClass} name="active" defaultValue={active ? "yes" : "no"}>
            <option value="yes">Đang sử dụng</option>
            <option value="no">Ngừng sử dụng</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold sm:col-span-2">
          Nguồn hoặc lý do thay đổi *
          <textarea className={inputClass} name="reason" defaultValue={reason} required maxLength={512} rows={2} />
        </label>
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <button className={primaryButton} disabled={pending}>{pending ? "Đang lưu…" : "Lưu bản nháp"}</button>
        {state.message && (
          <p role="status" className={state.saved ? "text-teal-800" : "text-red-700"}>
            {state.message}{" "}
            {!id && state.draftId && <Link className="font-semibold underline" href={`/admin/drugs?edit=${encodeURIComponent(state.draftId)}`}>Xem bản nháp</Link>}
          </p>
        )}
      </div>
    </form>
  );
}

export function DrugDraftActions({ id, revision, stale }: { id: string; revision: string; stale: boolean }) {
  const [state, action, pending] = useActionState(changeDrug, {});
  return (
    <form action={action} className="mt-4 flex flex-wrap items-center gap-3">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="draftRevision" value={revision} />
      <button name="intent" value="approve" className={primaryButton} disabled={pending || stale}>
        {pending ? "Đang xử lý…" : "Duyệt và cập nhật danh mục"}
      </button>
      <button name="intent" value="discard" className="rounded-lg border border-slate-300 px-4 py-2 font-semibold" disabled={pending}>
        Bỏ bản nháp
      </button>
      {state.message && <p role="status" className={state.saved ? "text-teal-800" : "text-red-700"}>{state.message}</p>}
    </form>
  );
}
