"use client";
/* Tab Quoc te cua nhiem khuan tiet nieu phuc tap, viem than be than: chon huong dan IDSA 2025 hoac EAU 2026. */
import { useState } from "react";
import UrologyEau2026 from "./UrologyEau2026";
import UtiIdsa2025 from "./UtiIdsa2025";
import { RxToolStyle, Seg } from "./rx-tool";

const TITLE: Record<string, string> = { "v8-2": "Nhiễm khuẩn tiết niệu phức tạp", "v8-17": "Viêm thận bể thận" };

export default function UtiIntlTools({ diseaseId }: { diseaseId: string }) {
  const [source, setSource] = useState<"idsa" | "eau">("idsa");
  return (
    <>
      <div className="uti-intl-source">
        <Seg label="Hướng dẫn" value={source} onChange={setSource} options={[{ id: "idsa", label: "IDSA 2025" }, { id: "eau", label: "EAU 2026" }] as const} />
      </div>
      {source === "idsa" ? <UtiIdsa2025 key={diseaseId} title={TITLE[diseaseId]} /> : <UrologyEau2026 key={diseaseId} diseaseId={diseaseId} />}
      <RxToolStyle />
    </>
  );
}
