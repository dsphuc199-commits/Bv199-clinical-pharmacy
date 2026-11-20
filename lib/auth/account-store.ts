import { get, put } from "@vercel/blob";
import { z } from "zod";

export const AccountRole = z.enum(["viewer", "pharmacy-admin"]);
export type AccountRole = z.infer<typeof AccountRole>;

export const ACCOUNT_ROLE_LABELS: Record<AccountRole, string> = {
  viewer: "Người dùng",
  "pharmacy-admin": "Quản trị Khoa Dược",
};

const account = z.object({
  username: z.string(),
  displayName: z.string(),
  department: z.string(),
  role: AccountRole,
  enabled: z.boolean(),
  passwordHash: z.string(),
  revision: z.string(),
});

export const AUDIT_ACTIONS = {
  created: "Tạo tài khoản",
  updated: "Cập nhật tài khoản",
  passwordReset: "Đặt lại mật khẩu",
};

const auditEvent = z.object({
  id: z.string(),
  timestamp: z.iso.datetime(),
  actor: z.string(),
  target: z.string(),
  action: z.enum(["created", "updated", "passwordReset"]),
  before: account.pick({ role: true, enabled: true }).optional(),
  after: account.pick({ role: true, enabled: true }),
});

const registry = z.object({
  accounts: z.array(account),
  audit: z.array(auditEvent),
});

export type ManagedAccount = z.infer<typeof account>;
export type AccountAuditEvent = z.infer<typeof auditEvent>;
export type AccountRegistry = z.infer<typeof registry>;
export type AccountSnapshot = { data: AccountRegistry; etag?: string };

const PATH = "bv199-admin/accounts-v1.json";

function storageToken(): string | undefined {
  return process.env.AUTH_ACCOUNTS_BLOB_TOKEN ||
    (process.env.AUTH_ACCOUNTS_USE_PROJECT_BLOB === "1" ? process.env.BLOB_READ_WRITE_TOKEN : undefined);
}

export function accountStorageConfigured(): boolean {
  return !!storageToken();
}

export async function readAccountRegistry(): Promise<AccountSnapshot> {
  const token = storageToken();
  if (!token) throw new Error("Account storage is not configured");
  const result = await get(PATH, { access: "private", token, useCache: false });
  if (!result) return { data: { accounts: [], audit: [] } };
  if (result.statusCode !== 200) throw new Error("Unexpected account storage response");
  return { data: registry.parse(await new Response(result.stream).json()), etag: result.blob.etag };
}

export async function writeAccountRegistry(snapshot: AccountSnapshot): Promise<void> {
  const token = storageToken();
  if (!token) throw new Error("Account storage is not configured");
  await put(PATH, JSON.stringify(snapshot.data), {
    access: "private",
    token,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: !!snapshot.etag,
    ifMatch: snapshot.etag,
  });
}
