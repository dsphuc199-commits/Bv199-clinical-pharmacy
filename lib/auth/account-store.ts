import { z } from "zod";
import { adminStorageConfigured, readPrivateJson, writePrivateJson, type PrivateSnapshot } from "../admin/private-json-store";

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
export type AccountSnapshot = PrivateSnapshot<AccountRegistry>;

const PATH = "bv199-admin/accounts-v1.json";

export const accountStorageConfigured = adminStorageConfigured;

export function readAccountRegistry(): Promise<AccountSnapshot> {
  return readPrivateJson(PATH, (value) => registry.parse(value), { accounts: [], audit: [] });
}

export function writeAccountRegistry(snapshot: AccountSnapshot): Promise<void> {
  return writePrivateJson(PATH, snapshot);
}
