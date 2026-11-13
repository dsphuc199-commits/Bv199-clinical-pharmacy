"use client";

/*
  Viem khop nhiem khuan khop tu nhien – GEIO (SEIMC), SEIP, SECOT 2024.
  - Noi dung dung theo huong dan; muc khuyen cao (A–D) va chat luong bang chung (I–III) theo huong dan.
  - role: vai tro cua lua chon (Uu tien / Thay the / Di ung beta-lactam / dieu kien lam sang).
  - ref: vi tri trong huong dan (chi luu de doi chieu, KHONG hien thi). Khong xep muc -> nhan "Tham khảo".
  - al: "std" = phac do co beta-lactam (an khi di ung); "alt" = chi hien khi di ung; khong ghi = luon hien.
  - Lieu: chi ghi khi huong dan neu; khong tu bo sung.
*/

import { useMemo, useState } from "react";
import {
  PIDS_AGENTS, PIDS_AGES, PIDS_CONTEXTS, PIDS_DEFINITIVE_PRINCIPLE, PIDS_DOSE_NOTES, PIDS_DOSE_TABLE, PIDS_KINGELLA,
  PIDS_PRINCIPLES, PIDS_ROUTE, PIDS_TIMING, pidsDuration, type PidsAge, type RxItem,
} from "./septic-arthritis-pids2023";
import { ALG, ALT, PREF, GRADE_LEGEND, Legend, Row, Rx, RxToolStyle, Seg, byAllergy } from "./rx-tool";

type Item = RxItem;
type Pop = "adult" | "child";
type Stage = "empiric" | "directed";

const SRC = "GEIO–SEIMC/SEIP/SECOT 2024 – Hướng dẫn chẩn đoán và điều trị viêm khớp nhiễm khuẩn ở người lớn và trẻ em";

/* ================= Kinh nghiem ================= */
const CHILD_AGES = [
  { id: "lt3m", label: "< 3 tháng" },
  { id: "3m2y", label: "3 tháng – 2 tuổi" },
  { id: "2y4y", label: "2 – 4 tuổi" },
  { id: "gt4y", label: "> 4 tuổi" },
] as const;
type ChildAge = (typeof CHILD_AGES)[number]["id"];

const CHILD_EMPIRIC: Record<ChildAge, Item[]> = {
  lt3m: [{ role: PREF, text: "Cloxacilin hoặc cefazolin, phối hợp cefotaxim hoặc gentamicin. Tránh phối hợp 2 cephalosporin.", grade: "A-II", ref: "VIII.3", al: "std" }],
  "3m2y": [
    { role: PREF, text: "Cefuroxim.", grade: "A-II", ref: "VIII.3", al: "std" },
    { role: ALT, text: "Cloxacilin + cefotaxim, hoặc amoxicilin-acid clavulanic.", grade: "A-II", ref: "VIII.3", al: "std" },
  ],
  "2y4y": [
    { role: PREF, text: "Cefazolin.", grade: "A-II", ref: "VIII.3", al: "std" },
    { role: "Trẻ tiêm chủng chưa đầy đủ", text: "Cefuroxim, để bao phủ H. influenzae và S. pneumoniae.", grade: "A-II", ref: "VIII.3", al: "std" },
  ],
  gt4y: [
    { role: PREF, text: "Cefazolin hoặc cloxacilin.", grade: "A-II", ref: "VIII.3", al: "std" },
    { role: "Tùy dịch tễ tại chỗ", text: "Cefazolin, cloxacilin hoặc clindamycin.", ref: "VIII bàn luận" },
  ],
};

type Context = { id: string; label: string; pop: Pop | "both"; agents: string; items: Item[]; notes?: string[] };

const CONTEXTS: Context[] = [
  {
    id: "none", label: "Không có yếu tố nguy cơ tác nhân đặc biệt hoặc vi khuẩn kháng thuốc", pop: "adult",
    agents: "S. aureus, liên cầu, trực khuẩn Gram âm thường gặp",
    items: [
      { role: PREF, text: "Cloxacilin + ceftriaxon, hoặc amoxicilin-acid clavulanic đơn trị.", grade: "B-III", ref: "VIII.2", al: "std" },
      { role: ALG, text: "Glycopeptid hoặc daptomycin, phối hợp aztreonam hoặc fluoroquinolon.", grade: "B-III", ref: "VIII.2", al: "alt" },
    ],
  },
  {
    id: "gramneg", label: "Nghi trực khuẩn Gram âm (người cao tuổi, nhiễm khuẩn bệnh viện, suy giảm miễn dịch, tiêm chích ma túy)", pop: "adult",
    agents: "Trực khuẩn Gram âm; luôn kèm thuốc có tác dụng trên S. aureus",
    items: [
      { role: PREF, text: "Phác đồ có cephalosporin thế hệ 3: ceftriaxon 2 g tĩnh mạch mỗi 24 giờ, hoặc cefotaxim 2 g tĩnh mạch mỗi 8 giờ.", ref: "VIII bàn luận", al: "std" },
      { role: "Nghi P. aeruginosa", text: "Ceftazidim.", ref: "VIII bàn luận", al: "std" },
      { role: "Nghi nhiễm nhiều vi khuẩn", text: "Amoxicilin-acid clavulanic; piperacilin-tazobactam nếu nghi P. aeruginosa. Ví dụ: người đái tháo đường nhiễm khuẩn khớp nhỏ bàn chân, ngón chân.", ref: "VIII bàn luận", al: "std" },
      { role: "Nguy cơ Gram âm đa kháng cao", text: "Carbapenem cho đến khi có kháng sinh đồ.", ref: "VIII bàn luận", al: "std" },
      { role: ALG, text: "Aztreonam hoặc fluoroquinolon.", ref: "VIII bàn luận", al: "alt" },
    ],
  },
  {
    id: "mrsa", label: "Cân nhắc bao phủ MRSA theo kinh nghiệm", pop: "adult",
    agents: "S. aureus kháng methicilin",
    items: [{ role: "Lựa chọn có thể", text: "Beta-lactam phối hợp vancomycin hoặc daptomycin; hoặc cephalosporin có tác dụng trên MRSA (ceftarolin, ceftobiprol). Hướng dẫn chưa đưa khuyến cáo chính thức cho tình huống này.", ref: "VIII bàn luận", al: "std" }],
    notes: ["Vancomycin kém hơn beta-lactam trong nhiều bối cảnh: nếu chủng cuối cùng nhạy methicilin, người bệnh nhận điều trị chưa tối ưu cho đến khi có kháng sinh đồ."],
  },
  {
    id: "mrsa-child", label: "Nguy cơ MRSA", pop: "child",
    agents: "S. aureus kháng methicilin",
    items: [
      { role: "Nguy cơ MRSA cao, hoặc MRSA > 10–15% số chủng S. aureus tại cơ sở", text: "Clindamycin.", ref: "VIII bàn luận" },
      { role: "Kháng clindamycin > 10–15%, hoặc bệnh cảnh nặng", text: "Vancomycin. Một số chuyên gia phối hợp clindamycin, hoặc ưu tiên linezolid, daptomycin.", ref: "VIII bàn luận" },
    ],
  },
  {
    id: "hosp", label: "Nhiễm khuẩn bệnh viện", pop: "both",
    agents: "S. aureus (nhạy hoặc kháng methicilin), trực khuẩn Gram âm; nhiều căn nguyên và cơ chế kháng",
    items: [
      { role: PREF, text: "Daptomycin hoặc vancomycin, phối hợp cefepim hoặc meropenem.", ref: "Bảng 4", al: "std" },
      { role: ALG, text: "Daptomycin hoặc vancomycin, phối hợp aztreonam hoặc ciprofloxacin.", ref: "Bảng 4", al: "alt" },
    ],
  },
  {
    id: "procedure", label: "Có phẫu thuật khớp hoặc chọc khớp trước đó", pop: "both",
    agents: "Tụ cầu không sinh coagulase, S. aureus (nhạy hoặc kháng methicilin), liên cầu, Enterobacterales, P. aeruginosa",
    items: [
      { role: PREF, text: "Daptomycin hoặc vancomycin, phối hợp cefepim hoặc meropenem.", ref: "Bảng 4", al: "std" },
      { role: ALG, text: "Daptomycin hoặc vancomycin, phối hợp aztreonam hoặc ciprofloxacin.", ref: "Bảng 4", al: "alt" },
    ],
    notes: ["Tụ cầu không sinh coagulase là căn nguyên thường gặp nhất sau phẫu thuật dây chằng chéo hoặc cắt sụn chêm. Đã có các vụ dịch do liên cầu và vi khuẩn khoang miệng sau tiêm corticoid nội khớp không bảo đảm vô khuẩn."],
  },
  {
    id: "thorn", label: "Gai thực vật đâm", pop: "both",
    agents: "Enterobacterales (Pantoea agglomerans); Nocardia spp.",
    items: [
      { role: PREF, text: "Ceftriaxon hoặc ertapenem.", ref: "Bảng 4", al: "std" },
      { role: ALG, text: "Ciprofloxacin.", ref: "Bảng 4", al: "alt" },
      { role: "Nocardia spp.", text: "Không điều trị kinh nghiệm; điều trị đích khi phân lập được.", ref: "Bảng 4" },
    ],
  },
  {
    id: "shoe", label: "Vết đâm xuyên qua giày", pop: "both",
    agents: "P. aeruginosa, S. aureus",
    items: [{ role: PREF, text: "Cloxacilin + beta-lactam chống trực khuẩn mủ xanh (ceftazidim), hoặc piperacilin-tazobactam, hoặc meropenem.", ref: "Bảng 4", al: "std" }],
    notes: ["Cần loại trừ viêm xương kèm theo và cắt lọc kỹ."],
  },
  {
    id: "human", label: "Người cắn", pop: "both",
    agents: "Eikenella corrodens, vi khuẩn kỵ khí, liên cầu",
    items: [
      { role: PREF, text: "Amoxicilin-acid clavulanic.", ref: "Bảng 4", al: "std" },
      { role: ALG, text: "Clindamycin + ciprofloxacin.", ref: "Bảng 4", al: "alt" },
    ],
  },
  {
    id: "animal", label: "Động vật cắn", pop: "both",
    agents: "Pasteurella multocida, Capnocytophaga spp., vi khuẩn kỵ khí",
    items: [
      { role: PREF, text: "Amoxicilin-acid clavulanic.", ref: "Bảng 4", al: "std" },
      { role: ALG, text: "Clindamycin + ciprofloxacin.", ref: "Bảng 4", al: "alt" },
    ],
  },
  {
    id: "farm", label: "Tiếp xúc trang trại hoặc động vật", pop: "both",
    agents: "Bartonella, Brucella, Coxiella",
    items: [{ role: "Điều trị đích", text: "Sau khi chẩn đoán căn nguyên; cân nhắc doxycyclin hoặc quinolon.", ref: "Bảng 4" }],
  },
  {
    id: "sti", label: "Nghi nhiễm khuẩn lây truyền qua đường tình dục", pop: "both",
    agents: "Neisseria gonorrhoeae",
    items: [{ role: PREF, text: "Ceftriaxon hoặc cefotaxim.", ref: "Bảng 4", al: "std" }],
    notes: ["Sàng lọc các bệnh lây truyền qua đường tình dục khác; cân nhắc điều trị Chlamydia. Liều: chọn giai đoạn Đích → Lậu cầu."],
  },
  {
    id: "cgd", label: "Bệnh u hạt mạn tính", pop: "child",
    agents: "S. aureus, Serratia, Aspergillus",
    items: [{ role: PREF, text: "Meropenem hoặc piperacilin-tazobactam.", ref: "Bảng 4", al: "std" }],
  },
  {
    id: "sickle", label: "Bệnh hồng cầu hình liềm", pop: "child",
    agents: "S. aureus, Salmonella, S. pneumoniae",
    items: [{ role: PREF, text: "Cephalosporin thế hệ 3 + cloxacilin.", ref: "Bảng 4", al: "std" }],
  },
  {
    id: "ifng", label: "Suy giảm miễn dịch đường interferon gamma", pop: "child",
    agents: "Mycobacteria",
    items: [{ role: "Điều trị đích", text: "Không điều trị kinh nghiệm; điều trị đích khi phân lập được.", ref: "Bảng 4" }],
  },
  {
    id: "varicella", label: "Thủy đậu, vết thương da", pop: "child",
    agents: "Liên cầu nhóm A",
    items: [{ role: PREF, text: "Cefazolin.", ref: "Bảng 4", al: "std" }],
  },
];

/* ================= Theo tac nhan ================= */
type Dur = "sa" | "gnb" | "strep" | "gc" | "candida" | "tb" | "kk" | "neg";
type Agent = { id: string; label: string; pop: Pop | "both"; iv: Item[]; oral?: Item[]; notes?: Item[]; dur: Dur };

const SA_ORAL: Item = { role: "Uống nối tiếp", text: "Beta-lactam, levofloxacin, clindamycin hoặc linezolid, theo độ nhạy của chủng và tiền sử dị ứng beta-lactam.", grade: "B-III", ref: "IX.a.3" };
const RIF_ADULT: Item = { role: "Rifampicin", text: "Không dùng cho viêm khớp đơn thuần; chỉ cân nhắc khi có biến chứng kèm viêm xương.", grade: "A-III", ref: "IX.a.4" };

const AGENTS: Agent[] = [
  {
    id: "mssa", label: "S. aureus nhạy methicilin (MSSA)", pop: "adult", dur: "sa",
    iv: [
      { role: PREF, text: "Cloxacilin hoặc cefazolin tĩnh mạch.", grade: "A-II", ref: "IX.a.1", al: "std" },
      { role: "Cân nhắc phối hợp", text: "Thêm daptomycin trong giai đoạn đầu.", grade: "C-III", ref: "IX.a.1", al: "std" },
      { role: ALG, text: "Vancomycin hoặc daptomycin.", grade: "A-II", ref: "IX.a.1", al: "alt" },
    ],
    oral: [SA_ORAL],
    notes: [
      RIF_ADULT,
      { role: "Daptomycin", text: "Liều cao (khoảng 10 mg/kg/ngày), phối hợp thuốc thứ hai (beta-lactam, fosfomycin) để tăng hoạt tính và hạn chế kháng thuốc – ý kiến chuyên gia.", ref: "IX bàn luận" },
    ],
  },
  {
    id: "mrsa", label: "S. aureus kháng methicilin (MRSA)", pop: "adult", dur: "sa",
    iv: [
      { role: PREF, text: "Vancomycin hoặc daptomycin.", grade: "A-II", ref: "IX.a.2" },
      { role: "Cân nhắc phối hợp", text: "Daptomycin + beta-lactam trong giai đoạn đầu.", grade: "C-III", ref: "IX.a.2", al: "std" },
    ],
    oral: [SA_ORAL],
    notes: [
      RIF_ADULT,
      { role: "Daptomycin", text: "Liều cao (khoảng 10 mg/kg/ngày), phối hợp thuốc thứ hai. Một nghiên cứu hồi cứu ghi nhận kết cục tốt hơn so với vancomycin, nhất là khi MIC vancomycin ≥ 2 µg/mL.", ref: "IX bàn luận" },
    ],
  },
  {
    id: "mssa-c", label: "S. aureus nhạy methicilin (MSSA)", pop: "child", dur: "sa",
    iv: [
      { role: PREF, text: "Cefazolin hoặc cloxacilin tĩnh mạch.", grade: "A-II", ref: "IX.b.1", al: "std" },
      { role: ALG, text: "Clindamycin.", grade: "A-I", ref: "IX.b.1", al: "alt" },
      { role: `${ALG} – thay thế khác`, text: "Linezolid, levofloxacin (trẻ > 6 tháng), daptomycin (trẻ > 1 tuổi) hoặc vancomycin.", grade: "B-III", ref: "IX.b.1", al: "alt" },
    ],
    oral: [{ role: "Uống nối tiếp", text: "Beta-lactam (ví dụ cefadroxil).", grade: "A-II", ref: "IX.b.1", al: "std" }],
    notes: [{ role: "Rifampicin", text: "Không có bằng chứng ủng hộ trong viêm khớp do tụ cầu ở trẻ em.", ref: "IX bàn luận" }],
  },
  {
    id: "mrsa-c", label: "S. aureus kháng methicilin (MRSA)", pop: "child", dur: "sa",
    iv: [
      { role: "Chủng nhạy clindamycin", text: "Clindamycin tĩnh mạch.", grade: "A-I", ref: "IX.b.2" },
      { role: "Chủng kháng clindamycin", text: "Linezolid hoặc daptomycin; glycopeptid hợp lệ nhưng kém phù hợp hơn.", grade: "B-III", ref: "IX.b.2" },
    ],
    oral: [
      { role: "Uống nối tiếp", text: "Clindamycin (trẻ > 6–8 tuổi).", grade: "A-I", ref: "IX.b.2" },
      { role: "Uống nối tiếp", text: "Cotrimoxazol.", grade: "B-II", ref: "IX.b.2" },
      { role: "Uống nối tiếp", text: "Levofloxacin (trẻ > 6 tháng) hoặc linezolid.", grade: "B-III", ref: "IX.b.2" },
    ],
  },
  {
    id: "strep", label: "Liên cầu", pop: "adult", dur: "strep",
    iv: [
      { role: PREF, text: "Penicilin.", grade: "A-II", ref: "X.a.1", al: "std" },
      { role: ALT, text: "Cephalosporin thế hệ 3 (ceftriaxon, cefotaxim) hoặc ampicilin.", grade: "A-II", ref: "X.a.1", al: "std" },
      { role: "Dị ứng beta-lactam hoặc giảm nhạy cảm", text: "Vancomycin, clindamycin, fluoroquinolon hoặc linezolid.", grade: "B-III", ref: "X.a.1" },
    ],
    oral: [{ role: "Uống nối tiếp", text: "Amoxicilin, cefuroxim, levofloxacin hoặc moxifloxacin.", grade: "A-III", ref: "X.a.2" }],
  },
  {
    id: "strep-c", label: "Liên cầu nhóm A, nhóm B, phế cầu nhạy penicilin", pop: "child", dur: "strep",
    iv: [
      { role: PREF, text: "Penicilin hoặc ampicilin tĩnh mạch.", grade: "A-III", ref: "X.b.1", al: "std" },
      { role: "Thay thế, theo độ nhạy và dị ứng beta-lactam", text: "Cephalosporin thế hệ 3 (ceftriaxon, cefotaxim), levofloxacin (trẻ > 6 tháng), clindamycin, linezolid hoặc vancomycin.", grade: "C-III", ref: "X.b.3" },
    ],
    oral: [{ role: "Uống nối tiếp", text: "Amoxicilin.", grade: "A-III", ref: "X.b.2", al: "std" }],
  },
  {
    id: "gnb", label: "Trực khuẩn Gram âm", pop: "adult", dur: "gnb",
    iv: [
      { role: PREF, text: "Cephalosporin thế hệ 2 hoặc 3 tĩnh mạch (chủng nhạy).", grade: "A-III", ref: "XI.a.1", al: "std" },
      { role: ALG, text: "Aztreonam hoặc fluoroquinolon.", grade: "B-III", ref: "XI.a.1", al: "alt" },
      { role: "Kháng cephalosporin thế hệ 3", text: "Hội chẩn chuyên gia bệnh truyền nhiễm.", grade: "A-III", ref: "XI.a.1" },
    ],
    oral: [
      { role: "Uống nối tiếp", text: "Ciprofloxacin, khi có thể.", grade: "A-III", ref: "XI.a.2" },
      { role: ALT, text: "Beta-lactam uống hoặc cotrimoxazol, theo độ nhạy.", grade: "B-III", ref: "XI.a.2" },
    ],
    notes: [{ role: "Sinh ESBL, AmpC, carbapenemase", text: "Tigecyclin, ceftolozan-tazobactam, ceftazidim-avibactam, hoặc phối hợp có meropenem đơn độc hay kèm colistin hoặc fosfomycin; quyết định cùng chuyên gia truyền nhiễm hoặc vi sinh.", ref: "XI bàn luận" }],
  },
  {
    id: "kk", label: "Kingella kingae", pop: "child", dur: "kk",
    iv: [
      { role: PREF, text: "Penicilin hoặc ampicilin.", grade: "A-II", ref: "XI.b.1", al: "std" },
      { role: ALT, text: "Cephalosporin thế hệ 1, 2 hoặc amoxicilin-acid clavulanic.", grade: "A-II", ref: "XI.b.1", al: "std" },
    ],
    notes: [
      { role: "Đề kháng tự nhiên", text: "K. kingae kháng clindamycin và cloxacilin.", ref: "VIII bàn luận" },
      { role: "Dữ liệu liều", text: "Một loạt 62 trẻ được điều trị bằng cefuroxim tĩnh mạch 150 mg/kg/ngày hoặc cefazolin 100 mg/kg/ngày (dữ liệu loạt ca, không phải khuyến cáo liều).", ref: "XI bàn luận" },
    ],
  },
  {
    id: "gnb-c", label: "Trực khuẩn Gram âm khác", pop: "child", dur: "gnb",
    iv: [{ role: "Theo kháng sinh đồ", text: "Chọn kháng sinh theo độ nhạy của chủng.", grade: "A-III", ref: "XI.b.2" }],
    notes: [{ role: "Thời gian", text: "Nên kéo dài vì nhiều trẻ có suy giảm miễn dịch hoặc bệnh nền nặng.", ref: "XI bàn luận" }],
  },
  {
    id: "gc", label: "Lậu cầu (N. gonorrhoeae)", pop: "adult", dur: "gc",
    iv: [
      { role: PREF, text: "Ceftriaxon 1 g mỗi 24 giờ.", grade: "A-III", ref: "XII lậu cầu.1", al: "std" },
      { role: ALT, text: "Cefotaxim 1 g tĩnh mạch mỗi 8 giờ.", grade: "A-III", ref: "XII lậu cầu.1", al: "std" },
    ],
    oral: [{ role: "Uống nối tiếp, sau khi lâm sàng cải thiện", text: "Theo kháng sinh đồ: ciprofloxacin 500 mg mỗi 12 giờ hoặc cefixim 400 mg mỗi 12 giờ.", grade: "B-III", ref: "XII lậu cầu.1" }],
    notes: [
      { role: "Sàng lọc", text: "Các bệnh lây truyền qua đường tình dục khác.", grade: "A-II", ref: "XII lậu cầu.1" },
      { role: "Chưa loại trừ Chlamydia", text: "Doxycyclin 100 mg uống 2 lần/ngày trong 7 ngày (theo CDC).", ref: "XII bàn luận" },
      { role: "Fluoroquinolon", text: "Không dùng theo kinh nghiệm do tỷ lệ lậu cầu kháng quinolon tăng.", ref: "XII bàn luận" },
      { role: "Dẫn lưu", text: "Viêm khớp mủ do lậu cầu hiếm khi cần dẫn lưu phẫu thuật.", ref: "XII bàn luận" },
    ],
  },
  {
    id: "gc-c", label: "Lậu cầu (sơ sinh, vị thành niên)", pop: "child", dur: "gc",
    iv: [
      { role: PREF, text: "Cefotaxim (sơ sinh) hoặc ceftriaxon, trong 7 ngày.", grade: "B-III", ref: "XII lậu cầu.2", al: "std" },
      { role: "Liều", text: "Ceftriaxon 25–50 mg/kg/ngày tĩnh mạch hoặc tiêm bắp, 1 lần/ngày; cefotaxim 25 mg/kg mỗi 12 giờ. Trẻ tăng bilirubin máu: ưu tiên cefotaxim.", ref: "XII bàn luận", al: "std" },
    ],
    notes: [{ role: "Viêm màng não kèm theo", text: "Kéo dài 10–14 ngày. Chuyển uống theo kháng sinh đồ 24–48 giờ sau khi lâm sàng cải thiện rõ.", ref: "XII bàn luận" }],
  },
  {
    id: "candida", label: "Candida spp.", pop: "both", dur: "candida",
    iv: [{ role: "Đã điều trị ngoại khoa", text: "Azol, echinocandin hoặc amphotericin B liposome.", grade: "A-III", ref: "XII Candida.1" }],
    notes: [{ role: "Sơ sinh", text: "Đánh giá lan tràn: chọc dịch não tủy, khám đáy mắt.", grade: "B-II", ref: "XII Candida.2" }],
  },
  {
    id: "tb", label: "Mycobacterium tuberculosis", pop: "both", dur: "tb",
    iv: [{ role: "Chẩn đoán sớm (chưa có áp xe lớn, xương chết)", text: "Phác đồ điều trị lao như lao các vị trí khác.", grade: "B-III", ref: "XII lao.1" }],
    notes: [{ role: "Giám sát", text: "Điều trị dưới sự giám sát của chuyên gia.", grade: "B-III", ref: "XII lao.2" }],
  },
  {
    id: "neg", label: "Cấy dịch khớp âm tính", pop: "both", dur: "neg",
    iv: [
      { role: "Nguyên tắc", text: "Điều trị như phác đồ kinh nghiệm khi nhuộm Gram dịch khớp không thấy vi khuẩn (chọn giai đoạn Kinh nghiệm).", grade: "B-III", ref: "XIII.1" },
      { role: "Đang hoặc mới dùng kháng sinh", text: "Tính đến phổ của kháng sinh đã dùng để điều chỉnh phác đồ.", grade: "B-III", ref: "XIII.2" },
      { role: "Dịch tễ", text: "Đánh giá kỹ để loại trừ vi khuẩn hiếm hoặc khó nuôi cấy.", grade: "B-II", ref: "XIII.3" },
    ],
    notes: [{ role: "Chẩn đoán", text: "Vẫn là giả định; theo dõi để phát hiện bệnh khác, nhất là bệnh khớp viêm.", ref: "XIII bàn luận" }],
  },
];

/* ================= Thoi gian ================= */
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
  if (d === "candida") return [{ role: "Đã điều trị ngoại khoa", text: "6–8 tuần.", grade: "A-III", ref: "XII Candida.1" }];
  if (d === "tb") return [{ role: "Lao khớp", text: "Như lao các vị trí khác; một số chuyên gia khuyên 9–12 tháng.", grade: "B-III", ref: "XII lao.1" }];
  const out: Item[] = [];
  if (pop === "adult") {
    if (adultSite === "large") {
      const all: [Dur, string, string][] = [["sa", "S. aureus", "3–4 tuần."], ["gnb", "Trực khuẩn Gram âm", "3–4 tuần."], ["strep", "Liên cầu", "2–3 tuần."], ["gc", "Lậu cầu", "1–2 tuần."]];
      for (const [k, r, t] of all) if (!d || d === "neg" || d === k) out.push({ role: `Khớp lớn ngoại vi – ${r}`, text: t, grade: "B-III", ref: "VII.10" });
      if (d === "gc") out.push({ role: "Lậu cầu – theo thể bệnh", text: "Hội chứng viêm khớp – viêm da: 1 tuần; viêm khớp mủ: 2 tuần.", ref: "XII bàn luận" });
    }
    if (adultSite === "axial") out.push({ role: "Khớp trục", text: "6 tuần.", grade: "A-III", ref: "VII.10" });
    if (adultSite === "osteo") out.push({ role: "Kèm viêm xương kế cận", text: "Kéo dài hơn khớp đơn thuần (hướng dẫn không nêu số tuần).", grade: "A-III", ref: "VII.10" });
    if (adultSite === "hand") out.push({ role: "Cổ tay, bàn tay sau dẫn lưu ngoại khoa", text: "2 tuần; có thể không áp dụng cho MRSA.", grade: "A-I", ref: "VII.10" });
    if (slow) out.push({ role: "Suy giảm miễn dịch, đáp ứng chậm", text: "Kéo dài hơn.", grade: "B-III", ref: "VII.10" });
    if (d === "neg") out.push({ role: "Cấy âm tính", text: "Một số tác giả cho rằng có thể rút ngắn còn 2 tuần.", ref: "XIII bàn luận" });
  } else {
    if (childSite === "simple") out.push({ role: "Không biến chứng", text: "2–3 tuần.", grade: "A-I", ref: "VII.11" });
    if (childSite === "osteo") out.push({ role: "Kèm viêm xương", text: "3–4 tuần.", grade: "A-I", ref: "VII.11" });
    if (childSite === "axial") out.push({ role: "Khớp trục", text: "Có thể cần 4–6 tuần.", grade: "A-III", ref: "VII.11" });
    if (d === "kk") out.push({ role: "K. kingae", text: "10–14 ngày.", ref: "VII bàn luận" });
    if (agent?.id === "mrsa-c") out.push({ role: "MRSA", text: "Có thể cần 4–6 tuần.", grade: "B-II", ref: "VII.11" });
    if (agent?.id === "gnb-c") out.push({ role: "Salmonella, Enterobacterales, P. aeruginosa", text: "Có thể cần 4–6 tuần.", grade: "B-III", ref: "VII.11" });
    if (infant) out.push({ role: "Sơ sinh, trẻ < 3 tháng", text: "Có thể cần 4–6 tuần.", grade: "B-III", ref: "VII.11" });
    if (slow) out.push({ role: "Trẻ suy giảm miễn dịch", text: "Có thể cần 4–6 tuần.", grade: "B-III", ref: "VII.11" });
    if (d === "neg") out.push({ role: "Cấy âm tính", text: "Một số tác giả cho rằng có thể rút ngắn còn 10 ngày.", ref: "XIII bàn luận" });
  }
  return out;
}

const ROUTE: Record<Pop, Item[]> = {
  adult: [
    { role: "Khởi trị", text: "Đường tĩnh mạch.", grade: "B-III", ref: "VII.8" },
    { role: "Chuyển uống", text: "Sau vài ngày tĩnh mạch (ví dụ 2–7 ngày), khi: không viêm nội tâm mạc, cấy máu âm tính, lâm sàng và xét nghiệm cải thiện, có thuốc uống phù hợp.", grade: "A-II", ref: "VII.9" },
  ],
  child: [
    { role: "Khởi trị", text: "Đường tĩnh mạch.", grade: "B-III", ref: "VII.8" },
    { role: "Chuyển uống", text: "Sau 2–4 ngày tĩnh mạch, khi diễn biến lâm sàng và xét nghiệm thuận lợi.", grade: "A-I", ref: "VII.9" },
  ],
};

const PRINCIPLES: { title: string; items: Item[] }[] = [
  {
    title: "Trước khi dùng kháng sinh",
    items: [
      { role: "Cấy máu", text: "Mọi trường hợp nghi viêm khớp nhiễm khuẩn, trước kháng sinh khi có thể.", grade: "A-II", ref: "IV.1" },
      { role: "Cấy máu dương tính", text: "Với S. aureus, liên cầu nhóm viridans, enterococci: đánh giá viêm nội tâm mạc.", grade: "B-III", ref: "IV.1" },
      { role: "Dịch khớp", text: "Lấy sớm nhất, tốt nhất trước kháng sinh; nhuộm Gram, cấy.", grade: "A-II", ref: "IV.2–3" },
      { role: "Dịch khớp > 2 mL", text: "Cấy thêm vào chai cấy máu tại giường.", grade: "B-II", ref: "IV.3" },
      { role: "Huyết động ổn định", text: "Bắt đầu kháng sinh kinh nghiệm sau khi cấy máu và chọc hút dịch khớp.", grade: "A-II", ref: "VII.5" },
      { role: "Nhiễm khuẩn huyết, sốc nhiễm khuẩn", text: "Lấy máu và dịch khớp cấy trước kháng sinh nếu không chậm quá 45 phút.", grade: "B-III", ref: "VII.6" },
      { role: "Phác đồ đích", text: "Theo tác nhân và kháng sinh đồ; không xác định được tác nhân thì theo tác nhân có khả năng nhất; trao đổi chuyên gia truyền nhiễm hoặc vi sinh.", grade: "A-II", ref: "VII.7" },
      { role: "Nhuộm Gram không thấy vi khuẩn", text: "Luôn có kháng sinh tác dụng trên S. aureus.", grade: "A-II", ref: "VIII.1" },
    ],
  },
  {
    title: "Dẫn lưu khớp",
    items: [
      { role: "Chỉ định", text: "Viêm khớp vi khuẩn ngoại vi (trừ lậu cầu, lao giai đoạn sớm) và viêm khớp do nấm; khớp lớn ngoại vi dẫn lưu càng sớm càng tốt.", grade: "A-II", ref: "VII.2–3" },
      { role: "Người lớn – khớp gối", text: "Nội soi dẫn lưu kèm cắt màng hoạt dịch là lựa chọn đầu; chọc hút kim là lựa chọn khác.", grade: "B-II", ref: "XV.2" },
      { role: "Người lớn – cổ chân, khuỷu, cổ tay", text: "Chọc hút kim hoặc nội soi.", grade: "B-III", ref: "XV.2" },
      { role: "Người lớn – háng, vai", text: "Nội soi hoặc mở khớp.", grade: "B-II", ref: "XV.2" },
      { role: "Thất bại sau chọc hút hoặc nội soi", text: "Phẫu thuật mở.", grade: "B-III", ref: "XV.2" },
      { role: "Trẻ em – không biến chứng, trừ khớp háng", text: "Chọc hút kim.", grade: "B-I", ref: "XV.3" },
      { role: "Trẻ em – háng, gối, cổ chân, vai, khuỷu, cổ tay", text: "Nội soi ưu tiên hơn mở khớp.", grade: "B-II", ref: "XV.3" },
      { role: "Trẻ nhỏ – háng, vai; hoặc thất bại bảo tồn", text: "Mở khớp.", grade: "C-III", ref: "XV.3" },
    ],
  },
  {
    title: "Điều trị bổ trợ",
    items: [
      { role: "Trẻ em – NSAID", text: "Có thể có lợi trong giai đoạn cấp khi còn dấu hiệu viêm.", grade: "A-III", ref: "XIV.1" },
      { role: "Trẻ em – corticoid", text: "Đợt ngắn corticoid tĩnh mạch sớm ở trẻ đã xác định chẩn đoán có thể giúp hồi phục nhanh, rút ngắn nằm viện. PIDS/IDSA 2023 khuyến cáo không dùng – cần hội chẩn.", grade: "B-I", ref: "XIV.2" },
      { role: "Người lớn – corticoid", text: "Không khuyến cáo.", grade: "D-III", ref: "XIV.3" },
    ],
  },
  {
    title: "Phục hồi chức năng",
    items: [
      { role: "Sau dẫn lưu ngoại khoa", text: "Tập vật lý trị liệu.", grade: "B-III", ref: "XVII.1" },
      { role: "Vận động", text: "Vận động khớp sớm, ban đầu thụ động.", grade: "B-III", ref: "XVII.2" },
      { role: "Trẻ viêm khớp háng", text: "Chỉ bó bột dạng háng khi nhiễm khuẩn nặng có nguy cơ trật khớp.", grade: "B-II", ref: "XVII.2" },
      { role: "Khớp háng", text: "Không chịu lực sớm, kể cả chịu lực một phần.", grade: "D-III", ref: "XVII.3" },
      { role: "Khớp gối", text: "Chịu lực một phần sớm khi đã kiểm soát đau.", grade: "B-III", ref: "XVII.4" },
    ],
  },
  {
    title: "Theo dõi",
    items: [
      { role: "Ngoại trú", text: "Tiếp tục kháng sinh uống (hoặc tiêm ngoại trú nếu không uống được) khi diễn biến thuận lợi.", grade: "B-III", ref: "XVIII.1" },
      { role: "Lâm sàng, xét nghiệm", text: "Đau, viêm, chức năng khớp; công thức máu, CRP, tốc độ máu lắng; tác dụng không mong muốn của kháng sinh.", grade: "B-III", ref: "XVIII.2" },
      { role: "Tái khám", text: "Chấn thương chỉnh hình và truyền nhiễm sau ra viện 1–2 tuần, 4–6 tuần, 3 tháng.", grade: "C-III", ref: "XVIII.3" },
      { role: "Theo dõi dài hạn", text: "Ít nhất 1 năm ở người lớn có nguy cơ di chứng và ở trẻ em.", grade: "B-III", ref: "XVIII.3" },
    ],
  },
];

/* ================= Giao dien ================= */
type Source = "seimc" | "pids";

const SEIMC_LEGEND: [string, string][] = [
  ["A · B · C · D", "Sức mạnh khuyến cáo: A mạnh, B vừa, C yếu nên dùng; D khuyến cáo không nên dùng"],
  ["I · II · III", "Chất lượng bằng chứng: I thử nghiệm ngẫu nhiên có đối chứng; II thử nghiệm không ngẫu nhiên, thuần tập, bệnh chứng; III ý kiến chuyên gia, mô tả ca"],
  ["Không nhãn", "Lựa chọn nêu trong bảng thuốc hoặc phần phân tích của hướng dẫn, không xếp mức"],
];
/* Chu dau thuong cho ten nhom vi khuan tieng Viet (giu nguyen ten khoa hoc). */
const lc = (t: string) => (/^(Liên|Phế|Trực|Không)/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

/* Loc theo di ung beta-lactam:
   - co lua chon danh rieng cho di ung -> chi hien lua chon do (va thuoc khong phai beta-lactam);
   - khong co -> an beta-lactam, giu thuoc khong phai beta-lactam, kem ghi chu;
   - chi co beta-lactam -> giu nguyen, canh bao. */
export default function SepticArthritisSeimc2024() {
  const [pop, setPop] = useState<Pop>("adult");
  const [source, setSource] = useState<Source>("seimc");
  const [age, setAge] = useState<ChildAge>("3m2y");
  const [pAge, setPAge] = useState<PidsAge>("6m48m");
  const [stage, setStage] = useState<Stage>("empiric");
  const [ctx, setCtx] = useState("none");
  const [agentId, setAgentId] = useState("mssa");
  const [allergy, setAllergy] = useState<"no" | "yes">("no");
  const [adultSite, setAdultSite] = useState<AdultSite>("large");
  const [childSite, setChildSite] = useState<ChildSite>("simple");
  const [slow, setSlow] = useState(false);

  const pids = pop === "child" && source === "pids";
  const contexts = useMemo(() => CONTEXTS.filter((c) => c.pop === "both" || c.pop === pop), [pop]);
  const agents = useMemo(() => AGENTS.filter((a) => a.pop === "both" || a.pop === pop), [pop]);
  const al = allergy === "yes";

  function pickSource(s: Source) {
    if (s === "pids") { setPop("child"); setSlow(false); }
    changeSource(s);
  }
  function changePop(p: Pop) {
    setPop(p);
    setSource("seimc");
    setCtx(p === "adult" ? "none" : "age");
    setAgentId(p === "adult" ? "mssa" : "mssa-c");
    setSlow(false);
  }
  function changeSource(s: Source) {
    setSource(s);
    setCtx(s === "pids" ? "lowmrsa" : pop === "adult" ? "none" : "age");
    setAgentId(s === "pids" ? "mssa" : pop === "adult" ? "mssa" : "mssa-c");
  }

  /* ---- Ket qua ---- */
  let start: Item[] = [];
  let oral: Item[] = [];
  let notes: Item[] = [];
  let durations: Item[] = [];
  let route: Item[] = [];
  let timing: Item[] = [];
  let principle: Item[] = [];
  let tips: string[] = [];
  let covers = "";
  let dx = "";

  if (pids) {
    route = PIDS_ROUTE;
    if (stage === "empiric") {
      const c = PIDS_CONTEXTS.find((x) => x.id === ctx) ?? PIDS_CONTEXTS[0];
      timing = PIDS_TIMING;
      start = [...c.items, ...(pAge === "6m48m" ? [PIDS_KINGELLA] : [])];
      covers = pAge === "6m48m" ? "S. aureus (kể cả MRSA khi tỷ lệ cao) và K. kingae" : "S. aureus (kể cả MRSA khi tỷ lệ cao)";
      dx = `Viêm khớp nhiễm khuẩn cấp, chưa có kết quả cấy – ${c.label.charAt(0).toLowerCase() + c.label.slice(1)}`;
      durations = pidsDuration("std", childSite === "osteo");
    } else {
      const a = PIDS_AGENTS.find((x) => x.id === agentId) ?? PIDS_AGENTS[0];
      principle = [PIDS_DEFINITIVE_PRINCIPLE];
      start = a.iv;
      oral = a.oral;
      notes = a.notes ?? [];
      dx = `Viêm khớp nhiễm khuẩn cấp do ${lc(a.label)}`;
      durations = pidsDuration(a.dur, childSite === "osteo");
    }
  } else {
    route = ROUTE[pop];
    const agent = stage === "directed" ? agents.find((a) => a.id === agentId) ?? agents[0] : null;
    const context = stage === "empiric" ? contexts.find((c) => c.id === ctx) ?? null : null;
    if (stage === "empiric") {
      if (context) { start = context.items; covers = context.agents; tips = context.notes ?? []; }
      else { start = CHILD_EMPIRIC[age]; covers = "S. aureus (luôn bao phủ cho đến khi loại trừ); trẻ nhỏ thêm K. kingae"; }
      dx = `Viêm khớp nhiễm khuẩn, chưa có kết quả cấy – ${context ? context.label.charAt(0).toLowerCase() + context.label.slice(1) : "không có yếu tố nguy cơ đặc biệt"}`;
      if (pop === "adult" && ctx === "none") tips = ["Phác đồ dành cho nhuộm Gram dịch khớp không thấy vi khuẩn; thấy vi khuẩn thì chọn theo hình thái trên tiêu bản. Nhiễm khuẩn bệnh viện, sau phẫu thuật hoặc chọc khớp, gai thực vật, vết đâm qua giày, vết cắn, tiếp xúc trang trại, nghi lây qua đường tình dục: chọn đúng mục Bối cảnh."];
    } else if (agent) {
      start = agent.iv; oral = agent.oral ?? []; notes = agent.notes ?? [];
      dx = `Viêm khớp nhiễm khuẩn do ${lc(agent.label)}`;
    }
    durations = durationItems(pop, agent, adultSite, childSite, slow, pop === "child" && age === "lt3m");
  }

  const s = byAllergy(start, al);
  const o = byAllergy(oral, al);
  const who = [pop === "adult" ? "Người lớn" : `Trẻ ${pids ? PIDS_AGES.find((x) => x.id === pAge)?.label : CHILD_AGES.find((x) => x.id === age)?.label}`, al ? "dị ứng beta-lactam" : null].filter(Boolean).join(", ");
  const srcName = pids ? "PIDS/IDSA 2023" : "GEIO–SEIMC/SEIP/SECOT 2024";

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo chẩn đoán</p>
        <h3>Viêm khớp nhiễm khuẩn khớp tự nhiên</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Hướng dẫn</li><li>Đối tượng</li><li>Giai đoạn</li><li>Bối cảnh hoặc tác nhân</li><li>Dị ứng beta-lactam</li><li>Kết quả: thuốc, liều, chuyển uống, thời gian</li>
        </ol>
      </header>

      <div className="sa24-form">
        <Row label="Hướng dẫn">
          <Seg label="Hướng dẫn" value={pids ? "pids" : "seimc"} onChange={pickSource} options={[{ id: "seimc", label: "GEIO–SEIMC 2024 · người lớn và trẻ em" }, { id: "pids", label: "IDSA/PIDS 2023 · trẻ 1 tháng – 17 tuổi" }] as const} />
        </Row>
        <Row label="Đối tượng">
          {!pids && <Seg label="Đối tượng" value={pop} onChange={changePop} options={[{ id: "adult", label: "Người lớn" }, { id: "child", label: "Trẻ em" }] as const} />}
          {pop === "child" && (pids
            ? <Seg label="Nhóm tuổi" value={pAge} onChange={setPAge} options={PIDS_AGES} />
            : <Seg label="Nhóm tuổi" value={age} onChange={setAge} options={CHILD_AGES} />)}
        </Row>
        <Row label="Giai đoạn">
          <Seg label="Giai đoạn" value={stage} onChange={setStage} options={[{ id: "empiric", label: "Kinh nghiệm – chưa có kết quả cấy" }, { id: "directed", label: "Đích – đã có tác nhân" }] as const} />
        </Row>
        {stage === "empiric" ? (
          <Row label="Bối cảnh">
            {pids ? (
              <select value={ctx} onChange={(e) => setCtx(e.target.value)} aria-label="Bối cảnh">
                {PIDS_CONTEXTS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            ) : (
              <select value={contexts.some((c) => c.id === ctx) ? ctx : "age"} onChange={(e) => setCtx(e.target.value)} aria-label="Bối cảnh dịch tễ">
                {pop === "child" && <option value="age">Không có yếu tố nguy cơ tác nhân đặc biệt hoặc vi khuẩn kháng thuốc</option>}
                {contexts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            )}
          </Row>
        ) : (
          <Row label="Tác nhân">
            <select value={agentId} onChange={(e) => setAgentId(e.target.value)} aria-label="Tác nhân">
              {(pids ? PIDS_AGENTS : agents).map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </Row>
        )}
        <Row label="Dị ứng beta-lactam">
          <Seg label="Dị ứng beta-lactam" value={allergy} onChange={setAllergy} options={[{ id: "no", label: "Không" }, { id: "yes", label: "Có" }] as const} />
        </Row>
        <Row label="Vị trí khớp">
          {pop === "adult"
            ? <Seg label="Vị trí khớp" value={adultSite} onChange={setAdultSite} options={ADULT_SITES} />
            : <Seg label="Biến chứng" value={childSite} onChange={setChildSite} options={pids ? CHILD_SITES.filter((x) => x.id !== "axial") : CHILD_SITES} />}
          {!pids && <label className="sa24-chk"><input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} /> {pop === "adult" ? "Suy giảm miễn dịch hoặc đáp ứng chậm với điều trị ban đầu" : "Trẻ suy giảm miễn dịch"}</label>}
        </Row>
      </div>

      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {dx}</p>
          <p><b>Người bệnh</b> {who}</p>
          {covers && <p><b>Cần bao phủ</b> {covers}</p>}
          <p><b>Hướng dẫn</b> {srcName}</p>
        </div>

        <Legend rows={pids ? GRADE_LEGEND : SEIMC_LEGEND} />

        {timing.length > 0 && (<><h4>Thời điểm khởi trị</h4><Rx items={timing} /></>)}

        <h4>{stage === "empiric" ? "Phác đồ kinh nghiệm" : "Phác đồ đích – đường tĩnh mạch"}{al && s.state === "explicit" ? " · dị ứng beta-lactam" : ""}</h4>
        {principle.length > 0 && <Rx items={principle} />}
        {s.state === "filtered" && <p className="sa24-warn">Đã ẩn thuốc beta-lactam; còn lại các lựa chọn không phải beta-lactam của hướng dẫn trong nhánh này.</p>}
        {s.state === "only-bl" && <p className="sa24-warn">Hướng dẫn chưa nêu thuốc thay thế cho người dị ứng beta-lactam ở tình huống này; phác đồ dưới đây có beta-lactam – đánh giá loại, mức độ dị ứng và hội chẩn trước khi dùng.</p>}
        <Rx items={s.shown} />
        {tips.map((t) => <p key={t} className="sa24-tip">{t}</p>)}

        <h4>Chuyển đường uống</h4>
        <Rx items={route} />
        {o.shown.length > 0 && (<><h4>Thuốc uống nối tiếp</h4><Rx items={o.shown} /></>)}
        {o.state === "filtered" && <p className="sa24-tip">Đã ẩn thuốc uống beta-lactam.</p>}

        <h4>Thời gian điều trị</h4>
        <Rx items={durations} />
        {pop === "adult" && <p className="sa24-tip">Áp dụng cho người lớn không có viêm nội tâm mạc.</p>}

        {notes.length > 0 && (<><h4>Lưu ý</h4><Rx items={notes} /></>)}
        {!pids && <p className="sa24-tip">Hướng dẫn GEIO–SEIMC không nêu liều cho phần lớn thuốc – tra tại module Hiệu chỉnh liều.</p>}
      </section>

      {pids && (
        <details className="sa24-more">
          <summary>Liều kháng sinh ở trẻ em (PIDS/IDSA 2023)</summary>
          <table className="sa24-rx has-dose sa24-dosetab">
            <tbody>{PIDS_DOSE_TABLE.map((d) => (<tr key={d.drug + d.route}><th scope="row">{d.drug}</th><td>{d.route}</td><td className="sa24-dose">{d.dose}</td></tr>))}</tbody>
          </table>
          {PIDS_DOSE_NOTES.map((n) => <p key={n} className="sa24-tip">{n}</p>)}
        </details>
      )}
      <details className="sa24-more">
        <summary>Nguyên tắc chung ({srcName})</summary>
        {(pids ? PIDS_PRINCIPLES : PRINCIPLES).map((p) => (<div key={p.title} className="sa24-pblock"><h5>{p.title}</h5><Rx items={p.items} /></div>))}
      </details>

      <p className="sa24-src">Nguồn: {pids ? "PIDS/IDSA 2023 – Hướng dẫn chẩn đoán và điều trị viêm khớp nhiễm khuẩn cấp ở trẻ em (J Pediatric Infect Dis Soc 2024;13:1–59)" : SRC}. Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt.</p>

      <RxToolStyle />
    </article>
  );
}
