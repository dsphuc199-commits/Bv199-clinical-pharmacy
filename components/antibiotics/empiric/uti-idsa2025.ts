/*
  Nhiem khuan tiet nieu phuc tap – du lieu cong cu theo IDSA 2025 (tab Quoc te).
  Nguon (PDF nguoi dung cung cap): Trautner BW et al. IDSA 2025 Guideline on Management and Treatment of
  Complicated Urinary Tract Infections: Introduction and Methods; CQ1 Selection of Antibiotic Therapy;
  CQ2 Timing of IV to Oral Transition; CQ3 Duration of Antibiotics.
  Thuoc, lieu kinh nghiem dung chung voi empPlan (gnb-bsi-intl.ts). ref = vi tri trong tai lieu goc (khong hien thi).
*/
import type { RxItem } from "./septic-arthritis-pids2023";

const r = (role: string, text: string, grade: string | undefined, ref: string, dose?: string): RxItem => ({ role, text, dose, grade, ref });

export const IDSA_CUTI_DISEASES = ["v8-2", "v8-17"];
export const isIdsaCuti = (diseaseId: string) => IDSA_CUTI_DISEASES.includes(diseaseId);

export const CUTI_CRITERIA = "Nhiễm khuẩn vượt ra ngoài bàng quang: sốt, rét run, huyết động không ổn định, đau hông lưng, đau góc sườn lưng; gồm viêm thận bể thận, nhiễm khuẩn huyết từ đường tiết niệu và nhiễm khuẩn có triệu chứng toàn thân liên quan ống thông tiểu.";
export const CUTI_SCOPE = "Người lớn. Không áp dụng cho viêm tuyến tiền liệt, viêm mào tinh, viêm tinh hoàn. Người có thai, cho con bú, ghép thận, giảm bạch cầu trung tính: cần cá thể hóa.";

export type DurationIn = { bacteremia: boolean; prostatitis: boolean };

export function durationRows(i: DurationIn): RxItem[] {
  const rows: RxItem[] = [];
  if (i.prostatitis) rows.push(r("Nam, nghi viêm tuyến tiền liệt cấp", "10–14 ngày có thể có lợi; bằng chứng còn hạn chế.", undefined, "CQ3 comments"));
  if (i.bacteremia) rows.push(r("Có nhiễm khuẩn huyết Gram âm", "7 ngày thay vì 14 ngày, khi đang cải thiện với thuốc hiệu quả.", "C-L", "CQ3 II"));
  rows.push(
    r("Fluoroquinolon", "5–7 ngày thay vì 10–14 ngày.", "C-M", "CQ3 I"),
    r("Thuốc không phải fluoroquinolon", "7 ngày thay vì 10–14 ngày.", "C-VL", "CQ3 I"),
    r("Cách tính", "Từ ngày đầu tiên dùng kháng sinh có hiệu quả.", undefined, "CQ3 definitions"),
    r("Không cải thiện", "Đánh giá vi khuẩn không nhạy với thuốc, ổ nhiễm khuẩn chưa kiểm soát, xem lại chẩn đoán; lập kế hoạch điều trị dài hơn.", undefined, "Figure 1.3"),
  );
  return rows;
}

export const DURATION_NOTES = [
  "Cá thể hóa thời gian khi có ống thông tiểu, sepsis nặng, suy giảm miễn dịch, áp xe đường tiết niệu, bệnh thận mạn, tắc nghẽn hoàn toàn hoặc phẫu thuật tiết niệu.",
  "Beta-lactam uống đợt ngắn có ít bằng chứng hơn và có thể cần liều cao hơn.",
];

export const SWITCH_ROWS: RxItem[] = [
  r("Khuyến cáo", "Chuyển sang kháng sinh uống hiệu quả thay vì tiếp tục đường tiêm đến hết đợt.", "C-L", "CQ2 I"),
  r("Có nhiễm khuẩn huyết Gram âm", "Vẫn chuyển uống được khi hết sốt, huyết động ổn định, đã giải quyết tắc nghẽn; thuốc uống phải đạt nồng độ điều trị trong máu, nước tiểu và mô.", "C-VL", "CQ2 II"),
  r("Điều kiện", "Lâm sàng cải thiện; đã kiểm soát ổ nhiễm khuẩn nếu có; hấp thu đường uống tốt; có thuốc uống nhạy, đạt nồng độ tại ổ nhiễm khuẩn.", undefined, "CQ2 pharmacologic issues"),
  r("Không nên chuyển", "Kém hấp thu, hội chứng ruột ngắn, liệt ruột, tiêu chảy nặng, nôn, chậm làm rỗng dạ dày, giảm tưới máu ruột do sốc.", undefined, "CQ2 pharmacologic issues"),
  r("Chưa có kháng sinh đồ", "Chọn theo vi khuẩn nghi ngờ và đáp ứng với thuốc đang dùng; ví dụ đáp ứng với ceftriaxon có thể chuyển cephalosporin thế hệ 3 đường uống.", undefined, "CQ2 pharmacologic issues"),
  r("Nam giới có sốt", "Chọn thuốc thấm tốt vào tuyến tiền liệt: fluoroquinolon, sulfonamid. Không dùng nitrofurantoin.", undefined, "CQ2 males"),
  r("Tương tác", "Fluoroquinolon: tránh dùng cùng calci, sắt, magnesi, sucralfat.", undefined, "CQ2 pharmacologic issues"),
  r("Suy thận nặng", "Trao đổi với dược sĩ khi lập kế hoạch chuyển đường uống.", undefined, "CQ2 pharmacologic issues"),
];

export const ORAL_HIGH_DOSE = "Liều beta-lactam uống được xem là đủ sinh khả dụng trong một nghiên cứu nhiễm khuẩn huyết từ đường tiết niệu: amoxicilin 1.000 mg mỗi 8 giờ, amoxicilin-acid clavulanic 875–1.000 mg mỗi 8 giờ, cefalexin 1.000 mg mỗi 6 giờ.";

/* Bang 3.1 – hap thu duong uong va thai qua nuoc tieu (%). */
export const ORAL_PK: [string, string, string][] = [
  ["Amoxicilin-acid clavulanic", "80 (amoxicilin); thay đổi (clavulanat)", "50–70 (amoxicilin); 25–40 (clavulanat)"],
  ["Cefixim", "50", "50"],
  ["Cefpodoxim", "50", "80"],
  ["Ceftibuten", "75–90", "73"],
  ["Cefuroxim", "52", "90"],
  ["Cefalexin", "90", "90"],
  ["Ciprofloxacin", "70", "40–50"],
  ["Levofloxacin", "99", "64–100"],
  ["Trimethoprim-sulfamethoxazol", "70–90", "84 (sulfamethoxazol); 66 (trimethoprim)"],
];

export const OTHER_DRUGS: RxItem[] = [
  r("Thay thế, không đầu tay", "Fosfomycin tĩnh mạch", undefined, "CQ1 10; Table 2.1", "6 g TM mỗi 8 giờ"),
  r("Lưu ý fosfomycin", "Chỉ dùng khi không có nguy cơ kháng fosfomycin. Thận trọng khi suy tim: tải natri cao, hạ kali máu.", undefined, "CQ1 10"),
  r("Colistin", "Hiếm khi dùng kinh nghiệm vì độc thận.", undefined, "CQ1 10"),
  r("Polymyxin B", "Không dùng cho nhiễm khuẩn tiết niệu vì thải trừ chủ yếu ngoài thận.", undefined, "CQ1 10"),
  r("Beta-lactam uống khác", "Amoxicilin, cefadroxil, cefaclor, cefdinir: chỉ cân nhắc cùng dược sĩ chuyên về bệnh nhiễm khi không có lựa chọn khác.", undefined, "Table 3.1"),
];
