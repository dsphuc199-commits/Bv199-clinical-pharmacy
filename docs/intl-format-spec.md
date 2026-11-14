# Đặc tả format tab "Quốc tế" (công cụ chọn kháng sinh theo chẩn đoán)

Đọc từ code ngày 14/11/2026, đối chiếu lại cùng ngày sau khi nâng cấp quy trình. Ký hiệu **[SUY LUẬN]** đánh dấu chỗ không đọc trực tiếp từ code mà do người viết suy ra hoặc đề xuất. Mọi chỗ khác trích từ các file dưới đây.

| Vai trò | File |
|---|---|
| Kiểu dòng thuốc `RxItem` | `components/antibiotics/empiric/septic-arthritis-pids2023.ts` (dòng 11) |
| UI dùng chung: `Rx`, `Grade`, `Seg`, `Row`, `Legend`, `byAllergy`, `RxToolStyle` | `components/antibiotics/empiric/rx-tool.tsx` |
| Gắn công cụ vào tab Quốc tế | `components/antibiotics/empiric/GuidelineTabs.tsx` (`IntlTab`, nhánh `diseaseId === "v8-14"` / `"v8-13"`) |
| Mẫu 1 – Nhiễm khuẩn huyết Gram âm (v8-14) | `gnb-bsi-intl.ts` (dữ liệu + luật), `GnbBsiIntl.tsx` (UI), dùng lại `esbl-idsa2026.ts` |
| Mẫu 2 – Nhiễm khuẩn huyết S. aureus (v8-13) | `sab-intl.ts` (dữ liệu + luật), `SabIntl.tsx` (UI) |

## 1. Kiểu dữ liệu TypeScript

```ts
// septic-arthritis-pids2023.ts
type RxItem = { role: string; text: string; dose?: string; grade?: string; ref: string; al?: "std" | "alt" };
// gnb-bsi-intl.ts
type Block = { title: string; lead?: string; items: RxItem[] };
// Kết quả mỗi hàm luật (empPlan, defPlan, esblPlan)
type Plan = { headline: string; blocks: Block[]; avoid: RxItem[]; notes: string[] };
// sab-intl.ts
type SabPlan = { level: "low" | "increased"; headline: string; workup: RxItem[]; final: RxItem[]; notes: string[] };
type Risk = { id: RiskId; label: string; key: boolean; ie: boolean };
```

Ý nghĩa các trường `RxItem` khi `Rx` vẽ bảng:
- `role`: cột 1 (`<th>`). Nếu đúng bằng `"Ưu tiên"` thì dòng có class `is-pref` (tô nổi). Nếu `al === "alt"`, hoặc `role` bắt đầu bằng `"Dị ứng beta-lactam"` hay `"Không dùng được beta"`, thì dòng có class `is-alg`.
- `text`: cột 2, tên thuốc hoặc nội dung khuyến cáo.
- `dose`: cột liều. Cột này chỉ xuất hiện khi ít nhất một dòng trong bảng có `dose`. Khi nguồn không có liều thì để trống (`undefined`), không tự điền.
- `grade`: chip mức khuyến cáo, xem mục 4.
- `ref`: vị trí trong nguồn, ví dụ `"Table 2.1"`, `"Q3.4"`, `"Step 2"`, `"CS 1 – Practical advice"`, `"ASHP 2020 – KC 9"`. **Không hiển thị.**
- `al`: dùng cho bộ lọc dị ứng `byAllergy`. Hai bệnh mẫu không dùng.

## 2. Trục lựa chọn

Các trục được vẽ bằng `Row label=…` cộng một trong ba điều khiển:
- `Seg`: nút chọn một, kiểu dữ liệu `T extends string`.
- `<select class="gb-sel">`.
- Checkbox `<label class="sa24-chk">`.

Trạng thái giữ bằng `useState` trong component. Trục ẩn hay hiện theo điều kiện JSX.

### Mẫu 1 – Gram âm (`GnbBsiIntl.tsx`)

| Trục | Kiểu | Giá trị (mặc định in đậm) | Hiện khi |
|---|---|---|---|
| `stage` "Giai đoạn" | Seg | **`emp`** Kinh nghiệm (nguồn tiết niệu) / `def` Đích – đã biết kiểu hình kháng | luôn hiện |
| `sev` "Mức độ nặng" | Seg | `shock` / **`sepsis`** / `none` | `stage=emp` |
| `oral` "Điều trị đường uống" | checkbox | **false** | `stage=emp` và `sev=none`; giá trị thực dùng là `sev==="none" && oral` |
| `priorEsbl`, `priorFqR`, `fq12m`, `priorPtzR` (hàng "Nguy cơ kháng thuốc") | checkbox | **false** | `stage=emp` |
| `pheno` "Kiểu hình kháng" | select | **`esbl`**, `ampc`, `cre-non`, `kpc`, `ndm`, `oxa48`, `pa-mdr`, `pa-dtr`, `crab`, `steno` (nhãn trong `PHENO_LABEL`) | `stage=def` |
| `urinary` (hàng "Người bệnh") | checkbox | **true** | `stage=def` và `pheno` ∈ {esbl, pa-dtr} |
| `severe` | checkbox | **false** | `pheno=esbl` |
| `hypoalb` "Albumin máu < 2,5 g/dL" | checkbox | **false** | `pheno=esbl` và `urinary=false` |
| `ecoli` | checkbox | **false** | `pheno=esbl` và `urinary=true` |

### Mẫu 2 – S. aureus (`SabIntl.tsx`)

| Trục | Kiểu | Giá trị | Hiện khi |
|---|---|---|---|
| `age` "Đối tượng" | Seg | **`adult`** / `child` (≥ 28 ngày) / `neo` (< 28 ngày) | luôn hiện |
| `sel` (11 yếu tố trong `RISKS`) | checkbox nhiều lựa chọn, chia 2 hàng theo `key` ("Yếu tố nguy cơ chính" / "Yếu tố nguy cơ khác"); `ie=true` thì thêm " *" | **[]** | `age=adult` |
| `final` "Kết quả thăm dò" | Seg | **`pending`** / `nofocus` / `focus` | `age=adult` |
| `pop` "Nhóm người bệnh" (vancomycin) | Seg **nằm trong vùng kết quả** | **`std`**, `obese`, `ihd`, `sled`, `crrt`, `ped`, `neo` | luôn hiện; khi đổi `age`, `pop` bị đặt lại (adult→std, child→ped, neo→neo) |

## 3. Cách mã hóa luật (tổ hợp lựa chọn → khuyến cáo)

Luật viết **thủ tục** bằng hàm TypeScript thuần, không phải bảng khai báo:

- **Gram âm, giai đoạn kinh nghiệm – `empPlan(EmpIn)`:**
  - Ba biến loại trừ: `noCeph = priorEsbl`, `noFq = priorFqR || fq12m`, `noPtz = priorPtzR`. Biến nào bật thì xóa nhóm thuốc tương ứng khỏi danh sách và thêm dòng "Loại ở bước 2" vào `avoid`.
  - Sau đó rẽ 3 nhánh:
    - `sev !== "none"`: Ưu tiên = cephalosporin + carbapenem + piperacilin-tazobactam + fluoroquinolon; Thay thế = thuốc mới.
    - Không sepsis, đường tĩnh mạch: Ưu tiên = cephalosporin + piperacilin-tazobactam + fluoroquinolon; Thay thế = carbapenem + thuốc mới.
    - Không sepsis, đường uống: Ưu tiên = fluoroquinolon + cotrimoxazol; Thay thế = beta-lactam uống.
  - `notes` được thêm theo điều kiện.
- **Gram âm, giai đoạn đích – `defPlan(DefIn)`:**
  - `switch (pheno)`. Nhánh `esbl` gọi lại `esblPlan({site: urinary ? "cuti" : "other", bacteremia: true, …})`. Nhánh `pa-dtr` rẽ tiếp theo `urinary`.
  - Liều lấy từ hằng số `A` (IDSA 2026 Table 1), `T21` (IDSA 2025 Bảng 2.1) và `T31` (Bảng 3.1).
- **S. aureus – `sabPlan(sel, final)`:**
  - `level = sel.length ? "increased" : "low"`.
  - `headline` nội suy số yếu tố và số yếu tố chính.
  - `workup` thêm dòng có điều kiện: "Yếu tố chính" khi chọn `bc48` hoặc `device`; "Viêm nội tâm mạc" khi có yếu tố `ie`, kèm **danh sách nhãn nội suy**; nhãn dòng cuối đổi theo `unknown`.
  - `final` lọc theo `final`.
  - Bảng vancomycin tra trực tiếp `VANCO[pop]`.
- **Thời gian, xuống thang, chuyển uống:**
  - Gram âm: hằng `COURSE`, luôn hiện, gồm 7 ngày so với 14 ngày (C-L), chuyển uống (C-L), tiêu chuẩn chuyển uống theo IDSA 2026. Ghi chú xuống thang nằm trong `notes` của `empPlan`.
  - S. aureus: thời gian nằm trong `final` (2 tuần, ≥ 4 tuần, cân nhắc kéo dài).

**Quy ước thể hiện "chọn một / phối hợp"** nằm trong `title` của block (ví dụ "Ưu tiên – chọn một", "Ưu tiên – phối hợp 2 thuốc") và trong `role` (ví dụ "Thuốc 1", "Thuốc 2 – chọn một"). Không có trường riêng cho việc này.

### Ánh xạ sang JSON (schema/intl-guideline.ts) **[SUY LUẬN – thiết kế đề xuất]**
- `axes[]`: `type` là `seg | select | check | multi`, có thêm `visible_when`, `default`, `group` (nhãn hàng của checkbox), `placement: "output"` (trục vẽ trong vùng kết quả) và `tip`.
- `rules[]`:
  - `kind: "primary"`: với mỗi tổ hợp hợp lệ phải khớp **đúng 1** luật primary. Luật primary mang `summary`, `blocks`, `avoid`, `notes`.
  - `kind: "addon"`: không bắt buộc khớp; block có cùng `title` thì nối thêm `items`.
  - `when`: AND của các điều kiện theo trục. Mỗi điều kiện là một trong: chuỗi, boolean, mảng ("thuộc tập"), hoặc `{includes_any, includes_none, is_empty}` cho trục multi.
  - Trục bị ẩn nhận giá trị `default` khi xét luật.
- `show_when` ở cấp **block**, **dòng thuốc** (`RxItem`) và **ghi chú** (`note`): dạng gọn. Một luật primary có thể phủ nhiều tổ hợp, mỗi dòng tự ẩn hoặc hiện theo trục (ví dụ dòng ceftriaxon có `show_when: {priorEsbl: false}`).
- `sections[]`: khối cố định có `show_when` và `position: before | after`, ví dụ Quy trình 4 bước, COURSE, các bảng vancomycin, ghi chú sơ sinh. `controls` dùng để vẽ trục có `placement: "output"`. `title` bỏ trống thì section nối tiếp section trước.
- `antibiogram_reminder` (tùy chọn, ở rule/section): UI hiện dòng "Đối chiếu Antibiogram BV199: …". Chỉ nhắc, **không tính toán**. Ngưỡng (ví dụ ≥ 80%/90%) vẫn là nội dung khuyến cáo của guideline.
- Provenance: mọi `RxItem`, `note` và `rule` đều có `source_ids`. `sources[]` gồm `id, org, title, year, version, url, accessed, population, evidence_system, grade_system`. Ngoài ra có `selection_rationale` {chosen, current_version_check, excluded[]}, `discordance[]` và `review` {state, verified_by, verified_date, next_review}.
- `icd10`: mảng mã lấy từ `data/antibiotics/empiric/icd10.ts`, hoặc "CẦN XÁC MINH".
- Logic `matches`, `effectiveState`, `combos`, `resolve` nằm trong `lib/intl-rules.ts` và được dùng chung bởi UI (`IntlGuidelineView.tsx`), validator, script sinh mẫu và test.
- JSON mẫu trong `data/guidelines/intl/_reference/` được **sinh tự động từ code** bằng `npm run build:intl-reference`:
  - Gram âm: bản đầy đủ `_reference/full/nkh-gram-am.full.json` có 82 luật, mỗi tổ hợp một luật. Bản chính `_reference/nkh-gram-am.json` là **dạng gọn 22 luật** dùng `show_when`. Dạng gọn chỉ được dùng vì mở rộng ra cả 82 tổ hợp cho nội dung giống hệt bản đầy đủ (script `scripts/lib/compact-intl.ts` kiểm, test `intl-rules-test.cjs` kiểm lại).
  - S. aureus: 11 luật primary + 2 luật addon. Dạng gọn không thay đổi gì vì luật đã dùng điều kiện multi.
  - Kiểm chứng trên trình duyệt: `tests/empiric/intl-render-browser.cjs` so innerText của vùng kết quả giữa công cụ viết tay và `IntlGuidelineView` (trang `/antibiotics/empiric/intl-preview`, chỉ mở ở dev) cho 17 kịch bản. Lần chạy 14/11/2026: 15 kịch bản giống hệt từng dòng, 2 kịch bản giống sau khi bỏ các khác biệt đã biết 1–3.

**Những điểm JSON mẫu KHÔNG tương đương hoàn toàn với UI** (do JSON tĩnh):
1. S. aureus: tiêu đề "Phân tầng" của nhóm nguy cơ tăng là câu cố định "có ít nhất 1 yếu tố nguy cơ". UI thì nội suy số yếu tố và số yếu tố chính.
2. S. aureus: dòng "Viêm nội tâm mạc" ghi chung "các yếu tố đánh dấu *". UI liệt kê đúng các yếu tố đã chọn.
3. S. aureus: dòng "Yếu tố chính" và "Viêm nội tâm mạc" (addon) đứng **cuối** block "Nguy cơ tăng". Trong UI hai dòng này đứng ngay sau dòng "Nguyên tắc".
4. S. aureus: UI đặt lại `pop` khi đổi `age`; JSON không mô tả hành vi này.
5. ~~S. aureus sơ sinh: `NEO_NOTE`~~ – đã khắc phục bằng section `neo-note` (position before, show_when age=neo).
6. Gram âm: `tip` của trục `stage` trong UI chỉ hiện khi `stage=emp`. Trong JSON tip luôn hiện vì schema chưa có `tip` theo điều kiện. Khác biệt này chỉ ở vùng form.
7. Gram âm: checkbox "Điều trị đường uống" nằm cùng hàng "Mức độ nặng" trong UI viết tay. `IntlGuidelineView` vẽ nó thành một hàng riêng có cùng nhãn. Khác biệt này chỉ ở vùng form.

## 4. Nhãn mức khuyến cáo – chất lượng bằng chứng (`Grade()` trong rx-tool.tsx)

| Mã `grade` | Chip hiển thị | Màu (class) | Ý nghĩa theo code (title/legend) | Số lần dùng trong `components/antibiotics/empiric/*` (đếm bằng grep, xấp xỉ) |
|---|---|---|---|---|
| `S-H`, `S-M`, `S-L`, `S-VL` | "Mạnh · cao/TB/thấp/rất thấp" | `sa24-g-a` (xanh lá) | GRADE: khuyến cáo mạnh · độ tin cậy bằng chứng | 2 / 31 / 11 / 5 |
| `C-H`, `C-M`, `C-L`, `C-VL` | "Có ĐK · cao/TB/thấp/rất thấp" | `sa24-g-c` (vàng) | GRADE: có điều kiện · độ tin cậy | 0 / 4 / 21 / 34 |
| `GPS` | "TH tốt" | `sa24-g-gps` | Khuyến cáo thực hành tốt | 8 |
| `CR` | "KC rõ" | `sa24-g-a` | Khuyến cáo rõ: bằng chứng tiến cứu, có đối chứng, lặp lại được | 4 |
| `RV` | "TQ lâm sàng" | `sa24-g-c` | Tổng quan lâm sàng: chưa đủ bằng chứng để đưa khuyến cáo rõ | 31 |
| `PW` | "Lộ trình IDSA" | `sa24-g-gps` | Bổ sung thực hành của Lộ trình lâm sàng IDSA, ngoài ATS/IDSA 2019 | 3 |
| `AMR` | "IDSA 2026" | `sa24-g-gps` | IDSA 2026 Gram âm kháng thuốc, không xếp mức GRADE | 40 |
| Chuỗi khác, ví dụ `A-I`, `A-II`, `A-III`, `B-I`, `B-II`, `B-III`, `C-III`, `D-III` | nguyên văn | `sa24-g-<chữ cái đầu viết thường>`: a xanh lá, b xanh dương, c vàng, d đỏ | "Mức khuyến cáo – chất lượng bằng chứng" (hệ chữ cái A–D + số La Mã I–III của nguồn) | 7 / 29 / 18 / 2 / 18 / 35 / 7 / 2 |
| `Đồng thuận` | nguyên văn | `sa24-g-đ` (xanh dương; CSS thêm ngày 14/11/2026, trước đó chip không có màu) | Nhãn văn bản của IDSA/ESCMID 2026 SAB (không xếp mức) | dùng ở sab-intl.ts |

Lưu ý:
- Không có `grade` thì không có chip. `GRADE_LEGEND` mô tả "Không nhãn" là thuốc lấy từ bảng lựa chọn theo tác nhân, không xếp mức.
- Mẫu Gram âm dùng `C-VL`, `C-L`, `GPS`. Các dòng IDSA 2026 trong mẫu Gram âm **không gắn grade**; mã `AMR` chỉ dùng ở công cụ khác.
- Mẫu S. aureus dùng `Đồng thuận`, `A-II`, `A-III`, `B-II`, `B-III`, `C-III`.
- **[SUY LUẬN]** Schema cho phép thêm chữ `E` trong hệ chữ cái – số La Mã (một số hệ phân mức IDSA cũ có mức E). Code hiện chưa dùng.
- **Hệ phân mức (`grade_system` của nguồn) – [SUY LUẬN, thiết kế]:** `GRADE` (S-/C- + H|M|L|VL, GPS), `letter-roman` (A–E + I–III), `consensus` ("Đồng thuận"), `AAP` (CR, RV), `IDSA-pathway` (PW), `IDSA-AMR` (AMR), `none`. Validator báo **lỗi** khi mã `grade` của một dòng không thuộc hệ của các nguồn trong `source_ids` của dòng đó. Mục đích là cấm quy đổi giữa các hệ. Validator không kiểm được việc nguồn có thực sự dùng một chữ cái cụ thể (ví dụ E) hay không; việc này do auditor đối chiếu.

## 5. Khối tóm tắt, nguồn, khung thẻ

- Khung: `<article class="sa24">` gồm:
  - `header`: `.sa24-eyebrow`, `h3`, rồi `ol.sa24-flow` (các bước đánh số).
  - `.sa24-form`: các `Row`.
  - `section.sa24-out`: phần kết quả.
  - `p.sa24-src`: dòng nguồn.
- Khối tóm tắt `.sa24-dx` gồm các cặp `<b>nhãn</b> nội dung`:
  - Gram âm: **Chẩn đoán** (nội suy từ trục) / **Phác đồ** (`headline`) / **Hướng dẫn** (tên guideline theo giai đoạn).
  - S. aureus: **Chẩn đoán** / **Phân tầng** / **Hướng dẫn**.
  - Vì nhãn thay đổi theo bệnh, JSON dùng `summary: {label, text}[]`.
- Thứ tự trong `.sa24-out`: tóm tắt → section "before" (Quy trình 4 bước) → blocks (h4 + `lead` + bảng Rx) → "Không dùng" (`avoid`) → "Lưu ý" (`notes`, dạng `ul`) → section "after".
- Dòng nguồn là chuỗi văn bản tự do ghi tác giả, năm, tạp chí, DOI, bảng/mục, hệ phân mức, câu "Hướng dẫn quốc tế…, chưa phải phác đồ BV199 phê duyệt".
- Trường `ref` của mỗi dòng giữ vị trí trong nguồn nhưng không có liên kết tới đối tượng nguồn. Đối tượng nguồn có cấu trúc (`IntlGuideline`: id, org, title, citation, published, url, status, checkedOn) nằm riêng trong `data/antibiotics/empiric/international.ts`. JSON mới thêm `source_ids` ở từng dòng.

## 6. "Quy trình 4 bước" (`EMP_STEPS`, mẫu Gram âm)

Là một mảng `RxItem[]` hiển thị bằng `Rx`, chỉ khi `stage=emp`, dưới tiêu đề "Quy trình 4 bước chọn kháng sinh kinh nghiệm". Mỗi bước gồm `role` = "Bước n – tên", `text` = nội dung, `ref` = "Step n" và `grade`:

| Bước | role | grade |
|---|---|---|
| 1 | Bước 1 – Mức độ nặng (SOFA tăng ≥ 2; sốc: vận mạch + lactat > 2) | C-VL |
| 2 | Bước 2 – Nguy cơ vi khuẩn kháng thuốc (cấy nước tiểu 3–6 tháng, fluoroquinolon trong 12 tháng) | C-VL |
| 3 | Bước 3 – Yếu tố riêng của người bệnh | GPS |
| 4 | Bước 4 – Kháng sinh đồ tích lũy (chỉ khi có sepsis) | C-VL |

Các bước **không** được dùng như máy trạng thái. Luật thực sự nằm trong `empPlan`; bảng 4 bước chỉ để đọc.

## 7. Ngưỡng kháng sinh đồ (≥ 80% / ≥ 90%)

- Ngưỡng là **chuỗi chữ viết cứng** lấy từ IDSA 2025 cUTI Step 4, nằm ở `EMP_STEPS[3].text` và trong `headline` của `empPlan` (`` `≥ ${sev==="shock" ? "90" : "80"}%` ``).
- Ngưỡng kháng fluoroquinolon tại chỗ (> 10% sốc, > 20% sepsis, > 45% E. coli niệu) cũng viết cứng trong `notes`.
- Các công cụ tab Quốc tế **không đọc** dữ liệu Antibiogram BV199. App có trang `app/antibiotics/antibiogram/page.tsx`, nhưng `gnb-bsi-intl.ts` không import trang này.
- JSON vì vậy ghi ngưỡng như **nội dung khuyến cáo của guideline**, không phải cấu hình. **[SUY LUẬN]** Nếu sau này muốn so với tỷ lệ nhạy tại chỗ thì phải nối với dữ liệu antibiogram của app, không được điền tay.

## 8. Trạng thái

Theo `IntlStatus` trong `international.ts`: `"extracted"` (đã trích khuyến cáo), `"identified"` (mới xác minh nguồn tồn tại, chưa trích), `"module"` (nội dung nằm ở module riêng). JSON dùng `extracted | identified` và thêm **[SUY LUẬN – đề xuất]** `no_specific_guideline`: không có guideline quốc tế riêng cho quần thể. Khi trạng thái khác `extracted` thì `status_note` là bắt buộc.

## 9. Hiển thị và quy trình xuất bản

- `components/antibiotics/empiric/IntlGuidelineView.tsx`:
  - parse zod; lỗi thì chỉ báo lỗi, không render một phần;
  - form theo `axes` có `placement: "form"`;
  - kết quả theo `resolve()`;
  - chip nhãn bằng `Grade()` dùng chung;
  - dòng Antibiogram, danh sách nguồn (tổ chức, năm, phiên bản, URL, ngày truy cập), mục khác biệt (`discordance`).
- Nhãn kiểm duyệt:
  - `draft_ai`: "Bản nháp AI – chưa kiểm duyệt" và "Cần dược sĩ/bác sĩ xác nhận trước khi áp dụng".
  - `NEXT_PUBLIC_SHOW_DRAFT_GUIDELINES=0`: chỉ hiện "Đang chờ thẩm định".
  - Bản đã thẩm định: nhãn, người và ngày thẩm định.
- `status: no_specific_guideline`: hiện "Chưa có hướng dẫn quốc tế riêng cho quần thể này – xem tab Việt Nam".
- `data/guidelines/intl/index.ts`:
  - sinh bằng `npm run build:intl-index`; chỉ quét JSON ở cấp thư mục, bỏ `_reference/`, `_held/`;
  - parse zod lúc sinh; kiểm `disease_id` có trong catalog và không trùng;
  - `IntlTab` (GuidelineTabs.tsx) dùng JSON **sau** các công cụ viết tay và không áp cho bệnh có module riêng.
  - **[SUY LUẬN – lựa chọn]** Không gắn vào `prebuild`. File index được commit và `tests/empiric/intl-rules-test.cjs` kiểm tra index đồng bộ, chạy trong `npm run test:empiric`. Lý do: tránh phụ thuộc `tsx`/esbuild khi build trên Vercel (npm hiện chặn postinstall của esbuild trên máy này).
- Hàng đợi `data/guideline-jobs/jobs.yaml`: sinh bằng `npm run build:guideline-jobs`, idempotent.
- Các lệnh: `/guideline-run`, `/guideline-live`, `/guideline-update`, `/guideline`. Subagent kiểm định: `.claude/agents/guideline-auditor.md`.
