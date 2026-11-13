"use client";

import { useEffect, useMemo, useState } from "react";
import { Baby, HeartPulse, Search, BookOpen } from "lucide-react";
import DtqgProse from "@/components/dosing/DtqgProse";
import type { DtqgBlock } from "@/lib/dosing/catalog";

export type PregnancyItem = {
  id: string;
  name: string;
  inn: string;
  group: "ks-n1" | "ks-n2" | "khang-sinh" | "thuoc-khac";
  inFormulary: boolean;
  pages: { pdf: number[]; printed: number[] };
  pregnancy: DtqgBlock[];
  lactation: DtqgBlock[];
};

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
const FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "ab", label: "Kháng sinh" },
  { id: "other", label: "Thuốc khác" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];
const isAntimicrobial = (g: PregnancyItem["group"]) => g !== "thuoc-khac";

export default function PregnancyModule({ items, source }: { items: PregnancyItem[]; source: string }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [sel, setSel] = useState<string | null>(null);

  // Mo thuoc theo ?thuoc=<id> (chia se lien ket).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("thuoc");
    if (id && items.some((x) => x.id === id)) setSel(id); // eslint-disable-line react-hooks/set-state-in-effect
  }, [items]);

  const shown = useMemo(() => {
    const k = plain(q.trim());
    return items.filter((x) =>
      (filter === "all" || (filter === "ab") === isAntimicrobial(x.group)) &&
      (!k || plain(`${x.name} ${x.inn}`).includes(k)));
  }, [items, q, filter]);
  const counts = useMemo(() => ({ all: items.length, ab: items.filter((x) => isAntimicrobial(x.group)).length, other: items.filter((x) => !isAntimicrobial(x.group)).length }), [items]);
  const item = items.find((x) => x.id === sel) ?? null;

  function pick(id: string) {
    setSel(id);
    const u = new URL(window.location.href);
    u.searchParams.set("thuoc", id);
    window.history.replaceState(null, "", u);
    if (window.matchMedia("(max-width: 860px)").matches) setTimeout(() => document.getElementById("pg-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }

  return (
    <main className="pg">
      <div className="pg-wrap">
        <header className="pg-head">
          <p className="pg-eyebrow">An toàn thuốc</p>
          <h1>Thai kỳ &amp; cho con bú</h1>
          <p className="pg-sub">Nguyên văn mục <strong>Thời kỳ mang thai</strong> và <strong>Thời kỳ cho con bú</strong> trong Dược thư quốc gia Việt Nam 2023, cho các thuốc thuộc danh mục BV199.</p>
        </header>

        <div className="pg-grid">
          <section className="pg-card pg-list" aria-label="Danh sách thuốc">
            <div className="pg-filters" role="group" aria-label="Lọc nhóm thuốc">
              {FILTERS.map((f) => (
                <button key={f.id} type="button" className={filter === f.id ? "on" : undefined} onClick={() => setFilter(f.id)}>
                  {f.label} <span>{counts[f.id]}</span>
                </button>
              ))}
            </div>
            <label className="pg-search">
              <Search size={16} aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm hoạt chất…" aria-label="Tìm hoạt chất" />
            </label>
            <ul className="pg-items">
              {shown.map((x) => (
                <li key={x.id}>
                  <button type="button" className={x.id === sel ? "on" : undefined} onClick={() => pick(x.id)}>
                    <span className="pg-name">{x.name}</span>
                    {(!x.pregnancy.length || !x.lactation.length) && (
                      <span className="pg-tags"><span className="pg-tag">{x.pregnancy.length ? "Chỉ có mục mang thai" : "Chỉ có mục cho con bú"}</span></span>
                    )}
                  </button>
                </li>
              ))}
              {shown.length === 0 && <li className="pg-empty">Không tìm thấy hoạt chất.</li>}
            </ul>
          </section>

          <section id="pg-detail" className="pg-card pg-detail" aria-live="polite">
            {!item ? (
              <div className="pg-placeholder">
                <Baby size={30} aria-hidden />
                <p>Chọn một hoạt chất để xem khuyến cáo trong thai kỳ và thời kỳ cho con bú.</p>
              </div>
            ) : (
              <>
                <h2>{item.name}</h2>
                <p className="pg-inn">{item.inn}</p>
                <div className="pg-sec">
                  <h3><Baby size={17} aria-hidden /> Thời kỳ mang thai</h3>
                  {item.pregnancy.length ? <DtqgProse blocks={item.pregnancy} /> : <p className="pg-none">Chuyên luận không có mục này.</p>}
                </div>
                <div className="pg-sec">
                  <h3><HeartPulse size={17} aria-hidden /> Thời kỳ cho con bú</h3>
                  {item.lactation.length ? <DtqgProse blocks={item.lactation} /> : <p className="pg-none">Chuyên luận không có mục này.</p>}
                </div>
                <p className="pg-src"><BookOpen size={14} aria-hidden /> {source}, chuyên luận {item.name}, trang {[...new Set(item.pages.printed)].join("–")}.</p>
              </>
            )}
          </section>
        </div>
      </div>
      <style>{`
        .pg { min-height: 100vh; background: #f4f7fa; }
        .pg-wrap { max-width: 1180px; margin: 0 auto; padding: 22px 16px 96px; display: grid; gap: 16px; }
        .pg-eyebrow { margin: 0; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #087f89; }
        .pg-head h1 { margin: 4px 0 0; font-size: 28px; font-weight: 800; color: #0f2236; }
        .pg-sub { margin: 6px 0 0; max-width: 820px; font-size: 14.5px; line-height: 1.6; color: #4b6576; }
        .pg-grid { display: grid; gap: 16px; grid-template-columns: 340px minmax(0, 1fr); align-items: start; }
        .pg-card { background: #fff; border: 1px solid #e3eaf0; border-radius: 18px; padding: 16px; box-shadow: 0 2px 12px rgba(16,36,62,.04); min-width: 0; }
        .pg-list { position: sticky; top: 16px; display: grid; gap: 10px; }
        .pg-filters { display: flex; flex-wrap: wrap; gap: 6px; }
        .pg-filters button { border: 1px solid #dbe6ed; background: #f7fafc; border-radius: 999px; padding: 6px 11px; font: inherit; font-size: 12.5px; font-weight: 700; color: #33505f; cursor: pointer; }
        .pg-filters button span { color: #087f89; margin-left: 3px; }
        .pg-filters button.on { background: #e6f4f5; border-color: #0b7f89; color: #0b3a5b; }
        .pg-search { display: flex; align-items: center; gap: 8px; border: 1px solid #dbe6ed; border-radius: 12px; padding: 0 12px; color: #6b8293; }
        .pg-search input { flex: 1; min-width: 0; border: 0; outline: 0; padding: 11px 0; font: inherit; font-size: 14.5px; background: none; }
        .pg-search:focus-within { border-color: #087f89; box-shadow: 0 0 0 3px rgba(8,127,137,.12); }
        .pg-items { list-style: none; margin: 0; padding: 0; max-height: 62vh; overflow-y: auto; display: grid; gap: 2px; }
        .pg-items button { width: 100%; text-align: left; border: 0; background: none; border-radius: 10px; padding: 8px 10px; font: inherit; cursor: pointer; display: grid; gap: 4px; }
        .pg-items button:hover { background: #f3f8fa; }
        .pg-items button.on { background: #e6f4f5; }
        .pg-name { font-size: 14.5px; font-weight: 700; color: #10243e; }
        .pg-tags { display: flex; gap: 5px; }
        .pg-tag { font-size: 11px; font-weight: 700; border-radius: 6px; padding: 1px 6px; }
        .pg-tag { background: #f1f5f8; color: #557080; }
        .pg-empty { padding: 12px; color: #6b8293; font-size: 14px; }
        .pg-detail { padding: 20px 22px; display: grid; gap: 14px; }
        .pg-detail h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f2236; }
        .pg-inn { margin: -10px 0 0; font-size: 13.5px; color: #6b8293; }
        .pg-sec { border: 1px solid #e3eaf0; border-radius: 14px; padding: 14px 16px; display: grid; gap: 10px; }
        .pg-sec h3 { margin: 0; display: flex; align-items: center; gap: 7px; font-size: 16px; font-weight: 800; color: #0b3a5b; }
        .pg-none { margin: 0; color: #6b8293; font-size: 14px; }
        .pg-src { margin: 0; padding-top: 10px; border-top: 1px solid #edf2f6; display: flex; gap: 6px; align-items: flex-start; font-size: 12.5px; line-height: 1.5; color: #6b8293; }
        .pg-src svg { flex-shrink: 0; margin-top: 2px; }
        .pg-placeholder { display: grid; justify-items: center; gap: 8px; padding: 48px 16px; color: #6b8293; text-align: center; font-size: 14.5px; }
        @media (max-width: 860px) {
          .pg-grid { grid-template-columns: minmax(0, 1fr); }
          .pg-list { position: static; }
          .pg-items { max-height: 46vh; }
          .pg-head h1 { font-size: 24px; }
          .pg-detail { padding: 16px; }
        }
      `}</style>
    </main>
  );
}
