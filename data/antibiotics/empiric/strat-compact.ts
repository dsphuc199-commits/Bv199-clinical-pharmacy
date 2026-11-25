/*
  FILE: data/antibiotics/empiric/strat-compact.ts

  Thẻ thuốc gọn cho khung phân tầng: câu dài ở các module quốc tế (SWAB 2021, EAU 2026, IDSA 2025, SIS/WSES, ACE 2026,
  WHO 2025, IDSA/ATS 2016, IDSA 2014) được rút thành câu ngắn cùng nội dung. Chỉ áp dụng cho khung phân tầng – dữ liệu
  nguồn dùng chung với công cụ hướng dẫn cũ giữ nguyên. Liều không đổi số liệu, chỉ viết gọn.
  Câu không có trong bảng giữ nguyên.
*/
import type { Stratification, StratIntl } from "./stratification";

const TEXT: Record<string, string> = {
  /* SWAB 2021 – nhiễm khuẩn huyết chưa rõ ổ */
  "Piperacilin-tazobactam (truyền kéo dài hoặc liên tục) – khi nhiều khả năng kỵ khí, P. aeruginosa hoặc enterococcus.": "Piperacilin-tazobactam (truyền kéo dài hoặc liên tục) – nghi kỵ khí, P. aeruginosa, enterococcus.",
  "Cephalosporin thế hệ 2 + ciprofloxacin liều cao hoặc aminoglycosid – khi nhiều khả năng S. aureus hoặc P. aeruginosa.": "Cephalosporin thế hệ 2 + ciprofloxacin liều cao hoặc aminoglycosid – nghi S. aureus, P. aeruginosa.",
  "Cephalosporin thế hệ 2 hoặc 3 + aminoglycosid – tiết kiệm carbapenem và fluoroquinolon; tương đương khi không có suy thận đã biết. Theo dõi nồng độ, aminoglycosid tối đa 2 ngày.": "Cephalosporin thế hệ 2–3 + aminoglycosid – tiết kiệm carbapenem; aminoglycosid tối đa 2 ngày, theo dõi nồng độ.",
  "Meropenem hoặc imipenem đơn trị – tương đương; ít độc tính hơn, nhất là khi suy thận; phổ rất rộng.": "Meropenem hoặc imipenem đơn trị – ít độc tính hơn khi suy thận; phổ rất rộng.",
  "Cephalosporin thế hệ 2 hoặc 3 + ciprofloxacin liều cao – khi tỷ lệ kháng ciprofloxacin tại chỗ cho phép dùng kinh nghiệm.": "Cephalosporin thế hệ 2–3 + ciprofloxacin liều cao – khi kháng ciprofloxacin tại chỗ thấp.",
  "Meropenem hoặc imipenem đơn trị. Ưu tiên nhất là khi chủng trước đây kháng aminoglycosid hoặc ciprofloxacin, hoặc có nguy cơ độc tính (đã biết suy thận).": "Meropenem hoặc imipenem đơn trị – nhất là khi chủng cũ kháng aminoglycosid/ciprofloxacin hoặc suy thận.",
  "Cephalosporin thế hệ 2 hoặc 3 + aminoglycosid – khi dịch tễ đề kháng tại chỗ cho phép, chưa có sepsis, và/hoặc chủng 3GCR-E trước đây nhạy. Khoảng 1/3 Enterobacterales sinh ESBL kháng aminoglycosid.": "Cephalosporin thế hệ 2–3 + aminoglycosid – chưa sepsis, dịch tễ cho phép hoặc chủng cũ còn nhạy.",
  "Cephalosporin thế hệ 2 hoặc 3 + ciprofloxacin liều cao – khi tỷ lệ kháng ciprofloxacin tại chỗ cho phép và/hoặc chủng trước đây nhạy (tại Hà Lan khoảng 2/3 ESBL kháng ciprofloxacin).": "Cephalosporin thế hệ 2–3 + ciprofloxacin liều cao – dịch tễ cho phép hoặc chủng cũ còn nhạy.",
  "Piperacilin-tazobactam – chỉ khi chủng 3GCR-E trước đây không sinh ESBL và nhạy piperacilin-tazobactam (nhiều khả năng kém hơn khi do ESBL).": "Piperacilin-tazobactam – chỉ khi chủng cũ không sinh ESBL và còn nhạy.",
  /* EAU 2026, IDSA 2025 – tiết niệu */
  "Cấy nước tiểu khi nghi nhiễm khuẩn toàn thân, triệu chứng không hết hoặc tái phát trong 4 tuần sau điều trị, triệu chứng không điển hình, nguy cơ vi khuẩn kháng thuốc, hoặc có thai.": "Cấy nước tiểu khi: nghi nhiễm khuẩn toàn thân, không hết hoặc tái phát trong 4 tuần, không điển hình, nguy cơ kháng thuốc, có thai.",
  "Người bệnh không cao tuổi có thể chọn điều trị không kháng sinh sau khi cùng thầy thuốc cân nhắc: triệu chứng có thể nặng hơn và nguy cơ viêm thận bể thận tăng nhẹ.": "Không cao tuổi: có thể không dùng kháng sinh sau khi cân nhắc cùng thầy thuốc (nguy cơ viêm thận bể thận tăng nhẹ).",
  "Triệu chứng không hết khi kết thúc điều trị hoặc tái phát trong 2 tuần: cấy và làm kháng sinh đồ, điều trị lại 7 ngày bằng thuốc khác.": "Không hết hoặc tái phát trong 2 tuần: cấy, điều trị lại 7 ngày bằng thuốc khác.",
  "Suy thận: phần lớn kháng sinh không cần chỉnh liều cho đến khi GFR < 20 mL/phút, trừ thuốc độc với thận như aminoglycosid. Nitrofurantoin chống chỉ định khi eGFR < 30 mL/phút/1,73 m². Lợi tiểu quai phối hợp cephalosporin gây độc thận.": "Suy thận: đa số không chỉnh liều tới GFR < 20 mL/phút (trừ aminoglycosid); nitrofurantoin chống chỉ định khi eGFR < 30.",
  "Có sốt, viêm thận bể thận, tái phát hoặc nghi yếu tố phức tạp: điều trị tối thiểu 2 tuần vì tuyến tiền liệt thường bị tổn thương.": "Sốt, viêm thận bể thận, tái phát hoặc yếu tố phức tạp: tối thiểu 2 tuần.",
  "Xét nghiệm nước tiểu, cấy nước tiểu và làm kháng sinh đồ cho mọi trường hợp. Chẩn đoán hình ảnh để loại trừ tắc nghẽn, sỏi. Còn sốt sau 72 giờ hoặc xấu đi: chụp cắt lớp vi tính có cản quang.": "Cấy nước tiểu, kháng sinh đồ mọi ca; chẩn đoán hình ảnh loại trừ tắc nghẽn. Còn sốt sau 72 giờ: chụp CT.",
  "Liên hệ lại người bệnh sau 48–72 giờ. Không xét nghiệm nước tiểu thường quy sau điều trị nếu hết triệu chứng.": "Liên hệ lại sau 48–72 giờ; không xét nghiệm lại nếu hết triệu chứng.",
  "Fluoroquinolon có sinh khả dụng đường uống cao; thời điểm chuyển uống phụ thuộc khả năng uống của người bệnh.": "Fluoroquinolon: sinh khả dụng uống cao, chuyển uống khi uống được.",
  "Fluoroquinolon chỉ nên dùng khi không dự kiến kháng thuốc; nếu tỷ lệ kháng tại chỗ > 10% (sốc) hoặc > 20% (sepsis) thì không dùng làm kinh nghiệm. Nếu tỷ lệ E. coli niệu kháng fluoroquinolon > 45%, việc chưa từng dùng fluoroquinolon không bảo đảm chủng còn nhạy.": "Fluoroquinolon: không dùng kinh nghiệm nếu kháng tại chỗ > 10% (sốc) hoặc > 20% (sepsis).",
  "Liều tĩnh mạch là liều dùng trong các thử nghiệm lâm sàng ở người có chức năng thận bình thường, không phải liều khuyến cáo; hiệu chỉnh theo chức năng thận.": "Liều tĩnh mạch là liều trong thử nghiệm (thận bình thường); hiệu chỉnh theo chức năng thận.",
  "Có kết quả cấy (định danh và kháng sinh đồ): chuyển sớm sang kháng sinh hiệu quả phổ hẹp phù hợp thay vì tiếp tục kháng sinh phổ rộng suốt đợt (có điều kiện; bằng chứng thấp).": "Có kháng sinh đồ: chuyển sớm sang thuốc phổ hẹp (có điều kiện, bằng chứng thấp).",
  "Cefepim, piperacillin-tazobactam, ceftriaxon: liều thấp đã được nghiên cứu nhưng khuyến cáo dùng liều cao hơn.": "Cefepim, piperacillin-tazobactam, ceftriaxon: dùng liều cao hơn.",
  "Có thể dùng thuốc phổ rộng hơn (phủ P. aeruginosa, Enterococcus, MRSA) khi chưa chắc chẩn đoán nhiễm khuẩn tiết niệu hoặc nghi các tác nhân này.": "Nghi P. aeruginosa, Enterococcus, MRSA hoặc chưa chắc nguồn tiết niệu: có thể dùng phổ rộng hơn.",
  "Bao phủ ESBL khi nguy cơ tăng theo tỷ lệ trong cộng đồng, kết quả cấy trước đó và kháng sinh đã dùng.": "Phủ ESBL theo tỷ lệ cộng đồng, kết quả cấy trước đó, kháng sinh đã dùng.",
  "Thể nhẹ đến vừa, uống được: có thể điều trị ngoại trú, ưu tiên ciprofloxacin hoặc levofloxacin khi phù hợp; liên hệ lại sau 48–72 giờ.": "Nhẹ–vừa, uống được: ngoại trú, ưu tiên ciprofloxacin/levofloxacin; liên hệ lại sau 48–72 giờ.",
  "Cấy máu khi nhiễm khuẩn huyết, bệnh nặng hoặc nước tiểu mọc S. aureus. Siêu âm ban đầu; chụp cắt lớp hoặc cộng hưởng từ khi ứ nước thận, nghi tắc nghẽn, bệnh nặng hoặc không cải thiện sau 48–72 giờ.": "Cấy máu khi nặng hoặc nước tiểu mọc S. aureus. Siêu âm; CT/MRI khi ứ nước, tắc nghẽn hoặc không cải thiện sau 48–72 giờ.",
  "Beta-lactam/ức chế beta-lactamase mới, cefiderocol, plazomicin, fosfomycin tĩnh mạch: dành cho vi khuẩn kháng thuốc cao.": "Beta-lactam/ức chế beta-lactamase mới, cefiderocol, plazomicin, fosfomycin TM: chỉ cho vi khuẩn kháng thuốc cao.",
  /* SIS 2024, WSES 2021 – ổ bụng */
  "Meropenem 1 g TM mỗi 8 giờ, hoặc imipenem/cilastatin 500 mg TM mỗi 6 giờ, hoặc doripenem 500 mg TM mỗi 8 giờ": "Meropenem 1 g mỗi 8 giờ, imipenem/cilastatin 500 mg mỗi 6 giờ hoặc doripenem 500 mg mỗi 8 giờ (TM)",
  "Tránh phần lớn phác đồ nền cephalosporin, aztreonam hoặc fluoroquinolon; dùng ertapenem": "Dùng ertapenem; tránh nền cephalosporin, aztreonam, fluoroquinolon",
  /* ACE 2026 – nhọt, áp xe da */
  "Đánh giá từng ca. Nhẹ: kiểm soát ổ nhiễm ít xâm lấn (lấy dị vật, rửa bằng dung dịch sát khuẩn). Tổn thương lớn: rạch dẫn lưu hoặc can thiệp ngoại khoa khác": "Nhẹ: kiểm soát ổ ít xâm lấn; tổn thương lớn: rạch dẫn lưu",
  "Áp xe da không biến chứng: rạch dẫn lưu thường là đủ; nhiễm khuẩn nặng: có thể cần cắt lọc ngoại khoa": "Không biến chứng: rạch dẫn lưu thường đủ; nặng: cắt lọc",
  "Không can thiệp ngoại khoa được (nhọt mạn tính, nhiều áp xe ở người suy giảm miễn dịch, áp xe giai đoạn sớm, trẻ em): kháng sinh có thể có lợi kể cả khi nhẹ": "Không can thiệp được (nhọt mạn, nhiều áp xe khi suy giảm miễn dịch, áp xe sớm, trẻ em): kháng sinh có thể có lợi",
  /* WHO 2025/2026 – viêm màng não */
  "Dexamethason. Ngừng nếu dịch não tủy không phù hợp viêm màng não vi khuẩn hoặc tác nhân không phải S. pneumoniae, H. influenzae typ b. Không dùng ở người HIV giai đoạn tiến triển; chưa dùng khi chưa loại trừ sốt rét thể não.": "Dexamethason – ngừng nếu không phải viêm màng não do phế cầu/Hib; không dùng khi HIV tiến triển hoặc chưa loại trừ sốt rét thể não.",
  "Ceftriaxon – ưu tiên khi có dịch não mô cầu, phế cầu. Điều trị nội trú: chia mỗi 12 giờ.": "Ceftriaxon – ưu tiên khi có dịch não mô cầu, phế cầu.",
};
const DOSE: Record<string, string> = {
  "15 mg/kg mỗi 8–12 giờ, đích nồng độ đáy 15–20 mg/L; bệnh nặng: cân nhắc liều nạp 25–30 mg/kg": "15 mg/kg mỗi 8–12 giờ (đáy 15–20 mg/L); nặng: nạp 25–30 mg/kg",
  "200 mg × 2 lần/ngày, 5 ngày. Không dùng trong 3 tháng đầu; chỉ khi E. coli kháng tại chỗ < 20%": "200 mg × 2 lần/ngày, 5 ngày (tránh 3 tháng đầu thai kỳ; E. coli kháng tại chỗ < 20%)",
  "160/800 mg × 2 lần/ngày, 3 ngày. Không dùng trong 3 tháng cuối; chỉ khi E. coli kháng tại chỗ < 20%": "160/800 mg × 2 lần/ngày, 3 ngày (tránh 3 tháng cuối thai kỳ; E. coli kháng tại chỗ < 20%)",
  "Tỷ lệ kháng tại chỗ < 10%, và có chống chỉ định cephalosporin thế hệ 3 hoặc aminoglycosid, hoặc dị ứng beta-lactam": "Kháng tại chỗ < 10% và chống chỉ định cephalosporin thế hệ 3/aminoglycosid hoặc dị ứng beta-lactam",
  "Vancomycin 30 mg/kg/ngày tĩnh mạch, chia 2 lần + piperacilin-tazobactam 3,375 g tĩnh mạch mỗi 6 giờ hoặc 4,5 g tĩnh mạch mỗi 8 giờ": "Vancomycin 30 mg/kg/ngày TM chia 2 lần + piperacilin-tazobactam 3,375 g mỗi 6 giờ hoặc 4,5 g mỗi 8 giờ",
  "Vancomycin 30 mg/kg/ngày tĩnh mạch, chia 2 lần + imipenem-cilastatin 1 g tĩnh mạch mỗi 6–8 giờ (tối đa 4 g/ngày)": "Vancomycin 30 mg/kg/ngày TM chia 2 lần + imipenem-cilastatin 1 g mỗi 6–8 giờ (tối đa 4 g/ngày)",
};

export const compactText = (t: string) => TEXT[t] ?? t;
export const compactDose = (d: string) => DOSE[d] ?? d;
/** Cho test: các cặp liều gốc → liều gọn (số liệu phải giữ nguyên). */
export const DOSE_PAIRS = Object.entries(DOSE);
const block = (b: StratIntl): StratIntl => ({
  ...b,
  items: b.items.map((i) => ({ ...i, text: compactText(i.text), ...(i.dose ? { dose: compactDose(i.dose) } : {}) })),
});
/** Áp bảng rút gọn cho các thẻ thuốc (cột và mục thu gọn) của một khung phân tầng. */
export const compactStrat = (s: Stratification): Stratification => ({
  ...s,
  columns: s.columns.map((c) => ({ ...c, intl: c.intl.map(block) })),
  ...(s.extras ? { extras: s.extras.map((e) => ({ ...e, blocks: e.blocks.map(block) })) } : {}),
});
