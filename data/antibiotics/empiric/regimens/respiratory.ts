/*
  FILE: data/antibiotics/empiric/regimens/respiratory.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015) "Huong dan su dung khang sinh".
  Trang = so trang in cua van ban (trung so trang PDF).
  Viem phoi cong dong nguoi lon dung module CapByt2026 (QD 2147/QD-BYT 2026).
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");

const COPD = "Đợt cấp BPTNMT: Chương 1, bài Đợt cấp BPTNMT, mục 3a";
const COPD_P = "tr. 72";
const COPD_NOTE =
  "Chỉ định kháng sinh: typ I (đủ 3 triệu chứng Anthonisen), typ II (2/3 triệu chứng) hoặc cần thông khí nhân tạo. Thời gian 5–10 ngày. Cần cân nhắc điều chỉnh liều theo chức năng thận.";

const BRONCH = "Giãn phế quản, mục 4.3";

export const RESPIRATORY: Regimen[] = [
  // ===== v8-6 Đợt cấp COPD =====
  r(COPD, COPD_P, "r-copd-mild-bli", ["v8-6"], "Đợt cấp mức độ nhẹ", "first",
    [d("Amoxicilin-clavulanat hoặc ampicilin-sulbactam", "3 g/ngày")],
    { duration: "5–10 ngày", notes: [COPD_NOTE] }),
  r(COPD, COPD_P, "r-copd-mild-cefur", ["v8-6"], "Đợt cấp mức độ nhẹ", "alternative",
    [d("Cefuroxim", "1,5 g/ngày")],
    { duration: "5–10 ngày", notes: [COPD_NOTE] }),
  r(COPD, COPD_P, "r-copd-mild-fq", ["v8-6"], "Đợt cấp mức độ nhẹ", "alternative",
    [d("Moxifloxacin", "400 mg/ngày"), d("hoặc levofloxacin", "750 mg/ngày")],
    { duration: "5–10 ngày", notes: [COPD_NOTE, "Chọn một trong hai fluoroquinolon."] }),
  r(COPD, COPD_P, "r-copd-mod", ["v8-6"], "Đợt cấp mức độ trung bình", "first",
    [
      d("Cefotaxim hoặc ceftriaxon", "1 g x 3 lần/ngày"),
      d("Phối hợp amikacin", "15 mg/kg/ngày"),
    ],
    { duration: "5–10 ngày", notes: [COPD_NOTE] }),
  r(COPD, COPD_P, "r-copd-mod-fq", ["v8-6"], "Đợt cấp mức độ trung bình", "alternative",
    [
      d("Cefotaxim hoặc ceftriaxon", "1 g x 3 lần/ngày"),
      d("Phối hợp fluoroquinolon", "ciprofloxacin 1 g/ngày uống; levofloxacin 500 mg/ngày uống hoặc truyền TM"),
    ],
    { duration: "5–10 ngày", notes: [COPD_NOTE] }),
  r(COPD, COPD_P, "r-copd-sev-cef", ["v8-6"], "Đợt cấp mức độ nặng và nguy kịch", "severe",
    [
      d("Ceftazidim (cephalosporin thế hệ 3)", "3 g/ngày"),
      d("Kết hợp amikacin", "15 mg/kg/ngày"),
    ],
    { duration: "5–10 ngày", notes: [COPD_NOTE] }),
  r(COPD, COPD_P, "r-copd-sev-cef-fq", ["v8-6"], "Đợt cấp mức độ nặng và nguy kịch", "severe",
    [
      d("Ceftazidim (cephalosporin thế hệ 3)", "3 g/ngày"),
      d("Kết hợp fluoroquinolon", "ciprofloxacin 800 mg/ngày truyền TM chia 2 lần hoặc levofloxacin 750 mg/ngày truyền TM"),
    ],
    { duration: "5–10 ngày", notes: [COPD_NOTE] }),
  r(COPD, COPD_P, "r-copd-sev-imi", ["v8-6"], "Đợt cấp mức độ nặng và nguy kịch", "severe",
    [
      d("Imipenem", "50 mg/kg/ngày"),
      d("Kết hợp amikacin hoặc fluoroquinolon", "amikacin 15 mg/kg/ngày; ciprofloxacin 800 mg/ngày TM chia 2 lần; levofloxacin 750 mg/ngày TM"),
    ],
    { duration: "5–10 ngày", notes: [COPD_NOTE] }),

  // ===== v8-10 Giãn phế quản bội nhiễm =====
  r(BRONCH, "tr. 68–70", "r-bronch-pen", ["v8-10"], "Đợt cấp có bội nhiễm: phối hợp beta-lactam + aminoglycosid", "first",
    [
      d("Penicilin G", "10–50 triệu đơn vị/ngày tùy tình trạng và cân nặng, pha truyền TM chia 3–4 lần/ngày"),
      d("Kết hợp gentamycin hoặc amikacin", "gentamycin 3–5 mg/kg/ngày tiêm bắp 1 lần; amikacin 15 mg/kg/ngày pha truyền TM trong 250 ml NaCl 0,9%"),
    ],
    { duration: "10 ngày đến 2 tuần; bội nhiễm trực khuẩn mủ xanh hoặc tụ cầu có thể tới 3 tuần", notes: ["Nhiễm khuẩn nặng phải dùng phối hợp; thay đổi theo đáp ứng lâm sàng và kháng sinh đồ.", "Xét nghiệm creatinin máu 2 lần/tuần khi dùng aminoglycosid hoặc vancomycin."] }),
  r(BRONCH, "tr. 69", "r-bronch-pen-fq", ["v8-10"], "Đợt cấp có bội nhiễm: phối hợp beta-lactam + quinolon", "alternative",
    [
      d("Penicilin G", "10–50 triệu đơn vị/ngày, pha truyền TM chia 3–4 lần/ngày"),
      d("Kết hợp quinolon (một trong)", "levofloxacin 500–750 mg/ngày truyền TM; moxifloxacin 400 mg/ngày; ciprofloxacin 800 mg/ngày"),
    ],
    { duration: "10 ngày đến 2 tuần", notes: ["Chọn một quinolon."] }),
  r(BRONCH, "tr. 69", "r-bronch-bli", ["v8-10"], "Nghi vi khuẩn tiết beta-lactamase", "pathogen",
    [
      d("Amoxicilin-clavulanat hoặc ampicilin-sulbactam", "3–6 g chia 3–6 lần/ngày, tiêm TM"),
      d("Kết hợp aminoglycosid như mục trên", "gentamycin hoặc amikacin"),
    ],
    { duration: "10 ngày đến 2 tuần" }),
  r(BRONCH, "tr. 69", "r-bronch-gramneg", ["v8-10"], "Nghi vi khuẩn Gram-âm", "pathogen",
    [
      d("Cefotaxim hoặc ceftazidim", "cefotaxim 3–6 g/ngày chia 2–4 lần; ceftazidim 3–6 g/ngày, cứ 8–12 giờ/lần"),
      d("Kết hợp aminoglycosid", "gentamycin hoặc amikacin"),
    ],
    { duration: "10 ngày đến 2 tuần" }),
  r(BRONCH, "tr. 69", "r-bronch-anaer", ["v8-10"], "Đờm mủ thối (nghi vi khuẩn kỵ khí)", "pathogen",
    [
      d("Beta-lactam (như các mục trên)", "amoxicilin-clavulanat hoặc penicilin G"),
      d("Metronidazol", "1–1,5 g chia 2–3 lần/ngày, truyền TM"),
    ],
    { duration: "10 ngày đến 2 tuần" }),
  r(BRONCH, "tr. 69", "r-bronch-hosp", ["v8-10"], "Nhiễm khuẩn mắc phải bệnh viện, chưa có kháng sinh đồ", "severe",
    [
      d("Một trong", "ceftazidim 3–6 g chia 3 lần/ngày; piperacilin-tazobactam 4,5 g x 3 lần/ngày; imipenem 2–4 g chia 3–4 lần/ngày; meropenem 3–6 g chia 3–4 lần/ngày"),
      d("Kết hợp aminoglycosid hoặc quinolon, metronidazol", "như các mục trên"),
    ],
    { duration: "Có thể tới 3 tuần nếu P. aeruginosa hoặc tụ cầu", notes: ["Điều chỉnh theo diễn biến lâm sàng và kháng sinh đồ."] }),
  r(BRONCH, "tr. 69–70", "r-bronch-staph", ["v8-10"], "Nghi tụ cầu", "pathogen",
    [
      d("Oxacilin hoặc vancomycin", "oxacilin 6–12 g/ngày; vancomycin 1–2 g/ngày"),
      d("Kết hợp amikacin khi nghi tụ cầu kháng thuốc", "liều như mục aminoglycosid"),
    ],
    { duration: "10 ngày đến 2 tuần" }),
  r(BRONCH, "tr. 70", "r-bronch-macrolide", ["v8-10"], "Hội chứng xoang phế quản; hoặc tái phát từ 2 đợt cấp/năm", "adjunct",
    [d("Erythromycin (hội chứng xoang phế quản)", "10 mg/kg/ngày chia 2 lần, uống kéo dài 6–24 tháng; macrolid liều thấp 10 mg/kg dài ngày cho trường hợp tái phát từ 2 lần/năm")],
    { notes: ["Không dùng đồng thời với xanthin (theophylin): nguy cơ xoắn đỉnh."] }),

  // ===== v8-9 Áp xe phổi =====
  r("Áp xe phổi, mục 3.1.1", "tr. 110", "r-lungabs-pen", ["v8-9"], "Áp xe phổi: phối hợp beta-lactam + aminoglycosid", "first",
    [
      d("Penicilin G (hoặc amoxicilin-clavulanat, ampicilin-sulbactam 3–6 g/ngày)", "10–50 triệu đơn vị/ngày tùy tình trạng và cân nặng, pha truyền TM chia 3–4 lần/ngày"),
      d("Kết hợp gentamycin hoặc amikacin", "gentamycin 3–5 mg/kg/ngày tiêm bắp 1 lần; amikacin 15 mg/kg/ngày tiêm bắp 1 lần hoặc truyền TM trong 250 ml NaCl 0,9%"),
    ],
    { duration: "Ít nhất 4 tuần (có thể tới 6 tuần tùy lâm sàng và X-quang)", notes: ["Dùng kháng sinh sớm, liều cao ngay từ đầu, phối hợp ít nhất hai kháng sinh đường TM hoặc tiêm bắp.", "Đờm hôi/thối: thêm metronidazol 500 mg x 2 lọ/ngày truyền TM chia sáng, tối.", "Xét nghiệm creatinin 2 lần/tuần khi dùng aminoglycosid. Dẫn lưu tư thế, soi phế quản, chọc dẫn lưu khi có chỉ định."] }),
  r("Áp xe phổi, mục 3.1.1", "tr. 110", "r-lungabs-bl", ["v8-9"], "Nghi vi khuẩn tiết beta-lactamase", "pathogen",
    [
      d("Amoxicilin-clavulanat hoặc ampicilin-sulbactam", "3–6 g/ngày (thay penicilin G)"),
      d("Kết hợp aminoglycosid", "như trên"),
    ],
    { duration: "Ít nhất 4 tuần (có thể tới 6 tuần)" }),
  r("Áp xe phổi, mục 3.1.1", "tr. 110", "r-lungabs-gramneg", ["v8-9"], "Nghi vi khuẩn Gram-âm", "pathogen",
    [
      d("Cefotaxim hoặc ceftazidim", "3–6 g/ngày"),
      d("Kết hợp aminoglycosid", "liều như trên"),
    ],
    { duration: "Ít nhất 4 tuần (có thể tới 6 tuần)" }),
  r("Áp xe phổi, mục 3.1.1", "tr. 110–111", "r-lungabs-anaer", ["v8-9"], "Nghi vi khuẩn kỵ khí", "pathogen",
    [
      d("Beta-lactam-clavulanat + metronidazol", "metronidazol 1–1,5 g/ngày truyền TM chia 2–3 lần/ngày"),
    ],
    { duration: "Ít nhất 4 tuần (có thể tới 6 tuần)", notes: ["Hoặc penicilin G 10–50 triệu đơn vị + metronidazol 1–1,5 g/ngày TM; hoặc penicilin G + clindamycin 1,8 g/ngày truyền TM."] }),
  r("Áp xe phổi, mục 3.1.1", "tr. 111", "r-lungabs-staph", ["v8-9"], "Nghi tụ cầu", "pathogen",
    [
      d("Oxacilin hoặc vancomycin", "oxacilin 6–12 g/ngày; vancomycin 1–2 g/ngày"),
      d("Kết hợp amikacin khi nghi tụ cầu kháng thuốc", "liều như trên"),
    ],
    { duration: "Ít nhất 4 tuần (có thể tới 6 tuần)" }),
  r("Áp xe phổi, mục 3.1.1", "tr. 111", "r-lungabs-amip", ["v8-9"], "Áp xe phổi do amíp", "pathogen",
    [
      d("Metronidazol", "1,5 g/ngày, truyền TM chia 3 lần/ngày"),
      d("Kết hợp kháng sinh khác", "không nêu cụ thể"),
    ]),

  // ===== v8-4 Viêm phổi bệnh viện (BYT 708) =====
  r("Viêm phổi bệnh viện, mục 4 – Bảng II.6", "tr. 95", "r-hap-early", ["v8-4"], "VPBV sớm, không nguy cơ vi khuẩn kháng thuốc", "first",
    [d("Ceftriaxon", "1–2 g mỗi 24 giờ, TM"), d("hoặc cefotaxim", "1–2 g mỗi 8 giờ, TM")],
    { duration: "10–14 ngày; có thể tới 21 ngày nếu P. aeruginosa, Acinetobacter, S. maltophilia, MRSA hoặc triệu chứng kéo dài", notes: ["Chọn một thuốc."] }),
  r("Viêm phổi bệnh viện, mục 4 – Bảng II.6", "tr. 95", "r-hap-early-alt", ["v8-4"], "VPBV sớm, không nguy cơ vi khuẩn kháng thuốc", "alternative",
    [d("Một trong", "cefepim 1–2 g mỗi 12 giờ TM; piperacilin-tazobactam 4,5 g mỗi 8 giờ TM; levofloxacin 750 mg mỗi 24 giờ TM; moxifloxacin 400 mg mỗi 24 giờ TM")],
    { duration: "10–14 ngày" }),
  r("Viêm phổi bệnh viện, mục 4 – Bảng II.6", "tr. 96", "r-hap-late-mild", ["v8-4"], "VPBV muộn (có nguy cơ đa kháng) mức độ nhẹ và vừa", "first",
    [d("Một trong", "ceftriaxon 1–2 g mỗi 24 giờ TM; cefotaxim 1–2 g mỗi 8 giờ TM; cefepim 1–2 g mỗi 8–12 giờ TM; piperacilin-tazobactam 4,5 g mỗi 6 giờ TM; imipenem 500 mg mỗi 8 giờ truyền TM; meropenem 500 mg mỗi 8 giờ TM; levofloxacin 750 mg mỗi 24 giờ TM; moxifloxacin 400 mg mỗi 24 giờ TM")],
    { duration: "10–14 ngày; có thể tới 21 ngày", notes: ["Phối hợp hoặc không: vancomycin 1 g mỗi 12 giờ TM hoặc linezolid 600 mg mỗi 12 giờ TM, nếu có hoặc nghi ngờ MRSA."] }),
  r("Viêm phổi bệnh viện, mục 4 – Bảng II.6", "tr. 96–97", "r-hap-late-icu", ["v8-4"], "VPBV muộn nặng, phải điều trị tại ICU", "severe",
    [
      d("Beta-lactam kháng Pseudomonas (một trong)", "ceftazidim 2 g mỗi 8 giờ hoặc cefepim 1–2 g mỗi 8–12 giờ TM; piperacilin-tazobactam 4,5 g mỗi 6 giờ TM; imipenem 500 mg–1 g mỗi 6 giờ truyền TM hoặc meropenem 1 g mỗi 8 giờ TM"),
      d("Phối hợp với (một trong)", "ciprofloxacin 400 mg mỗi 8 giờ TM hoặc levofloxacin 750 mg mỗi 24 giờ TM; hoặc gentamycin/tobramycin 5–7 mg/kg mỗi 24 giờ TM hoặc amikacin 15–20 mg/kg mỗi 24 giờ TM"),
    ],
    { duration: "10–14 ngày; có thể tới 21 ngày", notes: ["Phối hợp hoặc không: vancomycin 1 g mỗi 12 giờ TM hoặc linezolid 600 mg mỗi 12 giờ TM (nếu có hoặc nghi ngờ MRSA).", "Theo dõi chức năng thận 2 lần/tuần khi phối hợp aminoglycosid."] }),

  // ===== v8-5 Viêm phổi liên quan thở máy (BYT 708) =====
  r("Viêm phổi liên quan thở máy, mục 4.3a", "tr. 103", "r-vap-nomdr", ["v8-5"], "Không có nguy cơ nhiễm vi khuẩn đa kháng", "first",
    [d("Chọn một", "ceftriaxon; quinolon (levofloxacin, moxifloxacin, ciprofloxacin); ampicilin-sulbactam; ertapenem")],
    { duration: "Thời gian ngắn (khoảng 7–10 ngày) với tụ cầu, H. influenzae; dài (ít nhất 14–21 ngày) khi tổn thương nhiều thùy, suy dinh dưỡng, tổn thương ổ/khoang, hoại tử Gram-âm, P. aeruginosa hoặc Acinetobacter", notes: ["Không nêu liều riêng cho từng thuốc ở mục này; xem Bảng II.9 (tr. 105–106) cho liều thông dụng."] }),
  r("Viêm phổi liên quan thở máy, mục 4.3b", "tr. 104", "r-vap-mdr", ["v8-5"], "Có nguy cơ nhiễm vi sinh vật đa kháng", "severe",
    [
      d("Nhóm A (một trong)", "cefepim hoặc ceftazidim; imipenem hoặc meropenem; piperacillin-tazobactam"),
      d("Kết hợp nhóm B (một trong)", "ciprofloxacin hoặc levofloxacin; hoặc amikacin, gentamycin, tobramycin"),
    ],
    { duration: "Như trên; đánh giá lại sau 48–72 giờ và tại ngày 3, 5, 7", notes: ["Cân nhắc thêm nhóm C nếu nghi MRSA: linezolid, vancomycin hoặc teicoplanin.", "Cân nhắc nhóm D nếu nghi nấm (kháng sinh phổ rộng > 7 ngày hoặc suy giảm miễn dịch): fluconazol, itraconazol, amphotericin B, caspofungin.", "Nghi vi khuẩn sinh ESBL: carbapenem kết hợp fluoroquinolon.", "VAP muộn có hoặc nghi Gram-âm đa kháng: colistin kết hợp carbapenem, fluoroquinolon, rifampicin… (không dùng colistin đơn độc; có liều nạp)."] }),

  // ===== Nhi: viêm phổi cộng đồng trẻ em =====
  r("Viêm phổi cộng đồng trẻ em, mục 5.3c", "tr. 90", "r-peds-over5", ["v8-101"], "Trẻ trên 5 tuổi (S. pneumoniae, H. influenzae)", "first",
    [d("Một trong", "benzyl penicilin 50 mg/kg/lần TM ngày 4–6 lần; cephalothin 50–100 mg/kg/ngày TM hoặc TB chia 3–4 lần; cefuroxim 50–75 mg/kg/ngày TM hoặc TB chia 3 lần; ceftriaxon 50–100 mg/kg/ngày TM hoặc TB chia 1–2 lần")],
    { notes: ["Nơi H. influenzae sinh beta-lactamase cao: có thể thay bằng amoxicilin-clavulanat hoặc ampicilin-sulbactam TB hoặc TM."] }),
  r("Viêm phổi cộng đồng trẻ em, mục 5.3c", "tr. 90", "r-peds-atypical", ["v8-101"], "Trẻ trên 5 tuổi: nghi vi khuẩn không điển hình (Mycoplasma, Chlamydia, Legionella)", "pathogen",
    [d("Erythromycin", "40–50 mg/kg/ngày chia 4 lần, uống 10 ngày"), d("hoặc azithromycin", "10 mg/kg ngày đầu, sau đó 5 mg/kg trong 4 ngày tiếp theo; có thể 7–10 ngày")]),
  r("Viêm phổi cộng đồng trẻ em, mục 5.3b", "tr. 89", "r-peds-2m5y-mild-1", ["v8-101"], "Trẻ 2 tháng–5 tuổi, viêm phổi (không nặng)", "first",
    [d("Amoxicilin", "45 mg/kg/ngày uống chia 3 lần; nơi phế cầu kháng cao có thể tăng 75 hoặc 90 mg/kg/ngày chia 2 lần")],
    { duration: "5–7 ngày (ít nhất 5 ngày)", notes: ["Theo dõi 2–3 ngày; nếu không đỡ hoặc nặng thêm thì điều trị như viêm phổi nặng.", "H. influenzae/B. catarrhalis sinh beta-lactamase cao: có thể thay bằng amoxicilin-clavulanat."] }),
  r("Viêm phổi cộng đồng trẻ em, mục 5.3b", "tr. 89", "r-peds-2m5y-mild-2", ["v8-101"], "Trẻ 2 tháng–5 tuổi, viêm phổi (không nặng)", "alternative",
    [d("Co-trimoxazol", "50 mg/kg/ngày uống chia 2 lần (nơi S. pneumoniae chưa kháng nhiều)")],
    { duration: "5–7 ngày" }),
  r("Viêm phổi cộng đồng trẻ em, mục 5.3b", "tr. 89", "r-peds-2m5y-severe", ["v8-101"], "Trẻ 2 tháng–5 tuổi, viêm phổi nặng", "severe",
    [d("Benzyl penicilin", "50 mg/kg/lần TM, ngày 4–6 lần"), d("hoặc ampicilin", "100–150 mg/kg/ngày")],
    { duration: "5–10 ngày", notes: ["Theo dõi sau 2–3 ngày; nếu không đỡ thì điều trị như viêm phổi rất nặng.", "Chuyển đường uống khi cải thiện nhiều (Khuyến cáo 5.9)."] }),
  r("Viêm phổi cộng đồng trẻ em, mục 5.3b", "tr. 89–90", "r-peds-2m5y-vsevere", ["v8-101"], "Trẻ 2 tháng–5 tuổi, viêm phổi rất nặng", "severe",
    [
      d("Benzyl penicilin", "50 mg/kg/lần TM, ngày 4–6 lần"),
      d("Phối hợp gentamycin", "5–7,5 mg/kg/ngày (TB hoặc TM) 1 lần/ngày"),
    ],
    { duration: "5–10 ngày (tiếp tục đủ 7–10 ngày nếu đỡ sau 2–3 ngày)", notes: ["Hoặc chloramphenicol 100 mg/kg/ngày (tối đa 2 g/ngày); hoặc ampicilin 100–150 mg/kg/ngày + gentamycin 5–7,5 mg/kg/ngày.", "Không đỡ: đổi hai công thức cho nhau hoặc cefuroxim 75–150 mg/kg/ngày TM chia 3 lần."] }),
  r("Viêm phổi cộng đồng trẻ em, mục 5.3b", "tr. 90", "r-peds-staph", ["v8-101"], "Trẻ 2 tháng–5 tuổi: nghi viêm phổi do tụ cầu", "pathogen",
    [
      d("Oxacilin", "100 mg/kg/ngày TM hoặc TB chia 3–4 lần"),
      d("Kết hợp gentamycin", "5–7,5 mg/kg/ngày TB hoặc TM, 1 lần/ngày"),
    ],
    { notes: ["Không có oxacilin: thay bằng cephalothin 100 mg/kg/ngày TM hoặc TB chia 3–4 lần + gentamycin liều như trên.", "Tụ cầu kháng methicilin cao: vancomycin 10 mg/kg/lần, ngày 4 lần."] }),

  // ===== Viêm phổi sơ sinh / < 2 tháng =====
  r("Viêm phổi cộng đồng trẻ em, mục 5.3a", "tr. 89", "r-neo-pneu-1", ["v8-102"], "Viêm phổi trẻ sơ sinh và dưới 2 tháng tuổi (mọi trường hợp đều là nặng, phải vào bệnh viện)", "first",
    [d("Benzyl penicilin", "50 mg/kg/ngày TM chia 4 lần"), d("hoặc ampicilin kết hợp gentamycin", "ampicilin 100–150 mg/kg/ngày; gentamycin 5–7,5 mg/kg/ngày TB hoặc TM, 1 lần/ngày")],
    { duration: "5–10 ngày", notes: ["Nguyên nhân thường gặp: liên cầu B, tụ cầu, vi khuẩn Gram-âm, phế cầu, H. influenzae."] }),
  r("Viêm phổi cộng đồng trẻ em, mục 5.3a", "tr. 89", "r-neo-pneu-2", ["v8-102"], "Viêm phổi rất nặng ở trẻ sơ sinh/dưới 2 tháng", "severe",
    [d("Cefotaxim", "100–150 mg/kg/ngày tiêm TM chia 3–4 lần")],
    { duration: "5–10 ngày" }),
];
