/*
  FILE: data/antibiotics/empiric/regimens/critical-care.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015).
  - Nhiem khuan huyet va soc nhiem khuan: tr. 119-122 (Bang II.10, II.11)
  - Suy giam mien dich (giam bach cau hat trung tinh): tr. 252-254
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";
import {
  SEPSIS_DOSES as S,
  SEPSIS_DOSE_NOTE,
  FLAG_CRAB,
  FLAG_DAPTO,
  FLAG_ERTA,
  FLAG_LINEZOLID,
  FLAG_PIPTAZO,
  FLAG_VANCO,
} from "./byt708-doses";

const r = maker("byt708");

const SEPSIS = "Nhiễm khuẩn huyết và sốc nhiễm khuẩn, mục 4.1.2";
const SEPSIS_IDS = ["v8-11", "v8-12"];
const SEPSIS_NOTE =
  "Dùng kháng sinh trong giờ đầu sau khi cấy máu; ưu tiên đường tĩnh mạch; xuống thang theo kháng sinh đồ; chỉnh liều theo độ thanh thải creatinin.";

export const CRITICAL_CARE: Regimen[] = [
  // ===== Sepsis / sốc nhiễm khuẩn =====
  // Lieu bo sung 25/10/2026 tu ban QĐ 708 tren kcb.vn: Bang II.11 (tr. 122) va
  // Bang II.10 (tr. 121–122) cung chuong; thuoc khong co trong 2 bang: Bang II.9
  // (chuong VPLQTM, tr. 105–106) hoac Duoc thu QG lan 3 (2023) theo trang ghi kem.
  r(SEPSIS + "a", "tr. 119", "r-sepsis-a", SEPSIS_IDS,
    "Chưa rõ ổ nhiễm khuẩn, không nguy cơ nhiễm khuẩn bệnh viện, miễn dịch bình thường", "first",
    [
      d("Kháng sinh nhóm 1 (chọn một)", [S.piptazo, S.ceftriaxon, S.cefotaxim, S.ceftazidim, S.cefoperazon, S.cefepim, S.cefpirom].join("; ")),
      d("Phối hợp (chọn một)", [S.cipro, S.levo, S.moxi, S.amikacin, S.netilmicin].join("; ")),
    ],
    { notes: [SEPSIS_NOTE, SEPSIS_DOSE_NOTE, FLAG_PIPTAZO] }),
  r(SEPSIS + "a", "tr. 119", "r-sepsis-a-mssa", SEPSIS_IDS,
    "Nghi tác nhân S. aureus nhạy methicilin (MSSA)", "pathogen",
    [d("Một trong", [S.oxacilin, S.cloxacilin, S.cefazolin].join("; "))],
    { notes: ["Thêm vào phác đồ nền.", SEPSIS_DOSE_NOTE] }),
  r(SEPSIS + "a", "tr. 119", "r-sepsis-a-mrsa", SEPSIS_IDS,
    "Nghi tác nhân S. aureus kháng methicilin (MRSA)", "pathogen",
    [d("Một trong", [S.vancomycin, S.teicoplanin, S.daptomycin].join("; "))],
    { notes: [SEPSIS_DOSE_NOTE, FLAG_VANCO, FLAG_DAPTO] }),
  r(SEPSIS + "a", "tr. 119", "r-sepsis-a-anaer", SEPSIS_IDS,
    "Nghi vi khuẩn kỵ khí", "pathogen",
    [d("Metronidazol", S.metronidazol)],
    { notes: ["Mục 4.1.2a không nêu liều; liều lấy từ Bảng II.10 (dòng Clostridium perfringens, Bacteroides fragilis)."] }),
  r(SEPSIS + "a", "tr. 119–120", "r-sepsis-neutro", SEPSIS_IDS,
    "Giảm bạch cầu hạt (< 0,5 x 10^9/L hoặc dự đoán giảm), suy giảm miễn dịch", "severe",
    [
      d("Một trong", [S.ertapenem, S.imipenem, S.doripenem, S.meropenem, S.piptazo].join("; ")),
      d("Phối hợp (chọn một)", [S.cipro, S.levo, S.moxi, S.amikacin, S.netilmicin].join("; ")),
    ],
    { notes: [SEPSIS_NOTE, "Sốt kéo dài tới 96 giờ: tìm nguyên nhân nhiễm khuẩn bệnh viện và cân nhắc bổ sung thuốc kháng nấm phù hợp.", SEPSIS_DOSE_NOTE, FLAG_PIPTAZO, FLAG_ERTA] }),
  r(SEPSIS + "b", "tr. 120", "r-sepsis-b", SEPSIS_IDS,
    "Chưa rõ ổ nhiễm khuẩn nhưng có yếu tố nguy cơ nhiễm khuẩn bệnh viện", "severe",
    [
      d("Một trong (có tác dụng P. aeruginosa)", [S.imipenem, S.doripenem, S.meropenem, S.piptazo].join("; ")),
      d("Phối hợp (chọn một)", [S.cipro, S.levo, S.moxi, S.amikacin, S.netilmicin, S.fosfomycin].join("; ")),
    ],
    { notes: ["Dựa vào thông tin vi khuẩn học và nhạy cảm kháng sinh của bệnh viện; chỉnh liều theo độ thanh thải creatinin.", SEPSIS_DOSE_NOTE, FLAG_PIPTAZO] }),
  r(SEPSIS + "b", "tr. 120", "r-sepsis-b-mrsa", SEPSIS_IDS,
    "Có yếu tố nguy cơ nhiễm khuẩn bệnh viện, nghi MRSA", "pathogen",
    [d("Thêm một trong", [S.vancomycin, S.teicoplanin, S.daptomycin].join("; "))],
    { notes: [SEPSIS_DOSE_NOTE, FLAG_VANCO, FLAG_DAPTO] }),
  r(SEPSIS + "b", "tr. 120", "r-sepsis-b-mdr", SEPSIS_IDS,
    "Nghi Gram-âm đa kháng (kháng carbapenem)", "pathogen",
    [
      d("Carbapenem có tác dụng A. baumannii và/hoặc penicilin phổ rộng + chất ức chế beta-lactamase", [S.imipenem, S.meropenem, S.piptazo, S.ampsul].join("; ")),
      d("Phối hợp colistin (để tăng tác dụng hiệp đồng)", S.colistin),
    ],
    { notes: ["Văn bản không nêu tên carbapenem cụ thể; liều tham chiếu imipenem, meropenem theo Bảng II.11.", SEPSIS_DOSE_NOTE, FLAG_CRAB] }),
  r(SEPSIS + "c", "tr. 120", "r-sepsis-c-biliary", SEPSIS_IDS,
    "Ổ nhiễm khuẩn gan mật (K. pneumoniae là vi khuẩn chính gây nhiễm khuẩn huyết và áp xe gan ở Việt Nam)", "pathogen",
    [
      d("Cephalosporin thế hệ 3 hoặc 4; hoặc carbapenem (nếu nguy cơ ESBL)", "Văn bản không nêu tên thuốc cụ thể. Liều tham chiếu các thuốc cùng nhóm trong Bảng II.11: " + [S.ceftriaxon, S.ceftazidim, S.cefepim, S.ertapenem, S.imipenem, S.meropenem].join("; ")),
      d("Phối hợp aminoglycosid (amikacin, neltimicin) hoặc metronidazol khi nghi kỵ khí", [S.amikacin, S.netilmicin, S.metronidazol].join("; ")),
    ],
    { notes: [SEPSIS_DOSE_NOTE, FLAG_ERTA] }),
  r(SEPSIS + "c", "tr. 120", "r-sepsis-c-gi", SEPSIS_IDS,
    "Ổ nhiễm khuẩn ống tiêu hóa", "pathogen",
    [
      d("Cephalosporin thế hệ 3 hoặc 4; hoặc carbapenem; hoặc quinolon (ciprofloxacin)", "Văn bản không nêu tên cephalosporin/carbapenem cụ thể. Liều tham chiếu Bảng II.11: " + [S.ceftriaxon, S.ceftazidim, S.cefepim, S.ertapenem, S.imipenem, S.meropenem, S.cipro].join("; ")),
      d("Phối hợp metronidazol khi nghi kỵ khí", S.metronidazol),
    ],
    { notes: [SEPSIS_DOSE_NOTE, FLAG_ERTA] }),
  r(SEPSIS + "c", "tr. 121", "r-sepsis-c-device", SEPSIS_IDS.concat(["v8-15", "v8-108"]),
    "Nhiễm khuẩn liên quan đến dụng cụ mạch máu (nghi MRSA)", "pathogen",
    [d("Một trong", [S.vancomycin, S.linezolid, S.teicoplanin, S.daptomycin].join("; "))],
    { notes: ["Nếu có yếu tố nguy cơ nhiễm khuẩn bệnh viện, xem thêm mục 4.1.2b.", SEPSIS_DOSE_NOTE, FLAG_LINEZOLID, FLAG_VANCO, FLAG_DAPTO] }),
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
    [
      d("MSSA – một trong", [S.oxacilin, S.cloxacilin, S.cefazolin].join("; ")),
      d("hoặc MRSA – một trong", [S.vancomycin, S.teicoplanin, S.daptomycin].join("; ")),
    ],
    { notes: ["Chọn nhóm MSSA hoặc MRSA, không dùng cả hai.", "Tổn thương da (ví dụ bỏng): cân nhắc nguy cơ nhiễm khuẩn bệnh viện và dùng kháng sinh có tác dụng P. aeruginosa.", SEPSIS_DOSE_NOTE, FLAG_VANCO, FLAG_DAPTO] }),

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
    [d("Daptomycin", "4–6 mg/kg/ngày")],
    { notes: [FLAG_DAPTO] }),

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
    { notes: [
      "Thay thế: ciprofloxacin 400–1200 mg/ngày; imipenem-cilastatin 1 g/lần truyền TM mỗi 6–8 giờ; meropenem 1 g/lần TM mỗi 8 giờ.",
      "Chỉ dùng khi chủng còn nhạy với thuốc được chọn (theo kháng sinh đồ). KHÔNG áp dụng cho P. aeruginosa DTR: theo IDSA 2026, DTR là chủng không nhạy với tất cả các thuốc aztreonam, cefepim, ceftazidim, ciprofloxacin, imipenem, levofloxacin, meropenem và piperacilin-tazobactam. Văn bản BYT đang dùng không có phác đồ cho DTR – xem mục Guideline quốc tế.",
    ] }),

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
