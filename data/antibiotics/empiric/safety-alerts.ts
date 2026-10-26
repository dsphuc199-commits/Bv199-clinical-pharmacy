/*
  FILE: data/antibiotics/empiric/safety-alerts.ts

  CANH BAO AN TOAN HIEN THI NGAY TREN THE PHAC DO (Buoc 4D.2).
  - Khong sua nguyen van nguon BYT; canh bao la lop rieng, gan theo regimenId.
  - Khong de xuat lieu thay the chua xac minh.
  - "critical": nguy co cao, hien thi noi bat; "high": can luu y truoc khi dung.
  Nguon doc ngay 25/10/2026 (xem dose-conflicts.ts, international.ts).
*/

export type AlertLevel = "critical" | "high";

export type SafetyAlert = {
  id: string;
  level: AlertLevel;
  regimenIds: string[];
  title: string;
  text: string;
  /* Danh sach kiem tra (neu co) */
  checklist?: string[];
  sources: string[];
  /* Buoc 4D.4 – Safety Gate: chan de xuat tu dong trong engine. Phuong an van hien thi
     tren the (kem nhan khoa) nhung engine KHONG dua vao nhom de xuat. */
  autoRecommend?: "block";
  /* Chi chan cho nhom doi tuong nay (vd. lieu co dinh nguoi lon khong dung cho tre em). */
  blockFor?: ("child" | "adult")[];
  /* Ly do khoa (hien o danh sach bi loai cua bo chon) */
  blockReason?: string;
};

/* Phac do viem mang nao so sinh (QĐ 708 Bang II.19, QĐ 5642 tr. 19). */
export const NEONATAL_MENINGITIS_REGIMENS = ["r-men-neo-first", "r-men-neo-alt", "r-vmn42-neo-first", "r-vmn42-neo-alt"];
const MEN_CHILD = ["r-men-1-3m-first", "r-men-1-3m-alt", "r-men-3m-18y-first", "r-men-3m-18y-alt", "r-vmn42-1to3m-first", "r-vmn42-1to3m-alt", "r-vmn42-3m18y-first", "r-vmn42-3m18y-alt"];
const MEN_ADULT_5642 = ["r-vmn42-18to50-first", "r-vmn42-18to50-alt", "r-vmn42-over50-first", "r-vmn42-over50-alt", "r-vmn42-immuno-first", "r-vmn42-immuno-alt", "r-vmn42-trauma-first", "r-vmn42-trauma-alt"];

const WHO_MAX =
  "Liều tối đa theo WHO 2026 (sổ tay thực hành, Bảng 11, tr. in 35–37): ceftriaxon 4 g/ngày (trẻ em tối đa 2 g mỗi 12 giờ); cefotaxim 12 g/ngày; ampicilin/amoxicilin 12 g/ngày; vancomycin 4 g/ngày (không theo dõi nồng độ: ≤ 750 mg/liều ở trẻ em, ≤ 3 g/ngày ở người lớn). Ceftazidim, amikacin, gentamicin: WHO không ghi liều tối đa – CHƯA XÁC MINH.";

export const SAFETY_ALERTS: SafetyAlert[] = [
  /* ---------- Colistin ---------- */
  {
    id: "colistin-6miu-q8h",
    level: "critical",
    regimenIds: ["r-fn-add-colistin"],
    title: "Colistin 6 MIU mỗi 8 giờ – nguy cơ quá liều",
    text: "Nguyên văn QĐ 708 (tr. 254): 6.000.000 đơn vị (≈ 200 mg colistin base) mỗi 8 giờ = 18 MIU/ngày. Mức này vượt tổng liều tối đa 12 MIU/24 giờ của Dược thư quốc gia 2023 (tr. in 514–518); nguồn không ghi liều nạp và không ghi chỉnh liều theo CrCl. Ứng dụng không đề xuất liều thay thế. Không dùng khi chưa có quyết định của HĐT&ĐT BV199.",
    sources: ["QĐ 708/QĐ-BYT tr. 254", "Dược thư quốc gia VN 2023, chuyên luận Colistin"],
    autoRecommend: "block",
    blockReason: "Tổng liều 18 MIU/ngày vượt mức tối đa 12 MIU/ngày; chưa có quyết định của HĐT&ĐT.",
  },
  {
    id: "colistin-unit",
    level: "high",
    regimenIds: ["r-sepsis-b-mdr", "r-vap-colistin", "r-fn-add-colistin"],
    title: "Colistin – kiểm tra đơn vị trước khi kê",
    text: "Liều trên thẻ tính theo MIU (triệu đơn vị quốc tế colistimethat). Không trộn với mg CBA (colistin base activity) hoặc mg CMS (colistimethat natri). Tương đương gần đúng theo nguồn: 1 MIU ≈ 30 mg CBA ≈ 80 mg CMS (ATS/IDSA 2016); nhãn thuốc tại BV199 ghi 1 MIU ≈ 33,33 mg colistin base. Các tỷ lệ không trùng hoàn toàn – không tự quy đổi.",
    sources: ["Dược thư quốc gia VN 2023", "ATS/IDSA 2016 Table 3 chú thích e", "Danh mục thuốc BV199"],
  },
  {
    id: "colistin-unit-unverified-copd",
    level: "high",
    regimenIds: ["r-copd23-in-mdr-pseudo"],
    title: "Colistin – đơn vị CHƯA XÁC MINH",
    text: "Nguyên văn QĐ 2767 (mục 3.4.3 và Bảng 3): \"colistin liều nạp 5mg/kg, sau đó 2,5mg/kg x 2 lần/ngày\" – văn bản không ghi là mg CBA hay mg CMS. Nhầm giữa mg CBA và mg CMS có thể sai liều khoảng 2,4 lần (theo tương đương của nguồn: 1 MIU ≈ 33 mg CBA ≈ 80 mg CMS). Cần HĐT&ĐT xác định đơn vị trước khi dùng.",
    sources: ["QĐ 2767/QĐ-BYT (2023)"],
    autoRecommend: "block",
    blockReason: "Đơn vị liều colistin (mg CBA hay mg CMS) chưa xác minh – nguy cơ sai liều.",
  },

  /* ---------- Viem mang nao ---------- */
  {
    id: "meningitis-neonate-dexamethasone",
    level: "critical",
    regimenIds: NEONATAL_MENINGITIS_REGIMENS,
    title: "Trẻ sơ sinh: dexamethason KHÔNG phải khuyến cáo mặc định",
    text: "Ghi chú dexamethason của QĐ 708 (0,6 mg/kg/ngày) và QĐ 5642 (0,4 mg/kg/ngày) là ghi chung cho viêm màng não, không nêu riêng trẻ sơ sinh. WHO 2026 (sổ tay thực hành, mục 7.5.2) không khuyến cáo corticosteroid trong viêm màng não sơ sinh. Chỉ dùng khi HĐT&ĐT/chuyên gia quyết định.",
    sources: ["QĐ 708 tr. 231", "QĐ 5642 tr. 19", "WHO 2026 practical manual, mục 7.5.2"],
  },
  {
    id: "meningitis-neonate-dose",
    level: "high",
    regimenIds: NEONATAL_MENINGITIS_REGIMENS,
    title: "Sơ sinh – liều theo ngày tuổi và cân nặng",
    text: "Liều sơ sinh khác nhau giữa QĐ 708, QĐ 5642 và WHO 2026 (khoảng cách liều aminoglycosid, liều ampicilin tuần đầu). Trẻ non tháng/nhẹ cân < 2 kg: QĐ 708 khuyến cáo liều thấp hơn, khoảng cách dài hơn nhưng không ghi số – liều cho nhóm này CHƯA XÁC MINH. Cần TDM aminoglycosid. " + WHO_MAX,
    sources: ["QĐ 708 Bảng II.20 chú thích a", "WHO 2026 Bảng 11"],
  },
  {
    id: "meningitis-child-maxdose",
    level: "high",
    regimenIds: MEN_CHILD,
    title: "Trẻ em – liều mg/kg phải giới hạn theo liều tối đa",
    text: "Khi tính liều theo cân nặng, không vượt liều tối đa. Ứng dụng không tự tính liều theo cân nặng. " + WHO_MAX,
    sources: ["WHO 2026 Bảng 11"],
  },
  {
    id: "meningitis-child-1-3m-unverified",
    level: "high",
    regimenIds: ["r-men-1-3m-first", "r-men-1-3m-alt"],
    title: "Trẻ 1–3 tháng: liều CHƯA XÁC MINH theo nhóm tuổi",
    text: "Bảng II.20 (QĐ 708) chỉ có cột sơ sinh 0–28 ngày và cột \"Trẻ em\"; liều trên thẻ lấy từ cột \"Trẻ em\" – văn bản không ghi riêng lứa 1–3 tháng.",
    sources: ["QĐ 708 Bảng II.20"],
  },
  {
    id: "meningitis-5642-adult-perkg",
    level: "critical",
    regimenIds: MEN_ADULT_5642,
    title: "Người lớn: liều QĐ 5642 tính theo kg có thể vượt liều tối đa",
    text: "Bảng liều QĐ 5642 (tr. 19) chỉ ghi mg/kg/ngày, không có cột người lớn. Ví dụ 70 kg: ceftriaxon 80–100 mg/kg/ngày = 5,6–7 g/ngày (tối đa 4 g/ngày); ampicilin 150–300 mg/kg/ngày = 10,5–21 g/ngày (tối đa 12 g/ngày). Đối chiếu cột người lớn của QĐ 708 Bảng II.20. " + WHO_MAX,
    sources: ["QĐ 5642 tr. 19", "QĐ 708 Bảng II.20", "WHO 2026 Bảng 11"],
    autoRecommend: "block",
    blockReason: "Liều theo kg (QĐ 5642) áp dụng cho người lớn có thể vượt liều tối đa; dùng phác đồ QĐ 708 cột người lớn hoặc chờ HĐT&ĐT.",
  },
  {
    id: "meningitis-trauma-alt-unverified",
    level: "high",
    regimenIds: ["r-vmn42-trauma-alt"],
    title: "Phác đồ thay thế CHƯA XÁC MINH",
    text: "Bảng QĐ 5642 không tách rõ ô cột thay thế (ceftazidim + vancomycin, meropenem) – chưa xác định cách phối hợp. Không dùng khi chưa đối chiếu bản in.",
    sources: ["QĐ 5642 tr. 19"],
    autoRecommend: "block",
    blockReason: "Cách phối hợp thuốc ở cột thay thế chưa xác định.",
  },

  /* ---------- Nhiem khuan huyet S. aureus ---------- */
  {
    id: "sab-checklist",
    level: "high",
    regimenIds: ["r-bsi-mssa", "r-bsi-mssa-alt", "r-bsi-mrsa", "r-bsi-mrsa-alt"],
    title: "Nhiễm khuẩn huyết S. aureus – danh sách kiểm tra (IDSA/ESCMID 2026 Part 1)",
    text: "QĐ 708 Bảng II.10 chỉ nêu thuốc và liều. Thời gian điều trị KHÔNG mặc định 14 ngày cho mọi trường hợp: chỉ áp dụng khi đã đánh giá đủ và không có ổ nhiễm sâu/di bệnh.",
    checklist: [
      "Cấy máu kiểm tra: ≥ 2 bộ tại 48 giờ sau lần lấy cấy máu dương tính đầu; lặp lại 1–2 bộ mỗi 24–48 giờ đến khi âm tính; ghi ngày cấy máu sạch khuẩn (CS 2).",
      "Cấy máu còn dương tính ≥ 48 giờ: đánh giá thêm ổ nhiễm sâu và xem lại kiểm soát ổ nhiễm (CS 1, 2).",
      "Phân tầng nguy cơ: khởi phát cộng đồng; cấy dương tính ≥ 48 giờ; dụng cụ trong tim; bệnh van tim dễ mắc, tiêm chích ma túy, mảnh ghép nội mạch, SAB trong 90 ngày, tắc mạch, > 1 ổ nhiễm, không rõ ổ (CS 1).",
      "Siêu âm tim qua thành ngực (TTE) cho mọi người lớn (CS 3). Trẻ em: TTE khi có bệnh tim cấu trúc, nhiễm khuẩn huyết kéo dài hoặc dấu hiệu viêm nội tâm mạc.",
      "Siêu âm tim qua thực quản (TEE) nếu TTE âm tính và có: dụng cụ trong tim, bệnh van tim/từng viêm nội tâm mạc, cấy dương tính ≥ 48 giờ, tắc mạch, > 1 ổ nhiễm không liên tục; cân nhắc khi khởi phát cộng đồng hoặc tiêm chích ma túy (CS 4).",
      "Nguy cơ tăng, chưa rõ ổ: chẩn đoán hình ảnh toàn thân (ví dụ [18F]FDG-PET/CT) hoặc phối hợp phương tiện hình ảnh theo vị trí nghi ngờ (CS 5).",
      "Thời gian: 14 ngày tính từ ngày cấy máu sạch khuẩn CHỈ KHI nguy cơ thấp, hoặc nguy cơ tăng nhưng không có ổ nhiễm sâu/di bệnh sau đánh giá; cân nhắc > 14 ngày khi nhiễm khuẩn huyết kéo dài hoặc đánh giá chưa đầy đủ (CS 6, 7). Có ổ nhiễm sâu/viêm nội tâm mạc: không áp dụng 14 ngày – thời gian theo ổ nhiễm, Part 1 chưa quy định.",
      "Lựa chọn thuốc MSSA/MRSA: IDSA/ESCMID chưa công bố (Part 1) – theo QĐ 708 và quyết định của HĐT&ĐT.",
    ],
    sources: ["IDSA/ESCMID 2026 Consensus Statements 1–7 (Part 1)", "QĐ 708 Bảng II.10"],
  },
];

/* ---------- Buoc 4D Nhom 3 ---------- */
const DFI_REGIMENS = ["r-dfi-mild-simple", "r-dfi-mild-allergy", "r-dfi-mild-recent-abx", "r-dfi-mild-mrsa", "r-dfi-mod-simple", "r-dfi-mod-recent-abx", "r-dfi-mod-pseudo", "r-dfi-mod-ischemic", "r-dfi-mod-mrsa", "r-dfi-mod-esbl"];

SAFETY_ALERTS.push(
  {
    id: "ie-peds-ciprofloxacin-unit",
    level: "critical",
    regimenIds: ["r-ie-native-peds"],
    title: "Trẻ em: liều ciprofloxacin CHƯA XÁC MINH (thiếu đơn vị theo cân nặng)",
    text: "Nguyên văn QĐ 708 (tr. 129, đã đối chiếu bản trên kcb.vn): \"ciprofloxacin 20 - 30mg/24giờ chia 2 lần\" – không có \"/kg\". Không suy ra liều theo cân nặng. ESC 2023 (Bảng khuyến cáo 10) không có ciprofloxacin trong phác đồ kinh nghiệm trẻ em. Không dùng dòng liều này khi chưa có quyết định của HĐT&ĐT.",
    sources: ["QĐ 708 tr. 129", "ESC 2023 Bảng khuyến cáo 10"],
    autoRecommend: "block",
    blockReason: "Liều ciprofloxacin trẻ em trong văn bản thiếu đơn vị theo cân nặng (\"20 - 30mg/24giờ\").",
  },
  {
    id: "ie-aminoglycoside",
    level: "high",
    regimenIds: ["r-ie-native-1", "r-ie-native-2", "r-ie-native-peds", "r-ie-prosth-early", "r-ie-prosth-early-peds"],
    title: "Gentamicin/vancomycin trong viêm nội tâm mạc – theo dõi thận và nồng độ",
    text: "Gentamicin dùng ngắn nhất có thể, không quá 14 ngày (QĐ 708 mục 4.3). Người lớn: QĐ 708 chia 3 lần/ngày, ESC 2023 dùng 1 lần/ngày – chưa thống nhất. Phối hợp vancomycin làm tăng nguy cơ độc thận: theo dõi creatinin và nồng độ thuốc. Ứng dụng không tự chọn cách chia liều.",
    sources: ["QĐ 708 tr. 129–130", "ESC 2023 Bảng khuyến cáo 10"],
  },
  {
    id: "stone-obstruction",
    level: "high",
    regimenIds: ["r-stone-complic-bl", "r-stone-complic-fq"],
    title: "Sỏi gây tắc nghẽn kèm nhiễm khuẩn – cần giải áp",
    text: "Kháng sinh đơn thuần có thể không đủ khi có tắc nghẽn. QĐ 708 (mục 3.3): giải phóng tắc và bán tắc do sỏi là điều trị nguyên nhân. EAU 2026 (mục 3.7.3.a.2): người bệnh nặng, xấu đi hoặc nghi tắc nghẽn – kháng sinh phổ rộng (carbapenem) và xử trí tắc nghẽn; thu hẹp theo kháng sinh đồ. Phác đồ trên thẻ không dành cho ca nặng/sốc.",
    sources: ["QĐ 708 tr. 243", "EAU 2026 mục 3.7.3.a.2, 3.7.4"],
  },
  {
    id: "pyelo-amoxclav-iv",
    level: "critical",
    regimenIds: ["r-py-iv-bl"],
    title: "Amoxicilin-clavulanat \"875/125 mg tiêm TM\" – kiểm tra dạng bào chế",
    text: "Nguyên văn QĐ 708 (tr. 236): \"amoxicilin - clavulanat 875/125 mg x 2 lần/ngày tiêm tĩnh mạch\". Hàm lượng 875/125 mg là dạng uống; liều và hàm lượng dạng tiêm CHƯA XÁC MINH trong ứng dụng. Đối chiếu sản phẩm tiêm có tại BV199 và tờ thông tin sản phẩm trước khi dùng.",
    sources: ["QĐ 708 tr. 236"],
    autoRecommend: "block",
    blockReason: "Đường dùng/hàm lượng amoxicilin-clavulanat (875/125 mg \"tiêm TM\") nghi sai; phương án gộp nhiều thuốc trong một dòng nên khóa cả phương án.",
  },
  {
    id: "septic-arthritis-kingella",
    level: "high",
    regimenIds: ["r-sa-empiric-1", "r-sa-empiric-2"],
    title: "Trẻ 6–48 tháng: phác đồ kinh nghiệm có thể không bao phủ Kingella kingae",
    text: "PIDS/IDSA 2023 (mục V): trẻ 6–48 tháng nên chọn thuốc có tác dụng trên K. kingae. Vi khuẩn này không nhạy penicilin kháng tụ cầu (oxacilin, nafcilin), kháng vancomycin và thường kháng clindamycin. QĐ 708 không tách liều trẻ em; liều trên thẻ là liều người lớn (oxacilin 8 g/ngày, clindamycin 2,4 g/ngày).",
    sources: ["PIDS/IDSA 2023 mục V, IX", "QĐ 708 tr. 164"],
  },
  {
    id: "dfi-no-dose",
    level: "high",
    regimenIds: DFI_REGIMENS,
    title: "Nhiễm trùng bàn chân đái tháo đường: nguồn KHÔNG nêu liều",
    text: "QĐ 1530/QĐ-BYT (Phụ lục 02) và IWGDF/IDSA 2023 chỉ nêu nhóm thuốc, không có bảng liều. Ứng dụng không suy diễn và không ghép liều vào phác đồ. Tra liều theo chuyên luận từng hoạt chất (nút \"Liều\" – module Hiệu chỉnh liều, Dược thư quốc gia 2023): 15 hoạt chất nêu tên trong các phác đồ này đã có chuyên luận (5 đã đối chiếu trang nguồn, 10 chưa); mục chỉ ghi nhóm thuốc (cephalosporin thế hệ 1–3, carbapenem, glycopeptid, macrolid, acid fusidic) phải chọn hoạt chất cụ thể. Liều Dược thư là liều theo chỉ định chung, không phải liều riêng cho nhiễm trùng bàn chân – cần HĐT&ĐT quyết định; hiệu chỉnh theo chức năng thận.",
    sources: ["QĐ 1530/QĐ-BYT (2023) tr. 32–33", "IWGDF/IDSA 2023"],
  },
);

/* ---------- Buoc 4D.4 ---------- */
const SEPTIC_ARTHRITIS = ["r-sa-empiric-1", "r-sa-empiric-2", "r-sa-mrsa", "r-sa-mssa", "r-sa-strep", "r-sa-hflu", "r-sa-gramneg", "r-sa-pseudo", "r-gc-sens", "r-gc-resist", "r-gc-chlamydia"];

SAFETY_ALERTS.push({
  id: "septic-arthritis-adult-dose-only",
  level: "high",
  regimenIds: SEPTIC_ARTHRITIS,
  title: "Liều cố định người lớn – không dùng cho trẻ em",
  text: "QĐ 708 (mục 4.2.1, tr. 164–165) ghi liều cố định (ví dụ oxacilin 2 g mỗi 6 giờ, vancomycin 2 g/ngày, levofloxacin 500 mg) và không tách liều trẻ em. Trẻ em: theo PIDS/IDSA 2023 (nguyên tắc chọn thuốc, K. kingae, thời gian); bảng liều trẻ em của PIDS/IDSA chưa xác minh nguyên văn nên ứng dụng không hiển thị. Bộ chọn không đề xuất các phương án này khi người bệnh là trẻ em.",
  sources: ["QĐ 708 tr. 164–165", "PIDS/IDSA 2023"],
  blockFor: ["child"],
  blockReason: "Liều cố định người lớn của QĐ 708; chưa có liều trẻ em đã xác minh.",
});

/* Phuong an bi khoa de xuat tu dong (toan bo hoac theo nhom doi tuong). */
export function autoRecommendBlocks(regimenId: string, population?: string): SafetyAlert[] {
  return safetyAlertsFor(regimenId).filter(
    (a) => a.autoRecommend === "block" || (!!a.blockFor && !!population && (a.blockFor as string[]).includes(population))
  );
}

export function safetyAlertsFor(regimenId: string): SafetyAlert[] {
  return SAFETY_ALERTS.filter((a) => a.regimenIds.includes(regimenId)).sort(
    (a, b) => (a.level === b.level ? 0 : a.level === "critical" ? -1 : 1)
  );
}

/* Dexamethason trong ghi chu phac do so sinh: giu nguyen van, gan nhan khong ap dung mac dinh. */
export const NEONATAL_DEXA_PREFIX = "KHÔNG ÁP DỤNG MẶC ĐỊNH CHO TRẺ SƠ SINH – nguyên văn BYT (ghi chung cho viêm màng não): ";
