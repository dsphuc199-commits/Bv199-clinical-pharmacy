import EvidenceManager, { type EvidenceSearch } from "../_evidence/EvidenceManager";

export default function AdminReferencesPage({ searchParams }: { searchParams: Promise<EvidenceSearch> }) {
  return <EvidenceManager kind="references" searchParams={searchParams} />;
}
