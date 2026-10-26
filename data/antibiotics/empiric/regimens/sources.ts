/*
  FILE: data/antibiotics/empiric/regimens/sources.ts

  Thong tin cac van ban BYT da dung. Cot "validity" ghi TRUNG THUC tinh trang
  da kiem tra: chua co van ban nao duoc doi chieu voi cong thong tin chinh thuc
  cua BYT/co so du lieu phap luat (khong truy cap duoc) nen KHONG khang dinh con hieu luc.
*/

import type { DocId, DocInfo } from "./types";

const UNVERIFIED =
  "Chưa xác minh hiệu lực trên cổng chính thức (không truy cập được). Nội dung được đọc từ bản PDF do người dùng cung cấp.";

export const DOCS: Record<DocId, DocInfo> = {
  byt708: {
    id: "byt708",
    title: "Hướng dẫn sử dụng kháng sinh",
    number: "708/QĐ-BYT",
    date: "02/03/2015",
    issuer: "Bộ Y tế",
    validity: `${UNVERIFIED} Văn bản đã trên 10 năm: đối chiếu hướng dẫn mới hơn (nếu có) và kháng sinh đồ tại chỗ.`,
  },
  byt5643: {
    id: "byt5643",
    title: "Hướng dẫn chẩn đoán và điều trị các bệnh Tai Mũi Họng",
    number: "5643/QĐ-BYT",
    date: "31/12/2015",
    issuer: "Bộ Y tế",
    validity: UNVERIFIED,
  },
  byt40: {
    id: "byt40",
    title: "Hướng dẫn chẩn đoán và điều trị các bệnh về mắt",
    number: "40/QĐ-BYT",
    date: "12/01/2015",
    issuer: "Bộ Y tế",
    validity: UNVERIFIED,
  },
  byt315: {
    id: "byt315",
    title: "Hướng dẫn chẩn đoán và điều trị các bệnh sản phụ khoa",
    number: "315/QĐ-BYT",
    date: "29/01/2015",
    issuer: "Bộ Y tế",
    validity: UNVERIFIED,
  },
  byt3879: {
    id: "byt3879",
    title: "Hướng dẫn chẩn đoán và điều trị các bệnh nội tiết – chuyển hóa",
    number: "3879/QĐ-BYT",
    date: "30/09/2014",
    issuer: "Bộ Y tế",
    validity: UNVERIFIED,
  },
  byt361: {
    id: "byt361",
    title: "Hướng dẫn chẩn đoán và điều trị các bệnh cơ xương khớp",
    number: "361/QĐ-BYT",
    date: "25/01/2014",
    issuer: "Bộ Y tế",
    validity: UNVERIFIED,
  },
  byt1493: {
    id: "byt1493",
    title: "Hướng dẫn chẩn đoán và xử trí hồi sức cấp cứu / hồi sức tích cực",
    number: "1493/QĐ-BYT",
    date: "22/04/2015",
    issuer: "Bộ Y tế",
    validity: `${UNVERIFIED} Số trang PDF lệch so với trang in; phác đồ ghi "tr. PDF N".`,
  },
  byt4416: {
    id: "byt4416",
    title: "Hướng dẫn chẩn đoán và điều trị các bệnh da liễu",
    number: "4416/QĐ-BYT",
    date: "06/12/2023",
    issuer: "Bộ Y tế",
    validity: UNVERIFIED,
  },
  byt2388: {
    id: "byt2388",
    title: "Hướng dẫn chẩn đoán và điều trị bệnh thận mạn và một số bệnh lý thận",
    number: "2388/QĐ-BYT",
    date: "12/08/2024",
    issuer: "Bộ Y tế",
    validity: `${UNVERIFIED} Đã đọc: không có phác đồ kháng sinh cho mặt bệnh nào trong danh mục.`,
  },
  byt3429: {
    id: "byt3429",
    title: "Hướng dẫn chẩn đoán và điều trị nhiễm nấm xâm lấn",
    number: "3429/QĐ-BYT",
    date: "14/07/2021",
    issuer: "Bộ Y tế",
    validity: UNVERIFIED,
  },
  byt162: {
    id: "byt162",
    title: "Hướng dẫn chẩn đoán, điều trị và dự phòng bệnh lao",
    number: "162/QĐ-BYT",
    date: "19/01/2024",
    issuer: "Bộ Y tế",
    validity:
      "Số hiệu và ngày ký (19/01/2024, thay thế QĐ 1314/QĐ-BYT ngày 24/03/2020) xác nhận ngày 25/10/2026 qua bản sao văn bản (hoatieu.vn, duytan.edu.vn) – chưa tìm thấy bản trên kcb.vn. Nội dung phác đồ trong ứng dụng đọc từ bản PDF do người dùng cung cấp (bản này để trống số/ngày), chưa đối chiếu với bản ký chính thức.",
  },
  byt5165: {
    id: "byt5165",
    title: "Hướng dẫn chẩn đoán và điều trị bệnh Lậu",
    number: "5165/QĐ-BYT",
    date: "09/11/2021",
    issuer: "Bộ Y tế",
    validity: UNVERIFIED,
  },
  byt5631: {
    id: "byt5631",
    title: "Hướng dẫn thực hiện quản lý sử dụng kháng sinh trong bệnh viện",
    number: "5631/QĐ-BYT",
    date: "31/12/2020",
    issuer: "Bộ Y tế",
    validity: `${UNVERIFIED} Tài liệu quản lý; không có phác đồ theo mặt bệnh.`,
  },
  byt1530: {
    id: "byt1530",
    title: "Hướng dẫn chẩn đoán và điều trị Loét bàn chân do đái tháo đường",
    number: "1530/QĐ-BYT",
    date: "24/03/2023",
    issuer: "Bộ Y tế",
    validity:
      "Bản PDF đăng trên kcb.vn (Cục Quản lý Khám, chữa bệnh), đọc ngày 25/10/2026; chữ ký số ngày 24/03/2023. Điều 2: áp dụng tại các cơ sở khám bệnh, chữa bệnh trong cả nước. Phụ lục 02 (tr. 32–33) chỉ nêu nhóm thuốc/tên thuốc, không nêu liều.",
  },
  byt2767: {
    id: "byt2767",
    title: "Hướng dẫn chẩn đoán và điều trị bệnh phổi tắc nghẽn mạn tính",
    number: "2767/QĐ-BYT",
    date: "04/07/2023",
    issuer: "Bộ Y tế",
    validity:
      "Bản PDF ký số đăng trên kcb.vn (Cục Quản lý Khám, chữa bệnh), đọc ngày 25/10/2026. Điều 3: hiệu lực từ ngày ký, thay thế QĐ 3874/QĐ-BYT (26/06/2018). Số trang in = số trang PDF – 1.",
  },
  byt5642: {
    id: "byt5642",
    title: "Hướng dẫn chẩn đoán và điều trị một số bệnh truyền nhiễm",
    number: "5642/QĐ-BYT",
    date: "31/12/2015",
    issuer: "Bộ Y tế",
    validity:
      "Bản PDF (NXB Y học 2016) đăng trên kcb.vn, đọc ngày 25/10/2026. Số trang in trùng số trang PDF.",
  },
  byt2147: {
    id: "byt2147",
    title: "Hướng dẫn chẩn đoán và điều trị viêm phổi mắc phải cộng đồng ở người lớn",
    number: "2147/QĐ-BYT",
    date: "15/07/2026",
    issuer: "Bộ Y tế",
    validity:
      "Đã xác minh trên kcb.vn (Cục Quản lý Khám, chữa bệnh – Bộ Y tế) ngày 25/10/2026: có hiệu lực từ 15/7/2026, thay thế QĐ 4815/QĐ-BYT (20/11/2020). Nội dung module được đối chiếu với bản PDF do người dùng cung cấp; chưa đối chiếu từng trang với bản PDF đăng trên kcb.vn.",
  },
};
