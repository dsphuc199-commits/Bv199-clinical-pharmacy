"use client";

import { useState } from "react";

import DrugActionLinks from "./links/DrugActionLinks";
import { getModuleRationale } from "../../data/antibiotics/empiric/rationale-modules";
import TreatmentPanel, { type TxCard, type TxSection } from "./treatment/TreatmentPanel";
import { structureForOption } from "../../lib/antibiotics/regimen-structure";

/*
 BV199 - HAP / VAP
 File: components/antibiotics/HapVap2023.tsx

 Nguon:
 Khuyen cao chan doan va dieu tri viem phoi benh vien va
 viem phoi lien quan den tho may (cap nhat 2023).
 Hoi Ho hap Viet Nam va Hoi Hoi suc cap cuu va Chong doc Viet Nam.
 - HAP: Bang 3.1 (tr. 53-56, chu thich tr. 56-57), nguyen tac tr. 57-58.
 - VAP: Bang 3.2 (tr. 60-62, chu thich tr. 62-63), nguyen tac tr. 63-64.
 - Muc 1.3 (tr. 51) va Muc 4 (tr. 78): theo doi va thoi gian dung khang sinh.
 So trang PDF trung voi so trang in.

 Da doi chieu voi ban PDF do nguoi dung cung cap (kiem tra 13/10/2026).
 Day la khuyen cao hoi chuyen nganh, khong phai quyet dinh cua Bo Y te.
 Cac to hop trong the la VI DU xay dung theo quy tac cua bang
 ("hai trong cac lua chon, tranh dung 2 beta-lactam"; nhom A + B + C).
 Chua phe duyet BV199.
*/

type Kind = "hap" | "vap";

type Drug = {
  name: string;
  dose: string;
  route: string;
  caution?: string;
};

type Regimen = {
  id: string;
  name: string;
  drugs: Drug[];
  indication: string;
  notes: string[];
  source: string;
};

type Pool = {
  title: string;
  drugs: Drug[];
};

type Scenario = {
  id: string;
  title: string;
  description: string;
  regimens: Regimen[];
  pool?: Pool[];
};

const CARBA_BOLUS =
  "(*) Cân nhắc liều bolus đầu 0,5–1 g truyền trong 30 phút – 1 giờ trước khi truyền kéo dài/liên tục, nhất là BMI ≥ 30, albumin < 25 g/L, Clcr > 130 ml/phút, VPBV/VPLQTM nặng hoặc nghi tác nhân đa kháng.";

const DRUGS = {
  piptazo: {
    name: "Piperacillin/tazobactam",
    dose: "4,5 g truyền tĩnh mạch trong 3 giờ, mỗi 6 giờ",
    route: "IV",
    caution: "Hiệu chỉnh theo chức năng thận, CRRT, IHD, PEX, ECMO.",
  },
  piptazoSevere: {
    name: "Piperacillin/tazobactam",
    dose:
      "4,5 g truyền tĩnh mạch trong 3 giờ, mỗi 6 giờ; có thể cân nhắc truyền liên tục 20 g/ngày sau liều bolus 4,5 g truyền trong 30 phút",
    route: "IV",
    caution: "Hiệu chỉnh theo chức năng thận, CRRT, IHD, PEX, ECMO.",
  },
  cefepime: {
    name: "Cefepim",
    dose: "2 g truyền tĩnh mạch trong 3 giờ, mỗi 8 giờ",
    route: "IV",
    caution: "Theo dõi nguy cơ độc tính thần kinh; hiệu chỉnh theo chức năng thận.",
  },
  cefepimeSevere: {
    name: "Cefepim",
    dose:
      "2 g truyền tĩnh mạch trong 3 giờ, mỗi 8 giờ; có thể cân nhắc truyền liên tục 6 g/ngày sau liều bolus 15 mg/kg truyền trong 30 phút",
    route: "IV",
    caution: "Theo dõi nguy cơ độc tính thần kinh; hiệu chỉnh theo chức năng thận.",
  },
  ceftazidime: {
    name: "Ceftazidim",
    dose:
      "2 g truyền tĩnh mạch trong 3 giờ, mỗi 8 giờ; có thể cân nhắc truyền liên tục 6 g/ngày sau liều bolus 15 mg/kg truyền trong 30 phút",
    route: "IV",
    caution: "Hiệu chỉnh theo chức năng thận.",
  },
  imipenemStd: {
    name: "Imipenem/cilastatin",
    dose: "500 mg truyền tĩnh mạch trong 3 giờ, mỗi 6 giờ (*)",
    route: "IV",
    caution: `Lưu ý nguy cơ độc tính thần kinh. ${CARBA_BOLUS}`,
  },
  imipenemSevere: {
    name: "Imipenem/cilastatin",
    dose:
      "0,5–1 g truyền tĩnh mạch trong 3 giờ, mỗi 6 giờ, hoặc truyền liên tục qua bơm tiêm điện (thay thuốc mỗi 3 giờ) (*)",
    route: "IV",
    caution: `Lưu ý nguy cơ độc tính thần kinh. ${CARBA_BOLUS}`,
  },
  meropenemStd: {
    name: "Meropenem",
    dose: "1 g truyền tĩnh mạch trong 3 giờ, mỗi 8 giờ (*)",
    route: "IV",
    caution: CARBA_BOLUS,
  },
  meropenemSevere: {
    name: "Meropenem",
    dose:
      "1–2 g truyền tĩnh mạch trong 3 giờ, mỗi 8 giờ, hoặc truyền liên tục qua bơm tiêm điện (thay thuốc mỗi 3 giờ) (*)",
    route: "IV",
    caution: CARBA_BOLUS,
  },
  levoHap: {
    name: "Levofloxacin",
    dose:
      "750 mg truyền tĩnh mạch mỗi 24 giờ, hoặc 500 mg truyền tĩnh mạch mỗi 12 giờ",
    route: "IV",
    caution:
      "Đánh giá nguy cơ QT, ADR và đề kháng; điều chỉnh khi suy thận.",
  },
  levoVap: {
    name: "Levofloxacin",
    dose:
      "750 mg truyền tĩnh mạch mỗi 24 giờ; hoặc 500 mg mỗi 12 giờ trong nhiễm khuẩn nặng",
    route: "IV",
    caution:
      "Đánh giá nguy cơ QT, ADR và đề kháng; điều chỉnh khi suy thận.",
  },
  cipro: {
    name: "Ciprofloxacin",
    dose: "400 mg truyền tĩnh mạch mỗi 8 giờ",
    route: "IV",
    caution: "Điều chỉnh theo chức năng thận.",
  },
  amikacin: {
    name: "Amikacin",
    dose: "20 mg/kg truyền tĩnh mạch mỗi 24 giờ (**)",
    route: "IV",
    caution:
      "Không dùng aminoglycosid đơn độc trong HAP/VAP. (**) Nặng, nghi K. pneumoniae kháng carbapenem: cân nhắc 25–30 mg/kg kèm TDM. Nguy cơ độc tính thận và tai.",
  },
  gentamicin: {
    name: "Gentamicin",
    dose: "5–7 mg/kg truyền tĩnh mạch mỗi 24 giờ",
    route: "IV",
    caution: "Không dùng đơn độc. Theo dõi chức năng thận và tai.",
  },
  tobramycin: {
    name: "Tobramycin",
    dose: "5–7 mg/kg truyền tĩnh mạch mỗi 24 giờ",
    route: "IV",
    caution: "Không dùng đơn độc. Theo dõi chức năng thận và tai.",
  },
  aztreonamHap: {
    name: "Aztreonam",
    dose: "2 g truyền tĩnh mạch mỗi 8 giờ",
    route: "IV",
    caution: "Chỉ có hoạt tính Gram âm; xem nguồn trước khi chọn.",
  },
  aztreonamVap: {
    name: "Aztreonam",
    dose: "2 g truyền tĩnh mạch mỗi 6–8 giờ (truyền dài trong 3 giờ)",
    route: "IV",
    caution: "Chỉ có hoạt tính Gram âm; xem nguồn trước khi chọn.",
  },
  colistin: {
    name: "Colistin",
    dose:
      "Theo đồng thuận Polymyxin 2019: liều nạp 9 MUI, liều duy trì tương đương 9 MUI hiệu chỉnh theo mức lọc cầu thận, dùng sau liều nạp 8–12 giờ; hoặc theo quy trình colistin được bệnh viện phê duyệt",
    route: "IV",
    caution: "Không dùng đơn độc. Chọn liều dựa trên dữ liệu MIC cập nhật.",
  },
  vancomycin: {
    name: "Vancomycin",
    dose:
      "15–20 mg/kg truyền tĩnh mạch trong 1–2 giờ, mỗi 8 giờ hoặc mỗi 12 giờ (cân nhắc liều nạp 25–30 mg/kg ở người bệnh nặng); có thể cân nhắc truyền liên tục ở người bệnh nặng (***)",
    route: "IV",
    caution:
      "Cân nhắc hiệu chỉnh liều theo nồng độ thuốc trong máu; theo Mục 3.5 (tr. 72), tối ưu theo đích AUC/MIC 400–600. (***) Truyền liên tục: tổng liều 24 giờ 30–40 mg/kg, tối đa 60 mg/kg sau liều nạp, đích 20–25 mg/L.",
  },
  teicoplanin: {
    name: "Teicoplanin",
    dose:
      "Liều nạp 6 mg/kg mỗi 12 giờ × 3–4 liều (400 mg) truyền 30 phút – 1 giờ; duy trì 6 mg/kg mỗi 24 giờ (400 mg) truyền 30 phút – 1 giờ",
    route: "IV",
  },
  linezolid: {
    name: "Linezolid",
    dose: "600 mg truyền tĩnh mạch mỗi 12 giờ",
    route: "IV",
    caution:
      "Kiểm tra tiểu cầu, tương tác serotonergic và thời gian điều trị.",
  },
};

const HAP_SRC = "HAP 2023 – Bảng 3.1, tr. 53–56";
const VAP_SRC = "VAP 2023 – Bảng 3.2, tr. 60–62";

const HAP: Scenario[] = [
  {
    id: "hap-low",
    title: "Không nặng – không nguy cơ đa kháng",
    description:
      "Cột 1 của Bảng 3.1: một trong những lựa chọn sau, đơn trị liệu với một kháng sinh có tác dụng trên Pseudomonas aeruginosa.",
    regimens: [
      {
        id: "hap-pip",
        name: "Piperacillin/tazobactam đơn trị",
        drugs: [DRUGS.piptazo],
        indication: "Một trong năm lựa chọn đơn trị của cột 1.",
        notes: [
          "Đối chiếu tình hình nhạy cảm Pseudomonas tại bệnh viện.",
        ],
        source: HAP_SRC,
      },
      {
        id: "hap-cef",
        name: "Cefepim đơn trị",
        drugs: [DRUGS.cefepime],
        indication: "Một trong năm lựa chọn đơn trị của cột 1.",
        notes: ["Theo dõi chức năng thận và độc tính thần kinh."],
        source: HAP_SRC,
      },
      {
        id: "hap-levo",
        name: "Levofloxacin đơn trị",
        drugs: [DRUGS.levoHap],
        indication: "Một trong năm lựa chọn đơn trị của cột 1.",
        notes: [
          "Kiểm tra QT, ADR, tương tác và tỷ lệ nhạy cảm tại đơn vị.",
        ],
        source: HAP_SRC,
      },
      {
        id: "hap-imi",
        name: "Imipenem/cilastatin đơn trị",
        drugs: [DRUGS.imipenemStd],
        indication: "Một trong năm lựa chọn đơn trị của cột 1.",
        notes: [
          "Không sử dụng carbapenem mặc định cho mọi HAP nguy cơ thấp; cân nhắc theo dịch tễ và nhạy cảm tại đơn vị.",
        ],
        source: HAP_SRC,
      },
      {
        id: "hap-mero",
        name: "Meropenem đơn trị",
        drugs: [DRUGS.meropenemStd],
        indication: "Một trong năm lựa chọn đơn trị của cột 1.",
        notes: [
          "Liều ở cột này (1 g mỗi 8 giờ) khác liều cột nặng/nguy cơ đa kháng (1–2 g mỗi 8 giờ).",
          "Không sử dụng carbapenem mặc định cho mọi HAP nguy cơ thấp.",
        ],
        source: HAP_SRC,
      },
    ],
  },
  {
    id: "hap-mdr",
    title: "Nặng hoặc có nguy cơ đa kháng",
    description:
      "Cột 2 của Bảng 3.1: hai trong các lựa chọn sau, tránh dùng 2 beta-lactam. Có thể xem xét thêm thuốc chống MRSA.",
    pool: [
      {
        title: "Nhóm beta-lactam (chọn tối đa một)",
        drugs: [
          DRUGS.piptazoSevere,
          DRUGS.cefepimeSevere,
          DRUGS.ceftazidime,
          DRUGS.imipenemSevere,
          DRUGS.meropenemSevere,
          DRUGS.aztreonamHap,
        ],
      },
      {
        title: "Nhóm không phải beta-lactam",
        drugs: [
          DRUGS.levoHap,
          DRUGS.cipro,
          DRUGS.amikacin,
          DRUGS.gentamicin,
          DRUGS.tobramycin,
        ],
      },
    ],
    regimens: [
      {
        id: "hap-cef-levo",
        name: "Cefepim + levofloxacin",
        drugs: [DRUGS.cefepimeSevere, DRUGS.levoHap],
        indication:
          "Ví dụ: một beta-lactam + một fluoroquinolon, theo quy tắc hai trong các lựa chọn.",
        notes: [
          "Kiểm tra tỷ lệ nhạy cảm của cả hai thuốc.",
          "Không duy trì phối hợp kéo dài khi có thể xuống thang.",
        ],
        source: HAP_SRC,
      },
      {
        id: "hap-pip-cipro",
        name: "Piperacillin/tazobactam + ciprofloxacin",
        drugs: [DRUGS.piptazoSevere, DRUGS.cipro],
        indication:
          "Ví dụ: một beta-lactam + một fluoroquinolon khác.",
        notes: [
          "Bảng không xếp hạng ưu tiên giữa các phác đồ.",
        ],
        source: HAP_SRC,
      },
      {
        id: "hap-mero-amik",
        name: "Meropenem + amikacin",
        drugs: [DRUGS.meropenemSevere, DRUGS.amikacin],
        indication:
          "Ví dụ: một beta-lactam + một aminoglycosid.",
        notes: [
          "Aminoglycosid cần cá thể hóa bằng TDM, không dùng đơn độc.",
          "Đánh giá xuống thang sớm theo cấy và AST.",
        ],
        source: HAP_SRC,
      },
    ],
  },
  {
    id: "hap-mrsa",
    title: "Không nặng nhưng có nguy cơ MRSA",
    description:
      "Cột 3 của Bảng 3.1: một thuốc Gram âm nền (một trong các lựa chọn) kết hợp một thuốc chống MRSA (vancomycin, teicoplanin hoặc linezolid).",
    regimens: [
      {
        id: "hap-cef-vanco",
        name: "Cefepim + vancomycin",
        drugs: [DRUGS.cefepime, DRUGS.vancomycin],
        indication:
          "Ví dụ: thuốc Gram âm nền + glycopeptid.",
        notes: [
          "Vancomycin không thay thế bao phủ Gram âm của cefepim.",
          "Kiểm tra nguy cơ và kết quả MRSA trước khi duy trì.",
        ],
        source: HAP_SRC,
      },
      {
        id: "hap-pip-line",
        name: "Piperacillin/tazobactam + linezolid",
        drugs: [DRUGS.piptazo, DRUGS.linezolid],
        indication:
          "Ví dụ: thuốc Gram âm nền + oxazolidinon.",
        notes: [
          "Không mặc định dùng đồng thời linezolid và vancomycin.",
        ],
        source: HAP_SRC,
      },
      {
        id: "hap-pip-teico",
        name: "Piperacillin/tazobactam + teicoplanin",
        drugs: [DRUGS.piptazo, DRUGS.teicoplanin],
        indication:
          "Ví dụ: thuốc Gram âm nền + glycopeptid khác.",
        notes: [
          "Chọn một thuốc chống MRSA, không phối hợp vancomycin với teicoplanin.",
        ],
        source: HAP_SRC,
      },
    ],
  },
  {
    id: "hap-mdr-mrsa",
    title: "Nặng/nguy cơ đa kháng + xem xét chống MRSA",
    description:
      "Cột 2 của Bảng 3.1 có dòng 'xem xét kết hợp' vancomycin, teicoplanin hoặc linezolid. Chỉ cân nhắc khi cùng lúc cần hai thuốc Gram âm và nguy cơ MRSA.",
    regimens: [
      {
        id: "hap-mdr-mrsa-ex",
        name: "Cefepim + levofloxacin + vancomycin",
        drugs: [
          DRUGS.cefepimeSevere,
          DRUGS.levoHap,
          DRUGS.vancomycin,
        ],
        indication:
          "Ví dụ ba thuốc: hai thuốc Gram âm (không phải hai beta-lactam) + một thuốc chống MRSA.",
        notes: [
          "Không dùng ba thuốc như phác đồ thường quy cho mọi HAP có nguy cơ MRSA.",
          "Đánh giá xuống thang theo vi sinh và nguy cơ MRSA thực tế.",
        ],
        source: HAP_SRC,
      },
    ],
  },
];

const VAP: Scenario[] = [
  {
    id: "vap-low",
    title: "Không nguy cơ đa kháng – đơn trị",
    description:
      "Bệnh nhân VPLQTM không có yếu tố nguy cơ đa kháng và đơn vị có < 10% vi khuẩn Gram âm phân lập kháng với thuốc định dùng đơn trị: có thể dùng một kháng sinh có tác dụng trên P. aeruginosa (nhóm B).",
    regimens: [
      {
        id: "vap-pip",
        name: "Piperacillin/tazobactam đơn trị",
        drugs: [DRUGS.piptazo],
        indication: "Thuốc nhóm B (penicillin kháng Pseudomonas).",
        notes: [
          "Chỉ khi đủ dữ liệu nhạy cảm của đơn vị; không đơn trị chỉ vì chưa có kết quả cấy.",
          "Đánh giá riêng nguy cơ MRSA.",
        ],
        source: VAP_SRC,
      },
      {
        id: "vap-cef",
        name: "Cefepim đơn trị",
        drugs: [DRUGS.cefepime],
        indication: "Thuốc nhóm B (cephalosporin).",
        notes: ["Đối chiếu nhạy cảm Pseudomonas của đơn vị."],
        source: VAP_SRC,
      },
      {
        id: "vap-caz",
        name: "Ceftazidim đơn trị",
        drugs: [DRUGS.ceftazidime],
        indication: "Thuốc nhóm B (cephalosporin).",
        notes: ["Đối chiếu nhạy cảm Pseudomonas của đơn vị."],
        source: VAP_SRC,
      },
      {
        id: "vap-imi",
        name: "Imipenem/cilastatin đơn trị – có điều kiện",
        drugs: [DRUGS.imipenemSevere],
        indication: "Thuốc nhóm B (carbapenem).",
        notes: [
          "Không sử dụng carbapenem mặc định cho mọi VPLQTM.",
        ],
        source: VAP_SRC,
      },
      {
        id: "vap-mero",
        name: "Meropenem đơn trị – có điều kiện",
        drugs: [DRUGS.meropenemSevere],
        indication: "Thuốc nhóm B (carbapenem).",
        notes: [
          "Không sử dụng carbapenem mặc định cho mọi VPLQTM.",
        ],
        source: VAP_SRC,
      },
    ],
  },
  {
    id: "vap-mdr",
    title: "Có nguy cơ đa kháng – phối hợp hai nhóm",
    description:
      "Có một yếu tố nguy cơ đa kháng, đơn vị có > 10% vi khuẩn kháng thuốc định đơn trị, hoặc chưa biết tỷ lệ nhạy cảm: phối hợp hai kháng sinh thuộc các nhóm khác nhau có tác dụng trên P. aeruginosa và Gram âm (nhóm B + nhóm C).",
    pool: [
      {
        title: "Nhóm B – beta-lactam kháng Pseudomonas",
        drugs: [
          DRUGS.piptazo,
          DRUGS.cefepime,
          DRUGS.ceftazidime,
          DRUGS.imipenemSevere,
          DRUGS.meropenemSevere,
          DRUGS.aztreonamVap,
        ],
      },
      {
        title: "Nhóm C – không phải beta-lactam",
        drugs: [
          DRUGS.cipro,
          DRUGS.levoVap,
          DRUGS.amikacin,
          DRUGS.gentamicin,
          DRUGS.tobramycin,
          DRUGS.colistin,
        ],
      },
    ],
    regimens: [
      {
        id: "vap-cef-levo",
        name: "Cefepim + levofloxacin",
        drugs: [DRUGS.cefepime, DRUGS.levoVap],
        indication: "Ví dụ ghép nhóm B + C (fluoroquinolon).",
        notes: [
          "Không ghép hai beta-lactam với nhau.",
          "Đánh giá độc lập nguy cơ MRSA.",
        ],
        source: VAP_SRC,
      },
      {
        id: "vap-pip-cipro",
        name: "Piperacillin/tazobactam + ciprofloxacin",
        drugs: [DRUGS.piptazo, DRUGS.cipro],
        indication: "Ví dụ ghép nhóm B + C (fluoroquinolon).",
        notes: ["Chỉ áp dụng khi có cơ sở phối hợp hai thuốc."],
        source: VAP_SRC,
      },
      {
        id: "vap-mero-amik",
        name: "Meropenem + amikacin",
        drugs: [DRUGS.meropenemSevere, DRUGS.amikacin],
        indication: "Ví dụ ghép nhóm B + C (aminoglycosid).",
        notes: [
          "Aminoglycosid không dùng đơn độc.",
          "Theo dõi TDM và độc tính thận, tai.",
        ],
        source: VAP_SRC,
      },
    ],
  },
  {
    id: "vap-mrsa",
    title: "Có nguy cơ MRSA",
    description:
      "Có một yếu tố nguy cơ đa kháng, đơn vị có tỷ lệ MRSA > 10% hoặc không có dữ liệu: bổ sung một thuốc nhóm A (vancomycin, teicoplanin hoặc linezolid) vào phác đồ Gram âm thích hợp.",
    regimens: [
      {
        id: "vap-cef-vanco",
        name: "Cefepim + vancomycin",
        drugs: [DRUGS.cefepime, DRUGS.vancomycin],
        indication: "Ví dụ nhóm B + A.",
        notes: [
          "Nếu đồng thời nguy cơ đa kháng Gram âm, cần đánh giá nhóm C (xem phác đồ ba thuốc).",
          "TDM vancomycin theo thực hành phù hợp.",
        ],
        source: VAP_SRC,
      },
      {
        id: "vap-pip-line",
        name: "Piperacillin/tazobactam + linezolid",
        drugs: [DRUGS.piptazo, DRUGS.linezolid],
        indication: "Ví dụ nhóm B + A (oxazolidinon).",
        notes: ["Kiểm tra tương tác và nguy cơ giảm tiểu cầu."],
        source: VAP_SRC,
      },
      {
        id: "vap-pip-teico",
        name: "Piperacillin/tazobactam + teicoplanin",
        drugs: [DRUGS.piptazo, DRUGS.teicoplanin],
        indication: "Ví dụ nhóm B + A (glycopeptid khác).",
        notes: ["Chọn một thuốc nhóm A, không phối hợp hai glycopeptid."],
        source: VAP_SRC,
      },
      {
        id: "vap-three",
        name: "Meropenem + amikacin + vancomycin",
        drugs: [
          DRUGS.meropenemSevere,
          DRUGS.amikacin,
          DRUGS.vancomycin,
        ],
        indication:
          "Ví dụ nhóm B + C + A, chỉ khi có cả nguy cơ Gram âm đa kháng và MRSA.",
        notes: [
          "Không phải phác đồ mặc định cho VPLQTM.",
          "Đánh giá nguy cơ độc tính thận và nhu cầu duy trì aminoglycosid.",
          "Cần kháng sinh đồ và thẩm định chuyên môn.",
        ],
        source: VAP_SRC,
      },
    ],
  },
];

const RISK: Record<Kind, string[]> = {
  hap: [
    "Nguy cơ tử vong cao: VPBV phải thở máy hoặc có sốc nhiễm khuẩn.",
    "Nguy cơ vi khuẩn đa kháng: đã dùng kháng sinh tĩnh mạch trong vòng 90 ngày trước đó.",
    "Nguy cơ cao trực khuẩn Gram âm/P. aeruginosa đa kháng: kháng sinh tĩnh mạch 90 ngày; bệnh phổi cấu trúc (giãn phế quản, xơ nang); đã phân lập trước đó hoặc có vi khuẩn đa kháng cư trú.",
    "Nguy cơ cao MRSA: kháng sinh tĩnh mạch 90 ngày; đơn vị có tỷ lệ MRSA > 10% hoặc chưa biết tỷ lệ; đã phân lập trước đó hoặc có MRSA cư trú.",
    "Kháng sinh đồ BV199 và tỷ lệ nhạy cảm Pseudomonas tại đơn vị.",
  ],
  vap: [
    "Nguy cơ cao vi khuẩn đa kháng (một trong các tiêu chuẩn): kháng sinh tĩnh mạch 90 ngày; sốc nhiễm khuẩn lúc bị VPLQTM; ARDS trước VPLQTM; nằm viện > 5 ngày trước VPLQTM; điều trị thay thế thận trước VPLQTM.",
    "Nguy cơ cao Gram âm/Pseudomonas đa kháng: có một tiêu chuẩn đa kháng ở trên; đơn vị có > 10% Gram âm đa kháng hoặc chưa biết tỷ lệ; đã phân lập trước đó hoặc có cư trú.",
    "Nguy cơ cao MRSA: có một tiêu chuẩn đa kháng; đơn vị có tỷ lệ MRSA > 10% hoặc chưa biết tỷ lệ; đã phân lập trước đó hoặc có MRSA cư trú.",
    "Kháng sinh đồ BV199 và tỷ lệ nhạy cảm tại đơn vị.",
  ],
};

/* Du lieu dung chung cho bo may lua chon khang sinh (lib/antibiotics/selection-engine.ts). */
export const HAPVAP_SCENARIOS: Record<Kind, Scenario[]> = { hap: HAP, vap: VAP };
export const HAPVAP_RISK = RISK;
export type { Drug as HapVapDrug, Regimen as HapVapRegimen, Scenario as HapVapScenario };

function hvCard(r: Regimen): TxCard {
  const s = structureForOption(`module-${r.id}`, r.drugs);
  return {
    id: r.id,
    condition: r.indication,
    groups: s.groups,
    status: s.status,
    linkTexts: r.drugs.map((d) => `${d.name}: ${d.dose} ${d.route}`),
    linkScenario: r.name,
    sources: [r.source],
  };
}

export default function HapVap2023({
  kind,
  initialScenarioId,
}: {
  kind: Kind;
  initialScenarioId?: string;
}) {
  const scenarios = kind === "hap" ? HAP : VAP;
  const [scenarioId, setScenarioId] = useState(initialScenarioId ?? "");
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];

  /* Nguon: cac the la VI DU to hop theo quy tac bang (ngang hang, khong thu tu uu tien). */
  const sections: TxSection[] = scenario.regimens.length
    ? [{ key: "equal", title: scenario.regimens.length > 1 ? "Các lựa chọn được khuyến cáo" : "Phác đồ khuyến cáo", itemLabel: "Lựa chọn", cards: scenario.regimens.map(hvCard), startAt: 1 }]
    : [];

  const notes = [
    "Mỗi lựa chọn là một tổ hợp ví dụ theo quy tắc của bảng nguồn – không phải thứ tự ưu tiên.",
    "Phần lớn tác nhân VPBV/VPLQTM ở Việt Nam là P. aeruginosa và vi khuẩn Gram âm khác – chọn kháng sinh có tác dụng trên P. aeruginosa và Gram âm.",
    kind === "hap"
      ? "HAP nặng hoặc có nguy cơ đa kháng: phối hợp hai kháng sinh; các trường hợp còn lại có thể đơn trị bằng một kháng sinh có tác dụng trên P. aeruginosa (tr. 57)."
      : "VPLQTM có yếu tố nguy cơ đa kháng, đơn vị có > 10% kháng với thuốc đơn trị hoặc chưa biết tỷ lệ nhạy cảm: phối hợp hai kháng sinh thuộc hai nhóm khác nhau (tr. 63).",
    "Không dùng aminoglycosid hoặc colistin đơn độc.",
    `Đơn vị có tỷ lệ Acinetobacter baumannii kháng carbapenem${kind === "hap" ? "" : " (đa kháng)"} > 25%, bệnh nặng và không đáp ứng sau 48–72 giờ: có thể xem xét colistin.`,
    "Thuốc chống MRSA chỉ bổ sung khi bệnh nặng/có yếu tố nguy cơ hoặc đơn vị có MRSA > 10% hay không có dữ liệu; piperacillin/tazobactam, cefepim, levofloxacin, imipenem, meropenem cũng có hiệu quả trên MSSA.",
    "Điều chỉnh liều theo chức năng thận: liều trong bảng dành cho người bệnh không suy thận; hiệu chỉnh theo mức lọc cầu thận hoặc khi CRRT, IHD, PEX, ECMO (tr. 57, 63).",
    ...scenario.regimens.flatMap((r) => [...r.notes, ...r.drugs.map((d) => d.caution)].filter((x): x is string => !!x)),
  ];
  const monitoring = [
    "Đánh giá đáp ứng sau 48–72 giờ; xuống thang hoặc điều chỉnh theo cấy, kháng sinh đồ và diễn biến lâm sàng (tr. 51).",
    "Thời gian điều trị thông thường 7 ngày nếu không phải vi khuẩn đa kháng và đáp ứng tốt; có thể kéo dài theo vi khuẩn và cơ địa (tr. 51, 78).",
    "Ngừng kháng sinh dựa vào đáp ứng lâm sàng và procalcitonin: ngưỡng 0,25–0,5 (đơn vị theo bản gốc ghi “ng/lít”, cần đối chiếu) hoặc giảm ≥ 80% so với đỉnh (tr. 78).",
    "Không đáp ứng sau một thời gian điều trị: hội chẩn dược lâm sàng, vi sinh, tìm căn nguyên khác (tr. 78).",
  ];

  const footer = (
    <div style={{ display: "grid", gap: 6, marginTop: 10, fontSize: 13 }}>
      <details>
        <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 12.5, color: "#087f89" }}>Yếu tố nguy cơ đa kháng và MRSA</summary>
        <ul style={{ margin: "6px 0", paddingLeft: 18, lineHeight: 1.6 }}>
          {RISK[kind].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
      {scenario.pool && (
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 12.5, color: "#087f89" }}>Danh sách thuốc theo nhóm của bảng nguồn</summary>
          {scenario.pool.map((group) => (
            <div key={group.title} style={{ margin: "6px 0" }}>
              <b>{group.title}</b>
              <ul style={{ paddingLeft: 18, margin: "4px 0", lineHeight: 1.6 }}>
                {group.drugs.map((drug) => (
                  <li key={`${group.title}-${drug.name}`}>
                    <b>{drug.name}:</b> {drug.dose}
                    {drug.caution ? ` — ${drug.caution}` : ""}
                  </li>
                ))}
              </ul>
              <DrugActionLinks compact texts={group.drugs.map((drug) => `${drug.name}: ${drug.dose} ${drug.route}`)} scenario={group.title} />
            </div>
          ))}
        </details>
      )}
    </div>
  );

  return (
    <TreatmentPanel
      scenarios={scenarios.map(s=>({value:s.id,label:s.title,criteria:[s.title],definitionNotes:RISK[kind],regimenIds:s.regimens.map(r=>r.id),sources:[...new Set(s.regimens.map(r=>r.source))]}))}
      scenario={scenario.id}
      initialChoice={initialScenarioId}
      onScenario={setScenarioId}
      scenarioHint={scenario.description}
      sourceTag="Hội Hô hấp VN & Hội HSCC-CĐ VN · 2023"
      rationale={getModuleRationale(kind, scenario.id)}
      sections={sections}
      notes={Array.from(new Set(notes))}
      monitoring={monitoring}
      sources={[
        kind === "hap"
          ? "Khuyến cáo VPBV/VPLQTM 2023 (Hội Hô hấp VN, Hội HSCC-CĐ VN) – Bảng 3.1, tr. 53–57; Mục 4, tr. 78"
          : "Khuyến cáo VPBV/VPLQTM 2023 (Hội Hô hấp VN, Hội HSCC-CĐ VN) – Bảng 3.2, tr. 60–63; Mục 4, tr. 78",
      ]}
      footer={footer}
    />
  );
}
