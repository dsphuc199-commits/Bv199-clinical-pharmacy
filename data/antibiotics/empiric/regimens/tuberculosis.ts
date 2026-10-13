/*
  FILE: data/antibiotics/empiric/regimens/tuberculosis.ts
  Nguon: BYT QD 162/QD-BYT (2024) Huong dan chan doan, dieu tri va du phong benh lao,
  Phan III muc 2.1 (phac do lao nhay cam thuoc) va Phu luc 6 (lieu luong).
  So trang ghi la SO TRANG IN (= trang PDF - 1).
  Chi gom phac do lao NHAY CAM (khong co bang chung/nghi ngo khang thuoc). Lao khang thuoc
  (phac do ngan/dai ngay, BPaL(M)) KHONG nam trong danh muc mat benh nen khong dua vao.
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt162");

const ADULT_DOSE =
  "Liều người lớn hàng ngày (mg/kg; khoảng): H 5 (4–6), tối đa 300 mg; R 10 (8–12); Z 25 (20–30); E 15 (15–20) (Phụ lục 6, bảng 1, tr. 179).";
const CHILD_DOSE =
  "Liều trẻ em hàng ngày (mg/kg; khoảng): H 10 (7–15), tối đa 300 mg; R 15 (10–20); Z 35 (30–40); E 20 (15–25). Trẻ ≥ 25 kg dùng theo thang cân nặng người lớn (Phụ lục 6, bảng 1, tr. 179).";
const TBM_STEROID =
  "Lao màng não: corticosteroid (dexamethason hoặc prednisolon) liều giảm dần trong 6–8 tuần đầu; có thể thêm streptomycin trong giai đoạn tấn công với lao màng não nặng khi cân nhắc lợi ích/nguy cơ.";

export const TUBERCULOSIS: Regimen[] = [
  /* ---------------- Lao phổi ---------------- */
  r("Phác đồ A1 (2HRZE/4RHE)", "tr. 43", "r-tb-a1", ["v8-142"],
    "Lao phổi người lớn không có bằng chứng/nghi ngờ kháng thuốc (kể cả HIV và phụ nữ có thai) – phác đồ 6 tháng", "first",
    [
      d("Tấn công 2 tháng: Isoniazid (H) + Rifampicin (R) + Pyrazinamid (Z) + Ethambutol (E)", "hàng ngày; H 5 mg/kg (tối đa 300 mg), R 10 mg/kg, Z 25 mg/kg, E 15 mg/kg"),
      d("Duy trì 4 tháng: Rifampicin (R) + Isoniazid (H) + Ethambutol (E)", "hàng ngày, liều như trên"),
    ],
    { duration: "6 tháng (2HRZE/4RHE)", notes: [ADULT_DOSE, "Viên hỗn hợp liều cố định người lớn theo cân nặng: HRZE 25–39 kg: 2 viên; 40–54 kg: 3; 55–70 kg: 4; > 70 kg: 5 (tr. 180).", "Chỉ định cho lao người lớn không có bằng chứng kháng thuốc; không dùng phác đồ này cho lao hệ thần kinh trung ương, lao xương khớp."] }),
  r("Phác đồ A2 (2HRZE/4RH)", "tr. 43–44", "r-tb-a2", ["v8-142"],
    "Lao phổi trẻ em không có bằng chứng/nghi ngờ kháng thuốc – phác đồ 6 tháng", "first",
    [
      d("Tấn công 2 tháng: H + R + Z + E", "hàng ngày; H 10 (7–15) mg/kg, R 15 (10–20) mg/kg, Z 35 (30–40) mg/kg, E 20 (15–25) mg/kg"),
      d("Duy trì 4 tháng: R + H", "hàng ngày"),
    ],
    { duration: "6 tháng (2HRZE/4RH)", notes: [CHILD_DOSE, "Có thể dùng cho trẻ nhiễm HIV. Không chỉ định cho lao hệ thần kinh trung ương và lao xương khớp."] }),
  r("Phác đồ A1a (2HPMZ/2HPM)", "tr. 44", "r-tb-a1a", ["v8-142"],
    "Lao phổi người từ 12 tuổi, ≥ 40 kg – phác đồ 4 tháng", "alternative",
    [
      d("Tấn công 2 tháng: Isoniazid (H) + Rifapentin (P) + Moxifloxacin (M) + Pyrazinamid (Z)", "hàng ngày; 40–< 50 kg và 50–< 65 kg: H 300 mg, P 1200 mg, M 400 mg, Z 1500–1600 mg (tùy viên 400/500 mg); ≥ 65 kg: Z 2000 mg"),
      d("Duy trì 2 tháng: H + P + M", "hàng ngày; H 300 mg, P 1200 mg, M 400 mg"),
    ],
    { duration: "4 tháng (2HPMZ/2HPM)", notes: ["Liều theo Phụ lục 6 bảng 9 (tr. 183). Uống rifapentin cùng bữa ăn ít béo.", "KHÔNG chỉ định: lao ngoài phổi; HIV có CD4 < 100/mm³; phụ nữ có thai, cho con bú; cân nặng < 40 kg; có bằng chứng/nghi ngờ kháng thuốc."] }),
  r("Phác đồ A2a (2HRZE/2RH)", "tr. 44–45", "r-tb-a2a", ["v8-142"],
    "Lao nhẹ ở trẻ 3 tháng–16 tuổi – phác đồ 4 tháng", "alternative",
    [
      d("Tấn công 2 tháng: H + R + Z + E", "hàng ngày, liều trẻ em như phác đồ A2"),
      d("Duy trì 2 tháng: R + H (+ E theo tài liệu gốc)", "hàng ngày"),
    ],
    { duration: "4 tháng; có thể kéo dài thêm 2 tháng duy trì hoặc đổi phác đồ nếu không đáp ứng sau 4 tháng", notes: [CHILD_DOSE, "Chỉ định khi thỏa cả 3 tiêu chí: tổn thương X-quang nhẹ (hạch trung thất không chèn ép; nhu mô khu trú một thùy không hang; tràn dịch màng phổi không phức tạp); Xpert âm tính/vết/rất thấp/thấp hoặc AFB âm tính; lâm sàng nhẹ, không cần nội trú. Có thể dùng cho trẻ nhiễm HIV.", "Tên phác đồ ghi 2HRZE/2RH nhưng mô tả giai đoạn duy trì ghi 3 thuốc R, H, E: tài liệu gốc không thống nhất, cần đối chiếu bản gốc."] }),

  /* ---------------- Lao màng não / hệ thần kinh trung ương ---------------- */
  r("Phác đồ B1 (2HRZE/10RHE)", "tr. 45", "r-tb-b1", ["v8-141"],
    "Lao hệ thần kinh trung ương/màng não người lớn không có bằng chứng kháng thuốc – phác đồ 12 tháng", "first",
    [
      d("Tấn công 2 tháng: H + R + Z + E", "hàng ngày; H 5 mg/kg (tối đa 300 mg), R 10 mg/kg, Z 25 mg/kg, E 15 mg/kg"),
      d("Duy trì 10 tháng: R + H + E", "hàng ngày"),
      d("Hỗ trợ: Corticosteroid (dexamethason hoặc prednisolon)", "liều giảm dần trong 6–8 tuần đầu (tài liệu không nêu liều cụ thể)"),
    ],
    { duration: "12 tháng (2HRZE/10RHE)", notes: [ADULT_DOSE, TBM_STEROID] }),
  r("Phác đồ B2 (2HRZE/10RH)", "tr. 45", "r-tb-b2", ["v8-141"],
    "Lao hệ thần kinh trung ương/màng não trẻ em không có bằng chứng kháng thuốc – phác đồ 12 tháng", "first",
    [
      d("Tấn công 2 tháng: H + R + Z + E", "hàng ngày, liều trẻ em"),
      d("Duy trì 10 tháng: R + H", "hàng ngày"),
      d("Hỗ trợ: Streptomycin trong giai đoạn tấn công", "tài liệu không nêu liều trong mục này; liều người lớn 15 (12–18) mg/kg, Phụ lục 6 không có cột trẻ em"),
      d("Hỗ trợ: Corticosteroid (dexamethason hoặc prednisolon)", "liều giảm dần trong 6–8 tuần đầu (tài liệu không nêu liều cụ thể)"),
    ],
    { duration: "12 tháng (2HRZE/10RH)", notes: [CHILD_DOSE, TBM_STEROID, "Bản dịch thuật tài liệu gốc ghi \"sử dụng thêm Streptomycine trong giai đoạn tấn công\" cho trẻ em; phần B1 ghi \"có thể\" cho lao màng não nặng: cần thẩm định điều kiện dùng streptomycin ở trẻ em."] }),
  r("Phác đồ B2a (6HRZEto)", "tr. 46", "r-tb-b2a", ["v8-141"],
    "Lao hệ thần kinh trung ương/màng não người 0–19 tuổi không có bằng chứng kháng thuốc – phác đồ 6 tháng", "alternative",
    [
      d("Isoniazid (H)", "15–20 mg/kg/ngày (mức cao cho trẻ nhỏ, trẻ lớn dùng mức thấp)"),
      d("Rifampicin (R)", "22,5–30 mg/kg/ngày"),
      d("Pyrazinamid (Z)", "35–45 mg/kg/ngày"),
      d("Ethionamid (Eto)", "17,5–22,5 mg/kg/ngày"),
    ],
    { duration: "6 tháng, dùng hàng ngày liên tục", notes: ["Liều theo Phụ lục 6 bảng số 7 (tr. 182); số viên theo cân nặng ở bảng số 8 (tr. 182).", "KHÔNG chỉ định cho người nhiễm HIV.", TBM_STEROID] }),
];
