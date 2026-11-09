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

/* Nut cai dat (Android/Chrome) + huong dan theo nen tang; nhan dien khi da cai. */
export default function InstallPanel() {
  const [platform, setPlatform] = useState<Platform>("other");
  const [installed, setInstalled] = useState(false);
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Doc moi truong trinh duyet sau khi gan (khong co tren may chu).
    const p = detectPlatform();
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as InstallEvent); };
    const onInstalled = () => setDone(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    queueMicrotask(() => { setPlatform(p); setInstalled(standalone); });
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
      {done && <div className="ta-box ta-ok"><strong>Đã cài xong.</strong> Mở biểu tượng “BV199 Dược” trên màn hình chính và đăng nhập một lần.</div>}
      {prompt && !done && <button type="button" className="ta-install" onClick={install}>Cài đặt ngay</button>}

      <section className={`ta-box ${platform === "ios" ? "ta-active" : ""}`}>
        <h2>iPhone / iPad</h2>
        <ol>
          <li>Mở trang này bằng <strong>Safari</strong> (không dùng Zalo, Facebook hay Chrome).</li>
          <li>Bấm nút <strong>Chia sẻ</strong> (ô vuông có mũi tên lên) ở thanh dưới.</li>
          <li>Chọn <strong>“Thêm vào MH chính”</strong> rồi bấm <strong>Thêm</strong>.</li>
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
