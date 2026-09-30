import Link from "next/link";

export default function PKPDPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-blue-800 text-white">
        <div className="mx-auto max-w-6xl px-6 py-7">
          <h1 className="text-3xl font-bold">
            PK/PD kháng sinh
          </h1>

          <p className="mt-2 text-blue-100">
            Hệ thống hỗ trợ Dược lâm sàng BV199
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">
            Module đang được xây dựng
          </h2>

          <p className="mt-3 text-slate-600">
            Module này sẽ hỗ trợ fT&gt;MIC, AUC/MIC,
            Cmax/MIC và các mục tiêu PK/PD theo từng
            nhóm kháng sinh.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-700 px-4 py-2 text-white"
          >
            ← Trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}