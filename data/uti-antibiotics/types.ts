/* Kiểu dữ liệu và schema module Kháng sinh điều trị nhiễm khuẩn tiết niệu. Trường không có trong nguồn = null. */
import { z } from "zod";

const text = z.string().trim().min(1);
const nullableText = text.nullable();

export const ConditionSchema = z.strictObject({
  id: text,
  name: text,
  nameEn: nullableText,
  group: text,
  form: text,
  classification: z.enum(["Không biến chứng", "Có biến chứng"]).nullable(),
  severity: nullableText,
  population: text,
  choiceRule: nullableText,
  notes: z.array(text),
  noSpecificRegimen: z.boolean(),
});

export const RegimenSchema = z.strictObject({
  id: text,
  conditionId: text,
  tier: z.enum(["first-line", "alternative", "culture-guided", "adjunct"]).nullable(),
  antibiotic: text,
  dose: nullableText,
  route: nullableText,
  interval: nullableText,
  duration: nullableText,
  applicability: nullableText,
  note: nullableText,
  sourceText: text,
});

export type Condition = z.infer<typeof ConditionSchema>;
export type Regimen = z.infer<typeof RegimenSchema>;
/* sourceText chỉ dùng đối chiếu nội bộ, không gửi xuống trình duyệt. */
export type PublicRegimen = Omit<Regimen, "sourceText">;
