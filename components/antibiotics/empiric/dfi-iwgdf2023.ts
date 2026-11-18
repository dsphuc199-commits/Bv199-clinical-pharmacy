/*
  Nhiễm trùng bàn chân đái tháo đường – dữ liệu công cụ chọn kháng sinh theo
  IWGDF/IDSA 2023 (Senneville É và cs. Diabetes Metab Res Rev 2024;e3687; đồng xuất bản Clin Infect Dis).
  Đọc từ PDF người dùng cung cấp (16/11/2026): Bảng 1 (phân độ), Bảng 2 (nhập viện), Bảng 4 (phác đồ
  kinh nghiệm, trích Lipsky 2012), Bảng 5 (thời gian), khuyến cáo 1–25 và phần Rationale.
  Mức GRADE giữ nguyên: S/C = mạnh/có điều kiện; H/M/L = cao/TB/thấp; GPS = thực hành tốt nhất.
  Hướng dẫn KHÔNG nêu liều: "usual recommended doses for serious infections"; viêm xương: liều ở mức cao
  của khoảng khuyến cáo; tham khảo hướng dẫn quốc gia -> không điền liều.
  ref = vị trí trong văn bản (không hiển thị).
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export type DfiGrade = "1" | "2" | "3" | "4";
export type MildFactor = "allergy" | "recent" | "mrsaHigh";
export type ModFactor = "recent" | "macerated" | "ischemic" | "mrsaRisk" | "esbl";
export type BoneStatus = "resected" | "debrided" | "margin" | "none";
export type DfiBlock = { title: string; lead?: string; items: RxItem[] };
export type DfiIn = {
  grade: DfiGrade;
  osteo: boolean;
  mild: MildFactor[];
  mod: ModFactor[];
  pseudoPrev: boolean;
  pad: boolean;
  debrided: boolean;
  bone: BoneStatus;
};
export type DfiOut = { headline: string; blocks: DfiBlock[]; avoid: RxItem[]; notes: string[] };

const r = (role: string, text: string, grade: string | undefined, ref: string): RxItem => ({ role, text, grade, ref });
const T4 = "Bảng 4";

export const GRADE_OPTS: { id: DfiGrade; label: string; criteria: string }[] = [
  { id: "1", label: "1 – Không nhiễm trùng", criteria: "Không có triệu chứng, dấu hiệu nhiễm trùng tại chỗ hay toàn thân." },
  { id: "2", label: "2 – Nhẹ", criteria: "≥ 2 dấu hiệu: sưng hoặc chai cứng tại chỗ; ban đỏ > 0,5 cm đến < 2 cm quanh vết thương; đau hoặc ấn đau tại chỗ; nóng tại chỗ; chảy mủ. Không có nguyên nhân viêm khác (chấn thương, gút, Charcot cấp, gãy xương, huyết khối, ứ trệ tĩnh mạch)." },
  { id: "3", label: "3 – Vừa", criteria: "Không có biểu hiện toàn thân và: ban đỏ lan ≥ 2 cm từ bờ vết thương, và/hoặc tổn thương mô sâu hơn da và mô dưới da (gân, cơ, khớp, xương)." },
  { id: "4", label: "4 – Nặng", criteria: "Nhiễm trùng bàn chân kèm ≥ 2 tiêu chuẩn SIRS: nhiệt độ > 38 °C hoặc < 36 °C; tần số tim > 90 lần/phút; tần số thở > 20 lần/phút hoặc PaCO₂ < 32 mmHg; bạch cầu > 12.000/mm³ hoặc < 4.000/mm³ hoặc > 10% bạch cầu non." },
];

export const MILD_FACTORS: { id: MildFactor; label: string }[] = [
  { id: "allergy", label: "Dị ứng hoặc không dung nạp beta-lactam" },
  { id: "recent", label: "Dùng kháng sinh gần đây" },
  { id: "mrsaHigh", label: "Nguy cơ cao MRSA (tiền sử nhiễm hoặc mang MRSA)" },
];
export const MOD_FACTORS: { id: ModFactor; label: string }[] = [
  { id: "recent", label: "Dùng kháng sinh gần đây" },
  { id: "macerated", label: "Loét ngấm nước (macerated) hoặc khí hậu nóng" },
  { id: "ischemic", label: "Chi thiếu máu, hoại tử hoặc sinh hơi" },
  { id: "mrsaRisk", label: "Yếu tố nguy cơ MRSA" },
  { id: "esbl", label: "Yếu tố nguy cơ trực khuẩn Gram âm kháng thuốc (ESBL)" },
];
export const MRSA_RISK = "Nằm viện kéo dài, nằm hồi sức tích cực, nhập viện gần đây, dùng kháng sinh gần đây, thủ thuật xâm lấn, nhiễm HIV, ở viện dưỡng lão, vết thương hở, lọc máu, ra viện còn catheter tĩnh mạch trung tâm dài ngày.";

export const BONE_OPTS: { id: BoneStatus; label: string; dur: string }[] = [
  { id: "resected", label: "Đã cắt bỏ (hết xương nhiễm)", dur: "2–5 ngày" },
  { id: "debrided", label: "Đã cắt lọc (nhiễm trùng mô mềm)", dur: "1–2 tuần" },
  { id: "margin", label: "Bờ xương cấy hoặc mô bệnh học dương tính sau cắt xương", dur: "3 tuần" },
  { id: "none", label: "Không phẫu thuật hoặc còn xương chết", dur: "6 tuần" },
];

/* ---------- Bảng 4: phác đồ kinh nghiệm ---------- */
const MILD_RX: Record<"base" | MildFactor, { title: string; bugs: string; items: RxItem[] }> = {
  base: { title: "Nhẹ – không có yếu tố phức tạp", bugs: "Cầu khuẩn Gram dương", items: [
    r("Lựa chọn", "Penicilin bán tổng hợp kháng penicilinase (cloxacilin)", undefined, T4),
    r("Lựa chọn", "Cephalosporin thế hệ 1 (cefalexin)", undefined, T4),
  ] },
  allergy: { title: "Nhẹ – dị ứng hoặc không dung nạp beta-lactam", bugs: "Cầu khuẩn Gram dương", items: [
    r("Lựa chọn", "Clindamycin; fluoroquinolon (levofloxacin, moxifloxacin); trimethoprim-sulfamethoxazol; doxycyclin", undefined, T4),
  ] },
  recent: { title: "Nhẹ – dùng kháng sinh gần đây", bugs: "Cầu khuẩn Gram dương + trực khuẩn Gram âm", items: [
    r("Lựa chọn", "Beta-lactam/ức chế beta-lactamase nhóm 1 (amoxicilin-acid clavulanic, ampicilin-sulbactam)", undefined, T4),
    r("Lựa chọn", "Fluoroquinolon (levofloxacin, moxifloxacin); trimethoprim-sulfamethoxazol", undefined, T4),
  ] },
  mrsaHigh: { title: "Nhẹ – nguy cơ cao MRSA", bugs: "MRSA", items: [
    r("Lựa chọn", "Linezolid; trimethoprim-sulfamethoxazol; clindamycin; doxycyclin; fluoroquinolon (levofloxacin, moxifloxacin)", undefined, T4),
  ] },
};

const MOD_RX: Record<"base" | ModFactor, { title: string; bugs: string; items: RxItem[] }> = {
  base: { title: "Vừa/nặng – không có yếu tố phức tạp", bugs: "Cầu khuẩn Gram dương ± trực khuẩn Gram âm", items: [
    r("Lựa chọn", "Beta-lactam/ức chế beta-lactamase nhóm 1 (amoxicilin-acid clavulanic, ampicilin-sulbactam)", undefined, T4),
    r("Lựa chọn", "Cephalosporin thế hệ 2, 3 (cefuroxim, cefotaxim, ceftriaxon)", undefined, T4),
  ] },
  recent: { title: "Vừa/nặng – dùng kháng sinh gần đây", bugs: "Cầu khuẩn Gram dương ± trực khuẩn Gram âm", items: [
    r("Lựa chọn", "Beta-lactam/ức chế beta-lactamase nhóm 2 (ticarcilin-acid clavulanic, piperacilin-tazobactam)", undefined, T4),
    r("Lựa chọn", "Cephalosporin thế hệ 2, 3 (cefuroxim, cefotaxim, ceftriaxon)", undefined, T4),
    r("Lựa chọn", "Carbapenem nhóm 1 (ertapenem) – tùy kháng sinh đã dùng trước; nên hỏi ý kiến chuyên gia", undefined, T4),
  ] },
  macerated: { title: "Vừa/nặng – loét ngấm nước hoặc khí hậu nóng", bugs: "Trực khuẩn Gram âm, kể cả Pseudomonas", items: [
    r("Lựa chọn", "Beta-lactam/ức chế beta-lactamase nhóm 2 (ticarcilin-acid clavulanic, piperacilin-tazobactam)", undefined, T4),
    r("Lựa chọn", "Penicilin bán tổng hợp kháng penicilinase (cloxacilin) + ceftazidim hoặc ciprofloxacin", undefined, T4),
    r("Lựa chọn", "Carbapenem nhóm 2 (meropenem, imipenem)", undefined, T4),
  ] },
  ischemic: { title: "Vừa/nặng – chi thiếu máu, hoại tử, sinh hơi", bugs: "Cầu khuẩn Gram dương ± trực khuẩn Gram âm ± vi khuẩn kỵ khí bắt buộc", items: [
    r("Lựa chọn", "Beta-lactam/ức chế beta-lactamase nhóm 1 (amoxicilin-acid clavulanic, ampicilin-sulbactam) hoặc nhóm 2 (ticarcilin-acid clavulanic, piperacilin-tazobactam)", undefined, T4),
    r("Lựa chọn", "Carbapenem nhóm 1 (ertapenem) hoặc nhóm 2 (meropenem, imipenem)", undefined, T4),
    r("Lựa chọn", "Cephalosporin thế hệ 2 (cefuroxim) hoặc 3 (cefotaxim, ceftriaxon) + clindamycin hoặc metronidazol", undefined, T4),
  ] },
  mrsaRisk: { title: "Vừa/nặng – yếu tố nguy cơ MRSA", bugs: "MRSA", items: [
    r("Thêm vào hoặc thay thế", "Glycopeptid (vancomycin, teicoplanin); linezolid; daptomycin; acid fusidic; trimethoprim-sulfamethoxazol; doxycyclin", undefined, T4),
  ] },
  esbl: { title: "Vừa/nặng – nguy cơ trực khuẩn Gram âm kháng thuốc", bugs: "Vi khuẩn sinh ESBL", items: [
    r("Lựa chọn", "Carbapenem (ertapenem, meropenem, imipenem); fluoroquinolon (ciprofloxacin); aminoglycosid (amikacin); colistin", undefined, T4),
  ] },
};

const rxBlock = (x: { title: string; bugs: string; items: RxItem[] }): DfiBlock => ({ title: x.title, lead: `Tác nhân thường gặp: ${x.bugs}.`, items: x.items });

export function dfiPlan(i: DfiIn): DfiOut {
  const blocks: DfiBlock[] = [];
  const notes: string[] = [];
  const avoid: RxItem[] = [
    r("Loét không nhiễm trùng", "Không dùng kháng sinh toàn thân hay tại chỗ để phòng nhiễm trùng hoặc giúp lành loét.", "GPS", "Rec 11"),
    r("Kháng sinh tại chỗ", "Không dùng miếng xốp, kem, xi măng kháng sinh kèm kháng sinh toàn thân (mô mềm và viêm xương).", "C-L", "Rec 24"),
    r("Điều trị bổ trợ", "Không dùng G-CSF, sát khuẩn tại chỗ, chế phẩm bạc, mật ong, liệu pháp phage, hút áp lực âm; không dùng oxy cao áp hay oxy tại chỗ chỉ để điều trị nhiễm trùng.", "C-L", "Rec 23, 25"),
    r("Tigecyclin", "Không dùng (kém hơn ertapenem trong thử nghiệm).", undefined, "Rec 12 rationale"),
  ];

  if (i.grade === "1") {
    return {
      headline: "Không dùng kháng sinh",
      blocks: [{ title: "Xử trí", items: [r("Kháng sinh", "Loét không có nhiễm trùng lâm sàng: không dùng kháng sinh toàn thân hay tại chỗ.", "GPS", "Rec 11")] }],
      avoid: avoid.slice(1),
      notes: ["Chẩn đoán nhiễm trùng dựa trên lâm sàng (dấu hiệu viêm tại chỗ hoặc toàn thân); chỉ làm CRP, máu lắng, procalcitonin khi khám lâm sàng không rõ ràng (Thực hành tốt nhất)."],
    };
  }

  const mildCase = i.grade === "2";
  /* Phác đồ kinh nghiệm */
  if (mildCase) {
    const keys = i.mild.length ? i.mild : (["base"] as const);
    keys.forEach((k) => blocks.push(rxBlock(MILD_RX[k])));
    blocks[0].lead = (blocks[0].lead ?? "") + " Đường uống.";
  } else {
    const keys = i.mod.length ? i.mod : (["base"] as const);
    keys.forEach((k) => blocks.push(rxBlock(MOD_RX[k])));
    if (i.grade === "4") blocks[0].lead = (blocks[0].lead ?? "") + " Nhiễm trùng nặng: không dùng đường uống, trừ khi chuyển tiếp sau tiêm.";
  }
  blocks.unshift({
    title: "Nguyên tắc chọn thuốc",
    lead: "Bảng 4 là đề xuất kinh nghiệm; nhiều thuốc trong một dòng → chỉ chọn một, trừ khi ghi rõ phối hợp. Chỉnh thuốc hoặc liều khi suy thận, suy gan, béo phì.",
    items: [
      r("Liều", "Liều thông thường cho nhiễm trùng nặng; viêm xương: liều ở mức cao của khoảng khuyến cáo. Liều cụ thể theo hướng dẫn quốc gia (tab Việt Nam).", undefined, "Table 4 foot c; Rec 12, 16 rationale"),
      r("Chọn thuốc", "Theo tác nhân nghi ngờ hoặc đã xác định và độ nhạy, mức độ nặng, bằng chứng hiệu quả, nguy cơ tác dụng phụ và tổn hại hệ vi khuẩn, tương tác, khả năng sẵn có, chi phí.", "GPS", "Rec 13"),
      r("Phác đồ", "Dùng phác đồ toàn thân đã chứng minh hiệu quả trong thử nghiệm ngẫu nhiên, ở liều chuẩn.", "S-H", "Rec 12a"),
      r("Xuống thang", "Khi có kết quả cấy: chuyển sang kháng sinh đích, phổ hẹp nhất, ưu tiên đường uống.", undefined, "Rec 12 rationale"),
    ],
  });

  if (!mildCase) {
    blocks.push({
      title: "Pseudomonas aeruginosa",
      items: [
        r(i.pseudoPrev ? "Nhắm Pseudomonas" : "Không nhắm thường quy", i.pseudoPrev
          ? "Đã phân lập P. aeruginosa từ vị trí nhiễm trong vài tuần trước, nhiễm trùng vừa/nặng, sống ở châu Á hoặc Bắc Phi: điều trị kinh nghiệm có tác dụng trên P. aeruginosa (xem dòng loét ngấm nước/khí hậu nóng)."
          : "Vùng ôn đới: không nhắm P. aeruginosa theo kinh nghiệm. Ở châu Á, Bắc Phi: nhắm khi đã phân lập P. aeruginosa từ vị trí nhiễm trong vài tuần trước.", "GPS", "Rec 15"),
      ],
    });
  }
  if (i.mod.includes("mrsaRisk") && !mildCase) notes.push(`Yếu tố nguy cơ MRSA: ${MRSA_RISK}`);
  if (mildCase && i.mild.length === 0) notes.push("Chỉ nhắm cầu khuẩn Gram dương hiếu khí (liên cầu tan huyết beta, S. aureus) khi nhiễm trùng nhẹ, chưa dùng kháng sinh gần đây và sống ở Bắc Mỹ hoặc Tây Âu (Thực hành tốt nhất).");

  /* Thời gian */
  const dur: RxItem[] = [];
  if (mildCase) dur.push(r("Da – mô mềm, nhẹ", "Đường uống: 1–2 tuần.", "S-H", "Table 5; Rec 12b"));
  else {
    dur.push(r("Da – mô mềm, vừa/nặng", "Uống hoặc tiêm tĩnh mạch ban đầu: 2–4 tuần.", undefined, "Table 5"));
    if (i.debrided) dur.push(r("Sau cắt lọc phẫu thuật", "10 ngày.", "C-L", "Table 5 foot a; Rec 12 rationale"));
  }
  dur.push(r("Kéo dài", `Cải thiện nhưng lan rộng, khỏi chậm hơn dự kiến${i.pad ? ", hoặc có bệnh động mạch ngoại biên nặng" : " hoặc bệnh động mạch ngoại biên nặng"}: có thể tới 3–4 tuần.`, "C-L", "Rec 12c"));
  dur.push(r("Chưa khỏi sau 4 tuần", "Đánh giá lại; cân nhắc thêm chẩn đoán hoặc điều trị khác.", "S-L", "Rec 12d"));
  if (i.osteo) {
    const b = BONE_OPTS.find((x) => x.id === i.bone)!;
    dur.push(r(`Xương/khớp – ${b.label.toLowerCase()}`, `Uống hoặc tiêm tĩnh mạch ban đầu: ${b.dur}.`, i.bone === "margin" || i.bone === "none" ? "C-L" : undefined, "Table 5; Rec 16"));
  }
  blocks.push({ title: "Thời gian điều trị", items: dur });

  /* Viêm xương */
  if (i.osteo) {
    blocks.push({
      title: "Viêm xương (O)",
      items: [
        r("Chẩn đoán ban đầu", "Phối hợp thăm dò chạm xương, X-quang thường, máu lắng hoặc CRP hoặc procalcitonin.", "C-L", "Rec 7"),
        r("Còn nghi ngờ", "Chụp MRI.", "S-M", "Rec 8"),
        r("Thay thế MRI", "PET, xạ hình bạch cầu đánh dấu hoặc SPECT.", "C-L", "Rec 9"),
        r("Cấy", "Lấy mẫu xương (trong mổ hoặc qua da) thay vì mô mềm.", "C-M", "Rec 10"),
        r("Phẫu thuật", "Cân nhắc cắt bỏ xương nhiễm kèm kháng sinh toàn thân.", "C-L", "Rec 21"),
        r("Không phẫu thuật", "Cân nhắc chỉ dùng kháng sinh khi: viêm xương bàn chân trước, không cần rạch dẫn lưu ngay, không có bệnh động mạch ngoại biên, không lộ xương.", "C-L", "Rec 22"),
        r("Theo dõi", "Đánh giá lui bệnh tối thiểu 6 tháng sau khi ngừng kháng sinh.", "GPS", "Rec 17"),
      ],
    });
    notes.push("Rifampicin: không đủ dữ liệu để khuyến cáo trong viêm xương bàn chân đái tháo đường.");
  }

  /* Nhập viện, cấy, phẫu thuật */
  const care: RxItem[] = [
    r("Cấy", "Lấy mẫu mô vô khuẩn (nạo hoặc sinh thiết) từ vết thương sau làm sạch, cắt lọc, thay vì quệt bề mặt.", "C-M", "Rec 5"),
    r("Kỹ thuật vi sinh", "Dùng nuôi cấy thường quy, không dùng sinh học phân tử làm xét nghiệm đầu tay.", "S-M", "Rec 6"),
  ];
  if (i.grade === "4" || (i.grade === "3" && i.pad)) care.unshift(r("Nhập viện", i.grade === "4" ? "Cân nhắc nhập viện mọi nhiễm trùng nặng." : "Nhiễm trùng vừa kèm bệnh lý quan trọng (bệnh động mạch ngoại biên): cân nhắc nhập viện.", "C-L", "Rec 2"));
  if (!mildCase) {
    care.push(r("Hội chẩn ngoại khẩn", "Nhiễm trùng nặng, hoặc vừa kèm hoại thư rộng, nhiễm trùng hoại tử, dấu hiệu áp xe sâu dưới cân, hội chứng chèn ép khoang, thiếu máu chi nặng.", "GPS", "Rec 18"));
    care.push(r("Phẫu thuật sớm", "Cân nhắc phẫu thuật trong 24–48 giờ kèm kháng sinh để loại bỏ mô nhiễm và hoại tử.", "C-L", "Rec 19"));
  }
  if (i.pad) care.push(r("Bệnh động mạch ngoại biên", "Hội chẩn khẩn ngoại khoa và mạch máu để quyết định chỉ định, thời điểm dẫn lưu và/hoặc tái thông mạch.", "GPS", "Rec 20"));
  blocks.push({ title: "Nhập viện, cấy, phẫu thuật", items: care });

  avoid.push(r("Thuốc mới", "Beta-lactam/ức chế beta-lactamase mới, dalbavancin, oritavancin: chưa đủ dữ liệu để khuyến cáo.", undefined, "Rec 12 rationale"));

  const rxBlocks = blocks.filter((b) => b.title.startsWith(mildCase ? "Nhẹ" : "Vừa"));
  const head = rxBlocks.length > 1
    ? `Theo từng yếu tố (${rxBlocks.length} nhóm) – chọn phác đồ bao phủ đủ các yếu tố bên dưới`
    : rxBlocks[0].items.map((x) => x.text.replace(/ – .*$/, "")).join(" hoặc ");
  /* Phac do len truoc; nguyen tac chon thuoc dat ngay truoc thoi gian dieu tri. */
  const pi = blocks.findIndex((b) => b.title === "Nguyên tắc chọn thuốc");
  const [pb] = blocks.splice(pi, 1);
  blocks.splice(blocks.findIndex((b) => b.title === "Thời gian điều trị"), 0, { ...pb, title: "Liều và nguyên tắc chọn thuốc" });
  return { headline: head, blocks, avoid, notes };
}
