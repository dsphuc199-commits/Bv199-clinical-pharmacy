/*
  FILE: lib/antibiotics/source-citation.ts

  Trich dan nguon gon cho muc "Nguồn và đối chiếu": chi gom co quan ban hanh, so quyet dinh,
  ten van ban, nam ban hanh (van ban moi nhat truoc). Vi tri muc/bang/trang van giu trong du lieu
  va trong khoi "Vì sao chọn phác đồ này?" – khong hien o day.
*/

import { DOCS } from "@/data/antibiotics/empiric/regimens/sources";
import { INTL_GUIDELINES, type IntlGuideline } from "@/data/antibiotics/empiric/international";
import { ARCHIVED_SOURCE_LINKS } from "@/lib/antibiotics/presentation-source-links";

export type Citation = { key: string; label: string; title?: string; detail?: string; note?: string; year?: number; url?: string };

export function citeIntlGuideline(guideline: Pick<IntlGuideline, "id" | "org" | "title" | "published" | "sourceNote" | "url">): Citation {
  return {
    key: guideline.id,
    label: guideline.title,
    detail: [guideline.org, guideline.published].filter(Boolean).join(" · "),
    note: guideline.sourceNote,
    year: Number(guideline.published.match(/\b(?:19|20)\d{2}\b/)?.[0]) || undefined,
    url: guideline.url,
  };
}

export function citeIntlSources(ids: readonly string[]): Citation[] {
  return ids.flatMap((id) => {
    const guideline = INTL_GUIDELINES[id];
    return guideline ? [citeIntlGuideline(guideline)] : [];
  });
}

type DecisionInfo = { number: string; issuer: string; title: string; date: string };

/* Van ban dung trong module rieng nhung khong nam trong DOCS cua phac do BYT. */
const EXTRA_DECISIONS: Record<string, DecisionInfo> = {
  "2131": { number: "2131/QĐ-BYT", issuer: "Bộ Y tế", title: "Hướng dẫn chẩn đoán và điều trị bệnh phổi tắc nghẽn mạn tính", date: "14/07/2026" },
};

function decisionByNumber(n: string): DecisionInfo | undefined {
  const doc = Object.values(DOCS).find((d) => d.number.split("/")[0] === n);
  if (doc) return { number: doc.number, issuer: doc.issuer, title: doc.title, date: doc.date };
  return EXTRA_DECISIONS[n];
}

const yearOf = (date: string) => Number(date.match(/(\d{4})\s*$/)?.[1]) || undefined;

/** Bo vi tri (muc, bang, trang, phu luc, chuong) khoi trich dan khong phai quyet dinh BYT. */
function stripLocation(text: string): string {
  return text
    .split(/\s+[–—-]\s+(?=(?:Bảng|Mục|mục|tr\.|Phụ lục|Chương|PDF|Điều)\b)/u)[0]
    .replace(/[;,]\s*(?:tr\.|trang|PDF).*$/u, "")
    .trim();
}

/** Mot dong nguon tu do -> trich dan chuan. */
export function citeSource(text: string): Citation {
  const m = text.match(/(?:QĐ|Quyết định(?: số)?)\s*(\d{2,5})(?:\s*\/\s*QĐ-BYT)?/u) ?? text.match(/\b(\d{2,5})\/QĐ-BYT/u);
  const info = m ? decisionByNumber(m[1]) : undefined;
  if (info) {
    const year = yearOf(info.date);
    const link = ARCHIVED_SOURCE_LINKS.find((l) => l.id === `VN${info.number.split("/")[0]}`);
    return {
      key: info.number,
      label: `${info.issuer}. Quyết định ${info.number} – ${info.title}${year ? ` (${year})` : ""}`,
      title: `Quyết định ${info.number} – ${info.title}`,
      detail: `${info.issuer} · ${info.date}`,
      year,
      url: link?.url,
    };
  }
  if (/^(?:HAP|VAP) 2023\b|Khuyến cáo VPBV\/VPLQTM 2023|Hội Hô hấp VN & Hội HSCC-CĐ VN|khuyến cáo Hội 2023/iu.test(text)) {
    const detail = "Hội Hô hấp Việt Nam và Hội Hồi sức cấp cứu và Chống độc Việt Nam";
    const title = "Khuyến cáo chẩn đoán và điều trị viêm phổi bệnh viện, viêm phổi liên quan thở máy";
    return { key: "VNRS-HAP-VAP-2023", label: `${detail}. ${title} (2023)`, title, detail, year: 2023 };
  }
  const label = stripLocation(text);
  return { key: label, label, year: Number(label.match(/\b(19|20)\d{2}\b/)?.[0]) || undefined };
}

export function citeSourceLabel(label: string): Citation {
  const citation = citeSource(label);
  if (citation.title) return citation;
  const match = /^(.*?)\s+[–—]\s+(.+)$/u.exec(label);
  if (!match || !/[\p{Lu}\d]/u.test(match[1])) return citation;
  const [, attribution, title] = match;
  const year = attribution.match(/\b(?:19|20)\d{2}\b/g)?.at(-1);
  return { ...citation, title, detail: attribution, year: year ? Number(year) : citation.year };
}

/** Danh sach trich dan khong trung lap, van ban moi nhat truoc. */
export function citeSources(texts: string[]): Citation[] {
  const seen = new Map<string, Citation>();
  for (const t of texts) {
    if (!t || !t.trim()) continue;
    const c = citeSource(t);
    if (!seen.has(c.key)) seen.set(c.key, c);
  }
  return [...seen.values()].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}
