import type { Citation } from "@/lib/antibiotics/source-citation";

export default function ClinicalSourceRows({ sources }: { sources: readonly Citation[] }) {
  if (!sources.length) return null;

  const undated = Number.MAX_SAFE_INTEGER;
  const ordered = [...sources].sort((a, b) => (a.year ?? undated) - (b.year ?? undated));

  return (
    <table className="clinical-source-rows" aria-label="Tài liệu đối chiếu">
      <thead>
        <tr><th scope="col">STT</th><th scope="col">Tài liệu</th><th scope="col">Năm</th></tr>
      </thead>
      <tbody>
        {ordered.map((source, index) => {
          const title = source.title ?? source.label;
          return (
            <tr key={source.key}>
              <td>{index + 1}.</td>
              <td>
                {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{title}</a> : title}
                {source.detail && <span className="clinical-source-meta">{source.detail}</span>}
                {source.note && <span className="clinical-source-meta">{source.note}</span>}
              </td>
              <td>{source.year ?? <span aria-label="Chưa xác định năm">—</span>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export type InternationalSourceUseProps = { setting?: string; localReferences?: string };

export function InternationalSourceUse({ setting, localReferences }: InternationalSourceUseProps) {
  const context = setting
    ? `Tài liệu tham khảo cho thực hành tại ${setting}.`
    : "Hướng dẫn quốc tế dùng để tham khảo.";
  return (
    <div className="clinical-source-application" role="note">
      <strong>Áp dụng tại BV199</strong>
      <span>{context} Khi điều trị, thực hiện theo phác đồ đã được bệnh viện phê duyệt{localReferences ? ` và đối chiếu ${localReferences}` : ""}.</span>
    </div>
  );
}
