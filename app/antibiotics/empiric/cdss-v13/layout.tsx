import Link from "next/link";
import type { ReactNode } from "react";

/** Chỉ áp dụng cho route /antibiotics/empiric/cdss-v13 */
export default function CdssV13Layout({ children }: { children: ReactNode }) {
  const navStyle = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "10px",
    margin: "10px 24px 0",
    padding: "10px 14px",
    background: "#ffffff",
    border: "1px solid #dce6ef",
    borderRadius: "12px",
    fontSize: "14px",
  };
  const linkStyle = {
    textDecoration: "none",
    color: "#076b75",
    fontWeight: 600,
    padding: "6px 10px",
    borderRadius: "8px",
    background: "#eef9f8",
  };
  return (
    <>
      <nav aria-label="Điều hướng module lựa chọn điều trị" style={navStyle}>
        <Link href="/" style={linkStyle}>⌂ Trang chủ</Link>
        <Link href="/antibiotics/empiric" style={linkStyle}>← Điều trị kinh nghiệm</Link>
        <Link href="/antibiotics/empiric/sources" style={linkStyle}>Nguồn hướng dẫn</Link>
        <span style={{ color: "#637589", marginLeft: "auto" }}>Kháng sinh &amp; kháng nấm · CDSS V13</span>
      </nav>
      {children}
    </>
  );
}
