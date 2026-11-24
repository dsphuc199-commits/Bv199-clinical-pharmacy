/*
  FILE: components/antibiotics/empiric/ent-extra-intl.ts

  Tai mũi họng – khối quốc tế bổ sung, chép đúng từ văn bản gốc (không suy diễn liều):
  - SFORL 2024 (Hội ORL Pháp, phối hợp SPILF, SFM, CIREOL, SFCTCV): nhiễm trùng cổ sâu có nguồn gốc họng –
    áp xe quanh amidan, nhiễm trùng cạnh họng/sau họng, viêm mô tế bào cổ sâu lan tỏa; người lớn và trẻ em.
  - Đồng thuận liên hội Nhi khoa Ý 2025 (SIPPS-SIP-SITIP-FIMP-SIAIP-SIMRI…): viêm xoang trẻ em; viêm tai giữa cấp trẻ em.
  - IDSA 2025 (phần 1): thang điểm lâm sàng quyết định xét nghiệm liên cầu nhóm A.
  Mức khuyến cáo ghi theo đúng thang của từng nguồn (mã "T:").
*/
import type { StratCite, StratIntl } from "../../../data/antibiotics/empiric/stratification";

type Item = StratIntl["items"][number];
const SF = "SFORL 2024";
const DONG_THUAN = "T:Đồng thuận chuyên gia";

/* ---------- SFORL 2024 – người lớn ---------- */
const SF_AMC_ADULT = (course: string): Item => ({
  role: "Chọn một",
  text: "Amoxicillin/acid clavulanic",
  dose: "Tĩnh mạch: 100 mg/kg/ngày (tính theo amoxicillin) chia 4–6 lần, acid clavulanic không quá 1200 mg/ngày. Uống: 100 mg/kg/ngày chia 3–4 lần, mỗi lần 2–3 g",
  course,
  administration: "Uống ngay từ đầu, trừ khi nhập viện, không uống được hoặc có dấu hiệu nặng về huyết động.",
  ref: SF,
});
const SF_GENTA: Item = {
  role: "Phối hợp thêm – sốc nhiễm khuẩn",
  text: "Gentamicin",
  dose: "6–7 mg/kg tĩnh mạch, truyền 30 phút, một liều duy nhất",
  grade: DONG_THUAN,
  ref: SF,
};
const SF_CLINDA_DOSE = "Cân nặng < 70 kg: 600 mg mỗi 8 giờ; > 70 kg: 900 mg mỗi 8 giờ, tĩnh mạch chậm hoặc uống";

export const SFORL_ADULT_ABSCESS: StratIntl[] = [{
  source: `${SF} – áp xe quanh amidan, cạnh họng, sau họng (người lớn)`,
  items: [
    { ...SF_AMC_ADULT("10 ngày; 7 ngày nếu đã dẫn lưu"), grade: "T:Mức C" },
    { role: "Dị ứng penicilin", text: "Cefazolin + metronidazol", dose: "Cefazolin 100 mg/kg/ngày tĩnh mạch chia 3 lần (truyền 60 phút mỗi 8 giờ) + metronidazol 500 mg mỗi 8 giờ, tĩnh mạch hoặc uống",
      course: "10 ngày; 7 ngày nếu đã dẫn lưu", administration: "Cefazolin từ 6 g/ngày trở lên: theo dõi nồng độ thuốc.", al: "alt", grade: DONG_THUAN, ref: SF },
    { role: "Dị ứng penicilin có phản vệ hoặc dị ứng chéo cephalosporin", text: "Linezolid", dose: "600 mg mỗi 12 giờ, tĩnh mạch hoặc uống",
      course: "10 ngày; 7 ngày nếu đã dẫn lưu", al: "alt", grade: DONG_THUAN, ref: SF },
    SF_GENTA,
  ],
}];

export const SFORL_ADULT_CELLULITIS: StratIntl[] = [{
  source: `${SF} – viêm mô tế bào cổ sâu lan tỏa, viêm trung thất hoại tử (người lớn)`,
  items: [
    { ...SF_AMC_ADULT("14 ngày tính từ lần phẫu thuật cuối"), administration: "Tĩnh mạch ngay; chuyển uống khi lâm sàng và xét nghiệm cải thiện, ăn uống lại được.", grade: DONG_THUAN },
    { role: "Chọn một", text: "Cefotaxim hoặc ceftriaxon + metronidazol",
      dose: "Cefotaxim 100 mg/kg/ngày tĩnh mạch chia 3–4 lần, mỗi lần 2 g truyền kéo dài 4 giờ; hoặc ceftriaxon 35 mg/kg/ngày chia 1–2 lần, tối đa 2 g mỗi lần; kèm metronidazol 500 mg mỗi 8 giờ",
      course: "14 ngày tính từ lần phẫu thuật cuối", grade: DONG_THUAN, ref: SF },
    { role: "Phối hợp thêm – dấu hiệu nhiễm độc tố", text: "Clindamycin (chống độc tố)", dose: SF_CLINDA_DOSE,
      administration: "Khi diễn tiến nhanh hoặc có dấu hiệu độc tố: ban đỏ, rối loạn tiêu hóa, lú lẫn, tụt huyết áp. Không tiêm tĩnh mạch trực tiếp.", grade: DONG_THUAN, ref: SF },
    { role: "Dị ứng penicilin", text: "Cefotaxim hoặc ceftriaxon + metronidazol", dose: "Như phác đồ cefotaxim/ceftriaxon + metronidazol ở trên", al: "alt", grade: DONG_THUAN, ref: SF },
    { role: "Dị ứng penicilin có phản vệ hoặc dị ứng chéo cephalosporin", text: "Meropenem, có thể thêm clindamycin", dose: "Meropenem 2 g mỗi 8 giờ, truyền 4 giờ",
      administration: "Chống chỉ định nếu từng quá mẫn muộn nặng với penicilin và cephalosporin (DRESS, Stevens-Johnson, Lyell, AGEP, viêm mạch).", al: "alt", grade: DONG_THUAN, ref: SF },
    { role: "Dị ứng mọi beta-lactam", text: "Levofloxacin + linezolid; hội chẩn chuyên khoa truyền nhiễm", dose: "Levofloxacin 500 mg mỗi 12 giờ + linezolid 600 mg mỗi 12 giờ, tĩnh mạch hoặc uống",
      al: "alt", grade: DONG_THUAN, ref: SF },
    SF_GENTA,
  ],
}];

/* ---------- SFORL 2024 – trẻ em ---------- */
export const SFORL_CHILD: StratIntl[] = [{
  source: `${SF} – trẻ em (áp xe quanh amidan, cạnh họng, sau họng, viêm hạch tụ mủ nặng, viêm mô tế bào)`,
  items: [
    { role: "Chọn một", text: "Amoxicillin/acid clavulanic", dose: "150 mg/kg/ngày tĩnh mạch chậm chia 3 lần, tối đa 6 g/ngày",
      course: "Áp xe quanh amidan: 10 ngày; các trường hợp khác: 15 ngày",
      administration: "Không dấu hiệu nặng và uống được: có thể uống ngay từ đầu.", grade: DONG_THUAN, ref: SF },
    { role: "Dị ứng penicilin", text: "Cefotaxim hoặc ceftriaxon + clindamycin hoặc metronidazol",
      dose: "Cefotaxim 200 mg/kg/ngày tĩnh mạch chia 3 lần (tối đa 12 g/ngày) hoặc ceftriaxon 50 mg/kg 1 lần/ngày (tối đa 4 g/ngày, chia 2 lần); kèm clindamycin (trẻ trên 6 tuổi) 40 mg/kg/ngày chia 4 lần (tối đa 2,4 g/ngày) hoặc metronidazol 30 mg/kg/ngày chia 2–3 lần (tối đa 1,5 g/ngày)",
      course: "Áp xe quanh amidan: 10 ngày; các trường hợp khác: 15 ngày", al: "alt", grade: DONG_THUAN, ref: SF },
    { role: "Chuyển uống", text: "Amoxicillin/acid clavulanic", dose: "80 mg/kg/ngày chia 3 lần, tối đa 3 g/ngày",
      administration: "Khi hết sốt, đỡ đau, giảm dấu hiệu tại chỗ và giảm rõ hội chứng viêm (thường sau 2–5 ngày tĩnh mạch).", grade: DONG_THUAN, ref: SF },
    { role: "Chuyển uống – dị ứng penicilin", text: "Clindamycin (trẻ trên 6 tuổi), linezolid hoặc pristinamycin",
      dose: "Clindamycin 30–40 mg/kg/ngày chia 3 lần (tối đa 1200 mg/ngày); hoặc linezolid hỗn dịch: dưới 5 tuổi 30 mg/kg/ngày chia 3 lần, từ 5 tuổi 20 mg/kg/ngày chia 2 lần (tối đa 1200 mg/ngày); hoặc pristinamycin 50–100 mg/kg/ngày chia 2–3 lần (tối đa 4 g/ngày)",
      al: "alt", grade: DONG_THUAN, ref: SF },
  ],
}];

export const SFORL_CRIT_ADULT_ABSCESS: StratCite[] = [
  { text: "Áp xe quanh amidan: luôn kèm chọc hút hoặc rạch dẫn lưu, chọc kim trước khi rạch để loại trừ giả phình động mạch cảnh trong. Nhập viện nếu trên 70 tuổi, thể trạng giảm, có bệnh nền (đái tháo đường, suy thận, suy giảm miễn dịch), khó nuốt, nguy cơ hô hấp hoặc dẫn lưu chưa hiệu quả; nếu không, điều trị ngoại trú và khám lại sau 24 giờ.", source: SF, ref: "" },
  { text: "Nhiễm trùng cạnh họng, sau họng chưa biến chứng, giới hạn một khoang, không đái tháo đường: có thể điều trị nội khoa đơn thuần, nằm viện theo dõi; không cải thiện sau 48 giờ thì chụp lại và dẫn lưu, qua đường miệng nếu ổ nằm phía trong động mạch cảnh trong.", source: SF, ref: "" },
];
export const SFORL_CRIT_ADULT_CELLULITIS: StratCite[] = [
  { text: "Viêm mô tế bào cổ sâu lan tỏa: báo hồi sức ngay; chụp CT cổ – ngực có cản quang (từ nền sọ tới cơ hoành); phẫu thuật sớm, lặp lại, triệt để; báo phẫu thuật lồng ngực nếu có viêm trung thất. Duy trì phủ kỵ khí suốt đợt điều trị kể cả khi không có kết quả vi sinh.", source: SF, ref: "" },
];
export const SFORL_CRIT_CHILD: StratCite[] = [
  { text: "Trẻ em chưa biến chứng: điều trị nội khoa đơn thuần, tĩnh mạch, đánh giá lại sau 48 giờ; phẫu thuật nếu áp xe lớn, có biến chứng hoặc không cải thiện sau 48 giờ, dẫn lưu qua miệng nếu ổ nằm phía trong động mạch cảnh trong. Áp xe quanh amidan: chọc hút được từ 7 tuổi khi trẻ hợp tác; rạch dẫn lưu thì gây mê toàn thân.", source: SF, ref: "" },
];

export const SFORL_PATHOGENS: StratCite[] = [
  { text: "Người lớn: liên cầu nhóm milleri kèm kỵ khí (Peptostreptococcus, Prevotella), sau đó S. pyogenes, S. aureus; F. necrophorum hay gặp ở người 15–24 tuổi (nguy cơ hội chứng Lemierre). Hơn hai phần ba vi khuẩn trong áp xe tiết beta-lactamase.", source: SF, ref: "" },
  { text: "Trẻ em: S. aureus và S. pyogenes chiếm ưu thế; trẻ dưới 3 tháng: tụ cầu, trực khuẩn Gram âm, liên cầu nhóm B.", source: SF, ref: "" },
];
export const SFORL_SAMPLING: StratCite[] = [
  { text: "Chọc hút bằng bơm tiêm (tránh tăm bông), chuyển trong hệ kín để giữ vi khuẩn kỵ khí; cấy hiếu khí và kỵ khí, làm kháng sinh đồ; cấy máu khi sốt cao hoặc nhiễm khuẩn nặng. Lấy mẫu trước kháng sinh nếu tình trạng cho phép.", source: SF, ref: "" },
];
export const SFORL_PRINCIPLES: StratIntl = {
  source: `${SF} – khuyến cáo`,
  items: [
    { role: "Khuyến cáo", text: "Beta-lactam là lựa chọn đầu tay; cephalosporin, clindamycin, fluoroquinolon chỉ dùng khi dị ứng penicilin thật sự hoặc cần chống độc tố (clindamycin).", grade: DONG_THUAN, ref: SF },
    { role: "Khuyến cáo", text: "Thêm clindamycin chống độc tố khi có dấu hiệu sốc nhiễm độc tố: huyết áp tâm thu ≤ 90 mmHg, tổn thương nhiều cơ quan, ban đỏ toàn thân, hoại tử mô mềm.", grade: DONG_THUAN, ref: SF },
    { role: "Khuyến cáo", text: "Phối hợp aminosid theo kinh nghiệm chỉ khi sốc nhiễm khuẩn hoặc sốc nhiễm độc tố, có ý kiến chuyên khoa.", grade: DONG_THUAN, ref: SF },
    { role: "Khuyến cáo", text: "Áp xe quanh amidan: một liều corticoid giúp giảm đau ngắn (dưới 24 giờ), không làm tăng biến chứng.", grade: "T:Mức B", ref: SF },
    { role: "Khuyến cáo", text: "Nhiễm trùng cạnh họng: chống chỉ định NSAID; không dùng thuốc giảm đau ức chế hô hấp; corticoid chỉ khi tắc nghẽn hô hấp và một liều duy nhất.", grade: DONG_THUAN, ref: SF },
    { role: "Khuyến cáo", text: "Coi đặt nội khí quản ở các người bệnh này là đặt ống khó, nhất là khi có khít hàm.", grade: DONG_THUAN, ref: SF },
    { role: "Khuyến cáo", text: "Cắt amidan trì hoãn khi viêm amidan tái diễn hoặc áp xe quanh amidan tái phát; chưa có bằng chứng lợi ích của cắt amidan nóng.", grade: "T:Mức C", ref: SF },
  ],
};
export const SFORL_TARGETED: StratIntl = {
  source: `${SF} – điều chỉnh theo vi sinh (người lớn)`,
  items: [
    { role: "Theo vi sinh", text: "Áp xe: amoxicillin/acid clavulanic; sau đó clindamycin; sau đó linezolid (theo thứ tự ưu tiên)", ref: SF },
    { role: "Theo vi sinh", text: "Clindamycin", dose: SF_CLINDA_DOSE, ref: SF },
    { role: "Theo vi sinh", text: "Viêm mô tế bào: theo kết quả cấy (hiếm khi trực khuẩn đường ruột hoặc P. aeruginosa), luôn giữ phủ kỵ khí", ref: SF },
  ],
};
export const SFORL_SOURCE = "Société Française d'ORL et de Chirurgie de la Face et du Cou (SFORL), phối hợp SPILF, SFM, CIREOL, SFCTCV. Prise en charge des infections cervicales profondes d'origine pharyngée – Recommandation de pratique clinique (2024).";

/* ---------- Đồng thuận liên hội Nhi khoa Ý 2025 ---------- */
const IT_SIN = "Nhi khoa Ý 2025";
export const ITALY_SINUSITIS: StratIntl = {
  source: "Đồng thuận liên hội Nhi khoa Ý 2025 – viêm xoang cấp trẻ em",
  items: [
    { role: "Chọn một", text: "Amoxicillin (khởi phát từ 2 triệu chứng kéo dài ít nhất 10 ngày không cải thiện) hoặc amoxicillin/acid clavulanic (nặng lên sau khi đã đỡ, hoặc khởi phát nặng)",
      dose: "90 mg/kg/ngày (tính theo amoxicillin) uống, ưu tiên chia 3 lần", course: "Ít nhất 10 ngày", grade: "T:Yếu · rất thấp", ref: IT_SIN },
    { role: "Thất bại sau 48–72 giờ", text: "Đang dùng amoxicillin: chuyển amoxicillin/acid clavulanic. Đang dùng amoxicillin/acid clavulanic: cephalosporin thế hệ 2 hoặc 3 (cefixim, cefpodoxim, cefuroxim) phối hợp clindamycin", grade: "T:Yếu · thấp", ref: IT_SIN },
    { role: "Dị ứng penicilin – nguy cơ thấp", text: "Cephalosporin thế hệ 3 uống (cefixim, cefpodoxim, ceftibuten), ít nhất 10 ngày; tránh macrolid. Quinolon chỉ cho thể khởi phát nặng kèm nguy cơ dị ứng cao, có hội chẩn truyền nhiễm nhi", al: "alt", grade: "T:Yếu · rất thấp", ref: IT_SIN },
    { role: "Không dùng", text: "Macrolid và trimethoprim-sulfamethoxazol theo kinh nghiệm (tỷ lệ kháng cao); kháng sinh tại chỗ", grade: "T:Mạnh · thấp", ref: IT_SIN },
  ],
};
export const ITALY_SINUSITIS_SOURCE = "Venturini E, et al. Treatment of sinusitis in children: an Italian intersociety consensus (SIPPS-SIP-SITIP-FIMP-SIAIP-SIMRI-SIM-FIMMG). Ital J Pediatr 2025;51:102.";

const IT_AOM = "Nhi khoa Ý 2025";
export const ITALY_AOM: StratIntl = {
  source: "Đồng thuận liên hội Nhi khoa Ý 2025 – viêm tai giữa cấp trẻ em",
  items: [
    { role: "Ghi chú", text: "Kháng sinh ngay: trẻ dưới 6 tháng; 6–24 tháng viêm hai bên; chảy mủ tai, viêm hai bên nặng hoặc có triệu chứng toàn thân. Các trường hợp khác trên 6 tháng: theo dõi 48–72 giờ nếu bảo đảm tái khám.", grade: "T:Mạnh · TB", ref: IT_AOM },
    { role: "Chọn một", text: "Amoxicillin", dose: "80–90 mg/kg/ngày uống, chia 3 lần (có thể chia 2 lần nếu giúp tuân thủ)",
      course: "5 ngày nếu trên 2 tuổi, không chảy mủ, không hai bên, không tái phát, không nặng; 7–10 ngày nếu nguy cơ cao hoặc nặng", grade: "T:Mạnh · thấp", ref: IT_AOM },
    { role: "Thất bại hoặc tái phát trong 30 ngày", text: "Amoxicillin/acid clavulanic kèm amoxicillin thường",
      dose: "Amoxicillin/acid clavulanic 40 mg/kg/ngày (tính theo amoxicillin) + amoxicillin 50 mg/kg/ngày, chia 3 lần (acid clavulanic dưới 10 mg/kg/ngày)", grade: "T:Mạnh · TB", ref: IT_AOM },
    { role: "Thủng màng nhĩ tự phát, chảy mủ, thể nặng", text: "Amoxicillin/acid clavulanic kèm amoxicillin thường (cùng liều như trên)", grade: "T:Yếu · thấp", ref: IT_AOM },
    { role: "Viêm tai giữa tái diễn", text: "Amoxicillin/acid clavulanic 7–10 ngày; không dự phòng kháng sinh thường quy", grade: "T:Yếu · TB", ref: IT_AOM },
    { role: "Dị ứng penicilin", text: "Cefuroxim hoặc cefpodoxim proxetil sau phân tầng nguy cơ dị ứng; macrolid hoặc clindamycin chỉ khi nguy cơ dị ứng cao", al: "alt", grade: "T:Mạnh · rất thấp", ref: IT_AOM },
    { role: "Không dùng", text: "Kháng sinh đường tiêm cho viêm tai giữa không biến chứng; nhỏ tai kháng sinh khi thủng màng nhĩ tự phát", grade: "T:Mạnh · TB", ref: IT_AOM },
  ],
};
export const ITALY_AOM_SOURCE = "Castelli Gattinara G, et al. Antibiotic treatment of acute and recurrent otitis media in children: an Italian intersociety Consensus. Ital J Pediatr 2025;51:50.";

/* ---------- IDSA 2025 – viêm họng liên cầu nhóm A, phần 1 ---------- */
export const IDSA25_GAS_SCORE: Item = {
  role: "Thang điểm lâm sàng",
  text: "Dùng thang điểm Centor hoặc McIsaac để quyết định ai cần xét nghiệm liên cầu nhóm A, chủ yếu để loại người nguy cơ thấp. Không áp dụng cho trẻ dưới 3 tuổi. Vẫn nên xét nghiệm dù điểm thấp nếu tiếp xúc hộ gia đình với người nhiễm, tiền sử thấp tim, hoặc nghi biến chứng (áp xe quanh amidan, sau họng, tinh hồng nhiệt, sốc nhiễm độc).",
  grade: "T:Có điều kiện · rất thấp",
  ref: "IDSA 2025",
};
export const IDSA25_GAS_SOURCE = "Linder JA, et al. 2025 Clinical Practice Guideline Update by the IDSA on Group A Streptococcal Pharyngitis: Risk Assessment Using Clinical Scoring Systems in Children and Adults. Clin Infect Dis 2026;82:i97–104.";
