/*
  Lao phổi và lao màng não – công cụ chọn phác đồ và liều.
  Nguồn:
  (1) WHO consolidated guidelines on tuberculosis. Module 4: treatment and care (2025, ISBN 978-92-4-010724-3)
      – khuyến cáo và mức GRADE (S/C = mạnh/có điều kiện; H/M/L/VL = độ tin cậy cao/TB/thấp/rất thấp);
      liều mg/kg trẻ em theo KC 8 (2014) in lại trong bảng tóm tắt khuyến cáo.
  (2) WHO consolidated operational handbook on tuberculosis. Module 4: treatment and care (2025,
      ISBN 978-92-4-010814-1) – liều theo cân nặng: Annex 4 bảng A4.1 (lao nhạy cảm thuốc) và A4.2
      (lao đa kháng); liều phác đồ BPaLM (bảng 2.4.1), BDLLfxC (mục 4.2 Dosing), 9 tháng cải tiến;
      chỉnh liều suy thận: mục 8.4 (lao nhạy cảm thuốc) và Annex 1 (từng thuốc hàng hai);
      thời gian lao màng não: mục 7.1–7.2; pyridoxin: Annex 2.
  Không có liều corticoid trong cả hai tài liệu -> để trống.
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
  wt: number;
  severe: boolean;
  preg: boolean;
  hiv: boolean;
  cd4lt100: boolean;
  sam: boolean;
  prior2y: boolean;
  highE: boolean;
  renal: boolean;
};
export type TbOut = { headline: string; blocks: TbBlock[]; avoid: RxItem[]; notes: string[] };

const r = (role: string, text: string, dose: string | undefined, grade: string | undefined, ref: string): RxItem => ({ role, text, dose, grade, ref });
const n = (x: number) => x.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
const mg = (x: number) => `${n(x)} mg`;
const tab = (count: number, strength: number) => `${n(count)} viên ${strength} mg (${mg(count * strength)})`;

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

/* ---------- Bảng A4.1 – lao nhạy cảm thuốc, ≥ 25 kg ---------- */
const DS_BANDS = ["25–< 30 kg", "30–< 35 kg", "35–< 50 kg", "50–< 65 kg", "≥ 65 kg"];
const dsBand = (w: number) => (w < 25 ? -1 : w < 30 ? 0 : w < 35 ? 1 : w < 50 ? 2 : w < 65 ? 3 : 4);
const DS_FDC = [2, 3, 4, 4, 5];
const DS_H300 = [0.5, 1, 1, 1, 1.25];
const DS_R300 = [1, 1.5, 2, 2, 2.5];
const DS_E400 = [1.5, 2, 3, 3, 4];
const DS_Z400 = [2, 3, 4, 4, 5];
const DS_Z500 = [1.5, 2.5, 3, 3, 4];

/* ---------- Bảng A4.2 – lao đa kháng, từ 24 kg ---------- */
const MDR_BANDS = ["24–< 30 kg", "30–< 36 kg", "36–< 46 kg", "46–< 56 kg", "56–< 70 kg", "≥ 70 kg"];
const mdrBand = (w: number) => (w < 24 ? -1 : w < 30 ? 0 : w < 36 ? 1 : w < 46 ? 2 : w < 56 ? 3 : w < 70 ? 4 : 5);
const LFX = [500, 750, 750, 1000, 1000, 1000];
const LFX_TAB = ["2 viên 250 mg hoặc 1 viên 500 mg (500 mg)", "3 viên 250 mg, 1,5 viên 500 mg hoặc 1 viên 750 mg (750 mg)", "3 viên 250 mg, 1,5 viên 500 mg hoặc 1 viên 750 mg (750 mg)", "4 viên 250 mg, 2 viên 500 mg (1.000 mg) hoặc 1,5 viên 750 mg (1.125 mg)", "4 viên 250 mg, 2 viên 500 mg (1.000 mg) hoặc 1,5 viên 750 mg (1.125 mg)", "4 viên 250 mg, 2 viên 500 mg (1.000 mg) hoặc 1,5 viên 750 mg (1.125 mg)"];
const MFX_HIGH = ["", "1–1,5 viên 400 mg (400–600 mg)", "1,5 viên 400 mg (600 mg)", "1,5–2 viên 400 mg (600–800 mg)", "2 viên 400 mg (800 mg)", "2 viên 400 mg (800 mg)"];
const LZD = [300, 300, 450, 600, 600, 600];
const CS250 = [2, 2, 2, 3, 3, 3];
const E400 = [1.5, 2, 2, 3, 3, 4];
const Z400 = [2.5, 3, 4, 4, 4, 5];
const Z500 = [2, 2.5, 3, 3, 3, 4];
const ETO250 = [2, 2, 2, 3, 3, 4];
const HH300 = [1.5, 1.5, 1.5, 2, 2, 2];
const DLM = ["50 mg sáng + 25 mg tối", "50 mg × 2 lần/ngày", "50 mg × 2 lần/ngày", "100 mg × 2 lần/ngày", "100 mg × 2 lần/ngày", "100 mg × 2 lần/ngày"];
const PAS = ["3,5 g × 2 lần/ngày", "4 g × 2 lần/ngày", "4 g × 2 lần/ngày", "4 g × 2 lần/ngày", "4 g × 2 lần/ngày", "4–6 g × 2 lần/ngày"];
const A42 = "Annex 4 – A4.2";

function mdrDoseTable(b: number): RxItem[] {
  const ge30 = b >= 1;
  const rows: RxItem[] = [
    r("Levofloxacin", "1 lần/ngày", LFX_TAB[b], undefined, A42),
    r("Moxifloxacin", b >= 1 ? "1 lần/ngày; liều cao chỉ trong phác đồ dài hạn, khi không có nguy cơ độc tính" : "1 lần/ngày", `${mg(400)}${b >= 1 ? `; liều cao ${MFX_HIGH[b]}` : ""}`, undefined, A42 + " foot c"),
    r("Bedaquilin", ge30 ? "Hoặc (> 14 tuổi) 200 mg/ngày × 8 tuần, sau đó 100 mg/ngày" : "Viên 100 mg", ge30 ? "400 mg/ngày × 2 tuần, sau đó 200 mg thứ 2-4-6" : "200 mg/ngày × 2 tuần, sau đó 100 mg thứ 2-4-6", undefined, A42),
    r("Linezolid", ge30 ? "1 lần/ngày. Phác đồ 9 tháng cải tiến: 600 mg × 16 tuần, sau đó 300 mg/ngày hoặc 600 mg thứ 2-4-6" : "1 lần/ngày", mg(LZD[b]), undefined, A42),
    r("Clofazimin", "1 lần/ngày", mg(100), undefined, A42),
    r("Cycloserin / terizidon", "Kèm pyridoxin 50 mg/ngày (không quá 100 mg)", tab(CS250[b], 250), undefined, A42 + "; Annex 2"),
    r("Ethambutol", "1 lần/ngày", tab(E400[b], 400), undefined, A42),
    r("Delamanid", "Viên 50 mg", DLM[b], undefined, A42),
    r("Pyrazinamid", "1 lần/ngày", `${tab(Z400[b], 400)} hoặc ${tab(Z500[b], 500)}`, undefined, A42),
  ];
  if (ge30) rows.push(r("Imipenem-cilastatin", "Chỉ dùng kèm acid clavulanic; không dùng < 15 tuổi", "1 g + 1 g × 2 lần/ngày (TM)", undefined, A42));
  rows.push(r("Meropenem", "Chỉ dùng kèm acid clavulanic", ge30 ? "1 g × 3 lần/ngày hoặc 2 g × 2 lần/ngày (TM)" : "550 mg (11 mL lọ 1 g/20 mL) × 3 lần/ngày (TM)", undefined, A42));
  rows.push(r("Acid clavulanic", "Dạng amoxicilin-clavulanat 500/125 mg, uống 30–60 phút trước mỗi liều carbapenem", ge30 ? "1 viên × 2–3 lần/ngày (theo số liều carbapenem)" : "1 viên × 3 lần/ngày", undefined, A42 + "; Annex 1"));
  if (b >= 3) rows.push(r("Amikacin", "Chỉ > 18 tuổi, khi nhạy và theo dõi được độc tính", b === 3 ? "750–1.000 mg/ngày (3–4 mL ống 500 mg/2 mL)" : "1.000 mg/ngày (4 mL)", undefined, A42 + " foot i"));
  rows.push(r("Ethionamid / prothionamid", "1 lần/ngày (có thể chia 2 lần nếu khó dung nạp)", tab(ETO250[b], 250), undefined, A42));
  rows.push(r("Acid p-aminosalicylic (PAS)", "Gói PAS natri tương đương 4 g PAS", PAS[b], undefined, A42));
  rows.push(r("Isoniazid liều cao", "Kèm pyridoxin", tab(HH300[b], 300), undefined, A42));
  if (ge30) rows.push(r("Pretomanid", "Chỉ trong BPaLM/BPaL", mg(200), undefined, A42));
  return rows;
}

/* ---------- Liều trẻ em theo mg/kg (KC 8, 2014) ---------- */
function childMgKg(w: number, withE: boolean): RxItem[] {
  const calc = (d: number, lo: number, hi: number, max?: number) => {
    const c = (x: number) => Math.round(Math.min(x * w, max ?? Infinity));
    return `${d} mg/kg → ${mg(c(d))} (khoảng ${lo}–${hi} mg/kg: ${n(c(lo))}–${n(c(hi))} mg)${max ? `; tối đa ${mg(max)}` : ""}`;
  };
  const rows = [
    r("Isoniazid (H)", "1 lần/ngày", calc(10, 7, 15, 300), "S-M", "Annex 1.1 Rec 8 (2014)"),
    r("Rifampicin (R)", "1 lần/ngày", calc(15, 10, 20, 600), "S-M", "Annex 1.1 Rec 8 (2014)"),
    r("Pyrazinamid (Z)", "1 lần/ngày, giai đoạn tấn công", calc(35, 30, 40), "S-M", "Annex 1.1 Rec 8 (2014)"),
  ];
  if (withE) rows.push(r("Ethambutol (E)", "1 lần/ngày, giai đoạn tấn công", calc(20, 15, 25), "S-M", "Annex 1.1 Rec 8 (2014)"));
  return rows;
}
const CHILD_FORM = "Trẻ ≤ 25 kg: ưu tiên viên phối hợp dạng phân tán cho trẻ em HRZ 50/75/150 mg và HR 50/75 mg; trẻ < 3 tháng có thể cần chỉnh liều – bác sĩ có kinh nghiệm lao trẻ em quyết định.";

/* ---------- Liều HRZE người lớn / ≥ 25 kg ---------- */
function dsDose(w: number, withE: boolean, contHR: boolean, child: boolean): TbBlock {
  const b = dsBand(w);
  if (b < 0) return { title: `Liều – ${n(w)} kg`, lead: CHILD_FORM, items: childMgKg(w, withE) };
  const items: RxItem[] = [
    r("Tấn công", withE ? "HRZE 75/150/400/275 mg (viên phối hợp)" : "HRZ – dùng thuốc rời theo dòng dưới (không có viên HRZ người lớn)", withE ? `${n(DS_FDC[b])} viên/ngày` : undefined, undefined, "Annex 4 – A4.1"),
  ];
  if (contHR) items.push(r("Duy trì", "HR 75/150 mg (viên phối hợp)", `${n(DS_FDC[b])} viên/ngày`, undefined, "Annex 4 – A4.1"));
  items.push(r("Thuốc rời (thay viên phối hợp)", `Isoniazid ${tab(DS_H300[b], 300)}; rifampicin ${tab(DS_R300[b], 300)}; pyrazinamid ${tab(DS_Z400[b], 400)} hoặc ${tab(DS_Z500[b], 500)}${withE ? `; ethambutol ${tab(DS_E400[b], 400)}` : ""}`, "H 4–6 · R 8–12 · Z 20–30 · E 15–25 mg/kg/ngày", undefined, "Annex 4 – A4.1"));
  return { title: `Liều – ${n(w)} kg (nhóm ${DS_BANDS[b]})`, lead: child ? "Trẻ ≥ 25 kg dùng bảng liều theo cân nặng A4.1 như người lớn." : undefined, items };
}

function renalBlock(i: TbIn, drugs: "ds" | "mdr"): TbBlock | null {
  if (!i.renal) return null;
  const range = (lo: number, hi: number) => `${n(Math.round(lo * i.wt))}–${n(Math.round(hi * i.wt))} mg`;
  if (drugs === "ds") {
    return {
      title: "Suy thận – độ thanh thải creatinin < 30 mL/phút hoặc lọc máu",
      items: [
        r("Pyrazinamid", "3 lần/tuần, sau lọc máu", `25–35 mg/kg/liều (${range(25, 35)})`, undefined, "Handbook 8.4"),
        r("Ethambutol", "3 lần/tuần, sau lọc máu", `15–25 mg/kg/liều (${range(15, 25)})`, undefined, "Handbook 8.4"),
        r("Rifapentin, moxifloxacin", "Không cần chỉnh liều", undefined, undefined, "Handbook 8.4"),
      ],
    };
  }
  return {
    title: "Suy thận – độ thanh thải creatinin < 30 mL/phút hoặc lọc máu",
    items: [
      r("Levofloxacin", "3 lần/tuần", "750–1.000 mg/liều", undefined, "Annex 1"),
      r("Cycloserin / terizidon", "Theo dõi nồng độ nếu được (đỉnh < 35 mcg/mL)", "250 mg/ngày hoặc 500 mg × 3 lần/tuần", undefined, "Annex 1"),
      r("Ethambutol", "3 lần/tuần", `15–25 mg/kg/liều (${range(15, 25)})`, undefined, "Annex 1"),
      r("Pyrazinamid", "3 lần/tuần", `25 mg/kg/liều (${n(Math.round(25 * i.wt))} mg)`, undefined, "Annex 1"),
      r("Imipenem-cilastatin, meropenem", "Độ thanh thải 20–40 mL/phút: 750 mg mỗi 12 giờ; < 20 mL/phút: 500 mg mỗi 12 giờ", undefined, undefined, "Annex 1"),
      r("Amikacin", "Nên thay thuốc khác; nếu dùng: sau lọc máu, 2–3 lần/tuần", `12–15 mg/kg/liều (${range(12, 15)})`, undefined, "Annex 1"),
      r("Isoniazid liều cao", "Suy thận, lọc máu", "300 mg/ngày", undefined, "Annex 1"),
      r("Delamanid", "Không khuyến cáo khi suy thận nặng (chưa có dữ liệu)", undefined, undefined, "Annex 1"),
      r("Không chỉnh liều", "Moxifloxacin, clofazimin, ethionamid, PAS; linezolid (thận trọng – tích lũy chất chuyển hóa); bedaquilin (thận trọng khi lọc máu)", undefined, undefined, "Annex 1"),
    ],
  };
}

function hivBlock(i: TbIn, dr: boolean): TbBlock | null {
  if (!i.hiv) return null;
  if (dr) return { title: "Nhiễm HIV", items: [r("ART", "Bắt đầu ART trong 8 tuần đầu điều trị lao, không phụ thuộc CD4.", undefined, "S-VL", "Ch2 Rec 6.1")] };
  if (i.site === "tbm") return { title: "Nhiễm HIV", items: [r("ART – lao màng não", "Không bắt đầu ART trong 2 tuần đầu (tăng biến cố nặng); có thể hoãn ART 4–8 tuần sau khi bắt đầu điều trị lao.", undefined, undefined, "Ch1 Rec 3.2 footnote a")] };
  return { title: "Nhiễm HIV", items: [r("ART", "Bắt đầu ART trong vòng 2 tuần sau khi bắt đầu điều trị lao, không phụ thuộc CD4.", undefined, "S-L", "Ch1 Rec 3.2")] };
}

/* ---------- Lao phổi nhạy cảm thuốc ---------- */
function dsPulmonary(i: TbIn): TbOut {
  const child = i.age !== "adult";
  const blocks: TbBlock[] = [];
  const avoid: RxItem[] = [];
  const notes: string[] = [];
  const opts: RxItem[] = [];
  const b = dsBand(i.wt);

  const hpmzAge = i.age === "a12" || i.age === "a14" || i.age === "adult";
  const hpmzEx: string[] = [];
  if (i.wt < 40) hpmzEx.push("cân nặng < 40 kg");
  if (i.preg) hpmzEx.push("có thai, cho con bú, sau sinh");
  if (i.hiv && i.cd4lt100) hpmzEx.push("HIV có CD4 < 100 tế bào/mm³");
  const shineAge = i.age === "child" || i.age === "a12" || i.age === "a14";
  const shineEx: string[] = [];
  if (i.severe) shineEx.push("lao không thuộc nhóm “không nặng”");
  if (i.sam) shineEx.push("suy dinh dưỡng cấp nặng");
  if (i.prior2y) shineEx.push("đã điều trị lao trong 2 năm trước");
  const useE = !child || i.severe || i.highE || i.hiv;

  if (i.age === "lt3m") {
    opts.push(r("6 tháng", "2HRZ(E)/4HR – điều trị ngay khi nghi ngờ hoặc xác định lao phổi.", "Liều mg/kg – bảng dưới", "S-L", "Annex 1.1 Rec 11 (2014)"));
  } else if (!child) {
    opts.push(r("6 tháng – chuẩn", "2HRZE/4HR: HRZE 2 tháng → HR 4 tháng, uống hằng ngày.", b >= 0 ? `HRZE ${n(DS_FDC[b])} viên/ngày → HR ${n(DS_FDC[b])} viên/ngày` : undefined, "S-H", "Ch1 Rec 1.1; Annex 4 A4.1"));
  } else {
    opts.push(r("6 tháng", `2HRZ${useE ? "E" : ""}/4HR: HRZ${useE ? "E" : ""} 2 tháng → HR 4 tháng.${useE ? "" : " Thêm E khi bệnh lan rộng, nơi tỷ lệ HIV hoặc kháng isoniazid cao, trẻ nhiễm HIV."}`, "Liều – bảng dưới", "S-M", "Annex 1.1 Rec 9–10 (2014)"));
  }
  if (shineAge && shineEx.length === 0) {
    opts.unshift(r("4 tháng – lao không nặng", `2HRZ${useE ? "E" : "(E)"}/2HR: HRZ${useE ? "E" : "(E)"} 2 tháng → HR 2 tháng, 7 ngày/tuần. Liều như phác đồ 6 tháng.`, "Liều – bảng dưới", "S-M", "Ch1 Rec 2.2; Handbook 5"));
  }
  if (hpmzAge && hpmzEx.length === 0 && b >= 2) {
    opts.push(r("4 tháng – HPMZ", "2HPMZ/2HPM: isoniazid, rifapentin, moxifloxacin, pyrazinamid 2 tháng → isoniazid, rifapentin, moxifloxacin 2 tháng; 7 ngày/tuần, uống cùng bữa ăn. Không thay moxifloxacin bằng fluoroquinolon khác.", `Rifapentin 1.200 mg (8 viên 150 mg hoặc 4 viên 300 mg) + moxifloxacin 400 mg + isoniazid ${mg(DS_H300[b] * 300)} + pyrazinamid ${tab(DS_Z400[b], 400)}`, "C-M", "Ch1 Rec 2.1; Handbook 4; Annex 4 A4.1"));
  }
  blocks.push({ title: "Phác đồ", items: opts });
  blocks.push(dsDose(i.wt, useE || !child, true, child));
  const rb = renalBlock(i, "ds");
  if (rb) blocks.push(rb);
  const h = hivBlock(i, false);
  if (h) blocks.push(h);

  if (hpmzAge && hpmzEx.length) avoid.push(r("2HPMZ/2HPM", `Không dùng: ${hpmzEx.join("; ")}.`, undefined, undefined, "Ch1 Rec 2.1"));
  if (shineAge && shineEx.length) avoid.push(r("2HRZ(E)/2HR", `Không dùng: ${shineEx.join("; ")} – điều trị 6 tháng.`, undefined, undefined, "Ch1 Rec 2.2"));
  avoid.push(r("Dùng cách quãng", "Không dùng 3 lần/tuần; không bao giờ 2 lần/tuần.", undefined, "C-VL", "Ch1 Rec 1.3"));

  notes.push("Ưu tiên viên phối hợp liều cố định; không kéo dài giai đoạn tấn công khi AFB còn dương cuối tháng 2.");
  if (shineAge) notes.push("Lao “không nặng”: lao hạch ngoại biên; lao hạch trong lồng ngực không tắc đường thở; tràn dịch màng phổi không biến chứng; tổn thương ít vi khuẩn, không hang, trong một thùy, không hình ảnh kê.");
  const headline = opts.map((o) => o.text.match(/^[0-9][0-9A-Z()/]+/)?.[0] ?? o.role).join(" hoặc ");
  return { headline, blocks, avoid, notes };
}

/* ---------- Corticoid lao màng não ---------- */
export const TBM_STEROID: RxItem = r(
  "Corticoid bổ trợ",
  "Dexamethason hoặc prednisolon ngay từ đầu, giảm dần trong 6–8 tuần, bất kể mức độ nặng; dùng đường uống nếu không có dạng tiêm.",
  undefined,
  "S-M",
  "Ch1 Rec 4.1; Handbook 7.3",
);

/* ---------- Lao màng não nhạy cảm thuốc ---------- */
function dsMeningitis(i: TbIn): TbOut {
  const child = i.age !== "adult";
  const b = dsBand(i.wt);
  const items: RxItem[] = [];
  if (child) {
    items.push(r("12 tháng", "2HRZE/10HR: HRZE 2 tháng → HR 10 tháng. Dùng được cho mọi trẻ, kể cả nhiễm HIV.", "Liều như lao phổi – bảng dưới", "S-L", "Annex 1.1 Rec 14 (2014); Handbook 7.2"));
    if (!i.hiv) items.push(r("6 tháng tăng cường", "6HRZEto: isoniazid, rifampicin, pyrazinamid, ethionamid 6 tháng. Không dùng cho trẻ nhiễm HIV.", "Liều: Module 5 – không có trong tài liệu đã đọc", "C-L", "Handbook 7.1–7.2"));
  } else {
    items.push(r("Người lớn", "2HRZE/4HR là phác đồ lõi; bác sĩ có thể kéo dài đến 12 tháng. Ngoài khuyến cáo WHO, một số chuyên gia đề nghị tổng 9–12 tháng.", b >= 0 ? `HRZE ${n(DS_FDC[b])} viên/ngày × 2 tháng → HR ${n(DS_FDC[b])} viên/ngày` : undefined, undefined, "Handbook 7.1–7.2; Annex 4 A4.1"));
  }
  items.push(TBM_STEROID);
  items.push(r("Pyridoxin", "Bổ sung hằng ngày hoặc hằng tuần khi dùng isoniazid cho lao thể nặng.", undefined, undefined, "Handbook 2"));
  const blocks: TbBlock[] = [{ title: "Phác đồ", items }, dsDose(i.wt, true, true, child)];
  const rb = renalBlock(i, "ds");
  if (rb) blocks.push(rb);
  const h = hivBlock(i, false);
  if (h) blocks.push(h);
  const avoid: RxItem[] = [
    r("2HPMZ/2HPM, 2HRZ(E)/2HR", "Không dùng cho lao màng não.", undefined, undefined, "Ch1 Rec 2.1, 2.2; Handbook 7.2"),
    r("Dùng cách quãng", "Không dùng 3 lần/tuần; không bao giờ 2 lần/tuần.", undefined, "C-VL", "Ch1 Rec 1.3"),
  ];
  const notes = ["Lợi ích tử vong của corticoid tăng theo mức độ nặng; nhóm dùng corticoid ít biến cố nặng hơn, kể cả viêm gan nặng."];
  return { headline: child ? (i.hiv ? "2HRZE/10HR + corticoid" : "2HRZE/10HR hoặc 6HRZEto + corticoid") : "2HRZE/4HR (có thể kéo dài đến 12 tháng) + corticoid", blocks, avoid, notes };
}

/* ---------- Hr-TB ---------- */
function hrTb(i: TbIn): TbOut {
  const b = dsBand(i.wt);
  const m = mdrBand(i.wt);
  const items: RxItem[] = [
    r("6 tháng", "6(H)REZ-Lfx: rifampicin, ethambutol, pyrazinamid, levofloxacin (± isoniazid) 6 tháng; có thể dùng viên HRZE.", b >= 0 && m >= 0 ? `HRZE ${n(DS_FDC[b])} viên/ngày + levofloxacin ${mg(LFX[m])}/ngày` : undefined, "C-VL", "Ch2 Rec 4.1; Handbook Hr-TB; Annex 4"),
    r("Không dùng được levofloxacin", "6(H)REZ.", b >= 0 ? `HRZE ${n(DS_FDC[b])} viên/ngày` : undefined, undefined, "Handbook Hr-TB"),
  ];
  if (i.site === "tbm") items.push(TBM_STEROID);
  const blocks: TbBlock[] = [{ title: "Phác đồ", items }];
  if (b < 0) blocks.push(dsDose(i.wt, true, false, true));
  if (m >= 0) blocks.push({ title: `Levofloxacin – ${n(i.wt)} kg`, items: [r("Levofloxacin", "1 lần/ngày × 6 tháng", LFX_TAB[m], undefined, A42)] });
  const rb = renalBlock(i, "ds");
  if (rb) rb.items.push(r("Levofloxacin", "Độ thanh thải < 30 mL/phút: 3 lần/tuần", "750–1.000 mg/liều", undefined, "Annex 1"));
  if (rb) blocks.push(rb);
  if (i.hiv) blocks.push({ title: "Nhiễm HIV", items: [r("ART", "6(H)REZ-Lfx dùng được ở người nhiễm HIV; ưu tiên bắt đầu ART trong 8 tuần sau khi bắt đầu điều trị lao, không phụ thuộc CD4.", undefined, undefined, "Ch2 Hr-TB – HIV")] });
  const avoid: RxItem[] = [
    r("Streptomycin, thuốc tiêm khác", "Không thêm vào phác đồ.", undefined, "C-VL", "Ch2 Rec 4.2"),
    r("Levofloxacin", "Không thêm khi chưa loại trừ kháng rifampicin, kháng hoặc không dung nạp fluoroquinolon, QT kéo dài, có thai.", undefined, undefined, "Handbook Hr-TB"),
  ];
  const notes = ["Nghi ngờ mạnh Hr-TB khi chờ kết quả: có thể bắt đầu (H)REZ-Lfx; nếu nhạy isoniazid thì ngừng levofloxacin, hoàn tất 2HRZE/4HR."];
  if (i.site === "tbm") notes.unshift("Hr-TB ngoài phổi: chưa có dữ liệu – thời gian điều trị quyết định cùng chuyên gia.");
  return { headline: "6(H)REZ-Lfx", blocks, avoid, notes };
}

/* ---------- MDR/RR-TB ---------- */
const BPALM_ADULT = "Bedaquilin 400 mg/ngày × 2 tuần → 200 mg thứ 2-4-6 (hoặc 200 mg/ngày × 8 tuần → 100 mg/ngày) + pretomanid 200 mg/ngày + linezolid 600 mg/ngày + moxifloxacin 400 mg/ngày; uống cùng bữa ăn";

function mdrTb(i: TbIn): TbOut {
  const cns = i.site === "tbm";
  const m = mdrBand(i.wt);
  const adult = i.age === "adult";
  const blocks: TbBlock[] = [];
  const avoid: RxItem[] = [];
  const notes: string[] = [];
  const longReg = r("Dài hạn 18–20 tháng", "Đủ 3 thuốc nhóm A (levofloxacin hoặc moxifloxacin, bedaquilin, linezolid) + ≥ 1 thuốc nhóm B (clofazimin, cycloserin/terizidon); thiếu thì thêm nhóm C. Bắt đầu ≥ 4 thuốc có hiệu lực.", "Liều – bảng dưới", "C-VL", "Ch2 Rec 3.1, 3.15");
  if (cns) {
    blocks.push({
      title: "Phác đồ",
      lead: "Phác đồ 6 và 9 tháng loại trừ lao thần kinh trung ương → phác đồ dài hạn theo kháng sinh đồ và khả năng thấm vào thần kinh trung ương.",
      items: [
        longReg,
        r("Thấm tốt", "Levofloxacin, moxifloxacin, linezolid, cycloserin/terizidon, ethionamid/prothionamid, meropenem (ưu tiên hơn imipenem), isoniazid liều cao và pyrazinamid (nếu còn nhạy).", undefined, undefined, "Ch2 – TB meningitis"),
        r("Không tính là thuốc hiệu lực", "PAS, ethambutol (thấm kém); amikacin, streptomycin chỉ thấm khi màng não viêm; ít dữ liệu: clofazimin, bedaquilin, delamanid.", undefined, undefined, "Ch2 – TB meningitis"),
        TBM_STEROID,
      ],
    });
    avoid.push(r("BPaLM, BDLLfxC, phác đồ 9 tháng", "Không dùng cho lao thần kinh trung ương.", undefined, undefined, "Ch2 Rec 1.1, 1.2, 2.1, 2.2"));
  } else {
    const opts: RxItem[] = [];
    const bpalmOk = (i.age === "a14" || adult) && !i.preg;
    if (bpalmOk) {
      opts.push(r(i.fq === "r" ? "6 tháng – BPaL" : "6 tháng – BPaLM", `Bedaquilin, pretomanid, linezolid${i.fq === "r" ? "" : ", moxifloxacin"} 26 tuần, 7 ngày/tuần. ${i.fq === "r" ? "Bỏ moxifloxacin; kéo dài đến 39 tuần nếu cấy chưa âm hóa tháng 4." : i.fq === "unknown" ? "Kháng fluoroquinolon → bỏ moxifloxacin (BPaL)." : ""} Linezolid giảm 300 mg hoặc ngừng nếu độc tính (tránh chỉnh trong 9 tuần đầu).`, i.fq === "r" ? BPALM_ADULT.replace(" + moxifloxacin 400 mg/ngày", "") : BPALM_ADULT, "C-VL", "Ch2 Rec 1.1; Handbook bảng 2.4.1"));
    }
    const bdlName = i.fq === "s" ? "BDLLfx" : i.fq === "r" ? "BDLC" : "BDLLfxC";
    const bdlDose = adult && m >= 0
      ? `Bedaquilin như BPaLM + delamanid 100 mg × 2 lần/ngày × 8 tuần → 200 mg/ngày + linezolid 600 mg/ngày${i.fq !== "r" ? ` + levofloxacin ${mg(LFX[m])}/ngày` : ""}${i.fq !== "s" ? " + clofazimin 100 mg/ngày" : ""}`
      : "Trẻ em, vị thành niên: liều theo cân nặng – bảng dưới";
    opts.push(r(`6 tháng – ${bdlName}`, `Bedaquilin, delamanid, linezolid${i.fq !== "r" ? ", levofloxacin" : ""}${i.fq !== "s" ? ", clofazimin" : ""} 24 tuần, 7 ngày/tuần. Mọi tuổi, kể cả có thai, cho con bú, HIV.${i.fq === "unknown" ? " Chờ kết quả fluoroquinolon: nhạy → bỏ clofazimin; kháng → bỏ levofloxacin." : ""}`, bdlDose, "C-VL", "Ch2 Rec 1.2; Handbook 4.2"));
    if (i.fq === "s") {
      opts.push(r("9 tháng cải tiến", "BLMZ (ưu tiên) > BLLfxCZ > BDLLfxZ, 9 tháng – khi không dùng được phác đồ 6 tháng.", "Bedaquilin như BPaLM; linezolid 600 mg × 16 tuần → 300 mg/ngày hoặc 600 mg thứ 2-4-6; thuốc khác theo bảng dưới", "C-VL", "Ch2 Rec 2.2; Handbook 5.2"));
      if (!i.severe) opts.push(r("9 tháng toàn đường uống", "Bedaquilin 6 tháng + levofloxacin/moxifloxacin, clofazimin, pyrazinamid, ethambutol 9 tháng + isoniazid liều cao, ethionamid 4 tháng (có thể thay ethionamid bằng linezolid 2 tháng).", "Theo bảng dưới", "C-VL", "Ch2 Rec 2.1; Handbook 5.1"));
    }
    opts.push(longReg);
    blocks.push({ title: "Phác đồ", lead: "Làm kháng sinh đồ fluoroquinolon cho mọi người bệnh. Phác đồ ngắn: phơi nhiễm trước với thuốc thành phần < 1 tháng.", items: opts });
    if (!bpalmOk) avoid.push(r("BPaLM", i.preg ? "Không dùng khi có thai, cho con bú." : "Chỉ ≥ 14 tuổi.", undefined, undefined, "Ch2 Rec 1.1"));
    if (i.fq !== "s") avoid.push(r("Phác đồ 9 tháng", i.fq === "r" ? "Không dùng khi kháng fluoroquinolon." : "Chỉ dùng khi đã loại trừ kháng fluoroquinolon.", undefined, undefined, "Ch2 Rec 2.1, 2.2"));
    if (i.fq === "s" && i.severe) avoid.push(r("9 tháng toàn đường uống", "Không dùng khi bệnh lan rộng.", undefined, undefined, "Ch2 Rec 2.1"));
  }
  if (m >= 0) blocks.push({ title: `Liều theo cân nặng – ${n(i.wt)} kg (nhóm ${MDR_BANDS[m]})`, lead: "WHO Annex 4 bảng A4.2; thuốc 1 lần/ngày, 7 ngày/tuần trừ khi ghi khác.", items: mdrDoseTable(m) });
  else blocks.push({ title: `Liều – ${n(i.wt)} kg`, items: [r("< 24 kg", "Dùng bảng liều trẻ em Annex 4 (dạng phân tán) – hỏi ý kiến chuyên gia lao trẻ em kháng thuốc.", undefined, undefined, A42)] });
  const rb = renalBlock(i, "mdr");
  if (rb) blocks.push(rb);
  const h = hivBlock(i, true);
  if (h) blocks.push(h);
  avoid.push(r("Kanamycin, capreomycin; acid clavulanic đơn độc", "Không dùng trong phác đồ dài hạn.", undefined, "C-VL", "Ch2 Rec 3.2, 3.14"));
  notes.push("BPaLM, BDLLfxC là liệu trình chuẩn hóa: không tự ý thay thuốc thành phần (trừ ngừng linezolid do độc tính).");
  if (!cns) notes.push("Phác đồ dài hạn: soi và cấy đờm hằng tháng.");
  return { headline: cns ? "Phác đồ dài hạn theo kháng sinh đồ, ưu tiên thuốc thấm thần kinh trung ương + corticoid" : (i.age === "a14" || adult) && !i.preg ? (i.fq === "r" ? "BPaL hoặc BDLC (6 tháng)" : i.fq === "s" ? "BPaLM hoặc BDLLfx (6 tháng)" : "BPaLM hoặc BDLLfxC (6 tháng)") : (i.fq === "r" ? "BDLC (6 tháng)" : i.fq === "s" ? "BDLLfx (6 tháng)" : "BDLLfxC (6 tháng)"), blocks, avoid, notes };
}

export function tbPlan(i: TbIn): TbOut {
  if (i.res === "hr") return hrTb(i);
  if (i.res === "mdr") return mdrTb(i);
  return i.site === "tbm" ? dsMeningitis(i) : dsPulmonary(i);
}
