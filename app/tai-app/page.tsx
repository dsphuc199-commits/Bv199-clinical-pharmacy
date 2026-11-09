import type { Metadata } from "next";
import Link from "next/link";
import InstallPanel from "./InstallPanel";

export const metadata: Metadata = { title: "Cài ứng dụng" };

/* Trang cong khai (khong can dang nhap): huong dan cai ung dung BV199 Duoc len dien thoai. */
export default function InstallAppPage() {
  return (
    <div className="ta">
      <main className="ta-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app-icons/icon-192.png" alt="Khoa Dược – Bệnh viện 199" className="ta-logo" />
        <h1>Cài ứng dụng BV199 Dược</h1>
        <p className="ta-sub">Dùng trên điện thoại như ứng dụng thật: biểu tượng trên màn hình chính, mở toàn màn hình, tự cập nhật. Miễn phí, không qua kho ứng dụng.</p>

        <InstallPanel />

        <section className="ta-box">
          <h2>Sau khi cài</h2>
          <ul>
            <li>Mở biểu tượng <strong>“BV199 Dược”</strong> và đăng nhập <strong>một lần</strong>.</li>
            <li>Ứng dụng giữ đăng nhập lâu dài; chỉ cần đăng nhập lại khi bấm “Đăng xuất”.</li>
            <li>Nội dung luôn là bản mới nhất (cần kết nối mạng).</li>
          </ul>
        </section>

        <Link className="ta-open" href="/">Mở hệ thống trên trình duyệt</Link>
      </main>
      <style>{`
        .ta { position:fixed; inset:0; z-index:5000; overflow:auto; padding:16px; background:linear-gradient(160deg,#0b3a5b 0%,#087f89 100%); display:grid; place-items:start center; }
        .ta-card { width:100%; max-width:460px; margin:16px 0; padding:24px 20px; background:#fff; border-radius:14px; box-shadow:0 20px 50px rgba(0,0,0,.25); color:#12283c; display:grid; gap:12px; }
        .ta-logo { width:72px; height:72px; justify-self:center; border-radius:16px; }
        .ta h1 { margin:0; text-align:center; font-size:21px; font-weight:800; color:#10243e; }
        .ta-sub { margin:0; text-align:center; font-size:13.5px; line-height:1.55; color:#4b6576; }
        .ta-box { border:1px solid #dce6ed; border-radius:10px; padding:12px 14px; background:#f7fafc; font-size:14px; line-height:1.6; }
        .ta-box h2 { margin:0 0 6px; font-size:15px; font-weight:800; color:#1e3a5f; }
        .ta-box ol, .ta-box ul { margin:0; padding-left:20px; }
        .ta-box li + li { margin-top:4px; }
        .ta-active { border-color:#087f89; background:#effaf9; box-shadow:0 0 0 2px rgba(8,127,137,.15); }
        .ta-ok { border-color:#86cfb0; background:#effaf4; }
        .ta-install { padding:13px; border:0; border-radius:9px; background:#0b3a5b; color:#fff; font:inherit; font-size:16px; font-weight:800; cursor:pointer; }
        .ta-install:hover { background:#087f89; }
        .ta-note { margin:0; font-size:13px; color:#6b8293; text-align:center; }
        .ta-open { text-align:center; font-size:14px; font-weight:700; color:#087f89; }
        .ta :is(a,button):focus-visible { outline:3px solid #087f89; outline-offset:2px; }
      `}</style>
    </div>
  );
}
