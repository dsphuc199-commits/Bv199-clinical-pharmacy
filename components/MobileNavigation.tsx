
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Pill, ShieldPlus, Calculator, Menu } from "lucide-react";

const navigation = [
  { label: "Trang chủ", href: "/", icon: House },
  { label: "Thuốc", href: "/drugs", icon: Pill },
  { label: "Kháng sinh", href: "/antibiotics", icon: ShieldPlus },
  { label: "Công cụ", href: "/calculators", icon: Calculator },
];

const moreLinks = [
  { label: "PK/PD", href: "/pkpd" },
  { label: "TDM", href: "/tdm" },
  { label: "Tương tác thuốc", href: "/tuong-tac-thuoc" },
  { label: "An toàn thuốc", href: "/safety" },
  { label: "Báo cáo", href: "/reports" },
  { label: "Quản trị", href: "/admin" },
];

export default function MobileNavigation() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {open && (
        <div className="bv-mobile-more-overlay">
          <button
            className="bv-mobile-more-backdrop"
            type="button"
            aria-label="Đóng menu"
            onClick={() => setOpen(false)}
          />

          <div className="bv-mobile-more-sheet">
            <div className="bv-mobile-more-heading">
              <strong>Chức năng khác</strong>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <div className="bv-mobile-more-links">
              {moreLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <span>›</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        className="bv-mobile-bottom-nav"
        aria-label="Điều hướng điện thoại"
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              "bv-mobile-nav-item" +
              (isActive(item.href) ? " active" : "")
            }
          >
            <span className="bv-mobile-nav-icon">
              <item.icon size={21} strokeWidth={1.9} />
            </span>
            <span>{item.label}</span>
          </Link>
        ))}

        <button
          type="button"
          className={
            "bv-mobile-nav-item" +
            (open ? " active" : "")
          }
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Mở các chức năng khác"
        >
          <span className="bv-mobile-nav-icon"><Menu size={21} strokeWidth={1.9} /></span>
          <span>Thêm</span>
        </button>
      </nav>

      <style jsx global>{`
        .bv-mobile-bottom-nav,
        .bv-mobile-more-overlay {
          display: none;
        }

        @media (max-width: 800px) {
          .bv-mobile-bottom-nav {
            position: fixed;
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            left: 0;
            right: 0;
            bottom: 0;
            height: calc(66px + env(safe-area-inset-bottom));
            padding: 5px 5px
              calc(5px + env(safe-area-inset-bottom));
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.07);
            z-index: 1100;
          }

          .bv-mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            min-width: 0;
            border: 0;
            border-radius: 10px;
            background: transparent;
            color: #64748b;
            text-decoration: none;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          }

          .bv-mobile-nav-item.active {
            color: #087f8c;
            background: #eaf8f7;
            font-weight: 800;
          }

          .bv-mobile-nav-icon {
            font-size: 23px;
            line-height: 1;
          }

          .bv-mobile-more-overlay {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 1090;
          }

          .bv-mobile-more-backdrop {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.38);
            border: 0;
          }

          .bv-mobile-more-sheet {
            position: absolute;
            left: 0;
            right: 0;
            bottom: calc(66px + env(safe-area-inset-bottom));
            max-height: 65dvh;
            overflow-y: auto;
            padding: 20px 16px;
            background: #ffffff;
            border-radius: 22px 22px 0 0;
            box-shadow: 0 -8px 28px rgba(15, 23, 42, 0.1);
          }

          .bv-mobile-more-heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            font-size: 17px;
            color: #172033;
          }

          .bv-mobile-more-heading button {
            width: 34px;
            height: 34px;
            border: 0;
            border-radius: 9px;
            background: #f1f5f9;
            font-size: 18px;
          }

          .bv-mobile-more-links {
            display: grid;
            gap: 8px;
          }

          .bv-mobile-more-links a {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 48px;
            padding: 12px 14px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            color: #172033;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
          }

          .bv-mobile-more-links a span {
            font-size: 20px;
            color: #087f8c;
          }

          .bv199-main-scroll {
            padding-bottom:
              calc(66px + env(safe-area-inset-bottom)) !important;
          }
        }
      `}</style>
    </>
  );
}
