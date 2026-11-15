/*
  Lao phổi và lao màng não – dữ liệu công cụ chọn phác đồ theo
  WHO consolidated guidelines on tuberculosis. Module 4: treatment and care (Geneva: WHO; 2025,
  ISBN 978-92-4-010724-3). Đọc từ bản PDF người dùng cung cấp ngày 15/11/2026.
  - Chương 1 (lao nhạy cảm thuốc): KC 1.1–1.5, 2.1–2.2, 3.1–3.2, 4.1–4.2 và phần Remarks, Subgroup,
    Implementation considerations.
  - Chương 2 (lao kháng thuốc): KC 1.1–1.2 (6 tháng), 2.1–2.3 (9 tháng), 3.1–3.17 (dài hạn), 4.1–4.2 (Hr-TB),
    5.1, 6.1; mục "Extrapulmonary TB and TB meningitis".
  - Phụ lục 1 (Annex 1.1): khuyến cáo điều trị lao trẻ em 2014 (KC 8, 14) – liều theo mg/kg và lao màng não trẻ em.
  Mức GRADE giữ nguyên của WHO: S/C = mạnh/có điều kiện; H/M/L/VL = độ tin cậy cao/TB/thấp/rất thấp.
  Module 4 KHÔNG có bảng liều theo cân nặng cho người lớn (thuộc Operational handbook) -> để trống liều,
  chỉ ghi liều được nêu rõ trong văn bản (rifapentin, BPaLM, BDLLfxC, liều mg/kg trẻ em).
  ref = vị trí trong văn bản (không hiển thị).
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export type TbBlock = { title: string; lead?: string; items: RxItem[] };
export type TbRes = "ds" | "hr" | "mdr";
export type TbFq = "unknown" | "s" | "r";
export type TbAge = "lt3m" | "child" | "a12" | "a14" | "adult";
export type TbIn = {
  site: "ptb" | "tbm";
  res: TbRes;
  fq: TbFq;
  age: TbAge;
  severe: boolean;
  lt40: boolean;
  preg: boolean;
  hiv: boolean;
  cd4lt100: boolean;
  sam: boolean;
  prior2y: boolean;
  highE: boolean;
};
export type TbOut = { headline: string; blocks: TbBlock[]; avoid: RxItem[]; notes: string[] };

const r = (role: string, text: string, dose: string | undefined, grade: string | undefined, ref: string): RxItem => ({ role, text, dose, grade, ref });

export const AGE_TEXT: Record<TbAge, string> = {
  lt3m: "< 3 tháng tuổi",
  child: "3 tháng – 11 tuổi",
  a12: "12–13 tuổi",
  a14: "14–15 tuổi",
  adult: "≥ 16 tuổi",
};
export const RES_TEXT: Record<TbRes, string> = {
  ds: "nhạy cảm thuốc",
  hr: "nhạy rifampicin, kháng isoniazid (Hr-TB)",
  mdr: "kháng rifampicin / đa kháng (MDR/RR-TB)",
};

/* Phụ lục 1 – KC 8 (2014): liều hằng ngày cho trẻ em */
export const TB_CHILD_DOSE: RxItem[] = [
  r("Isoniazid (H)", "Hằng ngày", "10 mg/kg (khoảng 7–15 mg/kg); tối đa 300 mg/ngày", "S-M", "Annex 1.1 – Rec 8 (2014)"),
  r("Rifampicin (R)", "Hằng ngày", "15 mg/kg (khoảng 10–20 mg/kg); tối đa 600 mg/ngày", "S-M", "Annex 1.1 – Rec 8 (2014)"),
  r("Pyrazinamid (Z)", "Hằng ngày", "35 mg/kg (khoảng 30–40 mg/kg)", "S-M", "Annex 1.1 – Rec 8 (2014)"),
  r("Ethambutol (E)", "Hằng ngày", "20 mg/kg (khoảng 15–25 mg/kg)", "S-M", "Annex 1.1 – Rec 8 (2014)"),
];
export const TB_CHILD_DOSE_NOTE =
  "Liều trẻ em theo khuyến cáo 8 của hướng dẫn WHO 2014 về lao trẻ em, được in lại trong bảng tóm tắt khuyến cáo của Module 4 (các khuyến cáo trẻ em còn hiệu lực được chuyển sang Module 5). Trẻ ≤ 25 kg: ưu tiên viên phối hợp liều cố định dạng phù hợp trẻ em HRZ 50/75/150 mg (± ethambutol dạng phân tán) và HR 50/75 mg. Trẻ < 3 tháng: có thể cần chỉnh liều theo tuổi và độc tính – do bác sĩ có kinh nghiệm lao trẻ em quyết định.";

const DS_COMMON: RxItem[] = [
  r("Tần suất", "Dùng thuốc hằng ngày trong suốt đợt điều trị (KC 1.2). “Hằng ngày” = ít nhất 5 lần/tuần.", undefined, "S-H", "Ch1 Rec 1.2"),
  r("Dạng thuốc", "Ưu tiên viên phối hợp liều cố định (FDC) hơn thuốc rời (KC 1.4).", undefined, "C-L", "Ch1 Rec 1.4"),
  r("Hết giai đoạn tấn công còn AFB dương", "Không kéo dài giai đoạn tấn công khi phác đồ có rifampicin suốt đợt (KC 1.5).", undefined, "S-H", "Ch1 Rec 1.5"),
  r("Hỗ trợ điều trị", "Chương trình chống lao giám sát và hỗ trợ mọi người bệnh để hoàn thành đủ liệu trình (KC 1.1, ghi chú B).", undefined, undefined, "Ch1 Rec 1.1 Remark B"),
];

function hivBlock(i: TbIn, dr: boolean): TbBlock | null {
  if (!i.hiv) return null;
  const items: RxItem[] = [];
  if (!dr) items.push(r("Thời gian điều trị lao", "Người nhiễm HIV: thời gian điều trị lao hằng ngày ít nhất bằng người không nhiễm HIV (KC 3.1).", undefined, "S-H", "Ch1 Rec 3.1"));
  if (dr) {
    items.push(r("Thời điểm ART", "Lao kháng thuốc cần thuốc hàng hai: bắt đầu ART cho mọi người nhiễm HIV, không phụ thuộc CD4, càng sớm càng tốt (trong 8 tuần đầu) sau khi bắt đầu điều trị lao (KC kháng thuốc 6.1).", undefined, "S-VL", "Ch2 Rec 6.1"));
  } else if (i.site === "tbm") {
    items.push(r("Thời điểm ART – có viêm màng não", "KC 3.2 (bắt đầu ART trong 2 tuần) KHÔNG áp dụng khi có dấu hiệu, triệu chứng viêm màng não: ART ngay làm tăng đáng kể biến cố bất lợi nặng; có thể cân nhắc hoãn ART 4–8 tuần sau khi bắt đầu điều trị lao. Corticoid bổ trợ vẫn áp dụng.", undefined, undefined, "Ch1 Rec 3.2 footnote a, Source of recommendation"));
  } else {
    items.push(r("Thời điểm ART", "Bắt đầu ART càng sớm càng tốt trong vòng 2 tuần sau khi bắt đầu điều trị lao, không phụ thuộc CD4 (KC 3.2; người lớn, vị thành niên: Mạnh, độ tin cậy thấp đến trung bình; trẻ em, trẻ nhũ nhi: Mạnh, rất thấp). Ngoại trừ khi có dấu hiệu viêm màng não.", undefined, undefined, "Ch1 Rec 3.2"));
  }
  return { title: "Người nhiễm HIV", items };
}

/* ---------- Lao phổi nhạy cảm thuốc ---------- */
function dsPulmonary(i: TbIn): TbOut {
  const blocks: TbBlock[] = [];
  const notes: string[] = [];
  const avoid: RxItem[] = [];
  const child = i.age === "lt3m" || i.age === "child" || i.age === "a12" || i.age === "a14";
  const opts: RxItem[] = [];

  // 2.1 – 4HPMZ (≥ 12 tuổi)
  const hpmzAge = i.age === "a12" || i.age === "a14" || i.age === "adult";
  const hpmzEx: string[] = [];
  if (i.lt40) hpmzEx.push("cân nặng < 40 kg");
  if (i.preg) hpmzEx.push("có thai, cho con bú, sau sinh");
  if (i.hiv && i.cd4lt100) hpmzEx.push("HIV có CD4 < 100 tế bào/mm³");
  // 2.2 – 2HRZ(E)/2HR (3 tháng – 16 tuổi, không nặng)
  const shineAge = i.age === "child" || i.age === "a12" || i.age === "a14";
  const shineEx: string[] = [];
  if (i.severe) shineEx.push("bệnh không thuộc nhóm “không nặng”");
  if (i.sam) shineEx.push("suy dinh dưỡng cấp nặng – nên điều trị 6 tháng");
  if (i.prior2y) shineEx.push("đã điều trị lao trong 2 năm trước – điều trị 6 tháng 2HRZ(E)/4HR");

  if (shineAge && shineEx.length === 0) {
    opts.push(r("Phác đồ 4 tháng – trẻ em, vị thành niên", `2HRZ(E)/2HR: 2 tháng isoniazid, rifampicin, pyrazinamid${i.highE ? ", ethambutol" : " (± ethambutol)"}, sau đó 2 tháng isoniazid, rifampicin (KC 2.2). Ethambutol trong 2 tháng đầu khi ở nơi tỷ lệ HIV cao hoặc tỷ lệ kháng isoniazid cao.`, "Liều theo mg/kg – bảng liều trẻ em bên dưới", "S-M", "Ch1 Rec 2.2"));
  }
  if (hpmzAge && hpmzEx.length === 0) {
    opts.push(r("Phác đồ 4 tháng – ≥ 12 tuổi", "2HPMZ/2HPM: 2 tháng isoniazid, rifapentin, moxifloxacin, pyrazinamid, sau đó 2 tháng isoniazid, rifapentin, moxifloxacin (KC 2.1). Dùng được ở người nhiễm HIV (CD4 ≥ 100), đái tháo đường, nhẹ cân (≥ 40 kg), bệnh lan rộng. Chọn giữa phác đồ 4 tháng và 6 tháng theo tiêu chuẩn, mong muốn người bệnh và khả năng có rifapentin.", "Rifapentin 1.200 mg/ngày, uống cùng thức ăn; thuốc khác: Module 4 không nêu liều", "C-M", "Ch1 Rec 2.1; Implementation considerations"));
  }
  // 6 tháng
  if (i.age === "lt3m") {
    opts.push(r("Phác đồ 6 tháng – trẻ < 3 tháng", "2HRZ(E)/4HR, điều trị ngay khi nghi ngờ hoặc xác định lao phổi (chưa có dữ liệu phác đồ 4 tháng ở trẻ < 3 tháng hoặc < 3 kg, kể cả sinh non) (KC 11, 2014).", "Liều theo mg/kg – có thể cần chỉnh liều, do bác sĩ có kinh nghiệm lao trẻ em quyết định", "S-L", "Ch1 Rec 2.2 Subgroup – Infants; Annex 1.1 Rec 11 (2014)"));
  } else if (child) {
    const six = i.severe || i.highE
      ? "2HRZE/4HR: 2 tháng isoniazid, rifampicin, pyrazinamid, ethambutol, sau đó 4 tháng isoniazid, rifampicin – bệnh phổi lan rộng, hoặc nơi tỷ lệ HIV cao / kháng isoniazid cao (KC 10, 2014). Lao phổi không đủ tiêu chuẩn phác đồ 4 tháng: phác đồ 6 tháng có ethambutol ở giai đoạn tấn công."
      : "2HRZ/4HR: 2 tháng isoniazid, rifampicin, pyrazinamid, sau đó 4 tháng isoniazid, rifampicin – nơi tỷ lệ HIV thấp hoặc kháng isoniazid thấp, trẻ HIV âm tính (KC 9, 2014).";
    const extra = i.age === "child" ? "" : " Vị thành niên 12–16 tuổi có 3 lựa chọn: 4HPMZ, 2HRZ(E)/2HR, 6 tháng 2HRZ(E)/4HR (từ 16 tuổi: 4HPMZ hoặc 2HRZE/4HR) – tùy mức độ nặng, HIV, ART, CD4 và khả năng có HPMZ.";
    opts.push(r("Phác đồ 6 tháng", six + extra, "Liều theo mg/kg – bảng liều trẻ em bên dưới", "S-M", "Annex 1.1 Rec 9–10 (2014); Ch1 Rec 2.2 Remarks, Implementation"));
  } else {
    opts.push(r("Phác đồ 6 tháng – chuẩn", "2HRZE/4HR: 2 tháng isoniazid, rifampicin, pyrazinamid, ethambutol, sau đó 4 tháng isoniazid, rifampicin (KC 1.1).", "Module 4 không nêu liều theo cân nặng cho người lớn", "S-H", "Ch1 Rec 1.1"));
  }
  blocks.push({ title: "Phác đồ", lead: "Lao phổi nhạy cảm thuốc (không nghi ngờ hoặc không có bằng chứng MDR/RR-TB).", items: opts });

  const ex: RxItem[] = [];
  if (hpmzAge && hpmzEx.length) ex.push(r("Không dùng 2HPMZ/2HPM", `Ngoài nghiên cứu, không chỉ định khi: ${hpmzEx.join("; ")} (nhóm không có bằng chứng).`, undefined, undefined, "Ch1 Rec 2.1 Subgroups excluded"));
  if (shineAge && shineEx.length) ex.push(r("Không dùng 2HRZ(E)/2HR", `Lý do: ${shineEx.join("; ")}.`, undefined, undefined, "Ch1 Rec 2.2 Remarks, Subgroup"));
  if (i.age === "child") ex.push(r("2HPMZ/2HPM", "Không chỉ định cho trẻ < 12 tuổi (không có trong thử nghiệm).", undefined, undefined, "Ch1 Rec 2.1 Subgroups excluded"));
  avoid.push(...ex);
  avoid.push(r("Dùng cách quãng", "Không khuyến cáo dùng 3 lần/tuần ở cả giai đoạn tấn công và duy trì (KC 1.3); không bao giờ dùng 2 lần/tuần.", undefined, "C-VL", "Ch1 Rec 1.3"));
  if (child) avoid.push(r("Streptomycin", "Không dùng trong phác đồ hàng một cho trẻ em lao phổi hoặc lao hạch ngoại biên (KC 13, 2014).", undefined, "S-M", "Annex 1.1 Rec 13 (2014)"));

  blocks.push({ title: "Nguyên tắc dùng thuốc", items: DS_COMMON });
  if (child) blocks.push({ title: "Liều hằng ngày – trẻ em", lead: TB_CHILD_DOSE_NOTE, items: TB_CHILD_DOSE });
  const h = hivBlock(i, false);
  if (h) blocks.push(h);
  if (child && i.hiv && shineAge && !i.severe) notes.push("Trẻ, vị thành niên nhiễm HIV, lao không nặng: có thể cân nhắc điều trị 4 tháng tùy mức suy giảm miễn dịch, tình trạng ART và nhiễm trùng cơ hội khác; theo dõi sát, nhất là ở tháng thứ 4, kéo dài đến 6 tháng nếu tiến triển chưa đủ.");
  if (shineAge) notes.push("Lao “không nặng” (trẻ em): lao hạch ngoại biên; lao hạch trong lồng ngực không tắc đường thở; tràn dịch màng phổi do lao không biến chứng; hoặc tổn thương ít vi khuẩn, không có hang, giới hạn trong một thùy phổi, không có hình ảnh kê.");
  if (opts.some((o) => o.grade === "C-M")) notes.push("4HPMZ: chưa có viên phối hợp liều cố định nên số viên nhiều hơn; xét nghiệm nhạy fluoroquinolon ban đầu rất nên làm ở nơi tỷ lệ kháng fluoroquinolon cao; không yêu cầu điện tâm đồ ban đầu (trừ khi có chỉ định lâm sàng); theo dõi chức năng gan như phác đồ 6 tháng.");
  if (shineAge && shineEx.length === 0) notes.push("Phác đồ 4 tháng ở trẻ em: kết quả điều trị đánh giá ở cuối tháng 4; nếu cải thiện lâm sàng chưa đủ, có thể kéo dài đến 6 tháng và xem xét chẩn đoán khác, kể cả lao kháng thuốc; theo dõi tái phát đến 12 tháng sau khi kết thúc.");
  if (child && i.hiv) notes.push("Trẻ nhiễm HIV: KC 9 (2014) chỉ nêu phác đồ 3 thuốc HRZ cho trẻ HIV âm tính; trong thử nghiệm SHINE mọi trẻ nhiễm HIV đều dùng ethambutol.");
  const headline = opts.map((o) => o.text.match(/^[0-9][0-9A-Z()/]+/)?.[0] ?? o.role).join(" hoặc ");
  return { headline, blocks, avoid, notes };
}

/* ---------- Lao màng não nhạy cảm thuốc ---------- */
export const TBM_STEROID: RxItem = r(
  "Corticoid bổ trợ",
  "Dexamethason hoặc prednisolon ngay từ đầu, giảm liều dần trong 6–8 tuần (KC 4.1). Dùng bất kể mức độ nặng của viêm màng não; dùng đường uống nếu không có dạng tĩnh mạch.",
  "Module 4 không nêu liều (liều tối ưu còn là khoảng trống nghiên cứu)",
  "S-M",
  "Ch1 Rec 4.1; Subgroup; Implementation",
);

function dsMeningitis(i: TbIn): TbOut {
  const child = i.age !== "adult";
  const items: RxItem[] = [];
  if (child) {
    items.push(r("Trẻ em – 12 tháng", "2HRZE/10HR: 2 tháng isoniazid, rifampicin, pyrazinamid, ethambutol, sau đó 10 tháng isoniazid, rifampicin; tổng 12 tháng. Liều như lao phổi (KC 14, 2014).", "Liều theo mg/kg – bảng liều trẻ em bên dưới", "S-L", "Annex 1.1 Rec 14 (2014)"));
  } else {
    items.push(r("Thuốc", "Phác đồ 2HRZE/4HR (KC 1.1) áp dụng cho lao ngoài phổi NGOẠI TRỪ lao hệ thần kinh trung ương, xương khớp – một số nhóm chuyên gia đề nghị điều trị dài hơn. Module 4 không nêu thời gian điều trị cụ thể cho lao màng não người lớn.", "Module 4 không nêu liều theo cân nặng cho người lớn", undefined, "Ch1 Rec 1.1 Remark A"));
  }
  items.push(TBM_STEROID);
  const blocks: TbBlock[] = [
    { title: "Phác đồ", lead: "Lao màng não nhạy cảm thuốc. Lao màng não là lao ngoài phổi nặng.", items },
    { title: "Nguyên tắc dùng thuốc", items: [DS_COMMON[0], DS_COMMON[1], DS_COMMON[3]] },
  ];
  if (child) blocks.push({ title: "Liều hằng ngày – trẻ em", lead: TB_CHILD_DOSE_NOTE, items: TB_CHILD_DOSE });
  const h = hivBlock(i, false);
  if (h) blocks.push(h);
  const avoid: RxItem[] = [
    r("2HPMZ/2HPM", "Không chỉ định cho lao màng não (nhóm không có bằng chứng, loại khỏi KC 2.1).", undefined, undefined, "Ch1 Rec 2.1 Subgroups excluded"),
    r("2HRZ(E)/2HR", "Không áp dụng: KC 2.2 chỉ dành cho lao không nặng; trẻ không đủ tiêu chuẩn dùng phác đồ cho lao ngoài phổi nặng.", undefined, undefined, "Ch1 Rec 2.2 Remarks"),
    r("Dùng cách quãng", "Không khuyến cáo dùng 3 lần/tuần (KC 1.3); không bao giờ dùng 2 lần/tuần.", undefined, "C-VL", "Ch1 Rec 1.3"),
  ];
  const notes = [
    "Lợi ích của corticoid về tử vong tăng theo giai đoạn (mức độ nặng) của lao màng não; nhóm dùng corticoid có ít biến cố bất lợi nặng hơn, kể cả viêm gan nặng.",
    "Liều và thời gian corticoid tối ưu, khác biệt theo HIV/ART còn là khoảng trống nghiên cứu của WHO.",
  ];
  if (!child) notes.push("Phác đồ 6HRZEto (6 tháng tăng cường) cho trẻ em lao màng não thuộc Module 5 (trẻ em, vị thành niên) – không có trong văn bản Module 4 đã đọc.");
  else notes.push("Phác đồ thay thế 6HRZEto (6 tháng tăng cường) cho trẻ em thuộc Module 5 – không có trong văn bản Module 4 đã đọc, chưa đưa vào công cụ.");
  return { headline: child ? "2HRZE/10HR (12 tháng) + corticoid bổ trợ" : "Phác đồ có rifampicin (một số nhóm chuyên gia đề nghị dài hơn 6 tháng) + corticoid bổ trợ", blocks, avoid, notes };
}

/* ---------- Hr-TB ---------- */
function hrTb(i: TbIn): TbOut {
  const items: RxItem[] = [
    r("Phác đồ", "6(H)REZ-Lfx: rifampicin, ethambutol, pyrazinamid, levofloxacin (± isoniazid) trong 6 tháng (KC kháng thuốc 4.1). Thời gian quyết định bởi yêu cầu dùng đủ 6 tháng levofloxacin.", "Module 4 không nêu liều", "C-VL", "Ch2 Rec 4.1; Implementation"),
    r("Không dùng được levofloxacin", "6(H)REZ.", undefined, undefined, "Ch2 Hr-TB Implementation"),
  ];
  if (i.site === "tbm") items.push(TBM_STEROID);
  const blocks: TbBlock[] = [{ title: "Phác đồ", lead: "Lao nhạy rifampicin, kháng isoniazid đã xác nhận.", items }];
  const h = hivBlock(i, false);
  if (h) blocks.push({ title: h.title, items: [r("Người nhiễm HIV", "Phác đồ 6(H)REZ-Lfx được khuyến cáo ở người nhiễm HIV; ưu tiên bắt đầu ART trong 8 tuần sau khi bắt đầu điều trị lao, không phụ thuộc CD4.", undefined, undefined, "Ch2 Hr-TB – HIV")] });
  const avoid: RxItem[] = [
    r("Streptomycin, thuốc tiêm khác", "Không thêm vào phác đồ (KC kháng thuốc 4.2).", undefined, "C-VL", "Ch2 Rec 4.2"),
    r("Levofloxacin – loại trừ", "Không thêm levofloxacin khi: chưa loại trừ kháng rifampicin; đã biết hoặc nghi kháng levofloxacin; không dung nạp fluoroquinolon; nguy cơ QT kéo dài; nếu có thể – khi có thai hoặc cho con bú (không phải chống chỉ định tuyệt đối).", undefined, undefined, "Ch2 Hr-TB Implementation"),
  ];
  const notes = [
    "Nếu chưa có kết quả nhưng nghi ngờ mạnh Hr-TB (ví dụ tiếp xúc gần với người Hr-TB): có thể bắt đầu (H)REZ-Lfx; nếu kết quả cuối cùng nhạy isoniazid thì ngừng levofloxacin và hoàn tất 2HREZ/4HR.",
  ];
  if (i.site === "tbm") notes.unshift("Không có dữ liệu cho Hr-TB ngoài phổi đơn thuần: phác đồ có thể hiệu quả, nhưng thời gian điều trị và chăm sóc hỗ trợ cần quyết định cùng chuyên gia (truyền nhiễm, thần kinh).");
  return { headline: "6(H)REZ-Lfx", blocks, avoid, notes };
}

/* ---------- MDR/RR-TB ---------- */
export const BPALM_DOSE: RxItem[] = [
  r("Bedaquilin", "Một trong hai cách", "200 mg/ngày × 8 tuần, sau đó 100 mg/ngày; HOẶC 400 mg/ngày × 2 tuần, sau đó 200 mg × 3 lần/tuần", undefined, "Ch2 Rec 1.1 Implementation"),
  r("Pretomanid", "Suốt đợt", "200 mg × 1 lần/ngày", undefined, "Ch2 Rec 1.1 Implementation"),
  r("Linezolid", "Suốt đợt; giảm 300 mg/ngày nếu cần để giảm độc tính", "600 mg × 1 lần/ngày", undefined, "Ch2 Rec 1.1 Remark 4; Implementation"),
  r("Moxifloxacin", "Suốt đợt (bỏ nếu kháng fluoroquinolon → BPaL); không thay bằng levofloxacin", "400 mg × 1 lần/ngày", undefined, "Ch2 Rec 1.1 Implementation"),
];
export const BDLLFXC_DOSE: RxItem[] = [
  r("Bedaquilin", "Một trong hai cách", "400 mg/ngày × 2 tuần, sau đó 200 mg × 3 lần/tuần × 22 tuần; HOẶC 200 mg/ngày × 2 tháng, sau đó 100 mg/ngày × 4 tháng", undefined, "Ch2 Rec 1.2 Implementation"),
  r("Delamanid", "2 lần/ngày × 8 tuần, sau đó 1 lần/ngày × 16 tuần", "Module 4 không nêu liều (mg)", undefined, "Ch2 Rec 1.2 Implementation"),
  r("Linezolid", "Người lớn: suốt đợt, không giảm liều theo kế hoạch; có thể ngừng hẳn khi có biến cố bất lợi và đáp ứng tốt", "600 mg/ngày", undefined, "Ch2 Rec 1.2 Implementation"),
  r("Levofloxacin, clofazimin", "Theo kết quả nhạy fluoroquinolon", "Module 4 không nêu liều", undefined, "Ch2 Rec 1.2"),
];

function mdrTb(i: TbIn): TbOut {
  const cns = i.site === "tbm";
  const blocks: TbBlock[] = [];
  const avoid: RxItem[] = [];
  const notes: string[] = [];
  if (cns) {
    blocks.push({
      title: "Phác đồ",
      lead: "MDR/RR-TB màng não: các phác đồ 6 tháng (BPaLM, BDLLfxC) và 9 tháng đều LOẠI TRỪ lao hệ thần kinh trung ương → phác đồ dài hạn cá thể hóa, theo kháng sinh đồ của chủng và khả năng thấm qua hàng rào máu não.",
      items: [
        r("Phác đồ dài hạn", "Đủ 3 thuốc nhóm A + ít nhất 1 thuốc nhóm B (bắt đầu ≥ 4 thuốc có khả năng hiệu quả, ≥ 3 thuốc nếu ngừng bedaquilin); chỉ dùng 1–2 thuốc nhóm A thì thêm cả 2 thuốc nhóm B; thiếu thì thêm nhóm C (KC kháng thuốc 3.1). Tổng thời gian 18–20 tháng cho phần lớn người bệnh (KC 3.15).", undefined, "C-VL", "Ch2 Rec 3.1, 3.15"),
        r("Thấm tốt vào thần kinh trung ương", "Levofloxacin, moxifloxacin, ethionamid hoặc prothionamid, cycloserin hoặc terizidon, linezolid, imipenem-cilastatin. Meropenem được ưu tiên trong viêm màng não và ở trẻ em (imipenem-cilastatin tăng co giật ở trẻ viêm màng não). Isoniazid liều cao và pyrazinamid đạt nồng độ điều trị trong dịch não tủy – hữu ích nếu chủng còn nhạy.", undefined, undefined, "Ch2 – Extrapulmonary TB and TB meningitis"),
        r("Không tính là thuốc hiệu quả", "Acid p-aminosalicylic và ethambutol thấm kém. Amikacin, streptomycin chỉ thấm khi màng não viêm. Ít dữ liệu về clofazimin, bedaquilin, delamanid. Nồng độ dịch não tủy có thể không phản ánh nồng độ ở màng não, nhu mô não.", undefined, undefined, "Ch2 – Extrapulmonary TB and TB meningitis"),
        TBM_STEROID,
      ],
    });
    avoid.push(r("BPaLM, BDLLfxC, phác đồ 9 tháng", "Không áp dụng cho lao hệ thần kinh trung ương.", undefined, undefined, "Ch2 Rec 1.1, 1.2, 2.1, 2.2 Remarks"));
  } else {
    const opts: RxItem[] = [];
    const bpalmOk = (i.age === "a14" || i.age === "adult") && !i.preg;
    if (bpalmOk) {
      opts.push(r("6 tháng – BPaLM", `Bedaquilin, pretomanid, linezolid (600 mg), moxifloxacin trong 6 tháng (26 tuần), 7 ngày/tuần (KC kháng thuốc 1.1). Ưu tiên hơn phác đồ 9 tháng hoặc dài hạn. ${i.fq === "r" ? "Đã kháng fluoroquinolon (pre-XDR-TB): dùng BPaL (bỏ moxifloxacin), có thể kéo dài tổng 39 tuần nếu cấy chưa âm hóa giữa tháng 4–6." : "Làm kháng sinh đồ fluoroquinolon nhưng không trì hoãn bắt đầu; nếu kháng → BPaL."}`, "Bảng liều BPaLM bên dưới", "C-VL", "Ch2 Rec 1.1; Implementation"));
    }
    opts.push(r("6 tháng – BDLLfxC", `Bedaquilin, delamanid, linezolid (600 mg), levofloxacin, clofazimin trong 6 tháng, 7 ngày/tuần (KC kháng thuốc 1.2). Mọi lứa tuổi, kể cả trẻ em, người nhiễm HIV, có thai, cho con bú. ${i.fq === "s" ? "Nhạy fluoroquinolon: bỏ clofazimin → BDLLfx." : i.fq === "r" ? "Kháng fluoroquinolon: bỏ levofloxacin → BDLC." : "Chưa rõ nhạy fluoroquinolon: bắt đầu BDLLfxC rồi chỉnh theo kết quả (nhạy → BDLLfx; kháng → BDLC)."} Có thể kéo dài đến 9 tháng nếu cấy không âm hóa bền vững đến tuần 16.`, "Bảng liều BDLLfxC bên dưới", "C-VL", "Ch2 Rec 1.2; Remark 3; Implementation"));
    if (i.fq === "s") {
      opts.push(r("9 tháng – thay đổi", "BLMZ (ưu tiên) > BLLfxCZ > BDLLfxZ, tất cả 9 tháng; dùng khi không dùng được phác đồ 6 tháng, ưu tiên hơn phác đồ dài hạn (KC kháng thuốc 2.2). Gồm cả trẻ em, người nhiễm HIV, có thai, cho con bú, bệnh lan rộng.", "Module 4 không nêu liều", "C-VL", "Ch2 Rec 2.2"));
      if (!i.severe) opts.push(r("9 tháng – toàn đường uống", "Bedaquilin (6 tháng) + levofloxacin/moxifloxacin, ethionamid, ethambutol, isoniazid liều cao, pyrazinamid, clofazimin (4 tháng, kéo dài đến 6 tháng nếu AFB còn dương cuối tháng 4); sau đó levofloxacin/moxifloxacin, clofazimin, ethambutol, pyrazinamid (5 tháng) (KC kháng thuốc 2.1). Có thể thay ethionamid bằng linezolid 600 mg/ngày × 2 tháng (dạng này dùng được khi có thai).", "Module 4 không nêu liều, trừ linezolid 600 mg/ngày", "C-VL", "Ch2 Rec 2.1 Remarks"));
    }
    opts.push(r("Dài hạn 18–20 tháng", "Khi không đủ tiêu chuẩn phác đồ ngắn: đủ 3 thuốc nhóm A + ≥ 1 thuốc nhóm B; thiếu thì thêm nhóm C (KC 3.1). Tổng 18–20 tháng (KC 3.15) hoặc 15–17 tháng sau âm hóa cấy (KC 3.16); có amikacin/streptomycin: giai đoạn tấn công 6–7 tháng (KC 3.17).", undefined, "C-VL", "Ch2 Rec 3.1, 3.15–3.17"));
    blocks.push({ title: "Phác đồ", lead: "MDR/RR-TB phổi. Xét nghiệm nhạy fluoroquinolon được khuyến khích mạnh ở mọi người bệnh MDR/RR-TB. Điều kiện chung của phác đồ ngắn: phơi nhiễm trước < 1 tháng với các thuốc thành phần (nếu > 1 tháng: chỉ dùng khi đã loại trừ kháng các thuốc đó).", items: opts });
    if (bpalmOk) blocks.push({ title: "Liều BPaLM / BPaL", lead: "Theo phần Implementation considerations của KC kháng thuốc 1.1.", items: BPALM_DOSE });
    blocks.push({ title: "Liều BDLLfxC", lead: "Theo phần Implementation considerations của KC kháng thuốc 1.2.", items: BDLLFXC_DOSE });
    if (!bpalmOk) avoid.push(r("BPaLM", i.preg ? "Không áp dụng cho phụ nữ có thai, cho con bú (dữ liệu an toàn pretomanid hạn chế)." : "Chỉ áp dụng cho người ≥ 14 tuổi.", undefined, undefined, "Ch2 Rec 1.1 Remarks 2c, 3"));
    if (i.fq !== "s") avoid.push(r("Phác đồ 9 tháng", i.fq === "r" ? "Không dùng khi kháng fluoroquinolon." : "Chỉ dùng khi đã loại trừ kháng fluoroquinolon.", undefined, undefined, "Ch2 Rec 2.1, 2.2"));
    if (i.fq === "s" && i.severe) avoid.push(r("9 tháng toàn đường uống (có ethionamid)", "Không áp dụng khi bệnh lan rộng (hang hai bên hoặc tổn thương nhu mô lan rộng trên X-quang) hoặc lao ngoài phổi nặng.", undefined, undefined, "Ch2 Rec 2.1 Remark 3b"));
    avoid.push(r("9 tháng DCLLfxZ, DCMZ", "Không dùng (so với phác đồ dài hạn) ở MDR/RR-TB nhạy fluoroquinolon (KC kháng thuốc 2.3).", undefined, "C-VL", "Ch2 Rec 2.3"));
  }
  blocks.push({
    title: "Nhóm thuốc cho phác đồ dài hạn",
    lead: "Bảng 3.1 Module 4; nhóm C xếp theo thứ tự ưu tiên giảm dần.",
    items: [
      r("Nhóm A – dùng cả 3", "Levofloxacin hoặc moxifloxacin (KC 3.3, Mạnh · TB); bedaquilin (KC 3.4: ≥ 18 tuổi Mạnh · TB; 6–17 tuổi Có ĐK · rất thấp); linezolid (KC 3.5, Mạnh · TB).", undefined, undefined, "Ch2 Table 3.1; Rec 3.3–3.5"),
      r("Nhóm B – thêm 1 hoặc cả 2", "Clofazimin; cycloserin hoặc terizidon (KC 3.6).", undefined, "C-VL", "Ch2 Table 3.1; Rec 3.6"),
      r("Nhóm C – bổ sung", "Ethambutol; delamanid; pyrazinamid; imipenem-cilastatin hoặc meropenem (dùng kèm acid clavulanic – không tính amoxicilin-clavulanat là thuốc hiệu quả riêng); amikacin (hoặc streptomycin; ≥ 18 tuổi, khi nhạy và theo dõi được độc tính); ethionamid hoặc prothionamid; acid p-aminosalicylic (hai thuốc cuối chỉ khi không dùng được bedaquilin, linezolid, clofazimin, delamanid).", undefined, undefined, "Ch2 Table 3.1; Rec 3.7–3.13"),
    ],
  });
  avoid.push(r("Kanamycin, capreomycin", "Không đưa vào phác đồ dài hạn (KC kháng thuốc 3.2).", undefined, "C-VL", "Ch2 Rec 3.2"));
  avoid.push(r("Acid clavulanic đơn thuần", "Không dùng như một thuốc trong phác đồ dài hạn (KC kháng thuốc 3.14).", undefined, "S-L", "Ch2 Rec 3.14"));
  const h = hivBlock(i, true);
  if (h) blocks.push(h);
  notes.push("Phác đồ dài hạn: cấy đờm kèm soi đờm để theo dõi đáp ứng, nên cấy lại hằng tháng (KC kháng thuốc 5.1, Mạnh · TB).");
  notes.push("BPaLM và BDLLfxC là liệu trình chuẩn hóa: tự ý ngừng sớm hoặc thay thuốc thành phần có thể làm kết quả kém hơn (ngoại trừ ngừng linezolid do biến cố bất lợi).");
  if (cns) notes.push("Phụ nữ có thai: amikacin, streptomycin, prothionamid, ethionamid thường chống chỉ định.");
  return { headline: cns ? "Phác đồ dài hạn cá thể hóa theo kháng sinh đồ và khả năng thấm thần kinh trung ương + corticoid bổ trợ" : (i.age === "a14" || i.age === "adult") && !i.preg ? (i.fq === "r" ? "BPaL hoặc BDLC (6 tháng)" : "BPaLM hoặc BDLLfxC (6 tháng)") : "BDLLfxC (6 tháng)", blocks, avoid, notes };
}

export function tbPlan(i: TbIn): TbOut {
  if (i.res === "hr") return hrTb(i);
  if (i.res === "mdr") return mdrTb(i);
  return i.site === "tbm" ? dsMeningitis(i) : dsPulmonary(i);
}
