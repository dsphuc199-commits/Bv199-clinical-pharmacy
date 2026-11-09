/*
  FILE: data/antibiotics/empiric/overviews-modules.ts

  Tong quan (Tang 1) + theo doi (Tang 4) cho 4 mat benh hien thi bang module rieng o tab Viet Nam,
  de bo cuc dong deu voi 65 mat benh dung khung chung. Chi dien giai noi dung module da trich nguon:
  - v8-1  CAP: QĐ 2147/QĐ-BYT (2026) – components/antibiotics/CapByt2026.tsx
  - v8-4/v8-5 HAP/VAP: Khuyến cáo 2023 (Hội Hô hấp VN, Hội HSCC-CĐ VN) – components/antibiotics/HapVap2023.tsx
  - v8-6  COPD: QĐ 2131/QĐ-BYT (2026) – data/antibiotics/copd-2131.ts
  Uu tien hon tong quan QĐ 708 cu cua v8-4/v8-5 (module hien thi la nguon moi hon).
*/

import type { DiseaseOverviewData } from "./overviews";

const CAP_DOC = "QĐ 2147/QĐ-BYT (15/07/2026) – Hướng dẫn chẩn đoán và điều trị viêm phổi mắc phải cộng đồng ở người lớn";
const HV_DOC = "Khuyến cáo chẩn đoán và điều trị viêm phổi bệnh viện, viêm phổi liên quan thở máy (2023) – Hội Hô hấp Việt Nam, Hội Hồi sức cấp cứu và Chống độc Việt Nam";
const COPD_DOC = "QĐ 2131/QĐ-BYT (14/07/2026) – Hướng dẫn chẩn đoán và điều trị bệnh phổi tắc nghẽn mạn tính";

const CAP: DiseaseOverviewData = {
  docLabel: CAP_DOC,
  cards: [
    { label: "Phân nhóm điều trị", points: [
      { text: "Ngoại trú nguy cơ thấp; ngoại trú có bệnh đồng mắc/nguy cơ; nội trú không ICU; viêm phổi nặng – ICU.", ref: "Mục 5.3" },
      { text: "Viêm phổi nặng: suy hô hấp cần thở máy, sốc nhiễm khuẩn hoặc nguy cơ tử vong cao.", ref: "Mục 5.3.2.2" },
    ] },
    { label: "Tác nhân cần lưu ý", points: [
      { text: "S. pneumoniae (kể cả kháng penicilin), H. influenzae, M. catarrhalis, S. aureus, Gram âm đường ruột, vi khuẩn không điển hình.", ref: "Mục 5.3.1" },
      { text: "Gần 50% H. influenzae tại Việt Nam tiết beta-lactamase.", ref: "Bảng 4.4" },
    ] },
    { label: "Trước kháng sinh", points: [
      { text: "Người bệnh nặng: nhuộm Gram, cấy đờm; cân nhắc multiplex PCR, procalcitonin hoặc CRP.", ref: "Mục 5.3.2.1" },
      { text: "Xét nghiệm cúm (và Covid ở bệnh nặng); xét nghiệm lao khi nghi ngờ.", ref: "Mục 5.3" },
    ] },
    { label: "Thời gian", points: [
      { text: "Trung bình 7–10 ngày với viêm phổi không biến chứng; đáp ứng tốt trong 2–3 ngày đầu thường 5–7 ngày.", ref: "Mục 5.2, 5.6.2" },
      { text: "Kéo dài hơn khi đáp ứng chậm, S. aureus, Gram âm, biến chứng hoặc suy giảm miễn dịch.", ref: "Mục 5.6.2" },
    ] },
  ],
  sourceControl: [
    { text: "Nhập viện nếu toàn trạng suy kiệt, tổn thương X-quang > 1 thùy, hoại tử, tràn dịch màng phổi hoặc tiến triển trong 48–72 giờ.", ref: "Mục 5.3.1" },
    { text: "Viêm phổi nặng hoặc sốc: cân nhắc corticoid sớm trong 24 giờ đầu theo nguồn.", ref: "Mục 5.3.2.2" },
  ],
  monitoring: {
    efficacy: [
      { text: "Ho, khó thở, nhiệt độ; procalcitonin khi nhập viện, sau 48–72 giờ và sau 5–7 ngày (nếu dùng).", ref: "Mục 5.2, 5.3.2.1" },
    ],
    reassessment: [
      { text: "Đánh giá đáp ứng sau 48–72 giờ; không cải thiện hoặc xấu hơn: thay đổi phác đồ.", ref: "Mục 5.2" },
      { text: "Chuyển đường uống khi cải thiện ho, khó thở, hết sốt 2 lần cách nhau 8 giờ và uống được.", ref: "Mục 4.5, 5.2" },
    ],
    safety: [
      { text: "Ưu tiên truyền tĩnh mạch, tránh tiêm tĩnh mạch nhanh.", ref: "Mục 5.3.2.1" },
      { text: "Các phương án trong cùng nhóm thay thế nhau – không ghép hai beta-lactam hoặc hai macrolid.", ref: "Mục 5.3" },
      { text: "Liều theo chức năng thận người lớn; hiệu chỉnh theo Clcr.", ref: "Phụ lục 1" },
    ],
  },
};

const hvCards = (kind: "hap" | "vap"): DiseaseOverviewData["cards"] => [
  { label: "Tác nhân thường gặp", points: [
    { text: "Phần lớn là P. aeruginosa và vi khuẩn Gram âm khác; MRSA khi có yếu tố nguy cơ.", ref: kind === "hap" ? "Bảng 3.1" : "Bảng 3.2" },
  ] },
  { label: "Phân tầng nguy cơ", points: kind === "hap" ? [
    { text: "Nguy cơ tử vong cao: phải thở máy hoặc sốc nhiễm khuẩn.", ref: "Bảng 3.1" },
    { text: "Nguy cơ đa kháng: kháng sinh tĩnh mạch trong 90 ngày; bệnh phổi cấu trúc; đã phân lập vi khuẩn đa kháng.", ref: "Bảng 3.1" },
  ] : [
    { text: "Nguy cơ đa kháng: kháng sinh tĩnh mạch 90 ngày, sốc, ARDS, nằm viện > 5 ngày, điều trị thay thế thận trước VPLQTM.", ref: "Bảng 3.2" },
    { text: "Tỷ lệ kháng tại đơn vị > 10% hoặc chưa biết: phối hợp hai nhóm.", ref: "Bảng 3.2" },
  ] },
  { label: "Khởi trị", points: [
    { text: kind === "hap"
      ? "Không nặng, không nguy cơ đa kháng: đơn trị một thuốc có tác dụng trên P. aeruginosa; nặng hoặc nguy cơ đa kháng: phối hợp hai thuốc, tránh hai beta-lactam."
      : "Không nguy cơ đa kháng và đơn vị < 10% kháng: đơn trị nhóm B; có nguy cơ: phối hợp nhóm B + nhóm C.", ref: kind === "hap" ? "Bảng 3.1" : "Bảng 3.2" },
    { text: "Thêm thuốc chống MRSA khi nặng/có yếu tố nguy cơ hoặc đơn vị có MRSA > 10% hay không có dữ liệu.", ref: kind === "hap" ? "Bảng 3.1" : "Bảng 3.2" },
  ] },
  { label: "Thời gian", points: [
    { text: "Thông thường 7 ngày nếu không phải vi khuẩn đa kháng và đáp ứng tốt; có thể kéo dài theo vi khuẩn và cơ địa.", ref: "Mục 4" },
  ] },
];
const hvMonitoring: DiseaseOverviewData["monitoring"] = {
  efficacy: [
    { text: "Đáp ứng lâm sàng và procalcitonin (ngưỡng ngừng 0,25–0,5 hoặc giảm ≥ 80% so với đỉnh).", ref: "Mục 4" },
  ],
  reassessment: [
    { text: "Đánh giá đáp ứng sau 48–72 giờ; xuống thang hoặc điều chỉnh theo cấy, kháng sinh đồ.", ref: "Mục 3" },
    { text: "Không đáp ứng: hội chẩn dược lâm sàng, vi sinh, tìm căn nguyên khác.", ref: "Mục 4" },
  ],
  safety: [
    { text: "Không dùng aminoglycosid hoặc colistin đơn độc.", ref: "Bảng 3.1–3.2" },
    { text: "Liều trong bảng dành cho người không suy thận; hiệu chỉnh theo mức lọc cầu thận hoặc khi CRRT, IHD, PEX, ECMO.", ref: "Bảng 3.1–3.2" },
  ],
};
const HAP: DiseaseOverviewData = {
  docLabel: HV_DOC,
  cards: hvCards("hap"),
  sourceControl: [],
  monitoring: hvMonitoring,
};
const VAP: DiseaseOverviewData = {
  docLabel: HV_DOC,
  cards: hvCards("vap"),
  sourceControl: [
    { text: "Đơn vị có A. baumannii kháng carbapenem > 25%, bệnh nặng, không đáp ứng sau 48–72 giờ: có thể xem xét colistin (phối hợp).", ref: "Bảng 3.2" },
  ],
  monitoring: hvMonitoring,
};

const COPD: DiseaseOverviewData = {
  docLabel: COPD_DOC,
  cards: [
    { label: "Chỉ định kháng sinh", points: [
      { text: "Đờm mủ VÀ (tăng khó thở HOẶC tăng lượng đờm).", ref: "Mục 3.4.3.d, 3.4.4.d" },
      { text: "Nội trú: thêm chỉ định khi cần thông khí cơ học xâm nhập hoặc không xâm nhập.", ref: "Mục 3.4.4.d" },
    ] },
    { label: "Phân tầng nguy cơ", points: [
      { text: "Kết cục xấu: FEV₁ < 50%, ≥ 2 đợt cấp/12 tháng, nhập viện trong 3 tháng, oxy dài hạn, bệnh tim đồng mắc.", ref: "Mục 3.3.4.d–e" },
      { text: "Nguy cơ P. aeruginosa: thường trú/cấy dương tính, FEV₁ < 30%, giãn phế quản, kháng sinh phổ rộng 3 tháng, corticosteroid kéo dài.", ref: "Mục 3.3.4.d–e" },
    ] },
    { label: "Trước kháng sinh", points: [
      { text: "Có nguy cơ P. aeruginosa: lấy đờm nhuộm Gram, cấy và làm kháng sinh đồ.", ref: "Biểu đồ 3.1–3.2" },
      { text: "Đã dùng kháng sinh trong 3 tháng: chọn nhóm khác nhóm vừa dùng.", ref: "Mục 3.4.3.d" },
    ] },
    { label: "Thời gian", points: [
      { text: "Ngoại trú thường 5–7 ngày (azithromycin theo liệu trình riêng); nội trú thường 7–10 ngày.", ref: "Mục 3.4.3.d, 3.4.4.d" },
    ] },
  ],
  sourceControl: [
    { text: "Nghi viêm phổi (sốt, đông đặc trên X-quang) hoặc nhiễm khuẩn nơi khác: đánh giá và điều trị theo bệnh lý tương ứng.", ref: "Mục 3.4.4.d" },
  ],
  monitoring: {
    efficacy: [
      { text: "Khó thở, lượng đờm và tính chất đờm mủ.", ref: "Mục 3.4.3.d, 3.4.4.d" },
    ],
    reassessment: [
      { text: "Ngoại trú sau 3–5 ngày, nội trú sau 48–72 giờ; không cải thiện: nhuộm Gram, cấy đờm, đánh giá thuốc giãn phế quản, corticosteroid, bệnh đồng mắc.", ref: "Biểu đồ 3.1–3.2" },
      { text: "Đổi theo kháng sinh đồ khi không cải thiện và vi khuẩn kháng thuốc đang dùng; ưu tiên phổ hẹp.", ref: "Biểu đồ 3.2" },
    ],
    safety: [
      { text: "Đối chiếu dị ứng, chức năng thận, bệnh đồng mắc, tác nhân trước đó và độ nhạy kháng sinh tại địa phương.", ref: "Mục 3.4" },
    ],
  },
};

export const OVERVIEWS_MODULES: Record<string, DiseaseOverviewData> = {
  "v8-1": CAP,
  "v8-4": HAP,
  "v8-5": VAP,
  "v8-6": COPD,
};
