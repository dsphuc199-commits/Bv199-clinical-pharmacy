"use client";

import { useState } from "react";

import { getModuleRationale } from "../../data/antibiotics/empiric/rationale-modules";
import TreatmentPanel, { type TxCard, type TxSection } from "./treatment/TreatmentPanel";
import { structureForOption } from "../../lib/antibiotics/regimen-structure";

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

/* Du lieu dung chung cho bo may lua chon khang sinh (lib/antibiotics/selection-engine.ts). */
export const CAP_SCENARIOS = SCENARIOS;
export type { Drug as CapDrug, Regimen as CapRegimen, Scenario as CapScenario };

/* Phan loai theo nguon: QĐ 2147 neu cac phac do NGANG HANG (khong thu tu uu tien);
   phac do co dieu kien / di ung ghi trong ten phac do cua nguon. */
const CONDITIONAL_RE = /có điều kiện|nghi |chống Pseudomonas|chống MRSA|khi nhiều khả năng/i;
const ALLERGY_RE = /dị ứng/i;

function capCard(r: Regimen): TxCard {
  const s = structureForOption(`module-${r.id}`, r.drugs);
  return {
    id: r.id,
    condition: r.indication,
    groups: s.groups,
    status: s.status,
    linkTexts: r.drugs.map((d) => `${d.name}: ${d.dose} ${d.route ?? ""}`),
    linkScenario: r.name,
    sources: [`QĐ 2147/QĐ-BYT (2026) — ${r.source}`],
  };
}

export default function CapByt2026({
  initialScenarioId,
}: {
  initialScenarioId?: string;
}) {
  const [scenarioId, setScenarioId] = useState(initialScenarioId ?? "ward");
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  const allergy = scenario.regimens.filter((r) => ALLERGY_RE.test(r.name));
  const conditional = scenario.regimens.filter((r) => !ALLERGY_RE.test(r.name) && CONDITIONAL_RE.test(r.name));
  const main = scenario.regimens.filter((r) => !allergy.includes(r) && !conditional.includes(r));
  const sections: TxSection[] = [];
  if (main.length) sections.push({ key: "equal", title: main.length > 1 ? "Các lựa chọn được khuyến cáo" : "Phác đồ khuyến cáo", itemLabel: "Lựa chọn", cards: main.map(capCard), startAt: 1 });
  if (conditional.length) sections.push({ key: "cond", title: "Lựa chọn có điều kiện", itemLabel: "Lựa chọn", cards: conditional.map(capCard), startAt: main.length + 1 });
  if (allergy.length) sections.push({ key: "allergy", title: "Lựa chọn khi dị ứng", itemLabel: "Lựa chọn", cards: allergy.map(capCard), startAt: main.length + conditional.length + 1 });

  const notes = [
    "Liều theo cột “Liều thường dùng” Phụ lục 1 (CrCl > 50–90 mL/phút) – điều chỉnh liều theo chức năng thận.",
    ...scenario.regimens.flatMap((r) => [r.caution, ...r.drugs.map((d) => d.caution)].filter((x): x is string => !!x)),
  ];
  const monitoring = [
    ...scenario.alerts,
    "Đánh giá đáp ứng sau 48–72 giờ; không cải thiện hoặc xấu hơn: thay đổi phác đồ (Mục 5.2).",
    "Thời gian điều trị: 3–5 ngày sau hết sốt với S. pneumoniae; trung bình 7–10 ngày với VPMPCĐ không biến chứng (Mục 5.2); đáp ứng tốt trong 2–3 ngày đầu: thường 5–7 ngày; kéo dài hơn khi đáp ứng chậm, S. aureus, Gram âm, biến chứng hoặc suy giảm miễn dịch (Mục 5.6.2).",
    "Chuyển đường uống khi cải thiện ho, khó thở, hết sốt 2 lần cách nhau 8 giờ và uống được (Mục 5.2; Mục 4.5, Bảng 4.4).",
  ];

  return (
    <TreatmentPanel
      scenarios={SCENARIOS.map((s) => ({ value:s.id,label:s.name,setting:s.id === "low" || s.id === "risk" ? "outpatient" as const : "inpatient" as const,criteria:[s.description],reviewNotes:s.id==="low"||s.id==="risk"?["Cần đối chiếu tiêu chí tuổi đúng 65: mô tả nhóm hiện có ghi <65 và >65. Không tự xác định nhóm chỉ từ tuổi."]:[],regimenIds:s.regimens.map(r=>r.id),sources:[...new Set(s.regimens.map(r=>`QĐ 2147/QĐ-BYT (2026) — ${r.source}`))] }))}
      scenario={scenario.id}
      initialChoice={initialScenarioId}
      onScenario={setScenarioId}
      scenarioHint={scenario.description}
      sourceTag="Bộ Y tế · QĐ 2147/QĐ-BYT"
      rationale={getModuleRationale("cap", scenario.id)}
      sections={sections}
      notes={Array.from(new Set(notes))}
      monitoring={monitoring}
      sources={["QĐ 2147/QĐ-BYT (2026) – Mục 5.3 (tr. 36–39), Bảng 5.1 (tr. 39); liều: Phụ lục 1 (tr. 60–63)"]}
    />
  );
}
