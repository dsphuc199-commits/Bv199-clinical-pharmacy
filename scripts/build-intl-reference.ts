/*
  scripts/build-intl-reference.ts – sinh JSON mẫu chuẩn (data/guidelines/intl/_reference/) từ CODE THỰC TẾ của
  2 công cụ tab "Quốc tế": Nhiễm khuẩn huyết Gram âm (gnb-bsi-intl.ts) và S. aureus (sab-intl.ts).
  Không sửa file nguồn; chỉ đọc hằng số/hàm đã export rồi ghi JSON.
  Chạy: npx tsx scripts/build-intl-reference.ts
*/
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { COURSE, EMP_STEPS, PHENO_LABEL, defPlan, empPlan, type Pheno, type Sev } from "../components/antibiotics/empiric/gnb-bsi-intl";
import { ESBL_PRINCIPLES } from "../components/antibiotics/empiric/esbl-idsa2026";
import { ADULT_INITIAL, NEO_NOTE, PED_BARRIERS, PED_INITIAL, RISKS, VANCO, VANCO_COMMON, VANCO_POP, sabPlan, type Final } from "../components/antibiotics/empiric/sab-intl";
import type { RxItem } from "../components/antibiotics/empiric/septic-arthritis-pids2023";
import { ICD10 } from "../data/antibiotics/empiric/icd10";
import { NEED, intlGuideline } from "../schema/intl-guideline";
import { compactGuideline } from "./lib/compact-intl";

const OUT = join(process.cwd(), "data", "guidelines", "intl", "_reference");
const ACCESSED = "2026-11-14";
const REVIEW = { state: "draft_ai", verified_by: null, verified_date: null, next_review: null } as const;

type Src = (it: RxItem) => string[];
const item = (src: Src) => (it: RxItem) => {
  const o: Record<string, unknown> = { role: it.role, text: it.text };
  if (it.dose) o.dose = it.dose;
  if (it.grade) o.grade = it.grade;
  o.ref = it.ref;
  if (it.al) o.al = it.al;
  o.source_ids = src(it);
  return o;
};

/* ============================ NHIỄM KHUẨN HUYẾT GRAM ÂM (v8-14) ============================ */
const CUTI = "idsa-cuti-2025";
const AMR = "idsa-amr-2026";
const gnbSrc: Src = (it) => {
  if (it.ref.startsWith("Q") || it.ref.startsWith("AMR")) return [AMR];
  if (it.role === "Loại ở bước 2" && it.text.includes("IDSA 2026")) return [CUTI, AMR];
  return [CUTI];
};
const gi = item(gnbSrc);
const SEV_TEXT: Record<Sev, string> = { shock: "sốc nhiễm khuẩn", sepsis: "sepsis không sốc", none: "không sepsis" };
const bools = [false, true];

function gnb() {
  const rules: unknown[] = [];
  for (const sev of ["shock", "sepsis", "none"] as Sev[])
    for (const oral of sev === "none" ? bools : [false])
      for (const priorEsbl of bools) for (const priorFqR of bools) for (const fq12m of bools) for (const priorPtzR of bools) {
        const o = empPlan({ sev, oral, priorEsbl, priorFqR, fq12m, priorPtzR });
        const when: Record<string, unknown> = { stage: "emp", sev, priorEsbl, priorFqR, fq12m, priorPtzR };
        if (sev === "none") when.oral = oral;
        rules.push({
          id: `emp-${sev}${sev === "none" ? (oral ? "-po" : "-iv") : ""}-${[priorEsbl, priorFqR, fq12m, priorPtzR].map(Number).join("")}`,
          kind: "primary", when,
          summary: [
            { label: "Chẩn đoán", text: `Nhiễm khuẩn huyết Gram âm nghi từ đường tiết niệu, ${SEV_TEXT[sev]}, chưa có kết quả cấy` },
            { label: "Phác đồ", text: o.headline },
            { label: "Hướng dẫn", text: "IDSA 2025 – nhiễm khuẩn tiết niệu phức tạp, câu hỏi lâm sàng 1" },
          ],
          blocks: o.blocks.map((b) => ({ title: b.title, ...(b.lead ? { lead: b.lead } : {}), items: b.items.map(gi) })),
          avoid: o.avoid.map(gi),
          notes: o.notes.map((t) => ({ text: t, source_ids: [CUTI] })),
          source_ids: [CUTI],
        });
      }
  const phenos = Object.keys(PHENO_LABEL) as Pheno[];
  for (const pheno of phenos) {
    const combos: { urinary: boolean; severe: boolean; hypoalb: boolean; ecoli: boolean; when: Record<string, unknown> }[] = [];
    if (pheno === "esbl") {
      for (const severe of bools) for (const ecoli of bools) combos.push({ urinary: true, severe, hypoalb: false, ecoli, when: { urinary: true, severe, ecoli } });
      for (const severe of bools) for (const hypoalb of bools) combos.push({ urinary: false, severe, hypoalb, ecoli: false, when: { urinary: false, severe, hypoalb } });
    } else if (pheno === "pa-dtr") {
      for (const urinary of bools) combos.push({ urinary, severe: false, hypoalb: false, ecoli: false, when: { urinary } });
    } else combos.push({ urinary: true, severe: false, hypoalb: false, ecoli: false, when: {} });
    for (const c of combos) {
      const o = defPlan({ pheno, urinary: c.urinary, severe: c.severe, hypoalb: c.hypoalb, ecoli: c.ecoli });
      const site = pheno === "esbl" || pheno === "pa-dtr" ? (c.urinary ? ", nguồn tiết niệu" : ", nguồn ngoài tiết niệu") : "";
      const suffix = Object.entries(c.when).map(([k, v]) => `${k}${Number(v)}`).join("-");
      rules.push({
        id: `def-${pheno}${suffix ? "-" + suffix : ""}`.toLowerCase(),
        kind: "primary", when: { stage: "def", pheno, ...c.when },
        summary: [
          { label: "Chẩn đoán", text: `Nhiễm khuẩn huyết do ${PHENO_LABEL[pheno]}${site}` },
          { label: "Phác đồ", text: o.headline },
          { label: "Hướng dẫn", text: "IDSA 2026 – vi khuẩn Gram âm kháng thuốc" },
        ],
        blocks: o.blocks.map((b) => ({ title: b.title, ...(b.lead ? { lead: b.lead } : {}), items: b.items.map(gi) })),
        avoid: o.avoid.map(gi),
        notes: o.notes.map((t) => ({ text: t, source_ids: [AMR] })),
        source_ids: [AMR],
      });
    }
  }
  void ESBL_PRINCIPLES; // không hiển thị ở trang Gram âm (chỉ ở trang ESBL)
  return {
    schema_version: 1,
    slug: "nkh-gram-am",
    disease_id: "v8-14",
    name_vi: "Nhiễm khuẩn huyết do vi khuẩn Gram âm",
    name_en: "Gram-negative bloodstream infection",
    icd10: ICD10["v8-14"]?.length ? ICD10["v8-14"] : NEED,
    population: ["adult"],
    status: "extracted",
    header: {
      eyebrow: "Lựa chọn kháng sinh theo chẩn đoán",
      title: "Nhiễm khuẩn huyết do vi khuẩn Gram âm – người lớn",
      flow: ["Giai đoạn", "Mức độ nặng", "Nguy cơ kháng thuốc hoặc kiểu hình kháng", "Thuốc, liều", "Xuống thang, thời gian"],
    },
    axes: [
      { id: "stage", label: "Giai đoạn", type: "seg", default: "emp",
        options: [{ id: "emp", label: "Kinh nghiệm (nguồn tiết niệu)" }, { id: "def", label: "Đích – đã biết kiểu hình kháng" }],
        tip: "IDSA 2025 chỉ khuyến cáo kháng sinh kinh nghiệm khi nguồn là đường tiết niệu. Nguồn khác: điều trị kinh nghiệm theo hướng dẫn của bệnh nguyên phát (viêm phổi, nhiễm khuẩn ổ bụng…)." },
      { id: "sev", label: "Mức độ nặng", type: "seg", default: "sepsis", visible_when: { stage: "emp" },
        options: [{ id: "shock", label: "Sốc nhiễm khuẩn" }, { id: "sepsis", label: "Sepsis không sốc" }, { id: "none", label: "Không sepsis" }] },
      { id: "oral", label: "Điều trị đường uống", group: "Mức độ nặng", type: "check", default: false, visible_when: { stage: "emp", sev: "none" } },
      { id: "priorEsbl", label: "Cấy nước tiểu gần đây có vi khuẩn sinh ESBL", group: "Nguy cơ kháng thuốc", type: "check", default: false, visible_when: { stage: "emp" } },
      { id: "priorFqR", label: "Cấy nước tiểu gần đây kháng fluoroquinolon", group: "Nguy cơ kháng thuốc", type: "check", default: false, visible_when: { stage: "emp" } },
      { id: "fq12m", label: "Đã dùng fluoroquinolon trong 12 tháng qua", group: "Nguy cơ kháng thuốc", type: "check", default: false, visible_when: { stage: "emp" } },
      { id: "priorPtzR", label: "Cấy nước tiểu gần đây kháng piperacilin-tazobactam", group: "Nguy cơ kháng thuốc", type: "check", default: false, visible_when: { stage: "emp" } },
      { id: "pheno", label: "Kiểu hình kháng", type: "select", default: "esbl", visible_when: { stage: "def" },
        options: phenos.map((k) => ({ id: k, label: PHENO_LABEL[k] })) },
      { id: "urinary", label: "Nguồn nhiễm khuẩn là đường tiết niệu", group: "Người bệnh", type: "check", default: true, visible_when: { stage: "def", pheno: ["esbl", "pa-dtr"] } },
      { id: "severe", label: "Bệnh nặng (nguy kịch)", group: "Người bệnh", type: "check", default: false, visible_when: { stage: "def", pheno: "esbl" } },
      { id: "hypoalb", label: "Albumin máu < 2,5 g/dL", group: "Người bệnh", type: "check", default: false, visible_when: { stage: "def", pheno: "esbl", urinary: false } },
      { id: "ecoli", label: "Tác nhân là E. coli", group: "Người bệnh", type: "check", default: false, visible_when: { stage: "def", pheno: "esbl", urinary: true } },
    ],
    sections: [
      { id: "emp-steps", position: "before", title: "Quy trình 4 bước chọn kháng sinh kinh nghiệm", items: EMP_STEPS.map(gi), show_when: { stage: "emp" } },
      { id: "course", position: "after", title: "Thời gian, chuyển đường uống", items: COURSE.map(gi) },
    ],
    rules,
    source_text: "Nguồn: IDSA 2025 – Hướng dẫn nhiễm khuẩn tiết niệu phức tạp: lựa chọn kháng sinh (Trautner BW và cs.), Bảng 1.1, 2.1 (liều dùng trong thử nghiệm lâm sàng), 3.1; IDSA 2026 – Hướng dẫn điều trị nhiễm khuẩn Gram âm kháng thuốc (Tamma PD và cs., Clin Infect Dis 2026; doi:10.1093/cid/ciag481), Section 1–6, Table 1 – không xếp mức GRADE. Hướng dẫn quốc tế (bối cảnh Hoa Kỳ), chưa phải phác đồ BV199 phê duyệt; đối chiếu kháng sinh đồ và danh mục thuốc tại chỗ.",
    gaps: [],
    discordance: [],
    selection_rationale: {
      chosen: "Bản chuyển đổi từ công cụ viết tay hiện có của app (GnbBsiIntl.tsx, gnb-bsi-intl.ts). Nguồn là PDF người dùng cung cấp ngày 14/11/2026: IDSA 2025 cUTI – Clinical Question 1 (IDSA chỉ khuyến cáo kháng sinh kinh nghiệm khi nguồn nhiễm khuẩn huyết là đường tiết niệu) và IDSA 2026 AMR Guidance v5.0 (điều trị đích theo kiểu hình kháng). Cả hai do IDSA ban hành chính thức, quần thể người lớn.",
      current_version_check: "Không kiểm tra lại khi chuyển đổi sang JSON; phiên bản theo PDF người dùng cung cấp và data/antibiotics/empiric/international.ts (ghi nhận 25/10/2026).",
      excluded: [],
    },
    sources: [
      { id: CUTI, org: "IDSA", title: "IDSA 2025 Guideline Update on Complicated Urinary Tract Infections – Clinical Question 1 (selection of empiric antibiotics)", year: 2025, version: "Công bố 17/07/2025", url: "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/", accessed: ACCESSED, population: ["adult"], evidence_system: "GRADE – khuyến cáo mạnh/có điều kiện; độ tin cậy bằng chứng cao/trung bình/thấp/rất thấp; khuyến cáo thực hành tốt", grade_system: "GRADE" },
      { id: AMR, org: "IDSA", title: "IDSA 2026 Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections (v5.0)", year: 2026, version: "v5.0, công bố 30/07/2026; doi:10.1093/cid/ciag481", url: "https://doi.org/10.1093/cid/ciag481", accessed: ACCESSED, population: ["adult"], evidence_system: "Không xếp mức GRADE – ưu tiên/thay thế theo đồng thuận chuyên gia", grade_system: "IDSA-AMR" },
    ],
    review: REVIEW,
  };
}

/* ============================ NHIỄM KHUẨN HUYẾT S. AUREUS (v8-13) ============================ */
const SAB = "idsa-escmid-sab-2026-cs1";
const VAN = "ashp-idsa-vanco-2020";
const sabSrc: Src = (it) => (it.ref.startsWith("ASHP") ? [VAN] : [SAB]);
const si = item(sabSrc);
const IE_IDS = RISKS.filter((x) => x.ie).map((x) => x.id);
const DX = (who: string) => ({ label: "Chẩn đoán", text: `Nhiễm khuẩn huyết do S. aureus – ${who}` });
const GL = { label: "Hướng dẫn", text: "IDSA/ESCMID 2026 – Consensus Statement 1; vancomycin: ASHP/IDSA/PIDS/SIDP 2020" };
const T_INIT = "Đánh giá ban đầu – mọi người bệnh";
const T_FIN = "Phân loại cuối cùng, thời gian điều trị";
const T_INC = "Nguy cơ tăng – thăm dò cá thể hóa";
const STRIP = new Set(["Yếu tố chính", "Viêm nội tâm mạc"]);

function sab() {
  const rules: unknown[] = [];
  const finals: Final[] = ["pending", "nofocus", "focus"];
  for (const final of finals) {
    const low = sabPlan([], final);
    rules.push({
      id: `adult-low-${final}`, kind: "primary", when: { age: "adult", risks: { is_empty: true }, final },
      summary: [DX("người lớn"), { label: "Phân tầng", text: low.headline }, GL],
      blocks: [
        { title: T_INIT, items: ADULT_INITIAL.map(si) },
        { title: "Nguy cơ thấp – theo dõi", items: low.workup.map(si) },
        { title: T_FIN, items: low.final.map(si) },
      ],
      notes: low.notes.map((t) => ({ text: t, source_ids: [SAB] })),
      source_ids: [SAB],
    });
    for (const unknown of bools) {
      const inc = sabPlan([unknown ? "unknown" : "graft"], final);
      rules.push({
        id: `adult-increased-${unknown ? "unknownfocus" : "knownfocus"}-${final}`, kind: "primary",
        when: { age: "adult", risks: unknown ? { includes_any: ["unknown"] } : { is_empty: false, includes_none: ["unknown"] }, final },
        summary: [DX("người lớn"), { label: "Phân tầng", text: "Nguy cơ tăng – có ít nhất 1 yếu tố nguy cơ; tiếp tục thăm dò đến khi xác định hoặc loại trừ chắc chắn ổ nhiễm sâu, di bệnh" }, GL],
        blocks: [
          { title: T_INIT, items: ADULT_INITIAL.map(si) },
          { title: T_INC, items: inc.workup.filter((x) => !STRIP.has(x.role)).map(si) },
          { title: T_FIN, items: inc.final.map(si) },
        ],
        notes: inc.notes.map((t) => ({ text: t, source_ids: [SAB] })),
        source_ids: [SAB],
      });
    }
  }
  const keyItem = sabPlan(["bc48"], "pending").workup.find((x) => x.role === "Yếu tố chính")!;
  const ieItem = sabPlan(["valve"], "pending").workup.find((x) => x.role === "Viêm nội tâm mạc")!;
  rules.push({ id: "adult-addon-key", kind: "addon", when: { age: "adult", risks: { includes_any: ["bc48", "device"] } },
    blocks: [{ title: T_INC, items: [si(keyItem)] }], source_ids: [SAB] });
  rules.push({ id: "adult-addon-endocarditis", kind: "addon", when: { age: "adult", risks: { includes_any: IE_IDS } },
    blocks: [{ title: T_INC, items: [si({ ...ieItem, text: "Có đặc điểm tăng nguy cơ viêm nội tâm mạc (các yếu tố đánh dấu *): thăm dò tích cực hơn, nhắm vào phát hiện viêm nội tâm mạc. Quyết định siêu âm tim qua thực quản (TEE) dựa trên các đặc điểm nguy cơ này, chất lượng TTE và tác động dự kiến lên xử trí (CS 4)." })] }],
    source_ids: [SAB] });
  const pedNotes = [{ text: PED_BARRIERS, source_ids: [SAB] }, { text: "Thời gian điều trị ở trẻ em: thuộc Consensus Statement 6–7, chưa trích trong công cụ này.", source_ids: [SAB] }];
  const PED_SUM = { label: "Phân tầng", text: "Mọi trẻ đều cần đánh giá tìm ổ nhiễm sâu – chưa xác định được nhóm trẻ nguy cơ thấp" };
  rules.push({ id: "child", kind: "primary", when: { age: "child" }, summary: [DX("trẻ em"), PED_SUM, GL],
    blocks: [{ title: "Đánh giá, xử trí", items: PED_INITIAL.map(si) }], notes: pedNotes, source_ids: [SAB] });
  rules.push({ id: "neonate", kind: "primary", when: { age: "neo" }, summary: [DX("sơ sinh"), PED_SUM, GL],
    blocks: [{ title: "Đánh giá, xử trí", items: PED_INITIAL.map(si) }], notes: pedNotes, source_ids: [SAB] });

  return {
    schema_version: 1,
    slug: "nkh-s-aureus",
    disease_id: "v8-13",
    name_vi: "Nhiễm khuẩn huyết do S. aureus",
    name_en: "Staphylococcus aureus bacteremia",
    icd10: ICD10["v8-13"]?.length ? ICD10["v8-13"] : NEED,
    population: ["adult", "child", "neonate"],
    status: "extracted",
    header: {
      eyebrow: "Phân tầng nguy cơ – thăm dò – điều trị",
      title: "Nhiễm khuẩn huyết do Staphylococcus aureus",
      flow: ["Đánh giá ban đầu", "Phân tầng nguy cơ", "Thăm dò cá thể hóa", "Phân loại cuối cùng, thời gian", "Vancomycin khi MRSA"],
    },
    axes: [
      { id: "age", label: "Đối tượng", type: "seg", default: "adult",
        options: [{ id: "adult", label: "Người lớn" }, { id: "child", label: "Trẻ em (≥ 28 ngày)" }, { id: "neo", label: "Sơ sinh (< 28 ngày)" }] },
      { id: "risks", label: "Yếu tố nguy cơ", type: "multi", default: [], visible_when: { age: "adult" },
        options: RISKS.map((x) => ({ id: x.id, label: x.label, group: x.key ? "Yếu tố nguy cơ chính" : "Yếu tố nguy cơ khác", ...(x.ie ? { suffix: "*" } : {}) })),
        tip: "* Đặc điểm tăng nguy cơ viêm nội tâm mạc. Khởi phát cộng đồng (định nghĩa thống nhất trong các nghiên cứu): mẫu cấy máu dương tính đầu tiên lấy trước hoặc trong 48 giờ sau nhập viện." },
      { id: "final", label: "Kết quả thăm dò", type: "seg", default: "pending", visible_when: { age: "adult" },
        options: [{ id: "pending", label: "Đang đánh giá" }, { id: "nofocus", label: "Không có ổ nhiễm sâu" }, { id: "focus", label: "Có ổ nhiễm sâu, di bệnh" }] },
      { id: "vpop", label: "Nhóm người bệnh", type: "seg", default: "std", placement: "output", options: VANCO_POP.map((p) => ({ id: p.id, label: p.label })) },
    ],
    sections: [
      { id: "neo-note", position: "before", lead: NEO_NOTE, show_when: { age: "neo" }, items: [] },
      { id: "vanco-head", position: "after", title: "Vancomycin – khi nghi ngờ hoặc xác định MRSA nặng",
        lead: "IDSA/ESCMID 2026 Part 1 chưa đưa khuyến cáo chọn thuốc cho MSSA/MRSA. Phần dưới chỉ là liều và theo dõi nồng độ vancomycin theo ASHP 2020 (chức năng thận bình thường, trừ các mục lọc máu).",
        controls: ["vpop"], items: [] },
      ...VANCO_POP.map((p) => ({ id: `vanco-${p.id}`, position: "after", items: VANCO[p.id].map(si), show_when: { vpop: p.id } })),
      { id: "vanco-common", position: "after", title: "Nguyên tắc chung vancomycin", items: VANCO_COMMON.map(si) },
    ],
    rules,
    source_text: "Nguồn: IDSA/ESCMID 2026 Consensus Statement 1 – Risk Stratification of Patients with S. aureus Bacteremia (Kaasch AJ, Strnad L và cs.), Table 1, Figure 1, Implementation considerations – phương pháp đồng thuận (> 75% hội đồng), không xếp mức bằng chứng; ASHP/IDSA/PIDS/SIDP 2020 – Therapeutic monitoring of vancomycin for serious MRSA infections (Rybak MJ và cs., Am J Health-Syst Pharm 2020;77:835–864), Table 2 – mức khuyến cáo A/B/C, chất lượng bằng chứng I/II/III. CS = Consensus Statement; KC = khuyến cáo. Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt.",
    gaps: [
      "Lựa chọn thuốc MSSA/MRSA: chưa có trong IDSA/ESCMID 2026 Part 1.",
      "Thời gian điều trị ở trẻ em và mốc bắt đầu tính thời gian (Consensus Statement 2, 6, 7): chưa trích trong công cụ.",
    ],
    discordance: [],
    selection_rationale: {
      chosen: "Bản chuyển đổi từ công cụ viết tay hiện có của app (SabIntl.tsx, sab-intl.ts). Nguồn là PDF người dùng cung cấp ngày 14/11/2026: IDSA/ESCMID 2026 Consensus Statement 1 (phân tầng nguy cơ, người lớn và trẻ em) và ASHP/IDSA/PIDS/SIDP 2020 (liều, theo dõi vancomycin). Lựa chọn thuốc MSSA/MRSA chưa có trong Part 1 nên không đưa vào.",
      current_version_check: "Không kiểm tra lại khi chuyển đổi sang JSON; phiên bản theo PDF người dùng cung cấp và data/antibiotics/empiric/international.ts.",
      excluded: [],
    },
    sources: [
      { id: SAB, org: "IDSA/ESCMID", title: "2026 Consensus Statement 1 by the IDSA and ESCMID on Risk Stratification of Patients with Staphylococcus aureus Bacteremia", year: 2026, version: "Part 1, công bố 09/09/2026", url: "https://www.idsociety.org/practice-guideline/staphylococcus-aureus-bacteremia/", accessed: ACCESSED, population: ["adult", "child", "neonate"], evidence_system: "Đồng thuận (> 75% hội đồng), không xếp mức bằng chứng", grade_system: "consensus" },
      { id: VAN, org: "ASHP/IDSA/PIDS/SIDP", title: "Therapeutic monitoring of vancomycin for serious MRSA infections: a revised consensus guideline and review", year: 2020, version: "Am J Health-Syst Pharm 2020;77(11):835–864; doi:10.1093/ajhp/zxaa036", url: "https://doi.org/10.1093/ajhp/zxaa036", accessed: ACCESSED, population: ["adult", "child", "neonate"], evidence_system: "Sức mạnh khuyến cáo A/B/C – chất lượng bằng chứng I/II/III (Table 1 của nguồn)", grade_system: "letter-roman" },
    ],
    review: REVIEW,
  };
}

mkdirSync(join(OUT, "full"), { recursive: true });
for (const [name, data] of [["nkh-gram-am", gnb()], ["nkh-s-aureus", sab()]] as const) {
  const parsed = intlGuideline.safeParse(data);
  if (!parsed.success) { console.error(`${name}: không khớp schema`, parsed.error.issues.slice(0, 5)); process.exitCode = 1; continue; }
  writeFileSync(join(OUT, "full", `${name}.full.json`), JSON.stringify(data, null, 2) + "\n", "utf8");
  const c = compactGuideline(parsed.data);
  const main = c.equal ? c.compact : data;
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(main, null, 2) + "\n", "utf8");
  console.log(`${name}: bản đầy đủ ${data.rules.length} luật; dạng gọn ${c.compact.rules.length} luật – ${c.equal ? `GIỐNG HỆT trên ${c.checked} tổ hợp → dùng dạng gọn` : `KHÁC (${c.reason}) → giữ bản đầy đủ`}`);
  for (const m of c.log) console.log("   " + m);
}
