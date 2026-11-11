"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  Activity, AlertTriangle, Atom, Baby, Ban, Beaker, CalendarClock, Car, ChevronDown, FileText, FlaskConical,
  Package, Pill, Shuffle, Siren, Target, Thermometer, Timer, type LucideIcon,
} from "lucide-react";
import type { LeafletBlock } from "@/lib/drugs/format-leaflet";

export type LeafletSectionView = { key: string; title: string; group?: string; groupKey?: string; open?: boolean; blocks: LeafletBlock[] };

/* Bieu tuong theo muc; mau theo nhom. */
const ICON: Record<string, LucideIcon> = {
  chiDinh: Target, lieuDung: Pill, chongChiDinh: Ban, canhBao: AlertTriangle, tacDungPhu: Activity, thaiKy: Baby,
  laiXe: Car, quaLieu: Siren, tuongTac: Shuffle, tuongKy: FlaskConical, duocLuc: Atom, duocDong: Timer,
  thanhPhan: Beaker, dangBaoChe: Pill, dongGoi: Package, baoQuan: Thermometer, hanDung: CalendarClock, rawText: FileText,
};
const TONE: Record<string, string> = { dung: "t-teal", antoan: "t-amber", tuongtac: "t-violet", duocly: "t-blue", baoche: "t-slate" };
const PRIMARY = ["chiDinh", "chongChiDinh", "lieuDung"];
const CLAMP_CHARS = 650;

const textOf = (blocks: LeafletBlock[]) => blocks.map((b) => ("label" in b && b.label ? `${b.label}: ` : "") + b.text).join(" ");

/* Noi dung HDSD: muc luc mau theo nhom; 3 muc chinh dang the noi bat; nhom khac dang danh sach thu gon co tom tat. */
export default function LeafletSections({ sections }: { sections: LeafletSectionView[] }) {
  const primary = PRIMARY.map((k) => sections.find((s) => s.key === k)).filter((s): s is LeafletSectionView => !!s);
  const rest = sections.filter((s) => !PRIMARY.includes(s.key));
  const groups = rest.reduce<{ key: string; name: string; items: LeafletSectionView[] }[]>((acc, s) => {
    const k = s.groupKey ?? "khac";
    const g = acc.find((x) => x.key === k);
    if (g) g.items.push(s);
    else acc.push({ key: k, name: s.group ?? "Khác", items: [s] });
    return acc;
  }, []);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [full, setFull] = useState<Record<string, boolean>>({});
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const jump = (key: string) => {
    if (!PRIMARY.includes(key)) setOpen((o) => ({ ...o, [key]: true }));
    requestAnimationFrame(() => refs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const setAll = (v: boolean) => setOpen(Object.fromEntries(rest.map((s) => [s.key, v])));

  return (
    <div className="lf">
      <nav className="lf-toc" aria-label="Mục lục tờ hướng dẫn sử dụng">
        <div className="lf-chips">
          {sections.map((s) => {
            const Icon = ICON[s.key] ?? FileText;
            return (
              <button key={s.key} type="button" className={`lf-chip ${TONE[s.groupKey ?? ""] ?? "t-slate"}`} onClick={() => jump(s.key)}>
                <Icon size={14} aria-hidden />
                {s.title}
              </button>
            );
          })}
        </div>
      </nav>

      {primary.length > 0 && (
        <div className="lf-primary">
          {primary.map((s) => {
            const Icon = ICON[s.key] ?? FileText;
            const long = textOf(s.blocks).length > CLAMP_CHARS;
            const expanded = !long || full[s.key];
            return (
              <article key={s.key} ref={(el) => { refs.current[s.key] = el; }} className={`lf-card k-${s.key}`}>
                <header className="lf-card-h">
                  <span className="lf-ic"><Icon size={18} aria-hidden /></span>
                  <h3>{s.title}</h3>
                </header>
                <div className={`lf-body${expanded ? "" : " is-clamped"}`}>{renderBlocks(s.blocks)}</div>
                {long && (
                  <button type="button" className="lf-more" onClick={() => setFull((f) => ({ ...f, [s.key]: !f[s.key] }))}>
                    {expanded ? "Thu gọn" : "Xem đầy đủ"} <ChevronDown size={15} className={expanded ? "rot" : ""} aria-hidden />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}

      {groups.length > 0 && (
        <div className="lf-groups">
          <div className="lf-groups-bar">
            <span>Thông tin khác</span>
            <span className="lf-all">
              <button type="button" onClick={() => setAll(true)}>Mở tất cả</button>
              <span aria-hidden>·</span>
              <button type="button" onClick={() => setAll(false)}>Thu gọn</button>
            </span>
          </div>
          {groups.map((g) => (
            <section key={g.key} className={`lf-group ${TONE[g.key] ?? "t-slate"}`}>
              <h3 className="lf-group-t">{g.name}</h3>
              <div className="lf-rows">
                {g.items.map((s) => {
                  const Icon = ICON[s.key] ?? FileText;
                  const isOpen = !!open[s.key];
                  const preview = textOf(s.blocks);
                  return (
                    <div key={s.key} ref={(el) => { refs.current[s.key] = el; }} className={`lf-row${isOpen ? " is-open" : ""}`}>
                      <button type="button" className="lf-row-h" aria-expanded={isOpen} onClick={() => setOpen((o) => ({ ...o, [s.key]: !o[s.key] }))}>
                        <span className="lf-ic"><Icon size={17} aria-hidden /></span>
                        <span className="lf-row-txt">
                          <span className="lf-row-t">{s.title}</span>
                          {!isOpen && <span className="lf-row-p">{preview}</span>}
                        </span>
                        <ChevronDown size={18} className={`lf-caret${isOpen ? " rot" : ""}`} aria-hidden />
                      </button>
                      {isOpen && <div className="lf-body lf-row-b">{renderBlocks(s.blocks)}</div>}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <style>{`
        .lf { --teal:#087f89; --teal-bg:#e8f6f6; --amber:#b45309; --amber-bg:#fff6e5; --violet:#6d4aa8; --violet-bg:#f3effa; --blue:#1d5fa8; --blue-bg:#eaf2fc; --slate:#52667a; --slate-bg:#f0f4f7; --red:#b42318; --red-bg:#fef0ee; min-width:0; }
        .t-teal { --c: var(--teal); --cb: var(--teal-bg); } .t-amber { --c: var(--amber); --cb: var(--amber-bg); }
        .t-violet { --c: var(--violet); --cb: var(--violet-bg); } .t-blue { --c: var(--blue); --cb: var(--blue-bg); }
        .t-slate { --c: var(--slate); --cb: var(--slate-bg); }

        .lf-toc { position: sticky; top: 0; z-index: 5; margin: 14px -24px 16px; padding: 10px 24px; background: rgba(255,255,255,.95); backdrop-filter: blur(6px); border-bottom: 1px solid #e8eef3; }
        .lf-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .lf-chip { display: inline-flex; align-items: center; gap: 5px; border: 1px solid transparent; background: var(--cb); color: var(--c); border-radius: 999px; padding: 5px 11px 5px 9px; font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: border-color .15s, transform .15s; }
        .lf-chip:hover { border-color: var(--c); }

        .lf-primary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .lf-card { position: relative; border: 1px solid #e3eaf0; border-radius: 16px; background: #fff; padding: 16px 18px 14px; scroll-margin-top: 90px; box-shadow: 0 1px 2px rgba(16,36,62,.04); min-width: 0; }
        .lf-card::before { content: ""; position: absolute; left: 0; top: 14px; bottom: 14px; width: 4px; border-radius: 0 4px 4px 0; background: var(--teal); }
        .lf-card.k-chongChiDinh { background: linear-gradient(180deg, #fff 0, #fff 60%, #fffafa 100%); border-color: #f6d4cf; }
        .lf-card.k-chongChiDinh::before { background: var(--red); }
        .lf-card.k-lieuDung { grid-column: 1 / -1; }
        .lf-card-h { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .lf-card-h h3 { margin: 0; font-size: 16px; font-weight: 800; color: #10243e; }
        .lf-ic { flex: 0 0 auto; display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 10px; background: var(--cb, var(--teal-bg)); color: var(--c, var(--teal)); }
        .lf-card .lf-ic { background: var(--teal-bg); color: var(--teal); }
        .lf-card.k-chongChiDinh .lf-ic { background: var(--red-bg); color: var(--red); }

        .lf-body { font-size: 15px; line-height: 1.7; color: #24384c; overflow-wrap: anywhere; }
        .lf-body p { margin: 0 0 8px; }
        .lf-body p:last-child, .lf-body ul:last-child { margin-bottom: 0; }
        .lf-body ul { margin: 2px 0 10px; padding: 0; list-style: none; display: grid; gap: 6px; }
        .lf-body li { position: relative; padding-left: 18px; }
        .lf-body li::before { content: ""; position: absolute; left: 3px; top: .68em; width: 6px; height: 6px; border-radius: 50%; background: var(--c, var(--teal)); }
        .lf-card.k-chongChiDinh li::before { background: var(--red); }
        .lf-body .lf-h { margin: 12px 0 6px; font-weight: 800; color: #0b3a5b; font-size: 14.5px; }
        .lf-body .lf-h:first-child { margin-top: 0; }
        .lf-body .lf-label { font-weight: 700; color: #10243e; }
        .lf-body.is-clamped { max-height: 260px; overflow: hidden; -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent); mask-image: linear-gradient(180deg, #000 70%, transparent); }
        .lf-more { margin-top: 8px; display: inline-flex; align-items: center; gap: 4px; border: 0; background: none; padding: 4px 0; color: var(--teal); font: inherit; font-size: 13.5px; font-weight: 800; cursor: pointer; }
        .rot { transform: rotate(180deg); }

        .lf-groups { margin-top: 22px; display: grid; gap: 16px; }
        .lf-groups-bar { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 13px; font-weight: 800; color: #10243e; text-transform: uppercase; letter-spacing: .05em; }
        .lf-all { display: inline-flex; gap: 8px; text-transform: none; letter-spacing: 0; font-weight: 600; color: #8aa0b0; }
        .lf-all button { border: 0; background: none; padding: 0; font: inherit; font-weight: 700; color: var(--teal); cursor: pointer; }
        .lf-group-t { margin: 0 0 8px; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--c); }
        .lf-group-t::after { content: ""; flex: 1; height: 1px; background: #e6edf2; }
        .lf-rows { border: 1px solid #e3eaf0; border-radius: 14px; overflow: hidden; background: #fff; }
        .lf-row + .lf-row { border-top: 1px solid #edf2f6; }
        .lf-row { scroll-margin-top: 90px; }
        .lf-row-h { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 0; background: #fff; font: inherit; text-align: left; cursor: pointer; transition: background .15s; }
        .lf-row-h:hover { background: #f8fafc; }
        .lf-row.is-open .lf-row-h { background: var(--cb); }
        .lf-row-txt { flex: 1; min-width: 0; display: grid; gap: 2px; }
        .lf-row-t { font-size: 15px; font-weight: 700; color: #10243e; }
        .lf-row-p { font-size: 13px; color: #6b8293; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lf-caret { flex: 0 0 auto; color: #8aa0b0; transition: transform .15s; }
        .lf-row-b { padding: 12px 16px 16px 58px; }

        .lf :is(button):focus-visible { outline: 3px solid var(--teal); outline-offset: 2px; border-radius: 8px; }

        @media (max-width: 760px) {
          .lf-primary { grid-template-columns: minmax(0, 1fr); }
          .lf-toc { margin: 10px -16px 12px; padding: 8px 16px; }
          .lf-chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
          .lf-chips::-webkit-scrollbar { display: none; }
          .lf-chip { flex: 0 0 auto; white-space: nowrap; }
          .lf-card { padding: 14px 14px 12px 16px; }
          .lf-body { font-size: 14.5px; }
          .lf-row-b { padding: 10px 14px 14px; }
        }
      `}</style>
    </div>
  );
}

function renderBlocks(blocks: LeafletBlock[]): ReactNode[] {
  const out: ReactNode[] = [];
  let list: ReactNode[] = [];
  const flush = () => {
    if (list.length) out.push(<ul key={`ul${out.length}`}>{list}</ul>);
    list = [];
  };
  blocks.forEach((b, i) => {
    const label = "label" in b && b.label ? <span className="lf-label">{b.label}: </span> : null;
    if (b.t === "li") { list.push(<li key={i}>{label}{b.text}</li>); return; }
    flush();
    out.push(b.t === "h" ? <p key={i} className="lf-h">{b.text}</p> : <p key={i}>{label}{b.text}</p>);
  });
  flush();
  return out;
}
