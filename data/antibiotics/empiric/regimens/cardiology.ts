/*
  FILE: data/antibiotics/empiric/regimens/cardiology.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015), bai Viem noi tam mac nhiem khuan, tr. 129-130.
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");
const S = "Viêm nội tâm mạc nhiễm khuẩn, mục 4.2";

export const CARDIOLOGY: Regimen[] = [
  r(S + "a", "tr. 129", "r-ie-native-1", ["v8-39"],
    "Van tự nhiên, trong khi chờ cấy máu (người lớn)", "first",
    [
      d("Ampicilin-sulbactam", "12 g/24 giờ, chia 4 lần, tiêm TM x 4–6 tuần"),
      d("Gentamycin sulfat", "3 mg/kg/24 giờ chia 3 lần, tiêm TM/TB x 5–14 ngày"),
    ],
    { duration: "4–6 tuần (aminosid ngắn nhất có thể, không quá 14 ngày)", notes: ["Điều trị kháng sinh sớm sau khi cấy máu 3 lần; kháng sinh diệt khuẩn, liều cao, phối hợp hai kháng sinh, ưu tiên TM."] }),
  r(S + "a", "tr. 129", "r-ie-native-2", ["v8-39"],
    "Van tự nhiên, người dị ứng penicilin (vancomycin dùng cho người dị ứng penicilin)", "allergy",
    [
      d("Vancomycin", "30 mg/kg/24 giờ chia 2 lần, pha 200 ml NaCl 0,9% hoặc glucose 5%, truyền TM ít nhất 60 phút x 4–6 tuần"),
      d("Gentamycin sulfat", "3 mg/kg/24 giờ chia 3 lần, tiêm TM/TB x 5–14 ngày"),
      d("Ciprofloxacin", "1000 mg/24 giờ uống x 4–6 tuần hoặc 800 mg/24 giờ chia 2 lần truyền TM x 4–6 tuần"),
    ],
    { duration: "4–6 tuần" }),
  r(S + "a", "tr. 129", "r-ie-native-peds", ["v8-39"],
    "Van tự nhiên, trẻ em (không vượt quá liều người lớn bình thường)", "first",
    [
      d("Ampicilin-sulbactam", "300 mg/kg/24 giờ chia 4–6 lần, tiêm TM"),
      d("Gentamycin sulfat", "3 mg/kg/24 giờ chia 3 lần, tiêm TM/TB x 5–14 ngày"),
      d("Vancomycin", "40 mg/kg/24 giờ chia 2–3 lần, truyền TM"),
      d("Ciprofloxacin", "20–30 mg/24 giờ chia 2 lần, truyền TM hoặc uống"),
    ],
    { duration: "4–6 tuần", notes: ["Đơn vị ciprofloxacin ghi nguyên văn trong bản in là '20–30 mg/24 giờ' (không có /kg); cần đối chiếu bản gốc BYT trước khi dùng."] }),
  r(S + "b", "tr. 129", "r-ie-prosth-early", ["v8-39"],
    "Van nhân tạo, xảy ra < 1 năm sau phẫu thuật thay van (người lớn): phối hợp bốn kháng sinh", "severe",
    [
      d("Vancomycin", "30 mg/kg/24 giờ chia 2 lần truyền TM x 6 tuần"),
      d("Gentamycin sulfat", "3 mg/kg/24 giờ chia 3 lần tiêm TM/TB x 2 tuần"),
      d("Cefepim", "6 g/24 giờ chia 3 lần tiêm TM chậm x 6 tuần"),
      d("Rifampin", "900 mg/24 giờ chia 3 lần uống hoặc hòa glucose 5% truyền TM x 6 tuần"),
    ],
    { duration: "6 tuần (gentamycin 2 tuần)" }),
  r(S + "b", "tr. 129–130", "r-ie-prosth-early-peds", ["v8-39"],
    "Van nhân tạo < 1 năm sau phẫu thuật, trẻ em: phối hợp bốn kháng sinh", "severe",
    [
      d("Cefepim", "150 mg/kg/24 giờ chia 3 lần tiêm TM chậm (trẻ > 2 tháng)"),
      d("Rifampin", "20 mg/kg/24 giờ chia 3 lần uống hoặc truyền TM (hòa glucose 5%)"),
      d("Vancomycin", "liều và đường dùng như trên"),
      d("Gentamycin", "liều và đường dùng như trên"),
    ],
    { duration: "6 tuần" }),
  r(S + "c", "tr. 130", "r-ie-prosth-late", ["v8-39"],
    "Van nhân tạo xảy ra > 1 năm sau phẫu thuật thay van", "first",
    [d("Điều trị như viêm nội tâm mạc van tự nhiên", "xem các phác đồ van tự nhiên ở trên")],
    { duration: "6 tuần" }),
];
