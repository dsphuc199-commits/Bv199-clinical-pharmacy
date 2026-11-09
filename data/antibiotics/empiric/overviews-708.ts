/*
  FILE: data/antibiotics/empiric/overviews-708.ts

  Tong quan (Tang 1) + theo doi (Tang 4) cho cac mat benh lay phac do tu QĐ 708/QĐ-BYT (2015).
  Moi y doi chieu nguyen van (so trang in trong `ref`, khong hien inline).
  Khong chua lieu; neu nguon khong neu thoi gian dieu tri thi ghi ro "không quy định", khong tu bo sung.
*/

import type { DiseaseOverviewData } from "./overviews";

const Q = "QĐ 708/QĐ-BYT (02/03/2015)";

/* ---------- Nhiem khuan huyet va soc nhiem khuan ---------- */
const SEPSIS_AGENTS = { label: "Tác nhân thường gặp", points: [
  { text: "Gram âm đường ruột (Salmonella, E. coli, Klebsiella, Serratia, Enterobacter); P. aeruginosa; B. pseudomallei.", ref: "tr. 117" },
  { text: "Gram dương: S. pneumoniae, S. aureus, S. suis.", ref: "tr. 117" },
  { text: "Kỵ khí: C. perfringens, B. fragilis.", ref: "tr. 117" },
] };
const SEPSIS_BEFORE = { label: "Trước kháng sinh", points: [
  { text: "Cấy máu 2 lần (hiếu khí và kỵ khí), tối thiểu 10 ml/mẫu, ở 2 vị trí khác nhau.", ref: "tr. 118" },
  { text: "Không để việc lấy bệnh phẩm trì hoãn kháng sinh quá 45 phút.", ref: "tr. 118" },
  { text: "Catheter mạch máu đặt quá 48 giờ: lấy ít nhất một mẫu qua catheter.", ref: "tr. 118" },
  { text: "Cấy máu âm tính không loại trừ nhiễm khuẩn huyết (khoảng 60% âm tính).", ref: "tr. 118" },
] };
const SEPSIS_SOURCE_CONTROL = [
  { text: "Dẫn lưu ổ áp xe, màng phổi, màng tim, túi mật; lấy sỏi đường mật khi tắc mật.", ref: "tr. 123" },
  { text: "Rút dụng cụ, thiết bị y khoa là đường vào của nhiễm khuẩn nếu có chỉ định.", ref: "tr. 123" },
  { text: "Hồi sức: đề phòng và điều trị sốc, đảm bảo hô hấp, cân bằng nước – điện giải – kiềm toan, lọc máu liên tục khi có chỉ định.", ref: "tr. 123" },
];
const SEPSIS_MONITORING: DiseaseOverviewData["monitoring"] = {
  efficacy: [
    { text: "Sốt, nhịp tim, nhịp thở, ý thức, huyết áp và đáp ứng với bù dịch, thuốc vận mạch.", ref: "tr. 118–119" },
    { text: "Bạch cầu, tiểu cầu, đông máu, PaO2/FiO2, creatinin, bilirubin, men gan, CRP, procalcitonin.", ref: "tr. 118" },
  ],
  reassessment: [
    { text: "Có kết quả cấy và kháng sinh đồ: chuyển kháng sinh phổ hẹp nhạy cảm.", ref: "tr. 119–120" },
    { text: "Giảm bạch cầu hạt, vẫn sốt tới 96 giờ: tìm nhiễm khuẩn bệnh viện, cân nhắc thêm kháng nấm.", ref: "tr. 120" },
    { text: "Bài không quy định thời gian điều trị chung; theo ổ nhiễm khuẩn khởi điểm và tác nhân.", ref: "tr. 119–122" },
  ],
  safety: [
    { text: "Chỉnh liều kháng sinh theo độ thanh thải creatinin ở người bệnh suy thận.", ref: "tr. 120" },
    { text: "Amikacin: liều có thể thay đổi theo kết quả theo dõi nồng độ thuốc trong máu (TDM).", ref: "tr. 122" },
  ],
};
const SEPSIS: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 2, Nhiễm khuẩn huyết và sốc nhiễm khuẩn`,
  cards: [
    SEPSIS_AGENTS,
    SEPSIS_BEFORE,
    { label: "Khởi trị", points: [
      { text: "Ngay trong giờ đầu khi nghĩ đến nhiễm khuẩn huyết, sau khi cấy máu.", ref: "tr. 119" },
      { text: "Kinh nghiệm phổ rộng theo chiến lược xuống thang; phối hợp nếu cần; ưu tiên tĩnh mạch.", ref: "tr. 119" },
    ] },
    { label: "Phân nhánh lựa chọn", points: [
      { text: "Chưa rõ ổ nhiễm khuẩn: theo miễn dịch, giảm bạch cầu hạt và nguy cơ nhiễm khuẩn bệnh viện.", ref: "tr. 119–120" },
      { text: "Có ổ nhiễm khuẩn chỉ điểm: theo vị trí (gan mật, tiêu hóa, sinh dục nữ, da, dụng cụ mạch máu).", ref: "tr. 120–121" },
      { text: "Đã biết vi khuẩn: theo Bảng II.10.", ref: "tr. 121–122" },
    ] },
  ],
  sourceControl: SEPSIS_SOURCE_CONTROL,
  monitoring: SEPSIS_MONITORING,
};
const SEPSIS_PATHOGEN: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 2, Nhiễm khuẩn huyết và sốc nhiễm khuẩn, Bảng II.10`,
  cards: [
    SEPSIS_AGENTS,
    SEPSIS_BEFORE,
    { label: "Lựa chọn theo vi khuẩn", points: [
      { text: "Kháng sinh chọn theo vi khuẩn gây bệnh đã xác định, gồm kháng sinh lựa chọn và thay thế.", ref: "tr. 121" },
      { text: "Nguy cơ vi khuẩn sinh ESBL: dùng carbapenem.", ref: "tr. 120" },
    ] },
    { label: "Đánh giá lại", points: [
      { text: "Theo kháng sinh đồ, ưu tiên phổ hẹp nhạy cảm.", ref: "tr. 119–120" },
    ] },
  ],
  sourceControl: SEPSIS_SOURCE_CONTROL,
  monitoring: SEPSIS_MONITORING,
};

/* ---------- Sot giam bach cau hat trung tinh ---------- */
const NEUTROPENIA: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 11, Suy giảm miễn dịch (giảm bạch cầu hạt trung tính và sau ghép tủy)`,
  cards: [
    { label: "Định nghĩa và nguy cơ", points: [
      { text: "Sốt > 38 °C (miệng) một lần, hoặc > 38 °C liên tục ít nhất 1 giờ; ANC < 500 tế bào/µl.", ref: "tr. 252" },
      { text: "Nguy cơ cao: ANC < 500 kéo dài > 7 ngày, bệnh kèm, rối loạn chức năng gan thận, hoặc MASCC < 21.", ref: "tr. 253" },
    ] },
    { label: "Tác nhân thường gặp", points: [
      { text: "Gram âm: E. coli, Klebsiella, Enterobacter, P. aeruginosa, Acinetobacter, Proteus, S. maltophilia.", ref: "tr. 254" },
      { text: "Gram dương: tụ cầu coagulase âm tính, S. aureus, Enterococcus, liên cầu viridans, S. pneumoniae, S. pyogenes, Listeria.", ref: "tr. 254" },
    ] },
    { label: "Trước kháng sinh", points: [
      { text: "Cấy máu 2 vị trí: tĩnh mạch ngoại biên và catheter (nếu có).", ref: "tr. 253" },
      { text: "Cấy nước tiểu, dịch theo ổ nghi ngờ; công thức máu, chức năng gan thận, điện giải; X-quang phổi, CT nếu cần.", ref: "tr. 253" },
      { text: "Khám kỹ miệng, họng, thực quản, phổi, hậu môn – sinh dục, da, đường vào catheter.", ref: "tr. 253" },
    ] },
    { label: "Khởi trị và thời gian", points: [
      { text: "Cấp cứu nội khoa: phổ rộng, liều cao, lý tưởng trong 60 phút; nguy cơ cao bắt buộc tĩnh mạch, nằm viện.", ref: "tr. 253" },
      { text: "Có ổ và tác nhân: theo hướng dẫn riêng, tiếp tục đến ANC > 500.", ref: "tr. 254" },
      { text: "Không rõ ổ, cấy âm tính: đến hết sốt ≥ 48 giờ và ANC > 500, hoặc chuyển uống dự phòng fluoroquinolon.", ref: "tr. 254" },
    ] },
  ],
  sourceControl: [],
  monitoring: {
    efficacy: [
      { text: "Nhiệt độ, huyết áp và dấu hiệu nhiễm khuẩn nặng; ANC.", ref: "tr. 252–254" },
    ],
    reassessment: [
      { text: "Có kết quả nuôi cấy: điều chỉnh theo kháng sinh đồ.", ref: "tr. 253" },
    ],
    safety: [
      { text: "Điều chỉnh liều theo chức năng gan, thận.", ref: "tr. 253" },
      { text: "Aminoglycosid: giảm liều khi suy thận, căn cứ độ thanh thải creatinin.", ref: "tr. 254" },
    ],
  },
};

/* ---------- Viem mang nao mu ---------- */
const MENINGITIS: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 9, Viêm màng não mủ (Bảng II.19, II.20)`,
  cards: [
    { label: "Căn nguyên thường gặp", points: [
      { text: "Trẻ em: Hib, phế cầu, não mô cầu. Người lớn: phế cầu, não mô cầu, liên cầu.", ref: "tr. 229" },
      { text: "Listeria: trẻ sơ sinh và người già. Sau chấn thương, phẫu thuật, dò dịch não tủy: phế cầu, tụ cầu, kỵ khí Gram âm.", ref: "tr. 229, 231" },
    ] },
    { label: "Chẩn đoán", points: [
      { text: "Sốt, hội chứng màng não; dấu hiệu gợi ý căn nguyên: ban hoại tử, chấn thương hoặc phẫu thuật sọ não, khuyết tật tai mũi họng.", ref: "tr. 229–230" },
      { text: "Dịch não tủy: bạch cầu đa nhân tăng, protein > 1 g/l, glucose < 2,2 mmol/l; nhuộm Gram, cấy, PCR. Cấy máu.", ref: "tr. 230" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Kháng sinh kịp thời theo Bảng II.19 (theo lứa tuổi, cơ địa) khi chưa có kết quả vi sinh.", ref: "tr. 230–231" },
      { text: "Chọn ampicilin khi nghi Listeria. Không khuyến cáo meropenem cho trẻ dưới 3 tháng.", ref: "tr. 231" },
    ] },
    { label: "Thời gian", points: [
      { text: "Não mô cầu 7 ngày; Hib 10 ngày; phế cầu 14 ngày.", ref: "tr. 233" },
      { text: "Trực khuẩn, kỵ khí Gram âm, liên cầu, tụ cầu: 3 tuần. Hoặc trung bình 10–14 ngày và hết sốt 3 ngày.", ref: "tr. 233" },
    ] },
  ],
  sourceControl: [
    { text: "Dexamethason 0,6 mg/kg/ngày trong 4 ngày, tiêm cùng hoặc trước kháng sinh 15 phút.", ref: "tr. 231" },
    { text: "Chống phù não, bù nước và điện giải; phòng và cắt cơn co giật.", ref: "tr. 231" },
    { text: "Hội chẩn ngoại khoa khi có khuyết tật, biến chứng hoặc chấn thương.", ref: "tr. 233" },
  ],
  monitoring: {
    efficacy: [
      { text: "Sốt, hội chứng màng não, ý thức, dấu hiệu phù não.", ref: "tr. 229–230" },
      { text: "Bạch cầu, CRP, procalcitonin; dịch não tủy.", ref: "tr. 230" },
    ],
    reassessment: [
      { text: "Có nhuộm Gram: điều chỉnh ngay theo hình thái vi khuẩn; có cấy: theo kháng sinh đồ.", ref: "tr. 232–233" },
      { text: "Không có kết quả cấy hoặc không cải thiện: chọc lại dịch não tủy sau 48 giờ; không cải thiện thì đổi phác đồ thay thế.", ref: "tr. 233" },
    ],
    safety: [
      { text: "Aminoglycosid, vancomycin: giám sát nồng độ thuốc nếu có điều kiện.", ref: "tr. 232" },
      { text: "Meropenem: chỉ dùng khi kháng sinh khác không hiệu quả; không khuyến cáo cho trẻ dưới 3 tháng.", ref: "tr. 232" },
      { text: "Liều Bảng II.20 áp dụng cho chức năng gan thận bình thường; trẻ non tháng, nhẹ cân (< 2 kg) dùng liều thấp hơn, khoảng cách dài hơn.", ref: "tr. 231–232" },
    ],
  },
};

/* ---------- Nhiem khuan tiet nieu ---------- */
const BETA_LACTAM_SAFETY = { text: "Beta-lactam: chống chỉ định khi có tiền sử dị ứng penicilin hoặc thuốc cùng nhóm; giảm liều chế phẩm có acid clavulanic, sulbactam khi mức lọc cầu thận < 30 ml/phút.", ref: "tr. 250" };
const FQ_SAFETY = { text: "Fluoroquinolon – chống chỉ định: phụ nữ có thai, cho con bú, trẻ em dưới 15 tuổi, tiền sử co giật.", ref: "tr. 236–237, 250" };
const AG_SAFETY = { text: "Aminoglycosid: độc thận và tai – theo dõi chức năng thận, giảm liều khi suy thận.", ref: "tr. 237, 250" };
const PYELO: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 10, Viêm thận bể thận cấp`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "Gram âm: E. coli 70–80%, Klebsiella, Proteus mirabilis, Enterobacter.", ref: "tr. 234" },
      { text: "Gram dương dưới 10%: Enterococcus, Staphylococcus.", ref: "tr. 234" },
    ] },
    { label: "Trước kháng sinh", points: [
      { text: "Cấy nước tiểu; cấy máu nếu sốt cao. Bắt đầu kháng sinh ngay trong khi chờ kết quả.", ref: "tr. 235" },
      { text: "Siêu âm tìm giãn đài bể thận, sỏi, khối chèn ép.", ref: "tr. 235" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Sốt cao rét run: nội trú, kháng sinh tiêm. Nhẹ: ngoại trú, kháng sinh uống.", ref: "tr. 235–236" },
      { text: "Thai phụ: thận trọng; không dùng fluoroquinolon.", ref: "tr. 237–238" },
    ] },
    { label: "Thời gian", points: [
      { text: "Uống (không biến chứng): 7–14 ngày.", ref: "tr. 236" },
      { text: "Tiêm: chuyển uống từ ngày 10–14 khi hết sốt; duy trì tổng 3 tuần.", ref: "tr. 237" },
    ] },
  ],
  sourceControl: [
    { text: "Tìm và giải quyết tắc nghẽn, ổ áp xe quanh thận (siêu âm, CT) để dẫn lưu ngoại khoa.", ref: "tr. 237" },
    { text: "Vô niệu: giải quyết nguyên nhân tắc nghẽn là chỉ định cấp cứu.", ref: "tr. 238" },
    { text: "Bù dịch đảm bảo nước tiểu > 50 ml/giờ; giảm đau, giãn cơ trơn.", ref: "tr. 237" },
  ],
  monitoring: {
    efficacy: [
      { text: "Sốt, đau hông lưng, hội chứng bàng quang; vi khuẩn niệu.", ref: "tr. 235, 237" },
    ],
    reassessment: [
      { text: "Sau 3–5 ngày không đỡ: điều chỉnh theo kháng sinh đồ.", ref: "tr. 235" },
      { text: "Còn sốt hoặc vi khuẩn niệu sau 48–72 giờ: tìm tắc nghẽn, áp xe thận.", ref: "tr. 237" },
      { text: "Cấy nước tiểu kiểm tra sau ngừng thuốc; tái phát cùng vi khuẩn: điều trị tiếp 6 tuần.", ref: "tr. 237–238" },
    ],
    safety: [FQ_SAFETY, AG_SAFETY, BETA_LACTAM_SAFETY],
  },
};
const STONE: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 10, Sỏi thận tiết niệu nhiễm trùng`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "E. coli, Proteus, Klebsiella; vi khuẩn tiết urease tạo sỏi struvit.", ref: "tr. 240–241" },
    ] },
    { label: "Chẩn đoán", points: [
      { text: "Siêu âm phát hiện sỏi, tắc nghẽn, ứ nước, ứ mủ; CT phân biệt áp xe nhu mô.", ref: "tr. 241" },
      { text: "Cấy máu nếu sốt > 38 °C kèm rét run. Không chụp UIV khi đang nhiễm khuẩn nặng hoặc suy thận cấp.", ref: "tr. 241" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Có biến chứng: amoxicilin/ampicilin tiêm hoặc cephalosporin thế hệ 2–3; hoặc fluoroquinolon.", ref: "tr. 242–243" },
      { text: "Có viêm thận bể thận cấp: theo bài riêng.", ref: "tr. 243" },
    ] },
    { label: "Thời gian", points: [
      { text: "Beta-lactam: 10–14 ngày. Fluoroquinolon uống: 3–7 ngày, có thể tới 10 ngày.", ref: "tr. 242–243" },
    ] },
  ],
  sourceControl: [
    { text: "Giải phóng tắc nghẽn do sỏi: tán sỏi, lấy sỏi nội soi, mổ lấy sỏi khi sỏi to hoặc sỏi san hô.", ref: "tr. 243" },
    { text: "Vô niệu: lọc máu cấp cứu, không trì hoãn khi kali máu ≥ 6,5 mmol/l.", ref: "tr. 243" },
  ],
  monitoring: {
    efficacy: [{ text: "Sốt, đau, rối loạn tiểu tiện; bạch cầu máu, vi khuẩn niệu.", ref: "tr. 240–241" }],
    reassessment: [{ text: "Đánh giá biến chứng: ứ mủ bể thận, hoại tử thận, suy thận.", ref: "tr. 243–244" }],
    safety: [FQ_SAFETY, BETA_LACTAM_SAFETY],
  },
};
const CYSTITIS: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 10, Viêm bàng quang cấp`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "Gram âm khoảng 90%: E. coli 70–80%, Proteus 10–15%, Klebsiella 5–10%.", ref: "tr. 248" },
      { text: "S. saprophyticus 5–10%; P. aeruginosa, S. aureus 1–2%.", ref: "tr. 248" },
    ] },
    { label: "Chẩn đoán", points: [
      { text: "Hội chứng bàng quang; thường không sốt hoặc sốt < 38 °C.", ref: "tr. 248" },
      { text: "Chỉ cấy nước tiểu khi có nguyên nhân thuận lợi, không đáp ứng, tái phát hoặc nam giới.", ref: "tr. 249" },
    ] },
    { label: "Khởi trị theo đối tượng", points: [
      { text: "Thông thường; phụ nữ có thai; nam giới; có nguyên nhân thuận lợi.", ref: "tr. 249–250" },
      { text: "Fluoroquinolon không phải lựa chọn đầu tay.", ref: "tr. 249" },
    ] },
    { label: "Thời gian", points: [
      { text: "Thông thường 3–5 ngày; thai phụ 5–7 ngày; nam giới 14 ngày; có nguyên nhân thuận lợi 7–10 ngày.", ref: "tr. 249–250" },
    ] },
  ],
  sourceControl: [
    { text: "Loại bỏ nguyên nhân gây tắc đường bài niệu.", ref: "tr. 250" },
    { text: "Uống đủ nước (> 1,5 lít nước tiểu/24 giờ), không nhịn tiểu quá 6 giờ.", ref: "tr. 250" },
  ],
  monitoring: {
    efficacy: [{ text: "Hết đái buốt, đái rắt; bạch cầu niệu, vi khuẩn niệu.", ref: "tr. 248–249" }],
    reassessment: [
      { text: "Không đáp ứng hoặc tái phát: cấy nước tiểu, chọn theo kháng sinh đồ.", ref: "tr. 249" },
      { text: "Tái phát ≥ 4 lần/năm: điều trị dự phòng.", ref: "tr. 250" },
    ],
    safety: [
      FQ_SAFETY, BETA_LACTAM_SAFETY,
      { text: "Sulfamid: có thể gây hội chứng Stevens-Johnson, giảm bạch cầu hạt; chống chỉ định khi suy gan, suy thận nặng, có thai.", ref: "tr. 250" },
    ],
  },
};

/* ---------- Tieu hoa – gan mat ---------- */
const BILIARY: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 5, Nhiễm khuẩn đường mật (Bảng II.14, II.15)`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "Cộng đồng: E. coli, Klebsiella, Enterococcus. Thể nặng: đa vi khuẩn, có kỵ khí (Clostridium, Bacteroides).", ref: "tr. 148" },
      { text: "Bệnh viện: MRSA, Enterococcus kháng vancomycin, Pseudomonas.", ref: "tr. 148" },
    ] },
    { label: "Mức độ nặng", points: [
      { text: "Nặng (III): có suy tạng – vận mạch, rối loạn ý thức, PaO2/FiO2 < 300, INR > 1,5, creatinin > 2 mg/dl, tiểu cầu < 100.000.", ref: "tr. 149" },
      { text: "Trung bình (II): không suy tạng nhưng không đáp ứng điều trị ban đầu.", ref: "tr. 149" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Kháng sinh bài tiết tốt vào đường mật; theo Bảng II.15 trong khi chờ kháng sinh đồ.", ref: "tr. 149–150" },
      { text: "Thể nặng: phối hợp thuốc điều trị kỵ khí (metronidazol).", ref: "tr. 149–150" },
    ] },
    { label: "Thời gian", points: [
      { text: "Thể nhẹ: 5–7 ngày. Trung bình và nặng: 7–14 ngày, có thể dài hơn tùy đáp ứng.", ref: "tr. 150" },
    ] },
  ],
  sourceControl: [
    { text: "Tắc nghẽn đường mật: dẫn lưu qua da, đặt stent qua ERCP hoặc phẫu thuật.", ref: "tr. 149" },
    { text: "Điều trị sỏi mật, nguyên nhân tắc nghẽn; tẩy giun định kỳ nếu do giun.", ref: "tr. 150" },
  ],
  monitoring: {
    efficacy: [
      { text: "Sốt, đau, vàng da; bạch cầu, CRP, procalcitonin, bilirubin.", ref: "tr. 148–149" },
      { text: "Dấu hiệu suy tạng (Bảng II.14).", ref: "tr. 149" },
    ],
    reassessment: [{ text: "Có kháng sinh đồ: điều trị theo kháng sinh đồ.", ref: "tr. 150" }],
    safety: [AG_SAFETY],
  },
};
const PERITONITIS: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 5, Viêm phúc mạc`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "Thứ phát: E. coli, K. pneumoniae, B. fragilis; có thể Streptococcus, Enterococcus, Clostridium.", ref: "tr. 158" },
      { text: "Viêm phúc mạc thì ba: trực khuẩn mủ xanh, Gram âm kháng thuốc, có thể C. albicans.", ref: "tr. 158" },
    ] },
    { label: "Chẩn đoán", points: [
      { text: "Chọc dịch ổ bụng: bạch cầu > 500/mm³ và/hoặc bạch cầu trung tính > 250/mm³; soi, cấy dịch.", ref: "tr. 159" },
      { text: "Siêu âm, X-quang bụng đứng tìm nguyên nhân (liềm hơi, mức nước – hơi).", ref: "tr. 159" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Phác đồ phủ Gram âm đường ruột, kết hợp metronidazol.", ref: "tr. 160" },
      { text: "Nặng: carbapenem + metronidazol.", ref: "tr. 160" },
    ] },
    { label: "Thời gian", points: [
      { text: "Bài không quy định thời gian cho viêm phúc mạc thứ phát.", ref: "tr. 160" },
    ] },
  ],
  sourceControl: [
    { text: "Dẫn lưu ổ áp xe, phẫu thuật lại ổ bụng; hồi sức chống sốc, thở oxy, điều trị suy tạng.", ref: "tr. 160" },
  ],
  monitoring: {
    efficacy: [{ text: "Đau, co cứng bụng, sốt, dấu hiệu nhiễm độc; bạch cầu, CRP, ure, creatinin, điện giải.", ref: "tr. 159" }],
    reassessment: [{ text: "Có kết quả cấy dịch ổ bụng hoặc máu: theo kháng sinh đồ.", ref: "tr. 160" }],
    safety: [BETA_LACTAM_SAFETY],
  },
};
const DIARRHEA: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 5, Tiêu chảy do vi khuẩn`,
  cards: [
    { label: "Căn nguyên", points: [
      { text: "Do độc tố: V. cholerae, E. coli, C. difficile, tụ cầu – phân nhiều nước, không hồng cầu, bạch cầu.", ref: "tr. 141" },
      { text: "Xâm nhập: Shigella, Salmonella, E. coli, Campylobacter, Yersinia – phân nhầy, có thể có máu.", ref: "tr. 141" },
    ] },
    { label: "Xét nghiệm", points: [
      { text: "Soi phân, cấy phân; công thức máu; điện giải, chức năng thận.", ref: "tr. 142" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Dự đoán căn nguyên và điều trị ngay; thường đường uống, truyền chỉ khi nhiễm khuẩn toàn thân.", ref: "tr. 142" },
      { text: "Kháng sinh thường hiệu quả với tiêu chảy xâm nhập.", ref: "tr. 142" },
    ] },
    { label: "Thời gian", points: [
      { text: "Phần lớn căn nguyên: 5 ngày. C. difficile: 7–10 ngày. Thương hàn: 10–14 ngày. Tả: 3 ngày.", ref: "tr. 142–143" },
    ] },
  ],
  sourceControl: [
    { text: "Đánh giá mất nước và bồi phụ nước điện giải; điều trị triệu chứng.", ref: "tr. 142" },
  ],
  monitoring: {
    efficacy: [{ text: "Số lần đi ngoài, tính chất phân, sốt, tình trạng mất nước.", ref: "tr. 141" }],
    reassessment: [{ text: "Có kết quả cấy phân: điều chỉnh kháng sinh nếu cần.", ref: "tr. 142" }],
    safety: [
      { text: "Liều trong bài chủ yếu cho người lớn; trẻ em theo Hướng dẫn xử trí tiêu chảy ở trẻ em (BYT 2009).", ref: "tr. 142" },
      { text: "Quinolon chỉ dùng cho người > 12 tuổi; azithromycin ưu tiên cho phụ nữ có thai.", ref: "tr. 142–143" },
    ],
  },
};

/* ---------- Viem noi tam mac nhiem khuan ---------- */
const ENDOCARDITIS: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 3, Viêm nội tâm mạc nhiễm khuẩn`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "Đa số do liên cầu. Tụ cầu (hay gặp sau nạo phá thai, tổn thương van ba lá).", ref: "tr. 128" },
      { text: "Não mô cầu, phế cầu, lậu cầu; trực khuẩn Gram âm; nấm ở người suy giảm miễn dịch.", ref: "tr. 128" },
    ] },
    { label: "Trước kháng sinh", points: [
      { text: "Nghĩ đến bệnh ở người bệnh tim sốt dai dẳng > 1 tuần không rõ lý do.", ref: "tr. 128" },
      { text: "Cấy máu nhiều lần (ba lần), cố gắng cấy khi đang sốt.", ref: "tr. 128–129" },
      { text: "Siêu âm tim: thấy sùi giúp xác định; không thấy cũng không loại trừ.", ref: "tr. 129" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Sớm sau cấy máu; diệt khuẩn, liều cao, phối hợp, đường tĩnh mạch.", ref: "tr. 129" },
      { text: "Phân nhánh: van tự nhiên, dị ứng penicilin, trẻ em, van nhân tạo < 1 năm hoặc > 1 năm.", ref: "tr. 129–130" },
    ] },
    { label: "Thời gian", points: [
      { text: "4–6 tuần; van nhân tạo 6 tuần.", ref: "tr. 129–130" },
      { text: "Aminoglycosid ngắn nhất có thể (5–14 ngày), không quá 14 ngày.", ref: "tr. 130" },
    ] },
  ],
  sourceControl: [],
  monitoring: {
    efficacy: [{ text: "Sốt, cấy máu, tốc độ lắng máu, công thức máu, đái máu vi thể.", ref: "tr. 128–129" }],
    reassessment: [{ text: "Có kết quả cấy máu: kháng sinh đặc hiệu theo kháng sinh đồ.", ref: "tr. 130" }],
    safety: [
      AG_SAFETY,
      { text: "Trẻ em: không vượt quá liều người lớn bình thường.", ref: "tr. 129" },
    ],
  },
};

/* ---------- Ap xe phoi, gian phe quan ---------- */
const CREAT_SAFETY = { text: "Aminoglycosid, vancomycin: xét nghiệm creatinin máu 2 lần/tuần để phát hiện sớm suy thận do thuốc.", ref: "tr. 70, 111" };
const LUNG_ABSCESS: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 1, Áp xe phổi`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "S. aureus, K. pneumoniae, P. aeruginosa, E. coli, Proteus, kỵ khí, S. pneumoniae, H. influenzae; đôi khi nấm, amíp.", ref: "tr. 109–110" },
      { text: "Thường nhiễm nhiều loại vi khuẩn cùng lúc.", ref: "tr. 110" },
    ] },
    { label: "Trước kháng sinh", points: [
      { text: "Nhuộm soi, cấy đờm, dịch phế quản hoặc mủ ổ áp xe; cấy máu khi sốt > 38,5 °C.", ref: "tr. 109" },
      { text: "X-quang thẳng nghiêng hoặc CT để xác định vị trí, chọn cách dẫn lưu.", ref: "tr. 109" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Sớm, liều cao, phối hợp từ hai kháng sinh, tĩnh mạch hoặc tiêm bắp.", ref: "tr. 110" },
      { text: "Đờm thối: thêm thuốc diệt kỵ khí.", ref: "tr. 110" },
    ] },
    { label: "Thời gian", points: [
      { text: "Ít nhất 4 tuần, có thể tới 6 tuần theo lâm sàng và X-quang.", ref: "tr. 110–111" },
    ] },
  ],
  sourceControl: [
    { text: "Dẫn lưu tư thế, vỗ rung lồng ngực; nội soi phế quản hút mủ; chọc dẫn lưu qua thành ngực với ổ ngoại vi.", ref: "tr. 111" },
    { text: "Phẫu thuật: ổ > 10 cm, áp xe mạn tính, ho máu nặng, rò phế quản – màng phổi.", ref: "tr. 112" },
  ],
  monitoring: {
    efficacy: [{ text: "Cải thiện sau 3–4 ngày; cắt sốt sau 7–10 ngày.", ref: "tr. 111" }],
    reassessment: [{ text: "Còn sốt sau thời gian này: xét nghiệm vi sinh tìm nguyên nhân, thay đổi theo kháng sinh đồ.", ref: "tr. 110–111" }],
    safety: [CREAT_SAFETY],
  },
};
const BRONCHIECTASIS: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 1, Giãn phế quản`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "S. pneumoniae, K. pneumoniae, P. aeruginosa, S. aureus, E. coli.", ref: "tr. 67" },
    ] },
    { label: "Chẩn đoán", points: [
      { text: "CT lớp mỏng độ phân giải cao là tiêu chuẩn vàng.", ref: "tr. 68" },
      { text: "Xét nghiệm đờm tìm vi khuẩn, nấm, trực khuẩn kháng cồn kháng toan.", ref: "tr. 68" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Uống hay tiêm theo mức độ và tình hình kháng tại địa phương; nặng thì phối hợp.", ref: "tr. 68" },
      { text: "Thường beta-lactam kết hợp aminoglycosid hoặc quinolon.", ref: "tr. 69" },
    ] },
    { label: "Thời gian", points: [
      { text: "10 ngày đến 2 tuần; nặng, kháng thuốc, trực khuẩn mủ xanh, tụ cầu: tới 3 tuần.", ref: "tr. 70" },
    ] },
  ],
  sourceControl: [
    { text: "Dẫn lưu đờm mủ: ho khạc, vỗ rung lồng ngực, dẫn lưu tư thế.", ref: "tr. 68" },
    { text: "Ngoại khoa khi giãn khu trú một thùy hoặc một bên phổi, ho máu nhiều lần, tắc do khối u.", ref: "tr. 68" },
  ],
  monitoring: {
    efficacy: [{ text: "Sốt, lượng và tính chất đờm, khó thở.", ref: "tr. 67" }],
    reassessment: [{ text: "Thay đổi theo đáp ứng lâm sàng và kháng sinh đồ.", ref: "tr. 68–69" }],
    safety: [
      CREAT_SAFETY,
      { text: "Erythromycin dài ngày: không dùng cùng theophylin (nguy cơ xoắn đỉnh).", ref: "tr. 70" },
    ],
  },
};

/* ---------- Viem phoi cong dong tre em ---------- */
const PED_PNEUMONIA: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 1, Viêm phổi cộng đồng ở trẻ em`,
  cards: [
    { label: "Nguyên nhân theo tuổi", points: [
      { text: "Dưới 2 tháng: liên cầu B, tụ cầu, Gram âm, phế cầu, H. influenzae.", ref: "tr. 87" },
      { text: "2 tháng – 5 tuổi: phế cầu, H. influenzae. Trên 5 tuổi: thêm Mycoplasma, Chlamydia, Legionella.", ref: "tr. 88" },
      { text: "Nặng và rất nặng: Gram âm, tụ cầu nhiều hơn.", ref: "tr. 88" },
    ] },
    { label: "Phân độ", points: [
      { text: "Nặng: rút lõm lồng ngực, phập phồng cánh mũi, thở rên (< 2 tháng).", ref: "tr. 86" },
      { text: "Rất nặng: tím tái nặng, không uống được, li bì, co giật, hôn mê, suy dinh dưỡng nặng.", ref: "tr. 86–87" },
      { text: "Dưới 2 tháng: mọi trường hợp đều nặng, phải vào viện.", ref: "tr. 86, 89" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Kháng sinh cho mọi trẻ viêm phổi; chọn theo tuổi, miễn dịch, mức độ, tình hình kháng.", ref: "tr. 87–88" },
      { text: "Không nặng: kháng sinh uống vẫn an toàn và hiệu quả.", ref: "tr. 89" },
    ] },
    { label: "Thời gian", points: [
      { text: "Ít nhất 5 ngày; không nặng 5–7 ngày; nặng 5–10 ngày; rất nặng 7–10 ngày.", ref: "tr. 89" },
    ] },
  ],
  sourceControl: [],
  monitoring: {
    efficacy: [
      { text: "Theo dõi sau 2–3 ngày: sốt, nhịp thở, rút lõm, tình trạng bú, ăn uống.", ref: "tr. 89" },
      { text: "Phát hiện biến chứng: tràn dịch, tràn khí màng phổi, áp xe phổi (nghe phổi, X-quang).", ref: "tr. 87" },
    ],
    reassessment: [
      { text: "Không đỡ hoặc nặng thêm: chuyển bậc điều trị nặng hơn.", ref: "tr. 89" },
      { text: "Tiêm chuyển uống khi bệnh cải thiện nhiều và trẻ uống được.", ref: "tr. 89" },
    ],
    safety: [
      { text: "Chloramphenicol: tối đa không quá 2 g/ngày.", ref: "tr. 89" },
      AG_SAFETY,
    ],
  },
};

/* ---------- Viem phoi benh vien, lien quan tho may ---------- */
const HAP: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 1, Viêm phổi bệnh viện (Bảng II.6, II.7)`,
  cards: [
    { label: "Phân nhóm", points: [
      { text: "Nhóm I: khởi phát sớm < 5 ngày, không nguy cơ đa kháng. Nhóm II: muộn ≥ 5 ngày và/hoặc có nguy cơ đa kháng.", ref: "tr. 93" },
      { text: "Nặng: tụt huyết áp, đặt nội khí quản, nhiễm khuẩn huyết, X-quang tiến triển nhanh, suy đa tạng – điều trị tại hồi sức.", ref: "tr. 94–95" },
    ] },
    { label: "Tác nhân thường gặp", points: [
      { text: "Sớm: S. pneumoniae, H. influenzae, MSSA.", ref: "tr. 94" },
      { text: "Muộn: P. aeruginosa, E. coli, Enterobacter, K. pneumoniae, A. baumannii, MRSA.", ref: "tr. 94" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Theo nguy cơ, vi khuẩn tại địa phương, mức độ nặng, tuổi, bệnh kèm.", ref: "tr. 95" },
      { text: "Phối hợp khi nghi đa kháng hoặc bệnh nặng; xuống thang khi có kháng sinh đồ.", ref: "tr. 95" },
    ] },
    { label: "Thời gian", points: [
      { text: "Thường 10–14 ngày; tới 21 ngày nếu P. aeruginosa, Acinetobacter, S. maltophilia, MRSA hoặc triệu chứng kéo dài.", ref: "tr. 95" },
    ] },
  ],
  sourceControl: [],
  monitoring: {
    efficacy: [{ text: "Sốt, dịch tiết phế quản, bạch cầu, X-quang.", ref: "tr. 94" }],
    reassessment: [{ text: "Có căn nguyên: theo kháng sinh đồ; vi khuẩn đa kháng theo Bảng II.7.", ref: "tr. 95, 97" }],
    safety: [{ text: "Phối hợp aminoglycosid: theo dõi chức năng thận 2 lần/tuần.", ref: "tr. 97" }],
  },
};
const VAP: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 1, Viêm phổi liên quan đến thở máy`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "Sớm (< 5 ngày): MSSA, S. pneumoniae, H. influenzae.", ref: "tr. 100" },
      { text: "Muộn (≥ 5 ngày) hoặc đã dùng kháng sinh: MRSA, P. aeruginosa, A. baumannii, S. maltophilia; nấm ở người suy giảm miễn dịch.", ref: "tr. 100" },
    ] },
    { label: "Chẩn đoán", points: [
      { text: "Sau 48 giờ thở máy: đờm mủ tăng, sốt > 38 °C hoặc < 35,5 °C, thâm nhiễm mới trên X-quang.", ref: "tr. 102" },
      { text: "Cấy định lượng dịch hút phế quản, rửa phế quản phế nang hoặc chải có bảo vệ.", ref: "tr. 102" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Sớm sau khi lấy bệnh phẩm; đúng, đủ liều.", ref: "tr. 103" },
      { text: "Không nguy cơ đa kháng: đơn trị. Có nguy cơ: nhóm A + nhóm B, cân nhắc thêm C (MRSA) hoặc D (nấm).", ref: "tr. 103–104" },
    ] },
    { label: "Thời gian", points: [
      { text: "Khoảng 7–10 ngày: tụ cầu, H. influenzae.", ref: "tr. 105" },
      { text: "Ít nhất 14–21 ngày: nhiều thùy, hang, hoại tử Gram âm, P. aeruginosa, Acinetobacter.", ref: "tr. 105" },
    ] },
  ],
  sourceControl: [
    { text: "Loại trừ biến chứng (áp xe, tràn mủ màng phổi) khi không cải thiện.", ref: "tr. 105" },
  ],
  monitoring: {
    efficacy: [{ text: "CPIS, sốt, PaO2/FiO2, bạch cầu, procalcitonin, tính chất đờm, X-quang.", ref: "tr. 105" }],
    reassessment: [
      { text: "Đánh giá lại sau 48–72 giờ và ngày 3, 5, 7; xuống thang theo vi sinh.", ref: "tr. 104–105" },
      { text: "Cải thiện nhanh, cấy âm tính: cân nhắc ngừng hoặc rút ngắn.", ref: "tr. 105" },
    ],
    safety: [
      { text: "Suy thận: điều chỉnh theo mức lọc cầu thận và nồng độ kháng sinh trong máu (nếu có).", ref: "tr. 104" },
      { text: "Không dùng colistin đơn độc.", ref: "tr. 106" },
    ],
  },
};

/* ---------- Viem mo bao, san phu khoa ---------- */
const CELLULITIS: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 4, Viêm mô bào`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "Liên cầu nhóm A; tụ cầu vàng đơn thuần hoặc phối hợp.", ref: "tr. 138" },
      { text: "Ít gặp: S. pneumoniae, H. influenzae; A. hydrophila từ nước, đất.", ref: "tr. 138" },
    ] },
    { label: "Chẩn đoán", points: [
      { text: "Sưng, nóng, đỏ, đau lan tỏa; hay gặp ở cẳng chân.", ref: "tr. 138" },
      { text: "Phân biệt viêm tắc tĩnh mạch sâu (siêu âm Doppler) và viêm quầng.", ref: "tr. 138–139" },
      { text: "Cấy bệnh phẩm, cấy máu: chỉ khoảng 1/5 dương tính.", ref: "tr. 139" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Nặng (nghi nhiễm khuẩn huyết, viêm khớp, viêm cân cơ): tiêm bắp hoặc tĩnh mạch.", ref: "tr. 139" },
      { text: "Nhẹ: có thể dùng đường uống.", ref: "tr. 139" },
    ] },
    { label: "Thời gian", points: [
      { text: "Ít nhất 10 ngày.", ref: "tr. 139–140" },
    ] },
  ],
  sourceControl: [
    { text: "Viêm tắc tĩnh mạch kèm theo: kết hợp thuốc chống đông; nâng cao thể trạng, cân bằng nước – điện giải.", ref: "tr. 140" },
  ],
  monitoring: {
    efficacy: [{ text: "Sốt và tổn thương da giảm nhanh khi điều trị đúng; bạch cầu, máu lắng, procalcitonin.", ref: "tr. 138–139" }],
    reassessment: [
      { text: "Theo dõi biến chứng: hoại tử, áp xe, viêm cân cơ, nhiễm khuẩn huyết; quanh mắt: liệt nhãn cầu, mất thị lực.", ref: "tr. 138" },
      { text: "Tái phát: penicilin kéo dài để phòng tái phát.", ref: "tr. 140" },
    ],
    safety: [{ text: "Ceftriaxon truyền: pha trong dung dịch không chứa calci (NaCl 0,9% hoặc dextrose 5%).", ref: "tr. 139" }],
  },
};
const POSTPARTUM: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 7, Nhiễm trùng nặng do sản khoa`,
  cards: [
    { label: "Tác nhân thường gặp", points: [
      { text: "E. coli, S. aureus, S. pyogenes, Clostridium.", ref: "tr. 180" },
      { text: "Nguyên nhân: sót rau, nhiễm khuẩn ối, thủ thuật tử cung không vô khuẩn.", ref: "tr. 180" },
    ] },
    { label: "Thể nặng", points: [
      { text: "Viêm tử cung toàn bộ; viêm phúc mạc toàn bộ (7–10 ngày sau đẻ); nhiễm khuẩn huyết.", ref: "tr. 180–181" },
    ] },
    { label: "Trước kháng sinh", points: [
      { text: "Cấy máu (lúc sốt cao), cấy sản dịch từ buồng tử cung, cấy nước tiểu.", ref: "tr. 181" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Phối hợp kháng sinh phổ rộng khi chưa có kháng sinh đồ.", ref: "tr. 181" },
      { text: "Bài không quy định thời gian điều trị.", ref: "tr. 181" },
    ] },
  ],
  sourceControl: [
    { text: "Giải quyết ổ nhiễm khuẩn; viêm phúc mạc: chẩn đoán và mổ sớm.", ref: "tr. 180–181" },
    { text: "Bù dịch; vận mạch nếu huyết áp không hồi phục sau bù dịch; thở oxy.", ref: "tr. 181" },
  ],
  monitoring: {
    efficacy: [{ text: "Sốt, sản dịch, co hồi tử cung, dấu hiệu phúc mạc; huyết động, nước tiểu.", ref: "tr. 180–181" }],
    reassessment: [{ text: "Có kháng sinh đồ: điều trị theo kháng sinh đồ.", ref: "tr. 181" }],
    safety: [{ text: "Gentamycin: liều tiếp theo dựa vào độ thanh thải của thận.", ref: "tr. 181" }],
  },
};
const BV: DiseaseOverviewData = {
  docLabel: `${Q} – Chương 7, Viêm âm đạo – niệu đạo do vi khuẩn`,
  cards: [
    { label: "Tác nhân", points: [
      { text: "Vi khuẩn kỵ khí: Mobiluncus, M. hominis, Bacteroides, G. vaginalis.", ref: "tr. 184" },
    ] },
    { label: "Chẩn đoán", points: [
      { text: "Khí hư loãng trắng xám, hôi; pH > 4,5; test sniff (+); clue cells ≥ 20%.", ref: "tr. 184" },
    ] },
    { label: "Khởi trị", points: [
      { text: "Metronidazol hoặc clindamycin, uống hoặc tại chỗ; thai phụ dùng clindamycin.", ref: "tr. 184" },
    ] },
    { label: "Thời gian", points: [
      { text: "5–7 ngày tùy thuốc.", ref: "tr. 184" },
    ] },
  ],
  sourceControl: [],
  monitoring: {
    efficacy: [{ text: "Hết khí hư hôi, ngứa.", ref: "tr. 184" }],
    reassessment: [{ text: "Viêm âm đạo do tạp khuẩn: xét nghiệm tìm nguyên nhân, điều trị theo kháng sinh đồ.", ref: "tr. 183" }],
    safety: [],
  },
};

/* ---------- Mat (Chuong 8) ---------- */
const eye = (title: string, cards: DiseaseOverviewData["cards"], sourceControl: DiseaseOverviewData["sourceControl"], monitoring: DiseaseOverviewData["monitoring"]): DiseaseOverviewData =>
  ({ docLabel: `${Q} – Chương 8, ${title}`, cards, sourceControl, monitoring });
const KERATITIS = eye("Viêm giác mạc do vi khuẩn", [
  { label: "Tác nhân thường gặp", points: [
    { text: "Gram dương: S. aureus, S. pneumoniae, S. epidermidis, Mycobacterium, Nocardia.", ref: "tr. 213" },
    { text: "Gram âm: P. aeruginosa, Moraxella, H. influenzae.", ref: "tr. 213" },
  ] },
  { label: "Trước kháng sinh", points: [
    { text: "Nạo ổ loét: soi tươi, nhuộm Gram, nuôi cấy, kháng sinh đồ nếu có điều kiện.", ref: "tr. 213" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Thuốc tra mắt là chính; chưa xác định vi khuẩn thì dùng phổ rộng (fluoroquinolon).", ref: "tr. 214" },
    { text: "Có thể kết hợp kháng sinh uống; nặng có thể phối hợp hai nhóm.", ref: "tr. 214" },
  ] },
  { label: "Thời gian", points: [
    { text: "Thuốc uống 5–7 ngày; bài không quy định thời gian tra mắt.", ref: "tr. 214" },
  ] },
], [
  { text: "Nặng: truyền rửa mắt liên tục bằng kháng sinh pha Ringer lactat.", ref: "tr. 214" },
], {
  efficacy: [{ text: "Đau, thị lực, kích thước ổ loét (nhuộm fluorescein), thẩm lậu quanh ổ loét.", ref: "tr. 213" }],
  reassessment: [{ text: "Có kháng sinh đồ: dùng kháng sinh nhạy cảm.", ref: "tr. 214" }],
  safety: [],
});
const CONJUNCTIVITIS = eye("Viêm kết mạc cấp; Viêm kết mạc do lậu cầu", [
  { label: "Tác nhân", points: [
    { text: "Tiết tố mủ: lậu cầu (hiếm não mô cầu). Tiết tố màng: bạch hầu, liên cầu.", ref: "tr. 209" },
  ] },
  { label: "Dấu hiệu nặng", points: [
    { text: "Lậu cầu: mủ chảy trào khe mi, loét giác mạc trong vài giờ, nguy cơ thủng giác mạc, viêm nội nhãn.", ref: "tr. 211" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Tại mắt: kháng sinh phổ rộng khi chưa có xét nghiệm, tra dày những ngày đầu.", ref: "tr. 210" },
    { text: "Toàn thân chỉ khi tiến triển nặng (lậu cầu, bạch hầu).", ref: "tr. 210" },
  ] },
  { label: "Thời gian", points: [
    { text: "Lậu cầu có tổn thương giác mạc: ceftriaxon tĩnh mạch, trung bình 7 ngày, tùy đáp ứng.", ref: "tr. 211" },
  ] },
], [
  { text: "Rửa mắt liên tục bằng nước muối sinh lý; bóc màng hằng ngày.", ref: "tr. 210, 212" },
  { text: "Điều trị bệnh lậu đường sinh dục nếu có.", ref: "tr. 210, 212" },
], {
  efficacy: [{ text: "Tiết tố, phù mi, tình trạng giác mạc – theo dõi hằng ngày.", ref: "tr. 212" }],
  reassessment: [{ text: "Thuyên giảm: giảm số lần tra mắt.", ref: "tr. 210" }],
  safety: [
    { text: "Fluoroquinolon toàn thân – chống chỉ định: trẻ em dưới 16 tuổi.", ref: "tr. 210" },
    { text: "Thận trọng khi dùng corticoid tra mắt.", ref: "tr. 210" },
  ],
});
const ORBITAL = eye("Viêm tổ chức hốc mắt", [
  { label: "Tác nhân", points: [
    { text: "S. aureus, S. pneumoniae, nhóm S. anginosus, Hib, Gram âm; nấm ở người suy giảm miễn dịch.", ref: "tr. 218" },
    { text: "Trẻ em: sau viêm hô hấp trên, viêm xoang. Người lớn: đái tháo đường, suy giảm miễn dịch.", ref: "tr. 218" },
  ] },
  { label: "Trước kháng sinh", points: [
    { text: "CT hốc mắt, xoang; bệnh phẩm hốc mắt, mủ áp xe, xoang để soi, cấy; cấy máu nếu nghi nhiễm khuẩn huyết.", ref: "tr. 219" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Cấp cứu: kháng sinh tĩnh mạch liều cao, phổ rộng; phòng viêm màng não, tắc xoang hang, nhiễm khuẩn huyết.", ref: "tr. 219–220" },
  ] },
  { label: "Thời gian", points: [
    { text: "Sau tĩnh mạch: amoxicilin-clavulanat uống 10 ngày.", ref: "tr. 220" },
  ] },
], [
  { text: "Chích dẫn lưu ổ áp xe và xoang viêm; lấy hết dị vật hốc mắt.", ref: "tr. 220" },
  { text: "Điều trị phối hợp viêm xoang, viêm hô hấp, đái tháo đường.", ref: "tr. 220" },
], {
  efficacy: [{ text: "Đau, lồi mắt, vận nhãn, thị lực; bạch cầu, CRP.", ref: "tr. 218–219" }],
  reassessment: [{ text: "Có kháng sinh đồ: điều trị theo nguyên nhân.", ref: "tr. 220" }],
  safety: [{ text: "Quá mẫn penicilin hoặc nghi MRSA: hội chẩn truyền nhiễm, vi sinh.", ref: "tr. 220" }],
});
const ENDOPHTHALMITIS = eye("Viêm mủ nội nhãn sau vết thương xuyên nhãn cầu", [
  { label: "Phạm vi nguồn", points: [
    { text: "CẦN THẨM ĐỊNH: nguồn viết cho viêm mủ nội nhãn sau vết thương xuyên nhãn cầu, không phải sau phẫu thuật.", ref: "tr. 222" },
  ] },
  { label: "Trước kháng sinh", points: [
    { text: "Lấy thủy dịch hoặc dịch kính soi, cấy, kháng sinh đồ; siêu âm B, CT tìm dị vật.", ref: "tr. 222" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Ngay khi nghi ngờ; phổ rộng hoặc phối hợp; tiêm nội nhãn hiệu quả nhất.", ref: "tr. 222–223" },
    { text: "Gram dương: vancomycin. Gram âm: ceftazidim, thứ hai amikacin.", ref: "tr. 223" },
  ] },
  { label: "Phối hợp", points: [
    { text: "Kháng sinh, corticoid và cắt dịch kính.", ref: "tr. 222" },
  ] },
], [
  { text: "Cắt dịch kính; khâu đóng vết thương càng sớm càng tốt.", ref: "tr. 222, 224" },
], {
  efficacy: [{ text: "Đau, thị lực, phản ứng tiền phòng, dịch kính (siêu âm B).", ref: "tr. 222" }],
  reassessment: [{ text: "Theo kết quả nuôi cấy và kháng sinh đồ; nghi nấm: thuốc chống nấm.", ref: "tr. 222–224" }],
  safety: [{ text: "Ciprofloxacin không có tác dụng trên vi khuẩn kỵ khí.", ref: "tr. 223" }],
});
const DACRYO = eye("Viêm túi lệ", [
  { label: "Tác nhân", points: [
    { text: "S. epidermidis, S. aureus, S. pneumoniae, P. aeruginosa, H. influenzae, Proteus, kỵ khí.", ref: "tr. 227" },
  ] },
  { label: "Trước kháng sinh", points: [
    { text: "Tốt nhất lấy mủ túi lệ nuôi cấy, làm kháng sinh đồ.", ref: "tr. 228" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Chưa có kháng sinh đồ: phổ rộng tại mắt (quinolon) và toàn thân.", ref: "tr. 228" },
  ] },
  { label: "Thời gian", points: [
    { text: "7–10 ngày tùy đáp ứng và mức độ nhiễm khuẩn.", ref: "tr. 228" },
  ] },
], [
  { text: "Chích tháo mủ túi lệ; sau đợt cấp: bơm thông lệ đạo hoặc mổ nối thông túi lệ mũi.", ref: "tr. 228" },
], {
  efficacy: [{ text: "Sưng, nóng, đỏ, đau vùng túi lệ; sốt.", ref: "tr. 227" }],
  reassessment: [{ text: "Có kháng sinh đồ: dùng theo kháng sinh đồ.", ref: "tr. 228" }],
  safety: [{ text: "Cefuroxim trẻ em: tổng liều không quá 500 mg/ngày.", ref: "tr. 228" }],
});

export const OVERVIEWS_708: Record<string, DiseaseOverviewData> = {
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
  "v8-102": PED_PNEUMONIA,
  "v8-9": LUNG_ABSCESS,
  "v8-10": BRONCHIECTASIS,
  "v8-24": BILIARY,
  "v8-21": PERITONITIS,
  "v8-25": DIARRHEA,
  "v8-26": DIARRHEA,
  "v8-39": ENDOCARDITIS,
  "v8-17": PYELO,
  "v8-2": STONE,
  "v8-16": CYSTITIS,
  "v8-36": MENINGITIS,
  "v8-104": MENINGITIS,
  "v8-38": MENINGITIS,
  "v8-11": SEPSIS,
  "v8-12": SEPSIS,
  "v8-14": SEPSIS_PATHOGEN,
  "v8-13": SEPSIS_PATHOGEN,
  "v8-43": SEPSIS_PATHOGEN,
  "v8-46": SEPSIS_PATHOGEN,
  "v8-113": NEUTROPENIA,
  "v8-116": NEUTROPENIA,
};
