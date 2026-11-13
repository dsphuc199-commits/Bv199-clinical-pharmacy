
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/*
  BV199 CLINICAL PHARMACY
  SIDEBAR - STABLE LAYOUT

  - Logo nằm ngang với tên
  - Icon và nội dung cùng một hàng
  - Chỉ mở một nhóm tại một thời điểm
  - Có Clinical Scores
  - Không cần lucide-react
  - Không thay đổi layout.tsx
*/

type Item = {
  /* Tieu de nhom con (hien phia tren muc dau tien cua nhom con). */
  section?: string;
  label: string;
  href: string;
  code: string;
};

type Group = {
  id: string;
  number: string;
  title: string;
  items: Item[];
};

const GROUPS: Group[] = [
  {
    id: "home",
    number: "01",
    title: "Trang chủ",
    items: [
      { label: "Trang chủ", href: "/", code: "TC" },
    ],
  },
  {
    id: "clinical",
    number: "02",
    title: "Dược lâm sàng",
    items: [
      { label: "Thông tin thuốc", href: "/drugs", code: "TT" },
      { label: "Hiệu chỉnh liều", href: "/hieu-chinh-lieu", code: "HC" },
      { label: "Tương tác thuốc", href: "/tuong-tac-thuoc", code: "TG" },
      { label: "Theo dõi nồng độ (TDM)", href: "/tdm", code: "TD" },
      { label: "Thai kỳ & cho con bú", href: "/safety/pregnancy", code: "TK" },
      { label: "Thay thế thuốc", href: "/safety/substitution", code: "TH" },
      { label: "Thuốc LASA", href: "/safety/lasa", code: "LA" },
    ],
  },
  {
    id: "antibiotics",
    number: "03",
    title: "Kháng sinh & AMS",
    items: [
      { section: "Khởi đầu điều trị", label: "Phác đồ kinh nghiệm", href: "/antibiotics/empiric", code: "KN" },
      { label: "Chọn theo người bệnh", href: "/antibiotics/empiric/select", code: "NB" },
      { label: "Dị ứng kháng sinh", href: "/antibiotics/allergy", code: "DU" },
      { section: "Đánh giá lại 48–72 giờ", label: "Theo tác nhân vi sinh", href: "/antibiotics/organism", code: "TN" },
      { label: "Xuống thang", href: "/antibiotics/deescalation", code: "XT" },
      { label: "Chuyển tĩnh mạch → uống", href: "/antibiotics/iv-to-po", code: "IV" },
      { section: "Dự phòng và dữ liệu", label: "Dự phòng phẫu thuật", href: "/antibiotics/prophylaxis", code: "DP" },
      { label: "Antibiogram BV199", href: "/antibiotics/antibiogram", code: "AB" },
      { label: "PK/PD kháng sinh", href: "/pkpd", code: "PK" },
    ],
  },
  {
    id: "tools",
    number: "04",
    title: "Công cụ lâm sàng",
    items: [
      { label: "Tổng quan công cụ", href: "/calculators", code: "CC" },
      { label: "Chức năng thận", href: "/calculators/renal", code: "CT" },
      { label: "Thang điểm lâm sàng", href: "/calculators/clinical-scores", code: "TĐ" },
    ],
  },
  /* "Bao cao & Can thiep": tam an cho den khi Khoa co mau bao cao (so ghi nhan can thiep khong dinh danh). */
  {
    id: "admin",
    number: "05",
    title: "Quản trị",
    items: [
      { label: "Quản trị hệ thống", href: "/admin", code: "QT" },
    ],
  },
];

function currentGroup(path: string) {
  /* Trang chu chuyen toi Tong quan AMS (/antibiotics): coi la cung mot trang. */
  if (path === "/" || path === "/antibiotics") return "home";
  if (path.startsWith("/antibiotics") || path.startsWith("/pkpd")) return "antibiotics";
  if (path.startsWith("/calculators")) return "tools";
  if (path.startsWith("/admin")) return "admin";
  return "clinical";
}

/* Trang con co muc menu rieng: khong to sang muc cha. */
const NESTED_LINKS = ["/antibiotics/empiric/select"];

function activeLink(path: string, href: string) {
  if (href === "/") return path === "/";
  if (path === href) return true;
  const nested = NESTED_LINKS.find(
    (child) => child !== href && child.startsWith(href + "/") && (path === child || path.startsWith(child + "/"))
  );
  if (nested) return false;
  return path.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const pageGroup = currentGroup(pathname);

  // null = tất cả nhóm đều thu gọn
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setOpenGroup(pageGroup);
    setMobileOpen(false);
  }, [pathname, pageGroup]);

  const rowStyle: React.CSSProperties = {
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 10,
    textAlign: "left",
    textDecoration: "none",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  };

  return (
    <>
      <button
        type="button"
        className="bv-fixed-mobile-trigger"
        onClick={() => setMobileOpen(true)}
        aria-label="Mở menu"
      >
        ☰
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="bv-fixed-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Đóng menu"
        />
      )}

      <aside
        className={
          "bv-fixed-sidebar" +
          (mobileOpen ? " bv-fixed-open" : "")
        }
        style={{
          width: 244,
          minWidth: 244,
          maxWidth: 244,
          height: "100dvh",
          position: "sticky",
          top: 0,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          background: "#117b95",
          color: "#ffffff",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* LOGO - NẰM NGANG */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          style={{
            ...rowStyle,
            flexShrink: 0,
            minHeight: 112,
            padding: "15px 12px",
            borderBottom: "1px solid rgba(255,255,255,.16)",
          }}
        >
          <img
            src="/bv199-khoa-duoc-logo.png"
            alt="Khoa Dược BV199"
            style={{
              display: "block",
              width: 64,
              height: 64,
              minWidth: 64,
              flexShrink: 0,
              borderRadius: "50%",
              objectFit: "contain",
              background: "#fff",
            }}
          />

          <div
            style={{
              minWidth: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 5,
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: 12,
                lineHeight: 1.3,
                fontWeight: 800,
                maxWidth: "100%",
                overflowWrap: "break-word",
              }}
            >
              BV199
              <br />
              Clinical Pharmacy
            </strong>
            <span
              style={{
                display: "block",
                fontSize: 10,
                opacity: 0.9,
                whiteSpace: "nowrap",
              }}
            >
              Hỗ trợ Dược lâm sàng
            </span>
          </div>
        </Link>

        {/* CÁC NHÓM MENU */}
        <nav
          aria-label="Điều hướng BV199"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "12px 8px 22px",
            boxSizing: "border-box",
          }}
        >
          {GROUPS.map((group) => {
            const isOpen = openGroup === group.id;
            const isCurrent = pageGroup === group.id;

            return (
              <div key={group.id} style={{ marginBottom: 5 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (group.id === "home") {
                      window.location.href = "/";
                      return;
                    }
                    setOpenGroup(isOpen ? null : group.id);
                  }}
                  style={{
                    ...rowStyle,
                    border: 0,
                    borderRadius: 12,
                    padding: "10px 11px",
                    minHeight: 52,
                    cursor: "pointer",
                    background: isCurrent
                      ? "rgba(255,255,255,.17)"
                      : "transparent",
                  }}
                  aria-expanded={isOpen}
                >
                  <span
                    style={{
                      width: 32,
                      minWidth: 32,
                      height: 32,
                      borderRadius: 999,
                      background: "rgba(255,255,255,.16)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {group.number}
                  </span>

                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1.4,
                    }}
                  >
                    {group.title}
                  </span>

                  <span
                    style={{
                      width: 12,
                      textAlign: "center",
                      flexShrink: 0,
                      fontSize: 16,
                    }}
                  >
                    {group.id === "home" ? "" : isOpen ? "⌄" : "›"}
                  </span>
                </button>

                {isOpen && group.id !== "home" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      padding: "5px 4px",
                      marginTop: 3,
                      marginBottom: 7,
                      borderRadius: 11,
                      background: "rgba(0,55,83,.18)",
                    }}
                  >
                    {group.items.map((item) => {
                      const selected =
                        activeLink(pathname, item.href) &&
                        isCurrent;

                      return (
                        <div key={group.id + item.href} style={{ display: "contents" }}>
                        {item.section && (
                          <div
                            style={{
                              padding: "8px 9px 2px",
                              fontSize: 9.5,
                              fontWeight: 800,
                              letterSpacing: ".06em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,.72)",
                              fontFamily: "Arial, sans-serif",
                            }}
                          >
                            {item.section}
                          </div>
                        )}
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          style={{
                            ...rowStyle,
                            minHeight: 44,
                            padding: "7px 9px",
                            borderRadius: 9,
                            background: selected
                              ? "rgba(255,255,255,.25)"
                              : "transparent",
                            fontWeight: selected ? 800 : 500,
                          }}
                        >
                          <span
                            style={{
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                              width: 28,
                              minWidth: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,.16)",
                              fontSize: 9,
                              fontWeight: 800,
                              lineHeight: 1,
                            }}
                          >
                            {item.code}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              minWidth: 0,
                              fontSize: 11,
                              lineHeight: 1.4,
                              overflowWrap: "break-word",
                            }}
                          >
                            {item.label}
                          </span>
                        </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* CHÂN SIDEBAR */}
        <div
          style={{
            padding: "10px 14px",
            borderTop: "1px solid rgba(255,255,255,.13)",
            fontSize: 10,
            lineHeight: 1.6,
            flexShrink: 0,
          }}
        >
          {/* Dang xuat: the <a> thuong (khong prefetch, tranh vo tinh dang xuat) */}
          <a
            href="/api/auth/logout"
            style={{ display: "inline-block", marginBottom: 8, padding: "5px 10px", borderRadius: 7, border: "1px solid rgba(255,255,255,.35)", color: "inherit", fontSize: 12, fontWeight: 700, textDecoration: "none" }}
          >
            Đăng xuất
          </a>
          <br />
          <strong>KHOA DƯỢC · BỆNH VIỆN 199</strong>
          <div style={{ opacity: 0.8 }}>BỘ CÔNG AN</div>
        </div>
      </aside>

      {/* CSS CHỈ DÀNH CHO MÀN HÌNH NHỎ */}
      <style jsx global>{`
        
.bv-fixed-mobile-trigger,
.bv-fixed-overlay {
  display: none !important;
}

        @media (max-width: 800px) {
          .bv-fixed-sidebar {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            z-index: 1002 !important;
            transform: translateX(-100%);
            transition: transform 0.2s ease;
          }

          .bv-fixed-sidebar.bv-fixed-open {
            transform: translateX(0);
          }

          .bv-fixed-mobile-trigger {     
display: none !important;
            place-items: center;
            position: fixed;
            left: 10px;
            top: 10px;
            width: 40px;
            height: 40px;
            z-index: 1000;
            border: 1px solid #d1e0ec;
            background: white;
            color: #075985;
            border-radius: 9px;
            cursor: pointer;
          }

          .bv-fixed-overlay {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 1001;
            border: 0;
            background: rgba(0,0,0,.45);
          }
        }
      `}</style>
    </>
  );
}
