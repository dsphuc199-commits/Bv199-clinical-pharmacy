/*
  FILE: data/antibiotics/empiric/regimens/ent.ts
  Nguon: BYT QD 5643/QD-BYT (31/12/2015) - Huong dan chan doan va dieu tri mot so benh
  ve Tai Mui Hong. So trang = so trang in = so trang PDF.
  Luu y: phan lon muc chi neu TEN thuoc hoac NHOM thuoc, khong co lieu (dung NO_DOSE).
  Chi muc "Nhiem trung khoang co sau" (tr. 256) co bang lieu.
*/

import { NO_DOSE, d, maker } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt5643");

export const ENT: Regimen[] = [
  // ===== Viêm họng cấp / liên cầu (v8-8, v8-54) =====
  r("Viêm họng cấp tính, mục 4.2.1", "tr. 157", "r-ent-pharyngitis", ["v8-8", "v8-54"],
    "Viêm họng đỏ cấp ở bệnh nhân > 3 tuổi (điều trị như viêm họng do liên cầu khi không có xét nghiệm định loại)", "first",
    [d("Một trong", `amoxicilin; cephalexin; erythromycin; clarithromycin (${NO_DOSE})`)],
    { notes: ["Nguyên tắc 4.1: kháng sinh nhóm beta-lactam hoặc các nhóm khác; mọi viêm họng đỏ cấp đơn thuần > 3 tuổi đều điều trị như do liên cầu khi không có xét nghiệm.", "Liều, thời gian: dùng module Viêm họng liên cầu của app (CDC/quốc tế) và đối chiếu danh mục BV199; nguồn BYT này không nêu."] }),

  // ===== Viêm amidan cấp (v8-55) =====
  r("Viêm amiđan cấp và mạn tính, mục điều trị", "tr. 144", "r-ent-tonsillitis", ["v8-55"],
    "Viêm amiđan cấp khi nghi nhiễm khuẩn hoặc đe dọa biến chứng", "first",
    [d("Nhóm beta-lactam", `không nêu tên thuốc cụ thể (${NO_DOSE})`)],
    { notes: ["Viêm amiđan cấp chủ yếu điều trị triệu chứng, nâng cao thể trạng; chỉ dùng kháng sinh khi nghi nhiễm khuẩn hoặc đe dọa biến chứng."] }),
  r("Viêm amiđan cấp và mạn tính, mục điều trị", "tr. 144", "r-ent-tonsillitis-allergy", ["v8-55"],
    "Viêm amiđan cấp – dị ứng beta-lactam", "allergy",
    [d("Nhóm macrolid", `không nêu tên thuốc cụ thể (${NO_DOSE})`)]),

  // ===== Nhiễm trùng khoang cổ sâu (v8-66) và áp xe quanh amidan / sau họng (v8-56, v8-57) =====
  r("Nhiễm trùng khoang cổ sâu, mục 5.2", "tr. 255–256", "r-ent-deepneck-ctx", ["v8-66", "v8-56", "v8-57"],
    "Nhiễm trùng/áp xe khoang cổ sâu: kháng sinh phổ rộng, đường tĩnh mạch, liều cao (khoang sau hầu và khoang quanh amiđan thuộc các khoang cổ sâu theo mục 1)", "first",
    [
      d("Metronidazol", "0,5 g/chai, 1 chai x 2–3 lần/ngày"),
      d("Phối hợp một trong", "ceftriaxon 1 g/lọ: 1–2 lọ x 1 lần/ngày hoặc 100 mg/kg/ngày, tối đa 4 g/ngày; ceftazidim 1 g/lọ: 1 lọ x 3 lần/ngày hoặc 2 lọ x 2 lần/ngày, nặng 2 lọ x 3 lần/ngày, tối đa 9 g/ngày; cefotaxim 1 g/lọ: 1 lọ x 3 lần/ngày, nặng 2 lọ x 3 lần/ngày, tối đa 12 g/ngày"),
    ],
    { notes: ["Không cải thiện sau 24–48 giờ nội khoa: chụp lại hình ảnh và dẫn lưu/phẫu thuật. Điều chỉnh kháng sinh, liều, thời gian theo đáp ứng lâm sàng và kháng sinh đồ.", "Văn bản không nêu thời gian điều trị.", "Đảm bảo đường thở (mục 5.1) và dẫn lưu mủ là điều trị chính kèm theo."] }),

  // ===== Viêm xoang cấp (v8-7, v8-58) =====
  r("Viêm mũi xoang cấp tính, mục 4.2.1", "tr. 111", "r-ent-sinus-moderate", ["v8-7", "v8-58"],
    "Viêm mũi xoang cấp nhiễm khuẩn, thể trung bình, không dùng kháng sinh gần đây (4–6 tuần)", "first",
    [d("Một trong", `amoxicilin/clavulanat; cefpodoxim; cefuroxim; cefdinir (${NO_DOSE})`)],
    { duration: "Thể nặng: 10–14 ngày; thể khác: văn bản không nêu",
      notes: ["Nếu điều trị 72 giờ thất bại: đánh giá lại, cân nhắc CT, nội soi mũi, nuôi cấy vi khuẩn.", "Tỷ lệ thất bại với kháng sinh không phải beta-lactam có thể tới 25%."] }),
  r("Viêm mũi xoang cấp tính, mục 4.2.1", "tr. 111", "r-ent-sinus-allergy-adult", ["v8-7", "v8-58"],
    "Viêm mũi xoang cấp – người lớn dị ứng beta-lactam (thể trung bình, không dùng kháng sinh gần đây)", "allergy",
    [d("Một trong", `TMP/SMX; doxycyclin; macrolid (${NO_DOSE})`)]),
  r("Viêm mũi xoang cấp tính, mục 4.2.1", "tr. 111", "r-ent-sinus-recent-adult", ["v8-7", "v8-58"],
    "Viêm mũi xoang cấp – người lớn đã dùng kháng sinh gần đây hoặc bệnh chưa ở mức nguy hiểm", "alternative",
    [d("Một trong", `quinolon đường hô hấp; amoxicilin/clavulanat; ceftriaxon, hoặc kết hợp với kháng sinh phổ rộng (${NO_DOSE})`)]),
  r("Viêm mũi xoang cấp tính, mục 4.2.1", "tr. 111", "r-ent-sinus-recent-adult-allergy", ["v8-7", "v8-58"],
    "Viêm mũi xoang cấp – người lớn dị ứng beta-lactam đã dùng kháng sinh gần đây", "allergy",
    [d("Một trong", `quinolon đường hô hấp; clindamycin + rifampin (${NO_DOSE})`)]),

  // ===== Viêm mũi xoang trẻ em (v8-100) =====
  r("Viêm mũi xoang trẻ em, mục điều trị nội khoa", "tr. 83", "r-ent-sinus-child", ["v8-100"],
    "Viêm mũi xoang trẻ em", "first",
    [d("Một trong", `beta-lactam; cephalosporin thế hệ 1, 2; macrolid… (${NO_DOSE})`)],
    { duration: "7–14 ngày" }),
  r("Viêm mũi xoang cấp tính, mục 4.2.1", "tr. 111", "r-ent-sinus-child-moderate", ["v8-100"],
    "Viêm mũi xoang cấp ở trẻ em: thể trung bình, không dùng kháng sinh gần đây", "alternative",
    [d("Một trong", `amoxicilin/clavulanat; cefpodoxim; cefuroxim; cefdinir (${NO_DOSE})`)],
    { notes: ["Trẻ em dị ứng beta-lactam: TMP/SMX hoặc macrolid.", "Trẻ em đã dùng kháng sinh gần đây: amoxicilin/clavulanat hoặc ceftriaxon; dị ứng beta-lactam: TMP/SMX, macrolid hoặc clindamycin."] }),

  // ===== Viêm tai giữa cấp (v8-99, v8-60) =====
  r("Viêm tai giữa cấp tính trẻ em, mục 4.3.3", "tr. 214", "r-ent-aom-child", ["v8-99", "v8-60"],
    "Viêm tai giữa cấp tính trẻ em (chương BYT dành cho trẻ em; chưa có nhánh người lớn)", "first",
    [d("Kháng sinh phổ rộng nhóm", `beta-lactam, cephalosporin, macrolid… tốt nhất theo kháng sinh đồ (${NO_DOSE})`)],
    { notes: ["Phối hợp kháng viêm và dẫn lưu tại chỗ (chích rạch màng nhĩ); chụp X-quang xương chũm trong khi dùng kháng sinh để phát hiện viêm xương chũm tiềm tàng.", "Nhỏ tai sau khi thủng màng nhĩ: thuốc có kháng sinh và kháng viêm như hydrocortisol và chloramphenicol (tr. 213)."] }),

  // ===== Viêm xương chũm (v8-63) =====
  r("Viêm xương chũm cấp tính trẻ em, mục 4.3.1", "tr. 196", "r-ent-mastoiditis", ["v8-63"],
    "Viêm xương chũm cấp tính (chương BYT dành cho trẻ em)", "first",
    [d("Cephalosporin thế hệ 2, 3", `kháng sinh mạnh, phổ rộng, liều cao ngay từ đầu (${NO_DOSE})`)],
    { notes: ["Phẫu thuật kịp thời khi có túi mủ hoặc bệnh tích xương nặng."] }),

  // ===== Viêm thanh thiệt cấp (v8-64) =====
  r("Viêm phù nề thanh thiệt cấp tính, điều trị nội khoa", "tr. 242", "r-ent-epiglottitis-1", ["v8-64"],
    "Viêm phù nề thanh thiệt cấp tính – kháng sinh đầu tay", "first",
    [d("Cephalosporin thế hệ III", NO_DOSE)],
    { duration: "7–10 ngày" }),
  r("Viêm phù nề thanh thiệt cấp tính, điều trị nội khoa", "tr. 242", "r-ent-epiglottitis-2", ["v8-64"],
    "Viêm phù nề thanh thiệt cấp tính – kháng sinh đầu tay", "first",
    [d("Amoxicilin + acid clavulanic", NO_DOSE)],
    { duration: "7–10 ngày" }),

  // ===== Viêm tai giữa mạn chảy mủ (v8-67) =====
  r("Viêm tai giữa mạn tính, điều trị", "tr. 39", "r-ent-csom-topical", ["v8-67"],
    "Viêm tai giữa mạn tính chảy mủ – nhỏ tai kháng sinh", "first",
    [d("Một trong dung dịch nhỏ tai", "neomycin; polymyxin; chloramphenicol; gentamycin; nhỏ tai 2–4 lần/ngày")],
    { notes: ["Có thể phối hợp steroid. Dung dịch acid acetic 1,5% có thể dùng nếu nhiễm Pseudomonas.", "Kháng sinh đường toàn thân chỉ dùng trong các đợt cấp và phải rất hạn chế; không nêu tên thuốc/liều. Không nên dùng kháng sinh không đúng chỉ định."] }),
];
