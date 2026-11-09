import { REGISTRY_SYNCED_AT, registrySummary } from "@/lib/drugs/registry";
import DrugsClient from "./DrugsClient";

/* Trang may chu: gan tinh trang so dang ky (Cuc QLD) dang rut gon cho danh sach phia client. */
export default function DrugsPage() {
  return <DrugsClient registry={registrySummary()} syncedAt={REGISTRY_SYNCED_AT} />;
}
