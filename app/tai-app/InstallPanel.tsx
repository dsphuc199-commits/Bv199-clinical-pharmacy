"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

/* Trinh duyet nhung trong Zalo/Facebook/... khong cai duoc ung dung. */
function detectInAppBrowser(): string | null {
  const ua = navigator.userAgent || "";
  if (/Zalo/i.test(ua)) return "Zalo";
  if (/FBAN|FBAV|FB_IAB|Messenger/i.test(ua)) return "Facebook/Messenger";
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/\bLine\//i.test(ua)) return "Line";
  if (/TikTok|musical_ly|BytedanceWebview/i.test(ua)) return "TikTok";
  return null;
}

/* Nut cai dat (Android/Chrome) + huong dan theo nen tang; nhan dien khi da cai. */
export default function InstallPanel() {
  const [platform, setPlatform] = useState<Platform>("other");
  const [installed, setInstalled] = useState(false);
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [done, setDone] = useState(false);
  const [inApp, setInApp] = useState<string | null>(null);

  useEffect(() => {
    // Doc moi truong trinh duyet sau khi gan (khong co tren may chu).
    const p = detectPlatform();
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as InstallEvent); };
    const onInstalled = () => setDone(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    const embedded = detectInAppBrowser();
    queueMicrotask(() => { setPlatform(p); setInstalled(standalone); setInApp(embedded); });
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setDone(true);
    setPrompt(null);
  }

  if (installed) {
    return <div className="ta-box ta-ok"><strong>Bạn đang mở trong ứng dụng.</strong> Không cần cài thêm. <Link href="/">Vào hệ thống</Link></div>;
  }

  return (
    <>
      {inApp && (
        <div className="ta-box ta-warn" role="alert">
          <strong>Bạn đang mở trong {inApp}.</strong> Trình duyệt này không cài được ứng dụng. Bấm menu <strong>•••</strong> (hoặc <strong>⋮</strong>) → chọn{" "}
          <strong>{platform === "ios" ? "“Mở bằng Safari”" : "“Mở bằng trình duyệt” / Chrome"}</strong>, rồi làm theo hướng dẫn bên dưới.
        </div>
      )}
      {done &&<div className="ta-box ta-ok"><strong>Đã cài xong.</strong> Mở biểu tượng “BV199 Dược” trên màn hình chính và đăng nhập một lần.</div>}
      {prompt && !done && <button type="button" className="ta-install" onClick={install}>Cài đặt ngay</button>}

      <section className={`ta-box ${platform === "ios" ? "ta-active" : ""}`}>
        <h2>iPhone / iPad</h2>
        <ol>
          <li>Mở trang này bằng <strong>Safari</strong> (không dùng Zalo, Facebook hay Chrome).</li>
          <li>Bấm nút <strong>Chia sẻ</strong> (ô vuông có mũi tên lên) ở thanh dưới.</li>
          <li>Chọn <strong>“Thêm vào MH chính”</strong>. Nếu không thấy, bấm <strong>“Xem thêm”</strong> (nút ⌄ ở hàng dưới cùng) hoặc kéo danh sách xuống để tìm.</li>
          <li>Bật <strong>“Mở dưới dạng ứng dụng web”</strong> (nếu có) rồi bấm <strong>Thêm</strong>.</li>
        </ol>
      </section>

      <section className={`ta-box ${platform === "android" ? "ta-active" : ""}`}>
        <h2>Android</h2>
        <ol>
          <li>Mở trang này bằng <strong>Chrome</strong>.</li>
          <li>Bấm <strong>“Cài đặt ngay”</strong> ở trên; nếu không thấy nút, bấm menu <strong>⋮</strong> → <strong>“Cài đặt ứng dụng”</strong> hoặc <strong>“Thêm vào màn hình chính”</strong>.</li>
          <li>Xác nhận <strong>Cài đặt</strong>.</li>
        </ol>
      </section>

      {platform === "other" && <p className="ta-note">Bạn đang dùng máy tính. Mở địa chỉ này trên điện thoại để cài ứng dụng.</p>}
    </>
  );
}
