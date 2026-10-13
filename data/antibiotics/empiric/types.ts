/*
  FILE: data/antibiotics/empiric/types.ts
  Kieu du lieu dung chung cho trang Dieu tri khang sinh kinh nghiem.
*/

export type Disease = {
  id: string;
  title: string;
  specialty: string;
};

/*
  Trang thai du lieu.
  0 la trang thai noi bo them vao: chua tra cuu (khong thuoc 5 trang thai chuan).
  1-5 theo prompt chuan. KHONG tu chuyen sang 5.
*/
export type DataStatus = 0 | 1 | 2 | 3 | 4 | 5;

export const DATA_STATUS_LABEL: Record<DataStatus, string> = {
  0: "Chưa tra cứu nguồn",
  1: "Chưa tìm thấy nguồn chuyên biệt",
  2: "Có nguồn liên quan, chưa xác minh toàn văn hoặc hiệu lực",
  3: "Đã xác minh nguồn, chưa hoàn thành trích xuất phác đồ",
  4: "Đã trích xuất và kiểm tra phác đồ, liều, điều kiện với nguồn",
  5: "Đã được bộ phận chuyên môn BV199 thẩm định, phê duyệt",
};

export type SourceLabel =
  | "BYT"
  | "HOI_CHUYEN_NGANH_VN"
  | "QUOC_TE"
  | "BV199_APPROVED"
  | "CHUA_XAC_DINH";

export const SOURCE_LABEL_TEXT: Record<SourceLabel, string> = {
  BYT: "Bộ Y tế Việt Nam",
  HOI_CHUYEN_NGANH_VN: "Hướng dẫn hội chuyên ngành Việt Nam",
  QUOC_TE: "Guideline / tài liệu quốc tế",
  BV199_APPROVED: "Phác đồ BV199 đã phê duyệt",
  CHUA_XAC_DINH: "Chưa xác định nguồn",
};

export type Stream =
  | "empiric"
  | "antifungal"
  | "tuberculosis"
  | "pathogen"
  | "prophylaxis";

export const STREAM_TEXT: Record<Stream, string> = {
  empiric: "Kháng sinh kinh nghiệm theo bệnh",
  antifungal: "Điều trị kháng nấm",
  tuberculosis: "Điều trị lao",
  pathogen: "Điều trị theo tác nhân",
  prophylaxis: "Dự phòng nhiễm khuẩn",
};

export type LinkType = "duplicate-candidate" | "related";

export type CanonicalGroup = {
  code: string;
  name: string;
  type: LinkType;
  ids: string[];
  note: string;
};

export type DiseaseStatusEntry = {
  status: DataStatus;
  sourceLabel: SourceLabel;
  note: string;
};
