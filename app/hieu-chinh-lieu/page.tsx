import type { Metadata } from "next";
import { Suspense } from "react";
import DoseAdjustFromUrl from "@/components/dosing/DoseAdjustFromUrl";
import { DTQG_NOTE, DTQG_SOURCE, doseEntries } from "@/lib/dosing/catalog";

export const metadata: Metadata = { title: "Hiệu chỉnh liều" };

/* Module Hieu chinh lieu (moi thuoc) – thay cho "Hieu chinh lieu khang sinh". */
export default function DoseAdjustPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", background: "#f4f7fa" }} />}>
      <DoseAdjustFromUrl entries={doseEntries()} source={DTQG_SOURCE} note={DTQG_NOTE} />
    </Suspense>
  );
}
