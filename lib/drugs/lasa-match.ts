/*
  FILE: lib/drugs/lasa-match.ts
  Ghép thuốc trong danh mục với danh mục LASA của Khoa Dược (data/safety/lasa.ts): cùng từ đầu của tên thương mại
  (≥ 4 ký tự). Dùng để nhắc kiểm tra, không thay danh mục LASA.
*/
import { lookAlikeGroups, soundAlikeGroups, type LasaGroup } from "@/data/safety/lasa";

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
const firstWord = (s: string) => plain(s).split(/[^a-z0-9]+/).find((w) => w.length > 0) ?? "";

export function lasaFor(brand: string): LasaGroup[] {
  const first = firstWord(brand);
  if (first.length < 4) return [];
  return [...lookAlikeGroups, ...soundAlikeGroups].filter((g) => g.drugs.some((d) => firstWord(d.name) === first));
}
