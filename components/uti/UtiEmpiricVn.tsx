"use client";
/* Tab Hướng dẫn Việt Nam của các mặt bệnh tiết niệu trong trang phác đồ kinh nghiệm. */
import UtiTool from "./UtiTool";
import { CONDITIONS } from "@/data/uti-antibiotics/conditions";
import { UTI_CONFIG } from "@/data/uti-antibiotics/config";
import { PUBLIC_REGIMENS } from "@/data/uti-antibiotics/public-regimens";
import { INTL_GUIDELINES, getIntlEntry } from "@/data/antibiotics/empiric/international";

const yearOf = (published: string) => String(published).match(/\d{4}/)?.[0] ?? published;

const SOURCE_LABEL: Record<string, string> = {
  "eau-ui-2026": "Hội Tiết niệu châu Âu (EAU). Guidelines on Urological Infections",
  "idsa-cuti-2025": "Hiệp hội Bệnh truyền nhiễm Hoa Kỳ (IDSA). Guideline on Complicated Urinary Tract Infections",
};

/* Hướng dẫn quốc tế của mặt bệnh, mới nhất trước. */
function intlSourcesOf(diseaseId: string) {
  return (getIntlEntry(diseaseId)?.guidelineIds ?? [])
    .map((id) => INTL_GUIDELINES[id])
    .filter((g): g is NonNullable<typeof g> => !!g)
    .sort((a, b) => Number(yearOf(b.published)) - Number(yearOf(a.published)))
    .map((g) => ({ label: `${SOURCE_LABEL[g.id] ?? `${g.org}. ${g.title}`} (${yearOf(g.published)})`, url: g.url }));
}

const PRESET: Record<string, { site: string; form?: string; scopeNote?: string }> = {
  "v8-17": { site: "Viêm thận bể thận cấp" },
  "v8-16": { site: "Viêm bàng quang cấp", form: "Viêm bàng quang cấp" },
  "v8-2": { site: "Sỏi thận tiết niệu nhiễm trùng", form: "Có biến chứng", scopeNote: "Phác đồ áp dụng cho sỏi thận tiết niệu nhiễm trùng có biến chứng." },
};

export const isUtiEmpiric = (diseaseId: string) => diseaseId in PRESET;

export default function UtiEmpiricVn({ diseaseId }: { diseaseId: string }) {
  const preset = PRESET[diseaseId];
  return (
    <UtiTool
      key={diseaseId}
      embedded
      conditions={CONDITIONS}
      regimens={PUBLIC_REGIMENS}
      config={UTI_CONFIG}
      intlSources={intlSourcesOf(diseaseId)}
      initial={{ site: preset.site, form: preset.form }}
      scopeNote={preset.scopeNote}
    />
  );
}
