"use client";
import { useId } from "react";
import type { PatientGroup } from "@/lib/antibiotics/patient-groups";
function Criteria({ group }:{group:PatientGroup}) {
  return <>
    {group.criteria.length?<ul>{group.criteria.map(text=><li key={text}>{text}</li>)}</ul>:<p>Chưa đủ căn cứ xác định nhóm. Chọn thủ công sau khi đối chiếu bệnh cảnh trong nguồn: {group.name}.</p>}
    {group.exclusions&&group.exclusions.length>0&&<><strong>Điều kiện loại trừ</strong><ul>{group.exclusions.map(text=><li key={text}>{text}</li>)}</ul></>}
    {group.reviewNotes.length>0&&<p className="patient-group-review"><strong>Cần thẩm định:</strong> {group.reviewNotes.join(' ')}</p>}
    {group.definitions.length>0&&<details><summary>Định nghĩa yếu tố nguy cơ</summary><ul>{group.definitions.map(text=><li key={text}>{text}</li>)}</ul></details>}
  </>;
}
export default function PatientGroupSelect({ groups,value,onChange }:{groups:PatientGroup[];value?:string;onChange:(value:string)=>void}) {
  const uid=useId();const group=groups.find(item=>item.id===value);
  return <div className="patient-group-control clinical-scenario-select">
    <label htmlFor={uid}>Nhóm người bệnh</label>
    <select id={uid} value={group?.id??''} onChange={event=>onChange(event.target.value)}><option value="">Chọn nhóm người bệnh</option>{groups.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select>
    <details className="patient-group-criteria"><summary>Xem tiêu chí phân nhóm</summary>
      {groups.map(item=><section key={item.id} data-group-criteria={item.id}><h4>{item.name}</h4><Criteria group={item}/>{item.sourceLocations.length>0&&<details><summary>Nguồn và đối chiếu</summary><ul>{item.sourceLocations.map(source=><li key={source}>{source}</li>)}</ul></details>}</section>)}
    </details>
    {group&&<section className="patient-group-selected" data-selected-group={group.id}><h3>Tiêu chí áp dụng</h3>{group.criteria.join(' ').length>400?<><p>{group.name}</p>{group.reviewNotes.length>0&&<p className="patient-group-review"><strong>Cần thẩm định:</strong> {group.reviewNotes.join(' ')}</p>}<details><summary>Xem đầy đủ tiêu chí áp dụng</summary><Criteria group={group}/></details></>:<Criteria group={group}/>}</section>}
    <style>{`
      .patient-group-control { display:grid; gap:8px; min-width:0; margin:18px 0; color:#152b40; }.patient-group-control > label { font-weight:700; font-size:15px; }
      .patient-group-control select { width:100%; min-width:0; padding:11px 12px; border:1px solid #a9c8d2; border-radius:6px; background:white; font:inherit; color:#162c40; }
      .patient-group-control select:focus-visible,.patient-group-control summary:focus-visible { outline:3px solid #087f89; outline-offset:2px; }
      .patient-group-control summary { cursor:pointer; color:#008d86; font-size:13px; }.patient-group-control ul { padding-left:20px; margin:7px 0; }.patient-group-control li { margin:5px 0; }
      .patient-group-criteria > section { margin:12px 0; border-top:1px solid #e1e9ee; padding-top:8px; font-size:13px; }.patient-group-criteria h4 { margin:0; font-size:14px; }
      .patient-group-selected { margin-top:14px; font-size:14px; line-height:1.7; }.patient-group-selected h3 { margin:0 0 8px; font-size:15px; font-weight:700; color:#10243e; }.patient-group-selected p { margin:4px 0; }.patient-group-selected ul { list-style:none; padding:0; }
      .patient-group-review { background:#fff9e9; border-left:3px solid #db9b21; padding:8px 10px; font-size:12px; color:#72500c; }
    `}</style>
  </div>;
}
