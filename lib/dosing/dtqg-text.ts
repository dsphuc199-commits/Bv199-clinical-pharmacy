/*
  FILE: lib/dosing/dtqg-text.ts

  Sửa lỗi bố cục chỉ số dưới khi trích chữ PDF Dược thư: chỉ số "cr" (Clcr) và "ss" (Css) in nhỏ, lệch dòng, nên lớp chữ
  đặt chúng tách ra sau cụm từ ("Cl (ml/phút) cr", "Cl < 50 ml/phút. cr", "C mục tiêu = 2 mg/lít ss").
  Tiếng Việt không có từ "cr" hay "ss" đứng riêng → ghép chỉ số lẻ về ký hiệu đứng trước gần nhất ("Cl" → "Clcr",
  "C" → "Css"). Không thay đổi số liệu hay từ ngữ khác.
*/
const ORPHAN = /(^|[\s(|/])(cr|ss)(?=$|[\s.,;:)|/])/u;

export function fixSubscripts(text: string): string {
  let s = text;
  for (let guard = 0; guard < 20; guard++) {
    const m = ORPHAN.exec(s);
    if (!m) break;
    const at = m.index + m[1].length;
    const sub = m[2];
    const base = sub === "cr" ? /\bCl(?!cr)\b/gu : /\bC(?!ss)\b/gu;
    let hit = -1;
    for (const b of s.slice(0, at).matchAll(base)) hit = b.index ?? -1;
    if (hit < 0) break; // không có ký hiệu gốc phía trước: giữ nguyên
    const head = sub === "cr" ? "Cl" : "C";
    /* Bỏ chỉ số lẻ (kèm một dấu cách trước nó), gắn vào ký hiệu gốc. */
    const spaceBefore = s[at - 1] === " ";
    const cutStart = spaceBefore ? at - 1 : at;
    const cutEnd = !spaceBefore && s[at + sub.length] === " " ? at + sub.length + 1 : at + sub.length;
    s = s.slice(0, cutStart) + s.slice(cutEnd);
    s = s.slice(0, hit) + head + sub + s.slice(hit + head.length);
  }
  return s.replace(/\(\s*(Clcr|Css)\s*\)/gu, "($1)");
}
