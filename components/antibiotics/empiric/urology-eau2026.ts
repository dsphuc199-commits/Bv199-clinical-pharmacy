/*
  Tiet nieu – du lieu cong cu chon khang sinh theo EAU 2026 (tab Quoc te).
  Nguon (doc tu PDF nguoi dung cung cap, 18/11/2026):
  - UI: EAU Guidelines on Urological Infections, Limited Update March 2026.
  - URO: EAU Guidelines on Urolithiasis, Limited Update March 2026.
  ref = vi tri trong tai lieu goc (khong hien thi). Grade: EAU-S = Strong, EAU-W = Weak.

  Diem bat thuong trong ban goc, da xu ly co chu y:
  - UI Bang nam (3.17.3): "Bladder instillations: 200 ml/L" – don vi nghi loi in, KHONG dua vao;
    dung lieu ro rang o phan loi 3.17.3.b (50 mg/L, 5 ngay).
  - UI 3.17.3.b noi echinocandin kem tham nuoc tieu, khong phu hop viem bang quang, trong khi bang va khuyen cao
    van liet ke caspofungin cho the khu tru -> giu dong caspofungin kem canh bao.
  - UI Bang 6 ghi levofloxacin "oral" trong bang duong tiem -> giu lieu, khong ghi duong dung o dong nay.
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export type EauBlock = { title: string; lead?: string; items: RxItem[] };
export type EauForm = { id: string; label: string; criteria: string; headline: string; blocks: EauBlock[]; avoid: RxItem[]; notes: string[] };

const S = "EAU-S";
const W = "EAU-W";
const r = (role: string, text: string, dose: string | undefined, grade: string | undefined, ref: string): RxItem => ({ role, text, dose, grade, ref });

const FIRST = "Đầu tay";
const ALT = "Thay thế";
const LAST = "Lựa chọn cuối";
const DO = "Thực hiện";

/* ---------- Viem bang quang ---------- */
const NITRO_ROWS = [
  r(FIRST, "Nitrofurantoin monohydrate/macrocrystals", "100 mg × 2 lần/ngày, 5 ngày", S, "UI Bảng 3"),
  r(FIRST, "Nitrofurantoin macrocrystal phóng thích kéo dài", "100 mg × 2 lần/ngày, 5 ngày", S, "UI Bảng 3"),
  r(FIRST, "Nitrofurantoin macrocrystal", "50–100 mg × 4 lần/ngày, 5 ngày", S, "UI Bảng 3"),
];
const RENAL_CYSTITIS = "Suy thận: phần lớn kháng sinh không cần chỉnh liều cho đến khi GFR < 20 mL/phút, trừ thuốc độc với thận như aminoglycosid. Nitrofurantoin chống chỉ định khi eGFR < 30 mL/phút/1,73 m². Lợi tiểu quai phối hợp cephalosporin gây độc thận.";

const CYSTITIS_WOMEN: EauForm = {
  id: "women",
  label: "Phụ nữ",
  criteria: "Tiểu buốt, tiểu nhiều lần, tiểu gấp; không tiết dịch âm đạo; không sốt, rét run, đau hông lưng.",
  headline: "Fosfomycin trometamol, pivmecillinam, nitrofurantoin hoặc nitroxolin",
  blocks: [
    { title: "Lựa chọn đầu tay", items: [
      r(FIRST, "Fosfomycin trometamol", "3 g, liều duy nhất", S, "UI Bảng 3"),
      r(FIRST, "Pivmecillinam", "400 mg × 3 lần/ngày, 3–5 ngày", S, "UI Bảng 3"),
      ...NITRO_ROWS,
      r(FIRST, "Nitroxolin", "250 mg × 3 lần/ngày, 5 ngày", S, "UI Bảng 3"),
    ] },
    { title: "Thay thế", lead: "Cephalosporin uống không dùng kinh nghiệm thường quy vì tác động sinh thái, chỉ dùng ở trường hợp chọn lọc.", items: [
      r(ALT, "Cefadroxil", "500 mg × 2 lần/ngày, 3 ngày", undefined, "UI Bảng 3"),
      r(ALT, "Cefpodoxim", "100 mg × 2 lần/ngày, 3 ngày", undefined, "UI Bảng 3"),
    ] },
    { title: "Chỉ khi tỷ lệ E. coli kháng tại chỗ < 20%", items: [
      r(ALT, "Trimethoprim", "200 mg × 2 lần/ngày, 5 ngày", undefined, "UI Bảng 3"),
      r(ALT, "Trimethoprim-sulfamethoxazol", "160/800 mg × 2 lần/ngày, 3 ngày", undefined, "UI Bảng 3"),
    ] },
  ],
  avoid: [
    r("Không dùng", "Aminopenicilin", "Tỷ lệ kháng cao, chọn lọc vi khuẩn sinh ESBL", S, "UI 3.4.4.e"),
    r("Không dùng", "Fluoroquinolon", "Chỉ dùng khi các kháng sinh thường được khuyến cáo không phù hợp", S, "UI 3.4.4.b, 3.4.4.e"),
    r("Không dùng kinh nghiệm", "Ampicilin-sulbactam, amoxicilin-clavulanat", "Tác động sinh thái; có thể dùng ở trường hợp chọn lọc", undefined, "UI 3.4.4.b"),
  ],
  notes: [
    "Cấy nước tiểu khi nghi nhiễm khuẩn toàn thân, triệu chứng không hết hoặc tái phát trong 4 tuần sau điều trị, triệu chứng không điển hình, nguy cơ vi khuẩn kháng thuốc, hoặc có thai.",
    "Người bệnh không cao tuổi có thể chọn điều trị không kháng sinh sau khi cùng thầy thuốc cân nhắc: triệu chứng có thể nặng hơn và nguy cơ viêm thận bể thận tăng nhẹ.",
    "Triệu chứng không hết khi kết thúc điều trị hoặc tái phát trong 2 tuần: cấy và làm kháng sinh đồ, điều trị lại 7 ngày bằng thuốc khác.",
    "Không xét nghiệm nước tiểu thường quy sau điều trị nếu hết triệu chứng.",
    RENAL_CYSTITIS,
  ],
};

const CYSTITIS_PREG: EauForm = {
  id: "pregnant",
  label: "Phụ nữ có thai",
  criteria: "Viêm bàng quang trong thai kỳ. Luôn cấy nước tiểu.",
  headline: "Điều trị ngắn ngày, chọn thuốc theo tuổi thai",
  blocks: [
    { title: "Thuốc có thể dùng", items: [
      r("Có thể dùng", "Fosfomycin trometamol", "3 g, liều duy nhất", undefined, "UI 3.4.4.c.1, Bảng 3"),
      r("Có thể dùng", "Penicilin, cephalosporin", undefined, undefined, "UI 3.4.4.c.1"),
      r("Có điều kiện", "Nitrofurantoin monohydrate/macrocrystals", "100 mg × 2 lần/ngày, 5 ngày. Không dùng khi thiếu G6PD và giai đoạn cuối thai kỳ", undefined, "UI 3.4.4.c.1, Bảng 3"),
      r("Có điều kiện", "Trimethoprim", "200 mg × 2 lần/ngày, 5 ngày. Không dùng trong 3 tháng đầu; chỉ khi E. coli kháng tại chỗ < 20%", undefined, "UI 3.4.4.c.1, Bảng 3"),
      r("Có điều kiện", "Trimethoprim-sulfamethoxazol", "160/800 mg × 2 lần/ngày, 3 ngày. Không dùng trong 3 tháng cuối; chỉ khi E. coli kháng tại chỗ < 20%", undefined, "UI 3.4.4.c.1, Bảng 3"),
    ] },
  ],
  avoid: [],
  notes: [RENAL_CYSTITIS],
};

const CYSTITIS_MEN: EauForm = {
  id: "men",
  label: "Nam giới",
  criteria: "Viêm bàng quang khu trú ở nam giới, không có dấu hiệu toàn thân. Cần loại trừ tổn thương tuyến tiền liệt.",
  headline: "Pivmecillinam hoặc nitrofurantoin ở nam giới trẻ; trimethoprim-sulfamethoxazol 7 ngày",
  blocks: [
    { title: "Phác đồ", items: [
      r("Nam giới trẻ", "Pivmecillinam", "400 mg × 3 lần/ngày", undefined, "UI 3.4.4.d, Bảng 3"),
      r("Nam giới trẻ, đã loại trừ tổn thương tuyến tiền liệt", "Nitrofurantoin monohydrate/macrocrystals", "100 mg × 2 lần/ngày. Chưa có dữ liệu về thời gian điều trị tối ưu", undefined, "UI 3.4.4.d, Bảng 3"),
      r("Nam giới", "Trimethoprim-sulfamethoxazol", "160/800 mg × 2 lần/ngày, 7 ngày", undefined, "UI Bảng 3"),
    ] },
  ],
  avoid: [r("Không dùng", "Aminopenicilin, fluoroquinolon", "Cho viêm bàng quang", S, "UI 3.4.4.e")],
  notes: ["Có sốt, viêm thận bể thận, tái phát hoặc nghi yếu tố phức tạp: điều trị tối thiểu 2 tuần vì tuyến tiền liệt thường bị tổn thương.", RENAL_CYSTITIS],
};

const CYSTITIS_RECUR: EauForm = {
  id: "recurrent",
  label: "Tái phát",
  criteria: "Ít nhất 3 đợt/năm hoặc 2 đợt trong 6 tháng gần nhất. Khẳng định bằng cấy nước tiểu.",
  headline: "Tư vấn hành vi, biện pháp không kháng sinh, sau đó mới dự phòng kháng sinh",
  blocks: [
    { title: "Bước 1. Biện pháp không kháng sinh", items: [
      r("Hậu mãn kinh", "Estrogen đặt âm đạo", undefined, S, "UI 3.5.4"),
      r("Không bất thường đường tiết niệu", "Methenamin hippurat", "2 lần/ngày", S, "UI 3.5.3.c.9, 3.5.4"),
      r("Tiền mãn kinh, uống < 1,5 L/ngày", "Uống thêm nước", "Thêm 1,5 L/ngày", W, "UI 3.5.3.b, 3.5.4"),
      r("Lựa chọn bổ sung", "Sản phẩm nam việt quất", "Chất lượng bằng chứng thấp, kết quả chưa thống nhất", S, "UI 3.5.4"),
      r("Lựa chọn bổ sung", "Probiotic chứa chủng đã chứng minh hiệu quả", undefined, W, "UI 3.5.4"),
      r("Lựa chọn bổ sung", "Xyloglucan + hibiscus + propolis, hoặc Centaurii herba + Levistici radix + Rosmarini folium", undefined, W, "UI 3.5.4"),
      r("Lựa chọn bổ sung", "D-mannose", "Bằng chứng yếu, chưa thống nhất", W, "UI 3.5.4"),
      r("Thất bại biện pháp ít xâm lấn", "Bơm bàng quang acid hyaluronic, có hoặc không kèm chondroitin sulfat", undefined, W, "UI 3.5.4"),
    ] },
    { title: "Bước 2. Dự phòng kháng sinh khi bước 1 thất bại", lead: "Dùng liên tục liều thấp hoặc sau giao hợp, tùy các đợt có liên quan đến giao hợp hay không. Các nghiên cứu dùng 3–12 tháng.", items: [
      r("Lựa chọn", "Nitrofurantoin", "50 mg hoặc 100 mg × 1 lần/ngày", S, "UI 3.5.3.d.1"),
      r("Lựa chọn", "Fosfomycin trometamol", "3 g × 1 lần/tuần", S, "UI 3.5.3.d.1"),
      r("Lựa chọn", "Trimethoprim", "100 mg × 1 lần/ngày", S, "UI 3.5.3.d.1"),
      r("Thai kỳ", "Cefalexin", "125 mg hoặc 250 mg × 1 lần/ngày", S, "UI 3.5.3.d.1"),
      r("Thai kỳ", "Cefaclor", "250 mg × 1 lần/ngày", S, "UI 3.5.3.d.1"),
    ] },
  ],
  avoid: [],
  notes: [
    "Chọn kháng sinh dự phòng theo tình hình đề kháng tại chỗ; tư vấn tác dụng không mong muốn.",
    "Người bệnh tuân thủ tốt có thể tự điều trị ngắn ngày, chọn thuốc như viêm bàng quang cấp.",
    "Phụ nữ dưới 40 tuổi không có yếu tố nguy cơ: không nội soi bàng quang hoặc siêu âm toàn bộ ổ bụng thường quy.",
  ],
};

const ABU: EauForm = {
  id: "abu",
  label: "Khuẩn niệu không triệu chứng",
  criteria: "Cấy nước tiểu giữa dòng ≥ 10⁵ CFU/mL, không có triệu chứng: nữ 2 mẫu liên tiếp, nam 1 mẫu.",
  headline: "Phần lớn không sàng lọc, không điều trị",
  blocks: [
    { title: "Sàng lọc và điều trị", lead: "Chọn kháng sinh theo kháng sinh đồ, không điều trị kinh nghiệm.", items: [
      r("Có chỉ định", "Trước thủ thuật tiết niệu xâm phạm niêm mạc", undefined, S, "UI 3.3.7"),
      r("Có chỉ định", "Phụ nữ có thai", "Điều trị ngắn ngày chuẩn hoặc fosfomycin trometamol liều duy nhất", W, "UI 3.3.7"),
    ] },
    { title: "Không sàng lọc, không điều trị", items: [
      r("Không chỉ định", "Phụ nữ không có yếu tố nguy cơ; đái tháo đường kiểm soát tốt; phụ nữ sau mãn kinh; người cao tuổi sống tại cơ sở chăm sóc", undefined, S, "UI 3.3.7"),
      r("Không chỉ định", "Rối loạn chức năng hoặc tái tạo đường tiết niệu dưới; ghép thận; trước phẫu thuật thay khớp; nhiễm khuẩn tiết niệu tái phát", undefined, S, "UI 3.3.7"),
      r("Không chỉ định", "Trước phẫu thuật tim mạch", undefined, W, "UI 3.3.7"),
    ] },
  ],
  avoid: [],
  notes: ["Vi khuẩn sinh urease tồn tại dai dẳng (ví dụ Proteus mirabilis): cần loại trừ sỏi đường tiết niệu.", "Nam giới: thăm trực tràng để đánh giá bệnh lý tuyến tiền liệt."],
};

/* ---------- Nam duong tiet nieu ---------- */
const FLUCO_RENAL = "CrCl < 50 mL/phút: giảm 50% liều. Lọc máu: liều đầy đủ 3 lần/tuần sau lọc";
const FLUCY_RENAL = "CrCl 21–40 mL/phút: 25 mg/kg × 2 lần/ngày; 10–20: 25 mg/kg × 1 lần/ngày; < 10: 25 mg/kg mỗi 48 giờ. Lọc máu: 25–50 mg/kg mỗi 48–72 giờ sau lọc";
const FUNGAL_NOTES = [
  "Nấm niệu không triệu chứng thường không cần điều trị, trừ giảm bạch cầu trung tính, trẻ sơ sinh < 1.500 g hoặc trước thủ thuật tiết niệu xâm phạm niêm mạc.",
  "Thay ống thông hoặc stent đang lưu. Tắc nghẽn: dẫn lưu sớm bằng stent niệu quản hoặc mở thận ra da.",
  "Định danh loài và làm kháng nấm đồ. C. krusei và C. glabrata có tỷ lệ kháng fluconazol cao.",
];
const FUNGAL_LOCAL: EauForm = {
  id: "fungal",
  label: "Nấm tại bàng quang",
  criteria: "Có triệu chứng nhiễm khuẩn tiết niệu khu trú và cấy nước tiểu mọc nấm.",
  headline: "Fluconazol uống 2 tuần nếu chủng nhạy",
  blocks: [
    { title: "Chủng nhạy fluconazol", items: [
      r(FIRST, "Fluconazol", `200 mg/ngày uống, 2 tuần. ${FLUCO_RENAL}`, S, "UI 3.17.3, bảng nấm khu trú"),
      r("C. glabrata nhạy", "Fluconazol", `800 mg/ngày uống. ${FLUCO_RENAL}`, undefined, "UI 3.17.3, bảng nấm khu trú"),
    ] },
    { title: "Chủng kháng fluconazol", items: [
      r("Lựa chọn", "Amphotericin B deoxycholat, rửa bàng quang liên tục", "50 mg/L, 5 ngày. Loại trừ tổn thương đường tiết niệu trên hoặc lan toàn thân trước khi dùng. Một thử nghiệm ghi nhận tử vong sau 1 tháng cao hơn nhóm fluconazol", S, "UI 3.17.3.b"),
      r("Lựa chọn", "Amphotericin B deoxycholat tĩnh mạch", "0,3–0,6 mg/kg/ngày, 1–7 ngày; có hoặc không kèm flucytosin khi do C. glabrata", S, "UI bảng nấm khu trú"),
      r("Lựa chọn", "Flucytosin", `25 mg/kg uống hoặc tĩnh mạch × 4 lần/ngày, 2 tuần; có thể đơn trị C. glabrata. ${FLUCY_RENAL}`, S, "UI bảng nấm khu trú"),
      r("Lựa chọn", "Caspofungin", "70 mg tĩnh mạch ngày 1, sau đó 50 mg/ngày, 2–3 tuần. Thuốc thấm kém vào nước tiểu", S, "UI 3.17.3.b, bảng nấm khu trú"),
    ] },
  ],
  avoid: [],
  notes: ["Viêm bàng quang do nấm không có yếu tố nguy cơ có thể điều trị dưới 2 tuần.", ...FUNGAL_NOTES],
};
const FUNGAL_SYSTEMIC: EauForm = {
  id: "fungal",
  label: "Do nấm",
  criteria: "Nhiễm khuẩn tiết niệu toàn thân và cấy nước tiểu mọc nấm.",
  headline: "Chọn thuốc theo độ nhạy fluconazol",
  blocks: [
    { title: "Chủng nhạy fluconazol", items: [
      r(FIRST, "Fluconazol", `200–400 mg/ngày uống, 2 tuần. Nặng: cân nhắc liều nạp 400/800 mg ngày đầu. ${FLUCO_RENAL}`, undefined, "UI bảng nấm toàn thân"),
      r("C. glabrata nhạy", "Fluconazol", `800 mg/ngày uống, 2 tuần. Nặng: cân nhắc liều nạp 400/800 mg ngày đầu. ${FLUCO_RENAL}`, undefined, "UI bảng nấm toàn thân"),
    ] },
    { title: "Chủng kháng fluconazol", items: [
      r("Lựa chọn", "Amphotericin B deoxycholat tĩnh mạch", "0,3–0,6 mg/kg/ngày, 1–7 ngày; có hoặc không kèm flucytosin khi do C. glabrata", S, "UI bảng nấm toàn thân"),
      r("Lựa chọn", "Flucytosin", `25 mg/kg uống hoặc tĩnh mạch × 4 lần/ngày, 2 tuần; thường phối hợp amphotericin B. ${FLUCY_RENAL}`, S, "UI bảng nấm toàn thân"),
      r("Lựa chọn", "Caspofungin", "70 mg tĩnh mạch ngày 1, sau đó 50 mg/ngày, 2–3 tuần", S, "UI bảng nấm toàn thân"),
    ] },
  ],
  avoid: [],
  notes: FUNGAL_NOTES,
};

/* ---------- Viem than be than ---------- */
const PYELO_AVOID = [r("Không dùng", "Nitrofurantoin, fosfomycin uống, pivmecillinam", "Không đủ dữ liệu hiệu quả", S, "UI 3.6.3.c")];
const PYELO_WORKUP = "Xét nghiệm nước tiểu, cấy nước tiểu và làm kháng sinh đồ cho mọi trường hợp. Chẩn đoán hình ảnh để loại trừ tắc nghẽn, sỏi. Còn sốt sau 72 giờ hoặc xấu đi: chụp cắt lớp vi tính có cản quang.";
const PYELO_OUT: EauForm = {
  id: "outpatient",
  label: "Ngoại trú",
  criteria: "Sốt > 38 °C, rét run, đau hông lưng, buồn nôn, nôn hoặc ấn đau góc sườn sống; không cần nhập viện.",
  headline: "Fluoroquinolon ngắn ngày là lựa chọn đầu tay",
  blocks: [
    { title: "Đầu tay, khi tỷ lệ kháng fluoroquinolon < 10%", items: [
      r(FIRST, "Ciprofloxacin", "500–750 mg uống × 2 lần/ngày, 7 ngày", S, "UI Bảng 5"),
      r(FIRST, "Levofloxacin", "500 mg uống × 1 lần/ngày, 5 ngày. Liều cao: 500 mg × 2 lần/ngày", S, "UI Bảng 5"),
    ] },
    { title: "Thay thế", lead: "Nếu dùng khi chưa có kháng sinh đồ: tiêm tĩnh mạch ban đầu một liều kháng sinh tác dụng kéo dài, ví dụ ceftriaxon.", items: [
      r(ALT, "Trimethoprim-sulfamethoxazol", "160/800 mg × 2 lần/ngày, 14 ngày", undefined, "UI Bảng 5"),
      r(ALT, "Cefpodoxim", "200 mg × 2 lần/ngày, 10 ngày", undefined, "UI Bảng 5"),
      r(ALT, "Ceftibuten", "400 mg × 1 lần/ngày, 10 ngày", undefined, "UI Bảng 5"),
    ] },
  ],
  avoid: PYELO_AVOID,
  notes: [PYELO_WORKUP, "Liên hệ lại người bệnh sau 48–72 giờ. Không xét nghiệm nước tiểu thường quy sau điều trị nếu hết triệu chứng."],
};
const PYELO_IN: EauForm = {
  id: "inpatient",
  label: "Nhập viện",
  criteria: "Viêm thận bể thận cần nhập viện: bắt đầu bằng đường tĩnh mạch.",
  headline: "Fluoroquinolon hoặc cephalosporin thế hệ 3 đường tĩnh mạch",
  blocks: [
    { title: "Hàng 1", items: [
      r(FIRST, "Ciprofloxacin", "400 mg × 2 lần/ngày", undefined, "UI Bảng 6"),
      r(FIRST, "Levofloxacin", "500 mg × 1 lần/ngày. Liều cao: 500 mg × 2 lần/ngày", undefined, "UI Bảng 6"),
      r(FIRST, "Cefotaxim", "2 g × 3 lần/ngày. Chưa nghiên cứu đơn trị trong viêm thận bể thận cấp", undefined, "UI Bảng 6"),
      r(FIRST, "Ceftriaxon", "2 g tĩnh mạch × 1 lần/ngày. Liều cao: 2 g × 2 lần/ngày", undefined, "UI Bảng 6"),
    ] },
    { title: "Hàng 2", items: [
      r(ALT, "Cefepim", "1 g × 3 lần/ngày hoặc 2 g × 2 lần/ngày. Liều cao: 2 g × 3 lần/ngày", undefined, "UI Bảng 6"),
      r(ALT, "Piperacillin-tazobactam", "4,5 g × 3 lần/ngày. Liều cao: 4,5 g × 4 lần/ngày, truyền kéo dài", undefined, "UI Bảng 6"),
      r(ALT, "Gentamicin", "6–7 mg/kg × 1 lần/ngày. Chưa nghiên cứu đơn trị trong viêm thận bể thận cấp", undefined, "UI Bảng 6"),
      r(ALT, "Amikacin", "25–30 mg/kg × 1 lần/ngày. Chưa nghiên cứu đơn trị trong viêm thận bể thận cấp", undefined, "UI Bảng 6"),
    ] },
    { title: "Lựa chọn cuối", lead: "Chỉ dùng khi kết quả cấy sớm cho thấy vi khuẩn đa kháng.", items: [
      r(LAST, "Imipenem-cilastatin", "0,5 g × 4 lần/ngày, truyền 30 phút. Liều cao: 1 g × 4 lần/ngày", undefined, "UI Bảng 6"),
      r(LAST, "Meropenem", "1 g × 3 lần/ngày", undefined, "UI Bảng 6"),
      r(LAST, "Ceftolozan-tazobactam", "1,5 g × 3 lần/ngày", undefined, "UI Bảng 6"),
      r(LAST, "Ceftazidim-avibactam", "2,5 g × 3 lần/ngày", undefined, "UI Bảng 6"),
      r(LAST, "Cefiderocol", "2 g × 3 lần/ngày", undefined, "UI Bảng 6"),
      r(LAST, "Meropenem-vaborbactam", "2 g × 3 lần/ngày", undefined, "UI Bảng 6"),
      r(LAST, "Plazomicin", "15 mg/kg × 1 lần/ngày", undefined, "UI Bảng 6"),
    ] },
  ],
  avoid: PYELO_AVOID,
  notes: [
    "Chuyển đường uống khi lâm sàng cải thiện và uống được.",
    "Có dấu hiệu nhiễm khuẩn huyết từ đường tiết niệu: bao phủ vi khuẩn sinh ESBL theo kinh nghiệm.",
    "Cefepim, piperacillin-tazobactam, ceftriaxon: liều thấp đã được nghiên cứu nhưng khuyến cáo dùng liều cao hơn.",
    PYELO_WORKUP,
  ],
};
const PYELO_PREG: EauForm = {
  id: "pregnant",
  label: "Phụ nữ có thai",
  criteria: "Viêm thận bể thận trong thai kỳ, nguy cơ cho mẹ và sinh non.",
  headline: "Kháng sinh đường tiêm, tổng 7–10 ngày",
  blocks: [
    { title: "Xử trí", items: [
      r("Nhẹ, theo dõi sát được", "Điều trị ngoại trú bằng kháng sinh tiêm phù hợp", undefined, undefined, "UI 3.6.3"),
      r("Nặng hơn", "Nhập viện và điều trị hỗ trợ", undefined, undefined, "UI 3.6.3"),
      r("Sau khi cải thiện", "Chuyển sang đường uống", "Tổng thời gian 7–10 ngày", undefined, "UI 3.6.3"),
    ] },
  ],
  avoid: PYELO_AVOID,
  notes: ["Ưu tiên siêu âm hoặc cộng hưởng từ để tránh phơi nhiễm tia xạ cho thai."],
};
const PYELO_MEN: EauForm = {
  id: "men",
  label: "Nam giới",
  criteria: "Nam giới có sốt, viêm thận bể thận, nhiễm khuẩn tái phát hoặc nghi yếu tố phức tạp.",
  headline: "Tối thiểu 2 tuần, ưu tiên fluoroquinolon",
  blocks: [
    { title: "Phác đồ", lead: "Tuyến tiền liệt thường bị tổn thương. Điều trị 7 ngày kém hơn 14 ngày ở nam giới có nhiễm khuẩn tiết niệu toàn thân.", items: [
      r(FIRST, "Ciprofloxacin", "500–750 mg uống × 2 lần/ngày, tối thiểu 2 tuần", undefined, "UI 3.6.3, Bảng 5"),
      r(FIRST, "Levofloxacin", "500 mg uống × 1 lần/ngày, tối thiểu 2 tuần. Liều cao: 500 mg × 2 lần/ngày", undefined, "UI 3.6.3, Bảng 5"),
    ] },
  ],
  avoid: PYELO_AVOID,
  notes: ["Tỷ lệ kháng fluoroquinolon tại chỗ nên < 10%.", PYELO_WORKUP],
};

/* ---------- NKTN phuc tap ---------- */
const CARBA_ROWS = [
  r("Chọn một", "Imipenem", "500 mg tĩnh mạch mỗi 6 giờ", undefined, "UI 3.7.3.a.2"),
  r("Chọn một", "Meropenem", "1 g tĩnh mạch mỗi 8 giờ", undefined, "UI 3.7.3.a.2"),
  r("Thêm, bao phủ MRSA", "Vancomycin, hoặc daptomycin, linezolid", undefined, undefined, "UI 3.7.3.a.2"),
];
const SYSTEMIC: EauForm = {
  id: "systemic",
  label: "Toàn thân",
  criteria: "Nhiễm khuẩn tiết niệu có sốt, rét run, tụt huyết áp, mê sảng, nhịp tim nhanh hoặc đau góc sườn sống.",
  headline: "Kháng sinh tĩnh mạch ngay, điều chỉnh theo kháng sinh đồ",
  blocks: [
    { title: "Kinh nghiệm đường tĩnh mạch", items: [
      r(FIRST, "Amoxicilin + aminoglycosid", undefined, S, "UI 3.7.4"),
      r(FIRST, "Cephalosporin thế hệ 2 + aminoglycosid", undefined, S, "UI 3.7.4"),
      r(FIRST, "Cephalosporin thế hệ 3", undefined, S, "UI 3.7.4"),
      r("Có điều kiện", "Ciprofloxacin", "Tỷ lệ kháng tại chỗ < 10%, và có chống chỉ định cephalosporin thế hệ 3 hoặc aminoglycosid, hoặc dị ứng beta-lactam", S, "UI 3.7.4"),
    ] },
    { title: "Thời gian khi cải thiện trong 48–72 giờ", items: [
      r("Fluoroquinolon", "5–7 ngày", undefined, undefined, "UI 3.7.3.a.4"),
      r("Trimethoprim-sulfamethoxazol", "7–10 ngày", undefined, undefined, "UI 3.7.3.a.4"),
      r("Beta-lactam", "7–10 ngày", undefined, undefined, "UI 3.7.3.a.4"),
      r("Nam giới", "14 ngày", "7 ngày kém hơn 14 ngày", undefined, "UI 3.7.3.a.4"),
    ] },
  ],
  avoid: [r("Không dùng kinh nghiệm", "Ciprofloxacin, fluoroquinolon khác", "Người bệnh từ khoa tiết niệu hoặc đã dùng fluoroquinolon trong 6 tháng gần nhất", S, "UI 3.7.4")],
  notes: [
    "Bao phủ ESBL khi nguy cơ tăng theo tỷ lệ trong cộng đồng, kết quả cấy trước đó và kháng sinh đã dùng.",
    "Thể nhẹ đến vừa, uống được: có thể điều trị ngoại trú, ưu tiên ciprofloxacin hoặc levofloxacin khi phù hợp; liên hệ lại sau 48–72 giờ.",
    "Cấy máu khi nhiễm khuẩn huyết, bệnh nặng hoặc nước tiểu mọc S. aureus. Siêu âm ban đầu; chụp cắt lớp hoặc cộng hưởng từ khi ứ nước thận, nghi tắc nghẽn, bệnh nặng hoặc không cải thiện sau 48–72 giờ.",
    "Xử trí bất thường đường tiết niệu và yếu tố phức tạp đi kèm.",
  ],
};
const CRITICAL: EauForm = {
  id: "critical",
  label: "Nặng, nghi tắc nghẽn",
  criteria: "Bệnh nặng, xấu đi khi đang điều trị hoặc nghi tắc nghẽn đường tiết niệu.",
  headline: "Carbapenem kèm thuốc bao phủ MRSA, giải quyết tắc nghẽn",
  blocks: [{ title: "Phổ rộng ban đầu", lead: "Bao phủ vi khuẩn sinh ESBL, Pseudomonas aeruginosa và MRSA. Thu hẹp phổ khi có kháng sinh đồ.", items: CARBA_ROWS }],
  avoid: [],
  notes: ["Beta-lactam/ức chế beta-lactamase mới, cefiderocol, plazomicin, fosfomycin tĩnh mạch: dành cho vi khuẩn kháng thuốc cao.", "Đánh giá nhu cầu hồi sức tích cực."],
};
const STONE_SEPSIS: EauForm = {
  id: "stone-sepsis",
  label: "Sỏi tắc nghẽn, nhiễm khuẩn",
  criteria: "Thận tắc nghẽn do sỏi kèm dấu hiệu nhiễm khuẩn tiết niệu và/hoặc vô niệu. Đây là cấp cứu tiết niệu.",
  headline: "Giải áp khẩn cấp, kháng sinh ngay, trì hoãn lấy sỏi",
  blocks: [
    { title: "Xử trí cấp cứu", items: [
      r(DO, "Giải áp khẩn hệ thống đài bể thận", "Đặt stent niệu quản hoặc dẫn lưu thận qua da, hiệu quả tương đương", S, "URO 3.4.2.a"),
      r(DO, "Kháng sinh ngay; hồi sức tích cực nếu cần", undefined, S, "URO 3.4.2.a"),
      r(DO, "Cấy lại nước tiểu sau giải áp, cấy máu", undefined, S, "URO 3.4.2, 3.4.2.a"),
      r(DO, "Đánh giá lại phác đồ theo kháng sinh đồ", undefined, S, "URO 3.4.2.a"),
      r(DO, "Trì hoãn điều trị sỏi triệt để đến khi hết nhiễm khuẩn huyết", "Sau khi hoàn thành đợt kháng sinh", S, "URO 3.4.2, 3.4.2.a"),
    ] },
    { title: "Kháng sinh ban đầu khi nghi tắc nghẽn", items: CARBA_ROWS },
  ],
  avoid: [],
  notes: ["Thu hẹp phổ khi có kháng sinh đồ."],
};
const STONE_PROC: EauForm = {
  id: "stone-proc",
  label: "Trước can thiệp sỏi",
  criteria: "Người bệnh chuẩn bị tán sỏi ngoài cơ thể, nội soi niệu quản hoặc lấy sỏi thận qua da.",
  headline: "Cấy nước tiểu, điều trị nhiễm khuẩn trước, dự phòng theo thủ thuật",
  blocks: [
    { title: "Trước mọi can thiệp", items: [
      r(DO, "Cấy nước tiểu hoặc soi nước tiểu", undefined, S, "URO 3.4.8.a"),
      r(DO, "Loại trừ hoặc điều trị nhiễm khuẩn tiết niệu", "Nhiễm khuẩn rõ kèm tắc nghẽn: dẫn lưu vài ngày trước khi lấy sỏi", S, "URO 3.4.8.a"),
    ] },
    { title: "Dự phòng theo thủ thuật", items: [
      r("Tán sỏi ngoài cơ thể", "Không dự phòng khi nước tiểu vô khuẩn", "Chỉ dùng khi nghi hoặc xác định sỏi nhiễm khuẩn, hoặc có vi khuẩn niệu", S, "URO 3.4.5.a; UI 3.18.3"),
      r("Nội soi niệu quản", "Có dự phòng", "Một liều trước thủ thuật là đủ", W, "URO 3.4.8.a; UI 3.18.3"),
      r("Lấy sỏi thận qua da", "Có dự phòng", "Một liều", S, "UI 3.18.3"),
      r("Lấy sỏi thận qua da, nguy cơ nhiễm khuẩn cao", "Cân nhắc kháng sinh trước mổ kéo dài", "Đã đặt stent, dẫn lưu thận hoặc cấy nước tiểu dương tính: 7 ngày giảm nhiễm khuẩn huyết so với 2 ngày", undefined, "URO 3.4.8.a"),
    ] },
    { title: "Thuốc có thể chọn", lead: "Chọn theo vi khuẩn và độ nhạy tại cơ sở.", items: [
      r("Lựa chọn", "Trimethoprim hoặc trimethoprim-sulfamethoxazol", undefined, undefined, "UI Bảng 15"),
      r("Lựa chọn", "Cephalosporin nhóm 2 hoặc 3", undefined, undefined, "UI Bảng 15"),
      r("Lựa chọn", "Aminopenicilin + chất ức chế beta-lactamase", undefined, undefined, "UI Bảng 15"),
      r("Nguy cơ nhiễm khuẩn vết mổ thấp", "Gentamicin", "eGFR > 20 mL/phút", undefined, "UI 3.18.1.d"),
    ] },
  ],
  avoid: [r("Không kéo dài", "Kháng sinh sau mổ kéo dài", "Không tốt hơn một liều trước mổ", undefined, "URO 3.4.8.a")],
  notes: ["Lấy sỏi thận qua da: cấy sỏi hoặc nước tiểu bể thận trong mổ nếu có thể, để chọn kháng sinh sau mổ."],
};
const STRUVITE: EauForm = {
  id: "struvite",
  label: "Sỏi nhiễm khuẩn",
  criteria: "Sỏi struvite, carbonat apatit hoặc amoni urat; cấy nước tiểu có vi khuẩn sinh urease; pH nước tiểu kiềm.",
  headline: "Lấy sạch sỏi, kháng sinh khi còn vi khuẩn niệu, toan hóa nước tiểu",
  blocks: [
    { title: "Điều trị", items: [
      r(DO, "Phẫu thuật lấy sỏi càng sạch càng tốt", undefined, S, "URO 4.8.3"),
      r(DO, "Kháng sinh khi vi khuẩn niệu dai dẳng", "Đợt ngắn hoặc dài, theo kết quả cấy", S, "URO 4.8.3, Hình 4.8"),
      r("Toan hóa nước tiểu", "Amoni clorid", "1 g × 2–3 lần/ngày", W, "URO 4.8.3"),
      r("Toan hóa nước tiểu, thay thế", "Methionin", "200–500 mg × 1–3 lần/ngày", W, "URO 4.8.3"),
      r("Nhiễm khuẩn nặng, dai dẳng", "Acid acetohydroxamic", "15 mg/kg/ngày, nếu thuốc được cấp phép", undefined, "URO 4.8.3, Hình 4.8"),
    ] },
  ],
  avoid: [],
  notes: ["Sỏi struvite hỗn hợp: tìm rối loạn chuyển hóa trên nước tiểu 24 giờ sau khi lấy sỏi và kiểm soát nhiễm khuẩn."],
};
const CAUTI: EauForm = {
  id: "cauti",
  label: "Liên quan ống thông",
  criteria: "Đang đặt ống thông hoặc đã rút trong 48 giờ, có triệu chứng, cấy ≥ 10³ CFU/mL. Nước tiểu đục, mùi hôi hoặc bạch cầu niệu đơn thuần không đủ để chẩn đoán.",
  headline: "Thay hoặc rút ống thông, cấy nước tiểu, rồi mới dùng kháng sinh",
  blocks: [
    { title: "Trước khi dùng kháng sinh", items: [
      r(DO, "Thay hoặc rút ống thông", "Ống đã lưu từ 2 tuần và còn chỉ định: thay ống", S, "UI 3.8.4.g, 3.8.4.h"),
      r(DO, "Cấy nước tiểu từ ống mới đặt", "Đã rút ống: cấy nước tiểu giữa dòng", S, "UI 3.8.4.g, 3.8.4.h"),
      r(DO, "Chọn kháng sinh như nhiễm khuẩn tiết niệu khu trú hoặc toàn thân", undefined, S, "UI 3.8.4.h"),
    ] },
    { title: "Thời gian điều trị", items: [
      r("Hết triệu chứng nhanh", "7 ngày", undefined, undefined, "UI 3.8.4.g"),
      r("Đáp ứng chậm", "14 ngày", undefined, undefined, "UI 3.8.4.g"),
      r("Không nặng", "Levofloxacin", "Có thể cân nhắc đợt 5 ngày", undefined, "UI 3.8.4.g"),
      r("Nữ ≤ 65 tuổi, đã rút ống, không có triệu chứng đường tiết niệu trên", "3 ngày", undefined, undefined, "UI 3.8.4.g"),
    ] },
  ],
  avoid: [
    r("Không điều trị", "Khuẩn niệu không triệu chứng khi đặt ống thông", "Trừ trước can thiệp gây chấn thương đường tiết niệu", S, "UI 3.8.4.h"),
    r("Không dùng", "Kháng sinh dự phòng nhiễm khuẩn do ống thông", undefined, S, "UI 3.8.4.h"),
    r("Không dùng", "Sát khuẩn hoặc kháng sinh tại chỗ lên ống thông, niệu đạo, lỗ sáo", undefined, S, "UI 3.8.4.h"),
  ],
  notes: ["Rút ngắn thời gian đặt ống thông. Ống phủ ái nước giúp giảm nhiễm khuẩn. Không thay ống thông dài ngày theo lịch cố định."],
};
const ABP: EauForm = {
  id: "abp",
  label: "Viêm tuyến tiền liệt cấp",
  criteria: "Khởi phát đột ngột, sốt, rối loạn tiểu tiện, đau vùng chậu; tuyến tiền liệt sưng, đau khi thăm trực tràng.",
  headline: "Kháng sinh diệt khuẩn liều cao đường tĩnh mạch, tổng 2–4 tuần",
  blocks: [
    { title: "Ban đầu đường tĩnh mạch", lead: "Có thể phối hợp aminoglycosid với một trong các thuốc dưới đây.", items: [
      r(FIRST, "Penicilin phổ rộng", "Liều cao", undefined, "UI 3.11.5.a"),
      r(FIRST, "Cephalosporin thế hệ 3", "Liều cao", undefined, "UI 3.11.5.a"),
      r(FIRST, "Fluoroquinolon", "Liều cao", undefined, "UI 3.11.5.a"),
    ] },
    { title: "Duy trì", items: [r("Sau khi chỉ số nhiễm khuẩn về bình thường", "Chuyển đường uống", "Tổng thời gian 2–4 tuần", undefined, "UI 3.11.5.a")] },
  ],
  avoid: [r("Không làm", "Xoa bóp tuyến tiền liệt", "Có thể gây nhiễm khuẩn huyết", S, "UI 3.11.4.h")],
  notes: [
    "Xét nghiệm que nhúng và cấy nước tiểu giữa dòng, cấy máu, công thức máu.",
    "Bí tiểu: đặt ống thông niệu đạo hoặc trên xương mu.",
    "Áp xe tuyến tiền liệt: siêu âm qua trực tràng khi nghi ngờ. Ổ < 1 cm có thể điều trị bảo tồn; ổ lớn hơn nên chọc hút hoặc dẫn lưu.",
  ],
};

export const EAU_UROLOGY_FORMS: Record<string, EauForm[]> = {
  "v8-16": [CYSTITIS_WOMEN, CYSTITIS_PREG, CYSTITIS_MEN, CYSTITIS_RECUR, ABU, FUNGAL_LOCAL],
  "v8-17": [PYELO_OUT, PYELO_IN, PYELO_PREG, PYELO_MEN],
  "v8-2": [SYSTEMIC, CRITICAL, STONE_SEPSIS, STONE_PROC, STRUVITE, CAUTI, ABP, FUNGAL_SYSTEMIC],
};

export const isEauUrology = (diseaseId: string) => diseaseId in EAU_UROLOGY_FORMS;
