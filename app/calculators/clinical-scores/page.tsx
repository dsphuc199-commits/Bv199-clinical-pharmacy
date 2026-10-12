
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/*
====================================================
BV199 CLINICAL PHARMACY
MODULE: THANG ĐIỂM LÂM SÀNG

Đường dẫn:
app/calculators/clinical-scores/page.tsx

13 công cụ:
01. GCS
02. Karnofsky
03. qSOFA
04. RIFLE
05. KDIGO AKI
06. Child-Pugh
07. CHA2DS2-VA
08. HAS-BLED
09. Padua
10. DRIP
11. Ramsay
12. RASS
13. Candida Score

Không cần thư viện ngoài.
Không chỉnh sửa Sidebar.
====================================================
*/

type Option = {
  label: string;
  value: number;
};

type Question = {
  id: string;
  label: string;
  type: "select" | "check";
  options?: Option[];
  points?: number;
};

type Score = {
  id: string;
  short: string;
  name: string;
  group: string;
  description: string;
  questions: Question[];
  source: string;
  interpret: (score: number) => string;
  caution?: string;
};

type Answers = Record<string, number | boolean>;

const selectQ = (
  id: string,
  label: string,
  options: Option[]
): Question => ({
  id,
  label,
  options,
  type: "select",
});

const checkQ = (
  id: string,
  label: string,
  points: number
): Question => ({
  id,
  label,
  points,
  type: "check",
});

const opts = (
  items: [string, number][]
): Option[] =>
  items.map(([label, value]) => ({
    label,
    value,
  }));

/*
====================================================
DỮ LIỆU 11 THANG ĐIỂM DẠNG CHỌN ĐIỂM
RIFLE VÀ KDIGO SẼ TÍNH RIÊNG
====================================================
*/

const SCORES: Score[] = [
  {
    id: "gcs",
    short: "GCS",
    name: "Glasgow Coma Scale",
    group: "Hồi sức",
    description:
      "Đánh giá mức độ ý thức qua đáp ứng mở mắt, lời nói và vận động.",
    source: "Glasgow Coma Scale",
    questions: [
      selectQ("eye", "Đáp ứng mở mắt (E)", opts([
        ["4 - Mở mắt tự nhiên", 4],
        ["3 - Mở mắt khi gọi", 3],
        ["2 - Mở mắt khi kích thích đau", 2],
        ["1 - Không mở mắt", 1],
      ])),
      selectQ("verbal", "Đáp ứng lời nói (V)", opts([
        ["5 - Trả lời định hướng đúng", 5],
        ["4 - Trả lời lộn xộn", 4],
        ["3 - Nói từ không phù hợp", 3],
        ["2 - Âm thanh khó hiểu", 2],
        ["1 - Không đáp ứng lời nói", 1],
      ])),
      selectQ("motor", "Đáp ứng vận động (M)", opts([
        ["6 - Làm theo lệnh", 6],
        ["5 - Định khu đau", 5],
        ["4 - Rụt chi khi kích thích đau", 4],
        ["3 - Gấp bất thường", 3],
        ["2 - Duỗi bất thường", 2],
        ["1 - Không đáp ứng vận động", 1],
      ])),
    ],
    interpret: n =>
      n <= 8
        ? "GCS 3–8: mức suy giảm ý thức nặng theo phân tầng thông dụng."
        : n <= 12
        ? "GCS 9–12: suy giảm ý thức mức trung bình."
        : "GCS 13–15: suy giảm ý thức nhẹ hoặc ý thức bình thường.",
    caution:
      "GCS cần ghi riêng E/V/M. Nếu bệnh nhân đặt nội khí quản hoặc không thể đánh giá một thành phần, không tự gán điểm thấp nhất.",
  },

  {
    id: "kps",
    short: "Karnofsky",
    name: "Karnofsky Performance Status",
    group: "Chức năng toàn thân",
    description:
      "Đánh giá khả năng hoạt động và mức độ tự chăm sóc.",
    source: "Karnofsky Performance Status",
    questions: [
      selectQ("status", "Tình trạng chức năng", opts([
        ["100 - Bình thường, không có triệu chứng", 100],
        ["90 - Hoạt động bình thường, triệu chứng nhẹ", 90],
        ["80 - Hoạt động được nhưng phải gắng sức", 80],
        ["70 - Tự chăm sóc, không làm việc bình thường", 70],
        ["60 - Đôi khi cần hỗ trợ", 60],
        ["50 - Cần hỗ trợ và chăm sóc y tế thường xuyên", 50],
        ["40 - Cần chăm sóc đặc biệt", 40],
        ["30 - Bệnh nặng, cần nằm viện", 30],
        ["20 - Rất nặng, cần điều trị hỗ trợ tích cực", 20],
        ["10 - Hấp hối", 10],
        ["0 - Tử vong", 0],
      ])),
    ],
    interpret: n =>
      n >= 80
        ? "Khả năng hoạt động tương đối tốt."
        : n >= 50
        ? "Có hạn chế chức năng và cần hỗ trợ ở mức độ khác nhau."
        : "Suy giảm chức năng nặng.",
  },

  {
    id: "qsofa",
    short: "qSOFA",
    name: "Quick Sequential Organ Failure Assessment",
    group: "Hồi sức",
    description:
      "Công cụ sàng lọc nguy cơ diễn tiến xấu ở bệnh nhân nghi nhiễm khuẩn.",
    source: "Sepsis-3",
    questions: [
      checkQ("rr", "Nhịp thở ≥ 22 lần/phút", 1),
      checkQ("sbp", "Huyết áp tâm thu ≤ 100 mmHg", 1),
      checkQ("mental", "Thay đổi tri giác hoặc GCS < 15", 1),
    ],
    interpret: n =>
      n >= 2
        ? "qSOFA ≥ 2: nguy cơ kết cục bất lợi cao hơn. Cần đánh giá lâm sàng và rối loạn chức năng cơ quan."
        : "qSOFA 0–1: không loại trừ nhiễm khuẩn huyết.",
    caution:
      "Không dùng qSOFA đơn độc để xác định hoặc loại trừ sepsis.",
  },

  {
    id: "child",
    short: "Child–Pugh",
    name: "Child–Pugh Classification",
    group: "Gan & Thận",
    description:
      "Phân loại mức độ suy giảm chức năng gan trong bệnh gan mạn, đặc biệt xơ gan.",
    source: "Child–Pugh classification",
    questions: [
      selectQ("bilirubin", "Bilirubin toàn phần", opts([
        ["< 2 mg/dL", 1],
        ["2–3 mg/dL", 2],
        ["> 3 mg/dL", 3],
      ])),
      selectQ("albumin", "Albumin huyết thanh", opts([
        ["> 35 g/L", 1],
        ["28–35 g/L", 2],
        ["< 28 g/L", 3],
      ])),
      selectQ("inr", "INR", opts([
        ["< 1,7", 1],
        ["1,7–2,3", 2],
        ["> 2,3", 3],
      ])),
      selectQ("ascites", "Cổ trướng", opts([
        ["Không có", 1],
        ["Nhẹ hoặc kiểm soát được", 2],
        ["Nặng hoặc khó kiểm soát", 3],
      ])),
      selectQ("encephalopathy", "Bệnh não gan", opts([
        ["Không có", 1],
        ["Độ I–II", 2],
        ["Độ III–IV", 3],
      ])),
    ],
    interpret: n =>
      n <= 6
        ? "Child–Pugh A (5–6 điểm)."
        : n <= 9
        ? "Child–Pugh B (7–9 điểm)."
        : "Child–Pugh C (10–15 điểm).",
    caution:
      "Không sử dụng Child–Pugh thay thế cho đánh giá chuyển hóa và thải trừ của từng thuốc. Một số bệnh lý gan mật cần quy tắc chấm điểm đặc thù.",
  },

  {
    id: "chads",
    short: "CHA₂DS₂-VA",
    name: "CHA₂DS₂-VA – Nguy cơ huyết khối trong rung nhĩ",
    group: "Tim mạch & Huyết khối",
    description:
      "Đánh giá nguy cơ huyết khối tắc mạch trong rung nhĩ theo ESC 2024.",
    source: "ESC Guidelines 2024",
    questions: [
      checkQ("hf", "Suy tim hoặc rối loạn chức năng thất trái", 1),
      checkQ("htn", "Tăng huyết áp", 1),
      selectQ("age", "Tuổi", opts([
        ["< 65 tuổi", 0],
        ["65–74 tuổi", 1],
        ["≥ 75 tuổi", 2],
      ])),
      checkQ("diabetes", "Đái tháo đường", 1),
      checkQ("stroke", "Đột quỵ, TIA hoặc thuyên tắc trước đó", 2),
      checkQ("vascular", "Bệnh mạch máu", 1),
    ],
    interpret: n =>
      n === 0
        ? "0 điểm: nguy cơ thấp theo thang điểm."
        : n === 1
        ? "1 điểm: nên cân nhắc chống đông theo đánh giá cá thể."
        : "≥ 2 điểm: chống đông được khuyến cáo theo ESC 2024 nếu không có chống chỉ định.",
    caution:
      "Không tự động kê đơn chống đông. Cần đối chiếu loại rung nhĩ, bệnh van tim, chống chỉ định và nguy cơ chảy máu.",
  },

  {
    id: "hasbled",
    short: "HAS-BLED",
    name: "HAS-BLED Bleeding Risk Score",
    group: "Tim mạch & Huyết khối",
    description:
      "Xác định các yếu tố nguy cơ chảy máu có thể điều chỉnh ở người bệnh dùng chống đông.",
    source: "HAS-BLED",
    questions: [
      checkQ("hypertension", "Huyết áp tâm thu > 160 mmHg", 1),
      checkQ("renal", "Chức năng thận bất thường theo tiêu chí gốc", 1),
      checkQ("liver", "Chức năng gan bất thường theo tiêu chí gốc", 1),
      checkQ("stroke", "Tiền sử đột quỵ", 1),
      checkQ("bleeding", "Tiền sử hoặc khuynh hướng chảy máu", 1),
      checkQ("labile", "INR không ổn định khi dùng VKA", 1),
      checkQ("age", "Tuổi > 65", 1),
      checkQ("drugs", "Dùng thuốc tăng nguy cơ chảy máu", 1),
      checkQ("alcohol", "Uống rượu quá mức theo tiêu chí HAS-BLED", 1),
    ],
    interpret: n =>
      n >= 3
        ? "HAS-BLED ≥ 3: nguy cơ xuất huyết cao hơn. Cần rà soát và khắc phục các yếu tố nguy cơ có thể điều chỉnh."
        : "HAS-BLED < 3: nguy cơ thấp hơn theo thang điểm.",
    caution:
      "Không dùng HAS-BLED như tiêu chí duy nhất để từ chối điều trị chống đông.",
  },

  {
    id: "padua",
    short: "Padua",
    name: "Padua Prediction Score",
    group: "Tim mạch & Huyết khối",
    description:
      "Phân tầng nguy cơ thuyên tắc huyết khối tĩnh mạch ở người bệnh nội khoa nhập viện.",
    source: "Padua Prediction Score",
    questions: [
      checkQ("cancer", "Ung thư tiến triển", 3),
      checkQ("vte", "Tiền sử VTE", 3),
      checkQ("mobility", "Giảm vận động theo định nghĩa Padua", 3),
      checkQ("thrombophilia", "Tình trạng tăng đông đã biết", 3),
      checkQ("surgery", "Chấn thương hoặc phẫu thuật trong ≤ 1 tháng", 2),
      checkQ("age", "Tuổi ≥ 70", 1),
      checkQ("failure", "Suy tim hoặc suy hô hấp", 1),
      checkQ("infarction", "Nhồi máu cơ tim cấp hoặc đột quỵ thiếu máu não cấp", 1),
      checkQ("infection", "Nhiễm khuẩn cấp hoặc bệnh thấp khớp", 1),
      checkQ("obesity", "BMI ≥ 30", 1),
      checkQ("hormone", "Điều trị hormone", 1),
    ],
    interpret: n =>
      n >= 4
        ? "Padua ≥ 4: nguy cơ VTE cao hơn; cần đánh giá dự phòng và nguy cơ xuất huyết."
        : "Padua < 4: nguy cơ VTE thấp hơn theo thang điểm.",
  },

  {
    id: "drip",
    short: "DRIP",
    name: "Drug Resistance in Pneumonia Score",
    group: "Nhiễm khuẩn",
    description:
      "Đánh giá nguy cơ vi khuẩn kháng thuốc ở người bệnh viêm phổi theo mô hình DRIP.",
    source: "DRIP Score – mô hình dự đoán vi khuẩn kháng thuốc",
    questions: [
      checkQ("antibiotics", "Dùng kháng sinh trong 60 ngày trước", 2),
      checkQ("care", "Chăm sóc dài hạn tại cơ sở điều dưỡng", 2),
      checkQ("feeding", "Nuôi dưỡng qua ống thông", 2),
      checkQ("prior", "Nhiễm vi khuẩn kháng thuốc trong 1 năm", 2),
      checkQ("hospital", "Nhập viện trong 60 ngày trước", 1),
      checkQ("lung", "Bệnh phổi mạn tính", 1),
      checkQ("functional", "Karnofsky < 70", 1),
      checkQ("acid", "Dùng PPI hoặc thuốc kháng H2", 1),
      checkQ("wound", "Có vết thương cần chăm sóc", 1),
      checkQ("mrsa", "Có tình trạng định cư MRSA trong 1 năm", 1),
    ],
    interpret: n =>
      n >= 4
        ? "DRIP ≥ 4: nguy cơ tác nhân kháng thuốc cao hơn trong mô hình được nghiên cứu."
        : "DRIP < 4: nguy cơ thấp hơn theo mô hình DRIP.",
    caution:
      "Cần thẩm định đúng định nghĩa từng tiêu chí theo nghiên cứu gốc và dữ liệu bệnh viện. Không tự mở rộng phổ kháng sinh chỉ dựa vào điểm DRIP.",
  },

  {
    id: "ramsay",
    short: "Ramsay",
    name: "Ramsay Sedation Scale",
    group: "Hồi sức",
    description: "Đánh giá mức độ an thần.",
    source: "Ramsay Sedation Scale",
    questions: [
      selectQ("sedation", "Tình trạng người bệnh", opts([
        ["1 - Lo âu, kích động hoặc bồn chồn", 1],
        ["2 - Hợp tác, định hướng tốt và yên tĩnh", 2],
        ["3 - Chỉ đáp ứng với mệnh lệnh", 3],
        ["4 - Đáp ứng nhanh với kích thích", 4],
        ["5 - Đáp ứng chậm với kích thích", 5],
        ["6 - Không đáp ứng", 6],
      ])),
    ],
    interpret: n =>
      `Ramsay ${n}/6. Mức điểm cao hơn biểu thị an thần sâu hơn.`,
  },

  {
    id: "rass",
    short: "RASS",
    name: "Richmond Agitation–Sedation Scale",
    group: "Hồi sức",
    description:
      "Đánh giá kích động hoặc an thần tại khoa Hồi sức.",
    source: "Richmond Agitation–Sedation Scale",
    questions: [
      selectQ("rass", "Mức độ kích động / an thần", opts([
        ["+4 - Hung hăng, nguy hiểm", 4],
        ["+3 - Rất kích động", 3],
        ["+2 - Kích động", 2],
        ["+1 - Bồn chồn", 1],
        ["0 - Tỉnh táo, bình tĩnh", 0],
        ["-1 - Buồn ngủ, giao tiếp mắt >10 giây", -1],
        ["-2 - An thần nhẹ, giao tiếp mắt <10 giây", -2],
        ["-3 - An thần vừa, mở mắt nhưng không giao tiếp mắt", -3],
        ["-4 - An thần sâu, có đáp ứng với kích thích thể chất", -4],
        ["-5 - Không thể đánh thức", -5],
      ])),
    ],
    interpret: n =>
      n > 0
        ? `RASS +${n}: biểu hiện kích động.`
        : n === 0
        ? "RASS 0: tỉnh táo, bình tĩnh."
        : `RASS ${n}: tình trạng an thần.`,
  },

  {
    id: "candida",
    short: "Candida Score",
    name: "Candida Score",
    group: "Nhiễm khuẩn",
    description:
      "Ước tính nguy cơ nhiễm Candida xâm lấn trong quần thể bệnh nhân ICU phù hợp.",
    source: "Candida Score – León và cộng sự",
    questions: [
      checkQ("surgery", "Phẫu thuật", 1),
      checkQ("tpn", "Dinh dưỡng hoàn toàn đường tĩnh mạch", 1),
      checkQ("colon", "Candida hiện diện ở nhiều vị trí", 1),
      checkQ("sepsis", "Nhiễm khuẩn huyết nặng theo định nghĩa nghiên cứu", 2),
    ],
    interpret: n =>
      n > 2.5
        ? "Candida Score > 2,5: nguy cơ Candida xâm lấn cao hơn trong quần thể áp dụng."
        : "Candida Score ≤ 2,5: nguy cơ thấp hơn theo mô hình.",
    caution:
      "Không dùng Candida Score đơn độc để chẩn đoán nhiễm nấm xâm lấn hoặc chỉ định thuốc kháng nấm.",
  },
];

type ScoreNav = {
  id: string;
  short: string;
  name: string;
  group: string;
};

const RENAL_NAV: ScoreNav[] = [
  {
    id: "rifle",
    short: "RIFLE",
    name: "RIFLE – Phân loại tổn thương thận cấp",
    group: "Gan & Thận",
  },
  {
    id: "kdigo",
    short: "KDIGO AKI",
    name: "KDIGO – Phân giai đoạn tổn thương thận cấp",
    group: "Gan & Thận",
  },
];

const ALL_NAV: ScoreNav[] = [
  ...SCORES.map(item => ({
    id: item.id,
    short: item.short,
    name: item.name,
    group: item.group,
  })),
  ...RENAL_NAV,
];

const GROUPS = [
  "Tất cả",
  "Hồi sức",
  "Nhiễm khuẩn",
  "Gan & Thận",
  "Tim mạch & Huyết khối",
  "Chức năng toàn thân",
];

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function numberOrNull(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value.replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

/*
====================================================
RENAL CALCULATORS

Không kết luận không có AKI chỉ vì số liệu
chưa đủ.

KDIGO và RIFLE sử dụng creatinin mg/dL.

Kết quả chỉ được tính với các điều kiện
thời gian người dùng đã xác minh.
====================================================
*/

function kdigoCalculate(
  baseline: number | null,
  current: number | null,
  timing48: boolean,
  timing7: boolean,
  urine: number | null,
  hours: number | null,
  anuria: boolean,
  rrt: boolean
) {
  let stage = 0;
  const reasons: string[] = [];

  if (rrt) {
    stage = 3;
    reasons.push("Đã bắt đầu điều trị thay thế thận.");
  }

  if (
    baseline !== null &&
    baseline > 0 &&
    current !== null
  ) {
    const ratio = current / baseline;
    const delta = current - baseline;

    if (timing7 && ratio >= 3) {
      stage = Math.max(stage, 3);
      reasons.push("Creatinin ≥ 3 lần giá trị nền.");
    } else if (
      current >= 4 &&
      baseline < 4 &&
      delta >= 0.3 &&
      timing48
    ) {
      stage = Math.max(stage, 3);
      reasons.push(
        "Creatinin ≥ 4 mg/dL cùng mức tăng cấp được xác minh."
      );
    } else if (timing7 && ratio >= 2) {
      stage = Math.max(stage, 2);
      reasons.push("Creatinin tăng 2–2,9 lần nền.");
    } else if (
      (timing7 && ratio >= 1.5) ||
      (timing48 && delta >= 0.3)
    ) {
      stage = Math.max(stage, 1);
      reasons.push("Creatinin đạt tiêu chí KDIGO 1.");
    }
  }

  if (hours !== null) {
    if (anuria && hours >= 12) {
      stage = 3;
      reasons.push("Vô niệu ≥ 12 giờ.");
    } else if (urine !== null) {
      if (urine < 0.3 && hours >= 24) {
        stage = 3;
        reasons.push(
          "Nước tiểu < 0,3 mL/kg/giờ trong ≥ 24 giờ."
        );
      } else if (urine < 0.5 && hours >= 12) {
        stage = Math.max(stage, 2);
        reasons.push(
          "Nước tiểu < 0,5 mL/kg/giờ trong ≥ 12 giờ."
        );
      } else if (urine < 0.5 && hours >= 6) {
        stage = Math.max(stage, 1);
        reasons.push(
          "Nước tiểu < 0,5 mL/kg/giờ trong ≥ 6 giờ."
        );
      }
    }
  }

  return { stage, reasons };
}

function rifleCalculate(
  baseline: number | null,
  current: number | null,
  urine: number | null,
  hours: number | null,
  anuria: boolean
) {
  let stage = 0;
  const reasons: string[] = [];

  if (
    baseline !== null &&
    baseline > 0 &&
    current !== null
  ) {
    const ratio = current / baseline;

    if (
      ratio >= 3 ||
      (current >= 4 && current - baseline >= 0.5)
    ) {
      stage = 3;
      reasons.push("Creatinin đạt tiêu chí Failure.");
    } else if (ratio >= 2) {
      stage = 2;
      reasons.push("Creatinin đạt tiêu chí Injury.");
    } else if (ratio >= 1.5) {
      stage = 1;
      reasons.push("Creatinin đạt tiêu chí Risk.");
    }
  }

  if (hours !== null) {
    if (anuria && hours >= 12) {
      stage = 3;
      reasons.push("Vô niệu ≥ 12 giờ.");
    } else if (urine !== null) {
      if (urine < 0.3 && hours >= 24) {
        stage = 3;
        reasons.push("Tiêu chí nước tiểu Failure.");
      } else if (urine < 0.5 && hours >= 12) {
        stage = Math.max(stage, 2);
        reasons.push("Tiêu chí nước tiểu Injury.");
      } else if (urine < 0.5 && hours >= 6) {
        stage = Math.max(stage, 1);
        reasons.push("Tiêu chí nước tiểu Risk.");
      }
    }
  }

  const labels = [
    "Chưa phân loại được R/I/F",
    "Risk",
    "Injury",
    "Failure",
  ];

  return {
    stage,
    label: labels[stage],
    reasons,
  };
}

export default function ClinicalScoresPage() {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("Tất cả");
  const [active, setActive] = useState("gcs");
  const [answers, setAnswers] = useState<Answers>({});

  const [baselineText, setBaselineText] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [urineText, setUrineText] = useState("");
  const [hoursText, setHoursText] = useState("");

  const [timing48, setTiming48] = useState(false);
  const [timing7, setTiming7] = useState(false);
  const [anuria, setAnuria] = useState(false);
  const [rrt, setRrt] = useState(false);

  const visibleNav = useMemo(() => {
    const term = normalize(search);

    return ALL_NAV.filter(item => {
      const matchesGroup =
        group === "Tất cả" || item.group === group;

      const matchesText = normalize(
        `${item.short} ${item.name} ${item.group}`
      ).includes(term);

      return matchesGroup && matchesText;
    });
  }, [search, group]);

  const selectedScore = SCORES.find(
    item => item.id === active
  );

  const isRenal =
    active === "rifle" || active === "kdigo";

  const complete = selectedScore
    ? selectedScore.questions.every(q =>
        q.type === "check" ||
        answers[q.id] !== undefined
      )
    : false;

  const total = selectedScore
    ? selectedScore.questions.reduce((sum, q) => {
        if (q.type === "check") {
          return sum +
            (answers[q.id] === true
              ? q.points ?? 0
              : 0);
        }

        const value = answers[q.id];
        return sum +
          (typeof value === "number" ? value : 0);
      }, 0)
    : 0;

  const baseline = numberOrNull(baselineText);
  const current = numberOrNull(currentText);
  const urine = numberOrNull(urineText);
  const hours = numberOrNull(hoursText);

  const renalHasInput =
    (baseline !== null &&
      baseline > 0 &&
      current !== null) ||
    (hours !== null &&
      (urine !== null || anuria)) ||
    (active === "kdigo" && rrt);

  const renal = active === "kdigo"
    ? kdigoCalculate(
        baseline,
        current,
        timing48,
        timing7,
        urine,
        hours,
        anuria,
        rrt
      )
    : rifleCalculate(
        baseline,
        current,
        urine,
        hours,
        anuria
      );

  function resetValues() {
    setAnswers({});
    setBaselineText("");
    setCurrentText("");
    setUrineText("");
    setHoursText("");
    setTiming48(false);
    setTiming7(false);
    setAnuria(false);
    setRrt(false);
  }

  function openScore(id: string) {
    setActive(id);
    resetValues();
  }

  const resultText = selectedScore && complete
    ? selectedScore.interpret(total)
    : "";

  return (
    <main className="bvscore-page">
      <div className="bvscore-container">

        {/* ĐIỀU HƯỚNG */}
        <nav className="bvscore-breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span>›</span>
          <Link href="/calculators">
            Công cụ lâm sàng
          </Link>
          <span>›</span>
          <strong>Thang điểm lâm sàng</strong>
        </nav>

        {/* TIÊU ĐỀ */}
        <header className="bvscore-header">
          <div>
            <span className="bvscore-eyebrow">
              KHOA DƯỢC · BỆNH VIỆN 199
            </span>
            <h1>Thang điểm lâm sàng</h1>
            <p>
              Tra cứu, nhập tiêu chí và tính điểm
              hỗ trợ đánh giá người bệnh.
            </p>
          </div>
        </header>

        <div className="bvscore-layout">

          {/* CỘT DANH MỤC */}
          <aside className="bvscore-sidebar">
            <div className="bvscore-sidebar-head">
              <strong>Danh mục thang điểm</strong>
              <span>
                {visibleNav.length}/{ALL_NAV.length}
              </span>
            </div>

            <div className="bvscore-filters">
              <input
                aria-label="Tìm thang điểm"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm Glasgow, KDIGO, DRIP..."
              />

              <select
                aria-label="Lọc chuyên khoa"
                value={group}
                onChange={e => setGroup(e.target.value)}
              >
                {GROUPS.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="bvscore-nav-list">
              {visibleNav.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openScore(item.id)}
                  className={
                    "bvscore-nav-item " +
                    (active === item.id
                      ? "active"
                      : "")
                  }
                >
                  <div>
                    <strong>{item.short}</strong>
                    <small>{item.name}</small>
                  </div>
                  <span>›</span>
                </button>
              ))}

              {visibleNav.length === 0 && (
                <p className="bvscore-muted">
                  Không tìm thấy thang điểm.
                </p>
              )}
            </div>
          </aside>

          {/* NỘI DUNG */}
          <section className="bvscore-main">

            {selectedScore && (
              <>
                <div className="bvscore-title-row">
                  <div>
                    <span className="bvscore-category">
                      {selectedScore.group}
                    </span>
                    <h2>{selectedScore.short}</h2>
                    <h3>{selectedScore.name}</h3>
                    <p>{selectedScore.description}</p>
                  </div>
                </div>

                <div className="bvscore-divider" />

                <div className="bvscore-section-title">
                  <strong>Tiêu chí đánh giá</strong>
                  <button
                    type="button"
                    onClick={resetValues}
                  >
                    Đặt lại
                  </button>
                </div>

                <div className="bvscore-questions">
                  {selectedScore.questions.map(q =>
                    q.type === "check" ? (
                      <label
                        key={q.id}
                        className="bvscore-check"
                      >
                        <input
                          type="checkbox"
                          checked={
                            answers[q.id] === true
                          }
                          onChange={e =>
                            setAnswers(prev => ({
                              ...prev,
                              [q.id]: e.target.checked,
                            }))
                          }
                        />
                        <span>{q.label}</span>
                        <b>+{q.points}</b>
                      </label>
                    ) : (
                      <label
                        key={q.id}
                        className="bvscore-select-field"
                      >
                        <span>{q.label}</span>
                        <select
                          value={
                            answers[q.id] === undefined
                              ? ""
                              : String(answers[q.id])
                          }
                          onChange={e => {
                            const value = e.target.value;

                            setAnswers(prev => {
                              const next = { ...prev };

                              if (value === "") {
                                delete next[q.id];
                              } else {
                                next[q.id] = Number(value);
                              }

                              return next;
                            });
                          }}
                        >
                          <option value="">
                            -- Chọn tiêu chí --
                          </option>

                          {q.options?.map((o, index) => (
                            <option
                              key={`${q.id}-${index}`}
                              value={o.value}
                            >
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    )
                  )}
                </div>

                <div className="bvscore-result">
                  <strong>Kết quả tính điểm</strong>

                  {complete ? (
                    <>
                      <div className="bvscore-score-value">
                        {selectedScore.id === "rass" &&
                        total > 0
                          ? `+${total}`
                          : total}

                        {selectedScore.id === "child" && (
                          <span>
                            {" · "}Child–Pugh{" "}
                            {total <= 6
                              ? "A"
                              : total <= 9
                              ? "B"
                              : "C"}
                          </span>
                        )}
                      </div>

                      <p>{resultText}</p>

                      {selectedScore.id === "gcs" && (
                        <p className="bvscore-breakdown">
                          E{String(answers.eye)}
                          {" · "}
                          V{String(answers.verbal)}
                          {" · "}
                          M{String(answers.motor)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="bvscore-muted">
                      Hãy chọn đầy đủ các tiêu chí
                      để hệ thống hiển thị kết quả.
                    </p>
                  )}
                </div>

                {selectedScore.caution && (
                  <div className="bvscore-caution">
                    <strong>Lưu ý</strong>
                    <p>{selectedScore.caution}</p>
                  </div>
                )}

                <p className="bvscore-source">
                  Nguồn chuyên môn: {selectedScore.source}.
                  Cần đối chiếu định nghĩa và tiêu chí
                  trong tài liệu gốc trước khi áp dụng.
                </p>
              </>
            )}

            {/* RIFLE & KDIGO */}
            {isRenal && (
              <>
                <div className="bvscore-title-row">
                  <div>
                    <span className="bvscore-category">
                      Gan & Thận
                    </span>

                    <h2>
                      {active === "kdigo"
                        ? "KDIGO AKI"
                        : "RIFLE"}
                    </h2>

                    <p>
                      {active === "kdigo"
                        ? "Phân giai đoạn tổn thương thận cấp."
                        : "Phân loại tổn thương thận cấp: Risk, Injury, Failure."}
                    </p>
                  </div>
                </div>

                <div className="bvscore-caution">
                  Cần xác nhận đơn vị creatinin,
                  thời điểm xét nghiệm, lượng nước tiểu
                  và thời gian quan sát.
                </div>

                <div className="bvscore-numeric-grid">
                  <label>
                    Creatinin nền (mg/dL)
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={baselineText}
                      onChange={e =>
                        setBaselineText(e.target.value)
                      }
                      placeholder="Ví dụ: 0.9"
                    />
                  </label>

                  <label>
                    Creatinin hiện tại (mg/dL)
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={currentText}
                      onChange={e =>
                        setCurrentText(e.target.value)
                      }
                      placeholder="Ví dụ: 1.8"
                    />
                  </label>

                  <label>
                    Lượng nước tiểu (mL/kg/giờ)
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={urineText}
                      onChange={e =>
                        setUrineText(e.target.value)
                      }
                      placeholder="Ví dụ: 0.4"
                    />
                  </label>

                  <label>
                    Thời gian theo dõi (giờ)
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={hoursText}
                      onChange={e =>
                        setHoursText(e.target.value)
                      }
                      placeholder="Ví dụ: 12"
                    />
                  </label>
                </div>

                <div className="bvscore-check-list">
                  <label>
                    <input
                      type="checkbox"
                      checked={anuria}
                      onChange={e =>
                        setAnuria(e.target.checked)
                      }
                    />
                    Người bệnh vô niệu trong thời gian
                    đã nhập.
                  </label>

                  {active === "kdigo" && (
                    <>
                      <label>
                        <input
                          type="checkbox"
                          checked={timing48}
                          onChange={e =>
                            setTiming48(e.target.checked)
                          }
                        />
                        Đã xác minh thay đổi creatinin
                        trong vòng 48 giờ.
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={timing7}
                          onChange={e =>
                            setTiming7(e.target.checked)
                          }
                        />
                        Đã xác minh tăng creatinin
                        trong vòng 7 ngày.
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={rrt}
                          onChange={e =>
                            setRrt(e.target.checked)
                          }
                        />
                        Đã bắt đầu điều trị thay thế thận.
                      </label>
                    </>
                  )}
                </div>

                <div className="bvscore-result">
                  <strong>Kết quả đánh giá</strong>

                  {!renalHasInput ? (
                    <p className="bvscore-muted">
                      Chưa đủ thông tin để phân loại.
                    </p>
                  ) : (
                    <>
                      <div className="bvscore-score-value">
                        {active === "kdigo"
                          ? renal.stage > 0
                            ? `KDIGO ${renal.stage}`
                            : "Chưa xác định"
                          : "label" in renal
                          ? renal.label
                          : "Chưa xác định"}
                      </div>

                      {renal.reasons.length > 0 ? (
                        renal.reasons.map(
                          (reason, index) => (
                            <p key={index}>
                              {reason}
                            </p>
                          )
                        )
                      ) : (
                        <p>
                          Không xác định được mức
                          tổn thương thận từ dữ liệu
                          và thời gian đã khai báo.
                        </p>
                      )}
                    </>
                  )}

                  <p className="bvscore-muted">
                    Không có tiêu chí đạt trong dữ liệu
                    đã nhập không đồng nghĩa loại trừ AKI.
                  </p>
                </div>

                <div className="bvscore-actions">
                  <button
                    type="button"
                    onClick={resetValues}
                  >
                    Xóa dữ liệu
                  </button>
                </div>

                <p className="bvscore-source">
                  KDIGO 2012 / RIFLE.
                  Bản tính hỗ trợ cho người lớn;
                  chưa xử lý đầy đủ tiêu chí nhi khoa,
                  suy giảm GFR của RIFLE và nhóm
                  Loss/End-stage. Cần thẩm định trước
                  khi sử dụng chính thức.
                </p>
              </>
            )}

            <div className="bvscore-safety">
              <strong>Phạm vi sử dụng</strong>
              <p>
                Kết quả thang điểm hỗ trợ đánh giá,
                không thay thế thăm khám, xét nghiệm,
                chẩn đoán và quyết định điều trị.
                Các tiêu chí phải được xác minh theo
                tài liệu gốc và quy trình BV199.
              </p>
            </div>

          </section>
        </div>
      </div>

      {/* CSS HOÀN CHỈNH */}
      <style jsx>{`
        .bvscore-page {
          min-height: 100vh;
          background: #f6f9fc;
          padding: 22px 24px 35px;
          color: #17324b;
          font-family: Arial, sans-serif;
          font-size: 13px;
        }

        .bvscore-container {
          max-width: 1450px;
          margin: auto;
        }

        .bvscore-breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 20px;
          color: #72869e;
          font-size: 12px;
        }

        .bvscore-breadcrumb a {
          color: #075985;
          text-decoration: none;
        }

        .bvscore-header {
          margin-bottom: 20px;
        }

        .bvscore-eyebrow {
          display: block;
          font-size: 10px;
          font-weight: 800;
          color: #087c8c;
          letter-spacing: 1px;
        }

        .bvscore-header h1 {
          font-size: 27px;
          margin: 9px 0;
          color: #0b2945;
        }

        .bvscore-header p {
          margin: 0;
          color: #71859c;
          line-height: 1.7;
        }

        .bvscore-layout {
          display: grid;
          grid-template-columns:
            minmax(250px, 310px)
            minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .bvscore-sidebar,
        .bvscore-main {
          background: #ffffff;
          border: 1px solid #dce7f0;
          border-radius: 13px;
          overflow: hidden;
        }

        .bvscore-sidebar {
          position: sticky;
          top: 12px;
        }

        .bvscore-sidebar-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
        }

        .bvscore-sidebar-head strong {
          font-size: 14px;
        }

        .bvscore-sidebar-head span {
          color: #71869a;
          font-size: 11px;
        }

        .bvscore-filters {
          display: grid;
          gap: 9px;
          padding: 0 13px 13px;
          border-bottom: 1px solid #e8edf3;
        }

        .bvscore-filters input,
        .bvscore-filters select {
          box-sizing: border-box;
          width: 100%;
          height: 42px;
          padding: 0 12px;
          border: 1px solid #ccdeec;
          border-radius: 9px;
          background: white;
          color: #173750;
          font-size: 12px;
          outline: none;
        }

        .bvscore-nav-list {
          max-height: 68vh;
          min-height: 180px;
          overflow-y: auto;
          padding: 7px;
        }

        .bvscore-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 9px;
          padding: 12px;
          border: 0;
          border-left: 3px solid transparent;
          border-radius: 7px;
          background: #fff;
          color: #25435d;
          text-align: left;
          cursor: pointer;
        }

        .bvscore-nav-item:hover {
          background: #f1f8fe;
        }

        .bvscore-nav-item.active {
          background: #e7f4ff;
          border-left-color: #0875ae;
          color: #075985;
        }

        .bvscore-nav-item > div {
          display: grid;
          gap: 5px;
          min-width: 0;
        }

        .bvscore-nav-item strong {
          font-size: 13px;
        }

        .bvscore-nav-item small {
          font-size: 11px;
          line-height: 1.45;
          color: #748ba0;
        }

        .bvscore-main {
          min-height: 520px;
          padding: 24px;
        }

        .bvscore-title-row h2 {
          font-size: 26px;
          margin: 13px 0 5px;
        }

        .bvscore-title-row h3 {
          font-size: 15px;
          font-weight: 500;
          margin: 0 0 10px;
          color: #50728e;
        }

        .bvscore-title-row p {
          line-height: 1.75;
          color: #698299;
          margin: 8px 0 0;
        }

        .bvscore-category {
          display: inline-block;
          background: #e9f5ff;
          color: #075985;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
        }

        .bvscore-divider {
          border-top: 1px solid #e6edf4;
          margin: 20px 0;
        }

        .bvscore-section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
          gap: 10px;
        }

        .bvscore-section-title strong {
          font-size: 14px;
        }

        .bvscore-section-title button,
        .bvscore-actions button {
          border: 1px solid #cdddea;
          background: white;
          color: #075985;
          border-radius: 8px;
          padding: 9px 12px;
          cursor: pointer;
        }

        .bvscore-questions {
          display: grid;
          gap: 12px;
        }

        .bvscore-check {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px 14px;
          border: 1px solid #e0e9f1;
          border-radius: 9px;
          cursor: pointer;
          line-height: 1.55;
        }

        .bvscore-check input,
        .bvscore-check-list input {
          width: 17px;
          height: 17px;
          accent-color: #0876aa;
          flex-shrink: 0;
        }

        .bvscore-check span {
          flex: 1;
        }

        .bvscore-check b {
          color: #075985;
          white-space: nowrap;
        }

        .bvscore-select-field {
          display: grid;
          gap: 9px;
          font-weight: 700;
        }

        .bvscore-select-field select {
          width: 100%;
          min-height: 44px;
          padding: 11px;
          border: 1px solid #cddfea;
          border-radius: 9px;
          background: white;
          color: #173750;
          font-size: 13px;
        }

        .bvscore-result {
          margin-top: 22px;
          padding: 18px;
          border-radius: 11px;
          background: #f3faff;
          border: 1px solid #d0e4f4;
          line-height: 1.8;
        }

        .bvscore-result > strong {
          font-size: 14px;
          color: #075985;
        }

        .bvscore-score-value {
          font-size: 26px;
          font-weight: 800;
          margin-top: 10px;
          color: #06436a;
        }

        .bvscore-score-value span {
          font-size: 17px;
        }

        .bvscore-result p {
          margin: 8px 0;
        }

        .bvscore-breakdown {
          font-weight: 700;
        }

        .bvscore-muted,
        .bvscore-source {
          color: #70869e;
          font-size: 12px;
          line-height: 1.75;
        }

        .bvscore-source {
          margin-top: 18px;
        }

        .bvscore-caution {
          background: #fff9ef;
          border: 1px solid #efdbb7;
          color: #805622;
          padding: 13px;
          border-radius: 9px;
          line-height: 1.75;
          margin-top: 17px;
        }

        .bvscore-caution p {
          margin: 5px 0 0;
        }

        .bvscore-numeric-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 18px;
        }

        .bvscore-numeric-grid label {
          display: grid;
          gap: 9px;
          font-weight: 700;
        }

        .bvscore-numeric-grid input {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 12px;
          border-radius: 9px;
          border: 1px solid #ccdeea;
          font-size: 13px;
          color: #173750;
        }

        .bvscore-check-list {
          display: grid;
          gap: 12px;
          margin-top: 20px;
        }

        .bvscore-check-list label {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          line-height: 1.65;
          cursor: pointer;
        }

        .bvscore-actions {
          margin-top: 15px;
        }

        .bvscore-safety {
          margin-top: 22px;
          padding: 15px;
          border: 1px solid #e1e9f0;
          border-radius: 9px;
          background: #fbfcfe;
          line-height: 1.7;
          color: #617b92;
        }

        .bvscore-safety strong {
          color: #31526e;
        }

        .bvscore-safety p {
          margin: 7px 0 0;
        }

        @media (max-width: 1000px) {
          .bvscore-layout {
            grid-template-columns:
              minmax(240px, 35%)
              minmax(0, 1fr);
          }
        }

        @media (max-width: 720px) {
          .bvscore-page {
            padding: 12px;
          }

          .bvscore-layout {
            grid-template-columns: 1fr;
          }

          .bvscore-sidebar {
            position: static;
          }

          .bvscore-nav-list {
            max-height: 260px;
          }

          .bvscore-main {
            padding: 16px;
          }

          .bvscore-numeric-grid {
            grid-template-columns: 1fr;
          }

          .bvscore-header h1 {
            font-size: 22px;
          }
        }
      `}</style>
    </main>
  );
}
