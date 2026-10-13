# Báo cáo cập nhật – chỉ giữ mặt bệnh có lựa chọn kháng sinh cụ thể

- Số mặt bệnh còn lại: **68** (sắp xếp theo chuyên khoa, A–Z theo tiếng Việt).
- Số phương án có thuốc + liều cụ thể: **242** / 261 phương án BYT.
- Quy tắc "cụ thể": có ít nhất 1 thuốc chính kèm liều số (mg, g, triệu đơn vị, UI…); thuốc còn lại có liều hoặc ghi "như trên". Phương án chỉ nêu tên nhóm thuốc/"Nguồn BYT không nêu liều" bị **ẩn mặc định** (có nút hiện lại).
- 7 mặt bệnh không có phương án BYT dạng số, nhưng được phục vụ bằng module có liều (CAP/HAP/VAP, ABRS, CDC liên cầu A, NICE AOM): v8-5, 7, 8, 54, 58, 60, 99.

## 10 mặt bệnh bị loại ở đợt này (chỉ nêu tên thuốc/nhóm thuốc, không có liều)
v8-15, v8-108, v8-55, v8-63, v8-64, v8-67, v8-100, v8-89, v8-118, v8-131.
v8-48 (Candida ổ bụng) được giữ vì QĐ 3429 tr. 53–54 dẫn chiếu điều trị như Candida máu (có liều).

## Lưu ý
- Hiệu lực văn bản BYT chưa được xác minh; QĐ 162 chưa có số/ngày.
- Không mặc định mặt bệnh nào ở mức dữ liệu 5.
- `tsc` sạch; mô phỏng giao diện đúng; `next build` chưa được tôi kiểm tra (lệnh bên dưới sẽ chặn push nếu build lỗi).

## Quy tắc "văn bản mới nhất thay văn bản cũ" (cùng một mặt bệnh)
Nếu một mặt bệnh có phương án cụ thể từ nhiều văn bản BYT, chỉ giữ văn bản có ngày ban hành mới nhất (`SUPERSEDED_LOG` trong `regimens/index.ts`):
| Mặt bệnh | Giữ | Bỏ |
|---|---|---|
| v8-28 Nhọt/áp xe da | QĐ 4416/2023 | QĐ 708/2015 |
| v8-85 Viêm nội nhãn | QĐ 708/2015 | QĐ 40/2015 |
| v8-87 Viêm mô tế bào hốc mắt | QĐ 708/2015 | QĐ 40/2015 |
| v8-88 Viêm túi lệ cấp | QĐ 708/2015 | QĐ 40/2015 |
| v8-95 Viêm âm đạo do vi khuẩn | QĐ 708/2015 | QĐ 315/2015 |
Ngoại lệ giữ cả hai (bổ sung, không mâu thuẫn): v8-97 (QĐ 315 có viêm thận–bể thận thai kỳ, QĐ 708 chỉ có viêm bàng quang).
Viêm phổi cộng đồng: chỉ dùng QĐ 2147/2026 (thay QĐ 4815/2020); không còn dữ liệu QĐ 4815 trong app.
Lưu ý: v8-85/87/88/95 giữ QĐ 708 chỉ vì ngày ban hành muộn hơn 1–2 tháng; cần dược sĩ lâm sàng xác nhận.
Chưa xác minh được trên cổng chính thức xem còn văn bản BYT mới hơn các QĐ đang dùng (tìm kiếm web chỉ cho thấy QĐ 708/2015 và QĐ 162/2024 vẫn là bản được dẫn).
