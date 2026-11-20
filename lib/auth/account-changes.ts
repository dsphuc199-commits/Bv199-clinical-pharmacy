import { randomUUID } from "node:crypto";
import { z } from "zod";
import { AccountRole, type AccountAuditEvent, type AccountRegistry } from "./account-store";
import { hashPassword, normalizeUsername, type AuthConfig, type SessionClaims } from "./session";
import { resolveSession } from "./access";

const username = z.string().transform(normalizeUsername).pipe(z.string().regex(/^[a-z0-9][a-z0-9._-]{2,47}$/));
const password = z.string().min(12).max(128).refine((value) => value === value.normalize("NFC").trim());
const expectedRevision = z.uuid();
const profile = {
  username,
  displayName: z.string().trim().min(1).max(100),
  department: z.string().trim().max(100),
  role: AccountRole,
};

const accountChange = z.discriminatedUnion("intent", [
  z.object({ intent: z.literal("created"), ...profile, password }),
  z.object({ intent: z.literal("updated"), ...profile, enabled: z.enum(["on", "off"]), expectedRevision }),
  z.object({ intent: z.literal("passwordReset"), username, password, expectedRevision }),
]);

export class AccountChangeError extends Error {}

export function parseAccountChange(form: FormData) {
  const result = accountChange.safeParse(Object.fromEntries(form));
  if (!result.success) throw new AccountChangeError("Kiểm tra tên đăng nhập, họ tên, vai trò và mật khẩu. Mật khẩu cần từ 12 ký tự.");
  return result.data;
}

export function applyAccountChange(
  registry: AccountRegistry, config: AuthConfig, claims: SessionClaims, change: z.infer<typeof accountChange>
): AccountRegistry {
  if (!resolveSession(claims, config, registry)?.admin) throw new AccountChangeError("Phiên quản trị đã hết hiệu lực. Hãy đăng nhập lại.");
  if (config.users.has(change.username)) throw new AccountChangeError("Tài khoản cấu hình trên máy chủ được quản lý qua Vercel.");

  const existing = registry.accounts.find((item) => item.username === change.username);
  const revision = randomUUID();
  let account;

  if (change.intent === "created") {
    if (existing) throw new AccountChangeError("Tên đăng nhập đã được sử dụng.");
    account = {
      username: change.username, displayName: change.displayName, department: change.department,
      role: change.role, enabled: true, passwordHash: hashPassword(change.password), revision,
    };
  } else {
    if (!existing) throw new AccountChangeError("Không tìm thấy tài khoản.");
    if (existing.revision !== change.expectedRevision) {
      throw new AccountChangeError("Tài khoản vừa thay đổi. Tải lại trang trước khi lưu.");
    }
    if (change.intent === "passwordReset") {
      account = { ...existing, passwordHash: hashPassword(change.password), revision };
    } else {
      const enabled = change.enabled === "on";
      if (claims.user === change.username && (!enabled || change.role !== existing.role)) {
        throw new AccountChangeError("Bạn không thể khóa hoặc đổi quyền của tài khoản đang dùng.");
      }
      const accessChanged = enabled !== existing.enabled || change.role !== existing.role;
      account = {
        ...existing, displayName: change.displayName, department: change.department,
        role: change.role, enabled, revision: accessChanged ? revision : existing.revision,
      };
    }
  }

  const event: AccountAuditEvent = {
    id: randomUUID(), timestamp: new Date().toISOString(), actor: claims.user, target: change.username,
    action: change.intent, before: existing && { role: existing.role, enabled: existing.enabled },
    after: { role: account.role, enabled: account.enabled },
  };
  return {
    accounts: existing
      ? registry.accounts.map((item) => item.username === account.username ? account : item)
      : [...registry.accounts, account],
    audit: [event, ...registry.audit],
  };
}
