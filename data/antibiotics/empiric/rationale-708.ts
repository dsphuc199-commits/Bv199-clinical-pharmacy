/*
  FILE: data/antibiotics/empiric/rationale-708.ts

  Tang 3 – tieu chi "Vì sao chọn phác đồ này?" cho cac mat benh lay phac do tu QĐ 708/QĐ-BYT (2015).
  Moi y doi chieu nguyen van van ban (so trang in). Khong them thuoc/lieu: phan "Ảnh hưởng đến
  lựa chọn" chi nhac lai nhom thuoc da co trong nguon. Khoa cua `branches` = chuoi scenario chinh xac
  trong data/antibiotics/empiric/regimens; nhanh khong khop se roi ve ban "Cần thẩm định".
*/

import type { ClinicalCriterion } from "./rationale";

export type DiseaseRationale = {
  /** Tieu chi chung cua mat benh, hien sau tieu chi rieng cua nhanh. */
  common?: ClinicalCriterion[];
  reassessment?: string[];
  branches: Record<string, ClinicalCriterion[]>;
};

const Q = (loc: string) => `QĐ 708/QĐ-BYT (2015) – ${loc}`;

/* ---------- Nhiem khuan huyet va soc nhiem khuan (Chuong 2, tr. 117–123) ---------- */
const NKH = (loc: string) => Q(`Nhiễm khuẩn huyết và sốc nhiễm khuẩn, ${loc}`);

const SEPSIS: DiseaseRationale = {
  common: [
    { condition: "Nghĩ đến nhiễm khuẩn huyết hoặc sốc nhiễm khuẩn.",
      clinicalMeaning: "Tỉ lệ tử vong rất cao (20–50%); sốc nhiễm khuẩn là biểu hiện nặng.",
      treatmentImplication: "Dùng kháng sinh ngay trong giờ đầu sau khi cấy máu; phổ rộng theo chiến lược xuống thang, ưu tiên đường tĩnh mạch.",
      sources: [NKH("mục 1, 4.1.1; tr. 117, 119")] },
  ],
  reassessment: [
    "Có kết quả cấy và kháng sinh đồ: chuyển sang kháng sinh phổ hẹp nhạy cảm với vi khuẩn gây bệnh.",
    "Xử trí ổ nhiễm khuẩn khởi điểm (dẫn lưu, rút dụng cụ là đường vào) song song với kháng sinh.",
  ],
  branches: {
    "Chưa rõ ổ nhiễm khuẩn, không nguy cơ nhiễm khuẩn bệnh viện, miễn dịch bình thường": [
      { condition: "Chưa xác định ổ nhiễm khuẩn; không có yếu tố nguy cơ nhiễm khuẩn bệnh viện; đáp ứng miễn dịch bình thường.",
        clinicalMeaning: "Tác nhân thường gặp gồm Gram âm đường ruột (E. coli, Klebsiella…), P. aeruginosa, B. pseudomallei, S. pneumoniae, S. aureus, S. suis.",
        treatmentImplication: "Piperacilin-tazobactam hoặc cephalosporin thế hệ 3–4, phối hợp quinolon hoặc aminoglycosid; chọn theo dữ liệu vi khuẩn và nhạy cảm của từng đơn vị.",
        sources: [NKH("mục 2, 4.1.2a; tr. 117, 119")] },
    ],
    "Nghi tác nhân S. aureus nhạy methicilin (MSSA)": [
      { condition: "Lâm sàng gợi ý tụ cầu vàng, nghi nhạy methicilin.",
        clinicalMeaning: "S. aureus là một trong các vi khuẩn Gram dương thường gây nhiễm khuẩn huyết.",
        treatmentImplication: "Cân nhắc kháng sinh chống tụ cầu: oxacilin, cloxacilin hoặc cefazolin.",
        sources: [NKH("mục 2, 4.1.2a; tr. 117, 119")] },
    ],
    "Nghi tác nhân S. aureus kháng methicilin (MRSA)": [
      { condition: "Lâm sàng gợi ý tụ cầu vàng, nghi kháng methicilin.",
        clinicalMeaning: "Beta-lactam chống tụ cầu không còn hiệu lực với MRSA.",
        treatmentImplication: "Cân nhắc vancomycin, teicoplanin hoặc daptomycin.",
        sources: [NKH("mục 4.1.2a; tr. 119")] },
    ],
    "Nghi vi khuẩn kỵ khí": [
      { condition: "Nghi tác nhân kỵ khí.",
        clinicalMeaning: "Vi khuẩn kỵ khí thường gặp: Clostridium perfringens, Bacteroides fragilis.",
        treatmentImplication: "Cân nhắc thêm metronidazol.",
        sources: [NKH("mục 2, 4.1.2a; tr. 117, 119")] },
    ],
    "Giảm bạch cầu hạt (< 0,5 x 10^9/L hoặc dự đoán giảm), suy giảm miễn dịch": [
      { condition: "Bạch cầu hạt < 0,5 × 10⁹/L, hoặc dự đoán giảm < 0,5 × 10⁹/L khi đang < 1 × 10⁹/L; suy giảm miễn dịch.",
        clinicalMeaning: "Nhóm có nguy cơ nhiễm khuẩn nặng; cần phổ rộng đường tĩnh mạch.",
        treatmentImplication: "Carbapenem hoặc piperacilin-tazobactam, phối hợp quinolon hoặc aminoglycosid.",
        sources: [NKH("mục 4.1.2a; tr. 119")] },
      { condition: "Vẫn sốt kéo dài tới 96 giờ khi đã dùng phác đồ kinh nghiệm ban đầu.",
        clinicalMeaning: "Gợi ý nhiễm khuẩn bệnh viện hoặc nhiễm nấm.",
        treatmentImplication: "Tìm nguyên nhân nhiễm khuẩn bệnh viện; cân nhắc bổ sung thuốc kháng nấm phù hợp.",
        sources: [NKH("mục 4.1.2a; tr. 120")] },
    ],
    "Chưa rõ ổ nhiễm khuẩn nhưng có yếu tố nguy cơ nhiễm khuẩn bệnh viện": [
      { condition: "Chưa xác định ổ nhiễm khuẩn khởi điểm; có yếu tố nguy cơ nhiễm khuẩn bệnh viện.",
        clinicalMeaning: "Cần bao phủ P. aeruginosa; lựa chọn dựa vào dữ liệu vi khuẩn và nhạy cảm của từng bệnh viện.",
        treatmentImplication: "Carbapenem chống P. aeruginosa hoặc piperacilin-tazobactam, phối hợp quinolon, aminoglycosid hoặc fosfomycin. Chỉnh liều theo độ thanh thải creatinin.",
        sources: [NKH("mục 4.1.2b; tr. 120")] },
    ],
    "Có yếu tố nguy cơ nhiễm khuẩn bệnh viện, nghi MRSA": [
      { condition: "Có nguy cơ nhiễm khuẩn bệnh viện và nghi tụ cầu vàng kháng methicilin.",
        clinicalMeaning: "Phác đồ chống P. aeruginosa không bao phủ MRSA.",
        treatmentImplication: "Cân nhắc dùng thêm vancomycin, teicoplanin hoặc daptomycin.",
        sources: [NKH("mục 4.1.2b; tr. 120")] },
    ],
    "Nghi Gram-âm đa kháng (kháng carbapenem)": [
      { condition: "Nghi vi khuẩn Gram âm đa kháng, kháng carbapenem.",
        clinicalMeaning: "Một kháng sinh đơn độc khó đạt hiệu quả; nguồn khuyến cáo phối hợp để tăng tác dụng hiệp đồng.",
        treatmentImplication: "Carbapenem có tác dụng A. baumannii và/hoặc penicilin phổ rộng + chất ức chế beta-lactamase (piperacilin-tazobactam, ampicilin-sulbactam), phối hợp colistin.",
        sources: [NKH("mục 4.1.2b; tr. 120")] },
    ],
    "Ổ nhiễm khuẩn gan mật (K. pneumoniae là vi khuẩn chính gây nhiễm khuẩn huyết và áp xe gan ở Việt Nam)": [
      { condition: "Ổ nhiễm khuẩn khởi điểm ở gan mật.",
        clinicalMeaning: "K. pneumoniae là vi khuẩn chính gây nhiễm khuẩn huyết và áp xe gan ở Việt Nam.",
        treatmentImplication: "Cephalosporin thế hệ 3–4; dùng carbapenem nếu có nguy cơ vi khuẩn sinh ESBL. Phối hợp aminoglycosid, hoặc metronidazol khi nghi kỵ khí.",
        sources: [NKH("mục 4.1.2c; tr. 120")] },
    ],
    "Ổ nhiễm khuẩn ống tiêu hóa": [
      { condition: "Ổ nhiễm khuẩn khởi điểm ở ống tiêu hóa.",
        clinicalMeaning: "Cần bao phủ Gram âm đường ruột; vi khuẩn kỵ khí khi nghi ngờ.",
        treatmentImplication: "Cephalosporin thế hệ 3–4, carbapenem hoặc ciprofloxacin; phối hợp metronidazol khi nghi kỵ khí.",
        sources: [NKH("mục 4.1.2c; tr. 120")] },
    ],
    "Nhiễm khuẩn liên quan đến dụng cụ mạch máu (nghi MRSA)": [
      { condition: "Nhiễm khuẩn liên quan đến dụng cụ mạch máu, nghi MRSA.",
        clinicalMeaning: "Xử trí như nhiễm khuẩn có yếu tố nguy cơ nhiễm khuẩn bệnh viện.",
        treatmentImplication: "Vancomycin, linezolid, teicoplanin hoặc daptomycin; rút dụng cụ là đường vào nếu có chỉ định.",
        sources: [NKH("mục 4.1.2c, 4.2; tr. 121, 123")] },
    ],
    "Nhiễm khuẩn sinh dục ở nữ giới": [
      { condition: "Ổ nhiễm khuẩn khởi điểm ở đường sinh dục nữ, mắc phải ở cộng đồng.",
        clinicalMeaning: "Bao gồm nhiễm khuẩn vùng tiểu khung (viêm phúc mạc tiểu khung, áp xe buồng trứng – vòi trứng).",
        treatmentImplication: "Ceftriaxon + azithromycin + metronidazol.",
        sources: [NKH("mục 3.1a, 4.1.2c; tr. 118, 121")] },
      { condition: "Nghi liên quan nhiễm khuẩn bệnh viện, hoặc nghi vi khuẩn đa kháng.",
        treatmentImplication: "Thay ceftriaxon bằng carbapenem hoặc piperacilin-tazobactam (giữ azithromycin, metronidazol); thêm colistin nếu nghi đa kháng.",
        sources: [NKH("mục 4.1.2c; tr. 121")] },
    ],
    "Nhiễm khuẩn da (nghi S. aureus)": [
      { condition: "Ổ nhiễm khuẩn khởi điểm ở da, nghi tụ cầu vàng.",
        treatmentImplication: "MSSA: oxacilin, cloxacilin hoặc cefazolin. MRSA: vancomycin, teicoplanin hoặc daptomycin.",
        sources: [NKH("mục 4.1.2c; tr. 121")] },
      { condition: "Tổn thương da rộng (ví dụ do bỏng).",
        clinicalMeaning: "Có nguy cơ nhiễm khuẩn bệnh viện.",
        treatmentImplication: "Cân nhắc kháng sinh có tác dụng diệt P. aeruginosa.",
        sources: [NKH("mục 4.1.2c; tr. 121")] },
    ],
  },
};

/* Lua chon theo vi khuan da xac dinh (Bang II.10) */
const TABLE_II10 = NKH("mục 4.1.3, Bảng II.10; tr. 121–122");
const SEPSIS_PATHOGEN_COMMON: ClinicalCriterion[] = [
  { condition: "Đã xác định vi khuẩn gây bệnh (cấy máu hoặc bệnh phẩm ổ nhiễm khuẩn).",
    clinicalMeaning: "Kháng sinh chọn theo vi khuẩn gây bệnh, có kháng sinh lựa chọn và kháng sinh thay thế.",
    treatmentImplication: "Điều chỉnh theo kháng sinh đồ, ưu tiên phổ hẹp nhạy cảm; chỉnh liều theo độ thanh thải creatinin khi suy thận.",
    sources: [TABLE_II10, NKH("mục 4.1.1, 4.1.2c; tr. 119–120")] },
];
const ENTERO = "Enterobacteriaceae không sinh ESBL";
const ESBL = "Enterobacteriaceae sinh ESBL";
const PSA = "Pseudomonas aeruginosa";
const PATHOGEN_BRANCHES: Record<string, ClinicalCriterion[]> = {
  [ENTERO]: [
    { condition: "Gram âm đường ruột họ Enterobacteriaceae, không sinh ESBL.",
      treatmentImplication: "Kháng sinh lựa chọn trong Bảng II.10 gồm ceftriaxon; thay thế: cephalosporin thế hệ 3–4 khác hoặc fluoroquinolon.",
      sources: [TABLE_II10] },
  ],
  [ESBL]: [
    { condition: "Gram âm đường ruột họ Enterobacteriaceae sinh ESBL.",
      clinicalMeaning: "Nguồn chỉ định carbapenem khi có nguy cơ vi khuẩn sinh ESBL.",
      treatmentImplication: "Ertapenem là lựa chọn trong Bảng II.10.",
      sources: [TABLE_II10, NKH("mục 4.1.2c; tr. 120")] },
  ],
  [PSA]: [
    { condition: "Pseudomonas aeruginosa.",
      clinicalMeaning: "Cần kháng sinh có tác dụng chống P. aeruginosa.",
      treatmentImplication: "Dùng một trong các kháng sinh chống P. aeruginosa liệt kê trong Bảng II.10, sau đó theo kháng sinh đồ.",
      sources: [TABLE_II10] },
  ],
  "Staphylococcus aureus nhạy methicilin (MSSA)": [
    { condition: "S. aureus nhạy methicilin.",
      treatmentImplication: "Oxacilin là lựa chọn; vancomycin là thay thế.",
      sources: [TABLE_II10] },
  ],
  "Staphylococcus aureus kháng methicilin (MRSA)": [
    { condition: "S. aureus kháng methicilin.",
      treatmentImplication: "Vancomycin là lựa chọn; daptomycin là thay thế.",
      sources: [TABLE_II10] },
  ],
};
/** Giu lai chi cac nhanh thuoc mat benh (nhieu mat benh dung chung mot bai nguon). */
const pick = (d: DiseaseRationale, keys: string[]): DiseaseRationale =>
  ({ ...d, branches: Object.fromEntries(keys.map((k) => [k, d.branches[k]])) });
const SEPSIS_PATHOGEN: DiseaseRationale = {
  common: SEPSIS_PATHOGEN_COMMON,
  reassessment: SEPSIS.reassessment,
  branches: PATHOGEN_BRANCHES,
};

/* ---------- Sot giam bach cau hat trung tinh (Chuong 11, tr. 252–254) ---------- */
const GBC = (loc: string) => Q(`Suy giảm miễn dịch (giảm bạch cầu hạt trung tính), ${loc}`);
const NEUTROPENIA: DiseaseRationale = {
  common: [
    { condition: "Sốt (> 38 °C đo ở miệng một lần, hoặc > 38 °C liên tục ít nhất 1 giờ) và ANC < 500 tế bào/µl.",
      clinicalMeaning: "Đáp ứng viêm không đầy đủ; sốt có thể là dấu hiệu duy nhất. Ít nhất 20% người bệnh có ANC < 100 tế bào/µl bị nhiễm khuẩn huyết; bệnh có thể tiến triển rất nhanh.",
      treatmentImplication: "Coi như cấp cứu nội khoa: kháng sinh phổ rộng, liều cao, lý tưởng trong vòng 60 phút; điều chỉnh liều theo chức năng gan, thận.",
      sources: [GBC("mục 1, 2, 5a; tr. 252–253")] },
    { condition: "Nguy cơ cao: ANC < 500 tế bào/µl kéo dài > 7 ngày, hoặc có bệnh kèm, hoặc rối loạn chức năng gan, thận, hoặc điểm MASCC < 21.",
      clinicalMeaning: "Thời gian và mức độ giảm bạch cầu hạt liên quan chặt chẽ với nhiễm khuẩn nặng.",
      treatmentImplication: "Bắt buộc kháng sinh đường tĩnh mạch và theo dõi sát khi nằm viện.",
      sources: [GBC("mục 2, 3; tr. 252–253")] },
  ],
  reassessment: [
    "Có kết quả nuôi cấy: điều chỉnh kháng sinh theo kháng sinh đồ.",
    "Xác định được ổ nhiễm khuẩn và tác nhân: dùng theo hướng dẫn riêng từng vi khuẩn (ví dụ nhiễm khuẩn huyết do E. coli tối thiểu 14 ngày), tiếp tục đến khi ANC > 500 tế bào/µl.",
    "Không xác định được ổ nhiễm khuẩn, vi khuẩn học âm tính: dùng đến khi hết sốt tối thiểu 48 giờ và ANC > 500 tế bào/µl, hoặc chuyển uống dự phòng fluoroquinolon đến khi tủy hồi phục.",
  ],
  branches: {
    "Sốt giảm bạch cầu hạt trung tính nguy cơ cao – khởi đầu": [
      { condition: "Khởi trị sốt giảm bạch cầu hạt trung tính nguy cơ cao.",
        clinicalMeaning: "Tác nhân gồm Gram âm (E. coli, Klebsiella, Enterobacter, P. aeruginosa, Acinetobacter…) và Gram dương; mục tiêu bao phủ hầu hết vi khuẩn gây bệnh.",
        treatmentImplication: "Khởi đầu bằng một thuốc: ceftazidim, cefepim, piperacilin-tazobactam, imipenem-cilastatin hoặc meropenem (theo IDSA).",
        sources: [GBC("mục 5a, 5b, Bảng II.21; tr. 253–254")] },
    ],
    "Kết hợp thêm vào phác đồ khởi đầu": [
      { condition: "Cần phối hợp thêm vào thuốc khởi đầu.",
        treatmentImplication: "Thêm aminoglycosid (amikacin, gentamycin, tobramycin) hoặc fluoroquinolon. Aminoglycosid: giảm liều khi suy thận theo độ thanh thải creatinin.",
        sources: [GBC("mục 5b; tr. 254")] },
    ],
    "Kết hợp thêm: nhiễm khuẩn da, phần mềm, chân catheter, viêm phổi, nhiễm khuẩn huyết do Gram-dương": [
      { condition: "Nhiễm khuẩn da, phần mềm, chân catheter, viêm phổi, hoặc nhiễm khuẩn huyết liên quan vi khuẩn Gram dương.",
        clinicalMeaning: "Gram dương thường gặp: tụ cầu coagulase âm tính, S. aureus, Enterococcus, liên cầu viridans.",
        treatmentImplication: "Thêm vancomycin; teicoplanin cho nhiễm khuẩn nặng do Gram dương, đặc biệt tụ cầu vàng kháng methicilin và cephalosporin.",
        sources: [GBC("mục 5b, Bảng II.21; tr. 254")] },
    ],
    "Nhiễm khuẩn nặng đe dọa tính mạng do Gram-âm kháng carbapenem": [
      { condition: "Nhiễm khuẩn nặng, đe dọa tính mạng, do vi khuẩn Gram âm kháng carbapenem.",
        treatmentImplication: "Thêm colistin.",
        sources: [GBC("mục 5b; tr. 254")] },
    ],
  },
};

/* ---------- Viem mang nao mu (Chuong 9, tr. 229–233) ---------- */
const VMN = (loc: string) => Q(`Viêm màng não mủ, ${loc}`);
const B219 = VMN("mục 4.2, Bảng II.19; tr. 231");
const LISTERIA: ClinicalCriterion = {
  condition: "Nghi Listeria monocytogenes.",
  clinicalMeaning: "Listeria có thể gặp ở trẻ sơ sinh và người già.",
  treatmentImplication: "Chọn ampicilin khi nghi Listeria (chú thích * Bảng II.19).",
  sources: [VMN("mục 2; tr. 229"), B219],
};
const MENINGITIS_COMMON: ClinicalCriterion[] = [
  { condition: "Sốt và hội chứng màng não; chưa có kết quả vi sinh.",
    clinicalMeaning: "Điều trị còn phức tạp, tiên lượng dè dặt; căn nguyên khác nhau theo lứa tuổi và cơ địa.",
    treatmentImplication: "Kháng sinh kịp thời theo phác đồ kinh nghiệm của Bảng II.19; đổi kháng sinh khi có kháng sinh đồ.",
    sources: [VMN("mục 1, 4.1, 4.2; tr. 229–230")] },
];
const MENINGITIS_REASSESS = [
  "Có nhuộm Gram: điều chỉnh ngay (cầu khuẩn Gram dương: ceftriaxon hoặc cefotaxim + vancomycin; cầu khuẩn Gram âm: penicilin G; trực khuẩn Gram dương: ampicilin + aminoglycosid; trực khuẩn Gram âm: ceftriaxon + aminoglycosid).",
  "Có kết quả cấy: đổi theo kháng sinh đồ. Không có kết quả cấy hoặc lâm sàng không cải thiện: chọc lại dịch não tủy sau 48 giờ; không cải thiện thì đổi sang phác đồ thay thế.",
  "Thời gian: não mô cầu 7 ngày, Hib 10 ngày, phế cầu 14 ngày; trực khuẩn, kỵ khí Gram âm, liên cầu, tụ cầu 3 tuần; hoặc trung bình 10–14 ngày và đã hết sốt 3 ngày.",
];
const adult1850: ClinicalCriterion[] = [
  { condition: "Người lớn 18–50 tuổi.",
    clinicalMeaning: "Căn nguyên thường gặp: phế cầu, liên cầu, não mô cầu.",
    treatmentImplication: "Ưu tiên ceftriaxon hoặc cefotaxim; thay thế: vancomycin + ceftriaxon (hoặc cefotaxim).",
    sources: [B219] },
];
const adult50: ClinicalCriterion[] = [
  { condition: "Người lớn trên 50 tuổi.",
    clinicalMeaning: "Căn nguyên thường gặp: phế cầu, não mô cầu, Listeria, kỵ khí Gram âm.",
    treatmentImplication: "Ưu tiên ceftriaxon hoặc cefotaxim; thay thế: ampicilin + ceftriaxon (hoặc cefotaxim).",
    sources: [B219] },
  LISTERIA,
];
const immuno: ClinicalCriterion[] = [
  { condition: "Người bệnh suy giảm miễn dịch.",
    clinicalMeaning: "Căn nguyên gồm phế cầu, não mô cầu, Listeria, kỵ khí Gram âm; cơ địa này thường có bệnh cảnh nặng hơn.",
    treatmentImplication: "Ưu tiên ampicilin + ceftazidim; thay thế: vancomycin + ampicilin + ceftazidim.",
    sources: [B219, VMN("mục 3.1d; tr. 230")] },
];
const neonate: ClinicalCriterion[] = [
  { condition: "Trẻ 0–4 tuần tuổi.",
    clinicalMeaning: "Căn nguyên: vi khuẩn đường ruột, S. agalactiae, Listeria; trẻ sơ sinh thường có bệnh cảnh nặng hơn.",
    treatmentImplication: "Ưu tiên cefotaxim + ampicilin; thay thế: ampicilin + aminoglycosid (gentamycin hoặc amikacin). Không khuyến cáo meropenem cho trẻ dưới 3 tháng.",
    sources: [B219, VMN("mục 3.1d, 4.2; tr. 230–231")] },
];
const infant13: ClinicalCriterion[] = [
  { condition: "Trẻ 1–3 tháng tuổi.",
    clinicalMeaning: "Căn nguyên: Hib, phế cầu, não mô cầu, S. agalactiae, E. coli, Listeria.",
    treatmentImplication: "Ưu tiên ampicilin + ceftriaxon (hoặc cefotaxim); thay thế: vancomycin + ceftriaxon (hoặc cefotaxim). Không khuyến cáo meropenem cho trẻ dưới 3 tháng.",
    sources: [B219, VMN("mục 4.2; tr. 231")] },
  LISTERIA,
];
const child318: ClinicalCriterion[] = [
  { condition: "Trẻ 3 tháng – 18 tuổi.",
    clinicalMeaning: "Căn nguyên: Hib, phế cầu, não mô cầu.",
    treatmentImplication: "Ưu tiên ceftriaxon hoặc cefotaxim; thay thế: vancomycin + ceftriaxon (hoặc cefotaxim).",
    sources: [B219] },
];
const trauma: ClinicalCriterion[] = [
  { condition: "Sau chấn thương, phẫu thuật sọ não, hoặc dò dịch não tủy.",
    clinicalMeaning: "Căn nguyên: phế cầu, tụ cầu, kỵ khí Gram âm.",
    treatmentImplication: "Ưu tiên ceftazidim + vancomycin; cột thay thế ghi ceftazidim + vancomycin và meropenem. Hội chẩn ngoại khoa khi có khuyết tật, biến chứng hoặc chấn thương.",
    sources: [B219, VMN("mục 4.3; tr. 233")] },
];
const MENINGITIS_ADULT: DiseaseRationale = {
  common: MENINGITIS_COMMON,
  reassessment: MENINGITIS_REASSESS,
  branches: {
    "Viêm màng não mủ 18–50 tuổi (phế cầu, liên cầu, não mô cầu)": adult1850,
    "Viêm màng não mủ 18–50 tuổi": adult1850,
    "Viêm màng não mủ > 50 tuổi (phế cầu, não mô cầu, Listeria, kỵ khí Gram âm)": adult50,
    "Viêm màng não mủ > 50 tuổi – nghi Listeria": adult50,
    "Viêm màng não mủ ở người suy giảm miễn dịch (phế cầu, não mô cầu, Listeria, kỵ khí Gram âm)": immuno,
    "Viêm màng não mủ ở người suy giảm miễn dịch": immuno,
  },
};
const MENINGITIS_CHILD: DiseaseRationale = {
  common: MENINGITIS_COMMON,
  reassessment: MENINGITIS_REASSESS,
  branches: {
    "Viêm màng não 0–4 tuần tuổi": neonate,
    "Viêm màng não 0–4 tuần tuổi (vi khuẩn đường ruột, S. agalactiae, Listeria)": neonate,
    "Viêm màng não 1–3 tháng tuổi (Hib, phế cầu, não mô cầu, S. agalactiae, E. coli, Listeria)": infant13,
    "Viêm màng não 1–3 tháng tuổi": infant13,
    "Viêm màng não 3 tháng – 18 tuổi (Hib, phế cầu, não mô cầu)": child318,
    "Viêm màng não 3 tháng – 18 tuổi": child318,
  },
};
const SHUNT: DiseaseRationale = {
  common: [
    { condition: "Nhiễm khuẩn liên quan dẫn lưu não thất.",
      clinicalMeaning: "CẦN THẨM ĐỊNH: Bảng II.19 không có dòng riêng cho dẫn lưu não thất; ứng dụng xếp vào dòng chấn thương, phẫu thuật, dò dịch não tủy.",
      sources: [B219] },
    ...MENINGITIS_COMMON,
  ],
  reassessment: MENINGITIS_REASSESS,
  branches: {
    "Viêm màng não sau chấn thương, phẫu thuật, dò dịch não tủy (phế cầu, tụ cầu, kỵ khí Gram âm)": trauma,
    "Viêm màng não sau chấn thương, phẫu thuật, dò dịch não tủy": trauma,
  },
};

/* ---------- Nhiem khuan tiet nieu (Chuong 10, tr. 234–250) ---------- */
const VTBT = (loc: string) => Q(`Viêm thận bể thận cấp, ${loc}`);
const FQ_SAFETY: ClinicalCriterion = {
  condition: "Dự kiến dùng fluoroquinolon.",
  clinicalMeaning: "Chống chỉ định: phụ nữ có thai, đang cho con bú, trẻ em dưới 15 tuổi. Thận trọng: suy thận (giảm liều), suy gan; tác dụng không mong muốn trên tiêu hóa (nôn, buồn nôn).",
  treatmentImplication: "Chọn nhóm kháng sinh khác cho các đối tượng chống chỉ định.",
  sources: [VTBT("mục 4.2a, 4.2b; tr. 236–237")],
};
const PYELO: DiseaseRationale = {
  common: [
    { condition: "Viêm thận bể thận cấp: sốt cao rét run, đau hông lưng, hội chứng bàng quang.",
      clinicalMeaning: "Vi khuẩn Gram âm chiếm ưu thế (E. coli 70–80%, Klebsiella, Proteus, Enterobacter); Gram dương dưới 10%. Không điều trị kịp thời có thể sốc nhiễm khuẩn.",
      treatmentImplication: "Cấy nước tiểu (và cấy máu nếu sốt cao) trước kháng sinh, rồi bắt đầu kháng sinh ngay. Sốt cao rét run: điều trị nội trú.",
      sources: [VTBT("mục 2a, 3a, 4.1; tr. 234–235")] },
  ],
  reassessment: [
    "Sau 3–5 ngày không đỡ: điều chỉnh theo kết quả cấy và kháng sinh đồ.",
    "Vẫn sốt, vi khuẩn niệu tồn tại 48–72 giờ hoặc còn dấu hiệu nhiễm khuẩn sau 3 ngày: tìm tắc nghẽn, ổ nhiễm khuẩn lan rộng, áp xe thận (siêu âm, CT) để dẫn lưu ngoại khoa.",
    "Đường tiêm: nếu không biến chứng, hết sốt, chuyển uống từ ngày 10–14; duy trì kháng sinh 3 tuần; cấy nước tiểu kiểm tra sau 1 tuần ngừng thuốc.",
  ],
  branches: {
    "Viêm thận bể thận cấp không biến chứng, triệu chứng không nặng – đường uống": [
      { condition: "Không biến chứng, triệu chứng không nặng, có thể điều trị ngoại trú.",
        treatmentImplication: "Một thuốc uống trong 7–14 ngày: amoxicilin, amoxicilin-clavulanat, cephalosporin thế hệ 2–3 hoặc trimethoprim-sulfamethoxazol. Uống đủ nước để nước tiểu ≥ 1500–2000 ml/24 giờ.",
        sources: [VTBT("mục 4.2a; tr. 236")] },
      { condition: "Lâm sàng không tiến triển tốt (còn sốt, nhiễm khuẩn rõ, tiểu đục, đau, mất nước).",
        treatmentImplication: "Chuyển điều trị nội trú hoặc lên tuyến trên.",
        sources: [VTBT("mục 4.2a; tr. 236")] },
    ],
    "Viêm thận bể thận cấp không biến chứng – fluoroquinolon uống": [
      { condition: "Không biến chứng, triệu chứng không nặng; chọn nhóm fluoroquinolon uống.",
        treatmentImplication: "Ciprofloxacin, norfloxacin hoặc ofloxacin uống.",
        sources: [VTBT("mục 4.2a; tr. 236")] },
      FQ_SAFETY,
    ],
    "Viêm thận bể thận cấp – kháng sinh tiêm (nội trú)": [
      { condition: "Cần kháng sinh đường tiêm (nội trú).",
        treatmentImplication: "Amoxicilin hoặc ampicilin tiêm tĩnh mạch 10–14 ngày; hoặc amoxicilin-clavulanat, ampicilin-sulbactam tiêm tĩnh mạch.",
        sources: [VTBT("mục 4.2b; tr. 236")] },
    ],
    "Viêm thận bể thận cấp – cephalosporin thế hệ 2, 3 tiêm": [
      { condition: "Cần kháng sinh đường tiêm; chọn cephalosporin.",
        treatmentImplication: "Cefuroxim, cefotaxim, ceftriaxon hoặc cefoperazon tiêm tĩnh mạch, 10–14 ngày.",
        sources: [VTBT("mục 4.2b; tr. 236")] },
    ],
    "Viêm thận bể thận cấp – carbapenem": [
      { condition: "Cần kháng sinh đường tiêm; nguồn liệt kê carbapenem là một nhóm lựa chọn.",
        clinicalMeaning: "CẦN THẨM ĐỊNH: nguồn không nêu tiêu chí riêng để ưu tiên carbapenem so với các nhóm khác.",
        treatmentImplication: "Imipenem-cilastatin, meropenem hoặc ertapenem.",
        sources: [VTBT("mục 4.2b; tr. 236")] },
    ],
    "Viêm thận bể thận cấp – fluoroquinolon truyền": [
      { condition: "Cần kháng sinh đường tiêm; chọn fluoroquinolon.",
        treatmentImplication: "Ciprofloxacin hoặc levofloxacin; có thể truyền 3 ngày rồi chuyển uống.",
        sources: [VTBT("mục 4.2b; tr. 237")] },
      FQ_SAFETY,
    ],
    "Viêm thận bể thận cấp – kết hợp aminoglycosid": [
      { condition: "Phối hợp aminoglycosid với một thuốc tiêm ở trên.",
        clinicalMeaning: "Aminoglycosid độc với thận và tai.",
        treatmentImplication: "Gentamycin, tobramicin hoặc amikacin; thận trọng ở người già; giảm 1/2 liều khi mức lọc cầu thận < 30 ml/phút.",
        sources: [VTBT("mục 4.2b; tr. 237"), Q("Viêm bàng quang cấp, mục 3.2e; tr. 250")] },
    ],
    "Cấy nước tiểu có trực khuẩn Gram âm": [
      { condition: "Cấy nước tiểu có trực khuẩn Gram âm.",
        treatmentImplication: "Cephalosporin thế hệ 3 hoặc fluoroquinolon; sau đó theo kháng sinh đồ.",
        sources: [VTBT("mục 4.2b; tr. 237")] },
    ],
    "Cấy nước tiểu có vi khuẩn Gram dương": [
      { condition: "Cấy nước tiểu có vi khuẩn Gram dương.",
        clinicalMeaning: "Gram dương (Enterococcus, Staphylococcus) chiếm dưới 10%.",
        treatmentImplication: "Amoxicilin hoặc ampicilin tiêm tĩnh mạch; có thể kết hợp aminoglycosid để phòng vi khuẩn đường ruột trong khi chờ kết quả cấy máu, nước tiểu và kháng sinh đồ.",
        sources: [VTBT("mục 2a, 4.2b; tr. 234, 237")] },
    ],
    "Viêm thận bể thận cấp ở người có thai (thường gặp 3 tháng cuối)": [
      { condition: "Người bệnh có thai (thường gặp 3 tháng cuối).",
        clinicalMeaning: "Thận trọng khi dùng kháng sinh; không chụp X-quang; thăm dò hình thái khác chỉ làm sau đẻ.",
        treatmentImplication: "Nguồn ghi có thể dùng nhóm sulfamid, penicilin (amoxicilin). Không dùng fluoroquinolon.",
        sources: [VTBT("mục 4.5; tr. 238")] },
      { condition: "CẦN THẨM ĐỊNH – mâu thuẫn trong cùng văn bản.",
        clinicalMeaning: "Bài Viêm bàng quang cấp (mục 3.2e) chống chỉ định nhóm sulfamid ở phụ nữ có thai, trái với mục 4.5 bài Viêm thận bể thận cấp.",
        treatmentImplication: "Cần dược lâm sàng và bác sĩ điều trị thống nhất trước khi dùng sulfamid cho thai phụ.",
        sources: [VTBT("mục 4.5; tr. 238"), Q("Viêm bàng quang cấp, mục 3.2e; tr. 250")] },
    ],
  },
};

const SOI = (loc: string) => Q(`Sỏi thận tiết niệu nhiễm trùng, ${loc}`);
const STONE: DiseaseRationale = {
  common: [
    { condition: "Sỏi thận tiết niệu có biến chứng nhiễm khuẩn.",
      clinicalMeaning: "Vi khuẩn thường gặp: E. coli, Proteus, Klebsiella. Ứ mủ bể thận có nguy cơ nhiễm khuẩn huyết hoặc hỏng thận nếu không điều trị kịp thời.",
      treatmentImplication: "Kháng sinh kèm giải phóng tắc nghẽn do sỏi (điều trị nguyên nhân).",
      sources: [SOI("mục 2.1b, 3.3, 4b; tr. 241, 243–244")] },
  ],
  reassessment: [
    "Có viêm thận bể thận cấp (sốt cao rét run, đau hố thận, cấy máu và niệu dương tính): điều trị theo bài Viêm thận bể thận cấp.",
    "Vô niệu: lọc máu cấp cứu, không trì hoãn khi kali máu ≥ 6,5 mmol/l.",
  ],
  branches: {
    "Sỏi thận tiết niệu có biến chứng nhiễm khuẩn": [
      { condition: "Sỏi có biến chứng nhiễm khuẩn, cần kháng sinh đường tiêm hoặc cephalosporin.",
        treatmentImplication: "Amoxicilin hoặc ampicilin tiêm tĩnh mạch, hoặc cephalosporin thế hệ 2–3 (cefuroxim, cefotaxim, ceftriaxon), 10–14 ngày.",
        sources: [SOI("mục 3.2b; tr. 242–243")] },
    ],
    "Sỏi thận tiết niệu có biến chứng nhiễm khuẩn – fluoroquinolon uống": [
      { condition: "Chọn fluoroquinolon đường uống.",
        clinicalMeaning: "Chống chỉ định: phụ nữ có thai, trẻ em dưới 15 tuổi. Tác dụng không mong muốn: nôn, buồn nôn.",
        treatmentImplication: "Ciprofloxacin, norfloxacin hoặc ofloxacin trong 3–7 ngày, có thể tới 10 ngày; có thể truyền 3 ngày rồi chuyển uống.",
        sources: [SOI("mục 3.2b; tr. 243")] },
    ],
  },
};

const VBQ = (loc: string) => Q(`Viêm bàng quang cấp, ${loc}`);
const CYSTITIS_COMMON: ClinicalCriterion[] = [
  { condition: "Hội chứng bàng quang (đái buốt, đái rắt), thường không sốt hoặc sốt nhẹ < 38 °C.",
    clinicalMeaning: "Gram âm khoảng 90% (E. coli 70–80%, Proteus 10–15%, Klebsiella 5–10%); S. saprophyticus 5–10%.",
    treatmentImplication: "Kháng sinh uống ngắn ngày; chỉ cần cấy nước tiểu khi có nguyên nhân thuận lợi, không đáp ứng, tái phát hoặc ở nam giới.",
    sources: [VBQ("mục 1a, 2.1; tr. 248–249")] },
];
const CYST_PREG: ClinicalCriterion[] = [
  { condition: "Viêm bàng quang cấp ở phụ nữ có thai.",
    treatmentImplication: "Cephalexin, nitrofurantoin hoặc amoxicilin-clavulanat trong 5–7 ngày. Cấy dương tính: chọn theo kháng sinh đồ nhưng vẫn tránh thuốc chống chỉ định khi có thai (fluoroquinolon, sulfamid).",
    sources: [VBQ("mục 3.2b, 3.2e; tr. 249–250")] },
];
const CYSTITIS: DiseaseRationale = {
  common: CYSTITIS_COMMON,
  reassessment: [
    "Có nguyên nhân thuận lợi (tắc đường bài niệu, sỏi, u, đặt sonde, đái tháo đường): loại bỏ nguyên nhân, kéo dài kháng sinh 7–10 ngày.",
    "Tái phát từ 4 lần trở lên trong 1 năm: cân nhắc điều trị dự phòng.",
  ],
  branches: {
    "Viêm bàng quang cấp thông thường": [
      { condition: "Viêm bàng quang cấp thông thường, không có nguyên nhân thuận lợi.",
        treatmentImplication: "Một trong: trimethoprim-sulfamethoxazol (3–5 ngày), cephalexin, nitrofurantoin hoặc amoxicilin-clavulanat (5 ngày).",
        sources: [VBQ("mục 3.2a; tr. 249")] },
    ],
    "Viêm bàng quang cấp thông thường – chỉ khi các kháng sinh khác thất bại": [
      { condition: "Đã thất bại với các kháng sinh khác.",
        clinicalMeaning: "Fluoroquinolon không phải lựa chọn đầu tay.",
        treatmentImplication: "Norfloxacin 3–5 ngày. Chống chỉ định: phụ nữ có thai, cho con bú, trẻ em dưới 15 tuổi, tiền sử co giật.",
        sources: [VBQ("mục 3.2a, 3.2e; tr. 249–250")] },
    ],
    "Viêm bàng quang cấp ở phụ nữ có thai": CYST_PREG,
    "Viêm bàng quang cấp ở nam giới": [
      { condition: "Viêm bàng quang cấp ở nam giới.",
        clinicalMeaning: "Cần tìm nguyên nhân liên quan (viêm tuyến tiền liệt, tinh hoàn, mào tinh hoàn) để chọn thuốc và thời gian phù hợp.",
        treatmentImplication: "Trimethoprim-sulfamethoxazol, cephalexin hoặc amoxicilin-clavulanat trong 14 ngày; có viêm tuyến tiền liệt thì theo phác đồ riêng.",
        sources: [VBQ("mục 3.2c; tr. 250")] },
    ],
  },
};
const UTI_PREGNANCY: DiseaseRationale = {
  common: CYSTITIS_COMMON,
  branches: { "Viêm bàng quang cấp ở phụ nữ có thai": CYST_PREG },
};

/* ---------- Nhiem khuan duong mat (Chuong 5, tr. 148–150) ---------- */
const NKDM = (loc: string) => Q(`Nhiễm khuẩn đường mật, ${loc}`);
const B215 = NKDM("mục 4b, Bảng II.15; tr. 150");
const BILIARY: DiseaseRationale = {
  common: [
    { condition: "Đau, sốt, vàng da ở người có tắc nghẽn đường mật (sỏi, giun, u, sau nối mật ruột).",
      clinicalMeaning: "Hay gặp Gram âm đường ruột (E. coli, Klebsiella, Enterobacter) và Enterococcus; thể nặng thường đa vi khuẩn có kỵ khí. Nhiễm khuẩn bệnh viện: MRSA, Enterococcus kháng vancomycin, Pseudomonas.",
      treatmentImplication: "Chọn kháng sinh bài tiết tốt vào đường mật; điều trị kinh nghiệm theo Bảng II.15 trong khi chờ kháng sinh đồ.",
      sources: [NKDM("mục 1a, 4a; tr. 148–150")] },
    { condition: "Có tắc nghẽn đường mật.",
      treatmentImplication: "Phải đảm bảo lưu thông đường mật: dẫn lưu qua da, đặt stent qua ERCP hoặc phẫu thuật.",
      sources: [NKDM("mục 4a; tr. 149")] },
  ],
  reassessment: [
    "Thể nhẹ: 5–7 ngày. Thể trung bình và nặng: 7–14 ngày, có thể dài hơn tùy đáp ứng.",
    "Có kháng sinh đồ: điều trị theo kháng sinh đồ.",
  ],
  branches: {
    "Lựa chọn số 1: penicillin phổ rộng + chất ức chế beta-lactamase": [
      { condition: "Lựa chọn số 1 – penicilin phối hợp chất ức chế beta-lactamase.",
        treatmentImplication: "Ampicilin-sulbactam (hay dùng ở thể nhẹ) hoặc piperacilin-tazobactam.",
        sources: [B215] },
    ],
    "Lựa chọn số 1: aminoglycosid": [
      { condition: "Lựa chọn số 1 – aminoglycosid.",
        clinicalMeaning: "Aminoglycosid có tác dụng tốt với vi khuẩn Gram âm.",
        treatmentImplication: "Gentamycin, amikacin hoặc tobramycin.",
        sources: [B215, NKDM("mục 4a; tr. 150")] },
    ],
    "Lựa chọn số 1: cephalosporin thế hệ 3, 4": [
      { condition: "Lựa chọn số 1 – cephalosporin thế hệ 3, 4.",
        clinicalMeaning: "Cephalosporin thế hệ 3 có tác dụng tốt với vi khuẩn Gram âm.",
        treatmentImplication: "Cefoperazon-sulbactam, ceftriaxon, ceftazidim hoặc cefepim.",
        sources: [B215, NKDM("mục 4a; tr. 150")] },
    ],
    "Lựa chọn số 1: monobactam": [
      { condition: "Lựa chọn số 1 – monobactam.", treatmentImplication: "Aztreonam.", sources: [B215] },
    ],
    "Có nhiễm khuẩn kỵ khí: thêm vào một trong bốn nhóm lựa chọn số 1 (hoặc một trong ba fluoroquinolon của lựa chọn số 2)": [
      { condition: "Có nhiễm khuẩn kỵ khí, hoặc nhiễm khuẩn đường mật nặng.",
        clinicalMeaning: "Thể nặng thường nhiễm nhiều loại vi khuẩn, trong đó có kỵ khí (Clostridium, Bacteroides).",
        treatmentImplication: "Thêm metronidazol vào một nhóm của lựa chọn số 1 hoặc một fluoroquinolon của lựa chọn số 2.",
        sources: [B215, NKDM("mục 1a, 4a; tr. 148–149")] },
    ],
    "Lựa chọn số 2: fluoroquinolon": [
      { condition: "Lựa chọn số 2 – fluoroquinolon.",
        treatmentImplication: "Ciprofloxacin, levofloxacin hoặc moxifloxacin (uống hoặc tĩnh mạch).",
        sources: [B215] },
    ],
    "Lựa chọn số 2: carbapenem": [
      { condition: "Lựa chọn số 2 – carbapenem.",
        clinicalMeaning: "CẦN THẨM ĐỊNH: nguồn không nêu tiêu chí riêng để chọn carbapenem.",
        treatmentImplication: "Meropenem, imipenem-cilastatin hoặc doripenem.",
        sources: [B215] },
    ],
  },
};

/* ---------- Viem phuc mac (Chuong 5, tr. 158–160) ---------- */
const VPM = (loc: string) => Q(`Viêm phúc mạc, ${loc}`);
const PERITONITIS: DiseaseRationale = {
  common: [
    { condition: "Viêm phúc mạc thứ phát: sau thủng, vỡ, chấn thương tạng trong ổ bụng, bục miệng nối.",
      clinicalMeaning: "Căn nguyên thường gặp: E. coli, K. pneumoniae, B. fragilis; có thể Streptococcus, Enterococcus, Clostridium.",
      treatmentImplication: "Phác đồ phải bao phủ Gram âm đường ruột và kỵ khí (kết hợp metronidazol).",
      sources: [VPM("mục 2.2, 4.2; tr. 158, 160")] },
  ],
  reassessment: [
    "Có kết quả cấy dịch ổ bụng hoặc cấy máu: điều trị theo kháng sinh đồ.",
    "Kèm dẫn lưu ổ áp xe, phẫu thuật lại ổ bụng, hồi sức chống sốc.",
  ],
  branches: {
    "Viêm phúc mạc thứ phát": [
      { condition: "Viêm phúc mạc thứ phát, chưa nặng.",
        treatmentImplication: "Ticarcilin-clavulanat, piperacilin-tazobactam hoặc ertapenem, kết hợp metronidazol.",
        sources: [VPM("mục 4.2; tr. 160")] },
    ],
    "Viêm phúc mạc thứ phát – trường hợp nặng": [
      { condition: "Viêm phúc mạc thứ phát nặng (sốc, rối loạn ý thức, suy tạng).",
        treatmentImplication: "Imipenem, doripenem hoặc meropenem, kết hợp metronidazol.",
        sources: [VPM("mục 3.1, 4.2; tr. 159–160")] },
    ],
  },
};

/* ---------- Tieu chay do vi khuan (Chuong 5, tr. 141–143) ---------- */
const TC = (loc: string) => Q(`Tiêu chảy do vi khuẩn, ${loc}`);
const DIARRHEA_COMMON: ClinicalCriterion[] = [
  { condition: "Tiêu chảy nhiễm khuẩn; dự đoán căn nguyên theo lâm sàng (phân nước hay phân nhầy máu).",
    clinicalMeaning: "Kháng sinh thường hiệu quả với tiêu chảy xâm nhập; tiêu chảy nặng có thể mất nước, nhiễm độc, tử vong ở trẻ em và người già.",
    treatmentImplication: "Điều trị ngay theo căn nguyên dự đoán; thường dùng đường uống, đường truyền chỉ khi nặng có nhiễm khuẩn toàn thân. Bồi phụ nước điện giải.",
    sources: [TC("mục 1, 4.1, 4.2; tr. 141–142")] },
];
const DIARRHEA_REASSESS = ["Có kết quả cấy phân: điều chỉnh kháng sinh nếu cần.", "Liều trong bài chủ yếu cho người lớn; trẻ em theo Hướng dẫn xử trí tiêu chảy ở trẻ em (BYT 2009)."];
const QUINOLONE_AGE: ClinicalCriterion = {
  condition: "Người trên 12 tuổi.",
  treatmentImplication: "Quinolon (ciprofloxacin hoặc norfloxacin) là thuốc ưu tiên, 5 ngày.",
  sources: [TC("mục 4.2a, 4.2c; tr. 142–143")],
};
const DIARRHEA: DiseaseRationale = {
  common: DIARRHEA_COMMON,
  reassessment: DIARRHEA_REASSESS,
  branches: {
    "Tiêu chảy do E. coli (ETEC, EHEC), Campylobacter, Yersinia, Salmonella, Vibrio spp. (người > 12 tuổi)": [
      { condition: "Nghi E. coli, Campylobacter, Yersinia, Salmonella, Vibrio.",
        clinicalMeaning: "ETEC thường tự khỏi; EIEC, EPEC, EHEC gây hội chứng lỵ.",
        sources: [TC("mục 3b, 4.2a; tr. 142")] },
      QUINOLONE_AGE,
    ],
    "Tiêu chảy do E. coli (ETEC, EHEC), Campylobacter, Yersinia, Salmonella, Vibrio spp.": [
      { condition: "Không dùng được quinolon (ví dụ ≤ 12 tuổi).",
        treatmentImplication: "Thuốc thay thế: ceftriaxon tĩnh mạch, TMP-SMX hoặc doxycyclin, 5 ngày.",
        sources: [TC("mục 4.2a; tr. 143")] },
    ],
    "Tiêu chảy do Shigella (lỵ trực khuẩn)": [
      { condition: "Hội chứng lỵ: sốt cao, đau quặn, mót rặn, phân nhầy máu.",
        treatmentImplication: "Thay thế: ceftriaxon tĩnh mạch hoặc azithromycin uống (ưu tiên cho phụ nữ có thai; trẻ dưới 12 tuổi dùng liều theo cân nặng).",
        sources: [TC("mục 3b, 4.2c; tr. 142–143")] },
      QUINOLONE_AGE,
    ],
  },
};
const CDIFF: DiseaseRationale = {
  common: DIARRHEA_COMMON,
  reassessment: DIARRHEA_REASSESS,
  branches: {
    "Tiêu chảy do Clostridium difficile": [
      { condition: "Tiêu chảy do độc tố Clostridium difficile.",
        treatmentImplication: "Ưu tiên metronidazol uống 7–10 ngày; thay thế vancomycin uống 7–10 ngày.",
        sources: [TC("mục 1, 4.2b; tr. 141, 143")] },
    ],
  },
};

/* ---------- Viem noi tam mac nhiem khuan (Chuong 3, tr. 128–130) ---------- */
const VNTM = (loc: string) => Q(`Viêm nội tâm mạc nhiễm khuẩn, ${loc}`);
const ENDOCARDITIS: DiseaseRationale = {
  common: [
    { condition: "Người bệnh tim có sốt dai dẳng trên 1 tuần không rõ lý do.",
      clinicalMeaning: "Cần nghĩ đến viêm nội tâm mạc để chẩn đoán và điều trị sớm; siêu âm tim không thấy sùi không loại trừ chẩn đoán.",
      treatmentImplication: "Cấy máu nhiều lần (ba lần) trước kháng sinh, rồi điều trị sớm: diệt khuẩn, liều cao, phối hợp hai kháng sinh, đường tĩnh mạch, 4–6 tuần.",
      sources: [VNTM("mục 3, 4.1; tr. 128–129")] },
  ],
  reassessment: [
    "Có kết quả cấy máu: phối hợp kháng sinh đặc hiệu theo kháng sinh đồ, 4–6 tuần.",
    "Aminoglycosid: thời gian ngắn nhất có thể (5–14 ngày), không quá 14 ngày.",
  ],
  branches: {
    "Van tự nhiên, trong khi chờ cấy máu (người lớn)": [
      { condition: "Van tự nhiên, đang chờ kết quả cấy máu.",
        clinicalMeaning: "Đa số do liên cầu; ngoài ra tụ cầu, não mô cầu, phế cầu, lậu cầu, trực khuẩn Gram âm.",
        treatmentImplication: "Ampicilin-sulbactam + gentamycin.",
        sources: [VNTM("mục 2, 4.2a; tr. 128–129")] },
    ],
    "Van tự nhiên, người dị ứng penicilin (vancomycin dùng cho người dị ứng penicilin)": [
      { condition: "Van tự nhiên, người bệnh dị ứng penicilin.",
        treatmentImplication: "Vancomycin + gentamycin + ciprofloxacin.",
        sources: [VNTM("mục 4.2a; tr. 129")] },
    ],
    "Van tự nhiên, trẻ em (không vượt quá liều người lớn bình thường)": [
      { condition: "Trẻ em, van tự nhiên.",
        treatmentImplication: "Ampicilin-sulbactam + gentamycin + vancomycin + ciprofloxacin; liều không vượt quá liều người lớn bình thường.",
        sources: [VNTM("mục 4.2a; tr. 129")] },
    ],
    "Van nhân tạo, xảy ra < 1 năm sau phẫu thuật thay van (người lớn): phối hợp bốn kháng sinh": [
      { condition: "Van nhân tạo, khởi phát dưới 1 năm sau thay van (người lớn).",
        treatmentImplication: "Phối hợp bốn kháng sinh: vancomycin, gentamycin (2 tuần), cefepim, rifampin (6 tuần).",
        sources: [VNTM("mục 4.2b; tr. 129")] },
    ],
    "Van nhân tạo < 1 năm sau phẫu thuật, trẻ em: phối hợp bốn kháng sinh": [
      { condition: "Van nhân tạo, khởi phát dưới 1 năm sau thay van (trẻ em).",
        treatmentImplication: "Cefepim (trẻ > 2 tháng), rifampin, vancomycin, gentamycin.",
        sources: [VNTM("mục 4.2b; tr. 129–130")] },
    ],
    "Van nhân tạo xảy ra > 1 năm sau phẫu thuật thay van": [
      { condition: "Van nhân tạo, khởi phát trên 1 năm sau thay van.",
        treatmentImplication: "Điều trị như van tự nhiên, thời gian 6 tuần.",
        sources: [VNTM("mục 4.2c; tr. 130")] },
    ],
  },
};

/* ---------- Ap xe phoi (Chuong 1, tr. 109–112) va Gian phe quan (tr. 67–70) ---------- */
const AXP = (loc: string) => Q(`Áp xe phổi, ${loc}`);
const GPQ = (loc: string) => Q(`Giãn phế quản, ${loc}`);
const respBranches = (S: (loc: string) => string, sec: string, p: string) => ({
  betaLactamase: [
    { condition: "Nghi vi khuẩn tiết beta-lactamase.",
      treatmentImplication: "Thay penicilin G bằng amoxicilin-clavulanat hoặc ampicilin-sulbactam, vẫn kết hợp aminoglycosid.",
      sources: [S(`${sec}; ${p}`)] },
  ],
  gramNeg: [
    { condition: "Nghi vi khuẩn Gram âm.",
      treatmentImplication: "Cephalosporin thế hệ 3 (cefotaxim hoặc ceftazidim) kết hợp aminoglycosid.",
      sources: [S(`${sec}; ${p}`)] },
  ],
  staph: [
    { condition: "Nghi tụ cầu.",
      treatmentImplication: "Oxacilin hoặc vancomycin; kết hợp amikacin khi nghi tụ cầu kháng thuốc.",
      sources: [S(`${sec}; ${p}`)] },
  ],
});
const axpB = respBranches(AXP, "mục 3.1.1c", "tr. 110–111");
const LUNG_ABSCESS: DiseaseRationale = {
  common: [
    { condition: "Ổ mủ trong nhu mô phổi (hình hang có mức nước hơi), sốt, khạc đờm mủ.",
      clinicalMeaning: "Thường đa vi khuẩn: S. aureus, K. pneumoniae, P. aeruginosa, E. coli, Proteus, kỵ khí, S. pneumoniae, H. influenzae; đôi khi nấm, amíp.",
      treatmentImplication: "Kháng sinh sớm ngay sau khi lấy bệnh phẩm vi sinh; phối hợp từ hai kháng sinh, tĩnh mạch hoặc tiêm bắp, liều cao ngay từ đầu.",
      sources: [AXP("mục 2.1, 2.2, 3.1.1a; tr. 109–110")] },
    { condition: "Đờm có mùi thối.",
      clinicalMeaning: "Gợi ý vi khuẩn kỵ khí.",
      treatmentImplication: "Dùng kháng sinh diệt kỵ khí (metronidazol).",
      sources: [AXP("mục 3.1.1a; tr. 110")] },
  ],
  reassessment: [
    "Thường cải thiện sau 3–4 ngày, cắt sốt sau 7–10 ngày; nếu vẫn sốt: chậm đáp ứng, cần xét nghiệm vi sinh tìm nguyên nhân.",
    "Thời gian ít nhất 4 tuần, có thể tới 6 tuần theo lâm sàng và X-quang.",
    "Dẫn lưu ổ áp xe (tư thế, nội soi phế quản, chọc qua thành ngực); phẫu thuật khi ổ > 10 cm, mạn tính, ho máu nặng, rò phế quản – màng phổi.",
  ],
  branches: {
    "Áp xe phổi: phối hợp beta-lactam + aminoglycosid": [
      { condition: "Áp xe phổi chưa định hướng tác nhân.",
        treatmentImplication: "Penicilin G (hoặc amoxicilin-clavulanat, ampicilin-sulbactam) kết hợp aminoglycosid (gentamycin hoặc amikacin).",
        sources: [AXP("mục 3.1.1c; tr. 110")] },
    ],
    "Nghi vi khuẩn tiết beta-lactamase": axpB.betaLactamase,
    "Nghi vi khuẩn Gram-âm": axpB.gramNeg,
    "Nghi vi khuẩn kỵ khí": [
      { condition: "Nghi vi khuẩn kỵ khí (đờm thối).",
        treatmentImplication: "Beta-lactam-clavulanat kết hợp metronidazol; hoặc penicilin G kết hợp metronidazol hoặc clindamycin.",
        sources: [AXP("mục 3.1.1c; tr. 110–111")] },
    ],
    "Nghi tụ cầu": axpB.staph,
    "Áp xe phổi do amíp": [
      { condition: "Áp xe phổi do amíp.",
        treatmentImplication: "Metronidazol kết hợp kháng sinh khác.",
        sources: [AXP("mục 3.1.1c; tr. 111")] },
    ],
  },
};
const gpqB = respBranches(GPQ, "mục 4.3.2", "tr. 69–70");
const BRONCHIECTASIS: DiseaseRationale = {
  common: [
    { condition: "Đợt cấp giãn phế quản có bội nhiễm (sốt, khạc đờm mủ nhiều).",
      clinicalMeaning: "Vi khuẩn thường gặp: S. pneumoniae, K. pneumoniae, P. aeruginosa, S. aureus, E. coli.",
      treatmentImplication: "Đường uống hay tiêm theo mức độ và tình hình kháng tại địa phương; nặng thì phối hợp. Thường dùng beta-lactam kết hợp aminoglycosid hoặc quinolon.",
      sources: [GPQ("mục 2, 4.3.1, 4.3.2; tr. 67–69")] },
  ],
  reassessment: [
    "Thay đổi kháng sinh theo đáp ứng lâm sàng và kháng sinh đồ.",
    "Thời gian thông thường 10 ngày đến 2 tuần; nặng, vi khuẩn kháng thuốc, trực khuẩn mủ xanh hoặc tụ cầu: có thể tới 3 tuần.",
    "Dẫn lưu đờm mủ: ho khạc, vỗ rung lồng ngực, dẫn lưu tư thế.",
  ],
  branches: {
    "Đợt cấp có bội nhiễm: phối hợp beta-lactam + aminoglycosid": [
      { condition: "Đợt cấp có bội nhiễm, chưa định hướng tác nhân.",
        treatmentImplication: "Penicilin G kết hợp gentamycin hoặc amikacin.",
        sources: [GPQ("mục 4.3.2a; tr. 69")] },
    ],
    "Đợt cấp có bội nhiễm: phối hợp beta-lactam + quinolon": [
      { condition: "Đợt cấp có bội nhiễm; chọn phối hợp với quinolon thay aminoglycosid.",
        treatmentImplication: "Penicilin G kết hợp levofloxacin, moxifloxacin hoặc ciprofloxacin.",
        sources: [GPQ("mục 4.3.2a; tr. 69")] },
    ],
    "Nghi vi khuẩn tiết beta-lactamase": gpqB.betaLactamase,
    "Nghi vi khuẩn Gram-âm": gpqB.gramNeg,
    "Đờm mủ thối (nghi vi khuẩn kỵ khí)": [
      { condition: "Khạc đờm mủ thối.",
        clinicalMeaning: "Gợi ý vi khuẩn kỵ khí.",
        treatmentImplication: "Kết hợp beta-lactam (như các lựa chọn trên) với metronidazol.",
        sources: [GPQ("mục 4.3.2d; tr. 69")] },
    ],
    "Nhiễm khuẩn mắc phải bệnh viện, chưa có kháng sinh đồ": [
      { condition: "Nhiễm khuẩn mắc phải bệnh viện, chưa có kháng sinh đồ.",
        treatmentImplication: "Ceftazidim, piperacilin-tazobactam, imipenem hoặc meropenem; kết hợp aminoglycosid hoặc quinolon, metronidazol.",
        sources: [GPQ("mục 4.3.2e; tr. 69")] },
    ],
    "Nghi tụ cầu": gpqB.staph,
    "Hội chứng xoang phế quản; hoặc tái phát từ 2 đợt cấp/năm": [
      { condition: "Hội chứng xoang phế quản (giãn phế quản + viêm đa xoang mạn), hoặc tái phát từ 2 đợt cấp/năm.",
        treatmentImplication: "Erythromycin uống kéo dài 6–24 tháng; tái phát thường xuyên: cân nhắc macrolid liều thấp dài ngày. Không dùng cùng theophylin (nguy cơ xoắn đỉnh).",
        sources: [GPQ("mục 4.3.4, 4.3.5; tr. 70")] },
    ],
  },
};

/* ---------- Viem phoi cong dong tre em (Chuong 1, tr. 86–90) ---------- */
const VPTE = (loc: string) => Q(`Viêm phổi cộng đồng trẻ em, ${loc}`);
const PED_COMMON: ClinicalCriterion[] = [
  { condition: "Trẻ viêm phổi (sốt, ho, thở nhanh và/hoặc rút lõm lồng ngực).",
    clinicalMeaning: "Khó phân biệt viêm phổi do vi khuẩn hay virus, cấy âm tính cũng không loại trừ vi khuẩn.",
    treatmentImplication: "Dùng kháng sinh cho mọi trẻ viêm phổi (WHO); chọn theo tuổi, miễn dịch, mức độ nặng và tình hình kháng thuốc.",
    sources: [VPTE("mục 5.1, 5.2; tr. 87–88")] },
];
const PED_REASSESS = [
  "Theo dõi sau 2–3 ngày: đỡ thì điều trị đủ liệu trình; không đỡ hoặc nặng thêm thì chuyển bậc điều trị nặng hơn.",
  "Đang tiêm có thể chuyển uống khi bệnh cải thiện nhiều và trẻ uống được.",
];
const PED_PNEUMONIA: DiseaseRationale = {
  common: PED_COMMON,
  reassessment: PED_REASSESS,
  branches: {
    "Trẻ 2 tháng–5 tuổi, viêm phổi (không nặng)": [
      { condition: "Trẻ 2 tháng – 5 tuổi, viêm phổi không có dấu hiệu nặng.",
        clinicalMeaning: "Nguyên nhân hay gặp: phế cầu và H. influenzae. Kháng sinh uống an toàn, hiệu quả.",
        treatmentImplication: "Amoxicilin uống, ít nhất 5 ngày (5–7 ngày); co-trimoxazol ở nơi phế cầu chưa kháng nhiều. Phế cầu kháng cao: tăng liều amoxicilin; H. influenzae, M. catarrhalis sinh beta-lactamase cao: amoxicilin-clavulanat.",
        sources: [VPTE("mục 5.2, 5.3b; tr. 88–89")] },
    ],
    "Trẻ 2 tháng–5 tuổi, viêm phổi nặng": [
      { condition: "Viêm phổi nặng: rút lõm lồng ngực, phập phồng cánh mũi, chưa có dấu hiệu nguy hiểm.",
        treatmentImplication: "Benzyl penicilin hoặc ampicilin; đỡ sau 2–3 ngày thì điều trị đủ 5–10 ngày.",
        sources: [VPTE("mục 4.3, 5.3b; tr. 86, 89")] },
    ],
    "Trẻ 2 tháng–5 tuổi, viêm phổi rất nặng": [
      { condition: "Viêm phổi rất nặng: tím tái nặng, không uống được, li bì, co giật, hôn mê, suy dinh dưỡng nặng.",
        clinicalMeaning: "Thường do Gram âm hoặc tụ cầu nhiều hơn phế cầu, H. influenzae.",
        treatmentImplication: "Benzyl penicilin phối hợp gentamycin (hoặc ampicilin + gentamycin, hoặc chloramphenicol); không đỡ thì đổi công thức hoặc dùng cefuroxim.",
        sources: [VPTE("mục 4.4, 5.2, 5.3b; tr. 86–90")] },
    ],
    "Trẻ 2 tháng–5 tuổi: nghi viêm phổi do tụ cầu": [
      { condition: "Nghi viêm phổi do tụ cầu.",
        treatmentImplication: "Oxacilin kết hợp gentamycin; không có oxacilin thì cephalothin + gentamycin; tụ cầu kháng methicilin cao: vancomycin.",
        sources: [VPTE("mục 5.3b; tr. 90")] },
    ],
    "Trẻ trên 5 tuổi (S. pneumoniae, H. influenzae)": [
      { condition: "Trẻ trên 5 tuổi.",
        clinicalMeaning: "Chủ yếu S. pneumoniae, H. influenzae; sau đó là vi khuẩn không điển hình.",
        treatmentImplication: "Benzyl penicilin, cephalothin, cefuroxim hoặc ceftriaxon; nơi H. influenzae sinh beta-lactamase cao: amoxicilin-clavulanat hoặc ampicilin-sulbactam.",
        sources: [VPTE("mục 5.3c; tr. 90")] },
    ],
    "Trẻ trên 5 tuổi: nghi vi khuẩn không điển hình (Mycoplasma, Chlamydia, Legionella)": [
      { condition: "Nghi viêm phổi không điển hình (Mycoplasma, Chlamydia, Legionella).",
        treatmentImplication: "Erythromycin uống 10 ngày hoặc azithromycin.",
        sources: [VPTE("mục 5.3c; tr. 90")] },
    ],
  },
};
const NEONATAL_PNEUMONIA: DiseaseRationale = {
  common: [
    { condition: "Trẻ sơ sinh và dưới 2 tháng tuổi bị viêm phổi.",
      clinicalMeaning: "Mọi trường hợp đều là nặng, phải vào bệnh viện. Nguyên nhân: liên cầu B, tụ cầu, Gram âm, phế cầu, H. influenzae.",
      treatmentImplication: "Kháng sinh tiêm tại bệnh viện, đợt 5–10 ngày.",
      sources: [VPTE("mục 4.2, 5.2, 5.3a; tr. 86–89")] },
  ],
  reassessment: PED_REASSESS,
  branches: {
    "Viêm phổi trẻ sơ sinh và dưới 2 tháng tuổi (mọi trường hợp đều là nặng, phải vào bệnh viện)": [
      { condition: "Viêm phổi trẻ dưới 2 tháng.",
        treatmentImplication: "Benzyl penicilin, hoặc ampicilin kết hợp gentamycin.",
        sources: [VPTE("mục 5.3a; tr. 89")] },
    ],
    "Viêm phổi rất nặng ở trẻ sơ sinh/dưới 2 tháng": [
      { condition: "Viêm phổi rất nặng ở trẻ dưới 2 tháng.",
        treatmentImplication: "Có thể dùng cefotaxim.",
        sources: [VPTE("mục 5.3a; tr. 89")] },
    ],
  },
};

/* ---------- Viem phoi benh vien (tr. 93–97) va lien quan tho may (tr. 100–106) ---------- */
const VPBV = (loc: string) => Q(`Viêm phổi bệnh viện, ${loc}`);
const VPTM = (loc: string) => Q(`Viêm phổi liên quan thở máy, ${loc}`);
const MDR_RISK = "Kháng sinh trong 90 ngày trước; nằm viện ≥ 5 ngày; nơi có tỷ lệ kháng cao; viêm phổi liên quan chăm sóc y tế.";
const HAP: DiseaseRationale = {
  common: [
    { condition: "Viêm phổi xuất hiện sau nhập viện ít nhất 48 giờ.",
      clinicalMeaning: "Thường do nhiều vi khuẩn phối hợp: Gram âm hiếu khí kháng nhiều thuốc (P. aeruginosa, E. coli, K. pneumoniae, A. baumannii) và MRSA.",
      treatmentImplication: "Chọn theo yếu tố nguy cơ, vi khuẩn tại địa phương, mức độ nặng, tuổi, bệnh kèm; phối hợp khi nghi đa kháng hoặc bệnh nặng; xuống thang khi có kháng sinh đồ.",
      sources: [VPBV("mục 1, 2, 4a; tr. 93–95")] },
  ],
  reassessment: [
    "Thời gian thường 10–14 ngày; tới 21 ngày nếu P. aeruginosa, Acinetobacter, S. maltophilia, MRSA hoặc triệu chứng kéo dài.",
    "Đã xác định căn nguyên: điều trị theo kháng sinh đồ (Bảng II.7 cho vi khuẩn đa kháng).",
  ],
  branches: {
    "VPBV sớm, không nguy cơ vi khuẩn kháng thuốc": [
      { condition: "Khởi phát sớm (< 5 ngày), không có yếu tố nguy cơ vi khuẩn đa kháng.",
        clinicalMeaning: "Thường là vi khuẩn ngoài bệnh viện: S. pneumoniae, H. influenzae, MSSA, Gram âm đường ruột nhạy.",
        treatmentImplication: "Ceftriaxon hoặc cefotaxim; hoặc cefepim, piperacilin-tazobactam, levofloxacin, moxifloxacin.",
        sources: [VPBV("mục 2, Bảng II.6; tr. 94–95")] },
    ],
    "VPBV muộn (có nguy cơ đa kháng) mức độ nhẹ và vừa": [
      { condition: `Khởi phát muộn (≥ 5 ngày) hoặc có nguy cơ đa kháng (${MDR_RISK}); chưa có dấu hiệu nặng.`,
        clinicalMeaning: "Thường là vi khuẩn bệnh viện, đa kháng.",
        treatmentImplication: "Cephalosporin thế hệ 3–4, piperacilin-tazobactam, carbapenem hoặc fluoroquinolon; phối hợp hoặc không với vancomycin hoặc linezolid nếu có hoặc nghi MRSA.",
        sources: [VPBV("mục 2, 4b, Bảng II.6; tr. 94–96")] },
    ],
    "VPBV muộn nặng, phải điều trị tại ICU": [
      { condition: "Muộn, nặng: tụt huyết áp, phải đặt nội khí quản, nhiễm khuẩn huyết, tổn thương X-quang tiến triển nhanh, suy đa tạng.",
        clinicalMeaning: "Có thể gặp P. aeruginosa, Acinetobacter, MRSA, Legionella; cần điều trị tại hồi sức.",
        treatmentImplication: "Beta-lactam kháng Pseudomonas (ceftazidim, cefepim, piperacilin-tazobactam, carbapenem) phối hợp fluoroquinolon hoặc aminoglycosid; thêm vancomycin hoặc linezolid nếu nghi MRSA.",
        sources: [VPBV("mục 3c, 4a, Bảng II.6; tr. 94–97")] },
    ],
  },
};
const VAP: DiseaseRationale = {
  common: [
    { condition: "Nhiễm khuẩn nhu mô phổi sau 48 giờ thở máy.",
      clinicalMeaning: "Tử vong 20–50%, tới 70% khi nhiễm vi khuẩn đa kháng. Sớm (< 5 ngày): MSSA, S. pneumoniae, H. influenzae. Muộn (≥ 5 ngày) hoặc đã dùng kháng sinh: MRSA, P. aeruginosa, A. baumannii, S. maltophilia.",
      treatmentImplication: "Kháng sinh kinh nghiệm sớm, tốt nhất sau khi lấy bệnh phẩm (dịch phế quản, máu); đúng, đủ liều; chỉnh theo đáp ứng và vi sinh.",
      sources: [VPTM("mục 1, 2.1, 4.1; tr. 100, 102–103")] },
  ],
  reassessment: [
    "Đánh giá lại sau 48–72 giờ và tại ngày 3, 5, 7 (CPIS, sốt, PaO2/FiO2, bạch cầu, procalcitonin, đờm, X-quang).",
    "Cải thiện nhanh, cấy âm tính: cân nhắc ngừng hoặc rút ngắn. Có kết quả cấy và cải thiện: xuống thang. Không cải thiện: tìm biến chứng (áp xe, tràn mủ màng phổi), vi khuẩn chưa được bao phủ.",
    "Thời gian: khoảng 7–10 ngày với tụ cầu, H. influenzae; ít nhất 14–21 ngày khi tổn thương nhiều thùy, suy dinh dưỡng, tổn thương hang, hoại tử do Gram âm, P. aeruginosa, Acinetobacter.",
  ],
  branches: {
    "Không có nguy cơ nhiễm vi khuẩn đa kháng": [
      { condition: "Không có yếu tố nguy cơ vi sinh vật đa kháng.",
        clinicalMeaning: "Nhắm MSSA, S. pneumoniae, H. influenzae, Gram âm đường ruột nhạy.",
        treatmentImplication: "Một trong: ceftriaxon, quinolon (levofloxacin, moxifloxacin, ciprofloxacin), ampicilin-sulbactam hoặc ertapenem.",
        sources: [VPTM("mục 4.3a; tr. 103")] },
    ],
    "Có nguy cơ nhiễm vi sinh vật đa kháng": [
      { condition: "Có nguy cơ đa kháng: nhập viện > 2 ngày trong 90 ngày, chăm sóc dài ngày, lọc máu, kháng sinh trong 90 ngày, nằm viện > 5 ngày, suy giảm miễn dịch…",
        clinicalMeaning: "Tập trung vào MRSA, P. aeruginosa, Acinetobacter, Klebsiella, Enterobacter, Serratia, Stenotrophomonas, B. cepacia.",
        treatmentImplication: "Một kháng sinh nhóm A (cefepim, ceftazidim, imipenem, meropenem, piperacilin-tazobactam) kết hợp một nhóm B (ciprofloxacin, levofloxacin hoặc aminoglycosid). Vi khuẩn sinh ESBL: carbapenem + fluoroquinolon.",
        sources: [VPTM("mục 4.3b; tr. 103–104")] },
    ],
    "Có nguy cơ đa kháng – nghi tụ cầu kháng methicilin (thêm nhóm C)": [
      { condition: "Có nguy cơ đa kháng và nghi MRSA.",
        treatmentImplication: "Thêm nhóm C: linezolid, vancomycin hoặc teicoplanin.",
        sources: [VPTM("mục 4.3b; tr. 104")] },
    ],
    "Có nguy cơ đa kháng – nghi nhiễm nấm (thêm nhóm D)": [
      { condition: "Đã dùng kháng sinh phổ rộng > 7 ngày, hoặc suy giảm miễn dịch.",
        clinicalMeaning: "Nấm là nguyên nhân đáng chú ý ở cơ địa này.",
        treatmentImplication: "Thêm nhóm D (thuốc chống nấm); chỉnh theo vi sinh và đáp ứng.",
        sources: [VPTM("mục 2.1, 4.3b; tr. 100, 104")] },
    ],
    "VPLQTM muộn đã khẳng định hoặc có nguy cơ Gram âm đa kháng": [
      { condition: "VPLQTM muộn, đã khẳng định hoặc có nguy cơ Gram âm đa kháng.",
        treatmentImplication: "Colistin kết hợp carbapenem, fluoroquinolon, rifampicin…; không dùng colistin đơn độc.",
        sources: [VPTM("mục 4.3b, Bảng II.9; tr. 104–106")] },
    ],
  },
};

/* ---------- Viem mo bao (Chuong 4, tr. 138–140) ---------- */
const VMB = (loc: string) => Q(`Viêm mô bào, ${loc}`);
const CELLULITIS: DiseaseRationale = {
  common: [
    { condition: "Vùng da sưng, nóng, đỏ, đau, giới hạn không rõ, lan tỏa; có thể sốt.",
      clinicalMeaning: "Thường do liên cầu nhóm A; tụ cầu vàng đơn thuần hoặc phối hợp. Cấy chỉ dương tính khoảng 1/5 trường hợp.",
      treatmentImplication: "Kháng sinh sớm, đúng, đủ liều; chọn thuốc phủ liên cầu và tụ cầu.",
      sources: [VMB("mục 2, 3b, 4a; tr. 138–139")] },
  ],
  reassessment: [
    "Thời gian điều trị ít nhất 10 ngày với mọi phác đồ.",
    "Có viêm tắc tĩnh mạch: kết hợp thuốc chống đông. Tái phát: penicilin kéo dài để phòng tái phát.",
  ],
  branches: {
    "Viêm mô bào": [
      { condition: "Trường hợp nặng: nghi nhiễm khuẩn huyết, viêm khớp, viêm cân cơ.",
        clinicalMeaning: "Nặng có thể hoại tử, áp xe, viêm cân cơ, nhiễm khuẩn huyết, nhất là ở người suy giảm miễn dịch, đái tháo đường, trẻ em.",
        treatmentImplication: "Kháng sinh đường tiêm bắp hoặc tĩnh mạch (penicilin G tĩnh mạch mỗi 6 giờ, hoặc ceftriaxon).",
        sources: [VMB("mục 3a, 4a; tr. 138–139")] },
      { condition: "Trường hợp nhẹ.",
        treatmentImplication: "Có thể dùng đường uống: một trong penicilin, amoxicilin-clavulanat; roxithromycin là lựa chọn khác.",
        sources: [VMB("mục 4a; tr. 139–140")] },
    ],
  },
};

/* ---------- Nhiem trung nang do san khoa (tr. 180–181), Viem am dao (tr. 183–184) ---------- */
const NTSK = (loc: string) => Q(`Nhiễm trùng nặng do sản khoa, ${loc}`);
const POSTPARTUM: DiseaseRationale = {
  common: [
    { condition: "Nhiễm khuẩn hậu sản nặng: viêm tử cung toàn bộ, viêm phúc mạc, nhiễm khuẩn huyết.",
      clinicalMeaning: "Vi khuẩn hay gặp: E. coli, S. aureus, S. pyogenes, Clostridium. Nguy cơ tử vong mẹ cao nếu chậm chẩn đoán, điều trị.",
      treatmentImplication: "Cấy máu, sản dịch, nước tiểu trước kháng sinh; phối hợp kháng sinh phổ rộng khi chưa có kháng sinh đồ.",
      sources: [NTSK("mục 1, 3.1; tr. 180–181")] },
  ],
  reassessment: [
    "Có kháng sinh đồ: điều trị theo kháng sinh đồ.",
    "Giải quyết ổ nhiễm khuẩn; bù dịch, vận mạch khi tụt huyết áp không đáp ứng bù dịch, thở oxy.",
  ],
  branches: {
    "Nhiễm khuẩn hậu sản nặng (viêm tử cung toàn bộ, viêm phúc mạc, nhiễm khuẩn huyết): phối hợp ba kháng sinh": [
      { condition: "Không dị ứng penicilin.",
        treatmentImplication: "Phối hợp ba thuốc: ceftriaxon + azithromycin + metronidazol.",
        sources: [NTSK("mục 3.2a; tr. 181")] },
    ],
    "Nhiễm khuẩn hậu sản nặng – dị ứng penicilin (phương án 1)": [
      { condition: "Dị ứng penicilin.",
        treatmentImplication: "Gentamycin + clindamycin; liều gentamycin tiếp theo dựa vào độ thanh thải của thận.",
        sources: [NTSK("mục 3.2b; tr. 181")] },
    ],
    "Nhiễm khuẩn hậu sản nặng – dị ứng penicilin (phương án 2)": [
      { condition: "Dị ứng penicilin (phương án thay thế).",
        treatmentImplication: "Gentamycin + lincomycin; liều gentamycin tiếp theo dựa vào độ thanh thải của thận.",
        sources: [NTSK("mục 3.2b; tr. 181")] },
    ],
  },
};
const VAD = (loc: string) => Q(`Viêm âm đạo – niệu đạo do vi khuẩn, ${loc}`);
const BV: DiseaseRationale = {
  common: [
    { condition: "Khí hư nhiều, loãng, trắng xám, mùi hôi; pH âm đạo > 4,5, test sniff (+), clue cells ≥ 20%.",
      clinicalMeaning: "Bacterial vaginosis do vi khuẩn kỵ khí (Mobiluncus, M. hominis, Bacteroides, G. vaginalis).",
      treatmentImplication: "Thuốc có tác dụng trên kỵ khí: metronidazol hoặc clindamycin, đường uống hoặc tại chỗ.",
      sources: [VAD("mục 2.2a–d; tr. 184")] },
  ],
  branches: {
    "Viêm âm đạo do Bacterial vaginosis": [
      { condition: "Không có thai.",
        treatmentImplication: "Metronidazol uống 7 ngày; hoặc gel metronidazol 0,75% (5 ngày), gel clindamycin 2% (7 ngày).",
        sources: [VAD("mục 2.2d; tr. 184")] },
    ],
    "Viêm âm đạo do Bacterial vaginosis – phụ nữ có thai": [
      { condition: "Phụ nữ có thai.",
        treatmentImplication: "Clindamycin uống 7 ngày, hoặc gel clindamycin 2% bôi âm đạo 7 ngày.",
        sources: [VAD("mục 2.2d; tr. 184")] },
    ],
  },
};

/* ---------- Mat (Chuong 8, tr. 209–228) ---------- */
const VGM = (loc: string) => Q(`Viêm giác mạc do vi khuẩn, ${loc}`);
const KERATITIS: DiseaseRationale = {
  common: [
    { condition: "Ổ loét giác mạc, đáy hoại tử bẩn, bắt màu fluorescein; đau nhức, sợ ánh sáng, nhìn mờ.",
      clinicalMeaning: "Gram dương: S. aureus, S. pneumoniae, S. epidermidis; Gram âm: P. aeruginosa, Moraxella, H. influenzae. Là nguyên nhân thường gặp gây mù lòa.",
      treatmentImplication: "Nạo ổ loét soi, cấy trước điều trị; theo kháng sinh đồ, chưa xác định thì dùng phổ rộng. Thuốc tra mắt là chính, có thể kết hợp toàn thân.",
      sources: [VGM("mục 1–4a; tr. 213–214")] },
  ],
  reassessment: ["Có kết quả cấy, kháng sinh đồ: chuyển kháng sinh nhạy cảm.", "Nặng: truyền rửa mắt bằng kháng sinh; phối hợp điều trị triệu chứng, biến chứng."],
  branches: {
    "Viêm loét giác mạc do vi khuẩn Gram âm – thuốc tra mắt": [
      { condition: "Soi trực tiếp thấy vi khuẩn Gram âm.",
        treatmentImplication: "Tra tobramycin, neomycin sulfat hoặc polymyxin B.",
        sources: [VGM("mục 4b; tr. 214")] },
    ],
    "Viêm loét giác mạc do vi khuẩn Gram dương hoặc chưa xác định (phổ rộng) – thuốc tra mắt": [
      { condition: "Vi khuẩn Gram dương, hoặc chưa xác định được vi khuẩn.",
        clinicalMeaning: "Fluoroquinolon phổ rộng, dùng được cả cho Gram âm.",
        treatmentImplication: "Tra fluoroquinolon (ofloxacin, levofloxacin, moxifloxacin, gatifloxacin): ngày đầu cách 30 phút, sau đó 10 lần/ngày.",
        sources: [VGM("mục 4b; tr. 214")] },
    ],
    "Viêm loét giác mạc do vi khuẩn – thuốc uống phối hợp": [
      { condition: "Cần kết hợp kháng sinh toàn thân.",
        treatmentImplication: "Cefuroxim acetil hoặc ofloxacin uống 5–7 ngày; nặng có thể phối hợp hai nhóm.",
        sources: [VGM("mục 4b; tr. 214")] },
    ],
  },
};
const VKM = (loc: string) => Q(`Viêm kết mạc cấp, ${loc}`);
const VKMLC = (loc: string) => Q(`Viêm kết mạc do lậu cầu, ${loc}`);
const GONO: ClinicalCriterion[] = [
  { condition: "Viêm kết mạc do lậu cầu: tiết tố mủ rất nhiều, phù mi, nhuộm thấy song cầu Gram âm.",
    clinicalMeaning: "Tiến triển rất nhanh, có thể loét, thủng giác mạc, viêm nội nhãn; kháng beta-lactam và nguy cơ phản ứng penicilin.",
    treatmentImplication: "Ceftriaxon (tổn thương giác mạc: nhập viện, tĩnh mạch, trung bình 7 ngày); hoặc cefotaxim; dị ứng penicilin: ciprofloxacin hoặc ofloxacin uống liều duy nhất. Kèm điều trị tại mắt.",
    sources: [VKMLC("mục 1–4; tr. 211–212")] },
];
const CONJUNCTIVITIS: DiseaseRationale = {
  common: [
    { condition: "Viêm kết mạc cấp do vi khuẩn (tiết tố mủ hoặc tiết tố màng).",
      clinicalMeaning: "Tiết tố mủ: thường do lậu cầu; tiết tố màng: bạch hầu, liên cầu.",
      treatmentImplication: "Nhuộm Gram, nuôi cấy; rửa mắt, bóc màng hằng ngày.",
      sources: [VKM("mục 1–4.1; tr. 209–210")] },
  ],
  reassessment: ["Thuyên giảm: giảm số lần tra mắt.", "Lậu cầu: theo dõi hằng ngày đến khi tiến triển tốt; điều trị bệnh lậu sinh dục nếu có."],
  branches: {
    "Viêm kết mạc cấp do vi khuẩn – điều trị tại mắt khi chưa có kết quả xét nghiệm": [
      { condition: "Chưa có xét nghiệm.",
        treatmentImplication: "Kháng sinh tra phổ rộng: quinolon hoặc thuốc phối hợp (gramicidin/neomycin/polymyxin B), 15–30 phút/lần những ngày đầu. Thận trọng khi dùng corticoid.",
        sources: [VKM("mục 4.1; tr. 210")] },
    ],
    "Viêm kết mạc – chỉ dùng toàn thân khi tiến triển nặng, thường do lậu cầu hoặc bạch hầu (người lớn)": [
      { condition: "Bệnh tiến triển nặng, kèm triệu chứng toàn thân (thường do lậu cầu, bạch hầu).",
        treatmentImplication: "Cephalosporin thế hệ 3 (ceftriaxon, ceftazidim); đường dùng theo tình trạng loét giác mạc.",
        sources: [VKM("mục 4.2; tr. 210")] },
    ],
    "Viêm kết mạc – toàn thân nặng (thay thế)": [
      { condition: "Bệnh nặng, chọn fluoroquinolon uống.",
        treatmentImplication: "Ciprofloxacin hoặc ofloxacin 5 ngày. Chống chỉ định cho trẻ em dưới 16 tuổi.",
        sources: [VKM("mục 4.2; tr. 210")] },
    ],
    "Viêm kết mạc do lậu cầu": GONO,
    "Viêm kết mạc do lậu cầu – thay thế": GONO,
  },
};
const VTCHM = (loc: string) => Q(`Viêm tổ chức hốc mắt, ${loc}`);
const ORBITAL: DiseaseRationale = {
  common: [
    { condition: "Đau hốc mắt đột ngột, lồi mắt, hạn chế vận nhãn, giảm thị lực, sốt.",
      clinicalMeaning: "Do S. aureus, S. pneumoniae, nhóm S. anginosus, Hib, Gram âm; trẻ em hay sau viêm hô hấp trên, viêm xoang. Nguy cơ viêm màng não, tắc xoang hang, nhiễm khuẩn huyết.",
      treatmentImplication: "Điều trị cấp cứu: kháng sinh tĩnh mạch liều cao, phổ rộng khi chờ nuôi cấy; sau đó theo kháng sinh đồ.",
      sources: [VTCHM("mục 2, 4a, 4b; tr. 218–220")] },
  ],
  reassessment: ["Có kết quả cấy, kháng sinh đồ: điều trị theo nguyên nhân.", "Có ổ áp xe: chích dẫn lưu áp xe và xoang viêm; lấy hết dị vật hốc mắt nếu có."],
  branches: {
    "Viêm tổ chức hốc mắt – kháng sinh phổ rộng đường TM liều cao khi chờ nuôi cấy": [
      { condition: "Đang chờ kết quả nuôi cấy.",
        treatmentImplication: "Cephalosporin thế hệ 3: cefotaxim hoặc ceftazidim tĩnh mạch.",
        sources: [VTCHM("mục 4b; tr. 220")] },
    ],
    "Viêm tổ chức hốc mắt – phối hợp": [
      { condition: "Chọn phác đồ phối hợp.",
        treatmentImplication: "Ceftriaxon phối hợp di/flucloxacilin tĩnh mạch.",
        sources: [VTCHM("mục 4b; tr. 220")] },
    ],
    "Viêm tổ chức hốc mắt – chuyển đường uống sau đáp ứng": [
      { condition: "Sau giai đoạn tĩnh mạch.",
        treatmentImplication: "Tiếp theo amoxicilin-clavulanat uống 10 ngày.",
        sources: [VTCHM("mục 4b; tr. 220")] },
    ],
    "Viêm tổ chức hốc mắt – quá mẫn penicilin hoặc nghi/cấy MRSA": [
      { condition: "Quá mẫn penicilin, hoặc nghi hoặc cấy ra tụ cầu kháng methicilin.",
        treatmentImplication: "Hội chẩn chuyên khoa truyền nhiễm, vi sinh; vancomycin truyền tĩnh mạch chậm.",
        sources: [VTCHM("mục 4b; tr. 220")] },
    ],
  },
};
const VMNN = (loc: string) => Q(`Viêm mủ nội nhãn sau vết thương xuyên nhãn cầu, ${loc}`);
const ENDOPHTHALMITIS: DiseaseRationale = {
  common: [
    { condition: "Viêm nội nhãn nghi do nhiễm khuẩn.",
      clinicalMeaning: "CẦN THẨM ĐỊNH: QĐ 708 chỉ có bài viêm mủ nội nhãn sau vết thương xuyên nhãn cầu; ứng dụng đang dùng bài này cho viêm nội nhãn sau phẫu thuật.",
      sources: [VMNN("mục 1; tr. 222")] },
    { condition: "Nghi viêm mủ nội nhãn.",
      clinicalMeaning: "Kháng sinh đồ chỉ có sau vài ngày; kháng sinh phải thấm tốt vào dịch kính mà không độc với mô nội nhãn. Tiêm nội nhãn là cách dùng hiệu quả nhất.",
      treatmentImplication: "Dùng kháng sinh ngay khi nghi ngờ, phổ rộng hoặc phối hợp; lấy thủy dịch hoặc dịch kính soi, cấy. Phối hợp corticoid và cắt dịch kính.",
      sources: [VMNN("mục 3.2, 4; tr. 222–223")] },
  ],
  reassessment: ["Theo kết quả nuôi cấy và kháng sinh đồ.", "Nghi nấm: thuốc chống nấm theo mục 4.2."],
  branches: {
    "Viêm mủ nội nhãn (sau vết thương xuyên nhãn cầu) – vi khuẩn Gram dương": [
      { condition: "Vi khuẩn Gram dương.",
        treatmentImplication: "Vancomycin (tác dụng tốt trên Gram dương): tra, tiêm nội nhãn, cạnh nhãn cầu hoặc toàn thân.",
        sources: [VMNN("mục 4.1a; tr. 223")] },
    ],
    "Viêm mủ nội nhãn – vi khuẩn Gram âm (kháng sinh đầu tay để tiêm nội nhãn)": [
      { condition: "Vi khuẩn Gram âm.",
        treatmentImplication: "Ceftazidim là kháng sinh đầu tay để tiêm nội nhãn.",
        sources: [VMNN("mục 4.1b; tr. 223")] },
    ],
    "Viêm mủ nội nhãn – Gram âm, lựa chọn thứ hai sau ceftazidim (đặc biệt chủng kháng gentamycin, tobramycin; trực khuẩn mủ xanh)": [
      { condition: "Gram âm kháng gentamycin, tobramycin; hoặc trực khuẩn mủ xanh.",
        treatmentImplication: "Amikacin – lựa chọn thứ hai sau ceftazidim; tác dụng tốt trên trực khuẩn mủ xanh. Trẻ em (trừ sơ sinh, đẻ non): liều như người lớn.",
        sources: [VMNN("mục 4.1c; tr. 223")] },
    ],
    "Viêm mủ nội nhãn – ciprofloxacin (không tác dụng trên kỵ khí)": [
      { condition: "Chọn fluoroquinolon.",
        clinicalMeaning: "Tác dụng trên Pseudomonas, liên cầu, tụ cầu (kể cả MRSA) và hầu hết Gram âm; không tác dụng trên kỵ khí.",
        treatmentImplication: "Ciprofloxacin tra tại chỗ và uống.",
        sources: [VMNN("mục 4.1d; tr. 223")] },
    ],
  },
};
const VTL = (loc: string) => Q(`Viêm túi lệ, ${loc}`);
const DACRYO: DiseaseRationale = {
  common: [
    { condition: "Viêm túi lệ cấp: vùng túi lệ sưng, nóng, đỏ, đau; có thể áp xe.",
      clinicalMeaning: "Vi khuẩn đa dạng: S. epidermidis, S. aureus, S. pneumoniae, P. aeruginosa, H. influenzae, Proteus, kỵ khí.",
      treatmentImplication: "Tốt nhất lấy mủ nuôi cấy, dùng theo kháng sinh đồ; chưa có thì dùng kháng sinh phổ rộng tại mắt và toàn thân.",
      sources: [VTL("mục 2, 4; tr. 227–228")] },
  ],
  reassessment: ["Thời gian 7–10 ngày tùy đáp ứng và mức độ nhiễm khuẩn.", "Có thể chích tháo mủ; sau đợt cấp: bơm thông lệ đạo hoặc mổ nối thông túi lệ mũi."],
  branches: {
    "Viêm túi lệ cấp – tại mắt": [
      { condition: "Điều trị tại mắt.",
        treatmentImplication: "Moxifloxacin nhỏ mắt; có thể dùng quinolon khác (gatifloxacin, levofloxacin).",
        sources: [VTL("mục 4; tr. 228")] },
    ],
    "Viêm túi lệ cấp – toàn thân": [
      { condition: "Điều trị toàn thân.",
        treatmentImplication: "Cefuroxim uống; có thể dùng amoxicilin-clavulanat.",
        sources: [VTL("mục 4; tr. 228")] },
    ],
  },
};

export const RATIONALE_708: Record<string, DiseaseRationale> = {
  "v8-84": KERATITIS,
  "v8-83": CONJUNCTIVITIS,
  "v8-87": ORBITAL,
  "v8-85": ENDOPHTHALMITIS,
  "v8-88": DACRYO,
  "v8-27": CELLULITIS,
  "v8-107": CELLULITIS,
  "v8-92": POSTPARTUM,
  "v8-95": BV,
  "v8-4": HAP,
  "v8-5": VAP,
  "v8-101": PED_PNEUMONIA,
  "v8-102": NEONATAL_PNEUMONIA,
  "v8-9": LUNG_ABSCESS,
  "v8-10": BRONCHIECTASIS,
  "v8-24": BILIARY,
  "v8-21": PERITONITIS,
  "v8-26": DIARRHEA,
  "v8-25": CDIFF,
  "v8-39": ENDOCARDITIS,
  "v8-17": PYELO,
  "v8-2": STONE,
  "v8-16": CYSTITIS,
  "v8-97": UTI_PREGNANCY,
  "v8-36": MENINGITIS_ADULT,
  "v8-104": MENINGITIS_CHILD,
  "v8-38": SHUNT,
  "v8-11": SEPSIS,
  "v8-12": SEPSIS,
  "v8-14": pick(SEPSIS_PATHOGEN, [ENTERO, ESBL, PSA]),
  "v8-13": pick(SEPSIS_PATHOGEN, ["Staphylococcus aureus nhạy methicilin (MSSA)", "Staphylococcus aureus kháng methicilin (MRSA)"]),
  "v8-43": pick(SEPSIS_PATHOGEN, [ESBL]),
  "v8-46": pick(SEPSIS_PATHOGEN, [PSA]),
  "v8-113": NEUTROPENIA,
  "v8-116": NEUTROPENIA,
};
