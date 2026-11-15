/*
  Sepsis chua ro nguon / soc nhiem khuan (nguoi lon) – du lieu cong cu theo
  - Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026
    (Prescott HC, Antonelli M va cs., Crit Care Med 2026;54:725–812; dong dang Intensive Care Med). GRADE.
    Ma khuyen cao giu dung so thu tu khuyen cao (KC) cua SSC 2026.
  - IDSA 2026 AMR Guidance (Tamma PD va cs., Clin Infect Dis 2026; doi:10.1093/cid/ciag481) – muc "Empiric Therapy",
    "Duration of Therapy and Transitioning to Oral Therapy" (khong xep muc GRADE).
  - ASHP/IDSA/PIDS/SIDP 2020 – vancomycin (dung lai du lieu sab-intl.ts) khi nghi MRSA.
  Doc tu ban PDF nguoi dung cung cap ngay 15/11/2026. SSC 2026 KHONG neu ten thuoc hay lieu cho phac do kinh nghiem
  (lua chon khang sinh cu the "ngoai pham vi") -> khong tu dien thuoc/lieu.
  Muc chung chi la "S-/C-" + do tin cay; khuyen cao "khong dung" (suggest/recommend against) ghi ro o vai tro.
*/
import type { RxItem } from "./septic-arthritis-pids2023";

const r = (role: string, text: string, ref: string, grade?: string): RxItem => ({ role, text, ref, grade });

export type Likely = "probable" | "possible" | "low";
export type Hemo = "stable" | "hypoperf" | "shock";
export type Phase = "initial" | "reassess";
export type Culture = "pathogen" | "negative" | "noninfect";
export type RiskId = "mrsa" | "gnmdr" | "anaerobe" | "fungal" | "source" | "age65" | "obese" | "vent" | "tbi" | "cirrhosis";
export type SepsisIn = { likely: Likely; hemo: Hemo; prehosp: boolean; delay60: boolean; phase: Phase; culture: Culture; risks: RiskId[] };
export type Block = { title: string; lead?: string; items: RxItem[] };
export type SepsisOut = { headline: string; blocks: Block[]; avoid: RxItem[]; notes: string[]; showVanco: boolean };

export const LIKELY_TEXT: Record<Likely, string> = {
  probable: "chắc chắn hoặc khả năng cao (sepsis là chẩn đoán phù hợp nhất)",
  possible: "có thể (nghi vừa; chẩn đoán khác cũng có khả năng)",
  low: "khả năng nhiễm khuẩn thấp",
};
export const RISKS: { id: RiskId; label: string }[] = [
  { id: "mrsa", label: "Nguy cơ cao MRSA (đã cư trú/từng nhiễm MRSA, kháng sinh phổ rộng kéo dài, nằm viện kéo dài ở đơn vị nhiều MRSA)" },
  { id: "gnmdr", label: "Nguy cơ cao trực khuẩn Gram âm đa kháng cụ thể (ESBL, CRE, P. aeruginosa đa kháng, A. baumannii – cùng các yếu tố trên)" },
  { id: "anaerobe", label: "Yếu tố nguy cơ kỵ khí (nguồn ổ bụng, phụ khoa/sản khoa sâu, nhiễm khuẩn mô mềm hoại tử, đầu cổ, áp xe/mủ màng thần kinh trung ương)" },
  { id: "fungal", label: "Yếu tố nguy cơ nấm (suy giảm miễn dịch, kháng sinh kéo dài, nằm viện kéo dài, nguồn ổ bụng)" },
  { id: "source", label: "Có ổ nhiễm cần kiểm soát (áp xe, thủng tạng, viêm đường mật, tắc nghẽn tiết niệu, hoại tử mô mềm, catheter nhiễm khuẩn…)" },
  { id: "age65", label: "Tuổi ≥ 65" },
  { id: "obese", label: "BMI > 30 kg/m²" },
  { id: "vent", label: "Đang thở máy" },
  { id: "tbi", label: "Chấn thương sọ não" },
  { id: "cirrhosis", label: "Xơ gan" },
];

export function sepsisPlan(i: SepsisIn): SepsisOut {
  const has = (k: RiskId) => i.risks.includes(k);
  const shock = i.hemo === "shock";
  const blocks: Block[] = [];
  const avoid: RxItem[] = [];
  const notes: string[] = [];
  let headline: string;

  if (i.phase === "initial") {
    /* ---------- Thoi diem khang sinh ---------- */
    const timing: RxItem[] = [];
    if (shock) {
      headline = "Sốc nhiễm khuẩn (có thể, khả năng cao hoặc chắc chắn): kháng sinh ngay, lý tưởng trong 1 giờ kể từ khi nhận biết.";
      timing.push(r("Kháng sinh", "Dùng kháng sinh ngay, lý tưởng trong 1 giờ kể từ khi nhận biết – áp dụng cả khi sốc nhiễm khuẩn mới chỉ ở mức “có thể”.", "KC 16", "S-VL"));
    } else if (i.likely === "probable") {
      headline = "Sepsis khả năng cao/chắc chắn, chưa sốc: kháng sinh ngay, lý tưởng trong 1 giờ.";
      timing.push(r("Kháng sinh", "Dùng kháng sinh ngay, lý tưởng trong 1 giờ kể từ khi nhận biết.", "KC 17", "S-VL"));
    } else if (i.likely === "possible") {
      headline = "Có thể sepsis, chưa sốc: đánh giá nhanh nguyên nhân; nếu vẫn nghi nhiễm khuẩn, kháng sinh trong 3 giờ.";
      timing.push(r("Đánh giá nhanh", "Đánh giá nhanh khả năng nguyên nhân nhiễm khuẩn so với không nhiễm khuẩn của bệnh cảnh cấp.", "KC 19", "GPS"));
      timing.push(r("Kháng sinh", "Thăm dò nhanh có giới hạn thời gian; nếu vẫn lo ngại nhiễm khuẩn, dùng kháng sinh trong 3 giờ kể từ khi nghi sepsis. Dùng ngay khi nhiễm khuẩn trở thành nguyên nhân khả năng nhất.", "KC 18", "C-VL"));
      timing.push(r("Thăm dò gồm", "Hỏi bệnh, khám, xét nghiệm tìm nguyên nhân nhiễm khuẩn và không nhiễm khuẩn, xử trí ngay các bệnh cấp có thể giống sepsis. Nơi không có sẵn xét nghiệm để loại trừ nguyên nhân không nhiễm khuẩn mà vẫn lo ngại nhiễm khuẩn: dùng kháng sinh không trì hoãn (đồng thuận Delphi được SSC trích dẫn).", "Figure 2; phần giải thích KC 16–20"));
    } else {
      headline = "Khả năng nhiễm khuẩn thấp, không sốc: hoãn kháng sinh, tiếp tục theo dõi sát.";
      timing.push(r("Đánh giá nhanh", "Đánh giá nhanh khả năng nguyên nhân nhiễm khuẩn so với không nhiễm khuẩn.", "KC 19", "GPS"));
      timing.push(r("Hoãn kháng sinh", "Hoãn kháng sinh trong khi tiếp tục theo dõi sát người bệnh.", "KC 20", "C-VL"));
    }
    if (i.prehosp) {
      timing.push(r("Trên xe cấp cứu", "Dùng một công cụ sàng lọc sepsis chuẩn trên xe cấp cứu/máy bay (không nêu công cụ cụ thể; NEWS2 có độ nhạy tốt nhất, qSOFA thấp nhất trong nghiên cứu được trích dẫn).", "KC 3", "C-VL"));
      if (shock && i.likely === "probable" && i.delay60)
        timing.push(r("Kháng sinh trước viện", "Sepsis chắc chắn/khả năng cao kèm tụt huyết áp và dự kiến > 60 phút mới được đánh giá tại viện: dùng kháng sinh trên xe cấp cứu/máy bay. Chỉ triển khai khi đã có quy trình sàng lọc sepsis trước viện; cấy máu trước nếu có thể.", "KC 21", "C-VL"));
      else if (shock && i.likely === "probable")
        notes.push("Kháng sinh trên xe cấp cứu chỉ được gợi ý khi dự kiến > 60 phút mới được đánh giá tại viện (KC 21).");
      else if (shock)
        notes.push("Kháng sinh trên xe cấp cứu (KC 21) chỉ áp dụng cho sepsis chắc chắn hoặc khả năng cao kèm tụt huyết áp, dự kiến > 60 phút mới được đánh giá tại viện.");
    }
    blocks.push({ title: "Thời điểm kháng sinh", items: timing });

    /* ---------- Truoc khang sinh ---------- */
    blocks.push({ title: "Chẩn đoán, lấy mẫu", items: [
      r("Cấy máu", "Cấy máu càng sớm càng tốt, lý tưởng trước khi dùng kháng sinh – nhưng không để trì hoãn kháng sinh, nhất là khi tụt huyết áp.", "KC 7", "S-L"),
      r("Cách lấy", "Thường lấy 2 vị trí, 10 mL mỗi chai; lấy 1 vị trí cũng có thể chấp nhận (tổng quan hệ thống 2025, hướng dẫn Đức 2025). Số bộ cấy và chai kỵ khí cá thể hóa: chỉ chai hiếu khí có thể chấp nhận trừ khi rất nghi kỵ khí; nơi nguồn lực hạn chế có thể lấy 1 bộ. Cấy thêm theo ổ nghi ngờ (ví dụ dịch màng bụng).", "Phần giải thích KC 7"),
      r("Lactat", "Định lượng lactat máu.", "KC 8", "C-L"),
      r("Chẩn đoán", "Sepsis là chẩn đoán lâm sàng; không khẳng định hay loại trừ bằng một dấu ấn sinh học hay xét nghiệm đơn lẻ.", "KC 5", "GPS"),
      r("Procalcitonin", "Quyết định bắt đầu kháng sinh dựa trên đánh giá lâm sàng đơn thuần, không thêm procalcitonin.", "KC 22", "C-VL"),
      r("Xét nghiệm nhanh tác nhân", "Dùng theo từng ca dựa trên lâm sàng, dịch tễ tác nhân và đề kháng tại chỗ, mùa, khả năng sẵn có và hướng dẫn quản lý kháng sinh.", "KC 31", "C-L"),
      r("Chưa đủ bằng chứng", "Xét nghiệm đáp ứng vật chủ nhanh thế hệ mới (KC 6); mẫu giám sát đường hô hấp trên toàn khoa để định hướng kháng sinh (KC 30).", "KC 6, KC 30"),
    ] });

    /* ---------- Pho khang sinh ---------- */
    const cov: RxItem[] = [
      r("Nguyên tắc chọn thuốc", "Chọn ban đầu theo tác nhân khả năng nhất, mức độ nặng, ổ nghi ngờ và yếu tố người bệnh; xem thêm: vi sinh và kháng sinh đồ trong 12 tháng, kháng sinh đã dùng trong 3 tháng, dịch tễ và kháng sinh đồ tích lũy tại chỗ. Phác đồ thường dùng hay không phủ A. baumannii kháng carbapenem và S. maltophilia – thêm thuốc cho các tác nhân này phải cá thể hóa.", "IDSA AMR 2026 – Empiric Therapy", "AMR"),
      r("Phạm vi", "SSC 2026 không nêu tên thuốc cụ thể; dẫn chiếu hướng dẫn ESCMID và IDSA về vi khuẩn đa kháng, và hội chẩn chuyên gia truyền nhiễm/vi sinh khi có thể.", "Phần giải thích KC 25–26"),
    ];
    if (has("mrsa") || has("gnmdr")) {
      cov.push(r("Phủ đa kháng", `Nguy cơ cao nhiễm ${[has("mrsa") && "MRSA", has("gnmdr") && "trực khuẩn Gram âm đa kháng"].filter(Boolean).join(" và ")}: phác đồ kinh nghiệm có phủ đúng tác nhân đa kháng đó.`, "KC 25", "C-VL"));
      if (has("mrsa")) cov.push(r("MRSA", "Lợi ích về tử vong của phủ đa kháng chủ yếu từ dữ liệu quan sát ở MRSA. Nếu dùng vancomycin: liều và theo dõi theo ASHP 2020 (bên dưới).", "Phần giải thích KC 25"));
      if (has("gnmdr")) cov.push(r("Gram âm đa kháng", "Các thử nghiệm với A. baumannii, Gram âm sinh ESBL, CRE không cho thấy khác biệt tử vong khi phủ kinh nghiệm. Chọn thuốc theo kháng sinh đồ tại chỗ; điều trị theo kiểu hình khi có kết quả: xem mặt bệnh Nhiễm khuẩn huyết Gram âm, Pseudomonas aeruginosa, Enterobacterales sinh ESBL.", "Phần giải thích KC 25"));
    }
    if (!has("mrsa") || !has("gnmdr"))
      cov.push(r("Không phủ đa kháng", `Nguy cơ thấp với ${[!has("mrsa") && "MRSA", !has("gnmdr") && "Gram âm đa kháng"].filter(Boolean).join(", ")}: không phủ kinh nghiệm tác nhân đó.`, "KC 26", "C-VL"));
    cov.push(has("anaerobe")
      ? r("Phủ kỵ khí", "Có yếu tố nguy cơ nhiễm kỵ khí: phác đồ kinh nghiệm có phủ kỵ khí.", "KC 29", "C-VL")
      : r("Không phủ kỵ khí", "Không có yếu tố nguy cơ kỵ khí: phác đồ không phủ kỵ khí. Khi cần phủ vi khuẩn đa kháng mà thuốc không phủ kỵ khí không đủ, dùng thuốc có hoạt tính kỵ khí (piperacilin-tazobactam, carbapenem) vẫn phù hợp.", "KC 28", "C-VL"));
    cov.push(r("Kháng nấm", has("fungal")
      ? "Không dùng thường quy kháng nấm kinh nghiệm; có yếu tố nguy cơ nấm: cân nhắc từng ca."
      : "Không dùng kháng nấm kinh nghiệm.", "KC 27", "C-L"));
    if (has("fungal")) cov.push(r("Dấu ấn Candida", "Không dùng dấu ấn Candida (như 1,3-β-D-glucan) để quyết định bắt đầu kháng nấm; có thể cân nhắc từng ca ở người nguy cơ cao nhiễm Candida.", "KC 32", "C-L"));
    blocks.push({ title: "Phổ kháng sinh kinh nghiệm", lead: "SSC 2026 hướng dẫn quyết định phủ tác nhân nào; không đưa phác đồ thuốc, liều cụ thể.", items: cov });

    /* ---------- Cach dung ---------- */
    blocks.push({ title: "Cách dùng kháng sinh", items: [
      r("Beta-lactam", "Truyền kéo dài beta-lactam khi duy trì (sau một liều nạp) thay vì tiêm/truyền nhanh. Truyền kéo dài: ít nhất nửa khoảng đưa liều, hoặc truyền liên tục. Liều nạp trước truyền kéo dài là bắt buộc để tránh chậm đạt nồng độ; chú ý độ ổn định và tương hợp thuốc.", "KC 33", "S-M"),
      r("TDM", "Theo dõi nồng độ kháng sinh theo từng ca, dựa trên lâm sàng, dịch tễ đề kháng, nhóm thuốc và khả năng làm TDM.", "KC 34", "C-VL"),
    ] });

    /* ---------- Kiem soat o nhiem ---------- */
    const src: RxItem[] = [r("Tìm ổ", "Đánh giá nhanh chẩn đoán giải phẫu hoặc ổ nhiễm cần kiểm soát cấp cứu.", "KC 23", "GPS")];
    if (has("source")) src.push(r("Kiểm soát sớm", "Kiểm soát ổ nhiễm sớm, lý tưởng trong 6 giờ kể từ chẩn đoán sepsis/sốc cần kiểm soát ổ; sớm hơn càng tốt khi khả thi. Cố gắng ổn định nội khoa kéo dài mà chưa kiểm soát ổ ít khả năng thành công.", "KC 24", "C-VL"));
    blocks.push({ title: "Kiểm soát ổ nhiễm", items: src });

    /* ---------- Hoi suc ---------- */
    if (i.hemo !== "stable") {
      const res: RxItem[] = [
        r("Khởi đầu", "Sepsis và sốc nhiễm khuẩn là cấp cứu; điều trị và hồi sức bắt đầu ngay.", "KC 9", "GPS"),
        r("Dịch", `Ít nhất 30 mL/kg dịch tinh thể tĩnh mạch trong 3 giờ đầu; đánh giá lại thường xuyên để tránh thiếu hoặc thừa dịch.${has("obese") ? " BMI > 30: tính theo cân nặng hiệu chỉnh hoặc cân nặng lý tưởng." : " Tính theo cân nặng thực (BMI > 30: cân nặng hiệu chỉnh hoặc lý tưởng)."}`, "KC 10", "C-L"),
        r("Loại dịch", "Dịch tinh thể là lựa chọn đầu tay.", "KC 43", "S-M"),
        r("Dịch cân bằng", has("tbi") ? "Chấn thương sọ não: dùng natri clorid 0,9% (không dùng dịch cân bằng)." : "Ưu tiên dịch tinh thể cân bằng hơn natri clorid 0,9% khi hồi sức ban đầu.", "KC 44", "C-M"),
        r("Albumin", has("cirrhosis") ? "Dịch tinh thể đơn thuần hơn là thêm albumin; albumin có thể phù hợp ở người xơ gan hoặc đã nhận lượng lớn dịch tinh thể." : has("tbi") ? "Dịch tinh thể đơn thuần; tránh albumin ở người chấn thương sọ não." : "Dịch tinh thể đơn thuần hơn là thêm albumin; albumin có thể phù hợp khi đã nhận lượng lớn dịch tinh thể hoặc xơ gan.", "KC 45", "C-M"),
        r("Theo dõi", "Lactat nối tiếp để định hướng hồi sức (KC 51, C-L) – cá thể hóa dịch sau liều đầu, không truyền dịch đến khi lactat về bình thường. Thời gian đổ đầy mao mạch làm thông số bổ trợ (KC 52, C-L). Sau 30 mL/kg còn giảm tưới máu: đánh giá đáp ứng dịch bằng thông số động (nâng chân thụ động, test dịch) (KC 49, C-L).", "KC 49, 51, 52", "C-L"),
        r("Chiến lược tiếp", "Đã nhận 30 mL/kg mà còn giảm tưới máu: dùng chiến lược dịch tự do hoặc hạn chế tùy người bệnh và điều kiện cơ sở.", "KC 48", "C-L"),
      ];
      if (i.hemo === "hypoperf" || shock)
        res.push(r("Vận mạch", "Bolus dịch tinh thể trước, sau đó vận mạch nếu vẫn tụt huyết áp. Sốc không ổn định (huyết áp rất thấp, da nổi vân, xám tái, tím/SpO₂ giảm, nhịp nhanh, rối loạn ý thức): có thể dùng vận mạch đồng thời với dịch.", "KC 11", "C-VL"));
      if (shock) {
        res.push(
          r("Vận mạch đầu tay", "Norepinephrin là thuốc đầu tay – hơn dopamin (Mạnh; cao), epinephrin (Mạnh; thấp), selepressin (Mạnh; thấp) [KC 53]; hơn vasopressin (Có ĐK; thấp) hoặc angiotensin II (Có ĐK; rất thấp) [KC 55].", "KC 53, KC 55"),
          r("Đường truyền", "Bắt đầu vận mạch qua tĩnh mạch ngoại vi thay vì chờ đặt catheter tĩnh mạch trung tâm (cần quy trình theo dõi thoát mạch).", "KC 12", "C-VL"),
          r("Đích HATB", has("age65") ? "Tuổi ≥ 65: đích HATB ban đầu 60–65 mmHg (KC 14, C-L)." : "Đích HATB ban đầu 65 mmHg (dao động khoảng 5 mmHg).", has("age65") ? "KC 13–14" : "KC 13", has("age65") ? "C-L" : "S-M"),
          r("Thêm vasopressin", "Đang tăng liều norepinephrin: thêm vasopressin.", "KC 56", "C-M"),
          r("Thêm epinephrin", "HATB chưa đạt dù norepinephrin + vasopressin: thêm epinephrin (không có vasopressin: thêm epinephrin vào norepinephrin).", "KC 57", "C-VL"),
          r("Rối loạn chức năng tim", "Kèm rối loạn chức năng tim: norepinephrin hoặc epinephrin đầu tay (KC 58). Còn giảm tưới máu dù đủ dịch và huyết áp: dùng thuốc tăng co bóp – thêm dobutamin vào norepinephrin hoặc dùng epinephrin đơn thuần, phối hợp chứ không thay vận mạch (KC 60–61).", "KC 58, 60, 61", "C-VL"),
          r("Corticoid", "Dùng corticosteroid tĩnh mạch trong sốc nhiễm khuẩn.", "KC 79", "C-L"),
          r("Huyết áp", "Đo huyết áp xâm lấn hoặc không xâm lấn; nên xâm lấn khi cần vận mạch liều trung bình–cao, tăng liều hoặc nhiều thuốc, cần lấy khí máu thường xuyên, hoặc huyết áp không xâm lấn không thống nhất.", "KC 42", "C-VL"),
        );
        notes.push("Thực hành của hội đồng SSC (không phải khuyến cáo): 90% thành viên dùng corticoid kê hydrocortison 200 mg/24 giờ, 86% tiêm ngắt quãng; 63% không dùng kèm fludrocortison.");
      }
      res.push(r("ICU", "Cần ICU: chuyển vào ICU trong 6 giờ.", "KC 15", "C-L"));
      blocks.push({ title: shock ? "Hồi sức sốc nhiễm khuẩn" : "Hồi sức – giảm tưới máu do sepsis", items: res });
      avoid.push(
        r("Không dùng", "Dung dịch hydroxyethyl starch (khuyến cáo không dùng).", "KC 46", "S-H"),
        r("Không dùng", "Gelatin để hồi sức.", "KC 47", "C-M"),
      );
      if (shock) avoid.push(
        r("Không dùng", "Terlipressin.", "KC 54", "C-L"),
        r("Không dùng", "Levosimendan khi rối loạn chức năng tim.", "KC 62", "C-L"),
        r("Không dùng", "Chẹn beta (esmolol, landiolol) để điều trị sốc nhiễm khuẩn.", "KC 64", "C-VL"),
      );
    }
  } else {
    /* ---------- Danh gia lai ---------- */
    const re: RxItem[] = [r("Đánh giá lại", "Liên tục đánh giá lại, tìm chẩn đoán khác; ngừng kháng sinh kinh nghiệm nếu đã chứng minh hoặc rất nghi nguyên nhân không nhiễm khuẩn.", "KC 35", "GPS")];
    if (i.culture === "pathogen") {
      headline = "Đã có tác nhân và kháng sinh đồ: xuống thang (ngừng thuốc không cần thiết, thu hẹp phổ).";
      re.push(r("Xuống thang", "Xuống thang khi đã có chẩn đoán vi sinh và kháng sinh đồ: ngừng kháng sinh không cần thiết hoặc thu hẹp phổ khi phù hợp.", "KC 36", "S-VL"));
      re.push(r("Cấy lại", "Cấy lại để xác nhận sạch khuẩn khi tác nhân là S. aureus, S. lugdunensis hoặc Candida.", "Phần giải thích KC 7"));
      re.push(r("Thuốc ban đầu không nhạy", "Kháng sinh đồ cho thấy thuốc kinh nghiệm không có tác dụng: đổi sang thuốc nhạy, tính thời gian điều trị từ ngày bắt đầu thuốc có tác dụng (trừ viêm bàng quang không biến chứng đã cải thiện). Thời gian cho vi khuẩn kháng thuốc nhìn chung không khác vi khuẩn nhạy.", "IDSA AMR 2026 – Duration", "AMR"));
    } else if (i.culture === "negative") {
      headline = "Cấy cuối cùng không phân lập được tác nhân: xuống thang ở người bệnh đang cải thiện.";
      re.push(r("Xuống thang", "Xuống thang kể cả khi cấy cuối cùng không phân lập được tác nhân.", "KC 37", "C-VL"));
      re.push(r("Lưu ý", "Nơi xét nghiệm vi sinh hạn chế và tỷ lệ đa kháng cao, cấy âm tính ít bảo đảm hơn – cân nhắc kỹ nguy cơ tác nhân đa kháng chưa phát hiện trước khi xuống thang.", "Phần giải thích KC 36–37"));
    } else {
      headline = "Đã chứng minh hoặc rất nghi nguyên nhân không nhiễm khuẩn: ngừng kháng sinh kinh nghiệm.";
    }
    re.push(
      r("Thời gian", "Đã kiểm soát ổ nhiễm đầy đủ: ưu tiên thời gian điều trị ngắn hơn (thử nghiệm BALANCE: 7 ngày không kém 14 ngày ở nhiễm khuẩn huyết).", "KC 39", "C-VL"),
      r("Procalcitonin", "Đã kiểm soát ổ nhiễm mà chưa rõ thời gian tối ưu: dùng procalcitonin kèm đánh giá lâm sàng để quyết định ngừng kháng sinh.", "KC 40", "C-L"),
      r("Chuyển uống", "Khi: tác nhân nhạy với thuốc uống phù hợp; huyết động ổn định; thuốc uống đạt nồng độ tại ổ nhiễm; hấp thu tiêu hóa đủ.", "IDSA AMR 2026 – Transitioning to Oral Therapy", "AMR"),
    );
    if (has("fungal")) re.push(r("Kháng nấm", "Đang dùng kháng nấm kinh nghiệm: không dùng dấu ấn Candida để quyết định ngừng; có thể cân nhắc từng ca ở người cải thiện và nguy cơ cao.", "KC 38", "C-L"));
    if (has("vent")) re.push(r("Khử khuẩn chọn lọc", "Thở máy, ở đơn vị tỷ lệ kháng kháng sinh thấp: dùng khử khuẩn chọn lọc đường tiêu hóa (SDD).", "KC 41", "C-M"));
    blocks.push({ title: "Đánh giá lại, xuống thang, thời gian", items: re });
  }

  avoid.push(
    r("Không dùng", "Vitamin C tĩnh mạch.", "KC 81", "C-L"),
    r("Không dùng", "Immunoglobulin tĩnh mạch.", "KC 82", "C-L"),
    r("Không dùng", "Kỹ thuật lọc máu hấp phụ: hấp phụ máu, lọc máu liều cao, thay huyết tương (KC 83, C-VL); hấp phụ polymyxin B (KC 84, C-L).", "KC 83, KC 84"),
    r("Không dùng", "Hạ sốt (thuốc hoặc làm mát bề mặt) nhằm cải thiện kết cục – vẫn dùng được để giảm đau, giảm triệu chứng.", "KC 80", "C-VL"),
    r("Không dùng", "Vitamin D để điều trị sepsis; probiotic.", "KC 85, KC 88", "C-VL"),
  );
  return { headline, blocks, avoid, notes, showVanco: i.phase === "initial" && has("mrsa") };
}
