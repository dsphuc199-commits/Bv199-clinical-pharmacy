/*
  FILE: data/antibiotics/empiric/stratification.ts

  Tab "Phân tầng": trình bày lại nội dung ĐÃ đối chiếu trong ứng dụng theo bố cục phân tầng
  nguy cơ nhiễm khuẩn (cộng đồng / nguy cơ nhiễm khuẩn bệnh viện / nhóm đặc biệt), kèm kháng
  sinh đồ BV199 tách hồi sức (HSCC) và không hồi sức (khối nội, khối ngoại).

  Nguyên tắc:
  - KHÔNG nhập lại thuốc hay liều. Phác đồ Bộ Y tế lấy theo id trong ALL_REGIMENS; khuyến cáo
    quốc tế lấy từ đúng hàm của module quốc tế đã đối chiếu (cùng dữ liệu tab Quốc tế).
  - Mỗi tiêu chí phân tầng và tác nhân ghi rõ văn bản, vị trí.
  - Hồi sức/không hồi sức chỉ tách ở kháng sinh đồ tại chỗ; không tạo phác đồ riêng cho hồi sức
    khi hướng dẫn gốc không tách.
*/
import type { RxItem } from "../../../components/antibiotics/empiric/septic-arthritis-pids2023";
import { sepsisPlan } from "../../../components/antibiotics/empiric/sepsis-ssc2026";
import { swabPlan } from "../../../components/antibiotics/empiric/sepsis-swab2021";

export type StratCite = { text: string; source: string; ref: string };
export type StratIntl = { source: string; lead?: string; items: RxItem[]; notes?: string[] };
export type StratColumn = {
  id: string;
  label: string;
  tone: "community" | "hospital" | "special";
  criteria: StratCite[];
  pathogens?: StratCite[];
  byt: string[];
  intl: StratIntl[];
  links?: { diseaseId: string; label: string }[];
};
export type StratFocus = { label: string; byt: string[]; diseaseId?: string };
export type StratAntibiogram = {
  gramNegative: { organisms: string[]; codes: string[] };
  gramPositive: { organisms: string[]; codes: string[] };
  defaultScope: "toan-vien" | "hscc" | "khoi-noi" | "khoi-ngoai";
  note: string;
};
export type Stratification = {
  diseaseIds: string[];
  title: string;
  lead: string;
  sampling: StratCite[];
  pathogens: StratCite[];
  columns: StratColumn[];
  focusTitle?: string;
  focus?: StratFocus[];
  principles: StratIntl;
  antibiogram: StratAntibiogram;
  sources: string[];
};

const BYT = "QĐ 708/QĐ-BYT";
const SWAB = "SWAB 2021";
const SSC = "SSC 2026";

/* Khối "Phổ kháng sinh kinh nghiệm" của SSC 2026 (KC 25–29) – lấy nguyên văn từ module SSC. */
function sscCoverage(risks: ("mrsa" | "gnmdr")[]): RxItem[] {
  const out = sepsisPlan({ likely: "probable", hemo: "shock", prehosp: false, delay60: false, phase: "initial", culture: "pathogen", risks });
  return out.blocks.find(({ title }) => title === "Phổ kháng sinh kinh nghiệm")?.items.filter(({ role }) => role !== "Phạm vi" && role !== "Nguyên tắc chọn thuốc") ?? [];
}
const swab = (gcr: "low" | "increased" | "high", lead?: string): StratIntl => {
  const plan = swabPlan({ gcr, focus: "unknown", pseudo: false, saureus: false, pcnAllergy: false });
  return { source: `${SWAB} – ${plan.lead}`, lead, items: plan.items.filter(({ role }) => role !== "Không thường quy") };
};

const SEPSIS: Stratification = {
  diseaseIds: ["v8-11", "v8-12"],
  title: "Nhiễm khuẩn huyết, sốc nhiễm khuẩn chưa rõ ổ – người lớn",
  lead: "Phân tầng theo nguy cơ nhiễm khuẩn bệnh viện và miễn dịch như QĐ 708 mục 4.1.2; đặt cạnh phân tầng nguy cơ Enterobacterales kháng cephalosporin thế hệ 3 của SWAB 2021 và nguyên tắc phủ phổ của SSC 2026.",
  sampling: [
    { text: "Cấy máu 2 lần (hiếu khí và kỵ khí), tối thiểu 10 mL/mẫu, ở 2 vị trí khác nhau; catheter mạch máu đặt quá 48 giờ: lấy ít nhất một mẫu qua catheter.", source: BYT, ref: "tr. 118" },
    { text: "Không để việc lấy bệnh phẩm trì hoãn kháng sinh quá 45 phút; kháng sinh trong giờ đầu sau khi cấy máu.", source: BYT, ref: "tr. 118–119" },
    { text: "Sốc nhiễm khuẩn hoặc sepsis khả năng cao: kháng sinh ngay, lý tưởng trong 1 giờ; có thể sepsis, chưa sốc: đánh giá nhanh, nếu vẫn nghi nhiễm khuẩn thì kháng sinh trong 3 giờ.", source: SSC, ref: "KC 16, 17, 19" },
  ],
  pathogens: [
    { text: "Gram âm đường ruột (Salmonella, E. coli, Klebsiella, Serratia, Enterobacter); P. aeruginosa; B. pseudomallei.", source: BYT, ref: "tr. 117" },
    { text: "Gram dương: S. pneumoniae, S. aureus, S. suis.", source: BYT, ref: "tr. 117" },
    { text: "Kỵ khí: C. perfringens, B. fragilis.", source: BYT, ref: "tr. 117" },
  ],
  columns: [
    {
      id: "community",
      label: "Cộng đồng – không nguy cơ nhiễm khuẩn bệnh viện",
      tone: "community",
      criteria: [
        { text: "Chưa rõ ổ nhiễm khuẩn, không có nguy cơ nhiễm khuẩn bệnh viện, miễn dịch bình thường.", source: BYT, ref: "mục 4.1.2a, tr. 119" },
        { text: "Nguy cơ thấp Enterobacterales kháng cephalosporin thế hệ 3: không có các yếu tố ở cột bên cạnh.", source: SWAB, ref: "KC 2" },
      ],
      byt: ["r-sepsis-a", "r-sepsis-a-mssa", "r-sepsis-a-mrsa", "r-sepsis-a-anaer"],
      intl: [swab("low")],
    },
    {
      id: "hospital",
      label: "Có nguy cơ nhiễm khuẩn bệnh viện, liên quan chăm sóc y tế",
      tone: "hospital",
      criteria: [
        { text: "Chưa rõ ổ nhiễm khuẩn nhưng có yếu tố nguy cơ nhiễm khuẩn bệnh viện.", source: BYT, ref: "mục 4.1.2b, tr. 120" },
        { text: "Nguy cơ tăng Enterobacterales kháng cephalosporin thế hệ 3 (đánh giá từng người): tỷ lệ tại chỗ; nhiễm khuẩn bệnh viện hoặc liên quan chăm sóc y tế; dùng kháng sinh phổ rộng trong 2 tháng; đang dùng khử nhiễm chọn lọc đường tiêu hóa (SDD); đi tới vùng lưu hành cao trong 3 tháng; nằm viện ở nước ngoài trong 2 tháng.", source: SWAB, ref: "KC 2 (Có ĐK; rất thấp)" },
        { text: "Nguy cơ cao: đã nhiễm hoặc cư trú Enterobacterales kháng cephalosporin thế hệ 3 trong 1 năm.", source: SWAB, ref: "KC 23" },
      ],
      byt: ["r-sepsis-b", "r-sepsis-b-mrsa", "r-sepsis-b-mdr"],
      intl: [swab("increased"), swab("high")],
    },
    {
      id: "neutropenia",
      label: "Giảm bạch cầu hạt, suy giảm miễn dịch",
      tone: "special",
      criteria: [
        { text: "Giảm bạch cầu hạt (< 0,5 × 10⁹/L hoặc dự đoán giảm), suy giảm miễn dịch.", source: BYT, ref: "mục 4.1.2a, tr. 119–120" },
      ],
      byt: ["r-sepsis-neutro"],
      intl: [],
      links: [
        { diseaseId: "v8-113", label: "Sốt giảm bạch cầu trung tính (IDSA/ASCO, ECIL)" },
        { diseaseId: "v8-116", label: "Sốt giảm bạch cầu trung tính nguy cơ cao" },
      ],
    },
  ],
  focusTitle: "Có ổ nhiễm khuẩn chỉ điểm (QĐ 708 mục 4.1.2c)",
  focus: [
    { label: "Gan mật", byt: ["r-sepsis-c-biliary"], diseaseId: "v8-24" },
    { label: "Ống tiêu hóa", byt: ["r-sepsis-c-gi"], diseaseId: "v8-21" },
    { label: "Dụng cụ mạch máu", byt: ["r-sepsis-c-device"] },
    { label: "Sinh dục nữ", byt: ["r-sepsis-c-female"] },
    { label: "Da (nghi S. aureus)", byt: ["r-sepsis-c-skin"], diseaseId: "v8-28" },
  ],
  principles: {
    source: `${SSC} – phổ kháng sinh kinh nghiệm`,
    lead: "SSC 2026 quyết định khi nào phủ tác nhân đa kháng, kỵ khí, nấm. Chọn thuốc và liều theo QĐ 708 và SWAB 2021 ở các cột trên.",
    items: [...sscCoverage(["mrsa", "gnmdr"]), ...sscCoverage([]).filter(({ role }) => role === "Không phủ đa kháng")],
  },
  antibiogram: {
    gramNegative: {
      organisms: ["Escherichia coli", "Klebsiella pneumoniae", "Enterobacter spp. (gồm K. aerogenes)", "Pseudomonas aeruginosa", "Acinetobacter baumannii"],
      codes: ["CTX", "CRO", "CAZ", "FEP", "TZP", "IMP", "MEM", "AMK", "CIP", "LVX"],
    },
    gramPositive: {
      organisms: ["Staphylococcus aureus", "Enterococcus spp."],
      codes: ["FOX", "AMP", "VAN", "LZD"],
    },
    defaultScope: "hscc",
    note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh. Số phân lập từ máu tại BV199 trong kỳ rất ít, nên dùng số liệu chung các bệnh phẩm để định hướng.",
  },
  sources: [
    "Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh, Nhiễm khuẩn huyết và sốc nhiễm khuẩn.",
    "SWAB 2021 – Sieswerda E và cs. BMC Infect Dis 2022;22:687.",
    "Surviving Sepsis Campaign 2026 – Prescott HC, Antonelli M và cs. Crit Care Med 2026;54:725–812.",
  ],
};

export const STRATIFICATIONS: Stratification[] = [SEPSIS];

export function stratificationFor(diseaseId: string): Stratification | undefined {
  return STRATIFICATIONS.find(({ diseaseIds }) => diseaseIds.includes(diseaseId));
}
