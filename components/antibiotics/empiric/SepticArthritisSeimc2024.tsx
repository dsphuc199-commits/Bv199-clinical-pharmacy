"use client";

/*
  Viem khop nhiem khuan khop tu nhien – GEIO (SEIMC), SEIP, SECOT 2024.
  - Chi ghi noi dung co trong van ban; muc khuyen cao (A–D, I–III) theo Bang 1 cua van ban.
  - Can cu ghi so khuyen cao (KC); noi dung tu phan phan tich (khong danh so) ghi "Bàn luận – mục …".
  - al: "std" = thuoc beta-lactam/phac do chuan (an khi di ung beta-lactam); "alt" = lua chon khi di ung
    (chi hien khi di ung); khong ghi = hien ca hai.
  - Lieu: chi ghi khi van ban neu; khong tu bo sung.
*/

import { useMemo, useState, type ReactNode } from "react";

type Item = { text: string; grade?: string; ref: string; al?: "std" | "alt" };
type Pop = "adult" | "child";
type Stage = "empiric" | "directed";

const SRC = "GEIO–SEIMC/SEIP/SECOT 2024 – Hướng dẫn chẩn đoán và điều trị viêm khớp nhiễm khuẩn ở người lớn và trẻ em";
const T4 = "Bảng 4";
const BL = (m: string) => `Bàn luận – mục ${m}`;

/* ---------------- Kinh nghiem ---------------- */
const CHILD_AGES = [
  { id: "lt3m", label: "< 3 tháng" },
  { id: "3m2y", label: "3 tháng – 2 tuổi" },
  { id: "2y4y", label: "2 – 4 tuổi" },
  { id: "gt4y", label: "> 4 tuổi" },
] as const;
type ChildAge = (typeof CHILD_AGES)[number]["id"];

const CHILD_EMPIRIC: Record<ChildAge, Item[]> = {
  lt3m: [{ text: "Cloxacilin hoặc cefazolin, phối hợp cefotaxim hoặc gentamicin (tránh dùng đồng thời 2 cephalosporin).", grade: "A-II", ref: "KC VIII.3", al: "std" }],
  "3m2y": [
    { text: "Cefuroxim.", grade: "A-II", ref: "KC VIII.3", al: "std" },
    { text: "Thay thế: cloxacilin + cefotaxim, hoặc amoxicilin-acid clavulanic.", grade: "A-II", ref: "KC VIII.3", al: "std" },
  ],
  "2y4y": [
    { text: "Cefazolin.", grade: "A-II", ref: "KC VIII.3", al: "std" },
    { text: "Thay thế: cefuroxim, để bao phủ H. influenzae và S. pneumoniae ở trẻ tiêm chủng chưa đầy đủ.", grade: "A-II", ref: "KC VIII.3", al: "std" },
  ],
  gt4y: [
    { text: "Cefazolin hoặc cloxacilin.", grade: "A-II", ref: "KC VIII.3", al: "std" },
    { text: "Cefazolin, cloxacilin hoặc clindamycin, tùy dịch tễ tại chỗ.", ref: BL("VIII") },
  ],
};

type Context = { id: string; label: string; pop: Pop | "both"; agents: string; items: Item[]; notes?: string[] };

const CONTEXTS: Context[] = [
  {
    id: "none", label: "Không có yếu tố nguy cơ tác nhân đặc biệt hoặc vi khuẩn kháng thuốc", pop: "adult",
    agents: "S. aureus, liên cầu, trực khuẩn Gram âm thường gặp",
    items: [
      { text: "Cloxacilin + ceftriaxon, hoặc amoxicilin-acid clavulanic đơn trị.", grade: "B-III", ref: "KC VIII.2", al: "std" },
      { text: "Glycopeptid hoặc daptomycin, phối hợp aztreonam hoặc fluoroquinolon.", grade: "B-III", ref: "KC VIII.2", al: "alt" },
    ],
  },
  {
    id: "gramneg", label: "Nghi trực khuẩn Gram âm (người cao tuổi, nhiễm khuẩn bệnh viện, suy giảm miễn dịch, tiêm chích ma túy)", pop: "adult",
    agents: "Trực khuẩn Gram âm; luôn bao phủ S. aureus (KC VIII.1)",
    items: [
      { text: "Phác đồ có cephalosporin thế hệ 3: ceftriaxon 2 g tĩnh mạch mỗi 24 giờ, hoặc cefotaxim 2 g tĩnh mạch mỗi 8 giờ.", ref: BL("VIII"), al: "std" },
      { text: "Nghi P. aeruginosa: ceftazidim.", ref: BL("VIII"), al: "std" },
      { text: "Nghi nhiễm nhiều vi khuẩn (ví dụ đái tháo đường, nhiễm khuẩn khớp nhỏ bàn chân, ngón chân): amoxicilin-acid clavulanic, hoặc piperacilin-tazobactam nếu nghi P. aeruginosa.", ref: BL("VIII"), al: "std" },
      { text: "Nguy cơ trực khuẩn Gram âm đa kháng cao: khởi trị bằng carbapenem cho đến khi có kháng sinh đồ.", ref: BL("VIII"), al: "std" },
      { text: "Dị ứng penicilin hoặc cephalosporin: aztreonam hoặc fluoroquinolon.", ref: BL("VIII"), al: "alt" },
    ],
  },
  {
    id: "mrsa", label: "Cân nhắc bao phủ MRSA theo kinh nghiệm", pop: "adult",
    agents: "S. aureus kháng methicilin",
    items: [{ text: "Hướng dẫn không đưa khuyến cáo chính thức. Các lựa chọn có thể: beta-lactam phối hợp vancomycin, daptomycin, hoặc cephalosporin mới có tác dụng trên MRSA (ceftarolin, ceftobiprol).", ref: BL("VIII"), al: "std" }],
    notes: ["Vancomycin kém hơn beta-lactam trong nhiều bối cảnh: nếu chủng cuối cùng nhạy methicilin, người bệnh nhận điều trị chưa tối ưu cho đến khi có kháng sinh đồ."],
  },
  {
    id: "mrsa-child", label: "Nguy cơ MRSA", pop: "child",
    agents: "S. aureus kháng methicilin",
    items: [
      { text: "Clindamycin: nguy cơ MRSA cao, hoặc tỷ lệ MRSA > 10–15% trong số nhiễm S. aureus tại cơ sở.", ref: BL("VIII (khuyến cáo châu Âu)") },
      { text: "Vancomycin: tỷ lệ kháng clindamycin > 10–15%, hoặc biểu hiện lâm sàng nặng. Một số chuyên gia phối hợp (ví dụ với clindamycin) hoặc ưu tiên linezolid, daptomycin.", ref: BL("VIII (khuyến cáo châu Âu)") },
    ],
  },
  {
    id: "hosp", label: "Nhiễm khuẩn bệnh viện", pop: "both",
    agents: "S. aureus (nhạy hoặc kháng methicilin), trực khuẩn Gram âm",
    items: [
      { text: "Daptomycin hoặc vancomycin, phối hợp cefepim hoặc meropenem.", ref: T4, al: "std" },
      { text: "Daptomycin hoặc vancomycin, phối hợp aztreonam hoặc ciprofloxacin.", ref: T4, al: "alt" },
    ],
    notes: ["Nhiều căn nguyên và nhiều cơ chế kháng thuốc."],
  },
  {
    id: "procedure", label: "Tiền sử phẫu thuật khớp hoặc chọc khớp", pop: "both",
    agents: "Tụ cầu không sinh coagulase, S. aureus (nhạy hoặc kháng methicilin), liên cầu, Enterobacterales, P. aeruginosa",
    items: [
      { text: "Daptomycin hoặc vancomycin, phối hợp cefepim hoặc meropenem.", ref: T4, al: "std" },
      { text: "Daptomycin hoặc vancomycin, phối hợp aztreonam hoặc ciprofloxacin.", ref: T4, al: "alt" },
    ],
    notes: ["Tụ cầu không sinh coagulase là căn nguyên thường gặp nhất sau phẫu thuật dây chằng chéo hoặc cắt sụn chêm. Đã có các vụ dịch do liên cầu và vi khuẩn khoang miệng sau tiêm corticoid nội khớp không bảo đảm vô khuẩn."],
  },
  {
    id: "thorn", label: "Gai thực vật đâm", pop: "both",
    agents: "Enterobacterales (Pantoea agglomerans); Nocardia spp.",
    items: [
      { text: "Ceftriaxon hoặc ertapenem.", ref: T4, al: "std" },
      { text: "Ciprofloxacin.", ref: T4, al: "alt" },
      { text: "Nocardia spp.: không điều trị kinh nghiệm; điều trị đích nếu phân lập được.", ref: T4 },
    ],
  },
  {
    id: "shoe", label: "Vết đâm xuyên qua giày", pop: "both",
    agents: "P. aeruginosa, S. aureus",
    items: [{ text: "Cloxacilin + beta-lactam chống trực khuẩn mủ xanh (ceftazidim), hoặc piperacilin-tazobactam, hoặc meropenem.", ref: T4, al: "std" }],
    notes: ["Cần loại trừ viêm xương kèm theo và cắt lọc kỹ."],
  },
  {
    id: "human", label: "Người cắn", pop: "both",
    agents: "Eikenella corrodens, vi khuẩn kỵ khí, liên cầu",
    items: [
      { text: "Amoxicilin-acid clavulanic.", ref: T4, al: "std" },
      { text: "Clindamycin + ciprofloxacin.", ref: T4, al: "alt" },
    ],
  },
  {
    id: "animal", label: "Động vật cắn", pop: "both",
    agents: "Pasteurella multocida, Capnocytophaga spp., vi khuẩn kỵ khí",
    items: [
      { text: "Amoxicilin-acid clavulanic.", ref: T4, al: "std" },
      { text: "Clindamycin + ciprofloxacin.", ref: T4, al: "alt" },
    ],
  },
  {
    id: "farm", label: "Tiếp xúc trang trại hoặc động vật", pop: "both",
    agents: "Bartonella, Brucella, Coxiella",
    items: [{ text: "Điều trị đích sau khi chẩn đoán căn nguyên (cân nhắc doxycyclin hoặc quinolon).", ref: T4 }],
  },
  {
    id: "sti", label: "Nghi nhiễm khuẩn lây truyền qua đường tình dục", pop: "both",
    agents: "Neisseria gonorrhoeae",
    items: [{ text: "Ceftriaxon hoặc cefotaxim.", ref: T4, al: "std" }],
    notes: ["Sàng lọc các bệnh lây truyền qua đường tình dục khác; cân nhắc điều trị Chlamydia. Liều: chọn Đã có tác nhân → Lậu cầu."],
  },
  {
    id: "cgd", label: "Bệnh u hạt mạn tính", pop: "child",
    agents: "S. aureus, Serratia, Aspergillus",
    items: [{ text: "Meropenem hoặc piperacilin-tazobactam.", ref: T4, al: "std" }],
  },
  {
    id: "sickle", label: "Bệnh hồng cầu hình liềm", pop: "child",
    agents: "S. aureus, Salmonella, S. pneumoniae",
    items: [{ text: "Cephalosporin thế hệ 3 + cloxacilin.", ref: T4, al: "std" }],
  },
  {
    id: "ifng", label: "Suy giảm miễn dịch đường interferon gamma", pop: "child",
    agents: "Mycobacteria",
    items: [{ text: "Không khuyến cáo điều trị kinh nghiệm; điều trị đích nếu phân lập được.", ref: T4 }],
  },
  {
    id: "varicella", label: "Thủy đậu, vết thương da", pop: "child",
    agents: "Liên cầu nhóm A",
    items: [{ text: "Cefazolin.", ref: T4, al: "std" }],
  },
];

/* ---------------- Theo tac nhan ---------------- */
type Dur = "sa" | "gnb" | "strep" | "gc" | "candida" | "tb" | "kk" | "neg";
type Agent = { id: string; label: string; pop: Pop | "both"; iv: Item[]; oral?: Item[]; notes?: Item[]; dur: Dur };

const SA_ORAL: Item = { text: "Beta-lactam, levofloxacin, clindamycin hoặc linezolid, tùy độ nhạy của chủng và tiền sử dị ứng beta-lactam.", grade: "B-III", ref: "KC IX.a.3" };

const AGENTS: Agent[] = [
  {
    id: "mssa", label: "S. aureus nhạy methicilin (MSSA)", pop: "adult", dur: "sa",
    iv: [
      { text: "Cloxacilin hoặc cefazolin tĩnh mạch.", grade: "A-II", ref: "KC IX.a.1", al: "std" },
      { text: "Có thể cân nhắc thêm daptomycin giai đoạn đầu.", grade: "C-III", ref: "KC IX.a.1", al: "std" },
      { text: "Vancomycin hoặc daptomycin.", grade: "A-II", ref: "KC IX.a.1", al: "alt" },
    ],
    oral: [SA_ORAL],
    notes: [
      { text: "Rifampicin: không có cơ sở bệnh sinh hoặc bằng chứng cho viêm khớp đơn thuần; có thể cân nhắc khi có biến chứng kèm viêm xương.", grade: "A-III", ref: "KC IX.a.4" },
      { text: "Daptomycin: chuyên gia khuyên liều cao (khoảng 10 mg/kg/ngày) và phối hợp thuốc thứ hai (beta-lactam, fosfomycin) để tăng hoạt tính, hạn chế kháng thuốc.", ref: BL("IX") },
    ],
  },
  {
    id: "mrsa", label: "S. aureus kháng methicilin (MRSA)", pop: "adult", dur: "sa",
    iv: [
      { text: "Vancomycin hoặc daptomycin.", grade: "A-II", ref: "KC IX.a.2" },
      { text: "Có thể cân nhắc phối hợp daptomycin + beta-lactam giai đoạn đầu.", grade: "C-III", ref: "KC IX.a.2", al: "std" },
    ],
    oral: [SA_ORAL],
    notes: [
      { text: "Rifampicin: chỉ cân nhắc khi có biến chứng kèm viêm xương.", grade: "A-III", ref: "KC IX.a.4" },
      { text: "Daptomycin: chuyên gia khuyên liều cao (khoảng 10 mg/kg/ngày) và phối hợp thuốc thứ hai. Một nghiên cứu hồi cứu ghi nhận kết cục tốt hơn với daptomycin so với vancomycin, nhất là khi MIC vancomycin ≥ 2 µg/mL.", ref: BL("IX") },
    ],
  },
  {
    id: "mssa-c", label: "S. aureus nhạy methicilin (MSSA)", pop: "child", dur: "sa",
    iv: [
      { text: "Cefazolin hoặc cloxacilin tĩnh mạch ban đầu.", grade: "A-II", ref: "KC IX.b.1", al: "std" },
      { text: "Clindamycin.", grade: "A-I", ref: "KC IX.b.1", al: "alt" },
      { text: "Linezolid, levofloxacin (trẻ > 6 tháng), daptomycin (trẻ > 1 tuổi) hoặc vancomycin.", grade: "B-III", ref: "KC IX.b.1", al: "alt" },
    ],
    oral: [
      { text: "Beta-lactam (ví dụ cefadroxil).", grade: "A-II", ref: "KC IX.b.1", al: "std" },
    ],
    notes: [{ text: "Không có bằng chứng ủng hộ rifampicin trong viêm khớp do tụ cầu ở trẻ em.", ref: BL("IX") }],
  },
  {
    id: "mrsa-c", label: "S. aureus kháng methicilin (MRSA)", pop: "child", dur: "sa",
    iv: [
      { text: "Clindamycin tĩnh mạch ban đầu nếu chủng nhạy.", grade: "A-I", ref: "KC IX.b.2" },
      { text: "Chủng không nhạy clindamycin: linezolid hoặc daptomycin; glycopeptid là lựa chọn hợp lệ nhưng kém phù hợp hơn.", grade: "B-III", ref: "KC IX.b.2" },
    ],
    oral: [{ text: "Tùy độ nhạy: clindamycin (trẻ > 6–8 tuổi, A-I), cotrimoxazol (B-II), levofloxacin (trẻ > 6 tháng) hoặc linezolid (B-III).", ref: "KC IX.b.2" }],
  },
  {
    id: "strep", label: "Liên cầu", pop: "adult", dur: "strep",
    iv: [
      { text: "Liên cầu nhạy: penicilin là thuốc lựa chọn; cephalosporin thế hệ 3 (ceftriaxon, cefotaxim) hoặc ampicilin là lựa chọn thay thế tốt.", grade: "A-II", ref: "KC X.a.1", al: "std" },
      { text: "Dị ứng hoặc giảm nhạy cảm: vancomycin, clindamycin, fluoroquinolon hoặc linezolid.", grade: "B-III", ref: "KC X.a.1" },
    ],
    oral: [{ text: "Amoxicilin, cefuroxim, levofloxacin hoặc moxifloxacin.", grade: "A-III", ref: "KC X.a.2" }],
  },
  {
    id: "strep-c", label: "Liên cầu nhóm A, nhóm B, phế cầu nhạy penicilin", pop: "child", dur: "strep",
    iv: [
      { text: "Penicilin hoặc ampicilin tĩnh mạch ban đầu.", grade: "A-III", ref: "KC X.b.1", al: "std" },
      { text: "Thay thế tùy độ nhạy và dị ứng beta-lactam: cephalosporin thế hệ 3 (ceftriaxon, cefotaxim), levofloxacin (trẻ > 6 tháng), clindamycin, linezolid hoặc vancomycin.", grade: "C-III", ref: "KC X.b.3" },
    ],
    oral: [{ text: "Amoxicilin.", grade: "A-III", ref: "KC X.b.2", al: "std" }],
  },
  {
    id: "gnb", label: "Trực khuẩn Gram âm", pop: "adult", dur: "gnb",
    iv: [
      { text: "Chủng nhạy: cephalosporin thế hệ 2 hoặc 3 tĩnh mạch.", grade: "A-III", ref: "KC XI.a.1", al: "std" },
      { text: "Aztreonam hoặc fluoroquinolon ban đầu.", grade: "B-III", ref: "KC XI.a.1", al: "alt" },
      { text: "Chủng kháng cephalosporin thế hệ 3: hội chẩn chuyên gia bệnh truyền nhiễm.", grade: "A-III", ref: "KC XI.a.1" },
    ],
    oral: [
      { text: "Ciprofloxacin, khi có thể.", grade: "A-III", ref: "KC XI.a.2" },
      { text: "Thay thế tùy độ nhạy: beta-lactam uống hoặc cotrimoxazol.", grade: "B-III", ref: "KC XI.a.2" },
    ],
    notes: [{ text: "Chủng sinh ESBL, AmpC hoặc carbapenemase: tigecyclin, cephalosporin mới (ceftolozan-tazobactam, ceftazidim-avibactam) hoặc phối hợp có meropenem đơn độc hay kèm colistin hoặc fosfomycin; quyết định cùng chuyên gia truyền nhiễm hoặc vi sinh.", ref: BL("XI") }],
  },
  {
    id: "kk", label: "Kingella kingae", pop: "child", dur: "kk",
    iv: [{ text: "Penicilin hoặc ampicilin; cephalosporin thế hệ 1, 2 hoặc amoxicilin-acid clavulanic là lựa chọn thay thế tốt.", grade: "A-II", ref: "KC XI.b.1", al: "std" }],
    notes: [
      { text: "K. kingae kháng clindamycin và cloxacilin.", ref: BL("VIII") },
      { text: "Một loạt 62 trẻ nhiễm K. kingae xâm lấn được điều trị bằng cefuroxim tĩnh mạch 150 mg/kg/ngày hoặc cefazolin 100 mg/kg/ngày (dữ liệu loạt ca, không phải khuyến cáo liều).", ref: BL("XI") },
    ],
  },
  {
    id: "gnb-c", label: "Trực khuẩn Gram âm khác", pop: "child", dur: "gnb",
    iv: [{ text: "Chọn kháng sinh theo kháng sinh đồ.", grade: "A-III", ref: "KC XI.b.2" }],
    notes: [{ text: "Nên kéo dài thời gian điều trị vì nhiều trẻ có suy giảm miễn dịch hoặc bệnh nền nặng.", ref: BL("XI") }],
  },
  {
    id: "gc", label: "Lậu cầu (N. gonorrhoeae)", pop: "adult", dur: "gc",
    iv: [{ text: "Ceftriaxon 1 g mỗi 24 giờ (lựa chọn đầu tay) hoặc cefotaxim 1 g tĩnh mạch mỗi 8 giờ (thay thế).", grade: "A-III", ref: "KC XII – lậu cầu.1", al: "std" }],
    oral: [{ text: "Sau khi lâm sàng cải thiện, theo kháng sinh đồ: ciprofloxacin 500 mg mỗi 12 giờ hoặc cefixim 400 mg mỗi 12 giờ.", grade: "B-III", ref: "KC XII – lậu cầu.1" }],
    notes: [
      { text: "Sàng lọc các bệnh lây truyền qua đường tình dục khác.", grade: "A-II", ref: "KC XII – lậu cầu.1" },
      { text: "Chưa loại trừ Chlamydia: doxycyclin 100 mg uống 2 lần/ngày trong 7 ngày (theo CDC).", ref: BL("XII") },
      { text: "Không dùng fluoroquinolon theo kinh nghiệm vì tỷ lệ lậu cầu kháng quinolon tăng.", ref: BL("XII") },
      { text: "Viêm khớp mủ do lậu cầu hiếm khi cần dẫn lưu phẫu thuật.", ref: BL("XII") },
    ],
  },
  {
    id: "gc-c", label: "Lậu cầu (sơ sinh, vị thành niên)", pop: "child", dur: "gc",
    iv: [
      { text: "Cefotaxim (sơ sinh) hoặc ceftriaxon, trong 7 ngày.", grade: "B-III", ref: "KC XII – lậu cầu.2", al: "std" },
      { text: "Liều: ceftriaxon 25–50 mg/kg/ngày tĩnh mạch hoặc tiêm bắp, 1 lần/ngày trong 7 ngày; cefotaxim 25 mg/kg mỗi 12 giờ trong 7 ngày. Ưu tiên cefotaxim ở trẻ có tăng bilirubin máu.", ref: BL("XII"), al: "std" },
    ],
    notes: [{ text: "Có viêm màng não: kéo dài 10–14 ngày. Chuyển uống theo kháng sinh đồ 24–48 giờ sau khi lâm sàng cải thiện rõ.", ref: BL("XII") }],
  },
  {
    id: "candida", label: "Candida spp.", pop: "both", dur: "candida",
    iv: [{ text: "Trường hợp đã điều trị ngoại khoa: azol, echinocandin hoặc amphotericin B liposome trong 6–8 tuần.", grade: "A-III", ref: "KC XII – Candida.1" }],
    notes: [{ text: "Sơ sinh: đánh giá lan tràn, gồm chọc dịch não tủy và khám đáy mắt.", grade: "B-II", ref: "KC XII – Candida.2" }],
  },
  {
    id: "tb", label: "Mycobacterium tuberculosis", pop: "both", dur: "tb",
    iv: [{ text: "Chẩn đoán sớm (chưa có áp xe lớn hoặc xương chết): điều trị lao như lao các vị trí khác.", grade: "B-III", ref: "KC XII – lao.1" }],
    notes: [{ text: "Điều trị dưới sự giám sát của chuyên gia.", grade: "B-III", ref: "KC XII – lao.2" }],
  },
  {
    id: "neg", label: "Cấy dịch khớp âm tính", pop: "both", dur: "neg",
    iv: [
      { text: "Điều trị tương tự phác đồ kinh nghiệm cho trường hợp nhuộm Gram dịch khớp âm tính (chọn giai đoạn Kinh nghiệm).", grade: "B-III", ref: "KC XIII.1" },
      { text: "Đang hoặc mới dùng kháng sinh: tính đến phổ của kháng sinh đã dùng để điều chỉnh phác đồ.", grade: "B-III", ref: "KC XIII.2" },
      { text: "Đánh giá dịch tễ kỹ để loại trừ vi khuẩn hiếm hoặc khó nuôi cấy.", grade: "B-II", ref: "KC XIII.3" },
    ],
    notes: [{ text: "Không xác định được tác nhân: chẩn đoán vẫn là giả định; theo dõi để phát hiện bệnh khác, nhất là bệnh khớp viêm.", ref: BL("XIII") }],
  },
];

/* ---------------- Thoi gian ---------------- */
type AdultSite = "large" | "axial" | "osteo" | "hand";
const ADULT_SITES: { id: AdultSite; label: string }[] = [
  { id: "large", label: "Khớp lớn ngoại vi, đã dẫn lưu" },
  { id: "axial", label: "Khớp trục" },
  { id: "osteo", label: "Kèm viêm xương kế cận" },
  { id: "hand", label: "Cổ tay, bàn tay, đã dẫn lưu ngoại khoa" },
];
type ChildSite = "simple" | "osteo" | "axial";
const CHILD_SITES: { id: ChildSite; label: string }[] = [
  { id: "simple", label: "Không biến chứng" },
  { id: "osteo", label: "Kèm viêm xương" },
  { id: "axial", label: "Khớp trục" },
];

function durationItems(pop: Pop, agent: Agent | null, adultSite: AdultSite, childSite: ChildSite, slow: boolean, infant: boolean): Item[] {
  const d = agent?.dur;
  if (d === "candida") return [{ text: "6–8 tuần (đã điều trị ngoại khoa).", grade: "A-III", ref: "KC XII – Candida.1" }];
  if (d === "tb") return [{ text: "Như lao các vị trí khác; một số chuyên gia khuyên 9–12 tháng.", grade: "B-III", ref: "KC XII – lao.1" }];
  const out: Item[] = [];
  if (pop === "adult") {
    if (adultSite === "large") {
      const map: Partial<Record<Dur, string>> = { sa: "S. aureus: 3–4 tuần.", gnb: "Trực khuẩn Gram âm: 3–4 tuần.", strep: "Liên cầu: 2–3 tuần.", gc: "Lậu cầu: 1–2 tuần." };
      out.push({ text: d && map[d] ? map[d]! : "S. aureus và trực khuẩn Gram âm 3–4 tuần; liên cầu 2–3 tuần; lậu cầu 1–2 tuần.", grade: "B-III", ref: "KC VII.10" });
      if (d === "gc") out.push({ text: "1 tuần cho hội chứng viêm khớp – viêm da; 2 tuần cho viêm khớp mủ.", ref: BL("XII") });
    }
    if (adultSite === "axial") out.push({ text: "Khớp trục: 6 tuần.", grade: "A-III", ref: "KC VII.10" });
    if (adultSite === "osteo") out.push({ text: "Kèm viêm xương kế cận: kéo dài hơn (hướng dẫn không nêu số tuần).", grade: "A-III", ref: "KC VII.10" });
    if (adultSite === "hand") out.push({ text: "Cổ tay, bàn tay sau dẫn lưu ngoại khoa: 2 tuần (có thể không áp dụng cho MRSA).", grade: "A-I", ref: "KC VII.10" });
    if (slow) out.push({ text: "Suy giảm miễn dịch hoặc đáp ứng chậm, không đầy đủ với điều trị ban đầu: kéo dài hơn.", grade: "B-III", ref: "KC VII.10" });
    if (d === "neg") out.push({ text: "Cấy âm tính: một số tác giả cho rằng có thể rút ngắn còn 2 tuần.", ref: BL("XIII") });
  } else {
    if (childSite === "simple") out.push({ text: "Không biến chứng: 2–3 tuần.", grade: "A-I", ref: "KC VII.11" });
    if (childSite === "osteo") out.push({ text: "Kèm viêm xương: 3–4 tuần.", grade: "A-I", ref: "KC VII.11" });
    if (childSite === "axial") out.push({ text: "Khớp trục: có thể cần 4–6 tuần.", grade: "A-III", ref: "KC VII.11" });
    if (d === "kk") out.push({ text: "K. kingae: 10–14 ngày theo các tác giả.", ref: BL("VII") });
    if (agent?.id === "mrsa-c") out.push({ text: "MRSA: có thể cần 4–6 tuần.", grade: "B-II", ref: "KC VII.11" });
    if (agent?.id === "gnb-c") out.push({ text: "Salmonella, Enterobacterales hoặc P. aeruginosa: có thể cần 4–6 tuần.", grade: "B-III", ref: "KC VII.11" });
    if (infant) out.push({ text: "Sơ sinh và trẻ < 3 tháng: có thể cần 4–6 tuần.", grade: "B-III", ref: "KC VII.11" });
    if (slow) out.push({ text: "Trẻ suy giảm miễn dịch: có thể cần 4–6 tuần.", grade: "B-III", ref: "KC VII.11" });
    if (d === "neg") out.push({ text: "Cấy âm tính: một số tác giả cho rằng có thể rút ngắn còn 10 ngày.", ref: BL("XIII") });
  }
  return out;
}

const ORAL_SWITCH: Record<Pop, Item> = {
  adult: { text: "Khởi trị tĩnh mạch (B-III, KC VII.8). Chuyển uống sau vài ngày (ví dụ 2–7 ngày) khi: không viêm nội tâm mạc, cấy máu âm tính, lâm sàng và xét nghiệm cải thiện, có thuốc uống phù hợp.", grade: "A-II", ref: "KC VII.9" },
  child: { text: "Khởi trị tĩnh mạch (B-III, KC VII.8). Diễn biến lâm sàng và xét nghiệm thuận lợi sau 2–4 ngày tĩnh mạch: chuyển uống.", grade: "A-I", ref: "KC VII.9" },
};

const PRINCIPLES: { title: string; items: Item[] }[] = [
  {
    title: "Trước khi dùng kháng sinh",
    items: [
      { text: "Cấy máu cho mọi trường hợp nghi viêm khớp nhiễm khuẩn, trước kháng sinh khi có thể.", grade: "A-II", ref: "KC IV.1" },
      { text: "Cấy máu dương tính với vi khuẩn thường gây viêm nội tâm mạc (S. aureus, liên cầu nhóm viridans, enterococci): đánh giá viêm nội tâm mạc.", grade: "B-III", ref: "KC IV.1" },
      { text: "Lấy dịch khớp sớm nhất, tốt nhất trước kháng sinh; nhuộm Gram, cấy. Đủ dịch (> 2 mL): cấy thêm vào chai cấy máu tại giường (B-II).", grade: "A-II", ref: "KC IV.2–3" },
      { text: "Huyết động ổn định, không nhiễm khuẩn huyết hoặc sốc nhiễm khuẩn: bắt đầu kháng sinh kinh nghiệm sau khi cấy máu và chọc hút dịch khớp.", grade: "A-II", ref: "KC VII.5" },
      { text: "Huyết động không ổn định, nhiễm khuẩn huyết hoặc sốc nhiễm khuẩn: lấy máu và dịch khớp cấy trước kháng sinh nếu không làm chậm đáng kể (< 45 phút).", grade: "B-III", ref: "KC VII.6" },
      { text: "Phác đồ đích theo tác nhân và kháng sinh đồ; không xác định được tác nhân thì theo tác nhân có khả năng nhất; trao đổi với chuyên gia truyền nhiễm hoặc vi sinh khi có thể.", grade: "A-II", ref: "KC VII.7" },
      { text: "Luôn dùng kháng sinh tác dụng trên S. aureus khi nghi viêm khớp nhiễm khuẩn và nhuộm Gram dịch khớp âm tính; có thể cần bao phủ thêm tác nhân khác (A-III).", grade: "A-II", ref: "KC VIII.1" },
    ],
  },
  {
    title: "Dẫn lưu khớp",
    items: [
      { text: "Dẫn lưu cho viêm khớp vi khuẩn ngoại vi (trừ lậu cầu và lao giai đoạn sớm) và viêm khớp do nấm; khớp lớn ngoại vi dẫn lưu càng sớm càng tốt.", grade: "A-II", ref: "KC VII.2–3" },
      { text: "Người lớn: khớp gối – nội soi dẫn lưu kèm cắt màng hoạt dịch là lựa chọn đầu (B-II), chọc hút kim là lựa chọn khác (B-II); cổ chân, khuỷu, cổ tay – chọc hút kim hoặc nội soi (B-III); háng, vai – nội soi hoặc mở khớp (B-II); diễn biến không thuận lợi sau chọc hút nhắc lại hoặc nội soi: phẫu thuật mở (B-III).", ref: "KC XV.2" },
      { text: "Trẻ em: viêm khớp không biến chứng (trừ khớp háng) – chọc hút kim (B-I); háng, gối, cổ chân, vai, khuỷu, cổ tay – nội soi ưu tiên hơn mở khớp (B-II); háng và vai ở trẻ nhỏ, hoặc khi biện pháp bảo tồn thất bại – mở khớp (C-III).", ref: "KC XV.3" },
    ],
  },
  {
    title: "Điều trị bổ trợ",
    items: [
      { text: "Trẻ em: NSAID có thể có lợi trong giai đoạn cấp khi còn dấu hiệu viêm.", grade: "A-III", ref: "KC XIV.1" },
      { text: "Trẻ đã xác định viêm khớp nhiễm khuẩn: đợt ngắn corticoid tĩnh mạch sớm có thể giúp hồi phục nhanh, rút ngắn nằm viện. PIDS/IDSA 2023 khuyến cáo không dùng corticoid bổ trợ – quyết định cần hội chẩn.", grade: "B-I", ref: "KC XIV.2" },
      { text: "Người lớn: không khuyến cáo corticoid.", grade: "D-III", ref: "KC XIV.3" },
    ],
  },
  {
    title: "Phục hồi chức năng",
    items: [
      { text: "Tập vật lý trị liệu sau dẫn lưu ngoại khoa.", grade: "B-III", ref: "KC XVII.1" },
      { text: "Vận động khớp sớm, ban đầu thụ động. Trẻ viêm khớp háng: chỉ bó bột dạng háng khi nhiễm khuẩn nặng có nguy cơ trật khớp (B-II).", grade: "B-III", ref: "KC XVII.2" },
      { text: "Khớp háng: không chịu lực sớm, kể cả chịu lực một phần.", grade: "D-III", ref: "KC XVII.3" },
      { text: "Khớp gối: chịu lực một phần sớm khi đã kiểm soát đau.", grade: "B-III", ref: "KC XVII.4" },
    ],
  },
  {
    title: "Theo dõi",
    items: [
      { text: "Theo dõi ngoại trú với kháng sinh uống (hoặc kháng sinh tiêm ngoại trú nếu không uống được) khi diễn biến lâm sàng và xét nghiệm thuận lợi.", grade: "B-III", ref: "KC XVIII.1" },
      { text: "Theo dõi lâm sàng (đau, viêm, chức năng khớp) và xét nghiệm (công thức máu, CRP, tốc độ máu lắng); theo dõi tác dụng không mong muốn khi dùng kháng sinh.", grade: "B-III", ref: "KC XVIII.2" },
      { text: "Tái khám chấn thương chỉnh hình và truyền nhiễm sau ra viện 1–2 tuần, 4–6 tuần và 3 tháng (C-III); theo dõi ít nhất 1 năm ở người lớn có nguy cơ di chứng và ở trẻ em (B-III).", ref: "KC XVIII.3" },
    ],
  },
];

/* ---------------- Giao dien ---------------- */
function Grade({ g }: { g?: string }) {
  if (!g) return <span className="sa24-g sa24-g-n" title="Nội dung phần phân tích, không phải khuyến cáo đánh số">Bàn luận</span>;
  return <span className={`sa24-g sa24-g-${g[0].toLowerCase()}`} title="Mức khuyến cáo – chất lượng bằng chứng">{g}</span>;
}
function List({ items }: { items: Item[] }) {
  return (
    <ul className="sa24-list">
      {items.map((it) => (
        <li key={it.text}><Grade g={it.grade} /><span>{it.text} <em>{it.ref}</em></span></li>
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
function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="sa24-row"><div className="sa24-lab">{label}</div><div className="sa24-ctl">{children}</div></div>;
}

/* Loc theo di ung; nhanh khong co lua chon thay the -> giu phac do chuan kem canh bao. */
function byAllergy(items: Item[], allergy: boolean): { shown: Item[]; noAlt: boolean } {
  if (!allergy) return { shown: items.filter((i) => i.al !== "alt"), noAlt: false };
  const hasAlt = items.some((i) => i.al === "alt");
  const hasStd = items.some((i) => i.al === "std");
  if (!hasAlt && hasStd) return { shown: items, noAlt: true };
  return { shown: items.filter((i) => i.al !== "std"), noAlt: false };
}

export default function SepticArthritisSeimc2024() {
  const [pop, setPop] = useState<Pop>("adult");
  const [age, setAge] = useState<ChildAge>("3m2y");
  const [stage, setStage] = useState<Stage>("empiric");
  const [ctx, setCtx] = useState("none");
  const [agentId, setAgentId] = useState("mssa");
  const [allergy, setAllergy] = useState<"no" | "yes">("no");
  const [adultSite, setAdultSite] = useState<AdultSite>("large");
  const [childSite, setChildSite] = useState<ChildSite>("simple");
  const [slow, setSlow] = useState(false);

  const contexts = useMemo(() => CONTEXTS.filter((c) => c.pop === "both" || c.pop === pop), [pop]);
  const agents = useMemo(() => AGENTS.filter((a) => a.pop === "both" || a.pop === pop), [pop]);
  const context = stage === "empiric" ? contexts.find((c) => c.id === ctx) ?? null : null;
  const agent = stage === "directed" ? agents.find((a) => a.id === agentId) ?? agents[0] : null;
  const al = allergy === "yes";

  function changePop(p: Pop) {
    setPop(p);
    setCtx(p === "adult" ? "none" : "age");
    setAgentId(p === "adult" ? "mssa" : "mssa-c");
    setSlow(false);
  }

  let base: Item[] = [];
  let agentsText = "";
  let notes: Item[] = [];
  let extraNotes: string[] = [];
  if (stage === "empiric") {
    if (context) { base = context.items; agentsText = context.agents; extraNotes = context.notes ?? []; }
    else { base = CHILD_EMPIRIC[age]; agentsText = "S. aureus (luôn bao phủ cho đến khi loại trừ); trẻ nhỏ cần bao phủ thêm K. kingae"; }
  } else if (agent) {
    base = agent.iv; notes = agent.notes ?? [];
  }
  const childEmpiricAllergy = al && stage === "empiric" && !context;
  const start = byAllergy(base, al);
  const oral = agent?.oral ? byAllergy(agent.oral, al).shown : [];
  const durations = durationItems(pop, agent, adultSite, childSite, slow, pop === "child" && age === "lt3m");

  const summary = [pop === "adult" ? "Người lớn" : `Trẻ em ${CHILD_AGES.find((a) => a.id === age)?.label}`,
    stage === "empiric" ? `Kinh nghiệm – ${context ? context.label : "không có yếu tố nguy cơ đặc biệt"}` : `Đã có tác nhân – ${agent?.label}`,
    al ? "Dị ứng beta-lactam" : null].filter(Boolean).join(" · ");

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Chọn kháng sinh · viêm khớp nhiễm khuẩn khớp tự nhiên</p>
        <h3>GEIO–SEIMC/SEIP/SECOT 2024</h3>
        <p className="sa24-sub">Người lớn và trẻ em. Không áp dụng cho nhiễm khuẩn khớp nhân tạo và viêm khớp do virus.</p>
      </header>

      <div className="sa24-form">
        <Row label="Đối tượng">
          <Seg label="Đối tượng" value={pop} onChange={changePop} options={[{ id: "adult", label: "Người lớn" }, { id: "child", label: "Trẻ em" }] as const} />
          {pop === "child" && <Seg label="Nhóm tuổi" value={age} onChange={setAge} options={CHILD_AGES} />}
        </Row>
        <Row label="Giai đoạn">
          <Seg label="Giai đoạn" value={stage} onChange={setStage} options={[{ id: "empiric", label: "Kinh nghiệm" }, { id: "directed", label: "Đã có tác nhân" }] as const} />
        </Row>
        {stage === "empiric" ? (
          <Row label="Bối cảnh">
            <select value={context ? ctx : "age"} onChange={(e) => setCtx(e.target.value)} aria-label="Bối cảnh dịch tễ">
              {pop === "child" && <option value="age">Không có yếu tố nguy cơ tác nhân đặc biệt hoặc vi khuẩn kháng thuốc</option>}
              {contexts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </Row>
        ) : (
          <Row label="Tác nhân">
            <select value={agent?.id} onChange={(e) => setAgentId(e.target.value)} aria-label="Tác nhân">
              {agents.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </Row>
        )}
        <Row label="Dị ứng beta-lactam">
          <Seg label="Dị ứng beta-lactam" value={allergy} onChange={setAllergy} options={[{ id: "no", label: "Không" }, { id: "yes", label: "Có" }] as const} />
        </Row>
        <Row label="Vị trí khớp">
          {pop === "adult"
            ? <Seg label="Vị trí khớp" value={adultSite} onChange={setAdultSite} options={ADULT_SITES} />
            : <Seg label="Biến chứng" value={childSite} onChange={setChildSite} options={CHILD_SITES} />}
          <label className="sa24-chk"><input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} /> {pop === "adult" ? "Suy giảm miễn dịch hoặc đáp ứng chậm với điều trị ban đầu" : "Trẻ suy giảm miễn dịch"}</label>
        </Row>
      </div>

      <section className="sa24-out" aria-live="polite">
        <p className="sa24-sum">{summary}</p>
        {agentsText && <p className="sa24-agents"><b>Căn nguyên cần bao phủ:</b> {agentsText}</p>}

        <h4>{al && !start.noAlt && !childEmpiricAllergy ? "Phác đồ khởi trị khi dị ứng beta-lactam" : "Phác đồ khởi trị"}</h4>
        {childEmpiricAllergy
          ? <p className="sa24-warn">Hướng dẫn không nêu phác đồ kinh nghiệm riêng cho trẻ dị ứng beta-lactam; các phác đồ theo tuổi dưới đây đều có beta-lactam. Khi đã có tác nhân, chọn Đã có tác nhân để xem lựa chọn thay thế (ví dụ MSSA: clindamycin A-I; linezolid, levofloxacin, daptomycin, vancomycin B-III).</p>
          : start.noAlt && <p className="sa24-warn">Hướng dẫn không nêu lựa chọn thay thế cho người dị ứng beta-lactam ở nhánh này. Phác đồ dưới đây có beta-lactam: đánh giá loại và mức độ dị ứng, hội chẩn trước khi dùng.</p>}
        <List items={start.shown} />
        {stage === "empiric" && pop === "adult" && ctx === "none" && <p className="sa24-tip">Nhuộm Gram dương tính: chọn theo vi khuẩn thấy trên nhuộm Gram. Bối cảnh đặc biệt (bệnh viện, sau thủ thuật, vết cắn…): chọn ở mục Bối cảnh.</p>}
        {extraNotes.map((n) => <p key={n} className="sa24-tip">{n}</p>)}

        <h4>Chuyển đường uống</h4>
        <List items={[ORAL_SWITCH[pop], ...oral]} />
        {al && agent?.id === "mssa-c" && <p className="sa24-tip">Hướng dẫn không tách riêng thuốc uống cho trẻ dị ứng beta-lactam; các lựa chọn thay thế ở phần khởi trị được nêu chung, chọn theo độ nhạy của chủng.</p>}

        <h4>Thời gian điều trị</h4>
        <List items={durations} />
        {pop === "adult" && <p className="sa24-tip">Áp dụng cho người lớn không có viêm nội tâm mạc.</p>}

        {notes.length > 0 && (<><h4>Lưu ý</h4><List items={notes} /></>)}
        <p className="sa24-tip">Thuốc không kèm liều: hướng dẫn không nêu liều – tra tại module Hiệu chỉnh liều.</p>
      </section>

      <details className="sa24-more">
        <summary>Nguyên tắc chung: bệnh phẩm, dẫn lưu, bổ trợ, phục hồi chức năng, theo dõi</summary>
        {PRINCIPLES.map((p) => (<div key={p.title} className="sa24-pblock"><h5>{p.title}</h5><List items={p.items} /></div>))}
      </details>
      <details className="sa24-more">
        <summary>Cách đọc mức khuyến cáo</summary>
        <p className="sa24-legend">Sức mạnh khuyến cáo: A ủng hộ mạnh · B ủng hộ vừa · C ủng hộ ít · D khuyến cáo không dùng. Chất lượng bằng chứng: I thử nghiệm ngẫu nhiên có đối chứng · II thử nghiệm không ngẫu nhiên, nghiên cứu thuần tập hoặc bệnh chứng · III ý kiến chuyên gia, mô tả ca. KC: số khuyến cáo trong hướng dẫn. Bàn luận: nội dung phần phân tích, không phải khuyến cáo đánh số.</p>
      </details>

      <p className="sa24-src">Nguồn: {SRC}. Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt.</p>

      <style>{`
        .sa24 { border: 1px solid #dbe6ed; border-radius: 16px; padding: 16px; margin: 12px 0; background: #fff; display: grid; gap: 14px; min-width: 0; }
        .sa24-eyebrow { margin: 0; font-size: 11.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; color: #087f89; }
        .sa24 h3 { margin: 2px 0 0; font-size: 18px; font-weight: 800; color: #0f2236; }
        .sa24-sub { margin: 2px 0 0; font-size: 13px; color: #4b6576; }
        .sa24-form { display: grid; border: 1px solid #e3eaf0; border-radius: 12px; overflow: hidden; }
        .sa24-row { display: grid; grid-template-columns: 150px minmax(0,1fr); gap: 12px; align-items: start; padding: 10px 12px; border-top: 1px solid #edf2f6; }
        .sa24-row:first-child { border-top: 0; }
        .sa24-lab { font-size: 13px; font-weight: 800; color: #0b3a5b; padding-top: 6px; }
        .sa24-ctl { display: grid; gap: 6px; min-width: 0; }
        .sa24-seg { display: flex; flex-wrap: wrap; gap: 6px; }
        .sa24-seg button { border: 1px solid #cfdde6; background: #f7fafc; border-radius: 999px; padding: 6px 12px; font: inherit; font-size: 13px; color: #33505f; cursor: pointer; text-align: left; }
        .sa24-seg button.on { background: #0b3a5b; border-color: #0b3a5b; color: #fff; font-weight: 700; }
        .sa24 select { width: 100%; max-width: 100%; border: 1px solid #cfdde6; border-radius: 10px; padding: 8px 10px; font: inherit; font-size: 13.5px; background: #fff; }
        .sa24-chk { display: flex; gap: 6px; align-items: center; font-size: 13px; color: #33505f; }
        .sa24-out { border: 1px solid #cfe3e6; background: #f8fcfc; border-radius: 12px; padding: 12px 14px; display: grid; gap: 6px; }
        .sa24-sum { margin: 0; font-size: 12.5px; font-weight: 700; color: #087f89; }
        .sa24-agents { margin: 0; font-size: 13.5px; color: #33505f; }
        .sa24-out h4 { margin: 10px 0 0; font-size: 15px; font-weight: 800; color: #0b3a5b; }
        .sa24-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
        .sa24-list li { display: grid; grid-template-columns: 64px minmax(0,1fr); gap: 8px; align-items: start; font-size: 14px; line-height: 1.55; color: #10243e; }
        .sa24-list em { font-style: normal; font-size: 12px; color: #6b8293; white-space: nowrap; }
        .sa24-g { display: inline-block; text-align: center; border-radius: 6px; padding: 1px 4px; font-size: 11.5px; font-weight: 800; }
        .sa24-g-a { background: #dff3e8; color: #106b3d; }
        .sa24-g-b { background: #e6f0fb; color: #1d4f8a; }
        .sa24-g-c { background: #fff3d6; color: #8a5a00; }
        .sa24-g-d { background: #fde4e4; color: #9b1c1c; }
        .sa24-g-n { background: #f1f5f8; color: #557080; font-weight: 700; }
        .sa24-warn { margin: 0; font-size: 13px; line-height: 1.55; color: #7c2d12; background: #fff4ed; border: 1px solid #f6cfb5; border-radius: 8px; padding: 6px 10px; }
        .sa24-tip { margin: 0; font-size: 12.5px; line-height: 1.55; color: #4b6576; }
        .sa24-more summary { cursor: pointer; font-weight: 700; font-size: 13.5px; color: #0b3a5b; }
        .sa24-more[open] { display: grid; gap: 10px; }
        .sa24-pblock h5 { margin: 0 0 6px; font-size: 13px; font-weight: 800; color: #33505f; text-transform: uppercase; letter-spacing: .03em; }
        .sa24-legend { margin: 0; font-size: 13px; line-height: 1.6; color: #33505f; }
        .sa24-src { margin: 0; font-size: 12px; line-height: 1.5; color: #6b8293; border-top: 1px solid #edf2f6; padding-top: 8px; }
        @media (max-width: 640px) {
          .sa24-row { grid-template-columns: 1fr; gap: 6px; }
          .sa24-lab { padding-top: 0; }
          .sa24-list li { grid-template-columns: 1fr; gap: 2px; }
          .sa24-g { justify-self: start; }
          .sa24-list em { white-space: normal; }
        }
      `}</style>
    </article>
  );
}
