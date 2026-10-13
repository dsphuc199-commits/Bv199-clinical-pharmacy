"use client";

import { useState, type CSSProperties } from "react";

/*
 BV199 - VIEM PHOI CONG DONG NGUOI LON
 File: components/antibiotics/CapByt2026.tsx

 Nguon: Quyet dinh 2147/QD-BYT ngay 15/07/2026
 "Huong dan chan doan va dieu tri viem phoi mac phai cong dong o nguoi lon"
 - Dieu 3: co hieu luc ke tu ngay ky, thay the QD 4815/QD-BYT ngay 20/11/2020.
 - Muc 5.3.1, 5.3.2.1, 5.3.2.2, Bang 5.1: dieu tri ban dau theo kinh nghiem.
 - Phu luc 1: lieu thuong dung va hieu chinh lieu theo Clcr.
 - Bang 4.4, Muc 4.5: chuyen IV-PO. Muc 5.2 va 5.6.2: thoi gian dieu tri.

 Cach ghi so trang: so trang in (tr.) va so trang PDF. PDF = so trang in + 10.

 Da doi chieu voi ban PDF do nguoi dung cung cap (kiem tra 13/10/2026).
 Chua doi chieu voi cong thong tin chinh thuc cua Bo Y te.
 Du lieu tham khao, cho tham dinh BV199. Khong tu dong ke don.
*/

type Drug = {
  name: string;
  dose: string;
  route?: string;
  caution?: string;
};

type Regimen = {
  id: string;
  name: string;
  drugs: Drug[];
  indication: string;
  caution?: string;
  source: string;
};

type Scenario = {
  id: string;
  name: string;
  description: string;
  regimens: Regimen[];
  alerts: string[];
};

const SRC_531 = "BYT 2026 – Mục 5.3.1, tr. 37–38 (PDF tr. 47–48)";
const SRC_5321 = "BYT 2026 – Mục 5.3.2.1, tr. 38 (PDF tr. 48); Bảng 5.1, tr. 39 (PDF tr. 49)";
const SRC_5322 = "BYT 2026 – Mục 5.3.2.2, tr. 38–39 (PDF tr. 48–49); Bảng 5.1, tr. 39 (PDF tr. 49)";
const SRC_DOSE = "Phụ lục 1, tr. 60–63 (PDF tr. 70–73)";

/*
  Lieu thuong dung lay NGUYEN tu Phu luc 1 (cot "Lieu thuong dung").
  Day la lieu cho Clcr > 50-90 ml/phut; hieu chinh theo Clcr xem Phu luc 1.
*/
const D = {
  amoxOral: {
    name: "Amoxicillin",
    dose: "1 g mỗi 8 giờ",
    route: "Uống",
  },
  amoxClavOral: {
    name: "Amoxicillin/acid clavulanic",
    dose:
      "875/125 mg mỗi 8–12 giờ (Bảng 4.4); Phụ lục 1: 875 mg mỗi 12 giờ (tính theo amoxicillin), hiệu chỉnh theo Clcr",
    route: "Uống",
  },
  amoxClavIv: {
    name: "Amoxicillin/acid clavulanic",
    dose:
      "1 g mỗi 8 giờ (tính theo amoxicillin; Phụ lục 1), hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
  },
  ampSulbactam: {
    name: "Ampicillin/sulbactam",
    dose:
      "1,5–3 g mỗi 6 giờ (Phụ lục 1; Clcr 10–30: mỗi 8–12 giờ), hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
  },
  doxy: {
    name: "Doxycyclin",
    dose: "100 mg mỗi 12 giờ",
    route: "Uống",
  },
  azithroOral: {
    name: "Azithromycin",
    dose:
      "500 mg ngày đầu, sau đó 250 mg mỗi ngày; hoặc 500 mg/ngày trong 3 ngày (Mục 5.3.1)",
    route: "Uống",
  },
  azithroAny: {
    name: "Azithromycin",
    dose:
      "250–500 mg mỗi 24 giờ (Phụ lục 1); không cần hiệu chỉnh theo chức năng thận",
    route: "Uống hoặc tĩnh mạch",
  },
  clarithro: {
    name: "Clarithromycin",
    dose:
      "500 mg mỗi 12 giờ; hoặc dạng phóng thích chậm 1 g mỗi 24 giờ (Mục 5.3.1)",
    route: "Uống",
  },
  cefpodoxime: {
    name: "Cefpodoxim",
    dose: "200 mg mỗi 12 giờ (Phụ lục 1)",
    route: "Uống",
  },
  cefdinir: {
    name: "Cefdinir",
    dose: "300 mg mỗi 12 giờ (Phụ lục 1)",
    route: "Uống",
  },
  cefditoren: {
    name: "Cefditoren",
    dose: "400 mg mỗi 12 giờ (Phụ lục 1)",
    route: "Uống",
  },
  ceftriaxone: {
    name: "Ceftriaxon",
    dose: "1–2 g mỗi 24 giờ; không cần hiệu chỉnh theo Clcr (Phụ lục 1)",
    route: "Tĩnh mạch",
  },
  cefotaxime: {
    name: "Cefotaxim",
    dose: "1–2 g mỗi 8 giờ (Phụ lục 1), hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
  },
  ceftazidime: {
    name: "Ceftazidim",
    dose: "2 g mỗi 8 giờ (Phụ lục 1), hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
  },
  cefepime: {
    name: "Cefepim",
    dose: "2 g mỗi 8 giờ (Phụ lục 1), hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
  },
  ceftaroline: {
    name: "Ceftarolin",
    dose: "600 mg mỗi 12 giờ (Phụ lục 1), hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
  },
  pipTazo: {
    name: "Piperacillin/tazobactam",
    dose: "4,5 g mỗi 6 giờ (Phụ lục 1), hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
  },
  ertapenem: {
    name: "Ertapenem",
    dose: "1 g mỗi 24 giờ (Phụ lục 1), hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
  },
  levo: {
    name: "Levofloxacin",
    dose:
      "750 mg mỗi 24 giờ hoặc 500 mg mỗi 12 giờ (Phụ lục 1), hiệu chỉnh theo Clcr",
    route: "Uống hoặc tĩnh mạch",
    caution:
      "Đánh giá nguy cơ ADR, QT, bệnh nền, tương tác và các hạn chế sử dụng fluoroquinolon.",
  },
  moxi: {
    name: "Moxifloxacin",
    dose: "400 mg mỗi 24 giờ (Phụ lục 1); không cần hiệu chỉnh theo Clcr",
    route: "Uống hoặc tĩnh mạch",
    caution:
      "Đánh giá nguy cơ ADR, QT, bệnh nền và tương tác.",
  },
  vanco: {
    name: "Vancomycin",
    dose:
      "15–30 mg/kg mỗi 12 giờ, không quá 2 g/lần; cân nhắc liều nạp 25–30 mg/kg ở người bệnh nặng (Phụ lục 1)",
    route: "Tĩnh mạch",
    caution:
      "Theo dõi chức năng thận; cân nhắc hiệu chỉnh liều theo nồng độ thuốc trong máu nếu có điều kiện.",
  },
  teico: {
    name: "Teicoplanin",
    dose:
      "Liều tải 12 mg/kg mỗi 12 giờ × 3 liều; duy trì 12 mg/kg mỗi 24 giờ (Phụ lục 1)",
    route: "Tĩnh mạch",
  },
  linezolid: {
    name: "Linezolid",
    dose: "600 mg mỗi 12 giờ (Phụ lục 1)",
    route: "Uống hoặc tĩnh mạch",
    caution: "Kiểm tra tiểu cầu và tương tác serotonergic.",
  },
  aminoglycoside: {
    name: "Aminoglycosid (amikacin, gentamicin hoặc tobramycin – chọn một)",
    dose:
      "Amikacin 15–20 mg/kg mỗi 24 giờ; gentamicin hoặc tobramycin 5–7 mg/kg mỗi 24 giờ (Phụ lục 1); hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
    caution:
      "Theo dõi chức năng thận thường xuyên; cân nhắc định lượng nồng độ thuốc.",
  },
  cipro: {
    name: "Ciprofloxacin",
    dose: "400 mg mỗi 8–12 giờ (Phụ lục 1), hiệu chỉnh theo Clcr",
    route: "Tĩnh mạch",
  },
};

const SCENARIOS: Scenario[] = [
  {
    id: "low",
    name: "Ngoại trú – nguy cơ thấp",
    description:
      "VPMPCĐ nhẹ điều trị ngoại trú, người bệnh < 65 tuổi, không bệnh đi kèm, không dùng kháng sinh trong 3 tháng trước và không có yếu tố nguy cơ mầm bệnh kháng thuốc.",
    regimens: [
      {
        id: "cap-amox",
        name: "Amoxicillin đơn trị",
        drugs: [D.amoxOral],
        indication:
          "Hướng đến S. pneumoniae. Một trong các lựa chọn của Mục 5.3.1 cho nhóm nguy cơ thấp.",
        source: SRC_531,
      },
      {
        id: "cap-doxy",
        name: "Doxycyclin đơn trị",
        drugs: [D.doxy],
        indication:
          "Một trong các lựa chọn của Mục 5.3.1 cho nhóm nguy cơ thấp.",
        caution:
          "Đánh giá thai kỳ, chống chỉ định và tương tác thuốc.",
        source: SRC_531,
      },
      {
        id: "cap-azithro",
        name: "Azithromycin đơn trị – có điều kiện",
        drugs: [D.azithroOral],
        indication:
          "Khi chưa loại trừ M. pneumoniae (macrolid thế hệ mới).",
        caution:
          "Nguồn không khuyến cáo macrolid đơn trị thường quy tại khu vực có tỷ lệ S. pneumoniae kháng macrolid cao hoặc khi không có dữ liệu kháng thuốc địa phương.",
        source: SRC_531,
      },
      {
        id: "cap-clarithro",
        name: "Clarithromycin đơn trị – có điều kiện",
        drugs: [D.clarithro],
        indication:
          "Cùng điều kiện lựa chọn macrolid như azithromycin.",
        caution:
          "Cùng cảnh báo về đề kháng macrolid. Kiểm tra tương tác CYP3A4 và QT.",
        source: SRC_531,
      },
      {
        id: "cap-amoxclav-hi",
        name: "Amoxicillin/acid clavulanic – khi nhiều khả năng H. influenzae",
        drugs: [D.amoxClavOral],
        indication:
          "Nguồn nêu nên dùng beta-lactam + chất ức chế beta-lactamase đường uống nếu nhiều khả năng H. influenzae, vì gần 50% H. influenzae tiết beta-lactamase tại Việt Nam.",
        source: `${SRC_531}; Bảng 4.4, tr. 34 (PDF tr. 44)`,
      },
      {
        id: "cap-quinolone-allergy",
        name: "Quinolon hô hấp – dị ứng beta-lactam hoặc macrolid",
        drugs: [D.levo, D.moxi],
        indication:
          "Nguồn hạn chế quinolon hô hấp ở nhóm này, ngoại trừ người bệnh dị ứng với beta-lactam hay macrolid (Bảng 5.1: nếu dị ứng beta-lactam). Chọn một thuốc, không dùng cả hai.",
        caution:
          "Levofloxacin và moxifloxacin là hai phương án thay thế nhau.",
        source: `${SRC_531}; Bảng 5.1`,
      },
    ],
    alerts: [
      "Không dùng đồng thời các thuốc đơn trị chỉ vì chúng cùng xuất hiện trong danh sách.",
      "Nghi S. pneumoniae kháng thuốc: Bảng 5.1 nêu amoxicillin liều cao hoặc quinolon hô hấp; nguồn không ghi mg cụ thể cho 'liều cao', cần xác minh.",
      "Bổ sung oseltamivir khi xét nghiệm cúm dương tính, không phụ thuộc thời gian bệnh.",
      "Nên nhập viện nếu toàn trạng suy kiệt, X-quang tổn thương > 1 thùy, hoại tử, tràn dịch màng phổi hoặc tiến triển trong 48–72 giờ, dù PSI/CURB-65 chưa đủ tiêu chuẩn.",
    ],
  },
  {
    id: "risk",
    name: "Ngoại trú – có bệnh đồng mắc/nguy cơ",
    description:
      "Người bệnh > 65 tuổi, có bệnh đồng mắc (tim, phổi, gan, thận mạn, đái tháo đường, nghiện rượu, ung thư), suy giảm miễn dịch, đã dùng kháng sinh 3 tháng trước hoặc nguy cơ S. pneumoniae kháng thuốc.",
    regimens: [
      {
        id: "risk-amox-azi",
        name: "Amoxicillin/acid clavulanic + azithromycin",
        drugs: [D.amoxClavOral, D.azithroOral],
        indication:
          "Beta-lactam/ức chế beta-lactamase kết hợp macrolid thế hệ mới.",
        caution:
          "Hai thuốc dùng phối hợp. Không bổ sung thêm clarithromycin.",
        source: SRC_531,
      },
      {
        id: "risk-amox-doxy",
        name: "Amoxicillin/acid clavulanic + doxycyclin",
        drugs: [D.amoxClavOral, D.doxy],
        indication:
          "Beta-lactam/ức chế beta-lactamase kết hợp doxycyclin (nguồn ghi 'macrolid thế hệ mới/doxycyclin').",
        source: SRC_531,
      },
      {
        id: "risk-cefp-azi",
        name: "Cefpodoxim + azithromycin",
        drugs: [D.cefpodoxime, D.azithroOral],
        indication:
          "Cephalosporin phổ rộng đường uống kết hợp macrolid thế hệ mới.",
        source: `${SRC_531}; ${SRC_DOSE}`,
      },
      {
        id: "risk-cef-other",
        name: "Cefdinir hoặc cefditoren + macrolid/doxycyclin",
        drugs: [
          {
            name: "Cefdinir HOẶC cefditoren (chọn một)",
            dose: `${D.cefdinir.dose}; ${D.cefditoren.dose}`,
            route: "Uống",
          },
          {
            name: "Azithromycin HOẶC doxycyclin (chọn một)",
            dose: `${D.azithroOral.dose}; ${D.doxy.dose}`,
            route: "Uống",
          },
        ],
        indication:
          "Cephalosporin phổ rộng khác được nguồn nêu cùng cefpodoxim.",
        source: `${SRC_531}; ${SRC_DOSE}`,
      },
      {
        id: "risk-levo",
        name: "Levofloxacin đơn trị – có điều kiện",
        drugs: [D.levo],
        indication:
          "Quinolon hô hấp đơn trị, một lựa chọn của Mục 5.3.1 cho nhóm này.",
        source: `${SRC_531}; ${SRC_DOSE}`,
      },
      {
        id: "risk-moxi",
        name: "Moxifloxacin đơn trị – có điều kiện",
        drugs: [D.moxi],
        indication:
          "Quinolon hô hấp đơn trị, phương án thay thế levofloxacin.",
        caution:
          "Không xem levofloxacin và moxifloxacin là hai thành phần phối hợp.",
        source: `${SRC_531}; ${SRC_DOSE}`,
      },
    ],
    alerts: [
      "Không ghép hai beta-lactam hoặc hai macrolid từ các phương án khác nhau.",
      "Cần lưu ý PRSP, H. influenzae, M. catarrhalis (thường sinh beta-lactamase), S. aureus, vi khuẩn Gram âm đường ruột và vi khuẩn không điển hình.",
      "Bổ sung oseltamivir khi xét nghiệm cúm dương tính.",
      "Nhập viện nếu toàn trạng suy kiệt hoặc tổn thương X-quang nặng/tiến triển.",
    ],
  },
  {
    id: "ward",
    name: "Nội trú – không ICU",
    description:
      "VPMPCĐ trung bình – nặng nằm tại khoa nội/hô hấp/truyền nhiễm. Đánh giá riêng nguy cơ P. aeruginosa và S. aureus.",
    regimens: [
      {
        id: "ward-ctx-azi",
        name: "Ceftriaxon + azithromycin",
        drugs: [D.ceftriaxone, D.azithroAny],
        indication:
          "Cephalosporin kết hợp macrolid, một lựa chọn của Mục 5.3.2.1.",
        source: `${SRC_5321}; ${SRC_DOSE}`,
      },
      {
        id: "ward-ctax-azi",
        name: "Cefotaxim + azithromycin",
        drugs: [D.cefotaxime, D.azithroAny],
        indication:
          "Phương án thay ceftriaxon bằng cefotaxim, không dùng cả hai.",
        source: `${SRC_5321}; ${SRC_DOSE}`,
      },
      {
        id: "ward-amp-azi",
        name: "Ampicillin/sulbactam + azithromycin",
        drugs: [D.ampSulbactam, D.azithroAny],
        indication:
          "Beta-lactam/ức chế beta-lactamase kết hợp macrolid.",
        caution:
          "Mục 5.3.2.1 ghi 'ampicillin, amoxicillin/sulbactam'; Phụ lục 1 và Bảng 4.4 có ampicillin/sulbactam. Cần đối chiếu chế phẩm sẵn có tại BV199.",
        source: `${SRC_5321}; ${SRC_DOSE}`,
      },
      {
        id: "ward-amoxclav-azi",
        name: "Amoxicillin/acid clavulanic tĩnh mạch + azithromycin",
        drugs: [D.amoxClavIv, D.azithroAny],
        indication:
          "Beta-lactam/ức chế beta-lactamase kết hợp macrolid.",
        source: `${SRC_5321}; ${SRC_DOSE}`,
      },
      {
        id: "ward-ertapenem",
        name: "Ertapenem + macrolid hoặc quinolon",
        drugs: [
          D.ertapenem,
          {
            name: "Macrolid HOẶC quinolon hô hấp (chọn một)",
            dose:
              "Azithromycin 250–500 mg mỗi 24 giờ; hoặc levofloxacin 750 mg mỗi 24 giờ hay 500 mg mỗi 12 giờ; hoặc moxifloxacin 400 mg mỗi 24 giờ (Phụ lục 1)",
            route: "Tĩnh mạch",
          },
        ],
        indication:
          "Bảng 5.1 liệt kê ertapenem + macrolid/quinolon truyền tĩnh mạch cho nhóm nội trú không ICU.",
        source: `Bảng 5.1, tr. 39 (PDF tr. 49); ${SRC_DOSE}`,
      },
      {
        id: "ward-ceftaroline",
        name: "Ceftarolin ± macrolid – nghi PRSP hoặc MRSA",
        drugs: [D.ceftaroline],
        indication:
          "Mục 5.3.2.1 nêu ceftarolin khi nghi PRSP hoặc MRSA, ± macrolid.",
        source: `${SRC_5321}; ${SRC_DOSE}`,
      },
      {
        id: "ward-pseudo",
        name: "Beta-lactam chống Pseudomonas + macrolid hoặc quinolon",
        drugs: [
          {
            name: "Piperacillin/tazobactam HOẶC ceftazidim HOẶC cefepim (chọn một)",
            dose: `${D.pipTazo.dose}; ${D.ceftazidime.dose}; ${D.cefepime.dose}`,
            route: "Tĩnh mạch",
          },
          {
            name: "Macrolid HOẶC quinolon (chọn một)",
            dose:
              "Azithromycin 250–500 mg mỗi 24 giờ; hoặc levofloxacin 750 mg mỗi 24 giờ hay 500 mg mỗi 12 giờ (Phụ lục 1)",
            route: "Tĩnh mạch",
          },
        ],
        indication:
          "Chỉ khi có yếu tố nguy cơ nhiễm P. aeruginosa hoặc Gram âm đường ruột; điều trị nên bao phủ luôn tác nhân không điển hình.",
        source: SRC_5321,
      },
      {
        id: "ward-levo",
        name: "Quinolon hô hấp đơn trị – có điều kiện",
        drugs: [D.levo, D.moxi],
        indication:
          "Levofloxacin hoặc moxifloxacin đơn trị cho VPMPCĐ trung bình nội trú. Chọn một thuốc.",
        caution:
          "Nguồn: trường hợp người bệnh nặng, quinolon hô hấp không dùng đơn trị mà kết hợp beta-lactam.",
        source: SRC_5321,
      },
    ],
    alerts: [
      "Ceftriaxon, cefotaxim, ampicillin/sulbactam, amoxicillin/acid clavulanic là các phương án thay thế nhau, không dùng đồng thời.",
      "Ưu tiên truyền tĩnh mạch kháng sinh; tránh tiêm tĩnh mạch nhanh để giảm nguy cơ tai biến.",
      "Người bệnh nặng cần nhuộm Gram và cấy đờm trước kháng sinh, cân nhắc multiplex PCR, PCT (khi nhập viện, sau 48–72 giờ, sau 5–7 ngày) hoặc CRP.",
      "Kháng virus (oseltamivir) nếu test nhanh dương tính. Xét nghiệm chẩn đoán lao khi nghi ngờ.",
    ],
  },
  {
    id: "icu",
    name: "CAP nặng – ICU",
    description:
      "VPMPCĐ nặng, suy hô hấp cần thở máy, sốc nhiễm khuẩn hoặc nguy cơ tử vong cao; cần lưu ý S. aureus và P. aeruginosa.",
    regimens: [
      {
        id: "icu-ctx-azi",
        name: "Ceftriaxon + azithromycin",
        drugs: [D.ceftriaxone, D.azithroAny],
        indication:
          "Beta-lactam phổ rộng kết hợp macrolid (Mục 5.3.2.2 ưu tiên kết hợp này), khi không có chỉ định bao phủ Pseudomonas.",
        source: `${SRC_5322}; ${SRC_DOSE}`,
      },
      {
        id: "icu-ctx-levo",
        name: "Ceftriaxon + levofloxacin",
        drugs: [D.ceftriaxone, D.levo],
        indication:
          "Beta-lactam phổ rộng kết hợp quinolon truyền tĩnh mạch (Bảng 5.1).",
        source: `Bảng 5.1, tr. 39 (PDF tr. 49); ${SRC_DOSE}`,
      },
      {
        id: "icu-pseudo-quinolone",
        name: "Beta-lactam chống Pseudomonas + ciprofloxacin hoặc levofloxacin",
        drugs: [
          {
            name:
              "Một beta-lactam chống Pseudomonas: piperacillin/tazobactam, ceftazidim, cefepim, imipenem, meropenem hoặc doripenem",
            dose:
              "Piperacillin/tazobactam 4,5 g mỗi 6 giờ; ceftazidim 2 g mỗi 8 giờ; cefepim 2 g mỗi 8 giờ; imipenem 500 mg mỗi 6 giờ; meropenem 1 g mỗi 8 giờ (Phụ lục 1). Doripenem: nguồn không ghi liều trong Phụ lục 1.",
            route: "Tĩnh mạch",
          },
          { ...D.cipro, name: "Ciprofloxacin HOẶC levofloxacin (chọn một)", dose: `${D.cipro.dose}; ${D.levo.dose}` },
        ],
        indication:
          "Chỉ khi có nguy cơ nhiễm Pseudomonas. Ví dụ cụ thể: cefepim + levofloxacin.",
        caution:
          "Không xem ceftriaxon là thuốc chống Pseudomonas. Đối chiếu antibiogram và kết quả vi sinh.",
        source: `Bảng 5.1, tr. 39 (PDF tr. 49); ${SRC_DOSE}`,
      },
      {
        id: "icu-pseudo-aminoglycoside",
        name: "Beta-lactam chống Pseudomonas + aminoglycosid + azithromycin/clarithromycin",
        drugs: [
          {
            name: "Một beta-lactam chống Pseudomonas (như phương án trên)",
            dose:
              "Piperacillin/tazobactam 4,5 g mỗi 6 giờ; ceftazidim 2 g mỗi 8 giờ; cefepim 2 g mỗi 8 giờ; imipenem 500 mg mỗi 6 giờ; meropenem 1 g mỗi 8 giờ (Phụ lục 1)",
            route: "Tĩnh mạch",
          },
          D.aminoglycoside,
          {
            name: "Azithromycin HOẶC clarithromycin (chọn một)",
            dose:
              "Azithromycin 250–500 mg mỗi 24 giờ; clarithromycin 500 mg mỗi 12 giờ (Phụ lục 1)",
            route: "Tĩnh mạch",
          },
        ],
        indication:
          "Nhánh thay thế khi nghi P. aeruginosa (Bảng 5.1): beta-lactam + một aminoglycosid và azithromycin/clarithromycin.",
        caution:
          "Phác đồ ba thuốc. Đánh giá độc tính thận và tai, cân nhắc xuống thang sớm theo vi sinh.",
        source: `Bảng 5.1, tr. 39 (PDF tr. 49); ${SRC_DOSE}`,
      },
      {
        id: "icu-mrsa",
        name: "Ceftriaxon + azithromycin + thuốc chống MRSA",
        drugs: [
          D.ceftriaxone,
          D.azithroAny,
          {
            name: "Vancomycin HOẶC teicoplanin HOẶC linezolid (chọn một)",
            dose: `${D.vanco.dose}; ${D.teico.dose}; ${D.linezolid.dose}`,
            route: "Tĩnh mạch (linezolid: uống hoặc tĩnh mạch)",
            caution: D.vanco.caution,
          },
        ],
        indication:
          "Phác đồ nền CAP nặng có bổ sung thuốc chống MRSA khi nghi CA-MRSA hoặc chưa loại trừ S. aureus.",
        caution:
          "Thuốc chống MRSA là thuốc bổ sung, không thêm thường quy cho mọi CAP nặng.",
        source: `${SRC_5322}; ${SRC_DOSE}`,
      },
    ],
    alerts: [
      "Chống MRSA và chống Pseudomonas là hai quyết định độc lập. Nếu đồng thời có cả hai nguy cơ, đánh giá lại toàn bộ phác đồ nền.",
      "Nguồn (Mục 5.3.2.2) cũng nêu carbapenem thế hệ 1 (không bao phủ Pseudomonas) hoặc thế hệ 2 kết hợp fluoroquinolon hoặc macrolid ± thuốc bao phủ S. aureus.",
      "Corticoid khi viêm phổi nặng (sớm trong 24 giờ đầu) hoặc sốc: hydrocortison 200 mg/ngày hoặc methylprednisolon 0,5 mg/kg mỗi 12 giờ, đánh giá sau 4 ngày, tổng 8–14 ngày; xét nghiệm cúm và Covid trước khi quyết định.",
      "Đánh giá chức năng thận, MIC/AST, PK/PD, ARC, RRT và tình trạng sốc. Liều ở Phụ lục 1 cần hiệu chỉnh theo Clcr.",
    ],
  },
];

const panel: CSSProperties = {
  border: "1px solid #dce6ed",
  borderRadius: 12,
  background: "#fff",
  padding: 15,
  minWidth: 0,
};

export default function CapByt2026({
  initialScenarioId,
}: {
  initialScenarioId?: string;
}) {
  const [scenarioId, setScenarioId] = useState(
    initialScenarioId ?? "ward"
  );
  const [opened, setOpened] = useState<string | null>(null);

  const scenario =
    SCENARIOS.find((s) => s.id === scenarioId) ??
    SCENARIOS[0];

  return (
    <div style={{ display: "grid", gap: 12, minWidth: 0 }}>
      <section style={panel}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#087e87",
        }}>
          BỘ Y TẾ VIỆT NAM · 2026
        </div>

        <h3 style={{ margin: "7px 0", fontSize: 19 }}>
          Viêm phổi cộng đồng – Người lớn
        </h3>

        <div style={{
          fontSize: 12,
          color: "#61798b",
          lineHeight: 1.7,
        }}>
          Quyết định 2147/QĐ-BYT, ngày 15/7/2026. Có hiệu lực từ ngày ký
          và thay thế Quyết định 4815/QĐ-BYT ngày 20/11/2020 (Điều 3).
        </div>
      </section>

      <section style={panel}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
          Chọn bệnh cảnh
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(165px, 1fr))",
          gap: 8,
        }}>
          {SCENARIOS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                setScenarioId(item.id);
                setOpened(null);
              }}
              aria-pressed={scenarioId === item.id}
              style={{
                textAlign: "left",
                cursor: "pointer",
                borderRadius: 9,
                padding: 11,
                border:
                  scenarioId === item.id
                    ? "1px solid #079b9b"
                    : "1px solid #dce6ed",
                background:
                  scenarioId === item.id
                    ? "#e5f7f4"
                    : "#fff",
                fontWeight:
                  scenarioId === item.id ? 700 : 400,
                color: "#17364b",
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        <p style={{
          color: "#63798b",
          fontSize: 12,
          lineHeight: 1.7,
          marginBottom: 0,
        }}>
          {scenario.description}
        </p>
      </section>

      <section style={panel}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 11,
        }}>
          <h3 style={{ margin: 0, fontSize: 19 }}>
            Lựa chọn kháng sinh
          </h3>

          <span style={{
            fontSize: 12,
            color: "#087e87",
          }}>
            {scenario.regimens.length} phác đồ tham khảo
          </span>
        </div>

        <div style={{
          display: "grid",
          gap: 8,
        }}>
          {scenario.regimens.map((r) => {
            const open = opened === r.id;

            return (
              <article
                key={r.id}
                style={{
                  border: open
                    ? "1px solid #0c9a9b"
                    : "1px solid #dce6ed",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setOpened(open ? null : r.id)
                  }
                  style={{
                    width: "100%",
                    border: 0,
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 13,
                    background:
                      open ? "#eaf8f5" : "#fff",
                    color: "#17364b",
                  }}
                >
                  <span style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <strong style={{ fontSize: 14 }}>
                      {r.name}
                    </strong>

                    <span style={{
                      color: "#087e87",
                      fontSize: 20,
                    }}>
                      {open ? "−" : "+"}
                    </span>
                  </span>
                </button>

                {open && (
                  <div style={{
                    borderTop: "1px solid #dce6ed",
                    padding: 13,
                    lineHeight: 1.8,
                    fontSize: 13,
                  }}>
                    <div style={{
                      display: "grid",
                      gap: 8,
                    }}>
                      {r.drugs.map((d, index) => (
                        <div
                          key={`${r.id}-${index}`}
                          style={{
                            padding: 11,
                            borderRadius: 9,
                            background: "#f5f9fb",
                          }}
                        >
                          <b>
                            {r.drugs.length > 1
                              ? `Thuốc ${index + 1}: `
                              : "Thuốc: "}
                            {d.name}
                          </b>

                          <div>
                            <b>Liều:</b> {d.dose}
                          </div>

                          {d.route && (
                            <div>
                              <b>Đường dùng:</b> {d.route}
                            </div>
                          )}

                          {d.caution && (
                            <div>
                              <b>Lưu ý:</b> {d.caution}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <p>
                      <b>Khi nào lựa chọn:</b>{" "}
                      {r.indication}
                    </p>

                    {r.caution && (
                      <p style={{
                        padding: 11,
                        background: "#fff6e8",
                        borderRadius: 8,
                      }}>
                        <b>Cảnh báo:</b> {r.caution}
                      </p>
                    )}

                    <div style={{
                      fontSize: 12,
                      color: "#62798c",
                    }}>
                      Nguồn: {r.source}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <p style={{
          color: "#647a89",
          fontSize: 12,
          lineHeight: 1.8,
          marginBottom: 0,
        }}>
          Các phác đồ là phương án khác nhau,
          không phải thứ tự ưu tiên. Liều ghi theo cột
          "Liều thường dùng" của Phụ lục 1 (Clcr &gt; 50–90 ml/phút);
          cần hiệu chỉnh theo chức năng thận và đánh giá chuyên môn
          trước khi sử dụng.
        </p>
      </section>

      <section style={panel}>
        <details>
          <summary style={{
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}>
            Điều kiện an toàn và đánh giá lại
          </summary>

          <ul style={{
            fontSize: 13,
            lineHeight: 1.9,
          }}>
            {scenario.alerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}

            <li>
              Đánh giá điều trị sau 48–72 giờ; nếu không cải
              thiện hoặc xấu hơn cần thay đổi phác đồ
              (Mục 5.2).
            </li>

            <li>
              Thời gian điều trị: thường 3–5 ngày sau khi hết sốt
              với S. pneumoniae; trung bình 7–10 ngày đối với
              VPMPCĐ không biến chứng (Mục 5.2). Nếu đáp ứng lâm
              sàng tốt trong 2–3 ngày đầu, thường 5–7 ngày; kéo dài
              hơn khi đáp ứng chậm, S. aureus, Gram âm, biến chứng
              hoặc suy giảm miễn dịch (Mục 5.6.2).
            </li>

            <li>
              Chuyển sang đường uống khi cải thiện ho, khó thở,
              hết sốt 2 lần cách nhau 8 giờ và uống được
              (Mục 5.2; Mục 4.5, Bảng 4.4).
            </li>
          </ul>
        </details>
      </section>

      <section style={panel}>
        <details>
          <summary style={{
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}>
            Nguồn và trạng thái thẩm định
          </summary>

          <div style={{
            fontSize: 13,
            lineHeight: 1.9,
            marginTop: 10,
          }}>
            <b>
              Bộ Y tế – Quyết định 2147/QĐ-BYT
              ngày 15/7/2026.
            </b>

            <div>
              Điều trị kinh nghiệm: Mục 5.3 (tr. 36–39), Bảng 5.1
              (tr. 39). PDF tr. 46–49.
            </div>

            <div>
              Liều và chức năng thận: Phụ lục 1 (tr. 60–63).
              PDF tr. 70–73.
            </div>

            <div>
              Chuyển IV–PO: Mục 4.5, Bảng 4.4 (tr. 34). PDF tr. 44.
            </div>

            <p style={{ color: "#8b611c" }}>
              Đã đối chiếu với bản PDF do người dùng cung cấp
              (13/10/2026); chưa đối chiếu cổng thông tin chính thức
              của Bộ Y tế. Đây là dữ liệu hỗ trợ tra cứu, chưa phải
              phác đồ BV199 được phê duyệt. Chưa mã hóa toàn bộ
              nội dung tài liệu (ví dụ điều trị theo căn nguyên,
              Mục 5.4).
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
