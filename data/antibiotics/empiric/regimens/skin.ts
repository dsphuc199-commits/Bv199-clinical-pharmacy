/*
  FILE: data/antibiotics/empiric/regimens/skin.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015), Chuong 4 Nhiem khuan da va mo mem.
  - Viem mo bao: tr. 139-140 (v8-27, v8-107)
  - Nhot: tr. 133-134 (v8-28)
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");
const r4416 = maker("byt4416");
const CELL = "Viêm mô bào, mục 4a";
const CELL_NOTE =
  "Chỉ định kháng sinh sớm, đúng và đủ liều: tiêm bắp hoặc TM với trường hợp nặng, nhất là nghi nhiễm khuẩn huyết, viêm khớp, viêm cân cơ; đường uống cho trường hợp nhẹ. Tái phát: penicilin 500 mg–2 g/ngày dài ngày để phòng tái phát.";

export const SKIN: Regimen[] = [
  r(CELL, "tr. 139", "r-cell-pen", ["v8-27", "v8-107"], "Viêm mô bào", "first",
    [d("Penicilin G (viên 1 triệu đơn vị)", "trẻ em 100 000 UI/kg/ngày; người lớn 3–4 triệu đơn vị/ngày; trường hợp nặng tiêm TM mỗi 6 giờ")],
    { duration: "Ít nhất 10 ngày", notes: [CELL_NOTE] }),
  r(CELL, "tr. 139", "r-cell-amoxclav", ["v8-27", "v8-107"], "Viêm mô bào", "first",
    [d("Amoxicilin-clavulanat", "trẻ em 80 mg/kg/ngày chia ba lần; người lớn 1,5–2 g amoxicilin mỗi ngày chia ba lần")],
    { duration: "Ít nhất 10 ngày", notes: [CELL_NOTE] }),
  r(CELL, "tr. 139", "r-cell-ctx", ["v8-27", "v8-107"], "Viêm mô bào", "first",
    [d("Ceftriaxon", "người lớn và trẻ > 12 tuổi 1–2 g x 1 lần/ngày (nặng có thể tăng đến 4 g/lần/ngày); trẻ < 12 tuổi 20–80 mg/kg x 1 lần/ngày; tiêm TM chậm hoặc truyền TM")],
    { duration: "Ít nhất 10 ngày", notes: [CELL_NOTE] }),
  r(CELL, "tr. 139–140", "r-cell-roxi", ["v8-27", "v8-107"], "Viêm mô bào", "alternative",
    [d("Roxithromycin viên 150 mg", "trẻ em 5–8 mg/kg/ngày chia 2 lần; người lớn 2 viên/ngày chia 2 lần")],
    { duration: "Ít nhất 10 ngày", notes: [CELL_NOTE] }),

  // Nhot (nhot / nhot cum) - nhiem khuan co mu
  r("Nhọt, mục 4", "tr. 133", "r-furuncle-clox", ["v8-28"], "Nhọt (kết hợp điều trị tại chỗ và kháng sinh toàn thân)", "first",
    [d("Penicilin M (cloxacilin)", "2 g/ngày")],
    { duration: "7–10 ngày", notes: ["Giai đoạn có mủ: rạch rộng làm sạch tổn thương. Sát khuẩn tại chỗ ngày 2–4 lần trong 10–15 ngày (povidon-iodin 10%, hexamidin 0,1% hoặc chlorhexidin 4%); kháng sinh bôi tại chỗ 7–10 ngày."] }),
  r("Nhọt, mục 4", "tr. 133", "r-furuncle-amoxclav", ["v8-28"], "Nhọt", "first",
    [d("Amoxicilin-clavulanat", "trẻ em 80 mg/kg/ngày chia 3 lần; người lớn 1,5–2 g/ngày chia 2 lần")],
    { duration: "7–10 ngày" }),
  r("Nhọt, mục 4", "tr. 133", "r-furuncle-roxi", ["v8-28"], "Nhọt", "alternative",
    [d("Roxithromycin viên 150 mg", "trẻ em 5–8 mg/kg/ngày chia 2 lần; người lớn 2 viên/ngày chia 2 lần")],
    { duration: "7–10 ngày" }),
  r("Nhọt, mục 4", "tr. 134", "r-furuncle-azi", ["v8-28"], "Nhọt", "alternative",
    [d("Azithromycin", "500 mg ngày đầu tiên, sau đó 250 mg/ngày x 4 ngày")],
    { duration: "7–10 ngày" }),
  r("Nhọt, mục 4", "tr. 134", "r-furuncle-pristi", ["v8-28"], "Nhọt", "alternative",
    [d("Pristinamycin", "trẻ em 50 mg/kg/ngày chia 2 lần; người lớn 2–3 g/ngày chia 2 lần")],
    { duration: "7–10 ngày" }),
  r("Nhọt, mục 4", "tr. 134", "r-furuncle-fusidic", ["v8-28"], "Nhọt", "alternative",
    [d("Acid fucidic viên 250 mg", "trẻ em 30–50 mg/kg/ngày chia 2 lần; người lớn 1–1,5 g/ngày chia 2 lần")],
    { duration: "7–10 ngày" }),
  // ===== Nhot, ap xe da - BYT QD 4416/QD-BYT (tai lieu da lieu), muc 3.2.2, tr. 15 =====
  r4416("Nhọt, áp xe da, mục 3.2.2", "tr. 15", "r-abscess-4416-clox", ["v8-28"],
    "Nhọt, áp xe da (kèm trích rạch dẫn lưu ổ áp xe và điều trị tại chỗ)", "first",
    [d("Cloxacilin", "người lớn: uống hoặc tiêm bắp hoặc TM cứ 6 giờ dùng 250–500 mg; trẻ em < 20 kg: uống hoặc tiêm bắp hoặc TM cứ 6 giờ dùng 12,5–25 mg/kg, > 20 kg: liều như người lớn")],
    { duration: "7–10 ngày", notes: ["Lựa chọn một trong các kháng sinh của bảng. Ổ áp xe cần trích rạch dẫn lưu và dùng kháng sinh toàn thân (mục 3.1).", "Tại chỗ: dung dịch sát khuẩn (povidon-iod 10%, hexamidin 0,1%, chlorhexidin 4%…) và kháng sinh tại chỗ (acid fusidic 2%, mupirocin 2%, neomycin, silver sulfadiazin 1%)."] }),
  r4416("Nhọt, áp xe da, mục 3.2.2", "tr. 15", "r-abscess-4416-amoxclav", ["v8-28"],
    "Nhọt, áp xe da", "first",
    [d("Amoxicilin-clavulanat", "người lớn: uống 875/125 mg x 2 lần/ngày; trẻ em: uống 25 mg/kg/ngày chia hai lần")],
    { duration: "7–10 ngày" }),
  r4416("Nhọt, áp xe da, mục 3.2.2", "tr. 15", "r-abscess-4416-roxi", ["v8-28"],
    "Nhọt, áp xe da", "alternative",
    [d("Roxithromycin", "người lớn: uống 150 mg/lần, số lần/ngày không được ghi trong văn bản ('150mg/lần x lần/ngày'); trẻ em: uống 5–8 mg/kg/ngày chia 2 lần")],
    { duration: "7–10 ngày", notes: ["Văn bản người lớn ghi thiếu số lần dùng trong ngày: cần thẩm định trước khi dùng."] }),
  r4416("Nhọt, áp xe da, mục 3.2.2", "tr. 15", "r-abscess-4416-azi", ["v8-28"],
    "Nhọt, áp xe da", "alternative",
    [d("Azithromycin", "người lớn: uống 500 mg ngày đầu, sau đó 250 mg/ngày trong 4 ngày tiếp; trẻ em: uống 10 mg/kg/ngày x 3 ngày")],
    { duration: "Theo liệu trình ghi trong liều (người lớn 5 ngày; trẻ em 3 ngày)" }),
  r4416("Nhọt, áp xe da, mục 3.2.2", "tr. 15", "r-abscess-4416-clinda", ["v8-28"],
    "Nhọt, áp xe da", "alternative",
    [d("Clindamycin", "người lớn: tiêm TM 600 mg x 3 lần/ngày hoặc uống 300–450 mg x 4 lần/ngày; trẻ em: uống hoặc truyền TM 10–20 mg/kg/ngày chia ba lần")],
    { duration: "7–10 ngày" }),
  r4416("Nhọt, áp xe da, mục 3.2.2", "tr. 15", "r-abscess-4416-mrsa-vanco", ["v8-28"],
    "Nhọt, áp xe da do tụ cầu vàng kháng methicilin", "pathogen",
    [d("Vancomycin", "người lớn: truyền TM chậm 30 mg/kg/ngày chia 4 lần (không dùng quá 2 g/ngày); trẻ em: tiêm TM chậm 40 mg/ngày chia 4 lần (cứ 6 giờ/lần) hoặc truyền TM 10 mg/kg")],
    { duration: "7–10 ngày", notes: ["Văn bản trẻ em ghi '40mg/ngày' (không có /kg): ghi nguyên văn, cần thẩm định."] }),
  r4416("Nhọt, áp xe da, mục 3.2.2", "tr. 15", "r-abscess-4416-mrsa-tmp", ["v8-28"],
    "Nhọt, áp xe da do tụ cầu vàng kháng methicilin", "pathogen",
    [d("Trimethoprim/sulfamethoxazol", "người lớn: uống 160/800 mg x 2 lần/ngày; trẻ em: uống 8 (TMP)/40 (SMX) mg/kg chia 2 lần/ngày")],
    { duration: "7–10 ngày" }),
  r4416("Nhọt, áp xe da, mục 3.2.2", "tr. 15", "r-abscess-4416-mrsa-linezolid", ["v8-28"],
    "Nhọt, áp xe da do tụ cầu vàng kháng methicilin", "pathogen",
    [d("Linezolid", "người lớn: uống hoặc truyền TM 600 mg x 2 lần/ngày; trẻ em < 12 tuổi: uống hoặc truyền TM 10 mg/kg (tối đa 600 mg) x 3 lần/ngày, > 12 tuổi: liều như người lớn")],
    { duration: "7–10 ngày" }),
];
