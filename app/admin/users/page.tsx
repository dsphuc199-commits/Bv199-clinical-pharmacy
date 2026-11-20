import Link from "next/link";
import { AccountForm, ResetAccountPassword } from "./AccountForm";
import { currentAdmin } from "@/lib/auth/admin";
import { configuredRole } from "@/lib/auth/access";
import { ACCOUNT_ROLE_LABELS, accountStorageConfigured, readAccountRegistry } from "@/lib/auth/account-store";
import { authConfig } from "@/lib/auth/session";

export default async function AdminUsersPage() {
  const admin = await currentAdmin();
  if (!admin) return null;
  const config = authConfig();
  const snapshot = accountStorageConfigured() ? await readAccountRegistry().catch(() => null) : null;
  const error = accountStorageConfigured()
    ? "Chưa kết nối được kho lưu trữ tài khoản."
    : "Chưa cấu hình kho lưu trữ tài khoản.";

  return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      <Link href="/admin" className="font-semibold text-teal-800">← Quản trị hệ thống</Link>
      <h1 className="text-3xl font-bold text-slate-900">Người dùng & phân quyền</h1>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-bold">Tài khoản cấu hình trên Vercel</h2>
        <ul className="grid gap-2">
          {[...config.users.keys()].sort().map((username) => (
            <li key={username} className="flex flex-wrap justify-between gap-2 text-sm">
              <span>{username}{username === admin.user ? " (Bạn)" : ""}</span>
              <span className="font-semibold">{ACCOUNT_ROLE_LABELS[configuredRole(username)]}</span>
            </li>
          ))}
        </ul>
      </section>
      {snapshot ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-bold">Tạo tài khoản</h2>
            <AccountForm />
          </section>
          <section className="grid gap-3">
            <h2 className="text-lg font-bold">Tài khoản quản lý trên web</h2>
            {snapshot.data.accounts.length === 0 && <p>Chưa có tài khoản được tạo trên web.</p>}
            {snapshot.data.accounts.map(({ username, displayName, department, role, enabled, revision }) => (
              <details key={username} className="rounded-2xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer font-semibold">
                  {displayName} ({username}) · {ACCOUNT_ROLE_LABELS[role]} · {enabled ? "Hoạt động" : "Đã khóa"}
                </summary>
                <div className="mt-4">
                  <AccountForm key={revision} account={{ username, displayName, department, role, enabled, revision }} self={username === admin.user} />
                  <ResetAccountPassword username={username} revision={revision} />
                </div>
              </details>
            ))}
          </section>
        </>
      ) : <p role="status" className="rounded-lg bg-amber-50 p-4 text-amber-900">{error}</p>}
    </main>
  );
}
