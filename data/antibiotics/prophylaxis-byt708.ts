// Kháng sinh dự phòng phẫu thuật – QĐ 708/QĐ-BYT (02/3/2015) "Hướng dẫn sử dụng kháng sinh".
// Trích từ văn bản gốc (kcb.vn), số trang = số trang in = số trang PDF.
//   Chương I, mục 2 "Sử dụng kháng sinh dự phòng": tr. 39–41
//   Chương 7 "Sử dụng kháng sinh trong dự phòng sản khoa": tr. 178–179
//   Phụ lục 2 "Liều kháng sinh trong dự phòng phẫu thuật": tr. 258
//   Phụ lục 3 "Lựa chọn kháng sinh dự phòng phẫu thuật": tr. 259–262
// Giữ nguyên cách viết của văn bản (gentamycin, metronidazol, ceftriaxone).
// VÀ = phối hợp; HOẶC = chọn một; ± = có hoặc không phối hợp.

export const BYT708_URL =
  "https://kcb.vn/upload/2005611/20210723/Hướng-dẫn-sử-dụng-kháng-sinh-Cập-nhật-lần-cuối-khi-in-09.01.2015.pdf";

export const pdfPage = (page: number) => `${BYT708_URL}#page=${page}`;

export type KsdpDose = {
  drug: string;
  /** Liều thường dùng – nguyên văn Phụ lục 2 */
  dose: string[];
  /** Điều chỉnh liều trong thủ thuật – nguyên văn Phụ lục 2 */
  redose: string;
  fn?: number[];
};

// Phụ lục 2, tr. 258
export const KSDP_DOSES: KsdpDose[] = [
  { drug: "Cefazolin", dose: ["< 120 kg: 2 g", "≥ 120 kg: 3 g"], redose: "Mỗi 4 giờ (mỗi 2 giờ đối với phẫu thuật tim)" },
  { drug: "Cefotetan", dose: ["< 120 kg: 2 g", "≥ 120 kg: 3 g"], redose: "Mỗi 6 giờ" },
  { drug: "Clindamycin", dose: ["600 mg"], redose: "Mỗi 6 giờ" },
  { drug: "Ciprofloxacin", dose: ["400 mg"], redose: "Mỗi 8 giờ" },
  { drug: "Gentamycin", dose: ["5 mg/kg"], redose: "Không", fn: [2] },
  { drug: "Metronidazol", dose: ["500 mg"], redose: "Mỗi 12 giờ" },
  { drug: "Vancomycin", dose: ["< 70 kg: 1 g", "71 - 99 kg: 1,25 g", "> 100 kg: 1,5 g"], redose: "Mỗi 12 giờ" },
];

export type KsdpOperation = {
  id: string;
  group: string;
  name: string;
  /** Cột "Khuyến cáo dự phòng" */
  primary: string;
  /** Cột "Kháng sinh thay thế nếu dị ứng Penicillin" */
  alternative: string;
  page: number;
  noProphylaxis?: boolean;
  /** Chú thích (số mũ) gắn với tên phẫu thuật */
  nameFn?: number[];
  /** Chú thích đã viết sẵn trong tên (số mũ giữa câu) */
  extraFn?: number[];
  /** Chú thích gắn với cột khuyến cáo / cột thay thế */
  primaryFn?: number[];
  altFn?: number[];
};

const NONE = "Không khuyến cáo dự phòng";
const G = {
  uro: "Các phẫu thuật, thủ thuật tiết niệu",
  heart: "Phẫu thuật tim",
  vasc: "Phẫu thuật mạch máu",
  thor: "Phẫu thuật lồng ngực",
  neuro: "Phẫu thuật thần kinh",
  ortho: "Phẫu thuật chỉnh hình",
  gen: "Phẫu thuật chung",
  obs: "Phẫu thuật sản khoa",
  head: "Phẫu thuật vùng đầu và mặt",
  plast: "Phẫu thuật tạo hình",
  tx: "Phẫu thuật ghép tạng vùng bụng",
  ir: "Thủ thuật X – quang can thiệp",
} as const;

// Phụ lục 3, tr. 259–262 – đủ mọi dòng, đúng thứ tự văn bản
export const KSDP_OPERATIONS: KsdpOperation[] = [
  // tr. 259
  { id: "u1", group: G.uro, name: "Sinh thiết tuyến tiền liệt qua trực tràng", nameFn: [1], primary: "Cefazolin", alternative: "Ciprofloxacin HOẶC gentamycin", altFn: [2], page: 259 },
  { id: "u2", group: G.uro, name: "Phẫu thuật qua niệu đạo (Ví dụ: Cắt tuyến tiền liệt qua niệu đạo - TURP, cắt u bàng quang qua niệu đạo - TURBT, nội soi niệu quản, nội soi bàng quang niệu quản)", primary: "Cefazolin", alternative: "Gentamycin", altFn: [2], page: 259 },
  { id: "u3", group: G.uro, name: "Tán sỏi", primary: "Cefazolin", alternative: "Gentamycin", altFn: [2], page: 259 },
  { id: "u4", group: G.uro, name: "Cắt thận hoặc cắt bỏ tuyến tiền liệt triệt căn", primary: "Cefazolin", alternative: "Clindamycin", page: 259 },
  { id: "u5", group: G.uro, name: "Cắt bàng quang triệt căn; phẫu thuật hồi tràng; cắt bàng quang và tuyến tiền liệt hoặc cắt bàng quang, niệu đạo, âm đạo, tử cung và các mô ở thành tiểu khung", primary: "Cefotetan", alternative: "Clindamycin VÀ gentamycin", altFn: [2], page: 259 },
  { id: "u6", group: G.uro, name: "Liên quan dương vật hoặc các phẫu thuật thay thế bộ phận giả khác", primary: "[Cefazolin HOẶC vancomycin] VÀ gentamycin", primaryFn: [2], alternative: "[Clindamycin HOẶC vancomycin] VÀ gentamycin", altFn: [2], page: 259 },

  { id: "c1", group: G.heart, name: "Mở xương ức đường giữa, ghép tim", nameFn: [3], primary: "Cefazolin", alternative: "Vancomycin", page: 259 },
  { id: "c2", group: G.heart, name: "Mở xương ức đường giữa, ghép tim ở người bệnh có tiền sử dùng dụng cụ hỗ trợ thất (VAD) hoặc có tụ cầu vàng kháng methicillin (MRSA) xâm nhập/nhiễm khuẩn", nameFn: [3], primary: "Cefazolin VÀ vancomycin", alternative: "Vancomycin", page: 259 },
  { id: "c3", group: G.heart, name: "Đặt máy tạo nhịp hoặc máy khử rung tim (ICD)", primary: "Cefazolin", alternative: "Clindamycin HOẶC vancomycin", page: 259 },
  { id: "c4", group: G.heart, name: "Đặt máy tạo nhịp hoặc máy khử rung tim (ICD) ở người bệnh có tụ cầu vàng kháng methicillin (MRSA) xâm nhập/nhiễm khuẩn", primary: "Cefazolin VÀ vancomycin", alternative: "Vancomycin", page: 259 },
  { id: "c5", group: G.heart, name: "Đặt các dụng cụ hỗ trợ thất (VAD)", primary: "Cefazolin", alternative: "Vancomycin", page: 259 },
  { id: "c6", group: G.heart, name: "Đặt các dụng cụ hỗ trợ thất (VAD) ở người bệnh có tụ cầu vàng kháng methicillin (MRSA) xâm nhập/nhiễm khuẩn", primary: "Cefazolin VÀ vancomycin", alternative: "Vancomycin", page: 259 },
  { id: "c7", group: G.heart, name: "Đặt các dụng cụ hỗ trợ thất (VAD) ngực hở", primary: "Cefazolin VÀ vancomycin đến khi đóng ngực", alternative: "Vancomycin VÀ ciprofloxacin đến khi đóng ngực", page: 259 },

  { id: "v1", group: G.vasc, name: "Thủ thuật mạch cảnh và mạch cánh tay đầu không đặt graft", primary: NONE, alternative: NONE, noProphylaxis: true, page: 259 },
  { id: "v2", group: G.vasc, name: "Thủ thuật mạch chi trên có đặt graft và thủ thuật mạch chi dưới", primary: "Cefazolin", alternative: "Clindamycin HOẶC vancomycin", page: 259 },
  { id: "v3", group: G.vasc, name: "Thủ thuật liên quan động mạch chủ bụng hoặc rạch da vùng bẹn", primary: "Cefotetan", alternative: "Vancomycin + gentamycin", altFn: [2], page: 259 },

  // tr. 260
  { id: "t1", group: G.thor, name: "Cắt thùy phổi, cắt phổi, mở ngực, nội soi lồng ngực hỗ trợ video", primary: "Cefazolin", alternative: "Clindamycin", page: 260 },
  { id: "t2", group: G.thor, name: "Các phẫu thuật thực quản", primary: "Cefotetan", alternative: "Clindamycin", page: 260 },

  { id: "n1", group: G.neuro, name: "Mở hộp sọ, đặt dẫn lưu dịch não tủy, cấy bơm dưới mạc tủy", primary: "Cefazolin", alternative: "Clindamycin", page: 260 },
  { id: "n2", group: G.neuro, name: "Mở cung sau đốt sống", primary: "Cefazolin", alternative: "Clindamycin", page: 260 },
  { id: "n3", group: G.neuro, name: "Gắn đốt sống", primary: "Cefazolin", alternative: "Clindamycin HOẶC vancomycin", page: 260 },
  { id: "n4", group: G.neuro, name: "Gắn đốt sống ở người bệnh có tụ cầu vàng kháng methicillin (MRSA) xâm nhập/nhiễm khuẩn", primary: "Cefazolin VÀ vancomycin", alternative: "Vancomycin", page: 260 },
  { id: "n5", group: G.neuro, name: "Các thủ thuật qua xương bướm", primary: "Ceftriaxone", alternative: "Moxifloxacin 400 mg trong 60 phút", page: 260 },

  { id: "o1", group: G.ortho, name: "Các phẫu thuật sạch vùng bàn tay, gối hoặc bàn chân, nội soi khớp", primary: NONE, alternative: NONE, noProphylaxis: true, page: 260 },
  { id: "o2", group: G.ortho, name: "Thay khớp toàn bộ", primary: "Cefazolin", alternative: "Vancomycin", page: 260 },
  { id: "o3", group: G.ortho, name: "Thay khớp toàn bộ ở người bệnh có tụ cầu vàng kháng methicillin (MRSA) xâm nhập/nhiễm khuẩn", primary: "Cefazolin VÀ vancomycin", alternative: "Vancomycin", page: 260 },
  { id: "o4", group: G.ortho, name: "Nắn xương gãy bên ngoài hoặc cố định bên trong", primary: "Cefazolin", alternative: "Clindamycin HOẶC vancomycin", page: 260 },
  { id: "o5", group: G.ortho, name: "Cắt cụt chi dưới", primary: "Cefotetan", alternative: "Clindamycin VÀ gentamycin", altFn: [2], page: 260 },
  { id: "o6", group: G.ortho, name: "Gắn đốt sống", primary: "Cefazolin", alternative: "Clindamycin HOẶC vancomycin", page: 260 },
  { id: "o7", group: G.ortho, name: "Gắn đốt sống ở người bệnh có tụ cầu vàng kháng methicillin (MRSA) xâm nhập/nhiễm khuẩn", primary: "Cefazolin VÀ vancomycin", alternative: "Vancomycin", page: 260 },
  { id: "o8", group: G.ortho, name: "Mở cung sau đốt sống", primary: "Cefazolin", alternative: "Clindamycin", page: 260 },

  { id: "g1", group: G.gen, name: "Thủ thuật xâm nhập vào đường tiêu hóa trên, cầu nối dạ dày, cắt tụy tá tràng, cắt thần kinh phế vị chọn lọc cao, nội soi cuộn đáy vị Nissen", primary: "Cefotetan", alternative: "Clindamycin ± gentamycin", altFn: [2], page: 260 },
  { id: "g2", group: G.gen, name: "Thủ thuật đường mật (Ví dụ: cắt túi mật, mở thông mật, ruột)", primary: "Cefotetan", alternative: "Clindamycin ± gentamycin", altFn: [2], page: 260 },
  { id: "g3", group: G.gen, name: "Cắt gan", primary: "Cefotetan", alternative: "Clindamycin ± gentamycin", altFn: [2], page: 260 },
  { id: "g4", group: G.gen, name: "Phẫu thuật Whipple hoặc cắt tụy", primary: "Cefotetan", alternative: "Clindamycin VÀ ciprofloxacin", page: 260 },
  { id: "g5", group: G.gen, name: "Ruột non", primary: "Cefotetan", alternative: "Clindamycin VÀ gentamycin", altFn: [2], page: 260 },
  { id: "g6", group: G.gen, name: "Mở dạ dày ra da qua nội soi (PEG)", primary: "Cefazolin HOẶC cefotetan", alternative: "Clindamycin ± gentamycin", altFn: [2], page: 260 },
  // tr. 261
  { id: "g7", group: G.gen, name: "Cắt ruột thừa (nếu biến chứng hoặc hoại tử, điều trị như viêm phúc mạc thứ phát)", primary: "Cefotetan", alternative: "Clindamycin VÀ gentamycin", altFn: [2], page: 261 },
  { id: "g8", group: G.gen, name: "Đại trực tràng, chấn thương bụng hở", primary: "Cefotetan", alternative: "Clindamycin VÀ gentamycin", altFn: [2], page: 261 },
  { id: "g9", group: G.gen, name: "Mổ thoát vị bẹn", primary: "Cefazolin", alternative: "Clindamycin", page: 261 },
  { id: "g10", group: G.gen, name: "Thoát vị bẹn có biến chứng, mổ cấp cứu hoặc tái phát", primary: "Cefotetan", alternative: "Clindamycin ± gentamycin", altFn: [2], page: 261 },
  { id: "g11", group: G.gen, name: "Cắt tuyến vú", primary: NONE, alternative: NONE, noProphylaxis: true, page: 261 },
  { id: "g12", group: G.gen, name: "Cắt tuyến vú có nạo vét hạch", primary: "Cefazolin", alternative: "Clindamycin VÀ gentamycin", altFn: [2], page: 261 },

  { id: "ob1", group: G.obs, name: "Mổ đẻ Cesarean", primary: "Cefazolin", alternative: "Clindamycin VÀ gentamycin", altFn: [2], page: 261 },
  { id: "ob2", group: G.obs, name: "Cắt tử cung (đường âm đạo hoặc bụng)", primary: "Cefazolin HOẶC cefotetan", alternative: "Clindamycin VÀ gentamycin", altFn: [2], page: 261 },
  { id: "ob3", group: G.obs, name: "Phẫu thuật ung thư", primary: "Cefotetan", alternative: "Clindamycin VÀ gentamycin", altFn: [2], page: 261 },
  { id: "ob4", group: G.obs, name: "Phẫu thuật sa bàng quang hoặc sa trực tràng", primary: "Cefazolin", alternative: "Clindamycin", page: 261 },

  { id: "h1", group: G.head, name: "Cắt tuyến mang tai, cắt tuyến giáp, cắt amydal", primary: NONE, alternative: NONE, noProphylaxis: true, page: 261 },
  { id: "h2", group: G.head, name: "Phẫu thuật tạo hình có thay thế các bộ phận", primary: "Cefazolin", alternative: "Clindamycin", page: 261 },
  { id: "h3", group: G.head, name: "Cắt VA, tạo hình mũi, phẫu thuật giảm thể tích khối u hoặc gãy xương hàm dưới", primary: "Cefotetan HOẶC clindamycin", alternative: "Clindamycin", page: 261 },
  { id: "h4", group: G.head, name: "Đại phẫu vùng cổ", primary: "Cefazolin", alternative: "Clindamycin", page: 261 },

  { id: "p1", group: G.plast, name: "Phẫu thuật sạch có yếu tố nguy cơ hoặc hỗn hợp sạch – nhiễm bẩn", primary: "Cefazolin", alternative: "Clindamycin", page: 261 },
  { id: "p2", group: G.plast, name: "Đặt/cấy/tất cả vạt ghép mô", primary: "Cefazolin", alternative: "Clindamycin", page: 261 },
  { id: "p3", group: G.plast, name: "Tạo hình mũi", primary: "Không dự phòng HOẶC cefazolin", alternative: "Không dự phòng HOẶC clindamycin", page: 261 },

  { id: "tx1", group: G.tx, name: "Ghép tụy hoặc tụy/thận", primary: "Cefotetan", alternative: "Clindamycin VÀ ciprofloxacin", page: 261 },
  { id: "tx2", group: G.tx, name: "Ghép thận/người cho sống", primary: "Cefazolin", alternative: "Clindamycin", page: 261 },
  { id: "tx3", group: G.tx, name: "Ghép gan", primary: "Cefotetan", alternative: "Clindamycin VÀ ciprofloxacin", page: 261 },

  { id: "ir1", group: G.ir, name: "Đường mật/đường tiêu hóa; nút hóa chất/cắt gan dưới da (tiền sử phẫu thuật/đặt dụng cụ đường mật; mở thông manh tràng)", primary: "Cefotetan", alternative: "Clindamycin VÀ gentamycin", page: 261 },
  { id: "ir2", group: G.ir, name: "Nút hóa chất; gây tắc động mạch trong u xơ tử cung; cắt gan/thận/phổi qua da; nút dị dạng mạch", extraFn: [5, 6], primary: NONE, alternative: NONE, noProphylaxis: true, page: 261 },
  // tr. 262
  { id: "ir3", group: G.ir, name: "Thủ thuật tiết niệu (trừ cắt thận)", primary: "Cefazolin", alternative: "Gentamycin", page: 262 },
  { id: "ir4", group: G.ir, name: "Chụp/gây tắc mạch bạch huyết", primary: "Cefazolin", alternative: "Clindamycin", page: 262 },
  { id: "ir5", group: G.ir, name: "Đặt ống thông (Ví dụ: tĩnh mạch trung tâm); thủ thuật can thiệp động/tĩnh mạch", primary: NONE, alternative: NONE, noProphylaxis: true, page: 262 },
  { id: "ir6", group: G.ir, name: "Đặt buồng tiêm cấy dưới da (Ví dụ Mediport®)", primary: "Cefazolin", alternative: "Clindamycin", page: 262 },
];

// Chú thích cuối Phụ lục 3, tr. 262 (nguyên văn)
export const KSDP_FOOTNOTES: Record<number, string> = {
  1: "Nếu có soi trực tràng trước phẫu thuật, xem Dự phòng trong sinh thiết tuyến tiền liệt dựa vào kết quả soi trực tràng.",
  2: "Không kê thêm liều gentamycin sau phẫu thuật để dự phòng.",
  3: "Phẫu thuật ngực hở, tiếp tục dùng kháng sinh dự phòng đến khi đóng ngực.",
  4: "Các khuyến cáo đưa ra dành cho các người bệnh không có dữ liệu xác đáng về vi sinh có thể gợi ý tình trạng kháng thuốc.",
  5: "Điều trị trước bằng kháng sinh có thể được cân nhắc cho người bệnh viêm phổi tắc nghẽn mạn tính hoặc tiền sử viêm phổi sau tắc nghẽn tái phát.",
  6: "Mạch bạch huyết hoặc người bệnh có da bị hoại tử trước khi đặt graft mạch cần dùng kháng sinh dự phòng là cefazolin.",
  7: "Mọi liều cho chức năng thận bất kỳ.",
  8: "SCIP không yêu cầu kháng sinh sau thủ thuật.",
};

// "Dự phòng trong sinh thiết tuyến tiền liệt dựa vào kết quả soi trực tràng", tr. 262
export const PROSTATE_BIOPSY = {
  page: 262,
  headers: { case: "Trường hợp", pre: "Điều trị dự phòng trước thủ thuật", post: "Lựa chọn kháng sinh đường uống sau thủ thuật" },
  headerFn: { pre: [7], post: [8] },
  rows: [
    {
      case: "Nhạy cảm Ciprofloxacin",
      pre: "Ciprofloxacin 750 mg đường uống 2 giờ trước thủ thuật",
      post: "Ciprofloxacin 500 mg đường uống ở mỗi 12 giờ sau thủ thuật. Nếu mức lọc cầu thận < 30 ml/min không cần bất kỳ dùng liều sau thủ thuật.",
    },
    {
      case: "Kháng Ciprofloxacin, nhạy cảm TMP/SMX",
      pre: "TMP/SMX 160mg/800mg x 1 viên 1 giờ trước thủ thuật và 1 viên trước 3 giờ",
      post: "TMP/SMX 160mg/800mg x 1 đường uống mỗi 12 giờ sau thủ thuật. Nếu mức lọc cầu thận < 30 ml/min không cần dùng liều sau thủ thuật.",
    },
    {
      case: "Kháng Ciprofloxacin và TMP/SMX, nhạy cảm Cefazolin",
      pre: "Cefazolin 2 g đường tĩnh mạch nhanh (3 - 5 phút) trong vòng 1 giờ trước thủ thuật",
      post: "Cefpodoxime 100 mg đường uống một liều duy nhất HOẶC cefdinir 300 mg đường uống một liều duy nhất",
    },
    {
      case: "Kháng Ciprofloxacin, TMP/SMX, Cefazolin",
      pre: "Gentamycin 5 mg/kg đường tĩnh mạch một liều duy nhất trong 30 - 60 phút HOẶC ceftriaxone 1 g đường tĩnh mạch trong 30 phút nếu nhạy cảm",
      post: "Không cần thêm liều vì gentamycin và ceftriaxone duy trì mức khả dụng trong 24 giờ",
    },
  ],
};

// Chương I, mục 2 – Sử dụng kháng sinh dự phòng (tr. 39–41)
export const KSDP_PRINCIPLES: { title: string; page: number; items: string[] }[] = [
  {
    title: "Định nghĩa",
    page: 39,
    items: [
      "Kháng sinh dự phòng (KSDP) là việc sử dụng kháng sinh trước khi xảy ra nhiễm khuẩn nhằm mục đích ngăn ngừa hiện tượng này.",
      "KSDP nhằm giảm tần suất nhiễm khuẩn tại vị trí hoặc cơ quan được phẫu thuật, không dự phòng nhiễm khuẩn toàn thân hoặc vị trí cách xa nơi được phẫu thuật.",
    ],
  },
  {
    title: "a) Chỉ định sử dụng KSDP",
    page: 39,
    items: [
      "Phẫu thuật được chia làm bốn loại: phẫu thuật sạch, phẫu thuật sạch - nhiễm, phẫu thuật nhiễm và phẫu thuật bẩn.",
      "KSDP được chỉ định cho tất cả các can thiệp phẫu thuật thuộc phẫu thuật sạch - nhiễm.",
      "Trong phẫu thuật sạch, liệu pháp kháng sinh dự phòng nên áp dụng với một số can thiệp ngoại khoa nặng, có thể ảnh hưởng tới sự sống còn và/hoặc chức năng sống (phẫu thuật chỉnh hình, phẫu thuật tim và mạch máu, phẫu thuật thần kinh, phẫu thuật nhãn khoa).",
      "Phẫu thuật nhiễm và phẫu thuật bẩn: kháng sinh đóng vai trò trị liệu. KSDP không ngăn ngừa nhiễm khuẩn mà ngăn ngừa nhiễm khuẩn đã xảy ra không phát triển.",
    ],
  },
  {
    title: "b) Lựa chọn kháng sinh dự phòng",
    page: 40,
    items: [
      "Kháng sinh có phổ tác dụng phù hợp với các chủng vi khuẩn chính thường gây nhiễm khuẩn tại vết mổ cũng như tình trạng kháng thuốc tại địa phương, đặc biệt trong từng bệnh viện.",
      "Kháng sinh ít hoặc không gây tác dụng phụ hay các phản ứng có hại, độc tính của thuốc càng ít càng tốt. Không sử dụng các kháng sinh có nguy cơ gây độc không dự đoán được và có mức độ gây độc nặng không phụ thuộc liều (ví dụ: kháng sinh nhóm phenicol và sunfamid gây giảm bạch cầu miễn dịch dị ứng, hội chứng Lyell).",
      "Kháng sinh không tương tác với các thuốc dùng để gây mê (ví dụ polymyxin, aminosid).",
      "Kháng sinh ít có khả năng chọn lọc vi khuẩn đề kháng kháng sinh và thay đổi hệ vi khuẩn thường trú.",
      "Khả năng khuếch tán của kháng sinh trong mô tế bào phải cho phép đạt nồng độ thuốc cao hơn nồng độ kháng khuẩn tối thiểu của vi khuẩn gây nhiễm.",
      "Liệu pháp kháng sinh dự phòng có chi phí hợp lý, thấp hơn chi phí kháng sinh trị liệu lâm sàng.",
    ],
  },
  {
    title: "c) Liều kháng sinh dự phòng",
    page: 40,
    items: ["Liều KSDP tương đương liều điều trị mạnh nhất của kháng sinh đó (xem bảng Liều kháng sinh dự phòng)."],
  },
  {
    title: "d) Đường dùng thuốc",
    page: 40,
    items: [
      "Đường tĩnh mạch: thường được lựa chọn do nhanh đạt nồng độ thuốc trong máu và mô tế bào.",
      "Đường tiêm bắp: có thể sử dụng nhưng không đảm bảo về tốc độ hấp thu của thuốc và không ổn định.",
      "Đường uống: chỉ dùng khi chuẩn bị phẫu thuật trực tràng, đại tràng.",
      "Đường tại chỗ: hiệu quả thay đổi theo từng loại phẫu thuật (trong phẫu thuật thay khớp, sử dụng chất xi măng tẩm kháng sinh).",
    ],
  },
  {
    title: "e) Thời gian dùng thuốc",
    page: 40,
    items: [
      "Thời gian sử dụng kháng sinh dự phòng nên trong vòng 60 phút trước khi tiến hành phẫu thuật và gần thời điểm rạch da.",
      "Cephalosporins tiêm tĩnh mạch trong 3 - 5 phút ngay trước thủ thuật và đạt nồng độ cần thiết ở da sau vài phút.",
      "Vancomycin và ciprofloxacin cần phải được dùng trước MỘT GIỜ và HOÀN THÀNH việc truyền trước khi bắt đầu rạch da.",
      "Clindamycin cần được truyền xong trước 10 - 20 phút.",
      "Gentamycin cần được dùng một liều duy nhất 5 mg/kg để tối đa hóa sự thấm vào mô và giảm thiểu độc tính. Nếu người bệnh lọc máu hoặc ClCr < 20 ml/phút, dùng liều 2 mg/kg.",
      "Đối với phẫu thuật mổ lấy thai, KSDP có thể dùng trước khi rạch da hoặc sau khi kẹp dây rốn để giảm biến chứng nhiễm khuẩn ở mẹ.",
    ],
  },
  {
    title: "Bổ sung liều trong thời gian phẫu thuật",
    page: 41,
    items: [
      "Trong phẫu thuật tim kéo dài hơn 4 giờ, cần bổ sung thêm một liều kháng sinh.",
      "Trong trường hợp mất máu với thể tích trên 1500 ml ở người lớn, và trên 25 ml/kg ở trẻ em, nên bổ sung liều KSDP sau khi bổ sung dịch thay thế.",
    ],
  },
  {
    title: "g) Lưu ý khi sử dụng KSDP",
    page: 41,
    items: [
      "Không dùng kháng sinh để dự phòng cho các nhiễm khuẩn liên quan đến chăm sóc sau mổ và những nhiễm khuẩn xảy ra trong lúc mổ.",
      "Nguy cơ khi sử dụng KSDP: dị ứng thuốc; sốc phản vệ; tiêu chảy do kháng sinh; nhiễm khuẩn do vi khuẩn Clostridium difficile; vi khuẩn đề kháng kháng sinh; lây truyền vi khuẩn đa kháng.",
    ],
  },
];

// Chương 7 – Sử dụng kháng sinh trong dự phòng sản khoa (tr. 178–179)
export const KSDP_OBSTETRIC: { title: string; page: number; items: string[] }[] = [
  {
    title: "Đại cương",
    page: 178,
    items: [
      "Chỉ định: áp dụng cho các thủ thuật có nguy cơ rõ ràng sẽ nhiễm khuẩn.",
      "Chống chỉ định: các tổn thương bẩn, các bệnh nội khoa không được kiểm soát, các dập nát mô không cắt lọc được tốt.",
    ],
  },
  {
    title: "Các thủ thuật sản khoa được cân nhắc dùng kháng sinh",
    page: 178,
    items: [
      "Mổ lấy thai: để đạt được nồng độ kháng sinh tại vị trí vết mổ trước khi rạch da thì cần tiêm kháng sinh dự phòng trước 30 phút. Kháng sinh có phổ bao phủ được các chủng thường gặp khi phẫu thuật vùng chậu (liên cầu, trực khuẩn đường ruột, tụ cầu và các loại vi khuẩn kỵ khí).",
      "Đẻ thủ thuật: không đủ cơ sở dữ liệu để khuyến cáo dùng kháng sinh dự phòng sau đẻ thủ thuật.",
      "Kiểm soát tử cung: WHO gợi ý nên dùng kháng sinh dự phòng sau kiểm soát buồng tử cung nhưng không có bằng chứng cụ thể nào về giá trị của việc dùng kháng sinh dự phòng cho các trường hợp này.",
      "Rách tầng sinh môn độ III và IV: tiêm tĩnh mạch liều duy nhất cefotetan, cefoxitin làm giảm tỷ lệ nhiễm khuẩn vết thương rõ rệt (8% so với 24%), gợi ý lợi ích của việc dùng kháng sinh dự phòng để làm giảm biến chứng nhiễm khuẩn vết thương.",
      "Liều của kháng sinh dự phòng đối với người béo phì: với người có BMI > 35, dùng liều kháng sinh gấp đôi so với những người có BMI < 35.",
    ],
  },
  {
    title: "Sử dụng kháng sinh dự phòng",
    page: 179,
    items: [
      "Đối với mổ lấy thai: cần phát hiện và điều trị các nhiễm khuẩn âm đạo như bacterial vaginosis, Chlamydia trước.",
      "Kháng sinh cefazolin 1 g tĩnh mạch trước khi rạch da 15 - 30 phút, người nặng ≥ 80 kg thì dùng 2 g cefazolin.",
    ],
  },
];

/** Liều cefazolin mổ lấy thai – Chương 7, tr. 179 (khác ngưỡng cân nặng với Phụ lục 2) */
export const CESAREAN_CEFAZOLIN = {
  page: 179,
  text: "Cefazolin 1 g tĩnh mạch trước khi rạch da 15 - 30 phút; người nặng ≥ 80 kg: 2 g.",
};
