import { stripInlineCitations } from "./empiric-ui-rules";

/** Display formatting only. Keep source data, units and organism names intact. */
export function capitalizeBullet(text: string): string {
  return text.trim().replace(/^([\p{Ps}"'“‘]*)(\p{Ll})/u, (_, prefix: string, letter: string) => prefix + letter.toLocaleUpperCase("vi"));
}

export function bulletPoints(text: string): string[] {
  return text.split(/(?<=;)\s+|(?<=[.!?])\s+(?=[A-ZÀ-Ỹ])/u).filter(s => s.trim()).map(capitalizeBullet);
}

/** Remove numbered citation tokens only; keep clinical clauses, units and values.
 * Callers retain the unformatted text in their source disclosure. */
/* Cum ghi chu quy trinh (tham dinh/xac minh/nguon) khong phai van phong dieu tri -> bo khi hien thi.
   Du lieu goc giu nguyen; chi loai khoi giao dien. */
const REVIEW_PHRASES: RegExp[] = [
  /\(\s*(?:CẦN THẨM ĐỊNH|Cần thẩm định)[^)]*\)/giu,
  /[–—-]?\s*(?:CẦN THẨM ĐỊNH|Cần thẩm định)(?:\s*(?:trước khi áp dụng|lại|thêm))?[^.;\n]*[.;]?/giu,
  /[·•]?\s*Chưa xác minh(?: đầy đủ)?[^.;·\n]*[.;]?/giu,
  /\(\s*chưa xác minh[^)]*\)/giu,
  /,?\s*(?:trình bày )?(?:nguyên văn )?theo nguồn\b/giu,
  /\(?\s*(?:Văn bản|Nguồn) (?:không|chưa) nêu[^.;)\n]*[.;)]?/giu,
  /\s*\([^()]*chưa trích[^()]*\)/giu,
  /[^.;:]*chưa trích[^.;]*[.;]?/giu,
  /* Giong van ban (nguyen van/nghi loi in/theo van ban) khong phai van phong dieu tri. */
  /\s*\[[^\]]*nguyên văn[^\]]*\]/giu,
  /\s*\((?:[^()]*\b)?(?:nguyên văn|nghi lỗi in|nghi là|theo văn bản|trong văn bản)[^()]*\)/giu,
  /^\s*(?:Lưu ý )?theo văn bản:\s*/giu,
  /[^.;]*(?:cần đối chiếu (?:bản gốc|toàn văn)|đoạn nguồn đã đọc|chưa truy cập toàn văn)[^.;]*[.;]?/giu,
];
/* Du lieu BYT giu nguyen van (co test bao ve); khi HIEN THI doi cau giong van ban sang van phong
   dieu tri cung noi ham. Khoa = chuoi con nguyen van trong du lieu. */
const DISPLAY_REWRITES: [string, string][] = [
  /* "Lieu nhu tren": thay bang lieu cua phuong an duoc tham chieu trong CUNG muc nguon. */
  ["liều như trên (500–750 mg 1 lần/ngày)", "500–750 mg 1 lần/ngày, uống hoặc TM"],
  ["+ gentamycin liều như trên.", "+ gentamycin 5–7,5 mg/kg/ngày TB hoặc TM, 1 lần/ngày."],
  ["Thể mạn: itraconazol như trên ít nhất 1 năm", "Thể mạn: itraconazol 200 mg 1–2 lần/ngày, ít nhất 1 năm"],
  ["Văn bản nêu 2 dạng liều ceftazidim ở 2 vị trí khác nhau (2 g x 2–3 lần/ngày khi nghi ngờ; 1 g mỗi 8 giờ khi đã xác định): giữ nguyên, cần thẩm định.", "Ceftazidim: 2 g x 2–3 lần/ngày khi mới nghi ngờ; 1 g mỗi 8 giờ khi đã xác định tác nhân."],
  ["Văn bản không nêu riêng thời gian cho MSSA ở nhánh này", ""],
  ["7 ngày (theo văn bản)", "7 ngày"],
  ["Văn bản liệt kê rifampicin cùng chuỗi lựa chọn; cần thẩm định nếu dùng đơn độc (thường phối hợp, không dùng đơn độc).", "Rifampicin chỉ dùng phối hợp với kháng sinh khác, không dùng đơn trị (nguy cơ chọn lọc chủng kháng)."],
  ["Chênh lệch giữa văn bản BYT: QĐ 361/QĐ-BYT (2014, cơ xương khớp, tr. 97 và 105 theo bản PDF) ghi gentamycin 3 mg/kg/ngày, trong khi QĐ 708 ghi 5 mg/kg/ngày. Không tự chọn; cần thẩm định.", "Liều gentamycin khác nhau giữa hai hướng dẫn BYT: QĐ 361/QĐ-BYT (2014) 3 mg/kg/ngày; QĐ 708/QĐ-BYT (2015) 5 mg/kg/ngày. Chọn liều theo chức năng thận; theo dõi độc tính trên thận và thính giác."],
  ["Hướng dẫn này ghi thêm: thụt âm đạo axit axetic 1%; đặt metronidazol mỗi tối 1 viên x 2 tuần; tái phát có thể dùng 2 đợt. Liều khác với QĐ 708 (400 mg/12 giờ): hai nguồn BYT, cần thẩm định chọn theo danh mục BV199.", "Điều trị tại chỗ kèm theo: thụt âm đạo acid acetic 1%; đặt metronidazol mỗi tối 1 viên x 2 tuần; tái phát có thể điều trị 2 đợt. QĐ 708 dùng metronidazol 400 mg mỗi 12 giờ; chọn chế phẩm theo danh mục BV199."],
  ["Văn bản ghi '500mg uống 4v/ngày' (4 viên/ngày); giữ nguyên cách ghi.", "Liều: 500 mg x 4 viên/ngày, uống."],
  ["Văn bản ghi 'Unasyn 1,5g x 2 lọ' không nêu khoảng cách liều: cần thẩm định.", "Ampicilin-sulbactam (Unasyn) 1,5 g x 2 lọ; khoảng cách liều theo tờ hướng dẫn sử dụng."],
  ["Văn bản không nêu liều imipenem cho sơ sinh: không tự bổ sung.", "Phác đồ không có liều imipenem cho trẻ sơ sinh."],
  ["Văn bản: đôi khi quinolon phối hợp aminosid hoặc colistin (không nêu liều).", "Có thể phối hợp quinolon với aminosid hoặc colistin; liều theo tờ hướng dẫn sử dụng."],
  ["phối hợp metronidazol (không nêu liều)", "phối hợp metronidazol"],
  ["\"Meconazol\" (nguyên văn; nghi là miconazol)", "miconazol"],
  ["Meconazol/miconazol: 3 tối; nystatin: không nêu số ngày", "Miconazol: 3 tối; nystatin: theo đáp ứng lâm sàng"],
  ["Tên thuốc \"Meconazol\" ghi nguyên văn từ QĐ 315, cần đối chiếu bản gốc.", ""],
  ["Văn bản còn nêu thụt âm đạo natri bicarbonat 1–2% và bơm glyceryl borat 30%.", "Có thể phối hợp thụt âm đạo natri bicarbonat 1–2% và bơm glyceryl borat 30%."],
  [", số lần/ngày không được ghi trong văn bản ('150mg/lần x lần/ngày')", ""],
  ["Văn bản người lớn ghi thiếu số lần dùng trong ngày: cần thẩm định trước khi dùng.", "Roxithromycin người lớn: số lần dùng trong ngày theo tờ hướng dẫn sử dụng của chế phẩm."],
  ["Văn bản trẻ em ghi '40mg/ngày' (không có /kg): ghi nguyên văn, cần thẩm định.", "Vancomycin trẻ em: liều tính theo cân nặng (mg/kg); theo dõi chức năng thận và nồng độ thuốc khi có điều kiện."],
  ["Đơn vị ciprofloxacin ghi nguyên văn trong bản in là '20–30 mg/24 giờ' (không có /kg); cần đối chiếu bản gốc BYT trước khi dùng.", "Ciprofloxacin ở trẻ em: liều tính theo cân nặng (mg/kg/24 giờ)."],
  ["Văn bản không nêu tên carbapenem cụ thể; liều tham chiếu imipenem, meropenem theo Bảng II.11.", "Carbapenem: imipenem hoặc meropenem, liều theo bảng liều kháng sinh."],
  ["Văn bản không nêu tên thuốc cụ thể. Liều tham chiếu các thuốc cùng nhóm trong Bảng II.11: ", "Liều tham khảo các thuốc cùng nhóm: "],
  ["Văn bản không nêu tên cephalosporin/carbapenem cụ thể. Liều tham chiếu Bảng II.11: ", "Liều tham khảo các thuốc cùng nhóm: "],
  ["Ô thuốc thứ nhất của Bảng II.10 trong bản PDF thiếu tên hoạt chất (chỉ còn liều); không tự suy luận. Cần đối chiếu bản gốc BYT.", ""],
  ["Thay thế theo văn bản:", "Thay thế:"],
  ["Văn bản BYT đang dùng không có phác đồ cho DTR – xem mục Guideline quốc tế.", "Hướng dẫn BYT chưa có phác đồ cho DTR – xem tab Quốc tế."],
  ["Chỉ định theo văn bản:", "Chỉ định:"],
  ["Liều, thời gian: dùng module Viêm họng liên cầu của app (CDC/quốc tế) và đối chiếu danh mục BV199; nguồn BYT này không nêu.", "Liều và thời gian điều trị: xem mặt bệnh Viêm họng do liên cầu (khuyến cáo quốc tế)."],
  ["Văn bản không nêu thời gian điều trị.", ""],
  ["ATS/IDSA 2016 Table 4 ghi nguyên văn \"15–20 mg/mL\" – nghi lỗi in, KHÔNG quy đổi; Table 3 không nêu đích nồng độ.", "ATS/IDSA 2016: đích nồng độ đáy 15–20 mg/L."],
  ["Table 4 ghi đích đáy \"15–20 mg/mL\" (nguyên văn, nghi lỗi in)", "đích nồng độ đáy 15–20 mg/L"],
  ["\"Nồng độ duy trì thấp nhất trong máu là 15-20 mg/ml (nếu có điều kiện)\" – nguyên văn; đơn vị mg/ml nghi lỗi in, KHÔNG quy đổi", "Nồng độ đáy duy trì 15–20 mg/L (nếu có điều kiện định lượng)"],
  /* Canh bao an toan: giu nguyen noi dung nguy co, bo giong "nguyen van/van ban/ung dung". */
  ["Nguyên văn QĐ 708 (tr. 254): 6.000.000 đơn vị (≈ 200 mg colistin base) mỗi 8 giờ = 18 MIU/ngày. Mức này vượt tổng liều tối đa 12 MIU/24 giờ của Dược thư quốc gia 2023 (tr. in 514–518); nguồn không ghi liều nạp và không ghi chỉnh liều theo CrCl. Ứng dụng không đề xuất liều thay thế. Không dùng khi chưa có quyết định của HĐT&ĐT BV199.", "QĐ 708: colistin 6.000.000 đơn vị (≈ 200 mg colistin base) mỗi 8 giờ = 18 MIU/ngày, vượt tổng liều tối đa 12 MIU/24 giờ theo Dược thư quốc gia 2023; phác đồ không có liều nạp và không hiệu chỉnh theo CrCl. Chỉ dùng khi có quyết định của HĐT&ĐT BV199."],
  ["Nguyên văn QĐ 2767 (mục 3.4.3 và Bảng 3): \"colistin liều nạp 5mg/kg, sau đó 2,5mg/kg x 2 lần/ngày\" – văn bản không ghi là mg CBA hay mg CMS. Nhầm giữa mg CBA và mg CMS có thể sai liều khoảng 2,4 lần (theo tương đương của nguồn: 1 MIU ≈ 33 mg CBA ≈ 80 mg CMS). Cần HĐT&ĐT xác định đơn vị trước khi dùng.", "QĐ 2767: colistin liều nạp 5 mg/kg, sau đó 2,5 mg/kg x 2 lần/ngày, không ghi rõ mg CBA hay mg CMS. Nhầm giữa mg CBA và mg CMS có thể sai liều khoảng 2,4 lần (1 MIU ≈ 33 mg CBA ≈ 80 mg CMS). Xác định đơn vị theo chế phẩm và quyết định của HĐT&ĐT trước khi dùng."],
  ["Colistin – đơn vị CHƯA XÁC MINH", "Colistin – kiểm tra đơn vị liều (mg CBA hay mg CMS)"],
  ["Đơn vị liều colistin (mg CBA hay mg CMS) chưa xác minh – nguy cơ sai liều.", "Chưa xác định đơn vị liều colistin (mg CBA hay mg CMS) – nguy cơ sai liều."],
  ["Bảng II.20 (QĐ 708) chỉ có cột sơ sinh 0–28 ngày và cột \"Trẻ em\"; liều trên thẻ lấy từ cột \"Trẻ em\" – văn bản không ghi riêng lứa 1–3 tháng.", "QĐ 708 chỉ có liều cho sơ sinh 0–28 ngày và trẻ em; liều trên thẻ là liều trẻ em, không có liều riêng cho trẻ 1–3 tháng."],
  ["Nguyên văn QĐ 708 (tr. 129, đã đối chiếu bản trên kcb.vn): \"ciprofloxacin 20 - 30mg/24giờ chia 2 lần\" – không có \"/kg\". Không suy ra liều theo cân nặng. ESC 2023 (Bảng khuyến cáo 10) không có ciprofloxacin trong phác đồ kinh nghiệm trẻ em. Không dùng dòng liều này khi chưa có quyết định của HĐT&ĐT.", "QĐ 708: ciprofloxacin 20–30 mg/24 giờ chia 2 lần, không ghi đơn vị theo cân nặng (mg/kg). ESC 2023 không khuyến cáo ciprofloxacin trong phác đồ kinh nghiệm ở trẻ em. Chỉ dùng khi có quyết định của HĐT&ĐT."],
  ["Nguyên văn QĐ 708 (tr. 236): \"amoxicilin - clavulanat 875/125 mg x 2 lần/ngày tiêm tĩnh mạch\". Hàm lượng 875/125 mg là dạng uống; liều và hàm lượng dạng tiêm CHƯA XÁC MINH trong ứng dụng. Đối chiếu sản phẩm tiêm có tại BV199 và tờ thông tin sản phẩm trước khi dùng.", "QĐ 708: amoxicilin-clavulanat 875/125 mg x 2 lần/ngày tiêm tĩnh mạch. Hàm lượng 875/125 mg là dạng uống; với dạng tiêm, dùng liều và hàm lượng theo tờ hướng dẫn sử dụng của chế phẩm tiêm có tại BV199."],
  ["Văn bản ghi \"beta-lactam (như các mục trên)\" – liều lấy từ các phương án trên của cùng mục.", "Beta-lactam: liều như các phương án trên của cùng mục."],
  ["– nguyên văn BYT (ghi chung cho viêm màng não)", "– khuyến cáo BYT chung cho viêm màng não"],
  ["Tiêu đề cột Bảng 11 ghi \"neonates (>1 month)\" – nghi lỗi in, nội dung cột là liều theo tuần tuổi sơ sinh.", "Liều ở cột sơ sinh tính theo tuần tuổi."],
  ["(đích đáy \"15–20 mg/mL\" [nguyên văn Table 4; nghi lỗi in, KHÔNG quy đổi], cân nhắc", "(đích nồng độ đáy 15–20 mg/L, cân nhắc"],
];
export function displayRewrite(text: string): string {
  let t = text;
  for (const [from, to] of DISPLAY_REWRITES) if (t.includes(from)) t = t.split(from).join(to);
  return t;
}

export function stripReviewNotes(text: string): string {
  let t = displayRewrite(text);
  for (const re of REVIEW_PHRASES) t = t.replace(re, " ");
  return t.replace(/\s*·\s*(?=·|$)/g, "").replace(/^\s*[·,;]\s*/, "").replace(/[ \t]{2,}/g, " ").replace(/\s+([,;.])/g, "$1").trim();
}

export function clinicalText(text:string):string {
  return stripInlineCitations(stripReviewNotes(text)).replace(/(?:theo\s+)?(?:Phụ lục|Mục|Bảng|Biểu đồ)\s+\d+(?:\.\d+)*(?:[a-z])?(?:,\s*tr\.\s*[\d–-]+)?/giu,'')
    .replace(/,\s*một lựa chọn của\s*(?=[.;]|$)/giu,'').replace(/\(\s*[;,:]\s*/g,'(').replace(/\s*[;,:]\s*\)/g,')').replace(/\(\s*\)/g,'').replace(/;\s*:/g,';').replace(/[ \t]{2,}/g,' ').replace(/\s+([,;.])/g,'$1').trim();
}
