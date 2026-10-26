"use client";

/*
  FILE: components/antibiotics/links/AbxLinkContext.tsx
  Ngu canh lien ket (duong quay lai, mat benh dang chon) cho cac nut chuyen module.
  Trang cha (vd. Kinh nghiem) boc noi dung bang <AbxLinkProvider>; cac module con
  (CAP, HAP/VAP, BYT, DTR...) chi can dung <DrugActionLinks>.
*/

import { createContext, useContext, type ReactNode } from "react";

import type { LinkContext } from "@/lib/antibiotics/drug-links";

const Ctx = createContext<LinkContext>({});

export function AbxLinkProvider({
  value,
  children,
}: {
  value: LinkContext;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAbxLinkContext(): LinkContext {
  return useContext(Ctx);
}
