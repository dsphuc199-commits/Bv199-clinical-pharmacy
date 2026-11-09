"use client";

import { useState } from "react";
import Link from "next/link";
import { renalDosingDatabase } from "@/data/renal-dosing";
import { findDrugs } from "@/lib/antibiotics/drug-links";
import { useAbxLinkContext } from "../links/AbxLinkContext";

type Interaction = { id:string; drug1:string; drug2:string; mechanism:string; consequence:string; management:string; page:number; reviewStatus?:string };
let interactions: Promise<Interaction[]> | undefined;
const normalize = (s:string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,' ').trim();
function loadInteractions() {
  return interactions ??= fetch('/data/qd5948.json').then(r => {if(!r.ok) throw Error('Không tải được dữ liệu tương tác');return r.json() as Promise<Interaction[]>;}).catch(error=>{interactions=undefined;throw error;});
}

export default function RegimenDrugTools({ name, texts = [] }: { name:string; texts?:string[] }) {
  const context = useAbxLinkContext();
  const matches = findDrugs([name]);
  const ids = new Set(matches.map(m=>m.ingredientId));
  const profiles = renalDosingDatabase.filter(p=>ids.has(p.ingredientId));
  const [rows,setRows] = useState<Interaction[] | null>(null);
  const [error,setError] = useState(false);
  const [pending,setPending] = useState(false);
  async function inspect() {
    if(rows || pending) return;
    setPending(true);setError(false);
    try {
      const data = await loadInteractions();
      const names = [...new Set([name,...matches.map(m=>m.name)])].map(normalize).filter(n=>n.length>3);
      setRows(data.filter(row => [row.drug1,row.drug2].some(drug => names.some(n=>` ${normalize(drug)} `.includes(` ${n} `)))));
    } catch { setError(true); } finally { setPending(false); }
  }
  return <div className="regimen-drug-tools" data-drug-tools={name}>
    <details><summary>Hiệu chỉnh liều <span className="rdt-sr">{name}</span></summary>
      <p><strong>{name}</strong> — chọn đúng chỉ định, đường dùng và đối tượng trước khi áp dụng dữ liệu hiệu chỉnh. Không tự thay liều của phác đồ đang xem.</p>
      {profiles.length === 0 ? <p>Chưa tìm thấy chuyên luận khớp chính xác. Cần thẩm định tên hoạt chất/chế phẩm; không chuyển sang liều của thuốc đơn khác.</p> : profiles.map(profile=><details className="rdt-profile" key={profile.id}>
        <summary>{profile.indicationLabel}{profile.route ? ` · ${profile.route}` : ""}</summary>
        <p><strong>Liều nền:</strong> {profile.normalDose} · {profile.normalInterval}</p>
        {profile.rangeNote && <p>{profile.rangeNote}</p>}
        <dl>{profile.ranges.map((range,i)=><div key={i}><dt>{range.label}</dt><dd>{range.dose} · {range.interval}{range.note && <p>{range.note}</p>}</dd></div>)}</dl>
        {[...(profile.adultDoseText??[]),...(profile.pediatricDoseText??[]),...(profile.renalNarrative??[]),profile.hepaticNote,profile.dialysisNote,profile.elderlyNote].filter(Boolean).map((note,i)=><p key={i}>{note}</p>)}
        <details><summary>Nguồn và đối chiếu</summary><p>{profile.source.organization} · {profile.source.title} ({profile.source.year}) · {profile.source.page}</p>{profile.source.url && <a href={profile.source.url} target="_blank" rel="noreferrer">Mở nguồn chuyên luận</a>}<p>{profile.verification === 'da-doi-chieu-nguon' ? 'Đã có ghi nhận đối chiếu nguồn trong dữ liệu; chưa đồng nghĩa phê duyệt phác đồ.' : 'Cần thẩm định phạm vi và dữ liệu chuyên luận trước khi áp dụng.'}</p></details>
      </details>)}
      <Link href={`/antibiotics/dosing?from=${encodeURIComponent(context.from ?? '/antibiotics/empiric/guideline-v9')}&fromLabel=${encodeURIComponent(context.fromLabel ?? 'Phác đồ')}`}>Mở công cụ hiệu chỉnh liều</Link>
      {texts.length > 0 && <details><summary>Liều trong phác đồ đang xem</summary><ul>{texts.map((text,i)=><li key={i}>{text}</li>)}</ul></details>}
    </details>
    <details onToggle={event=>{if(event.currentTarget.open) void inspect();}}><summary>Tương tác thuốc <span className="rdt-sr">{name}</span></summary>
      {pending && <p role="status">Đang tải dữ liệu tương tác…</p>}
      {error && <p role="alert">Không tải được dữ liệu. <button type="button" onClick={()=>void inspect()}>Thử lại</button></p>}
      {rows && <><p>Các cặp chứa tên hoạt chất trong dữ liệu QĐ 5948. Phải rà soát cả thuốc dùng kèm và các tương tác theo nhóm thuốc.</p>{rows.length === 0 ? <p>Chưa tìm thấy cặp khớp tên; không có nghĩa là không có tương tác.</p> : rows.map(row=><details key={row.id} className="rdt-profile"><summary>{row.drug1} — {row.drug2}</summary><p><strong>Cơ chế:</strong> {row.mechanism}</p><p><strong>Hậu quả:</strong> {row.consequence}</p><p><strong>Xử trí:</strong> {row.management}</p><details><summary>Nguồn và đối chiếu</summary><a href="/data/qd5948.json" target="_blank" rel="noreferrer">Dữ liệu QĐ 5948 — bản ghi {row.id}, trang nguồn {row.page}</a><p>Cần đối chiếu lại với PDF gốc; bản ghi dữ liệu không thay thế việc đọc nguồn.</p>{row.reviewStatus === 'needs_review' && <p>Cần thẩm định bản ghi tương tác.</p>}</details></details>)}</>}
      <Link href="/tuong-tac-thuoc">Mở công cụ tương tác thuốc để kiểm tra toàn bộ đơn</Link>
    </details>
    <style>{`
      .regimen-drug-tools { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin:8px 0; min-width:0; font-size:12px; }
      .regimen-drug-tools > details { min-width:0; }.regimen-drug-tools > details[open] { grid-column:1/-1; }
      .regimen-drug-tools summary { cursor:pointer; font-weight:700; color:#087f89; padding:6px 8px; border:1px solid #d5e7ec; background:#f1f8fa; border-radius:6px; }
      .regimen-drug-tools summary:focus-visible { outline:3px solid #087f89; outline-offset:3px; }
      .regimen-drug-tools p { margin:7px 0; overflow-wrap: break-word; }.regimen-drug-tools a { text-decoration:underline; color:#087f89; }
      .regimen-drug-tools dl > div { display:grid; grid-template-columns:minmax(85px,.6fr) minmax(0,1.4fr); gap:10px; padding:7px 0; border-bottom:1px solid #dce8ed; }
      .regimen-drug-tools dd { margin:0; }.rdt-profile { margin:8px 0; }.rdt-sr { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); }
      @media(max-width:640px) { .regimen-drug-tools { grid-template-columns:minmax(0,1fr); }.regimen-drug-tools dl > div { grid-template-columns:minmax(0,1fr); gap:2px; } }
    `}</style>
  </div>;
}
