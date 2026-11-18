/*
  Tach chuoi lieu cua huong dan quoc te thanh cac cot: lieu, duong dung, so lan dung, thoi gian.
  Chi tach khi TOAN BO chuoi khop cau truc; khong suy luan, khong doi so, khong them chu.
  Chuoi khong khop tra ve null: giao dien giu nguyen cau lieu goc trong mot o.
*/
export type DoseParts = { dose: string; route?: string; freq?: string; duration?: string };

const RANGE = String.raw`\d[\d.,]*(?:\/\d[\d.,]*)?(?:\s*[–-]\s*\d[\d.,]*)?`;
const UNIT = String.raw`(?:triệu\s+)?(?:mg|g|mcg|µg|μg|microgam|UI|IU|U|đơn vị|MU|mL|ml|mmol)(?:\/(?:kg|m2|m²|liều|lần|ngày|giờ))*`;
const SINGLE = String.raw`${RANGE}\s?${UNIT}`;
/* "500 mg/125 mg" (thuoc phoi hop) va "50 mg hoac 100 mg" giu nguyen trong o lieu. */
const AMOUNT = String.raw`${SINGLE}(?:(?:\/|\shoặc\s)${SINGLE})*`;
const DOSE = String.raw`${AMOUNT}(?:\s\([^()]*\))?`;
const MAX = String.raw`tối đa\s${AMOUNT}`;

const ROUTE_WORD = String.raw`truyền tĩnh mạch|tiêm tĩnh mạch|truyền TM|tiêm TM|tiêm bắp|tĩnh mạch|đặt âm đạo|âm đạo|khí dung|uống|bôi|TM|TB|IV|IM|PO`;
const ROUTE = String.raw`(?:${ROUTE_WORD})(?:(?:\shoặc\s|\/)(?:${ROUTE_WORD}))*`;
const INFUSION = String.raw`truyền(?:\s(?:kéo dài|liên tục|ngắt quãng))?(?:\strong)?\s\d+(?:\s*[–-]\s*\d+)?\s(?:giờ|phút)`;

const COUNT = String.raw`\d+(?:\s*[–-]\s*\d+)?`;
const FREQ = String.raw`(?:chia\s)?mỗi\s${COUNT}\sgiờ|mỗi ngày|mỗi tuần|hằng ngày|hàng ngày|[×x]\s?${COUNT}\slần\/(?:ngày|tuần)|${COUNT}\slần\/(?:ngày|tuần)|chia\s${COUNT}\slần(?:\/ngày)?|(?:một|1)\sliều(?:\sduy nhất)?|liều duy nhất|(?:một|1)\slần(?:\sduy nhất)?`;
const DURATION = String.raw`(?:(?:[×x]|trong)\s?)?${COUNT}\s(?:ngày|tuần|tháng)`;

const SEP = String.raw`(?:[,;]?\s+)`;
const PATTERN = new RegExp(
  String.raw`^(?:(?<lead>${ROUTE})\s+)?(?<dose>${DOSE})` +
    String.raw`(?:${SEP}(?<max1>${MAX}))?` +
    String.raw`(?:${SEP}(?<route>${ROUTE}))?` +
    String.raw`(?:${SEP}(?<freq>${FREQ}))?` +
    String.raw`(?:${SEP}(?<infusion>${INFUSION}))?` +
    String.raw`(?:${SEP}(?<max2>${MAX}))?` +
    String.raw`(?:${SEP}(?<duration>${DURATION}))?` +
    String.raw`\.?$`,
  "iu",
);

const clean = (s: string) => s.replace(/^[×x]\s?/iu, "");

export function parseDose(text: string): DoseParts | null {
  const groups = text.trim().match(PATTERN)?.groups;
  if (!groups) return null;
  const { lead, dose, max1, max2, route, infusion, freq, duration } = groups;
  if (lead && route) return null;
  const max = max1 ?? max2;
  const routeText = [lead ?? route, infusion].filter(Boolean).join(", ");
  return {
    dose: max ? `${dose}, ${max}` : dose,
    route: routeText || undefined,
    freq: freq ? clean(freq) : undefined,
    duration: duration ? clean(duration) : undefined,
  };
}
