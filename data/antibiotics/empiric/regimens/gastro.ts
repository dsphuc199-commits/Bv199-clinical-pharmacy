/*
  FILE: data/antibiotics/empiric/regimens/gastro.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015), Chuong 5 Nhiem khuan tieu hoa.
  - Tieu chay do vi khuan: tr. 142-143 (v8-25, v8-26, v8-135)
  - Nhiem khuan duong mat: tr. in 182–184, Bang II.14, II.15 (v8-24)
  - Viem phuc mac: tr. 159-160, Bang II.18 (v8-21)
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");

const BILIARY = "Nhiễm khuẩn đường mật, Bảng II.15";
export const BILIARY_ANAEROBIC_REGIMEN_ID = "r-bil-anaer";
export const BILIARY_ANAEROBIC_BASE_IDS = [
  "r-bil-1-bli", "r-bil-1-pip", "r-bil-1-aminoglyc", "r-bil-1-ceph", "r-bil-1-azt", "r-bil-2-fq",
];

export const GASTRO: Regimen[] = [
  // ===== Nhiễm khuẩn đường mật (v8-24) =====
  r(BILIARY, "tr. 184", "r-bil-1-bli", ["v8-24"],
    "Lựa chọn số 1: penicillin phổ rộng + chất ức chế beta-lactamase", "first",
    [d("Ampicilin-sulbactam", "TM 1,5–3 g/6 giờ")]),
  r(BILIARY, "tr. 184", "r-bil-1-pip", ["v8-24"],
    "Lựa chọn số 1: penicillin phổ rộng + chất ức chế beta-lactamase", "first",
    [d("Piperacilin-tazobactam", "TM 4,5 g/6 giờ")]),
  r(BILIARY, "tr. 184", "r-bil-1-aminoglyc", ["v8-24"],
    "Lựa chọn số 1: aminoglycosid", "alternative",
    [
      d("Gentamicin", "TB hoặc pha loãng tiêm TM 80 mg/8 giờ"),
      d("Hoặc Amikacin", "TB hoặc TM 5 mg/kg/8 giờ"),
      d("Hoặc Tobramycin", "TB hoặc TM 1 mg/kg/8 giờ"),
    ]),
  r(BILIARY, "tr. 184", "r-bil-1-ceph", ["v8-24"],
    "Lựa chọn số 1: cephalosporin thế hệ 3, 4", "first",
    [d("Một trong", "cefoperazon-sulbactam TM 2 g/12 giờ; ceftriaxon TM 2–4 g/1 lần/24 giờ; ceftazidim TM 1–2 g/12 giờ; cefepim TM 1–2 g/12 giờ")]),
  r(BILIARY, "tr. 184", "r-bil-1-azt", ["v8-24"],
    "Lựa chọn số 1: monobactam", "alternative",
    [d("Aztreonam", "1–2 g/12 giờ")]),
  r(BILIARY, "tr. 184", BILIARY_ANAEROBIC_REGIMEN_ID, ["v8-24"],
    "Phối hợp khi có nhiễm khuẩn kỵ khí", "adjunct",
    [d("Metronidazol", "TM 500 mg/8 giờ")],
    { condition: "Nếu có nhiễm khuẩn kỵ khí, thêm metronidazol vào kháng sinh đã chọn ở trên." }),
  r(BILIARY, "tr. 184", "r-bil-2-fq", ["v8-24"],
    "Lựa chọn số 2: fluoroquinolon", "alternative",
    [d("Một trong", "ciprofloxacin 500 mg uống hoặc TM/12 giờ; levofloxacin 500 mg uống hoặc TM/24 giờ; moxifloxacin uống hoặc TM 400 mg/24 giờ")]),
  r(BILIARY, "tr. 184", "r-bil-2-carba", ["v8-24"],
    "Lựa chọn số 2: carbapenem", "alternative",
    [d("Một trong", "meropenem TM 1 g/8 giờ; imipenem-cilastatin TM 1–2 g/12 giờ; doripenem TM 0,5 g/8 giờ")]),

  // ===== Viêm phúc mạc thứ phát (v8-21) =====
  r("Viêm phúc mạc, mục 4.2", "tr. 160", "r-peri-sec-1", ["v8-21"],
    "Viêm phúc mạc thứ phát", "first",
    [
      d("Một trong", "ticarcilin-clavulanat; piperacilin-tazobactam (truyền TM 4,5 g mỗi 8 giờ); ertapenem (truyền TM 1 g mỗi 24 giờ)"),
      d("Kết hợp metronidazol", "truyền TM 500 mg mỗi 8–12 giờ"),
    ],
    { notes: ["Điều trị hỗ trợ: dẫn lưu ổ áp xe, phẫu thuật lại ổ bụng, hồi sức chống sốc. Điều chỉnh theo kháng sinh đồ khi có kết quả cấy dịch ổ bụng hoặc máu.", "Văn bản không nêu thời gian điều trị riêng cho viêm phúc mạc thứ phát."] }),
  r("Viêm phúc mạc, mục 4.2", "tr. 160", "r-peri-sec-2", ["v8-21"],
    "Viêm phúc mạc thứ phát – trường hợp nặng", "severe",
    [
      d("Một trong", "imipenem-cilastatin (truyền TM 500 mg mỗi 6 giờ hoặc 1 g mỗi 8 giờ); doripenem (truyền TM 500 mg mỗi 8 giờ); meropenem (tiêm/truyền TM 1 g mỗi 8 giờ)"),
      d("Kết hợp metronidazol", "truyền TM 500 mg mỗi 8–12 giờ"),
    ]),

  // ===== Tiêu chảy do vi khuẩn =====
  r("Tiêu chảy do vi khuẩn, mục 4.2a", "tr. 142–143", "r-diar-invasive-fq", ["v8-26"],
    "Tiêu chảy do E. coli (ETEC, EHEC), Campylobacter, Yersinia, Salmonella, Vibrio spp. (người > 12 tuổi)", "first",
    [d("Quinolon (uống hoặc truyền) – một trong", "ciprofloxacin 0,5 g x 2 lần/ngày; norfloxacin 0,4 g x 2 lần/ngày")],
    { duration: "5 ngày", notes: ["Kháng sinh thường hiệu quả trong tiêu chảy xâm nhập; thường dùng đường uống, đường truyền chỉ khi nặng có nhiễm khuẩn toàn thân. Liều chủ yếu cho người lớn. Bù dịch điện giải."] }),
  r("Tiêu chảy do vi khuẩn, mục 4.2a", "tr. 143", "r-diar-invasive-alt", ["v8-26"],
    "Tiêu chảy do E. coli (ETEC, EHEC), Campylobacter, Yersinia, Salmonella, Vibrio spp.", "alternative",
    [d("Một trong", "ceftriaxon TM 50–100 mg/kg/ngày x 5 ngày; TMP-SMX 0,96 g x 2 lần/ngày x 5 ngày; doxycyclin 100 mg x 2 lần/ngày x 5 ngày")],
    { duration: "5 ngày" }),
  r("Tiêu chảy do vi khuẩn, mục 4.2c", "tr. 143", "r-diar-shigella", ["v8-26"],
    "Tiêu chảy do Shigella (lỵ trực khuẩn)", "pathogen",
    [d("Quinolon (người > 12 tuổi) – một trong", "ciprofloxacin 0,5 g x 2 lần/ngày; norfloxacin 0,4 g x 2 lần/ngày")],
    { duration: "5 ngày", notes: ["Thay thế: ceftriaxon TM 50–100 mg/kg/ngày x 5 ngày; hoặc azithromycin uống 0,5 g/ngày x 3 ngày (ưu tiên cho phụ nữ có thai) hoặc 10 mg/kg/ngày x 3 ngày (trẻ < 12 tuổi)."] }),
  r("Tiêu chảy do vi khuẩn, mục 4.2b", "tr. 143", "r-cdiff-1", ["v8-25"],
    "Tiêu chảy do Clostridium difficile", "first",
    [d("Metronidazol", "250 mg uống mỗi 6 giờ")],
    { duration: "7–10 ngày" }),
  r("Tiêu chảy do vi khuẩn, mục 4.2b", "tr. 143", "r-cdiff-2", ["v8-25"],
    "Tiêu chảy do Clostridium difficile", "alternative",
    [d("Vancomycin", "250 mg uống mỗi 6 giờ")],
    { duration: "7–10 ngày" }),

  // ===== Thương hàn (v8-135) =====
  r("Tiêu chảy do vi khuẩn, mục 4.2d", "tr. 143", "r-typhoid-fq", ["v8-135"],
    "Thương hàn (Salmonella typhi, paratyphi), người lớn > 12 tuổi", "first",
    [d("Quinolon (uống hoặc truyền) – một trong", "ciprofloxacin 0,5 g x 2 lần/ngày; norfloxacin 0,4 g x 2 lần/ngày")],
    { duration: "10–14 ngày" }),
  r("Tiêu chảy do vi khuẩn, mục 4.2d", "tr. 143", "r-typhoid-ctx", ["v8-135"],
    "Thương hàn", "alternative",
    [d("Ceftriaxon", "TM 50–100 mg/kg/lần x 1 lần/ngày")],
    { duration: "10–14 ngày" }),
];
