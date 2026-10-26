/*
  FILE: data/antibiotics/empiric/evidence.ts

  SO TRANG THAI NGUON (Nhiem vu 4C). Ghi nhan muc do xac minh cua TUNG VAN BAN – dung
  de phan loai mat benh (lib/antibiotics/evidence-status.ts).

  Muc xac minh van ban:
  - official-text-checked: da tai ban chinh thuc (kcb.vn / trang hoi chuyen nganh) va doi
    chieu lieu tung phuong an bang scripts/verify-official-doses.mjs.
  - government-copy-checked: doi chieu voi ban do co quan/benh vien cong lap (.gov.vn) dang tai.
  - unofficial-copy-checked: doi chieu voi ban sao khong chinh thuc (website khong phai .gov.vn).
  - official-located-no-file: co trang chinh thuc nhung khong co tep de doi chieu.
  - existence-confirmed: xac nhan so hieu/ngay qua ban sao (thu vien phap luat, trang benh vien),
    CHUA doi chieu noi dung.
  - not-confirmed: chua xac nhan.
  Kiem tra ngay 25/10/2026.
*/

import type { DocId } from "./regimens";

export type DocCheck =
  | "official-text-checked"
  | "government-copy-checked"
  | "unofficial-copy-checked"
  | "official-located-no-file"
  | "existence-confirmed"
  | "not-confirmed";

export type DocEvidence = { check: DocCheck; where: string; url?: string };

export const CHECKED_ON = "25/10/2026";

export const DOC_EVIDENCE: Record<DocId, DocEvidence> = {
  byt708: { check: "official-text-checked", where: "kcb.vn – PDF tài liệu Hướng dẫn sử dụng kháng sinh", url: "https://kcb.vn/thu-vien-tai-lieu/tai-lieu-huong-dan-su-dung-khang-sinh.html" },
  byt2147: { check: "official-text-checked", where: "kcb.vn – PDF ký số", url: "https://kcb.vn/tin-tuc/huong-dan-chan-doan-va-dieu-tri-viem-phoi-mac-phai-cong-dong-o-nguoi-lon.html" },
  byt2767: { check: "official-text-checked", where: "kcb.vn – PDF ký số", url: "https://kcb.vn/phac-do/quyet-dinh-2767-qd-byt-cua-bo-y-te-ngay-04-07-2023-ve-viec-ban-hanh-tai-lieu-chuyen-mon-huong-dan-chan-doan-va-dieu-tri-.html" },
  byt5642: { check: "official-text-checked", where: "kcb.vn – PDF (NXB Y học 2016)", url: "https://kcb.vn/upload/2005611/20210723//Truyen-nhiem-1.pdf" },
  byt1530: { check: "official-text-checked", where: "kcb.vn – PDF ký số", url: "https://kcb.vn/upload/2005611/20230421/QD_2023_1530_Quyet_dinh_ban_hanh_tai_lieu_chuyen_mon__Huong_dan_chan_doan_va_dieu_tri_Loet_ban_chan_do_dai_thao_duong__25013.pdf" },
  byt5643: { check: "official-text-checked", where: "kcb.vn – PDF (NXB Y học 2016)", url: "https://kcb.vn/upload/2005611/20210723//HD%C4%90T-TMH.pdf" },
  byt3429: { check: "government-copy-checked", where: "syt.gialai.gov.vn – thư viện tài liệu chuyên môn (kcb.vn có trang văn bản nhưng không đính kèm tệp); SHA-256 739fd281…ebee02", url: "https://kcb.vn/phac-do/quyet-dinh-so-3429-qd-byt-ngay-14-7-2021-ve-viec-ban-hanh-tai-lieu-chuyen-mon-huong-dan-chan-doan-va-dieu-tri-nhiem-nam-.html" },
  byt1493: { check: "existence-confirmed", where: "caselaw.vn (số hiệu, ngày 22/04/2015, đang có hiệu lực)" },
  byt4416: { check: "government-copy-checked", where: "benhviennhi.gialai.gov.vn – PDF ký số (Ký bởi: Bộ Y tế, 06/12/2023), thay bản 2015", url: "https://benhviennhi.gialai.gov.vn/Upload/FileUpload/6383762003562310864494%20[G%E1%BB%ACI%20K%C3%88M]%20HD%20ch%20n%20%20o%C3%A1n%20v%C3%A0%20%20i%20u%20tr%20%20b%20nh%20da%20li%20u%204416.signed.pdf" },
  byt162: { check: "government-copy-checked", where: "bvdkbaclieu.gov.vn – PDF ký số (ngày 19/01/2024, thay QĐ 1314/2020)", url: "https://bvdkbaclieu.gov.vn/upload/1000079/20240524/291_Quyet_dinh-162-QD-BYT_3d3c0ac03e.pdf" },
  byt40: { check: "existence-confirmed", where: "vnras.com (ngày 12/01/2015)" },
  byt315: { check: "government-copy-checked", where: "elib.bvdktuthainguyen.gov.vn – bản in kèm QĐ 315/QĐ-BYT ngày 29/01/2015", url: "https://elib.bvdktuthainguyen.gov.vn/uploads/d0/6c/d06c3841337245a338276a861dfcb18c_1605357395.pdf" },
  byt361: { check: "not-confirmed", where: "Chưa tra cứu" },
  byt3879: { check: "not-confirmed", where: "Chưa tra cứu" },
  byt2388: { check: "official-located-no-file", where: "kcb.vn – trang văn bản (không có phác đồ kháng sinh trong danh mục)" },
  byt5165: { check: "not-confirmed", where: "Chưa tra cứu" },
  byt5631: { check: "not-confirmed", where: "Chưa tra cứu" },
};

export const DOC_CHECK_TEXT: Record<DocCheck, string> = {
  "official-text-checked": "Đã đối chiếu liều với bản chính thức",
  "government-copy-checked": "Đã đối chiếu liều với bản do cơ quan/bệnh viện công lập (.gov.vn) đăng",
  "unofficial-copy-checked": "Đã đối chiếu liều với bản sao không chính thức – chưa có bản chính thức",
  "official-located-no-file": "Có trang chính thức, không có tệp để đối chiếu",
  "existence-confirmed": "Xác nhận số hiệu/ngày qua bản sao – chưa đối chiếu nội dung",
  "not-confirmed": "Chưa xác nhận",
};

/*
  Module quoc te (Tai Mui Hong) da doi chieu LAI voi nguon goc trong dot 4C.
  Mat benh co ten o day: lieu module duoc coi la da xac minh nguon (ghi chu ro la lieu quoc te).
*/
export const INTL_MODULE_CHECKS: Record<string, { source: string; url: string; checkedOn: string; result: string }> = {
  ...Object.fromEntries(
    ["v8-8", "v8-54"].map((id) => [
      id,
      {
        source: "CDC – Clinical Guidance for Group A Streptococcal Pharyngitis (cập nhật 18/11/2025)",
        url: "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html",
        checkedOn: "25/10/2026",
        result:
          "Khớp 8/8 phương án của module: amoxicillin, penicillin V, benzathine penicillin G, cephalexin, cefadroxil, clindamycin, azithromycin (liều, liều tối đa, thời gian).",
      },
    ])
  ),
};

/* Van de noi dung da biet (khong phai loi nguon) – can tham dinh chuyen mon. */
export const CONTENT_ISSUES: Record<string, string> = {
  "v8-141":
    "Phác đồ B2 (trẻ em) ghi dùng thêm streptomycin trong giai đoạn tấn công nhưng QĐ 162 không có liều streptomycin trẻ em (Phụ lục 6 chỉ có cột người lớn) – cần HĐT&ĐT/dược sĩ quyết định.",
  "v8-2":
    "Bước 4D.4: đã tách kiểu hình ESBL sang mặt bệnh \"Enterobacterales sinh ESBL\" (v8-43). Phác đồ BYT gắn kèm (QĐ 708 – Sỏi thận tiết niệu có biến chứng nhiễm khuẩn) chỉ bao phủ một phần hội chứng NKTN phức tạp; QĐ 708 không có mục NKTN phức tạp riêng – cần HĐT&ĐT xác nhận phạm vi áp dụng.",
};

/* Huong dan hoi chuyen nganh Viet Nam (module) da doi chieu ban chinh thuc. */
export const SOCIETY_EVIDENCE = {
  vnrs2023: {
    title: "Khuyến cáo VPBV/VPLQTM 2023 – Hội Hô hấp VN & Hội HSCC-CĐ VN",
    check: "official-text-checked" as DocCheck,
    url: "https://hoihohapvietnam.org/upload/attach/VNRS-20231130151558.pdf",
  },
};
