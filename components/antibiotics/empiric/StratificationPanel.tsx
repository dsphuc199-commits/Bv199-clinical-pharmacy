"use client";
/*
  Khung phân tầng theo nguy cơ nhiễm khuẩn, bố cục như "Hướng dẫn sử dụng kháng sinh" của BV ĐHYD TP.HCM:
  chọn nơi điều trị (không hồi sức / hồi sức) → bảng các cột nguy cơ (cộng đồng / bệnh viện / nhóm đặc biệt)
  với các hàng thẳng nhau: tiêu chí phân tầng → gửi bệnh phẩm → tác nhân lưu ý → kháng sinh gợi ý
  (phương án "Hoặc", nhóm "Kết hợp", "Có thể kết hợp thêm" kèm chú thích) → tài liệu tham khảo.
  Chỉ mượn bố cục: thuốc, liều lấy nguyên từ dữ liệu Bộ Y tế, hội chuyên ngành và quốc tế đã đối chiếu
  (data/antibiotics/empiric/stratification.ts, ALL_REGIMENS).
*/
import Link from "next/link";
import { Fragment, useState, type ReactNode } from "react";
import { safetyAlertsFor } from "@/data/antibiotics/empiric/safety-alerts";
import { SPECIALIZED_MODULE_LINKS } from "@/lib/antibiotics/empiric-ui-rules";
import tablesData from "@/data/antibiotics/antibiogram-bv199-tables.json";
import { ALL_REGIMENS, DOCS, type Regimen } from "@/data/antibiotics/empiric/regimens";
import { cleanRef, type StratCite, type StratColumn, type StratIntl, type Stratification } from "@/data/antibiotics/empiric/stratification";
import ClinicalNotes from "../treatment/ClinicalNotes";
import { Rx, RxToolStyle } from "./rx-tool";
import { clinicalText } from "@/lib/antibiotics/presentation-text";
import { structureOf } from "@/lib/antibiotics/regimen-structure";
import { resolvedDrugs } from "@/data/antibiotics/empiric/dose-references";
import { useBiliaryProtocol } from "./BiliaryProtocolContext";
import { BILIARY_BASE_CONTENT, BILIARY_DISEASE_ID, biliaryDurationText, biliaryPublishedGroups } from "@/lib/antibiotics/biliary-protocol";

/* Ghi chú quy trình soạn (vị trí trong văn bản, nguồn không nêu…) không hiển thị trên giao diện lâm sàng. */
const PROCESS = /không nêu|văn bản|theo nguồn|nguyên văn|cần xác minh|bảng\s|table\s|(^|[\s(])tr\.\s*\d|trang\s/iu;
const shown = (text: string) => { const t = clinicalText(text).trim(); return t && !PROCESS.test(t) ? t : ""; };

type Cell = { t: string; s?: number; n?: number; g?: number };
type Panel = { columns: { code: string; name?: string }[]; rows: { group: string; n: number; cells: Cell[] }[] };
type TablesFile = { period: string; minN: number; clsiNotes: { mark: string; text: string }[]; tables: { id: string; label: string; n: number; gramNegative: Panel; gramPositive: Panel }[] };
const tables = tablesData as TablesFile;

const SCOPES = [
  { id: "hscc", label: "Hồi sức (HSCC)" },
  { id: "khoi-noi", label: "Khối nội" },
  { id: "khoi-ngoai", label: "Khối ngoại" },
  { id: "toan-vien", label: "Toàn viện" },
] as const;

const HEAD: Record<StratColumn["tone"], string> = {
  community: "border-emerald-300 bg-emerald-50 text-emerald-900",
  hospital: "border-rose-300 bg-rose-50 text-rose-900",
  special: "border-sky-300 bg-sky-50 text-sky-900",
};

function Cites({ items }: { items: StratCite[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
      {items.map((c) => <li key={c.text}>{c.text} <span className="text-xs text-slate-500" title={c.ref}>({c.source}{!c.ref || PROCESS.test(c.ref) ? "" : `, ${c.ref}`})</span></li>)}
    </ul>
  );
}

/* Ghi chú biên tập dữ liệu (nguồn lấy liều, ngày bổ sung) không phải nội dung lâm sàng. */
const EDITORIAL_NOTE = /^(?:ĐỐI CHIẾU LIỀU|Liều bổ sung ngày|Văn bản không nêu liều)|không nêu liều;/u;
const SECTION_NAME: Record<string, string> = {
  "6": "phần viêm phổi bệnh viện của QĐ 708",
  "9": "phần viêm phổi liên quan thở máy của QĐ 708",
  "10": "phần điều trị theo tác nhân của QĐ 708",
  "11": "phần liều kháng sinh trong nhiễm khuẩn huyết của QĐ 708",
};
/** Giữ nguyên thuốc, liều, cảnh báo; chỉ đổi số bảng/trang thành tên phần của QĐ 708 và bỏ ghi chú soạn thảo. */
function panelNote(note: string): string {
  return note
    .replace(/\s*Daptomycin không có trong dữ liệu DTQG của ứng dụng\./u, "")
    .replace(/\s*Bảng II\.9 không ghi số liều\./u, "")
    .replace(/\s*\(QĐ 708 Bảng II\.\d+\)/gu, "")
    .replace(/văn bản không ghi liều/gu, "QĐ 708 không ghi liều")
    .replace(/xem thêm mục 4\.1\.2b/u, "xem thêm phác đồ nhóm có yếu tố nguy cơ nhiễm khuẩn bệnh viện")
    .replace(/\s*\(tr\.[^)]*\)/gu, "")
    .replace(/DTQG 2023/gu, "Dược thư quốc gia 2023")
    .replace(/\s*\((?:Table|Bảng) \d+\)/gu, "")
    .replace(/Cùng văn bản,\s*/u, "")
    .replace(/không thay thế văn bản BYT/u, "không thay thế hướng dẫn BYT")
    .replace(/\s*\(cùng văn bản\)|\s*của cùng văn bản/gu, "")
    .replace(/;?\s*chưa đối chiếu lại trang gốc/gu, "")
    .replace(/\s*\((?:văn bản )?không nêu (?:liều|tên thuốc)[^)]*\)/gu, "")
    .replace(/\(\s*\)/gu, "")
    .replace(/Bảng II\.(\d+)/gu, (m, n: string) => SECTION_NAME[n] ?? m)
    .replace(/(^|[.!?]\s+)phần/gu, "$1Phần")
    .trim();
}
/* Câu gốc dạng "thuốc (truyền TM … mỗi 8 giờ)": bộ tách thuốc để lại dấu ")" lẻ ở cuối liều – bỏ dấu lẻ đó. */
const dropStrayParen = (s: string) => (s.endsWith(")") && (s.match(/\(/gu)?.length ?? 0) < (s.match(/\)/gu)?.length ?? 0) ? s.slice(0, -1).trimEnd() : s);
const doseText = (text: string) => dropStrayParen(clinicalText(panelNote(cleanRef(text))) || panelNote(cleanRef(text)));

const byId = (ids: string[]) => ids.map((id) => ALL_REGIMENS.find((r) => r.id === id)).filter((r): r is Regimen => Boolean(r));
const MAIN_ROLES = new Set(["first", "severe", "alternative"]);
const docLabel = (r: Regimen) => (DOCS[r.source.doc]?.number ? `QĐ ${DOCS[r.source.doc].number}` : "Bộ Y tế");

/* Bộ tách thuốc đôi khi tách vế liều (vd. "Tổng liều 24 giờ…" của colistin) thành mục riêng: gộp lại vào thuốc phía trước. */
const DOSE_PART = /^(Tổng liều|Liều|Duy trì|Nạp)\b/u;
function mergeDoseParts(items: { name: string; dose: string }[]) {
  return items.reduce<{ name: string; dose: string }[]>((out, it) => {
    const prev = out[out.length - 1];
    if (prev && DOSE_PART.test(it.name)) prev.dose = `${prev.dose}; ${it.name.toLowerCase()} ${it.dose}`.trim();
    else out.push({ ...it });
    return out;
  }, []);
}
/* Văn bản ghi "X hoặc Y <liều>" (vd. "amoxicilin hoặc ampicilin 1 g x 4 lọ/ngày"): bộ tách thuốc để X không có liều.
   Gộp lại đúng như câu gốc để liều áp dụng cho cả hai thuốc. */
const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
function mergeOrPairs(items: { name: string; dose: string }[], source: string) {
  const out: { name: string; dose: string }[] = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i], next = items[i + 1];
    if (!it.dose && next?.dose && new RegExp(`${escRe(it.name)}\\s+hoặc\\s+${escRe(next.name)}`, "iu").test(source)) {
      out.push({ name: `${it.name} hoặc ${next.name.toLowerCase()}`, dose: next.dose });
      i++;
    } else out.push(it);
  }
  return out;
}
/* Ghi chú về liều lệch nguồn cần dược sĩ xác nhận: luôn hiện, không thu gọn. */
const CRITICAL_NOTE = /^(CẦN DƯỢC SĨ XÁC NHẬN|LIỀU NGHI SAI)/u;

/** Một phương án BYT: các nhóm thuốc giữ nguyên nhãn gốc ("Một trong", "Phối hợp (chọn một)"…), liều giữ nguyên. */
function RegimenDrugs({ regimen }: { regimen: Regimen }) {
  /* Đường mật: liều theo bản HĐT&ĐT đã công bố (trang quản trị) khi có; không tải được thì không hiện liều cũ. */
  const protocol = useBiliaryProtocol();
  const biliary = regimen.diseaseIds.includes(BILIARY_DISEASE_ID);
  const drugs = resolvedDrugs(regimen).map((drug) => ({ ...drug, dose: panelNote(cleanRef(drug.dose)) }));
  const base = structureOf({ ...regimen, id: `${regimen.id}#panel`, drugs }).groups;
  if (biliary && protocol === "unavailable") return <p role="status" className="rounded border border-amber-300 bg-amber-50 p-1.5 text-xs text-amber-950">Tạm thời chưa tải được bản phác đồ đang dùng. Hãy tải lại trang.</p>;
  const published = protocol && protocol !== "unavailable" ? protocol : null;
  const groups = biliary && published ? biliaryPublishedGroups(regimen.id, base, published.content) : base;
  const aligned = groups.length === drugs.length;
  return (
    <div className="space-y-1">
      {groups.map((g, gi) => {
        const caption = clinicalText(panelNote((aligned ? drugs[gi].name : g.label) ?? "")).replace(/:$/u, "");
        const single = g.options.length === 1 && g.options[0].name.toLowerCase() === caption.toLowerCase();
        const label = single ? (gi > 0 ? "Kết hợp" : "") : caption || (gi > 0 ? (g.optional ? "Có thể kết hợp thêm" : "Kết hợp") : "");
        return (
          <div key={gi}>
            {label && <p className={`text-xs font-semibold ${gi > 0 ? "text-emerald-700" : "text-slate-600"}`}>{label}</p>}
            <ul className="list-disc pl-5 text-sm text-slate-900">
              {mergeDoseParts(mergeOrPairs(g.options.map((o) => ({ name: doseText(o.name), dose: o.raw ? doseText(o.raw) : "" })), (aligned ? drugs[gi].dose : g.raw.map((x) => x.dose).join("; ")) ?? "")).map((o, oi) => (
                <li key={oi} className="py-0.5"><b className="block font-semibold sm:inline">{o.name}</b>{o.dose && o.dose !== o.name && <><span className="hidden sm:inline">: </span><span className="block text-slate-800 sm:inline">{o.dose}</span></>}</li>
              ))}
            </ul>
          </div>
        );
      })}
      {regimen.duration && <p className="text-xs text-slate-600">Thời gian: {doseText(regimen.duration)}</p>}
    </div>
  );
}

/** Phác đồ trong module Việt Nam (QĐ 2147, Hội Hô hấp 2023): mỗi dòng là một phương án, các thuốc nối bằng "Kết hợp". */
function ModuleBlock({ block }: { block: StratIntl }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-teal-800">{block.source}</p>
      {block.lead && <p className="text-xs text-slate-600">{block.lead}</p>}
      {block.items.map((it, i) => (
        <Fragment key={`${it.ref}-${i}`}>
          {i > 0 && <p className="text-xs font-bold uppercase text-slate-500">Hoặc</p>}
          <div className="text-sm text-slate-900">
            {/* Từng thuốc lấy từ parts (moduleBlock); join cho biết phối hợp hay chọn một thuốc. Không tách chuỗi theo chữ
                "hoặc" vì chữ này có thể nằm trong câu liều (vd. "750 mg mỗi 24 giờ hoặc 500 mg mỗi 12 giờ"). */}
            {(it.parts ?? [it.text]).map((part, pi) => (
              <Fragment key={pi}>
                {pi > 0 && (it.join !== "or"
                  ? <p className="text-xs font-semibold text-emerald-700">Kết hợp</p>
                  : <p className="text-xs font-bold uppercase text-slate-500">Hoặc (chọn một thuốc)</p>)}
                <p>{(() => {
                  /* "Tên thuốc: liều" – in đậm tên thuốc; nội dung giữ nguyên. */
                  const k = part.indexOf(": ");
                  return k > 0 && k < 80 ? <><b className="block font-semibold sm:inline">{part.slice(0, k)}</b><span className="hidden sm:inline">: </span><span className="block sm:inline">{part.slice(k + 2)}</span></> : part;
                })()}</p>
              </Fragment>
            ))}
            {"preparation" in it && it.preparation && <p className="text-xs text-slate-600">{it.preparation}</p>}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/* Tình huống của phương án: chỉ in khi khác phương án trước, tránh lặp cùng một dòng ở mọi phương án. */
const caseOf = (r: Regimen) => `${r.scenario}|${r.condition ?? ""}`;

/** Ô "Kháng sinh gợi ý" của một cột (tab Việt Nam). */
function VnAntibiotics({ col }: { col: StratColumn }) {
  const regs = byId(col.byt);
  const main = regs.filter((r) => MAIN_ROLES.has(r.role));
  const extra = regs.filter((r) => !MAIN_ROLES.has(r.role));
  const alerts = Array.from(new Map(regs.flatMap((r) => safetyAlertsFor(r.id)).map((a) => [a.id, a])).values());
  const notes = Array.from(new Set(regs.flatMap((r) => (r.notes ?? []).filter((n) => !EDITORIAL_NOTE.test(n)).map(panelNote)))).filter(Boolean);
  const sources = Array.from(new Set(regs.map(docLabel)));
  /* Mục đối chiếu liều (dose-conflicts.ts) gắn vào phương án: chỉ hiện tên mục, chi tiết ở tab Đối chiếu. */
  const conflicts = Array.from(new Map(regs.flatMap((r) => (r.notes ?? [])
    .filter((n) => n.startsWith("ĐỐI CHIẾU LIỀU – "))
    .map((n) => [n.slice("ĐỐI CHIẾU LIỀU – ".length).split(". Theo BYT")[0], r.diseaseIds[0]] as const))).entries());
  return (
    <div className="space-y-2">
      {(col.vn ?? []).map((b) => <ModuleBlock key={b.source} block={b} />)}
      {main.length > 0 && (
        <div className="space-y-1">
          {(col.vn?.length ?? 0) > 0 && <p className="text-xs font-semibold text-teal-800">{sources.join(", ")}</p>}
          {main.map((r, i) => (
            <Fragment key={r.id}>
              {i > 0 && <p className="text-xs font-bold uppercase text-slate-500">Hoặc</p>}
              {(r.condition || (main.length > 1 && (i === 0 ? new Set(main.map(caseOf)).size > 1 || caseOf(r) !== col.label : caseOf(r) !== caseOf(main[i - 1])))) && <p className="text-xs italic text-slate-600">{shown(r.condition ?? "") || shown(r.scenario) || r.scenario}{main.length > 1 && r.source.doc !== main[0].source.doc ? ` (${docLabel(r)})` : ""}</p>}
              <RegimenDrugs regimen={r} />
            </Fragment>
          ))}
        </div>
      )}
      {extra.map((r, i) => (
        <div key={r.id} className="space-y-1">
          <p className="text-xs font-semibold text-emerald-700">
            {r.role === "allergy" ? "Dị ứng hoặc không dung nạp" : r.role === "adjunct" || /^Thêm/u.test(r.drugs[0]?.name ?? "") ? "Có thể kết hợp thêm" : "Hoặc, theo tác nhân nghi ngờ"}
            <sup>{i + 1}</sup>
          </p>
          <RegimenDrugs regimen={r} />
        </div>
      ))}
      {extra.length > 0 && (
        <ol className="space-y-0.5 text-xs text-slate-700">
          {extra.map((r, i) => <li key={r.id}><sup>{i + 1}</sup> Cân nhắc khi: {shown(r.condition ?? "") || shown(r.scenario) || r.scenario}</li>)}
        </ol>
      )}
      {alerts.length > 0 && (
        <div className="rounded border border-amber-300 bg-amber-50 p-1.5 text-xs text-amber-950">
          {/* Cảnh báo an toàn không bao giờ bị ẩn: chỉ đổi giọng văn qua clinicalText. */}
          <ul className="list-disc pl-4">{alerts.map((a) => <li key={a.id}><b>{clinicalText(a.title) || a.title}</b>: {clinicalText(a.text) || a.text}{a.checklist && <ul className="list-[circle] pl-4">{a.checklist.map((c) => <li key={c}>{clinicalText(c) || c}</li>)}</ul>}</li>)}</ul>
        </div>
      )}
      {conflicts.length > 0 && (
        <div className="rounded border border-amber-300 bg-amber-50 p-1.5 text-xs text-amber-950">
          <p className="font-semibold">Liều khác nhau giữa các nguồn – HĐT&amp;ĐT BV199 quyết định liều áp dụng</p>
          <ul className="list-disc pl-4">{conflicts.map(([topic, did]) => (
            <li key={topic}><Link className="underline" href={`/antibiotics/empiric/guideline-v9?disease=${did}&tab=compare`}>{topic}</Link></li>
          ))}</ul>
        </div>
      )}
      {notes.some((n) => CRITICAL_NOTE.test(n)) && (
        <div className="rounded border border-amber-300 bg-amber-50 p-1.5 text-xs text-amber-950">
          <ClinicalNotes items={notes.filter((n) => CRITICAL_NOTE.test(n))} />
        </div>
      )}
      {notes.some((n) => !CRITICAL_NOTE.test(n)) && (
        <details className="text-xs text-slate-700">
          <summary className="cursor-pointer font-semibold">Lưu ý lâm sàng ({notes.filter((n) => !CRITICAL_NOTE.test(n)).length})</summary>
          <ClinicalNotes items={notes.filter((n) => !CRITICAL_NOTE.test(n))} />
        </details>
      )}
      {col.note && <p className="text-xs font-medium text-slate-700">{col.note}</p>}
      {regs.length > 0 && <p className="text-xs"><Link className="text-teal-800 underline" href={SPECIALIZED_MODULE_LINKS.doseAdjustment.href}>{SPECIALIZED_MODULE_LINKS.doseAdjustment.label}</Link></p>}
    </div>
  );
}

/* Bảng khuyến cáo quốc tế trong ô cột hẹp: xếp dọc từng lựa chọn (nhãn + mức khuyến cáo trên một dòng,
   nội dung trải hết chiều ngang ô) thay cho 3 cột bị bó chữ. Chỉ đổi trình bày, không đổi nội dung. */
const STRAT_INTL_CSS = [
  ".strat-intl .sa24-rx,.strat-intl .sa24-rx tbody,.strat-intl .sa24-rx th,.strat-intl .sa24-rx td{display:block;width:auto!important}",
  ".strat-intl .sa24-rx thead{display:none}",
  /* Mỗi lựa chọn: nhãn + mức khuyến cáo trên một dòng, thuốc trải hết ô, các trường liều nối tiếp trên cùng dòng. */
  ".strat-intl .sa24-rx tbody tr{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 12px;border-top:1px solid #edf2f6;padding:8px 6px}",
  ".strat-intl .sa24-rx tbody tr:first-child{border-top:0}",
  ".strat-intl .sa24-rx th,.strat-intl .sa24-rx td{border:0;padding:0;text-align:left;font-size:14px;line-height:1.5}",
  ".strat-intl .sa24-rx th{flex:1 1 auto;order:0;font-size:12.5px;color:#0b6b6b}",
  ".strat-intl .sa24-rx .sa24-gc{flex:0 0 auto;order:1;margin-left:auto;text-align:right}",
  ".strat-intl .sa24-rx .sa24-drug,.strat-intl .sa24-rx .sa24-note{flex:1 1 100%;order:2}",
  ".strat-intl .sa24-rx td[data-label]{flex:0 1 auto;order:3}",
  ".strat-intl .sa24-rx td[data-label]::before{content:attr(data-label) \": \";font-size:12px;font-weight:700;color:#5a7385}",
  ".strat-intl .sa24-rx td[data-label][data-whole]::before{content:none}",
  ".strat-intl .sa24-rx td[data-label]:empty{display:none}",
].join("");

function Intl({ block }: { block: StratIntl }) {
  return (
    <div className="strat-intl min-w-0 max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-white p-2">
      <p className="text-sm font-semibold text-slate-900">{block.source}</p>
      {block.lead && <p className="text-xs text-slate-600">{block.lead}</p>}
      <Rx items={block.items} />
    </div>
  );
}

type Family = "vn" | "intl";
/* Nguồn Việt Nam: văn bản Bộ Y tế, khuyến cáo hội chuyên ngành Việt Nam. */
const isVn = (source: string) => /^(QĐ|Hội|Bộ Y tế)/u.test(source);
const ofFamily = (items: StratCite[], family: Family) => items.filter((c) => isVn(c.source) === (family === "vn"));

/** Một hàng của bảng: mỗi cột một ô; trên màn hình nhỏ các ô xếp dọc và có nhãn cột. */
function Row({ title, cols, render, order }: { title: string; cols: StratColumn[]; render: (col: StratColumn) => ReactNode; order: number }) {
  return (
    <div className="strat-row" style={{ ["--n" as string]: cols.length, ["--o" as string]: order }} aria-label={title}>
      {cols.map((col) => (
        <section key={col.id} data-col={col.id} className="strat-cell min-w-0 rounded-lg border border-slate-200 bg-white p-2" aria-label={`${title} – ${col.label}`}>
          <p className="mb-1 text-xs font-bold text-slate-500 lg:hidden">{col.label}</p>
          {render(col)}
        </section>
      ))}
    </div>
  );
}

function Antibiogram({ spec }: { spec: Stratification["antibiogram"] }) {
  const [scope, setScope] = useState<string>(spec.defaultScope);
  const table = tables.tables.find(({ id }) => id === scope);
  if (!table) return null;
  const grid = (panel: Panel, organisms: string[], codes: string[]) => {
    const cols = codes.map((code) => ({ code, index: panel.columns.findIndex((c) => c.code === code) })).filter(({ index }) => index >= 0);
    const rows = organisms.map((name) => panel.rows.find(({ group }) => group === name)).filter((r): r is Panel["rows"][number] => Boolean(r));
    return (
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-[36rem] border-collapse text-sm">
          <thead><tr><th className="border border-slate-300 bg-slate-100 px-2 py-1 text-left">Vi khuẩn (n)</th>{cols.map(({ code }) => <th key={code} className="border border-slate-300 bg-slate-100 px-2 py-1">{code}</th>)}</tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.group}>
                <th scope="row" className="border border-slate-300 px-2 py-1 text-left font-medium"><i>{row.group}</i> ({row.n})</th>
                {cols.map(({ code, index }) => {
                  const cell = row.cells[index];
                  return <td key={code} className={`border border-slate-300 px-2 py-1 text-center ${cell?.g ? "bg-emerald-100 font-semibold" : ""}`} title={cell?.n ? `${cell.s}/${cell.n} nhạy` : undefined}>{cell?.t ?? "-"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <details className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
      <summary className="cursor-pointer text-base font-bold text-slate-900">Kháng sinh đồ BV199 (%S) – {tables.period}</summary>
      <div role="tablist" aria-label="Phạm vi khoa" className="my-2 flex flex-wrap gap-2">
        {SCOPES.map((s) => (
          <button key={s.id} type="button" role="tab" aria-selected={scope === s.id} onClick={() => setScope(s.id)}
            className={`rounded-full border px-3 py-1 text-sm ${scope === s.id ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300 bg-white text-slate-800"}`}>
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-600">{table.label}: {table.n} phân lập. {spec.note}</p>
      <h5 className="mt-2 text-sm font-semibold text-slate-700">Gram âm</h5>
      {grid(table.gramNegative, spec.gramNegative.organisms, spec.gramNegative.codes)}
      <h5 className="mt-2 text-sm font-semibold text-slate-700">Gram dương</h5>
      {grid(table.gramPositive, spec.gramPositive.organisms, spec.gramPositive.codes)}
      <p className="mt-2 text-xs text-slate-600">
        Ô xanh: %S ≥ 80% với ≥ {tables.minN} phân lập. * dưới {tables.minN} phân lập hoặc ít chủng được thử, chỉ tham khảo; R: kháng tự nhiên; -: không thử hoặc không có điểm gãy.
        b: tỷ lệ nhạy dựa trên cefoxitin (chỉ điểm methicilin) ở Staphylococcus.
        {tables.clsiNotes.filter((c) => c.mark !== "s").map((c) => ` ${c.mark}: ${c.text}`).join("")}{" "}
        Xem đầy đủ tại <Link className="font-semibold text-teal-800 underline" href="/antibiotics/antibiogram">Kháng sinh đồ BV199</Link>.
      </p>
    </details>
  );
}

const SETTING_LABEL = { ward: "Tại các khoa không phải hồi sức", icu: "Tại các khoa hồi sức" } as const;

/* Tab Việt Nam: overview (tổng quan, kiểm soát ổ nhiễm) và monitoring (theo dõi, an toàn) nằm trong khung;
   khung phân tầng thay toàn bộ phần trình bày cũ của mặt bệnh. Tab Quốc tế không dùng hai prop này. */
export default function StratificationPanel({ data, family, overview, monitoring }: { data: Stratification; family: Family; overview?: ReactNode; monitoring?: ReactNode }) {
  const vn = family === "vn";
  const all = data.columns.filter((c) => vn
    ? ofFamily(c.criteria, "vn").length > 0 || c.byt.length > 0 || (c.vn?.length ?? 0) > 0
    : ofFamily(c.criteria, "intl").length > 0 || c.intl.length > 0 || Boolean(c.links));
  const settings = vn ? (["ward", "icu"] as const).filter((s) => all.some((c) => c.setting === s)) : [];
  const [setting, setSetting] = useState<"ward" | "icu">(settings[0] ?? "ward");
  const columns = settings.length > 1 ? all.filter((c) => !c.setting || c.setting === setting) : all;
  /* Điện thoại: chọn một nhóm người bệnh, chỉ hiện ô của nhóm đó; máy tính giữ bảng đủ cột. */
  const [picked, setPicked] = useState<string>("");
  /* Thời gian điều trị đường mật: theo bản HĐT&ĐT đã công bố khi có, nếu không theo QĐ 708. */
  const protocol = useBiliaryProtocol();
  const active = columns.find((c) => c.id === picked)?.id ?? columns[0]?.id ?? "";
  const sampling = ofFamily(data.sampling, family);
  const shared = ofFamily(data.pathogens, family);
  const sources = data.sources.filter((s) => /^(Bộ Y tế|Hội)/u.test(s) === vn);
  if (!columns.length) return null;
  const hasColPathogens = columns.some((c) => ofFamily(c.pathogens ?? [], family).length > 0);
  const biliaryContent = data.diseaseIds.includes(BILIARY_DISEASE_ID) ? (protocol && protocol !== "unavailable" ? protocol.content : BILIARY_BASE_CONTENT) : null;
  const durationCites: StratCite[] = biliaryContent ? biliaryDurationText(biliaryContent).map((text) => ({ text: `Thời gian – ${text}`, source: protocol && protocol !== "unavailable" ? "Bản phác đồ BV199 đã công bố" : "QĐ 708/QĐ-BYT", ref: "" })) : [];
  const settingTitle = settings.length === 1 ? SETTING_LABEL[settings[0]] : settings.length > 1 ? SETTING_LABEL[setting] : "";
  return (
    <details open className="mb-4 min-w-0 max-w-full rounded-2xl border border-teal-200 bg-teal-50/40 p-3">
      <RxToolStyle />
      <style>{`.strat-row{display:grid;gap:.5rem}.strat-head{display:none}@media (min-width:1024px){.strat-head{display:grid}}.strat-body{display:flex;flex-direction:column;gap:.5rem}@media (min-width:1024px){.strat-row{grid-template-columns:repeat(var(--n),minmax(0,1fr))}}@media (max-width:1023px){.strat-body>*{order:var(--o,30)}.strat-cell:not([data-col="${active}"]){display:none}}${STRAT_INTL_CSS}`}</style>
      <summary className="cursor-pointer">
        <span className="text-xs font-bold uppercase tracking-wide text-teal-800">Phân tầng theo nguy cơ nhiễm khuẩn – {vn ? "hướng dẫn Việt Nam" : "hướng dẫn quốc tế"}</span>
        <span className="block text-lg font-bold text-slate-900">{data.title}</span>
      </summary>
      <div className="strat-body mt-2">
        {settings.length > 1 && (
          <div role="tablist" aria-label="Nơi điều trị" className="flex flex-wrap gap-2" style={{ ["--o" as string]: 1 }}>
            {settings.map((s) => (
              <button key={s} type="button" role="tab" aria-selected={setting === s} onClick={() => setSetting(s)}
                className={`rounded-full border px-3 py-1 text-sm font-semibold ${setting === s ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300 bg-white text-slate-800"}`}>
                {SETTING_LABEL[s]}
              </button>
            ))}
          </div>
        )}
        {vn && (settingTitle || data.settingNote) && (
          <p className="text-center text-sm font-bold uppercase text-slate-800" style={{ ["--o" as string]: 2 }}>{settingTitle}{settingTitle && data.settingNote ? " – " : ""}<span className="font-normal normal-case">{data.settingNote}</span></p>
        )}

        <p className="rounded bg-slate-800 px-2 py-1 text-center text-sm font-bold text-white" style={{ ["--o" as string]: 3 }}>Phân tầng theo nguy cơ nhiễm khuẩn</p>
        {columns.length > 1 && (
          <div className="lg:hidden" style={{ ["--o" as string]: 4 }}>
            <p className="mb-1 text-xs font-semibold text-slate-600">Nhóm nguy cơ – bấm để chọn</p>
            <div role="tablist" aria-label="Nhóm người bệnh" className="flex flex-col gap-1.5">
              {columns.map((col) => (
                <button key={col.id} type="button" role="tab" aria-selected={active === col.id} onClick={() => setPicked(col.id)}
                  className={`rounded-lg border-2 px-3 py-2 text-left text-sm font-bold ${active === col.id ? "border-teal-700 bg-teal-700 text-white" : HEAD[col.tone]}`}>
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="strat-row strat-head" style={{ ["--n" as string]: columns.length }}>
          {columns.map((col) => <h4 key={col.id} className={`rounded-lg border-2 px-2 py-1 text-center text-base font-bold ${HEAD[col.tone]}`}>{col.label}</h4>)}
        </div>
        <Row title="Tiêu chí" order={5} cols={columns} render={(col) => <Cites items={ofFamily(col.criteria, family)} />} />
        {vn && data.severity && (
          <section className="rounded-lg border border-amber-200 bg-amber-50/60 p-2" style={{ ["--o" as string]: 5 }}>
            <p className="text-sm font-bold text-slate-900">{data.severity.title}</p>
            <Cites items={[...data.severity.items, ...durationCites]} />
          </section>
        )}

        {sampling.length > 0 && (
          <section className="rounded-lg border border-rose-300 bg-rose-50 p-2" style={{ ["--o" as string]: 9 }}>
            <p className="text-center text-sm font-bold italic text-rose-800">Gửi bệnh phẩm nhuộm Gram, nuôi cấy và làm kháng sinh đồ trước khi dùng kháng sinh</p>
            <Cites items={sampling} />
          </section>
        )}

        <p className="rounded bg-slate-800 px-2 py-1 text-center text-sm font-bold text-white" style={{ ["--o" as string]: 6 }}>Điều trị ban đầu (kháng sinh kinh nghiệm)</p>
        {shared.length > 0 && (
          <section className="rounded-lg border border-slate-200 bg-white p-2" style={{ ["--o" as string]: 10 }}>
            <p className="text-sm font-bold text-slate-900">Tác nhân lưu ý</p>
            <Cites items={shared} />
          </section>
        )}
        {hasColPathogens && (
          <Row title="Tác nhân lưu ý" order={11} cols={columns} render={(col) => {
            const items = ofFamily(col.pathogens ?? [], family);
            return items.length ? <><p className="text-sm font-bold text-slate-900">Tác nhân lưu ý</p><Cites items={items} /></> : null;
          }} />
        )}
        <Row title="Kháng sinh gợi ý" order={7} cols={columns} render={(col) => (
          <>
            <p className="mb-1 text-sm font-bold text-slate-900">Kháng sinh gợi ý</p>
            {vn ? <VnAntibiotics col={col} /> : (
              <div className="space-y-2">
                {col.intl.map((b) => <Intl key={b.source} block={b} />)}
                {col.links && (
                  <p className="text-sm">Khuyến cáo chi tiết: {col.links.map((l, i) => (
                    <span key={l.diseaseId}>{i > 0 && "; "}<Link className="font-semibold text-teal-800 underline" href={`/antibiotics/empiric/guideline-v9?disease=${l.diseaseId}&tab=intl`}>{l.label}</Link></span>
                  ))}</p>
                )}
              </div>
            )}
          </>
        )} />

        {vn && data.focus && (
          <details className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer font-bold text-slate-900">{data.focusTitle}</summary>
            <div className="mt-2 grid min-w-0 gap-3 lg:grid-cols-2">
              {data.focus.map((f) => (
                <div key={f.label} className="min-w-0 rounded-lg border border-slate-200 p-2">
                  <p className="text-sm font-semibold text-slate-800">{f.label}{f.diseaseId && <> – <Link className="text-teal-800 underline" href={`/antibiotics/empiric/guideline-v9?disease=${f.diseaseId}`}>mở mặt bệnh</Link></>}</p>
                  <VnAntibiotics col={{ id: f.label, label: f.label, tone: "special", criteria: [], byt: f.byt, intl: [] }} />
                </div>
              ))}
            </div>
          </details>
        )}
        {!vn && data.extras?.map((x) => (
          <details key={x.title} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer font-bold text-slate-900">{x.title}</summary>
            {x.criteria && <p className="mt-1 text-sm text-slate-700">{x.criteria}</p>}
            <div className="mt-2 space-y-2">{x.blocks.map((b) => <Intl key={b.source} block={b} />)}</div>
          </details>
        ))}
        {!vn && (
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
            <h4 className="text-sm font-bold text-slate-900">Nguyên tắc phủ phổ kinh nghiệm</h4>
            <Intl block={data.principles} />
          </section>
        )}
        {vn && overview && (
          <details className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer font-bold text-slate-900">Tổng quan bệnh và kiểm soát ổ nhiễm</summary>
            <div className="mt-2">{overview}</div>
          </details>
        )}
        <Antibiogram spec={data.antibiogram} />
        {vn && monitoring}
        <p className="text-xs text-slate-600">Chỉnh liều theo chức năng thận và hướng dẫn liều BV199.</p>
        {sources.length > 0 && (
          <section className="rounded-lg border border-slate-200 bg-white p-2">
            <p className="text-sm font-bold italic text-slate-900">Tài liệu tham khảo</p>
            <ol className="list-decimal pl-5 text-xs text-slate-700">{sources.map((s) => <li key={s}>{s}</li>)}</ol>
          </section>
        )}
      </div>
    </details>
  );
}
