import type { Metadata } from "next";
import { authConfig, safeNextPath } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Đăng nhập" };

const MESSAGES: Record<string, string> = {
  invalid: "Tên đăng nhập hoặc mật khẩu không đúng.",
  config: "Hệ thống đăng nhập chưa được cấu hình. Liên hệ quản trị viên.",
};

/* Trang dang nhap: lop phu toan man hinh (che bo cuc chung cua ung dung). */
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : "/");
  const errorKey = !authConfig().configured ? "config" : typeof params.error === "string" ? params.error : "";
  const error = MESSAGES[errorKey];

  return (
    <div className="bv199-login">
      <form className="bv199-login-card" method="post" action="/api/auth/login">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bv199-khoa-duoc-logo.png" alt="Khoa Dược – Bệnh viện 199" className="bv199-login-logo" />
        <h1>BV199 Clinical Pharmacy</h1>
        <p className="bv199-login-sub">Hệ thống hỗ trợ quyết định Dược lâm sàng – Khoa Dược, Bệnh viện 199</p>
        {error && <p className="bv199-login-error" role="alert">{error}</p>}
        <input type="hidden" name="next" value={next} />
        <label htmlFor="login-username">Tên đăng nhập</label>
        <input id="login-username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required autoFocus />
        <label htmlFor="login-password">Mật khẩu</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required />
        <button type="submit">Đăng nhập</button>
        <p className="bv199-login-note">Chỉ dành cho nhân viên y tế được cấp tài khoản.</p>
        <a className="bv199-login-app" href="/tai-app">Cài ứng dụng lên điện thoại (Android, iPhone)</a>
      </form>
      <style>{`
        .bv199-login { position:fixed; inset:0; z-index:5000; display:grid; place-items:center; padding:16px; background:linear-gradient(160deg,#0b3a5b 0%,#087f89 100%); overflow:auto; }
        .bv199-login-card { width:100%; max-width:380px; display:grid; gap:10px; padding:28px 24px; background:#fff; border-radius:14px; box-shadow:0 20px 50px rgba(0,0,0,.25); color:#12283c; font-family:inherit; }
        .bv199-login-logo { width:72px; height:72px; object-fit:contain; justify-self:center; }
        .bv199-login-card h1 { margin:4px 0 0; text-align:center; font-size:20px; font-weight:800; color:#10243e; }
        .bv199-login-sub { margin:0 0 6px; text-align:center; font-size:13px; color:#4b6576; line-height:1.5; }
        .bv199-login-card label { font-size:13px; font-weight:700; color:#1e3a5f; margin-top:4px; }
        .bv199-login-card input[type=text], .bv199-login-card input[type=password] { width:100%; box-sizing:border-box; padding:11px 12px; border:1px solid #a9c8d2; border-radius:8px; font:inherit; font-size:15px; color:#12283c; background:#fff; }
        .bv199-login-card input:focus-visible, .bv199-login-card button:focus-visible { outline:3px solid #087f89; outline-offset:2px; }
        .bv199-login-card button { margin-top:10px; padding:12px; border:0; border-radius:8px; background:#0b3a5b; color:#fff; font:inherit; font-size:15px; font-weight:700; cursor:pointer; }
        .bv199-login-card button:hover { background:#087f89; }
        .bv199-login-error { margin:0; padding:9px 12px; border-radius:8px; background:#fdecec; border:1px solid #f3c6c6; color:#9b1c1c; font-size:13px; }
        .bv199-login-note { margin:6px 0 0; text-align:center; font-size:12px; color:#6b8293; }
        .bv199-login-app { text-align:center; font-size:13px; font-weight:700; color:#087f89; }
      `}</style>
    </div>
  );
}
