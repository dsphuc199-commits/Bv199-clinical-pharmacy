import type { MetadataRoute } from "next";

/* Ung dung cai dat duoc (PWA) tren Android va iPhone: /manifest.webmanifest */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "BV199 Clinical Pharmacy – Khoa Dược Bệnh viện 199",
    short_name: "BV199 Dược",
    description: "Hệ thống hỗ trợ quyết định Dược lâm sàng – Khoa Dược, Bệnh viện 199",
    lang: "vi",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // Khong khoa chieu xoay: cho phep xoay ngang de xem bang lieu rong.
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#0b3a5b",
    categories: ["medical", "health", "productivity"],
    icons: [
      { src: "/app-icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app-icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app-icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
