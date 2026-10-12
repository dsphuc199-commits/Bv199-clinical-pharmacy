import Link from "next/link";

import {
  tdmModules,
} from "@/data/tdm/tdm-modules";

export default function TdmOverviewPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
            THERAPEUTIC DRUG MONITORING
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            TDM
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Chọn thuốc cần theo dõi để bắt đầu workflow TDM.
            Mỗi module được tổ chức thống nhất theo:
            tổng quan → quy trình → công cụ → ghi nhận can thiệp.
          </p>

        </header>

        {/* QUICK ACTION */}

        <section className="mt-6 grid gap-4 md:grid-cols-3">

          <QuickCard
            title="Chọn thuốc"
            text="Bắt đầu từ thuốc cần theo dõi."
            value="5 module"
          />

          <QuickCard
            title="PK/PD"
            text="Tra cứu chỉ số PK/PD liên quan."
            value="Liên kết"
            href="/pkpd"
          />

          <QuickCard
            title="SmartDose AI"
            text="Hiện tích hợp workflow Vancomycin."
            value="Vancomycin"
            href="/tdm/vancomycin"
          />

        </section>

        {/* MODULES */}

        <section className="mt-8">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                TDM MODULES
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Chọn thuốc cần theo dõi
              </h2>

            </div>

            <p className="text-sm text-slate-500">
              Một thuốc → một workflow thống nhất.
            </p>

          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {tdmModules.map(
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
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 font-black text-violet-700">
                      {
                        module.code
                      }
                    </div>

                    <span
                      className={
                        module.status ===
                        "ready"
                          ? "rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800"
                          : "rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800"
                      }
                    >
                      {
                        module.statusLabel
                      }
                    </span>

                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-violet-700">
                    {
                      module.name
                    }
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-violet-700">
                    {
                      module.subtitle
                    }
                  </p>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
                    {
                      module.description
                    }
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {module.pkpdIndex && (

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {
                          module.pkpdIndex
                        }
                      </span>

                    )}

                    {module.externalTool && (

                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                        {
                          module.externalTool.name
                        }
                      </span>

                    )}

                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">

                    <span className="text-sm font-bold text-violet-700">
                      Mở TDM →
                    </span>

                  </div>

                </Link>

              )
            )}

          </div>

        </section>

        {/* SIMPLE WORKFLOW */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            NGUYÊN TẮC CHUNG
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            TDM được sử dụng như thế nào?
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-4">

            <Step
              n="1"
              title="Chọn thuốc"
            />

            <Step
              n="2"
              title="Kiểm tra dữ liệu"
            />

            <Step
              n="3"
              title="Phân tích TDM"
            />

            <Step
              n="4"
              title="Can thiệp DSLS"
            />

          </div>

        </section>

      </div>

    </main>
  );
}

function QuickCard({
  title,
  text,
  value,
  href,
}: {
  title: string;

  text: string;

  value: string;

  href?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {
          title
        }
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {
          value
        }
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {
          text
        }
      </p>

    </div>
  );

  if (
    href
  ) {
    return (
      <Link
        href={
          href
        }
      >
        {
          content
        }
      </Link>
    );
  }

  return content;
}

function Step({
  n,
  title,
}: {
  n: string;

  title: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
        {
          n
        }
      </div>

      <p className="text-sm font-semibold text-slate-800">
        {
          title
        }
      </p>

    </div>
  );
}