"use client";

import { useSearchParams } from "next/navigation";
import DoseAdjustModule from "./DoseAdjustModule";
import type { DoseEntry } from "@/lib/dosing/catalog";

/* Doc tham so URL (drug, indication, crcl, from, fromLabel) – can Suspense khi build tinh. */
export default function DoseAdjustFromUrl(props: { entries: DoseEntry[]; source: string; note: string }) {
  const params = useSearchParams();
  return <DoseAdjustModule key={params.toString()} params={params} {...props} />;
}
