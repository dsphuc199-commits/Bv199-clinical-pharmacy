/*
 * Thuoc co trong danh muc thuoc (file Excel) nhung Duoc thu quoc gia Viet Nam 2023
 * KHONG co chuyen luan rieng -> KHONG nhap lieu / hieu chinh than vao ung dung.
 * Can tra cuu to thong tin san pham (SmPC/FDA) hoac huong dan chuyen khoa roi bo sung
 * vao renal-dosing.ts voi nguon va so trang cu the.
 */
export type RenalDosingGap = {
  name: string;
  reason: string;
  suggestion: string;
};

export const renalDosingGaps: RenalDosingGap[] = [
  {
    name: "Cefoperazon + sulbactam",
    reason:
      "Dược thư 2023 chỉ có chuyên luận Cefoperazon đơn chất; không có chuyên luận cho phối hợp với sulbactam.",
    suggestion:
      "Tra tờ thông tin sản phẩm của chế phẩm đang dùng (liều sulbactam tối đa 4 g/ngày; hiệu chỉnh theo CrCl).",
  },
  {
    name: "Amoxicilin + sulbactam",
    reason: "Dược thư 2023 không có chuyên luận.",
    suggestion: "Tra tờ thông tin sản phẩm của chế phẩm đang dùng.",
  },
  {
    name: "Ceftazidim + avibactam",
    reason:
      "Dược thư 2023 chỉ nhắc trong phần tổng quan nhóm cephalosporin, không có chuyên luận liều dùng.",
    suggestion: "Tra tờ thông tin sản phẩm / FDA / EMA (có bảng hiệu chỉnh theo CrCl).",
  },
  {
    name: "Ceftolozan + tazobactam",
    reason:
      "Dược thư 2023 chỉ nhắc trong phần tổng quan, không có chuyên luận liều dùng.",
    suggestion: "Tra tờ thông tin sản phẩm / FDA / EMA (có bảng hiệu chỉnh theo CrCl).",
  },
  {
    name: "Ceftizoxim",
    reason: "Dược thư 2023 chỉ liệt kê tên trong nhóm cephalosporin, không có chuyên luận.",
    suggestion: "Tra tờ thông tin sản phẩm của chế phẩm đang dùng.",
  },
  {
    name: "Sultamicillin",
    reason: "Dược thư 2023 không có chuyên luận.",
    suggestion: "Tra tờ thông tin sản phẩm của chế phẩm đang dùng.",
  },
  {
    name: "Caspofungin",
    reason: "Dược thư 2023 không có chuyên luận (chỉ nhắc trong bảng tương kỵ).",
    suggestion: "Tra tờ thông tin sản phẩm / hướng dẫn IDSA (không cần hiệu chỉnh theo thận; giảm liều khi suy gan trung bình).",
  },
  {
    name: "Anidulafungin",
    reason: "Dược thư 2023 không có chuyên luận.",
    suggestion: "Tra tờ thông tin sản phẩm / hướng dẫn IDSA.",
  },
];
