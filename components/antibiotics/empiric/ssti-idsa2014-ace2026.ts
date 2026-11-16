/*
  Nhiễm khuẩn da – mô mềm – dữ liệu công cụ chọn kháng sinh.
  Nguồn (đọc từ PDF người dùng cung cấp, 16/11/2026):
  - IDSA 2014: Stevens DL và cs. Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue
    Infections: 2014 Update by the IDSA. Clin Infect Dis 2014;59(2):e10–e52 – khuyến cáo 1–44, Hình 1, Hình 2,
    Bảng 2 (tụ cầu, liên cầu), Bảng 3 (nhiễm khuẩn vết mổ), Bảng 4 (nhiễm khuẩn hoại tử), Bảng 5 (vết cắn).
    Mức GRADE giữ nguyên: mạnh/yếu; cao/trung bình/thấp -> "S-H", "S-M", "S-L", "W-M", "W-L".
  - Đính chính IDSA: Clin Infect Dis 2015;60(9):1448 (doi:10.1093/cid/civ114) – SIRS bạch cầu > 12 000 hoặc
    < 4000/µL; mupirocin bôi 3 lần/ngày; Aeromonas: ciprofloxacin 400 mg TM mỗi 12 giờ; Vibrio: ceftriaxon 1 g TM
    mỗi ngày. Trả lời của tác giả: Clin Infect Dis 2015;60(11):1732 (doi:10.1093/cid/civ127) – ciprofloxacin uống
    500–750 mg mỗi 12 giờ (Bảng 3).
  - ACE 2026: Agency for Care Effectiveness (Bộ Y tế Singapore). Bacterial skin and soft tissue infections –
    diagnosis and antibiotic prescribing. ACE Clinical Guideline, 21/09/2026 – Khuyến cáo 1–5, Hình 2, Hình 3;
    Supplement 2 (Bảng 1 thuốc bôi, Bảng 2 thuốc uống, Bảng 3 thuốc tĩnh mạch). ACE không xếp mức khuyến cáo.
  Quy ước hiển thị: không nêu số hình, số bảng; mỗi dòng là một phác đồ, ghi rõ "Đơn trị" hoặc "Phối hợp".
  Phác đồ phối hợp vancomycin + beta-lactam ở viêm mô tế bào nặng, viêm cơ mủ dùng liều của Bảng 4 (cùng phác
  đồ kinh nghiệm cho nhiễm khuẩn hỗn hợp). Penicilin trẻ em ở Clostridium: liều penicilin trẻ em cùng Bảng 4.
  - Đối chiếu liều với thông tin kê đơn được FDA phê duyệt (DailyMed, đọc 16/11/2026): linezolid (Zyvox), daptomycin
    (Cubicin RF), ceftarolin (Teflaro), piperacilin-tazobactam (Zosyn), ampicilin-sulbactam (Unasyn), ertapenem (Invanz),
    meropenem, imipenem-cilastatin (Primaxin), cefotaxim (Claforan), metronidazol, clindamycin (Cleocin Phosphate),
    vancomycin, gentamicin, doxycyclin. Sửa theo nhãn: linezolid trẻ ≤ 11 tuổi 10 mg/kg mỗi 8 giờ (nhiễm khuẩn da có
    biến chứng); piperacilin-tazobactam 3,375 g mỗi 6 giờ; ampicilin-sulbactam mỗi 6 giờ, sulbactam ≤ 4 g/ngày;
    cefotaxim trẻ em 50–180 mg/kg/ngày. Liều trẻ em bổ sung từ nhãn: ampicilin-sulbactam, imipenem-cilastatin,
    ertapenem (tối đa 1 g/ngày), gentamicin, doxycyclin. Vancomycin trẻ em trong phác đồ phối hợp: 15 mg/kg mỗi 6 giờ
    (IDSA Bảng 4, dòng S. aureus; phù hợp ASHP/IDSA 2020).
  ref = vị trí trong văn bản (không hiển thị).
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export type Form = "impetigo" | "purulent" | "cellulitis" | "ssi" | "nec" | "pyo" | "bite";
export type Age = "adult" | "child";
export type Sev = "mild" | "moderate" | "severe";
export type ImpSub = "impetigo" | "ecthyma" | "folliculitis";
export type Culture = "none" | "mrsa" | "mssa";
export type SsiSite = "clean" | "gi" | "axilla";
export type Pathogen = "empiric" | "strep" | "sa" | "clos" | "aero" | "vibrio";
export type BiteKind = "animal" | "human";
export type SstiBlock = { title: string; lead?: string; items: RxItem[] };
export type SstiIn = {
  form: Form; age: Age; sev: Sev; aceSevere: boolean; highRisk: boolean; pcnAllergy: boolean;
  impSub: ImpSub; mrsa: boolean; culture: Culture; recurrent: boolean; site: SsiSite; pathogen: Pathogen;
  bite: BiteKind; infected: boolean; immuno: boolean;
};
export type SstiOut = { headline: string; blocks: SstiBlock[]; avoid: RxItem[]; notes: string[] };

type D = { a?: string; c?: string };
const r = (role: string, text: string, dose: string | undefined, grade: string | undefined, ref: string, al?: "std" | "alt"): RxItem => ({ role, text, dose, grade, ref, al });
const pick = (d: D | undefined, age: Age) => (d ? (age === "child" ? d.c : d.a) : undefined);
const MONO = "Đơn trị";
const COMBO = "Phối hợp";
const ALG = "Dị ứng penicilin";

export const READ_HINT = "Mỗi dòng là một phác đồ, chọn một. “Đơn trị”: dùng một kháng sinh. “Phối hợp”: dùng đồng thời các kháng sinh nối bằng dấu “+”.";

export const FORM_OPTS: { id: Form; label: string }[] = [
  { id: "impetigo", label: "Chốc, chốc loét, viêm nang lông" },
  { id: "purulent", label: "Nhọt, cụm nhọt, áp xe da" },
  { id: "cellulitis", label: "Viêm mô tế bào, viêm quầng" },
  { id: "ssi", label: "Nhiễm khuẩn vết mổ" },
  { id: "nec", label: "Nhiễm khuẩn hoại tử" },
  { id: "pyo", label: "Viêm cơ mủ" },
  { id: "bite", label: "Vết cắn" },
];
export const FORM_TIP: Record<Form, string> = {
  impetigo: "Chốc: vảy tiết vàng mật ong, rỉ dịch. Chốc loét: nhiễm khuẩn sâu hơn chốc, gây loét da. Viêm nang lông: mụn mủ ở chân nang lông.",
  purulent: "Nhọt: nốt sưng đau có mủ ở nang lông. Cụm nhọt: nhiều nang lông viêm hợp lại thành khối đỏ, đau, có mụn mủ trên bề mặt. Áp xe da: vùng đỏ, đau, có dấu hiệu lùng nhùng.",
  cellulitis: "Viêm quầng: mảng đỏ phù nề, nóng, nổi gờ, bờ rõ. Viêm mô tế bào: da đỏ, nóng, sưng, chắc, bờ kém rõ hơn viêm quầng. Thường không có mủ.",
  ssi: "Nhiễm khuẩn vết mổ nông hoặc sâu (cân, cơ) trong 30 ngày sau mổ, hoặc trong 1 năm nếu có đặt vật liệu nhân tạo.",
  nec: "Viêm cân mạc hoại tử (kể cả hoại thư Fournier), hoại thư sinh hơi do Clostridium.",
  pyo: "Mủ trong cơ vân, chủ yếu do S. aureus; đau khu trú một nhóm cơ, ấn đau, sốt.",
  bite: "Vết cắn của chó, mèo hoặc người.",
};
export const AGE_OPTS: { id: Age; label: string }[] = [
  { id: "adult", label: "Người lớn" },
  { id: "child", label: "Trẻ em" },
];
export const IMP_OPTS: { id: ImpSub; label: string }[] = [
  { id: "impetigo", label: "Chốc" },
  { id: "ecthyma", label: "Chốc loét" },
  { id: "folliculitis", label: "Viêm nang lông" },
];
export const SEV2_OPTS: { id: Sev; label: string }[] = [
  { id: "mild", label: "Khu trú, nhẹ" },
  { id: "severe", label: "Nặng" },
];
export const SEV3_OPTS: { id: Sev; label: string }[] = [
  { id: "mild", label: "Nhẹ" },
  { id: "moderate", label: "Vừa" },
  { id: "severe", label: "Nặng" },
];
export const SEV_TIP: Record<"purulent" | "cellulitis", Record<Sev, string>> = {
  purulent: {
    mild: "Nhiễm khuẩn có mủ, chỉ định rạch dẫn lưu; không có dấu hiệu toàn thân.",
    moderate: "Nhiễm khuẩn có mủ kèm dấu hiệu nhiễm khuẩn toàn thân.",
    severe: "Thất bại rạch dẫn lưu kèm kháng sinh uống; hoặc có hội chứng đáp ứng viêm toàn thân (SIRS); hoặc suy giảm miễn dịch.",
  },
  cellulitis: {
    mild: "Viêm mô tế bào, viêm quầng điển hình, không có ổ mủ.",
    moderate: "Viêm mô tế bào, viêm quầng điển hình kèm dấu hiệu nhiễm khuẩn toàn thân.",
    severe: "Thất bại kháng sinh uống; hoặc có SIRS; hoặc suy giảm miễn dịch; hoặc dấu hiệu nhiễm khuẩn sâu: bọng nước, bong da, tụt huyết áp, rối loạn chức năng cơ quan.",
  },
};
export const ACE_SEVERE: Record<"impetigo" | "purulent" | "cellulitis", string> = {
  impetigo: "không đáp ứng điều trị đầu tay; lan rộng (nhiều tổn thương); chốc bọng nước; viêm mô tế bào xung quanh; tổn thương sâu hoặc rộng; tiến triển nhanh",
  purulent: "không đáp ứng điều trị đầu tay hoặc can thiệp ngoại khoa đơn thuần; viêm mô tế bào xung quanh; lan rộng (nhiều tổn thương hoặc nhiều ổ áp xe); tổn thương sâu hoặc rộng; tiến triển nhanh",
  cellulitis: "không đáp ứng điều trị đầu tay; lan rộng; tiến triển nhanh",
};
export const CULTURE_OPTS: { id: Culture; label: string }[] = [
  { id: "none", label: "Chưa có (kinh nghiệm)" },
  { id: "mrsa", label: "MRSA" },
  { id: "mssa", label: "MSSA" },
];
export const SITE_OPTS: { id: SsiSite; label: string }[] = [
  { id: "clean", label: "Thân, đầu – cổ, chi (xa nách, tầng sinh môn)" },
  { id: "gi", label: "Ống tiêu hóa, đường sinh dục – tiết niệu" },
  { id: "axilla", label: "Nách, tầng sinh môn" },
];
export const PATHOGEN_OPTS: { id: Pathogen; label: string }[] = [
  { id: "empiric", label: "Chưa rõ – kinh nghiệm" },
  { id: "strep", label: "Liên cầu nhóm A" },
  { id: "sa", label: "S. aureus" },
  { id: "clos", label: "Clostridium" },
  { id: "aero", label: "Aeromonas hydrophila" },
  { id: "vibrio", label: "Vibrio vulnificus" },
];
export const BITE_OPTS: { id: BiteKind; label: string }[] = [
  { id: "animal", label: "Chó, mèo" },
  { id: "human", label: "Người" },
];

export const RED_FLAGS = "Chuyển cấp cứu ngay khi: gợi ý nhiễm khuẩn hoại tử (đau không tương xứng với thăm khám, da sẫm màu, bọng nước); gợi ý nhiễm khuẩn huyết (mạch nhanh, tụt huyết áp); nhiễm trùng bàn chân đái tháo đường mức vừa hoặc nặng; suy giảm miễn dịch nặng (ACE).";
export const REFERRAL: string[] = [
  "Nghi tác nhân không điển hình: tiếp xúc nước biển (Vibrio), nước ngọt (Aeromonas), đất (Burkholderia pseudomallei).",
  "Viêm mô tế bào ở bàn tay hoặc trên khớp, nhất là khi nghi nhiễm khuẩn sâu (viêm xương tủy, viêm khớp nhiễm khuẩn).",
  "Nhiễm khuẩn vùng mặt: viêm mô tế bào hốc mắt, vùng “tam giác nguy hiểm” (giới hạn bởi hai khóe miệng và sống mũi).",
  "Áp xe quanh hậu môn; nhiễm khuẩn mảnh ghép, vật liệu nhân tạo hoặc vết mổ.",
  "Viêm bạch mạch, nhất là khi kèm triệu chứng hoặc dấu hiệu nhiễm khuẩn nặng khác.",
  "Suy giảm miễn dịch hoặc đang dùng thuốc ức chế miễn dịch.",
  "Trẻ < 12 tháng: ngưỡng chuyển tuyến thấp; sơ sinh < 1 tháng: bác sĩ nhi khoa hoặc chuyên khoa tuyến cuối đánh giá.",
  "MRSA: nhiễm khuẩn không biến chứng có thể điều trị ở tuyến ban đầu, chọn kháng sinh theo kết quả cấy và kháng sinh đồ; chuyển tuyến khi có biến chứng, dấu hiệu toàn thân, bệnh nền đáng kể hoặc không đáp ứng sau một đợt điều trị đủ.",
];
export const SYSTEMIC = "Dấu hiệu toàn thân (ACE): hội chứng đáp ứng viêm toàn thân, ví dụ nhiệt độ > 38 °C hoặc < 36 °C, thở nhanh > 20 lần/phút, mạch nhanh > 100 lần/phút, tụt huyết áp hoặc viêm bạch mạch.";
export const SIRS_IDSA = "SIRS (IDSA, đính chính 2015): nhiệt độ > 38 °C hoặc < 36 °C, thở nhanh > 24 lần/phút, mạch nhanh > 90 lần/phút, hoặc bạch cầu > 12 000/µL hoặc < 4000/µL.";

/* ===================== ACE 2026 – Supplement 2 ===================== */
const S1 = "ACE Suppl. 2, Bảng 1";
const S2 = "ACE Suppl. 2, Bảng 2";
const S3 = "ACE Suppl. 2, Bảng 3";

function aceTopical(age: Age): RxItem[] {
  return [
    r("Bôi – ưu tiên", "Acid fusidic (kem hoặc thuốc mỡ)", "Bôi lên vùng tổn thương 2–3 lần/ngày", undefined, S1),
    r("Bôi – ưu tiên", "Mupirocin (thuốc mỡ); cân nhắc dành cho nhiễm MRSA", age === "child" ? "Bôi lên vùng tổn thương 2–3 lần/ngày. Chưa được nghiên cứu ở trẻ < 1 tuổi" : "Bôi lên vùng tổn thương 2–3 lần/ngày", undefined, S1),
    r("Bôi – thay thế", "Gentamicin (kem); dùng khi lựa chọn ưu tiên không phù hợp hoặc không có", "Bôi lên vùng tổn thương 1 lần hoặc nhiều lần/ngày", undefined, S1),
  ];
}
const ACE_ORAL: { role: string; drug: string; d: D; al?: "std" | "alt" }[] = [
  { role: `${MONO} – đầu tay`, drug: "Cefalexin (phổ hẹp, ưu tiên)", al: "std", d: { a: "500 mg uống 4 lần/ngày (viên nang hoặc hỗn dịch)", c: "25–50 mg/kg/ngày uống, chia 3–4 lần; nhiễm khuẩn nặng có thể tăng 50–100 mg/kg/ngày (tối đa 500 mg/lần, 4 g/ngày)" } },
  { role: `${MONO} – đầu tay`, drug: "Cloxacilin (phổ hẹp, ưu tiên)", al: "std", d: { a: "250–500 mg uống 4 lần/ngày (viên nang hoặc hỗn dịch)", c: "Đến 20 kg: 50–100 mg/kg/ngày uống, chia 4 lần; từ 20 kg: liều người lớn. Tối đa 500 mg/lần" } },
  { role: `${MONO} – thay thế`, drug: "Amoxicilin-acid clavulanic", al: "std", d: { a: "Viên 500 mg/125 mg uống 2–3 lần/ngày, hoặc viên 875 mg/125 mg uống 2 lần/ngày", c: "Hỗn dịch 400 mg/57 mg (trẻ ≥ 2 tháng tuổi): 25 mg/3,6 mg/kg/ngày (nhiễm khuẩn nặng: 45 mg/6,4 mg/kg/ngày) uống, chia 2–3 lần; tối đa 500 mg amoxicilin/lần khi dùng mỗi 8 giờ, 875 mg amoxicilin/lần khi dùng mỗi 12 giờ. Hỗn dịch 250 mg/62,5 mg: < 40 kg – 20 mg/5 mg đến 45 mg/11,25 mg/kg/ngày uống, chia 3 lần (tối đa 500 mg amoxicilin/lần); ≥ 40 kg – 500 mg/125 mg uống 3 lần/ngày" } },
  { role: `${ALG} – đơn trị`, drug: "Clindamycin", al: "alt", d: { a: "450–600 mg uống 3 lần/ngày (viên nang)", c: "Trẻ > 1 tháng tuổi: 20–25 mg/kg/ngày uống, chia đều 3–4 lần (tối đa 450 mg/lần)" } },
];
const aceOral = (age: Age): RxItem[] => ACE_ORAL.map((x) => r(x.role, x.drug, pick(x.d, age), undefined, S2, x.al));
function aceOralNotes(age: Age, abscess: boolean): string[] {
  const n: string[] = [];
  if (abscess) n.push("ACE: cefalexin có thể không hiệu quả trong điều trị áp xe da.");
  if (age === "adult") {
    n.push("ACE: cefalexin 500 mg 4 lần/ngày là liều theo UpToDate; tờ hướng dẫn sử dụng tại Singapore ghi liều thường dùng 250 mg 4 lần/ngày hoặc 500 mg 2 lần/ngày, cần liều cao hơn khi nhiễm khuẩn nặng.");
    n.push("ACE: clindamycin uống – tờ hướng dẫn sử dụng tại Singapore ghi 600–1800 mg/ngày; mức 450–600 mg 3 lần/ngày nằm trong khoảng này.");
    n.push("ACE: người lớn khó nuốt – ưu tiên nghiền viên amoxicilin-acid clavulanic; nếu dùng hỗn dịch, bảo đảm liều amoxicilin và acid clavulanic tương đương dạng viên.");
  } else {
    n.push("ACE: cloxacilin trẻ em theo UpToDate – 5 đến < 40 kg: 50 mg/kg/ngày uống, chia mỗi 6 giờ; ≥ 40 kg: 250–500 mg uống mỗi 6 giờ.");
    n.push("ACE: thực hành hiện nay thường dùng clindamycin uống 30–40 mg/kg/ngày cho trẻ em.");
  }
  return n;
}
const ACE_IV: { role: string; drug: string; d: D; al?: "std" | "alt" }[] = [
  { role: `${MONO} – đầu tay`, drug: "Cefazolin (phổ hẹp hơn, ưu tiên)", al: "std", d: { a: "3–6 g/ngày tĩnh mạch, chia 3 lần, tùy mức độ nặng", c: "Trẻ > 1 tháng tuổi: 50–100 mg/kg/ngày tĩnh mạch, chia 3–4 lần; nhiễm khuẩn nặng có thể đến 150 mg/kg/ngày (tối đa 2000 mg/lần)" } },
  { role: `${MONO} – đầu tay`, drug: "Ceftriaxon", al: "std", d: { a: "1–2 g tĩnh mạch 1 lần/ngày", c: "15 ngày – 12 tuổi: 50–80 mg/kg tĩnh mạch 1 lần/ngày (tối đa 2000 mg/ngày); ≥ 50 kg hoặc > 12 tuổi: liều người lớn" } },
  { role: `${MONO} – đầu tay`, drug: "Amoxicilin-acid clavulanic", al: "std", d: { a: "1000 mg/200 mg tĩnh mạch mỗi 8 giờ hoặc mỗi 6 giờ", c: "Dạng 1000 mg/200 mg, 3 tháng – 12 tuổi: 75 mg/15 mg đến 100 mg/20 mg/kg/ngày tĩnh mạch, chia 3–4 lần; > 12 tuổi: liều người lớn" } },
  { role: `${ALG} – đơn trị`, drug: "Clindamycin", al: "alt", d: { a: "600 mg tĩnh mạch mỗi 8 giờ đến mỗi 6 giờ (1800–2400 mg/ngày)", c: "Trẻ > 1 tháng tuổi: 20–40 mg/kg/ngày tĩnh mạch, chia đều 3–4 lần (tối đa 600 mg/lần)" } },
];
const aceIv = (age: Age): RxItem[] => ACE_IV.map((x) => r(x.role, x.drug, pick(x.d, age), undefined, S3, x.al));
const aceIvNotes = (age: Age): string[] => (age === "child" ? [] : [
  "ACE: cefazolin – tờ hướng dẫn sử dụng tại Singapore ghi 500 mg–1 g 3–4 lần/ngày cho nhiễm khuẩn vừa – nặng và nặng, 1–1,5 g 4 lần/ngày cho nhiễm khuẩn nặng đe dọa tính mạng; Sanford Guide và UpToDate ghi 1–2 g mỗi 8 giờ.",
  "ACE: amoxicilin-acid clavulanic tĩnh mạch mỗi 6 giờ có thể cần ở người bệnh mà cân nặng ảnh hưởng dược lực học của kháng sinh (ví dụ béo phì).",
]);

/* ===================== IDSA 2014 – liều tụ cầu (Bảng 2) ===================== */
const T2 = "IDSA Bảng 2";
const MRSA: Record<string, D> = {
  vanco: { a: "30 mg/kg/ngày tĩnh mạch, chia 2 lần", c: "40 mg/kg/ngày tĩnh mạch, chia 4 lần" },
  linezolid: { a: "600 mg tĩnh mạch mỗi 12 giờ hoặc 600 mg uống 2 lần/ngày", c: "Trẻ ≤ 11 tuổi: 10 mg/kg tĩnh mạch hoặc uống mỗi 8 giờ; ≥ 12 tuổi: liều người lớn" },
  clinda: { a: "600 mg tĩnh mạch mỗi 8 giờ, hoặc 300–450 mg uống 4 lần/ngày", c: "25–40 mg/kg/ngày tĩnh mạch, chia 3 lần; hoặc 30–40 mg/kg/ngày uống, chia 3 lần" },
  dapto: { a: "4 mg/kg tĩnh mạch mỗi 24 giờ" },
  ceftaroline: { a: "600 mg tĩnh mạch 2 lần/ngày" },
  doxy: { a: "100 mg uống 2 lần/ngày", c: "Trẻ > 8 tuổi, < 45 kg: 4,4 mg/kg/ngày uống chia 2 lần ngày đầu, sau đó 2,2 mg/kg/ngày (1 lần hoặc chia 2 lần); ≥ 45 kg: liều người lớn. Không dùng cho trẻ ≤ 8 tuổi" },
  smx: { a: "1–2 viên hàm lượng gấp đôi (160 mg/800 mg) uống 2 lần/ngày", c: "8–12 mg/kg/ngày (tính theo trimethoprim) tĩnh mạch chia 4 lần, hoặc uống chia 2 lần" },
};
const MSSA: Record<string, D> = {
  nafcillin: { a: "1–2 g tĩnh mạch mỗi 4 giờ", c: "100–150 mg/kg/ngày, chia 4 lần" },
  cefazolin: { a: "1 g tĩnh mạch mỗi 8 giờ", c: "50 mg/kg/ngày, chia 3 lần" },
  clinda: { a: "600 mg tĩnh mạch mỗi 8 giờ, hoặc 300–450 mg uống 4 lần/ngày", c: "25–40 mg/kg/ngày tĩnh mạch, chia 3 lần; hoặc 25–30 mg/kg/ngày uống, chia 3 lần" },
  dicloxacillin: { a: "500 mg uống 4 lần/ngày", c: "25–50 mg/kg/ngày uống, chia 4 lần" },
  cefalexin: { a: "500 mg uống 4 lần/ngày", c: "25–50 mg/kg/ngày uống, chia 4 lần" },
};
const mrsaRow = (role: string, drug: string, k: keyof typeof MRSA, age: Age, al?: "std" | "alt") => r(role, drug, pick(MRSA[k], age), undefined, `${T2} – MRSA`, al);
const mssaRow = (role: string, drug: string, k: keyof typeof MSSA, age: Age, al?: "std" | "alt") => r(role, drug, pick(MSSA[k], age), undefined, `${T2} – MSSA`, al);
function mrsaSet(age: Age, label: string): RxItem[] {
  const out = [mrsaRow(`${label} – đơn trị`, "Vancomycin", "vanco", age), mrsaRow(`${label} – đơn trị`, "Linezolid", "linezolid", age)];
  if (age === "adult") out.push(mrsaRow(`${label} – đơn trị`, "Daptomycin", "dapto", age), mrsaRow(`${label} – đơn trị`, "Ceftarolin", "ceftaroline", age));
  return out;
}
/* Bảng 4 – nhiễm khuẩn hỗn hợp (dùng cho phác đồ phối hợp vancomycin + beta-lactam) */
const T4 = "IDSA Bảng 4";
const VANCO_T4: D = { a: "vancomycin 30 mg/kg/ngày tĩnh mạch, chia 2 lần", c: "vancomycin 15 mg/kg/lần tĩnh mạch mỗi 6 giờ" };
const PIP_T4: D = { a: "piperacilin-tazobactam 3,375 g tĩnh mạch mỗi 6 giờ hoặc 4,5 g tĩnh mạch mỗi 8 giờ", c: "piperacilin-tazobactam 60–75 mg/kg/lần (tính theo piperacilin) tĩnh mạch mỗi 6 giờ" };
const MERO_T4: D = { a: "meropenem 1 g tĩnh mạch mỗi 8 giờ", c: "meropenem 20 mg/kg/lần tĩnh mạch mỗi 8 giờ (≥ 50 kg: 1 g)" };
const IMI_T4: D = { a: "imipenem-cilastatin 1 g tĩnh mạch mỗi 6–8 giờ (tối đa 4 g/ngày)", c: "imipenem-cilastatin 15–25 mg/kg/lần tĩnh mạch mỗi 6 giờ (trẻ ≥ 3 tháng; tối đa 4 g/ngày)" };
const ERTA_T4: D = { a: "ertapenem 1 g tĩnh mạch 1 lần/ngày", c: "ertapenem 15 mg/kg/lần tĩnh mạch mỗi 12 giờ (3 tháng – 12 tuổi; tối đa 1 g/ngày)" };
const CTX_C = "cefotaxim 50–180 mg/kg/ngày tĩnh mạch, chia 4–6 lần (29 ngày – 12 tuổi, < 50 kg; ≥ 50 kg: liều người lớn)";
const CRO_C = "ceftriaxon 50–80 mg/kg tĩnh mạch 1 lần/ngày (tối đa 2000 mg/ngày; ≥ 50 kg hoặc > 12 tuổi: liều người lớn)";
const SAM_A = "ampicilin-sulbactam 1,5–3 g tĩnh mạch mỗi 6 giờ (tổng sulbactam ≤ 4 g/ngày)";
const SAM_C = "ampicilin-sulbactam 300 mg/kg/ngày (ampicilin 200 mg/kg + sulbactam 100 mg/kg) tĩnh mạch, chia mỗi 6 giờ (trẻ ≥ 1 tuổi; ≥ 40 kg: liều người lớn)";
const GENTA_C = "gentamicin 2–2,5 mg/kg tĩnh mạch mỗi 8 giờ (6–7,5 mg/kg/ngày)";
const LZD_C = "linezolid 10 mg/kg tĩnh mạch mỗi 8 giờ (trẻ ≤ 11 tuổi)";
const cap = (t: string) => t[0].toUpperCase() + t.slice(1);
/* Dòng thuốc có liều theo đối tượng: không có liều cho đối tượng đang chọn thì không hiển thị dòng. */
function dr(age: Age, role: string, text: string, d: D, ref: string, al?: "std" | "alt"): RxItem[] {
  const x = pick(d, age);
  return x ? [r(role, text, x, undefined, ref, al)] : [];
}
function vancoCombo(age: Age, partner: D, label: string, ref: string, al?: "std" | "alt"): RxItem | null {
  const v = pick(VANCO_T4, age), p = pick(partner, age);
  if (!v || !p) return null;
  return r(COMBO, label, `${v[0].toUpperCase()}${v.slice(1)} + ${p}`, undefined, ref, al);
}
const VANCO_TDM = "Theo dõi nồng độ vancomycin theo hướng dẫn đồng thuận ASHP/IDSA/PIDS/SIDP 2020 (mục TDM của ứng dụng).";

/* ===================== Chốc, chốc loét, viêm nang lông ===================== */
function impetigo(i: SstiIn, aceSev: boolean): SstiOut {
  const blocks: SstiBlock[] = [];
  const notes: string[] = [];
  const a = i.age === "adult";
  const oral = aceSev || i.impSub === "ecthyma";
  if (!oral) {
    blocks.push({
      title: "Theo ACE 2026: kháng sinh bôi, đơn trị",
      lead: "Nhiễm khuẩn khu trú, nhẹ: một kháng sinh bôi, thường 5–7 ngày. Không đáp ứng: chuyển một kháng sinh uống; vẫn không cải thiện: chuyển làm thêm xét nghiệm.",
      items: aceTopical(i.age),
    });
    notes.push("ACE: dùng kháng sinh bôi thường xuyên, kéo dài làm xuất hiện vi khuẩn kháng thuốc.");
  } else {
    blocks.push({
      title: "Theo ACE 2026: kháng sinh uống, đơn trị",
      lead: i.impSub === "ecthyma" ? "Chốc loét (nhiễm khuẩn sâu, có thể tới trung bì): kháng sinh toàn thân, một thuốc; thường 5–7 ngày." : "Nhiễm khuẩn nặng: một kháng sinh uống; thường 5–7 ngày, kéo dài theo đánh giá lâm sàng.",
      items: aceOral(i.age),
    });
    notes.push(...aceOralNotes(i.age, false));
    notes.push("ACE: có bọng nước – thuốc bôi có thể không đạt tới vùng tổn thương.");
  }
  if (i.impSub !== "folliculitis") {
    const recs: RxItem[] = [
      r("Xét nghiệm", "Nhuộm Gram, cấy mủ hoặc dịch tiết tổn thương để xác định S. aureus và/hoặc liên cầu tan huyết beta", undefined, "S-M", "IDSA KC 1"),
      r("Ca điển hình", "Điều trị không cần các xét nghiệm trên là hợp lý", undefined, "S-M", "IDSA KC 1"),
      r("Đường dùng", "Dùng kháng sinh uống khi nhiều tổn thương hoặc khi dịch ảnh hưởng nhiều người (giảm lây truyền); chốc loét: kháng sinh uống", undefined, undefined, "IDSA KC 2"),
    ];
    if (i.impSub === "impetigo") recs.push(r("Kháng sinh bôi", "Mupirocin hoặc retapamulin, đơn trị, trong 5 ngày (chốc bọng nước và không bọng nước)", undefined, "S-H", "IDSA KC 2a"));
    recs.push(
      r("Kháng sinh uống", "Đơn trị trong 7 ngày, thuốc có tác dụng trên S. aureus; cấy chỉ ra liên cầu đơn thuần thì dùng penicilin uống", undefined, "S-H", "IDSA KC 2b"),
      r("Kháng sinh uống", "S. aureus thường nhạy methicilin: dicloxacilin hoặc cefalexin. Nghi ngờ hoặc xác định MRSA: doxycyclin, clindamycin hoặc sulfamethoxazol-trimethoprim", undefined, "S-M", "IDSA KC 2b"),
      r("Dịch viêm cầu thận", "Dùng kháng sinh toàn thân trong đợt bùng phát viêm cầu thận sau nhiễm liên cầu, để loại trừ chủng S. pyogenes gây viêm thận khỏi cộng đồng", undefined, "S-M", "IDSA KC 2c"),
    );
    blocks.push({ title: "Theo IDSA 2014: khuyến cáo", items: recs });

    const rx: RxItem[] = [];
    if (i.impSub === "impetigo") {
      rx.push(r("Bôi – đơn trị", "Retapamulin (thuốc mỡ); khi ít tổn thương", "Bôi lên tổn thương 2 lần/ngày", undefined, T2));
      rx.push(r("Bôi – đơn trị", "Mupirocin (thuốc mỡ); khi ít tổn thương", "Bôi lên tổn thương 3 lần/ngày", undefined, `${T2}; đính chính 2015`));
    }
    if (a) rx.push(r("Uống – đơn trị", "Dicloxacilin", "250 mg uống 4 lần/ngày", undefined, T2, "std"));
    rx.push(
      r("Uống – đơn trị", "Cefalexin", a ? "250 mg uống 4 lần/ngày" : "25–50 mg/kg/ngày uống, chia 3–4 lần", undefined, T2, "std"),
      r("Uống – đơn trị", "Erythromycin; một số chủng S. aureus, S. pyogenes có thể kháng", a ? "250 mg uống 4 lần/ngày (erythromycin ethylsuccinat: 400 mg uống 4 lần/ngày)" : "40 mg/kg/ngày uống, chia 3–4 lần", undefined, T2),
      r("Uống – đơn trị", "Clindamycin", a ? "300–400 mg uống 4 lần/ngày" : "20 mg/kg/ngày uống, chia 3 lần", undefined, T2),
      r("Uống – đơn trị", "Amoxicilin-acid clavulanic", a ? "875 mg/125 mg uống 2 lần/ngày" : "25 mg/kg/ngày (tính theo amoxicilin) uống, chia 2 lần", undefined, T2, "std"),
    );
    if (a) rx.push(r("Liên cầu đơn thuần – đơn trị", "Penicilin V", "250–500 mg uống mỗi 6 giờ", undefined, `${T2} – liên cầu`, "std"));
    if (i.mrsa || i.pcnAllergy) {
      const role = i.mrsa ? "MRSA – đơn trị" : `${ALG} – đơn trị`;
      rx.push(mrsaRow(role, "Doxycyclin", "doxy", i.age, i.mrsa ? undefined : "alt"), mrsaRow(role, "Sulfamethoxazol-trimethoprim", "smx", i.age, i.mrsa ? undefined : "alt"));
    }
    blocks.push({ title: "Theo IDSA 2014: phác đồ và liều", lead: "Thời gian điều trị 7 ngày, tùy đáp ứng lâm sàng.", items: rx });
    if (i.impSub === "impetigo") notes.push("IDSA (đính chính 2015): mupirocin bôi 3 lần/ngày.");
    if (i.pcnAllergy) notes.push("IDSA: dị ứng penicilin – doxycyclin, clindamycin hoặc sulfamethoxazol-trimethoprim; liên cầu đơn thuần ở người dị ứng penicilin – macrolid hoặc clindamycin.");
  }
  return { headline: oral ? "Một kháng sinh uống, phủ S. aureus và liên cầu" : "Một kháng sinh bôi, 5–7 ngày", blocks, avoid: [], notes };
}

/* ===================== Nhọt, cụm nhọt, áp xe da ===================== */
function purulent(i: SstiIn, aceSev: boolean): SstiOut {
  const blocks: SstiBlock[] = [];
  const notes: string[] = [];
  const surg: RxItem[] = [
    r("Can thiệp ngoại khoa", "Đánh giá từng ca. Nhẹ: kiểm soát ổ nhiễm ít xâm lấn (lấy dị vật, rửa bằng dung dịch sát khuẩn). Tổn thương lớn: rạch dẫn lưu hoặc can thiệp ngoại khoa khác", undefined, undefined, "ACE KC 4"),
    r("Mức can thiệp", "Áp xe da không biến chứng: rạch dẫn lưu thường là đủ; nhiễm khuẩn nặng: có thể cần cắt lọc ngoại khoa", undefined, undefined, "ACE KC 4"),
  ];
  if (!aceSev) {
    surg.push(
      r("Kháng sinh", "Không dùng kháng sinh; điều trị hỗ trợ (chườm ấm)", undefined, undefined, "ACE KC 4"),
      r("Hẹn tái khám", "Quay lại nếu không khỏi hoặc có dấu hiệu nặng lên; không cấp sẵn kháng sinh để dự phòng", undefined, undefined, "ACE tr. 6"),
      r("Ngoại lệ", "Không can thiệp ngoại khoa được (nhọt mạn tính, nhiều áp xe ở người suy giảm miễn dịch, áp xe giai đoạn sớm, trẻ em): kháng sinh có thể có lợi kể cả khi nhẹ", undefined, undefined, "ACE KC 4"),
    );
    blocks.push({ title: "Theo ACE 2026: can thiệp ngoại khoa, không dùng kháng sinh", items: surg });
  } else {
    blocks.push({ title: "Theo ACE 2026: can thiệp ngoại khoa", items: surg });
    if (i.culture === "mrsa") {
      notes.push("ACE: MRSA không biến chứng có thể điều trị ở tuyến ban đầu, chọn kháng sinh theo kết quả cấy và kháng sinh đồ; chuyển tuyến khi có biến chứng, dấu hiệu toàn thân, bệnh nền đáng kể hoặc không đáp ứng.");
    } else {
      blocks.push({ title: "Theo ACE 2026: kháng sinh uống, đơn trị", lead: "Dành cho nhiễm khuẩn nặng: một kháng sinh uống, thường 7–10 ngày, kéo dài theo đánh giá lâm sàng. Không cải thiện với kháng sinh uống: có thể cần kháng sinh tĩnh mạch.", items: aceOral(i.age) });
      notes.push(...aceOralNotes(i.age, true));
    }
  }
  blocks.push({
    title: "Theo IDSA 2014: khuyến cáo",
    items: [
      r("Xét nghiệm", "Nhuộm Gram, cấy mủ cụm nhọt và áp xe; điều trị không cần xét nghiệm là hợp lý ở ca điển hình", undefined, "S-M", "IDSA KC 3"),
      r("Nang thượng bì viêm", "Không nhuộm Gram, không cấy mủ", undefined, "S-M", "IDSA KC 4"),
      r("Rạch dẫn lưu", "Điều trị khuyến cáo cho nang thượng bì viêm, cụm nhọt, áp xe và nhọt lớn", undefined, "S-H", "IDSA KC 5"),
      r("Kháng sinh kèm dẫn lưu", "Quyết định dùng kháng sinh nhắm S. aureus dựa trên có hay không có SIRS", undefined, "S-L", "IDSA KC 6"),
      r("Kháng sinh phủ MRSA", "Cụm nhọt hoặc áp xe ở người suy giảm sức đề kháng rõ, hoặc có SIRS", undefined, "S-L", "IDSA KC 6, tr. e22"),
    ],
  });
  const rx: RxItem[] = [];
  if (i.sev === "mild") {
    rx.push(r("Nhẹ", "Rạch dẫn lưu; không dùng kháng sinh", undefined, undefined, "IDSA Hình 1"));
  } else if (i.sev === "moderate") {
    rx.push(r("Vừa", "Rạch dẫn lưu; cấy mủ và làm kháng sinh đồ", undefined, undefined, "IDSA Hình 1"));
    if (i.culture === "none") rx.push(mrsaRow(`Kinh nghiệm – ${MONO.toLowerCase()}`, "Sulfamethoxazol-trimethoprim", "smx", i.age), mrsaRow(`Kinh nghiệm – ${MONO.toLowerCase()}`, "Doxycyclin", "doxy", i.age));
    else if (i.culture === "mrsa") rx.push(mrsaRow("MRSA – đơn trị", "Sulfamethoxazol-trimethoprim", "smx", i.age));
    else {
      rx.push(mssaRow("MSSA – đơn trị", "Dicloxacilin", "dicloxacillin", i.age, "std"), mssaRow("MSSA – đơn trị", "Cefalexin", "cefalexin", i.age));
      if (i.pcnAllergy) notes.push("IDSA: cefalexin, cefazolin dùng được cho người dị ứng penicilin, trừ người có phản ứng quá mẫn tức thì.");
    }
  } else {
    rx.push(r("Nặng", "Rạch dẫn lưu; cấy mủ và làm kháng sinh đồ", undefined, undefined, "IDSA Hình 1"));
    if (i.culture === "mssa") {
      rx.push(mssaRow("MSSA – đơn trị", "Nafcilin hoặc oxacilin", "nafcillin", i.age, "std"), mssaRow("MSSA – đơn trị", "Cefazolin", "cefazolin", i.age), mssaRow("MSSA – đơn trị", "Clindamycin", "clinda", i.age));
      if (i.pcnAllergy) notes.push("IDSA: cefazolin dùng được cho người dị ứng penicilin, trừ người có phản ứng quá mẫn tức thì.");
    } else {
      rx.push(...mrsaSet(i.age, i.culture === "mrsa" ? "MRSA" : "Kinh nghiệm"));
      notes.push(VANCO_TDM);
    }
    if (i.age === "child") notes.push("IDSA: daptomycin, telavancin chưa được cấp phép cho trẻ em – dùng vancomycin; có thể dùng clindamycin khi tỷ lệ kháng clindamycin tại cơ sở < 10–15%.");
  }
  blocks.push({ title: "Theo IDSA 2014: phác đồ theo mức độ", items: rx });
  if (i.recurrent) {
    blocks.push({
      title: "Áp xe tái phát (IDSA 2014)",
      items: [
        r("Tìm nguyên nhân", "Áp xe tái phát tại vị trí cũ: tìm nguyên nhân tại chỗ (nang lông, viêm tuyến mồ hôi mủ, dị vật)", undefined, "S-M", "IDSA KC 7"),
        r("Dẫn lưu, cấy", "Dẫn lưu và cấy mủ sớm trong đợt nhiễm khuẩn", undefined, "S-M", "IDSA KC 8"),
        r("Kháng sinh", "Sau khi lấy mẫu cấy: 5–10 ngày kháng sinh có tác dụng trên tác nhân phân lập được", undefined, "W-L", "IDSA KC 9"),
        r("Khử khuẩn", "Nhiễm S. aureus tái phát: cân nhắc 5 ngày mupirocin bôi mũi 2 lần/ngày, tắm chlorhexidin hằng ngày, khử khuẩn hằng ngày đồ dùng cá nhân (khăn, ga trải giường, quần áo)", undefined, "W-L", "IDSA KC 10"),
        r("Người lớn", "Đánh giá rối loạn bạch cầu trung tính nếu áp xe tái phát bắt đầu từ nhỏ", undefined, "S-M", "IDSA KC 11"),
      ],
    });
  }
  const avoid = [r("Không khuyến cáo", "Kháng sinh bôi để điều trị nhọt, cụm nhọt, áp xe da", undefined, undefined, "ACE KC 4")];
  const headline = !aceSev ? "Rạch dẫn lưu hoặc kiểm soát ổ nhiễm; không dùng kháng sinh" : "Rạch dẫn lưu, cấy mủ; một kháng sinh theo mức độ";
  return { headline, blocks, avoid, notes };
}

/* ===================== Viêm mô tế bào, viêm quầng ===================== */
function cellulitis(i: SstiIn, aceSev: boolean): SstiOut {
  const blocks: SstiBlock[] = [];
  const notes: string[] = [];
  const a = i.age === "adult";
  if (!aceSev) {
    blocks.push({ title: "Theo ACE 2026: kháng sinh uống, đơn trị", lead: "Nhiễm khuẩn nhẹ: một kháng sinh uống, thường 5–7 ngày, kéo dài theo đánh giá lâm sàng. Không cải thiện với kháng sinh uống: có thể cần kháng sinh tĩnh mạch.", items: aceOral(i.age) });
    notes.push(...aceOralNotes(i.age, false));
  } else {
    blocks.push({ title: "Theo ACE 2026: kháng sinh tĩnh mạch, đơn trị", lead: "Dành đường tĩnh mạch cho nhiễm khuẩn nặng, người không dung nạp đường uống, hoặc khi đường uống có thể không đạt nồng độ mô đủ; một kháng sinh, thường 5–7 ngày.", items: aceIv(i.age) });
    notes.push(...aceIvNotes(i.age));
    notes.push("ACE: kháng sinh tiêm bắp không phải lựa chọn đầu tay; cân nhắc khi người bệnh không dung nạp đường uống và không muốn nhập viện để dùng đường tĩnh mạch.");
  }
  notes.push("ACE: ban đỏ có thể chưa hết hoàn toàn khi kết thúc đợt kháng sinh.");
  notes.push("ACE: nâng cao vùng tổn thương để giảm phù. NSAID có thể cân nhắc từng ca như điều trị hỗ trợ giảm viêm, sau khi đã loại trừ nhiễm khuẩn hoại tử (NSAID có thể che lấp). Chưa đủ bằng chứng dùng corticoid hỗ trợ.");

  blocks.push({
    title: "Theo IDSA 2014: khuyến cáo",
    items: [
      r("Cấy", "Không cấy máu, dịch hút, sinh thiết hoặc tăm bông thường quy", undefined, "S-M", "IDSA KC 12"),
      r("Cấy máu", "Ung thư đang hóa trị, giảm bạch cầu trung tính, suy giảm miễn dịch tế bào nặng, tổn thương do ngâm nước, vết cắn động vật", undefined, "S-M", "IDSA KC 13"),
      r("Cấy, soi tại chỗ", "Cùng nhóm người bệnh trên: cân nhắc cấy và soi dịch hút, mảnh sinh thiết hoặc tăm bông", undefined, "W-M", "IDSA KC 13"),
      r("Nhẹ", "Không có dấu hiệu toàn thân: kháng sinh có tác dụng trên liên cầu", undefined, "S-M", "IDSA KC 14"),
      r("Vừa", "Có dấu hiệu toàn thân: kháng sinh toàn thân; nhiều bác sĩ có thể phủ thêm MSSA", undefined, "W-L", "IDSA KC 14"),
      r("Nguy cơ MRSA", "Chấn thương xuyên, bằng chứng nhiễm MRSA nơi khác, mang MRSA ở mũi, tiêm chích ma túy, chảy mủ hoặc SIRS: vancomycin hoặc kháng sinh khác có tác dụng trên cả MRSA và liên cầu", undefined, "S-M", "IDSA KC 14, tr. e23"),
      r("Suy giảm miễn dịch nặng", "Có thể cân nhắc kháng sinh phổ rộng", undefined, "W-M", "IDSA KC 14"),
      r("Nặng", "Phối hợp vancomycin với piperacilin-tazobactam, hoặc vancomycin với imipenem hoặc meropenem, là phác đồ kinh nghiệm hợp lý", undefined, "S-M", "IDSA KC 14"),
      r("Thời gian", "5 ngày; kéo dài nếu chưa cải thiện trong thời gian này", undefined, "S-H", "IDSA KC 15"),
      r("Hỗ trợ", "Nâng cao vùng tổn thương; điều trị yếu tố thuận lợi (phù, bệnh da nền)", undefined, "S-M", "IDSA KC 16"),
      r("Chi dưới", "Khám kỹ kẽ ngón chân; điều trị nứt, bong vảy, loét kẽ giúp giảm tái phát", undefined, "S-M", "IDSA KC 17"),
      r("Ngoại trú", "Không có SIRS, rối loạn ý thức, huyết động không ổn định", undefined, "S-M", "IDSA KC 18"),
      r("Nhập viện", "Nghi nhiễm khuẩn sâu hoặc hoại tử, kém tuân thủ điều trị, suy giảm miễn dịch nặng, thất bại điều trị ngoại trú", undefined, "S-M", "IDSA KC 18"),
      ...(a ? [r("Corticoid", "Người lớn không đái tháo đường: có thể cân nhắc corticoid toàn thân (ví dụ prednison 40 mg/ngày trong 7 ngày)", undefined, "W-M", "IDSA KC 19")] : []),
    ],
  });

  const rx: RxItem[] = [];
  const ref = `${T2} – liên cầu`;
  if (i.sev === "mild") {
    if (a) rx.push(r("Uống – đơn trị", "Penicilin V", "250–500 mg uống mỗi 6 giờ", undefined, ref, "std"));
    rx.push(
      r("Uống – đơn trị", "Cefalexin", a ? "500 mg uống mỗi 6 giờ" : pick(MSSA.cefalexin, i.age), undefined, ref),
      mssaRow("Uống – đơn trị", "Dicloxacilin", "dicloxacillin", i.age, "std"),
      r("Uống – đơn trị", "Clindamycin", a ? "300–450 mg uống 4 lần/ngày" : "25–30 mg/kg/ngày uống, chia 3 lần", undefined, `${T2} – MSSA`),
    );
  } else if (i.sev === "moderate") {
    rx.push(
      r("Tĩnh mạch – đơn trị", "Penicilin G", a ? "2–4 triệu đơn vị tĩnh mạch mỗi 4–6 giờ" : "60 000–100 000 đơn vị/kg/lần mỗi 6 giờ", undefined, ref, "std"),
      r("Tĩnh mạch – đơn trị", "Cefazolin", a ? "1 g tĩnh mạch mỗi 8 giờ" : "33 mg/kg/lần tĩnh mạch mỗi 8 giờ", undefined, ref),
      r("Tĩnh mạch – đơn trị", "Clindamycin", a ? "600–900 mg tĩnh mạch mỗi 8 giờ" : "10–13 mg/kg/lần tĩnh mạch mỗi 8 giờ", undefined, ref),
      r("Tĩnh mạch – đơn trị", "Ceftriaxon", a ? "1–2 g tĩnh mạch 1 lần/ngày" : cap(CRO_C.replace("ceftriaxon ", "")), undefined, "IDSA Hình 1; ACE Suppl. 2, Bảng 3"),
    );
  } else {
    rx.push(r("Ngoại khoa", "Thăm dò, cắt lọc ngoại khoa cấp cứu; loại trừ nhiễm khuẩn hoại tử", undefined, undefined, "IDSA Hình 1"));
    for (const [p, label] of [[PIP_T4, "Vancomycin + piperacilin-tazobactam"], [IMI_T4, "Vancomycin + imipenem-cilastatin"], [MERO_T4, "Vancomycin + meropenem"]] as const) {
      const x = vancoCombo(i.age, p, label, `IDSA KC 14; ${T4}`, "std");
      if (x) rx.push(x);
    }
    notes.push(VANCO_TDM);
  }
  if (i.sev !== "severe" && i.mrsa) {
    rx.push(...mrsaSet(i.age, "Nguy cơ MRSA"), mrsaRow("Nguy cơ MRSA – đơn trị", "Clindamycin", "clinda", i.age));
    if (a) {
      rx.push(
        r("Nguy cơ MRSA – phối hợp (uống)", "Sulfamethoxazol-trimethoprim + beta-lactam (penicilin V, cefalexin hoặc amoxicilin)", "Sulfamethoxazol-trimethoprim 1–2 viên hàm lượng gấp đôi (160 mg/800 mg) uống 2 lần/ngày + penicilin V 250–500 mg uống mỗi 6 giờ hoặc cefalexin 500 mg uống mỗi 6 giờ", undefined, `IDSA tr. e25; ${T2}`, "std"),
        r("Nguy cơ MRSA – phối hợp (uống)", "Doxycyclin + beta-lactam (penicilin V, cefalexin hoặc amoxicilin)", "Doxycyclin 100 mg uống 2 lần/ngày + penicilin V 250–500 mg uống mỗi 6 giờ hoặc cefalexin 500 mg uống mỗi 6 giờ", undefined, `IDSA tr. e25; ${T2}`, "std"),
      );
    }
    notes.push("IDSA: doxycyclin, sulfamethoxazol-trimethoprim chưa rõ hoạt tính trên liên cầu tan huyết beta, nên không dùng đơn trị cho viêm mô tế bào; không có áp xe, loét hoặc chảy mủ thì khuyến cáo một beta-lactam đơn trị.");
  }
  if (i.pcnAllergy) {
    if (!i.mrsa) rx.push(...mrsaSet(i.age, `${ALG} nặng`).map((x) => ({ ...x, al: "alt" as const })), { ...mrsaRow(`${ALG} nặng – đơn trị`, "Clindamycin", "clinda", i.age), al: "alt" as const });
    notes.push("IDSA: tỷ lệ liên cầu kháng clindamycin < 1% nhưng có thể đang tăng ở châu Á. Cefalexin, cefazolin dùng được cho người dị ứng penicilin, trừ người có phản ứng quá mẫn tức thì.");
  }
  blocks.push({ title: "Theo IDSA 2014: phác đồ theo mức độ", items: rx });
  if (i.recurrent) {
    blocks.push({
      title: "Viêm mô tế bào tái phát",
      items: [
        r("ACE", "3–4 đợt/năm: chuyển chuyên khoa đánh giá yếu tố nguy cơ, nguyên nhân và nhu cầu kháng sinh dự phòng", undefined, undefined, "ACE KC 5"),
        r("IDSA", "Phát hiện và điều trị yếu tố thuận lợi: phù, béo phì, chàm, suy tĩnh mạch, bất thường kẽ ngón chân – thực hiện thường quy, nhất là trong giai đoạn cấp", undefined, "S-M", "IDSA KC 20"),
        r("IDSA – dự phòng", "3–4 đợt/năm dù đã kiểm soát yếu tố thuận lợi: cân nhắc penicilin hoặc erythromycin uống 2 lần/ngày trong 4–52 tuần, hoặc benzathin penicilin tiêm bắp mỗi 2–4 tuần", undefined, "W-M", "IDSA KC 21"),
        r("IDSA – thời gian", "Duy trì dự phòng chừng nào yếu tố thuận lợi còn tồn tại", undefined, "S-M", "IDSA KC 21"),
      ],
    });
  }
  const headline = aceSev
    ? (i.sev === "severe" ? "ACE: một kháng sinh tĩnh mạch; IDSA (nặng): phối hợp vancomycin + piperacilin-tazobactam hoặc carbapenem" : "Một kháng sinh tĩnh mạch, 5–7 ngày")
    : "Một kháng sinh uống phủ liên cầu, 5–7 ngày";
  return { headline, blocks, avoid: [], notes };
}

/* Dị ứng penicilin nặng – nhiễm khuẩn hoại tử do liên cầu, S. aureus: vancomycin, linezolid, daptomycin (đơn trị). */
function allergyGp(age: Age, withVanco: boolean): RxItem[] {
  const role = `${ALG} nặng – đơn trị`;
  const out: RxItem[] = [];
  if (withVanco) out.push(...dr(age, role, "Vancomycin", { a: "30 mg/kg/ngày tĩnh mạch, chia 2 lần", c: "15 mg/kg/lần tĩnh mạch mỗi 6 giờ" }, T4, "alt"));
  out.push(...dr(age, role, "Linezolid", { a: "600 mg tĩnh mạch mỗi 12 giờ", c: cap(LZD_C.replace("linezolid ", "")) }, `${T4}; nhãn FDA`, "alt"));
  out.push(...dr(age, role, "Daptomycin", { a: "4 mg/kg tĩnh mạch mỗi 24 giờ" }, `${T4}; Bảng 2`, "alt"));
  return out;
}

/* ===================== Nhiễm khuẩn hoại tử ===================== */
function nec(i: SstiIn): SstiOut {
  const a = i.age === "adult";
  const blocks: SstiBlock[] = [{
    title: "Theo IDSA 2014: khuyến cáo",
    items: [
      r("Ngoại khoa", "Hội chẩn ngoại khoa ngay khi nhiễm khuẩn tiến triển kèm nhiễm độc toàn thân, hoặc nghi viêm cân mạc hoại tử, hoại thư sinh hơi", undefined, "S-L", "IDSA KC 27"),
      r("Hoại thư sinh hơi", "Thăm dò và cắt lọc ngoại khoa khẩn cấp mô tổn thương", undefined, "S-M", "IDSA KC 37"),
      r("Cắt lọc lại", "Phần lớn cần quay lại phòng mổ sau 24–36 giờ và mỗi ngày sau đó cho đến khi không cần cắt lọc thêm; bù dịch tích cực", undefined, undefined, "IDSA tr. e30"),
      r("Kinh nghiệm", "Phổ rộng, vì căn nguyên có thể đa vi khuẩn hoặc đơn vi khuẩn (liên cầu nhóm A, MRSA cộng đồng): phối hợp vancomycin hoặc linezolid với piperacilin-tazobactam, với một carbapenem, hoặc với ceftriaxon và metronidazol", undefined, "S-L", "IDSA KC 28"),
      r("Hoại thư sinh hơi – kinh nghiệm", "Phối hợp vancomycin với piperacilin-tazobactam, ampicilin-sulbactam hoặc một carbapenem", undefined, "S-L", "IDSA KC 38"),
      r("Liên cầu nhóm A", "Phối hợp penicilin và clindamycin khi xác định viêm cân mạc hoại tử do liên cầu nhóm A", undefined, "S-L", "IDSA KC 29"),
      r("Clostridium", "Phối hợp penicilin và clindamycin khi xác định hoại tử cơ do Clostridium", undefined, "S-L", "IDSA KC 38"),
      r("Thời gian", "Đến khi không cần cắt lọc thêm, lâm sàng cải thiện và hết sốt 48–72 giờ", undefined, undefined, "IDSA tr. e30"),
    ],
  }];
  const notes: string[] = [];
  const rx: RxItem[] = [];
  const p = i.pathogen;
  const kids = "Chỉ dùng cho trẻ em khi đe dọa tính mạng: doxycyclin 2,2 mg/kg tĩnh mạch mỗi 12 giờ (< 45 kg; ≥ 45 kg: liều người lớn)";
  let lead: string | undefined;
  if (p === "empiric") {
    for (const [partner, label] of [[PIP_T4, "Vancomycin + piperacilin-tazobactam"], [IMI_T4, "Vancomycin + imipenem-cilastatin"], [MERO_T4, "Vancomycin + meropenem"], [ERTA_T4, "Vancomycin + ertapenem"]] as const) {
      const x = vancoCombo(i.age, partner, label, `IDSA KC 28; ${T4}`, "std");
      if (x) rx.push(x);
    }
    rx.push(
      r(COMBO, "Vancomycin + cefotaxim + metronidazol", a ? "Vancomycin 30 mg/kg/ngày tĩnh mạch, chia 2 lần + cefotaxim 2 g tĩnh mạch mỗi 6 giờ + metronidazol 500 mg tĩnh mạch mỗi 6 giờ" : `Vancomycin 15 mg/kg/lần tĩnh mạch mỗi 6 giờ + ${CTX_C} + metronidazol 7,5 mg/kg/lần tĩnh mạch mỗi 6 giờ`, undefined, `IDSA tr. e30; ${T4}`, "std"),
      r(COMBO, "Vancomycin + cefotaxim + clindamycin", a ? "Vancomycin 30 mg/kg/ngày tĩnh mạch, chia 2 lần + cefotaxim 2 g tĩnh mạch mỗi 6 giờ + clindamycin 600–900 mg tĩnh mạch mỗi 8 giờ" : `Vancomycin 15 mg/kg/lần tĩnh mạch mỗi 6 giờ + ${CTX_C} + clindamycin 10–13 mg/kg/lần tĩnh mạch mỗi 8 giờ`, undefined, `IDSA tr. e30; ${T4}`, "std"),
      r(`${ALG} nặng – phối hợp`, a ? "Clindamycin hoặc metronidazol + gentamicin hoặc fluoroquinolon" : "Clindamycin hoặc metronidazol + gentamicin", a ? "Clindamycin 600–900 mg tĩnh mạch mỗi 8 giờ hoặc metronidazol 500 mg tĩnh mạch mỗi 6 giờ + gentamicin 5 mg/kg tĩnh mạch mỗi 24 giờ, hoặc ciprofloxacin 400 mg tĩnh mạch mỗi 12 giờ, hoặc levofloxacin 750 mg tĩnh mạch mỗi 24 giờ" : `Clindamycin 10–13 mg/kg/lần tĩnh mạch mỗi 8 giờ hoặc metronidazol 7,5 mg/kg/lần tĩnh mạch mỗi 6 giờ + ${GENTA_C}`, undefined, `${T4}; Bảng 3; nhãn FDA gentamicin`, "alt"),
    );
    lead = a ? "Có thể thay vancomycin bằng linezolid 600 mg tĩnh mạch mỗi 12 giờ." : `Có thể thay vancomycin bằng ${LZD_C}.`;
    notes.push("Dị ứng penicilin nặng, có hoặc nghi tụ cầu: phối hợp thêm vancomycin hoặc linezolid (IDSA).");
    notes.push("IDSA: nhiễm khuẩn đa vi khuẩn – có thể phối hợp vancomycin, linezolid hoặc daptomycin với fluoroquinolon + metronidazol. Xác định căn nguyên thì điều chỉnh kháng sinh.");
    notes.push(VANCO_TDM);
  } else if (p === "strep") {
    rx.push(
      r(COMBO, "Penicilin G + clindamycin", a ? "Penicilin G 2–4 triệu đơn vị tĩnh mạch mỗi 4–6 giờ + clindamycin 600–900 mg tĩnh mạch mỗi 8 giờ" : "Penicilin G 60 000–100 000 đơn vị/kg/lần tĩnh mạch mỗi 6 giờ + clindamycin 10–13 mg/kg/lần tĩnh mạch mỗi 8 giờ", undefined, T4, "std"),
      ...allergyGp(i.age, true),
    );
    notes.push("IDSA: clindamycin ức chế sinh độc tố và cytokin của liên cầu; phối hợp penicilin vì liên cầu nhóm A có thể kháng clindamycin. Chưa đủ bằng chứng để khuyến cáo immunoglobulin tĩnh mạch trong hội chứng sốc nhiễm độc do liên cầu.");
  } else if (p === "sa") {
    rx.push(
      r("MSSA – đơn trị", "Nafcilin", a ? "1–2 g tĩnh mạch mỗi 4 giờ" : "50 mg/kg/lần tĩnh mạch mỗi 6 giờ", undefined, T4, "std"),
      r("MSSA – đơn trị", "Oxacilin", a ? "1–2 g tĩnh mạch mỗi 4 giờ" : "50 mg/kg/lần tĩnh mạch mỗi 6 giờ", undefined, T4, "std"),
      r("MSSA – đơn trị", "Cefazolin", a ? "1 g tĩnh mạch mỗi 8 giờ" : "33 mg/kg/lần tĩnh mạch mỗi 8 giờ", undefined, T4, "std"),
      r("MRSA – đơn trị", "Vancomycin", a ? "30 mg/kg/ngày tĩnh mạch, chia 2 lần" : "15 mg/kg/lần tĩnh mạch mỗi 6 giờ", undefined, T4),
      r(MONO, "Clindamycin; kìm khuẩn, có thể kháng chéo và xuất hiện kháng ở chủng kháng erythromycin, kháng cảm ứng ở MRSA", a ? "600–900 mg tĩnh mạch mỗi 8 giờ" : "10–13 mg/kg/lần tĩnh mạch mỗi 8 giờ", undefined, T4),
      ...allergyGp(i.age, false),
    );
    notes.push("IDSA: có hoặc nghi MRSA khi dùng clindamycin – phối hợp thêm vancomycin, không vượt quá liều tối đa hằng ngày của người lớn.");
    notes.push(VANCO_TDM);
  } else if (p === "clos") {
    rx.push(r(COMBO, "Clindamycin + penicilin G", a ? "Clindamycin 600–900 mg tĩnh mạch mỗi 8 giờ + penicilin G 2–4 triệu đơn vị tĩnh mạch mỗi 4–6 giờ" : "Clindamycin 10–13 mg/kg/lần tĩnh mạch mỗi 8 giờ + penicilin G 60 000–100 000 đơn vị/kg/lần tĩnh mạch mỗi 6 giờ", undefined, T4));
    blocks[0].items.push(r("Không khuyến cáo", "Oxy cao áp: chưa chứng minh lợi ích, có thể trì hoãn hồi sức và cắt lọc ngoại khoa", undefined, "S-L", "IDSA KC 39"));
  } else if (p === "aero") {
    rx.push(r(COMBO, a ? "Doxycyclin + ciprofloxacin hoặc ceftriaxon" : "Doxycyclin + ceftriaxon", a ? "Doxycyclin 100 mg tĩnh mạch mỗi 12 giờ + ciprofloxacin 400 mg tĩnh mạch mỗi 12 giờ hoặc ceftriaxon 1–2 g tĩnh mạch mỗi 24 giờ" : `${kids} + ${CRO_C}`, undefined, `${T4}; đính chính 2015`));
  } else {
    rx.push(r(COMBO, "Doxycyclin + ceftriaxon hoặc cefotaxim", a ? "Doxycyclin 100 mg tĩnh mạch mỗi 12 giờ + ceftriaxon 1 g tĩnh mạch 1 lần/ngày hoặc cefotaxim 2 g tĩnh mạch 3 lần/ngày" : `${kids} + ${CRO_C}, hoặc ${CTX_C}`, undefined, `${T4}; đính chính 2015`));
  }
  blocks.push({ title: "Theo IDSA 2014: phác đồ theo tác nhân", lead, items: rx });
  notes.push("IDSA: hoại thư Fournier (bìu, dương vật hoặc âm hộ) – cắt lọc ngoại khoa sớm, triệt để toàn bộ mô hoại tử, bảo tồn cấu trúc sâu khi có thể.");
  const headline = p === "empiric" ? "Phẫu thuật cấp cứu + phối hợp kháng sinh phổ rộng" : p === "sa" ? "Phẫu thuật cấp cứu + một kháng sinh theo kháng sinh đồ" : "Phẫu thuật cấp cứu + phối hợp kháng sinh theo tác nhân";
  return { headline, blocks, avoid: [], notes };
}

/* ===================== Viêm cơ mủ ===================== */
function pyo(i: SstiIn): SstiOut {
  const blocks: SstiBlock[] = [{
    title: "Theo IDSA 2014: khuyến cáo",
    items: [
      r("Chẩn đoán hình ảnh", "MRI là phương tiện khuyến cáo; CT và siêu âm cũng có ích", undefined, "S-M", "IDSA KC 30"),
      r("Cấy", "Cấy máu và cấy mủ ổ áp xe", undefined, "S-M", "IDSA KC 31"),
      r("Kinh nghiệm", "Vancomycin đơn trị", undefined, "S-M", "IDSA KC 32"),
      r("Phối hợp thêm", "Kháng sinh có tác dụng trên trực khuẩn Gram âm đường ruột khi suy giảm miễn dịch hoặc sau chấn thương hở vào cơ", undefined, "S-M", "IDSA KC 32"),
      r("MSSA", "Cefazolin hoặc penicilin kháng tụ cầu (nafcilin, oxacilin), đơn trị", undefined, "S-M", "IDSA KC 33"),
      r("Dẫn lưu", "Dẫn lưu mủ sớm", undefined, "S-H", "IDSA KC 34"),
      r("Vi khuẩn máu kéo dài", "Chụp lại để tìm ổ nhiễm chưa được dẫn lưu", undefined, "S-L", "IDSA KC 35"),
      r("Chuyển uống, thời gian", "Tĩnh mạch ban đầu; chuyển uống khi lâm sàng cải thiện, vi khuẩn máu sạch nhanh, không có viêm nội tâm mạc hoặc áp xe di bệnh. Tổng 2–3 tuần", undefined, "S-L", "IDSA KC 36"),
    ],
  }];
  const rx: RxItem[] = [mrsaRow("Kinh nghiệm – đơn trị", "Vancomycin", "vanco", i.age), mssaRow("MSSA – đơn trị", "Cefazolin", "cefazolin", i.age), mssaRow("MSSA – đơn trị", "Nafcilin hoặc oxacilin", "nafcillin", i.age)];
  if (i.immuno) {
    for (const [partner, label] of [[PIP_T4, "Vancomycin + piperacilin-tazobactam"], [MERO_T4, "Vancomycin + meropenem"], [IMI_T4, "Vancomycin + imipenem-cilastatin"]] as const) {
      const x = vancoCombo(i.age, partner, label, `IDSA tr. e32; ${T4}`);
      if (x) rx.push({ ...x, role: "Bệnh nền – phối hợp" });
    }
    rx.push(r("Bệnh nền – phối hợp", "Vancomycin + ampicilin-sulbactam", i.age === "adult" ? `Vancomycin 30 mg/kg/ngày tĩnh mạch, chia 2 lần + ${SAM_A}` : `Vancomycin 15 mg/kg/lần tĩnh mạch mỗi 6 giờ + ${SAM_C}`, undefined, "IDSA tr. e32; nhãn FDA Unasyn"));
  }
  blocks.push({ title: "Theo IDSA 2014: phác đồ và liều", items: rx });
  return { headline: "Dẫn lưu sớm + vancomycin đơn trị; MSSA: cefazolin; tổng 2–3 tuần", blocks, avoid: [], notes: [VANCO_TDM] };
}

/* ===================== Nhiễm khuẩn vết mổ ===================== */
function ssi(i: SstiIn): SstiOut {
  const T3 = "IDSA Bảng 3";
  const g = i.age;
  const blocks: SstiBlock[] = [{
    title: "Theo IDSA 2014: khuyến cáo",
    items: [
      r("Ngoại khoa", "Cắt chỉ, mở và dẫn lưu vết mổ", undefined, "S-L", "IDSA KC 22"),
      r("Kháng sinh hỗ trợ", "Không thường quy; có thể có lợi khi kèm phản ứng toàn thân rõ: ban đỏ và cứng lan > 5 cm từ mép vết mổ, nhiệt độ > 38,5 °C, mạch > 110 lần/phút, hoặc bạch cầu > 12 000/µL", undefined, "W-L", "IDSA KC 23"),
      r("Đợt ngắn", "Sau mổ sạch vùng thân, đầu – cổ, chi kèm dấu hiệu nhiễm khuẩn toàn thân: đợt kháng sinh ngắn (ví dụ 24–48 giờ)", undefined, "S-L", "IDSA KC 24; tr. e27"),
      r("Không dùng kháng sinh", "Ban đỏ và cứng < 5 cm, dấu hiệu toàn thân tối thiểu (nhiệt độ < 38,5 °C, bạch cầu < 12 000/µL, mạch < 100 lần/phút)", undefined, undefined, "IDSA tr. e27"),
      r("Sốt trong 48 giờ đầu", "Khám vết mổ; nhuộm Gram dịch vết mổ tìm liên cầu, Clostridium. Nếu có: mở vết mổ, cắt lọc, phối hợp penicilin và clindamycin", undefined, undefined, "IDSA Hình 2"),
    ],
  }];
  const notes: string[] = [];
  const rx: RxItem[] = [];
  const vanco: D = { a: "15 mg/kg tĩnh mạch mỗi 12 giờ", c: "40 mg/kg/ngày tĩnh mạch, chia 4 lần" };
  if (i.site === "clean") {
    rx.push(r("Khuyến cáo", "MSSA: cephalosporin thế hệ 1 hoặc penicilin kháng tụ cầu, đơn trị. Nguy cơ MRSA cao (mang MRSA ở mũi, tiền sử nhiễm MRSA, mới nằm viện, mới dùng kháng sinh): vancomycin, linezolid, daptomycin, telavancin hoặc ceftarolin, đơn trị", undefined, "S-L", "IDSA KC 25"));
    rx.push(
      ...dr(g, MONO, "Oxacilin hoặc nafcilin", { a: "2 g tĩnh mạch mỗi 6 giờ", c: "100–150 mg/kg/ngày tĩnh mạch, chia 4 lần" }, `${T3}; Bảng 2`, "std"),
      ...dr(g, MONO, "Cefazolin", { a: "0,5–1 g tĩnh mạch mỗi 8 giờ", c: "50 mg/kg/ngày tĩnh mạch, chia 3 lần" }, `${T3}; Bảng 2`, "std"),
      ...dr(g, MONO, "Cefalexin", { a: "500 mg uống mỗi 6 giờ", c: "25–50 mg/kg/ngày uống, chia 4 lần" }, `${T3}; Bảng 2`, "std"),
      ...dr(g, i.mrsa ? "Nguy cơ MRSA – đơn trị" : "Dị ứng beta-lactam type 1 – đơn trị", "Vancomycin", vanco, `${T3}; Bảng 2; Hình 2`, i.mrsa ? undefined : "alt"),
    );
    if (i.mrsa) {
      rx.push(mrsaRow("Nguy cơ MRSA – đơn trị", "Linezolid", "linezolid", g));
      if (g === "adult") rx.push(mrsaRow("Nguy cơ MRSA – đơn trị", "Daptomycin", "dapto", g), mrsaRow("Nguy cơ MRSA – đơn trị", "Ceftarolin", "ceftaroline", g));
    }
    notes.push("IDSA: vết mổ sạch – bắt đầu cefazolin, hoặc vancomycin (người dị ứng beta-lactam type 1: phản vệ, mày đay) cho đến khi loại trừ MRSA.");
  } else if (i.site === "gi") {
    rx.push(r("Khuyến cáo", "Kháng sinh có tác dụng trên vi khuẩn Gram âm và kỵ khí, ví dụ phối hợp cephalosporin hoặc fluoroquinolon với metronidazol", undefined, "S-L", "IDSA KC 26"));
    rx.push(
      ...dr(g, MONO, "Piperacilin-tazobactam", { a: cap(PIP_T4.a!.replace("piperacilin-tazobactam ", "")), c: cap(PIP_T4.c!.replace("piperacilin-tazobactam ", "")) }, `${T3}; Bảng 4; nhãn FDA Zosyn`, "std"),
      ...dr(g, MONO, "Imipenem-cilastatin", { a: "500 mg tĩnh mạch mỗi 6 giờ", c: cap(IMI_T4.c!.replace("imipenem-cilastatin ", "")) }, `${T3}; nhãn FDA Primaxin`, "std"),
      ...dr(g, MONO, "Meropenem", { a: "1 g tĩnh mạch mỗi 8 giờ", c: cap(MERO_T4.c!.replace("meropenem ", "")) }, `${T3}; Bảng 4`, "std"),
      ...dr(g, MONO, "Ertapenem", { a: "1 g tĩnh mạch mỗi 24 giờ", c: cap(ERTA_T4.c!.replace("ertapenem ", "")) }, `${T3}; nhãn FDA Invanz`, "std"),
      ...dr(g, MONO, "Ticarcilin-acid clavulanic", { a: "3,1 g tĩnh mạch mỗi 6 giờ" }, T3, "std"),
      ...dr(g, COMBO, "Ceftriaxon + metronidazol", { a: "Ceftriaxon 1 g tĩnh mạch mỗi 24 giờ + metronidazol 500 mg tĩnh mạch mỗi 8 giờ", c: `${cap(CRO_C)} + metronidazol 7,5 mg/kg/lần tĩnh mạch mỗi 6 giờ` }, `${T3}; Bảng 4; ACE`, "std"),
      ...dr(g, COMBO, "Ampicilin-sulbactam + gentamicin hoặc tobramycin", { a: "Ampicilin-sulbactam 3 g tĩnh mạch mỗi 6 giờ (tổng sulbactam ≤ 4 g/ngày) + gentamicin hoặc tobramycin 5 mg/kg tĩnh mạch mỗi 24 giờ", c: `${cap(SAM_C)} + ${GENTA_C}` }, `${T3}; nhãn FDA Unasyn, gentamicin`, "std"),
      ...dr(g, COMBO, "Ciprofloxacin + metronidazol", { a: "Ciprofloxacin 400 mg tĩnh mạch mỗi 12 giờ hoặc 500–750 mg uống mỗi 12 giờ + metronidazol 500 mg tĩnh mạch mỗi 8 giờ" }, `${T3}; trả lời tác giả 2015`),
      ...dr(g, COMBO, "Levofloxacin + metronidazol", { a: "Levofloxacin 750 mg tĩnh mạch mỗi 24 giờ + metronidazol 500 mg tĩnh mạch mỗi 8 giờ" }, T3),
    );
    if (i.mrsa) rx.push(...dr(g, "Nguy cơ MRSA – phối hợp thêm", "Vancomycin vào một phác đồ trên", vanco, `IDSA tr. e27; ${T3}`));
  } else {
    rx.push(r("Khuyến cáo", "Kháng sinh có tác dụng trên vi khuẩn Gram âm và kỵ khí, ví dụ phối hợp cephalosporin hoặc fluoroquinolon với metronidazol", undefined, "S-L", "IDSA KC 26"));
    rx.push(
      ...dr(g, COMBO, "Metronidazol + ceftriaxon", { a: "Metronidazol 500 mg tĩnh mạch mỗi 8 giờ + ceftriaxon 1 g tĩnh mạch mỗi 24 giờ", c: `Metronidazol 7,5 mg/kg/lần tĩnh mạch mỗi 6 giờ + ${CRO_C}` }, `${T3}; Bảng 4; ACE`, "std"),
      ...dr(g, COMBO, "Metronidazol + ciprofloxacin", { a: "Metronidazol 500 mg tĩnh mạch mỗi 8 giờ + ciprofloxacin 400 mg tĩnh mạch mỗi 12 giờ hoặc 500–750 mg uống mỗi 12 giờ" }, `${T3}; trả lời tác giả 2015`),
      ...dr(g, COMBO, "Metronidazol + levofloxacin", { a: "Metronidazol 500 mg tĩnh mạch mỗi 8 giờ + levofloxacin 750 mg tĩnh mạch hoặc uống mỗi 24 giờ" }, T3),
    );
    if (i.mrsa) rx.push(...dr(g, "Nguy cơ MRSA – phối hợp thêm", "Vancomycin vào một phác đồ trên", vanco, T3));
  }
  blocks.push({ title: "Theo IDSA 2014: phác đồ theo vị trí phẫu thuật", items: rx });
  if (i.mrsa) notes.push(VANCO_TDM);
  notes.push("ACE: nhiễm khuẩn vết mổ, mảnh ghép, vật liệu nhân tạo – cân nhắc chuyển tuyến.");
  return { headline: "Mở, dẫn lưu vết mổ; kháng sinh ngắn ngày khi có phản ứng toàn thân", blocks, avoid: [], notes };
}

/* ===================== Vết cắn ===================== */
function bite(i: SstiIn): SstiOut {
  const T5 = "IDSA Bảng 5";
  const g = i.age;
  const blocks: SstiBlock[] = [{
    title: "Theo IDSA 2014: khuyến cáo",
    items: [
      r("Kháng sinh sớm", "3–5 ngày khi: suy giảm miễn dịch; cắt lách; bệnh gan tiến triển; phù sẵn có hoặc phù do vết cắn; tổn thương vừa – nặng, nhất là bàn tay hoặc mặt; tổn thương có thể tới màng xương hoặc bao khớp", undefined, "S-L", "IDSA KC 40"),
      r("Dại", "Có thể cần dự phòng sau phơi nhiễm; hỏi ý kiến cơ quan y tế dự phòng địa phương", undefined, "S-L", "IDSA KC 41"),
      r("Vết cắn nhiễm khuẩn", "Kháng sinh có tác dụng trên cả vi khuẩn hiếu khí và kỵ khí, như amoxicilin-acid clavulanic", undefined, "S-M", "IDSA KC 42"),
      r("Uốn ván", "Tiêm giải độc tố uốn ván nếu chưa tiêm trong 10 năm; ưu tiên Tdap hơn Td nếu chưa từng tiêm Tdap", undefined, "S-L", "IDSA KC 43"),
      r("Khâu vết thương", "Không khâu kín thì đầu, trừ vết thương vùng mặt (rửa nhiều, cắt lọc thận trọng, kháng sinh sớm)", undefined, "S-L", "IDSA KC 44"),
      r("Khâu khép mép", "Các vết thương khác có thể khâu khép mép", undefined, "W-L", "IDSA KC 44"),
    ],
  }];
  const notes: string[] = ["IDSA: vết thương bẩn – tiêm nhắc giải độc tố uốn ván nếu > 5 năm từ liều cuối; vết thương sạch – nếu > 10 năm."];
  const rx: RxItem[] = [];
  const amc: D = { a: "875 mg/125 mg uống 2 lần/ngày", c: ACE_ORAL[2].d.c };
  const sam: D = { a: cap(SAM_A.replace("ampicilin-sulbactam ", "")), c: cap(SAM_C.replace("ampicilin-sulbactam ", "")) };
  const doxy: D = { a: "100 mg uống 2 lần/ngày, hoặc 100 mg tĩnh mạch mỗi 12 giờ", c: MRSA.doxy.c };
  const anaerA = "metronidazol 250–500 mg uống 3 lần/ngày hoặc 500 mg tĩnh mạch mỗi 8 giờ; hoặc clindamycin 300 mg uống 3 lần/ngày hoặc 600 mg tĩnh mạch mỗi 6–8 giờ";
  if (i.bite === "animal") {
    rx.push(
      ...dr(g, MONO, "Amoxicilin-acid clavulanic; một số trực khuẩn Gram âm kháng, không phủ MRSA", amc, `${T5}; ACE`, "std"),
      ...dr(g, MONO, "Ampicilin-sulbactam; một số trực khuẩn Gram âm kháng, không phủ MRSA", sam, `${T5}; nhãn FDA Unasyn`, "std"),
      ...dr(g, MONO, "Piperacilin-tazobactam; không phủ MRSA", { a: "3,375 g tĩnh mạch mỗi 6 giờ", c: cap(PIP_T4.c!.replace("piperacilin-tazobactam ", "")) }, `${T5}; Bảng 4; nhãn FDA Zosyn`, "std"),
      ...dr(g, MONO, "Doxycyclin; rất tốt với Pasteurella multocida, một số liên cầu kháng", doxy, `${T5}; nhãn FDA doxycyclin`),
      ...dr(g, MONO, "Moxifloxacin; phủ cả vi khuẩn kỵ khí", { a: "400 mg uống hoặc tĩnh mạch 1 lần/ngày" }, T5),
      ...dr(g, MONO, "Ciprofloxacin; tốt với P. multocida, không phủ MRSA và một số vi khuẩn kỵ khí", { a: "500–750 mg uống 2 lần/ngày, hoặc 400 mg tĩnh mạch mỗi 12 giờ" }, T5),
      ...dr(g, COMBO, "Penicilin V + dicloxacilin", { a: "Penicilin V 500 mg uống 4 lần/ngày + dicloxacilin 500 mg uống 4 lần/ngày" }, T5, "std"),
      ...dr(g, COMBO, g === "adult" ? "Sulfamethoxazol-trimethoprim + metronidazol hoặc clindamycin" : "Sulfamethoxazol-trimethoprim + clindamycin", { a: `Sulfamethoxazol-trimethoprim 160 mg/800 mg uống 2 lần/ngày, hoặc 5–10 mg/kg/ngày (tính theo trimethoprim) tĩnh mạch + ${anaerA}`, c: "Sulfamethoxazol-trimethoprim 8–12 mg/kg/ngày (tính theo trimethoprim) uống, chia 2 lần + clindamycin 30–40 mg/kg/ngày uống, chia 3 lần" }, `${T5}; Bảng 2; tr. e33`),
      ...dr(g, COMBO, "Levofloxacin + metronidazol hoặc clindamycin", { a: `Levofloxacin 750 mg uống hoặc tĩnh mạch 1 lần/ngày + ${anaerA}` }, `${T5}; tr. e33`),
      ...dr(g, "Đơn trị hoặc phối hợp", "Ceftriaxon; phối hợp metronidazol hoặc clindamycin khi cần phủ kỵ khí", { a: "1 g tĩnh mạch mỗi 12 giờ", c: cap(CRO_C.replace("ceftriaxon ", "")) }, `${T5}; ACE; tr. e33`, "std"),
      ...dr(g, "Đơn trị hoặc phối hợp", "Cefotaxim; phối hợp metronidazol hoặc clindamycin khi cần phủ kỵ khí", { a: "1–2 g tĩnh mạch mỗi 6–8 giờ", c: cap(CTX_C.replace("cefotaxim ", "")) }, `${T5}; nhãn FDA Claforan; tr. e33`, "std"),
      ...dr(g, "Đơn trị hoặc phối hợp", "Cefuroxim (tốt với P. multocida, không phủ kỵ khí); phối hợp metronidazol hoặc clindamycin khi cần phủ kỵ khí", { a: "500 mg uống 2 lần/ngày, hoặc 1 g tĩnh mạch mỗi 12 giờ" }, `${T5}; tr. e33`, "std"),
      ...dr(g, "Đơn trị hoặc phối hợp", "Cefoxitin; phối hợp metronidazol hoặc clindamycin khi cần phủ kỵ khí", { a: "1 g tĩnh mạch mỗi 6–8 giờ" }, `${T5}; tr. e33`, "std"),
    );
    notes.push("IDSA: tránh macrolid (hoạt tính không ổn định trên P. multocida, Fusobacterium) trừ khi không có lựa chọn khác. Carbapenem cũng phù hợp, không phủ MRSA.");
  } else {
    rx.push(
      ...dr(g, MONO, "Amoxicilin-acid clavulanic; một số trực khuẩn Gram âm kháng, không phủ MRSA", amc, `${T5}; ACE`, "std"),
      ...dr(g, MONO, "Ampicilin-sulbactam; một số trực khuẩn Gram âm kháng, không phủ MRSA", sam, `${T5}; nhãn FDA Unasyn`, "std"),
      ...dr(g, MONO, "Ertapenem; không phủ MRSA", { a: "1 g tĩnh mạch 1 lần/ngày", c: cap(ERTA_T4.c!.replace("ertapenem ", "")) }, `IDSA tr. e34; nhãn FDA Invanz`, "std"),
      ...dr(g, MONO, "Doxycyclin; tốt với Eikenella, tụ cầu, kỵ khí; một số liên cầu kháng", doxy, `${T5}; nhãn FDA doxycyclin`),
      ...dr(g, "Dị ứng beta-lactam – phối hợp", "Ciprofloxacin hoặc levofloxacin + metronidazol", { a: "Ciprofloxacin 500–750 mg uống 2 lần/ngày hoặc 400 mg tĩnh mạch mỗi 12 giờ, hoặc levofloxacin 750 mg uống hoặc tĩnh mạch 1 lần/ngày + metronidazol 250–500 mg uống 3 lần/ngày hoặc 500 mg tĩnh mạch mỗi 8 giờ" }, `IDSA tr. e34; ${T5}`, "alt"),
      ...dr(g, "Dị ứng beta-lactam – đơn trị", "Moxifloxacin", { a: "400 mg uống hoặc tĩnh mạch 1 lần/ngày" }, `IDSA tr. e34; ${T5}`, "alt"),
    );
    notes.push("IDSA: Eikenella corrodens kháng cephalosporin thế hệ 1, macrolid, clindamycin và aminoglycosid.");
  }
  blocks.push({ title: `Theo IDSA 2014: phác đồ cho vết cắn ${i.bite === "animal" ? "chó, mèo" : "người"}`, lead: i.infected ? "Vết cắn đã nhiễm khuẩn." : "Kháng sinh sớm 3–5 ngày cho nhóm nguy cơ ở trên.", items: rx });
  notes.push("IDSA: thai kỳ – chống chỉ định tương đối tetracyclin và fluoroquinolon; sulfamethoxazol-trimethoprim dùng an toàn trừ 3 tháng cuối.");
  return { headline: i.infected ? "Kháng sinh phủ hiếu khí và kỵ khí, ví dụ amoxicilin-acid clavulanic đơn trị" : "Kháng sinh sớm 3–5 ngày cho nhóm nguy cơ; uốn ván, dại", blocks, avoid: [], notes };
}

export function sstiPlan(i: SstiIn): SstiOut {
  const aceSev = i.sev !== "mild" || i.aceSevere || i.highRisk;
  let o: SstiOut;
  if (i.form === "impetigo") o = impetigo(i, aceSev);
  else if (i.form === "purulent") o = purulent(i, aceSev);
  else if (i.form === "cellulitis") o = cellulitis(i, aceSev);
  else if (i.form === "ssi") o = ssi(i);
  else if (i.form === "nec") o = nec(i);
  else if (i.form === "pyo") o = pyo(i);
  else o = bite(i);
  /* Dị ứng: ẩn dòng beta-lactam (al "std"); không dị ứng: ẩn dòng chỉ dành cho người dị ứng (al "alt"). */
  const keep = (x: RxItem) => (i.pcnAllergy ? x.al !== "std" : x.al !== "alt");
  o = { ...o, blocks: o.blocks.map((b) => ({ ...b, items: b.items.filter(keep) })).filter((b) => b.items.length > 0) };
  const common: string[] = [];
  if (["impetigo", "purulent", "cellulitis"].includes(i.form)) {
    if (i.highRisk && i.sev === "mild") common.push("ACE: nhiễm khuẩn nhẹ ở người nguy cơ biến chứng cao (suy giảm miễn dịch, đái tháo đường, bệnh da kèm theo) – xử trí như nhiễm khuẩn nặng.");
    common.push("ACE: chọn kháng sinh phổ hẹp nhất, đợt ngắn nhất có hiệu quả, liều phù hợp; điều chỉnh thời gian theo đáp ứng lâm sàng (giảm sưng, đau, hết sốt). Dùng đơn trị – phối hợp hai kháng sinh không tăng hiệu quả trong nhiễm khuẩn da – mô mềm không biến chứng.");
    common.push("ACE: tờ hướng dẫn sử dụng tại Singapore của cefalexin, clindamycin, cefazolin khuyến cáo điều trị ít nhất 10 ngày với nhiễm liên cầu tan huyết beta.");
    common.push("ACE: sau điều trị, tìm và xử trí yếu tố gây tái phát (viêm da cơ địa, hăm kẽ, dụng cụ cạo râu không vệ sinh).");
    common.push("ACE: chỉnh liều khi suy thận theo tờ hướng dẫn sử dụng hoặc phác đồ của cơ sở.");
  }
  if (i.pcnAllergy) common.push("ACE: xác minh dị ứng penicilin (đặc điểm phản ứng trước đây, tiền sử đã dung nạp penicilin) – phần lớn dị ứng do người bệnh tự khai không chính xác.");
  if (i.age === "child") common.push("IDSA: liều trẻ em không áp dụng cho sơ sinh.");
  return { ...o, notes: [...o.notes, ...common] };
}
