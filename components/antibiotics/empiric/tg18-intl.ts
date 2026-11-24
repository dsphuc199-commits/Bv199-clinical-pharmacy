/*
  FILE: components/antibiotics/empiric/tg18-intl.ts

  Viêm đường mật cấp ở người lớn – khuyến cáo quốc tế Tokyo Guidelines 2018 (TG18), trình bày theo bố cục
  phân tầng (cột theo độ nặng và bối cảnh mắc bệnh).
  Nguồn:
  - Kiriyama S và cs. TG18: diagnostic criteria and severity grading of acute cholangitis. J Hepatobiliary Pancreat Sci
    2018;25:17–30. doi:10.1002/jhbp.512 (phân độ I–III).
  - Miura F và cs. TG18: initial management of acute biliary infection and flowchart for acute cholangitis.
    J Hepatobiliary Pancreat Sci 2018;25:31–40. doi:10.1002/jhbp.509 (dẫn lưu theo độ nặng).
  - Gomi H và cs. TG18: antimicrobial therapy for acute cholangitis and cholecystitis. J Hepatobiliary Pancreat Sci
    2018;25:3–16. doi:10.1002/jhbp.518 (lựa chọn thuốc, thời gian, vi sinh, chuyển uống).

  Không nhập lại dữ liệu: thuốc, liều và lưu ý đọc từ data/guidelines/intl/viem-duong-mat-cap.json (cùng dữ liệu
  công cụ TG18 cũ). TG18 không ghi liều; liều trong JSON là liều tham khảo cho người lớn CrCl > 60 mL/phút
  (nhãn chế phẩm, hướng dẫn liều người lớn), giữ nguyên và ghi rõ phạm vi ở phần nguyên tắc.
*/
import type { StratCite, StratIntl } from "../../../data/antibiotics/empiric/stratification";
import json from "../../../data/guidelines/intl/viem-duong-mat-cap.json";

export const TG18 = "TG18";
type JItem = { role: string; text: string; dose?: string; administration?: string; preparation?: string; ref?: string };
type JBlock = { title: string; lead?: string; items: JItem[] };
type JRule = { id: string; blocks?: JBlock[]; summary?: { label: string; text: string }[] };
type JBullet = { text: string; source_ids?: string[] };
type JSection = { id: string; title: string; lead?: string; bullets?: JBullet[]; items?: (JItem & { source_ids?: string[] })[] };
const data = json as unknown as { rules: JRule[]; sections: JSection[] };

/** Tác giả bài TG18 theo mã nguồn (hiển thị trong ngoặc sau "TG18"). */
const PAPER: Record<string, string> = { "tg18-antibiotics": "Gomi 2018", "tg18-grading": "Kiriyama 2018", "tg18-flow": "Miura 2018" };
const paperOf = (ids?: string[]) => PAPER[ids?.find((id) => PAPER[id]) ?? "tg18-antibiotics"];
const rule = (id: string) => {
  const r = data.rules.find((x) => x.id === id);
  if (!r) throw new Error(`TG18: thiếu rule ${id}`);
  return r;
};
const section = (id: string) => {
  const s = data.sections.find((x) => x.id === id);
  if (!s) throw new Error(`TG18: thiếu section ${id}`);
  return s;
};
/** Bỏ trường vị trí tài liệu (ref, source_ids): chỉ giữ nội dung hiển thị. */
const item = ({ role, text, dose, administration, preparation }: JItem) => ({ role, text, ref: "TG18", ...(dose ? { dose } : {}), ...(administration ? { administration } : {}), ...(preparation ? { preparation } : {}) });
const BLOCK_NAME: Record<string, string> = {
  "Thuốc nền · chọn một": "thuốc nền, chọn một",
  "Thay thế có điều kiện": "thay thế có điều kiện",
  "Phối hợp bao phủ Enterococcus": "phối hợp bao phủ Enterococcus",
};
const blocks = (id: string): StratIntl[] => (rule(id).blocks ?? []).map((b) => ({ source: `${TG18} – ${BLOCK_NAME[b.title] ?? b.title}`, lead: b.lead, items: b.items.map(item) }));
const cites = (id: string): StratCite[] => (section(id).bullets ?? []).map((b) => ({ text: b.text, source: TG18, ref: paperOf(b.source_ids) }));
const summary = (id: string) => rule(id).summary?.[0]?.text ?? "";

/* Phân độ TG18 (Kiriyama 2018, tiêu chuẩn phân độ viêm đường mật cấp). */
const GRADE_III = "Độ III (nặng): suy ít nhất một cơ quan – tim mạch (tụt huyết áp cần dopamin ≥ 5 µg/kg/phút hoặc bất kỳ liều norepinephrin nào), thần kinh (rối loạn ý thức), hô hấp (PaO₂/FiO₂ < 300), thận (thiểu niệu, creatinin huyết thanh > 2,0 mg/dL), gan (PT-INR > 1,5), huyết học (tiểu cầu < 100.000/mm³).";
const GRADE_II = "Độ II (trung bình): không có suy cơ quan và có ít nhất hai tiêu chí – bạch cầu > 12.000/mm³ hoặc < 4.000/mm³; sốt ≥ 39 °C; tuổi ≥ 75; bilirubin toàn phần ≥ 5 mg/dL; albumin máu < 0,7 lần giới hạn dưới bình thường.";
const GRADE_I = "Độ I (nhẹ): không đủ tiêu chuẩn Độ II hoặc Độ III khi chẩn đoán ban đầu.";
const drain = (id: string): StratCite[] => (section(id).bullets ?? []).map((b) => ({ text: `Dẫn lưu: ${b.text}`, source: TG18, ref: paperOf(b.source_ids) }));
const K = "Kiriyama 2018";

export const TG18_CRITERIA = {
  c1: [{ text: GRADE_I, source: TG18, ref: K }, ...drain("drainage-i")],
  c2: [{ text: GRADE_II, source: TG18, ref: K }, ...drain("drainage-ii")],
  c3: [{ text: GRADE_III, source: TG18, ref: K }, ...drain("drainage-iii")],
  hc: [
    { text: `Viêm đường mật liên quan chăm sóc y tế, mọi độ nặng: ${summary("healthcare")}`, source: TG18, ref: "Gomi 2018" },
    { text: "Dẫn lưu theo độ nặng như các cột mắc phải cộng đồng.", source: TG18, ref: "Miura 2018" },
  ],
} satisfies Record<string, StratCite[]>;

export const TG18_COLUMNS = {
  c1: blocks("community-i"),
  c2: blocks("community-ii"),
  c3: blocks("community-iii"),
  hc: blocks("healthcare"),
};

/* Lấy mẫu: mục khởi trị và lấy mẫu – câu về thời điểm dùng kháng sinh và cấy mật, cấy máu. */
const initial = cites("initial");
export const TG18_SAMPLING: StratCite[] = initial.filter((c) => /Cấy mật|Khởi trị khi nghi/u.test(c.text));
export const TG18_PATHOGENS: StratCite[] = cites("microbiology");

const addon = (id: string, source: string): StratIntl[] => (rule(id).blocks ?? []).map((b) => ({ source, lead: b.lead, items: b.items.map(item) }));
const asItems = (id: string, role: string) => (section(id).bullets ?? []).map((b) => ({ role, text: b.text, ref: TG18 }));
const oral = section("oral-step-down");

export const TG18_EXTRAS: { title: string; criteria?: string; blocks: StratIntl[] }[] = [
  { title: "Có miệng nối mật–ruột: phối hợp thuốc kỵ khí", criteria: "Mọi độ nặng, cả mắc phải cộng đồng và liên quan chăm sóc y tế.", blocks: addon("anaerobic-cover", `${TG18} – phối hợp kỵ khí`) },
  { title: "Cần bao phủ Enterococcus kháng vancomycin (VRE)", criteria: "Liên quan chăm sóc y tế mọi độ nặng, hoặc mắc phải cộng đồng Độ III, khi đã biết định cư VRE, đã dùng vancomycin hoặc VRE phổ biến tại cơ sở.", blocks: addon("vre-alternatives", `${TG18} – thay vancomycin khi cần bao phủ VRE`) },
  { title: "Vi khuẩn kháng thuốc", blocks: [{ source: `${TG18} – lựa chọn khi vi khuẩn kháng thuốc`, items: asItems("resistant", "Kháng thuốc") }] },
  { title: "Thu hẹp phổ và chuyển đường uống", blocks: [
    { source: `${TG18} – thuốc uống khi chủng còn nhạy`, lead: oral.lead, items: (oral.items ?? []).map(item) },
    { source: `${TG18} – thu hẹp phổ theo kết quả cấy`, items: (oral.bullets ?? []).map((b) => ({ role: "Thu hẹp phổ", text: b.text, ref: TG18 })) },
  ] },
];

/* Nguyên tắc: thời gian điều trị (luôn hiện), khởi trị, chọn thuốc và phạm vi liều. */
export const TG18_PRINCIPLES: StratIntl = {
  source: `${TG18} – thời gian điều trị, khởi trị và chọn thuốc`,
  items: [
    ...(section("duration").items ?? []).map(({ role, text }) => ({ role: `Thời gian – ${role.charAt(0).toLowerCase()}${role.slice(1)}`, text, ref: TG18 })),
    ...initial.filter((c) => !TG18_SAMPLING.includes(c)).map((c) => ({ role: "Nguyên tắc", text: c.text, ref: TG18 })),
    ...(section("dose-scope").bullets ?? []).map((b) => ({ role: "Liều", text: b.text, ref: TG18 })),
  ],
};

export const TG18_SOURCES = [
  "Kiriyama S và cs. Tokyo Guidelines 2018: diagnostic criteria and severity grading of acute cholangitis (with videos). J Hepatobiliary Pancreat Sci 2018;25(1):17–30.",
  "Miura F và cs. Tokyo Guidelines 2018: initial management of acute biliary infection and flowchart for acute cholangitis. J Hepatobiliary Pancreat Sci 2018;25(1):31–40.",
  "Gomi H và cs. Tokyo Guidelines 2018: antimicrobial therapy for acute cholangitis and cholecystitis. J Hepatobiliary Pancreat Sci 2018;25(1):3–16.",
];
