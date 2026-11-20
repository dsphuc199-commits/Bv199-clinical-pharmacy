"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { saveAccount } from "./actions";

export type AccountView = {
  username: string;
  displayName: string;
  department: string;
  role: "viewer" | "pharmacy-admin";
  enabled: boolean;
  revision: string;
};

const inputClass = "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1 text-sm font-semibold">{label}{children}</label>;
}

export function AccountForm({ account, self = false }: { account?: AccountView; self?: boolean }) {
  const [state, action, pending] = useActionState(saveAccount, {});
  const isEdit = !!account;
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="intent" value={isEdit ? "updated" : "created"} />
      {account && <input type="hidden" name="username" value={account.username} />}
      {account && <input type="hidden" name="expectedRevision" value={account.revision} />}
      <fieldset className="grid gap-3 sm:grid-cols-2" disabled={pending}>
        {!account && (
          <Field label="Tên đăng nhập">
            <input className={inputClass} name="username" autoComplete="off" required pattern="[a-zA-Z0-9][a-zA-Z0-9._\-]{2,47}" />
          </Field>
        )}
        <Field label="Họ và tên">
          <input className={inputClass} name="displayName" defaultValue={account?.displayName} required maxLength={100} />
        </Field>
        <Field label="Khoa/phòng">
          <input className={inputClass} name="department" defaultValue={account?.department} maxLength={100} />
        </Field>
        <Field label="Vai trò">
          {self && <input type="hidden" name="role" value="pharmacy-admin" />}
          <select className={inputClass} name="role" defaultValue={account?.role ?? "viewer"} disabled={self}>
            <option value="viewer">Người dùng</option>
            <option value="pharmacy-admin">Quản trị Khoa Dược</option>
          </select>
        </Field>
        {account ? (
          <Field label="Trạng thái">
            {self && <input type="hidden" name="enabled" value="on" />}
            <select className={inputClass} name="enabled" defaultValue={account.enabled ? "on" : "off"} disabled={self}>
              <option value="on">Hoạt động</option>
              <option value="off">Đã khóa</option>
            </select>
          </Field>
        ) : (
          <Field label="Mật khẩu (ít nhất 12 ký tự)">
            <input className={inputClass} name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} />
          </Field>
        )}
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white disabled:opacity-60" disabled={pending}>
          {pending ? "Đang lưu…" : isEdit ? "Lưu tài khoản" : "Tạo tài khoản"}
        </button>
        {state.message && <p role="status" className={state.saved ? "text-teal-800" : "text-red-700"}>{state.message}</p>}
      </div>
    </form>
  );
}

export function ResetAccountPassword({ username, revision }: { username: string; revision: string }) {
  const [state, action, pending] = useActionState(saveAccount, {});
  return (
    <details className="mt-4 border-t border-slate-200 pt-3">
      <summary className="cursor-pointer text-sm font-semibold text-teal-800">Đặt lại mật khẩu</summary>
      <form action={action} className="mt-3 grid max-w-md gap-2">
        <input type="hidden" name="username" value={username} />
        <input type="hidden" name="expectedRevision" value={revision} />
        <input type="hidden" name="intent" value="passwordReset" />
        <Field label="Mật khẩu mới (ít nhất 12 ký tự)">
          <input className={inputClass} name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} />
        </Field>
        <button className="justify-self-start rounded-lg border border-teal-700 px-3 py-2 font-semibold text-teal-800 disabled:opacity-60" disabled={pending}>
          {pending ? "Đang lưu…" : "Đặt lại mật khẩu"}
        </button>
        {state.message && <p role="status" className={state.saved ? "text-teal-800" : "text-red-700"}>{state.message}</p>}
      </form>
    </details>
  );
}
