import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { BlobPreconditionFailedError } from "@vercel/blob";
import { auditLocation, formatAuditLocation } from "../../lib/auth/audit-location";
import { LOGIN_AUDIT_LIMIT, readLoginAudit, readLoginDeviceLocation, recordSuccessfulLogin } from "../../lib/auth/login-audit";

type Snapshot = Awaited<ReturnType<typeof readLoginAudit>>;
const now = Date.UTC(2026, 0, 1, 10);

function privateStorage(initial: Snapshot) {
  let current = initial;
  let revision = 0;
  return {
    read: async () => current,
    write: async (snapshot: Snapshot) => {
      if (snapshot.etag !== current.etag) {
        if (!snapshot.etag) throw new Error("File already exists");
        throw new BlobPreconditionFailedError();
      }
      current = { data: snapshot.data, etag: `test-${++revision}` };
    },
  };
}

test("concurrent successful logins keep both events during creation and updates", async () => {
  const storage = privateStorage({ data: [] });
  await Promise.all([
    recordSuccessfulLogin("admin-fixture", "pharmacy-admin", now, storage),
    recordSuccessfulLogin("viewer-fixture", "viewer", now + 2000, storage),
  ]);
  await Promise.all([
    recordSuccessfulLogin("viewer-fixture", "viewer", now + 3000, storage),
    recordSuccessfulLogin("admin-fixture", "pharmacy-admin", now + 1000, storage),
  ]);
  const { data } = await storage.read();
  assert.deepEqual(data.map(({ username, role }) => [username, role]), [
    ["viewer-fixture", "viewer"], ["viewer-fixture", "viewer"],
    ["admin-fixture", "pharmacy-admin"], ["admin-fixture", "pharmacy-admin"],
  ]);
  assert.equal(new Set(data.map(({ id }) => id)).size, 4);
  assert.deepEqual(Object.keys(data[0]).sort(), ["id", "role", "timestamp", "username"]);
});

test("late writes retain the most recent events ordered by actual login time", async () => {
  const data = Array.from({ length: LOGIN_AUDIT_LIMIT }, (_, i) => ({
    id: randomUUID(), username: `viewer-${i}`, role: "viewer" as const,
    timestamp: new Date(now - i * 1000).toISOString(),
  }));
  const storage = privateStorage({ data, etag: "initial" });
  await recordSuccessfulLogin("newest", "viewer", now + 1000, storage);
  await recordSuccessfulLogin("late", "viewer", now - LOGIN_AUDIT_LIMIT * 1000, storage);
  assert.deepEqual((await storage.read()).data.map(({ username }) => username), [
    "newest", ...data.slice(0, -1).map(({ username }) => username),
  ]);
});

test("login audit keeps older records and stores the available device and IP locations", async () => {
  const storage = privateStorage({ data: [] });
  const form = new FormData();
  assert.equal(readLoginDeviceLocation(form), undefined);
  form.set("loginLatitude", "91");
  form.set("loginLongitude", "108.2022345");
  assert.equal(readLoginDeviceLocation(form), undefined);
  form.set("loginLatitude", "16.0544678");
  const deviceLocation = readLoginDeviceLocation(form);
  const headers = new Headers({
    "x-vercel-ip-city": encodeURIComponent("Đà Nẵng"),
    "x-vercel-ip-country": "VN",
  });
  assert.equal(auditLocation(headers, false), undefined);
  const location = auditLocation(headers, true);

  await recordSuccessfulLogin("viewer-fixture", "viewer", now, storage);
  await recordSuccessfulLogin("viewer-fixture", "viewer", now + 1000, storage, { location, deviceLocation });

  const { data } = await storage.read();
  assert.deepEqual(data[0].deviceLocation, { latitude: 16.054, longitude: 108.202 });
  assert.equal(formatAuditLocation(data[0].location), "Đà Nẵng, Việt Nam");
  assert.equal(data[1].deviceLocation, undefined);
  assert.equal(data[1].location, undefined);
});

test("an unresponsive read cancels the audit attempt before writing", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const storage = {
    read: (signal?: AbortSignal) => new Promise<Snapshot>((_, reject) => {
      assert(signal);
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    }),
    write: async () => assert.fail("Should only write after reading the existing audit data"),
  };
  const rejected = assert.rejects(recordSuccessfulLogin("viewer-fixture", "viewer", now, storage), { name: "AbortError" });
  t.mock.timers.tick(3000);
  await rejected;
});
