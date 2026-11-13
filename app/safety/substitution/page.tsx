import type { Metadata } from "next";
import SubstitutionModule from "@/components/safety/SubstitutionModule";
import { substitutionCatalog } from "@/lib/safety/substitution";

export const metadata: Metadata = { title: "Thay thế thuốc" };

/* Che pham cung hoat chat trong danh muc BV199 (lib/safety/substitution.ts). */
export default function SubstitutionPage() {
  return <SubstitutionModule items={substitutionCatalog()} />;
}
