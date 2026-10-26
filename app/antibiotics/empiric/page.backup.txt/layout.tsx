/*
  FILE: app/antibiotics/empiric/page.backup.txt/layout.tsx

  Buoc 4D.3 – Safety Gate: thu muc sao luu "page.backup.txt" dang bi Next coi la route
  (/antibiotics/empiric/page.backup.txt) va hien thi phac do/lieu cu khong co canh bao.
  -> Chuyen huong ve module Empiric chinh. Du lieu KHONG bi xoa; khoi phuc: xoa file nay.
*/

import { redirect } from "next/navigation";

export default function LegacyBackupLayout(): never {
  redirect("/antibiotics/empiric/guideline-v9");
}
