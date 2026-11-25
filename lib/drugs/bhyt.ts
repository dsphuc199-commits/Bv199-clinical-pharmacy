/*
  FILE: lib/drugs/bhyt.ts

  Danh mục và tỷ lệ, điều kiện thanh toán BHYT – Thông tư 20/2022/TT-BYT, Phụ lục I (data/bhyt-tt20.json, trích nguyên
  văn bằng scripts/build-bhyt-tt20.mjs, kiểm tra bằng scripts/verify-bhyt-tt20.mjs).
  Ghép thuốc trong danh mục BV199 với mục của Thông tư theo bộ hoạt chất (cùng quy tắc ghép chặt với Dược thư: bỏ muối,
  phần trong ngoặc). Một hoạt chất có thể có nhiều mục (vd. metronidazol ở nhóm nitroimidazol và nhóm điều trị amip;
  levofloxacin ở nhóm quinolon và nhóm lao kháng thuốc) – trả về đủ các mục.
*/
import tt20 from "@/data/bhyt-tt20.json";
import { ingredientKey } from "@/lib/drugs/dtqg";

export type BhytRoute = { route: string; hang: boolean[]; note: string };
export type BhytItem = { stt: number; name: string; group: string; sub: string; page: number; consult: boolean; routes: BhytRoute[] };
const DATA = tt20 as { source: string; hangLabels: string[]; items: BhytItem[] };
export const BHYT_SOURCE = DATA.source;
export const HANG_LABELS = DATA.hangLabels;

const BY = new Map<string, BhytItem[]>();
for (const it of DATA.items) {
  const k = ingredientKey(it.name);
  if (k) BY.set(k, [...(BY.get(k) ?? []), it]);
}

/** Các mục Thông tư 20/2022 của một hoạt chất (rỗng nếu không khớp chặt). */
export function bhytFor(ingredientName?: string | null): BhytItem[] {
  if (!ingredientName) return [];
  return BY.get(ingredientKey(ingredientName)) ?? [];
}

/* Nhóm đường dùng theo Điều 2 khoản 1 điểm c: "Tiêm" gồm tiêm bắp, dưới da, tĩnh mạch, tiêm truyền, truyền tĩnh mạch…;
   "Uống" gồm uống, nhai, ngậm; … Dùng để đánh dấu dòng đường dùng nhiều khả năng ứng với chế phẩm (không loại dòng khác). */
const ROUTE_GROUPS: [RegExp, RegExp][] = [
  [/tiêm|truyền/iu, /tiêm|truyền/iu],
  [/uống|nhai|ngậm/iu, /uống|nhai|ngậm/iu],
  [/nhỏ mắt|tra mắt/iu, /nhỏ mắt|tra mắt/iu],
  [/nhỏ tai/iu, /nhỏ tai/iu],
  [/nhỏ mũi|xịt mũi/iu, /nhỏ mũi|xịt mũi/iu],
  [/hít|khí dung|phun mù|hô hấp/iu, /hít|khí dung|phun mù|hô hấp/iu],
  [/đặt|thụt/iu, /đặt|thụt/iu],
  [/bôi|dùng ngoài|ngoài da|dán/iu, /dùng ngoài|ngoài da|dán|bôi/iu],
];
export function routeMatches(productRoute: string | null | undefined, tt20Route: string): boolean {
  if (!productRoute) return false;
  return ROUTE_GROUPS.some(([p, t]) => p.test(productRoute) && t.test(tt20Route));
}
