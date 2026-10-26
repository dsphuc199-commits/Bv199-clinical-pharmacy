/*
  FILE: lib/antibiotics/regimen-structure.ts

  MASTER TASK 6 – DU LIEU PHAC DO CO CAU TRUC (khong sua nguyen van BYT).

  Chuyen moi phuong an (nguyen van nguon: danh sach {ten, lieu}) thanh:
    - groups[]: cac NHOM THUOC noi voi nhau bang VA (AND);
      moi nhom: rule "all" (1 thuoc bat buoc) hoac "one-of" (chon 1 trong N);
      optional = chi them khi co chi dinh (vd. "Ho tro:", "neu", "can nhac").
    - moi thuoc la mot doi tuong rieng: lieu, don vi, co so lieu, duong dung,
      khoang cach, thoi gian truyen, lieu toi da, doi tuong (nguoi lon/tre em).

  Nguyen tac an toan (co unit test tests/empiric/mt6-structure-test.cjs):
    - KHONG tao so lieu: moi gia tri tach ra deu la chuoi con cua nguyen van.
    - Luon giu nguyen van (raw) cua tung thuoc va tung muc nguon.
    - Khong chac cau truc AND/OR (vd. "A + B" mot lieu chung, lua chon long trong ngoac,
      nhieu thuoc trong mot lua chon) -> NEEDS_STRUCTURED_REVIEW: giao dien hien NGUYEN VAN,
      khong ve bang lieu.
    - Thieu truong (vd. chi co lieu/ngay, khong neu so lan) -> o trong de trong ("—"),
      khong tu suy ra.
*/

import { ALL_REGIMENS, type Regimen, type RegimenRole } from "@/data/antibiotics/empiric/regimens";
import { renalDosingDatabase } from "@/data/renal-dosing";

import { findDrugs } from "./drug-links";
import { mdrOf, severityOf } from "./clinical-filters";

/* ======================= Kieu du lieu ======================= */

export type DoseBasis = "per-dose" | "per-day" | "per-kg-dose" | "per-kg-day" | "unknown";
export type DrugPopulation = "adult" | "child" | "neonate" | "any";

export type StructuredDrug = {
  name: string;
  ingredientIds: string[];
  population: DrugPopulation;
  populationLabel?: string;
  dose?: string;
  doseUnit?: string;
  doseBasis: DoseBasis;
  route?: string;
  interval?: string;
  infusionDuration?: string;
  dailyDose?: string;
  maxDose?: string;
  course?: string;
  /* Boi canh ap dung ghi kem ten thuoc (vd. "nhiem khuan nang"). */
  context?: string;
  /* Nguyen van doan nguon cua thuoc nay. */
  raw: string;
  /* Du lieu, duong dung, khoang cach (hoac lieu/ngay kem so lan chia). */
  complete: boolean;
  flags: string[];
};

/*
  "all": moi thuoc trong nhom deu dung (1 thuoc, hoac phoi hop co dinh nhu lao HRZE).
  "one-of": chon 1 thuoc trong nhom.
  "by-population": cung 1 thuoc, lieu khac nhau theo doi tuong (nguoi lon / tre em).
*/
export type GroupRule = "all" | "one-of" | "by-population";

export type DrugGroup = {
  rule: GroupRule;
  optional: boolean;
  label?: string;
  /* Dieu kien ap dung cua nhom (nguyen van, vd. "Khi nghi tu cau khang thuoc"). */
  condition?: string;
  /* Giai doan dieu tri noi tiep (vd. lao: tan cong -> duy tri) – KHONG phai phoi hop dong thoi voi nhom truoc. */
  phase?: boolean;
  options: StructuredDrug[];
  /* Nguyen van cac muc nguon tao nen nhom (gom ca muc "hoac ..." da gop). */
  raw: { name: string; dose: string }[];
  ambiguous: boolean;
};

export type StructureStatus = "STRUCTURED" | "PARTIAL" | "NEEDS_STRUCTURED_REVIEW" | "NO_DOSE";

export type RegimenType = "empiric" | "pathogen-directed" | "allergy-alternative" | "adjunct";
export type Priority = "preferred" | "alternative" | "special";

export type StructuredRegimen = {
  regimenId: string;
  diseaseIds: string[];
  clinicalScenario: string;
  population: "adult" | "child" | "obstetric" | "unspecified";
  severity: "mild" | "severe" | "unspecified";
  riskFactors: "mdr-high" | "mdr-low" | "unspecified";
  suspectedPathogens?: string;
  regimenType: RegimenType;
  priority: Priority;
  groups: DrugGroup[];
  treatmentDuration?: string;
  renalAdjustment: "check-dosing-module" | "no-data";
  sourceId: string;
  sourceSection: string;
  sourcePage: string;
  status: StructureStatus;
  reviewReasons: string[];
};

/* ======================= Tach truong ======================= */

const NUM = String.raw`\d{1,3}(?:[ .]\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?`;
const RANGE = String.raw`(?:${NUM})(?:\s*\/\s*(?:${NUM}))?(?:\s*[–-]\s*(?:${NUM}))?`;
const UNIT = String.raw`triệu đơn vị|triệu UI|MIU|MUI|UI|IU|đơn vị|mcg|µg|mg|g`;
const DOSE_RE = new RegExp(
  String.raw`(${RANGE})\s*(${UNIT})(?![a-zA-Zà-ỹ])(\s*\/\s*kg)?(\s*\/\s*(?:ngày|24\s?giờ|lần))?`,
  "i"
);

const INTERVAL_RES: RegExp[] = [
  /(?:mỗi|cứ)\s*\d+(?:\s*[–-]\s*\d+)?\s*giờ(?:\s*\/\s*lần)?/i,
  /x\s*\d+(?:\s*[–-]\s*\d+)?\s*lần\s*\/\s*ngày/i,
  /\d+(?:\s*[–-]\s*\d+)?\s*lần\s*\/\s*(?:ngày|tuần)/i,
  /(?:một|hai|ba|bốn)\s*lần\s*\/\s*ngày/i,
  /chia\s*(?:\d+(?:\s*[–-]\s*\d+)?|hai|ba|bốn)\s*lần(?:\s*\/\s*ngày)?/i,
  /\d+\s*lần\s*mỗi\s*(?:ngày|tuần)/i,
  /liều duy nhất|liều đơn|mỗi ngày|hàng ngày|hằng ngày|trước (?:khi|lúc) ngủ/i,
  /* "(12–24 giờ)" sau lieu: khoang cach giua cac lieu */
  /(?<=\()\s*\d+(?:\s*[–-]\s*\d+)?\s*giờ(?=\s*\))/i,
];

const ROUTES: [RegExp, string][] = [
  [/truyền TM|tiêm TM|TM chậm|\bTM\b|tĩnh mạch|\bTTM\b|\bIV\b/i, "Tĩnh mạch"],
  [/tiêm bắp|\bTB\b|\bIM\b/i, "Tiêm bắp"],
  [/uống|\bPO\b/i, "Uống"],
  [/nhỏ mắt|tra mắt|tại mắt/i, "Tra mắt"],
  [/đặt âm đạo|bôi âm đạo/i, "Âm đạo"],
  [/khí dung/i, "Khí dung"],
  [/nội tủy|bơm kênh tủy/i, "Nội tủy"],
];

function pick(re: RegExp, text: string): string | undefined {
  const m = text.match(re);
  return m ? m[0].trim() : undefined;
}

/* Tach top-level theo dau ";" (khong tach trong ngoac). */
export function splitTopLevel(text: string, sep = ";"): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of text) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    if (ch === sep && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

const POP_PREFIX = /^(người lớn và trẻ\s*>\s*\d+\s*tuổi|người lớn|trẻ em\s*[<>≥≤]\s*\d+\s*(?:kg|tuổi)|trẻ\s*[<>≥≤]\s*\d+\s*(?:kg|tuổi)|trẻ em và trẻ sơ sinh|trẻ sơ sinh|sơ sinh|trẻ em|trẻ nhỏ)\s*:?\s*/i;

function populationOfLabel(label: string): DrugPopulation {
  const t = label.toLocaleLowerCase("vi");
  if (t.startsWith("người lớn")) return "adult";
  if (/sơ sinh/.test(t) && !/trẻ em/.test(t)) return "neonate";
  return "child";
}

function cap(s: string): string {
  return s.charAt(0).toLocaleUpperCase("vi") + s.slice(1);
}

/* Tach mot doan lieu cua MOT thuoc thanh cac truong. name: ten hien thi. */
export function parseDrugSegment(name: string, text: string, population: DrugPopulation = "any", populationLabel?: string): StructuredDrug {
  const flags: string[] = [];
  const doseM = text.match(DOSE_RE);
  let dose: string | undefined;
  let doseUnit: string | undefined;
  let doseBasis: DoseBasis = "unknown";
  if (doseM) {
    dose = doseM[1].trim();
    const perKg = !!doseM[3];
    const per = (doseM[4] ?? "").replace(/\s/g, "");
    doseUnit = `${doseM[2]}${perKg ? "/kg" : ""}${per === "/lần" ? "/lần" : per ? "/ngày" : ""}`;
    if (perKg && per && per !== "/lần") doseBasis = "per-kg-day";
    else if (perKg) doseBasis = "per-kg-dose";
    else if (per && per !== "/lần") doseBasis = "per-day";
    else doseBasis = "per-dose";
    /* Lieu phoi hop ghi "800 mg/160 mg": giu nguyen ca hai thanh phan (khong rut gon). */
    const combo = text.match(/(\d+(?:[.,]\d+)?\s*(?:mg|g)\s*\/\s*\d+(?:[.,]\d+)?\s*(?:mg|g))(?![a-zA-Zà-ỹ\/])/i);
    if (combo && combo.index === doseM.index) {
      dose = combo[1].trim();
      doseUnit = undefined;
    }
  }
  /* Khoang cach: lay cum xuat hien SOM NHAT trong nguyen van (khong theo thu tu mau). */
  const intervalHits = INTERVAL_RES.map((re) => text.match(re)).filter((m): m is RegExpMatchArray => !!m);
  intervalHits.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const interval = intervalHits[0]?.[0].trim().replace(/^x\s*/i, "");
  const routes = Array.from(new Set(ROUTES.filter(([re]) => re.test(text)).map(([, label]) => label)));
  /* "x vien" (dang vien) khong kem duong dung khac -> uong (tru vien dat). */
  if (routes.length === 0 && /\bviên\b/i.test(text) && !/đặt/i.test(text)) routes.push("Uống");
  const route = routes.length ? routes.join(" / ") : undefined;
  const infusionDuration = pick(/truyền(?:\s*TM)?\s*(?:trong\s*)?(?:ít nhất\s*)?\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+)?\s*(?:giờ|phút)|truyền kéo dài|truyền liên tục/i, text);
  const maxDose = pick(/(?:tối đa|không quá|không dùng quá)\s*[^;,)]+/i, text);
  const dailyRaw = text.match(/\(\s*(\d[^()]*?\/\s*ngày)\s*\)/i);
  const dailyDose = doseBasis === "per-dose" && dailyRaw ? dailyRaw[1].trim() : undefined;
  const course = pick(/(?:x|×|trong)\s*\d+(?:\s*[–-]\s*\d+)?\s*(?:ngày|tuần)(?:\s*tiếp)?/i, text);

  if (!dose) flags.push("Nguồn không nêu liều số cho thuốc này");
  if (/như trên|liều như|như các mục/i.test(text)) flags.push("Liều tham chiếu mục khác của nguồn");
  if (/sau đó|ngày đầu|liều nạp|liều tải/i.test(text)) flags.push("Liều thay đổi theo giai đoạn – xem nguyên văn");
  if (dose && (doseBasis === "per-day" || doseBasis === "per-kg-day") && !interval) flags.push("Nguồn không nêu số lần chia trong ngày");
  if (dose && !route) flags.push("Nguồn không nêu đường dùng ở dòng này");
  if (/viên/i.test(text) && routes.includes("Tĩnh mạch")) flags.push("KIỂM TRA CHẾ PHẨM: 'viên' đi kèm đường tĩnh mạch");
  if (/\b(?:875|500)\s*\/\s*125\b/.test(text) && routes.includes("Tĩnh mạch") && /clavul/i.test(`${name} ${text}`)) {
    flags.push("KIỂM TRA CHẾ PHẨM: hàm lượng amoxicilin-clavulanat dạng uống đi kèm đường tĩnh mạch");
  }

  const out: StructuredDrug = {
    name: cap(name.trim()),
    ingredientIds: findDrugs([name]).map((d) => d.ingredientId),
    population,
    populationLabel,
    dose,
    doseUnit,
    doseBasis,
    route,
    interval,
    infusionDuration,
    dailyDose,
    maxDose,
    course,
    raw: text.trim(),
    complete: false,
    flags,
  };
  out.complete = isComplete(out);
  return out;
}

/* Du truong de ve thanh mot hang lieu: lieu + don vi + duong dung + khoang cach (hoac lieu duy nhat),
   va khong co co can xem nguyen van. */
function isComplete(o: StructuredDrug): boolean {
  return (
    !!o.dose &&
    (!!o.doseUnit || /\b(?:mg|g)\b/.test(o.dose ?? "")) &&
    !!o.route &&
    (!!o.interval || /liều duy nhất|liều đơn/i.test(o.raw)) &&
    !o.flags.some((f) => /tham chiếu|giai đoạn|KIỂM TRA|không ghi ở dòng/.test(f))
  );
}

/* Duong dung ghi o ten muc nguon -> ap cho thuoc chua co duong dung. */
function applyRoute(o: StructuredDrug, route: string) {
  if (o.route) return;
  o.route = route;
  o.flags = o.flags.filter((f) => !/đường dùng/.test(f));
  o.complete = isComplete(o);
}

/* Nhom thuoc (khong co trong tu dien hoat chat) van la ten lua chon hop le. */
const CLASS_NAME = /^(?:cephalosporin|carbapenem|aminoglycosid|fluoroquinolon|quinolon|macrolid|beta-?lactam|β-lactam|penicilin|glycopeptid|tetracyclin|sulfamid|nitroimidazol)/i;
/* Tu mo dau KHONG phai ten thuoc (doi tuong, dieu kien, ghi chu). */
const NOT_DRUG = /^(?:người|trẻ|trường hợp|nặng|liều|sau|khi|nếu|tối đa|thay thế|hoặc|ngày|tuần|giai đoạn|đường|dùng|có thể|theo|tùy|TB|TM|TTM|IV|IM|PO|uống|tiêm|truyền|tĩnh mạch|nhỏ|tra|bôi|đặt|pha)\b/i;

/* Ten thuoc o dau doan: phan truoc chu so dau tien / dau ":" / tu khoa duong dung. */
type Lead = { name: string; rest: string; context?: string };

function leadingName(segment: string): Lead | null {
  /* "cephalosporin the he 3 hoac 4": so the he thuoc ve ten nhom, khong phai lieu. */
  const gen = segment.match(/^((?:cephalosporin|cephalosporine)\s+thế hệ\s+\d(?:\s*(?:hoặc|,|và)\s*\d)*)\s*/i);
  if (gen) return { name: gen[1], rest: segment.slice(gen[0].length) };
  /* "cefotaxim – nhiem khuan nang: 2–3 g ..." -> ten + boi canh. */
  const ctx = segment.match(/^([A-Za-zÀ-ỹđĐ][A-Za-zÀ-ỹđĐ\s\-()]*?)\s+–\s+([^:;]+?):\s*/);
  if (ctx && !NOT_DRUG.test(ctx[1]) && (findDrugs([ctx[1]]).length > 0 || CLASS_NAME.test(ctx[1]))) {
    return { name: ctx[1].trim(), rest: segment.slice(ctx[0].length), context: ctx[2].trim() };
  }
  const m = segment.match(/^([A-Za-zÀ-ỹđĐ][A-Za-zÀ-ỹđĐ\s\-/().,]*?)(?=\s*(?::|\d|\buống\b|\btiêm\b|\btruyền\b|\bTM\b|\bnhỏ\b|\bđường\b|$))/);
  if (!m) return null;
  const name = m[1].replace(/[\s,(]+$/, "").trim();
  if (!name || NOT_DRUG.test(name)) return null;
  const known = findDrugs([name]).length > 0 || CLASS_NAME.test(name);
  // Ten la 1–3 tu, khong phai cum mo ta -> chap nhan nhu ten hoat chat chua co trong tu dien.
  const looksLikeDrug = /^[a-zà-ỹđ][a-zà-ỹđ-]+(?:\s+[a-zà-ỹđ0-9-]+){0,2}$/i.test(name);
  if (!known && !looksLikeDrug) return null;
  return { name, rest: segment.slice(m[0].length).replace(/^\s*:\s*/, "") };
}

/* ======================= Nhom thuoc ======================= */

const ONE_OF_NAME = /một trong|chọn một|\bhoặc\b/i;
/* Hoat chat chi dung phoi hop (khong don tri) trong dieu tri nhiem khuan. */
const NEVER_MONO = /^(?:rifampicin|rifampin|acid fusidic|axit fusidic)$/i;
const OPTIONAL_NAME = /^hỗ trợ|^(?:có thể )?(?:thêm|cân nhắc)|\bnếu\b|\bkhi nghi\b|khi có chỉ định/i;

/* Tach doan lieu: theo ";" roi theo " hoac " khi ve phai bat dau bang ten thuoc;
   doan khong bat dau bang ten thuoc (vd. "nhiem khuan de doa tinh mang: 2 g ...") noi vao doan truoc. */
function splitOptions(dose: string): { seg: string; lead: Lead | null }[] {
  const pieces: string[] = [];
  for (const part of splitTopLevel(dose)) {
    const sub = part.replace(/^hoặc\s+/i, "").split(/\s+hoặc\s+/i);
    let cur = sub[0];
    for (const next of sub.slice(1)) {
      if (leadingName(next)) {
        pieces.push(cur);
        cur = next;
      } else cur += ` hoặc ${next}`;
    }
    pieces.push(cur);
  }
  const out: { seg: string; lead: Lead | null }[] = [];
  for (const seg of pieces) {
    const lead = leadingName(seg);
    if (!lead && out.length > 0 && findDrugs([seg]).length === 0) {
      out[out.length - 1].seg += `; ${seg}`;
      continue;
    }
    out.push({ seg, lead });
  }
  return out.map((x) => ({ seg: x.seg, lead: leadingName(x.seg) }));
}

/* Lao: "Tan cong 2 thang: H + R + Z + E" + "hang ngay; H 5 mg/kg (toi da 300 mg), R 10 mg/kg, ..." */
const TB_CODES: Record<string, string> = { H: "Isoniazid", R: "Rifampicin", Z: "Pyrazinamid", E: "Ethambutol", S: "Streptomycin", P: "Rifapentin", M: "Moxifloxacin" };

function tbGroup(item: { name: string; dose: string }): DrugGroup | null {
  const m = item.name.match(/^(Tấn công|Duy trì)([^:]*):\s*(.+)$/i);
  if (!m) return null;
  const codes = Array.from(m[3].matchAll(/\(([HRZESPM])\)|(?:^|\+\s*)([HRZESPM])(?=\s*(?:\+|$|\())/g)).map((x) => x[1] ?? x[2]);
  if (codes.length < 2) return null;
  const options: StructuredDrug[] = codes.map((code) => {
    const doseM = item.dose.match(new RegExp(String.raw`(?:^|[;,]\s*)${code}\s+([^,;]*?\d[^,;]*?(?:\([^)]*\))?)(?=,|;|$)`));
    const text = doseM ? `${doseM[1]} ${/hàng ngày/i.test(item.dose) ? "hàng ngày" : ""}`.trim() : item.dose;
    const opt = parseDrugSegment(`${TB_CODES[code]} (${code})`, text);
    if (!doseM) opt.flags.push("Liều riêng của thuốc không ghi ở dòng này – xem nguyên văn");
    return opt;
  });
  return { rule: "all", optional: false, phase: true, label: `${cap(m[1])}${m[2]}`.trim(), options, raw: [item], ambiguous: false };
}

function buildGroup(item: { name: string; dose: string }, positional = false): DrugGroup {
  const tb = tbGroup(item);
  if (tb) return tb;
  const rawName = item.name.trim();
  let name = rawName.replace(/^(?:hoặc|kết hợp|phối hợp(?: với)?|hỗ trợ:?)\s*/i, "").trim();
  /* Dieu kien nam trong ten (vd. "Ket hop amikacin khi nghi tu cau khang thuoc"). */
  const condM = name.match(/\s+((?:khi|nếu)\s+.+)$/i);
  const condition = condM ? cap(condM[1]) : undefined;
  if (condM) name = name.slice(0, condM.index).trim();
  const optional = OPTIONAL_NAME.test(rawName) || !!condition;
  const label = /^hỗ trợ/i.test(rawName) ? "Hỗ trợ" : /^(kết hợp|phối hợp)/i.test(rawName) ? "Phối hợp" : undefined;
  const dose = item.dose.trim();
  let ambiguous = false;
  const options: StructuredDrug[] = [];
  const done = (rule: GroupRule): DrugGroup => {
    if (nameRoute) for (const o of options) applyRoute(o, nameRoute);
    return { rule, optional, label, condition, options, raw: [item], ambiguous };
  };

  // Ten co "+"/"±" (nhieu thuoc) nhung chi mot dong lieu -> khong ro cau truc.
  if (/\s[+±]\s/.test(name)) ambiguous = true;
  // Lua chon THUOC long trong ngoac o ten (vd. "Penicilin G (hoac amoxicilin-clavulanat ...)");
  // ngoac chi ghi duong dung (vd. "(uong hoac truyen)") khong tinh.
  const paren = name.match(/\(([^)]*\bhoặc\b[^)]*)\)/i);
  if (paren && findDrugs([paren[1]]).length > 0) ambiguous = true;
  /* Duong dung ghi o ten muc (vd. "Quinolon (uong hoac truyen)") ap cho cac thuoc trong muc. */
  const nameRoutes = Array.from(new Set(ROUTES.filter(([re]) => re.test(rawName)).map(([, l]) => l)));
  if (/\btruyền\b/i.test(rawName) && !nameRoutes.includes("Tĩnh mạch")) nameRoutes.push("Tĩnh mạch");
  const nameRoute = nameRoutes.length ? nameRoutes.join(" / ") : undefined;

  const segments = splitTopLevel(dose).map((s) => s.replace(/^hoặc\s+/i, ""));

  // 1) Lieu tach theo doi tuong (nguoi lon / tre em) cho MOT thuoc.
  if (segments.length > 1 && POP_PREFIX.test(segments[0]) && segments.every((s) => POP_PREFIX.test(s) || /^trường hợp|^nặng/i.test(s))) {
    let last: StructuredDrug | undefined;
    for (const seg of segments) {
      const m = seg.match(POP_PREFIX);
      if (!m) {
        if (last) last.flags.push(`Ghi chú kèm: ${seg}`);
        continue;
      }
      last = parseDrugSegment(name, seg.slice(m[0].length), populationOfLabel(m[1]), cap(m[1]));
      options.push(last);
    }
    if (findDrugs([dose]).filter((d) => !options[0]?.ingredientIds.includes(d.ingredientId)).length > 0) ambiguous = true;
    return done("by-population");
  }

  // 2) Nhieu thuoc, moi doan bat dau bang ten thuoc -> "chon 1".
  const led = splitOptions(dose);
  if (led.length > 1 && led.every((x) => x.lead)) {
    for (const { lead, seg } of led) {
      const opt = parseDrugSegment(lead!.name, lead!.rest);
      if (lead!.context) opt.context = lead!.context;
      if (seg.includes("; ")) opt.flags.push("Liều khác theo mức độ/tình huống – xem nguyên văn");
      if (findDrugs([lead!.rest]).filter((d) => !opt.ingredientIds.includes(d.ingredientId)).length > 0 || /±|\bkết hợp\b/i.test(lead!.rest)) {
        opt.flags.push("Lựa chọn có thêm thuốc phối hợp – xem nguyên văn");
        ambiguous = true;
      }
      /* An toan: thuoc khong dung don tri dung rieng thanh mot lua chon -> khong ro la phoi hop hay thay the. */
      if (NEVER_MONO.test(lead!.name)) {
        opt.flags.push("Thuốc không dùng đơn trị đứng riêng trong danh sách lựa chọn – xem nguyên văn");
        ambiguous = true;
      }
      options.push(opt);
    }
    return done("one-of");
  }

  // 3) Ten "A hoac B" + MOT doan lieu chung (khong ";" va khong ten thuoc khac) -> chon 1, cung lieu.
  const nameParts = name
    .replace(/\s*\((?:chọn một|một trong)\)\s*$/i, "")
    .split(/\s+hoặc\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
  /* Moi phan la MOT hoat chat: co trong tu dien, hoac la ten hoat chat don (1 tu) chua co trong tu dien (vd. nafcilin). */
  const partsAreDrugs =
    nameParts.length > 1 &&
    nameParts.every((p) => findDrugs([p]).length === 1 || (/^[a-zà-ỹđ][a-zà-ỹđ-]+$/i.test(p) && !NOT_DRUG.test(p)));
  if (partsAreDrugs && segments.length === 1 && findDrugs([dose]).length === 0 && !/một trong/i.test(name)) {
    for (const part of nameParts) options.push(parseDrugSegment(part, dose));
    return done("one-of");
  }
  // 3b) Ten "A hoac B" + N doan lieu khong ghi ten thuoc: chi ghep theo vi tri khi nguon duoc
  //     dung theo dung thu tu ten (module CAP/HAP: dose = `${A.dose}; ${B.dose}`); van ban tu do -> can ra soat.
  if (partsAreDrugs && segments.length === nameParts.length && findDrugs([dose]).length === 0) {
    if (positional) {
      nameParts.forEach((part, i) => options.push(parseDrugSegment(part, segments[i])));
      return done("one-of");
    }
    ambiguous = true;
  }

  // 4) Mot doan duy nhat bat dau bang ten thuoc (ten muc la nhom/"Mot trong").
  if (led.length === 1 && led[0].lead && (ONE_OF_NAME.test(rawName) || findDrugs([name]).length === 0)) {
    const opt = parseDrugSegment(led[0].lead.name, led[0].lead.rest);
    if (led[0].lead.context) opt.context = led[0].lead.context;
    if (findDrugs([led[0].lead.rest]).filter((d) => !opt.ingredientIds.includes(d.ingredientId)).length > 0) {
      opt.flags.push("Dòng có nhiều thuốc – xem nguyên văn");
      ambiguous = true;
    }
    options.push(opt);
    return done("all");
  }

  // 5) Mot thuoc, mot dong lieu.
  const opt = parseDrugSegment(name || rawName, dose);
  if (ONE_OF_NAME.test(rawName) && segments.length > 1) {
    opt.flags.push("Danh sách lựa chọn không tách được – xem nguyên văn");
    ambiguous = true;
  }
  if (findDrugs([dose]).filter((d) => !opt.ingredientIds.includes(d.ingredientId)).length > 0) {
    opt.flags.push("Dòng liều nhắc thêm thuốc khác (thay thế/phối hợp) – xem nguyên văn");
    ambiguous = true;
  }
  options.push(opt);
  return done("all");
}

export function buildGroups(drugs: { name: string; dose: string }[]): DrugGroup[] {
  const groups: DrugGroup[] = [];
  for (const item of drugs) {
    const g = buildGroup(item);
    // Muc bat dau bang "hoac ..." -> lua chon thay the cua nhom truoc (OR).
    if (/^hoặc\b/i.test(item.name.trim()) && groups.length > 0) {
      const prev = groups[groups.length - 1];
      prev.rule = "one-of";
      prev.options.push(...g.options);
      prev.ambiguous = prev.ambiguous || g.ambiguous;
      prev.raw.push(...g.raw);
      continue;
    }
    /* Lao: giai doan duy tri ghi "lieu nhu tren" -> lay lieu cung ma thuoc o giai doan tan cong
       cua CUNG phuong an (nguon ghi ro "nhu tren"). */
    if (/^duy trì/i.test(g.label ?? "") && /liều như trên/i.test(item.dose)) {
      const intensive = groups.find((x) => /^tấn công/i.test(x.label ?? ""));
      for (const o of g.options) {
        const src = intensive?.options.find((x) => x.name === o.name && x.dose);
        if (!src) continue;
        Object.assign(o, { dose: src.dose, doseUnit: src.doseUnit, doseBasis: src.doseBasis, maxDose: src.maxDose });
        o.flags = o.flags.filter((f) => !/không nêu liều|tham chiếu|không ghi ở dòng/.test(f));
        o.flags.push("Nguồn ghi 'liều như trên' – liều theo giai đoạn tấn công");
        o.complete = isComplete(o);
      }
    }
    groups.push(g);
  }
  return groups;
}

/* ======================= Phuong an ======================= */

const RENAL_IDS = new Set(renalDosingDatabase.map((p) => p.ingredientId));

const TYPE_OF: Record<RegimenRole, RegimenType> = {
  first: "empiric",
  severe: "empiric",
  alternative: "empiric",
  allergy: "allergy-alternative",
  pathogen: "pathogen-directed",
  adjunct: "adjunct",
};
const PRIORITY_OF: Record<RegimenRole, Priority> = {
  first: "preferred",
  severe: "preferred",
  alternative: "alternative",
  allergy: "alternative",
  pathogen: "special",
  adjunct: "special",
};

function populationOfScenario(text: string): StructuredRegimen["population"] {
  const t = text.toLocaleLowerCase("vi");
  if (/trẻ|sơ sinh|nhũ nhi|tháng tuổi|nhi khoa/.test(t)) return "child";
  if (/thai|hậu sản|sản khoa|sản phụ/.test(t)) return "obstetric";
  if (/người lớn/.test(t)) return "adult";
  return "unspecified";
}

export function structureOf(regimen: Regimen): StructuredRegimen {
  const groups = buildGroups(regimen.drugs);
  const all = groups.flatMap((g) => g.options);
  const core = groups.filter((g) => g.label !== "Hỗ trợ").flatMap((g) => g.options);
  const reviewReasons: string[] = [];
  if (groups.some((g) => g.ambiguous)) reviewReasons.push("Không xác định chắc chắn cấu trúc phối hợp/lựa chọn (AND/OR) từ nguyên văn.");
  const anyDose = core.some((d) => !!d.dose);
  let status: StructureStatus;
  if (!anyDose) status = "NO_DOSE";
  else if (reviewReasons.length > 0) status = "NEEDS_STRUCTURED_REVIEW";
  else if (core.every((d) => d.complete)) status = "STRUCTURED";
  else status = "PARTIAL";
  const ids = Array.from(new Set(all.flatMap((d) => d.ingredientIds)));
  return {
    regimenId: regimen.id,
    diseaseIds: regimen.diseaseIds,
    clinicalScenario: regimen.scenario,
    population: populationOfScenario(regimen.scenario),
    severity: severityOf(regimen.scenario, regimen.role),
    riskFactors: mdrOf(regimen.scenario) === "high" ? "mdr-high" : mdrOf(regimen.scenario) === "low" ? "mdr-low" : "unspecified",
    suspectedPathogens: regimen.role === "pathogen" ? regimen.scenario : undefined,
    regimenType: TYPE_OF[regimen.role],
    priority: PRIORITY_OF[regimen.role],
    groups,
    treatmentDuration: regimen.duration,
    renalAdjustment: ids.some((id) => RENAL_IDS.has(id)) ? "check-dosing-module" : "no-data",
    sourceId: regimen.source.doc,
    sourceSection: regimen.source.section,
    sourcePage: regimen.source.page,
    status,
    reviewReasons,
  };
}

/* Lua chon dang van ban (khuyen cao quoc te, module CAP/HAP): moi dong la nhom "chon 1". */
export function structureOptionLines(lines: string[]): { groups: DrugGroup[]; status: StructureStatus } {
  const groups = lines.map((line) => buildGroup({ name: "Một trong", dose: line }));
  const opts = groups.flatMap((g) => g.options);
  const status: StructureStatus = !opts.some((o) => o.dose)
    ? "NO_DOSE"
    : groups.some((g) => g.ambiguous)
      ? "NEEDS_STRUCTURED_REVIEW"
      : opts.every((o) => o.complete)
        ? "STRUCTURED"
        : "PARTIAL";
  return { groups, status };
}

/* Thuoc co route rieng (module CAP/HAP-VAP): tach lieu, giu route nguon. */
export function structureDrugLines(drugs: { name: string; dose: string; route?: string }[]): DrugGroup[] {
  /* Dung chung bo tach nhom (dong co nhieu thuoc "A; hoac B" -> chon 1); duong dung cua module
     ap cho thuoc chua co duong dung trong dong lieu. */
  return drugs.map((d) => {
    const g = buildGroup({ name: d.name, dose: d.dose }, true);
    if (d.route) for (const o of g.options) applyRoute(o, d.route);
    return g;
  });
}

export const STRUCTURE_STATUS_TEXT: Record<StructureStatus, string> = {
  STRUCTURED: "Đã tách liều đầy đủ",
  PARTIAL: "Tách được một phần – ô trống là nguồn không nêu",
  NEEDS_STRUCTURED_REVIEW: "NEEDS_STRUCTURED_REVIEW – hiển thị nguyên văn",
  NO_DOSE: "Nguồn không nêu liều",
};

/* Loc hang lieu theo doi tuong dang xem: nguoi lon khong thay lieu tre em va nguoc lai.
   "any" (khong ghi doi tuong) luon hien. Khong co doi tuong -> hien tat ca. */
export function optionsFor(group: DrugGroup, population?: "adult" | "child"): StructuredDrug[] {
  if (!population || group.rule !== "by-population") return group.options;
  const keep = group.options.filter((o) =>
    o.population === "any" || (population === "adult" ? o.population === "adult" : o.population === "child" || o.population === "neonate")
  );
  return keep.length > 0 ? keep : group.options;
}

/* Thong ke (bao cao/kiem thu). */
export function structureSummary(regimens: Regimen[]) {
  const out: Record<StructureStatus, number> = { STRUCTURED: 0, PARTIAL: 0, NEEDS_STRUCTURED_REVIEW: 0, NO_DOSE: 0 };
  for (const r of regimens) out[structureOf(r).status]++;
  return out;
}

/* Lua chon cua bo chon (engine): phac do BYT -> theo id; module CAP/HAP-VAP -> dong thuoc cua module. */
export function structureForOption(
  id: string,
  drugs: { name: string; dose: string; route?: string }[]
): { groups: DrugGroup[]; status: StructureStatus } {
  const regimen = ALL_REGIMENS.find((r) => r.id === id);
  if (regimen) {
    const s = structureOf(regimen);
    return { groups: s.groups, status: s.status };
  }
  const groups = structureDrugLines(drugs);
  const opts = groups.flatMap((g) => g.options);
  const status: StructureStatus = !opts.some((o) => o.dose)
    ? "NO_DOSE"
    : groups.some((g) => g.ambiguous)
      ? "NEEDS_STRUCTURED_REVIEW"
      : opts.every((o) => o.complete)
        ? "STRUCTURED"
        : "PARTIAL";
  return { groups, status };
}
