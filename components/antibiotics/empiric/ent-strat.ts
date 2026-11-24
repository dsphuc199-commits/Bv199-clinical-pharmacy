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
  return s ? `${s.org.replace(" (DailyMed)", "")} ${s.year}` : sourceId;
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
    ...(noDose ? {} : { dose: `${d.dose} ${d.route}${d.interval ? ` ${d.interval}` : ""}` }),
    ...(d.duration ? { course: d.duration } : {}),
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
  return primary.length ? groupBySource(primary, "khuyến cáo") : groupBySource(all, "đối chiếu");
}
/** Nguồn đối chiếu của một cột (khi cột đã có nguồn chính) – đặt trong mục thu gọn. */
export function entComparison(diseaseId: string, ruleId: string, pop?: Pop): StratIntl[] {
  const all = ruleDoses(diseaseId, ruleId, pop);
  return all.some((x) => x.role === "primary") ? groupBySource(all.filter((x) => x.role !== "primary"), "đối chiếu") : [];
}
/** Dòng liều nguồn tham khảo (module không có nguồn chính, ví dụ viêm tai giữa người lớn) – chỉ dùng trong mục thu gọn. */
export function entReference(diseaseId: string): StratIntl[] {
  const doses = disease(diseaseId).doses.filter((x) => x.status === "EXTRACTED" && x.role === "reference");
  return groupBySource(doses, "tham khảo, không phải khuyến cáo hội chuyên môn");
}
/** Khuyến cáo của nguồn chính (đã trích) – phần nguyên tắc. */
export function entPrinciples(diseaseId: string, title: string, filter?: (s: Statement) => boolean): StratIntl {
  const d = disease(diseaseId);
  const items = d.statements.filter((s) => s.role === "primary" && s.status === "EXTRACTED" && (!filter || filter(s))).map((s) => ({
    role: s.kind === "recommendation" ? "Khuyến cáo" : "Ghi chú",
    text: s.text,
    ref: entShort(s.citation.sourceId),
    ...(gradeOf(s.strength, s.quality) ? { grade: gradeOf(s.strength, s.quality) } : {}),
  }));
  return { source: title, items };
}
/** Dấu hiệu nặng của module. */
export const entRedFlags = (diseaseId: string): StratIntl["items"] =>
  disease(diseaseId).redFlags.filter((s) => s.status === "EXTRACTED").map((s) => ({ role: "Dấu hiệu nặng", text: s.text, ref: entShort(s.citation.sourceId) }));
export const entCite = (text: string, sourceId: string, ref = ""): StratCite => ({ text, source: entShort(sourceId), ref });
export const entSources = (diseaseId: string) => {
  const d = disease(diseaseId);
  return [...d.primarySources, ...d.comparisonSources].map(entSourceLine);
};
