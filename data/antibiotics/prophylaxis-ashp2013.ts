// Clinical Practice Guidelines for Antimicrobial Prophylaxis in Surgery – ASHP/IDSA/SIS/SHEA 2013
// Bratzler DW, Dellinger EP, Olsen KM, et al. Am J Health-Syst Pharm. 2013;70:195–283.
// Bản ASHP Therapeutic Guidelines tr. 734–819 (số trang in; trang PDF = trang in − 733).
// Chỉ dịch, không thêm nội dung. Chữ cái là chú thích của Bảng 1/Bảng 2.

export const ASHP_URL =
  "https://www.ashp.org/-/media/assets/policy-guidelines/docs/therapeutic-guidelines/therapeutic-guidelines-antimicrobial-prophylaxis-surgery.pdf";
export const ashpPage = (printed: number) => `${ASHP_URL}#page=${printed - 733}`;

export type AshpDose = {
  drug: string;
  adult: string;
  peds: string;
  halfLife: string;
  /** Khoảng nhắc liều (tính từ lúc bắt đầu liều trước mổ), giờ */
  redose: string;
  fn?: string[];
  oral?: boolean;
};

// Bảng 1, tr. 736
export const ASHP_DOSES: AshpDose[] = [
  { drug: "Ampicillin–sulbactam", adult: "3 g (ampicillin 2 g/sulbactam 1 g)", peds: "50 mg/kg (tính theo ampicillin)", halfLife: "0,8–1,3", redose: "2" },
  { drug: "Ampicillin", adult: "2 g", peds: "50 mg/kg", halfLife: "1–1,9", redose: "2" },
  { drug: "Aztreonam", adult: "2 g", peds: "30 mg/kg", halfLife: "1,3–2,4", redose: "4" },
  { drug: "Cefazolin", adult: "2 g; 3 g nếu cân nặng ≥ 120 kg", peds: "30 mg/kg", halfLife: "1,2–2,2", redose: "4" },
  { drug: "Cefuroxime", adult: "1,5 g", peds: "50 mg/kg", halfLife: "1–2", redose: "4" },
  { drug: "Cefotaxime", adult: "1 g", fn: ["d"], peds: "50 mg/kg", halfLife: "0,9–1,7", redose: "3" },
  { drug: "Cefoxitin", adult: "2 g", peds: "40 mg/kg", halfLife: "0,7–1,1", redose: "2" },
  { drug: "Cefotetan", adult: "2 g", peds: "40 mg/kg", halfLife: "2,8–4,6", redose: "6" },
  { drug: "Ceftriaxone", adult: "2 g", fn: ["e"], peds: "50–75 mg/kg", halfLife: "5,4–10,9", redose: "Không áp dụng" },
  { drug: "Ciprofloxacin", adult: "400 mg", fn: ["f"], peds: "10 mg/kg", halfLife: "3–7", redose: "Không áp dụng" },
  { drug: "Clindamycin", adult: "900 mg", peds: "10 mg/kg", halfLife: "2–4", redose: "6" },
  { drug: "Ertapenem", adult: "1 g", peds: "15 mg/kg", halfLife: "3–5", redose: "Không áp dụng" },
  { drug: "Fluconazole", adult: "400 mg", peds: "6 mg/kg", halfLife: "30", redose: "Không áp dụng" },
  { drug: "Gentamicin", adult: "5 mg/kg theo cân nặng tính liều (liều duy nhất)", fn: ["g"], peds: "2,5 mg/kg theo cân nặng tính liều", halfLife: "2–3", redose: "Không áp dụng" },
  { drug: "Levofloxacin", adult: "500 mg", fn: ["f"], peds: "10 mg/kg", halfLife: "6–8", redose: "Không áp dụng" },
  { drug: "Metronidazole", adult: "500 mg", peds: "15 mg/kg; trẻ sơ sinh < 1200 g: liều duy nhất 7,5 mg/kg", halfLife: "6–8", redose: "Không áp dụng" },
  { drug: "Moxifloxacin", adult: "400 mg", fn: ["f"], peds: "10 mg/kg", halfLife: "8–15", redose: "Không áp dụng" },
  { drug: "Piperacillin–tazobactam", adult: "3,375 g", peds: "Trẻ 2–9 tháng: 80 mg/kg (tính theo piperacillin); trẻ > 9 tháng và ≤ 40 kg: 100 mg/kg (tính theo piperacillin)", halfLife: "0,7–1,2", redose: "2" },
  { drug: "Vancomycin", adult: "15 mg/kg", peds: "15 mg/kg", halfLife: "4–8", redose: "Không áp dụng" },
  // Kháng sinh uống dự phòng phẫu thuật đại trực tràng (dùng cùng chuẩn bị ruột cơ học)
  { drug: "Erythromycin base (uống)", adult: "1 g", peds: "20 mg/kg", halfLife: "0,8–3", redose: "Không áp dụng", oral: true },
  { drug: "Metronidazole (uống)", adult: "1 g", peds: "15 mg/kg", halfLife: "6–10", redose: "Không áp dụng", oral: true },
  { drug: "Neomycin (uống)", adult: "1 g", peds: "15 mg/kg", halfLife: "2–3 (hấp thu 3% khi đường tiêu hóa bình thường)", redose: "Không áp dụng", oral: true },
];

// Chú thích Bảng 1, tr. 736
export const ASHP_DOSE_FOOTNOTES: Record<string, string> = {
  a: "Liều người lớn lấy từ các nghiên cứu được trích dẫn ở từng mục. Khi liều khác nhau giữa các nghiên cứu, nhóm chuyên gia chọn liều được khuyến cáo nhiều nhất.",
  b: "Liều tối đa ở trẻ em không vượt quá liều thường dùng ở người lớn.",
  c: "Với kháng sinh có thời gian bán thải ngắn (vd. cefazolin, cefoxitin) dùng trước các phẫu thuật kéo dài, khuyến cáo nhắc liều trong phòng mổ với khoảng cách xấp xỉ 2 lần thời gian bán thải ở người có chức năng thận bình thường. Các khoảng nhắc liều ghi \"Không áp dụng\" dựa trên thời gian mổ thông thường; với ca mổ kéo dài bất thường có thể cần nhắc liều.",
  d: "Tờ hướng dẫn được FDA phê duyệt ghi 1 g; chuyên gia khuyến cáo 2 g cho người béo phì.",
  e: "Khi dùng liều duy nhất phối hợp metronidazole cho phẫu thuật đại trực tràng.",
  f: "Fluoroquinolon liên quan tăng nguy cơ viêm/đứt gân ở mọi lứa tuổi; dùng liều duy nhất để dự phòng nhìn chung an toàn.",
  g: "Nhìn chung, gentamicin dự phòng phẫu thuật nên giới hạn ở một liều duy nhất trước mổ. Liều tính theo cân nặng thực. Nếu cân nặng thực vượt cân nặng lý tưởng (IBW) > 20%, cân nặng tính liều (DW) = IBW + 0,4 × (cân nặng thực − IBW).",
};

export type AshpRegimen = {
  id: string;
  group: string;
  name: string;
  nameFn?: string[];
  /** Thuốc khuyến cáo (cột Recommended Agents, chú thích a,b áp dụng chung) */
  primary: string;
  /** Thuốc thay thế khi dị ứng beta-lactam */
  alternative: string;
  /** Mức bằng chứng ủng hộ dùng/không dùng dự phòng */
  evidence: string;
  none?: boolean;
  page: number;
  /** Khuyến cáo ở phần nội dung từng loại phẫu thuật, kèm trang */
  notes?: { text: string; page: number }[];
};

const AG = "aminoglycosid (g)";
const MET = "Metronidazole + " + AG + " hoặc fluoroquinolon (h, i, j)";
const GN = { text: "Nếu số liệu giám sát cho thấy vi khuẩn Gram âm gây NKVM cho loại phẫu thuật này, có thể phối hợp clindamycin hoặc vancomycin với một thuốc khác (cefazolin nếu không dị ứng beta-lactam; aztreonam, gentamicin hoặc fluoroquinolon liều duy nhất nếu dị ứng beta-lactam).", page: 771 };
const MUP = (page: number) => ({ text: "Mupirocin nhỏ mũi cho mọi người bệnh có ghi nhận mang S. aureus.", page });
const MRSA_V = (page: number) => ({ text: "Dùng vancomycin dự phòng cho người bệnh đã biết mang MRSA.", page });

// Bảng 2, tr. 737–740 – đủ mọi dòng, đúng thứ tự
export const ASHP_REGIMENS: AshpRegimen[] = [
  { id: "ca1", group: "Tim", name: "Bắc cầu động mạch vành", primary: "Cefazolin, cefuroxime", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A", page: 737,
    notes: [
      { text: "Một liều duy nhất trước rạch da, nhắc liều trong mổ phù hợp. Không có bằng chứng ủng hộ duy trì dự phòng đến khi rút hết ống dẫn lưu, catheter.", page: 749 },
      { text: "Thời gian dự phòng hiện được chấp nhận cho phẫu thuật tim là < 24 giờ, nhưng cần duy trì trong suốt cuộc mổ.", page: 749 },
      MRSA_V(749),
      { text: "Nếu giám sát NKVM cho thấy vi khuẩn Gram âm, phối hợp clindamycin hoặc vancomycin với thuốc khác (cefazolin nếu không dị ứng beta-lactam; aztreonam, aminoglycosid hoặc fluoroquinolon liều duy nhất nếu dị ứng beta-lactam).", page: 749 },
      MUP(749),
    ] },
  { id: "ca2", group: "Tim", name: "Đặt thiết bị tim (vd. máy tạo nhịp)", primary: "Cefazolin, cefuroxime", alternative: "Clindamycin, vancomycin", evidence: "A", page: 737,
    notes: [
      { text: "Một liều duy nhất cefazolin hoặc cefuroxime khi cấy thiết bị hoặc thay máy phát của máy tạo nhịp vĩnh viễn, máy khử rung cấy (ICD) hoặc thiết bị tái đồng bộ tim.", page: 750 },
      { text: "Không khuyến cáo dự phòng thường quy cho thông tim hoặc siêu âm tim qua thực quản.", page: 749 },
      { text: "Cân nhắc vancomycin cho người bệnh đã biết mang MRSA.", page: 750 },
    ] },
  { id: "ca3", group: "Tim", name: "Dụng cụ hỗ trợ thất (VAD)", primary: "Cefazolin, cefuroxime", alternative: "Clindamycin, vancomycin", evidence: "C", page: 737,
    notes: [
      { text: "Bằng chứng còn hạn chế; mỗi cơ sở xây dựng quy trình theo tỷ lệ tác nhân và độ nhạy tại chỗ.", page: 750 },
      { text: "Dự phòng khi thay VAD do nhiễm khuẩn đang có hoặc mới đây cần bao phủ tác nhân gây nhiễm.", page: 750 },
    ] },

  { id: "th1", group: "Lồng ngực", name: "Phẫu thuật ngoài tim, gồm cắt thùy phổi, cắt phổi, cắt một phần phổi, mở ngực", primary: "Cefazolin, ampicillin–sulbactam", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A", page: 737,
    notes: [
      { text: "Một liều duy nhất cefazolin hoặc ampicillin–sulbactam. Dùng vancomycin cho người bệnh đã biết mang MRSA.", page: 751 },
      { text: "Không khuyến cáo dự phòng thường quy khi đặt ống dẫn lưu màng phổi.", page: 750 },
    ] },
  { id: "th2", group: "Lồng ngực", name: "Phẫu thuật nội soi lồng ngực hỗ trợ video (VATS)", primary: "Cefazolin, ampicillin–sulbactam", alternative: "Clindamycin (d), vancomycin (d)", evidence: "C", page: 737 },

  { id: "gd1", group: "Dạ dày – tá tràng", nameFn: ["e"], name: "Phẫu thuật vào lòng ống tiêu hóa (phẫu thuật giảm béo, cắt khối tá tụy)", primary: "Cefazolin", alternative: "Clindamycin hoặc vancomycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j)", evidence: "A", page: 737,
    notes: [
      { text: "Cắt khối tá tụy: cân nhắc bao phủ thêm khi đường mật nhiễm khuẩn (chú thích f).", page: 740 },
      { text: "Liều cao hơn được khuyến cáo thống nhất ở người béo phì bệnh lý phẫu thuật giảm béo; cân nhắc liều cao hơn ở người thừa cân đáng kể phẫu thuật dạ dày – tá tràng và nội soi.", page: 752 },
    ] },
  { id: "gd2", group: "Dạ dày – tá tràng", name: "Phẫu thuật không vào lòng ống tiêu hóa (chống trào ngược, cắt thần kinh X chọn lọc cao) ở người bệnh nguy cơ cao", primary: "Cefazolin", alternative: "Clindamycin hoặc vancomycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j)", evidence: "A", page: 737,
    notes: [{ text: "Yếu tố nguy cơ: tăng pH dạ dày (vd. đang dùng thuốc ức chế tiết acid), thủng dạ dày – tá tràng, giảm nhu động dạ dày, tắc môn vị, chảy máu dạ dày, béo phì bệnh lý, ASA ≥ 3, ung thư.", page: 752 }] },

  { id: "bi1", group: "Đường mật", name: "Phẫu thuật mở", primary: "Cefazolin, cefoxitin, cefotetan, ceftriaxone (k), ampicillin–sulbactam (h)", alternative: "Clindamycin hoặc vancomycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j); HOẶC " + MET, evidence: "A", page: 737,
    notes: [{ text: "Khuyến cáo một liều duy nhất cefazolin.", page: 754 }] },
  { id: "bi2", group: "Đường mật", name: "Phẫu thuật nội soi, chương trình, nguy cơ thấp", nameFn: ["l"], primary: "Không dự phòng", alternative: "Không dự phòng", none: true, evidence: "A", page: 737 },
  { id: "bi3", group: "Đường mật", name: "Phẫu thuật nội soi, chương trình, nguy cơ cao", nameFn: ["l"], primary: "Cefazolin, cefoxitin, cefotetan, ceftriaxone (k), ampicillin–sulbactam (h)", alternative: "Clindamycin hoặc vancomycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j); HOẶC " + MET, evidence: "A", page: 737,
    notes: [{ text: "Vì một số yếu tố nguy cơ không xác định được trước mổ, có thể hợp lý khi dùng một liều duy nhất cho mọi người bệnh cắt túi mật nội soi.", page: 754 }] },
  { id: "ap1", group: "Ruột thừa", name: "Cắt ruột thừa trong viêm ruột thừa không biến chứng", primary: "Cefoxitin, cefotetan, cefazolin + metronidazole", alternative: "Clindamycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j); HOẶC " + MET, evidence: "A", page: 737,
    notes: [
      { text: "Một liều duy nhất.", page: 756 },
      { text: "Viêm ruột thừa có biến chứng (thủng, hoại tử, viêm phúc mạc, áp xe) được điều trị như nhiễm khuẩn ổ bụng có biến chứng, không thuộc phạm vi hướng dẫn dự phòng.", page: 754 },
    ] },
  { id: "si1", group: "Ruột non", name: "Không tắc ruột", primary: "Cefazolin", alternative: "Clindamycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j)", evidence: "C", page: 737 },
  { id: "si2", group: "Ruột non", name: "Tắc ruột", primary: "Cefazolin + metronidazole, cefoxitin, cefotetan", alternative: MET, evidence: "C", page: 737 },
  { id: "he1", group: "Thoát vị", name: "Phục hồi thoát vị (tạo hình bằng lưới và khâu phục hồi)", primary: "Cefazolin", alternative: "Clindamycin, vancomycin", evidence: "A", page: 737,
    notes: [{ text: "Một liều duy nhất. Với người bệnh đã biết mang MRSA, có thể thêm một liều vancomycin trước mổ.", page: 757 }] },
  { id: "co1", group: "Đại trực tràng", nameFn: ["m"], name: "Phẫu thuật đại trực tràng", primary: "Cefazolin + metronidazole, cefoxitin, cefotetan, ampicillin–sulbactam (h), ceftriaxone + metronidazole (n), ertapenem", alternative: "Clindamycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j); HOẶC " + MET, evidence: "A", page: 738,
    notes: [
      { text: "Kháng sinh uống (neomycin + erythromycin base hoặc neomycin + metronidazole) chia 3 liều trong khoảng 10 giờ vào chiều và tối trước ngày mổ, sau chuẩn bị ruột cơ học.", page: 760 },
      { text: "Không khuyến cáo metronidazole + aztreonam vì phối hợp này không có tác dụng trên vi khuẩn Gram dương hiếu khí.", page: 760 },
    ] },

  { id: "hn1", group: "Đầu và cổ", name: "Phẫu thuật sạch", primary: "Không dự phòng", alternative: "Không dự phòng", none: true, evidence: "B", page: 738 },
  { id: "hn2", group: "Đầu và cổ", name: "Phẫu thuật sạch có đặt bộ phận giả (trừ ống thông khí màng nhĩ)", primary: "Cefazolin, cefuroxime", alternative: "Clindamycin (d)", evidence: "C", page: 738 },
  { id: "hn3", group: "Đầu và cổ", name: "Phẫu thuật ung thư sạch – nhiễm", primary: "Cefazolin + metronidazole, cefuroxime + metronidazole, ampicillin–sulbactam", alternative: "Clindamycin (d)", evidence: "A", page: 738,
    notes: [{ text: "Có thể thêm aminoglycosid vào clindamycin khi khả năng nhiễm vi khuẩn Gram âm vào vùng mổ tăng.", page: 761 }] },
  { id: "hn4", group: "Đầu và cổ", name: "Phẫu thuật sạch – nhiễm khác, trừ cắt amidan và phẫu thuật nội soi chức năng xoang", primary: "Cefazolin + metronidazole, cefuroxime + metronidazole, ampicillin–sulbactam", alternative: "Clindamycin (d)", evidence: "B", page: 738,
    notes: [{ text: "Dự phòng chưa được chứng minh có lợi ở cắt amidan và phẫu thuật nội soi chức năng xoang.", page: 761 }] },

  { id: "ns1", group: "Thần kinh", name: "Mở sọ chương trình và phẫu thuật dẫn lưu dịch não tủy", primary: "Cefazolin", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A", page: 738,
    notes: [{ text: "Một liều duy nhất cefazolin. Clindamycin hoặc vancomycin dành cho người bệnh có ghi nhận dị ứng beta-lactam (vancomycin cho người mang MRSA).", page: 763 }] },
  { id: "ns2", group: "Thần kinh", name: "Cấy bơm nội tủy", primary: "Cefazolin", alternative: "Clindamycin (d), vancomycin (d)", evidence: "C", page: 738 },

  { id: "ob1", group: "Sản phụ khoa", name: "Mổ lấy thai", primary: "Cefazolin", alternative: "Clindamycin + " + AG, evidence: "A", page: 738,
    notes: [
      { text: "Một liều duy nhất cefazolin trước rạch da, cho mọi sản phụ mổ lấy thai.", page: 764 },
      { text: "ACOG và AAP ủng hộ liều duy nhất cho cuộc mổ < 2 giờ; có thể cần thêm liều trong mổ khi mất máu nhiều hoặc mổ kéo dài.", page: 764 },
    ] },
  { id: "ob2", group: "Sản phụ khoa", name: "Cắt tử cung (đường âm đạo hoặc đường bụng)", primary: "Cefazolin, cefotetan, cefoxitin, ampicillin–sulbactam (h)", alternative: "Clindamycin hoặc vancomycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j); HOẶC " + MET, evidence: "A", page: 738,
    notes: [
      { text: "Áp dụng cho cả đường mổ mở và nội soi; khuyến cáo một liều duy nhất cefazolin.", page: 765 },
      { text: "Cần liều thứ hai khi cuộc mổ kéo dài ≥ 3 giờ hoặc mất máu > 1500 ml.", page: 765 },
    ] },

  { id: "op1", group: "Mắt", name: "Phẫu thuật mắt", primary: "Nhỏ tại chỗ neomycin–polymyxin B–gramicidin hoặc fluoroquinolon (h, i, j) thế hệ 4 tại chỗ (gatifloxacin hoặc moxifloxacin): 1 giọt mỗi 5–15 phút × 5 liều (o). Có thể thêm cefazolin 100 mg tiêm dưới kết mạc, hoặc cefazolin 1–2,5 mg hay cefuroxime 1 mg tiêm tiền phòng khi kết thúc phẫu thuật.", alternative: "Không", evidence: "B", page: 738,
    notes: [
      { text: "Khuyến cáo sát khuẩn bằng povidone–iodine trước mổ.", page: 768 },
      { text: "Chưa đủ dữ liệu để khuyến cáo cụ thể về lựa chọn thuốc, đường dùng hay thời gian dự phòng; 5 liều nhỏ mắt dùng trong vòng 1 giờ trước khi bắt đầu phẫu thuật.", page: 768 },
    ] },

  { id: "or1", group: "Chấn thương chỉnh hình", name: "Phẫu thuật sạch ở bàn tay, gối hoặc bàn chân, không cấy vật liệu lạ", primary: "Không dự phòng", alternative: "Không dự phòng", none: true, evidence: "C", page: 738,
    notes: [
      { text: "Bao gồm nội soi khớp. Nếu chưa rõ có cấy vật liệu lạ hay không, xử trí như có cấy.", page: 769 },
      { text: "Gãy xương hở độ I và II được xử trí dự phòng như các phẫu thuật chỉnh hình sạch khác; gãy hở độ III có hướng dẫn riêng (điều trị theo kinh nghiệm và cắt lọc).", page: 769 },
    ] },
  { id: "or2", group: "Chấn thương chỉnh hình", name: "Phẫu thuật cột sống có hoặc không có dụng cụ", primary: "Cefazolin", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A", page: 738, notes: [GN, MUP(771)] },
  { id: "or3", group: "Chấn thương chỉnh hình", name: "Phẫu thuật gãy xương háng", primary: "Cefazolin", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A", page: 738, notes: [GN, MUP(771)] },
  { id: "or4", group: "Chấn thương chỉnh hình", name: "Cấy dụng cụ kết hợp xương bên trong (vd. đinh, vít, nẹp, chỉ thép)", primary: "Cefazolin", alternative: "Clindamycin (d), vancomycin (d)", evidence: "C", page: 739, notes: [GN, MUP(771)] },
  { id: "or5", group: "Chấn thương chỉnh hình", name: "Thay khớp toàn bộ", primary: "Cefazolin", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A", page: 739,
    notes: [{ text: "Áp dụng cho thay khớp háng, khuỷu, gối, cổ chân, vai.", page: 772 }, { ...GN, page: 772 }, MUP(772)] },

  { id: "ur1", group: "Tiết niệu", name: "Thủ thuật đường tiết niệu dưới có yếu tố nguy cơ nhiễm khuẩn (gồm sinh thiết tuyến tiền liệt qua trực tràng)", primary: "Fluoroquinolon (h, i, j), trimethoprim–sulfamethoxazole, cefazolin", alternative: AG + " có hoặc không kèm clindamycin", evidence: "A", page: 739,
    notes: [
      { text: "Fluoroquinolon hoặc trimethoprim–sulfamethoxazole (uống hoặc tĩnh mạch), hoặc cefazolin (tĩnh mạch hoặc tiêm bắp).", page: 774 },
      { text: "Kháng sinh dự phòng đường uống dùng 1–2 giờ trước rạch da hoặc bắt đầu thủ thuật.", page: 774 },
    ] },
  { id: "ur2", group: "Tiết niệu", name: "Phẫu thuật sạch không vào đường tiết niệu", primary: "Cefazolin (có thể khuyến cáo thêm một liều aminoglycosid khi đặt vật liệu giả, vd. dương vật giả)", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A", page: 739 },
  { id: "ur3", group: "Tiết niệu", name: "Có cấy bộ phận giả", primary: "Cefazolin ± aminoglycosid, cefazolin ± aztreonam, ampicillin–sulbactam", alternative: "Clindamycin ± aminoglycosid hoặc aztreonam; vancomycin ± aminoglycosid hoặc aztreonam", evidence: "A", page: 739 },
  { id: "ur4", group: "Tiết niệu", name: "Phẫu thuật sạch có vào đường tiết niệu", primary: "Cefazolin (có thể khuyến cáo thêm một liều aminoglycosid khi đặt vật liệu giả, vd. dương vật giả)", alternative: "Fluoroquinolon (h, i, j); " + AG + " có hoặc không kèm clindamycin", evidence: "A", page: 739 },
  { id: "ur5", group: "Tiết niệu", name: "Phẫu thuật sạch – nhiễm", primary: "Cefazolin + metronidazole, cefoxitin", alternative: "Fluoroquinolon (h, i, j); " + AG + " + metronidazole hoặc clindamycin", evidence: "A", page: 739,
    notes: [{ text: "Phẫu thuật sạch – nhiễm đường tiết niệu (thường vào đường tiêu hóa): dùng như phẫu thuật đại trực tràng chương trình.", page: 774 }] },

  { id: "va1", group: "Mạch máu", nameFn: ["p"], name: "Phẫu thuật mạch máu", primary: "Cefazolin", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A", page: 739,
    notes: [
      { text: "Áp dụng cho phẫu thuật mạch máu nguy cơ nhiễm khuẩn cao hơn, gồm cấy vật liệu giả.", page: 775 },
      { text: "Có thể thêm aminoglycosid vào vancomycin khi phẫu thuật động mạch chủ bụng hoặc có đường rạch vùng bẹn.", page: 775 },
      { text: "Đặt stent nội mạch: nếu muốn dự phòng thì dùng cùng thuốc và thời gian ngắn như phẫu thuật mạch máu mở. Yếu tố cân nhắc: thủ thuật > 2 giờ, can thiệp lại vị trí cũ trong 7 ngày, đặt stent vùng bẹn qua khối máu tụ hoặc ống dẫn, suy giảm miễn dịch, đã có bộ phận giả nội mạch khác.", page: 774 },
    ] },

  { id: "tx1", group: "Ghép tạng", nameFn: ["q", "r"], name: "Ghép tim", primary: "Cefazolin", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A (dựa trên phẫu thuật tim)", page: 739,
    notes: [
      { text: "Một liều duy nhất cefazolin. Thay thế: vancomycin hoặc clindamycin có hoặc không kèm gentamicin, aztreonam hoặc một liều fluoroquinolon.", page: 777 },
      { text: "Chưa rõ thời gian dự phòng tối ưu khi chưa đóng ngực thì đầu; không có khuyến cáo cho trường hợp này.", page: 777 },
    ] },
  { id: "tx2", group: "Ghép tạng", nameFn: ["q", "r", "s"], name: "Ghép phổi và ghép tim – phổi", primary: "Cefazolin", alternative: "Clindamycin (d), vancomycin (d)", evidence: "A (dựa trên phẫu thuật tim)", page: 739,
    notes: [
      { text: "Có thể thêm thuốc kháng nấm (Candida, Aspergillus) dựa trên yếu tố nguy cơ, tình trạng mang vi nấm, kết quả cấy trước và sau ghép, dịch tễ nấm tại chỗ.", page: 779 },
    ] },
  { id: "tx3", group: "Ghép tạng", nameFn: ["q", "t"], name: "Ghép gan", primary: "Piperacillin–tazobactam; cefotaxime + ampicillin", alternative: "Clindamycin hoặc vancomycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j)", evidence: "B", page: 739,
    notes: [
      { text: "Thời gian dự phòng giới hạn ≤ 24 giờ.", page: 781 },
      { text: "Người bệnh nguy cơ cao nhiễm Candida: có thể cân nhắc fluconazole chỉnh liều theo chức năng thận.", page: 781 },
    ] },
  { id: "tx4", group: "Ghép tạng", nameFn: ["r"], name: "Ghép tụy và ghép tụy – thận", primary: "Cefazolin; fluconazole (cho người bệnh nguy cơ cao nhiễm nấm, vd. dẫn lưu tụy vào ruột)", alternative: "Clindamycin hoặc vancomycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j)", evidence: "A", page: 739,
    notes: [
      { text: "Thời gian dự phòng giới hạn ≤ 24 giờ. Tránh dùng aminoglycosid cùng thuốc độc thận khác trừ khi chống chỉ định các thuốc thay thế.", page: 782 },
    ] },
  { id: "tx5", group: "Ghép tạng", name: "Ghép thận", primary: "Cefazolin", alternative: "Clindamycin hoặc vancomycin + " + AG + " hoặc aztreonam hoặc fluoroquinolon (h, i, j)", evidence: "A", page: 740,
    notes: [
      { text: "Trong bảng khuyến cáo gốc, dòng này nằm ngay dưới tiêu đề \"Plastic surgery\" nhưng thiếu nhãn tên; phác đồ và mức bằng chứng trùng khuyến cáo ở mục Ghép thận.", page: 783 },
      { text: "Thời gian dự phòng giới hạn ≤ 24 giờ. Tránh dùng aminoglycosid cùng thuốc độc thận khác trừ khi chống chỉ định các thuốc thay thế. Người bệnh nguy cơ cao nhiễm Candida: có thể cân nhắc fluconazole chỉnh liều theo chức năng thận.", page: 783 },
    ] },

  { id: "pl1", group: "Phẫu thuật tạo hình", name: "Phẫu thuật sạch có yếu tố nguy cơ hoặc phẫu thuật sạch – nhiễm", primary: "Cefazolin, ampicillin–sulbactam", alternative: "Clindamycin (d), vancomycin (d)", evidence: "C", page: 740,
    notes: [
      { text: "Không khuyến cáo dự phòng cho đa số phẫu thuật sạch ở người bệnh không có yếu tố nguy cơ. Khuyến cáo một liều duy nhất cho phẫu thuật sạch – nhiễm, phẫu thuật ung thư vú và phẫu thuật sạch có yếu tố nguy cơ khác.", page: 785 },
      { text: "Yếu tố nguy cơ riêng: cấy bộ phận giả, xạ trị da trước mổ, phẫu thuật vùng dưới thắt lưng.", page: 784 },
      { text: "Phẫu thuật vùng tai: có thể cân nhắc fluoroquinolon có tác dụng trên Pseudomonas.", page: 784 },
      { text: "Thời gian dự phòng sau mổ < 24 giờ, dù có lưu catheter hoặc ống dẫn lưu.", page: 785 },
    ] },
];

// Chú thích Bảng 2, tr. 740
export const ASHP_TABLE2_FOOTNOTES: Record<string, string> = {
  a: "Bắt đầu kháng sinh trong vòng 60 phút trước rạch da (120 phút với vancomycin hoặc fluoroquinolon). Một liều thường là đủ; thời gian dự phòng cho mọi phẫu thuật nên < 24 giờ. Thuốc có thời gian bán thải ngắn (vd. cefazolin, cefoxitin) cần dùng lại nếu cuộc mổ vượt khoảng nhắc liều khuyến cáo (tính từ lúc bắt đầu liều trước mổ, xem bảng Liều và nhắc liều). Có thể cần dùng lại khi chảy máu kéo dài hoặc nhiều, hoặc có yếu tố làm ngắn thời gian bán thải (vd. bỏng rộng). Có thể không cần dùng lại ở người bệnh có thời gian bán thải kéo dài (vd. suy thận).",
  b: "Với người bệnh đã biết mang Staphylococcus aureus kháng methicillin (MRSA), hợp lý khi thêm một liều vancomycin trước mổ vào phác đồ khuyến cáo.",
  c: "Mức bằng chứng ủng hộ dùng hay không dùng dự phòng: A (mức I–III), B (mức IV–VI), C (mức VII – ý kiến chuyên gia).",
  d: "Với phẫu thuật có khả năng gặp tác nhân ngoài tụ cầu và liên cầu, có thể cân nhắc thêm thuốc có tác dụng trên các tác nhân đó. Vd. nếu số liệu giám sát cho thấy vi khuẩn Gram âm gây NKVM, có thể phối hợp clindamycin hoặc vancomycin với thuốc khác (cefazolin nếu không dị ứng beta-lactam; aztreonam, gentamicin hoặc fluoroquinolon liều duy nhất nếu dị ứng beta-lactam).",
  e: "Cân nhắc dự phòng cho người bệnh nguy cơ cao nhất nhiễm khuẩn dạ dày – tá tràng sau mổ: tăng pH dạ dày (vd. dùng thuốc kháng H2 hoặc ức chế bơm proton), thủng dạ dày – tá tràng, giảm nhu động dạ dày, tắc môn vị, chảy máu dạ dày, béo phì bệnh lý hoặc ung thư. Có thể không cần dự phòng khi không vào lòng ống tiêu hóa.",
  f: "Cân nhắc bao phủ thêm khi đường mật nhiễm khuẩn (xem mục phẫu thuật đường mật).",
  g: "Gentamicin hoặc tobramycin.",
  h: "Do E. coli tăng kháng fluoroquinolon và ampicillin–sulbactam, cần xem xét độ nhạy tại chỗ trước khi dùng.",
  i: "Ciprofloxacin hoặc levofloxacin.",
  j: "Fluoroquinolon liên quan tăng nguy cơ viêm và đứt gân ở mọi lứa tuổi; nguy cơ này dự kiến rất nhỏ khi dự phòng liều duy nhất. Ở trẻ em, fluoroquinolon có thể cần thiết trong một số trường hợp nhưng không phải lựa chọn đầu tay do tăng biến cố bất lợi so với nhóm chứng trong một số thử nghiệm.",
  k: "Ceftriaxone chỉ nên dùng cho người bệnh cần điều trị viêm túi mật cấp hoặc nhiễm khuẩn đường mật cấp mà có thể chưa xác định trước rạch da; không dùng cho cắt túi mật do bệnh đường mật không nhiễm khuẩn, gồm cơn đau quặn mật hoặc rối loạn vận động đường mật không nhiễm khuẩn.",
  l: "Yếu tố nguy cơ cao biến chứng nhiễm khuẩn trong cắt túi mật nội soi: mổ cấp cứu, đái tháo đường, mổ kéo dài, vỡ túi mật trong mổ, tuổi > 70, chuyển mổ mở, ASA ≥ 3, cơn đau quặn mật trong 30 ngày trước mổ, can thiệp lại trong vòng 1 tháng vì biến chứng không nhiễm khuẩn, viêm túi mật cấp, rò rỉ dịch mật, vàng da, có thai, túi mật mất chức năng, suy giảm miễn dịch, đặt dụng cụ giả. Vì một số yếu tố không xác định được trước mổ, có thể hợp lý khi dùng một liều duy nhất cho mọi người bệnh cắt túi mật nội soi.",
  m: "Với đa số người bệnh, dùng chuẩn bị ruột cơ học kết hợp neomycin sulfat uống + erythromycin base uống hoặc neomycin sulfat uống + metronidazole uống, bên cạnh dự phòng tĩnh mạch.",
  n: "Nơi vi khuẩn Gram âm phân lập từ NKVM tăng kháng cephalosporin thế hệ 1 và 2, có thể ưu tiên một liều ceftriaxone + metronidazole thay vì dùng thường quy carbapenem.",
  o: "Chưa xác định được sự cần thiết của việc tiếp tục kháng sinh tại chỗ sau mổ.",
  p: "Không chỉ định dự phòng thường quy cho phẫu thuật mạch cánh tay đầu. Dù chưa có dữ liệu ủng hộ, phẫu thuật mạch cánh tay đầu có đặt mạch nhân tạo hoặc miếng vá (vd. bóc nội mạc động mạch cảnh) có thể có lợi khi dự phòng.",
  q: "Hướng dẫn này dành cho dự phòng NKVM chu phẫu, không bao gồm dự phòng nhiễm khuẩn cơ hội ở người ghép tạng suy giảm miễn dịch (vd. thuốc kháng nấm, kháng virus).",
  r: "Người bệnh mang dụng cụ hỗ trợ thất trái làm cầu nối và nhiễm khuẩn mạn tính có thể có lợi khi bao phủ tác nhân đang nhiễm.",
  s: "Có thể cần điều chỉnh phác đồ để bao phủ mọi tác nhân tiềm ẩn, gồm vi khuẩn Gram âm (vd. Pseudomonas aeruginosa) hoặc vi nấm, phân lập từ phổi người cho hoặc người nhận trước ghép. Người ghép phổi có kết quả cấy trước ghép âm tính dùng dự phòng như các phẫu thuật tim – lồng ngực khác. Người ghép phổi do xơ nang cần điều trị 7–14 ngày bằng kháng sinh chọn theo kết quả cấy và kháng sinh đồ trước ghép; có thể gồm thêm thuốc kháng khuẩn hoặc kháng nấm.",
  t: "Có thể cần điều chỉnh phác đồ để bao phủ mọi tác nhân tiềm ẩn, gồm Enterococcus kháng vancomycin, phân lập từ người nhận trước ghép.",
};

// Nguyên tắc chung (Common Principles), tr. 735–746; Phụ lục A tr. 818
export const ASHP_PRINCIPLES: { title: string; page: number; items: string[] }[] = [
  {
    title: "Phạm vi áp dụng",
    page: 735,
    items: [
      "Khuyến cáo cho người lớn (≥ 19 tuổi) và trẻ em (1–18 tuổi); không đề cập riêng trẻ sơ sinh (non tháng và đủ tháng).",
      "Với người suy thận hoặc suy gan, dự phòng thường không cần điều chỉnh khi dùng một liều duy nhất trước rạch da.",
    ],
  },
  {
    title: "Chỉ định",
    page: 741,
    items: [
      "Dự phòng có thể có lợi trong phẫu thuật có tỷ lệ nhiễm khuẩn cao (sạch – nhiễm, nhiễm) và một số phẫu thuật sạch mà hậu quả nhiễm khuẩn nặng (vd. cấy bộ phận giả).",
      "Dự phòng hợp lý cho đa số phẫu thuật sạch – nhiễm.",
      "Dùng kháng sinh cho phẫu thuật bẩn hoặc nhiễm khuẩn đã xác lập là điều trị nhiễm khuẩn, không phải dự phòng.",
      "Dự phòng có thể hợp lý cho bất kỳ phẫu thuật nào nếu người bệnh có bệnh nền nguy cơ cao NKVM hoặc suy giảm miễn dịch (vd. suy dinh dưỡng, giảm bạch cầu trung tính, đang dùng thuốc ức chế miễn dịch).",
    ],
  },
  {
    title: "Lựa chọn thuốc",
    page: 742,
    items: [
      "Với đa số phẫu thuật, cefazolin là thuốc được chọn.",
      "Không khuyến cáo dùng vancomycin dự phòng thường quy cho bất kỳ phẫu thuật nào. Có thể dùng vancomycin khi có cụm ca NKVM do MRSA hoặc tụ cầu coagulase âm kháng methicillin tại cơ sở; cân nhắc vancomycin cho người bệnh đã biết mang MRSA hoặc nguy cơ cao mang MRSA khi không có số liệu giám sát (vd. mới nằm viện, sống ở nhà dưỡng lão, lọc máu).",
      "Dùng vancomycin để dự phòng MRSA không thay thế dự phòng thường quy phù hợp với loại phẫu thuật. Khi dùng vancomycin, hầu như luôn dùng một liều duy nhất do thời gian bán thải dài.",
      "Người bệnh đang dùng kháng sinh điều trị một ổ nhiễm khuẩn xa vẫn cần dự phòng trước mổ. Nếu thuốc đang dùng phù hợp để dự phòng, chỉ cần thêm một liều trong vòng 60 phút trước rạch da; nếu không, dùng phác đồ dự phòng khuyến cáo cho phẫu thuật đó.",
      "Người suy thận mạn đang dùng vancomycin: cân nhắc một liều cefazolin trước mổ thay vì thêm liều vancomycin, nhất là khi tác nhân có khả năng là vi khuẩn Gram âm.",
      "Phần lớn trường hợp nên hoãn phẫu thuật chương trình khi người bệnh có nhiễm khuẩn ở vị trí xa.",
    ],
  },
  {
    title: "Dị ứng beta-lactam",
    page: 743,
    items: [
      "Không dùng cephalosporin và carbapenem để dự phòng ở người bệnh có ghi nhận hoặc nghi ngờ dị ứng penicillin qua trung gian IgE.",
      "Cephalosporin và carbapenem có thể dùng an toàn khi phản ứng dị ứng với penicillin không qua trung gian IgE (vd. phản vệ, mày đay, co thắt phế quản) và không phải viêm da tróc vảy (hội chứng Stevens–Johnson, hoại tử thượng bì nhiễm độc).",
      "Cần hỏi kỹ tiền sử dị ứng kháng sinh để xác định có dị ứng thật trước khi chọn thuốc dự phòng.",
      "Với phẫu thuật sạch, vancomycin có thể phù hợp cho người bệnh dị ứng beta-lactam đe dọa tính mạng.",
    ],
  },
  {
    title: "Thời điểm liều đầu",
    page: 744,
    items: [
      "Bắt đầu liều đầu trong vòng 60 phút trước rạch da.",
      "Vancomycin và fluoroquinolon cần bắt đầu trong vòng 120 phút trước rạch da do thời gian truyền kéo dài.",
      "Đường tĩnh mạch là lý tưởng cho đa số phẫu thuật.",
    ],
  },
  {
    title: "Liều theo cân nặng",
    page: 745,
    items: [
      "Tăng liều cefazolin lên 2 g cho người > 80 kg và 3 g cho người > 120 kg là hợp lý; một số bệnh viện chuẩn hóa liều cefazolin 2 g cho mọi người lớn. (Bảng liều: 2 g; 3 g nếu ≥ 120 kg.)",
      "Gentamicin: ở người béo phì có cân nặng thực vượt cân nặng lý tưởng 20%, tính liều theo cân nặng lý tưởng + 40% phần chênh giữa cân nặng thực và cân nặng lý tưởng. Khi phối hợp với thuốc có tác dụng trên vi khuẩn kỵ khí, có thể dùng 4,5–5 mg/kg liều duy nhất.",
      "Trẻ em > 40 kg dùng liều theo cân nặng trừ khi liều hoặc tổng liều ngày vượt liều khuyến cáo người lớn; khi tính theo mg/kg vượt liều tối đa người lớn thì dùng liều người lớn.",
    ],
  },
  {
    title: "Nhắc liều trong mổ",
    page: 746,
    items: [
      "Cần nhắc liều khi thời gian mổ vượt 2 lần thời gian bán thải của thuốc hoặc mất máu nhiều (> 1500 ml).",
      "Khoảng nhắc liều tính từ lúc dùng liều trước mổ, không tính từ lúc bắt đầu phẫu thuật.",
      "Có thể cần nhắc liều khi có yếu tố làm ngắn thời gian bán thải (vd. bỏng rộng); có thể không cần khi thời gian bán thải kéo dài (vd. suy thận). Xem bảng Liều và nhắc liều.",
    ],
  },
  {
    title: "Thời gian dự phòng",
    page: 746,
    items: [
      "Thời gian dự phòng nên < 24 giờ cho đa số phẫu thuật.",
      "Phẫu thuật tim – lồng ngực: dự phòng trong suốt cuộc mổ và chắc chắn < 24 giờ là phù hợp.",
      "Không có dữ liệu ủng hộ duy trì dự phòng đến khi rút hết ống dẫn lưu và catheter nội mạch.",
    ],
  },
  {
    title: "Trẻ em",
    page: 735,
    items: [
      "Thuốc được chọn là cephalosporin thế hệ 1 và 2; vancomycin dành cho trẻ có ghi nhận dị ứng beta-lactam. Có thể cân nhắc vancomycin ở trẻ đã biết mang MRSA.",
      "Không dùng thường quy fluoroquinolon để dự phòng ở trẻ em do nguy cơ độc tính.",
      "Liều trước mổ trong vòng 60 phút trước rạch da; có thể cần thêm liều khi mổ vượt 2 lần thời gian bán thải hoặc mất máu nhiều. Nếu duy trì sau mổ, thời gian < 24 giờ dù có catheter nội mạch hoặc ống dẫn lưu.",
      "Trừ một số ngoại lệ (vd. liều aminoglycosid), liều trẻ em không vượt liều tối đa người lớn.",
    ],
  },
  {
    title: "Kháng sinh tại chỗ và khử khuẩn mang S. aureus",
    page: 746,
    items: [
      "Chưa xác lập được an toàn và hiệu quả của kháng sinh tại chỗ; không khuyến cáo dùng thường quy trong phẫu thuật tim hoặc phẫu thuật khác.",
      "Không khuyến khích dùng mupirocin đại trà; khi dùng mupirocin hỗ trợ dự phòng NKVM do S. aureus, cần giám sát độ nhạy của S. aureus với mupirocin. Khuyến cáo cụ thể có ở mục phẫu thuật tim và chỉnh hình.",
    ],
  },
];

// Phụ lục A – Phân loại vết mổ theo NHSN, tr. 818
export const ASHP_WOUND_CLASSES: { name: string; text: string }[] = [
  { name: "Sạch", text: "Vết mổ không nhiễm khuẩn, không gặp viêm, không vào đường hô hấp, tiêu hóa, sinh dục hoặc tiết niệu không nhiễm khuẩn. Vết mổ được đóng kín thì đầu và, nếu cần, dẫn lưu kín. Vết mổ sau chấn thương kín (không xuyên thấu) thuộc nhóm này nếu đáp ứng tiêu chuẩn." },
  { name: "Sạch – nhiễm", text: "Vào đường hô hấp, tiêu hóa, sinh dục hoặc tiết niệu trong điều kiện kiểm soát và không nhiễm bẩn bất thường. Cụ thể gồm phẫu thuật đường mật, ruột thừa, âm đạo và hầu họng, với điều kiện không có bằng chứng nhiễm khuẩn hoặc sai sót lớn về kỹ thuật vô khuẩn." },
  { name: "Nhiễm", text: "Vết thương hở, mới, do tai nạn. Ngoài ra gồm phẫu thuật có sai sót lớn về vô khuẩn (vd. xoa bóp tim hở), tràn dịch nhiều từ đường tiêu hóa, và đường rạch gặp viêm cấp không mủ." },
  { name: "Bẩn hoặc nhiễm khuẩn", text: "Vết thương chấn thương cũ còn mô hoại tử, và phẫu thuật có nhiễm khuẩn lâm sàng đang có hoặc thủng tạng rỗng. Tác nhân gây nhiễm khuẩn sau mổ đã có mặt ở vùng mổ trước phẫu thuật." },
];
