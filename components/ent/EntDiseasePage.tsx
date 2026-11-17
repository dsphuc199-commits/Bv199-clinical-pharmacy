/* Trang bệnh – module Nhiễm khuẩn tai mũi họng (trang tĩnh; thẻ nhanh là thành phần client). */
import Link from "next/link";
import type { Statement, StatementKind } from "@/types/ent";
import { SOURCES, SOURCES_VERSION, resolveDisease } from "@/data/ent";
import QuickCard, { Badge } from "./QuickCard";
import { EntStyle } from "./EntStyle";

const KIND_LABEL: Record<StatementKind, string> = {
  recommendation: "Khuyến cáo của hội chuyên môn",
  evidence: "Bằng chứng",
  reference_note: "Ghi chú tham khảo (UCSF) – không phải khuyến cáo hội chuyên môn",
};

function StatementList({ items }: { items: Statement[] }) {
  return (
    <ul className="ent-st">
      {items.map((s) => (
        <li key={s.id}>
          {s.text}
          {(s.strength || s.quality) && <span className="ent-grade"> ({[s.strength, s.quality].filter(Boolean).join("; ")})</span>}
          {s.status !== "EXTRACTED" && <span className="ent-nv">Nguồn không nêu/chưa xác minh</span>}
          {" "}<Badge c={s.citation} sources={SOURCES} />
        </li>
      ))}
    </ul>
  );
}

export default function EntDiseasePage({ id }: { id: string }) {
  const r = resolveDisease(id);
  if (!r) return null;
  const { page, data } = r;
  const srcIds = [...new Set([...data.primarySources, ...(data.diagnosisSources ?? []), ...data.comparisonSources, ...data.referenceSources])];
  const roleOf = (sid: string) => (data.primarySources.includes(sid) ? "Nguồn chính" : data.diagnosisSources?.includes(sid) ? "Chẩn đoán" : data.comparisonSources.includes(sid) ? "Đối chiếu" : "Tham khảo");
  const kinds: StatementKind[] = ["recommendation", "evidence", "reference_note"];
  return (
    <main className="ent-page">
      <nav className="ent-nav"><Link href="/ent">Nhiễm khuẩn tai mũi họng</Link></nav>
      <h1>{page.title} <span className="ent-en">({page.titleEn})</span></h1>
      <p className="ent-muted">{page.population}</p>
      {page.scopeNote && <p className="ent-scope">{page.scopeNote}</p>}
      {page.crossRef && <p className="ent-scope">Dữ liệu dùng chung với trang <Link href={`/ent/${page.crossRef}`}>{data.title}</Link>.</p>}
      <QuickCard disease={data} sources={SOURCES} />
      {kinds.map((k) => {
        const items = data.statements.filter((s) => s.kind === k);
        return items.length ? (<section key={k} className="ent-sec"><h2>{KIND_LABEL[k]}</h2><StatementList items={items} /></section>) : null;
      })}
      <section className="ent-sec">
        <h2>Nguồn</h2>
        <ul className="ent-src">
          {srcIds.map((sid) => {
            const s = SOURCES.find((x) => x.id === sid)!;
            return (
              <li key={sid}>
                <b>{roleOf(sid)}</b> · {s.org} ({s.year}). {s.title}. <span className={`ent-badge ent-tier-${s.tier}`}>{s.tier === "REF" ? "REF" : `Tier ${s.tier}`} – {s.tierLabel}</span>
                <div className="ent-muted">{s.population}. {s.scope}. Truy cập: {s.accessNote} {s.doi ? `DOI ${s.doi}. ` : ""}<a href={s.url}>{s.url}</a></div>
              </li>
            );
          })}
        </ul>
      </section>
      <footer className="ent-foot">
        <p className="ent-warn">Công cụ thử nghiệm, chưa thẩm định lâm sàng – cần dược sĩ/bác sĩ xác nhận.</p>
        <p>Chưa đối chiếu hướng dẫn Bộ Y tế/antibiogram bệnh viện.</p>
        <p className="ent-muted">Phiên bản dữ liệu: {data.dataVersion} · danh mục nguồn {SOURCES_VERSION} · ngày kiểm tra nguồn: {data.sourcesCheckedOn}</p>
      </footer>
      <EntStyle />
    </main>
  );
}
