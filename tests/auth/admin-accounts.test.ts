import assert from "node:assert/strict";
import { test } from "node:test";
import { applyAccountChange, parseAccountChange } from "../../lib/auth/account-changes";
import { resolveSession } from "../../lib/auth/access";
import type { AccountRegistry } from "../../lib/auth/account-store";
import {
  ADMIN_SESSION_TTL_SECONDS, createSession, hashPassword, readSignedSession, verifyPassword, type AuthConfig,
} from "../../lib/auth/session";

const config: AuthConfig = {
  configured: true,
  secret: "isolated-test-signing-key-not-used-in-production",
  users: new Map([["bootstrap", hashPassword("Fixture-bootstrap-only")], ["existing", hashPassword("Fixture-existing-only")]]),
};
const now = Date.now();
const base: AccountRegistry = { accounts: [], audit: [] };
const sign = (username: string, scope?: { admin?: boolean; revision?: string }) => {
  const claims = readSignedSession(createSession(username, config.secret, now, scope), config, now);
  assert.ok(claims);
  return claims;
};

function change(fields: Record<string, string>) {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) form.set(name, value);
  return parseAccountChange(form);
}

const profile = { username: "nv.thu", displayName: "Tài khoản thử", department: "Khoa Dược", role: "viewer" };

test("existing users can continue using the app and need a new session after an admin grant", (t) => {
  const previous = process.env.AUTH_ADMIN_USERS;
  t.after(() => {
    if (previous === undefined) delete process.env.AUTH_ADMIN_USERS;
    else process.env.AUTH_ADMIN_USERS = previous;
  });
  process.env.AUTH_ADMIN_USERS = "bootstrap";
  assert.equal(resolveSession(sign("existing"), config)?.admin, false);
  assert.equal(resolveSession(sign("bootstrap"), config)?.admin, false);
  const admin = sign("bootstrap", { admin: true });
  assert.equal(resolveSession(admin, config)?.admin, true);
  assert.equal(admin.exp, Math.floor(now / 1000) + ADMIN_SESSION_TTL_SECONDS);
  process.env.AUTH_ADMIN_USERS = "";
  assert.equal(resolveSession(admin, config)?.admin, false);
});

test("creation, role changes, account locks and password resets enforce access and record an audit event", (t) => {
  const previous = process.env.AUTH_ADMIN_USERS;
  t.after(() => {
    if (previous === undefined) delete process.env.AUTH_ADMIN_USERS;
    else process.env.AUTH_ADMIN_USERS = previous;
  });
  process.env.AUTH_ADMIN_USERS = "bootstrap";

  const operator = sign("bootstrap", { admin: true });
  const newAccount = { ...profile, username: " NV.THU ", intent: "created" };
  const firstPassword = "T6v!aX";
  assert.throws(() => change({ ...newAccount, password: firstPassword.slice(1) }), /6 ký tự/);
  const creation = change({ ...newAccount, password: firstPassword });
  assert.throws(() => applyAccountChange(base, config, sign("existing"), creation), /Phiên quản trị/);
  const created = applyAccountChange(base, config, operator, creation);
  const [viewer] = created.accounts;
  assert.equal(viewer.username, "nv.thu");
  assert.equal(verifyPassword(firstPassword, viewer.passwordHash), true);
  assert.equal(created.audit[0].actor, "bootstrap");
  assert.equal(JSON.stringify(created.audit).includes("passwordHash"), false);
  assert.throws(() => applyAccountChange(created, config, operator, creation), /đã được sử dụng/);
  const collision = change({ ...profile, intent: "created", username: "existing", password: "Fixture-user-password" });
  assert.throws(() => applyAccountChange(created, config, operator, collision), /qua Vercel/);

  const viewerClaims = sign(viewer.username, { revision: viewer.revision });
  assert.equal(resolveSession(viewerClaims, config, created)?.admin, false);
  const grantAdmin = change({ ...profile, intent: "updated", enabled: "on", role: "pharmacy-admin", expectedRevision: viewer.revision });
  const promoted = applyAccountChange(created, config, operator, grantAdmin);
  const [pharmacyAdmin] = promoted.accounts;
  assert.equal(resolveSession(viewerClaims, config, promoted), null);
  const adminClaims = sign(pharmacyAdmin.username, { revision: pharmacyAdmin.revision, admin: true });
  assert.equal(resolveSession(adminClaims, config, promoted)?.admin, true);
  assert.throws(() => applyAccountChange(promoted, config, operator, grantAdmin), /vừa thay đổi/);

  const lock = change({ ...profile, intent: "updated", enabled: "off", role: "pharmacy-admin", expectedRevision: pharmacyAdmin.revision });
  assert.throws(() => applyAccountChange(promoted, config, adminClaims, lock), /không thể khóa/);
  const locked = applyAccountChange(promoted, config, operator, lock);
  assert.equal(resolveSession(adminClaims, config, locked), null);
  assert.throws(() => applyAccountChange(locked, config, adminClaims, creation), /Phiên quản trị/);
  const resetFields = { username: viewer.username, intent: "passwordReset", expectedRevision: locked.accounts[0].revision };
  const replacementPassword = "Qj6!3n";
  assert.throws(() => change({ ...resetFields, password: replacementPassword.slice(1) }), /6 ký tự/);
  const reset = change({ ...resetFields, password: replacementPassword });
  const final = applyAccountChange(locked, config, operator, reset);
  assert.equal(final.accounts[0].enabled, false);
  assert.equal(verifyPassword(firstPassword, final.accounts[0].passwordHash), false);
  assert.equal(verifyPassword(replacementPassword, final.accounts[0].passwordHash), true);
  assert.equal(final.audit.length, 4);
  assert.equal(final.audit[0].action, "passwordReset");
});
