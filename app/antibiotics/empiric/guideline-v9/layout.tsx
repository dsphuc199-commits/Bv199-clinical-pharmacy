import type { ReactNode } from "react";
import { BiliaryProtocolProvider } from "@/components/antibiotics/empiric/BiliaryProtocolContext";
import { getBiliaryPublication } from "@/lib/admin/biliary-protocol-store";

export const dynamic = "force-dynamic";

export default async function GuidelineLayout({ children }: { children: ReactNode }) {
  const publication = await getBiliaryPublication().catch(() => "unavailable" as const);
  return <BiliaryProtocolProvider publication={publication}>{children}</BiliaryProtocolProvider>;
}
