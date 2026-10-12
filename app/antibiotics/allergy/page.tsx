
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  Info,
  Maximize2,
  Pill,
  RotateCcw,
  Search,
  ShieldAlert,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

/*
==========================================================
BV199 CLINICAL PHARMACY
MODULE: DỊ ỨNG & DỊ ỨNG CHÉO KHÁNG SINH

Tài liệu:
1. Thông tư 51/2017/TT-BYT
2. AAAAI/ACAAI - Drug Allergy 2022
3. Doña et al. Beta-lactam Allergy 2024 Update
   Allergy. 2025;80:633-637.
4. Ảnh bảng dị ứng chéo do người dùng cung cấp

Phiên bản hỗ trợ tra cứu.
Chưa phải phác đồ đã được BV199 phê duyệt.

Quy tắc an toàn:
- Không tự cấp phép sử dụng kháng sinh.
- Không kết luận "không dị ứng" từ bảng cấu trúc.
- Không tự động chỉ định test, challenge, giải mẫn cảm.
- Không tự động loại bỏ nhãn dị ứng.
==========================================================
*/

type Tab =
  | "history"
  | "cross"
  | "matrix"
  | "groups"
  | "emergency"
  | "sources";

type Reaction =
  | "unknown"
  | "intolerance"
  | "mild"
  | "immediate"
  | "anaphylaxis"
  | "scar"
  | "organ";

type Drug = {
  name: string;
  family: string;
  category: string;
};

type PairRule = {
  drugs: string[];
  relation: string;
  explanation: string;
  evidence: string;
  source: string;
};

const DRUGS: Drug[] = [
  // Penicillins
  { name: "Penicillin G", family: "Beta-lactam", category: "Penicillin" },
  { name: "Penicillin V", family: "Beta-lactam", category: "Penicillin" },
  { name: "Amoxicillin", family: "Beta-lactam", category: "Aminopenicillin" },
  { name: "Ampicillin", family: "Beta-lactam", category: "Aminopenicillin" },
  { name: "Oxacillin", family: "Beta-lactam", category: "Penicillin" },
  { name: "Cloxacillin", family: "Beta-lactam", category: "Penicillin" },
  { name: "Piperacillin", family: "Beta-lactam", category: "Penicillin" },
  { name: "Piperacillin/tazobactam", family: "Beta-lactam", category: "Penicillin + BLI" },
  { name: "Amoxicillin/clavulanate", family: "Beta-lactam", category: "Penicillin + BLI" },
  { name: "Ampicillin/sulbactam", family: "Beta-lactam", category: "Penicillin + BLI" },

  // Cephalosporins
  { name: "Cefadroxil", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cephalexin", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cefazolin", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cefaclor", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cefprozil", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cefuroxime", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cefoxitin", family: "Beta-lactam", category: "Cephamycin" },
  { name: "Cefotaxime", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Ceftriaxone", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Ceftazidime", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cefixime", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cefpodoxime", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cefoperazone", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Cefepime", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Ceftaroline", family: "Beta-lactam", category: "Cephalosporin" },
  { name: "Ceftolozane/tazobactam", family: "Beta-lactam", category: "Cephalosporin + BLI" },
  { name: "Ceftazidime/avibactam", family: "Beta-lactam", category: "Cephalosporin + BLI" },
  { name: "Cefiderocol", family: "Beta-lactam", category: "Cephalosporin" },

  // Carbapenems / Monobactam
  { name: "Imipenem/cilastatin", family: "Beta-lactam", category: "Carbapenem" },
  { name: "Meropenem", family: "Beta-lactam", category: "Carbapenem" },
  { name: "Ertapenem", family: "Beta-lactam", category: "Carbapenem" },
  { name: "Doripenem", family: "Beta-lactam", category: "Carbapenem" },
  { name: "Aztreonam", family: "Beta-lactam", category: "Monobactam" },

  // Other antimicrobials
  { name: "Ciprofloxacin", family: "Fluoroquinolone", category: "Fluoroquinolone" },
  { name: "Levofloxacin", family: "Fluoroquinolone", category: "Fluoroquinolone" },
  { name: "Moxifloxacin", family: "Fluoroquinolone", category: "Fluoroquinolone" },
  { name: "Azithromycin", family: "Macrolide", category: "Macrolide" },
  { name: "Clarithromycin", family: "Macrolide", category: "Macrolide" },
  { name: "Erythromycin", family: "Macrolide", category: "Macrolide" },
  { name: "Gentamicin", family: "Aminoglycoside", category: "Aminoglycoside" },
  { name: "Amikacin", family: "Aminoglycoside", category: "Aminoglycoside" },
  { name: "Tobramycin", family: "Aminoglycoside", category: "Aminoglycoside" },
  { name: "Streptomycin", family: "Aminoglycoside", category: "Aminoglycoside" },
  { name: "Trimethoprim/sulfamethoxazole", family: "Sulfonamide antibiotic", category: "Sulfonamide" },
  { name: "Vancomycin", family: "Glycopeptide", category: "Glycopeptide" },
  { name: "Teicoplanin", family: "Glycopeptide", category: "Glycopeptide" },
  { name: "Doxycycline", family: "Tetracycline", category: "Tetracycline" },
  { name: "Minocycline", family: "Tetracycline", category: "Tetracycline" },
  { name: "Clindamycin", family: "Lincosamide", category: "Lincosamide" },
  { name: "Linezolid", family: "Oxazolidinone", category: "Oxazolidinone" },
  { name: "Metronidazole", family: "Nitroimidazole", category: "Nitroimidazole" },
];

const REACTIONS: { value: Reaction; label: string }[] = [
  { value: "unknown", label: "Không rõ phản ứng" },
  { value: "intolerance", label: "Chỉ có tác dụng phụ không gợi ý dị ứng" },
  { value: "mild", label: "Ban nhẹ, không có dấu hiệu nguy hiểm" },
  { value: "immediate", label: "Mày đay, phù mạch hoặc triệu chứng tức thì" },
  { value: "anaphylaxis", label: "Phản vệ hoặc nghi ngờ phản vệ" },
  { value: "scar", label: "SJS/TEN, DRESS, AGEP hoặc SCAR" },
  { value: "organ", label: "Phản ứng nặng có tổn thương cơ quan" },
];

/*
Các cặp cấu trúc được chọn từ các mối liên hệ
có ý nghĩa lâm sàng. Đây KHÔNG phải bản số hóa
toàn bộ mọi ô của hình ma trận.

Không gán mức độ nguy cơ định lượng cho từng
cặp nếu chưa có dữ liệu được thẩm định.
*/

const PAIRS: PairRule[] = [
  {
    drugs: ["Amoxicillin", "Cefadroxil"],
    relation: "Tương đồng R1 đáng chú ý",
    explanation:
      "Amoxicillin và cefadroxil có mối liên hệ cấu trúc chuỗi bên R1 quan trọng trong đánh giá dị ứng chéo. Không xem cefadroxil là lựa chọn tự động an toàn khi nghi ngờ dị ứng amoxicillin.",
    evidence: "Cần đánh giá theo kiểu phản ứng và xác nhận dị ứng.",
    source: "EAACI 2024 update - Table 1",
  },
  {
    drugs: ["Ampicillin", "Cephalexin"],
    relation: "Tương đồng R1 đáng chú ý",
    explanation:
      "Ampicillin và cephalexin thuộc các cặp có tương đồng chuỗi bên liên quan khả năng dị ứng chéo.",
    evidence: "Không quyết định sử dụng chỉ từ việc cùng hoặc khác nhóm thuốc.",
    source: "EAACI 2024 update - Table 1",
  },
  {
    drugs: ["Ampicillin", "Cefaclor"],
    relation: "Tương đồng R1 đáng chú ý",
    explanation:
      "Có mối liên hệ cấu trúc chuỗi bên cần được xem xét khi người bệnh có tiền sử dị ứng ampicillin.",
    evidence: "Cần khai thác tiền sử và đánh giá chuyên khoa khi phù hợp.",
    source: "EAACI 2024 update - Table 1",
  },
  {
    drugs: ["Ceftazidime", "Aztreonam"],
    relation: "Chuỗi bên R1 giống nhau",
    explanation:
      "Ceftazidime và aztreonam có chuỗi bên R1 giống nhau. Đây là ngoại lệ quan trọng khi cân nhắc aztreonam ở người có tiền sử dị ứng cephalosporin.",
    evidence: "Không tự động coi aztreonam là lựa chọn không dị ứng chéo.",
    source: "AAAAI/ACAAI 2022 - CBS 18",
  },
  {
    drugs: ["Amoxicillin", "Cefazolin"],
    relation: "Chuỗi bên khác biệt",
    explanation:
      "Cefazolin có chuỗi bên đặc trưng, không chia sẻ R1 với amoxicillin. Hướng dẫn AAAAI/ACAAI cho phép cân nhắc cephalosporin không dị ứng chéo ở nhiều bệnh nhân có tiền sử dị ứng penicillin, theo kiểu phản ứng.",
    evidence: "Không áp dụng tự động cho SCAR hoặc tổn thương cơ quan.",
    source: "AAAAI/ACAAI 2022 - CBS 12, 13",
  },
  {
    drugs: ["Ampicillin", "Cefazolin"],
    relation: "Chuỗi bên khác biệt",
    explanation:
      "Cefazolin có cấu trúc chuỗi bên khác với ampicillin, có ý nghĩa khi lựa chọn kháng sinh dự phòng phẫu thuật.",
    evidence: "Cần đánh giá tiền sử, mức độ phản ứng và quy trình bệnh viện.",
    source: "AAAAI/ACAAI 2022 - CBS 12, 13",
  },
];

const TOPICS = [
  {
    name: "Penicillin",
    content:
      "Phân biệt nhãn dị ứng chưa xác minh với dị ứng đã được xác nhận. Khai thác thời gian, triệu chứng và phản ứng đã dung nạp sau đó. Ở bệnh nhân nguy cơ thấp có thể cân nhắc quy trình loại bỏ nhãn dị ứng phù hợp; không áp dụng thử thách thông thường cho SCAR.",
    source: "AAAAI/ACAAI 2022 - CBS 4–9",
  },
  {
    name: "Cephalosporin",
    content:
      "Nguy cơ dị ứng chéo liên quan đáng kể tới chuỗi bên R1. Phải phân biệt tiền sử phản vệ với phản ứng không phản vệ và phân biệt dị ứng đã xác minh với chưa xác minh.",
    source: "AAAAI/ACAAI 2022 - CBS 10–16",
  },
  {
    name: "Carbapenem",
    content:
      "Nguy cơ dị ứng chéo từ penicillin và cephalosporin thấp hơn quan điểm truyền thống. Khuyến cáo sử dụng carbapenem ở nhiều người có tiền sử dị ứng beta-lactam không đồng nghĩa áp dụng cho bệnh nhân SCAR hoặc tổn thương cơ quan nặng.",
    source: "AAAAI/ACAAI 2022 - CBS 17",
  },
  {
    name: "Monobactam",
    content:
      "Aztreonam thường có nguy cơ dị ứng chéo thấp với nhiều beta-lactam, nhưng cần lưu ý ngoại lệ ceftazidime do cùng chuỗi bên R1.",
    source: "AAAAI/ACAAI 2022 - CBS 18",
  },
  {
    name: "Sulfonamide",
    content:
      "Cần phân biệt dị ứng kháng sinh sulfonamide với phản ứng đối với thuốc sulfonamide không kháng sinh. Chiến lược đánh giá TMP-SMX phụ thuộc kiểu phản ứng, không chỉ dựa vào nhãn sulfa allergy.",
    source: "AAAAI/ACAAI 2022 - CBS 20",
  },
  {
    name: "Fluoroquinolone",
    content:
      "Có thể gặp phản ứng qua trung gian IgE hoặc hoạt hóa dưỡng bào không phụ thuộc IgE. Không mặc định bệnh nhân phản ứng với một fluoroquinolone sẽ phản ứng với tất cả hoạt chất còn lại.",
    source: "AAAAI/ACAAI 2022 - CBS 21",
  },
  {
    name: "Macrolide",
    content:
      "Dị ứng macrolide được xác nhận ít gặp hơn số trường hợp được ghi nhãn. Giá trị của test da còn hạn chế; đánh giá dựa trên tiền sử, kiểu phản ứng và chỉ định chuyên khoa.",
    source: "AAAAI/ACAAI 2022 - CBS 21",
  },
  {
    name: "Aminoglycoside",
    content:
      "Cần khai thác dạng phản ứng, đặc biệt phản ứng tiếp xúc và phản ứng muộn. Không sử dụng quy tắc R1/R2 của beta-lactam cho aminoglycoside. Bộ nguồn hiện tại chưa đủ để tự động kết luận tất cả các cặp thuốc trong nhóm này.",
    source: "Cần bổ sung và thẩm định nguồn chuyên biệt",
  },
  {
    name: "Glycopeptide",
    content:
      "Phân biệt phản ứng liên quan truyền vancomycin với phản vệ. Không mặc định đỏ bừng khi truyền vancomycin là dị ứng IgE, nhưng mọi biểu hiện hô hấp hoặc huyết động bất thường phải được đánh giá cấp cứu.",
    source: "AAAAI/ACAAI 2022 - Drug allergy phenotypes",
  },
  {
    name: "Các nhóm khác",
    content:
      "Đối với tetracycline, lincosamide, oxazolidinone, nitroimidazole và các kháng sinh khác, ghi nhận phản ứng theo từng hoạt chất. Không suy diễn khả năng dung nạp từ việc thiếu dữ liệu dị ứng chéo.",
    source: "Cần bổ sung tài liệu chuyên biệt cho từng nhóm",
  },
];

const SOURCES = [
  {
    title: "Thông tư 51/2017/TT-BYT",
    sub: "Hướng dẫn phòng, chẩn đoán và xử trí phản vệ",
    detail:
      "Điều 4; Phụ lục I, II, III, VI, VII, VIII, IX và X.",
    url: "https://vbpl.vn/",
  },
  {
    title: "Drug Allergy: A 2022 Practice Parameter Update",
    sub: "AAAAI/ACAAI - Khan và cộng sự",
    detail:
      "CBS 1–21; các phần beta-lactam, sulfonamide, fluoroquinolone, macrolide.",
    url: "https://doi.org/10.1016/j.jaci.2022.08.028",
  },
  {
    title: "An algorithm for the diagnosis of beta-lactam allergy",
    sub: "Doña và cộng sự - 2024 update",
    detail:
      "Allergy. 2025;80:633–637. Figure 1, Table 1.",
    url: "https://doi.org/10.1111/all.16348",
  },
];

const IMAGE_PATH = "/di-ung-cheo.png";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getDrug(name: string) {
  return DRUGS.find((d) => d.name === name);
}

function getPairRule(a: string, b: string) {
  return PAIRS.find(
    (pair) =>
      pair.drugs.includes(a) &&
      pair.drugs.includes(b)
  );
}

function assessReaction(reaction: Reaction) {
  switch (reaction) {
    case "scar":
      return {
        title: "Phản ứng da nghiêm trọng",
        category: "critical",
        text:
          "Tiền sử SJS/TEN, DRESS hoặc AGEP cần được xem là nguy cơ rất cao. Không tự thực hiện thử thách thuốc hoặc dùng lại thuốc nghi ngờ. Cần hội chẩn chuyên khoa.",
      };
    case "organ":
      return {
        title: "Phản ứng nghiêm trọng có tổn thương cơ quan",
        category: "critical",
        text:
          "Cần xác minh nguyên nhân, loại phản ứng và mức độ tổn thương cơ quan. Không tự động cho phép dùng lại thuốc dựa trên bảng dị ứng chéo.",
      };
    case "anaphylaxis":
      return {
        title: "Tiền sử phản vệ",
        category: "high",
        text:
          "Cần đánh giá chuyên khoa dựa trên thuốc nghi ngờ, thời gian xảy ra và mức độ phản vệ. Không tự tiến hành test hoặc thử thách thuốc.",
      };
    case "immediate":
      return {
        title: "Phản ứng tức thì nghi ngờ quá mẫn",
        category: "review",
        text:
          "Cần khai thác mày đay, phù mạch, triệu chứng hô hấp và tuần hoàn, khoảng thời gian từ lúc dùng thuốc đến khi xuất hiện phản ứng.",
      };
    case "mild":
      return {
        title: "Phản ứng da nhẹ đã khai báo",
        category: "review",
        text:
          "Cần xác định thời gian, diện tích ban, tổn thương niêm mạc, sốt, triệu chứng toàn thân và kết quả đánh giá trước đó. Có thể thuộc nhóm nguy cơ thấp nếu đáp ứng đầy đủ tiêu chuẩn.",
      };
    case "intolerance":
      return {
        title: "Triệu chứng không điển hình cho dị ứng",
        category: "review",
        text:
          "Đau đầu, tiêu chảy đơn thuần hoặc tiền sử gia đình không đồng nghĩa với dị ứng miễn dịch. Cần xác minh trước khi chỉnh sửa nhãn dị ứng.",
      };
    default:
      return {
        title: "Chưa xác định được kiểu phản ứng",
        category: "review",
        text:
          "Chưa đủ dữ liệu để đánh giá nguy cơ. Cần khai thác lại tiền sử và hồ sơ điều trị trước đây.",
      };
  }
}

export default function AntibioticAllergyPage() {
  const [tab, setTab] = useState<Tab>("history");

  // History
  const [culprit, setCulprit] = useState("");
  const [onset, setOnset] = useState("");
  const [reaction, setReaction] =
    useState<Reaction>("unknown");
  const [description, setDescription] =
    useState("");
  const [previousTolerance, setPreviousTolerance] =
    useState("");
  const [assessment, setAssessment] =
    useState(false);

  // Cross checking
  const [drugA, setDrugA] =
    useState("Amoxicillin");
  const [drugB, setDrugB] =
    useState("Cefadroxil");
  const [crossReaction, setCrossReaction] =
    useState<Reaction>("unknown");
  const [checked, setChecked] = useState(false);

  // General searching
  const [query, setQuery] = useState("");

  // Image viewer
  const [imageOpen, setImageOpen] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [imageError, setImageError] =
    useState(false);

  const historyResult = assessReaction(reaction);
  const crossResult = assessReaction(crossReaction);

  const pair = useMemo(
    () => getPairRule(drugA, drugB),
    [drugA, drugB]
  );

  const groupItems = useMemo(
    () =>
      TOPICS.filter((item) =>
        normalize(
          item.name + " " + item.content
        ).includes(normalize(query))
      ),
    [query]
  );

  function clearHistory() {
    setCulprit("");
    setOnset("");
    setReaction("unknown");
    setDescription("");
    setPreviousTolerance("");
    setAssessment(false);
  }

  function openMatrix() {
    setImageOpen(true);
    setImageScale(1);
    setImageError(false);
  }

  const tabs: {
    id: Tab;
    name: string;
  }[] = [
    { id: "history", name: "Đánh giá dị ứng" },
    { id: "cross", name: "Kiểm tra dị ứng chéo" },
    { id: "matrix", name: "Bảng dị ứng chéo" },
    { id: "groups", name: "Theo nhóm kháng sinh" },
    { id: "emergency", name: "Phản vệ & xử trí" },
    { id: "sources", name: "Nguồn & quy trình" },
  ];

  return (
    <main className="abx-allergy">
      <div className="aa-wrap">

        {/* BREADCRUMB */}
        <nav className="aa-breadcrumb">
          <Link href="/">Trang chủ</Link>
          <ChevronRight size={14}/>
          <Link href="/antibiotics">
            Kháng sinh & AMS
          </Link>
          <ChevronRight size={14}/>
          <strong>Dị ứng kháng sinh</strong>
        </nav>

        {/* HEADER */}
        <div className="aa-header">
          <div className="aa-title-icon">
            <ShieldAlert size={25}/>
          </div>
          <div>
            <h1>
              Dị ứng & Dị ứng chéo kháng sinh
            </h1>
            <p>
              Đánh giá nguy cơ · Cấu trúc beta-lactam ·
              Phản vệ · Tra cứu khuyến cáo
            </p>
          </div>
        </div>

        {/* SAFETY NOTICE */}
        <div className="aa-notice">
          <Info size={18}/>
          <div>
            <strong>
              Hệ thống hỗ trợ đánh giá chuyên môn
            </strong>
            <p>
              Thông tư 51/2017/TT-BYT · AAAAI/ACAAI
              2022 · Doña và cộng sự 2024 update.
              Kết quả không thay thế đánh giá lâm sàng
              hoặc quy trình đã được BV199 phê duyệt.
            </p>
          </div>
        </div>

        {/* TABS */}
        <nav className="aa-tabs">
          {tabs.map((item) => (
            <button
              key={item.id}
              className={
                tab === item.id ? "active" : ""
              }
              type="button"
              onClick={() => setTab(item.id)}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* 1. CLINICAL HISTORY */}
        {tab === "history" && (
          <section className="aa-section">
            <div className="aa-section-title">
              <ClipboardList size={20}/>
              <div>
                <h2>Đánh giá tiền sử dị ứng</h2>
                <p>
                  Tham chiếu Phụ lục VI –
                  Thông tư 51/2017/TT-BYT.
                </p>
              </div>
            </div>

            <div className="aa-form-grid">
              <label className="aa-field">
                <span>Thuốc nghi ngờ gây dị ứng</span>
                <input
                  list="aa-drugs"
                  value={culprit}
                  onChange={(e) => {
                    setCulprit(e.target.value);
                    setAssessment(false);
                  }}
                  placeholder="Nhập hoạt chất hoặc biệt dược"
                />
              </label>

              <label className="aa-field">
                <span>Thời điểm xuất hiện phản ứng</span>
                <select
                  value={onset}
                  onChange={(e) => {
                    setOnset(e.target.value);
                    setAssessment(false);
                  }}
                >
                  <option value="">
                    Chưa rõ thời gian
                  </option>
                  <option value="0-1h">
                    Trong vòng 1 giờ
                  </option>
                  <option value="1-6h">
                    Từ 1 đến 6 giờ
                  </option>
                  <option value="over6h">
                    Sau hơn 6 giờ
                  </option>
                  <option value="days">
                    Sau nhiều ngày
                  </option>
                </select>
              </label>

              <label className="aa-field aa-full">
                <span>Biểu hiện phản ứng</span>
                <select
                  value={reaction}
                  onChange={(e) => {
                    setReaction(
                      e.target.value as Reaction
                    );
                    setAssessment(false);
                  }}
                >
                  {REACTIONS.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="aa-field aa-full">
                <span>
                  Mô tả triệu chứng và xử trí trước đây
                </span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Ví dụ: mày đay, khó thở, hạ huyết áp, đã dùng adrenalin..."
                />
              </label>

              <label className="aa-field aa-full">
                <span>
                  Các kháng sinh đã dung nạp sau phản ứng
                </span>
                <input
                  value={previousTolerance}
                  onChange={(e) =>
                    setPreviousTolerance(e.target.value)
                  }
                  placeholder="Tên thuốc, thời điểm và mức độ chắc chắn"
                />
              </label>
            </div>

            <div className="aa-actions">
              <button
                className="aa-primary"
                type="button"
                onClick={() => setAssessment(true)}
              >
                Đánh giá tiền sử
              </button>
              <button
                className="aa-secondary"
                type="button"
                onClick={clearHistory}
              >
                <RotateCcw size={15}/>
                Xóa dữ liệu
              </button>
            </div>

            {assessment && (
              <div className="aa-result">
                <h3>{historyResult.title}</h3>
                <p>{historyResult.text}</p>
                <p>
                  <b>Thuốc khai báo:</b>{" "}
                  {culprit || "Chưa có"}
                </p>
                <p>
                  <b>Thời điểm:</b>{" "}
                  {onset || "Chưa xác định"}
                </p>

                {(reaction === "scar" ||
                  reaction === "organ" ||
                  reaction === "anaphylaxis") && (
                  <div className="aa-critical">
                    <AlertTriangle size={18}/>
                    Cần bác sĩ đánh giá trực tiếp.
                    Không tự thử lại thuốc nghi ngờ.
                  </div>
                )}

                <p className="aa-muted">
                  Phân loại này là hỗ trợ khai thác
                  tiền sử, chưa phải chẩn đoán xác
                  định hay điểm nguy cơ đã thẩm định.
                </p>
              </div>
            )}
          </section>
        )}

        {/* 2. CROSS REACTIVITY */}
        {tab === "cross" && (
          <section className="aa-section">
            <div className="aa-section-title">
              <Pill size={20}/>
              <div>
                <h2>Kiểm tra dị ứng chéo hai thuốc</h2>
                <p>
                  Tra cứu cặp hoạt chất và kết hợp
                  với kiểu phản ứng lâm sàng.
                </p>
              </div>
            </div>

            <div className="aa-form-grid">
              <label className="aa-field">
                <span>Kháng sinh từng gây phản ứng</span>
                <select
                  value={drugA}
                  onChange={(e) => {
                    setDrugA(e.target.value);
                    setChecked(false);
                  }}
                >
                  {DRUGS.map((drug) => (
                    <option key={drug.name}>
                      {drug.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="aa-field">
                <span>Kháng sinh dự kiến sử dụng</span>
                <select
                  value={drugB}
                  onChange={(e) => {
                    setDrugB(e.target.value);
                    setChecked(false);
                  }}
                >
                  {DRUGS.map((drug) => (
                    <option key={drug.name}>
                      {drug.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="aa-field aa-full">
                <span>Tiền sử phản ứng</span>
                <select
                  value={crossReaction}
                  onChange={(e) => {
                    setCrossReaction(
                      e.target.value as Reaction
                    );
                    setChecked(false);
                  }}
                >
                  {REACTIONS.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="aa-actions">
              <button
                className="aa-primary"
                type="button"
                onClick={() => setChecked(true)}
              >
                <Search size={17}/>
                Kiểm tra dị ứng chéo
              </button>

              <button
                className="aa-secondary"
                type="button"
                onClick={() => setTab("matrix")}
              >
                Xem bảng đầy đủ
              </button>
            </div>

            {checked && (
              <div className="aa-result">
                <h3>
                  {drugA} → {drugB}
                </h3>

                {(crossReaction === "scar" ||
                  crossReaction === "organ") && (
                  <div className="aa-critical">
                    <AlertTriangle size={18}/>
                    {crossResult.text}
                  </div>
                )}

                {crossReaction === "anaphylaxis" && (
                  <div className="aa-caution">
                    <AlertTriangle size={17}/>
                    {crossResult.text}
                  </div>
                )}

                {drugA === drugB ? (
                  <div className="aa-caution">
                    Đây là cùng một hoạt chất.
                    Không sử dụng lại dựa trên
                    đánh giá dị ứng chéo.
                  </div>
                ) : pair ? (
                  <>
                    <div className="aa-finding">
                      <h4>{pair.relation}</h4>
                      <p>{pair.explanation}</p>
                      <p>{pair.evidence}</p>
                      <small>
                        Nguồn: {pair.source}
                      </small>
                    </div>
                  </>
                ) : (
                  <div className="aa-finding">
                    <h4>
                      Chưa có quy tắc theo cặp
                      đã thẩm định trong module
                    </h4>

                    <p>
                      {getDrug(drugA)?.category}
                      {" → "}
                      {getDrug(drugB)?.category}
                    </p>

                    {getDrug(drugA)?.family ===
                      "Beta-lactam" &&
                    getDrug(drugB)?.family ===
                      "Beta-lactam" ? (
                      <p>
                        Hai thuốc cùng họ beta-lactam.
                        Cần xem bảng R1/R2 và
                        hướng dẫn chuyên biệt.
                        Chưa đủ cơ sở để kết luận
                        mức độ dị ứng chéo cho cặp này.
                      </p>
                    ) : (
                      <p>
                        Chưa có đủ dữ liệu để khẳng định
                        có hoặc không có dị ứng chéo.
                        Cần đối chiếu tài liệu chuyên biệt
                        theo từng nhóm.
                      </p>
                    )}
                  </div>
                )}

                <p className="aa-muted">
                  Kết quả không đồng nghĩa
                  với “được phép sử dụng thuốc”.
                  Mọi quyết định phải dựa trên
                  bệnh cảnh và đánh giá của bác sĩ.
                </p>
              </div>
            )}
          </section>
        )}

        {/* 3. ORIGINAL MATRIX */}
        {tab === "matrix" && (
          <section className="aa-section">
            <div className="aa-section-title">
              <Maximize2 size={20}/>
              <div>
                <h2>Bảng dị ứng chéo kháng sinh</h2>
                <p>
                  Hiển thị hình gốc do bạn cung cấp.
                  Nhấn vào hình để phóng lớn.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="aa-image-button"
              onClick={openMatrix}
            >
              <img
                src={IMAGE_PATH}
                alt="Bảng ma trận dị ứng chéo kháng sinh do người dùng cung cấp"
                onError={() => setImageError(true)}
              />
            </button>

            {imageError && (
              <div className="aa-caution">
                Chưa tìm thấy hình. Hãy kiểm tra file
                public/di-ung-cheo.png.
              </div>
            )}

            <div className="aa-actions">
              <button
                type="button"
                className="aa-primary"
                onClick={openMatrix}
              >
                <Maximize2 size={16}/>
                Mở bảng toàn màn hình
              </button>
            </div>

            <div className="aa-finding">
              <h4>Lưu ý khi đọc bảng</h4>
              <p>
                Cần xem đúng phần chú thích và
                ký hiệu của bảng gốc. Không suy diễn
                rằng ô trống đồng nghĩa thuốc an toàn.
              </p>
              <p>
                Ảnh này là tài liệu tham chiếu riêng,
                không tự động biến thành quy tắc
                quyết định lâm sàng.
              </p>
            </div>
          </section>
        )}

        {/* 4. DRUG GROUPS */}
        {tab === "groups" && (
          <section className="aa-section">
            <div className="aa-section-title">
              <BookOpen size={20}/>
              <div>
                <h2>Dị ứng theo nhóm kháng sinh</h2>
                <p>
                  Tổng quan nguyên tắc đánh giá
                  từ các tài liệu đã cung cấp.
                </p>
              </div>
            </div>

            <label className="aa-search">
              <Search size={17}/>
              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Tìm penicillin, cephalosporin, sulfonamide..."
              />
            </label>

            <div className="aa-topic-list">
              {groupItems.map((item) => (
                <details key={item.name}>
                  <summary>
                    <Pill size={15}/>
                    {item.name}
                  </summary>
                  <p>{item.content}</p>
                  <small>
                    Nguồn: {item.source}
                  </small>
                </details>
              ))}
              {groupItems.length === 0 && (
                <p>Không tìm thấy nhóm phù hợp.</p>
              )}
            </div>
          </section>
        )}

        {/* 5. ANAPHYLAXIS */}
        {tab === "emergency" && (
          <section className="aa-section">
            <div className="aa-section-title">
              <ShieldAlert size={20}/>
              <div>
                <h2>Nhận diện và xử trí phản vệ</h2>
                <p>
                  Thông tư 51/2017/TT-BYT –
                  Phụ lục I, II, III, IV, V và X.
                </p>
              </div>
            </div>

            <div className="aa-critical">
              <AlertTriangle size={20}/>
              <div>
                <strong>
                  Nghi ngờ phản vệ đang xảy ra
                </strong>
                <p>
                  Ngừng tiếp xúc với thuốc nghi ngờ,
                  kích hoạt quy trình cấp cứu phản vệ
                  và đánh giá ngay hô hấp, tuần hoàn,
                  ý thức. Không trì hoãn cấp cứu để
                  sử dụng công cụ tra cứu.
                </p>
              </div>
            </div>

            <div className="aa-topic-list">
              <details open>
                <summary>
                  1. Nhận diện dấu hiệu phản vệ
                </summary>
                <p>
                  Đánh giá các biểu hiện da, niêm mạc,
                  hô hấp, tiêu hóa, tuần hoàn và thần kinh;
                  sử dụng tiêu chuẩn chẩn đoán tại
                  Phụ lục I của Thông tư 51.
                </p>
              </details>

              <details>
                <summary>
                  2. Phân độ phản vệ
                </summary>
                <p>
                  Theo Phụ lục II: độ I, độ II,
                  độ III và độ IV. Mức độ có thể
                  diễn tiến nhanh, cần theo dõi
                  liên tục và xử trí kịp thời.
                </p>
              </details>

              <details>
                <summary>
                  3. Xử trí cấp cứu
                </summary>
                <p>
                  Adrenalin là thuốc thiết yếu,
                  quan trọng hàng đầu trong xử trí
                  phản vệ theo Thông tư 51.
                  Liều, đường dùng, theo dõi và
                  hỗ trợ hồi sức phải theo Phụ lục III
                  và quy trình cấp cứu bệnh viện.
                </p>
                <p>
                  Không dùng corticosteroid hoặc
                  kháng histamin thay thế adrenalin
                  khi có chỉ định xử trí phản vệ.
                </p>
              </details>

              <details>
                <summary>
                  4. Phản vệ trong trường hợp đặc biệt
                </summary>
                <p>
                  Xem Phụ lục IV, bao gồm trường
                  hợp người bệnh sử dụng thuốc chẹn
                  beta và các tình huống đặc biệt khác.
                </p>
              </details>

              <details>
                <summary>
                  5. Dự phòng và ghi nhận sau phản vệ
                </summary>
                <p>
                  Ghi hồ sơ dị ứng, thông báo cho
                  người bệnh, xem xét thẻ theo dõi
                  dị ứng tại Phụ lục VII và thực hiện
                  báo cáo theo quy định.
                </p>
              </details>
            </div>

            <p className="aa-muted">
              Đây là phần tra cứu nguyên tắc.
              Chưa tích hợp bảng liều cấp cứu theo
              tuổi, cân nặng và phác đồ hồi sức riêng.
              Cần sử dụng bản gốc Phụ lục III.
            </p>
          </section>
        )}

        {/* 6. SOURCES */}
        {tab === "sources" && (
          <section className="aa-section">
            <div className="aa-section-title">
              <FileText size={20}/>
              <div>
                <h2>Nguồn tài liệu và quy trình</h2>
                <p>
                  Phân biệt quy định pháp lý Việt Nam
                  với khuyến cáo chuyên môn quốc tế.
                </p>
              </div>
            </div>

            <div className="aa-source-list">
              {SOURCES.map((source) => (
                <article key={source.title}>
                  <h3>{source.title}</h3>
                  <p>{source.sub}</p>
                  <p>{source.detail}</p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mở nguồn
                    <ExternalLink size={14}/>
                  </a>
                </article>
              ))}
            </div>

            <div className="aa-finding">
              <h4>Trước khi triển khai tại BV199</h4>
              <p>
                Cần thẩm định danh sách cặp dị ứng chéo,
                quy trình đánh giá nguy cơ, tiêu chí
                hội chẩn, hướng dẫn test và quy trình
                cập nhật nhãn dị ứng trong hồ sơ bệnh án.
              </p>
              <p>
                Bảng cấu trúc R1/R2 và hướng dẫn
                quốc tế không tự động trở thành
                quy định pháp lý Việt Nam.
              </p>
            </div>
          </section>
        )}

        {/* DATALIST */}
        <datalist id="aa-drugs">
          {DRUGS.map((drug) => (
            <option
              key={drug.name}
              value={drug.name}
            />
          ))}
        </datalist>

        {/* IMAGE MODAL */}
        {imageOpen && (
          <div
            className="aa-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Bảng dị ứng chéo phóng lớn"
          >
            <div className="aa-modal">
              <div className="aa-modal-toolbar">
                <strong>
                  Bảng dị ứng chéo kháng sinh
                </strong>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setImageScale((x) =>
                        Math.max(0.75, x - 0.25)
                      )
                    }
                    aria-label="Thu nhỏ"
                  >
                    <ZoomOut size={17}/>
                  </button>

                  <span>
                    {Math.round(imageScale * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setImageScale((x) =>
                        Math.min(4, x + 0.25)
                      )
                    }
                    aria-label="Phóng to"
                  >
                    <ZoomIn size={17}/>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setImageOpen(false)
                    }
                    aria-label="Đóng"
                  >
                    <X size={19}/>
                  </button>
                </div>
              </div>

              <div className="aa-modal-content">
                <img
                  src={IMAGE_PATH}
                  alt="Bảng dị ứng chéo nguyên bản phóng lớn"
                  style={{
                    width:
                      `${Math.round(950 * imageScale)}px`,
                  }}
                />
              </div>

              <div className="aa-modal-footer">
                Hình tham khảo. Không sử dụng riêng
                bảng này để kết luận thuốc an toàn.
              </div>
            </div>
          </div>
        )}

        <footer className="aa-footer">
          Khoa Dược · Bệnh viện 199 · Bộ Công an
          <span>
            Nội dung hỗ trợ chuyên môn, không
            thay thế quyết định điều trị.
          </span>
        </footer>

      </div>

      {/* COMPLETE MODULE STYLES */}
      <style>{`
        .abx-allergy {
          background: #f6f9fc;
          color: #102b43;
          min-height: 100vh;
          padding: 20px 24px 36px;
          font-family: Arial, sans-serif;
          font-size: 13px;
        }

        .aa-wrap {
          max-width: 1350px;
          margin: 0 auto;
        }

        .aa-breadcrumb {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
          font-size: 12px;
          margin-bottom: 20px;
          color: #627e96;
        }

        .aa-breadcrumb a {
          text-decoration: none;
          color: #075985;
        }

        .aa-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 18px;
        }

        .aa-title-icon {
          display: grid;
          place-items: center;
          width: 54px;
          height: 54px;
          flex: none;
          background: #dcefff;
          color: #075985;
          border-radius: 13px;
        }

        .aa-header h1 {
          margin: 0 0 7px;
          font-size: 25px;
          line-height: 1.25;
        }

        .aa-header p {
          margin: 0;
          color: #6b8299;
          font-size: 12px;
        }

        .aa-notice {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          background: #edf6fd;
          border: 1px solid #d4e6f6;
          border-radius: 11px;
          padding: 13px 15px;
          margin-bottom: 19px;
          color: #27597c;
          line-height: 1.65;
        }

        .aa-notice svg {
          flex: none;
        }

        .aa-notice p {
          margin: 4px 0 0;
          font-size: 12px;
        }

        .aa-tabs {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 16px;
        }

        .aa-tabs button {
          padding: 12px 15px;
          border: 1px solid #d8e5f0;
          border-radius: 9px;
          background: white;
          color: #39566f;
          font-weight: 600;
          cursor: pointer;
          font-size: 12px;
        }

        .aa-tabs button:hover {
          background: #f0f8ff;
        }

        .aa-tabs button.active {
          background: #075985;
          color: white;
          border-color: #075985;
        }

        .aa-section {
          background: white;
          border: 1px solid #dce6ef;
          border-radius: 14px;
          padding: 24px;
          min-height: 390px;
        }

        .aa-section-title {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding-bottom: 19px;
          margin-bottom: 19px;
          border-bottom: 1px solid #e6edf4;
          color: #075985;
        }

        .aa-section-title h2 {
          color: #142e49;
          font-size: 19px;
          margin: 0 0 7px;
        }

        .aa-section-title p {
          margin: 0;
          color: #6f8499;
          font-size: 12px;
        }

        .aa-form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 17px;
        }

        .aa-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .aa-field > span {
          font-size: 12px;
          color: #28465e;
          font-weight: 700;
        }

        .aa-field input,
        .aa-field select,
        .aa-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 13px;
          border: 1px solid #cddce9;
          border-radius: 9px;
          background: #fff;
          color: #132d47;
          outline: none;
          font-family: inherit;
          font-size: 13px;
        }

        .aa-field input:focus,
        .aa-field select:focus,
        .aa-field textarea:focus {
          border-color: #0875ae;
        }

        .aa-full {
          grid-column: 1 / -1;
        }

        .aa-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .aa-actions button {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          min-height: 41px;
          padding: 0 16px;
          border-radius: 9px;
          font-weight: 700;
          cursor: pointer;
          font-size: 12px;
        }

        .aa-primary {
          background: #075985;
          color: #fff;
          border: 1px solid #075985;
        }

        .aa-secondary {
          background: #fff;
          color: #235677;
          border: 1px solid #cbdce8;
        }

        .aa-result {
          margin-top: 23px;
          border: 1px solid #d6e6f2;
          border-radius: 11px;
          padding: 19px;
          background: #fbfdff;
          line-height: 1.75;
        }

        .aa-result h3 {
          font-size: 16px;
          margin: 0 0 10px;
        }

        .aa-result p {
          margin: 8px 0;
        }

        .aa-finding {
          background: #f5f9fc;
          border: 1px solid #dde8f1;
          border-radius: 10px;
          padding: 15px;
          margin-top: 14px;
          line-height: 1.8;
        }

        .aa-finding h4 {
          margin: 0 0 8px;
          font-size: 14px;
          color: #075985;
        }

        .aa-finding p {
          margin: 8px 0;
          color: #37536c;
        }

        .aa-finding small {
          color: #647f96;
        }

        .aa-critical,
        .aa-caution {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px;
          border-radius: 9px;
          margin: 12px 0;
          line-height: 1.75;
        }

        .aa-critical {
          background: #fff1f1;
          border: 1px solid #efc5c5;
          color: #9c2929;
        }

        .aa-caution {
          background: #fff8ed;
          border: 1px solid #f1d9b1;
          color: #855927;
        }

        .aa-critical svg,
        .aa-caution svg {
          flex: none;
        }

        .aa-critical p {
          margin: 5px 0 0;
        }

        .aa-muted {
          color: #72859a;
          font-size: 11px;
          line-height: 1.75;
        }

        .aa-image-button {
          width: 100%;
          padding: 15px;
          background: #fafcff;
          border: 1px solid #dce7f1;
          border-radius: 10px;
          cursor: zoom-in;
          display: flex;
          justify-content: center;
        }

        .aa-image-button img {
          width: 100%;
          max-width: 850px;
          height: auto;
          object-fit: contain;
        }

        .aa-search {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 12px;
          border: 1px solid #cadbe8;
          border-radius: 9px;
          margin-bottom: 17px;
          color: #728ca2;
        }

        .aa-search input {
          flex: 1;
          border: 0;
          outline: none;
          min-width: 0;
          height: 44px;
          color: #12304b;
          font-size: 13px;
        }

        .aa-topic-list {
          display: grid;
          gap: 10px;
        }

        .aa-topic-list details {
          border: 1px solid #e0e9f1;
          border-radius: 9px;
          background: #fff;
          padding: 13px 15px;
        }

        .aa-topic-list summary {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #175b83;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        .aa-topic-list details p {
          line-height: 1.85;
          color: #45627c;
          font-size: 13px;
        }

        .aa-topic-list small {
          display: block;
          margin-top: 10px;
          color: #72859b;
        }

        .aa-source-list {
          display: grid;
          gap: 12px;
        }

        .aa-source-list article {
          padding: 17px;
          border: 1px solid #dfebf3;
          border-radius: 10px;
        }

        .aa-source-list h3 {
          margin: 0 0 9px;
          font-size: 15px;
        }

        .aa-source-list p {
          margin: 6px 0;
          color: #607991;
          line-height: 1.7;
        }

        .aa-source-list a {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 9px;
          color: #075985;
          font-weight: 700;
          text-decoration: none;
        }

        .aa-footer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 9px;
          border-top: 1px solid #dfe8f0;
          padding-top: 16px;
          margin-top: 20px;
          color: #6b8296;
          font-size: 11px;
        }

        /* MODAL VIEWER */
        .aa-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 23, 37, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .aa-modal {
          display: flex;
          flex-direction: column;
          background: white;
          width: min(1250px, 96vw);
          height: min(900px, 94vh);
          border-radius: 13px;
          overflow: hidden;
        }

        .aa-modal-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          padding: 12px 17px;
          border-bottom: 1px solid #e1eaf2;
        }

        .aa-modal-toolbar > div {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .aa-modal-toolbar button {
          display: grid;
          place-items: center;
          width: 35px;
          height: 35px;
          border: 1px solid #dbe5ee;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          color: #0c537c;
        }

        .aa-modal-content {
          flex: 1;
          min-height: 0;
          overflow: auto;
          padding: 20px;
          background: #f3f6fa;
          text-align: center;
        }

        .aa-modal-content img {
          display: block;
          max-width: none;
          height: auto;
          margin: 0 auto;
        }

        .aa-modal-footer {
          padding: 11px 16px;
          color: #6c7f93;
          font-size: 11px;
          border-top: 1px solid #e4eaf1;
        }

        @media (max-width: 800px) {
          .abx-allergy {
            padding: 13px;
          }

          .aa-header h1 {
            font-size: 21px;
          }

          .aa-section {
            padding: 15px;
          }

          .aa-form-grid {
            grid-template-columns: 1fr;
          }

          .aa-tabs {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 7px;
          }

          .aa-tabs button {
            flex: none;
            white-space: nowrap;
          }

          .aa-modal-overlay {
            padding: 5px;
          }
        }
      `}</style>
    </main>
  );
}
