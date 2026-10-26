/*
  FILE: app/antibiotics/empiric/empiric/layout.tsx

  Buoc 4D.3 – Safety Gate: route cu /antibiotics/empiric/empiric khong con duoc
  lien ket (Sidebar va ma nguon khong tro toi). Trang chua lieu cu (gom colistin ghi
  lan MIU/mg CBA) KHONG co canh bao an toan va KHONG qua trang thai phe duyet HĐT&ĐT.
  -> Chuyen huong ve module Empiric chinh.

  Du lieu KHONG bi xoa: page.tsx giu nguyen (trung ban git f6ec128; ban sao luu
  SHA-256 2383e9a1...610d). Khoi phuc: xoa file layout.tsx nay.
*/

import { redirect } from "next/navigation";

export default function LegacyEmpiricLayout(): never {
  redirect("/antibiotics/empiric/guideline-v9");
}
