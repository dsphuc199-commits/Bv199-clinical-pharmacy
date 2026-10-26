/*
  FILE: app/antibiotics/empiric/decision/layout.tsx

  Master Task 5 – Safety Gate: route nguyen mau cu (/antibiotics/empiric/decision) khong con
  duoc lien ket, chua phac do/lieu cu KHONG qua canh bao an toan, khoa de xuat va trang
  thai phe duyet HĐT&ĐT. -> Chuyen huong ve module Empiric chinh.
  Du lieu KHONG bi xoa (page.tsx giu nguyen, da co trong git). Khoi phuc: xoa file nay.
*/

import { redirect } from "next/navigation";

export default function LegacyRouteLayout(): never {
  redirect("/antibiotics/empiric/guideline-v9");
}
