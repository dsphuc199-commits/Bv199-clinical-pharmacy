/*
  FILE: components/antibiotics/empiric/iai-intl.ts

  Nhiễm khuẩn ổ bụng có biến chứng (viêm phúc mạc thứ phát) ở người lớn – khuyến cáo quốc tế.
  Nguồn (toàn văn, truy cập mở CC-BY):
  - SIS 2024: Huston JM và cs. The Surgical Infection Society Guidelines on the Management of
    Intra-Abdominal Infection: 2024 Update. Surg Infect 2024;25(6):419–435. doi:10.1089/sur.2024.137
    Khuyến cáo GRADE: 1 = mạnh ("We recommend"), 2 = yếu ("We suggest"); A/B/C = chất lượng cao/TB/thấp.
    Gồm khuyến cáo mới 2024 và khuyến cáo 2017 được giữ lại (bảng khuyến cáo trước đây, mức 1-A/1-B).
    SIS 2024 KHÔNG ghi liều.
  - WSES 2021: Sartelli M và cs. WSES/GAIS/SIS-E/WSIS/AAST global clinical pathways for patients with
    intra-abdominal infections. World J Emerg Surg 2021;16:49. doi:10.1186/s13017-021-00387-8
    Liều cho chức năng thận bình thường; phác đồ cộng đồng giống nhau ở các lộ trình thủng tạng rỗng
    (thủng ruột non, viêm túi thừa biến chứng, thủng sau chấn thương); lộ trình riêng cho viêm phúc mạc
    sau mổ và viêm phúc mạc thì ba.

  Quy ước: liều chỉ lấy từ WSES 2021; thuốc SIS 2024 khuyến cáo mà WSES không ghi liều thì để trống liều
  (không tự điền). Thuốc nối "Phối hợp" ở dòng kế tiếp là dùng đồng thời.
  Mức khuyến cáo SIS đổi sang mã hiển thị GRADE chung: 1-A → S-H, 1-B → S-M, 2-A → W-H, 2-B → W-M, 2-C → W-L.
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export const SIS24 = "SIS 2024";
export const WSES21 = "WSES 2021";
const NEW = "khuyến cáo mới 2024";
const UPD = "khuyến cáo cập nhật 2024";
const OLD = "khuyến cáo 2017 giữ lại";
const PATH = "lộ trình thủng tạng rỗng";
const POSTOP = "lộ trình viêm phúc mạc sau mổ";

const METRO: RxItem = { role: "Phối hợp", text: "Metronidazol", dose: "500 mg TM mỗi 8 giờ", ref: PATH };

/* ---------- Phân tầng nguy cơ (SIS) ---------- */
export const IAI_HIGHER_RISK =
  "Nguy cơ cao khi có ít nhất một: nhiễm khuẩn huyết hoặc sốc nhiễm khuẩn, APACHE II ≥ 10 điểm, kiểm soát ổ nhiễm muộn hoặc chưa đủ, nhiễm khuẩn ổ bụng sau mổ, viêm phúc mạc lan tỏa, nhiều bệnh nền (tuổi cao, bệnh ác tính, suy tim mạch, gan, thận, giảm albumin máu) hoặc khả năng mang vi khuẩn kháng thuốc, vi khuẩn không điển hình (đã nằm viện, đã dùng kháng sinh).";
export const IAI_LOWER_RISK = "Nhiễm khuẩn ổ bụng mắc phải cộng đồng, không có tiêu chí nguy cơ cao.";
export const IAI_POSTOP =
  "Nhiễm khuẩn ổ bụng liên quan chăm sóc y tế: viêm phúc mạc sau mổ (thường do bục miệng nối) hoặc viêm phúc mạc kéo dài sau khi đã kiểm soát ổ nhiễm (thì ba).";

/* ---------- Cộng đồng – nguy cơ thấp ---------- */
export const IAI_LOW_SIS: RxItem[] = [
  { role: "Ưu tiên", text: "Cefotaxim hoặc ceftriaxon + metronidazol, hoặc ertapenem", grade: "S-H", ref: OLD },
  { role: "Thay thế", text: "Cefoperazon-sulbactam", grade: "S-M", ref: UPD },
  { role: "Thay thế", text: "Ciprofloxacin + metronidazol", grade: "S-H", ref: UPD },
  { role: "Thay thế", text: "Moxifloxacin đơn trị (kém hiệu quả hơn nhóm beta-lactam ở viêm ruột thừa biến chứng)", grade: "W-H", ref: UPD },
  { role: "Dị ứng beta-lactam nặng", text: "Ciprofloxacin + metronidazol, hoặc moxifloxacin đơn trị", grade: "S-H", ref: OLD },
  { role: "Không dùng", text: "Thêm thuốc phủ Pseudomonas hoặc Enterococcus, hoặc phác đồ phổ rộng hơn", grade: "S-H", ref: OLD },
  { role: "Không dùng", text: "Kháng nấm kinh nghiệm", grade: "W-M", ref: UPD },
  { role: "Nơi tỷ lệ Enterobacterales sinh ESBL cao", text: "Tránh phần lớn phác đồ nền cephalosporin, aztreonam hoặc fluoroquinolon; dùng ertapenem", grade: "S-M", ref: OLD },
];
export const IAI_LOW_WSES: RxItem[] = [
  { role: "Lựa chọn", text: "Ceftriaxon", dose: "2 g TM mỗi 24 giờ", ref: PATH },
  METRO,
  { role: "Lựa chọn", text: "Cefotaxim", dose: "2 g TM mỗi 8 giờ", ref: PATH },
  METRO,
  { role: "Lựa chọn", text: "Amoxicilin/clavulanat (tránh khi Enterobacterales kháng tại chỗ > 20%)", dose: "2,2 g TM mỗi 8 giờ", ref: PATH },
  { role: "Nguy cơ ESBL cộng đồng", text: "Ertapenem", dose: "1 g TM mỗi 24 giờ", ref: PATH },
  { role: "Dị ứng beta-lactam", text: "Ciprofloxacin", dose: "400 mg TM mỗi 8–12 giờ", ref: PATH },
  METRO,
  { role: "Dị ứng beta-lactam", text: "Amikacin", dose: "15–20 mg/kg TM mỗi 24 giờ", ref: PATH },
  METRO,
];

/* ---------- Cộng đồng – nguy cơ cao ---------- */
export const IAI_HIGH_SIS: RxItem[] = [
  { role: "Lựa chọn", text: "Piperacilin-tazobactam", grade: "S-H", ref: OLD },
  { role: "Lựa chọn", text: "Cefepim + metronidazol", grade: "S-H", ref: OLD },
  { role: "Lựa chọn", text: "Imipenem-cilastatin hoặc meropenem", grade: "S-H", ref: OLD },
  { role: "Nơi lưu hành vi khuẩn đa kháng", text: "Carbapenem phổ rộng (doripenem, imipenem-cilastatin, meropenem)", grade: "S-M", ref: OLD },
  { role: "Nguyên tắc", text: "Dùng kháng sinh trong vòng 1 giờ ở người bệnh nguy cơ cao có nhiễm khuẩn huyết", grade: "S-M", ref: UPD },
  { role: "Nguyên tắc", text: "Phủ Enterococcus theo kinh nghiệm", grade: "W-M", ref: UPD },
  { role: "Nấm Candida", text: "Echinocandin (anidulafungin, caspofungin, micafungin) khi bệnh nặng, nghi hoặc xác định Candida", grade: "S-M", ref: OLD },
  { role: "Không dùng", text: "Phác đồ phối hợp nền aminoglycosid", grade: "S-H", ref: UPD },
  { role: "Không dùng", text: "Thêm aminoglycosid hoặc fluoroquinolon vào beta-lactam ở nhiễm khuẩn ổ bụng cộng đồng", grade: "S-M", ref: OLD },
  { role: "Không dùng", text: "Kháng nấm kinh nghiệm thường quy ở nhiễm khuẩn ổ bụng cộng đồng", grade: "S-M", ref: OLD },
  { role: "Không dùng", text: "Vancomycin kinh nghiệm", grade: "S-M", ref: NEW },
  { role: "Không dùng", text: "Tigecyclin kinh nghiệm (chỉ dành cho vi khuẩn kháng thuốc khi không còn lựa chọn)", grade: "S-M", ref: UPD },
];
export const IAI_HIGH_WSES: RxItem[] = [
  { role: "Lựa chọn", text: "Piperacilin/tazobactam (người bệnh nặng)", dose: "Liều nạp 6 g/0,75 g, sau đó 4 g/0,5 g TM mỗi 6 giờ hoặc 16 g/2 g truyền liên tục", ref: PATH },
  { role: "Sốc nhiễm khuẩn, nguy cơ ESBL", text: "Meropenem", dose: "1 g TM mỗi 8 giờ", ref: PATH },
  { role: "Sốc nhiễm khuẩn, nguy cơ ESBL", text: "Imipenem/cilastatin", dose: "500 mg TM mỗi 6 giờ", ref: PATH },
  { role: "Sốc nhiễm khuẩn, nguy cơ ESBL", text: "Doripenem", dose: "500 mg TM mỗi 8 giờ", ref: PATH },
  { role: "Thêm khi nguy cơ Enterococcus", text: "Ampicilin (khi không dùng piperacilin/tazobactam hoặc imipenem/cilastatin)", dose: "2 g TM mỗi 6 giờ", ref: PATH },
];

/* ---------- Sau mổ / thì ba (liên quan chăm sóc y tế) ---------- */
export const IAI_POSTOP_SIS: RxItem[] = [
  { role: "Nguy cơ ESBL", text: "Ceftazidim-avibactam + metronidazol", grade: "S-M", ref: UPD },
  { role: "Nguy cơ ESBL", text: "Ceftolozan-tazobactam (+ metronidazol)", grade: "W-M", ref: UPD },
  { role: "Pseudomonas kháng thuốc", text: "Ceftolozan-tazobactam (+ metronidazol)", grade: "W-L", ref: UPD },
  { role: "Dành cho nguy cơ cao", text: "Imipenem-cilastatin-relebactam, eravacyclin, ceftazidim-avibactam (phổ rộng hơn)", grade: "W-L", ref: NEW },
  { role: "Vi khuẩn Gram âm đa kháng", text: "Polymyxin B", grade: "W-M", ref: UPD },
  { role: "Nguyên tắc", text: "Xuống thang kháng sinh ở người bệnh hồi sức có nhiễm khuẩn ổ bụng liên quan chăm sóc y tế", grade: "W-M", ref: UPD },
  { role: "Nguyên tắc", text: "Giữ phủ kỵ khí khi xuống thang", grade: "W-L", ref: UPD },
  { role: "Nguyên tắc", text: "Xuống thang theo kết quả cấy về thuốc phổ hẹp nhất còn hiệu lực", grade: "S-M", ref: OLD },
  { role: "Không dùng", text: "Vancomycin kinh nghiệm", grade: "S-M", ref: NEW },
];
export const IAI_POSTOP_WSES: RxItem[] = [
  { role: "Không nguy cơ đa kháng", text: "Piperacilin/tazobactam", dose: "Liều nạp 6 g/0,75 g, sau đó 4 g/0,5 g TM mỗi 6 giờ hoặc 16 g/2 g truyền liên tục", ref: POSTOP },
  { role: "Không nguy cơ đa kháng, bệnh nặng", text: "Meropenem (± ampicilin 2 g TM mỗi 6 giờ)", dose: "1 g TM mỗi 8 giờ", ref: POSTOP },
  { role: "Không nguy cơ đa kháng, bệnh nặng", text: "Imipenem/cilastatin", dose: "500 mg TM mỗi 6 giờ", ref: POSTOP },
  { role: "Nguy cơ đa kháng, bệnh nặng", text: "Meropenem 1 g TM mỗi 8 giờ, hoặc imipenem/cilastatin 500 mg TM mỗi 6 giờ, hoặc doripenem 500 mg TM mỗi 8 giờ", ref: POSTOP },
  { role: "Phối hợp", text: "Vancomycin", dose: "Liều nạp 25–30 mg/kg, sau đó 15–20 mg/kg/liều TM mỗi 8 giờ", ref: POSTOP },
  { role: "Hoặc phối hợp", text: "Teicoplanin", dose: "12 mg/kg TM mỗi 12 giờ × 3 liều nạp, sau đó 12 mg/kg mỗi 24 giờ", ref: POSTOP },
  { role: "Nguy cơ đa kháng, không nặng", text: "Eravacyclin (không phủ Pseudomonas)", dose: "1 mg/kg TM mỗi 12 giờ", ref: POSTOP },
  { role: "Phối hợp", text: "Piperacilin/tazobactam", dose: "4,5 g TM mỗi 6 giờ", ref: POSTOP },
  { role: "Enterococcus kháng vancomycin", text: "Linezolid", dose: "600 mg TM mỗi 12 giờ", ref: POSTOP },
  { role: "Pseudomonas đa kháng (không sinh MBL)", text: "Phối hợp ceftolozan/tazobactam", ref: POSTOP },
  { role: "K. pneumoniae sinh carbapenemase", text: "Phối hợp ceftazidim/avibactam", ref: POSTOP },
  { role: "Nguy cơ Candida xâm lấn, ổn định", text: "Fluconazol", dose: "Liều nạp 800 mg, sau đó 400 mg mỗi 24 giờ", ref: POSTOP },
  { role: "Nguy cơ Candida xâm lấn, không ổn định", text: "Caspofungin", dose: "Liều nạp 70 mg, sau đó 50 mg mỗi ngày", ref: POSTOP },
  { role: "Nguy cơ Candida xâm lấn, không ổn định", text: "Anidulafungin", dose: "Liều nạp 200 mg, sau đó 100 mg mỗi ngày", ref: POSTOP },
  { role: "Nguy cơ Candida xâm lấn, không ổn định", text: "Micafungin", dose: "100 mg mỗi ngày", ref: POSTOP },
];
export const IAI_HIGH_LEAD = "Phác đồ kinh nghiệm chung của SIS; ở người bệnh nguy cơ thấp SIS khuyến cáo dùng thuốc phổ hẹp hơn (cột nguy cơ thấp).";
export const IAI_POSTOP_LEAD = "Khuyến cáo SIS cho người bệnh nguy cơ cao, nghi vi khuẩn kháng thuốc; nhiễm khuẩn sau mổ thuộc nhóm nguy cơ cao.";
export const IAI_POSTOP_NOTE = "SIS 2024 khuyến cáo không dùng vancomycin kinh nghiệm (1-B); WSES 2021 đặt vancomycin hoặc teicoplanin trong phác đồ người bệnh nặng có nguy cơ đa kháng.";

/* ---------- Kiểm soát ổ nhiễm, thời gian, quản lý kháng sinh ---------- */
export const IAI_PRINCIPLES: RxItem[] = [
  { role: "Kiểm soát ổ nhiễm", text: "Trong vòng 12 giờ ở người bệnh nguy cơ thấp", grade: "S-M", ref: UPD },
  { role: "Kiểm soát ổ nhiễm", text: "Trong vòng 6 giờ ở người bệnh nguy cơ cao có sốc nhiễm khuẩn", grade: "S-M", ref: UPD },
  { role: "Kiểm soát ổ nhiễm", text: "Mổ lại theo nhu cầu (không mổ lại theo lịch) khi lần mổ đầu đã kiểm soát được ổ nhiễm", grade: "S-M", ref: OLD },
  { role: "Thời gian", text: "Không quá 4 ngày (96 giờ) sau khi kiểm soát ổ nhiễm đầy đủ", grade: "S-H", ref: OLD },
  { role: "Thời gian", text: "4 ngày khi kiểm soát ổ nhiễm bằng dẫn lưu qua da", grade: "S-M", ref: NEW },
  { role: "Thời gian", text: "4 ngày sau kiểm soát ổ nhiễm ở người bệnh nhiễm khuẩn huyết, đái tháo đường, béo phì hoặc bệnh nặng", grade: "S-M", ref: NEW },
  { role: "Thời gian", text: "8 ngày ở người bệnh hồi sức sau khi kiểm soát ổ nhiễm đầy đủ", grade: "W-M", ref: NEW },
  { role: "Thời gian", text: "24 giờ khi thủng ruột do chấn thương được mổ trong 12 giờ, viêm ruột thừa hoặc viêm túi mật cấp, hoại tử chưa thủng", grade: "S-H", ref: OLD },
  { role: "Cấy dịch ổ bụng", text: "Không cấy thường quy ở người bệnh nguy cơ thấp nhiễm khuẩn cộng đồng; không đổi kháng sinh theo kết quả cấy khi đáp ứng tốt", grade: "S-M", ref: OLD },
  { role: "Chuyển uống", text: "Chuyển kháng sinh uống sinh khả dụng tốt khi chức năng tiêu hóa hồi phục; hoàn tất đợt ngắn, không kéo dài", grade: "S-M", ref: OLD },
  { role: "Nguyên tắc", text: "Metronidazol là thuốc kỵ khí ưu tiên trong các phác đồ phối hợp", grade: "S-H", ref: UPD },
  { role: "Nguyên tắc", text: "Liều chuẩn ở người bệnh nguy cơ thấp không béo phì nặng, không suy gan thận đáng kể", grade: "S-M", ref: OLD },
  { role: "Nguyên tắc", text: "Áp dụng phác đồ kinh nghiệm thống nhất của bệnh viện để quản lý sử dụng kháng sinh", grade: "S-M", ref: NEW },
];

export const IAI_SOURCES = [
  "Huston JM và cs. The Surgical Infection Society Guidelines on the Management of Intra-Abdominal Infection: 2024 Update. Surg Infect 2024;25(6):419–435.",
  "Sartelli M và cs. WSES/GAIS/SIS-E/WSIS/AAST global clinical pathways for patients with intra-abdominal infections. World J Emerg Surg 2021;16:49.",
];
