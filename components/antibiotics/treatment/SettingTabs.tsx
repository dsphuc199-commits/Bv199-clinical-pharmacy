"use client";
import { useId, type ReactNode } from "react";
export default function SettingTabs({ items,value,onChange,children }:{items:{value:string;label:string}[];value:string;onChange:(value:string)=>void;children:ReactNode}) {
  const uid=useId();
  if(items.length<=1)return <>{children}</>;
  return <div className="treatment-context">
    <div role="tablist" aria-label="Bối cảnh điều trị" className="treatment-context-tabs">
      {items.map((item,index)=><button key={item.value} type="button" role="tab" id={`${uid}-${index}`} aria-controls={`${uid}-panel`} aria-selected={value===item.value} tabIndex={value===item.value?0:-1}
        onClick={()=>{if(value!==item.value)onChange(item.value);}}
        onKeyDown={event=>{const next=event.key==='ArrowRight'?(index+1)%items.length:event.key==='ArrowLeft'?(index-1+items.length)%items.length:event.key==='Home'?0:event.key==='End'?items.length-1:undefined;if(next!==undefined){event.preventDefault();if(items[next].value!==value)onChange(items[next].value);document.getElementById(`${uid}-${next}`)?.focus();}}}>{item.label}</button>)}
    </div>
    <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${items.findIndex(item=>item.value===value)}`} className="treatment-context-body">{children}</div>
    <style>{`
      .treatment-context { min-width:0; }.treatment-context-tabs { display:flex; gap:24px; border-bottom:1px solid #d9e4e9; margin-bottom:20px; }
      .treatment-context-tabs > button { border:0; border-bottom:3px solid transparent; background:white; color:#344b5d; padding:12px 10px; font:inherit; font-weight:600; cursor:pointer; min-width:0; }
      .treatment-context-tabs > button[aria-selected=true] { color:#007f86; border-bottom-color:#009f98; }
      .treatment-context-tabs > button:focus-visible { outline:3px solid #087f89; outline-offset:2px; }.treatment-context-body { min-width:0; }
      @media(max-width:640px) { .treatment-context-tabs { gap:8px; }.treatment-context-tabs > button { padding:10px 6px; font-size:13px; overflow-wrap:anywhere; } }
    `}</style>
  </div>;
}
