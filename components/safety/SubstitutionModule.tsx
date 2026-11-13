"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Replace, ShieldAlert, ChevronRight } from "lucide-react";

export type SubItem = {
  id: string; brandName: string; ingredientName: string; strength: string; route: string; dosageForm: string;
  manufacturer: string; country: string; unit: string; key: string; siblings: number;
};

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
/* Nhom duong dung de so sanh: uong / tiem-truyen / dung ngoai / nho mat / xit-hit / dat. */
function routeGroup(r: string): string {
  const k = plain(r);
  if (/tiem|truyen|tinh mach|tm\b|bap|duoi da/.test(k)) return "tiem";
  if (/uong|ngam|nhai/.test(k)) return "uong";
  if (/nho mat|mat/.test(k)) return "mat";
  if (/xit|hit|khi dung/.test(k)) return "hit";
  if (/dat|truc trang|am dao/.test(k)) return "dat";
  if (/ngoai|boi|da\b/.test(k)) return "ngoai";
  return k;
}

export default function SubstitutionModule({ items }: { items: SubItem[] }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("thuoc");
    if (id && items.some((x) => x.id === id)) setSel(id); // eslint-disable-line react-hooks/set-state-in-effect
  }, [items]);

  const hits = useMemo(() => {
    const k = plain(q.trim());
    if (k.length < 2) return [];
    return items.filter((x) => plain(`${x.brandName} ${x.ingredientName}`).includes(k)).slice(0, 40);
  }, [items, q]);
  const item = items.find((x) => x.id === sel) ?? null;
  const subs = useMemo(() => {
    if (!item) return { same: [], other: [] };
    const all = items.filter((x) => x.key === item.key && x.id !== item.id);
    const rg = routeGroup(item.route);
    return { same: all.filter((x) => routeGroup(x.route) === rg), other: all.filter((x) => routeGroup(x.route) !== rg) };
  }, [items, item]);

  function pick(id: string) {
    setSel(id);
    setQ("");
    const u = new URL(window.location.href);
    u.searchParams.set("thuoc", id);
    window.history.replaceState(null, "", u);
  }

  const Row = ({ x }: { x: SubItem }) => (
    <li className="sb-row">
      <div className="sb-row-main">
        <strong>{x.brandName}</strong>
        <span className="sb-ing">{x.ingredientName}</span>
        <span className="sb-meta">{[x.strength, x.dosageForm, x.route].filter(Boolean).join(" · ")}</span>
        <span className="sb-mfr">{[x.manufacturer, x.country].filter(Boolean).join(" – ")}</span>
      </div>
      <div className="sb-row-act">
        <Link href={`/drugs/${encodeURIComponent(x.id)}`}>Thông tin thuốc <ChevronRight size={14} aria-hidden /></Link>
      </div>
    </li>
  );

  return (
    <main className="sb">
      <div className="sb-wrap">
        <header>
          <p className="sb-eyebrow">Dược lâm sàng</p>
          <h1>Thay thế thuốc trong danh mục</h1>
          <p className="sb-sub">Tìm chế phẩm <strong>cùng hoạt chất</strong> trong danh mục thuốc BV199 khi thiếu thuốc hoặc cần đổi chế phẩm. Kết quả xếp theo đường dùng; so sánh hàm lượng và dạng bào chế trước khi thay.</p>
        </header>

        <section className="sb-card">
          <label className="sb-search">
            <Search size={16} aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nhập tên biệt dược hoặc hoạt chất cần thay…" aria-label="Tìm thuốc cần thay" />
          </label>
          {hits.length > 0 && (
            <ul className="sb-hits">
              {hits.map((x) => (
                <li key={x.id}>
                  <button type="button" onClick={() => pick(x.id)}>
                    <strong>{x.brandName}</strong> <span>{x.ingredientName} · {x.strength} · {x.route}</span>
                    <em>{x.siblings > 0 ? `${x.siblings} chế phẩm cùng hoạt chất` : "Không có chế phẩm cùng hoạt chất"}</em>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {q.trim().length >= 2 && hits.length === 0 && <p className="sb-empty">Không tìm thấy thuốc trong danh mục.</p>}
        </section>

        {item && (
          <>
            <section className="sb-card sb-current">
              <p className="sb-label"><Replace size={15} aria-hidden /> Thuốc cần thay</p>
              <h2>{item.brandName}</h2>
              <p className="sb-ing">{item.ingredientName}</p>
              <p className="sb-meta">{[item.strength, item.dosageForm, item.route].filter(Boolean).join(" · ")}</p>
            </section>

            <section className="sb-card">
              <h3>Cùng hoạt chất, cùng đường dùng <span>{subs.same.length}</span></h3>
              {subs.same.length ? <ul className="sb-list">{subs.same.map((x) => <Row key={x.id} x={x} />)}</ul> : <p className="sb-empty">Danh mục không có chế phẩm cùng hoạt chất và cùng đường dùng.</p>}
            </section>
            {subs.other.length > 0 && (
              <section className="sb-card">
                <h3>Cùng hoạt chất, khác đường dùng <span>{subs.other.length}</span></h3>
                <ul className="sb-list">{subs.other.map((x) => <Row key={x.id} x={x} />)}</ul>
              </section>
            )}

            <section className="sb-card sb-warn">
              <h3><ShieldAlert size={16} aria-hidden /> Trước khi thay chế phẩm</h3>
              <ul>
                <li>Đối chiếu hàm lượng, nồng độ và dạng bào chế; quy đổi liều khi hàm lượng khác.</li>
                <li>Dạng giải phóng kéo dài, bao tan trong ruột, hệ trị liệu qua da: không thay bằng dạng thông thường khi chưa điều chỉnh cách dùng.</li>
                <li>Thuốc phạm vi điều trị hẹp (digoxin, phenytoin, ciclosporin, tacrolimus, warfarin…), sinh phẩm và insulin: thay chế phẩm cần hội chẩn và theo dõi đáp ứng, nồng độ thuốc.</li>
                <li>Kiểm tra tá dược với người bệnh có tiền sử dị ứng.</li>
              </ul>
            </section>
          </>
        )}
      </div>
      <style>{`
        .sb { min-height: 100vh; background: #f4f7fa; }
        .sb-wrap { max-width: 980px; margin: 0 auto; padding: 22px 16px 96px; display: grid; gap: 14px; }
        .sb-eyebrow { margin: 0; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #087f89; }
        .sb h1 { margin: 4px 0 0; font-size: 28px; font-weight: 800; color: #0f2236; }
        .sb-sub { margin: 6px 0 0; font-size: 14.5px; line-height: 1.6; color: #4b6576; }
        .sb-card { background: #fff; border: 1px solid #e3eaf0; border-radius: 16px; padding: 16px 18px; box-shadow: 0 2px 12px rgba(16,36,62,.04); min-width: 0; }
        .sb-search { display: flex; align-items: center; gap: 8px; border: 1px solid #dbe6ed; border-radius: 12px; padding: 0 12px; color: #6b8293; }
        .sb-search:focus-within { border-color: #087f89; box-shadow: 0 0 0 3px rgba(8,127,137,.12); }
        .sb-search input { flex: 1; min-width: 0; border: 0; outline: 0; padding: 12px 0; font: inherit; font-size: 15px; background: none; }
        .sb-hits { list-style: none; margin: 10px 0 0; padding: 0; max-height: 360px; overflow-y: auto; display: grid; gap: 2px; }
        .sb-hits button { width: 100%; text-align: left; border: 0; background: none; border-radius: 10px; padding: 9px 10px; font: inherit; cursor: pointer; display: grid; gap: 2px; }
        .sb-hits button:hover { background: #f3f8fa; }
        .sb-hits strong { font-size: 14.5px; color: #10243e; } .sb-hits span { font-size: 13px; color: #4b6576; }
        .sb-hits em { font-style: normal; font-size: 12px; font-weight: 700; color: #087f89; }
        .sb-empty { margin: 8px 0 0; color: #6b8293; font-size: 14px; }
        .sb-label { margin: 0; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: #087f89; }
        .sb-current h2 { margin: 4px 0 2px; font-size: 22px; font-weight: 800; color: #0f2236; }
        .sb-ing { display: block; margin: 0; font-size: 13.5px; color: #33505f; }
        .sb-meta { display: block; margin: 2px 0 0; font-size: 13px; color: #4b6576; }
        .sb-mfr { display: block; font-size: 12px; color: #6b8293; }
        .sb-card h3 { margin: 0 0 8px; display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 800; color: #0b3a5b; }
        .sb-card h3 span { font-size: 12px; background: #e6f4f5; color: #087f89; border-radius: 999px; padding: 1px 8px; }
        .sb-list { list-style: none; margin: 0; padding: 0; display: grid; }
        .sb-row { display: flex; gap: 12px; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid #edf2f6; }
        .sb-row:first-child { border-top: 0; }
        .sb-row-main { min-width: 0; display: grid; gap: 2px; } .sb-row-main strong { font-size: 14.5px; color: #10243e; }
        .sb-row-act { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
        .sb-row-act button { border: 1px solid #cfe0e6; background: #fff; border-radius: 8px; padding: 5px 10px; font: inherit; font-size: 12.5px; font-weight: 700; color: #0b3a5b; cursor: pointer; }
        .sb-row-act a { display: inline-flex; align-items: center; gap: 2px; font-size: 12.5px; font-weight: 700; color: #087f89; text-decoration: none; }
        .sb-warn { background: #fffaf0; border-color: #f3e2bd; }
        .sb-warn h3 { color: #8a5a00; }
        .sb-warn ul { margin: 0; padding-left: 18px; display: grid; gap: 5px; font-size: 13.5px; line-height: 1.55; color: #5c4a1e; }
        @media (max-width: 700px) {
          .sb h1 { font-size: 24px; }
          .sb-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}
