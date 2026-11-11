"use client";

import { useRef, useState, type ReactNode } from "react";
import type { LeafletBlock } from "@/lib/drugs/format-leaflet";

export type LeafletSectionView = { key: string; title: string; group?: string; open?: boolean; blocks: LeafletBlock[] };

/* Cac muc HDSD: muc luc nhanh + khoi co the mo/thu gon, noi dung chia doan/danh sach de de doc. */
export default function LeafletSections({ sections }: { sections: LeafletSectionView[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(sections.map((s) => [s.key, !!s.open])));
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const jump = (key: string) => {
    setOpen((o) => ({ ...o, [key]: true }));
    requestAnimationFrame(() => refs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const setAll = (v: boolean) => setOpen(Object.fromEntries(sections.map((s) => [s.key, v])));

  return (
    <div className="lf">
      <nav className="lf-toc" aria-label="Mục lục tờ hướng dẫn sử dụng">
        <div className="lf-chips">
          {sections.map((s, i) => (
            <span key={s.key} className="lf-chipwrap">
              {s.group && s.group !== sections[i - 1]?.group && <span className="lf-chipgroup">{s.group}</span>}
              <button type="button" className={`lf-chip${open[s.key] ? " is-open" : ""}`} onClick={() => jump(s.key)}>
                {s.title}
              </button>
            </span>
          ))}
        </div>
        <div className="lf-all">
          <button type="button" onClick={() => setAll(true)}>Mở tất cả</button>
          <span aria-hidden>·</span>
          <button type="button" onClick={() => setAll(false)}>Thu gọn</button>
        </div>
      </nav>

      <div className="lf-list">
        {sections.map((s, i) => (
          <div key={s.key} className="lf-item">
          {s.group && s.group !== sections[i - 1]?.group && <h3 className="lf-group">{s.group}</h3>}
          <section ref={(el) => { refs.current[s.key] = el; }} className={`lf-sec${open[s.key] ? " is-open" : ""}`}>
            <button type="button" className="lf-head" aria-expanded={!!open[s.key]} onClick={() => setOpen((o) => ({ ...o, [s.key]: !o[s.key] }))}>
              <span>{s.title}</span>
              <span className="lf-caret" aria-hidden>▾</span>
            </button>
            {open[s.key] && <div className="lf-body">{renderBlocks(s.blocks)}</div>}
          </section>
          </div>
        ))}
      </div>

      <style>{`
        .lf, .lf-list, .lf-sec { min-width: 0; }
        .lf-list { grid-template-columns: minmax(0, 1fr); }
        .lf-toc { position: sticky; top: 0; z-index: 5; margin: 14px -4px 10px; padding: 10px 4px; background: rgba(255,255,255,.96); backdrop-filter: blur(4px); border-bottom: 1px solid #e6edf2; }
        .lf-chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
        .lf-chipwrap { display: contents; }
        .lf-chipgroup { flex-basis: 100%; height: 0; }
        .lf-chipgroup:first-child { display: none; }
        @media (min-width: 900px) { .lf-chipgroup { flex-basis: auto; height: auto; margin: 0 2px 0 8px; font-size: 11px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: #8aa0b0; } .lf-chipgroup:first-child { display: inline; margin-left: 0; } }
        .lf-item { display: contents; }
        .lf-group { margin: 12px 0 0; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #087f89; }
        .lf-group:first-child { margin-top: 0; }
        .lf-chip { border: 1px solid #cfe0ea; background: #f5f9fc; color: #1e3a5f; border-radius: 999px; padding: 5px 11px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
        .lf-chip:hover { border-color: #087f89; color: #087f89; }
        .lf-chip.is-open { background: #e3f3f4; border-color: #9fd3d6; color: #065f66; }
        .lf-all { margin-top: 8px; display: flex; gap: 8px; align-items: center; font-size: 12.5px; color: #6b8293; }
        .lf-all button { border: 0; background: none; padding: 0; color: #087f89; font-weight: 700; cursor: pointer; }
        .lf-list { display: grid; gap: 10px; }
        .lf-sec { border: 1px solid #e2e8f0; border-radius: 14px; background: #fff; scroll-margin-top: 110px; overflow: hidden; }
        .lf-sec.is-open { border-color: #cfe0ea; box-shadow: 0 2px 10px rgba(16,36,62,.04); }
        .lf-head { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 12px 16px; border: 0; background: #f8fafc; color: #10243e; font: inherit; font-size: 15px; font-weight: 700; text-align: left; cursor: pointer; }
        .lf-sec.is-open .lf-head { background: #f1f7fa; border-bottom: 1px solid #e2e8f0; }
        .lf-caret { transition: transform .15s; color: #6b8293; }
        .lf-sec:not(.is-open) .lf-caret { transform: rotate(-90deg); }
        .lf-body { padding: 14px 18px 16px; max-width: 78ch; font-size: 14.5px; line-height: 1.7; color: #24384c; }
        .lf-body p { margin: 0 0 10px; }
        .lf-body p:last-child { margin-bottom: 0; }
        .lf-body ul { margin: 4px 0 12px; padding-left: 20px; list-style: disc; }
        .lf-body li { margin: 3px 0; padding-left: 2px; }
        .lf-body li::marker { color: #087f89; }
        .lf-body .lf-h { margin: 14px 0 6px; font-weight: 700; color: #0b3a5b; }
        .lf-body .lf-h:first-child { margin-top: 0; }
        .lf-body .lf-label { font-weight: 700; color: #10243e; }
        .lf-head:focus-visible, .lf-chip:focus-visible, .lf-all button:focus-visible { outline: 3px solid #087f89; outline-offset: 2px; }
        @media (max-width: 640px) {
          .lf-body { padding: 12px 14px 14px; font-size: 14px; }
          .lf-head { padding: 11px 14px; }
          /* Dien thoai: muc luc 1 hang vuot ngang, khong chiem man hinh khi bam theo. */
          .lf-toc { margin: 10px -16px 8px; padding: 8px 16px; }
          .lf-chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .lf-chips::-webkit-scrollbar { display: none; }
          .lf-chip { flex: 0 0 auto; white-space: nowrap; }
          .lf-chipgroup { display: none !important; }
          .lf-all { margin-top: 6px; }
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
