/* Cấu hình module Kháng sinh điều trị nhiễm khuẩn tiết niệu. */
export const UTI_CONFIG = {
  sources: [
    "Bộ Y tế. Quyết định 708/QĐ-BYT ngày 02/03/2015 – Hướng dẫn sử dụng kháng sinh, Chương X: Viêm thận bể thận cấp",
    "Bộ Y tế. Quyết định 708/QĐ-BYT ngày 02/03/2015 – Hướng dẫn sử dụng kháng sinh, Chương X: Sỏi thận tiết niệu nhiễm trùng",
    "Bộ Y tế. Quyết định 708/QĐ-BYT ngày 02/03/2015 – Hướng dẫn sử dụng kháng sinh, Chương X: Viêm niệu đạo cấp không do lậu",
    "Bộ Y tế. Quyết định 708/QĐ-BYT ngày 02/03/2015 – Hướng dẫn sử dụng kháng sinh, Chương X: Viêm bàng quang cấp",
  ],
  /* Hiệp hội chuyên ngành có trong tài liệu tham khảo của Chương X. */
  citedSources: [
    "Hội Thận học Việt Nam. Hướng dẫn điều trị nhiễm khuẩn đường tiết niệu ở Việt Nam (2013)",
    "European Association of Urology. Grabe M., Bjerklund-Johansen T.E., Botto H. et al. Guidelines on Urological Infections (2012)",
  ],
  effectiveStatus: "Cần xác minh hiệu lực hiện hành",
  disclaimer: "Công cụ hỗ trợ tham khảo. Quyết định điều trị thuộc về bác sĩ, cần cá thể hóa theo chức năng thận, dị ứng, tương tác, tình hình kháng thuốc tại cơ sở.",
} as const;

export const TIER_LABEL = {
  "first-line": "Lựa chọn đầu tay",
  alternative: "Thay thế",
  "culture-guided": "Theo kháng sinh đồ",
  adjunct: "Phối hợp",
} as const;
