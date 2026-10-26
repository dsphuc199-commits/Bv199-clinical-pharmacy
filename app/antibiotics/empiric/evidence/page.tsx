"use client";

/*
  FILE: app/antibiotics/empiric/evidence/page.tsx
  BAO CAO TONG HOP BANG CHUNG (Nhiem vu 4C): trang thai tung mat benh, van ban BYT moi
  nhat / cu con ap dung / da bi thay the, ket qua doi chieu lieu voi ban chinh thuc,
  huong dan quoc te. Du lieu tinh tu lib/antibiotics/evidence-status.ts.
*/

import Link from "next/link";
import { useMemo, useState } from "react";

import BackBar from "@/components/antibiotics/links/BackBar";
import { ApprovalBadge, EvidenceBadge } from "@/components/antibiotics/empiric/EvidencePanel";
import { DOC_CHECK_TEXT, DOC_EVIDENCE } from "@/data/antibiotics/empiric/evidence";
import { DOCS, type DocId } from "@/data/antibiotics/empiric/regimens";
import {
  STATUS_TEXT,
  VERIFICATION_META,
  evaluateAll,
  summarize,
  type EvidenceStatus,
} from "@/lib/antibiotics/evidence-status";
import { empiricHref } from "@/lib/antibiotics/drug-links";

type Filter = "ALL" | Exclude<EvidenceStatus, "SUPERSEDED"> | "HAS_SUPERSEDED";

const normalize = (s: string) =>
  s.toLocaleLowerCase("vi").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

export default function EvidenceReportPage() {
  const all = evaluateAll();
  const sum = summarize();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [specialty, setSpecialty] = useState("Tất cả");
  const [q, setQ] = useState("");

  const specialties = useMemo(
    () => ["Tất cả", ...Array.from(new Set(all.map((e) => e.disease.specialty))).sort((a, b) => a.localeCompare(b, "vi"))],
    [all]
  );

  const rows = all.filter((e) => {
    if (filter === "HAS_SUPERSEDED" ? e.superseded.length === 0 : filter !== "ALL" && e.status !== filter) return false;
    if (specialty !== "Tất cả" && e.disease.specialty !== specialty) return false;
    if (q.trim() && !normalize(`${e.disease.title} ${e.disease.specialty}`).includes(normalize(q.trim()))) return false;
    return true;
  });

  const usedDocs = Array.from(new Set(all.flatMap((e) => e.docs.map((d) => d.doc)))) as DocId[];

  const chips: { key: Filter; label: string; n: number }[] = [
    { key: "ALL", label: "Tất cả", n: sum.total },
    { key: "VERIFIED_SOURCE", label: "VERIFIED_SOURCE", n: sum.VERIFIED_SOURCE },
    { key: "NEEDS_REVIEW", label: "NEEDS_REVIEW", n: sum.NEEDS_REVIEW },
    { key: "MISSING_EVIDENCE", label: "MISSING_EVIDENCE", n: sum.MISSING_EVIDENCE },
    { key: "HAS_SUPERSEDED", label: "Có nội dung SUPERSEDED", n: sum.diseasesWithSuperseded },
  ];

  return (
    <main className="mx-auto w-full max-w-[1500px] p-3 md:p-5">
      <BackBar
        fallbackHref="/antibiotics/empiric/guideline-v9"
        fallbackLabel="Phác đồ kinh nghiệm"
        links={[{ href: "/antibiotics/empiric/select", label: "Chọn kháng sinh theo người bệnh" }]}
      />
      <header className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Khoa Dược · Bệnh viện 199</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Báo cáo bằng chứng – kháng sinh kinh nghiệm</h1>
        <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
          Trạng thái nguồn của toàn bộ {sum.total} mặt bệnh. VERIFIED_SOURCE nghĩa là nguồn đã được xác minh, không thay
          thế phê duyệt của Hội đồng Thuốc và Điều trị BV199. Phác đồ chưa có quyết định APPROVED_FOR_CLINICAL_USE
          không được tự động áp dụng.
        </p>
      </header>

      <section className="ev-cards">
        <div><strong>{sum.total}</strong><span>Tổng mặt bệnh</span></div>
        <div className="v"><strong>{sum.VERIFIED_SOURCE}</strong><span>VERIFIED_SOURCE</span></div>
        <div className="r"><strong>{sum.NEEDS_REVIEW}</strong><span>NEEDS_REVIEW</span></div>
        <div className="m"><strong>{sum.MISSING_EVIDENCE}</strong><span>MISSING_EVIDENCE</span></div>
        <div className="a"><strong>{sum.APPROVED_FOR_CLINICAL_USE}</strong><span>APPROVED_FOR_CLINICAL_USE (HĐT&ĐT)</span></div>
        <div className="s"><strong>{sum.supersededItems}</strong><span>Phương án SUPERSEDED ({sum.diseasesWithSuperseded} bệnh)</span></div>
      </section>

      <section className="ev-panel">
        <div className="ev-filters">
          <div className="ev-chips" role="group" aria-label="Lọc trạng thái">
            {chips.map((c) => (
              <button key={c.key} type="button" aria-pressed={filter === c.key} className={filter === c.key ? "active" : ""} onClick={() => setFilter(c.key)}>
                {c.label} <span>{c.n}</span>
              </button>
            ))}
          </div>
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} aria-label="Chuyên khoa">
            {specialties.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input type="search" placeholder="Tìm mặt bệnh…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm mặt bệnh" />
        </div>
        <p className="ev-muted">{rows.length} / {sum.total} mặt bệnh</p>

        <div className="ev-table-wrap">
          <table className="ev-table">
            <thead>
              <tr>
                <th>Mặt bệnh</th>
                <th>Trạng thái</th>
                <th>Văn bản BYT áp dụng</th>
                <th>Đối chiếu liều</th>
                <th>Quốc tế</th>
                <th>Lý do / ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.disease.id}>
                  <td>
                    <Link href={`${empiricHref(e.disease.id)}&tab=sources`}>{e.disease.title}</Link>
                    <span className="ev-sub">{e.disease.specialty}</span>
                  </td>
                  <td><EvidenceBadge status={e.status} /><span className="ev-sub"><ApprovalBadge status={e.approval.status} /></span></td>
                  <td>
                    {e.docs.filter((d) => d.role !== "superseded").map((d) => (
                      <span key={d.doc} className="ev-doc">
                        QĐ {d.number}{d.role === "latest" ? "" : " (cũ, còn áp dụng)"}
                      </span>
                    ))}
                    {e.superseded.length > 0 && (
                      <span className="ev-sub">SUPERSEDED: {e.superseded.length} phương án ({Array.from(new Set(e.superseded.map((s) => `QĐ ${DOCS[s.doc].number}`))).join(", ")})</span>
                    )}
                  </td>
                  <td>
                    {e.verification.match}/{e.verification.regimens} khớp
                    {e.module ? <span className="ev-sub">Module: {e.module.match}/{e.module.total}</span> : null}
                  </td>
                  <td>{e.intl.status === "none" ? "—" : e.intl.guidelines.join(", ")}</td>
                  <td className="ev-reasons">{[...e.reasons, ...e.notes].join(" ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ev-panel">
        <h2>Văn bản và mức xác minh</h2>
        <ul className="ev-list">
          {usedDocs
            .sort((a, b) => DOCS[a].number.localeCompare(DOCS[b].number, "vi", { numeric: true }))
            .map((d) => (
              <li key={d}>
                <strong>QĐ {DOCS[d].number}</strong> ({DOCS[d].date}) – {DOCS[d].title}
                <span className="ev-sub">
                  {DOC_CHECK_TEXT[DOC_EVIDENCE[d].check]} · {DOC_EVIDENCE[d].where}
                  {DOC_EVIDENCE[d].url && (
                    <>
                      {" · "}
                      <a href={DOC_EVIDENCE[d].url} target="_blank" rel="noopener noreferrer">Mở nguồn</a>
                    </>
                  )}
                </span>
              </li>
            ))}
        </ul>
        <h2>Phương pháp đối chiếu liều</h2>
        <p className="ev-muted">
          {VERIFICATION_META.method} Kết quả ({VERIFICATION_META.generatedOn}):{" "}
          {Object.entries(VERIFICATION_META.summary).map(([k, n]) => `${k}: ${n}`).join(" · ")}. Chạy lại bằng{" "}
          <code>node scripts/verify-official-doses.mjs --text-dir … --write</code>.
        </p>
        <p className="ev-muted">Trạng thái: {Object.entries(STATUS_TEXT).map(([k, t]) => `${k} – ${t}`).join("; ")}.</p>
      </section>

      <style>{`
        .ev-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 14px; }
        .ev-cards div { background: #fff; border: 1px solid #dbe6ed; border-radius: 12px; padding: 12px 14px; display: grid; }
        .ev-cards strong { font-size: 26px; color: #17364b; }
        .ev-cards span { font-size: 12px; color: #4b6576; }
        .ev-cards .v strong { color: #166534; } .ev-cards .r strong { color: #92400e; } .ev-cards .m strong { color: #991b1b; } .ev-cards .s strong { color: #374151; } .ev-cards .a strong { color: #1e40af; }
        .ev-panel { background: #fff; border: 1px solid #dbe6ed; border-radius: 12px; padding: 14px; margin-bottom: 14px; }
        .ev-panel h2 { font-size: 16px; margin: 4px 0 8px; }
        .ev-filters { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .ev-chips { display: flex; flex-wrap: wrap; gap: 4px; }
        .ev-chips button { min-height: 36px; padding: 6px 10px; border: 1px solid #cfdde6; border-radius: 99px; background: #fff; font-size: 12px; cursor: pointer; color: #17364b; }
        .ev-chips button.active { background: #087f89; border-color: #087f89; color: #fff; font-weight: 700; }
        .ev-chips span { opacity: .8; margin-left: 4px; }
        .ev-filters select, .ev-filters input { min-height: 38px; padding: 6px 10px; border: 1px solid #cfdde6; border-radius: 9px; font-size: 13px; }
        .ev-filters input { flex: 1 1 200px; }
        .ev-muted { font-size: 12px; color: #647b8c; line-height: 1.6; }
        .ev-table-wrap { overflow-x: auto; }
        .ev-table { width: 100%; min-width: 900px; border-collapse: collapse; font-size: 12px; }
        .ev-table th, .ev-table td { border-bottom: 1px solid #e2eaf0; padding: 8px; text-align: left; vertical-align: top; }
        .ev-table th { background: #f5f9fb; color: #4b6576; font-size: 11px; position: sticky; top: 0; }
        .ev-table a { color: #076c75; font-weight: 700; }
        .ev-sub { display: block; font-size: 11px; color: #647b8c; }
        .ev-doc { display: block; }
        .ev-reasons { max-width: 420px; color: #33505f; }
        .ev-list { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.7; }
      `}</style>
    </main>
  );
}
