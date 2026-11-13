/*
  Dot cap COPD – cong cu chon khang sinh theo GOLD 2026 (v1.3, 08/12/2025), Chuong 4.
  - GOLD chi neu NHOM thuoc, khong neu lieu. Lieu hien thi duoc LAY BANG CODE tu QĐ 2131/QĐ-BYT (copd-2131.ts,
    tab Viet Nam) – ghi ro nguon lieu, khong go lai so lieu.
  - GOLD 2026 khong gan muc bang chung cho cac cau ve khang sinh trong dot cap -> khong ghi nhan muc.
  ref: vi tri trong bao cao (chi de doi chieu, khong hien thi).
*/
import { COPD_DRUGS, COPD_REGIMENS } from "@/data/antibiotics/copd-2131";
import type { RxItem } from "./septic-arthritis-pids2023";

/* Moi phac do QĐ 2131 (cung id) -> 1 dong: ten thuoc | lieu, khoang cach, ghi chu. */
function bytRow(id: string, role: string, al?: "std"): RxItem {
  const r = COPD_REGIMENS.find((x) => x.id === id);
  if (!r) throw new Error(`copd-gold2026: thieu phac do ${id}`);
  const d = r.drugs[0];
  const extra = [/^\d/.test(r.duration) ? r.duration : "", d.note?.replace(/\.$/, ""), r.condition?.replace(/\.$/, "")].filter(Boolean).join("; ");
  return { role, text: COPD_DRUGS[d.drugId].name, dose: `${d.dose}, ${d.interval.charAt(0).toLowerCase() + d.interval.slice(1)}${extra ? ` – ${extra}` : ""}`, ref: `QĐ 2131 ${id}`, al };
}

export type Sym = "dyspnea" | "fever" | "volume" | "purulence";
export const SYMPTOMS: { id: Sym; label: string }[] = [
  { id: "dyspnea", label: "Tăng khó thở" },
  { id: "fever", label: "Sốt" },
  { id: "volume", label: "Tăng lượng đờm" },
  { id: "purulence", label: "Tăng đờm mủ" },
];

/* GOLD 2026 Ch.4 – Antibiotics: >= 2 trieu chung, trong do co tang dom mu; HOAC cay dom duong tinh dot truoc; HOAC can thong khi co hoc. */
export function goldIndication(sym: Record<Sym, boolean>, priorCulture: boolean, ventilated: boolean): { yes: boolean; reasons: string[] } {
  const n = Object.values(sym).filter(Boolean).length;
  const reasons: string[] = [];
  if (sym.purulence && n >= 2) reasons.push(`Tăng đờm mủ kèm ${n - 1} triệu chứng khác`);
  if (priorCulture) reasons.push("Cấy đờm dương tính trong đợt cấp trước");
  if (ventilated) reasons.push("Cần thông khí cơ học (xâm nhập hoặc không xâm nhập)");
  return { yes: reasons.length > 0, reasons };
}
export const NO_INDICATION_HINT = (sym: Record<Sym, boolean>) =>
  sym.purulence
    ? "Có đờm mủ nhưng chưa có triệu chứng thứ hai (tăng khó thở, sốt hoặc tăng lượng đờm)."
    : Object.values(sym).some(Boolean)
      ? "Không có tăng đờm mủ – tiêu chí triệu chứng của GOLD bắt buộc có đờm mủ."
      : "Chưa chọn triệu chứng nào.";

export type Severity = "mild" | "moderate" | "severe";
export const ROME: { id: Severity; label: string; criteria: string }[] = [
  { id: "mild", label: "Nhẹ", criteria: "Khó thở VAS < 5; nhịp thở < 24 lần/phút; nhịp tim < 95 lần/phút; SaO₂ lúc nghỉ ≥ 92% (khí trời hoặc oxy thường dùng) và giảm ≤ 3% (nếu biết); CRP < 10 mg/L (nếu có)." },
  { id: "moderate", label: "Trung bình", criteria: "Có ít nhất 3/5: khó thở VAS ≥ 5; nhịp thở ≥ 24 lần/phút; nhịp tim ≥ 95 lần/phút; SaO₂ lúc nghỉ < 92% và/hoặc giảm > 3%; CRP ≥ 10 mg/L. Khí máu (nếu làm) có thể PaO₂ 70–80 mmHg." },
  { id: "severe", label: "Nặng", criteria: "Như mức trung bình, kèm khí máu: PaO₂ ≤ 60 mmHg và/hoặc tăng CO₂ toan hô hấp (PaCO₂ > 45 mmHg, pH < 7,35)." },
];

export type Setting = "out" | "in";

export const GOLD_PRINCIPLE: RxItem = { role: "Nguyên tắc", text: "Chọn thuốc theo tình hình vi khuẩn kháng thuốc tại chỗ. Kinh nghiệm ban đầu thường là aminopenicilin + acid clavulanic, macrolid, tetracyclin; quinolon dành cho người bệnh chọn lọc.", ref: "Ch.4 Antibiotics" };
export function goldEmpiric(): RxItem[] {
  const AMC = "Aminopenicilin + acid clavulanic";
  return [
    bytRow("amox500", AMC, "std"),
    bytRow("amox875", AMC, "std"),
    bytRow("amox875severe", AMC, "std"),
    bytRow("azi5", "Macrolid"),
    bytRow("azi3", "Macrolid"),
    bytRow("clari", "Macrolid"),
    { role: "Tetracyclin", text: "Doxycyclin", ref: "Ch.4 Antibiotics" },
    bytRow("out-levo", "Quinolon – người bệnh chọn lọc"),
    bytRow("out-moxi", "Quinolon – người bệnh chọn lọc"),
  ];
}

export const CULTURE_TRIGGERS = ["Đợt cấp thường xuyên", "Tắc nghẽn luồng khí nặng", "Đợt cấp cần thông khí cơ học"] as const;
export const GOLD_CULTURE: RxItem = {
  role: "Cấy đờm hoặc bệnh phẩm phổi",
  text: "Có thể có trực khuẩn Gram âm (ví dụ Pseudomonas) hoặc vi khuẩn kháng các thuốc trên – chỉnh kháng sinh theo kết quả cấy. GOLD không nêu phác đồ kháng Pseudomonas; xem tab Việt Nam (QĐ 2131, nhóm có nguy cơ P. aeruginosa).",
  ref: "Ch.4 Antibiotics",
};

export const GOLD_ROUTE: RxItem[] = [
  { role: "Đường dùng", text: "Uống hoặc tĩnh mạch tùy tình trạng người bệnh và dược động học của thuốc.", ref: "Ch.4 Antibiotics" },
  { role: "Nội trú cần tĩnh mạch", text: "GOLD không nêu thuốc tĩnh mạch cụ thể – liều tĩnh mạch theo QĐ 2131 Bảng 3.4 (tab Việt Nam).", ref: "Ch.4 Antibiotics" },
];

export function goldDuration(setting: Setting): RxItem[] {
  return setting === "out"
    ? [{ role: "Ngoại trú", text: "≤ 5 ngày (≤ 5 ngày có hiệu quả lâm sàng và vi khuẩn học tương đương liệu trình dài hơn).", ref: "Ch.4 Antibiotics" }]
    : [{ role: "Nội trú", text: "5–7 ngày (thời gian khuyến cáo chung); ý chính của chương: tổng cộng 5 ngày.", ref: "Ch.4 Antibiotics; Key points" }];
}

export function goldCotherapy(sev: Severity): RxItem[] {
  const out: RxItem[] = [];
  if (sev !== "mild") {
    out.push({ role: "Giãn phế quản", text: "SABA, có hoặc không kèm kháng cholinergic tác dụng ngắn, là thuốc giãn phế quản khởi đầu.", ref: "Key points" });
    out.push({ role: "Corticoid toàn thân", text: "Tương đương prednison 40 mg/ngày × 5 ngày.", ref: "Ch.4 Glucocorticoids" });
  }
  out.push({ role: "Methylxanthin", text: "Không khuyến cáo (tác dụng không mong muốn nhiều).", ref: "Key points" });
  return out;
}

export const GOLD_BIOMARKER: RxItem[] = [
  { role: "CRP", text: "Nên định lượng nếu có; CRP tại chỗ (point-of-care) giúp giảm kê kháng sinh mà không tăng thất bại điều trị.", ref: "Ch.4 Antibiotics" },
  { role: "Procalcitonin", text: "Chưa khuyến cáo dùng phác đồ dựa trên procalcitonin để quyết định kháng sinh (kết quả mâu thuẫn; tại ICU liên quan tử vong cao hơn).", ref: "Ch.4 Antibiotics" },
  { role: "Đờm mủ tái diễn", text: "Đợt cấp nhiều lần có đờm mủ: tìm giãn phế quản.", ref: "Ch.4" },
];

export const GOLD_PREVENTION: RxItem[] = [
  { role: "Còn đợt cấp dù LABA+LAMA (bạch cầu ái toan < 100/µL) hoặc LABA+LAMA+ICS", text: "Người không còn hút thuốc: cân nhắc thêm azithromycin; tính đến nguy cơ chọn lọc vi khuẩn kháng thuốc.", ref: "Ch.3 Follow-up" },
  { role: "Liều đã nghiên cứu (1 năm)", text: "Azithromycin 250 mg/ngày hoặc 500 mg × 3 lần/tuần; hoặc erythromycin 250 mg × 2 lần/ngày.", dose: "Nguy cơ: vi khuẩn kháng thuốc, QTc kéo dài, giảm thính lực; lợi ích thấp hơn ở người còn hút thuốc; chưa có dữ liệu sau 1 năm", ref: "Ch.3 Antibiotics" },
  { role: "Không hiệu quả", text: "Moxifloxacin ngắt quãng (400 mg/ngày × 5 ngày, mỗi 8 tuần) không giảm tần suất đợt cấp; doxycyclin dài hạn không giảm đợt cấp.", ref: "Ch.3 Antibiotics" },
];
