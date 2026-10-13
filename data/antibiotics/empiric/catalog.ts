/*
  FILE: data/antibiotics/empiric/catalog.ts

  Danh muc 144 mat benh. Noi dung RAW_DISEASES duoc trich NGUYEN VAN tu
  page.tsx hien hanh (khong viet lai tu tri nho). ID van la v8-<so thu tu dong>.

  QUAN TRONG: KHONG chen, xoa hoac doi thu tu dong, vi ID phu thuoc vi tri dong.
  Muon them benh moi: chi them vao CUOI danh sach.
*/

import type { Disease, Stream } from "./types";

const RAW_DISEASES = `
Viêm phổi cộng đồng|Hô hấp
Nhiễm khuẩn tiết niệu phức tạp / ESBL|Tiết niệu
Nhiễm Candida huyết (candidemia)|Nhiễm nấm
Viêm phổi bệnh viện|Hô hấp
Viêm phổi liên quan thở máy|Hô hấp
Đợt cấp COPD do vi khuẩn|Hô hấp
Viêm xoang cấp do vi khuẩn|Tai Mũi Họng
Viêm họng liên cầu|Tai Mũi Họng
Áp xe phổi|Hô hấp
Giãn phế quản bội nhiễm|Hô hấp
Sepsis chưa rõ nguồn|Hồi sức tích cực
Sốc nhiễm khuẩn|Hồi sức tích cực
Nhiễm khuẩn huyết do S. aureus|Hồi sức tích cực
Nhiễm khuẩn huyết do Gram âm|Hồi sức tích cực
Nhiễm khuẩn liên quan catheter|Hồi sức tích cực
Viêm bàng quang không biến chứng|Tiết niệu
Viêm thận bể thận|Tiết niệu
Viêm tuyến tiền liệt cấp|Tiết niệu
Nhiễm khuẩn tiết niệu liên quan sonde|Tiết niệu
Viêm ruột thừa phức tạp|Ngoại tổng hợp – Tiêu hóa
Viêm phúc mạc thứ phát|Ngoại tổng hợp – Tiêu hóa
Áp xe ổ bụng|Ngoại tổng hợp – Tiêu hóa
Viêm túi mật cấp|Ngoại tổng hợp – Tiêu hóa
Viêm đường mật cấp|Ngoại tổng hợp – Tiêu hóa
Nhiễm C. difficile|Tiêu hóa
Nhiễm khuẩn đường ruột xâm lấn|Tiêu hóa
Viêm mô tế bào không mủ|Da – mô mềm
Viêm mô tế bào có mủ / áp xe|Da – mô mềm
Nhiễm khuẩn da mô mềm hoại tử|Ngoại chấn thương
Nhiễm khuẩn bàn chân đái tháo đường|Nội tiết – Ngoại chấn thương
Nhiễm khuẩn vết mổ|Ngoại tổng hợp
Viêm xương tủy|Cơ xương khớp
Viêm khớp nhiễm khuẩn|Cơ xương khớp
Nhiễm khuẩn khớp nhân tạo|Ngoại chấn thương
Nhiễm khuẩn cột sống|Cơ xương khớp
Viêm màng não vi khuẩn|Thần kinh
Áp xe não|Thần kinh
Nhiễm khuẩn dẫn lưu não thất|Thần kinh
Viêm nội tâm mạc nhiễm khuẩn|Tim mạch
Nhiễm khuẩn thiết bị tim mạch|Tim mạch
MRSA|Điều trị theo tác nhân
VRE|Điều trị theo tác nhân
Enterobacterales sinh ESBL|Điều trị theo tác nhân
Enterobacterales kháng carbapenem CRE|Điều trị theo tác nhân
Acinetobacter baumannii kháng carbapenem|Điều trị theo tác nhân
Pseudomonas aeruginosa DTR|Điều trị theo tác nhân
Stenotrophomonas maltophilia|Điều trị theo tác nhân
Candida ổ bụng|Nhiễm nấm
Candida tiết niệu|Nhiễm nấm
Aspergillus phổi xâm lấn|Nhiễm nấm
Cryptococcus viêm màng não|Nhiễm nấm
Mucormycosis|Nhiễm nấm
Pneumocystis jirovecii pneumonia|Nhiễm nấm
Viêm họng do liên cầu nhóm A|Tai Mũi Họng
Viêm amidan cấp do vi khuẩn|Tai Mũi Họng
Áp xe quanh amidan|Tai Mũi Họng
Áp xe sau họng|Tai Mũi Họng
Viêm xoang cấp do vi khuẩn ở người lớn|Tai Mũi Họng
Viêm xoang mạn đợt cấp nghi nhiễm khuẩn|Tai Mũi Họng
Viêm tai giữa cấp|Tai Mũi Họng
Viêm tai ngoài cấp|Tai Mũi Họng
Viêm tai ngoài ác tính|Tai Mũi Họng
Viêm xương chũm|Tai Mũi Họng
Viêm thanh thiệt cấp|Tai Mũi Họng
Viêm tuyến nước bọt cấp sinh mủ|Tai Mũi Họng
Nhiễm khuẩn khoang cổ sâu|Tai Mũi Họng
Viêm tai giữa mạn chảy mủ|Tai Mũi Họng
Nhiễm khuẩn bàn chân đái tháo đường không biến chứng|Nội tiết
Nhiễm khuẩn bàn chân đái tháo đường mức độ trung bình/nặng|Nội tiết
Viêm xương tủy liên quan bàn chân đái tháo đường|Nội tiết
Nhiễm khuẩn ở người bệnh đái tháo đường có DKA/HHS|Nội tiết
Nhiễm Candida âm hộ–âm đạo ở người bệnh đái tháo đường|Nhiễm nấm
Nhiễm khuẩn tiết niệu ở người bệnh đái tháo đường|Nội tiết
Viêm tuyến giáp cấp sinh mủ|Nội tiết
Nhiễm nấm xâm lấn ở người bệnh suy giảm miễn dịch do bệnh nội tiết|Nhiễm nấm
Áp xe quanh chóp răng|Răng Hàm Mặt
Nhiễm khuẩn răng lan tỏa|Răng Hàm Mặt
Viêm mô tế bào vùng hàm mặt|Răng Hàm Mặt
Viêm quanh thân răng|Răng Hàm Mặt
Viêm xương hàm|Răng Hàm Mặt
Nhiễm khuẩn vùng sàn miệng (Ludwig)|Răng Hàm Mặt
Viêm xoang do răng|Răng Hàm Mặt
Viêm kết mạc do vi khuẩn|Mắt
Viêm giác mạc do vi khuẩn|Mắt
Viêm nội nhãn sau phẫu thuật|Mắt
Viêm mô tế bào trước vách hốc mắt|Mắt
Viêm mô tế bào hốc mắt|Mắt
Viêm túi lệ cấp|Mắt
Nhiễm nấm giác mạc|Nhiễm nấm
Viêm vùng chậu|Sản phụ khoa
Viêm nội mạc tử cung hậu sản|Sản phụ khoa
Nhiễm khuẩn hậu sản|Sản phụ khoa
Viêm màng ối|Sản phụ khoa
Áp xe phần phụ|Sản phụ khoa
Viêm âm đạo do vi khuẩn|Sản phụ khoa
Nhiễm Candida âm hộ–âm đạo|Nhiễm nấm
Nhiễm khuẩn tiết niệu thai kỳ|Sản phụ khoa
Viêm tuyến Bartholin|Sản phụ khoa
Viêm tai giữa cấp ở trẻ em|Nhi khoa
Viêm xoang cấp ở trẻ em|Nhi khoa
Viêm phổi cộng đồng ở trẻ em|Nhi khoa
Viêm phổi sơ sinh|Nhi khoa
Nhiễm khuẩn huyết sơ sinh|Nhi khoa
Viêm màng não ở trẻ em|Nhi khoa
Nhiễm khuẩn tiết niệu ở trẻ em|Nhi khoa
Viêm xương tủy ở trẻ em|Nhi khoa
Viêm mô tế bào ở trẻ em|Nhi khoa
Nhiễm khuẩn huyết liên quan catheter trung tâm|Hồi sức tích cực
Nhiễm khuẩn tiết niệu liên quan ống thông|Hồi sức tích cực
Nhiễm khuẩn vị trí mở khí quản|Hồi sức tích cực
Nhiễm khuẩn liên quan ECMO|Hồi sức tích cực
Nhiễm khuẩn thiết bị cấy ghép|Hồi sức tích cực
Sốt giảm bạch cầu trung tính|Hồi sức tích cực
Nhiễm khuẩn sau ghép tạng|Miễn dịch – Ghép tạng
Sốt giảm bạch cầu trung tính nguy cơ thấp|Huyết học
Sốt giảm bạch cầu trung tính nguy cơ cao|Huyết học
Nhiễm nấm xâm lấn ở bệnh nhân huyết học|Nhiễm nấm
Dự phòng Pneumocystis ở người suy giảm miễn dịch|Nhiễm nấm
Nhiễm trùng cơ hội ở người HIV|Truyền nhiễm
Nhiễm khuẩn trên người dùng corticosteroid kéo dài|Truyền nhiễm
Candidemia có giảm bạch cầu trung tính|Nhiễm nấm
Candida nội tâm mạc|Nhiễm nấm
Candida viêm nội nhãn|Nhiễm nấm
Candida viêm xương khớp|Nhiễm nấm
Candida đường tiết niệu có triệu chứng|Nhiễm nấm
Aspergillosis xoang xâm lấn|Nhiễm nấm
Aspergillosis phổi mạn tính|Nhiễm nấm
Cryptococcus ngoài thần kinh trung ương|Nhiễm nấm
Nhiễm nấm Histoplasma|Nhiễm nấm
Nhiễm nấm Talaromyces|Nhiễm nấm
Nhiễm nấm Fusarium|Nhiễm nấm
Uốn ván|Truyền nhiễm
Bạch hầu|Truyền nhiễm
Ho gà|Truyền nhiễm
Thương hàn|Truyền nhiễm
Nhiễm Leptospira|Truyền nhiễm
Nhiễm Rickettsia|Truyền nhiễm
Sốt mò|Truyền nhiễm
Nhiễm khuẩn sau vết cắn động vật|Truyền nhiễm
Nhiễm khuẩn sau phơi nhiễm nước biển|Truyền nhiễm
Viêm màng não do lao|Lao
Lao phổi|Lao
Nhiễm khuẩn cơ hội do Nocardia|Truyền nhiễm
Nhiễm trùng đường mật ở người ghép gan|Miễn dịch – Ghép tạng
`;

export const EXPECTED_CATALOG_COUNT = 144;

export const DISEASES: Disease[] = RAW_DISEASES.trim()
  .split("\n")
  .map((line, index) => {
    const [title, specialty] = line.trim().split("|");

    return {
      id: `v8-${index + 1}`,
      title: title.trim(),
      specialty: specialty.trim(),
    };
  });

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
  const title = normalize(disease.title);
  const specialty = normalize(disease.specialty);

  if (title.startsWith("du phong")) return "prophylaxis";
  if (specialty === "lao") return "tuberculosis";
  if (specialty === "nhiem nam") return "antifungal";
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
