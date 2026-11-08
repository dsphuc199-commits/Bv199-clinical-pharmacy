/*
  FILE: data/antibiotics/empiric/overviews-other.ts

  Tong quan (Tang 1) + theo doi (Tang 4) cho mat benh lay phac do tu van ban BYT khac QĐ 708.
  Doi chieu nguyen van ban PDF da tai; vi tri trong `ref` (khong hien inline).
  Khong chua lieu; nguon khong neu thi ghi "không quy định".
*/

import type { DiseaseOverviewData } from "./overviews";

type Monitoring = DiseaseOverviewData["monitoring"];
const ov = (docLabel: string, cards: DiseaseOverviewData["cards"], sourceControl: DiseaseOverviewData["sourceControl"], monitoring: Monitoring): DiseaseOverviewData =>
  ({ docLabel, cards, sourceControl, monitoring });

/* ================= QĐ 5643/QĐ-BYT (31/12/2015) – Tai Mũi Họng ================= */
const TMH = "QĐ 5643/QĐ-BYT (31/12/2015) – Hướng dẫn chẩn đoán và điều trị các bệnh Tai Mũi Họng";

const SINUSITIS = ov(`${TMH}, Viêm mũi xoang cấp tính`, [
  { label: "Tác nhân thường gặp", points: [
    { text: "S. pneumoniae, H. influenzae, M. catarrhalis.", ref: "tr. 108" },
    { text: "Khoảng 25% phế cầu kháng penicilin; 30% H. influenzae và hầu hết M. catarrhalis tiết beta-lactamase.", ref: "tr. 111" },
  ] },
  { label: "Khi nào nghĩ do vi khuẩn", points: [
    { text: "Nhiễm virus hô hấp trên nặng lên sau 5–7 ngày hoặc kéo dài hơn 10 ngày.", ref: "tr. 108, 110" },
    { text: "Soi mũi trước, nội soi mũi (lấy bệnh phẩm khe giữa); CT khi nghi biến chứng.", ref: "tr. 109" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Chọn theo mức độ nặng và việc dùng kháng sinh trong 4–6 tuần gần đây.", ref: "tr. 111" },
    { text: "Dị ứng beta-lactam: thất bại với nhóm không beta-lactam có thể tới 25%.", ref: "tr. 111" },
  ] },
  { label: "Thời gian", points: [
    { text: "Thể nặng: 10–14 ngày. Thể khác: bài không quy định cụ thể.", ref: "tr. 111" },
  ] },
], [
  { text: "Rửa mũi nước muối; corticoid xịt mũi; thuốc co mạch xịt ngắn ngày (ví dụ 3 ngày).", ref: "tr. 112" },
  { text: "Phẫu thuật khi điều trị nội khoa tối đa 4–6 tuần không kết quả.", ref: "tr. 112" },
], {
  efficacy: [{ text: "Đau vùng mặt, ngạt mũi, chảy mủ mũi, sốt.", ref: "tr. 109" }],
  reassessment: [{ text: "Thất bại sau 72 giờ: đánh giá lại, đổi phác đồ; cân nhắc CT, nội soi, nuôi cấy.", ref: "tr. 111" }],
  safety: [{ text: "Thuốc co mạch xịt kéo dài có thể làm bệnh nặng hơn.", ref: "tr. 112" }],
});

const PHARYNGITIS = ov(`${TMH}, Viêm họng cấp tính`, [
  { label: "Tác nhân", points: [
    { text: "Virus 60–80%; vi khuẩn 20–40% (liên cầu tan huyết nhóm A, H. influenzae, tụ cầu vàng, M. catarrhalis, kỵ khí).", ref: "tr. 155" },
  ] },
  { label: "Chẩn đoán", points: [
    { text: "Sốt đột ngột, đau họng khi nuốt, họng đỏ, amiđan sưng có chấm mủ, hạch góc hàm đau.", ref: "tr. 156" },
    { text: "Phết họng nuôi cấy để định loại nguyên nhân.", ref: "tr. 156" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Trên 3 tuổi, chưa định loại: điều trị như viêm họng do liên cầu.", ref: "tr. 157" },
  ] },
  { label: "Thời gian", points: [
    { text: "Bài không quy định thời gian dùng kháng sinh.", ref: "tr. 157" },
  ] },
], [
  { text: "Điều trị tại chỗ (xông, súc họng); hạ sốt, giảm đau.", ref: "tr. 157" },
  { text: "Thể nặng hoặc có biến chứng: chuyển chuyên khoa kịp thời.", ref: "tr. 158" },
], {
  efficacy: [{ text: "Sốt, đau họng; do virus thường tự khỏi sau 3–5 ngày.", ref: "tr. 158" }],
  reassessment: [{ text: "Theo dõi biến chứng: áp xe quanh amiđan, khoang bên họng; viêm tai giữa, viêm xoang.", ref: "tr. 158" }],
  safety: [{ text: "Liên cầu tan huyết: nguy cơ viêm thận, viêm khớp, viêm tim – cần điều trị kháng sinh có hệ thống.", ref: "tr. 158" }],
});

const OTITIS = ov(`${TMH}, Viêm tai giữa cấp tính trẻ em`, [
  { label: "Nguyên nhân", points: [
    { text: "Viêm vòm mũi họng lan qua vòi Eustache; trẻ có VA, sau cúm, sởi.", ref: "tr. 210" },
  ] },
  { label: "Chẩn đoán", points: [
    { text: "Đau tai, sốt cao, nghe kém; màng nhĩ đỏ, phồng; nội soi tai.", ref: "tr. 210–212" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Kháng sinh phổ rộng (beta-lactam, cephalosporin, macrolid), tốt nhất theo kháng sinh đồ; phối hợp kháng viêm, dẫn lưu.", ref: "tr. 212, 214" },
  ] },
  { label: "Thời gian", points: [
    { text: "Bài không quy định thời gian dùng kháng sinh.", ref: "tr. 214" },
  ] },
], [
  { text: "Chích rạch màng nhĩ khi có mủ hòm nhĩ, triệu chứng toàn thân xấu, kéo dài trên 4 ngày.", ref: "tr. 213" },
  { text: "Màng nhĩ đã thủng: hút rửa, làm thuốc tai hằng ngày.", ref: "tr. 213" },
], {
  efficacy: [{ text: "Đau tai, sốt, tình trạng lỗ thủng và chảy mủ.", ref: "tr. 213" }],
  reassessment: [
    { text: "Lỗ thủng đóng nhưng còn sốt, đau tai: chích rạch lại.", ref: "tr. 213" },
    { text: "Chụp X-quang xương chũm khi dùng kháng sinh để phát hiện viêm xương chũm tiềm tàng.", ref: "tr. 214" },
  ],
  safety: [{ text: "Biến chứng: viêm xương chũm, viêm màng não, áp xe não, liệt mặt.", ref: "tr. 214" }],
});

const DEEP_NECK = ov(`${TMH}, Nhiễm trùng khoang cổ sâu`, [
  { label: "Tác nhân", points: [
    { text: "Đa vi khuẩn: hiếu khí (H. influenzae, S. pneumoniae, Klebsiella) và kỵ khí (Peptostreptococcus, Fusobacterium, Bacteroides).", ref: "tr. 254" },
    { text: "Gram âm ở người già, đái tháo đường, suy giảm miễn dịch.", ref: "tr. 255" },
  ] },
  { label: "Chẩn đoán", points: [
    { text: "Sốt, cổ sưng nóng đỏ đau, khó nuốt, khó thở; CT có cản quang phân biệt áp xe với viêm mô tế bào.", ref: "tr. 255" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Bảo đảm đường thở trước.", ref: "tr. 255" },
    { text: "Kháng sinh phổ rộng, tĩnh mạch, liều cao: cephalosporin thế hệ 3 + metronidazol.", ref: "tr. 255" },
  ] },
  { label: "Thời gian", points: [
    { text: "Theo đáp ứng lâm sàng và kháng sinh đồ; bài không quy định số ngày.", ref: "tr. 256" },
  ] },
], [
  { text: "Rạch dẫn lưu áp xe (trong miệng hoặc ngoài cổ); chọc hút dưới siêu âm, CT với áp xe nhỏ, đơn độc.", ref: "tr. 256" },
], {
  efficacy: [{ text: "Công thức máu, X-quang phổi mỗi 24 giờ; sinh hiệu, đường huyết; tình trạng vết mổ.", ref: "tr. 256" }],
  reassessment: [{ text: "Không cải thiện sau 24–48 giờ: làm lại hình ảnh học, rạch dẫn lưu.", ref: "tr. 255" }],
  safety: [{ text: "Biến chứng: tắc nghẽn đường thở, viêm trung thất, thuyên tắc tĩnh mạch cảnh.", ref: "tr. 256" }],
});

/* ================= QĐ 5642/QĐ-BYT (31/12/2015) – Truyền nhiễm ================= */
const TN = "QĐ 5642/QĐ-BYT (31/12/2015) – Hướng dẫn chẩn đoán và điều trị một số bệnh truyền nhiễm";
const TYPHOID = ov(`${TN}, Bệnh thương hàn`, [
  { label: "Tác nhân", points: [
    { text: "Salmonella Typhi (trực khuẩn Gram âm); lây qua đường tiêu hóa.", ref: "tr. 38" },
    { text: "Đã kháng ampicilin, amoxicilin, chloramphenicol, co-trimoxazol.", ref: "tr. 41" },
  ] },
  { label: "Chẩn đoán", points: [
    { text: "Sốt cao nguyên, mạch nhiệt phân ly, lưỡi quay, lách to, đào ban.", ref: "tr. 39–40" },
    { text: "Cấy máu, tủy xương, phân, nước tiểu; Widal ≥ 1:160 hoặc tăng gấp 4 lần.", ref: "tr. 39–40" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Fluoroquinolon hoặc cephalosporin thế hệ 3; có thể dùng azithromycin.", ref: "tr. 41" },
  ] },
  { label: "Thời gian", points: [
    { text: "5–7 ngày; 10–14 ngày nếu có biến chứng.", ref: "tr. 41" },
    { text: "Người mang khuẩn: 4 tuần đến 3 tháng tùy thuốc.", ref: "tr. 41" },
  ] },
], [
  { text: "Ăn mềm, ít xơ; bù dịch, điện giải; corticoid cho thể nặng (viêm não, viêm cơ tim, sốc).", ref: "tr. 41" },
  { text: "Phát hiện sớm và xử trí thủng ruột, xuất huyết tiêu hóa.", ref: "tr. 40–41" },
], {
  efficacy: [{ text: "Nhiệt độ, tình trạng tiêu hóa, ý thức.", ref: "tr. 39" }],
  reassessment: [{ text: "Tái phát (sốt lại khoảng 2 tuần sau ngừng kháng sinh): điều trị lại theo phác đồ.", ref: "tr. 41–42" }],
  safety: [{ text: "Biến chứng: xuất huyết tiêu hóa, thủng ruột, viêm cơ tim, viêm não.", ref: "tr. 41–42" }],
});

/* ================= QĐ 3429/QĐ-BYT (14/07/2021) – Nhiễm nấm xâm lấn ================= */
const NAM = "QĐ 3429/QĐ-BYT (14/07/2021) – Hướng dẫn chẩn đoán và điều trị nhiễm nấm xâm lấn (đối chiếu bản đăng lại vnras.com)";
const FUNGAL_TDM = { text: "Định lượng nồng độ itraconazol, voriconazol, posaconazol, isavuconazol khi điều trị Aspergillus xâm lấn (xem module TDM).", ref: "tr. 61–62" };
const CAMB = { text: "Amphotericin B deoxycholat: nguy cơ độc gan, thận, mắt, rối loạn điện giải gây rung thất – ưu tiên dạng liposomal hoặc phức hợp lipid khi có nguy cơ.", ref: "tr. 57" };
const candida = (title: string, timeCard: DiseaseOverviewData["cards"][number], extraControl: DiseaseOverviewData["sourceControl"] = []) => ov(`${NAM}, ${title}`, [
  { label: "Phân loại", points: [
    { text: "Candida máu đơn độc; Candida máu kèm xâm lấn mô sâu; xâm lấn mô sâu cấy máu âm tính.", ref: "tr. 49" },
    { text: "Đặc hiệu khi chẩn đoán chắc chắn; kinh nghiệm khi \"nhiều khả năng\" hoặc \"có thể\".", ref: "tr. 49, 51" },
  ] },
  { label: "Xét nghiệm", points: [
    { text: "Kháng nấm đồ với azole cho mọi chủng; với echinocandin khi đã dùng echinocandin hoặc C. glabrata, C. parapsilosis.", ref: "tr. 49" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Ưu tiên echinocandin; fluconazol khi không nặng và chủng không kháng; amphotericin B dạng lipid khi không dung nạp.", ref: "tr. 49–52" },
    { text: "Nghi nấm sợi: không dùng fluconazol.", ref: "tr. 53" },
  ] },
  timeCard,
], [
  { text: "Nghi Candida máu liên quan catheter tĩnh mạch trung tâm: rút catheter sớm (người giảm bạch cầu: cân nhắc từng trường hợp).", ref: "tr. 50–51" },
  ...extraControl,
], {
  efficacy: [{ text: "Cấy máu lại (có thể cách 2 ngày) đến khi âm tính; khám mắt tìm nhiễm nấm hắc mạc.", ref: "tr. 50–51" }],
  reassessment: [
    { text: "Ổn định, chủng nhạy, cấy máu âm tính: xuống thang sang fluconazol (thường sau 7 ngày).", ref: "tr. 49" },
    { text: "Xấu đi khi đang điều trị: loại trừ căn nguyên mới, rồi điều trị cứu cánh.", ref: "tr. 53" },
  ],
  safety: [CAMB],
});
const CANDIDEMIA = candida("Nhiễm nấm Candida xâm lấn", { label: "Thời gian", points: [
  { text: "Candida máu đơn độc: 2 tuần sau khi cấy máu âm tính và cải thiện triệu chứng.", ref: "tr. 50" },
] });
const CANDIDA_ABD = candida("Nhiễm nấm Candida trong ổ bụng", { label: "Thời gian", points: [
  { text: "Dựa vào kiểm soát nguồn lây và đáp ứng lâm sàng.", ref: "tr. 54" },
] }, [{ text: "Kiểm soát nguồn kết hợp dẫn lưu và/hoặc làm sạch ổ bụng.", ref: "tr. 54" }]);
const CANDIDA_ENDO = candida("Nhiễm nấm Candida nội tâm mạc (Bảng 4.3)", { label: "Thời gian", points: [
  { text: "Ít nhất 6 tuần sau thay van; dài hơn nếu áp xe van; không thay van được: kéo dài fluconazol.", ref: "tr. 54" },
] }, [{ text: "Phẫu thuật thay van.", ref: "tr. 54" }]);
const CANDIDA_BONE = candida("Nhiễm nấm Candida cơ xương khớp (Bảng 4.4)", { label: "Thời gian", points: [
  { text: "Fluconazol 6–12 tháng; echinocandin hoặc amphotericin B ít nhất 2 tuần trước khi chuyển.", ref: "tr. 54" },
] }, [{ text: "Phẫu thuật tháo khớp, dẫn lưu, tháo khớp giả với mọi viêm khớp hoại tử.", ref: "tr. 54" }]);

const aspergillus = (title: string, extraControl: DiseaseOverviewData["sourceControl"] = []) => ov(`${NAM}, ${title}`, [
  { label: "Phân loại", points: [
    { text: "Xâm lấn: khoảng 85% ở phổi, 15% ngoài phổi (thần kinh trung ương, xoang, mắt, nội tâm mạc…).", ref: "tr. 55" },
  ] },
  { label: "Nhóm nguy cơ", points: [
    { text: "Bệnh máu ác tính, ghép tế bào gốc, giảm bạch cầu kéo dài; ghép tạng đặc; corticoid kéo dài; COPD; xơ gan, ARDS, cúm nặng tại hồi sức.", ref: "tr. 58–59" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Ưu tiên voriconazol hoặc isavuconazol; thay thế amphotericin B liposomal; echinocandin không phải lựa chọn đầu.", ref: "tr. 55–57" },
    { text: "Không khuyến cáo phối hợp kháng nấm đầu tay cho mọi trường hợp.", ref: "tr. 61" },
  ] },
  { label: "Thời gian", points: [
    { text: "Tối thiểu 6–12 tuần, dài hơn tùy ức chế miễn dịch và đáp ứng.", ref: "tr. 56" },
  ] },
], [
  { text: "Hạn chế yếu tố làm nặng suy giảm miễn dịch; cắt bỏ tổ chức hoại tử khi có chỉ định.", ref: "tr. 56, 61" },
  ...extraControl,
], {
  efficacy: [{ text: "Galactomannan huyết thanh liên tiếp; lâm sàng và hình ảnh.", ref: "tr. 62" }],
  reassessment: [{ text: "Xấu đi: đổi nhóm kháng nấm, giảm ức chế miễn dịch, phẫu thuật (điều trị cứu cánh).", ref: "tr. 60–61" }],
  safety: [FUNGAL_TDM, CAMB],
});
const ASPERGILLUS = aspergillus("Nhiễm Aspergillus phổi xâm lấn", [
  { text: "Ho máu đe dọa tính mạng: nút mạch phổi hoặc phẫu thuật cầm máu.", ref: "tr. 56" },
]);
const ASP_SINUS = aspergillus("Nhiễm Aspergillus ngoài phổi – xâm lấn xoang mũi (Bảng 4.7)", [
  { text: "Phẫu thuật cắt u nấm.", ref: "tr. 60" },
]);
const HEME = aspergillus("Nhiễm nấm xâm lấn ở người bệnh máu ác tính, ghép tế bào gốc");

const CRYPTO = ov(`${NAM}, Nhiễm nấm Cryptococcus`, [
  { label: "Phân nhóm", points: [
    { text: "HIV (−) không giảm miễn dịch, bệnh nhẹ; HIV (−) có giảm miễn dịch hoặc tổn thương thần kinh trung ương; HIV (+).", ref: "tr. 62–64" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Thể nặng, viêm màng não: amphotericin B + flucytosin (tấn công).", ref: "tr. 63–64" },
    { text: "Thể nhẹ HIV (−): fluconazol hoặc itraconazol.", ref: "tr. 62" },
  ] },
  { label: "Giai đoạn (HIV +)", points: [
    { text: "Tấn công ≥ 2 tuần; củng cố ≥ 8 tuần; duy trì ≥ 1 năm.", ref: "tr. 63–64" },
  ] },
  { label: "Lưu ý", points: [
    { text: "Echinocandin không có tác dụng trên Cryptococcus.", ref: "tr. 65" },
    { text: "Có thai: ưu tiên amphotericin B dạng lipid; tránh flucytosin, fluconazol > 400 mg/ngày.", ref: "tr. 65" },
  ] },
], [
  { text: "Tăng áp lực nội sọ: dẫn lưu dịch não tủy (chọc tủy sống).", ref: "tr. 63" },
  { text: "Phẫu thuật khi tổn thương xương, phổi, thần kinh trung ương kéo dài hoặc không đáp ứng.", ref: "tr. 63" },
], {
  efficacy: [{ text: "Lâm sàng; cấy lại dịch não tủy sau tấn công.", ref: "tr. 64" }],
  reassessment: [
    { text: "Thể nhẹ không cải thiện sau 2 tuần: chuyển phác đồ có amphotericin B.", ref: "tr. 62" },
    { text: "Ngừng duy trì khi CD4 ≥ 100 tế bào/mm³ ≥ 3 tháng và ART thành công; không ngừng ở trẻ dưới 2 tuổi.", ref: "tr. 64" },
  ],
  safety: [CAMB],
});
const rare = (title: string, cards: DiseaseOverviewData["cards"], monitoring: Monitoring) => ov(`${NAM}, ${title}`, cards, [], monitoring);
const MUCOR = rare("Nhiễm một số loài nấm hiếm gặp – Zygomyces", [
  { label: "Phân loại", points: [{ text: "Zygomyces thuộc nhóm nấm hiếm gặp (cùng Hyalohyphomycoses, Phaeohyphomycoses, Trichosporon).", ref: "tr. 68" }] },
  { label: "Khởi trị", points: [{ text: "Amphotericin B dạng lipid hoặc deoxycholat.", ref: "tr. 68" }] },
  { label: "Thay thế", points: [{ text: "Posaconazol uống.", ref: "tr. 68" }] },
  { label: "Thời gian", points: [{ text: "Bài không quy định.", ref: "tr. 68" }] },
], { efficacy: [{ text: "Bài không nêu chỉ số theo dõi riêng.", ref: "tr. 68" }], reassessment: [], safety: [CAMB] });
const HISTO = rare("Nhiễm nấm Histoplasma phổi", [
  { label: "Phân độ", points: [{ text: "Cấp trung bình–nặng; cấp nhẹ–trung bình (thường không cần điều trị); mạn tính.", ref: "tr. 67" }] },
  { label: "Khởi trị", points: [{ text: "Trung bình–nặng: amphotericin B dạng lipid 1–2 tuần, rồi itraconazol.", ref: "tr. 67" }] },
  { label: "Hỗ trợ", points: [{ text: "Biến chứng hô hấp: methylprednisolon 1–2 tuần đầu.", ref: "tr. 67" }] },
  { label: "Thời gian", points: [{ text: "Itraconazol tổng 12 tuần (thể cấp trung bình–nặng).", ref: "tr. 67" }] },
], { efficacy: [{ text: "Tình trạng hô hấp, oxy máu.", ref: "tr. 67" }], reassessment: [], safety: [{ text: "Định lượng nồng độ itraconazol sau ít nhất 2 tuần.", ref: "tr. 67" }, CAMB] });
const TALARO = rare("Nhiễm nấm Talaromyces marneffei", [
  { label: "Phân độ", points: [{ text: "Nặng: nhiều cơ quan + suy hô hấp/tuần hoàn; trung bình: nhiều cơ quan; nhẹ: chỉ da.", ref: "tr. 66" }] },
  { label: "Khởi trị", points: [{ text: "Bắt đầu ngay khi chẩn đoán; trung bình–nặng: amphotericin B dạng lipid rồi itraconazol.", ref: "tr. 66" }] },
  { label: "Thay thế", points: [{ text: "Voriconazol; thể nhẹ: itraconazol uống.", ref: "tr. 66" }] },
  { label: "Thời gian", points: [{ text: "Amphotericin B 2 tuần + itraconazol 10 tuần; thể nhẹ 8–12 tuần.", ref: "tr. 66" }] },
], { efficacy: [{ text: "Tổn thương da, chức năng hô hấp, tuần hoàn.", ref: "tr. 66" }], reassessment: [], safety: [CAMB] });
const PCP = rare("Viêm phổi do Pneumocystis jirovecii", [
  { label: "Đối tượng", points: [{ text: "Người suy giảm miễn dịch có bằng chứng viêm phổi do P. jirovecii.", ref: "tr. 65" }] },
  { label: "Khởi trị", points: [{ text: "Trimethoprim-sulfamethoxazol; thay thế primaquin + clindamycin, atovaquon, pentamidin.", ref: "tr. 65" }] },
  { label: "Hỗ trợ", points: [{ text: "HIV có PaO2 < 70 mmHg hoặc chênh áp A-a > 35: thêm prednison.", ref: "tr. 65" }] },
  { label: "Thời gian", points: [{ text: "Thông thường 3 tuần; đáp ứng sau ít nhất 7–10 ngày.", ref: "tr. 65" }] },
], {
  efficacy: [{ text: "Lâm sàng hô hấp, oxy máu.", ref: "tr. 65" }],
  reassessment: [{ text: "Dự phòng co-trimoxazol theo CD4 và giai đoạn lâm sàng HIV.", ref: "tr. 65" }],
  safety: [{ text: "Đường tĩnh mạch: định lượng nồng độ sulfamethoxazol hoặc trimethoprim.", ref: "tr. 65" }],
});

/* ================= QĐ 1530, 162, 315, 4416 ================= */
const FOOT = ov("QĐ 1530/QĐ-BYT (24/03/2023) – Hướng dẫn chẩn đoán và điều trị loét bàn chân do đái tháo đường", [
  { label: "Phân độ", points: [
    { text: "Nhẹ: Wagner độ 1 hoặc PEDIS 1–2. Trung bình–nặng: Wagner ≥ 2 hoặc PEDIS ≥ 3.", ref: "tr. 32–33" },
    { text: "PEDIS ≥ 7: nguy cơ cắt cụt chi cao.", ref: "tr. 24" },
  ] },
  { label: "Yếu tố làm nặng", points: [
    { text: "Dị ứng beta-lactam; dùng kháng sinh gần đây; nguy cơ MRSA; loét ẩm, khí hậu ấm; thiếu máu, hoại tử, sinh hơi; nguy cơ ESBL.", ref: "tr. 32–33" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Theo kinh nghiệm, tránh phổ rộng không cần thiết; tiêm cho nhiễm trùng nặng.", ref: "tr. 25" },
    { text: "Tiền sử MRSA, tỷ lệ cấy MRSA cao hoặc nhiễm trùng nặng: xem xét thuốc có hiệu quả trên MRSA.", ref: "tr. 25" },
  ] },
  { label: "Thời gian", points: [
    { text: "Thường 2–4 tuần với nhiễm trùng mô mềm; không cần dùng đến khi loét lành hẳn.", ref: "tr. 25" },
  ] },
], [
  { text: "Cắt lọc cơ học thường xuyên, lặp lại để loại bỏ màng sinh học; băng gạc kháng khuẩn.", ref: "tr. 25–26" },
  { text: "Kiểm soát đái tháo đường; ưu tiên làm lành vết loét, cắt cụt là lựa chọn sau cùng.", ref: "tr. 24" },
], {
  efficacy: [{ text: "Đáp ứng lâm sàng của nhiễm trùng; kết quả cấy.", ref: "tr. 25" }],
  reassessment: [
    { text: "Đáp ứng kém: cấy lại dịch vết thương trong điều kiện tối ưu.", ref: "tr. 25" },
    { text: "Kiểm soát tốt và có kết quả cấy: cân nhắc chuyển đường uống.", ref: "tr. 25" },
  ],
  safety: [],
});
const LAO = "QĐ 162/QĐ-BYT (19/01/2024) – Hướng dẫn chẩn đoán, điều trị và dự phòng bệnh lao";
const tb = (title: string, cards: DiseaseOverviewData["cards"]) => ov(`${LAO}, ${title}`, cards, [], {
  efficacy: [{ text: "Điều trị có kiểm soát hằng ngày; theo dõi đáp ứng lâm sàng.", ref: "tr. 43" }],
  reassessment: [{ text: "Không đáp ứng, đáp ứng kém, không dung nạp: hội chẩn phác đồ cá thể.", ref: "tr. 47" }],
  safety: [{ text: "Có thể chia liều 2 lần/ngày để giảm biến cố bất lợi.", ref: "tr. 43" }],
});
const PULM_TB = tb("Phác đồ điều trị lao nhạy cảm thuốc", [
  { label: "Nguyên tắc", points: [{ text: "Tấn công diệt nhanh vi khuẩn; duy trì diệt triệt để, tránh tái phát.", ref: "tr. 43" }] },
  { label: "Người lớn", points: [
    { text: "A1 – 2HRZE/4RHE (kể cả HIV, có thai).", ref: "tr. 43–44" },
    { text: "A1a – 2HPMZ/2HPM: lao phổi, ≥ 12 tuổi, ≥ 40 kg; không dùng khi có thai, cho con bú, CD4 < 100.", ref: "tr. 45" },
  ] },
  { label: "Trẻ em", points: [
    { text: "A2 – 2HRZE/4RH.", ref: "tr. 44–45" },
    { text: "A2a – 4 tháng: trẻ 3 tháng – 16 tuổi, lao nhẹ đủ 3 tiêu chí.", ref: "tr. 45–46" },
  ] },
  { label: "Thời gian", points: [{ text: "6 tháng (A1, A2) hoặc 4 tháng (A1a, A2a).", ref: "tr. 43–46" }] },
]);
const CNS_TB = tb("Phác đồ điều trị lao hệ thần kinh trung ương", [
  { label: "Chỉ định", points: [{ text: "Lao hệ thần kinh trung ương, lao xương khớp không có bằng chứng kháng thuốc.", ref: "tr. 46" }] },
  { label: "Phác đồ", points: [
    { text: "Người lớn B1 – 2HRZE/10RHE; trẻ em B2 – 2HRZE/10RH.", ref: "tr. 46" },
    { text: "0–19 tuổi, không nhiễm HIV: B2a – 6HRZEto.", ref: "tr. 47" },
  ] },
  { label: "Hỗ trợ", points: [{ text: "Lao màng não: corticosteroid giảm dần 6–8 tuần đầu; cân nhắc streptomycin khi nặng.", ref: "tr. 46" }] },
  { label: "Thời gian", points: [{ text: "12 tháng (B1, B2) hoặc 6 tháng (B2a).", ref: "tr. 46–47" }] },
]);
const SPK = "QĐ 315/QĐ-BYT (29/01/2015) – Hướng dẫn chẩn đoán và điều trị các bệnh sản phụ khoa";
const NEONATAL_SEPSIS = ov(`${SPK}, Nhiễm khuẩn sơ sinh`, [
  { label: "Nguy cơ", points: [
    { text: "Mẹ sốt, nhiễm trùng ối, vỡ ối > 18 giờ, chuyển dạ > 12 giờ; non tháng, thấp cân, thủ thuật xâm lấn.", ref: "tr. 235–236" },
  ] },
  { label: "Chẩn đoán", points: [
    { text: "Lâm sàng nghèo nàn; cấy máu, dịch não tủy (≥ 1 ml); bạch cầu > 25.000 hoặc < 5.000/mm³, tiểu cầu < 100.000, CRP > 10 mg/l.", ref: "tr. 236–237" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Sớm: beta-lactam + aminosid. Muộn: theo tác nhân nghi ngờ (tụ cầu, Gram âm, kỵ khí).", ref: "tr. 238" },
  ] },
  { label: "Thời gian", points: [
    { text: "Nhiễm trùng máu 10 ngày; viêm màng não 14–21 ngày; viêm phổi 7–10 ngày; tụ cầu vàng 3–6 tuần.", ref: "tr. 238–239" },
  ] },
], [
  { text: "Nhiễm trùng da, rốn, áp xe: cắt lọc, dẫn lưu mủ, sát trùng tại chỗ.", ref: "tr. 239" },
  { text: "Hỗ trợ: thân nhiệt, dịch, điện giải, hô hấp, đông máu.", ref: "tr. 239–240" },
], {
  efficacy: [{ text: "Thân nhiệt, tưới máu da, bú, hô hấp; CRP, công thức máu.", ref: "tr. 236–237" }],
  reassessment: [{ text: "Có kháng sinh đồ: điều chỉnh; xấu đi khi đang dùng kháng sinh kéo dài: phối hợp kháng nấm azol.", ref: "tr. 238" }],
  safety: [{ text: "Aminosid có thể gây điếc: không dùng quá 7 ngày ở trẻ sơ sinh.", ref: "tr. 239" }],
});
const VULVO = ov(`${SPK}, Viêm âm hộ – âm đạo`, [
  { label: "Tác nhân", points: [{ text: "Candida albicans; thuận lợi: đái tháo đường, có thai.", ref: "tr. 133" }] },
  { label: "Chẩn đoán", points: [{ text: "Ngứa âm hộ, vết đỏ; có sợi nấm, test tanh cá âm tính.", ref: "tr. 133" }] },
  { label: "Điều trị", points: [{ text: "Đặt âm đạo nystatin hoặc miconazol.", ref: "tr. 133" }] },
  { label: "Thời gian", points: [{ text: "Miconazol 3 tối; nystatin: bài không ghi số ngày.", ref: "tr. 133" }] },
], [], { efficacy: [{ text: "Hết ngứa, hết khí hư.", ref: "tr. 133" }], reassessment: [], safety: [] });
const BOIL = ov("QĐ 4416/QĐ-BYT (06/12/2023) – Hướng dẫn chẩn đoán và điều trị các bệnh da liễu, Nhọt, áp xe da", [
  { label: "Tác nhân", points: [
    { text: "Nhọt: tụ cầu vàng. Áp xe: tụ cầu vàng (MRSA gây tái phát), S. pyogenes, Gram âm, kỵ khí.", ref: "tr. 14" },
  ] },
  { label: "Chẩn đoán", points: [
    { text: "Chủ yếu lâm sàng; siêu âm đánh giá ổ áp xe; nhuộm Gram, cấy, kháng sinh đồ.", ref: "tr. 15" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Ổ áp xe: trích rạch dẫn lưu kèm kháng sinh toàn thân; nghi MRSA: thuốc có hiệu quả trên MRSA.", ref: "tr. 15–16" },
  ] },
  { label: "Thời gian", points: [{ text: "7–10 ngày.", ref: "tr. 16" }] },
], [
  { text: "Chưa có mủ: không nặn, bôi sát khuẩn. Có mủ: chích rạch, dẫn lưu; kháng sinh tại chỗ.", ref: "tr. 16" },
], {
  efficacy: [{ text: "Sưng, nóng, đỏ, đau; sốt; bạch cầu, CRP.", ref: "tr. 15" }],
  reassessment: [{ text: "Có kháng sinh đồ: điều chỉnh.", ref: "tr. 15" }],
  safety: [],
});

/* v8-97: phac do tu 2 van ban (QĐ 315 va QĐ 708) – ref ghi ro van ban */
const UTI_PREG = ov("QĐ 315/QĐ-BYT (29/01/2015) – Sốt trong khi có thai; QĐ 708/QĐ-BYT (02/03/2015) – Viêm bàng quang cấp", [
  { label: "Hình thái", points: [
    { text: "Viêm bàng quang: đái buốt, đái rắt, đau sau mu.", ref: "QĐ 315 tr. 73" },
    { text: "Viêm thận – bể thận cấp: sốt cao rét run, đau thắt lưng; cấy nước tiểu, siêu âm.", ref: "QĐ 315 tr. 74" },
  ] },
  { label: "Khởi trị", points: [
    { text: "Viêm bàng quang: amoxicilin (QĐ 315); cephalexin, nitrofurantoin, amoxicilin-clavulanat (QĐ 708).", ref: "QĐ 315 tr. 73; QĐ 708 tr. 249" },
    { text: "Viêm thận – bể thận: ampicilin-sulbactam + metronidazol, theo kháng sinh đồ.", ref: "QĐ 315 tr. 74" },
  ] },
  { label: "Tránh dùng", points: [
    { text: "Fluoroquinolon, sulfamid chống chỉ định ở phụ nữ có thai.", ref: "QĐ 708 tr. 250" },
  ] },
  { label: "Thời gian", points: [
    { text: "Viêm bàng quang 5–7 ngày; viêm thận – bể thận: tiêm đến hết sốt 48 giờ, rồi uống 12 ngày.", ref: "QĐ 315 tr. 73–74; QĐ 708 tr. 249" },
  ] },
], [], {
  efficacy: [{ text: "Sốt, triệu chứng tiết niệu; tình trạng thai.", ref: "QĐ 315 tr. 74" }],
  reassessment: [{ text: "Cấy dương tính: chọn theo kháng sinh đồ nhưng vẫn tránh thuốc chống chỉ định khi có thai.", ref: "QĐ 708 tr. 249" }],
  safety: [{ text: "Viêm bàng quang tái phát: có thể điều trị tiếp đến khi đẻ.", ref: "QĐ 315 tr. 73" }],
});

export const OVERVIEWS_OTHER: Record<string, DiseaseOverviewData> = {
  "v8-97": UTI_PREG,
  "v9-1": FOOT,
  "v8-142": PULM_TB,
  "v8-141": CNS_TB,
  "v8-103": NEONATAL_SEPSIS,
  "v8-96": VULVO,
  "v8-28": BOIL,
  "v8-3": CANDIDEMIA,
  "v8-121": CANDIDEMIA,
  "v8-48": CANDIDA_ABD,
  "v8-122": CANDIDA_ENDO,
  "v8-124": CANDIDA_BONE,
  "v8-50": ASPERGILLUS,
  "v8-126": ASP_SINUS,
  "v8-117": HEME,
  "v8-51": CRYPTO,
  "v8-128": CRYPTO,
  "v8-52": MUCOR,
  "v8-129": HISTO,
  "v8-130": TALARO,
  "v8-53": PCP,
  "v8-135": TYPHOID,
  "v8-7": SINUSITIS,
  "v8-58": SINUSITIS,
  "v8-54": PHARYNGITIS,
  "v8-8": PHARYNGITIS,
  "v8-60": OTITIS,
  "v8-99": OTITIS,
  "v8-56": DEEP_NECK,
  "v8-57": DEEP_NECK,
  "v8-66": DEEP_NECK,
};
