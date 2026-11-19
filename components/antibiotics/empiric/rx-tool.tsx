"use client";
/* Thanh phan giao dien dung chung cho cong cu chon khang sinh theo chan doan (bang ke don, nut chon, chu giai muc khuyen cao). */
import type { ReactNode } from "react";
import type { RxItem } from "./septic-arthritis-pids2023";
import { parseDose } from "./rx-dose-parts";

type Item = RxItem & { preparation?: string; administration?: string; course?: string };
export const ALG = "Dị ứng beta-lactam";
export const PREF = "Ưu tiên";
export const ALT = "Thay thế";

export const GRADE_LEGEND: [string, string][] = [
  ["Mạnh · Có ĐK", "Sức mạnh khuyến cáo (GRADE): mạnh – phần lớn người bệnh nên nhận; có điều kiện – cân nhắc theo từng người bệnh"],
  ["Cao → Rất thấp", "Độ tin cậy của bằng chứng: cao, trung bình, thấp, rất thấp"],
  ["TH tốt", "Khuyến cáo thực hành tốt: dựa trên bằng chứng gián tiếp lớn, lợi ích rõ ràng"],
  ["Không nhãn", "Thuốc trong bảng lựa chọn theo tác nhân hoặc phần phân tích của hướng dẫn, không xếp mức"],
];
const CERT: Record<string, string> = { H: "cao", M: "TB", L: "thấp", VL: "rất thấp" };

/* Nguồn: mỗi tài liệu một dòng, ghi chú tách riêng. */
export function SourceList({ sources, notes = [], children }: { sources: string[]; notes?: string[]; children?: ReactNode }) {
  return (
    <div className="sa24-src">
      {sources.length > 0 && <>
        <b>Nguồn</b>
        <ol>{sources.map((s) => <li key={s}>{s}</li>)}</ol>
      </>}
      {notes.map((n) => <p key={n}>{n}</p>)}
      {children && <p>{children}</p>}
    </div>
  );
}

export function Grade({ g }: { g?: string }) {
  if (!g) return null;
  if (g === "EAU-S") return <span className="sa24-g sa24-g-a" title="Mức khuyến cáo của EAU: mạnh">Mạnh</span>;
  if (g === "EAU-W") return <span className="sa24-g sa24-g-c" title="Mức khuyến cáo của EAU: yếu">Yếu</span>;
  if (g === "CR") return <span className="sa24-g sa24-g-a" title="Khuyến cáo rõ: có bằng chứng tiến cứu, có đối chứng, lặp lại được">KC rõ</span>;
  if (g === "RV") return <span className="sa24-g sa24-g-c" title="Tổng quan lâm sàng: bằng chứng chưa đủ để đưa khuyến cáo rõ">TQ lâm sàng</span>;
  if (g === "PW") return <span className="sa24-g sa24-g-gps" title="Bổ sung thực hành của Lộ trình lâm sàng IDSA, ngoài hướng dẫn ATS/IDSA 2019">Lộ trình IDSA</span>;
  if (g === "AMR") return <span className="sa24-g sa24-g-gps" title="IDSA 2026 – hướng dẫn điều trị vi khuẩn Gram âm kháng thuốc, không xếp mức GRADE">IDSA 2026</span>;
  if (g === "GPS") return <span className="sa24-g sa24-g-gps" title="Khuyến cáo thực hành tốt">TH tốt</span>;
  if (g === "ACOG") return <span className="sa24-g sa24-g-gps" title="ACOG Clinical Consensus: khuyến cáo được hội đồng bỏ phiếu, đạt ngưỡng đồng thuận ≥ 75%; không xếp mức GRADE">Đồng thuận</span>;
  if (g === "KG") return <span className="sa24-g sa24-g-c" title="Khoảng trống kiến thức: hội đồng không khuyến cáo nên hay không nên">Chưa KC</span>;
  const m = g.match(/^([SCW])-(H|M|L|VL)$/);
  if (m) return <span className={`sa24-g ${m[1] === "S" ? "sa24-g-a" : "sa24-g-c"}`} title="Sức mạnh khuyến cáo · độ tin cậy bằng chứng (GRADE)">{m[1] === "S" ? "Mạnh" : m[1] === "W" ? "Yếu" : "Có ĐK"} · {CERT[m[2]]}</span>;
  return <span className={`sa24-g sa24-g-${g[0].toLowerCase()}`} title="Mức khuyến cáo – chất lượng bằng chứng">{g}</span>;
}
export function Rx({ items }: { items: Item[] }) {
  if (!items.length) return null;
  const hasDose = items.some((i) => i.dose);
  const hasGrade = items.some((i) => i.grade);
  const parts = items.map((i) => (i.dose ? parseDose(i.dose) : null));
  const showRoute = parts.some((p) => p?.route);
  const showFreq = parts.some((p) => p?.freq);
  const showDuration = items.some((item, index) => item.course || parts[index]?.duration);
  /* So cot danh cho cach dung: lieu + cac cot co du lieu. */
  const useSpan = 1 + Number(showRoute) + Number(showFreq) + Number(showDuration);
  return (
    <table className={`sa24-rx${hasDose ? " has-dose" : ""}`}>
      {hasDose && (
        <thead>
          <tr>
            <th scope="col">Lựa chọn</th>
            <th scope="col">Thuốc</th>
            <th scope="col">Liều</th>
            {showRoute && <th scope="col">Đường dùng</th>}
            {showFreq && <th scope="col">Số lần dùng</th>}
            {showDuration && <th scope="col">Thời gian</th>}
            {hasGrade && <th scope="col" className="sa24-gc">Mức KC</th>}
          </tr>
        </thead>
      )}
      <tbody>
        {items.map((it, i) => {
          const p = parts[i];
          return (
            <tr key={it.role + it.text + i} className={it.al === "alt" || it.role.startsWith(ALG) || it.role.startsWith("Không dùng được beta") ? "is-alg" : it.role === PREF ? "is-pref" : undefined}>
              <th scope="row">{it.role}</th>
              {/* Dong khong co lieu (nguyen tac, ghi chu): noi dung trai het cac cot cach dung. */}
              <td className={hasDose && !it.dose ? "sa24-note" : "sa24-drug"} colSpan={hasDose && !it.dose ? 1 + useSpan : undefined}>
                {it.text}
                {it.preparation && <span className="sa24-rx-detail">{it.preparation}</span>}
              </td>
              {it.dose && p && <>
                <td className="sa24-dose" data-label="Liều"><span>{p.dose}{it.administration && <span className="sa24-rx-detail">{it.administration}</span>}</span></td>
                {showRoute && <td className="sa24-dose" data-label="Đường dùng">{p.route ?? ""}</td>}
                {showFreq && <td className="sa24-dose" data-label="Số lần dùng">{p.freq ?? ""}</td>}
                {showDuration && <td className="sa24-dose" data-label="Thời gian">{it.course ?? p.duration ?? ""}</td>}
              </>}
              {/* Cau lieu khong tach chac chan duoc: giu nguyen trong mot o. */}
              {it.dose && !p && <td className="sa24-dose" data-label="Cách dùng" data-whole="" colSpan={useSpan}>
                <span>{it.dose}{it.administration && <span className="sa24-rx-detail">{it.administration}</span>}{it.course && <span className="sa24-rx-detail">{it.course}</span>}</span>
              </td>}
              {(hasGrade || !hasDose) && <td className="sa24-gc"><Grade g={it.grade} /></td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: readonly { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="sa24-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className={value === o.id ? "on" : undefined} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}
export function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="sa24-row"><div className="sa24-lab">{label}</div><div className="sa24-ctl">{children}</div></div>;
}
export function Legend({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="sa24-legend" aria-label="Cách đọc mức khuyến cáo">
      {rows.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
    </dl>
  );
}

/* Loc theo di ung beta-lactam (xem ghi chu tai cong cu viem khop). */
export type AlgState = "none" | "explicit" | "filtered" | "only-bl";
export function byAllergy(items: Item[], allergy: boolean): { shown: Item[]; state: AlgState } {
  if (!allergy) return { shown: items.filter((i) => i.al !== "alt"), state: "none" };
  const rest = items.filter((i) => i.al !== "std");
  if (items.some((i) => i.al === "alt")) return { shown: rest, state: "explicit" };
  if (!items.some((i) => i.al === "std")) return { shown: items, state: "none" };
  const nonBL = rest.filter((i) => !["Nguyên tắc", "Chuyển uống"].includes(i.role));
  return nonBL.length ? { shown: rest, state: "filtered" } : { shown: items, state: "only-bl" };
}

/* Cach doc bang thuoc: dong la lua chon thay the nhau; "+" / Them / Kem / Phoi hop la dung dong thoi. */
export function ReadHint() {
  return <p className="sa24-lead">Cách đọc: mỗi dòng là một lựa chọn thay thế nhau – chỉ chọn một. Thuốc nối bằng dấu “+” trong cùng dòng, hoặc dòng ghi “Thêm”, “Kèm”, “Phối hợp”, là dùng đồng thời với thuốc đã chọn.</p>;
}
export function RxToolStyle() {
  return <style>{`
        .sa24 { border: 1px solid #dbe6ed; border-radius: 16px; padding: 16px; margin: 12px 0; background: #fff; display: grid; gap: 14px; min-width: 0; }
        .sa24-eyebrow { margin: 0; font-size: 11.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; color: #087f89; }
        .sa24 h3 { margin: 2px 0 0; font-size: 18px; font-weight: 800; color: #0f2236; }
        .sa24-flow { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 4px; counter-reset: f; }
        .sa24-flow li { counter-increment: f; font-size: 12px; color: #33505f; background: #f1f6f9; border-radius: 999px; padding: 2px 10px 2px 4px; }
        .sa24-flow li::before { content: counter(f); display: inline-grid; place-items: center; width: 16px; height: 16px; margin-right: 5px; border-radius: 50%; background: #0b3a5b; color: #fff; font-size: 10.5px; font-weight: 800; }
        .sa24-form { display: grid; border: 1px solid #e3eaf0; border-radius: 12px; overflow: hidden; }
        .sa24-row { display: grid; grid-template-columns: 150px minmax(0,1fr); gap: 12px; align-items: start; padding: 10px 12px; border-top: 1px solid #edf2f6; }
        .sa24-row:first-child { border-top: 0; }
        .sa24-lab { font-size: 13px; font-weight: 800; color: #0b3a5b; padding-top: 6px; }
        .sa24-ctl { display: grid; gap: 6px; min-width: 0; }
        .sa24-seg { display: flex; flex-wrap: wrap; gap: 6px; }
        .sa24-seg button { border: 1px solid #cfdde6; background: #f7fafc; border-radius: 999px; padding: 6px 12px; font: inherit; font-size: 13px; color: #33505f; cursor: pointer; text-align: left; }
        .sa24-seg button.on { background: #0b3a5b; border-color: #0b3a5b; color: #fff; font-weight: 700; }
        .sa24 select { width: 100%; max-width: 100%; border: 1px solid #cfdde6; border-radius: 10px; padding: 8px 10px; font: inherit; font-size: 13.5px; background: #fff; }
        .sa24-chk { display: flex; gap: 6px; align-items: center; font-size: 13px; color: #33505f; }
        .sa24-out { border: 1px solid #cfe3e6; background: #f8fcfc; border-radius: 12px; padding: 12px 14px; display: grid; gap: 8px; min-width: 0; }
        .sa24-dx { display: grid; gap: 3px; padding-bottom: 8px; border-bottom: 1px solid #dcebed; }
        .sa24-dx p { margin: 0; display: grid; grid-template-columns: 120px minmax(0,1fr); gap: 8px; font-size: 13.5px; line-height: 1.5; color: #10243e; }
        .sa24-dx b { color: #0b3a5b; font-size: 12.5px; }
        .sa24-legend { margin: 0; display: grid; gap: 6px; font-size: 12.5px; line-height: 1.75; color: #4b6576; background: #fff; border: 1px solid #e3eaf0; border-radius: 8px; padding: 8px 12px; }
        .sa24-legend > div { display: grid; grid-template-columns: 120px minmax(0,1fr); gap: 10px; }
        .sa24-legend dt { font-weight: 800; color: #0b3a5b; }
        .sa24-legend dd { margin: 0; }
        .sa24-out h4 { margin: 8px 0 0; font-size: 15px; font-weight: 800; color: #0b3a5b; }
        .sa24-rx { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e3eaf0; border-radius: 10px; overflow: hidden; }
        .sa24-rx th, .sa24-rx td { padding: 8px 10px; border-top: 1px solid #edf2f6; text-align: left; vertical-align: top; font-size: 14px; line-height: 1.55; }
        .sa24-rx tr:first-child th, .sa24-rx tr:first-child td { border-top: 0; }
        .sa24-rx th { width: 28%; font-weight: 700; color: #33505f; font-size: 13px; }
        .sa24-rx thead th { width: auto; background: #f1f6f9; color: #0b3a5b; font-size: 12px; font-weight: 800; white-space: nowrap; }
        .sa24-rx.has-dose tbody th { width: 17%; }
        .sa24-rx.has-dose .sa24-drug { width: 21%; font-weight: 700; color: #0f2236; }
        .sa24-rx .sa24-note { font-size: 13px; color: #33505f; }
        .sa24-rx .sa24-dose { font-size: 13.5px; color: #10243e; }
        .sa24-rx-detail { display: block; margin-top: 3px; font-size: 12px; font-weight: 400; line-height: 1.45; color: #405b71; overflow-wrap: anywhere; }
        .sa24-rx .sa24-gc { width: 112px; text-align: right; white-space: nowrap; }
        .sa24-rx tr.is-pref th { color: #0b6b3a; }
        .sa24-rx tr.is-alg { background: #fff8f1; }
        .sa24-rx tr.is-alg th { color: #9a3412; }
        .sa24-dosetab th { width: 24%; }
        .sa24-g { display: inline-block; border-radius: 6px; padding: 0 6px; font-size: 11.5px; font-weight: 800; line-height: 1.7; white-space: nowrap; }
        .sa24-g-a { background: #dff3e8; color: #106b3d; }
        .sa24-g-b { background: #e6f0fb; color: #1d4f8a; }
        .sa24-g-c { background: #fff3d6; color: #8a5a00; }
        .sa24-g-d { background: #fde4e4; color: #9b1c1c; }
        .sa24-g-gps { background: #e6f0fb; color: #1d4f8a; }
        .sa24-g-đ { background: #e6f0fb; color: #1d4f8a; }
        .sa24-warn { margin: 0; font-size: 13px; line-height: 1.55; color: #7c2d12; background: #fff4ed; border: 1px solid #f6cfb5; border-radius: 8px; padding: 6px 10px; }
        .sa24-lead { margin: 0; font-size: 13px; font-weight: 600; line-height: 1.55; color: #0b6b3a; background: #eef8f2; border-radius: 8px; padding: 6px 10px; }
        .sa24-tip { margin: 0; font-size: 12.5px; line-height: 1.6; color: #4b6576; }
        .sa24-more summary { cursor: pointer; font-weight: 700; font-size: 13.5px; color: #0b3a5b; }
        .sa24-more[open] { display: grid; gap: 10px; }
        .sa24-pblock h5 { margin: 0 0 6px; font-size: 13px; font-weight: 800; color: #33505f; text-transform: uppercase; letter-spacing: .03em; }
        .sa24-src { display: grid; gap: 4px; margin: 0; font-size: 12px; line-height: 1.5; color: #6b8293; border-top: 1px solid #edf2f6; padding-top: 8px; }
        .sa24-src b { color: #33505f; }
        .sa24-src ol { margin: 0; padding-left: 20px; display: grid; gap: 2px; }
        .sa24-src p { margin: 0; }
        @media (max-width: 900px) {
          .sa24-rx.has-dose, .sa24-rx.has-dose tbody, .sa24-rx.has-dose tr, .sa24-rx.has-dose th, .sa24-rx.has-dose td { display: block; width: auto !important; }
          .sa24-rx.has-dose thead { display: none; }
          .sa24-rx.has-dose tbody tr { display: grid; gap: 3px; border-top: 1px solid #edf2f6; padding: 8px 10px; }
          .sa24-rx.has-dose tbody tr:first-child { border-top: 0; }
          .sa24-rx.has-dose th, .sa24-rx.has-dose td { border: 0; padding: 0; }
          .sa24-rx.has-dose td[data-label] { display: grid; grid-template-columns: 96px minmax(0,1fr); gap: 8px; }
          .sa24-rx.has-dose td[data-label]::before { content: attr(data-label); font-size: 12px; font-weight: 700; color: #5a7385; }
          .sa24-rx.has-dose td[data-label]:empty { display: none; }
          .sa24-rx.has-dose .sa24-gc { text-align: left; }
        }
        @media (max-width: 640px) {
          .sa24-row { grid-template-columns: 1fr; gap: 6px; }
          .sa24-lab { padding-top: 0; }
          .sa24-dx p, .sa24-legend > div { grid-template-columns: 1fr; gap: 0; }
          .sa24-rx, .sa24-rx tbody, .sa24-rx tr, .sa24-rx th, .sa24-rx td { display: block; width: auto !important; }
          .sa24-rx tr { border-top: 1px solid #edf2f6; padding: 6px 10px; }
          .sa24-rx tr:first-child { border-top: 0; }
          .sa24-rx th, .sa24-rx td { border: 0; padding: 0; }
          .sa24-rx .sa24-gc { text-align: left; padding-top: 2px; }
        }
  `}</style>;
}
