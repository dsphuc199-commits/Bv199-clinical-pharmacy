import Link from "next/link";
import { currentAdmin } from "@/lib/auth/admin";

export default async function AdminRolesPage() {
  if (!await currentAdmin()) return null;
  return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      <Link href="/admin" className="font-semibold text-teal-800">← Quản trị hệ thống</Link>
      <h1 className="text-3xl font-bold text-slate-900">Vai trò hệ thống</h1>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <dt className="text-lg font-bold">Người dùng</dt>
          <dd className="mt-2 text-slate-700">Tra cứu và sử dụng các công cụ lâm sàng.</dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <dt className="text-lg font-bold">Quản trị Khoa Dược</dt>
          <dd className="mt-2 text-slate-700">Quản lý tài khoản, gán vai trò và xem nhật ký thay đổi.</dd>
        </div>
      </dl>
      <Link href="/admin/users" className="font-semibold text-teal-800">Quản lý tài khoản →</Link>
    </main>
  );
}
