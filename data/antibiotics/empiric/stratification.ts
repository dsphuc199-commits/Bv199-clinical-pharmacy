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
import { CAP_DIAG, capPlans, hvDiagnosis, hvGrades, hvPlan, type CapIn, type HvIn, type Plan } from "../../../components/antibiotics/empiric/pneumonia-intl";
import { CAP_SCENARIOS } from "../../../components/antibiotics/CapByt2026";
import { HAPVAP_RISK, HAPVAP_SCENARIOS } from "../../../components/antibiotics/HapVap2023";

export type StratCite = { text: string; source: string; ref: string };
export type StratIntl = { source: string; lead?: string; items: (RxItem & { preparation?: string })[]; notes?: string[] };
export type StratColumn = {
  id: string;
  label: string;
  tone: "community" | "hospital" | "special";
  /** Nơi điều trị theo bố cục BV ĐHYD: không hồi sức / hồi sức. Không ghi = áp dụng cả hai. */
  setting?: "ward" | "icu";
  criteria: StratCite[];
  pathogens?: StratCite[];
  byt: string[];
  /** Phác đồ Việt Nam nằm trong module riêng (QĐ 2147/2026, khuyến cáo hội chuyên ngành). */
  vn?: StratIntl[];
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
  /** Ghi chú khi hướng dẫn Việt Nam dùng chung phác đồ cho hồi sức và không hồi sức. */
  settingNote?: string;
  focusTitle?: string;
  focus?: StratFocus[];
  principles: StratIntl;
  antibiogram: StratAntibiogram;
  sources: string[];
};

const BYT = "QĐ 708/QĐ-BYT";
const BYT1493 = "QĐ 1493/QĐ-BYT";
const SWAB = "SWAB 2021";
const SSC = "SSC 2026";
const CAPVN = "QĐ 2147/QĐ-BYT 2026";
const HVVN = "Hội Hô hấp VN – Hội HSCC & CĐ VN 2023";
const ATS = "ATS/IDSA 2019";
const IDSA16 = "IDSA/ATS 2016";

/* Bỏ chú thích vị trí tài liệu (QĐ 708 Bảng…, DTQG…, Phụ lục…, Mục…, tr.…) khỏi câu liều; giữ nguyên liều. */
export function cleanRef(text: string): string {
  return text
    /* Trong ngoặc có chú thích vị trí: chỉ bỏ vế chú thích, giữ vế lâm sàng (vd. "Clcr 10–30: mỗi 8–12 giờ"). */
    .replace(/\s*\(([^()]*?(?:QĐ 708|DTQG|Bảng|chương|Phụ lục|Mục \d|tr\.\s*\d)[^()]*)\)/gu, (_m, inner: string) => {
      const keep = inner.split(/;\s*/).filter((p) => !/QĐ 708|DTQG|Bảng|chương|Phụ lục|Mục \d|tr\.\s*\d/u.test(p));
      return keep.length ? ` (${keep.join("; ")})` : "";
    })
    .replace(/\bPhụ lục \d+:\s*/gu, "")
    .split(/;\s*/)
    .map((part) => part
      .replace(/\s*[–.]\s*(?:DTQG|Bảng)\b.*$/u, "")
      .replace(/(?:;|,)?\s*theo Mục [\d.]+/gu, "")
      /* Chỉ bỏ đúng câu ghi chú soạn thảo, giữ các câu liều khác trong cùng đoạn. */
      .split(/(?<=\.)\s+(?=\p{Lu})/u)
      .filter((sentence) => !/nguồn không|không ghi liều/iu.test(sentence))
      .join(" ")
      .trim())
    .filter(Boolean)
    .join("; ");
}

type ModuleDrug = { name: string; dose: string; route?: string; caution?: string };
type ModuleRegimen = { id: string; name: string; drugs: ModuleDrug[]; indication?: string };
/* Phương án mà nguồn ghi "chọn một thuốc" (vd. levofloxacin hoặc moxifloxacin): nối bằng "hoặc", không phải phối hợp. */
const ONE_OF = /chọn một thuốc|không dùng cả hai/iu;
/* Phác đồ trong module Việt Nam -> dòng bảng; giữ nguyên thuốc, liều, đường dùng và chú thích liều. */
function moduleBlock(source: string, regimens: ModuleRegimen[], lead?: string): StratIntl {
  return {
    source,
    lead,
    items: regimens.map((r) => {
      const cautions = r.drugs.map((d) => d.caution && cleanRef(d.caution)).filter(Boolean);
      return {
        role: r.name,
        text: r.drugs.map((d) => `${d.name}: ${cleanRef(d.dose)}${d.route && d.route !== "IV" ? ` (${d.route})` : ""}`).join(ONE_OF.test(r.indication ?? "") ? " hoặc " : " + "),
        ref: r.id,
        ...(cautions.length ? { preparation: cautions.join(" ") } : {}),
      };
    }),
  };
}
const capScenario = (id: string) => CAP_SCENARIOS.find((s) => s.id === id)!;
const capVn = (id: string): StratIntl => moduleBlock(`${CAPVN} – ${capScenario(id).name}`, capScenario(id).regimens);
const hvVn = (kind: "hap" | "vap", id: string): StratIntl => {
  const s = HAPVAP_SCENARIOS[kind].find((x) => x.id === id)!;
  return moduleBlock(`${HVVN} – ${s.title}`, s.regimens, s.description);
};

/* Kế hoạch ATS/IDSA 2019 (module Quốc tế) -> khối bảng. */
const planBlock = (src: string, plan: Plan): StratIntl => ({
  source: `${src}${plan.title ? ` – ${plan.title}` : ""}`,
  lead: [plan.lead, plan.note].filter(Boolean).join(" "),
  items: plan.blocks.flatMap((b) => b.items),
});
const CAP_BASE: CapIn = { setting: "out", severe: false, comorb: false, macLow: false, mrsaPrior: false, paPrior: false, recentHosp: false, localMrsa: false, localPa: false, nasalPcr: false, noMacFq: false };
function capIntl(i: Partial<CapIn>, withRisk = false): StratIntl[] {
  const out = capPlans({ ...CAP_BASE, ...i });
  const blocks = out.plans.map((p) => planBlock(ATS, p));
  if (withRisk) {
    const risk = capPlans({ ...CAP_BASE, ...i, mrsaPrior: true, paPrior: true });
    if (risk.mrsa) blocks.push(planBlock(`${ATS} – đã phân lập MRSA đường hô hấp`, risk.mrsa));
    if (risk.pa) blocks.push(planBlock(`${ATS} – đã phân lập P. aeruginosa đường hô hấp`, risk.pa));
  }
  return blocks;
}
const HV_BASE: HvIn = { kind: "hap", ivAbx: false, shock: false, ards: false, hosp5: false, rrt: false, mrsaUnit: false, mrsaColon: false, gnUnit: false, structural: false, gram: false };
function hvIntl(i: Partial<HvIn>, label: string): StratIntl {
  const out = hvPlan({ ...HV_BASE, ...i });
  return { source: `${IDSA16} – ${label}`, lead: out.headline, items: out.plan.blocks.flatMap((b) => b.items) };
}

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
  settingNote: "QĐ 708 dùng chung phác đồ cho khoa hồi sức và không hồi sức.",
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
    lead: "SSC 2026 quyết định khi nào phủ tác nhân đa kháng, kỵ khí, nấm; thuốc và liều cụ thể theo SWAB 2021 ở các cột trên.",
    items: [
      ...sscCoverage(["mrsa", "gnmdr"]),
      ...sscCoverage([]).filter(({ role }) => role === "Không phủ đa kháng"),
      /* Dị ứng penicilin (SWAB 2021 KC 29–31): trước đây chỉ có ở công cụ SSC/SWAB cũ của tab Quốc tế. */
      ...swabPlan({ gcr: "low", focus: "unknown", pseudo: false, saureus: false, pcnAllergy: true }).items.filter(({ role }) => role === "Dị ứng penicilin"),
    ],
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

/* ======================= VIÊM PHỔI ======================= */
const RESP_GN = ["Klebsiella pneumoniae", "Escherichia coli", "Enterobacter spp. (gồm K. aerogenes)", "Pseudomonas aeruginosa", "Acinetobacter baumannii"];
const ATS_SEVERE: StratCite = { text: "Viêm phổi nặng: ≥ 1 tiêu chuẩn chính (sốc nhiễm khuẩn cần vận mạch; suy hô hấp cần thông khí cơ học) hoặc ≥ 3 tiêu chuẩn phụ (nhịp thở ≥ 30; PaO₂/FiO₂ ≤ 250; thâm nhiễm nhiều thùy; lú lẫn; BUN ≥ 20 mg/dL; bạch cầu < 4.000/µL; tiểu cầu < 100.000/µL; nhiệt độ < 36 °C; hạ huyết áp cần bù dịch tích cực).", source: ATS, ref: "Bảng 1" };
const ATS_COMORB = "bệnh tim, phổi, gan hoặc thận mạn; đái tháo đường; nghiện rượu; ung thư; cắt lách";
const ATS_RISK: StratCite = { text: "Phủ MRSA hoặc P. aeruginosa khi đã phân lập tác nhân đó ở đường hô hấp, hoặc nằm viện và dùng kháng sinh đường tiêm trong 90 ngày kèm dữ liệu tại chỗ xác nhận yếu tố nguy cơ. Không dùng khái niệm viêm phổi liên quan chăm sóc y tế (HCAP) để mở rộng phổ.", source: ATS, ref: "Q8–Q9, Q11" };

const CAP: Stratification = {
  diseaseIds: ["v8-1"],
  title: "Viêm phổi mắc phải cộng đồng – người lớn",
  lead: "Phân tầng theo nơi điều trị, mức độ nặng và nguy cơ vi khuẩn kháng thuốc như QĐ 2147/QĐ-BYT (2026) mục 5.3; đặt cạnh ATS/IDSA 2019 (cập nhật ATS 2025 về thời gian, corticoid, virus).",
  sampling: [
    { text: "Người bệnh nặng: nhuộm Gram, cấy đờm; cân nhắc multiplex PCR, procalcitonin hoặc CRP.", source: CAPVN, ref: "Mục 5.3.2.1" },
    { text: "Xét nghiệm cúm (và Covid ở bệnh nặng); xét nghiệm lao khi nghi ngờ.", source: CAPVN, ref: "Mục 5.3" },
    ...CAP_DIAG.filter(({ role }) => role === "Nhuộm Gram, cấy đờm và cấy máu").map((i) => ({ text: `${i.role}: ${i.text}`, source: ATS, ref: i.ref })),
  ],
  pathogens: [
    { text: "S. pneumoniae (kể cả kháng penicilin), H. influenzae, M. catarrhalis, S. aureus, Gram âm đường ruột, vi khuẩn không điển hình.", source: CAPVN, ref: "Mục 5.3.1" },
    { text: "Gần 50% H. influenzae tại Việt Nam tiết beta-lactamase.", source: CAPVN, ref: "Bảng 4.4" },
  ],
  columns: [
    {
      id: "out-low", label: "Ngoại trú – nguy cơ thấp", tone: "community", setting: "ward",
      criteria: [
        { text: capScenario("low").description, source: CAPVN, ref: "Mục 5.3.1" },
        { text: `Không có bệnh đồng mắc (${ATS_COMORB}).`, source: ATS, ref: "Bảng 3" },
      ],
      byt: [], vn: [capVn("low")], intl: capIntl({ setting: "out" }),
    },
    {
      id: "out-risk", label: "Ngoại trú – có bệnh đồng mắc hoặc nguy cơ", tone: "community", setting: "ward",
      criteria: [
        { text: capScenario("risk").description, source: CAPVN, ref: "Mục 5.3.1" },
        { text: `Có bệnh đồng mắc: ${ATS_COMORB}.`, source: ATS, ref: "Bảng 3" },
      ],
      byt: [], vn: [capVn("risk")], intl: capIntl({ setting: "out", comorb: true }),
    },
    {
      id: "ward", label: "Nội trú – không hồi sức", tone: "hospital", setting: "ward",
      criteria: [{ text: capScenario("ward").description, source: CAPVN, ref: "Mục 5.3.2.1" }, ATS_RISK],
      byt: [], vn: [capVn("ward")], intl: capIntl({ setting: "in" }, true),
    },
    {
      id: "icu", label: "Viêm phổi nặng – hồi sức (ICU)", tone: "hospital", setting: "icu",
      criteria: [{ text: capScenario("icu").description, source: CAPVN, ref: "Mục 5.3.2.2" }, ATS_SEVERE],
      byt: [], vn: [capVn("icu")], intl: capIntl({ setting: "in", severe: true }, true),
    },
  ],
  focusTitle: "Viêm phổi do hít hoặc do vi khuẩn kỵ khí (hồi sức)",
  focus: [{ label: "QĐ 1493/QĐ-BYT", byt: ["r-icu-cap-aspiration"] }],
  principles: {
    source: `${ATS} – nguyên tắc`,
    items: capPlans({ ...CAP_BASE, setting: "in", severe: true, mrsaPrior: true, paPrior: true }).notes.map((n) => ({ role: "Lưu ý", text: n, ref: "Q8–Q11" })),
  },
  antibiogram: {
    gramNegative: { organisms: ["Klebsiella pneumoniae", "Escherichia coli", "Pseudomonas aeruginosa"], codes: ["AMC", "SAM", "CRO", "CTX", "CAZ", "FEP", "TZP", "MEM", "LVX"] },
    gramPositive: { organisms: ["Staphylococcus aureus", "Streptococcus spp."], codes: ["PEN", "FOX", "LVX", "ERY", "VAN", "LZD"] },
    defaultScope: "toan-vien",
    note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; kháng sinh đồ chủ yếu từ người bệnh nằm viện, chỉ tham khảo cho viêm phổi cộng đồng.",
  },
  sources: [
    "Bộ Y tế. QĐ 2147/QĐ-BYT ngày 15/7/2026 – Hướng dẫn chẩn đoán và điều trị viêm phổi mắc phải cộng đồng ở người lớn.",
    "Bộ Y tế. QĐ 1493/QĐ-BYT ngày 22/4/2015 – Hướng dẫn chẩn đoán và điều trị một số bệnh về hồi sức tích cực (viêm phổi do hít).",
    "Metlay JP và cs. ATS/IDSA 2019 – Am J Respir Crit Care Med 2019;200:e45–e67; Jones BE và cs. ATS 2025 – Am J Respir Crit Care Med 2025;212:24–44.",
  ],
};

const hvColumns = (kind: "hap" | "vap"): StratColumn[] => {
  const risk = HAPVAP_RISK[kind].filter((t) => !/^Kháng sinh đồ/.test(t));
  const cite = (text: string): StratCite => ({ text, source: HVVN, ref: kind === "hap" ? "Bảng 3.1" : "Bảng 3.2" });
  const ids = HAPVAP_SCENARIOS[kind].map((s) => s.id);
  const low = ids.find((id) => id.endsWith("-low"))!;
  const rest = ids.filter((id) => id !== low);
  /* QĐ 708: tác nhân theo thời điểm khởi phát; QĐ 1493: phác đồ tại khoa hồi sức (dùng chung VPBV và VPLQTM). */
  const early: StratCite = { text: "Sớm (< 5 ngày): S. pneumoniae, H. influenzae, MSSA.", source: BYT, ref: "Viêm phổi bệnh viện" };
  const lateHap: StratCite = { text: "Muộn (≥ 5 ngày): P. aeruginosa, E. coli, Enterobacter, K. pneumoniae, A. baumannii, MRSA.", source: BYT, ref: "Viêm phổi bệnh viện" };
  const lateVap: StratCite = { text: "Muộn (≥ 5 ngày) hoặc đã dùng kháng sinh: MRSA, P. aeruginosa, A. baumannii, S. maltophilia; nấm ở người suy giảm miễn dịch.", source: BYT, ref: "Viêm phổi liên quan thở máy" };
  const icu = (text: string): StratCite => ({ text, source: BYT1493, ref: "Viêm phổi bệnh viện, mục 5.3" });
  return kind === "hap" ? [
    {
      id: "low", label: "Không nặng, không nguy cơ đa kháng", tone: "community", setting: "ward",
      criteria: [cite("Không thở máy, không sốc nhiễm khuẩn; không dùng kháng sinh tĩnh mạch trong 90 ngày; không có yếu tố nguy cơ đa kháng hoặc MRSA dưới đây.")],
      pathogens: [early],
      byt: ["r-hap-early", "r-hap-early-alt"], vn: [hvVn("hap", low)],
      intl: [hvIntl({ kind: "hap" }, "nguy cơ tử vong thấp, không yếu tố nguy cơ MRSA")],
    },
    {
      id: "mdr", label: "Có nguy cơ đa kháng hoặc MRSA", tone: "hospital", setting: "ward",
      criteria: risk.map(cite),
      pathogens: [lateHap],
      byt: ["r-hap-late-mild"], vn: rest.map((id) => hvVn("hap", id)),
      intl: [
        hvIntl({ kind: "hap", mrsaUnit: true }, "có yếu tố nguy cơ MRSA, không nguy cơ tử vong cao"),
        hvIntl({ kind: "hap", shock: true, ivAbx: true }, "nguy cơ tử vong cao hoặc kháng sinh tĩnh mạch trong 90 ngày"),
      ],
    },
    {
      id: "icu-low", label: "Hồi sức – không nguy cơ đa kháng", tone: "community", setting: "icu",
      criteria: [icu("Viêm phổi bệnh viện tại hồi sức, không có nguy cơ vi khuẩn đa kháng.")],
      pathogens: [early],
      byt: ["r-icu-hap-nomdr"], intl: [],
    },
    {
      id: "icu-mdr", label: "Hồi sức – nặng hoặc có nguy cơ đa kháng", tone: "hospital", setting: "icu",
      criteria: [{ text: "Viêm phổi bệnh viện muộn, nặng, phải điều trị tại hồi sức.", source: BYT, ref: "Viêm phổi bệnh viện" }, ...risk.map(cite)],
      pathogens: [lateHap],
      byt: ["r-hap-late-icu", "r-icu-hap-mdr"], vn: rest.map((id) => hvVn("hap", id)), intl: [],
    },
  ] : [
    {
      id: "low", label: "Không nguy cơ đa kháng, đơn vị < 10% kháng", tone: "community", setting: "icu",
      criteria: [cite("Không có tiêu chuẩn đa kháng dưới đây và đơn vị có < 10% Gram âm kháng thuốc định dùng đơn trị.")],
      byt: ["r-vap-nomdr", "r-icu-hap-nomdr"], vn: [hvVn("vap", low)],
      intl: [hvIntl({ kind: "vap" }, "không yếu tố nguy cơ đa kháng")],
    },
    {
      id: "mdr", label: "Có nguy cơ đa kháng hoặc đơn vị > 10% kháng, MRSA", tone: "hospital", setting: "icu",
      criteria: risk.map(cite),
      pathogens: [lateVap],
      byt: ["r-vap-mdr", "r-icu-hap-mdr", "r-vap-mrsa", "r-vap-fungal", "r-vap-colistin"], vn: rest.map((id) => hvVn("vap", id)),
      intl: [
        hvIntl({ kind: "vap", gnUnit: true }, "đơn vị > 10% Gram âm kháng thuốc định đơn trị"),
        hvIntl({ kind: "vap", ivAbx: true }, "có yếu tố nguy cơ đa kháng"),
      ],
    },
  ];
};
const HV_ANTIBIOGRAM: StratAntibiogram = {
  gramNegative: { organisms: RESP_GN, codes: ["SAM", "TZP", "CAZ", "FEP", "IMP", "MEM", "AMK", "CIP", "LVX"] },
  gramPositive: { organisms: ["Staphylococcus aureus"], codes: ["FOX", "VAN", "LZD"] },
  defaultScope: "hscc",
  note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh. Khuyến cáo yêu cầu đối chiếu tỷ lệ kháng tại đơn vị: > 10% kháng thuốc định đơn trị thì phối hợp hai nhóm; MRSA > 10% hoặc chưa rõ thì thêm thuốc chống MRSA.",
};
const hvStrat = (kind: "hap" | "vap"): Stratification => ({
  diseaseIds: [kind === "hap" ? "v8-4" : "v8-5"],
  title: kind === "hap" ? "Viêm phổi bệnh viện – người lớn" : "Viêm phổi liên quan thở máy – người lớn",
  lead: `Phân tầng theo mức độ nặng và nguy cơ vi khuẩn đa kháng, MRSA như khuyến cáo ${HVVN}; đặt cạnh IDSA/ATS 2016.`,
  sampling: [
    ...(kind === "vap" ? [{ text: "Cấy định lượng dịch hút phế quản, rửa phế quản phế nang hoặc chải có bảo vệ.", source: BYT, ref: "Viêm phổi liên quan thở máy" }] : []),
    ...hvDiagnosis(kind).filter(({ role }) => role === "Bệnh phẩm" || role === "Cấy máu").map((i) => ({ text: `${i.role}: ${i.text}`, source: IDSA16, ref: i.ref })),
  ],
  pathogens: [
    { text: "Phần lớn là P. aeruginosa và vi khuẩn Gram âm khác; MRSA khi có yếu tố nguy cơ.", source: HVVN, ref: kind === "hap" ? "Bảng 3.1" : "Bảng 3.2" },
  ],
  columns: hvColumns(kind),
  ...(kind === "vap" ? { settingNote: "Viêm phổi liên quan thở máy điều trị tại khoa hồi sức." } : {}),
  principles: {
    source: `${IDSA16} – phạm vi bao phủ kinh nghiệm`,
    items: [...hvGrades(kind), ...hvPlan({ ...HV_BASE, kind, ivAbx: true }).notes.map((n) => ({ role: "Lưu ý", text: n, ref: kind === "hap" ? "Bảng 4" : "Bảng 3" }))],
  },
  antibiogram: HV_ANTIBIOGRAM,
  sources: [
    "Hội Hô hấp Việt Nam, Hội Hồi sức cấp cứu và Chống độc Việt Nam. Khuyến cáo chẩn đoán và điều trị viêm phổi bệnh viện, viêm phổi liên quan thở máy (10/2023).",
    "Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh (tác nhân thường gặp).",
    "Bộ Y tế. QĐ 1493/QĐ-BYT ngày 22/4/2015 – Hướng dẫn chẩn đoán và điều trị một số bệnh về hồi sức tích cực.",
    "Kalil AC và cs. IDSA/ATS 2016 – Clin Infect Dis 2016;63:e61–e111.",
  ],
});

export const STRATIFICATIONS: Stratification[] = [SEPSIS, CAP, hvStrat("hap"), hvStrat("vap")];

export function stratificationFor(diseaseId: string): Stratification | undefined {
  return STRATIFICATIONS.find(({ diseaseIds }) => diseaseIds.includes(diseaseId));
}
