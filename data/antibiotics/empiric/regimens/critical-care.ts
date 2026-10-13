/*
  FILE: data/antibiotics/empiric/regimens/critical-care.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015).
  - Nhiem khuan huyet va soc nhiem khuan: tr. 119-122 (Bang II.10, II.11)
  - Suy giam mien dich (giam bach cau hat trung tinh): tr. 252-254
*/

import { d, maker, NO_DOSE } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");

const SEPSIS = "Nhiễm khuẩn huyết và sốc nhiễm khuẩn, mục 4.1.2";
const SEPSIS_IDS = ["v8-11", "v8-12"];
const SEPSIS_NOTE =
  "Dùng kháng sinh trong giờ đầu sau khi cấy máu; ưu tiên đường tĩnh mạch; xuống thang theo kháng sinh đồ; chỉnh liều theo độ thanh thải creatinin.";

export const CRITICAL_CARE: Regimen[] = [
  // ===== Sepsis / sốc nhiễm khuẩn =====
  r(SEPSIS + "a", "tr. 119", "r-sepsis-a", SEPSIS_IDS,
    "Chưa rõ ổ nhiễm khuẩn, không nguy cơ nhiễm khuẩn bệnh viện, miễn dịch bình thường", "first",
    [
      d("Kháng sinh nhóm 1 (chọn một)", "piperacilin-tazobactam; cephalosporin thế hệ 3 (ceftriaxon, cefotaxim, ceftazidim, cefoperazol…); cephalosporin thế hệ 4 (cefepim, cefpirom)"),
      d("Phối hợp (chọn một)", "quinolon (ciprofloxacin, levofloxacin, moxifloxacin) hoặc aminoglycosid (amikacin, neltimicin…)"),
    ],
    { notes: [SEPSIS_NOTE, "Văn bản không nêu liều riêng ở mục này; xem Bảng II.11 (tr. 122)."] }),
  r(SEPSIS + "a", "tr. 119", "r-sepsis-a-mssa", SEPSIS_IDS,
    "Nghi tác nhân S. aureus nhạy methicilin (MSSA)", "pathogen",
    [d("Một trong", "oxacilin, cloxacilin, cefazolin")],
    { notes: ["Thêm vào phác đồ nền; liều theo Bảng II.10 và II.11."] }),
  r(SEPSIS + "a", "tr. 119", "r-sepsis-a-mrsa", SEPSIS_IDS,
    "Nghi tác nhân S. aureus kháng methicilin (MRSA)", "pathogen",
    [d("Một trong", "vancomycin, teicoplanin, daptomycin")]),
  r(SEPSIS + "a", "tr. 119", "r-sepsis-a-anaer", SEPSIS_IDS,
    "Nghi vi khuẩn kỵ khí", "pathogen",
    [d("Metronidazol", "không nêu liều ở mục này; xem Bảng II.10 (tr. 122): tấn công 15 mg/kg, duy trì 7,5 mg/kg truyền 1 giờ mỗi 6 giờ")]),
  r(SEPSIS + "a", "tr. 119–120", "r-sepsis-neutro", SEPSIS_IDS,
    "Giảm bạch cầu hạt (< 0,5 x 10^9/L hoặc dự đoán giảm), suy giảm miễn dịch", "severe",
    [
      d("Một trong", "carbapenem (ertapenem, imipenem-cilastatin, doripenem, meropenem) hoặc piperacilin-tazobactam"),
      d("Phối hợp (chọn một)", "quinolon (ciprofloxacin, levofloxacin, moxifloxacin) hoặc aminoglycosid (amikacin, neltimicin)"),
    ],
    { notes: [SEPSIS_NOTE, "Sốt kéo dài tới 96 giờ: tìm nguyên nhân nhiễm khuẩn bệnh viện và cân nhắc bổ sung thuốc kháng nấm phù hợp."] }),
  r(SEPSIS + "b", "tr. 120", "r-sepsis-b", SEPSIS_IDS,
    "Chưa rõ ổ nhiễm khuẩn nhưng có yếu tố nguy cơ nhiễm khuẩn bệnh viện", "severe",
    [
      d("Một trong (có tác dụng P. aeruginosa)", "carbapenem (imipenem-cilastatin, doripenem, meropenem) hoặc piperacilin-tazobactam"),
      d("Phối hợp (chọn một)", "quinolon (ciprofloxacin, levofloxacin, moxifloxacin); aminoglycosid (amikacin, neltimicin); hoặc fosfomycin"),
    ],
    { notes: ["Dựa vào thông tin vi khuẩn học và nhạy cảm kháng sinh của bệnh viện; chỉnh liều theo độ thanh thải creatinin."] }),
  r(SEPSIS + "b", "tr. 120", "r-sepsis-b-mrsa", SEPSIS_IDS,
    "Có yếu tố nguy cơ nhiễm khuẩn bệnh viện, nghi MRSA", "pathogen",
    [d("Thêm một trong", "vancomycin, teicoplanin, daptomycin")]),
  r(SEPSIS + "b", "tr. 120", "r-sepsis-b-mdr", SEPSIS_IDS,
    "Nghi Gram-âm đa kháng (kháng carbapenem)", "pathogen",
    [
      d("Carbapenem có tác dụng A. baumannii và/hoặc penicilin phổ rộng + chất ức chế beta-lactamase", "piperacilin-tazobactam hoặc ampicilin-sulbactam"),
      d("Phối hợp colistin", "để tăng tác dụng hiệp đồng"),
    ]),
  r(SEPSIS + "c", "tr. 120", "r-sepsis-c-biliary", SEPSIS_IDS,
    "Ổ nhiễm khuẩn gan mật (K. pneumoniae là vi khuẩn chính gây nhiễm khuẩn huyết và áp xe gan ở Việt Nam)", "pathogen",
    [
      d("Cephalosporin thế hệ 3 hoặc 4; hoặc carbapenem (nếu nguy cơ ESBL)", "không nêu liều ở mục này"),
      d("Phối hợp aminoglycosid (amikacin, neltimicin) hoặc metronidazol khi nghi kỵ khí", NO_DOSE),
    ]),
  r(SEPSIS + "c", "tr. 120", "r-sepsis-c-gi", SEPSIS_IDS,
    "Ổ nhiễm khuẩn ống tiêu hóa", "pathogen",
    [
      d("Cephalosporin thế hệ 3 hoặc 4; hoặc carbapenem; hoặc quinolon (ciprofloxacin)", "không nêu liều ở mục này"),
      d("Phối hợp metronidazol khi nghi kỵ khí", NO_DOSE),
    ]),
  r(SEPSIS + "c", "tr. 121", "r-sepsis-c-device", SEPSIS_IDS.concat(["v8-15", "v8-108"]),
    "Nhiễm khuẩn liên quan đến dụng cụ mạch máu (nghi MRSA)", "pathogen",
    [d("Một trong", "vancomycin, linezolid, teicoplanin hoặc daptomycin")],
    { notes: ["Nếu có yếu tố nguy cơ nhiễm khuẩn bệnh viện, xem thêm mục 4.1.2b. Văn bản không nêu liều ở mục này; xem Bảng II.10 (vancomycin 1 g mỗi 12 giờ cho MRSA)."] }),
  r(SEPSIS + "c", "tr. 121", "r-sepsis-c-female", SEPSIS_IDS,
    "Nhiễm khuẩn sinh dục ở nữ giới", "pathogen",
    [
      d("Ceftriaxon", "1 g TM hàng ngày"),
      d("Azithromycin", "500 mg TM hàng ngày"),
      d("Metronidazol", "1 g/ngày"),
    ],
    { notes: ["Nghi nhiễm khuẩn bệnh viện: imipenem-cilastatin, meropenem hoặc piperacilin-tazobactam phối hợp azithromycin và metronidazol; nghi đa kháng thêm colistin."] }),
  r(SEPSIS + "c", "tr. 121", "r-sepsis-c-skin", SEPSIS_IDS,
    "Nhiễm khuẩn da (nghi S. aureus)", "pathogen",
    [d("MSSA: oxacilin, cloxacilin hoặc cefazolin; MRSA: vancomycin, teicoplanin hoặc daptomycin", NO_DOSE)],
    { notes: ["Tổn thương da (ví dụ bỏng): cân nhắc nguy cơ nhiễm khuẩn bệnh viện và dùng kháng sinh có tác dụng P. aeruginosa."] }),

  // ===== Nhiễm khuẩn huyết do S. aureus (Bảng II.10) =====
  r("Bảng II.10 (tr. 121–122)", "tr. 122", "r-bsi-mssa", ["v8-13"],
    "Staphylococcus aureus nhạy methicilin (MSSA)", "first",
    [d("Oxacilin", "100–200 mg/kg/ngày chia, tiêm TM chậm cách 6 giờ/lần")]),
  r("Bảng II.10 (tr. 121–122)", "tr. 122", "r-bsi-mssa-alt", ["v8-13"],
    "Staphylococcus aureus nhạy methicilin (MSSA)", "alternative",
    [d("Vancomycin", "1 g/lần truyền TM cách mỗi 12 giờ")]),
  r("Bảng II.10 (tr. 121–122)", "tr. 122", "r-bsi-mrsa", ["v8-13"],
    "Staphylococcus aureus kháng methicilin (MRSA)", "first",
    [d("Vancomycin", "1 g/lần truyền TM cách mỗi 12 giờ")]),
  r("Bảng II.10 (tr. 121–122)", "tr. 122", "r-bsi-mrsa-alt", ["v8-13"],
    "Staphylococcus aureus kháng methicilin (MRSA)", "alternative",
    [d("Daptomycin", "4–6 mg/kg/ngày")]),

  // ===== Nhiễm khuẩn huyết do Gram âm (Bảng II.10) =====
  r("Bảng II.10 (tr. 121)", "tr. 121", "r-bsi-enterobact", ["v8-14"],
    "Enterobacteriaceae không sinh ESBL", "first",
    [
      d("(Tên thuốc không có trong bản in)", "400 mg x 2 đến 3 lần/ngày, tối đa không quá 1200 mg/ngày, truyền TM"),
      d("Ceftriaxon", "2 g/lần, tiêm TM chậm mỗi 12 giờ/lần"),
    ],
    { notes: ["Ô thuốc thứ nhất của Bảng II.10 trong bản PDF thiếu tên hoạt chất (chỉ còn liều); không tự suy luận. Cần đối chiếu bản gốc BYT.", "Thay thế theo văn bản: các cephalosporin thế hệ 3 và 4 khác; các kháng sinh nhóm fluoroquinolon."] }),
  r("Bảng II.10 (tr. 121)", "tr. 121", "r-bsi-esbl", ["v8-14", "v8-43"],
    "Enterobacteriaceae sinh ESBL", "first",
    [d("Ertapenem", "1 g/lần/ngày, truyền TM trong 3–4 giờ")],
    { notes: ["Thay thế: imipenem-cilastatin 500 mg/lần truyền TM mỗi 6 giờ; meropenem 1 g/lần truyền TM 8 giờ/lần; doripenem 500 mg/lần truyền TM 8 giờ/lần."] }),
  r("Bảng II.10 (tr. 121)", "tr. 121", "r-bsi-pseudo", ["v8-14", "v8-46"],
    "Pseudomonas aeruginosa", "first",
    [d("Một trong", "ceftazidim 2 g/lần tiêm TM chậm mỗi 8 giờ; cefepim 2 g/lần tiêm TM chậm mỗi 8 giờ; piperacillin-tazobactam 4,5 g/lần tiêm TM mỗi 6 giờ")],
    { notes: ["Thay thế: ciprofloxacin 400–1200 mg/ngày; imipenem-cilastatin 1 g/lần truyền TM mỗi 6–8 giờ; meropenem 1 g/lần TM mỗi 8 giờ."] }),

  // ===== Sốt giảm bạch cầu hạt trung tính =====
  r("Suy giảm miễn dịch, mục 5b", "tr. 254", "r-fn-mono-caz", ["v8-113", "v8-116"],
    "Sốt giảm bạch cầu hạt trung tính nguy cơ cao – khởi đầu", "first",
    [d("Ceftazidim", "2 g mỗi 8 giờ")],
    { duration: "Tới khi ANC > 500/µl (nếu có ổ/căn nguyên: theo từng loại vi khuẩn, ví dụ nhiễm khuẩn huyết do E. coli tối thiểu 14 ngày)", notes: ["Cấp cứu nội khoa: kháng sinh phổ rộng, liều cao, lý tưởng trong 60 phút đầu. Cấy máu 2 vị trí trước kháng sinh. Chỉnh liều theo chức năng gan thận."] }),
  r("Suy giảm miễn dịch, mục 5b", "tr. 254", "r-fn-mono-cef", ["v8-113", "v8-116"],
    "Sốt giảm bạch cầu hạt trung tính nguy cơ cao – khởi đầu", "first",
    [d("Cefepim", "2 g mỗi 8 giờ")],
    { duration: "Tới khi ANC > 500/µl" }),
  r("Suy giảm miễn dịch, mục 5b", "tr. 254", "r-fn-mono-pip", ["v8-113", "v8-116"],
    "Sốt giảm bạch cầu hạt trung tính nguy cơ cao – khởi đầu", "first",
    [d("Piperacilin-tazobactam", "4,5 g mỗi 6 giờ")],
    { duration: "Tới khi ANC > 500/µl" }),
  r("Suy giảm miễn dịch, mục 5b", "tr. 254", "r-fn-mono-imi", ["v8-113", "v8-116"],
    "Sốt giảm bạch cầu hạt trung tính nguy cơ cao – khởi đầu", "first",
    [d("Imipenem-cilastatin", "500 mg mỗi 6 giờ hoặc 1 g mỗi 8 giờ")],
    { duration: "Tới khi ANC > 500/µl" }),
  r("Suy giảm miễn dịch, mục 5b", "tr. 254", "r-fn-mono-mero", ["v8-113", "v8-116"],
    "Sốt giảm bạch cầu hạt trung tính nguy cơ cao – khởi đầu", "first",
    [d("Meropenem", "1 g mỗi 8 giờ")],
    { duration: "Tới khi ANC > 500/µl" }),
  r("Suy giảm miễn dịch, mục 5b", "tr. 254", "r-fn-add-aminoglyc", ["v8-113", "v8-116"],
    "Kết hợp thêm vào phác đồ khởi đầu", "adjunct",
    [d("Aminoglycosid (amikacin, gentamycin, tobramycin)", "giảm liều khi suy thận; liều cụ thể căn cứ độ thanh thải creatinin")]),
  r("Suy giảm miễn dịch, mục 5b", "tr. 254", "r-fn-add-fq", ["v8-113", "v8-116"],
    "Kết hợp thêm vào phác đồ khởi đầu", "adjunct",
    [d("Fluoroquinolon", "ciprofloxacin 400 mg mỗi 8 giờ; levofloxacin 750 mg mỗi 24 giờ; moxifloxacin 400 mg mỗi 24 giờ")]),
  r("Suy giảm miễn dịch, mục 5b", "tr. 254", "r-fn-add-gp", ["v8-113", "v8-116"],
    "Kết hợp thêm: nhiễm khuẩn da, phần mềm, chân catheter, viêm phổi, nhiễm khuẩn huyết do Gram-dương", "pathogen",
    [d("Vancomycin", "1 g mỗi 12 giờ")],
    { notes: ["Teicoplanin 400 mg mỗi 12 giờ cho nhiễm khuẩn nặng do Gram-dương, đặc biệt tụ cầu vàng kháng methicilin và cephalosporin."] }),
  r("Suy giảm miễn dịch, mục 5b", "tr. 254", "r-fn-add-colistin", ["v8-113", "v8-116"],
    "Nhiễm khuẩn nặng đe dọa tính mạng do Gram-âm kháng carbapenem", "pathogen",
    [d("Colistin", "6.000.000 đơn vị (tương đương 200 mg colistin base) mỗi 8 giờ")]),
];
