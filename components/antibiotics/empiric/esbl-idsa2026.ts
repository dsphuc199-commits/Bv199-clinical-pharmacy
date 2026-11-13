/*
  Enterobacterales sinh ESBL – du lieu cong cu chon khang sinh theo IDSA 2026 Guidance on the Treatment of
  Antimicrobial-Resistant Gram-Negative Infections (Tamma PD et al. Clin Infect Dis 2026, doi:10.1093/cid/ciag481),
  Section 1 (Question 1.1–1.7) va Table 1 (lieu nguoi lon, chuc nang gan – than binh thuong).
  Doc tu ban PDF ciag481 ngay 14/11/2026. IDSA khong xep muc GRADE (uu tien/thay the theo dong thuan chuyen gia).
  Thuoc khong co lieu trong Table 1 (piperacilin-tazobactam) -> de trong o lieu.
  ref = vi tri trong van ban, khong hien thi.
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export type EsblSite = "uuti" | "cuti" | "other";
export type EsblIn = { site: EsblSite; ecoli: boolean; severe: boolean; bacteremia: boolean; hypoalb: boolean };
export type EsblOut = { headline: string; blocks: { title: string; lead?: string; items: RxItem[] }[]; avoid: RxItem[]; notes: string[] };

/* Table 1 – lieu theo the lam sang (uUTI = viem bang quang khong bien chung). */
const T = {
  amikU: "15 mg/kg TM, liều duy nhất",
  amikC: "15 mg/kg TM một lần; liều và khoảng cách liều tiếp theo theo đánh giá dược động học",
  gentU: "5 mg/kg TM, liều duy nhất",
  gentC: "7 mg/kg TM một lần; liều và khoảng cách liều tiếp theo theo đánh giá dược động học",
  gepo: "1,5 g uống mỗi 12 giờ",
  nitro: "Dạng macrocrystal/monohydrate 100 mg uống mỗi 12 giờ; hỗn dịch uống 50 mg mỗi 6 giờ",
  pivm: "370 mg uống mỗi 8 giờ (185 mg pivmecilinam tương đương 200 mg pivmecilinam hydroclorid)",
  sulo: "500 mg sulopenem etzadroxil + 500 mg probenecid, uống mỗi 12 giờ",
  tmpU: "160 mg (thành phần trimethoprim) TM hoặc uống mỗi 12 giờ",
  tmp: "8–15 mg/kg/ngày (thành phần trimethoprim) TM hoặc uống, chia mỗi 8–12 giờ",
  fosPO: "3 g uống, liều duy nhất",
  fosIV: "6 g TM mỗi 8 giờ, truyền 1 giờ",
  ciproU: "400 mg TM mỗi 12 giờ hoặc 500 mg uống mỗi 12 giờ",
  cipro: "400 mg TM mỗi 8 giờ hoặc 750 mg uống mỗi 12 giờ",
  levo: "750 mg TM hoặc uống mỗi 24 giờ",
  fepEnm: "2,5 g (2 g cefepim + 0,5 g enmetazobactam) TM mỗi 8 giờ, truyền 2 giờ; ClCr ≥ 130 mL/phút: truyền 4 giờ",
  erta: "1 g TM mỗi 24 giờ, truyền 30 phút",
  meroU: "1 g TM mỗi 8 giờ, truyền 30 phút",
  mero: "1–2 g TM mỗi 8 giờ, truyền 3 giờ (nếu khả thi); ưu tiên 2 g khi béo phì, nhiễm khuẩn thần kinh trung ương, ECMO hoặc ClCr ≥ 130 mL/phút",
  imiU: "500 mg TM mỗi 6 giờ, truyền 30 phút (liều tính theo imipenem)",
  imi: "500 mg TM mỗi 6 giờ truyền 3 giờ (nếu khả thi), hoặc 1.000 mg TM mỗi 8 giờ truyền 1 giờ; ClCr ≥ 90 mL/phút: 1 g TM mỗi 6 giờ truyền 1 giờ (liều tính theo imipenem)",
};

const r = (role: string, text: string, dose: string | undefined, ref: string): RxItem => ({ role, text, dose, ref });

export const ESBL_PRINCIPLES: string[] = [
  "Nhận diện: E. coli, K. pneumoniae hoặc K. oxytoca kháng ceftriaxon (MIC ≥ 4 µg/mL) thường được dùng làm dấu hiệu thay thế cho sinh ESBL; phần lớn phòng xét nghiệm không làm thường quy test ESBL.",
  "Các lựa chọn dưới đây giả định thuốc đã được chứng minh có hoạt tính in vitro trên chủng phân lập.",
  "ESBL bất hoạt phần lớn penicilin, cephalosporin và aztreonam; thường không ảnh hưởng carbapenem và thuốc không phải beta-lactam (ciprofloxacin, cotrimoxazol, gentamicin, doxycyclin). Tuy vậy, chủng mang gen ESBL thường kèm cơ chế kháng các nhóm khác.",
  "Aztreonam-avibactam, ceftazidim-avibactam, meropenem-vaborbactam, imipenem-relebactam, ceftolozan-tazobactam và cefiderocol có hiệu quả nhưng nên dành cho vi khuẩn kháng carbapenem.",
  "Liều theo Table 1, giả định chức năng gan, thận bình thường; một số liều khác với liều khuyến cáo của FDA.",
];

export function esblPlan(i: EsblIn): EsblOut {
  const notes: string[] = [];
  const avoid: RxItem[] = [];
  const blocks: EsblOut["blocks"] = [];
  let headline = "";

  if (i.site === "uuti") {
    headline = "Một thuốc uống hoặc aminoglycosid liều duy nhất; dành carbapenem, fluoroquinolon và cefepim-enmetazobactam cho nhiễm khuẩn tiết niệu phức tạp và nhiễm khuẩn xâm lấn.";
    blocks.push({ title: "Ưu tiên – chọn một (xếp theo vần, không theo thứ tự ưu tiên)", items: [
      r("Ưu tiên", "Amikacin (aminoglycosid, liều duy nhất)", T.amikU, "Q1.1"),
      r("Ưu tiên", "Gentamicin (aminoglycosid, liều duy nhất)", T.gentU, "Q1.1"),
      r("Ưu tiên", "Tobramycin (aminoglycosid, liều duy nhất)", T.gentU, "Q1.1"),
      r("Ưu tiên", "Gepotidacin", T.gepo, "Q1.1"),
      r("Ưu tiên", "Nitrofurantoin", T.nitro, "Q1.1"),
      r("Ưu tiên", "Pivmecilinam", T.pivm, "Q1.1"),
      r("Ưu tiên", "Sulopenem etzadroxil-probenecid", T.sulo, "Q1.1"),
      r("Ưu tiên", "Cotrimoxazol (trimethoprim-sulfamethoxazol)", T.tmpU, "Q1.1"),
    ] });
    if (i.ecoli) blocks.push({ title: "Thay thế – chỉ cho E. coli sinh ESBL", items: [r("Thay thế", "Fosfomycin uống", T.fosPO, "Q1.1")] });
    blocks.push({ title: "Khi kháng thuốc, không có sẵn hoặc không dung nạp các thuốc trên – chọn một", items: [
      r("Fluoroquinolon", "Ciprofloxacin", T.ciproU, "Q1.1"),
      r("Fluoroquinolon", "Levofloxacin", T.levo, "Q1.1"),
      r("Cephalosporin + ức chế beta-lactamase", "Cefepim-enmetazobactam", T.fepEnm, "Q1.1"),
      r("Carbapenem", "Ertapenem", T.erta, "Q1.1"),
      r("Carbapenem", "Meropenem", T.meroU, "Q1.1"),
      r("Carbapenem", "Imipenem-cilastatin", T.imiU, "Q1.1"),
    ] });
    avoid.push(r("Không dùng", "Amoxicilin-acid clavulanic", undefined, "Q1.1"));
    avoid.push(r("Không dùng", "Doxycyclin (nồng độ trong nước tiểu thấp)", undefined, "Q1.1"));
    if (!i.ecoli) avoid.push(r("Không dùng", "Fosfomycin uống cho vi khuẩn Gram âm khác E. coli (K. pneumoniae thường mang gen fosA bất hoạt fosfomycin)", undefined, "Q1.1"));
    avoid.push(r("Không dùng", "Cephamycin (cefoxitin, cefotetan)", undefined, "Q1.6"));
    notes.push("Đã dùng piperacilin-tazobactam hoặc cefepim theo kinh nghiệm, sau đó xác định ESBL và lâm sàng cải thiện: không cần đổi thuốc, không cần kéo dài thời gian điều trị.");
    notes.push("Đợt điều trị ngắn thường bắt đầu trước khi có kháng sinh đồ: xem lại kết quả cấy nước tiểu trước đây của người bệnh và dịch tễ ESBL tại chỗ để quyết định có cần phủ ESBL.");
    notes.push("Cotrimoxazol: tại Hoa Kỳ chỉ khoảng 50% chủng ESBL phân lập từ nước tiểu còn nhạy – theo dõi lâm sàng sát khi dùng theo kinh nghiệm.");
    notes.push("Sulopenem: probenecid ức chế bài tiết ở ống thận, có thể làm tăng nồng độ methotrexat, piperacilin, sulfonamid.");
    notes.push("Gepotidacin có hoạt tính trên lậu cầu: dùng rộng rãi có thể chọn lọc chủng N. gonorrhoeae kháng thuốc.");
  } else if (i.site === "cuti") {
    const noPip = i.severe || i.bacteremia;
    headline = "Cotrimoxazol, ciprofloxacin hoặc levofloxacin khi nhạy; không dùng được: cefepim-enmetazobactam hoặc carbapenem.";
    blocks.push({ title: "Ưu tiên – khi đã chứng minh nhạy, chọn một", items: [
      r("Ưu tiên", "Cotrimoxazol (trimethoprim-sulfamethoxazol)", T.tmp, "Q1.2"),
      r("Ưu tiên", "Ciprofloxacin", T.cipro, "Q1.2"),
      r("Ưu tiên", "Levofloxacin", T.levo, "Q1.2"),
    ] });
    blocks.push({ title: "Ưu tiên khi kháng thuốc, không dung nạp hoặc độc tính không cho phép dùng các thuốc trên – chọn một", lead: "IDSA coi cefepim-enmetazobactam và carbapenem có hiệu quả tương đương.", items: [
      r("Ưu tiên", "Cefepim-enmetazobactam", T.fepEnm, "Q1.2"),
      r("Ưu tiên", "Ertapenem", T.erta, "Q1.2"),
      r("Ưu tiên", "Meropenem", T.mero, "Q1.2"),
      r("Ưu tiên", "Imipenem-cilastatin", T.imi, "Q1.2"),
    ] });
    blocks.push({ title: "Thay thế – chọn một", items: [
      r("Thay thế", i.ecoli ? "Fosfomycin tĩnh mạch" : "Fosfomycin tĩnh mạch (K. pneumoniae sinh ESBL: cân nhắc kỹ)", T.fosIV, "Q1.2"),
      r("Thay thế", "Amikacin", T.amikC, "Q1.2"),
      r("Thay thế", "Gentamicin", T.gentC, "Q1.2"),
      r("Thay thế", "Tobramycin", T.gentC, "Q1.2"),
      ...(noPip ? [] : [r("Thay thế (không nặng, không nhiễm khuẩn huyết)", "Piperacilin-tazobactam", undefined, "Q1.4")]),
    ] });
    blocks.push({ title: "Thuốc uống chuyển tiếp", items: [
      r("Khi đang truyền TM mà chủng nhạy", "Chuyển sang cotrimoxazol, ciprofloxacin hoặc levofloxacin uống (ưu tiên)", undefined, "Q1.2"),
      r("Thay thế – chỉ sau khi đã cải thiện lâm sàng ban đầu", "Sulopenem etzadroxil-probenecid uống", T.sulo, "Q1.2"),
      ...(i.ecoli ? [r("Trường hợp chọn lọc, không còn thuốc uống khác", "Fosfomycin uống nhiều liều (E. coli sinh ESBL); không dùng làm điều trị ban đầu", undefined, "Q1.2")] : []),
    ] });
    if (noPip) avoid.push(r("Không dùng", "Piperacilin-tazobactam khi bệnh nặng hoặc có nhiễm khuẩn huyết kèm theo", undefined, "Q1.4"));
    avoid.push(r("Không dùng", "Cefepim – kể cả khi kháng sinh đồ báo nhạy", undefined, "Q1.5"));
    avoid.push(r("Không dùng", "Cephamycin (cefoxitin, cefotetan)", undefined, "Q1.6"));
    notes.push("Fosfomycin tĩnh mạch: lượng natri vượt nhu cầu khuyến nghị hằng ngày – thận trọng ở người cao tuổi và người có nguy cơ suy tim.");
    notes.push("Aminoglycosid: độc thận tăng theo thời gian dùng; có thể dùng để hoàn tất đợt điều trị (chuyển từ thuốc khác cho các liều cuối) nhờ thời gian tác dụng kéo dài tại vỏ thận và dùng một lần mỗi ngày.");
  } else {
    headline = i.severe || i.hypoalb
      ? "Meropenem hoặc imipenem (bệnh nặng hoặc giảm albumin máu); chuyển uống khi đủ điều kiện."
      : "Carbapenem (ertapenem, imipenem hoặc meropenem); chuyển uống khi đủ điều kiện.";
    blocks.push({ title: "Ưu tiên – chọn một", items: [
      ...(i.severe || i.hypoalb ? [] : [r("Ưu tiên", "Ertapenem", T.erta, "Q1.3")]),
      r("Ưu tiên", "Meropenem", T.mero, "Q1.3"),
      r("Ưu tiên", "Imipenem-cilastatin", T.imi, "Q1.3"),
    ] });
    blocks.push({ title: "Thay thế", items: [r("Thay thế", "Cefepim-enmetazobactam", T.fepEnm, "Q1.3")] });
    blocks.push({ title: "Chuyển uống khi đã đáp ứng lâm sàng – chọn một", lead: "Chỉ chuyển khi đủ cả 3 điều kiện: chủng nhạy với thuốc chọn; huyết động ổn định; không lo ngại giảm hấp thu tiêu hóa.", items: [
      r("Fluoroquinolon", "Ciprofloxacin", T.cipro, "Q1.3"),
      r("Fluoroquinolon", "Levofloxacin", T.levo, "Q1.3"),
      r("Sulfonamid", "Cotrimoxazol (trimethoprim-sulfamethoxazol)", T.tmp, "Q1.3"),
    ] });
    if (i.severe || i.hypoalb) avoid.push(r("Không dùng khởi đầu", "Ertapenem khi bệnh nặng hoặc albumin máu < 2,5 g/dL (gắn protein cao, thanh thải tăng, dược động học khó dự đoán)", undefined, "Q1.3"));
    avoid.push(r("Không dùng", "Piperacilin-tazobactam – kể cả khi kháng sinh đồ báo nhạy", undefined, "Q1.4"));
    avoid.push(r("Không dùng", "Cefepim – kể cả khi kháng sinh đồ báo nhạy", undefined, "Q1.5"));
    avoid.push(r("Không dùng", "Cephamycin (cefoxitin, cefotetan)", undefined, "Q1.6"));
    avoid.push(r("Không dùng chuyển uống cho nhiễm khuẩn huyết", "Nitrofurantoin, fosfomycin, amoxicilin-acid clavulanic, omadacyclin, doxycyclin, sulopenem", undefined, "Q1.3"));
    notes.push("Áp dụng cho nhiễm khuẩn huyết và, theo ngoại suy của IDSA, nhiễm khuẩn ổ bụng, da – mô mềm và viêm phổi.");
    notes.push("Carbapenem được ưu tiên dựa trên thử nghiệm nhiễm khuẩn huyết do ESBL: tử vong 30 ngày cao hơn ở nhóm piperacilin-tazobactam so với meropenem.");
    notes.push("Liều ertapenem cao hơn (1,5 g/ngày) hoặc mỗi 12 giờ có thể cải thiện đạt đích dược động học ở người béo phì, bệnh nặng hoặc giảm albumin máu, nhưng chưa đủ dữ liệu chứng minh cải thiện kết cục.");
  }
  return { headline, blocks, avoid, notes };
}
