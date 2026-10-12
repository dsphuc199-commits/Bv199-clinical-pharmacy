
import Link from "next/link";

const tools = [
  {
    title: "Chức năng thận & Hiệu chỉnh liều",
    short: "CT",
    description:
      "Đánh giá chức năng thận và hỗ trợ hiệu chỉnh liều thuốc theo thông tin người bệnh.",
    href: "/calculators/renal",
  },
  {
    title: "Thang điểm lâm sàng",
    short: "TĐ",
    description:
      "13 công cụ: GCS, Karnofsky, qSOFA, RIFLE, KDIGO, Child–Pugh, CHA₂DS₂-VA, HAS-BLED, Padua, DRIP, Ramsay, RASS và Candida Score.",
    href: "/calculators/clinical-scores",
  },
];

export default function CalculatorsPage() {
  return (
    <main className="bvtools">
      <div className="bvtools-wrap">
        <div className="bvtools-top">
          <Link href="/">Trang chủ</Link>
          <span> / Công cụ lâm sàng</span>
        </div>

        <div className="bvtools-heading">
          <span className="bvtools-eyebrow">
            KHOA DƯỢC · BỆNH VIỆN 199
          </span>
          <h1>Công cụ lâm sàng</h1>
          <p>
            Các công cụ tính toán và đánh giá
            hỗ trợ bác sĩ, dược sĩ trong thực hành
            lâm sàng.
          </p>
        </div>

        <div className="bvtools-grid">
          {tools.map((tool) => (
            <Link
              href={tool.href}
              key={tool.href}
              className="bvtools-card"
            >
              <span className="bvtools-icon">
                {tool.short}
              </span>
              <h2>{tool.title}</h2>
              <p>{tool.description}</p>
              <span className="bvtools-open">
                Mở công cụ →
              </span>
            </Link>
          ))}
        </div>

        <p className="bvtools-note">
          Các công cụ hỗ trợ đánh giá chuyên môn;
          không thay thế quyết định điều trị và
          quy trình đã được bệnh viện phê duyệt.
        </p>
      </div>

      <style>{`
        .bvtools {
          min-height: 100vh;
          background: #f6f9fc;
          padding: 28px;
          color: #142c45;
          font-family: Arial, sans-serif;
        }

        .bvtools-wrap {
          max-width: 1150px;
          margin: auto;
        }

        .bvtools-top {
          font-size: 12px;
          color: #70859d;
        }

        .bvtools-top a {
          color: #075985;
          text-decoration: none;
        }

        .bvtools-heading {
          margin: 30px 0;
        }

        .bvtools-eyebrow {
          color: #087b89;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .bvtools-heading h1 {
          margin: 10px 0;
          font-size: 28px;
          color: #102c48;
        }

        .bvtools-heading p {
          color: #6b8096;
          line-height: 1.7;
          font-size: 14px;
        }

        .bvtools-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit,minmax(260px,1fr));
          gap: 16px;
        }

        .bvtools-card {
          display: flex;
          flex-direction: column;
          padding: 24px;
          min-height: 230px;
          background: white;
          border: 1px solid #dce6ef;
          border-radius: 14px;
          text-decoration: none;
          color: #17324d;
          transition: border-color 0.15s;
        }

        .bvtools-card:hover {
          border-color: #0875ae;
        }

        .bvtools-icon {
          display: grid;
          place-items: center;
          width: 45px;
          height: 45px;
          background: #e6f4ff;
          border-radius: 10px;
          color: #075985;
          font-weight: 800;
          font-size: 13px;
        }

        .bvtools-card h2 {
          font-size: 18px;
          line-height: 1.4;
          margin: 19px 0 8px;
        }

        .bvtools-card p {
          font-size: 13px;
          line-height: 1.7;
          color: #678098;
          flex: 1;
        }

        .bvtools-open {
          font-size: 13px;
          color: #075985;
          font-weight: bold;
          margin-top: 12px;
        }

        .bvtools-note {
          margin-top: 23px;
          font-size: 12px;
          color: #778ba0;
          line-height: 1.7;
        }

        @media(max-width:720px) {
          .bvtools { padding: 16px; }
          .bvtools-heading h1 { font-size: 23px; }
        }
      `}</style>
    </main>
  );
}
