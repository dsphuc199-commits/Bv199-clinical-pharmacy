/*
  FILE: proxy.ts (Next.js 16: "Proxy" thay cho Middleware, chay Node.js runtime)

  Bat buoc dang nhap cho toan bo web app, ke ca tep du lieu trong /public (vd. /data/qd5948.json,
  /references/*.docx). Chi mo: trang /login, API /api/auth/*, tai nguyen tinh cua Next va logo/favicon.
  Chua dang nhap: trang -> chuyen ve /login?next=...; tep/du lieu -> 401.
*/

import { NextResponse, type NextRequest } from "next/server";
import { authConfig, createSession, readSession, SESSION_COOKIE, SESSION_RENEW_AFTER_SECONDS, SESSION_TTL_SECONDS } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/logout"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const config = authConfig();
  const session = readSession(request.cookies.get(SESSION_COOKIE)?.value, config);
  if (session) {
    const res = NextResponse.next();
    // Tu gia han phien (toi da 1 lan/ngay) de dang nhap "khong het han" khi con su dung.
    const nowSec = Math.floor(Date.now() / 1000);
    if (session.exp - nowSec < SESSION_TTL_SECONDS - SESSION_RENEW_AFTER_SECONDS) {
      res.cookies.set(SESSION_COOKIE, createSession(session.user, config.secret), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_TTL_SECONDS,
      });
    }
    return res;
  }

  const accept = request.headers.get("accept") ?? "";
  const isPage = request.method === "GET" && accept.includes("text/html");
  if (!isPage) return new NextResponse("Cần đăng nhập", { status: 401 });

  const url = new URL("/login", request.url);
  url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  // Moi duong dan tru tai nguyen build cua Next, logo dang nhap va favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|bv199-khoa-duoc-logo.png).*)"],
};
