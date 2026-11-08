"use client";

import { useId, type ReactNode } from "react";

/** Shared controlled disclosure; choosing a sibling is owned by the parent. */
export default function DecisionDisclosure({ title, open, onToggle, children, className = "", buttonClassName }: { title: string; open: boolean; onToggle: () => void; children?: ReactNode; className?: string; buttonClassName?:string }) {
  const id = useId();
  return <div className={`clinical-disclosure ${className}`}>
    <button type="button" className={buttonClassName} aria-expanded={open} aria-controls={id} onClick={onToggle}><span>{title}</span><span aria-hidden="true">{open ? "▴" : "▾"}</span></button>
    <div id={id} hidden={!open}>{open && children}</div>
    <style>{`
      .clinical-disclosure { min-width:0; }
      .clinical-disclosure > button { width:100%; display:grid; grid-template-columns:minmax(0,1fr) 24px; gap:10px; align-items:center; text-align:left; border:1px solid #c5dce4; border-radius:8px; background:#f5f9fb; color:#17364b; padding:13px 14px; font:inherit; font-weight:700; cursor:pointer; }
      .clinical-disclosure > button[aria-expanded="true"] { border-color:#087f89; background:#e5f3f5; }
      .clinical-disclosure > button > span:last-child { text-align:center; }
      .clinical-disclosure > button:focus-visible { outline:3px solid #087f89; outline-offset:3px; }
      .clinical-disclosure > [hidden] { display:none!important; }
    `}</style>
  </div>;
}
