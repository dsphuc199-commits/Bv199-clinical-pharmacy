@AGENTS.md

## Quy tắc soạn hướng dẫn điều trị quốc tế

Áp dụng khi soạn/sửa JSON trong `data/guidelines/intl/` (lệnh `/guideline`). Format: `docs/intl-format-spec.md`; schema: `schema/intl-guideline.ts`; mẫu chuẩn: `data/guidelines/intl/_reference/`.

- Chỉ dùng guideline chính thức của hội chuyên ngành/cơ quan y tế, bài trên PubMed, hoặc tài liệu trong `sources/`. Không dùng blog, trang tổng hợp, nội dung do AI tạo.
- Mọi khuyến cáo, dòng thuốc, ghi chú đều có `source_ids` trỏ tới `sources`.
- Không tự tạo liều, DOI, mức khuyến cáo hay chất lượng bằng chứng. Nguồn không có liều thì bỏ trống `dose`. Trường UI bắt buộc mà nguồn không có thì ghi "CẦN XÁC MINH".
- Nhãn mức khuyến cáo và chất lượng bằng chứng chép đúng hệ thống của guideline gốc (GRADE → `S-/C-` + `H|M|L|VL`; hệ chữ cái – số La Mã → `A-II`…; đồng thuận → `Đồng thuận`). Không tự quy đổi giữa các hệ thống phân mức.
- Ngưỡng kháng sinh đồ (tỷ lệ nhạy tại chỗ) lấy từ cấu hình/dữ liệu của app. Không tự điền số liệu tại chỗ; chỉ được ghi ngưỡng như một nội dung khuyến cáo của guideline, kèm nguồn.
- Các guideline mâu thuẫn nhau thì ghi rõ từng nguồn nói gì. Không tự chọn hay trộn thành phác đồ mới.
- `review.state` luôn là `draft_ai`. Chỉ dược sĩ hoặc bác sĩ được đổi trạng thái, kèm `verified_by` và `verified_date`.
- Quần thể phải khớp (người lớn / trẻ em / sơ sinh). Không áp khuyến cáo người lớn cho trẻ em và ngược lại. Không có guideline riêng cho quần thể thì đặt `status: "no_specific_guideline"` kèm `status_note`.
- Diễn đạt lại bằng tiếng Việt chuyên môn. Không chép nguyên văn đoạn dài từ guideline.
- Không đưa dữ liệu định danh bệnh nhân vào bất kỳ file, truy vấn hay ví dụ nào.
- Chạy `npm run validate:guidelines` trước khi báo xong. Không tuyên bố đã kiểm tra nếu chưa chạy.

### Chính sách chọn nguồn (lệnh /guideline-run, /guideline-live, /guideline-update)

- Chỉ dùng guideline chính thức của hội hoặc tổ chức y tế được công nhận quốc tế hay khu vực (ví dụ nhóm IDSA, ESCMID, ECMM/ISHAM, ATS, SCCM, NICE, WHO, ESPID, AAP/Red Book, KDIGO), bài trên PubMed/PMC, và tài liệu trong `sources/`. Không giả định phiên bản hiện hành mà phải kiểm tra trên trang chính thức.
- Luôn xác định bản mới nhất còn hiệu lực: có bản cập nhật, focused update, bản thay thế hay bị rút không. Ghi cách kiểm tra vào `selection_rationale.current_version_check`.
- "Được dùng nhiều nhất" không đo được bằng số liệu. Chỉ căn cứ vào: tổ chức ban hành chính thức; bệnh và quần thể khớp; được hội khác hoặc WHO/CDC dẫn chiếu (chỉ nêu khi đã xác minh). Cấm bịa số liệu về mức sử dụng. Mỗi bệnh ghi `selection_rationale` gồm lý do chọn và các nguồn bị loại kèm lý do.
- Hai bộ guideline lớn bất đồng: chọn một bộ làm chính theo quần thể và khả năng áp dụng; bộ còn lại ghi vào `discordance`.
- Cấm viết khuyến cáo, liều, mức bằng chứng từ trí nhớ hay từ phần tóm tắt (abstract). Chỉ viết từ văn bản đã tải về thành công. Không tải được toàn văn thì đặt job `blocked_no_fulltext` và dừng bệnh đó.
- Mã mức khuyến cáo chỉ dùng đúng hệ của nguồn: khai báo `grade_system` cho từng nguồn, validator kiểm tra. Chữ E và mọi mã khác chỉ dùng khi nguồn gốc dùng đúng hệ đó. Cấm quy đổi giữa các hệ.
- Hướng dẫn của Bộ Y tế Việt Nam thuộc tab Việt Nam, không trộn vào JSON quốc tế.
- Diễn đạt lại, không chép nguyên văn đoạn dài. Không đưa dữ liệu định danh bệnh nhân.
- AI soạn thì `review.state` luôn là `draft_ai`. Bản đã thẩm định mà nội dung đổi do cập nhật nguồn phải quay về `draft_ai`.
- Domain mới của nhà xuất bản chính thức (ví dụ academic.oup.com) chỉ được thêm vào danh sách tin cậy (`TRUSTED` trong `scripts/validate-guidelines.ts`) sau khi xác nhận đó là nhà xuất bản của chính guideline, và phải báo cáo việc thêm.
- Công cụ viết tay trong `IntlTab` và module riêng luôn được ưu tiên hơn JSON. Không sửa nội dung khuyến cáo của chúng.
- Chỉ `/guideline-live` được commit hoặc push. Khi đó chỉ stage đúng file liên quan; cấm `git add -A`, `git add .`, `--force`, `--no-verify`.
