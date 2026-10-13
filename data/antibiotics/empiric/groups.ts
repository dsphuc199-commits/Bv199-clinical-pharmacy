/*
  FILE: data/antibiotics/empiric/groups.ts

  Ma du lieu chuan lien ket cac mat benh gan trung. Chi la DE XUAT ket noi
  de tranh nhap trung/lech phac do; ten tim kiem va ID goc GIU NGUYEN.
  Can duoc chuyen mon BV199 xac nhan truoc khi gop noi dung.
  (Da bo cac ID cua mat benh khong co phac do trong van ban BYT.)
*/

import type { CanonicalGroup } from "./types";

export const CANONICAL_GROUPS: CanonicalGroup[] = [
  {
    code: "CAN-ABRS-ADULT",
    name: "Viêm xoang cấp do vi khuẩn (người lớn)",
    type: "duplicate-candidate",
    ids: ["v8-7", "v8-58"],
    note: "Hai tên gần như cùng một bệnh; cùng dùng phác đồ BYT QĐ 5643 và module ABRS UpToDate 2026.",
  },
  {
    code: "CAN-GAS-PHARYNGITIS",
    name: "Viêm họng do liên cầu nhóm A",
    type: "duplicate-candidate",
    ids: ["v8-8", "v8-54"],
    note: "Ứng viên trùng; cần xác nhận phạm vi (người lớn/trẻ em).",
  },
  {
    code: "CAN-AOM",
    name: "Viêm tai giữa cấp",
    type: "related",
    ids: ["v8-60", "v8-99"],
    note: "v8-99 là viêm tai giữa cấp ở trẻ em.",
  },
  {
    code: "CAN-CANDIDEMIA",
    name: "Nhiễm Candida huyết",
    type: "related",
    ids: ["v8-3", "v8-121"],
    note: "v8-121 là phân nhóm có giảm bạch cầu trung tính; thuộc luồng kháng nấm.",
  },
  {
    code: "CAN-FEBRILE-NEUTROPENIA",
    name: "Sốt giảm bạch cầu trung tính",
    type: "related",
    ids: ["v8-113", "v8-116"],
    note: "Chung họ bệnh; v8-116 là nhóm nguy cơ cao (Huyết học).",
  },
  {
    code: "CAN-CRYPTOCOCCUS",
    name: "Cryptococcus",
    type: "related",
    ids: ["v8-51", "v8-128"],
    note: "Khác vị trí (màng não và ngoài thần kinh trung ương).",
  },
];

export function getGroupsForDisease(id: string): CanonicalGroup[] {
  return CANONICAL_GROUPS.filter((group) => group.ids.includes(id));
}
