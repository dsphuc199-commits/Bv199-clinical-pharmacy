/*
  FILE: lib/auth/session.ts

  Dang nhap don gian, khong dich vu ngoai:
  - Tai khoan trong bien moi truong AUTH_USERS = "ten1:scrypt.<salt>.<hash>,ten2:..." (chi luu ban bam;
    dung dau "." thay "$" vi trinh nap .env cua Next dien giai "$" thanh bien).
  - Phien: cookie httpOnly "<payload base64url>.<HMAC-SHA256>" ky bang AUTH_SECRET (>= 32 ky tu), khong het han
    trong thuc te (400 ngay, tu gia han khi su dung).
  - Chua cau hinh -> khoa toan bo (fail-closed).
  Tao ban bam mat khau: node scripts/auth-hash.cjs "<mat khau>"
*/

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "bv199_session";
/* Phien "khong het han": muc toi da trinh duyet cho phep (~400 ngay), tu gia han moi ngay khi dang dung.
   Ket thuc khi bam "Đăng xuất", xoa tai khoan khoi AUTH_USERS, hoac doi AUTH_SECRET (thu hoi moi phien). */
export const SESSION_TTL_SECONDS = 400 * 24 * 60 * 60;
export const SESSION_RENEW_AFTER_SECONDS = 24 * 60 * 60;

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 32 };

export type AuthConfig = { configured: boolean; secret: string; users: Map<string, string> };

export function authConfig(): AuthConfig {
  const secret = process.env.AUTH_SECRET ?? "";
  const users = new Map<string, string>();
  for (const entry of (process.env.AUTH_USERS ?? "").split(",")) {
    const i = entry.indexOf(":");
    if (i <= 0) continue;
    const name = entry.slice(0, i).trim().toLowerCase();
    const hash = entry.slice(i + 1).trim();
    if (name && hash.startsWith("scrypt.")) users.set(name, hash);
  }
  return { configured: secret.length >= 32 && users.size > 0, secret, users };
}

const b64url = (buf: Buffer) => buf.toString("base64url");

/** "scrypt.<salt b64url>.<hash b64url>" */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt.${b64url(salt)}.${b64url(hash)}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [kind, saltText, hashText] = stored.split(".");
  if (kind !== "scrypt" || !saltText || !hashText) return false;
  const expected = Buffer.from(hashText, "base64url");
  const actual = scryptSync(password, Buffer.from(saltText, "base64url"), expected.length, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Kiem tra dang nhap; luon chay scrypt ke ca khi sai ten de khong lo ten tai khoan qua thoi gian phan hoi. */
export function checkCredentials(config: AuthConfig, username: string, password: string): string | null {
  const name = username.normalize("NFC").trim().toLowerCase();
  const stored = config.users.get(name);
  const hash = stored ?? "scrypt.AAAAAAAAAAAAAAAAAAAAAA.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  // Dung sai do ban phim dien thoai: bo khoang trang dau/cuoi; chu dau bi tu dong viet hoa.
  const pw = password.normalize("NFC").trim();
  const variants = [pw];
  if (/^\p{Lu}/u.test(pw)) variants.push(pw.charAt(0).toLowerCase() + pw.slice(1));
  const ok = variants.some((v) => verifyPassword(v, hash));
  return stored && ok ? name : null;
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSession(username: string, secret: string, now = Date.now()): string {
  const payload = b64url(Buffer.from(JSON.stringify({ u: username, exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS })));
  return `${payload}.${sign(payload, secret)}`;
}

export function readSession(token: string | undefined, config: AuthConfig, now = Date.now()): { user: string; exp: number } | null {
  if (!token || !config.configured) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(payload, config.secret));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { u?: string; exp?: number };
    if (!data.u || !data.exp || data.exp * 1000 < now || !config.users.has(data.u)) return null;
    return { user: data.u, exp: data.exp };
  } catch {
    return null;
  }
}

/** Chi chap nhan duong dan noi bo (chong chuyen huong ra ngoai). */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\") || next.startsWith("/login")) return "/";
  return next;
}
