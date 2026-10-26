/*
  FILE: components/antibiotics/treatment/DoseTable.tsx

  MASTER TASK 6 – BANG LIEU DUNG CHUNG (69 mat benh, bo chon, khuyen cao quoc te, module CAP/HAP).

  Hien thi du lieu co cau truc tu lib/antibiotics/regimen-structure.ts:
    - Moi nhom thuoc la mot bang: Thuoc | Lieu/lan | Duong dung | Khoang cach | Thoi gian.
    - Giua cac nhom: "+ PHOI HOP" (bat buoc) hoac "± THEM NEU CO CHI DINH" (tuy chon).
    - Nhom "chon 1": ghi ro "Chon 1 trong N". Nhom co dinh nhieu thuoc (vd. lao HRZE): "Dung dong thoi".
    - O trong (—) = nguon khong neu; KHONG tu dien.
    - NEEDS_STRUCTURED_REVIEW / NO_DOSE: hien NGUYEN VAN, khong ve bang lieu.
  Mobile (< 640 px): moi hang thanh the thuoc, khong cuon ngang.
*/

import {
  STRUCTURE_STATUS_TEXT,
  optionsFor,
  type DrugGroup,
  type StructureStatus,
  type StructuredDrug,
} from "@/lib/antibiotics/regimen-structure";

type Props = {
  groups: DrugGroup[];
  status: StructureStatus;
  /* Thoi gian dieu tri cua ca phac do (hien mot lan duoi bang). */
  duration?: string;
  /* Doi tuong dang xem: loc hang lieu nguoi lon / tre em. */
  population?: "adult" | "child";
  /* Cac dong la lua chon doc lap (khuyen cao quoc te): khong noi bang "+ phoi hop". */
  independent?: boolean;
};

const DASH = "—";

function doseText(o: StructuredDrug): string {
  if (!o.dose) return DASH;
  return `${o.dose} ${o.doseUnit ?? ""}`.trim();
}

function ruleText(g: DrugGroup, n: number): string | undefined {
  if (g.rule === "one-of") return `Chọn 1 trong ${n}`;
  if (g.rule === "by-population") return "Liều theo đối tượng";
  if (n > 1) return "Dùng đồng thời";
  return undefined;
}

function Row({ o, showCourse }: { o: StructuredDrug; showCourse: boolean }) {
  const critical = o.flags.filter((f) => f.startsWith("KIỂM TRA"));
  return (
    <tr className={critical.length ? "tx-row tx-row-warn" : "tx-row"}>
      <td data-label="Thuốc" className="tx-drug">
        <strong>{o.name}</strong>
        {o.populationLabel && <span className="tx-pop">{o.populationLabel}</span>}
        {o.context && <span className="tx-ctx">{o.context}</span>}
        {critical.map((f) => (
          <span key={f} className="tx-crit" role="alert">{f}</span>
        ))}
      </td>
      <td data-label="Liều/lần">
        <div>
          {doseText(o)}
          {o.dailyDose && <span className="tx-sub">= {o.dailyDose}</span>}
          {o.maxDose && <span className="tx-sub">{o.maxDose}</span>}
        </div>
      </td>
      <td data-label="Đường dùng">
        <div>
          {o.route ?? DASH}
          {o.infusionDuration && <span className="tx-sub">{o.infusionDuration}</span>}
        </div>
      </td>
      <td data-label="Khoảng cách"><div>{o.interval ?? DASH}</div></td>
      {showCourse && <td data-label="Thời gian"><div>{o.course ?? DASH}</div></td>}
    </tr>
  );
}

export default function DoseTable({ groups, status, duration, population, independent }: Props) {
  if (status === "NEEDS_STRUCTURED_REVIEW" || status === "NO_DOSE") {
    return (
      <div className="tx">
        <span className={`tx-status tx-status-${status}`}>{STRUCTURE_STATUS_TEXT[status]}</span>
        <ul className="tx-raw">
          {groups.flatMap((g) => g.raw).map((r, i) => (
            <li key={`${r.name}-${i}`}>
              <strong>{r.name}</strong>
              <span>{r.dose}</span>
            </li>
          ))}
        </ul>
        {duration && <p className="tx-dur"><span>Thời gian</span> {duration}</p>}
        <TxStyle />
      </div>
    );
  }

  const notes = groups.flatMap((g) => g.options.flatMap((o) => o.flags.filter((f) => !f.startsWith("KIỂM TRA")).map((f) => `${o.name}: ${f}`)));
  return (
    <div className="tx">
      {groups.map((g, i) => {
        const opts = optionsFor(g, population);
        const showCourse = opts.some((o) => !!o.course);
        const rule = ruleText(g, opts.length);
        return (
          <div key={i} className="tx-group">
            {i > 0 && !independent && (
              <div className={g.optional ? "tx-join tx-join-opt" : g.phase ? "tx-join tx-join-seq" : "tx-join"}>
                {g.phase ? "→ Sau đó" : g.optional ? "± Thêm nếu có chỉ định" : "+ Phối hợp"}
                {g.condition ? ` – ${g.condition}` : ""}
              </div>
            )}
            {(g.label || rule) && (
              <div className="tx-ghead">
                {g.label && g.label !== "Phối hợp" && <strong>{g.label}</strong>}
                {rule && <span className="tx-rule">{rule}</span>}
                {i === 0 && g.condition && <span className="tx-cond">{g.condition}</span>}
              </div>
            )}
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Thuốc</th>
                  <th>Liều/lần</th>
                  <th>Đường dùng</th>
                  <th>Khoảng cách</th>
                  {showCourse && <th>Thời gian</th>}
                </tr>
              </thead>
              <tbody>
                {opts.map((o, j) => (
                  <Row key={`${o.name}-${j}`} o={o} showCourse={showCourse} />
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {duration && <p className="tx-dur"><span>Thời gian điều trị</span> {duration}</p>}
      {(status === "PARTIAL" || notes.length > 0) && (
        <details className="tx-src">
          <summary>
            Nguyên văn nguồn{status === "PARTIAL" ? " · ô “—” là nguồn không nêu" : ""}
          </summary>
          <ul>
            {groups.flatMap((g) => g.raw).map((r, i) => (
              <li key={`${r.name}-${i}`}><strong>{r.name}:</strong> {r.dose}</li>
            ))}
          </ul>
          {notes.length > 0 && (
            <ul className="tx-notes">
              {Array.from(new Set(notes)).map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </details>
      )}
      <TxStyle />
    </div>
  );
}

export function TxStyle() {
  return (
    <style>{`
      .tx { display: grid; gap: 6px; min-width: 0; }
      .tx-group { min-width: 0; }
      .tx-ghead { display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; margin: 2px 0 4px; font-size: 12.5px; }
      .tx-rule { font-size: 11px; font-weight: 800; color: #075985; background: #e0f2fe; border-radius: 999px; padding: 1px 8px; }
      .tx-cond { font-size: 12px; color: #7c2d12; }
      .tx-join { font-size: 11.5px; font-weight: 800; color: #0b6b8a; letter-spacing: .02em; margin: 2px 0; }
      .tx-join-opt { color: #92400e; }
      .tx-join-seq { color: #4b5563; }
      .tx-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 13px; }
      .tx-table th { text-align: left; font-size: 11px; font-weight: 700; color: #4b6576; border-bottom: 1px solid #dce6ed; padding: 4px 6px; }
      .tx-table td { vertical-align: top; padding: 6px; border-bottom: 1px solid #edf2f6; overflow-wrap: anywhere; }
      .tx-table th:first-child, .tx-table td:first-child { width: 30%; }
      .tx-drug strong { display: block; }
      .tx-pop, .tx-ctx, .tx-sub { display: block; font-size: 11px; color: #5b7384; }
      .tx-pop { color: #075985; font-weight: 700; }
      .tx-crit { display: block; margin-top: 3px; font-size: 11px; font-weight: 800; color: #9f1239; }
      .tx-row-warn td { background: #fff1f2; }
      .tx-dur { font-size: 12.5px; margin: 2px 0 0; }
      .tx-dur span { font-weight: 700; color: #4b6576; margin-right: 4px; }
      .tx-src { font-size: 12px; color: #4b6576; }
      .tx-src summary { cursor: pointer; font-weight: 700; color: #087f89; }
      .tx-src ul { margin: 4px 0 0; padding-left: 18px; }
      .tx-notes { color: #7c2d12; }
      .tx-status { justify-self: start; font-size: 11px; font-weight: 800; border-radius: 999px; padding: 2px 8px; background: #fff7ed; color: #9a3412; border: 1px dashed #c2410c; }
      .tx-raw { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; font-size: 13px; }
      .tx-raw li { display: grid; gap: 2px; padding: 6px 8px; background: #f7fafc; border-radius: 8px; overflow-wrap: anywhere; }
      @media (max-width: 640px) {
        .tx-table, .tx-table tbody, .tx-table tr, .tx-table td { display: block; width: 100% !important; }
        .tx-table thead { display: none; }
        .tx-table tr { border: 1px solid #dce6ed; border-radius: 10px; padding: 6px 8px; margin-bottom: 6px; background: #fff; }
        .tx-table td { border: 0; padding: 2px 0; display: grid; grid-template-columns: 92px minmax(0, 1fr); gap: 6px; }
        .tx-table td::before { content: attr(data-label); font-size: 11px; font-weight: 700; color: #5b7384; }
        .tx-table td.tx-drug { display: block; }
        .tx-table td.tx-drug::before { content: none; }
      }
    `}</style>
  );
}
