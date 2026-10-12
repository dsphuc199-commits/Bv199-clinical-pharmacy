
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import "./mobile.css";

import Sidebar from "@/components/Sidebar";
import MobileTopBar from "@/components/MobileTopBar";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import ScrollManager from "@/components/ScrollManager";
import MobileNavigation from "@/components/MobileNavigation";


/*
====================================================
BV199 CLINICAL PHARMACY
ROOT LAYOUT - BỐ CỤC TOÀN HỆ THỐNG

Mục tiêu:
1. Sidebar bên trái, cố định theo vùng hiển thị
2. Header ở trên, không chiếm khoảng trắng dư
3. Nội dung luôn bắt đầu từ trên cùng
4. Cuộn nội dung độc lập với Sidebar
5. Footer không che nội dung
6. Giữ nguyên tất cả module hiện có
7. Không tạo Sidebar hoặc Footer thứ hai

Đường dẫn:
app/layout.tsx
====================================================
*/

export const metadata: Metadata = {
  title: {
    default: "BV199 Clinical Pharmacy",
    template: "%s | BV199 Clinical Pharmacy",
  },
  description:
    "Hệ thống hỗ trợ quyết định Dược lâm sàng - Khoa Dược - Bệnh viện 199 - Bộ Công an",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          minHeight: "100dvh",
          overflow: "hidden",
        }}
      >
        <ScrollManager />
        
<MobileNavigation />


        {/* BỐ CỤC CHÍNH */}
        <div
          className="app-shell bv199-root-shell"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "flex-start",
            width: "100%",
            height: "100dvh",
            minHeight: 0,
            overflow: "hidden",
            margin: 0,
            padding: 0,
          }}
        >
          {/* SIDEBAR */}
          <Sidebar />

          {/* CỘT NỘI DUNG */}
          <div
            className="bv199-workspace"
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0%",
              minWidth: 0,
              minHeight: 0,
              height: "100%",
              overflow: "hidden",
              margin: 0,
              padding: 0,
            }}
          >
            <MobileTopBar />

            {/* HEADER CHUNG */}
            <div
              className="bv199-header-region"
              style={{
                flexShrink: 0,
                minWidth: 0,
              }}
            >
              <GlobalHeader />
            </div>

            {/* NỘI DUNG CÁC MODULE */}
            <div
              id="bv199-main-scroll"
              className="bv199-main-scroll main-content"
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 0%",
                minHeight: 0,
                minWidth: 0,
                overflowX: "hidden",
                overflowY: "auto",
                overscrollBehaviorY: "contain",
                scrollBehavior: "auto",
                margin: 0,
                padding: 0,
              }}
            >
              <div
                className="bv199-page-content"
                style={{
                  display: "block",
                  position: "relative",
                  flex: "1 0 auto",
                  width: "100%",
                  minWidth: 0,
                  minHeight: 0,
                  margin: 0,
                  padding: 0,
                }}
              >
                {children}
              </div>

              {/* FOOTER CUỐI NỘI DUNG */}
              <div
                className="bv199-footer-region"
                style={{
                  position: "relative",
                  flexShrink: 0,
                  width: "100%",
                  margin: 0,
                }}
              >
                <GlobalFooter />
              </div>
            </div>
          </div>
        </div>

        {/* CSS BỐ CỤC CHUNG */}
        <style>{`
          html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            scroll-behavior: auto;
          }

          body {
            margin: 0;
            padding: 0;
            height: 100dvh;
            overflow: hidden;
          }

          .bv199-root-shell {
            display: flex !important;
            flex-direction: row !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            height: 100dvh !important;
            min-height: 0 !important;
            max-height: 100dvh !important;
            overflow: hidden !important;
          }

          .bv199-workspace {
            display: flex;
            flex-direction: column;
            flex: 1 1 0%;
            min-height: 0;
            min-width: 0;
            overflow: hidden;
          }

          .bv199-header-region {
            width: 100%;
            min-width: 0;
            flex-shrink: 0;
          }

          .bv199-main-scroll {
            display: flex;
            flex-direction: column;
            flex: 1 1 0%;
            min-height: 0;
            min-width: 0;
            overflow-x: hidden;
            overflow-y: auto;
            scroll-behavior: auto;
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }

          .bv199-main-scroll::-webkit-scrollbar {
            width: 8px;
          }

          .bv199-main-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 8px;
          }

          .bv199-page-content {
            display: block;
            position: relative;
            width: 100%;
            min-height: 0;
            min-width: 0;
            margin: 0;
            padding: 0;
          }

          .bv199-page-content > main {
            margin-top: 0;
          }

          .bv199-footer-region {
            position: relative;
            width: 100%;
            flex-shrink: 0;
          }

          @media (max-width: 800px) {
            .bv199-workspace {
              width: 100%;
              min-width: 0;
            }

            .bv199-main-scroll {
              width: 100%;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
