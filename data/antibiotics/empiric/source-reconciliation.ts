/*
  FILE: data/antibiotics/empiric/source-reconciliation.ts

  Ghi chu doi chieu nguon khi mot mat benh co nhieu nguon khac nhau
  (van ban BYT, khuyen cao hoi chuyen nganh, guideline quoc te).
  Chi ghi su that da kiem tra; KHONG tu chon phac do, KHONG doi lieu.
  Tra cuu ngay 25/10/2026.
*/

export type ReconciliationNote = {
  diseaseId: string;
  title: string;
  points: string[];
  sources: { label: string; url?: string }[];
};

const KCB_2147 =
  "https://kcb.vn/tin-tuc/huong-dan-chan-doan-va-dieu-tri-viem-phoi-mac-phai-cong-dong-o-nguoi-lon.html";
const IDSA_HAP = "https://www.idsociety.org/practice-guideline/hap_vap/";
const VNRS_2023 = "https://hoihohapvietnam.org/upload/attach/VNRS-20231130151558.pdf";
const IDSA_VANCO = "https://www.idsociety.org/practice-guideline/vancomycin/";
const IDSA_AMR = "https://www.idsociety.org/practice-guideline/amr-guidance/";

const HAP_VAP_BYT =
  "Văn bản BYT mới nhất có phác đồ VPBV/VPLQTM vẫn là QĐ 1493/QĐ-BYT (22/04/2015) và QĐ 708/QĐ-BYT (02/03/2015). Tra cứu ngày 25/10/2026 chưa tìm thấy văn bản BYT mới hơn chuyên về VPBV/VPLQTM; cần xác nhận lại trên cổng chính thức của BYT.";

const HAP_VAP_SOCIETY =
  "Module bên dưới theo Khuyến cáo của Hội Hô hấp Việt Nam và Hội Hồi sức cấp cứu và Chống độc Việt Nam (10/2023). Đây là khuyến cáo hội chuyên ngành, không phải quyết định của BYT.";

const HAP_VAP_DECIDE =
  "Khi văn bản BYT và khuyến cáo mới hơn khác nhau, ứng dụng không tự chọn. Hội đồng Thuốc và Điều trị BV199 quyết định phác đồ áp dụng, dựa trên kháng sinh đồ BV199.";

export const RECONCILIATION_NOTES: ReconciliationNote[] = [
  {
    diseaseId: "v8-1",
    title: "Đối chiếu nguồn – Viêm phổi cộng đồng người lớn",
    points: [
      "Văn bản BYT hiện hành là QĐ 2147/QĐ-BYT ngày 15/7/2026, hiệu lực từ ngày ký, thay thế QĐ 4815/QĐ-BYT (20/11/2020). Đã xác minh trên kcb.vn ngày 25/10/2026.",
      "Đã ẩn các phương án CAP nặng/ICU của QĐ 1493/QĐ-BYT (2015) vì QĐ 2147 đã bao phủ các tình huống này. Phác đồ áp dụng xem trong module CAP bên dưới.",
      "Giữ mục \"Viêm phổi do hít hoặc do vi khuẩn kỵ khí\" của QĐ 1493 để tham khảo, vì module CAP chưa có mục riêng cho tình huống này. Cần đối chiếu toàn văn QĐ 2147.",
    ],
    sources: [{ label: "QĐ 2147/QĐ-BYT – kcb.vn", url: KCB_2147 }],
  },
  {
    diseaseId: "v8-4",
    title: "Đối chiếu nguồn – Viêm phổi bệnh viện",
    points: [
      HAP_VAP_BYT,
      "QĐ 708 phân nhóm theo thời điểm khởi phát (VPBV sớm/muộn), và lựa chọn đầu tay cho VPBV sớm là ceftriaxon hoặc cefotaxim. ATS/IDSA 2016 (bản hiện hành trên trang IDSA) cho rằng yếu tố nguy cơ đa kháng quan trọng hơn thời điểm khởi phát. Với VPBV không có nguy cơ tử vong cao và không có nguy cơ MRSA, ATS/IDSA 2016 gợi ý một kháng sinh có tác dụng trên MSSA: piperacilin-tazobactam, cefepim, levofloxacin, imipenem hoặc meropenem. Ceftriaxon không có trong danh sách này.",
      "Bước 4D (25/10/2026): đã trích liều Table 4 của ATS/IDSA 2016 (toàn văn PMC4981759). Khác QĐ 708 ở khoảng cách liều piperacilin-tazobactam (VPBV sớm), cefepim, imipenem/meropenem (VPBV muộn nhẹ–vừa), cách dùng vancomycin và thời gian điều trị (7 ngày so với 10–14 ngày) – xem tab So sánh. Table 4 ghi đích nồng độ đáy vancomycin \"15–20 mg/mL\"; đơn vị này nghi lỗi in (thường là µg/mL), ứng dụng giữ nguyên văn.",
      "Hai phương án QĐ 1493 (mục 5.3a, 5.3b) chỉ nêu tên thuốc, không nêu liều; vẫn ẩn mặc định. Không tự gán liều từ văn bản khác cho các phương án này.",
      HAP_VAP_SOCIETY,
      HAP_VAP_DECIDE,
    ],
    sources: [
      { label: "ATS/IDSA 2016 HAP/VAP", url: IDSA_HAP },
      { label: "Khuyến cáo VPBV/VPLQTM 2023", url: VNRS_2023 },
      { label: "Đồng thuận vancomycin ASHP/IDSA/PIDS/SIDP 2020", url: IDSA_VANCO },
    ],
  },
  {
    diseaseId: "v8-5",
    title: "Đối chiếu nguồn – Viêm phổi liên quan thở máy",
    points: [
      HAP_VAP_BYT,
      "Mục 4.3 phần VPLQTM của QĐ 708 (tr. 103–104) chỉ nêu tên thuốc. Liều đã được bổ sung ngày 25/10/2026 từ Bảng II.9 (tr. 105–106) của cùng văn bản, là bảng mà mục 4.4 dẫn chiếu; đã đối chiếu với bản trên kcb.vn. Ertapenem không có trong Bảng II.9 nên lấy theo Bảng II.11. Phần VPBV/VPLQTM của QĐ 1493 không nêu liều nên vẫn ẩn mặc định.",
      "Bước 4D (25/10/2026): đã trích liều Table 3 của ATS/IDSA 2016 (toàn văn PMC4981759). Khác Bảng II.9 ở cách dùng vancomycin (theo cân nặng, liều nạp), liều gentamycin/tobramycin, khoảng cách liều ciprofloxacin, liều colistin (ATS/IDSA tính theo mg colistin base, ứng dụng đang hiển thị theo đơn vị quốc tế của DTQG) và thời gian điều trị (7 ngày) – xem tab So sánh.",
      "Rifampicin phối hợp colistin (mục 4.3b): QĐ 708 không ghi liều; ATS/IDSA 2016 Table 3 không có rifampicin. Giữ CHƯA XÁC MINH.",
      HAP_VAP_SOCIETY,
      HAP_VAP_DECIDE,
    ],
    sources: [
      { label: "ATS/IDSA 2016 HAP/VAP", url: IDSA_HAP },
      { label: "Khuyến cáo VPBV/VPLQTM 2023", url: VNRS_2023 },
      { label: "Đồng thuận vancomycin ASHP/IDSA/PIDS/SIDP 2020", url: IDSA_VANCO },
    ],
  },
  ...["v8-11", "v8-12"].map((diseaseId) => ({
    diseaseId,
    title:
      diseaseId === "v8-11"
        ? "Đối chiếu nguồn – Sepsis chưa rõ nguồn"
        : "Đối chiếu nguồn – Sốc nhiễm khuẩn",
    points: [
      "Văn bản BYT có phác đồ kháng sinh kinh nghiệm cho nhiễm khuẩn huyết/sốc nhiễm khuẩn là QĐ 708/QĐ-BYT (02/03/2015), Chương 2, mục 4.1.2 (tr. 119–121). Tra cứu ngày 25/10/2026 chưa tìm thấy văn bản BYT mới hơn về chủ đề này; cần xác nhận lại trên cổng chính thức.",
      "Mục 4.1.2 chỉ nêu tên thuốc. Liều đã được bổ sung từ Bảng II.11 (tr. 122) và Bảng II.10 (tr. 121–122) của cùng chương; mục 4.1.4 dẫn chiếu Bảng II.11. Đã đối chiếu với bản trên kcb.vn. Thuốc không có trong hai bảng lấy từ Bảng II.9 của cùng văn bản hoặc Dược thư quốc gia VN lần 3 (2023), có ghi trang. Mục nào không có nguồn ghi CHƯA XÁC MINH.",
      "Bước 4D.1: các liều BYT khác nguồn quốc tế (vancomycin, piperacilin-tazobactam, cefepim, carbapenem, colistin) được hiển thị riêng theo từng nguồn trong mục \"ĐỐI CHIẾU LIỀU\" ở Lưu ý của phương án; ứng dụng không chọn liều thay HĐT&ĐT.",
      "Liều cần dược sĩ xác nhận (xem Lưu ý ở từng phương án): linezolid (Bảng II.11 ghi 1 lần/ngày, nghi sai); piperacilin-tazobactam mỗi 8 giờ so với mỗi 6 giờ ở các bảng khác; thời gian truyền ertapenem; daptomycin 4–6 mg/kg so với 6 mg/kg theo nhãn FDA.",
      "Surviving Sepsis Campaign 2026 (SCCM/ESICM, công bố 23/03/2026): dùng kháng sinh ngay, lý tưởng trong 1 giờ, khi có thể sốc nhiễm khuẩn hoặc có khả năng sepsis; nghi sepsis không sốc thì đánh giá nhanh, dùng kháng sinh trong 3 giờ nếu vẫn nghi nhiễm khuẩn. Chỉ bao phủ tác nhân đa kháng khi nguy cơ cao. Không thường quy kháng nấm kinh nghiệm. Truyền kéo dài beta-lactam sau liều nạp. Xuống thang khi có kết quả vi sinh. SSC không đưa phác đồ thuốc/liều cụ thể.",
    ],
    sources: [
      {
        label: "QĐ 708/QĐ-BYT – kcb.vn",
        url: "https://kcb.vn/thu-vien-tai-lieu/tai-lieu-huong-dan-su-dung-khang-sinh.html",
      },
      {
        label: "SSC 2026 – SCCM",
        url: "https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026",
      },
      { label: "Đồng thuận vancomycin ASHP/IDSA/PIDS/SIDP 2020", url: IDSA_VANCO },
    ],
  })),
  {
    diseaseId: "v8-14",
    title: "Đối chiếu nguồn – Nhiễm khuẩn huyết do Gram âm",
    points: [
      "Văn bản BYT: QĐ 708/QĐ-BYT (02/03/2015), Bảng II.10 (tr. 121). Tra cứu ngày 25/10/2026 chưa tìm thấy văn bản BYT mới hơn về chủ đề này.",
      "Bước 4D: đã đối chiếu lại bản QĐ 708 trên kcb.vn (PDF tr. 121). Dòng \"Enterobacteriaceae (không sinh ESBL)\" ở cột Kháng sinh lựa chọn vẫn chỉ có liều \"400mg x 2 đến 3 lần/ngày, tối đa không quá 1200mg/ngày, truyền tĩnh mạch\" + ceftriaxone, không có tên hoạt chất thứ nhất. Lỗi nằm trong bản phát hành chính thức, không phải do trích xuất.",
      "Chuỗi liều này trùng nguyên văn dòng ciprofloxacin của Bảng II.11 (tr. 122). Đây chỉ là nhận xét để chuyên gia xem xét; ứng dụng KHÔNG tự điền tên thuốc.",
      "Ceftriaxon 2 g mỗi 12 giờ (Bảng II.10) bằng mức tối đa 4 g/ngày của Bảng II.11 – không mâu thuẫn.",
      "Quốc tế: chưa có guideline đã xác minh cho nhiễm khuẩn huyết Gram âm nói chung; chỉ có IDSA cUTI 2025 (nguồn tiết niệu) và IDSA AMR 2026 (kiểu hình kháng thuốc).",
    ],
    sources: [
      { label: "QĐ 708/QĐ-BYT – kcb.vn", url: "https://kcb.vn/thu-vien-tai-lieu/tai-lieu-huong-dan-su-dung-khang-sinh.html" },
      { label: "IDSA AMR Guidance 2026", url: IDSA_AMR },
    ],
  },
  {
    diseaseId: "v8-6",
    title: "Đối chiếu nguồn – Đợt cấp BPTNMT",
    points: [
      "Văn bản BYT mới nhất: QĐ 2767/QĐ-BYT ngày 04/07/2023 (bản ký số trên kcb.vn), hiệu lực từ ngày ký, thay thế QĐ 3874/QĐ-BYT (26/06/2018). Phần đợt cấp BPTNMT của QĐ 708 (2015) đã được ẩn (SUPERSEDED).",
      "QĐ 2767 phân theo điều trị ngoại trú (Biểu đồ 3.1, 5–7 ngày) và nội trú (Biểu đồ 3.2, 7–10 ngày), theo yếu tố nguy cơ kết cục xấu và nguy cơ Pseudomonas. Liều đã đối chiếu bản chính thức.",
      "Bảng 3 (phụ lục, tr. 86) khác mục 3.4.3 ở liều piperacillin-tazobactam và thuốc phối hợp cho P. aeruginosa đa kháng – đã gắn cờ cần dược sĩ xác nhận.",
    ],
    sources: [{ label: "QĐ 2767/QĐ-BYT – kcb.vn", url: "https://kcb.vn/phac-do/quyet-dinh-2767-qd-byt-cua-bo-y-te-ngay-04-07-2023-ve-viec-ban-hanh-tai-lieu-chuyen-mon-huong-dan-chan-doan-va-dieu-tri-.html" }],
  },
  {
    diseaseId: "v8-135",
    title: "Đối chiếu nguồn – Thương hàn",
    points: [
      "Văn bản BYT mới nhất có phác đồ: QĐ 5642/QĐ-BYT (31/12/2015) – Hướng dẫn chẩn đoán và điều trị một số bệnh truyền nhiễm (bản trên kcb.vn). Phần thương hàn của QĐ 708 (02/03/2015) đã được ẩn (SUPERSEDED).",
    ],
    sources: [{ label: "QĐ 5642/QĐ-BYT – kcb.vn", url: "https://kcb.vn/upload/2005611/20210723//Truyen-nhiem-1.pdf" }],
  },
  ...["v8-36", "v8-104"].map((diseaseId) => ({
    diseaseId,
    title: "Đối chiếu nguồn – Viêm màng não nhiễm khuẩn",
    points: [
      "Hai văn bản BYT cùng được hiển thị: QĐ 5642/QĐ-BYT (31/12/2015, mới hơn) và QĐ 708/QĐ-BYT (02/03/2015).",
      "Phác đồ theo lứa tuổi của hai văn bản tương tự; bảng liều QĐ 5642 tính theo mg/kg/ngày, không tách liều người lớn, trong khi QĐ 708 Bảng II.20 có cột liều người lớn cố định. Không tự chọn – cần Hội đồng Thuốc và Điều trị BV199 thống nhất.",
      "Bước 4D Nhóm 2 (25/10/2026): đã đối chiếu lại nguyên văn QĐ 708 (tr. 230–233) và QĐ 5642 (tr. 18–20) trên kcb.vn – liều trong ứng dụng khớp văn bản. Hai văn bản còn hiệu lực; tra cứu chưa thấy văn bản BYT mới hơn về viêm màng não. QĐ 3312/QĐ-BYT (2015, Nhi khoa) chưa tìm được bản trên cổng chính thức – CHƯA XÁC MINH.",
      "Hai văn bản BYT khác nhau về liều dexamethason (QĐ 708: 0,6 mg/kg/ngày; QĐ 5642: 0,4 mg/kg/ngày) và cùng ghi chung, không loại trừ trẻ sơ sinh. WHO 2026 không khuyến cáo corticosteroid ở trẻ sơ sinh.",
      "QĐ 708 Bảng II.20 chú thích f ghi đích đáy vancomycin \"15-20 mg/ml\" – nghi lỗi in, ứng dụng không quy đổi. WHO 2026 ghi 15–20 mg/L.",
      "Quốc tế: WHO 2025 (hướng dẫn) và sổ tay thực hành WHO 2026 (bảng liều người lớn, trẻ em, sơ sinh) – tải từ kho IRIS chính thức. IDSA 2004 đã ARCHIVED; ESCMID 2016 và NICE NG240 chưa truy cập được.",
    ],
    sources: [
      { label: "QĐ 5642/QĐ-BYT – kcb.vn", url: "https://kcb.vn/upload/2005611/20210723//Truyen-nhiem-1.pdf" },
      { label: "QĐ 708/QĐ-BYT – kcb.vn", url: "https://kcb.vn/thu-vien-tai-lieu/tai-lieu-huong-dan-su-dung-khang-sinh.html" },
      { label: "WHO 2025 – hướng dẫn viêm màng não (IRIS)", url: "https://iris.who.int/handle/10665/381006" },
      { label: "WHO 2026 – sổ tay thực hành (IRIS)", url: "https://iris.who.int/handle/10665/386139" },
    ],
  })),
  ...["v8-113", "v8-116"].map((diseaseId) => ({
    diseaseId,
    title: "Đối chiếu nguồn – Sốt giảm bạch cầu trung tính",
    points: [
      "Văn bản BYT: QĐ 708/QĐ-BYT (02/03/2015), Chương 11 Suy giảm miễn dịch, tr. 252–254 – còn hiệu lực; tra cứu chưa thấy văn bản BYT mới hơn chuyên về sốt giảm bạch cầu. Đã đối chiếu lại nguyên văn trên kcb.vn: liều trong ứng dụng khớp văn bản.",
      "Phác đồ QĐ 708 ghi \"theo khuyến cáo của IDSA\" (IDSA 2010). Trang IDSA hiện ghi hướng dẫn này ARCHIVED.",
      "Phạm vi QĐ 708: người lớn nguy cơ cao (ANC < 500/µl > 7 ngày, bệnh kèm, rối loạn chức năng gan thận, MASCC < 21). Không có phác đồ nguy cơ thấp, không có liều trẻ em, chương này không nêu kháng nấm.",
      "Colistin 6.000.000 đơn vị mỗi 8 giờ (18 MIU/ngày) vượt mức tối đa 12 MIU/ngày của Dược thư đang hiển thị trong ứng dụng – xem \"ĐỐI CHIẾU LIỀU – Colistin\".",
      "Quốc tế: ECIL-10 (2025, bộ slide khuyến cáo chính thức trên ecil-leukaemia.com) và IPFN 2023 (trẻ em, toàn văn mở). Hai nguồn không ghi liều. ESMO 2016 và NICE CG151 chưa truy cập được.",
    ],
    sources: [
      { label: "QĐ 708/QĐ-BYT – kcb.vn", url: "https://kcb.vn/thu-vien-tai-lieu/tai-lieu-huong-dan-su-dung-khang-sinh.html" },
      { label: "ECIL-10 – khuyến cáo vi khuẩn", url: "https://ecil-leukaemia.com/images/ecil-10/ECIL_10_-_bacterial_group_final_recommendations.pdf" },
      { label: "IPFN 2023 – J Clin Oncol", url: "https://doi.org/10.1200/JCO.22.02224" },
    ],
  })),
  {
    diseaseId: "v8-13",
    title: "Đối chiếu nguồn – Nhiễm khuẩn huyết do S. aureus",
    points: [
      "Văn bản BYT: QĐ 708/QĐ-BYT (2015), Bảng II.10 (tr. 121–122) – còn hiệu lực; chỉ nêu thuốc và liều, không nêu cấy máu kiểm tra, siêu âm tim, phân loại biến chứng hay thời gian điều trị.",
      "Quốc tế: IDSA/ESCMID 2026 Part 1 (09/09/2026, CURRENT) – phân tầng nguy cơ thay cho \"có/không biến chứng\", cấy máu kiểm tra, TTE/TEE, chẩn đoán hình ảnh, thời gian 14 ngày. Lựa chọn thuốc MSSA/MRSA chưa công bố.",
      "IDSA MRSA 2011 đã ARCHIVED – không dùng làm nguồn hiện hành.",
    ],
    sources: [
      { label: "IDSA/ESCMID SAB 2026", url: "https://www.idsociety.org/practice-guideline/staphylococcus-aureus-bacteremia/" },
      { label: "Đồng thuận vancomycin 2020", url: IDSA_VANCO },
    ],
  },
  {
    diseaseId: "v8-26",
    title: "Đối chiếu nguồn – Nhiễm khuẩn đường ruột xâm lấn",
    points: [
      "QĐ 5642/QĐ-BYT (31/12/2015) có phác đồ lỵ trực khuẩn (Shigella); QĐ 708 (2015) bao phủ tiêu chảy do vi khuẩn nói chung. Hai văn bản bổ sung nhau nên đều được hiển thị.",
    ],
    sources: [{ label: "QĐ 5642/QĐ-BYT – kcb.vn", url: "https://kcb.vn/upload/2005611/20210723//Truyen-nhiem-1.pdf" }],
  },
  {
    diseaseId: "v8-46",
    title: "Đối chiếu nguồn – Pseudomonas aeruginosa DTR",
    points: [
      "Phác đồ BYT bên dưới (QĐ 708, Bảng II.10, tr. 121) dành cho P. aeruginosa nói chung, không dành cho chủng DTR. Các thuốc trong phác đồ (ceftazidim, cefepim, piperacilin-tazobactam) đều thuộc danh sách mà chủng DTR không nhạy.",
      "Các văn bản BYT đang dùng không có phác đồ riêng cho DTR. Nội dung DTR lấy từ IDSA 2026 (mục Guideline quốc tế), là nguồn quốc tế. Chưa đối chiếu với danh mục thuốc sẵn có của BV199.",
    ],
    sources: [{ label: "IDSA AMR Guidance 2026", url: IDSA_AMR }],
  },

  /* ===== Buoc 4D Nhom 3 (26/10/2026) ===== */
  {
    diseaseId: "v8-39",
    title: "Đối chiếu nguồn – Viêm nội tâm mạc nhiễm khuẩn",
    points: [
      "Văn bản BYT: QĐ 708/QĐ-BYT (2015), mục 4.2 (tr. 129–130) – còn hiệu lực; tra cứu chưa thấy văn bản BYT mới hơn về viêm nội tâm mạc. Đã đối chiếu lại nguyên văn trên kcb.vn: liều trong ứng dụng khớp văn bản.",
      "Văn bản ghi \"một trong ba lựa chọn\" nhưng chỉ liệt kê hai phương án người lớn và một phương án trẻ em. Liều ciprofloxacin trẻ em ghi \"20 - 30mg/24giờ\" (không có /kg) – giữ nguyên, có cảnh báo.",
      "Quốc tế: ESC 2023 (bản hiện hành, thay bản 2015) – Bảng khuyến cáo 10 về điều trị kinh nghiệm đọc từ ảnh bảng của nhà xuất bản; chú thích d, e chưa đọc được. Bảng điều trị theo tác nhân chưa trích.",
    ],
    sources: [
      { label: "QĐ 708/QĐ-BYT – kcb.vn", url: "https://kcb.vn/thu-vien-tai-lieu/tai-lieu-huong-dan-su-dung-khang-sinh.html" },
      { label: "ESC 2023 – Endocarditis", url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/endocarditis/" },
    ],
  },
  {
    diseaseId: "v8-2",
    title: "Đối chiếu nguồn – Nhiễm khuẩn tiết niệu phức tạp",
    points: [
      "Phác đồ BYT gắn với mặt bệnh này là QĐ 708 mục Sỏi thận tiết niệu có biến chứng nhiễm khuẩn (tr. 242–243) – đã đối chiếu nguyên văn trên kcb.vn. Tên mặt bệnh và nội dung chưa khớp: cần HĐT&ĐT quyết định đổi tên hoặc tách mặt bệnh.",
      "Bước 4D.4: đổi tên mặt bệnh thành \"Nhiễm khuẩn tiết niệu phức tạp\" (hội chứng). Kiểu hình ESBL (điều trị theo tác nhân/kháng sinh đồ, IDSA AMR 2026) đã chuyển sang mặt bệnh \"Enterobacterales sinh ESBL\" (v8-43) – không dùng làm phác đồ kinh nghiệm.",
      "Kinh nghiệm: QĐ 708 (sỏi nhiễm khuẩn), IDSA cUTI 2025 Bảng 1.1, EAU 2026 mục 3.7.4. Điều kiện fluoroquinolon (EAU): kháng tại chỗ < 10% và có chống chỉ định thuốc khác; không dùng cho người bệnh khoa tiết niệu hoặc đã dùng trong 6 tháng (IDSA: 12 tháng). Kiểm soát ổ nhiễm: xử trí tắc nghẽn, sỏi, ống thông.",
      "IDSA cUTI 2025 Bảng 2.1 là liều dùng trong thử nghiệm lâm sàng, không phải bảng liều khuyến cáo.",
    ],
    sources: [
      { label: "IDSA cUTI 2025", url: "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/" },
      { label: "EAU Urological Infections 2026", url: "https://uroweb.org/guidelines/urological-infections" },
      { label: "IDSA AMR Guidance 2026", url: IDSA_AMR },
    ],
  },
  {
    diseaseId: "v8-17",
    title: "Đối chiếu nguồn – Viêm thận bể thận",
    points: [
      "Văn bản BYT: QĐ 708 (2015), Viêm thận bể thận cấp (tr. 236–238) – đã đối chiếu nguyên văn trên kcb.vn. QĐ 2388/QĐ-BYT (2024, bệnh lý thận) không có phác đồ kháng sinh cho mặt bệnh này.",
      "Nguyên văn có điểm cần thẩm định: amoxicilin-clavulanat 875/125 mg ghi tiêm TM; imipenem-cilastatin \"250 - 500 mg x 4 - 3 lần/ngày\"; thời gian vừa ghi 10–14 ngày vừa ghi \"duy trì 3 tuần\".",
      "Quốc tế: EAU 2026 Bảng 5–6 (có liều) và IDSA cUTI 2025 Bảng 1.1, 1.2, 2.1. EAU Bảng 6 ghi levofloxacin ở dòng tĩnh mạch là \"oral\" – nguyên văn, nghi lỗi in.",
    ],
    sources: [
      { label: "EAU Urological Infections 2026", url: "https://uroweb.org/guidelines/urological-infections" },
      { label: "IDSA cUTI 2025", url: "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/" },
    ],
  },
  {
    diseaseId: "v8-33",
    title: "Đối chiếu nguồn – Viêm khớp nhiễm khuẩn",
    points: [
      "Văn bản BYT: QĐ 708 (2015), mục 4.2.1 (tr. 164–165) – đã đối chiếu nguyên văn trên kcb.vn. QĐ 361/QĐ-BYT (2014, cơ xương khớp) cũ hơn, chưa đối chiếu bản chính thức, không dùng trong ứng dụng.",
      "QĐ 708 không tách liều người lớn và trẻ em. Ceftazidim ghi hai mức liều (2 g x 2–3 lần/ngày khi nghi; 1 g mỗi 8 giờ khi đã xác định) – giữ nguyên.",
      "Quốc tế: PIDS/IDSA 2023 chỉ áp dụng cho trẻ em; bảng liều không có trên trang IDSA. Người lớn: chưa có hướng dẫn quốc tế hiện hành đã xác minh.",
    ],
    sources: [
      { label: "QĐ 708/QĐ-BYT – kcb.vn", url: "https://kcb.vn/thu-vien-tai-lieu/tai-lieu-huong-dan-su-dung-khang-sinh.html" },
      { label: "PIDS/IDSA 2023 – Acute Bacterial Arthritis in Pediatrics", url: "https://www.idsociety.org/practice-guideline/acute-bacterial-arthritis-in-pediatrics2/" },
    ],
  },
  {
    diseaseId: "v9-1",
    title: "Đối chiếu nguồn – Nhiễm trùng bàn chân đái tháo đường",
    points: [
      "Văn bản BYT: QĐ 1530/QĐ-BYT (24/03/2023), Phụ lục 02 (tr. 32–33) – chỉ nêu nhóm thuốc, không có liều. IWGDF/IDSA 2023 cũng không nêu liều cụ thể.",
      "Trạng thái giữ MISSING_EVIDENCE: không có nguồn đã xác minh nêu liều cho mặt bệnh này; ứng dụng không suy diễn liều.",
      "Cần HĐT&ĐT ban hành bảng liều theo chuyên luận thuốc (Dược thư quốc gia) và chức năng thận.",
      "Bước 4D.4: 15 hoạt chất nêu tên trong phác đồ QĐ 1530 đã có chuyên luận Dược thư 2023 trong module Hiệu chỉnh liều (5 đã đối chiếu trang nguồn: amoxicilin-clavulanat, ticarcilin-clavulanat, piperacilin-tazobactam, ceftazidim, colistin; 10 chưa đối chiếu: clindamycin, levofloxacin, moxifloxacin, doxycyclin, ampicilin-sulbactam, sulfamethoxazol-trimethoprim, linezolid, ciprofloxacin, metronidazol, rifampicin). Đây là liều theo chỉ định chung của chuyên luận – không tự gán làm liều phác đồ nhiễm trùng bàn chân.",
    ],
    sources: [
      { label: "IWGDF/IDSA 2023", url: "https://iwgdfguidelines.org/wp-content/uploads/2023/07/IWGDF-2023-04-Infection-Guideline.pdf" },
    ],
  },
];

export function getReconciliationNote(
  diseaseId: string
): ReconciliationNote | undefined {
  return RECONCILIATION_NOTES.find((note) => note.diseaseId === diseaseId);
}
