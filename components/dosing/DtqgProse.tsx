import type { DtqgBlock } from "@/lib/dosing/catalog";

/* Hien thi nguyen van Duoc thu da cau truc: doan (giu dam/nghieng), tieu de rieng, bang (o gop). */
export default function DtqgProse({ blocks }: { blocks: DtqgBlock[] }) {
  return (
    <div className="dtp">
      {blocks.map((b, i) => {
        if (b.t === "p") {
          return (
            <p key={i} className={b.head ? "dtp-h" : undefined}>
              {b.runs.map((r, k) => {
                const el = r.b && r.i ? <strong><em>{r.text}</em></strong> : r.b ? <strong>{r.text}</strong> : r.i ? <em>{r.text}</em> : r.text;
                return <span key={k}>{el}</span>;
              })}
            </p>
          );
        }
        if (b.t === "img") {
          // eslint-disable-next-line @next/next/no-img-element
          return <figure key={i} className="dtp-fig"><img src={b.src} alt={b.alt} width={b.w} height={b.h} loading="lazy" /></figure>;
        }
        const head = b.rows.length > 1 && b.rows[0].every((c) => c.b);
        return (
          <div key={i} className="dtp-table">
            <table>
              {head && <thead><tr>{b.rows[0].map((c, k) => <th key={k} rowSpan={c.rs} colSpan={c.cs}>{c.text}</th>)}</tr></thead>}
              <tbody>
                {(head ? b.rows.slice(1) : b.rows).map((row, r) => (
                  <tr key={r}>
                    {row.map((c, k) => (
                      <td key={k} rowSpan={c.rs} colSpan={c.cs} className={c.b ? "b" : undefined}>
                        {c.text.split("\n").map((line, li) => <span key={li} className="ln">{line}</span>)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      <style>{`
        .dtp { display: grid; gap: 10px; }
        .dtp p { margin: 0; font-size: 15px; line-height: 1.7; color: #24384c; }
        .dtp strong { color: #0f2236; }
        .dtp em { color: #0b3a5b; }
        .dtp .dtp-h { margin-top: 6px; padding-left: 10px; border-left: 3px solid #087f89; font-size: 15.5px; font-weight: 700; color: #0b3a5b; }
        .dtp .dtp-h:first-child { margin-top: 0; }
        .dtp-fig { margin: 0; } .dtp-fig img { max-width: 100%; height: auto; }
        .dtp-table { overflow-x: auto; border: 1px solid #dfe8ee; border-radius: 10px; }
        .dtp-table table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .dtp-table th, .dtp-table td { border: 1px solid #e3eaf0; padding: 7px 9px; vertical-align: top; text-align: left; line-height: 1.5; }
        .dtp-table th { background: #f1f6f9; font-weight: 700; color: #10243e; }
        .dtp-table td.b { font-weight: 700; }
        .dtp-table .ln { display: block; }
      `}</style>
    </div>
  );
}
