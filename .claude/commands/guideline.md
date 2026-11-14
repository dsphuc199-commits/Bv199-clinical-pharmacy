---
description: Soạn JSON hướng dẫn quốc tế cho MỘT bệnh – lối tắt của /guideline-run cho một job (không commit, không push).
argument-hint: "<job id | disease_id>"
allowed-tools: Read, Write, Bash, WebSearch, WebFetch, Agent
---

# /guideline – soạn một bệnh

Đối số: `$ARGUMENTS`

Lệnh này là lối tắt. Thực hiện đúng quy trình trong `.claude/commands/guideline-run.md` (các bước 0, A–H) với đúng **một** job có `id` hoặc `disease_id` bằng `$ARGUMENTS` trong `data/guideline-jobs/jobs.yaml`.

- Không có job khớp: chạy `npm run build:guideline-jobs` rồi tìm lại. Vẫn không có thì báo và dừng.
- Job có `population: null` hoặc `class: unknown`: dừng và yêu cầu người dùng điền vào `jobs.yaml`. Không tự điền.
- Job `done_handwritten`: dừng. Bệnh đã có công cụ viết tay, và công cụ viết tay luôn được ưu tiên.
- Không commit, không push. Muốn đăng thì dùng `/guideline-live <id>`.
