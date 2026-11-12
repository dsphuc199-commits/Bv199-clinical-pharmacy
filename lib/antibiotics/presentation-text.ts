import { stripInlineCitations } from "./empiric-ui-rules";

/** Display formatting only. Keep source data, units and organism names intact. */
export function capitalizeBullet(text: string): string {
  return text.trim().replace(/^([\p{Ps}"'“‘]*)(\p{Ll})/u, (_, prefix: string, letter: string) => prefix + letter.toLocaleUpperCase("vi"));
}

export function bulletPoints(text: string): string[] {
  return text.split(/(?<=;)\s+|(?<=[.!?])\s+(?=[A-ZÀ-Ỹ])/u).filter(s => s.trim()).map(capitalizeBullet);
}

/** Remove numbered citation tokens only; keep clinical clauses, units and values.
 * Callers retain the unformatted text in their source disclosure. */
/* Cum ghi chu quy trinh (tham dinh/xac minh/nguon) khong phai van phong dieu tri -> bo khi hien thi.
   Du lieu goc giu nguyen; chi loai khoi giao dien. */
const REVIEW_PHRASES: RegExp[] = [
  /\(\s*(?:CẦN THẨM ĐỊNH|Cần thẩm định)[^)]*\)/giu,
  /[–—-]?\s*(?:CẦN THẨM ĐỊNH|Cần thẩm định)(?:\s*(?:trước khi áp dụng|lại|thêm))?[^.;\n]*[.;]?/giu,
  /[·•]?\s*Chưa xác minh(?: đầy đủ)?[^.;·\n]*[.;]?/giu,
  /\(\s*chưa xác minh[^)]*\)/giu,
  /,?\s*(?:trình bày )?(?:nguyên văn )?theo nguồn\b/giu,
  /\(?\s*(?:Văn bản|Nguồn) (?:không|chưa) nêu[^.;)\n]*[.;)]?/giu,
  /\s*\([^()]*chưa trích[^()]*\)/giu,
  /[^.;:]*chưa trích[^.;]*[.;]?/giu,
];
export function stripReviewNotes(text: string): string {
  let t = text;
  for (const re of REVIEW_PHRASES) t = t.replace(re, " ");
  return t.replace(/\s*·\s*(?=·|$)/g, "").replace(/^\s*[·,;]\s*/, "").replace(/[ \t]{2,}/g, " ").replace(/\s+([,;.])/g, "$1").trim();
}

export function clinicalText(text:string):string {
  return stripInlineCitations(stripReviewNotes(text)).replace(/(?:theo\s+)?(?:Phụ lục|Mục|Bảng|Biểu đồ)\s+\d+(?:\.\d+)*(?:[a-z])?(?:,\s*tr\.\s*[\d–-]+)?/giu,'')
    .replace(/,\s*một lựa chọn của\s*(?=[.;]|$)/giu,'').replace(/\(\s*[;,:]\s*/g,'(').replace(/\s*[;,:]\s*\)/g,')').replace(/\(\s*\)/g,'').replace(/;\s*:/g,';').replace(/[ \t]{2,}/g,' ').replace(/\s+([,;.])/g,'$1').trim();
}
