/*
  FILE: data/antibiotics/empiric/rationale-other.ts

  Tang 3 – tieu chi "Vì sao chọn phác đồ này?" cho cac nhanh lay tu van ban BYT khac QĐ 708
  (5643, 5642, 3429, 1530, 162, 315, 4416). Doi chieu nguyen van ban PDF da tai (so trang trong `sources`).
  Khong them thuoc/lieu. Khoa `branches` = chuoi scenario chinh xac.
*/

import type { ClinicalCriterion } from "./rationale";
import type { DiseaseRationale } from "./rationale-708";

export const pickBranches = (d: DiseaseRationale, keys: string[]): DiseaseRationale =>
  ({ ...d, branches: Object.fromEntries(keys.map((k) => [k, d.branches[k]])) });

/* ================= QĐ 5643/QĐ-BYT (2015) – Tai Mũi Họng ================= */
const TMH = (loc: string) => `QĐ 5643/QĐ-BYT (2015) – ${loc}`;

const SINUS_KEY = {
  base: "Viêm mũi xoang cấp nhiễm khuẩn, thể trung bình, không dùng kháng sinh gần đây (4–6 tuần)",
  allergy: "Viêm mũi xoang cấp – người lớn dị ứng beta-lactam (thể trung bình, không dùng kháng sinh gần đây)",
  recent: "Viêm mũi xoang cấp – người lớn đã dùng kháng sinh gần đây hoặc bệnh chưa ở mức nguy hiểm",
  recentAllergy: "Viêm mũi xoang cấp – người lớn dị ứng beta-lactam đã dùng kháng sinh gần đây",
};
const SINUSITIS: DiseaseRationale = {
  common: [
    { condition: "Nhiễm virus hô hấp trên sau 5–7 ngày nặng lên hoặc kéo dài hơn 10 ngày; đau, sưng vùng mặt, ngạt mũi, chảy mủ mũi.",
      clinicalMeaning: "Gợi ý viêm mũi xoang cấp do vi khuẩn; tác nhân phổ biến: S. pneumoniae, H. influenzae, M. catarrhalis. Khoảng 25% phế cầu kháng penicilin; 30% H. influenzae và hầu hết M. catarrhalis tiết beta-lactamase.",
      treatmentImplication: "Chọn kháng sinh theo mức độ nặng và việc đã dùng kháng sinh trong 4–6 tuần gần đây.",
      sources: [TMH("Viêm mũi xoang cấp tính, mục 2.1, 3.1.1, 4.2.1; tr. 108, 111")] },
  ],
  reassessment: [
    "Thất bại sau 72 giờ: đánh giá lại, đổi phác đồ; cân nhắc CT, nội soi mũi và nuôi cấy.",
    "Thể nặng: điều trị 10–14 ngày. Kèm rửa mũi, corticoid xịt mũi; phẫu thuật khi điều trị nội khoa 4–6 tuần không kết quả.",
  ],
  branches: {
    [SINUS_KEY.base]: [
      { condition: "Thể trung bình, không dùng kháng sinh trong 4–6 tuần gần đây.",
        treatmentImplication: "Amoxicilin-clavulanat, hoặc cefpodoxim, cefuroxim, cefdinir.",
        sources: [TMH("Viêm mũi xoang cấp tính, mục 4.2.1; tr. 111")] },
    ],
    [SINUS_KEY.allergy]: [
      { condition: "Người lớn dị ứng beta-lactam, thể trung bình, không dùng kháng sinh gần đây.",
        clinicalMeaning: "Tỉ lệ thất bại với kháng sinh không phải beta-lactam có thể tới 25%.",
        treatmentImplication: "TMP/SMX, doxycyclin hoặc macrolid (trẻ em: TMP/SMX hoặc macrolid).",
        sources: [TMH("Viêm mũi xoang cấp tính, mục 4.2.1; tr. 111")] },
    ],
    [SINUS_KEY.recent]: [
      { condition: "Đã dùng kháng sinh gần đây, hoặc bệnh chưa ở mức nguy hiểm.",
        clinicalMeaning: "Nguy cơ vi khuẩn kháng thuốc cao hơn.",
        treatmentImplication: "Người lớn: quinolon hô hấp, amoxicilin-clavulanat, ceftriaxon hoặc kết hợp kháng sinh phổ rộng. Trẻ em: amoxicilin-clavulanat, ceftriaxon.",
        sources: [TMH("Viêm mũi xoang cấp tính, mục 4.2.1; tr. 111")] },
    ],
    [SINUS_KEY.recentAllergy]: [
      { condition: "Người lớn dị ứng beta-lactam, đã dùng kháng sinh gần đây.",
        treatmentImplication: "Quinolon hô hấp, hoặc clindamycin và rifampin (trẻ em: TMP/SMX, macrolid hoặc clindamycin).",
        sources: [TMH("Viêm mũi xoang cấp tính, mục 4.2.1; tr. 111")] },
    ],
  },
};

const PHARYNGITIS: DiseaseRationale = {
  branches: {
    "Viêm họng đỏ cấp ở bệnh nhân > 3 tuổi (điều trị như viêm họng do liên cầu khi không có xét nghiệm định loại)": [
      { condition: "Viêm họng đỏ cấp đơn thuần ở người trên 3 tuổi, chưa có xét nghiệm định loại virus hoặc vi khuẩn.",
        clinicalMeaning: "Virus chiếm 60–80%, vi khuẩn 20–40%; nguy hiểm nhất là liên cầu tan huyết nhóm A (biến chứng viêm thận, viêm khớp, viêm tim).",
        treatmentImplication: "Điều trị như viêm họng do liên cầu: beta-lactam hoặc nhóm khác (amoxicilin, cephalexin, erythromycin, clarithromycin).",
        sources: [TMH("Viêm họng cấp tính, mục 2.1, 4.1, 4.2.1, 5; tr. 155, 157–158")] },
      { condition: "Viêm họng đỏ cấp thể nặng hoặc đã có biến chứng (áp xe quanh amiđan, áp xe khoang bên họng…).",
        treatmentImplication: "Chuyển chuyên khoa kịp thời.",
        sources: [TMH("Viêm họng cấp tính, mục 4.2.3, 5; tr. 158")] },
    ],
  },
};

const OTITIS: DiseaseRationale = {
  branches: {
    "Viêm tai giữa cấp tính trẻ em (chương BYT dành cho trẻ em; chưa có nhánh người lớn)": [
      { condition: "Viêm tai giữa cấp ở trẻ em: đau tai, sốt cao, màng nhĩ đỏ hoặc phồng.",
        clinicalMeaning: "Bệnh cấp tính ảnh hưởng toàn thân, đe dọa biến chứng (viêm xương chũm, biến chứng nội sọ).",
        treatmentImplication: "Kháng sinh phổ rộng nhóm beta-lactam, cephalosporin, macrolid; tốt nhất theo kháng sinh đồ. Phối hợp kháng viêm và dẫn lưu tại chỗ.",
        sources: [TMH("Viêm tai giữa cấp tính trẻ em, mục 4.1, 4.3.3, 5.2; tr. 212, 214")] },
      { condition: "Màng nhĩ chưa thủng, có mủ hòm nhĩ hoặc triệu chứng toàn thân xấu, kéo dài trên 4 ngày.",
        treatmentImplication: "Chích rạch màng nhĩ để dẫn lưu; sau thủng: làm thuốc tai hằng ngày.",
        sources: [TMH("Viêm tai giữa cấp tính trẻ em, mục 4.3.1, 4.3.2; tr. 213")] },
    ],
  },
  reassessment: ["Sau 4 tuần vẫn chảy mủ: tìm viêm mũi xoang, viêm VA, viêm xương chũm, thể trạng suy nhược."],
};
const OTITIS_ADULT: DiseaseRationale = {
  ...OTITIS,
  common: [
    { condition: "CẦN THẨM ĐỊNH – áp dụng cho người lớn.",
      clinicalMeaning: "Bài nguồn chỉ dành cho trẻ em; mặt bệnh này đang dùng tạm nội dung của trẻ em.",
      sources: [TMH("Viêm tai giữa cấp tính trẻ em; tr. 210")] },
  ],
};

const DEEP_NECK: DiseaseRationale = {
  branches: {
    "Nhiễm trùng/áp xe khoang cổ sâu: kháng sinh phổ rộng, đường tĩnh mạch, liều cao (khoang sau hầu và khoang quanh amiđan thuộc các khoang cổ sâu theo mục 1)": [
      { condition: "Nhiễm trùng hoặc áp xe khoang cổ sâu (gồm khoang quanh amiđan, khoang sau hầu).",
        clinicalMeaning: "Đa vi khuẩn: hiếu khí (H. influenzae, S. pneumoniae, Klebsiella…) và kỵ khí (Peptostreptococcus, Fusobacterium, Bacteroides); Gram âm ở người già, đái tháo đường, suy giảm miễn dịch.",
        treatmentImplication: "Kháng sinh phổ rộng, tĩnh mạch, liều cao: cephalosporin thế hệ 3 kết hợp metronidazol.",
        sources: [TMH("Nhiễm trùng khoang cổ sâu, mục 1, 3, 5.2; tr. 254–256")] },
      { condition: "Khó thở do tắc nghẽn đường hô hấp trên.",
        treatmentImplication: "Bảo đảm đường thở trước (đặt nội khí quản hoặc mở khí quản).",
        sources: [TMH("Nhiễm trùng khoang cổ sâu, mục 5.1; tr. 255")] },
    ],
  },
  reassessment: [
    "Không cải thiện sau 24–48 giờ: làm lại hình ảnh học và rạch dẫn lưu.",
    "Điều chỉnh thuốc, liều, thời gian theo đáp ứng (sốt, sưng, mủ) và kháng sinh đồ.",
  ],
};

/* ================= QĐ 5642/QĐ-BYT (2015) – Truyền nhiễm ================= */
const TN = (loc: string) => `QĐ 5642/QĐ-BYT (2015) – ${loc}`;
const VMN5642 = (loc: string) => TN(`Viêm màng não nhiễm khuẩn, ${loc}`);
const T19 = VMN5642("mục 4.2a, bảng kháng sinh theo lứa tuổi; tr. 19");
const MEN_COMMON: ClinicalCriterion[] = [
  { condition: "Sốt và hội chứng màng não; chưa có kết quả vi sinh.",
    clinicalMeaning: "Bệnh cấp cứu. Tại Việt Nam: trẻ em hay gặp Hib, phế cầu, não mô cầu; người lớn hay gặp liên cầu (đặc biệt S. suis), phế cầu, não mô cầu. Listeria gặp ở trẻ sơ sinh, phụ nữ có thai, người già.",
    treatmentImplication: "Kháng sinh kịp thời theo phác đồ kinh nghiệm theo lứa tuổi, cơ địa; đổi theo kháng sinh đồ. Chọn ampicilin khi nghi Listeria.",
    sources: [VMN5642("mục 2, 4.1; tr. 17–18"), T19] },
];
const MEN_REASSESS = [
  "Có nhuộm Gram: cầu khuẩn Gram dương – ceftriaxon hoặc cefotaxim + vancomycin; song cầu Gram âm – penicilin G hoặc ceftriaxon; trực khuẩn Gram dương – ampicilin + aminoglycosid; trực khuẩn Gram âm – ceftriaxon + aminoglycosid.",
  "Có kết quả cấy: theo kháng sinh đồ. Không có kết quả cấy hoặc không cải thiện: xét nghiệm lại dịch não tủy sau 48 giờ; không cải thiện thì đổi phác đồ thay thế.",
  "Thời gian: não mô cầu 7 ngày, Hib 10 ngày, phế cầu 14 ngày; trực khuẩn, kỵ khí Gram âm, liên cầu, tụ cầu 3 tuần; hoặc 10–14 ngày và hết sốt 3 ngày.",
];
const row = (condition: string, meaning: string, implication: string): ClinicalCriterion[] =>
  [{ condition, clinicalMeaning: meaning, treatmentImplication: implication, sources: [T19] }];
const MEN_ADULT_5642: DiseaseRationale = {
  common: MEN_COMMON,
  reassessment: MEN_REASSESS,
  branches: {
    "Viêm màng não 18–50 tuổi (phế cầu, liên cầu, não mô cầu)":
      row("Người lớn 18–50 tuổi.", "Căn nguyên: phế cầu, liên cầu, não mô cầu.", "Ưu tiên ceftriaxon (hoặc cefotaxim); thay thế: vancomycin + ceftriaxon (hoặc cefotaxim)."),
    "Viêm màng não trên 50 tuổi (phế cầu, não mô cầu, Listeria, kị khí Gram âm)":
      row("Người lớn trên 50 tuổi.", "Căn nguyên: phế cầu, não mô cầu, Listeria, kỵ khí Gram âm.", "Ưu tiên ceftriaxon (hoặc cefotaxim); thay thế: ampicilin + ceftriaxon (hoặc cefotaxim) khi nghi Listeria."),
    "Viêm màng não ở người suy giảm miễn dịch (phế cầu, não mô cầu, Listeria, kị khí Gram âm)":
      row("Người bệnh suy giảm miễn dịch.", "Căn nguyên: phế cầu, não mô cầu, Listeria, kỵ khí Gram âm; cơ địa này thường bệnh cảnh nặng hơn.", "Ưu tiên ampicilin + ceftazidim; thay thế: vancomycin + ampicilin + ceftazidim."),
    "Viêm màng não sau chấn thương, phẫu thuật, dò dịch não tủy (phế cầu, tụ cầu, kị khí Gram âm)":
      row("Sau chấn thương, phẫu thuật sọ não, dò dịch não tủy.", "Căn nguyên: phế cầu, tụ cầu, kỵ khí Gram âm.", "Ưu tiên ceftazidim + vancomycin; thay thế ghi meropenem. Hội chẩn ngoại khoa khi có khuyết tật, biến chứng."),
  },
};
const MEN_CHILD_5642: DiseaseRationale = {
  common: MEN_COMMON,
  reassessment: MEN_REASSESS,
  branches: {
    "Viêm màng não 1–3 tháng tuổi (HI, phế cầu, não mô cầu, S. agalactiae, E. coli, Listeria)":
      row("Trẻ 1–3 tháng tuổi.", "Căn nguyên: Hib, phế cầu, não mô cầu, S. agalactiae, E. coli, Listeria.", "Ưu tiên ampicilin + ceftriaxon (hoặc cefotaxim); thay thế: vancomycin + ceftriaxon (hoặc cefotaxim)."),
    "Viêm màng não 3 tháng – 18 tuổi (HI, phế cầu, não mô cầu)":
      row("Trẻ 3 tháng – 18 tuổi.", "Căn nguyên: Hib, phế cầu, não mô cầu.", "Ưu tiên ceftriaxon (hoặc cefotaxim); thay thế: vancomycin + ceftriaxon (hoặc cefotaxim)."),
  },
};

const TYPHOID: DiseaseRationale = {
  common: [
    { condition: "Sốt tăng dần hình cao nguyên, mạch nhiệt phân ly, lưỡi quay, bụng chướng, phân vàng bí ngô.",
      clinicalMeaning: "Do S. Typhi (trực khuẩn Gram âm); nhiều biến chứng nặng: xuất huyết tiêu hóa, thủng ruột, viêm cơ tim, viêm não. Đã kháng ampicilin, amoxicilin, chloramphenicol, co-trimoxazol.",
      treatmentImplication: "Dùng kháng sinh còn hiệu lực: fluoroquinolon hoặc cephalosporin thế hệ 3; có thể dùng azithromycin.",
      sources: [TN("Bệnh thương hàn, mục 1, 3.3, 4.2; tr. 38–41")] },
  ],
  reassessment: [
    "Thời gian: 5–7 ngày, hoặc 10–14 ngày nếu có biến chứng. Tái phát: điều trị lại theo phác đồ.",
    "Thể nặng (viêm não, viêm cơ tim, sốc): corticoid liều cao; phát hiện sớm thủng ruột, xuất huyết tiêu hóa.",
  ],
  branches: {
    "Thương hàn – điều trị đặc hiệu": [
      { condition: "Thương hàn cần điều trị đặc hiệu.",
        treatmentImplication: "Ciprofloxacin hoặc ofloxacin; hoặc cefotaxim, ceftriaxon; azithromycin là lựa chọn khác.",
        sources: [TN("Bệnh thương hàn, mục 4.2; tr. 41")] },
    ],
    "Thương hàn – người mang vi khuẩn mạn tính": [
      { condition: "Người mang vi khuẩn mạn tính (không triệu chứng, vi khuẩn đào thải qua phân).",
        clinicalMeaning: "Vi khuẩn khu trú ở đường mật, mô lympho ruột, có thể kéo dài hàng năm.",
        treatmentImplication: "Ampicilin hoặc amoxicilin + probenecid (3 tháng), hoặc co-trimoxazol (3 tháng), hoặc ciprofloxacin (4 tuần).",
        sources: [TN("Bệnh thương hàn, mục 4.4, 5.7; tr. 41–42")] },
    ],
  },
};

const SHIGELLA: DiseaseRationale = {
  common: [
    { condition: "Hội chứng lỵ: đau quặn bụng, mót rặn, phân nhầy máu; sốt cao.",
      clinicalMeaning: "Do Shigella (Gram âm); S. dysenteriae 1 gây dịch, tử vong 10–30%. Kháng sinh sớm giúp hồi phục và giảm thải vi khuẩn.",
      treatmentImplication: "Kháng sinh sớm theo tính nhạy cảm của Shigella; bồi phụ nước điện giải kịp thời.",
      sources: [TN("Bệnh lỵ trực khuẩn, mục 1, 4.1, 4.2b; tr. 44, 46")] },
  ],
  reassessment: ["Thời gian 5 ngày. Theo dõi mạch, huyết áp, nước tiểu để điều chỉnh dịch.", "Thông báo dịch, phòng lây nhiễm theo quy định."],
  branches: {
    "Lỵ trực khuẩn (Shigella)": [
      { condition: "Lỵ trực khuẩn – lựa chọn khuyến cáo hiện nay.",
        treatmentImplication: "Fluoroquinolon: ciprofloxacin, pefloxacin, ofloxacin hoặc levofloxacin.",
        sources: [TN("Bệnh lỵ trực khuẩn, mục 4.2b; tr. 46")] },
      { condition: "Nơi vi khuẩn còn nhạy ampicilin và co-trimoxazol (Biseptol).",
        treatmentImplication: "Ampicilin hoặc trimethoprim-sulfamethoxazol.",
        sources: [TN("Bệnh lỵ trực khuẩn, mục 4.2b; tr. 46")] },
    ],
  },
};

/* ================= QĐ 3429/QĐ-BYT (2021) – Nhiễm nấm xâm lấn ================= */
/* Doi chieu ban dang lai tren vnras.com (ma bam khac ban .gov.vn da ghi trong evidence.ts). */
const NAM = (loc: string) => `QĐ 3429/QĐ-BYT (2021) – ${loc} [đối chiếu bản đăng lại vnras.com]`;
const C_SEP = NAM("mục 4.1.1a; tr. 49–50");
const C_EMP = NAM("mục 4.1.1b; tr. 51–52");
const CANDIDA_COMMON: ClinicalCriterion[] = [
  { condition: "Nhiễm Candida xâm lấn (máu đơn độc, máu kèm xâm lấn mô sâu, hoặc mô sâu cấy máu âm tính).",
    clinicalMeaning: "Điều trị đặc hiệu khi chẩn đoán chắc chắn; điều trị kinh nghiệm khi chẩn đoán \"nhiều khả năng\" hoặc \"có thể\".",
    treatmentImplication: "Echinocandin là lựa chọn ưu tiên; làm kháng nấm đồ với azole cho mọi chủng phân lập được.",
    sources: [NAM("mục 4.1, 4.1.1; tr. 49")] },
];
const CANDIDA_REASSESS = [
  "Thời gian: 2 tuần sau khi cấy máu âm tính và cải thiện triệu chứng (nhóm giảm bạch cầu: kèm cải thiện bạch cầu).",
  "Khám mắt tìm nhiễm nấm hắc mạc; nghi Candida máu liên quan catheter: rút catheter sớm (nhóm giảm bạch cầu: cân nhắc từng trường hợp).",
  "Xấu đi khi đang điều trị: loại trừ căn nguyên mới, rồi điều trị cứu cánh (đổi nhóm thuốc, giảm ức chế miễn dịch, phẫu thuật).",
];
const candidemiaNoNeutro: ClinicalCriterion[] = [
  { condition: "Candida máu đơn độc; không giảm bạch cầu hạt, không ghép tế bào gốc tạo máu.",
    treatmentImplication: "Ưu tiên caspofungin, micafungin hoặc anidulafungin; fluconazol thay thế khi không nặng và chủng không kháng fluconazol; amphotericin B dạng lipid khi không dung nạp hoặc kháng thuốc khác.",
    sources: [C_SEP] },
];
const candidemiaStepDown: ClinicalCriterion[] = [
  { condition: "Lâm sàng ổn định, chủng nhạy fluconazol, cấy máu sau điều trị khởi đầu âm tính.",
    treatmentImplication: "Xuống thang từ echinocandin (thường sau 7 ngày) hoặc amphotericin B sang fluconazol; C. glabrata: fluconazol liều cao hoặc voriconazol; C. krusei: voriconazol.",
    sources: [C_SEP] },
];
const candidemiaNeutro: ClinicalCriterion[] = [
  { condition: "Candida máu ở người giảm bạch cầu hạt hoặc ghép tế bào gốc tạo máu.",
    clinicalMeaning: "Nguồn nhiễm thường không phải catheter tĩnh mạch trung tâm.",
    treatmentImplication: "Ưu tiên echinocandin; thay thế amphotericin B dạng lipid; fluconazol khi không nặng và không kháng; xuống thang fluconazol hoặc voriconazol khi ổn định.",
    sources: [C_SEP, NAM("mục 4.1.1a; tr. 51")] },
];
const suspectedInvasive: ClinicalCriterion[] = [
  { condition: "Không có bệnh máu ác tính; một hay nhiều bệnh phẩm không vô trùng cấy ra Candida, Candida Score ≥ 3 và/hoặc thỏa yếu tố Ostrosky-Zeichner, kèm lâm sàng gợi ý.",
    treatmentImplication: "Ưu tiên echinocandin; fluconazol thay thế nếu chưa dùng azole và không có Candida cư trú kháng azole; amphotericin B dạng lipid khi không dung nạp.",
    sources: [C_EMP] },
];
const CANDIDEMIA: DiseaseRationale = {
  common: CANDIDA_COMMON,
  reassessment: CANDIDA_REASSESS,
  branches: {
    "Candida máu đơn độc – không giảm bạch cầu hạt, không ghép tế bào gốc": candidemiaNoNeutro,
    "Candida máu đơn độc – xuống thang điều trị": candidemiaStepDown,
    "Nghi nhiễm Candida xâm lấn, không có bệnh máu ác tính (Candida Score ≥ 3 và/hoặc yếu tố Ostrosky-Zeichner)": suspectedInvasive,
    "Nghi nhiễm Candida xâm lấn, không có bệnh máu ác tính": suspectedInvasive,
  },
};
const CANDIDA_ABDOMEN: DiseaseRationale = {
  common: [
    { condition: "Nguy cơ nhiễm Candida và bằng chứng nhiễm trùng ổ bụng (phẫu thuật ổ bụng gần đây, rò, viêm tụy hoại tử).",
      treatmentImplication: "Thuốc chống nấm như Candida máu hoặc như điều trị kinh nghiệm ở bệnh nhân ICU không giảm bạch cầu; kết hợp kiểm soát nguồn, dẫn lưu, làm sạch ổ bụng.",
      sources: [NAM("mục 4.1.2b; tr. 53–54")] },
    ...CANDIDA_COMMON,
  ],
  reassessment: ["Thời gian dựa vào kiểm soát nguồn lây và đáp ứng lâm sàng."],
  branches: {
    "Candida máu đơn độc – không giảm bạch cầu hạt, không ghép tế bào gốc": candidemiaNoNeutro,
    "Nghi nhiễm Candida xâm lấn, không có bệnh máu ác tính (Candida Score ≥ 3 và/hoặc yếu tố Ostrosky-Zeichner)": suspectedInvasive,
    "Nghi nhiễm Candida xâm lấn, không có bệnh máu ác tính": suspectedInvasive,
  },
};
const CANDIDEMIA_NEUTRO: DiseaseRationale = {
  common: CANDIDA_COMMON,
  reassessment: CANDIDA_REASSESS,
  branches: { "Candida máu – có giảm bạch cầu hạt hoặc ghép tế bào gốc tạo máu": candidemiaNeutro },
};
const CANDIDA_ENDO: DiseaseRationale = {
  common: CANDIDA_COMMON,
  reassessment: ["Tiếp tục ít nhất 6 tuần sau phẫu thuật thay van; dài hơn nếu áp xe van hoặc biến chứng.", "Không thể thay van: kéo dài fluconazol."],
  branches: {
    "Viêm nội tâm mạc do Candida – điều trị ban đầu": [
      { condition: "Viêm nội tâm mạc do Candida, van tự nhiên – giai đoạn đầu.",
        treatmentImplication: "Amphotericin B dạng lipid (có hoặc không flucytosin), hoặc echinocandin liều cao.",
        sources: [NAM("mục 4.1.2c, Bảng 4.3; tr. 54")] },
      { condition: "CẦN THẨM ĐỊNH – đường dùng echinocandin.",
        clinicalMeaning: "Bảng 4.3 ghi \"echinocandin đường uống liều cao\"; caspofungin, micafungin, anidulafungin là thuốc tiêm truyền.",
        sources: [NAM("Bảng 4.3; tr. 54")] },
    ],
    "Viêm nội tâm mạc do Candida – điều trị duy trì": [
      { condition: "Lâm sàng ổn định, cấy máu âm tính.",
        treatmentImplication: "Fluconazol nếu chủng nhạy; voriconazol hoặc posaconazol nếu chủng không nhạy fluconazol.",
        sources: [NAM("mục 4.1.2c, Bảng 4.3; tr. 54")] },
    ],
  },
};
const CANDIDA_BONE: DiseaseRationale = {
  common: CANDIDA_COMMON,
  reassessment: ["Duy trì fluconazol 6–12 tháng.", "Phẫu thuật tháo khớp, dẫn lưu, tháo khớp giả trong mọi trường hợp viêm khớp hoại tử."],
  branches: {
    "Nhiễm Candida cơ xương khớp": [
      { condition: "Nhiễm Candida cơ xương khớp.",
        treatmentImplication: "Fluconazol 6–12 tháng, hoặc echinocandin ít nhất 2 tuần rồi chuyển fluconazol; thay thế amphotericin B dạng lipid.",
        sources: [NAM("mục 4.1.2d, Bảng 4.4; tr. 54")] },
    ],
  },
};

const ASP = (loc: string) => NAM(`Nhiễm Aspergillus xâm lấn, ${loc}`);
const ASP_COMMON: ClinicalCriterion[] = [
  { condition: "Nhiễm Aspergillus phổi xâm lấn (khoảng 85% các trường hợp xâm lấn).",
    clinicalMeaning: "Lựa chọn thuốc khác nhau theo tình trạng giảm bạch cầu hạt và ghép tế bào gốc tạo máu.",
    treatmentImplication: "Azole (voriconazol, isavuconazol) là lựa chọn ưu tiên; echinocandin không phải lựa chọn đầu tiên. Không dùng fluconazol khi nghi nấm sợi.",
    sources: [ASP("mục 4.2, 4.2.1a; tr. 55–56"), NAM("mục 4.1.1c; tr. 53")] },
];
const ASP_REASSESS = [
  "Thời gian tối thiểu 6–12 tuần; dài hơn tùy mức độ ức chế miễn dịch, cơ quan nhiễm, đáp ứng lâm sàng và hình ảnh.",
  "Theo dõi galactomannan huyết thanh; định lượng nồng độ voriconazol, itraconazol, posaconazol, isavuconazol.",
  "Hạn chế yếu tố làm nặng suy giảm miễn dịch; ho máu đe dọa tính mạng: nút mạch hoặc phẫu thuật.",
];
const aspNoNeutro: ClinicalCriterion[] = [
  { condition: "Không giảm bạch cầu hạt, không ghép tế bào gốc tạo máu.",
    treatmentImplication: "Ưu tiên voriconazol hoặc isavuconazol; thay thế amphotericin B liposomal; caspofungin khi chống chỉ định azole.",
    sources: [ASP("mục 4.2.1a; tr. 55–56")] },
];
const aspNeutro: ClinicalCriterion[] = [
  { condition: "Giảm bạch cầu hạt, không ghép tế bào gốc.",
    treatmentImplication: "Ưu tiên isavuconazol.",
    sources: [ASP("mục 4.2.1a, Bảng 4.6; tr. 56–57")] },
];
const aspHsct: ClinicalCriterion[] = [
  { condition: "Ghép tế bào gốc khác loài (có hoặc không giảm bạch cầu hạt) và nhóm khác không giảm bạch cầu hạt.",
    treatmentImplication: "Theo thứ tự ưu tiên giảm dần: voriconazol; amphotericin B liposomal; voriconazol + anidulafungin; caspofungin hoặc itraconazol; amphotericin B phức hợp lipid hoặc deoxycholat.",
    sources: [ASP("mục 4.2.1a; tr. 56")] },
];
const aspEmpiric: ClinicalCriterion[] = [
  { condition: "Bệnh máu ác tính có hóa trị hoặc ghép tế bào gốc, giảm bạch cầu hạt, sốt > 38 °C, kháng sinh tiêm 96 giờ không cải thiện; hoặc nhóm nguy cơ chọn lọc có tổn thương phổi mới, không đáp ứng kháng sinh.",
    clinicalMeaning: "Điều trị kinh nghiệm giúp điều trị sớm, tăng khả năng thành công.",
    treatmentImplication: "Thứ tự: voriconazol; amphotericin B (liposomal, phức hợp lipid, deoxycholat); itraconazol; caspofungin; micafungin. Nhóm nguy cơ chọn lọc: voriconazol đầu tay, amphotericin B thay thế.",
    sources: [ASP("mục 4.2.1b; tr. 57–58")] },
];
const ASPERGILLUS: DiseaseRationale = {
  common: ASP_COMMON,
  reassessment: ASP_REASSESS,
  branches: {
    "Aspergillus phổi xâm lấn – không giảm BC hạt, không ghép TBG": aspNoNeutro,
    "Aspergillus phổi xâm lấn – giảm bạch cầu hạt, không ghép tế bào gốc": aspNeutro,
    "Aspergillus phổi xâm lấn – ghép TBG khác loài (có/không giảm BC hạt) và nhóm khác không giảm BC hạt (ưu tiên giảm dần)": aspHsct,
    "Nghi Aspergillus phổi xâm lấn – điều trị kinh nghiệm (bệnh máu ác tính/ghép TBG có giảm BC hạt, hoặc nhóm nguy cơ chọn lọc)": aspEmpiric,
  },
};
const ASP_SINUS: DiseaseRationale = {
  branches: {
    "Aspergillus xâm lấn xoang mũi": [
      { condition: "Aspergillus xâm lấn xoang mũi.",
        treatmentImplication: "Như nhiễm Aspergillus thần kinh trung ương (voriconazol); thay thế amphotericin B liposomal; phẫu thuật cắt u nấm.",
        sources: [ASP("mục 4.2.2b, Bảng 4.7; tr. 59–60")] },
    ],
  },
  reassessment: ASP_REASSESS,
};
const HEME: DiseaseRationale = {
  common: [
    { condition: "Người bệnh máu ác tính hoặc ghép tế bào gốc tạo máu.",
      clinicalMeaning: "Nguy cơ cao nhiễm Candida và Aspergillus xâm lấn; lựa chọn khác nhau theo nhóm.",
      sources: [NAM("mục 4.1.1, 4.2.1; tr. 50–59")] },
  ],
  reassessment: ["Không cải thiện sau 3–5 ngày điều trị kinh nghiệm: cân nhắc amphotericin B liposomal.", ...ASP_REASSESS.slice(0, 2)],
  branches: {
    "Candida máu – có giảm bạch cầu hạt hoặc ghép tế bào gốc tạo máu": candidemiaNeutro,
    "Bệnh máu ác tính/ghép TBG, sốt > 38 °C, giảm BC hạt, KS không uống > 96 giờ – đã điều trị/dự phòng kháng nấm hoặc có dấu tổn thương cơ quan": [
      { condition: "Sốt và giảm bạch cầu, kháng sinh không uống > 96 giờ; đã điều trị hoặc dự phòng kháng nấm, hoặc có tổn thương cơ quan.",
        treatmentImplication: "Echinocandin (caspofungin, micafungin, anidulafungin); không cải thiện sau 3–5 ngày: amphotericin B liposomal.",
        sources: [C_EMP] },
    ],
    "Bệnh máu ác tính/ghép TBG, chỉ sốt và giảm BC hạt, chưa dự phòng kháng nấm trước đó": [
      { condition: "Chỉ có sốt và giảm bạch cầu, chưa dự phòng kháng nấm.",
        treatmentImplication: "Fluconazol, posaconazol hoặc voriconazol; không cải thiện sau 3–5 ngày: amphotericin B liposomal.",
        sources: [C_EMP] },
    ],
    "Aspergillus phổi xâm lấn – không giảm BC hạt, không ghép TBG": aspNoNeutro,
    "Aspergillus phổi xâm lấn – giảm bạch cầu hạt, không ghép tế bào gốc": aspNeutro,
    "Aspergillus phổi xâm lấn – ghép TBG khác loài (có/không giảm BC hạt) và nhóm khác không giảm BC hạt (ưu tiên giảm dần)": aspHsct,
    "Nghi Aspergillus phổi xâm lấn – điều trị kinh nghiệm (bệnh máu ác tính/ghép TBG có giảm BC hạt, hoặc nhóm nguy cơ chọn lọc)": aspEmpiric,
    "Dự phòng nấm xâm lấn – bệnh máu ác tính/ghép tủy đồng loài/rối loạn sinh tủy, BC trung tính < 0,5 x 10^9/L kéo dài > 7 ngày": [
      { condition: "Bệnh máu ác tính, ghép tủy đồng loài, rối loạn sinh tủy có bạch cầu trung tính < 0,5 × 10⁹/L kéo dài > 7 ngày.",
        treatmentImplication: "Dự phòng: posaconazol (khuyến cáo A); amphotericin B liposomal khí dung (B); voriconazol hoặc micafungin (C).",
        sources: [ASP("mục 4.2.1c; tr. 59")] },
    ],
  },
};

const CRY = (loc: string) => NAM(`Nhiễm nấm Cryptococcus, ${loc}`);
const CRYPTO_SAFETY: ClinicalCriterion = {
  condition: "Lưu ý chung với Cryptococcus.",
  clinicalMeaning: "Echinocandin không có tác dụng trên Cryptococcus. Phụ nữ có thai: an toàn nhất là amphotericin B dạng lipid; flucytosin và fluconazol > 400 mg/ngày có thể gây dị tật thai.",
  treatmentImplication: "Không chọn echinocandin. Phụ nữ có thai: chọn amphotericin B phức hợp lipid hoặc liposomal; tránh flucytosin và fluconazol > 400 mg/ngày.",
  sources: [CRY("mục 4.3.2, lưu ý; tr. 65")],
};
const CRYPTO_MEN: DiseaseRationale = {
  common: [CRYPTO_SAFETY],
  reassessment: [
    "Tấn công ít nhất 2 tuần; củng cố ít nhất 8 tuần khi lâm sàng cải thiện và cấy lại dịch não tủy âm tính; duy trì ít nhất 1 năm.",
    "Ngừng duy trì khi đủ liệu trình, hết triệu chứng, CD4 ≥ 100 tế bào/mm³ trong ≥ 3 tháng và ART thành công; không ngừng ở trẻ dưới 2 tuổi.",
    "Tăng áp lực nội sọ: dẫn lưu dịch não tủy (chọc tủy sống).",
  ],
  branches: {
    "Viêm màng não Cryptococcus ở người HIV (+) – điều trị tấn công (ít nhất 2 tuần)": [
      { condition: "Viêm màng não do Cryptococcus ở người HIV (+), giai đoạn tấn công.",
        treatmentImplication: "Ưu tiên amphotericin B (deoxycholat hoặc liposomal) kết hợp flucytosin.",
        sources: [CRY("mục 4.3.2a; tr. 63–64")] },
    ],
    "Viêm màng não Cryptococcus ở người HIV (+) – điều trị tấn công, thay thế": [
      { condition: "Không dùng được phác đồ ưu tiên.",
        treatmentImplication: "Amphotericin B phức hợp lipid + flucytosin; hoặc amphotericin B + fluconazol; hoặc fluconazol + flucytosin; hoặc fluconazol liều cao.",
        sources: [CRY("mục 4.3.2a; tr. 64")] },
    ],
    "Viêm màng não Cryptococcus ở người HIV (+) – củng cố và duy trì": [
      { condition: "Sau 2 tuần tấn công thành công (lâm sàng cải thiện, cấy lại dịch não tủy âm tính).",
        treatmentImplication: "Củng cố: fluconazol (thay thế itraconazol); duy trì: fluconazol liều thấp ít nhất 1 năm.",
        sources: [CRY("mục 4.3.2a; tr. 64")] },
    ],
    "Cryptococcus ở người HIV (−) có giảm miễn dịch, tổn thương thần kinh trung ương hoặc tổn thương phổi/ngoài phổi nặng – điều trị tấn công": [
      { condition: "HIV (−) có giảm miễn dịch, hoặc tổn thương thần kinh trung ương, hoặc tổn thương phổi/ngoài phổi nặng.",
        treatmentImplication: "Tấn công amphotericin B (một dạng) + flucytosin 2 tuần; dịch não tủy âm tính thì chuyển fluconazol hoặc itraconazol 8 tuần; duy trì fluconazol.",
        sources: [CRY("mục 4.3.1b; tr. 62–63")] },
    ],
  },
};
const CRYPTO_EXTRA: DiseaseRationale = {
  common: [CRYPTO_SAFETY],
  branches: {
    "Cryptococcus ngoài thần kinh trung ương – người HIV (−) không giảm miễn dịch, thể nhẹ (phổi hoặc 1 ổ ngoài phổi)": [
      { condition: "HIV (−), không giảm miễn dịch, không tổn thương thần kinh trung ương, bệnh nhẹ (1 ổ) hoặc cấy dương tính không triệu chứng.",
        treatmentImplication: "Fluconazol hoặc itraconazol uống 6 tháng; amphotericin B khi chống chỉ định azole. Không cải thiện sau 2 tuần: chuyển phác đồ có amphotericin B.",
        sources: [CRY("mục 4.3.1a; tr. 62")] },
    ],
    "Cryptococcus ngoài thần kinh trung ương ở người HIV (+)": [
      { condition: "HIV (+), nhiễm ngoài phổi hoặc tổn thương phổi lan tỏa, không tổn thương thần kinh trung ương.",
        treatmentImplication: "Điều trị như có tổn thương thần kinh trung ương. Tổn thương phổi một ổ, có kháng nguyên trong máu: fluconazol 12 tháng.",
        sources: [CRY("mục 4.3.2b, 4.3.2c; tr. 64–65")] },
    ],
  },
};

const OTHER_FUNGI = (key: string, condition: string, implication: string, loc: string, reassess?: string[]): DiseaseRationale =>
  ({ branches: { [key]: [{ condition, treatmentImplication: implication, sources: [NAM(loc)] }] }, reassessment: reassess });
const MUCOR = OTHER_FUNGI("Mucormycosis (Zygomyces)", "Nhiễm nấm Zygomyces (Mucormycosis).",
  "Ban đầu: amphotericin B dạng lipid hoặc deoxycholat; thay thế: posaconazol.", "mục 4.7; tr. 68",
  ["Bài không quy định thời gian điều trị."]);
const HISTO = OTHER_FUNGI("Histoplasma phổi cấp mức độ trung bình–nặng", "Histoplasma phổi cấp mức độ trung bình đến nặng.",
  "Amphotericin B dạng lipid 1–2 tuần, sau đó itraconazol (tổng 12 tuần); thay thế amphotericin B deoxycholat khi nguy cơ độc thận thấp. Có biến chứng hô hấp: thêm methylprednisolon 1–2 tuần đầu.",
  "mục 4.6.2; tr. 67", ["Định lượng nồng độ itraconazol sau ít nhất 2 tuần điều trị."]);
const TALARO: DiseaseRationale = {
  common: [
    { condition: "Nhiễm Talaromyces marneffei; phân độ: nặng (nhiều cơ quan + suy hô hấp hoặc tuần hoàn), trung bình (nhiều cơ quan), nhẹ (chỉ da).",
      treatmentImplication: "Bắt đầu kháng nấm ngay khi chẩn đoán.",
      sources: [NAM("mục 4.5; tr. 65–66")] },
  ],
  branches: {
    "Talaromyces marneffei mức độ trung bình–nặng": [
      { condition: "Mức độ trung bình đến nặng.",
        treatmentImplication: "Amphotericin B dạng lipid hoặc ABLC 2 tuần, tiếp theo itraconazol 10 tuần. Thể thần kinh trung ương: amphotericin B 4–6 tuần.",
        sources: [NAM("mục 4.5; tr. 66")] },
    ],
    "Talaromyces marneffei – thay thế/thể nhẹ": [
      { condition: "Không dùng được amphotericin B, hoặc thể nhẹ (chỉ tổn thương da).",
        treatmentImplication: "Trung bình–nặng: voriconazol tĩnh mạch rồi uống 12 tuần. Nhẹ: itraconazol uống 8–12 tuần, hoặc voriconazol uống 12 tuần.",
        sources: [NAM("mục 4.5; tr. 66")] },
    ],
  },
};
const PCP: DiseaseRationale = {
  common: [
    { condition: "Người suy giảm miễn dịch có bằng chứng viêm phổi do Pneumocystis jirovecii.",
      treatmentImplication: "Bắt buộc dùng trimethoprim-sulfamethoxazol; thời gian thông thường 3 tuần; cần ít nhất 7–10 ngày mới có đáp ứng.",
      sources: [NAM("mục 4.4; tr. 65")] },
  ],
  reassessment: ["Dùng đường tĩnh mạch: cần định lượng nồng độ sulfamethoxazol hoặc trimethoprim.", "Dự phòng co-trimoxazol theo CD4 và giai đoạn lâm sàng ở người nhiễm HIV."],
  branches: {
    "Viêm phổi do Pneumocystis jirovecii": [
      { condition: "Điều trị chuẩn.", treatmentImplication: "Trimethoprim-sulfamethoxazol chia 4 lần/ngày.", sources: [NAM("mục 4.4; tr. 65")] },
    ],
    "Viêm phổi do Pneumocystis jirovecii – thay thế": [
      { condition: "Không dùng được trimethoprim-sulfamethoxazol.",
        treatmentImplication: "Primaquin + clindamycin; hoặc atovaquon; hoặc pentamidin tĩnh mạch.",
        sources: [NAM("mục 4.4; tr. 65")] },
    ],
    "Pneumocystis ở người HIV, trung bình–nặng có giảm oxy máu (PaO2 < 70 mmHg khí trời hoặc A-a > 35 mmHg)": [
      { condition: "Người HIV, mức độ trung bình–nặng: PaO2 < 70 mmHg khí trời hoặc chênh áp oxy phế nang – động mạch > 35.",
        treatmentImplication: "Thêm prednison theo phác đồ giảm liều của nguồn.",
        sources: [NAM("mục 4.4; tr. 65")] },
      { condition: "CẦN THẨM ĐỊNH – mốc kết thúc prednison.",
        clinicalMeaning: "Bản đăng lại ghi \"20 mg/ngày đến ngày thứ 2\" sau giai đoạn ngày 6–11, nhiều khả năng lỗi in; cần đối chiếu bản chính thức.",
        sources: [NAM("mục 4.4; tr. 65")] },
    ],
  },
};

/* ================= QĐ 1530/QĐ-BYT (2023) – Loét bàn chân do đái tháo đường ================= */
const BC = (loc: string) => `QĐ 1530/QĐ-BYT (2023) – ${loc}`;
const PL2 = BC("Phụ lục 02 – Phác đồ kháng sinh theo kinh nghiệm; tr. 32–33");
const MILD = "Nhẹ (Wagner độ 1 hoặc PEDIS giai đoạn 1–2) – ";
const MODSEV = "Trung bình hoặc nặng (Wagner độ 2 trở lên hoặc PEDIS giai đoạn 3 trở lên) – ";
const foot = (condition: string, meaning: string, implication: string): ClinicalCriterion[] =>
  [{ condition, clinicalMeaning: meaning, treatmentImplication: implication, sources: [PL2] }];
const DIABETIC_FOOT: DiseaseRationale = {
  common: [
    { condition: "Nhiễm trùng loét bàn chân đái tháo đường; mức độ theo Wagner hoặc PEDIS.",
      clinicalMeaning: "Kháng sinh ban đầu chọn theo kinh nghiệm để điều trị tác nhân có khả năng gây bệnh mà không dùng phổ rộng không cần thiết.",
      treatmentImplication: "Đường tiêm cho mọi nhiễm trùng nặng và một số trường hợp vừa; chuyển uống khi đã kiểm soát nhiễm trùng và có kết quả cấy.",
      sources: [BC("mục 5.2.1; tr. 25")] },
    { condition: "Có tiền sử nhiễm MRSA, tỷ lệ cấy MRSA cao, hoặc nhiễm trùng nặng.",
      treatmentImplication: "Xem xét kháng sinh kinh nghiệm có hiệu quả trên MRSA.",
      sources: [BC("mục 5.2.1; tr. 25")] },
  ],
  reassessment: [
    "Điều chỉnh theo đáp ứng lâm sàng và kết quả cấy, kháng sinh đồ; đáp ứng kém: cấy lại dịch vết thương.",
    "Tiếp tục đến khi giải quyết nhiễm trùng, thường 2–4 tuần với mô mềm; không cần dùng đến khi vết loét lành hoàn toàn.",
    "Cắt lọc cơ học thường xuyên để phá vỡ màng sinh học.",
  ],
  branches: {
    [`${MILD}không có yếu tố phức tạp (cầu khuẩn Gram dương)`]: foot("Nhiễm trùng nhẹ, không có yếu tố làm nặng.", "Tác nhân: cầu khuẩn Gram dương.", "Penicilin bán tổng hợp kháng penicillinase hoặc cephalosporin thế hệ 1."),
    [`${MILD}dị ứng hoặc không dung nạp β-lactam (cầu khuẩn Gram dương)`]: foot("Nhẹ, dị ứng hoặc không dung nạp beta-lactam.", "Tác nhân: cầu khuẩn Gram dương.", "Clindamycin, fluoroquinolon có hoạt tính tốt trên Gram dương (levofloxacin, moxifloxacin), macrolid hoặc doxycyclin."),
    [`${MILD}sử dụng kháng sinh gần đây (cầu khuẩn Gram dương + trực khuẩn Gram âm)`]: foot("Nhẹ, đã dùng kháng sinh gần đây.", "Tác nhân: cầu khuẩn Gram dương và trực khuẩn Gram âm.", "Beta-lactam nhóm 1 (amoxicilin-clavulanat, ampicilin-sulbactam), TMP/SMX hoặc fluoroquinolon."),
    [`${MILD}nguy cơ cao MRSA`]: foot("Nhẹ, nguy cơ cao MRSA.", "Tác nhân: tụ cầu vàng kháng methicilin.", "Linezolid, TMP/SMX, doxycyclin hoặc macrolid."),
    [`${MODSEV}không có yếu tố phức tạp (cầu khuẩn Gram dương ± trực khuẩn Gram âm)`]: foot("Trung bình hoặc nặng, không có yếu tố làm nặng.", "Tác nhân: cầu khuẩn Gram dương ± trực khuẩn Gram âm.", "Beta-lactam nhóm 1 hoặc cephalosporin thế hệ 2–3."),
    [`${MODSEV}sử dụng kháng sinh gần đây (cầu khuẩn Gram dương ± trực khuẩn Gram âm)`]: foot("Trung bình hoặc nặng, đã dùng kháng sinh gần đây.", "Tác nhân: cầu khuẩn Gram dương ± trực khuẩn Gram âm, nguy cơ kháng cao hơn.", "Beta-lactam nhóm 2 (ticarcilin-clavulanat, piperacilin-tazobactam), cephalosporin thế hệ 3 hoặc carbapenem nhóm 1 (tùy điều trị trước đó)."),
    [`${MODSEV}vết loét ẩm ướt và khí hậu ấm (trực khuẩn Gram âm, gồm Pseudomonas)`]: foot("Vết loét ẩm ướt, khí hậu ấm.", "Tác nhân: trực khuẩn Gram âm, gồm Pseudomonas.", "Beta-lactam nhóm 2; hoặc penicilin bán tổng hợp kháng penicillinase + ceftazidim."),
    [`${MODSEV}chi thiếu máu cục bộ/hoại tử/sinh hơi (cầu khuẩn Gram dương ± trực khuẩn Gram âm ± vi khuẩn kị khí)`]: foot("Chi thiếu máu cục bộ, hoại tử hoặc sinh hơi.", "Có thể có vi khuẩn kỵ khí cùng Gram dương, Gram âm.", "Beta-lactam nhóm 1 hoặc 2, carbapenem, hoặc cephalosporin thế hệ 2–3 kèm clindamycin hoặc metronidazol."),
    [`${MODSEV}yếu tố nguy cơ MRSA`]: foot("Trung bình hoặc nặng, có yếu tố nguy cơ MRSA.", "Phác đồ beta-lactam không bao phủ MRSA.", "Xem xét thêm hoặc thay bằng glycopeptid, linezolid, daptomycin, acid fusidic, TMP/SMX (± rifampicin) hoặc doxycyclin."),
    [`${MODSEV}yếu tố nguy cơ kháng thuốc ở trực khuẩn Gram âm (vi khuẩn sinh ESBL)`]: foot("Nguy cơ trực khuẩn Gram âm kháng thuốc (sinh ESBL).", "Cephalosporin không còn đáng tin cậy với ESBL.", "Carbapenem, fluoroquinolon, hoặc aminoglycosid và colistin."),
  },
};

/* ================= QĐ 162/QĐ-BYT (2024) – Lao ================= */
const LAO = (loc: string) => `QĐ 162/QĐ-BYT (2024) – Hướng dẫn chẩn đoán, điều trị và dự phòng bệnh lao, ${loc}`;
const TB_COMMON: ClinicalCriterion[] = [
  { condition: "Lao không có bằng chứng kháng thuốc và không nghi ngờ kháng thuốc trên lâm sàng.",
    clinicalMeaning: "Giai đoạn tấn công diệt nhanh vi khuẩn, ngăn đột biến kháng thuốc; giai đoạn duy trì diệt triệt để, tránh tái phát.",
    treatmentImplication: "Dùng phác đồ lao nhạy cảm theo tuổi, cân nặng, vị trí lao; điều trị có kiểm soát hằng ngày, đủ thời gian.",
    sources: [LAO("mục 1.3–1.4, 2.1; tr. 43")] },
];
const TB_REASSESS = ["Không đáp ứng, đáp ứng kém hoặc không dung nạp phác đồ chuẩn: hội chẩn xây dựng phác đồ cá thể."];
const PULM_TB: DiseaseRationale = {
  common: TB_COMMON,
  reassessment: TB_REASSESS,
  branches: {
    "Lao phổi người lớn không có bằng chứng/nghi ngờ kháng thuốc (kể cả HIV và phụ nữ có thai) – phác đồ 6 tháng": [
      { condition: "Người lớn, kể cả người nhiễm HIV và phụ nữ mang thai.", treatmentImplication: "Phác đồ A1 – 2HRZE/4RHE. Không chỉ định cho lao hệ thần kinh trung ương, lao xương khớp.", sources: [LAO("phác đồ A1; tr. 43–44")] },
    ],
    "Lao phổi trẻ em không có bằng chứng/nghi ngờ kháng thuốc – phác đồ 6 tháng": [
      { condition: "Trẻ em; có thể dùng cho trẻ nhiễm HIV.", treatmentImplication: "Phác đồ A2 – 2HRZE/4RH. Không chỉ định cho lao hệ thần kinh trung ương, lao xương khớp.", sources: [LAO("phác đồ A2; tr. 44–45")] },
    ],
    "Lao phổi người từ 12 tuổi, ≥ 40 kg – phác đồ 4 tháng": [
      { condition: "Lao phổi, từ 12 tuổi, cân nặng ≥ 40 kg.", treatmentImplication: "Phác đồ A1a – 2HPMZ/2HPM. Không chỉ định cho lao ngoài phổi, HIV có CD4 < 100 tế bào/mm³, phụ nữ có thai, cho con bú. Uống rifapentin trong bữa ăn ít béo.", sources: [LAO("phác đồ A1a; tr. 45")] },
    ],
    "Lao nhẹ ở trẻ 3 tháng–16 tuổi – phác đồ 4 tháng": [
      { condition: "Trẻ 3 tháng – 16 tuổi thỏa cả 3 tiêu chí: X-quang mức độ nhẹ; Xpert âm tính, vết, rất thấp hoặc thấp (hoặc AFB âm tính); lâm sàng nhẹ, không cần nội trú.", treatmentImplication: "Phác đồ A2a – 2HRZE/2RH; kéo dài thêm 2 tháng hoặc đổi phác đồ nếu không đáp ứng sau 4 tháng.", sources: [LAO("phác đồ A2a; tr. 45–46")] },
      { condition: "CẦN THẨM ĐỊNH – thành phần giai đoạn duy trì A2a.", clinicalMeaning: "Văn bản ghi \"02 loại thuốc: R, H, E\" (số lượng và danh sách không khớp); ký hiệu phác đồ là 2RH.", sources: [LAO("phác đồ A2a; tr. 46")] },
    ],
  },
};
const CNS_TB: DiseaseRationale = {
  common: [
    ...TB_COMMON,
    { condition: "Lao màng não.", treatmentImplication: "Corticosteroid (dexamethason hoặc prednisolon) giảm dần trong 6–8 tuần đầu; cân nhắc thêm streptomycin giai đoạn tấn công khi nặng (trẻ em: có dùng thêm).", sources: [LAO("phác đồ B1, B2; tr. 46")] },
  ],
  reassessment: TB_REASSESS,
  branches: {
    "Lao hệ thần kinh trung ương/màng não người lớn không có bằng chứng kháng thuốc – phác đồ 12 tháng": [
      { condition: "Người lớn, lao hệ thần kinh trung ương hoặc lao xương khớp.", treatmentImplication: "Phác đồ B1 – 2HRZE/10RHE.", sources: [LAO("phác đồ B1; tr. 46")] },
    ],
    "Lao hệ thần kinh trung ương/màng não trẻ em không có bằng chứng kháng thuốc – phác đồ 12 tháng": [
      { condition: "Trẻ em, lao hệ thần kinh trung ương hoặc lao xương khớp.", treatmentImplication: "Phác đồ B2 – 2HRZE/10RH.", sources: [LAO("phác đồ B2; tr. 46")] },
    ],
    "Lao hệ thần kinh trung ương/màng não người 0–19 tuổi không có bằng chứng kháng thuốc – phác đồ 6 tháng": [
      { condition: "Người 0–19 tuổi, lao não – màng não, không nhiễm HIV.", treatmentImplication: "Phác đồ B2a – 6HRZEto hằng ngày liên tục 6 tháng. Không chỉ định cho người nhiễm HIV.", sources: [LAO("phác đồ B2a; tr. 47")] },
    ],
  },
};

/* ================= QĐ 315/QĐ-BYT (2015) – Sản phụ khoa ================= */
const SPK = (loc: string) => `QĐ 315/QĐ-BYT (2015) – ${loc}`;
const NKSS = (loc: string) => SPK(`Nhiễm khuẩn sơ sinh, ${loc}`);
const NEONATAL_SEPSIS: DiseaseRationale = {
  common: [
    { condition: "Nhiễm khuẩn sơ sinh: biểu hiện nghèo nàn, không điển hình (rối loạn thân nhiệt, li bì, bỏ bú, thở rên…).",
      clinicalMeaning: "Tử vong nhiễm khuẩn sơ sinh sớm 25–50%. Yếu tố nguy cơ: mẹ sốt, nhiễm trùng ối, vỡ ối > 18 giờ, chuyển dạ > 12 giờ, non tháng.",
      treatmentImplication: "Cấy máu, dịch não tủy, mủ trước kháng sinh; điều trị khi lâm sàng khẳng định, hoặc nghi ngờ kèm xét nghiệm dương tính.",
      sources: [NKSS("mục 1–3.3; tr. 235–237")] },
  ],
  reassessment: [
    "Có kháng sinh đồ: điều chỉnh. Thời gian: nhiễm trùng máu 10 ngày, viêm màng não 14–21 ngày, viêm phổi 7–10 ngày; tụ cầu vàng 3–6 tuần.",
    "Aminosid có thể gây điếc: không dùng quá 7 ngày ở trẻ sơ sinh.",
    "Cephalosporin thế hệ 3 kéo dài là yếu tố nguy cơ nhiễm Candida; lâm sàng xấu đi khi đang dùng kháng sinh kéo dài: phối hợp kháng nấm nhóm azol.",
  ],
  branches: {
    "Nhiễm trùng sơ sinh sớm, chưa có kháng sinh đồ: beta-lactam phối hợp aminosid": [
      { condition: "Nhiễm trùng sơ sinh sớm, chưa có kháng sinh đồ.", treatmentImplication: "Hai kháng sinh: penicilin hoặc ampicilin phối hợp gentamicin hoặc amikacin.", sources: [NKSS("mục 4.1.1; tr. 238")] },
    ],
    "Sơ sinh nghi vi khuẩn kháng ampicilin (E. coli, Enterobacter) khi mẹ đã dùng kháng sinh trước đó": [
      { condition: "Mẹ đã dùng kháng sinh, trẻ nghi vi khuẩn kháng ampicilin (E. coli, Enterobacter).", treatmentImplication: "Cefotaxim, ceftriaxon hoặc imipenem phối hợp aminosid.", sources: [NKSS("mục 4.1.1; tr. 238")] },
    ],
    "Nhiễm trùng sơ sinh mắc phải (muộn) – nghi tụ cầu: phối hợp ba kháng sinh": [
      { condition: "Nhiễm trùng mắc phải (muộn), nghi tụ cầu.", treatmentImplication: "Ba kháng sinh: cephalosporin thế hệ 3 + vancomycin + aminosid.", sources: [NKSS("mục 4.1.1; tr. 238")] },
    ],
    "Nhiễm trùng sơ sinh mắc phải (muộn) – nghi trực khuẩn Gram âm": [
      { condition: "Nhiễm trùng mắc phải (muộn), nghi trực khuẩn Gram âm.", treatmentImplication: "Cephalosporin thế hệ 3 + imipenem; đôi khi quinolon phối hợp aminosid hoặc colistin. Nghi kỵ khí: phối hợp metronidazol.", sources: [NKSS("mục 4.1.1; tr. 238")] },
    ],
  },
};
const VULVO_CANDIDA: DiseaseRationale = {
  branches: {
    "Viêm âm đạo do nấm (Candida albicans)": [
      { condition: "Ngứa âm hộ, vết đỏ sinh dục ngoài; xét nghiệm có sợi nấm, test tanh cá âm tính.",
        clinicalMeaning: "Do Candida albicans; yếu tố thuận lợi: đái tháo đường, có thai.",
        treatmentImplication: "Thuốc đặt âm đạo: nystatin hoặc miconazol.",
        sources: [SPK("Viêm âm hộ – âm đạo, mục 2.3; tr. 133")] },
    ],
  },
};
const UTI_PREG_315: DiseaseRationale = {
  branches: {
    "Viêm bàng quang trong thai kỳ": [
      { condition: "Thai phụ viêm bàng quang (đái buốt, đái rắt, đau sau mu).", treatmentImplication: "Amoxicilin uống 5–7 ngày; tái phát có thể điều trị tiếp đến khi đẻ.", sources: [SPK("Sốt trong khi có thai, mục 2.1.2; tr. 73–74")] },
    ],
    "Viêm thận – bể thận cấp trong thai kỳ": [
      { condition: "Thai phụ viêm thận – bể thận cấp: sốt cao rét run, đau thắt lưng; cấy nước tiểu.", treatmentImplication: "Chống choáng; kháng sinh theo kháng sinh đồ: ampicilin-sulbactam tiêm + metronidazol truyền đến khi hết sốt 48 giờ, rồi amoxicilin uống 12 ngày.", sources: [SPK("Sốt trong khi có thai, mục 2.1.2; tr. 74")] },
      { condition: "CẦN THẨM ĐỊNH – khác biệt với QĐ 708.", clinicalMeaning: "QĐ 708 (bài viêm thận bể thận) ghi có thể dùng sulfamid, penicilin cho thai phụ; QĐ 315 dùng ampicilin-sulbactam + metronidazol.", sources: [SPK("tr. 74"), "QĐ 708/QĐ-BYT (2015) – Viêm thận bể thận cấp, mục 4.5; tr. 238"] },
    ],
  },
};

/* ================= QĐ 4416/QĐ-BYT (2023) – Da liễu ================= */
const DL = (loc: string) => `QĐ 4416/QĐ-BYT (2023) – Nhọt, áp xe da, ${loc}`;
const BOIL_COMMON: ClinicalCriterion[] = [
  { condition: "Nhọt hoặc áp xe da (ổ mủ khu trú trong trung bì, dưới da).",
    clinicalMeaning: "Nhọt do tụ cầu vàng; áp xe da: tụ cầu vàng thường gặp nhất (MRSA gây áp xe tái phát), S. pyogenes, Gram âm, kỵ khí.",
    treatmentImplication: "Ổ áp xe: trích rạch dẫn lưu kèm kháng sinh toàn thân; nhuộm Gram, cấy, kháng sinh đồ.",
    sources: [DL("mục 1.3, 2.2, 3.1; tr. 14–15")] },
];
const BOIL: DiseaseRationale = {
  common: BOIL_COMMON,
  reassessment: ["Thời gian kháng sinh 7–10 ngày.", "Vệ sinh cá nhân, tránh tự lây nhiễm; nâng cao thể trạng."],
  branches: {
    "Nhọt, áp xe da (kèm trích rạch dẫn lưu ổ áp xe và điều trị tại chỗ)": [
      { condition: "Giai đoạn có mủ.", treatmentImplication: "Chích rạch, dẫn lưu; sát khuẩn và kháng sinh tại chỗ (acid fusidic, mupirocin…).", sources: [DL("mục 3.2.1; tr. 15–16")] },
    ],
    "Nhọt, áp xe da": [
      { condition: "Cần kháng sinh toàn thân.", treatmentImplication: "Một trong các kháng sinh của bảng điều trị toàn thân (beta-lactam, amoxicilin-clavulanat, macrolid, clindamycin…).", sources: [DL("mục 3.2.2; tr. 16")] },
    ],
    "Nhọt, áp xe da do tụ cầu vàng kháng methicilin": [
      { condition: "Do tụ cầu vàng kháng methicilin.", treatmentImplication: "Vancomycin, TMP/SMX hoặc linezolid theo bảng của nguồn.", sources: [DL("mục 3.2.2; tr. 16")] },
    ],
  },
};

/* ================= QĐ 40/QĐ-BYT (2015) – Bệnh về mắt ================= */
const CONJ_40: DiseaseRationale = {
  branches: {
    "Viêm kết mạc cấp – điều trị tại mắt (QĐ 40)": [
      { condition: "Viêm kết mạc cấp do vi khuẩn, những ngày đầu diễn biến nhanh.",
        clinicalMeaning: "Nguyên tắc: điều trị tích cực, khẩn trương, tại chỗ và toàn thân, theo nguyên nhân.",
        treatmentImplication: "Tra dung dịch 15–30 phút/lần một trong: aminoglycosid (tobramycin) hoặc fluoroquinolon; phối hợp mỡ tra trưa và tối; giảm số lần khi thuyên giảm. Thận trọng corticoid.",
        sources: ["QĐ 40/QĐ-BYT (2015) – Viêm kết mạc cấp, mục 4a, 4b; tr. 37 [đối chiếu bản đăng lại vnras.com]"] },
    ],
  },
};

/* ================= QĐ 1493/QĐ-BYT (2015) – Hồi sức tích cực ================= */
/* Doi chieu ban PDF do benhvienlaokhoa.vn dang (ban kem QĐ 1493 ngay 22/4/2015). */
const HSTC = (loc: string) => `QĐ 1493/QĐ-BYT (2015) – Hướng dẫn chẩn đoán và xử trí hồi sức tích cực, ${loc}`;
const VAP_1493 = (loc: string) => HSTC(`Viêm phổi liên quan đến thở máy, ${loc}`);
const ICU_PNEUMONIA: DiseaseRationale = {
  common: [
    { condition: "Viêm phổi bệnh viện hoặc liên quan thở máy tại hồi sức.",
      clinicalMeaning: "Vi khuẩn và mức độ kháng thuốc khác nhau giữa các khoa, bệnh viện; cần điều tra dịch tễ định kỳ.",
      treatmentImplication: "Kháng sinh kinh nghiệm sớm, tốt nhất sau khi lấy dịch phế quản, máu; đúng, đủ liều; chỉnh theo đáp ứng và vi sinh. Suy thận: chỉnh theo mức lọc cầu thận và nồng độ thuốc (nếu có).",
      sources: [VAP_1493("mục 5.1, 5.3b; tr. 45–46")] },
  ],
  reassessment: [
    "Đánh giá lại sau 48–72 giờ và tại ngày 3, 5, 7 (CPIS, sốt, PaO2/FiO2, bạch cầu, procalcitonin, đờm, X-quang); xuống thang khi có kết quả vi sinh.",
    "Thời gian: khoảng 7–10 ngày với tụ cầu, H. influenzae; ít nhất 14–21 ngày khi nhiều thùy, suy dinh dưỡng, tổn thương hang, hoại tử Gram âm, P. aeruginosa, Acinetobacter.",
  ],
  branches: {
    "Viêm phổi bệnh viện/thở máy tại hồi sức – không có nguy cơ vi khuẩn đa kháng": [
      { condition: "Không có nguy cơ nhiễm vi khuẩn đa kháng.",
        clinicalMeaning: "Nhắm tụ cầu nhạy methicilin, S. pneumoniae, H. influenzae, Gram âm đường ruột nhạy.",
        treatmentImplication: "Một trong: ceftriaxon, quinolon (levofloxacin, moxifloxacin, ciprofloxacin), ampicilin-sulbactam hoặc ertapenem.",
        sources: [VAP_1493("mục 5.3a; tr. 46")] },
    ],
    "Viêm phổi liên quan thở máy có nguy cơ vi sinh vật đa kháng: 1 kháng sinh nhóm A + 1 nhóm B (cân nhắc thêm nhóm C hoặc D)": [
      { condition: "Có nguy cơ vi sinh vật đa kháng.",
        clinicalMeaning: "Nhắm MRSA, P. aeruginosa, Acinetobacter, Klebsiella, Enterobacter, Serratia, Stenotrophomonas, B. cepacia.",
        treatmentImplication: "Một thuốc nhóm A (cefepim, ceftazidim, imipenem, meropenem, piperacilin-tazobactam) + một thuốc nhóm B (ciprofloxacin, levofloxacin hoặc aminoglycosid). Thêm nhóm C khi nghi MRSA, nhóm D khi nghi nấm. ESBL: carbapenem + fluoroquinolon.",
        sources: [VAP_1493("mục 5.3b; tr. 46")] },
      { condition: "VAP muộn, có nguy cơ hoặc chắc chắn do Gram âm đa kháng.",
        clinicalMeaning: "Nguồn ghi đây là loại VAP muộn phổ biến nhất ở Việt Nam.",
        treatmentImplication: "Colistin (colimycin) kết hợp carbapenem.",
        sources: [VAP_1493("mục 5.3b; tr. 46")] },
    ],
  },
};
const ASPIRATION: DiseaseRationale = {
  common: [
    { condition: "Mặt bệnh này hiển thị phác đồ hiện hành trong module viêm phổi cộng đồng (QĐ 2147/QĐ-BYT 2026).",
      clinicalMeaning: "Nhánh dưới đây lấy từ hướng dẫn hồi sức 2015, được giữ vì QĐ 2147 thay thế các phương án CAP nặng khác của văn bản này.",
      sources: [HSTC("Viêm phổi nặng do vi khuẩn tại cộng đồng; tr. 34–38")] },
  ],
  reassessment: ["Thời gian: vi khuẩn điển hình 7–10 ngày; không điển hình 14 ngày; trực khuẩn mủ xanh ít nhất 10–14 ngày; dùng corticoid lâu ngày: 14 ngày hoặc hơn."],
  branches: {
    "Viêm phổi do hít hoặc do vi khuẩn kỵ khí (hồi sức)": [
      { condition: "Viêm phổi nặng do hít, hoặc nghi vi khuẩn kỵ khí (nghiện rượu, vệ sinh răng miệng kém).",
        clinicalMeaning: "Vi khuẩn kỵ khí gặp ở người nghiện rượu, vệ sinh răng miệng kém.",
        treatmentImplication: "Beta-lactam + chất ức chế beta-lactamase, hoặc clindamycin. Kháng sinh trong 6 giờ đầu sau nhập viện, ngay sau khi lấy bệnh phẩm.",
        sources: [HSTC("Viêm phổi nặng do vi khuẩn tại cộng đồng, mục 2.2, 5.1, 5.3a; tr. 34, 37–38")] },
      { condition: "Hít phải nước ngọt hoặc bùn đất.",
        clinicalMeaning: "Nghi B. pseudomallei (vi khuẩn Whitmore).",
        treatmentImplication: "Nguồn ghi ceftazidim, có thể xem xét kết hợp chloramphenicol, doxycyclin, co-trimoxazol (nhánh này không có thẻ phác đồ riêng trong ứng dụng).",
        sources: [HSTC("Viêm phổi nặng do vi khuẩn tại cộng đồng, mục 2.2, 5.3a; tr. 34, 38")] },
    ],
  },
};

export const RATIONALE_OTHER: Record<string, DiseaseRationale> = {
  "v8-1": ASPIRATION,
  "v8-4": ICU_PNEUMONIA,
  "v8-5": ICU_PNEUMONIA,
  "v8-83": CONJ_40,
  "v9-1": DIABETIC_FOOT,
  "v8-142": PULM_TB,
  "v8-141": CNS_TB,
  "v8-103": NEONATAL_SEPSIS,
  "v8-96": VULVO_CANDIDA,
  "v8-97": UTI_PREG_315,
  "v8-28": BOIL,
  "v8-3": CANDIDEMIA,
  "v8-48": CANDIDA_ABDOMEN,
  "v8-121": CANDIDEMIA_NEUTRO,
  "v8-122": CANDIDA_ENDO,
  "v8-124": CANDIDA_BONE,
  "v8-50": ASPERGILLUS,
  "v8-126": ASP_SINUS,
  "v8-117": HEME,
  "v8-51": CRYPTO_MEN,
  "v8-128": CRYPTO_EXTRA,
  "v8-52": MUCOR,
  "v8-129": HISTO,
  "v8-130": TALARO,
  "v8-53": PCP,
  "v8-36": MEN_ADULT_5642,
  "v8-104": MEN_CHILD_5642,
  "v8-135": TYPHOID,
  "v8-26": SHIGELLA,
  "v8-7": SINUSITIS,
  "v8-58": SINUSITIS,
  "v8-54": PHARYNGITIS,
  "v8-8": PHARYNGITIS,
  "v8-60": OTITIS_ADULT,
  "v8-99": OTITIS,
  "v8-56": DEEP_NECK,
  "v8-57": DEEP_NECK,
  "v8-66": DEEP_NECK,
};

export type { ClinicalCriterion };
