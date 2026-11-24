/*
  FILE: components/antibiotics/empiric/cns-intl.ts

  Nhiễm khuẩn thần kinh trung ương ở người lớn – khuyến cáo quốc tế cho khung phân tầng.
  1) Viêm màng não vi khuẩn cấp mắc phải cộng đồng (v8-36):
     - WHO. Guidelines on meningitis diagnosis, treatment and care (2025) – khuyến cáo và mức GRADE.
     - WHO. Practical manual on meningitis diagnosis, treatment and care (2026) – liều (Hình 12, Bảng 11),
       thời gian theo tác nhân (Bảng 10), dexamethason (mục 7.5.2).
     Liều và câu khuyến cáo chép từ data/antibiotics/empiric/international.ts (mục v8-36, đã đối chiếu bản PDF);
     test kiểm tra từng liều có trong dữ liệu đó.
  2) Viêm não thất, viêm màng não liên quan chăm sóc y tế (dẫn lưu não thất, shunt, sau phẫu thuật thần kinh; v8-38):
     - Tunkel AR và cs. 2017 IDSA Clinical Practice Guidelines for Healthcare-Associated Ventriculitis and
       Meningitis. Clin Infect Dis 2017;64(6):e34–e65. doi:10.1093/cid/ciw861 (PMC5848239).
     Bản tóm tắt khuyến cáo: Clin Infect Dis 2017;64(6):701–706. doi:10.1093/cid/cix152 – 83 khuyến cáo có số
     và mức (người dùng cung cấp PDF, đã đối chiếu từng câu KC 15–83 dùng ở đây).
     Mức khuyến cáo IDSA (mạnh/yếu · chất lượng bằng chứng cao/TB/thấp) đổi sang mã chung: strong-low → S-L…
     Bảng liều chỉ có ở bản toàn văn (e34–e65), chưa có bản PDF → khối IDSA không ghi liều (không tự điền);
     liều dùng theo cột QĐ 708 ở tab Việt Nam.
  Mức WHO: "Mạnh; rất thấp" → S-VL, "Mạnh; thấp" → S-L, "Có điều kiện; rất thấp" → C-VL.
*/
import type { StratCite, StratIntl } from "../../../data/antibiotics/empiric/stratification";

export const WHO25 = "WHO 2025";
export const WHO26 = "WHO 2026";
export const IDSA17 = "IDSA 2017";

/* ---------------- Viêm màng não mắc phải cộng đồng (WHO) ---------------- */
/** Liều người lớn, chức năng gan thận bình thường (WHO 2026, Hình 12 và Bảng 11). */
export const WHO_DOSE = {
  ceftriaxone: "2 g TM mỗi 12 giờ",
  ceftriaxoneMax: "Tối đa 4 g/ngày; chỉ khi không chia liều được: 4 g mỗi 24 giờ.",
  cefotaxime: "2 g TM mỗi 4 giờ hoặc 3 g TM mỗi 6 giờ",
  cefotaximeMax: "Tối đa 12 g/ngày.",
  ampicillin: "2 g TM mỗi 4 giờ hoặc 3 g TM mỗi 6 giờ",
  ampicillinMax: "Tối đa 12 g/ngày.",
  vancomycin: "15–20 mg/kg TM mỗi 8–12 giờ",
  vancomycinMax: "Tối đa 4 g/ngày. Theo dõi nồng độ đáy, đích 15–20 mg/L; không theo dõi được nồng độ thì không quá 3 g/ngày.",
  rifampicin: "300 mg mỗi 12 giờ hoặc 600 mg mỗi 24 giờ",
  dexamethasone: "10 mg TM mỗi 6 giờ",
};

const BASE: StratIntl["items"] = [
  { role: "Chọn một", text: "Ceftriaxon – ưu tiên khi có dịch não mô cầu, phế cầu. Điều trị nội trú: chia mỗi 12 giờ.", dose: WHO_DOSE.ceftriaxone, administration: WHO_DOSE.ceftriaxoneMax, grade: "S-VL", ref: WHO26 },
  { role: "Chọn một", text: "Cefotaxim – tương đương ceftriaxon.", dose: WHO_DOSE.cefotaxime, administration: WHO_DOSE.cefotaximeMax, grade: "S-VL", ref: WHO26 },
];
const DEXA: StratIntl = {
  source: `${WHO26} – corticosteroid bổ trợ`,
  lead: "Bắt đầu cùng liều kháng sinh đầu tiên hoặc sớm nhất có thể, không muộn hơn 12 giờ sau liều kháng sinh đầu.",
  items: [{ role: "Phối hợp", text: "Dexamethason. Ngừng nếu dịch não tủy không phù hợp viêm màng não vi khuẩn hoặc tác nhân không phải S. pneumoniae, H. influenzae typ b. Không dùng ở người HIV giai đoạn tiến triển; chưa dùng khi chưa loại trừ sốt rét thể não.", dose: WHO_DOSE.dexamethasone, course: "tối đa 4 ngày", grade: "S-L", ref: WHO25 }],
};

export const MEN_WHO_STD: StratIntl[] = [
  { source: `${WHO25} – kháng sinh kinh nghiệm, liều ${WHO26}`, items: BASE },
  DEXA,
];
export const MEN_WHO_LISTERIA: StratIntl[] = [
  { source: `${WHO25} – kháng sinh kinh nghiệm, liều ${WHO26}`, items: [
    ...BASE,
    { role: "Thêm", text: "Ampicilin hoặc amoxicilin tĩnh mạch – bao phủ Listeria.", dose: WHO_DOSE.ampicillin, administration: WHO_DOSE.ampicillinMax, grade: "S-VL", ref: WHO26 },
  ] },
  DEXA,
];
export const MEN_WHO_CRIT = {
  std: [{ text: "Nghi ngờ hoặc có khả năng viêm màng não vi khuẩn cấp, không có yếu tố nguy cơ Listeria.", source: WHO25, ref: "Executive summary" }],
  listeria: [{ text: "Có ít nhất một yếu tố nguy cơ Listeria: tuổi > 60, có thai, suy giảm miễn dịch (thuốc ức chế miễn dịch, ghép tạng, bệnh ác tính, HIV giai đoạn tiến triển, đái tháo đường, bệnh thận giai đoạn cuối, xơ gan, rối loạn sử dụng rượu).", source: WHO25, ref: "Executive summary" }],
  postop: [{ text: "Sau chấn thương, phẫu thuật thần kinh, dò dịch não tủy hoặc có dẫn lưu não thất: điều trị kinh nghiệm theo IDSA 2017 (viêm não thất, viêm màng não liên quan chăm sóc y tế).", source: IDSA17, ref: "Tunkel 2017" }],
} satisfies Record<string, StratCite[]>;

export const MEN_WHO_EXTRAS: { title: string; criteria?: string; blocks: StratIntl[] }[] = [
  { title: "Vùng có tỷ lệ cao phế cầu kháng penicilin hoặc cephalosporin thế hệ 3",
    criteria: "Ngưỡng do quốc gia hoặc địa phương xác định. Thêm vào phác đồ kinh nghiệm.",
    blocks: [{ source: `${WHO25} – thêm vào phác đồ khởi đầu, liều ${WHO26}`, items: [
      { role: "Thêm", text: "Vancomycin tĩnh mạch.", dose: WHO_DOSE.vancomycin, administration: WHO_DOSE.vancomycinMax, grade: "C-VL", ref: WHO26 },
      { role: "Thay thế", text: "Rifampicin thay vancomycin nơi gánh nặng lao thấp. Nơi gánh nặng lao cao chỉ dùng khi không có hoặc chống chỉ định vancomycin.", dose: WHO_DOSE.rifampicin, grade: "C-VL", ref: WHO26 },
    ] }] },
  { title: "Dị ứng beta-lactam",
    blocks: [{ source: `${WHO25} – lưu ý khi chọn thuốc`, items: [
      { role: "Lưu ý", text: "Đánh giá kỹ trước khi chọn thuốc: phần lớn dị ứng penicilin không nặng vẫn dùng được cephalosporin và ngược lại. Tiền sử phản ứng đe dọa tính mạng với beta-lactam: tránh mọi beta-lactam.", ref: WHO25 },
    ] }] },
];

/** Thời gian điều trị theo tác nhân (WHO 2026, Bảng 10) – luôn hiện ở phần nguyên tắc. */
export const MEN_WHO_DURATION: [string, string][] = [
  ["S. pneumoniae", "10–14 ngày"],
  ["N. meningitidis", "5–7 ngày"],
  ["H. influenzae", "7–10 ngày"],
  ["S. agalactiae", "14–21 ngày"],
  ["L. monocytogenes", "21 ngày"],
  ["E. coli và trực khuẩn Gram âm khác", "14–21 ngày"],
];
export const MEN_WHO_PRINCIPLES: StratIntl = {
  source: `${WHO25}, ${WHO26} – thời gian điều trị, đường dùng`,
  items: [
    ...MEN_WHO_DURATION.map(([who, days]) => ({ role: `Thời gian – ${who}`, text: days, ref: WHO26 })),
    { role: "Thời gian – không rõ tác nhân", text: "Ngoài dịch: có thể ngừng kháng sinh kinh nghiệm sau 7 ngày nếu đã hồi phục lâm sàng ≥ 48 giờ (hết sốt, sinh hiệu bình thường, hết rối loạn ý thức). Không hồi phục sau 1 tuần: kéo dài điều trị và chọc dò lại.", grade: "C-VL", ref: WHO25 },
    { role: "Đường dùng", text: "Dùng đường tĩnh mạch, tránh kháng sinh uống (nồng độ dịch não tủy thấp hơn đáng kể). Dùng liều tĩnh mạch tối đa suốt đợt điều trị, thường cao hơn liều cho nhiễm khuẩn khác; ưu tiên thuốc diệt khuẩn.", ref: WHO25 },
  ],
};

/* ---------------- Viêm não thất, viêm màng não liên quan chăm sóc y tế (IDSA 2017) ---------------- */
export const VENT_CRIT = {
  empiric: [{ text: "Nghi viêm não thất, viêm màng não liên quan chăm sóc y tế: sau phẫu thuật thần kinh, chấn thương, có shunt hoặc dẫn lưu dịch não tủy.", source: IDSA17, ref: "Tunkel 2017" }],
  allergy: [{ text: "Phản vệ với beta-lactam, chống chỉ định meropenem.", source: IDSA17, ref: "KC 39" }],
} satisfies Record<string, StratCite[]>;

const VENT_DOSE = "Liều: tra tab Việt Nam (QĐ 708) hoặc hướng dẫn liều BV199.";
export const VENT_EMPIRIC: StratIntl[] = [{
  source: `${IDSA17} – kháng sinh kinh nghiệm`,
  lead: VENT_DOSE + " Chọn beta-lactam kháng Pseudomonas theo tính nhạy cảm tại chỗ. Đã định cư hoặc nhiễm vi khuẩn kháng thuốc cao ở vị trí khác: điều chỉnh phác đồ để điều trị tác nhân đó (KC 40, mạnh · thấp).",
  items: [
    { role: "Phối hợp", text: "Vancomycin. Người bệnh nặng dùng liều ngắt quãng: duy trì nồng độ đáy 15–20 µg/mL (KC 38).", grade: "S-L", ref: IDSA17 },
    { role: "Chọn một", text: "Cefepim", grade: "S-L", ref: IDSA17 },
    { role: "Chọn một", text: "Ceftazidim", grade: "S-L", ref: IDSA17 },
    { role: "Chọn một", text: "Meropenem", grade: "S-L", ref: IDSA17 },
  ],
}];
export const VENT_ALLERGY: StratIntl[] = [{
  source: `${IDSA17} – phản vệ với beta-lactam`,
  lead: VENT_DOSE,
  items: [
    { role: "Phối hợp", text: "Vancomycin", grade: "S-L", ref: IDSA17 },
    { role: "Chọn một", text: "Aztreonam – phủ Gram âm", grade: "S-L", ref: IDSA17 },
    { role: "Chọn một", text: "Ciprofloxacin – phủ Gram âm", grade: "S-L", ref: IDSA17 },
  ],
}];

export const VENT_SAMPLING: StratCite[] = [
  { text: "Cấy dịch não tủy và cấy máu trước kháng sinh khi có thể; cấy âm tính sau khi đã dùng kháng sinh không loại trừ nhiễm khuẩn.", source: IDSA17, ref: "KC 23" },
  { text: "Cấy dịch não tủy là xét nghiệm quan trọng nhất để chẩn đoán; nhuộm Gram âm tính không loại trừ nhiễm khuẩn.", source: IDSA17, ref: "KC 15–16" },
  { text: "Nghi nhiễm shunt hoặc dẫn lưu mà cấy ban đầu âm tính: giữ cấy ít nhất 10 ngày để phát hiện P. acnes.", source: IDSA17, ref: "KC 17" },
  { text: "Rút shunt hoặc dẫn lưu vì nghi nhiễm khuẩn: cấy các bộ phận của dụng cụ. Nghi nhiễm shunt não thất – nhĩ: cấy máu.", source: IDSA17, ref: "KC 18, 20" },
];

const it = (role: string, text: string, grade: string) => ({ role, text, grade, ref: IDSA17 });
export const VENT_EXTRAS: { title: string; criteria?: string; blocks: StratIntl[] }[] = [
  { title: "Điều trị theo tác nhân", criteria: "Khi có kết quả cấy và kháng sinh đồ.", blocks: [{ source: `${IDSA17} – điều trị đích`, items: [
    it("MSSA", "Nafcilin hoặc oxacilin. Không dùng được beta-lactam: giải mẫn cảm hoặc vancomycin (yếu · TB).", "S-M"),
    it("MRSA", "Vancomycin; cân nhắc thuốc khác nếu MIC vancomycin ≥ 1 µg/mL.", "S-M"),
    it("Tụ cầu không sinh coagulase", "Như tụ cầu vàng, theo kháng sinh đồ.", "S-M"),
    it("Rifampicin", "Phối hợp khi có dụng cụ trong sọ hoặc cột sống (shunt, dẫn lưu) và chủng còn nhạy.", "S-L"),
    it("Không dùng được beta-lactam và vancomycin", "Linezolid, daptomycin hoặc trimethoprim-sulfamethoxazol theo kháng sinh đồ.", "S-L"),
    it("P. acnes", "Penicilin G.", "S-M"),
    it("Trực khuẩn Gram âm", "Theo kháng sinh đồ, chọn thuốc thấm tốt vào thần kinh trung ương. Nhạy cephalosporin thế hệ 3: ceftriaxon hoặc cefotaxim.", "S-M"),
    it("Pseudomonas", "Cefepim, ceftazidim hoặc meropenem. Thay thế: aztreonam hoặc fluoroquinolon còn nhạy.", "S-M"),
    it("Trực khuẩn Gram âm sinh ESBL", "Meropenem nếu chủng còn nhạy.", "S-M"),
    it("Acinetobacter", "Meropenem. Kháng carbapenem: colistimethat hoặc polymyxin B, dùng cả tĩnh mạch và trong não thất.", "S-M"),
    it("Gram âm kháng thuốc", "Có thể truyền kéo dài meropenem (3 giờ).", "W-L"),
    it("Candida", "Amphotericin B liposome, thường phối hợp 5-flucytosin; chuyển fluconazol khi cải thiện và chủng còn nhạy (yếu · thấp).", "S-M"),
    it("Aspergillus, Exserohilum", "Voriconazol.", "S-L"),
  ] }] },
  { title: "Xử trí shunt, dẫn lưu và đặt lại shunt", blocks: [{ source: `${IDSA17} – kiểm soát ổ nhiễm`, items: [
    it("Shunt nhiễm khuẩn", "Rút toàn bộ shunt, thay bằng dẫn lưu não thất ra ngoài, kèm kháng sinh tĩnh mạch.", "S-M"),
    it("Dẫn lưu, bơm tiêm trong vỏ, điện cực kích thích não sâu nhiễm khuẩn", "Rút bỏ dụng cụ.", "S-M"),
    it("Đặt lại – tụ cầu không sinh coagulase, P. acnes, dịch não tủy bình thường", "Cấy âm tính 48 giờ sau khi đưa dẫn lưu ra ngoài: đặt lại sớm nhất ngày thứ 3 sau khi rút.", "S-L"),
    it("Đặt lại – tụ cầu không sinh coagulase, P. acnes, dịch não tủy bất thường", "Cấy lại âm tính: đặt lại sau 7 ngày điều trị. Cấy lại dương tính: điều trị đến khi cấy âm tính 7–10 ngày liên tiếp.", "S-L"),
    it("Đặt lại – tụ cầu vàng, trực khuẩn Gram âm", "Đặt lại 10 ngày sau khi cấy dịch não tủy âm tính.", "S-L"),
    it("Trước khi đặt lại", "Không khuyến cáo ngừng kháng sinh một thời gian để xác nhận sạch khuẩn.", "S-L"),
  ] }] },
  { title: "Kháng sinh dùng trong não thất", blocks: [{ source: `${IDSA17} – dùng trong não thất`, items: [
    it("Chỉ định", "Cân nhắc khi đáp ứng kém với kháng sinh toàn thân đơn thuần.", "S-L"),
    it("Kỹ thuật", "Tiêm qua dẫn lưu não thất: kẹp dẫn lưu 15–60 phút để thuốc cân bằng trong dịch não tủy.", "S-L"),
    it("Liều và khoảng cách", "Điều chỉnh để nồng độ dịch não tủy đạt 10–20 lần MIC, theo kích thước não thất và lượng dịch dẫn lưu mỗi ngày.", "S-L"),
  ] }] },
  { title: "Theo dõi đáp ứng điều trị", blocks: [{ source: `${IDSA17} – theo dõi`, items: [
    it("Lâm sàng", "Theo dõi đáp ứng điều trị dựa trên các thông số lâm sàng.", "S-L"),
    it("Có dẫn lưu ra ngoài", "Theo dõi cấy dịch não tủy để bảo đảm cấy trở về âm tính.", "S-L"),
    it("Không cải thiện rõ", "Xét nghiệm lại dịch não tủy để xác nhận các chỉ số cải thiện và cấy âm tính.", "S-L"),
    it("Dẫn lưu không dùng để điều trị nhiễm shunt", "Không cấy và xét nghiệm dịch não tủy hằng ngày trừ khi có chỉ định lâm sàng.", "S-L"),
    it("Chẩn đoán hình ảnh", "Chụp hình ảnh thần kinh khi nghi nhiễm khuẩn; ưu tiên MRI có tiêm gadolinium và chuỗi khuếch tán. Shunt não thất – ổ bụng nhiễm khuẩn kèm đau bụng: siêu âm hoặc CT bụng tìm ổ dịch khu trú ở đầu shunt.", "S-M"),
  ] }] },
  { title: "Vỡ nền sọ có rò dịch não tủy", blocks: [{ source: `${IDSA17} – dự phòng`, items: [
    it("Kháng sinh dự phòng", "Không khuyến cáo dùng kháng sinh dự phòng.", "S-M"),
    it("Rò kéo dài > 7 ngày", "Khuyến cáo can thiệp sửa chỗ rò.", "S-L"),
    it("Vắc xin", "Khuyến cáo tiêm vắc xin phế cầu.", "S-M"),
  ] }] },
];

export const VENT_PRINCIPLES: StratIntl = {
  source: `${IDSA17} – thời gian điều trị`,
  items: [
    it("Thời gian – tụ cầu không sinh coagulase, P. acnes, ít bất thường", "10 ngày khi không hoặc ít tăng tế bào, glucose dịch não tủy bình thường, ít triệu chứng.", "S-L"),
    it("Thời gian – tụ cầu không sinh coagulase, P. acnes, bất thường rõ", "10–14 ngày khi tăng tế bào rõ, glucose dịch não tủy thấp, hoặc có biểu hiện lâm sàng, toàn thân.", "S-L"),
    it("Thời gian – tụ cầu vàng, trực khuẩn Gram âm", "10–14 ngày; một số chuyên gia đề nghị 21 ngày với trực khuẩn Gram âm (yếu · thấp).", "S-L"),
    it("Thời gian – cấy dương tính kéo dài", "Tiếp tục 10–14 ngày kể từ lần cấy dương tính cuối cùng.", "S-L"),
  ],
};

export const CNS_SOURCES = {
  who: [
    "World Health Organization. Guidelines on meningitis diagnosis, treatment and care. Geneva: WHO; 2025.",
    "World Health Organization. Practical manual on meningitis diagnosis, treatment and care. Geneva: WHO; 2026.",
  ],
  idsa: "Tunkel AR và cs. 2017 Infectious Diseases Society of America's Clinical Practice Guidelines for Healthcare-Associated Ventriculitis and Meningitis. Clin Infect Dis 2017;64(6):e34–e65; tóm tắt khuyến cáo: Clin Infect Dis 2017;64(6):701–706.",
};
