export type GuidelineSourceId = "UMC2023" | "BM2023" | "XP2025";

export type GuidelineSource = {
  id: GuidelineSourceId;
  name: string;
  year: number;
  localPdfPath?: string;
  sourceFormat: "TEXT_PDF" | "SCANNED_PDF";
  note: string;
};

export type GuidelineSectionIndex = {
  id: string;
  sourceId: GuidelineSourceId;
  title: string;
  printedStart?: number;
  printedEnd?: number;
  pdfStart: number;
  pdfEnd: number;
  verification: "EXACT_TEXT" | "SOURCE_PDF_VISUAL";
};

export const guidelineSources: GuidelineSource[] = [
  {
    id: "UMC2023",
    name: "Bệnh viện Đại học Y Dược TP.HCM - Hướng dẫn sử dụng kháng sinh",
    year: 2023,
    localPdfPath: "/guidelines/umc-2023.pdf",
    sourceFormat: "TEXT_PDF",
    note: "Có lớp text; có thể trích xuất nguyên văn theo trang.",
  },
  {
    id: "BM2023",
    name: "Bệnh viện Bạch Mai - Hướng dẫn sử dụng kháng sinh trong lâm sàng",
    year: 2023,
    localPdfPath: "/guidelines/bach-mai-2023.pdf",
    sourceFormat: "SCANNED_PDF",
    note: "Bản scan; không tự coi OCR là nguyên văn. Dùng trang PDF gốc để xác minh thuốc/liều.",
  },
  {
    id: "XP2025",
    name: "Bệnh viện Đa khoa Xanh Pôn - Hướng dẫn sử dụng kháng sinh",
    year: 2025,
    localPdfPath: "/guidelines/xanh-pon-2025.pdf",
    sourceFormat: "SCANNED_PDF",
    note: "Bản scan; không tự coi OCR là nguyên văn. Dùng trang PDF gốc để xác minh thuốc/liều.",
  },
];

// UMC: printed page 1 tương ứng PDF page 11 => pdf = printed + 10.
export const umc2023SectionIndex: GuidelineSectionIndex[] = [
  { id:"umc-sepsis", sourceId:"UMC2023", title:"Nhiễm khuẩn huyết", printedStart:1, printedEnd:6, pdfStart:11, pdfEnd:16, verification:"EXACT_TEXT" },
  { id:"umc-respiratory", sourceId:"UMC2023", title:"Nhiễm khuẩn hô hấp", printedStart:7, printedEnd:20, pdfStart:17, pdfEnd:30, verification:"EXACT_TEXT" },
  { id:"umc-urinary", sourceId:"UMC2023", title:"Nhiễm khuẩn niệu", printedStart:21, printedEnd:28, pdfStart:31, pdfEnd:38, verification:"EXACT_TEXT" },
  { id:"umc-abdominal", sourceId:"UMC2023", title:"Nhiễm khuẩn ổ bụng - hệ mật", printedStart:29, printedEnd:45, pdfStart:39, pdfEnd:55, verification:"EXACT_TEXT" },
  { id:"umc-ssti", sourceId:"UMC2023", title:"Nhiễm khuẩn da - mô mềm", printedStart:46, printedEnd:68, pdfStart:56, pdfEnd:78, verification:"EXACT_TEXT" },
  { id:"umc-cns", sourceId:"UMC2023", title:"Nhiễm khuẩn thần kinh trung ương", printedStart:69, printedEnd:74, pdfStart:79, pdfEnd:84, verification:"EXACT_TEXT" },
  { id:"umc-ie", sourceId:"UMC2023", title:"Viêm nội tâm mạc nhiễm khuẩn", printedStart:75, printedEnd:84, pdfStart:85, pdfEnd:94, verification:"EXACT_TEXT" },
  { id:"umc-micro", sourceId:"UMC2023", title:"Dữ liệu vi sinh lâm sàng", printedStart:85, printedEnd:97, pdfStart:95, pdfEnd:107, verification:"EXACT_TEXT" },
  { id:"umc-prophylaxis", sourceId:"UMC2023", title:"Kháng sinh dự phòng trong phẫu thuật", printedStart:98, printedEnd:147, pdfStart:108, pdfEnd:157, verification:"EXACT_TEXT" },
];

// Bạch Mai: mục lục scan cho thấy printed p9 tương ứng PDF p2 => pdf = printed - 7.
// Các range dưới đây bám mục lục nguồn. Với bản scan, mở PDF gốc để xác minh chi tiết thuốc/liều.
export const bachMai2023SectionIndex: GuidelineSectionIndex[] = [
  { id:"bm-severe-sepsis", sourceId:"BM2023", title:"Nhiễm khuẩn nặng và sốc nhiễm khuẩn", printedStart:153, printedEnd:158, pdfStart:146, pdfEnd:151, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-cns", sourceId:"BM2023", title:"Nhiễm trùng thần kinh trung ương", printedStart:159, printedEnd:176, pdfStart:152, pdfEnd:169, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-eye", sourceId:"BM2023", title:"Nhiễm trùng mắt", printedStart:229, printedEnd:232, pdfStart:222, pdfEnd:225, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-ie", sourceId:"BM2023", title:"Viêm nội tâm mạc nhiễm khuẩn", printedStart:233, printedEnd:243, pdfStart:226, pdfEnd:236, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-respiratory", sourceId:"BM2023", title:"Nhiễm trùng hô hấp", printedStart:244, printedEnd:268, pdfStart:237, pdfEnd:261, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-abdominal", sourceId:"BM2023", title:"Nhiễm trùng tiêu hóa", printedStart:269, printedEnd:274, pdfStart:262, pdfEnd:267, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-gu", sourceId:"BM2023", title:"Nhiễm trùng thận - tiết niệu và cơ quan sinh dục nam", printedStart:275, printedEnd:297, pdfStart:268, pdfEnd:290, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-obgyn", sourceId:"BM2023", title:"Nhiễm trùng sản - phụ khoa", printedStart:298, printedEnd:301, pdfStart:291, pdfEnd:294, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-bone-joint", sourceId:"BM2023", title:"Nhiễm trùng cơ - xương - khớp", printedStart:302, printedEnd:347, pdfStart:295, pdfEnd:340, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-ssti", sourceId:"BM2023", title:"Nhiễm trùng da - mô mềm", printedStart:348, printedEnd:389, pdfStart:341, pdfEnd:382, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-solid-tumor", sourceId:"BM2023", title:"Nhiễm trùng ở bệnh nhân ung thư tạng đặc", printedStart:390, printedEnd:396, pdfStart:383, pdfEnd:389, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-neutropenia", sourceId:"BM2023", title:"Sốt nhiễm trùng ở bệnh nhân giảm bạch cầu hạt", printedStart:397, printedEnd:399, pdfStart:390, pdfEnd:392, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-immunosuppression", sourceId:"BM2023", title:"Nhiễm trùng ở người dùng thuốc ức chế miễn dịch kéo dài", printedStart:400, printedEnd:407, pdfStart:393, pdfEnd:400, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-hiv", sourceId:"BM2023", title:"Nhiễm trùng cơ hội trên người nhiễm HIV/AIDS", printedStart:408, printedEnd:423, pdfStart:401, pdfEnd:416, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-mdr", sourceId:"BM2023", title:"Nhiễm trùng do tác nhân đa kháng kháng sinh", printedStart:424, printedEnd:432, pdfStart:417, pdfEnd:425, verification:"SOURCE_PDF_VISUAL" },
  { id:"bm-invasive-fungal", sourceId:"BM2023", title:"Nhiễm nấm xâm lấn", printedStart:433, printedEnd:445, pdfStart:426, pdfEnd:438, verification:"SOURCE_PDF_VISUAL" },
];

// Xanh Pôn: printed p14 tương ứng PDF p6 => pdf = printed - 8.
export const xanhPon2025SectionIndex: GuidelineSectionIndex[] = [
  { id:"xp-cns", sourceId:"XP2025", title:"Nhiễm khuẩn thần kinh", printedStart:54, printedEnd:67, pdfStart:46, pdfEnd:59, verification:"SOURCE_PDF_VISUAL" },
  { id:"xp-respiratory", sourceId:"XP2025", title:"Nhiễm khuẩn hô hấp", printedStart:68, printedEnd:106, pdfStart:60, pdfEnd:98, verification:"SOURCE_PDF_VISUAL" },
  { id:"xp-cardiac", sourceId:"XP2025", title:"Nhiễm khuẩn tim mạch", printedStart:107, printedEnd:113, pdfStart:99, pdfEnd:105, verification:"SOURCE_PDF_VISUAL" },
  { id:"xp-gi", sourceId:"XP2025", title:"Nhiễm khuẩn tiêu hóa", printedStart:114, printedEnd:126, pdfStart:106, pdfEnd:118, verification:"SOURCE_PDF_VISUAL" },
  { id:"xp-urinary", sourceId:"XP2025", title:"Nhiễm khuẩn tiết niệu", printedStart:127, printedEnd:132, pdfStart:119, pdfEnd:124, verification:"SOURCE_PDF_VISUAL" },
  { id:"xp-ssti", sourceId:"XP2025", title:"Nhiễm khuẩn da và mô mềm", printedStart:133, printedEnd:147, pdfStart:125, pdfEnd:139, verification:"SOURCE_PDF_VISUAL" },
  { id:"xp-bone-joint", sourceId:"XP2025", title:"Nhiễm khuẩn cơ - xương - khớp", printedStart:148, printedEnd:151, pdfStart:140, pdfEnd:143, verification:"SOURCE_PDF_VISUAL" },
  { id:"xp-sepsis", sourceId:"XP2025", title:"Nhiễm khuẩn nặng và sốc nhiễm khuẩn", printedStart:152, printedEnd:166, pdfStart:144, pdfEnd:158, verification:"SOURCE_PDF_VISUAL" },
  { id:"xp-obgyn", sourceId:"XP2025", title:"Nhiễm khuẩn sản phụ khoa", printedStart:167, printedEnd:171, pdfStart:159, pdfEnd:163, verification:"SOURCE_PDF_VISUAL" },
  { id:"xp-eye", sourceId:"XP2025", title:"Nhiễm nấm xâm lấn / nhiễm khuẩn mắt", printedStart:172, printedEnd:190, pdfStart:164, pdfEnd:182, verification:"SOURCE_PDF_VISUAL" },
];

export const allGuidelineSectionIndexes = [
  ...umc2023SectionIndex,
  ...bachMai2023SectionIndex,
  ...xanhPon2025SectionIndex,
];

export function sourcePdfUrl(sourceId: GuidelineSourceId, pdfPage: number) {
  const source = guidelineSources.find((s) => s.id === sourceId);
  if (!source?.localPdfPath) return "#";
  return `${source.localPdfPath}#page=${pdfPage}`;
}
