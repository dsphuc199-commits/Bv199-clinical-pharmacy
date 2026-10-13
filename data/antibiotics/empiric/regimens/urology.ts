/*
  FILE: data/antibiotics/empiric/regimens/urology.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015), Chuong 10 Nhiem khuan tiet nieu:
  - Viem than be than cap: tr. 234-238 (v8-17)
  - Soi than tiet nieu nhiem trung: tr. 240-244 (v8-2, phan co bien chung)
  - Viem bang quang cap: tr. 248-251 (v8-16)
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");

const PY_ORAL = "Viêm thận bể thận cấp, mục 4.2a";
const PY_IV = "Viêm thận bể thận cấp, mục 4.2b";
const CY = "Viêm bàng quang cấp, mục 3.2";
const STONE = "Sỏi thận tiết niệu nhiễm trùng, mục 3";

const PY_NOTE =
  "Cấy nước tiểu, cấy máu (nếu sốt cao) trước khi dùng kháng sinh; sau 3–5 ngày không đỡ cần điều chỉnh theo kháng sinh đồ. Văn bản ghi cả '10–14 ngày' và 'kháng sinh duy trì 3 tuần kể cả khi cải thiện nhanh'; cấy nước tiểu kiểm tra sau ngừng thuốc.";

export const UROLOGY: Regimen[] = [
  // ===== Viêm thận bể thận cấp (v8-17) =====
  r(PY_ORAL, "tr. 236", "r-py-oral-bl", ["v8-17"],
    "Viêm thận bể thận cấp không biến chứng, triệu chứng không nặng – đường uống", "first",
    [d("Một trong", "amoxicilin 500 mg x 3 lần/ngày (tối đa 6 g/ngày); amoxicilin-clavulanat 500/62,5 mg x 3 viên/ngày chia 3 lần; cefuroxim 250 mg x 2 viên/ngày chia 2 lần cách nhau 12 giờ; trimethoprim-sulfamethoxazol 80/400 mg x 4 viên chia 2 lần cách nhau 12 giờ")],
    { duration: "7–14 ngày", notes: [PY_NOTE] }),
  r(PY_ORAL, "tr. 236", "r-py-oral-fq", ["v8-17"],
    "Viêm thận bể thận cấp không biến chứng – fluoroquinolon uống", "alternative",
    [d("Một trong", "ciprofloxacin 250–500 mg x 2 viên chia 2 lần; norfloxacin 400 mg x 2 viên chia 2 lần; ofloxacin 200 mg x 2 viên chia 2 lần")],
    { duration: "7–14 ngày", notes: ["Không dùng cho phụ nữ có thai và đang cho con bú, trẻ em < 15 tuổi; giảm liều ở suy thận; thận trọng ở suy gan."] }),
  r(PY_IV, "tr. 236", "r-py-iv-bl", ["v8-17"],
    "Viêm thận bể thận cấp – kháng sinh tiêm (nội trú)", "first",
    [d("Một trong", "amoxicilin hoặc ampicilin 1 g x 4 lọ/ngày chia 4 lần TM; amoxicilin-clavulanat 875/125 mg x 2 lần/ngày TM; ampicilin-sulbactam 1500 mg x 4 lần/ngày TM")],
    { duration: "10–14 ngày", notes: [PY_NOTE] }),
  r(PY_IV, "tr. 236", "r-py-iv-ceph", ["v8-17"],
    "Viêm thận bể thận cấp – cephalosporin thế hệ 2, 3 tiêm", "first",
    [d("Một trong", "cefuroxim 750 mg x 3 lần/ngày TM; cefotaxim 1 g x 3 lần/ngày TM; ceftriaxon 1–2 g/ngày TM; cefoperazon 1–2 g x 2 lần/ngày TM")],
    { duration: "10–14 ngày" }),
  r(PY_IV, "tr. 236", "r-py-iv-carba", ["v8-17"],
    "Viêm thận bể thận cấp – carbapenem", "alternative",
    [d("Một trong", "imipenem-cilastatin 250–500 mg x 4–3 lần/ngày; meropenem 500 mg x 3 lần/ngày; ertapenem 1000 mg x 1 lần/ngày")]),
  r(PY_IV, "tr. 237", "r-py-iv-fq", ["v8-17"],
    "Viêm thận bể thận cấp – fluoroquinolon truyền", "alternative",
    [d("Một trong", "ciprofloxacin 200–400 mg x 2 lần/ngày; levofloxacin 250–750 mg x 1 lần/ngày")],
    { notes: ["Có thể truyền 3 ngày rồi chuyển sang đường uống. Không dùng cho phụ nữ có thai, trẻ em < 15 tuổi."] }),
  r(PY_IV, "tr. 237", "r-py-aminoglyc", ["v8-17"],
    "Viêm thận bể thận cấp – kết hợp aminoglycosid", "adjunct",
    [d("Kết hợp với một thuốc trên – một trong", "gentamycin hoặc tobramicin 3–5 mg/kg/24 giờ; amikacin 15 mg/kg/24 giờ")],
    { notes: ["Thận trọng ở người già; giảm 1/2 liều khi mức lọc cầu thận < 30 ml/phút."] }),
  r(PY_IV, "tr. 237", "r-py-gramneg", ["v8-17"],
    "Cấy nước tiểu có trực khuẩn Gram âm", "pathogen",
    [d("Một trong", "cephalosporin thế hệ 3; fluoroquinolon")]),
  r(PY_IV, "tr. 237", "r-py-grampos", ["v8-17"],
    "Cấy nước tiểu có vi khuẩn Gram dương", "pathogen",
    [d("Amoxicilin hoặc ampicilin", "1 g x 6 lần/ngày tiêm TM; có thể kết hợp aminoglycosid trong khi chờ kết quả cấy máu, nước tiểu")]),
  r("Viêm thận bể thận cấp, mục 4.5", "tr. 238", "r-py-preg", ["v8-17"],
    "Viêm thận bể thận cấp ở người có thai (thường gặp 3 tháng cuối)", "first",
    [d("Một trong", "nhóm sulfamid; penicilin (amoxicilin)")],
    { notes: ["Văn bản chỉ nêu 'có thể dùng nhóm sulfamid, penicilin (amoxicilin)' và 'thận trọng khi dùng kháng sinh', không nêu liều. Fluoroquinolon chống chỉ định."] }),

  // ===== Viêm bàng quang không biến chứng (v8-16) =====
  r(CY, "tr. 249", "r-cy-tmp", ["v8-16"],
    "Viêm bàng quang cấp thông thường", "first",
    [d("Trimethoprim-sulfamethoxazol", "80/400 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ")],
    { duration: "3–5 ngày" }),
  r(CY, "tr. 249", "r-cy-cephalexin", ["v8-16"],
    "Viêm bàng quang cấp thông thường", "first",
    [d("Cephalexin", "500 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ")],
    { duration: "5 ngày" }),
  r(CY, "tr. 249", "r-cy-nitro", ["v8-16"],
    "Viêm bàng quang cấp thông thường", "first",
    [d("Nitrofurantoin", "100 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ")],
    { duration: "5 ngày" }),
  r(CY, "tr. 249", "r-cy-amoxclav", ["v8-16"],
    "Viêm bàng quang cấp thông thường", "first",
    [d("Amoxicilin-clavulanat", "500/125 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ")],
    { duration: "5 ngày" }),
  r(CY, "tr. 249", "r-cy-fq", ["v8-16"],
    "Viêm bàng quang cấp thông thường – chỉ khi các kháng sinh khác thất bại", "alternative",
    [d("Norfloxacin", "400 mg, uống 1 viên/lần cách nhau 12 giờ")],
    { duration: "3–5 ngày", notes: ["Fluoroquinolon không phải lựa chọn đầu tay."] }),
  r(CY, "tr. 249", "r-cy-preg-cephalexin", ["v8-16", "v8-97"],
    "Viêm bàng quang cấp ở phụ nữ có thai", "first",
    [d("Cephalexin", "500 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ")],
    { duration: "5–7 ngày", notes: ["Nếu cấy có vi khuẩn niệu dương tính, chọn theo kháng sinh đồ; chú ý thuốc chống chỉ định ở phụ nữ có thai."] }),
  r(CY, "tr. 249", "r-cy-preg-nitro", ["v8-16", "v8-97"],
    "Viêm bàng quang cấp ở phụ nữ có thai", "alternative",
    [d("Nitrofurantoin", "100 mg, uống 1 viên/lần, 2 lần/ngày")],
    { duration: "5–7 ngày" }),
  r(CY, "tr. 249", "r-cy-preg-amoxclav", ["v8-16", "v8-97"],
    "Viêm bàng quang cấp ở phụ nữ có thai", "alternative",
    [d("Amoxicilin-clavulanat", "500/125 mg, uống 1 viên/lần, 2 lần/ngày")],
    { duration: "5–7 ngày" }),
  r(CY, "tr. 250", "r-cy-male-tmp", ["v8-16"],
    "Viêm bàng quang cấp ở nam giới", "first",
    [d("Trimethoprim-sulfamethoxazol", "80/400 mg, uống 1 viên/lần, 2 lần/ngày")],
    { duration: "14 ngày", notes: ["Cần tìm nguyên nhân liên quan (viêm tuyến tiền liệt, viêm tinh hoàn, mào tinh hoàn) để chọn kháng sinh và thời gian; khi phát hiện sẽ có phác đồ riêng."] }),
  r(CY, "tr. 250", "r-cy-male-cephalexin", ["v8-16"],
    "Viêm bàng quang cấp ở nam giới", "alternative",
    [d("Cephalexin", "500 mg, uống 1 viên/lần, 2 lần/ngày")],
    { duration: "14 ngày" }),
  r(CY, "tr. 250", "r-cy-male-amoxclav", ["v8-16"],
    "Viêm bàng quang cấp ở nam giới", "alternative",
    [d("Amoxicilin-clavulanat", "500/125 mg, uống 1 viên/lần, 2 lần/ngày")],
    { duration: "14 ngày" }),

  // ===== Nhiễm khuẩn tiết niệu phức tạp (v8-2): sỏi tiết niệu nhiễm trùng, có biến chứng =====
  r(STONE, "tr. 242–243", "r-stone-complic-bl", ["v8-2"],
    "Sỏi thận tiết niệu có biến chứng nhiễm khuẩn", "first",
    [d("Một trong", "amoxicilin hoặc ampicilin 1 g x 4 lọ/ngày chia 4 lần TM; cefuroxim 250 mg x 2 lần/ngày uống hoặc cefuroxim tiêm TM; cefotaxim 1 g x 3 lần/ngày TM; ceftriaxon 1 g/ngày TM")],
    { duration: "10–14 ngày",
      notes: ["Văn bản mô tả cho sỏi thận–tiết niệu có biến chứng nhiễm khuẩn, không riêng cho tác nhân ESBL: nhánh ESBL không có trong nguồn BYT này.", "Giải quyết tắc nghẽn do sỏi (tán sỏi, lấy sỏi, dẫn lưu) là điều trị nguyên nhân."] }),
  r(STONE, "tr. 243", "r-stone-complic-fq", ["v8-2"],
    "Sỏi thận tiết niệu có biến chứng nhiễm khuẩn – fluoroquinolon uống", "alternative",
    [d("Một trong", "ciprofloxacin 250–500 mg x 2 lần/ngày; norfloxacin 400 mg x 2 lần/ngày; ofloxacin 200 mg x 2 lần/ngày")],
    { duration: "3–7 ngày, có thể tới 10 ngày",
      notes: ["Có thể truyền 3 ngày rồi chuyển đường uống. Không dùng cho phụ nữ có thai, trẻ em < 15 tuổi.", "Viêm thận bể thận cấp: xem phác đồ viêm thận bể thận cấp."] }),
];
