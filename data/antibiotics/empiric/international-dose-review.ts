/** Source comparisons only. Not imported by selection engines or approval registries. */
export type ReviewedDose = { drug: string; dose: string; route: string; interval: string; condition?: string };
export type DoseReview = {
  id: string; diseaseIds: string[]; source: string; published: string; url: string;
  locator: string; condition: string; duration?: string; cautions: string[];
  approval: "NOT_APPROVED"; rows: ReviewedDose[];
  population?: "adult" | "child";
};
const aceUrl="https://www.ace-hta.gov.sg/healthcare-professionals/ace-repository-for-clinical-guidelines/bacterial-skin-and-soft-tissue-infections----diagnosis-and-antibiotic-prescribing/";
export const INTERNATIONAL_DOSE_REVIEWS: DoseReview[] = [
  {
    id:"arthritis-pids-idsa-child-table5",diseaseIds:["v8-33"],population:"child",source:"PIDS/IDSA",published:"2023 · bài báo 2024",
    url:"https://www.idsociety.org/practice-guideline/acute-bacterial-arthritis-in-pediatrics2/",
    locator:"Table5, PDF35–36; đối chiếu tác nhân Table4, PDF33. Bản đính chính2024 piae065 đã xác định tồn tại nhưng chưa truy cập toàn văn; không trích levofloxacin.",
    condition:"Trẻ từ 1 tháng đến 17 tuổi, trước đó khỏe mạnh, bị viêm khớp nhiễm khuẩn cấp do vi khuẩn. Không áp dụng cho sơ sinh. Các hàng là lựa chọn riêng theo tác nhân và độ nhạy, không phải phối hợp tất cả.",
    approval:"NOT_APPROVED",
    cautions:["Mg/kg/ngày là tổng liều ngày, không phải liều mỗi lần.","MSSA: cefazolin, oxacilin hoặc nafcilin; clindamycin cần tác nhân nhạy.","Nghi K. kingae: cần đánh giá bao phủ riêng.","Hàng đường tiêm giữ phạm vi parenteral của bảng; cần chốt đường tiêm cụ thể theo chế phẩm.","Chỉ chuyển uống khi đủ điều kiện lâm sàng và kiểm soát ổ nhiễm.","Còn thẩm định trần liều, thận/gan và thời gian từng nhánh."],
    rows:[
      {drug:"Cefazolin",dose:"100–150 mg/kg/ngày",route:"Đường tiêm",interval:"Chia liều mỗi 8 giờ"},
      {drug:"Oxacilin",dose:"100–200 mg/kg/ngày",route:"Đường tiêm",interval:"Chia liều mỗi 6 giờ"},
      {drug:"Nafcilin",dose:"100–200 mg/kg/ngày",route:"Đường tiêm",interval:"Chia liều mỗi 6 giờ"},
      {drug:"Clindamycin",dose:"30–40 mg/kg/ngày",route:"Đường tiêm",interval:"Chia liều mỗi 6–8 giờ"},
      {drug:"Amoxicillin",dose:"50–100 mg/kg/ngày",route:"Uống",interval:"Chia liều mỗi 8 giờ",condition:"Tác nhân nhạy; giai đoạn điều trị uống phù hợp"},
      {drug:"Cefalexin",dose:"75–100 mg/kg/ngày",route:"Uống",interval:"Chia 3–4 lần/ngày",condition:"Điều trị uống theo tác nhân, thường MSSA nhạy"},
      {drug:"Clindamycin",dose:"30–40 mg/kg/ngày",route:"Uống",interval:"Chia 3–4 lần/ngày",condition:"Tác nhân nhạy; đủ điều kiện chuyển uống"},
    ],
  },
  {
    id:"arthritis-seimc-adult-gramnegative",diseaseIds:["v8-33"],population:"adult",source:"GEIO–SEIMC/SEIP/SECOT",published:"2024",
    url:"https://seimc.org/wp-content/uploads/2025/05/seimc-geio-gc-2024-Artritis_Septica.pdf",
    locator:"Phần điều trị kinh nghiệm người lớn, PDF/tr.in30. Liều có trong đoạn văn, không phải bảng liều đầy đủ của mọi tác nhân.",
    condition:"Người lớn, nhánh nghi vi khuẩn Gram âm. Ceftriaxon hoặc cefotaxim là các lựa chọn riêng trong nhánh bao phủ này; không phải phác đồ đơn trị mặc định cho mọi viêm khớp nhiễm khuẩn.",
    approval:"NOT_APPROVED",
    cautions:["Cần đánh giá bao phủ tụ cầu và nguy cơ MRSA riêng. Khi nghi P. aeruginosa hoặc Gram âm đa kháng, không áp dụng mặc định hai lựa chọn này.","Bảng này chỉ trình bày liều có thể đối chiếu trực tiếp trong đoạn nguồn đã đọc; chưa đủ các nhánh người lớn, hiệu chỉnh thận/gan hoặc thời gian điều trị."],
    rows:[
      {drug:"Ceftriaxon",dose:"2 g",route:"Tĩnh mạch",interval:"Mỗi 24 giờ"},
      {drug:"Cefotaxim",dose:"2 g",route:"Tĩnh mạch",interval:"Mỗi 8 giờ"},
    ],
  },
  {
    id:"ssti-purulent-idsa-adult",diseaseIds:["v8-28"],source:"IDSA",published:"2014",url:"https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
    locator:"Table 2, MRSA SSTI, PDF5/tr.in e14; Figure1 và mụcII; trang IDSA ghi CURRENT khi kiểm tra06/11/2026. Linezolid: đối chiếu thêm nhãn Macleods trên DailyMed, sửa07/2026, mục2/Table1; setid90dd8c13-c428-4472-91e5-5b1fcdc4fce3.",
    condition:"Người lớn, nhiễm khuẩn da có mủ cần kháng sinh bao phủ MRSA; lựa chọn theo mức độ nặng, vi sinh và khả năng dùng đường uống. Các dòng là lựa chọn riêng, không phải phối hợp.",
    approval:"NOT_APPROVED",
    cautions:["Đánh giá chỉ định dẫn lưu. Doxycyclin không được ngoại suy sang trẻ em hoặc thai kỳ; cần kiểm tra chống chỉ định.","Clindamycin cần đánh giá kháng thuốc cảm ứng. Linezolid cần kiểm tra tương tác và theo dõi huyết học.","Chưa xác minh toàn diện thận/gan, tốc độ truyền, liều tối đa và thời gian cho từng nhánh; không thay thế phác đồ đang sử dụng."],
    rows:[
      {drug:"Doxycyclin",dose:"100 mg",route:"Uống",interval:"2 lần/ngày"},
      {drug:"Clindamycin",dose:"300–450 mg",route:"Uống",interval:"4 lần/ngày"},
      {drug:"Clindamycin",dose:"600 mg",route:"Tĩnh mạch",interval:"Mỗi 8 giờ"},
      {drug:"Linezolid",dose:"600 mg",route:"Tĩnh mạch hoặc uống",interval:"Mỗi 12 giờ",condition:"Nhiễm khuẩn da có biến chứng; không ngoại suy sang mọi thể không biến chứng hoặc sang trẻ em."},
    ],
  },
  {
    id:"ssti-nonpurulent-ace-adult",diseaseIds:["v8-27"],source:"ACE Singapore",published:"09/2026",url:aceUrl,locator:"Supplement2 Table2–3, PDF3–4; thời gian PDF1; ACG mục5",
    condition:"Người lớn, viêm mô bào không mủ: đường uống ở thể nhẹ; đường tĩnh mạch ở thể nặng. Không áp bảng này cho nhiễm MRSA có mủ hoặc nhiễm khuẩn hoại tử.",
    duration:"Thường 5–7 ngày; đánh giá lại theo đáp ứng.",approval:"NOT_APPROVED",
    cautions:["Các thuốc là lựa chọn đơn trị riêng theo điều kiện; không phối hợp tất cả.","Một số nhãn cephalosporin/clindamycin yêu cầu ít nhất 10 ngày khi nhiễm liên cầu beta tan máu; cần đối chiếu tác nhân và đúng chế phẩm.","Bảng tham khảo chưa hoàn tất hiệu chỉnh thận/gan và quy trình truyền."],
    rows:[
      {drug:"Cefalexin",dose:"500 mg",route:"Uống",interval:"4 lần/ngày"},
      {drug:"Cloxacillin",dose:"250–500 mg",route:"Uống",interval:"4 lần/ngày"},
      {drug:"Cefazolin",dose:"3–6 g/ngày",route:"Tĩnh mạch",interval:"Chia 3 lần/ngày"},
      {drug:"Ceftriaxon",dose:"1–2 g",route:"Tĩnh mạch",interval:"1 lần/ngày"},
    ],
  },
  {
    id:"ssti-purulent-ace-adult",diseaseIds:["v8-28"],source:"ACE Singapore",published:"09/2026",url:aceUrl,locator:"ACG mục4; Supplement2 Table2, PDF3; thời gian PDF1",
    condition:"Người lớn, nhọt/cụm nhọt/áp xe cần kháng sinh uống theo đánh giá mức độ và kiểm soát ổ nhiễm. Bảng không cung cấp lựa chọn bao phủ MRSA mặc định; cần chọn theo vi sinh và nguy cơ.",
    duration:"Thường 7–10 ngày; điều chỉnh theo diễn biến.",approval:"NOT_APPROVED",
    cautions:["Đánh giá dẫn lưu. Không đồng nhất khái niệm nhiễm khuẩn da có mủ với viêm mô bào không mủ.","Liều clindamycin trong ACE khác cách chia liều IDSA; giữ riêng từng nguồn, không ghép thành một khoảng liều mới."],
    rows:[
      {drug:"Cloxacillin",dose:"250–500 mg",route:"Uống",interval:"4 lần/ngày"},
      {drug:"Clindamycin",dose:"450–600 mg",route:"Uống",interval:"3 lần/ngày",condition:"Nhánh dị ứng penicillin"},
    ],
  },
];
