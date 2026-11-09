"use client";
import { useId } from "react";
import type { PatientGroup } from "@/lib/antibiotics/patient-groups";
import { citeSources } from "@/lib/antibiotics/source-citation";
/* Nhom co noi dung phan biet that su (tieu chi, loai tru, can tham dinh, dinh nghia). */
const hasDetail=(g:PatientGroup)=>g.criteria.length>0||(g.exclusions?.length??0)>0||g.reviewNotes.length>0||g.definitions.length>0;
function Criteria({ group }:{group:PatientGroup}) {
  return <>
    {group.criteria.length>0&&<ul>{group.criteria.map(text=><li key={text}>{text}</li>)}</ul>}
    {group.exclusions&&group.exclusions.length>0&&<><strong>Điều kiện loại trừ</strong><ul>{group.exclusions.map(text=><li key={text}>{text}</li>)}</ul></>}
    {group.reviewNotes.length>0&&<p className="patient-group-review"><strong>Cần thẩm định:</strong> {group.reviewNotes.join(' ')}</p>}
    {group.definitions.length>0&&<details><summary>Định nghĩa yếu tố nguy cơ</summary><ul>{group.definitions.map(text=><li key={text}>{text}</li>)}</ul></details>}
  </>;
}
export default function PatientGroupSelect({ groups,value,onChange }:{groups:PatientGroup[];value?:string;onChange:(value:string)=>void}) {
  const uid=useId();const group=groups.find(item=>item.id===value);
  const detailed=groups.filter(hasDetail);
  /* Nguon theo nhom chi hien khi cac nhom dung van ban khac nhau (neu giong nhau: xem "Nguồn và đối chiếu" cuoi khung). */
  const cite=(g:PatientGroup)=>citeSources(g.sourceLocations).map(c=>c.label).join("; ");
  const distinctSources=new Set(groups.map(cite)).size>1;
  return <div className="patient-group-control clinical-scenario-select">
    <label htmlFor={uid}>Nhóm người bệnh</label>
    <select id={uid} value={group?.id??''} onChange={event=>onChange(event.target.value)}><option value="">Chọn nhóm người bệnh</option>{groups.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select>
    {detailed.length>0&&<details className="patient-group-criteria"><summary>Xem tiêu chí phân nhóm</summary>
      {detailed.map(item=><section key={item.id} data-group-criteria={item.id}><h4>{item.name}</h4><Criteria group={item}/>{distinctSources&&cite(item)&&<p className="patient-group-source">Nguồn: {cite(item)}</p>}</section>)}
    </details>}
    {group&&hasDetail(group)&&<section className="patient-group-selected" data-selected-group={group.id}><h3>Tiêu chí áp dụng</h3>{group.criteria.join(' ').length>400?<><p>{group.name}</p>{group.reviewNotes.length>0&&<p className="patient-group-review"><strong>Cần thẩm định:</strong> {group.reviewNotes.join(' ')}</p>}<details><summary>Xem đầy đủ tiêu chí áp dụng</summary><Criteria group={group}/></details></>:<Criteria group={group}/>}</section>}
    <style>{`
      .patient-group-control { display:grid; gap:8px; min-width:0; margin:18px 0; color:#152b40; }.patient-group-control > label { font-weight:700; font-size:15px; }
      .patient-group-control select { width:100%; min-width:0; padding:11px 12px; border:1px solid #a9c8d2; border-radius:6px; background:white; font:inherit; color:#162c40; }
      .patient-group-control select:focus-visible,.patient-group-control summary:focus-visible { outline:3px solid #087f89; outline-offset:2px; }
      .patient-group-control summary { cursor:pointer; color:#008d86; font-size:13px; }.patient-group-control ul { padding-left:20px; margin:7px 0; }.patient-group-control li { margin:5px 0; }
      .patient-group-criteria > section { margin:12px 0; border-top:1px solid #e1e9ee; padding-top:8px; font-size:13px; }.patient-group-criteria h4 { margin:0; font-size:14px; }
      .patient-group-selected { margin-top:14px; font-size:14px; line-height:1.7; }.patient-group-selected h3 { margin:0 0 8px; font-size:15px; font-weight:700; color:#10243e; }.patient-group-selected p { margin:4px 0; }.patient-group-selected ul { list-style:none; padding:0; }
      .patient-group-source { margin:4px 0 0; font-size:12px; color:#4b6576; }
      .patient-group-review { background:#fff9e9; border-left:3px solid #db9b21; padding:8px 10px; font-size:12px; color:#72500c; }
    `}</style>
  </div>;
}
