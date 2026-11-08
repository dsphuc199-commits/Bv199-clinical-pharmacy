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
export function clinicalText(text:string):string {
  return stripInlineCitations(text).replace(/(?:theo\s+)?(?:Phụ lục|Mục|Bảng|Biểu đồ)\s+\d+(?:\.\d+)*(?:[a-z])?(?:,\s*tr\.\s*[\d–-]+)?/giu,'')
    .replace(/,\s*một lựa chọn của\s*(?=[.;]|$)/giu,'').replace(/\(\s*[;,:]\s*/g,'(').replace(/\s*[;,:]\s*\)/g,')').replace(/\(\s*\)/g,'').replace(/;\s*:/g,';').replace(/[ \t]{2,}/g,' ').replace(/\s+([,;.])/g,'$1').trim();
}
