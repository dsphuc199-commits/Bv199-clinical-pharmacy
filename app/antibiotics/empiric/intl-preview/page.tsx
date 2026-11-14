/* Xem trước JSON mẫu chuẩn (data/guidelines/intl/_reference) bằng IntlGuidelineView – dùng cho test so sánh
   tests/empiric/intl-render-browser.cjs. Chỉ mở ở môi trường phát triển (production → 404). */
import { notFound } from "next/navigation";
import IntlGuidelineView from "@/components/antibiotics/empiric/IntlGuidelineView";
import gnb from "@/data/guidelines/intl/_reference/nkh-gram-am.json";
import sab from "@/data/guidelines/intl/_reference/nkh-s-aureus.json";

const REFS: Record<string, unknown> = { "nkh-gram-am": gnb, "nkh-s-aureus": sab };

export default async function IntlPreviewPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const ref = (await searchParams).ref;
  const data = typeof ref === "string" ? REFS[ref] : undefined;
  if (!data) return <main style={{ padding: 16 }}><p>Chọn: {Object.keys(REFS).map((k) => <a key={k} href={`?ref=${k}`} style={{ marginRight: 12 }}>{k}</a>)}</p></main>;
  return <main style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}><IntlGuidelineView data={data} /></main>;
}
