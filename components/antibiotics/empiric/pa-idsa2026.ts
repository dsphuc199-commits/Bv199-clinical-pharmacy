/*
  Pseudomonas aeruginosa (nhạy thuốc, kháng carbapenem, DTR) – dữ liệu công cụ chọn kháng sinh theo
  IDSA 2026 Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections
  (Tamma PD và cs., Clin Infect Dis 2026; doi:10.1093/cid/ciag481), Section 4 (Question 4.1–4.7),
  Table 1 (liều người lớn, chức năng gan – thận bình thường), Table 2 (ngưỡng nhạy CLSI 2026).
  Đọc từ bản PDF người dùng cung cấp ngày 15/11/2026. IDSA không xếp mức GRADE.
  Thuốc không có trong Table 1 (ceftazidim, piperacilin-tazobactam, aztreonam đơn độc) -> để trống liều.
  ref = vị trí trong văn bản (không hiển thị).
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export type PaBlock = { title: string; lead?: string; items: RxItem[] };
export type PaPheno = "susceptible" | "crpa" | "dtr";
export type PaSite = "uuti" | "cuti" | "other";
export type PaCarb = "none" | "kpc" | "mbl";
export type PaIn = { pheno: PaPheno; severe: boolean; site: PaSite; pneumonia: boolean; carb: PaCarb; noActiveBL: boolean };
export type PaOut = { headline: string; usage: string; blocks: PaBlock[]; avoid: RxItem[]; notes: string[] };

const r = (role: string, text: string, dose: string | undefined, ref: string): RxItem => ({ role, text, dose, ref });

/* Table 1 – IDSA 2026 */
export const PA_DOSE = {
  fep: "Nạp 2 g TM truyền 30 phút, sau đó 2 g TM mỗi 8 giờ truyền 3 giờ",
  fepU: "1 g TM mỗi 8 giờ, truyền 30 phút",
  mero: "1–2 g TM mỗi 8 giờ, truyền 3 giờ (nếu khả thi); ưu tiên 2 g khi béo phì, nhiễm khuẩn thần kinh trung ương, ECMO hoặc ClCr ≥ 130 mL/phút",
  imi: "500 mg TM mỗi 6 giờ truyền 3 giờ (nếu khả thi), hoặc 1.000 mg TM mỗi 8 giờ truyền 1 giờ; ClCr ≥ 90 mL/phút: 1 g mỗi 6 giờ truyền 1 giờ (liều tính theo imipenem)",
  cipro: "400 mg TM mỗi 8 giờ hoặc 750 mg uống mỗi 12 giờ",
  levo: "750 mg TM hoặc uống mỗi 24 giờ",
  fdc: "2 g TM mỗi 8 giờ, truyền 3 giờ; ClCr ≥ 120 mL/phút: 2 g mỗi 6 giờ, truyền 3 giờ",
  cza: "2,5 g (2 g ceftazidim + 0,5 g avibactam) TM mỗi 8 giờ, truyền 3 giờ",
  ctz: "3 g (2 g ceftolozan + 1 g tazobactam) TM mỗi 8 giờ, truyền 3 giờ",
  ctzU: "1,5 g (1 g ceftolozan + 0,5 g tazobactam) TM mỗi 8 giờ, truyền 1 giờ",
  imr: "1,25 g (500 mg imipenem + 500 mg cilastatin + 250 mg relebactam) TM mỗi 6 giờ, truyền 30 phút",
  amikU: "15 mg/kg TM, liều duy nhất",
  amikC: "15 mg/kg TM một lần; liều và khoảng cách liều tiếp theo theo đánh giá dược động học",
  tobraU: "5 mg/kg TM, liều duy nhất",
  tobraC: "7 mg/kg TM một lần; liều và khoảng cách liều tiếp theo theo đánh giá dược động học",
  polymyxin: "Theo đồng thuận quốc tế về polymyxin (Tsuji 2019)",
  czaAtm: "Ceftazidim-avibactam 2,5 g TM mỗi 8 giờ truyền 3 giờ + aztreonam 2 g TM mỗi 8 giờ truyền 3 giờ, truyền đồng thời qua chạc Y",
};
const D = PA_DOSE;

export const PHENO_TEXT: Record<PaPheno, string> = {
  susceptible: "P. aeruginosa nhạy beta-lactam truyền thống và carbapenem",
  crpa: "P. aeruginosa kháng carbapenem, còn nhạy beta-lactam truyền thống",
  dtr: "P. aeruginosa khó điều trị (DTR)",
};
const SITE_TEXT: Record<PaSite, string> = { uuti: "viêm bàng quang không biến chứng", cuti: "nhiễm khuẩn tiết niệu phức tạp", other: "nhiễm khuẩn ngoài đường tiết niệu" };
export const paDx = (i: PaIn) =>
  i.pheno === "dtr"
    ? `Nhiễm khuẩn do ${PHENO_TEXT.dtr}${i.carb === "kpc" ? " sinh KPC" : i.carb === "mbl" ? " sinh metallo-beta-lactamase (NDM, VIM, IMP)" : ""} – ${SITE_TEXT[i.site]}${i.site === "other" && i.pneumonia ? " (viêm phổi)" : ""}`
    : `Nhiễm khuẩn do ${PHENO_TEXT[i.pheno]}`;

export function paPlan(i: PaIn): PaOut {
  let blocks: PaBlock[] = [];
  const avoid: RxItem[] = [];
  const notes: string[] = [];
  let headline = "";
  let usage = "Đơn trị – chọn một thuốc còn nhạy; không phối hợp thường quy.";

  if (i.pheno === "susceptible") {
    headline = "Ưu tiên beta-lactam truyền thống không phải carbapenem (hoặc fluoroquinolon) còn nhạy; để dành carbapenem.";
    blocks.push({ title: "Ưu tiên – chọn một thuốc còn nhạy (xếp theo vần)", lead: "Nên truyền kéo dài (3–4 giờ): dữ liệu lâm sàng cho thấy kết quả tốt hơn so với truyền chuẩn 30 phút trong nhiễm P. aeruginosa.", items: [
      r("Ưu tiên", "Aztreonam", undefined, "Q4.1"),
      r("Ưu tiên", "Cefepim", D.fep, "Q4.1"),
      r("Ưu tiên", "Ceftazidim", undefined, "Q4.1"),
      r("Ưu tiên", "Piperacilin-tazobactam", undefined, "Q4.1"),
      r("Hoặc fluoroquinolon (khi nhạy)", "Ciprofloxacin", D.cipro, "Q4.1 Rationale"),
      r("Hoặc fluoroquinolon (khi nhạy)", "Levofloxacin", D.levo, "Q4.1 Rationale"),
    ] });
    blocks.push({ title: "Không ưu tiên khi các thuốc trên còn nhạy", items: [
      r("Để dành", "Carbapenem (meropenem, imipenem-cilastatin): dùng carbapenem cho P. aeruginosa liên quan nguy cơ xuất hiện kháng cao hơn, không cải thiện kết quả lâm sàng", undefined, "Q4.1 Rationale"),
    ] });
    notes.push("Viêm bàng quang không biến chứng: liều cefepim 1 g TM mỗi 8 giờ truyền 30 phút; ciprofloxacin 400 mg TM mỗi 12 giờ hoặc 500 mg uống mỗi 12 giờ (Table 1).");
  } else if (i.pheno === "crpa") {
    headline = "Beta-lactam truyền thống còn nhạy, liều cao, truyền kéo dài; nguy kịch hoặc ổ nhiễm chưa kiểm soát có thể dùng beta-lactam mới còn nhạy.";
    blocks.push({ title: "Ưu tiên – beta-lactam truyền thống còn nhạy, liều cao truyền kéo dài", lead: "Ví dụ cefepim 2 g TM mỗi 8 giờ, truyền ≥ 3 giờ. Kiểu hình này thường do giảm biểu hiện hoặc biến đổi porin OprD; chiếm ít nhất 40% P. aeruginosa kháng carbapenem.", items: [
      r("Ưu tiên", "Cefepim", D.fep, "Q4.1"),
      r("Ưu tiên", "Ceftazidim", undefined, "Q4.1"),
      r("Ưu tiên", "Piperacilin-tazobactam", undefined, "Q4.1"),
      r("Ưu tiên", "Aztreonam", undefined, "Q4.1"),
      r("Hoặc fluoroquinolon (khi nhạy)", "Ciprofloxacin", D.cipro, "Q4.1 Rationale"),
      r("Hoặc fluoroquinolon (khi nhạy)", "Levofloxacin", D.levo, "Q4.1 Rationale"),
    ] });
    if (i.severe)
      blocks.push({ title: "Nguy kịch hoặc ổ nhiễm chưa kiểm soát – cũng hợp lý: beta-lactam mới còn nhạy", lead: "Hội đồng ưu tiên để dành các thuốc này cho nhiễm khuẩn kháng thuốc về sau; hợp lý khi bệnh nguy kịch hoặc có ổ nhiễm chưa kiểm soát (ví dụ áp xe ổ bụng lớn).", items: [
        r("Thay thế", "Cefiderocol", D.fdc, "Q4.1"),
        r("Thay thế", "Ceftazidim-avibactam", D.cza, "Q4.1"),
        r("Thay thế", "Ceftolozan-tazobactam", D.ctz, "Q4.1"),
        r("Thay thế", "Imipenem-cilastatin-relebactam", D.imr, "Q4.1"),
      ] });
    notes.push("Bằng chứng so sánh hiệu quả cho kiểu hình kháng carbapenem nhưng còn nhạy beta-lactam truyền thống còn hạn chế; cách tối ưu chưa rõ.");
  } else if (i.carb === "kpc") {
    headline = "Sinh KPC: cefiderocol, ceftazidim-avibactam hoặc imipenem-relebactam – chọn theo kháng sinh đồ; không dùng ceftolozan-tazobactam.";
    blocks.push({ title: "Ưu tiên – chọn theo kháng sinh đồ", lead: "Dữ liệu về hoạt tính trên P. aeruginosa sinh KPC còn hạn chế: một nghiên cứu 44 chủng có 48% kháng ceftazidim-avibactam và 75% kháng imipenem-relebactam.", items: [
      r("Ưu tiên", "Cefiderocol", D.fdc, "Q4.4"),
      r("Ưu tiên", "Ceftazidim-avibactam", D.cza, "Q4.4"),
      r("Ưu tiên", "Imipenem-cilastatin-relebactam", D.imr, "Q4.4"),
    ] });
    avoid.push(r("Không dùng", "Ceftolozan-tazobactam – tazobactam không ức chế KPC", undefined, "Q4.4"));
  } else if (i.carb === "mbl") {
    headline = "Sinh metallo-beta-lactamase (NDM, VIM, IMP): cefiderocol; ceftazidim-avibactam + aztreonam chỉ khi kháng cefiderocol.";
    usage = "Cefiderocol đơn trị; chỉ khi kháng cefiderocol mới dùng ceftazidim-avibactam phối hợp aztreonam.";
    blocks.push({ title: "Ưu tiên", items: [r("Ưu tiên", "Cefiderocol", D.fdc, "Q4.4")] });
    blocks.push({ title: "Chỉ khi chủng kháng cefiderocol", lead: "Dữ liệu lâm sàng chỉ từ các loạt ca nhỏ.", items: [r("Thay thế", "Ceftazidim-avibactam + aztreonam", D.czaAtm, "Q4.4")] });
    avoid.push(r("Không dùng", "Ceftazidim-avibactam, ceftolozan-tazobactam, imipenem-relebactam – các chất ức chế beta-lactamase này không tác dụng trên MBL", undefined, "Q4.4"));
    avoid.push(r("Không dùng", "Aztreonam-avibactam – hoạt tính hạn chế trên P. aeruginosa sinh MBL (bơm tống thuốc MexAB-OprM); chưa có ngưỡng nhạy CLSI/FDA", undefined, "Q4.4"));
    notes.push("Đã ghi nhận P. aeruginosa sinh MBL kháng cefiderocol, khi đó không còn beta-lactam nào có tác dụng.");
  } else if (i.site === "uuti") {
    headline = "Viêm bàng quang do DTR rất hiếm; các lựa chọn có thể dùng được liệt kê dưới đây.";
    blocks.push({ title: "Lựa chọn có thể dùng (không xếp thứ tự)", items: [
      r("Lựa chọn", "Amikacin liều duy nhất", D.amikU, "Q4.2"),
      r("Lựa chọn", "Tobramycin liều duy nhất", D.tobraU, "Q4.2"),
      r("Lựa chọn", "Cefiderocol (cân nhắc để dành – như với nhiễm khuẩn tiết niệu phức tạp)", D.fdc, "Q4.2"),
      r("Lựa chọn", "Ceftazidim-avibactam", D.cza, "Q4.2"),
      r("Lựa chọn", "Ceftolozan-tazobactam", D.ctzU, "Q4.2"),
      r("Lựa chọn", "Imipenem-cilastatin-relebactam", D.imr, "Q4.2"),
      r("Lựa chọn", "Colistin (không dùng polymyxin B – chỉ colistin chuyển thành dạng hoạt tính trong đường tiết niệu)", D.polymyxin, "Q4.2"),
    ] });
  } else if (i.site === "cuti") {
    headline = "Cefiderocol, ceftazidim-avibactam, ceftolozan-tazobactam hoặc imipenem-relebactam; amikacin hoặc tobramycin một lần/ngày là thay thế.";
    blocks.push({ title: "Ưu tiên – chọn một (xếp theo vần, không theo thứ tự ưu tiên)", lead: "Chưa đủ dữ liệu để ưu tiên thuốc nào. Do cefiderocol có tác dụng riêng trên Enterobacterales sinh NDM và vi khuẩn không lên men khác, nên cân nhắc để dành cefiderocol cho các nhiễm khuẩn kháng thuốc đó.", items: [
      r("Ưu tiên", "Cefiderocol", D.fdc, "Q4.2"),
      r("Ưu tiên", "Ceftazidim-avibactam", D.cza, "Q4.2"),
      r("Ưu tiên", "Ceftolozan-tazobactam", D.ctz, "Q4.2"),
      r("Ưu tiên", "Imipenem-cilastatin-relebactam", D.imr, "Q4.2"),
    ] });
    blocks.push({ title: "Thay thế – một lần/ngày", lead: "Đạt nồng độ cao ở nhu mô thận, hữu ích để hoàn tất đợt điều trị; lưu ý độc tính thận phụ thuộc thời gian dùng.", items: [
      r("Thay thế", "Amikacin", D.amikC, "Q4.2"),
      r("Thay thế", "Tobramycin", D.tobraC, "Q4.2"),
    ] });
    notes.push("Plazomicin không có hoạt tính tốt hơn amikacin trên P. aeruginosa; chưa có ngưỡng nhạy CLSI/FDA cho P. aeruginosa.");
  } else {
    headline = i.pneumonia
      ? "Viêm phổi do DTR: ceftolozan-tazobactam là ưu tiên; ceftazidim-avibactam, imipenem-relebactam cũng là ưu tiên; cefiderocol thay thế."
      : "Ceftazidim-avibactam, ceftolozan-tazobactam hoặc imipenem-relebactam; cefiderocol thay thế.";
    const ctz = r(i.pneumonia ? "Ưu tiên (viêm phổi)" : "Ưu tiên", "Ceftolozan-tazobactam", D.ctz, "Q4.3");
    blocks.push({ title: i.pheno === "dtr" && i.pneumonia ? "Ưu tiên – viêm phổi: ceftolozan-tazobactam được ưu tiên hơn" : "Ưu tiên – chọn một", ...(i.pneumonia ? { lead: "Ceftolozan đạt nồng độ dịch lót biểu mô phế nang khoảng 50% nồng độ huyết tương và vượt 4 µg/mL suốt khoảng đưa liều; ceftazidim và avibactam chỉ khoảng 30%." } : {}), items: [
      ...(i.pneumonia ? [ctz] : []),
      r("Ưu tiên", "Ceftazidim-avibactam", D.cza, "Q4.3"),
      ...(i.pneumonia ? [] : [ctz]),
      r("Ưu tiên", "Imipenem-cilastatin-relebactam (chủng DTR có thể ít nhạy hơn hai thuốc kia; ít dữ liệu lâm sàng hơn)", D.imr, "Q4.3"),
    ] });
    blocks.push({ title: "Thay thế", lead: "Khi không dùng được thuốc ưu tiên do kháng hoặc không dung nạp: cefiderocol chưa cho thấy vượt trội so với phác đồ khác cho P. aeruginosa kháng thuốc.", items: [r("Thay thế", "Cefiderocol", D.fdc, "Q4.3")] });
    avoid.push(r("Không dùng", "Aminoglycosid đơn trị cho nhiễm khuẩn ngoài đường tiết niệu", undefined, "Q4.6"));
  }

  if (i.pheno === "dtr") {
    if (i.noActiveBL) {
      if (i.carb !== "mbl") {
        const nonBL = (it: RxItem) => /^(Amikacin|Tobramycin|Colistin)/.test(it.text);
        blocks = blocks.map((b) => ({ ...b, items: b.items.filter(nonBL) })).filter((b) => b.items.length > 0);
        if (i.carb === "none" && i.site === "uuti") {
          headline = "Không beta-lactam mới nào nhạy: amikacin hoặc tobramycin liều duy nhất, hoặc colistin – khi nhạy.";
          usage = "Đơn trị bằng thuốc không phải beta-lactam còn nhạy.";
        } else if (i.carb === "none" && i.site === "cuti") {
          headline = "Không beta-lactam mới nào nhạy: amikacin hoặc tobramycin một lần/ngày (thay thế), hoặc phối hợp tobramycin/polymyxin B với beta-lactam mới có MIC gần ngưỡng nhạy nhất.";
          usage = "Aminoglycosid một lần/ngày (nhiễm khuẩn tiết niệu), hoặc phối hợp theo Question 4.6.";
        } else {
          headline = "Không beta-lactam mới nào nhạy: phối hợp tobramycin (nếu nhạy) hoặc polymyxin B với beta-lactam mới có MIC gần ngưỡng nhạy nhất.";
          usage = "Phối hợp – không còn beta-lactam nào nhạy in vitro (Question 4.6).";
        }
      }
      if (!(i.carb === "none" && i.site === "uuti")) blocks.push({ title: "Không beta-lactam nào nhạy in vitro – phối hợp", lead: "Chọn beta-lactam mới có MIC gần ngưỡng nhạy nhất. Chưa có dữ liệu chứng minh cải thiện kết quả.", items: [
        r("Phối hợp", "Tobramycin (nếu nhạy) + beta-lactam mới có MIC gần ngưỡng nhạy nhất. Ví dụ: ceftazidim-avibactam và ceftolozan-tazobactam MIC > 128/4 µg/mL, imipenem-relebactam MIC 4/4 µg/mL (trung gian) → imipenem-relebactam + tobramycin", undefined, "Q4.6"),
        r("Phối hợp", "Nếu không nhạy tobramycin: polymyxin B + beta-lactam mới. Ngoài đường tiết niệu, ưu tiên polymyxin B hơn colistin (dùng ở dạng có hoạt tính, nồng độ huyết tương ổn định hơn, có thể ít độc thận hơn)", D.polymyxin, "Q4.6"),
      ] });
      if (i.site === "other" && i.pneumonia)
        notes.push("Viêm phổi, không beta-lactam mới nào có tác dụng in vitro và đáp ứng với điều trị toàn thân chưa tốt: có thể dùng chọn lọc kháng sinh khí dung bổ trợ (tobramycin, amikacin, colistin methanesulfonat); lưu ý co thắt phế quản, tổn thương thanh quản, viêm phổi quá mẫn (Q4.7).");
    } else {
      notes.push("Không phối hợp kháng sinh khi đã xác nhận nhạy với cefiderocol, ceftazidim-avibactam, ceftolozan-tazobactam hoặc imipenem-relebactam: không cải thiện kết quả, tăng tác dụng bất lợi (Q4.6). Phối hợp kinh nghiệm (ví dụ thêm tobramycin) có thể hợp lý trước khi có kháng sinh đồ.");
      if (i.site === "other" && i.pneumonia) notes.push("Không dùng thường quy kháng sinh khí dung khi đã có beta-lactam toàn thân còn nhạy – không có lợi ích về sống còn (Q4.7).");
    }
    if (i.carb === "none") notes.push("Kháng đồng thời ceftazidim-avibactam, ceftolozan-tazobactam và imipenem-relebactam: nghĩ tới chủng sinh MBL (VIM thường gặp nhất ở P. aeruginosa tại Hoa Kỳ). Phát hiện gen carbapenemase không thay thế kháng sinh đồ.");
  }
  return { headline, usage, blocks, avoid, notes };
}

/* Định nghĩa, theo dõi, ngưỡng nhạy – hiển thị chung */
export const PA_DEFS: RxItem[] = [
  r("Đa kháng (MDR)", "Không nhạy với ít nhất một kháng sinh trong ít nhất 3 nhóm thường có tác dụng: penicilin, cephalosporin, carbapenem, fluoroquinolon, aminoglycosid", undefined, "Section 4"),
  r("Khó điều trị (DTR)", "Không nhạy với TẤT CẢ: aztreonam, cefepim, ceftazidim, ciprofloxacin, imipenem, levofloxacin, meropenem, piperacilin-tazobactam", undefined, "Section 4"),
  r("Kháng sinh đồ", "Chủng DTR: đề nghị phòng xét nghiệm làm kháng sinh đồ cho cả 4 thuốc cefiderocol, ceftazidim-avibactam, ceftolozan-tazobactam, imipenem-relebactam (hoạt tính thay đổi giữa các thuốc)", undefined, "Section 4"),
];
export const PA_MONITOR: RxItem[] = [
  r("Theo dõi", "Theo dõi sát đáp ứng lâm sàng; làm lại kháng sinh đồ với chủng phân lập sau từ cùng người bệnh, hoặc khi tái nhiễm nghi do DTR", undefined, "Q4.1, Q4.5"),
  r("Kháng mới – thuốc truyền thống", "767 đợt nhiễm khuẩn huyết do P. aeruginosa, xuất hiện kháng trong 30 ngày: ceftazidim 12%, imipenem 27%, meropenem 15%, piperacilin-tazobactam 8%", undefined, "Q4.1"),
  r("Kháng mới – beta-lactam mới", "Khoảng 20% chủng xuất hiện kháng khi điều trị bằng beta-lactam mới; khoảng 24% với ceftazidim-avibactam hoặc ceftolozan-tazobactam; kháng chéo giữa hai thuốc này > 50%", undefined, "Q4.5"),
  r("Kháng mới – cefiderocol, imipenem-relebactam", "MIC cefiderocol tăng ở khoảng 15% chủng sau khi phơi nhiễm ceftazidim-avibactam hoặc ceftolozan-tazobactam; < 10% xuất hiện kháng cefiderocol khi điều trị. Imipenem-relebactam: không ghi nhận kháng trong 2 thử nghiệm (50 người bệnh), khoảng 24% trong 2 nghiên cứu quan sát (46 người bệnh)", undefined, "Q4.5"),
];
export const PA_BREAKPOINTS: [string, string][] = [
  ["Aztreonam", "≤ 8"], ["Cefepim", "≤ 8"], ["Ceftazidim", "≤ 8"], ["Piperacilin-tazobactam", "≤ 16/4"],
  ["Meropenem", "≤ 2"], ["Imipenem", "≤ 2"], ["Ciprofloxacin", "≤ 0,5"], ["Levofloxacin", "≤ 1"],
  ["Ceftazidim-avibactam", "≤ 8/4"], ["Ceftolozan-tazobactam", "≤ 4/4"], ["Imipenem-relebactam", "≤ 2/4"], ["Cefiderocol", "≤ 4"],
  ["Amikacin", "≤ 16 (chỉ nhiễm khuẩn tiết niệu)"], ["Tobramycin", "≤ 1"],
];
export const PA_GENERAL: string[] = [
  "Các khuyến cáo giả định đã định danh vi khuẩn và xác nhận nhạy in vitro với thuốc được chọn. Khi nhiều thuốc hiệu quả tương đương, chọn theo độ an toàn, chi phí, cách dùng và danh mục thuốc.",
  "Phân biệt nhiễm khuẩn với cư trú trước khi điều trị.",
  "Thời gian điều trị: IDSA không đưa khuyến cáo cụ thể; nhìn chung không khác nhiễm khuẩn do vi khuẩn nhạy. Nếu thuốc kinh nghiệm không có tác dụng trên chủng phân lập: đổi sang thuốc nhạy và tính thời gian từ ngày bắt đầu thuốc có tác dụng.",
  "Chuyển đường uống khi: chủng nhạy với thuốc uống phù hợp; huyết động ổn định; thuốc uống đạt nồng độ tại ổ nhiễm; hấp thu tiêu hóa đủ.",
  "Liều theo Table 1: người lớn, chức năng gan, thận bình thường; một số liều khác liều FDA khuyến cáo. Hướng dẫn áp dụng cho cả trẻ em nhưng chỉ có liều người lớn; liều trẻ em của các beta-lactam mới xem Lockowitz và cs. 2025.",
];
