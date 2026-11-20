import Link from "next/link";
import { currentAdmin } from "@/lib/auth/admin";
import {
  ACCOUNT_ROLE_LABELS, AUDIT_ACTIONS, accountStorageConfigured, readAccountRegistry,
  type AccountAuditEvent,
} from "@/lib/auth/account-store";

const formatDate = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh",
});

function accessDescription(access: AccountAuditEvent["after"]) {
  return `${ACCOUNT_ROLE_LABELS[access.role]} · ${access.enabled ? "Hoạt động" : "Đã khóa"}`;
}

export default async function AdminAuditPage() {
  if (!await currentAdmin()) return null;
  const configured = accountStorageConfigured();
  const snapshot = configured ? await readAccountRegistry().catch(() => null) : null;
  const events = snapshot?.data.audit.slice(0, 100);
  return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      <Link href="/admin" className="font-semibold text-teal-800">← Quản trị hệ thống</Link>
      <h1 className="text-3xl font-bold text-slate-900">Nhật ký thay đổi tài khoản</h1>
      {!events ? (
        <p role="status" className="rounded-lg bg-amber-50 p-4 text-amber-900">
          {configured ? "Chưa kết nối được kho lưu trữ tài khoản." : "Chưa cấu hình kho lưu trữ tài khoản."}
        </p>
      ) : events.length === 0 ? <p>Chưa có thay đổi nào được ghi nhận.</p> : (
        <>
          <p className="text-sm text-slate-600">Hiển thị tối đa 100 thay đổi gần nhất.</p>
          <ol className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {events.map((event) => (
              <li className="grid gap-1 p-4" key={event.id}>
                <strong>{AUDIT_ACTIONS[event.action]} · {event.target}</strong>
                <span className="text-sm text-slate-700">
                  {event.actor} · <time dateTime={event.timestamp}>{formatDate.format(new Date(event.timestamp))}</time>
                </span>
                {event.action !== "passwordReset" && (
                  <span className="text-sm text-slate-700">
                    {event.before && `${accessDescription(event.before)} → `}{accessDescription(event.after)}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}
