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
import * as IAI from "../../../components/antibiotics/empiric/iai-intl";
import * as TG from "../../../components/antibiotics/empiric/tg18-intl";
import * as CNS from "../../../components/antibiotics/empiric/cns-intl";
import * as IE from "../../../components/antibiotics/empiric/ie-intl";
import { compactStrat } from "./strat-compact";
import * as ENT from "../../../components/antibiotics/empiric/ent-strat";
import * as EX from "../../../components/antibiotics/empiric/ent-extra-intl";
import { ACE_SEVERE, RED_FLAGS, SEV_TIP, SIRS_IDSA, sstiPlan, type SstiIn, type SstiOut } from "../../../components/antibiotics/empiric/ssti-idsa2014-ace2026";

export type StratCite = { text: string; source: string; ref: string };
/** parts/join: từng thuốc của phương án module Việt Nam và cách nối ("and" = phối hợp, "or" = chọn một thuốc);
    giao diện dùng để xuống dòng, không tách chuỗi theo chữ "hoặc" (vì chữ này có thể nằm trong câu liều). */
export type StratIntl = { source: string; lead?: string; items: (RxItem & { preparation?: string; administration?: string; course?: string; parts?: string[]; join?: "and" | "or" })[]; notes?: string[] };
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
  /** Ghi chú ngắn cuối ô kháng sinh (vd. quy tắc phối hợp metronidazol của phác đồ đường mật). */
  note?: string;
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
  /** Hàng chung "Mức độ nặng" (tab Việt Nam), vd. phân độ nhiễm khuẩn đường mật. */
  severity?: { title: string; items: StratCite[] };
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
/* Viêm phúc mạc thứ phát: QĐ 708 chương 5 (cột Việt Nam). Quốc tế: SIS 2024 (lựa chọn thuốc, mức khuyến cáo, thời gian)
   và WSES 2021 (liều) – module iai-intl; phân tầng nguy cơ thấp / cao / sau mổ theo SIS. Không ghép thuốc giữa hai họ nguồn. */
const PERITONITIS: Stratification = {
  diseaseIds: ["v8-21"],
  title: "Viêm phúc mạc thứ phát – người lớn",
  lead: "Phân tầng theo mức độ như QĐ 708 chương 5 (viêm phúc mạc thứ phát; trường hợp nặng); quốc tế phân tầng nguy cơ theo SIS 2024.",
  sampling: [
    { text: "Chọc dịch ổ bụng: bạch cầu > 500/mm³ và/hoặc bạch cầu trung tính > 250/mm³; soi, cấy dịch.", source: BYT, ref: "tr. 159" },
    { text: "Luôn lấy bệnh phẩm tại ổ nhiễm khi nhiễm khuẩn liên quan chăm sóc y tế, nguy cơ vi khuẩn kháng thuốc hoặc bệnh nặng; cấy máu trước kháng sinh ở người bệnh nặng.", source: IAI.WSES21, ref: "Principles of antibiotic management" },
    { text: "Siêu âm, X-quang bụng đứng tìm nguyên nhân (liềm hơi, mức nước – hơi).", source: BYT, ref: "tr. 159" },
  ],
  pathogens: [
    { text: "Thứ phát: E. coli, K. pneumoniae, B. fragilis; có thể Streptococcus, Enterococcus, Clostridium.", source: BYT, ref: "tr. 158" },
    { text: "Viêm phúc mạc thì ba: trực khuẩn mủ xanh, Gram âm kháng thuốc, có thể C. albicans.", source: BYT, ref: "tr. 158" },
    { text: "Phác đồ kinh nghiệm phủ Enterobacterales, liên cầu hiếu khí và vi khuẩn kỵ khí bắt buộc; nhiễm khuẩn liên quan chăm sóc y tế thêm tụ cầu, Enterococcus, Candida.", source: IAI.SIS24, ref: "Introduction" },
  ],
  columns: [
    { id: "vn-std", label: "Viêm phúc mạc thứ phát", tone: "community",
      criteria: [{ text: "Viêm phúc mạc thứ phát.", source: BYT, ref: "Viêm phúc mạc, mục 4.2" }],
      byt: ["r-peri-sec-1"], intl: [] },
    { id: "vn-severe", label: "Trường hợp nặng", tone: "hospital",
      criteria: [{ text: "Viêm phúc mạc thứ phát – trường hợp nặng.", source: BYT, ref: "Viêm phúc mạc, mục 4.2" }],
      byt: ["r-peri-sec-2"], intl: [] },
    { id: "iai-low", label: "Cộng đồng – nguy cơ thấp", tone: "community",
      criteria: [{ text: IAI.IAI_LOWER_RISK, source: IAI.SIS24, ref: "Introduction" }],
      byt: [], intl: [
        { source: `${IAI.SIS24} – lựa chọn thuốc`, items: IAI.IAI_LOW_SIS },
        { source: `${IAI.WSES21} – liều (chức năng thận bình thường)`, items: IAI.IAI_LOW_WSES },
      ] },
    { id: "iai-high", label: "Cộng đồng – nguy cơ cao", tone: "hospital",
      criteria: [{ text: IAI.IAI_HIGHER_RISK, source: IAI.SIS24, ref: "Introduction" }],
      byt: [], intl: [
        { source: `${IAI.SIS24} – lựa chọn thuốc`, lead: IAI.IAI_HIGH_LEAD, items: IAI.IAI_HIGH_SIS },
        { source: `${IAI.WSES21} – liều (chức năng thận bình thường)`, items: IAI.IAI_HIGH_WSES },
      ] },
    { id: "iai-postop", label: "Sau mổ / liên quan chăm sóc y tế", tone: "special",
      criteria: [{ text: IAI.IAI_POSTOP, source: IAI.WSES21, ref: "Post-operative peritonitis" }],
      byt: [], intl: [
        { source: `${IAI.SIS24} – lựa chọn thuốc`, lead: IAI.IAI_POSTOP_LEAD, items: IAI.IAI_POSTOP_SIS },
        { source: `${IAI.WSES21} – liều (chức năng thận bình thường)`, items: IAI.IAI_POSTOP_WSES },
      ], note: IAI.IAI_POSTOP_NOTE },
  ],
  settingNote: "QĐ 708 dùng chung phác đồ cho khoa hồi sức và không hồi sức.",
  principles: { source: `${IAI.SIS24} – kiểm soát ổ nhiễm, thời gian, quản lý kháng sinh`, items: IAI.IAI_PRINCIPLES },
  antibiogram: {
    gramNegative: { organisms: ["Escherichia coli", "Klebsiella pneumoniae", "Enterobacter spp. (gồm K. aerogenes)", "Pseudomonas aeruginosa"], codes: ["TZP", "CTX", "CRO", "FEP", "IMP", "MEM", "AMK", "CIP"] },
    gramPositive: { organisms: ["Enterococcus spp."], codes: ["AMP", "VAN", "LZD"] },
    defaultScope: "khoi-ngoai",
    note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; bảng không tách riêng dịch ổ bụng, chỉ dùng để định hướng.",
  },
  sources: ["Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh, Viêm phúc mạc.", ...IAI.IAI_SOURCES],
};

/* Nhiễm khuẩn đường mật: QĐ 708 chương 5 (Bảng II.14 phân độ, Bảng II.15 thuốc). Bảng II.15 chia "lựa chọn số 1 / số 2",
   không gắn thuốc theo từng độ nặng → cột theo Bảng II.15, phân độ và thời gian ở hàng chung.
   Liều và thời gian: giao diện dùng bản HĐT&ĐT đã công bố (lib/antibiotics/biliary-protocol) khi có.
   Tab Quốc tế: Tokyo Guidelines 2018 (module tg18-intl), cột theo độ nặng mắc phải cộng đồng và cột liên quan chăm sóc y tế. */
const BILIARY: Stratification = {
  diseaseIds: ["v8-24"],
  title: "Nhiễm khuẩn đường mật – người lớn",
  lead: "Phân độ nặng và thuốc theo QĐ 708 chương 5 (lựa chọn số 1, số 2).",
  sampling: [{ text: "Chọn kháng sinh bài tiết tốt vào đường mật. Có thể điều trị theo kinh nghiệm trong khi chờ kháng sinh đồ.", source: BYT, ref: "mục 4a, tr. 182–183" }, ...TG.TG18_SAMPLING],
  pathogens: [
    { text: "Cộng đồng: E. coli, Klebsiella, Enterococcus. Thể nặng: đa vi khuẩn, có kỵ khí (Clostridium, Bacteroides).", source: BYT, ref: "tr. 181" },
    { text: "Bệnh viện: MRSA, Enterococcus kháng vancomycin, Pseudomonas.", source: BYT, ref: "tr. 181" },
    ...TG.TG18_PATHOGENS,
  ],
  severity: {
    title: "Mức độ nặng và lựa chọn theo mức độ (QĐ 708)",
    items: [
      { text: "Nhẹ (I): không suy tạng, có đáp ứng điều trị ban đầu.", source: BYT, ref: "Bảng II.14, tr. 182" },
      { text: "Trung bình (II): không suy tạng, không đáp ứng điều trị ban đầu.", source: BYT, ref: "Bảng II.14, tr. 182" },
      { text: "Nặng (III): có suy tạng, không đáp ứng điều trị ban đầu.", source: BYT, ref: "Bảng II.14, tr. 182" },
      { text: "Thể nhẹ: thường dùng ampicilin–sulbactam. Có thể dùng cephalosporin thế hệ 1 (cefazolin), thế hệ 2 (cefmetazol, cefotiam, oxacephem như flomoxef) hoặc thế hệ 3.", source: BYT, ref: "mục 4b, tr. 183" },
      { text: "Thể nặng: phối hợp kháng sinh điều trị vi khuẩn kỵ khí.", source: BYT, ref: "mục 4a, tr. 183" },
    ],
  },
  columns: [
    { id: "vn-choice-1", label: "Lựa chọn số 1", tone: "community",
      criteria: [{ text: "Lựa chọn số 1: penicilin phổ rộng + chất ức chế beta-lactamase, cephalosporin thế hệ 3–4, aminoglycosid, monobactam.", source: BYT, ref: "Bảng II.15, tr. 184" }],
      byt: ["r-bil-1-bli", "r-bil-1-pip", "r-bil-1-ceph", "r-bil-1-aminoglyc", "r-bil-1-azt", "r-bil-anaer"], intl: [] },
    { id: "vn-choice-2", label: "Lựa chọn số 2", tone: "hospital",
      criteria: [{ text: "Lựa chọn số 2: fluoroquinolon, carbapenem.", source: BYT, ref: "Bảng II.15, tr. 184" }],
      byt: ["r-bil-2-fq", "r-bil-2-carba", "r-bil-anaer"], intl: [],
      note: "Metronidazol (kỵ khí) phối hợp với fluoroquinolon; carbapenem không phối hợp thêm metronidazol." },
    { id: "tg-c1", label: "Cộng đồng · Độ I", tone: "community", criteria: TG.TG18_CRITERIA.c1, byt: [], intl: TG.TG18_COLUMNS.c1 },
    { id: "tg-c2", label: "Cộng đồng · Độ II", tone: "hospital", criteria: TG.TG18_CRITERIA.c2, byt: [], intl: TG.TG18_COLUMNS.c2 },
    { id: "tg-c3", label: "Cộng đồng · Độ III", tone: "special", criteria: TG.TG18_CRITERIA.c3, byt: [], intl: TG.TG18_COLUMNS.c3 },
    { id: "tg-hc", label: "Liên quan chăm sóc y tế · Độ I–III", tone: "special", criteria: TG.TG18_CRITERIA.hc, byt: [], intl: TG.TG18_COLUMNS.hc },
  ],
  settingNote: "QĐ 708 dùng chung phác đồ cho khoa hồi sức và không hồi sức. Tắc nghẽn: dẫn lưu qua da, stent qua ERCP hoặc phẫu thuật.",
  extras: TG.TG18_EXTRAS,
  principles: TG.TG18_PRINCIPLES,
  antibiogram: {
    gramNegative: { organisms: ["Escherichia coli", "Klebsiella pneumoniae", "Enterobacter spp. (gồm K. aerogenes)", "Pseudomonas aeruginosa"], codes: ["SAM", "TZP", "CRO", "CAZ", "FEP", "IMP", "MEM", "CN/GEN", "AMK", "CIP", "LVX"] },
    gramPositive: { organisms: ["Enterococcus spp."], codes: ["AMP", "VAN", "LZD"] },
    defaultScope: "toan-vien",
    note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; bảng không tách riêng dịch mật, chỉ dùng để định hướng.",
  },
  sources: ["Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh, Nhiễm khuẩn đường mật.", ...TG.TG18_SOURCES],
};

/* ======================= THẦN KINH TRUNG ƯƠNG ======================= */
/* Việt Nam: QĐ 708 (Bảng II.19 theo lứa tuổi, cơ địa) và QĐ 5642/2015 (cùng cách chia); mỗi cột giữ cả hai văn bản,
   QĐ 708 trước vì có liều người lớn cố định. Hàng "chấn thương, phẫu thuật, dò dịch não tủy" của QĐ 708 thuộc mặt bệnh
   dẫn lưu não thất (v8-38). Quốc tế: WHO 2025/2026 (mắc phải cộng đồng) và IDSA 2017 (liên quan chăm sóc y tế). */
const BYT5642 = "QĐ 5642/QĐ-BYT";
const CNS_ANTIBIOGRAM: StratAntibiogram = {
  gramNegative: { organisms: ["Escherichia coli", "Klebsiella pneumoniae", "Pseudomonas aeruginosa", "Acinetobacter baumannii"], codes: ["CRO", "CAZ", "FEP", "MEM", "AMK", "CIP"] },
  gramPositive: { organisms: ["Staphylococcus aureus", "Staphylococcus coagulase âm (CoNS)", "Streptococcus spp."], codes: ["FOX", "PEN", "CTX", "VAN", "LZD"] },
  defaultScope: "toan-vien",
  note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; bảng không tách riêng dịch não tủy, chỉ dùng để định hướng.",
};
const SRC_708_MEN = "Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh, Viêm màng não mủ.";
const SRC_5642_MEN = "Bộ Y tế. QĐ 5642/QĐ-BYT ngày 31/12/2015 – Hướng dẫn chẩn đoán và điều trị một số bệnh truyền nhiễm, Viêm màng não nhiễm khuẩn.";

const MENINGITIS: Stratification = {
  diseaseIds: ["v8-36"],
  title: "Viêm màng não vi khuẩn – người lớn",
  lead: "Phân tầng theo lứa tuổi và cơ địa như QĐ 708 Bảng II.19 và QĐ 5642; quốc tế theo WHO 2025/2026 (mắc phải cộng đồng) và IDSA 2017 (liên quan chăm sóc y tế).",
  sampling: [
    { text: "Chọc dò dịch não tủy: bạch cầu đa nhân tăng, protein > 1 g/l, glucose < 2,2 mmol/l; nhuộm Gram, cấy, PCR. Cấy máu.", source: BYT, ref: "tr. 230" },
  ],
  pathogens: [
    { text: "Người lớn: phế cầu, não mô cầu, liên cầu. Listeria ở người già.", source: BYT, ref: "tr. 229" },
  ],
  columns: [
    { id: "vn-1850", label: "18–50 tuổi", tone: "community",
      criteria: [{ text: "Người lớn 18–50 tuổi.", source: BYT, ref: "Bảng II.19, tr. 231" }],
      pathogens: [{ text: "Phế cầu, liên cầu, não mô cầu.", source: BYT, ref: "Bảng II.19, tr. 231" }],
      byt: ["r-men-18-50-first", "r-men-18-50-alt", "r-vmn42-18to50-first", "r-vmn42-18to50-alt"], intl: [] },
    { id: "vn-over50", label: "Trên 50 tuổi", tone: "hospital",
      criteria: [{ text: "Người lớn trên 50 tuổi. Ampicilin chọn khi nghi Listeria.", source: BYT, ref: "Bảng II.19, tr. 231" }],
      pathogens: [{ text: "Phế cầu, não mô cầu, Listeria, kỵ khí Gram âm.", source: BYT, ref: "Bảng II.19, tr. 231" }],
      byt: ["r-men-50-first", "r-men-50-alt", "r-vmn42-over50-first", "r-vmn42-over50-alt"], intl: [] },
    { id: "vn-immuno", label: "Suy giảm miễn dịch", tone: "special",
      criteria: [{ text: "Người bệnh suy giảm miễn dịch.", source: BYT, ref: "Bảng II.19, tr. 231" }],
      pathogens: [{ text: "Phế cầu, não mô cầu, Listeria, kỵ khí Gram âm.", source: BYT, ref: "Bảng II.19, tr. 231" }],
      byt: ["r-men-immuno-first", "r-men-immuno-alt", "r-vmn42-immuno-first", "r-vmn42-immuno-alt"], intl: [] },
    { id: "who-std", label: "Không có nguy cơ Listeria", tone: "community", criteria: CNS.MEN_WHO_CRIT.std, byt: [], intl: CNS.MEN_WHO_STD },
    { id: "who-listeria", label: "Có nguy cơ Listeria", tone: "hospital", criteria: CNS.MEN_WHO_CRIT.listeria, byt: [], intl: CNS.MEN_WHO_LISTERIA },
    { id: "cns-trauma", label: "Sau chấn thương, phẫu thuật, dò dịch não tủy", tone: "special",
      criteria: [{ text: "Sau chấn thương, phẫu thuật sọ não, dò dịch não tủy.", source: BYT5642, ref: "mục 4.2a, tr. 19" }, ...CNS.MEN_WHO_CRIT.postop],
      pathogens: [{ text: "Phế cầu, tụ cầu, kỵ khí Gram âm.", source: BYT5642, ref: "mục 4.2a, tr. 19" }],
      byt: ["r-vmn42-trauma-first", "r-vmn42-trauma-alt"], intl: [],
      links: [{ diseaseId: "v8-38", label: "Viêm não thất, viêm màng não liên quan chăm sóc y tế (IDSA 2017)" }],
      note: "QĐ 708 xếp hàng này vào mặt bệnh nhiễm khuẩn dẫn lưu não thất." },
  ],
  settingNote: "QĐ 708 và QĐ 5642 dùng chung phác đồ cho khoa hồi sức và không hồi sức.",
  extras: CNS.MEN_WHO_EXTRAS,
  principles: CNS.MEN_WHO_PRINCIPLES,
  antibiogram: CNS_ANTIBIOGRAM,
  sources: [SRC_708_MEN, SRC_5642_MEN, ...CNS.CNS_SOURCES.who, CNS.CNS_SOURCES.idsa],
};

const VENTRICULITIS: Stratification = {
  diseaseIds: ["v8-38"],
  title: "Nhiễm khuẩn dẫn lưu não thất, viêm màng não sau phẫu thuật – người lớn",
  lead: "Việt Nam theo hàng chấn thương, phẫu thuật, dò dịch não tủy của QĐ 708 Bảng II.19; quốc tế theo IDSA 2017 (viêm não thất, viêm màng não liên quan chăm sóc y tế).",
  sampling: [
    { text: "Chọc dò dịch não tủy: nhuộm Gram, cấy, PCR. Cấy máu.", source: BYT, ref: "tr. 230" },
    ...CNS.VENT_SAMPLING,
  ],
  pathogens: [
    { text: "Sau chấn thương, phẫu thuật, dò dịch não tủy: phế cầu, tụ cầu, kỵ khí Gram âm.", source: BYT, ref: "tr. 229, 231" },
  ],
  columns: [
    { id: "vn-postsurg", label: "Chấn thương, phẫu thuật, dò dịch não tủy", tone: "special",
      criteria: [{ text: "Viêm màng não sau chấn thương, phẫu thuật, dò dịch não tủy (gồm nhiễm khuẩn dẫn lưu não thất).", source: BYT, ref: "Bảng II.19, tr. 231" }],
      byt: ["r-men-postsurg-first", "r-men-postsurg-alt"], intl: [] },
    { id: "idsa-empiric", label: "Kinh nghiệm", tone: "hospital", criteria: CNS.VENT_CRIT.empiric, byt: [], intl: CNS.VENT_EMPIRIC },
    { id: "idsa-allergy", label: "Phản vệ với beta-lactam", tone: "special", criteria: CNS.VENT_CRIT.allergy, byt: [], intl: CNS.VENT_ALLERGY },
  ],
  settingNote: "QĐ 708 dùng chung phác đồ cho khoa hồi sức và không hồi sức.",
  extras: CNS.VENT_EXTRAS,
  principles: CNS.VENT_PRINCIPLES,
  antibiogram: CNS_ANTIBIOGRAM,
  sources: [SRC_708_MEN, CNS.CNS_SOURCES.idsa],
};

/* ======================= VIÊM NỘI TÂM MẠC ======================= */
/* Việt Nam: QĐ 708 chương 3 (mục 4.2a–c: van tự nhiên, dị ứng penicilin, trẻ em, van nhân tạo < 1 năm, > 1 năm).
   Quốc tế: ESC 2023 Bảng khuyến cáo 10 (kinh nghiệm) qua module ie-intl; điều trị đích ở mục thu gọn. */
const ENDOCARDITIS: Stratification = {
  diseaseIds: ["v8-39"],
  title: "Viêm nội tâm mạc nhiễm khuẩn",
  lead: "Phân tầng theo loại van và thời gian sau thay van như QĐ 708 mục 4.2; quốc tế theo ESC 2023.",
  sampling: [
    { text: "Cấy máu nhiều lần (ba lần), cố gắng cấy khi đang sốt.", source: BYT, ref: "tr. 128–129" },
    { text: "Siêu âm tim: thấy sùi giúp xác định; không thấy cũng không loại trừ.", source: BYT, ref: "tr. 129" },
    ...IE.IE_ESC_SAMPLING,
  ],
  pathogens: [
    { text: "Đa số do liên cầu. Tụ cầu (hay gặp sau nạo phá thai, tổn thương van ba lá).", source: BYT, ref: "tr. 128" },
    { text: "Não mô cầu, phế cầu, lậu cầu; trực khuẩn Gram âm; nấm ở người suy giảm miễn dịch.", source: BYT, ref: "tr. 128" },
  ],
  columns: [
    { id: "vn-native", label: "Van tự nhiên", tone: "community",
      criteria: [{ text: "Van tự nhiên, trong khi chờ kết quả cấy máu. Dị ứng penicilin: dùng vancomycin.", source: BYT, ref: "mục 4.2a, tr. 129" }],
      byt: ["r-ie-native-1", "r-ie-native-2"], intl: [] },
    { id: "vn-early", label: "Van nhân tạo < 1 năm sau mổ", tone: "hospital",
      criteria: [{ text: "Van nhân tạo, xảy ra dưới 1 năm sau phẫu thuật thay van: phối hợp bốn kháng sinh.", source: BYT, ref: "mục 4.2b, tr. 129" }],
      byt: ["r-ie-prosth-early"], intl: [] },
    { id: "vn-late", label: "Van nhân tạo > 1 năm sau mổ", tone: "community",
      criteria: [{ text: "Van nhân tạo, xảy ra trên 1 năm sau phẫu thuật thay van: điều trị như van tự nhiên.", source: BYT, ref: "mục 4.2c, tr. 130" }],
      byt: ["r-ie-prosth-late"], intl: [] },
    { id: "vn-peds", label: "Trẻ em", tone: "special",
      criteria: [{ text: "Trẻ em: không vượt quá liều người lớn bình thường.", source: BYT, ref: "mục 4.2a, tr. 129" }],
      byt: ["r-ie-native-peds", "r-ie-prosth-early-peds"], intl: [] },
    { id: "esc-native", label: "Van tự nhiên cộng đồng, van nhân tạo ≥ 12 tháng", tone: "community", criteria: IE.IE_ESC_CRIT.native, byt: [], intl: IE.IE_ESC_NATIVE },
    { id: "esc-early", label: "Van nhân tạo < 12 tháng, liên quan chăm sóc y tế", tone: "hospital", criteria: IE.IE_ESC_CRIT.early, byt: [], intl: IE.IE_ESC_EARLY },
    { id: "esc-allergy", label: "Dị ứng beta-lactam", tone: "special", criteria: IE.IE_ESC_CRIT.allergy, byt: [], intl: IE.IE_ESC_ALLERGY },
  ],
  settingNote: "QĐ 708 dùng chung phác đồ cho khoa hồi sức và không hồi sức. Thời gian 4–6 tuần, van nhân tạo 6 tuần; aminoglycosid không quá 14 ngày.",
  extras: IE.IE_ESC_EXTRAS,
  principles: IE.IE_ESC_PRINCIPLES,
  antibiogram: {
    gramNegative: { organisms: ["Escherichia coli", "Klebsiella pneumoniae", "Pseudomonas aeruginosa"], codes: ["CRO", "FEP", "MEM", "CN/GEN", "CIP"] },
    gramPositive: { organisms: ["Staphylococcus aureus", "Staphylococcus coagulase âm (CoNS)", "Enterococcus spp.", "Streptococcus spp."], codes: ["PEN", "AMP", "FOX", "VAN", "LZD"] },
    defaultScope: "toan-vien",
    note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; bảng không tách riêng cấy máu viêm nội tâm mạc, chỉ dùng để định hướng.",
  },
  sources: ["Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh, Viêm nội tâm mạc nhiễm khuẩn.", ...IE.IE_SOURCES],
};

/* ======================= TAI MŨI HỌNG ======================= */
/* Việt Nam: QĐ 5643/QĐ-BYT (2015, bệnh tai mũi họng) và QĐ 708 Bảng II.13 (viêm họng liên cầu, phòng thấp tim).
   Quốc tế: dữ liệu module ENT (data/ent, có trích dẫn) qua ent-strat. Áp xe quanh amidan, sau họng, khoang cổ sâu:
   module ENT chỉ có nguồn tham khảo → chỉ khung Việt Nam, tab Quốc tế giữ công cụ ENT. */
const BYT5643 = "QĐ 5643/QĐ-BYT";
const SRC_5643 = (bai: string) => `Bộ Y tế. QĐ 5643/QĐ-BYT ngày 31/12/2015 – Hướng dẫn chẩn đoán và điều trị một số bệnh về tai mũi họng, ${bai}.`;
const ENT_ANTIBIOGRAM: StratAntibiogram = {
  gramNegative: { organisms: ["Klebsiella pneumoniae", "Escherichia coli", "Trực khuẩn Gram âm khác"], codes: ["AMC", "CXM", "CTX", "CRO", "CIP", "LVX"] },
  gramPositive: { organisms: ["Streptococcus spp.", "Staphylococcus aureus"], codes: ["PEN", "AMP", "ERY", "CLI", "FOX", "LVX"] },
  defaultScope: "toan-vien",
  note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; bảng không tách riêng bệnh phẩm tai mũi họng, chỉ dùng để định hướng.",
};

function sinusStrat(diseaseIds: string[], withChild: boolean): Stratification {
  const AAO = "AAOHNSF-2025", AAP = "AAP-2013-sinusitis";
  const childCols: StratColumn[] = withChild ? [
    { id: "sp-start", label: "Trẻ em – nặng, xấu đi hoặc kéo dài", tone: "community", byt: [],
      criteria: [ENT.entCite("Khởi phát nặng (sốt ≥ 39 °C kèm chảy mũi mủ ≥ 3 ngày) hoặc diễn biến xấu đi: kê kháng sinh. Kéo dài trên 10 ngày không cải thiện: kê kháng sinh hoặc theo dõi ngoại trú thêm 3 ngày.", AAP)],
      intl: ENT.entColumn("abrs-peds", "abrsp-r-severe-worse", "child") },
    { id: "sp-fail", label: "Trẻ em – không cải thiện sau 72 giờ", tone: "special", byt: [],
      criteria: [ENT.entCite("Nặng lên hoặc không cải thiện trong 72 giờ sau xử trí ban đầu: đánh giá lại, đổi kháng sinh hoặc bắt đầu kháng sinh.", AAP)],
      intl: ENT.entColumn("abrs-peds", "abrsp-r-failure", "child") },
  ] : [];
  return {
    diseaseIds,
    title: withChild ? "Viêm xoang cấp do vi khuẩn" : "Viêm xoang cấp do vi khuẩn – người lớn",
    lead: `Phân tầng theo mức độ và việc dùng kháng sinh gần đây như QĐ 5643; quốc tế theo AAO-HNSF 2025 (người lớn)${withChild ? " và AAP 2013 (trẻ em)" : ""}, đối chiếu IDSA 2012, NICE NG79.`,
    sampling: [{ text: "Soi mũi trước, nội soi mũi (lấy bệnh phẩm khe giữa); CT khi nghi biến chứng.", source: BYT5643, ref: "tr. 109" }],
    pathogens: [
      { text: "S. pneumoniae, H. influenzae, M. catarrhalis.", source: BYT5643, ref: "tr. 108" },
      { text: "Khoảng 25% phế cầu kháng penicilin; 30% H. influenzae và hầu hết M. catarrhalis tiết beta-lactamase.", source: BYT5643, ref: "tr. 111" },
    ],
    columns: [
      { id: "vn-moderate", label: "Thể trung bình, chưa dùng kháng sinh gần đây", tone: "community",
        criteria: [{ text: "Thể trung bình, không dùng kháng sinh trong 4–6 tuần gần đây.", source: BYT5643, ref: "mục 4.2.1, tr. 111" }],
        byt: ["r-ent-sinus-moderate", "r-ent-sinus-allergy-adult"], intl: [] },
      { id: "vn-recent", label: "Đã dùng kháng sinh gần đây", tone: "hospital",
        criteria: [{ text: "Đã dùng kháng sinh trong 4–6 tuần gần đây hoặc bệnh chưa ở mức nguy hiểm.", source: BYT5643, ref: "mục 4.2.1, tr. 111" }],
        byt: ["r-ent-sinus-recent-adult", "r-ent-sinus-recent-adult-allergy"], intl: [] },
      { id: "sa-unc", label: "Người lớn – không biến chứng", tone: "community", byt: [],
        criteria: [ENT.entCite("Đủ tiêu chuẩn (≥ 10 ngày không cải thiện, hoặc nặng lên lại trong 10 ngày), không biến chứng: theo dõi chờ đợi hoặc kháng sinh, quyết định cùng người bệnh. Bệnh nặng (sốt 39 °C kèm chảy mũi mủ ≥ 3–4 ngày) hoặc suy giảm miễn dịch: dùng kháng sinh.", AAO)],
        intl: ENT.entColumn("abrs-adult", "abrsa-r-uncomplicated") },
      { id: "sa-fail", label: "Người lớn – thất bại sau 3–5 ngày", tone: "hospital", byt: [],
        criteria: [ENT.entCite("Không cải thiện hoặc nặng lên sau 3–5 ngày kháng sinh phù hợp: đánh giá lại; xác nhận chẩn đoán thì đổi kháng sinh.", AAO)],
        intl: ENT.entColumn("abrs-adult", "abrsa-r-failure") },
      { id: "sa-comp", label: "Người lớn – nghi biến chứng", tone: "special", byt: [],
        criteria: [ENT.entCite("Nghi biến chứng lan ngoài xoang (hốc mắt, nội sọ) hoặc nguồn gốc răng: kháng sinh ngay hoặc chuyển chuyên khoa tai mũi họng.", AAO)],
        intl: ENT.entColumn("abrs-adult", "abrsa-r-complicated") },
      ...childCols,
    ],
    settingNote: "Thể nặng: 10–14 ngày. Rửa mũi nước muối, corticoid xịt mũi; phẫu thuật khi điều trị nội khoa tối đa 4–6 tuần không kết quả.",
    extras: [
      { title: "Dấu hiệu nặng cần đánh giá cấp cứu", blocks: [{ source: "AAO-HNSF 2025 – dấu hiệu nặng", items: ENT.entRedFlags("abrs-adult") }] },
      { title: "Nguồn đối chiếu – người lớn (IDSA 2012, NICE NG79)", blocks: [...ENT.entComparison("abrs-adult", "abrsa-r-uncomplicated"), ...ENT.entComparison("abrs-adult", "abrsa-r-failure").map((b) => ({ ...b, source: `${b.source} – thất bại điều trị` }))] },
      ...(withChild ? [{ title: "Nguồn đối chiếu – trẻ em (IDSA 2012, NICE NG79)", blocks: [...ENT.entComparison("abrs-peds", "abrsp-r-severe-worse", "child"),
          ...ENT.entComparison("abrs-peds", "abrsp-r-failure", "child").map((b) => ({ ...b, source: `${b.source} – thất bại điều trị` }))] },
        { title: "Đồng thuận Nhi khoa Ý 2025 – trẻ em", blocks: [EX.ITALY_SINUSITIS] }] : []),
    ],
    principles: ENT.entPrinciples("abrs-adult", "AAO-HNSF 2025 – khuyến cáo cho người lớn"),
    antibiogram: ENT_ANTIBIOGRAM,
    sources: [SRC_5643("Viêm mũi xoang cấp tính"), ...ENT.entSources("abrs-adult"), ...(withChild ? [...ENT.entSources("abrs-peds"), EX.ITALY_SINUSITIS_SOURCE] : [])].filter((s, i, a) => a.indexOf(s) === i),
  };
}

const GAS_STRAT: Stratification = {
  diseaseIds: ["v8-8", "v8-54"],
  title: "Viêm họng do liên cầu nhóm A",
  lead: "Việt Nam theo QĐ 5643 (viêm họng cấp) và QĐ 708 Bảng II.13 (điều trị viêm họng liên cầu, phòng thấp tim); quốc tế theo IDSA 2012 và CDC 2025, đối chiếu NICE NG84.",
  sampling: [
    { text: "Phết họng nuôi cấy để định loại nguyên nhân.", source: BYT5643, ref: "tr. 156" },
    ENT.entCite("Làm test kháng nguyên nhanh (RADT) và/hoặc cấy họng, vì lâm sàng không phân biệt được liên cầu nhóm A với virus, trừ khi có biểu hiện virus rõ.", "IDSA-2012-GAS"),
  ],
  pathogens: [{ text: "Virus 60–80%; vi khuẩn 20–40% (liên cầu tan huyết nhóm A, H. influenzae, tụ cầu vàng, M. catarrhalis, kỵ khí).", source: BYT5643, ref: "tr. 155" }],
  columns: [
    { id: "vn-5643", label: "Viêm họng đỏ cấp, trên 3 tuổi", tone: "community",
      criteria: [{ text: "Trên 3 tuổi, chưa định loại nguyên nhân: điều trị như viêm họng do liên cầu.", source: BYT5643, ref: "mục 4.2.1, tr. 157" }],
      byt: ["r-ent-pharyngitis"], intl: [] },
    { id: "vn-708", label: "Viêm họng liên cầu – phòng thấp tim", tone: "hospital",
      criteria: [{ text: "Điều trị viêm họng do liên cầu (phòng thấp tim): penicilin V hoặc erythromycin uống đủ 10 ngày; benzathin penicilin tiêm bắp một lần.", source: BYT, ref: "Bảng II.13, tr. 125–126" }],
      byt: ["r-ent-gas-708-bpg", "r-ent-gas-708-penv", "r-ent-gas-708-ery"], intl: [] },
    { id: "g-adult", label: "Người lớn – RADT hoặc cấy dương tính", tone: "community", byt: [],
      criteria: [ENT.entCite("RADT hoặc cấy họng dương tính: điều trị kháng sinh đủ liều, đủ thời gian (thường 10 ngày).", "IDSA-2012-GAS")],
      intl: ENT.entColumn("gas-pharyngitis", "gas-r-positive", "adult") },
    { id: "g-child", label: "Trẻ em – RADT hoặc cấy dương tính", tone: "hospital", byt: [],
      criteria: [ENT.entCite("RADT hoặc cấy họng dương tính: điều trị kháng sinh; liều theo cân nặng.", "IDSA-2012-GAS")],
      intl: ENT.entColumn("gas-pharyngitis", "gas-r-positive", "child") },
    { id: "g-test", label: "Chưa xét nghiệm hoặc RADT âm tính", tone: "special", byt: [],
      criteria: [ENT.entCite("Chưa có kết quả xét nghiệm: xét nghiệm trước khi quyết định dùng kháng sinh.", "IDSA-2012-GAS")],
      intl: [{ source: "IDSA 2012, IDSA 2025, CDC 2025 – xử trí", items: [
        EX.IDSA25_GAS_SCORE,
        { role: "Biểu hiện virus rõ", text: "Sổ mũi, ho, loét miệng, khàn tiếng: chẩn đoán lâm sàng, không cần xét nghiệm, không dùng kháng sinh.", ref: "CDC 2025" },
        { role: "Chưa xét nghiệm", text: "Làm RADT và/hoặc cấy họng; dương tính thì dùng phác đồ ở cột dương tính.", grade: "T:Mạnh · cao", ref: "IDSA 2012" },
        { role: "Trẻ ≥ 3 tuổi, RADT âm tính", text: "Cấy họng xác nhận.", ref: "CDC 2025" },
        { role: "Người lớn, RADT âm tính", text: "Không cần cấy lại thường quy; không dùng kháng sinh.", grade: "T:Mạnh · TB", ref: "IDSA 2012" },
        { role: "Trẻ < 3 tuổi", text: "Không xét nghiệm liên cầu nhóm A thường quy; cân nhắc khi có yếu tố nguy cơ (ví dụ anh chị em nhiễm liên cầu nhóm A).", grade: "T:Mạnh · TB", ref: "IDSA 2012" },
      ] }] },
  ],
  settingNote: "Penicilin V hoặc erythromycin uống đủ 10 ngày; benzathin penicilin tiêm bắp một lần. Thể nặng hoặc có biến chứng: chuyển chuyên khoa.",
  extras: [
    { title: "Dấu hiệu nặng", blocks: [{ source: "IDSA 2012, CDC 2025 – dấu hiệu nặng", items: ENT.entRedFlags("gas-pharyngitis") }] },
    { title: "Nguồn đối chiếu (NICE NG84)", blocks: [
      ...ENT.entComparison("gas-pharyngitis", "gas-r-positive", "adult").map((b) => ({ ...b, source: `${b.source} – người lớn` })),
      ...ENT.entComparison("gas-pharyngitis", "gas-r-positive", "child").map((b) => ({ ...b, source: `${b.source} – trẻ em` })),
    ] },
  ],
  principles: ENT.entPrinciples("gas-pharyngitis", "IDSA 2012, CDC 2025 – khuyến cáo", (s) => s.kind === "recommendation" || /kháng/u.test(s.text)),
  antibiogram: ENT_ANTIBIOGRAM,
  sources: [SRC_5643("Viêm họng cấp tính"), "Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh, Thấp tim (điều trị viêm họng liên cầu).", ...ENT.entSources("gas-pharyngitis"), EX.IDSA25_GAS_SOURCE],
};

function aomStrat(diseaseIds: string[], withAdult: boolean): Stratification {
  const AAP = "AAP-2013-AOM";
  return {
    diseaseIds,
    title: "Viêm tai giữa cấp – trẻ em",
    lead: "Việt Nam theo QĐ 5643 (viêm tai giữa cấp tính trẻ em); quốc tế theo AAP 2013, đối chiếu Hội Nhi khoa Canada 2016, NICE NG91.",
    sampling: [{ text: "Đau tai, sốt cao, nghe kém; màng nhĩ đỏ, phồng; nội soi tai.", source: BYT5643, ref: "tr. 210–212" }],
    pathogens: [{ text: "Viêm vòm mũi họng lan qua vòi Eustache; trẻ có VA, sau cúm, sởi.", source: BYT5643, ref: "tr. 210" }],
    columns: [
      { id: "vn-child", label: "Trẻ em", tone: "community",
        criteria: [{ text: "Kháng sinh phổ rộng (beta-lactam, cephalosporin, macrolid), tốt nhất theo kháng sinh đồ; phối hợp kháng viêm, dẫn lưu.", source: BYT5643, ref: "mục 4.3.3, tr. 214" }],
        byt: ["r-ent-aom-child"], intl: [] },
      { id: "a-now", label: "Kháng sinh ngay", tone: "hospital", byt: [],
        criteria: [ENT.entCite("Trẻ ≥ 6 tháng có triệu chứng nặng (đau tai vừa–nặng hoặc ≥ 48 giờ, hoặc sốt ≥ 39 °C), chảy mủ tai, hoặc trẻ 6–23 tháng viêm tai giữa cấp hai bên.", AAP)],
        intl: ENT.entColumn("aom-peds", "aom-r-severe", "child") },
      { id: "a-watch", label: "Không nặng – kháng sinh hoặc theo dõi", tone: "community", byt: [],
        criteria: [ENT.entCite("Trẻ 6–23 tháng viêm một bên, hoặc trẻ ≥ 24 tháng, không có triệu chứng nặng: kê kháng sinh hoặc theo dõi sát, quyết định cùng gia đình; bảo đảm tái khám nếu không cải thiện sau 48–72 giờ.", AAP)],
        intl: ENT.entColumn("aom-peds", "aom-r-older", "child") },
      { id: "a-fail", label: "Thất bại sau 48–72 giờ", tone: "special", byt: [],
        criteria: [ENT.entCite("Nặng lên hoặc không đáp ứng kháng sinh ban đầu sau 48–72 giờ: đánh giá lại và đổi kháng sinh.", AAP)],
        intl: ENT.entColumn("aom-peds", "aom-r-failure", "child") },
    ],
    settingNote: "Chích rạch màng nhĩ khi có mủ hòm nhĩ, triệu chứng toàn thân xấu, kéo dài trên 4 ngày.",
    extras: [
      { title: "Dấu hiệu nặng", blocks: [{ source: "AAP 2013 – dấu hiệu nặng", items: ENT.entRedFlags("aom-peds") }] },
      { title: "Nguồn đối chiếu (Hội Nhi khoa Canada 2016, NICE NG91)", blocks: [
        ...ENT.entComparison("aom-peds", "aom-r-severe", "child"),
        ...ENT.entComparison("aom-peds", "aom-r-failure", "child").map((b) => ({ ...b, source: `${b.source} – thất bại điều trị` })),
      ] },
      { title: "Đồng thuận Nhi khoa Ý 2025", blocks: [EX.ITALY_AOM] },
      ...(withAdult ? [{ title: "Người lớn", criteria: "AAP 2013 dành cho trẻ em.", blocks: ENT.entReference("aom-adult") }] : []),
    ],
    principles: ENT.entPrinciples("aom-peds", "AAP 2013 – khuyến cáo"),
    antibiogram: ENT_ANTIBIOGRAM,
    sources: [SRC_5643("Viêm tai giữa cấp tính trẻ em"), ...ENT.entSources("aom-peds"), EX.ITALY_AOM_SOURCE, ...(withAdult ? ["NHS (BAAG/IMOC, Anh). Summary of antimicrobial prescribing guidance – managing common infections (2025)."] : [])],
  };
}

const DEEP_NECK_STRAT: Stratification = {
  diseaseIds: ["v8-56", "v8-57", "v8-66"],
  title: "Nhiễm trùng, áp xe khoang cổ sâu",
  lead: "Việt Nam theo QĐ 5643 (nhiễm trùng khoang cổ sâu; khoang quanh amiđan và sau hầu thuộc các khoang cổ sâu); quốc tế theo SFORL 2024 (Hội Tai mũi họng Pháp, phối hợp SPILF).",
  sampling: [{ text: "Sốt, cổ sưng nóng đỏ đau, khó nuốt, khó thở; CT có cản quang phân biệt áp xe với viêm mô tế bào.", source: BYT5643, ref: "tr. 255" }, ...EX.SFORL_SAMPLING],
  pathogens: [
    { text: "Đa vi khuẩn: hiếu khí (H. influenzae, S. pneumoniae, Klebsiella) và kỵ khí (Peptostreptococcus, Fusobacterium, Bacteroides).", source: BYT5643, ref: "tr. 254" },
    { text: "Gram âm ở người già, đái tháo đường, suy giảm miễn dịch.", source: BYT5643, ref: "tr. 255" },
    ...EX.SFORL_PATHOGENS,
  ],
  columns: [
    { id: "vn-deepneck", label: "Nhiễm trùng, áp xe khoang cổ sâu", tone: "special",
      criteria: [
        { text: "Bảo đảm đường thở trước. Kháng sinh phổ rộng, tĩnh mạch, liều cao: cephalosporin thế hệ 3 + metronidazol.", source: BYT5643, ref: "mục 5.2, tr. 255" },
        { text: "Rạch dẫn lưu áp xe (trong miệng hoặc ngoài cổ); chọc hút dưới siêu âm, CT với áp xe nhỏ, đơn độc.", source: BYT5643, ref: "tr. 256" },
      ],
      byt: ["r-ent-deepneck-ctx"], intl: [] },
    { id: "sf-abscess", label: "Người lớn – áp xe quanh amidan, cạnh họng, sau họng", tone: "community", byt: [],
      criteria: EX.SFORL_CRIT_ADULT_ABSCESS, intl: EX.SFORL_ADULT_ABSCESS },
    { id: "sf-cellulitis", label: "Người lớn – viêm mô tế bào cổ sâu lan tỏa, viêm trung thất", tone: "special", byt: [],
      criteria: EX.SFORL_CRIT_ADULT_CELLULITIS, intl: EX.SFORL_ADULT_CELLULITIS },
    { id: "sf-child", label: "Trẻ em", tone: "hospital", byt: [],
      criteria: EX.SFORL_CRIT_CHILD, intl: EX.SFORL_CHILD },
  ],
  settingNote: "Thời gian theo đáp ứng lâm sàng và kháng sinh đồ.",
  extras: [{ title: "Điều chỉnh theo vi sinh (SFORL 2024)", blocks: [EX.SFORL_TARGETED] }],
  principles: EX.SFORL_PRINCIPLES,
  antibiogram: ENT_ANTIBIOGRAM,
  sources: [SRC_5643("Nhiễm trùng khoang cổ sâu"), EX.SFORL_SOURCE],
};

/* ======================= DA – MÔ MỀM ======================= */
/* Việt Nam: QĐ 708 (viêm mô bào) và QĐ 4416/2023 (nhọt, áp xe da). Quốc tế: IDSA 2014 + ACE 2026 qua hàm sstiPlan
   (cùng dữ liệu công cụ tab Quốc tế cũ). Khối "khuyến cáo IDSA" chung cho mọi mức độ đặt một lần ở nguyên tắc;
   mỗi cột chỉ giữ thuốc, liều và phương án dị ứng penicilin (al = "alt", lấy từ cùng hàm với pcnAllergy = true). */
const IDSA14 = "IDSA 2014";
const ACE26 = "ACE 2026";
const BYT4416 = "QĐ 4416/QĐ-BYT";
type SstiForm = "cellulitis" | "purulent";
const SSTI_BASE: SstiIn = { form: "cellulitis", age: "adult", sev: "mild", aceSevere: false, highRisk: false, pcnAllergy: false, impSub: "impetigo", mrsa: false, culture: "none", recurrent: false, site: "clean", pathogen: "empiric", bite: "animal", infected: false, immuno: false };
const IDSA_RECS = "Theo IDSA 2014: khuyến cáo";
const sstiOut = (form: SstiForm, sev: SstiIn["sev"], extra: Partial<SstiIn> = {}) => sstiPlan({ ...SSTI_BASE, form, sev, aceSevere: sev === "severe", ...extra });
/** Tên khối của module ("Theo ACE 2026: …") → nguồn hiển thị ("ACE 2026 – …"). */
const sstiSource = (title: string) => title.replace(/^Theo (IDSA 2014|ACE 2026):\s*/u, "$1 – ");
function sstiBlocks(out: SstiOut, alt?: SstiOut): StratIntl[] {
  const blocks: StratIntl[] = out.blocks.filter((b) => b.title !== IDSA_RECS).map((b) => {
    const extra = alt?.blocks.find((a) => a.title === b.title)?.items.filter((i) => i.al === "alt" && !b.items.some((x) => x.role === i.role && x.text === i.text)) ?? [];
    return { source: sstiSource(b.title), lead: b.lead, items: [...b.items.filter((i) => i.al !== "alt"), ...extra] };
  }).filter((b) => b.items.length > 0);
  if (out.avoid.length) blocks.push({ source: `${IDSA14} – không khuyến cáo`, items: out.avoid });
  return blocks;
}
const sstiCol = (form: SstiForm, sev: SstiIn["sev"]) => sstiBlocks(sstiOut(form, sev), sstiOut(form, sev, { pcnAllergy: true }));
const sstiCrit = (form: SstiForm, sev: SstiIn["sev"]): StratCite[] => [
  { text: SEV_TIP[form][sev], source: IDSA14, ref: "SSTI 2014" },
  ...(sev === "severe" ? [{ text: `Nặng theo ACE: ${ACE_SEVERE[form]}.`, source: ACE26, ref: "SSTI 2026" }] : []),
];
/** Lưu ý dùng thuốc của module: gộp mọi mức độ, bỏ trùng; đặt trong mục thu gọn. */
const sstiNotes = (form: SstiForm): StratIntl => ({
  source: `${ACE26}, ${IDSA14} – lưu ý khi dùng thuốc`,
  items: Array.from(new Set((["mild", "moderate", "severe"] as const).flatMap((sev) => [false, true].flatMap((pcnAllergy) => sstiOut(form, sev, { pcnAllergy }).notes))))
    .map((text) => ({ role: "Lưu ý", text, ref: "notes" })),
});
const sstiPrinciples = (form: SstiForm): StratIntl => ({
  source: `${IDSA14} – khuyến cáo chung (mức GRADE)`,
  items: [
    ...(sstiOut(form, "mild").blocks.find((b) => b.title === IDSA_RECS)?.items ?? []),
    { role: "Dấu hiệu nặng", text: RED_FLAGS, ref: "ACE" },
    { role: "SIRS", text: SIRS_IDSA, ref: "IDSA erratum 2015" },
  ],
});
/** Nhóm đặc biệt của module (kết quả cấy, tái phát): chỉ giữ các khối khác với phác đồ kinh nghiệm cùng mức độ. */
function sstiVariant(title: string, form: SstiForm, sev: SstiIn["sev"], extra: Partial<SstiIn>, criteria?: string) {
  const base = sstiBlocks(sstiOut(form, sev)).map((b) => JSON.stringify(b));
  const blocks = sstiBlocks(sstiOut(form, sev, extra), sstiOut(form, sev, { ...extra, pcnAllergy: true })).filter((b) => !base.includes(JSON.stringify(b)));
  return blocks.length ? [{ title, criteria, blocks }] : [];
}
const SSTI_ANTIBIOGRAM: StratAntibiogram = {
  gramNegative: { organisms: ["Escherichia coli", "Klebsiella pneumoniae", "Pseudomonas aeruginosa"], codes: ["AMC", "CRO", "TZP", "MEM", "CIP"] },
  gramPositive: { organisms: ["Staphylococcus aureus", "Streptococcus spp."], codes: ["FOX", "PEN", "ERY", "CLI", "SXT", "DOX", "VAN", "LZD"] },
  defaultScope: "toan-vien",
  note: "Tất cả bệnh phẩm, phân lập đầu tiên mỗi người bệnh; bảng không tách riêng mẫu da – mô mềm, chỉ dùng để định hướng.",
};
const SRC_IDSA_SSTI = "Stevens DL và cs. Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update by the IDSA. Clin Infect Dis 2014;59(2):e10–e52; đính chính Clin Infect Dis 2015;60(9):1448.";
const SRC_ACE_SSTI = "Agency for Care Effectiveness (Bộ Y tế Singapore). Bacterial skin and soft tissue infections – diagnosis and antibiotic prescribing. ACE Clinical Guideline, 21/09/2026.";

const CELLULITIS: Stratification = {
  diseaseIds: ["v8-27"],
  title: "Viêm mô bào – người lớn",
  lead: "Phân tầng theo mức độ như QĐ 708 (nhẹ dùng đường uống; nặng tiêm bắp hoặc tĩnh mạch); quốc tế theo IDSA 2014 và ACE 2026.",
  sampling: [
    { text: "Cấy bệnh phẩm, cấy máu: chỉ khoảng 1/5 dương tính.", source: BYT, ref: "tr. 139" },
    { text: "Phân biệt viêm tắc tĩnh mạch sâu (siêu âm Doppler) và viêm quầng.", source: BYT, ref: "tr. 138–139" },
  ],
  pathogens: [
    { text: "Liên cầu nhóm A; tụ cầu vàng đơn thuần hoặc phối hợp.", source: BYT, ref: "tr. 138" },
    { text: "Ít gặp: S. pneumoniae, H. influenzae; A. hydrophila từ nước, đất.", source: BYT, ref: "tr. 138" },
  ],
  columns: [
    { id: "vn-mild", label: "Nhẹ – đường uống", tone: "community",
      criteria: [{ text: "Nhẹ: có thể dùng đường uống.", source: BYT, ref: "tr. 139" }],
      byt: ["r-cell-amoxclav", "r-cell-roxi"], intl: [] },
    { id: "vn-severe", label: "Nặng – tiêm bắp hoặc tĩnh mạch", tone: "hospital",
      criteria: [{ text: "Nặng, nhất là nghi nhiễm khuẩn huyết, viêm khớp, viêm cân cơ: tiêm bắp hoặc tĩnh mạch.", source: BYT, ref: "tr. 139" }],
      byt: ["r-cell-pen", "r-cell-ctx"], intl: [] },
    { id: "cel-mild", label: "Nhẹ", tone: "community", criteria: sstiCrit("cellulitis", "mild"), byt: [], intl: sstiCol("cellulitis", "mild") },
    { id: "cel-mod", label: "Vừa", tone: "hospital", criteria: sstiCrit("cellulitis", "moderate"), byt: [], intl: sstiCol("cellulitis", "moderate") },
    { id: "cel-severe", label: "Nặng", tone: "special", criteria: sstiCrit("cellulitis", "severe"), byt: [], intl: sstiCol("cellulitis", "severe") },
  ],
  settingNote: "QĐ 708 dùng chung phác đồ cho khoa hồi sức và không hồi sức.",
  extras: [
    ...sstiVariant("Viêm mô tế bào tái phát", "cellulitis", "mild", { recurrent: true }),
    { title: "Lưu ý khi dùng thuốc", blocks: [sstiNotes("cellulitis")] },
  ],
  principles: sstiPrinciples("cellulitis"),
  antibiogram: SSTI_ANTIBIOGRAM,
  sources: ["Bộ Y tế. QĐ 708/QĐ-BYT ngày 02/3/2015 – Hướng dẫn sử dụng kháng sinh, Viêm mô bào.", SRC_IDSA_SSTI, SRC_ACE_SSTI],
};

const ABSCESS: Stratification = {
  diseaseIds: ["v8-28"],
  title: "Nhọt, áp xe da – người lớn",
  lead: "Phân tầng như QĐ 4416/2023 (thông thường; tụ cầu vàng kháng methicilin); quốc tế theo IDSA 2014 và ACE 2026.",
  sampling: [
    { text: "Chủ yếu lâm sàng; siêu âm đánh giá ổ áp xe; nhuộm Gram, cấy, kháng sinh đồ.", source: BYT4416, ref: "tr. 15" },
  ],
  pathogens: [
    { text: "Nhọt: tụ cầu vàng. Áp xe: tụ cầu vàng (MRSA gây tái phát), S. pyogenes, Gram âm, kỵ khí.", source: BYT4416, ref: "tr. 14" },
  ],
  columns: [
    { id: "vn-std", label: "Nhọt, áp xe da", tone: "community",
      criteria: [{ text: "Ổ áp xe: trích rạch dẫn lưu kèm kháng sinh toàn thân.", source: BYT4416, ref: "tr. 15–16" }],
      byt: ["r-abscess-4416-clox", "r-abscess-4416-amoxclav", "r-abscess-4416-roxi", "r-abscess-4416-azi", "r-abscess-4416-clinda"], intl: [] },
    { id: "vn-mrsa", label: "Do MRSA", tone: "hospital",
      criteria: [{ text: "Nghi hoặc xác định tụ cầu vàng kháng methicilin: thuốc có hiệu quả trên MRSA.", source: BYT4416, ref: "tr. 15–16" }],
      byt: ["r-abscess-4416-mrsa-vanco", "r-abscess-4416-mrsa-tmp", "r-abscess-4416-mrsa-linezolid"], intl: [] },
    { id: "pur-mild", label: "Nhẹ", tone: "community", criteria: sstiCrit("purulent", "mild"), byt: [], intl: sstiCol("purulent", "mild") },
    { id: "pur-mod", label: "Vừa", tone: "hospital", criteria: sstiCrit("purulent", "moderate"), byt: [], intl: sstiCol("purulent", "moderate") },
    { id: "pur-severe", label: "Nặng", tone: "special", criteria: sstiCrit("purulent", "severe"), byt: [], intl: sstiCol("purulent", "severe") },
  ],
  settingNote: "QĐ 4416 dùng chung phác đồ cho khoa hồi sức và không hồi sức.",
  extras: [
    ...sstiVariant("Có kết quả cấy: MRSA", "purulent", "severe", { culture: "mrsa" }),
    ...sstiVariant("Có kết quả cấy: MSSA", "purulent", "severe", { culture: "mssa" }),
    ...sstiVariant("Áp xe tái phát", "purulent", "moderate", { recurrent: true }),
    { title: "Lưu ý khi dùng thuốc", blocks: [sstiNotes("purulent")] },
  ],
  principles: sstiPrinciples("purulent"),
  antibiogram: SSTI_ANTIBIOGRAM,
  sources: ["Bộ Y tế. QĐ 4416/QĐ-BYT ngày 06/12/2023 – Hướng dẫn chẩn đoán và điều trị các bệnh da liễu, Nhọt, áp xe da.", SRC_IDSA_SSTI, SRC_ACE_SSTI],
};

export const STRATIFICATIONS: Stratification[] = ([SEPSIS, CAP, hvStrat("hap"), hvStrat("vap"), CYSTITIS, PYELONEPHRITIS, COMPLICATED_UTI, PERITONITIS, BILIARY, CELLULITIS, ABSCESS, MENINGITIS, VENTRICULITIS, ENDOCARDITIS,
  sinusStrat(["v8-7"], true), sinusStrat(["v8-58"], false), GAS_STRAT, aomStrat(["v8-60"], true), aomStrat(["v8-99"], false), DEEP_NECK_STRAT] as Stratification[]).map(compactStrat);

export function stratificationFor(diseaseId: string): Stratification | undefined {
  return STRATIFICATIONS.find(({ diseaseIds }) => diseaseIds.includes(diseaseId));
}

/** Có khung phân tầng quốc tế (cột có khuyến cáo quốc tế): khi không có, tab Quốc tế giữ nội dung cũ (vd. ghi chú khoảng trống). */
export function hasIntlStratification(diseaseId: string): boolean {
  return Boolean(stratificationFor(diseaseId)?.columns.some((c) => c.intl.length > 0 || c.links));
}
