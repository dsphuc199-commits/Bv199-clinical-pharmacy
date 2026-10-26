/*
  FILE: data/antibiotics/empiric/regimens/copd-2767.ts
  Nguon: BYT QĐ 2767/QĐ-BYT (04/07/2023) "Hướng dẫn chẩn đoán và điều trị bệnh phổi tắc
  nghẽn mạn tính" – ban PDF ky so tren kcb.vn, doc ngay 25/10/2026.
  - Muc 3.4.2 dieu tri ngoai tru: tr. 30 (lieu), Bieu do 3.1 tr. 31
  - Muc 3.4.3 dieu tri noi tru: tr. 33 (lieu), Bieu do 3.2 tr. 35
  - Bang 3 (tr. 86, phu luc): co khac biet nho so voi muc chinh – ghi chu o tung phuong an.
  Trang = so trang in (PDF = trang in + 1). Van ban moi nhat cho dot cap BPTNMT:
  quy tac "van ban moi thay van ban cu" an phan BPTNMT cua QĐ 708 (2015).
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt2767");
const IDS = ["v8-6"];

const OUT = "Mục 3.4.2 – Điều trị ngoại trú; Biểu đồ 3.1";
const OUT_P = "tr. 30–31";
const IN = "Mục 3.4.3 – Điều trị nội trú; Biểu đồ 3.2";
const IN_P = "tr. 33–35";

const OUT_IND =
  "Chỉ định (tr. 30): dùng kháng sinh đường uống khi có bằng chứng nhiễm khuẩn – có cả 3 triệu chứng chính (tăng khó thở, tăng lượng đờm, đờm mủ) hoặc đờm mủ và 1 trong 2 triệu chứng còn lại. Biểu đồ 3.1: không có ≥ 2 triệu chứng chính thì không chỉ định kháng sinh trừ khi triệu chứng xấu hơn dù đã điều trị hỗ trợ.";
const OUT_RISK =
  "Yếu tố nguy cơ kết cục xấu (Biểu đồ 3.1): FEV1 < 50%; ≥ 2 đợt cấp trong 12 tháng; nhập viện vì đợt cấp trong 3 tháng; đang thở oxy dài hạn tại nhà; bệnh đồng mắc (suy tim, bệnh tim thiếu máu cục bộ…).";
const OUT_CHOICE =
  "Chọn kháng sinh tùy bệnh đồng mắc, nhạy cảm kháng sinh tại địa phương, tác nhân trước đó, tác dụng phụ/tương tác; nếu đã dùng kháng sinh trong 3 tháng, chọn nhóm khác (chú thích Biểu đồ 3.1).";
const FQ_WARN =
  "Fluoroquinolon hô hấp: Cục Quản lý Dược (4/2017) khuyến cáo hạn chế dùng cho đợt cấp BPTNMT trừ khi kháng sinh khác bị chống chỉ định hoặc có nguy cơ thất bại (tr. 30).";
const IN_IND =
  "Chỉ định (tr. 33): có cả 3 triệu chứng chính; hoặc đờm mủ và 1 trong 2 triệu chứng còn lại; hoặc phải thông khí cơ học (xâm nhập hoặc không xâm nhập). Biểu đồ 3.2: nghi viêm phổi hoặc nhiễm khuẩn nơi khác thì đánh giá và điều trị theo bệnh đó.";
const IN_FOLLOW =
  "Nhuộm Gram và cấy đờm làm kháng sinh đồ; đánh giá đáp ứng sau 48–72 giờ; chuyển đường uống khi uống được; đổi kháng sinh theo kháng sinh đồ khi không cải thiện (Biểu đồ 3.2, tr. 33).";
const IN_PSEUDO_RISK =
  "Nguy cơ Pseudomonas (Bảng 3, tr. 86): mới nhập viện gần đây; thường xuyên điều trị kháng sinh (4 đợt/năm); GOLD 4; đã phân lập trực khuẩn mủ xanh trong đợt cấp trước hoặc cư trú khi ổn định.";

export const COPD_2767: Regimen[] = [
  // ===== Ngoai tru =====
  r(OUT, OUT_P, "r-copd23-out-low", IDS,
    "Ngoại trú – có chỉ định kháng sinh, không có yếu tố nguy cơ kết cục xấu", "first",
    [
      d("Macrolid", "azithromycin 500 mg 1 viên/ngày; hoặc clarithromycin 500 mg 1 viên x 2 lần/ngày; hoặc clarithromycin MR 500 mg 2 viên/ngày"),
      d("hoặc cephalosporin thế hệ 2 hoặc 3", "cefuroxim axetil 0,5 g 1 viên x 2 lần/ngày; cefpodoxim 200 mg 1 viên x 2 lần/ngày; cefdinir 300 mg 1 viên x 2 lần/ngày"),
    ],
    { duration: "Thường 5–7 ngày; đánh giá đáp ứng lâm sàng sau 5–7 ngày (Biểu đồ 3.1)", notes: [OUT_IND, OUT_CHOICE, "Nhóm macrolid ít được dùng hơn vì nguy cơ S. pneumoniae/H. influenzae đề kháng và nguy cơ kéo dài QT ở người có bệnh tim mạch (tr. 30)."] }),
  r(OUT, OUT_P, "r-copd23-out-risk", IDS,
    "Ngoại trú – có yếu tố nguy cơ kết cục xấu, không có nguy cơ nhiễm Pseudomonas", "first",
    [
      d("Amoxicilin-clavulanat", "amoxicillin/clavulanic acid 875/125 mg 1 viên x 3 lần/ngày hoặc 2 viên x 2 lần/ngày"),
      d("hoặc levofloxacin hoặc moxifloxacin", "levofloxacin 500 mg 1–1,5 viên/ngày; moxifloxacin 400 mg 1 viên/ngày"),
    ],
    { duration: "Thường 5–7 ngày (Biểu đồ 3.1)", notes: [OUT_IND, OUT_RISK, OUT_CHOICE, "Amoxicillin/clavulanate thường được ưu tiên cho điều trị ngoại trú vì ít bị kháng thuốc hơn, nhưng có tác dụng phụ tiêu chảy (tr. 30).", FQ_WARN] }),
  r(OUT, OUT_P, "r-copd23-out-pseudo", IDS,
    "Ngoại trú – có yếu tố nguy cơ kết cục xấu và nguy cơ nhiễm Pseudomonas", "pathogen",
    [d("Ciprofloxacin (hoặc levofloxacin khi chỉ có yếu tố nguy cơ khác)", "ciprofloxacin 500 mg 1 viên x 2 lần/ngày; levofloxacin 500 mg 1–1,5 viên/ngày")],
    { duration: "Thường 5–7 ngày (Biểu đồ 3.1)", notes: [OUT_IND, "Biểu đồ 3.1: Pseudomonas thường trú mạn tính hoặc cấy đờm dương tính trong năm qua → ciprofloxacin và cấy đờm làm kháng sinh đồ. Yếu tố nguy cơ khác (FEV1 < 30%, giãn phế quản trên X-quang/CT, kháng sinh phổ rộng trong 3 tháng) → ciprofloxacin hoặc levofloxacin và cấy đờm.", FQ_WARN] }),

  // ===== Noi tru =====
  r(IN, IN_P, "r-copd23-in-low", IDS,
    "Nội trú – có chỉ định kháng sinh, không có nguy cơ nhiễm Pseudomonas", "first",
    [
      d("Fluoroquinolon hô hấp", "moxifloxacin 400 mg 1 lần/ngày hoặc levofloxacin 500–750 mg 1 lần/ngày, uống hoặc tiêm mạch (TM)"),
      d("hoặc cephalosporin thế hệ 3", "ceftriaxon 1–2 g x 1–2 lần/ngày hoặc cefotaxim 1–2 g x 3 lần/ngày TM"),
    ],
    { duration: "Thường 7–10 ngày (Biểu đồ 3.2)", notes: [IN_IND, IN_FOLLOW] }),
  r(IN, IN_P, "r-copd23-in-pseudo", IDS,
    "Nội trú – có nguy cơ nhiễm P. aeruginosa", "pathogen",
    [d("Một trong", "ciprofloxacin 400 mg x 2–3 lần/ngày TM; ceftazidim 1–2 g x 2–3 lần/ngày truyền tĩnh mạch (TTM); cefepim 1–2 g x 2–3 lần/ngày TTM; piperacillin-tazobactam 4,5 g x 4 lần/ngày TTM; imipenem 500 mg x 4 TTM; meropenem 1 g x 3 TTM")],
    { duration: "Thường 7–10 ngày (Biểu đồ 3.2)", notes: [IN_IND, IN_PSEUDO_RISK, IN_FOLLOW, "Bảng 3 (tr. 86) ghi piperacillin-tazobactam 4,5 g x 3–4 lần/ngày – khác mục 3.4.3 (4,5 g x 4 lần/ngày). CẦN DƯỢC SĨ XÁC NHẬN."] }),
  r(IN, IN_P, "r-copd23-in-mdr-pseudo", IDS,
    "Nội trú – có yếu tố nguy cơ P. aeruginosa đa kháng", "pathogen",
    [
      d("Levofloxacin", "liều như trên (500–750 mg 1 lần/ngày)"),
      d("phối hợp với một trong", "amikacin 15–20 mg/kg/ngày TTM; hoặc colistin liều nạp 5 mg/kg, sau đó 2,5 mg/kg x 2 lần/ngày TTM"),
    ],
    { duration: "Thường 7–10 ngày (Biểu đồ 3.2)", notes: [IN_IND, "Yếu tố nguy cơ P. aeruginosa đa kháng (tr. 33): bạch cầu đa nhân trung tính < 500/mm³, tiền sử nhiễm P. aeruginosa đa kháng, hoặc cấy đờm ra P. aeruginosa có MIC > 1 mg/L.", "Bảng 3 (tr. 86) ghi phối hợp một trong các thuốc chống Pseudomonas (không chỉ levofloxacin) với amikacin 15–20 mg/kg/ngày, tobramycin 5–7 mg/kg/ngày hoặc colistin – khác mục 3.4.3. CẦN DƯỢC SĨ XÁC NHẬN.", IN_FOLLOW] }),
];
