/*
  FILE: app/antibiotics/empiric/cdss-v13/layout.tsx

  Master Task 5 – Final, Safety Gate: route nguyen mau cdss-v13 khong con duoc lien ket va co
  bo du lieu lieu RIENG (data/regimens.json, 15 dong lieu) KHONG qua canh bao an toan, khoa de
  xuat va trang thai phe duyet HĐT&ĐT -> module trung lap. Chuyen huong ve module Empiric chinh.
  Du lieu KHONG bi xoa (page.tsx, data/ giu nguyen). Khoi phuc: dung lai layout cu (thanh dieu
  huong) – ban sao trong ghi chu PROGRESS.md / git history.
*/

import { redirect } from "next/navigation";

export default function LegacyRouteLayout(): never {
  redirect("/antibiotics/empiric/guideline-v9");
}
