---
description: Soạn JSON hướng dẫn quốc tế cho các job trong data/guideline-jobs/jobs.yaml (chọn nguồn mới nhất, tải toàn văn, soạn đúng schema, validate, kiểm định độc lập). Không commit, không push.
argument-hint: "[N | <job id hoặc disease_id> | <nhóm/category>]  (mặc định N=3)"
allowed-tools: Read, Write, Bash, WebSearch, WebFetch, Agent
---

# /guideline-run – soạn hướng dẫn quốc tế theo hàng đợi

Đối số: `$ARGUMENTS`

Tuân thủ mục "Quy tắc soạn hướng dẫn điều trị quốc tế" (kể cả "Chính sách chọn nguồn") trong CLAUDE.md. Trả lời bằng tiếng Việt. **Không commit, không push, không deploy.** Không sửa công cụ viết tay, schema, validator hay file `_reference`.

## 0. Chọn job

- Đọc `data/guideline-jobs/jobs.yaml`. Nếu file chưa có thì chạy `npm run build:guideline-jobs`.
- Diễn giải đối số:
  - Rỗng hoặc một số N: lấy N job đầu tiên có `status` ∈ {todo, needs_update}, sắp theo `priority` tăng dần rồi theo thứ tự trong file. Mặc định N = 3.
  - Trùng `id` hoặc `disease_id`: chỉ chạy job đó, với điều kiện status là todo/needs_update. Status khác thì báo và dừng.
  - Trùng `category` (không phân biệt hoa thường): chạy mọi job todo/needs_update của nhóm đó.
- **Bỏ qua và liệt kê** các job có `population: null` hoặc `class: unknown`. Đây là dữ liệu người dùng phải điền; không tự điền.
- Không bao giờ chạy job `done_handwritten`.

## Với từng job, theo thứ tự

### A. Đọc mẫu
- Đọc `docs/intl-format-spec.md`, `schema/intl-guideline.ts`, `data/guidelines/intl/_reference/*.json` (chuẩn về độ chi tiết: liều đủ đường dùng, khoảng đưa liều, tối đa, điều kiện thận; mỗi dòng có `ref`; luật phủ mọi tổ hợp) và thư mục `sources/` nếu có.
- Xem `data/antibiotics/empiric/international.ts` để biết các guideline app đã ghi nhận cho `disease_id` và các `gaps`.

### B. Chọn nguồn
- Chạy **ít nhất 3 truy vấn WebSearch** khác nhau. Ví dụ: `"<tên tiếng Anh> guideline"` cùng tên tổ chức (IDSA, ESCMID, ECMM, NICE, WHO, AAP…); `"<tên> guideline update <năm>"`; `"<tên> <quần thể> management guideline PubMed"`. Nếu job có `preferred_orgs` thì ưu tiên tìm các tổ chức đó.
- Với mỗi ứng viên, WebFetch **trang chính thức** của tổ chức để xác định bản mới nhất còn hiệu lực: có bản cập nhật hoặc focused update không, có bị thay thế hay rút không.
- Chọn nguồn theo CLAUDE.md ("Chính sách chọn nguồn"). Ghi `selection_rationale`:
  - `chosen`: tổ chức ban hành chính thức, bệnh và quần thể khớp, được hội khác/WHO/CDC dẫn chiếu (chỉ nêu khi đã xác minh); **cấm số liệu "mức sử dụng"**.
  - `current_version_check`: đã kiểm tra bằng cách nào.
  - `excluded`: các nguồn bị loại kèm lý do.
- Hai bộ lớn bất đồng: chọn một bộ làm chính theo quần thể và khả năng áp dụng; bộ còn lại ghi vào `discordance`.
- Không có guideline quốc tế riêng cho quần thể của job: tạo JSON với `status: "no_specific_guideline"`, `status_note` nêu lý do và các truy vấn đã chạy, `axes`/`rules` rỗng. Đặt job `status: no_intl_guideline`. Chuyển sang job tiếp.

### C. Tải toàn văn
- Tải toàn văn (HTML đầy đủ hoặc PDF) của từng nguồn sẽ trích, bằng WebFetch.
- Mọi khuyến cáo, liều, mức bằng chứng chỉ được viết từ văn bản đã tải thành công trong lần chạy này.
- Không tải được toàn văn của nguồn chính thì đặt job `status: blocked_no_fulltext`, ghi `notes` (URL và lỗi), **không soạn JSON**, sang job tiếp.

### D. Soạn JSON
- Ghi `data/guidelines/intl/<slug>.json`, với `slug` = `id` của job.
- Các trường:
  - `disease_id`, `name_vi`, `population` lấy từ job.
  - `icd10` lấy từ job; null thì ghi `"CẦN XÁC MINH"`.
  - `name_en` theo thuật ngữ của chính guideline. Ghi thêm vào `disease_en` của job.
  - `review: { state: "draft_ai", verified_by: null, verified_date: null, next_review: null }`.
- **Trục và luật:**
  - Chỉ tạo các trục mà guideline thực sự phân nhánh.
  - Với mọi tổ hợp hợp lệ phải có đúng 1 luật `primary`.
  - Dùng `addon` cho phần bổ sung và `show_when` ở dòng/khối để viết gọn.
  - `sections` dùng cho quy trình, thời gian, chuyển uống, xuống thang, bảng liều theo nhóm.
- **Từng dòng (`RxItem`):** `role`, `text`; `dose` chỉ khi nguồn có; `grade` đúng hệ của nguồn; `ref` là vị trí trong nguồn; `source_ids`.
- Mỗi nguồn có `grade_system` đúng hệ của nó. Không quy đổi.
- Guideline nêu ngưỡng kháng sinh đồ (ví dụ "≥ 80%") thì ghi như nội dung khuyến cáo và thêm `antibiogram_reminder` để UI nhắc đối chiếu Antibiogram BV199. Không tự điền tỷ lệ tại chỗ.
- Thông tin UI cần mà nguồn không có thì ghi `"CẦN XÁC MINH"`.

### E. Validate
- Chạy `npm run validate:guidelines -- data/guidelines/intl/<slug>.json`.
- Sửa cho tới khi không còn **LỖI**. Không sửa schema hay validator để cho qua.
- Không sửa được thì ghi nguyên văn lỗi vào báo cáo và đặt job `status: drafted`.

### F. Kiểm định độc lập
- Gọi subagent **guideline-auditor** (Agent tool, `subagent_type: "guideline-auditor"`), chỉ truyền đường dẫn file JSON.
- Sửa theo báo cáo, **tối đa 2 vòng** (gọi lại auditor sau mỗi vòng sửa).
- Phần vẫn không xác minh được thì để `"CẦN XÁC MINH"` ở đúng trường đó. **Không xóa nội dung có căn cứ, không đoán.**
- Validate lại sau mỗi vòng sửa.
- Lưu bảng kết quả auditor vòng cuối vào `docs/guideline-run-log.md` (mục G). `/guideline-live` dùng bảng này cho cổng xuất bản.

### G. Cập nhật trạng thái và log
- Trong `jobs.yaml`: `status: audited` (nếu đã qua E và F), `last_checked: <hôm nay YYYY-MM-DD>`, `notes` ngắn. Chỉ sửa đúng mục của job.
- Nối vào `docs/guideline-run-log.md`:
  ```
  ## <YYYY-MM-DD> – <disease_vi> (<disease_id>)
  - Nguồn: <tổ chức, năm, URL> …
  - Validate: <kết quả>
  - Auditor vòng cuối: sai thuốc a / sai liều b / sai nhãn bằng chứng c / thiếu d / không xác minh được e; đã sửa …; còn lại …
  - CẦN XÁC MINH: <số>
  ```

## H. Báo cáo cuối (bảng)

| Bệnh | Status | Nguồn (tổ chức, năm, URL) | Số CẦN XÁC MINH | Validate | Auditor còn lại |

Liệt kê thêm: các job blocked_no_fulltext và no_intl_guideline (kèm lý do), các job bị bỏ qua vì `population`/`class` chưa điền, và nguồn không truy cập được. Nhắc rằng nội dung đang ở trạng thái `draft_ai`, và cần chạy `/guideline-live` để đăng.
