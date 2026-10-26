/*
  FILE: data/antibiotics/empiric/comparison.ts

  SO SANH BYT – QUOC TE (Tab 3). Moi nhan dinh chi dua tren noi dung DANG HIEN THI
  o Tab 1 (BYT / Viet Nam) va Tab 2 (quoc te) cua cung mat benh. Khong suy ra phac do
  moi, khong chon nguon thay nguoi dung. Viet ngay 25/10/2026.
*/

export type Comparison = {
  diseaseId: string;
  vn: string;
  intl: string;
  similar: string[];
  different: string[];
  conditions: string[];
};

const LOCAL_RULE =
  "Ưu tiên văn bản BYT hiện hành; khuyến cáo quốc tế dùng để đối chiếu, bổ sung tình huống BYT chưa bao phủ. Đối chiếu antibiogram BV199 và danh mục thuốc BV199; Hội đồng Thuốc và Điều trị BV199 quyết định khi hai nguồn khác nhau.";

export const COMPARISONS: Comparison[] = [
  {
    diseaseId: "v8-1",
    vn: "QĐ 2147/QĐ-BYT (2026) – module CAP",
    intl: "ATS/IDSA 2019",
    similar: [
      "Cùng phân tầng: ngoại trú nguy cơ thấp, ngoại trú có bệnh đồng mắc/nguy cơ, nội trú không ICU, CAP nặng/ICU.",
      "Ngoại trú nguy cơ thấp: amoxicillin 1 g mỗi 8 giờ, doxycyclin 100 mg mỗi 12 giờ; macrolid đơn trị có điều kiện về tỷ lệ phế cầu kháng macrolid.",
      "Ngoại trú có bệnh đồng mắc: beta-lactam (amoxicillin/acid clavulanic, cefpodoxim 200 mg mỗi 12 giờ) + macrolid hoặc doxycyclin; hoặc quinolon hô hấp đơn trị.",
      "Nội trú: beta-lactam (ceftriaxon 1–2 g mỗi 24 giờ, cefotaxim 1–2 g mỗi 8 giờ, ampicillin/sulbactam, ceftarolin 600 mg mỗi 12 giờ) + macrolid, hoặc quinolon hô hấp.",
      "Chống MRSA và chống Pseudomonas chỉ thêm khi có nguy cơ; liều piperacillin/tazobactam 4,5 g mỗi 6 giờ, cefepim 2 g mỗi 8 giờ, ceftazidim 2 g mỗi 8 giờ, linezolid 600 mg mỗi 12 giờ trùng nhau.",
    ],
    different: [
      "Ngưỡng kháng macrolid: ATS/IDSA ghi số cụ thể (< 25%); module BYT ghi định tính (không dùng thường quy khi tỷ lệ kháng cao hoặc không có dữ liệu địa phương).",
      "Module BYT có thêm ertapenem (nội trú), cefdinir/cefditoren (ngoại trú), teicoplanin (chống MRSA) và phối hợp aminoglycosid; Bảng 3–4 của ATS/IDSA không nêu các thuốc này.",
      "ATS/IDSA có cefuroxim 500 mg x 2 lần/ngày, gemifloxacin và aztreonam; module BYT không có.",
      "ATS/IDSA: với nguy cơ MRSA/Pseudomonas do nhập viện và dùng kháng sinh tiêm gần đây, ca không nặng chỉ cấy và chờ kết quả trước khi bao phủ; đối chiếu tiêu chí riêng trong module BYT.",
    ],
    conditions: [
      "ATS/IDSA xây dựng theo dịch tễ đề kháng Hoa Kỳ; ngưỡng 25% cần đối chiếu dữ liệu kháng macrolid tại Việt Nam/BV199.",
      LOCAL_RULE,
    ],
  },
  {
    diseaseId: "v8-4",
    vn: "QĐ 708 Bảng II.6 (2015); khuyến cáo Hội Hô hấp VN & Hội HSCC-CĐ VN 2023 (module)",
    intl: "ATS/IDSA 2016",
    similar: [
      "Piperacillin-tazobactam, cefepim, levofloxacin, imipenem, meropenem có trong cả QĐ 708 (VPBV sớm – thay thế; VPBV muộn) và danh sách ATS/IDSA cho ca không nguy cơ tử vong cao.",
      "Nghi MRSA: vancomycin hoặc linezolid ở cả hai.",
      "Nặng/nguy cơ đa kháng: phối hợp hai thuốc có tác dụng trên Pseudomonas (QĐ 708: beta-lactam + quinolon hoặc aminoglycosid).",
    ],
    different: [
      "QĐ 708 phân nhóm theo khởi phát sớm/muộn; ATS/IDSA ưu tiên yếu tố nguy cơ đa kháng hơn thời điểm khởi phát.",
      "QĐ 708 chọn ceftriaxon hoặc cefotaxim đầu tay cho VPBV sớm; danh sách ATS/IDSA không có ceftriaxon.",
      "Module Hội 2023 phân nhóm theo mức độ nặng, nguy cơ đa kháng và MRSA – gần với cách tiếp cận của ATS/IDSA.",
      "Liều (QĐ 708 Bảng II.6 so với ATS/IDSA Table 4): piperacilin-tazobactam 4,5 g mỗi 8 giờ (VPBV sớm – thay thế) so với mỗi 6 giờ; cefepim 1–2 g mỗi 12 giờ (VPBV sớm) hoặc mỗi 8–12 giờ (VPBV muộn) so với 2 g mỗi 8 giờ; imipenem 500 mg mỗi 8 giờ và meropenem 500 mg mỗi 8 giờ (VPBV muộn nhẹ–vừa) so với imipenem 500 mg mỗi 6 giờ và meropenem 1 g mỗi 8 giờ; vancomycin 1 g mỗi 12 giờ so với 15 mg/kg mỗi 8–12 giờ, cân nhắc liều nạp 25–30 mg/kg (đồng thuận vancomycin 2020: đích AUC24/MIC 400–600, giả định MIC 1 mg/L).",
      "Liều trùng nhau: levofloxacin 750 mg mỗi 24 giờ, ciprofloxacin 400 mg mỗi 8 giờ, amikacin 15–20 mg/kg mỗi 24 giờ, gentamycin/tobramycin 5–7 mg/kg mỗi 24 giờ, linezolid 600 mg mỗi 12 giờ, ceftazidim 2 g mỗi 8 giờ (VPBV muộn nặng); meropenem 1 g mỗi 8 giờ ở nhóm ICU.",
      "Thời gian: QĐ 708 10–14 ngày, có thể tới 21 ngày; ATS/IDSA 2016 mục XXII: 7 ngày, điều chỉnh theo đáp ứng lâm sàng, X-quang và xét nghiệm.",
      "ATS/IDSA có aztreonam 2 g mỗi 8 giờ (dị ứng beta-lactam nặng); QĐ 708 Bảng II.6 không có.",
    ],
    conditions: [
      "ATS/IDSA 2016 xây dựng theo dịch tễ Hoa Kỳ; ngưỡng MRSA 20% có thể điều chỉnh theo dữ liệu đơn vị.",
      LOCAL_RULE,
    ],
  },
  {
    diseaseId: "v8-5",
    vn: "QĐ 708 (2015) mục 4.3 + Bảng II.9; khuyến cáo Hội 2023 (module)",
    intl: "ATS/IDSA 2016",
    similar: [
      "Có nguy cơ đa kháng: QĐ 708 phối hợp Nhóm A (beta-lactam chống Pseudomonas) + Nhóm B (fluoroquinolon hoặc aminoglycosid); ATS/IDSA dùng hai thuốc chống P. aeruginosa khác nhóm.",
      "Nghi MRSA: linezolid hoặc vancomycin ở cả hai (QĐ 708 có thêm teicoplanin).",
      "Bộ chọn nhanh của module Hội 2023 dùng ngưỡng đơn vị 10% Gram âm kháng thuốc, giống ATS/IDSA.",
    ],
    different: [
      "QĐ 708 nhóm không nguy cơ đa kháng có ceftriaxon, ampicilin-sulbactam, ertapenem; ATS/IDSA yêu cầu mọi phác đồ VAP kinh nghiệm bao phủ P. aeruginosa.",
      "ATS/IDSA khuyên tránh aminoglycosid và colistin khi có thuốc thay thế; QĐ 708 có aminoglycosid trong Nhóm B và colistin cho VAP muộn đa kháng.",
      "ATS/IDSA nêu ngưỡng MRSA > 10–20% tại đơn vị; QĐ 708 không nêu ngưỡng.",
      "QĐ 708 có Nhóm D (thuốc kháng nấm) khi kháng sinh phổ rộng > 7 ngày hoặc suy giảm miễn dịch; mục ATS/IDSA đã trích không đề cập.",
      "Liều (QĐ 708 Bảng II.9 so với ATS/IDSA Table 3): vancomycin 1 g mỗi 12 giờ (tới 1,5 g mỗi 12 giờ khi CrCl ≥ 90; đáy 10–20 mg/L) so với 15 mg/kg mỗi 8–12 giờ, cân nhắc liều nạp 25–30 mg/kg (đồng thuận 2020: đích AUC24/MIC 400–600, giả định MIC 1 mg/L); gentamycin/tobramycin 3–5 mg/kg (tới 7) so với 5–7 mg/kg; ciprofloxacin 400 mg mỗi 8–12 giờ so với mỗi 8 giờ; cefepim, ceftazidim 1–2 g và meropenem 0,5–1 g mỗi 8 giờ so với cefepim/ceftazidim 2 g và meropenem 1 g mỗi 8 giờ.",
      "Colistin: Bảng II.9 không ghi số liều; ATS/IDSA Table 3 ghi 5 mg/kg liều nạp, duy trì 2,5 mg x (1,5 x CrCl + 30) mỗi 12 giờ [mg CBA]. Ứng dụng đang hiển thị liều colistin theo DTQG 2023 [MIU]. Hai đơn vị khác nhau (MIU, mg CBA, mg CMS); ứng dụng không quy đổi, không cộng gộp – xem \"ĐỐI CHIẾU LIỀU – Colistin\".",
      "Liều trùng nhau: piperacilin-tazobactam 4,5 g mỗi 6 giờ, imipenem 500 mg mỗi 6 giờ, levofloxacin 750 mg mỗi 24 giờ, amikacin 15–20 mg/kg mỗi 24 giờ, linezolid 600 mg mỗi 12 giờ.",
      "Thời gian: QĐ 708 khoảng 7–10 ngày, kéo dài 14–21 ngày với P. aeruginosa, Acinetobacter, hoại tử; ATS/IDSA 2016 mục XXI: 7 ngày (khuyến cáo mạnh), có thể dài hơn tùy đáp ứng.",
      "ATS/IDSA mục XIV gợi ý thêm kháng sinh khí dung khi Gram âm chỉ còn nhạy aminoglycosid/polymyxin; QĐ 708 mục 4.3 không đề cập.",
    ],
    conditions: [LOCAL_RULE],
  },
  ...["v8-11", "v8-12"].map<Comparison>((diseaseId) => ({
    diseaseId,
    vn: "QĐ 708 (2015) mục 4.1.2 + Bảng II.10, II.11",
    intl: "Surviving Sepsis Campaign 2026; đồng thuận vancomycin ASHP/IDSA 2020",
    similar: [
      "Dùng kháng sinh sớm: QĐ 708 \"ngay trong giờ đầu\"; SSC 2026 dùng ngay, lý tưởng trong 1 giờ khi có thể sốc hoặc sepsis có khả năng.",
      "Xuống thang khi có kết quả vi sinh ở cả hai.",
    ],
    different: [
      "SSC 2026 không đưa phác đồ thuốc/liều; QĐ 708 có phác đồ theo ổ nhiễm, nguy cơ nhiễm khuẩn bệnh viện và miễn dịch.",
      "SSC 2026: không thường quy kháng nấm kinh nghiệm; QĐ 708 cân nhắc bổ sung kháng nấm khi sốt kéo dài tới 96 giờ ở người giảm bạch cầu hạt.",
      "SSC 2026: chỉ bao phủ đa kháng hoặc kỵ khí khi có nguy cơ; QĐ 708 nhóm (a) phối hợp beta-lactam với quinolon hoặc aminoglycosid ngay từ đầu.",
      "SSC 2026 khuyến cáo truyền kéo dài beta-lactam sau liều nạp; Bảng II.11 ghi piperacilin-tazobactam mỗi 8 giờ truyền TM, chỉ ertapenem và imipenem ghi truyền 3–4 giờ.",
      "SSC 2026 nêu khung thời gian 3 giờ cho ca có thể sepsis nhưng không sốc; QĐ 708 không phân biệt.",
      "Lựa chọn kháng sinh: SSC 2026 chỉ bao phủ tác nhân đa kháng khi nguy cơ cao (nêu rõ yếu tố nguy cơ), dùng xét nghiệm chẩn đoán nhanh theo từng ca và TDM theo từng ca; QĐ 708 chọn phác đồ theo nguy cơ nhiễm khuẩn bệnh viện, ổ nhiễm và tình trạng miễn dịch.",
      "Xuống thang: hai nguồn cùng khuyến cáo khi có kết quả vi sinh; SSC 2026 khuyến cáo thêm xuống thang khi cấy cuối cùng âm tính và ngừng kháng sinh kinh nghiệm khi đã có chẩn đoán không nhiễm khuẩn.",
      "Vancomycin (nghi MRSA): QĐ 708 1 g mỗi 12 giờ, theo dõi đáy (Bảng II.9: 10–20 mg/L); đồng thuận 2020: 15–20 mg/kg mỗi 8–12 giờ, đích AUC24/MIC 400–600 (giả định MIC 1 mg/L), có thể nạp 20–35 mg/kg (tối đa 3.000 mg), không còn theo dõi chỉ bằng đáy 15–20 mg/L.",
      "Liều BYT khác nguồn quốc tế (piperacilin-tazobactam, cefepim, carbapenem, colistin): xem mục \"ĐỐI CHIẾU LIỀU\" trong Lưu ý của từng phương án ở tab BYT. Liều IDSA AMR 2026 chỉ dùng khi đã xác định/nghi tác nhân kháng thuốc, không phải phác đồ kinh nghiệm.",
    ],
    conditions: [LOCAL_RULE],
  })),
  {
    diseaseId: "v8-2",
    vn: "QĐ 708 (2015) – mục Sỏi thận tiết niệu có biến chứng nhiễm khuẩn",
    intl: "IDSA cUTI 2025 (Bảng 1.1, 2.1, 1.2); EAU 2026 (NKTN toàn thân). ESBL (theo tác nhân): xem mặt bệnh Enterobacterales sinh ESBL",
    similar: [
      "Cephalosporin thế hệ 3 (cefotaxim, ceftriaxon) và fluoroquinolon có trong cả phác đồ QĐ 708 và nhóm ưu tiên IDSA 2025.",
    ],
    different: [
      "Phác đồ BYT gắn với mặt bệnh này là mục sỏi thận tiết niệu có biến chứng nhiễm khuẩn; QĐ 708 không có mục NKTN phức tạp riêng. Kiểu hình ESBL đã tách sang mặt bệnh \"Enterobacterales sinh ESBL\" (theo tác nhân).",
      "QĐ 708 có amoxicilin/ampicilin, cefuroxim, norfloxacin, ofloxacin; IDSA 2025 không đưa các thuốc này vào nhóm ưu tiên ban đầu.",
      "IDSA 2025 phân theo có/không sepsis (carbapenem chỉ ưu tiên khi có sepsis), tránh fluoroquinolon nếu đã dùng trong 12 tháng.",
      "Thời gian: QĐ 708 10–14 ngày (beta-lactam) và 3–7 ngày, có thể tới 10 ngày (fluoroquinolon uống); IDSA 2025: 5–7 ngày fluoroquinolon hoặc 7 ngày thuốc khác.",
      "Liều: QĐ 708 ceftriaxon 1 g/ngày, cefuroxim 250 mg x 2 lần/ngày uống, ciprofloxacin 250–500 mg x 2 lần/ngày; IDSA 2025 Bảng 2.1 (liều dùng trong thử nghiệm) ceftriaxon 1–2 g/ngày, Bảng 1.2 cefuroxim 500 mg mỗi 12 giờ, ciprofloxacin 500–750 mg mỗi 12 giờ.",
      "Tắc nghẽn/người bệnh nặng: EAU 2026 – giải quyết tắc nghẽn và dùng carbapenem (imipenem 500 mg mỗi 6 giờ hoặc meropenem 1 g mỗi 8 giờ) ± thuốc chống MRSA; QĐ 708 nêu giải phóng tắc nghẽn do sỏi là điều trị nguyên nhân, không nêu phác đồ cho ca nặng.",
      "Fluoroquinolon kinh nghiệm: EAU 2026 – không dùng cho người bệnh khoa tiết niệu hoặc đã dùng trong 6 tháng, chỉ khi kháng < 10%; IDSA 2025 – tránh nếu đã dùng trong 12 tháng; QĐ 708 cho dùng fluoroquinolon uống (gồm norfloxacin, ofloxacin) không kèm điều kiện này.",
      "Kinh nghiệm và theo tác nhân: phác đồ IDSA AMR 2026 cho ESBL-E là điều trị theo kháng sinh đồ, không dùng làm phác đồ kinh nghiệm.",
    ],
    conditions: [LOCAL_RULE],
  },
  {
    diseaseId: "v8-17",
    vn: "QĐ 708 (2015) – Viêm thận bể thận cấp",
    intl: "IDSA cUTI 2025 (Bảng 1.1, 2.1, 1.2); EAU 2026 (Bảng 5–6)",
    similar: [
      "Cephalosporin thế hệ 3, carbapenem, fluoroquinolon có trong cả QĐ 708 và nhóm ưu tiên IDSA 2025.",
    ],
    different: [
      "QĐ 708 có amoxicilin, amoxicilin-clavulanat, norfloxacin, ofloxacin đường uống; các thuốc này không thuộc nhóm ưu tiên ban đầu của IDSA 2025.",
      "IDSA 2025 dành carbapenem cho ca có sepsis; QĐ 708 liệt kê carbapenem không phân theo sepsis.",
      "Thời gian: QĐ 708 7–14 hoặc 10–14 ngày; IDSA 2025: 5–7 ngày fluoroquinolon hoặc 7 ngày thuốc khác, 7 ngày nếu có nhiễm khuẩn huyết Gram âm.",
      "QĐ 708 còn ghi “kháng sinh duy trì 3 tuần kể cả khi lâm sàng cải thiện nhanh”; EAU 2026: thai kỳ tổng 7–10 ngày, beta-lactam 7–10 ngày, fluoroquinolon 5–7 ngày; nam giới có sốt tối thiểu 2 tuần.",
      "Đường uống: QĐ 708 có amoxicilin 500 mg x 3 lần/ngày, amoxicilin-clavulanat 500/62,5 mg x 3, cefuroxim 250 mg x 2 lần/ngày; EAU 2026 chỉ khuyến cáo fluoroquinolon và cephalosporin (cefpodoxim 200 mg x 2, ceftibuten 400 mg x 1) hoặc TMP-SMX; IDSA 2025 Bảng 1.2 ghi kết quả kém hơn khi chuyển sang beta-lactam uống, cefuroxim 500 mg mỗi 12 giờ.",
      "Đường tiêm: QĐ 708 ceftriaxon 1–2 g/ngày, cefotaxim 1 g x 3; EAU 2026 ceftriaxon 2 g/ngày (liều cao 2 g x 2), cefotaxim 2 g x 3.",
      "Aminoglycosid: QĐ 708 gentamycin/tobramycin 3–5 mg/kg/24 giờ, amikacin 15 mg/kg/24 giờ (phối hợp); EAU 2026 gentamicin 6–7 mg/kg, amikacin 25–30 mg/kg x 1 lần/ngày.",
      "Carbapenem: QĐ 708 imipenem-cilastatin 250–500 mg x 4–3 lần/ngày, meropenem 500 mg x 3; EAU 2026 lựa chọn cuối, chỉ khi có vi khuẩn đa kháng: imipenem 0,5 g x 4 (liều cao 1 g x 4), meropenem 1 g x 3.",
      "Amoxicilin-clavulanat tiêm: QĐ 708 ghi 875/125 mg x 2 lần/ngày TM – hàm lượng này là dạng uống; EAU 2026 và IDSA 2025 không có amoxicilin-clavulanat tiêm trong bảng liều.",
    ],
    conditions: [LOCAL_RULE],
  },
  {
    diseaseId: "v8-27",
    vn: "QĐ 708 (2015) – Viêm mô bào",
    intl: "IDSA SSTI 2014",
    similar: [
      "Nhắm liên cầu là chính (penicilin G, amoxicilin-clavulanat, ceftriaxon trong QĐ 708; IDSA: thuốc có tác dụng trên liên cầu).",
    ],
    different: [
      "IDSA phân tầng theo dấu hiệu toàn thân và yếu tố nguy cơ MRSA, có phác đồ nặng (vancomycin + piperacillin-tazobactam hoặc imipenem/meropenem); QĐ 708 không có phác đồ MRSA/nặng ở mục này.",
      "QĐ 708 ghi thời gian ít nhất 10 ngày; phần IDSA đã trích không nêu thời gian.",
    ],
    conditions: [LOCAL_RULE],
  },
  {
    diseaseId: "v8-28",
    vn: "QĐ 4416/QĐ-BYT (2023) – Nhọt, áp xe da",
    intl: "IDSA SSTI 2014",
    similar: [
      "Trích rạch dẫn lưu ổ áp xe là nền tảng ở cả hai.",
      "Thuốc chống MRSA (vancomycin, trimethoprim/sulfamethoxazol, linezolid) có trong QĐ 4416 cho áp xe do tụ cầu kháng methicilin.",
    ],
    different: [
      "IDSA: không thường quy kháng sinh kèm dẫn lưu ở ca điển hình, quyết định dựa trên SIRS; QĐ 4416 liệt kê kháng sinh toàn thân 7–10 ngày cho nhọt/áp xe.",
    ],
    conditions: [LOCAL_RULE],
  },
  {
    diseaseId: "v9-1",
    vn: "QĐ 1530/QĐ-BYT (2023) – Phụ lục 02",
    intl: "IWGDF/IDSA 2023",
    similar: [
      "Chọn kháng sinh theo mức độ nhiễm trùng, tác nhân nghi ngờ và việc đã dùng kháng sinh gần đây.",
      "Nhiễm trùng nhẹ không yếu tố phức tạp: chỉ nhắm cầu khuẩn Gram dương (QĐ 1530) – tương tự khuyến cáo 14 của IWGDF/IDSA (vùng ôn đới, chưa dùng kháng sinh gần đây).",
      "Cả hai đều không nêu liều cụ thể.",
    ],
    different: [
      "Thời gian nhiễm trùng mô mềm: QĐ 1530 thường 2–4 tuần; IWGDF/IDSA 1–2 tuần, có thể tới 3–4 tuần nếu cải thiện chậm.",
      "Pseudomonas: QĐ 1530 nêu phác đồ cho vết loét ẩm ướt và khí hậu ấm; IWGDF/IDSA chỉ nhắm P. aeruginosa khi đã phân lập trong vài tuần trước ở người nhiễm trùng vừa/nặng sống ở vùng nhiệt đới/cận nhiệt đới.",
      "IWGDF/IDSA có khuyến cáo thời gian điều trị viêm xương (3 tuần sau cắt cụt nhỏ có bờ xương dương tính; 6 tuần nếu không cắt); phần QĐ 1530 đã trích không nêu.",
    ],
    conditions: [
      "Việt Nam thuộc vùng khí hậu nhiệt đới – điều kiện áp dụng khuyến cáo 15 của IWGDF/IDSA cần đánh giá theo từng người bệnh.",
      LOCAL_RULE,
    ],
  },
  {
    diseaseId: "v8-43",
    vn: "QĐ 708 (2015) Bảng II.10",
    intl: "IDSA AMR 2026",
    similar: [
      "Ngoài đường tiết niệu: carbapenem (ertapenem, imipenem, meropenem) là lựa chọn ở cả hai.",
    ],
    different: [
      "IDSA phân theo vị trí: viêm bàng quang và NKTN phức tạp có lựa chọn không phải carbapenem (TMP-SMX, ciprofloxacin, levofloxacin…); QĐ 708 chỉ nêu carbapenem.",
      "Thời gian truyền ertapenem: QĐ 708 ghi 3–4 giờ; IDSA Table 1 ghi 30 phút.",
    ],
    conditions: [LOCAL_RULE],
  },
  {
    diseaseId: "v8-46",
    vn: "QĐ 708 (2015) Bảng II.10 – Pseudomonas aeruginosa",
    intl: "IDSA AMR 2026 – mục 4 (DTR P. aeruginosa)",
    similar: [
      "Không có điểm trùng về thuốc cho chủng DTR: hai nguồn áp dụng cho hai kiểu hình khác nhau.",
    ],
    different: [
      "QĐ 708 dành cho P. aeruginosa còn nhạy: ceftazidim, cefepim, piperacillin-tazobactam (thay thế ciprofloxacin, imipenem-cilastatin, meropenem).",
      "Theo định nghĩa IDSA, chủng DTR không nhạy với tất cả các thuốc trên; IDSA ưu tiên ceftolozan-tazobactam, ceftazidim-avibactam, imipenem-relebactam (cefiderocol thay thế ngoài đường tiết niệu).",
      "Văn bản BYT đang dùng không có phác đồ cho DTR.",
    ],
    conditions: [
      "Chỉ dùng nội dung IDSA khi kháng sinh đồ xác nhận DTR và thuốc mới được làm kháng sinh đồ; kiểm tra thuốc có trong danh mục BV199.",
      LOCAL_RULE,
    ],
  },

  /* ===== Buoc 4D Nhom 3 ===== */
  {
    diseaseId: "v8-39",
    vn: "QĐ 708 (2015) – Viêm nội tâm mạc nhiễm khuẩn, mục 4.2 (tr. 129–130)",
    intl: "ESC 2023 – Bảng khuyến cáo 10 (điều trị kinh nghiệm); đồng thuận vancomycin 2020",
    similar: [
      "Cấy máu nhiều lần (QĐ 708: 3 lần; ESC: 3 bộ cách 30 phút) trước kháng sinh; điều trị sớm, diệt khuẩn, đường tĩnh mạch.",
      "Van nhân tạo sớm: vancomycin 30 mg/kg/ngày chia 2 lần + gentamicin 3 mg/kg/ngày + rifampin 900 mg/ngày (QĐ 708) – ESC 2023 cũng dùng vancomycin + gentamicin + rifampin 900–1200 mg.",
      "Dị ứng penicilin: vancomycin 30 mg/kg/ngày chia 2 lần + gentamicin ở cả hai.",
      "Gentamicin 3 mg/kg/ngày ở cả hai nguồn; trẻ em chia 3 lần ở cả hai.",
    ],
    different: [
      "Van tự nhiên: QĐ 708 ampicilin-sulbactam 12 g/ngày + gentamicin; ESC 2023 ampicilin 12 g/ngày phối hợp ceftriaxon 4 g/ngày hoặc (flu)cloxacilin 12 g/ngày + gentamicin. ESC nêu ampicilin-sulbactam/amoxicilin-clavulanat liên quan tử vong cao hơn cloxacilin/cefazolin khi điều trị kinh nghiệm MSSA.",
      "Gentamicin người lớn: QĐ 708 chia 3 lần/ngày; ESC 2023 1 lần/ngày.",
      "Dị ứng penicilin: QĐ 708 thêm ciprofloxacin; ESC 2023 dùng cefazolin 6 g/ngày hoặc vancomycin + gentamicin, không có ciprofloxacin.",
      "Van nhân tạo sớm: QĐ 708 phối hợp 4 thuốc gồm cefepim 6 g/ngày; ESC 2023 vancomycin hoặc daptomycin 10 mg/kg/ngày + gentamicin + rifampin, không có cefepim.",
      "Trẻ em: QĐ 708 có ciprofloxacin “20–30 mg/24 giờ” (thiếu /kg trong văn bản); ESC 2023 không có ciprofloxacin ở trẻ em.",
      "Vancomycin: QĐ 708 và ESC dùng liều theo cân nặng; đồng thuận 2020 dùng đích AUC24/MIC 400–600 cho MRSA nặng.",
    ],
    conditions: [
      "ESC 2023 xếp các phác đồ kinh nghiệm ở mức IIa/IIb, bằng chứng C. Chuyển sang điều trị theo tác nhân trong 24–48 giờ khi định danh được vi khuẩn.",
      LOCAL_RULE,
    ],
  },
  {
    diseaseId: "v8-33",
    vn: "QĐ 708 (2015) – Viêm khớp nhiễm khuẩn, mục 4.2.1 (tr. 164–165)",
    intl: "PIDS/IDSA 2023 (CHỈ TRẺ EM)",
    similar: [
      "Kinh nghiệm nhắm S. aureus (QĐ 708: oxacilin/nafcilin hoặc clindamycin; PIDS/IDSA: thuốc có tác dụng trên S. aureus, cân nhắc MRSA theo dữ liệu tại chỗ).",
      "Cấy máu, cấy dịch khớp trước kháng sinh; dẫn lưu/rửa khớp khi có mủ hoặc không đáp ứng.",
    ],
    different: [
      "Trẻ 6–48 tháng: PIDS/IDSA khuyến cáo bao phủ K. kingae – vi khuẩn này không nhạy penicilin kháng tụ cầu (oxacilin), kháng vancomycin, thường kháng clindamycin; phác đồ kinh nghiệm QĐ 708 (oxacilin hoặc clindamycin) không bao phủ.",
      "MRSA: QĐ 708 vancomycin 2 g/ngày (liều cố định), daptomycin 4–6 mg/kg, teicoplanin 6 rồi 3 mg/kg; PIDS/IDSA (trẻ em) ưu tiên clindamycin/ceftarolin, vancomycin theo AUC/MIC 400.",
      "Thời gian: QĐ 708 2 tuần (liên cầu, H. influenzae), 3–4 tuần (Gram âm), 4 tuần (MRSA); PIDS/IDSA (trẻ em, không kèm viêm xương, đáp ứng nhanh) 10–14 ngày tổng cộng.",
      "Chuyển đường uống: PIDS/IDSA khuyến cáo chuyển uống khi đáp ứng; QĐ 708 chỉ nêu chuyển ciprofloxacin uống ở nhánh trực khuẩn mủ xanh và lậu cầu.",
      "Corticoid: PIDS/IDSA không dùng; QĐ 708 không đề cập.",
    ],
    conditions: [
      "Nội dung quốc tế chỉ áp dụng trẻ em; người lớn chưa có hướng dẫn quốc tế hiện hành đã xác minh.",
      LOCAL_RULE,
    ],
  },

  /* ===== Buoc 4D Nhom 2 ===== */
  {
    diseaseId: "v8-36",
    vn: "QĐ 708 (2015) Bảng II.19–II.20; QĐ 5642 (2015) tr. 18–20 – hai văn bản cùng hiển thị",
    intl: "WHO 2025 (hướng dẫn) và sổ tay thực hành WHO 2026 (liều)",
    similar: [
      "Kinh nghiệm: ceftriaxon hoặc cefotaxim; thêm ampicilin khi nghi Listeria; thêm vancomycin khi nghi phế cầu kháng thuốc (BYT ở cột thay thế, WHO theo tỷ lệ kháng tại chỗ).",
      "Liều người lớn QĐ 708 (ceftriaxon 4 g/ngày, cefotaxim 8–12 g/ngày, ampicilin 12 g/ngày) gần với WHO (ceftriaxon 2 g mỗi 12 giờ, cefotaxim/ampicilin tối đa 12 g/ngày).",
      "Dexamethason dùng cùng hoặc trước liều kháng sinh đầu, tối đa 4 ngày.",
      "Thời gian theo tác nhân: não mô cầu khoảng 7 ngày, phế cầu 14 ngày (WHO 10–14), Listeria và Gram âm khoảng 3 tuần.",
    ],
    different: [
      "Dexamethason: QĐ 708 0,6 mg/kg/ngày; QĐ 5642 0,4 mg/kg/ngày; WHO 10 mg mỗi 6 giờ (người lớn), ngừng nếu không phải phế cầu/Hib, không dùng khi HIV giai đoạn tiến triển.",
      "QĐ 5642 chỉ có liều theo kg – áp dụng cho người lớn có thể vượt liều tối đa (ceftriaxon > 4 g/ngày, ampicilin > 12 g/ngày).",
      "Nguy cơ Listeria: BYT > 50 tuổi; WHO > 60 tuổi, có thai, các cơ địa suy giảm miễn dịch kể cả đái tháo đường, xơ gan, bệnh thận giai đoạn cuối, rối loạn sử dụng rượu.",
      "Không rõ tác nhân: BYT 10–14 ngày và hết sốt 3 ngày; WHO có thể ngừng sau 7 ngày nếu hồi phục lâm sàng ≥ 48 giờ.",
      "Vancomycin: QĐ 708 30–45 mg/kg/ngày (8–12 giờ), ghi đích đáy \"15–20 mg/ml\" (nghi lỗi in); WHO 15–20 mg/kg mỗi 8–12 giờ, đích đáy 15–20 mg/L, tối đa 4 g/ngày.",
      "WHO cho dùng rifampicin thay vancomycin nơi gánh nặng lao thấp; Việt Nam có gánh nặng lao cao – theo WHO chỉ dùng khi không có/chống chỉ định vancomycin.",
    ],
    conditions: [
      "WHO 2025 áp dụng cho viêm màng não mắc phải cộng đồng; không bao phủ viêm màng não sau phẫu thuật thần kinh/chấn thương (IDSA 2017 – chưa trích).",
      "Ngưỡng phế cầu kháng penicilin/cephalosporin cần lấy từ dữ liệu quốc gia/BV199.",
      LOCAL_RULE,
    ],
  },
  {
    diseaseId: "v8-104",
    vn: "QĐ 708 (2015) Bảng II.19–II.20; QĐ 5642 (2015) tr. 19",
    intl: "WHO 2025 (trẻ > 1 tháng) và sổ tay thực hành WHO 2026 (trẻ > 1 tháng và sơ sinh)",
    similar: [
      "Sơ sinh: ampicilin + cefotaxim hoặc ampicilin + aminoglycosid ở cả hai nguồn (WHO có thêm ceftriaxon 100 mg/kg/ngày).",
      "Trẻ > 1 tháng: ceftriaxon hoặc cefotaxim; ceftriaxon 80–100 (BYT) và 100 mg/kg/ngày (WHO).",
      "Ampicilin trẻ em 300 mg/kg/ngày (QĐ 708) tương đương WHO (50 mg/kg mỗi 4 giờ hoặc 75 mg/kg mỗi 6 giờ).",
    ],
    different: [
      "Corticosteroid ở trẻ sơ sinh: BYT ghi dexamethason chung, không loại trừ sơ sinh; WHO không khuyến cáo ở trẻ sơ sinh.",
      "Aminoglycosid sơ sinh: BYT chia 2–3 lần/ngày; WHO gentamicin 1 lần/ngày (5 mg/kg tuần đầu, 7,5 mg/kg sau tuần đầu).",
      "Ampicilin tuần đầu: QĐ 708 150 mg/kg/ngày (mỗi 8 giờ); WHO 50 mg/kg mỗi 12 giờ.",
      "Cefotaxim trẻ > 1 tháng: QĐ 5642 100–200 mg/kg/ngày thấp hơn QĐ 708 (225–300) và WHO (~300 mg/kg/ngày).",
      "Meropenem: QĐ 708 không khuyến cáo cho trẻ < 3 tháng; WHO có liều sơ sinh 40 mg/kg mỗi 8 giờ.",
      "Vancomycin trẻ em: QĐ 708 60 mg/kg/ngày (mỗi 6 giờ); WHO 15–20 mg/kg mỗi 6–8 giờ, ≤ 750 mg/liều nếu không theo dõi nồng độ.",
      "Thời gian sơ sinh: BYT theo tác nhân; WHO 3 tuần khi điều trị kinh nghiệm.",
    ],
    conditions: [
      "Trẻ non tháng/nhẹ cân < 2 kg: QĐ 708 khuyến cáo liều thấp hơn, khoảng cách dài hơn – không có số cụ thể.",
      LOCAL_RULE,
    ],
  },
  ...["v8-113", "v8-116"].map<Comparison>((diseaseId) => ({
    diseaseId,
    vn: "QĐ 708 (2015) chương Suy giảm miễn dịch, tr. 252–254 (dẫn theo IDSA 2010 – nay ARCHIVED)",
    intl: "ECIL-10 (2025, người lớn huyết học); IPFN 2023 (trẻ em)",
    similar: [
      "Kháng sinh sớm (QĐ 708: lý tưởng trong 60 phút; IPFN: càng sớm càng tốt khi không ổn định).",
      "Đơn trị beta-lactam chống Pseudomonas khởi đầu: cefepim, ceftazidim, piperacilin-tazobactam, carbapenem có ở cả ba nguồn.",
      "Cấy máu trước kháng sinh, kể cả qua catheter; điều chỉnh theo kháng sinh đồ.",
    ],
    different: [
      "ECIL-10 chọn chiến lược leo thang hay xuống thang theo nguy cơ và tỷ lệ kháng; QĐ 708 không phân biệt.",
      "Ceftazidim: ECIL-10 lưu ý tránh khi tỷ lệ ESBL cao; QĐ 708 đặt đầu danh sách.",
      "Phối hợp: QĐ 708 cho thêm aminoglycosid, fluoroquinolon hoặc vancomycin; ECIL-10 chỉ phối hợp aminoglycosid khi bệnh nặng hoặc nghi Gram âm kháng, không có quinolon, không thường quy glycopeptid.",
      "Ngừng kháng sinh: QĐ 708 chờ ANC > 500/µl; ECIL-10 cho ngừng sau ≥ 72 giờ nếu ổn định và hết sốt ≥ 48 giờ, bất kể ANC.",
      "Kháng nấm: chương sốt giảm bạch cầu của QĐ 708 không đề cập (chương sepsis nêu cân nhắc khi sốt tới 96 giờ); IPFN 2023 có tiêu chí ≥ 96 giờ ở nhóm nguy cơ cao.",
      "Colistin: QĐ 708 6 MIU mỗi 8 giờ (18 MIU/ngày) – vượt mức 12 MIU/ngày của Dược thư trong ứng dụng; ECIL-10 không đưa colistin vào lựa chọn khởi đầu.",
    ],
    conditions: [
      "ECIL-10 dành cho ung thư huyết học/ghép tế bào gốc; IPFN 2023 dành cho trẻ em. Nguồn quốc tế không ghi liều.",
      "Nguy cơ thấp (người lớn): QĐ 708 không có phác đồ – thiếu bằng chứng trong ứng dụng.",
      LOCAL_RULE,
    ],
  })),
  {
    diseaseId: "v8-13",
    vn: "QĐ 708 (2015) Bảng II.10 (tr. 121–122) và mục 4.1.2 (MSSA/MRSA)",
    intl: "IDSA/ESCMID 2026 Part 1; đồng thuận vancomycin ASHP/IDSA 2020",
    similar: [
      "Vancomycin là lựa chọn cho MRSA ở cả hai nguồn.",
    ],
    different: [
      "QĐ 708 chỉ nêu thuốc và liều; IDSA/ESCMID 2026 yêu cầu phân tầng nguy cơ, cấy máu kiểm tra tại 48 giờ đến khi âm tính, TTE cho mọi người lớn, TEE khi có yếu tố nguy cơ.",
      "Thời gian: QĐ 708 không nêu; IDSA/ESCMID 2026: 14 ngày tính từ ngày cấy máu sạch khuẩn khi không có ổ nhiễm sâu/di bệnh.",
      "Vancomycin 1 g mỗi 12 giờ (QĐ 708) so với 15–20 mg/kg mỗi 8–12 giờ, đích AUC24/MIC 400–600 (đồng thuận 2020).",
      "Daptomycin 4–6 mg/kg/ngày (QĐ 708) so với 6 mg/kg (nhãn FDA) – đã có cảnh báo riêng.",
    ],
    conditions: [
      "Lựa chọn thuốc MSSA/MRSA của IDSA/ESCMID chưa công bố; IDSA MRSA 2011 đã ARCHIVED.",
      LOCAL_RULE,
    ],
  },
];

export function getComparison(diseaseId: string): Comparison | undefined {
  return COMPARISONS.find((item) => item.diseaseId === diseaseId);
}
