/*
  FILE: data/antibiotics/empiric/status.ts

  Trang thai du lieu cua tung mat benh. Mac dinh = 0 (chua tra cuu nguon).
  Chi liet ke cac mat benh da co module. TUYET DOI khong dat 5 neu chua co
  ho so tham dinh cua BV199.
*/

import type { DiseaseStatusEntry } from "./types";

export const DISEASE_STATUS: Record<string, DiseaseStatusEntry> = {
  "v8-1": {
    status: 2,
    sourceLabel: "BYT",
    note:
      "Module CapByt2026 đã đối chiếu với bản PDF do người dùng cung cấp (QĐ 2147/QĐ-BYT 15/7/2026, thay QĐ 4815/QĐ-BYT 20/11/2020) ngày 13/10/2026. Hiệu lực QĐ 2147 đã xác minh trên kcb.vn ngày 25/10/2026; chưa đối chiếu từng trang với bản PDF chính thức. Phương án CAP nặng của QĐ 1493/2015 đã ẩn. Chưa có thẩm định BV199.",
  },
  "v8-4": {
    status: 2,
    sourceLabel: "HOI_CHUYEN_NGANH_VN",
    note:
      "Module HapVap2023 (Bảng 3.1, tr. 53–56) đã đối chiếu với bản PDF do người dùng cung cấp ngày 13/10/2026. Chưa kiểm tra nguồn chính thức; chưa có thẩm định BV199.",
  },
  "v8-5": {
    status: 2,
    sourceLabel: "HOI_CHUYEN_NGANH_VN",
    note:
      "Module HapVap2023 (Bảng 3.2, tr. 60–62) đã đối chiếu với bản PDF do người dùng cung cấp ngày 13/10/2026. Chưa kiểm tra nguồn chính thức; chưa có thẩm định BV199.",
  },
  "v8-46": {
    status: 2,
    sourceLabel: "QUOC_TE",
    note:
      "Phác đồ BYT (QĐ 708, Bảng II.10) chỉ dành cho P. aeruginosa còn nhạy thuốc. Nội dung DTR lấy từ IDSA AMR Guidance 2026 (Section 4, Table 1 v5.0), đọc trên idsociety.org ngày 25/10/2026. Chưa đối chiếu danh mục thuốc BV199; chưa có thẩm định BV199.",
  },
  "v8-7": {
    status: 2,
    sourceLabel: "QUOC_TE",
    note:
      "Module AbrsUpToDate2026 (UpToDate Graphic 106156, v16.0) chỉ cho ngoại trú, không biến chứng. Nội trú chưa có phác đồ.",
  },
  "v8-58": {
    status: 2,
    sourceLabel: "QUOC_TE",
    note:
      "Module AbrsUpToDate2026 (UpToDate Graphic 106156, v16.0) chỉ cho ngoại trú, không biến chứng. Nội trú chưa có phác đồ.",
  },
};

/* Cac mat benh Tai Mui Hong thuoc module EntEmpiricGuidelines (nhan dien luc chay). */
export const ENT_MODULE_STATUS: DiseaseStatusEntry = {
  status: 2,
  sourceLabel: "CHUA_XAC_DINH",
  note:
    "Module EntEmpiricGuidelines. Liều viêm họng liên cầu (CDC cập nhật 18/11/2025) và viêm tai giữa cấp trẻ em (NICE NG91) đã đối chiếu 13/10/2026. QĐ 5643/QĐ-BYT (31/12/2015) tồn tại nhưng chưa đọc được nội dung và chưa xác minh hiệu lực; nhiều nhánh vẫn cần thẩm định, chưa có liều.",
};

/*
  Mat benh co phac do BYT trong thu vien regimens/ (khong thuoc module rieng).
  Muc 2: nguon BYT da doc tu ban PDF nguoi dung cung cap, CHUA xac minh hieu luc tren
  cong chinh thuc va CHUA tham dinh BV199. Khong duoc tu nang len 5.
*/
export const BYT_REGIMEN_STATUS: DiseaseStatusEntry = {
  status: 2,
  sourceLabel: "BYT",
  note:
    "Phác đồ trích từ văn bản BYT (bản PDF do người dùng cung cấp), có ghi quyết định, mục/bảng và trang. Chưa xác minh hiệu lực trên cổng chính thức; chưa có thẩm định BV199. Các nhánh gắn cờ cần đối chiếu bản gốc.",
};

export const DEFAULT_STATUS: DiseaseStatusEntry = {
  status: 0,
  sourceLabel: "CHUA_XAC_DINH",
  note: "Chưa tra cứu tài liệu nguồn cho mặt bệnh này.",
};
