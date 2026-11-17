"use client";
/* Tab Quốc tế (Phác đồ kinh nghiệm) cho mặt bệnh Tai Mũi Họng: chọn quần thể rồi dùng thẻ chọn kháng sinh nhanh của module ENT. */
import { useState } from "react";
import { ENT_EMPIRIC_MAP } from "@/data/ent";
import { EntDiseaseBody } from "./EntDiseasePage";
import { EntEmbedded } from "./QuickCard";

export function isEntEmpiric(diseaseId: string) {
  return diseaseId in ENT_EMPIRIC_MAP;
}

export default function EntIntlTool({ diseaseId }: { diseaseId: string }) {
  const opts = ENT_EMPIRIC_MAP[diseaseId] ?? [];
  const [sel, setSel] = useState(opts[0]?.id);
  if (!sel) return null;
  return (
    <EntEmbedded.Provider value={true}>
    <div className="ent-page ent-embedded">
      {opts.length > 1 && (
        <div className="ent-switch" role="group" aria-label="Chọn quần thể">
          {opts.map((o) => <button key={o.id} type="button" aria-pressed={sel === o.id} onClick={() => setSel(o.id)}>{o.label}</button>)}
        </div>
      )}
      <EntDiseaseBody key={sel} id={sel} embedded />
    </div>
    </EntEmbedded.Provider>
  );
}
