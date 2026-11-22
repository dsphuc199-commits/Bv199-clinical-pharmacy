import { randomUUID } from "node:crypto";
import { BlobPreconditionFailedError } from "@vercel/blob";
import { z } from "zod";
import { BILIARY_BASE_CONTENT, BILIARY_BASE_REVISION } from "@/lib/antibiotics/biliary-protocol";
import { readBiliaryHistory } from "./biliary-protocol-store";
import { readPrivateJson, writePrivateJson, type PrivateSnapshot } from "./private-json-store";
import { proposalSchema, reviewPublicGuideline, validateFindings } from "./guideline-watch-ai";
import { loadEvidence, officialUrl, scanWatchSource, SourceError, WATCH_SOURCES, type DetectedDocument } from "./guideline-watch-sources";

const PATH = "bv199-admin/guideline-watch-v1.json";
const sourceId = z.enum(WATCH_SOURCES.map(({ id }) => id));
const documentId = z.string().regex(/^[a-f0-9]{24}$/);
const official = z.string().max(1000).refine((value) => {
  try { return !!officialUrl(value); } catch { return false; }
});
const detectionSchema = z.object({
  id: documentId, sourceId, topic: z.enum(["biliary", "cap"]), title: z.string().max(250), url: official,
  fullText: z.enum(["idsa-html", "pdf", "manual"]), fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
  pdfUrl: official.optional(), replacement: z.string().max(250).optional(), notice: z.enum(["correction", "withdrawal"]).optional(),
});
const watchEntry = detectionSchema.extend({
  detectedAt: z.iso.datetime(),
  analysis: z.discriminatedUnion("status", [
    z.object({ status: z.literal("running"), id: z.uuid(), at: z.iso.datetime() }),
    z.object({ status: z.literal("done"), proposal: proposalSchema }),
    z.object({ status: z.literal("failed"), message: z.string(), at: z.iso.datetime() }),
  ]).optional(),
});
const checkSchema = z.object({
  sourceId, status: z.enum(["ok", "failed"]), at: z.iso.datetime(), lastSuccess: z.iso.datetime().optional(),
  error: z.string().optional(), active: z.array(documentId),
});
const watchSchema = z.object({ checks: z.array(checkSchema), documents: z.array(watchEntry) });
export type WatchState = z.infer<typeof watchSchema>;
export type WatchEntry = z.infer<typeof watchEntry>;
type CheckResult = { sourceId: DetectedDocument["sourceId"]; documents: DetectedDocument[] } |
  { sourceId: DetectedDocument["sourceId"]; error: string };

export const watchError = (error: unknown, fallback: string) => error instanceof SourceError ? error.message : fallback;
export const readWatch = () => readPrivateJson(PATH, (value) => watchSchema.parse(value), { checks: [], documents: [] });

async function updateWatch(update: (state: WatchState) => WatchState | null): Promise<WatchState | null> {
  let snapshot: PrivateSnapshot<WatchState> = await readWatch();
  for (let attempt = 0; ; attempt++) {
    const data = update(snapshot.data);
    if (!data) return null;
    try {
      await writePrivateJson(PATH, { data, etag: snapshot.etag });
      return data;
    } catch (error) {
      if (attempt >= 3 || (snapshot.etag && !(error instanceof BlobPreconditionFailedError))) throw error;
      snapshot = await readWatch();
      if (!snapshot.etag) throw error;
    }
  }
}

export function mergeChecks(state: WatchState, results: CheckResult[], at: string): WatchState {
  const documents = new Map(state.documents.map((entry) => [entry.id, entry]));
  const checks = new Map(state.checks.map((entry) => [entry.sourceId, entry]));
  for (const result of results) {
    const previous = checks.get(result.sourceId);
    if (previous && previous.at >= at) continue;
    if ("error" in result) {
      checks.set(result.sourceId, {
        sourceId: result.sourceId, status: "failed", at, error: result.error,
        lastSuccess: previous?.lastSuccess, active: previous?.active ?? [],
      });
      continue;
    }
    for (const entry of result.documents) {
      if (!documents.has(entry.id)) documents.set(entry.id, { ...entry, detectedAt: at });
    }
    checks.set(result.sourceId, { sourceId: result.sourceId, status: "ok", at, lastSuccess: at, active: result.documents.map(({ id }) => id) });
  }
  return { checks: [...checks.values()], documents: [...documents.values()].sort((a, b) => b.detectedAt.localeCompare(a.detectedAt)) };
}

export function isCurrentDocument(state: WatchState, id: string): boolean {
  return state.checks.some(({ status, active }) => status === "ok" && active.includes(id));
}

export async function checkWatch(): Promise<WatchState> {
  const at = new Date().toISOString();
  const checks = await Promise.all(WATCH_SOURCES.map(async (source): Promise<CheckResult> => {
    try { return { sourceId: source.id, documents: await scanWatchSource(source) }; }
    catch (error) { return { sourceId: source.id, error: watchError(error, "Chưa truy cập được nguồn. Kết quả lần kiểm tra trước được giữ để đối chiếu.") }; }
  }));
  return (await updateWatch((state) => mergeChecks(state, checks, at))) ?? (await readWatch()).data;
}

export function readyForReview(entry: WatchEntry): boolean {
  return entry.topic === "biliary" && entry.fullText !== "manual" && !entry.notice;
}

function dueForScheduledReview(analysis: WatchEntry["analysis"], now: number): boolean {
  if (!analysis) return true;
  if (analysis.status === "done") return false;
  return now - Date.parse(analysis.at) >= 20 * 60 * 60 * 1000;
}

export async function prepareWatchProposal(id: string, token: string, allowRetry = true): Promise<void> {
  const attempt = randomUUID();
  const at = new Date().toISOString();
  const reserved = await updateWatch((state) => {
    const entry = state.documents.find((entry) => entry.id === id);
    if (!entry || !readyForReview(entry) || !isCurrentDocument(state, id)) throw new SourceError("Tài liệu chưa có toàn văn đã xác minh hoặc nguồn cần rà soát lại.");
    if (!allowRetry && !dueForScheduledReview(entry.analysis, Date.parse(at))) return null;
    if (entry.analysis?.status === "running" && Date.now() - Date.parse(entry.analysis.at) < 120_000) return null;
    return { ...state, documents: state.documents.map((entry) => entry.id === id ? { ...entry, analysis: { status: "running", id: attempt, at } } : entry) };
  });
  const entry = reserved?.documents.find((entry) => entry.id === id);
  if (!entry) return;
  let analysis: NonNullable<WatchEntry["analysis"]>;
  try {
    const [{ data: history }, passages] = await Promise.all([readBiliaryHistory(), loadEvidence(entry)]);
    const current = history.releases[0];
    const review = await reviewPublicGuideline(entry, passages, token);
    analysis = { status: "done", proposal: {
      basedOn: current?.revision ?? BILIARY_BASE_REVISION, model: review.model, createdAt: new Date().toISOString(),
      findings: validateFindings(review.value, review.relevant, current?.content ?? BILIARY_BASE_CONTENT),
    } };
  } catch (error) {
    analysis = { status: "failed", at: new Date().toISOString(), message: watchError(error, "Chưa hoàn thành đối chiếu nguồn và bản đang dùng. Có thể thử lại.") };
  }
  await updateWatch((state) => {
    if (!state.documents.some((entry) => entry.id === id && entry.analysis?.status === "running" && entry.analysis.id === attempt)) return null;
    return { ...state, documents: state.documents.map((entry) => entry.id === id ? { ...entry, analysis } : entry) };
  });
}

export async function reviewNextWatchEntry(state: WatchState, token: string) {
  const candidates = state.documents.filter((entry) => readyForReview(entry) && isCurrentDocument(state, entry.id));
  const entry = candidates.find(({ analysis }) => !analysis) ?? candidates.find(({ analysis }) => dueForScheduledReview(analysis, Date.now()));
  if (entry) await prepareWatchProposal(entry.id, token, false);
}
