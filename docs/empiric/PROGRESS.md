# Tiến độ – Master Task 5: Kháng sinh điều trị kinh nghiệm

Cập nhật: 26/10/2026 (Final Execution) · Nhánh `fix/empiric-cap-hap-vap-dtr` · chưa commit.

## Trạng thái hiện tại

| Chỉ số | Giá trị |
|---|---|
| Mặt bệnh | 69 |
| VERIFIED_SOURCE / NEEDS_REVIEW / MISSING_EVIDENCE | 39 / 29 / 1 |
| APPROVED_FOR_CLINICAL_USE | 0 (chưa có quyết định HĐT&ĐT) |
| Phương án BYT gốc (nguyên văn, có test baseline) | 300 |
| Đang hiển thị | 270 |
| Liều nguyên văn / liều bổ sung có dẫn nguồn / MISSING_DOSE_EVIDENCE | 226 / 9 / 35 |
| Phương án khóa đề xuất tự động | 12 (giữ nguyên, chờ HĐT&ĐT) |
| Guideline quốc tế đã đăng ký | 28 (23 đã trích, 3 mới xác định, 2 module) |

Thay đổi trạng thái so với đợt trước (ghi trong `tests/empiric/fixtures/status-changes.json`):
- v8-142 Lao phổi: NEEDS_REVIEW → VERIFIED_SOURCE (liều giai đoạn duy trì trẻ em lấy từ Phụ lục 6 Bảng 1 cùng QĐ 162).
- v8-9 Áp xe phổi, v8-103 Nhiễm khuẩn sơ sinh: VERIFIED_SOURCE → NEEDS_REVIEW (kiểm tra thiếu liều chặt hơn phát hiện "kháng sinh khác không nêu cụ thể", "imipenem: liều không nêu").

## Đã làm trong Final Execution

| Hạng mục | Nội dung | File |
|---|---|---|
| Liều thiếu | Lớp liều bổ sung tách riêng (không sửa nguyên văn BYT): 9 phương án đủ liều từ cùng văn bản (QĐ 162 Phụ lục 6 + mục 3.3; QĐ 708 mục 4.3; QĐ 3429 mục 4.1.1a) hoặc CDC 2021; 4 phương án thông tin một phần (AAO). 35 phương án MISSING_DOSE_EVIDENCE có lý do riêng | `data/antibiotics/empiric/dose-supplements.ts` |
| Engine | Sửa lỗi: phương án chỉ ghi tên thuốc (không có cụm "không nêu liều") trước đây vẫn ELIGIBLE → nay MISSING_DOSE_EVIDENCE, CONDITIONAL, không đề xuất liều | `lib/antibiotics/selection-engine.ts` |
| Engine | Biến theo bệnh: chỉ hỏi dị ứng penicillin khi bệnh có beta-lactam; chỉ hỏi chức năng thận khi có thuốc toàn thân | `lib/antibiotics/selection-engine.ts` (`relevanceOf`) |
| Nhóm 4 | Rà soát quốc tế 14 bệnh: GOLD 2026, AAO 2023 (giác mạc, kết mạc), IDSA 2019 (khuẩn niệu thai kỳ), CDC 2021 (BV), IDSA 2017 (tiêu chảy), CDC 2024 (viêm xoang/viêm tai), WHO TB 2025 và WHO Cryptococcus 2022 (chỉ xác định), viêm túi lệ: không có guideline quốc tế lớn | `data/antibiotics/empiric/international.ts` |
| Trạng thái | Lý do NEEDS_REVIEW mới: MISSING_DOSE_EVIDENCE, liều bổ sung quốc tế; ghi chú liều bổ sung cùng văn bản; lao màng não: thiếu liều streptomycin trẻ em | `lib/antibiotics/evidence-status.ts`, `data/antibiotics/empiric/evidence.ts` |
| Giao diện | Thẻ phương án: khối "Liều bổ sung có dẫn nguồn" / "Thông tin liều một phần", nhãn MISSING_DOSE_EVIDENCE kèm lý do | `components/antibiotics/selection/SelectionEngine.tsx`, `components/antibiotics/empiric/BytRegimenView.tsx` |
| Route | cdss-v12, cdss-v13 có bộ liều riêng không qua Safety Gate → chuyển hướng về module chính (9 route cũ) | `app/antibiotics/empiric/cdss-v12/layout.tsx`, `cdss-v13/layout.tsx` |
| Test | Bộ mới `mt5-final-test.cjs` (31 kiểm tra; engine 69 bệnh × 2 đối tượng × 3 chế độ nhập); trạng thái kỳ vọng = baseline + thay đổi có lý do | `tests/empiric/mt5-final-test.cjs`, `tests/empiric/expected-status.cjs`, `tests/empiric/fixtures/status-changes.json` |

| Giao diện | Tab tình huống có phương án khóa hiện nhãn "Khóa" ngay (không cần mở tình huống) | `components/antibiotics/empiric/BytRegimenView.tsx` |

## Master Task 6 – Dữ liệu phác đồ có cấu trúc và thẻ điều trị chuẩn (26/10/2026)

- Lớp dữ liệu `lib/antibiotics/regimen-structure.ts` (không sửa 300 phương án gốc): mỗi phương án → nhóm thuốc nối AND; nhóm "chọn 1" (OR), "dùng đồng thời", "liều theo đối tượng" (người lớn/trẻ em) hoặc giai đoạn nối tiếp (lao: tấn công → duy trì); mỗi thuốc có liều, đơn vị, cơ sở liều (lần/ngày/kg), đường dùng, khoảng cách, thời gian truyền, liều tối đa, tổng liều/ngày, thời gian, bối cảnh, nguyên văn và cờ.
- Không suy diễn: mọi giá trị là chuỗi con của nguyên văn (unit test); ô trống "—" = nguồn không nêu; không chắc AND/OR → `NEEDS_STRUCTURED_REVIEW`, hiển thị nguyên văn.
- An toàn: rifampicin/acid fusidic đứng riêng trong danh sách "chọn 1" → cần rà; ghép liều theo vị trí chỉ cho module (CAP/HAP) được dựng đúng thứ tự; cờ "KIỂM TRA CHẾ PHẨM" (viên/875-125 đi kèm tĩnh mạch).
- Kết quả 270 phương án đang hiển thị: 54 STRUCTURED (đủ liều, đường, khoảng cách) · 145 PARTIAL (nguồn thiếu ít nhất một trường) · 33 NEEDS_STRUCTURED_REVIEW · 38 NO_DOSE. Module CAP/HAP/VAP 49 phác đồ: 36 / 9 / 4. Dòng khuyến cáo quốc tế: 34 STRUCTURED, 30 PARTIAL, 39 cần rà, 16 không liều.
- Component dùng chung `components/antibiotics/treatment/DoseTable.tsx` (bảng Thuốc | Liều/lần | Đường dùng | Khoảng cách | Thời gian; mobile thành thẻ, không cuộn ngang) dùng ở: thẻ BYT (69 bệnh), bộ chọn kháng sinh (lọc theo đối tượng), module CAP/HAP/VAP, tab Quốc tế.
- Thẻ BYT theo mẫu: Lựa chọn ưu tiên → Lựa chọn thay thế (hiện sẵn) → Theo tác nhân/điều trị kèm (thu gọn, tự mở khi chỉ có loại này hoặc có cảnh báo nguy cơ cao); lưu ý điều trị và nguồn trong accordion.
- Chỉ còn 3 tab: Bộ Y tế | Quốc tế | Đối chiếu; "Nguồn, phiên bản và hồ sơ mặt bệnh" là accordion (?tab=sources mở sẵn). Bỏ khối "Kiểm tra danh mục thuốc và dữ liệu BV199" lặp ý.
- Rà soát nguồn: ATS/IDSA HAP/VAP 2016 vẫn CURRENT (kiểm tra lại trang IDSA 26/10/2026); QĐ 2147/2026 (CAP) đã xác minh 25/10/2026; PIDS/IDSA 2023 Bảng 5 vẫn không truy cập được.
- Test: `tests/empiric/mt6-structure-test.cjs` (29 kiểm tra).

## Chuẩn hóa giao diện 69 mặt bệnh (26/10/2026, đợt sau)

- Trang phác đồ: bỏ dòng "Trạng thái x/5" lặp với trạng thái bằng chứng (vẫn còn ở tab Nguồn); giữ huy hiệu NEEDS_REVIEW/VERIFIED và CHƯA PHÊ DUYỆT HĐT&ĐT.
- Mobile: mở bệnh qua URL → phác đồ hiển thị trước, danh mục chuyển xuống cuối (CSS, không đổi dữ liệu).
- Phác đồ BYT: sửa lỗi số thứ tự tình huống hiển thị "0"; ô tìm chỉ khi > 5 tình huống; chip đối tượng chỉ khi ≥ 2 nhóm; nhãn "chưa có liều" thống nhất MISSING_DOSE_EVIDENCE.
- CAP (QĐ 2147) và HAP/VAP (Hội 2023): dòng thuốc + liều + đường dùng hiện ngay khi thu gọn; cờ "Có lưu ý / Có điểm cần kiểm tra". Khung BYT của CAP ghi rõ phác đồ có liều nằm ở module QĐ 2147.
- Tab Quốc tế: hiện 4 khuyến cáo đầu, phần còn lại thu gọn; thứ tự kinh nghiệm → điều trị đích → liều thử nghiệm (thu gọn, nhãn "không phải khuyến cáo" vẫn hiện); nút Hiệu chỉnh liều/Kháng sinh đồ thu gọn theo từng phác đồ.
- Không thay đổi dữ liệu, cảnh báo an toàn, khóa đề xuất hay trạng thái phê duyệt.

## Kết quả kiểm thử (26/10/2026)

- `tsc --noEmit`: 0 lỗi. Lint mã đã sửa: 0 lỗi (6 lỗi có sẵn ở trang cũ, xem mục dưới).
- `npm run test:empiric`: 9/9 bộ, 263 kiểm tra PASS.
- `next build`: thành công.
- Giao diện (Edge headless, 1366 px và 390 px): bộ Final 28/28 (69 bệnh), MT5 32/32, 4D.4 42/42.
- Lưu ý môi trường: gọi Edge headless từ Git Bash không chạy được sau khi Edge cập nhật lên 156 – chạy qua PowerShell. Server dev cổng 3000 từng ghi dở `.next/dev/types/validator.ts` khi có route mới; server tự ghi lại sau khi có thay đổi tệp.

## Rà soát 12 phương án khóa (26/10/2026) – tiếp tục khóa

| Phương án | Lý do khóa | Kết quả rà soát |
|---|---|---|
| r-fn-add-colistin | Colistin 6 MIU mỗi 8 giờ = 18 MIU/ngày > 12 MIU/ngày | Chưa có quyết định HĐT&ĐT – giữ khóa |
| r-copd23-in-mdr-pseudo | QĐ 2767 ghi "colistin liều nạp 5 mg/kg" không rõ mg CBA hay CMS | Đọc lại văn bản 26/10: vẫn không ghi đơn vị – giữ khóa |
| r-vmn42-* (8 phương án) | Liều theo kg QĐ 5642 cho người lớn có thể vượt liều tối đa | Không có văn bản BYT mới thay thế – giữ khóa; dùng QĐ 708 cột người lớn |
| r-vmn42-trauma-alt | Bảng không tách rõ ô phối hợp | Chưa xác định được – giữ khóa |
| r-py-iv-bl | Amoxicilin-clavulanat 875/125 mg "tiêm TM" | Nghi sai đường dùng – giữ khóa |
| r-ie-native-peds | Ciprofloxacin trẻ em "20–30 mg/24 giờ" thiếu "/kg" | Giữ khóa |

(Đếm theo ID: 2 colistin + 8 viêm màng não QĐ 5642 + r-py-iv-bl + r-ie-native-peds = 12; r-vmn42-trauma-alt nằm trong 8.)

## Còn thiếu nguồn / chờ HĐT&ĐT

1. 35 phương án MISSING_DOSE_EVIDENCE (chủ yếu QĐ 1530 bàn chân ĐTĐ – IWGDF 2023 cũng không nêu liều; QĐ 1493 hồi sức; QĐ 5643 TMH; thuốc tra mắt; clindamycin gel). Lý do từng phương án trong `MISSING_DOSE_REASON`.
2. WHO TB Module 4 (2025), WHO Cryptococcus 2022: chỉ xác định phiên bản – nội dung dạng ảnh/PDF trả lỗi 403.
3. NICE NG91 (viêm tai giữa) và UpToDate (viêm xoang): không truy cập được để đối chiếu lại liều module TMH → v8-7, v8-58, v8-60, v8-99 vẫn NEEDS_REVIEW.
4. AAO Bảng 4 (nồng độ kháng sinh tăng cường): bản trích văn bản lệch cột, chưa nhập.
5. PIDS/IDSA 2023 Bảng 5 (liều viêm khớp trẻ em), ESC 2023 chú thích Bảng 10: chưa đọc được nguyên văn.
6. Streptomycin trẻ em (lao màng não B2): QĐ 162 không có liều.
7. HĐT&ĐT: phê duyệt áp dụng (APPROVED_FOR_CLINICAL_USE) và quyết định 12 phương án khóa – nhập vào `data/antibiotics/empiric/approvals.ts`.
8. Lint: 6 lỗi có sẵn trong các trang cũ (cdss-v11, decision, decision-center, empiric, page.backup.txt, unified-v10) – không sửa vì các trang này đã chuyển hướng và giữ nguyên dữ liệu.

## Lệnh tiếp tục

```bash
npx tsc --noEmit
npx eslint lib/antibiotics components/antibiotics data/antibiotics/empiric tests/empiric
npm run test:empiric          # 9 bộ unit test, phải PASS hết
npm run audit:empiric         # cập nhật docs/empiric/AUDIT.md
npx next build                # dừng server `next start` trước khi build (dùng chung .next)
```

Khôi phục route cũ: xóa `layout.tsx` trong thư mục route (cdss-v13: khôi phục thanh điều hướng cũ từ git).
