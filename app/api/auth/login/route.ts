import { NextResponse, type NextRequest } from "next/server";
import { adminStorageConfigured } from "@/lib/admin/private-json-store";
import { authenticateAccount } from "@/lib/auth/access";
import { recordSuccessfulLogin } from "@/lib/auth/login-audit";
import { ADMIN_SESSION_TTL_SECONDS, authConfig, createSession, safeNextPath, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth/session";

/* POST /api/auth/login – form dang nhap (username, password, next). */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");
  const next = safeNextPath(String(form.get("next") ?? "/"));
  const config = authConfig();

  const back = (error: string) => {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", error);
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 303);
  };

  if (!config.configured) return back("config");
  const account = username && password
    ? await authenticateAccount(config, username, password).catch(() => null)
    : null;
  if (!account) {
    await new Promise((r) => setTimeout(r, 700)); // lam cham do mat khau
    return back("invalid");
  }

  const now = Date.now();
  if (adminStorageConfigured()) {
    await recordSuccessfulLogin(account.user, account.admin ? "pharmacy-admin" : "viewer", now).catch(() => {
      console.error("[auth] Could not record a successful login.");
    });
  }
  const res = NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(SESSION_COOKIE, createSession(account.user, config.secret, now, account), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: account.admin ? ADMIN_SESSION_TTL_SECONDS : SESSION_TTL_SECONDS,
  });
  return res;
}
