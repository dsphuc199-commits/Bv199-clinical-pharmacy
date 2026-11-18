/* Tổng quan theo vị trí nhiễm khuẩn: tác nhân, chẩn đoán, giải quyết nguyên nhân. Nội dung chép từ nguồn. */
export type UtiBrief = { label: string; points: string[] };

export const UTI_BRIEFS: Record<string, UtiBrief[]> = {
  "Viêm thận bể thận cấp": [
    { label: "Tác nhân thường gặp", points: [
      "Vi khuẩn Gram-âm: thường gặp nhất là E. coli (70 - 80%), Klebsiella, Proteus mirabilis, Enterobacter...",
      "Vi khuẩn Gram-dương: ít gặp, dưới 10%: Enterococcus, Staphylococcus...",
    ] },
    { label: "Chẩn đoán và xét nghiệm", points: [
      "Cấy vi khuẩn niệu (+) ≥ 100 000 vi khuẩn/ml nước tiểu (giữa dòng), cũng có khi (-).",
      "Cấy máu cấp: nếu sốt cao > 39 - 40 °C kèm theo rét run.",
      "Xét nghiệm đánh giá chức năng thận (mức lọc cầu thận) để giúp điều chỉnh liều kháng sinh phù hợp.",
      "Siêu âm: phát hiện dễ dàng các dấu hiệu giãn đài bể thận, giãn niệu quản, hình ảnh sỏi thận - tiết niệu, khối u chèn ép...",
    ] },
  ],
  "Viêm bàng quang cấp": [
    { label: "Tác nhân thường gặp", points: [
      "Escherichia coli: 70 - 80% số người bệnh.",
      "Proteus mirabilis: 10 - 15% số người bệnh.",
      "Klebsiella: 5 - 10% số người bệnh.",
      "Staphylococcus saprophyticus: 5 - 10% số người bệnh.",
      "Pseudomonas aeruginosa: 1 - 2% số người bệnh.",
      "Staphylococcus aureus: 1 - 2% số người bệnh.",
    ] },
    { label: "Chẩn đoán và xét nghiệm", points: [
      "Có hội chứng bàng quang rõ với đái buốt, đái rắt, có thể đái máu, đái mủ cuối bãi.",
      "Thường không sốt hoặc chỉ sốt nhẹ (nhiệt độ < 38 °C).",
      "Chỉ cần cấy nước tiểu khi có nguyên nhân thuận lợi, điều trị thông thường không đáp ứng, tái phát hoặc nam giới.",
    ] },
    { label: "Nguyên nhân thuận lợi", points: [
      "Phì đại lành tính hoặc u tuyến tiền liệt.",
      "Sỏi, u bàng quang.",
      "Hẹp niệu đạo, hẹp bao qui đầu.",
      "Đái tháo đường.",
      "Có thai.",
      "Đặt sonde dẫn lưu bàng quang hoặc can thiệp bàng quang, niệu đạo.",
    ] },
  ],
  "Viêm niệu đạo cấp không do lậu": [
    { label: "Tác nhân thường gặp", points: [
      "Chlamydia trachomatis, Mycoplasma, Trichomonas vaginalis, Candida albicans, Herpes simplex virus, Streptococcus, Staphylococcus saprophyticus, Escherichia coli.",
    ] },
    { label: "Chẩn đoán và xét nghiệm", points: [
      "Soi dịch niệu đạo: nhiều bạch cầu, có thể thấy vi khuẩn, nấm.",
      "Cấy dịch niệu đạo hoặc nước tiểu đầu bãi: có vi khuẩn, nấm.",
    ] },
  ],
  "Sỏi thận tiết niệu nhiễm trùng": [
    { label: "Tác nhân thường gặp", points: [
      "Cấy vi khuẩn niệu (+) khi có nhiễm khuẩn. Thường gặp E. coli, Proteus, Klebsiella…",
    ] },
    { label: "Chẩn đoán và xét nghiệm", points: [
      "Siêu âm: phát hiện được sỏi cản quang và không cản quang ở vị trí nhu mô thận, đài bể thận, niệu quản 1/3 trên và 1/3 dưới. Phát hiện được tình trạng sỏi gây tắc nghẽn, thận to (hình ảnh ứ nước, ứ mủ bể thận, niệu quản giãn, máu cục bể thận…).",
      "Chụp UIV: không thực hiện khi đang nhiễm khuẩn nặng, hoặc khi có suy thận cấp.",
      "Chụp cắt lớp vi tính CT: phân biệt sỏi gây nhiễm khuẩn áp xe nhu mô thận, bể thận hay khối u thận tiết niệu.",
      "Cấy máu: nếu sốt cao > 38 °C kèm rét run, thường gặp vi khuẩn Gram-âm như E. coli hoặc Gram-dương.",
    ] },
    { label: "Giải phóng tắc nghẽn do sỏi", points: [
      "Tán ngoài cơ thể: sỏi < 2 cm ở bể thận, đoạn đầu và cuối niệu quản.",
      "Tán sỏi nội soi qua da: nhiều sỏi bể thận.",
      "Tán sỏi nội soi laser: qua đường nội soi bàng quang - niệu quản và bể thận.",
      "Lấy sỏi nội soi: sỏi nhỏ ở niệu quản đoạn dưới, ở bàng quang, ở niệu đạo.",
      "Mổ lấy sỏi: chỉ mổ mở khi sỏi to hoặc sỏi san hô bể thận.",
      "Điều trị suy thận cấp: nếu vô niệu cần lọc máu cấp cứu, không trì hoãn khi kali máu ≥ 6,5 mmol/l.",
    ] },
  ],
};
