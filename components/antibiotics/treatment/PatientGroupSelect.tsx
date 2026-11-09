"use client";
import { useId } from "react";
import type { PatientGroup } from "@/lib/antibiotics/patient-groups";

/*
  Chon nhom nguoi benh: chi o chon. Khong hien "tieu chi phan nhom" (ten nhom da du nghia).
  Giu duy nhat canh bao "Cần thẩm định" cua nhom dang chon (an toan lam sang).
*/
export default function PatientGroupSelect({ groups,value,onChange }:{groups:PatientGroup[];value?:string;onChange:(value:string)=>void}) {
  const uid=useId();const group=groups.find(item=>item.id===value);
  return <div className="patient-group-control clinical-scenario-select">
    <label htmlFor={uid}>Nhóm người bệnh</label>
    <select id={uid} value={group?.id??''} onChange={event=>onChange(event.target.value)}><option value="">Chọn nhóm người bệnh</option>{groups.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select>
    {group&&group.reviewNotes.length>0&&<p className="patient-group-review" data-selected-group={group.id}><strong>Cần thẩm định:</strong> {group.reviewNotes.join(' ')}</p>}
    <style>{`
      .patient-group-control { display:grid; gap:8px; min-width:0; margin:18px 0; color:#152b40; }.patient-group-control > label { font-weight:700; font-size:15px; }
      .patient-group-control select { width:100%; min-width:0; padding:11px 12px; border:1px solid #a9c8d2; border-radius:6px; background:white; font:inherit; color:#162c40; }
      .patient-group-control select:focus-visible { outline:3px solid #087f89; outline-offset:2px; }
      .patient-group-review { margin:4px 0 0; background:#fff9e9; border-left:3px solid #db9b21; padding:8px 10px; font-size:12px; color:#72500c; }
    `}</style>
  </div>;
}
