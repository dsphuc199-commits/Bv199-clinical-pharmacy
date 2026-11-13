/*
  Viem khop nhiem khuan cap o tre em 1 thang – 17 tuoi – PIDS/IDSA 2023
  (Woods CR et al. J Pediatric Infect Dis Soc 2024;13(1):1–59).
  - Muc khuyen cao GRADE: S = manh, C = co dieu kien; do tin cay H/M/L/VL; GPS = thuc hanh tot.
    Ma hoa: "S-M", "C-VL", "GPS". Khong ghi grade = lua chon trong bang thuoc / phan phan tich (khong xep muc).
  - Lieu: Bang 5 (mg/kg/ngay, toi da/ngay nguoi lon). Thuoc theo tac nhan: Bang 4.
  - ref: vi tri trong huong dan, chi luu de doi chieu (khong hien thi).
  - al: "std" = beta-lactam (an khi di ung beta-lactam); "alt" = chi hien khi di ung.
*/

export type RxItem = { role: string; text: string; dose?: string; grade?: string; ref: string; al?: "std" | "alt" };

/* ---------- Lieu (Bang 5) ---------- */
export const PIDS_DOSE = {
  ampicillin: "200 mg/kg/ngày chia mỗi 6 giờ; tối đa 8 g/ngày",
  cefazolin: "100–150 mg/kg/ngày chia mỗi 8 giờ; tối đa 12 g/ngày (mức cao khi nhiễm tụ cầu xâm lấn, dẫn lưu chưa đủ)",
  ceftaroline: "45 mg/kg/ngày chia mỗi 8 giờ, truyền 1–2 giờ; tối đa 1,8 g/ngày",
  ceftriaxone: "50–100 mg/kg/ngày, 1 lần hoặc chia mỗi 12 giờ; tối đa 4 g/ngày",
  ciproIV: "16–20 mg/kg/ngày chia mỗi 12 giờ; tối đa 800 mg/ngày",
  ciproPO: "30 mg/kg/ngày chia mỗi 12 giờ; tối đa 1,5 g/ngày",
  clindaIV: "30–40 mg/kg/ngày chia mỗi 6–8 giờ; tối đa 2,7 g/ngày",
  clindaPO: "30–40 mg/kg/ngày chia 3–4 lần; tối đa 1,8 g/ngày (một số chuyên gia đến 2,7 g/ngày)",
  daptomycin: "1 lần/ngày: 12–17 tuổi 7 mg/kg; 7–11 tuổi 9 mg/kg; 1–6 tuổi 12 mg/kg; không khuyến cáo dưới 1 tuổi",
  levofloxacin: "≥ 5 tuổi: 10 mg/kg/ngày, 1 lần; 6 tháng – < 5 tuổi: 20 mg/kg/ngày chia mỗi 12 giờ; tối đa 750 mg/ngày",
  linezolid: "≥ 12 tuổi: 20 mg/kg/ngày chia mỗi 12 giờ; < 12 tuổi: 30 mg/kg/ngày chia mỗi 8 giờ; tối đa 1.200 mg/ngày",
  moxifloxacin: "Chia mỗi 12 giờ: 6 – < 18 tuổi 8 mg/kg/ngày; 2 – < 6 tuổi 10 mg/kg/ngày; < 2 tuổi 12 mg/kg/ngày; tối đa 400 mg/ngày",
  oxaNafcillin: "100–200 mg/kg/ngày chia mỗi 6 giờ; tối đa 12 g/ngày",
  penicillinG: "200.000–300.000 UI/kg/ngày chia mỗi 4–6 giờ; tối đa 20 triệu UI/ngày",
  vancomycin: "40–60 mg/kg/ngày chia mỗi 6–8 giờ; MRSA: đích AUC/MIC > 400; theo dõi nồng độ thuốc và chức năng thận",
  amoxicillin: "50–100 mg/kg/ngày chia mỗi 8 giờ; tối đa 4 g/ngày",
  cephalexin: "75–100 mg/kg/ngày chia 3–4 lần; tối đa 4 g/ngày (một số chuyên gia đến 6 g/ngày)",
  doxy: "4 mg/kg/ngày chia mỗi 12 giờ; tối đa 200 mg/ngày; thường không dùng thường quy dưới 8 tuổi",
  tmpSmx: "12 mg/kg/ngày (thành phần trimethoprim) chia mỗi 12 giờ; theo dõi công thức máu khi dùng dài ngày",
};
const D = PIDS_DOSE;

/* Bang lieu day du (tham chieu nhanh). */
export const PIDS_DOSE_TABLE: { drug: string; route: string; dose: string }[] = [
  { drug: "Ampicilin", route: "TM", dose: D.ampicillin },
  { drug: "Cefazolin", route: "TM", dose: D.cefazolin },
  { drug: "Ceftarolin", route: "TM", dose: D.ceftaroline },
  { drug: "Ceftriaxon", route: "TM", dose: D.ceftriaxone },
  { drug: "Ciprofloxacin", route: "TM", dose: D.ciproIV },
  { drug: "Ciprofloxacin", route: "Uống", dose: D.ciproPO },
  { drug: "Clindamycin", route: "TM", dose: D.clindaIV },
  { drug: "Clindamycin", route: "Uống", dose: D.clindaPO },
  { drug: "Daptomycin", route: "TM", dose: D.daptomycin },
  { drug: "Levofloxacin", route: "TM/uống", dose: D.levofloxacin },
  { drug: "Linezolid", route: "TM/uống", dose: D.linezolid },
  { drug: "Moxifloxacin", route: "TM", dose: D.moxifloxacin },
  { drug: "Oxacilin, nafcilin", route: "TM", dose: D.oxaNafcillin },
  { drug: "Penicilin G", route: "TM", dose: D.penicillinG },
  { drug: "Vancomycin", route: "TM", dose: D.vancomycin },
  { drug: "Amoxicilin", route: "Uống", dose: D.amoxicillin },
  { drug: "Cefalexin", route: "Uống", dose: D.cephalexin },
  { drug: "Doxycyclin, minocyclin", route: "Uống", dose: D.doxy },
  { drug: "Cotrimoxazol", route: "Uống", dose: D.tmpSmx },
];
export const PIDS_DOSE_NOTES = [
  "Fluoroquinolon dưới 18 tuổi: thận trọng vì nguy cơ độc tính trên sụn.",
  "Linezolid dùng trên 2 tuần: kiểm tra tiểu cầu và bạch cầu hằng tuần.",
  "Có thể cần chỉnh liều khi suy thận hoặc suy gan. Phối hợp kháng sinh chưa được đánh giá tiến cứu – hội chẩn chuyên khoa truyền nhiễm.",
];

/* ---------- Kinh nghiem ---------- */
export const PIDS_AGES = [
  { id: "1m6m", label: "1 – < 6 tháng" },
  { id: "6m48m", label: "6 – 48 tháng" },
  { id: "gt48m", label: "> 48 tháng" },
] as const;
export type PidsAge = (typeof PIDS_AGES)[number]["id"];

export const PIDS_TIMING: RxItem[] = [
  { role: "Trẻ biểu hiện nặng, tiến triển nhanh", text: "Dùng kháng sinh ngay sau cấy máu, không chờ chọc dịch khớp; thủ thuật xâm lấn làm sớm nhất có thể.", grade: "S-M", ref: "IV.1" },
  { role: "Trẻ không biểu hiện nặng", text: "Có thể chờ chọc hút dịch khớp rồi mới dùng kháng sinh, dưới theo dõi chặt.", grade: "C-VL", ref: "IV.2" },
];

export type PidsContext = { id: string; label: string; items: RxItem[]; notes?: string[] };
export const PIDS_CONTEXTS: PidsContext[] = [
  {
    id: "lowmrsa", label: "Tỷ lệ MRSA cộng đồng tại chỗ thấp (< ~10%)",
    items: [
      { role: "Nguyên tắc", text: "Phác đồ kinh nghiệm luôn có tác dụng trên S. aureus.", grade: "S-M", ref: "V.1" },
      { role: "Bệnh nhẹ – vừa", text: "Oxacilin, nafcilin hoặc cefazolin; theo dõi sát đáp ứng.", ref: "V bàn luận", al: "std" },
    ],
  },
  {
    id: "highmrsa", label: "Tỷ lệ MRSA cộng đồng ≥ 10–20%, hoặc bệnh cảnh nặng",
    items: [
      { role: "Nguyên tắc", text: "Phác đồ kinh nghiệm luôn có tác dụng trên S. aureus; cân nhắc thuốc có tác dụng trên MRSA cộng đồng theo dữ liệu nhạy cảm tại chỗ và mức độ nặng.", grade: "S-M", ref: "V.1" },
      { role: "Thuốc có tác dụng trên MRSA", text: "Clindamycin (nếu tỷ lệ kháng clindamycin tại chỗ không cao), vancomycin, daptomycin, ceftarolin hoặc linezolid.", ref: "V bàn luận" },
      { role: "Chủng có thể nhạy cả clindamycin và vancomycin", text: "Ưu tiên clindamycin (an toàn hơn, có dạng uống).", ref: "V bàn luận" },
      { role: "Nhiễm khuẩn nặng, cần phủ thêm Gram âm", text: "Phối hợp nhiều thuốc để mở rộng phổ là phù hợp; ceftarolin có tác dụng trên MRSA và Hib, E. coli, K. kingae.", ref: "V bàn luận" },
    ],
  },
];
export const PIDS_KINGELLA: RxItem = {
  role: "Trẻ 6–48 tháng: phủ K. kingae",
  text: "Phác đồ cần có tác dụng trên K. kingae. Oxacilin, nafcilin, clindamycin, vancomycin, daptomycin, linezolid không đủ tác dụng: thêm ampicilin hoặc cephalosporin (cefazolin, cefuroxim, cefotaxim, ceftriaxon).",
  grade: "C-VL", ref: "V.2",
};

/* ---------- Theo tac nhan (Bang 4) ---------- */
export type PidsDur = "std" | "spnR" | "gc" | "presumed";
export type PidsAgent = { id: string; label: string; iv: RxItem[]; oral: RxItem[]; notes?: RxItem[]; dur: PidsDur };

export const PIDS_AGENTS: PidsAgent[] = [
  {
    id: "mssa", label: "S. aureus nhạy methicilin (MSSA)", dur: "std",
    iv: [
      { role: "Ưu tiên", text: "Cefazolin", dose: D.cefazolin, ref: "Bảng 4", al: "std" },
      { role: "Ưu tiên", text: "Oxacilin hoặc nafcilin", dose: D.oxaNafcillin, ref: "Bảng 4", al: "std" },
      { role: "Không dùng được beta-lactam", text: "Clindamycin (chủng nhạy)", dose: D.clindaIV, ref: "IX bàn luận" },
      { role: "Thay thế", text: "Vancomycin", dose: D.vancomycin, ref: "Bảng 4" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Cefalexin", dose: D.cephalexin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Clindamycin", dose: D.clindaPO, ref: "Bảng 4" },
    ],
  },
  {
    id: "mrsa-s", label: "MRSA nhạy clindamycin", dur: "std",
    iv: [
      { role: "Ưu tiên", text: "Clindamycin", dose: D.clindaIV, ref: "Bảng 4" },
      { role: "Thay thế", text: "Ceftarolin", dose: D.ceftaroline, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Vancomycin", dose: D.vancomycin, ref: "Bảng 4" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Clindamycin", dose: D.clindaPO, ref: "Bảng 4" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
      { role: "Thay thế", text: "Doxycyclin hoặc minocyclin", dose: D.doxy, ref: "Bảng 4" },
      { role: "Thay thế", text: "Cotrimoxazol", dose: D.tmpSmx, ref: "Bảng 4" },
    ],
  },
  {
    id: "mrsa-r", label: "MRSA kháng clindamycin", dur: "std",
    iv: [
      { role: "Ưu tiên", text: "Ceftarolin", dose: D.ceftaroline, ref: "Bảng 4", al: "std" },
      { role: "Ưu tiên", text: "Vancomycin", dose: D.vancomycin, ref: "Bảng 4" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
      { role: "Thay thế", text: "Daptomycin", dose: D.daptomycin, ref: "Bảng 4" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
      { role: "Thay thế", text: "Doxycyclin hoặc minocyclin", dose: D.doxy, ref: "Bảng 4" },
      { role: "Thay thế", text: "Cotrimoxazol", dose: D.tmpSmx, ref: "Bảng 4" },
    ],
    notes: [{ role: "Đường dùng", text: "Một số trẻ cần dùng đường tiêm suốt liệu trình.", ref: "Bảng 4" }],
  },
  {
    id: "gas", label: "Liên cầu nhóm A", dur: "std",
    iv: [
      { role: "Ưu tiên", text: "Penicilin G", dose: D.penicillinG, ref: "Bảng 4", al: "std" },
      { role: "Ưu tiên", text: "Ampicilin", dose: D.ampicillin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Cefazolin", dose: D.cefazolin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Ceftriaxon", dose: D.ceftriaxone, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Clindamycin", dose: D.clindaIV, ref: "Bảng 4" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Amoxicilin", dose: D.amoxicillin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Penicilin V", ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Cefalexin", dose: D.cephalexin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Clindamycin", dose: D.clindaPO, ref: "Bảng 4" },
    ],
  },
  {
    id: "kk", label: "Kingella kingae", dur: "std",
    iv: [
      { role: "Ưu tiên", text: "Ampicilin", dose: D.ampicillin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Cefazolin", dose: D.cefazolin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Ceftriaxon", dose: D.ceftriaxone, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Ceftarolin", dose: D.ceftaroline, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Ciprofloxacin", dose: D.ciproIV, ref: "Bảng 4" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Amoxicilin", dose: D.amoxicillin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Amoxicilin-acid clavulanic", ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Cefalexin", dose: D.cephalexin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Ciprofloxacin", dose: D.ciproPO, ref: "Bảng 4" },
      { role: "Thay thế", text: "Cotrimoxazol", dose: D.tmpSmx, ref: "Bảng 4" },
    ],
    notes: [
      { role: "Đề kháng", text: "Kháng vancomycin; thường kháng clindamycin và linezolid; không nhạy penicilin kháng tụ cầu.", ref: "IX bàn luận" },
      { role: "Beta-lactamase", text: "Khoảng 5% chủng sinh beta-lactamase, có thể không nhạy ampicilin hoặc cephalosporin thế hệ 1.", ref: "XII bàn luận" },
    ],
  },
  {
    id: "nm", label: "Neisseria meningitidis", dur: "std",
    iv: [
      { role: "Ưu tiên", text: "Penicilin G", dose: D.penicillinG, ref: "Bảng 4", al: "std" },
      { role: "Ưu tiên", text: "Ampicilin", dose: D.ampicillin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Ceftriaxon", dose: D.ceftriaxone, ref: "Bảng 4", al: "std" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Amoxicilin", dose: D.amoxicillin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Penicilin V", ref: "Bảng 4", al: "std" },
    ],
    notes: [
      { role: "Chưa có kháng sinh đồ", text: "Một số chuyên gia dùng cephalosporin thế hệ 3 theo kinh nghiệm do đề kháng penicilin đang xuất hiện.", ref: "IX bàn luận" },
      { role: "Không dùng ceftriaxon", text: "Cần phác đồ diệt người lành mang vi khuẩn ở mũi họng.", ref: "IX bàn luận" },
    ],
  },
  {
    id: "gc", label: "Neisseria gonorrhoeae", dur: "gc",
    iv: [
      { role: "Ưu tiên", text: "Ceftriaxon", dose: D.ceftriaxone, ref: "Bảng 4", al: "std" },
      { role: "Dị ứng cephalosporin", text: "Theo phác đồ CDC hiện hành.", ref: "Bảng 4", al: "alt" },
    ],
    oral: [{ role: "Uống nối tiếp, khi có kháng sinh đồ", text: "Cefixim; fluoroquinolon nếu chủng nhạy.", ref: "Bảng 4; IX bàn luận" }],
    notes: [
      { role: "Đề kháng", text: "Kháng fluoroquinolon lan rộng; đã có chủng kháng ceftriaxon và cefixim.", ref: "Bảng 4" },
      { role: "Sàng lọc", text: "Các bệnh lây truyền qua đường tình dục khác, gồm HIV và giang mai.", ref: "IX bàn luận" },
    ],
  },
  {
    id: "spn-s", label: "Phế cầu nhạy penicilin (MIC < 2 mcg/mL)", dur: "std",
    iv: [
      { role: "Ưu tiên", text: "Penicilin G", dose: D.penicillinG, ref: "Bảng 4", al: "std" },
      { role: "Ưu tiên", text: "Ampicilin", dose: D.ampicillin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Ceftriaxon", dose: D.ceftriaxone, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Levofloxacin", dose: D.levofloxacin, ref: "Bảng 4" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
      { role: "Thay thế", text: "Clindamycin (nếu nhạy)", dose: D.clindaIV, ref: "Bảng 4" },
      { role: "Dị ứng beta-lactam, không dung nạp vancomycin hoặc clindamycin", text: "Levofloxacin hoặc moxifloxacin", dose: D.moxifloxacin, ref: "Bảng 4 chú thích", al: "alt" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Amoxicilin hoặc penicilin V", dose: D.amoxicillin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Cefalexin", dose: D.cephalexin, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Levofloxacin", dose: D.levofloxacin, ref: "Bảng 4" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
      { role: "Thay thế", text: "Clindamycin (nếu nhạy)", dose: D.clindaPO, ref: "Bảng 4" },
    ],
  },
  {
    id: "spn-r", label: "Phế cầu giảm nhạy penicilin (MIC ≥ 2 mcg/mL)", dur: "spnR",
    iv: [
      { role: "Ưu tiên", text: "Ceftriaxon (nếu MIC ceftriaxon ≤ 1 mcg/mL)", dose: D.ceftriaxone, ref: "Bảng 4", al: "std" },
      { role: "Thay thế", text: "Clindamycin (nếu nhạy)", dose: D.clindaIV, ref: "Bảng 4" },
      { role: "Thay thế", text: "Levofloxacin", dose: D.levofloxacin, ref: "Bảng 4" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
    ],
    oral: [
      { role: "Ưu tiên", text: "Clindamycin (nếu nhạy)", dose: D.clindaPO, ref: "Bảng 4" },
      { role: "Ưu tiên", text: "Levofloxacin", dose: D.levofloxacin, ref: "Bảng 4" },
      { role: "Thay thế", text: "Linezolid", dose: D.linezolid, ref: "Bảng 4" },
    ],
  },
  {
    id: "presumed", label: "Không xác định được tác nhân (cấy, PCR âm tính)", dur: "presumed",
    iv: [{ role: "Nguyên tắc", text: "Chọn thuốc theo tác nhân có khả năng nhất, phổ tương đương phác đồ kinh nghiệm mà trẻ đã đáp ứng, ít tác dụng không mong muốn và dễ dung nạp nhất.", grade: "GPS", ref: "IX.2" }],
    oral: [{ role: "Chuyển uống", text: "Theo cùng tiêu chí như khi có tác nhân; thuốc uống có phổ tương đương thuốc tiêm đã đáp ứng.", ref: "XI bàn luận" }],
    notes: [{ role: "Sau 48–72 giờ cấy âm tính", text: "Đánh giá lại chẩn đoán, tìm nguyên nhân khác.", ref: "IX bàn luận" }],
  },
];

export const PIDS_DEFINITIVE_PRINCIPLE: RxItem = {
  role: "Nguyên tắc chọn thuốc đích",
  text: "Thuốc có hiệu quả trên tác nhân, phổ hẹp nhất, ít tác dụng không mong muốn và dễ dung nạp nhất.",
  grade: "GPS", ref: "IX.1",
};

/* ---------- Duong dung, thoi gian ---------- */
export const PIDS_ROUTE: RxItem[] = [
  { role: "Đáp ứng với thuốc tiêm", text: "Chuyển sang kháng sinh uống (thay vì tiêm ngoại trú) khi có thuốc uống phù hợp, dung nạp tốt và có tác dụng trên tác nhân.", grade: "S-L", ref: "XI.1" },
  { role: "Tiêu chí đáp ứng", text: "Sốt giảm rõ; dấu hiệu viêm tại khớp cải thiện, vận động khớp hồi phục một phần; dấu hiệu nhiễm khuẩn huyết (nếu có) cải thiện; CRP giảm là tiêu chí hỗ trợ.", ref: "XI bàn luận" },
  { role: "Không uống được", text: "Chuyển kháng sinh tiêm ngoại trú thay vì nằm viện suốt liệu trình.", grade: "C-VL", ref: "XI.2" },
];

export function pidsDuration(dur: PidsDur | null, osteo: boolean): RxItem[] {
  if (osteo) return [{ role: "Kèm viêm xương kế cận", text: "Điều trị theo hướng dẫn viêm xương tủy cấp (PIDS/IDSA 2021).", ref: "XII.1" }];
  if (dur === "gc") return [{ role: "Lậu cầu", text: "7–14 ngày; chủng nhạy hoàn toàn: tổng 7–10 ngày, có thể hoàn tất bằng thuốc uống.", ref: "Bảng 4; XII bàn luận" }];
  if (dur === "spnR") return [{ role: "Phế cầu giảm nhạy penicilin", text: "14–21 ngày.", ref: "Bảng 4" }];
  const out: RxItem[] = [];
  if (dur === "presumed") out.push({ role: "Đáp ứng nhanh, CRP giảm dần đến cuối tuần 1", text: "Tổng (tiêm + uống) có thể ngắn 10–14 ngày.", grade: "C-VL", ref: "XII.2" });
  else out.push({ role: "Đáp ứng nhanh, CRP giảm dần đến cuối tuần 1", text: "Tổng (tiêm + uống) có thể ngắn 10–14 ngày (S. aureus, liên cầu nhóm A, phế cầu, Hib).", grade: "C-L", ref: "XII.1" });
  out.push({ role: "Đáp ứng chậm, kiểm soát ổ nhiễm kém, CRP cao kéo dài", text: "21–28 ngày; thường gặp hơn với trực khuẩn Gram âm và chủng S. aureus độc lực cao.", ref: "XII.1 bình luận" });
  return out;
}

/* ---------- Nguyen tac chung ---------- */
export const PIDS_PRINCIPLES: { title: string; items: RxItem[] }[] = [
  {
    title: "Chẩn đoán",
    items: [
      { role: "Cấy máu", text: "Trước khi dùng kháng sinh.", grade: "S-M", ref: "I.1" },
      { role: "CRP", text: "Định lượng khi nhập viện để làm mốc theo dõi.", grade: "C-VL", ref: "I.2" },
      { role: "Procalcitonin", text: "Không đề nghị định lượng.", grade: "C-L", ref: "I.3" },
      { role: "X-quang", text: "Chụp khớp và xương kế cận.", grade: "S-M", ref: "II.1" },
      { role: "Siêu âm", text: "Khi cần xác định tràn dịch (nhất là háng, vai), trước các kỹ thuật phức tạp hơn.", grade: "S-M", ref: "II.2" },
      { role: "MRI", text: "Khi cần đánh giá viêm xương, viêm cơ mủ kế cận.", grade: "C-VL", ref: "II.3" },
      { role: "Chọc hút dịch khớp", text: "Trước kháng sinh kinh nghiệm.", grade: "C-M", ref: "III.1" },
      { role: "Xét nghiệm dịch khớp", text: "Tế bào và công thức bạch cầu, nhuộm Gram, cấy hiếu khí.", grade: "S-M", ref: "III.2" },
    ],
  },
  {
    title: "Theo dõi và xử trí không đáp ứng",
    items: [
      { role: "Theo dõi đáp ứng", text: "Khám lâm sàng nhắc lại kết hợp CRP nhắc lại (2–3 ngày/lần đến khi giảm rõ).", grade: "C-L", ref: "X.1" },
      { role: "Đáp ứng kém sau 48–96 giờ", text: "Chụp MRI nếu chưa làm, tìm viêm xương, viêm cơ mủ, áp xe.", grade: "C-VL", ref: "VI.1" },
      { role: "Còn ổ nhiễm", text: "Làm thêm thủ thuật xâm lấn để kiểm soát ổ nhiễm.", grade: "C-VL", ref: "VI.2" },
      { role: "Thất bại hoặc tái phát", text: "Đánh giá lại phổ, liều, nồng độ tại ổ nhiễm, tuân thủ và mức độ dẫn lưu trước khi mở rộng phổ; tìm viêm xương kế cận.", grade: "GPS", ref: "XIV.1" },
      { role: "Chẩn đoán hình ảnh kiểm tra", text: "Không chụp thường quy khi hồi phục hoàn toàn.", grade: "C-VL", ref: "XIII.1" },
      { role: "Tái khám", text: "Đến khi xong kháng sinh và khớp hồi phục chức năng; đáp ứng nhanh: thường không cần quá 2–3 tuần từ khi bắt đầu điều trị.", grade: "C-VL", ref: "XV.1" },
    ],
  },
  {
    title: "Không khuyến cáo",
    items: [
      { role: "Kháng sinh nội khớp", text: "Không dùng thường quy.", grade: "S-VL", ref: "VII.1" },
      { role: "Corticoid bổ trợ", text: "Không đề nghị dùng. GEIO–SEIMC 2024 có quan điểm khác (B-I) – cần hội chẩn.", grade: "C-VL", ref: "VIII.1" },
    ],
  },
];
