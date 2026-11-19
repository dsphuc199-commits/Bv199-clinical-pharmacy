# Nhật ký soạn hướng dẫn quốc tế (/guideline-run, /guideline-live)

Mỗi lần chạy nối một mục: ngày, bệnh, nguồn, kết quả validate, kết quả auditor (lỗi tìm thấy / đã sửa / còn lại), số CẦN XÁC MINH, kết quả kiểm tra trang thật.

## 2026-11-19 – Viêm phổi cộng đồng ở trẻ em (v8-101)

- Thêm tab Quốc tế theo NICE NG250 Bảng 2, WHO 2024 Khuyến cáo 1 và 2a và IDSA/PIDS 2026 Phần 1. Đối chiếu hai PDF người dùng cung cấp. Giữ PIDS/IDSA 2011 Bảng 7 ở mục lưu trữ.
- Kiểm tra độc lập liều, đường dùng, thời gian và phạm vi nguồn. Làm rõ tiêu chí dẫn lưu khi dịch vừa kèm gắng sức hô hấp, điều kiện lựa chọn đường uống và ngoại lệ thai kỳ với doxycycline.
- Xác thực 58 tổ hợp lựa chọn và 14 luật chính. Năm phép hồi quy riêng về liều, độ tuổi và phạm vi nguồn đạt. Kiểm tra thực tế ở 390 px và 1440 px đạt, gồm đổi nguồn, chọn đường tĩnh mạch, phối hợp và các nhánh cần hội chẩn.
- Trạng thái `draft_ai`, hàng đợi `drafted`. Chờ thẩm định chuyên môn theo quy trình của BV199.
- Chọn tổ chức trước khi xem nội dung. Hiện trích dẫn của tổ chức và phiên bản đã chọn. IDSA/PIDS mở mục 2026 về biến chứng màng phổi và cho chuyển sang mục kháng sinh 2011 lưu trữ. Xác thực lại 59 tổ hợp và 15 luật chính.
- Chuẩn hóa bảng theo cách trình bày của các module thuốc hiện có. Ghi riêng hàm lượng, cách dùng, tổng liệu trình và vị trí trích dẫn. Đối chiếu hàm lượng BV199 với dạng bào chế. Bổ sung lựa chọn hỗn dịch 4:1 và erythromycin trong thai kỳ theo NICE, điều kiện 3 ngày theo WHO và các nhánh tra cứu IDSA/PIDS 2011. Ghi chú về phê duyệt đặt ở cuối cùng với nguồn.
- Khi mở mặt bệnh, tab Quốc tế hiển thị IDSA/PIDS 2011 lưu trữ trước bản 2026. Có bảng tổng quan 2011 và chọn bệnh cảnh để tra liều. Mục 2026 giải thích phạm vi Phần 1 về biến chứng màng phổi và dẫn về bảng 2011 lưu trữ để tra cứu lịch sử.

## 2026-11-14 – Sốt giảm bạch cầu trung tính (v8-113) và Sốt giảm bạch cầu trung tính nguy cơ cao (v8-116)
- Nguồn: ECIL-10 – bộ slide khuyến cáo cuối cùng nhóm vi khuẩn (ECIL, 2025; https://ecil-leukaemia.com/images/ecil-10/ECIL_10_-_bacterial_group_final_recommendations.pdf), người lớn; IPFN 2023 (Lehrnbecher T và cs., J Clin Oncol 2023; https://doi.org/10.1200/JCO.22.02224), trẻ em.
- Toàn văn: tải được slide ECIL-10 (44 trang) và IPFN 2023 (Europe PMC, PMC10022858). Bài báo ECIL-10 trên Lancet Infect Dis cần thuê bao – không đọc được.
- Domain mới vào danh sách tin cậy: ecil-leukaemia.com (trang chính thức của ECIL, nhà ban hành của chính hướng dẫn).
- Validate: 2/2 tệp đạt; 535 tổ hợp, 39 luật primary, 11 luật addon.
- Kiểm định độc lập vòng 1: sai thuốc 0 / sai liều 0 / sai nhãn bằng chứng 1 / thiếu 2 / không xác minh được 1.
  - Đã sửa: thêm dòng carbapenem có điều kiện (sepsis + nguy cơ Gram âm kháng beta-lactam, slide 11, A-IIu); tách phần giải thích IPFN A6a/A7b thành dòng không xếp mức; ghi rõ phiên bản bài báo ECIL-10; cập nhật current_version_check.
  - Còn lại: mức khuyến cáo ECIL-10 lấy từ slide, chưa đối chiếu bản bài báo sau bình duyệt (ghi trong gaps).
- CẦN XÁC MINH: 0.
- Xuất bản 2026-11-14 (commit cffbee2, Vercel Production Ready). Kiểm tra trang thật https://bv199-clinical-pharmacy.vercel.app/antibiotics/empiric/guideline-v9?disease=v8-113 và ?disease=v8-116: tiêu đề, nhãn bản nháp, khối khuyến cáo, đổi trục cho kết quả khác – PASS. Lỗi console duy nhất là 404 do prefetch /pkpd (liên kết điều hướng có sẵn của app, gặp cả ở trang v8-14), không liên quan nội dung này.
