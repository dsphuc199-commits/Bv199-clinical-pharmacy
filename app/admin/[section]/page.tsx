import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAdminModule,
} from "@/data/admin/admin-modules";

type PageProps = {
  params: Promise<{
    section: string;
  }>;
};

export default async function AdminSectionPage({
  params,
}: PageProps) {
  const {
    section,
  } =
    await params;

  const module =
    getAdminModule(
      section
    );

  if (
    !module
  ) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl">

        <div className="mb-5">

          <Link
            href="/admin"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Quản trị hệ thống
          </Link>

        </div>

        <header>

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 font-extrabold text-teal-700">
              {
                module.icon
              }
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                SYSTEM ADMINISTRATION
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {
                  module.title
                }
              </h1>

            </div>

          </div>

          <p className="mt-4 max-w-4xl leading-7 text-slate-600">
            {
              module.description
            }
          </p>

        </header>

        <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">

          <p className="font-bold text-blue-950">
            Thiết kế module
          </p>

          <p className="mt-2 text-sm leading-6 text-blue-900">
            Đây là trang quản trị nền.
            Sau khi cấu trúc dữ liệu ổn định,
            module sẽ được kết nối với database
            và hệ thống phân quyền.
          </p>

        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            CHỨC NĂNG
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Nội dung quản lý
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {module.features.map(
              (
                feature,
                index
              ) => (

                <div
                  key={
                    feature
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-xs font-bold text-teal-700">
                    {
                      index +
                      1
                    }
                  </div>

                  <p className="mt-3 font-semibold text-slate-900">
                    {
                      feature
                    }
                  </p>

                </div>

              )
            )}

          </div>

        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <p className="font-bold text-amber-950">
            Trạng thái
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-900">
            Module hiện đang ở trạng thái:
            {" "}
            <strong>
              {
                module.status ===
                "ready"
                  ? "Đã triển khai"
                  : module.status ===
                      "developing"
                    ? "Đang phát triển"
                    : "Kế hoạch"
              }
            </strong>
            .
          </p>

        </section>

      </div>

    </main>
  );
}