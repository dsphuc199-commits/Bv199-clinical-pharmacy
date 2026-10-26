"use client";

/*
  FILE: components/antibiotics/links/BackBar.tsx
  Thanh quay lai dung chung. Neu URL co ?from= (duong dan noi bo) thi nut chinh
  quay ve dung trang/mat benh truoc do; neu khong, quay ve trang muc.
*/

import Link from "next/link";

import { safeInternalPath } from "@/lib/antibiotics/drug-links";

type Props = {
  from?: string | null;
  fromLabel?: string | null;
  fallbackHref: string;
  fallbackLabel: string;
  /* Lien ket phu (module lien quan). */
  links?: { href: string; label: string }[];
};

export default function BackBar({
  from,
  fromLabel,
  fallbackHref,
  fallbackLabel,
  links = [],
}: Props) {
  const back = safeInternalPath(from);

  return (
    <nav
      className="bv199-backbar mb-4 flex flex-wrap items-center gap-2"
      aria-label="Điều hướng"
    >
      <Link
        href={back ?? fallbackHref}
        className="inline-flex min-h-10 max-w-full items-center gap-1 rounded-lg border border-teal-600 bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
      >
        <span aria-hidden>←</span>
        <span className="truncate">
          {back ? `Quay lại: ${fromLabel || "trang trước"}` : fallbackLabel}
        </span>
      </Link>

      {back && (
        <Link
          href={fallbackHref}
          className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          {fallbackLabel}
        </Link>
      )}

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-10 items-center rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
