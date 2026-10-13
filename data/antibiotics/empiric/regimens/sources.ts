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
    number: "162/QĐ-BYT (theo tên tệp do người dùng cung cấp)",
    date: "2024 (bản PDF để trống số và ngày ban hành)",
    issuer: "Bộ Y tế",
    validity: `${UNVERIFIED} Bản PDF cung cấp ghi "Số: /QĐ-BYT, ngày tháng năm 2024" (dự thảo/chưa điền): cần đối chiếu số hiệu và ngày ban hành chính thức.`,
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
  byt2147: {
    id: "byt2147",
    title: "Hướng dẫn chẩn đoán và điều trị viêm phổi mắc phải cộng đồng ở người lớn",
    number: "2147/QĐ-BYT",
    date: "15/07/2026",
    issuer: "Bộ Y tế",
    validity: `${UNVERIFIED} Theo nội dung bản PDF, thay thế QĐ 4815/QĐ-BYT (20/11/2020).`,
  },
};
