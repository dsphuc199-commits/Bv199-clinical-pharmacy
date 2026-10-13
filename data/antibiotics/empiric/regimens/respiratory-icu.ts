/*
  FILE: data/antibiotics/empiric/regimens/respiratory-icu.ts
  Nguon: BYT QD 1493/QD-BYT (2015) - Huong dan chan doan va xu tri Hoi suc tich cuc.
  - Dot cap BPTNMT: tr. 16 (v8-6)
  - Viem phoi cong dong nang (hoi suc): tr. 43 (v8-1)
  - Viem phoi benh vien / lien quan tho may: tr. 51-52 (v8-4, v8-5)
  So trang la so trang PDF (so trang in lech khoang 5 trang).
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt1493");

export const RESPIRATORY_ICU: Regimen[] = [
  // ===== Đợt cấp BPTNMT (v8-6) =====
  r("Đợt cấp bệnh phổi tắc nghẽn mạn tính, mục kháng sinh", "tr. PDF 16", "r-icu-copd-community", ["v8-6"],
    "Đợt cấp BPTNMT do nhiễm khuẩn cộng đồng (H. influenzae, S. pneumoniae, M. catarrhalis) – hồi sức", "first",
    [
      d("Cephalosporin thế hệ 3 hoặc penicilin phổ rộng", "văn bản không nêu tên thuốc/liều"),
      d("Kết hợp một trong", "aminoglycosid; fluoroquinolon; moxifloxacin"),
    ],
    { notes: ["Macrolid nếu nghi ngờ do Legionella hoặc vi khuẩn không điển hình.", "Chỉ định kháng sinh khi có dấu hiệu nhiễm khuẩn (khó thở tăng, tăng khạc đờm, đờm mủ; hoặc 2 trong 3 dấu hiệu trong đó có đờm mủ)."] }),
  r("Đợt cấp bệnh phổi tắc nghẽn mạn tính, mục kháng sinh", "tr. PDF 16", "r-icu-copd-hospital", ["v8-6"],
    "Đợt cấp BPTNMT nghi nhiễm khuẩn bệnh viện – hồi sức", "severe",
    [d("Kháng sinh phổ rộng, liệu pháp xuống thang", "văn bản không nêu tên thuốc/liều; chọn thuốc có tác dụng trên vi khuẩn nghi ngờ")]),

  // ===== Viêm phổi cộng đồng nặng tại hồi sức (v8-1) =====
  r("Viêm phổi cộng đồng nặng, mục 5.3a", "tr. PDF 43", "r-icu-cap-nonpseudo-1", ["v8-1"],
    "Viêm phổi nặng tại hồi sức – không có nguy cơ Pseudomonas aeruginosa (phương án 1)", "first",
    [
      d("Cephalosporin thế hệ 3", "ceftriaxon 1–2 g/ngày; hoặc cefotaxim 1–2 g mỗi 6–8 giờ"),
      d("Kết hợp một trong", "fluoroquinolon kháng phế cầu (levofloxacin 500 mg/ngày; gatifloxacin 400 mg/ngày; moxifloxacin 400 mg/ngày) hoặc macrolid (azithromycin 500 mg/ngày; erythromycin 500 mg mỗi 6 giờ; clarithromycin 500 mg mỗi 12 giờ)"),
    ],
    { duration: "Vi khuẩn điển hình: 7–10 ngày; dùng corticoid lâu ngày: 14 ngày hoặc lâu hơn",
      notes: ["Kháng sinh sớm trong 6 giờ đầu sau nhập viện, ngay sau khi lấy bệnh phẩm.", "Hướng dẫn hồi sức 2015; module CAP của app dùng QĐ 2147/QĐ-BYT 2026 là nguồn BYT mới hơn cho CAP."] }),
  r("Viêm phổi cộng đồng nặng, mục 5.3a", "tr. PDF 43", "r-icu-cap-nonpseudo-2", ["v8-1"],
    "Viêm phổi nặng tại hồi sức – không có nguy cơ Pseudomonas (phương án 2)", "alternative",
    [
      d("Beta-lactam + chất ức chế beta-lactamase", "ampicilin/sulbactam 1,5–3 g mỗi 6 giờ; hoặc amoxicilin/acid clavulanic"),
      d("Kết hợp", "fluoroquinolon kháng phế cầu hoặc macrolid (liều như trên)"),
    ]),
  r("Viêm phổi cộng đồng nặng, mục 5.3a", "tr. PDF 43", "r-icu-cap-pseudo-1", ["v8-1"],
    "Viêm phổi nặng tại hồi sức – có nguy cơ Pseudomonas aeruginosa (phương án 1)", "pathogen",
    [
      d("Beta-lactam kháng trực khuẩn mủ xanh", "văn bản không nêu tên thuốc ở dòng này"),
      d("Kết hợp aminoglycosid", "không nêu liều"),
      d("Kết hợp fluoroquinolon kháng phế cầu hoặc macrolid", "liều như trên"),
    ]),
  r("Viêm phổi cộng đồng nặng, mục 5.3a", "tr. PDF 43", "r-icu-cap-pseudo-2", ["v8-1"],
    "Viêm phổi nặng tại hồi sức – có nguy cơ Pseudomonas aeruginosa (phương án 2)", "pathogen",
    [
      d("Beta-lactam kháng trực khuẩn mủ xanh", "cefepim 1–2 g mỗi 12 giờ; hoặc piperacilin/tazobactam; imipenem; meropenem (liều không nêu)"),
      d("Kết hợp ciprofloxacin", "không nêu liều"),
    ],
    { notes: ["Nghi vi khuẩn sinh ESBL: dùng ngay carbapenem (imipenem, meropenem…)."] }),
  r("Viêm phổi cộng đồng nặng, mục 5.3a", "tr. PDF 43", "r-icu-cap-mrsa", ["v8-1"],
    "Viêm phổi nặng tại hồi sức – nghi Staphylococcus kháng methicilin (thêm vào phác đồ nền)", "adjunct",
    [d("Thêm", "vancomycin hoặc teicoplanin, kết hợp linezolid (không nêu liều)")]),
  r("Viêm phổi cộng đồng nặng, mục 5.3a", "tr. PDF 43", "r-icu-cap-aspiration", ["v8-1"],
    "Viêm phổi do hít hoặc do vi khuẩn kỵ khí (hồi sức)", "pathogen",
    [d("Một trong", "beta-lactam + chất ức chế beta-lactamase; clindamycin (không nêu liều)")]),

  // ===== Viêm phổi bệnh viện / thở máy tại hồi sức (v8-4, v8-5) =====
  r("Viêm phổi bệnh viện, mục 5.3a", "tr. PDF 51", "r-icu-hap-nomdr", ["v8-4", "v8-5"],
    "Viêm phổi bệnh viện/thở máy tại hồi sức – không có nguy cơ vi khuẩn đa kháng", "first",
    [d("Một trong", "ceftriaxon; quinolon (levofloxacin, moxifloxacin, ciprofloxacin); ampicilin/sulbactam; ertapenem (văn bản không nêu liều)")],
    { notes: ["Đánh giá lại sau 48–72 giờ hoặc khi có kết quả nuôi cấy; xem xét lại liệu trình tại thời điểm 3, 5, 7 ngày; xuống thang theo kết quả vi sinh."] }),
  r("Viêm phổi bệnh viện, mục 5.3b", "tr. PDF 51", "r-icu-hap-mdr", ["v8-4", "v8-5"],
    "Viêm phổi liên quan thở máy có nguy cơ vi sinh vật đa kháng: 1 kháng sinh nhóm A + 1 nhóm B (cân nhắc thêm nhóm C hoặc D)", "severe",
    [
      d("Nhóm A – một trong", "cephalosporin kháng trực khuẩn mủ xanh (cefepim, ceftazidim); carbapenem kháng trực khuẩn mủ xanh (imipenem, meropenem); beta-lactam ức chế beta-lactamase (piperacilin/tazobactam)"),
      d("Kết hợp nhóm B – một trong", "fluoroquinolon kháng trực khuẩn mủ xanh (ciprofloxacin, levofloxacin); aminoglycosid (amikacin, gentamycin, tobramycin)"),
    ],
    { notes: ["Nhóm C nếu nghi tụ cầu kháng methicilin: linezolid; vancomycin; teicoplanin (cân nhắc nếu có nguy cơ kháng vancomycin).", "Nhóm D nếu nghi nấm (dùng kháng sinh phổ rộng > 7 ngày hoặc suy giảm miễn dịch): fluconazol, itraconazol; nếu đã kháng dùng nhóm echinocandin.", "Nghi vi khuẩn sinh ESBL: carbapenem kết hợp fluoroquinolon.", "Văn bản không nêu liều từng thuốc; suy thận cần hiệu chỉnh theo mức lọc cầu thận."] }),
];
