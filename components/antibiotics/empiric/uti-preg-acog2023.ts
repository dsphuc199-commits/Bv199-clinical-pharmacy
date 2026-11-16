/*
  Nhiễm khuẩn tiết niệu thai kỳ – dữ liệu công cụ chọn kháng sinh.
  Nguồn (đọc từ PDF người dùng cung cấp, 16/11/2026):
  - ACOG Clinical Consensus No. 4 (08/2023). Obstet Gynecol 2023;142:435–45 – Summary of Consensus
    Recommendations, Bảng 1 (khuẩn niệu không triệu chứng, viêm bàng quang), Bảng 3 (viêm thận bể thận), phần
    Treatment và dự phòng. ACOG Clinical Consensus không xếp mức GRADE: mỗi khuyến cáo được hội đồng bỏ phiếu,
    đạt ngưỡng đồng thuận ≥ 75% -> grade "ACOG".
  - IDSA 2019 khuẩn niệu không triệu chứng (Nicolle LE và cs. Clin Infect Dis 2019;68:e83–e110) – mục III.
    Mức GRADE giữ nguyên: mạnh/yếu; cao/trung bình/thấp/rất thấp -> "S-M", "W-L".
  ref = vị trí trong văn bản (không hiển thị).
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export type UtiForm = "asb" | "cystitis" | "pyelo" | "suppress";
export type Trimester = "t1" | "t23";
export type BlAllergy = "none" | "low" | "high";
export type UtiBlock = { title: string; lead?: string; items: RxItem[] };
export type UtiIn = { form: UtiForm; trimester: Trimester; allergy: BlAllergy; empiric: boolean; smxRes: boolean; g6pd: boolean; afterPyelo: boolean };
export type UtiOut = { headline: string; blocks: UtiBlock[]; avoid: RxItem[]; notes: string[] };

const r = (role: string, text: string, dose: string | undefined, grade: string | undefined, ref: string): RxItem => ({ role, text, dose, grade, ref });
const ACOG = "ACOG";
const T1 = "ACOG Bảng 1";
const T3 = "ACOG Bảng 3";

export const FORM_OPTS: { id: UtiForm; label: string; criteria: string }[] = [
  { id: "asb", label: "Khuẩn niệu không triệu chứng", criteria: "Cấy nước tiểu ≥ 100.000 CFU/mL, không có triệu chứng. Số khuẩn lạc thấp hơn có thể do nhiễm bẩn từ âm hộ, âm đạo và không cần điều trị." },
  { id: "cystitis", label: "Viêm bàng quang cấp", criteria: "Có triệu chứng (tiểu buốt, tiểu máu, tiểu nhiều lần, tiểu đêm); tổng phân tích nước tiểu hỗ trợ; khẳng định khi cấy nước tiểu ≥ 100.000 CFU/mL." },
  { id: "pyelo", label: "Viêm thận bể thận", criteria: "Sốt ≥ 38,0 °C kèm xét nghiệm nước tiểu gợi ý nhiễm khuẩn tiết niệu; đau hông lưng hoặc ấn đau góc sườn sống hỗ trợ chẩn đoán." },
  { id: "suppress", label: "Dự phòng sau tái phát", criteria: "Nhiễm khuẩn tiết niệu tái phát (≥ 2 lần trong thai kỳ) hoặc sau điều trị viêm thận bể thận." },
];
export const TRI_OPTS: { id: Trimester; label: string }[] = [
  { id: "t1", label: "3 tháng đầu" },
  { id: "t23", label: "3 tháng giữa, cuối" },
];
export const ALLERGY_OPTS: { id: BlAllergy; label: string }[] = [
  { id: "none", label: "Không" },
  { id: "low", label: "Có – nguy cơ phản vệ thấp" },
  { id: "high", label: "Có – nguy cơ phản vệ cao" },
];

/* Bảng 1 – thứ tự giữ nguyên như văn bản */
type Oral = "nitro" | "cephalexin" | "smx" | "fosfo" | "amox" | "amoxclav";
const ORAL: Record<Oral, { drug: string; dose: string }> = {
  nitro: { drug: "Nitrofurantoin", dose: "100 mg uống mỗi 12 giờ × 5–7 ngày" },
  cephalexin: { drug: "Cephalexin", dose: "250–500 mg uống mỗi 6 giờ × 5–7 ngày" },
  smx: { drug: "Sulfamethoxazol-trimethoprim", dose: "800/160 mg mỗi 12 giờ × 5–7 ngày" },
  fosfo: { drug: "Fosfomycin", dose: "3 g uống, liều duy nhất" },
  amox: { drug: "Amoxicilin", dose: "500 mg uống mỗi 8 giờ hoặc 875 mg uống mỗi 12 giờ × 5–7 ngày" },
  amoxclav: { drug: "Amoxicilin-acid clavulanic", dose: "500 mg uống mỗi 8 giờ hoặc 875 mg uống mỗi 12 giờ × 5–7 ngày" },
};

function lowerTract(i: UtiIn): { items: RxItem[]; avoid: RxItem[]; notes: string[] } {
  const items: RxItem[] = [];
  const avoid: RxItem[] = [];
  const notes: string[] = [];
  const t1 = i.trimester === "t1";
  const empiric = i.form === "cystitis" && i.empiric;
  const t1Role = "Khi không có lựa chọn phù hợp khác";
  const cand: Oral[] = ["nitro", "cephalexin", "smx", "fosfo", "amox", "amoxclav"];
  for (const k of cand) {
    const { drug, dose } = ORAL[k];
    if (k === "nitro") {
      if (i.g6pd) { avoid.push(r("Thiếu G6PD", drug, undefined, undefined, "ACOG tr. 440")); continue; }
      items.push(r(t1 ? t1Role : "Lựa chọn", drug, dose, undefined, T1));
      continue;
    }
    if (k === "smx") {
      if (empiric && i.smxRes) { avoid.push(r("Kháng > 20% tại chỗ", `${drug} khi điều trị trước khi có kết quả cấy`, undefined, undefined, T1)); continue; }
      items.push(r(t1 ? t1Role : "Lựa chọn", drug, dose, undefined, T1));
      continue;
    }
    if (k === "cephalexin") {
      if (i.allergy === "high") { avoid.push(r("Nguy cơ phản vệ cao", drug, undefined, undefined, `${T1}, chú thích *`)); continue; }
      items.push(r("Lựa chọn", drug, dose, undefined, T1));
      continue;
    }
    if (k === "amox" || k === "amoxclav") {
      if (i.allergy !== "none") { avoid.push(r("Dị ứng beta-lactam", drug, undefined, undefined, `${T1}, chú thích *`)); continue; }
      if (empiric) { avoid.push(r("Kháng cao", `${drug} khi điều trị trước khi có kết quả cấy`, undefined, undefined, T1)); continue; }
      items.push(r("Theo kháng sinh đồ", drug, dose, undefined, T1));
      continue;
    }
    items.push(r("Lựa chọn", drug, dose, undefined, T1));
  }
  if (t1) notes.push("Nitrofurantoin, sulfamethoxazol-trimethoprim dùng trong 3 tháng đầu: dữ liệu về dị tật bẩm sinh không thống nhất và có hạn chế về phương pháp; hợp lý khi không có lựa chọn phù hợp khác. Từ 3 tháng giữa có thể tiếp tục là lựa chọn đầu tay.");
  if (i.allergy === "low") notes.push("Dị ứng beta-lactam, nguy cơ phản vệ thấp: dùng cephalosporin là phù hợp. Cần khai thác mức độ nặng của phản ứng dị ứng trước đó.");
  if (i.allergy === "high") notes.push("Dị ứng beta-lactam, nguy cơ phản vệ cao: dùng phác đồ không phải beta-lactam.");
  notes.push("Fosfomycin liều duy nhất có hiệu quả tốt với khuẩn niệu không triệu chứng và viêm bàng quang; dữ liệu ban đầu chưa ghi nhận tăng nguy cơ bất lợi thai kỳ khi dùng trong 3 tháng đầu.");
  return { items, avoid, notes };
}

export function utiPlan(i: UtiIn): UtiOut {
  const blocks: UtiBlock[] = [];
  const notes: string[] = [];
  let avoid: RxItem[] = [];

  if (i.form === "asb") {
    blocks.push({
      title: "Sàng lọc",
      items: [
        r("Khuyến cáo", "Sàng lọc và điều trị khuẩn niệu không triệu chứng ở phụ nữ mang thai", undefined, "S-M", "IDSA III.1"),
        r("Thời điểm", "Cấy nước tiểu giữa dòng 1 lần ở một lần khám sớm trong thai kỳ", undefined, ACOG, "ACOG – ASB, Diagnosis"),
        r("Không làm", "Que nhúng nước tiểu thường quy mỗi lần khám (không đủ nhạy để phát hiện khuẩn niệu)", undefined, undefined, "ACOG tr. 437"),
        r("Không sàng lọc thêm", "Đái tháo đường, tổn thương tủy sống: chỉ sàng lọc 1 lần ban đầu", undefined, undefined, "ACOG tr. 438"),
      ],
    });
    const lt = lowerTract(i);
    blocks.push({
      title: "Điều trị nhắm đích theo kết quả cấy",
      lead: "Điều trị khi cấy ≥ 100.000 CFU/mL; bắt đầu khi khẳng định khuẩn niệu, đổi thuốc nếu vi khuẩn không nhạy.",
      items: [
        r("Thời gian", "5–7 ngày (fosfomycin: liều duy nhất)", undefined, ACOG, "ACOG – ASB, Treatment"),
        r("Thời gian", "4–7 ngày thay vì ngắn hơn; dùng đợt ngắn nhất có hiệu quả, tùy thuốc", undefined, "W-L", "IDSA III.2"),
        ...lt.items,
      ],
    });
    avoid = lt.avoid;
    notes.push(...lt.notes);
    notes.push("Liên cầu nhóm B: điều trị khi > 100.000 CFU/mL; số lượng thấp hơn không cần điều trị nhưng là chỉ định dự phòng liên cầu nhóm B khi chuyển dạ.");
    notes.push("Không điều trị vi khuẩn chí bình thường âm hộ – âm đạo: Lactobacilli, Corynebacteria, tụ cầu không sinh coagulase.");
    notes.push("Chưa đủ bằng chứng để khuyến cáo sàng lọc lại sau cấy âm tính lần đầu hoặc sau khi điều trị đợt khuẩn niệu đầu tiên (ACOG, IDSA).");
    return { headline: "Cấy nước tiểu sàng lọc; điều trị nhắm đích 5–7 ngày", blocks, avoid, notes };
  }

  if (i.form === "cystitis") {
    blocks.push({
      title: "Chẩn đoán",
      items: [
        r("Khuyến cáo", "Cấy nước tiểu cho mọi người bệnh có triệu chứng viêm bàng quang cấp", undefined, ACOG, "ACOG – Acute Cystitis, Diagnosis"),
        r("Khởi trị", "Có thể bắt đầu theo kinh nghiệm khi có triệu chứng và tổng phân tích nước tiểu phù hợp; điều chỉnh theo kết quả cấy", undefined, undefined, "ACOG tr. 439"),
      ],
    });
    const lt = lowerTract(i);
    blocks.push({
      title: i.empiric ? "Điều trị kinh nghiệm (chưa có kết quả cấy)" : "Điều trị nhắm đích theo kết quả cấy",
      lead: i.empiric ? "Bắt đầu để giảm triệu chứng, điều chỉnh theo kết quả cấy; chọn phổ hẹp nhất phù hợp." : "Kháng sinh nhắm đích 5–7 ngày; chọn phổ hẹp nhất phù hợp.",
      items: [
        r("Thời gian", "5–7 ngày (fosfomycin: liều duy nhất)", undefined, ACOG, "ACOG – Acute Cystitis, Treatment"),
        ...lt.items,
      ],
    });
    avoid = lt.avoid;
    notes.push(...lt.notes);
    notes.push("Chưa đủ bằng chứng cho phác đồ 3 ngày trong viêm bàng quang thai kỳ.");
    notes.push("Tránh nitrofurantoin và fosfomycin khi chưa phân biệt chắc viêm bàng quang với viêm thận bể thận (không đạt nồng độ đủ trong nhu mô thận).");
    blocks.push({
      title: "Theo dõi",
      items: [
        r("Sau điều trị", "Cân nhắc cấy lại nước tiểu 1–2 tuần sau khi kết thúc điều trị, hoặc chỉ đánh giá lại khi triệu chứng tái phát", undefined, ACOG, "ACOG – Acute Cystitis, Treatment"),
        r("Tái phát", "Sau điều trị đợt tái phát: cân nhắc dự phòng đến hết thai kỳ – xem mục Dự phòng sau tái phát", undefined, ACOG, "ACOG – Recurrent UTI"),
      ],
    });
    return { headline: i.empiric ? "Kinh nghiệm 5–7 ngày; tránh amoxicilin/ampicilin khi chưa có kết quả cấy" : "Nhắm đích theo kết quả cấy, 5–7 ngày", blocks, avoid, notes };
  }

  if (i.form === "pyelo") {
    blocks.push({
      title: "Xử trí ban đầu",
      items: [
        r("Khuyến cáo", "Điều trị nội trú ban đầu; kháng sinh kinh nghiệm thấm tốt nhu mô thận, nhắm tác nhân thường gặp; điều chỉnh theo kết quả cấy và kháng sinh đồ", undefined, ACOG, "ACOG – Pyelonephritis, Treatment"),
        r("Bắt đầu", "Bù dịch và kháng sinh tĩnh mạch; lấy nước tiểu giữa dòng hoặc qua ống thông làm tổng phân tích, soi và cấy trước kháng sinh nhưng không trì hoãn điều trị", undefined, undefined, "ACOG tr. 441–442"),
      ],
    });
    const iv: RxItem[] = [];
    if (i.allergy === "none") {
      iv.push(r("Lựa chọn", "Ampicilin + gentamicin", "Ampicilin 2 g TM mỗi 6 giờ + gentamicin 1,5 mg/kg TM mỗi 8 giờ hoặc 5 mg/kg TM mỗi 24 giờ", undefined, T3));
    }
    if (i.allergy !== "high") {
      iv.push(r("Lựa chọn", "Ceftriaxon", "1 g TM mỗi 24 giờ", undefined, T3));
      iv.push(r("Lựa chọn", "Cefepim", "1 g TM mỗi 12 giờ", undefined, T3));
    }
    iv.push(r("Dị ứng beta-lactam", "Aztreonam", "1 g TM mỗi 8–12 giờ", undefined, T3));
    blocks.push({
      title: "Kháng sinh tĩnh mạch kinh nghiệm",
      lead: "Không có phác đồ nào ưu thế hơn; chọn theo dữ liệu nhạy cảm tại chỗ và kháng sinh người bệnh dùng gần đây.",
      items: iv,
    });
    if (i.allergy === "low") notes.push("Dị ứng penicilin, nguy cơ phản vệ thấp: cephalosporin là phù hợp.");
    if (i.allergy === "high") notes.push("Dị ứng beta-lactam, nguy cơ phản vệ cao: dùng phác đồ thay thế như aztreonam; nên hội chẩn chuyên gia bệnh truyền nhiễm.");
    blocks.push({
      title: "Đánh giá đáp ứng, chuyển uống, thời gian",
      items: [
        r("48–72 giờ", "Phần lớn (75–95%) cải thiện: hết sốt > 24 giờ và giảm triệu chứng", undefined, undefined, "ACOG tr. 442"),
        r("Không cải thiện sau 72 giờ", "Đánh giá vi khuẩn kháng thuốc; chẩn đoán hình ảnh loại trừ bệnh lý tiết niệu khác", undefined, undefined, "ACOG tr. 442"),
        r("Chuyển uống", "Tiếp tục đường tiêm đến khi lâm sàng cải thiện; sau đó chuyển kháng sinh uống phù hợp theo kháng sinh đồ", undefined, ACOG, "ACOG – Pyelonephritis, Treatment"),
        r("Tổng thời gian", "14 ngày", undefined, ACOG, "ACOG – Pyelonephritis, Treatment"),
        r("Sau điều trị", "Cấy nước tiểu sau khi kết thúc kháng sinh để bảo đảm hết nhiễm khuẩn", undefined, undefined, "ACOG tr. 442"),
      ],
    });
    avoid = [
      r("Không đạt nồng độ ở thận", "Nitrofurantoin để điều trị hoặc hoàn tất điều trị đường uống", undefined, undefined, `${T1}; ACOG tr. 442`),
      r("Không đạt nồng độ ở thận", "Fosfomycin để điều trị hoặc hoàn tất điều trị đường uống", undefined, undefined, `${T1}; ACOG tr. 442`),
    ];
    notes.push("Vi khuẩn kháng thuốc (E. coli sinh ESBL, tụ cầu vàng kháng methicilin) ngày càng tăng: khi phân lập được, có thể cần hội chẩn chuyên gia bệnh truyền nhiễm để chọn thuốc và thời gian.");
    notes.push("Cấy máu thường được làm nhưng có thể không giúp thay đổi xử trí; vi khuẩn máu không làm thay đổi thời gian điều trị.");
    notes.push("Sau điều trị: có thể cân nhắc dự phòng đến hết thai kỳ – xem mục Dự phòng sau tái phát.");
    return { headline: "Nội trú, kháng sinh tĩnh mạch; tổng 14 ngày", blocks, avoid, notes };
  }

  // suppress
  const sItems: RxItem[] = [];
  if (!i.g6pd) sItems.push(r("Thường dùng", "Nitrofurantoin", "100 mg uống 1 lần/ngày", undefined, "ACOG tr. 441"));
  else avoid.push(r("Thiếu G6PD", "Nitrofurantoin", undefined, undefined, "ACOG tr. 440"));
  if (i.allergy !== "high") sItems.push(r("Thường dùng", "Cephalexin", "250–500 mg uống 1 lần/ngày", undefined, "ACOG tr. 441"));
  else avoid.push(r("Nguy cơ phản vệ cao", "Cephalexin", undefined, undefined, `${T1}, chú thích *`));
  blocks.push({
    title: i.afterPyelo ? "Dự phòng sau viêm thận bể thận" : "Dự phòng sau nhiễm khuẩn tái phát",
    lead: "Chưa đủ bằng chứng để định hướng xử trí; chọn thuốc vi khuẩn phân lập được còn nhạy, ưu tiên 1 liều thấp mỗi ngày.",
    items: [
      r("Khuyến cáo", i.afterPyelo ? "Có thể cân nhắc dự phòng đến hết thai kỳ, như với nhiễm khuẩn tái phát" : "Sau điều trị đợt tái phát cấp: có thể cân nhắc dự phòng đến hết thai kỳ", undefined, ACOG, i.afterPyelo ? "ACOG – Pyelonephritis, Treatment" : "ACOG – Recurrent UTI"),
      ...sItems,
      ...(i.afterPyelo
        ? [
            r("Thời gian", "Đến hết thai kỳ và tiếp tục đến 4–6 tuần sau sinh", undefined, undefined, "ACOG tr. 443"),
            r("Theo dõi", "Cân nhắc cấy nước tiểu hằng tháng đến hết thai kỳ", undefined, undefined, "ACOG tr. 443"),
          ]
        : [r("Cách dùng", "Liên tục 1 lần/ngày đến hết thai kỳ, hoặc dùng sau giao hợp (trước hoặc sau)", undefined, undefined, "ACOG tr. 441")]),
    ],
  });
  notes.push("Nhiễm khuẩn tiết niệu tái phát: ≥ 2 lần chẩn đoán trong thai kỳ (gặp ở 4–5% thai kỳ).");
  if (i.afterPyelo) notes.push("Viêm thận bể thận tái phát gặp tới 25% trước khi sinh. Thuốc dự phòng cần phù hợp với kháng sinh đồ của tác nhân gây viêm thận bể thận.");
  return { headline: "Nitrofurantoin hoặc cephalexin 1 liều thấp mỗi ngày", blocks, avoid, notes };
}
