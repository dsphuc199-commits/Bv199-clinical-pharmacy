import Link from "next/link";
import {
  Stethoscope, Microscope, SlidersHorizontal, ShieldCheck,
  Activity, ArrowLeftRight, ChartNoAxesColumn, ChevronRight,
} from "lucide-react";

const modules = [
  { id: "empiric", title: "Lựa chọn kháng sinh kinh nghiệm", desktopTitle: "Lựa chọn KS kinh nghiệm", description: "Theo vị trí nhiễm khuẩn, mức độ nặng và yếu tố nguy cơ.", desktopDescription: "Theo ổ nhiễm, mức độ nặng và yếu tố nguy cơ.", action: "Tra cứu phác đồ", href: "/antibiotics/empiric", icon: Stethoscope, group: "Lựa chọn điều trị" },
  { id: "organism", title: "Kháng sinh theo tác nhân vi sinh", desktopTitle: "KS theo vi khuẩn", description: "Tham khảo lựa chọn kháng sinh theo vi khuẩn, AST và MIC.", desktopDescription: "Lựa chọn kháng sinh theo vi sinh và AST.", action: "Tra cứu theo tác nhân", href: "/antibiotics/organism", icon: Microscope, group: "Lựa chọn điều trị" },
  { id: "dosing", title: "Hiệu chỉnh liều kháng sinh", desktopTitle: "Hiệu chỉnh liều KS", description: "Đánh giá chức năng thận, gan và các yếu tố PK/PD.", desktopDescription: "Theo chức năng thận, gan và bối cảnh lâm sàng.", action: "Đánh giá và hiệu chỉnh liều", href: "/antibiotics/dosing", icon: SlidersHorizontal, group: "Tối ưu điều trị" },
  { id: "allergy", title: "Đánh giá dị ứng kháng sinh", desktopTitle: "Dị ứng kháng sinh", description: "Khai thác tiền sử và đánh giá nguy cơ phản ứng chéo.", desktopDescription: "Đánh giá dị ứng và nguy cơ phản ứng chéo.", action: "Đánh giá nguy cơ dị ứng", href: "/antibiotics/allergy", icon: Activity, group: "Tối ưu điều trị" },
  { id: "prophylaxis", title: "Kháng sinh dự phòng phẫu thuật", desktopTitle: "Dự phòng phẫu thuật", description: "Tra cứu khuyến cáo KSDP theo loại phẫu thuật.", desktopDescription: "Kháng sinh dự phòng theo loại phẫu thuật.", action: "Tra cứu KSDP", href: "/antibiotics/prophylaxis", icon: ShieldCheck, group: "Dự phòng và giám sát" },
  { id: "iv-to-po", title: "Chuyển kháng sinh IV → PO", desktopTitle: "IV → PO", description: "Đánh giá tiêu chí chuyển đổi từ đường tĩnh mạch sang đường uống.", desktopDescription: "Đánh giá điều kiện chuyển kháng sinh đường uống.", action: "Đánh giá chuyển đường dùng", href: "/antibiotics/iv-to-po", icon: ArrowLeftRight, group: "Tối ưu điều trị" },
  { id: "antibiogram", title: "Antibiogram BV199", desktopTitle: "Antibiogram BV199", description: "Dữ liệu vi sinh và mức độ nhạy cảm kháng sinh tại BV199.", desktopDescription: "Dữ liệu vi sinh, kháng sinh đồ và báo cáo tổng hợp KKS của Bệnh viện 199.", action: "Xem dữ liệu kháng thuốc", href: "/antibiotics/antibiogram", icon: ChartNoAxesColumn, group: "Dự phòng và giám sát" },
] as const;

const groups = ["Lựa chọn điều trị", "Tối ưu điều trị", "Dự phòng và giám sát"] as const;

export default function AntibioticsPage() {
  return (
    <main className="bv199-ams-home min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Antimicrobial Stewardship</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Kháng sinh &amp; AMS</h1>
          <p className="mt-2 text-sm text-slate-500">Hỗ trợ lựa chọn, tối ưu hóa và giám sát sử dụng kháng sinh.</p>
        </header>

        {/* Desktop: giữ nguyên kiểu thẻ và bố cục trước đây. */}
        <section className="bv199-ams-desktop grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Các phân hệ quản lý sử dụng kháng sinh">
          {modules.map((module) => (
            <Link key={module.id} href={module.href} className="bv199-ams-card group flex min-h-[150px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
              <div>
                <h2 className="text-base font-semibold text-slate-900">{module.desktopTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{module.desktopDescription}</p>
              </div>
              <div className="mt-6 text-sm font-semibold text-teal-700">{module.action} →</div>
            </Link>
          ))}
        </section>

        {/* Mobile: nhóm theo tác vụ lâm sàng, bấm được trên toàn bộ thẻ. */}
        <div className="bv199-ams-clinical-mobile">
          {groups.map((group) => (
            <section className="bv199-ams-clinical-group" key={group} aria-label={group}>
              <h2 className="bv199-ams-group-title">{group}</h2>
              <div className="bv199-ams-clinical-list">
                {modules.filter((module) => module.group === group).map((module) => {
                  const Icon = module.icon;
                  return (
                    <Link className="bv199-ams-clinical-card" key={module.id} href={module.href}>
                      <span className="bv199-ams-clinical-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.9}/></span>
                      <span className="bv199-ams-clinical-copy">
                        <strong>{module.title}</strong>
                        <small>{module.description}</small>
                        <span className="bv199-ams-clinical-action">{module.action} <span aria-hidden="true">→</span></span>
                      </span>
                      <ChevronRight className="bv199-ams-clinical-chevron" size={19} aria-hidden="true"/>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
      <style>{`
        .bv199-ams-clinical-mobile { display: none; }
        @media (max-width: 800px) {
          .bv199-ams-desktop { display: none !important; }
          .bv199-ams-clinical-mobile { display: block; }
          .bv199-ams-clinical-group { display: block !important; margin: 0 0 21px; }
          .bv199-ams-group-title { color: #486675; font-size: 12px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; margin: 0 0 9px; }
          .bv199-ams-clinical-list { display: grid; grid-template-columns: 1fr; gap: 9px; }
          .bv199-ams-clinical-card { display: flex; align-items: center; min-width: 0; gap: 12px; padding: 13px 11px; min-height: 102px; border: 1px solid #e0eaf0; border-radius: 15px; background: #fff; color: #162b3b; box-shadow: 0 2px 7px rgba(23,48,62,.045); text-decoration: none; }
          .bv199-ams-clinical-card:focus-visible { outline: 3px solid #0b8795; outline-offset: 2px; }
          .bv199-ams-clinical-icon { flex: 0 0 42px; width: 42px; height: 42px; display: grid; place-items: center; border-radius: 12px; background: #e8f6f7; color: #087f8c; }
          .bv199-ams-clinical-copy { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
          .bv199-ams-clinical-copy strong { font-size: 14px; line-height: 1.35; font-weight: 750; }
          .bv199-ams-clinical-copy small { color: #60788a; font-size: 12px; line-height: 1.45; }
          .bv199-ams-clinical-action { margin-top: 3px; color: #067c87; font-size: 12px; font-weight: 700; }
          .bv199-ams-clinical-chevron { flex: 0 0 auto; color: #7895a3; }
        }
      `}</style>
    </main>
  );
}
