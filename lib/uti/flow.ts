/* Logic chọn tuần tự: Vị trí nhiễm khuẩn -> Thể bệnh/mức độ -> Đối tượng -> Kết quả. */
import type { Condition } from "../../data/uti-antibiotics/types";

const uniq = (a: string[]) => [...new Set(a)];

export const sitesOf = (cs: Condition[]) => uniq(cs.map((c) => c.group));
export const formsOf = (cs: Condition[], site: string) => uniq(cs.filter((c) => c.group === site).map((c) => c.form));
export const populationsOf = (cs: Condition[], site: string, form: string) =>
  uniq(cs.filter((c) => c.group === site && c.form === form).map((c) => c.population));

export function resolveCondition(cs: Condition[], site: string, form: string, population: string | null): Condition | null {
  const pops = populationsOf(cs, site, form);
  const pop = population ?? (pops.length === 1 ? pops[0] : null);
  if (!pop) return null;
  return cs.find((c) => c.group === site && c.form === form && c.population === pop) ?? null;
}

export const normalizeSearch = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase().trim();

/* Tìm theo tên thể bệnh hoặc tên kháng sinh. */
export function searchConditions<R extends { conditionId: string; antibiotic: string }>(cs: Condition[], rs: R[], query: string): Condition[] {
  const q = normalizeSearch(query);
  if (!q) return [];
  return cs.filter((c) =>
    normalizeSearch(`${c.name} ${c.nameEn ?? ""} ${c.group} ${c.form}`).includes(q) ||
    rs.some((r) => r.conditionId === c.id && normalizeSearch(r.antibiotic).includes(q)));
}
