/*
  Lua chon khang sinh kinh nghiem cu the cho sepsis/soc nhiem khuan nguoi lon theo
  SWAB 2021 – The Dutch Working Party on Antibiotic Policy guidelines for empirical antibacterial therapy of sepsis in adults
  (Sieswerda E, Bax HI, Hoogerwerf JJ va cs., BMC Infect Dis 2022;22:687; doi:10.1186/s12879-022-07653-3; PMC9373543).
  Huong dan nay duoc SSC 2026 trich dan (tai lieu 290). GRADE: Strong/Weak + chat luong bang chung; GPS.
  Nguon doc: toan van Europe PMC + Additional file 1 (sTable 1, sTable 2, sTable 3) + Figure 1, ngay 15/11/2026.
  Ma "KC n" = so khuyen cao trong Table 5 cua SWAB. Lieu = sTable 3 (nguoi lon), khong tu quy doi.
  2GC trong bang lieu SWAB = cefuroxim; 3GC = ceftriaxon hoac cefotaxim (khong gom ceftazidim) – Figure 1, chu thich **.
  Cefotaxim KHONG co trong sTable 3 -> de trong lieu.
*/
import type { RxItem } from "./septic-arthritis-pids2023";

const S = "SWAB 2021";
const r = (role: string, text: string, ref: string, grade?: string, dose?: string): RxItem => ({ role, text, ref, grade, dose });

export type Gcr = "low" | "increased" | "high";
export type Focus = "unknown" | "abdomen" | "biliary" | "hapvap" | "cvc" | "other";
export type SwabIn = { gcr: Gcr; focus: Focus; pseudo: boolean; saureus: boolean; pcnAllergy: boolean };

/* sTable 3 – lieu TM nguoi lon */
export const SWAB_DOSE: RxItem[] = [
  r("Ceftriaxon", "Ngắt quãng hoặc kéo dài: 1 × 2.000 mg/ngày. Truyền liên tục: 2.000 mg/24 giờ + liều nạp 2.000 mg.", `${S} – sTable 3`, undefined, "1 × 2.000 mg; 2 × 2.000 mg khi S. aureus"),
  r("Cefuroxim (2GC)", "Ngắt quãng hoặc kéo dài: 3 × 1.500 mg/ngày. Truyền liên tục: 4.500 mg/24 giờ + liều nạp 1.500 mg.", `${S} – sTable 3`, undefined, "3 × 1.500 mg"),
  r("Piperacilin-tazobactam", "Ngắt quãng hoặc kéo dài (truyền 3–5 giờ): 4 × 4.500 mg/ngày. Truyền liên tục: 18.000 mg/24 giờ + liều nạp 4.500 mg.", `${S} – sTable 3`, undefined, "4 × 4.500 mg; 3 × 4.500 mg khi không liên quan Pseudomonas"),
  r("Meropenem", "Ngắt quãng hoặc kéo dài (truyền 3 giờ): 3 × 1.000 mg/ngày. Truyền liên tục: 3.000 mg/24 giờ + liều nạp 1.000 mg. Có thể tăng tới 6.000 mg/24 giờ (theo EUCAST).", `${S} – sTable 3`, undefined, "3 × 1.000 mg"),
  r("Imipenem", "Ngắt quãng hoặc kéo dài: 4 × 1.000 mg/ngày. Truyền liên tục: 4.000 mg/24 giờ + liều nạp 1.000 mg.", `${S} – sTable 3`, undefined, "4 × 1.000 mg; 4 × 500 mg khi không liên quan Pseudomonas"),
  r("Ceftazidim", "Ngắt quãng hoặc kéo dài (truyền 3 giờ): 3 × 2.000 mg/ngày. Truyền liên tục: 6.000 mg/24 giờ + liều nạp 2.000 mg.", `${S} – sTable 3`, undefined, "3 × 2.000 mg; 3 × 1.000 mg khi không liên quan Pseudomonas"),
  r("Ciprofloxacin liều cao", "Tiêm truyền tĩnh mạch ngắt quãng.", `${S} – sTable 3, KC 55`, "GPS", "3 × 400 mg; 2 × 400 mg khi không liên quan Pseudomonas"),
  r("Gentamicin", "Tính theo cân nặng hiệu chỉnh; định lượng nồng độ ngay; luôn phối hợp với kháng sinh khác (thường là beta-lactam); có thể không tối ưu cho P. aeruginosa. Ngừng aminoglycosid kinh nghiệm tối đa sau 2 ngày (SWAB KC 46, Mạnh; thấp).", `${S} – sTable 3, KC 46`, undefined, "1 × 5 mg/kg; 1 × 6–7 mg/kg có thể cần khi do Enterobacterales"),
  r("Tobramycin", "Tính theo cân nặng hiệu chỉnh; định lượng nồng độ ngay; luôn phối hợp với kháng sinh khác. Ngừng aminoglycosid kinh nghiệm tối đa sau 2 ngày (SWAB KC 46, Mạnh; thấp).", `${S} – sTable 3, KC 46`, undefined, "1 × 5 mg/kg; 1 × 6–7 mg/kg có thể cần khi do Enterobacterales hoặc Pseudomonas"),
  r("Metronidazol", "Tiêm truyền tĩnh mạch ngắt quãng.", `${S} – sTable 3`, undefined, "3 × 500 mg"),
  r("Flucloxacilin", "Ngắt quãng hoặc kéo dài: 6 × 1.000 mg/ngày. Truyền liên tục: 6.000 mg/24 giờ + liều nạp 1.000 mg. Có thể tăng tới 12.000 mg/24 giờ.", `${S} – sTable 3`, undefined, "6 × 1.000 mg"),
  r("Vancomycin", "Tính theo cân nặng hiệu chỉnh; theo dõi nồng độ. Truyền liên tục: 30–40 mg/kg/24 giờ + liều nạp 15–20 mg/kg (SWAB KC 54 gợi ý truyền liên tục).", `${S} – sTable 3, KC 54`, undefined, "2–3 × 15–20 mg/kg + liều nạp 25–30 mg/kg"),
];
export const SWAB_DOSE_NOTE = "Cefotaxim (cũng là 3GC theo SWAB) không có trong bảng liều. Cân nặng hiệu chỉnh = cân nặng lý tưởng + 0,4 × (cân nặng thực – cân nặng lý tưởng); cân nặng lý tưởng nam 50 kg + 0,9 × (số cm trên 150), nữ 45 kg + 0,9 × (số cm trên 150). Liều 24 giờ cao hơn thì liều nạp cũng cao hơn (một liều ngắt quãng). Liều theo EUCAST với tác nhân cần liều cao.";

const PIP = "Piperacilin-tazobactam (truyền kéo dài hoặc liên tục)";
const CARB = "Meropenem hoặc imipenem đơn trị";
const GC23AG = "Cephalosporin thế hệ 2 hoặc 3 + aminoglycosid";
const GC23CIP = "Cephalosporin thế hệ 2 hoặc 3 + ciprofloxacin liều cao";

export const FOCUS_TEXT: Record<Focus, string> = {
  unknown: "chưa rõ ổ nhiễm",
  abdomen: "nhiễm khuẩn ổ bụng",
  biliary: "viêm đường mật",
  hapvap: "viêm phổi bệnh viện / thở máy",
  cvc: "nghi nhiễm khuẩn catheter tĩnh mạch trung tâm",
  other: "viêm phổi cộng đồng, tiết niệu, da – mô mềm",
};

export function swabPlan(i: SwabIn): { title: string; lead: string; items: RxItem[]; notes: string[] } {
  const items: RxItem[] = [];
  const notes: string[] = [];
  const metro = i.focus === "abdomen" ? " + metronidazol" : "";
  let lead: string;

  if (i.gcr === "high") {
    lead = "Nguy cơ cao Enterobacterales kháng cephalosporin thế hệ 3 (3GCR-E): đã nhiễm hoặc cư trú 3GCR-E trong 1 năm.";
    items.push(
      r("Lựa chọn 1", `${CARB}. Ưu tiên nhất là khi chủng trước đây kháng aminoglycosid hoặc ciprofloxacin, hoặc có nguy cơ độc tính (đã biết suy thận).`, `${S} – KC 23, sTable 2`, "S-M"),
      r("Thay thế", `${GC23AG}${metro} – khi dịch tễ đề kháng tại chỗ cho phép, chưa có sepsis, và/hoặc chủng 3GCR-E trước đây nhạy. Khoảng 1/3 Enterobacterales sinh ESBL kháng aminoglycosid.`, `${S} – sTable 2`),
      r("Thay thế", `${GC23CIP}${metro} – khi tỷ lệ kháng ciprofloxacin tại chỗ cho phép và/hoặc chủng trước đây nhạy (tại Hà Lan khoảng 2/3 ESBL kháng ciprofloxacin).`, `${S} – sTable 2`),
      r("Thay thế", "Piperacilin-tazobactam – chỉ khi chủng 3GCR-E trước đây không sinh ESBL và nhạy piperacilin-tazobactam (nhiều khả năng kém hơn khi do ESBL).", `${S} – sTable 2`),
    );
  } else if (i.gcr === "increased") {
    lead = "Nguy cơ tăng 3GCR-E nhưng không có nhiễm/cư trú 3GCR-E trong 1 năm: chiến lược tiết kiệm carbapenem có thể chấp nhận.";
    items.push(
      r("Lựa chọn 1", `${GC23AG}${metro} – tiết kiệm carbapenem và fluoroquinolon; tương đương khi không có suy thận đã biết. Theo dõi nồng độ, aminoglycosid tối đa 2 ngày.`, `${S} – KC 24, sTable 2`, "C-VL"),
      r("Lựa chọn 1", `${CARB} – tương đương; ít độc tính hơn, nhất là khi suy thận; phổ rất rộng.`, `${S} – sTable 2`),
      r("Thay thế", `${GC23CIP}${metro} – khi tỷ lệ kháng ciprofloxacin tại chỗ cho phép dùng kinh nghiệm.`, `${S} – sTable 2`),
    );
  } else {
    lead = "Nguy cơ thấp 3GCR-E – chọn theo ổ nhiễm.";
    if (i.focus === "unknown") {
      items.push(
        r("Lựa chọn 1", "Cephalosporin thế hệ 3 (ceftriaxon hoặc cefotaxim). Liều cao 3GC khi nhiều khả năng S. aureus.", `${S} – KC 16, sTable 1`, "C-L"),
        r("Thay thế", `${PIP} – khi nhiều khả năng kỵ khí, P. aeruginosa hoặc enterococcus.`, `${S} – sTable 1`),
        r("Thay thế", "Cephalosporin thế hệ 2 + ciprofloxacin liều cao hoặc aminoglycosid – khi nhiều khả năng S. aureus hoặc P. aeruginosa.", `${S} – sTable 1`),
      );
    } else if (i.focus === "abdomen") {
      items.push(
        r("Lựa chọn 1", "Cephalosporin thế hệ 3 + metronidazol.", `${S} – KC 19, sTable 1`, "C-L"),
        r("Thay thế", `${PIP} – khi nhiều khả năng P. aeruginosa hoặc enterococcus.`, `${S} – sTable 1`),
      );
    } else if (i.focus === "biliary") {
      items.push(
        r("Lựa chọn 1", "Cephalosporin thế hệ 3. Thêm metronidazol nếu có nối mật – ruột.", `${S} – KC 18, sTable 1`, "C-L"),
        r("Thay thế", `${PIP} – khi nhiều khả năng kỵ khí, enterococcus hoặc P. aeruginosa; thay cho 3GC + metronidazol khi có nối mật – ruột.`, `${S} – sTable 1`),
        r("Thay thế", "Cephalosporin thế hệ 2/3 + ciprofloxacin liều cao hoặc aminoglycosid – khi nhiều khả năng P. aeruginosa (thêm metronidazol nếu nối mật – ruột).", `${S} – sTable 1`),
      );
    } else if (i.focus === "hapvap") {
      items.push(
        r("Tương đương", "Cephalosporin thế hệ 3 + ciprofloxacin liều cao (không phủ kỵ khí).", `${S} – KC 17, sTable 1`, "C-L"),
        r("Tương đương", `${PIP} (phủ P. aeruginosa và kỵ khí, phổ rộng hơn).`, `${S} – KC 17, sTable 1`, "C-L"),
        r("Tương đương", "Cephalosporin thế hệ 2 + ciprofloxacin liều cao.", `${S} – sTable 1`),
      );
    } else if (i.focus === "cvc") {
      items.push(
        r("Rút catheter", "Rút catheter ngay.", `${S} – KC 20`, "GPS"),
        r("Tương đương", "Cephalosporin thế hệ 3 liều cao + gentamicin hoặc ciprofloxacin liều cao.", `${S} – KC 21, sTable 1`, "GPS"),
        r("Tương đương", PIP, `${S} – sTable 1`),
        r("Tương đương", "Cephalosporin thế hệ 2 + ciprofloxacin liều cao hoặc aminoglycosid.", `${S} – sTable 1`),
        r("Thay thế", "Flucloxacilin + ciprofloxacin liều cao hoặc aminoglycosid – nhất là khi nhiều khả năng S. aureus.", `${S} – sTable 1`),
        r("Thay thế", "Vancomycin + thuốc phủ Gram âm – khi nhiều khả năng enterococcus hoặc có vật liệu nhân tạo nội mạch.", `${S} – sTable 1`),
      );
      notes.push("SWAB không áp dụng cho catheter tĩnh mạch trung tâm dài ngày.");
    } else {
      items.push(r("Hướng dẫn khác", "Sepsis do viêm phổi cộng đồng, nhiễm khuẩn tiết niệu, da – mô mềm: SWAB dẫn chiếu hướng dẫn riêng của từng bệnh – xem mặt bệnh tương ứng trong ứng dụng.", `${S} – KC 22`));
    }
  }

  if (i.pseudo) items.push(r("P. aeruginosa", "Đã nhiễm hoặc cư trú P. aeruginosa trong 1 năm: phác đồ kinh nghiệm phải phủ P. aeruginosa (ví dụ các phương án ghi “khi nhiều khả năng P. aeruginosa”).", `${S} – KC 3`, "S-VL"));
  if (i.saureus) items.push(r("S. aureus", "Chưa đủ bằng chứng để khuyến cáo không dùng beta-lactam khác ngoài flucloxacilin hoặc cefazolin khi nhiều khả năng S. aureus. Dùng liều cao 3GC (ceftriaxon 2 × 2.000 mg).", `${S} – KC 27, sTable 1, sTable 3`));
  if (i.pcnAllergy) items.push(
    r("Dị ứng penicilin", "Khai thác thông tin dị ứng (tiền sử, kết quả test da) nếu có thể.", `${S} – KC 29`, "GPS"),
    r("Dị ứng penicilin", "Dị ứng rất khó xảy ra: dùng penicilin được. Dị ứng đã chứng minh, có thể hoặc không rõ: tránh penicilin trong đợt điều trị sepsis, chọn cephalosporin hoặc carbapenem (nguy cơ dị ứng chéo nặng < 1%). Phản ứng muộn nặng (SJS, TEN, viêm thận kẽ) với một beta-lactam: tránh thuốc đó, chọn thuốc khác hoặc hỏi chuyên gia.", `${S} – KC 30–31, Table 3`, "C-VL"),
  );
  items.push(
    r("Không thường quy", "Không phối hợp hai thuốc cùng có tác dụng trên một tác nhân (ví dụ ceftriaxon + aminoglycosid để diệt nhanh Gram âm) một cách thường quy cho sepsis hoặc sốc nhiễm khuẩn. Phối hợp để mở rộng phổ hoặc phủ nhiều tác nhân không thuộc định nghĩa này.", `${S} – KC 12`, "S-M"),
    r("Không thường quy", "Không phủ enterococcus thường quy (SWAB KC 10, Mạnh; trung bình); cân nhắc từng ca – cấy gần đây có enterococcus, mới phẫu thuật ổ bụng phức tạp, nghi nhiễm khuẩn catheter và đã dùng nhiều kháng sinh phổ rộng (SWAB KC 11, Có ĐK; rất thấp).", `${S} – KC 10–11`),
  );
  notes.push(
    "Nguy cơ tăng 3GCR-E (đánh giá từng người – SWAB KC 2, Có ĐK; rất thấp): tỷ lệ 3GCR-E tại chỗ; nhiễm khuẩn bệnh viện/liên quan chăm sóc y tế; dùng kháng sinh phổ rộng trong 2 tháng; đang dùng SDD; đi tới vùng lưu hành cao trong 3 tháng; nằm viện ở nước ngoài trong 2 tháng.",
    "SWAB 2021 xây dựng cho dịch tễ Hà Lan, tỷ lệ kháng thấp (Table 2). Ở nơi tỷ lệ Enterobacterales kháng cephalosporin thế hệ 3 cao, nhiều người bệnh sẽ thuộc nhóm “nguy cơ tăng” theo tiêu chí tỷ lệ tại chỗ – đối chiếu kháng sinh đồ tích lũy của bệnh viện (SWAB KC 5–6, Mạnh; rất thấp).",
    "Chọn khi có chẩn đoán xác định: theo hướng dẫn của bệnh đó (ví dụ viêm phổi cộng đồng). Cân nhắc xuống thang hằng ngày (SWAB KC 45, Mạnh; rất thấp); chuyển uống sau 48–72 giờ khi phù hợp (SWAB KC 47, Mạnh; rất thấp); sepsis/sốc không rõ ổ, đáp ứng tốt: 7 ngày (SWAB KC 42, Có ĐK; thấp).",
  );
  return { title: "Lựa chọn kháng sinh cụ thể – SWAB 2021", lead, items, notes };
}
