import Link from "next/link";
import { ArrowRight, ChevronRight, ClipboardList, Info, Pill } from "lucide-react";

const tools = [
  {
    id: "renal",
    title: "Chức năng thận & Hiệu chỉnh liều",
    summary: "Ước tính chức năng thận và tra cứu hiệu chỉnh liều theo thông tin người bệnh.",
    detail: "CrCl · eGFR",
    href: "/calculators/renal",
    icon: Pill,
  },
  {
    id: "scores",
    title: "Thang điểm lâm sàng",
    summary:
      "GCS, Karnofsky, qSOFA, RIFLE, KDIGO, Child–Pugh, CHA₂DS₂-VA, HAS-BLED, Padua, DRIP, Ramsay, RASS và Candida Score.",
    detail: "13 công cụ",
    href: "/calculators/clinical-scores",
    icon: ClipboardList,
  },
] as const;

export default function CalculatorsPage() {
  return (
    <main className="bvtools">
      <div className="bvtools-wrap">
        <nav className="bvtools-breadcrumb" aria-label="Đường dẫn">
          <Link href="/">Trang chủ</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">Công cụ lâm sàng</span>
        </nav>

        <header className="bvtools-heading">
          <h1>Công cụ lâm sàng</h1>
        </header>

        <div className="bvtools-grid">
          {tools.map(({ id, title, summary, detail, href, icon: Icon }) => (
            <Link
              href={href}
              key={id}
              className={`bvtools-card bvtools-card--${id}`}
              aria-labelledby={`bvtools-${id}-title`}
            >
              <div className="bvtools-card-top">
                <span className="bvtools-icon" aria-hidden="true"><Icon size={25} /></span>
                <span className="bvtools-detail">{detail}</span>
              </div>
              <h2 id={`bvtools-${id}-title`}>{title}</h2>
              <p>{summary}</p>
              <span className="bvtools-open" aria-hidden="true">
                Mở công cụ <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>

        <p className="bvtools-note">
          <Info size={16} aria-hidden="true" />
          <span>Các công cụ hỗ trợ đánh giá chuyên môn, không thay thế quyết định điều trị và quy trình đã được bệnh viện phê duyệt.</span>
        </p>
      </div>

      <style>{`
        .bv199-page-content:has(> .bvtools) { flex-grow: 0 !important; }
        .bv199-page-content:has(> .bvtools) + .bv199-footer-region footer {
          border-bottom: 1px solid var(--border);
        }
        .bv199-page-content:has(> .bvtools) + .bv199-footer-region footer > div {
          max-width: 1168px;
          margin-inline: auto;
        }

        .bvtools {
          padding: 20px 24px 14px;
          background: var(--background);
          color: var(--text);
        }
        .bvtools-wrap { max-width: 1120px; margin-inline: auto; }
        .bvtools-breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
          color: var(--text-secondary);
          font-size: 12px;
        }
        .bvtools-breadcrumb a { color: var(--primary-dark); }
        .bvtools-breadcrumb a:hover { text-decoration: underline; }

        .bvtools-heading {
          margin-bottom: 16px;
          padding: clamp(20px, 3vw, 30px);
          border-radius: var(--radius-lg);
          background: linear-gradient(108deg, #12334f, #0a626a);
          color: #fff;
        }
        .bvtools-heading h1 {
          margin: 0;
          font-size: clamp(25px, 3.1vw, 35px);
          font-weight: 800;
          line-height: 1.2;
        }

        .bvtools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 310px), 1fr));
          gap: 14px;
        }
        .bvtools-card--renal {
          --tool-ink: #115948;
          --tool-accent: #08705a;
          --tool-border: #b8dacf;
          --tool-soft: #e2f3ec;
          --tool-base: #f4faf7;
        }
        .bvtools-card--scores {
          --tool-ink: #353a79;
          --tool-accent: #464a9d;
          --tool-border: #cdd2ed;
          --tool-soft: #e8ebfd;
          --tool-base: #f7f7fe;
        }
        .bvtools-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding: 20px;
          border: 1px solid var(--tool-border);
          border-radius: var(--radius-lg);
          background: linear-gradient(160deg, var(--tool-soft), var(--tool-base) 72%);
          color: var(--tool-ink);
          text-decoration: none;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 160ms ease, border-color 160ms ease;
        }
        .bvtools-card:hover {
          border-color: var(--tool-accent);
          box-shadow: var(--shadow-md);
        }
        .bvtools-card:focus-visible, .bvtools-breadcrumb a:focus-visible {
          outline: 2px solid var(--primary-dark);
          outline-offset: 3px;
        }
        .bvtools-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .bvtools-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--tool-accent);
          color: #fff;
        }
        .bvtools-detail {
          padding: 4px 9px;
          border: 1px solid var(--tool-border);
          border-radius: 999px;
          background: var(--tool-base);
          color: var(--tool-ink);
          font-size: 12px;
          font-weight: 700;
        }
        .bvtools-card h2 {
          margin: 14px 0 6px;
          color: var(--tool-ink);
          font-size: clamp(18px, 2vw, 23px);
          line-height: 1.3;
          font-weight: 800;
        }
        .bvtools-card p {
          margin: 0 0 16px;
          color: var(--text-secondary);
          line-height: 1.6;
          overflow-wrap: anywhere;
        }
        .bvtools-open {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          margin-top: auto;
          padding: 7px 10px;
          border: 1px solid var(--tool-border);
          border-radius: var(--radius-sm);
          background: var(--surface);
          color: var(--tool-ink);
          font-size: 13px;
          font-weight: 700;
        }
        .bvtools-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 14px 0 0;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface);
          color: var(--text-secondary);
          font-size: 12px;
          line-height: 1.5;
        }
        .bvtools-note svg { flex: none; color: var(--primary-dark); }

        @media (max-width: 600px) {
          .bvtools { padding: 14px 12px 12px; }
          .bvtools-heading { margin-bottom: 12px; }
          .bvtools-grid { gap: 10px; }
          .bvtools-card { padding: 15px; }
          .bvtools-icon { width: 42px; height: 42px; }
          .bvtools-card h2 { margin-top: 10px; }
          .bvtools-card p { margin-bottom: 13px; font-size: 13px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bvtools-card { transition: none; }
        }
      `}</style>
    </main>
  );
}
