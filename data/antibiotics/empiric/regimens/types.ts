/*
  FILE: data/antibiotics/empiric/regimens/types.ts

  Kieu du lieu cho phac do khang sinh kinh nghiem trich tu van ban BYT.
  Moi phac do = MOT phuong an (cac thuoc dung cung nhau). Cac phuong an
  thay the nhau (A hoac B) duoc tach thanh cac phac do rieng trong cung
  mot tinh huong (scenario).

  Lieu va thoi gian luu NGUYEN VAN theo van ban nguon (dang chuoi),
  khong tu quy doi don vi, khong tu tinh lai.
*/

export type DocId =
  | "byt708"
  | "byt5643"
  | "byt40"
  | "byt315"
  | "byt3879"
  | "byt361"
  | "byt1493"
  | "byt4416"
  | "byt2388"
  | "byt3429"
  | "byt162"
  | "byt5165"
  | "byt5631"
  | "byt2147";

export type RegimenRole =
  | "first" // uu tien / dau tay
  | "alternative" // thay the
  | "severe" // nang / ICU
  | "allergy" // di ung
  | "pathogen" // theo tac nhan nghi ngo
  | "adjunct"; // ho tro / dung kem

export const ROLE_TEXT: Record<RegimenRole, string> = {
  first: "Ưu tiên",
  alternative: "Thay thế",
  severe: "Nặng / nguy cơ cao",
  allergy: "Dị ứng",
  pathogen: "Theo tác nhân nghi ngờ",
  adjunct: "Điều trị kèm theo",
};

export type DrugItem = {
  name: string;
  /** Liều / đường dùng / khoảng cách liều, nguyên văn theo nguồn. */
  dose: string;
};

export type SourceRef = {
  doc: DocId;
  /** Mục/bảng trong văn bản. */
  section: string;
  /** Số trang in của văn bản (hoặc trang PDF nếu ghi rõ). */
  page: string;
};

export type Regimen = {
  id: string;
  /** ID mặt bệnh trong catalog (v8-N). */
  diseaseIds: string[];
  /** Tình huống áp dụng (theo nguồn). */
  scenario: string;
  role: RegimenRole;
  /** Các thuốc dùng CÙNG NHAU trong phương án này. */
  drugs: DrugItem[];
  duration?: string;
  notes?: string[];
  source: SourceRef;
};

export type DocInfo = {
  id: DocId;
  title: string;
  number: string;
  date: string;
  issuer: string;
  /** Tình trạng hiệu lực đã kiểm tra. */
  validity: string;
};
