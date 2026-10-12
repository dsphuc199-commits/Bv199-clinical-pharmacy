"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home, Search } from "lucide-react";

export default function MobileTopBar() {
  const path = usePathname() || "/";
  const home = path === "/" || path === "/antibiotics";
  const title = path.startsWith("/drugs") ? "Danh mục thuốc" :
    path.startsWith("/antibiotics/empiric") ? "Kháng sinh kinh nghiệm" :
    path.startsWith("/antibiotics") ? "Kháng sinh & AMS" :
    path.startsWith("/calculators") ? "Công cụ lâm sàng" :
    path.startsWith("/pkpd") ? "PK/PD" :
    path.startsWith("/tdm") ? "TDM" : "BV199 Clinical Pharmacy";
  return <header className="bv199-mobile-topbar">
    {home ? <><Image src="/bv199-khoa-duoc-logo.png" width={44} height={44} alt="Logo Khoa Dược Bệnh viện 199" className="bv199-mobile-logo" />
      <div className="bv199-mobile-brand"><strong>BV199 Clinical Pharmacy</strong><span>Hỗ trợ Dược lâm sàng</span></div>
      <Link href="/drugs" className="bv199-mobile-head-action" aria-label="Tra thuốc"><Search size={21}/></Link></>
    : <><Link href="/" className="bv199-mobile-head-action" aria-label="Quay về trang chủ"><ChevronLeft size={23}/></Link>
      <strong className="bv199-mobile-page-name">{title}</strong>
      <Link href="/" className="bv199-mobile-head-action" aria-label="Trang chủ"><Home size={21}/></Link></>}
  </header>;
}
