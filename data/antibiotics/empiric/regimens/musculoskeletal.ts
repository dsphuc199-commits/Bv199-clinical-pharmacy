/*
  FILE: data/antibiotics/empiric/regimens/musculoskeletal.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015), Chuong 6 Nhiem khuan co - xuong - khop.
  - Viem khop nhiem khuan: tr. 162-165 (v8-33)
  - Viem xuong tuy: tr. 166-168 (v8-32)

  Sap xep tinh huong theo TRINH TU QUYET DINH cua van ban (11/2026):
    Viem khop: (1) ban dau, chua co ket qua cay / nhuom Gram cau khuan Gram duong
               (2) nghi/xac dinh MRSA  (3) nghi/xac dinh truc khuan mu xanh
               (4) theo ket qua cay va khang sinh do  (5) do lau cau
    Viem xuong tuy: (1) tu cau vang nhay methicilin - tac nhan hang dau
               (2) MRSA  (3) truc khuan mu xanh  (4) nhieu vi khuan sau dong dinh noi tuy
               (5) Gram am duong ruot
  Thuoc / lieu / thoi gian / ghi chu: NGUYEN VAN, khong doi so voi ban truoc.
  Truong `condition`: dieu kien ap dung rieng cua tung phuong an trong cung tinh huong.
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");

const JT = "Viêm khớp nhiễm khuẩn, mục 4.2.1a";
const JG = "Viêm khớp nhiễm khuẩn, mục 4.2.1b";
const OS = "Viêm xương tủy, mục 4.2.1a";

/* Ten tinh huong (hien trong bo chon "Bệnh cảnh lâm sàng"). */
export const SA_EMPIRIC = "Viêm khớp không do lậu cầu – điều trị ban đầu (chưa có kết quả cấy; nhuộm Gram dịch khớp thấy cầu khuẩn Gram dương)";
export const SA_MRSA = "Viêm khớp không do lậu cầu – nghi ngờ hoặc xác định tụ cầu vàng kháng methicilin (MRSA)";
export const SA_PSEUDO = "Viêm khớp không do lậu cầu – nghi ngờ hoặc xác định trực khuẩn mủ xanh (P. aeruginosa)";
export const SA_CULTURE = "Viêm khớp không do lậu cầu – điều chỉnh theo kết quả cấy máu, dịch khớp và kháng sinh đồ";
export const SA_GC = "Viêm khớp do lậu cầu (N. gonorrhoeae)";

export const OS_MSSA = "Viêm xương tủy – tụ cầu vàng nhạy methicilin (MSSA), tác nhân hàng đầu";
export const OS_MRSA = "Viêm xương tủy – tụ cầu vàng kháng methicilin (MRSA)";
export const OS_PSEUDO = "Viêm xương tủy – trực khuẩn mủ xanh (P. aeruginosa)";
export const OS_POLY = "Viêm xương tủy – nhiễm nhiều vi khuẩn sau đóng đinh nội tủy xương dài";
export const OS_GRAMNEG = "Viêm xương tủy – trực khuẩn Gram âm đường ruột";

export const MUSCULOSKELETAL: Regimen[] = [
  // ===== Viêm khớp nhiễm khuẩn không do lậu cầu (v8-33) =====
  // (1) Điều trị ban đầu
  r(JT, "tr. 164", "r-sa-empiric-1", ["v8-33"], SA_EMPIRIC, "first",
    [d("Oxacilin hoặc nafcilin", "2 g TM mỗi 6 giờ (8 g/ngày)")],
    { notes: ["Phối hợp dẫn lưu/rửa khớp: nội soi rửa khớp khi sau 5–7 ngày điều trị đúng thuốc mà kết quả không cải thiện (tr. 165)."] }),
  r(JT, "tr. 164", "r-sa-empiric-2", ["v8-33"], SA_EMPIRIC, "alternative",
    [d("Clindamycin", "2,4 g TM/ngày chia 4 lần")]),

  // (2) Nghi ngờ / xác định MRSA
  r(JT, "tr. 164", "r-sa-mrsa", ["v8-33"], SA_MRSA, "pathogen",
    [d("Một trong", "vancomycin 2 g/ngày chia hai lần, pha truyền TM; daptomycin 4–6 mg/kg TM 1 lần/ngày; teicoplanin 6 mg/kg 1 lần/ngày trong những ngày đầu, sau đó giảm còn 3 mg/kg TM hoặc TB")],
    { duration: "4 tuần (tụ cầu vàng kháng methicilin)",
      condition: "Nghi ngờ tụ cầu vàng kháng kháng sinh theo dịch tễ tại cộng đồng hoặc bệnh viện, hoặc kháng sinh đồ xác định MRSA" }),

  // (3) Nghi ngờ / xác định trực khuẩn mủ xanh
  r(JT, "tr. 164", "r-sa-pseudo", ["v8-33"], SA_PSEUDO, "pathogen",
    [
      d("Ceftazidim", "2 g/lần x 2–3 lần/ngày (khi đã xác định: 1 g mỗi 8 giờ, hoặc thay bằng mezlocilin 3 g TM mỗi 4 giờ)"),
      d("Kết hợp aminoglycosid", "gentamycin 5 mg/kg/ngày hoặc amikacin 15 mg/kg/ngày, TB hoặc pha truyền TM 1 lần/ngày"),
    ],
    { duration: "Khoảng 2 tuần, sau đó ciprofloxacin 500 mg uống 2 lần/ngày đơn độc hoặc phối hợp ceftazidim",
      condition: "Cần phối hợp ceftazidim với aminoglycosid; khi kháng sinh đồ đã xác định tác nhân, ceftazidim dùng 1 g mỗi 8 giờ",
      notes: ["Văn bản nêu 2 dạng liều ceftazidim ở 2 vị trí khác nhau (2 g x 2–3 lần/ngày khi nghi ngờ; 1 g mỗi 8 giờ khi đã xác định): giữ nguyên, cần thẩm định."] }),

  // (4) Theo kết quả cấy và kháng sinh đồ
  r(JT, "tr. 164", "r-sa-mssa", ["v8-33"], SA_CULTURE, "pathogen",
    [d("Một trong", "oxacilin; nafcilin; clindamycin (liều như trên)")],
    { duration: "Văn bản không nêu riêng thời gian cho MSSA ở nhánh này",
      condition: "Tụ cầu vàng nhạy methicilin (MSSA)" }),
  r(JT, "tr. 164", "r-sa-strep", ["v8-33"], SA_CULTURE, "pathogen",
    [d("Penicilin G", "2 triệu đơn vị TM mỗi 4 giờ")],
    { duration: "2 tuần", condition: "Phế cầu hoặc liên cầu nhạy penicilin" }),
  r(JT, "tr. 164", "r-sa-hflu", ["v8-33"], SA_CULTURE, "pathogen",
    [d("Một trong", "ceftriaxon 1–2 g 1 lần/ngày; cefotaxim 1 g 3 lần/ngày")],
    { duration: "2 tuần", condition: "H. influenzae và S. pneumoniae tiết beta-lactamase" }),
  r(JT, "tr. 164", "r-sa-gramneg", ["v8-33"], SA_CULTURE, "pathogen",
    [d("Một trong", "cephalosporin thế hệ 3 hoặc 4 đường TM; levofloxacin 500 mg TM hoặc uống mỗi 24 giờ")],
    { duration: "3–4 tuần", condition: "Phần lớn trực khuẩn Gram âm đường ruột" }),

  // ===== (5) Viêm khớp do lậu cầu (v8-33) =====
  r(JG, "tr. 164", "r-gc-sens", ["v8-33"], SA_GC, "pathogen",
    [d("Một trong", "amoxicilin uống 1500 mg/ngày chia 3 lần; ciprofloxacin uống 1000 mg chia hai lần/ngày")],
    { duration: "7 ngày", condition: "Lậu cầu nhạy penicilin – điều trị ngoại trú" }),
  r(JG, "tr. 165", "r-gc-resist", ["v8-33"], SA_GC, "pathogen",
    [d("Ceftriaxon", "1 g tiêm bắp hoặc TM mỗi 24 giờ x 7 ngày, sau đó chuyển ciprofloxacin uống 500 mg hai lần/ngày; hoặc thay bằng spectinomycin 2 g tiêm bắp mỗi 12 giờ x 7 ngày")],
    { duration: "7 ngày (theo văn bản)", condition: "Nghi ngờ lậu cầu kháng penicilin" }),
  r(JG, "tr. 165", "r-gc-chlamydia", ["v8-33"], SA_GC, "adjunct",
    [d("Phối hợp uống – một trong", "doxycyclin 100 mg 2 lần/ngày; tetracyclin 500 mg 4 lần/ngày; erythromycin 500 mg 4 lần/ngày")],
    { duration: "7 ngày", condition: "Nghi ngờ đồng nhiễm Chlamydia trachomatis – dùng thêm, không thay thế phác đồ điều trị lậu cầu" }),

  // ===== Viêm xương tủy (v8-32) =====
  // (1) Tụ cầu vàng nhạy methicilin – tác nhân hàng đầu
  r(OS, "tr. 167", "r-os-mssa", ["v8-32"], OS_MSSA, "first",
    [d("Nafcilin hoặc oxacilin", "2 g tiêm TM mỗi 6 giờ (8 g/ngày)")],
    { duration: "Ít nhất 6 tuần (nguyên tắc chung, mục 4.1)",
      notes: ["Nguyên tắc: kháng sinh liều cao, đường TM, ít nhất 6 tuần; cấy máu hoặc mô trước khi dùng kháng sinh; dẫn lưu mủ và tổ chức hoại tử; loại bỏ vật cấy ghép."] }),
  r(OS, "tr. 168", "r-os-allergy", ["v8-32"], OS_MSSA, "allergy",
    [d("Một trong", "clindamycin 600–900 mg TM mỗi 8 giờ (6 mg/kg); levofloxacin 750 mg uống mỗi 24 giờ ± rifampicin 300 mg uống 2 lần/ngày; acid fusidic 500 mg TM mỗi 8 giờ kết hợp rifampicin 300 mg uống 2 lần/ngày")],
    { condition: "Dị ứng hoặc không đáp ứng các kháng sinh chống tụ cầu nêu trên (beta-lactam, glycopeptid, daptomycin, linezolid)" }),

  // (2) MRSA
  r(OS, "tr. 167", "r-os-mrsa", ["v8-32"], OS_MRSA, "pathogen",
    [d("Một trong", "vancomycin 1 g pha truyền TM mỗi 12 giờ; daptomycin 4–6 mg/kg TM 1 lần/ngày; teicoplanin 6 mg/kg 1 lần/ngày trong những ngày đầu rồi giảm còn 3 mg/kg TM hoặc TB; linezolid 600 mg mỗi 12 giờ tiêm TM; hoặc rifampicin 300 mg uống 2 lần/ngày")],
    { duration: "Ít nhất 6 tuần (nguyên tắc chung)",
      notes: ["Văn bản liệt kê rifampicin cùng chuỗi lựa chọn; cần thẩm định nếu dùng đơn độc (thường phối hợp, không dùng đơn độc)."] }),

  // (3) Trực khuẩn mủ xanh
  r(OS, "tr. 168", "r-os-pseudo", ["v8-32"], OS_PSEUDO, "pathogen",
    [
      d("Ceftazidim", "2 g/lần x 2–3 lần/ngày (hoặc mezlocilin 3 g TM mỗi 4 giờ)"),
      d("Kết hợp aminoglycosid", "gentamycin 5 mg/kg/ngày hoặc amikacin 15 mg/kg/ngày, TB hoặc pha truyền TM 1 lần/ngày"),
    ],
    { duration: "Khoảng 2 tuần, sau đó ciprofloxacin 500 mg uống 2 lần/ngày đơn độc hoặc phối hợp ceftazidim",
      notes: ["Chênh lệch giữa văn bản BYT: QĐ 361/QĐ-BYT (2014, cơ xương khớp, tr. 97 và 105 theo bản PDF) ghi gentamycin 3 mg/kg/ngày, trong khi QĐ 708 ghi 5 mg/kg/ngày. Không tự chọn; cần thẩm định."] }),

  // (4) Nhiễm nhiều vi khuẩn
  r(OS, "tr. 168", "r-os-poly", ["v8-32"], OS_POLY, "pathogen",
    [
      d("Vancomycin", "1 g TM mỗi 12 giờ (thay thế: linezolid 600 mg TM hoặc uống 2 lần/ngày)"),
      d("Kết hợp ceftazidim", "2 g/lần x 2–3 lần/ngày"),
    ],
    { condition: "Đồng nhiễm S. aureus, trực khuẩn Gram âm và P. aeruginosa",
      notes: ["QĐ 361/QĐ-BYT (2014) cho nhiễm nhiều vi khuẩn ghi \"ceftazidim (hoặc cefepim)\" (tr. 105 theo bản PDF); QĐ 708 chỉ nêu ceftazidim."] }),

  // (5) Gram âm đường ruột
  r(OS, "tr. 168", "r-os-gramneg", ["v8-32"], OS_GRAMNEG, "pathogen",
    [d("Một trong", "cephalosporin thế hệ 3 hoặc 4 đường TM; levofloxacin 500 mg TM hoặc uống mỗi 24 giờ")],
    { duration: "3–4 tuần",
      notes: ["Viêm xương mạn tính và viêm xương trên cơ địa đái tháo đường: cần bằng chứng vi khuẩn học và kháng sinh đồ để điều trị (không dùng phác đồ kinh nghiệm đơn thuần)."] }),
];
