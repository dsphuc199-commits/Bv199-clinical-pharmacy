/*
  Chuyen van ban HDSD (trich tu PDF/OCR hoac trang web) thanh cac khoi de doc tren man hinh:
  doan ngan, danh sach gach dau dong, tieu de phu, nhan dau dong in dam.
  Chi trinh bay lai, KHONG thay doi noi dung.
*/

export type LeafletBlock =
  | { t: "p"; text: string; label?: string }
  | { t: "li"; text: string; label?: string }
  | { t: "h"; text: string };

const FREQ = "(?:Rất thường gặp|Thường gặp|Ít gặp|Hiếm gặp|Rất hiếm gặp|Rất hiếm|Chưa rõ tần suất|Không rõ tần suất|Không rõ tần số|Không xác định được tần suất)";
const MAX_PARAGRAPH = 320;

/* Dong quang cao/dieu huong cua trang web (khong phai noi dung HDSD). */
const PROMO_LINE = /(xem thêm|bạn đọc có thể|tham khảo thêm|mua (thuốc|hàng|ở đâu)|giá bao nhiêu|trung tâm thuốc|central pharmacy|nhà thuốc|liên hệ|hotline|tư vấn miễn phí|đặt hàng|zalo)/i;

/* Dau duyet in chim tren HDSD scan bi OCR doc thanh chu: "Approved 16-Nov-2020 02.54 UTC", "Aerreved 18.", "Nov 2020 02.54 UTC". */
const STAMP_LINE = /^(?=.{0,60}$)(?:.*\b\d{1,2}[.:]\d{2}\s*UTC\b.*|a[a-z]{3,8}d\s*\d{1,2}[.\-\s]*[a-z]{0,4}[.\-\s]*(?:20\d\d)?\.?|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[.\-\s]*20\d\d.*)$/i;

function normalize(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    // "==>> Xem them ..." den het dong; so trich dan "[1]", "[2,3]".
    .replace(/\s*=+\s*>+.*$/gm, "")
    .replace(/\s*\[\d+(?:\s*[,–-]\s*\d+)*\]/g, "")
    // Cau hoi kieu bai viet: "3B MEDI là thuốc gì?"
    .replace(/^[^.\n?]{0,90}\blà (thuốc )?gì\s*\?\s*/gim, "")
    .split("\n")
    .filter((l) => !PROMO_LINE.test(l) && !STAMP_LINE.test(l.trim()))
    .join("\n")
    // Gach dau dong viet lien trong cau: "...thuốc. - U ác tính. - Phụ nữ..." -> moi y 1 dong.
    .replace(/([.;:!?])\s+[-–•]\s+(?=\p{L})/gu, "$1\n- ")
    .replace(/\s+[•●▪]\s*(?=\p{L})/gu, "\n- ")
    // Cau bi dinh lien: "...thần kinh.Vitamin B6" -> xuong dong.
    .replace(/([\p{Ll}\d%)\]])\.(?=\p{Lu}\p{Ll})/gu, "$1.\n")
    // Nhan tan suat dinh vao chu truoc: "chóng mặtÍt gặp:" -> xuong dong truoc nhan.
    .replace(new RegExp(`([^\\n])\\s*(?=${FREQ}\\s*[:(,–-])`, "gu"), "$1\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/* Tach doan dai thanh nhieu doan ngan theo cau (~2-3 cau/doan). */
function splitLong(text: string): string[] {
  if (text.length <= MAX_PARAGRAPH) return [text];
  const sentences = text.split(/(?<=[.;!?])\s+(?=[\p{Lu}\d(])/u);
  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if (cur && cur.length + s.length > MAX_PARAGRAPH * 0.75) {
      out.push(cur);
      cur = s;
    } else cur = cur ? `${cur} ${s}` : s;
  }
  if (cur) out.push(cur);
  return out;
}

/* "Người lớn: 1 viên..." -> nhan "Người lớn" + noi dung. Nhan ngan, khong chua dau cham. */
function splitLabel(line: string): { label?: string; text: string } {
  // Can khoang trang sau ":" de khong nham ti le (vd. "1:10").
  const m = line.match(/^([^:.;]{2,45}):\s+(.+)$/u);
  if (!m || m[1].split(" ").length > 7) return { text: line };
  return { label: m[1].trim(), text: m[2].trim() };
}

export function formatLeaflet(raw: string | undefined): LeafletBlock[] {
  if (!raw) return [];
  const blocks: LeafletBlock[] = [];
  for (const line0 of normalize(raw).split("\n")) {
    const line = line0.trim();
    if (!line) continue;
    const bullet = line.match(/^(?:[-–•*+●▪◦]|\d{1,2}[.)])\s*(.+)$/u);
    if (bullet && bullet[1].length > 1) {
      const { label, text } = splitLabel(bullet[1]);
      blocks.push({ t: "li", text, label });
      continue;
    }
    // Dong ngan ket thuc bang ":" -> tieu de phu.
    if (line.length <= 70 && /:$/.test(line)) {
      blocks.push({ t: "h", text: line.replace(/:$/, "") });
      continue;
    }
    const { label, text } = splitLabel(line);
    splitLong(text).forEach((part, i) => blocks.push({ t: "p", text: part, label: i === 0 ? label : undefined }));
  }
  return blocks;
}
