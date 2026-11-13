import type { Metadata } from "next";
import data from "@/data/pregnancy-dtqg.json";
import PregnancyModule, { type PregnancyItem } from "@/components/safety/PregnancyModule";

export const metadata: Metadata = { title: "Thai kỳ & cho con bú" };

/* Nguyen van muc Thoi ky mang thai / cho con bu – Duoc thu quoc gia VN 2023 (scripts/build-renal-dtqg.mjs --pregnancy). */
export default function PregnancyPage() {
  const d = data as { source: string; items: PregnancyItem[] };
  return <PregnancyModule items={d.items} source={d.source} />;
}
