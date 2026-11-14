/*
  scripts/lib/compact-intl.ts – thử biểu diễn GỌN bộ luật primary bằng show_when ở cấp dòng thuốc/ghi chú.
  Chỉ gộp các luật có `when` là phép gán giá trị đơn (chuỗi/boolean). Trục check không làm đổi "khung"
  (summary, tiêu đề/lead của block) được chuyển thành show_when trên từng dòng.
  Kết quả CHỈ được dùng khi mở rộng ra mọi tổ hợp hợp lệ cho nội dung GIỐNG HỆT bản đầy đủ (kiểm bằng
  lib/intl-rules.ts → rendered()). Cụm nào không biểu diễn được thì giữ nguyên luật gốc.
*/
import { combos, matches, rendered, type AxisState } from "../../lib/intl-rules";
import type { IntlGuideline } from "../../schema/intl-guideline";

type G = IntlGuideline;
type Rule = G["rules"][number];
type Item = Rule["avoid"][number];
type Note = Rule["notes"][number];
type Combo = Record<string, boolean>;

const key = (x: unknown) => JSON.stringify(x);
const isScalar = (v: unknown) => typeof v === "string" || typeof v === "boolean";

/** Hợp có thứ tự của các danh sách; null nếu thứ tự mâu thuẫn. */
function orderedUnion(lists: string[][]): string[] | null {
  const u: string[] = [];
  for (const l of lists) {
    let pos = -1;
    for (const k of l) {
      const i = u.indexOf(k);
      if (i === -1) { u.splice(pos + 1, 0, k); pos++; }
      else if (i > pos) pos = i;
      else return null;
    }
  }
  return u;
}
/** Điều kiện AND nhỏ nhất mô tả đúng tập tổ hợp có mặt; null nếu không biểu diễn được bằng AND. */
function condFor(present: Combo[], axes: string[], total: number): Record<string, boolean> | undefined | null {
  if (present.length === total) return undefined;
  const w: Record<string, boolean> = {};
  let product = 1;
  for (const a of axes) {
    const vals = new Set(present.map((c) => c[a]));
    product *= vals.size;
    if (vals.size === 1) w[a] = [...vals][0];
  }
  return product === present.length ? w : null;
}
/** Gộp danh sách (items hoặc notes) của các biến thể; gắn show_when. */
function mergeList<T extends Item | Note>(variants: { combo: Combo; list: T[] }[], axes: string[]): T[] | null {
  const keyed = variants.map((v) => {
    const seen = new Map<string, number>();
    return v.list.map((x) => { const k = key(x); const n = seen.get(k) ?? 0; seen.set(k, n + 1); return `${k}#${n}`; });
  });
  const u = orderedUnion(keyed);
  if (!u) return null;
  const out: T[] = [];
  for (const k of u) {
    const present = variants.filter((_, i) => keyed[i].includes(k)).map((v) => v.combo);
    const w = condFor(present, axes, variants.length);
    if (w === null) return null;
    const base = JSON.parse(k.slice(0, k.lastIndexOf("#"))) as T;
    out.push(w && Object.keys(w).length ? ({ ...base, show_when: w } as T) : base);
  }
  return out;
}

const skeleton = (r: Rule) => key([r.summary, r.blocks.map((b) => [b.title, b.lead]), r.antibiogram_reminder]);
const strip = <T extends { show_when?: unknown }>(x: T) => { const { show_when: _w, ...rest } = x; void _w; return rest; };
function expandRule(r: Rule, s: AxisState) {
  return {
    blocks: r.blocks.filter((b) => matches(s, b.show_when)).map((b) => ({ ...strip(b), items: b.items.filter((i) => matches(s, i.show_when)).map(strip) })),
    avoid: r.avoid.filter((i) => matches(s, i.show_when)).map(strip),
    notes: r.notes.filter((n) => matches(s, n.show_when)).map(strip),
  };
}

export function compactGuideline(g: G): { compact: G; equal: boolean; checked: number; reason?: string; log: string[] } {
  const log: string[] = [];
  const checkAxes = new Set(g.axes.filter((a) => a.type === "check").map((a) => a.id));
  const primaries = g.rules.filter((r) => r.kind === "primary");
  const eligible = primaries.filter((r) => Object.values(r.when).every(isScalar));
  const kept: Rule[] = primaries.filter((r) => !eligible.includes(r));
  if (kept.length) log.push(`${kept.length} luật primary có điều kiện tập hợp/multi – giữ nguyên`);
  const made: Rule[] = [];

  // nhóm theo trục không phải check + tập trục check xuất hiện
  const groups = new Map<string, Rule[]>();
  for (const r of eligible) {
    const fixed = Object.entries(r.when).filter(([k]) => !checkAxes.has(k)).sort();
    const sig = Object.keys(r.when).filter((k) => checkAxes.has(k)).sort();
    const k = key([fixed, sig]);
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  for (const rs of groups.values()) {
    const fixed = Object.fromEntries(Object.entries(rs[0].when).filter(([k]) => !checkAxes.has(k)));
    const A = Object.keys(rs[0].when).filter((k) => checkAxes.has(k)).sort();
    // tập con S nhỏ nhất của A sao cho khung là hàm của (fixed ∪ S)
    let S: string[] | null = null;
    for (let size = 0; size <= A.length && !S; size++) {
      for (let m = 0; m < 1 << A.length; m++) {
        const sub = A.filter((_, i) => m & (1 << i));
        if (sub.length !== size) continue;
        const sk = new Map<string, string>();
        if (rs.every((r) => { const kk = key(sub.map((a) => r.when[a])); const v = skeleton(r); if (sk.has(kk) && sk.get(kk) !== v) return false; sk.set(kk, v); return true; })) { S = sub; break; }
      }
    }
    const cells = new Map<string, Rule[]>();
    for (const r of rs) { const kk = key(S!.map((a) => r.when[a])); cells.set(kk, [...(cells.get(kk) ?? []), r]); }
    for (const cell of cells.values()) {
      const R = A.filter((a) => !S!.includes(a));
      if (!R.length || cell.length !== 1 << R.length) { made.push(...cell); continue; }
      const variants = cell.map((r) => ({ r, combo: Object.fromEntries(R.map((a) => [a, r.when[a] as boolean])) as Combo }));
      const blocks: Rule["blocks"] = [];
      let ok = true;
      cell[0].blocks.forEach((b0, bi) => {
        const items = mergeList(variants.map((v) => ({ combo: v.combo, list: v.r.blocks[bi].items })), R);
        if (!items) ok = false; else blocks.push({ ...b0, items });
      });
      const avoid = mergeList(variants.map((v) => ({ combo: v.combo, list: v.r.avoid })), R);
      const notes = mergeList(variants.map((v) => ({ combo: v.combo, list: v.r.notes })), R);
      if (!ok || !avoid || !notes) { made.push(...cell); log.push(`cụm ${cell[0].id}…: không biểu diễn được bằng show_when – giữ ${cell.length} luật`); continue; }
      const sw = Object.fromEntries(S!.map((a) => [a, cell[0].when[a]]));
      const c: Rule = {
        ...cell[0],
        id: ["c", ...Object.values({ ...fixed, ...sw }).map((v) => (typeof v === "boolean" ? (v ? "1" : "0") : String(v)))].join("-"),
        when: { ...fixed, ...sw },
        blocks, avoid, notes,
        source_ids: [...new Set(cell.flatMap((r) => r.source_ids))],
      };
      // kiểm từng biến thể trong cụm
      const same = variants.every((v) => key(expandRule(c, v.combo)) === key(expandRule(v.r, v.combo)));
      if (!same) { made.push(...cell); log.push(`cụm ${cell[0].id}…: mở rộng không khớp – giữ ${cell.length} luật`); continue; }
      made.push(c);
    }
  }
  const order = (r: Rule) => primaries.findIndex((p) => p === r || p.id === r.id);
  made.sort((a, b) => { const ia = order(a), ib = order(b); return (ia < 0 ? 1e9 : ia) - (ib < 0 ? 1e9 : ib); });
  const compact: G = { ...g, rules: [...made, ...kept, ...g.rules.filter((r) => r.kind === "addon")] };

  // kiểm toàn cục: mọi tổ hợp hợp lệ cho nội dung giống hệt
  let checked = 0;
  for (const s of combos(g.axes)) {
    checked++;
    if (key(rendered(g, s)) !== key(rendered(compact, s))) return { compact, equal: false, checked, reason: `khác ở tổ hợp ${key(s)}`, log };
  }
  return { compact, equal: true, checked, log };
}
