/*
  Module Tai Mũi Họng – dựng nội dung hiển thị của công cụ chọn kháng sinh (hàm thuần, dùng chung cho giao diện và kiểm thử).
  - visibleInputs: trường đang hiện (showWhen) và đầu vào hiệu lực.
  - buildView: nhóm thuốc Lựa chọn đầu tay / Phối hợp thêm / Dị ứng / Thất bại; xem trước phác đồ khi quyết định là
    "xét nghiệm trước" (rule.preview); khi nguồn chính không có dòng liều phù hợp thì hiện liều của nguồn đối chiếu (có nhãn).
*/
import type { ComputedDose, DecideResult, Decision, DecisionRule, Disease, Dose, InputSpec, Inputs } from "@/types/ent";
import { condTrue, decide } from "./decide";

export function visibleInputs(d: Disease, inp: Inputs): { shown: InputSpec[]; eff: Inputs } {
  let eff: Inputs = { ...inp };
  let shown: InputSpec[] = d.inputs;
  for (let i = 0; i < 4; i++) {
    shown = d.inputs.filter((s) => !s.showWhen || s.showWhen.every((c) => condTrue(c, eff)));
    const next = Object.fromEntries(Object.entries(inp).filter(([k, v]) => v !== undefined && shown.some((s) => s.field === k)));
    if (JSON.stringify(next) === JSON.stringify(eff)) break;
    eff = next;
  }
  return { shown, eff };
}

const routeShort = (r: string) => (/tĩnh mạch/.test(r) && /uống/.test(r) ? "uống hoặc tĩnh mạch" : /tĩnh mạch/.test(r) ? "tĩnh mạch" : /tiêm bắp/.test(r) ? "tiêm bắp" : /uống/.test(r) ? "uống" : r);

/** Một dòng tóm tắt phác đồ: đơn trị, chọn 1, hoặc phối hợp (thuốc addOn cộng vào các lựa chọn). */
export function regimenSummary(doses: Dose[]): string {
  const name = (d: Dose) => `${d.drug} ${routeShort(d.route)}`;
  const base = doses.filter((d) => !d.addOn), adds = doses.filter((d) => d.addOn);
  if (!base.length) return "";
  if (adds.length) return `Phối hợp: ${base.map(name).join(" hoặc ")} + ${adds.map(name).join(" + ")}`;
  return base.length > 1 ? `Chọn 1: ${base.map(name).join(" hoặc ")}` : `Đơn trị: ${name(base[0])}`;
}

export const ABX_DECISIONS: Decision[] = ["antibiotic", "antibiotic_or_observe", "antibiotic_or_refer", "reassess_switch", "no_primary"];

export interface EntView {
  r: DecideResult;
  rule?: DecisionRule;
  missing: string[];
  ready: boolean;
  /** Nhãn khi phác đồ là xem trước (ví dụ “Nếu RADT hoặc cấy họng dương tính”). */
  previewLabel?: string;
  firsts: Dose[];
  adds: Dose[];
  algs: Dose[];
  fails: Dose[];
  /** Liều nguồn đối chiếu hiển thị trong khối chính vì nguồn chính không có dòng liều phù hợp. */
  inlineCmp: Dose[];
  /** Liều nguồn đối chiếu còn lại (khối đóng). */
  cmp: Dose[];
  computed: ComputedDose[];
}

export function buildView(d: Disease, inp: Inputs): EntView {
  const { shown, eff } = visibleInputs(d, inp);
  const r = decide(d, eff);
  const noPrimary = d.primarySources.length === 0;
  const missing = shown.filter((s) => s.type === "select" && eff[s.field] === undefined).map((s) => s.label);
  const ready = !!r.decision && !missing.length;
  const rule = r.decision ? d.rules.find((x) => x.id === r.decision!.ruleId) : undefined;
  let src = r;
  let previewLabel: string | undefined;
  if (rule?.preview && ready) {
    src = decide(d, { ...eff, ...rule.preview.set });
    previewLabel = rule.preview.label;
  }
  const pool = noPrimary ? src.reference.doses : [...src.first, ...src.alternatives, ...src.other];
  const isAlg = (x: Dose) => x.line === "alternative_allergy" || (!!x.allergy && !x.allergy.includes("none"));
  const firsts = pool.filter((x) => !x.addOn && !isAlg(x));
  const adds = pool.filter((x) => x.addOn);
  const algs = pool.filter((x) => !x.addOn && isAlg(x));
  const isFail = (x: Dose) => x.line === "failure" || x.line === "failure_alternative";
  const failCmp = src.comparison.filter(isFail);
  const fails = noPrimary ? [] : [...src.failure, ...failCmp];
  let cmp = src.comparison.filter((x) => !isFail(x));
  let inlineCmp: Dose[] = [];
  const abx = !!r.decision && (ABX_DECISIONS.includes(r.decision.value) || !!previewLabel);
  if (ready && abx && !pool.length && !fails.length && cmp.length) { inlineCmp = cmp; cmp = []; }
  return { r, rule, missing, ready, previewLabel, firsts, adds, algs, fails, inlineCmp, cmp, computed: src.computed };
}
