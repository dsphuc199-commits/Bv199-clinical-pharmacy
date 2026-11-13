/*
  Viem phoi – du lieu cong cu chon khang sinh theo nguon quoc te (nguoi lon, mien dich binh thuong).
  - VPCD: ATS/IDSA 2019 (Metlay JP et al. Am J Respir Crit Care Med 2019;200:e45–e67), Bang 1, 3, 4; Q1–Q16.
    Bo sung thuc hanh: IDSA CAP Clinical Pathway (dau ‡ trong ban goc) -> grade "PW".
  - VPBV/VPLQTM: IDSA/ATS 2016 (Kalil AC et al. Clin Infect Dis 2016;63:e61–e111), Bang 2–4; muc I–XXV.
  - Dieu tri dich vi khuan Gram am khang thuoc: IDSA 2026 AMR Guidance (Tamma PD et al. Clin Infect Dis 2026, ciag481),
    Bang 1 (lieu nguoi lon, chuc nang than – gan binh thuong). Khong GRADE -> grade "AMR".
  - Ma GRADE: "S-H|M|L|VL" manh; "C-…" co dieu kien (de nghi). ref: vi tri trong van ban, khong hien thi.
  - al: "std" = beta-lactam (an khi di ung beta-lactam); "alt" = chi hien khi di ung.
*/
import type { RxItem } from "./septic-arthritis-pids2023";

/* ======================= VIEM PHOI CONG DONG ======================= */
export const CAP_MAJOR = [
  "Sốc nhiễm khuẩn cần thuốc vận mạch",
  "Suy hô hấp cần thông khí cơ học",
] as const;
export const CAP_MINOR = [
  "Nhịp thở ≥ 30 lần/phút",
  "PaO₂/FiO₂ ≤ 250",
  "Thâm nhiễm nhiều thùy",
  "Lú lẫn, mất định hướng",
  "Ure máu (BUN ≥ 20 mg/dL)",
  "Bạch cầu < 4.000/µL (do nhiễm khuẩn, không do hóa trị)",
  "Tiểu cầu < 100.000/µL",
  "Hạ thân nhiệt (nhiệt độ trung tâm < 36 °C)",
  "Hạ huyết áp cần bù dịch tích cực",
] as const;

/* Phac do = khoi co ten, muc khuyen cao, cac nhom thuoc (moi dong mot thuoc). */
export type Block = { title: string; items: RxItem[] };
export type Plan = { title: string; grade?: string; al?: "std" | "alt"; blocks: Block[]; note?: string };
const row = (role: string, text: string, dose: string, ref: string, extra: Partial<RxItem> = {}): RxItem => ({ role, text, dose, ref, ...extra });

const CAP_BL: RxItem[] = [
  row("Penicilin + ức chế beta-lactamase", "Ampicilin-sulbactam", "1,5–3 g TM mỗi 6 giờ", "Q9.1", { al: "std" }),
  row("Cephalosporin", "Ceftriaxon", "1–2 g TM mỗi 24 giờ", "Q9.1", { al: "std" }),
  row("Cephalosporin", "Cefotaxim", "1–2 g TM mỗi 8 giờ", "Q9.1", { al: "std" }),
  row("Cephalosporin", "Ceftarolin", "600 mg TM mỗi 12 giờ", "Q9.1", { al: "std" }),
];
const CAP_MAC: RxItem[] = [
  row("Macrolid", "Azithromycin", "500 mg mỗi 24 giờ", "Q9.1"),
  row("Macrolid", "Clarithromycin", "500 mg × 2 lần/ngày", "Q9.1"),
];
const CAP_FQ: RxItem[] = [
  row("Fluoroquinolon hô hấp", "Levofloxacin", "750 mg mỗi 24 giờ", "Q9.1"),
  row("Fluoroquinolon hô hấp", "Moxifloxacin", "400 mg mỗi 24 giờ", "Q9.1"),
];
export const CAP_MRSA_ROWS: RxItem[] = [
  row("Glycopeptid", "Vancomycin", "15 mg/kg mỗi 12 giờ, chỉnh liều theo nồng độ", "Q11"),
  row("Oxazolidinon", "Linezolid", "600 mg mỗi 12 giờ", "Q11"),
];
export const CAP_PA_ROWS: RxItem[] = [
  row("Penicilin kháng Pseudomonas", "Piperacilin-tazobactam", "4,5 g mỗi 6 giờ", "Q11", { al: "std" }),
  row("Cephalosporin", "Cefepim", "2 g mỗi 8 giờ", "Q11", { al: "std" }),
  row("Cephalosporin", "Ceftazidim", "2 g mỗi 8 giờ", "Q11", { al: "std" }),
  row("Monobactam", "Aztreonam", "2 g mỗi 8 giờ", "Q11"),
  row("Carbapenem", "Meropenem", "1 g mỗi 8 giờ", "Q11", { al: "std" }),
  row("Carbapenem", "Imipenem", "500 mg mỗi 6 giờ", "Q11", { al: "std" }),
];

export type CapIn = {
  setting: "out" | "in";
  severe: boolean;
  comorb: boolean;
  macLow: boolean;
  mrsaPrior: boolean;
  paPrior: boolean;
  recentHosp: boolean;
  localMrsa: boolean;
  localPa: boolean;
  nasalPcr: boolean;
  noMacFq: boolean;
};
export type CapOut = { headline: string; plans: Plan[]; mrsa?: Plan; pa?: Plan; notes: string[] };

export function capPlans(i: CapIn): CapOut {
  const notes: string[] = [];
  const plans: Plan[] = [];
  let headline = "";
  if (i.setting === "out") {
    if (!i.comorb) {
      headline = "Đơn trị bằng một kháng sinh uống.";
      plans.push({ title: "Đơn trị – chọn một", blocks: [{ title: "", items: [
        row("Aminopenicilin", "Amoxicilin", "1 g × 3 lần/ngày", "Q8.1", { grade: "S-M", al: "std" }),
        row("Tetracyclin", "Doxycyclin", "100 mg × 2 lần/ngày", "Q8.1", { grade: "C-L" }),
        ...(i.macLow ? [
          row("Macrolid", "Azithromycin", "500 mg ngày 1, sau đó 250 mg/ngày", "Q8.1", { grade: "C-M" }),
          row("Macrolid", "Clarithromycin", "500 mg × 2 lần/ngày, hoặc dạng phóng thích kéo dài 1.000 mg/ngày", "Q8.1", { grade: "C-M" }),
        ] : []),
      ] }] });
      notes.push(i.macLow ? "Macrolid đơn trị chỉ dùng khi tỷ lệ phế cầu kháng macrolid tại chỗ dưới 25%." : "Không dùng macrolid đơn trị khi tỷ lệ phế cầu kháng macrolid tại chỗ từ 25% trở lên hoặc chưa rõ.");
      notes.push("Doxycyclin: một số chuyên gia dùng liều đầu 200 mg.");
    } else {
      headline = "Phối hợp beta-lactam với macrolid hoặc doxycyclin, hoặc đơn trị fluoroquinolon hô hấp.";
      plans.push({ title: "Phác đồ 1 – Beta-lactam + macrolid hoặc doxycyclin", grade: "S-M", al: "std", blocks: [
        { title: "Beta-lactam – chọn một", items: [
          row("Penicilin + ức chế beta-lactamase", "Amoxicilin-acid clavulanic", "500/125 mg × 3 lần/ngày; 875/125 mg × 2 lần/ngày; hoặc 2.000/125 mg × 2 lần/ngày", "Q8.2", { al: "std" }),
          row("Cephalosporin", "Cefpodoxim", "200 mg × 2 lần/ngày", "Q8.2", { al: "std" }),
          row("Cephalosporin", "Cefuroxim", "500 mg × 2 lần/ngày", "Q8.2", { al: "std" }),
        ] },
        { title: "Kèm – chọn một", items: [
          row("Macrolid", "Azithromycin", "500 mg ngày 1, sau đó 250 mg/ngày", "Q8.2", { grade: "S-M" }),
          row("Macrolid", "Clarithromycin", "500 mg × 2 lần/ngày, hoặc dạng phóng thích kéo dài 1.000 mg/ngày", "Q8.2", { grade: "S-M" }),
          row("Tetracyclin", "Doxycyclin", "100 mg × 2 lần/ngày", "Q8.2", { grade: "C-L" }),
        ] },
      ] });
      plans.push({ title: "Phác đồ 2 – Đơn trị fluoroquinolon hô hấp", grade: "S-M", blocks: [{ title: "Chọn một", items: [
        row("Fluoroquinolon hô hấp", "Levofloxacin", "750 mg/ngày", "Q8.2"),
        row("Fluoroquinolon hô hấp", "Moxifloxacin", "400 mg/ngày", "Q8.2"),
        row("Fluoroquinolon hô hấp", "Gemifloxacin", "320 mg/ngày", "Q8.2"),
      ] }] });
    }
    notes.push("Người bệnh mới dùng một nhóm kháng sinh: chọn nhóm khác.");
    return { headline, plans, notes };
  }
  if (!i.severe) {
    headline = "Viêm phổi không nặng: beta-lactam + macrolid, hoặc đơn trị fluoroquinolon hô hấp.";
    plans.push({ title: "Phác đồ 1 – Beta-lactam + macrolid", grade: "S-H", al: "std", blocks: [{ title: "Beta-lactam – chọn một", items: CAP_BL }, { title: "Kèm macrolid – chọn một", items: CAP_MAC }] });
    plans.push({ title: "Phác đồ 2 – Đơn trị fluoroquinolon hô hấp", grade: "S-H", blocks: [{ title: "Chọn một", items: CAP_FQ }] });
    if (i.noMacFq) plans.push({ title: "Phác đồ 3 – Beta-lactam + doxycyclin (chống chỉ định cả macrolid và fluoroquinolon)", grade: "C-L", al: "std", blocks: [{ title: "Beta-lactam – chọn một", items: CAP_BL }, { title: "Kèm", items: [row("Tetracyclin", "Doxycyclin", "100 mg × 2 lần/ngày", "Q9.1")] }] });
    notes.push("Không dùng beta-lactam đơn trị thường quy cho người bệnh nội trú.");
  } else {
    headline = "Viêm phổi nặng: beta-lactam phối hợp macrolid (bằng chứng mạnh hơn) hoặc fluoroquinolon hô hấp.";
    plans.push({ title: "Phác đồ 1 – Beta-lactam + macrolid", grade: "S-M", al: "std", blocks: [{ title: "Beta-lactam – chọn một", items: CAP_BL }, { title: "Kèm macrolid – chọn một", items: CAP_MAC }] });
    plans.push({ title: "Phác đồ 2 – Beta-lactam + fluoroquinolon hô hấp", grade: "S-L", al: "std", blocks: [{ title: "Beta-lactam – chọn một", items: CAP_BL }, { title: "Kèm fluoroquinolon – chọn một", items: CAP_FQ }] });
    plans.push({ title: "Dị ứng beta-lactam – Levofloxacin ± aztreonam ± thuốc chống MRSA", grade: "PW", al: "alt", blocks: [{ title: "", items: [
      row("Fluoroquinolon hô hấp", "Levofloxacin", "750 mg mỗi 24 giờ", "Pathway"),
      row("Monobactam (± khi cần phủ Gram âm)", "Aztreonam", "2 g mỗi 8 giờ", "Pathway"),
    ] }] });
    notes.push("Viêm phổi nặng: không dùng fluoroquinolon đơn trị hoặc beta-lactam + doxycyclin làm phác đồ kinh nghiệm.");
  }
  let mrsa: Plan | undefined;
  let pa: Plan | undefined;
  if (i.mrsaPrior || (i.recentHosp && i.localMrsa)) {
    if (i.mrsaPrior || i.severe) mrsa = { title: "Thêm thuốc chống MRSA", grade: "S-M", blocks: [{ title: "Chọn một", items: CAP_MRSA_ROWS }], note: "Cấy đờm, cấy máu và PCR MRSA ngoáy mũi; ngừng thuốc chống MRSA sau 48 giờ nếu âm tính và lâm sàng cải thiện." };
    else if (i.nasalPcr) mrsa = { title: "Theo PCR MRSA ngoáy mũi", grade: "S-M", blocks: [{ title: "Chỉ thêm khi PCR dương tính – chọn một", items: CAP_MRSA_ROWS }], note: "PCR âm tính: không dùng thuốc chống MRSA. PCR dương tính: thêm thuốc và cấy để xác nhận." };
    else mrsa = { title: "Chưa phủ MRSA – cấy đờm, cấy máu", grade: "S-M", blocks: [], note: "Chỉ thêm vancomycin hoặc linezolid khi cấy dương tính MRSA." };
  }
  if (i.paPrior || (i.recentHosp && i.localPa)) {
    if (i.paPrior || i.severe) pa = { title: "Thay beta-lactam bằng beta-lactam kháng Pseudomonas", grade: "S-M", blocks: [{ title: "Chọn một (giữ macrolid hoặc fluoroquinolon)", items: CAP_PA_ROWS }], note: "Cấy trước điều trị; quay về phác đồ chuẩn sau 48 giờ nếu cấy âm tính và lâm sàng cải thiện." };
    else pa = { title: "Chưa phủ P. aeruginosa – cấy đờm, cấy máu", grade: "S-M", blocks: [], note: "Chỉ dùng beta-lactam kháng Pseudomonas khi cấy dương tính." };
  }
  if (mrsa || pa) notes.push("Không dùng khái niệm viêm phổi liên quan chăm sóc y tế (HCAP) để quyết định phổ rộng. Phác đồ phủ P. aeruginosa không nhằm Enterobacterales sinh ESBL.");
  return { headline, plans, mrsa, pa, notes };
}

export const CAP_DIAG: RxItem[] = [
  { role: "Nơi điều trị", text: "Dùng thang điểm tiên lượng kèm đánh giá lâm sàng: ưu tiên PSI (Mạnh · TB) hơn CURB-65 (Có ĐK · thấp).", grade: "S-M", ref: "Q6" },
  { role: "Vào ICU trực tiếp", text: "Tụt huyết áp cần vận mạch hoặc suy hô hấp cần thở máy.", grade: "S-L", ref: "Q7" },
  { role: "Nhuộm Gram, cấy đờm và cấy máu", text: "Ngoại trú: không làm thường quy (Mạnh · rất thấp). Nội trú: làm trước kháng sinh khi viêm phổi nặng, khi phủ MRSA/P. aeruginosa theo kinh nghiệm (Mạnh · rất thấp), từng nhiễm MRSA/P. aeruginosa hoặc nhập viện + kháng sinh tiêm trong 90 ngày (Có ĐK · rất thấp).", grade: "S-VL", ref: "Q1–Q2" },
  { role: "Kháng nguyên niệu", text: "Phế cầu và Legionella: không làm thường quy, trừ viêm phổi nặng hoặc yếu tố dịch tễ Legionella.", grade: "C-L", ref: "Q3" },
  { role: "Cúm", text: "Khi cúm lưu hành: xét nghiệm sinh học phân tử nhanh, ưu tiên hơn test kháng nguyên.", grade: "S-M", ref: "Q4" },
  { role: "Procalcitonin", text: "Bắt đầu kháng sinh khi nghi lâm sàng và có xác nhận X-quang, bất kể procalcitonin ban đầu.", grade: "S-M", ref: "Q5" },
];
export const CAP_SPECIAL: RxItem[] = [
  { role: "Nghi viêm phổi hít", text: "Không thêm thường quy thuốc phủ kỵ khí, trừ khi nghi áp xe phổi hoặc mủ màng phổi.", grade: "C-VL", ref: "Q10" },
  { role: "Cúm dương tính – nội trú", text: "Dùng thuốc kháng cúm (oseltamivir) bất kể thời gian khởi bệnh.", grade: "S-M", ref: "Q13" },
  { role: "Cúm dương tính – ngoại trú", text: "Đề nghị dùng thuốc kháng cúm bất kể thời gian khởi bệnh.", grade: "C-L", ref: "Q13" },
  { role: "Cúm dương tính – kháng sinh", text: "Vẫn dùng kháng sinh chuẩn ban đầu; có thể ngừng sớm sau 48–72 giờ nếu không có bằng chứng vi khuẩn (kể cả procalcitonin thấp) và ổn định sớm.", grade: "S-L", ref: "Q14" },
  { role: "Corticoid", text: "Không dùng thường quy: viêm phổi không nặng (Mạnh · cao), viêm phổi nặng (Có ĐK · TB), viêm phổi cúm nặng (Có ĐK · thấp). Sốc nhiễm khuẩn kháng trị: theo Surviving Sepsis Campaign.", grade: "S-H", ref: "Q12" },
];
export const CAP_DURATION: RxItem[] = [
  { role: "Thời gian", text: "Theo tiêu chuẩn ổn định lâm sàng; tiếp tục đến khi ổn định và tổng không dưới 5 ngày.", grade: "S-M", ref: "Q15" },
  { role: "Tiêu chuẩn ổn định", text: "Nhiệt độ ≤ 38 °C; mạch ≤ 100 lần/phút; nhịp thở ≤ 24 lần/phút; SaO₂ ≥ 90% hoặc PaO₂ > 60 mmHg; tri giác về nền; HA tâm thu ≥ 90 mmHg; ăn uống được.", grade: "PW", ref: "Pathway Bảng 5" },
  { role: "MRSA hoặc P. aeruginosa (nghi ngờ hoặc xác định)", text: "7 ngày.", ref: "Q15 cơ sở" },
  { role: "Kéo dài hơn", text: "Biến chứng viêm màng não, viêm nội tâm mạc, nhiễm khuẩn sâu; tác nhân ít gặp (Burkholderia pseudomallei, lao, nấm lưu hành). Không ổn định sau 5 ngày: tìm vi khuẩn kháng thuốc, mủ màng phổi, áp xe phổi, ổ nhiễm khác.", ref: "Q15" },
  { role: "Chuyển uống", text: "Dùng cùng thuốc hoặc cùng nhóm. Không yếu tố nguy cơ đa kháng: amoxicilin-acid clavulanic 500/125 mg × 3 lần/ngày hoặc 875–2.000/125 mg × 2 lần/ngày, cefpodoxim 200 mg × 2 lần/ngày, cefuroxim 500 mg × 2 lần/ngày. Có yếu tố nguy cơ đa kháng: levofloxacin 750 mg/ngày.", grade: "PW", ref: "Q15; Pathway Bảng 5" },
  { role: "Ổn định từ ngày 3", text: "Cân nhắc tổng 3–5 ngày (tại cấp cứu và nội trú). Azithromycin: ngừng sau tổng 1.500 mg nếu Legionella âm tính.", grade: "PW", ref: "Pathway Bảng 5" },
  { role: "Chụp phim kiểm tra", text: "Không chụp thường quy khi hết triệu chứng trong 5–7 ngày.", grade: "C-L", ref: "Q16" },
];

/* ======================= VPBV / VPLQTM (IDSA/ATS 2016) ======================= */
export const HV_DOSE = {
  vanco: "15 mg/kg mỗi 8–12 giờ, đích nồng độ đáy 15–20 mg/L; bệnh nặng: cân nhắc liều nạp 25–30 mg/kg",
  linezolid: "600 mg mỗi 12 giờ",
  piptazo: "4,5 g mỗi 6 giờ (có thể truyền kéo dài)",
  cefepime: "2 g mỗi 8 giờ (có thể truyền kéo dài)",
  ceftaz: "2 g mỗi 8 giờ (có thể truyền kéo dài)",
  imipenem: "500 mg mỗi 6 giờ (giảm liều nếu < 70 kg để tránh co giật)",
  meropenem: "1 g mỗi 8 giờ (có thể truyền kéo dài)",
  aztreonam: "2 g mỗi 8 giờ",
  levo: "750 mg mỗi 24 giờ",
  cipro: "400 mg mỗi 8 giờ",
  amikacin: "15–20 mg/kg mỗi 24 giờ (theo dõi nồng độ)",
  genta: "5–7 mg/kg mỗi 24 giờ (theo dõi nồng độ)",
  tobra: "5–7 mg/kg mỗi 24 giờ (theo dõi nồng độ)",
  colistin: "Nạp 5 mg/kg (colistin base), duy trì 2,5 mg × (1,5 × ClCr + 30) mỗi 12 giờ",
  polyB: "2,5–3,0 mg/kg/ngày chia 2 lần",
};
const D = HV_DOSE;
const MRSA_ROWS: RxItem[] = [
  { role: "Glycopeptid", text: "Vancomycin", dose: D.vanco, ref: "Bảng 3–4" },
  { role: "Oxazolidinon", text: "Linezolid", dose: D.linezolid, ref: "Bảng 3–4" },
];

export type HvIn = {
  kind: "hap" | "vap";
  ivAbx: boolean;
  shock: boolean;
  ards: boolean;
  hosp5: boolean;
  rrt: boolean;
  mrsaUnit: boolean;
  mrsaColon: boolean;
  gnUnit: boolean;
  structural: boolean;
  gram: boolean;
};
export type HvOut = { mrsa: boolean; dual: boolean; headline: string; why: string[]; plan: Plan; notes: string[] };

export function hvPlan(i: HvIn): HvOut {
  const why: string[] = [];
  let mrsa = false;
  let dual = false;
  if (i.kind === "vap") {
    const mdr = i.ivAbx || i.shock || i.ards || i.hosp5 || i.rrt;
    if (mdr) why.push("yếu tố nguy cơ đa kháng");
    if (i.mrsaUnit) why.push("tỷ lệ MRSA tại ICU > 10–20% hoặc chưa rõ");
    if (i.gnUnit) why.push("> 10% Gram âm kháng thuốc định đơn trị hoặc chưa rõ");
    if (i.structural) why.push("giãn phế quản hoặc xơ nang");
    mrsa = mdr || i.mrsaUnit;
    dual = mdr || i.gnUnit || i.structural;
  } else {
    if (i.shock) why.push("nguy cơ tử vong cao");
    if (i.ivAbx) why.push("dùng kháng sinh tĩnh mạch trong 90 ngày");
    if (i.mrsaColon) why.push("từng phát hiện MRSA");
    if (i.mrsaUnit) why.push("tỷ lệ MRSA tại khoa > 20% hoặc chưa rõ");
    if (i.structural) why.push("giãn phế quản hoặc xơ nang");
    if (i.gram) why.push("nhuộm Gram đờm nhiều trực khuẩn Gram âm ưu thế");
    mrsa = i.ivAbx || i.shock || i.mrsaUnit || i.mrsaColon;
    dual = i.ivAbx || i.shock || i.structural || i.gram;
  }
  const ref = i.kind === "vap" ? "Bảng 3" : "Bảng 4";
  const r = (role: string, text: string, dose: string, al?: "std"): RxItem => ({ role, text, dose, ref, al });
  const wide = dual || mrsa || i.kind === "vap";
  const bl: RxItem[] = [
    r("Penicilin kháng Pseudomonas", "Piperacilin-tazobactam", D.piptazo, "std"),
    r("Cephalosporin", "Cefepim", D.cefepime, "std"),
    ...(wide ? [r("Cephalosporin", "Ceftazidim", D.ceftaz, "std")] : []),
    r("Carbapenem", "Imipenem", D.imipenem, "std"),
    r("Carbapenem", "Meropenem", D.meropenem, "std"),
  ];
  const fq: RxItem[] = [
    r("Fluoroquinolon", "Levofloxacin", D.levo),
    ...(wide ? [r("Fluoroquinolon", "Ciprofloxacin", D.cipro)] : []),
  ];
  const azt = r("Monobactam", "Aztreonam", D.aztreonam);
  const blocks: Block[] = [];
  let headline: string;
  if (!dual) {
    blocks.push({ title: "Kháng sinh kháng Pseudomonas – chọn một", items: [...bl, ...fq, ...(wide ? [azt] : [])] });
    headline = mrsa ? "Một kháng sinh kháng Pseudomonas + một thuốc chống MRSA." : "Đơn trị bằng một kháng sinh kháng Pseudomonas (đồng thời phủ MSSA).";
  } else {
    blocks.push({ title: "Thuốc 1 – beta-lactam kháng Pseudomonas, chọn một", items: [...bl, azt] });
    blocks.push({ title: "Thuốc 2 – khác nhóm, chọn một", items: [
      ...fq.map((x) => ({ ...x })),
      r("Aminoglycosid", "Amikacin", D.amikacin),
      r("Aminoglycosid", "Gentamicin", D.genta),
      r("Aminoglycosid", "Tobramycin", D.tobra),
      ...(i.kind === "vap" ? [r("Polymyxin (đa kháng lưu hành cao)", "Colistin", D.colistin), r("Polymyxin (đa kháng lưu hành cao)", "Polymyxin B", D.polyB)] : []),
    ] });
    headline = mrsa ? "Hai kháng sinh kháng Pseudomonas khác nhóm + một thuốc chống MRSA." : "Hai kháng sinh kháng Pseudomonas khác nhóm.";
  }
  if (mrsa) blocks.push({ title: "Thuốc chống MRSA – chọn một", items: MRSA_ROWS });
  const notes: string[] = [];
  if (dual) notes.push("Không phối hợp hai beta-lactam (aztreonam chỉ phối hợp với beta-lactam khác khi không còn lựa chọn). Có kháng sinh đồ: chuyển về đơn trị.");
  notes.push(i.kind === "vap" ? "Tránh aminoglycosid và colistin khi có thuốc Gram âm khác còn hiệu lực." : "Không dùng aminoglycosid làm thuốc kháng Pseudomonas duy nhất.");
  if (!mrsa) notes.push("Piperacilin-tazobactam, cefepim, levofloxacin, imipenem, meropenem đã phủ MSSA – không cần thêm oxacilin, nafcilin hoặc cefazolin.");
  notes.push("Dị ứng penicilin nặng, dùng aztreonam thay beta-lactam: thêm thuốc phủ MSSA.");
  return { mrsa, dual, headline, why, plan: { title: "", blocks }, notes };
}

export function hvGrades(kind: "hap" | "vap"): RxItem[] {
  return kind === "vap" ? [
    { role: "Phạm vi bao phủ", text: "Mọi phác đồ kinh nghiệm phủ S. aureus, P. aeruginosa và trực khuẩn Gram âm khác.", grade: "S-L", ref: "X.1" },
    { role: "Thêm thuốc chống MRSA khi", text: "Có yếu tố nguy cơ đa kháng; đơn vị có > 10–20% S. aureus kháng methicilin; hoặc chưa biết tỷ lệ MRSA.", grade: "C-VL", ref: "X.1.i" },
    { role: "Hai thuốc kháng Pseudomonas khi", text: "Có yếu tố nguy cơ đa kháng; đơn vị có > 10% Gram âm kháng thuốc định đơn trị; chưa có dữ liệu nhạy cảm; bệnh phổi cấu trúc (giãn phế quản, xơ nang). Ngược lại: một thuốc.", grade: "C-L", ref: "X.4–X.5" },
    { role: "Kháng sinh đồ tại chỗ", text: "Mỗi bệnh viện lập và phổ biến kháng sinh đồ, tốt nhất riêng cho ICU; phác đồ kinh nghiệm dựa trên phân bố tác nhân VPLQTM tại chỗ.", ref: "IX" },
  ] : [
    { role: "Phạm vi bao phủ", text: "Mọi phác đồ kinh nghiệm phủ S. aureus (Mạnh · rất thấp), P. aeruginosa và trực khuẩn Gram âm khác (Mạnh · rất thấp).", grade: "S-VL", ref: "XII.1–2" },
    { role: "Thêm thuốc chống MRSA khi", text: "Kháng sinh TM trong 90 ngày; khoa có > 20% S. aureus kháng methicilin hoặc chưa biết tỷ lệ; nguy cơ tử vong cao (cần hỗ trợ thông khí do VPBV, sốc nhiễm khuẩn). Từng phát hiện MRSA (cấy hoặc sàng lọc) làm tăng khả năng MRSA.", grade: "C-VL", ref: "XII.1.i" },
    { role: "Hai thuốc kháng Pseudomonas khi", text: "Kháng sinh TM trong 90 ngày; nguy cơ tử vong cao; bệnh phổi cấu trúc (giãn phế quản, xơ nang); nhuộm Gram đờm chất lượng tốt thấy nhiều trực khuẩn Gram âm ưu thế. Ngược lại: một thuốc.", grade: "C-VL", ref: "XII.2.i" },
    { role: "Kháng sinh đồ tại chỗ", text: "Lập kháng sinh đồ riêng cho VPBV nếu có thể; phác đồ kinh nghiệm dựa trên phân bố tác nhân tại chỗ.", ref: "XI" },
  ];
}

export function hvDiagnosis(kind: "hap" | "vap"): RxItem[] {
  const out: RxItem[] = kind === "vap"
    ? [{ role: "Bệnh phẩm", text: "Hút dịch nội khí quản, cấy bán định lượng; ưu tiên hơn lấy mẫu xâm nhập định lượng.", grade: "C-L", ref: "I" },
       { role: "Nếu đã làm cấy định lượng xâm nhập", text: "Dưới ngưỡng chẩn đoán (PSB < 10³, BAL < 10⁴ CFU/mL): đề nghị ngừng kháng sinh, cân nhắc ổ nhiễm khác, kháng sinh trước đó, mức nghi ngờ, nhiễm khuẩn nặng.", grade: "C-VL", ref: "II" },
       { role: "Viêm khí phế quản liên quan thở máy", text: "Không dùng kháng sinh.", grade: "C-L", ref: "VIII" }]
    : [{ role: "Bệnh phẩm", text: "Điều trị theo kết quả vi sinh từ mẫu đường hô hấp lấy không xâm nhập (khạc đờm, đờm kích thích, hút mũi khí quản).", grade: "C-VL", ref: "III" }];
  out.push({ role: "Cấy máu", text: "Làm cho mọi người bệnh nghi VPBV/VPLQTM.", ref: "Xác định căn nguyên" });
  out.push({ role: "Quyết định khởi trị", text: "Dựa vào tiêu chuẩn lâm sàng; không dùng procalcitonin (Mạnh · TB), sTREM-1 dịch rửa phế quản (Mạnh · TB), CRP (Có ĐK · thấp), CPIS (Có ĐK · thấp).", grade: "S-M", ref: "IV–VII" });
  return out;
}

export const HV_COURSE: RxItem[] = [
  { role: "Liều theo PK/PD", text: "Xác định liều theo dược động học/dược lực học (nồng độ thuốc, truyền kéo dài hoặc liên tục, liều theo cân nặng) thay vì liều trong tờ hướng dẫn.", grade: "C-VL", ref: "XIII" },
  { role: "Xuống thang", text: "Thu hẹp phổ hoặc chuyển phối hợp sang đơn trị theo cấy và diễn biến, thay vì giữ cố định phác đồ rộng.", grade: "C-VL", ref: "XXIII" },
  { role: "Thời gian", text: "7 ngày; có thể ngắn hoặc dài hơn tùy tốc độ cải thiện lâm sàng, X-quang, xét nghiệm.", grade: "S-M", ref: "XXI–XXII" },
  { role: "Ngừng kháng sinh", text: "Dùng procalcitonin kèm tiêu chuẩn lâm sàng (Có ĐK · thấp); không dùng CPIS (Có ĐK · thấp).", grade: "C-L", ref: "XXIV–XXV" },
  { role: "Kháng sinh khí dung bổ trợ", text: "Gram âm chỉ nhạy aminoglycosid hoặc polymyxin: khí dung kèm toàn thân. Có thể cân nhắc như biện pháp cuối khi không đáp ứng kháng sinh TM.", grade: "C-VL", ref: "XIV" },
];

/* ======================= DIEU TRI DICH ======================= */
const A = { // IDSA 2026 Bang 1
  ertapenem: "1 g mỗi 24 giờ, truyền 30 phút",
  mero: "1–2 g mỗi 8 giờ, truyền 3 giờ (2 g khi béo phì, ECMO, ClCr ≥ 130 mL/phút)",
  imi: "500 mg mỗi 6 giờ truyền 3 giờ, hoặc 1 g mỗi 8 giờ truyền 1 giờ (ClCr ≥ 90 mL/phút: 1 g mỗi 6 giờ truyền 1 giờ)",
  fepEnm: "2,5 g mỗi 8 giờ, truyền 2 giờ (ClCr ≥ 130 mL/phút: truyền 4 giờ)",
  fep: "Nạp 2 g truyền 30 phút, sau đó 2 g mỗi 8 giờ truyền 3 giờ",
  levo: "750 mg mỗi 24 giờ, TM hoặc uống",
  cipro: "400 mg TM mỗi 8 giờ hoặc 750 mg uống mỗi 12 giờ",
  tmp: "8–15 mg/kg/ngày (thành phần trimethoprim) chia mỗi 8–12 giờ, TM hoặc uống",
  cza: "2,5 g mỗi 8 giờ, truyền 3 giờ",
  mev: "4 g mỗi 8 giờ, truyền 3 giờ",
  imr: "1,25 g mỗi 6 giờ, truyền 30 phút",
  aza: "Nạp 2,67 g truyền 3 giờ, sau đó 2 g mỗi 6 giờ truyền 3 giờ",
  fdc: "2 g mỗi 8 giờ, truyền 3 giờ (ClCr ≥ 120 mL/phút: mỗi 6 giờ)",
  czaAzt: "Ceftazidim-avibactam 2,5 g mỗi 8 giờ + aztreonam 2 g mỗi 8 giờ, cùng truyền 3 giờ (chạc Y)",
  erava: "1 mg/kg mỗi 12 giờ",
  tige: "Nạp 200 mg, sau đó 100 mg mỗi 12 giờ",
  ctz: "3 g mỗi 8 giờ, truyền 3 giờ",
  sud: "2 g (1 g sulbactam + 1 g durlobactam) mỗi 6 giờ, truyền 3 giờ (ClCr ≥ 130 mL/phút: mỗi 4 giờ)",
  amsul: "Tổng 9 g sulbactam/ngày: 9 g ampicilin-sulbactam mỗi 8 giờ truyền 4 giờ, hoặc 27 g truyền liên tục 24 giờ",
  mino: "200 mg mỗi 12 giờ, TM hoặc uống",
  polyB: "Theo đồng thuận quốc tế về polymyxin",
};

export type Pathogen = { id: string; label: string; source: "2016" | "2026" | "both"; items: RxItem[]; notes?: string[] };
export const PATHOGENS: Pathogen[] = [
  {
    id: "mrsa", label: "MRSA", source: "2016",
    items: [
      { role: "Ưu tiên – chọn một", text: "Vancomycin", dose: D.vanco, grade: "S-M", ref: "XV" },
      { role: "Ưu tiên – chọn một", text: "Linezolid", dose: D.linezolid, grade: "S-M", ref: "XV" },
    ],
    notes: ["Chọn giữa hai thuốc theo công thức máu, thuốc ức chế tái hấp thu serotonin đang dùng, chức năng thận và chi phí.", "Không dùng telavancin khi ClCr < 30 mL/phút; vancomycin + rifampicin tăng kháng rifampicin."],
  },
  {
    id: "mssa", label: "MSSA", source: "2016",
    items: [{ role: "Ưu tiên", text: "Oxacilin, nafcilin hoặc cefazolin", ref: "X.3; XII.1.iii", al: "std" }],
  },
  {
    id: "pa", label: "P. aeruginosa nhạy kháng sinh thông thường", source: "both",
    items: [
      { role: "Nguyên tắc", text: "Chọn thuốc theo kháng sinh đồ.", grade: "S-L", ref: "XVI.1" },
      { role: "Không sốc, không nguy cơ tử vong cao", text: "Đơn trị bằng một thuốc nhạy.", grade: "S-L", ref: "XVII.1" },
      { role: "Còn sốc hoặc nguy cơ tử vong cao khi có kháng sinh đồ", text: "Phối hợp hai thuốc nhạy; hết sốc thì về đơn trị.", grade: "C-VL", ref: "XVII.2" },
      { role: "Không dùng", text: "Aminoglycosid đơn trị.", grade: "S-VL", ref: "XVI.2" },
      { role: "Nhạy cả beta-lactam thông thường và carbapenem", text: "Ưu tiên aztreonam, cefepim, ceftazidim hoặc piperacilin-tazobactam hơn carbapenem.", grade: "AMR", ref: "AMR 4.1", al: "std" },
      { role: "Kháng carbapenem, nhạy beta-lactam thông thường", text: "Beta-lactam thông thường liều cao, truyền kéo dài; bệnh nặng hoặc ổ nhiễm chưa kiểm soát: có thể dùng thuốc mới.", dose: `Ví dụ cefepim 2 g mỗi 8 giờ truyền ≥ 3 giờ`, grade: "AMR", ref: "AMR 4.1", al: "std" },
    ],
  },
  {
    id: "dtrpa", label: "P. aeruginosa khó điều trị (DTR)", source: "2026",
    items: [
      { role: "Ưu tiên cho viêm phổi", text: "Ceftolozan-tazobactam", dose: A.ctz, grade: "AMR", ref: "AMR 4.3", al: "std" },
      { role: "Ưu tiên", text: "Ceftazidim-avibactam", dose: A.cza, grade: "AMR", ref: "AMR 4.3", al: "std" },
      { role: "Ưu tiên", text: "Imipenem-relebactam", dose: A.imr, grade: "AMR", ref: "AMR 4.3", al: "std" },
      { role: "Thay thế", text: "Cefiderocol", dose: A.fdc, grade: "AMR", ref: "AMR 4.3", al: "std" },
      { role: "Sinh KPC", text: "Cefiderocol, ceftazidim-avibactam hoặc imipenem-relebactam theo kháng sinh đồ; không dùng ceftolozan-tazobactam.", grade: "AMR", ref: "AMR 4.4", al: "std" },
      { role: "Sinh metallo-beta-lactamase (NDM, VIM, IMP)", text: "Cefiderocol. Ceftazidim-avibactam + aztreonam chỉ khi kháng cefiderocol.", dose: A.fdc, grade: "AMR", ref: "AMR 4.4", al: "std" },
    ],
    notes: ["DTR: không nhạy aztreonam, cefepim, ceftazidim, ciprofloxacin, imipenem, levofloxacin, meropenem, piperacilin-tazobactam. Đề nghị phòng xét nghiệm làm kháng sinh đồ cả 4 thuốc mới.", "Không phối hợp kháng sinh khi đã có beta-lactam nhạy. Không thuốc nào nhạy: tobramycin (nếu nhạy) hoặc polymyxin B + beta-lactam mới có MIC gần ngưỡng nhạy nhất.", "Khí dung không dùng thường quy; cân nhắc khi không có beta-lactam mới nhạy và đáp ứng kém.", "Khoảng 20% xuất hiện kháng trong điều trị – làm lại kháng sinh đồ ở chủng phân lập sau."],
  },
  {
    id: "esbl", label: "Enterobacterales sinh ESBL", source: "both",
    items: [
      { role: "Ưu tiên", text: "Meropenem hoặc imipenem (bệnh nặng, giảm albumin máu)", dose: `Meropenem ${A.mero}. Imipenem ${A.imi}`, grade: "AMR", ref: "AMR 1.3", al: "std" },
      { role: "Ưu tiên", text: "Ertapenem (không nặng, albumin bình thường)", dose: A.ertapenem, grade: "AMR", ref: "AMR 1.3", al: "std" },
      { role: "Thay thế", text: "Cefepim-enmetazobactam", dose: A.fepEnm, grade: "AMR", ref: "AMR 1.3", al: "std" },
      { role: "Chuyển uống khi ổn định, có kháng sinh đồ", text: "Ciprofloxacin, levofloxacin hoặc cotrimoxazol", dose: `Ciprofloxacin ${A.cipro}; levofloxacin ${A.levo}; cotrimoxazol ${A.tmp}`, grade: "AMR", ref: "AMR 1.3" },
      { role: "Không dùng", text: "Piperacilin-tazobactam, cefepim, cephamycin – kể cả khi kháng sinh đồ báo nhạy.", grade: "AMR", ref: "AMR 1.4–1.6" },
    ],
    notes: ["IDSA/ATS 2016: chọn thuốc theo kháng sinh đồ và yếu tố người bệnh (Mạnh · rất thấp). Dành thuốc mới (ceftazidim-avibactam, meropenem-vaborbactam, imipenem-relebactam, ceftolozan-tazobactam, cefiderocol) cho vi khuẩn kháng carbapenem."],
  },
  {
    id: "ampc", label: "Enterobacterales nguy cơ AmpC (E. cloacae, K. aerogenes, C. freundii, H. alvei)", source: "2026",
    items: [
      { role: "Ưu tiên (MIC cefepim ≤ 8 mg/L, không có ESBL)", text: "Cefepim", dose: A.fep, grade: "AMR", ref: "AMR 2.3", al: "std" },
      { role: "Thay thế khi nhạy", text: "Kháng sinh không phải beta-lactam (fluoroquinolon, cotrimoxazol)", dose: `Levofloxacin ${A.levo}; ciprofloxacin ${A.cipro}; cotrimoxazol ${A.tmp}`, grade: "AMR", ref: "AMR 2.7" },
      { role: "Không dùng cho nhiễm khuẩn xâm lấn", text: "Ceftriaxon, cefotaxim, ceftazidim, piperacilin-tazobactam, ceftolozan-tazobactam.", grade: "AMR", ref: "AMR 2.4–2.6" },
    ],
    notes: ["Khoảng 20% xuất hiện kháng ceftriaxon trong điều trị. M. morganii, Providencia, S. marcescens: chọn theo kháng sinh đồ."],
  },
  {
    id: "cre-kpc", label: "Enterobacterales kháng carbapenem – sinh KPC", source: "2026",
    items: [
      { role: "Ưu tiên (thứ tự đề nghị nhẹ)", text: "Meropenem-vaborbactam", dose: A.mev, grade: "AMR", ref: "AMR 3.4", al: "std" },
      { role: "Ưu tiên", text: "Ceftazidim-avibactam", dose: A.cza, grade: "AMR", ref: "AMR 3.4", al: "std" },
      { role: "Ưu tiên", text: "Imipenem-relebactam", dose: A.imr, grade: "AMR", ref: "AMR 3.4", al: "std" },
      { role: "Thay thế", text: "Aztreonam-avibactam hoặc cefiderocol", dose: `Aztreonam-avibactam: ${A.aza}. Cefiderocol: ${A.fdc}`, grade: "AMR", ref: "AMR 3.4", al: "std" },
      { role: "Thay thế (không dùng khi nhiễm khuẩn huyết)", text: "Eravacyclin hoặc tigecyclin", dose: `Eravacyclin ${A.erava}; tigecyclin ${A.tige}`, grade: "AMR", ref: "AMR 3.4; 3.7" },
    ],
    notes: ["Ceftazidim-avibactam: khoảng 10% xuất hiện kháng trong điều trị; meropenem-vaborbactam, imipenem-relebactam < 3%.", "Không phối hợp thường quy khi đã có beta-lactam nhạy."],
  },
  {
    id: "cre-ndm", label: "Enterobacterales kháng carbapenem – sinh NDM", source: "2026",
    items: [
      { role: "Ưu tiên", text: "Aztreonam-avibactam", dose: A.aza, grade: "AMR", ref: "AMR 3.5", al: "std" },
      { role: "Ưu tiên", text: "Cefiderocol", dose: A.fdc, grade: "AMR", ref: "AMR 3.5", al: "std" },
      { role: "Thay thế (không có aztreonam-avibactam)", text: "Ceftazidim-avibactam + aztreonam", dose: A.czaAzt, grade: "AMR", ref: "AMR 3.5", al: "std" },
      { role: "Thay thế (không dùng khi nhiễm khuẩn huyết)", text: "Eravacyclin hoặc tigecyclin", dose: `Eravacyclin ${A.erava}; tigecyclin ${A.tige}`, grade: "AMR", ref: "AMR 3.5" },
    ],
    notes: ["Ceftazidim-avibactam, meropenem-vaborbactam, imipenem-relebactam không có tác dụng trên NDM."],
  },
  {
    id: "cre-oxa", label: "Enterobacterales kháng carbapenem – sinh OXA-48", source: "2026",
    items: [
      { role: "Ưu tiên", text: "Ceftazidim-avibactam", dose: A.cza, grade: "AMR", ref: "AMR 3.6", al: "std" },
      { role: "Thay thế", text: "Aztreonam-avibactam hoặc cefiderocol", dose: `Aztreonam-avibactam: ${A.aza}. Cefiderocol: ${A.fdc}`, grade: "AMR", ref: "AMR 3.6", al: "std" },
      { role: "Thay thế (không dùng khi nhiễm khuẩn huyết)", text: "Eravacyclin hoặc tigecyclin", dose: `Eravacyclin ${A.erava}; tigecyclin ${A.tige}`, grade: "AMR", ref: "AMR 3.6" },
      { role: "Không dùng", text: "Meropenem-vaborbactam, imipenem-relebactam – kể cả khi báo nhạy.", grade: "AMR", ref: "AMR 3.6" },
    ],
  },
  {
    id: "cre-non", label: "Enterobacterales kháng carbapenem – không sinh carbapenemase", source: "2026",
    items: [
      { role: "Nhạy meropenem và imipenem (MIC ≤ 1), kháng ertapenem", text: "Meropenem hoặc imipenem truyền kéo dài", dose: `Meropenem ${A.mero}. Imipenem ${A.imi}`, grade: "AMR", ref: "AMR 3.3", al: "std" },
      { role: "Kháng mọi carbapenem – ưu tiên (đề nghị nhẹ ceftazidim-avibactam, imipenem-relebactam)", text: "Ceftazidim-avibactam, imipenem-relebactam, meropenem-vaborbactam hoặc aztreonam-avibactam", dose: `Ceftazidim-avibactam ${A.cza}; imipenem-relebactam ${A.imr}; meropenem-vaborbactam ${A.mev}; aztreonam-avibactam: ${A.aza}`, grade: "AMR", ref: "AMR 3.3", al: "std" },
      { role: "Thay thế", text: "Cefiderocol; eravacyclin hoặc tigecyclin (không dùng khi nhiễm khuẩn huyết)", dose: `Cefiderocol ${A.fdc}; eravacyclin ${A.erava}; tigecyclin ${A.tige}`, grade: "AMR", ref: "AMR 3.3" },
    ],
  },
  {
    id: "crab", label: "Acinetobacter baumannii kháng carbapenem (CRAB)", source: "both",
    items: [
      { role: "Ưu tiên", text: "Sulbactam-durlobactam + imipenem hoặc meropenem", dose: `Sulbactam-durlobactam ${A.sud}; imipenem ${A.imi} hoặc meropenem ${A.mero}`, grade: "AMR", ref: "AMR 5.1", al: "std" },
      { role: "Bắc cầu khi chưa có sulbactam-durlobactam", text: "Ampicilin-sulbactam liều cao + ít nhất một thuốc khác (cefiderocol, minocyclin hoặc polymyxin B)", dose: A.amsul, grade: "AMR", ref: "AMR 5.2", al: "std" },
      { role: "Thay thế (kháng sulbactam-durlobactam hoặc bắc cầu) – luôn phối hợp", text: "Cefiderocol, minocyclin hoặc polymyxin B, kèm ít nhất một thuốc khác", dose: `Cefiderocol ${A.fdc}; minocyclin ${A.mino}; polymyxin B: ${A.polyB}`, grade: "AMR", ref: "AMR 5.3–5.5" },
      { role: "Không dùng", text: "Tigecyclin (IDSA/ATS 2016: Mạnh · thấp); rifampicin bổ trợ colistin (Có ĐK · TB); khí dung thường quy (IDSA 2026).", grade: "S-L", ref: "XIX.3–4; AMR 5.6" },
    ],
    notes: ["Acinetobacter còn nhạy (IDSA/ATS 2016): carbapenem hoặc ampicilin-sulbactam theo kháng sinh đồ (Có ĐK · thấp).", "Kháng sulbactam-durlobactam (MIC ≥ 16/4) hoặc có gen MBL: dùng phối hợp không dựa trên sulbactam (cefiderocol, minocyclin, polymyxin B, tigecyclin)."],
  },
  {
    id: "steno", label: "Stenotrophomonas maltophilia", source: "2026",
    items: [
      { role: "Ưu tiên – đơn trị", text: "Cefiderocol", dose: A.fdc, grade: "AMR", ref: "AMR 6.1", al: "std" },
      { role: "Thay thế – nên phối hợp", text: "Aztreonam-avibactam (hoặc ceftazidim-avibactam + aztreonam)", dose: `${A.aza}. ${A.czaAzt}`, grade: "AMR", ref: "AMR 6.2", al: "std" },
      { role: "Thay thế – trong phác đồ phối hợp", text: "Levofloxacin, minocyclin hoặc cotrimoxazol", dose: `Levofloxacin ${A.levo}; minocyclin ${A.mino}; cotrimoxazol ${A.tmp}`, grade: "AMR", ref: "AMR 6.3–6.5" },
      { role: "Không dùng", text: "Ceftazidim.", grade: "AMR", ref: "AMR 6.6" },
    ],
    notes: ["Chuyển sang đơn trị levofloxacin, minocyclin hoặc cotrimoxazol chỉ khi cải thiện rõ, bền vững và đã có kháng sinh đồ."],
  },
  {
    id: "polyonly", label: "Vi khuẩn kháng carbapenem chỉ nhạy polymyxin", source: "2016",
    items: [
      { role: "Ưu tiên", text: "Polymyxin tĩnh mạch (colistin hoặc polymyxin B)", dose: `Colistin: ${D.colistin}. Polymyxin B: ${D.polyB}`, grade: "S-M", ref: "XX" },
      { role: "Bổ trợ", text: "Colistin khí dung (pha với nước cất ngay trước dùng)", grade: "C-L", ref: "XX" },
    ],
    notes: ["IDSA 2026 ưu tiên thuốc mới theo cơ chế kháng (KPC, NDM, OXA-48, DTR, CRAB) – chỉ dùng polymyxin khi các thuốc này không có hoặc không nhạy."],
  },
];
