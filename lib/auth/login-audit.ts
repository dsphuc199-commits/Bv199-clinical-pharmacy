import { randomUUID } from "node:crypto";
import { BlobPreconditionFailedError } from "@vercel/blob";
import { z } from "zod";
import { readPrivateJson, writePrivateJson, type PrivateSnapshot } from "../admin/private-json-store";
import { AccountRole } from "./account-store";
import { auditLocationSchema, type AuditLocation } from "./audit-location";

export const LOGIN_AUDIT_LIMIT = 100;
const WRITE_TIMEOUT_MS = 3000;
const PATH = "bv199-admin/login-audit-v1.json";
const deviceLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
}).strict();

const auditEvents = z.array(z.object({
  id: z.uuid(),
  username: z.string().min(1),
  role: AccountRole,
  timestamp: z.iso.datetime(),
  location: auditLocationSchema.optional(),
  deviceLocation: deviceLocationSchema.optional(),
}));
type LoginAuditSnapshot = PrivateSnapshot<z.infer<typeof auditEvents>>;

export function readLoginAudit(signal?: AbortSignal): Promise<LoginAuditSnapshot> {
  return readPrivateJson(PATH, (value) => auditEvents.parse(value), [], signal);
}

const auditStorage = {
  read: readLoginAudit,
  write: (snapshot: LoginAuditSnapshot, signal?: AbortSignal) => writePrivateJson(PATH, snapshot, signal),
};

export async function recordSuccessfulLogin(
  username: string, role: AccountRole, now: number, storage = auditStorage,
  location?: AuditLocation,
): Promise<void> {
  const event = {
    id: randomUUID(),
    username,
    role,
    timestamp: new Date(now).toISOString(),
    ...(location ? { location } : {}),
  };
  const controller = new AbortController();
  const { signal } = controller;
  const timeout = setTimeout(() => controller.abort(), WRITE_TIMEOUT_MS);

  try {
    let snapshot = await storage.read(signal);
    for (let attempt = 0; attempt < 5; attempt++) {
      if (snapshot.data.some(({ id }) => id === event.id)) return;
      const data = [event, ...snapshot.data]
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, LOGIN_AUDIT_LIMIT);
      try {
        await storage.write({ ...snapshot, data }, signal);
        return;
      } catch (error) {
        signal.throwIfAborted();
        if (attempt === 4 || (snapshot.etag && !(error instanceof BlobPreconditionFailedError))) throw error;
        // Two writes may also race to create the file before it has an ETag.
        snapshot = await storage.read(signal);
        if (!snapshot.etag) throw error;
      }
    }
  } finally {
    clearTimeout(timeout);
  }
}
