/*
  Nhiễm khuẩn da – mô mềm – dữ liệu công cụ chọn kháng sinh.
  Nguồn (đọc từ PDF người dùng cung cấp, 16/11/2026):
  - IDSA 2014: Stevens DL và cs. Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue
    Infections: 2014 Update by the IDSA. Clin Infect Dis 2014;59(2):e10–e52 – khuyến cáo 1–44, Hình 1, Hình 2,
    Bảng 2 (liều tụ cầu, liên cầu), Bảng 3 (nhiễm khuẩn vết mổ), Bảng 4 (nhiễm khuẩn hoại tử), Bảng 5 (vết cắn).
    Mức GRADE giữ nguyên: mạnh/yếu; cao/trung bình/thấp -> "S-H", "S-M", "S-L", "W-M", "W-L".
  - ACE 2026: Agency for Care Effectiveness (Bộ Y tế Singapore). Bacterial skin and soft tissue infections –
    diagnosis and antibiotic prescribing. ACE Clinical Guideline, 21/09/2026 – Khuyến cáo 1–5, Hình 2, Hình 3;
    Supplement 2 (Bảng 1 thuốc bôi, Bảng 2 thuốc uống, Bảng 3 thuốc tĩnh mạch). ACE không in mức khuyến cáo.
  ref = vị trí trong văn bản (không hiển thị).

  - Đính chính IDSA: Clin Infect Dis 2015;60(9):1448 (doi:10.1093/cid/civ114) – áp dụng:
    Hình 1, SIRS: bạch cầu > 12 000 hoặc < 4000/µL; Bảng 2: mupirocin bôi 3 lần/ngày (chốc);
    Bảng 4: Aeromonas – ciprofloxacin 400 mg TM mỗi 12 giờ; Vibrio – ceftriaxon 1 g TM mỗi ngày.
  - Trả lời của tác giả: Clin Infect Dis 2015;60(11):1732 (doi:10.1093/cid/civ127) – Bảng 3 ciprofloxacin uống
    500 mg hoặc 500–750 mg mỗi 12 giờ.
  - Bảng 4, penicilin trẻ em ở dòng Clostridium in "60 000–100 00": dùng liều penicilin trẻ em ở dòng liên cầu
    cùng bảng (60 000–100 000 đơn vị/kg/lần mỗi 6 giờ TM) – cùng thuốc, cùng đường dùng.
  - Vancomycin: liều theo Bảng 2–4; theo dõi nồng độ theo ASHP/IDSA/PIDS/SIDP 2020 (thay mục tiêu nồng độ đáy
    của Bảng 7).
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

export const FORM_OPTS: { id: Form; label: string }[] = [
  { id: "impetigo", label: "Chốc, chốc loét, viêm nang lông" },
  { id: "purulent", label: "Nhọt, cụm nhọt, áp xe da" },
  { id: "cellulitis", label: "Viêm mô bào, viêm quầng" },
  { id: "ssi", label: "Nhiễm khuẩn vết mổ" },
  { id: "nec", label: "Nhiễm khuẩn hoại tử" },
  { id: "pyo", label: "Viêm cơ mủ" },
  { id: "bite", label: "Vết cắn" },
];
export const FORM_TIP: Record<Form, string> = {
  impetigo: "Chốc: vảy tiết vàng mật ong, rỉ dịch. Chốc loét: nhiễm khuẩn sâu hơn chốc, gây loét da. Viêm nang lông: mụn mủ ở chân nang lông.",
  purulent: "Nhọt: nốt sưng đau có mủ ở nang lông. Cụm nhọt: nhiều nang lông viêm hợp lại thành khối đỏ, đau, có mụn mủ trên bề mặt. Áp xe: vùng đỏ, đau, có dấu hiệu lùng nhùng.",
  cellulitis: "Viêm quầng: mảng đỏ phù nề, nóng, nổi gờ, bờ rõ. Viêm mô bào: da đỏ, nóng, sưng, chắc, bờ kém rõ hơn viêm quầng. Thường không có mủ.",
  ssi: "Nhiễm khuẩn vết mổ nông, sâu (cân, cơ) trong 30 ngày sau mổ, hoặc trong 1 năm nếu có đặt vật liệu nhân tạo.",
  nec: "Viêm cân mạc hoại tử (kể cả hoại thư Fournier), hoại thư sinh hơi do Clostridium.",
  pyo: "Mủ trong cơ, chủ yếu do S. aureus; đau khu trú một nhóm cơ, ấn đau, sốt.",
  bite: "Vết cắn của chó, mèo (động vật) hoặc người.",
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
/* IDSA Hình 1 – định nghĩa mức độ */
export const SEV_TIP: Record<"purulent" | "cellulitis", Record<Sev, string>> = {
  purulent: {
    mild: "Nhiễm khuẩn có mủ, chỉ định rạch dẫn lưu; không có dấu hiệu toàn thân.",
    moderate: "Nhiễm khuẩn có mủ kèm dấu hiệu nhiễm khuẩn toàn thân.",
    severe: "Thất bại rạch dẫn lưu kèm kháng sinh uống; hoặc dấu hiệu nhiễm khuẩn toàn thân (SIRS); hoặc suy giảm miễn dịch.",
  },
  cellulitis: {
    mild: "Viêm mô bào, viêm quầng điển hình, không có ổ mủ.",
    moderate: "Viêm mô bào, viêm quầng điển hình kèm dấu hiệu nhiễm khuẩn toàn thân.",
    severe: "Thất bại kháng sinh uống; hoặc dấu hiệu nhiễm khuẩn toàn thân (SIRS); hoặc suy giảm miễn dịch; hoặc dấu hiệu nhiễm khuẩn sâu: bọng nước, bong da, tụt huyết áp, rối loạn chức năng cơ quan.",
  },
};
/* ACE Hình 3 – tiêu chí nặng khác ngoài bệnh cảnh toàn thân */
export const ACE_SEVERE: Record<"impetigo" | "purulent" | "cellulitis", string> = {
  impetigo: "không đáp ứng điều trị đầu tay; lan rộng (nhiều tổn thương); chốc bọng nước; viêm mô bào xung quanh; tổn thương sâu hoặc rộng; tiến triển nhanh",
  purulent: "không đáp ứng điều trị đầu tay hoặc chỉ can thiệp ngoại khoa; viêm mô bào xung quanh; lan rộng (nhiều tổn thương hoặc nhiều ổ áp xe); tổn thương sâu hoặc rộng; tiến triển nhanh",
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
  { id: "animal", label: "Động vật (chó, mèo)" },
  { id: "human", label: "Người" },
];

/* ACE Hình 2 – dấu hiệu cần chuyển cấp cứu ngay */
export const RED_FLAGS = "Chuyển cấp cứu ngay khi: gợi ý nhiễm khuẩn hoại tử (đau không tương xứng với thăm khám, da sẫm màu, bọng nước); gợi ý nhiễm khuẩn huyết (mạch nhanh, tụt huyết áp); nhiễm trùng bàn chân đái tháo đường mức vừa hoặc nặng; suy giảm miễn dịch nặng (ACE).";
/* ACE Hình 3 – cân nhắc chuyển tuyến */
export const REFERRAL: string[] = [
  "Nghi tác nhân không điển hình (ví dụ tiếp xúc nước biển: Vibrio; nước ngọt: Aeromonas; đất: Burkholderia pseudomallei).",
  "Viêm mô bào ở bàn tay hoặc trên khớp, nhất là khi nghi nhiễm khuẩn sâu (viêm xương tủy, viêm khớp nhiễm khuẩn).",
  "Nhiễm khuẩn vùng mặt: viêm mô bào hốc mắt, vùng “tam giác nguy hiểm” (giới hạn bởi hai khóe miệng và sống mũi).",
  "Áp xe quanh hậu môn; nhiễm khuẩn mảnh ghép, vật liệu nhân tạo hoặc vết mổ.",
  "Viêm bạch mạch, nhất là khi kèm triệu chứng hoặc dấu hiệu nhiễm khuẩn nặng khác.",
  "Suy giảm miễn dịch hoặc đang dùng thuốc ức chế miễn dịch.",
  "Trẻ < 12 tháng: ngưỡng chuyển tuyến thấp; sơ sinh < 1 tháng: bác sĩ nhi khoa hoặc chuyên khoa tuyến cuối đánh giá.",
  "MRSA: nhiễm khuẩn không biến chứng có thể điều trị ở tuyến ban đầu, chọn kháng sinh theo cấy và kháng sinh đồ khi có thể; chuyển tuyến khi có biến chứng, dấu hiệu toàn thân, bệnh nền đáng kể hoặc không đáp ứng sau một đợt điều trị đủ.",
];
export const SYSTEMIC = "Dấu hiệu toàn thân (ACE): hội chứng đáp ứng viêm toàn thân, ví dụ nhiệt độ > 38 °C hoặc < 36 °C, thở nhanh > 20 lần/phút, mạch nhanh > 100 lần/phút, tụt huyết áp hoặc viêm bạch mạch.";
/* IDSA KC 6, Hình 1 – đã áp dụng đính chính 2015 (bạch cầu < 4000/µL) */
export const SIRS_IDSA = "SIRS (IDSA, đính chính 2015): nhiệt độ > 38 °C hoặc < 36 °C, thở nhanh > 24 lần/phút, mạch nhanh > 90 lần/phút, hoặc bạch cầu > 12 000 hoặc < 4000/µL.";

/* ===================== ACE 2026 – Supplement 2 ===================== */
const S1 = "ACE Suppl. 2, Bảng 1";
const S2 = "ACE Suppl. 2, Bảng 2";
const S3 = "ACE Suppl. 2, Bảng 3";

function aceTopical(age: Age): RxItem[] {
  return [
    r("Ưu tiên", "Acid fusidic (kem, thuốc mỡ)", "Bôi lên vùng tổn thương 2–3 lần/ngày", undefined, S1),
    r("Ưu tiên", "Mupirocin (thuốc mỡ) – cân nhắc dành cho nhiễm MRSA", age === "child" ? "Bôi lên vùng tổn thương 2–3 lần/ngày. Tờ hướng dẫn sử dụng tại Singapore: chưa nghiên cứu ở trẻ < 1 tuổi" : "Bôi lên vùng tổn thương 2–3 lần/ngày", undefined, S1),
    r("Thay thế", "Gentamicin (kem) – khi lựa chọn ưu tiên không phù hợp hoặc không có", "Bôi lên vùng tổn thương 1 lần hoặc nhiều lần/ngày", undefined, S1),
  ];
}
const ACE_ORAL: { role: string; drug: string; d: D; al?: "std" | "alt" }[] = [
  { role: "Đầu tay", drug: "Cefalexin", al: "std", d: { a: "500 mg uống 4 lần/ngày (viên nang, hỗn dịch)", c: "25–50 mg/kg/ngày chia 3–4 lần; nhiễm khuẩn nặng có thể tăng 50–100 mg/kg/ngày (tối đa 500 mg/lần, 4 g/ngày)" } },
  { role: "Đầu tay", drug: "Cloxacilin", al: "std", d: { a: "250–500 mg uống 4 lần/ngày (viên nang, hỗn dịch)", c: "Đến 20 kg: 50–100 mg/kg/ngày chia 4 lần; từ 20 kg: liều người lớn. Thực hành hiện nay: tối đa 500 mg/lần" } },
  { role: "Thay thế", drug: "Amoxicilin-acid clavulanic", al: "std", d: { a: "Viên 500 mg/125 mg × 2–3 lần/ngày, hoặc viên 875 mg/125 mg × 2 lần/ngày", c: "Hỗn dịch 400 mg/57 mg (trẻ ≥ 2 tháng): 25 mg/3,6 mg/kg/ngày (nặng: 45 mg/6,4 mg/kg/ngày) chia 2–3 lần; tối đa 500 mg amoxicilin/lần nếu dùng mỗi 8 giờ, 875 mg amoxicilin/lần nếu dùng mỗi 12 giờ. Hỗn dịch 250 mg/62,5 mg (liều theo MIMS): < 40 kg: 20 mg/5 mg đến 45 mg/11,25 mg/kg/ngày chia 3 lần (tối đa 500 mg amoxicilin/lần); ≥ 40 kg: 500 mg/125 mg × 3 lần/ngày" } },
  { role: "Dị ứng penicilin", drug: "Clindamycin", al: "alt", d: { a: "Viên nang 450–600 mg uống 3 lần/ngày", c: "Trẻ > 1 tháng: 20–25 mg/kg/ngày chia 3–4 lần đều nhau (tối đa 450 mg/lần)" } },
];
function aceOral(age: Age): RxItem[] {
  return ACE_ORAL.map((x) => r(x.role, x.drug, pick(x.d, age), undefined, S2, x.al));
}
function aceOralNotes(age: Age): string[] {
  const n = ["ACE: cefalexin, cloxacilin được ưu tiên vì phổ hẹp; cefalexin có thể không hiệu quả trong điều trị áp xe da."];
  if (age === "adult") {
    n.push("ACE: liều cefalexin 500 mg × 4 lần/ngày theo UpToDate; tờ hướng dẫn tại Singapore ghi liều thường dùng 250 mg × 4 lần/ngày hoặc 500 mg × 2 lần/ngày, có thể cần liều cao hơn khi nhiễm khuẩn nặng.");
    n.push("ACE: clindamycin uống – tờ hướng dẫn tại Singapore ghi 600–1800 mg/ngày; mức 450–600 mg × 3 lần/ngày theo kinh nghiệm chuyên gia, nằm trong khoảng này.");
    n.push("ACE: người lớn khó nuốt – ưu tiên nghiền viên amoxicilin-acid clavulanic; nếu dùng hỗn dịch, bảo đảm liều amoxicilin và acid clavulanic tương đương dạng viên.");
  } else {
    n.push("ACE: liều cloxacilin trẻ em theo tờ hướng dẫn tại Singapore; UpToDate: 5 đến < 40 kg – 50 mg/kg/ngày chia mỗi 6 giờ; ≥ 40 kg – 250–500 mg mỗi 6 giờ.");
    n.push("ACE: thực hành hiện nay thường dùng clindamycin uống 30–40 mg/kg/ngày cho trẻ em.");
  }
  return n;
}
const ACE_IV: { role: string; drug: string; d: D; al?: "std" | "alt" }[] = [
  { role: "Đầu tay", drug: "Cefazolin – ưu tiên vì phổ hẹp hơn", al: "std", d: { a: "3–6 g/ngày chia 3 lần, tùy mức độ nặng", c: "Trẻ > 1 tháng: 50–100 mg/kg/ngày chia 3–4 lần; nhiễm khuẩn nặng (UpToDate) đến 150 mg/kg/ngày (tối đa 2000 mg/lần)" } },
  { role: "Đầu tay", drug: "Ceftriaxon", al: "std", d: { a: "1–2 g × 1 lần/ngày", c: "15 ngày – 12 tuổi: 50–80 mg/kg × 1 lần/ngày (tối đa 2000 mg/ngày); ≥ 50 kg hoặc > 12 tuổi: liều người lớn" } },
  { role: "Đầu tay", drug: "Amoxicilin-acid clavulanic", al: "std", d: { a: "1000 mg/200 mg mỗi 8 giờ hoặc mỗi 6 giờ", c: "Dạng 1000 mg/200 mg, 3 tháng – 12 tuổi: 75 mg/15 mg – 100 mg/20 mg/kg/ngày chia 3–4 lần; > 12 tuổi: liều người lớn" } },
  { role: "Dị ứng penicilin", drug: "Clindamycin", al: "alt", d: { a: "600 mg mỗi 8 giờ đến mỗi 6 giờ (1800–2400 mg/ngày)", c: "Trẻ > 1 tháng: 20–40 mg/kg/ngày chia 3–4 lần đều nhau (tối đa 600 mg/lần)" } },
];
function aceIv(age: Age): RxItem[] {
  return ACE_IV.map((x) => r(x.role, x.drug, pick(x.d, age), undefined, S3, x.al));
}
function aceIvNotes(age: Age): string[] {
  if (age === "child") return [];
  return [
    "ACE: cefazolin – tờ hướng dẫn tại Singapore ghi 500 mg–1 g × 3–4 lần/ngày cho nhiễm khuẩn vừa – nặng và nặng, 1–1,5 g × 4 lần/ngày cho nhiễm khuẩn nặng đe dọa tính mạng; Sanford Guide và UpToDate: 1–2 g mỗi 8 giờ.",
    "ACE: amoxicilin-acid clavulanic tĩnh mạch mỗi 6 giờ có thể cần cho người bệnh mà cân nặng ảnh hưởng dược lực học kháng sinh (ví dụ béo phì).",
  ];
}

/* ===================== IDSA 2014 – Bảng 2 ===================== */
const T2 = "IDSA Bảng 2";
const MRSA: Record<string, D> = {
  vanco: { a: "30 mg/kg/ngày chia 2 lần, TM", c: "40 mg/kg/ngày chia 4 lần, TM" },
  linezolid: { a: "600 mg mỗi 12 giờ TM hoặc 600 mg uống 2 lần/ngày", c: "Trẻ < 12 tuổi: 10 mg/kg mỗi 12 giờ, TM hoặc uống" },
  clinda: { a: "600 mg mỗi 8 giờ TM, hoặc 300–450 mg uống 4 lần/ngày", c: "25–40 mg/kg/ngày chia 3 lần TM, hoặc 30–40 mg/kg/ngày chia 3 lần uống" },
  dapto: { a: "4 mg/kg mỗi 24 giờ, TM" },
  ceftaroline: { a: "600 mg 2 lần/ngày, TM" },
  doxy: { a: "100 mg uống 2 lần/ngày", c: "Không khuyến cáo cho trẻ < 8 tuổi" },
  smx: { a: "1–2 viên hàm lượng gấp đôi (160/800 mg) uống 2 lần/ngày", c: "8–12 mg/kg/ngày (tính theo trimethoprim) chia 4 lần TM hoặc chia 2 lần uống" },
};
const MSSA: Record<string, D> = {
  nafcillin: { a: "1–2 g mỗi 4 giờ, TM", c: "100–150 mg/kg/ngày chia 4 lần" },
  cefazolin: { a: "1 g mỗi 8 giờ, TM", c: "50 mg/kg/ngày chia 3 lần" },
  clinda: { a: "600 mg mỗi 8 giờ TM, hoặc 300–450 mg uống 4 lần/ngày", c: "25–40 mg/kg/ngày chia 3 lần TM, hoặc 25–30 mg/kg/ngày chia 3 lần uống" },
  dicloxacillin: { a: "500 mg uống 4 lần/ngày", c: "25–50 mg/kg/ngày chia 4 lần, uống" },
  cephalexin: { a: "500 mg uống 4 lần/ngày", c: "25–50 mg/kg/ngày chia 4 lần, uống" },
};
const mrsaRow = (role: string, drug: string, k: keyof typeof MRSA, age: Age, al?: "std" | "alt") => r(role, drug, pick(MRSA[k], age), undefined, `${T2} – MRSA`, al);
const mssaRow = (role: string, drug: string, k: keyof typeof MSSA, age: Age, al?: "std" | "alt") => r(role, drug, pick(MSSA[k], age), undefined, `${T2} – MSSA`, al);

function mrsaIvSet(age: Age, role: string): RxItem[] {
  const out = [mrsaRow(role, "Vancomycin", "vanco", age), mrsaRow(role, "Linezolid", "linezolid", age)];
  if (age === "adult") out.push(mrsaRow(role, "Daptomycin", "dapto", age));
  out.push(mrsaRow(role, "Ceftarolin", "ceftaroline", age));
  return out;
}
const VANCO_TDM = "Theo dõi điều trị vancomycin: theo hướng dẫn đồng thuận ASHP/IDSA/PIDS/SIDP 2020 (mục TDM của ứng dụng).";

/* ===================== Chốc, chốc loét, viêm nang lông ===================== */
function impetigo(i: SstiIn, aceSev: boolean): SstiOut {
  const blocks: SstiBlock[] = [];
  const notes: string[] = [];
  const oral = aceSev || i.impSub === "ecthyma";
  if (!oral) {
    blocks.push({
      title: "ACE 2026 – kháng sinh bôi đơn trị",
      lead: "Nhiễm khuẩn khu trú, nhẹ: kháng sinh bôi, thường 5–7 ngày. Không đáp ứng: chuyển kháng sinh uống đơn trị; vẫn không cải thiện: chuyển làm thêm xét nghiệm.",
      items: aceTopical(i.age),
    });
    notes.push("ACE: dùng kháng sinh bôi thường xuyên, kéo dài làm xuất hiện vi khuẩn kháng thuốc.");
  } else {
    blocks.push({
      title: "ACE 2026 – kháng sinh uống đơn trị",
      lead: i.impSub === "ecthyma" ? "Chốc loét (nhiễm khuẩn sâu có thể tới trung bì): kháng sinh toàn thân; thường 5–7 ngày." : "Nhiễm khuẩn nặng: kháng sinh uống đơn trị; thường 5–7 ngày, kéo dài theo đánh giá lâm sàng.",
      items: aceOral(i.age),
    });
    notes.push(...aceOralNotes(i.age));
    notes.push("ACE: có bọng nước – thuốc bôi có thể không đạt tới vùng tổn thương.");
  }
  if (i.impSub !== "folliculitis") {
    const items: RxItem[] = [
      r("Xét nghiệm", "Nhuộm Gram, cấy mủ hoặc dịch tiết tổn thương để xác định S. aureus và/hoặc liên cầu tan huyết beta", undefined, "S-M", "IDSA KC 1"),
      r("Ca điển hình", "Điều trị không cần các xét nghiệm trên là hợp lý", undefined, "S-M", "IDSA KC 1"),
      r("Chọn đường dùng", "Uống khi nhiều tổn thương hoặc dịch ảnh hưởng nhiều người (giảm lây truyền); chốc loét: kháng sinh uống", undefined, undefined, "IDSA KC 2"),
    ];
    if (i.impSub === "impetigo") items.push(r("Thuốc bôi", "Mupirocin hoặc retapamulin bôi 2 lần/ngày × 5 ngày (chốc bọng nước và không bọng nước)", undefined, "S-H", "IDSA KC 2a"));
    items.push(
      r("Thuốc uống", "Đợt 7 ngày, thuốc có tác dụng trên S. aureus; cấy chỉ ra liên cầu đơn thuần: penicilin uống", undefined, "S-H", "IDSA KC 2b"),
      r("Thuốc uống", "S. aureus thường nhạy methicilin: dicloxacilin hoặc cephalexin. Nghi ngờ hoặc xác định MRSA: doxycyclin, clindamycin hoặc sulfamethoxazol-trimethoprim", undefined, "S-M", "IDSA KC 2b"),
      r("Dịch viêm cầu thận", "Dùng kháng sinh toàn thân trong đợt bùng phát viêm cầu thận sau nhiễm liên cầu, để loại trừ chủng S. pyogenes gây viêm thận khỏi cộng đồng", undefined, "S-M", "IDSA KC 2c"),
    );
    blocks.push({ title: "IDSA 2014 – khuyến cáo", items });

    const dose: RxItem[] = [];
    if (i.impSub === "impetigo") {
      dose.push(r("Bôi – ít tổn thương", "Retapamulin (thuốc mỡ)", "Bôi lên tổn thương 2 lần/ngày", undefined, T2));
      dose.push(r("Bôi – ít tổn thương", "Mupirocin (thuốc mỡ)", "Bôi lên tổn thương 3 lần/ngày", undefined, `${T2} (đính chính 2015)`));
    }
    if (i.age === "adult") dose.push(r("Uống", "Dicloxacilin", "250 mg uống 4 lần/ngày", undefined, T2, "std"));
    dose.push(
      r("Uống", "Cephalexin", i.age === "adult" ? "250 mg uống 4 lần/ngày" : "25–50 mg/kg/ngày chia 3–4 lần, uống", undefined, T2, "std"),
      r("Uống", "Erythromycin – một số chủng S. aureus, S. pyogenes có thể kháng", i.age === "adult" ? "250 mg uống 4 lần/ngày (erythromycin ethylsuccinat: 400 mg uống 4 lần/ngày)" : "40 mg/kg/ngày chia 3–4 lần, uống", undefined, T2),
      r("Uống", "Clindamycin", i.age === "adult" ? "300–400 mg uống 4 lần/ngày" : "20 mg/kg/ngày chia 3 lần, uống", undefined, T2),
      r("Uống", "Amoxicilin-acid clavulanic", i.age === "adult" ? "875/125 mg uống 2 lần/ngày" : "25 mg/kg/ngày (tính theo amoxicilin) chia 2 lần, uống", undefined, T2, "std"),
    );
    if (i.age === "adult") dose.push(r("Liên cầu đơn thuần", "Penicilin V", "250–500 mg uống mỗi 6 giờ", undefined, `${T2} – liên cầu`, "std"));
    if (i.mrsa || i.pcnAllergy) {
      const role = i.mrsa ? "MRSA" : "Dị ứng penicilin";
      dose.push(mrsaRow(role, "Doxycyclin", "doxy", i.age, i.mrsa ? undefined : "alt"), mrsaRow(role, "Sulfamethoxazol-trimethoprim", "smx", i.age, i.mrsa ? undefined : "alt"));
    }
    if (i.impSub === "impetigo") notes.push("IDSA: bản đính chính 2015 (Clin Infect Dis 2015;60(9):1448) sửa Bảng 2 – mupirocin bôi 3 lần/ngày thay cho 2 lần/ngày.");
    blocks.push({ title: "IDSA 2014 – liều (Bảng 2)", lead: "Thời gian điều trị 7 ngày, tùy đáp ứng lâm sàng (Bảng 2, chú thích b).", items: dose });
    if (i.pcnAllergy) notes.push("IDSA: dị ứng penicilin hoặc nhiễm MRSA – doxycyclin, clindamycin hoặc sulfamethoxazol-trimethoprim; liên cầu đơn thuần ở người dị ứng penicilin – macrolid hoặc clindamycin.");
  }
  const headline = oral ? "Kháng sinh uống đơn trị, phủ S. aureus và liên cầu" : "Kháng sinh bôi đơn trị, 5–7 ngày";
  return { headline, blocks, avoid: [], notes };
}

/* ===================== Nhọt, cụm nhọt, áp xe da ===================== */
function purulent(i: SstiIn, aceSev: boolean): SstiOut {
  const blocks: SstiBlock[] = [];
  const notes: string[] = [];
  const ace: RxItem[] = [
    r("Can thiệp ngoại khoa", "Đánh giá từng ca. Nhẹ: kiểm soát ổ nhiễm ít xâm lấn (lấy dị vật, rửa bằng dung dịch sát khuẩn). Tổn thương lớn: rạch dẫn lưu hoặc can thiệp ngoại khoa khác", undefined, undefined, "ACE KC 4"),
    r("Mức can thiệp", "Áp xe da không biến chứng: rạch dẫn lưu thường là đủ; nhiễm khuẩn nặng: có thể cần cắt lọc ngoại khoa", undefined, undefined, "ACE KC 4"),
  ];
  if (!aceSev) {
    ace.push(
      r("Kháng sinh", "Không dùng kháng sinh; điều trị hỗ trợ (chườm ấm)", undefined, undefined, "ACE KC 4"),
      r("Hẹn tái khám", "Quay lại nếu không khỏi hoặc có dấu hiệu nặng lên; không cấp sẵn kháng sinh “để dự phòng”", undefined, undefined, "ACE tr. 6"),
      r("Ngoại lệ", "Không can thiệp ngoại khoa được (nhọt mạn tính, nhiều áp xe ở người suy giảm miễn dịch, áp xe giai đoạn sớm, trẻ em): kháng sinh có thể có lợi kể cả khi nhẹ", undefined, undefined, "ACE KC 4"),
    );
    blocks.push({ title: "ACE 2026 – can thiệp ngoại khoa, chưa cần kháng sinh", items: ace });
  } else if (i.culture === "mrsa") {
    blocks.push({ title: "ACE 2026 – can thiệp ngoại khoa", items: ace });
    notes.push("ACE: MRSA không biến chứng có thể điều trị ở tuyến ban đầu, chọn kháng sinh theo kết quả cấy và kháng sinh đồ; chuyển tuyến khi có biến chứng, dấu hiệu toàn thân, bệnh nền đáng kể hoặc không đáp ứng.");
  } else {
    blocks.push({ title: "ACE 2026 – can thiệp ngoại khoa", items: ace });
    blocks.push({
      title: "ACE 2026 – kháng sinh uống đơn trị",
      lead: "Dành cho nhiễm khuẩn nặng; thường 7–10 ngày, kéo dài theo đánh giá lâm sàng. Không cải thiện với kháng sinh uống: có thể cần kháng sinh tĩnh mạch.",
      items: aceOral(i.age),
    });
    notes.push(...aceOralNotes(i.age));
  }

  blocks.push({
    title: "IDSA 2014 – khuyến cáo",
    items: [
      r("Xét nghiệm", "Nhuộm Gram, cấy mủ cụm nhọt và áp xe; điều trị không cần xét nghiệm là hợp lý ở ca điển hình", undefined, "S-M", "IDSA KC 3"),
      r("Nang thượng bì viêm", "Không nhuộm Gram, không cấy mủ", undefined, "S-M", "IDSA KC 4"),
      r("Rạch dẫn lưu", "Điều trị khuyến cáo cho nang thượng bì viêm, cụm nhọt, áp xe và nhọt lớn", undefined, "S-H", "IDSA KC 5"),
      r("Kháng sinh kèm dẫn lưu", "Quyết định dùng kháng sinh nhắm S. aureus dựa trên có hay không có hội chứng đáp ứng viêm toàn thân (SIRS): nhiệt độ > 38 °C hoặc < 36 °C, thở > 24 lần/phút, mạch > 90 lần/phút, bạch cầu > 12 000 hoặc < 4000/µL", undefined, "S-L", "IDSA KC 6"),
      r("Kháng sinh phủ MRSA", "Cụm nhọt hoặc áp xe ở người suy giảm sức đề kháng rõ, hoặc có SIRS", undefined, "S-L", "IDSA KC 6, tr. e22"),
    ],
  });

  const fig: RxItem[] = [];
  let figTitle = "IDSA 2014 – xử trí theo mức độ (Hình 1)";
  if (i.sev === "mild") {
    fig.push(r("Nhẹ", "Rạch dẫn lưu", undefined, undefined, "IDSA Hình 1"));
  } else if (i.sev === "moderate") {
    fig.push(r("Vừa", "Rạch dẫn lưu; cấy và làm kháng sinh đồ", undefined, undefined, "IDSA Hình 1"));
    if (i.culture === "none") {
      figTitle += " – kinh nghiệm";
      fig.push(mrsaRow("Kinh nghiệm", "Sulfamethoxazol-trimethoprim", "smx", i.age), mrsaRow("Kinh nghiệm", "Doxycyclin", "doxy", i.age));
    } else if (i.culture === "mrsa") {
      fig.push(mrsaRow("MRSA", "Sulfamethoxazol-trimethoprim", "smx", i.age));
    } else {
      fig.push(mssaRow("MSSA", "Dicloxacilin", "dicloxacillin", i.age, "std"), mssaRow("MSSA", "Cephalexin", "cephalexin", i.age));
      if (i.pcnAllergy) notes.push("IDSA Bảng 2: cephalexin, cefazolin dùng được cho người dị ứng penicilin, trừ người có phản ứng quá mẫn tức thì.");
    }
  } else {
    fig.push(r("Nặng", "Rạch dẫn lưu; cấy và làm kháng sinh đồ", undefined, undefined, "IDSA Hình 1"));
    if (i.culture === "mssa") {
      fig.push(mssaRow("MSSA", "Nafcilin hoặc oxacilin", "nafcillin", i.age, "std"), mssaRow("MSSA", "Cefazolin", "cefazolin", i.age), mssaRow("MSSA", "Clindamycin", "clinda", i.age));
      if (i.pcnAllergy) notes.push("IDSA Bảng 2: cefazolin dùng được cho người dị ứng penicilin, trừ người có phản ứng quá mẫn tức thì.");
    } else {
      fig.push(...mrsaIvSet(i.age, i.culture === "mrsa" ? "MRSA" : "Kinh nghiệm"));
      notes.push(VANCO_TDM);
    }
    if (i.age === "child") notes.push("IDSA Hình 1: daptomycin, telavancin chưa được phép dùng cho trẻ em – khuyến cáo vancomycin; có thể dùng clindamycin nếu tỷ lệ kháng clindamycin tại cơ sở < 10–15%.");
  }
  blocks.push({ title: figTitle, items: fig });

  if (i.recurrent) {
    blocks.push({
      title: "Áp xe tái phát (IDSA 2014)",
      items: [
        r("Tìm nguyên nhân", "Áp xe tái phát tại vị trí cũ: tìm nguyên nhân tại chỗ (nang lông, viêm tuyến mồ hôi mủ, dị vật)", undefined, "S-M", "IDSA KC 7"),
        r("Dẫn lưu, cấy", "Dẫn lưu và cấy sớm trong đợt nhiễm khuẩn", undefined, "S-M", "IDSA KC 8"),
        r("Kháng sinh", "Sau khi lấy mẫu cấy: 5–10 ngày kháng sinh có tác dụng trên tác nhân phân lập được", undefined, "W-L", "IDSA KC 9"),
        r("Khử khuẩn", "Nhiễm S. aureus tái phát: cân nhắc 5 ngày mupirocin bôi mũi 2 lần/ngày, tắm chlorhexidin hằng ngày, khử khuẩn hằng ngày đồ dùng cá nhân (khăn, ga trải giường, quần áo)", undefined, "W-L", "IDSA KC 10"),
        r("Người lớn", "Đánh giá rối loạn bạch cầu trung tính nếu áp xe tái phát bắt đầu từ nhỏ", undefined, "S-M", "IDSA KC 11"),
      ],
    });
  }
  const avoid = [r("Chưa có bằng chứng", "Kháng sinh bôi để điều trị nhọt, cụm nhọt, áp xe da", undefined, undefined, "ACE KC 4")];
  const headline = i.sev === "mild" && !aceSev ? "Rạch dẫn lưu hoặc kiểm soát ổ nhiễm; chưa cần kháng sinh" : "Rạch dẫn lưu, cấy mủ; kháng sinh theo mức độ";
  return { headline, blocks, avoid, notes };
}

/* ===================== Viêm mô bào, viêm quầng ===================== */
function cellulitis(i: SstiIn, aceSev: boolean): SstiOut {
  const blocks: SstiBlock[] = [];
  const notes: string[] = [];
  if (!aceSev) {
    blocks.push({ title: "ACE 2026 – kháng sinh uống đơn trị", lead: "Nhiễm khuẩn nhẹ: kháng sinh uống, thường 5–7 ngày, kéo dài theo đánh giá lâm sàng. Không cải thiện với kháng sinh uống: có thể cần kháng sinh tĩnh mạch.", items: aceOral(i.age) });
    notes.push(...aceOralNotes(i.age));
  } else {
    blocks.push({ title: "ACE 2026 – kháng sinh tĩnh mạch đơn trị", lead: "Dành đường tĩnh mạch cho nhiễm khuẩn nặng, người không dung nạp đường uống, hoặc khi đường uống có thể không đạt nồng độ mô đủ; thường 5–7 ngày.", items: aceIv(i.age) });
    notes.push(...aceIvNotes(i.age));
    notes.push("ACE: kháng sinh tiêm bắp không phải lựa chọn đầu tay; cân nhắc khi người bệnh không dung nạp đường uống và không muốn nhập viện để dùng đường tĩnh mạch.");
  }
  notes.push("ACE: ban đỏ có thể chưa hết hoàn toàn khi kết thúc đợt kháng sinh.");
  notes.push("ACE: nâng cao vùng tổn thương để giảm phù. NSAID có thể cân nhắc từng ca như điều trị hỗ trợ giảm viêm, sau khi đã loại trừ nhiễm khuẩn hoại tử (NSAID có thể che lấp). Chưa đủ bằng chứng dùng corticoid hỗ trợ.");

  blocks.push({
    title: "IDSA 2014 – khuyến cáo",
    items: [
      r("Cấy", "Không cấy máu, dịch hút, sinh thiết hoặc tăm bông thường quy", undefined, "S-M", "IDSA KC 12"),
      r("Cấy máu", "Ung thư đang hóa trị, giảm bạch cầu trung tính, suy giảm miễn dịch tế bào nặng, tổn thương do ngâm nước, vết cắn động vật", undefined, "S-M", "IDSA KC 13"),
      r("Cấy, soi tại chỗ", "Cùng nhóm người bệnh trên: cân nhắc cấy và soi dịch hút, mảnh sinh thiết hoặc tăm bông", undefined, "W-M", "IDSA KC 13"),
      r("Nhẹ", "Viêm mô bào điển hình, không có dấu hiệu toàn thân: thuốc có tác dụng trên liên cầu", undefined, "S-M", "IDSA KC 14"),
      r("Vừa", "Có dấu hiệu toàn thân: kháng sinh toàn thân; nhiều bác sĩ có thể phủ thêm MSSA", undefined, "W-L", "IDSA KC 14"),
      r("Nguy cơ MRSA", "Chấn thương xuyên, bằng chứng nhiễm MRSA nơi khác, mang MRSA ở mũi, tiêm chích ma túy, chảy mủ hoặc SIRS: vancomycin hoặc thuốc khác có tác dụng trên cả MRSA và liên cầu", undefined, "S-M", "IDSA KC 14, tr. e23"),
      r("Suy giảm miễn dịch nặng", "Có thể cân nhắc kháng sinh phổ rộng", undefined, "W-M", "IDSA KC 14"),
      r("Nặng", "Vancomycin + piperacilin-tazobactam hoặc imipenem/meropenem là phác đồ kinh nghiệm hợp lý", undefined, "S-M", "IDSA KC 14"),
      r("Thời gian", "5 ngày; kéo dài nếu chưa cải thiện trong thời gian này", undefined, "S-H", "IDSA KC 15"),
      r("Hỗ trợ", "Nâng cao vùng tổn thương; điều trị yếu tố thuận lợi (phù, bệnh da nền)", undefined, "S-M", "IDSA KC 16"),
      r("Chi dưới", "Khám kỹ kẽ ngón chân; điều trị nứt, bong vảy, loét kẽ giúp giảm tái phát", undefined, "S-M", "IDSA KC 17"),
      r("Ngoại trú", "Không có SIRS, rối loạn ý thức, huyết động không ổn định", undefined, "S-M", "IDSA KC 18"),
      r("Nhập viện", "Nghi nhiễm khuẩn sâu hoặc hoại tử, kém tuân thủ, suy giảm miễn dịch nặng, thất bại điều trị ngoại trú", undefined, "S-M", "IDSA KC 18"),
      ...(i.age === "adult" ? [r("Corticoid", "Người lớn không đái tháo đường: có thể cân nhắc corticoid toàn thân (ví dụ prednison 40 mg/ngày × 7 ngày)", undefined, "W-M", "IDSA KC 19")] : []),
    ],
  });

  const fig: RxItem[] = [];
  const ref = `${T2} – liên cầu`;
  if (i.sev === "mild") {
    if (i.age === "adult") fig.push(r("Uống", "Penicilin V", "250–500 mg uống mỗi 6 giờ", undefined, ref, "std"));
    fig.push(
      r("Uống", "Cephalexin", i.age === "adult" ? "500 mg uống mỗi 6 giờ" : pick(MSSA.cephalexin, i.age), undefined, ref),
      mssaRow("Uống", "Dicloxacilin", "dicloxacillin", i.age, "std"),
      r("Uống", "Clindamycin", i.age === "adult" ? "300–450 mg uống 4 lần/ngày" : "25–30 mg/kg/ngày chia 3 lần, uống", undefined, `${T2} – MSSA`),
    );
  } else if (i.sev === "moderate") {
    fig.push(
      r("Tĩnh mạch", "Penicilin", i.age === "adult" ? "2–4 triệu đơn vị mỗi 4–6 giờ, TM" : "60 000–100 000 đơn vị/kg/lần mỗi 6 giờ", undefined, ref, "std"),
      r("Tĩnh mạch", "Ceftriaxon", undefined, undefined, "IDSA Hình 1"),
      r("Tĩnh mạch", "Cefazolin", i.age === "adult" ? "1 g mỗi 8 giờ, TM" : "33 mg/kg/lần mỗi 8 giờ, TM", undefined, ref),
      r("Tĩnh mạch", "Clindamycin", i.age === "adult" ? "600–900 mg mỗi 8 giờ, TM" : "10–13 mg/kg/lần mỗi 8 giờ, TM", undefined, ref),
    );
  } else {
    fig.push(
      r("Ngoại khoa", "Thăm dò, cắt lọc ngoại khoa cấp cứu; loại trừ nhiễm khuẩn hoại tử", undefined, undefined, "IDSA Hình 1"),
      r("Kinh nghiệm", "Vancomycin + piperacilin-tazobactam", i.age === "adult" ? `Vancomycin ${MRSA.vanco.a}` : `Vancomycin ${MRSA.vanco.c}`, undefined, "IDSA Hình 1; Bảng 2", "std"),
    );
    notes.push(VANCO_TDM);
  }
  if (i.sev !== "severe" && i.mrsa) {
    fig.push(...mrsaIvSet(i.age, "Nguy cơ MRSA"), mrsaRow("Nguy cơ MRSA", "Clindamycin", "clinda", i.age), mrsaRow("Nguy cơ MRSA", "Doxycyclin", "doxy", i.age), mrsaRow("Nguy cơ MRSA", "Sulfamethoxazol-trimethoprim", "smx", i.age));
    notes.push("IDSA: muốn phủ cả liên cầu và MRSA bằng đường uống – clindamycin đơn trị, hoặc sulfamethoxazol-trimethoprim hay doxycyclin phối hợp beta-lactam (penicilin, cephalexin, amoxicilin). Hoạt tính của doxycyclin, sulfamethoxazol-trimethoprim trên liên cầu tan huyết beta chưa rõ; không có áp xe, loét hoặc chảy mủ thì khuyến cáo beta-lactam đơn trị.");
  }
  if (i.pcnAllergy) {
    fig.push(r("Dị ứng penicilin nặng", "Clindamycin, vancomycin, linezolid, daptomycin hoặc telavancin", undefined, undefined, `${T2} – viêm mô bào`, "alt"));
    notes.push("IDSA Bảng 2: tỷ lệ kháng clindamycin < 1% nhưng có thể đang tăng ở châu Á. Cephalexin, cefazolin dùng được cho người dị ứng penicilin, trừ người có phản ứng quá mẫn tức thì.");
  }
  blocks.push({ title: "IDSA 2014 – xử trí theo mức độ (Hình 1, Bảng 2)", items: fig });

  if (i.recurrent) {
    blocks.push({
      title: "Viêm mô bào tái phát",
      items: [
        r("ACE", "3–4 đợt/năm: chuyển chuyên khoa đánh giá yếu tố nguy cơ, nguyên nhân và nhu cầu kháng sinh dự phòng", undefined, undefined, "ACE KC 5"),
        r("IDSA", "Phát hiện và điều trị yếu tố thuận lợi: phù, béo phì, chàm, suy tĩnh mạch, bất thường kẽ ngón chân – thực hiện thường quy, nhất là trong giai đoạn cấp", undefined, "S-M", "IDSA KC 20"),
        r("IDSA – dự phòng", "3–4 đợt/năm dù đã kiểm soát yếu tố thuận lợi: cân nhắc penicilin hoặc erythromycin uống 2 lần/ngày trong 4–52 tuần, hoặc benzathin penicilin tiêm bắp mỗi 2–4 tuần", undefined, "W-M", "IDSA KC 21"),
        r("IDSA – thời gian", "Duy trì dự phòng chừng nào yếu tố thuận lợi còn tồn tại", undefined, "S-M", "IDSA KC 21"),
      ],
    });
  }
  const headline = aceSev ? "Kháng sinh tĩnh mạch đơn trị (ACE); nặng theo IDSA: vancomycin + piperacilin-tazobactam" : "Kháng sinh uống phủ liên cầu, 5–7 ngày";
  return { headline, blocks, avoid: [], notes };
}

/* ===================== Nhiễm khuẩn vết mổ ===================== */
function ssi(i: SstiIn): SstiOut {
  const T3 = "IDSA Bảng 3";
  const blocks: SstiBlock[] = [{
    title: "IDSA 2014 – khuyến cáo",
    items: [
      r("Ngoại khoa", "Cắt chỉ, mở và dẫn lưu vết mổ", undefined, "S-L", "IDSA KC 22"),
      r("Kháng sinh hỗ trợ", "Không thường quy; có thể có lợi khi kèm phản ứng toàn thân rõ: ban đỏ và cứng lan > 5 cm từ mép vết mổ, nhiệt độ > 38,5 °C, mạch > 110 lần/phút, hoặc bạch cầu > 12 000/µL", undefined, "W-L", "IDSA KC 23"),
      r("Đợt ngắn", "Sau mổ sạch vùng thân, đầu – cổ, chi kèm dấu hiệu nhiễm khuẩn toàn thân: chỉ định đợt kháng sinh ngắn (ví dụ 24–48 giờ)", undefined, "S-L", "IDSA KC 24; tr. e27"),
      r("Không cần kháng sinh", "Ban đỏ và cứng < 5 cm, dấu hiệu toàn thân tối thiểu (nhiệt độ < 38,5 °C, bạch cầu < 12 000/µL, mạch < 100 lần/phút)", undefined, undefined, "IDSA tr. e27"),
      r("Sốt trong 48 giờ đầu", "Khám vết mổ; nhuộm Gram dịch vết mổ tìm liên cầu, Clostridium. Có: mở vết mổ, cắt lọc, bắt đầu penicilin và clindamycin", undefined, undefined, "IDSA Hình 2"),
    ],
  }];
  const notes: string[] = [];
  const items: RxItem[] = [];
  const adult = i.age === "adult";
  if (i.site === "clean") {
    items.push(r("Khuyến cáo", "MSSA: cephalosporin thế hệ 1 hoặc penicilin kháng tụ cầu. Nguy cơ MRSA cao (mang MRSA ở mũi, tiền sử nhiễm MRSA, mới nằm viện, mới dùng kháng sinh): vancomycin, linezolid, daptomycin, telavancin hoặc ceftarolin", undefined, "S-L", "IDSA KC 25"));
    if (adult) {
      items.push(
        r("Lựa chọn", "Oxacilin hoặc nafcilin", "2 g mỗi 6 giờ, TM", undefined, T3, "std"),
        r("Lựa chọn", "Cefazolin", "0,5–1 g mỗi 8 giờ, TM", undefined, T3, "std"),
        r("Lựa chọn", "Cephalexin", "500 mg uống mỗi 6 giờ", undefined, T3, "std"),
        r(i.mrsa ? "Nguy cơ MRSA" : "Dị ứng beta-lactam type 1", "Vancomycin", "15 mg/kg mỗi 12 giờ, TM", undefined, `${T3}; Hình 2`, i.mrsa ? undefined : "alt"),
      );
      if (i.mrsa) items.push(mrsaRow("Nguy cơ MRSA", "Linezolid", "linezolid", i.age), mrsaRow("Nguy cơ MRSA", "Daptomycin", "dapto", i.age), mrsaRow("Nguy cơ MRSA", "Ceftarolin", "ceftaroline", i.age));
    }
    notes.push("IDSA Hình 2: vết mổ sạch – bắt đầu cefazolin, hoặc vancomycin (dị ứng beta-lactam type 1: phản vệ, mày đay) cho đến khi loại trừ MRSA.");
  } else if (i.site === "gi") {
    items.push(r("Khuyến cáo", "Thuốc có tác dụng trên vi khuẩn Gram âm và kỵ khí, ví dụ cephalosporin hoặc fluoroquinolon phối hợp metronidazol", undefined, "S-L", "IDSA KC 26"));
    if (adult) {
      items.push(
        r("Đơn trị", "Ticarcilin-acid clavulanic", "3,1 g mỗi 6 giờ, TM", undefined, T3, "std"),
        r("Đơn trị", "Piperacilin-tazobactam", "3,375 g mỗi 6 giờ hoặc 4,5 g mỗi 8 giờ, TM", undefined, T3, "std"),
        r("Đơn trị", "Imipenem-cilastatin", "500 mg mỗi 6 giờ, TM", undefined, T3, "std"),
        r("Đơn trị", "Meropenem", "1 g mỗi 8 giờ, TM", undefined, T3, "std"),
        r("Đơn trị", "Ertapenem", "1 g mỗi 24 giờ, TM", undefined, T3, "std"),
        r("Phối hợp", "Ceftriaxon + metronidazol", "Ceftriaxon 1 g mỗi 24 giờ + metronidazol 500 mg mỗi 8 giờ, TM", undefined, T3, "std"),
        r("Phối hợp", "Ciprofloxacin + metronidazol", "Ciprofloxacin 400 mg TM mỗi 12 giờ hoặc 500–750 mg uống mỗi 12 giờ + metronidazol 500 mg mỗi 8 giờ, TM", undefined, `${T3}; trả lời tác giả 2015`),
        r("Phối hợp", "Levofloxacin + metronidazol", "Levofloxacin 750 mg mỗi 24 giờ TM + metronidazol 500 mg mỗi 8 giờ, TM", undefined, T3),
        r("Phối hợp", "Ampicilin-sulbactam + gentamicin hoặc tobramycin", "Ampicilin-sulbactam 3 g mỗi 6 giờ + gentamicin hoặc tobramycin 5 mg/kg mỗi 24 giờ, TM", undefined, T3, "std"),
      );
    }
    if (i.mrsa) notes.push("IDSA: cơ sở có tỷ lệ MRSA đáng kể, hoặc người bệnh từng nhiễm MRSA, mang MRSA ở mũi, đã dùng kháng sinh – phác đồ ban đầu gồm vancomycin, linezolid, daptomycin, telavancin hoặc ceftarolin, cùng một trong: piperacilin-tazobactam, carbapenem, hoặc ceftriaxon + metronidazol.");
  } else {
    items.push(r("Khuyến cáo", "Thuốc có tác dụng trên vi khuẩn Gram âm và kỵ khí, ví dụ cephalosporin hoặc fluoroquinolon phối hợp metronidazol", undefined, "S-L", "IDSA KC 26"));
    if (adult) {
      items.push(
        r("Nền", "Metronidazol", "500 mg mỗi 8 giờ, TM", undefined, T3),
        r("Kèm một trong", "Ciprofloxacin", "400 mg TM mỗi 12 giờ hoặc 500–750 mg uống mỗi 12 giờ", undefined, `${T3}; trả lời tác giả 2015`),
        r("Kèm một trong", "Levofloxacin", "750 mg mỗi 24 giờ, TM hoặc uống", undefined, T3),
        r("Kèm một trong", "Ceftriaxon", "1 g mỗi 24 giờ", undefined, T3, "std"),
      );
      if (i.mrsa) items.push(r("Thêm nếu nguy cơ MRSA", "Vancomycin", "15 mg/kg mỗi 12 giờ", undefined, `${T3}, chú thích a`));
    }
  }
  blocks.push({ title: "Chọn kháng sinh theo vị trí phẫu thuật (IDSA Bảng 3)", items });
  if (!adult) notes.push("IDSA Bảng 3 chỉ có liều người lớn.");
  if (adult && i.mrsa) notes.push(VANCO_TDM);
  notes.push("ACE: nhiễm khuẩn vết mổ, mảnh ghép, vật liệu nhân tạo – cân nhắc chuyển tuyến.");
  return { headline: "Mở, dẫn lưu vết mổ; kháng sinh ngắn ngày khi có phản ứng toàn thân", blocks, avoid: [], notes };
}

/* ===================== Nhiễm khuẩn hoại tử ===================== */
function nec(i: SstiIn): SstiOut {
  const T4 = "IDSA Bảng 4";
  const a = i.age === "adult";
  const blocks: SstiBlock[] = [{
    title: "IDSA 2014 – khuyến cáo",
    items: [
      r("Ngoại khoa", "Hội chẩn ngoại khoa ngay khi nhiễm khuẩn tiến triển kèm nhiễm độc toàn thân, hoặc nghi viêm cân mạc hoại tử, hoại thư sinh hơi", undefined, "S-L", "IDSA KC 27"),
      r("Hoại thư sinh hơi", "Thăm dò và cắt lọc ngoại khoa khẩn cấp mô tổn thương", undefined, "S-M", "IDSA KC 37"),
      r("Cắt lọc lại", "Phần lớn cần quay lại phòng mổ sau 24–36 giờ và mỗi ngày sau đó cho đến khi không cần cắt lọc thêm; bù dịch tích cực", undefined, undefined, "IDSA tr. e30"),
      r("Kinh nghiệm", "Phổ rộng (căn nguyên có thể đa vi khuẩn hoặc đơn vi khuẩn – liên cầu nhóm A, MRSA cộng đồng): vancomycin hoặc linezolid + piperacilin-tazobactam, hoặc + carbapenem, hoặc + ceftriaxon và metronidazol", undefined, "S-L", "IDSA KC 28"),
      r("Hoại thư sinh hơi – kinh nghiệm", "Vancomycin + piperacilin-tazobactam, ampicilin-sulbactam hoặc carbapenem", undefined, "S-L", "IDSA KC 38"),
      r("Liên cầu nhóm A", "Penicilin + clindamycin khi xác định viêm cân mạc hoại tử do liên cầu nhóm A", undefined, "S-L", "IDSA KC 29"),
      r("Clostridium", "Penicilin + clindamycin khi xác định hoại tử cơ do Clostridium", undefined, "S-L", "IDSA KC 38"),
      r("Thời gian", "Đến khi không cần cắt lọc thêm, lâm sàng cải thiện và hết sốt 48–72 giờ", undefined, undefined, "IDSA tr. e30"),
    ],
  }];
  const notes: string[] = [];
  const items: RxItem[] = [];
  const p = i.pathogen;
  const ped = (s: string) => (a ? undefined : s);
  if (p === "empiric") {
    items.push(
      r("Phối hợp", "Piperacilin-tazobactam + vancomycin", a ? "Piperacilin-tazobactam 3,37 g mỗi 6–8 giờ TM + vancomycin 30 mg/kg/ngày chia 2 lần" : "Piperacilin-tazobactam 60–75 mg/kg/lần (tính theo piperacilin) mỗi 6 giờ TM + vancomycin 10–13 mg/kg/lần mỗi 8 giờ TM", undefined, T4, "std"),
      r("Thay piperacilin-tazobactam", "Imipenem-cilastatin", a ? "1 g mỗi 6–8 giờ, TM" : undefined, undefined, T4, "std"),
      r("Thay piperacilin-tazobactam", "Meropenem", a ? "1 g mỗi 8 giờ, TM" : "20 mg/kg/lần mỗi 8 giờ, TM", undefined, T4, "std"),
      r("Thay piperacilin-tazobactam", "Ertapenem", a ? "1 g/ngày, TM" : "Trẻ 3 tháng – 12 tuổi: 15 mg/kg/lần mỗi 12 giờ, TM", undefined, T4, "std"),
      r("Thay piperacilin-tazobactam", "Cefotaxim + metronidazol hoặc clindamycin", a ? "Cefotaxim 2 g mỗi 6 giờ TM + metronidazol 500 mg mỗi 6 giờ TM hoặc clindamycin 600–900 mg mỗi 8 giờ TM" : "Cefotaxim 50 mg/kg/lần mỗi 6 giờ TM + metronidazol 7,5 mg/kg/lần mỗi 6 giờ TM hoặc clindamycin 10–13 mg/kg/lần mỗi 8 giờ TM", undefined, T4, "std"),
      r("Dị ứng penicilin nặng", "Clindamycin hoặc metronidazol + aminoglycosid hoặc fluoroquinolon; có hoặc nghi tụ cầu: thêm thuốc phù hợp", undefined, undefined, `${T4}, chú thích a`, "alt"),
    );
    notes.push("IDSA: đa vi khuẩn – vancomycin, linezolid hoặc daptomycin phối hợp một trong: piperacilin-tazobactam; carbapenem (imipenem-cilastatin, meropenem, ertapenem); ceftriaxon + metronidazol; fluoroquinolon + metronidazol. Xác định căn nguyên thì điều chỉnh kháng sinh.");
    notes.push(VANCO_TDM);
  } else if (p === "strep") {
    items.push(
      r("Phối hợp", "Penicilin + clindamycin", a ? "Penicilin 2–4 triệu đơn vị mỗi 4–6 giờ TM + clindamycin 600–900 mg mỗi 8 giờ TM" : "Penicilin 60 000–100 000 đơn vị/kg/lần mỗi 6 giờ TM + clindamycin 10–13 mg/kg/lần mỗi 8 giờ TM", undefined, T4, "std"),
      r("Dị ứng penicilin nặng", "Vancomycin, linezolid, quinupristin/dalfopristin hoặc daptomycin", undefined, undefined, T4, "alt"),
    );
    notes.push("IDSA: clindamycin ức chế sinh độc tố và cytokin của liên cầu; thêm penicilin vì liên cầu nhóm A có thể kháng clindamycin. Chưa đủ bằng chứng để khuyến cáo immunoglobulin tĩnh mạch trong hội chứng sốc nhiễm độc do liên cầu.");
  } else if (p === "sa") {
    items.push(
      r("MSSA", "Nafcilin", a ? "1–2 g mỗi 4 giờ, TM" : "50 mg/kg/lần mỗi 6 giờ, TM", undefined, T4, "std"),
      r("MSSA", "Oxacilin", a ? "1–2 g mỗi 4 giờ, TM" : "50 mg/kg/lần mỗi 6 giờ, TM", undefined, T4, "std"),
      r("MSSA", "Cefazolin", a ? "1 g mỗi 8 giờ, TM" : "33 mg/kg/lần mỗi 8 giờ, TM", undefined, T4, "std"),
      r("Chủng kháng", "Vancomycin", a ? "30 mg/kg/ngày chia 2 lần, TM" : "15 mg/kg/lần mỗi 6 giờ, TM", undefined, T4),
      r("Lựa chọn", "Clindamycin – kìm khuẩn; có thể kháng chéo và xuất hiện kháng ở chủng kháng erythromycin; kháng cảm ứng ở MRSA", a ? "600–900 mg mỗi 8 giờ, TM" : "10–13 mg/kg/lần mỗi 8 giờ, TM", undefined, T4),
      r("Dị ứng penicilin nặng", "Vancomycin, linezolid, quinupristin/dalfopristin hoặc daptomycin", undefined, undefined, T4, "alt"),
    );
    notes.push("IDSA Bảng 4, chú thích b: có hoặc nghi MRSA – thêm vancomycin, không vượt quá liều tối đa hằng ngày của người lớn.");
    notes.push(VANCO_TDM);
  } else if (p === "clos") {
    items.push(r("Phối hợp", "Clindamycin + penicilin", a ? "Clindamycin 600–900 mg mỗi 8 giờ TM + penicilin 2–4 triệu đơn vị mỗi 4–6 giờ TM" : "Clindamycin 10–13 mg/kg/lần mỗi 8 giờ TM + penicilin 60 000–100 000 đơn vị/kg/lần mỗi 6 giờ TM", undefined, T4));
    blocks[0].items.push(r("Không khuyến cáo", "Oxy cao áp: chưa chứng minh lợi ích, có thể trì hoãn hồi sức và cắt lọc ngoại khoa", undefined, "S-L", "IDSA KC 39"));
  } else if (p === "aero") {
    items.push(r("Phối hợp", "Doxycyclin + ciprofloxacin hoặc ceftriaxon", a ? "Doxycyclin 100 mg mỗi 12 giờ TM + ciprofloxacin 400 mg mỗi 12 giờ TM hoặc ceftriaxon 1–2 g mỗi 24 giờ TM" : ped("Không khuyến cáo cho trẻ em nhưng có thể cần dùng khi đe dọa tính mạng"), undefined, `${T4} (đính chính 2015)`));
  } else {
    items.push(r("Phối hợp", "Doxycyclin + ceftriaxon hoặc cefotaxim", a ? "Doxycyclin 100 mg mỗi 12 giờ TM + ceftriaxon 1 g TM mỗi ngày hoặc cefotaxim 2 g × 3 lần/ngày TM" : ped("Không khuyến cáo cho trẻ em nhưng có thể cần dùng khi đe dọa tính mạng"), undefined, `${T4} (đính chính 2015)`));
  }
  blocks.push({ title: "Kháng sinh theo tác nhân (IDSA Bảng 4)", items });
  notes.push("IDSA: hoại thư Fournier (bìu, dương vật hoặc âm hộ) – cắt lọc ngoại khoa sớm, triệt để toàn bộ mô hoại tử, bảo tồn cấu trúc sâu khi có thể.");
  return { headline: "Phẫu thuật cấp cứu + kháng sinh phổ rộng", blocks, avoid: [], notes };
}

/* ===================== Viêm cơ mủ ===================== */
function pyo(i: SstiIn): SstiOut {
  const blocks: SstiBlock[] = [{
    title: "IDSA 2014 – khuyến cáo",
    items: [
      r("Chẩn đoán hình ảnh", "MRI là phương tiện khuyến cáo; CT và siêu âm cũng có ích", undefined, "S-M", "IDSA KC 30"),
      r("Cấy", "Cấy máu và cấy mủ ổ áp xe", undefined, "S-M", "IDSA KC 31"),
      r("Kinh nghiệm", "Vancomycin", undefined, "S-M", "IDSA KC 32"),
      r("Thêm", "Thuốc có tác dụng trên trực khuẩn Gram âm đường ruột khi suy giảm miễn dịch hoặc sau chấn thương hở vào cơ", undefined, "S-M", "IDSA KC 32"),
      r("MSSA", "Cefazolin hoặc penicilin kháng tụ cầu (nafcilin, oxacilin)", undefined, "S-M", "IDSA KC 33"),
      r("Dẫn lưu", "Dẫn lưu mủ sớm", undefined, "S-H", "IDSA KC 34"),
      r("Vi khuẩn máu kéo dài", "Chụp lại để tìm ổ nhiễm chưa dẫn lưu", undefined, "S-L", "IDSA KC 35"),
      r("Chuyển uống, thời gian", "Tĩnh mạch ban đầu; chuyển uống khi lâm sàng cải thiện, vi khuẩn máu sạch nhanh, không có viêm nội tâm mạc hoặc áp xe di bệnh. Tổng 2–3 tuần", undefined, "S-L", "IDSA KC 36"),
    ],
  }];
  const items: RxItem[] = [mrsaRow("Kinh nghiệm", "Vancomycin", "vanco", i.age), mssaRow("MSSA", "Cefazolin", "cefazolin", i.age), mssaRow("MSSA", "Nafcilin hoặc oxacilin", "nafcillin", i.age)];
  blocks.push({ title: "Liều (IDSA Bảng 2)", items });
  const notes = [VANCO_TDM];
  if (i.immuno) notes.push("IDSA: người bệnh có bệnh nền – vancomycin phối hợp một trong: piperacilin-tazobactam, ampicilin-sulbactam hoặc carbapenem.");
  return { headline: "Dẫn lưu sớm + vancomycin; MSSA: cefazolin; tổng 2–3 tuần", blocks, avoid: [], notes };
}

/* ===================== Vết cắn ===================== */
function bite(i: SstiIn): SstiOut {
  const T5 = "IDSA Bảng 5";
  const blocks: SstiBlock[] = [{
    title: "IDSA 2014 – khuyến cáo",
    items: [
      r("Dự phòng sớm", "Kháng sinh sớm 3–5 ngày khi: suy giảm miễn dịch; cắt lách; bệnh gan tiến triển; phù sẵn có hoặc phù do vết cắn; tổn thương vừa – nặng, nhất là bàn tay hoặc mặt; tổn thương có thể tới màng xương hoặc bao khớp", undefined, "S-L", "IDSA KC 40"),
      r("Dại", "Có thể cần dự phòng sau phơi nhiễm; hỏi ý kiến cơ quan y tế dự phòng địa phương", undefined, "S-L", "IDSA KC 41"),
      r("Vết cắn nhiễm khuẩn", "Thuốc có tác dụng trên cả vi khuẩn hiếu khí và kỵ khí, như amoxicilin-acid clavulanic", undefined, "S-M", "IDSA KC 42"),
      r("Uốn ván", "Tiêm giải độc tố uốn ván nếu chưa tiêm trong 10 năm; ưu tiên Tdap hơn Td nếu chưa từng tiêm Tdap", undefined, "S-L", "IDSA KC 43"),
      r("Khâu vết thương", "Không khâu kín thì đầu, trừ vết thương vùng mặt (rửa nhiều, cắt lọc thận trọng, kháng sinh sớm)", undefined, "S-L", "IDSA KC 44"),
      r("Khâu khép mép", "Các vết thương khác có thể khâu khép mép", undefined, "W-L", "IDSA KC 44"),
    ],
  }];
  const notes: string[] = ["IDSA: vết thương bẩn – tiêm nhắc giải độc tố uốn ván nếu > 5 năm từ liều cuối; vết thương sạch – nếu > 10 năm."];
  const items: RxItem[] = [];
  if (i.bite === "animal") {
    items.push(
      r("Uống", "Amoxicilin-acid clavulanic – một số trực khuẩn Gram âm kháng; không phủ MRSA", "875/125 mg uống 2 lần/ngày", undefined, T5, "std"),
      r("Tĩnh mạch", "Ampicilin-sulbactam – một số trực khuẩn Gram âm kháng; không phủ MRSA", "1,5–3,0 g mỗi 6–8 giờ, TM", undefined, T5, "std"),
      r("Tĩnh mạch", "Piperacilin-tazobactam – không phủ MRSA", "3,37 g mỗi 6–8 giờ, TM", undefined, T5, "std"),
      r("Tĩnh mạch", "Carbapenem – không phủ MRSA", undefined, undefined, T5, "std"),
      r("Uống hoặc TM", "Doxycyclin – rất tốt với Pasteurella multocida; một số liên cầu kháng", "100 mg uống 2 lần/ngày; 100 mg mỗi 12 giờ TM", undefined, T5),
      r("Uống", "Penicilin + dicloxacilin", "Penicilin 500 mg uống 4 lần/ngày + dicloxacilin 500 mg uống 4 lần/ngày", undefined, T5, "std"),
      r("Uống hoặc TM", "Sulfamethoxazol-trimethoprim – tốt với hiếu khí, kém với kỵ khí: thêm clindamycin hoặc metronidazol", "160/800 mg uống 2 lần/ngày; 5–10 mg/kg/ngày (tính theo trimethoprim) TM", undefined, T5),
      r("Phối hợp phủ kỵ khí", "Metronidazol – tốt với kỵ khí, không tác dụng trên hiếu khí", "250–500 mg uống 3 lần/ngày; 500 mg mỗi 8 giờ TM", undefined, T5),
      r("Phối hợp phủ kỵ khí", "Clindamycin – tốt với tụ cầu, liên cầu, kỵ khí; không phủ P. multocida", "300 mg uống 3 lần/ngày; 600 mg mỗi 6–8 giờ TM", undefined, T5),
      r("Cephalosporin thế hệ 2", "Cefuroxim – tốt với P. multocida; không phủ kỵ khí", "500 mg uống 2 lần/ngày; 1 g mỗi 12 giờ TM", undefined, T5, "std"),
      r("Cephalosporin thế hệ 2", "Cefoxitin", "1 g mỗi 6–8 giờ, TM", undefined, T5, "std"),
      r("Cephalosporin thế hệ 3", "Ceftriaxon", "1 g mỗi 12 giờ, TM", undefined, T5, "std"),
      r("Cephalosporin thế hệ 3", "Cefotaxim", "1–2 g mỗi 6–8 giờ, TM", undefined, T5, "std"),
      r("Fluoroquinolon", "Ciprofloxacin – tốt với P. multocida; không phủ MRSA và một số kỵ khí", "500–750 mg uống 2 lần/ngày; 400 mg mỗi 12 giờ TM", undefined, T5),
      r("Fluoroquinolon", "Levofloxacin", "750 mg/ngày, uống hoặc TM", undefined, T5),
      r("Fluoroquinolon", "Moxifloxacin – đơn trị; phủ cả kỵ khí", "400 mg/ngày, uống hoặc TM", undefined, T5),
    );
    notes.push("IDSA: cephalosporin thế hệ 2, 3 cần thêm thuốc phủ kỵ khí (clindamycin hoặc metronidazol) nếu cần; dùng sulfamethoxazol-trimethoprim hoặc levofloxacin thì thêm clindamycin hoặc metronidazol. Tránh macrolid (hoạt tính thay đổi trên P. multocida, Fusobacterium) trừ khi không có lựa chọn khác.");
  } else {
    items.push(
      r("Uống", "Amoxicilin-acid clavulanic – một số trực khuẩn Gram âm kháng; không phủ MRSA", "875/125 mg uống 2 lần/ngày", undefined, T5, "std"),
      r("Tĩnh mạch", "Ampicilin-sulbactam – một số trực khuẩn Gram âm kháng; không phủ MRSA", "1,5–3,0 g mỗi 6 giờ, TM", undefined, T5, "std"),
      r("Tĩnh mạch", "Carbapenem (ví dụ ertapenem) – không phủ MRSA", undefined, undefined, `${T5}; tr. e34`, "std"),
      r("Uống", "Doxycyclin – tốt với Eikenella, tụ cầu, kỵ khí; một số liên cầu kháng", "100 mg uống 2 lần/ngày", undefined, T5),
      r("Dị ứng beta-lactam", "Ciprofloxacin hoặc levofloxacin + metronidazol, hoặc moxifloxacin đơn trị", undefined, undefined, "IDSA tr. e34", "alt"),
    );
    notes.push("IDSA: Eikenella corrodens kháng cephalosporin thế hệ 1, macrolid, clindamycin và aminoglycosid.");
  }
  blocks.push({ title: `Lựa chọn kháng sinh – vết cắn ${i.bite === "animal" ? "động vật" : "người"} (IDSA Bảng 5)`, lead: i.infected ? "Vết cắn đã nhiễm khuẩn." : "Dự phòng sớm 3–5 ngày cho nhóm nguy cơ ở khuyến cáo 40.", items });
  if (i.bite === "animal" || i.pcnAllergy) notes.push("IDSA: thai kỳ – chống chỉ định tương đối tetracyclin và fluoroquinolon; sulfamethoxazol-trimethoprim dùng an toàn trừ 3 tháng cuối.");
  if (i.age === "child") notes.push("IDSA Bảng 5 chỉ có liều người lớn.");
  return { headline: i.infected ? "Thuốc phủ hiếu khí và kỵ khí, ví dụ amoxicilin-acid clavulanic" : "Dự phòng sớm 3–5 ngày cho nhóm nguy cơ; uốn ván, dại", blocks, avoid: [], notes };
}

/* Bảng 3, 4, 5 không có liều trẻ em -> không hiển thị liều người lớn cho trẻ em. */
function stripChildDose(o: SstiOut, i: SstiIn): SstiOut {
  if (i.age !== "child" || !(i.form === "ssi" || i.form === "bite")) return o;
  return { ...o, blocks: o.blocks.map((b) => ({ ...b, items: b.items.map((x) => ({ ...x, dose: undefined })) })) };
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
  o = stripChildDose(o, i);
  /* Di ung: an dong beta-lactam (al "std"); khong di ung: an dong chi danh cho nguoi di ung (al "alt"). */
  const keep = (x: RxItem) => (i.pcnAllergy ? x.al !== "std" : x.al !== "alt");
  o = { ...o, blocks: o.blocks.map((b) => ({ ...b, items: b.items.filter(keep) })).filter((b) => b.items.length > 0) };
  const common: string[] = [];
  if (["impetigo", "purulent", "cellulitis"].includes(i.form)) {
    if (i.highRisk && i.sev === "mild") common.push("ACE: nhiễm khuẩn nhẹ ở người nguy cơ biến chứng cao (suy giảm miễn dịch, đái tháo đường, bệnh da kèm theo) – xử trí như nhiễm khuẩn nặng.");
    common.push("ACE: chọn kháng sinh phổ hẹp nhất, đợt ngắn nhất có hiệu quả, liều phù hợp; điều chỉnh thời gian theo đáp ứng lâm sàng (giảm sưng, đau, hết sốt). Dùng một kháng sinh – phối hợp hai kháng sinh không tăng hiệu quả trong nhiễm khuẩn da – mô mềm không biến chứng.");
    common.push("ACE: tờ hướng dẫn sử dụng tại Singapore của cefalexin, clindamycin, cefazolin khuyến cáo điều trị ít nhất 10 ngày với nhiễm liên cầu tan huyết beta.");
    common.push("ACE: sau điều trị, tìm và xử trí yếu tố gây tái phát (viêm da cơ địa, hăm kẽ, dụng cụ cạo râu không vệ sinh).");
    common.push("ACE: chỉnh liều khi suy thận – theo tờ hướng dẫn sử dụng hoặc phác đồ của cơ sở.");
  }
  if (i.pcnAllergy) common.push("ACE: xác minh dị ứng penicilin (đặc điểm phản ứng trước đây, tiền sử đã dung nạp penicilin) – phần lớn dị ứng do người bệnh tự khai không chính xác.");
  if (i.age === "child") common.push("IDSA: liều trẻ em không áp dụng cho sơ sinh.");
  return { ...o, notes: [...o.notes, ...common] };
}
