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
/* Thẻ thuốc gọn: câu mô tả và ghi chú cách dùng của JSON (dùng chung công cụ TG18 cũ, giữ nguyên) rút thành một câu ngắn
   cùng nội dung; bỏ dòng hàm lượng lọ và các ghi chú chung "theo nhãn". Câu không có trong bảng giữ nguyên. */
const KN = "+ metronidazol nếu có miệng nối mật–ruột";
const SHORT_TEXT: Record<string, string> = {
  "TG18 liệt kê cho Độ I mắc phải cộng đồng, ± metronidazol, kèm lưu ý cân nhắc kháng sinh đồ tại chỗ trước khi dùng.": "± metronidazol; đối chiếu kháng sinh đồ tại chỗ.",
  "TG18 liệt kê cho Độ I mắc phải cộng đồng, ± metronidazol. Đối chiếu kháng sinh đồ tại chỗ.": "± metronidazol; đối chiếu kháng sinh đồ tại chỗ.",
  "TG18 liệt kê cho Độ II mắc phải cộng đồng, ± metronidazol. Đối chiếu kháng sinh đồ tại chỗ.": "± metronidazol; đối chiếu kháng sinh đồ tại chỗ.",
  "TG18 liệt kê ertapenem cho Độ I mắc phải cộng đồng. Đủ phổ kỵ khí khi có miệng nối mật–ruột; không có hoạt tính kháng Pseudomonas.": "Đủ phổ kỵ khí; không phủ Pseudomonas.",
  "TG18 liệt kê ertapenem cho Độ II mắc phải cộng đồng. Đủ phổ kỵ khí khi có miệng nối mật–ruột; không có hoạt tính kháng Pseudomonas.": "Đủ phổ kỵ khí; không phủ Pseudomonas.",
  "TG18 liệt kê cho Độ I mắc phải cộng đồng. Đủ phổ kỵ khí khi có miệng nối mật–ruột.": "Đủ phổ kỵ khí.",
  "TG18 liệt kê cho Độ II mắc phải cộng đồng. Đủ phổ kỵ khí khi có miệng nối mật–ruột.": "Đủ phổ kỵ khí.",
  "TG18 không khuyến cáo dùng kinh nghiệm khi tỷ lệ kháng tại chỗ >20% (độ nhạy <80%). Dùng theo đích khi kháng sinh đồ xác nhận còn nhạy. Thuốc còn ít hoạt tính với E. coli.": "Không dùng kinh nghiệm khi kháng tại chỗ > 20%; dùng theo kháng sinh đồ.",
  "TG18 liệt kê fluoroquinolon cho Độ I mắc phải cộng đồng chỉ khi đã biết độ nhạy của chủng phân lập hoặc người bệnh dị ứng beta-lactam. Nhiều chủng sinh ESBL kháng fluoroquinolon. Thêm metronidazol nếu có miệng nối mật–ruột.": `Chỉ khi biết chủng còn nhạy hoặc dị ứng beta-lactam; ${KN}.`,
  "TG18 liệt kê fluoroquinolon cho Độ II mắc phải cộng đồng chỉ khi đã biết độ nhạy của chủng phân lập hoặc người bệnh dị ứng beta-lactam. Nhiều chủng sinh ESBL kháng fluoroquinolon. Thêm metronidazol nếu có miệng nối mật–ruột.": `Chỉ khi biết chủng còn nhạy hoặc dị ứng beta-lactam; ${KN}.`,
  "TG18 liệt kê cho Độ II–III và nhiễm khuẩn liên quan chăm sóc y tế. Đủ phổ kỵ khí, có hoạt tính kháng Pseudomonas.": "Đủ phổ kỵ khí, phủ Pseudomonas.",
  "TG18 liệt kê ± metronidazol. Có hoạt tính kháng Pseudomonas; thêm metronidazol khi có miệng nối mật–ruột.": `Phủ Pseudomonas; ${KN}.`,
  "TG18 liệt kê ± metronidazol. Có hoạt tính kháng Pseudomonas; phổ Gram dương yếu, thêm metronidazol khi có miệng nối mật–ruột.": `Phủ Pseudomonas, Gram dương yếu; ${KN}.`,
  "TG18 liệt kê nhóm carbapenem (imipenem/cilastatin, meropenem, doripenem). Đủ phổ kỵ khí, có hoạt tính kháng Pseudomonas.": "Hoặc imipenem/cilastatin, doripenem. Đủ phổ kỵ khí, phủ Pseudomonas.",
  "TG18 liệt kê aztreonam ± metronidazol. Không có phổ Gram dương và kỵ khí; phối hợp theo bệnh cảnh. Rà dị ứng ceftazidim.": "± metronidazol; không phủ Gram dương, kỵ khí.",
  "TG18 khuyến cáo phối hợp vancomycin để bao phủ Enterococcus ở viêm đường mật cấp Độ III mắc phải cộng đồng. Rà lại khi có kết quả vi sinh.": "Phủ Enterococcus; rà lại khi có kết quả cấy.",
  "Đánh giá chỉ định phối hợp theo vi sinh trước đó, nguy cơ Gram dương kháng thuốc và dữ liệu tại cơ sở. Khi có kết quả cấy, thu hẹp phổ theo tác nhân.": "Theo vi sinh trước đó, nguy cơ Gram dương kháng thuốc.",
  "Bổ sung khi có miệng nối mật–ruột và thuốc nền chưa đủ phổ kỵ khí. Piperacillin/tazobactam, ampicillin/sulbactam và carbapenem đã có phổ kỵ khí cho tình huống này.": "Khi thuốc nền chưa phủ kỵ khí (piperacillin/tazobactam, ampicillin/sulbactam, carbapenem đã phủ).",
  "Lựa chọn thay vancomycin khi cần bao phủ VRE phù hợp theo vi sinh và hội chẩn. Giữ thuốc nền Gram âm nếu vẫn còn chỉ định. Kiểm tra tương tác và theo dõi công thức máu.": "Thay vancomycin khi cần phủ VRE; theo dõi công thức máu.",
  "Một lựa chọn khác khi cần bao phủ VRE. Chuyên khoa chọn liều theo loài, MIC, chức năng thận và vị trí nhiễm. Giữ thuốc nền Gram âm nếu còn chỉ định.": "Thay vancomycin khi cần phủ VRE; liều theo hội chẩn.",
  "TG18 khuyến cáo 4–7 ngày sau khi kiểm soát ổ nhiễm. Khuyến cáo 1, mức bằng chứng C theo TG18.": "4–7 ngày sau kiểm soát ổ nhiễm (khuyến cáo 1, mức C).",
  "Với tác nhân như Enterococcus hoặc Streptococcus, TG18 nêu điều trị tối thiểu 2 tuần. Đánh giá khả năng viêm nội tâm mạc và điều chỉnh theo tác nhân, ổ nhiễm.": "Enterococcus, Streptococcus: tối thiểu 2 tuần; đánh giá viêm nội tâm mạc.",
  "Với sỏi tồn dư hoặc tắc mật, TG18 nêu tiếp tục điều trị đến khi xử trí được nguyên nhân. Với áp-xe gan, tiếp tục đến khi theo dõi lâm sàng, xét nghiệm và hình ảnh xác nhận ổ áp-xe đã hết.": "Đến khi xử trí được nguyên nhân; áp xe gan: đến khi hình ảnh xác nhận hết.",
  "Lựa chọn chuyển uống theo TG18 nếu chủng còn nhạy. Khi có nhiễm khuẩn huyết, đối chiếu phác đồ riêng theo tác nhân.": "Khi chủng còn nhạy.",
  "Lựa chọn chuyển uống khi chủng còn nhạy và phù hợp về an toàn. Rà nhu cầu phối hợp bao phủ kỵ khí nếu có miệng nối mật–ruột.": `Khi chủng còn nhạy; ${KN}.`,
  "Lựa chọn chuyển uống theo TG18 khi chủng còn nhạy. Thêm metronidazol nếu có miệng nối mật–ruột.": `Khi chủng còn nhạy; ${KN}.`,
  "Lựa chọn chuyển uống theo TG18 khi chủng còn nhạy, thay cho ciprofloxacin. Thêm metronidazol nếu có miệng nối mật–ruột. Rà nguy cơ kéo dài QT và tương tác.": `Khi chủng còn nhạy; ${KN}. Lưu ý QT.`,
  "Lựa chọn chuyển uống theo TG18 khi chủng còn nhạy. Thuốc có phổ kỵ khí nên không cần thêm metronidazol. Rà nguy cơ kéo dài QT và tương tác.": "Khi chủng còn nhạy; đã phủ kỵ khí. Lưu ý QT.",
};
const SHORT_ADMIN: Record<string, string> = {
  "Liều tham khảo UCSF cho nhiễm Gram âm ở người lớn có chức năng thận phù hợp. Hoàn nguyên và pha truyền theo nhãn chế phẩm.": "",
  "Liều tham khảo theo nhãn cho nhiễm khuẩn có biến chứng. Nếu tiêm tĩnh mạch trực tiếp, dùng trong 3–5 phút.": "",
  "Truyền khoảng 30 phút. Kiểm tra dung môi tương thích theo nhãn chế phẩm.": "",
  "Liều người lớn cho nhiễm khuẩn trung bình đến nặng. Khi tiêm tĩnh mạch trực tiếp, dùng trong 3–5 phút theo nhãn.": "",
  "Truyền tĩnh mạch trong 30 phút theo nhãn. Hiệu chỉnh theo CrCl. Hội chẩn nếu bệnh nặng hoặc albumin thấp trước khi chọn ertapenem.": "Hiệu chỉnh theo CrCl; hội chẩn nếu bệnh nặng hoặc albumin thấp.",
  "Liều theo QĐ 708/QĐ-BYT cho nhiễm khuẩn đường mật. Hoàn nguyên và pha truyền theo nhãn chế phẩm. Hiệu chỉnh khi suy gan hoặc tắc mật nặng theo nhãn.": "Hiệu chỉnh khi suy gan, tắc mật nặng.",
  "Truyền 15–30 phút. Mỗi liều gồm ampicillin 2 g và sulbactam 1 g. Hiệu chỉnh theo CrCl.": "Hiệu chỉnh theo CrCl.",
  "Truyền tĩnh mạch trong 60 phút theo nhãn. Rà tương tác, nguy cơ kéo dài QT và kháng fluoroquinolon.": "Lưu ý QT, tương tác.",
  "Theo quy trình truyền kéo dài của UCSF. Truyền liều đầu 30 phút, bắt đầu liều duy trì ngay sau đó và truyền mỗi liều trong 4 giờ. Áp dụng khi cơ sở có quy trình truyền kéo dài phù hợp.": "Truyền kéo dài 4 giờ (liều đầu 30 phút).",
  "Truyền khoảng 30 phút. Liều tham khảo của UCSF cho nhiễm khuẩn nặng hoặc nghi Pseudomonas, CrCl >60 mL/phút.": "CrCl > 60 mL/phút.",
  "Truyền ngắn theo hướng dẫn chế phẩm. Hiệu chỉnh khi CrCl giảm.": "Hiệu chỉnh theo CrCl.",
  "Liều tham khảo cho nhiễm khuẩn ổ bụng, truyền trong 15–30 phút theo nhãn.": "",
  "Truyền trong 20–60 phút theo nhãn AZACTAM.": "",
  "Liều duy trì và khoảng cách liều theo cân nặng, CrCl và TDM. Truyền ít nhất 60 phút với tốc độ ≤10 mg/phút. Áp dụng thời gian dài hơn nếu cần để đáp ứng cả hai giới hạn.": "Duy trì theo cân nặng, CrCl, TDM; truyền ≥ 60 phút.",
  "Truyền tĩnh mạch chậm theo nhãn. Liều nhiễm khuẩn ổ bụng theo UCSF. Rà chức năng gan và đối chiếu tiêu chí chuyển uống.": "",
  "Truyền trong 30–120 phút theo nhãn. Dùng riêng từng thuốc.": "",
  "Có thể truyền tĩnh mạch trong 30 phút theo nhãn. Hội chẩn về liều khi điều trị VRE và theo dõi creatine kinase.": "Theo dõi CK.",
  "Liều tham khảo cho chỉ định thông thường, CrCl >30 mL/phút.": "CrCl > 30 mL/phút.",
  "Liều chuẩn của UCSF khi CrCl >50 mL/phút. Đối chiếu riêng nếu có nhiễm khuẩn huyết hoặc Pseudomonas.": "CrCl > 50 mL/phút.",
  "Liều theo nhãn chế phẩm và hướng dẫn liều BV199, hiệu chỉnh theo chức năng thận.": "Hiệu chỉnh theo chức năng thận.",
};
const shortText = (t: string) => SHORT_TEXT[t] ?? t;
const item = ({ role, text, dose, administration }: JItem) => {
  const adm = administration === undefined ? "" : SHORT_ADMIN[administration] ?? administration;
  const d = dose === "Nếu nhiễm nặng có chỉ định liều nạp, tham khảo 20–25 mg/kg tĩnh mạch một lần" ? "Nhiễm nặng: liều nạp 20–25 mg/kg TM một lần"
    : dose?.replace(/(truyền )?tĩnh mạch/gu, "TM");
  return { role, text: shortText(text), ref: "TG18", ...(d ? { dose: d } : {}), ...(adm ? { administration: adm } : {}) };
};
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
    ...(section("duration").items ?? []).map(({ role, text }) => ({ role: `Thời gian – ${role.charAt(0).toLowerCase()}${role.slice(1)}`, text: shortText(text), ref: TG18 })),
    ...initial.filter((c) => !TG18_SAMPLING.includes(c)).map((c) => ({ role: "Nguyên tắc", text: c.text, ref: TG18 })),
    ...(section("dose-scope").bullets ?? []).map((b) => ({ role: "Liều", text: b.text, ref: TG18 })),
  ],
};

export const TG18_SOURCES = [
  "Kiriyama S và cs. Tokyo Guidelines 2018: diagnostic criteria and severity grading of acute cholangitis (with videos). J Hepatobiliary Pancreat Sci 2018;25(1):17–30.",
  "Miura F và cs. Tokyo Guidelines 2018: initial management of acute biliary infection and flowchart for acute cholangitis. J Hepatobiliary Pancreat Sci 2018;25(1):31–40.",
  "Gomi H và cs. Tokyo Guidelines 2018: antimicrobial therapy for acute cholangitis and cholecystitis. J Hepatobiliary Pancreat Sci 2018;25(1):3–16.",
];
