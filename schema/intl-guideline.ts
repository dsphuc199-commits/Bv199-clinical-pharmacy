/*
  schema/intl-guideline.ts – Zod schema cho JSON "Hướng dẫn quốc tế" (tab "Quốc tế").
  Bám theo docs/intl-format-spec.md, được rút ra từ code thực tế:
    components/antibiotics/empiric/rx-tool.tsx (RxItem, Grade, Rx, Seg, Row),
    components/antibiotics/empiric/gnb-bsi-intl.ts + GnbBsiIntl.tsx (Nhiễm khuẩn huyết Gram âm),
    components/antibiotics/empiric/sab-intl.ts + SabIntl.tsx (Nhiễm khuẩn huyết S. aureus).
  Thêm provenance (source_ids, sources, selection_rationale, review) theo quy trình soạn.
  Logic điều kiện (matches, resolve) ở lib/intl-rules.ts – dùng chung UI và scripts.
*/
import { z } from "zod";

/** Giá trị giữ chỗ khi UI cần trường mà guideline gốc không cung cấp. */
export const NEED = "CẦN XÁC MINH" as const;

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]*$/, "id chỉ gồm chữ không dấu, số, '-', '_'");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "định dạng YYYY-MM-DD");
const sourceIds = z.array(id).min(1, "mọi nội dung phải có ít nhất 1 source_id");
export const POPULATIONS = ["adult", "child", "neonate"] as const;
const population = z.enum(POPULATIONS);

/* ---------- Mã nhãn mức khuyến cáo (chip cột cuối bảng Rx – Grade() trong rx-tool.tsx) ----------
   Mỗi mã thuộc đúng 1 HỆ PHÂN MỨC (GRADE_SYSTEMS). Mã chỉ hợp lệ khi nguồn của dòng đó (source_ids)
   khai báo cùng hệ trong sources[].grade_system – kiểm tra ở scripts/validate-guidelines.ts.
   Cấm quy đổi giữa các hệ. */
export const GRADE_SYSTEMS = ["GRADE", "letter-roman", "consensus", "AAP", "IDSA-pathway", "IDSA-AMR", "none"] as const;
export const GRADE_CODES = ["GPS", "CR", "RV", "PW", "AMR"] as const;
export const grade = z.union([
  z.enum(GRADE_CODES),
  z.string().regex(/^[SC]-(H|M|L|VL)$/, "GRADE: S-|C- + H|M|L|VL"),
  z.string().regex(/^[A-E]-(I|II|III)[rthua]*$/, "chữ cái – số La Mã (+ chỉ số r/t/h/u/a của hệ ESCMID/ECIL), ví dụ A-II, A-IIu (chỉ khi nguồn dùng đúng hệ này)"),
  z.literal("Đồng thuận"),
  z.literal(NEED),
]);
/** Hệ phân mức của một mã grade; null với "CẦN XÁC MINH". */
export function gradeSystem(g: string): (typeof GRADE_SYSTEMS)[number] | null {
  if (g === NEED) return null;
  if (/^[SC]-(H|M|L|VL)$/.test(g) || g === "GPS") return "GRADE";
  if (/^[A-E]-(I|II|III)[rthua]*$/.test(g)) return "letter-roman";
  if (g === "Đồng thuận") return "consensus";
  if (g === "CR" || g === "RV") return "AAP";
  if (g === "PW") return "IDSA-pathway";
  if (g === "AMR") return "IDSA-AMR";
  return null;
}

/* ---------- Điều kiện ---------- */
export const condValue = z.union([
  z.string(),                                    // seg/select: bằng giá trị
  z.boolean(),                                   // check: đúng/sai
  z.array(z.string()).min(1),                    // seg/select: thuộc tập
  z.object({                                     // multi: các điều kiện con, kết hợp AND
    includes_any: z.array(z.string()).min(1).optional(),  // có ít nhất 1 trong danh sách
    includes_none: z.array(z.string()).min(1).optional(), // không có cái nào trong danh sách
    is_empty: z.boolean().optional(),                     // rỗng / không rỗng
  }).strict().refine((o) => Object.keys(o).length > 0, "điều kiện multi rỗng"),
]);
/** AND của các điều kiện theo trục. */
export const when = z.record(z.string(), condValue);

/* ---------- Một dòng trong bảng Rx (RxItem) ---------- */
export const rxItem = z.object({
  role: z.string().min(1),                      // cột 1 – vai trò/nhóm thuốc; "Ưu tiên" được tô nổi
  text: z.string().min(1),                      // cột 2 – thuốc hoặc nội dung khuyến cáo
  dose: z.union([z.string().min(1), z.literal(NEED)]).optional(), // cột liều; bỏ trống khi nguồn không có liều
  grade: grade.optional(),                      // cột chip; bỏ trống khi nguồn không xếp mức cho dòng này
  ref: z.string().min(1),                       // vị trí trong nguồn (không hiển thị), ví dụ "Table 2.1", "KC 9"
  al: z.enum(["std", "alt"]).optional(),        // lọc dị ứng beta-lactam (byAllergy) – không dùng ở 2 bệnh mẫu
  show_when: when.optional(),                   // dạng gọn: dòng chỉ hiện khi điều kiện đúng
  source_ids: sourceIds,
}).strict();

export const block = z.object({
  title: z.string().min(1),                     // tiêu đề h4
  lead: z.string().optional(),                  // đoạn dẫn dưới tiêu đề
  show_when: when.optional(),                   // dạng gọn: cả khối chỉ hiện khi điều kiện đúng
  items: z.array(rxItem),
}).strict();

export const note = z.object({ text: z.string().min(1), show_when: when.optional(), source_ids: sourceIds }).strict();

/* ---------- Trục lựa chọn ---------- */
const option = z.object({
  id,
  label: z.string().min(1),
  group: z.string().optional(),                 // multi: tên hàng chứa ô (vd. "Yếu tố nguy cơ chính")
  suffix: z.string().optional(),                // ký hiệu sau nhãn (vd. "*")
}).strict();

export const axis = z.object({
  id,
  label: z.string().min(1),                     // seg/select/multi: nhãn hàng (Row label); check: chữ cạnh ô
  group: z.string().optional(),                 // check: nhãn hàng chứa ô (vd. "Nguy cơ kháng thuốc")
  type: z.enum(["seg", "select", "check", "multi"]),
  options: z.array(option).optional(),          // bắt buộc với seg/select/multi
  default: z.union([z.string(), z.boolean(), z.array(z.string())]),
  visible_when: when.optional(),                // ẩn → trục nhận giá trị default khi xét luật; chỉ tham chiếu trục khai báo trước
  placement: z.enum(["form", "output"]).default("form"), // "output": nút chọn nằm trong vùng kết quả (section.controls)
  tip: z.string().optional(),                   // ghi chú nhỏ dưới ô chọn
}).strict().superRefine((a, ctx) => {
  if (a.type !== "check" && !a.options?.length) ctx.addIssue({ code: "custom", message: "seg/select/multi cần options", path: ["options"] });
  if (a.type === "check" && typeof a.default !== "boolean") ctx.addIssue({ code: "custom", message: "check cần default boolean", path: ["default"] });
  if (a.type === "multi" && !Array.isArray(a.default)) ctx.addIssue({ code: "custom", message: "multi cần default mảng", path: ["default"] });
  if ((a.type === "seg" || a.type === "select") && typeof a.default !== "string") ctx.addIssue({ code: "custom", message: "seg/select cần default chuỗi", path: ["default"] });
});

/* ---------- Luật: tổ hợp lựa chọn → khuyến cáo ----------
   - primary: với MỌI tổ hợp hợp lệ phải khớp ĐÚNG 1 luật primary (summary + blocks chính).
   - addon: 0..n luật bổ sung; block cùng title với block đã có thì nối thêm items, khác title thì thêm block mới.
   Thứ tự hiển thị: primary trước, addon theo thứ tự mảng. */
export const summaryRow = z.object({ label: z.string().min(1), text: z.string().min(1) }).strict();
export const rule = z.object({
  id,
  kind: z.enum(["primary", "addon"]),
  when,
  summary: z.array(summaryRow).optional(),       // khối Chẩn đoán / Phác đồ / Hướng dẫn (primary)
  blocks: z.array(block).default([]),
  avoid: z.array(rxItem).default([]),            // bảng "Không dùng"
  notes: z.array(note).default([]),              // danh sách "Lưu ý"
  antibiogram_reminder: z.string().min(1).optional(), // UI nhắc "Đối chiếu Antibiogram BV199: …" – chỉ nhắc, không tính toán
  source_ids: sourceIds,
}).strict().superRefine((r, ctx) => {
  if (r.kind === "primary" && !r.summary?.length) ctx.addIssue({ code: "custom", message: "luật primary cần summary", path: ["summary"] });
});

/** Khối cố định hiển thị theo điều kiện (vd. "Quy trình 4 bước", "Thời gian, chuyển đường uống"). */
export const section = z.object({
  id,
  position: z.enum(["before", "after"]),         // trước hay sau phần kết quả của luật
  title: z.string().min(1).optional(),           // bỏ trống: nối tiếp khối trước, không có h4
  lead: z.string().optional(),
  controls: z.array(id).optional(),              // id các trục placement "output" vẽ ngay dưới lead
  items: z.array(rxItem).default([]),
  bullets: z.array(note).default([]),            // danh sách gạch đầu dòng (ul)
  antibiogram_reminder: z.string().min(1).optional(),
  show_when: when.optional(),
}).strict();

/* ---------- Nguồn, lý do chọn nguồn, bất đồng, kiểm duyệt ---------- */
export const source = z.object({
  id,
  org: z.string().min(1),
  title: z.string().min(1),
  year: z.number().int().min(1900),
  version: z.string().min(1),                    // phiên bản/ngày công bố; NEED nếu không rõ
  url: z.string().url(),
  accessed: isoDate,
  population: z.array(population).min(1),
  evidence_system: z.string().min(1),            // mô tả hệ phân mức của CHÍNH guideline gốc
  grade_system: z.enum(GRADE_SYSTEMS),           // hệ mã grade được phép dùng cho nội dung trích từ nguồn này
}).strict();

export const selectionRationale = z.object({
  chosen: z.string().min(1),                     // vì sao chọn (tổ chức ban hành, quần thể, bản hiện hành…) – không bịa số liệu sử dụng
  current_version_check: z.string().min(1),      // đã kiểm tra bản mới nhất/thay thế/rút bằng cách nào
  excluded: z.array(z.object({ source: z.string().min(1), reason: z.string().min(1) }).strict()).default([]),
}).strict();

export const discordance = z.object({
  topic: z.string().min(1),
  primary_source_id: id,
  other_source_id: id,
  description: z.string().min(1),
}).strict();

export const review = z.object({
  state: z.enum(["draft_ai", "pharmacist_verified", "physician_verified"]),
  verified_by: z.string().nullable(),
  verified_date: isoDate.nullable(),
  next_review: isoDate.nullable(),
}).strict();

export const intlGuideline = z.object({
  schema_version: z.literal(1),
  slug: id,
  disease_id: z.string().regex(/^v\d+-\d+$/, "mã bệnh trong catalog, ví dụ v8-14"),
  name_vi: z.string().min(1),
  name_en: z.string().min(1),
  icd10: z.union([z.array(z.string().min(1)).min(1), z.literal(NEED)]), // lấy từ data/antibiotics/empiric/icd10.ts
  population: z.array(population).min(1),
  status: z.enum(["extracted", "identified", "no_specific_guideline"]),
  status_note: z.string().optional(),            // bắt buộc khi status khác "extracted"
  header: z.object({
    eyebrow: z.string().min(1),                  // dòng chữ nhỏ trên tiêu đề
    title: z.string().min(1),                    // h3
    flow: z.array(z.string().min(1)).min(1),     // các bước đánh số (sa24-flow)
  }).strict(),
  axes: z.array(axis).default([]),
  sections: z.array(section).default([]),
  rules: z.array(rule).default([]),
  source_text: z.string().min(1),                // dòng "Nguồn: …" cuối thẻ
  gaps: z.array(z.string()).default([]),
  discordance: z.array(discordance).default([]),
  selection_rationale: selectionRationale,
  sources: z.array(source).min(1),
  review,
}).strict().superRefine((g, ctx) => {
  if (g.status !== "extracted" && !g.status_note) ctx.addIssue({ code: "custom", message: "status khác extracted cần status_note", path: ["status_note"] });
  if (g.status === "extracted" && !g.rules.some((r) => r.kind === "primary")) ctx.addIssue({ code: "custom", message: "status extracted cần ít nhất 1 luật primary", path: ["rules"] });
});

export type IntlGuideline = z.infer<typeof intlGuideline>;
export type IntlGuidelineInput = z.input<typeof intlGuideline>;
export type IntlAxis = z.infer<typeof axis>;
export type IntlRule = z.infer<typeof rule>;
export type IntlWhen = z.infer<typeof when>;
export type IntlRxItem = z.infer<typeof rxItem>;
