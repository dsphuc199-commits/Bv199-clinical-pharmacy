/*
  FILE: data/antibiotics/empiric/regimens/sti-708.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015), doc tu ban PDF (qd708) 16/11/2026:
  - Chuong 7: Benh giang mai, muc 4.2.2 (tr. 192–194); Benh lau, muc 4.2 (tr. 197–198);
    Benh ha cam, muc 4 (tr. 200)
  - Chuong 10: Viem nieu dao cap khong do lau, muc 3 (tr. 245–246)
  Mat benh v9-2 "Benh lay truyen qua duong tinh duc" (nguoi lon). Lieu giu nguyen van.
  Khong dua: giang mai bam sinh, lau mat so sinh (doi tuong so sinh – tre em); viem nieu dao do nam,
  do vi khuan thong thuong (van ban khong neu lieu).
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");
const IDS = ["v9-2"];

const SY = "Bệnh giang mai, mục 4.2.2";
const GC = "Bệnh lậu, mục 4.2";
const HC = "Bệnh hạ cam, mục 4";
const NGU = "Viêm niệu đạo cấp không do lậu, mục 3";

const SY_ORDER = "Áp dụng 1 trong 3 phác đồ theo thứ tự ưu tiên.";
const SY_FU = "Điều trị có hiệu quả khi hiệu giá kháng thể sau điều trị giảm. Xét nghiệm lại RPR vào tháng thứ 3, 6 và 12 sau khi hoàn thành điều trị. Phần lớn người bệnh giang mai có HIV đáp ứng tốt với phác đồ chuẩn (tr. 193–194).";
const SY_RULE = "Penicilin là thuốc được lựa chọn; điều trị đồng thời cho cả bạn tình (mục 4.1, tr. 192).";
const PROC_15 = "Tổng liều 15.000.000 đơn vị. Mỗi ngày tiêm 1.000.000 đơn vị, chia 2 lần, sáng 500.000 đơn vị, chiều 500.000 đơn vị";
const PROC_30 = "Tổng liều 30.000.000 đơn vị. Mỗi ngày tiêm 1.000.000 đơn vị, chia 2 lần, sáng 500.000 đơn vị, chiều 500.000 đơn vị";
const BENZYL_30 = "Tổng liều 30.000.000 đơn vị. Ngày tiêm 1.000.000 đơn vị chia làm nhiều lần, cứ 2–3 giờ tiêm 1 lần, mỗi lần 100.000–150.000 đơn vị";
const SY1 = "Giang mai thời kỳ I";
const SY2 = "Giang mai II sơ phát, giang mai kín sớm";
const SY3 = "Giang mai II tái phát, phụ nữ có thai, giang mai III, giang mai kín muộn, giang mai bẩm sinh muộn ở người lớn";

const GC_RULE = "Điều trị sớm, đúng phác đồ, điều trị cả bạn tình và điều trị đồng thời Chlamydia. Không quan hệ tình dục, không làm việc nặng, tránh thức khuya, không uống rượu bia và chất kích thích, không làm thủ thuật tiết niệu trong thời gian điều trị (mục 4.1, tr. 197).";
const CT_ITEMS = "azithromycin 1 g liều duy nhất; doxycyclin 100 mg x 2 lần/ngày x 7 ngày; tetracyclin 500 mg x 4 lần/ngày x 7 ngày; erythromycin 500 mg x 4 lần/ngày x 7 ngày; clarithromycin 250 mg x 2 lần/ngày x 7 ngày";
const NO_DOXY = "Không dùng doxycyclin và tetracyclin cho phụ nữ có thai và cho con bú, trẻ dưới 7 tuổi.";

export const STI_708: Regimen[] = [
  // ===== Giang mai thời kỳ I (tr. 192) =====
  r(SY, "tr. 192", "r-syph1-bpg", IDS, SY1, "first",
    [d("Benzathin penicilin G", "2.400.000 đơn vị tiêm bắp sâu liều duy nhất, chia làm 2, mỗi bên mông 1.200.000 đơn vị")],
    { notes: [SY_ORDER, SY_RULE, SY_FU] }),
  r(SY, "tr. 192", "r-syph1-procain", IDS, SY1, "alternative",
    [d("Penicilin procain G", PROC_15)],
    { notes: [SY_ORDER] }),
  r(SY, "tr. 192", "r-syph1-benzyl", IDS, SY1, "alternative",
    [d("Benzyl penicilin G hòa tan trong nước", BENZYL_30)],
    { notes: [SY_ORDER] }),

  // ===== Giang mai II sơ phát, kín sớm (tr. 193) =====
  r(SY, "tr. 193", "r-syph2-bpg", IDS, SY2, "first",
    [d("Benzathin penicilin G", "Tổng liều 4.800.000 đơn vị tiêm bắp sâu, trong 2 tuần liên tiếp. Mỗi tuần tiêm 2.400.000 đơn vị, chia làm 2, mỗi bên mông 1.200.000 đơn vị")],
    { notes: [SY_ORDER, SY_RULE, SY_FU] }),
  r(SY, "tr. 193", "r-syph2-procain", IDS, SY2, "alternative",
    [d("Penicilin procain G", PROC_15)],
    { notes: [SY_ORDER] }),
  r(SY, "tr. 193", "r-syph2-benzyl", IDS, SY2, "alternative",
    [d("Benzyl penicilin G hòa tan trong nước", BENZYL_30)],
    { notes: [SY_ORDER] }),
  r(SY, "tr. 193", "r-syph2-allergy", IDS, SY2, "allergy",
    [d("Một trong", "tetracyclin 2 g/ngày x 15 ngày; erythromycin 2 g/ngày x 15 ngày")],
    { condition: "Dị ứng với penicilin" }),

  // ===== Giang mai II tái phát, có thai, III, kín muộn, bẩm sinh muộn người lớn (tr. 193) =====
  r(SY, "tr. 193", "r-syph3-bpg", IDS, SY3, "first",
    [d("Benzathin penicilin G", "Tổng liều 9.600.000 đơn vị, tiêm bắp sâu trong 4 tuần liên tiếp. Mỗi tuần tiêm 2.400.000 đơn vị, chia làm 2, mỗi bên mông 1.200.000 đơn vị")],
    { notes: [SY_ORDER, SY_RULE, SY_FU] }),
  r(SY, "tr. 193", "r-syph3-procain", IDS, SY3, "alternative",
    [d("Penicilin procain G", PROC_30)],
    { notes: [SY_ORDER] }),
  r(SY, "tr. 193", "r-syph3-benzyl", IDS, SY3, "alternative",
    [d("Benzyl penicilin G hòa tan trong nước", BENZYL_30)],
    { notes: [SY_ORDER] }),
  r(SY, "tr. 193", "r-syph3-allergy", IDS, SY3, "allergy",
    [d("Tetracyclin", "2–3 g/ngày trong 15–20 ngày")],
    { condition: "Dị ứng với penicilin" }),
  r(SY, "tr. 193", "r-syph3-allergy-preg", IDS, SY3, "allergy",
    [d("Erythromycin", "2–3 g/ngày trong 15–20 ngày")],
    { condition: "Phụ nữ có thai dị ứng với penicilin" }),

  // ===== Lậu (tr. 197–198) =====
  r(GC, "tr. 197", "r-gc-acute", IDS, "Lậu cấp tính", "first",
    [d("Một trong", "cefixim uống 400 mg liều duy nhất; ceftriaxon 250 mg tiêm liều duy nhất; spectinomycin 2 g tiêm bắp liều duy nhất")],
    { notes: [GC_RULE, "Điều trị bạn tình giống như điều trị cho người bệnh (tr. 198)."] }),
  r(GC, "tr. 197", "r-gc-acute-ct", IDS, "Lậu cấp tính", "adjunct",
    [d("Điều trị đồng thời Chlamydia – một trong", CT_ITEMS)],
    { notes: [NO_DOXY] }),
  r(GC, "tr. 198", "r-gc-chronic-gu", IDS, "Lậu mạn tính có biến chứng sinh dục tiết niệu", "first",
    [d("Ceftriaxon", "1 g/ngày")],
    { duration: "5–7 ngày", notes: ["Phối hợp với điều trị Chlamydia như phác đồ lậu cấp tính."] }),
  r(GC, "tr. 197–198", "r-gc-chronic-gu-ct", IDS, "Lậu mạn tính có biến chứng sinh dục tiết niệu", "adjunct",
    [d("Điều trị đồng thời Chlamydia – một trong", CT_ITEMS)],
    { notes: [NO_DOXY] }),
  r(GC, "tr. 198", "r-gc-dgi", IDS, "Lậu có biến chứng nhiễm lậu toàn thân, viêm màng não (điều trị nội trú)", "severe",
    [d("Ceftriaxon", "1–2 g/ngày, tiêm bắp hoặc tĩnh mạch")],
    { duration: "10–14 ngày", notes: ["Người bệnh nằm điều trị nội trú. Phối hợp với điều trị Chlamydia như phác đồ lậu cấp tính."] }),
  r(GC, "tr. 197–198", "r-gc-dgi-ct", IDS, "Lậu có biến chứng nhiễm lậu toàn thân, viêm màng não (điều trị nội trú)", "adjunct",
    [d("Điều trị đồng thời Chlamydia – một trong", CT_ITEMS)],
    { notes: [NO_DOXY] }),

  // ===== Hạ cam (tr. 200) =====
  r(HC, "tr. 200", "r-chancroid", IDS, "Bệnh hạ cam", "first",
    [d("Một trong", "ceftriaxon 250 mg tiêm bắp liều duy nhất; azithromycin 1 g liều duy nhất; spectinomycin 2 g tiêm bắp liều duy nhất; erythromycin 500 mg uống 4 lần/ngày trong 7 ngày")],
    { notes: [
      "Trực khuẩn hạ cam đã kháng một số thuốc: ampicilin, sulfamid, cloramphenicol, tetracyclin, kanamycin, streptomycin, ciprofloxacin, erythromycin và co-trimoxazol.",
      "Thường đỡ sau 2–3 ngày, khỏi sau khoảng 1 tuần; hạch bẹn khỏi chậm hơn, có thể phải chọc hút mủ qua da lành.",
      "Áp dụng cả cho người bệnh nhiễm HIV, nhưng thời gian điều trị thường lâu hơn và có thể thất bại với tất cả các thuốc. Xét nghiệm HIV và giang mai ngay; âm tính thì xét nghiệm lại sau 3 tháng.",
    ] }),

  // ===== Viêm niệu đạo cấp không do lậu (tr. 245–246) =====
  r(NGU, "tr. 246", "r-ngu-ct", IDS, "Viêm niệu đạo cấp không do lậu – nhiễm Chlamydia", "pathogen",
    [d("Một trong", "doxycyclin 100 mg/lần, uống 2 lần/ngày, cách 12 giờ; ofloxacin 300 mg/lần, uống 2 lần/ngày, cách 12 giờ; erythromycin 500 mg/lần, uống 4 lần/ngày, cách 6 giờ")],
    { duration: "1 tuần", notes: ["Điều trị cho cả người cùng quan hệ tình dục và người bệnh."] }),
  r(NGU, "tr. 246", "r-ngu-tv", IDS, "Viêm niệu đạo cấp không do lậu – nhiễm Trichomonas", "pathogen",
    [d("Metronidazol", "500 mg/lần, uống 2 lần/ngày, cách 12 giờ")],
    { duration: "7 ngày", notes: ["Điều trị cho cả người cùng quan hệ tình dục và người bệnh."] }),
];
