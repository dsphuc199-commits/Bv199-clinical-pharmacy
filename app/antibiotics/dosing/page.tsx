/*
  FILE: app/antibiotics/dosing/page.tsx
  Duong dan cu "Hieu chinh lieu khang sinh" – nay dung chung module "Hieu chinh lieu" (/hieu-chinh-lieu)
  de cac lien ket tu phac do, antibiogram, theo tac nhan (?drug=&indication=&crcl=&from=) van hoat dong.
*/
import type { Metadata } from "next";
import { Suspense } from "react";
import DoseAdjustFromUrl from "@/components/dosing/DoseAdjustFromUrl";
import { DTQG_NOTE, DTQG_SOURCE, doseEntries } from "@/lib/dosing/catalog";

export const metadata: Metadata = { title: "Hiệu chỉnh liều" };

export default function AntibioticDosingPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", background: "#f4f7fa" }} />}>
      <DoseAdjustFromUrl entries={doseEntries()} source={DTQG_SOURCE} note={DTQG_NOTE} />
    </Suspense>
  );
}
