/*
  FILE: data/antibiotics/empiric/overviews.ts

  Tang 1 (Tong quan quyet dinh) + Tang 4 (Theo doi, an toan) cho template DiseaseOverview.
  Moi y co `ref` (vi tri nguon) – KHONG hien inline, chi hien trong "Nguồn và căn cứ".
  Chi soan cho mat benh da doi chieu nguyen van; mat benh moi them vao day se tu dong
  dung chung template. Khong chua lieu (lieu nam o phac do), khong chua bang hieu chinh
  lieu/tuong tac (module rieng).
*/

import { OVERVIEWS_708 } from "./overviews-708";
import { OVERVIEWS_OTHER } from "./overviews-other";
import { OVERVIEWS_MODULES } from "./overviews-modules";

export type Point = { text: string; ref: string };

export type DiseaseOverviewData = {
  docLabel: string;
  /** 3–4 the tom tat. */
  cards: { label: string; points: Point[] }[];
  sourceControl: Point[];
  monitoring: { efficacy: Point[]; reassessment: Point[]; safety: Point[] };
};

const Q = "QĐ 708/QĐ-BYT (02/03/2015)";

export const DISEASE_OVERVIEWS: Record<string, DiseaseOverviewData> = {
  "v8-33": {
    docLabel: `${Q} – Chương 6, Viêm khớp nhiễm khuẩn`,
    cards: [
      { label: "Tác nhân thường gặp", points: [
        { text: "Không do lậu cầu: tụ cầu vàng 50–70%, liên cầu khoảng 20%, Gram âm 15–20%.", ref: "tr. 162" },
        { text: "Lậu cầu: 70–75% ở người lớn dưới 40 tuổi.", ref: "tr. 162" },
      ] },
      { label: "Trước kháng sinh", points: [
        { text: "Cấy máu, cấy dịch khớp, soi tươi và nhuộm Gram.", ref: "tr. 163" },
        { text: "Chẩn đoán xác định: dịch khớp mủ hoặc cấy dương tính, kèm lâm sàng hoặc X-quang điển hình.", ref: "tr. 163" },
      ] },
      { label: "Khởi trị", points: [
        { text: "Chọn theo nhuộm Gram, tuổi, đường lây và dịch tễ kháng thuốc.", ref: "tr. 163" },
        { text: "Ít nhất một kháng sinh đường tĩnh mạch.", ref: "tr. 163" },
      ] },
      { label: "Thời gian", points: [
        { text: "Thường 4–6 tuần; khác nhau theo tác nhân (xem từng phác đồ).", ref: "tr. 163–164" },
        { text: "Lậu cầu: 7 ngày.", ref: "tr. 164–165" },
      ] },
    ],
    sourceControl: [
      { text: "Hút, dẫn lưu mủ khớp và bất động khớp.", ref: "tr. 163, 165" },
      { text: "Nội soi rửa khớp khi thất bại sau 5–7 ngày điều trị đúng thuốc, hoặc mủ đặc, có vách.", ref: "tr. 165" },
      { text: "Phẫu thuật mở khớp: nhiễm khuẩn phần mềm, sụn hoặc xương lân cận; khớp sâu (khớp háng); khớp háng ở trẻ em.", ref: "tr. 165" },
      { text: "Khớp nhân tạo: thường phải lấy bỏ khớp, kháng sinh tĩnh mạch ít nhất 4–6 tuần.", ref: "tr. 165" },
    ],
    monitoring: {
      efficacy: [
        { text: "Đáp ứng lâm sàng tại khớp và toàn thân; bạch cầu, tốc độ máu lắng, CRP.", ref: "tr. 163" },
        { text: "Kết quả cấy máu, dịch khớp và kháng sinh đồ.", ref: "tr. 163–164" },
      ],
      reassessment: [
        { text: "Có kháng sinh đồ: chuyển sang phác đồ đúng tác nhân, hoặc giữ phác đồ ban đầu nếu đáp ứng tốt.", ref: "tr. 164" },
        { text: "Sau 5–7 ngày không cải thiện: đánh giá lại kiểm soát ổ nhiễm.", ref: "tr. 165" },
      ],
      safety: [
        { text: "Aminoglycosid, vancomycin: theo dõi creatinin máu 2 lần/tuần; độc tính tai và thận tăng ở người cao tuổi, suy thận.", ref: "tr. 22, 25, 70" },
        { text: "Beta-lactam: khai thác tiền sử dị ứng, sẵn sàng xử trí phản vệ.", ref: "tr. 21, 43" },
        { text: "Daptomycin: theo dõi CK. Clindamycin: tiêu chảy do C. difficile. Fluoroquinolon: viêm, đứt gân.", ref: "tr. 24, 26" },
        { text: "Liều trong chương là liều cố định người lớn; không áp dụng cho trẻ em.", ref: "tr. 164–165" },
      ],
    },
  },
  "v8-32": {
    docLabel: `${Q} – Chương 6, Viêm xương tủy nhiễm khuẩn`,
    cards: [
      { label: "Tác nhân thường gặp", points: [
        { text: "Tụ cầu vàng hàng đầu; liên cầu nhóm B, Pseudomonas, E. coli và trực khuẩn đường ruột.", ref: "tr. 166" },
        { text: "Sau đóng đinh nội tủy: thường nhiễm nhiều vi khuẩn.", ref: "tr. 168" },
      ] },
      { label: "Trước kháng sinh", points: [
        { text: "Cấy máu hoặc mô xương; cấy cả môi trường kỵ khí.", ref: "tr. 167" },
        { text: "Sinh thiết mô xương là tiêu chuẩn vàng. X-quang bình thường không loại trừ.", ref: "tr. 167" },
      ] },
      { label: "Khởi trị", points: [
        { text: "Kháng sinh liều cao, đường tĩnh mạch, phối hợp; hướng tụ cầu vàng.", ref: "tr. 167" },
        { text: "Mạn tính hoặc trên nền đái tháo đường: điều trị theo vi khuẩn học và kháng sinh đồ.", ref: "tr. 168" },
      ] },
      { label: "Thời gian", points: [
        { text: "Ít nhất 6 tuần (nguyên tắc chung).", ref: "tr. 167" },
        { text: "Pseudomonas: phối hợp tĩnh mạch khoảng 2 tuần rồi chuyển uống; Gram âm đường ruột: 3–4 tuần.", ref: "tr. 168" },
      ] },
    ],
    sourceControl: [
      { text: "Rạch rộng tháo mủ, loại bỏ hoại tử, đục xương đến xương lành.", ref: "tr. 168" },
      { text: "Tháo bỏ vật cấy ghép; cắt cụt chi khi cần ngăn nhiễm khuẩn lan rộng.", ref: "tr. 167–168" },
      { text: "Lấp đầy ổ khuyết xương; có thể dùng kháng sinh tại chỗ.", ref: "tr. 168" },
      { text: "Bất động (bó bột) với viêm xương tủy cấp; bảo đảm dinh dưỡng.", ref: "tr. 168" },
    ],
    monitoring: {
      efficacy: [
        { text: "Đáp ứng lâm sàng; bạch cầu, tốc độ máu lắng, CRP.", ref: "tr. 167" },
        { text: "Kết quả cấy và kháng sinh đồ.", ref: "tr. 167" },
      ],
      reassessment: [
        { text: "Giai đoạn sau: điều chỉnh theo đáp ứng lâm sàng và kháng sinh đồ.", ref: "tr. 168" },
        { text: "Điều trị chậm hoặc không đủ dễ chuyển mạn tính, rất khó điều trị dứt.", ref: "tr. 168" },
      ],
      safety: [
        { text: "Aminoglycosid, vancomycin: theo dõi creatinin máu 2 lần/tuần.", ref: "tr. 22, 25, 70" },
        { text: "Linezolid: ức chế tủy xương tăng theo độ dài đợt – theo dõi công thức máu.", ref: "tr. 28" },
        { text: "Daptomycin: theo dõi CK. Rifampicin: không dùng đơn độc.", ref: "tr. 26, 30" },
        { text: "Beta-lactam: khai thác tiền sử dị ứng, sẵn sàng xử trí phản vệ.", ref: "tr. 21, 43" },
      ],
    },
  },
};

export function getDiseaseOverview(diseaseId: string): DiseaseOverviewData | undefined {
  // Module rieng (CAP, HAP, VAP, COPD) uu tien: tong quan cung nguon voi phac do dang hien thi.
  return OVERVIEWS_MODULES[diseaseId] ?? DISEASE_OVERVIEWS[diseaseId] ?? OVERVIEWS_708[diseaseId] ?? OVERVIEWS_OTHER[diseaseId];
}
