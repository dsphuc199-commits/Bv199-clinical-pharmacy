"use client";

import { Fragment, useMemo, useState } from "react";
import { BookOpen, Info, Search, Pill } from "lucide-react";
import {
  ASHP_DOSES, ASHP_DOSE_FOOTNOTES, ASHP_REGIMENS, ASHP_TABLE2_FOOTNOTES,
  ASHP_PRINCIPLES, ASHP_WOUND_CLASSES, ASHP_URL, type AshpRegimen, type AshpDose
} from "@/data/antibiotics/prophylaxis-ashp2013";

function norm(s: string) {
  return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
}

const SRC = "ASHP/IDSA/SIS/SHEA 2013 – Clinical Practice Guidelines for Antimicrobial Prophylaxis in Surgery";

const groups = ["Tất cả", ...Array.from(new Set(ASHP_REGIMENS.map(r => r.group)))];

/** Chữ chú thích trong ngoặc, vd. "(d)", "(h, i, j)" */
function lettersIn(text: string) {
  const out: string[] = [];
  for (const m of text.matchAll(/\(([a-t](?:,\s*[a-t])*)\)/g)) out.push(...m[1].split(/,\s*/));
  return out;
}

function regimenFootnotes(r: AshpRegimen) {
  const set = new Set<string>(["a", "b", "c", ...(r.nameFn || []), ...lettersIn(r.primary), ...lettersIn(r.alternative)]);
  return Array.from(set).sort();
}

/** Thuốc ở Bảng 1 xuất hiện trong phác đồ */
function dosesFor(text: string, colorectal: boolean): AshpDose[] {
  let t = norm(text);
  const hits: AshpDose[] = [];
  const parenteral = ASHP_DOSES.filter(d => !d.oral).sort((a, b) => b.drug.length - a.drug.length);
  for (const d of parenteral) {
    const key = norm(d.drug);
    if (t.includes(key)) { hits.push(d); t = t.split(key).join(" "); }
  }
  const add = (name: string) => {
    const d = ASHP_DOSES.find(x => x.drug === name);
    if (d && !hits.includes(d)) hits.push(d);
  };
  if (t.includes("aminoglycosid")) add("Gentamicin");
  if (t.includes("fluoroquinolon")) { add("Ciprofloxacin"); add("Levofloxacin"); }
  if (colorectal) ASHP_DOSES.filter(d => d.oral).forEach(d => hits.push(d));
  return hits;
}

export default function KsdpIntl() {
  const [view, setView] = useState<"pick" | "t2" | "t1" | "principles">("pick");
  const [group, setGroup] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [id, setId] = useState("");
  const [allergy, setAllergy] = useState(false);

  const filtered = useMemo(() => ASHP_REGIMENS.filter(r =>
    (group === "Tất cả" || r.group === group) &&
    norm(r.group + " " + r.name).includes(norm(search))), [group, search]);
  const chosen = ASHP_REGIMENS.find(r => r.id === id);
  const regimen = chosen ? (allergy ? chosen.alternative : chosen.primary) : "";
  const doses = chosen && !chosen.none && chosen.id !== "op1" ? dosesFor(regimen, chosen.group === "Đại trực tràng" && !allergy) : [];

  return (
    <>
      <div className="ksdp-note" style={{ marginBottom: 16 }}>
        <Info size={17}/>
        <div className="ksdp-sources">
          <b>Nguồn</b>
          <ul>
            <li>Clinical Practice Guidelines for Antimicrobial Prophylaxis in Surgery – ASHP, IDSA, SIS, SHEA (2013)</li>
            <li>Bratzler DW và cs. Am J Health-Syst Pharm. 2013;70:195–283</li>
          </ul>
        </div>
      </div>

      <div className="ksdp-subtabs">
        {([
          ["pick", "Tra cứu theo phẫu thuật"],
          ["t2", "Bảng khuyến cáo"],
          ["t1", "Liều & nhắc liều"],
          ["principles", "Nguyên tắc chung"],
        ] as const).map(([k, l]) => (
          <button key={k} className={view === k ? "active" : ""} onClick={() => setView(k)}>{l}</button>
        ))}
      </div>

      {view === "pick" && (
        <>
          <section className="ksdp-panel">
            <div className="ksdp-grid two">
              <label>
                <span>Nhóm phẫu thuật</span>
                <select value={group} onChange={e => { setGroup(e.target.value); setId(""); }}>
                  {groups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </label>
              <label>
                <span>Tìm tên phẫu thuật</span>
                <div className="ksdp-search">
                  <Search size={17}/>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ví dụ: mổ lấy thai, thay khớp, đại trực tràng..."/>
                </div>
              </label>
            </div>
            <label className="ksdp-select-op">
              <span>Loại phẫu thuật / thủ thuật</span>
              <select value={id} onChange={e => setId(e.target.value)}>
                <option value="">-- Chọn loại phẫu thuật ({filtered.length} mục) --</option>
                {filtered.map(r => <option key={r.id} value={r.id}>{r.group} – {r.name}</option>)}
              </select>
            </label>
          </section>

          {chosen ? (
            <section className="ksdp-panel">
              <div className="ksdp-surgery">
                <b>{chosen.name}{chosen.nameFn?.length ? <sup className="ksdp-fn">{chosen.nameFn.join(",")}</sup> : null}</b>
                <small>{chosen.group} · Mức bằng chứng: {chosen.evidence}</small>
              </div>

              <div className="ksdp-grid two">
                <div className={`ksdp-choice${!allergy ? " on" : ""}`}>
                  <div className="ksdp-choice-label">Thuốc khuyến cáo</div>
                  <strong>{chosen.primary}</strong>
                </div>
                <div className={`ksdp-choice${allergy ? " on" : ""}`}>
                  <div className="ksdp-choice-label">Thay thế khi dị ứng beta-lactam</div>
                  <strong>{chosen.alternative}</strong>
                </div>
              </div>

              {!chosen.none && (
                <label className="ksdp-inline-check">
                  <input type="checkbox" checked={allergy} onChange={e => setAllergy(e.target.checked)}/>
                  Người bệnh dị ứng beta-lactam
                </label>
              )}

              {chosen.notes?.length ? (
                <div className="ksdp-note">
                  <Info size={17}/>
                  <ul className="ksdp-notes">
                    {chosen.notes.map((n, i) => (
                      <li key={i}>{n.text}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {doses.length > 0 && (
                <>
                  <h3 className="ksdp-subheading">Liều và khoảng nhắc liều</h3>
                  <div className="ksdp-dose-list">
                    {doses.map(d => (
                      <div key={d.drug} className="ksdp-dose-card">
                        <b>{d.drug}{d.fn?.length ? <sup className="ksdp-fn">{d.fn.join(",")}</sup> : null}</b>
                        <div><strong>Người lớn:</strong> {d.adult}</div>
                        <div><strong>Trẻ em:</strong> {d.peds}</div>
                        <div><strong>Thời gian bán thải (người lớn, thận bình thường):</strong> {d.halfLife} giờ</div>
                        <div><strong>Khoảng nhắc liều:</strong> {d.redose === "Không áp dụng" ? d.redose : `${d.redose} giờ`}</div>
                        {d.fn?.map(f => <small key={f} className="ksdp-fn-text"><sup>{f}</sup> {ASHP_DOSE_FOOTNOTES[f]}</small>)}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h3 className="ksdp-subheading">Chú thích áp dụng</h3>
              <ul className="ksdp-notes">
                {regimenFootnotes(chosen).map(f => <li key={f}><sup>{f}</sup> {ASHP_TABLE2_FOOTNOTES[f]}</li>)}
              </ul>

              <a className="ksdp-link" href={ASHP_URL} target="_blank" rel="noreferrer">
                <BookOpen size={16}/> Nguồn: {SRC}
              </a>
            </section>
          ) : (
            <div className="ksdp-empty">
              <Pill size={44}/>
              <h3>Chọn phẫu thuật để xem khuyến cáo quốc tế</h3>
              <p>{ASHP_REGIMENS.length} loại phẫu thuật, kèm liều, chú thích và khuyến cáo ở từng mục phẫu thuật.</p>
            </div>
          )}
        </>
      )}

      {view === "t2" && (
        <section className="ksdp-panel">
          <div className="ksdp-section-title"><span><BookOpen size={16}/></span><h2>Khuyến cáo kháng sinh dự phòng phẫu thuật</h2></div>
          <div className="ksdp-table-wrap">
            <table className="ksdp-table">
              <thead>
                <tr>
                  <th>Loại phẫu thuật</th>
                  <th>Thuốc khuyến cáo<sup>a,b</sup></th>
                  <th>Thay thế khi dị ứng beta-lactam</th>
                  <th>Mức bằng chứng<sup>c</sup></th>
                </tr>
              </thead>
              <tbody>
                {groups.slice(1).map(g => (
                  <Fragment key={g}>
                    <tr className="ksdp-group-row"><td colSpan={4}>{g}</td></tr>
                    {ASHP_REGIMENS.filter(r => r.group === g).map(r => (
                      <tr key={r.id}>
                        <td>{r.name}{r.nameFn?.length ? <sup className="ksdp-fn">{r.nameFn.join(",")}</sup> : null}</td>
                        <td className={r.none ? "ksdp-none" : ""}>{r.primary}</td>
                        <td className={r.none ? "ksdp-none" : ""}>{r.alternative}</td>
                        <td>{r.evidence}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="ksdp-subheading">Chú thích</h3>
          <ul className="ksdp-notes">
            {Object.entries(ASHP_TABLE2_FOOTNOTES).map(([k, v]) => <li key={k}><sup>{k}</sup> {v}</li>)}
          </ul>
        </section>
      )}

      {view === "t1" && (
        <section className="ksdp-panel">
          <div className="ksdp-section-title"><span><BookOpen size={16}/></span><h2>Liều khuyến cáo và khoảng nhắc liều</h2></div>
          <div className="ksdp-table-wrap">
            <table className="ksdp-table">
              <thead>
                <tr>
                  <th>Thuốc</th><th>Người lớn<sup>a</sup></th><th>Trẻ em<sup>b</sup></th>
                  <th>Thời gian bán thải người lớn, thận bình thường (giờ)</th>
                  <th>Khoảng nhắc liều tính từ lúc bắt đầu liều trước mổ (giờ)<sup>c</sup></th>
                </tr>
              </thead>
              <tbody>
                {ASHP_DOSES.map((d, i) => (
                  <Fragment key={d.drug}>
                    {d.oral && !ASHP_DOSES[i - 1]?.oral && (
                      <tr className="ksdp-group-row"><td colSpan={5}>Kháng sinh uống dự phòng phẫu thuật đại trực tràng (dùng cùng chuẩn bị ruột cơ học)</td></tr>
                    )}
                    <tr>
                      <td><b>{d.drug}</b>{d.fn?.length && d.drug !== "Cefotaxime" && d.drug !== "Ceftriaxone" ? <sup className="ksdp-fn">{d.fn.join(",")}</sup> : null}</td>
                      <td>{d.adult}{(d.drug === "Cefotaxime" || d.drug === "Ceftriaxone") && d.fn ? <sup className="ksdp-fn">{d.fn.join(",")}</sup> : null}</td>
                      <td>{d.peds}</td>
                      <td>{d.halfLife}</td>
                      <td>{d.redose}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="ksdp-subheading">Chú thích</h3>
          <ul className="ksdp-notes">
            {Object.entries(ASHP_DOSE_FOOTNOTES).map(([k, v]) => <li key={k}><sup>{k}</sup> {v}</li>)}
          </ul>
          <a className="ksdp-link" href={ASHP_URL} target="_blank" rel="noreferrer">
            <BookOpen size={16}/> Nguồn: {SRC}
          </a>
        </section>
      )}

      {view === "principles" && (
        <>
          <section className="ksdp-panel">
            <div className="ksdp-section-title"><span><BookOpen size={16}/></span><h2>Nguyên tắc chung</h2></div>
            {ASHP_PRINCIPLES.map(s => (
              <div key={s.title} className="ksdp-principle">
                <h3>{s.title}</h3>
                <ul>{s.items.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </div>
            ))}
          </section>
          <section className="ksdp-panel">
            <div className="ksdp-section-title"><span><BookOpen size={16}/></span><h2>Phân loại vết mổ (NHSN)</h2></div>
            <div className="ksdp-table-wrap">
              <table className="ksdp-table">
                <tbody>
                  {ASHP_WOUND_CLASSES.map(w => <tr key={w.name}><td><b>{w.name}</b></td><td>{w.text}</td></tr>)}
                </tbody>
              </table>
            </div>
            <a className="ksdp-link" href={ASHP_URL} target="_blank" rel="noreferrer">
              <BookOpen size={16}/> Nguồn: {SRC}
            </a>
          </section>
        </>
      )}
    </>
  );
}
