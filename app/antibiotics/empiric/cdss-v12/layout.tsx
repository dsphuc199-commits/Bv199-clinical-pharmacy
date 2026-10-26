/*
  FILE: app/antibiotics/empiric/cdss-v12/layout.tsx

  Master Task 5 – Final, Safety Gate: route nguyen mau cdss-v12 khong con duoc lien ket va co
  bo du lieu lieu RIENG (data/regimens.json) KHONG qua canh bao an toan, khoa de xuat va trang
  thai phe duyet HĐT&ĐT -> module trung lap. Chuyen huong ve module Empiric chinh.
  Du lieu KHONG bi xoa (page.tsx, data/ giu nguyen). Khoi phuc: xoa file nay.
*/

import { redirect } from "next/navigation";

export default function LegacyRouteLayout(): never {
  redirect("/antibiotics/empiric/guideline-v9");
}
