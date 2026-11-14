/*
  Nhiem khuan huyet do S. aureus (SAB) – du lieu cong cu theo nguon quoc te.
  - IDSA/ESCMID 2026 Consensus Statement 1: Risk Stratification of Patients with SAB (Kaasch AJ, Strnad L va cs.)
    – Consensus statements (nguoi lon, tre em), Table 1 (yeu to nguy co), Figure 1, Implementation considerations.
    Phuong phap dong thuan (> 75% hoi dong), KHONG xep muc bang chung.
  - ASHP/IDSA/PIDS/SIDP 2020 – Therapeutic monitoring of vancomycin for serious MRSA infections
    (Rybak MJ va cs., Am J Health-Syst Pharm 2020;77:835–864), Table 2 (KC 1–25), bang loc mau chu ky.
  Doc tu ban PDF nguoi dung cung cap ngay 14/11/2026. Lua chon thuoc MSSA/MRSA KHONG co trong Part 1 -> khong dua vao.
*/
import type { RxItem } from "./septic-arthritis-pids2023";

const C = "Đồng thuận";
const r = (role: string, text: string, ref: string, grade?: string, dose?: string): RxItem => ({ role, text, ref, grade, dose });

/* ---------- Bang 1: yeu to nguy co (nguoi lon). ie = dac diem tang nguy co viem noi tam mac ---------- */
export type RiskId = "community" | "bc48" | "device" | "valve" | "pwid" | "graft" | "prior90" | "focal" | "embolic" | "multifocal" | "unknown";
export type Risk = { id: RiskId; label: string; key: boolean; ie: boolean };
export const RISKS: Risk[] = [
  { id: "community", label: "Nhiễm khuẩn huyết khởi phát tại cộng đồng", key: true, ie: true },
  { id: "bc48", label: "Cấy máu còn dương tính ở mẫu lấy 48 giờ sau mẫu dương tính đầu tiên", key: true, ie: true },
  { id: "device", label: "Có dụng cụ trong tim (van tim nhân tạo, máy tạo nhịp vĩnh viễn, máy phá rung cấy được, dụng cụ hỗ trợ thất trái)", key: true, ie: true },
  { id: "valve", label: "Bệnh lý van tim dễ mắc (yếu tố thuận lợi)", key: false, ie: true },
  { id: "pwid", label: "Tiêm chích ma túy", key: false, ie: true },
  { id: "graft", label: "Mảnh ghép nội mạch", key: false, ie: false },
  { id: "prior90", label: "Nhiễm khuẩn huyết do S. aureus trong 90 ngày trước", key: false, ie: false },
  { id: "focal", label: "Triệu chứng, dấu hiệu khu trú gợi ý ổ nhiễm sâu hoặc di bệnh", key: false, ie: false },
  { id: "embolic", label: "Biến cố tắc mạch", key: false, ie: true },
  { id: "multifocal", label: "Hơn một ổ nhiễm khuẩn không liền kề", key: false, ie: true },
  { id: "unknown", label: "Chưa xác định được ổ nhiễm khuẩn", key: false, ie: false },
];

const REF1 = "CS 1 – Practical advice";

/* ---------- Danh gia ban dau – moi nguoi lon ---------- */
export const ADULT_INITIAL: RxItem[] = [
  r("Cấy máu", "Cấy máu ít nhất 2 bộ khi nghi nhiễm khuẩn huyết do S. aureus (mỗi bộ gồm 1 chai hiếu khí và 1 chai kỵ khí). Một mẫu cấy dương tính với S. aureus kèm triệu chứng, dấu hiệu nhiễm khuẩn là đủ xác định chẩn đoán; tạp nhiễm hiếm gặp nên thường coi là nhiễm khuẩn thật.", REF1, C),
  r("Hỏi bệnh, thăm khám", "Hỏi bệnh và khám toàn diện; ghi nhận dụng cụ trong tim, dụng cụ nhân tạo, mảnh ghép nội mạch, catheter tĩnh mạch trung tâm, tiền sử tiêm chích ma túy, tiền sử nhiễm khuẩn huyết hoặc nhiễm khuẩn do S. aureus.", REF1, C),
  r("Cấy máu kiểm tra", "Ít nhất 2 bộ tại thời điểm 48 giờ sau mẫu cấy dương tính đầu tiên, sau đó lặp lại 1 hoặc 2 bộ mỗi 24–48 giờ đến khi âm tính để ghi nhận sạch khuẩn (CS 2). Mốc 48 giờ tính từ mẫu cấy dương tính đầu tiên, không phụ thuộc thời điểm bắt đầu kháng sinh.", REF1, C),
  r("Siêu âm tim", "Siêu âm tim qua thành ngực (TTE) thường quy cho mọi người bệnh (CS 3).", REF1, C),
  r("Catheter", "Rút catheter tĩnh mạch trung tâm (tăng nguy cơ biến chứng theo đường máu và tái phát). Rút catheter tĩnh mạch ngoại vi nếu xác định là ổ nhiễm khuẩn.", REF1, C),
  r("Hội chẩn", "Hội chẩn chuyên khoa Truyền nhiễm (nếu có) để hỗ trợ đánh giá nguy cơ, chỉ định thăm dò tiếp và kế hoạch điều trị.", REF1, C),
];

/* ---------- Tre em ---------- */
export const PED_INITIAL: RxItem[] = [
  r("Nguyên tắc", "Mọi trẻ nhiễm khuẩn huyết do S. aureus đều được đánh giá tìm ổ nhiễm sâu. Chưa đủ dữ liệu để xác định nhóm trẻ nguy cơ thấp (ổ nhiễm sâu, di bệnh hoặc tái phát).", "CS 1 – Pediatric", C),
  r("Cấy máu", "Cấy máu khi nghi ngờ; một mẫu dương tính với S. aureus là đủ xác định chẩn đoán (tạp nhiễm hiếm). Cấy máu nhắc lại sau mẫu dương tính đầu tiên – dù đã hay chưa bắt đầu kháng sinh – để đánh giá nhiễm khuẩn huyết kéo dài (CS 2).", "CS 1 – Pediatric", C),
  r("Hỏi bệnh, thăm khám", "Hỏi bệnh và khám toàn diện; đánh giá có hệ thống tiền sử bệnh tim bẩm sinh hoặc mắc phải (tăng rõ nguy cơ viêm nội tâm mạc).", "CS 1 – Pediatric", C),
  r("Siêu âm tim", "Siêu âm tim qua thành ngực khi trẻ có bệnh tim bẩm sinh, triệu chứng hoặc dấu hiệu viêm nội tâm mạc, hoặc nhiễm khuẩn huyết kéo dài (CS 3).", "CS 1 – Pediatric", C),
  r("Chẩn đoán hình ảnh", "Chọn thăm dò theo biểu hiện lâm sàng và đặc điểm người bệnh: hình ảnh tim, hình ảnh cắt lớp hoặc hình ảnh toàn thân để tìm ổ nhiễm sâu, di bệnh.", "CS 1 – Pediatric", C),
  r("Kiểm soát ổ, catheter", "Cân nhắc kiểm soát ổ nhiễm khi có ổ nhiễm sâu. Rút catheter tĩnh mạch trung tâm sớm. Hội chẩn Truyền nhiễm (nếu có).", "CS 1 – Pediatric", C),
  r("Theo dõi", "Theo dõi trong và sau điều trị để phát hiện triệu chứng, dấu hiệu di bệnh mới; mọi thay đổi lâm sàng cần đánh giá lại.", "CS 1 – Pediatric", C),
];
export const NEO_NOTE =
  "Sơ sinh (< 28 ngày tuổi, đặc biệt trẻ sinh non) cần xem xét riêng: ít khi tìm thấy ổ nhiễm khuẩn (không xác định được ổ ở 43% trẻ sơ sinh so với 9% trẻ 1–18 tuổi trong một nghiên cứu đa trung tâm) nhưng tỷ lệ viêm nội tâm mạc cao hơn (10–49% so với 1–6%) và tử vong cao hơn.";
export const PED_BARRIERS =
  "Khó khăn thực hành ở trẻ em: có thể cần an thần khi chụp MRI hoặc siêu âm tim; một số trẻ chỉ có catheter tĩnh mạch trung tâm là đường truyền tin cậy; đọc siêu âm tim ở trẻ bệnh tim bẩm sinh cần người có kinh nghiệm.";

/* ---------- Phan tang nguy co nguoi lon ---------- */
export type Final = "pending" | "nofocus" | "focus";
export type SabPlan = { level: "low" | "increased"; headline: string; workup: RxItem[]; final: RxItem[]; notes: string[] };

export function sabPlan(sel: RiskId[], final: Final): SabPlan {
  const picked = RISKS.filter((x) => sel.includes(x.id));
  const keyN = picked.filter((x) => x.key).length;
  const ie = picked.filter((x) => x.ie);
  const level = picked.length ? "increased" : "low";
  const headline = level === "low"
    ? "Nguy cơ thấp – không có yếu tố nguy cơ nào ở thời điểm đánh giá; vẫn cần đủ các đánh giá khuyến cáo và theo dõi sát"
    : `Nguy cơ tăng – ${picked.length} yếu tố nguy cơ${keyN ? `, trong đó ${keyN} yếu tố chính` : ""}; tiếp tục thăm dò đến khi xác định hoặc loại trừ chắc chắn ổ nhiễm sâu, di bệnh`;

  const workup: RxItem[] = [];
  if (level === "low") {
    workup.push(r("Theo dõi", "\"Nguy cơ thấp\" không có nghĩa là \"không có nguy cơ\": tiếp tục khám lâm sàng nhắc lại và cấy máu kiểm tra; đánh giá lại khi xuất hiện yếu tố nguy cơ mới (nguy cơ có thể thay đổi theo thời gian).", "CS 1 – Rationale", C));
  } else {
    workup.push(r("Nguyên tắc", "Thăm dò cá thể hóa theo đặc điểm người bệnh, biểu hiện lâm sàng và khả năng xét nghiệm tại chỗ; nên có bác sĩ Truyền nhiễm hỗ trợ chọn chiến lược. Càng nhiều yếu tố nguy cơ, nguy cơ càng cao và thường cần thăm dò rộng hơn trước khi loại trừ ổ nhiễm sâu; ít yếu tố nguy cơ và nghi ngờ lâm sàng thấp có thể giới hạn phạm vi thăm dò.", "CS 1 – Implementation", C));
    if (sel.includes("bc48") || sel.includes("device"))
      workup.push(r("Yếu tố chính", "Nhiễm khuẩn huyết kéo dài quá 48 giờ hoặc có dụng cụ tim mạch trong lòng mạch là các yếu tố cho thấy khả năng cao hơn có ổ nhiễm sâu hoặc di bệnh.", "CS 1 – Implementation", C));
    if (ie.length)
      workup.push(r("Viêm nội tâm mạc", `Có đặc điểm tăng nguy cơ viêm nội tâm mạc (${ie.map((x) => x.label.split(" (")[0].toLowerCase()).join("; ")}): thăm dò tích cực hơn, nhắm vào phát hiện viêm nội tâm mạc. Quyết định siêu âm tim qua thực quản (TEE) dựa trên các đặc điểm nguy cơ này, chất lượng TTE và tác động dự kiến lên xử trí (CS 4).`, "CS 1 – Figure 1", C));
    workup.push(r("Cấy máu", "Cấy máu nhắc lại đến khi ghi nhận sạch khuẩn (CS 2).", "CS 1 – Rationale", C));
    workup.push(r("Hình ảnh theo triệu chứng", "Chọn thăm dò theo triệu chứng, thăm khám: ví dụ MRI cột sống khi đau lưng mới xuất hiện hoặc nặng lên; CT ngực khi ho hoặc đau ngực kiểu màng phổi; siêu âm Doppler tĩnh mạch khi nghi nhiễm khuẩn mạch máu.", "CS 1 – Implementation", C));
    workup.push(r(sel.includes("unknown") ? "Chưa rõ ổ" : "Nếu chưa tìm thấy ổ", "Sau đánh giá ban đầu và thăm dò theo nguy cơ vẫn chưa rõ ổ nhiễm: cân nhắc chẩn đoán hình ảnh toàn thân – [18F]FDG-PET/CT, hoặc phối hợp các phương tiện (ví dụ CT ngực/bụng, siêu âm Doppler tĩnh mạch) khảo sát các vị trí nhiều khả năng có ổ nhiễm (CS 5).", "CS 1 – Implementation", C));
  }

  const fin: RxItem[] = [];
  const noFocus = r("Không có ổ nhiễm sâu", "Không tìm thấy ổ nhiễm sâu hoặc di bệnh sau đánh giá phù hợp → phân loại \"nhiễm khuẩn huyết do S. aureus không có ổ nhiễm sâu\" (bất kể nhóm nguy cơ ban đầu) → điều trị ngắn: 2 tuần (CS 6, 7).", "CS 1 – Figure 1", C);
  const focus = r("Có ổ nhiễm sâu, di bệnh", "Phát hiện ổ nhiễm sâu hoặc di bệnh → phân loại \"nhiễm khuẩn huyết do S. aureus có ổ nhiễm sâu hoặc di bệnh\" → can thiệp kiểm soát ổ nhiễm; điều trị kéo dài (≥ 4 tuần), lựa chọn kháng sinh và thời gian chính xác theo ổ nhiễm được xác định.", "CS 1 – Figure 1", C);
  const longer = r("Cân nhắc kéo dài", "Thời gian dài hơn (dựa trên ổ nhiễm nhiều khả năng) có thể phù hợp trong một số tình huống: còn dụng cụ trong tim, mảnh ghép nội mạch mới đặt, huyết khối tĩnh mạch sâu tại vị trí catheter tĩnh mạch trung tâm – đặc biệt khi nhiễm khuẩn huyết kéo dài, hoặc thăm dò chưa đầy đủ hay chưa kết luận được. Khi đó cũng cần đánh giá lại kiểm soát ổ nhiễm (CS 7).", "CS 1 – Figure 1", C);
  if (final === "pending") fin.push(noFocus, focus, longer);
  else if (final === "nofocus") fin.push(noFocus, longer);
  else fin.push(focus);

  const notes = [
    "Dùng thuật ngữ \"nguy cơ thấp\" / \"nguy cơ tăng\" thay cho \"không biến chứng\" / \"có biến chứng\". Phần lớn người bệnh thuộc nhóm nguy cơ tăng.",
    "Danh sách yếu tố nguy cơ dựa trên tổng quan y văn và ý kiến chuyên gia, không bao gồm mọi yếu tố nguy cơ.",
    "Theo dõi trong và sau điều trị kháng sinh để phát hiện triệu chứng, dấu hiệu di bệnh mới; mọi thay đổi lâm sàng cần đánh giá lại và có thể phân loại lại chẩn đoán cuối cùng.",
  ];
  return { level, headline, workup, final: fin, notes };
}

/* ======================= VANCOMYCIN – ASHP/IDSA/PIDS/SIDP 2020 ======================= */
export type VancoPop = "std" | "obese" | "ihd" | "sled" | "crrt" | "ped" | "neo";
export const VANCO_POP: { id: VancoPop; label: string }[] = [
  { id: "std", label: "Người lớn" },
  { id: "obese", label: "Người lớn béo phì" },
  { id: "ihd", label: "Lọc máu chu kỳ" },
  { id: "sled", label: "Lọc máu lai (SLED)" },
  { id: "crrt", label: "Lọc máu liên tục (CRRT)" },
  { id: "ped", label: "Trẻ ≥ 3 tháng" },
  { id: "neo", label: "Sơ sinh – < 3 tháng" },
];
const V = "ASHP 2020";

export const VANCO_COMMON: RxItem[] = [
  r("Đích", "Nhiễm MRSA nặng nghi ngờ hoặc xác định: đích AUC/MIC 400–600 (giả định MIC vi pha loãng = 1 mg/L), cá thể hóa để đạt hiệu quả và an toàn.", `${V} – KC 1`, "A-II"),
  r("Thời điểm", "Đạt mức phơi nhiễm đích sớm, tốt nhất trong 24–48 giờ đầu; ước tính AUC theo Bayes không cần nồng độ ở trạng thái ổn định nên phù hợp cho đánh giá sớm.", `${V} – KC 2`, "A-II"),
  r("Không dùng", "Không còn khuyến cáo theo dõi chỉ bằng nồng độ đáy với đích 15–20 mg/L (dữ liệu hiệu quả và độc tính thận ở nhiễm MRSA nặng).", `${V} – KC 3`, "A-II"),
  r("Chỉ định theo dõi", "Theo dõi nồng độ cho mọi người bệnh nhiễm MRSA nặng; ngoài ra cho người bệnh nguy cơ cao độc tính thận (ví dụ bệnh nặng dùng đồng thời thuốc độc thận), chức năng thận không ổn định (xấu đi hoặc cải thiện rõ), điều trị kéo dài trên 3–5 ngày. Tần suất theo lâm sàng: thường xuyên hoặc hằng ngày khi huyết động không ổn định; mỗi tuần một lần khi ổn định.", `${V} – KC 4`, "B-II"),
  r("MIC", "Khi dùng liều kinh nghiệm, giả định MIC = 1 mg/L. MIC > 1 mg/L: khả năng đạt AUC/MIC 400 thấp với liều thông thường, tăng liều có thể gây độc – quyết định đổi thuốc theo lâm sàng. MIC < 1 mg/L: không giảm liều để đạt đích AUC/MIC.", `${V} – KC 5`, "B-II"),
  r("Pha, truyền", "Pha loãng (ví dụ nồng độ không quá 5 mg/mL), truyền trong ít nhất 60 phút hoặc tốc độ 10–15 mg/phút (1 giờ cho mỗi 1.000 mg) để giảm phản ứng liên quan tiêm truyền.", `${V} – Loading doses`),
];

const AUC_ADULT: RxItem[] = [
  r("Theo dõi AUC", "Cách chính xác và tối ưu là chỉnh liều và theo dõi theo AUC. Ưu tiên: phần mềm Bayes với 1–2 nồng độ (ít nhất 1 nồng độ đáy); nên lấy 2 mẫu – 1–2 giờ sau truyền và cuối khoảng đưa liều.", `${V} – KC 8b`, "A-II"),
  r("Cách khác", "2 nồng độ gần trạng thái ổn định (đỉnh sau phân bố 1–2 giờ sau truyền và đáy cuối khoảng đưa liều), tốt nhất trong cùng một khoảng đưa liều, tính AUC bằng phương trình dược động học bậc 1.", `${V} – KC 8a`, "A-II"),
  r("Lưu ý", "Một nồng độ đáy đơn độc có thể đủ để ước tính AUC theo Bayes ở một số người bệnh, nhưng cần thêm dữ liệu.", `${V} – KC 8b`, "B-II"),
];

export const VANCO: Record<VancoPop, RxItem[]> = {
  std: [
    r("Liều duy trì", "Truyền ngắt quãng; đa số người bệnh chức năng thận bình thường, giả định MIC 1 mg/L. Có thể không đạt đích khi MIC = 2 mg/L.", `${V} – KC 9`, "A-II", "15–20 mg/kg (cân nặng thực) mỗi 8–12 giờ"),
    r("Liều nạp", "Bệnh nặng nghi ngờ hoặc xác định nhiễm MRSA nặng, để nhanh đạt nồng độ đích; theo cân nặng thực.", `${V} – KC 12`, "B-II", "20–35 mg/kg; tối đa 3.000 mg"),
    r("Truyền liên tục", "Bệnh nặng: có thể cân nhắc; là lựa chọn hợp lý khi không đạt đích AUC bằng truyền ngắt quãng (KC 6). Đích nồng độ ổn định 20–25 mg/L; AUC24 = nồng độ ổn định × 24. Chỉnh tốc độ truyền để đạt đích.", `${V} – KC 10`, "B-II", "Nạp 15–20 mg/kg, sau đó 30–40 mg/kg/ngày (tới 60 mg/kg/ngày)"),
    r("Đường truyền", "Truyền liên tục: dùng đường truyền hoặc catheter riêng do tương kỵ với nhiều thuốc thường dùng ở hồi sức.", `${V} – KC 7`, "A-III"),
    r("Độc tính thận", "Nguy cơ độc thận của truyền liên tục tương đương hoặc thấp hơn truyền ngắt quãng (đích nồng độ ổn định 15–25 mg/L so với đáy 10–20 mg/L).", `${V} – KC 11`, "B-II"),
    ...AUC_ADULT,
  ],
  obese: [
    r("Liều nạp", "Người lớn béo phì nhiễm khuẩn nặng; theo cân nặng thực.", `${V} – KC 13`, "B-II", "20–25 mg/kg; tối đa 3.000 mg"),
    r("Liều duy trì", "Liều kinh nghiệm thường không vượt quá 4.500 mg/ngày, tùy chức năng thận.", `${V} – KC 13`, "B-II", "Thường ≤ 4.500 mg/ngày"),
    r("Theo dõi", "Theo dõi AUC sớm và thường xuyên để chỉnh liều, đặc biệt khi liều kinh nghiệm vượt 4.000 mg/ngày. Theo dõi điều trị sớm và tích cực hơn ở người béo phì (B-II, KC 12).", `${V} – KC 12–13`, "A-II"),
    ...AUC_ADULT,
  ],
  ihd: [
    r("Sau lọc – màng thấm thấp", "Liều duy trì dùng 3 lần/tuần.", `${V} – Bảng lọc máu`, "B-II", "Nạp 25 mg/kg; duy trì 7,5 mg/kg"),
    r("Sau lọc – màng thấm cao", "Liều duy trì dùng 3 lần/tuần.", `${V} – Bảng lọc máu`, "B-II", "Nạp 25 mg/kg; duy trì 10 mg/kg"),
    r("Trong lọc – màng thấm thấp", "Truyền trong buổi lọc; liều duy trì dùng 3 lần/tuần.", `${V} – Bảng lọc máu`, "B-II", "Nạp 30 mg/kg; duy trì 7,5–10 mg/kg"),
    r("Trong lọc – màng thấm cao", "Truyền trong buổi lọc; liều duy trì dùng 3 lần/tuần.", `${V} – Bảng lọc máu`, "B-II", "Nạp 35 mg/kg; duy trì 10–15 mg/kg"),
    r("Theo dõi", "Duy trì nồng độ trước lọc 15–20 mg/L nhiều khả năng đạt AUC 400–600 mg·h/L trong 24 giờ trước đó.", `${V} – KC 14`, "C-III"),
    r("Chỉnh liều", "Định lượng nồng độ trước lọc ít nhất mỗi tuần; nồng độ quyết định các liều sau, liều theo cân nặng chỉ là điểm khởi đầu.", `${V} – KC 14`, "B-II"),
  ],
  sled: [
    r("Liều nạp", "Theo cân nặng thực; các phương thức lọc lai (SLED, PIRRT) thải vancomycin hiệu quả. Không trì hoãn liều đầu để chờ kết thúc buổi lọc.", `${V} – KC 15`, "B-III", "20–25 mg/kg"),
    r("Liều duy trì", "Dùng sau khi kết thúc buổi lọc hoặc trong 60–90 phút cuối buổi lọc, như lọc máu chu kỳ. Các liều tiếp theo theo nồng độ thuốc.", `${V} – KC 15`, "B-III", "15 mg/kg"),
  ],
  crrt: [
    r("Liều nạp", "CRRT với tốc độ dịch thải theo KDIGO 20–25 mL/kg/giờ; theo cân nặng thực.", `${V} – KC 16`, "B-II", "20–25 mg/kg"),
    r("Liều duy trì", "Khởi đầu với tốc độ dịch thải 20–25 mL/kg/giờ. Liều và khoảng đưa liều theo nồng độ thuốc, định lượng trong 24 giờ đầu. Quá tải dịch: có thể giảm liều khi người bệnh về thể tích bình thường.", `${V} – KC 16`, "B-II", "7,5–10 mg/kg mỗi 12 giờ"),
    r("Truyền liên tục", "Có thể thay cho truyền ngắt quãng, nhất là khi tốc độ dịch lọc/dịch thẩm tách cao.", `${V} – KC 16`, "B-II"),
  ],
  ped: [
    r("3 tháng – < 12 tuổi", "Chức năng thận bình thường, nghi nhiễm MRSA nặng (viêm phổi, viêm cơ mủ, viêm xương tủy đa ổ, nhiễm khuẩn huyết có biến chứng, viêm cân hoại tử).", `${V} – KC 17`, "A-II", "60–80 mg/kg/ngày chia mỗi 6 giờ"),
    r("≥ 12 tuổi", "Cùng điều kiện như trên.", `${V} – KC 17`, "A-II", "60–70 mg/kg/ngày chia mỗi 6–8 giờ"),
    r("Liều tối đa", "Liều kinh nghiệm tối đa thường 3.600 mg/ngày khi chức năng thận đủ; đa số trẻ không cần quá 3.000 mg/ngày.", `${V} – KC 18`, "C-III", "Thường ≤ 3.600 mg/ngày"),
    r("Theo dõi sớm", "Định lượng sớm khi liều vượt 2.000–3.000 mg/ngày. Theo dõi sát nồng độ và chức năng thận khi thanh thải thận giảm hoặc tăng (chức năng thận có thể hồi phục trong 5 ngày đầu).", `${V} – KC 18`, "A-III"),
    r("Theo dõi AUC", "Theo dõi theo AUC, ưu tiên ước tính Bayes, cho mọi lứa tuổi: Bayes với 1 nồng độ đáy hoặc phương trình dược động học bậc 1 với 2 nồng độ. Theo dõi cả nồng độ thuốc và chức năng thận.", `${V} – KC 19`, "B-II"),
    r("Thời điểm", "Có thể bắt đầu định lượng trong 24–48 giờ đầu; chỉnh liều khi suy thận, béo phì, dùng đồng thời thuốc độc thận.", `${V} – KC 20`, "B-III"),
    r("Ngưỡng an toàn", "Duy trì AUC < 800 mg·h/L và nồng độ đáy < 15 mg/L để giảm tổn thương thận cấp.", `${V} – KC 21`, "B-II"),
    r("Tránh", "Tránh liều ≥ 100 mg/kg/ngày (nhiều khả năng vượt các ngưỡng trên); độ an toàn trên 80 mg/kg/ngày chưa được đánh giá tiến cứu.", `${V} – KC 21`, "B-III"),
    r("Liều nạp", "Trẻ không béo phì: chưa đủ dữ liệu để khuyến cáo; có thể cân nhắc liều nạp từ nghiên cứu ở người lớn.", `${V} – KC 22`, "C-III"),
    r("Trẻ béo phì", "Liều nạp theo tổng cân nặng (A-III). Liều mg/kg kinh nghiệm như trẻ không béo phì; trẻ < 12 tuổi có thể cần liều mg/kg cao hơn trẻ ≥ 12 tuổi; theo dõi nồng độ như trẻ không béo phì (B-II).", `${V} – KC 23–24`, "A-III", "Nạp 20 mg/kg"),
  ],
  neo: [
    r("Sơ sinh, < 3 tháng", "Liều để đạt AUC 400 mg·h/L (giả định MIC 1 mg/L), tùy tuổi sau kinh chót, cân nặng và creatinin huyết thanh.", `${V} – KC 25`, "A-II", "10–20 mg/kg mỗi 8–48 giờ"),
    r("Theo dõi AUC", "Theo dõi theo AUC, ưu tiên ước tính Bayes (thanh thải vancomycin thay đổi theo phát triển từ sơ sinh đến vị thành niên).", `${V} – KC 19`, "B-II"),
  ],
};
