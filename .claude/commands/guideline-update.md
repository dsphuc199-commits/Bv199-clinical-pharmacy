---
description: Kiểm tra các hướng dẫn quốc tế đã soạn (data/guidelines/intl/*.json) có bản mới, bị thay thế hay bị rút; nếu có thì soạn lại theo /guideline-run và đánh dấu needs_update. Không push.
argument-hint: "<job id | disease_id | all>"
allowed-tools: Read, Write, Bash, WebSearch, WebFetch, Agent
---

# /guideline-update – rà soát phiên bản nguồn

Đối số: `$ARGUMENTS`

Tuân thủ CLAUDE.md, gồm mục "Quy tắc soạn hướng dẫn điều trị quốc tế" và "Chính sách chọn nguồn". Trả lời bằng tiếng Việt. **Không push, không deploy.** Không commit nếu người dùng không yêu cầu. Bỏ qua `data/guidelines/intl/_reference/` và `_held/`.

## 1. Chọn file
- `all`: mọi `data/guidelines/intl/*.json`.
- Còn lại: file có `slug` hoặc `disease_id` khớp đối số. Không thấy thì báo và dừng.

## 2. Với từng file
1. Đọc `sources[]`. Với từng nguồn:
   - WebFetch trang chính thức của tổ chức (url trong JSON, hoặc trang danh mục guideline của tổ chức tìm qua WebSearch).
   - Xác định có **bản mới hơn**, **focused update**, **bản thay thế** hay thông báo **rút** so với `year`/`version` đang ghi.
   - Ghi bằng chứng: URL và ngày công bố.
   - Không truy cập được thì ghi vào báo cáo. Không kết luận là "không có bản mới".
2. **Không có thay đổi:** chỉ cập nhật `last_checked: <hôm nay>` của job trong `data/guideline-jobs/jobs.yaml`. Không sửa JSON.
3. **Có thay đổi:**
   - Chạy lại quy trình `.claude/commands/guideline-run.md` các bước B–F cho bệnh đó, với nguồn mới. Ghi đè đúng file JSON của bệnh.
   - Nếu nội dung hiển thị thay đổi, đặt `review` về `{ state: "draft_ai", verified_by: null, verified_date: null, next_review: null }`. Áp dụng cả khi bản cũ đã được thẩm định.
   - Trong `jobs.yaml`: `status: needs_update`, `last_checked: <hôm nay>`, `notes` ngắn (bản cũ → bản mới). Bệnh chờ `/guideline-live` để đăng.
   - Nối vào `docs/guideline-changelog.md`:
     ```
     ## <YYYY-MM-DD> – <disease_vi> (<disease_id>)
     - Nguồn: <tổ chức> <bản cũ (năm/version)> → <bản mới (năm/version, URL)>
     - Phần thay đổi: <trục/luật/thuốc/liều/nhãn bằng chứng nào đổi – tóm tắt, không chép nguyên văn>
     - review.state: <trước> → draft_ai
     - Validate: <kết quả>; Auditor vòng cuối: <tóm tắt>
     ```

## 3. Báo cáo
Bảng gồm: bệnh, nguồn, phiên bản đang dùng, phiên bản mới nhất tìm thấy (URL), kết luận (không đổi / đã soạn lại – needs_update / không truy cập được), số CẦN XÁC MINH. Nhắc chạy `/guideline-live <id>` để đăng các bệnh `needs_update`.
