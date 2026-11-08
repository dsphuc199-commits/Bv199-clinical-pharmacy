/*
  FILE: data/antibiotics/empiric/rationale-modules.ts

  Tang 3 – "Vì sao chọn phác đồ này?" cho cac module rieng hien thi o tab Viet Nam:
  - CAP: QĐ 2147/QĐ-BYT (2026) – components/antibiotics/CapByt2026.tsx
  - HAP/VAP: Khuyến cáo VPBV/VPLQTM 2023 (Hội Hô hấp VN, Hội HSCC-CĐ VN) – components/antibiotics/HapVap2023.tsx
  Chi dien giai lai noi dung module da trich (mo ta nhom, yeu to nguy co, ghi chu, vi tri muc/bang/trang).
  Khong them thuoc/lieu. Khoa = id kich ban cua module.
*/

import type { ClinicalCriterion, Rationale } from "./rationale";

const CAP = (loc: string) => `QĐ 2147/QĐ-BYT (2026) – Chẩn đoán và điều trị viêm phổi mắc phải cộng đồng ở người lớn, ${loc}`;
const HV = (loc: string) => `Khuyến cáo VPBV/VPLQTM 2023 (Hội Hô hấp VN, Hội HSCC-CĐ VN), ${loc}`;

const CAP_REASSESS = [
  "Đánh giá đáp ứng sau 48–72 giờ; không cải thiện hoặc xấu hơn: thay đổi phác đồ.",
  "Thời gian: 3–5 ngày sau hết sốt với S. pneumoniae; trung bình 7–10 ngày với viêm phổi không biến chứng; đáp ứng tốt trong 2–3 ngày đầu thường 5–7 ngày; kéo dài hơn khi đáp ứng chậm, S. aureus, Gram âm, biến chứng hoặc suy giảm miễn dịch.",
  "Chuyển đường uống khi cải thiện ho, khó thở, hết sốt 2 lần cách nhau 8 giờ và uống được.",
];
const CAP_COMMON: ClinicalCriterion = {
  condition: "Phân nhóm điều trị theo nơi điều trị, mức độ nặng, bệnh đồng mắc và yếu tố nguy cơ mầm bệnh kháng thuốc.",
  clinicalMeaning: "Mỗi nhóm có danh sách lựa chọn ngang hàng; các phương án trong cùng nhóm thay thế nhau, không ghép đồng thời.",
  treatmentImplication: "Bổ sung oseltamivir khi xét nghiệm cúm dương tính. Liều theo cột liều thường dùng của Phụ lục 1; điều chỉnh theo chức năng thận.",
  sources: [CAP("Mục 5.3, Bảng 5.1, Phụ lục 1; tr. 36–39, 60–63")],
};

const CAP_RATIONALE: Record<string, Rationale> = {
  low: { status: "authored", reassessment: CAP_REASSESS, items: [
    { condition: "Ngoại trú, dưới 65 tuổi, không bệnh đồng mắc, không dùng kháng sinh trong 3 tháng, không nguy cơ mầm bệnh kháng thuốc.",
      clinicalMeaning: "Tác nhân hướng đến chủ yếu là S. pneumoniae; macrolid khi chưa loại trừ M. pneumoniae.",
      treatmentImplication: "Đơn trị: amoxicilin hoặc doxycyclin; azithromycin, clarithromycin có điều kiện.",
      sources: [CAP("Mục 5.3.1; tr. 37–38")] },
    { condition: "Nhiều khả năng H. influenzae.",
      clinicalMeaning: "Gần 50% H. influenzae tại Việt Nam tiết beta-lactamase.",
      treatmentImplication: "Dùng beta-lactam + chất ức chế beta-lactamase đường uống (amoxicilin-clavulanat).",
      sources: [CAP("Mục 5.3.1, Bảng 4.4; tr. 34, 37–38")] },
    { condition: "Dị ứng beta-lactam hoặc macrolid.",
      clinicalMeaning: "Nguồn hạn chế quinolon hô hấp ở nhóm nguy cơ thấp, trừ trường hợp này.",
      treatmentImplication: "Quinolon hô hấp (levofloxacin hoặc moxifloxacin), chọn một thuốc.",
      sources: [CAP("Mục 5.3.1, Bảng 5.1; tr. 37–39")] },
    { condition: "CẦN THẨM ĐỊNH – mốc tuổi 65.",
      clinicalMeaning: "Mô tả nhóm ghi < 65 và > 65 tuổi; người đúng 65 tuổi chưa được xếp rõ. Không tự xếp nhóm chỉ dựa vào tuổi.",
      sources: [CAP("Mục 5.3.1; tr. 37")] },
    CAP_COMMON,
  ] },
  risk: { status: "authored", reassessment: CAP_REASSESS, items: [
    { condition: "Ngoại trú, trên 65 tuổi, hoặc có bệnh đồng mắc (tim, phổi, gan, thận mạn, đái tháo đường, nghiện rượu, ung thư), suy giảm miễn dịch, đã dùng kháng sinh trong 3 tháng, hoặc nguy cơ phế cầu kháng thuốc.",
      clinicalMeaning: "Cần lưu ý phế cầu kháng penicilin, H. influenzae, M. catarrhalis (thường sinh beta-lactamase), S. aureus, Gram âm đường ruột và vi khuẩn không điển hình.",
      treatmentImplication: "Beta-lactam phổ rộng (amoxicilin-clavulanat hoặc cephalosporin uống phổ rộng) kết hợp macrolid hoặc doxycyclin; hoặc quinolon hô hấp đơn trị (có điều kiện). Không ghép hai beta-lactam hoặc hai macrolid.",
      sources: [CAP("Mục 5.3.1; tr. 37–38")] },
    { condition: "CẦN THẨM ĐỊNH – mốc tuổi 65.",
      clinicalMeaning: "Mô tả nhóm ghi < 65 và > 65 tuổi; người đúng 65 tuổi chưa được xếp rõ.",
      sources: [CAP("Mục 5.3.1; tr. 37")] },
    CAP_COMMON,
  ] },
  ward: { status: "authored", reassessment: CAP_REASSESS, items: [
    { condition: "Viêm phổi trung bình – nặng, điều trị nội trú không ở ICU.",
      treatmentImplication: "Cephalosporin (ceftriaxon hoặc cefotaxim) hoặc beta-lactam + ức chế beta-lactamase, kết hợp macrolid; hoặc ertapenem + macrolid/quinolon; hoặc quinolon hô hấp đơn trị (có điều kiện). Ưu tiên truyền tĩnh mạch.",
      sources: [CAP("Mục 5.3.2.1, Bảng 5.1; tr. 38–39")] },
    { condition: "Nghi phế cầu kháng penicilin hoặc MRSA.",
      treatmentImplication: "Ceftarolin ± macrolid.",
      sources: [CAP("Mục 5.3.2.1; tr. 38")] },
    { condition: "Có yếu tố nguy cơ P. aeruginosa hoặc Gram âm đường ruột.",
      treatmentImplication: "Beta-lactam chống Pseudomonas kết hợp macrolid hoặc quinolon; vẫn bao phủ tác nhân không điển hình.",
      sources: [CAP("Mục 5.3.2.1, Bảng 5.1; tr. 38–39")] },
    { condition: "Người bệnh nặng.",
      treatmentImplication: "Nhuộm Gram, cấy đờm trước kháng sinh; cân nhắc multiplex PCR, procalcitonin.",
      sources: [CAP("Mục 5.3.2.1; tr. 38")] },
    CAP_COMMON,
  ] },
  icu: { status: "authored", reassessment: CAP_REASSESS, items: [
    { condition: "Viêm phổi nặng: suy hô hấp cần thở máy, sốc nhiễm khuẩn hoặc nguy cơ tử vong cao.",
      clinicalMeaning: "Cần lưu ý S. aureus và P. aeruginosa.",
      treatmentImplication: "Không chỉ định bao phủ Pseudomonas: beta-lactam phổ rộng (ceftriaxon) kết hợp macrolid (ưu tiên) hoặc quinolon.",
      sources: [CAP("Mục 5.3.2.2, Bảng 5.1; tr. 38–39")] },
    { condition: "Có nguy cơ P. aeruginosa.",
      treatmentImplication: "Beta-lactam chống Pseudomonas + ciprofloxacin hoặc levofloxacin; hoặc + aminoglycosid và azithromycin/clarithromycin.",
      sources: [CAP("Bảng 5.1; tr. 39")] },
    { condition: "Nghi CA-MRSA hoặc chưa loại trừ S. aureus.",
      clinicalMeaning: "Chống MRSA và chống Pseudomonas là hai quyết định độc lập.",
      treatmentImplication: "Bổ sung một thuốc chống MRSA (vancomycin, teicoplanin hoặc linezolid) vào phác đồ nền.",
      sources: [CAP("Mục 5.3.2.2; tr. 38–39")] },
    CAP_COMMON,
  ] },
};

const HV_REASSESS = [
  "Đánh giá đáp ứng sau 48–72 giờ; xuống thang hoặc điều chỉnh theo cấy, kháng sinh đồ và lâm sàng.",
  "Thời gian thông thường 7 ngày nếu không phải vi khuẩn đa kháng và đáp ứng tốt; ngừng dựa vào lâm sàng và procalcitonin.",
  "Không đáp ứng: hội chẩn dược lâm sàng, vi sinh, tìm căn nguyên khác.",
];
const HV_COMMON: ClinicalCriterion = {
  condition: "Viêm phổi bệnh viện hoặc liên quan thở máy tại Việt Nam.",
  clinicalMeaning: "Phần lớn tác nhân là P. aeruginosa và vi khuẩn Gram âm khác.",
  treatmentImplication: "Chọn kháng sinh có tác dụng trên P. aeruginosa và Gram âm; các thẻ là tổ hợp ví dụ theo quy tắc của bảng, không phải thứ tự ưu tiên. Không dùng aminoglycosid hoặc colistin đơn độc.",
  sources: [HV("Bảng 3.1–3.2; tr. 53–63")],
};
const HAP = (loc: string) => HV(`Bảng 3.1 (VPBV), ${loc}`);
const VAP = (loc: string) => HV(`Bảng 3.2 (VPLQTM), ${loc}`);

const HAP_RATIONALE: Record<string, Rationale> = {
  "hap-low": { status: "authored", reassessment: HV_REASSESS, items: [
    { condition: "Không nặng, không có nguy cơ đa kháng (không thở máy, không sốc; không dùng kháng sinh tĩnh mạch trong 90 ngày).",
      treatmentImplication: "Đơn trị một kháng sinh có tác dụng trên P. aeruginosa: piperacilin-tazobactam, cefepim, levofloxacin, imipenem hoặc meropenem (cột 1).",
      sources: [HAP("tr. 53–57")] },
    HV_COMMON,
  ] },
  "hap-mdr": { status: "authored", reassessment: HV_REASSESS, items: [
    { condition: "Nặng (thở máy hoặc sốc nhiễm khuẩn), hoặc có nguy cơ đa kháng.",
      clinicalMeaning: "Nguy cơ tử vong cao hoặc nguy cơ Gram âm, P. aeruginosa đa kháng.",
      treatmentImplication: "Phối hợp hai thuốc có tác dụng trên Gram âm (cột 2), tránh dùng hai beta-lactam.",
      sources: [HAP("tr. 53–57")] },
    HV_COMMON,
  ] },
  "hap-mrsa": { status: "authored", reassessment: HV_REASSESS, items: [
    { condition: "Không nặng nhưng có nguy cơ MRSA.",
      treatmentImplication: "Một thuốc Gram âm nền + một thuốc chống MRSA (vancomycin, teicoplanin hoặc linezolid) (cột 3). Piperacilin-tazobactam, cefepim, levofloxacin, imipenem, meropenem cũng có hiệu quả trên MSSA.",
      sources: [HAP("tr. 53–57")] },
    HV_COMMON,
  ] },
  "hap-mdr-mrsa": { status: "authored", reassessment: HV_REASSESS, items: [
    { condition: "Nặng hoặc nguy cơ đa kháng, đồng thời có nguy cơ MRSA (đơn vị có MRSA > 10% hoặc không có dữ liệu).",
      treatmentImplication: "Hai thuốc Gram âm (không phải hai beta-lactam) + một thuốc chống MRSA.",
      sources: [HAP("tr. 53–57")] },
    HV_COMMON,
  ] },
};
const VAP_RATIONALE: Record<string, Rationale> = {
  "vap-low": { status: "authored", reassessment: HV_REASSESS, items: [
    { condition: "Không có yếu tố nguy cơ đa kháng và đơn vị có < 10% Gram âm kháng thuốc định dùng đơn trị.",
      treatmentImplication: "Đơn trị một thuốc nhóm B có tác dụng trên P. aeruginosa (piperacilin-tazobactam, cefepim, ceftazidim; carbapenem có điều kiện).",
      sources: [VAP("tr. 60–63")] },
    HV_COMMON,
  ] },
  "vap-mdr": { status: "authored", reassessment: HV_REASSESS, items: [
    { condition: "Có một yếu tố nguy cơ đa kháng (kháng sinh tĩnh mạch 90 ngày, sốc, ARDS, nằm viện > 5 ngày, điều trị thay thế thận), đơn vị > 10% kháng hoặc chưa biết tỷ lệ nhạy cảm.",
      treatmentImplication: "Phối hợp hai kháng sinh khác nhóm có tác dụng trên P. aeruginosa và Gram âm (nhóm B + nhóm C).",
      sources: [VAP("tr. 60–63")] },
    { condition: "Đơn vị có A. baumannii kháng carbapenem > 25%, bệnh nặng, không đáp ứng sau 48–72 giờ.",
      treatmentImplication: "Có thể xem xét colistin (không dùng đơn độc).",
      sources: [VAP("tr. 60–63")] },
    HV_COMMON,
  ] },
  "vap-mrsa": { status: "authored", reassessment: HV_REASSESS, items: [
    { condition: "Có một yếu tố nguy cơ đa kháng và đơn vị có MRSA > 10% hoặc không có dữ liệu.",
      treatmentImplication: "Bổ sung một thuốc nhóm A (vancomycin, teicoplanin hoặc linezolid) vào phác đồ Gram âm thích hợp; ba thuốc chỉ khi có cả nguy cơ Gram âm đa kháng và MRSA.",
      sources: [VAP("tr. 60–63")] },
    HV_COMMON,
  ] },
};

export function getModuleRationale(module: "cap" | "hap" | "vap", scenarioId: string): Rationale | undefined {
  const table = module === "cap" ? CAP_RATIONALE : module === "hap" ? HAP_RATIONALE : VAP_RATIONALE;
  return table[scenarioId];
}

export const MODULE_RATIONALE_KEYS = {
  cap: Object.keys(CAP_RATIONALE),
  hap: Object.keys(HAP_RATIONALE),
  vap: Object.keys(VAP_RATIONALE),
};
