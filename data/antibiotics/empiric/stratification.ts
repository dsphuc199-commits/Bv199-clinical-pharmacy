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
import { EAU_UROLOGY_FORMS } from "../../../components/antibiotics/empiric/urology-eau2026";
import { empPlan, type Sev } from "../../../components/antibiotics/empiric/gnb-bsi-intl";
import { CUTI_CRITERIA, DURATION_NOTES, SWITCH_ROWS, durationRows } from "../../../components/antibiotics/empiric/uti-idsa2025";

export type StratCite = { text: string; source: string; ref: string };
/** parts/join: từng thuốc của phương án module Việt Nam và cách nối ("and" = phối hợp, "or" = chọn một thuốc);
    giao diện dùng để xuống dòng, không tách chuỗi theo chữ "hoặc" (vì chữ này có thể nằm trong câu liều). */
export type StratIntl = { source: string; lead?: string; items: (RxItem & { preparation?: string; parts?: string[]; join?: "and" | "or" })[]; notes?: string[] };
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
  /** Nhóm đặc biệt của hướng dẫn quốc tế không đặt thành cột (vd. EAU: tái phát, khuẩn niệu không triệu chứng). */
  extras?: { title: string; criteria?: string; blocks: StratIntl[] }[];
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
/* Chỉ cụm "chọn một thuốc" (vd. levofloxacin hoặc moxifloxacin). KHÔNG dùng "không dùng cả hai": câu đó ở ward-ctax-azi
   nghĩa là cefotaxim thay ceftriaxon, còn cefotaxim + azithromycin vẫn là phối hợp. */
const ONE_OF = /chọn một thuốc/iu;
/* Phác đồ trong module Việt Nam -> dòng bảng; giữ nguyên thuốc, liều, đường dùng và chú thích liều. */
function moduleBlock(source: string, regimens: ModuleRegimen[], lead?: string): StratIntl {
  return {
    source,
    lead,
    items: regimens.map((r) => {
      const cautions = r.drugs.map((d) => d.caution && cleanRef(d.caution)).filter(Boolean);
      const parts = r.drugs.map((d) => `${d.name}: ${cleanRef(d.dose)}${d.route && d.route !== "IV" ? ` (${d.route})` : ""}`);
      const join = ONE_OF.test(r.indication ?? "") ? "or" as const : "and" as const;
      return {
        role: r.name,
        text: parts.join(join === "or" ? " hoặc " : " + "),
        parts,
        join,
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

/* ======================= NHIỄM KHUẨN TIẾT NIỆU ======================= */
/* Việt Nam: QĐ 708 chương Nhiễm khuẩn tiết niệu (văn bản Việt Nam duy nhất có trong ứng dụng cho nhóm này).
   Quốc tế: EAU 2026 (module urology-eau2026) và IDSA 2025 NKTN phức tạp (hàm empPlan, durationRows).
   Cột Việt Nam và cột quốc tế tách riêng vì hai nguồn phân tầng khác nhau; không ghép thuốc giữa các nguồn. */
const EAU = "EAU 2026";
const IDSA25 = "IDSA 2025";
type FormLike = { headline: string; blocks: { title: string; lead?: string; items: RxItem[] }[]; avoid: RxItem[]; notes: string[] };
/** Mỗi nhóm thuốc của module thành một khối, giữ nguyên tiêu đề nhóm (vd. "Chỉ khi tỷ lệ E. coli kháng tại chỗ < 20%"). */
function formBlocks(src: string, label: string, f: FormLike): StratIntl[] {
  const out: StratIntl[] = f.blocks.filter((b) => b.items.length > 0).map((b, i) => ({
    source: `${src} – ${label}${b.title ? `: ${b.title}` : ""}`,
    lead: [i === 0 ? f.headline : "", b.lead ?? ""].filter(Boolean).join(" ") || undefined,
    items: b.items,
  }));
  if (f.avoid.length) out.push({ source: `${src} – ${label}: không dùng hoặc tránh`, items: f.avoid });
  if (f.notes.length) out.push({ source: `${src} – ${label}: lưu ý`, items: f.notes.map((text) => ({ role: "Lưu ý", text, ref: "notes" })) });
  return out;
}
const eauForm = (disease: string, id: string) => EAU_UROLOGY_FORMS[disease].find((f) => f.id === id)!;
const eau = (disease: string, id: string) => { const f = eauForm(disease, id); return formBlocks(EAU, f.label, f); };
const eauCite = (disease: string, id: string): StratCite => ({ text: eauForm(disease, id).criteria, source: EAU, ref: "Urological Infections 2026" });
const idsaCuti = (sev: Sev, oral: boolean, label: string): StratIntl[] =>
  formBlocks(IDSA25, label, empPlan({ sev, oral, priorEsbl: false, priorFqR: false, fq12m: false, priorPtzR: false, priorTmpR: false }));
const IDSA_CUTI_CRITERIA: StratCite = { text: CUTI_CRITERIA, source: IDSA25, ref: "Introduction" };
const IDSA_PRINCIPLES: StratIntl = {
  source: `${IDSA25} – thời gian điều trị và chuyển đường uống`,
  items: [...durationRows({ bacteremia: true, prostatitis: true }), ...SWITCH_ROWS, ...DURATION_NOTES.map((text) => ({ role: "Lưu ý", text, ref: "CQ3" }))],
};
const UTI_ANTIBIOGRAM = (codes: string[]): StratAntibiogram => ({
  gramNegative: { organisms: ["Escherichia coli", "Klebsiella pneumoniae", "Proteus mirabilis", "Enterobacter spp. (gồm K. aerogenes)", "Pseudomonas aeruginosa"], codes },
  gramPositive: { organisms: ["Enterococcus spp."], codes: ["AMP", "VAN", "LZD"] },
  defaultScope: "toan-vien",
  note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; bảng không tách riêng mẫu nước tiểu, chỉ dùng để định hướng.",
});
const SRC_708_UTI = "Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh, Nhiễm khuẩn tiết niệu.";
const SRC_EAU_UI = "European Association of Urology. EAU Guidelines on Urological Infections, Limited Update March 2026.";
const SRC_EAU_URO = "European Association of Urology. EAU Guidelines on Urolithiasis, Limited Update March 2026.";
const SRC_IDSA_CUTI = "Trautner BW và cs. IDSA 2025 Guideline Update on Complicated Urinary Tract Infections.";

const CYSTITIS: Stratification = {
  diseaseIds: ["v8-16"],
  title: "Viêm bàng quang cấp không biến chứng – người lớn",
  lead: "Phân tầng theo đối tượng như QĐ 708 (thông thường, phụ nữ có thai, nam giới); đặt cạnh EAU 2026.",
  sampling: [
    { text: "Chỉ cấy nước tiểu khi có nguyên nhân thuận lợi, không đáp ứng, tái phát hoặc nam giới.", source: BYT, ref: "tr. 249" },
    { text: eauForm("v8-16", "women").notes[0], source: EAU, ref: "UI 3.4" },
  ],
  pathogens: [
    { text: "Gram âm khoảng 90%: E. coli 70–80%, Proteus 10–15%, Klebsiella 5–10%.", source: BYT, ref: "tr. 248" },
    { text: "S. saprophyticus 5–10%; P. aeruginosa, S. aureus 1–2%.", source: BYT, ref: "tr. 248" },
  ],
  columns: [
    { id: "vn-common", label: "Viêm bàng quang cấp thông thường", tone: "community",
      criteria: [{ text: "Hội chứng bàng quang; thường không sốt hoặc sốt < 38 °C.", source: BYT, ref: "tr. 248" }],
      byt: ["r-cy-tmp", "r-cy-cephalexin", "r-cy-nitro", "r-cy-amoxclav", "r-cy-fq"], intl: [] },
    { id: "vn-preg", label: "Phụ nữ có thai", tone: "special",
      criteria: [{ text: "Viêm bàng quang cấp ở phụ nữ có thai.", source: BYT, ref: "tr. 249–250" }],
      byt: ["r-cy-preg-cephalexin", "r-cy-preg-nitro", "r-cy-preg-amoxclav"], intl: [] },
    { id: "vn-male", label: "Nam giới", tone: "hospital",
      criteria: [{ text: "Viêm bàng quang cấp ở nam giới; tìm nguyên nhân liên quan (viêm tuyến tiền liệt, viêm tinh hoàn, mào tinh hoàn).", source: BYT, ref: "tr. 250" }],
      byt: ["r-cy-male-tmp", "r-cy-male-cephalexin", "r-cy-male-amoxclav"], intl: [] },
    { id: "eau-women", label: "Phụ nữ", tone: "community", criteria: [eauCite("v8-16", "women")], byt: [], intl: eau("v8-16", "women") },
    { id: "eau-preg", label: "Phụ nữ có thai", tone: "special", criteria: [eauCite("v8-16", "pregnant")], byt: [], intl: eau("v8-16", "pregnant") },
    { id: "eau-men", label: "Nam giới", tone: "hospital", criteria: [eauCite("v8-16", "men")], byt: [], intl: eau("v8-16", "men") },
  ],
  settingNote: "Điều trị ngoại trú, kháng sinh đường uống.",
  extras: [
    { title: `${EAU} – ${eauForm("v8-16", "recurrent").label}`, criteria: eauForm("v8-16", "recurrent").criteria, blocks: eau("v8-16", "recurrent") },
    { title: `${EAU} – ${eauForm("v8-16", "abu").label}`, criteria: eauForm("v8-16", "abu").criteria, blocks: eau("v8-16", "abu") },
    { title: `${EAU} – ${eauForm("v8-16", "fungal").label}`, criteria: eauForm("v8-16", "fungal").criteria, blocks: eau("v8-16", "fungal") },
  ],
  principles: { source: `${EAU} – nguyên tắc`, items: eauForm("v8-16", "women").notes.slice(1).map((text) => ({ role: "Lưu ý", text, ref: "UI 3.4" })) },
  antibiogram: UTI_ANTIBIOGRAM(["AMP", "AMC", "KZ", "CXM", "SXT", "CIP", "LVX"]),
  sources: [SRC_708_UTI, SRC_EAU_UI],
};

const PYELONEPHRITIS: Stratification = {
  diseaseIds: ["v8-17"],
  title: "Viêm thận bể thận cấp – người lớn",
  lead: "Phân tầng theo mức độ (ngoại trú uống / nội trú tiêm) và phụ nữ có thai như QĐ 708; đặt cạnh EAU 2026 và IDSA 2025.",
  sampling: [
    { text: "Cấy nước tiểu; cấy máu nếu sốt cao. Bắt đầu kháng sinh ngay trong khi chờ kết quả.", source: BYT, ref: "tr. 235" },
    { text: "Siêu âm tìm giãn đài bể thận, sỏi, khối chèn ép.", source: BYT, ref: "tr. 235" },
    ...eauForm("v8-17", "outpatient").notes.filter((n) => /cấy/iu.test(n)).map((text) => ({ text, source: EAU, ref: "UI 3.6" })),
  ],
  pathogens: [
    { text: "Gram âm: E. coli 70–80%, Klebsiella, Proteus mirabilis, Enterobacter.", source: BYT, ref: "tr. 234" },
    { text: "Gram dương dưới 10%: Enterococcus, Staphylococcus.", source: BYT, ref: "tr. 234" },
  ],
  columns: [
    { id: "vn-oral", label: "Nhẹ – ngoại trú, kháng sinh uống", tone: "community",
      criteria: [{ text: "Nhẹ: ngoại trú, kháng sinh uống.", source: BYT, ref: "tr. 235–236" }],
      byt: ["r-py-oral-bl", "r-py-oral-fq"], intl: [] },
    { id: "vn-iv", label: "Sốt cao, rét run – nội trú, kháng sinh tiêm", tone: "hospital",
      criteria: [{ text: "Sốt cao rét run: nội trú, kháng sinh tiêm.", source: BYT, ref: "tr. 235–236" }],
      byt: ["r-py-iv-bl", "r-py-iv-ceph", "r-py-iv-carba", "r-py-iv-fq", "r-py-aminoglyc", "r-py-gramneg", "r-py-grampos"], intl: [] },
    { id: "vn-preg", label: "Phụ nữ có thai", tone: "special",
      criteria: [{ text: "Thai phụ: thận trọng; không dùng fluoroquinolon.", source: BYT, ref: "tr. 237–238" }],
      byt: ["r-py-preg"], intl: [] },
    { id: "intl-out", label: "Ngoại trú, không sepsis", tone: "community",
      criteria: [eauCite("v8-17", "outpatient"), IDSA_CUTI_CRITERIA], byt: [],
      intl: [...eau("v8-17", "outpatient"), ...idsaCuti("none", true, "không sepsis, điều trị đường uống")] },
    { id: "intl-in", label: "Nhập viện, không sepsis", tone: "hospital",
      criteria: [eauCite("v8-17", "inpatient")], byt: [],
      intl: [...eau("v8-17", "inpatient"), ...idsaCuti("none", false, "không sepsis, đường tĩnh mạch")] },
    { id: "intl-severe", label: "Sepsis hoặc sốc nhiễm khuẩn", tone: "special",
      criteria: [{ text: "Nhiễm khuẩn tiết niệu phức tạp kèm sepsis hoặc sốc nhiễm khuẩn.", source: IDSA25, ref: "CQ1" }], byt: [],
      intl: [...idsaCuti("sepsis", false, "sepsis không sốc"), ...idsaCuti("shock", false, "sốc nhiễm khuẩn")] },
  ],
  settingNote: "QĐ 708 dùng chung phác đồ cho khoa hồi sức và không hồi sức; sốt cao, rét run điều trị nội trú bằng kháng sinh tiêm.",
  extras: [
    { title: `${EAU} – ${eauForm("v8-17", "pregnant").label}`, criteria: eauForm("v8-17", "pregnant").criteria, blocks: eau("v8-17", "pregnant") },
    { title: `${EAU} – ${eauForm("v8-17", "men").label}`, criteria: eauForm("v8-17", "men").criteria, blocks: eau("v8-17", "men") },
  ],
  principles: IDSA_PRINCIPLES,
  antibiogram: UTI_ANTIBIOGRAM(["AMP", "AMC", "SAM", "CXM", "CTX", "CRO", "CAZ", "FEP", "TZP", "IMP", "MEM", "CN/GEN", "AMK", "CIP", "LVX", "SXT"]),
  sources: [SRC_708_UTI, SRC_EAU_UI, SRC_IDSA_CUTI],
};

const COMPLICATED_UTI: Stratification = {
  diseaseIds: ["v8-2"],
  title: "Nhiễm khuẩn tiết niệu phức tạp – người lớn",
  lead: "QĐ 708 có phác đồ cho sỏi thận tiết niệu có biến chứng nhiễm khuẩn; đặt cạnh IDSA 2025 (theo mức độ nặng) và EAU 2026.",
  sampling: [
    { text: "Siêu âm phát hiện sỏi, tắc nghẽn, ứ nước, ứ mủ; CT phân biệt áp xe nhu mô.", source: BYT, ref: "tr. 241" },
    { text: "Cấy máu nếu sốt > 38 °C kèm rét run. Không chụp UIV khi đang nhiễm khuẩn nặng hoặc suy thận cấp.", source: BYT, ref: "tr. 241" },
    ...eauForm("v8-2", "systemic").notes.filter((n) => /cấy máu/iu.test(n)).map((text) => ({ text, source: EAU, ref: "UI 3.7" })),
  ],
  pathogens: [{ text: "E. coli, Proteus, Klebsiella; vi khuẩn tiết urease tạo sỏi struvit.", source: BYT, ref: "tr. 240–241" }],
  columns: [
    { id: "vn-stone", label: "Sỏi thận tiết niệu có biến chứng nhiễm khuẩn", tone: "hospital",
      criteria: [{ text: "Sỏi thận tiết niệu có biến chứng nhiễm khuẩn. Có viêm thận bể thận cấp: theo bài viêm thận bể thận cấp.", source: BYT, ref: "tr. 242–243" }],
      byt: ["r-stone-complic-bl", "r-stone-complic-fq"], intl: [] },
    { id: "intl-none", label: "Không sepsis", tone: "community",
      criteria: [IDSA_CUTI_CRITERIA, eauCite("v8-2", "systemic")], byt: [],
      intl: [...idsaCuti("none", false, "không sepsis"), ...eau("v8-2", "systemic")] },
    { id: "intl-sepsis", label: "Sepsis không sốc", tone: "hospital",
      criteria: [{ text: "Nhiễm khuẩn tiết niệu phức tạp kèm sepsis, chưa sốc.", source: IDSA25, ref: "CQ1" }], byt: [],
      intl: idsaCuti("sepsis", false, "sepsis không sốc") },
    { id: "intl-shock", label: "Sốc nhiễm khuẩn, bệnh nặng hoặc nghi tắc nghẽn", tone: "special",
      criteria: [{ text: "Sốc nhiễm khuẩn.", source: IDSA25, ref: "CQ1" }, eauCite("v8-2", "critical")], byt: [],
      intl: [...idsaCuti("shock", false, "sốc nhiễm khuẩn"), ...eau("v8-2", "critical")] },
  ],
  settingNote: "QĐ 708 dùng chung phác đồ cho khoa hồi sức và không hồi sức.",
  extras: ["stone-sepsis", "stone-proc", "struvite", "cauti", "abp", "fungal"].map((id) => ({
    title: `${EAU} – ${eauForm("v8-2", id).label}`, criteria: eauForm("v8-2", id).criteria, blocks: eau("v8-2", id),
  })),
  principles: IDSA_PRINCIPLES,
  antibiogram: UTI_ANTIBIOGRAM(["AMP", "AMC", "SAM", "CXM", "CTX", "CRO", "CAZ", "FEP", "TZP", "IMP", "MEM", "CN/GEN", "AMK", "CIP", "LVX", "SXT"]),
  sources: [SRC_708_UTI, SRC_EAU_UI, SRC_EAU_URO, SRC_IDSA_CUTI],
};

/* ======================= Ổ BỤNG ======================= */
/* Viêm phúc mạc thứ phát: QĐ 708 chương 5. Chưa có khuyến cáo quốc tế đã trích và đối chiếu (SIS 2024 mới xác minh
   trích dẫn – international.ts), nên không có cột quốc tế; tab Quốc tế giữ ghi chú khoảng trống hiện có. */
const PERITONITIS: Stratification = {
  diseaseIds: ["v8-21"],
  title: "Viêm phúc mạc thứ phát – người lớn",
  lead: "Phân tầng theo mức độ như QĐ 708 chương 5 (viêm phúc mạc thứ phát; trường hợp nặng).",
  sampling: [
    { text: "Chọc dịch ổ bụng: bạch cầu > 500/mm³ và/hoặc bạch cầu trung tính > 250/mm³; soi, cấy dịch.", source: BYT, ref: "tr. 159" },
    { text: "Siêu âm, X-quang bụng đứng tìm nguyên nhân (liềm hơi, mức nước – hơi).", source: BYT, ref: "tr. 159" },
  ],
  pathogens: [
    { text: "Thứ phát: E. coli, K. pneumoniae, B. fragilis; có thể Streptococcus, Enterococcus, Clostridium.", source: BYT, ref: "tr. 158" },
    { text: "Viêm phúc mạc thì ba: trực khuẩn mủ xanh, Gram âm kháng thuốc, có thể C. albicans.", source: BYT, ref: "tr. 158" },
  ],
  columns: [
    { id: "vn-std", label: "Viêm phúc mạc thứ phát", tone: "community",
      criteria: [{ text: "Viêm phúc mạc thứ phát.", source: BYT, ref: "Viêm phúc mạc, mục 4.2" }],
      byt: ["r-peri-sec-1"], intl: [] },
    { id: "vn-severe", label: "Trường hợp nặng", tone: "hospital",
      criteria: [{ text: "Viêm phúc mạc thứ phát – trường hợp nặng.", source: BYT, ref: "Viêm phúc mạc, mục 4.2" }],
      byt: ["r-peri-sec-2"], intl: [] },
  ],
  settingNote: "QĐ 708 dùng chung phác đồ cho khoa hồi sức và không hồi sức.",
  principles: { source: "", items: [] },
  antibiogram: {
    gramNegative: { organisms: ["Escherichia coli", "Klebsiella pneumoniae", "Enterobacter spp. (gồm K. aerogenes)", "Pseudomonas aeruginosa"], codes: ["TZP", "CTX", "CRO", "FEP", "IMP", "MEM", "AMK", "CIP"] },
    gramPositive: { organisms: ["Enterococcus spp."], codes: ["AMP", "VAN", "LZD"] },
    defaultScope: "khoi-ngoai",
    note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; bảng không tách riêng dịch ổ bụng, chỉ dùng để định hướng.",
  },
  sources: ["Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh, Viêm phúc mạc."],
};

export const STRATIFICATIONS: Stratification[] = [SEPSIS, CAP, hvStrat("hap"), hvStrat("vap"), CYSTITIS, PYELONEPHRITIS, COMPLICATED_UTI, PERITONITIS];

export function stratificationFor(diseaseId: string): Stratification | undefined {
  return STRATIFICATIONS.find(({ diseaseIds }) => diseaseIds.includes(diseaseId));
}

/** Có khung phân tầng quốc tế (cột có khuyến cáo quốc tế): khi không có, tab Quốc tế giữ nội dung cũ (vd. ghi chú khoảng trống). */
export function hasIntlStratification(diseaseId: string): boolean {
  return Boolean(stratificationFor(diseaseId)?.columns.some((c) => c.intl.length > 0 || c.links));
}
