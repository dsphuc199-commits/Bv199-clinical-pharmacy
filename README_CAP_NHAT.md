# Cập nhật module Hiệu chỉnh liều (giai đoạn 1)

Thay 2 tệp:
- data/renal-dosing.ts
- app/antibiotics/dosing/page.tsx

Có thể xóa (không còn tệp nào import): data/antibiotics/dosing.ts

Thay đổi dữ liệu:
- Thêm trường tùy chọn (adultDoseText, pediatricDoseText, hepaticNote, elderlyNote, verification, source.page); source.url thành tùy chọn.
- Sửa khoảng hở CrCl 25–26 ở 2 hồ sơ meropenem FDA (CrCl 25,5 trước đây không khớp mức nào).
- Thêm hồ sơ meropenem theo Dược thư quốc gia Việt Nam 2023 (PDF tr. 1080–1081, trang in 1086–1087).
- Ceftriaxon (trong dosing.ts cũ) chưa chuyển sang: nguồn cũ không ghi trang; bảng liều Dược thư bị lộn khi trích, cần đối chiếu ảnh trang.
