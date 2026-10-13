/*
  FILE: data/antibiotics/empiric/catalog.ts

  Danh muc mat benh CHI GOM cac mat benh co lua chon khang sinh CU THE
  (ten thuoc + lieu) trong van ban BYT, hoac co module rieng co lieu. Cac mat benh khong
  co trong phac do BYT da duoc xoa (xem bao cao kiem toan).

  - ID giu nguyen dang v8-N (de khong mat lien ket status/groups/phac do);
    ID khong con lien tuc vi da xoa mat benh khong co phac do.
  - Chuyen khoa duoc chuan hoa theo chuyen nganh dieu tri; danh sach duoc
    sap xep A-Z (chuyen khoa roi ten benh) bang Intl.Collator("vi").
  - Luong (stream) khai bao ro rang khi khac "empiric".
*/

import type { Disease, Stream } from "./types";

const RAW_DISEASES: Disease[] = [
  { id: "v8-1", title: "Viêm phổi cộng đồng", specialty: "Hô hấp" },
  { id: "v8-2", title: "Nhiễm khuẩn tiết niệu phức tạp / ESBL", specialty: "Tiết niệu" },
  { id: "v8-3", title: "Nhiễm Candida huyết (candidemia)", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-4", title: "Viêm phổi bệnh viện", specialty: "Hô hấp" },
  { id: "v8-5", title: "Viêm phổi liên quan thở máy", specialty: "Hô hấp" },
  { id: "v8-6", title: "Đợt cấp COPD do vi khuẩn", specialty: "Hô hấp" },
  { id: "v8-7", title: "Viêm xoang cấp do vi khuẩn", specialty: "Tai Mũi Họng" },
  { id: "v8-8", title: "Viêm họng liên cầu", specialty: "Tai Mũi Họng" },
  { id: "v8-9", title: "Áp xe phổi", specialty: "Hô hấp" },
  { id: "v8-10", title: "Giãn phế quản bội nhiễm", specialty: "Hô hấp" },
  { id: "v8-11", title: "Sepsis chưa rõ nguồn", specialty: "Hồi sức tích cực" },
  { id: "v8-12", title: "Sốc nhiễm khuẩn", specialty: "Hồi sức tích cực" },
  { id: "v8-13", title: "Nhiễm khuẩn huyết do S. aureus", specialty: "Hồi sức tích cực" },
  { id: "v8-14", title: "Nhiễm khuẩn huyết do Gram âm", specialty: "Hồi sức tích cực" },
  { id: "v8-16", title: "Viêm bàng quang không biến chứng", specialty: "Tiết niệu" },
  { id: "v8-17", title: "Viêm thận bể thận", specialty: "Tiết niệu" },
  { id: "v8-21", title: "Viêm phúc mạc thứ phát", specialty: "Tiêu hóa – Gan mật" },
  { id: "v8-24", title: "Viêm đường mật cấp", specialty: "Tiêu hóa – Gan mật" },
  { id: "v8-25", title: "Nhiễm C. difficile", specialty: "Tiêu hóa – Gan mật" },
  { id: "v8-26", title: "Nhiễm khuẩn đường ruột xâm lấn", specialty: "Tiêu hóa – Gan mật" },
  { id: "v8-27", title: "Viêm mô tế bào không mủ", specialty: "Da – mô mềm" },
  { id: "v8-28", title: "Viêm mô tế bào có mủ / áp xe", specialty: "Da – mô mềm" },
  { id: "v8-32", title: "Viêm xương tủy", specialty: "Cơ xương khớp" },
  { id: "v8-33", title: "Viêm khớp nhiễm khuẩn", specialty: "Cơ xương khớp" },
  { id: "v8-36", title: "Viêm màng não vi khuẩn", specialty: "Thần kinh" },
  { id: "v8-38", title: "Nhiễm khuẩn dẫn lưu não thất", specialty: "Thần kinh" },
  { id: "v8-39", title: "Viêm nội tâm mạc nhiễm khuẩn", specialty: "Tim mạch" },
  { id: "v8-43", title: "Enterobacterales sinh ESBL", specialty: "Hồi sức tích cực", stream: "pathogen" },
  { id: "v8-46", title: "Pseudomonas aeruginosa DTR", specialty: "Hồi sức tích cực", stream: "pathogen" },
  { id: "v8-48", title: "Candida ổ bụng", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-50", title: "Aspergillus phổi xâm lấn", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-51", title: "Cryptococcus viêm màng não", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-52", title: "Mucormycosis", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-53", title: "Pneumocystis jirovecii pneumonia", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-54", title: "Viêm họng do liên cầu nhóm A", specialty: "Tai Mũi Họng" },
  { id: "v8-56", title: "Áp xe quanh amidan", specialty: "Tai Mũi Họng" },
  { id: "v8-57", title: "Áp xe sau họng", specialty: "Tai Mũi Họng" },
  { id: "v8-58", title: "Viêm xoang cấp do vi khuẩn ở người lớn", specialty: "Tai Mũi Họng" },
  { id: "v8-60", title: "Viêm tai giữa cấp", specialty: "Tai Mũi Họng" },
  { id: "v8-66", title: "Nhiễm khuẩn khoang cổ sâu", specialty: "Tai Mũi Họng" },
  { id: "v8-83", title: "Viêm kết mạc do vi khuẩn", specialty: "Mắt" },
  { id: "v8-84", title: "Viêm giác mạc do vi khuẩn", specialty: "Mắt" },
  { id: "v8-85", title: "Viêm nội nhãn sau phẫu thuật", specialty: "Mắt" },
  { id: "v8-87", title: "Viêm mô tế bào hốc mắt", specialty: "Mắt" },
  { id: "v8-88", title: "Viêm túi lệ cấp", specialty: "Mắt" },
  { id: "v8-92", title: "Nhiễm khuẩn hậu sản", specialty: "Sản phụ khoa" },
  { id: "v8-95", title: "Viêm âm đạo do vi khuẩn", specialty: "Sản phụ khoa" },
  { id: "v8-96", title: "Nhiễm Candida âm hộ–âm đạo", specialty: "Sản phụ khoa", stream: "antifungal" },
  { id: "v8-97", title: "Nhiễm khuẩn tiết niệu thai kỳ", specialty: "Sản phụ khoa" },
  { id: "v8-99", title: "Viêm tai giữa cấp ở trẻ em", specialty: "Tai Mũi Họng" },
  { id: "v8-101", title: "Viêm phổi cộng đồng ở trẻ em", specialty: "Hô hấp" },
  { id: "v8-102", title: "Viêm phổi sơ sinh", specialty: "Nhi khoa – Sơ sinh" },
  { id: "v8-103", title: "Nhiễm khuẩn huyết sơ sinh", specialty: "Nhi khoa – Sơ sinh" },
  { id: "v8-104", title: "Viêm màng não ở trẻ em", specialty: "Thần kinh" },
  { id: "v8-107", title: "Viêm mô tế bào ở trẻ em", specialty: "Da – mô mềm" },
  { id: "v8-113", title: "Sốt giảm bạch cầu trung tính", specialty: "Hồi sức tích cực" },
  { id: "v8-116", title: "Sốt giảm bạch cầu trung tính nguy cơ cao", specialty: "Huyết học" },
  { id: "v8-117", title: "Nhiễm nấm xâm lấn ở bệnh nhân huyết học", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-121", title: "Candidemia có giảm bạch cầu trung tính", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-122", title: "Candida nội tâm mạc", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-124", title: "Candida viêm xương khớp", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-126", title: "Aspergillosis xoang xâm lấn", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-128", title: "Cryptococcus ngoài thần kinh trung ương", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-129", title: "Nhiễm nấm Histoplasma", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-130", title: "Nhiễm nấm Talaromyces", specialty: "Nhiễm nấm xâm lấn", stream: "antifungal" },
  { id: "v8-135", title: "Thương hàn", specialty: "Truyền nhiễm" },
  { id: "v8-141", title: "Viêm màng não do lao", specialty: "Lao", stream: "tuberculosis" },
  { id: "v8-142", title: "Lao phổi", specialty: "Lao", stream: "tuberculosis" },
];

const collator = new Intl.Collator("vi", { sensitivity: "base", numeric: true });

export const DISEASES: Disease[] = [...RAW_DISEASES].sort(
  (a, b) =>
    collator.compare(a.specialty, b.specialty) ||
    collator.compare(a.title, b.title)
);

export const EXPECTED_CATALOG_COUNT = 68;

if (
  process.env.NODE_ENV !== "production" &&
  DISEASES.length !== EXPECTED_CATALOG_COUNT
) {
  console.warn(
    `[BV199] Danh muc co ${DISEASES.length} muc, ky vong ${EXPECTED_CATALOG_COUNT}.`
  );
}

export function normalize(value: string): string {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

/*
  Phan luong theo quy tac suy ra tu CHUYEN KHOA / TEN (khong phai nhan dinh lam sang).
  - Nhiem nam -> antifungal (tru muc co chu "Du phong" -> prophylaxis)
  - Lao -> tuberculosis
  - Dieu tri theo tac nhan -> pathogen
  - Ten co "Du phong" -> prophylaxis
*/
export function getStream(disease: Disease): Stream {
  if (disease.stream) return disease.stream;

  const title = normalize(disease.title);
  const specialty = normalize(disease.specialty);

  if (title.startsWith("du phong")) return "prophylaxis";
  if (specialty === "lao") return "tuberculosis";
  if (specialty.startsWith("nhiem nam")) return "antifungal";
  if (specialty === "dieu tri theo tac nhan") return "pathogen";

  return "empiric";
}

/*
  Nhom doi tuong suy ra tu chuyen khoa/ten. Chi gan khi co can cu ro rang;
  cac truong hop con lai de "Chua phan loai" cho den khi doi chieu nguon.
*/
export function getPopulationHint(disease: Disease): string {
  const title = normalize(disease.title);
  const specialty = normalize(disease.specialty);

  if (title.includes("so sinh")) return "Sơ sinh";
  if (specialty === "nhi khoa" || title.includes("tre em")) return "Trẻ em";
  if (title.includes("thai ky") || title.includes("hau san")) {
    return "Thai kỳ / hậu sản";
  }
  if (title.includes("nguoi lon")) return "Người lớn";

  return "Chưa phân loại (cần đối chiếu nguồn)";
}
