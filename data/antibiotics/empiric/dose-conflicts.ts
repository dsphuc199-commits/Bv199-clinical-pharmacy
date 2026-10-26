/*
  FILE: data/antibiotics/empiric/dose-conflicts.ts

  DOI CHIEU LIEU BYT – QUOC TE (Buoc 4D.1, Nhom 1: v8-11, v8-12, v8-4, v8-5, v8-14;
  Buoc 4D Nhom 2: v8-36, v8-104, v8-113, v8-116, v8-13).

  Nguyen tac:
  - Lieu BYT giu NGUYEN VAN trong phac do (regimens/). File nay chi them ghi chu doi chieu.
  - Moi nguon hien thi RIENG (BYT / quoc te), co ten huong dan, to chuc, nam, vi tri, URL.
  - KHONG chon mot lieu thay lieu khac. KHONG quy doi don vi khi chua du du lieu.
  - IDSA AMR 2026 chi dung doi chieu lieu khi DA XAC DINH/NGHI tac nhan khang thuoc,
    KHONG suy dien phac do kinh nghiem.
  - Ghi chu duoc gan vao muc "Lưu ý" cua phuong an (regimens/index.ts), khong doi giao dien.
  Doc nguon ngay 25/10/2026.
*/

export type DoseRef = {
  /* Ten huong dan, to chuc, nam */
  source: string;
  /* Muc/bang/trang */
  locator: string;
  url?: string;
  dose: string;
};

export type DoseConflict = {
  id: string;
  topic: string;
  diseaseIds: string[];
  /* Phuong an BYT duoc gan ghi chu */
  regimenIds: string[];
  byt: DoseRef[];
  intl: DoseRef[];
  warning: string;
  /* Noi dung can HĐT&ĐT / chuyen gia quyet dinh */
  decision: string;
};

const URL_708 = "https://kcb.vn/thu-vien-tai-lieu/tai-lieu-huong-dan-su-dung-khang-sinh.html";
const URL_ATS = "https://www.idsociety.org/practice-guideline/hap_vap/";
const URL_VANCO = "https://www.idsociety.org/practice-guideline/vancomycin/";
const URL_AMR = "https://www.idsociety.org/practice-guideline/amr-guidance/";
const URL_SSC =
  "https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026";

const BYT708 = "BYT – QĐ 708/QĐ-BYT, Hướng dẫn sử dụng kháng sinh (2015)";
const DTQG = "Dược thư quốc gia Việt Nam lần 3 (2023)";
const ATS = "ATS/IDSA – HAP/VAP Guideline (2016), Kalil AC, Clin Infect Dis 2016;63:e61–e111";
const VANCO = "ASHP/IDSA/PIDS/SIDP – Đồng thuận theo dõi vancomycin trong nhiễm MRSA nặng (2020), Rybak MJ, Am J Health-Syst Pharm 2020;77(11):835–864";
const AMR = "IDSA – AMR Guidance v5.0 (2026), Tamma PD, Clin Infect Dis 2026";
const SSC = "SCCM/ESICM – Surviving Sepsis Campaign (2026)";

const SEPSIS = ["v8-11", "v8-12"];
const DECIDE = "HĐT&ĐT BV199 quyết định liều áp dụng; ứng dụng không chọn thay.";

/* ---------------- Don vi ---------------- */

export const VANCO_UNIT_NOTE =
  "Đơn vị nồng độ vancomycin: ứng dụng ghi mg/L. 1 µg/mL = 1 mg/L (cùng giá trị, chỉ khác cách viết), nên \"10–20 µg/mL\" của QĐ 708 là 10–20 mg/L. ATS/IDSA 2016 Table 4 ghi nguyên văn \"15–20 mg/mL\" – nghi lỗi in, KHÔNG quy đổi; Table 3 không nêu đích nồng độ.";

export const COLISTIN_UNIT_NOTE =
  "Đơn vị colistin – không cộng gộp, không tự quy đổi: (1) MIU = triệu đơn vị quốc tế colistimethat (QĐ 708, DTQG, nhãn thuốc tại BV199); (2) mg CBA = mg colistin base activity (ATS/IDSA 2016); (3) mg CMS = mg colistimethat natri (tiền chất). Tương đương gần đúng theo nguồn: ATS/IDSA 2016 Table 3 chú thích e – 1 MIU ≈ 30 mg CBA ≈ 80 mg CMS; QĐ 708 tr. 254 – 6.000.000 đơn vị ≈ 200 mg colistin base; nhãn thuốc trong danh mục BV199 ghi 1 MIU ≈ 33,33 mg colistin base. Các tỷ lệ này không trùng nhau hoàn toàn; bảng quy đổi theo sản phẩm cần HĐT&ĐT duyệt.";

/* ---------------- Danh sach doi chieu ---------------- */

export const DOSE_CONFLICTS: DoseConflict[] = [
  {
    id: "vancomycin",
    topic: "Vancomycin (nghi/xác định MRSA)",
    diseaseIds: [...SEPSIS, "v8-4", "v8-5", "v8-13"],
    regimenIds: ["r-sepsis-a-mrsa", "r-sepsis-b-mrsa", "r-sepsis-c-device", "r-sepsis-c-skin", "r-hap-late-mild", "r-hap-late-icu", "r-vap-mrsa", "r-bsi-mssa-alt", "r-bsi-mrsa"],
    byt: [
      { source: BYT708, locator: "Bảng II.10 (tr. 122), Bảng II.6 (tr. 96–97)", url: URL_708, dose: "1 g mỗi 12 giờ, truyền TM" },
      { source: BYT708, locator: "Bảng II.9 (tr. 106)", url: URL_708, dose: "1 g mỗi 12 giờ; nặng có thể tới 1,5 g mỗi 12 giờ khi CrCl ≥ 90 mL/phút; giám sát nồng độ đáy 10–20 µg/mL (= 10–20 mg/L)" },
      { source: DTQG, locator: "tr. in 1640–1644", dose: "15–20 mg/kg mỗi 8–12 giờ; liều nạp 25–30 mg/kg ở người bệnh nặng" },
    ],
    intl: [
      { source: ATS, locator: "Table 3, Table 4", url: URL_ATS, dose: "15 mg/kg TM mỗi 8–12 giờ; cân nhắc liều nạp 25–30 mg/kg x 1 khi bệnh nặng. Table 4 ghi đích đáy \"15–20 mg/mL\" (nguyên văn, nghi lỗi in)" },
      { source: VANCO, locator: "Khuyến cáo AUC (A-II), PDF tr. 6", url: URL_VANCO, dose: "Nhiễm MRSA nặng (nghi hoặc xác định): đích AUC24/MIC 400–600, giả định MIC (vi pha loãng) = 1 mg/L. Chức năng thận bình thường: 15–20 mg/kg (cân nặng thực) mỗi 8–12 giờ, truyền ngắt quãng (A-II)" },
      { source: VANCO, locator: "Khuyến cáo 4 (A-II), PDF tr. 7", url: URL_VANCO, dose: "Không còn khuyến cáo theo dõi chỉ bằng nồng độ đáy với đích 15–20 mg/L (hiệu quả và độc tính thận)" },
      { source: VANCO, locator: "Mục Loading Doses (B-II), PDF tr. 10", url: URL_VANCO, dose: "Bệnh nặng: có thể dùng liều nạp 20–35 mg/kg theo cân nặng thực, không quá 3.000 mg" },
    ],
    warning:
      "Hai chiến lược theo dõi khác nhau: BYT theo nồng độ đáy (10–20 mg/L); đồng thuận 2020 theo AUC24/MIC 400–600 và không còn khuyến cáo theo dõi chỉ bằng đáy 15–20 mg/L. Liều cố định 1 g mỗi 12 giờ có thể không đạt đích ở người bệnh nặng, cân nặng lớn hoặc tăng thanh thải thận. AUC cần TDM hoặc phần mềm Bayes; không ước tính AUC từ nồng độ đáy đơn lẻ trong ứng dụng.",
    decision: "Chọn chiến lược TDM vancomycin (đáy hay AUC), liều nạp và liều theo cân nặng cho BV199. " + DECIDE,
  },
  {
    id: "piptazo",
    topic: "Piperacilin-tazobactam – khoảng cách liều",
    diseaseIds: [...SEPSIS, "v8-4"],
    regimenIds: ["r-sepsis-a", "r-sepsis-neutro", "r-sepsis-b", "r-sepsis-b-mdr", "r-hap-early-alt"],
    byt: [
      { source: BYT708, locator: "Bảng II.11 (tr. 122) – chương Nhiễm khuẩn huyết", url: URL_708, dose: "4,5 g mỗi 8 giờ, truyền TM" },
      { source: BYT708, locator: "Bảng II.6 (tr. 95) – VPBV sớm, thay thế", url: URL_708, dose: "4,5 g mỗi 8 giờ TM" },
      { source: BYT708, locator: "Bảng II.10 (tr. 121), Bảng II.9 (tr. 106), Bảng II.6 VPBV muộn (tr. 96)", url: URL_708, dose: "4,5 g mỗi 6 giờ" },
    ],
    intl: [
      { source: ATS, locator: "Table 3, Table 4", url: URL_ATS, dose: "4,5 g TM mỗi 6 giờ; có thể truyền kéo dài" },
      { source: SSC, locator: "Beta-lactam antibiotics (Mạnh; trung bình)", url: URL_SSC, dose: "Truyền kéo dài beta-lactam khi duy trì, sau liều nạp ban đầu (không nêu liều cụ thể)" },
    ],
    warning: "Cùng văn bản QĐ 708 có hai khoảng cách liều (mỗi 8 giờ và mỗi 6 giờ). Không tự đổi.",
    decision: "Chọn khoảng cách liều và cách truyền (ngắt quãng hay kéo dài) cho sepsis và VPBV. " + DECIDE,
  },
  {
    id: "cefepim",
    topic: "Cefepim – liều và khoảng cách liều",
    diseaseIds: [...SEPSIS, "v8-4", "v8-5"],
    regimenIds: ["r-sepsis-a", "r-sepsis-c-biliary", "r-sepsis-c-gi", "r-hap-early-alt", "r-hap-late-mild", "r-hap-late-icu", "r-vap-mdr"],
    byt: [
      { source: BYT708, locator: "Bảng II.11 (tr. 122)", url: URL_708, dose: "1–2 g mỗi 12 giờ, tối đa 6 g/ngày; nhiễm khuẩn đe dọa tính mạng 2 g mỗi 8–12 giờ" },
      { source: BYT708, locator: "Bảng II.6 (tr. 95–97)", url: URL_708, dose: "VPBV sớm: 1–2 g mỗi 12 giờ; VPBV muộn: 1–2 g mỗi 8–12 giờ" },
      { source: BYT708, locator: "Bảng II.9 (tr. 105)", url: URL_708, dose: "1–2 g mỗi 8 giờ, tối đa 6 g/ngày; đe dọa tính mạng 2 g mỗi 8 giờ" },
    ],
    intl: [
      { source: ATS, locator: "Table 3, Table 4", url: URL_ATS, dose: "2 g TM mỗi 8 giờ; có thể truyền kéo dài" },
      { source: AMR, locator: "Table 1 – chỉ khi đã xác định/nghi Gram âm kháng thuốc", url: URL_AMR, dose: "nạp 2 g truyền 30 phút, sau đó 2 g mỗi 8 giờ truyền 3 giờ" },
    ],
    warning: "1 g mỗi 12 giờ thấp hơn đáng kể so với 2 g mỗi 8 giờ của nguồn quốc tế ở người bệnh nặng. IDSA AMR 2026 không phải phác đồ kinh nghiệm.",
    decision: "Chọn liều cefepim cho sepsis/VPBV/VPLQTM nặng. " + DECIDE,
  },
  {
    id: "carbapenem",
    topic: "Meropenem / imipenem – liều và thời gian truyền",
    diseaseIds: [...SEPSIS, "v8-4", "v8-5"],
    regimenIds: ["r-sepsis-neutro", "r-sepsis-b", "r-sepsis-b-mdr", "r-sepsis-c-biliary", "r-sepsis-c-gi", "r-hap-late-mild", "r-hap-late-icu", "r-vap-mdr"],
    byt: [
      { source: BYT708, locator: "Bảng II.11 (tr. 122)", url: URL_708, dose: "meropenem 1 g mỗi 8 giờ, tối đa 2 g mỗi 8 giờ; imipenem 0,5–1 g mỗi 6 giờ, tối đa 4 g/ngày, truyền 3–4 giờ" },
      { source: BYT708, locator: "Bảng II.6 VPBV muộn nhẹ–vừa (tr. 96)", url: URL_708, dose: "imipenem 500 mg mỗi 8 giờ; meropenem 500 mg mỗi 8 giờ" },
      { source: BYT708, locator: "Bảng II.9 (tr. 105)", url: URL_708, dose: "meropenem 0,5–1 g mỗi 8 giờ, tối đa 2 g mỗi 8 giờ; imipenem 0,5–1 g mỗi 6 giờ, truyền 3–4 giờ" },
    ],
    intl: [
      { source: ATS, locator: "Table 3, Table 4", url: URL_ATS, dose: "imipenem 500 mg TM mỗi 6 giờ (giảm liều khi < 70 kg để tránh co giật); meropenem 1 g TM mỗi 8 giờ; có thể truyền kéo dài" },
      { source: AMR, locator: "Table 1 – chỉ khi đã xác định/nghi Gram âm kháng thuốc", url: URL_AMR, dose: "meropenem 1–2 g mỗi 8 giờ truyền 3 giờ (nếu khả thi); imipenem 500 mg mỗi 6 giờ truyền 3 giờ hoặc 1 g mỗi 8 giờ truyền 1 giờ" },
    ],
    warning: "Meropenem 500 mg mỗi 8 giờ (Bảng II.6) bằng một nửa liều của ATS/IDSA. IDSA AMR 2026 không phải phác đồ kinh nghiệm.",
    decision: "Chọn liều carbapenem cho VPBV muộn và cách truyền (kéo dài hay không). " + DECIDE,
  },
  {
    id: "aminoglycoside-vap",
    topic: "Aminoglycosid trong VPLQTM",
    diseaseIds: ["v8-5"],
    regimenIds: ["r-vap-mdr"],
    byt: [
      { source: BYT708, locator: "Bảng II.9 (tr. 106)", url: URL_708, dose: "gentamycin/tobramycin 3–5 mg/kg x 1 lần/ngày (nặng tới 7 mg/kg), đáy < 1 µg/mL (= < 1 mg/L); amikacin 15–20 mg/kg x 1 lần/ngày (nặng tới 28 mg/kg/ngày)" },
    ],
    intl: [
      { source: ATS, locator: "Table 3 cột C, chú thích a, c", url: URL_ATS, dose: "gentamicin/tobramycin 5–7 mg/kg TM mỗi 24 giờ; amikacin 15–20 mg/kg TM mỗi 24 giờ; cần đo nồng độ. Phân tích gộp: phác đồ có aminoglycosid đáp ứng lâm sàng thấp hơn, không khác tử vong; khuyến cáo tránh aminoglycosid nếu có thuốc thay thế (Mục X)" },
    ],
    warning: "Liều khởi đầu gentamycin/tobramycin của BYT thấp hơn. Cần TDM.",
    decision: "Chọn liều aminoglycosid và vai trò trong Nhóm B. " + DECIDE,
  },
  {
    id: "colistin",
    topic: "Colistin – liều và đơn vị",
    diseaseIds: [...SEPSIS, "v8-5"],
    regimenIds: ["r-sepsis-b-mdr", "r-vap-colistin"],
    byt: [
      { source: DTQG, locator: "tr. in 514–518 (dẫn trong ứng dụng)", dose: "nạp không quá 9 MIU theo cân nặng; duy trì sau 12–24 giờ; tổng 24 giờ không quá 12 MIU, chia 2–3 lần, theo CrCl [đơn vị MIU]" },
      { source: BYT708, locator: "Bảng II.9 (tr. 106)", url: URL_708, dose: "không ghi số liều; bắt buộc liều nạp; không dùng đơn độc" },
    ],
    intl: [
      { source: ATS, locator: "Table 3 cột C, chú thích e", url: URL_ATS, dose: "5 mg/kg TM x 1 (nạp), sau đó 2,5 mg x (1,5 x CrCl + 30) TM mỗi 12 giờ [đơn vị mg CBA]; polymyxin B 2,5–3,0 mg/kg/ngày chia 2 lần" },
      { source: AMR, locator: "Table 1", url: URL_AMR, dose: "dẫn chiếu đồng thuận quốc tế về polymyxin (Tsuji BT, Pharmacotherapy 2019) – chưa trích" },
    ],
    warning: "Hai nguồn dùng hai đơn vị khác nhau (MIU và mg CBA). Nhầm đơn vị có thể gây quá liều hoặc thiếu liều. " + COLISTIN_UNIT_NOTE,
    decision: "Duyệt một bảng liều colistin thống nhất đơn vị theo sản phẩm có tại BV199. " + DECIDE,
  },
  {
    id: "duration-hap-vap",
    topic: "Thời gian điều trị VPBV/VPLQTM",
    diseaseIds: ["v8-4", "v8-5"],
    regimenIds: ["r-hap-early", "r-hap-early-alt", "r-hap-late-mild", "r-hap-late-icu", "r-vap-nomdr", "r-vap-mdr"],
    byt: [
      { source: BYT708, locator: "Bảng II.6 (tr. 95–97)", url: URL_708, dose: "VPBV: 10–14 ngày, có thể tới 21 ngày (P. aeruginosa, Acinetobacter, S. maltophilia, MRSA, triệu chứng kéo dài)" },
      { source: BYT708, locator: "VPLQTM mục 4.3 (tr. 103–104)", url: URL_708, dose: "ngắn (khoảng 7–10 ngày) với tụ cầu, H. influenzae; dài (ít nhất 14–21 ngày) khi tổn thương nhiều thùy, suy dinh dưỡng, tổn thương ổ/khoang, hoại tử Gram-âm, P. aeruginosa hoặc Acinetobacter" },
    ],
    intl: [
      { source: ATS, locator: "Mục XXI (VAP, Mạnh; trung bình), Mục XXII (HAP, Mạnh; rất thấp)", url: URL_ATS, dose: "7 ngày; có thể ngắn hoặc dài hơn tùy tốc độ cải thiện lâm sàng, X-quang và xét nghiệm" },
    ],
    warning: "Thời gian ngắn hơn chỉ áp dụng khi đáp ứng tốt; điều chỉnh theo đáp ứng, ổ nhiễm và tác nhân.",
    decision: "Chọn thời gian điều trị mặc định cho VPBV/VPLQTM. " + DECIDE,
  },
];

/* ================= Buoc 4D – Nhom 2 (v8-36, v8-104, v8-113, v8-116, v8-13) ================= */

const BYT5642 = "BYT – QĐ 5642/QĐ-BYT, Hướng dẫn chẩn đoán và điều trị một số bệnh truyền nhiễm (2015)";
const URL_5642 = "https://kcb.vn/upload/2005611/20210723//Truyen-nhiem-1.pdf";
const WHO25 = "WHO – Guidelines on meningitis diagnosis, treatment and care (2025)";
const WHO26 = "WHO – Practical manual on meningitis diagnosis, treatment and care (2026)";
const URL_WHO25 = "https://iris.who.int/handle/10665/381006";
const URL_WHO26 = "https://iris.who.int/handle/10665/386139";
const ECIL10 = "ECIL-10 – Febrile neutropenia recommendations (2025), Averbuch D, Lancet Infect Dis 2025";
const URL_ECIL = "https://ecil-leukaemia.com/images/ecil-10/ECIL_10_-_bacterial_group_final_recommendations.pdf";
const IPFN23 = "International Pediatric Fever and Neutropenia Guideline Panel – FN guideline (2023), Lehrnbecher T, J Clin Oncol 2023";
const URL_IPFN = "https://doi.org/10.1200/JCO.22.02224";
const SAB26 = "IDSA/ESCMID – Consensus Statements on S. aureus Bacteremia, Part 1 (2026)";
const URL_SAB = "https://www.idsociety.org/practice-guideline/staphylococcus-aureus-bacteremia/";

const MEN_ADULT_708 = ["r-men-18-50-first", "r-men-18-50-alt", "r-men-50-first", "r-men-50-alt", "r-men-immuno-first", "r-men-immuno-alt"];
const MEN_ADULT_5642 = ["r-vmn42-18to50-first", "r-vmn42-18to50-alt", "r-vmn42-over50-first", "r-vmn42-over50-alt", "r-vmn42-immuno-first", "r-vmn42-immuno-alt", "r-vmn42-trauma-first", "r-vmn42-trauma-alt"];
const MEN_CHILD = ["r-men-1-3m-first", "r-men-1-3m-alt", "r-men-3m-18y-first", "r-men-3m-18y-alt", "r-vmn42-1to3m-first", "r-vmn42-1to3m-alt", "r-vmn42-3m18y-first", "r-vmn42-3m18y-alt"];
const MEN_NEO = ["r-men-neo-first", "r-men-neo-alt", "r-vmn42-neo-first", "r-vmn42-neo-alt"];
const FN_MONO = ["r-fn-mono-caz", "r-fn-mono-cef", "r-fn-mono-pip", "r-fn-mono-imi", "r-fn-mono-mero"];
const FN = ["v8-113", "v8-116"];
const BSI_SA = ["r-bsi-mssa", "r-bsi-mssa-alt", "r-bsi-mrsa", "r-bsi-mrsa-alt"];

DOSE_CONFLICTS.push(
  {
    id: "dexamethasone-meningitis",
    topic: "Dexamethason bổ trợ trong viêm màng não (người lớn, trẻ > 1 tháng)",
    diseaseIds: ["v8-36", "v8-104"],
    regimenIds: ["r-men-18-50-first", "r-men-3m-18y-first", ...MEN_ADULT_5642, "r-vmn42-1to3m-first", "r-vmn42-1to3m-alt", "r-vmn42-3m18y-first", "r-vmn42-3m18y-alt"],
    byt: [
      { source: BYT708, locator: "Chương Viêm màng não mủ, mục 4.2, tr. 231", url: URL_708, dose: "0,6 mg/kg/ngày, tiêm 4 ngày, cùng hoặc trước kháng sinh 15 phút" },
      { source: BYT5642, locator: "Viêm màng não nhiễm khuẩn, mục 4.2a, tr. 19", url: URL_5642, dose: "0,4 mg/kg/ngày, tiêm TM chậm, 4 ngày, cùng hoặc trước kháng sinh 15 phút" },
    ],
    intl: [
      { source: WHO26, locator: "Mục 7.5.2, tr. in 33–34", url: URL_WHO26, dose: "người lớn 10 mg TM mỗi 6 giờ; trẻ em 0,15 mg/kg (tối đa 10 mg) TM mỗi 6 giờ; cùng liều kháng sinh đầu, không muộn hơn 12 giờ; tối đa 4 ngày; ngừng nếu tác nhân không phải S. pneumoniae/Hib" },
      { source: WHO25, locator: "Adjunctive corticosteroids (Mạnh; thấp), PDF tr. 22–23", url: URL_WHO25, dose: "ngừng nếu dịch não tủy không phù hợp viêm màng não vi khuẩn; không dùng khi HIV giai đoạn tiến triển; chưa dùng khi chưa loại trừ sốt rét thể não" },
    ],
    warning: "Hai văn bản BYT cùng hiệu lực ghi hai liều khác nhau (0,6 và 0,4 mg/kg/ngày). BYT không nêu khi nào ngừng sớm. Liều người lớn của WHO là liều cố định (40 mg/ngày).",
    decision: "Thống nhất liều dexamethason, thời điểm dùng và tiêu chí ngừng. " + DECIDE,
  },
  {
    id: "dexamethasone-neonate",
    topic: "Corticosteroid ở trẻ sơ sinh viêm màng não",
    diseaseIds: ["v8-104"],
    regimenIds: MEN_NEO,
    byt: [
      { source: BYT708, locator: "mục 4.2, tr. 231", url: URL_708, dose: "dexamethason 0,6 mg/kg/ngày x 4 ngày – ghi chung, không loại trừ trẻ sơ sinh" },
      { source: BYT5642, locator: "mục 4.2a, tr. 19", url: URL_5642, dose: "dexamethason 0,4 mg/kg/ngày x 4 ngày – ghi chung, không loại trừ trẻ sơ sinh" },
    ],
    intl: [
      { source: WHO26, locator: "Mục 7.5.2 – Special considerations for neonates, tr. in 33", url: URL_WHO26, dose: "KHÔNG khuyến cáo corticosteroid trong viêm màng não sơ sinh (thiếu bằng chứng lợi ích)" },
    ],
    warning: "Ghi chú dexamethason của BYT hiển thị ở cả phác đồ sơ sinh. WHO không khuyến cáo dùng cho trẻ sơ sinh.",
    decision: "Quyết định có dùng dexamethason cho trẻ sơ sinh hay không. " + DECIDE,
  },
  {
    id: "meningitis-adult-dose",
    topic: "Liều kháng sinh viêm màng não ở người lớn",
    diseaseIds: ["v8-36"],
    regimenIds: [...MEN_ADULT_708, ...MEN_ADULT_5642],
    byt: [
      { source: BYT708, locator: "Bảng II.20, tr. 231–232 – cột Người lớn (tổng liều/ngày, giờ/liều)", url: URL_708, dose: "ceftriaxon 4 g (12–24 giờ); cefotaxim 8–12 g (4–6 giờ); ampicilin 12 g (4 giờ); ceftazidim 6 g (8 giờ); vancomycin 30–45 mg/kg (8–12 giờ); meropenem 6 g (8 giờ)" },
      { source: BYT5642, locator: "Bảng liều tr. 19 – chỉ tính theo kg, không có cột người lớn", url: URL_5642, dose: "ceftriaxon 80–100 mg/kg/ngày chia mỗi 12 giờ; cefotaxim 100–200 mg/kg/ngày mỗi 8 giờ; ampicilin 150–300 mg/kg/ngày mỗi 6 giờ; ceftazidim 60–150 mg/kg/ngày mỗi 8 giờ; vancomycin 20–60 mg/kg/ngày mỗi 6 giờ" },
    ],
    intl: [
      { source: WHO26, locator: "Bảng 11, tr. in 35–36", url: URL_WHO26, dose: "ceftriaxon 2 g mỗi 12 giờ (tối đa 4 g/ngày); cefotaxim 2 g mỗi 4 giờ hoặc 3 g mỗi 6 giờ (tối đa 12 g/ngày); ampicilin/amoxicilin 2 g mỗi 4 giờ hoặc 3 g mỗi 6 giờ (tối đa 12 g/ngày); vancomycin 15–20 mg/kg mỗi 8–12 giờ (tối đa 4 g/ngày; không theo dõi nồng độ thì ≤ 3 g/ngày)" },
    ],
    warning: "Liều theo kg của QĐ 5642 khi áp dụng cho người lớn có thể vượt liều tối đa: ví dụ 70 kg – ceftriaxon 5,6–7 g/ngày (tối đa 4 g), ampicilin tới 21 g/ngày (tối đa 12 g). Liều người lớn của QĐ 708 gần với WHO. Ứng dụng không tự tính liều theo cân nặng.",
    decision: "Chọn bảng liều người lớn áp dụng tại BV199 (QĐ 708 hay QĐ 5642) và liều tối đa. " + DECIDE,
  },
  {
    id: "meningitis-child-dose",
    topic: "Liều kháng sinh viêm màng não ở trẻ > 1 tháng",
    diseaseIds: ["v8-104"],
    regimenIds: MEN_CHILD,
    byt: [
      { source: BYT708, locator: "Bảng II.20, tr. 231–232 – cột Trẻ em", url: URL_708, dose: "ceftriaxon 80–100 mg/kg/ngày (12–24 giờ); cefotaxim 225–300 mg/kg/ngày (6–8 giờ); ampicilin 300 mg/kg/ngày (6 giờ); vancomycin 60 mg/kg/ngày (6 giờ)" },
      { source: BYT5642, locator: "Bảng liều tr. 19", url: URL_5642, dose: "ceftriaxon 80–100 mg/kg/ngày mỗi 12 giờ; cefotaxim 100–200 mg/kg/ngày mỗi 8 giờ; ampicilin 150–300 mg/kg/ngày mỗi 6 giờ; vancomycin 20–60 mg/kg/ngày mỗi 6 giờ" },
    ],
    intl: [
      { source: WHO26, locator: "Bảng 11, tr. in 35–36", url: URL_WHO26, dose: "ceftriaxon 100 mg/kg/ngày, 1 lần hoặc chia mỗi 12 giờ (tối đa 2 g mỗi 12 giờ); cefotaxim 50 mg/kg mỗi 4 giờ hoặc 75 mg/kg mỗi 6 giờ (tối đa 12 g/ngày); ampicilin/amoxicilin 50 mg/kg mỗi 4 giờ hoặc 75 mg/kg mỗi 6 giờ (tối đa 12 g/ngày); vancomycin 15–20 mg/kg mỗi 6–8 giờ (không theo dõi nồng độ thì ≤ 750 mg/liều)" },
    ],
    warning: "Cefotaxim của QĐ 5642 (100–200 mg/kg/ngày) thấp hơn QĐ 708 và WHO (~300 mg/kg/ngày). QĐ 708 không có cột riêng cho trẻ 1–3 tháng; WHO dùng chung liều trẻ > 1 tháng.",
    decision: "Thống nhất liều trẻ em và liều tối đa theo liều người lớn. " + DECIDE,
  },
  {
    id: "meningitis-neonate-dose",
    topic: "Liều kháng sinh viêm màng não ở trẻ sơ sinh",
    diseaseIds: ["v8-104"],
    regimenIds: MEN_NEO,
    byt: [
      { source: BYT708, locator: "Bảng II.20, tr. 231–232 – cột sơ sinh 0–7 ngày / 8–28 ngày (tổng liều/ngày, giờ/liều)", url: URL_708, dose: "ampicilin 150 mg/kg (8) / 200 mg/kg (6–8); cefotaxim 100–150 mg/kg (8–12) / 150–200 mg/kg (6–8); gentamycin 5 mg/kg (12) / 7,5 mg/kg (8); amikacin 15–20 mg/kg (12) / 30 mg/kg (8); ceftriaxon: không ghi; meropenem: không khuyến cáo < 3 tháng" },
      { source: BYT5642, locator: "Bảng liều tr. 19 – \"liều thấp áp dụng ở trẻ dưới 7 ngày tuổi\"", url: URL_5642, dose: "ampicilin 150–300 mg/kg/ngày mỗi 6 giờ; cefotaxim 100–200 mg/kg/ngày mỗi 8 giờ; gentamicin 5 mg/kg/ngày mỗi 12 giờ; amikacin 20–30 mg/kg/ngày mỗi 12 giờ" },
    ],
    intl: [
      { source: WHO26, locator: "Hình 12 (tr. in 31), Bảng 11 (tr. in 35–36)", url: URL_WHO26, dose: "ampicilin 50 mg/kg mỗi 12 giờ (tuần đầu) / mỗi 8 giờ (1–4 tuần); cefotaxim 50 mg/kg mỗi 12 giờ / mỗi 6 giờ; ceftriaxon 100 mg/kg 1 lần/ngày; gentamicin 5 mg/kg 1 lần/ngày (tuần đầu) / 7,5 mg/kg 1 lần/ngày (sau tuần đầu); meropenem 40 mg/kg mỗi 8 giờ; thời gian 3 tuần" },
    ],
    warning: "Khoảng cách liều aminoglycosid khác nhau: BYT chia 2–3 lần/ngày, WHO 1 lần/ngày (cùng tổng liều với gentamicin). Ampicilin tuần đầu của BYT (150 mg/kg/ngày) cao hơn WHO (100 mg/kg/ngày). Meropenem: BYT không khuyến cáo < 3 tháng, WHO có liều sơ sinh. Trẻ non tháng/nhẹ cân < 2 kg: QĐ 708 khuyến cáo liều thấp hơn, khoảng cách dài hơn (chú thích a). Cần TDM aminoglycosid.",
    decision: "Thống nhất liều sơ sinh, khoảng cách liều aminoglycosid và chỉ định meropenem. " + DECIDE,
  },
  {
    id: "vancomycin-meningitis",
    topic: "Theo dõi nồng độ vancomycin trong viêm màng não",
    diseaseIds: ["v8-36", "v8-104"],
    regimenIds: ["r-men-18-50-alt", "r-men-immuno-alt", "r-men-1-3m-alt", "r-men-3m-18y-alt", "r-vmn42-18to50-alt", "r-vmn42-immuno-alt", "r-vmn42-trauma-first", "r-vmn42-1to3m-alt", "r-vmn42-3m18y-alt"],
    byt: [
      { source: BYT708, locator: "Bảng II.20, chú thích f, tr. 232", url: URL_708, dose: "\"Nồng độ duy trì thấp nhất trong máu là 15-20 mg/ml (nếu có điều kiện)\" – nguyên văn; đơn vị mg/ml nghi lỗi in, KHÔNG quy đổi" },
    ],
    intl: [
      { source: WHO26, locator: "Bảng 11, chú thích c, d, tr. in 36–37", url: URL_WHO26, dose: "theo dõi nồng độ đáy, đích 15–20 mg/L (bản gốc ghi 15–20 mcg/mL, cùng giá trị); không theo dõi được thì ≤ 750 mg/liều (trẻ em), ≤ 3 g/ngày (người lớn)" },
    ],
    warning: "Viêm màng não dùng nồng độ đáy theo WHO; đích AUC24/MIC 400–600 của đồng thuận vancomycin 2020 (nhiễm MRSA nặng) không áp dụng mặc định cho viêm màng não trong ứng dụng.",
    decision: "Chọn đích TDM vancomycin cho viêm màng não. " + DECIDE,
  },
  {
    id: "meningitis-listeria-duration",
    topic: "Viêm màng não – tuổi nguy cơ Listeria, chọc dò lại và thời gian điều trị",
    diseaseIds: ["v8-36", "v8-104"],
    regimenIds: ["r-men-18-50-first", "r-men-50-first", "r-men-50-alt", "r-vmn42-18to50-first", "r-vmn42-over50-first", "r-vmn42-over50-alt", "r-men-3m-18y-first", "r-vmn42-3m18y-first"],
    byt: [
      { source: BYT708, locator: "Bảng II.19 (tr. 231), mục 4.3–4.4 (tr. 232–233)", url: URL_708, dose: "ampicilin khi nghi Listeria ở người > 50 tuổi, suy giảm miễn dịch; chọc dò lại sau 48 giờ nếu không cải thiện; thời gian: não mô cầu 7 ngày, Hib 10, phế cầu 14, trực khuẩn/kỵ khí Gram âm/liên cầu/tụ cầu 3 tuần, hoặc trung bình 10–14 ngày và hết sốt 3 ngày" },
      { source: BYT5642, locator: "tr. 19–20", url: URL_5642, dose: "như QĐ 708" },
    ],
    intl: [
      { source: WHO25, locator: "PDF tr. 18–20", url: URL_WHO25, dose: "thêm ampicilin/amoxicilin khi tuổi > 60, có thai hoặc suy giảm miễn dịch (kể cả đái tháo đường, bệnh thận giai đoạn cuối, xơ gan, rối loạn sử dụng rượu); không rõ tác nhân: ngừng sau 7 ngày nếu hồi phục lâm sàng ≥ 48 giờ; không hồi phục sau 1 tuần thì chọc dò lại" },
      { source: WHO26, locator: "Bảng 10, tr. in 34–35", url: URL_WHO26, dose: "S. pneumoniae 10–14 ngày; N. meningitidis 5–7; H. influenzae 7–10; S. agalactiae 14–21; Listeria 21; Gram âm 14–21; sơ sinh 3 tuần" },
    ],
    warning: "Ngưỡng tuổi Listeria khác nhau (> 50 và > 60). WHO liệt kê thêm các cơ địa suy giảm miễn dịch. Thời gian khi không rõ tác nhân: BYT 10–14 ngày, WHO 7 ngày nếu đã hồi phục.",
    decision: "Chọn ngưỡng tuổi bao phủ Listeria và thời gian điều trị khi không rõ tác nhân. " + DECIDE,
  },
  {
    id: "fn-colistin",
    topic: "Colistin trong sốt giảm bạch cầu – liều và đơn vị",
    diseaseIds: FN,
    regimenIds: ["r-fn-add-colistin"],
    byt: [
      { source: BYT708, locator: "Chương Suy giảm miễn dịch, mục 5b, tr. 254", url: URL_708, dose: "6.000.000 đơn vị (≈ 200 mg colistin base) mỗi 8 giờ [đơn vị MIU – tổng 18 MIU/ngày]" },
      { source: DTQG, locator: "tr. in 514–518 (dẫn trong ứng dụng)", dose: "nạp không quá 9 MIU; tổng 24 giờ không quá 12 MIU, chia 2–3 lần, theo CrCl [đơn vị MIU]" },
    ],
    intl: [
      { source: ATS, locator: "Table 3 cột C, chú thích e", url: URL_ATS, dose: "5 mg/kg x 1 (nạp), sau đó 2,5 mg x (1,5 x CrCl + 30) mỗi 12 giờ [đơn vị mg CBA] – nguồn cho VAP, dùng để đối chiếu đơn vị" },
      { source: ECIL10, locator: "Slide 10, 12", url: URL_ECIL, dose: "không ghi liều; ECIL-10 bỏ phương án colistin + beta-lactam ± rifampicin của ECIL-4 khỏi danh sách khởi đầu" },
    ],
    warning: "Tổng liều/ngày theo QĐ 708 (18 MIU) vượt mức tối đa 12 MIU/ngày của Dược thư đang hiển thị trong ứng dụng; QĐ 708 không ghi liều nạp và chỉnh liều theo thận. " + COLISTIN_UNIT_NOTE,
    decision: "Duyệt liều colistin cho sốt giảm bạch cầu (tổng liều/ngày, liều nạp, chỉnh theo CrCl, đơn vị theo sản phẩm). " + DECIDE,
  },
  {
    id: "fn-empiric",
    topic: "Sốt giảm bạch cầu – lựa chọn kháng sinh kinh nghiệm và phối hợp",
    diseaseIds: FN,
    regimenIds: [...FN_MONO, "r-fn-add-aminoglyc", "r-fn-add-fq", "r-fn-add-gp"],
    byt: [
      { source: BYT708, locator: "mục 5b, tr. 254 (văn bản ghi \"theo khuyến cáo của IDSA\" – IDSA 2010, nay ARCHIVED)", url: URL_708, dose: "khởi đầu một trong: ceftazidim 2 g mỗi 8 giờ; cefepim 2 g mỗi 8 giờ; piperacilin-tazobactam 4,5 g mỗi 6 giờ; imipenem-cilastatin 500 mg mỗi 6 giờ hoặc 1 g mỗi 8 giờ; meropenem 1 g mỗi 8 giờ; có thể kết hợp aminoglycosid, fluoroquinolon, vancomycin 1 g mỗi 12 giờ, teicoplanin 400 mg mỗi 12 giờ" },
    ],
    intl: [
      { source: ECIL10, locator: "Slide 9–12, 14", url: URL_ECIL, dose: "chọn theo nguy cơ: leo thang (cefepim/ceftazidim – tránh nếu tỷ lệ ESBL cao; piperacilin-tazobactam) hoặc xuống thang (carbapenem; beta-lactam + aminoglycosid; thuốc nhắm tác nhân cư trú); aminoglycosid chỉ khi bệnh nặng hoặc nghi Gram âm kháng; không phối hợp quinolon trong danh sách ECIL-10; không thường quy glycopeptid (D-IIru)" },
      { source: IPFN23, locator: "A6a, A6b", url: URL_IPFN, dose: "trẻ em nguy cơ cao: đơn trị; thuốc Gram âm thứ hai hoặc glycopeptid chỉ khi không ổn định, nghi kháng thuốc hoặc trung tâm tỷ lệ kháng cao" },
    ],
    warning: "QĐ 708 cho phối hợp thêm thuốc mà không nêu điều kiện; ECIL-10 và IPFN 2023 chỉ phối hợp khi có chỉ định cụ thể. Ceftazidim đầu tay cần đối chiếu tỷ lệ ESBL tại BV199 (kháng sinh đồ).",
    decision: "Chọn chiến lược leo thang/xuống thang theo kháng sinh đồ BV199 và điều kiện phối hợp. " + DECIDE,
  },
  {
    id: "fn-risk-duration",
    topic: "Sốt giảm bạch cầu – phân tầng nguy cơ, đánh giá lại, thời gian, kháng nấm",
    diseaseIds: FN,
    regimenIds: FN_MONO,
    byt: [
      { source: BYT708, locator: "mục 3 (tr. 253), mục 5c (tr. 254)", url: URL_708, dose: "nguy cơ cao: ANC < 500/µl > 7 ngày, có bệnh kèm, rối loạn chức năng gan thận hoặc MASCC < 21; thời gian: có ổ nhiễm – theo tác nhân, tiếp tục đến ANC > 500/µl; không rõ ổ – đến khi hết sốt ≥ 48 giờ và ANC > 500/µl, hoặc chuyển uống dự phòng fluoroquinolon; chương này không nêu kháng nấm" },
    ],
    intl: [
      { source: ECIL10, locator: "Slide 15, 21", url: URL_ECIL, dose: "đánh giá lại tại 72–96 giờ; sốt không rõ nguồn: ngừng sau ≥ 72 giờ nếu ổn định và hết sốt ≥ 48 giờ, bất kể ANC (nguy cơ cao > 10 ngày giảm sâu: B-I; trung bình 7–10 ngày: A-I); còn sốt: cân nhắc nấm" },
      { source: IPFN23, locator: "B4, B5, C4–C6", url: URL_IPFN, dose: "trẻ em: ngừng khi hết sốt ≥ 24 giờ, cấy 48 giờ âm tính và hồi phục tủy; nguy cơ thấp có thể ngừng dù chưa hồi phục tủy; nguy cơ cao nấm, sốt ≥ 96 giờ: caspofungin hoặc amphotericin B liposome (hoặc chiến lược pre-emptive)" },
    ],
    warning: "BYT chờ ANC > 500/µl; ECIL-10 cho ngừng bất kể ANC khi đủ điều kiện. Cách phân tầng nguy cơ khác nhau (ANC > 7 ngày/MASCC so với thời gian giảm bạch cầu dự kiến > 10 ngày).",
    decision: "Chọn thang phân tầng nguy cơ, tiêu chí ngừng kháng sinh và thời điểm cân nhắc kháng nấm. " + DECIDE,
  },
  {
    id: "sab-management",
    topic: "Nhiễm khuẩn huyết S. aureus – cấy máu kiểm tra, siêu âm tim, phân tầng, thời gian",
    diseaseIds: ["v8-13"],
    regimenIds: BSI_SA,
    byt: [
      { source: BYT708, locator: "Bảng II.10 (tr. 121–122)", url: URL_708, dose: "chỉ nêu thuốc và liều (oxacilin 100–200 mg/kg/ngày chia mỗi 6 giờ; vancomycin 1 g mỗi 12 giờ; daptomycin 4–6 mg/kg/ngày); không nêu cấy máu kiểm tra, siêu âm tim, phân loại biến chứng, thời gian điều trị" },
    ],
    intl: [
      { source: SAB26, locator: "Consensus Statement 1–7", url: URL_SAB, dose: "phân tầng nguy cơ (khởi phát cộng đồng, cấy dương tính ≥ 48 giờ, dụng cụ trong tim); cấy máu kiểm tra ≥ 2 bộ tại 48 giờ, lặp lại đến khi âm tính; TTE cho mọi người lớn; TEE khi có yếu tố nguy cơ viêm nội tâm mạc; 14 ngày tính từ ngày cấy máu sạch khuẩn khi không có ổ nhiễm sâu/di bệnh" },
      { source: SAB26, locator: "Scope – Executive Summary", url: URL_SAB, dose: "lựa chọn thuốc MSSA/MRSA sẽ ở bản sau – chưa công bố (không có nguồn quốc tế hiện hành để đối chiếu vancomycin cho MSSA)" },
    ],
    warning: "Thiếu các bước đánh giá có thể bỏ sót viêm nội tâm mạc, ổ di bệnh và rút ngắn điều trị không phù hợp. Vancomycin là thuốc thay thế cho MSSA trong Bảng II.10; chưa có nguồn quốc tế hiện hành đã trích để đối chiếu. Daptomycin: xem cảnh báo riêng.",
    decision: "Bổ sung quy trình cấy máu kiểm tra, siêu âm tim, thời gian điều trị và lựa chọn thuốc MSSA cho BV199. " + DECIDE,
  },
);

/* ================= Buoc 4D – Nhom 3 (v8-39, v8-2, v8-17, v8-33, v9-1) ================= */

const ESC23 = "ESC – 2023 ESC Guidelines for the management of endocarditis (2023), Delgado V, Eur Heart J 2023;44:3948–4042";
const URL_ESC = "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/endocarditis/";
const EAU26 = "EAU – Guidelines on Urological Infections, Limited Update (2026)";
const URL_EAU = "https://uroweb.org/guidelines/urological-infections";
const CUTI25 = "IDSA – Complicated Urinary Tract Infections Guideline (2025)";
const URL_CUTI = "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/";
const PIDS23 = "PIDS/IDSA – Acute Bacterial Arthritis in Pediatrics (2023), Woods CR, J Pediatric Infect Dis Soc 2024";
const URL_PIDS = "https://www.idsociety.org/practice-guideline/acute-bacterial-arthritis-in-pediatrics2/";

const IE_ALL = ["r-ie-native-1", "r-ie-native-2", "r-ie-native-peds", "r-ie-prosth-early", "r-ie-prosth-early-peds", "r-ie-prosth-late"];
const PY_IV = ["r-py-iv-bl", "r-py-iv-ceph", "r-py-iv-carba", "r-py-iv-fq", "r-py-aminoglyc"];
const PY_ORAL = ["r-py-oral-bl", "r-py-oral-fq"];

DOSE_CONFLICTS.push(
  {
    id: "ie-empiric",
    topic: "Viêm nội tâm mạc – phác đồ kinh nghiệm và cách dùng gentamicin",
    diseaseIds: ["v8-39"],
    regimenIds: IE_ALL,
    byt: [
      { source: BYT708, locator: "Viêm nội tâm mạc nhiễm khuẩn, mục 4.2a (tr. 129)", url: URL_708, dose: "van tự nhiên: ampicilin-sulbactam 12 g/24 giờ chia 4 lần + gentamycin 3 mg/kg/24 giờ chia 3 lần (5–14 ngày); dị ứng penicilin: vancomycin 30 mg/kg/24 giờ chia 2 lần + gentamycin + ciprofloxacin 1000 mg/24 giờ uống hoặc 800 mg/24 giờ TM" },
      { source: BYT708, locator: "mục 4.2b (tr. 129–130)", url: URL_708, dose: "van nhân tạo < 1 năm: vancomycin 30 mg/kg/24 giờ + gentamycin 3 mg/kg/24 giờ chia 3 lần (2 tuần) + cefepim 6 g/24 giờ chia 3 lần + rifampin 900 mg/24 giờ chia 3 lần; trẻ em: cefepim 150 mg/kg/24 giờ, rifampin 20 mg/kg/24 giờ" },
    ],
    intl: [
      { source: ESC23, locator: "Bảng khuyến cáo 10, tr. 3985 (IIa, C)", url: URL_ESC, dose: "van tự nhiên cộng đồng/van nhân tạo muộn: ampicilin 12 g/ngày + ceftriaxon 4 g/ngày, hoặc ampicilin + (flu)cloxacilin 12 g/ngày + gentamicin 3 mg/kg/ngày 1 lần (trẻ em: ampicilin 200–300 mg/kg/ngày tối đa 12 g, ceftriaxon 100 mg/kg, gentamicin chia 3 lần)" },
      { source: ESC23, locator: "Bảng khuyến cáo 10 (IIb, C)", url: URL_ESC, dose: "van nhân tạo sớm/liên quan chăm sóc y tế: vancomycin 30 mg/kg/ngày chia 2 lần hoặc daptomycin 10 mg/kg/ngày + gentamicin 3 mg/kg/ngày 1 lần + rifampin 900–1200 mg chia 2–3 lần; dị ứng beta-lactam: cefazolin 6 g/ngày chia 3 lần hoặc vancomycin + gentamicin" },
    ],
    warning: "Phác đồ BYT (2015) khác ESC 2023 về thuốc (ampicilin-sulbactam, ciprofloxacin, cefepim không có trong ESC 2023) và về số lần dùng gentamicin ở người lớn (BYT chia 3 lần, ESC 1 lần/ngày). Gentamicin và vancomycin cần theo dõi chức năng thận và nồng độ thuốc. ESC xếp các phác đồ kinh nghiệm IIa–IIb, mức bằng chứng C; chuyển sang điều trị theo tác nhân trong 24–48 giờ.",
    decision: "Chọn phác đồ kinh nghiệm viêm nội tâm mạc (van tự nhiên, van nhân tạo sớm, dị ứng) và cách dùng gentamicin. " + DECIDE,
  },
  {
    id: "stone-cuti",
    topic: "NKTN phức tạp / sỏi có biến chứng nhiễm khuẩn – lựa chọn và liều kinh nghiệm",
    diseaseIds: ["v8-2"],
    regimenIds: ["r-stone-complic-bl", "r-stone-complic-fq"],
    byt: [
      { source: BYT708, locator: "Sỏi thận tiết niệu nhiễm trùng, mục 3.2b (tr. 242–243)", url: URL_708, dose: "amoxicilin/ampicilin 1 g x 4 lần/ngày TM; cefuroxim 250 mg x 2 lần/ngày uống hoặc tiêm; cefotaxim 1 g x 3 lần/ngày; ceftriaxon 1 g/ngày; 10–14 ngày. Hoặc fluoroquinolon uống (ciprofloxacin 250–500 mg x 2, norfloxacin 400 mg x 2, ofloxacin 200 mg x 2) 3–7 ngày, có thể tới 10 ngày" },
    ],
    intl: [
      { source: EAU26, locator: "Mục 3.7.3.a.2 và 3.7.4, PDF tr. 30–32", url: URL_EAU, dose: "kinh nghiệm tĩnh mạch: amoxicilin + aminoglycosid; cephalosporin thế hệ 2 + aminoglycosid; hoặc cephalosporin thế hệ 3. Nặng hoặc nghi tắc nghẽn: xử trí tắc nghẽn + carbapenem (imipenem 500 mg mỗi 6 giờ, meropenem 1 g mỗi 8 giờ). Ciprofloxacin chỉ khi kháng < 10% và có chống chỉ định thuốc khác; không dùng fluoroquinolon cho người bệnh khoa tiết niệu hoặc đã dùng trong 6 tháng" },
      { source: CUTI25, locator: "Bảng 1.1, 2.1, 1.2", url: URL_CUTI, dose: "có/không sepsis: cephalosporin thế hệ 3–4, piperacillin-tazobactam, fluoroquinolon (carbapenem khi sepsis); liều thử nghiệm: ceftriaxon 1–2 g/ngày, cefotaxim 1–2 g mỗi 8 giờ; uống: ciprofloxacin 500–750 mg mỗi 12 giờ, cefuroxim 500 mg mỗi 12 giờ, TMP-SMX 800/160 mg mỗi 12 giờ" },
    ],
    warning: "Tắc nghẽn đường tiết niệu kèm nhiễm khuẩn cần giải áp – kháng sinh đơn thuần có thể không đủ. Norfloxacin, ofloxacin, amoxicilin đơn trị không thuộc lựa chọn kinh nghiệm của EAU 2026/IDSA 2025. Phác đồ ESBL của IDSA AMR 2026 là điều trị theo tác nhân, không dùng làm kinh nghiệm.",
    decision: "Thống nhất phác đồ kinh nghiệm NKTN phức tạp/sỏi nhiễm khuẩn, điều kiện dùng fluoroquinolon và phạm vi áp dụng của phác đồ sỏi nhiễm khuẩn cho hội chứng NKTN phức tạp (ESBL đã tách sang mặt bệnh Enterobacterales sinh ESBL). " + DECIDE,
  },
  {
    id: "pyelo-iv",
    topic: "Viêm thận bể thận – liều đường tiêm, aminoglycosid, carbapenem",
    diseaseIds: ["v8-17"],
    regimenIds: PY_IV,
    byt: [
      { source: BYT708, locator: "Viêm thận bể thận cấp, mục 4.2b (tr. 236–237)", url: URL_708, dose: "ceftriaxon 1–2 g/ngày; cefotaxim 1 g x 3 lần/ngày; cefuroxim 750 mg x 3; amoxicilin-clavulanat 875/125 mg x 2 lần/ngày TM; imipenem-cilastatin 250–500 mg x 4–3 lần/ngày; meropenem 500 mg x 3 lần/ngày; ertapenem 1 g/ngày; ciprofloxacin 200–400 mg x 2; levofloxacin 250–750 mg/ngày; kết hợp gentamycin/tobramicin 3–5 mg/kg/24 giờ hoặc amikacin 15 mg/kg/24 giờ" },
    ],
    intl: [
      { source: EAU26, locator: "Bảng 6, PDF tr. 28–29", url: URL_EAU, dose: "ceftriaxon 2 g x 1 (liều cao 2 g x 2); cefotaxim 2 g x 3; ciprofloxacin 400 mg x 2; cefepim 1 g x 3 hoặc 2 g x 2 (liều cao 2 g x 3); piperacillin-tazobactam 4,5 g x 3 (liều cao x 4, truyền kéo dài); gentamicin 6–7 mg/kg x 1; amikacin 25–30 mg/kg x 1; lựa chọn cuối khi đa kháng: imipenem 0,5 g x 4 (liều cao 1 g x 4), meropenem 1 g x 3" },
      { source: CUTI25, locator: "Bảng 2.1 – liều dùng trong thử nghiệm lâm sàng", url: URL_CUTI, dose: "ceftriaxon 1–2 g/ngày; cefotaxim 1–2 g mỗi 8 giờ; ertapenem 1 g/ngày; imipenem 500 mg mỗi 6 giờ hoặc 1 g mỗi 8 giờ; meropenem 1 g mỗi 8 giờ; piperacillin-tazobactam 4,5 g mỗi 8 giờ" },
    ],
    warning: "Liều carbapenem, cephalosporin và aminoglycosid của QĐ 708 thấp hơn EAU 2026. Amoxicilin-clavulanat 875/125 mg là hàm lượng dạng uống nhưng văn bản ghi tiêm TM – đối chiếu dạng bào chế có tại BV199. EAU dành carbapenem cho trường hợp có vi khuẩn đa kháng.",
    decision: "Chọn liều tiêm viêm thận bể thận (ceftriaxon, carbapenem, aminoglycosid) và dạng amoxicilin-clavulanat tiêm. " + DECIDE,
  },
  {
    id: "pyelo-oral-duration",
    topic: "Viêm thận bể thận – thuốc uống và thời gian điều trị",
    diseaseIds: ["v8-17"],
    regimenIds: [...PY_ORAL, "r-py-iv-bl", "r-py-iv-ceph"],
    byt: [
      { source: BYT708, locator: "mục 4.2a–4.2b (tr. 236–237)", url: URL_708, dose: "uống 7–14 ngày: amoxicilin 500 mg x 3, amoxicilin-clavulanat 500/62,5 mg x 3, cefuroxim 250 mg x 2 viên/ngày, TMP-SMX 80/400 mg x 4 viên chia 2 lần, ciprofloxacin 250–500 mg x 2; tiêm 10–14 ngày, \"kháng sinh duy trì 3 tuần kể cả khi lâm sàng cải thiện nhanh\"" },
    ],
    intl: [
      { source: EAU26, locator: "Bảng 5 và mục 3.6.3.c, PDF tr. 28; mục 3.7.3.a.4, tr. 31", url: URL_EAU, dose: "uống: ciprofloxacin 500–750 mg x 2 (7 ngày), levofloxacin 500 mg x 1–2 (5 ngày), TMP-SMX 160/800 mg x 2 (14 ngày), cefpodoxim 200 mg x 2 (10 ngày), ceftibuten 400 mg x 1 (10 ngày); không dùng nitrofurantoin, fosfomycin uống, pivmecillinam; beta-lactam 7–10 ngày, fluoroquinolon 5–7 ngày; nam giới ≥ 2 tuần" },
      { source: CUTI25, locator: "Bảng 1.2; CQ 3", url: URL_CUTI, dose: "ciprofloxacin 500–750 mg mỗi 12 giờ; levofloxacin 500–750 mg/ngày; TMP-SMX 800/160 mg mỗi 12 giờ; cefuroxim 500 mg mỗi 12 giờ; beta-lactam uống (amoxicilin-clavulanat, cefalexin) cho kết quả kém hơn; thời gian 5–7 ngày fluoroquinolon hoặc 7 ngày thuốc khác" },
    ],
    warning: "Amoxicilin và amoxicilin-clavulanat uống không thuộc lựa chọn kinh nghiệm của EAU 2026; IDSA 2025 ghi kết quả kém hơn. Cefuroxim 250 mg x 2 thấp hơn 500 mg x 2 của IDSA. Thời gian BYT (tới 3 tuần) dài hơn nguồn quốc tế.",
    decision: "Chọn thuốc uống kinh nghiệm và thời gian điều trị viêm thận bể thận. " + DECIDE,
  },
  {
    id: "septic-arthritis",
    topic: "Viêm khớp nhiễm khuẩn – kinh nghiệm ở trẻ nhỏ, MRSA và thời gian",
    diseaseIds: ["v8-33"],
    regimenIds: ["r-sa-empiric-1", "r-sa-empiric-2", "r-sa-mrsa", "r-sa-mssa", "r-sa-strep", "r-sa-hflu", "r-sa-gramneg"],
    byt: [
      { source: BYT708, locator: "Viêm khớp nhiễm khuẩn, mục 4.2.1a (tr. 164)", url: URL_708, dose: "kinh nghiệm: oxacilin/nafcilin 2 g TM mỗi 6 giờ hoặc clindamycin 2,4 g/ngày chia 4 lần; MRSA: vancomycin 2 g/ngày chia 2 lần, daptomycin 4–6 mg/kg/ngày, teicoplanin 6 mg/kg/ngày những ngày đầu rồi 3 mg/kg; thời gian 2 tuần (liên cầu, H. influenzae), 3–4 tuần (Gram âm), 4 tuần (MRSA). Văn bản không tách người lớn/trẻ em" },
    ],
    intl: [
      { source: PIDS23, locator: "Mục V, IX, XII – CHỈ TRẺ EM", url: URL_PIDS, dose: "kinh nghiệm nhắm S. aureus (± MRSA theo dữ liệu tại chỗ); trẻ 6–48 tháng: bao phủ K. kingae (không nhạy penicilin kháng tụ cầu, kháng vancomycin, thường kháng clindamycin); MRSA nhạy: clindamycin hoặc ceftarolin ưu tiên hơn vancomycin (đích AUC/MIC 400); không kèm viêm xương, đáp ứng nhanh: 10–14 ngày; bảng liều chưa trích" },
    ],
    warning: "Ở trẻ 6–48 tháng, phác đồ kinh nghiệm oxacilin hoặc clindamycin của BYT không bao phủ K. kingae. Vancomycin 2 g/ngày là liều cố định không theo cân nặng – cần TDM. Người lớn: chưa có hướng dẫn quốc tế hiện hành đã xác minh để đối chiếu liều teicoplanin, daptomycin.",
    decision: "Phác đồ kinh nghiệm viêm khớp nhiễm khuẩn ở trẻ em (bao phủ K. kingae), liều theo cân nặng, liều teicoplanin/daptomycin ở người lớn. " + DECIDE,
  },
);

export function doseConflictNotes(regimenId: string): string[] {
  const fmt = (r: DoseRef) => `${r.dose} (${r.source}; ${r.locator})`;
  return DOSE_CONFLICTS.filter((c) => c.regimenIds.includes(regimenId)).map(
    (c) =>
      `ĐỐI CHIẾU LIỀU – ${c.topic}. Theo BYT: ${c.byt.map(fmt).join(" | ")}. Theo quốc tế: ${c.intl.map(fmt).join(" | ")}. Cảnh báo: ${c.warning} Cần phê duyệt: ${c.decision}`
  );
}
