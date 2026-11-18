/* Phác đồ nhiễm khuẩn tiết niệu. sourceText lưu đoạn nguồn để đối chiếu nội bộ, không hiển thị. */
import type { Regimen } from "./types";

type Opt = Partial<Pick<Regimen, "dose" | "route" | "interval" | "duration" | "applicability" | "note">>;
const r = (id: string, conditionId: string, tier: Regimen["tier"], antibiotic: string, opt: Opt, sourceText: string): Regimen => ({
  id, conditionId, tier, antibiotic, dose: null, route: null, interval: null, duration: null, applicability: null, note: null, ...opt, sourceText,
});

const ORAL = "Uống";
const IV = "Tiêm tĩnh mạch";
const INJ = "Đường tiêm";
const Q12 = "Cách nhau 12 giờ";

const PO_HEAD = "Một trong những thuốc kháng sinh được lựa chọn đầu tiên đối với VTBT không biến chứng trong 7 - 14 ngày bằng đường uống nếu triệu chứng không nặng: ";
const FQ_HEAD = "Fluoroquinolon: nhóm này cần lưu ý không sử dụng cho phụ nữ có thai và đang cho con bú, không sử dụng cho trẻ em < 15 tuổi, cần giảm liều ở người bệnh suy thận. Thận trọng với người bệnh suy gan: ";
const FQ_NOTE = "Không sử dụng cho phụ nữ có thai và đang cho con bú, trẻ em < 15 tuổi; cần giảm liều ở người bệnh suy thận; thận trọng với người bệnh suy gan.";
const FQ_IV = "Đối với fluoroquinolon, có thể truyền 3 ngày, sau đó chuyển sang đường uống tiếp. Cần lưu ý: Thuốc có thể gây ra rối loạn tiêu hóa như nôn, buồn nôn và không được dùng cho phụ nữ có thai, trẻ em dưới 15 tuổi.";
const FQ_IV_NOTE = "Có thể truyền 3 ngày, sau đó chuyển sang đường uống tiếp. Có thể gây rối loạn tiêu hóa như nôn, buồn nôn; không được dùng cho phụ nữ có thai, trẻ em dưới 15 tuổi.";
const AG_SRC = "Kết hợp với một thuốc trong các thuốc trên với aminoglycosid tiêm tĩnh mạch (TM) hoặc tiêm bắp (TB): Gentamycin hoặc tobramicin 3 - 5 mg/kg/24h. amikacin 15 mg/kg/24 giờ. Thận trọng với người già, cần giảm 1/2 liều ở người suy thận có mức lọc cầu thận dưới 30ml/ph.";
const AG_NOTE = "Kết hợp với một trong các thuốc đường tiêm. Thận trọng với người già; giảm 1/2 liều ở người suy thận có mức lọc cầu thận dưới 30 ml/phút.";
const AG_ROUTE = "Tiêm tĩnh mạch hoặc tiêm bắp";
const CEPH_IV = "Hoặc cephalosporin (thế hệ 2, thế hệ 3): 10 - 14 ngày ";
const STONE_CEPH = "Hoặc cephalosporin (thế hệ 2, thế hệ 3): 10 - 14 ngày. Cefuroxim 250mg x 2 lần/ngày đường uống, hoặc cefuroxim đường tiêm TM.";
const STONE_FQ = "Fluoroquinolon đường uống: trong 3 - 7 ngày, có thể tới 10 ngày. ";
const STONE_FQ_DUR = "3–7 ngày, có thể tới 10 ngày";
const D10 = "10–14 ngày";
const D7 = "7–14 ngày";

/* Đoạn nguồn liền mạch từ câu nêu thời gian điều trị đến thuốc tương ứng. */
const PO_1 = `${PO_HEAD}Amoxicilin: 500 mg x 3 lần/ngày, tối đa 6g/ngày.`;
const PO_2 = `${PO_1} Amoxicilin-clavulanat: 500/62,5 mg x 3 viên/ ngày, chia 3 lần.`;
const PO_3 = `${PO_2} Cephalosporin (thế hệ 2, thế hệ 3): Cefuroxim 250mg x 2 viên/ ngày, chia 2 lần cách nhau 12 giờ.`;
const PO_4 = `${PO_3} Trimethoprim - sulfamethoxazol: 80/400 mg x 4 viên chia 2 lần cách nhau 12 giờ.`;
const PO_5 = `${PO_4} ${FQ_HEAD}Ciprofloxacin 250mg - 500 mg x 2 viên, chia 2 lần hoặc`;
const PO_6 = `${PO_5} Norfloxacin 400mg x 2 viên chia 2 lần hoặc`;
const PO_7 = `${PO_6} Ofloxacin 200mg x 2 viên chia 2 lần.`;
const STONE_CEPH_2 = `${STONE_CEPH} Hoặc cefotaxim 1g x 3 lần/ngày tiêm TM.`;
const STONE_CEPH_3 = `${STONE_CEPH_2} Hoặc ceftriaxon 1g /ngày tiêm TM.`;

const PYELO_IV: Regimen[] = [
  r("pyelo-iv-amox-amp", "pyelo-iv", null, "Amoxicilin hoặc ampicilin", { dose: "1 g x 4 lọ/ngày chia 4 lần", route: IV, duration: D10 }, "Amoxicilin hoặc ampicilin 1 g x 4 lọ/ ngày chia 4 lần tiêm tĩnh mạch x 10 - 14 ngày."),
  r("pyelo-iv-amox-clav", "pyelo-iv", null, "Amoxicilin-clavulanat", { route: IV }, "Hoặc amoxicilin - clavulanat 875/125 mg x 2 lần/ngày tiêm tĩnh mạch (TM)."),
  r("pyelo-iv-amp-sul", "pyelo-iv", null, "Ampicilin-sulbactam", { dose: "1500 mg x 4 lần/ngày", route: IV }, "Hoặc ampicilin-sulbactam 1500 mg x 4 lần/ ngày tiêm TM."),
  r("pyelo-iv-cefuroxim", "pyelo-iv", null, "Cefuroxim", { dose: "750 mg x 3 lần/ngày", route: IV, duration: D10 }, `${CEPH_IV}Cefuroxim 750 mg x 3 lần/ngày tiêm TM.`),
  r("pyelo-iv-cefotaxim", "pyelo-iv", null, "Cefotaxim", { dose: "1 g x 3 lần/ngày", route: IV, duration: D10 }, `${CEPH_IV}Cefuroxim 750 mg x 3 lần/ngày tiêm TM. Hoặc cefotaxim 1g x 3 lần/ ngày tiêm TM.`),
  r("pyelo-iv-ceftriaxon", "pyelo-iv", null, "Ceftriaxon", { dose: "1 g - 2 g/ngày", route: IV, duration: D10 }, `${CEPH_IV}Cefuroxim 750 mg x 3 lần/ngày tiêm TM. Hoặc cefotaxim 1g x 3 lần/ ngày tiêm TM. Hoặc ceftriaxon 1g - 2g / ngày tiêm TM.`),
  r("pyelo-iv-cefoperazon", "pyelo-iv", null, "Cefoperazon", { dose: "1 - 2 g x 2 lần/ngày", route: IV, duration: D10 }, `${CEPH_IV}Cefuroxim 750 mg x 3 lần/ngày tiêm TM. Hoặc cefotaxim 1g x 3 lần/ ngày tiêm TM. Hoặc ceftriaxon 1g - 2g / ngày tiêm TM. Hoặc cefoperazon 1 - 2g x 2 lần/ngày tiêm TM.`),
  r("pyelo-iv-imipenem", "pyelo-iv", null, "Imipenem-cilastatin", { dose: "250 - 500 mg x 4 - 3 lần/ngày", route: INJ }, "Imipenem-cilastatin 250 - 500 mg x 4 - 3 lần/ngày."),
  r("pyelo-iv-meropenem", "pyelo-iv", null, "Meropenem", { dose: "500 mg x 3 lần/ngày", route: INJ }, "Hoặc meropenem 500 mg x 3 lần/ngày."),
  r("pyelo-iv-ertapenem", "pyelo-iv", null, "Ertapenem", { dose: "1000 mg x 1 lần/ngày", route: INJ }, "Hoặc ertapenem 1000 mg x 1 lần/ngày."),
  r("pyelo-iv-cipro", "pyelo-iv", null, "Ciprofloxacin", { dose: "200 mg - 400 mg x 2 lần/ngày", route: INJ, note: FQ_IV_NOTE }, `Ciprofloxacin 200 mg - 400 mg x 2 lần/ngày. Hoặc levofloxacin 250 mg - 750 mg x 1 lần/ngày. ${FQ_IV}`),
  r("pyelo-iv-levo", "pyelo-iv", null, "Levofloxacin", { dose: "250 mg - 750 mg x 1 lần/ngày", route: INJ, note: FQ_IV_NOTE }, `Hoặc levofloxacin 250 mg - 750 mg x 1 lần/ngày. ${FQ_IV}`),
  r("pyelo-iv-genta-tobra", "pyelo-iv", "adjunct", "Gentamycin hoặc tobramicin", { dose: "3 - 5 mg/kg/24 giờ", route: AG_ROUTE, note: AG_NOTE }, AG_SRC),
  r("pyelo-iv-amikacin", "pyelo-iv", "adjunct", "Amikacin", { dose: "15 mg/kg/24 giờ", route: AG_ROUTE, note: AG_NOTE }, AG_SRC),
];

export const REGIMENS: Regimen[] = [
  r("pyelo-oral-amox", "pyelo-oral", "first-line", "Amoxicilin", { dose: "500 mg x 3 lần/ngày, tối đa 6 g/ngày", route: ORAL, duration: D7 }, PO_1),
  r("pyelo-oral-amox-clav", "pyelo-oral", "first-line", "Amoxicilin-clavulanat", { dose: "500/62,5 mg x 3 viên/ngày, chia 3 lần", route: ORAL, duration: D7 }, PO_2),
  r("pyelo-oral-cefuroxim", "pyelo-oral", "first-line", "Cefuroxim", { dose: "250 mg x 2 viên/ngày, chia 2 lần", route: ORAL, interval: Q12, duration: D7 }, PO_3),
  r("pyelo-oral-tmp-smx", "pyelo-oral", "first-line", "Trimethoprim - sulfamethoxazol", { dose: "80/400 mg x 4 viên chia 2 lần", route: ORAL, interval: Q12, duration: D7 }, PO_4),
  r("pyelo-oral-cipro", "pyelo-oral", "first-line", "Ciprofloxacin", { dose: "250 mg - 500 mg x 2 viên, chia 2 lần", route: ORAL, duration: D7, note: FQ_NOTE }, PO_5),
  r("pyelo-oral-norflox", "pyelo-oral", "first-line", "Norfloxacin", { dose: "400 mg x 2 viên chia 2 lần", route: ORAL, duration: D7, note: FQ_NOTE }, PO_6),
  r("pyelo-oral-oflox", "pyelo-oral", "first-line", "Ofloxacin", { dose: "200 mg x 2 viên chia 2 lần", route: ORAL, duration: D7, note: FQ_NOTE }, PO_7),

  ...PYELO_IV,

  r("pyelo-gn-ceph3", "pyelo-gram-neg", "culture-guided", "Cephalosporin thế hệ 3", {}, "Nếu cấy nước tiểu có trực khuẩn Gram-âm (-): Cephalosporin thế hệ 3 hoặc fluoroquinolon."),
  r("pyelo-gn-fq", "pyelo-gram-neg", "culture-guided", "Fluoroquinolon", {}, "Nếu cấy nước tiểu có trực khuẩn Gram-âm (-): Cephalosporin thế hệ 3 hoặc fluoroquinolon."),
  r("pyelo-gp-amox-amp", "pyelo-gram-pos", "culture-guided", "Amoxicilin hoặc ampicilin", { dose: "1 g x 6 lần/ngày", route: IV, note: "Có thể kết hợp với nhóm aminoglycosid để ngăn chặn nguy cơ nhiễm vi khuẩn đường ruột trong khi chờ đợi kết quả cấy máu, nước tiểu và có kháng sinh đồ." }, "Nếu cấy nước tiểu có vi khuẩn Gram-dương (+): Amoxicilin/ampcilin 1g x 6 lần/ngày tiêm TM. Có thể kết hợp với nhóm aminoglycosid để ngăn chặn nguy cơ nhiễm vi khuẩn đường ruột trong khi chờ đợi kết quả cấy máu, nước tiểu và có kháng sinh đồ."),
  r("pyelo-preg-amox", "pyelo-pregnancy", null, "Penicilin (amoxicilin)", {}, "Thận trọng khi sử dụng thuốc kháng sinh. Có thể dùng nhóm sulfamid, penicilin (amoxicilin)."),

  r("cys-common-tmp-smx", "cystitis-common", null, "Trimethoprim - sulfamethoxazol", { dose: "Viên 80/400 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, interval: Q12, duration: "3–5 ngày" }, "Trimethoprim - sulfamethoxazol: viên 80/400 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ trong 3 - 5 ngày."),
  r("cys-common-cephalexin", "cystitis-common", null, "Cephalexin", { dose: "Viên 500 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, interval: Q12, duration: "5 ngày" }, "Cephalexin: viên 500 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ trong 5 ngày."),
  r("cys-common-nitro", "cystitis-common", null, "Nitrofurantoin", { dose: "Viên 100 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, interval: Q12, duration: "5 ngày" }, "Nitrofurantoin: viên 100 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ trong 5 ngày."),
  r("cys-common-amox-clav", "cystitis-common", null, "Amoxicilin-clavulanat", { dose: "Viên 500/125 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, interval: Q12, duration: "5 ngày" }, "Amoxicilin-clavulanat: viên 500/125 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ trong 5 ngày."),
  r("cys-common-norflox", "cystitis-common", "alternative", "Norfloxacin", { dose: "400 mg, mỗi lần 1 viên", route: ORAL, interval: Q12, duration: "3–5 ngày", applicability: "Khi điều trị các kháng sinh khác đã thất bại" }, "Nhóm fluoroquinolon không phải là lựa chọn đầu tay trừ khi điều trị các kháng sinh khác đã thất bại. Thuốc thường được chọn là norfloxacin 400 mg, uống mỗi lần 1 viên cách nhau 12 giờ trong 3 - 5 ngày."),

  r("cys-preg-cephalexin", "cystitis-pregnancy", null, "Cephalexin", { dose: "Viên 500 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, interval: Q12, duration: "5–7 ngày" }, "Cephalexin: Viên 500 mg, uống 1 viên/lần, 2 lần/ngày cách nhau 12 giờ trong 5 - 7 ngày."),
  r("cys-preg-nitro", "cystitis-pregnancy", null, "Nitrofurantoin", { dose: "Viên 100 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, duration: "5–7 ngày" }, "Nitrofurantoin: Viên 100 mg, uống 1 viên/lần, 2 lần/ngày trong 5 - 7 ngày."),
  r("cys-preg-amox-clav", "cystitis-pregnancy", null, "Amoxicilin-clavulanat", { dose: "Viên 500/125 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, duration: "5–7 ngày" }, "Amoxicilin-clavulanat: Viên 500/125 mg, uống 1 viên/lần, 2 lần/ngày trong 5 - 7 ngày."),
  r("cys-preg-culture", "cystitis-pregnancy", "culture-guided", "Theo kháng sinh đồ", { applicability: "Cấy có vi khuẩn niệu (+)", note: "Vẫn cần chú ý thuốc chống chỉ định ở phụ nữ có thai." }, "Nếu cấy có vi khuẩn niệu (+), lựa chọn theo kháng sinh đồ, vẫn cần chú ý thuốc chống chỉ định ở phụ nữ có thai."),

  r("cys-male-tmp-smx", "cystitis-male", null, "Trimethoprim - sulfamethoxazol", { dose: "Viên 80/400 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, duration: "14 ngày" }, "Trimethoprim - sulfamethoxazol: Viên 80/400 mg, uống 1 viên/lần, 2 lần/ngày trong 14 ngày."),
  r("cys-male-cephalexin", "cystitis-male", null, "Cephalexin", { dose: "Viên 500 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, duration: "14 ngày" }, "Cephalexin: Viên 500 mg, uống 1 viên/lần, 2 lần/ngày trong 14 ngày."),
  r("cys-male-amox-clav", "cystitis-male", null, "Amoxicilin-clavulanat", { dose: "Viên 500/125 mg, 1 viên/lần, 2 lần/ngày", route: ORAL, duration: "14 ngày" }, "Amoxicilin-clavulanat: Viên 500/125mg, uống 1 viên/lần, 2 lần/ngày trong 14 ngày."),

  r("ure-chl-doxy", "urethritis-chlamydia", null, "Doxycyclin", { dose: "100 mg/lần, 2 lần/ngày", route: ORAL, interval: Q12, duration: "1 tuần" }, "Doxycyclin 100 mg/lần, uống 2 lần/ngày, khoảng cách giữa các lần đưa thuốc là 12 giờ, thời gian dùng thuốc 1 tuần."),
  r("ure-chl-oflox", "urethritis-chlamydia", null, "Ofloxacin", { dose: "300 mg/lần, 2 lần/ngày", route: ORAL, interval: Q12, duration: "1 tuần" }, "Ofloxacin 300 mg/lần, uống 2 lần/ngày, khoảng cách giữa các lần đưa thuốc là 12 giờ, thời gian dùng thuốc 1 tuần."),
  r("ure-chl-ery", "urethritis-chlamydia", null, "Erythromycin", { dose: "500 mg/lần, 4 lần/ngày", route: ORAL, interval: "Cách nhau 6 giờ", duration: "1 tuần" }, "Erythromycin 500 mg/lần, uống 4 lần/ngày, khoảng cách giữa các lần đưa thuốc là 6 giờ, thời gian dùng thuốc 1 tuần."),
  r("ure-tri-metro", "urethritis-trichomonas", "first-line", "Metronidazol", { dose: "500 mg/lần, 2 lần/ngày", route: ORAL, interval: Q12, duration: "7 ngày" }, "Thuốc lựa chọn là metronidazol: Metronidazol 500 mg/lần, uống 2 lần/ngày, khoảng cách giữa các lần đưa thuốc là 12 giờ, thời gian dùng thuốc 7 ngày."),
  r("ure-fun-flu", "urethritis-fungal", null, "Fluconazol", { note: "Viên 50 mg, 150 mg" }, "Fluconazol viên 50 mg, 150 mg."),
  r("ure-fun-itra", "urethritis-fungal", null, "Itraconazol", { note: "Viên 100 mg" }, "Itraconazol viên 100 mg"),
  r("ure-fun-keto", "urethritis-fungal", null, "Ketoconazol", { note: "Viên 200 mg" }, "Ketoconazol viên 200 mg"),
  r("ure-bac-culture", "urethritis-bacterial", "culture-guided", "Theo kháng sinh đồ", { applicability: "Tốt nhất là điều trị dựa vào kháng sinh đồ" }, "Tốt nhất là điều trị dựa vào kháng sinh đồ."),
  r("ure-bac-empiric", "urethritis-bacterial", null, "Một trong các thuốc nhóm fluoroquinolon, beta-lactam, trimethoprim-sulfamethoxazol", { duration: "3–5 ngày", applicability: "Không có kết quả cấy vi khuẩn" }, "Nếu không có kết quả cấy vi khuẩn: Lựa chọn một trong các thuốc trong nhóm kháng sinh fluoroquinolon, beta-lactam, trimethoprim-sulfamethoxazol với liệu trình ngắn từ 3 - 5 ngày."),

  r("stone-oral-tmp-smx", "stone-uti-oral", null, "Trimethoprim - sulfamethoxazol", { dose: "80/400 mg x 4 viên chia 2 lần", route: ORAL, interval: Q12, duration: "3 ngày" }, "Trimethoprim - sulfamethoxazol: 80/400 mg x 4 viên chia 2 lần cách nhau 12 giờ x 3 ngày, lưu ý phản ứng dị ứng chậm."),
  r("stone-oral-nitro", "stone-uti-oral", null, "Nitrofurantoin", { dose: "100 mg x 4 lần/ngày", route: ORAL, duration: "7 ngày" }, "Hoặc nitrofurantoin 100 mg x 4 lần/ ngày x 7 ngày"),
  r("stone-oral-amox", "stone-uti-oral", null, "Amoxicilin", { dose: "250-500 mg x 3 - 6 viên/ngày, chia 3 lần", route: ORAL }, "Hoặc amoxicilin: 250-500 mg x 3 - 6 viên/ ngày, chia 3 lần."),
  r("stone-oral-amox-clav", "stone-uti-oral", null, "Amoxicilin-clavulanat", { dose: "500 mg x 3 viên/ngày, chia 3 lần", route: ORAL, duration: "3 ngày" }, "Amoxicilin-clavulanat: 500 mg x 3 viên/ ngày, chia 3 lần x 3 ngày."),
  r("stone-iv-amox-clav", "stone-uti-oral", null, "Amoxicilin-clavulanat", { dose: "1 g x 2 lọ/ngày, chia 2 lần", route: IV, applicability: "Không uống được và tình trạng nặng" }, "Amoxicilin-clavulanat: 500 mg x 3 viên/ ngày, chia 3 lần x 3 ngày. Nếu không uống được và tình trạng nặng có thể chuyển đường tiêm tĩnh mạch (TM): 1 g x 2 lọ/ ngày, chia 2 lần."),
  r("stone-oral-cephalexin", "stone-uti-oral", null, "Cephalexin", { dose: "500 mg x 4 viên chia 4 lần/ngày", route: ORAL, duration: "10 ngày" }, "Hoặc cephalexin 500mg x 4 viên chia 4 lần/ ngày x 10 ngày"),

  r("stone-comp-amox-amp", "stone-complicated", null, "Amoxicilin hoặc ampicilin", { dose: "1 g x 4 lọ/ngày chia 4 lần", route: IV, duration: D10 }, "Amoxicilin hoặc ampicilin 1 g x 4 lọ/ ngày chia 4 lần tiêm tĩnh mạch x 10 - 14 ngày."),
  r("stone-comp-cefuroxim-po", "stone-complicated", null, "Cefuroxim", { dose: "250 mg x 2 lần/ngày", route: ORAL, duration: D10 }, STONE_CEPH),
  r("stone-comp-cefuroxim-iv", "stone-complicated", null, "Cefuroxim", { route: IV, duration: D10 }, STONE_CEPH),
  r("stone-comp-cefotaxim", "stone-complicated", null, "Cefotaxim", { dose: "1 g x 3 lần/ngày", route: IV, duration: D10 }, STONE_CEPH_2),
  r("stone-comp-ceftriaxon", "stone-complicated", null, "Ceftriaxon", { dose: "1 g/ngày", route: IV, duration: D10 }, STONE_CEPH_3),
  r("stone-comp-cipro", "stone-complicated", null, "Ciprofloxacin", { dose: "250 mg - 500 mg x 2 lần/ngày", route: ORAL, duration: STONE_FQ_DUR }, `${STONE_FQ}Ciprofloxacin 250mg - 500 mg x 2 lần/ngày.`),
  r("stone-comp-norflox", "stone-complicated", null, "Norfloxacin", { dose: "400 mg x 2 lần/ngày", route: ORAL, duration: STONE_FQ_DUR }, `${STONE_FQ}Ciprofloxacin 250mg - 500 mg x 2 lần/ngày. Hoặc norfloxacin 400 mg x 2 lần/ngày.`),
  r("stone-comp-oflox", "stone-complicated", null, "Ofloxacin", { dose: "200 mg x 2 lần/ngày", route: ORAL, duration: STONE_FQ_DUR }, `${STONE_FQ}Ciprofloxacin 250mg - 500 mg x 2 lần/ngày. Hoặc norfloxacin 400 mg x 2 lần/ngày. Hoặc ofloxacin 200mg x 2 lần/ngày.`),

  /* Sỏi có viêm thận bể thận cấp: nguồn chuyển sang điều trị viêm thận bể thận cấp; chỉ dùng phác đồ đường tiêm. */
  ...PYELO_IV.map((x) => ({ ...x, id: x.id.replace("pyelo-iv", "stone-pyelo"), conditionId: "stone-pyelo" })),
];
