import { z } from "zod";
import { adminStorageConfigured, readPrivateJson, writePrivateJson, type PrivateSnapshot } from "./private-json-store";

export const recordKind = z.enum(["references", "guidelines"]);
export type EvidenceKind = z.infer<typeof recordKind>;
export const EVIDENCE_LABELS: Record<EvidenceKind, string> = {
  references: "Nguồn tài liệu",
  guidelines: "Phiên bản hướng dẫn",
};

const date = z.union([z.literal(""), z.iso.date()]);
const externalUrl = z.string().trim().max(2048).refine((url) => {
  try {
    const parsed = new URL(url);
    return /^https:\/\//i.test(url) && parsed.protocol === "https:" && !!parsed.hostname && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}, "Đường dẫn phải là URL HTTPS đến tài liệu.");

export const evidenceFields = z.object({
  title: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(150),
  url: externalUrl,
  version: z.string().trim().max(100),
  issuedOn: date,
  effectiveOn: date,
  scope: z.string().trim().min(1).max(250),
  diseaseId: z.string().max(24),
  visible: z.boolean(),
});

const revision = z.object({
  id: z.uuid(),
  kind: recordKind,
  fields: evidenceFields,
  revision: z.uuid(),
  timestamp: z.iso.datetime(),
  actor: z.string(),
  reason: z.string().min(1).max(1000),
});

const evidenceLibrary = z.object({
  drafts: z.array(revision.extend({ basedOn: z.string() })),
  releases: z.array(revision),
  audit: z.array(z.object({
    id: z.uuid(),
    kind: recordKind,
    action: z.enum(["saved", "published", "discarded"]),
    title: z.string(),
    reason: z.string(),
    timestamp: z.iso.datetime(),
    actor: z.string(),
  })),
});

export type EvidenceFields = z.infer<typeof evidenceFields>;
export type EvidenceRelease = z.infer<typeof revision>;
export type EvidenceLibrary = z.infer<typeof evidenceLibrary>;
export const EMPTY_EVIDENCE_LIBRARY: EvidenceLibrary = { drafts: [], releases: [], audit: [] };
export const evidenceLibraryConfigured = adminStorageConfigured;
const PATH = "bv199-admin/guideline-library-v1.json";

export function readEvidenceLibrary(): Promise<PrivateSnapshot<EvidenceLibrary>> {
  return readPrivateJson(PATH, (value) => evidenceLibrary.parse(value), EMPTY_EVIDENCE_LIBRARY);
}

export function writeEvidenceLibrary(snapshot: PrivateSnapshot<EvidenceLibrary>): Promise<void> {
  return writePrivateJson(PATH, snapshot);
}

export function latestEvidenceRecords(releases: EvidenceRelease[]): EvidenceRelease[] {
  const records = new Map<string, EvidenceRelease>();
  for (const release of releases) {
    if (!records.has(release.id)) records.set(release.id, release);
  }
  return [...records.values()];
}

export function publishedEvidence(library: EvidenceLibrary) {
  return latestEvidenceRecords(library.releases)
    .filter(({ fields }) => fields.visible)
    .map(({ id, kind, fields }) => ({ id, kind, fields }));
}

export async function loadPublishedEvidence() {
  if (!evidenceLibraryConfigured()) return [];
  const { data } = await readEvidenceLibrary();
  return publishedEvidence(data);
}
