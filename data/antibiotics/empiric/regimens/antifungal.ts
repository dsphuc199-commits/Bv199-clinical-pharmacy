/*
  FILE: data/antibiotics/empiric/regimens/antifungal.ts
  Nguon: BYT QD 3429/QD-BYT (14/07/2021) "Huong dan chan doan va dieu tri nhiem nam xam lan".
  So trang ghi la SO TRANG IN (= trang PDF - 2).
  Thuoc danh dau * trong tai lieu goc (anidulafungin, AmB liposomal, isavuconazole)
  la thuoc co the chua co tai Viet Nam / chua nam trong danh muc: kiem tra danh muc BV199.
  QD 315/QD-BYT (2015): viem am dao do nam (v8-96).
*/

import { d, maker, NO_DOSE } from "./helpers";
import type { Regimen } from "./types";

const r = maker("byt3429");
const STAR =
  "Dấu * trong tài liệu gốc: thuốc có thể chưa lưu hành/chưa có trong danh mục tại cơ sở; kiểm tra danh mục BV199.";
const CAND_ID = "Chỉ định điều trị đặc hiệu khi chẩn đoán chắc chắn. Làm kháng nấm đồ azole cho mọi chủng Candida phân lập; kháng nấm đồ echinocandin nếu đã dùng echinocandin trước đó hoặc nhiễm C. glabrata/C. parapsilosis.";

export const ANTIFUNGAL: Regimen[] = [
  /* ---------------- Candida máu không giảm bạch cầu ---------------- */
  r("4.1.1a Candida máu – không giảm BC hạt/không ghép TBG", "tr. 49", "r-fung-candidemia-first", ["v8-3", "v8-48"],
    "Candida máu đơn độc – không giảm bạch cầu hạt, không ghép tế bào gốc", "first",
    [
      d("Caspofungin", "liều nạp 70 mg, sau đó 50 mg/ngày"),
      d("HOẶC Micafungin", "100 mg/ngày"),
      d("HOẶC Anidulafungin*", "liều nạp 200 mg, sau đó 100 mg/ngày"),
    ],
    { duration: "2 tuần sau khi cấy máu âm tính và cải thiện triệu chứng (không có xâm lấn mô sâu)", notes: [CAND_ID, STAR, "Khám mắt trong tuần đầu; rút catheter TM trung tâm sớm nếu nghi liên quan catheter."] }),
  r("4.1.1a Candida máu – không giảm BC hạt/không ghép TBG", "tr. 49", "r-fung-candidemia-alt", ["v8-3", "v8-48"],
    "Candida máu đơn độc – không giảm bạch cầu hạt, không ghép tế bào gốc", "alternative",
    [d("Fluconazol", "liều nạp 800 mg (12 mg/kg), sau đó 400 mg (6 mg/kg)/ngày, uống hoặc truyền TM (TM nếu không dùng được đường uống)")],
    { duration: "2 tuần sau khi cấy máu âm tính và cải thiện triệu chứng", notes: ["Thay thế echinocandin khi bệnh nhân không nặng và Candida không kháng fluconazol.", CAND_ID] }),
  r("4.1.1a Candida máu – không giảm BC hạt/không ghép TBG", "tr. 49", "r-fung-candidemia-other", ["v8-3", "v8-48"],
    "Candida máu đơn độc – không giảm bạch cầu hạt, không ghép tế bào gốc", "alternative",
    [d("Dẫn xuất lipid của Amphotericin B", "3–5 mg/kg/ngày")],
    { notes: ["Khi không dung nạp hoặc kháng với các thuốc chống nấm khác.", CAND_ID] }),
  r("4.1.1a Candida máu – xuống thang", "tr. 49–50", "r-fung-candidemia-stepdown", ["v8-3"],
    "Candida máu đơn độc – xuống thang điều trị", "adjunct",
    [
      d("Fluconazol (xuống thang từ echinocandin hoặc AmB, thường sau 7 ngày)", "theo liều duy trì ở trên; nếu lâm sàng ổn định, chủng nhạy fluconazol và cấy máu âm tính"),
      d("C. glabrata nhạy: Fluconazol liều cao HOẶC Voriconazol", "fluconazol 800 mg (12 mg/kg)/ngày; voriconazol 200–300 mg (3–4 mg/kg) hai lần/ngày"),
      d("C. krusei: Voriconazol (xuống thang uống)", "400 mg (6 mg/kg) hai lần/ngày cho 2 liều, sau đó 200 mg (3 mg/kg) hai lần/ngày"),
    ],
    { notes: ["Điều kiện xuống thang: lâm sàng ổn định, chủng nhạy, cấy máu sau điều trị khởi đầu âm tính."] }),

  /* ---------------- Candida máu có giảm bạch cầu hạt ---------------- */
  r("4.1.1a Candida máu – giảm BC hạt/ghép TBG", "tr. 50", "r-fung-candidemia-neut-first", ["v8-121", "v8-117"],
    "Candida máu – có giảm bạch cầu hạt hoặc ghép tế bào gốc tạo máu", "first",
    [
      d("Caspofungin", "liều nạp 70 mg, sau đó 50 mg/ngày"),
      d("HOẶC Micafungin", "100 mg/ngày"),
      d("HOẶC Anidulafungin*", "liều nạp 200 mg, sau đó 100 mg/ngày"),
    ],
    { duration: "2 tuần sau khi cấy máu âm tính, cải thiện triệu chứng và hồi phục giảm bạch cầu", notes: [CAND_ID, STAR, "Khám đáy mắt (hắc mạc, thủy tinh thể) khi bạch cầu hồi phục."] }),
  r("4.1.1a Candida máu – giảm BC hạt/ghép TBG", "tr. 50", "r-fung-candidemia-neut-alt", ["v8-121", "v8-117"],
    "Candida máu – có giảm bạch cầu hạt hoặc ghép tế bào gốc tạo máu", "alternative",
    [d("Dẫn xuất lipid của Amphotericin B", "3–5 mg/kg/ngày")],
    { notes: ["Khi không dung nạp hoặc kháng với các thuốc chống nấm khác."] }),
  r("4.1.1a Candida máu – giảm BC hạt/ghép TBG", "tr. 50", "r-fung-candidemia-neut-other", ["v8-121", "v8-117"],
    "Candida máu – có giảm bạch cầu hạt hoặc ghép tế bào gốc tạo máu", "alternative",
    [d("Fluconazol", "liều nạp 800 mg (12 mg/kg), sau đó 400 mg (6 mg/kg)/ngày")],
    { notes: ["Chỉ khi bệnh nhân không nặng và Candida không kháng fluconazol.", "Xuống thang: fluconazol 400 mg (6 mg/kg)/ngày hoặc voriconazol 400 mg (6 mg/kg) hai lần/ngày trong 2 ngày rồi 200–300 mg (3–4 mg/kg) hai lần/ngày, nếu ổn định và chủng nhạy.", "C. krusei: echinocandin, dẫn xuất lipid của amphotericin B hoặc voriconazol."] }),

  /* ---------------- Điều trị kinh nghiệm xâm lấn Candida ---------------- */
  r("4.1.1b Điều trị kinh nghiệm – bệnh máu ác tính", "tr. 51", "r-fung-emp-heme-prior", ["v8-117"],
    "Bệnh máu ác tính/ghép TBG, sốt > 38 °C, giảm BC hạt, KS không uống > 96 giờ – đã điều trị/dự phòng kháng nấm hoặc có dấu tổn thương cơ quan", "first",
    [
      d("Caspofungin", "liều nạp 70 mg, sau đó 50 mg/ngày (cân nặng < 80 kg)"),
      d("HOẶC Micafungin", "100 mg/ngày"),
      d("HOẶC Anidulafungin", "liều nạp 200 mg, sau đó 100 mg/ngày"),
    ],
    { notes: ["Nếu không cải thiện sau 3–5 ngày: cân nhắc Amphotericin B liposomal* 3–5 mg/kg/ngày.", STAR] }),
  r("4.1.1b Điều trị kinh nghiệm – bệnh máu ác tính", "tr. 51", "r-fung-emp-heme-naive", ["v8-117"],
    "Bệnh máu ác tính/ghép TBG, chỉ sốt và giảm BC hạt, chưa dự phòng kháng nấm trước đó", "first",
    [
      d("Fluconazol", "800 mg (12 mg/kg) liều đầu, sau đó 400 mg (6 mg/kg)/ngày; TM nếu không uống được"),
      d("HOẶC Posaconazol", "300 mg/ngày"),
      d("HOẶC Voriconazol", "400 mg (6 mg/kg) hai lần/ngày cho 2 liều, sau đó 200 mg (3 mg/kg) hai lần/ngày"),
    ],
    { notes: ["Nếu không cải thiện sau 3–5 ngày: cân nhắc Amphotericin B liposomal* 3–5 mg/kg/ngày.", "Nghi nhiễm nấm sợi: không dùng fluconazol (không có tác dụng trên nấm sợi).", STAR] }),
  r("4.1.1b Điều trị kinh nghiệm – không có bệnh máu ác tính", "tr. 51–52", "r-fung-emp-nonheme-first", ["v8-3", "v8-48"],
    "Nghi nhiễm Candida xâm lấn, không có bệnh máu ác tính (Candida Score ≥ 3 và/hoặc yếu tố Ostrosky-Zeichner)", "first",
    [
      d("Caspofungin", "liều nạp 70 mg, sau đó 50 mg/ngày"),
      d("HOẶC Micafungin", "100 mg/ngày"),
      d("HOẶC Anidulafungin*", "liều nạp 200 mg, sau đó 100 mg/ngày"),
    ],
    { duration: "Giống điều trị đặc hiệu", notes: ["Chỉ định khi ≥ 1 bệnh phẩm không vô trùng cấy ra Candida, kèm yếu tố lâm sàng gợi ý.", STAR] }),
  r("4.1.1b Điều trị kinh nghiệm – không có bệnh máu ác tính", "tr. 52", "r-fung-emp-nonheme-alt", ["v8-3", "v8-48"],
    "Nghi nhiễm Candida xâm lấn, không có bệnh máu ác tính", "alternative",
    [d("Fluconazol", "liều nạp 800 mg (12 mg/kg), sau đó 400 mg (6 mg/kg)/ngày")],
    { notes: ["Nếu chưa dùng azol trước đó và không có chủng Candida cư trú kháng azol.", "Lựa chọn khác: dẫn xuất lipid của amphotericin B 3–5 mg/kg/ngày khi không dung nạp các thuốc khác."] }),

  /* Candida ổ bụng (v8-48): QĐ 3429 tr. 53–54 ghi "điều trị thuốc chống nấm tương tự điều trị
     nhiễm nấm Candida máu hoặc điều trị theo kinh nghiệm ở bệnh nhân ICU không giảm bạch cầu"
     -> dùng chung các phác đồ Candida máu/kinh nghiệm ở trên (diseaseIds có v8-48).
     Kiểm soát nguồn nhiễm (dẫn lưu/làm sạch ổ bụng) là bắt buộc; thời gian điều trị dựa vào
     kiểm soát nguồn và đáp ứng lâm sàng. */

  /* ---------------- Candida nội tâm mạc ---------------- */
  r("4.1.2c Bảng 4.3 Candida nội tâm mạc (van tự nhiên)", "tr. 54", "r-fung-ie-initial", ["v8-122"],
    "Viêm nội tâm mạc do Candida – điều trị ban đầu", "first",
    [
      d("Dẫn xuất lipid của Amphotericin B ± flucytosin", "AmB 3–5 mg/kg/ngày; flucytosin 25 mg/kg x 4 lần/ngày (tùy chọn)"),
      d("HOẶC Echinocandin liều cao", "caspofungin 150 mg/ngày, micafungin 150 mg/ngày hoặc anidulafungin* 200 mg/ngày"),
    ],
    { duration: "Ít nhất 6 tuần sau phẫu thuật thay van; dài hơn nếu áp xe van/biến chứng", notes: [STAR, "Tài liệu gốc ghi \"echinocandin đường uống liều cao\" nhưng thuốc nêu là dạng tiêm truyền (caspofungin, micafungin, anidulafungin): cần thẩm định cách ghi này."] }),
  r("4.1.2c Bảng 4.3 Candida nội tâm mạc (van tự nhiên)", "tr. 54", "r-fung-ie-maint", ["v8-122"],
    "Viêm nội tâm mạc do Candida – điều trị duy trì", "adjunct",
    [
      d("Fluconazol", "400–800 mg (6–12 mg/kg); chủng nhạy, lâm sàng ổn định, cấy máu âm tính"),
      d("HOẶC Voriconazol uống", "200–300 mg (3–4 mg/kg) hai lần/ngày"),
      d("HOẶC Posaconazol uống", "300 mg/ngày (chủng không nhạy fluconazol)"),
    ],
    { notes: ["Không thể thay van: kéo dài fluconazol 400–800 mg (6–12 mg/kg)/ngày."] }),

  /* ---------------- Candida xương khớp ---------------- */
  r("4.1.2d Bảng 4.4 Candida cơ xương khớp", "tr. 54", "r-fung-osteo", ["v8-124"],
    "Nhiễm Candida cơ xương khớp", "first",
    [
      d("Fluconazol", "400 mg (6 mg/kg)/ngày"),
      d("HOẶC Echinocandin", "caspofungin 50–70 mg/ngày, micafungin 100 mg/ngày hoặc anidulafungin* 100 mg/ngày, ít nhất 2 tuần; cân nhắc chuyển fluconazol uống liều tương đương"),
    ],
    { duration: "Fluconazol 6–12 tháng", notes: ["Thay thế: dẫn xuất lipid của AmB 3–5 mg/kg/ngày ít nhất 2 tuần.", "Phẫu thuật tháo khớp/dẫn lưu/tháo khớp giả trong mọi trường hợp viêm khớp hoại tử.", STAR] }),

  /* ---------------- Aspergillus phổi xâm lấn ---------------- */
  r("4.2.1a Aspergillus phổi xâm lấn – điều trị đặc hiệu", "tr. 55–56", "r-fung-ipa-first", ["v8-50", "v8-117"],
    "Aspergillus phổi xâm lấn – không giảm BC hạt, không ghép TBG", "first",
    [
      d("Voriconazol", "ngày 1: 6 mg/kg mỗi 12 giờ truyền TM; các ngày sau 4 mg/kg mỗi 12 giờ truyền TM (cân nhắc chuyển uống liều tương đương)"),
      d("HOẶC Isavuconazol*", "200 mg mỗi 8 giờ cho 6 liều đầu, sau đó 200 mg/ngày"),
    ],
    { duration: "Tối thiểu 6–12 tuần, có thể dài hơn tùy mức độ/thời gian ức chế miễn dịch và đáp ứng", notes: [STAR, "Nên theo dõi nồng độ đáy voriconazol (đích điều trị nặng 2–6 mg/L), itraconazol, posaconazol, isavuconazol trong điều trị."] }),
  r("4.2.1a Aspergillus phổi xâm lấn – điều trị đặc hiệu", "tr. 56", "r-fung-ipa-alt", ["v8-50", "v8-117"],
    "Aspergillus phổi xâm lấn – không giảm BC hạt, không ghép TBG", "alternative",
    [
      d("Amphotericin B liposomal*", "3 mg/kg/ngày truyền TM, tối đa 5 mg/kg/ngày"),
      d("Echinocandin (khi chống chỉ định azol): Caspofungin", "70 mg ngày 1, sau đó 50 mg/ngày truyền TM"),
    ],
    { notes: ["Echinocandin không khuyến cáo là lựa chọn đầu tiên.", STAR] }),
  r("4.2.1a Aspergillus phổi xâm lấn – giảm BC hạt", "tr. 56", "r-fung-ipa-neut", ["v8-50", "v8-117"],
    "Aspergillus phổi xâm lấn – giảm bạch cầu hạt, không ghép tế bào gốc", "first",
    [d("Isavuconazol*", "200 mg truyền TM 3 lần/ngày trong 1–2 ngày đầu, sau đó uống 200 mg/ngày")],
    { notes: [STAR, "Bảng 4.6 (tr. 57) ghi lựa chọn ưu tiên cho bệnh nhân giảm bạch cầu hạt là isavuconazol* (200 mg TM mỗi 8 giờ trong 48 giờ đầu, sau đó 200 mg/ngày)."] }),
  r("4.2.1a Aspergillus phổi xâm lấn – ghép TBG đồng loài và nhóm khác", "tr. 56", "r-fung-ipa-hsct", ["v8-50", "v8-117"],
    "Aspergillus phổi xâm lấn – ghép TBG khác loài (có/không giảm BC hạt) và nhóm khác không giảm BC hạt (ưu tiên giảm dần)", "alternative",
    [
      d("Voriconazol", "TM 6 mg/kg mỗi 12 giờ hoặc uống 400 mg ngày đầu, sau đó 2–4 mg/kg TM"),
      d("HOẶC Amphotericin B liposomal*", "3 mg/kg/ngày, tối đa 5 mg/kg/ngày"),
      d("HOẶC Voriconazol + Anidulafungin*", "voriconazol 6 mg/kg rồi 4 mg/kg hai lần/ngày, sau 1 tuần uống 300 mg hai lần/ngày; anidulafungin 200/100 mg"),
      d("HOẶC Caspofungin", "70 mg TM ngày đầu, sau đó 50 mg (cân nặng < 80 kg)"),
      d("HOẶC Itraconazol TM", "200 mg mỗi 12 giờ trong ngày đầu, sau đó 200 mg/ngày"),
      d("HOẶC Amphotericin B phức hợp lipid / deoxycholat", "ABLC 5 mg/kg; cAmB 0,5–1 mg/kg/ngày, tối đa 1,5 mg/kg/ngày"),
    ],
    { notes: [STAR, "Tài liệu gốc ghi nhóm bệnh nhân hơi lặp ý (\"ghép TBG khác loài... và nhóm khác không giảm BC hạt\"); trình bày nguyên văn thứ tự ưu tiên."] }),
  r("4.2.1b Aspergillus phổi – điều trị kinh nghiệm", "tr. 57–58", "r-fung-ipa-emp", ["v8-50", "v8-117"],
    "Nghi Aspergillus phổi xâm lấn – điều trị kinh nghiệm (bệnh máu ác tính/ghép TBG có giảm BC hạt, hoặc nhóm nguy cơ chọn lọc)", "first",
    [
      d("Voriconazol", "ngày 1: 6 mg/kg TM 2 lần/ngày hoặc uống 400 mg x 2 lần/ngày; các ngày sau 4 mg/kg TM hoặc uống 200–300 mg x 2 lần/ngày"),
      d("HOẶC Amphotericin B liposomal* / ABLC / cAmB", "3 mg/kg/ngày; 5 mg/kg/ngày; 0,5–1 mg/kg/ngày"),
      d("HOẶC Itraconazol TM", "200 mg, 2 lần/ngày"),
      d("HOẶC Caspofungin", "70 mg TM ngày đầu, sau đó 50 mg/ngày (cân nặng < 80 kg)"),
      d("HOẶC Micafungin", "100 mg/ngày"),
    ],
    { notes: ["Với bệnh nhân sốt, tổn thương phổi, đã loại trừ lao..., không đáp ứng kháng sinh trong nhóm chọn lọc (CT ngực có thâm nhiễm mới/tổn thương tắc mạch/ho máu; ghép tạng đặc; corticosteroid > 3 tuần; COPD/bệnh phổi mạn; ARDS; xơ gan nằm ICU > 7 ngày; cúm nặng...): voriconazol là đầu tay, amphotericin B là thay thế (tr. 58).", STAR] }),
  r("4.2.1c Aspergillus – dự phòng nhóm nguy cơ cao", "tr. 58–59", "r-fung-ipa-prophylaxis", ["v8-117"],
    "Dự phòng nấm xâm lấn – bệnh máu ác tính/ghép tủy đồng loài/rối loạn sinh tủy, BC trung tính < 0,5 x 10^9/L kéo dài > 7 ngày", "adjunct",
    [
      d("Posaconazol", "200 mg 3 lần/ngày nhũ dịch uống hoặc 300 mg x 4 lần/ngày (khuyến cáo A theo tài liệu gốc)"),
      d("Amphotericin B liposomal* khí dung", "12,5 mg x 2 lần/tuần (khuyến cáo B)"),
      d("HOẶC Voriconazol / Micafungin", "voriconazol 200 mg x 2 lần/ngày; micafungin 50 mg/ngày (khuyến cáo C)"),
    ],
    { notes: ["Đây là dự phòng, không phải điều trị kinh nghiệm. Nhóm không có bệnh máu ác tính (ghép tạng đặc, HIV CD4 < 100, ICU nguy cơ cao): caspofungin 70 mg ngày đầu rồi 50 mg/ngày; AmB liposomal* 3 mg/kg hoặc ABLC 5 mg/kg/ngày; voriconazol 6 mg/kg x 2 lần ngày 1 rồi 4 mg/kg x 2 lần; itraconazol TM 200 mg/ngày (tr. 58–59).", STAR] }),
  r("4.2.2 Bảng 4.7 Aspergillus ngoài phổi", "tr. 59–60", "r-fung-asp-sinus", ["v8-126"],
    "Aspergillus xâm lấn xoang mũi", "first",
    [d("Voriconazol", "ngày 1: 6 mg/kg mỗi 12 giờ TM (hoặc uống 400 mg), sau đó 4 mg/kg mỗi 12 giờ TM (hoặc uống 200–300 mg)")],
    { notes: ["Thay thế: Amphotericin B liposomal*. Kết hợp phẫu thuật cắt u nấm (Bảng 4.7: \"Như nhiễm nấm TKTU\").", STAR] }),

  /* ---------------- Aspergillus giác mạc ---------------- */
  r("4.2.2 Bảng 4.7 Aspergillus ngoài phổi – giác mạc", "tr. 60", "r-fung-keratitis", ["v8-89"],
    "Nhiễm nấm giác mạc (theo Bảng 4.7 – Aspergillus giác mạc)", "first",
    [d("Voriconazol nhỏ tại chỗ HOẶC natamycin 5%", NO_DOSE+" (điều trị tại chỗ)")],
    { notes: ["QĐ 3429 chỉ nêu điều trị tại chỗ cho Aspergillus giác mạc, không nêu liều/tần suất. Nấm giác mạc do tác nhân khác chưa có hướng dẫn trong tài liệu này."] }),

  /* ---------------- Cryptococcus ---------------- */
  r("4.3.2a Cryptococcus – viêm màng não, HIV (+)", "tr. 63–64", "r-fung-crypto-hiv-induct", ["v8-51"],
    "Viêm màng não Cryptococcus ở người HIV (+) – điều trị tấn công (ít nhất 2 tuần)", "first",
    [
      d("Amphotericin B deoxycholat", "0,7–1 mg/kg TM, 1 lần/ngày"),
      d("HOẶC Amphotericin B liposomal*", "3–6 mg/kg TM, 1 lần/ngày"),
      d("VÀ Flucytosin", "100 mg/kg/ngày, chia 4 lần uống mỗi 6 giờ"),
    ],
    { duration: "Ít nhất 2 tuần", notes: [STAR, "Phụ nữ có thai: an toàn nhất là ABLC hoặc AmB liposomal*; flucytosin và fluconazol > 400 mg/ngày có thể gây dị tật thai."] }),
  r("4.3.2a Cryptococcus – viêm màng não, HIV (+)", "tr. 64", "r-fung-crypto-hiv-alt", ["v8-51"],
    "Viêm màng não Cryptococcus ở người HIV (+) – điều trị tấn công, thay thế", "alternative",
    [
      d("ABLC + flucytosin", "ABLC 5 mg/kg/ngày; flucytosin 100 mg/kg/ngày chia 4 lần"),
      d("HOẶC AmB liposomal* + fluconazol", "3–6 mg/kg/ngày + fluconazol 800 mg/ngày uống hoặc TM"),
      d("HOẶC AmB deoxycholat + fluconazol", "0,7–1 mg/kg/ngày + fluconazol 800 mg/ngày"),
      d("HOẶC Fluconazol + flucytosin", "fluconazol 400 hoặc 800 mg/ngày + flucytosin 100 mg/kg/ngày chia 4 lần"),
      d("HOẶC Fluconazol đơn độc", "1200 mg/ngày uống hoặc TM"),
    ],
    { notes: [STAR] }),
  r("4.3.2a Cryptococcus – viêm màng não, HIV (+)", "tr. 64", "r-fung-crypto-hiv-consol", ["v8-51"],
    "Viêm màng não Cryptococcus ở người HIV (+) – củng cố và duy trì", "adjunct",
    [
      d("Củng cố (ít nhất 8 tuần, sau 2 tuần tấn công thành công): Fluconazol", "400 mg/ngày uống hoặc TM (thay thế: itraconazol 400 mg/ngày chia 2 lần)"),
      d("Duy trì: Fluconazol", "200 mg/ngày uống, ít nhất 1 năm"),
    ],
    { duration: "Củng cố ≥ 8 tuần; duy trì ≥ 1 năm", notes: ["Tiêu chuẩn ngừng duy trì: điều trị ban đầu đầy đủ + duy trì ≥ 1 năm, không triệu chứng, CD4 ≥ 100/mm³ trong ≥ 3 tháng và ART thành công; trẻ em xem tài liệu gốc tr. 64.", "Dẫn lưu DNT (chọc dò) khi tăng áp lực nội sọ."] }),
  r("4.3.1b Cryptococcus – HIV (−), có giảm miễn dịch hoặc tổn thương TKTW", "tr. 62–63", "r-fung-crypto-nohiv-severe", ["v8-51"],
    "Cryptococcus ở người HIV (−) có giảm miễn dịch, tổn thương thần kinh trung ương hoặc tổn thương phổi/ngoài phổi nặng – điều trị tấn công", "first",
    [
      d("Amphotericin B deoxycholat HOẶC AmB liposomal* HOẶC ABLC", "0,7–1 mg/kg/ngày; 3–6 mg/kg/ngày; 5 mg/kg/ngày TM"),
      d("VÀ Flucytosin", "100 mg/kg/ngày, chia 4 lần uống mỗi 6 giờ"),
    ],
    { duration: "2 tuần, sau đó nếu DNT âm tính: fluconazol 400–800 mg/ngày hoặc itraconazol 400 mg/ngày trong 8 tuần; duy trì fluconazol 200 mg/ngày", notes: ["Lựa chọn thay thế (6–10 tuần): các phối hợp AmB ± flucytosin/fluconazol hoặc fluconazol 400–800 mg/ngày + flucytosin (tr. 63).", STAR] }),
  r("4.3.1a Cryptococcus – HIV (−), thể nhẹ", "tr. 62", "r-fung-crypto-nohiv-mild", ["v8-128"],
    "Cryptococcus ngoài thần kinh trung ương – người HIV (−) không giảm miễn dịch, thể nhẹ (phổi hoặc 1 ổ ngoài phổi)", "first",
    [
      d("Fluconazol", "400–800 mg/ngày uống 1 lần"),
      d("HOẶC Itraconazol", "400 mg/ngày uống 1–2 lần"),
    ],
    { duration: "6 tháng", notes: ["Thay thế khi chống chỉ định azol: AmB deoxycholat 0,7–1 mg/kg/ngày, AmB liposomal* 3–6 mg/kg/ngày hoặc ABLC 5 mg/kg/ngày.", "Không cải thiện sau 2 tuần: chuyển phác đồ AmB ± flucytosin (tr. 62).", STAR] }),
  r("4.3.2b–c Cryptococcus ngoài TKTW – HIV (+)", "tr. 64–65", "r-fung-crypto-hiv-extra", ["v8-128"],
    "Cryptococcus ngoài thần kinh trung ương ở người HIV (+)", "first",
    [d("Ngoài phổi hoặc phổi lan tỏa không tổn thương TKTW: điều trị như viêm màng não Cryptococcus (xem trên)", "như viêm màng não")],
    { notes: ["Tổn thương phổi một ổ, không tổn thương TKTW, kháng nguyên Cryptococcus máu dương: fluconazol 400 mg/ngày uống trong 12 tháng (tr. 65)."] }),

  /* ---------------- Pneumocystis ---------------- */
  r("4.4 Viêm phổi do Pneumocystis jirovecii", "tr. 65", "r-fung-pcp-first", ["v8-53"],
    "Viêm phổi do Pneumocystis jirovecii", "first",
    [d("Trimethoprim-sulfamethoxazol", "TMP 15–20 mg/kg/ngày + SMX 75–100 mg/kg/ngày, chia 4 liều")],
    { duration: "Thông thường 3 tuần (đáp ứng lâm sàng sau ít nhất 7–10 ngày)", notes: ["Đường tĩnh mạch: cần định lượng nồng độ SMX hoặc TMP (tài liệu ghi \"cần thiết và bắt buộc\")."] }),
  r("4.4 Viêm phổi do Pneumocystis jirovecii", "tr. 65", "r-fung-pcp-alt", ["v8-53"],
    "Viêm phổi do Pneumocystis jirovecii – thay thế", "alternative",
    [
      d("Primaquin + Clindamycin", "primaquin 30 mg/ngày; clindamycin 600 mg ba lần/ngày"),
      d("HOẶC Atovaquon", "750 mg hai lần/ngày"),
      d("HOẶC Pentamidin TM", "4 mg/kg/ngày"),
    ]),
  r("4.4 Viêm phổi do Pneumocystis jirovecii", "tr. 65", "r-fung-pcp-steroid", ["v8-53"],
    "Pneumocystis ở người HIV, trung bình–nặng có giảm oxy máu (PaO2 < 70 mmHg khí trời hoặc A-a > 35 mmHg)", "adjunct",
    [d("Prednison (điều trị bổ sung)", "40 mg hai lần/ngày x 5 ngày, sau đó 40 mg/ngày từ ngày 6 đến 11, rồi 20 mg/ngày")],
    { notes: ["Tài liệu gốc kết thúc liều bằng \"đến ngày thứ 2\" (lỗi in): cần đối chiếu bản gốc về ngày kết thúc."] }),
  r("4.4 Dự phòng Pneumocystis bằng co-trimoxazol", "tr. 65", "r-fung-pcp-prophylaxis", ["v8-118"],
    "Dự phòng Pneumocystis – người nhiễm HIV và trẻ phơi nhiễm HIV", "first",
    [d("Co-trimoxazol", "QĐ 3429 không nêu liều dự phòng trong mục này (Nguồn BYT không nêu liều)")],
    { notes: ["Chỉ định: trẻ phơi nhiễm HIV từ 4–6 tuần tuổi; trẻ ≤ 5 tuổi nhiễm HIV; trẻ ≥ 5 tuổi, người lớn, phụ nữ có thai/cho con bú khi CD4 ≤ 350/mm³ hoặc giai đoạn lâm sàng 3–4. Ngừng khi ARV ≥ 12 tháng, lâm sàng ổn định và CD4 > 350/mm³ hoặc tải lượng HIV < 200 bản sao/mL.", "Đây là dự phòng, không phải điều trị kinh nghiệm."] }),

  /* ---------------- Talaromyces ---------------- */
  r("4.5 Talaromyces marneffei", "tr. 65–66", "r-fung-tm-first", ["v8-130"],
    "Talaromyces marneffei mức độ trung bình–nặng", "first",
    [
      d("Dẫn xuất lipid của Amphotericin B (hoặc ABLC)", "3–5 mg/kg/ngày TM (ABLC 5 mg/kg/ngày) trong 2 tuần"),
      d("Tiếp theo: Itraconazol", "200 mg x 2 lần/ngày trong 10 tuần"),
    ],
    { notes: ["Thể thần kinh trung ương: dẫn xuất lipid của AmB 5 mg/kg/ngày 4–6 tuần, tiếp theo itraconazol 200 mg x 2 lần/ngày 10 tuần.", "Phân độ: nặng = nhiều cơ quan + suy hô hấp/tuần hoàn; trung bình = nhiều cơ quan không suy; nhẹ = chỉ tổn thương da."] }),
  r("4.5 Talaromyces marneffei", "tr. 66", "r-fung-tm-alt", ["v8-130"],
    "Talaromyces marneffei – thay thế/thể nhẹ", "alternative",
    [
      d("Trung bình–nặng: Voriconazol TM rồi uống", "6 mg/kg mỗi 12 giờ ngày đầu, sau đó 4 mg/kg mỗi 12 giờ x 3 ngày; rồi uống 200 mg x 2 lần/ngày trong 12 tuần"),
      d("Nhẹ: Itraconazol uống (không cần AmB)", "200 mg x 2 lần/ngày trong 8–12 tuần"),
      d("Nhẹ (thay thế): Voriconazol uống", "400 mg ngày đầu, sau đó 200 mg x 2 lần/ngày trong 12 tuần"),
    ]),

  /* ---------------- Histoplasma ---------------- */
  r("4.6.2 Histoplasma phổi", "tr. 67", "r-fung-histo", ["v8-129"],
    "Histoplasma phổi cấp mức độ trung bình–nặng", "first",
    [
      d("Dẫn xuất lipid của Amphotericin B", "3–5 mg/kg/ngày TM trong 1–2 tuần"),
      d("Tiếp theo: Itraconazol", "200 mg 3 lần/ngày x 3 ngày, sau đó 200 mg/ngày; tổng thời gian itraconazol 12 tuần"),
    ],
    { notes: ["Thay thế: AmB deoxycholat 0,7–1,0 mg/kg/ngày nếu nguy cơ độc thận thấp.", "Methylprednisolon 0,5–1,0 mg/kg/ngày TM trong 1–2 tuần đầu nếu có giảm oxy máu/suy hô hấp.", "Thể nhẹ–trung bình: thường không cần điều trị; triệu chứng > 1 tháng: itraconazol 200 mg 3 lần/ngày x 3 ngày rồi 200 mg 1–2 lần/ngày 6–12 tuần. Thể mạn: itraconazol như trên ít nhất 1 năm (có thể 18–24 tháng)."] }),

  /* ---------------- Nấm hiếm ---------------- */
  r("4.7 Nấm hiếm gặp – Zygomyces", "tr. 68", "r-fung-mucor", ["v8-52"],
    "Mucormycosis (Zygomyces)", "first",
    [
      d("Dẫn xuất lipid của Amphotericin B", "5 mg/kg/ngày"),
      d("HOẶC Amphotericin B deoxycholat", "0,7–1 mg/kg/ngày"),
    ],
    { notes: ["Thay thế: posaconazol 400 mg uống hai lần/ngày hoặc 200 mg uống 4 lần/ngày."] }),
  r("4.7 Nấm hiếm gặp – Fusarium", "tr. 68", "r-fung-fusarium", ["v8-131"],
    "Nhiễm nấm Fusarium", "first",
    [
      d("Voriconazol HOẶC Posaconazol HOẶC dẫn xuất lipid của Amphotericin B", "QĐ 3429 không nêu liều riêng cho Fusarium (Nguồn BYT không nêu liều)"),
    ]),
];
