// QĐ 3671/QĐ-BYT ngày 27/9/2012 – Hướng dẫn phòng ngừa nhiễm khuẩn vết mổ (bản PDF người dùng cung cấp 17/11/2026).
// Nội dung trích: Bảng 3 "Phân loại vết mổ và nguy cơ nhiễm khuẩn vết mổ"; mục 3.2.2 "Sử dụng kháng sinh dự phòng
// trong phẫu thuật"; Phụ lục 4 (bảng kiểm) phần "Sử dụng kháng sinh dự phòng".
// Hai văn bản không có bảng xếp loại cho từng phẫu thuật: giao diện chỉ hiển thị định nghĩa, người kê đơn tự xác định.

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
