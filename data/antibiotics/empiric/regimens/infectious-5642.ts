/*
  FILE: data/antibiotics/empiric/regimens/infectious-5642.ts
  Nguon: BYT QĐ 5642/QĐ-BYT (31/12/2015) "Hướng dẫn chẩn đoán và điều trị một số bệnh
  truyền nhiễm" – ban PDF tren kcb.vn, doc ngay 25/10/2026. Trang in = trang PDF.
  - Viem mang nao nhiem khuan: tr. 18–20 (bang theo lua tuoi + bang lieu tr. 19)
  - Thuong han: tr. 40–41
  - Ly truc khuan: tr. 46
  Van ban moi hon QĐ 708 (02/03/2015). Viem mang nao va ly: GIU CA HAI nguon (xem index.ts).
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt5642");

/* ---------- Viem mang nao nhiem khuan ---------- */
const VMN = "Viêm màng não nhiễm khuẩn, mục 4.2a – bảng kháng sinh theo lứa tuổi";
const VMN_P = "tr. 19";
const DOSE_NOTE =
  "Bảng liều tr. 19 (chức năng gan, thận bình thường; liều thấp áp dụng ở trẻ dưới 7 ngày tuổi) ghi tổng liều theo kg/ngày, không tách liều người lớn – đối chiếu QĐ 708 (liều người lớn cố định). CẦN DƯỢC SĨ XÁC NHẬN khi dùng cho người lớn.";
const VMN_DUR =
  "Não mô cầu 7 ngày, Hib 10 ngày, phế cầu 14 ngày; trực khuẩn, vi khuẩn kị khí Gram âm, liên cầu, tụ cầu 3 tuần; hoặc trung bình đủ 10–14 ngày và đã hết sốt 3 ngày (mục 5.1, tr. 20)";
const VMN_NOTES = [
  "Dexamethason 0,4 mg/kg/ngày tiêm tĩnh mạch chậm, 4 ngày (cùng hoặc trước kháng sinh 15 phút) (tr. 19).",
  "Có kết quả nhuộm Gram: cầu khuẩn Gram dương – ceftriaxon hoặc cefotaxim + vancomycin; song cầu Gram âm – penicillin G hoặc ceftriaxon; trực khuẩn Gram dương – ampicillin + aminoglycosid; trực khuẩn Gram âm – ceftriaxon + aminoglycosid (tr. 20).",
  DOSE_NOTE,
];

const DOSE = {
  amikacin: "Amikacin 20–30 mg/kg/ngày, chia mỗi 12 giờ",
  gentamicin: "Gentamicin 5 mg/kg/ngày, chia mỗi 12 giờ",
  ampicilin: "Ampicilin 150–300 mg/kg/ngày, chia mỗi 6 giờ",
  cefotaxim: "Cefotaxim 100–200 mg/kg/ngày, chia mỗi 8 giờ",
  ceftazidim: "Ceftazidim 60–150 mg/kg/ngày, chia mỗi 8 giờ",
  ceftriaxon: "Ceftriaxon 80–100 mg/kg/ngày, chia mỗi 12 giờ",
  vancomycin: "Vancomycin 20–60 mg/kg/ngày, chia mỗi 6 giờ",
};
const CEF3 = `${DOSE.ceftriaxon} (hoặc ${DOSE.cefotaxim.toLowerCase()})`;
const PED = ["v8-104"];
const ADULT = ["v8-36"];

const vmn = (
  id: string,
  ids: string[],
  scenario: string,
  role: "first" | "alternative",
  drugs: ReturnType<typeof d>[]
) => r(VMN, VMN_P, id, ids, scenario, role, drugs, { duration: VMN_DUR, notes: VMN_NOTES });

export const INFECTIOUS_5642: Regimen[] = [
  vmn("r-vmn42-neo-first", PED, "Viêm màng não 0–4 tuần tuổi (vi khuẩn đường ruột, S. agalactiae, Listeria)", "first",
    [d("Cefotaxim", DOSE.cefotaxim), d("+ ampicilin", DOSE.ampicilin)]),
  vmn("r-vmn42-neo-alt", PED, "Viêm màng não 0–4 tuần tuổi (vi khuẩn đường ruột, S. agalactiae, Listeria)", "alternative",
    [d("Ampicilin", DOSE.ampicilin), d("+ aminoglycosid (gentamicin hoặc amikacin)", `${DOSE.gentamicin}; ${DOSE.amikacin}`)]),
  vmn("r-vmn42-1to3m-first", PED, "Viêm màng não 1–3 tháng tuổi (HI, phế cầu, não mô cầu, S. agalactiae, E. coli, Listeria)", "first",
    [d("Ampicilin (khi nghi Listeria)", DOSE.ampicilin), d("+ ceftriaxon (hoặc cefotaxim)", CEF3)]),
  vmn("r-vmn42-1to3m-alt", PED, "Viêm màng não 1–3 tháng tuổi (HI, phế cầu, não mô cầu, S. agalactiae, E. coli, Listeria)", "alternative",
    [d("Vancomycin", DOSE.vancomycin), d("+ ceftriaxon (hoặc cefotaxim)", CEF3)]),
  vmn("r-vmn42-3m18y-first", PED, "Viêm màng não 3 tháng – 18 tuổi (HI, phế cầu, não mô cầu)", "first",
    [d("Ceftriaxon (hoặc cefotaxim)", CEF3)]),
  vmn("r-vmn42-3m18y-alt", PED, "Viêm màng não 3 tháng – 18 tuổi (HI, phế cầu, não mô cầu)", "alternative",
    [d("Vancomycin", DOSE.vancomycin), d("+ ceftriaxon (hoặc cefotaxim)", CEF3)]),
  vmn("r-vmn42-18to50-first", ADULT, "Viêm màng não 18–50 tuổi (phế cầu, liên cầu, não mô cầu)", "first",
    [d("Ceftriaxon (hoặc cefotaxim)", CEF3)]),
  vmn("r-vmn42-18to50-alt", ADULT, "Viêm màng não 18–50 tuổi (phế cầu, liên cầu, não mô cầu)", "alternative",
    [d("Vancomycin", DOSE.vancomycin), d("+ ceftriaxon (hoặc cefotaxim)", CEF3)]),
  vmn("r-vmn42-over50-first", ADULT, "Viêm màng não trên 50 tuổi (phế cầu, não mô cầu, Listeria, kị khí Gram âm)", "first",
    [d("Ceftriaxon (hoặc cefotaxim)", CEF3)]),
  vmn("r-vmn42-over50-alt", ADULT, "Viêm màng não trên 50 tuổi (phế cầu, não mô cầu, Listeria, kị khí Gram âm)", "alternative",
    [d("Ampicilin (khi nghi Listeria)", DOSE.ampicilin), d("+ ceftriaxon (hoặc cefotaxim)", CEF3)]),
  vmn("r-vmn42-immuno-first", ADULT, "Viêm màng não ở người suy giảm miễn dịch (phế cầu, não mô cầu, Listeria, kị khí Gram âm)", "first",
    [d("Ampicilin", DOSE.ampicilin), d("+ ceftazidim", DOSE.ceftazidim)]),
  vmn("r-vmn42-immuno-alt", ADULT, "Viêm màng não ở người suy giảm miễn dịch (phế cầu, não mô cầu, Listeria, kị khí Gram âm)", "alternative",
    [d("Vancomycin", DOSE.vancomycin), d("+ ampicilin (khi nghi Listeria)", DOSE.ampicilin), d("+ ceftazidim", DOSE.ceftazidim)]),
  vmn("r-vmn42-trauma-first", ADULT, "Viêm màng não sau chấn thương, phẫu thuật, dò dịch não tủy (phế cầu, tụ cầu, kị khí Gram âm)", "first",
    [d("Ceftazidim", DOSE.ceftazidim), d("+ vancomycin", DOSE.vancomycin)]),
  r(VMN, VMN_P, "r-vmn42-trauma-alt", ADULT, "Viêm màng não sau chấn thương, phẫu thuật, dò dịch não tủy (phế cầu, tụ cầu, kị khí Gram âm)", "alternative",
    [d("Cột thay thế ghi \"Ceftazidim + vancomycin\" và \"meropenem\"", "CHƯA XÁC MINH cách phối hợp – bảng trong bản PDF trích xuất không tách rõ ô; đối chiếu bản in")],
    { duration: VMN_DUR, notes: VMN_NOTES }),

  /* ---------- Thuong han ---------- */
  r("Bệnh thương hàn, mục 4.2 – điều trị đặc hiệu", "tr. 41", "r-typhoid42-fq", ["v8-135"],
    "Thương hàn – điều trị đặc hiệu", "first",
    [d("Fluoroquinolon (ciprofloxacin hoặc ofloxacin)", "15 mg/kg/ngày, có thể lên tới 20 mg/kg/ngày")],
    { duration: "5–7 ngày, hoặc 10–14 ngày khi có biến chứng", notes: ["Vi khuẩn thương hàn đã kháng ampicillin, amoxicillin, chloramphenicol, co-trimoxazol (tr. 41). Kháng sinh còn hiệu lực: fluoroquinolon (ciprofloxacin, ofloxacin, pefloxacin) hoặc cephalosporin thế hệ III (cefotaxim, ceftriaxon)."] }),
  r("Bệnh thương hàn, mục 4.2 – điều trị đặc hiệu", "tr. 41", "r-typhoid42-c3", ["v8-135"],
    "Thương hàn – điều trị đặc hiệu", "first",
    [d("Cephalosporin thế hệ III (cefotaxim, ceftriaxon)", "2–3 g/ngày")],
    { duration: "5–7 ngày, hoặc 10–14 ngày khi có biến chứng" }),
  r("Bệnh thương hàn, mục 4.2 – điều trị đặc hiệu", "tr. 41", "r-typhoid42-azi", ["v8-135"],
    "Thương hàn – điều trị đặc hiệu", "alternative",
    [d("Azithromycin", "1 g/ngày")],
    { duration: "5–7 ngày, hoặc 10–14 ngày khi có biến chứng", notes: ["Văn bản: \"Có thể sử dụng azithromycin\"."] }),
  r("Bệnh thương hàn, mục 4.4 – người mang vi khuẩn", "tr. 41", "r-typhoid42-carrier", ["v8-135"],
    "Thương hàn – người mang vi khuẩn mạn tính", "pathogen",
    [d("Một trong", "ampicillin hoặc amoxicillin 100 mg/kg/ngày kết hợp probenecid 30 mg/kg/ngày trong 3 tháng; hoặc co-trimoxazol 1 viên 480 mg x 2 lần/ngày trong 3 tháng; hoặc ciprofloxacin 750 mg x 2 lần/ngày trong 4 tuần")],
    { notes: ["Trường hợp tái phát: điều trị lại theo phác đồ trên (tr. 41)."] }),

  /* ---------- Ly truc khuan ---------- */
  r("Bệnh lỵ trực khuẩn, mục 4.2b – kháng sinh", "tr. 46", "r-shigella42-fq", ["v8-26"],
    "Lỵ trực khuẩn (Shigella)", "first",
    [d("Một trong", "ciprofloxacin 500 mg x 2 lần/ngày; pefloxacin 400 mg x 2 lần/ngày; ofloxacin 200 mg x 2 lần/ngày; levofloxacin 500 mg x 1 lần/ngày")],
    { duration: "5 ngày", notes: ["Lựa chọn dựa vào tính nhạy cảm và đề kháng của Shigella (tr. 46)."] }),
  r("Bệnh lỵ trực khuẩn, mục 4.2b – kháng sinh", "tr. 46", "r-shigella42-alt", ["v8-26"],
    "Lỵ trực khuẩn (Shigella)", "alternative",
    [d("Nơi vi khuẩn còn nhạy ampicillin và Biseptol – một trong", "ampicillin 50–100 mg/kg/ngày chia 4 lần (trẻ em thường 100 mg/kg/ngày chia 4 lần); trimethoprim + sulfamethoxazol (viên TMP 80 mg + SMX 400 mg) ngày 2 lần, mỗi lần 2 viên (người lớn) hoặc TMP 8 mg/kg/ngày chia 2 lần (trẻ em)")]),
];
