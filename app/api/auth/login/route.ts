import { NextResponse, type NextRequest } from "next/server";
import { authConfig, checkCredentials, createSession, safeNextPath, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth/session";

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
  const user = username && password ? checkCredentials(config, username, password) : null;
  if (!user) {
    await new Promise((r) => setTimeout(r, 700)); // lam cham do mat khau
    return back("invalid");
  }

  const res = NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(SESSION_COOKIE, createSession(user, config.secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
