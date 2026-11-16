/*
  Bệnh lây truyền qua đường tình dục – dữ liệu công cụ chọn phác đồ theo CDC.
  Nguồn: Workowski KA và cs. Sexually Transmitted Infections Treatment Guidelines, 2021.
  MMWR Recomm Rep 2021;70(4):1–187 – đọc từ PDF người dùng cung cấp (16/11/2026), các khung
  "Recommended Regimen(s)" / "Alternative Regimen(s)" và mục Special Considerations.
  CDC không xếp mức GRADE cho từng khuyến cáo: phân biệt Khuyến cáo (Recommended) / Thay thế (Alternative).
  Phạm vi: người lớn và vị thành niên; không gồm sơ sinh, trẻ em, sùi mào gà, ký sinh trùng ngoài da.
  ref = vị trí trong văn bản (không hiển thị).
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export type Syn =
  | "gc" | "gcPharynx" | "gcEye" | "dgi"
  | "ct" | "ngu" | "cervicitis" | "mg"
  | "pid" | "epid" | "proctitis"
  | "syphilis" | "chancroid" | "lgv" | "donovanosis" | "herpes"
  | "trich" | "bv" | "vvc";
export type StiBlock = { title: string; lead?: string; items: RxItem[] };
export type StiIn = {
  syn: Syn;
  sub: string;
  pregnant: boolean;
  hiv: boolean;
  pcnAllergy: boolean;
  cephAllergy: boolean;
  heavy: boolean;
  ctNotExcluded: boolean;
};
export type StiOut = { headline: string; blocks: StiBlock[]; avoid: RxItem[]; notes: string[] };

const REC = "Khuyến cáo";
const ALT = "Thay thế";
const r = (role: string, text: string, dose: string | undefined, ref: string): RxItem => ({ role, text, dose, ref });

export const SYN_GROUPS: { label: string; items: { id: Syn; label: string }[] }[] = [
  { label: "Viêm niệu đạo, cổ tử cung", items: [
    { id: "gc", label: "Lậu không biến chứng (cổ tử cung, niệu đạo, trực tràng)" },
    { id: "gcPharynx", label: "Lậu hầu họng" },
    { id: "ct", label: "Nhiễm Chlamydia" },
    { id: "ngu", label: "Viêm niệu đạo không do lậu" },
    { id: "cervicitis", label: "Viêm cổ tử cung" },
    { id: "mg", label: "Mycoplasma genitalium" },
  ] },
  { label: "Lậu lan tỏa, ngoài sinh dục", items: [
    { id: "gcEye", label: "Viêm kết mạc do lậu (người lớn)" },
    { id: "dgi", label: "Nhiễm lậu cầu lan tỏa" },
  ] },
  { label: "Đường sinh dục trên, mào tinh, trực tràng", items: [
    { id: "pid", label: "Viêm vùng chậu (PID)" },
    { id: "epid", label: "Viêm mào tinh hoàn cấp" },
    { id: "proctitis", label: "Viêm trực tràng cấp" },
  ] },
  { label: "Loét sinh dục", items: [
    { id: "syphilis", label: "Giang mai" },
    { id: "herpes", label: "Herpes sinh dục" },
    { id: "chancroid", label: "Hạ cam" },
    { id: "lgv", label: "Hột xoài (lymphogranuloma venereum)" },
    { id: "donovanosis", label: "U hạt bẹn (donovanosis)" },
  ] },
  { label: "Viêm âm đạo", items: [
    { id: "bv", label: "Viêm âm đạo do vi khuẩn" },
    { id: "trich", label: "Trichomonas" },
    { id: "vvc", label: "Nấm Candida âm hộ – âm đạo" },
  ] },
];
export const SYN_LABEL: Record<Syn, string> = Object.fromEntries(SYN_GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label]))) as Record<Syn, string>;

export const SUB_OPTS: Partial<Record<Syn, { label: string; opts: { id: string; label: string }[] }>> = {
  dgi: { label: "Biểu hiện", opts: [{ id: "arthritis", label: "Viêm khớp, hội chứng viêm khớp – viêm da" }, { id: "cns", label: "Viêm màng não, viêm nội tâm mạc" }] },
  mg: { label: "Xét nghiệm kháng macrolid", opts: [{ id: "none", label: "Không có" }, { id: "ms", label: "Nhạy macrolid" }, { id: "mr", label: "Kháng macrolid" }] },
  pid: { label: "Hình thức", opts: [{ id: "out", label: "Tiêm bắp hoặc uống" }, { id: "in", label: "Đường tiêm (nội trú)" }] },
  epid: { label: "Tác nhân nghĩ tới", opts: [{ id: "ctgc", label: "Chlamydia hoặc lậu" }, { id: "enteric", label: "Chlamydia, lậu hoặc vi khuẩn đường ruột (giao hợp hậu môn chủ động)" }, { id: "entericOnly", label: "Chỉ vi khuẩn đường ruột" }] },
  syphilis: { label: "Giai đoạn", opts: [{ id: "ps", label: "Nguyên phát, thứ phát" }, { id: "early", label: "Tiềm ẩn sớm" }, { id: "late", label: "Tiềm ẩn muộn hoặc không rõ thời gian" }, { id: "tertiary", label: "Giai đoạn 3 (dịch não tủy bình thường)" }, { id: "neuro", label: "Thần kinh, mắt, tai" }] },
  herpes: { label: "Tình huống", opts: [{ id: "first", label: "Đợt đầu" }, { id: "suppress", label: "Điều trị ức chế tái phát" }, { id: "episodic", label: "Điều trị từng đợt tái phát" }, { id: "severe", label: "Bệnh nặng, cần nhập viện" }] },
  vvc: { label: "Thể", opts: [{ id: "simple", label: "Không biến chứng" }, { id: "recurrent", label: "Tái phát (≥ 3 đợt/năm)" }, { id: "severe", label: "Nặng" }, { id: "nonalb", label: "Không phải C. albicans" }, { id: "host", label: "Cơ địa suy giảm miễn dịch, đái tháo đường kiểm soát kém" }] },
};
export const defaultSub = (s: Syn): string => SUB_OPTS[s]?.opts[0].id ?? "";

const DOXY7 = "100 mg uống 2 lần/ngày × 7 ngày";
const cro = (heavy: boolean) => (heavy ? "1 g tiêm bắp, liều duy nhất (cân nặng ≥ 150 kg)" : "500 mg tiêm bắp, liều duy nhất (cân nặng < 150 kg)");
const DOXY_PREG = "Doxycyclin chống chỉ định trong 3 tháng giữa và 3 tháng cuối thai kỳ (nguy cơ đổi màu răng).";
const AZI_PREG_CT = r("Chưa loại trừ Chlamydia", "Azithromycin (phác đồ Chlamydia trong thai kỳ)", "1 g uống, liều duy nhất", "Chlamydial Infection During Pregnancy");
const DOXY_CT = r("Chưa loại trừ Chlamydia", "Doxycyclin", DOXY7, "Gonococcal Infections");
const HIV_TEST = "Xét nghiệm HIV và giang mai cho người bệnh; HIV âm tính: tư vấn điều trị dự phòng trước phơi nhiễm (PrEP).";

export function stiPlan(i: StiIn): StiOut {
  const b: StiBlock[] = [];
  const avoid: RxItem[] = [];
  const notes: string[] = [];
  const P = i.pregnant;
  const ct = i.ctNotExcluded ? [P ? AZI_PREG_CT : DOXY_CT] : [];

  switch (i.syn) {
    case "gc": {
      if (P) {
        b.push({ title: "Phác đồ trong thai kỳ", items: [r(REC, "Ceftriaxon", cro(i.heavy), "Gonococcal – Pregnancy"), ...ct] });
        if (i.cephAllergy) notes.push("Thai kỳ, dị ứng cephalosporin hoặc không dùng được ceftriaxon: hội chẩn chuyên gia bệnh truyền nhiễm hoặc chuyên gia bệnh lây truyền qua đường tình dục.");
        notes.push("Gentamicin cần thận trọng trong thai kỳ (nguy cơ dị tật sơ sinh, độc thận, độc tai).");
      } else if (i.cephAllergy) {
        b.push({
          title: "Dị ứng cephalosporin",
          lead: "Nguy cơ dị ứng chéo với penicilin cao nhất ở cephalosporin thế hệ 1 nhưng hiếm (< 1%) ở thế hệ 3 (ceftriaxon, cefixim). Khai thác kỹ tiền sử dị ứng trước.",
          items: [
            r("Nghi dị ứng qua IgE", "Gentamicin + azithromycin", "Gentamicin 240 mg tiêm bắp + azithromycin 2 g uống, cùng liều duy nhất", "Gonococcal – Cephalosporin allergy"),
            r("Không triệu chứng, gyrA hoang dại", "Ciprofloxacin (khi làm được xét nghiệm gyrA xác định còn nhạy)", "500 mg uống, liều duy nhất", "Gonococcal – Cephalosporin allergy"),
          ],
        });
      } else {
        b.push({ title: "Phác đồ khuyến cáo", items: [r(REC, "Ceftriaxon", cro(i.heavy), "Uncomplicated Gonococcal Infection"), ...ct] });
        b.push({
          title: "Thay thế khi không có ceftriaxon",
          items: [
            r(ALT, "Gentamicin + azithromycin", "Gentamicin 240 mg tiêm bắp + azithromycin 2 g uống, cùng liều duy nhất", "Alternative Regimens if Ceftriaxone Is Not Available"),
            r(ALT, "Cefixim", "800 mg uống, liều duy nhất", "Alternative Regimens if Ceftriaxone Is Not Available"),
            ...(i.ctNotExcluded ? [r("Kèm cefixim, chưa loại trừ Chlamydia", "Doxycyclin", DOXY7, "Alternative Regimens")] : []),
          ],
        });
        notes.push("Cefixim 800 mg chỉ là lựa chọn thay thế: nồng độ diệt khuẩn trong máu thấp và ngắn hơn ceftriaxon 500 mg tiêm bắp; hiệu quả hạn chế với lậu hầu họng.");
      }
      avoid.push(r("Không khuyến cáo", "Azithromycin 2 g đơn trị", undefined, "Gonococcal – Treatment"));
      notes.push("Không cần xét nghiệm kiểm tra khỏi bệnh với lậu sinh dục – tiết niệu hoặc trực tràng không biến chứng đã điều trị bằng phác đồ khuyến cáo hoặc thay thế. Xét nghiệm lại 3 tháng sau điều trị.");
      notes.push("Tiêm, uống thuốc tại chỗ và quan sát trực tiếp. Bạn tình trong 60 ngày trước khởi phát hoặc chẩn đoán: khám, xét nghiệm và điều trị giả định (quá 60 ngày: điều trị bạn tình gần nhất).");
      return { headline: P ? "Ceftriaxon tiêm bắp liều duy nhất" : i.cephAllergy ? "Gentamicin + azithromycin" : "Ceftriaxon tiêm bắp liều duy nhất", blocks: b, avoid, notes };
    }
    case "gcPharynx": {
      b.push({ title: "Phác đồ khuyến cáo", items: [r(REC, "Ceftriaxon", cro(i.heavy), "Gonococcal Infection of the Pharynx"), ...(i.ctNotExcluded ? [P ? AZI_PREG_CT : r("Có Chlamydia", "Doxycyclin", DOXY7, "Pharynx")] : [])] });
      notes.push("Không có phác đồ thay thế đáng tin cậy cho lậu hầu họng. Phản vệ hoặc phản ứng nặng (ví dụ Stevens-Johnson) với ceftriaxon: hội chẩn chuyên gia bệnh truyền nhiễm.");
      notes.push("Kiểm tra khỏi bệnh 7–14 ngày sau điều trị bằng nuôi cấy hoặc NAAT (xét nghiệm ở ngày 7 dễ dương tính giả); NAAT dương tính: cố gắng nuôi cấy khẳng định trước khi điều trị lại.");
      return { headline: "Ceftriaxon tiêm bắp liều duy nhất; kiểm tra khỏi bệnh 7–14 ngày", blocks: b, avoid, notes };
    }
    case "gcEye": {
      b.push({ title: "Phác đồ khuyến cáo", items: [r(REC, "Ceftriaxon", "1 g tiêm bắp, liều duy nhất", "Gonococcal Conjunctivitis"), r("Kèm", "Rửa mắt bị bệnh bằng nước muối sinh lý 1 lần", undefined, "Gonococcal Conjunctivitis")] });
      notes.push("Dữ liệu điều trị ở người lớn hạn chế: nên cân nhắc hội chẩn chuyên gia bệnh truyền nhiễm.");
      return { headline: "Ceftriaxon 1 g tiêm bắp liều duy nhất", blocks: b, avoid, notes };
    }
    case "dgi": {
      if (i.sub === "cns") {
        b.push({ title: "Viêm màng não, viêm nội tâm mạc do lậu cầu", items: [r(REC, "Ceftriaxon", "1–2 g tĩnh mạch mỗi 24 giờ", "Gonococcal Meningitis and Endocarditis"), ...(i.ctNotExcluded ? [P ? AZI_PREG_CT : DOXY_CT] : [])] });
        notes.push("Thời gian điều trị chưa được nghiên cứu hệ thống: quyết định cùng chuyên gia bệnh truyền nhiễm, dựa trên kháng sinh đồ.");
      } else {
        b.push({
          title: "Viêm khớp, hội chứng viêm khớp – viêm da",
          items: [
            r(REC, "Ceftriaxon", "1 g tiêm bắp hoặc tĩnh mạch mỗi 24 giờ", "Gonococcal-Related Arthritis"),
            r(ALT, "Cefotaxim", "1 g tĩnh mạch mỗi 8 giờ", "Alternative Regimens"),
            r(ALT, "Ceftizoxim", "1 g mỗi 8 giờ", "Alternative Regimens"),
            ...(i.ctNotExcluded ? [P ? AZI_PREG_CT : DOXY_CT] : []),
            r("Chuyển uống", "Theo kháng sinh đồ, 24–48 giờ sau khi cải thiện rõ; tổng thời gian ≥ 7 ngày", undefined, "Arthritis-Dermatitis Syndrome"),
          ],
        });
      }
      notes.push("Khuyến cáo nhập viện và hội chẩn chuyên gia bệnh truyền nhiễm cho điều trị ban đầu, nhất là khi tuân thủ kém, chẩn đoán chưa chắc, tràn dịch khớp mủ hoặc biến chứng khác. Khám tìm viêm nội tâm mạc, viêm màng não.");
      return { headline: i.sub === "cns" ? "Ceftriaxon 1–2 g tĩnh mạch mỗi 24 giờ" : "Ceftriaxon 1 g mỗi 24 giờ", blocks: b, avoid, notes };
    }
    case "ct": {
      if (P) {
        b.push({ title: "Phác đồ trong thai kỳ", items: [r(REC, "Azithromycin", "1 g uống, liều duy nhất", "Chlamydial Infection During Pregnancy"), r(ALT, "Amoxicilin", "500 mg uống 3 lần/ngày × 7 ngày", "Alternative Regimen")] });
        avoid.push(r("Thai kỳ", "Doxycyclin (3 tháng giữa, 3 tháng cuối)", undefined, "Chlamydial – Pregnancy"));
        avoid.push(r("Không còn khuyến cáo", "Erythromycin", undefined, "Chlamydial – Pregnancy"));
        notes.push("Thai kỳ: kiểm tra khỏi bệnh (ưu tiên NAAT) khoảng 4 tuần sau khi kết thúc điều trị, và xét nghiệm lại 3 tháng sau điều trị.");
      } else {
        b.push({ title: "Phác đồ khuyến cáo", items: [r(REC, "Doxycyclin", DOXY7, "Chlamydial Infection Among Adolescents and Adults"), r(ALT, "Azithromycin", "1 g uống, liều duy nhất", "Alternative Regimens"), r(ALT, "Levofloxacin", "500 mg uống 1 lần/ngày × 7 ngày", "Alternative Regimens")] });
        notes.push("Thất bại vi sinh ở nam giới cao hơn với azithromycin so với doxycyclin.");
        notes.push("Không khuyến cáo kiểm tra khỏi bệnh ở người không mang thai trừ khi nghi tuân thủ kém, còn triệu chứng hoặc tái nhiễm. Xét nghiệm lại khoảng 3 tháng sau điều trị.");
      }
      return { headline: P ? "Azithromycin 1 g uống liều duy nhất" : "Doxycyclin 7 ngày", blocks: b, avoid, notes };
    }
    case "ngu": {
      b.push({ title: "Phác đồ khuyến cáo", items: [r(REC, "Doxycyclin", DOXY7, "Nongonococcal Urethritis"), r(ALT, "Azithromycin", "1 g uống, liều duy nhất", "Alternative Regimens"), r(ALT, "Azithromycin", "500 mg uống liều đầu, sau đó 250 mg/ngày × 4 ngày", "Alternative Regimens")] });
      b.push({
        title: "Viêm niệu đạo dai dẳng hoặc tái phát",
        lead: "Xác định khách quan trước khi dùng thêm kháng sinh; tuân thủ kém hoặc tái phơi nhiễm với bạn tình chưa điều trị: có thể dùng lại phác đồ ban đầu.",
        items: [
          r("Nghĩ T. vaginalis (nam quan hệ với nữ)", "Metronidazol hoặc tinidazol", "Metronidazol 2 g uống liều duy nhất hoặc tinidazol 2 g uống liều duy nhất", "Persistent or Recurrent NGU"),
          r("M. genitalium, không có xét nghiệm kháng", "Doxycyclin rồi moxifloxacin", "Doxycyclin 100 mg uống 2 lần/ngày × 7 ngày, sau đó moxifloxacin 400 mg uống 1 lần/ngày × 7 ngày", "Persistent or Recurrent NGU"),
        ],
      });
      avoid.push(r("Không còn khuyến cáo", "Erythromycin (tác dụng phụ tiêu hóa, số lần dùng)", undefined, "NGU"));
      avoid.push(r("Không còn khuyến cáo", "Levofloxacin (hiệu quả kém hơn)", undefined, "NGU"));
      notes.push("Phát thuốc tại chỗ, quan sát liều đầu. Kiêng quan hệ đến khi người bệnh và bạn tình điều trị xong (hết phác đồ 7 ngày hoặc 7 ngày sau liều duy nhất) và hết triệu chứng.");
      notes.push("Dai dẳng sau điều trị M. genitalium hoặc T. vaginalis: chuyển chuyên gia bệnh truyền nhiễm hoặc tiết niệu.");
      return { headline: "Doxycyclin 7 ngày", blocks: b, avoid, notes };
    }
    case "cervicitis": {
      b.push({ title: "Phác đồ khuyến cáo", items: [r(REC, "Doxycyclin", DOXY7, "Cervicitis"), r(ALT, "Azithromycin", "1 g uống, liều duy nhất", "Alternative Regimen")] });
      notes.push("Cân nhắc điều trị đồng thời lậu nếu người bệnh có nguy cơ lậu hoặc sống ở cộng đồng có tỷ lệ lậu cao.");
      if (P) notes.push(`Thai kỳ: chẩn đoán và điều trị viêm cổ tử cung không khác người không mang thai. ${DOXY_PREG}`);
      notes.push("Dai dẳng sau doxycyclin hoặc azithromycin, đã loại trừ tái phơi nhiễm và tuân thủ kém: cân nhắc xét nghiệm M. genitalium.");
      return { headline: "Doxycyclin 7 ngày", blocks: b, avoid, notes };
    }
    case "mg": {
      const items: RxItem[] =
        i.sub === "ms"
          ? [r(REC, "Doxycyclin rồi azithromycin liều cao", "Doxycyclin 100 mg uống 2 lần/ngày × 7 ngày; sau đó azithromycin 1 g uống liều đầu, rồi 500 mg/ngày × 3 ngày (tổng 2,5 g)", "If M. genitalium Resistance Testing Is Available")]
          : i.sub === "mr"
            ? [r(REC, "Doxycyclin rồi moxifloxacin", "Doxycyclin 100 mg uống 2 lần/ngày × 7 ngày; sau đó moxifloxacin 400 mg uống 1 lần/ngày × 7 ngày", "If M. genitalium Resistance Testing Is Available")]
            : [
                r(REC, "Doxycyclin rồi moxifloxacin", "Doxycyclin 100 mg uống 2 lần/ngày × 7 ngày; sau đó moxifloxacin 400 mg uống 1 lần/ngày × 7 ngày", "If M. genitalium Resistance Testing Is Not Available"),
                r("Không dùng được moxifloxacin", "Doxycyclin rồi azithromycin – chỉ khi kiểm tra khỏi bệnh được và không còn lựa chọn khác", "Doxycyclin 100 mg uống 2 lần/ngày × 7 ngày; sau đó azithromycin 1 g ngày 1, rồi 500 mg/ngày × 3 ngày; kiểm tra khỏi bệnh 21 ngày sau điều trị", "M. genitalium – Treatment"),
              ];
      b.push({ title: "Điều trị 2 giai đoạn", lead: "Ưu tiên điều trị theo xét nghiệm kháng macrolid (tỷ lệ khỏi > 90%). Doxycyclin giảm tải lượng vi khuẩn trước giai đoạn 2.", items });
      b.push({ title: "Viêm vùng chậu có M. genitalium", items: [r("Khi phát hiện M. genitalium", "Moxifloxacin", "400 mg uống 1 lần/ngày × 14 ngày", "M. genitalium – PID")] });
      avoid.push(r("Không dùng", "Azithromycin 1 g liều duy nhất (tỷ lệ kháng macrolid cao)", undefined, "M. genitalium – Treatment"));
      avoid.push(r("Không hiệu quả", "Beta-lactam (penicilin, cephalosporin) – vi khuẩn không có vách", undefined, "M. genitalium – Treatment"));
      notes.push("Không khuyến cáo kiểm tra khỏi bệnh ở người không triệu chứng đã dùng phác đồ khuyến cáo.");
      return { headline: i.sub === "ms" ? "Doxycyclin → azithromycin 2,5 g" : "Doxycyclin → moxifloxacin", blocks: b, avoid, notes };
    }
    case "pid": {
      if (i.sub === "in" || P) {
        b.push({
          title: "Phác đồ đường tiêm khuyến cáo",
          lead: "Chuyển uống thường sau 24–48 giờ cải thiện lâm sàng; áp xe vòi – buồng trứng: theo dõi nội trú ≥ 24 giờ.",
          items: [
            r(REC, "Ceftriaxon + doxycyclin + metronidazol", "Ceftriaxon 1 g TM mỗi 24 giờ + doxycyclin 100 mg uống hoặc TM mỗi 12 giờ + metronidazol 500 mg uống hoặc TM mỗi 12 giờ", "Recommended Parenteral Regimens for PID"),
            r(REC, "Cefotetan + doxycyclin", "Cefotetan 2 g TM mỗi 12 giờ + doxycyclin 100 mg uống hoặc TM mỗi 12 giờ", "Recommended Parenteral Regimens for PID"),
            r(REC, "Cefoxitin + doxycyclin", "Cefoxitin 2 g TM mỗi 6 giờ + doxycyclin 100 mg uống hoặc TM mỗi 12 giờ", "Recommended Parenteral Regimens for PID"),
            r(ALT, "Ampicilin-sulbactam + doxycyclin", "Ampicilin-sulbactam 3 g TM mỗi 6 giờ + doxycyclin 100 mg uống hoặc TM mỗi 12 giờ", "Alternative Parenteral Regimens"),
            r(ALT, "Clindamycin + gentamicin", "Clindamycin 900 mg TM mỗi 8 giờ + gentamicin liều nạp 2 mg/kg TM hoặc TB, rồi duy trì 1,5 mg/kg mỗi 8 giờ (có thể thay bằng 3–5 mg/kg 1 lần/ngày)", "Alternative Parenteral Regimens"),
            r("Chuyển uống", "Doxycyclin + metronidazol đến đủ 14 ngày", "Doxycyclin 100 mg uống 2 lần/ngày + metronidazol 500 mg uống 2 lần/ngày", "Parenteral Treatment"),
            r("Sau clindamycin + gentamicin", "Clindamycin hoặc doxycyclin đến đủ 14 ngày; có áp xe vòi – buồng trứng: clindamycin hoặc metronidazol kèm doxycyclin", "Clindamycin 450 mg uống 4 lần/ngày hoặc doxycyclin 100 mg uống 2 lần/ngày; metronidazol 500 mg uống 2 lần/ngày", "Alternative Parenteral Regimens"),
          ],
        });
        notes.push("Doxycyclin nên dùng đường uống khi có thể (truyền tĩnh mạch gây đau); doxycyclin và metronidazol uống có sinh khả dụng tương đương đường tĩnh mạch.");
        if (P) notes.push("Thai kỳ nghi viêm vùng chậu: nguy cơ cao bệnh tật cho mẹ và sinh non – nhập viện, kháng sinh tĩnh mạch, hội chẩn chuyên gia bệnh truyền nhiễm.");
      } else {
        b.push({
          title: "Phác đồ tiêm bắp hoặc uống khuyến cáo",
          lead: "Viêm vùng chậu nhẹ – trung bình: hiệu quả tương đương đường tĩnh mạch. Không đáp ứng sau 72 giờ: đánh giá lại và chuyển đường tĩnh mạch.",
          items: [
            r(REC, "Ceftriaxon + doxycyclin + metronidazol", `Ceftriaxon ${i.heavy ? "1 g" : "500 mg"} tiêm bắp liều duy nhất + doxycyclin 100 mg uống 2 lần/ngày × 14 ngày + metronidazol 500 mg uống 2 lần/ngày × 14 ngày`, "Recommended IM or Oral Regimens for PID"),
            r(REC, "Cefoxitin + probenecid + doxycyclin + metronidazol", "Cefoxitin 2 g tiêm bắp + probenecid 1 g uống, cùng liều duy nhất; doxycyclin 100 mg uống 2 lần/ngày × 14 ngày + metronidazol 500 mg uống 2 lần/ngày × 14 ngày", "Recommended IM or Oral Regimens for PID"),
            r(REC, "Cephalosporin thế hệ 3 đường tiêm khác (ceftizoxim, cefotaxim) + doxycyclin + metronidazol", "Doxycyclin 100 mg uống 2 lần/ngày × 14 ngày + metronidazol 500 mg uống 2 lần/ngày × 14 ngày", "Recommended IM or Oral Regimens for PID"),
          ],
        });
        notes.push(`Ceftriaxon: cân nặng ≥ 150 kg dùng 1 g. ${i.heavy ? "" : "Đang hiển thị liều cho cân nặng < 150 kg."}`.trim());
        notes.push("Cân nhắc nhập viện khi: chưa loại trừ cấp cứu ngoại khoa (ví dụ viêm ruột thừa); áp xe vòi – buồng trứng; mang thai; bệnh nặng, buồn nôn, nôn hoặc nhiệt độ miệng > 38,5 °C; không theo được hoặc không dung nạp phác đồ uống ngoại trú; không đáp ứng kháng sinh uống.");
      }
      if (i.cephAllergy && !P) {
        b.push({
          title: "Dị ứng cephalosporin",
          lead: "Chỉ khi tỷ lệ lậu cộng đồng và nguy cơ lậu cá nhân thấp, theo dõi được. Xét nghiệm lậu trước khi điều trị.",
          items: [
            r(ALT, "Levofloxacin hoặc moxifloxacin + metronidazol", "Levofloxacin 500 mg uống 1 lần/ngày hoặc moxifloxacin 400 mg uống 1 lần/ngày + metronidazol 500 mg uống 2 lần/ngày × 14 ngày", "Alternative IM or Oral Regimens"),
            r(ALT, "Azithromycin + metronidazol", "Azithromycin 500 mg TM/ngày × 1–2 liều, sau đó 250 mg uống/ngày + metronidazol 500 mg 2 lần/ngày × 12–14 ngày", "Alternative IM or Oral Regimens"),
          ],
        });
        notes.push("Dị ứng chéo với penicilin không đáng kể giữa phần lớn cephalosporin thế hệ 2 (cefoxitin) và toàn bộ thế hệ 3 (ceftriaxon). Cấy lậu dương tính: điều trị theo kháng sinh đồ; lậu kháng quinolon hoặc chỉ có NAAT: hội chẩn chuyên gia bệnh truyền nhiễm.");
      }
      avoid.push(r("Không khuyến cáo", "Phác đồ có quinolon (lậu cầu kháng quinolon), trừ tình huống dị ứng cephalosporin nêu trên", undefined, "Alternative IM or Oral Regimens"));
      notes.push("Cải thiện lâm sàng trong 3 ngày. Xét nghiệm lậu, Chlamydia, HIV, giang mai; viêm vùng chậu do Chlamydia hoặc lậu: xét nghiệm lại 3 tháng sau điều trị. Bạn tình trong 60 ngày trước: khám, xét nghiệm, điều trị giả định Chlamydia và lậu.");
      return { headline: i.sub === "in" || P ? "Đường tiêm: ceftriaxon + doxycyclin + metronidazol" : "Ceftriaxon tiêm bắp + doxycyclin + metronidazol 14 ngày", blocks: b, avoid, notes };
    }
    case "epid": {
      const c = `Ceftriaxon ${i.heavy ? "1 g" : "500 mg"} tiêm bắp liều duy nhất`;
      const items =
        i.sub === "ctgc"
          ? [r(REC, "Ceftriaxon + doxycyclin", `${c} + doxycyclin 100 mg uống 2 lần/ngày × 10 ngày`, "Recommended Regimens for Epididymitis")]
          : i.sub === "enteric"
            ? [r(REC, "Ceftriaxon + levofloxacin", `${c} + levofloxacin 500 mg uống 1 lần/ngày × 10 ngày`, "Recommended Regimens for Epididymitis")]
            : [r(REC, "Levofloxacin", "500 mg uống 1 lần/ngày × 10 ngày", "Recommended Regimens for Epididymitis")];
      b.push({ title: "Phác đồ khuyến cáo", lead: "Điều trị giả định ngay khi khám, trước khi có kết quả xét nghiệm.", items });
      if (i.sub === "entericOnly") notes.push("Levofloxacin đơn trị khi nhiều khả năng chỉ do vi khuẩn đường ruột và đã loại trừ lậu bằng nhuộm Gram, MB hoặc GV – gồm nam giới sau sinh thiết tuyến tiền liệt, thắt ống dẫn tinh, thủ thuật đường tiết niệu.");
      notes.push("Ceftriaxon: cân nặng ≥ 150 kg dùng 1 g. Điều trị theo kết quả cấy và kháng sinh đồ.");
      if (i.cephAllergy || i.pcnAllergy) notes.push("Dị ứng chéo với penicilin không đáng kể với mọi cephalosporin thế hệ 3. Phác đồ thay thế chưa được nghiên cứu: hội chẩn chuyên gia bệnh truyền nhiễm nếu cần.");
      notes.push("Hỗ trợ: nằm nghỉ, nâng bìu, thuốc chống viêm không steroid đến khi hết sốt và viêm tại chỗ. Không cải thiện sau 72 giờ: đánh giá lại chẩn đoán và điều trị. Xét nghiệm HIV và giang mai.");
      return { headline: items[0].text, blocks: b, avoid, notes };
    }
    case "proctitis": {
      b.push({
        title: "Phác đồ khuyến cáo",
        lead: "Điều trị giả định khi có dịch tiết hậu môn – trực tràng, bạch cầu đa nhân trên nhuộm Gram, hoặc lâm sàng phù hợp ở người có quan hệ qua đường hậu môn khi không soi được.",
        items: [
          r(REC, "Ceftriaxon + doxycyclin", `Ceftriaxon ${i.heavy ? "1 g" : "500 mg"} tiêm bắp liều duy nhất + doxycyclin 100 mg uống 2 lần/ngày × 7 ngày`, "Recommended Regimen for Acute Proctitis"),
          r("Nghi hột xoài", "Kéo dài doxycyclin đến 21 ngày", "100 mg uống 2 lần/ngày × 21 ngày", "Recommended Regimen for Acute Proctitis"),
          r("Loét quanh hậu môn đau hoặc loét niêm mạc", "Thêm phác đồ herpes sinh dục", undefined, "Acute Proctitis"),
        ],
      });
      notes.push("Kéo dài doxycyclin 21 ngày khi có dịch máu, loét quanh hậu môn hoặc loét niêm mạc, hoặc mót rặn, kèm xét nghiệm Chlamydia trực tràng dương tính. Ceftriaxon: cân nặng ≥ 150 kg dùng 1 g.");
      if (P) notes.push(DOXY_PREG);
      return { headline: "Ceftriaxon + doxycyclin 7 ngày", blocks: b, avoid, notes };
    }
    case "syphilis": {
      const st = i.sub;
      const bpg1 = "2,4 triệu đơn vị tiêm bắp, liều duy nhất";
      const bpg3 = "Tổng 7,2 triệu đơn vị: 3 liều 2,4 triệu đơn vị tiêm bắp, mỗi tuần 1 liều";
      if (st === "neuro") {
        b.push({
          title: "Giang mai thần kinh, giang mai mắt, giang mai tai",
          items: [
            r(REC, "Penicilin G kết tinh dạng nước", "18–24 triệu đơn vị/ngày: 3–4 triệu đơn vị TM mỗi 4 giờ hoặc truyền liên tục × 10–14 ngày", "Recommended Regimen for Neurosyphilis"),
            r(ALT + " (bảo đảm tuân thủ)", "Penicilin G procain + probenecid", "Penicilin G procain 2,4 triệu đơn vị tiêm bắp 1 lần/ngày + probenecid 500 mg uống 4 lần/ngày, cùng × 10–14 ngày", "Alternative Regimen"),
            r("Có thể thêm sau đó", "Benzathin penicilin G", "2,4 triệu đơn vị tiêm bắp mỗi tuần × 1–3 tuần", "Neurosyphilis"),
          ],
        });
        if (i.pcnAllergy && !P) b.push({ title: "Dị ứng penicilin", items: [r(ALT, "Ceftriaxon (dữ liệu hạn chế)", "1–2 g/ngày tiêm bắp hoặc tĩnh mạch × 10–14 ngày", "Neurosyphilis – Penicillin Allergy")] });
        if (i.pcnAllergy && !P) notes.push("Lo ngại an toàn của ceftriaxon: test da khẳng định dị ứng penicilin và giải mẫn cảm penicilin cùng chuyên gia.");
      } else if (st === "tertiary") {
        b.push({ title: "Giang mai giai đoạn 3, dịch não tủy bình thường", items: [r(REC, "Benzathin penicilin G", bpg3, "Recommended Regimen for Tertiary Syphilis")] });
        notes.push("Chọc dò dịch não tủy trước điều trị.");
        if (i.pcnAllergy) notes.push("Dị ứng penicilin: điều trị cùng chuyên gia bệnh truyền nhiễm.");
      } else {
        const late = st === "late";
        b.push({ title: late ? "Tiềm ẩn muộn hoặc không rõ thời gian" : st === "early" ? "Tiềm ẩn sớm" : "Nguyên phát, thứ phát", items: [r(REC, "Benzathin penicilin G", late ? bpg3 : bpg1, late || st === "early" ? "Recommended Regimens for Latent Syphilis" : "Recommended Regimen for Primary and Secondary Syphilis")] });
        if (late) notes.push("Chậm 1 liều trong đợt tiêm hằng tuần: khoảng cách 10–14 ngày giữa các liều có thể chấp nhận trước khi phải bắt đầu lại từ đầu.");
        if (i.pcnAllergy && !P) {
          b.push({
            title: "Dị ứng penicilin, không mang thai",
            lead: "Tuân thủ hoặc theo dõi không bảo đảm: giải mẫn cảm và điều trị bằng benzathin penicilin G. Theo dõi lâm sàng và huyết thanh chặt chẽ.",
            items: late
              ? [r(ALT, "Doxycyclin", "100 mg uống 2 lần/ngày × 28 ngày", "Latent Syphilis – Penicillin Allergy"), r(ALT, "Tetracyclin", "500 mg uống 4 lần/ngày × 28 ngày", "Latent Syphilis – Penicillin Allergy")]
              : [
                  r(ALT, "Doxycyclin", "100 mg uống 2 lần/ngày × 14 ngày", "Primary and Secondary – Penicillin Allergy"),
                  r(ALT, "Tetracyclin", "500 mg uống 4 lần/ngày × 14 ngày", "Primary and Secondary – Penicillin Allergy"),
                  r(ALT, "Ceftriaxon (liều, thời gian tối ưu chưa xác định)", "1 g/ngày tiêm bắp hoặc tĩnh mạch × 10 ngày", "Primary and Secondary – Penicillin Allergy"),
                ],
          });
        }
      }
      if (P) {
        notes.push("Thai kỳ: chỉ penicilin G có hiệu quả được chứng minh; dị ứng penicilin phải giải mẫn cảm rồi điều trị bằng penicilin G.");
        if (st === "ps" || st === "early") notes.push("Thai kỳ, giang mai nguyên phát, thứ phát hoặc tiềm ẩn sớm: có thể tiêm thêm liều benzathin penicilin G 2,4 triệu đơn vị tiêm bắp 1 tuần sau liều đầu.");
        notes.push("Điều trị ở nửa sau thai kỳ: nguy cơ chuyển dạ sớm hoặc suy thai do phản ứng Jarisch-Herxheimer – dặn khám sản khi sốt, cơn co hoặc giảm cử động thai.");
      }
      if (i.hiv) notes.push("Nhiễm HIV: cùng phác đồ penicilin theo giai đoạn. Phác đồ thay thế penicilin chưa được nghiên cứu đầy đủ ở người nhiễm HIV.");
      avoid.push(r("Không dùng", "Azithromycin (đột biến kháng macrolid, thất bại điều trị)", undefined, "Primary and Secondary – Penicillin Allergy"));
      notes.push("Có triệu chứng thần kinh hoặc mắt, tai: đánh giá theo giang mai thần kinh, mắt, tai. Xét nghiệm HIV khi chẩn đoán.");
      return { headline: st === "neuro" ? "Penicilin G tĩnh mạch 10–14 ngày" : st === "late" || st === "tertiary" ? "Benzathin penicilin G 3 liều mỗi tuần" : "Benzathin penicilin G 2,4 triệu đơn vị 1 liều", blocks: b, avoid, notes };
    }
    case "chancroid": {
      const items = [
        r(REC, "Azithromycin", "1 g uống, liều duy nhất", "Recommended Regimens for Chancroid"),
        r(REC, "Ceftriaxon", "250 mg tiêm bắp, liều duy nhất", "Recommended Regimens for Chancroid"),
        ...(P ? [] : [r(REC, "Ciprofloxacin", "500 mg uống 2 lần/ngày × 3 ngày", "Recommended Regimens for Chancroid")]),
        r(REC, "Erythromycin base", "500 mg uống 3 lần/ngày × 7 ngày", "Recommended Regimens for Chancroid"),
      ];
      b.push({ title: "Phác đồ khuyến cáo", items });
      if (P) avoid.push(r("Thai kỳ, cho con bú", "Ciprofloxacin", undefined, "Chancroid – Pregnancy"));
      notes.push("Khám lại 3–7 ngày sau khi bắt đầu điều trị. Nam giới chưa cắt bao quy đầu và người nhiễm HIV đáp ứng kém hơn. " + HIV_TEST);
      notes.push("Bạn tình có quan hệ trong 10 ngày trước khi khởi phát triệu chứng: khám và điều trị.");
      return { headline: "Azithromycin 1 g hoặc ceftriaxon 250 mg liều duy nhất", blocks: b, avoid, notes };
    }
    case "lgv": {
      if (P) {
        b.push({ title: "Thai kỳ, cho con bú", items: [r("Có thể dùng", "Erythromycin base (tác dụng phụ tiêu hóa thường gặp)", "500 mg uống 4 lần/ngày × 21 ngày", "LGV – Pregnancy"), r("Có thể hữu ích", "Azithromycin (liều giả định, chưa có dữ liệu)", "1 g uống mỗi tuần × 3 tuần", "LGV – Pregnancy")] });
        notes.push("Thai kỳ: kiểm tra khỏi bệnh 4 tuần sau xét nghiệm NAAT C. trachomatis dương tính ban đầu.");
      } else {
        b.push({ title: "Phác đồ", items: [r(REC, "Doxycyclin", "100 mg uống 2 lần/ngày × 21 ngày", "Recommended Regimen for LGV"), r(ALT, "Azithromycin", "1 g uống mỗi tuần × 3 tuần", "Alternative Regimens"), r(ALT, "Erythromycin base", "500 mg uống 4 lần/ngày × 21 ngày", "Alternative Regimens")] });
        notes.push("Azithromycin mỗi tuần × 3 tuần chưa được thẩm định: có thể kiểm tra khỏi bệnh bằng NAAT C. trachomatis 4 tuần sau điều trị.");
      }
      notes.push("Xét nghiệm lại Chlamydia khoảng 3 tháng sau điều trị. Xét nghiệm bệnh lây truyền khác, nhất là HIV, lậu, giang mai.");
      return { headline: P ? "Erythromycin 21 ngày" : "Doxycyclin 21 ngày", blocks: b, avoid, notes };
    }
    case "donovanosis": {
      const until = "và đến khi tổn thương lành hoàn toàn";
      if (P) {
        b.push({ title: "Thai kỳ, cho con bú: phác đồ macrolid", items: [r(REC, "Azithromycin", `1 g uống mỗi tuần hoặc 500 mg/ngày, > 3 tuần ${until}`, "Granuloma Inguinale – Pregnancy"), r(ALT, "Erythromycin base", `500 mg uống 4 lần/ngày, > 3 tuần ${until}`, "Granuloma Inguinale – Pregnancy")] });
        avoid.push(r("Thai kỳ", "Doxycyclin (đổi màu răng, nguy cơ chưa rõ)", undefined, "Granuloma Inguinale – Pregnancy"));
        avoid.push(r("3 tháng cuối, cho con bú", "Sulfamethoxazol-trimethoprim (vàng da nhân ở trẻ thiếu G6PD)", undefined, "Granuloma Inguinale – Pregnancy"));
      } else {
        b.push({
          title: "Phác đồ",
          items: [
            r(REC, "Azithromycin", `1 g uống mỗi tuần hoặc 500 mg/ngày, > 3 tuần ${until}`, "Recommended Regimen for Granuloma Inguinale"),
            r(ALT, "Doxycyclin", `100 mg uống 2 lần/ngày, ít nhất 3 tuần ${until}`, "Alternative Regimens"),
            r(ALT, "Erythromycin base", `500 mg uống 4 lần/ngày, > 3 tuần ${until}`, "Alternative Regimens"),
            r(ALT, "Sulfamethoxazol-trimethoprim", `1 viên hàm lượng gấp đôi (160/800 mg) uống 2 lần/ngày, > 3 tuần ${until}`, "Alternative Regimens"),
          ],
        });
      }
      notes.push("Không cải thiện trong vài ngày đầu: có thể thêm một kháng sinh khác. Xét nghiệm HIV. Bạn tình trong 60 ngày trước: khám và đề nghị điều trị.");
      return { headline: "Azithromycin > 3 tuần, đến khi lành tổn thương", blocks: b, avoid, notes };
    }
    case "herpes": {
      const s = i.sub;
      if (s === "severe") {
        b.push({ title: "Bệnh nặng hoặc biến chứng cần nhập viện", lead: "Lan tỏa, viêm phổi, viêm gan, biến chứng thần kinh trung ương (viêm màng não, viêm não).", items: [r(REC, "Aciclovir tĩnh mạch", "5–10 mg/kg TM mỗi 8 giờ", "Genital Herpes – Severe Disease")] });
        notes.push("Viêm não cần đợt điều trị tĩnh mạch dài hơn (14–21 ngày). Suy thận: chỉnh liều aciclovir.");
      } else if (P && s === "suppress") {
        b.push({ title: "Ức chế tái phát trong thai kỳ (bắt đầu từ tuần 36)", items: [r(REC, "Aciclovir", "400 mg uống 3 lần/ngày", "Suppression of Recurrent Genital Herpes Among Pregnant Women"), r(REC, "Valaciclovir", "500 mg uống 2 lần/ngày", "Suppression of Recurrent Genital Herpes Among Pregnant Women")] });
      } else if (i.hiv && (s === "suppress" || s === "episodic")) {
        b.push(s === "suppress"
          ? { title: "Ức chế hằng ngày ở người nhiễm HIV", items: [r(REC, "Aciclovir", "400–800 mg uống 2–3 lần/ngày", "Daily Suppression Among Persons with HIV"), r(REC, "Famciclovir", "500 mg uống 2 lần/ngày", "Daily Suppression Among Persons with HIV"), r(REC, "Valaciclovir", "500 mg uống 2 lần/ngày", "Daily Suppression Among Persons with HIV")] }
          : { title: "Từng đợt ở người nhiễm HIV", items: [r(REC, "Aciclovir", "400 mg uống 3 lần/ngày × 5–10 ngày", "Episodic Infection Among Persons with HIV"), r(REC, "Famciclovir", "500 mg uống 2 lần/ngày × 5–10 ngày", "Episodic Infection Among Persons with HIV"), r(REC, "Valaciclovir", "1 g uống 2 lần/ngày × 5–10 ngày", "Episodic Infection Among Persons with HIV")] });
      } else if (s === "first") {
        b.push({ title: "Đợt đầu", items: [r(REC, "Aciclovir", "400 mg uống 3 lần/ngày × 7–10 ngày", "First Clinical Episode"), r(REC, "Famciclovir", "250 mg uống 3 lần/ngày × 7–10 ngày", "First Clinical Episode"), r(REC, "Valaciclovir", "1 g uống 2 lần/ngày × 7–10 ngày", "First Clinical Episode")] });
        notes.push("Có thể kéo dài nếu chưa lành sau 10 ngày. Aciclovir 200 mg uống 5 lần/ngày cũng hiệu quả nhưng không khuyến cáo vì số lần dùng.");
      } else if (s === "suppress") {
        b.push({ title: "Ức chế tái phát HSV-2", items: [r(REC, "Aciclovir", "400 mg uống 2 lần/ngày", "Suppression of Recurrent HSV-2"), r(REC, "Valaciclovir", "500 mg uống 1 lần/ngày", "Suppression of Recurrent HSV-2"), r(REC, "Valaciclovir", "1 g uống 1 lần/ngày", "Suppression of Recurrent HSV-2"), r(REC, "Famciclovir", "250 mg uống 2 lần/ngày", "Suppression of Recurrent HSV-2")] });
        notes.push("Valaciclovir 500 mg 1 lần/ngày có thể kém hiệu quả hơn khi tái phát thường xuyên (≥ 10 đợt/năm). Famciclovir có vẻ kém hơn trong ức chế thải virus.");
      } else {
        b.push({
          title: "Từng đợt tái phát HSV-2",
          lead: "Hiệu quả nhất khi bắt đầu trong 1 ngày đầu xuất hiện tổn thương hoặc giai đoạn tiền triệu.",
          items: [
            r(REC, "Aciclovir", "800 mg uống 2 lần/ngày × 5 ngày", "Episodic Therapy for Recurrent HSV-2"),
            r(REC, "Aciclovir", "800 mg uống 3 lần/ngày × 2 ngày", "Episodic Therapy for Recurrent HSV-2"),
            r(REC, "Famciclovir", "1 g uống 2 lần/ngày × 1 ngày", "Episodic Therapy for Recurrent HSV-2"),
            r(REC, "Famciclovir", "500 mg uống 1 lần, sau đó 250 mg 2 lần/ngày × 2 ngày", "Episodic Therapy for Recurrent HSV-2"),
            r(REC, "Famciclovir", "125 mg uống 2 lần/ngày × 5 ngày", "Episodic Therapy for Recurrent HSV-2"),
            r(REC, "Valaciclovir", "500 mg uống 2 lần/ngày × 3 ngày", "Episodic Therapy for Recurrent HSV-2"),
            r(REC, "Valaciclovir", "1 g uống 1 lần/ngày × 5 ngày", "Episodic Therapy for Recurrent HSV-2"),
          ],
        });
      }
      if (P) notes.push("Aciclovir được xem là an toàn ở mọi giai đoạn thai kỳ. Ức chế tái phát khuyến cáo bắt đầu từ tuần 36.");
      return { headline: s === "severe" ? "Aciclovir tĩnh mạch 5–10 mg/kg mỗi 8 giờ" : "Aciclovir, famciclovir hoặc valaciclovir uống", blocks: b, avoid, notes };
    }
    case "trich": {
      b.push({
        title: "Phác đồ khuyến cáo",
        items: [
          r(REC + " – nữ", "Metronidazol", "500 mg uống 2 lần/ngày × 7 ngày", "Recommended Regimen for Trichomoniasis Among Women"),
          r(REC + " – nam", "Metronidazol", "2 g uống, liều duy nhất", "Recommended Regimen for Trichomoniasis Among Men"),
          ...(P ? [] : [r(ALT, "Tinidazol", "2 g uống, liều duy nhất", "Alternative Regimen for Women and Men")]),
        ],
      });
      b.push({
        title: "Thất bại điều trị",
        items: [
          r("Nữ, tái phơi nhiễm", "Lặp lại metronidazol", "500 mg uống 2 lần/ngày × 7 ngày", "Recurrent Trichomoniasis"),
          r("Nữ, không tái phơi nhiễm", "Metronidazol hoặc tinidazol", "2 g uống 1 lần/ngày × 7 ngày", "Recurrent Trichomoniasis"),
          r("Nam, tái phơi nhiễm", "Metronidazol", "2 g uống, liều duy nhất", "Recurrent Trichomoniasis"),
          r("Nam, không tái phơi nhiễm", "Metronidazol", "500 mg uống 2 lần/ngày × 7 ngày", "Recurrent Trichomoniasis"),
        ],
      });
      avoid.push(r("Không khuyến cáo", "Gel metronidazol (không đạt nồng độ điều trị ở niệu đạo, tuyến quanh âm đạo)", undefined, "Trichomoniasis"));
      if (P) {
        avoid.push(r("Thai kỳ", "Tinidazol", undefined, "Trichomoniasis – Pregnancy"));
        notes.push("Thai kỳ có triệu chứng: xét nghiệm và điều trị ở mọi tuổi thai; metronidazol nguy cơ thấp cho thai.");
      }
      if (i.hiv) notes.push("Phụ nữ nhiễm HIV: metronidazol 500 mg uống 2 lần/ngày × 7 ngày (liều duy nhất 2 g kém hiệu quả hơn); xét nghiệm lại 3 tháng sau điều trị.");
      notes.push("Dị ứng qua IgE với nitroimidazol: giải mẫn cảm metronidazol cùng chuyên gia dị ứng.");
      return { headline: "Metronidazol: nữ 7 ngày, nam 2 g liều duy nhất", blocks: b, avoid, notes };
    }
    case "bv": {
      b.push({
        title: "Phác đồ khuyến cáo",
        items: [
          r(REC, "Metronidazol", "500 mg uống 2 lần/ngày × 7 ngày", "Recommended Regimens for Bacterial Vaginosis"),
          r(REC, "Gel metronidazol 0,75%", "1 ống bơm đầy (5 g) đặt âm đạo, 1 lần/ngày × 5 ngày", "Recommended Regimens for Bacterial Vaginosis"),
          r(REC, "Kem clindamycin 2%", "1 ống bơm đầy (5 g) đặt âm đạo trước khi ngủ × 7 ngày", "Recommended Regimens for Bacterial Vaginosis"),
        ],
      });
      b.push({
        title: "Phác đồ thay thế",
        items: [
          r(ALT, "Clindamycin", "300 mg uống 2 lần/ngày × 7 ngày", "Alternative Regimens"),
          r(ALT, "Viên đặt clindamycin", "100 mg đặt âm đạo trước khi ngủ × 3 ngày", "Alternative Regimens"),
          ...(P
            ? []
            : [
                r(ALT, "Secnidazol cốm", "2 g uống, liều duy nhất", "Alternative Regimens"),
                r(ALT, "Tinidazol", "2 g uống 1 lần/ngày × 2 ngày, hoặc 1 g uống 1 lần/ngày × 5 ngày", "Alternative Regimens"),
              ]),
        ],
      });
      if (P) {
        avoid.push(r("Thai kỳ", "Tinidazol, secnidazol, kem clindamycin 2% Clindesse, gel metronidazol 1,3%, viên đặt metronidazol 750 mg", undefined, "Bacterial Vaginosis – Pregnancy"));
        notes.push("Điều trị mọi phụ nữ mang thai có triệu chứng; dùng được mọi phác đồ khuyến cáo cho người không mang thai, cùng clindamycin uống và viên đặt clindamycin.");
      }
      notes.push("Kem và viên đặt clindamycin có tá dược dầu – có thể làm yếu bao cao su latex và màng ngăn âm đạo. Không cần kiêng rượu khi dùng metronidazol.");
      notes.push("Dị ứng hoặc không dung nạp metronidazol, tinidazol: ưu tiên kem clindamycin đặt âm đạo.");
      notes.push("Tái phát nhiều lần sau phác đồ khuyến cáo: gel metronidazol 0,75% hoặc viên đặt âm đạo metronidazol 750 mg, 2 lần/tuần trong > 3 tháng, giúp giảm tái phát. Không khuyến cáo điều trị thường quy cho bạn tình.");
      return { headline: "Metronidazol 7 ngày, gel metronidazol hoặc kem clindamycin", blocks: b, avoid, notes };
    }
    case "vvc": {
      const s = i.sub;
      if (P) {
        b.push({ title: "Thai kỳ", items: [r(REC, "Azol đặt âm đạo", "Dùng tại chỗ × 7 ngày", "Vulvovaginal Candidiasis – Pregnancy")] });
        avoid.push(r("Thai kỳ", "Fluconazol uống (kể cả 150 mg liều duy nhất): liên quan sẩy thai, dị tật bẩm sinh", undefined, "Vulvovaginal Candidiasis – Pregnancy"));
      } else if (s === "recurrent") {
        b.push({
          title: "Tái phát (C. albicans)",
          items: [
            r("Khởi đầu", "Azol tại chỗ hoặc fluconazol uống", "Azol tại chỗ × 7–14 ngày, hoặc fluconazol 100 mg, 150 mg hoặc 200 mg uống mỗi 3 ngày × 3 liều (ngày 1, 4, 7)", "Recurrent VVC"),
            r("Duy trì", "Fluconazol", "100 mg, 150 mg hoặc 200 mg uống mỗi tuần × 6 tháng", "Recurrent VVC"),
          ],
        });
        notes.push("Không theo được phác đồ duy trì: cân nhắc thuốc tại chỗ dùng ngắt quãng. Cấy dương tính dù đang duy trì: làm kháng nấm đồ, phối hợp chuyên gia.");
      } else if (s === "severe") {
        b.push({ title: "Nặng (ban đỏ, phù, trầy xước, nứt nẻ âm hộ lan rộng)", items: [r(REC, "Azol tại chỗ", "× 7–14 ngày", "Severe VVC"), r(REC, "Fluconazol", "150 mg uống 2 liều, liều thứ 2 sau liều đầu 72 giờ", "Severe VVC")] });
      } else if (s === "nonalb") {
        b.push({ title: "Không phải C. albicans", items: [r(REC, "Azol không phải fluconazol (uống hoặc tại chỗ)", "× 7–14 ngày", "Non–albicans VVC"), r("Tái phát", "Acid boric viên nang gelatin", "600 mg đặt âm đạo 1 lần/ngày × 3 tuần", "Non–albicans VVC")] });
        notes.push("Tái phát sau acid boric: chuyển chuyên gia.");
      } else if (s === "host") {
        b.push({ title: "Cơ địa suy giảm miễn dịch", items: [r(REC, "Phác đồ azol thông thường, kéo dài", "× 7–14 ngày", "Complicated VVC – Compromised Host")] });
        notes.push("Cần điều chỉnh các yếu tố nguy cơ có thể thay đổi được.");
      } else {
        b.push({
          title: "Không biến chứng",
          lead: "Đợt ngắn thuốc tại chỗ (liều duy nhất, 1–3 ngày) hiệu quả.",
          items: [
            r(REC, "Clotrimazol kem 1%", "5 g đặt âm đạo/ngày × 7–14 ngày", "Recommended Regimens for VVC"),
            r(REC, "Clotrimazol kem 2%", "5 g đặt âm đạo/ngày × 3 ngày", "Recommended Regimens for VVC"),
            r(REC, "Miconazol kem 2%", "5 g đặt âm đạo/ngày × 7 ngày", "Recommended Regimens for VVC"),
            r(REC, "Miconazol kem 4%", "5 g đặt âm đạo/ngày × 3 ngày", "Recommended Regimens for VVC"),
            r(REC, "Miconazol viên đặt 100 mg", "1 viên/ngày × 7 ngày", "Recommended Regimens for VVC"),
            r(REC, "Miconazol viên đặt 200 mg", "1 viên/ngày × 3 ngày", "Recommended Regimens for VVC"),
            r(REC, "Miconazol viên đặt 1.200 mg", "1 viên × 1 ngày", "Recommended Regimens for VVC"),
            r(REC, "Tioconazol mỡ 6,5%", "5 g đặt âm đạo, 1 lần duy nhất", "Recommended Regimens for VVC"),
            r(REC, "Butoconazol kem 2% (dạng bám dính 1 liều)", "5 g đặt âm đạo, 1 lần duy nhất", "Recommended Regimens for VVC"),
            r(REC, "Terconazol kem 0,4%", "5 g đặt âm đạo/ngày × 7 ngày", "Recommended Regimens for VVC"),
            r(REC, "Terconazol kem 0,8%", "5 g đặt âm đạo/ngày × 3 ngày", "Recommended Regimens for VVC"),
            r(REC, "Terconazol viên đặt 80 mg", "1 viên/ngày × 3 ngày", "Recommended Regimens for VVC"),
            r(REC + " – uống", "Fluconazol", "150 mg uống, liều duy nhất", "Recommended Regimens for VVC"),
          ],
        });
        notes.push("Kem và viên đặt có tá dược dầu – có thể làm yếu bao cao su latex và màng ngăn. Không điều trị khi chỉ cấy thấy Candida mà không có triệu chứng.");
      }
      if (!P && (s === "recurrent" || s === "severe" || s === "nonalb" || s === "host")) notes.push("Thể có biến chứng: cấy hoặc PCR dịch âm đạo để khẳng định và định danh Candida không phải albicans.");
      if (i.hiv) notes.push("Nhiễm HIV: điều trị không khác người không nhiễm HIV.");
      return { headline: P ? "Azol tại chỗ 7 ngày" : s === "recurrent" ? "Khởi đầu kéo dài, rồi fluconazol mỗi tuần × 6 tháng" : s === "simple" ? "Azol tại chỗ ngắn ngày hoặc fluconazol 150 mg liều duy nhất" : "Azol kéo dài 7–14 ngày", blocks: b, avoid, notes };
    }
  }
}
