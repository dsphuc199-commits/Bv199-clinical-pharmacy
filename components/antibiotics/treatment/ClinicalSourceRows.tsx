import type { Citation } from "@/lib/antibiotics/source-citation";

export default function ClinicalSourceRows({ sources }: { sources: readonly Citation[] }) {
  if (!sources.length) return null;

  return (
    <table className="clinical-source-rows" aria-label="Tài liệu đối chiếu">
      <thead>
        <tr><th scope="col">Tài liệu</th><th scope="col">Năm</th></tr>
      </thead>
      <tbody>
        {sources.map((source) => {
          const title = source.title ?? source.label;
          return (
            <tr key={source.key}>
              <td>
                {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{title}</a> : title}
                {source.detail && <span>{source.detail}</span>}
              </td>
              <td>{source.year ?? <span aria-label="Chưa xác định năm">—</span>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
