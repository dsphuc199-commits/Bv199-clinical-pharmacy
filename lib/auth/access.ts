import {
  accountStorageConfigured, readAccountRegistry, type AccountRegistry, type AccountRole,
} from "./account-store";
import {
  checkCredentials, normalizeUsername, readSignedSession, type AuthConfig, type SessionClaims,
} from "./session";

function isConfiguredAdmin(user: string): boolean {
  return (process.env.AUTH_ADMIN_USERS ?? "").split(",").map(normalizeUsername).includes(user);
}

export function configuredRole(user: string): AccountRole {
  return isConfiguredAdmin(user) ? "pharmacy-admin" : "viewer";
}

export function resolveSession(
  claims: SessionClaims, config: AuthConfig, registry?: AccountRegistry
): SessionClaims | null {
  if (claims.revision === undefined) {
    if (!config.users.has(claims.user)) return null;
    return { ...claims, admin: claims.admin && isConfiguredAdmin(claims.user) };
  }
  const account = registry?.accounts.find((item) => item.username === claims.user);
  if (!account?.enabled || account.revision !== claims.revision || config.users.has(claims.user)) return null;
  return { ...claims, admin: claims.admin && account.role === "pharmacy-admin" };
}

export async function getAccountSession(token: string | undefined, config: AuthConfig): Promise<SessionClaims | null> {
  const claims = readSignedSession(token, config);
  if (!claims) return null;
  if (claims.revision === undefined) return resolveSession(claims, config);
  if (!accountStorageConfigured()) return null;
  try {
    return resolveSession(claims, config, (await readAccountRegistry()).data);
  } catch {
    return null;
  }
}

export async function authenticateAccount(config: AuthConfig, username: string, password: string) {
  const name = normalizeUsername(username);
  if (config.users.has(name) || !accountStorageConfigured()) {
    const user = checkCredentials(config, name, password);
    return user ? { user, admin: isConfiguredAdmin(user) } : null;
  }
  const snapshot = await readAccountRegistry();
  const account = snapshot.data.accounts.find((item) => item.username === name && item.enabled);
  const users = account ? new Map([[name, account.passwordHash]]) : new Map<string, string>();
  const user = checkCredentials({ ...config, users }, name, password);
  return user && account ? { user, admin: account.role === "pharmacy-admin", revision: account.revision } : null;
}
