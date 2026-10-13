/*
  FILE: data/antibiotics/empiric/regimens/neuro.ts
  Nguon: BYT QD 708/QD-BYT (02/03/2015), Chuong 9 Viem mang nao mu, tr. 229-233,
  Bang II.19 (phac do kinh nghiem theo tuoi/co dia) va Bang II.20 (lieu khuyen cao
  cho nguoi benh chuc nang gan than binh thuong).
  Da doi chieu Bang II.19 voi anh trang PDF.
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt708");

const S19 = "Viêm màng não mủ, mục 4.2, Bảng II.19";
const DUR =
  "Não mô cầu 7 ngày; Hib 10 ngày; phế cầu 14 ngày; trực khuẩn và vi khuẩn kỵ khí Gram âm, liên cầu, tụ cầu 3 tuần; hoặc trung bình đủ 10–14 ngày và đã hết sốt 3 ngày (mục 4.4)";
const GEN: string[] = [
  "Dexamethason 0,6 mg/kg/ngày, tiêm 4 ngày, cùng hoặc trước kháng sinh 15 phút (mục 4.2).",
  "Khi có kết quả nhuộm Gram: cầu khuẩn Gram dương → ceftriaxon hoặc cefotaxim + vancomycin; cầu khuẩn Gram âm → penicilin G; trực khuẩn Gram dương → ampicilin + aminoglycosid; trực khuẩn Gram âm → ceftriaxon + aminoglycosid. Có kết quả cấy → theo kháng sinh đồ. Xét nghiệm lại dịch não tủy sau 48 giờ nếu không cải thiện (mục 4.3).",
  "Ampicilin chỉ chọn khi nghi ngờ Listeria (chú thích * của Bảng II.19).",
];
const ADULT_NOTE =
  "Liều người lớn theo Bảng II.20 (tổng liều/ngày, khoảng cách liều): ceftriaxon 4 g (12–24 giờ); cefotaxim 8–12 g (4–6 giờ); ceftazidim 6 g (8 giờ); ampicilin 12 g (4 giờ); vancomycin 30–45 mg/kg (8–12 giờ); meropenem 6 g (8 giờ); gentamycin 5 mg/kg (8 giờ); amikacin 15 mg/kg (8 giờ).";
const CHILD_NOTE =
  "Liều trẻ em theo Bảng II.20 (tổng liều/ngày, khoảng cách liều): ceftriaxon 80–100 mg/kg (12–24 giờ); cefotaxim 225–300 mg/kg (6–8 giờ); ceftazidim 150 mg/kg (8 giờ); ampicilin 300 mg/kg (6 giờ); vancomycin 60 mg/kg (6 giờ); gentamycin 7,5 mg/kg (8 giờ); amikacin 20–30 mg/kg (8 giờ); meropenem 30–120 mg/kg (8 giờ, không dùng cho trẻ < 3 tháng).";

export const NEURO: Regimen[] = [
  // ===== Người lớn (v8-36) =====
  r(S19, "tr. 231", "r-men-18-50-first", ["v8-36"],
    "Viêm màng não mủ 18–50 tuổi (phế cầu, liên cầu, não mô cầu)", "first",
    [d("Ceftriaxon hoặc cefotaxim", "ceftriaxon 4 g/ngày (12–24 giờ) hoặc cefotaxim 8–12 g/ngày (4–6 giờ)")],
    { duration: DUR, notes: [ADULT_NOTE, ...GEN] }),
  r(S19, "tr. 231", "r-men-18-50-alt", ["v8-36"],
    "Viêm màng não mủ 18–50 tuổi", "alternative",
    [
      d("Vancomycin", "30–45 mg/kg/ngày (8–12 giờ)"),
      d("Kết hợp ceftriaxon hoặc cefotaxim", "liều như trên"),
    ],
    { duration: DUR }),
  r(S19, "tr. 231", "r-men-50-first", ["v8-36"],
    "Viêm màng não mủ > 50 tuổi (phế cầu, não mô cầu, Listeria, kỵ khí Gram âm)", "first",
    [d("Ceftriaxon hoặc cefotaxim", "ceftriaxon 4 g/ngày (12–24 giờ) hoặc cefotaxim 8–12 g/ngày (4–6 giờ)")],
    { duration: DUR,
      notes: ["Bảng II.19 ghi kháng sinh ưu tiên là ceftriaxon/cefotaxim; ampicilin xuất hiện ở cột thay thế (chọn khi nghi Listeria)."] }),
  r(S19, "tr. 231", "r-men-50-alt", ["v8-36"],
    "Viêm màng não mủ > 50 tuổi – nghi Listeria", "alternative",
    [
      d("Ampicilin", "12 g/ngày (4 giờ)"),
      d("Kết hợp ceftriaxon hoặc cefotaxim", "liều như trên"),
    ],
    { duration: DUR }),
  r(S19, "tr. 231", "r-men-immuno-first", ["v8-36"],
    "Viêm màng não mủ ở người suy giảm miễn dịch (phế cầu, não mô cầu, Listeria, kỵ khí Gram âm)", "first",
    [
      d("Ampicilin", "12 g/ngày (4 giờ)"),
      d("Kết hợp ceftazidim", "6 g/ngày (8 giờ)"),
    ],
    { duration: DUR }),
  r(S19, "tr. 231", "r-men-immuno-alt", ["v8-36"],
    "Viêm màng não mủ ở người suy giảm miễn dịch", "alternative",
    [
      d("Vancomycin", "30–45 mg/kg/ngày (8–12 giờ)"),
      d("Kết hợp ampicilin", "12 g/ngày (4 giờ)"),
      d("Kết hợp ceftazidim", "6 g/ngày (8 giờ)"),
    ],
    { duration: DUR }),

  // ===== Sau chấn thương, phẫu thuật, dò dịch não tủy (v8-38) =====
  r(S19, "tr. 231", "r-men-postsurg-first", ["v8-38"],
    "Viêm màng não sau chấn thương, phẫu thuật, dò dịch não tủy (phế cầu, tụ cầu, kỵ khí Gram âm)", "first",
    [
      d("Ceftazidim", "6 g/ngày (8 giờ)"),
      d("Kết hợp vancomycin", "30–45 mg/kg/ngày (8–12 giờ)"),
    ],
    { duration: DUR,
      notes: ["Hàng 'chấn thương, phẫu thuật, dò DNT' của Bảng II.19; văn bản không có hàng riêng cho nhiễm khuẩn dẫn lưu não thất: áp dụng cần thẩm định.", ADULT_NOTE] }),
  r(S19, "tr. 231", "r-men-postsurg-alt", ["v8-38"],
    "Viêm màng não sau chấn thương, phẫu thuật, dò dịch não tủy", "alternative",
    [
      d("Ceftazidim", "6 g/ngày (8 giờ)"),
      d("Kết hợp vancomycin", "30–45 mg/kg/ngày (8–12 giờ)"),
      d("Kết hợp meropenem", "6 g/ngày (8 giờ)"),
    ],
    { duration: DUR }),

  // ===== Trẻ em (v8-104) =====
  r(S19, "tr. 231", "r-men-neo-first", ["v8-104"],
    "Viêm màng não 0–4 tuần tuổi (vi khuẩn đường ruột, S. agalactiae, Listeria)", "first",
    [
      d("Cefotaxim", "ngày tuổi 0–7: 100–150 mg/kg/ngày (8–12 giờ); ngày tuổi 8–28: 150–200 mg/kg/ngày (6–8 giờ)"),
      d("Kết hợp ampicilin", "ngày tuổi 0–7: 150 mg/kg/ngày (8 giờ); ngày tuổi 8–28: 200 mg/kg/ngày (6–8 giờ)"),
    ],
    { duration: DUR,
      notes: ["Trẻ non tháng, nhẹ cân (< 2 kg) khuyến cáo liều thấp hơn và khoảng cách dài hơn (chú thích a Bảng II.20).", ...GEN] }),
  r(S19, "tr. 231", "r-men-neo-alt", ["v8-104"],
    "Viêm màng não 0–4 tuần tuổi", "alternative",
    [
      d("Ampicilin", "ngày tuổi 0–7: 150 mg/kg/ngày (8 giờ); ngày tuổi 8–28: 200 mg/kg/ngày (6–8 giờ)"),
      d("Kết hợp aminoglycosid", "gentamycin 5 mg/kg/ngày (12 giờ) ngày tuổi 0–7, 7,5 mg/kg/ngày (8 giờ) ngày tuổi 8–28; hoặc amikacin 15–20 mg/kg/ngày (12 giờ) ngày tuổi 0–7, 30 mg/kg/ngày (8 giờ) ngày tuổi 8–28"),
    ],
    { duration: DUR }),
  r(S19, "tr. 231", "r-men-1-3m-first", ["v8-104"],
    "Viêm màng não 1–3 tháng tuổi (Hib, phế cầu, não mô cầu, S. agalactiae, E. coli, Listeria)", "first",
    [
      d("Ampicilin", "300 mg/kg/ngày (6 giờ) (cột 'Trẻ em' của Bảng II.20)"),
      d("Kết hợp ceftriaxon hoặc cefotaxim", "ceftriaxon 80–100 mg/kg/ngày (12–24 giờ) hoặc cefotaxim 225–300 mg/kg/ngày (6–8 giờ)"),
    ],
    { duration: DUR,
      notes: ["Bảng II.20 chia cột 'ngày tuổi 0–28' và 'Trẻ em' mà không nêu riêng lứa 1–3 tháng: dùng cột 'Trẻ em' là suy luận, cần thẩm định.", "Không khuyến cáo meropenem cho trẻ dưới 3 tháng tuổi.", CHILD_NOTE] }),
  r(S19, "tr. 231", "r-men-1-3m-alt", ["v8-104"],
    "Viêm màng não 1–3 tháng tuổi", "alternative",
    [
      d("Vancomycin", "60 mg/kg/ngày (6 giờ)"),
      d("Kết hợp ceftriaxon hoặc cefotaxim", "liều như trên"),
    ],
    { duration: DUR }),
  r(S19, "tr. 231", "r-men-3m-18y-first", ["v8-104"],
    "Viêm màng não 3 tháng – 18 tuổi (Hib, phế cầu, não mô cầu)", "first",
    [d("Ceftriaxon hoặc cefotaxim", "ceftriaxon 80–100 mg/kg/ngày (12–24 giờ) hoặc cefotaxim 225–300 mg/kg/ngày (6–8 giờ)")],
    { duration: DUR, notes: [CHILD_NOTE, ...GEN] }),
  r(S19, "tr. 231", "r-men-3m-18y-alt", ["v8-104"],
    "Viêm màng não 3 tháng – 18 tuổi", "alternative",
    [
      d("Vancomycin", "60 mg/kg/ngày (6 giờ)"),
      d("Kết hợp ceftriaxon hoặc cefotaxim", "liều như trên"),
    ],
    { duration: DUR }),
];
