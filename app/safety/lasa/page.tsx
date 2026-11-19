"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Search, X, ZoomIn } from "lucide-react";
import {
  LASA_CHECK,
  LASA_SOURCE,
  lookAlikeGroups,
  soundAlikeGroups,
  type LasaDiff,
  type LasaDrug,
  type LasaGroup,
} from "@/data/safety/lasa";

type FilterId = "all" | "look" | "sound" | LasaDiff;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "look", label: "Nhìn giống nhau" },
  { id: "sound", label: "Đọc giống nhau" },
  { id: "strength", label: "Khác hàm lượng" },
  { id: "active", label: "Khác hoạt chất" },
  { id: "form", label: "Khác dạng dùng" },
  { id: "same", label: "Cùng hoạt chất" },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
const imageOf = (id: string) => `/lasa/2026/${id}.webp`;

/* To do cac doan chu giong nhau, dung nhu danh muc. */
function Marked({ text, marks = [] }: { text: string; marks?: string[] }) {
  const parts: { t: string; on: boolean }[] = [];
  let rest = text;
  for (const m of marks) {
    const i = rest.indexOf(m);
    if (i < 0) continue;
    if (i > 0) parts.push({ t: rest.slice(0, i), on: false });
    parts.push({ t: m, on: true });
    rest = rest.slice(i + m.length);
  }
  if (rest) parts.push({ t: rest, on: false });
  return <>{parts.map((p, i) => <Fragment key={i}>{p.on ? <mark>{p.t}</mark> : p.t}</Fragment>)}</>;
}

function Checks({ group }: { group: LasaGroup }) {
  return (
    <div className="lasa26-diff">
      <p><b>Điểm phân biệt</b>{group.difference}</p>
      <p><b>Kiểm tra</b>{group.diffs.map((d) => LASA_CHECK[d]).join(" ")}</p>
    </div>
  );
}

function LookCard({ group, onZoom }: { group: LasaGroup; onZoom: (d: LasaDrug) => void }) {
  return (
    <article className="lasa26-card">
      <div className={`lasa26-photos n${group.drugs.length}`}>
        {group.drugs.map((d) => (
          <figure key={d.id}>
            <button type="button" className="lasa26-photo" onClick={() => onZoom(d)} aria-label={`Phóng to ảnh ${d.name}${d.detail ? `, ${d.detail}` : ""}`}>
              <Image src={imageOf(d.id)} alt={`Bao bì ${d.name}`} fill unoptimized sizes="(max-width: 640px) 45vw, 240px" />
              <span className="lasa26-zoom" aria-hidden="true"><ZoomIn size={15} /></span>
            </button>
            <figcaption>
              <strong>{d.name}</strong>
              {d.active && <span>{d.active}</span>}
              {d.detail && <em>{d.detail}</em>}
            </figcaption>
          </figure>
        ))}
      </div>
      {group.warning && <p className="lasa26-warn"><AlertTriangle size={16} aria-hidden="true" />{group.warning}</p>}
      <Checks group={group} />
    </article>
  );
}

function SoundCard({ group }: { group: LasaGroup }) {
  return (
    <article className="lasa26-card">
      <div className="lasa26-names">
        {group.drugs.map((d) => (
          <div key={d.id}>
            <strong><Marked text={d.name} marks={d.marks} /></strong>
            {d.active && <span>{d.active}</span>}
          </div>
        ))}
      </div>
      <Checks group={group} />
    </article>
  );
}

export default function LASAPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [zoom, setZoom] = useState<LasaDrug | null>(null);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setZoom(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  const match = useMemo(() => {
    const q = norm(search.trim());
    return (g: LasaGroup) => {
      const byFilter = filter === "all" || filter === g.kind || g.diffs.includes(filter as LasaDiff);
      const text = norm([g.difference, ...g.drugs.flatMap((d) => [d.name, d.active ?? "", d.detail ?? ""])].join(" "));
      return byFilter && (!q || text.includes(q));
    };
  }, [search, filter]);

  const look = lookAlikeGroups.filter(match);
  const sound = soundAlikeGroups.filter(match);

  return (
    <div className="clinical-page lasa26">
      <section className="clinical-page-header">
        <span className="clinical-eyebrow">AN TOÀN THUỐC</span>
        <h1>Thuốc LASA – Bệnh viện 199</h1>
        <p>Danh mục thuốc nhìn giống nhau, đọc giống nhau năm 2025–2026.</p>
      </section>

      <section className="clinical-section">
        <div className="lasa26-search">
          <Search size={18} aria-hidden="true" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm tên thuốc hoặc hoạt chất..." aria-label="Tìm tên thuốc hoặc hoạt chất" />
        </div>
        <div className="lasa26-filters" role="group" aria-label="Lọc danh mục">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className={filter === f.id ? "on" : undefined} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
      </section>

      {look.length > 0 && (
        <section className="clinical-section">
          <h2 className="lasa26-h">Nhìn giống nhau <span>{look.length} nhóm</span></h2>
          <div className="lasa26-grid">{look.map((g) => <LookCard key={g.id} group={g} onZoom={setZoom} />)}</div>
        </section>
      )}

      {sound.length > 0 && (
        <section className="clinical-section">
          <h2 className="lasa26-h">Đọc giống nhau <span>{sound.length} cặp</span></h2>
          <div className="lasa26-grid sound">{sound.map((g) => <SoundCard key={g.id} group={g} />)}</div>
        </section>
      )}

      {look.length + sound.length === 0 && <p className="lasa26-empty">Không tìm thấy thuốc phù hợp.</p>}

      <p className="lasa26-src"><b>Nguồn</b>{LASA_SOURCE}</p>

      {zoom && (
        <div className="lasa26-box" role="dialog" aria-modal="true" aria-label={`Ảnh ${zoom.name}`} onClick={() => setZoom(null)}>
          <div className="lasa26-box-in" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lasa26-close" onClick={() => setZoom(null)} aria-label="Đóng ảnh" autoFocus><X size={20} /></button>
            <div className="lasa26-box-img"><Image src={imageOf(zoom.id)} alt={`Bao bì ${zoom.name}`} fill unoptimized sizes="90vw" /></div>
            <p><strong>{zoom.name}</strong>{zoom.active && <span>{zoom.active}</span>}{zoom.detail && <em>{zoom.detail}</em>}</p>
          </div>
        </div>
      )}

      <style>{`
        .lasa26-search { display: flex; align-items: center; gap: 8px; border: 1px solid #cfdde6; border-radius: 10px; background: #fff; padding: 0 12px; color: #5a7385; }
        .lasa26-search input { flex: 1; min-width: 0; min-height: 44px; border: 0; outline: 0; background: transparent; font: inherit; font-size: 15px; color: #10243e; }
        .lasa26-search:focus-within { border-color: #087f8c; box-shadow: 0 0 0 3px #087f8c22; }
        .lasa26-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .lasa26-filters button { min-height: 38px; border: 1px solid #cfdde6; border-radius: 999px; background: #fff; padding: 6px 14px; font: inherit; font-size: 13.5px; font-weight: 600; color: #33505f; cursor: pointer; }
        .lasa26-filters button.on { background: #0b3a5b; border-color: #0b3a5b; color: #fff; }
        .lasa26-h { margin: 0 0 12px; font-size: 18px; font-weight: 800; color: #0f2236; }
        .lasa26-h span { margin-left: 8px; font-size: 13px; font-weight: 600; color: #5a7385; }
        .lasa26-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .lasa26-card { display: grid; align-content: start; gap: 12px; min-width: 0; border: 1px solid #dbe6ed; border-radius: 14px; background: #fff; padding: 14px; }
        .lasa26-photos { display: grid; gap: 10px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .lasa26-photos.n3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .lasa26-photos figure { margin: 0; min-width: 0; display: grid; align-content: start; gap: 8px; }
        .lasa26-photo { position: relative; display: block; width: 100%; aspect-ratio: 4 / 3; border: 1px solid #e3eaf0; border-radius: 10px; background: #fff; padding: 0; overflow: hidden; cursor: zoom-in; }
        .lasa26-photo img { object-fit: contain; padding: 4px; }
        .lasa26-photo:focus-visible, .lasa26-close:focus-visible { outline: 3px solid #087f8c; outline-offset: 2px; }
        .lasa26-zoom { position: absolute; right: 5px; bottom: 5px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #0b3a5bcc; color: #fff; }
        .lasa26-photos figcaption { display: grid; gap: 2px; font-size: 13px; line-height: 1.4; color: #33505f; }
        .lasa26-photos figcaption strong { font-size: 14px; color: #0f2236; }
        .lasa26-photos figcaption em, .lasa26-box-in em { font-style: normal; font-size: 12.5px; color: #5a7385; }
        .lasa26-warn { display: flex; gap: 8px; margin: 0; border: 1px solid #f6cfb5; border-radius: 8px; background: #fff4ed; padding: 8px 10px; font-size: 13px; font-weight: 600; line-height: 1.5; color: #7c2d12; }
        .lasa26-warn svg { flex: none; margin-top: 2px; }
        .lasa26-diff { display: grid; gap: 6px; border-top: 1px solid #edf2f6; padding-top: 10px; }
        .lasa26-diff p { display: grid; grid-template-columns: 104px minmax(0, 1fr); gap: 8px; margin: 0; font-size: 13.5px; line-height: 1.5; color: #10243e; }
        .lasa26-diff b { font-size: 12.5px; color: #0b3a5b; }
        .lasa26-names { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .lasa26-names > div { display: grid; align-content: start; gap: 3px; min-width: 0; border-radius: 10px; background: #f5f9fb; padding: 10px 12px; font-size: 13px; line-height: 1.45; color: #33505f; overflow-wrap: anywhere; }
        .lasa26-names strong { font-size: 15px; color: #0f2236; }
        .lasa26-names mark { background: transparent; color: #c81e1e; }
        .lasa26-empty { margin: 8px 0; font-size: 14px; color: #5a7385; }
        .lasa26-src { display: grid; gap: 2px; margin: 8px 0 0; border-top: 1px solid #e3eaf0; padding-top: 10px; font-size: 12.5px; line-height: 1.5; color: #5a7385; }
        .lasa26-src b { color: #33505f; }
        .lasa26-box { position: fixed; inset: 0; z-index: 2000; display: grid; place-items: center; background: #0a1c2be0; padding: 16px; }
        .lasa26-box-in { position: relative; display: grid; gap: 10px; width: min(860px, 100%); max-height: 100%; border-radius: 14px; background: #fff; padding: 14px; }
        .lasa26-box-img { position: relative; width: 100%; height: min(68vh, 560px); }
        .lasa26-box-img img { object-fit: contain; }
        .lasa26-box-in p { display: grid; gap: 2px; margin: 0; padding-right: 40px; font-size: 14px; line-height: 1.45; color: #33505f; }
        .lasa26-box-in strong { font-size: 16px; color: #0f2236; }
        .lasa26-close { position: absolute; top: 8px; right: 8px; z-index: 1; display: grid; place-items: center; width: 40px; height: 40px; border: 0; border-radius: 50%; background: #0b3a5b; color: #fff; cursor: pointer; }
        @media (max-width: 900px) { .lasa26-grid { grid-template-columns: minmax(0, 1fr); } }
        @media (max-width: 480px) {
          .lasa26-photos.n3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .lasa26-diff p { grid-template-columns: minmax(0, 1fr); gap: 0; }
          .lasa26-names { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </div>
  );
}
