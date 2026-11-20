import { REGISTRY_SYNCED_AT, registrySummary } from "@/lib/drugs/registry";
import { loadDrugPublications } from "@/lib/drugs/catalog-store";
import DrugsClient from "./DrugsClient";

export const dynamic = "force-dynamic";

export default async function DrugsPage() {
  const publications = await loadDrugPublications().catch(() => null);
  if (!publications) return <p role="status" className="p-6">Tạm thời chưa tải được danh mục thuốc. Hãy tải lại trang.</p>;
  return <DrugsClient registry={registrySummary()} syncedAt={REGISTRY_SYNCED_AT} publications={publications} />;
}
