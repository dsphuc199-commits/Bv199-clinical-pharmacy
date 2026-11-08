/** QĐ2131/2026, user-supplied DOCX. Human-selected reference cards only.
 * No record in this module is an automatic prescribing recommendation.
 */
export type Setting = "outpatient" | "inpatient";
export type SourceId = "text-out" | "flow-out" | "text-in" | "flow-in" | "table-in" | "risk" | "renal" | "interaction";
export const COPD_SOURCE_URL = "/references/qd2131-2026-copd.docx";
export const COPD_SOURCES: Record<SourceId, string> = {
  "text-out": "Chương 3, mục 3.4.3.d — kháng sinh ngoại trú",
  "flow-out": "Biểu đồ 3.1 — lưu đồ ngoại trú (chú thích hình trong Word: 0.1)",
  "text-in": "Chương 3, mục 3.4.4.d — kháng sinh nội trú",
  "flow-in": "Biểu đồ 3.2 — lưu đồ nội trú (chú thích hình trong Word: 0.2)",
  "table-in": "Bảng 3.4 — kháng sinh đợt cấp nặng nhập viện (trong Word: 0.4)",
  risk: "Chương 3, mục 3.3.4.d–e — phân tầng nguy cơ",
  renal: "Phụ lục 10 — liều theo Clcr, người lớn không lọc máu",
  interaction: "Phụ lục 11 — tương tác thuốc chống chỉ định",
};
export type ReviewId = "symptom" | "out-risk" | "mr" | "piptazo" | "table-header" | "mdr" | "colistin" | "levo" | "mero25" | "cefotax" | "cefep";
export const COPD_REVIEWS: Record<ReviewId, { label: string; detail: string; sources: SourceId[] }> = {
  symptom: { label: "Khác biệt về tiêu chí thay đổi đờm.", detail: "Mục 3.4.3.d và 3.4.4.d: đờm mủ kèm tăng khó thở hoặc tăng số lượng đờm. Biểu đồ 3.1: đờm mủ kèm khó thở tăng hoặc “thể tích hoặc độ quánh đờm tăng”. Tiện ích kiểm tra dùng tiêu chí của phần văn bản; chưa tự mở rộng chỉ định từ độ quánh đờm đơn độc.", sources: ["text-out", "text-in", "flow-out"] },
  "out-risk": { label: "Phạm vi yếu tố kết cục xấu chưa hoàn toàn đồng nhất.", detail: "Biểu đồ 3.1: FEV₁ <50%, ≥2 đợt cấp trong 12 tháng, nhập viện trong 3 tháng, oxy dài hạn và bệnh đồng mắc. Mục 3.3.4.d còn có tuổi ≥65 và thông khí không xâm nhập tại nhà, đồng thời mô tả ≥2 đợt cấp nhẹ–trung bình. Trang phân nhánh theo Biểu đồ 3.1; cần thẩm định người bệnh chỉ có tuổi hoặc thông khí tại nhà.", sources: ["flow-out", "risk"] },
  mr: { label: "Chưa thống nhất liều và khoảng cách liều của dạng MR.", detail: "Mục 3.4.3.d: clarithromycin MR 500 mg, 2 viên/ngày; Phụ lục 10: Clcr ≥30, 500 mg mỗi 12–24 giờ, nặng 500 mg mỗi 12 giờ. Không tự chọn một lịch dùng chung cho mọi chế phẩm MR.", sources: ["text-out", "renal"] },
  piptazo: { label: "Chưa thống nhất 3 hay 4 lần/ngày.", detail: "Mục 3.4.4.d: 4,5 g mỗi 6 giờ; Bảng 3.4: 4,5 g x 3–4 lần/ngày; Phụ lục 10 nhánh hướng đến Pseudomonas, Clcr >40: 4,5 g mỗi 6 giờ.", sources: ["text-in", "table-in", "renal"] },
  "table-header": { label: "Tiêu đề cột trong bảng không khớp nhóm thuốc.", detail: "Bảng 3.4 đặt nhóm ciprofloxacin/ceftazidim/cefepim/piperacillin–tazobactam/carbapenem dưới cột “Không nguy cơ nhiễm P. aeruginosa (*)”, nhưng chú thích (*) mô tả nguy cơ Pseudomonas. Mục 3.4.4.d và Biểu đồ 3.2 đặt các thuốc này ở nhánh có nguy cơ. Trang dùng nhánh của văn bản và lưu đồ, giữ dấu thẩm định tại nhóm chịu ảnh hưởng.", sources: ["text-in", "flow-in", "table-in"] },
  mdr: { label: "Tiêu chí nguy cơ đa kháng khác nhau giữa văn bản và bảng.", detail: "Mục 3.4.4.d: bạch cầu đa nhân trung tính <500/mm³, tiền sử P. aeruginosa đa kháng hoặc cấy chủng đa kháng. Bảng 3.4 còn liệt kê nguy cơ Pseudomonas và/hoặc tiền sử chủng đa kháng, tiền sử dùng cephalosporin phổ rộng/aminoglycosid/carbapenem. Không tự suy ra phối hợp chỉ từ một yếu tố nguy cơ chung.", sources: ["text-in", "table-in"] },
  colistin: { label: "Chưa rõ quy ước hoạt lực và đơn vị liều.", detail: "Bảng 3.4: nạp 5 mg/kg, duy trì 2,5 mg/kg x 2 lần/ngày, không xác định rõ quy ước mg; Phụ lục 10 dùng MUI. Không quy đổi trực tiếp, không tạo liều kê đơn từ hai cách ghi này.", sources: ["table-in", "renal"] },
  levo: { label: "Cần xác định phác đồ liều trước khi hiệu chỉnh suy thận.", detail: "Mục 3.4.3.d: 500 mg/ngày khi không nghi Pseudomonas; nghi Pseudomonas: 750 mg/ngày hoặc 500 mg x 2/ngày. Mục 3.4.4.d: 500–750 mg/ngày. Phụ lục 10 cho Clcr >50 chỉ liệt kê 750 mg mỗi 24 giờ hoặc 500 mg mỗi 12 giờ; không có nhánh riêng cho liều nền 500 mg/ngày và không ghi Clcr đúng 50. Không ngoại suy lịch hiệu chỉnh.", sources: ["text-out", "text-in", "renal"] },
  mero25: { label: "Ngưỡng Clcr 25 mL/phút bị chồng lấp.", detail: "Phụ lục 10: 25–50 mL/phút dùng 1 g mỗi 12 giờ; 10–25 mL/phút dùng 500 mg mỗi 12 giờ. Cần xác định liều ở Clcr đúng 25 mL/phút.", sources: ["renal"] },
  cefotax: { label: "Cần đối chiếu liều nền với bảng hiệu chỉnh.", detail: "Mục 3.4.4.d: 1–2 g x 3 lần/ngày. Phụ lục 10 dùng liều nền 2 g mỗi 8 giờ ở Clcr >90 rồi điều chỉnh khoảng cách. Không áp dụng máy móc bảng này cho mọi liều nền 1 g.", sources: ["text-in", "renal"] },
  cefep: { label: "Cần đối chiếu liều nền với bảng hiệu chỉnh.", detail: "Mục 3.4.4.d: 1–2 g x 2–3 lần/ngày. Phụ lục 10 xây dựng từ liều 2 g mỗi 8 giờ khi Clcr >60. Xác định mức độ nhiễm khuẩn và liều nền trước khi điều chỉnh.", sources: ["text-in", "renal"] },
};
/** Source evidence only: never a prescribing dose or unit-conversion rule. */
export const COPD_COLISTIN_SOURCE = {
  table: "Liều nạp 5 mg/kg; sau đó 2,5 mg/kg x 2 lần/ngày, truyền tĩnh mạch. Chưa xác định quy ước hoạt lực của mg.",
  loading: [["≤30 kg", "4 MUI"], [">30–40 kg", "5 MUI"], [">40–50 kg", "6 MUI"], [">50–60 kg", "7 MUI"], [">60–70 kg", "8 MUI"], [">70 kg", "9 MUI"]],
  maintenance: [["Clcr ≤30 mL/phút", "2 MUI mỗi 12 giờ"], ["Clcr >30–50 mL/phút", "3 MUI mỗi 12 giờ"], ["Clcr >50–80 mL/phút", "4 MUI mỗi 12 giờ"], ["Clcr >80–130 mL/phút", "3 MUI mỗi 8 giờ"], ["Clcr >130 mL/phút", "4 MUI mỗi 8 giờ"]],
  autoSuggest: false,
} as const;

export type DrugId = "azithro" | "clari" | "clarimr" | "cefuro" | "cefpod" | "cefdinir" | "amoxclav" | "levo" | "moxi" | "cipro-po" | "cipro-iv" | "ceftriax" | "cefotax" | "ceftaz" | "cefep" | "piptazo" | "imi" | "mero" | "amikacin" | "tobra" | "colistin";
type RenalRow = [clcr: string, dose: string];
export type DrugReference = { name: string; renal: RenalRow[]; renalNote?: string; interactions: string[]; cautions?: string[] };
const QT = "Haloperidol hoặc thioridazin: chống chỉ định khi có hội chứng QT kéo dài; các trường hợp khác nên tránh phối hợp, đánh giá nguy cơ và điện giải nếu bắt buộc dùng.";
const DOM = "Domperidon: chống chỉ định phối hợp do nguy cơ kéo dài QT, xoắn đỉnh.";
const NO_LIST = ["Không có cặp tương tác riêng cho hoạt chất này trong danh sách kháng sinh của Phụ lục 11. Vẫn phải rà soát toàn bộ thuốc đang dùng; đây không phải danh sách mọi tương tác có thể xảy ra."];
const FQ = ["Cân nhắc nguy cơ trên gân, cơ, tim mạch, thần kinh–tâm thần và rối loạn đường huyết, đặc biệt ở người cao tuổi."];
const CLARI = [DOM, "Ivabradin, ticagrelor, simvastatin/lovastatin, alcaloid nấm cựa gà, ranolazin, tolvaptan, felodipin/lercanidipin, quetiapin hoặc everolimus: chống chỉ định phối hợp; lựa chọn thuốc thay thế phù hợp.", "Colchicin: chống chỉ định nếu suy gan hoặc suy thận; chức năng gan thận bình thường vẫn nên tránh. Nếu bắt buộc, giảm liều colchicin, liều tiếp theo sau 3 ngày và theo dõi độc tính.", "Fluconazol: chống chỉ định nếu có QT kéo dài; các trường hợp khác nên tránh, đánh giá nguy cơ nếu bắt buộc dùng.", QT, "Saquinavir/ritonavir: chống chỉ định nếu QTc >450 ms; nếu phối hợp theo dõi ECG mỗi 3–4 ngày, ngừng một hoặc cả hai thuốc khi QTc >480 ms hoặc tăng >20 ms so với ban đầu."];
export const COPD_DRUGS: Record<DrugId, DrugReference> = {
  azithro: { name: "Azithromycin", renal: [["Suy thận", "Không cần hiệu chỉnh liều."]], interactions: [DOM, QT] },
  clari: { name: "Clarithromycin", renal: [[">50", "500 mg mỗi 12 giờ"], ["10–50", "500 mg mỗi 12–24 giờ"], ["<10", "500 mg mỗi 24 giờ"]], interactions: CLARI },
  clarimr: { name: "Clarithromycin MR", renal: [["≥30", "500 mg mỗi 12–24 giờ; nặng: 500 mg mỗi 12 giờ"], ["<30", "Không nên dùng dạng giải phóng kéo dài"]], interactions: CLARI, renalNote: "Cần thẩm định lịch dùng với liều 1.000 mg/ngày và đúng chế phẩm MR." },
  cefuro: { name: "Cefuroxim axetil", renal: [["≥30", "500 mg mỗi 12 giờ"], ["10–29", "500 mg mỗi 24 giờ"], ["<10", "500 mg mỗi 48 giờ"]], interactions: NO_LIST },
  cefpod: { name: "Cefpodoxim", renal: [["≥10", "200 mg mỗi 12 giờ"], ["<10", "200 mg mỗi 24 giờ"]], renalNote: "Phụ lục 10 viết “Cefodoxim”; đã chuẩn hóa tên hiển thị thành cefpodoxim, giữ nguyên ngưỡng và liều để đối chiếu.", interactions: NO_LIST },
  cefdinir: { name: "Cefdinir", renal: [["≥30", "300 mg mỗi 12 giờ"], ["<30", "300 mg mỗi 24 giờ"]], interactions: NO_LIST },
  amoxclav: { name: "Amoxicillin/acid clavulanic", renal: [[">30", "500/125 mg mỗi 8 giờ hoặc 875/125 mg mỗi 12 giờ; nặng: 875/125 mg mỗi 8 giờ"], ["10–30", "250–500 mg, tính theo amoxicillin, mỗi 12 giờ"], ["<10", "250–500 mg, tính theo amoxicillin, mỗi 24 giờ"]], renalNote: "Kiểm tra hàm lượng acid clavulanic và dạng bào chế; liều trong phần chính tính theo amoxicillin.", interactions: NO_LIST },
  levo: { name: "Levofloxacin", renal: [[">50", "750 mg mỗi 24 giờ hoặc 500 mg mỗi 12 giờ"], ["20–49", "750 mg mỗi 48 giờ hoặc 500 mg mỗi 24 giờ"], ["<20", "Nạp 750 mg; duy trì 500 mg mỗi 48 giờ"]], renalNote: "Cần thẩm định: chưa có nhánh hiệu chỉnh riêng cho liều nền 500 mg/ngày; thiếu ngưỡng Clcr đúng 50 mL/phút.", interactions: [DOM, QT], cautions: FQ },
  moxi: { name: "Moxifloxacin", renal: [["Suy thận", "Không cần hiệu chỉnh; 400 mg mỗi 24 giờ"]], interactions: [DOM, "Thioridazin, amiodaron, citalopram/escitalopram, clorpromazin, haloperidol, piperaquin hoặc sotalol: chống chỉ định khi có hội chứng QT kéo dài; các trường hợp khác nên tránh, đánh giá nguy cơ và rối loạn điện giải nếu bắt buộc phối hợp."], cautions: FQ },
  "cipro-po": { name: "Ciprofloxacin", renal: [[">50", "250–750 mg mỗi 12 giờ"], ["30–50", "250–500 mg mỗi 12 giờ"], ["5–29", "500–750 mg mỗi 24 giờ"], ["<5, không lọc máu", "Không có thông tin"]], renalNote: "Áp dụng dạng uống giải phóng thông thường; không dùng bảng này cho dạng giải phóng kéo dài.", interactions: [DOM, "Tizanidin, duloxetin hoặc agomelatin: chống chỉ định phối hợp.", "Thioridazin: chống chỉ định khi có QT kéo dài; các trường hợp khác nên tránh phối hợp."], cautions: FQ },
  "cipro-iv": { name: "Ciprofloxacin", renal: [["≥30", "200–400 mg mỗi 8–12 giờ"], ["5–29", "200–400 mg mỗi 18–24 giờ"], ["<5, không lọc máu", "Không có thông tin"]], interactions: [DOM, "Tizanidin, duloxetin hoặc agomelatin: chống chỉ định phối hợp.", "Thioridazin: chống chỉ định khi có QT kéo dài; các trường hợp khác nên tránh phối hợp."], cautions: FQ },
  ceftriax: { name: "Ceftriaxon", renal: [["Suy thận", "Không cần hiệu chỉnh; 1–2 g mỗi 24 giờ"], ["Đồng thời suy gan và suy thận", "Không quá 2 g mỗi 24 giờ"]], interactions: ["Calci đường tĩnh mạch, Ringer lactat hoặc dinh dưỡng tĩnh mạch chứa calci: không trộn chung đường truyền. Dùng đường truyền riêng hoặc truyền lần lượt và tráng rửa bằng dung môi tương hợp."] },
  cefotax: { name: "Cefotaxim", renal: [[">90", "2 g mỗi 8 giờ"], ["51–90", "2 g mỗi 8–12 giờ"], ["10–50", "2 g mỗi 12–24 giờ"], ["<10", "2 g mỗi 24 giờ"]], renalNote: "Bảng hiệu chỉnh dùng liều nền 2 g; cần thẩm định trước khi áp dụng cho liều nền 1 g.", interactions: NO_LIST },
  ceftaz: { name: "Ceftazidim", renal: [[">50", "1–2 g mỗi 8–12 giờ"], ["10–50", "1–2 g mỗi 12–24 giờ"], ["<10", "1–2 g mỗi 24 giờ"]], interactions: NO_LIST },
  cefep: { name: "Cefepim", renal: [[">60", "2 g mỗi 8 giờ"], ["30–60", "2 g mỗi 12 giờ"], ["11–29", "2 g mỗi 24 giờ"], ["<11", "1 g mỗi 24 giờ"]], renalNote: "Bảng hiệu chỉnh dùng liều nền 2 g mỗi 8 giờ; cần thẩm định khi khởi đầu bằng lịch liều khác.", interactions: NO_LIST },
  piptazo: { name: "Piperacillin/tazobactam", renal: [[">40", "4,5 g mỗi 6 giờ"], ["20–40", "4,5 g mỗi 8 giờ"], ["<20", "4,5 g mỗi 12 giờ"]], renalNote: "Nhánh hướng đến Pseudomonas; không áp dụng lịch dành cho nhiễm khuẩn không hướng đến Pseudomonas.", interactions: NO_LIST },
  imi: { name: "Imipenem/cilastatin", renal: [["≥90", "500 mg mỗi 6 giờ hoặc 1 g mỗi 8 giờ; nhạy cảm trung bình: 1 g mỗi 6 giờ"], ["60–89", "500 mg mỗi 6 giờ; nhạy cảm trung bình: 750 mg mỗi 8 giờ"], ["30–59", "500 mg mỗi 8 giờ; nhạy cảm trung bình: 500 mg mỗi 6 giờ"], ["15–29", "200 mg mỗi 6 giờ hoặc 500 mg mỗi 12 giờ; nhạy cảm trung bình: 500 mg mỗi 12 giờ"], ["<15, không lọc máu", "Không khuyến cáo sử dụng"]], renalNote: "Liều tính theo imipenem.", interactions: NO_LIST },
  mero: { name: "Meropenem", renal: [[">50", "1 g mỗi 8 giờ"], ["25–50", "1 g mỗi 12 giờ"], ["10–25", "500 mg mỗi 12 giờ"], ["<10", "500 mg mỗi 24 giờ"]], renalNote: "Cần thẩm định tại Clcr đúng 25 mL/phút vì chồng lấp hai khoảng.", interactions: NO_LIST },
  amikacin: { name: "Amikacin", renal: [["≥80", "20 mg/kg mỗi 24 giờ"], ["60–79", "15–20 mg/kg mỗi 24 giờ"], ["40–59", "15–20 mg/kg mỗi 36 giờ"], ["30–39", "15 mg/kg mỗi 48 giờ"], ["20–29", "12 mg/kg mỗi 48 giờ"], ["10–19", "10 mg/kg mỗi 48 giờ"], ["<10", "7,5 mg/kg mỗi 48 giờ"]], renalNote: "Ưu tiên giám sát nồng độ thuốc. Khi Clcr <40 và có TDM: nạp 15–20 mg/kg, liều tiếp theo dựa trên nồng độ. Các hàng Clcr là phương án khi không định lượng được nồng độ.", interactions: NO_LIST },
  tobra: { name: "Tobramycin", renal: [["≥80", "7 mg/kg mỗi 24 giờ"], ["60–79", "5 mg/kg mỗi 24 giờ"], ["40–59", "4 mg/kg mỗi 24 giờ"], ["30–39", "5 mg/kg mỗi 48 giờ"], ["20–29", "4 mg/kg mỗi 48 giờ"], ["10–19", "3 mg/kg mỗi 48 giờ"], ["<10", "2,5 mg/kg mỗi 48 giờ"]], renalNote: "Xác định lịch liều theo chức năng thận; theo dõi nồng độ khi có điều kiện.", interactions: NO_LIST },
  colistin: { name: "Colistin", renal: [], renalNote: "Cần thẩm định dạng chế phẩm, quy ước hoạt lực mg và MUI, liều nạp/duy trì, cân nặng và chức năng thận trước khi kê đơn. Không tự chuyển đổi đơn vị.", interactions: NO_LIST },
};

export type CopdDose = { drugId: DrugId; dose: string; route: "Uống" | "Truyền tĩnh mạch" | "Uống hoặc truyền tĩnh mạch"; interval: string; note?: string };
export type GroupId = "out-low" | "out-risk" | "out-colonized" | "out-other" | "in-low" | "in-pseudo" | "in-mdr";
export type CopdRegimen = { id: string; groupId: GroupId; kind: "monotherapy" | "combination"; drugs: CopdDose[]; duration: string; condition?: string; sourceIds: SourceId[]; reviewIds: ReviewId[]; autoSuggest: false };
export type CopdGroup = { id: GroupId; setting: Setting; title: string; criteria: string[]; sourceIds: SourceId[]; reviewIds: ReviewId[] };
export const COPD_GROUPS: CopdGroup[] = [
  { id: "out-low", setting: "outpatient", title: "Không có yếu tố nguy cơ kết cục xấu", criteria: ["Không có FEV₁ <50%, ≥2 đợt cấp trong 12 tháng, nhập viện vì đợt cấp trong 3 tháng, oxy dài hạn tại nhà hoặc bệnh đồng mắc như suy tim/bệnh tim thiếu máu cục bộ."], sourceIds: ["flow-out"], reviewIds: ["out-risk"] },
  { id: "out-risk", setting: "outpatient", title: "Có nguy cơ kết cục xấu, không có nguy cơ nhiễm P. aeruginosa", criteria: ["Có ít nhất một yếu tố: FEV₁ <50%, ≥2 đợt cấp trong 12 tháng, nhập viện vì đợt cấp trong 3 tháng, oxy dài hạn tại nhà hoặc bệnh đồng mắc.", "Không có Pseudomonas thường trú/cấy dương tính trong năm qua; không có các yếu tố nguy cơ Pseudomonas khác."], sourceIds: ["flow-out"], reviewIds: ["out-risk"] },
  { id: "out-colonized", setting: "outpatient", title: "P. aeruginosa thường trú hoặc đã phân lập trong năm qua", criteria: ["Có nguy cơ kết cục xấu và Pseudomonas thường trú mạn tính hoặc cấy đờm dương tính trong năm qua.", "Lấy đờm làm kháng sinh đồ."], sourceIds: ["flow-out"], reviewIds: [] },
  { id: "out-other", setting: "outpatient", title: "Có các yếu tố nguy cơ P. aeruginosa khác", criteria: ["Có nguy cơ kết cục xấu, không có Pseudomonas thường trú/cấy dương tính trong năm qua.", "Có ít nhất một yếu tố: FEV₁ <30%, giãn phế quản trên X-quang/CT, kháng sinh phổ rộng trong 3 tháng hoặc corticosteroid toàn thân kéo dài.", "Lấy đờm làm kháng sinh đồ."], sourceIds: ["flow-out"], reviewIds: [] },
  { id: "in-low", setting: "inpatient", title: "Không có nguy cơ nhiễm P. aeruginosa", criteria: ["Không có tiêu chí Pseudomonas thường trú/cấy dương tính, FEV₁ <30%, giãn phế quản, kháng sinh phổ rộng gần đây hoặc corticosteroid toàn thân kéo dài."], sourceIds: ["text-in", "flow-in"], reviewIds: [] },
  { id: "in-pseudo", setting: "inpatient", title: "Có nguy cơ nhiễm P. aeruginosa, chưa xác định đa kháng", criteria: ["Pseudomonas thường trú/cấy dương tính, FEV₁ <30%, giãn phế quản, kháng sinh phổ rộng trong 3 tháng hoặc corticosteroid toàn thân kéo dài.", "Đánh giá thêm nhập viện gần đây, thường xuyên dùng kháng sinh (4 đợt/năm), GOLD 4/giãn phế quản hoặc đã phân lập Pseudomonas.", "Nhuộm Gram, cấy đờm và làm kháng sinh đồ."], sourceIds: ["text-in", "flow-in", "table-in"], reviewIds: ["table-header"] },
  { id: "in-mdr", setting: "inpatient", title: "Nghi ngờ hoặc xác định P. aeruginosa đa kháng", criteria: ["Bạch cầu đa nhân trung tính <500/mm³, tiền sử Pseudomonas đa kháng hoặc cấy ra chủng đa kháng.", "Đánh giá thêm tiền sử cephalosporin phổ rộng, aminoglycosid hoặc carbapenem; không tự coi mọi nguy cơ Pseudomonas là đa kháng.", "Chỉ cân nhắc phối hợp khi điều kiện lâm sàng và kháng sinh đồ phù hợp."], sourceIds: ["text-in", "table-in"], reviewIds: ["mdr", "table-header"] },
];
const OUT_DURATION = "Thường 5–7 ngày";
const IN_DURATION = "Thường 7–10 ngày";
const po = (drugId: DrugId, dose: string, interval: string, note?: string): CopdDose => ({ drugId, dose, route: "Uống", interval, note });
const iv = (drugId: DrugId, dose: string, interval: string, note?: string): CopdDose => ({ drugId, dose, route: "Truyền tĩnh mạch", interval, note });
const both = (drugId: DrugId, dose: string, interval: string): CopdDose => ({ drugId, dose, route: "Uống hoặc truyền tĩnh mạch", interval });
function mono(id: string, groupId: GroupId, drug: CopdDose, reviewIds: ReviewId[] = [], duration?: string): CopdRegimen {
  const inpatient = groupId.startsWith("in-");
  return { id, groupId, kind: "monotherapy", drugs: [drug], duration: duration ?? (inpatient ? IN_DURATION : OUT_DURATION), sourceIds: inpatient ? ["text-in", "flow-in"] : ["text-out", "flow-out"], reviewIds, autoSuggest: false };
}
const bases = [iv("cipro-iv", "400 mg", "2–3 lần/ngày"), iv("ceftaz", "1–2 g", "2–3 lần/ngày"), iv("cefep", "1–2 g", "2–3 lần/ngày"), iv("piptazo", "4,5 g", "Mỗi 6 giờ (4 lần/ngày)"), iv("imi", "500 mg", "Mỗi 6 giờ (4 lần/ngày)", "Liều tính theo imipenem."), iv("mero", "1 g", "Mỗi 8 giờ (3 lần/ngày)")];
const baseReviews = (id: DrugId): ReviewId[] => id === "piptazo" ? ["piptazo"] : id === "mero" ? ["mero25"] : id === "cefep" ? ["cefep"] : [];
const adjuncts = [iv("amikacin", "15–20 mg/kg/ngày", "Tổng liều/ngày; xác định khoảng cách theo Clcr và TDM"), iv("tobra", "5–7 mg/kg/ngày", "Tổng liều/ngày; xác định khoảng cách theo Clcr và TDM"), iv("colistin", "Chưa xác lập liều kê đơn", "Cần thẩm định đơn vị và chế phẩm")];
export const COPD_REGIMENS: CopdRegimen[] = [
  mono("azi5", "out-low", po("azithro", "Ngày 1: 500 mg; ngày 2–5: 250 mg", "1 lần/ngày", "Cân nhắc nguy cơ kháng macrolid."), [], "5 ngày"),
  mono("azi3", "out-low", po("azithro", "500 mg", "1 lần/ngày", "Cân nhắc nguy cơ kháng macrolid."), [], "3 ngày"),
  mono("clari", "out-low", po("clari", "500 mg", "2 lần/ngày", "Cân nhắc nguy cơ kháng macrolid.")),
  mono("clarimr", "out-low", po("clarimr", "1.000 mg/ngày (2 viên 500 mg)", "Cần xác định theo chế phẩm MR"), ["mr"]),
  { ...mono("cefuro", "out-low", po("cefuro", "500 mg", "Mỗi 12 giờ (2 lần/ngày)", "Clcr ≥30 mL/phút; người lớn không lọc máu.")), sourceIds: ["flow-out", "renal"] },
  mono("cefpod", "out-low", po("cefpod", "200 mg", "2 lần/ngày")),
  mono("cefdinir", "out-low", po("cefdinir", "300 mg", "2 lần/ngày")),
  mono("amox500", "out-risk", po("amoxclav", "500 mg", "3 lần/ngày", "Tính theo amoxicillin; kiểm tra hàm lượng acid clavulanic.")),
  mono("amox875", "out-risk", po("amoxclav", "875 mg", "2 lần/ngày", "Tính theo amoxicillin; kiểm tra hàm lượng acid clavulanic.")),
  { ...mono("amox875severe", "out-risk", po("amoxclav", "875 mg", "3 lần/ngày", "Tính theo amoxicillin.")), condition: "Trường hợp nặng; đánh giá lại sự phù hợp điều trị ngoại trú." },
  mono("out-levo", "out-risk", po("levo", "500 mg", "1 lần/ngày"), ["levo"]),
  mono("out-moxi", "out-risk", po("moxi", "400 mg", "1 lần/ngày")),
  mono("colonized-cipro", "out-colonized", po("cipro-po", "500 mg", "2 lần/ngày")),
  mono("other-cipro", "out-other", po("cipro-po", "500 mg", "2 lần/ngày")),
  mono("other-levo750", "out-other", po("levo", "750 mg", "1 lần/ngày"), ["levo"]),
  mono("other-levo500", "out-other", po("levo", "500 mg", "2 lần/ngày"), ["levo"]),
  mono("ceftriax", "in-low", iv("ceftriax", "1–2 g", "1 lần/ngày")),
  mono("cefotax", "in-low", iv("cefotax", "1–2 g", "3 lần/ngày"), ["cefotax"]),
  mono("in-moxi", "in-low", both("moxi", "400 mg", "1 lần/ngày")),
  mono("in-levo", "in-low", both("levo", "500–750 mg", "1 lần/ngày"), ["levo"]),
  ...bases.map(d => mono(`in-${d.drugId}`, "in-pseudo", d, ["table-header", ...baseReviews(d.drugId)])),
  ...bases.flatMap(base => adjuncts.map((extra): CopdRegimen => ({ id: `mdr-${base.drugId}-${extra.drugId}`, groupId: "in-mdr", kind: "combination", drugs: [base, extra], duration: IN_DURATION, condition: "Cân nhắc phối hợp theo kháng sinh đồ khi nghi ngờ hoặc xác định P. aeruginosa đa kháng.", sourceIds: ["text-in", "flow-in", "table-in"], reviewIds: ["mdr", "table-header", ...baseReviews(base.drugId), ...(extra.drugId === "colistin" ? ["colistin" as const] : [])], autoSuggest: false }))),
];
export const COPD_RULES = {
  symptomIndication: { all: ["purulent"], any: ["increasedDyspnea", "increasedSputum"], sourceIds: ["text-out", "text-in", "flow-out"] },
  ventilationIndication: { setting: "inpatient", any: ["invasive", "noninvasive"], sourceIds: ["text-in"] },
} as const;
export function hasCopdSymptomIndication(symptoms: { purulent: boolean; increasedDyspnea: boolean; increasedSputum: boolean }): boolean {
  return COPD_RULES.symptomIndication.all.every(key => symptoms[key]) && COPD_RULES.symptomIndication.any.some(key => symptoms[key]);
}
export function hasCopdIndication(setting: Setting, symptoms: Parameters<typeof hasCopdSymptomIndication>[0], ventilated = false): boolean {
  return hasCopdSymptomIndication(symptoms) || (setting === COPD_RULES.ventilationIndication.setting && ventilated);
}
