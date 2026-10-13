/*
  FILE: data/antibiotics/empiric/regimens/ophthalmology.ts
  Nguon:
  - BYT QD 708/QD-BYT (02/03/2015), Chuong 8 Nhiem khuan mat:
    Viem ket mac cap tr. 209-210; Viem ket mac do lau cau tr. 211-212;
    Viem giac mac do vi khuan tr. 213-214; Viem to chuc hoc mat tr. 218-220;
    Viem mu noi nhan sau vet thuong xuyen nhan cau tr. 222-224; Viem tui le tr. 227-228.
  - BYT QD 40/QD-BYT (12/01/2015): Viem to chuc hoc mat tr. 18-21; Viem tui le tr. 23-26;
    Viem ket mac cap tr. 35-38; Viem mu noi nhan ngoai sinh tr. 106-110 (so trang in).
*/

import { d, maker } from "./helpers";
import type { Regimen } from "./types";

const r708 = maker("byt708");
const r40 = maker("byt40");

const CONJ = "Viêm kết mạc cấp, mục 4";
const GC = "Viêm kết mạc do lậu cầu, mục 4";
const KER = "Viêm giác mạc do vi khuẩn, mục 4b";
const ORB = "Viêm tổ chức hốc mắt, mục 4b";
const ENDO = "Viêm mủ nội nhãn, mục 4.1";
const DAC = "Viêm túi lệ, mục 4";

const CONJ_ADJ =
  "Tại mắt: bóc màng hàng ngày; rửa mắt liên tục bằng nước muối sinh lý 0,9%; thận trọng khi dùng corticoid (prednisolon acetat, fluorometholon tra 1–2 lần/ngày, 1 giọt/lần).";

export const OPHTHALMOLOGY: Regimen[] = [
  // ===== Viêm kết mạc do vi khuẩn (v8-83) =====
  r708(CONJ, "tr. 210", "r-conj-topical", ["v8-83"],
    "Viêm kết mạc cấp do vi khuẩn – điều trị tại mắt khi chưa có kết quả xét nghiệm", "first",
    [d("Một trong (tra mắt 15–30 phút/lần trong những ngày đầu, giảm dần khi thuyên giảm)", "quinolon nhỏ mắt (ofloxacin, levofloxacin, ciprofloxacin, moxifloxacin…); hoặc thuốc phối hợp nhiều loại kháng sinh như gramicidin/neomycin sulfat/polymyxin B sulfat…")],
    { notes: [CONJ_ADJ, "Điều chỉnh theo kháng sinh đồ hoặc kết quả soi nhuộm khi có."] }),
  r40(CONJ, "tr. 37", "r-conj-topical-40", ["v8-83"],
    "Viêm kết mạc cấp – điều trị tại mắt (QĐ 40)", "alternative",
    [d("Một trong (dung dịch, tra 15–30 phút/lần trong những ngày đầu)", "aminoglycosid (tobramycin…); fluoroquinolon (ofloxacin, ciprofloxacin, levofloxacin, moxifloxacin, gatifloxacin…)")],
    { notes: ["Phối hợp thuốc mỡ một trong các nhóm trên trưa và tối. Thận trọng khi dùng corticoid."] }),
  r708(CONJ, "tr. 210", "r-conj-systemic-ceph", ["v8-83"],
    "Viêm kết mạc – chỉ dùng toàn thân khi tiến triển nặng, thường do lậu cầu hoặc bạch hầu (người lớn)", "severe",
    [d("Cephalosporin thế hệ 3 (ceftriaxon, ceftazidim…)", "giác mạc chưa loét: liều duy nhất 1 g tiêm bắp; giác mạc bị loét: 1 g x 3 lần/ngày tiêm TM")],
    { notes: ["Trẻ em: liều duy nhất 125 mg tiêm bắp hoặc 25 mg/kg x 2–3 lần/ngày x 7 ngày tiêm bắp."] }),
  r708(CONJ, "tr. 210", "r-conj-systemic-fq", ["v8-83"],
    "Viêm kết mạc – toàn thân nặng (thay thế)", "alternative",
    [d("Fluoroquinolon", "ciprofloxacin 0,5 g hoặc ofloxacin 0,4 g, uống 2 viên/ngày")],
    { duration: "5 ngày", notes: ["Chống chỉ định cho trẻ em dưới 16 tuổi."] }),
  r708(GC, "tr. 211", "r-conj-gc-ctx", ["v8-83"],
    "Viêm kết mạc do lậu cầu", "pathogen",
    [d("Ceftriaxon", "người lớn tiêm bắp 1 g liều duy nhất; nếu có tổn thương giác mạc hoặc nguy cơ xâm nhập giác mạc thì nhập viện, ceftriaxon 1 g TM ngày 1 hoặc 2 lần; trẻ em và trẻ sơ sinh 25 mg/kg/ngày 1 lần")],
    { duration: "Liều duy nhất; nếu nhập viện thời gian tùy đáp ứng, trung bình 7 ngày",
      notes: ["Tại mắt: rửa mắt NaCl 0,9% hàng giờ đến hết tiết tố; ciprofloxacin 0,3% tra 2 giờ/lần; tobramycin 0,3%, mỡ bacitracin hoặc mỡ erythromycin; nếu có tổn thương giác mạc: ciprofloxacin 0,3%, gentamycin 0,3% hoặc tobramycin 0,3% mỗi giờ một lần."] }),
  r708(GC, "tr. 211–212", "r-conj-gc-alt", ["v8-83"],
    "Viêm kết mạc do lậu cầu – thay thế", "alternative",
    [d("Một trong", "cefotaxim 1 g tiêm bắp hoặc TM liều duy nhất (trẻ em 25 mg/kg/ngày, tối đa 1 g); procain penixilin 1,5 g tiêm bắp/ngày x 3 ngày (trẻ em 50 mg/kg/ngày x 3 ngày)")],
    { notes: ["Dị ứng penicillin: ciprofloxacin 500 mg uống một liều hoặc ofloxacin 400 mg uống một liều.", "Văn bản nêu penicillin ít được dùng do kháng thuốc và nguy cơ phản ứng."] }),

  // ===== Viêm giác mạc do vi khuẩn (v8-84) =====
  r708(KER, "tr. 214", "r-ker-gramneg", ["v8-84"],
    "Viêm loét giác mạc do vi khuẩn Gram âm – thuốc tra mắt", "pathogen",
    [d("Một trong", "tobramycin; neomycin sulfat; polymyxin B")],
    { notes: ["Điều trị bằng thuốc tra mắt là chính; ngày đầu tra liên tục cách nhau 30 phút, những ngày sau 10 lần/ngày. Cần tìm vi khuẩn và dùng kháng sinh theo kháng sinh đồ; nếu không xác định được thì dùng kháng sinh phổ rộng."] }),
  r708(KER, "tr. 214", "r-ker-grampos", ["v8-84"],
    "Viêm loét giác mạc do vi khuẩn Gram dương hoặc chưa xác định (phổ rộng) – thuốc tra mắt", "first",
    [d("Fluoroquinolon nhỏ mắt – một trong", "ofloxacin (thế hệ 2); levofloxacin (thế hệ 3); moxifloxacin, gatifloxacin (thế hệ 4)")],
    { notes: ["Nhóm này phổ rộng nên có thể dùng cho cả vi khuẩn Gram âm."] }),
  r708(KER, "tr. 214", "r-ker-oral", ["v8-84"],
    "Viêm loét giác mạc do vi khuẩn – thuốc uống phối hợp", "adjunct",
    [d("Một trong", "cefuroxim acetil 250 mg, uống 2–3 viên/ngày chia 2 lần; ofloxacin 0,2 g/ngày, uống 2 viên chia 2 lần")],
    { duration: "5–7 ngày",
      notes: ["Trường hợp nặng có thể phối hợp hai nhóm thuốc; truyền rửa mắt liên tục khi nặng: gentamycin 80 mg x 2 ống pha với 100 ml Ringer lactat, truyền rửa mắt 1–2 lần/ngày."] }),

  // ===== Viêm mủ nội nhãn sau phẫu thuật/chấn thương (v8-85) =====
  r40("Viêm mủ nội nhãn ngoại sinh, mục 4b", "tr. 109", "r-endo-40-systemic", ["v8-85"],
    "Viêm mủ nội nhãn ngoại sinh (sau chấn thương hoặc sau phẫu thuật mắt) – kháng sinh toàn thân theo vi khuẩn", "first",
    [d("Theo kết quả soi/cấy", "Gram âm: gentamycin, amikacin, ceftazidim, kháng sinh nhóm quinolon; Gram dương: vancomycin")],
    { notes: ["Kháng sinh sớm, mạnh, phổ rộng, thấm tốt nội nhãn; dùng 1 hoặc phối hợp từ 2 nhóm trở lên tùy mức độ; phối hợp corticoid khi không có nấm; viêm mủ nội nhãn do nấm tuyệt đối không dùng corticoid.", "Văn bản không nêu liều toàn thân; liều tham khảo của QĐ 708 ở dòng bên dưới."] }),
  r40("Viêm mủ nội nhãn ngoại sinh, mục 4b", "tr. 109", "r-endo-40-intravitreal", ["v8-85"],
    "Viêm mủ nội nhãn ngoại sinh – tiêm kháng sinh trực tiếp vào buồng dịch kính (dựa vào kháng sinh đồ)", "adjunct",
    [d("Một trong", "ceftazidim 2,25 mg/0,1 ml; gentamycin 0,2–0,4 mg/0,1 ml; amikacin 0,4 mg; vancomycin 1 mg/0,1 ml")],
    { notes: ["Cân nhắc khi tiêm nội nhãn lần thứ hai; có thể kết hợp tiêm dưới kết mạc. Cắt dịch kính khi nặng không đáp ứng nội khoa."] }),
  r708(ENDO, "tr. 223", "r-endo-708-vanco", ["v8-85"],
    "Viêm mủ nội nhãn (sau vết thương xuyên nhãn cầu) – vi khuẩn Gram dương", "pathogen",
    [d("Vancomycin (người lớn)", "tra tại chỗ 50 mg/ml, tra mắt 1 giờ/lần; tiêm nội nhãn 1 mg/0,1 ml; tiêm dưới kết mạc hoặc cạnh nhãn cầu 25 mg/0,5 ml; toàn thân: truyền TM chậm liều duy nhất 25 mg/kg đến 1,5 g")],
    { notes: ["Trẻ em < 12 tuổi: toàn thân 30 mg/kg đến 1,5 g/ngày chia nhiều lần; liều tại chỗ/tiêm như người lớn.", "Nguồn mô tả viêm mủ nội nhãn sau vết thương xuyên nhãn cầu; áp dụng cho viêm nội nhãn sau phẫu thuật cần thẩm định."] }),
  r708(ENDO, "tr. 223", "r-endo-708-ctz", ["v8-85"],
    "Viêm mủ nội nhãn – vi khuẩn Gram âm (kháng sinh đầu tay để tiêm nội nhãn)", "pathogen",
    [d("Ceftazidim (người lớn)", "tra tại chỗ 50 mg/ml, 1 giờ/lần; tiêm nội nhãn 2,25 mg/0,1 ml; tiêm dưới kết mạc hoặc cạnh nhãn cầu 100 mg/0,5 ml; toàn thân: truyền TM chậm 500 mg, 1 g hoặc 2 g mỗi 12 giờ")],
    { notes: ["Trẻ em > 2 tháng: toàn thân 30–100 mg/kg/ngày chia 2–3 lần."] }),
  r708(ENDO, "tr. 223", "r-endo-708-amk", ["v8-85"],
    "Viêm mủ nội nhãn – Gram âm, lựa chọn thứ hai sau ceftazidim (đặc biệt chủng kháng gentamycin, tobramycin; trực khuẩn mủ xanh)", "alternative",
    [d("Amikacin (người lớn)", "tra tại chỗ 8 mg/ml, 1 giờ/lần; tiêm nội nhãn 0,4 mg/0,1 ml; toàn thân truyền TM chậm 15 mg/kg/ngày chia 2–3 lần")]),
  r708(ENDO, "tr. 223", "r-endo-708-cipro", ["v8-85"],
    "Viêm mủ nội nhãn – ciprofloxacin (không tác dụng trên kỵ khí)", "alternative",
    [d("Ciprofloxacin (người lớn)", "tra tại chỗ 4 lần/ngày đến 1 giờ/lần; toàn thân uống 500–750 mg liều duy nhất")],
    { notes: ["Trẻ em: uống 20 mg/kg/ngày đến 750 mg/ngày."] }),

  // ===== Viêm tổ chức hốc mắt (v8-87) =====
  r708(ORB, "tr. 220", "r-orb-ceph", ["v8-87"],
    "Viêm tổ chức hốc mắt – kháng sinh phổ rộng đường TM liều cao khi chờ nuôi cấy", "first",
    [d("Một trong", "cefotaxim 2 g TM 3 lần/ngày (8 giờ/lần; trẻ em 50 mg/kg); ceftazidim 1 g TM 3 lần/ngày (trẻ em 30–50 mg/kg)")],
    { duration: "Tiếp theo amoxicilin-clavulanat uống 10 ngày (xem phương án kế tiếp)",
      notes: ["Phải điều trị cấp cứu để phòng viêm màng não, tắc xoang hang, nhiễm khuẩn huyết. Chống viêm: methylprednisolon 1 mg/kg. Phối hợp điều trị viêm xoang, viêm hô hấp, đái tháo đường; dẫn lưu áp xe, lấy dị vật khi có."] }),
  r708(ORB, "tr. 220", "r-orb-ctx-cloxa", ["v8-87"],
    "Viêm tổ chức hốc mắt – phối hợp", "alternative",
    [
      d("Ceftriaxon", "2 g TM/ngày (trẻ em 50 mg/kg)"),
      d("Kết hợp di/flucloxacilin", "2 g TM 4 lần/ngày (6 giờ/lần; trẻ em 50 mg/kg)"),
    ]),
  r708(ORB, "tr. 220", "r-orb-step-down", ["v8-87"],
    "Viêm tổ chức hốc mắt – chuyển đường uống sau đáp ứng", "adjunct",
    [d("Amoxicilin-clavulanat", "875 + 125 mg uống, 2 lần/ngày (trẻ em 22,5 + 3,2 mg/kg)")],
    { duration: "10 ngày" }),
  r708(ORB, "tr. 220", "r-orb-allergy", ["v8-87"],
    "Viêm tổ chức hốc mắt – quá mẫn penicilin hoặc nghi/cấy MRSA", "allergy",
    [d("Vancomycin", "1 g truyền TM chậm mỗi 12 giờ (trẻ em 10 mg/kg mỗi 12 giờ)")],
    { notes: ["Văn bản yêu cầu hội chẩn chuyên khoa truyền nhiễm, vi sinh trong trường hợp quá mẫn penicilin hoặc kháng methicilin."] }),
  r40(ORB, "tr. 20", "r-orb-40", ["v8-87"],
    "Viêm tổ chức hốc mắt – khi chờ nuôi cấy (QĐ 40)", "alternative",
    [d("Cephalosporin thế hệ 3", "15 mg/kg cân nặng, uống hoặc truyền TM")],
    { notes: ["Văn bản không nêu tên thuốc, số lần dùng, thời gian: không đủ để kê đơn, chỉ để đối chiếu với QĐ 708."] }),

  // ===== Viêm túi lệ cấp (v8-88) =====
  r708(DAC, "tr. 228", "r-dac-topical", ["v8-88"],
    "Viêm túi lệ cấp – tại mắt", "first",
    [d("Moxifloxacin nhỏ mắt", "6–8 lần/ngày (có thể dùng quinolon khác: gatifloxacin, levofloxacin)")],
    { notes: ["Tốt nhất lấy mủ túi lệ nuôi cấy và dùng kháng sinh theo kháng sinh đồ; chích tháo mủ, giảm phù nề, giảm đau; sau đợt cấp cần thông hoặc nối thông lệ đạo, hoặc cắt túi lệ."] }),
  r708(DAC, "tr. 228", "r-dac-oral-cefuroxim", ["v8-88"],
    "Viêm túi lệ cấp – toàn thân", "first",
    [d("Cefuroxim", "uống 500–1000 mg/ngày tùy mức độ (trẻ em 15 mg/kg uống 2 lần/ngày, tổng liều không quá 500 mg/ngày)")],
    { duration: "7–10 ngày" }),
  r708(DAC, "tr. 228", "r-dac-oral-amoxclav", ["v8-88"],
    "Viêm túi lệ cấp – toàn thân", "alternative",
    [d("Amoxicilin-clavulanat", "người lớn uống 500/125 mg x 3 lần/ngày (trẻ em 40–80 mg/kg/ngày chia 3 lần)")],
    { duration: "7–10 ngày" }),
  r40(DAC, "tr. 25", "r-dac-40-cefuroxim", ["v8-88"],
    "Viêm túi lệ cấp – kháng sinh toàn thân (QĐ 40)", "alternative",
    [d("Cefuroxim", "250–500 mg/ngày x 2 lần/ngày (trẻ em 10 mg/kg x 2 lần/ngày)")],
    { duration: "5–7 ngày", notes: ["Văn bản ghi '250–500mg/ngày x 2 lần/ngày': khác với QĐ 708, cần thẩm định."] }),
  r40(DAC, "tr. 25", "r-dac-40-cipro", ["v8-88"],
    "Viêm túi lệ cấp – quinolon (QĐ 40)", "alternative",
    [d("Ciprofloxacin", "250–500 mg/ngày x 2 lần/ngày")],
    { duration: "5–7 ngày", notes: ["Không dùng thuốc nhóm quinolon cho trẻ em dưới 12 tuổi (theo QĐ 40)."] }),
  r40(DAC, "tr. 25–26", "r-dac-40-topical", ["v8-88"],
    "Viêm túi lệ cấp – kháng sinh nhỏ mắt (QĐ 40)", "alternative",
    [d("Một trong", "levofloxacin nhỏ mắt 4–6 lần/ngày; moxifloxacin nhỏ mắt 4–6 lần/ngày")],
    { duration: "1–2 tuần" }),
];
