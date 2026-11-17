// QĐ 3671/QĐ-BYT ngày 27/9/2012 – Hướng dẫn phòng ngừa nhiễm khuẩn vết mổ (bản PDF người dùng cung cấp 17/11/2026).
// Nội dung trích: Bảng 3 "Phân loại vết mổ và nguy cơ nhiễm khuẩn vết mổ"; mục 3.2.2 "Sử dụng kháng sinh dự phòng
// trong phẫu thuật"; Phụ lục 4 (bảng kiểm) phần "Sử dụng kháng sinh dự phòng".
// WOUND_CLASS_BY_OP: xếp loại từng phẫu thuật trong bảng lựa chọn KSDP (QĐ 708) THEO ĐỊNH NGHĨA của Bảng 3;
// hai văn bản không có bảng gán sẵn cho từng phẫu thuật, nên mỗi dòng ghi lý do xếp loại.

export const BYT3671 = {
  title: "QĐ 3671/QĐ-BYT (2012) – Hướng dẫn phòng ngừa nhiễm khuẩn vết mổ",
  short: "QĐ 3671/QĐ-BYT",
};

export type WoundClass = "sach" | "sach-nhiem" | "nhiem" | "ban";

export const WOUND_CLASSES: { id: WoundClass; name: string; definition: string; risk: string }[] = [
  { id: "sach", name: "Sạch", risk: "1–5%",
    definition: "Là những phẫu thuật không có nhiễm khuẩn, không mở vào đường hô hấp, tiêu hóa, sinh dục và tiết niệu. Các vết thương sạch được đóng kín kỳ đầu hoặc được dẫn lưu kín. Các phẫu thuật sau chấn thương kín." },
  { id: "sach-nhiem", name: "Sạch – nhiễm", risk: "5–10%",
    definition: "Là các phẫu thuật mở vào đường hô hấp, tiêu hoá, sinh dục và tiết niệu trong điều kiện có kiểm soát và không bị ô nhiễm bất thường. Trong trường hợp đặc biệt, các phẫu thuật đường mật, ruột thừa, âm đạo và hầu họng được xếp vào loại vết mổ sạch nhiễm nếu không thấy có bằng chứng nhiễm khuẩn/không phạm phải lỗi vô khuẩn trong khi mổ." },
  { id: "nhiem", name: "Nhiễm", risk: "10–15%",
    definition: "Các vết thương hở, chấn thương có kèm vết thương mới hoặc những phẫu thuật để xảy ra lỗi vô khuẩn lớn hoặc phẫu thuật để thoát lượng lớn dịch từ đường tiêu hoá. Những phẫu thuật mở vào đường sinh dục tiết niệu, đường mật có nhiễm khuẩn, phẫu thuật tại những vị trí có nhiễm khuẩn cấp tính nhưng chưa hoá mủ." },
  { id: "ban", name: "Bẩn", risk: "> 25%",
    definition: "Các chấn thương cũ kèm theo mô chết, dị vật hoặc ô nhiễm phân. Các phẫu thuật có nhiễm khuẩn rõ hoặc có mủ." },
];

// Mục 3.2.2 – Sử dụng kháng sinh dự phòng trong phẫu thuật (nguyên văn)
export const KSDP_3671: { title: string; items: string[] }[] = [
  {
    title: "Chỉ định",
    items: [
      "Sử dụng KSDP với các phẫu thuật sạch và sạch – nhiễm. KSDP cần dùng liều ngắn ngày ngay trước phẫu thuật nhằm diệt các vi khuẩn xâm nhập vào vết mổ trong thời gian phẫu thuật.",
    ],
  },
  {
    title: "Bốn nguyên tắc sử dụng KSDP",
    items: [
      "Lựa chọn loại kháng sinh nhạy cảm với các tác nhân gây NKVM thường gặp nhất tại bệnh viện và đối với loại phẫu thuật được thực hiện.",
      "Tiêm KSDP trong vòng 30 phút trước rạch da. Không tiêm kháng sinh sớm hơn 1 giờ trước khi rạch da. Nếu là mổ đẻ, liều KSDP cần được tiêm ngay sau khi kẹp dây rốn. Đối với người bệnh đang điều trị kháng sinh, vào ngày phẫu thuật cần điều chỉnh thời điểm đưa kháng sinh vào cơ thể sao cho gần cuộc mổ nhất có thể.",
      "Duy trì nồng độ diệt khuẩn trong huyết thanh và ở mô/tổ chức trong suốt cuộc mổ cho đến vài giờ sau khi kết thúc cuộc mổ. Với hầu hết các phẫu thuật chỉ nên sử dụng 1 liều KSDP. Có thể cân nhắc tiêm thêm 1 liều KSDP trong các trường hợp: (1) Phẫu thuật kéo dài > 4 giờ; (2) Phẫu thuật mất máu nhiều; (3) Phẫu thuật ở người bệnh béo phì. Với phẫu thuật đại, trực tràng ngoài mũi tiêm tĩnh mạch trên, người bệnh cần được rửa ruột và uống kháng sinh không hấp thụ qua đường ruột (nhóm metronidazol) vào ngày trước phẫu thuật và ngày phẫu thuật.",
      "Không dùng KSDP kéo dài quá 24 giờ sau phẫu thuật. Riêng với phẫu thuật mổ tim hở có thể dùng KSDP tới 48 giờ sau phẫu thuật.",
    ],
  },
  {
    title: "Tiêu chí đánh giá sử dụng KSDP (bảng kiểm thực hiện hướng dẫn)",
    items: [
      "Sử dụng loại kháng sinh dự phòng thích hợp.",
      "Sử dụng KSDP theo đường tĩnh mạch.",
      "KSDP được dùng < 30 phút trước khi rạch da.",
      "Không dùng KS > 2 ngày với PT sạch, sạch-nhiễm.",
    ],
  },
];

export type OpClass = { cls: WoundClass | "tuy"; label: string; reason: string };

const S = (reason: string): OpClass => ({ cls: "sach", label: "Sạch", reason });
const SN = (reason: string): OpClass => ({ cls: "sach-nhiem", label: "Sạch – nhiễm", reason });
const T = (label: string, reason: string): OpClass => ({ cls: "tuy", label, reason });

const KHONG_MO = "Không mở vào đường hô hấp, tiêu hóa, sinh dục, tiết niệu.";

// Khóa = id phẫu thuật trong data/antibiotics/prophylaxis-byt708.ts
export const WOUND_CLASS_BY_OP: Record<string, OpClass> = {
  u1: SN("Kim sinh thiết đi qua trực tràng (đường tiêu hóa)."),
  u2: SN("Mở vào đường tiết niệu (qua niệu đạo, bàng quang, niệu quản)."),
  u3: SN("Mở vào đường tiết niệu."),
  u4: SN("Mở vào đường tiết niệu."),
  u5: SN("Mở vào đường tiết niệu và đường tiêu hóa (hồi tràng)."),
  u6: S(KHONG_MO),
  c1: S(KHONG_MO), c2: S(KHONG_MO), c3: S(KHONG_MO), c4: S(KHONG_MO), c5: S(KHONG_MO), c6: S(KHONG_MO), c7: S(KHONG_MO),
  v1: S(KHONG_MO), v2: S(KHONG_MO), v3: S(KHONG_MO),
  t1: SN("Cắt thùy phổi, cắt phổi mở vào đường hô hấp (phế quản)."),
  t2: SN("Mở vào đường tiêu hóa (thực quản)."),
  n1: S(KHONG_MO), n2: S(KHONG_MO), n3: S(KHONG_MO), n4: S(KHONG_MO),
  n5: SN("Đi qua hốc mũi, xoang bướm (đường hô hấp)."),
  o1: S(KHONG_MO), o2: S(KHONG_MO), o3: S(KHONG_MO), o4: S(KHONG_MO), o5: S(KHONG_MO), o6: S(KHONG_MO), o7: S(KHONG_MO), o8: S(KHONG_MO),
  g1: SN("Mở vào đường tiêu hóa."),
  g2: SN("Phẫu thuật đường mật: xếp sạch – nhiễm khi không có bằng chứng nhiễm khuẩn."),
  g3: T("Sạch – nhiễm khi mở vào đường mật", "Cắt gan có can thiệp đường mật là mở vào đường tiêu hóa – mật; không mở vào thì là sạch."),
  g4: SN("Mở vào đường tiêu hóa và đường mật."),
  g5: SN("Mở vào đường tiêu hóa."),
  g6: SN("Mở vào đường tiêu hóa (dạ dày)."),
  g7: T("Sạch – nhiễm; biến chứng: nhiễm hoặc bẩn", "Ruột thừa không biến chứng là sạch – nhiễm. Có hoại tử, thủng, mủ là nhiễm hoặc bẩn – điều trị như viêm phúc mạc thứ phát, không phải dự phòng."),
  g8: T("Đại trực tràng: sạch – nhiễm; chấn thương bụng hở: nhiễm", "Mổ đại trực tràng có chuẩn bị mở vào đường tiêu hóa. Vết thương hở, chấn thương có vết thương mới xếp loại nhiễm."),
  g9: S(KHONG_MO),
  g10: T("Sạch; mở vào ruột: sạch – nhiễm", "Thoát vị không phải cắt ruột là sạch. Phải mở vào ruột (thoát vị nghẹt) là sạch – nhiễm."),
  g11: S(KHONG_MO), g12: S(KHONG_MO),
  ob1: SN("Mở vào đường sinh dục (tử cung)."),
  ob2: SN("Mở vào đường sinh dục (âm đạo, tử cung)."),
  ob3: SN("Mở vào đường sinh dục."),
  ob4: SN("Mở vào đường sinh dục (đường âm đạo)."),
  h1: T("Tuyến mang tai, tuyến giáp: sạch; cắt amydal: sạch – nhiễm", "Cắt amydal là phẫu thuật hầu họng (sạch – nhiễm); cắt tuyến mang tai, tuyến giáp không mở vào đường hô hấp – tiêu hóa (sạch)."),
  h2: S(KHONG_MO),
  h3: SN("Mở vào hầu họng, hốc mũi hoặc khoang miệng (đường hô hấp – tiêu hóa trên)."),
  h4: T("Sạch; mở vào hầu, thanh quản: sạch – nhiễm", "Đại phẫu vùng cổ không mở vào đường thở – tiêu hóa là sạch; có mở vào hầu, thanh quản là sạch – nhiễm."),
  p1: T("Sạch có yếu tố nguy cơ hoặc sạch – nhiễm", "Theo đúng tên dòng trong bảng lựa chọn KSDP."),
  p2: S(KHONG_MO),
  p3: SN("Mở vào hốc mũi (đường hô hấp)."),
  tx1: SN("Nối tụy vào ruột hoặc bàng quang (đường tiêu hóa, tiết niệu)."),
  tx2: SN("Nối niệu quản vào bàng quang (đường tiết niệu)."),
  tx3: SN("Nối đường mật."),
  ir1: SN("Thủ thuật trên đường mật, đường tiêu hóa."),
  ir2: S("Thủ thuật qua da, không mở vào đường hô hấp, tiêu hóa, sinh dục, tiết niệu."),
  ir3: SN("Thủ thuật trên đường tiết niệu."),
  ir4: S(KHONG_MO), ir5: S(KHONG_MO), ir6: S(KHONG_MO),
};
