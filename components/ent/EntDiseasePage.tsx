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

/** Nội dung một bệnh (dùng cho trang /ent/<id> và tab Quốc tế của Phác đồ kinh nghiệm). */
export function EntDiseaseBody({ id, embedded = false }: { id: string; embedded?: boolean }) {
  const r = resolveDisease(id);
  if (!r) return null;
  const { page, data } = r;
  const srcIds = [...new Set([...data.primarySources, ...(data.diagnosisSources ?? []), ...data.comparisonSources, ...data.referenceSources])];
  const roleOf = (sid: string) => (data.primarySources.includes(sid) ? "Nguồn chính" : data.diagnosisSources?.includes(sid) ? "Chẩn đoán" : data.comparisonSources.includes(sid) ? "Đối chiếu" : "Tham khảo");
  const kinds: StatementKind[] = ["recommendation", "evidence", "reference_note"];
  const Title = embedded ? "h3" : "h1";
  return (
    <>
      <Title className="ent-title">{page.title} <span className="ent-en">({page.titleEn})</span></Title>
      <p className="ent-muted">{page.population}{embedded && <> · <Link href={`/ent/${page.id}`}>Mở trang đầy đủ</Link></>}</p>
      {page.scopeNote && <p className="ent-scope">{page.scopeNote}</p>}
      {page.crossRef && !embedded && <p className="ent-scope">Dữ liệu dùng chung với trang <Link href={`/ent/${page.crossRef}`}>{data.title}</Link>.</p>}
      <QuickCard key={data.id} disease={data} sources={SOURCES} />
      {kinds.map((k) => {
        if (embedded && k === "reference_note" && data.primarySources.length === 0) return null; // da co trong the
        const items = data.statements.filter((s) => s.kind === k && (!embedded || s.status === "EXTRACTED"));
        return items.length ? (
          <details key={k} className="ent-sec" open={!embedded}>
            <summary><h2>{KIND_LABEL[k]} ({items.length})</h2></summary>
            <StatementList items={items} />
          </details>
        ) : null;
      })}
      <details className="ent-sec" open={!embedded}>
        <summary><h2>Nguồn ({srcIds.length})</h2></summary>
        <ul className="ent-src">
          {srcIds.map((sid) => {
            const s = SOURCES.find((x) => x.id === sid)!;
            return (
              <li key={sid}>
                <b>{roleOf(sid)}</b> · {s.org} ({s.year}). {s.title}. <span className={`ent-badge ent-tier-${s.tier}`}>{s.tier === "REF" ? "REF" : s.tier === "LABEL" ? "Nhãn FDA" : `Tier ${s.tier}`} – {s.tierLabel}</span>
                <div className="ent-muted">{s.population}. {s.scope}.{!embedded && ` Truy cập: ${s.accessNote}`} {s.doi ? `DOI ${s.doi}. ` : ""}{s.url.startsWith("http") && <a href={s.url}>{s.url}</a>}</div>
              </li>
            );
          })}
        </ul>
      </details>
      <footer className="ent-foot">
        <p className="ent-warn">Công cụ thử nghiệm, chưa thẩm định lâm sàng – cần dược sĩ/bác sĩ xác nhận.</p>
        <p>Chưa đối chiếu hướng dẫn Bộ Y tế/antibiogram bệnh viện.</p>
        <p className="ent-muted">Phiên bản dữ liệu: {data.dataVersion} · danh mục nguồn {SOURCES_VERSION} · ngày kiểm tra nguồn: {data.sourcesCheckedOn}</p>
      </footer>
      <EntStyle />
    </>
  );
}

export default function EntDiseasePage({ id }: { id: string }) {
  if (!resolveDisease(id)) return null;
  return (
    <main className="ent-page">
      <nav className="ent-nav"><Link href="/ent">Nhiễm khuẩn tai mũi họng</Link></nav>
      <EntDiseaseBody id={id} />
    </main>
  );
}
