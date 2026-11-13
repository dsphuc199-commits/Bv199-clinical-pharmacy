"use client";

/*
  Viem khop nhiem khuan khop tu nhien – GEIO (SEIMC), SEIP, SECOT 2024 (ban day du tieng Anh).
  Nguon: https://seimc.org/wp-content/uploads/2025/05/seimc-geio-gc-2024-Artritis_Septica.pdf
  - Chi ghi noi dung co trong van ban; muc khuyen cao (A–D, I–III) theo Bang 1 cua van ban.
  - Lieu: chi ghi khi van ban neu; thuoc khong co lieu -> ghi ro "Hướng dẫn không nêu liều".
  - Noi dung lay tu phan ban luan (khong phai khuyen cao danh so) ghi nhan "Bàn luận".
  - Khong ap dung cho nhiem khuan khop nhan tao va viem khop do virus (pham vi van ban).
*/

import { useMemo, useState } from "react";

type Item = { text: string; grade?: string; src: string };
type Pop = "adult" | "child";
type Stage = "empiric" | "directed";

const SRC = "GEIO–SEIMC/SEIP/SECOT 2024";
const URL = "https://seimc.org/wp-content/uploads/2025/05/seimc-geio-gc-2024-Artritis_Septica.pdf";
const NO_DOSE = "Thuốc không kèm liều: hướng dẫn không nêu liều – tra liều tại module Hiệu chỉnh liều.";

/* ---------------- Kinh nghiem ---------------- */
const CHILD_AGES = [
  { id: "lt3m", label: "< 3 tháng" },
  { id: "3m2y", label: "3 tháng – 2 tuổi" },
  { id: "2y4y", label: "2 – 4 tuổi" },
  { id: "gt4y", label: "> 4 tuổi" },
] as const;
type ChildAge = (typeof CHILD_AGES)[number]["id"];

const CHILD_EMPIRIC: Record<ChildAge, Item[]> = {
  lt3m: [{ text: "Cloxacilin hoặc cefazolin, phối hợp cefotaxim hoặc gentamicin (tránh dùng đồng thời 2 cephalosporin).", grade: "A-II", src: "Mục VIII.3, tr. 6, 31" }],
  "3m2y": [
    { text: "Cefuroxim.", grade: "A-II", src: "Mục VIII.3, tr. 6, 32" },
    { text: "Thay thế: cloxacilin + cefotaxim, hoặc amoxicilin-acid clavulanic.", grade: "A-II", src: "Mục VIII.3, tr. 6, 32" },
  ],
  "2y4y": [
    { text: "Cefazolin.", grade: "A-II", src: "Mục VIII.3, tr. 6, 32" },
    { text: "Thay thế: cefuroxim, để bao phủ H. influenzae và S. pneumoniae ở trẻ tiêm chủng chưa đầy đủ.", grade: "A-II", src: "Mục VIII.3, tr. 6, 32" },
  ],
  gt4y: [
    { text: "Cefazolin hoặc cloxacilin.", grade: "A-II", src: "Mục VIII.3, tr. 6, 32" },
    { text: "Bàn luận: cefazolin, cloxacilin hoặc clindamycin tùy dịch tễ tại chỗ.", src: "Mục VIII, tr. 31" },
  ],
};

type Context = { id: string; label: string; pop: Pop | "both"; agents: string; items: Item[]; note?: string };
const T4 = "Bảng 4, tr. 72–73";
const ALLERGY_BL = "dị ứng beta-lactam";

const CONTEXTS: Context[] = [
  {
    id: "none", label: "Không có yếu tố nguy cơ tác nhân đặc biệt hoặc vi khuẩn kháng thuốc; nhuộm Gram dịch khớp âm tính", pop: "adult",
    agents: "S. aureus, liên cầu, trực khuẩn Gram âm thường gặp",
    items: [
      { text: "Cloxacilin + ceftriaxon, hoặc amoxicilin-acid clavulanic đơn trị.", grade: "B-III", src: "Mục VIII.2, tr. 6, 31" },
    ],
  },
  {
    id: "gramneg", label: "Nghi trực khuẩn Gram âm (người cao tuổi, nhiễm khuẩn bệnh viện, suy giảm miễn dịch, tiêm chích ma túy)", pop: "adult",
    agents: "Trực khuẩn Gram âm, kèm S. aureus",
    items: [
      { text: "Phác đồ có cephalosporin thế hệ 3: ceftriaxon 2 g tĩnh mạch mỗi 24 giờ, hoặc cefotaxim 2 g tĩnh mạch mỗi 8 giờ.", src: "Bàn luận, Mục VIII, tr. 30" },
      { text: "Nghi P. aeruginosa: ceftazidim.", src: "Bàn luận, Mục VIII, tr. 30" },
      { text: "Nghi nhiễm nhiều vi khuẩn (ví dụ đái tháo đường, nhiễm khuẩn khớp nhỏ bàn chân, ngón chân): amoxicilin-acid clavulanic, hoặc piperacilin-tazobactam nếu nghi P. aeruginosa.", src: "Bàn luận, Mục VIII, tr. 30" },
      { text: "Nguy cơ trực khuẩn Gram âm đa kháng cao: khởi trị bằng carbapenem cho đến khi có kháng sinh đồ.", src: "Bàn luận, Mục VIII, tr. 30" },
    ],
    note: "Luôn có kháng sinh tác dụng trên S. aureus khi nhuộm Gram âm tính (A-II, Mục VIII.1). Ceftazidim, amoxicilin-acid clavulanic, piperacilin-tazobactam, carbapenem: hướng dẫn không nêu liều.",
  },
  {
    id: "mrsa", label: "Cân nhắc bao phủ MRSA theo kinh nghiệm", pop: "adult",
    agents: "S. aureus kháng methicilin",
    items: [
      { text: "Hướng dẫn không đưa khuyến cáo chính thức. Các lựa chọn có thể: beta-lactam phối hợp vancomycin, daptomycin, hoặc cephalosporin mới có tác dụng trên MRSA (ceftarolin, ceftobiprol).", src: "Bàn luận, Mục VIII, tr. 30" },
    ],
    note: "Vancomycin kém hơn beta-lactam trong nhiều bối cảnh: nếu chủng cuối cùng nhạy methicilin, người bệnh nhận điều trị chưa tối ưu cho đến khi có kháng sinh đồ. Tỷ lệ MRSA trong viêm khớp cộng đồng cao ở Bắc Mỹ, thấp hơn ở châu Âu.",
  },
  {
    id: "mrsa-child", label: "Nguy cơ MRSA (trẻ em)", pop: "child",
    agents: "S. aureus kháng methicilin",
    items: [
      { text: "Clindamycin: nguy cơ MRSA cao, hoặc tỷ lệ MRSA > 10–15% trong số nhiễm S. aureus tại cơ sở.", src: "Bàn luận (khuyến cáo châu Âu), Mục VIII, tr. 31" },
      { text: "Vancomycin: tỷ lệ kháng clindamycin > 10–15%, hoặc biểu hiện lâm sàng nặng. Một số chuyên gia phối hợp (ví dụ với clindamycin) hoặc ưu tiên linezolid, daptomycin.", src: "Bàn luận (khuyến cáo châu Âu), Mục VIII, tr. 31" },
    ],
  },
  {
    id: "hosp", label: "Nhiễm khuẩn bệnh viện", pop: "both",
    agents: "S. aureus (nhạy hoặc kháng methicilin), trực khuẩn Gram âm",
    items: [{ text: `Daptomycin hoặc vancomycin, phối hợp cefepim hoặc meropenem (${ALLERGY_BL}: aztreonam hoặc ciprofloxacin).`, src: T4 }],
    note: "Nhiều căn nguyên và nhiều cơ chế kháng thuốc.",
  },
  {
    id: "procedure", label: "Tiền sử phẫu thuật khớp hoặc chọc khớp", pop: "both",
    agents: "Tụ cầu không sinh coagulase, S. aureus (nhạy hoặc kháng methicilin), liên cầu, Enterobacterales, P. aeruginosa",
    items: [{ text: `Daptomycin hoặc vancomycin, phối hợp cefepim hoặc meropenem (${ALLERGY_BL}: aztreonam hoặc ciprofloxacin).`, src: T4 }],
    note: "Tụ cầu không sinh coagulase là căn nguyên thường gặp nhất sau phẫu thuật dây chằng chéo hoặc cắt sụn chêm. Đã có các vụ dịch do liên cầu và vi khuẩn khoang miệng sau tiêm corticoid nội khớp không bảo đảm vô khuẩn.",
  },
  {
    id: "thorn", label: "Gai thực vật đâm", pop: "both",
    agents: "Enterobacterales (Pantoea agglomerans); Nocardia spp.",
    items: [
      { text: `Ceftriaxon hoặc ertapenem (${ALLERGY_BL}: ciprofloxacin).`, src: T4 },
      { text: "Nocardia spp.: không điều trị kinh nghiệm; điều trị đích nếu phân lập được.", src: T4 },
    ],
  },
  {
    id: "shoe", label: "Vết đâm xuyên qua giày", pop: "both",
    agents: "P. aeruginosa, S. aureus",
    items: [{ text: "Cloxacilin + beta-lactam chống trực khuẩn mủ xanh (ceftazidim), hoặc piperacilin-tazobactam, hoặc meropenem.", src: T4 }],
    note: "Cần loại trừ viêm xương kèm theo và cắt lọc kỹ.",
  },
  {
    id: "human", label: "Người cắn", pop: "both",
    agents: "Eikenella corrodens, vi khuẩn kỵ khí, liên cầu",
    items: [{ text: `Amoxicilin-acid clavulanic (${ALLERGY_BL}: clindamycin + ciprofloxacin).`, src: T4 }],
  },
  {
    id: "animal", label: "Động vật cắn", pop: "both",
    agents: "Pasteurella multocida, Capnocytophaga spp., vi khuẩn kỵ khí",
    items: [{ text: `Amoxicilin-acid clavulanic (${ALLERGY_BL}: clindamycin + ciprofloxacin).`, src: T4 }],
  },
  {
    id: "farm", label: "Tiếp xúc trang trại hoặc động vật", pop: "both",
    agents: "Bartonella, Brucella, Coxiella",
    items: [{ text: "Điều trị đích sau khi chẩn đoán căn nguyên (cân nhắc doxycyclin hoặc quinolon).", src: T4 }],
  },
  {
    id: "sti", label: "Nghi nhiễm khuẩn lây truyền qua đường tình dục", pop: "both",
    agents: "Neisseria gonorrhoeae",
    items: [{ text: "Ceftriaxon hoặc cefotaxim.", src: T4 }],
    note: "Sàng lọc các bệnh lây truyền qua đường tình dục khác; cân nhắc điều trị Chlamydia. Liều: xem mục Lậu cầu ở phần Theo tác nhân.",
  },
  {
    id: "cgd", label: "Bệnh u hạt mạn tính (trẻ em)", pop: "child",
    agents: "S. aureus, Serratia, Aspergillus",
    items: [{ text: "Meropenem hoặc piperacilin-tazobactam.", src: T4 }],
  },
  {
    id: "sickle", label: "Bệnh hồng cầu hình liềm (trẻ em)", pop: "child",
    agents: "S. aureus, Salmonella, S. pneumoniae",
    items: [{ text: "Cephalosporin thế hệ 3 + cloxacilin.", src: T4 }],
  },
  {
    id: "ifng", label: "Suy giảm miễn dịch đường interferon gamma (trẻ em)", pop: "child",
    agents: "Mycobacteria",
    items: [{ text: "Không khuyến cáo điều trị kinh nghiệm; điều trị đích nếu phân lập được.", src: T4 }],
  },
  {
    id: "varicella", label: "Thủy đậu, vết thương da (trẻ em)", pop: "child",
    agents: "Liên cầu nhóm A",
    items: [{ text: "Cefazolin.", src: T4 }],
  },
];

const ALLERGY_ADULT: Item = { text: "Dị ứng beta-lactam: glycopeptid hoặc daptomycin, phối hợp aztreonam hoặc fluoroquinolon.", grade: "B-III", src: "Mục VIII.2, tr. 6, 31" };

/* ---------------- Theo tac nhan ---------------- */
type Agent = { id: string; label: string; pop: Pop | "both"; iv: Item[]; oral?: Item[]; notes?: Item[]; dur?: "sa" | "gnb" | "strep" | "gc" | "candida" | "tb" | "kk" | "neg" };

const AGENTS: Agent[] = [
  {
    id: "mssa", label: "S. aureus nhạy methicilin (MSSA)", pop: "adult", dur: "sa",
    iv: [
      { text: "Cloxacilin hoặc cefazolin tĩnh mạch.", grade: "A-II", src: "Mục IX.a.1, tr. 6, 33" },
      { text: "Có thể cân nhắc thêm daptomycin giai đoạn đầu.", grade: "C-III", src: "Mục IX.a.1" },
      { text: "Dị ứng beta-lactam: vancomycin hoặc daptomycin.", grade: "A-II", src: "Mục IX.a.1" },
    ],
    oral: [{ text: "Uống nối tiếp: beta-lactam, levofloxacin, clindamycin hoặc linezolid, tùy độ nhạy của chủng và tiền sử dị ứng beta-lactam.", grade: "B-III", src: "Mục IX.a.3" }],
    notes: [
      { text: "Rifampicin: không có cơ sở bệnh sinh hoặc bằng chứng cho viêm khớp đơn thuần; có thể cân nhắc khi có biến chứng kèm viêm xương.", grade: "A-III", src: "Mục IX.a.4" },
      { text: "Daptomycin: chuyên gia khuyên liều cao (khoảng 10 mg/kg/ngày) và phối hợp thuốc thứ hai (beta-lactam, fosfomycin) để tăng hoạt tính, hạn chế kháng thuốc.", src: "Bàn luận, Mục IX, tr. 32" },
    ],
  },
  {
    id: "mrsa", label: "S. aureus kháng methicilin (MRSA)", pop: "adult", dur: "sa",
    iv: [
      { text: "Vancomycin hoặc daptomycin.", grade: "A-II", src: "Mục IX.a.2, tr. 6, 33" },
      { text: "Có thể cân nhắc phối hợp daptomycin + beta-lactam giai đoạn đầu.", grade: "C-III", src: "Mục IX.a.2" },
    ],
    oral: [{ text: "Uống nối tiếp: beta-lactam, levofloxacin, clindamycin hoặc linezolid, tùy độ nhạy của chủng và tiền sử dị ứng beta-lactam.", grade: "B-III", src: "Mục IX.a.3" }],
    notes: [
      { text: "Rifampicin: chỉ cân nhắc khi có biến chứng kèm viêm xương.", grade: "A-III", src: "Mục IX.a.4" },
      { text: "Daptomycin: chuyên gia khuyên liều cao (khoảng 10 mg/kg/ngày) và phối hợp thuốc thứ hai. Một nghiên cứu hồi cứu ghi nhận kết cục tốt hơn với daptomycin so với vancomycin, nhất là khi MIC vancomycin ≥ 2 µg/mL.", src: "Bàn luận, Mục IX, tr. 32" },
    ],
  },
  {
    id: "mssa-c", label: "S. aureus nhạy methicilin (MSSA)", pop: "child", dur: "sa",
    iv: [
      { text: "Cefazolin hoặc cloxacilin tĩnh mạch ban đầu.", grade: "A-II", src: "Mục IX.b.1, tr. 6, 33" },
      { text: "Dị ứng beta-lactam: clindamycin (A-I); linezolid, levofloxacin (trẻ > 6 tháng), daptomycin (trẻ > 1 tuổi) hoặc vancomycin (B-III).", src: "Mục IX.b.1, tr. 7, 34" },
    ],
    oral: [{ text: "Uống nối tiếp bằng beta-lactam (ví dụ cefadroxil).", grade: "A-II", src: "Mục IX.b.1" }],
    notes: [{ text: "Không có bằng chứng ủng hộ rifampicin trong viêm khớp do tụ cầu ở trẻ em.", src: "Bàn luận, Mục IX, tr. 33" }],
  },
  {
    id: "mrsa-c", label: "S. aureus kháng methicilin (MRSA)", pop: "child", dur: "sa",
    iv: [
      { text: "Clindamycin tĩnh mạch ban đầu nếu chủng nhạy.", grade: "A-I", src: "Mục IX.b.2, tr. 7, 34" },
      { text: "Chủng không nhạy clindamycin: linezolid hoặc daptomycin; glycopeptid là lựa chọn hợp lệ nhưng kém phù hợp hơn.", grade: "B-III", src: "Mục IX.b.2" },
    ],
    oral: [{ text: "Uống nối tiếp tùy độ nhạy: clindamycin (trẻ > 6–8 tuổi, A-I), cotrimoxazol (B-II), levofloxacin (trẻ > 6 tháng) hoặc linezolid (B-III).", src: "Mục IX.b.2" }],
  },
  {
    id: "strep", label: "Liên cầu", pop: "adult", dur: "strep",
    iv: [
      { text: "Liên cầu nhạy: penicilin là thuốc lựa chọn; cephalosporin thế hệ 3 (ceftriaxon, cefotaxim) hoặc ampicilin là lựa chọn thay thế tốt.", grade: "A-II", src: "Mục X.a.1, tr. 7, 35" },
      { text: "Dị ứng hoặc giảm nhạy cảm: vancomycin, clindamycin, fluoroquinolon hoặc linezolid.", grade: "B-III", src: "Mục X.a.1" },
    ],
    oral: [{ text: "Giai đoạn uống: amoxicilin, cefuroxim, levofloxacin hoặc moxifloxacin.", grade: "A-III", src: "Mục X.a.2" }],
  },
  {
    id: "strep-c", label: "Liên cầu nhóm A, nhóm B, phế cầu nhạy penicilin", pop: "child", dur: "strep",
    iv: [
      { text: "Penicilin hoặc ampicilin tĩnh mạch ban đầu.", grade: "A-III", src: "Mục X.b.1, tr. 7, 35" },
      { text: "Thay thế tùy độ nhạy và dị ứng beta-lactam: cephalosporin thế hệ 3 (ceftriaxon, cefotaxim), levofloxacin (trẻ > 6 tháng), clindamycin, linezolid hoặc vancomycin.", grade: "C-III", src: "Mục X.b.3" },
    ],
    oral: [{ text: "Uống nối tiếp bằng amoxicilin.", grade: "A-III", src: "Mục X.b.2" }],
  },
  {
    id: "gnb", label: "Trực khuẩn Gram âm", pop: "adult", dur: "gnb",
    iv: [
      { text: "Chủng nhạy: cephalosporin thế hệ 2 hoặc 3 tĩnh mạch ban đầu.", grade: "A-III", src: "Mục XI.a.1, tr. 7, 37" },
      { text: "Chủng kháng cephalosporin thế hệ 3: hội chẩn chuyên gia bệnh truyền nhiễm.", grade: "A-III", src: "Mục XI.a.1" },
      { text: "Dị ứng beta-lactam: aztreonam hoặc fluoroquinolon ban đầu.", grade: "B-III", src: "Mục XI.a.1" },
    ],
    oral: [
      { text: "Uống nối tiếp bằng ciprofloxacin khi có thể.", grade: "A-III", src: "Mục XI.a.2" },
      { text: "Thay thế tùy độ nhạy: beta-lactam uống hoặc cotrimoxazol.", grade: "B-III", src: "Mục XI.a.2" },
    ],
    notes: [{ text: "Chủng sinh ESBL, AmpC hoặc carbapenemase: tigecyclin, cephalosporin mới (ceftolozan-tazobactam, ceftazidim-avibactam) hoặc phối hợp có meropenem đơn độc hay kèm colistin hoặc fosfomycin là các lựa chọn thay thế; quyết định cùng chuyên gia truyền nhiễm hoặc vi sinh.", src: "Bàn luận, Mục XI, tr. 36" }],
  },
  {
    id: "kk", label: "Kingella kingae", pop: "child", dur: "kk",
    iv: [{ text: "Penicilin hoặc ampicilin; cephalosporin thế hệ 1, 2 hoặc amoxicilin-acid clavulanic là lựa chọn thay thế tốt.", grade: "A-II", src: "Mục XI.b.1, tr. 7, 37" }],
    notes: [
      { text: "K. kingae kháng clindamycin và cloxacilin.", src: "Bàn luận, Mục VIII, tr. 31" },
      { text: "Một loạt 62 trẻ nhiễm K. kingae xâm lấn được điều trị bằng cefuroxim tĩnh mạch 150 mg/kg/ngày hoặc cefazolin 100 mg/kg/ngày (dữ liệu loạt ca, không phải khuyến cáo liều).", src: "Bàn luận, Mục XI, tr. 36" },
    ],
  },
  {
    id: "gnb-c", label: "Trực khuẩn Gram âm khác", pop: "child", dur: "gnb",
    iv: [{ text: "Chọn kháng sinh theo kháng sinh đồ.", grade: "A-III", src: "Mục XI.b.2, tr. 7, 37" }],
    notes: [{ text: "Nên kéo dài thời gian điều trị vì nhiều trẻ có suy giảm miễn dịch hoặc bệnh nền nặng.", src: "Bàn luận, Mục XI, tr. 36" }],
  },
  {
    id: "gc", label: "Lậu cầu (N. gonorrhoeae)", pop: "adult", dur: "gc",
    iv: [
      { text: "Ceftriaxon 1 g mỗi 24 giờ (lựa chọn đầu tay) hoặc cefotaxim 1 g tĩnh mạch mỗi 8 giờ (thay thế).", grade: "A-III", src: "Mục XII, tr. 7, 39" },
    ],
    oral: [{ text: "Sau khi lâm sàng cải thiện, chuyển uống theo kháng sinh đồ: ciprofloxacin 500 mg mỗi 12 giờ hoặc cefixim 400 mg mỗi 12 giờ.", grade: "B-III", src: "Mục XII" }],
    notes: [
      { text: "Sàng lọc các bệnh lây truyền qua đường tình dục khác.", grade: "A-II", src: "Mục XII" },
      { text: "Chưa loại trừ Chlamydia: doxycyclin 100 mg uống 2 lần/ngày trong 7 ngày (theo CDC).", src: "Bàn luận, Mục XII, tr. 39" },
      { text: "Không dùng fluoroquinolon theo kinh nghiệm: hơn một nửa chủng lậu cầu tại Tây Ban Nha đã kháng.", src: "Bàn luận, Mục XII, tr. 38–39" },
      { text: "Viêm khớp mủ do lậu cầu hiếm khi cần dẫn lưu phẫu thuật.", src: "Bàn luận, Mục XII, tr. 39" },
    ],
  },
  {
    id: "gc-c", label: "Lậu cầu (sơ sinh, vị thành niên)", pop: "child", dur: "gc",
    iv: [
      { text: "Cefotaxim (sơ sinh) hoặc ceftriaxon, trong 7 ngày.", grade: "B-III", src: "Mục XII, tr. 7, 39" },
      { text: "Liều: ceftriaxon 25–50 mg/kg/ngày tĩnh mạch hoặc tiêm bắp, 1 lần/ngày trong 7 ngày; cefotaxim 25 mg/kg mỗi 12 giờ trong 7 ngày. Ưu tiên cefotaxim ở trẻ có tăng bilirubin máu.", src: "Bàn luận, Mục XII, tr. 39" },
    ],
    notes: [{ text: "Có viêm màng não: kéo dài 10–14 ngày. Chuyển uống theo kháng sinh đồ 24–48 giờ sau khi lâm sàng cải thiện rõ.", src: "Bàn luận, Mục XII, tr. 39" }],
  },
  {
    id: "candida", label: "Candida spp.", pop: "both", dur: "candida",
    iv: [{ text: "Trường hợp đã điều trị ngoại khoa: azol, echinocandin hoặc amphotericin B liposome trong 6–8 tuần.", grade: "A-III", src: "Mục XII, tr. 7, 39" }],
    notes: [{ text: "Sơ sinh: đánh giá lan tràn, gồm chọc dịch não tủy và khám đáy mắt.", grade: "B-II", src: "Mục XII" }],
  },
  {
    id: "tb", label: "Mycobacterium tuberculosis", pop: "both", dur: "tb",
    iv: [{ text: "Chẩn đoán sớm (chưa có áp xe lớn hoặc xương chết): điều trị lao như lao các vị trí khác.", grade: "B-III", src: "Mục XII, tr. 7, 39" }],
    notes: [{ text: "Điều trị dưới sự giám sát của chuyên gia.", grade: "B-III", src: "Mục XII" }],
  },
  {
    id: "neg", label: "Cấy dịch khớp âm tính", pop: "both", dur: "neg",
    iv: [
      { text: "Điều trị tương tự phác đồ kinh nghiệm cho trường hợp nhuộm Gram dịch khớp âm tính.", grade: "B-III", src: "Mục XIII.1, tr. 8, 40" },
      { text: "Đang hoặc mới dùng kháng sinh: tính đến phổ của kháng sinh đã dùng để điều chỉnh phác đồ.", grade: "B-III", src: "Mục XIII.2" },
      { text: "Đánh giá dịch tễ kỹ để loại trừ vi khuẩn hiếm hoặc khó nuôi cấy.", grade: "B-II", src: "Mục XIII.3" },
    ],
    notes: [{ text: "Không xác định được tác nhân: chẩn đoán vẫn là giả định; theo dõi để phát hiện bệnh khác, nhất là bệnh khớp viêm.", src: "Bàn luận, Mục XIII, tr. 40" }],
  },
];

/* ---------------- Thoi gian ---------------- */
type AdultSite = "large" | "axial" | "osteo" | "hand";
const ADULT_SITES: { id: AdultSite; label: string }[] = [
  { id: "large", label: "Khớp lớn ngoại vi, đã dẫn lưu" },
  { id: "axial", label: "Khớp trục" },
  { id: "osteo", label: "Kèm viêm xương kế cận" },
  { id: "hand", label: "Khớp cổ tay, bàn tay, đã dẫn lưu ngoại khoa" },
];
type ChildSite = "simple" | "osteo" | "axial";
const CHILD_SITES: { id: ChildSite; label: string }[] = [
  { id: "simple", label: "Không biến chứng" },
  { id: "osteo", label: "Kèm viêm xương" },
  { id: "axial", label: "Khớp trục" },
];

function durationItems(pop: Pop, agent: Agent | null, adultSite: AdultSite, childSite: ChildSite, slow: boolean, infant: boolean): Item[] {
  const out: Item[] = [];
  const d = agent?.dur;
  if (d === "candida") return [{ text: "6–8 tuần (đã điều trị ngoại khoa).", grade: "A-III", src: "Mục XII" }];
  if (d === "tb") return [{ text: "Như lao các vị trí khác; một số chuyên gia khuyên 9–12 tháng.", grade: "B-III", src: "Mục XII" }];
  if (d === "neg") out.push({ text: "Một số tác giả cho rằng có thể rút ngắn còn 2 tuần ở người lớn, 10 ngày ở trẻ em.", src: "Bàn luận, Mục XIII, tr. 40" });
  if (pop === "adult") {
    if (adultSite === "large") {
      const map: Record<string, Item> = {
        sa: { text: "S. aureus: 3–4 tuần.", grade: "B-III", src: "Mục VII.10, tr. 6" },
        gnb: { text: "Trực khuẩn Gram âm: 3–4 tuần.", grade: "B-III", src: "Mục VII.10, tr. 6" },
        strep: { text: "Liên cầu: 2–3 tuần.", grade: "B-III", src: "Mục VII.10, tr. 6" },
        gc: { text: "Lậu cầu: 1–2 tuần.", grade: "B-III", src: "Mục VII.10, tr. 6" },
      };
      if (d && map[d]) out.push(map[d]);
      else out.push({ text: "Khớp lớn ngoại vi sau dẫn lưu: S. aureus và trực khuẩn Gram âm 3–4 tuần; liên cầu 2–3 tuần; lậu cầu 1–2 tuần.", grade: "B-III", src: "Mục VII.10, tr. 6" });
      if (d === "gc") out.push({ text: "Bàn luận: 1 tuần cho hội chứng viêm khớp – viêm da; 2 tuần cho viêm khớp mủ.", src: "Mục XII, tr. 39" });
    }
    if (adultSite === "axial") out.push({ text: "Khớp trục: 6 tuần.", grade: "A-III", src: "Mục VII.10, tr. 6" });
    if (adultSite === "osteo") out.push({ text: "Kèm viêm xương kế cận: kéo dài hơn (hướng dẫn không nêu số tuần cụ thể).", grade: "A-III", src: "Mục VII.10, tr. 6" });
    if (adultSite === "hand") out.push({ text: "Khớp cổ tay, bàn tay sau dẫn lưu ngoại khoa: 2 tuần (có thể không áp dụng cho MRSA).", grade: "A-I", src: "Mục VII.10, tr. 6" });
    if (slow) out.push({ text: "Suy giảm miễn dịch hoặc đáp ứng chậm, không đầy đủ với điều trị ban đầu: kéo dài hơn.", grade: "B-III", src: "Mục VII.10, tr. 6" });
    out.push({ text: "Các mốc trên áp dụng cho người lớn không có viêm nội tâm mạc.", src: "Mục VII.10" });
  } else {
    if (d === "kk") out.push({ text: "K. kingae: 10–14 ngày theo các tác giả.", src: "Bàn luận, Mục VII, tr. 28" });
    if (childSite === "simple") out.push({ text: "Không biến chứng: 2–3 tuần.", grade: "A-I", src: "Mục VII.11, tr. 6" });
    if (childSite === "osteo") out.push({ text: "Kèm viêm xương: 3–4 tuần.", grade: "A-I", src: "Mục VII.11, tr. 6" });
    if (childSite === "axial") out.push({ text: "Khớp trục: có thể cần 4–6 tuần.", grade: "A-III", src: "Mục VII.11, tr. 6" });
    if (agent && (agent.id === "mrsa-c")) out.push({ text: "MRSA: có thể cần 4–6 tuần.", grade: "B-II", src: "Mục VII.11, tr. 6" });
    if (agent && agent.id === "gnb-c") out.push({ text: "Salmonella, Enterobacterales hoặc P. aeruginosa: có thể cần 4–6 tuần.", grade: "B-III", src: "Mục VII.11, tr. 6" });
    if (infant) out.push({ text: "Sơ sinh và trẻ < 3 tháng: có thể cần 4–6 tuần.", grade: "B-III", src: "Mục VII.11, tr. 6" });
    if (slow) out.push({ text: "Trẻ suy giảm miễn dịch: có thể cần 4–6 tuần.", grade: "B-III", src: "Mục VII.11, tr. 6" });
  }
  return out;
}

const ORAL_SWITCH: Record<Pop, Item[]> = {
  adult: [
    { text: "Khởi trị đường tĩnh mạch.", grade: "B-III", src: "Mục VII.8" },
    { text: "Chuyển uống sau vài ngày (ví dụ 2–7 ngày) tĩnh mạch khi: không viêm nội tâm mạc, cấy máu âm tính, lâm sàng và xét nghiệm cải thiện, có thuốc uống phù hợp.", grade: "A-II", src: "Mục VII.9, tr. 5" },
  ],
  child: [
    { text: "Khởi trị đường tĩnh mạch.", grade: "B-III", src: "Mục VII.8" },
    { text: "Diễn biến lâm sàng và xét nghiệm thuận lợi sau 2–4 ngày tĩnh mạch: chuyển uống.", grade: "A-I", src: "Mục VII.9, tr. 5" },
  ],
};

const PRINCIPLES: Item[] = [
  { text: "Cấy máu cho mọi trường hợp nghi viêm khớp nhiễm khuẩn, trước khi dùng kháng sinh khi có thể. Cấy máu dương tính với vi khuẩn thường gây viêm nội tâm mạc (S. aureus, liên cầu nhóm viridans, enterococci): đánh giá viêm nội tâm mạc (B-III).", grade: "A-II", src: "Mục IV.1" },
  { text: "Lấy dịch khớp sớm nhất, tốt nhất trước kháng sinh; nhuộm Gram, cấy; đủ dịch (> 2 mL) thì cấy thêm vào chai cấy máu tại giường (B-II).", grade: "A-II", src: "Mục IV.2–3" },
  { text: "Huyết động ổn định, không nhiễm khuẩn huyết/sốc nhiễm khuẩn: bắt đầu kháng sinh kinh nghiệm sau khi cấy máu và chọc hút dịch khớp.", grade: "A-II", src: "Mục VII.5" },
  { text: "Huyết động không ổn định, nhiễm khuẩn huyết hoặc sốc nhiễm khuẩn: lấy máu và dịch khớp cấy trước kháng sinh nếu không làm chậm đáng kể (< 45 phút).", grade: "B-III", src: "Mục VII.6" },
  { text: "Dẫn lưu khớp cho viêm khớp vi khuẩn ngoại vi (trừ lậu cầu và lao giai đoạn sớm) và viêm khớp do nấm; khớp lớn ngoại vi dẫn lưu càng sớm càng tốt.", grade: "A-II", src: "Mục VII.2–3" },
  { text: "Phác đồ đích dựa trên tác nhân và kháng sinh đồ; không xác định được tác nhân thì dựa trên tác nhân có khả năng nhất; trao đổi với chuyên gia truyền nhiễm hoặc vi sinh khi có thể.", grade: "A-II", src: "Mục VII.7" },
  { text: "Luôn dùng kháng sinh tác dụng trên S. aureus khi nghi viêm khớp nhiễm khuẩn và nhuộm Gram dịch khớp âm tính; có thể cần bao phủ thêm tác nhân khác (A-III).", grade: "A-II", src: "Mục VIII.1" },
  { text: "Trẻ em: NSAID có thể có lợi trong giai đoạn cấp (A-III). Trẻ đã xác định viêm khớp nhiễm khuẩn: đợt ngắn corticoid tĩnh mạch sớm có thể giúp hồi phục nhanh, rút ngắn nằm viện (B-I). Người lớn: không khuyến cáo corticoid (D-III).", src: "Mục XIV" },
  { text: "Theo dõi lâm sàng (đau, viêm, chức năng khớp) và xét nghiệm (công thức máu, CRP, tốc độ máu lắng); theo dõi tác dụng không mong muốn khi dùng kháng sinh.", grade: "B-III", src: "Mục XVIII.2" },
  { text: "Tái khám chuyên khoa chấn thương chỉnh hình và truyền nhiễm sau ra viện 1–2 tuần, 4–6 tuần và 3 tháng (C-III); theo dõi ít nhất 1 năm ở người lớn có nguy cơ di chứng và ở trẻ em (B-III).", src: "Mục XVIII.3" },
];

function Grade({ g }: { g?: string }) {
  if (!g) return <span className="sa24-g sa24-g-d">Bàn luận</span>;
  return <span className={`sa24-g sa24-g-${g[0].toLowerCase()}`} title="Mức khuyến cáo – chất lượng bằng chứng (Bảng 1)">{g}</span>;
}
function List({ items }: { items: Item[] }) {
  return (
    <ul className="sa24-list">
      {items.map((it) => (
        <li key={it.text}><Grade g={it.grade} /><span>{it.text}<details className="sa24-loc"><summary>Căn cứ</summary>{SRC} · {it.src}</details></span></li>
      ))}
    </ul>
  );
}
function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: readonly { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="sa24-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className={value === o.id ? "on" : undefined} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}

export default function SepticArthritisSeimc2024() {
  const [pop, setPop] = useState<Pop>("adult");
  const [stage, setStage] = useState<Stage>("empiric");
  const [age, setAge] = useState<ChildAge>("3m2y");
  const [ctx, setCtx] = useState("none");
  const [allergy, setAllergy] = useState(false);
  const [agentId, setAgentId] = useState("mssa");
  const [adultSite, setAdultSite] = useState<AdultSite>("large");
  const [childSite, setChildSite] = useState<ChildSite>("simple");
  const [slow, setSlow] = useState(false);

  const contexts = useMemo(() => CONTEXTS.filter((c) => c.pop === "both" || c.pop === pop), [pop]);
  const agents = useMemo(() => AGENTS.filter((a) => a.pop === "both" || a.pop === pop), [pop]);
  const context = contexts.find((c) => c.id === ctx) ?? null;
  const agent = stage === "directed" ? agents.find((a) => a.id === agentId) ?? agents[0] : null;

  function changePop(p: Pop) {
    setPop(p);
    setCtx(p === "adult" ? "none" : "age");
    setAgentId(p === "adult" ? "mssa" : "mssa-c");
    setSlow(false);
  }

  const durations = durationItems(pop, agent, adultSite, childSite, slow, pop === "child" && age === "lt3m");

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Công cụ chọn kháng sinh · khớp tự nhiên</p>
        <h3>Viêm khớp nhiễm khuẩn – {SRC}</h3>
        <p className="sa24-sub">Áp dụng cho người lớn và trẻ em; không áp dụng cho nhiễm khuẩn khớp nhân tạo và viêm khớp do virus. Mức khuyến cáo (Bảng 1): A ủng hộ mạnh, B ủng hộ vừa, C ủng hộ ít, D khuyến cáo không dùng; chất lượng bằng chứng I (thử nghiệm ngẫu nhiên có đối chứng), II (thử nghiệm không ngẫu nhiên, nghiên cứu thuần tập, bệnh chứng), III (ý kiến chuyên gia). "Bàn luận": nội dung trong phần phân tích, không phải khuyến cáo đánh số.</p>
      </header>

      <div className="sa24-steps">
        <div className="sa24-step"><span>1</span><div><b>Đối tượng</b>
          <Seg label="Đối tượng" value={pop} onChange={changePop} options={[{ id: "adult", label: "Người lớn" }, { id: "child", label: "Trẻ em" }] as const} />
          {pop === "child" && <Seg label="Nhóm tuổi" value={age} onChange={setAge} options={CHILD_AGES} />}
        </div></div>

        <div className="sa24-step"><span>2</span><div><b>Giai đoạn điều trị</b>
          <Seg label="Giai đoạn" value={stage} onChange={setStage} options={[{ id: "empiric", label: "Kinh nghiệm (chưa có kết quả cấy)" }, { id: "directed", label: "Theo tác nhân đã xác định" }] as const} />
        </div></div>

        {stage === "empiric" ? (
          <div className="sa24-step"><span>3</span><div><b>Bối cảnh dịch tễ</b>
            <select value={context ? ctx : "age"} onChange={(e) => setCtx(e.target.value)} aria-label="Bối cảnh dịch tễ">
              {pop === "child" && <option value="age">Không có yếu tố nguy cơ tác nhân đặc biệt hoặc vi khuẩn kháng thuốc; nhuộm Gram âm tính</option>}
              {contexts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            {pop === "adult" && <label className="sa24-chk"><input type="checkbox" checked={allergy} onChange={(e) => setAllergy(e.target.checked)} /> Dị ứng beta-lactam</label>}
          </div></div>
        ) : (
          <div className="sa24-step"><span>3</span><div><b>Tác nhân</b>
            <select value={agent?.id} onChange={(e) => setAgentId(e.target.value)} aria-label="Tác nhân">
              {agents.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </div></div>
        )}

        <div className="sa24-step"><span>4</span><div><b>Vị trí và yếu tố kéo dài điều trị</b>
          {pop === "adult"
            ? <Seg label="Vị trí khớp" value={adultSite} onChange={setAdultSite} options={ADULT_SITES} />
            : <Seg label="Biến chứng" value={childSite} onChange={setChildSite} options={CHILD_SITES} />}
          <label className="sa24-chk"><input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} /> {pop === "adult" ? "Suy giảm miễn dịch hoặc đáp ứng chậm với điều trị ban đầu" : "Trẻ suy giảm miễn dịch"}</label>
        </div></div>
      </div>

      <section className="sa24-out" aria-live="polite">
        <h4>Lựa chọn kháng sinh</h4>
        {stage === "empiric" ? (
          <>
            {pop === "child" && !context && (
              <>
                <List items={CHILD_EMPIRIC[age]} />
                <p className="sa24-note">Luôn có kháng sinh tác dụng trên MSSA (ví dụ beta-lactam) cho đến khi loại trừ. Trẻ nhỏ: phác đồ cần bao phủ K. kingae, thường bằng cephalosporin thế hệ 1 hoặc 2. Nhuộm Gram dương tính: chọn theo vi khuẩn thấy trên nhuộm Gram.</p>
              </>
            )}
            {context && (
              <>
                <p className="sa24-agents"><b>Căn nguyên chính:</b> {context.agents}</p>
                <List items={context.items} />
                {context.note && <p className="sa24-note">{context.note}</p>}
              </>
            )}
            {pop === "adult" && allergy && (context?.id === "none" || context?.id === "gramneg") && <List items={[ALLERGY_ADULT]} />}
            {pop === "adult" && context?.id === "none" && <p className="sa24-note">Bối cảnh khác (bệnh viện, sau thủ thuật, vết cắn…): chọn ở bước 3 (Bảng 4). Nhuộm Gram dương tính: chọn theo vi khuẩn thấy trên nhuộm Gram.</p>}
            <p className="sa24-note">{NO_DOSE}</p>
          </>
        ) : agent && (
          <>
            <h5>Khởi trị</h5>
            <List items={agent.iv} />
            {agent.oral && (<><h5>Uống nối tiếp</h5><List items={agent.oral} /></>)}
            {agent.notes && (<><h5>Lưu ý</h5><List items={agent.notes} /></>)}
            <p className="sa24-note">{NO_DOSE}</p>
          </>
        )}

        <h4>Chuyển đường uống</h4>
        <List items={ORAL_SWITCH[pop]} />

        <h4>Thời gian điều trị</h4>
        <List items={durations} />
      </section>

      <details className="sa24-more">
        <summary>Nguyên tắc chung: lấy bệnh phẩm, dẫn lưu, bổ trợ, theo dõi ({PRINCIPLES.length})</summary>
        <List items={PRINCIPLES} />
        <p className="sa24-note">Khác biệt giữa hai hướng dẫn: GEIO–SEIMC 2024 cho rằng corticoid tĩnh mạch ngắn ngày có thể có lợi ở trẻ đã xác định viêm khớp nhiễm khuẩn (B-I); PIDS/IDSA 2023 khuyến cáo không dùng corticoid bổ trợ. Quyết định cần hội chẩn.</p>
      </details>

      <p className="sa24-src">Nguồn: Benito N, Martínez-Pastor JC, Saavedra-Lozano J và cs. Guidelines for the diagnosis and treatment of septic arthritis in adults and children, developed by the GEIO (SEIMC), SEIP and SECOT, 2024. <a href={URL} target="_blank" rel="noopener noreferrer">Bản đầy đủ (PDF)</a>. Số trang theo bản PDF. Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt.</p>

      <style>{`
        .sa24 { border: 1px solid #dbe6ed; border-radius: 16px; padding: 16px; margin: 12px 0; background: #fff; display: grid; gap: 12px; min-width: 0; }
        .sa24-eyebrow { margin: 0; font-size: 11.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; color: #087f89; }
        .sa24 h3 { margin: 2px 0 0; font-size: 18px; font-weight: 800; color: #0f2236; }
        .sa24-sub { margin: 4px 0 0; font-size: 13px; line-height: 1.55; color: #4b6576; }
        .sa24-steps { display: grid; gap: 10px; }
        .sa24-step { display: grid; grid-template-columns: 26px minmax(0,1fr); gap: 10px; align-items: start; }
        .sa24-step > span { width: 26px; height: 26px; border-radius: 50%; background: #0b3a5b; color: #fff; display: grid; place-items: center; font-size: 13px; font-weight: 800; }
        .sa24-step > div { display: grid; gap: 6px; min-width: 0; }
        .sa24-step b { font-size: 13.5px; color: #0b3a5b; }
        .sa24-seg { display: flex; flex-wrap: wrap; gap: 6px; }
        .sa24-seg button { border: 1px solid #cfdde6; background: #f7fafc; border-radius: 999px; padding: 6px 12px; font: inherit; font-size: 13px; color: #33505f; cursor: pointer; text-align: left; }
        .sa24-seg button.on { background: #0b3a5b; border-color: #0b3a5b; color: #fff; font-weight: 700; }
        .sa24 select { width: 100%; max-width: 100%; border: 1px solid #cfdde6; border-radius: 10px; padding: 8px 10px; font: inherit; font-size: 13.5px; background: #fff; }
        .sa24-chk { display: flex; gap: 6px; align-items: center; font-size: 13px; color: #33505f; }
        .sa24-out { border-top: 1px solid #edf2f6; padding-top: 10px; display: grid; gap: 6px; }
        .sa24-out h4 { margin: 8px 0 0; font-size: 15px; font-weight: 800; color: #0b3a5b; }
        .sa24-out h5 { margin: 4px 0 0; font-size: 13px; font-weight: 800; color: #33505f; text-transform: uppercase; letter-spacing: .03em; }
        .sa24-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
        .sa24-list li { display: grid; grid-template-columns: 64px minmax(0,1fr); gap: 8px; align-items: start; font-size: 14px; line-height: 1.55; color: #10243e; }
        .sa24-loc { display: inline; } .sa24-loc summary { display: inline; cursor: pointer; margin-left: 6px; font-size: 12px; color: #087f89; } .sa24-loc[open] { display: block; font-size: 12px; color: #6b8293; } .sa24-loc[open] summary { margin-left: 0; margin-right: 6px; }
        .sa24-g { display: inline-block; text-align: center; border-radius: 6px; padding: 1px 4px; font-size: 11.5px; font-weight: 800; }
        .sa24-g-a { background: #dff3e8; color: #106b3d; }
        .sa24-g-b { background: #e6f0fb; color: #1d4f8a; }
        .sa24-g-c { background: #fff3d6; color: #8a5a00; }
        .sa24-g-d { background: #f1f5f8; color: #557080; font-weight: 700; }
        .sa24-agents { margin: 0; font-size: 13.5px; color: #33505f; }
        .sa24-note { margin: 2px 0 0; font-size: 12.5px; line-height: 1.55; color: #5c4a1e; background: #fffaf0; border: 1px solid #f3e2bd; border-radius: 8px; padding: 6px 10px; }
        .sa24-more summary { cursor: pointer; font-weight: 700; font-size: 13.5px; color: #0b3a5b; }
        .sa24-more[open] { display: grid; gap: 8px; }
        .sa24-src { margin: 0; font-size: 12px; line-height: 1.5; color: #6b8293; border-top: 1px solid #edf2f6; padding-top: 8px; }
        @media (max-width: 640px) { .sa24-list li { grid-template-columns: 1fr; gap: 2px; } .sa24-g { justify-self: start; } }
      `}</style>
    </article>
  );
}
