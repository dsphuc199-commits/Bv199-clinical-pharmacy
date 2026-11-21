import Link from "next/link";
import { currentAdmin } from "@/lib/auth/admin";
import {
  ACCOUNT_ROLE_LABELS, AUDIT_ACTIONS, accountStorageConfigured, readAccountRegistry,
  type AccountAuditEvent,
} from "@/lib/auth/account-store";
import { LOGIN_AUDIT_LIMIT, readLoginAudit } from "@/lib/auth/login-audit";

const formatDate = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short", timeStyle: "medium", timeZone: "Asia/Ho_Chi_Minh",
});

function accessDescription(access: AccountAuditEvent["after"]) {
  return `${ACCOUNT_ROLE_LABELS[access.role]} · ${access.enabled ? "Hoạt động" : "Đã khóa"}`;
}

export default async function AdminAuditPage() {
  if (!await currentAdmin()) return null;
  const configured = accountStorageConfigured();
  const [loginSnapshot, accountSnapshot] = configured ? await Promise.all([
    readLoginAudit().catch(() => null),
    readAccountRegistry().catch(() => null),
  ]) : [null, null];
  const logins = loginSnapshot?.data;
  const events = accountSnapshot?.data.audit.slice(0, 100);

  return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      <Link href="/admin" className="font-semibold text-teal-800">← Quản trị hệ thống</Link>
      <h1 className="text-3xl font-bold text-slate-900">Nhật ký đăng nhập &amp; tài khoản</h1>
      {!configured ? (
        <p role="status" className="rounded-lg bg-amber-50 p-4 text-amber-900">
          Chưa cấu hình kho lưu trữ nhật ký.
        </p>
      ) : (
        <>
          <section aria-labelledby="dang-nhap" className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="dang-nhap" className="text-lg font-bold text-slate-900">Nhật ký đăng nhập</h2>
              <form action="/admin/audit-log" method="get">
                <button type="submit" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-teal-800 hover:bg-teal-50">
                  Tải lại nhật ký
                </button>
              </form>
            </div>
            <p className="text-sm text-slate-600">
              Bắt đầu ghi từ <time dateTime="2026-11-21">21/11/2026</time>. Hiển thị tối đa {LOGIN_AUDIT_LIMIT} lượt đăng nhập thành công gần nhất theo giờ Việt Nam.
            </p>
            {!logins ? (
              <p role="status" className="rounded-lg bg-amber-50 p-3 text-amber-900">Chưa kết nối được kho nhật ký đăng nhập.</p>
            ) : logins.length === 0 ? (
              <p className="text-sm text-slate-700">Chưa có lượt đăng nhập mới kể từ khi bật nhật ký. Mở trang bằng một phiên đang hoạt động sẽ không tạo bản ghi mới.</p>
            ) : (
              <ol className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                {logins.map(({ id, username, role, timestamp }) => (
                  <li key={id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-3 text-sm text-slate-700">
                    <span className="min-w-0 break-words"><strong className="text-slate-900">{username}</strong> · {ACCOUNT_ROLE_LABELS[role]}</span>
                    <time className="shrink-0 tabular-nums" dateTime={timestamp}>{formatDate.format(new Date(timestamp))}</time>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section aria-labelledby="thay-doi-tai-khoan" className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 id="thay-doi-tai-khoan" className="text-lg font-bold text-slate-900">Nhật ký thay đổi tài khoản</h2>
            {!events ? (
              <p role="status" className="rounded-lg bg-amber-50 p-3 text-amber-900">Chưa kết nối được kho lưu trữ tài khoản.</p>
            ) : events.length === 0 ? <p className="text-sm text-slate-700">Chưa có thay đổi nào được ghi nhận.</p> : (
              <>
                <p className="text-sm text-slate-600">Hiển thị tối đa 100 thay đổi gần nhất.</p>
                <ol className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                  {events.map((event) => (
                    <li className="grid gap-1 p-3" key={event.id}>
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
          </section>
        </>
      )}
    </main>
  );
}
