"use client";
/*
  Công cụ chọn kháng sinh Tai Mũi Họng trong tab Quốc tế – bố cục theo công cụ viêm phổi (khung sa24):
  khối Quyết định/Phác đồ/Thời gian/Hướng dẫn → nhóm Lựa chọn đầu tay / Phối hợp thêm / Thay thế khi dị ứng / Thất bại
  → bảng Thuốc | Liều – cách dùng | Mức khuyến cáo → nguồn ở cuối. Mọi dòng lấy từ dữ liệu có trích dẫn qua decide().
*/
import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Citation, Decision, Disease, Dose, Inputs } from "@/types/ent";
import { condTrue } from "@/lib/ent/decide";
import { buildView } from "@/lib/ent/view";
import { SOURCES, resolveDisease } from "@/data/ent";
import { RxToolStyle } from "@/components/antibiotics/empiric/rx-tool";
import { regimenSummary, visibleInputs } from "./QuickCard";
import { DTQG_ENT, DTQG_SOURCE, DISEASE_IND, dtqgFor, dtqgKeys } from "@/data/ent/dtqg-doses";

const POP_LABEL = { adult: "Người lớn", child: "Trẻ em" } as const;

/** Liều theo Dược thư quốc gia 2023 cho các thuốc đang hiển thị – trích nguyên văn, kèm số trang. */
function DtqgPanel({ diseaseId, doses, inp }: { diseaseId: string; doses: Dose[]; inp: Inputs }) {
  const ind = DISEASE_IND[diseaseId];
  if (!ind) return null;
  const age = inp.ageGroup as string | undefined;
  const popsOf = (d: Dose): ("adult" | "child")[] =>
    d.population === "adult" ? ["adult"] : d.population === "child" ? ["child"]
      : age === "adult" ? ["adult"] : age === "adolescent" ? ["child", "adult"] : age ? ["child"] : ["adult", "child"];
  const want = new Map<string, Set<"adult" | "child">>();
  for (const d of doses) for (const k of dtqgKeys(d.drug)) {
    if (!want.has(k)) want.set(k, new Set());
    for (const p of popsOf(d)) want.get(k)!.add(p);
  }
  const rows = [...want.entries()].map(([k, pops]) => ({
    k, name: DTQG_ENT[k].name,
    groups: (["adult", "child"] as const).filter((p) => pops.has(p)).map((p) => ({ p, items: dtqgFor(k, ind, p) })).filter((g) => g.items.length),
  })).filter((r) => r.groups.length);
  if (!rows.length) return null;
  return (
    <details className="sa24-more ent-dtqg" open>
      <summary>Liều theo Dược thư quốc gia Việt Nam 2023 ({rows.length} thuốc)</summary>
      {rows.map((r) => (
        <div key={r.k} className="ent-dtqg-drug">
          <p className="ent-dtqg-name">{r.name}</p>
          {r.groups.map((g) => (
            <div key={g.p}>
              {r.groups.length > 1 && <p className="ent-dtqg-pop">{POP_LABEL[g.p]}</p>}
              <ul>
                {g.items.map((e, i) => (
                  <li key={i} className={e.caution ? "ent-caution" : undefined}>
                    <b>{e.label}:</b> {e.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
      <p className="ent-sub">Nguồn: {DTQG_SOURCE}. Hiệu chỉnh liều theo chức năng thận: module Hiệu chỉnh liều.</p>
    </details>
  );
}

const DECISION: Record<Decision, string> = {
  antibiotic: "Chỉ định kháng sinh",
  antibiotic_or_observe: "Kháng sinh hoặc theo dõi chờ đợi – quyết định cùng người bệnh",
  antibiotic_or_refer: "Kháng sinh ngay hoặc chuyển chuyên khoa tai mũi họng",
  reassess_switch: "Đánh giá lại; xác nhận chẩn đoán thì đổi kháng sinh",
  no_antibiotic: "Không dùng kháng sinh",
  test_first: "Xét nghiệm trước khi quyết định",
  no_primary: "Dùng phác đồ tham khảo dưới đây",
};

const src = (id: string) => SOURCES.find((s) => s.id === id);
const short = (id: string) => { const s = src(id); return s ? `${s.org.replace(" (DailyMed)", "").replace("UCSF IDMP", "UCSF")} ${s.year}` : ""; };
/** Mức khuyến cáo viết gọn theo đúng nhãn của nguồn. */
function gradeText(d: Dose): string {
  const st = (d.strength ?? "").replace(/^Strong [Rr]ecommendation$/, "Mạnh").replace(/^Recommendation$/, "Khuyến cáo").replace(/^Option$/, "Tùy chọn").replace(/^[Ss]trong$/, "Mạnh").replace(/^weak$/, "Yếu");
  const q = (d.quality ?? "").replace(/^Grade /, "").replace(/^Evidence Quality: /, "").replace(/^high$/, "cao").replace(/^moderate$/, "TB").replace(/^low$/, "thấp");
  return [st, q].filter(Boolean).join(" · ");
}
const durationOf = (d: Dose, inp: Inputs) => d.durationBy?.find((b) => b.when.every((c) => condTrue(c, inp)))?.text ?? d.duration;
/** Vị trí trong nguồn, bỏ số trang (đã có trong trang đầy đủ). */
const loc = (l: string) => l.replace(/,?\s*tr\.\s*[A-Za-z]?\d+(–[A-Za-z]?\d+)?/g, "").replace(/\s*\(ảnh chụp[^)]*\)/g, "").replace(/;\s*;/g, ";").replace(/\s*;\s*$/, "").trim();

function Table({ doses, computed, inp, tag }: { doses: Dose[]; computed: { doseId: string; text: string }[]; inp: Inputs; tag?: (d: Dose) => string }) {
  return (
    <table className="sa24-rx has-dose ent-tab">
      <tbody>
        {doses.map((d) => {
          const calc = computed.find((c) => c.doseId === d.id)?.text;
          const dur = durationOf(d, inp);
          const g = gradeText(d);
          return (
            <tr key={d.id}>
              <th scope="row">{tag && <span className="ent-tag">{tag(d)}</span>}{d.drug}</th>
              <td className="sa24-dose">
                <b>{d.dose}</b>{d.interval ? `, ${d.interval}` : ""} · {d.route}{dur ? ` · ${dur}` : ""}
                {d.max && <div className="ent-sub">Tối đa {d.max}</div>}
                {calc && <div className="ent-calc">{calc}</div>}
                {d.caution && <div className="ent-caution">{d.caution}</div>}
                {d.link && <Link className="ent-link" href={d.link.href}>{d.link.label}</Link>}
              </td>
              <td className="sa24-gc">{g && <span className="sa24-g sa24-g-a">{g}</span>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Tách dòng thuốc theo từng hướng dẫn: mỗi hướng dẫn một bảng có tiêu đề, không trộn cách dùng giữa các khuyến cáo. */
function Grouped({ doses, order, computed, inp, lead, notes }: { doses: Dose[]; order: string[]; computed: { doseId: string; text: string }[]; inp: Inputs; lead: (n: number) => string; notes?: Record<string, string> }) {
  const ids = [...new Set(doses.map((x) => x.citation.sourceId))].sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99));
  return (
    <>
      {ids.length > 1 && <p className="ent-warn-mix">{ids.length} hướng dẫn có cách dùng khác nhau: chọn theo một bảng, không dùng lẫn liều giữa các bảng.</p>}
      {ids.map((sid) => {
        const g = doses.filter((x) => x.citation.sourceId === sid);
        return (
          <div key={sid} className="ent-grp">
            <p className="ent-grp-h">Theo {short(sid)}</p>
            {notes?.[sid] && <p className="ent-sub">{notes[sid]}</p>}
            <p className="ent-lead">{lead(g.length)}</p>
            <Table doses={g} computed={computed} inp={inp} />
          </div>
        );
      })}
    </>
  );
}

export default function EntRxTool({ id, population }: { id: string; population?: ReactNode }) {
  const res = resolveDisease(id);
  const d = res?.data as Disease;
  const [inp, setInp] = useState<Inputs>({});
  const set = (k: string, v: string | number | boolean | undefined) => setInp((p) => ({ ...p, [k]: v === "" ? undefined : v }));
  const v = useMemo(() => buildView(d, inp), [d, inp]);
  const { shown, eff } = useMemo(() => visibleInputs(d, inp), [d, inp]);
  if (!res) return null;

  const { r, missing, ready, previewLabel, firsts, adds, algs, fails, inlineCmp, cmp } = v;
  const noPrimary = d.primarySources.length === 0;
  const selects = shown.filter((s) => s.type !== "boolean");
  const checks = shown.filter((s) => s.type === "boolean");
  const main = [...firsts, ...adds, ...algs];
  const durs = [...new Set([...main, ...inlineCmp].map((x) => durationOf(x, eff)).filter(Boolean))];
  const flags = r.redFlags.filter((f) => f.status === "EXTRACTED" && (f.role === "primary" || noPrimary));
  const baseIsAlg = !firsts.length && algs.length > 0;
  const lead = (n: number, base: boolean) => (base && adds.length ? (n > 1 ? "Chọn một thuốc dưới đây, dùng cùng thuốc phối hợp thêm." : "Dùng cùng thuốc phối hợp thêm bên dưới.") : n > 1 ? "Đơn trị: chọn một thuốc dưới đây." : "Đơn trị.");
  const order = [...d.primarySources, ...(d.diagnosisSources ?? []), ...d.comparisonSources, ...d.referenceSources];
  const leadSrc = [...main, ...inlineCmp].map((x) => x.citation.sourceId).sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99))[0];
  const summaryRows = main.filter((x) => x.citation.sourceId === leadSrc || (x.choiceCitation && main.some((y) => y.citation.sourceId === leadSrc)));
  const G = (doses: Dose[], ld: (n: number) => string) => <Grouped doses={doses} order={order} computed={v.computed} inp={eff} lead={ld} notes={d.sourceNotes} />;
  const mono = (n: number) => (n > 1 ? "Đơn trị: chọn một thuốc dưới đây." : "Đơn trị.");

  // Nguồn ở cuối: chỉ các nguồn của nội dung đang hiển thị.
  const cites: Citation[] = [
    ...(r.decision && !noPrimary ? [r.decision.citation] : []),
    ...[...main, ...fails, ...inlineCmp].flatMap((x) => [x.citation, ...(x.choiceCitation ? [x.choiceCitation] : [])]),
    ...flags.map((f) => f.citation),
  ];
  const bySrc = new Map<string, Set<string>>();
  for (const c of cites) { if (!bySrc.has(c.sourceId)) bySrc.set(c.sourceId, new Set()); for (const part of loc(c.locator).split(/;s*/)) if (part.trim()) bySrc.get(c.sourceId)!.add(part.trim()); }

  return (
    <article className="sa24 ent-rx">
      <h3>{res.page.title}</h3>

      <div className="sa24-form">
        {population}
        {selects.map((s) => (
          <div className="sa24-row" key={s.field}>
            <div className="sa24-lab">{s.label}{s.unit ? ` (${s.unit})` : ""}</div>
            <div className="sa24-ctl">
              {s.type === "select" ? (
                <div className="sa24-seg" role="group" aria-label={s.label}>
                  {s.options!.map((o) => (
                    <button key={o.value} type="button" className={eff[s.field] === o.value ? "on" : undefined} aria-pressed={eff[s.field] === o.value} onClick={() => set(s.field, eff[s.field] === o.value ? undefined : o.value)}>{o.label}</button>
                  ))}
                </div>
              ) : (
                <input className="ent-num" type="number" inputMode="decimal" min={s.min} max={s.max} aria-label={s.label} value={(inp[s.field] as number | undefined) ?? ""} onChange={(e) => set(s.field, e.target.value === "" ? undefined : Number(e.target.value))} />
              )}
            </div>
          </div>
        ))}
        {checks.length > 0 && (
          <div className="sa24-row">
            <div className="sa24-lab">Yếu tố lâm sàng</div>
            <div className="sa24-ctl">
              {checks.map((s) => <label key={s.field} className="sa24-chk"><input type="checkbox" checked={inp[s.field] === true} onChange={(e) => set(s.field, e.target.checked ? true : undefined)} /> {s.label}</label>)}
            </div>
          </div>
        )}
      </div>
      {r.errors.length > 0 && <p className="sa24-warn">{r.errors.join("; ")}</p>}

      <section className="sa24-out" aria-live="polite">
        {!ready ? (
          <p className="ent-prompt">Chọn {missing.length ? missing.join(", ") : "các yếu tố ở trên"} để xem phác đồ.</p>
        ) : (
          <>
            <div className="sa24-dx">
              <p><b>Quyết định</b> {DECISION[r.decision!.value]}</p>
              {previewLabel && <p><b>Điều trị khi</b> {previewLabel.replace(/^Nếu /, "")} – phác đồ dưới đây</p>}
              {main.length > 0 && <p><b>Phác đồ</b> {regimenSummary(summaryRows.length ? summaryRows : main)}{new Set(main.map((x) => x.citation.sourceId)).size > 1 && !main.some((x) => x.choiceCitation) ? ` (theo ${short(leadSrc)})` : ""}</p>}
              {durs.length === 1 && <p><b>Thời gian</b> {durs[0]}</p>}
              <p><b>Hướng dẫn</b> {noPrimary ? `Không có hướng dẫn hội chuyên môn; tham khảo ${[...new Set(main.flatMap((x) => [...(x.choiceCitation ? [x.choiceCitation.sourceId] : []), x.citation.sourceId]))].map(short).join(", ") || "các nguồn bên dưới"}` : d.primarySources.filter((sid) => src(sid)?.access !== "paywalled").map(short).join("; ")}</p>
            </div>
            {firsts.length > 0 && (<><h4>Lựa chọn đầu tay</h4>{G(firsts, (n) => lead(n, true))}</>)}
            {baseIsAlg && (<><h4>Lựa chọn khi dị ứng beta-lactam</h4>{G(algs, (n) => lead(n, true))}</>)}
            {adds.length > 0 && (<><h4>Phối hợp thêm</h4>{G(adds, () => "Dùng đồng thời với thuốc đã chọn ở trên.")}</>)}
            {!baseIsAlg && algs.length > 0 && (<><h4>Thay thế khi dị ứng beta-lactam</h4>{G(algs, (n) => lead(n, false))}</>)}
            {inlineCmp.length > 0 && (<><h4>Phác đồ theo hướng dẫn đối chiếu</h4>{G(inlineCmp, mono)}</>)}
            {fails.length > 0 && (<><h4>Thất bại điều trị</h4>{G(fails, mono)}</>)}
            {!main.length && !fails.length && !inlineCmp.length && r.decision && !["no_antibiotic", "test_first"].includes(r.decision.value) && <p className="sa24-tip">{noPrimary && !d.doses.length ? "Không có hướng dẫn hội chuyên môn và phác đồ tham khảo cho đối tượng này trong các nguồn đã có." : "Không có thuốc phù hợp với lựa chọn hiện tại."}</p>}
          </>
        )}
        {flags.length > 0 && (<div className="ent-flags"><b>Chuyển tuyến/hội chẩn khi</b><ul>{flags.map((f) => <li key={f.id}>{f.text}</li>)}</ul></div>)}
      </section>

      {ready && <DtqgPanel diseaseId={res.page.id} doses={[...main, ...fails, ...inlineCmp]} inp={eff} />}

      {cmp.length > 0 && (
        <details className="sa24-more">
          <summary>Liều theo hướng dẫn khác ({cmp.length})</summary>
          {G(cmp, mono)}
        </details>
      )}

      <p className="sa24-src">
        Nguồn: {[...bySrc.entries()].map(([sid, ls]) => `${src(sid)?.title} (${short(sid)})${ls.size ? ` – ${[...ls].join("; ")}` : ""}`).join(". ")}{bySrc.size ? ". " : ""}
        Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt. <Link href={`/ent/${res.page.id}`}>Khuyến cáo đầy đủ</Link>
      </p>
      <RxToolStyle />
      <style>{`
        .ent-rx h3 { margin: 0; }
        .ent-rx .ent-num { width: 140px; border: 1px solid #cfdde6; border-radius: 10px; padding: 7px 10px; font: inherit; font-size: 13.5px; }
        .ent-rx .ent-prompt { margin: 0; font-size: 13.5px; color: #33505f; }
        .ent-rx .ent-lead { margin: 0; font-size: 13px; font-weight: 600; color: #0b6b3a; }
        .ent-rx .ent-tab th[scope=row] { width: 26%; color: #10243e; font-size: 13.5px; }
        .ent-rx .ent-tag { display: block; font-size: 11.5px; font-weight: 800; color: #087f89; }
        .ent-rx .ent-tab .sa24-dose { font-size: 13.5px; color: #10243e; }
        .ent-rx .ent-sub { font-size: 12.5px; color: #4b6576; }
        .ent-rx .ent-calc { font-size: 13px; color: #1d4f8a; font-weight: 800; }
        .ent-rx .ent-caution { font-size: 12.5px; color: #9a3412; font-weight: 600; }
        .ent-rx .ent-link { font-weight: 700; color: #087f89; font-size: 13px; }
        .ent-rx .sa24-gc .sa24-g { white-space: normal; }
        .ent-rx .ent-flags { border-top: 1px solid #dcebed; padding-top: 8px; font-size: 13px; color: #7c2d12; }
        .ent-rx .ent-flags ul { margin: 4px 0 0; padding-left: 18px; display: grid; gap: 4px; }
        .ent-rx .sa24-src a { color: #087f89; }
        .ent-rx .ent-warn-mix { margin: 0; font-size: 12.5px; font-weight: 700; color: #9a3412; }
        .ent-rx .ent-grp { display: grid; gap: 4px; margin-top: 4px; }
        .ent-rx .ent-grp + .ent-grp { margin-top: 10px; }
        .ent-rx .ent-dtqg ul { margin: 2px 0 6px; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; color: #10243e; }
        .ent-rx .ent-dtqg-drug { margin-top: 8px; }
        .ent-rx .ent-dtqg-name { margin: 0; font-weight: 800; font-size: 13.5px; color: #0b3a5c; }
        .ent-rx .ent-dtqg-pop { margin: 2px 0 0; font-size: 12px; font-weight: 700; color: #087f89; }
        .ent-rx .ent-dtqg-pg { font-size: 11.5px; color: #4b6576; white-space: nowrap; }
        .ent-rx .ent-grp-h { margin: 0; font-size: 12.5px; font-weight: 800; color: #087f89; text-transform: uppercase; letter-spacing: .02em; }
      `}</style>
    </article>
  );
}
