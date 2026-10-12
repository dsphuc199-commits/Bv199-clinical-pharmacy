
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/*
  BV199 - CLINICAL SCORES

  Nguồn nội dung:
  Phần 6 - Phụ lục 8:
  Một số thang điểm lâm sàng quan trọng

  12 mục tài liệu, 13 công cụ vì
  mục AKI gồm RIFLE và KDIGO.

  Phiên bản: công cụ hỗ trợ đánh giá.
  Không tự chỉ định điều trị.
*/

type Option = {
  label: string;
  value: number;
};

type Question = {
  id: string;
  label: string;
  options?: Option[];
  points?: number;
  help?: string;
  kind?: "select" | "check";
};

type Score = {
  id: string;
  name: string;
  short: string;
  category: string;
  description: string;
  questions: Question[];
  source: string;
  interpretation: (n: number) => string;
};

const q = (
  id: string,
  label: string,
  points: number,
  help?: string
): Question => ({
  id,
  label,
  points,
  kind: "check",
  help,
});

const s = (
  id: string,
  label: string,
  options: Option[]
): Question => ({
  id,
  label,
  options,
  kind: "select",
});

const opt = (
  values: [string, number][]
): Option[] =>
  values.map(([label, value]) => ({
    label,
    value,
  }));

const SCORES: Score[] = [
  {
    id: "gcs",
    name: "Glasgow Coma Scale",
    short: "GCS",
    category: "Hồi sức & Nhiễm khuẩn",
    description: "Đánh giá mức độ ý thức ở người lớn.",
    source: "Phụ lục 8 - Mục 1",
    questions: [
      s("e", "Đáp ứng mở mắt (E)", opt([
        ["Mở mắt tự nhiên", 4],
        ["Mở mắt khi gọi", 3],
        ["Mở mắt khi kích thích đau", 2],
        ["Không mở mắt", 1],
      ])),
      s("v", "Đáp ứng lời nói (V)", opt([
        ["Trả lời định hướng đúng", 5],
        ["Trả lời lộn xộn", 4],
        ["Từ ngữ không phù hợp", 3],
        ["Âm thanh khó hiểu", 2],
        ["Không đáp ứng lời nói", 1],
      ])),
      s("m", "Đáp ứng vận động (M)", opt([
        ["Làm theo lệnh", 6],
        ["Định khu khi kích thích đau", 5],
        ["Rụt chi khi kích thích đau", 4],
        ["Co cứng mất vỏ", 3],
        ["Duỗi cứng mất não", 2],
        ["Không đáp ứng vận động", 1],
      ])),
    ],
    interpretation: (n) =>
      n <= 8
        ? "Điểm ý thức thấp, cần đánh giá và xử trí cấp cứu theo bệnh cảnh."
        : n <= 12
        ? "Mức suy giảm ý thức trung gian; cần theo dõi và đánh giá nguyên nhân."
        : "Mức suy giảm ý thức nhẹ hơn theo phân tầng thường dùng; vẫn cần đánh giá lâm sàng.",
  },
  {
    id: "kps",
    name: "Karnofsky Performance Scale",
    short: "KPS",
    category: "Chức năng toàn thân",
    description: "Đánh giá khả năng hoạt động và tự chăm sóc.",
    source: "Phụ lục 8 - Mục 2",
    questions: [
      s("k", "Chọn mức chức năng", opt([
        ["100 - Hoạt động bình thường, không có bằng chứng bệnh", 100],
        ["90 - Hoạt động thông thường, có triệu chứng nhẹ", 90],
        ["80 - Hoạt động bình thường nhưng phải gắng sức", 80],
        ["70 - Tự chăm sóc, không thể làm công việc bình thường", 70],
        ["60 - Cần hỗ trợ, vẫn tự đáp ứng phần lớn nhu cầu", 60],
        ["50 - Cần chăm sóc và hỗ trợ y tế thường xuyên", 50],
        ["40 - Mất khả năng làm việc, cần chăm sóc đặc biệt", 40],
        ["30 - Bệnh nặng, cần nằm viện", 30],
        ["20 - Bệnh rất nặng, cần điều trị hỗ trợ", 20],
        ["10 - Hấp hối", 10],
        ["0 - Tử vong", 0],
      ])),
    ],
    interpretation: (n) =>
      n >= 80
        ? "Chức năng hoạt động tương đối tốt."
        : n >= 50
        ? "Có hạn chế chức năng, cần hỗ trợ ở các mức độ khác nhau."
        : "Suy giảm chức năng nghiêm trọng, cần chăm sóc đáng kể.",
  },
  {
    id: "qsofa",
    name: "Quick Sequential Organ Failure Assessment",
    short: "qSOFA",
    category: "Hồi sức & Nhiễm khuẩn",
    description: "Đánh giá nhanh các dấu hiệu liên quan tiên lượng xấu khi nghi nhiễm khuẩn.",
    source: "Phụ lục 8 - Mục 3",
    questions: [
      q("rr", "Tần số thở ≥ 22 lần/phút", 1),
      q("sbp", "Huyết áp tâm thu ≤ 100 mmHg", 1),
      q("mental", "Thay đổi ý thức / GCS < 15", 1),
    ],
    interpretation: (n) =>
      n >= 2
        ? "qSOFA ≥ 2: tăng nguy cơ diễn tiến bất lợi. Cần đánh giá ngay tình trạng nhiễm khuẩn và rối loạn chức năng cơ quan."
        : "qSOFA 0–1: không loại trừ nhiễm khuẩn huyết hoặc diễn tiến nặng.",
  },
  {
    id: "child",
    name: "Child–Pugh",
    short: "Child–Pugh",
    category: "Thận & Gan",
    description: "Đánh giá mức độ suy giảm chức năng gan trong bệnh gan mạn, đặc biệt xơ gan.",
    source: "Phụ lục 8 - Mục 5",
    questions: [
      s("bili", "Bilirubin toàn phần", opt([
        ["< 2 mg/dL", 1],
        ["2–3 mg/dL", 2],
        ["> 3 mg/dL", 3],
      ])),
      s("albumin", "Albumin huyết thanh", opt([
        ["> 35 g/L", 1],
        ["28–35 g/L", 2],
        ["< 28 g/L", 3],
      ])),
      s("inr", "INR", opt([
        ["< 1,7", 1],
        ["1,7–2,3", 2],
        ["> 2,3", 3],
      ])),
      s("ascites", "Cổ trướng", opt([
        ["Không", 1],
        ["Nhẹ", 2],
        ["Nặng", 3],
      ])),
      s("enceph", "Bệnh não gan", opt([
        ["Không", 1],
        ["Độ I–II", 2],
        ["Độ III–IV", 3],
      ])),
    ],
    interpretation: (n) =>
      n <= 6
        ? "Child–Pugh A: 5–6 điểm."
        : n <= 9
        ? "Child–Pugh B: 7–9 điểm."
        : "Child–Pugh C: 10–15 điểm.",
  },
  {
    id: "chads",
    name: "CHA₂DS₂-VA",
    short: "CHA₂DS₂-VA",
    category: "Tim mạch & Huyết khối",
    description: "Đánh giá nguy cơ thuyên tắc ở người bệnh rung nhĩ.",
    source: "Phụ lục 8 - Mục 6; tài liệu dẫn ESC 2024",
    questions: [
      q("hf", "Suy tim / rối loạn chức năng thất trái", 1),
      q("htn", "Tăng huyết áp", 1),
      s("age", "Nhóm tuổi", opt([
        ["< 65 tuổi", 0],
        ["65–74 tuổi", 1],
        ["≥ 75 tuổi", 2],
      ])),
      q("dm", "Đái tháo đường", 1),
      q("stroke", "Tiền sử đột quỵ / TIA / thuyên tắc hệ thống", 2),
      q("vascular", "Bệnh mạch máu", 1),
    ],
    interpretation: (n) =>
      n === 0
        ? "0 điểm: thường không chỉ định chống đông chỉ dựa trên thang điểm này."
        : n === 1
        ? "1 điểm: cân nhắc chống đông theo ESC 2024."
        : "≥ 2 điểm: chống đông được khuyến cáo theo ESC 2024 nếu không có chống chỉ định; đánh giá đầy đủ bối cảnh.",
  },
  {
    id: "hasbled",
    name: "HAS-BLED",
    short: "HAS-BLED",
    category: "Tim mạch & Huyết khối",
    description: "Đánh giá các yếu tố nguy cơ xuất huyết khi điều trị chống đông.",
    source: "Phụ lục 8 - Mục 7",
    questions: [
      q("h", "Huyết áp tâm thu > 160 mmHg", 1),
      q("renal", "Chức năng thận bất thường", 1),
      q("liver", "Chức năng gan bất thường", 1),
      q("stroke", "Tiền sử đột quỵ", 1),
      q("bleed", "Tiền sử / khuynh hướng chảy máu", 1),
      q("inr", "INR không ổn định khi dùng VKA", 1),
      q("elderly", "Tuổi > 65", 1),
      q("drugs", "Thuốc làm tăng nguy cơ chảy máu", 1),
      q("alcohol", "Sử dụng rượu mức nguy cơ theo tiêu chí HAS-BLED", 1),
    ],
    interpretation: (n) =>
      n >= 3
        ? "HAS-BLED ≥ 3: nguy cơ xuất huyết cao hơn; cần rà soát các yếu tố có thể điều chỉnh và theo dõi sát."
        : "HAS-BLED 0–2: nguy cơ tương đối thấp hơn; không loại trừ xuất huyết.",
  },
  {
    id: "padua",
    name: "Padua Prediction Score",
    short: "Padua",
    category: "Tim mạch & Huyết khối",
    description: "Phân tầng nguy cơ thuyên tắc huyết khối tĩnh mạch ở người bệnh nội khoa nhập viện.",
    source: "Phụ lục 8 - Mục 8",
    questions: [
      q("cancer", "Ung thư tiến triển", 3),
      q("history", "Tiền sử VTE (không gồm huyết khối tĩnh mạch nông)", 3),
      q("immobile", "Bất động theo tiêu chí Padua", 3),
      q("thrombophilia", "Tình trạng tăng đông đã biết", 3),
      q("trauma", "Chấn thương / phẫu thuật trong ≤ 1 tháng", 2),
      q("age", "Tuổi ≥ 70", 1),
      q("cardioresp", "Suy tim và/hoặc suy hô hấp", 1),
      q("mi", "Nhồi máu cơ tim cấp / nhồi máu não cấp", 1),
      q("infection", "Nhiễm khuẩn cấp / bệnh thấp khớp", 1),
      q("obesity", "BMI ≥ 30", 1),
      q("hormone", "Điều trị hormone", 1),
    ],
    interpretation: (n) =>
      n >= 4
        ? "Padua ≥ 4: nguy cơ VTE cao; cần đánh giá chỉ định dự phòng đồng thời với nguy cơ chảy máu và chống chỉ định."
        : "Padua < 4: nguy cơ VTE thấp hơn; tiếp tục đánh giá theo bệnh cảnh.",
  },
  {
    id: "drip",
    name: "Drug Resistance in Pneumonia",
    short: "DRIP",
    category: "Hồi sức & Nhiễm khuẩn",
    description: "Ước tính nguy cơ tác nhân kháng thuốc trong viêm phổi.",
    source: "Phụ lục 8 - Mục 9",
    questions: [
      q("abx", "Đã dùng kháng sinh trong 60 ngày trước", 2),
      q("care", "Chăm sóc dài ngày tại nhà", 2),
      q("feeding", "Nuôi dưỡng qua ống thông", 2),
      q("prior", "Viêm phổi do vi khuẩn kháng thuốc trong 1 năm", 2),
      q("admit", "Nhập viện trong vòng 60 ngày", 1),
      q("lung", "Bệnh phổi mạn tính", 1),
      q("kps", "Karnofsky < 70", 1),
      q("ppi", "Kháng H2 hoặc PPI trong 14 ngày", 1),
      q("wound", "Có vết thương cần chăm sóc lúc nhập viện", 1),
      q("mrsa", "Phân lập MRSA trong 1 năm", 1),
    ],
    interpretation: (n) =>
      n >= 4
        ? "DRIP ≥ 4: tăng khả năng gặp tác nhân kháng thuốc. Không tự động chỉ định kháng sinh phổ rộng; cần đối chiếu hướng dẫn CAP và dữ liệu vi sinh địa phương."
        : "DRIP < 4: nguy cơ theo thang điểm thấp hơn, nhưng không loại trừ vi khuẩn kháng thuốc.",
  },
  {
    id: "ramsay",
    name: "Ramsay Sedation Scale",
    short: "Ramsay",
    category: "Hồi sức & Nhiễm khuẩn",
    description: "Đánh giá mức độ an thần ở người bệnh.",
    source: "Phụ lục 8 - Mục 10",
    questions: [
      s("r", "Mức độ đáp ứng", opt([
        ["1 - Lo lắng, kích động, bồn chồn", 1],
        ["2 - Hợp tác, định hướng tốt và yên tĩnh", 2],
        ["3 - Chỉ đáp ứng với mệnh lệnh", 3],
        ["4 - Đáp ứng nhanh với kích thích", 4],
        ["5 - Đáp ứng chậm với kích thích", 5],
        ["6 - Không đáp ứng với kích thích nêu trên", 6],
      ])),
    ],
    interpretation: (n) =>
      `Ramsay ${n}/6. Mức điểm cao hơn tương ứng tình trạng an thần sâu hơn.`,
  },
  {
    id: "rass",
    name: "Richmond Agitation–Sedation Scale",
    short: "RASS",
    category: "Hồi sức & Nhiễm khuẩn",
    description: "Đánh giá kích động và mức độ an thần tại ICU.",
    source: "Phụ lục 8 - Mục 11",
    questions: [
      s("r", "Chọn mức RASS", opt([
        ["+4 - Hung hăng, gây nguy hiểm trực tiếp", 4],
        ["+3 - Rất kích động, kéo ống thông / gây hấn", 3],
        ["+2 - Kích động, chống máy thở", 2],
        ["+1 - Bồn chồn", 1],
        ["0 - Tỉnh táo, bình tĩnh", 0],
        ["-1 - Buồn ngủ, giao tiếp mắt > 10 giây", -1],
        ["-2 - An thần nhẹ, giao tiếp mắt < 10 giây", -2],
        ["-3 - An thần vừa, mở mắt không giao tiếp mắt", -3],
        ["-4 - An thần sâu, đáp ứng với kích thích thể chất", -4],
        ["-5 - Không thể đánh thức", -5],
      ])),
    ],
    interpretation: (n) =>
      n > 0
        ? `RASS +${n}: có biểu hiện kích động.`
        : n === 0
        ? "RASS 0: tỉnh táo, bình tĩnh."
        : `RASS ${n}: mức an thần; cần đối chiếu mục tiêu an thần cá thể.`,
  },
  {
    id: "candida",
    name: "Candida Score",
    short: "Candida",
    category: "Hồi sức & Nhiễm khuẩn",
    description: "Ước tính nguy cơ Candida xâm lấn ở người bệnh ICU không giảm bạch cầu trung tính.",
    source: "Phụ lục 8 - Mục 12",
    questions: [
      q("surgery", "Phẫu thuật", 1),
      q("tpn", "Dinh dưỡng hoàn toàn đường tĩnh mạch", 1),
      q("colon", "Candida ở ≥ 2 vị trí", 1),
      q("sepsis", "Nhiễm khuẩn huyết nặng", 2),
    ],
    interpretation: (n) =>
      n >= 3
        ? "Candida Score ≥ 3: tăng nguy cơ Candida xâm lấn trong quần thể áp dụng. Không dùng điểm đơn độc để chỉ định thuốc kháng nấm."
        : "Candida Score < 3: nguy cơ thấp hơn trong quần thể nghiên cứu, không loại trừ bệnh.",
  },
];

const EXTRA = [
  {
    id: "kdigo",
    short: "KDIGO AKI",
    name: "Phân giai đoạn AKI theo KDIGO",
    category: "Thận & Gan",
    description: "Giai đoạn tổn thương thận cấp dựa trên creatinin, lượng nước tiểu và điều trị thay thế thận.",
  },
  {
    id: "rifle",
    short: "RIFLE",
    name: "Phân loại AKI theo RIFLE",
    category: "Thận & Gan",
    description: "Risk, Injury, Failure, Loss và End-stage kidney disease.",
  },
];

const GROUPS = [
  "Tất cả",
  "Hồi sức & Nhiễm khuẩn",
  "Thận & Gan",
  "Tim mạch & Huyết khối",
  "Chức năng toàn thân",
];

function cls(n: number, score: string) {
  if (score === "child") {
    return n <= 6 ? "A" : n <= 9 ? "B" : "C";
  }
  return "";
}

/*
  KDIGO:
  - Tỷ số SCr so với nền.
  - Tăng tuyệt đối 0,3 mg/dL trong 48 giờ
    chỉ khi xác nhận mốc thời gian.
  - Nước tiểu phải có tốc độ và thời gian.
  - RRT là giai đoạn 3.
  - Trẻ <18 tuổi có ngưỡng eGFR riêng.

  Với creatinin tăng 1,5 lần, cần xác nhận
  thay đổi trong vòng 7 ngày theo KDIGO.
  Phiên bản này yêu cầu xác nhận phù hợp
  thời gian thay đổi trước khi kết luận.
*/

function getKdigo(
  baseline: number,
  current: number,
  timing48: boolean,
  timing7d: boolean,
  urine: number | null,
  hours: number,
  anuria: boolean,
  rrt: boolean,
  pediatricEGFR: boolean
) {
  let stage = 0;
  const reasons: string[] = [];

  if (rrt) {
    stage = 3;
    reasons.push("Bắt đầu điều trị thay thế thận");
  }

  if (pediatricEGFR) {
    stage = 3;
    reasons.push("Tiêu chí eGFR trẻ em");
  }

  if (baseline > 0 && current > 0) {
    const ratio = current / baseline;
    const delta = current - baseline;

    if (ratio >= 3 || current >= 4) {
      if (timing7d || timing48) {
        stage = Math.max(stage, 3);
        reasons.push("Tiêu chí creatinin giai đoạn 3");
      }
    } else if (ratio >= 2 && timing7d) {
      stage = Math.max(stage, 2);
      reasons.push("SCr tăng 2–2,9 lần");
    } else if (
      (ratio >= 1.5 && timing7d) ||
      (delta >= 0.3 && timing48)
    ) {
      stage = Math.max(stage, 1);
      reasons.push("Tiêu chí creatinin giai đoạn 1");
    }
  }

  if (anuria && hours >= 12) {
    stage = 3;
    reasons.push("Vô niệu ≥ 12 giờ");
  } else if (urine !== null) {
    if (urine < 0.3 && hours >= 24) {
      stage = 3;
      reasons.push("Nước tiểu <0,3 mL/kg/giờ ≥24 giờ");
    } else if (urine < 0.5 && hours >= 12) {
      stage = Math.max(stage, 2);
      reasons.push("Nước tiểu <0,5 mL/kg/giờ ≥12 giờ");
    } else if (urine < 0.5 && hours >= 6) {
      stage = Math.max(stage, 1);
      reasons.push("Nước tiểu <0,5 mL/kg/giờ ≥6 giờ");
    }
  }

  return { stage, reasons };
}

function getRifle(
  baseline: number,
  current: number,
  urine: number | null,
  hours: number,
  anuria: boolean,
  gfrDecline: number | null,
  lossWeeks: number
) {
  let stage = 0;
  const reasons: string[] = [];

  if (baseline > 0 && current > 0) {
    const ratio = current / baseline;
    if (
      ratio >= 3 ||
      (current >= 4 && current - baseline >= 0.5)
    ) {
      stage = Math.max(stage, 3);
      reasons.push("Creatinin đạt tiêu chí Failure");
    } else if (ratio >= 2) {
      stage = Math.max(stage, 2);
      reasons.push("Creatinin đạt tiêu chí Injury");
    } else if (ratio >= 1.5) {
      stage = Math.max(stage, 1);
      reasons.push("Creatinin đạt tiêu chí Risk");
    }
  }

  if (gfrDecline !== null) {
    if (gfrDecline >= 75) {
      stage = Math.max(stage, 3);
      reasons.push("GFR giảm ≥75%");
    } else if (gfrDecline >= 50) {
      stage = Math.max(stage, 2);
      reasons.push("GFR giảm ≥50%");
    } else if (gfrDecline >= 25) {
      stage = Math.max(stage, 1);
      reasons.push("GFR giảm ≥25%");
    }
  }

  if (anuria && hours >= 12) {
    stage = 3;
    reasons.push("Vô niệu ≥12 giờ");
  } else if (urine !== null) {
    if (urine < 0.3 && hours >= 24) {
      stage = 3;
      reasons.push("Nước tiểu đạt Failure");
    } else if (urine < 0.5 && hours >= 12) {
      stage = Math.max(stage, 2);
      reasons.push("Nước tiểu đạt Injury");
    } else if (urine < 0.5 && hours >= 6) {
      stage = Math.max(stage, 1);
      reasons.push("Nước tiểu đạt Risk");
    }
  }

  const name = ["Chưa đủ tiêu chí R/I/F", "Risk", "Injury", "Failure"][stage];

  const outcome =
    lossWeeks > 12
      ? "End-stage kidney disease (E)"
      : lossWeeks > 4
      ? "Loss (L)"
      : "";

  return { stage, name, reasons, outcome };
}

export default function ClinicalScoresPage() {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("Tất cả");
  const [active, setActive] = useState("gcs");

  const [answers, setAnswers] =
    useState<Record<string, number | boolean>>({});

  const [baselineText, setBaselineText] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [urineText, setUrineText] = useState("");
  const [hoursText, setHoursText] = useState("");
  const [gfrText, setGfrText] = useState("");
  const [lossText, setLossText] = useState("");
  const [time48, setTime48] = useState(false);
  const [time7d, setTime7d] = useState(false);
  const [anuria, setAnuria] = useState(false);
  const [rrt, setRrt] = useState(false);
  const [pediatric, setPediatric] = useState(false);

  const allItems = useMemo(
    () => [
      ...SCORES.map((x) => ({
        id: x.id,
        name: x.name,
        short: x.short,
        category: x.category,
        description: x.description,
      })),
      ...EXTRA,
    ],
    []
  );

  const visible = useMemo(
    () =>
      allItems.filter(
        (x) =>
          (group === "Tất cả" || x.category === group) &&
          (x.name + x.short + x.description + x.category)
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
      ),
    [allItems, group, search]
  );

  const score = SCORES.find((x) => x.id === active);

  const complete =
    score?.questions.every(
      (question) =>
        question.kind === "check" ||
        answers[question.id] !== undefined
    ) ?? false;

  const total =
    score?.questions.reduce((sum, question) => {
      const value = answers[question.id];
      if (question.kind === "check") {
        return sum + (value === true ? question.points ?? 0 : 0);
      }
      return sum + (typeof value === "number" ? value : 0);
    }, 0) ?? 0;

  const parse = (text: string): number | null => {
    if (!text.trim()) return null;
    const n = Number(text.replace(",", "."));
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  const base = parse(baselineText);
  const current = parse(currentText);
  const urine = parse(urineText);
  const hours = parse(hoursText) ?? 0;
  const gfr = parse(gfrText);
  const lossWeeks = parse(lossText) ?? 0;

  const renalReady =
    (base !== null && base > 0 && current !== null) ||
    (urine !== null && hours > 0) ||
    (anuria && hours > 0) ||
    (active === "kdigo" && (rrt || pediatric)) ||
    (active === "rifle" && (gfr !== null || lossWeeks > 0));

  const kdigo = getKdigo(
    base ?? 0,
    current ?? 0,
    time48,
    time7d,
    urine,
    hours,
    anuria,
    rrt,
    pediatric
  );

  const rifle = getRifle(
    base ?? 0,
    current ?? 0,
    urine,
    hours,
    anuria,
    gfr,
    lossWeeks
  );

  function reset() {
    setAnswers({});
    setBaselineText("");
    setCurrentText("");
    setUrineText("");
    setHoursText("");
    setGfrText("");
    setLossText("");
    setTime48(false);
    setTime7d(false);
    setAnuria(false);
    setRrt(false);
    setPediatric(false);
  }

  function selectScore(id: string) {
    setActive(id);
    reset();
  }

  function setText(
    setter: (value: string) => void,
    value: string
  ) {
    setter(value);
  }

  return (
    <main className="cs-page">
      <div className="cs-wrap">
        <nav className="cs-breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span>›</span>
          <Link href="/calculators">Công cụ lâm sàng</Link>
          <span>›</span>
          <strong>Thang điểm lâm sàng</strong>
        </nav>

        <header className="cs-heading">
          <div>
            <span className="cs-eyebrow">
              BV199 · Clinical Decision Support
            </span>
            <h1>Thang điểm lâm sàng</h1>
            <p>
              Bộ công cụ đánh giá nhanh theo Phần 6 – Phụ lục 8.
              Gồm 13 công cụ tính từ 12 mục trong tài liệu.
            </p>
          </div>
        </header>

        <div className="cs-layout">
          <aside className="cs-sidebar">
            <div className="cs-sidebar-title">
              <strong>Danh mục thang điểm</strong>
              <span>{visible.length}/{allItems.length}</span>
            </div>

            <div className="cs-filters">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm thang điểm..."
                aria-label="Tìm thang điểm"
              />

              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                {GROUPS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="cs-list">
              {visible.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    "cs-nav-item " +
                    (active === item.id ? "active" : "")
                  }
                  onClick={() => selectScore(item.id)}
                >
                  <span className="cs-nav-name">
                    <strong>{item.short}</strong>
                    <small>{item.name}</small>
                  </span>
                  <span>›</span>
                </button>
              ))}

              {!visible.length && (
                <p className="cs-muted">
                  Không tìm thấy thang điểm.
                </p>
              )}
            </div>
          </aside>

          <section className="cs-content">
            {score && (
              <>
                <div className="cs-card-head">
                  <span className="cs-category">
                    {score.category}
                  </span>
                  <h2>{score.short}</h2>
                  <h3>{score.name}</h3>
                  <p>{score.description}</p>
                </div>

                <div className="cs-section-label">
                  <strong>Thông tin đánh giá</strong>
                  <button type="button" onClick={reset}>
                    Xóa dữ liệu
                  </button>
                </div>

                <div className="cs-questions">
                  {score.questions.map((question) => {
                    if (question.kind === "check") {
                      return (
                        <label
                          key={question.id}
                          className="cs-check-row"
                        >
                          <input
                            type="checkbox"
                            checked={answers[question.id] === true}
                            onChange={(e) =>
                              setAnswers((a) => ({
                                ...a,
                                [question.id]: e.target.checked,
                              }))
                            }
                          />
                          <span>{question.label}</span>
                          <b>+{question.points}</b>
                        </label>
                      );
                    }

                    return (
                      <label
                        key={question.id}
                        className="cs-select-field"
                      >
                        <span>{question.label}</span>
                        <select
                          value={
                            answers[question.id] === undefined
                              ? ""
                              : String(answers[question.id])
                          }
                          onChange={(e) =>
                            setAnswers((a) => ({
                              ...a,
                              [question.id]: Number(e.target.value),
                            }))
                          }
                        >
                          <option value="" disabled>
                            Chọn đánh giá
                          </option>
                          {question.options?.map((o, i) => (
                            <option
                              key={`${question.id}-${i}`}
                              value={o.value}
                            >
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    );
                  })}
                </div>

                <div className="cs-result">
                  <div className="cs-result-title">
                    Kết quả đánh giá
                  </div>

                  {complete ? (
                    <>
                      <div className="cs-result-number">
                        {score.id === "rass" && total > 0
                          ? `+${total}`
                          : total}
                        {score.id === "child" && (
                          <span> · Loại {cls(total, "child")}</span>
                        )}
                      </div>
                      <p>{score.interpretation(total)}</p>

                      {score.id === "gcs" && (
                        <p className="cs-breakdown">
                          E{answers.e} · V{answers.v} · M{answers.m}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="cs-muted">
                      Chọn đầy đủ các tiêu chí để xem kết quả.
                      Với câu hỏi dạng chọn có/không,
                      ô không tích được tính là 0 điểm.
                    </p>
                  )}
                </div>

                <p className="cs-source">
                  Nguồn: {score.source}.
                  Nội dung chưa thay thế quy trình đánh giá của bệnh viện.
                </p>
              </>
            )}

            {(active === "kdigo" || active === "rifle") && (
              <>
                <div className="cs-card-head">
                  <span className="cs-category">Thận & Gan</span>
                  <h2>{active === "kdigo" ? "KDIGO AKI" : "RIFLE"}</h2>
                  <p>
                    {active === "kdigo"
                      ? "Phân giai đoạn tổn thương thận cấp theo creatinin và lượng nước tiểu."
                      : "Phân loại tổn thương thận cấp và thời gian mất chức năng thận."}
                  </p>
                </div>

                <div className="cs-warning">
                  Nhập số liệu đã được xác minh.
                  Đặc biệt cần chú ý thời gian thay đổi creatinin
                  và thời gian theo dõi nước tiểu.
                </div>

                <div className="cs-numeric-grid">
                  <label>
                    Creatinin nền (mg/dL)
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={baselineText}
                      onChange={(e) =>
                        setText(setBaselineText, e.target.value)
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
                      onChange={(e) =>
                        setText(setCurrentText, e.target.value)
                      }
                      placeholder="Ví dụ: 1.8"
                    />
                  </label>

                  <label>
                    Nước tiểu (mL/kg/giờ)
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={urineText}
                      onChange={(e) =>
                        setText(setUrineText, e.target.value)
                      }
                      placeholder="Ví dụ: 0.4"
                    />
                  </label>

                  <label>
                    Thời gian quan sát nước tiểu (giờ)
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={hoursText}
                      onChange={(e) =>
                        setText(setHoursText, e.target.value)
                      }
                      placeholder="Ví dụ: 12"
                    />
                  </label>
                </div>

                {active === "kdigo" ? (
                  <div className="cs-checks">
                    <label>
                      <input
                        type="checkbox"
                        checked={time48}
                        onChange={(e) => setTime48(e.target.checked)}
                      />
                      Đã xác minh thay đổi SCr trong vòng 48 giờ
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={time7d}
                        onChange={(e) => setTime7d(e.target.checked)}
                      />
                      Đã xác minh tăng SCr trong vòng 7 ngày
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={rrt}
                        onChange={(e) => setRrt(e.target.checked)}
                      />
                      Đã bắt đầu điều trị thay thế thận (RRT)
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={pediatric}
                        onChange={(e) => setPediatric(e.target.checked)}
                      />
                      Người bệnh dưới 18 tuổi, eGFR &lt;35 mL/phút/1,73 m²
                    </label>
                  </div>
                ) : (
                  <div className="cs-numeric-grid">
                    <label>
                      GFR giảm so với nền (%), nếu có
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gfrText}
                        onChange={(e) => setGfrText(e.target.value)}
                        placeholder="Ví dụ: 50"
                      />
                    </label>

                    <label>
                      Mất hoàn toàn chức năng thận (tuần)
                      <input
                        type="number"
                        min="0"
                        value={lossText}
                        onChange={(e) => setLossText(e.target.value)}
                        placeholder="Nếu có"
                      />
                    </label>
                  </div>
                )}

                <div className="cs-checks">
                  <label>
                    <input
                      type="checkbox"
                      checked={anuria}
                      onChange={(e) => setAnuria(e.target.checked)}
                    />
                    Vô niệu trong thời gian đã nhập ở trên
                  </label>
                </div>

                <div className="cs-result">
                  <strong>Kết quả</strong>

                  {!renalReady ? (
                    <p>
                      Chưa đủ số liệu để phân loại.
                    </p>
                  ) : active === "kdigo" ? (
                    <>
                      <div className="cs-result-number">
                        {kdigo.stage > 0
                          ? `Giai đoạn ${kdigo.stage}`
                          : "Chưa xác định AKI"}
                      </div>
                      {kdigo.reasons.map((r, i) => (
                        <p key={i}>{r}</p>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="cs-result-number">
                        {rifle.name}
                      </div>
                      {rifle.outcome && (
                        <p>{rifle.outcome}</p>
                      )}
                      {rifle.reasons.map((r, i) => (
                        <p key={i}>{r}</p>
                      ))}
                    </>
                  )}

                  <p className="cs-muted">
                    Kết quả chỉ dựa trên dữ liệu đã nhập;
                    không loại trừ AKI nếu thiếu số liệu
                    hoặc không đáp ứng mốc thời gian.
                  </p>
                </div>

                <button
                  type="button"
                  className="cs-reset"
                  onClick={reset}
                >
                  Xóa và nhập lại
                </button>

                <p className="cs-source">
                  Nguồn: Phụ lục 8 - Mục 4,
                  RIFLE và KDIGO 2012.
                </p>
              </>
            )}

            <div className="cs-safety">
              <strong>Lưu ý lâm sàng</strong>
              <p>
                Các điểm số là công cụ hỗ trợ đánh giá,
                không phải kết luận chẩn đoán hoặc chỉ định thuốc.
                Cần đối chiếu đúng quần thể áp dụng,
                tiêu chí gốc, dữ liệu lâm sàng và
                hướng dẫn đang áp dụng tại Bệnh viện 199.
              </p>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .cs-page {
          min-height: 100vh;
          background: #f6f9fc;
          padding: 20px 24px 35px;
          color: #142d45;
          font: 13px Arial, sans-serif;
        }

        .cs-wrap {
          max-width: 1420px;
          margin: auto;
        }

        .cs-breadcrumb {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 17px;
          color: #75869a;
        }

        .cs-breadcrumb a {
          color: #075985;
          text-decoration: none;
        }

        .cs-heading {
          margin-bottom: 20px;
        }

        .cs-eyebrow {
          font-size: 11px;
          color: #067786;
          letter-spacing: 1px;
          font-weight: bold;
        }

        .cs-heading h1 {
          font-size: 27px;
          margin: 8px 0;
          color: #092a45;
        }

        .cs-heading p {
          color: #73869b;
          margin: 0;
          line-height: 1.6;
        }

        .cs-layout {
          display: grid;
          grid-template-columns: 320px minmax(0,1fr);
          gap: 16px;
          align-items: start;
        }

        .cs-sidebar,
        .cs-content {
          background: #fff;
          border: 1px solid #dce6ef;
          border-radius: 13px;
          overflow: hidden;
        }

        .cs-sidebar {
          position: sticky;
          top: 12px;
        }

        .cs-sidebar-title {
          display: flex;
          justify-content: space-between;
          padding: 17px 15px 11px;
          align-items: center;
        }

        .cs-sidebar-title strong {
          font-size: 14px;
        }

        .cs-sidebar-title span {
          color: #7c90a2;
          font-size: 11px;
        }

        .cs-filters {
          display: grid;
          gap: 9px;
          padding: 0 13px 13px;
          border-bottom: 1px solid #e8edf3;
        }

        .cs-filters input,
        .cs-filters select {
          width: 100%;
          box-sizing: border-box;
          height: 41px;
          padding: 0 12px;
          border: 1px solid #cbdbe8;
          border-radius: 9px;
          background: white;
          color: #173750;
          outline: none;
        }

        .cs-list {
          max-height: 67vh;
          overflow-y: auto;
          padding: 7px;
        }

        .cs-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: white;
          border: 0;
          border-left: 3px solid transparent;
          border-radius: 6px;
          text-align: left;
          color: #25425c;
          cursor: pointer;
          gap: 9px;
        }

        .cs-nav-item:hover {
          background: #f2f8fd;
        }

        .cs-nav-item.active {
          background: #eaf5ff;
          border-left-color: #0875ae;
          color: #075985;
        }

        .cs-nav-name {
          display: grid;
          gap: 4px;
          min-width: 0;
        }

        .cs-nav-name strong {
          font-size: 13px;
        }

        .cs-nav-name small {
          font-size: 11px;
          line-height: 1.4;
          color: #73889e;
        }

        .cs-content {
          padding: 24px;
          min-height: 590px;
        }

        .cs-card-head {
          padding-bottom: 17px;
          border-bottom: 1px solid #e7edf3;
          margin-bottom: 19px;
        }

        .cs-category {
          display: inline-block;
          background: #eaf6ff;
          color: #075985;
          font-weight: bold;
          padding: 6px 10px;
          font-size: 11px;
          border-radius: 8px;
        }

        .cs-card-head h2 {
          margin: 12px 0 5px;
          font-size: 27px;
          color: #102e48;
        }

        .cs-card-head h3 {
          margin: 0 0 9px;
          font-size: 15px;
          font-weight: 500;
          color: #547188;
        }

        .cs-card-head p {
          margin: 0;
          color: #6b829a;
          line-height: 1.7;
        }

        .cs-section-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
          gap: 9px;
        }

        .cs-section-label button,
        .cs-reset {
          border: 1px solid #d0dfeb;
          color: #075985;
          background: white;
          border-radius: 8px;
          padding: 10px 12px;
          cursor: pointer;
        }

        .cs-questions {
          display: grid;
          gap: 10px;
        }

        .cs-check-row {
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid #e1e9f0;
          padding: 13px 14px;
          border-radius: 9px;
          cursor: pointer;
        }

        .cs-check-row input,
        .cs-checks input {
          accent-color: #0876ad;
          width: 16px;
          height: 16px;
        }

        .cs-check-row span {
          flex: 1;
          line-height: 1.6;
        }

        .cs-check-row b {
          color: #0d6590;
        }

        .cs-select-field {
          display: grid;
          gap: 8px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .cs-select-field select,
        .cs-numeric-grid input {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          border: 1px solid #cedeea;
          border-radius: 9px;
          background: white;
          color: #15334d;
          padding: 12px 13px;
          font-size: 13px;
        }

        .cs-result {
          margin-top: 22px;
          border: 1px solid #cfe2f0;
          background: #f5faff;
          border-radius: 11px;
          padding: 19px;
          line-height: 1.75;
        }

        .cs-result-title {
          font-weight: bold;
          font-size: 13px;
          color: #075985;
        }

        .cs-result-number {
          font-size: 25px;
          font-weight: 750;
          margin-top: 8px;
          color: #063f66;
        }

        .cs-result-number span {
          font-size: 17px;
        }

        .cs-result p {
          margin: 8px 0;
        }

        .cs-muted {
          color: #7b8da1;
          font-size: 12px;
          line-height: 1.7;
        }

        .cs-breakdown {
          font-weight: bold;
        }

        .cs-source {
          margin: 17px 0;
          color: #778a9e;
          font-size: 11px;
          line-height: 1.6;
        }

        .cs-safety {
          padding: 14px;
          border: 1px solid #e4eaf0;
          border-radius: 9px;
          color: #667d91;
          background: #fbfcfe;
          margin-top: 20px;
          line-height: 1.7;
        }

        .cs-safety strong {
          color: #31516b;
        }

        .cs-safety p {
          margin: 6px 0 0;
        }

        .cs-warning {
          border: 1px solid #ecd9b9;
          border-radius: 9px;
          padding: 13px;
          background: #fff9ee;
          color: #805a2d;
          line-height: 1.7;
          margin-bottom: 17px;
        }

        .cs-numeric-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 18px 0;
        }

        .cs-numeric-grid label {
          display: grid;
          gap: 8px;
          font-weight: 600;
          line-height: 1.4;
        }

        .cs-checks {
          display: grid;
          gap: 13px;
          margin: 16px 0;
        }

        .cs-checks label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.65;
          cursor: pointer;
        }

        @media (max-width: 950px) {
          .cs-layout {
            grid-template-columns: 260px minmax(0,1fr);
          }
        }

        @media (max-width: 720px) {
          .cs-page {
            padding: 12px;
          }

          .cs-layout {
            grid-template-columns: 1fr;
          }

          .cs-sidebar {
            position: static;
          }

          .cs-list {
            max-height: 250px;
          }

          .cs-content {
            padding: 16px;
          }

          .cs-numeric-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
