import { Stethoscope, Microscope, SlidersHorizontal, ShieldCheck, Activity, ArrowLeftRight, ChartNoAxesColumn } from "lucide-react";
import Link from "next/link";

const moduleIcons = { empiric: Stethoscope, organism: Microscope, dosing: SlidersHorizontal, allergy: Activity, prophylaxis: ShieldCheck, "iv-to-po": ArrowLeftRight, antibiogram: ChartNoAxesColumn };

const modules = [
  {
    id: "empiric",
    title: "Lựa chọn KS kinh nghiệm",
    description:
      "Theo ổ nhiễm, mức độ nặng và yếu tố nguy cơ.",
    href: "/antibiotics/empiric",
  },

  {
    id: "organism",
    title: "KS theo vi khuẩn",
    description:
      "Lựa chọn kháng sinh theo vi sinh và AST.",
    href: "/antibiotics/organism",
  },

  {
    id: "dosing",
    title: "Hiệu chỉnh liều KS",
    description:
      "Theo chức năng thận, gan và bối cảnh lâm sàng.",
    href: "/antibiotics/dosing",
  },

  {
    id: "allergy",
    title: "Dị ứng kháng sinh",
    description:
      "Đánh giá dị ứng và nguy cơ phản ứng chéo.",
    href: "/antibiotics/allergy",
  },

  {
    id: "prophylaxis",
    title: "Dự phòng phẫu thuật",
    description:
      "Kháng sinh dự phòng theo loại phẫu thuật.",
    href: "/antibiotics/prophylaxis",
  },

  {
    id: "iv-to-po",
    title: "IV → PO",
    description:
      "Đánh giá điều kiện chuyển kháng sinh đường uống.",
    href: "/antibiotics/iv-to-po",
  },

  {
    id: "antibiogram",
    title: "Antibiogram BV199",
    description:
      "Dữ liệu vi sinh, kháng sinh đồ và báo cáo tổng hợp KKS của Bệnh viện 199.",
    href: "/antibiotics/antibiogram",
  },
];

export default function AntibioticsPage() {
  return (
    <main className="bv199-ams-home min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Antimicrobial Stewardship
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Kháng sinh & AMS
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Hỗ trợ lựa chọn, tối ưu hóa và giám sát sử dụng kháng sinh.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className="bv199-ams-card group flex min-h-[150px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
            >
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {module.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {module.description}
                </p>
              </div>

              <div className="mt-6 text-sm font-semibold text-teal-700">
                Mở công cụ →
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}