"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { BiliaryPublication } from "@/lib/antibiotics/biliary-protocol";

export type BiliaryProtocolState = BiliaryPublication | "unavailable" | null;
const BiliaryContext = createContext<BiliaryProtocolState>(null);

export function BiliaryProtocolProvider({ children, publication }: { children: ReactNode; publication: BiliaryProtocolState }) {
  return <BiliaryContext.Provider value={publication}>{children}</BiliaryContext.Provider>;
}

export function useBiliaryProtocol() {
  return useContext(BiliaryContext);
}
