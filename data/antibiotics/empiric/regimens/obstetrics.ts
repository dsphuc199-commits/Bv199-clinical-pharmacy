/*
  FILE: data/antibiotics/empiric/regimens/obstetrics.ts
  Nguon:
  - BYT QD 708/QD-BYT (02/03/2015), Chuong 7: Nhiem trung nang do san khoa (tr. 180-182),
    Viem am dao - nieu dao do vi khuan (tr. 183-185)
  - BYT QD 315/QD-BYT (Huong dan chan doan va dieu tri cac benh san phu khoa):
    Sot trong khi co thai (tr. 73-74 in so), Viem am dao (tr. 132-133),
    Nhiem khuan so sinh (tr. 234-238)
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r708 = maker("byt708");
const r315 = maker("byt315");

const SEV = "Nhiễm trùng nặng do sản khoa, mục 3.2";
const BV708 = "Viêm âm đạo – niệu đạo do vi khuẩn, mục 2.2d";

export const OBSTETRICS: Regimen[] = [
  // ===== Nhiễm khuẩn hậu sản nặng (v8-92) =====
  r708(SEV, "tr. 181", "r-pp-triple", ["v8-92"],
    "Nhiễm khuẩn hậu sản nặng (viêm tử cung toàn bộ, viêm phúc mạc, nhiễm khuẩn huyết): phối hợp ba kháng sinh", "first",
    [
      d("Ceftriaxon", "1 g tĩnh mạch/24 giờ"),
      d("Azithromycin", "500 mg tĩnh mạch/24 giờ"),
      d("Metronidazol", "500 mg tĩnh mạch/12 giờ"),
    ],
    { notes: [
      "Nguyên tắc: cấy máu, sản dịch, nước tiểu trước khi dùng kháng sinh; kháng sinh phối hợp phổ rộng khi chưa có kháng sinh đồ; có kháng sinh đồ thì điều trị theo kháng sinh đồ; bù dịch, vận mạch nếu cần, thở oxy, giải quyết ổ nhiễm khuẩn.",
      "Văn bản không nêu thời gian điều trị.",
    ] }),
  r708(SEV, "tr. 181", "r-pp-allergy-clinda", ["v8-92"],
    "Nhiễm khuẩn hậu sản nặng – dị ứng penicilin (phương án 1)", "allergy",
    [
      d("Gentamycin", "TM 4–6 mg/kg cho liều đầu tiên; liều tiếp theo dựa vào độ thanh thải của thận"),
      d("Clindamycin", "600 mg tĩnh mạch/8 giờ"),
    ]),
  r708(SEV, "tr. 181", "r-pp-allergy-linco", ["v8-92"],
    "Nhiễm khuẩn hậu sản nặng – dị ứng penicilin (phương án 2)", "allergy",
    [
      d("Gentamycin", "TM 4–6 mg/kg cho liều đầu tiên; liều tiếp theo dựa vào độ thanh thải của thận"),
      d("Lincomycin", "600 mg tĩnh mạch mỗi 8 giờ"),
    ]),

  // ===== Viêm âm đạo do vi khuẩn (Bacterial vaginosis) (v8-95) =====
  r708(BV708, "tr. 184", "r-bv-metro-oral", ["v8-95"],
    "Viêm âm đạo do Bacterial vaginosis", "first",
    [d("Metronidazol", "400 mg uống/12 giờ")],
    { duration: "7 ngày" }),
  r708(BV708, "tr. 184", "r-bv-metro-gel", ["v8-95"],
    "Viêm âm đạo do Bacterial vaginosis", "alternative",
    [d("Gel metronidazol 0,75%", "bôi âm đạo trước lúc ngủ")],
    { duration: "5 ngày" }),
  r708(BV708, "tr. 184", "r-bv-clinda-gel", ["v8-95"],
    "Viêm âm đạo do Bacterial vaginosis", "alternative",
    [d("Gel clindamycin 2%", "bôi âm đạo trước lúc ngủ")],
    { duration: "7 ngày" }),
  r708(BV708, "tr. 184", "r-bv-preg-oral", ["v8-95"],
    "Viêm âm đạo do Bacterial vaginosis – phụ nữ có thai", "first",
    [d("Clindamycin", "300 mg uống/12 giờ")],
    { duration: "7 ngày" }),
  r708(BV708, "tr. 184", "r-bv-preg-gel", ["v8-95"],
    "Viêm âm đạo do Bacterial vaginosis – phụ nữ có thai", "alternative",
    [d("Gel clindamycin 2%", "bôi âm đạo trước lúc ngủ")],
    { duration: "7 ngày" }),
  r315(
    "Viêm âm đạo, mục 2.1 (viêm do vi khuẩn)", "tr. 132 (số trang in)", "r-bv-315", ["v8-95"],
    "Viêm âm đạo do vi khuẩn (Gardnerella, Mycoplasma hominis, kỵ khí) – hướng dẫn sản phụ khoa QĐ 315", "alternative",
    [d("Metronidazol", "1 g/ngày x 7 ngày, hoặc uống liều duy nhất 2 g")],
    { duration: "7 ngày (hoặc liều duy nhất)",
      notes: ["Hướng dẫn này ghi thêm: thụt âm đạo axit axetic 1%; đặt metronidazol mỗi tối 1 viên x 2 tuần; tái phát có thể dùng 2 đợt. Liều khác với QĐ 708 (400 mg/12 giờ): hai nguồn BYT, cần thẩm định chọn theo danh mục BV199."] }),

  // ===== Nhiễm khuẩn tiết niệu thai kỳ (v8-97) =====
  r315(
    "Sốt trong khi có thai, mục 2.1.2 (viêm bàng quang)", "tr. 73 (số trang in)", "r-preg-cystitis", ["v8-97"],
    "Viêm bàng quang trong thai kỳ", "first",
    [d("Amoxicilin", "500 mg uống, 4 viên/ngày")],
    { duration: "5–7 ngày; nếu tái phát có thể điều trị tiếp đến khi đẻ",
      notes: ["Văn bản ghi '500mg uống 4v/ngày' (4 viên/ngày); giữ nguyên cách ghi."] }),
  r315(
    "Sốt trong khi có thai, mục 2.1.2 (viêm thận – bể thận cấp)", "tr. 73 (số trang in)", "r-preg-pyelo", ["v8-97"],
    "Viêm thận – bể thận cấp trong thai kỳ", "first",
    [
      d("Ampicilin-sulbactam (Unasyn)", "1,5 g x 2 lọ, tiêm TM"),
      d("Metronidazol", "1 g truyền TM"),
    ],
    { duration: "Cho đến khi hết sốt 48 giờ, chuyển sang amoxicilin 1 g x 3 lần/ngày uống trong 12 ngày",
      notes: ["Chống choáng; điều trị kháng sinh theo kháng sinh đồ. Văn bản ghi 'Unasyn 1,5g x 2 lọ' không nêu khoảng cách liều: cần thẩm định."] }),

  // ===== Nhiễm khuẩn huyết sơ sinh (v8-103) =====
  r315(
    "Nhiễm khuẩn sơ sinh, mục 4.1.1", "tr. 237 (số trang in)", "r-neo-early", ["v8-103"],
    "Nhiễm trùng sơ sinh sớm, chưa có kháng sinh đồ: beta-lactam phối hợp aminosid", "first",
    [
      d("Penicilin hoặc ampicilin", "ampicilin 75–100 mg/kg/ngày"),
      d("Kết hợp aminosid", "gentamycin hoặc kanamycin 4–5 mg/kg/ngày; hoặc amikacin 15 mg/kg/ngày"),
    ],
    { duration: "Nhiễm trùng máu: 10 ngày; nếu nghi nhiễm khuẩn máu nhưng cấy máu âm tính: kết hợp kháng sinh kéo dài > 5 ngày; do tụ cầu vàng: 3–6 tuần",
      notes: ["Aminosid có thể gây điếc: không dùng quá 7 ngày ở trẻ sơ sinh; ngừng > 48 giờ có thể dùng đợt mới.", "Điều chỉnh khi có kháng sinh đồ."] }),
  r315(
    "Nhiễm khuẩn sơ sinh, mục 4.1.1", "tr. 237 (số trang in)", "r-neo-resist", ["v8-103"],
    "Sơ sinh nghi vi khuẩn kháng ampicilin (E. coli, Enterobacter) khi mẹ đã dùng kháng sinh trước đó", "alternative",
    [
      d("Một trong", "cefotaxim 100–200 mg/kg/ngày; ceftriaxon 50–100 mg/kg/ngày; imipenem (liều không nêu trong văn bản)"),
      d("Kết hợp aminosid", "gentamycin hoặc kanamycin 4–5 mg/kg/ngày; hoặc amikacin 15 mg/kg/ngày"),
    ],
    { notes: ["Văn bản không nêu liều imipenem cho sơ sinh: không tự bổ sung."] }),
  r315(
    "Nhiễm khuẩn sơ sinh, mục 4.1.1", "tr. 237 (số trang in)", "r-neo-late-staph", ["v8-103"],
    "Nhiễm trùng sơ sinh mắc phải (muộn) – nghi tụ cầu: phối hợp ba kháng sinh", "pathogen",
    [
      d("Cephalosporin thế hệ 3", "cefotaxim 100–200 mg/kg/ngày hoặc ceftriaxon 50–100 mg/kg/ngày"),
      d("Vancomycin", "10 mg/kg/ngày"),
      d("Aminosid", "gentamycin hoặc kanamycin 4–5 mg/kg/ngày; hoặc amikacin 15 mg/kg/ngày"),
    ]),
  r315(
    "Nhiễm khuẩn sơ sinh, mục 4.1.1", "tr. 237 (số trang in)", "r-neo-late-gramneg", ["v8-103"],
    "Nhiễm trùng sơ sinh mắc phải (muộn) – nghi trực khuẩn Gram âm", "pathogen",
    [
      d("Cephalosporin thế hệ 3", "cefotaxim 100–200 mg/kg/ngày hoặc ceftriaxon 50–100 mg/kg/ngày"),
      d("Kết hợp imipenem", "liều không nêu trong văn bản"),
    ],
    { notes: ["Văn bản: đôi khi quinolon phối hợp aminosid hoặc colistin (không nêu liều).", "Nghi vi khuẩn kỵ khí: phối hợp metronidazol (không nêu liều).", "Dùng cephalosporin thế hệ 3 rộng rãi, kéo dài là yếu tố nguy cơ nhiễm Candida; nếu dùng kháng sinh kéo dài mà lâm sàng xấu đi thì phối hợp kháng nấm nhóm azol."] }),
  r315(
    "Viêm âm đạo do nấm, mục 2.3", "tr. 133 (số trang in)", "r-vag-candida", ["v8-96"],
    "Viêm âm đạo do nấm (Candida albicans)", "first",
    [
      d("Nystatin đặt âm đạo", "100 mg (1 viên) mỗi tối"),
      d("HOẶC \"Meconazol\" (nguyên văn; nghi là miconazol) đặt âm đạo", "100 mg mỗi tối, 1 viên trong 3 tối"),
    ],
    { duration: "Meconazol/miconazol: 3 tối; nystatin: không nêu số ngày", notes: ["Tên thuốc \"Meconazol\" ghi nguyên văn từ QĐ 315, cần đối chiếu bản gốc.", "Văn bản còn nêu thụt âm đạo natri bicarbonat 1–2% và bơm glyceryl borat 30%.", "Là thuốc kháng nấm tại chỗ, không phải kháng sinh."] }),
];
