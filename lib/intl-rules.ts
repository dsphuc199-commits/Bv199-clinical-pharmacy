/*
  lib/intl-rules.ts – logic dùng chung giữa UI (IntlGuidelineView) và scripts (validate, build reference).
  Không import zod ở đây (chỉ import type) để nạp được bằng tests/empiric/tsrun.cjs.
*/
import type { IntlGuideline, IntlWhen } from "@/schema/intl-guideline";

export type AxisVal = string | boolean | string[];
export type AxisState = Record<string, AxisVal>;

type Axis = IntlGuideline["axes"][number];
type Rule = IntlGuideline["rules"][number];
type Block = Rule["blocks"][number];
type Item = Block["items"][number];
type Note = Rule["notes"][number];
type Section = IntlGuideline["sections"][number];

/* ---------------- điều kiện ---------------- */
export function condOk(v: AxisVal | undefined, c: IntlWhen[string]): boolean {
  if (v === undefined) return false;
  if (typeof c === "string" || typeof c === "boolean") return v === c;
  if (Array.isArray(c)) return typeof v === "string" && c.includes(v);
  const arr = Array.isArray(v) ? v : [];
  if (c.is_empty !== undefined && (arr.length === 0) !== c.is_empty) return false;
  if (c.includes_any && !c.includes_any.some((x) => arr.includes(x))) return false;
  if (c.includes_none && c.includes_none.some((x) => arr.includes(x))) return false;
  return true;
}
/** Mọi điều kiện trong `when` (AND) đều đúng với state. `when` rỗng/undefined → đúng. */
export function matches(state: AxisState, when: IntlWhen | undefined): boolean {
  return !when || Object.entries(when).every(([k, c]) => condOk(state[k], c));
}

/* ---------------- trạng thái hiệu lực ---------------- */
export function defaultState(axes: Axis[]): AxisState {
  return Object.fromEntries(axes.map((a) => [a.id, a.default as AxisVal]));
}
/** Trục ẩn (visible_when sai) nhận giá trị default; xét theo thứ tự khai báo. */
export function effectiveState(axes: Axis[], raw: AxisState): AxisState {
  const s: AxisState = {};
  for (const a of axes) s[a.id] = matches(s, a.visible_when) ? (raw[a.id] ?? (a.default as AxisVal)) : (a.default as AxisVal);
  return s;
}
export function isVisible(axes: Axis[], eff: AxisState, axisId: string): boolean {
  const a = axes.find((x) => x.id === axisId);
  return !!a && matches(eff, a.visible_when);
}

/* ---------------- liệt kê tổ hợp hợp lệ ---------------- */
export function axisDomain(a: Axis): AxisVal[] {
  if (a.type === "check") return [false, true];
  const ids = (a.options ?? []).map((o) => o.id);
  if (a.type !== "multi") return ids;
  const out: string[][] = [];
  for (let m = 0; m < 1 << ids.length; m++) out.push(ids.filter((_, i) => m & (1 << i)));
  return out;
}
export function* combos(axes: Axis[], i = 0, acc: AxisState = {}): Generator<AxisState> {
  if (i === axes.length) { yield { ...acc }; return; }
  const a = axes[i];
  const vals = matches(acc, a.visible_when) ? axisDomain(a) : [a.default as AxisVal];
  for (const v of vals) { acc[a.id] = v; yield* combos(axes, i + 1, acc); }
  delete acc[a.id];
}

/* ---------------- giải luật ---------------- */
export type OutItem = Omit<Item, "show_when">;
export type OutBlock = { title: string; lead?: string; items: OutItem[] };
export type OutNote = Omit<Note, "show_when">;
export type OutSection = Omit<Section, "show_when" | "items" | "bullets"> & { items: OutItem[]; bullets: OutNote[] };
export type Resolved = {
  primary: Rule | null;
  conflicts: string[];            // id các luật primary cùng khớp (> 1 là lỗi dữ liệu)
  summary: { label: string; text: string }[];
  blocks: OutBlock[];
  avoid: OutItem[];
  notes: OutNote[];
  antibiogram: string[];
  before: OutSection[];
  after: OutSection[];
};

const stripItem = ({ show_when: _w, ...rest }: Item): OutItem => { void _w; return rest; };
const stripNote = ({ show_when: _w, ...rest }: Note): OutNote => { void _w; return rest; };
const items = (s: AxisState, xs: Item[] | undefined) => (xs ?? []).filter((x) => matches(s, x.show_when)).map(stripItem);
const notes = (s: AxisState, xs: Note[] | undefined) => (xs ?? []).filter((x) => matches(s, x.show_when)).map(stripNote);

/** Tìm luật primary khớp, ghép addon (block cùng title → nối items), lọc show_when ở block/dòng/ghi chú. */
export function resolve(g: Pick<IntlGuideline, "axes" | "rules" | "sections">, raw: AxisState): Resolved {
  const s = effectiveState(g.axes, raw);
  const prim = g.rules.filter((r) => r.kind === "primary" && matches(s, r.when));
  const primary = prim.length === 1 ? prim[0] : null;
  const out: Resolved = { primary, conflicts: prim.length > 1 ? prim.map((r) => r.id) : [], summary: [], blocks: [], avoid: [], notes: [], antibiogram: [], before: [], after: [] };
  if (primary) {
    const applied = [primary, ...g.rules.filter((r) => r.kind === "addon" && matches(s, r.when))];
    out.summary = primary.summary ?? [];
    for (const r of applied) {
      for (const b of r.blocks ?? []) {
        if (!matches(s, b.show_when)) continue;
        const its = items(s, b.items);
        const same = out.blocks.find((x) => x.title === b.title);
        if (same) same.items.push(...its);
        else out.blocks.push({ title: b.title, ...(b.lead ? { lead: b.lead } : {}), items: its });
      }
      out.avoid.push(...items(s, r.avoid));
      out.notes.push(...notes(s, r.notes));
      if (r.antibiogram_reminder) out.antibiogram.push(r.antibiogram_reminder);
    }
  }
  for (const sec of g.sections ?? []) {
    if (!matches(s, sec.show_when)) continue;
    const { show_when: _w, items: its, bullets, ...rest } = sec;
    void _w;
    (sec.position === "before" ? out.before : out.after).push({ ...rest, items: items(s, its), bullets: notes(s, bullets) });
  }
  return out;
}

/** Nội dung hiển thị (bỏ thông tin luật) – dùng để so sánh hai cách biểu diễn. */
export function rendered(g: Pick<IntlGuideline, "axes" | "rules" | "sections">, raw: AxisState) {
  const r = resolve(g, raw);
  return { summary: r.summary, blocks: r.blocks, avoid: r.avoid, notes: r.notes, antibiogram: r.antibiogram, before: r.before, after: r.after, ok: !!r.primary };
}
