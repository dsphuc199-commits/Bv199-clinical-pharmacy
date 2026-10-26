/*
  FILE: data/antibiotics/empiric/regimens/byt708-doses.ts

  Lieu tham chieu cho cac phac do QĐ 708 chi neu ten thuoc (Sepsis/soc nhiem khuan,
  VPLQTM). Doi chieu ban QĐ 708 dang tren kcb.vn (Cuc QLKCB) ngay 25/10/2026.
  Thu tu uu tien nguon (khong tu suy dien):
    1. Bang lieu cua CHINH chuong do trong QĐ 708
       - Nhiem khuan huyet: Bang II.11 (tr. 122), Bang II.10 (tr. 121–122)
       - VPLQTM: Bang II.9 (tr. 105–106)
    2. Bang lieu chuong khac cua QĐ 708 (ghi ro bang/trang)
    3. Duoc thu quoc gia Viet Nam lan 3 (2023): lay tu du lieu module Hieu chinh lieu
       (data/renal-dosing.ts), ghi trang in. Muc co danh dau "chưa đối chiếu lại trang
       gốc" la muc trong du lieu do co verification = "chua-xac-nhan".
    4. Khong co nguon -> "CHƯA XÁC MINH".
  Lieu nguoi lon, chuc nang than binh thuong. Giu nguyen van nguon, khong quy doi.
*/

const II11 = "QĐ 708 Bảng II.11, tr. 122";
const II10 = "QĐ 708 Bảng II.10, tr. 121–122";
const II9 = "QĐ 708 Bảng II.9, tr. 105–106";
const II9_OTHER = "QĐ 708 Bảng II.9, tr. 106 – chương VPLQTM; chương NKH không nêu liều";
const II11_OTHER = "QĐ 708 Bảng II.11, tr. 122 – chương NKH; Bảng II.9 không có";

function dtqg(pages: string, rechecked: boolean): string {
  return rechecked
    ? `DTQG 2023, tr. in ${pages}`
    : `DTQG 2023, tr. in ${pages}; chưa đối chiếu lại trang gốc`;
}

/* ---- Nhiem khuan huyet va soc nhiem khuan (chuong II.2) ---- */
export const SEPSIS_DOSES = {
  piptazo: `piperacilin-tazobactam 4,5 g mỗi 8 giờ, truyền TM (${II11})`,
  ceftriaxon: `ceftriaxon 1–2 g x 1 lần/ngày (hoặc chia 2 liều), tối đa 4 g/ngày (${II11})`,
  cefotaxim: `cefotaxim – nhiễm khuẩn nặng: 2–3 g mỗi 6–8 giờ, tối đa 12 g/ngày (${dtqg("406–409", false)})`,
  ceftazidim: `ceftazidim 1–2 g mỗi 8–12 giờ (${II11})`,
  cefoperazon: `cefoperazon – nhiễm khuẩn nặng: tổng 6–12 g/ngày chia 2–4 lần (${dtqg("404–406", false)})`,
  cefepim: `cefepim 1–2 g mỗi 12 giờ, tối đa 6 g/ngày; nhiễm khuẩn đe dọa tính mạng: 2 g mỗi 8–12 giờ (${II11})`,
  cefpirom: `cefpirom – nhiễm khuẩn huyết: 2 g mỗi 12 giờ (${dtqg("412–414", false)})`,
  cipro: `ciprofloxacin 400 mg x 2–3 lần/ngày, tối đa 1200 mg/ngày, truyền TM (${II11})`,
  levo: `levofloxacin 500–750 mg/ngày, truyền TM (${II11})`,
  moxi: `moxifloxacin 400 mg/ngày, truyền TM (${II11})`,
  amikacin: `amikacin 16–24 mg/kg x 1 lần/ngày, truyền TM; liều có thể thay đổi theo TDM (${II11})`,
  netilmicin: `neltimicin (netilmicin) – nhiễm khuẩn nặng: 7,5 mg/kg/ngày, giảm xuống 6 mg/kg/ngày khi có đáp ứng (${dtqg("1191–1193", false)})`,
  ertapenem: `ertapenem 1 g x 1 lần/ngày, truyền TM trong 3–4 giờ (${II11})`,
  imipenem: `imipenem-cilastatin 0,5–1 g mỗi 6 giờ, tối đa 4 g/ngày, truyền TM trong 3–4 giờ (${II11})`,
  doripenem: `doripenem 500 mg/lần, truyền TM mỗi 8 giờ (${II10})`,
  meropenem: `meropenem 1 g mỗi 8 giờ, tối đa 2 g mỗi 8 giờ, TM (${II11})`,
  fosfomycin: `fosfomycin TM 12–24 g/ngày chia 2–4 lần, một liều không quá 8 g – DTQG không nêu riêng nhiễm khuẩn huyết (${dtqg("793–796", false)})`,
  oxacilin: `oxacilin 100–200 mg/kg/ngày chia tiêm TM chậm mỗi 6 giờ (${II10})`,
  cloxacilin: `cloxacilin – nhiễm khuẩn huyết: 2 g mỗi 4–6 giờ (${dtqg("504–505", false)})`,
  cefazolin: `cefazolin – nhiễm khuẩn huyết: 1–1,5 g mỗi 6 giờ, tối đa 12 g/ngày (${dtqg("391–394", true)})`,
  vancomycin: `vancomycin 1 g/lần truyền TM mỗi 12 giờ (${II10})`,
  teicoplanin: `teicoplanin: nạp 400 mg mỗi 12 giờ x 3 liều đầu, duy trì 400 mg/24 giờ, truyền TM 30 phút (${II9_OTHER})`,
  daptomycin: `daptomycin 4–6 mg/kg/ngày (${II10}) – xem lưu ý về liều`,
  metronidazol: `metronidazol truyền TM: tấn công 15 mg/kg, sau đó duy trì 7,5 mg/kg truyền trong 1 giờ mỗi 6 giờ (${II10})`,
  ampsul: `ampicilin-sulbactam 1,5–3 g mỗi 6 giờ, TM (${II11})`,
  colistin: `colistin TM: 1 liều nạp (không quá 9 triệu đvqt, tính theo cân nặng); liều duy trì đầu tiên sau 12–24 giờ; tổng liều 24 giờ không quá 12 triệu đvqt, chia 2–3 lần, theo CrCl (${dtqg("514–518", true)})`,
  linezolid: `linezolid 600 mg mỗi 12 giờ (QĐ 708 Bảng II.9, tr. 106; ${dtqg("1028–1031", false)}; nhãn FDA). Bảng II.11 ghi "600 mg x 1 lần/ngày" – nghi sai, không dùng`,
} as const;

export const SEPSIS_DOSE_NOTE =
  "Liều bổ sung ngày 25/10/2026 theo bản QĐ 708 trên kcb.vn. Chương này dẫn chiếu: \"Liều dùng và cách dùng của một số kháng sinh được thể hiện trong Bảng II.11\". Thuốc không có trong Bảng II.10/II.11 lấy từ Bảng II.9 của cùng văn bản hoặc Dược thư quốc gia VN lần 3 (2023), có ghi trang. Liều cho người lớn, chức năng thận bình thường; hiệu chỉnh theo CrCl bằng module Hiệu chỉnh liều.";

export const FLAG_PIPTAZO =
  "CẦN DƯỢC SĨ XÁC NHẬN: Bảng II.11 ghi piperacilin-tazobactam 4,5 g mỗi 8 giờ. Cùng văn bản, Bảng II.10 (P. aeruginosa) và Bảng II.9 (VPLQTM) ghi 4,5 g mỗi 6 giờ. DTQG 2023 (tr. in 1319–1322) ghi 4,5 g mỗi 6 giờ cho viêm phổi nặng, sốt giảm bạch cầu trung tính và nhiễm P. aeruginosa.";

export const FLAG_ERTA =
  "CẦN DƯỢC SĨ XÁC NHẬN: Bảng II.11 ghi truyền ertapenem trong 3–4 giờ. IDSA 2026 (Table 1) ghi ertapenem 1 g mỗi 24 giờ, truyền trong 30 phút.";

export const FLAG_VANCO =
  "Vancomycin: Bảng II.9 (cùng văn bản) ghi có thể tăng đến 1,5 g/12 giờ khi CrCl ≥ 90 mL/phút và nên giám sát nồng độ đáy (10–20 µg/mL). DTQG 2023 (tr. in 1640–1644) nêu thêm phác đồ 15–20 mg/kg mỗi 8–12 giờ và liều nạp 25–30 mg/kg cho bệnh nhân nặng. Hiệu chỉnh bằng module TDM vancomycin.";

export const FLAG_DAPTO =
  "CẦN DƯỢC SĨ XÁC NHẬN: nhãn FDA (Pfizer) ghi daptomycin cho nhiễm khuẩn huyết do S. aureus là 6 mg/kg mỗi 24 giờ trong 2–6 tuần. Bảng II.10 ghi 4–6 mg/kg/ngày. Daptomycin không có trong dữ liệu DTQG của ứng dụng.";

export const FLAG_LINEZOLID =
  "LIỀU NGHI SAI TRONG NGUỒN: Bảng II.11 (tr. 122) ghi linezolid \"600 mg x 1 lần/ngày\". Bảng II.9 (tr. 106) của cùng văn bản ghi 600 mg x 2 lần/ngày. DTQG 2023 và nhãn FDA (Pfizer) đều ghi 600 mg mỗi 12 giờ. Ứng dụng hiển thị 600 mg mỗi 12 giờ.";

export const FLAG_CRAB =
  "Tham khảo quốc tế, không thay thế văn bản BYT: IDSA 2026 (Table 1) dùng ampicilin-sulbactam cho A. baumannii kháng carbapenem với tổng liều sulbactam 9 g/ngày. Cách dùng: 9 g ampicilin-sulbactam (6 g/3 g) TM mỗi 8 giờ, truyền 4 giờ; hoặc 27 g truyền liên tục trong 24 giờ. Liều này cao hơn Bảng II.11.";

/* ---- Viem phoi lien quan tho may (Bang II.9, tr. 105–106) ---- */
export const VAP_DOSES = {
  ceftriaxon: `ceftriaxon 1–2 g x 1 lần/ngày, tối đa 4 g chia 2 lần/ngày, TM (${II9})`,
  cefepim: `cefepim 1–2 g mỗi 8 giờ, tối đa 6 g/ngày; nhiễm khuẩn đe dọa tính mạng: 2 g mỗi 8 giờ, TM (${II9})`,
  ceftazidim: `ceftazidim 1–2 g mỗi 8 giờ, TM (${II9})`,
  ampsul: `ampicilin-sulbactam 1,5–3 g mỗi 6 giờ, TM; tối đa 4,5 g mỗi 6 giờ (${II9})`,
  ertapenem: `ertapenem 1 g x 1 lần/ngày, truyền TM trong 3–4 giờ (${II11_OTHER})`,
  imipenem: `imipenem 0,5–1 g mỗi 6 giờ, tối đa 4 g/ngày, truyền TM trong 3–4 giờ (${II9})`,
  meropenem: `meropenem 0,5–1 g mỗi 8 giờ, tối đa 2 g mỗi 8 giờ, TM (${II9})`,
  piptazo: `piperacilin-tazobactam 4,5 g mỗi 6 giờ, truyền TM (${II9})`,
  levo: `levofloxacin 750 mg/ngày, truyền TM (${II9})`,
  moxi: `moxifloxacin 400 mg/ngày, truyền TM (${II9})`,
  cipro: `ciprofloxacin 400 mg mỗi 8–12 giờ, tối đa 1200 mg/ngày, truyền TM (${II9})`,
  amikacin: `amikacin 15–20 mg/kg x 1 lần/ngày, truyền TM; nhiễm khuẩn nặng có thể tăng đến 28 mg/kg/ngày, giám sát nồng độ đáy < 1 µg/mL (${II9})`,
  gentamycin: `gentamycin 3–5 mg/kg x 1 lần/ngày, truyền TM; nặng có thể tăng đến 7 mg/kg, giám sát nồng độ đáy < 1 µg/mL (${II9})`,
  tobramycin: `tobramycin 3–5 mg/kg x 1 lần/ngày, truyền TM; nặng có thể tăng đến 7 mg/kg, giám sát nồng độ đáy < 1 µg/mL (${II9})`,
  linezolid: `linezolid 600 mg x 2 lần/ngày, uống hoặc TM (${II9})`,
  vancomycin: `vancomycin 1 g/12 giờ; nặng có thể tăng đến 1,5 g/12 giờ khi CrCl ≥ 90 mL/phút, nên giám sát nồng độ đáy 10–20 µg/mL (${II9})`,
  teicoplanin: `teicoplanin: khởi đầu 400 mg/12 giờ x 3 liều đầu, duy trì 400 mg/24 giờ, truyền TM 30 phút (${II9})`,
  fluconazol: `fluconazol: liều đầu 400 mg/ngày, sau đó 200 mg/ngày, truyền hoặc uống (${II9})`,
  itraconazol: `itraconazol 200 mg/12 giờ trong 2 ngày đầu (4 liều) truyền TM, sau đó 200 mg/ngày trong 12 ngày, truyền 1 giờ (${II9})`,
  amphoB: `amphotericin B (desoxycholat) truyền TM: ngày đầu 0,1–0,3 mg/kg/ngày, tăng 5–10 mg/ngày tới 0,5–1 mg/kg/ngày (${II9})`,
  caspofungin: `caspofungin: liều nạp 70 mg ngày đầu, sau đó 50 mg/ngày, truyền TM chậm khoảng 1 giờ (${II9})`,
} as const;

export const VAP_DOSE_NOTE =
  "Liều bổ sung ngày 25/10/2026 theo Bảng II.9 (tr. 105–106) của QĐ 708 (bản trên kcb.vn). Mục 4.4 dẫn chiếu: \"Liều dùng và đường dùng cụ thể của một số kháng sinh được thể hiện trong Bảng II.9\". Người suy thận cần hiệu chỉnh theo mức lọc cầu thận và nồng độ thuốc trong máu (nếu có).";

export const VAP_COLISTIN_RULES =
  "Bảng II.9 – colistin: chỉ định trong VPLQTM muộn, đã khẳng định hoặc có nguy cơ nhiễm Gram âm đa kháng. Không dùng colistin đơn độc; phối hợp carbapenem, rifampicin, fluoroquinolon… Phải dùng liều nạp, 1 lần/ngày; liều duy trì chia 2–3 lần/ngày. Bảng II.9 không ghi số liều.";
