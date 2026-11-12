"use client";

/*
  Module "Hieu chinh lieu" theo chuc nang than: moi thuoc trong danh muc BV199 co huong dan trong
  Duoc thu quoc gia VN 2023 + khang sinh uu tien quan ly theo QD 5631/QD-BYT.
  - Thuoc co bang lieu theo CrCl (data/renal-dosing.ts): tu chon muc lieu theo CrCl.
  - Moi thuoc: nguyen van Duoc thu + anh cat trang goc (bang giu nguyen nhu sach). Khong tu suy ra lieu.
*/
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AlertOctagon, BookOpen, Calculator, ChevronRight, FileWarning, Search, ShieldAlert, Table2, X } from "lucide-react";

import BackBar from "@/components/antibiotics/links/BackBar";
import { renalDosingDatabase, type RenalDoseProfile, type RenalDoseRange } from "@/data/renal-dosing";
import {
  calculateAdjBW, calculateCrClCG, calculateIBW, convertCreatinineToMgDl, roundNumber,
  type CreatinineUnit, type Sex,
} from "@/lib/calculations/renal";
import type { DoseEntry, DoseGroup } from "@/lib/dosing/catalog";

type UrlParams = { get(name: string): string | null };

const GROUPS: { id: DoseGroup | "all"; label: string; short: string }[] = [
  { id: "all", label: "Tất cả", short: "Tất cả" },
  { id: "ks-n1", label: "Kháng sinh cần hội chẩn – Nhóm 1 (QĐ 5631)", short: "KS hội chẩn (N1)" },
  { id: "ks-n2", label: "Kháng sinh cần giám sát – Nhóm 2 (QĐ 5631)", short: "KS giám sát (N2)" },
  { id: "khang-sinh", label: "Kháng sinh, kháng nấm, kháng virus khác", short: "Kháng sinh khác" },
  { id: "thuoc-khac", label: "Thuốc khác", short: "Thuốc khác" },
];
const GROUP_TONE: Record<DoseGroup, string> = { "ks-n1": "g-red", "ks-n2": "g-amber", "khang-sinh": "g-teal", "thuoc-khac": "g-blue" };

const norm = (s?: string | null) => (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase().trim();

function matchesRange(crcl: number, r: RenalDoseRange) {
  if (r.minCrCl !== undefined && (r.minInclusive === false ? crcl <= r.minCrCl : crcl < r.minCrCl)) return false;
  if (r.maxCrCl !== undefined && (r.maxInclusive === false ? crcl >= r.maxCrCl : crcl > r.maxCrCl)) return false;
  return true;
}

function stage(crcl: number) {
  if (crcl >= 90) return { label: "Bình thường (≥ 90)", tone: "s-ok" };
  if (crcl >= 60) return { label: "Giảm nhẹ (60–89)", tone: "s-ok" };
  if (crcl >= 30) return { label: "Giảm trung bình (30–59)", tone: "s-mid" };
  if (crcl >= 15) return { label: "Giảm nặng (15–29)", tone: "s-bad" };
  return { label: "Suy thận giai đoạn cuối (< 15)", tone: "s-bad" };
}

export default function DoseAdjustModule({ entries, params, source, note }: { entries: DoseEntry[]; params: UrlParams; source: string; note: string }) {
  const from = params.get("from");
  const fromLabel = params.get("fromLabel");
  const requested = params.get("drug");
  const initial = entries.find((e) => e.profileId === requested || e.key === requested);

  const [group, setGroup] = useState<DoseGroup | "all">(initial ? initial.group : "all");
  const [q, setQ] = useState("");
  const [selKey, setSelKey] = useState(initial?.key ?? "");
  const [indication, setIndication] = useState(params.get("indication") ?? "");
  const detailRef = useRef<HTMLDivElement>(null);

  /* Chuc nang than */
  const [mode, setMode] = useState<"direct" | "calc">("direct");
  const [crclInput, setCrclInput] = useState(() => {
    const v = Number(params.get("crcl"));
    return params.get("crcl") && Number.isFinite(v) && v >= 0 ? String(v) : "";
  });
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [scr, setScr] = useState("");
  const [scrUnit, setScrUnit] = useState<CreatinineUnit>("µmol/L");

  const calc = useMemo(() => {
    const a = Number(age), w = Number(weight), h = Number(height), s = Number(scr);
    if (!(a > 0 && w > 0 && h > 0 && s > 0)) return null;
    if (a < 18) return { blocked: "Dưới 18 tuổi: không dùng Cockcroft-Gault." } as const;
    if (a >= 140) return { blocked: "Tuổi ngoài miền xác định của công thức." } as const;
    const ibw = calculateIBW(sex, h);
    if (!(ibw > 0)) return { blocked: "Chiều cao quá thấp để tính IBW – nhập CrCl trực tiếp." } as const;
    let used = w, method = "cân nặng thực tế";
    if (w > ibw * 1.2) { used = calculateAdjBW(w, ibw); method = "cân nặng hiệu chỉnh (AdjBW)"; }
    else if (w > ibw) { used = ibw; method = "cân nặng lý tưởng (IBW)"; }
    const crcl = calculateCrClCG(a, used, convertCreatinineToMgDl(s, scrUnit), sex);
    if (!(crcl > 0) || !Number.isFinite(crcl)) return { blocked: "Không tính được CrCl hợp lệ – kiểm tra lại." } as const;
    return { blocked: undefined, crcl, method, used, ibw };
  }, [age, weight, height, scr, scrUnit, sex]);

  const crcl = useMemo(() => {
    if (mode === "calc") return calc && !calc.blocked ? calc.crcl : null;
    const n = Number(crclInput);
    return crclInput.trim() !== "" && Number.isFinite(n) && n >= 0 ? n : null;
  }, [mode, calc, crclInput]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: entries.length };
    for (const e of entries) c[e.group] = (c[e.group] ?? 0) + 1;
    return c;
  }, [entries]);

  const list = useMemo(() => {
    const k = norm(q);
    return entries.filter((e) => (group === "all" || e.group === group) && (!k || e.search.includes(k)));
  }, [entries, group, q]);

  const sel = entries.find((e) => e.key === selKey);
  const profiles: RenalDoseProfile[] = sel?.profileId ? renalDosingDatabase.filter((p) => p.ingredientId === sel.profileId) : [];
  const profile = profiles.find((p) => p.indicationId === indication) ?? profiles[0];
  const range = profile && crcl !== null ? profile.ranges.find((r) => matchesRange(crcl, r)) : undefined;

  function pick(key: string) {
    setSelKey(key);
    setIndication("");
    requestAnimationFrame(() => {
      if (window.innerWidth < 1024) detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <main className="da">
      <div className="da-wrap">
        {from && <BackBar from={from} fromLabel={fromLabel} fallbackHref="/" fallbackLabel="Trang chủ" links={[]} />}

        <header className="da-head">
          <p className="da-eyebrow">Tối ưu điều trị</p>
          <h1>Hiệu chỉnh liều</h1>
          <p className="da-sub">
            Theo chức năng thận – <strong>Dược thư quốc gia Việt Nam 2023</strong> và danh mục kháng sinh ưu tiên quản lý theo{" "}
            <strong>QĐ 5631/QĐ-BYT</strong>. Trích nguyên văn, kèm ảnh bảng liều từ trang gốc.
          </p>
        </header>

        {/* 1. Chuc nang than */}
        <section className="da-card da-renal" aria-label="Chức năng thận">
          <div className="da-renal-top">
            <h2><Calculator size={18} aria-hidden /> Chức năng thận</h2>
            <div className="da-seg" role="tablist">
              <button type="button" role="tab" aria-selected={mode === "direct"} className={mode === "direct" ? "on" : ""} onClick={() => setMode("direct")}>Nhập CrCl</button>
              <button type="button" role="tab" aria-selected={mode === "calc"} className={mode === "calc" ? "on" : ""} onClick={() => setMode("calc")}>Tính Cockcroft-Gault</button>
            </div>
          </div>

          {mode === "direct" ? (
            <label className="da-field da-crcl">
              <span>CrCl (mL/phút)</span>
              <input type="number" inputMode="decimal" min={0} value={crclInput} onChange={(e) => setCrclInput(e.target.value)} placeholder="Ví dụ: 45" />
            </label>
          ) : (
            <div className="da-calc">
              <label className="da-field"><span>Tuổi</span><input type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} /></label>
              <label className="da-field"><span>Giới</span>
                <select value={sex} onChange={(e) => setSex(e.target.value as Sex)}><option value="male">Nam</option><option value="female">Nữ</option></select>
              </label>
              <label className="da-field"><span>Cân nặng (kg)</span><input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
              <label className="da-field"><span>Chiều cao (cm)</span><input type="number" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} /></label>
              <label className="da-field"><span>Creatinin</span><input type="number" inputMode="decimal" value={scr} onChange={(e) => setScr(e.target.value)} /></label>
              <label className="da-field"><span>Đơn vị</span>
                <select value={scrUnit} onChange={(e) => setScrUnit(e.target.value as CreatinineUnit)}><option value="µmol/L">µmol/L</option><option value="mg/dL">mg/dL</option></select>
              </label>
              {calc?.blocked && <p className="da-warn">{calc.blocked}</p>}
              {calc && !calc.blocked && <p className="da-hint">Dùng {calc.method} {roundNumber(calc.used, 1)} kg (IBW {roundNumber(calc.ibw, 1)} kg).</p>}
            </div>
          )}

          <div className={`da-result ${crcl !== null ? stage(crcl).tone : ""}`}>
            {crcl !== null ? (
              <>
                <span className="da-result-n">{roundNumber(crcl, 1)}</span>
                <span className="da-result-u">mL/phút</span>
                <span className="da-result-s">{stage(crcl).label}</span>
              </>
            ) : (
              <span className="da-result-e">Nhập CrCl để chọn sẵn mức liều cho các thuốc có bảng theo CrCl.</span>
            )}
          </div>
          <p className="da-foot">Cockcroft-Gault chỉ dùng cho người lớn, creatinin ổn định. AKI, lọc máu, người bệnh nặng: đánh giá lâm sàng riêng.</p>
        </section>

        <div className="da-grid">
          {/* 2. Danh sach thuoc */}
          <section className="da-card da-list" aria-label="Danh sách thuốc">
            <div className="da-tabs">
              {GROUPS.map((g) => (
                <button key={g.id} type="button" className={`da-tab ${g.id !== "all" ? GROUP_TONE[g.id] : ""} ${group === g.id ? "on" : ""}`} onClick={() => setGroup(g.id)} title={g.label}>
                  {g.short} <span>{counts[g.id] ?? 0}</span>
                </button>
              ))}
            </div>
            <label className="da-search">
              <Search size={16} aria-hidden />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm hoạt chất…" aria-label="Tìm hoạt chất" />
              {q && <button type="button" onClick={() => setQ("")} aria-label="Xóa"><X size={15} /></button>}
            </label>
            {group !== "all" && <p className="da-group-note">{GROUPS.find((g) => g.id === group)?.label}</p>}
            <ul className="da-items">
              {list.map((e) => (
                <li key={e.key}>
                  <button type="button" className={`da-item ${selKey === e.key ? "on" : ""}`} onClick={() => pick(e.key)}>
                    <span className={`da-dot ${GROUP_TONE[e.group]}`} aria-hidden />
                    <span className="da-item-main">
                      <span className="da-item-name">{e.name}</span>
                      <span className="da-badges">
                        {e.profileId && <span className="b-calc">Bảng CrCl</span>}
                        {e.dtqg?.contraindications.length ? <span className="b-ci">CCĐ suy thận</span> : null}
                        {e.dtqg?.noAdjust && <span className="b-ok">Không cần HC</span>}
                        {e.outside && <span className="b-out">Ngoài Dược thư</span>}
                        {e.dtqg?.noRenalText && !e.profileId && <span className="b-out">Không nêu HC thận</span>}
                      </span>
                    </span>
                    <ChevronRight size={16} aria-hidden />
                  </button>
                </li>
              ))}
              {!list.length && <li className="da-empty">Không có thuốc phù hợp.</li>}
            </ul>
          </section>

          {/* 3. Chi tiet */}
          <div ref={detailRef} className="da-detail">
            {!sel ? (
              <section className="da-card da-placeholder">
                <BookOpen size={28} aria-hidden />
                <p>Chọn một thuốc để xem hướng dẫn hiệu chỉnh liều.</p>
              </section>
            ) : (
              <Detail entry={sel} profiles={profiles} profile={profile} range={range} crcl={crcl} indication={profile?.indicationId ?? ""} setIndication={setIndication} source={source} note={note} />
            )}
          </div>
        </div>
      </div>
      <Styles />
    </main>
  );
}

function Detail({ entry, profiles, profile, range, crcl, setIndication, source, note }: {
  entry: DoseEntry; profiles: RenalDoseProfile[]; profile?: RenalDoseProfile; range?: RenalDoseRange; crcl: number | null;
  indication: string; setIndication: (v: string) => void; source: string; note: string;
}) {
  const d = entry.dtqg;
  const [zoom, setZoom] = useState<string | null>(null);

  return (
    <article className="da-card da-doc">
      <header className="da-doc-h">
        <span className={`da-pill ${GROUP_TONE[entry.group]}`}>{GROUPS.find((g) => g.id === entry.group)?.short}</span>
        <h2>{entry.name}</h2>
        {entry.inn && entry.inn !== entry.name && <p className="da-inn">{entry.inn}</p>}
        {entry.formulary.count > 0 && entry.formulary.sampleId && (
          <p className="da-inn">
            {entry.formulary.count} chế phẩm trong danh mục BV199 ·{" "}
            <Link href={`/drugs/${encodeURIComponent(entry.formulary.sampleId)}`}>Xem thông tin thuốc ({entry.formulary.sampleName})</Link>
          </p>
        )}
      </header>

      {/* Ket qua theo CrCl (thuoc co bang) */}
      {profile && (
        <section className="da-sec">
          <h3><Table2 size={17} aria-hidden /> Liều theo CrCl</h3>
          {profiles.length > 1 && (
            <label className="da-field da-ind">
              <span>Chỉ định</span>
              <select value={profile.indicationId} onChange={(e) => setIndication(e.target.value)}>
                {profiles.map((p) => <option key={p.id} value={p.indicationId}>{p.indicationLabel}</option>)}
              </select>
            </label>
          )}
          {profile.ranges.length === 0 ? (
            <p className="da-muted">Nguồn không có bảng mức liều theo CrCl cho chỉ định này – xem nguyên văn Dược thư bên dưới.</p>
          ) : crcl === null ? (
            <p className="da-muted">Nhập CrCl ở trên để chọn sẵn mức liều.</p>
          ) : range ? (
            <div className="da-hit">
              <p className="da-hit-k">{range.label} · CrCl {roundNumber(crcl, 1)} mL/phút</p>
              <p className="da-hit-v">{range.dose} · {range.interval}</p>
              {range.note && <p className="da-hit-n">{range.note}</p>}
            </div>
          ) : (
            <p className="da-warn">Nguồn không có mức liều cho CrCl này – không tự suy ra; tra nguyên văn bên dưới.</p>
          )}
          {profile.ranges.length > 0 && <div className="da-table-wrap">
            <table className="da-table">
              <thead><tr><th>CrCl</th><th>Liều</th><th>Khoảng cách</th><th>Ghi chú</th></tr></thead>
              <tbody>
                {profile.ranges.map((r) => (
                  <tr key={r.label} className={r === range ? "hit" : ""}><td>{r.label}</td><td>{r.dose}</td><td>{r.interval}</td><td>{r.note ?? ""}</td></tr>
                ))}
              </tbody>
            </table>
          </div>}
          <p className="da-src">Liều chuẩn: {profile.normalDose} · {profile.normalInterval}{profile.route ? ` · ${profile.route}` : ""}. Nguồn: {profile.source.title} ({profile.source.year}){profile.source.page ? `, ${profile.source.page}` : ""}.</p>
        </section>
      )}

      {/* Chong chi dinh lien quan than */}
      {d && d.contraindications.length > 0 && (
        <section className="da-sec da-ci">
          <h3><AlertOctagon size={17} aria-hidden /> Chống chỉ định liên quan chức năng thận</h3>
          <ul>{d.contraindications.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>
      )}

      {/* Nguyen van Duoc thu */}
      {d && d.content.length > 0 && (
        <section className="da-sec da-dt">
          <h3><BookOpen size={17} aria-hidden /> Theo Dược thư quốc gia Việt Nam 2023</h3>
          {d.noAdjust && <p className="da-okline">Dược thư ghi: không cần hiệu chỉnh liều theo chức năng thận.</p>}
          <div className="da-prose">
            {d.content.map((b, i) => {
              if (b.t === "p") {
                return (
                  <p key={i} className={b.head ? "da-dt-h" : undefined}>
                    {b.runs.map((r, k) => {
                      const el = r.b && r.i ? <strong><em>{r.text}</em></strong> : r.b ? <strong>{r.text}</strong> : r.i ? <em>{r.text}</em> : r.text;
                      return <span key={k}>{el}</span>;
                    })}
                  </p>
                );
              }
              if (b.t === "img") {
                return (
                  <figure key={i} className="da-formula">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.src} alt={`Công thức: ${b.alt}`} width={b.w} height={b.h} loading="lazy" />
                  </figure>
                );
              }
              const head = b.rows.length > 1 && b.rows[0].every((c) => c.b);
              return (
                <div key={i} className="da-table-wrap da-dt-table">
                  <table>
                    {head && (
                      <thead><tr>{b.rows[0].map((c, k) => <th key={k} rowSpan={c.rs} colSpan={c.cs}>{c.text}</th>)}</tr></thead>
                    )}
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
          </div>
          {d.clips.length > 0 && (
            <details className="da-clips da-clips-more">
              <summary>Đối chiếu trang gốc Dược thư ({d.clips.map((c) => `tr. ${c.printedPage}`).filter((v, i, a) => a.indexOf(v) === i).join(", ")})</summary>
              {d.clips.map((c) => (
                <button key={c.src} type="button" className="da-clip" onClick={() => setZoom(c.src)} aria-label={`Phóng to trang ${c.printedPage}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt={`Dược thư quốc gia Việt Nam 2023, trang ${c.printedPage}`} width={c.w} height={c.h} loading="lazy" />
                  <span>Trang {c.printedPage}</span>
                </button>
              ))}
            </details>
          )}
        </section>
      )}

      {d && d.cautions.length > 0 && (
        <section className="da-sec da-caution">
          <h3><ShieldAlert size={17} aria-hidden /> Thận trọng (ngưỡng chức năng thận)</h3>
          <ul>{d.cautions.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>
      )}

      {d?.noRenalText && (
        <section className="da-sec da-outside">
          <h3><BookOpen size={17} aria-hidden /> Theo Dược thư quốc gia Việt Nam 2023</h3>
          <p>Chuyên luận {d.name} (trang {d.pages.printed[0]}–{d.pages.printed[1]}) không nêu hiệu chỉnh liều theo chức năng thận trong mục Liều lượng và cách dùng. Đối chiếu tờ HDSD của chế phẩm đang dùng.</p>
        </section>
      )}

      {entry.outside && (
        <section className="da-sec da-outside">
          <h3><FileWarning size={17} aria-hidden /> Ngoài Dược thư 2023</h3>
          <p>{entry.outside}</p>
        </section>
      )}

      {!d && !profile && !entry.outside && <p className="da-muted">Chưa có dữ liệu hiệu chỉnh liều.</p>}

      <footer className="da-doc-f">
        {d && <p><strong>Nguồn:</strong> {source}, chuyên luận {d.name}, trang {d.pages.printed[0]}–{d.pages.printed[1]}.</p>}
        <p><strong>Trạng thái:</strong> {note}</p>
      </footer>

      {zoom && (
        <div className="da-zoom" role="dialog" aria-modal="true" onClick={() => setZoom(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="Trang Dược thư phóng to" />
          <button type="button" aria-label="Đóng" onClick={() => setZoom(null)}><X size={20} /></button>
        </div>
      )}
    </article>
  );
}

function Styles() {
  return (
    <style>{`
      .da { min-height: 100vh; background: #f4f7fa; }
      .da-wrap { max-width: 1180px; margin: 0 auto; padding: 22px 16px 48px; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); }
      .da-head h1 { margin: 4px 0 0; font-size: 28px; font-weight: 800; color: #0f2236; }
      .da-eyebrow { margin: 0; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #087f89; }
      .da-sub { margin: 6px 0 0; max-width: 820px; font-size: 14.5px; line-height: 1.6; color: #4b6576; }
      .da-card { background: #fff; border: 1px solid #e3eaf0; border-radius: 18px; padding: 18px 20px; box-shadow: 0 2px 12px rgba(16,36,62,.04); min-width: 0; }
      .da-card h2 { margin: 0; display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 800; color: #10243e; }

      .da-renal { display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr) 260px; align-items: start; }
      .da-renal-top { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
      .da-seg { display: inline-flex; background: #eef3f7; border-radius: 10px; padding: 3px; }
      .da-seg button { border: 0; background: none; padding: 7px 12px; border-radius: 8px; font: inherit; font-size: 13px; font-weight: 700; color: #4b6576; cursor: pointer; }
      .da-seg button.on { background: #fff; color: #0b3a5b; box-shadow: 0 1px 3px rgba(16,36,62,.12); }
      .da-field { display: grid; gap: 4px; font-size: 12.5px; font-weight: 700; color: #4b6576; }
      .da-field input, .da-field select { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #cdd9e2; border-radius: 10px; font: inherit; font-size: 15px; color: #10243e; background: #fff; }
      .da-field input:focus, .da-field select:focus { outline: 3px solid rgba(8,127,137,.25); border-color: #087f89; }
      .da-crcl { max-width: 260px; }
      .da-calc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
      .da-calc .da-warn, .da-calc .da-hint { grid-column: 1 / -1; margin: 0; }
      .da-hint { font-size: 12.5px; color: #4b6576; }
      .da-result { grid-row: 2 / span 2; grid-column: 2; align-self: stretch; display: grid; align-content: center; justify-items: center; gap: 2px; border-radius: 14px; padding: 14px; background: #f4f7fa; border: 1px dashed #cdd9e2; text-align: center; }
      .da-result-n { font-size: 34px; font-weight: 800; line-height: 1; color: #0f2236; }
      .da-result-u { font-size: 12px; font-weight: 700; color: #6b8293; }
      .da-result-s { margin-top: 6px; font-size: 13px; font-weight: 800; }
      .da-result-e { font-size: 13px; color: #6b8293; }
      .da-result.s-ok { background: #e9f7f0; border: 1px solid #b7e2cb; } .da-result.s-ok .da-result-s { color: #12623c; }
      .da-result.s-mid { background: #fff6e5; border: 1px solid #f1d48a; } .da-result.s-mid .da-result-s { color: #8a5300; }
      .da-result.s-bad { background: #fdecea; border: 1px solid #f3c2bc; } .da-result.s-bad .da-result-s { color: #a61b1b; }
      .da-foot { grid-column: 1; margin: 0; font-size: 12px; color: #7a8fa0; }

      .da-grid { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 16px; align-items: start; }
      .da-list { position: sticky; top: 12px; padding: 14px; display: grid; gap: 10px; max-height: calc(100vh - 24px); grid-template-rows: auto auto auto minmax(0, 1fr); }
      .da-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
      .da-tab { --c: #36506a; --cb: #eef3f7; border: 1px solid transparent; background: var(--cb); color: var(--c); border-radius: 999px; padding: 5px 10px; font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; }
      .da-tab span { margin-left: 2px; opacity: .7; font-weight: 800; }
      .da-tab.on { border-color: var(--c); box-shadow: inset 0 0 0 1px var(--c); }
      .g-red { --c: #a61b1b; --cb: #fdecea; } .g-amber { --c: #8a5300; --cb: #fff4dc; } .g-teal { --c: #066b73; --cb: #e3f4f4; } .g-blue { --c: #1d4f8f; --cb: #e8f0fb; }
      .da-search { display: flex; align-items: center; gap: 8px; border: 1px solid #cdd9e2; border-radius: 10px; padding: 0 10px; color: #6b8293; }
      .da-search input { flex: 1; border: 0; padding: 10px 0; font: inherit; font-size: 14.5px; outline: none; min-width: 0; }
      .da-search button { border: 0; background: none; color: #6b8293; cursor: pointer; display: grid; }
      .da-group-note { margin: 0; font-size: 12px; color: #6b8293; }
      .da-items { list-style: none; margin: 0; padding: 0; overflow-y: auto; display: grid; gap: 2px; align-content: start; }
      .da-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 9px 10px; border: 0; border-radius: 10px; background: none; font: inherit; text-align: left; cursor: pointer; color: #9aabb8; }
      .da-item:hover { background: #f4f7fa; }
      .da-item.on { background: #e8f4f6; color: #087f89; }
      .da-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c); flex: 0 0 auto; }
      .da-item-main { flex: 1; min-width: 0; display: grid; gap: 3px; }
      .da-item-name { font-size: 14.5px; font-weight: 700; color: #10243e; }
      .da-badges { display: flex; flex-wrap: wrap; gap: 4px; }
      .da-badges span { font-size: 10.5px; font-weight: 800; border-radius: 6px; padding: 1px 6px; }
      .b-calc { background: #e3f4f4; color: #066b73; } .b-ci { background: #fdecea; color: #a61b1b; } .b-ok { background: #e9f7f0; color: #12623c; } .b-out { background: #eef1f4; color: #52667a; }
      .da-empty { padding: 14px; text-align: center; color: #6b8293; font-size: 14px; }

      .da-detail { min-width: 0; scroll-margin-top: 12px; }
      .da-placeholder { display: grid; place-items: center; gap: 8px; min-height: 260px; color: #8aa0b0; text-align: center; }
      .da-doc { display: grid; gap: 16px; }
      .da-doc-h h2 { font-size: 24px; margin-top: 8px; }
      .da-pill { display: inline-block; border-radius: 999px; padding: 4px 10px; font-size: 12px; font-weight: 800; background: var(--cb); color: var(--c); }
      .da-inn { margin: 4px 0 0; font-size: 13.5px; color: #6b8293; }
      .da-inn a { color: #087f89; font-weight: 700; text-decoration: underline; }
      .da-sec { border: 1px solid #e6edf2; border-radius: 14px; padding: 14px 16px; }
      .da-sec h3 { margin: 0 0 10px; display: flex; align-items: center; gap: 8px; font-size: 15.5px; font-weight: 800; color: #0b3a5b; }
      .da-ind { max-width: 520px; margin-bottom: 10px; }
      .da-hit { border-radius: 12px; background: linear-gradient(135deg, #e3f4f4, #f2fafa); border: 1px solid #9fd3d6; padding: 12px 14px; margin-bottom: 12px; }
      .da-hit-k { margin: 0; font-size: 12px; font-weight: 800; letter-spacing: .03em; text-transform: uppercase; color: #066b73; }
      .da-hit-v { margin: 4px 0 0; font-size: 20px; font-weight: 800; color: #0f2236; }
      .da-hit-n { margin: 4px 0 0; font-size: 13.5px; color: #36506a; }
      .da-table-wrap { overflow-x: auto; }
      .da-table { width: 100%; min-width: 460px; border-collapse: collapse; font-size: 14px; }
      .da-table th { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .03em; color: #6b8293; background: #f4f7fa; padding: 8px 10px; }
      .da-table td { padding: 9px 10px; border-top: 1px solid #edf2f6; color: #1f3347; vertical-align: top; }
      .da-table tr.hit td { background: #e3f4f4; font-weight: 700; }
      .da-src { margin: 10px 0 0; font-size: 12.5px; color: #6b8293; }
      .da-ci { border-color: #f3c2bc; background: #fff8f7; }
      .da-ci h3 { color: #a61b1b; }
      .da-caution { border-color: #f1d48a; background: #fffbf0; }
      .da-caution h3 { color: #8a5300; }
      .da-ci ul, .da-caution ul { margin: 0; padding-left: 18px; display: grid; gap: 6px; font-size: 14.5px; line-height: 1.65; color: #24384c; }
      .da-outside { background: #f4f7fa; }
      .da-outside p { margin: 0; font-size: 14.5px; line-height: 1.6; }
      .da-okline { margin: 0 0 10px; border-radius: 10px; background: #e9f7f0; color: #12623c; font-weight: 700; font-size: 13.5px; padding: 8px 12px; }
      .da-prose { display: grid; gap: 10px; }
      .da-prose p { margin: 0; font-size: 15px; line-height: 1.7; color: #24384c; text-align: left; }
      .da-prose strong { color: #0f2236; }
      .da-prose .da-dt-h { margin-top: 6px; padding-left: 10px; border-left: 3px solid #087f89; font-size: 15.5px; font-weight: 700; color: #0b3a5b; }
      .da-prose .da-dt-h:first-child { margin-top: 0; }
      .da-prose em { color: #0b3a5b; }
      .da-formula { margin: 2px 0; padding: 10px 12px; border: 1px solid #e6edf2; border-radius: 10px; background: #fbfcfd; overflow-x: auto; }
      .da-formula img { display: block; max-width: 100%; height: auto; }
      .da-dt-table { border: 1px solid #d9e3ea; border-radius: 12px; overflow: hidden; overflow-x: auto; }
      .da-dt-table table { width: 100%; border-collapse: collapse; font-size: 14.5px; }
      .da-dt-table th { background: #eef4f8; color: #10243e; font-weight: 800; text-align: center; vertical-align: middle; padding: 9px 12px; border: 1px solid #d9e3ea; line-height: 1.45; }
      .da-dt-table td { padding: 8px 12px; border: 1px solid #e3eaf0; color: #1f3347; vertical-align: middle; text-align: center; line-height: 1.55; }
      .da-dt-table td.b { font-weight: 700; }
      .da-dt-table td:first-child { background: #fafcfd; }
      .da-dt-table tbody tr:hover td { background: #f3f9fa; }
      .da-dt-table .ln { display: block; }
      .da-dt-table .ln + .ln { margin-top: 2px; }
      .da-clips { margin-top: 10px; display: grid; gap: 10px; }
      .da-clips-more summary { cursor: pointer; font-size: 13.5px; font-weight: 700; color: #087f89; margin-bottom: 8px; }
      .da-clips-more[open] { display: grid; gap: 10px; }
      .da-clips-t { margin: 0; font-size: 12.5px; font-weight: 700; color: #6b8293; }
      .da-clip { position: relative; display: block; width: 100%; max-width: 640px; padding: 0; border: 1px solid #dfe6ec; border-radius: 10px; overflow: hidden; background: #fff; cursor: zoom-in; }
      .da-clip img { display: block; width: 100%; height: auto; }
      .da-clip span { position: absolute; right: 8px; bottom: 8px; background: rgba(11,58,91,.85); color: #fff; font-size: 11.5px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
      .da-zoom { position: fixed; inset: 0; z-index: 6000; background: rgba(8,20,32,.85); display: grid; place-items: center; padding: 16px; overflow: auto; }
      .da-zoom img { max-width: min(980px, 100%); height: auto; background: #fff; border-radius: 8px; }
      .da-zoom button { position: fixed; top: 14px; right: 14px; width: 40px; height: 40px; border-radius: 50%; border: 0; background: #fff; display: grid; place-items: center; cursor: pointer; }
      .da-muted { margin: 0; color: #6b8293; font-size: 14px; }
      .da-warn { margin: 0; border-radius: 10px; background: #fdecea; color: #8f1d1d; padding: 8px 12px; font-size: 13.5px; }
      .da-doc-f { border-top: 1px solid #edf2f6; padding-top: 10px; font-size: 12.5px; line-height: 1.6; color: #6b8293; }
      .da-doc-f p { margin: 0; }
      .da :is(button, input, select, a):focus-visible { outline: 3px solid #087f89; outline-offset: 2px; }

      @media (max-width: 1023px) {
        .da-grid { grid-template-columns: minmax(0, 1fr); }
        .da-list { position: static; max-height: 520px; }
      }
      @media (max-width: 640px) {
        .da-wrap { padding: 14px 12px 40px; gap: 12px; }
        .da-head h1 { font-size: 23px; }
        .da-card { padding: 14px; border-radius: 14px; }
        .da-renal { grid-template-columns: minmax(0, 1fr); }
        .da-result { grid-row: auto; grid-column: 1; }
        .da-crcl { max-width: none; }
        .da-calc { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .da-doc-h h2 { font-size: 21px; }
      }
    `}</style>
  );
}
