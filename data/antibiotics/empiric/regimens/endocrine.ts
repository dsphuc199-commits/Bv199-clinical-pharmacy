/*
  FILE: data/antibiotics/empiric/regimens/endocrine.ts
  Nguon: BYT QĐ 1530/QĐ-BYT (24/03/2023) "Hướng dẫn chẩn đoán và điều trị Loét bàn chân
  do đái tháo đường" – ban PDF tren kcb.vn, doc ngay 25/10/2026.
  - Muc 5.2.1 Dieu tri nhiem khuan (tr. 24)
  - Phu luc 02: Phac do khang sinh theo kinh nghiem (tr. 32–33)
  Van ban CHI neu nhom thuoc / ten thuoc, KHONG neu lieu -> moi thuoc ghi NO_DOSE.
  Giu nguyen ten thuoc theo van ban (ke ca cach viet tieng Anh).
*/

import { d, maker, NO_DOSE } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt1530");

const IDS = ["v9-1"];
const PL2 = "Phụ lục 02 – Phác đồ kháng sinh theo kinh nghiệm";
const P = "tr. 32–33";
const MILD = "Nhẹ (Wagner độ 1 hoặc PEDIS giai đoạn 1–2)";
const MOD = "Trung bình hoặc nặng (Wagner độ 2 trở lên hoặc PEDIS giai đoạn 3 trở lên)";
const PRINCIPLES =
  "Mục 5.2.1 (tr. 24): kháng sinh ban đầu chọn theo kinh nghiệm, sau đó điều chỉnh theo đáp ứng lâm sàng hoặc kết quả cấy kháng sinh đồ. Dùng kháng sinh đường tiêm cho tất cả nhiễm trùng nặng và một số nhiễm trùng vừa; xem xét chuyển đường uống khi nhiễm trùng đã kiểm soát tốt và có kết quả cấy. Nhiễm trùng mô mềm thường 2–4 tuần; không nhất thiết dùng kháng sinh đến khi vết loét lành hoàn toàn.";
const MRSA_NOTE =
  "Mục 5.2.1: xem xét kháng sinh kinh nghiệm có hiệu quả trên MRSA (macrolide, linezolid, acid fusidic…) khi có tiền sử nhiễm MRSA, tỷ lệ cấy MRSA cao hoặc nhiễm trùng nặng.";
const FOOT =
  "Ghi chú của văn bản: những khuyến cáo dựa trên lý thuyết và kết quả các thử nghiệm lâm sàng sẵn có.";

export const ENDOCRINE: Regimen[] = [
  // ===== Nhẹ =====
  r(PL2, P, "r-dfi-mild-simple", IDS, `${MILD} – không có yếu tố phức tạp (cầu khuẩn Gram dương)`, "first",
    [
      d("Penicillin bán tổng hợp kháng enzyme penicillinase", NO_DOSE),
      d("hoặc cephalosporin thế hệ 1", NO_DOSE),
    ],
    { notes: [PRINCIPLES, FOOT] }),
  r(PL2, P, "r-dfi-mild-allergy", IDS, `${MILD} – dị ứng hoặc không dung nạp β-lactam (cầu khuẩn Gram dương)`, "allergy",
    [
      d("Clindamycin", NO_DOSE),
      d("hoặc fluoroquinolone có hoạt tính tốt chống cầu khuẩn Gram dương hiếu khí (ví dụ: levofloxacin hoặc moxifloxacin)", NO_DOSE),
      d("hoặc macrolide", NO_DOSE),
      d("hoặc doxycycline", NO_DOSE),
    ],
    { notes: [FOOT] }),
  r(PL2, P, "r-dfi-mild-recent-abx", IDS, `${MILD} – sử dụng kháng sinh gần đây (cầu khuẩn Gram dương + trực khuẩn Gram âm)`, "alternative",
    [
      d("β-Lactam nhóm 1: amoxicillin/clavulanate, ampicillin/sulbactam", NO_DOSE),
      d("hoặc trimethoprim/sulfamethoxazole", NO_DOSE),
      d("hoặc fluoroquinolone có hoạt tính tốt chống cầu khuẩn Gram dương hiếu khí (ví dụ: levofloxacin hoặc moxifloxacin)", NO_DOSE),
    ],
    { notes: [FOOT] }),
  r(PL2, P, "r-dfi-mild-mrsa", IDS, `${MILD} – nguy cơ cao MRSA`, "pathogen",
    [
      d("Linezolid", NO_DOSE),
      d("hoặc trimethoprim/sulfamethoxazole", NO_DOSE),
      d("hoặc doxycycline", NO_DOSE),
      d("hoặc macrolide", NO_DOSE),
    ],
    { notes: [MRSA_NOTE, FOOT] }),

  // ===== Trung binh hoac nang =====
  r(PL2, P, "r-dfi-mod-simple", IDS, `${MOD} – không có yếu tố phức tạp (cầu khuẩn Gram dương ± trực khuẩn Gram âm)`, "first",
    [
      d("β-Lactam nhóm 1: amoxicillin/clavulanate, ampicillin/sulbactam", NO_DOSE),
      d("hoặc cephalosporin thế hệ 2; 3", NO_DOSE),
    ],
    { notes: [PRINCIPLES, FOOT] }),
  r(PL2, P, "r-dfi-mod-recent-abx", IDS, `${MOD} – sử dụng kháng sinh gần đây (cầu khuẩn Gram dương ± trực khuẩn Gram âm)`, "severe",
    [
      d("β-Lactam nhóm 2: ticarcillin/clavulanate, piperacillin/tazobactam", NO_DOSE),
      d("hoặc cephalosporin thế hệ 3", NO_DOSE),
      d("hoặc nhóm 1 carbapenem (phụ thuộc vào điều trị trước đó, hoặc tham khảo thêm ý kiến)", NO_DOSE),
    ],
    { notes: [FOOT] }),
  r(PL2, P, "r-dfi-mod-pseudo", IDS, `${MOD} – vết loét ẩm ướt và khí hậu ấm (trực khuẩn Gram âm, gồm Pseudomonas)`, "pathogen",
    [
      d("β-Lactam nhóm 2: ticarcillin/clavulanate, piperacillin/tazobactam", NO_DOSE),
      d("hoặc penicillin bán tổng hợp kháng enzyme penicillinase + ceftazidime", NO_DOSE),
      d("hoặc penicillin bán tổng hợp kháng enzyme penicillinase + fluoroquinolone kháng pseudomonas (ví dụ ciprofloxacin)", NO_DOSE),
      d("hoặc carbapenem nhóm 2", NO_DOSE),
    ],
    { notes: [FOOT] }),
  r(PL2, P, "r-dfi-mod-ischemic", IDS, `${MOD} – chi thiếu máu cục bộ/hoại tử/sinh hơi (cầu khuẩn Gram dương ± trực khuẩn Gram âm ± vi khuẩn kị khí)`, "severe",
    [
      d("β-Lactam nhóm 1 hoặc 2", NO_DOSE),
      d("hoặc carbapenem nhóm 1 hoặc 2", NO_DOSE),
      d("hoặc cephalosporin thế hệ 2 hoặc 3 + clindamycin hoặc metronidazole", NO_DOSE),
    ],
    { notes: [FOOT] }),
  r(PL2, P, "r-dfi-mod-mrsa", IDS, `${MOD} – yếu tố nguy cơ MRSA`, "pathogen",
    [
      d("Xem xét thêm hoặc thay thế bằng: glycopeptide; linezolid; daptomycin; axit fusidic; trimethoprim/sulfamethoxazole (± rifampicin*)", NO_DOSE),
      d("hoặc doxycycline", NO_DOSE),
    ],
    { notes: [MRSA_NOTE, "* Rifampicin: liên quan đến nguy cơ tác dụng phụ cao hơn và bị hạn chế sử dụng ở một số quốc gia; thích hợp nhất cho viêm tủy xương hoặc nhiễm trùng liên quan đến cấy ghép kim loại.", FOOT] }),
  r(PL2, P, "r-dfi-mod-esbl", IDS, `${MOD} – yếu tố nguy cơ kháng thuốc ở trực khuẩn Gram âm (vi khuẩn sinh ESBL)`, "pathogen",
    [
      d("Carbapenems", NO_DOSE),
      d("hoặc fluoroquinolone có hoạt tính tốt chống cầu khuẩn Gram dương hiếu khí (ví dụ: levofloxacin hoặc moxifloxacin)", NO_DOSE),
      d("hoặc aminoglycoside và colistin", NO_DOSE),
    ],
    { notes: [FOOT] }),
];
