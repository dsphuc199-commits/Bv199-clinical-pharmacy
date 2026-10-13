/*
  FILE: data/antibiotics/empiric/groups.ts

  Ma du lieu chuan lien ket cac mat benh gan trung. Chi la DE XUAT ket noi
  de tranh nhap trung/lech phac do; ten tim kiem va ID goc GIU NGUYEN.
  Can duoc chuyen mon BV199 xac nhan truoc khi gop noi dung.
*/

import type { CanonicalGroup } from "./types";

export const CANONICAL_GROUPS: CanonicalGroup[] = [
  {
    code: "CAN-ABRS-ADULT",
    name: "Viêm xoang cấp do vi khuẩn (người lớn)",
    type: "duplicate-candidate",
    ids: ["v8-7", "v8-58"],
    note: "Hai tên gần như cùng một bệnh; hiện cùng dùng module ABRS UpToDate 2026.",
  },
  {
    code: "CAN-GAS-PHARYNGITIS",
    name: "Viêm họng do liên cầu nhóm A",
    type: "duplicate-candidate",
    ids: ["v8-8", "v8-54"],
    note: "Ứng viên trùng; cần xác nhận phạm vi (người lớn/trẻ em).",
  },
  {
    code: "CAN-CATHETER-BSI",
    name: "Nhiễm khuẩn huyết liên quan catheter",
    type: "duplicate-candidate",
    ids: ["v8-15", "v8-108"],
    note: "Ứng viên trùng; v8-108 chỉ rõ catheter trung tâm.",
  },
  {
    code: "CAN-CAUTI",
    name: "Nhiễm khuẩn tiết niệu liên quan sonde/ống thông",
    type: "duplicate-candidate",
    ids: ["v8-19", "v8-109"],
    note: "Ứng viên trùng giữa chuyên khoa Tiết niệu và Hồi sức.",
  },
  {
    code: "CAN-CANDIDEMIA",
    name: "Nhiễm Candida huyết",
    type: "related",
    ids: ["v8-3", "v8-121"],
    note: "v8-121 là phân nhóm có giảm bạch cầu trung tính; thuộc luồng kháng nấm.",
  },
  {
    code: "CAN-CANDIDA-URINARY",
    name: "Candida đường tiết niệu",
    type: "duplicate-candidate",
    ids: ["v8-49", "v8-125"],
    note: "Ứng viên trùng; v8-125 nêu 'có triệu chứng'.",
  },
  {
    code: "CAN-VVC",
    name: "Nhiễm Candida âm hộ–âm đạo",
    type: "related",
    ids: ["v8-72", "v8-96"],
    note: "v8-72 là phân nhóm ở người đái tháo đường.",
  },
  {
    code: "CAN-DFI",
    name: "Nhiễm khuẩn bàn chân đái tháo đường",
    type: "related",
    ids: ["v8-30", "v8-68", "v8-69", "v8-70"],
    note: "Cùng họ bệnh, khác mức độ/biến chứng; không gộp phác đồ.",
  },
  {
    code: "CAN-FEBRILE-NEUTROPENIA",
    name: "Sốt giảm bạch cầu trung tính",
    type: "related",
    ids: ["v8-113", "v8-115", "v8-116"],
    note: "Chung họ bệnh; phân tầng nguy cơ thấp/cao ở chuyên khoa Huyết học.",
  },
  {
    code: "CAN-PJP",
    name: "Pneumocystis jirovecii",
    type: "related",
    ids: ["v8-53", "v8-118"],
    note: "v8-53 là điều trị; v8-118 là dự phòng. Hai luồng riêng.",
  },
  {
    code: "CAN-CRYPTOCOCCUS",
    name: "Cryptococcus",
    type: "related",
    ids: ["v8-51", "v8-128"],
    note: "Khác vị trí (màng não và ngoài thần kinh trung ương).",
  },
  {
    code: "CAN-IMPLANT-DEVICE",
    name: "Nhiễm khuẩn thiết bị cấy ghép",
    type: "related",
    ids: ["v8-40", "v8-112"],
    note: "Thiết bị tim mạch và thiết bị cấy ghép ở hồi sức; cần phân biệt phạm vi.",
  },
];

export function getGroupsForDisease(id: string): CanonicalGroup[] {
  return CANONICAL_GROUPS.filter((group) => group.ids.includes(id));
}
