/*
  Viem xuong tuy – du lieu cong cu chon khang sinh (nguon quoc te).
  1) Nguoi lon: WikiGuidelines – Spellberg B et al. JAMA Netw Open 2022;5(5):e2211321 (Bang 2: kinh nghiem;
     Bang 3: lieu uong; Bang 4: thoi gian) va ban cap nhat 2025 (Am J Med 2026;139(4):395–398).
     Muc: "CR" = khuyen cao ro (bang chung tien cuu co doi chung, lap lai duoc); "RV" = tong quan lam sang.
     WikiGuidelines KHONG neu lieu thuoc tiem -> khong ghi lieu tiem.
  2) Tre em 1 thang – < 18 tuoi: PIDS/IDSA 2021 – Woods CR et al. J Pediatric Infect Dis Soc 2021;10(8):801–844
     (Bang 3: kinh nghiem theo ty le MRSA va khang clindamycin; Bang 4: thuoc dich S. aureus; Bang 5: lieu).
     Muc GRADE: "S-M" ...; "GPS" = thuc hanh tot.
  ref: vi tri trong huong dan, chi de doi chieu (khong hien thi).
  al: "std" = beta-lactam (an khi di ung beta-lactam); "alt" = chi hien khi di ung.
*/
import type { RxItem } from "./septic-arthritis-pids2023";

/* ================= NGUOI LON – WikiGuidelines ================= */
export type AdultType = "native" | "dfo" | "implant-early" | "implant-late" | "ulcer";
export const ADULT_TYPES: { id: AdultType; label: string }[] = [
  { id: "native", label: "Không có dụng cụ cấy ghép (đường máu hoặc lan từ kế cận, gồm cột sống)" },
  { id: "dfo", label: "Viêm xương bàn chân đái tháo đường" },
  { id: "implant-early", label: "Có dụng cụ cấy ghép/khớp nhân tạo – dưới 3 tháng sau thủ thuật" },
  { id: "implant-late", label: "Có dụng cụ cấy ghép/khớp nhân tạo – từ 3 tháng sau thủ thuật" },
  { id: "ulcer", label: "Viêm xương dưới loét tì đè" },
];

/* Lieu uong da dung trong nghien cuu (Bang 3, 2022). */
export const W_DOSE = {
  cipro: "500–750 mg × 2 lần/ngày (mức cao khi P. aeruginosa)",
  levo: "750 mg × 1 lần/ngày",
  tmp: "7,5–10 mg/kg/ngày (thành phần trimethoprim) chia 2–3 lần; ví dụ 2 viên DS × 2 lần/ngày cho người 70 kg",
  clinda: "600 mg × 3 lần/ngày; người cân nặng lớn: 900 mg × 3 lần/ngày hoặc 600 mg × 4 lần/ngày",
  linezolid: "600 mg × 2 lần/ngày; theo dõi độc tính huyết học (hồi phục) sau 2 tuần, độc tính thần kinh (không hồi phục) sau 4 tuần",
  amoxclav: "500 mg × 3 lần/ngày hoặc 875 mg × 2 lần/ngày (dữ liệu riêng cho viêm xương bàn chân đái tháo đường)",
  rif: "600 mg × 1 lần/ngày (đã dùng: 600 mg × 1 lần, 900 mg × 1 lần, 600 mg × 2 lần/ngày); tránh liều 300 mg",
};

export const W_TIMING: RxItem[] = [
  { role: "Ổn định lâm sàng, chưa có tác nhân", text: "Hợp lý khi cân nhắc hoãn kháng sinh đến khi lấy được mẫu xương/khớp để nuôi cấy (kháng sinh trước sinh thiết có thể giảm tỷ lệ cấy dương tính).", grade: "RV", ref: "Q3" },
  { role: "Nhiễm khuẩn huyết nặng, nguy cơ chèn ép tủy", text: "Không trì hoãn – dùng kháng sinh kinh nghiệm ngay.", grade: "RV", ref: "Q3" },
];

export type AdultRisk = { mrsa: boolean; pseudo: boolean; anaer: boolean };
const CTX = "Ceftriaxon";
const VANCO_ALT: RxItem = { role: "Thay thế vancomycin", text: "Linezolid, daptomycin hoặc clindamycin", grade: "RV", ref: "Bảng 2" };
const FQ_ALT: RxItem = { role: "Dị ứng beta-lactam", text: "Fluoroquinolon (ciprofloxacin hoặc levofloxacin) thay cho beta-lactam", grade: "RV", ref: "Bảng 2", al: "alt" };

export function adultEmpiric(t: AdultType, r: AdultRisk): { items: RxItem[]; notes: string[] } {
  const items: RxItem[] = [];
  const notes: string[] = [];
  const bl = r.pseudo
    ? "Beta-lactam kháng trực khuẩn mủ xanh không phải carbapenem (cefepim hoặc piperacilin-tazobactam) thay ceftriaxon"
    : CTX;
  if (t === "native") {
    items.push({ role: "Kinh nghiệm", text: bl, grade: "RV", ref: "Bảng 2", al: "std" });
    if (r.mrsa) items.push({ role: "Phối hợp (nguy cơ MRSA)", text: "Vancomycin", grade: "RV", ref: "Bảng 2 b" });
    if (r.anaer) items.push({ role: "Nghi kỵ khí, vết thương hoại tử", text: "Thêm metronidazol, hoặc thay ceftriaxon bằng ampicilin-sulbactam / amoxicilin-acid clavulanic", grade: "RV", ref: "Bảng 2 b", al: "std" });
    if (!r.mrsa) notes.push("Không có yếu tố nguy cơ MRSA: một số tác giả thêm beta-lactam kháng tụ cầu (oxacilin, cloxacilin, nafcilin hoặc cefazolin) vào ceftriaxon.");
  } else if (t === "dfo") {
    if (r.pseudo) items.push({ role: "Kinh nghiệm (nguy cơ P. aeruginosa)", text: `${bl} ± metronidazol`, grade: "RV", ref: "Bảng 2 b", al: "std" });
    else {
      items.push({ role: "Kinh nghiệm – một trong", text: "Ampicilin-sulbactam", grade: "RV", ref: "Bảng 2", al: "std" });
      items.push({ role: "Kinh nghiệm – một trong", text: "Amoxicilin-acid clavulanic", grade: "RV", ref: "Bảng 2", al: "std" });
      items.push({ role: "Kinh nghiệm – một trong", text: "Ceftriaxon ± metronidazol", grade: "RV", ref: "Bảng 2", al: "std" });
    }
    if (r.mrsa) items.push({ role: "Phối hợp (nguy cơ MRSA)", text: "Vancomycin", grade: "RV", ref: "Bảng 2 b" });
    notes.push("Nhiều bác sĩ thêm thuốc phủ kỵ khí thường quy; chưa có dữ liệu chứng minh lợi ích.");
    notes.push("Ngoáy mũi MRSA âm tính có giá trị dự báo âm > 90% loại trừ MRSA khi tỷ lệ MRSA tại chỗ < 15% – hỗ trợ không dùng thuốc kháng MRSA kinh nghiệm (cập nhật 2025).");
  } else if (t === "implant-early") {
    items.push({ role: "Kinh nghiệm", text: "Beta-lactam kháng trực khuẩn mủ xanh hoặc ceftriaxon", grade: "RV", ref: "Bảng 2", al: "std" });
    items.push({ role: "Phối hợp", text: "Vancomycin", grade: "RV", ref: "Bảng 2" });
    notes.push("Một số tác giả không phủ trực khuẩn mủ xanh thường quy, tùy tần suất gặp tại chỗ.");
    notes.push("Rifampicin: đa số chờ đến khi chuyển uống; nên chờ sạch vi khuẩn trong máu và kiểm soát ổ nhiễm bằng phẫu thuật.");
  } else if (t === "implant-late") {
    items.push({ role: "Kinh nghiệm", text: bl, grade: "RV", ref: "Bảng 2", al: "std" });
    items.push({ role: "Phối hợp", text: "Vancomycin", grade: "RV", ref: "Bảng 2" });
    notes.push("Rifampicin: đa số chờ đến khi chuyển uống; nên chờ sạch vi khuẩn trong máu và kiểm soát ổ nhiễm bằng phẫu thuật.");
  }
  if (t !== "ulcer") {
    items.push(FQ_ALT);
    if (items.some((i) => i.text === "Vancomycin")) items.push(VANCO_ALT);
  }
  return { items, notes };
}

export const W_ULCER: RxItem[] = [
  { role: "Nguyên tắc", text: "Không dùng kháng sinh thường quy, trừ khi sinh thiết xương sâu xác định viêm xương và có kế hoạch đóng vết thương bằng phẫu thuật, hoặc có nhiễm khuẩn huyết, nhiễm khuẩn mô mềm tại chỗ.", grade: "RV", ref: "Q2" },
  { role: "Sau cắt lọc và che phủ vạt", text: "Không có lợi khi kéo dài kháng sinh quá 5–7 ngày.", ref: "Cập nhật 2025 II.1" },
  { role: "Điều trị đa mô thức", text: "Tối ưu dinh dưỡng, cắt lọc và chăm sóc vết thương, giảm tì đè, hỗ trợ tâm lý – xã hội. Phối hợp nội – ngoại khoa giảm > 50% tái nhập viện 1 năm.", ref: "Q2; cập nhật 2025" },
];

export function adultOral(t: AdultType): RxItem[] {
  if (t === "ulcer") return [];
  const rows: RxItem[] = [];
  if (t === "dfo") rows.push({ role: "Lựa chọn", text: "Amoxicilin-acid clavulanic", dose: W_DOSE.amoxclav, ref: "Bảng 2–3", al: "std" });
  if (t === "implant-early") {
    rows.push({ role: "Kinh nghiệm", text: "Ciprofloxacin ± rifampicin", dose: W_DOSE.cipro, ref: "Bảng 2–3" });
    rows.push({ role: "Kinh nghiệm", text: "Levofloxacin ± rifampicin", dose: W_DOSE.levo, ref: "Bảng 2–3" });
    rows.push({ role: "Khi xác định Gram dương", text: "Cotrimoxazol, clindamycin, linezolid hoặc doxycyclin ± rifampicin", ref: "Bảng 2" });
  } else {
    rows.push({ role: "Lựa chọn", text: "Cotrimoxazol", dose: W_DOSE.tmp, ref: "Bảng 2–3" });
    rows.push({ role: "Lựa chọn (chỉ Gram dương)", text: "Clindamycin", dose: W_DOSE.clinda, ref: "Bảng 2–3" });
    rows.push({ role: "Lựa chọn (chỉ Gram dương)", text: "Linezolid", dose: W_DOSE.linezolid, ref: "Bảng 2–3" });
    rows.push({ role: "Lựa chọn", text: t === "dfo" ? "Ciprofloxacin ± metronidazol ± rifampicin" : "Ciprofloxacin", dose: W_DOSE.cipro, ref: "Bảng 2–3" });
    rows.push({ role: "Lựa chọn", text: t === "dfo" ? "Levofloxacin ± metronidazol ± rifampicin" : "Levofloxacin", dose: W_DOSE.levo, ref: "Bảng 2–3" });
    rows.push({ role: "Lựa chọn (ít dữ liệu)", text: "Doxycyclin ± rifampicin", ref: "Bảng 2 e" });
  }
  rows.push({ role: "Rifampicin (nếu phối hợp)", text: "Thêm vào fluoroquinolon khi điều trị S. aureus để hạn chế kháng thuốc; dữ liệu hiệu quả còn chưa thống nhất.", dose: W_DOSE.rif, grade: "RV", ref: "Bảng 2 c; Q4" });
  rows.push({ role: "Bổ sung 2025", text: "Cefalexin, cefadroxil, cephradin; tedizolid (dữ liệu còn hạn chế)", dose: "Liều theo bảng 3 bản cập nhật 2025 (phụ lục) – chưa tích hợp", ref: "Cập nhật 2025 II.3–4" });
  return rows;
}
export const W_GPOS_NOTE = "Clindamycin và linezolid không phủ Gram âm: chỉ dùng khi chắc chắn không do Gram âm; nếu còn nghi Gram âm phải phối hợp thêm thuốc phủ Gram âm.";

export const W_ROUTE: RxItem[] = [
  { role: "Chuyển uống – đủ cả 5 điều kiện", text: "(1) Ổn định huyết động và tại ổ nhiễm (vd. không mất vững cột sống); (2) kiểm soát ổ nhiễm đầy đủ (không cần dẫn lưu thêm, không còn nhiễm khuẩn huyết dai dẳng); (3) hấp thu đường tiêu hóa bình thường; (4) có phác đồ uống đã được nghiên cứu phủ tác nhân đích; (5) không có lý do tâm lý – xã hội cản trở.", grade: "CR", ref: "Q5" },
  { role: "Thời điểm", text: "Không cần thời gian tiêm tối thiểu; có thể chuyển uống ngay ở giai đoạn kinh nghiệm khi đủ điều kiện (thử nghiệm POvIV 2025 củng cố).", grade: "CR", ref: "Q5; cập nhật 2025 II.9" },
];

export function adultDuration(t: AdultType): RxItem[] {
  if (t === "ulcer") return [{ role: "Sau cắt lọc và che phủ vạt", text: "Không kéo dài quá 5–7 ngày.", ref: "Cập nhật 2025 II.1" }];
  if (t === "implant-early" || t === "implant-late") return [
    { role: "Cắt lọc, giữ lại dụng cụ (DAIR)", text: "12 tuần (toàn bộ chuyên gia tham gia ưu tiên 12 hơn 6 tuần).", grade: "RV", ref: "Bảng 4" },
    { role: "Thay khớp", text: "Một số chuyên gia ưu tiên 12 tuần; 6 tuần có thể hợp lý khi tác nhân không phải S. aureus, nhất là thay 1 thì, hoặc thay 2 thì.", grade: "RV", ref: "Bảng 4" },
  ];
  return [
    { role: "Không còn dụng cụ cấy ghép, kiểm soát ổ nhiễm tốt", text: "Tối đa 6 tuần.", grade: "CR", ref: "Q7" },
    { role: "Đã cắt lọc", text: "3–4 tuần có thể đủ; cần thêm dữ liệu xác nhận.", grade: "RV", ref: "Q7" },
    { role: "Đã cắt bỏ toàn bộ xương nhiễm khuẩn", text: "Có thể không cần kháng sinh; nếu dùng, không quá 2–5 ngày khi không kèm nhiễm khuẩn mô mềm.", grade: "RV", ref: "Q7" },
  ];
}

export const W_PRINCIPLES: { title: string; items: RxItem[] }[] = [
  {
    title: "Chẩn đoán",
    items: [
      { role: "Chẩn đoán hình ảnh", text: "MRI và một số kỹ thuật xạ hình bạch cầu đánh dấu chính xác nhất; không chụp X-quang/CT thường quy cho mọi trường hợp.", grade: "RV", ref: "Q1" },
      { role: "Dấu ấn viêm", text: "Không dùng thường quy để chẩn đoán (độ chính xác thấp).", grade: "RV", ref: "Q1" },
      { role: "Cấy máu", text: "Khi có triệu chứng toàn thân hoặc yếu tố nguy cơ nhiễm khuẩn huyết; phân lập được S. aureus có thể không cần sinh thiết xương.", grade: "RV", ref: "Q1" },
      { role: "Sinh thiết xương", text: "Mô bệnh học chính xác nếu dương tính; cấy mẫu sinh thiết giúp điều trị đích. Viêm xương cột sống: sinh thiết đĩa đệm/mô cạnh sống cho tỷ lệ dương tính cao hơn sinh thiết xương.", grade: "RV", ref: "Q1; cập nhật 2025 I.2" },
      { role: "Bàn chân đái tháo đường", text: "Nghiệm pháp chạm xương (probe-to-bone) hữu ích; không dùng cấy bề mặt vết thương.", grade: "RV", ref: "Q1" },
    ],
  },
  {
    title: "Theo dõi và lựa chọn khác",
    items: [
      { role: "Theo dõi đáp ứng", text: "Không theo dõi dấu ấn viêm, chẩn đoán hình ảnh nhắc lại thường quy; chụp lại khi thất bại điều trị.", grade: "RV", ref: "Q6" },
      { role: "Thấm xương của thuốc", text: "Không phải tiêu chí chính để chọn thuốc; dựa vào dữ liệu kết cục lâm sàng.", grade: "RV", ref: "Q4" },
      { role: "Dalbavancin, oritavancin", text: "Hiệu quả tương đương, không vượt trội; cân nhắc khi lo ngại tuân thủ, lưu ý chi phí và dữ liệu hạn chế.", grade: "RV", ref: "Q4; cập nhật 2025 II.5" },
    ],
  },
];

/* ================= TRE EM – PIDS/IDSA 2021 ================= */
export const P_DOSE = {
  cefazolin: "100–150 mg/kg/ngày chia mỗi 8 giờ; tối đa 12 g/ngày (mức cao khi nhiễm khuẩn nặng, xâm lấn)",
  ceftaroline: "45 mg/kg/ngày chia mỗi 8 giờ, truyền 1–2 giờ, tối đa 600 mg/liều; tối đa 1,8 g/ngày",
  clindaIV: "30–40 mg/kg/ngày chia mỗi 6–8 giờ; tối đa 2,7 g/ngày",
  dapto: "1 lần/ngày: 12–17 tuổi 7 mg/kg; 7–11 tuổi 9 mg/kg; 1–6 tuổi 12 mg/kg; không khuyến cáo dưới 1 tuổi",
  linezolid: "< 12 tuổi: 30 mg/kg/ngày chia mỗi 8 giờ; ≥ 12 tuổi: 20 mg/kg/ngày chia mỗi 12 giờ; tối đa 1.200 mg/ngày",
  oxaNaf: "100–200 mg/kg/ngày chia mỗi 6 giờ; tối đa 12 g/ngày; ưu tiên truyền qua tĩnh mạch trung tâm (viêm tĩnh mạch)",
  vanco: "40–60 mg/kg/ngày chia mỗi 6–8 giờ; MRSA: đích AUC/MIC > 400; theo dõi nồng độ và chức năng thận",
  amox: "50–100 mg/kg/ngày chia mỗi 8 giờ; tối đa 4 g/ngày (mức cao khi xương hoại tử, áp xe)",
  cephalexin: "75–100 mg/kg/ngày chia 3–4 lần; tối đa 4 g/ngày (một số chuyên gia đến 6 g/ngày chia 4 lần)",
  clindaPO: "30–40 mg/kg/ngày chia 3–4 lần; tối đa 1,8 g/ngày (một số chuyên gia đến 2,7 g/ngày chia 3 lần)",
  levo: "6 tháng – 5 tuổi: 16–20 mg/kg/ngày chia 2 lần; 5–16 tuổi: 8–10 mg/kg/ngày 1 lần; tối đa 750 mg/ngày",
};
const D = P_DOSE;

export type MrsaRate = "low" | "high";
export type Severity = "stable" | "severe";
export function pedsEmpiric(mrsa: MrsaRate, clinda: MrsaRate, sev: Severity): RxItem[] {
  const base: RxItem = { role: "Nguyên tắc", text: "Phác đồ kinh nghiệm phải có tác dụng trên S. aureus; cân nhắc thuốc kháng MRSA cộng đồng theo dữ liệu nhạy cảm tại chỗ và tiền sử nhiễm/mang MRSA.", grade: "S-M", ref: "V.1" };
  const out: RxItem[] = [base];
  if (mrsa === "low") {
    out.push({ role: "Ưu tiên", text: "Cefazolin", dose: D.cefazolin, ref: "Bảng 3", al: "std" });
    out.push({ role: "Ưu tiên", text: "Oxacilin hoặc nafcilin", dose: D.oxaNaf, ref: "Bảng 3", al: "std" });
    out.push({ role: "Dị ứng beta-lactam", text: "Clindamycin", dose: D.clindaIV, ref: "Bảng 4 (thay thế cho MSSA)", al: "alt" });
    out.push({ role: "Dị ứng beta-lactam", text: "Vancomycin", dose: D.vanco, ref: "Bảng 4 (thay thế cho MSSA)", al: "alt" });
  } else if (clinda === "low") {
    out.push({ role: "Ưu tiên", text: "Clindamycin", dose: D.clindaIV, ref: "Bảng 3" });
    out.push({ role: "Trẻ ổn định, theo dõi sát", text: "Cefazolin là lựa chọn hợp lý trong khi chờ kết quả cấy", dose: D.cefazolin, ref: "V – cơ sở khuyến cáo", al: "std" });
  } else if (sev === "stable") {
    out.push({ role: "Trẻ ổn định, không nhiễm độc", text: "Vancomycin", dose: D.vanco, ref: "Bảng 3" });
    out.push({ role: "Trẻ ổn định, không nhiễm độc", text: "Cefazolin", dose: D.cefazolin, ref: "Bảng 3", al: "std" });
    out.push({ role: "Trẻ ổn định, không nhiễm độc", text: "Oxacilin hoặc nafcilin", dose: D.oxaNaf, ref: "Bảng 3", al: "std" });
  } else {
    out.push({ role: "Bệnh vừa – nặng", text: "Vancomycin", dose: D.vanco, ref: "Bảng 3" });
    out.push({ role: "Bệnh vừa – nặng", text: "Daptomycin", dose: D.dapto, ref: "Bảng 3" });
    out.push({ role: "Bệnh vừa – nặng", text: "Ceftarolin", dose: D.ceftaroline, ref: "Bảng 3", al: "std" });
    out.push({ role: "Bệnh vừa – nặng", text: "Linezolid", dose: D.linezolid, ref: "Bảng 3" });
  }
  return out;
}
export const P_CRITICAL: RxItem[] = [
  { role: "Trẻ nguy kịch khi nhập viện (không phụ thuộc tỷ lệ MRSA)", text: "Vancomycin – lựa chọn ban đầu thường dùng", dose: D.vanco, ref: "V bàn luận" },
  { role: "Nhiễm khuẩn huyết nặng – tùy chuyên gia", text: "Vancomycin ± clindamycin (ức chế tổng hợp độc tố), hoặc oxacilin/nafcilin + thuốc kháng MRSA", dose: "Liều từng thuốc theo bảng trên; chưa có dữ liệu so sánh các phối hợp", ref: "V bàn luận" },
];
export const P_KINGELLA: RxItem = { role: "Trẻ tuổi mẫu giáo, nghi K. kingae (vd. viêm xương đầu xương)", text: "Thêm ampicilin, beta-lactam/chất ức chế beta-lactamase (chủng sinh beta-lactamase) hoặc cephalosporin vào phác đồ kháng MRSA; hoặc theo dõi đáp ứng 48–72 giờ với clindamycin/vancomycin rồi mới thêm nếu đáp ứng kém.", ref: "V bàn luận" };
export const P_OTHER: RxItem = { role: "Bệnh hemoglobin, nuôi bò sát, tiêm chủng chưa đủ", text: "Cân nhắc phủ thêm Salmonella, Brucella hoặc H. influenzae typ b; hướng dẫn không nêu phác đồ cụ thể.", ref: "V.1 bình luận; V bàn luận" };

export const P_TIMING: RxItem[] = [
  { role: "Trẻ biểu hiện nặng, tiến triển nhanh", text: "Dùng kháng sinh kinh nghiệm ngay, không chờ thủ thuật xâm lấn (cấy mẫu lấy trong 24–48 giờ sau kháng sinh vẫn cho tỷ lệ dương tính tương đương).", grade: "S-M", ref: "IV.1" },
  { role: "Trẻ không nặng, đã lên kế hoạch chọc hút/sinh thiết", text: "Có thể hoãn kháng sinh không quá 48–72 giờ, theo dõi nội trú.", grade: "C-VL", ref: "IV.2" },
];

export type PAgent = { id: string; label: string; iv: RxItem[]; oral: RxItem[]; notes?: RxItem[]; sa: boolean };
export const P_AGENTS: PAgent[] = [
  {
    id: "mssa", label: "S. aureus nhạy methicilin (MSSA)", sa: true,
    iv: [
      { role: "Ưu tiên", text: "Cefazolin", dose: D.cefazolin, ref: "Bảng 4", al: "std" },
      { role: "Ưu tiên", text: "Oxacilin hoặc nafcilin", dose: D.oxaNaf, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Clindamycin", dose: D.clindaIV, ref: "Bảng 4" },
      { role: "Thay thế", text: "Vancomycin", dose: D.vanco, ref: "Bảng 4" },
      { role: "Thay thế", text: "Ceftarolin", dose: D.ceftaroline, ref: "Bảng 4", al: "std" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Cefalexin", dose: D.cephalexin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Clindamycin", dose: D.clindaPO, ref: "Bảng 4" },
      { role: "Dị ứng beta-lactam, không dung nạp vancomycin, clindamycin và linezolid", text: "Levofloxacin", dose: D.levo, ref: "Bảng 5 chú thích", al: "alt" },
    ],
  },
  {
    id: "mrsa-s", label: "MRSA nhạy clindamycin", sa: true,
    iv: [
      { role: "Ưu tiên", text: "Clindamycin", dose: D.clindaIV, ref: "Bảng 4" },
      { role: "Thay thế", text: "Vancomycin", dose: D.vanco, ref: "Bảng 4" },
      { role: "Thay thế", text: "Daptomycin", dose: D.dapto, ref: "Bảng 4" },
      { role: "Thay thế", text: "Ceftarolin", dose: D.ceftaroline, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Clindamycin", dose: D.clindaPO, ref: "Bảng 4" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
    ],
  },
  {
    id: "mrsa-r", label: "MRSA kháng clindamycin", sa: true,
    iv: [
      { role: "Ưu tiên", text: "Vancomycin", dose: D.vanco, ref: "Bảng 4" },
      { role: "Thay thế", text: "Daptomycin", dose: D.dapto, ref: "Bảng 4" },
      { role: "Thay thế", text: "Ceftarolin", dose: D.ceftaroline, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
      { role: "Thay thế", text: "Chưa đủ dữ liệu lâm sàng để khuyến cáo thuốc uống khác (cotrimoxazol không được IDSA khuyến cáo cho viêm xương tủy trẻ em).", ref: "Bảng 4 chú thích" },
    ],
  },
  {
    id: "strep", label: "Phế cầu nhạy penicilin hoặc liên cầu nhóm A", sa: false,
    iv: [{ role: "Ưu tiên", text: "Penicilin hoặc ampicilin (Bảng liều của hướng dẫn không nêu liều cho viêm xương tủy)", ref: "VIII bàn luận", al: "std" }],
    oral: [{ role: "Uống nối tiếp", text: "Amoxicilin (chưa được nghiên cứu cho viêm xương tủy do phế cầu, liên cầu nhóm A ở trẻ em)", dose: D.amox, ref: "Bảng 5", al: "std" }],
  },
  {
    id: "spn-r", label: "Phế cầu không nhạy penicilin", sa: false,
    iv: [
      { role: "Ưu tiên", text: "Ceftriaxon nếu phòng xét nghiệm báo nhạy", ref: "VIII bàn luận", al: "std" },
      { role: "Theo kháng sinh đồ", text: "Linezolid, ceftarolin, levofloxacin hoặc daptomycin (chưa có dữ liệu tiến cứu)", ref: "VIII bàn luận" },
    ],
    oral: [],
  },
  {
    id: "kk", label: "Kingella kingae", sa: false,
    iv: [{ role: "Lựa chọn", text: "Cephalosporin (K. kingae thường nhạy); kháng clindamycin và vancomycin. Chi tiết: công cụ viêm khớp nhiễm khuẩn (PIDS/IDSA 2023).", ref: "VIII bàn luận", al: "std" }],
    oral: [],
  },
  {
    id: "neg", label: "Không xác định được tác nhân", sa: false,
    iv: [{ role: "Nguyên tắc", text: "Chọn thuốc theo tác nhân có khả năng nhất, phổ tương đương phác đồ đã đáp ứng, ít tác dụng không mong muốn, dung nạp tốt.", grade: "GPS", ref: "VIII.2" }],
    oral: [
      { role: "Đã đáp ứng cefazolin, oxacilin/nafcilin", text: "Cefalexin", dose: D.cephalexin, ref: "X bàn luận", al: "std" },
      { role: "Đã đáp ứng vancomycin", text: "Cefalexin (coi như MSSA) khi tỷ lệ MRSA cộng đồng < 10–20% và trẻ không mang MRSA; hoặc clindamycin (xét tỷ lệ kháng tại chỗ); hoặc hoàn tất vancomycin tĩnh mạch nếu khả năng MRSA cao.", dose: `${D.cephalexin} · clindamycin: ${D.clindaPO}`, ref: "VIII, X bàn luận" },
      { role: "Từng ca", text: "Linezolid hoặc cotrimoxazol", ref: "X bàn luận" },
    ],
  },
];
export const P_DEFINITIVE: RxItem = { role: "Nguyên tắc chọn thuốc đích", text: "Thuốc hiệu quả trên tác nhân, phổ hẹp nhất, ít tác dụng không mong muốn, dung nạp tốt nhất.", grade: "GPS", ref: "VIII.1" };
export const P_DVT: RxItem = { role: "Kèm huyết khối tĩnh mạch sâu", text: "Nhiều chuyên gia dùng thuốc diệt khuẩn như phác đồ viêm nội tâm mạc suốt liệu trình.", ref: "VIII bàn luận" };

export const P_SURGERY: RxItem[] = [
  { role: "Nhiễm khuẩn huyết, tiến triển nhanh", text: "Cắt lọc xương nhiễm khuẩn và áp xe sớm nhất có thể sau chẩn đoán.", grade: "S-M", ref: "VI.1" },
  { role: "Ổn định, áp xe > 2 cm", text: "Đề nghị cắt lọc thay vì chỉ điều trị nội khoa.", grade: "C-VL", ref: "VI.2" },
  { role: "Kháng sinh tại chỗ (bơm, cấy vào ổ mổ)", text: "Không dùng thường quy.", grade: "S-VL", ref: "VII.1" },
];

export const P_ROUTE: RxItem[] = [
  { role: "Đáp ứng với thuốc tiêm", text: "Chuyển kháng sinh uống (thay vì tiêm ngoại trú) khi có thuốc uống phù hợp, có tác dụng trên tác nhân và dung nạp tốt.", grade: "S-L", ref: "X.1" },
  { role: "Thời điểm", text: "Dựa vào diễn biến lâm sàng (sốt, đau, chức năng vận động) kèm CRP giảm; nhiễm khuẩn huyết S. aureus không có biến chứng nội mạch không bắt buộc kéo dài thuốc tiêm.", ref: "IX, X bàn luận" },
  { role: "Không uống được", text: "Chuyển tiêm ngoại trú thay vì nằm viện suốt liệu trình.", grade: "C-VL", ref: "X.2" },
];

export function pedsDuration(sa: boolean): RxItem[] {
  const out: RxItem[] = [];
  out.push({ role: "S. aureus, diễn biến không biến chứng, đáp ứng ban đầu", text: "Tổng 3–4 tuần (tiêm + uống) thay vì dài hơn.", grade: "C-VL", ref: "XI.1" });
  out.push({ role: "Biến chứng hoặc chủng độc lực cao", text: "Có thể cần dài hơn: ≥ 2 xương, ổ nhiễm mô mềm kèm, đáp ứng chậm, > 1 lần phẫu thuật, nhiễm khuẩn huyết ≥ 3 ngày, huyết khối, viêm nội tâm mạc, tổn thương sụn tiếp hợp; chủng USA300, PVL+ (MRSA hoặc MSSA).", ref: "XI.1 bình luận; Bảng 1" });
  if (!sa) out.push({ role: "Tác nhân khác S. aureus", text: "Hướng dẫn không xác định thời gian riêng; quyết định theo diễn biến lâm sàng và CRP.", ref: "XI.1 bình luận" });
  return out;
}

export const P_PRINCIPLES: { title: string; items: RxItem[] }[] = [
  {
    title: "Chẩn đoán",
    items: [
      { role: "Cấy máu", text: "Trước khi dùng kháng sinh.", grade: "S-M", ref: "I.1" },
      { role: "CRP", text: "Khi nhập viện, làm mốc theo dõi.", grade: "C-VL", ref: "I.2" },
      { role: "Procalcitonin", text: "Không đề nghị.", grade: "C-L", ref: "I.3" },
      { role: "X-quang", text: "Chụp xương nghi nhiễm khuẩn.", grade: "S-M", ref: "II.1" },
      { role: "MRI", text: "Khi cần chẩn đoán hình ảnh thêm, ưu tiên hơn xạ hình xương, CT, siêu âm.", grade: "C-VL", ref: "II.2" },
      { role: "Thủ thuật xâm lấn", text: "Chọc hút/sinh thiết xương, ổ mủ để nhuộm Gram và cấy hiếu khí.", grade: "C-M", ref: "III.1" },
    ],
  },
  {
    title: "Theo dõi",
    items: [
      { role: "Đáp ứng điều trị", text: "Khám lâm sàng nhắc lại kèm CRP nhắc lại.", grade: "C-L", ref: "IX.1" },
      { role: "Chẩn đoán hình ảnh cuối đợt", text: "Không chụp MRI (mạnh) và không chụp X-quang thường quy (có ĐK) khi không biến chứng, không tổn thương sụn tiếp hợp; nên chụp khi có biến chứng hoặc tổn thương sụn tiếp hợp.", grade: "S-L", ref: "XII.1–2" },
      { role: "Thất bại hoặc tái phát", text: "Đánh giá lại phổ, liều, thấm thuốc, tuân thủ trước khi mở rộng phổ; đánh giá lại chỉ định phẫu thuật và chẩn đoán.", grade: "GPS", ref: "XIII.1" },
      { role: "Nguy cơ di chứng lâu dài", text: "Theo dõi ít nhất 1 năm bởi chuyên gia.", grade: "C-L", ref: "XIV.1" },
    ],
  },
];
