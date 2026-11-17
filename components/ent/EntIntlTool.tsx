"use client";
/* Tab Quốc tế (Phác đồ kinh nghiệm) cho mặt bệnh Tai Mũi Họng: công cụ chọn kháng sinh cùng khung giao diện với các công cụ khác. */
import { useState } from "react";
import { ENT_EMPIRIC_MAP } from "@/data/ent";
import EntRxTool from "./EntRxTool";

export function isEntEmpiric(diseaseId: string) {
  return diseaseId in ENT_EMPIRIC_MAP;
}

export default function EntIntlTool({ diseaseId }: { diseaseId: string }) {
  const opts = ENT_EMPIRIC_MAP[diseaseId] ?? [];
  const [sel, setSel] = useState(opts[0]?.id);
  if (!sel) return null;
  const population = opts.length > 1 ? (
    <div className="sa24-row">
      <div className="sa24-lab">Đối tượng</div>
      <div className="sa24-ctl">
        <div className="sa24-seg" role="group" aria-label="Đối tượng">
          {opts.map((o) => <button key={o.id} type="button" className={sel === o.id ? "on" : undefined} aria-pressed={sel === o.id} onClick={() => setSel(o.id)}>{o.label}</button>)}
        </div>
      </div>
    </div>
  ) : undefined;
  return <EntRxTool key={sel} id={sel} population={population} />;
}
