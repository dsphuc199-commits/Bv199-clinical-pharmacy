import Link from "next/link";
import {
  Stethoscope, Microscope, SlidersHorizontal, ShieldCheck, UserRound, TrendingDown,
  Activity, ArrowLeftRight, ChartNoAxesColumn, ChevronRight, FlaskConical, Gauge,
} from "lucide-react";

/**
 * BV199 AMS — one responsive card tree. No duplicated desktop/mobile modules.
 * Thu tu theo quy trinh quan ly su dung khang sinh: khoi dau dieu tri -> danh gia lai
 * sau 48–72 gio (vi sinh, xuong thang, chuyen duong uong, toi uu lieu) -> du lieu.
 * Important: use DIVs rather than SECTION elements for grouping because an
 * older global mobile rule targets `.bv199-ams-home section` indiscriminately.
 */
const START = "Khởi đầu điều trị";
const REVIEW = "Đánh giá lại sau 48–72 giờ";
const DOSE = "Tối ưu liều";
const PREVENT = "Dự phòng và giám sát";
const modules = [
  { id: "empiric", title: "Phác đồ kinh nghiệm", description: "Theo vị trí nhiễm khuẩn, mức độ nặng, yếu tố nguy cơ.", href: "/antibiotics/empiric", icon: Stethoscope, group: START },
  { id: "select", title: "Chọn theo người bệnh", description: "Lọc phác đồ theo CrCl, dị ứng, tiêu chí nguy cơ.", href: "/antibiotics/empiric/select", icon: UserRound, group: START },
  { id: "allergy", title: "Dị ứng kháng sinh", description: "Phân tầng nguy cơ, phản ứng chéo beta-lactam.", href: "/antibiotics/allergy", icon: Activity, group: START },
  { id: "organism", title: "Theo tác nhân vi sinh", description: "Điều chỉnh theo vi khuẩn, kháng sinh đồ, MIC.", href: "/antibiotics/organism", icon: Microscope, group: REVIEW },
  { id: "deescalation", title: "Xuống thang", description: "Thu hẹp phổ hoặc ngừng kháng sinh.", href: "/antibiotics/deescalation", icon: TrendingDown, group: REVIEW },
  { id: "iv-to-po", title: "Chuyển tĩnh mạch → uống", description: "Tiêu chí chuyển sang đường uống.", href: "/antibiotics/iv-to-po", icon: ArrowLeftRight, group: REVIEW },
  { id: "dosing", title: "Hiệu chỉnh liều", description: "Theo chức năng thận – Dược thư quốc gia 2023.", href: "/hieu-chinh-lieu", icon: SlidersHorizontal, group: DOSE },
  { id: "tdm", title: "Theo dõi nồng độ (TDM)", description: "Vancomycin, aminoglycosid, colistin.", href: "/tdm", icon: FlaskConical, group: DOSE },
  { id: "pkpd", title: "PK/PD kháng sinh", description: "Phiên giải MIC, chỉ số PK/PD, cách dùng.", href: "/pkpd", icon: Gauge, group: DOSE },
  { id: "prophylaxis", title: "Dự phòng phẫu thuật", description: "Lựa chọn, thời điểm dùng và ngừng KSDP.", href: "/antibiotics/prophylaxis", icon: ShieldCheck, group: PREVENT },
  { id: "antibiogram", title: "Antibiogram BV199", description: "Dữ liệu vi sinh và kháng thuốc tại bệnh viện.", href: "/antibiotics/antibiogram", icon: ChartNoAxesColumn, group: PREVENT },
] as const;
const groups = [START, REVIEW, DOSE, PREVENT] as const;

export default function AntibioticsPage() {
  return (
    <main className="bv199-ams-home bv199-ams-v3">
      <div className="bv199-ams-container">
        <header className="bv199-ams-intro">
          <p className="bv199-ams-eyebrow">ANTIMICROBIAL STEWARDSHIP</p>
          <h1>Kháng sinh &amp; AMS</h1>
          <p>Hỗ trợ lựa chọn, tối ưu hóa và giám sát sử dụng kháng sinh.</p>
        </header>
        {groups.map((group) => (
          <div key={group} className="bv199-ams-v3-group">
            <h2 className="bv199-ams-v3-heading"><span className="bv199-ams-v3-step">{groups.indexOf(group) + 1}</span>{group}</h2>
            <div className="bv199-ams-v3-grid">
              {modules.filter(m => m.group === group).map(m => {
                const Icon = m.icon;
                return (
                  <Link key={m.id} href={m.href} className="bv199-ams-v3-card">
                    <span className="bv199-ams-v3-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.9} /></span>
                    <span className="bv199-ams-v3-copy">
                      <strong>{m.title}</strong>
                      <span className="bv199-ams-v3-desc">{m.description}</span>
                    </span>
                    <ChevronRight className="bv199-ams-v3-chevron" size={19} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .bv199-ams-home.bv199-ams-v3 {width:100%;max-width:100%;min-width:0;box-sizing:border-box;background:#f5f9fb;padding:28px 24px 96px;color:#172b3b;}
        .bv199-ams-v3 *, .bv199-ams-v3 *::before, .bv199-ams-v3 *::after {box-sizing:border-box;}
        .bv199-ams-container{width:100%;max-width:1280px;min-width:0;margin:0 auto;}
        .bv199-ams-intro{margin:0 0 26px;}
        .bv199-ams-eyebrow{font-size:12px;font-weight:800;letter-spacing:.16em;color:#00788a;margin:0;}
        .bv199-ams-intro h1{font-size:31px;line-height:1.2;font-weight:800;margin:7px 0 7px;color:#112238;}
        .bv199-ams-intro>p:last-child{font-size:14px;line-height:1.6;color:#60788a;margin:0;}
        .bv199-ams-v3-group{display:block!important;width:100%!important;min-width:0!important;max-width:100%!important;margin:0 0 22px;}
        .bv199-ams-v3-step{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:9px;border-radius:50%;background:#087f8c;color:#fff;font-size:12px;letter-spacing:0;vertical-align:1px;}
        .bv199-ams-v3-heading{font-size:14px;font-weight:800;line-height:1.5;text-transform:uppercase;letter-spacing:.07em;color:#456776;margin:0 0 12px;}
        .bv199-ams-v3-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important;width:100%!important;min-width:0!important;}
        .bv199-ams-v3-card{display:flex!important;align-items:center;gap:12px;min-width:0;width:100%;max-width:100%;min-height:84px;border:1px solid #dbe6ed;border-radius:16px;background:#fff;padding:14px 16px;box-shadow:0 2px 9px rgba(21,53,73,.05);color:#153044;text-decoration:none;transition:box-shadow .15s,border-color .15s;}
        .bv199-ams-v3-card:hover{border-color:#19a5aa;box-shadow:0 4px 15px rgba(20,96,103,.12);}
        .bv199-ams-v3-card:focus-visible{outline:3px solid #087f8c;outline-offset:2px;}
        .bv199-ams-v3-icon{flex:0 0 45px;width:45px;height:45px;border-radius:13px;background:#e9f6f7;display:grid;place-items:center;color:#087f8c;}
        .bv199-ams-v3-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;overflow-wrap: break-word;}
        .bv199-ams-v3-copy strong{display:block;font-size:15px;line-height:1.4;font-weight:750;}
        .bv199-ams-v3-desc{display:block;font-size:12.5px;line-height:1.5;color:#5a7385;}
        .bv199-ams-v3-action{display:block;font-size:12.5px;line-height:1.5;font-weight:750;color:#007e87;margin-top:4px;}
        .bv199-ams-v3-chevron{flex:0 0 auto;color:#8199a6;}
        @media(max-width:1100px) and (min-width:801px){.bv199-ams-v3-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;}}
        @media(max-width:800px){
          .bv199-ams-home.bv199-ams-v3{padding:18px 12px 100px!important;width:100%!important;min-width:0!important;max-width:100%!important;}
          .bv199-ams-v3 .bv199-ams-intro{margin-bottom:20px!important;}
          .bv199-ams-v3 .bv199-ams-intro h1{font-size:25px!important;line-height:1.2!important;}
          .bv199-ams-v3 .bv199-ams-v3-group{display:block!important;width:100%!important;min-width:0!important;margin-bottom:23px!important;}
          .bv199-ams-v3 .bv199-ams-v3-heading{display:block!important;margin:0 0 10px!important;}
          .bv199-ams-v3 .bv199-ams-v3-grid{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:10px!important;width:100%!important;min-width:0!important;}
          .bv199-ams-v3 .bv199-ams-v3-card{display:flex!important;width:100%!important;min-width:0!important;max-width:100%!important;min-height:72px!important;padding:12px!important;}
          .bv199-ams-v3 .bv199-ams-v3-copy strong{font-size:14px!important;}
          .bv199-ams-v3 .bv199-ams-v3-desc,.bv199-ams-v3 .bv199-ams-v3-action{font-size:12px!important;}
        }
      `}</style>
    </main>
  );
}
