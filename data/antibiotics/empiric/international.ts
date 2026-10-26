/*
  FILE: data/antibiotics/empiric/international.ts

  KHUYEN CAO QUOC TE THEO MAT BENH (Tab 2) – Buoc 4A Guideline Version Engine.

  Nguyen tac:
  - Chi ghi noi dung da DOC TRUC TIEP tu nguon chinh thuc (trang hoi chuyen nganh,
    PDF guideline, PMC) ngay 25/10/2026. Dich sang tieng Viet, giu nguyen thuoc/lieu.
  - status "extracted": da trich khuyen cao; "identified": moi xac minh ton tai/phien
    ban, CHUA trich khuyen cao; "module": noi dung nam trong module rieng da co.
  - Khong tron phuong an nhieu nguon thanh phac do moi. Moi muc ghi guidelineId + vi tri.
  - Day la huong dan quoc te, CHUA phai phac do BV199 phe duyet.
*/

export type IntlStatus = "extracted" | "identified" | "module";

export type IntlGuideline = {
  id: string;
  org: string;
  title: string;
  citation: string;
  published: string;
  url: string;
  status: IntlStatus;
  checkedOn: string;
  checkNote: string;
};

export type IntlRec = {
  text: string;
  grade?: string;
  guidelineId: string;
  locator: string;
};

export type IntlRegimen = {
  /* Buoc 4D.4: loai noi dung – khong coi lieu thu nghiem/dieu tri dich la phac do kinh nghiem. */
  kind?: "empiric" | "pathogen-directed" | "trial-dosing";
  scenario: string;
  options: string[];
  note?: string;
  guidelineId: string;
  locator: string;
};

export type IntlEntry = {
  diseaseId: string;
  guidelineIds: string[];
  scope: string;
  recommendations: IntlRec[];
  regimens: IntlRegimen[];
  /* Noi dung quoc te da co san trong module rieng. */
  module?: "abrs" | "ent" | "dtr";
  gaps?: string[];
};

const CHECKED = "25/10/2026";

/* Dong thuan vancomycin 2020 – chi ap dung khi nghi/xac dinh MRSA nang (Buoc 4D.1). */
const VANCO_RECS: IntlRec[] = [
  { text: "Vancomycin – nghi hoặc xác định nhiễm MRSA nặng: đích AUC24/MIC 400–600 mg·h/L, giả định MIC (vi pha loãng) = 1 mg/L. Nồng độ thuốc ghi bằng mg/L. Phạm vi: nhiễm MRSA nặng (trích phần người lớn; đích/liều trẻ em chưa trích); không áp dụng mặc định cho viêm màng não – WHO 2026 dùng nồng độ đáy (xem mặt bệnh viêm màng não).", grade: "A-II", guidelineId: "ashp-idsa-vanco-2020", locator: "Khuyến cáo AUC, PDF tr. 6" },
  { text: "Vancomycin – người lớn, chức năng thận bình thường, giả định MIC 1 mg/L: 15–20 mg/kg (cân nặng thực) mỗi 8–12 giờ, truyền ngắt quãng.", grade: "A-II", guidelineId: "ashp-idsa-vanco-2020", locator: "PDF tr. 6" },
  { text: "Vancomycin – không còn khuyến cáo theo dõi chỉ bằng nồng độ đáy với đích 15–20 mg/L trong nhiễm MRSA nặng (dữ liệu hiệu quả và độc tính thận).", grade: "A-II", guidelineId: "ashp-idsa-vanco-2020", locator: "Khuyến cáo 4, PDF tr. 7" },
  { text: "Vancomycin – người lớn bệnh nặng nghi/xác định MRSA nặng: có thể dùng liều nạp 20–35 mg/kg theo cân nặng thực, không quá 3.000 mg.", grade: "B-II", guidelineId: "ashp-idsa-vanco-2020", locator: "Mục Loading Doses, PDF tr. 10" },
];

/* ---- Buoc 4D Nhom 2: nguon doc truc tiep ngay 25/10/2026 ---- */
const WHO_MEN = "who-meningitis-2025";
const WHO_MAN = "who-meningitis-manual-2026";
const SAB = "idsa-escmid-sab-2026";
const ECIL = "ecil10-2025";
const IPFN = "ipfn-2023";

/* ---- Buoc 4D Nhom 3 ---- */
const CHECKED_G3 = "26/10/2026";
const ESC_IE = "esc-ie-2023";
const EAU_UI = "eau-ui-2026";
const PIDS_ABA = "pids-idsa-aba-2023";
const CUTI = "idsa-cuti-2025";

/* ---- Master Task 5 – Nhom 4 ---- */
const CHECKED_G4 = "26/10/2026";
const GOLD = "gold-2026";
const WHO_TB = "who-tb-module4-2025";
const AAO_BK = "aao-keratitis-2023";
const AAO_CONJ = "aao-conjunctivitis-2023";
const WHO_CRYPTO = "who-crypto-2022";
const IDSA_ASB = "idsa-asb-2019";
const CDC_STI = "cdc-sti-bv-2021";
const IDSA_DIARRHEA = "idsa-diarrhea-2017";
const CDC_OUT = "cdc-outpatient-2024";

const CUTI_TABLES: IntlRegimen[] = [
  {
    kind: "empiric",
    scenario: "Lựa chọn kinh nghiệm theo tình trạng người bệnh (trước khi áp dụng 4 bước chọn thuốc)",
    options: [
      "Sepsis có/không sốc – ưu tiên: cephalosporin thế hệ 3 hoặc 4, carbapenem, piperacillin-tazobactam, fluoroquinolon; thay thế: beta-lactam/ức chế beta-lactamase mới, cefiderocol, plazomicin, aminoglycosid cũ",
      "Không sepsis, đường tĩnh mạch – ưu tiên: cephalosporin thế hệ 3 hoặc 4, piperacillin-tazobactam, fluoroquinolon; thay thế: carbapenem, thuốc mới, aminoglycosid cũ",
      "Không sepsis, đường uống – ưu tiên: fluoroquinolon hoặc trimethoprim-sulfamethoxazol; thay thế: amoxicillin-clavulanat hoặc cephalosporin uống",
    ],
    note: "4 bước chọn thuốc: (1) mức độ nặng, (2) yếu tố nguy cơ kháng thuốc, (3) đặc điểm người bệnh, (4) nếu sepsis: xem antibiogram – sốc cần ≥ 90% nhạy, sepsis không sốc ≥ 80% nhạy. Nitrofurantoin và fosfomycin uống thường không phù hợp cho NKTN phức tạp.",
    guidelineId: CUTI,
    locator: "Table 1.1",
  },
  {
    kind: "trial-dosing",
    scenario: "Liều tĩnh mạch đã dùng trong thử nghiệm lâm sàng (chức năng thận bình thường) – KHÔNG phải bảng liều khuyến cáo",
    options: [
      "cefepim 1–2 g mỗi 8–12 giờ; cefotaxim 1–2 g mỗi 8 giờ; ceftazidim 1–2 g mỗi 8 giờ; ceftriaxon 1–2 g mỗi ngày",
      "ertapenem 1 g mỗi ngày; imipenem-cilastatin 500 mg mỗi 6 giờ hoặc 1 g mỗi 8 giờ; meropenem 1 g mỗi 8 giờ",
      "piperacillin-tazobactam 4,5 g mỗi 8 giờ; fosfomycin 6 g mỗi 8 giờ; plazomicin 10–15 mg/kg mỗi ngày",
      "cefepime-enmetazobactam 2 g/0,5 g truyền 2 giờ mỗi 8 giờ; cefiderocol 2 g truyền 3 giờ mỗi 8 giờ; ceftazidime-avibactam 2,5 g truyền 2 giờ mỗi 8 giờ; ceftolozane-tazobactam 1,5 g mỗi 8 giờ; imipenem-cilastatin-relebactam 500/125 mg mỗi 6 giờ; meropenem-vaborbactam 2 g/2 g truyền 3 giờ mỗi 8 giờ",
    ],
    guidelineId: CUTI,
    locator: "Table 2.1",
  },
  {
    kind: "empiric",
    scenario: "Liều uống cho NKTN phức tạp (chức năng thận bình thường)",
    options: [
      "ciprofloxacin 500–750 mg mỗi 12 giờ; levofloxacin 500–750 mg mỗi ngày",
      "trimethoprim-sulfamethoxazol 800 mg/160 mg mỗi 12 giờ",
      "amoxicillin-clavulanat 875/125 mg mỗi 12–8 giờ; cefalexin 500–1000 mg mỗi 6 giờ (bảng ghi: phác đồ khác có thể hiệu quả hơn)",
      "cefixim 400 mg mỗi ngày; cefpodoxim 200–400 mg mỗi 12 giờ; ceftibuten 400 mg mỗi ngày hoặc 200 mg mỗi 12 giờ (người lớn), 9 mg/kg mỗi ngày (trẻ em); cefuroxim 500 mg mỗi 12 giờ",
    ],
    note: "Chú thích a: phần lớn nghiên cứu chuyển sang beta-lactam uống (chủ yếu amoxicillin-clavulanat, cefalexin) cho kết quả kém hơn so với fluoroquinolon hoặc TMP-SMX. Beta-lactam uống khác (amoxicillin, cefadroxil, cefaclor, cefdinir): dữ liệu hạn chế – chỉ dùng khi có dược sĩ nhiễm khuẩn tư vấn.",
    guidelineId: CUTI,
    locator: "Table 1.2",
  },
];

const EAU_PYELO: IntlRegimen[] = [
  {
    kind: "empiric",
    scenario: "Viêm thận bể thận – kinh nghiệm đường uống (EAU 2026)",
    options: [
      "ciprofloxacin 500–750 mg x 2 lần/ngày, 7 ngày (tỷ lệ kháng fluoroquinolon nên < 10%)",
      "levofloxacin 500 mg x 1 lần/ngày (liều chuẩn) hoặc 500 mg x 2 lần/ngày (liều cao), 5 ngày",
      "trimethoprim-sulfamethoxazol 160/800 mg x 2 lần/ngày, 14 ngày; cefpodoxim 200 mg x 2 lần/ngày, 10 ngày; ceftibuten 400 mg x 1 lần/ngày, 10 ngày – nếu dùng kinh nghiệm, cần 1 liều tĩnh mạch ban đầu của kháng sinh tác dụng kéo dài (ví dụ ceftriaxon)",
    ],
    guidelineId: EAU_UI,
    locator: "Bảng 5, PDF tr. 28",
  },
  {
    kind: "empiric",
    scenario: "Viêm thận bể thận – kinh nghiệm đường tiêm (EAU 2026)",
    options: [
      "Hàng 1: ciprofloxacin 400 mg x 2 lần/ngày; levofloxacin 500 mg x 1 lần/ngày (liều chuẩn) hoặc x 2 lần/ngày (liều cao) [bảng ghi \"oral\" – nguyên văn]; cefotaxim 2 g x 3 lần/ngày; ceftriaxon 2 g x 1 lần/ngày (liều chuẩn) hoặc 2 g x 2 lần/ngày (liều cao)",
      "Hàng 2: cefepim 1 g x 3 lần/ngày hoặc 2 g x 2 lần/ngày (liều cao 2 g x 3 lần/ngày); piperacillin-tazobactam 4,5 g x 3 lần/ngày (liều cao 4,5 g x 4 lần/ngày truyền kéo dài); gentamicin 6–7 mg/kg x 1 lần/ngày; amikacin 25–30 mg/kg x 1 lần/ngày",
      "Lựa chọn cuối (chỉ khi cấy sớm cho thấy vi khuẩn đa kháng): imipenem-cilastatin 0,5 g x 4 lần/ngày (liều cao 1 g x 4) truyền 30 phút; meropenem 1 g x 3 lần/ngày; ceftolozane-tazobactam 1,5 g x 3; ceftazidime-avibactam 2,5 g x 3; cefiderocol 2 g x 3; meropenem-vaborbactam 2 g x 3; plazomicin 15 mg/kg x 1 lần/ngày",
    ],
    note: "Cefotaxim, gentamicin: chưa nghiên cứu đơn trị trong viêm thận bể thận cấp. Ceftriaxon, cefepim: liều thấp đã được nghiên cứu nhưng khuyến cáo liều cao hơn.",
    guidelineId: EAU_UI,
    locator: "Bảng 6, PDF tr. 28–29",
  },
];

const EAU_SYSTEMIC_RECS: IntlRec[] = [
  { text: "NKTN toàn thân – kinh nghiệm tĩnh mạch: amoxicillin + aminoglycosid; cephalosporin thế hệ 2 + aminoglycosid; hoặc cephalosporin thế hệ 3.", grade: "Mạnh", guidelineId: EAU_UI, locator: "Mục 3.7.4, PDF tr. 32" },
  { text: "Ciprofloxacin chỉ dùng khi tỷ lệ kháng tại chỗ < 10% VÀ có chống chỉ định cephalosporin thế hệ 3/aminoglycosid hoặc dị ứng beta-lactam. Không dùng fluoroquinolon kinh nghiệm cho người bệnh từ khoa tiết niệu hoặc đã dùng fluoroquinolon trong 6 tháng.", grade: "Mạnh", guidelineId: EAU_UI, locator: "Mục 3.7.4, PDF tr. 32" },
  { text: "Bao phủ ESBL theo kinh nghiệm khi khả năng ESBL tăng (tỷ lệ cộng đồng, cấy nước tiểu trước, đã dùng kháng sinh). Người bệnh nặng, xấu đi hoặc nghi tắc nghẽn đường tiết niệu: carbapenem (imipenem 500 mg TM mỗi 6 giờ hoặc meropenem 1 g TM mỗi 8 giờ), thêm vancomycin hoặc thuốc thay thế nếu cần bao phủ MRSA; thu hẹp khi có kháng sinh đồ.", grade: "LE 2", guidelineId: EAU_UI, locator: "Mục 3.7.3.a.2 và 3.7.4, PDF tr. 30–31" },
  { text: "Xử trí bất thường tiết niệu và yếu tố phức tạp (tắc nghẽn, sỏi, ống thông…).", grade: "Mạnh", guidelineId: EAU_UI, locator: "Mục 3.7.4, PDF tr. 32" },
  { text: "Thời gian (điều trị theo tác nhân): thường 5–10 ngày; cải thiện trong 48–72 giờ: fluoroquinolon 5–7 ngày, TMP-SMX 7–10 ngày, beta-lactam 7–10 ngày. Nam giới: 7 ngày kém hơn 14 ngày. Không cải thiện sau 48–72 giờ: đánh giá biến chứng, bất thường giải phẫu; chẩn đoán hình ảnh cắt lớp.", guidelineId: EAU_UI, locator: "Mục 3.7.3.a.4, 3.7.3.a.6, PDF tr. 31" },
];

export const INTL_GUIDELINES: Record<string, IntlGuideline> = {
  "atsidsa-cap-2019": {
    id: "atsidsa-cap-2019",
    org: "ATS/IDSA",
    title: "Diagnosis and Treatment of Adults with Community-acquired Pneumonia",
    citation: "Metlay JP và cs. Am J Respir Crit Care Med 2019;200(7):e45–e67. PMCID: PMC6812437",
    published: "01/10/2019",
    url: "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults/",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Trang IDSA ghi trạng thái CURRENT. Phác đồ và liều đọc từ Table 3–4 (PMC6812437).",
  },
  "atsidsa-hapvap-2016": {
    id: "atsidsa-hapvap-2016",
    org: "ATS/IDSA",
    title: "Management of Adults With Hospital-acquired and Ventilator-associated Pneumonia",
    citation: "Kalil AC và cs. Clin Infect Dis 2016;63(5):e61–e111",
    published: "14/07/2016",
    url: "https://www.idsociety.org/practice-guideline/hap_vap/",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Trang IDSA ghi trạng thái CURRENT (có 3 đính chính năm 2017). Liều Table 3 (VAP) và Table 4 (HAP) cùng các mục XIII, XIV, XXI–XXIII đọc từ toàn văn PMC4981759 ngày 25/10/2026 (Bước 4D). Kiểm tra lại 26/10/2026 (Master Task 6): vẫn CURRENT, không có bản cập nhật đang triển khai trên trang IDSA.",
  },
  "ashp-idsa-vanco-2020": {
    id: "ashp-idsa-vanco-2020",
    org: "ASHP/IDSA/PIDS/SIDP",
    title: "Therapeutic monitoring of vancomycin for serious MRSA infections: a revised consensus guideline and review",
    citation: "Rybak MJ và cs. Am J Health-Syst Pharm 2020;77(11):835–864. doi:10.1093/ajhp/zxaa036",
    published: "19/03/2020",
    url: "https://www.idsociety.org/practice-guideline/vancomycin/",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Trích dẫn đọc trên trang IDSA; khuyến cáo đọc từ PDF chính thức trên ashp.org (31 trang): khuyến cáo AUC (PDF tr. 6), khuyến cáo 4 (tr. 7), liều nạp (tr. 10).",
  },
  "ssc-2026": {
    id: "ssc-2026",
    org: "SCCM/ESICM – Surviving Sepsis Campaign",
    title: "International Guidelines for Management of Sepsis and Septic Shock 2026",
    citation: "Prescott H và cs. Crit Care Med 2026. doi:10.1097/CCM.0000000000007075",
    published: "23/03/2026",
    url: "https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Đọc trên trang SCCM. SSC không đưa phác đồ thuốc/liều cụ thể.",
  },
  "idsa-cuti-2025": {
    id: "idsa-cuti-2025",
    org: "IDSA",
    title: "IDSA 2025 Guideline Update on Complicated Urinary Tract Infections",
    citation: "Trautner BW và cs. IDSA 2025",
    published: "17/07/2025",
    url: "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Khuyến cáo đọc trên trang IDSA. Bước 4D Nhóm 3 (26/10/2026): đã đọc ảnh Bảng 1.1 (thuốc kinh nghiệm), 2.1 (liều tĩnh mạch – LIỀU DÙNG TRONG THỬ NGHIỆM LÂM SÀNG, không phải bảng liều khuyến cáo) và 1.2 (liều uống) từ tệp chính thức trên idsociety.org.",
  },
  "idsa-amr-2026": {
    id: "idsa-amr-2026",
    org: "IDSA",
    title: "IDSA 2026 Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections (v5.0)",
    citation: "Tamma PD và cs. Clin Infect Dis 2026. doi:10.1093/cid/ciag481",
    published: "30/07/2026 (cập nhật đến 01/03/2026)",
    url: "https://www.idsociety.org/practice-guideline/amr-guidance/",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Khuyến cáo đọc trên trang IDSA; liều từ Table 1 (PDF v5.0) – người lớn, chức năng gan thận bình thường.",
  },
  "idsa-ssti-2014": {
    id: "idsa-ssti-2014",
    org: "IDSA",
    title: "Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections",
    citation: "Stevens DL và cs. Clin Infect Dis 2014;59(2):e10–e52",
    published: "15/07/2014",
    url: "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Trang IDSA ghi trạng thái CURRENT. Bảng liều (Table 2) chưa trích xuất.",
  },
  "iwgdf-idsa-2023": {
    id: "iwgdf-idsa-2023",
    org: "IWGDF/IDSA",
    title: "Guidelines on the diagnosis and treatment of diabetes-related foot infections (IWGDF/IDSA 2023)",
    citation: "Senneville É và cs. IWGDF/IDSA 2023",
    published: "2023",
    url: "https://iwgdfguidelines.org/wp-content/uploads/2023/07/IWGDF-2023-04-Infection-Guideline.pdf",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Đọc từ PDF chính thức trên iwgdfguidelines.org. Guideline không nêu liều cụ thể.",
  },
  "sis-iai-2024": {
    id: "sis-iai-2024",
    org: "Surgical Infection Society",
    title: "The Surgical Infection Society Guidelines on the Management of Intra-Abdominal Infection: 2024 Update",
    citation: "Huston JM và cs. Surg Infect (Larchmt) 2024;25(6):419–435. doi:10.1089/sur.2024.137. PMID 38990709",
    published: "11/07/2024",
    url: "https://doi.org/10.1089/sur.2024.137",
    status: "identified",
    checkedOn: CHECKED,
    checkNote: "Xác minh trích dẫn qua Europe PMC. Toàn văn cần thuê bao – CHƯA trích xuất khuyến cáo.",
  },
  "uptodate-abrs": {
    id: "uptodate-abrs",
    org: "UpToDate",
    title: "Graphic 106156 – ABRS ngoại trú, người lớn (Version 16.0)",
    citation: "UpToDate Graphic 106156, v16.0 (bản do người dùng cung cấp)",
    published: "2026",
    url: "",
    status: "module",
    checkedOn: "13/10/2026",
    checkNote: "Nội dung trong module AbrsUpToDate2026 (đối chiếu trước đây). Không phải guideline hội chuyên ngành.",
  },
  "ent-module": {
    id: "ent-module",
    org: "CDC / NICE",
    title: "Viêm họng liên cầu nhóm A (CDC cập nhật 18/11/2025); viêm tai giữa cấp trẻ em (NICE NG91)",
    citation: "Theo module EntEmpiricGuidelines",
    published: "2025 (CDC); NG91 (NICE)",
    url: "",
    status: "module",
    checkedOn: "13/10/2026",
    checkNote: "Đã đối chiếu ngày 13/10/2026 theo ghi chú trạng thái module. Lần này chưa kiểm tra lại (trang NICE chặn truy cập tự động).",
  },
  [WHO_MEN]: {
    id: WHO_MEN,
    org: "WHO",
    title: "WHO guidelines on meningitis diagnosis, treatment and care",
    citation: "World Health Organization, Geneva 2025. ISBN 978-92-4-010804-2. Kho IRIS: handle 10665/381006",
    published: "04/04/2025",
    url: "https://iris.who.int/handle/10665/381006",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "PDF tải từ iris.who.int. Phạm vi: viêm màng não cấp mắc phải cộng đồng ở trẻ > 1 tháng tuổi, thanh thiếu niên, người lớn. Hướng dẫn không ghi liều cụ thể (dẫn chiếu \"liều tối đa\"; ceftriaxon mỗi 12 giờ). Khuyến cáo đọc ở Executive summary, PDF tr. 18–23, và mục B.2.1, PDF tr. 57–58.",
  },
  [WHO_MAN]: {
    id: WHO_MAN,
    org: "WHO",
    title: "WHO practical manual on meningitis diagnosis, treatment and care",
    citation: "World Health Organization, Geneva 2026. ISBN 978-92-4-012102-7. Kho IRIS: handle 10665/386139",
    published: "25/05/2026",
    url: "https://iris.who.int/handle/10665/386139",
    status: "extracted",
    checkNote: "PDF tải từ iris.who.int. Liều đọc từ ảnh trang: Hình 12 (tr. in 31), mục 7.5 (tr. in 33–34), Bảng 10–11 (tr. in 34–36). Liều cho chức năng gan thận bình thường; có liều sơ sinh.",
    checkedOn: CHECKED,
  },
  [SAB]: {
    id: SAB,
    org: "IDSA/ESCMID",
    title: "IDSA/ESCMID 2026 Consensus Statements on Staphylococcus aureus Bacteremia: Risk Stratification, Diagnostic Evaluation, and Management of Adults and Children (Part 1)",
    citation: "Liu C, Chambers HF, Vandenesch F, Kern WV và cs. IDSA 2026. Được ASHP, ESCMID, PIDS, SHEA, SIDP thông qua",
    published: "09/09/2026",
    url: "https://www.idsociety.org/practice-guideline/staphylococcus-aureus-bacteremia/",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Trang IDSA ghi CURRENT, Part 1 (7 đồng thuận: phân tầng nguy cơ, cấy máu kiểm tra, siêu âm tim qua thành ngực/qua thực quản, chẩn đoán hình ảnh toàn thân, thời gian điều trị). Lựa chọn thuốc MSSA/MRSA sẽ ở bản sau – CHƯA có. IDSA MRSA 2011 đã chuyển trạng thái ARCHIVED.",
  },
  [ECIL]: {
    id: ECIL,
    org: "ECIL (ECIL-10)",
    title: "Empirical and targeted antimicrobial therapy in patients with febrile neutropenia and haematological malignancy or after haematopoietic cell transplantation: recommendations from the 10th European Conference on Infections in Leukaemia",
    citation: "Averbuch D và cs. Lancet Infect Dis 2025. doi:10.1016/S1473-3099(25)00619-X. Bộ slide khuyến cáo chính thức trên ecil-leukaemia.com",
    published: "25/11/2025",
    url: "https://ecil-leukaemia.com/images/ecil-10/ECIL_10_-_bacterial_group_final_recommendations.pdf",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Bài báo Lancet Infect Dis cần thuê bao (403). Khuyến cáo đọc từ bộ slide cuối cùng (44 slide) trên trang ECIL: slide 9–12, 14–15, 21. Phạm vi: người bệnh ung thư huyết học/ghép tế bào gốc. Không ghi liều. IDSA 2010 (sốt giảm bạch cầu) mà QĐ 708 dẫn chiếu đã chuyển ARCHIVED.",
  },
  [IPFN]: {
    id: IPFN,
    org: "International Pediatric Fever and Neutropenia Guideline Panel",
    title: "Guideline for the Management of Fever and Neutropenia in Pediatric Patients With Cancer and Hematopoietic Cell Transplantation Recipients: 2023 Update",
    citation: "Lehrnbecher T và cs. J Clin Oncol 2023;41(9):1774–1785. doi:10.1200/JCO.22.02224. PMCID: PMC10022858",
    published: "23/01/2023",
    url: "https://doi.org/10.1200/JCO.22.02224",
    status: "extracted",
    checkedOn: CHECKED,
    checkNote: "Toàn văn mở (Europe PMC PMC10022858). Phạm vi: trẻ em ung thư và ghép tế bào gốc. Không ghi liều.",
  },
  /* ---- Buoc 4D Nhom 3: doc ngay 26/10/2026 ---- */
  [ESC_IE]: {
    id: ESC_IE,
    org: "ESC (Hội Tim mạch châu Âu)",
    title: "2023 ESC Guidelines for the management of endocarditis",
    citation: "Delgado V và cs. Eur Heart J 2023;44(39):3948–4042. doi:10.1093/eurheartj/ehad193",
    published: "25/08/2023",
    url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/endocarditis/",
    status: "extracted",
    checkedOn: CHECKED_G3,
    checkNote: "Trang escardio.org xác nhận là bản hiện hành (thay bản 2015). Mục 7.12 (Empirical therapy, tr. 3984) đọc từ trang bài báo; Bảng khuyến cáo 10 (tr. 3985) đọc từ ảnh bảng của nhà xuất bản (oup.silverchair-cdn.com). Chú thích d, e của Bảng 10 (gentamicin, vancomycin) KHÔNG đọc được – CHƯA XÁC MINH. Bảng điều trị theo tác nhân chưa trích.",
  },
  [EAU_UI]: {
    id: EAU_UI,
    org: "EAU (Hội Tiết niệu châu Âu)",
    title: "EAU Guidelines on Urological Infections – Limited Update March 2026",
    citation: "European Association of Urology, 2026. Bản đầy đủ (105 trang) trên uroweb.org",
    published: "03/2026",
    url: "https://uroweb.org/guidelines/urological-infections",
    status: "extracted",
    checkedOn: CHECKED_G3,
    checkNote: "PDF chính thức tải từ liên kết trên uroweb.org. Đọc mục 3.6.3 (viêm thận bể thận, Bảng 5–6, PDF tr. 28–29) và 3.7 (NKTN toàn thân, PDF tr. 30–32). Bảng 6 ghi levofloxacin ở dòng tĩnh mạch là \"500mg oral\" – nguyên văn, nghi lỗi in.",
  },
  [PIDS_ABA]: {
    id: PIDS_ABA,
    org: "PIDS/IDSA",
    title: "Clinical Practice Guideline by PIDS and IDSA: 2023 Guideline on Diagnosis and Management of Acute Bacterial Arthritis in Pediatrics",
    citation: "Woods CR và cs. J Pediatric Infect Dis Soc 2024;13(1):1–59. doi:10.1093/jpids/piad089 (đính chính piae065, 07/2024)",
    published: "13/12/2023",
    url: "https://www.idsociety.org/practice-guideline/acute-bacterial-arthritis-in-pediatrics2/",
    status: "extracted",
    checkedOn: CHECKED_G3,
    checkNote: "Trang IDSA ghi CURRENT. Khuyến cáo đọc trên trang IDSA. Bảng 4 (thuốc theo tác nhân) và Bảng 5 (liều) không có trên trang – liều CHƯA trích. Chỉ áp dụng trẻ em.",
  },
  /* ---- Master Task 5 – Nhom 4: doc truc tiep ngay 26/10/2026 ---- */
  [GOLD]: {
    id: GOLD,
    org: "GOLD",
    title: "Global Strategy for Prevention, Diagnosis and Management of COPD: 2026 Report",
    citation: "Global Initiative for Chronic Obstructive Lung Disease. GOLD Report 2026, v1.3 (08/12/2025)",
    published: "2026 (bản v1.3, 08/12/2025)",
    url: "https://goldcopd.org/2026-gold-report/",
    status: "extracted",
    checkedOn: CHECKED_G4,
    checkNote: "Tải PDF GOLD-REPORT-2026-v1.3 từ goldcopd.org; trích Chương 4 – Antibiotics (tr. in 104) và Key points (tr. in 91). GOLD không nêu liều cụ thể.",
  },
  [WHO_TB]: {
    id: WHO_TB,
    org: "WHO",
    title: "WHO consolidated guidelines on tuberculosis. Module 4: treatment and care",
    citation: "Geneva: World Health Organization; 2025. ISBN 978-92-4-010724-3",
    published: "2025",
    url: "https://tbksp.who.int/en/node/2951",
    status: "identified",
    checkedOn: CHECKED_G4,
    checkNote: "Xác nhận phiên bản 2025 và cấu trúc Chương 1 (lao nhạy cảm thuốc: phác đồ 6 tháng, phác đồ 4 tháng, ART, corticoid bổ trợ lao màng não/màng tim) trên WHO TB Knowledge Sharing Platform. Nội dung khuyến cáo hiển thị dạng ảnh; PDF trên who.int/iris trả lỗi 403 – CHƯA trích nguyên văn khuyến cáo phác đồ.",
  },
  [AAO_BK]: {
    id: AAO_BK,
    org: "AAO",
    title: "Bacterial Keratitis Preferred Practice Pattern (P88)",
    citation: "American Academy of Ophthalmology. Ophthalmology 2024;131(4):P87–P133",
    published: "Duyệt 22/09/2023",
    url: "https://aao.org/Assets/6dd86c3a-c71f-44c8-aec1-fd833faca6d2/638434423305070000/bacterial-keratitis-ppp-pdf",
    status: "extracted",
    checkedOn: CHECKED_G4,
    checkNote: "Đọc PDF AAO. Bảng 4 (nồng độ theo tác nhân) bị lệch cột khi trích văn bản – KHÔNG nhập nồng độ từ bảng.",
  },
  [AAO_CONJ]: {
    id: AAO_CONJ,
    org: "AAO",
    title: "Conjunctivitis Preferred Practice Pattern (P135)",
    citation: "American Academy of Ophthalmology, 2023",
    published: "Duyệt 22/09/2023",
    url: "https://aao.org/Assets/76c4baa7-869e-42ad-9ffc-215781185a7b/638434228319430000/conjunctivitis-ppp-pdf",
    status: "extracted",
    checkedOn: CHECKED_G4,
    checkNote: "Đọc PDF AAO, mục Bacterial Conjunctivitis (tr. P176–P177).",
  },
  [WHO_CRYPTO]: {
    id: WHO_CRYPTO,
    org: "WHO",
    title: "Guidelines for diagnosing, preventing and managing cryptococcal disease among adults, adolescents and children living with HIV",
    citation: "Geneva: World Health Organization; 06/2022",
    published: "06/2022",
    url: "https://www.who.int/publications/i/item/9789240052178",
    status: "identified",
    checkedOn: CHECKED_G4,
    checkNote: "Xác nhận tồn tại/phiên bản qua kết quả tìm kiếm; trang who.int trả lỗi 403. Khuyến cáo tập trung viêm màng não Cryptococcus – không có nội dung đã đọc cho thể ngoài TKTW.",
  },
  [IDSA_ASB]: {
    id: IDSA_ASB,
    org: "IDSA",
    title: "Clinical Practice Guideline for the Management of Asymptomatic Bacteriuria: 2019 Update",
    citation: "Nicolle LE và cs. Clin Infect Dis 2019;68(10):e83–e110. doi:10.1093/cid/ciy1121",
    published: "21/03/2019",
    url: "https://www.idsociety.org/practice-guideline/asymptomatic-bacteriuria/",
    status: "extracted",
    checkedOn: CHECKED_G4,
    checkNote: "Đọc trang IDSA, mục III – Pregnant women.",
  },
  [CDC_STI]: {
    id: CDC_STI,
    org: "CDC",
    title: "Sexually Transmitted Infections Treatment Guidelines, 2021 – Bacterial Vaginosis",
    citation: "Workowski KA và cs. MMWR Recomm Rep 2021;70(4):1–187",
    published: "2021 (trang xem lại 22/07/2021)",
    url: "https://www.cdc.gov/std/treatment-guidelines/bv.htm",
    status: "extracted",
    checkedOn: CHECKED_G4,
    checkNote: "Đọc trực tiếp trang CDC.",
  },
  [IDSA_DIARRHEA]: {
    id: IDSA_DIARRHEA,
    org: "IDSA",
    title: "2017 Clinical Practice Guidelines for the Diagnosis and Management of Infectious Diarrhea",
    citation: "Shane AL và cs. Clin Infect Dis 2017;65(12):e45–e80. doi:10.1093/cid/cix669",
    published: "19/10/2017",
    url: "https://www.idsociety.org/practice-guideline/infectious-diarrhea/",
    status: "extracted",
    checkedOn: CHECKED_G4,
    checkNote: "Trang IDSA ghi CURRENT. Khuyến cáo 30–34, 38. Hướng dẫn không nêu liều trong các khuyến cáo này.",
  },
  [CDC_OUT]: {
    id: CDC_OUT,
    org: "CDC",
    title: "Outpatient Clinical Care for Pediatric / Adult Populations (Antibiotic Prescribing and Use)",
    citation: "CDC, trang cập nhật 22/04/2024 (trẻ em) và 16/04/2024 (người lớn)",
    published: "04/2024",
    url: "https://www.cdc.gov/antibiotic-use/hcp/clinical-care/pediatric-outpatient.html",
    status: "extracted",
    checkedOn: CHECKED_G4,
    checkNote: "Đọc trực tiếp hai trang CDC (trẻ em; người lớn: https://www.cdc.gov/antibiotic-use/hcp/clinical-care/adult-outpatient.html). CDC nêu thuốc ưu tiên/thay thế, KHÔNG nêu liều.",
  },
};

export const INTL_ENTRIES: IntlEntry[] = [
  // ================= CAP =================
  {
    diseaseId: "v8-1",
    guidelineIds: ["atsidsa-cap-2019"],
    scope: "Người lớn, viêm phổi cộng đồng, miễn dịch bình thường (Hoa Kỳ).",
    recommendations: [
      { text: "Macrolid đơn trị ngoại trú chỉ dùng ở khu vực có tỷ lệ phế cầu kháng macrolid < 25%.", guidelineId: "atsidsa-cap-2019", locator: "Question 8; Table 3 chú thích †" },
      { text: "Bệnh đồng mắc gồm: bệnh tim, phổi, gan hoặc thận mạn; đái tháo đường; nghiện rượu; bệnh ác tính; hoặc không có lách.", guidelineId: "atsidsa-cap-2019", locator: "Table 3 chú thích ‡" },
      { text: "Không thường quy bổ sung thuốc phủ kỵ khí cho nghi viêm phổi hít, trừ khi nghi áp xe phổi hoặc mủ màng phổi.", grade: "Có điều kiện; bằng chứng rất thấp", guidelineId: "atsidsa-cap-2019", locator: "Question 10" },
      { text: "Tiếp tục kháng sinh tới khi bệnh nhân ổn định và tổng thời gian không dưới 5 ngày.", guidelineId: "atsidsa-cap-2019", locator: "Question 15" },
    ],
    regimens: [
      {
        scenario: "Ngoại trú – không bệnh đồng mắc, không yếu tố nguy cơ MRSA/P. aeruginosa",
        options: [
          "Amoxicillin 1 g x 3 lần/ngày",
          "hoặc doxycyclin 100 mg x 2 lần/ngày",
          "hoặc macrolid (nếu tỷ lệ phế cầu kháng macrolid < 25%): azithromycin 500 mg ngày đầu, sau đó 250 mg/ngày; clarithromycin 500 mg x 2 lần/ngày hoặc clarithromycin phóng thích kéo dài 1.000 mg/ngày",
        ],
        guidelineId: "atsidsa-cap-2019",
        locator: "Table 3",
      },
      {
        scenario: "Ngoại trú – có bệnh đồng mắc",
        options: [
          "Phối hợp: amoxicillin/clavulanat 500/125 mg x 3 lần/ngày, 875/125 mg x 2 lần/ngày hoặc 2.000/125 mg x 2 lần/ngày; hoặc cefpodoxim 200 mg x 2 lần/ngày; hoặc cefuroxim 500 mg x 2 lần/ngày",
          "+ macrolid (azithromycin 500 mg ngày đầu rồi 250 mg/ngày; clarithromycin 500 mg x 2 lần/ngày hoặc phóng thích kéo dài 1.000 mg/ngày) hoặc doxycyclin 100 mg x 2 lần/ngày",
          "Hoặc đơn trị: levofloxacin 750 mg/ngày, moxifloxacin 400 mg/ngày hoặc gemifloxacin 320 mg/ngày",
        ],
        guidelineId: "atsidsa-cap-2019",
        locator: "Table 3",
      },
      {
        scenario: "Nội trú – không nặng (phác đồ chuẩn)",
        options: [
          "Beta-lactam: ampicillin/sulbactam 1,5–3 g mỗi 6 giờ, cefotaxim 1–2 g mỗi 8 giờ, ceftriaxon 1–2 g/ngày hoặc ceftarolin 600 mg mỗi 12 giờ",
          "+ macrolid: azithromycin 500 mg/ngày hoặc clarithromycin 500 mg x 2 lần/ngày",
          "Hoặc quinolon hô hấp đơn trị: levofloxacin 750 mg/ngày hoặc moxifloxacin 400 mg/ngày",
        ],
        guidelineId: "atsidsa-cap-2019",
        locator: "Table 4",
      },
      {
        scenario: "Nội trú – nặng (phác đồ chuẩn)",
        options: [
          "Beta-lactam + macrolid, hoặc beta-lactam + quinolon hô hấp (cùng thuốc và liều như phác đồ nội trú không nặng)",
        ],
        guidelineId: "atsidsa-cap-2019",
        locator: "Table 4",
      },
      {
        scenario: "Tiền sử phân lập MRSA đường hô hấp (không nặng và nặng)",
        options: [
          "Thêm thuốc chống MRSA và lấy bệnh phẩm cấy/PCR mũi để xuống thang: vancomycin 15 mg/kg mỗi 12 giờ (chỉnh theo nồng độ) hoặc linezolid 600 mg mỗi 12 giờ",
        ],
        note: "Nhập viện và dùng kháng sinh tiêm gần đây, có yếu tố nguy cơ MRSA đã được xác nhận tại chỗ: không nặng – cấy, chỉ bao phủ khi cấy dương tính; nặng – thêm thuốc chống MRSA.",
        guidelineId: "atsidsa-cap-2019",
        locator: "Table 4",
      },
      {
        scenario: "Tiền sử phân lập P. aeruginosa đường hô hấp (không nặng và nặng)",
        options: [
          "Thêm thuốc chống P. aeruginosa và lấy bệnh phẩm cấy để xuống thang: piperacillin-tazobactam 4,5 g mỗi 6 giờ, cefepim 2 g mỗi 8 giờ, ceftazidim 2 g mỗi 8 giờ, imipenem 500 mg mỗi 6 giờ, meropenem 1 g mỗi 8 giờ hoặc aztreonam 2 g mỗi 8 giờ",
        ],
        note: "Nhập viện và dùng kháng sinh tiêm gần đây, có yếu tố nguy cơ P. aeruginosa đã được xác nhận tại chỗ: không nặng – cấy, chỉ bao phủ khi cấy dương tính; nặng – thêm thuốc chống P. aeruginosa.",
        guidelineId: "atsidsa-cap-2019",
        locator: "Table 4",
      },
    ],
    gaps: ["NICE NG250 (Anh): chưa xác minh được – trang NICE chặn truy cập tự động ngày 25/10/2026."],
  },

  // ================= HAP =================
  {
    diseaseId: "v8-4",
    guidelineIds: ["atsidsa-hapvap-2016", "ashp-idsa-vanco-2020"],
    scope: "Người lớn, viêm phổi bệnh viện không liên quan thở máy.",
    recommendations: [
      { text: "Yếu tố nguy cơ đa kháng cần được ưu tiên hơn phân loại khởi phát sớm/muộn.", guidelineId: "atsidsa-hapvap-2016", locator: "Phần thảo luận yếu tố nguy cơ đa kháng" },
      { text: "Không nguy cơ tử vong cao, không yếu tố làm tăng khả năng MRSA: dùng một thuốc có tác dụng trên MSSA – piperacillin-tazobactam, cefepim, levofloxacin, imipenem hoặc meropenem.", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XII" },
      { text: "Khi cần bao phủ MRSA: dùng vancomycin hoặc linezolid. Yếu tố nguy cơ MRSA gồm dùng kháng sinh tĩnh mạch trong 90 ngày.", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XII" },
      { text: "Nguy cơ tử vong cao (cần hỗ trợ thở máy do HAP, sốc nhiễm khuẩn) hoặc đã dùng kháng sinh tĩnh mạch trong 90 ngày: dùng hai thuốc khác nhóm có tác dụng trên P. aeruginosa.", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XII" },
      { text: "Liều kháng sinh xác định theo dữ liệu dược động học/dược lực học (nồng độ thuốc, truyền kéo dài/liên tục, liều theo cân nặng) thay vì theo tờ thông tin sản phẩm.", grade: "Yếu; rất thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XIII" },
      { text: "HAP: điều trị 7 ngày; có thể ngắn hoặc dài hơn tùy tốc độ cải thiện lâm sàng, X-quang và xét nghiệm.", grade: "Mạnh; rất thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XXII" },
      { text: "Xuống thang kháng sinh thay vì giữ nguyên phác đồ phổ rộng.", grade: "Yếu; rất thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XXIII" },
      ...VANCO_RECS,
    ],
    regimens: [
      {
        scenario: "Không nguy cơ tử vong cao, không yếu tố làm tăng khả năng MRSA – một trong",
        options: ["piperacillin-tazobactam 4,5 g TM mỗi 6 giờ", "cefepim 2 g TM mỗi 8 giờ", "levofloxacin 750 mg TM mỗi ngày", "imipenem 500 mg TM mỗi 6 giờ", "meropenem 1 g TM mỗi 8 giờ"],
        note: "Piperacillin-tazobactam, cefepim, imipenem, meropenem: có thể truyền kéo dài.",
        guidelineId: "atsidsa-hapvap-2016",
        locator: "Table 4, cột 1",
      },
      {
        scenario: "Không nguy cơ tử vong cao nhưng có yếu tố làm tăng khả năng MRSA – một thuốc Gram âm + thuốc chống MRSA",
        options: ["piperacillin-tazobactam 4,5 g TM mỗi 6 giờ", "cefepim hoặc ceftazidim 2 g TM mỗi 8 giờ", "levofloxacin 750 mg TM mỗi ngày hoặc ciprofloxacin 400 mg TM mỗi 8 giờ", "imipenem 500 mg TM mỗi 6 giờ hoặc meropenem 1 g TM mỗi 8 giờ", "aztreonam 2 g TM mỗi 8 giờ", "CỘNG: vancomycin 15 mg/kg TM mỗi 8–12 giờ, đích nồng độ đáy \"15–20 mg/mL\" [nguyên văn; nghi lỗi in, KHÔNG quy đổi] (cân nhắc liều nạp 25–30 mg/kg x 1 khi bệnh nặng) HOẶC linezolid 600 mg TM mỗi 12 giờ"],
        note: "Table 4 ghi đơn vị nồng độ đáy vancomycin là \"mg/mL\" – nghi lỗi in; ứng dụng giữ nguyên văn, không quy đổi sang mg/L. Đồng thuận vancomycin 2020 không còn khuyến cáo theo dõi chỉ bằng nồng độ đáy (xem khuyến cáo bên trên). Yếu tố MRSA: kháng sinh tĩnh mạch trong 90 ngày; đơn vị chưa biết tỷ lệ MRSA hoặc > 20%; từng phát hiện MRSA.",
        guidelineId: "atsidsa-hapvap-2016",
        locator: "Table 4, cột 2 và chú thích b",
      },
      {
        scenario: "Nguy cơ tử vong cao (thở máy do viêm phổi, sốc nhiễm khuẩn) hoặc đã dùng kháng sinh tĩnh mạch trong 90 ngày – hai thuốc, tránh 2 beta-lactam",
        options: ["piperacillin-tazobactam 4,5 g TM mỗi 6 giờ", "cefepim hoặc ceftazidim 2 g TM mỗi 8 giờ", "levofloxacin 750 mg TM mỗi ngày hoặc ciprofloxacin 400 mg TM mỗi 8 giờ", "imipenem 500 mg TM mỗi 6 giờ hoặc meropenem 1 g TM mỗi 8 giờ", "amikacin 15–20 mg/kg TM mỗi ngày, gentamicin 5–7 mg/kg TM mỗi ngày hoặc tobramycin 5–7 mg/kg TM mỗi ngày", "aztreonam 2 g TM mỗi 8 giờ", "CỘNG: vancomycin 15 mg/kg TM mỗi 8–12 giờ (đích đáy \"15–20 mg/mL\" [nguyên văn Table 4; nghi lỗi in, KHÔNG quy đổi], cân nhắc nạp 25–30 mg/kg) HOẶC linezolid 600 mg TM mỗi 12 giờ"],
        note: "Không dùng thuốc chống MRSA thì phác đồ phải bao phủ MSSA (piperacillin-tazobactam, cefepim, levofloxacin, imipenem, meropenem). Dị ứng penicilin nặng, dùng aztreonam thay mọi beta-lactam: thêm thuốc bao phủ MSSA.",
        guidelineId: "atsidsa-hapvap-2016",
        locator: "Table 4, cột 3 và chú thích",
      },
    ],
  },

  // ================= VAP =================
  {
    diseaseId: "v8-5",
    guidelineIds: ["atsidsa-hapvap-2016", "ashp-idsa-vanco-2020"],
    scope: "Người lớn, viêm phổi liên quan thở máy.",
    recommendations: [
      { text: "Mọi phác đồ kinh nghiệm đều bao phủ S. aureus, P. aeruginosa và trực khuẩn Gram âm khác.", grade: "Mạnh; bằng chứng thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục X" },
      { text: "Thêm thuốc chống MRSA khi có yếu tố nguy cơ kháng thuốc, đơn vị có > 10–20% S. aureus kháng methicillin, hoặc chưa biết tỷ lệ MRSA; chọn vancomycin hoặc linezolid.", grade: "Yếu; rất thấp (chỉ định) / Mạnh; trung bình (lựa chọn thuốc)", guidelineId: "atsidsa-hapvap-2016", locator: "Mục X" },
      { text: "Không yếu tố nguy cơ kháng thuốc và đơn vị có < 10–20% MRSA: một thuốc có tác dụng trên MSSA – piperacillin-tazobactam, cefepim, levofloxacin, imipenem hoặc meropenem.", grade: "Yếu; rất thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục X" },
      { text: "Dùng hai thuốc chống P. aeruginosa khác nhóm khi có yếu tố nguy cơ kháng thuốc, đơn vị có > 10% Gram âm kháng thuốc định đơn trị, hoặc không có dữ liệu nhạy cảm tại chỗ; ngược lại (≤ 10%) dùng một thuốc.", grade: "Yếu; thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục X" },
      { text: "Tránh aminoglycosid và tránh colistin nếu có thuốc thay thế có tác dụng đủ trên Gram âm.", grade: "Yếu; thấp / rất thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục X" },
      { text: "Liều kháng sinh xác định theo dữ liệu dược động học/dược lực học thay vì theo tờ thông tin sản phẩm.", grade: "Yếu; rất thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XIII" },
      { text: "VAP do trực khuẩn Gram âm chỉ còn nhạy aminoglycosid hoặc polymyxin: phối hợp kháng sinh khí dung và toàn thân.", grade: "Yếu; rất thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XIV" },
      { text: "VAP: điều trị 7 ngày thay vì 8–15 ngày; có thể ngắn hoặc dài hơn tùy tốc độ cải thiện.", grade: "Mạnh; trung bình", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XXI" },
      { text: "Xuống thang kháng sinh thay vì giữ nguyên phác đồ phổ rộng.", grade: "Yếu; rất thấp", guidelineId: "atsidsa-hapvap-2016", locator: "Mục XXIII" },
      ...VANCO_RECS,
    ],
    regimens: [
      {
        scenario: "Đơn vị cần bao phủ MRSA và hai thuốc chống Pseudomonas – chọn 1 thuốc cột A + 1 thuốc cột B + 1 thuốc cột C",
        options: [
          "A (Gram dương có tác dụng MRSA): vancomycin 15 mg/kg TM mỗi 8–12 giờ (cân nhắc liều nạp 25–30 mg/kg x 1 khi bệnh nặng) HOẶC linezolid 600 mg TM mỗi 12 giờ",
          "B (beta-lactam chống Pseudomonas): piperacillin-tazobactam 4,5 g TM mỗi 6 giờ; cefepim 2 g TM mỗi 8 giờ; ceftazidim 2 g TM mỗi 8 giờ; imipenem 500 mg TM mỗi 6 giờ; meropenem 1 g TM mỗi 8 giờ; aztreonam 2 g TM mỗi 8 giờ",
          "C (không beta-lactam chống Pseudomonas): ciprofloxacin 400 mg TM mỗi 8 giờ; levofloxacin 750 mg TM mỗi 24 giờ; amikacin 15–20 mg/kg TM mỗi 24 giờ; gentamicin 5–7 mg/kg TM mỗi 24 giờ; tobramycin 5–7 mg/kg TM mỗi 24 giờ; colistin 5 mg/kg TM x 1 (liều nạp), sau đó 2,5 mg x (1,5 x CrCl + 30) TM mỗi 12 giờ; polymyxin B 2,5–3,0 mg/kg/ngày chia 2 lần TM",
        ],
        note: "Liều khởi đầu có thể cần chỉnh khi suy gan/thận. Vancomycin, aminoglycosid, polymyxin: cần đo nồng độ và chỉnh liều. Beta-lactam: có thể truyền kéo dài. Imipenem: có thể cần giảm liều khi cân nặng < 70 kg (nguy cơ co giật). Polymyxin chỉ dùng nơi tỷ lệ đa kháng cao và có kinh nghiệm; liều colistin tính theo colistin base (1 triệu IU ≈ 30 mg CBA ≈ 80 mg colistimethat). Aztreonam chỉ là thuốc phối hợp với một beta-lactam khác khi không còn lựa chọn.",
        guidelineId: "atsidsa-hapvap-2016",
        locator: "Table 3 và chú thích a–f",
      },
    ],
  },

  // ================= SEPSIS / SOC NK =================
  ...["v8-11", "v8-12"].map<IntlEntry>((diseaseId) => ({
    diseaseId,
    guidelineIds: ["ssc-2026", "ashp-idsa-vanco-2020"],
    scope: "Người lớn có hoặc có nguy cơ sepsis/sốc nhiễm khuẩn. SSC 2026 không có phác đồ thuốc/liều cụ thể. Đồng thuận vancomycin 2020 chỉ áp dụng khi nghi hoặc xác định MRSA nặng.",
    recommendations: [
      { text: "Có thể sốc nhiễm khuẩn, hoặc sepsis có khả năng/chắc chắn (có hoặc không sốc): dùng kháng sinh ngay, lý tưởng trong 1 giờ kể từ khi nhận biết.", grade: "Mạnh; rất thấp", guidelineId: "ssc-2026", locator: "Antimicrobial therapy – timing" },
      { text: "Có thể sepsis nhưng không sốc: đánh giá nhanh có giới hạn thời gian; nếu vẫn nghi nhiễm khuẩn, dùng kháng sinh trong 3 giờ kể từ khi nghi sepsis.", grade: "Có điều kiện", guidelineId: "ssc-2026", locator: "Antimicrobial therapy – timing" },
      { text: "Nguy cơ cao với một tác nhân đa kháng cụ thể: bao phủ tác nhân đó; nguy cơ thấp: không bao phủ. Yếu tố nguy cơ: đã cư trú hoặc từng nhiễm tác nhân đa kháng đó, dùng kháng sinh phổ rộng kéo dài, nằm viện kéo dài tại đơn vị có tỷ lệ cao tác nhân đó.", grade: "Có điều kiện; rất thấp", guidelineId: "ssc-2026", locator: "Multidrug resistance" },
      { text: "Dùng xét nghiệm chẩn đoán nhanh đặc hiệu tác nhân theo từng ca, dựa trên lâm sàng, dịch tễ vi khuẩn và đề kháng tại chỗ, mùa, khả năng sẵn có và hướng dẫn quản lý kháng sinh.", grade: "Có điều kiện; thấp", guidelineId: "ssc-2026", locator: "Pathogen tests" },
      { text: "Theo dõi nồng độ kháng sinh (TDM) theo từng ca, dựa trên lâm sàng, dịch tễ đề kháng, nhóm thuốc và khả năng làm TDM.", grade: "Có điều kiện; rất thấp", guidelineId: "ssc-2026", locator: "Drug monitoring" },
      { text: "Liên tục đánh giá lại, tìm chẩn đoán khác; ngừng kháng sinh kinh nghiệm nếu đã chứng minh hoặc rất nghi một nguyên nhân không nhiễm khuẩn.", grade: "Thực hành tốt", guidelineId: "ssc-2026", locator: "Antimicrobial therapy" },
      { text: "Không thường quy dùng kháng nấm kinh nghiệm; cân nhắc từng ca khi có yếu tố nguy cơ (suy giảm miễn dịch, nguồn ổ bụng…).", grade: "Có điều kiện; thấp", guidelineId: "ssc-2026", locator: "Empiric antifungal" },
      { text: "Không có yếu tố nguy cơ kỵ khí: phác đồ không phủ kỵ khí; có yếu tố nguy cơ: phác đồ có phủ kỵ khí.", grade: "Có điều kiện; rất thấp", guidelineId: "ssc-2026", locator: "Anaerobic coverage" },
      { text: "Truyền kéo dài beta-lactam (sau liều nạp) thay vì tiêm/truyền nhanh khi duy trì.", grade: "Mạnh; trung bình", guidelineId: "ssc-2026", locator: "Beta-lactam infusion" },
      { text: "Xuống thang khi đã có chẩn đoán vi sinh và kháng sinh đồ (Mạnh; rất thấp); xuống thang cả khi cấy cuối cùng không phân lập được tác nhân (Có điều kiện; rất thấp). Xuống thang = ngừng kháng sinh không cần thiết hoặc thu hẹp phổ khi phù hợp.", guidelineId: "ssc-2026", locator: "Antimicrobial therapy – de-escalation" },
      { text: "Bắt đầu kháng sinh dựa trên đánh giá lâm sàng, không dựa thêm procalcitonin; dùng procalcitonin kèm lâm sàng để quyết định ngừng khi chưa rõ thời gian tối ưu.", guidelineId: "ssc-2026", locator: "Procalcitonin" },
      { text: "Đã kiểm soát ổ nhiễm đầy đủ: ưu tiên thời gian điều trị ngắn hơn.", grade: "Có điều kiện; rất thấp", guidelineId: "ssc-2026", locator: "Duration" },
      ...VANCO_RECS,
    ],
    regimens: [],
  })),

  // ================= NKTN phuc tap / ESBL =================
  {
    diseaseId: "v8-2",
    guidelineIds: ["idsa-cuti-2025", EAU_UI],
    scope: "Người lớn, HỘI CHỨNG NKTN phức tạp (gồm viêm thận – bể thận) – điều trị kinh nghiệm. Vi khuẩn sinh ESBL là kiểu hình kháng thuốc, điều trị theo tác nhân/kháng sinh đồ: xem mặt bệnh \"Enterobacterales sinh ESBL\" (v8-43).",
    recommendations: [
      { text: "Có sepsis: chọn ban đầu trong số cephalosporin thế hệ 3 hoặc 4, carbapenem, piperacillin-tazobactam hoặc fluoroquinolon (không ưu tiên thuốc mới, aminoglycosid cũ).", grade: "Có điều kiện; rất thấp–trung bình", guidelineId: "idsa-cuti-2025", locator: "CQ 1A, khuyến cáo a" },
      { text: "Không sepsis: cephalosporin thế hệ 3 hoặc 4, piperacillin-tazobactam hoặc fluoroquinolon (không đưa carbapenem vào nhóm ưu tiên).", grade: "Có điều kiện; rất thấp–trung bình", guidelineId: "idsa-cuti-2025", locator: "CQ 1A, khuyến cáo b" },
      { text: "Tránh kháng sinh mà bệnh nhân từng có chủng nước tiểu kháng; tránh fluoroquinolon nếu đã dùng trong 12 tháng qua. Chỉ dùng antibiogram khi có sepsis và antibiogram tại chỗ, gần đây, phù hợp.", guidelineId: "idsa-cuti-2025", locator: "Figure 1.1 – bước 2 và 4" },
      { text: "Chuyển đường uống khi cải thiện, uống được và có thuốc uống hiệu quả (kể cả khi có nhiễm khuẩn huyết Gram âm).", grade: "Có điều kiện; thấp / rất thấp", guidelineId: "idsa-cuti-2025", locator: "CQ 2" },
      { text: "Thời gian: 5–7 ngày fluoroquinolon hoặc 7 ngày thuốc không phải fluoroquinolon (thay vì 10–14 ngày); có nhiễm khuẩn huyết Gram âm: 7 ngày thay vì 14 ngày.", grade: "Có điều kiện; trung bình → thấp", guidelineId: "idsa-cuti-2025", locator: "CQ 3" },
      ...EAU_SYSTEMIC_RECS,
    ],
    regimens: [
      ...CUTI_TABLES,
    ],
    gaps: ["Kiểu hình ESBL (điều trị theo tác nhân, IDSA AMR 2026 Q1.2 và Table 1): đã chuyển sang mặt bệnh \"Enterobacterales sinh ESBL\" (v8-43)."],
  },
  {
    diseaseId: "v8-17",
    guidelineIds: ["idsa-cuti-2025", EAU_UI],
    scope:
      "IDSA 2025 thu hẹp NKTN không biến chứng thành nhiễm khuẩn giới hạn ở bàng quang, không sốt; viêm thận – bể thận vì vậy thuộc phạm vi NKTN phức tạp (định nghĩa theo bản tóm tắt – cần đối chiếu toàn văn).",
    recommendations: [
      { text: "Có sepsis: cephalosporin thế hệ 3 hoặc 4, carbapenem, piperacillin-tazobactam hoặc fluoroquinolon.", grade: "Có điều kiện", guidelineId: "idsa-cuti-2025", locator: "CQ 1A, a" },
      { text: "Không sepsis: cephalosporin thế hệ 3 hoặc 4, piperacillin-tazobactam hoặc fluoroquinolon.", grade: "Có điều kiện", guidelineId: "idsa-cuti-2025", locator: "CQ 1A, b" },
      { text: "Tránh fluoroquinolon nếu đã dùng trong 12 tháng; tránh thuốc mà bệnh nhân từng có chủng kháng.", guidelineId: "idsa-cuti-2025", locator: "Figure 1.1" },
      { text: "Thời gian: 5–7 ngày fluoroquinolon hoặc 7 ngày thuốc khác khi cải thiện; 7 ngày nếu có nhiễm khuẩn huyết Gram âm.", guidelineId: "idsa-cuti-2025", locator: "CQ 3" },
      { text: "Viêm thận bể thận không cần nhập viện: fluoroquinolon ngắn ngày là lựa chọn đầu tay. Cần nhập viện: bắt đầu đường tĩnh mạch; chuyển uống khi cải thiện và uống được. Không dùng nitrofurantoin, fosfomycin uống, pivmecillinam.", grade: "Mạnh", guidelineId: EAU_UI, locator: "Mục 3.6.3.c, PDF tr. 28" },
      { text: "Carbapenem chỉ cân nhắc khi cấy sớm cho thấy vi khuẩn đa kháng; có dấu hiệu nhiễm khuẩn huyết từ đường tiết niệu: bao phủ ESBL theo kinh nghiệm.", grade: "LE 4", guidelineId: EAU_UI, locator: "Mục 3.6.3, PDF tr. 27–28" },
      { text: "Thai kỳ: có thể điều trị ngoại trú bằng kháng sinh tiêm phù hợp nếu nhẹ và theo dõi sát; tổng 7–10 ngày. Nam giới bị NKTN có sốt/viêm thận bể thận: tối thiểu 2 tuần, ưu tiên fluoroquinolon.", guidelineId: EAU_UI, locator: "Mục 3.6.3, PDF tr. 29" },
    ],
    regimens: [...EAU_PYELO, ...CUTI_TABLES],
  },

  // ================= Da – mo mem =================
  {
    diseaseId: "v8-27",
    guidelineIds: ["idsa-ssti-2014"],
    scope: "Viêm mô bào không mủ, người lớn.",
    recommendations: [
      { text: "Viêm mô bào điển hình không có dấu hiệu toàn thân: dùng kháng sinh có tác dụng trên liên cầu; điều trị ngoại trú khi không có SIRS, rối loạn ý thức hoặc huyết động không ổn định.", grade: "Mạnh; trung bình", guidelineId: "idsa-ssti-2014", locator: "Khuyến cáo IV.3, IV.7" },
      { text: "Có dấu hiệu toàn thân: kháng sinh toàn thân; có thể thêm bao phủ MSSA.", grade: "Yếu; thấp (bao phủ MSSA)", guidelineId: "idsa-ssti-2014", locator: "Khuyến cáo IV.3" },
      { text: "Chấn thương xuyên, nhiễm MRSA nơi khác, mang MRSA ở mũi, tiêm chích ma túy hoặc SIRS: vancomycin hoặc thuốc khác có tác dụng trên cả MRSA và liên cầu.", grade: "Mạnh; trung bình", guidelineId: "idsa-ssti-2014", locator: "Khuyến cáo IV.3" },
      { text: "Nhiễm khuẩn nặng: vancomycin + piperacillin-tazobactam hoặc imipenem/meropenem là phác đồ kinh nghiệm hợp lý.", grade: "Mạnh; trung bình", guidelineId: "idsa-ssti-2014", locator: "Khuyến cáo IV.3" },
    ],
    regimens: [],
    gaps: ["Liều theo Table 2 của IDSA SSTI 2014 chưa trích xuất."],
  },
  {
    diseaseId: "v8-28",
    guidelineIds: ["idsa-ssti-2014"],
    scope: "Nhiễm khuẩn da có mủ (nhọt, cụm nhọt, áp xe).",
    recommendations: [
      { text: "Rạch dẫn lưu là điều trị khuyến cáo cho nang thượng bì viêm, cụm nhọt, áp xe và nhọt lớn.", grade: "Mạnh; cao", guidelineId: "idsa-ssti-2014", locator: "Khuyến cáo II.3" },
      { text: "Quyết định thêm kháng sinh dựa trên có hay không có SIRS; không thường quy dùng kháng sinh kèm dẫn lưu ở ca điển hình.", grade: "Mạnh; thấp", guidelineId: "idsa-ssti-2014", locator: "Khuyến cáo II.4" },
      { text: "Dùng kháng sinh có tác dụng trên MRSA khi thất bại kháng sinh ban đầu, suy giảm miễn dịch rõ, hoặc SIRS kèm tụt huyết áp.", grade: "Mạnh; thấp", guidelineId: "idsa-ssti-2014", locator: "Khuyến cáo II.4" },
    ],
    regimens: [],
    gaps: ["Liều theo Table 2 của IDSA SSTI 2014 chưa trích xuất."],
  },

  // ================= Buoc 4D Nhom 3: Viem noi tam mac =================
  {
    diseaseId: "v8-39",
    guidelineIds: [ESC_IE, "ashp-idsa-vanco-2020"],
    scope: "Viêm nội tâm mạc nhiễm khuẩn – điều trị KINH NGHIỆM trước khi định danh tác nhân (ESC 2023 Bảng khuyến cáo 10). Điều trị theo tác nhân (bảng riêng của ESC) chưa trích.",
    recommendations: [
      { text: "Bắt đầu điều trị sớm. Cấy 3 bộ máu cách nhau 30 phút trước khi dùng kháng sinh.", guidelineId: ESC_IE, locator: "Mục 7.12, tr. 3984" },
      { text: "Chọn phác đồ ban đầu theo: kháng sinh đã dùng trước, van tự nhiên hay nhân tạo (sớm/muộn), nơi mắc (cộng đồng, bệnh viện, liên quan chăm sóc y tế), dịch tễ kháng thuốc tại chỗ.", guidelineId: ESC_IE, locator: "Mục 7.12" },
      { text: "Van tự nhiên và van nhân tạo muộn: bao phủ tụ cầu, liên cầu, ruột cầu. Van nhân tạo sớm hoặc liên quan chăm sóc y tế: bao phủ tụ cầu kháng methicilin, ruột cầu và lý tưởng là Gram âm không thuộc nhóm HACEK. Tụ cầu coagulase âm tính: bao phủ ở van nhân tạo, không bao phủ ở van tự nhiên.", guidelineId: ESC_IE, locator: "Mục 7.12" },
      { text: "Đang dùng kháng sinh thì phác đồ kinh nghiệm nên gồm kháng sinh khác. Cloxacilin/cefazolin liên quan tử vong thấp hơn các beta-lactam khác (kể cả amoxicilin-clavulanat, ampicilin-sulbactam) và vancomycin khi điều trị kinh nghiệm nhiễm khuẩn huyết/viêm nội tâm mạc do MSSA.", guidelineId: ESC_IE, locator: "Mục 7.12" },
      { text: "Khi định danh tác nhân (thường trong 24–48 giờ) phải chuyển sang điều trị theo tác nhân và kháng sinh đồ.", guidelineId: ESC_IE, locator: "Mục 7.12" },
      { text: "Aminoglycosid dùng không quá 2 tuần để giảm độc thận.", guidelineId: ESC_IE, locator: "Mục 7.1 (iv)" },
      { text: "Gentamicin có thể dùng 1 lần/ngày ở viêm nội tâm mạc do liên cầu nhạy và chức năng thận bình thường (mục 7.2); ở ruột cầu, tổng liều gentamicin/ngày có thể dùng 1 lần (mục 7.8).", guidelineId: ESC_IE, locator: "Mục 7.2, 7.8" },
      { text: "Gentamicin (chú thích Bảng 7, 8): liều tối đa 240 mg/ngày; liều cao tăng nguy cơ độc thận; theo dõi chức năng thận và nồng độ gentamicin mỗi tuần; dùng 1 lần/ngày: nồng độ đáy < 1 mg/L, nồng độ đỉnh (1 giờ sau tiêm) khoảng 10–12 mg/L.", guidelineId: ESC_IE, locator: "Bảng 7 chú thích d; Bảng 8 chú thích d" },
      { text: "Vancomycin (chú thích Bảng 7, 8): nồng độ đáy 10–15 mg/L; một số chuyên gia tăng liều 45–60 mg/kg/ngày chia 2–3 lần để đạt đáy 15–20 mg/L như trong viêm nội tâm mạc do tụ cầu; không quá 2 g/ngày nếu không theo dõi nồng độ, có thể chỉnh để đạt đỉnh 30–45 µg/mL 1 giờ sau truyền.", guidelineId: ESC_IE, locator: "Bảng 7 chú thích e; Bảng 8 chú thích h" },
      { text: "Mục 7.7 (tụ cầu kháng methicilin): theo dõi nồng độ đáy vancomycin gây lo ngại độc thận; khuyến cáo đích AUC/MIC 400–600 mg·h/L; MIC > 1 mg/L khó đạt AUC/MIC ≥ 400. LƯU Ý: khác với chú thích bảng (đích đáy 10–15 hoặc 15–20 mg/L) – mâu thuẫn trong cùng nguồn.", guidelineId: ESC_IE, locator: "Mục 7.7" },
      ...VANCO_RECS,
    ],
    regimens: [
      {
        kind: "empiric",
        scenario: "KINH NGHIỆM – Van tự nhiên mắc phải cộng đồng hoặc van nhân tạo muộn (≥ 12 tháng sau mổ) – ampicilin phối hợp ceftriaxon, hoặc phối hợp (flu)cloxacilin và gentamicin (IIa, C)",
        options: [
          "Người lớn: ampicilin 12 g/ngày TM chia 4–6 lần; ceftriaxon 4 g/ngày TM hoặc TB chia 2 lần; (flu)cloxacilin 12 g/ngày TM chia 4–6 lần; gentamicin 3 mg/kg/ngày TM hoặc TB 1 lần",
          "Trẻ em: ampicilin 200–300 mg/kg/ngày TM chia 4–6 lần, tối đa 12 g/ngày; ceftriaxon 100 mg/kg TM hoặc TB 1 lần; (flu)cloxacilin 200–300 mg/kg/ngày TM chia đều 4–6 lần; gentamicin 3 mg/kg/ngày TM hoặc TB chia đều 3 lần",
        ],
        guidelineId: ESC_IE,
        locator: "Bảng khuyến cáo 10, tr. 3985",
      },
      {
        kind: "empiric",
        scenario: "KINH NGHIỆM – Van nhân tạo sớm (< 12 tháng sau mổ) hoặc liên quan chăm sóc y tế – vancomycin hoặc daptomycin phối hợp gentamicin và rifampin (IIb, C)",
        options: [
          "Người lớn: vancomycin 30 mg/kg/ngày TM chia 2 lần; daptomycin 10 mg/kg/ngày TM 1 lần; gentamicin 3 mg/kg/ngày TM hoặc TB 1 lần; rifampin 900–1200 mg TM hoặc uống chia 2–3 lần",
          "Trẻ em: vancomycin 40 mg/kg/ngày TM chia đều 2–3 lần; gentamicin 3 mg/kg/ngày TM hoặc TB chia đều 3 lần; rifampin 20 mg/kg/ngày TM hoặc uống chia đều 3 lần, tối đa 900 mg/ngày",
        ],
        guidelineId: ESC_IE,
        locator: "Bảng khuyến cáo 10, tr. 3985",
      },
      {
        kind: "empiric",
        scenario: "KINH NGHIỆM – Dị ứng beta-lactam – van tự nhiên cộng đồng hoặc van nhân tạo muộn: cefazolin hoặc vancomycin phối hợp gentamicin (IIb, C)",
        options: [
          "Người lớn: cefazolin 6 g/ngày TM chia 3 lần; vancomycin 30 mg/kg/ngày TM chia 2 lần; gentamicin 3 mg/kg/ngày TM hoặc TB 1 lần",
          "Trẻ em: cefazolin 100 mg/kg/ngày TM chia 3–4 lần, tối đa 6 g/ngày; vancomycin 40 mg/kg/ngày TM chia đều 2–3 lần; gentamicin 3 mg/kg/ngày TM hoặc TB chia đều 3 lần",
        ],
        note: "Chú thích d (gentamicin) và e (vancomycin) của Bảng 10 không có trong ảnh bảng và văn bản bài báo truy cập được – CHƯA XÁC MINH. Bảng 7 và Bảng 8 (cùng hướng dẫn) dùng chú thích gentamicin/vancomycin nêu ở mục điều trị đích; không mặc định áp dụng cho Bảng 10.",
        guidelineId: ESC_IE,
        locator: "Bảng khuyến cáo 10, tr. 3985",
      },
      {
        kind: "pathogen-directed",
        scenario: "ĐIỀU TRỊ ĐÍCH – liên cầu miệng và nhóm S. gallolyticus nhạy penicilin (I, B): 4 tuần (van tự nhiên) hoặc 6 tuần (van nhân tạo)",
        options: [
          "Người lớn: penicilin G 12–18 triệu U/ngày TM chia 4–6 lần hoặc truyền liên tục; amoxicilin 12 g/ngày TM chia 4–6 lần; ceftriaxon 2 g/ngày TM 1 lần",
          "Trẻ em: penicilin G 200.000 U/kg/ngày TM chia 4–6 lần; amoxicilin 200–300 mg/kg/ngày TM chia 4–6 lần, tối đa 12 g/ngày; ceftriaxon 100 mg/kg/ngày TM 1 lần",
          "Phác đồ 2 tuần (chỉ van tự nhiên không biến chứng, chức năng thận bình thường; không áp dụng van nhân tạo): thuốc trên + gentamicin 3 mg/kg/ngày TM hoặc TB 1 lần (trẻ em: 1 lần hoặc chia 3)",
          "Dị ứng beta-lactam (I, C): vancomycin 30 mg/kg/ngày TM chia 2 lần (trẻ em chia 2–3 lần), 4 tuần (van tự nhiên) hoặc 6 tuần (van nhân tạo)",
        ],
        note: "Chú thích c Bảng 7: liều khởi đầu là mức thấp, có thể tăng tới mức cao. Chú thích gentamicin/vancomycin: xem khuyến cáo ở trên.",
        guidelineId: ESC_IE,
        locator: "Bảng khuyến cáo 7 (mục 7.3)",
      },
      {
        kind: "pathogen-directed",
        scenario: "ĐIỀU TRỊ ĐÍCH – liên cầu miệng/S. gallolyticus tăng phơi nhiễm hoặc kháng penicilin (I, B)",
        options: [
          "Van tự nhiên, 4 tuần + gentamicin 2 tuần: penicilin G 24 triệu U/ngày TM chia 4–6 lần hoặc truyền liên tục; amoxicilin 12 g/ngày TM chia 4–6 lần; ceftriaxon 2 g/ngày TM 1 lần; gentamicin 3 mg/kg/ngày TM hoặc TB 1 lần",
          "Van nhân tạo, 6 tuần + gentamicin 2 tuần: cùng liều như trên",
          "Dị ứng beta-lactam (I, C): vancomycin 30 mg/kg/ngày TM chia 2 lần – 4 tuần (van tự nhiên); 6 tuần + gentamicin 2 tuần (van nhân tạo)",
        ],
        guidelineId: ESC_IE,
        locator: "Bảng khuyến cáo 7 (mục 7.3)",
      },
      {
        kind: "pathogen-directed",
        scenario: "ĐIỀU TRỊ ĐÍCH – tụ cầu nhạy methicilin (MSSA) (I, B)",
        options: [
          "Van tự nhiên, 4–6 tuần – người lớn: (flu)cloxacilin 12 g/ngày TM chia 4–6 lần hoặc cefazolin 6 g/ngày TM chia 3 lần; trẻ em: (flu)cloxacilin 200–300 mg/kg/ngày chia đều 4–6 lần hoặc cefazolin 100 mg/kg/ngày chia 3–4 lần, tối đa 6 g/ngày",
          "Van nhân tạo, ≥ 6 tuần: (flu)cloxacilin hoặc cefazolin + rifampin 900 mg/ngày TM hoặc uống chia đều 3 lần (trẻ em 20 mg/kg/ngày, tối đa 900 mg/ngày) + gentamicin 3 mg/kg/ngày TM hoặc TB 1 lần (ưu tiên) hoặc 2 lần, 2 tuần",
          "Dị ứng penicilin (I, B): cefazolin như trên (van tự nhiên 4–6 tuần; van nhân tạo + rifampin ≥ 6 tuần + gentamicin 2 tuần). Cefazolin chỉ thay cloxacilin khi phản ứng quá mẫn KHÔNG tức thì",
          "Dị ứng penicilin (IIb, C): daptomycin 10 mg/kg/ngày TM 1 lần + ceftarolin 1800 mg/ngày TM chia 3 lần HOẶC fosfomycin 8–12 g/ngày TM chia 4 lần (van nhân tạo: thêm gentamicin hoặc rifampin)",
        ],
        note: "Chú thích Bảng 8: cloxacilin không dùng khi dị ứng penicilin; ceftarolin liều cao có thể gây giảm bạch cầu sau 2 tuần; fosfomycin – tải natri cao có thể gây suy tim cấp ở người suy tim.",
        guidelineId: ESC_IE,
        locator: "Bảng khuyến cáo 8 (mục 7.7)",
      },
      {
        kind: "pathogen-directed",
        scenario: "ĐIỀU TRỊ ĐÍCH – tụ cầu kháng methicilin (MRSA)",
        options: [
          "Van tự nhiên, 4–6 tuần (I, B): vancomycin 30–60 mg/kg/ngày TM chia 2–3 lần (trẻ em 30 mg/kg/ngày chia đều 2–3 lần)",
          "Van nhân tạo, ≥ 6 tuần (I, B): vancomycin + rifampin 900–1200 mg/ngày TM hoặc uống chia 2–3 lần (trẻ em 20 mg/kg/ngày chia 3 lần, tối đa 900 mg/ngày) + gentamicin 3 mg/kg/ngày 1 lần (ưu tiên) hoặc 2 lần, 2 tuần",
          "Van tự nhiên (IIb, C): daptomycin 10 mg/kg/ngày TM 1 lần + cloxacilin 12 g/ngày TM chia 6 lần HOẶC ceftarolin 1800 mg/ngày chia 3 lần HOẶC fosfomycin 8–12 g/ngày chia 4 lần",
        ],
        guidelineId: ESC_IE,
        locator: "Bảng khuyến cáo 8 (mục 7.7)",
      },
    ],
    gaps: [
      "ESC 2023: bảng điều trị đích cho ruột cầu, Gram âm/HACEK, cấy máu âm tính, nấm chưa trích.",
      "AHA 2015 (Baddour, Circulation 2015): chưa trích.",
      "Văn bản BYT mới hơn QĐ 708 về viêm nội tâm mạc: tra cứu 26/10/2026 không tìm thấy.",
    ],
  },

  // ================= Buoc 4D Nhom 3: Viem khop nhiem khuan =================
  {
    diseaseId: "v8-33",
    guidelineIds: [PIDS_ABA],
    scope: "CHỈ TRẺ EM (PIDS/IDSA 2023). Người lớn: chưa có hướng dẫn quốc tế hiện hành đã xác minh trong ứng dụng.",
    recommendations: [
      { text: "Cấy máu trước khi dùng kháng sinh.", grade: "Mạnh; trung bình", guidelineId: PIDS_ABA, locator: "Mục I" },
      { text: "Chọc hút dịch khớp trước khi dùng kháng sinh kinh nghiệm (trẻ không biểu hiện nặng); làm tế bào, nhuộm Gram, cấy dịch khớp. Trẻ biểu hiện nặng hoặc tiến triển nhanh: dùng kháng sinh ngay (sau cấy máu nếu có thể), không chờ thủ thuật.", grade: "Có điều kiện / Mạnh", guidelineId: PIDS_ABA, locator: "Mục III, IV" },
      { text: "Kinh nghiệm: kháng sinh có tác dụng trên S. aureus; cân nhắc thuốc có tác dụng trên MRSA cộng đồng theo dữ liệu nhạy cảm tại chỗ và mức độ nặng.", grade: "Mạnh; trung bình", guidelineId: PIDS_ABA, locator: "Mục V" },
      { text: "Trẻ 6–48 tháng: phác đồ kinh nghiệm nên có tác dụng trên Kingella kingae. K. kingae thường nhạy penicilin (TRỪ penicilin kháng tụ cầu) và cephalosporin; kháng vancomycin và thường kháng clindamycin, linezolid.", grade: "Có điều kiện; rất thấp", guidelineId: PIDS_ABA, locator: "Mục V; phần thuốc theo tác nhân" },
      { text: "THEO TÁC NHÂN – MSSA: beta-lactam (cefazolin, nafcilin hoặc oxacilin) tiêm ban đầu, cefalexin uống khi chuyển; clindamycin nếu không dùng được beta-lactam. MRSA nhạy: clindamycin, ceftarolin ưu tiên hơn vancomycin; MRSA kháng clindamycin: ceftarolin hoặc vancomycin (đích AUC/MIC 400).", guidelineId: PIDS_ABA, locator: "Mục IX – lựa chọn thuốc theo tác nhân" },
      { text: "Đáp ứng kém sau 48–96 giờ (còn sốt, nhiễm khuẩn huyết kéo dài, CRP tăng): chụp MRI tìm viêm xương, viêm cơ mủ, áp xe kế cận.", grade: "Có điều kiện; rất thấp", guidelineId: PIDS_ABA, locator: "Mục VI" },
      { text: "Không dùng kháng sinh nội khớp thường quy; không dùng corticoid bổ trợ.", grade: "Mạnh / Có điều kiện", guidelineId: PIDS_ABA, locator: "Mục VII, VIII" },
      { text: "Đáp ứng tốt với tiêm tĩnh mạch: chuyển uống thay vì OPAT khi có thuốc uống phù hợp.", grade: "Mạnh; thấp", guidelineId: PIDS_ABA, locator: "Mục XI" },
      { text: "Viêm khớp nguyên phát không kèm viêm xương, cải thiện nhanh và CRP giảm dần trong tuần đầu: tổng thời gian (tiêm + uống) có thể ngắn 10–14 ngày thay vì 21–28 ngày; đáp ứng chậm, kiểm soát ổ kém hoặc Gram âm: có thể cần 21–28 ngày.", grade: "Có điều kiện; thấp", guidelineId: PIDS_ABA, locator: "Mục XII" },
    ],
    regimens: [],
    gaps: [
      "PIDS/IDSA 2023: Bảng 5 (liều theo mg/kg) không có trên trang IDSA – liều CHƯA trích.",
      "Người lớn: chưa có hướng dẫn quốc tế hiện hành đã xác minh (BSR/BOA 2006 chưa kiểm tra tình trạng hiệu lực).",
      "QĐ 361/QĐ-BYT (2014, cơ xương khớp): cũ hơn QĐ 708, chưa đối chiếu bản chính thức.",
    ],
  },

  // ================= Ban chan DTD =================
  {
    diseaseId: "v9-1",
    guidelineIds: ["iwgdf-idsa-2023"],
    scope: "Người đái tháo đường có nhiễm trùng bàn chân (mô mềm, viêm xương).",
    recommendations: [
      { text: "Không dùng kháng sinh toàn thân hoặc tại chỗ cho loét không có nhiễm trùng lâm sàng nhằm giảm nguy cơ nhiễm trùng mới hoặc thúc đẩy lành loét.", grade: "Thực hành tốt nhất", guidelineId: "iwgdf-idsa-2023", locator: "Khuyến cáo 11" },
      { text: "Nhiễm trùng mô mềm: dùng phác đồ kháng sinh đã chứng minh hiệu quả trong thử nghiệm ngẫu nhiên, ở liều chuẩn.", grade: "Mạnh; cao", guidelineId: "iwgdf-idsa-2023", locator: "Khuyến cáo 12a" },
      { text: "Nhiễm trùng da – mô mềm: 1–2 tuần; có thể tới 3–4 tuần nếu lan rộng, cải thiện chậm hoặc bệnh động mạch ngoại biên nặng; sau 4 tuần chưa khỏi: đánh giá lại.", grade: "Mạnh; cao (12b) / Có điều kiện; thấp (12c)", guidelineId: "iwgdf-idsa-2023", locator: "Khuyến cáo 12b–12d" },
      { text: "Chọn thuốc dựa trên tác nhân và độ nhạy, mức độ nặng, bằng chứng hiệu quả, nguy cơ tác dụng phụ, tương tác, khả năng sẵn có và chi phí.", grade: "Thực hành tốt nhất", guidelineId: "iwgdf-idsa-2023", locator: "Khuyến cáo 13" },
      { text: "Nhiễm trùng nhẹ, chưa dùng kháng sinh gần đây, ở vùng khí hậu ôn đới: chỉ nhắm cầu khuẩn Gram dương hiếu khí (liên cầu tan huyết beta, S. aureus, kể cả MRSA nếu có chỉ định).", grade: "Thực hành tốt nhất", guidelineId: "iwgdf-idsa-2023", locator: "Khuyến cáo 14" },
      { text: "Không nhắm P. aeruginosa theo kinh nghiệm ở vùng ôn đới; nhắm P. aeruginosa nếu đã phân lập ở vị trí nhiễm trong vài tuần trước ở người nhiễm trùng vừa/nặng sống ở vùng nhiệt đới/cận nhiệt đới.", grade: "Thực hành tốt nhất", guidelineId: "iwgdf-idsa-2023", locator: "Khuyến cáo 15" },
      { text: "Viêm xương: tới 3 tuần sau cắt cụt nhỏ có bờ xương cấy dương tính; 6 tuần nếu không cắt bỏ xương.", grade: "Có điều kiện; thấp", guidelineId: "iwgdf-idsa-2023", locator: "Khuyến cáo 16" },
      { text: "Không dùng kháng sinh tại chỗ (miếng xốp, kem, xi măng) kèm kháng sinh toàn thân để điều trị nhiễm trùng mô mềm hoặc xương.", guidelineId: "iwgdf-idsa-2023", locator: "Khuyến cáo 24" },
    ],
    regimens: [],
    gaps: ["IWGDF/IDSA 2023 không nêu liều cụ thể."],
  },

  // ================= Da khang =================
  {
    diseaseId: "v8-43",
    guidelineIds: ["idsa-amr-2026"],
    scope: "Enterobacterales sinh ESBL, người lớn.",
    recommendations: [
      { text: "Viêm bàng quang không biến chứng: ưu tiên aminoglycosid (liều duy nhất), gepotidacin, nitrofurantoin, pivmecillinam, sulopenem, TMP-SMX; fosfomycin uống là lựa chọn thay thế cho E. coli sinh ESBL.", guidelineId: "idsa-amr-2026", locator: "Q1.1" },
      { text: "NKTN phức tạp: ưu tiên TMP-SMX, ciprofloxacin hoặc levofloxacin; thay thế: fosfomycin tĩnh mạch, aminoglycosid, piperacillin-tazobactam.", guidelineId: "idsa-amr-2026", locator: "Q1.2" },
      { text: "Ngoài đường tiết niệu: ưu tiên ertapenem, imipenem hoặc meropenem; thay thế: cefepim-enmetazobactam.", guidelineId: "idsa-amr-2026", locator: "Q1.3" },
    ],
    regimens: [
      {
        kind: "pathogen-directed",
        scenario: "Liều người lớn (Table 1) – carbapenem cho ESBL-E ngoài đường tiết niệu",
        options: [
          "Ertapenem 1 g TM mỗi 24 giờ, truyền 30 phút",
          "Meropenem: các nhiễm khuẩn khác 1–2 g TM mỗi 8 giờ, truyền 3 giờ (nếu khả thi); ưu tiên 2 g cho béo phì, nhiễm khuẩn thần kinh trung ương, ECMO hoặc tăng thanh thải thận",
          "Imipenem-cilastatin: các nhiễm khuẩn khác 500 mg imipenem TM mỗi 6 giờ truyền 3 giờ (nếu khả thi) hoặc 1.000 mg mỗi 8 giờ truyền 1 giờ",
        ],
        note: "Giả định chức năng gan, thận bình thường.",
        guidelineId: "idsa-amr-2026",
        locator: "Table 1",
      },
      {
        kind: "pathogen-directed",
        scenario: "THEO TÁC NHÂN – liều người lớn (IDSA AMR 2026, Table 1) cho ESBL-E NKTN phức tạp",
        options: [
          "TMP-SMX: 8–15 mg/kg/ngày (thành phần trimethoprim) TM/uống chia mỗi 8–12 giờ",
          "Ciprofloxacin: 400 mg TM mỗi 8 giờ hoặc 750 mg uống mỗi 12 giờ",
          "Levofloxacin: 750 mg TM/uống mỗi 24 giờ",
          "Fosfomycin TM (cUTI): 6 g mỗi 8 giờ, truyền 1 giờ",
          "Amikacin (cUTI): 15 mg/kg TM một lần; liều sau theo đánh giá dược động học. Gentamicin/tobramycin (cUTI): 7 mg/kg TM một lần; liều sau theo dược động học",
        ],
        note: "Giả định chức năng gan, thận bình thường. Đây là liều điều trị THEO TÁC NHÂN (ESBL-E đã xác định), không phải phác đồ kinh nghiệm.",
        guidelineId: "idsa-amr-2026",
        locator: "Table 1",
      },
    ],
  },
  {
    diseaseId: "v8-46",
    guidelineIds: ["idsa-amr-2026"],
    scope: "P. aeruginosa DTR (nội dung trong khung IDSA 2026 riêng).",
    recommendations: [],
    regimens: [],
    module: "dtr",
  },
  {
    diseaseId: "v8-14",
    guidelineIds: ["idsa-cuti-2025", "idsa-amr-2026"],
    scope: "Chỉ áp dụng khi nguồn nhiễm khuẩn huyết là đường tiết niệu, hoặc khi đã xác định kiểu hình kháng thuốc.",
    recommendations: [
      { text: "NKTN phức tạp có nhiễm khuẩn huyết Gram âm, đang cải thiện: điều trị 7 ngày thay vì 14 ngày; có thể chuyển đường uống khi đủ điều kiện.", grade: "Có điều kiện; thấp / rất thấp", guidelineId: "idsa-cuti-2025", locator: "CQ 2, CQ 3" },
      { text: "Kiểu hình kháng thuốc (ESBL, AmpC, CRE, DTR P. aeruginosa, CRAB): xem mặt bệnh Enterobacterales sinh ESBL, Pseudomonas aeruginosa và IDSA AMR Guidance 2026.", guidelineId: "idsa-amr-2026", locator: "Mục 1–5" },
    ],
    regimens: [],
    gaps: ["Chưa có guideline quốc tế đã xác minh cho nhiễm khuẩn huyết Gram âm nói chung (ngoài nguồn tiết niệu)."],
  },

  {
    diseaseId: "v8-21",
    guidelineIds: ["sis-iai-2024"],
    scope: "Nhiễm khuẩn ổ bụng người lớn (SIS 2024).",
    recommendations: [],
    regimens: [],
    gaps: [
      "SIS 2024: mới xác minh trích dẫn và phạm vi (lựa chọn kháng sinh, thời điểm, đường dùng, thời gian, xuống thang). Toàn văn cần thuê bao – CHƯA trích khuyến cáo, không hiển thị phác đồ.",
    ],
  },

  // ================= Buoc 4D Nhom 2 =================
  // Viem mang nao nguoi lon (WHO 2025 + so tay WHO 2026)
  {
    diseaseId: "v8-36",
    guidelineIds: [WHO_MEN, WHO_MAN],
    scope: "Viêm màng não cấp mắc phải cộng đồng ở người lớn (WHO). Không bao phủ viêm màng não sau phẫu thuật thần kinh/chấn thương/dẫn lưu não thất (xem khoảng trống).",
    recommendations: [
      { text: "Nghi ngờ hoặc có khả năng viêm màng não vi khuẩn cấp: ceftriaxon hoặc cefotaxim tĩnh mạch làm điều trị kinh nghiệm; hai thuốc tương đương, ưu tiên ceftriaxon khi có dịch não mô cầu/phế cầu.", grade: "Mạnh; rất thấp", guidelineId: WHO_MEN, locator: "Executive summary – Empiric antimicrobial treatment regimens, PDF tr. 18" },
      { text: "Có ≥ 1 yếu tố nguy cơ Listeria (tuổi > 60, có thai, suy giảm miễn dịch: thuốc ức chế miễn dịch, ghép tạng, bệnh ác tính, HIV giai đoạn tiến triển, đái tháo đường, bệnh thận giai đoạn cuối, xơ gan, rối loạn sử dụng rượu): thêm ampicilin hoặc amoxicilin tĩnh mạch.", grade: "Mạnh; rất thấp", guidelineId: WHO_MEN, locator: "PDF tr. 18" },
      { text: "Vùng có tỷ lệ cao S. pneumoniae kháng penicilin hoặc cephalosporin thế hệ 3 (ngưỡng do quốc gia/địa phương xác định): cân nhắc thêm vancomycin tĩnh mạch. Nơi gánh nặng lao thấp có thể dùng rifampicin thay vancomycin; nơi gánh nặng lao cao chỉ dùng rifampicin khi không có hoặc chống chỉ định vancomycin.", grade: "Có điều kiện; rất thấp", guidelineId: WHO_MEN, locator: "PDF tr. 18–19" },
      { text: "Dị ứng beta-lactam: cần đánh giá kỹ trước khi chọn thuốc; phần lớn dị ứng penicilin không nặng vẫn dùng được cephalosporin và ngược lại; tiền sử phản ứng đe dọa tính mạng với beta-lactam thì tránh mọi beta-lactam.", guidelineId: WHO_MEN, locator: "Remarks, PDF tr. 19" },
      { text: "Thấm dịch não tủy: dùng đường tĩnh mạch, tránh kháng sinh uống (nồng độ dịch não tủy thấp hơn đáng kể); cần liều tĩnh mạch tối đa suốt đợt điều trị, thường cao hơn liều cho nhiễm khuẩn khác; ưu tiên thuốc diệt khuẩn.", guidelineId: WHO_MEN, locator: "Mục B.2.1 General principles, PDF tr. 57–58" },
      { text: "Ceftriaxon dùng liều tối đa, chia mỗi 12 giờ khi điều trị nội trú; chỉ dùng 1 lần/ngày khi không thể chia liều, với cùng tổng liều/ngày.", guidelineId: WHO_MEN, locator: "Implementation considerations, PDF tr. 67" },
      { text: "Corticosteroid tĩnh mạch (ưu tiên dexamethason) bắt đầu cùng liều kháng sinh đầu tiên ở nơi chọc dò tủy sống được; ngừng nếu dịch não tủy không phù hợp viêm màng não vi khuẩn; tối đa 4 ngày; ngừng nếu phân lập tác nhân khác S. pneumoniae và H. influenzae typ b. Không dùng ở người HIV giai đoạn tiến triển; chưa dùng khi chưa loại trừ sốt rét thể não.", grade: "Mạnh; thấp", guidelineId: WHO_MEN, locator: "Adjunctive corticosteroids, PDF tr. 22–23" },
      { text: "Không xác định được tác nhân (ngoài dịch): có thể ngừng kháng sinh kinh nghiệm sau 7 ngày nếu đã hồi phục lâm sàng ≥ 48 giờ (hết sốt, sinh hiệu bình thường, hết rối loạn ý thức); không hồi phục sau 1 tuần thì kéo dài điều trị và chọc dò lại.", grade: "Có điều kiện; rất thấp", guidelineId: WHO_MEN, locator: "Duration of empiric antimicrobial treatment, PDF tr. 19–20" },
      { text: "Dexamethason: 10 mg tĩnh mạch mỗi 6 giờ ở người lớn; dùng cùng liều kháng sinh đầu tiên hoặc sớm nhất có thể, không muộn hơn 12 giờ sau liều kháng sinh đầu.", guidelineId: WHO_MAN, locator: "Mục 7.5.2, tr. in 33" },
    ],
    regimens: [
      {
        scenario: "Khởi đầu – người lớn nghi viêm màng não vi khuẩn cấp (chức năng gan thận bình thường)",
        options: [
          "ceftriaxon 2 g TM mỗi 12 giờ (tối đa 4 g/ngày; chỉ khi không chia liều được: 4 g mỗi 24 giờ)",
          "HOẶC cefotaxim 2 g TM mỗi 4 giờ hoặc 3 g TM mỗi 6 giờ (tối đa 12 g/ngày)",
          "CỘNG dexamethason 10 mg TM mỗi 6 giờ, tối đa 4 ngày",
        ],
        guidelineId: WHO_MAN,
        locator: "Hình 12 (tr. in 31), Bảng 11 (tr. in 35–36)",
      },
      {
        scenario: "Có yếu tố nguy cơ Listeria – thêm vào phác đồ khởi đầu",
        options: ["ampicilin hoặc amoxicilin 2 g TM mỗi 4 giờ hoặc 3 g TM mỗi 6 giờ (tối đa 12 g/ngày)"],
        guidelineId: WHO_MAN,
        locator: "Hình 12, Bảng 11",
      },
      {
        scenario: "Vùng có tỷ lệ cao phế cầu kháng penicilin/cephalosporin thế hệ 3 – thêm vào phác đồ khởi đầu",
        options: [
          "vancomycin 15–20 mg/kg TM mỗi 8–12 giờ (tối đa 4 g/ngày)",
          "nơi gánh nặng lao thấp có thể thay bằng rifampicin 300 mg mỗi 12 giờ hoặc 600 mg mỗi 24 giờ",
        ],
        note: "Bảng 11 chú thích c, d: theo dõi nồng độ đáy vancomycin, đích 15–20 mg/L (bản gốc ghi 15–20 mcg/mL, cùng giá trị); không theo dõi được nồng độ thì không quá 3 g/ngày ở người lớn.",
        guidelineId: WHO_MAN,
        locator: "Hình 12, Bảng 11 chú thích c, d",
      },
      {
        scenario: "Thời gian điều trị theo tác nhân",
        options: ["S. pneumoniae 10–14 ngày", "N. meningitidis 5–7 ngày", "H. influenzae 7–10 ngày", "S. agalactiae 14–21 ngày", "L. monocytogenes 21 ngày", "E. coli và trực khuẩn Gram âm khác 14–21 ngày", "Không rõ tác nhân: 7 ngày nếu đã hồi phục lâm sàng"],
        guidelineId: WHO_MAN,
        locator: "Bảng 10 (tr. in 34–35)",
      },
    ],
    gaps: [
      "ESCMID 2016 (van de Beek, Clin Microbiol Infect 2016): toàn văn cần thuê bao – chưa trích.",
      "NICE NG240 (2024): trang NICE chặn truy cập tự động (403) – chưa trích.",
      "IDSA 2004 (viêm màng não vi khuẩn): trang IDSA ghi ARCHIVED – không dùng làm nguồn hiện hành.",
      "Viêm màng não sau chấn thương/phẫu thuật/dò dịch não tủy: IDSA 2017 Healthcare-Associated Ventriculitis and Meningitis (CURRENT) – chưa trích.",
    ],
  },
  // Viem mang nao tre em va so sinh
  {
    diseaseId: "v8-104",
    guidelineIds: [WHO_MEN, WHO_MAN],
    scope: "Trẻ > 1 tháng tuổi (WHO 2025, sổ tay 2026) và trẻ sơ sinh (sổ tay WHO 2026). Bệnh mắc phải cộng đồng.",
    recommendations: [
      { text: "Trẻ > 1 tháng: ceftriaxon hoặc cefotaxim tĩnh mạch làm điều trị kinh nghiệm.", grade: "Mạnh; rất thấp", guidelineId: WHO_MEN, locator: "PDF tr. 18" },
      { text: "Vùng có tỷ lệ cao phế cầu kháng penicilin/cephalosporin thế hệ 3: cân nhắc thêm vancomycin; rifampicin là lựa chọn thay thế nơi gánh nặng lao thấp.", grade: "Có điều kiện; rất thấp", guidelineId: WHO_MEN, locator: "PDF tr. 18–19" },
      { text: "Thấm dịch não tủy: đường tĩnh mạch, tránh kháng sinh uống; liều tĩnh mạch tối đa suốt đợt điều trị.", guidelineId: WHO_MEN, locator: "Mục B.2.1, PDF tr. 57–58" },
      { text: "Corticosteroid cùng liều kháng sinh đầu tiên ở trẻ > 1 tháng (nơi chọc dò được); tối đa 4 ngày; ngừng nếu tác nhân không phải S. pneumoniae/Hib. Dexamethason 0,15 mg/kg (tối đa 10 mg) mỗi 6 giờ.", grade: "Mạnh; thấp", guidelineId: WHO_MAN, locator: "Mục 7.5.2, tr. in 33–34; WHO 2025 PDF tr. 22–23" },
      { text: "Trẻ sơ sinh: KHÔNG khuyến cáo corticosteroid trong viêm màng não sơ sinh (thiếu bằng chứng lợi ích).", guidelineId: WHO_MAN, locator: "Mục 7.5.2 – Special considerations for neonates, tr. in 33" },
      { text: "Trẻ sơ sinh: thời gian điều trị kinh nghiệm 3 tuần, có thể dài hơn nếu không cải thiện.", guidelineId: WHO_MAN, locator: "Duration of empiric treatment, tr. in 33" },
      { text: "Không rõ tác nhân (trẻ > 1 tháng, ngoài dịch): có thể ngừng sau 7 ngày nếu hồi phục lâm sàng ≥ 48 giờ.", grade: "Có điều kiện; rất thấp", guidelineId: WHO_MEN, locator: "PDF tr. 19–20" },
    ],
    regimens: [
      {
        scenario: "Trẻ > 1 tháng – khởi đầu",
        options: [
          "ceftriaxon 100 mg/kg/ngày TM, 1 lần/ngày hoặc chia mỗi 12 giờ (50 mg/kg mỗi 12 giờ; tối đa 2 g mỗi 12 giờ)",
          "HOẶC cefotaxim 50 mg/kg TM mỗi 4 giờ (tối đa 2 g mỗi 4 giờ) hoặc 75 mg/kg mỗi 6 giờ (tối đa 3 g mỗi 6 giờ); tối đa 12 g/ngày",
          "CỘNG dexamethason 0,15 mg/kg (tối đa 10 mg) TM mỗi 6 giờ, tối đa 4 ngày",
        ],
        guidelineId: WHO_MAN,
        locator: "Hình 12 (tr. in 31), Bảng 11 (tr. in 35–36)",
      },
      {
        scenario: "Trẻ > 1 tháng – có yếu tố nguy cơ Listeria (suy giảm miễn dịch) hoặc vùng phế cầu kháng thuốc",
        options: [
          "ampicilin hoặc amoxicilin 50 mg/kg TM mỗi 4 giờ (tối đa 2 g mỗi 4 giờ) hoặc 75 mg/kg mỗi 6 giờ (tối đa 3 g mỗi 6 giờ)",
          "vancomycin 15–20 mg/kg TM mỗi 6–8 giờ; không theo dõi được nồng độ thì không quá 750 mg/liều",
          "rifampicin 10 mg/kg mỗi 12 giờ (tối đa 300 mg mỗi 12 giờ) – thay vancomycin nơi gánh nặng lao thấp",
        ],
        guidelineId: WHO_MAN,
        locator: "Hình 12, Bảng 11 chú thích c, d",
      },
      {
        scenario: "Trẻ sơ sinh – một thuốc beta-lactam KẾT HỢP gentamicin",
        options: [
          "ampicilin 50 mg/kg TM mỗi 12 giờ (tuần đầu) hoặc mỗi 8 giờ (sau tuần đầu)",
          "HOẶC cefotaxim 50 mg/kg TM mỗi 12 giờ (tuần đầu) hoặc mỗi 6 giờ (sau tuần đầu)",
          "HOẶC ceftriaxon 100 mg/kg TM 1 lần/ngày",
          "KẾT HỢP gentamicin 5 mg/kg 1 lần/ngày (tuần đầu) hoặc 7,5 mg/kg 1 lần/ngày (sau tuần đầu)",
        ],
        note: "Không dùng corticosteroid ở trẻ sơ sinh. Bảng 11 có meropenem 40 mg/kg TM mỗi 8 giờ ở cột sơ sinh. Tiêu đề cột Bảng 11 ghi \"neonates (>1 month)\" – nghi lỗi in, nội dung cột là liều theo tuần tuổi sơ sinh.",
        guidelineId: WHO_MAN,
        locator: "Hình 12 (cột Neonates), Bảng 11",
      },
    ],
    gaps: [
      "AAP Red Book, NICE NG240: chưa truy cập được nguồn chính thức – chưa trích.",
      "QĐ 3312/QĐ-BYT (2015, Nhi khoa): chưa tìm được bản trên cổng chính thức – CHƯA XÁC MINH có mục viêm màng não mủ.",
    ],
  },
  // Sot giam bach cau trung tinh
  ...["v8-113", "v8-116"].map<IntlEntry>((diseaseId) => ({
    diseaseId,
    guidelineIds: [ECIL, IPFN],
    scope: "ECIL-10: người lớn ung thư huyết học/ghép tế bào gốc. IPFN 2023: trẻ em ung thư và ghép tế bào gốc. Hai nguồn không ghi liều.",
    recommendations: [
      { text: "ECIL-10 – chiến lược leo thang (bệnh cảnh không phức tạp, chưa từng cư trú/nhiễm vi khuẩn kháng thuốc, nơi hiếm vi khuẩn kháng thuốc lúc khởi phát): cephalosporin chống Pseudomonas (cefepim, ceftazidim – tránh nếu tỷ lệ ESBL cao) hoặc piperacilin-tazobactam; lựa chọn khác: cefoperazon-sulbactam, piperacilin + gentamicin.", grade: "A-I (thuốc); B-II (chỉ định)", guidelineId: ECIL, locator: "Slide 9" },
      { text: "ECIL-10 – chiến lược xuống thang khi: sepsis/sốc nhiễm khuẩn; đã cư trú hoặc từng nhiễm vi khuẩn kháng thuốc; nơi thường gặp vi khuẩn kháng thuốc lúc khởi phát. Lựa chọn: carbapenem đơn trị; beta-lactam chống Pseudomonas + aminoglycosid; beta-lactam nhắm vào tác nhân cư trú theo kháng sinh đồ; thêm sớm glycopeptid/thuốc mới nếu có yếu tố nguy cơ Gram dương kháng thuốc.", guidelineId: ECIL, locator: "Slide 10" },
      { text: "ECIL-10 – chỉ định carbapenem kinh nghiệm: bệnh nặng (sepsis/sốc) và chưa cư trú/nhiễm vi khuẩn kháng carbapenem; đã cư trú hoặc nhiễm Enterobacterales sinh ESBL hay Gram âm kháng beta-lactam phổ hẹp; trung tâm có tỷ lệ cao ESBL lúc khởi phát.", grade: "A-IIu", guidelineId: ECIL, locator: "Slide 11" },
      { text: "ECIL-10 – phối hợp aminoglycosid: bệnh nặng (sepsis/sốc, viêm phổi); hoặc nghi Gram âm kháng các beta-lactam sẵn có (dịch tễ địa phương, cư trú/nhiễm trước đó, dùng carbapenem trong 30 ngày).", grade: "A-IIu", guidelineId: ECIL, locator: "Slide 12" },
      { text: "ECIL-10 – KHÔNG thường quy thêm glycopeptid. Chỉ thêm thuốc chống Gram dương kháng thuốc khi: huyết động không ổn định/sepsis/sốc/viêm phổi kèm cư trú MRSA (A-IIt), cư trú VRE kèm viêm niêm mạc nặng (C-III), hoặc chưa biết cư trú MRSA (C-III); cư trú MRSA (B-II); nghi nhiễm khuẩn catheter nặng (B-III); nhiễm khuẩn da/mô mềm (B-III).", grade: "D-IIru (thêm thường quy)", guidelineId: ECIL, locator: "Slide 14" },
      { text: "ECIL-10 – đánh giá lại tại 72–96 giờ (ổn định, sốt không rõ nguồn): ngừng aminoglycosid hoặc thuốc chống Gram dương nếu đã phối hợp; nếu đã dùng carbapenem/beta-lactam mới và hết sốt thì chuyển thuốc phổ hẹp hơn (cefepim, ceftazidim, piperacilin-tazobactam, cefoperazon-sulbactam). Còn sốt: làm thêm chẩn đoán, cân nhắc nấm và nguyên nhân khác.", grade: "B-IIuh / B-III", guidelineId: ECIL, locator: "Slide 15" },
      { text: "ECIL-10 – sốt không rõ nguồn: có thể ngừng kháng sinh kinh nghiệm sau ≥ 72 giờ nếu huyết động ổn định từ đầu và hết sốt ≥ 48 giờ, bất kể số lượng bạch cầu trung tính (nguy cơ cao > 10 ngày giảm sâu: B-I; nguy cơ trung bình 7–10 ngày: A-I). Còn sốt nhưng ổn định: tiếp tục (B-I), tìm ổ nhiễm; không thêm thuốc chống Gram dương (D-I) hoặc Gram âm kháng thuốc (D-IIu) chỉ vì còn sốt.", grade: "A-I / B-I", guidelineId: ECIL, locator: "Slide 21" },
      { text: "IPFN 2023 (trẻ em) – áp dụng một thang phân tầng nguy cơ đã thẩm định.", grade: "Mạnh; thấp", guidelineId: IPFN, locator: "A1" },
      { text: "IPFN 2023 – nguy cơ cao: đơn trị beta-lactam chống Pseudomonas, cephalosporin thế hệ 4 hoặc carbapenem; chỉ thêm thuốc Gram âm thứ hai hoặc glycopeptid khi không ổn định, nghi kháng thuốc, hoặc trung tâm có tỷ lệ kháng cao. Nên dành carbapenem cho trẻ không ổn định.", grade: "Mạnh; cao / trung bình", guidelineId: IPFN, locator: "A6a, A6b" },
      { text: "IPFN 2023 – nguy cơ thấp: cân nhắc điều trị ngoại trú và kháng sinh uống nếu có hạ tầng theo dõi.", grade: "Có điều kiện; trung bình", guidelineId: IPFN, locator: "A7a, A7b" },
      { text: "IPFN 2023 – đáp ứng điều trị: ngừng phối hợp Gram âm thứ hai hoặc glycopeptid sau 24–72 giờ nếu không có chỉ định vi sinh; không mở rộng phổ chỉ vì còn sốt khi ổn định; không ổn định thì mở rộng phổ (Gram âm kháng thuốc, Gram dương, kỵ khí).", grade: "Mạnh", guidelineId: IPFN, locator: "B1–B3" },
      { text: "IPFN 2023 – ngừng kháng sinh: hết sốt ≥ 24 giờ, cấy máu âm tính 48 giờ và có dấu hiệu hồi phục tủy (mạnh); nguy cơ thấp có thể ngừng dù chưa hồi phục tủy (có điều kiện).", guidelineId: IPFN, locator: "B4, B5" },
      { text: "IPFN 2023 – nấm: nguy cơ cao nấm xâm lấn, sốt kéo dài ≥ 96 giờ không đáp ứng: caspofungin hoặc amphotericin B liposome, trừ khi chọn chiến lược điều trị theo bằng chứng (pre-emptive); chụp CT phổi; nguy cơ thấp có thể không dùng kháng nấm kinh nghiệm.", guidelineId: IPFN, locator: "C1, C3a, C4–C6" },
      { text: "IPFN 2023 – trẻ sốt có biểu hiện không ổn định: bắt đầu kháng sinh kinh nghiệm sớm nhất có thể.", grade: "Thực hành tốt", guidelineId: IPFN, locator: "Good practice statement 1" },
    ],
    regimens: [],
    gaps: [
      "Liều: ECIL-10 và IPFN 2023 không ghi liều – ứng dụng chỉ có liều người lớn của QĐ 708; chưa có liều trẻ em đã xác minh.",
      "IDSA 2010 (sốt giảm bạch cầu, nguồn mà QĐ 708 dẫn chiếu): trang IDSA ghi ARCHIVED.",
      "ESMO 2016: Annals of Oncology trả lỗi 403 – chưa trích. NICE CG151: trang NICE chặn truy cập – chưa trích.",
      "Phác đồ người lớn nguy cơ thấp (uống/ngoại trú): QĐ 708 không có; chưa có nguồn quốc tế đã trích – THIẾU BẰNG CHỨNG.",
    ],
  })),
  // Nhiem khuan huyet S. aureus
  {
    diseaseId: "v8-13",
    guidelineIds: [SAB, "ashp-idsa-vanco-2020"],
    scope: "Nhiễm khuẩn huyết do S. aureus ở người lớn và trẻ em. Part 1 không gồm lựa chọn thuốc.",
    recommendations: [
      { text: "Người lớn: phân tầng nguy cơ ổ nhiễm sâu/di bệnh/tái phát thay cho \"có/không biến chứng\". Ba yếu tố chính: khởi phát cộng đồng; cấy máu dương tính ≥ 48 giờ sau lần cấy dương tính đầu; có dụng cụ trong tim. Yếu tố khác: bệnh van tim dễ mắc, tiêm chích ma túy, mảnh ghép nội mạch, SAB trong 90 ngày, dấu hiệu ổ nhiễm sâu, biến cố tắc mạch, > 1 ổ nhiễm không liên tục, không rõ ổ.", grade: "Đồng thuận", guidelineId: SAB, locator: "Consensus Statement 1" },
      { text: "Trẻ em: mọi trẻ SAB đều được đánh giá tìm ổ nhiễm sâu; chưa đủ dữ liệu xác định nhóm trẻ nguy cơ thấp; sơ sinh cần xem xét riêng (nguy cơ viêm nội tâm mạc cao hơn).", grade: "Đồng thuận", guidelineId: SAB, locator: "Consensus Statement 1 – Pediatric" },
      { text: "Cấy máu kiểm tra (người lớn): ít nhất 2 bộ tại 48 giờ sau lần lấy cấy máu dương tính đầu, rồi lặp lại 1–2 bộ mỗi 24–48 giờ đến khi âm tính. Cấy dương tính ≥ 48 giờ phải đánh giá thêm và xem lại kiểm soát ổ nhiễm. Ngày cấy máu sạch khuẩn là ngày bắt đầu tính thời gian điều trị.", grade: "Đồng thuận", guidelineId: SAB, locator: "Consensus Statement 2" },
      { text: "Siêu âm tim qua thành ngực (TTE) thường quy ở mọi người lớn SAB. Trẻ em: TTE khi có bệnh tim cấu trúc, nhiễm khuẩn huyết kéo dài hoặc dấu hiệu viêm nội tâm mạc.", grade: "Đồng thuận", guidelineId: SAB, locator: "Consensus Statement 3" },
      { text: "Siêu âm tim qua thực quản (TEE) ở người lớn có TTE âm tính nếu có: dụng cụ trong tim, bệnh van tim dễ mắc/từng viêm nội tâm mạc, cấy máu dương tính ≥ 48 giờ, biến cố tắc mạch, > 1 ổ nhiễm không liên tục; cân nhắc khi khởi phát cộng đồng hoặc tiêm chích ma túy.", grade: "Đồng thuận", guidelineId: SAB, locator: "Consensus Statement 4" },
      { text: "Người lớn nguy cơ tăng, chưa rõ ổ sau đánh giá ban đầu: chẩn đoán hình ảnh toàn thân (ví dụ [18F]FDG-PET/CT) hoặc phối hợp các phương tiện hình ảnh khảo sát vị trí nghi ngờ.", grade: "Đồng thuận", guidelineId: SAB, locator: "Consensus Statement 5" },
      { text: "Thời gian điều trị: 14 ngày (tính từ ngày cấy máu sạch khuẩn) cho người lớn nguy cơ thấp hoặc nguy cơ tăng nhưng không có ổ nhiễm sâu/di bệnh sau đánh giá; cân nhắc > 14 ngày khi nhiễm khuẩn huyết kéo dài, đánh giá chưa đầy đủ. Trẻ em không có ổ nhiễm sâu: 14 ngày.", grade: "Đồng thuận", guidelineId: SAB, locator: "Consensus Statement 6, 7" },
      ...VANCO_RECS,
    ],
    regimens: [],
    gaps: [
      "Lựa chọn thuốc MSSA/MRSA (beta-lactam chống tụ cầu, cefazolin, daptomycin, phối hợp): IDSA/ESCMID 2026 sẽ công bố ở phần sau – CHƯA có nguồn quốc tế hiện hành đã trích. IDSA MRSA 2011: ARCHIVED.",
      "Điều trị viêm nội tâm mạc do S. aureus (ESC 2023, AHA 2015): chưa trích.",
    ],
  },

  // ================= Module co san =================
  ...["v8-7", "v8-58"].map<IntlEntry>((diseaseId) => ({
    diseaseId,
    guidelineIds: ["uptodate-abrs", CDC_OUT],
    scope: "ABRS ngoại trú, không biến chứng, người lớn miễn dịch bình thường.",
    recommendations: [
      { text: "Người lớn – chẩn đoán viêm mũi xoang cấp do vi khuẩn khi: nặng (> 3–4 ngày, sốt ≥ 39 °C và chảy mũi mủ hoặc đau mặt); kéo dài (> 10 ngày không cải thiện); hoặc nặng lên (3–4 ngày sốt/ho ban ngày/chảy mũi mới hoặc nặng hơn). Khuyến khích theo dõi chờ đợi cho ca không biến chứng có thể tái khám.", guidelineId: CDC_OUT, locator: "Adult outpatient – Acute rhinosinusitis (cập nhật 16/04/2024)" },
      { text: "Người lớn: amoxicillin hoặc amoxicillin/clavulanat là điều trị đầu tay; dị ứng penicillin: doxycyclin hoặc fluoroquinolon hô hấp (levofloxacin, moxifloxacin). CDC không nêu liều.", guidelineId: CDC_OUT, locator: "Adult outpatient – Acute rhinosinusitis" },
      { text: "Trẻ em: kê kháng sinh khi viêm xoang cấp do vi khuẩn nặng hoặc nặng lên; triệu chứng kéo dài có thể theo dõi chờ đợi tối đa 3 ngày. Amoxicillin hoặc amoxicillin/clavulanat là đầu tay; dị ứng penicillin typ I: khuyến cáo khác nhau – xem AAP/IDSA.", guidelineId: CDC_OUT, locator: "Pediatric outpatient – Acute rhinosinusitis (cập nhật 22/04/2024)" },
    ],
    regimens: [],
    module: "abrs",
    gaps: ["Liều trong module ABRS lấy từ UpToDate (cần tài khoản) – chưa đối chiếu lại 26/10/2026."],
  })),
  ...["v8-8", "v8-54"].map<IntlEntry>((diseaseId) => ({
    diseaseId,
    guidelineIds: ["ent-module"],
    scope: "Nội dung CDC (viêm họng liên cầu nhóm A) và NICE NG91 (viêm tai giữa cấp trẻ em) trong module Tai Mũi Họng.",
    recommendations: [],
    regimens: [],
    module: "ent",
  })),
  ...["v8-60", "v8-99"].map<IntlEntry>((diseaseId) => ({
    diseaseId,
    guidelineIds: ["ent-module", CDC_OUT],
    scope: "Viêm tai giữa cấp. Module Tai Mũi Họng dùng NICE NG91 (trẻ em).",
    recommendations: [
      { text: "Trẻ em: amoxicillin vẫn là đầu tay cho trẻ chưa dùng amoxicillin trong 30 ngày qua. Quá mẫn không typ I với penicillin: cefdinir, cefuroxim, cefpodoxim hoặc ceftriaxon. Theo dõi chờ đợi (quyết định chung) có thể phù hợp với ca nhẹ một bên ở trẻ 6–23 tháng và ca một/hai bên ở trẻ > 2 tuổi. CDC không nêu liều.", guidelineId: CDC_OUT, locator: "Pediatric outpatient – Acute otitis media (cập nhật 22/04/2024)" },
    ],
    regimens: [],
    module: "ent",
    gaps: ["Liều NICE NG91 trong module chưa đối chiếu lại được (trang NICE trả lỗi 403 ngày 26/10/2026). Người lớn: chưa có guideline quốc tế đã trích."],
  })),
  // ================= Master Task 5 – Nhom 4 (26/10/2026) =================
  {
    diseaseId: "v8-6",
    guidelineIds: [GOLD],
    scope: "Đợt cấp COPD ở người lớn.",
    recommendations: [
      { text: "Dùng kháng sinh trong đợt cấp khi người bệnh: có ít nhất 2 trong các triệu chứng tăng khó thở, sốt, tăng lượng đờm, tăng đờm mủ – nếu tăng đờm mủ là một trong số đó; HOẶC có cấy đờm dương tính trong đợt cấp trước; HOẶC cần thông khí cơ học (xâm nhập hoặc không xâm nhập).", guidelineId: GOLD, locator: "Chương 4 – Antibiotics, tr. 104" },
      { text: "Chọn kháng sinh theo tình hình kháng thuốc tại chỗ. Điều trị kinh nghiệm ban đầu thường là aminopenicillin + acid clavulanic, macrolid, tetracyclin hoặc – ở người bệnh chọn lọc – quinolon.", guidelineId: GOLD, locator: "Chương 4 – Antibiotics, tr. 104" },
      { text: "Người bệnh đợt cấp thường xuyên, tắc nghẽn nặng và/hoặc đợt cấp cần thở máy: cấy đờm hoặc bệnh phẩm phổi vì có thể có vi khuẩn Gram âm (ví dụ Pseudomonas) hoặc vi khuẩn kháng các thuốc trên. Đường dùng (uống/tĩnh mạch) tùy tình trạng người bệnh và dược động học của thuốc.", guidelineId: GOLD, locator: "Chương 4 – Antibiotics, tr. 104" },
      { text: "Thời gian: khuyến cáo ≤ 5 ngày kháng sinh cho điều trị ngoại trú đợt cấp COPD; ý chính của chương: kháng sinh tổng cộng 5 ngày ở người bệnh có đờm mủ, tiền sử nhiễm khuẩn phổi…", guidelineId: GOLD, locator: "Chương 4, tr. 104; Key points, tr. 91" },
      { text: "Hiện chưa khuyến cáo dùng phác đồ dựa trên procalcitonin để quyết định dùng kháng sinh trong đợt cấp COPD (kết quả nghiên cứu mâu thuẫn).", guidelineId: GOLD, locator: "Chương 4 – Antibiotics, tr. 104" },
    ],
    regimens: [],
    gaps: ["GOLD 2026 không nêu liều kháng sinh – liều theo văn bản BYT (QĐ 2767) và chuyên luận."],
  },
  {
    diseaseId: "v8-142",
    guidelineIds: [WHO_TB],
    scope: "Lao nhạy cảm thuốc (người lớn và trẻ em).",
    recommendations: [],
    regimens: [],
    gaps: [
      "WHO Module 4 (2025): đã xác nhận phiên bản và cấu trúc (phác đồ 6 tháng; phác đồ 4 tháng 2HPMZ/2HPM và 2HRZ(E)/2HR) nhưng CHƯA đọc được nguyên văn khuyến cáo (hiển thị dạng ảnh; PDF bị chặn 403).",
      "QĐ 162/QĐ-BYT (2024) đã cập nhật các phác đồ 4 tháng tương ứng (A1a, A2a) – dùng làm nguồn chính.",
    ],
  },
  {
    diseaseId: "v8-141",
    guidelineIds: [WHO_TB],
    scope: "Lao màng não/lao hệ thần kinh trung ương nhạy cảm thuốc.",
    recommendations: [
      { text: "Corticoid bổ trợ trong lao màng não: dùng bất kể mức độ nặng của viêm màng não (cân nhắc theo phân nhóm).", guidelineId: WHO_TB, locator: "Chương 1, mục 4 – Subgroup considerations (tbksp.who.int/en/node/2965)" },
      { text: "Dùng corticoid đường uống nếu không có dạng tĩnh mạch.", guidelineId: WHO_TB, locator: "Chương 1, mục 4 – Implementation considerations" },
    ],
    regimens: [],
    gaps: [
      "Nguyên văn khuyến cáo 4.1/4.2 (độ mạnh, mức chứng cứ) và phác đồ 6HRZEto cho trẻ em: hiển thị dạng ảnh/PDF bị chặn – CHƯA trích. QĐ 162 (phác đồ B2a) đã có phác đồ 6 tháng.",
    ],
  },
  {
    diseaseId: "v8-84",
    guidelineIds: [AAO_BK],
    scope: "Viêm giác mạc do vi khuẩn.",
    recommendations: [
      { text: "Thuốc tra mắt kháng sinh đạt nồng độ mô cao và là cách điều trị ưu tiên cho phần lớn trường hợp; đa số ổ loét nhỏ ngoài trung tâm mắc phải ở cộng đồng khỏi với điều trị kinh nghiệm tại chỗ.", guidelineId: AAO_BK, locator: "Initial Treatment, tr. P105" },
      { text: "Viêm giác mạc trung tâm hoặc nặng (tổn thương nhu mô sâu hoặc thâm nhiễm > 2 mm với nhiều mủ): liều nạp, ví dụ mỗi 5–15 phút, sau đó tra thường xuyên, ví dụ mỗi giờ.", guidelineId: AAO_BK, locator: "tr. P106" },
      { text: "Đơn trị fluoroquinolon hiệu quả tương đương phối hợp kháng sinh tăng cường (fortified); cân nhắc kháng sinh tăng cường cho thâm nhiễm lớn và/hoặc ảnh hưởng thị lực, đặc biệt khi có mủ tiền phòng. Ciprofloxacin 0,3%, ofloxacin 0,3%, levofloxacin 1,5% được FDA chấp thuận cho viêm giác mạc do vi khuẩn.", guidelineId: AAO_BK, locator: "tr. P106" },
      { text: "Kháng fluoroquinolon đang tăng; fluoroquinolon nhìn chung kém hiệu quả với MRSA ở mắt; MRSA thường nhạy vancomycin. Phối hợp kháng sinh tăng cường là lựa chọn cân nhắc cho nhiễm nặng hoặc không đáp ứng điều trị ban đầu.", guidelineId: AAO_BK, locator: "tr. P106–P107" },
      { text: "Kháng sinh toàn thân hiếm khi cần – cân nhắc khi nhiễm lan sang mô kế cận (củng mạc) hoặc dọa/thủng giác mạc; BẮT BUỘC dùng toàn thân với viêm giác mạc do lậu cầu.", guidelineId: AAO_BK, locator: "tr. P107" },
      { text: "Corticoid có thể cân nhắc sau 48 giờ kháng sinh khi đã xác định tác nhân và/hoặc nhiễm khuẩn đã đáp ứng; tránh khi nghi Acanthamoeba, Nocardia hoặc nấm. Ca nặng: tái khám hằng ngày đến khi ổn định.", guidelineId: AAO_BK, locator: "Highlighted findings, tr. P97; tr. P107" },
    ],
    regimens: [],
    gaps: ["Nồng độ kháng sinh tăng cường và Bảng 4 AAO: chưa nhập (bản trích văn bản lệch cột)."],
  },
  {
    diseaseId: "v8-83",
    guidelineIds: [AAO_CONJ],
    scope: "Viêm kết mạc do vi khuẩn.",
    recommendations: [
      { text: "Viêm kết mạc do vi khuẩn nhẹ thường tự khỏi ở người lớn miễn dịch bình thường; kháng sinh tra mắt giúp khỏi sớm hơn (ngày 2–5). Đợt 5–7 ngày kháng sinh tra mắt phổ rộng thường có hiệu quả; không có bằng chứng thuốc nào ưu thế – có thể chọn thuốc thuận tiện hoặc rẻ nhất.", guidelineId: AAO_CONJ, locator: "Mild Bacterial Conjunctivitis, tr. P176" },
      { text: "Mức độ trung bình–nặng (mủ nhiều, đau, viêm nhiều): lấy bệnh phẩm cấy và nhuộm Gram nếu có thể do lậu cầu; chọn kháng sinh theo kết quả xét nghiệm; MRSA tăng và kháng nhiều thuốc tra mắt thương mại.", guidelineId: AAO_CONJ, locator: "Moderate to Severe Bacterial Conjunctivitis, tr. P176" },
      { text: "Viêm kết mạc do lậu cầu: BẮT BUỘC kháng sinh toàn thân; rửa bằng nước muối; tổn thương giác mạc thì thêm điều trị tại chỗ như viêm giác mạc; tái khám hằng ngày. Thể vi khuẩn khác: hẹn tái khám sau 3–4 ngày nếu không cải thiện.", guidelineId: AAO_CONJ, locator: "Gonococcal Conjunctivitis, tr. P177" },
    ],
    regimens: [],
    gaps: ["Liều kháng sinh toàn thân cho lậu cầu/Chlamydia (Phụ lục 4 AAO): chưa trích – không thuộc phác đồ kinh nghiệm của mặt bệnh."],
  },
  {
    diseaseId: "v8-88",
    guidelineIds: [],
    scope: "Viêm túi lệ cấp.",
    recommendations: [],
    regimens: [],
    gaps: [
      "Tra cứu 26/10/2026: không tìm thấy hướng dẫn của hội chuyên ngành quốc tế lớn (AAO, ASOPRS…). Chỉ có hướng dẫn khu vực (NHS Scotland, Sydney Eye Hospital) – không dùng làm nguồn đối chiếu.",
    ],
  },
  {
    diseaseId: "v8-128",
    guidelineIds: [WHO_CRYPTO],
    scope: "Bệnh do Cryptococcus ở người nhiễm HIV.",
    recommendations: [],
    regimens: [],
    gaps: ["WHO 2022 nêu phác đồ cho viêm màng não Cryptococcus; chưa đọc được nội dung cho thể ngoài TKTW (trang who.int 403). Không suy ra liều từ phác đồ viêm màng não."],
  },
  {
    diseaseId: "v8-97",
    guidelineIds: [IDSA_ASB],
    scope: "Nhiễm khuẩn niệu ở phụ nữ mang thai (gồm khuẩn niệu không triệu chứng).",
    recommendations: [
      { text: "Phụ nữ mang thai: khuyến cáo sàng lọc và điều trị khuẩn niệu không triệu chứng; gợi ý cấy nước tiểu ở một trong các lần khám đầu thai kỳ.", grade: "Mạnh; chứng cứ trung bình", guidelineId: IDSA_ASB, locator: "Mục III, khuyến cáo 1" },
      { text: "Phụ nữ mang thai có khuẩn niệu không triệu chứng: gợi ý điều trị 4–7 ngày thay vì ngắn hơn; thời gian tối ưu tùy thuốc – dùng đợt ngắn nhất có hiệu quả.", grade: "Yếu; chứng cứ thấp", guidelineId: IDSA_ASB, locator: "Mục III, khuyến cáo 2" },
    ],
    regimens: [],
    gaps: ["IDSA 2019 không nêu thuốc/liều cụ thể trong các khuyến cáo này. Viêm thận bể thận thai kỳ: chưa có guideline quốc tế đã trích."],
  },
  {
    diseaseId: "v8-95",
    guidelineIds: [CDC_STI],
    scope: "Viêm âm đạo do vi khuẩn (bacterial vaginosis).",
    recommendations: [
      { text: "Điều trị cho mọi phụ nữ mang thai có triệu chứng; có thể dùng bất kỳ phác đồ khuyến cáo nào cho người không mang thai, và phác đồ thay thế clindamycin uống hoặc viên đặt clindamycin. Tránh tinidazol, secnidazol, kem clindamycin 2% Clindesse, gel metronidazol 1,3% và viên đặt metronidazol 750 mg trong thai kỳ (thiếu dữ liệu).", guidelineId: CDC_STI, locator: "Pregnancy" },
    ],
    regimens: [
      {
        kind: "empiric",
        scenario: "Phác đồ khuyến cáo",
        options: [
          "Metronidazol 500 mg uống 2 lần/ngày × 7 ngày",
          "Gel metronidazol 0,75%: 1 ống bơm đầy (5 g) đặt âm đạo, 1 lần/ngày × 5 ngày",
          "Kem clindamycin 2%: 1 ống bơm đầy (5 g) đặt âm đạo trước khi ngủ × 7 ngày",
        ],
        note: "Kem clindamycin là dạng dầu – có thể làm yếu bao cao su latex và màng ngăn âm đạo.",
        guidelineId: CDC_STI,
        locator: "Recommended Regimens for Bacterial Vaginosis",
      },
      {
        kind: "empiric",
        scenario: "Phác đồ thay thế",
        options: [
          "Clindamycin 300 mg uống 2 lần/ngày × 7 ngày",
          "Viên đặt clindamycin 100 mg đặt âm đạo trước khi ngủ × 3 ngày",
          "Secnidazol 2 g cốm uống liều duy nhất",
          "Tinidazol 2 g uống 1 lần/ngày × 2 ngày, hoặc tinidazol 1 g uống 1 lần/ngày × 5 ngày",
        ],
        guidelineId: CDC_STI,
        locator: "Alternative Regimens",
      },
    ],
    gaps: ["Văn bản BYT ghi \"gel clindamycin 2%\"; CDC chỉ nêu dạng KEM 2% – không áp liều CDC cho dạng gel."],
  },
  {
    diseaseId: "v8-26",
    guidelineIds: [IDSA_DIARRHEA],
    scope: "Tiêu chảy nhiễm khuẩn (người lớn và trẻ em).",
    recommendations: [
      { text: "Không dùng kháng sinh kinh nghiệm cho tiêu chảy phân máu ở người miễn dịch bình thường trong khi chờ kết quả, TRỪ: trẻ < 3 tháng nghi do vi khuẩn; người bệnh có sốt ghi nhận tại cơ sở y tế, đau bụng, phân máu và biểu hiện lỵ trực khuẩn (đi ngoài nhiều lần phân ít có máu, sốt, quặn bụng, mót rặn) nghi Shigella; người mới đi nước ngoài có nhiệt độ ≥ 38,5 °C và/hoặc dấu hiệu nhiễm khuẩn huyết.", grade: "Mạnh; thấp (ngoại lệ du lịch: yếu; thấp)", guidelineId: IDSA_DIARRHEA, locator: "Khuyến cáo 30" },
      { text: "Kháng sinh kinh nghiệm người lớn: fluoroquinolon (ví dụ ciprofloxacin) hoặc azithromycin, tùy tính nhạy cảm tại chỗ và tiền sử du lịch. Trẻ em: cephalosporin thế hệ 3 cho trẻ < 3 tháng và trẻ có biểu hiện thần kinh, hoặc azithromycin.", grade: "Mạnh; trung bình", guidelineId: IDSA_DIARRHEA, locator: "Khuyến cáo 31" },
      { text: "Cân nhắc kháng sinh kinh nghiệm ở người suy giảm miễn dịch bệnh nặng có tiêu chảy phân máu. Không điều trị kinh nghiệm cho người tiếp xúc không triệu chứng.", grade: "Mạnh; thấp / Mạnh; trung bình", guidelineId: IDSA_DIARRHEA, locator: "Khuyến cáo 32, 33" },
      { text: "Người bệnh có biểu hiện nhiễm khuẩn huyết nghi sốt thương hàn: điều trị kinh nghiệm phổ rộng sau khi cấy máu, phân, nước tiểu; thu hẹp khi có kháng sinh đồ.", grade: "Mạnh; thấp", guidelineId: IDSA_DIARRHEA, locator: "Khuyến cáo 34" },
      { text: "Điều chỉnh hoặc ngừng kháng sinh khi xác định được tác nhân phù hợp lâm sàng.", grade: "Mạnh; cao", guidelineId: IDSA_DIARRHEA, locator: "Khuyến cáo 38" },
    ],
    regimens: [],
    gaps: ["IDSA 2017 không nêu liều trong các khuyến cáo trên. WHO (hướng dẫn lỵ trực khuẩn 2005): cũ, chưa xác nhận bản thay thế."],
  },
];

export function getIntlEntry(diseaseId: string): IntlEntry | undefined {
  return INTL_ENTRIES.find((entry) => entry.diseaseId === diseaseId);
}

/* Muc tham khao cho moi mat benh (Tab 4) – doi chieu lieu, khong phai phac do. */
export const DOSE_REFERENCES = [
  {
    name: "Dược thư quốc gia Việt Nam, lần xuất bản thứ ba (2023)",
    use: "Liều và hiệu chỉnh theo chức năng thận – qua module Hiệu chỉnh liều (có số trang từng chuyên luận).",
    status: "Đang dùng trong ứng dụng",
  },
  {
    name: "Sanford Guide; CMDT 2026; DiPiro Pharmacotherapy",
    use: "Đối chiếu thông tin thuốc. CMDT 2026 Table 35–5 dùng trong module Theo tác nhân.",
    status: "Sanford, DiPiro: chưa có dữ liệu trong ứng dụng – CHƯA XÁC MINH",
  },
];
