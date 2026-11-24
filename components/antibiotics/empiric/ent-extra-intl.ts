/*
  FILE: components/antibiotics/empiric/ent-extra-intl.ts

  Tai mũi họng – khối quốc tế bổ sung, chép đúng từ văn bản gốc (không suy diễn liều), viết gọn cho thẻ thuốc:
  - SFORL 2024 (Hội ORL Pháp, phối hợp SPILF, SFM, CIREOL, SFCTCV): nhiễm trùng cổ sâu có nguồn gốc họng –
    áp xe quanh amidan, nhiễm trùng cạnh họng/sau họng, viêm mô tế bào cổ sâu lan tỏa; người lớn và trẻ em.
  - Đồng thuận liên hội Nhi khoa Ý 2025: viêm xoang trẻ em; viêm tai giữa cấp trẻ em.
  - IDSA 2025 (phần 1): thang điểm lâm sàng quyết định xét nghiệm liên cầu nhóm A.
  Mức khuyến cáo ghi theo đúng thang của từng nguồn (mã "T:").
*/
import type { StratCite, StratIntl } from "../../../data/antibiotics/empiric/stratification";

type Item = StratIntl["items"][number];
const SF = "SFORL 2024";
const DT = "T:Đồng thuận chuyên gia";
const ANAPHYL = "Phản vệ penicilin hoặc dị ứng chéo cephalosporin";

/* ---------- SFORL 2024 – người lớn ---------- */
const SF_AMC = (course: string, grade: string): Item => ({
  role: "Chọn một",
  text: "Amoxicillin/acid clavulanic",
  dose: "100 mg/kg/ngày (theo amoxicillin) TM chia 4–6 lần hoặc uống chia 3–4 lần (2–3 g/lần)",
  course,
  administration: "Acid clavulanic tối đa 1200 mg/ngày.",
  grade,
  ref: SF,
});
const SF_METRO: Item = { role: "Kèm theo", text: "Metronidazol", dose: "500 mg TM/uống mỗi 8 giờ", grade: DT, ref: SF };
const SF_GENTA: Item = { role: "Thêm nếu sốc nhiễm khuẩn", text: "Gentamicin", dose: "6–7 mg/kg TM, 1 liều duy nhất", grade: DT, ref: SF };
const SF_CLINDA_DOSE = "< 70 kg: 600 mg mỗi 8 giờ; > 70 kg: 900 mg mỗi 8 giờ";
const ABS_COURSE = "10 ngày (7 ngày nếu đã dẫn lưu)";
const CELL_COURSE = "14 ngày từ lần mổ cuối";

export const SFORL_ADULT_ABSCESS: StratIntl[] = [{
  source: `${SF} – áp xe quanh amidan, cạnh họng, sau họng`,
  items: [
    SF_AMC(ABS_COURSE, "T:Mức C"),
    { role: "Dị ứng penicilin", text: "Cefazolin", dose: "100 mg/kg/ngày TM chia 3 lần", course: ABS_COURSE, al: "alt", grade: DT, ref: SF },
    { ...SF_METRO, role: "Kèm cefazolin", al: "alt" },
    { role: ANAPHYL, text: "Linezolid", dose: "600 mg TM/uống mỗi 12 giờ", course: ABS_COURSE, al: "alt", grade: DT, ref: SF },
    SF_GENTA,
  ],
}];

export const SFORL_ADULT_CELLULITIS: StratIntl[] = [{
  source: `${SF} – viêm mô tế bào cổ sâu lan tỏa, viêm trung thất`,
  items: [
    { ...SF_AMC(CELL_COURSE, DT), administration: "TM; acid clavulanic tối đa 1200 mg/ngày." },
    { role: "Chọn một", text: "Cefotaxim", dose: "100 mg/kg/ngày TM chia 3–4 lần (2 g/lần, truyền 4 giờ)", course: CELL_COURSE, grade: DT, ref: SF },
    { role: "Chọn một", text: "Ceftriaxon", dose: "35 mg/kg/ngày chia 1–2 lần (tối đa 2 g/lần)", course: CELL_COURSE, grade: DT, ref: SF },
    { ...SF_METRO, role: "Kèm cefotaxim/ceftriaxon" },
    { role: "Thêm nếu có dấu hiệu độc tố", text: "Clindamycin", dose: SF_CLINDA_DOSE, grade: DT, ref: SF },
    { role: "Dị ứng penicilin", text: "Cefotaxim hoặc ceftriaxon + metronidazol", al: "alt", grade: DT, ref: SF },
    { role: ANAPHYL, text: "Meropenem ± clindamycin", dose: "Meropenem 2 g mỗi 8 giờ, truyền 4 giờ", al: "alt", grade: DT, ref: SF },
    { role: "Dị ứng mọi beta-lactam", text: "Levofloxacin + linezolid (hội chẩn truyền nhiễm)", dose: "Levofloxacin 500 mg mỗi 12 giờ; linezolid 600 mg mỗi 12 giờ", al: "alt", grade: DT, ref: SF },
    SF_GENTA,
  ],
}];

/* ---------- SFORL 2024 – trẻ em ---------- */
const CHILD_COURSE = "Áp xe quanh amidan 10 ngày; thể khác 15 ngày";
export const SFORL_CHILD: StratIntl[] = [{
  source: `${SF} – trẻ em`,
  items: [
    { role: "Chọn một", text: "Amoxicillin/acid clavulanic", dose: "150 mg/kg/ngày TM chia 3 lần (tối đa 6 g/ngày)", course: CHILD_COURSE, grade: DT, ref: SF },
    { role: "Dị ứng penicilin", text: "Cefotaxim", dose: "200 mg/kg/ngày TM chia 3 lần (tối đa 12 g/ngày)", course: CHILD_COURSE, al: "alt", grade: DT, ref: SF },
    { role: "Dị ứng penicilin", text: "Ceftriaxon", dose: "50 mg/kg 1 lần/ngày (tối đa 4 g/ngày)", course: CHILD_COURSE, al: "alt", grade: DT, ref: SF },
    { role: "Kèm cefotaxim/ceftriaxon", text: "Clindamycin (trẻ > 6 tuổi)", dose: "40 mg/kg/ngày chia 4 lần (tối đa 2,4 g/ngày)", al: "alt", grade: DT, ref: SF },
    { role: "Kèm cefotaxim/ceftriaxon", text: "Hoặc metronidazol", dose: "30 mg/kg/ngày chia 2–3 lần (tối đa 1,5 g/ngày)", al: "alt", grade: DT, ref: SF },
    { role: "Chuyển uống", text: "Amoxicillin/acid clavulanic", dose: "80 mg/kg/ngày chia 3 lần (tối đa 3 g/ngày)", administration: "Khi hết sốt, đỡ đau, giảm viêm (thường sau 2–5 ngày).", grade: DT, ref: SF },
    { role: "Chuyển uống – dị ứng penicilin", text: "Clindamycin (trẻ > 6 tuổi)", dose: "30–40 mg/kg/ngày chia 3 lần (tối đa 1200 mg/ngày)", al: "alt", grade: DT, ref: SF },
  ],
}];

export const SFORL_CRIT_ADULT_ABSCESS: StratCite[] = [
  { text: "Áp xe quanh amidan: luôn chọc hút hoặc rạch dẫn lưu. Nhập viện nếu > 70 tuổi, bệnh nền, khó nuốt hoặc nguy cơ hô hấp; ngoại trú thì khám lại sau 24 giờ.", source: SF, ref: "" },
  { text: "Cạnh họng, sau họng chưa biến chứng, một khoang, không đái tháo đường: có thể chỉ điều trị nội khoa; không cải thiện sau 48 giờ thì dẫn lưu.", source: SF, ref: "" },
];
export const SFORL_CRIT_ADULT_CELLULITIS: StratCite[] = [
  { text: "Báo hồi sức ngay, CT cổ – ngực có cản quang, phẫu thuật sớm và triệt để. Luôn phủ kỵ khí.", source: SF, ref: "" },
];
export const SFORL_CRIT_CHILD: StratCite[] = [
  { text: "Chưa biến chứng: kháng sinh TM, đánh giá lại sau 48 giờ. Phẫu thuật nếu áp xe lớn, có biến chứng hoặc không cải thiện.", source: SF, ref: "" },
];

export const SFORL_PATHOGENS: StratCite[] = [
  { text: "Người lớn: liên cầu nhóm milleri kèm kỵ khí, S. pyogenes, S. aureus; F. necrophorum ở người 15–24 tuổi. Hơn 2/3 vi khuẩn tiết beta-lactamase.", source: SF, ref: "" },
  { text: "Trẻ em: S. aureus, S. pyogenes; dưới 3 tháng thêm trực khuẩn Gram âm, liên cầu nhóm B.", source: SF, ref: "" },
];
export const SFORL_SAMPLING: StratCite[] = [
  { text: "Chọc hút bằng bơm tiêm (không dùng tăm bông), cấy hiếu khí và kỵ khí; cấy máu nếu sốt cao hoặc nặng.", source: SF, ref: "" },
];
export const SFORL_PRINCIPLES: StratIntl = {
  source: `${SF} – khuyến cáo`,
  items: [
    { role: "Khuyến cáo", text: "Beta-lactam đầu tay; thuốc khác chỉ khi dị ứng penicilin thật sự.", grade: DT, ref: SF },
    { role: "Khuyến cáo", text: "Thêm clindamycin khi có dấu hiệu sốc nhiễm độc tố.", grade: DT, ref: SF },
    { role: "Khuyến cáo", text: "Aminosid chỉ khi sốc nhiễm khuẩn hoặc sốc nhiễm độc tố.", grade: DT, ref: SF },
    { role: "Khuyến cáo", text: "Áp xe quanh amidan: 1 liều corticoid giúp giảm đau ngắn.", grade: "T:Mức B", ref: SF },
    { role: "Khuyến cáo", text: "Nhiễm trùng cạnh họng: không dùng NSAID.", grade: DT, ref: SF },
    { role: "Khuyến cáo", text: "Coi là đặt nội khí quản khó, nhất là khi khít hàm.", grade: DT, ref: SF },
  ],
};
export const SFORL_TARGETED: StratIntl = {
  source: `${SF} – theo vi sinh (người lớn)`,
  items: [
    { role: "Theo vi sinh", text: "Áp xe: ưu tiên amoxicillin/acid clavulanic, sau đó clindamycin, sau đó linezolid", ref: SF },
    { role: "Theo vi sinh", text: "Clindamycin", dose: SF_CLINDA_DOSE, ref: SF },
    { role: "Theo vi sinh", text: "Viêm mô tế bào: theo kết quả cấy, luôn giữ phủ kỵ khí", ref: SF },
  ],
};
export const SFORL_SOURCE = "Société Française d'ORL et de Chirurgie de la Face et du Cou (SFORL), phối hợp SPILF, SFM, CIREOL, SFCTCV. Prise en charge des infections cervicales profondes d'origine pharyngée – Recommandation de pratique clinique (2024).";

/* ---------- Đồng thuận liên hội Nhi khoa Ý 2025 ---------- */
const IT = "Nhi khoa Ý 2025";
export const ITALY_SINUSITIS: StratIntl = {
  source: "Nhi khoa Ý 2025 – viêm xoang cấp trẻ em",
  items: [
    { role: "Chọn một", text: "Amoxicillin (triệu chứng kéo dài ≥ 10 ngày)", dose: "90 mg/kg/ngày uống chia 3 lần", course: "≥ 10 ngày", grade: "T:Yếu · rất thấp", ref: IT },
    { role: "Chọn một", text: "Amoxicillin/acid clavulanic (nặng lên lại hoặc khởi phát nặng)", dose: "90 mg/kg/ngày (theo amoxicillin) chia 3 lần", course: "≥ 10 ngày", grade: "T:Yếu · rất thấp", ref: IT },
    { role: "Thất bại sau 48–72 giờ", text: "Amoxicillin → amoxicillin/acid clavulanic; amoxicillin/acid clavulanic → cephalosporin thế hệ 2–3 + clindamycin", grade: "T:Yếu · thấp", ref: IT },
    { role: "Dị ứng penicilin nguy cơ thấp", text: "Cefixim, cefpodoxim hoặc ceftibuten", course: "≥ 10 ngày", al: "alt", grade: "T:Yếu · rất thấp", ref: IT },
    { role: "Không dùng", text: "Macrolid, trimethoprim-sulfamethoxazol", grade: "T:Mạnh · thấp", ref: IT },
  ],
};
export const ITALY_SINUSITIS_SOURCE = "Venturini E, et al. Treatment of sinusitis in children: an Italian intersociety consensus (SIPPS-SIP-SITIP-FIMP-SIAIP-SIMRI-SIM-FIMMG). Ital J Pediatr 2025;51:102.";

export const ITALY_AOM: StratIntl = {
  source: "Nhi khoa Ý 2025 – viêm tai giữa cấp trẻ em",
  items: [
    { role: "Kháng sinh ngay", text: "Trẻ < 6 tháng; 6–24 tháng viêm hai bên; chảy mủ tai hoặc nặng. Còn lại: theo dõi 48–72 giờ.", grade: "T:Mạnh · TB", ref: IT },
    { role: "Chọn một", text: "Amoxicillin", dose: "80–90 mg/kg/ngày uống chia 3 lần", course: "5 ngày (> 2 tuổi, không nguy cơ); 7–10 ngày nếu nguy cơ cao hoặc nặng", grade: "T:Mạnh · thấp", ref: IT },
    { role: "Thất bại hoặc tái phát trong 30 ngày", text: "Amoxicillin/acid clavulanic + amoxicillin", dose: "40 mg/kg/ngày (theo amoxicillin) + amoxicillin 50 mg/kg/ngày, chia 3 lần", grade: "T:Mạnh · TB", ref: IT },
    { role: "Dị ứng penicilin", text: "Cefuroxim hoặc cefpodoxim (sau phân tầng nguy cơ dị ứng)", al: "alt", grade: "T:Mạnh · rất thấp", ref: IT },
    { role: "Không dùng", text: "Kháng sinh tiêm cho thể không biến chứng; dự phòng kháng sinh thường quy", grade: "T:Mạnh · TB", ref: IT },
  ],
};
export const ITALY_AOM_SOURCE = "Castelli Gattinara G, et al. Antibiotic treatment of acute and recurrent otitis media in children: an Italian intersociety Consensus. Ital J Pediatr 2025;51:50.";

/* ---------- IDSA 2025 – viêm họng liên cầu nhóm A, phần 1 ---------- */
export const IDSA25_GAS_SCORE: Item = {
  role: "Thang điểm lâm sàng",
  text: "Dùng Centor/McIsaac để chọn người cần xét nghiệm (không áp dụng cho trẻ < 3 tuổi). Vẫn xét nghiệm nếu tiếp xúc người nhiễm trong nhà, tiền sử thấp tim hoặc nghi biến chứng.",
  grade: "T:Có điều kiện · rất thấp",
  ref: "IDSA 2025",
};
export const IDSA25_GAS_SOURCE = "Linder JA, et al. 2025 Clinical Practice Guideline Update by the IDSA on Group A Streptococcal Pharyngitis: Risk Assessment Using Clinical Scoring Systems in Children and Adults. Clin Infect Dis 2026;82:i97–104.";
