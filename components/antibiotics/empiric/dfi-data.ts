/*
  Nhiễm trùng bàn chân đái tháo đường – dữ liệu bảng gọn cho 2 tab.
  VN: QĐ 1530/QĐ-BYT (24/03/2023) – mục 3.4 (tr. 19), 5.2.1 (tr. 24), Phụ lục 02 (tr. 32–33). Đối chiếu bản PDF ký số kcb.vn.
  Quốc tế: IWGDF/IDSA 2023 (Senneville É và cs.) – Bảng 1, 4 (trích Lipsky 2012), 5; khuyến cáo 2, 5, 7–25.
  Không nguồn nào nêu liều: BYT không ghi liều; IWGDF: "usual recommended doses for serious infections",
  viêm xương ở mức cao của khoảng liều. Không tự điền liều.
  Mức GRADE: S/C = mạnh/có điều kiện; H/M/L = cao/TB/thấp; GPS = thực hành tốt. ref = vị trí trong nguồn (không hiển thị).
*/
import type { Stratification, StratIntl } from "@/data/antibiotics/empiric/stratification";
export type DfiRow = { factor: string; bugs: string; rx: string[]; lead?: string };
export type DfiGroup = { label: string; sub: string; rows: DfiRow[] };
export type DfiPoint = { k: string; t: string; g?: string; ref: string };

const BL1 = "amoxicilin-acid clavulanic, ampicilin-sulbactam";
const BL2 = "ticarcilin-acid clavulanic, piperacilin-tazobactam";

/* ===== QĐ 1530/QĐ-BYT, Phụ lục 02 (tr. 32–33) ===== */
export const BYT_GROUPS: DfiGroup[] = [
  { label: "Nhẹ", sub: "Wagner độ 1 hoặc PEDIS giai đoạn 1–2", rows: [
    { factor: "Không có yếu tố phức tạp", bugs: "Cầu khuẩn Gram (+)", rx: ["Penicilin bán tổng hợp kháng penicilinase", "Cephalosporin thế hệ 1"] },
    { factor: "Dị ứng hoặc không dung nạp beta-lactam", bugs: "Cầu khuẩn Gram (+)", rx: ["Clindamycin", "Fluoroquinolon (levofloxacin, moxifloxacin)", "Macrolid", "Doxycyclin"] },
    { factor: "Dùng kháng sinh gần đây", bugs: "Cầu khuẩn Gram (+) + trực khuẩn Gram (−)", rx: [`Beta-lactam nhóm 1: ${BL1}`, "Trimethoprim-sulfamethoxazol", "Fluoroquinolon (levofloxacin, moxifloxacin)"] },
    { factor: "Nguy cơ cao MRSA", bugs: "MRSA", rx: ["Linezolid", "Trimethoprim-sulfamethoxazol", "Doxycyclin", "Macrolid"] },
  ] },
  { label: "Trung bình hoặc nặng", sub: "Wagner độ ≥ 2 hoặc PEDIS giai đoạn ≥ 3", rows: [
    { factor: "Không có yếu tố phức tạp", bugs: "Cầu khuẩn Gram (+) ± trực khuẩn Gram (−)", rx: [`Beta-lactam nhóm 1: ${BL1}`, "Cephalosporin thế hệ 2 hoặc 3"] },
    { factor: "Dùng kháng sinh gần đây", bugs: "Cầu khuẩn Gram (+) ± trực khuẩn Gram (−)", rx: [`Beta-lactam nhóm 2: ${BL2}`, "Cephalosporin thế hệ 3", "Carbapenem nhóm 1 (tùy điều trị trước đó, hoặc tham khảo thêm ý kiến)"] },
    { factor: "Loét ẩm ướt, khí hậu ấm", bugs: "Trực khuẩn Gram (−), gồm Pseudomonas", rx: [`Beta-lactam nhóm 2: ${BL2}`, "Penicilin bán tổng hợp kháng penicilinase + ceftazidim", "Penicilin bán tổng hợp kháng penicilinase + fluoroquinolon kháng Pseudomonas (ciprofloxacin)", "Carbapenem nhóm 2"] },
    { factor: "Chi thiếu máu cục bộ, hoại tử, sinh hơi", bugs: "Cầu khuẩn Gram (+) ± trực khuẩn Gram (−) ± kỵ khí", rx: ["Beta-lactam nhóm 1 hoặc 2", "Carbapenem nhóm 1 hoặc 2", "Cephalosporin thế hệ 2 hoặc 3 + clindamycin hoặc metronidazol"] },
    { factor: "Yếu tố nguy cơ MRSA", bugs: "MRSA", lead: "Thêm vào hoặc thay bằng:", rx: ["Glycopeptid", "Linezolid", "Daptomycin", "Acid fusidic", "Trimethoprim-sulfamethoxazol (± rifampicin*)", "Doxycyclin"] },
    { factor: "Nguy cơ trực khuẩn Gram (−) kháng thuốc", bugs: "Vi khuẩn sinh ESBL", rx: ["Carbapenem", "Fluoroquinolon (levofloxacin, moxifloxacin)", "Aminoglycosid và colistin"] },
  ] },
];
export const BYT_FOOT = [
  "* Rifampicin: nguy cơ tác dụng phụ cao hơn, bị hạn chế ở một số quốc gia; thích hợp nhất cho viêm tủy xương hoặc nhiễm trùng liên quan đến cấy ghép kim loại.",
];
export const BYT_POINTS: DfiPoint[] = [
  { k: "Khởi trị", t: "Theo kinh nghiệm, tránh phổ rộng không cần thiết; điều chỉnh theo đáp ứng lâm sàng hoặc kháng sinh đồ.", ref: "tr. 24" },
  { k: "Đường dùng", t: "Tiêm cho mọi nhiễm trùng nặng và một số nhiễm trùng vừa. Chuyển uống khi đã kiểm soát nhiễm trùng và có kết quả cấy.", ref: "tr. 24" },
  { k: "MRSA", t: "Chọn thuốc có hiệu quả trên MRSA khi: tiền sử nhiễm MRSA, tỷ lệ cấy MRSA cao hoặc nhiễm trùng nặng.", ref: "tr. 24" },
  { k: "Thời gian", t: "Mô mềm thường 2–4 tuần; không cần dùng đến khi loét lành hẳn.", ref: "tr. 24" },
  { k: "Cấy", t: "Mô mềm (xương nếu nghi viêm tủy xương) hoặc chọc hút mủ; không lấy gạc bề mặt. Không đáp ứng: cấy lại.", ref: "tr. 19, 24" },
  { k: "Ổ nhiễm", t: "Cắt lọc cơ học thường xuyên, lặp lại.", ref: "tr. 24" },
];
export const BYT_LEGEND = `Beta-lactam nhóm 1: ${BL1}. Nhóm 2: ${BL2}.`;

/* ===== IWGDF/IDSA 2023 ===== */
export const IWGDF_GRADES: { g: string; t: string }[] = [
  { g: "1 – Không nhiễm trùng", t: "Không có triệu chứng, dấu hiệu tại chỗ hay toàn thân." },
  { g: "2 – Nhẹ", t: "≥ 2 dấu hiệu: sưng/chai cứng, ban đỏ > 0,5 đến < 2 cm, đau, nóng, chảy mủ; không do nguyên nhân viêm khác." },
  { g: "3 – Vừa", t: "Không biểu hiện toàn thân; ban đỏ ≥ 2 cm hoặc tổn thương sâu hơn mô dưới da (gân, cơ, khớp, xương)." },
  { g: "4 – Nặng", t: "Kèm ≥ 2 tiêu chuẩn SIRS (nhiệt độ > 38 hoặc < 36 °C; tim > 90/phút; thở > 20/phút hoặc PaCO₂ < 32 mmHg; bạch cầu > 12.000 hoặc < 4.000/mm³ hoặc > 10% non)." },
];
export const IWGDF_GRADE_NOTE = "Viêm xương: thêm “(O)” sau độ 3 hoặc 4.";

export const IWGDF_GROUPS: DfiGroup[] = [
  { label: "Nhẹ (độ 2)", sub: "Đường uống", rows: [
    { factor: "Không có yếu tố phức tạp", bugs: "Cầu khuẩn Gram (+)", rx: ["Penicilin bán tổng hợp kháng penicilinase (cloxacilin)", "Cephalosporin thế hệ 1 (cefalexin)"] },
    { factor: "Dị ứng hoặc không dung nạp beta-lactam", bugs: "Cầu khuẩn Gram (+)", rx: ["Clindamycin", "Fluoroquinolon (levofloxacin, moxifloxacin)", "Trimethoprim-sulfamethoxazol", "Doxycyclin"] },
    { factor: "Dùng kháng sinh gần đây", bugs: "Cầu khuẩn Gram (+) + trực khuẩn Gram (−)", rx: [`Beta-lactam/ức chế beta-lactamase nhóm 1: ${BL1}`, "Fluoroquinolon (levofloxacin, moxifloxacin)", "Trimethoprim-sulfamethoxazol"] },
    { factor: "Nguy cơ cao MRSA (tiền sử nhiễm hoặc mang MRSA)", bugs: "MRSA", rx: ["Linezolid", "Trimethoprim-sulfamethoxazol", "Clindamycin", "Doxycyclin", "Fluoroquinolon (levofloxacin, moxifloxacin)"] },
  ] },
  { label: "Vừa hoặc nặng (độ 3–4)", sub: "Nặng: không dùng đường uống, trừ khi chuyển tiếp sau tiêm", rows: [
    { factor: "Không có yếu tố phức tạp", bugs: "Cầu khuẩn Gram (+) ± trực khuẩn Gram (−)", rx: [`Beta-lactam/ức chế beta-lactamase nhóm 1: ${BL1}`, "Cephalosporin thế hệ 2, 3 (cefuroxim, cefotaxim, ceftriaxon)"] },
    { factor: "Dùng kháng sinh gần đây", bugs: "Cầu khuẩn Gram (+) ± trực khuẩn Gram (−)", rx: [`Beta-lactam/ức chế beta-lactamase nhóm 2: ${BL2}`, "Cephalosporin thế hệ 2, 3 (cefuroxim, cefotaxim, ceftriaxon)", "Carbapenem nhóm 1 (ertapenem) – tùy điều trị trước; hỏi ý kiến chuyên gia"] },
    { factor: "Loét ngấm nước hoặc khí hậu nóng", bugs: "Trực khuẩn Gram (−), gồm Pseudomonas", rx: [`Beta-lactam/ức chế beta-lactamase nhóm 2: ${BL2}`, "Cloxacilin + ceftazidim hoặc ciprofloxacin", "Carbapenem nhóm 2 (meropenem, imipenem)"] },
    { factor: "Chi thiếu máu, hoại tử, sinh hơi", bugs: "Cầu khuẩn Gram (+) ± trực khuẩn Gram (−) ± kỵ khí bắt buộc", rx: ["Beta-lactam/ức chế beta-lactamase nhóm 1 hoặc 2", "Carbapenem nhóm 1 (ertapenem) hoặc 2 (meropenem, imipenem)", "Cephalosporin thế hệ 2 (cefuroxim) hoặc 3 (cefotaxim, ceftriaxon) + clindamycin hoặc metronidazol"] },
    { factor: "Yếu tố nguy cơ MRSA", bugs: "MRSA", lead: "Thêm vào hoặc thay bằng:", rx: ["Glycopeptid (vancomycin, teicoplanin)", "Linezolid", "Daptomycin", "Acid fusidic", "Trimethoprim-sulfamethoxazol", "Doxycyclin"] },
    { factor: "Nguy cơ trực khuẩn Gram (−) kháng thuốc", bugs: "ESBL", rx: ["Carbapenem (ertapenem, meropenem, imipenem)", "Fluoroquinolon (ciprofloxacin)", "Aminoglycosid (amikacin)", "Colistin"] },
  ] },
];
export const IWGDF_MRSA_RISK = "Yếu tố nguy cơ MRSA: nằm viện kéo dài, hồi sức tích cực, nhập viện hoặc dùng kháng sinh gần đây, thủ thuật xâm lấn, HIV, viện dưỡng lão, vết thương hở, lọc máu, ra viện còn catheter tĩnh mạch trung tâm.";

export const IWGDF_DURATION: { k: string; route: string; d: string }[] = [
  { k: "Mô mềm – nhẹ", route: "Uống", d: "1–2 tuần" },
  { k: "Mô mềm – vừa/nặng", route: "Uống hoặc tiêm TM ban đầu", d: "2–4 tuần" },
  { k: "Sau cắt lọc phẫu thuật (vừa/nặng)", route: "", d: "10 ngày" },
  { k: "Xương – đã cắt bỏ hết", route: "Uống hoặc tiêm TM ban đầu", d: "2–5 ngày" },
  { k: "Xương – đã cắt lọc (còn nhiễm mô mềm)", route: "Uống hoặc tiêm TM ban đầu", d: "1–2 tuần" },
  { k: "Xương – bờ cắt cấy/mô bệnh học (+)", route: "Uống hoặc tiêm TM ban đầu", d: "3 tuần" },
  { k: "Xương – không mổ hoặc còn xương chết", route: "Uống hoặc tiêm TM ban đầu", d: "6 tuần" },
];

export const IWGDF_POINTS: DfiPoint[] = [
  { k: "Không nhiễm trùng", t: "Không dùng kháng sinh toàn thân hay tại chỗ.", g: "GPS", ref: "Rec 11" },
  { k: "Nhẹ, chưa dùng kháng sinh", t: "Vùng ôn đới: chỉ nhắm cầu khuẩn Gram (+) hiếu khí.", g: "GPS", ref: "Rec 14" },
  { k: "Pseudomonas", t: "Chỉ nhắm theo kinh nghiệm khi: vùng nhiệt đới/cận nhiệt đới, nhiễm trùng vừa/nặng và đã phân lập P. aeruginosa tại vị trí nhiễm trong vài tuần trước.", g: "GPS", ref: "Rec 15" },
  { k: "Kéo dài", t: "Đến 3–4 tuần nếu cải thiện chậm, lan rộng hoặc bệnh động mạch ngoại biên nặng. Không khỏi sau 4 tuần: đánh giá lại.", g: "C-L", ref: "Rec 12c, 12d" },
  { k: "Nhập viện", t: "Nặng; vừa kèm bệnh lý quan trọng.", g: "C-L", ref: "Rec 2" },
  { k: "Ngoại khoa khẩn", t: "Nặng; vừa kèm hoại thư rộng, hoại tử, áp xe sâu dưới cân, chèn ép khoang, thiếu máu chi nặng. Có bệnh động mạch ngoại biên: hội chẩn thêm mạch máu.", g: "GPS", ref: "Rec 18, 20" },
  { k: "Phẫu thuật sớm", t: "Vừa/nặng: trong 24–48 giờ, kèm kháng sinh.", g: "C-L", ref: "Rec 19" },
  { k: "Cấy", t: "Mô (nạo hoặc sinh thiết) sau làm sạch, cắt lọc; nghi viêm xương: mẫu xương.", g: "C-M", ref: "Rec 5, 10" },
  { k: "Viêm xương không mổ", t: "Khi: bàn chân trước, không cần rạch dẫn lưu ngay, không bệnh động mạch ngoại biên, không lộ xương. Lui bệnh: đánh giá ≥ 6 tháng sau ngừng thuốc.", g: "C-L", ref: "Rec 22, 17" },
];
export const IWGDF_OSTEO_DX: DfiPoint[] = [
  { k: "Ban đầu", t: "Thăm dò chạm xương + X-quang + máu lắng hoặc CRP hoặc procalcitonin.", g: "C-L", ref: "Rec 7" },
  { k: "Còn nghi ngờ", t: "MRI.", g: "S-M", ref: "Rec 8" },
  { k: "Thay MRI", t: "PET, xạ hình bạch cầu đánh dấu hoặc SPECT.", g: "C-L", ref: "Rec 9" },
];
export const IWGDF_AVOID: DfiPoint[] = [
  { k: "Kháng sinh tại chỗ", t: "Miếng xốp, kem, xi măng kháng sinh kèm kháng sinh toàn thân.", g: "C-L", ref: "Rec 24" },
  { k: "Bổ trợ", t: "G-CSF, sát khuẩn tại chỗ, chế phẩm bạc, mật ong, phage, hút áp lực âm; oxy cao áp hoặc oxy tại chỗ chỉ để trị nhiễm trùng.", g: "C-L", ref: "Rec 23, 25" },
  { k: "Tigecyclin", t: "Kém hơn ertapenem trong thử nghiệm.", ref: "Rec 12 rationale" },
  { k: "Chưa đủ dữ liệu", t: "Rifampicin trong viêm xương; beta-lactam/ức chế beta-lactamase mới, dalbavancin, oritavancin.", ref: "Rec 16 note; Rec 12 rationale" },
];

/* ===== Khung phân tầng (bố cục BV ĐHYD) – dùng trong data/antibiotics/empiric/stratification.ts ===== */
const VN1530 = "QĐ 1530/QĐ-BYT";
const IW = "IWGDF/IDSA 2023";
const groupBlocks = (g: DfiGroup): StratIntl[] => g.rows.map((r) => ({
  source: r.factor,
  lead: `Tác nhân: ${r.bugs}.${r.factor.startsWith("Yếu tố nguy cơ MRSA") ? ` ${IWGDF_MRSA_RISK}` : ""}${r.lead ? ` ${r.lead}` : ""}`,
  items: r.rx.map((text, i) => ({ role: i === 0 ? "Chọn một" : "Hoặc", text, ref: "Table 4" })),
}));
const pts = (source: string, items: DfiPoint[]): StratIntl => ({ source, items: items.map((p) => ({ role: p.k, text: p.t, grade: p.g, ref: p.ref })) });

export const DFI_STRAT: Stratification = {
  diseaseIds: ["v9-1"],
  title: "Nhiễm trùng bàn chân đái tháo đường",
  lead: "Phân tầng theo mức độ và yếu tố làm nặng như QĐ 1530/QĐ-BYT; quốc tế theo IWGDF/IDSA 2023.",
  sampling: [
    { text: "Cấy mô mềm (xương khi nghi viêm tủy xương) hoặc chọc hút mủ; không lấy gạc bề mặt.", source: VN1530, ref: "tr. 19" },
    { text: "Không đáp ứng hoặc đáp ứng kém: cấy lại trong điều kiện tối ưu.", source: VN1530, ref: "tr. 24" },
    { text: "Mẫu mô (nạo hoặc sinh thiết) sau làm sạch, cắt lọc; nghi viêm xương: mẫu xương. Nuôi cấy thường quy, không dùng sinh học phân tử đầu tay.", source: IW, ref: "" },
  ],
  pathogens: [],
  columns: [
    { id: "vn-mild", label: "Nhẹ", tone: "community",
      criteria: [{ text: "Wagner độ 1 hoặc PEDIS giai đoạn 1–2.", source: VN1530, ref: "tr. 32" }],
      byt: ["r-dfi-mild-simple", "r-dfi-mild-recent-abx", "r-dfi-mild-allergy", "r-dfi-mild-mrsa"], intl: [] },
    { id: "vn-mod", label: "Trung bình hoặc nặng", tone: "hospital",
      criteria: [
        { text: "Wagner độ ≥ 2 hoặc PEDIS giai đoạn ≥ 3.", source: VN1530, ref: "tr. 32" },
        { text: "Tiêm cho mọi nhiễm trùng nặng và một số nhiễm trùng vừa.", source: VN1530, ref: "tr. 24" },
      ],
      byt: ["r-dfi-mod-simple", "r-dfi-mod-recent-abx", "r-dfi-mod-ischemic", "r-dfi-mod-pseudo", "r-dfi-mod-mrsa", "r-dfi-mod-esbl"], intl: [] },
    { id: "iw-mild", label: "Nhẹ (độ 2) – đường uống", tone: "community",
      criteria: [{ text: IWGDF_GRADES[1].t, source: IW, ref: "Table 1" }],
      byt: [], intl: groupBlocks(IWGDF_GROUPS[0]) },
    { id: "iw-mod", label: "Vừa hoặc nặng (độ 3–4)", tone: "hospital",
      criteria: [
        { text: `Độ 3: ${IWGDF_GRADES[2].t}`, source: IW, ref: "Table 1" },
        { text: `Độ 4: ${IWGDF_GRADES[3].t} Không dùng đường uống, trừ khi chuyển tiếp sau tiêm.`, source: IW, ref: "Table 1; Table 4 foot d" },
      ],
      byt: [], intl: groupBlocks(IWGDF_GROUPS[1]) },
  ],
  settingNote: "QĐ 1530 dùng chung phác đồ cho khoa hồi sức và không hồi sức.",
  severity: { title: "Nguyên tắc dùng kháng sinh", items: [
    ...BYT_POINTS.filter((p) => p.k !== "Cấy").map((p) => ({ text: `${p.k}: ${p.t}`, source: VN1530, ref: p.ref })),
    { text: BYT_LEGEND, source: VN1530, ref: "tr. 32–33" },
    { text: BYT_FOOT[0].replace(/^\* /, ""), source: VN1530, ref: "tr. 33" },
  ] },
  extras: [
    { title: "Thời gian điều trị", blocks: [], table: { cols: ["Đường dùng", "Thời gian"], rows: IWGDF_DURATION.map((d) => ({ label: d.k, cells: [d.route || "—", d.d] })) } },
    { title: "Nhập viện, ngoại khoa, viêm xương", blocks: [pts(IW, IWGDF_POINTS.filter((p) => ["Nhập viện", "Ngoại khoa khẩn", "Phẫu thuật sớm", "Viêm xương không mổ"].includes(p.k))), pts(`${IW} – chẩn đoán viêm xương`, IWGDF_OSTEO_DX)] },
    { title: "Không khuyến cáo", blocks: [pts(IW, IWGDF_AVOID)] },
  ],
  principles: { ...pts(IW, IWGDF_POINTS.filter((p) => ["Không nhiễm trùng", "Nhẹ, chưa dùng kháng sinh", "Pseudomonas", "Kéo dài"].includes(p.k))), lead: "Liều thông thường cho nhiễm trùng nặng; viêm xương: mức cao của khoảng liều. Chỉnh khi suy thận, suy gan, béo phì." },
  antibiogram: {
    gramNegative: { organisms: ["Escherichia coli", "Klebsiella pneumoniae", "Pseudomonas aeruginosa"], codes: ["AMC", "CRO", "TZP", "MEM", "CIP"] },
    gramPositive: { organisms: ["Staphylococcus aureus", "Streptococcus spp."], codes: ["FOX", "PEN", "ERY", "CLI", "SXT", "DOX", "VAN", "LZD"] },
    defaultScope: "toan-vien",
    note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; bảng không tách riêng mẫu bàn chân, chỉ dùng để định hướng.",
  },
  sources: [
    "Bộ Y tế. QĐ 1530/QĐ-BYT ngày 24/3/2023 – Hướng dẫn chẩn đoán và điều trị loét bàn chân do đái tháo đường.",
    "Senneville É và cs. IWGDF/IDSA Guidelines on the Diagnosis and Treatment of Diabetes-related Foot Infections (IWGDF/IDSA 2023). Clin Infect Dis 2023 (doi:10.1093/cid/ciad527); Diabetes Metab Res Rev 2024;40(3):e3687.",
  ],
};
