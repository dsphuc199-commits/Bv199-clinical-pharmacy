---
description: Soạn (theo /guideline-run), qua cổng xuất bản, build, commit, push, theo dõi deploy Vercel và kiểm tra trang production cho các hướng dẫn quốc tế. Tùy chọn --no-push; --dry-run-reference để chạy thử chuỗi build với dữ liệu _reference.
argument-hint: "[N | <job id hoặc disease_id> | <nhóm>] [--no-push] [--dry-run-reference]  (mặc định N=1)"
allowed-tools: Bash, Read, Write, WebSearch, WebFetch, Agent
---

# /guideline-live – soạn, xuất bản và kiểm tra trang thật

Đối số: `$ARGUMENTS`

Tuân thủ CLAUDE.md, gồm mục "Quy tắc soạn hướng dẫn điều trị quốc tế" và "Chính sách chọn nguồn". Trả lời bằng tiếng Việt.

**Cấm:**
- `git add -A` và `git add .`;
- `--force` và mọi lệnh ghi đè lịch sử;
- `--no-verify` hay bỏ qua hook;
- tự revert;
- commit secret (`.env*`, cookie, mật khẩu);
- commit thư mục `audit-69-2026/`.

Không tuyên bố đã build, deploy hay kiểm tra nếu chưa chạy thật. Mọi kết quả báo đúng như output.

## Chế độ
- **Mặc định:** chạy A → I.
- **`--no-push`:** chạy A → D (commit cục bộ). Không chạy E–H. Báo cách xem trước cục bộ ở mục I.
- **`--dry-run-reference`:** không soạn nội dung, không commit. Bỏ qua A. Ở B, chạy `npm run validate:guidelines -- --include-reference data/guidelines/intl/_reference` thay cho cổng. Sau đó chạy C. Dừng sau C và báo kết quả từng lệnh. Dùng để kiểm tra chuỗi công cụ.

## A. Soạn
Chạy đầy đủ quy trình trong `.claude/commands/guideline-run.md` (các bước 0, A–H) cho các job được chọn. Mặc định N = 1.

## B. Cổng xuất bản
Một bệnh chỉ được đăng khi thỏa **đồng thời**:
1. `npm run validate:guidelines -- data/guidelines/intl/<slug>.json` không có LỖI;
2. job không ở `blocked_no_fulltext`;
3. bảng auditor vòng cuối (trong `docs/guideline-run-log.md`) không còn phát hiện chưa sửa ở mức `sai thuốc`, `sai liều` hoặc `sai nhãn bằng chứng`;
4. `disease_id` có trong `data/antibiotics/empiric/catalog.ts`, không có công cụ viết tay hay module riêng, và job không ở `done_handwritten`.

Bệnh `no_intl_guideline` (JSON có `status: no_specific_guideline`) được đăng. UI sẽ hiện "chưa có hướng dẫn quốc tế riêng, xem tab Việt Nam".

Bệnh không qua cổng:
- đặt job `status: held_by_gate`, ghi lý do vào `notes`;
- **chuyển file JSON ra khỏi `data/guidelines/intl/`** sang `data/guidelines/intl/_held/` (index không quét thư mục con) để không bị đăng.

## C. Build và kiểm tra (lỗi → dừng, không commit, không push, báo nguyên văn)
```
npm run build:intl-index
npx tsc --noEmit -p .
npx eslint <các file .ts/.tsx mới hoặc đã sửa trong lần chạy này>
npm run test:empiric
npm run build
```

## D. Commit
- Chạy `git status --short` và xem lại danh sách.
- **Chỉ stage đúng file liên quan**, liệt kê từng đường dẫn:
  - `data/guidelines/intl/<slug>.json` của các bệnh qua cổng;
  - `data/guidelines/intl/index.ts`;
  - `data/guideline-jobs/jobs.yaml`;
  - `docs/guideline-run-log.md`.
- Kiểm tra `git diff --cached --stat` trước khi commit.
- Quy ước commit của repo (xem `git log`):
  - một dòng tiêu đề tiếng Việt không dấu, dạng `Huong dan quoc te (JSON): <danh sach benh> - <nguon chinh>`;
  - phần thân liệt kê từng bệnh và nguồn;
  - dòng cuối: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## E. Push (bỏ qua nếu `--no-push`)
- Quy ước các lần deploy trước của repo: Vercel tự deploy nhánh `main`. Commit được đẩy lên **cả nhánh làm việc hiện tại và `main`**:
  ```
  git push origin <nhánh hiện tại>
  git push origin HEAD:main
  ```
  Nếu nhánh hiện tại là `main` thì chỉ chạy `git push origin main`.
- Chạy `git fetch origin`, rồi kiểm tra `git merge-base --is-ancestor origin/main HEAD`. Nếu `main` trên remote không phải tổ tiên của HEAD (không fast-forward được), hoặc push bị từ chối, thì **dừng và hỏi người dùng**. Không force.

## F. Theo dõi deploy Vercel
- Trước khi push, ghi lại URL deployment Production đầu tiên trong `npx -y vercel@latest ls`.
- Sau khi push, lặp lại `npx -y vercel@latest ls` mỗi khoảng 20 giây, **tối đa 15 phút**, cho tới khi xuất hiện deployment Production mới với trạng thái `Ready` hoặc `Error`.
- `Error`:
  - không push thêm;
  - chạy `npx -y vercel@latest inspect <url> --logs` và báo phần log lỗi;
  - không tự revert;
  - dừng.
- Hết thời gian mà chưa Ready thì báo trạng thái hiện tại và dừng.

## G. Kiểm tra trang production (chỉ khi Ready)
- **Cookie đăng nhập:** dùng `BV199_COOKIE_FILE`, là tệp cookie Netscape cho domain `bv199-clinical-pharmacy.vercel.app`. Nếu chưa có:
  - đăng nhập bằng `curl -c <tệp trong thư mục tạm/scratchpad> --data-urlencode username=… --data-urlencode password=… https://bv199-clinical-pharmacy.vercel.app/api/auth/login`;
  - tài khoản lấy từ biến môi trường `BV199_USER` / `BV199_PASS`, hoặc hỏi người dùng;
  - **không ghi mật khẩu hay cookie vào repo hoặc log.**
- Chạy:
  ```
  STANDARDIZE_BASE_URL=https://bv199-clinical-pharmacy.vercel.app BV199_COOKIE_FILE=<tệp> \
    node tests/empiric/intl-live-browser.cjs <disease_id …>
  ```
  Đặt `PLAYWRIGHT_MODULE` / `CHROME_PATH` nếu cần.
- Script kiểm tra:
  - tiêu đề;
  - nhãn nháp hoặc thẩm định;
  - số khối khuyến cáo;
  - đổi lựa chọn trục thì kết quả thay đổi;
  - không có lỗi console.
- Báo URL `https://bv199-clinical-pharmacy.vercel.app/antibiotics/empiric/guideline-v9?disease=<id>` của từng bệnh cùng output PASS/FAIL thật.

## H. Cập nhật trạng thái (chỉ khi E đã chạy)
- `jobs.yaml`: với bệnh đã đăng và qua G, đặt `status: published`, `published_at: <hôm nay>`. Nối kết quả G vào `docs/guideline-run-log.md`.
- Commit đúng 2 file trên, theo quy ước ở D, tiêu đề `Huong dan quoc te: cap nhat trang thai xuat ban <danh sach>`. Push như E.

## I. Báo cáo cuối
- Bảng **đã đăng / held_by_gate / blocked_no_fulltext / no_intl_guideline**, gồm các cột: bệnh, nguồn (tổ chức, năm, URL), số CẦN XÁC MINH, lý do (nếu không đăng).
- URL production và kết quả kiểm tra trang thật (dòng PASS/FAIL).
- Commit hash đã tạo và nhánh đã push.
- Nếu chạy `--no-push`:
  - commit cục bộ chưa push;
  - xem trước bằng `npm run dev`, mở `http://localhost:3000/antibiotics/empiric/guideline-v9?disease=<id>`, tab Quốc tế;
  - hoặc chạy `node tests/empiric/intl-live-browser.cjs <id>` (BV199_COOKIE_FILE cho localhost).
