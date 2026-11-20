import { z } from "zod";
import { adminStorageConfigured, readPrivateJson, writePrivateJson, type PrivateSnapshot } from "./private-json-store";
import type { BiliaryPublication } from "@/lib/antibiotics/biliary-protocol";

const httpsUrl = z.string().trim().max(2048).refine((value) => {
  try {
    const url = new URL(value);
    return /^https:\/\//i.test(value) && url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
});

export const protocolContentSchema = z.object({
  doses: z.record(z.string().max(140), z.string().trim().min(1).max(400)),
  mildDuration: z.string().trim().min(1).max(250),
  moderateSevereDuration: z.string().trim().min(1).max(250),
  source: z.object({
    title: z.string().trim().min(1).max(200),
    locator: z.string().trim().min(1).max(200),
    url: httpsUrl,
  }),
});

const revision = z.object({
  revision: z.uuid(), timestamp: z.iso.datetime(), actor: z.string(),
  reason: z.string().min(1).max(1000), content: protocolContentSchema,
});

const history = z.object({
  draft: revision.extend({ basedOn: z.string() }).nullable(),
  releases: z.array(revision.extend({ preparedBy: z.string() })),
});

export type BiliaryProtocolHistory = z.infer<typeof history>;
export const EMPTY_BILIARY_HISTORY: BiliaryProtocolHistory = { draft: null, releases: [] };
const PATH = "bv199-admin/biliary-protocol-v1.json";

export function readBiliaryHistory(): Promise<PrivateSnapshot<BiliaryProtocolHistory>> {
  return readPrivateJson(PATH, (data) => history.parse(data), EMPTY_BILIARY_HISTORY);
}

export function writeBiliaryHistory(snapshot: PrivateSnapshot<BiliaryProtocolHistory>): Promise<void> {
  return writePrivateJson(PATH, snapshot);
}

export function biliaryPublication(history: BiliaryProtocolHistory): BiliaryPublication | null {
  const published = history.releases[0];
  if (!published) return null;
  const { revision, timestamp, content } = published;
  return { revision, timestamp, content };
}

export async function getBiliaryPublication(): Promise<BiliaryPublication | null> {
  if (!adminStorageConfigured()) return null;
  return biliaryPublication((await readBiliaryHistory()).data);
}
