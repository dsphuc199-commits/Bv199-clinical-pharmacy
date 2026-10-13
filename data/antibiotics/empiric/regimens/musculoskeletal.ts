/*
  FILE: data/antibiotics/empiric/regimens/musculoskeletal.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015), Chuong 6 Nhiem khuan co - xuong - khop.
  - Viem khop nhiem khuan: tr. 162-165 (v8-33)
  - Viem xuong tuy: tr. 166-168 (v8-32)
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");

const JT = "Viêm khớp nhiễm khuẩn, mục 4.2.1a";
const JG = "Viêm khớp nhiễm khuẩn, mục 4.2.1b";
const OS = "Viêm xương tủy, mục 4.2.1a";

export const MUSCULOSKELETAL: Regimen[] = [
  // ===== Viêm khớp nhiễm khuẩn không do lậu cầu (v8-33) =====
  r(JT, "tr. 164", "r-sa-empiric-1", ["v8-33"],
    "Viêm khớp nhiễm khuẩn không do lậu cầu – chưa có kết quả cấy máu, dịch khớp (hoặc nhuộm Gram thấy cầu khuẩn Gram dương)", "first",
    [d("Oxacilin hoặc nafcilin", "2 g TM mỗi 6 giờ (8 g/ngày)")],
    { notes: ["Phối hợp dẫn lưu/rửa khớp: nội soi rửa khớp khi sau 5–7 ngày điều trị đúng thuốc mà kết quả không cải thiện (tr. 165)."] }),
  r(JT, "tr. 164", "r-sa-empiric-2", ["v8-33"],
    "Viêm khớp nhiễm khuẩn không do lậu cầu – chưa có kết quả cấy", "alternative",
    [d("Clindamycin", "2,4 g TM/ngày chia 4 lần")]),
  r(JT, "tr. 164", "r-sa-mrsa", ["v8-33"],
    "Nghi tụ cầu vàng kháng kháng sinh (tại cộng đồng hoặc bệnh viện); tụ cầu vàng kháng methicilin", "pathogen",
    [d("Một trong", "vancomycin 2 g/ngày chia hai lần, pha truyền TM; daptomycin 4–6 mg/kg TM 1 lần/ngày; teicoplanin 6 mg/kg 1 lần/ngày trong những ngày đầu, sau đó giảm còn 3 mg/kg TM hoặc TB")],
    { duration: "4 tuần (tụ cầu vàng kháng methicilin)" }),
  r(JT, "tr. 164", "r-sa-mssa", ["v8-33"],
    "Tụ cầu vàng nhạy cảm kháng sinh (theo kháng sinh đồ)", "pathogen",
    [d("Một trong", "oxacilin; nafcilin; clindamycin (liều như trên)")],
    { duration: "Văn bản không nêu riêng thời gian cho MSSA ở nhánh này" }),
  r(JT, "tr. 164", "r-sa-strep", ["v8-33"],
    "Phế cầu hoặc liên cầu nhạy penicilin", "pathogen",
    [d("Penicilin G", "2 triệu đơn vị TM mỗi 4 giờ")],
    { duration: "2 tuần" }),
  r(JT, "tr. 164", "r-sa-hflu", ["v8-33"],
    "H. influenzae và S. pneumoniae kháng penicilin", "pathogen",
    [d("Một trong", "ceftriaxon 1–2 g 1 lần/ngày; cefotaxim 1 g 3 lần/ngày")],
    { duration: "2 tuần" }),
  r(JT, "tr. 164", "r-sa-gramneg", ["v8-33"],
    "Phần lớn vi khuẩn Gram âm đường ruột", "pathogen",
    [d("Một trong", "cephalosporin thế hệ 3 hoặc 4 đường TM; levofloxacin 500 mg TM hoặc uống mỗi 24 giờ")],
    { duration: "3–4 tuần" }),
  r(JT, "tr. 164", "r-sa-pseudo", ["v8-33"],
    "Nghi hoặc xác định trực khuẩn mủ xanh", "pathogen",
    [
      d("Ceftazidim", "2 g/lần x 2–3 lần/ngày (khi đã xác định: 1 g mỗi 8 giờ, hoặc thay bằng mezlocilin 3 g TM mỗi 4 giờ)"),
      d("Kết hợp aminoglycosid", "gentamycin 5 mg/kg/ngày hoặc amikacin 15 mg/kg/ngày, TB hoặc pha truyền TM 1 lần/ngày"),
    ],
    { duration: "Khoảng 2 tuần, sau đó ciprofloxacin 500 mg uống 2 lần/ngày đơn độc hoặc phối hợp ceftazidim",
      notes: ["Văn bản nêu 2 dạng liều ceftazidim ở 2 vị trí khác nhau (2 g x 2–3 lần/ngày khi nghi ngờ; 1 g mỗi 8 giờ khi đã xác định): giữ nguyên, cần thẩm định."] }),

  // ===== Viêm khớp do lậu cầu (v8-33) =====
  r(JG, "tr. 164", "r-gc-sens", ["v8-33"],
    "Viêm khớp do lậu cầu nhạy cảm penicilin (ngoại trú)", "first",
    [d("Một trong", "amoxicilin uống 1500 mg/ngày chia 3 lần; ciprofloxacin uống 1000 mg chia hai lần/ngày")],
    { duration: "7 ngày" }),
  r(JG, "tr. 165", "r-gc-resist", ["v8-33"],
    "Nghi ngờ lậu cầu kháng penicilin", "alternative",
    [d("Ceftriaxon", "1 g tiêm bắp hoặc TM mỗi 24 giờ x 7 ngày, sau đó chuyển ciprofloxacin uống 500 mg hai lần/ngày; hoặc thay bằng spectinomycin 2 g tiêm bắp mỗi 12 giờ x 7 ngày")],
    { duration: "7 ngày (theo văn bản)" }),
  r(JG, "tr. 165", "r-gc-chlamydia", ["v8-33"],
    "Nghi ngờ bội nhiễm Chlamydia trachomatis", "adjunct",
    [d("Phối hợp uống – một trong", "doxycyclin 100 mg 2 lần/ngày; tetracyclin 500 mg 4 lần/ngày; erythromycin 500 mg 4 lần/ngày")],
    { duration: "7 ngày" }),

  // ===== Viêm xương tủy (v8-32) =====
  r(OS, "tr. 167", "r-os-mssa", ["v8-32"],
    "Viêm xương tủy – tụ cầu vàng nhạy methicilin (MSSA)", "first",
    [d("Nafcilin hoặc oxacilin", "2 g tiêm TM mỗi 6 giờ (8 g/ngày)")],
    { duration: "Ít nhất 6 tuần (nguyên tắc chung, mục 4.1)",
      notes: ["Nguyên tắc: kháng sinh liều cao, đường TM, ít nhất 6 tuần; cấy máu hoặc mô trước khi dùng kháng sinh; dẫn lưu mủ và tổ chức hoại tử; loại bỏ vật cấy ghép."] }),
  r(OS, "tr. 167", "r-os-mrsa", ["v8-32"],
    "Viêm xương tủy – tụ cầu vàng kháng methicilin (MRSA)", "pathogen",
    [d("Một trong", "vancomycin 1 g pha truyền TM mỗi 12 giờ; daptomycin 4–6 mg/kg TM 1 lần/ngày; teicoplanin 6 mg/kg 1 lần/ngày trong những ngày đầu rồi giảm còn 3 mg/kg TM hoặc TB; linezolid 600 mg mỗi 12 giờ tiêm TM; hoặc rifampicin 300 mg uống 2 lần/ngày")],
    { duration: "Ít nhất 6 tuần (nguyên tắc chung)",
      notes: ["Văn bản liệt kê rifampicin cùng chuỗi lựa chọn; cần thẩm định nếu dùng đơn độc (thường phối hợp, không dùng đơn độc)."] }),
  r(OS, "tr. 168", "r-os-allergy", ["v8-32"],
    "Viêm xương tủy – dị ứng hoặc không đáp ứng các kháng sinh trên", "allergy",
    [d("Một trong", "clindamycin 600–900 mg TM mỗi 8 giờ (6 mg/kg); levofloxacin 750 mg uống mỗi 24 giờ ± rifampicin 300 mg uống 2 lần/ngày; acid fusidic 500 mg TM mỗi 8 giờ kết hợp rifampicin 300 mg uống 2 lần/ngày")]),
  r(OS, "tr. 168", "r-os-pseudo", ["v8-32"],
    "Viêm xương tủy – trực khuẩn mủ xanh", "pathogen",
    [
      d("Ceftazidim", "2 g/lần x 2–3 lần/ngày (hoặc mezlocilin 3 g TM mỗi 4 giờ)"),
      d("Kết hợp aminoglycosid", "gentamycin 5 mg/kg/ngày hoặc amikacin 15 mg/kg/ngày, TB hoặc pha truyền TM 1 lần/ngày"),
    ],
    { duration: "Khoảng 2 tuần, sau đó ciprofloxacin 500 mg uống 2 lần/ngày đơn độc hoặc phối hợp ceftazidim",
      notes: ["Chênh lệch giữa văn bản BYT: QĐ 361/QĐ-BYT (2014, cơ xương khớp, tr. 97 và 105 theo bản PDF) ghi gentamycin 3 mg/kg/ngày, trong khi QĐ 708 ghi 5 mg/kg/ngày. Không tự chọn; cần thẩm định."] }),
  r(OS, "tr. 168", "r-os-poly", ["v8-32"],
    "Viêm xương tủy – nhiễm nhiều vi khuẩn (S. aureus, Gram âm, P. aeruginosa), hay gặp trong viêm xương dài sau đóng đinh nội tủy", "pathogen",
    [
      d("Vancomycin", "1 g TM mỗi 12 giờ (thay thế: linezolid 600 mg TM hoặc uống 2 lần/ngày)"),
      d("Kết hợp ceftazidim", "2 g/lần x 2–3 lần/ngày"),
    ],
    { notes: ["QĐ 361/QĐ-BYT (2014) cho nhiễm nhiều vi khuẩn ghi \"ceftazidim (hoặc cefepim)\" (tr. 105 theo bản PDF); QĐ 708 chỉ nêu ceftazidim."] }),
  r(OS, "tr. 168", "r-os-gramneg", ["v8-32"],
    "Viêm xương tủy – phần lớn Gram âm đường ruột", "pathogen",
    [d("Một trong", "cephalosporin thế hệ 3 hoặc 4 đường TM; levofloxacin 500 mg TM hoặc uống mỗi 24 giờ")],
    { duration: "3–4 tuần",
      notes: ["Viêm xương mạn tính và viêm xương trên cơ địa đái tháo đường: cần bằng chứng vi khuẩn học và kháng sinh đồ để điều trị (không dùng phác đồ kinh nghiệm đơn thuần)."] }),
];
