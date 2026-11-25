import { REGISTRY_SYNCED_AT, registrySummary } from "@/lib/drugs/registry";
import { loadDrugPublications } from "@/lib/drugs/catalog-store";
import { catalogProducts } from "@/lib/drugs/catalog";
import { dtqgFor } from "@/lib/drugs/dtqg";
import { lasaFor } from "@/lib/drugs/lasa-match";
import DrugsClient, { type DrugFlags } from "./DrugsClient";

export const dynamic = "force-dynamic";

export default async function DrugsPage() {
  const publications = await loadDrugPublications().catch(() => null);
  if (!publications) return <p role="status" className="p-6">Tạm thời chưa tải được danh mục thuốc. Hãy tải lại trang.</p>;
  /* Nhãn nội dung đã kiểm chứng của từng thuốc: Dược thư (suy thận, thai kỳ) và LASA. */
  const flags: Record<string, DrugFlags> = {};
  for (const d of catalogProducts(publications)) {
    const m = dtqgFor(d.ingredientName);
    const f = { r: !!m.renal, p: !!m.pregnancy, l: lasaFor(d.brandName).length > 0 };
    if (f.r || f.p || f.l) flags[d.id] = f;
  }
  return <DrugsClient registry={registrySummary()} syncedAt={REGISTRY_SYNCED_AT} publications={publications} flags={flags} />;
}
