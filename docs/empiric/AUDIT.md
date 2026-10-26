# Kiểm toán module Kháng sinh kinh nghiệm

Sinh tự động bằng `npm run audit:empiric` ngày 2026-10-26 từ dữ liệu trong mã nguồn. Không chỉnh tay.

## Tổng quan

| Chỉ số | Giá trị |
|---|---|
| Mặt bệnh | 69 |
| VERIFIED_SOURCE / NEEDS_REVIEW / MISSING_EVIDENCE | 39 / 29 / 1 |
| APPROVED_FOR_CLINICAL_USE | 0 |
| Phương án BYT gốc (toàn bộ) | 300 |
| Phương án đang hiển thị (không tính bị thay thế) | 270 |
| Có liều nguyên văn trong văn bản | 226 |
| Có liều bổ sung có dẫn nguồn (cùng văn bản / quốc tế) | 9 |
| MISSING_DOSE_EVIDENCE (không đề xuất liều) | 35 |
| Phương án khóa đề xuất tự động | 12 |
| Mặt bệnh đã rà soát quốc tế (có mục) / có guideline quốc tế | 37 / 36 |
| Guideline quốc tế đã đăng ký | 28 |
| Độ phủ trung bình | 13.5 / 20 mục |

## Độ phủ theo mục

| Mục | ✓ | ◐ | • | – |
|---|---|---|---|---|
| Tên bệnh / ICD-10 | 55 | 14 | 0 | 0 |
| Chuyên khoa | 69 | 0 | 0 | 0 |
| Đối tượng | 69 | 0 | 0 | 0 |
| Tiêu chuẩn chẩn đoán liên quan kháng sinh | 0 | 0 | 25 | 44 |
| Phân tầng mức độ | 6 | 19 | 0 | 44 |
| Tác nhân thường gặp | 0 | 0 | 41 | 28 |
| Yếu tố nguy cơ kháng thuốc | 23 | 0 | 8 | 38 |
| Điều kiện cần dùng kháng sinh | 0 | 0 | 8 | 61 |
| Phác đồ kinh nghiệm | 69 | 0 | 0 | 0 |
| Thuốc ưu tiên | 68 | 0 | 0 | 1 |
| Thuốc thay thế | 40 | 0 | 0 | 29 |
| Dị ứng / tình huống đặc biệt | 33 | 0 | 0 | 36 |
| Liều / số lần / đường dùng | 46 | 16 | 0 | 7 |
| Liều nạp | 0 | 0 | 15 | 54 |
| Thời gian điều trị | 23 | 23 | 0 | 23 |
| Hiệu chỉnh liều và cảnh báo | 67 | 0 | 0 | 2 |
| Tiêu chí đánh giá lại | 0 | 0 | 21 | 48 |
| Chuyển điều trị đích / IV → PO | 0 | 0 | 40 | 29 |
| Danh mục thuốc BV199 | 55 | 12 | 0 | 2 |
| Nguồn tài liệu | 69 | 0 | 0 | 0 |

✓ có dữ liệu · ◐ một phần · • có đề cập trong nguồn · – chưa có (không tự suy diễn)

## Theo mặt bệnh (sắp theo độ phủ tăng dần)

| Mã | Mặt bệnh | Trạng thái | Độ phủ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| v8-60 | Viêm tai giữa cấp | NEEDS_REVIEW | 7/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | – | – | – | – | – | – | – | • | – | ✓ |
| v8-99 | Viêm tai giữa cấp ở trẻ em | NEEDS_REVIEW | 7/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | – | – | – | – | – | – | – | • | – | ✓ |
| v8-126 | Aspergillosis xoang xâm lấn | VERIFIED_SOURCE | 9/20 | ◐ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | – | – | ◐ | ✓ |
| v8-52 | Mucormycosis | VERIFIED_SOURCE | 9/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | – | – | ◐ | ✓ |
| v8-54 | Viêm họng do liên cầu nhóm A | VERIFIED_SOURCE | 9/20 | ✓ | ✓ | ✓ | – | – | • | – | – | ✓ | ✓ | – | – | – | – | – | ✓ | – | – | ✓ | ✓ |
| v8-8 | Viêm họng liên cầu | VERIFIED_SOURCE | 9/20 | ✓ | ✓ | ✓ | – | – | • | – | – | ✓ | ✓ | – | – | – | – | – | ✓ | – | – | ✓ | ✓ |
| v8-124 | Candida viêm xương khớp | VERIFIED_SOURCE | 10/20 | ◐ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | – | – | ✓ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-129 | Nhiễm nấm Histoplasma | VERIFIED_SOURCE | 10/20 | ✓ | ✓ | ✓ | – | ◐ | – | – | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | – | – | ◐ | ✓ |
| v8-96 | Nhiễm Candida âm hộ–âm đạo | VERIFIED_SOURCE | 10/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | – | – | ✓ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-85 | Viêm nội nhãn sau phẫu thuật | VERIFIED_SOURCE | 11/20 | ✓ | ✓ | ✓ | – | – | • | – | – | ✓ | – | ✓ | ✓ | ✓ | – | – | ✓ | – | – | ✓ | ✓ |
| v8-130 | Nhiễm nấm Talaromyces | VERIFIED_SOURCE | 11/20 | ◐ | ✓ | ✓ | – | ✓ | – | – | – | ✓ | ✓ | ✓ | – | ✓ | – | – | ✓ | – | – | ◐ | ✓ |
| v8-95 | Viêm âm đạo do vi khuẩn | NEEDS_REVIEW | 11/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | ✓ | – | ◐ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-56 | Áp xe quanh amidan | VERIFIED_SOURCE | 11/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | • | • | ✓ | ✓ |
| v8-57 | Áp xe sau họng | VERIFIED_SOURCE | 11/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | • | • | ✓ | ✓ |
| v8-66 | Nhiễm khuẩn khoang cổ sâu | VERIFIED_SOURCE | 11/20 | ◐ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | • | • | ✓ | ✓ |
| v8-25 | Nhiễm C. difficile | VERIFIED_SOURCE | 11/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-21 | Viêm phúc mạc thứ phát | VERIFIED_SOURCE | 11/20 | ✓ | ✓ | ✓ | – | ◐ | – | – | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | – | • | ✓ | ✓ |
| v8-107 | Viêm mô tế bào ở trẻ em | VERIFIED_SOURCE | 12/20 | ✓ | ✓ | ✓ | – | – | – | – | • | ✓ | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-43 | Enterobacterales sinh ESBL | VERIFIED_SOURCE | 12/20 | ◐ | ✓ | ✓ | – | – | • | ✓ | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | – | • | ✓ | ✓ |
| v8-14 | Nhiễm khuẩn huyết do Gram âm | NEEDS_REVIEW | 12/20 | ✓ | ✓ | ✓ | – | – | • | ✓ | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | – | • | ✓ | ✓ |
| v8-46 | Pseudomonas aeruginosa (nhạy thuốc và DTR) | VERIFIED_SOURCE | 12/20 | ◐ | ✓ | ✓ | – | – | • | ✓ | – | ✓ | ✓ | – | – | ✓ | – | – | ✓ | – | • | ✓ | ✓ |
| v8-88 | Viêm túi lệ cấp | NEEDS_REVIEW | 12/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | ✓ | – | ◐ | – | ✓ | ✓ | – | • | ✓ | ✓ |
| v8-50 | Aspergillus phổi xâm lấn | VERIFIED_SOURCE | 12/20 | ✓ | ✓ | ✓ | – | – | – | – | – | ✓ | ✓ | ✓ | – | ✓ | – | ◐ | ✓ | – | • | ◐ | ✓ |
| v8-122 | Candida nội tâm mạc | VERIFIED_SOURCE | 12/20 | ✓ | ✓ | ✓ | • | – | – | – | – | ✓ | ✓ | – | ✓ | ✓ | – | ◐ | ✓ | – | – | ◐ | ✓ |
| v8-128 | Cryptococcus ngoài thần kinh trung ương | NEEDS_REVIEW | 12/20 | ✓ | ✓ | ✓ | – | ◐ | – | – | – | ✓ | ✓ | – | – | ◐ | – | ✓ | ✓ | • | – | ✓ | ✓ |
| v8-9 | Áp xe phổi | NEEDS_REVIEW | 13/20 | ✓ | ✓ | ✓ | – | – | • | • | – | ✓ | ✓ | – | ✓ | ◐ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-141 | Viêm màng não do lao | NEEDS_REVIEW | 13/20 | ✓ | ✓ | ✓ | – | – | – | ✓ | – | ✓ | ✓ | ✓ | – | ✓ | • | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-102 | Viêm phổi sơ sinh | VERIFIED_SOURCE | 13/20 | ✓ | ✓ | ✓ | – | ◐ | • | ✓ | – | ✓ | ✓ | – | – | ✓ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-48 | Candida ổ bụng | VERIFIED_SOURCE | 13/20 | ◐ | ✓ | ✓ | • | – | – | – | – | ✓ | ✓ | ✓ | – | ✓ | • | ◐ | ✓ | – | – | ◐ | ✓ |
| v8-53 | Pneumocystis jirovecii pneumonia | VERIFIED_SOURCE | 13/20 | ✓ | ✓ | ✓ | – | ◐ | – | – | – | ✓ | ✓ | ✓ | ✓ | ✓ | – | ◐ | ✓ | – | – | ✓ | ✓ |
| v8-92 | Nhiễm khuẩn hậu sản | VERIFIED_SOURCE | 13/20 | ✓ | ✓ | ✓ | • | ◐ | – | – | – | ✓ | ✓ | – | ✓ | ✓ | – | – | ✓ | – | • | ✓ | ✓ |
| v8-38 | Nhiễm khuẩn dẫn lưu não thất | VERIFIED_SOURCE | 13/20 | ◐ | ✓ | ✓ | • | – | • | – | – | ✓ | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-24 | Viêm đường mật cấp | VERIFIED_SOURCE | 13/20 | ✓ | ✓ | ✓ | – | – | • | – | – | ✓ | ✓ | ✓ | ✓ | ✓ | – | ◐ | ✓ | – | – | ✓ | ✓ |
| v8-135 | Thương hàn | VERIFIED_SOURCE | 13/20 | ✓ | ✓ | ✓ | – | – | • | – | – | ✓ | ✓ | ✓ | ✓ | ✓ | – | ◐ | ✓ | – | – | ✓ | ✓ |
| v8-28 | Viêm mô tế bào có mủ / áp xe | VERIFIED_SOURCE | 14/20 | ✓ | ✓ | ✓ | – | – | • | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-27 | Viêm mô tế bào không mủ | VERIFIED_SOURCE | 14/20 | ✓ | ✓ | ✓ | – | – | • | • | • | ✓ | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-13 | Nhiễm khuẩn huyết do S. aureus | NEEDS_REVIEW | 14/20 | ✓ | ✓ | ✓ | • | – | • | ✓ | – | ✓ | ✓ | ✓ | – | ✓ | • | – | ✓ | – | – | ✓ | ✓ |
| v8-142 | Lao phổi | VERIFIED_SOURCE | 14/20 | ✓ | ✓ | ✓ | – | ◐ | – | ✓ | – | ✓ | ✓ | ✓ | – | ✓ | • | ✓ | ✓ | – | – | ✓ | ✓ |
| v8-121 | Candidemia có giảm bạch cầu trung tính | VERIFIED_SOURCE | 14/20 | ✓ | ✓ | ✓ | • | – | – | – | – | ✓ | ✓ | ✓ | – | ✓ | • | ◐ | ✓ | – | • | ◐ | ✓ |
| v8-97 | Nhiễm khuẩn tiết niệu thai kỳ | NEEDS_REVIEW | 14/20 | ✓ | ✓ | ✓ | • | – | • | – | – | ✓ | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | – | • | ✓ | ✓ |
| v8-16 | Viêm bàng quang không biến chứng | VERIFIED_SOURCE | 14/20 | ✓ | ✓ | ✓ | – | ◐ | • | – | – | ✓ | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | – | • | ✓ | ✓ |
| v8-32 | Viêm xương tủy | VERIFIED_SOURCE | 15/20 | ✓ | ✓ | ✓ | • | – | • | ✓ | – | ✓ | ✓ | – | ✓ | ✓ | – | ◐ | ✓ | – | • | ✓ | ✓ |
| v8-101 | Viêm phổi cộng đồng ở trẻ em | VERIFIED_SOURCE | 15/20 | ✓ | ✓ | ✓ | – | ✓ | • | – | – | ✓ | ✓ | ✓ | ✓ | ✓ | – | ◐ | ✓ | – | • | ✓ | ✓ |
| v8-87 | Viêm mô tế bào hốc mắt | VERIFIED_SOURCE | 15/20 | ✓ | ✓ | ✓ | – | – | • | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – | ◐ | ✓ | – | • | ✓ | ✓ |
| v8-103 | Nhiễm khuẩn huyết sơ sinh | NEEDS_REVIEW | 15/20 | ✓ | ✓ | ✓ | • | – | • | – | – | ✓ | ✓ | ✓ | ✓ | ◐ | – | ◐ | ✓ | – | • | ✓ | ✓ |
| v8-51 | Cryptococcus viêm màng não | VERIFIED_SOURCE | 15/20 | ✓ | ✓ | ✓ | • | ◐ | – | – | – | ✓ | ✓ | ✓ | ✓ | ✓ | • | ◐ | ✓ | – | – | ◐ | ✓ |
| v8-3 | Nhiễm Candida huyết (candidemia) | VERIFIED_SOURCE | 15/20 | ✓ | ✓ | ✓ | • | – | – | – | – | ✓ | ✓ | ✓ | ✓ | ✓ | • | ◐ | ✓ | – | • | ◐ | ✓ |
| v8-7 | Viêm xoang cấp do vi khuẩn | NEEDS_REVIEW | 15/20 | ✓ | ✓ | ✓ | • | – | • | ✓ | • | ✓ | ✓ | ✓ | ✓ | – | – | – | ✓ | • | – | ✓ | ✓ |
| v8-58 | Viêm xoang cấp do vi khuẩn ở người lớn | NEEDS_REVIEW | 15/20 | ✓ | ✓ | ✓ | • | – | • | ✓ | • | ✓ | ✓ | ✓ | ✓ | – | – | – | ✓ | • | – | ✓ | ✓ |
| v8-36 | Viêm màng não vi khuẩn | NEEDS_REVIEW | 15/20 | ✓ | ✓ | ✓ | • | – | • | – | – | ✓ | ✓ | ✓ | – | ◐ | – | ✓ | ✓ | • | • | ✓ | ✓ |
| v8-10 | Giãn phế quản bội nhiễm | VERIFIED_SOURCE | 16/20 | ✓ | ✓ | ✓ | – | ◐ | • | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | – | ◐ | ✓ | – | • | ✓ | ✓ |
| v8-1 | Viêm phổi cộng đồng | VERIFIED_SOURCE | 16/20 | ✓ | ✓ | ✓ | – | ✓ | • | ✓ | – | ✓ | ✓ | ✓ | ✓ | ◐ | – | ◐ | ✓ | – | • | ✓ | ✓ |
| v8-84 | Viêm giác mạc do vi khuẩn | NEEDS_REVIEW | 16/20 | ◐ | ✓ | ✓ | – | – | • | • | – | ✓ | ✓ | – | ✓ | ◐ | • | ✓ | ✓ | • | • | ✓ | ✓ |
| v8-117 | Nhiễm nấm xâm lấn ở bệnh nhân huyết học | VERIFIED_SOURCE | 16/20 | ◐ | ✓ | ✓ | • | – | – | – | – | ✓ | ✓ | ✓ | ✓ | ✓ | • | ◐ | ✓ | • | • | ◐ | ✓ |
| v9-1 | Nhiễm trùng bàn chân đái tháo đường | MISSING_EVIDENCE | 16/20 | ◐ | ✓ | ✓ | – | ✓ | • | ✓ | • | ✓ | ✓ | ✓ | ✓ | – | – | – | ✓ | • | • | ✓ | ✓ |
| v8-104 | Viêm màng não ở trẻ em | NEEDS_REVIEW | 16/20 | ✓ | ✓ | ✓ | • | – | • | • | – | ✓ | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | • | • | ✓ | ✓ |
| v8-2 | Nhiễm khuẩn tiết niệu phức tạp | NEEDS_REVIEW | 16/20 | ✓ | ✓ | ✓ | • | – | • | • | – | ✓ | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | • | • | ✓ | ✓ |
| v8-26 | Nhiễm khuẩn đường ruột xâm lấn | NEEDS_REVIEW | 16/20 | ◐ | ✓ | ✓ | • | – | • | – | • | ✓ | ✓ | ✓ | ✓ | ✓ | – | ◐ | ✓ | – | • | ✓ | ✓ |
| v8-11 | Sepsis chưa rõ nguồn | NEEDS_REVIEW | 17/20 | ✓ | ✓ | ✓ | • | ◐ | • | ✓ | – | ✓ | ✓ | – | ✓ | ✓ | • | – | ✓ | • | • | ✓ | ✓ |
| v8-12 | Sốc nhiễm khuẩn | NEEDS_REVIEW | 17/20 | ✓ | ✓ | ✓ | • | ◐ | • | ✓ | – | ✓ | ✓ | – | ✓ | ✓ | • | – | ✓ | • | • | ✓ | ✓ |
| v8-113 | Sốt giảm bạch cầu trung tính | NEEDS_REVIEW | 17/20 | ✓ | ✓ | ✓ | • | ◐ | • | ✓ | – | ✓ | ✓ | – | ✓ | ◐ | – | ◐ | ✓ | • | • | ✓ | ✓ |
| v8-116 | Sốt giảm bạch cầu trung tính nguy cơ cao | NEEDS_REVIEW | 17/20 | ✓ | ✓ | ✓ | • | ◐ | • | ✓ | – | ✓ | ✓ | – | ✓ | ◐ | – | ◐ | ✓ | • | • | ✓ | ✓ |
| v8-83 | Viêm kết mạc do vi khuẩn | NEEDS_REVIEW | 17/20 | ✓ | ✓ | ✓ | – | ◐ | • | • | – | ✓ | ✓ | ✓ | ✓ | ◐ | – | ◐ | ✓ | • | • | ✓ | ✓ |
| v8-17 | Viêm thận bể thận | NEEDS_REVIEW | 17/20 | ✓ | ✓ | ✓ | • | ◐ | • | • | – | ✓ | ✓ | ✓ | ✓ | ◐ | – | ◐ | ✓ | – | • | ✓ | ✓ |
| v8-39 | Viêm nội tâm mạc nhiễm khuẩn | NEEDS_REVIEW | 17/20 | ✓ | ✓ | ✓ | • | ◐ | • | • | – | ✓ | ✓ | – | ✓ | ◐ | • | ✓ | ✓ | – | • | ✓ | ✓ |
| v8-6 | Đợt cấp COPD do vi khuẩn | NEEDS_REVIEW | 18/20 | ✓ | ✓ | ✓ | – | ◐ | • | ✓ | • | ✓ | ✓ | – | ✓ | ✓ | • | ✓ | ✓ | • | • | ✓ | ✓ |
| v8-4 | Viêm phổi bệnh viện | NEEDS_REVIEW | 18/20 | ◐ | ✓ | ✓ | – | ✓ | • | ✓ | – | ✓ | ✓ | ✓ | ✓ | ◐ | • | ✓ | ✓ | • | • | ✓ | ✓ |
| v8-5 | Viêm phổi liên quan thở máy | NEEDS_REVIEW | 18/20 | ◐ | ✓ | ✓ | – | ✓ | • | ✓ | – | ✓ | ✓ | ✓ | ✓ | ◐ | • | ◐ | ✓ | • | • | ◐ | ✓ |
| v8-33 | Viêm khớp nhiễm khuẩn | NEEDS_REVIEW | 19/20 | ✓ | ✓ | ✓ | • | ◐ | • | ✓ | • | ✓ | ✓ | ✓ | ✓ | ◐ | – | ◐ | ✓ | • | • | ✓ | ✓ |

Cột 1–20: 1. Tên bệnh / ICD-10; 2. Chuyên khoa; 3. Đối tượng; 4. Tiêu chuẩn chẩn đoán liên quan kháng sinh; 5. Phân tầng mức độ; 6. Tác nhân thường gặp; 7. Yếu tố nguy cơ kháng thuốc; 8. Điều kiện cần dùng kháng sinh; 9. Phác đồ kinh nghiệm; 10. Thuốc ưu tiên; 11. Thuốc thay thế; 12. Dị ứng / tình huống đặc biệt; 13. Liều / số lần / đường dùng; 14. Liều nạp; 15. Thời gian điều trị; 16. Hiệu chỉnh liều và cảnh báo; 17. Tiêu chí đánh giá lại; 18. Chuyển điều trị đích / IV → PO; 19. Danh mục thuốc BV199; 20. Nguồn tài liệu.
