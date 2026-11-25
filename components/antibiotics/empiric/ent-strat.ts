/*
  FILE: components/antibiotics/empiric/ent-strat.ts

  Tai mũi họng – dựng khối thuốc quốc tế cho khung phân tầng từ dữ liệu module ENT (data/ent/diseases/*.json,
  mọi dòng liều có trích dẫn nguồn). Không nhập lại liều: mỗi cột lấy đúng các dòng liều mà luật quyết định của module
  chọn (rule.doseIds), chỉ dòng đã trích (status EXTRACTED), bỏ nguồn tham khảo (UCSF, tóm tắt NHS).
  - Nguồn chính (role primary) vào cột; nguồn đối chiếu (role comparison) vào mục thu gọn, trừ khi cột không có dòng
    nguồn chính (khi đó hiện nguồn đối chiếu trong cột, như công cụ ENT).
  - Khoang cổ sâu: cột quốc tế lấy từ SFORL 2024 (ent-extra-intl.ts); viêm tai giữa người lớn: module ENT chỉ có nguồn tham khảo
    (NHS) → chỉ đặt trong mục thu gọn.
  Mức khuyến cáo hiển thị đúng nhãn của nguồn qua mã "T:<nhãn>" (Grade trong rx-tool).
*/
import type { Disease, Dose, Statement } from "../../../types/ent";
import { DISEASES, SOURCES } from "../../../data/ent";
import type { StratCite, StratIntl } from "../../../data/antibiotics/empiric/stratification";

const disease = (id: string): Disease => {
  const d = DISEASES.find((x) => x.id === id);
  if (!d) throw new Error(`ENT: thiếu ${id}`);
  return d;
};
/** Tên nguồn ngắn: "AAO-HNSF 2025". */
export const entShort = (sourceId: string) => {
  const s = SOURCES.find((x) => x.id === sourceId);
  return s ? `${s.org.replace(" (DailyMed)", "").replace("Canadian Paediatric Society", "Hội Nhi khoa Canada")} ${s.year}` : sourceId;
};
export const entSourceLine = (sourceId: string) => {
  const s = SOURCES.find((x) => x.id === sourceId);
  return s ? `${s.org}. ${s.title} (${s.year}).` : sourceId;
};

function gradeOf(strength?: string, quality?: string): string | undefined {
  const st = (strength ?? "").replace(/^Strong [Rr]ecommendation$/, "Mạnh").replace(/^Recommendation \(against\)$/, "Khuyến cáo không dùng")
    .replace(/^Recommendation$/, "Khuyến cáo").replace(/^Option$/, "Tùy chọn").replace(/^[Ss]trong$/, "Mạnh").replace(/^[Ww]eak$/, "Yếu");
  const q = (quality ?? "").replace(/^Grade /, "").replace(/^Evidence Quality: /, "").replace(/^high$/, "cao").replace(/^moderate$/, "TB").replace(/^low$/, "thấp");
  const t = [st, q].filter(Boolean).join(" · ");
  return t ? `T:${t}` : undefined;
}

const isAlg = (d: Dose) => d.line === "alternative_allergy" || (!!d.allergy && !d.allergy.includes("none"));
function roleOf(d: Dose): string {
  if (d.addOn) return "Phối hợp thêm";
  if (isAlg(d)) {
    const a = d.allergy ?? [];
    return a.length === 1 && a[0] === "nonsevere" ? "Dị ứng penicilin – không nặng" : a.length === 1 && a[0] === "severe" ? "Dị ứng penicilin – nặng" : "Dị ứng penicilin";
  }
  return ({ failure: "Thất bại điều trị", failure_alternative: "Thất bại – thay thế", risk_resistance: "Nguy cơ kháng thuốc", severe: "Nặng, nhập viện", step_down: "Chuyển uống" } as Record<string, string>)[d.line] ?? "Chọn một";
}
/* Thẻ thuốc gọn: điều kiện dài của dòng liều rút thành nhãn ngắn (role) và một ghi chú nhỏ (note).
   Chỉ tóm lược đúng nội dung điều kiện/lưu ý của dòng liều; dữ liệu gốc (JSON) giữ nguyên. */
const FDA = "Chỉ khi không còn lựa chọn khác (cảnh báo FDA).";
const SHORT: Record<string, { role?: string; note?: string }> = {
  "abrsa-aao-amox": { role: "Không nguy cơ kháng thuốc" },
  "abrsa-aao-amoxclav": { role: "Có nguy cơ kháng amoxicillin", note: "Ví dụ: kháng sinh trong tháng qua, > 65 tuổi, bệnh nền, suy giảm miễn dịch, triệu chứng vừa–nặng." },
  "abrsa-aao-amoxclav-high": { role: "Nguy cơ phế cầu không nhạy penicilin", note: "Nhiễm khuẩn nặng, sốt ≥ 39 °C, > 65 tuổi, mới nằm viện, kháng sinh trong tháng qua, suy giảm miễn dịch." },
  "abrsa-aao-doxy": {},
  "abrsa-aao-cefixime": { note: "± clindamycin 450 mg uống 3 lần/ngày." },
  "abrsa-aao-cefpodoxime": { note: "± clindamycin 450 mg uống 3 lần/ngày." },
  "abrsa-aao-levo": { note: FDA },
  "abrsa-aao-moxi": { note: FDA },
  "abrsa-aao-fail-amoxclav": { role: "Thất bại sau 3–5 ngày" },
  "abrsa-aao-fail-levo": { note: FDA },
  "abrsa-aao-fail-moxi": { note: FDA },
  "abrsp-amox-std": { role: "≥ 2 tuổi, nhẹ–vừa", note: "Không đi nhà trẻ, không dùng kháng sinh 4 tuần qua." },
  "abrsp-amox-high": { role: "Tỷ lệ phế cầu không nhạy cảm > 10%" },
  "abrsp-amoxclav-high": { role: "Vừa–nặng, < 2 tuổi, đi nhà trẻ hoặc mới dùng kháng sinh" },
  "abrsp-ceftriaxone": { role: "Nôn, không uống được", note: "Cải thiện sau 24 giờ: chuyển uống." },
  "abrsp-fail-amoxclav": { role: "Đang dùng amoxicillin, nặng lên trong 72 giờ" },
  "abrsp-fail-after-amoxclav": { role: "Đang dùng amoxicillin-clavulanate, nặng lên", note: "Linezolid khi tỷ lệ phế cầu kháng clindamycin cao." },
  "abrsp-fail-observe": { role: "Đang theo dõi, nặng lên" },
  "gas-cefalexin": { note: "Tránh nếu quá mẫn tức thì với penicilin." },
  "gas-cefadroxil": { note: "Tránh nếu quá mẫn tức thì với penicilin." },
  "aom-amoxclav": { role: "Dùng amoxicillin 30 ngày qua, viêm kết mạc mủ hoặc tái phát" },
  "aom-fail-amoxclav": { role: "Thất bại sau 48–72 giờ" },
  "aom-fail-ceftriaxone": { role: "Thất bại sau 48–72 giờ" },
  "aom-fail-clinda": { note: "Thất bại lần hai: kèm cephalosporin thế hệ 3, chọc màng nhĩ, hội chẩn chuyên khoa." },
  /* Nguồn đối chiếu và tham khảo (IDSA 2012, NICE, Hội Nhi khoa Canada, NHS) */
  ...Object.fromEntries([
    ["abrsa-nice-penv", "Đầu tay"], ["abrsp-nice-penv", "Đầu tay"], ["gas-nice-penv-adult", "Đầu tay"], ["gas-nice-penv-child", "Đầu tay"],
    ["abrsa-idsa-amoxclav", "Đầu tay"], ["abrsp-idsa-amoxclav-dose", "Đầu tay"], ["aom-cps-amox-bid", "Đầu tay"], ["aom-cps-amox-tid", "Đầu tay"], ["aom-nice-amox", "Đầu tay"],
    ["abrsa-uk-penv", "Đầu tay"], ["aomad-uk-amox", "Đầu tay"],
    ["abrsa-nice-coamox", "Rất mệt, nguy cơ biến chứng, hoặc thất bại sau 2–3 ngày"], ["abrsp-nice-coamox", "Rất mệt, nguy cơ biến chứng, hoặc thất bại sau 2–3 ngày"],
    ["abrsa-idsa-amoxclav-high", "Nguy cơ kháng thuốc hoặc thất bại"], ["abrsp-idsa-amoxclav-high", "Nguy cơ kháng thuốc hoặc thất bại"],
    ["abrsa-idsa-doxy", "Dị ứng beta-lactam"], ["abrsa-idsa-levo", "Dị ứng beta-lactam, nguy cơ kháng thuốc hoặc thất bại"], ["abrsa-idsa-moxi", "Dị ứng beta-lactam, nguy cơ kháng thuốc hoặc thất bại"],
    ["abrsp-idsa-levo", "Quá mẫn type I với penicilin"], ["abrsp-idsa-clinda-cef", "Quá mẫn không type I với penicilin"],
    ["abrsp-idsa-fail-clinda-cef", "Thất bại điều trị"], ["abrsp-idsa-fail-levo", "Thất bại điều trị"],
    ["abrsa-nice-ery", "Dị ứng penicilin, mang thai"], ["abrsp-nice-ery", "Dị ứng penicilin, mang thai"], ["gas-nice-ery", "Dị ứng penicilin, mang thai"], ["aom-nice-ery", "Dị ứng penicilin, mang thai"],
    ["abrsa-uk-ery", "Dị ứng penicilin, mang thai"], ["gas-uk-ery", "Dị ứng penicilin, mang thai"], ["aomad-uk-ery", "Dị ứng penicilin, mang thai"],
    ["abrsa-uk-clari", "Dị ứng penicilin"], ["gas-uk-clari", "Dị ứng penicilin"], ["aomad-uk-clari", "Dị ứng penicilin"],
    ["aom-cps-cefuroxime", "Dị ứng penicilin không đe dọa tính mạng"], ["aom-cps-ceftriaxone", "Dị ứng penicilin"],
    ["aom-cps-fail-amoxclav", "Thất bại sau 2–3 ngày"], ["aom-cps-fail-ceftriaxone", "Không uống được hoặc thất bại amoxicillin-clavulanate"],
    ["abrsa-uk-coamox", "Lựa chọn thứ hai hoặc rất mệt"], ["aomad-uk-coamox", "Lựa chọn thứ hai"], ["gas-uk-penv", "Đầu tay"],
  ].map(([id, role]) => [id, { role }])),
  ...Object.fromEntries(["abrsa-nice-doxy", "abrsa-nice-clari", "abrsp-nice-clari", "gas-nice-clari-adult", "gas-nice-clari-child", "aom-nice-clari"]
    .map((id) => [id, { role: "Dị ứng penicilin", note: "Không mang thai." }])),
  "abrsp-nice-doxy": { role: "Dị ứng penicilin, ≥ 12 tuổi", note: "Không mang thai." },
  "abrsa-uk-doxy": { role: "Dị ứng penicilin", note: "Không dùng cho trẻ < 12 tuổi." },
  "aom-nice-coamox": { role: "Thất bại sau 2–3 ngày", note: "Dị ứng penicilin: hỏi ý kiến bác sĩ vi sinh." },
  "aomad-uk-amox": { role: "Đầu tay", note: "Kháng sinh ngay chỉ khi rất mệt hoặc nguy cơ cao biến chứng." },
  ...Object.fromEntries(["abrsa-idsa-sam", "abrsa-idsa-levo-iv", "abrsa-idsa-moxi-iv", "abrsa-idsa-cro", "abrsa-idsa-ctx",
    "abrsp-idsa-hosp-sam", "abrsp-idsa-hosp-cro", "abrsp-idsa-hosp-ctx", "abrsp-idsa-hosp-levo"].map((id) => [id, { role: "Nặng, nhập viện" }])),
};
/* Dòng liều có liều, đường dùng và số lần dùng tách theo cân nặng: ghép lại cho đọc liền (cùng số liệu). */
const DOSE_FIX: Record<string, string> = {
  "aom-cps-fail-amoxclav": "≤ 35 kg: 45–60 mg/kg/ngày chia 3 lần; > 35 kg: viên 500 mg 3 lần/ngày, uống",
};
/** Một dòng liều của module → thẻ thuốc gọn (tên thuốc; liều, đường dùng, số lần dùng; thời gian; ghi chú ngắn; mức khuyến cáo). */
export function entItem(d: Dose): StratIntl["items"][number] {
  const noDose = /chỉ nêu|không nêu/u.test(d.dose);
  const sh = SHORT[d.id];
  const cond = sh ? sh.note ?? "" : [d.condition, d.caution && !(d.condition ?? "").includes(d.caution) ? d.caution : ""].filter(Boolean).join(". ");
  const note = [cond && !/[.)]$/u.test(cond) ? `${cond}.` : cond, noDose ? "Liều theo các dòng nguồn đối chiếu." : "", d.max ? `Tối đa ${d.max}.` : ""].filter(Boolean).join(" ");
  return {
    role: sh?.role ?? roleOf(d),
    text: d.drug,
    ...(noDose ? {} : { dose: DOSE_FIX[d.id] ?? `${d.dose} ${d.route}${d.interval ? ` ${d.interval}` : ""}` }),
    ...(d.duration ? { course: d.duration.replace(/ hoặc triệu chứng nặng: /u, " hoặc nặng: ").replace(/ nhẹ–vừa: /gu, ": ") } : {}),
    ...(note ? { administration: note } : {}),
    ...(isAlg(d) ? { al: "alt" as const } : {}),
    ...(gradeOf(d.strength, d.quality) ? { grade: gradeOf(d.strength, d.quality) } : {}),
    ref: entShort(d.citation.sourceId),
  };
}

type Pop = "adult" | "child";
function ruleDoses(diseaseId: string, ruleId: string, pop?: Pop): Dose[] {
  const d = disease(diseaseId);
  const rule = d.rules.find((r) => r.id === ruleId);
  if (!rule) throw new Error(`ENT: thiếu luật ${ruleId}`);
  const byId = new Map(d.doses.map((x) => [x.id, x]));
  return (rule.doseIds ?? []).map((id) => byId.get(id)).filter((x): x is Dose => !!x)
    .filter((x) => x.status === "EXTRACTED" && x.role !== "reference" && (!pop || x.population === pop || x.population === "all"));
}
function groupBySource(doses: Dose[], label: string): StratIntl[] {
  const ids = Array.from(new Set(doses.map((x) => x.citation.sourceId)));
  return ids.map((sid) => ({ source: `${entShort(sid)} – ${label}`, items: doses.filter((x) => x.citation.sourceId === sid).map(entItem) }));
}
/** Khối thuốc của một cột: nguồn chính; không có thì nguồn đối chiếu. */
export function entColumn(diseaseId: string, ruleId: string, pop?: Pop): StratIntl[] {
  const all = ruleDoses(diseaseId, ruleId, pop);
  const primary = all.filter((x) => x.role === "primary");
  return primary.length ? groupBySource(primary, "khuyến cáo chính") : groupBySource(all, "đối chiếu");
}
/** Nguồn đối chiếu của một cột (khi cột đã có nguồn chính) – đặt trong mục thu gọn. */
export function entComparison(diseaseId: string, ruleId: string, pop?: Pop): StratIntl[] {
  const all = ruleDoses(diseaseId, ruleId, pop);
  return all.some((x) => x.role === "primary") ? groupBySource(all.filter((x) => x.role !== "primary"), "đối chiếu") : [];
}
/* Thứ tự trong một khối đối chiếu: đầu tay → nguy cơ kháng thuốc → thất bại → nặng, nhập viện → dị ứng. */
const LINE_RANK: Record<string, number> = { first: 0, risk_resistance: 1, failure: 2, failure_alternative: 2, severe: 3, alternative_allergy: 4 };
/**
 * Nguồn đối chiếu theo từng nguồn (không theo luật): mỗi nguồn một khối, đủ mọi dòng liều đã trích của nguồn đó cho nhóm
 * tuổi, xếp theo thứ tự lâm sàng, bỏ dòng trùng (cùng thuốc, liều, tình huống).
 */
export function entCompareBySource(diseaseId: string, pop?: Pop, label = "đối chiếu"): StratIntl[] {
  const d = disease(diseaseId);
  const doses = d.doses.filter((x) => x.status === "EXTRACTED" && x.role === "comparison" && (!pop || x.population === pop || x.population === "all"));
  /* Hội chuyên môn (IDSA, Hội Nhi khoa Canada) trước, NICE sau – khớp tiêu đề mục. */
  const ids = Array.from(new Set(doses.map((x) => x.citation.sourceId))).sort((a, b) => Number(a.startsWith("NICE")) - Number(b.startsWith("NICE")));
  return ids.map((sid) => {
    const seen = new Set<string>();
    const items = doses.filter((x) => x.citation.sourceId === sid)
      .sort((a, b) => (LINE_RANK[a.line] ?? 5) - (LINE_RANK[b.line] ?? 5))
      .map(entItem)
      .filter((i) => { const k = `${i.role}|${i.text}|${i.dose ?? ""}`; if (seen.has(k)) return false; seen.add(k); return true; });
    return { source: `${entShort(sid)} – ${label}`, ...(SOURCE_NOTE[sid] ? { lead: SOURCE_NOTE[sid] } : {}), items };
  });
}

/* Dòng giới thiệu nguồn tham khảo: chỉ dữ kiện về nguồn (tổ chức, năm, phạm vi) và phần nguồn đó có thêm so với khuyến
   cáo chính – rút từ chính các dòng liều đã trích, không đánh giá thuốc. */
const SOURCE_NOTE: Record<string, string> = {
  "IDSA-2012-ABRS": "Hội Bệnh truyền nhiễm Hoa Kỳ (2012). Có thêm: phác đồ tĩnh mạch khi nặng, nhập viện.",
  "NICE-NG79": "Viện NICE, Anh (2017) – chăm sóc ban đầu. Có thêm: liều theo tuổi cho trẻ, phương án khi mang thai.",
  "NICE-NG84": "Viện NICE, Anh (2018) – chăm sóc ban đầu. Có thêm: liều theo tuổi cho trẻ, phương án khi mang thai.",
  "NICE-NG91": "Viện NICE, Anh (2018) – chăm sóc ban đầu. Có thêm: liều theo tuổi cho trẻ, phương án khi mang thai.",
  "CPS-AOM": "Hội Nhi khoa Canada (2016). Có thêm: amoxicillin chia 2 hoặc 3 lần/ngày, ceftriaxon 3 ngày.",
};
/** Câu hướng dẫn khi các nguồn khác nhau – đặt đầu bảng so sánh và mỗi mục tham khảo. */
export const ENT_GUIDE = "Khi các nguồn khác nhau: chọn theo khuyến cáo chính ở các cột trên và kháng sinh đồ BV199. Nguồn tham khảo chỉ dùng cho tình huống khuyến cáo chính không đề cập (ví dụ liều theo tuổi, mang thai).";

/* ---------- Bảng so sánh nhanh: hàng = tình huống, cột = nguồn, ô = tên thuốc (liều xem ở khối thuốc) ---------- */
const ROWS = ["Đầu tay", "Nguy cơ kháng thuốc", "Thất bại", "Nặng, nhập viện", "Dị ứng penicilin"] as const;
type Row = (typeof ROWS)[number];
/** Thống nhất tên thuốc giữa các nguồn để so được (cùng hoạt chất, khác cách viết). */
export const tableName = (drug: string) => drug
  .replace(/^Co-amoxiclav.*$/u, "Amoxicillin-clavulanate").replace(/Amoxicillin\/acid clavulanic/gu, "Amoxicillin-clavulanate")
  .replace(/Phenoxymethylpenicillin|Penicillin V/gu, "Penicilin V").replace(/Benzathine penicillin G/gu, "Benzathin penicilin G")
  .replace(/ \(công thức 7:1\)| \(liều chuẩn\)| \(cách dùng thay thế\)|-axetil/gu, "").replace(/ \(liều cao\)/gu, " liều cao");
function rowOf(d: Dose): Row | null {
  if (isAlg(d)) return "Dị ứng penicilin";
  return ({ first: "Đầu tay", risk_resistance: "Nguy cơ kháng thuốc", failure: "Thất bại", failure_alternative: "Thất bại", severe: "Nặng, nhập viện" } as Record<string, Row>)[d.line] ?? null;
}
function cellName(d: Dose): string {
  const a = d.allergy ?? [];
  const tag = /mang thai/u.test(d.condition ?? "") && !/không mang thai/u.test(d.condition ?? "") ? " (mang thai)"
    : a.length === 1 && a[0] === "nonsevere" ? " (không nặng)" : a.length === 1 && a[0] === "severe" ? " (nặng)" : "";
  const high = d.line === "risk_resistance" && !/liều cao/u.test(d.drug) ? " liều cao" : "";
  return `${tableName(d.drug)}${high}${tag}`;
}
export type CompareTable = { cols: string[]; rows: { label: string; cells: string[] }[] };
/**
 * Bảng so sánh của một bệnh và nhóm tuổi: cột đầu là khuyến cáo chính (gộp các nguồn chính), sau đó từng nguồn đối chiếu
 * (hội chuyên môn trước, NICE sau), cuối cùng các khối bổ sung (vd. Nhi khoa Ý 2025) map theo nhãn tình huống.
 */
export function entCompareTable(diseaseId: string, pop: Pop, extra: { label: string; block: StratIntl }[] = []): CompareTable {
  const d = disease(diseaseId);
  const doses = d.doses.filter((x) => x.status === "EXTRACTED" && (x.population === pop || x.population === "all"));
  const primary = doses.filter((x) => x.role === "primary");
  const cmpIds = Array.from(new Set(doses.filter((x) => x.role === "comparison").map((x) => x.citation.sourceId)))
    .sort((a, b) => Number(a.startsWith("NICE")) - Number(b.startsWith("NICE")));
  const primLabel = `${Array.from(new Set(primary.map((x) => entShort(x.citation.sourceId)))).join(", ")} (chính)`;
  const groups: { label: string; rows: Map<Row, string[]> }[] = [];
  const add = (label: string, pairs: [Row | null, string][]) => {
    const rows = new Map<Row, string[]>();
    for (const [r, n] of pairs) if (r) rows.set(r, Array.from(new Set([...(rows.get(r) ?? []), n])));
    groups.push({ label, rows });
  };
  add(primLabel, primary.map((x) => [rowOf(x), cellName(x)]));
  for (const sid of cmpIds) add(entShort(sid), doses.filter((x) => x.role === "comparison" && x.citation.sourceId === sid).map((x) => [rowOf(x), cellName(x)]));
  for (const e of extra) add(e.label, e.block.items.map((i) => {
    const r: Row | null = /^Chọn một/u.test(i.role) ? "Đầu tay" : /Thất bại/u.test(i.role) ? "Thất bại" : /Dị ứng/u.test(i.role) ? "Dị ứng penicilin" : null;
    return [r, tableName(i.text.replace(/ \([^)]*\)/gu, ""))];
  }));
  return {
    cols: groups.map((g) => g.label),
    rows: ROWS.map((r) => ({ label: r, cells: groups.map((g) => (g.rows.get(r) ?? []).join("; ") || "—") }))
      .filter((r) => r.cells.some((c) => c !== "—")),
  };
}
/** Dòng liều nguồn tham khảo (module không có nguồn chính, ví dụ viêm tai giữa người lớn) – chỉ dùng trong mục thu gọn. */
export function entReference(diseaseId: string): StratIntl[] {
  const doses = disease(diseaseId).doses.filter((x) => x.status === "EXTRACTED" && x.role === "reference");
  return groupBySource(doses, "tham khảo, không phải khuyến cáo hội chuyên môn");
}
/* Nguyên tắc và dấu hiệu nặng viết gọn: id → một câu tóm lược đúng nội dung; "" = bỏ vì đã có nguyên ý trong thẻ thuốc
   hoặc tiêu chí cột. Id không có trong bảng giữ câu gốc. */
const SHORT_ST: Record<string, string> = {
  "abrsa-aao-kas1a": "Chẩn đoán khi chảy mũi mủ kèm nghẹt mũi hoặc đau tức mặt ≥ 10 ngày không cải thiện, hoặc nặng lên lại sau khi đã đỡ.",
  "abrsa-aao-kas1b": "Không chụp phim, trừ khi nghi biến chứng.",
  "abrsa-aao-kas2": "Viêm xoang do virus: giảm đau, corticoid xịt, rửa mũi; không kháng sinh.",
  "abrsa-aao-kas3": "Giảm đau, corticoid xịt mũi, rửa mũi nước muối giúp giảm triệu chứng.",
  "abrsa-aao-kas4": "Không biến chứng, tái khám được: có thể theo dõi chờ đợi, không kháng sinh.",
  "abrsa-aao-ww": "Theo dõi 3–5 ngày; nặng lên hoặc không cải thiện thì dùng kháng sinh.",
  "abrsa-aao-severe": "",
  "abrsa-aao-kas5": "Đầu tay: amoxicillin ± clavulanat, 5–7 ngày.",
  "abrsa-aao-amox-pref": "",
  "abrsa-aao-high": "",
  "abrsa-aao-no-macrolide": "Không dùng macrolid, trimethoprim-sulfamethoxazol (tỷ lệ kháng cao).",
  "abrsa-aao-no-fq": "Fluoroquinolon không còn là lựa chọn đầu tay (cảnh báo FDA).",
  "abrsa-aao-allergy": "Báo dị ứng penicilin: nên làm test dị ứng.",
  "abrsa-aao-duration": "",
  "abrsa-aao-kas6": "Không cải thiện sau 3–5 ngày kháng sinh: đánh giá lại, loại trừ biến chứng rồi đổi thuốc.",
  "abrsa-aao-failure": "",
  "abrsa-rf-aao-complication": "Sốt, lồi mắt, giảm thị lực, đau đầu dữ dội, rối loạn ý thức, phù đỏ quanh mắt: chuyển cấp cứu, chụp CT.",
  "abrsa-rf-aao-suppurative": "Nghi biến chứng mủ hoặc nguồn gốc răng: kháng sinh ngay hoặc chuyển chuyên khoa.",
  "abrsa-rf-nice-refer": "Chuyển viện khi nhiễm khuẩn toàn thân nặng, biến chứng hốc mắt hoặc nội sọ.",
  "abrsa-rf-refer": "Chuyển chuyên khoa khi suy giảm miễn dịch, xấu đi dù đã dùng kháng sinh, hoặc tái phát nhiều đợt.",
  "abrsa-rf-ct": "",
  "gas-idsa12-r1": "Làm RADT và/hoặc cấy họng, trừ khi biểu hiện virus rõ; trẻ em RADT âm tính thì cấy xác nhận.",
  "gas-idsa12-r2": "",
  "gas-idsa12-r5": "",
  "gas-idsa12-r6": "Không xét nghiệm lại sau điều trị.",
  "gas-idsa12-r8": "Penicilin hoặc amoxicillin, đủ 10 ngày.",
  "gas-idsa12-r9": "",
  "gas-idsa12-adj": "Giảm đau, hạ sốt bằng paracetamol hoặc NSAID; không dùng aspirin cho trẻ em, không corticoid.",
  "gas-idsa12-r13": "Không cắt amidan chỉ để giảm số đợt viêm họng.",
  "gas-cdc-treat": "",
  "gas-cdc-diag": "",
  "gas-cdc-allergy": "",
  "gas-cdc-resistance": "Chưa có liên cầu nhóm A kháng penicilin; kháng macrolid, clindamycin thay đổi theo vùng.",
  "gas-rf-suppurative": "Nghi áp xe quanh amidan, sau họng, viêm hạch cổ mủ: xem bệnh tương ứng.",
  "gas-rf-highrisk": "",
  "gas-rf-nice-refer": "Chuyển viện khi nhiễm khuẩn toàn thân nặng hoặc áp xe quanh amidan, cạnh họng, sau họng, hội chứng Lemierre.",
  "aom-kas1a": "Chẩn đoán khi màng nhĩ phồng vừa–nhiều hoặc chảy mủ tai mới.",
  "aom-kas1c": "Không chẩn đoán khi không có tràn dịch tai giữa.",
  "aom-kas2": "Luôn đánh giá và điều trị đau.",
  "aom-kas3a": "", "aom-kas3b": "", "aom-kas3c": "", "aom-kas3d": "", "aom-kas4a": "", "aom-kas4b": "",
  "aom-kas4c": "Không đáp ứng sau 48–72 giờ: khám lại, cân nhắc đổi thuốc.",
  "aom-kas5a": "Không dùng kháng sinh dự phòng cho viêm tai giữa tái phát.",
  "aom-duration": "Thời gian: < 2 tuổi hoặc nặng 10 ngày; 2–5 tuổi 7 ngày; ≥ 6 tuổi 5–7 ngày.",
  "aom-allergy-ceph": "Dị ứng penicilin không nặng: dùng được cephalosporin thế hệ 2–3.",
  "aom-rf-toxic": "Trẻ có vẻ nhiễm độc, đau tai > 48 giờ, sốt ≥ 39 °C hoặc khó tái khám: xếp nhóm nặng, dùng kháng sinh.",
  "aom-rf-second-failure": "Thất bại lần hai: chọc màng nhĩ hoặc hội chẩn chuyên khoa.",
  "aom-rf-cps-worse": "",
  "aom-rf-nice-refer": "Chuyển viện khi viêm xương chũm, viêm màng não, áp xe nội sọ, liệt mặt.",
};
const shortSt = <T extends { id: string; text: string }>(x: T) => (x.id in SHORT_ST ? SHORT_ST[x.id] : x.text);

/** Khuyến cáo của nguồn chính (đã trích) – phần nguyên tắc. */
export function entPrinciples(diseaseId: string, title: string, filter?: (s: Statement) => boolean): StratIntl {
  const d = disease(diseaseId);
  const items = d.statements.filter((s) => s.role === "primary" && s.status === "EXTRACTED" && (!filter || filter(s)) && shortSt(s)).map((s) => ({
    role: s.kind === "recommendation" ? "Khuyến cáo" : "Ghi chú",
    text: shortSt(s),
    ref: entShort(s.citation.sourceId),
    ...(gradeOf(s.strength, s.quality) ? { grade: gradeOf(s.strength, s.quality) } : {}),
  }));
  return { source: title, items };
}
/** Dấu hiệu nặng của module. */
export const entRedFlags = (diseaseId: string): StratIntl["items"] =>
  disease(diseaseId).redFlags.filter((s) => s.status === "EXTRACTED" && shortSt(s)).map((s) => ({ role: "Dấu hiệu nặng", text: shortSt(s), ref: entShort(s.citation.sourceId) }));
export const entCite = (text: string, sourceId: string, ref = ""): StratCite => ({ text, source: entShort(sourceId), ref });
export const entSources = (diseaseId: string) => {
  const d = disease(diseaseId);
  return [...d.primarySources, ...d.comparisonSources].map(entSourceLine);
};
