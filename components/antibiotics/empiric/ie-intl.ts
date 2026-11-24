/*
  FILE: components/antibiotics/empiric/ie-intl.ts

  Viêm nội tâm mạc nhiễm khuẩn – khuyến cáo quốc tế cho khung phân tầng.
  Nguồn: 2023 ESC Guidelines for the management of endocarditis (Delgado V và cs. Eur Heart J 2023;44:3948–4042).
  Liều, mức khuyến cáo và câu khuyến cáo chép từ data/antibiotics/empiric/international.ts (mục v8-39: Bảng khuyến
  cáo 10 kinh nghiệm; Bảng 7, 8 điều trị đích; chú thích gentamicin, vancomycin) – test kiểm tra từng liều có trong
  dữ liệu đó. Mức ESC ghi "ESC:<loại>-<mức bằng chứng>" (vd. ESC:IIa-C), hiển thị bằng Grade trong rx-tool.
*/
import type { StratCite, StratIntl } from "../../../data/antibiotics/empiric/stratification";

export const ESC23 = "ESC 2023";
/** Liều người lớn (Bảng khuyến cáo 10 và Bảng 7, 8). */
export const ESC_DOSE = {
  ampicillin: "12 g/ngày TM chia 4–6 lần",
  ceftriaxone: "4 g/ngày TM hoặc TB chia 2 lần",
  flucloxacillin: "12 g/ngày TM chia 4–6 lần",
  gentamicin: "3 mg/kg/ngày TM hoặc TB 1 lần",
  vancomycin: "30 mg/kg/ngày TM chia 2 lần",
  daptomycin: "10 mg/kg/ngày TM 1 lần",
  rifampin: "900–1200 mg TM hoặc uống chia 2–3 lần",
  cefazolin: "6 g/ngày TM chia 3 lần",
};
const e = (role: string, text: string, dose: string, grade: string) => ({ role, text, dose, grade, ref: ESC23 });

export const IE_ESC_CRIT = {
  native: [{ text: "Van tự nhiên mắc phải cộng đồng hoặc van nhân tạo muộn (≥ 12 tháng sau mổ): bao phủ tụ cầu, liên cầu, ruột cầu.", source: ESC23, ref: "Mục 7.12" }],
  early: [{ text: "Van nhân tạo sớm (< 12 tháng sau mổ) hoặc liên quan chăm sóc y tế: bao phủ tụ cầu kháng methicilin, ruột cầu và lý tưởng là Gram âm không thuộc nhóm HACEK.", source: ESC23, ref: "Mục 7.12" }],
  allergy: [{ text: "Dị ứng beta-lactam – van tự nhiên mắc phải cộng đồng hoặc van nhân tạo muộn.", source: ESC23, ref: "Mục 7.12" }],
} satisfies Record<string, StratCite[]>;

export const IE_ESC_NATIVE: StratIntl[] = [
  { source: `${ESC23} – phác đồ 1: ampicilin + ceftriaxon`, items: [
    e("Phối hợp", "Ampicilin", ESC_DOSE.ampicillin, "ESC:IIa-C"),
    e("Phối hợp", "Ceftriaxon", ESC_DOSE.ceftriaxone, "ESC:IIa-C"),
  ] },
  { source: `${ESC23} – phác đồ 2: ampicilin + (flu)cloxacilin + gentamicin`, items: [
    e("Phối hợp", "Ampicilin", ESC_DOSE.ampicillin, "ESC:IIa-C"),
    e("Phối hợp", "(Flu)cloxacilin", ESC_DOSE.flucloxacillin, "ESC:IIa-C"),
    e("Phối hợp", "Gentamicin", ESC_DOSE.gentamicin, "ESC:IIa-C"),
  ] },
];
export const IE_ESC_EARLY: StratIntl[] = [
  { source: `${ESC23} – vancomycin hoặc daptomycin + gentamicin + rifampin`, items: [
    e("Chọn một", "Vancomycin", ESC_DOSE.vancomycin, "ESC:IIb-C"),
    e("Chọn một", "Daptomycin", ESC_DOSE.daptomycin, "ESC:IIb-C"),
    e("Phối hợp", "Gentamicin", ESC_DOSE.gentamicin, "ESC:IIb-C"),
    e("Phối hợp", "Rifampin", ESC_DOSE.rifampin, "ESC:IIb-C"),
  ] },
];
export const IE_ESC_ALLERGY: StratIntl[] = [
  { source: `${ESC23} – cefazolin hoặc vancomycin + gentamicin`, items: [
    e("Chọn một", "Cefazolin – chỉ khi phản ứng quá mẫn với penicilin không phải tức thì", ESC_DOSE.cefazolin, "ESC:IIb-C"),
    e("Chọn một", "Vancomycin", ESC_DOSE.vancomycin, "ESC:IIb-C"),
    e("Phối hợp", "Gentamicin", ESC_DOSE.gentamicin, "ESC:IIb-C"),
  ] },
];

export const IE_ESC_SAMPLING: StratCite[] = [
  { text: "Cấy 3 bộ máu cách nhau 30 phút trước khi dùng kháng sinh; bắt đầu điều trị sớm.", source: ESC23, ref: "Mục 7.12" },
];

const t = (role: string, text: string, grade?: string) => ({ role, text, ref: ESC23, ...(grade ? { grade } : {}) });
export const IE_ESC_EXTRAS: { title: string; criteria?: string; blocks: StratIntl[] }[] = [
  { title: "Điều trị đích: liên cầu miệng, nhóm S. gallolyticus", criteria: "Khi đã định danh tác nhân và có kháng sinh đồ.", blocks: [
    { source: `${ESC23} – nhạy penicilin: 4 tuần van tự nhiên, 6 tuần van nhân tạo`, items: [
      t("Chọn một", "Penicilin G 12–18 triệu U/ngày TM chia 4–6 lần hoặc truyền liên tục", "ESC:I-B"),
      t("Chọn một", "Amoxicilin 12 g/ngày TM chia 4–6 lần", "ESC:I-B"),
      t("Chọn một", "Ceftriaxon 2 g/ngày TM 1 lần", "ESC:I-B"),
      t("Phác đồ 2 tuần", "Thuốc trên + gentamicin 3 mg/kg/ngày TM hoặc TB 1 lần – chỉ van tự nhiên không biến chứng, chức năng thận bình thường; không áp dụng van nhân tạo.", "ESC:I-B"),
      t("Dị ứng beta-lactam", "Vancomycin 30 mg/kg/ngày TM chia 2 lần, 4 tuần (van tự nhiên) hoặc 6 tuần (van nhân tạo).", "ESC:I-C"),
    ] },
    { source: `${ESC23} – tăng phơi nhiễm hoặc kháng penicilin`, items: [
      t("Chọn một", "Penicilin G 24 triệu U/ngày TM chia 4–6 lần hoặc truyền liên tục; hoặc amoxicilin 12 g/ngày TM chia 4–6 lần; hoặc ceftriaxon 2 g/ngày TM 1 lần", "ESC:I-B"),
      t("Phối hợp", "Gentamicin 3 mg/kg/ngày TM hoặc TB 1 lần, 2 tuần. Thời gian beta-lactam: 4 tuần van tự nhiên, 6 tuần van nhân tạo.", "ESC:I-B"),
      t("Dị ứng beta-lactam", "Vancomycin 30 mg/kg/ngày TM chia 2 lần – 4 tuần (van tự nhiên); 6 tuần + gentamicin 2 tuần (van nhân tạo).", "ESC:I-C"),
    ] },
  ] },
  { title: "Điều trị đích: tụ cầu nhạy methicilin (MSSA)", blocks: [
    { source: `${ESC23} – MSSA`, items: [
      t("Van tự nhiên, 4–6 tuần", "(Flu)cloxacilin 12 g/ngày TM chia 4–6 lần hoặc cefazolin 6 g/ngày TM chia 3 lần.", "ESC:I-B"),
      t("Van nhân tạo, ≥ 6 tuần", "(Flu)cloxacilin hoặc cefazolin + rifampin 900 mg/ngày TM hoặc uống chia đều 3 lần + gentamicin 3 mg/kg/ngày TM hoặc TB 1 lần (ưu tiên) hoặc 2 lần, 2 tuần.", "ESC:I-B"),
      t("Dị ứng penicilin", "Cefazolin 6 g/ngày TM chia 3 lần (van tự nhiên 4–6 tuần; van nhân tạo + rifampin ≥ 6 tuần + gentamicin 2 tuần). Cefazolin chỉ thay cloxacilin khi phản ứng quá mẫn không phải tức thì.", "ESC:I-B"),
      t("Dị ứng penicilin", "Daptomycin 10 mg/kg/ngày TM 1 lần + ceftarolin 1800 mg/ngày TM chia 3 lần hoặc fosfomycin 8–12 g/ngày TM chia 4 lần (van nhân tạo: thêm gentamicin hoặc rifampin).", "ESC:IIb-C"),
      t("Lưu ý", "Ceftarolin liều cao có thể gây giảm bạch cầu sau 2 tuần; fosfomycin tải natri cao, có thể gây suy tim cấp ở người suy tim."),
    ] },
  ] },
  { title: "Điều trị đích: tụ cầu kháng methicilin (MRSA)", blocks: [
    { source: `${ESC23} – MRSA`, items: [
      t("Van tự nhiên, 4–6 tuần", "Vancomycin 30–60 mg/kg/ngày TM chia 2–3 lần.", "ESC:I-B"),
      t("Van nhân tạo, ≥ 6 tuần", "Vancomycin + rifampin 900–1200 mg/ngày TM hoặc uống chia 2–3 lần + gentamicin 3 mg/kg/ngày 1 lần (ưu tiên) hoặc 2 lần, 2 tuần.", "ESC:I-B"),
      t("Van tự nhiên – thay thế", "Daptomycin 10 mg/kg/ngày TM 1 lần + cloxacilin 12 g/ngày TM chia 6 lần hoặc ceftarolin 1800 mg/ngày chia 3 lần hoặc fosfomycin 8–12 g/ngày chia 4 lần.", "ESC:IIb-C"),
    ] },
  ] },
  { title: "Liều trẻ em (kinh nghiệm)", blocks: [
    { source: `${ESC23} – trẻ em`, items: [
      t("Van tự nhiên, van nhân tạo muộn", "Ampicilin 200–300 mg/kg/ngày TM chia 4–6 lần, tối đa 12 g/ngày; ceftriaxon 100 mg/kg TM hoặc TB 1 lần; (flu)cloxacilin 200–300 mg/kg/ngày TM chia đều 4–6 lần; gentamicin 3 mg/kg/ngày TM hoặc TB chia đều 3 lần.", "ESC:IIa-C"),
      t("Van nhân tạo sớm, liên quan chăm sóc y tế", "Vancomycin 40 mg/kg/ngày TM chia đều 2–3 lần; gentamicin 3 mg/kg/ngày TM hoặc TB chia đều 3 lần; rifampin 20 mg/kg/ngày TM hoặc uống chia đều 3 lần, tối đa 900 mg/ngày.", "ESC:IIb-C"),
      t("Dị ứng beta-lactam", "Cefazolin 100 mg/kg/ngày TM chia 3–4 lần, tối đa 6 g/ngày; vancomycin 40 mg/kg/ngày TM chia đều 2–3 lần; gentamicin 3 mg/kg/ngày TM hoặc TB chia đều 3 lần.", "ESC:IIb-C"),
    ] },
  ] },
];

export const IE_ESC_PRINCIPLES: StratIntl = {
  source: `${ESC23} – nguyên tắc điều trị kinh nghiệm, theo dõi thuốc`,
  items: [
    t("Chọn phác đồ", "Theo kháng sinh đã dùng trước, van tự nhiên hay nhân tạo (sớm hoặc muộn), nơi mắc (cộng đồng, bệnh viện, liên quan chăm sóc y tế) và dịch tễ kháng thuốc tại chỗ. Đang dùng kháng sinh: phác đồ kinh nghiệm nên gồm kháng sinh khác."),
    t("Tụ cầu không sinh coagulase", "Bao phủ ở van nhân tạo; không bao phủ ở van tự nhiên."),
    t("MSSA", "Cloxacilin hoặc cefazolin liên quan tử vong thấp hơn các beta-lactam khác (kể cả amoxicilin-clavulanat, ampicilin-sulbactam) và vancomycin khi điều trị kinh nghiệm."),
    t("Khi có tác nhân", "Thường trong 24–48 giờ: chuyển sang điều trị theo tác nhân và kháng sinh đồ."),
    t("Aminoglycosid", "Không quá 2 tuần để giảm độc thận. Gentamicin tối đa 240 mg/ngày; theo dõi chức năng thận và nồng độ mỗi tuần; dùng 1 lần/ngày: nồng độ đáy < 1 mg/L, đỉnh (1 giờ sau tiêm) khoảng 10–12 mg/L."),
    t("Vancomycin", "Nồng độ đáy 10–15 mg/L; một số chuyên gia tăng 45–60 mg/kg/ngày chia 2–3 lần để đạt đáy 15–20 mg/L. Không quá 2 g/ngày nếu không theo dõi nồng độ. Với MRSA: đích AUC/MIC 400–600 mg·h/L."),
  ],
};

export const IE_SOURCES = [
  "Delgado V và cs. 2023 ESC Guidelines for the management of endocarditis. Eur Heart J 2023;44(39):3948–4042.",
];
