/*
  Nhiem khuan huyet do vi khuan Gram am – du lieu cong cu chon khang sinh theo nguon quoc te (nguoi lon).
  - Kinh nghiem (chi khi nguon la duong tiet nieu): IDSA 2025 cUTI, Clinical Question 1 (Trautner BW et al.) –
    khuyen cao A.I–A.II, quy trinh 4 buoc (Figure 1.1; Step 1–4), Bang 1.1, Bang 2.1 (LIEU DUNG TRONG THU NGHIEM LAM SANG),
    Bang 3.1 (lieu uong), muc C (dieu tri dich). Thoi gian, chuyen uong: CQ 2–3 (da trich o v8-2).
  - Dieu tri dich theo kieu hinh khang thuoc: IDSA 2026 AMR Guidance (Tamma PD et al. Clin Infect Dis 2026, ciag481),
    Section 1–6, Table 1 (lieu nguoi lon, chuc nang gan – than binh thuong). Khong xep muc GRADE.
  Doc tu ban PDF nguoi dung cung cap ngay 14/11/2026. Thuoc khong co lieu trong bang nguon -> de trong.
*/
import type { RxItem } from "./septic-arthritis-pids2023";
import { esblPlan } from "./esbl-idsa2026";

export type Block = { title: string; lead?: string; items: RxItem[] };
const r = (role: string, text: string, dose: string | undefined, ref: string, grade?: string): RxItem => ({ role, text, dose, ref, grade });

/* ======================= KINH NGHIEM – NGUON TIET NIEU (IDSA 2025 cUTI) ======================= */
export type Sev = "shock" | "sepsis" | "none";
export type EmpIn = { sev: Sev; oral: boolean; priorEsbl: boolean; priorFqR: boolean; fq12m: boolean; priorPtzR: boolean };

/* Bang 2.1 – lieu TM dung trong thu nghiem lam sang (chuc nang than binh thuong). */
const T21 = {
  ctx: "1–2 g mỗi 24 giờ",
  ctax: "1–2 g mỗi 8 giờ",
  caz: "1–2 g mỗi 8 giờ",
  fep: "1–2 g mỗi 8–12 giờ",
  erta: "1 g mỗi 24 giờ",
  mero: "1 g mỗi 8 giờ",
  imi: "500 mg mỗi 6 giờ hoặc 1 g mỗi 8 giờ",
  ptz: "4,5 g mỗi 8 giờ",
  ctz: "1,5 g mỗi 8 giờ",
  cza: "2,5 g mỗi 8 giờ, truyền 2 giờ",
  mev: "2 g/2 g mỗi 8 giờ, truyền 3 giờ",
  imr: "500 mg/125 mg mỗi 6 giờ",
  fdc: "2 g mỗi 8 giờ, truyền 3 giờ",
  plz: "10–15 mg/kg mỗi 24 giờ",
};
/* Bang 3.1 – lieu uong (chuc nang than binh thuong). */
const T31 = {
  cipro: "Uống 500–750 mg mỗi 12 giờ",
  levo: "Uống 500–750 mg mỗi 24 giờ",
  tmp: "Uống 800/160 mg mỗi 12 giờ",
  amc: "Uống 875/125 mg mỗi 8–12 giờ",
  cpd: "Uống 200–400 mg mỗi 12 giờ",
  cfx: "Uống 400 mg mỗi 24 giờ",
  ctb: "Uống 400 mg mỗi 24 giờ hoặc 200 mg mỗi 12 giờ",
  cxm: "Uống 500 mg mỗi 12 giờ",
  lex: "Uống 500–1.000 mg mỗi 6 giờ",
};

export const EMP_STEPS: RxItem[] = [
  r("Bước 1 – Mức độ nặng", "Chọn kháng sinh kinh nghiệm trước hết theo có hay không sepsis. Sepsis: SOFA tăng ≥ 2 điểm (tử vong nội viện > 10%); qSOFA hoặc SIRS chỉ giúp nhận diện sơ bộ. Sốc nhiễm khuẩn: cần vận mạch dù đã bù dịch và lactat > 2 mmol/L.", undefined, "Step 1", "C-VL"),
  r("Bước 2 – Nguy cơ vi khuẩn kháng thuốc", "Tránh kháng sinh mà người bệnh từng có chủng phân lập từ nước tiểu kháng (cấy gần đây giá trị hơn; khoảng cách thường 3–6 tháng). Tránh fluoroquinolon nếu đã dùng nhóm này trong 12 tháng qua.", undefined, "Step 2", "C-VL"),
  r("Bước 3 – Yếu tố riêng của người bệnh", "Dị ứng, chống chỉ định, tương tác thuốc; tránh kháng sinh người bệnh đang dùng khi khởi phát triệu chứng hoặc vừa mới dùng.", undefined, "Step 3", "GPS"),
  r("Bước 4 – Kháng sinh đồ tích lũy (chỉ khi có sepsis)", "Chỉ dùng khi kháng sinh đồ tại chỗ, trong 12 tháng gần nhất và phù hợp với người bệnh. Chọn thuốc có tỷ lệ nhạy ≥ 90% (sốc nhiễm khuẩn) hoặc ≥ 80% (sepsis không sốc) với vi khuẩn phù hợp nhất: theo cấy nước tiểu trước đây; không có thì mặc định E. coli. Không sepsis: không khuyến cáo (khoảng trống kiến thức).", undefined, "Step 4", "C-VL"),
];

export function empPlan(i: EmpIn): { headline: string; blocks: Block[]; avoid: RxItem[]; notes: string[] } {
  const avoid: RxItem[] = [];
  const notes: string[] = [];
  const noCeph = i.priorEsbl;
  const noFq = i.priorFqR || i.fq12m;
  const noPtz = i.priorPtzR;
  if (noCeph) avoid.push(r("Loại ở bước 2", "Cephalosporin thế hệ 3–4: cấy nước tiểu gần đây có vi khuẩn sinh ESBL (IDSA 2025 nêu ví dụ ceftriaxon; ESBL bất hoạt phần lớn cephalosporin và IDSA 2026 khuyên tránh cefepim cho ESBL)", undefined, "1) Rationale"));
  if (noFq) avoid.push(r("Loại ở bước 2", i.fq12m ? "Fluoroquinolon: đã dùng fluoroquinolon trong 12 tháng qua" : "Fluoroquinolon: cấy nước tiểu gần đây kháng fluoroquinolon", undefined, "Step 2"));
  if (noPtz) avoid.push(r("Loại ở bước 2", "Piperacilin-tazobactam: cấy nước tiểu gần đây kháng thuốc này", undefined, "2) Rationale"));
  avoid.push(r("Không phù hợp", "Nitrofurantoin và fosfomycin uống – không đạt nồng độ đủ trong nhu mô thận và máu", undefined, "Table 1.1"));

  const ceph: RxItem[] = noCeph ? [] : [
    r("Cephalosporin thế hệ 3", "Ceftriaxon", T21.ctx, "Table 2.1"),
    r("Cephalosporin thế hệ 3", "Cefotaxim", T21.ctax, "Table 2.1"),
    r("Cephalosporin thế hệ 3", "Ceftazidim", T21.caz, "Table 2.1"),
    r("Cephalosporin thế hệ 4", "Cefepim", T21.fep, "Table 2.1"),
  ];
  const carb: RxItem[] = [
    r("Carbapenem", "Ertapenem", T21.erta, "Table 2.1"),
    r("Carbapenem", "Meropenem", T21.mero, "Table 2.1"),
    r("Carbapenem", "Imipenem-cilastatin", T21.imi, "Table 2.1"),
  ];
  const ptz: RxItem[] = noPtz ? [] : [r("Penicilin + ức chế beta-lactamase", "Piperacilin-tazobactam", T21.ptz, "Table 2.1")];
  const fq: RxItem[] = noFq ? [] : [
    r("Fluoroquinolon", "Ciprofloxacin", T31.cipro, "Table 3.1"),
    r("Fluoroquinolon", "Levofloxacin", T31.levo, "Table 3.1"),
  ];
  const novel: RxItem[] = [
    r("Beta-lactam + ức chế beta-lactamase mới", "Ceftolozan-tazobactam", T21.ctz, "Table 2.1"),
    r("Beta-lactam + ức chế beta-lactamase mới", "Ceftazidim-avibactam", T21.cza, "Table 2.1"),
    r("Beta-lactam + ức chế beta-lactamase mới", "Meropenem-vaborbactam", T21.mev, "Table 2.1"),
    r("Beta-lactam + ức chế beta-lactamase mới", "Imipenem-cilastatin-relebactam", T21.imr, "Table 2.1"),
    r("Cephalosporin siderophore", "Cefiderocol", T21.fdc, "Table 2.1"),
    r("Aminoglycosid thế hệ mới", "Plazomicin", T21.plz, "Table 2.1"),
    r("Aminoglycosid cũ", "Gentamicin, amikacin hoặc tobramycin (một lần mỗi ngày; hiệu chỉnh cùng dược sĩ lâm sàng)", undefined, "Table 1.1"),
  ];
  const blocks: Block[] = [];
  let headline: string;
  if (i.sev !== "none") {
    headline = `${i.sev === "shock" ? "Sốc nhiễm khuẩn" : "Sepsis không sốc"} từ đường tiết niệu: chọn một thuốc trong nhóm ưu tiên đã qua 4 bước; chọn thuốc có tỷ lệ nhạy ≥ ${i.sev === "shock" ? "90" : "80"}% theo kháng sinh đồ tại chỗ.`;
    blocks.push({ title: "Ưu tiên – chọn một", lead: "Khuyến cáo có điều kiện; bằng chứng rất thấp đến trung bình. Ưu tiên kháng sinh kinh nghiệm phù hợp sớm để giảm tử vong; cân nhắc quản lý kháng sinh ở giai đoạn điều trị đích.", items: [...ceph, ...carb, ...ptz, ...fq] });
    blocks.push({ title: "Thay thế – chọn một", lead: "Thuốc mới chủ yếu dành cho sốc nhiễm khuẩn khi cấy trước đây hoặc yếu tố nguy cơ cho thấy thuốc ưu tiên nhiều khả năng không hiệu quả.", items: novel });
    notes.push("Có thể dùng thuốc phổ rộng hơn (phủ P. aeruginosa, Enterococcus, MRSA) khi chưa chắc chẩn đoán nhiễm khuẩn tiết niệu hoặc nghi các tác nhân này.");
    if (i.sev === "shock") notes.push("Sốc nhiễm khuẩn: phối hợp xử trí theo Hướng dẫn Surviving Sepsis Campaign.");
  } else if (!i.oral) {
    headline = "Không sepsis, đường tĩnh mạch: chọn một thuốc trong nhóm ưu tiên; không dùng carbapenem làm lựa chọn đầu.";
    blocks.push({ title: "Ưu tiên – chọn một", lead: "Khuyến cáo có điều kiện; bằng chứng rất thấp đến trung bình. Ưu tiên quản lý kháng sinh vì nguy cơ tử vong thấp.", items: [...ceph, ...ptz, ...fq] });
    blocks.push({ title: "Thay thế – chọn một", items: [...carb, ...novel] });
  } else {
    headline = "Không sepsis, đường uống: fluoroquinolon hoặc cotrimoxazol; beta-lactam uống là lựa chọn thay thế.";
    blocks.push({ title: "Ưu tiên – chọn một", items: [...fq, r("Sulfonamid", "Cotrimoxazol (trimethoprim-sulfamethoxazol)", T31.tmp, "Table 3.1")] });
    blocks.push({ title: "Thay thế – chọn một", lead: "Hiệu quả kém hơn fluoroquinolon hoặc cotrimoxazol trong đa số nghiên cứu (nhất là amoxicilin-acid clavulanic, cephalexin); tốt nhất khi cấy nước tiểu trước đây cho thấy nhạy với thuốc chọn.", items: [
      r("Penicilin + ức chế beta-lactamase", "Amoxicilin-acid clavulanic", T31.amc, "Table 3.1"),
      r("Cephalosporin uống", "Cefpodoxim", T31.cpd, "Table 3.1"),
      r("Cephalosporin uống", "Cefixim", T31.cfx, "Table 3.1"),
      r("Cephalosporin uống", "Ceftibuten", T31.ctb, "Table 3.1"),
      r("Cephalosporin uống", "Cefuroxim", T31.cxm, "Table 3.1"),
      r("Cephalosporin uống", "Cephalexin", T31.lex, "Table 3.1"),
    ] });
    notes.push("Fluoroquinolon có sinh khả dụng đường uống cao; thời điểm chuyển uống phụ thuộc khả năng uống của người bệnh.");
  }
  if (!noFq && fq.length) notes.push("Fluoroquinolon chỉ nên dùng khi không dự kiến kháng thuốc; nếu tỷ lệ kháng tại chỗ > 10% (sốc) hoặc > 20% (sepsis) thì không dùng làm kinh nghiệm. Nếu tỷ lệ E. coli niệu kháng fluoroquinolon > 45%, việc chưa từng dùng fluoroquinolon không bảo đảm chủng còn nhạy.");
  notes.push("Bảng 2.1 là liều dùng trong các thử nghiệm lâm sàng (chức năng thận bình thường), không phải bảng liều khuyến cáo; hiệu chỉnh theo chức năng thận.");
  notes.push("Có kết quả cấy (định danh và kháng sinh đồ): chuyển sớm sang kháng sinh hiệu quả phổ hẹp phù hợp thay vì tiếp tục kháng sinh phổ rộng suốt đợt (có điều kiện; bằng chứng thấp).");
  return { headline, blocks, avoid, notes };
}

export const COURSE: RxItem[] = [
  r("Thời gian (nguồn tiết niệu, đang cải thiện)", "7 ngày thay vì 14 ngày.", undefined, "cUTI CQ 3", "C-L"),
  r("Chuyển đường uống", "Khi lâm sàng cải thiện, uống được và có thuốc uống hiệu quả – kể cả khi có nhiễm khuẩn huyết Gram âm.", undefined, "cUTI CQ 2", "C-L"),
  r("Tiêu chuẩn chuyển uống (IDSA 2026)", "Chủng nhạy với thuốc uống phù hợp; huyết động ổn định; thuốc uống đạt nồng độ tại ổ nhiễm khuẩn; hấp thu tiêu hóa đủ.", undefined, "AMR General"),
  r("Vi khuẩn kháng thuốc (IDSA 2026)", "Thời gian điều trị nhìn chung không khác vi khuẩn nhạy. Nếu kháng sinh kinh nghiệm không có tác dụng trên chủng phân lập: đổi sang thuốc nhạy và tính thời gian từ ngày bắt đầu thuốc có tác dụng.", undefined, "AMR General"),
];

/* ======================= DIEU TRI DICH THEO KIEU HINH (IDSA 2026) ======================= */
export type Pheno = "esbl" | "ampc" | "cre-non" | "kpc" | "ndm" | "oxa48" | "pa-mdr" | "pa-dtr" | "crab" | "steno";
export const PHENO_LABEL: Record<Pheno, string> = {
  esbl: "Enterobacterales sinh ESBL",
  ampc: "Enterobacterales nguy cơ AmpC (E. cloacae, K. aerogenes, C. freundii, H. alvei)",
  "cre-non": "CRE không sinh carbapenemase",
  kpc: "CRE sinh KPC",
  ndm: "CRE sinh NDM (metallo-beta-lactamase)",
  oxa48: "CRE sinh OXA-48",
  "pa-mdr": "P. aeruginosa đa kháng, còn nhạy beta-lactam truyền thống",
  "pa-dtr": "P. aeruginosa khó điều trị (DTR)",
  crab: "Acinetobacter baumannii kháng carbapenem (CRAB)",
  steno: "Stenotrophomonas maltophilia",
};

/* Table 1 – IDSA 2026 (nhiem khuan khac uUTI). */
const A = {
  mero: "1–2 g TM mỗi 8 giờ, truyền 3 giờ (nếu khả thi); ưu tiên 2 g khi béo phì, nhiễm khuẩn thần kinh trung ương, ECMO hoặc ClCr ≥ 130 mL/phút",
  imi: "500 mg TM mỗi 6 giờ truyền 3 giờ (nếu khả thi), hoặc 1.000 mg TM mỗi 8 giờ truyền 1 giờ; ClCr ≥ 90 mL/phút: 1 g mỗi 6 giờ truyền 1 giờ (liều tính theo imipenem)",
  fep: "Nạp 2 g TM truyền 30 phút, sau đó 2 g TM mỗi 8 giờ truyền 3 giờ",
  levo: "750 mg TM hoặc uống mỗi 24 giờ",
  cipro: "400 mg TM mỗi 8 giờ hoặc 750 mg uống mỗi 12 giờ",
  tmp: "8–15 mg/kg/ngày (thành phần trimethoprim) TM hoặc uống, chia mỗi 8–12 giờ",
  cza: "2,5 g (2 g ceftazidim + 0,5 g avibactam) TM mỗi 8 giờ, truyền 3 giờ",
  mev: "4 g (2 g meropenem + 2 g vaborbactam) TM mỗi 8 giờ, truyền 3 giờ",
  imr: "1,25 g (500 mg imipenem + 500 mg cilastatin + 250 mg relebactam) TM mỗi 6 giờ, truyền 30 phút",
  aza: "Nạp 2,67 g (2 g aztreonam + 0,67 g avibactam) TM truyền 3 giờ, sau đó 2 g (1,5 g aztreonam + 0,5 g avibactam) TM mỗi 6 giờ truyền 3 giờ",
  czaAtm: "Ceftazidim-avibactam 2,5 g TM mỗi 8 giờ truyền 3 giờ + aztreonam 2 g TM mỗi 8 giờ truyền 3 giờ, truyền đồng thời qua chạc Y",
  fdc: "2 g TM mỗi 8 giờ, truyền 3 giờ; ClCr ≥ 120 mL/phút: 2 g mỗi 6 giờ",
  ctz: "3 g (2 g ceftolozan + 1 g tazobactam) TM mỗi 8 giờ, truyền 3 giờ",
  amikC: "15 mg/kg TM một lần; liều và khoảng cách liều tiếp theo theo đánh giá dược động học",
  tobraC: "7 mg/kg TM một lần; liều và khoảng cách liều tiếp theo theo đánh giá dược động học",
  sud: "2 g (1 g sulbactam + 1 g durlobactam) TM mỗi 6 giờ, truyền 3 giờ; ClCr ≥ 130 mL/phút: mỗi 4 giờ",
  ams: "Tổng 9 g sulbactam/ngày: 9 g ampicilin-sulbactam (6 g + 3 g) TM mỗi 8 giờ truyền 4 giờ, hoặc 27 g truyền liên tục 24 giờ",
  mino: "200 mg TM hoặc uống mỗi 12 giờ",
  polyB: "Theo đồng thuận quốc tế về polymyxin (Tsuji 2019)",
};

export type DefIn = { pheno: Pheno; urinary: boolean; severe: boolean; hypoalb: boolean; ecoli: boolean };

export function defPlan(i: DefIn): { headline: string; blocks: Block[]; avoid: RxItem[]; notes: string[] } {
  const P = "Ưu tiên";
  const Alt = "Thay thế";
  const avoid: RxItem[] = [];
  const notes: string[] = [];
  const blocks: Block[] = [];
  let headline = "";
  switch (i.pheno) {
    case "esbl": {
      const o = esblPlan({ site: i.urinary ? "cuti" : "other", bacteremia: true, severe: i.severe, hypoalb: i.hypoalb, ecoli: i.ecoli });
      return { headline: o.headline, blocks: o.blocks, avoid: o.avoid, notes: o.notes };
    }
    case "ampc":
      headline = "Cefepim khi MIC ≤ 8 µg/mL và không có ESBL; hoặc thuốc không phải beta-lactam còn nhạy.";
      blocks.push({ title: "Ưu tiên", items: [r(P, "Cefepim (MIC ≤ 8 µg/mL, chưa phát hiện ESBL hoặc gen ESBL)", A.fep, "Q2.3")] });
      blocks.push({ title: "Thuốc không phải beta-lactam – khi nhạy, chọn một", lead: "Không bị AmpC thủy phân; có thể dùng chuyển uống khi đã ổn định lâm sàng.", items: [
        r("Fluoroquinolon", "Ciprofloxacin", A.cipro, "Q2.7"),
        r("Fluoroquinolon", "Levofloxacin", A.levo, "Q2.7"),
        r("Sulfonamid", "Cotrimoxazol", A.tmp, "Q2.7"),
      ] });
      avoid.push(r("Không dùng", "Ceftriaxon, cefotaxim, ceftazidim cho nhiễm khuẩn xâm lấn – kể cả khi kháng sinh đồ báo nhạy (khoảng 20% xuất hiện kháng khi điều trị)", undefined, "Q2.4"));
      avoid.push(r("Không dùng", "Piperacilin-tazobactam cho nhiễm khuẩn xâm lấn", undefined, "Q2.5"));
      avoid.push(r("Không dùng", "Ceftolozan-tazobactam", undefined, "Q2.6"));
      notes.push("Nhiễm khuẩn không nặng, đã kiểm soát ổ nhiễm, đang dùng ceftriaxon theo kinh nghiệm và cải thiện: có thể hoàn tất đợt điều trị.");
      notes.push("Aztreonam-avibactam, ceftazidim-avibactam, imipenem-relebactam, meropenem-vaborbactam, cefiderocol có tác dụng nhưng nên dành cho vi khuẩn kháng carbapenem. Cefepim-enmetazobactam dành cho ESBL hoặc đồng sinh AmpC và ESBL.");
      notes.push("M. morganii, Providencia, S. marcescens: nguy cơ AmpC có ý nghĩa lâm sàng < 5% – chọn theo kháng sinh đồ; khi tải lượng vi khuẩn cao, khó kiểm soát ổ (viêm nội tâm mạc, nhiễm khuẩn thần kinh trung ương) có thể cân nhắc cefepim thay ceftriaxon.");
      break;
    case "cre-non":
      headline = "Nhạy meropenem và imipenem nhưng kháng ertapenem: meropenem hoặc imipenem truyền kéo dài; không nhạy carbapenem nào: beta-lactam mới.";
      blocks.push({ title: "Nhạy meropenem và imipenem (MIC ≤ 1), kháng ertapenem – chọn một", lead: "Theo dõi lâm sàng sát.", items: [
        r(P, "Meropenem truyền kéo dài", A.mero, "Q3.3"),
        r(P, "Imipenem-cilastatin truyền kéo dài", A.imi, "Q3.3"),
      ] });
      blocks.push({ title: "Không nhạy carbapenem nào – chọn một", lead: "Hội đồng hơi ưu tiên ceftazidim-avibactam và imipenem-relebactam.", items: [
        r(P, "Ceftazidim-avibactam", A.cza, "Q3.3"),
        r(P, "Imipenem-cilastatin-relebactam", A.imr, "Q3.3"),
        r(P, "Meropenem-vaborbactam", A.mev, "Q3.3"),
        r(P, "Aztreonam-avibactam", A.aza, "Q3.3"),
        r(Alt, "Cefiderocol", A.fdc, "Q3.3"),
      ] });
      notes.push("Chỉ nhạy một trong hai carbapenem: có thể dùng carbapenem còn nhạy truyền kéo dài nếu không nguy kịch và đã kiểm soát ổ; nguy kịch hoặc ổ nhiễm chưa kiểm soát: cân nhắc beta-lactam + ức chế beta-lactamase mới.");
      break;
    case "kpc":
      headline = "Meropenem-vaborbactam, ceftazidim-avibactam hoặc imipenem-relebactam (hội đồng hơi ưu tiên theo thứ tự này).";
      blocks.push({ title: "Ưu tiên – chọn một", items: [
        r(P, "Meropenem-vaborbactam", A.mev, "Q3.4"),
        r(P, "Ceftazidim-avibactam", A.cza, "Q3.4"),
        r(P, "Imipenem-cilastatin-relebactam", A.imr, "Q3.4"),
      ] });
      blocks.push({ title: "Thay thế – chọn một", items: [r(Alt, "Aztreonam-avibactam", A.aza, "Q3.4"), r(Alt, "Cefiderocol", A.fdc, "Q3.4")] });
      notes.push("Xuất hiện kháng khi điều trị: khoảng 10% với ceftazidim-avibactam, < 3% với meropenem-vaborbactam và imipenem-relebactam.");
      avoid.push(r("Không dùng cho nhiễm khuẩn huyết", "Eravacyclin, tigecyclin (nồng độ huyết thanh thấp)", undefined, "Q3.7"));
      break;
    case "ndm":
      headline = "Aztreonam-avibactam hoặc cefiderocol; không có aztreonam-avibactam thì ceftazidim-avibactam + aztreonam.";
      blocks.push({ title: "Ưu tiên – chọn một", items: [r(P, "Aztreonam-avibactam", A.aza, "Q3.5"), r(P, "Cefiderocol", A.fdc, "Q3.5")] });
      blocks.push({ title: "Thay thế (khi không có aztreonam-avibactam)", items: [r(Alt, "Ceftazidim-avibactam + aztreonam", A.czaAtm, "Q3.5")] });
      avoid.push(r("Không dùng", "Ceftazidim-avibactam, meropenem-vaborbactam, imipenem-relebactam đơn độc (avibactam, vaborbactam, relebactam không ức chế NDM)", undefined, "Q3.5"));
      avoid.push(r("Không dùng cho nhiễm khuẩn huyết", "Eravacyclin, tigecyclin", undefined, "Q3.7"));
      notes.push("E. coli sinh NDM kháng cả aztreonam-avibactam và cefiderocol: dữ liệu hạn chế; cân nhắc phối hợp cá thể hóa (fosfomycin TM, polymyxin B và/hoặc tigecyclin).");
      break;
    case "oxa48":
      headline = "Ceftazidim-avibactam; thay thế: aztreonam-avibactam hoặc cefiderocol.";
      blocks.push({ title: "Ưu tiên", items: [r(P, "Ceftazidim-avibactam", A.cza, "Q3.6")] });
      blocks.push({ title: "Thay thế – chọn một", items: [r(Alt, "Aztreonam-avibactam", A.aza, "Q3.6"), r(Alt, "Cefiderocol", A.fdc, "Q3.6")] });
      avoid.push(r("Không dùng", "Meropenem-vaborbactam, imipenem-relebactam – kể cả khi kháng sinh đồ báo nhạy", undefined, "Q3.6"));
      avoid.push(r("Không dùng cho nhiễm khuẩn huyết", "Eravacyclin, tigecyclin", undefined, "Q3.7"));
      break;
    case "pa-mdr":
      headline = "Beta-lactam truyền thống không phải carbapenem còn nhạy, liều cao truyền kéo dài.";
      blocks.push({ title: "Ưu tiên", lead: "Nhạy cả beta-lactam truyền thống và carbapenem: ưu tiên beta-lactam truyền thống. Kháng carbapenem nhưng nhạy beta-lactam truyền thống: vẫn dùng beta-lactam truyền thống liều cao, truyền kéo dài (ví dụ cefepim 2 g mỗi 8 giờ truyền ≥ 3 giờ).", items: [
        r(P, "Cefepim", A.fep, "Q4.1"),
        r(P, "Ceftazidim", undefined, "Q4.1"),
        r(P, "Piperacilin-tazobactam", undefined, "Q4.1"),
        r(P, "Aztreonam", undefined, "Q4.1"),
        r("Hoặc fluoroquinolon (khi nhạy)", "Ciprofloxacin", A.cipro, "Q4.1"),
        r("Hoặc fluoroquinolon (khi nhạy)", "Levofloxacin", A.levo, "Q4.1"),
      ] });
      notes.push("Nguy kịch hoặc ổ nhiễm chưa kiểm soát, chủng kháng carbapenem: có thể dùng beta-lactam mới còn nhạy (cefiderocol, ceftazidim-avibactam, ceftolozan-tazobactam, imipenem-relebactam).");
      notes.push("Theo dõi đáp ứng sát và làm lại kháng sinh đồ với chủng phân lập sau – P. aeruginosa dễ xuất hiện kháng khi điều trị.");
      break;
    case "pa-dtr":
      if (i.urinary) {
        headline = "Nguồn tiết niệu: cefiderocol, ceftazidim-avibactam, ceftolozan-tazobactam hoặc imipenem-relebactam.";
        blocks.push({ title: "Ưu tiên – chọn một (xếp theo vần)", items: [
          r(P, "Cefiderocol", A.fdc, "Q4.2"), r(P, "Ceftazidim-avibactam", A.cza, "Q4.2"),
          r(P, "Ceftolozan-tazobactam", A.ctz, "Q4.2"), r(P, "Imipenem-cilastatin-relebactam", A.imr, "Q4.2"),
        ] });
        blocks.push({ title: "Thay thế – chọn một", items: [r(Alt, "Amikacin một lần/ngày", A.amikC, "Q4.2"), r(Alt, "Tobramycin một lần/ngày", A.tobraC, "Q4.2")] });
        notes.push("Cefiderocol nên dành cho NDM-E và vi khuẩn không lên men khác nếu có lựa chọn khác.");
      } else {
        headline = "Ngoài đường tiết niệu: ceftazidim-avibactam, ceftolozan-tazobactam hoặc imipenem-relebactam; cefiderocol thay thế.";
        blocks.push({ title: "Ưu tiên – chọn một", items: [
          r(P, "Ceftazidim-avibactam", A.cza, "Q4.3"), r(P, "Ceftolozan-tazobactam (ưu tiên khi viêm phổi)", A.ctz, "Q4.3"),
          r(P, "Imipenem-cilastatin-relebactam", A.imr, "Q4.3"),
        ] });
        blocks.push({ title: "Thay thế", items: [r(Alt, "Cefiderocol", A.fdc, "Q4.3")] });
        avoid.push(r("Không dùng", "Aminoglycosid đơn trị cho nhiễm khuẩn ngoài đường tiết niệu", undefined, "Q4.6"));
      }
      notes.push("Không phối hợp kháng sinh khi đã xác nhận nhạy với một beta-lactam mới. Không beta-lactam nào nhạy: cân nhắc beta-lactam mới có MIC gần ngưỡng nhạy nhất + tobramycin (nếu nhạy), hoặc + polymyxin B.");
      notes.push("Sinh KPC: không dùng ceftolozan-tazobactam. Sinh metallo-beta-lactamase (VIM, NDM, IMP): cefiderocol là ưu tiên.");
      notes.push("Khoảng 20% xuất hiện kháng khi điều trị bằng beta-lactam mới – làm lại kháng sinh đồ với chủng phân lập sau.");
      break;
    case "crab":
      headline = "Sulbactam-durlobactam phối hợp imipenem hoặc meropenem.";
      blocks.push({ title: "Ưu tiên – phối hợp 2 thuốc", items: [
        r("Thuốc 1", "Sulbactam-durlobactam", A.sud, "Q5.1"),
        r("Thuốc 2 – chọn một", "Imipenem-cilastatin", A.imi, "Q5.1"),
        r("Thuốc 2 – chọn một", "Meropenem", A.mero, "Q5.1"),
      ] });
      blocks.push({ title: "Thay thế – chỉ khi kháng sulbactam-durlobactam hoặc trong lúc chờ có thuốc; phối hợp ít nhất 2 thuốc", items: [
        r(Alt, "Ampicilin-sulbactam liều cao (chỉ là điều trị bắc cầu)", A.ams, "Q5.2"),
        r(Alt, "Cefiderocol", A.fdc, "Q5.3"),
        r(Alt, "Minocyclin", A.mino, "Q5.4"),
        r(Alt, "Polymyxin B", A.polyB, "Q5.5"),
      ] });
      notes.push("Kháng sulbactam-durlobactam (MIC ≥ 16/4 µg/mL) hoặc có gen metallo-beta-lactamase: ưu tiên phác đồ không dựa trên sulbactam (phối hợp cefiderocol, minocyclin, polymyxin B hoặc tigecyclin).");
      notes.push("Phân biệt nhiễm khuẩn với cư trú trước khi điều trị.");
      break;
    case "steno":
      headline = "Cefiderocol đơn trị; thay thế: aztreonam-avibactam, levofloxacin, minocyclin hoặc cotrimoxazol – dùng trong phác đồ phối hợp.";
      blocks.push({ title: "Ưu tiên", items: [r(P, "Cefiderocol (đơn trị)", A.fdc, "Q6.1")] });
      blocks.push({ title: "Thay thế – dùng trong phác đồ phối hợp", lead: "Chỉ chuyển đơn trị khi cải thiện rõ, bền vững và đã xác nhận nhạy.", items: [
        r(Alt, "Aztreonam-avibactam (ưu tiên phối hợp)", A.aza, "Q6.2"),
        r(Alt, "Levofloxacin", A.levo, "Q6.3"),
        r(Alt, "Minocyclin", A.mino, "Q6.4"),
        r(Alt, "Cotrimoxazol", A.tmp, "Q6.5"),
      ] });
      avoid.push(r("Không dùng", "Ceftazidim (men L1, L2 nội tại làm mất hoạt tính)", undefined, "Q6.6"));
      notes.push("Không có aztreonam-avibactam: ceftazidim-avibactam + aztreonam là lựa chọn hợp lý.");
      break;
  }
  return { headline, blocks, avoid, notes };
}
