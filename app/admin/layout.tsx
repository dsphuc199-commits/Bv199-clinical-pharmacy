import Link from "next/link";
import type { ReactNode } from "react";
import { currentAdmin } from "@/lib/auth/admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (await currentAdmin()) return children;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Quản trị hệ thống</h1>
      <p className="mt-3 text-slate-700">Trang này yêu cầu quyền Quản trị Khoa Dược.</p>
      <Link className="mt-4 inline-block font-semibold text-teal-800 underline" href="/login?next=/admin">
        Đăng nhập bằng tài khoản quản trị
      </Link>
    </main>
  );
}
