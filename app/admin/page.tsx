import Link from "next/link";

import {
  adminModules,
} from "@/data/admin/admin-modules";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl">

        <header>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            SYSTEM ADMINISTRATION
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Quản trị hệ thống
          </h1>

          <p className="mt-3 max-w-4xl leading-7 text-slate-600">
            Quản lý người dùng, phân quyền, danh mục thuốc,
            dữ liệu chuẩn và nguồn tài liệu của BV199 Clinical Pharmacy.
          </p>

        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            label="Module quản trị"
            value={
              adminModules.length.toString()
            }
          />

          <SummaryCard
            label="Người dùng"
            value="RBAC"
          />

          <SummaryCard
            label="Drug Master"
            value="Centralized"
          />

          <SummaryCard
            label="Audit"
            value="Planned"
          />

        </section>

        <section className="mt-8">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            QUẢN TRỊ
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Danh mục chức năng
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {adminModules.map(
              (
                module
              ) => (

                <Link
                  key={
                    module.id
                  }
                  href={
                    module.href
                  }
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-sm font-extrabold text-teal-700">
                      {
                        module.icon
                      }
                    </div>

                    <StatusBadge
                      status={
                        module.status
                      }
                    />

                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-teal-700">
                    {
                      module.title
                    }
                  </h3>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600">
                    {
                      module.description
                    }
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {module.features
                      .slice(
                        0,
                        3
                      )
                      .map(
                        (
                          feature
                        ) => (

                          <span
                            key={
                              feature
                            }
                            className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600"
                          >
                            {
                              feature
                            }
                          </span>

                        )
                      )}

                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">

                    <span className="text-sm font-bold text-teal-700">
                      Mở quản trị →
                    </span>

                  </div>

                </Link>

              )
            )}

          </div>

        </section>

      </div>

    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {
          label
        }
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {
          value
        }
      </p>

    </div>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | "ready"
    | "developing"
    | "planned";
}) {
  if (
    status ===
    "ready"
  ) {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
        Đã triển khai
      </span>
    );
  }

  if (
    status ===
    "developing"
  ) {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800">
        Đang phát triển
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
      Kế hoạch
    </span>
  );
}