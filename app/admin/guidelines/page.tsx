import EvidenceManager, { type EvidenceSearch } from "../_evidence/EvidenceManager";

export default function AdminGuidelinesPage({ searchParams }: { searchParams: Promise<EvidenceSearch> }) {
  return <EvidenceManager kind="guidelines" searchParams={searchParams} />;
}
