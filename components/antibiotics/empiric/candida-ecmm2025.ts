/*
  Nhiem Candida xam lan – du lieu cong cu theo ECMM/ISHAM/ASM 2025.
  Nguon: Cornely OA et al. Global guideline for the diagnosis and management of candidiasis: an initiative of the ECMM
  in cooperation with ISHAM and ASM. Lancet Infect Dis 2025;25:e280–93 (CC BY 4.0). Doc tu PDF nguoi dung cung cap.
  Muc khuyen cao: ECMM-S manh, ECMM-M vua, ECMM-W yeu (marginally), ECMM-X khuyen cao khong dung.
  Phu luc (abdominal, bone and joint, tre em, lieu chi tiet) chua co -> chi dua noi dung trong bai chinh.
  Diem bat thuong da xu ly: Figure 3 ghi voriconazole "6 mg/g" -> dung "6 mg/kg" nhu Figure 2 va Figure 4.
*/
import type { RxItem } from "./septic-arthritis-pids2023";

export type CandidaBlock = { title: string; lead?: string; items: RxItem[] };
export type CandidaForm = { id: string; label: string; criteria: string; headline: string; blocks: CandidaBlock[]; avoid: RxItem[]; notes: string[] };

const S = "ECMM-S", M = "ECMM-M", W = "ECMM-W", X = "ECMM-X";
const r = (role: string, text: string, dose: string | undefined, grade: string | undefined, ref: string): RxItem => ({ role, text, dose, grade, ref });

const FIRST = "Đầu tay";
const ALT = "Thay thế";
const DO = "Thực hiện";

const VORI = "6 mg/kg × 2 lần ngày 1; 4 mg/kg × 2 lần/ngày từ ngày 2";
const ISAVU = "200 mg × 3 lần/ngày ngày 1–2; 200 mg/ngày từ ngày 3";

const ECHINO: RxItem[] = [
  r(FIRST, "Anidulafungin", "200 mg ngày 1; 100 mg/ngày từ ngày 2", S, "Figure 2"),
  r(FIRST, "Caspofungin", "70 mg ngày 1; 50 mg/ngày từ ngày 2", S, "Figure 2"),
  r(FIRST, "Micafungin", "100 mg/ngày", S, "Figure 2"),
  r(FIRST, "Rezafungin", "400 mg 1 lần/tuần tuần 1; 200 mg/tuần từ tuần 2", S, "Figure 2"),
];

const CANDIDAEMIA_STEPS: RxItem[] = [
  r(DO, "Rút catheter tĩnh mạch trung tâm càng sớm càng tốt (trong 48–72 giờ) nếu rút an toàn.", undefined, S, "Figure 2; Source control"),
  r(DO, "Cấy máu hằng ngày đến khi có 3 ngày liên tiếp âm tính.", undefined, undefined, "Figure 2"),
  r(DO, "Cấy máu ngày 5 còn dương tính: tìm lại ổ nhiễm trong lòng mạch hoặc ổ chưa kiểm soát.", undefined, undefined, "Figure 2"),
  r("Thời gian", "14 ngày tính từ ngày đầu tiên cấy máu âm tính liên tục, khi không có ổ sâu hoặc ổ di bệnh.", undefined, undefined, "First-line treatment"),
  r("Soi đáy mắt", "Khi có triệu chứng mắt, nấm huyết kéo dài, suy giảm miễn dịch hoặc người bệnh không tự mô tả được triệu chứng.", undefined, S, "Figure 1"),
  r("Siêu âm tim", "Khi nghi viêm nội tâm mạc (tổn thương da, tiếng thổi mới), nấm huyết kéo dài, có bệnh van tim hoặc thiết bị tim cấy ghép.", undefined, S, "Figure 1"),
  r("Kháng nấm đồ", "Làm cho mọi nhiễm nấm xâm lấn, theo EUCAST hoặc CLSI.", undefined, S, "Susceptibility testing"),
  r("Hội chẩn", "Hội chẩn chuyên gia bệnh nhiễm hoặc vi sinh lâm sàng cho mọi ca nấm huyết, nhiễm nấm xâm lấn.", undefined, S, "Infection specialist consultation"),
];

const ORAL_SWITCH: CandidaBlock = {
  title: "Chuyển đường uống",
  lead: "Sau ít nhất 5 ngày echinocandin, khi đủ 6 điều kiện: huyết động ổn định; máu đã sạch Candida; không giảm bạch cầu trung tính; đã kiểm soát ổ nhiễm (rút catheter); dung nạp azol đường uống; chủng nhạy với azol chọn.",
  items: [
    r("Chuyển uống", "Fluconazol", "400–800 mg/ngày", M, "Switch to oral treatment; Figure 2"),
    r("Chuyển uống", "Voriconazol", VORI, M, "Switch to oral treatment; Figure 2"),
  ],
};

const COMMON_NOTES = [
  "Chọn echinocandin theo dược động học từng người bệnh (suy gan, cân nặng cao, tương tác thuốc, ECMO), chi phí và quy định bệnh viện; phổ tác dụng các echinocandin như nhau.",
  "Theo dõi nồng độ thuốc (nếu có): cân nhắc cho triazol và echinocandin ở người bệnh nặng, tuần hoàn ngoài cơ thể, giảm albumin máu nặng, kém hấp thu, tương tác thuốc, béo phì nặng. Echinocandin: nồng độ đáy trên 1 mg/L.",
  "Xem lại phác đồ theo dịch tễ tại chỗ (C. glabrata, C. auris, C. parapsilosis kháng fluconazol) và kết quả kháng nấm đồ.",
];

const CANDIDAEMIA: CandidaForm = {
  id: "candidaemia",
  label: "Nấm huyết",
  criteria: "Cấy máu có Candida, chưa có tổn thương cơ quan.",
  headline: "Echinocandin: anidulafungin, caspofungin, micafungin hoặc rezafungin",
  blocks: [
    { title: "Lựa chọn đầu tay – chọn một", items: ECHINO },
    { title: "Không dùng được echinocandin", lead: "Không có echinocandin, hoặc người bệnh đã mang hay nhiễm chủng kháng echinocandin. Lưu ý kháng fluconazol tăng.", items: [
      r(ALT, "Amphotericin B liposome", "3 mg/kg/ngày", M, "Figure 2"),
      r(ALT, "Fluconazol", "400–800 mg/ngày", M, "Figure 2"),
      r(ALT, "Voriconazol", VORI, M, "Figure 2"),
      r(ALT, "Amphotericin B phức hợp lipid", "5 mg/kg/ngày", W, "Figure 2"),
      r(ALT, "Isavuconazol", ISAVU, W, "Figure 2"),
    ] },
    { title: "Xử trí kèm theo", items: CANDIDAEMIA_STEPS },
    ORAL_SWITCH,
    { title: "Bậc hai, cứu vãn – đổi nhóm thuốc", lead: "Kháng thuốc đã biết hoặc nghi ngờ, thất bại điều trị, không dung nạp echinocandin. Chuyển fluconazol uống ngay khi có thể.", items: [
      r(ALT, "Amphotericin B liposome", "3–5 mg/kg/ngày", S, "Figure 2; Second-line"),
      r(ALT, "Voriconazol", VORI, M, "Figure 2"),
      r(ALT, "Fluconazol", "400–800 mg/ngày", W, "Figure 2"),
      r(ALT, "Isavuconazol", ISAVU, W, "Figure 2"),
    ] },
  ],
  avoid: [
    r("Không khuyến cáo", "Amphotericin B deoxycholat", "Mọi liều", X, "Figure 2"),
    r("Không khuyến cáo", "Itraconazol", "200–400 mg/ngày", X, "Figure 2"),
    r("Tránh khi có lựa chọn khác", "Amphotericin B dạng phân tán keo, posaconazol", undefined, undefined, "First-line treatment"),
  ],
  notes: COMMON_NOTES,
};

const EMPIRIC: CandidaForm = {
  id: "empiric",
  label: "Kinh nghiệm",
  criteria: "Chưa có kết quả cấy, nghi nhiễm Candida xâm lấn.",
  headline: "Echinocandin khi sốc nhiễm khuẩn hoặc tình trạng xấu đi kèm yếu tố nguy cơ",
  blocks: [
    { title: "Chỉ định", items: [
      r("Khuyến cáo", "Điều trị kinh nghiệm khi sốc nhiễm khuẩn, hoặc tình trạng xấu đi kèm yếu tố nguy cơ nấm huyết: nằm hồi sức kéo dài, catheter mạch máu, khu trú Candida.", undefined, M, "Fever-driven treatment"),
      r("Thuốc", "Echinocandin cho người bệnh sốc nhiễm khuẩn; chọn thuốc như điều trị đầu tay nấm huyết.", undefined, undefined, "Fever-driven treatment"),
      r("Ngừng điều trị", "Có thể dùng beta-D-glucan để ngừng thuốc kháng nấm kinh nghiệm.", undefined, M, "Diagnostic-driven treatment"),
    ] },
    { title: "Echinocandin – chọn một", items: ECHINO },
  ],
  avoid: [
    r("Không khuyến cáo", "Điều trị kháng nấm chỉ vì sốt, kể cả ở hồi sức", undefined, X, "Fever-driven treatment"),
    r("Không dùng làm căn cứ duy nhất", "Beta-D-glucan dương tính đơn độc để bắt đầu điều trị", undefined, undefined, "Biomarkers and serology"),
  ],
  notes: ["Chưa đủ dữ liệu để bắt đầu điều trị sớm chỉ dựa vào dấu ấn sinh học hoặc xét nghiệm sinh học phân tử.", ...COMMON_NOTES],
};

const NEUTROPENIA: CandidaForm = {
  id: "neutropenia",
  label: "Giảm bạch cầu trung tính",
  criteria: "Nấm huyết ở người bệnh giảm bạch cầu trung tính, ung thư huyết học.",
  headline: "Điều trị như nấm huyết; chưa chuyển azol uống khi còn giảm bạch cầu trung tính",
  blocks: [
    { title: "Lựa chọn đầu tay – chọn một", items: ECHINO },
    { title: "Xử trí kèm theo", items: CANDIDAEMIA_STEPS },
    { title: "Dự phòng", items: [
      r("Bạch cầu cấp dòng tủy, rối loạn sinh tủy, hóa trị tấn công", "Azol là lựa chọn đầu tiên.", undefined, undefined, "Prophylaxis in neutropenia"),
      r("Dự kiến giảm bạch cầu từ 7 ngày", "Posaconazol hoặc thuốc khác có tác dụng trên nấm mốc.", undefined, undefined, "Prophylaxis in neutropenia"),
      r("Ghép tế bào gốc đồng loại", "Fluconazol từ khi bắt đầu điều kiện hóa đến khi mọc mảnh ghép, thường kéo dài đến ngày 75 sau ghép.", undefined, S, "Prophylaxis in allogeneic HSCT"),
    ] },
  ],
  avoid: CANDIDAEMIA.avoid,
  notes: ["Chuyển azol đường uống chỉ khi không còn giảm bạch cầu trung tính và đủ các điều kiện còn lại.", "Nghi nấm gan lách mạn: chẩn đoán hình ảnh khi giảm bạch cầu kéo dài kèm sốt kéo dài hoặc đau hạ sườn phải.", ...COMMON_NOTES],
};

const ENDOCARDITIS: CandidaForm = {
  id: "endocarditis",
  label: "Viêm nội tâm mạc",
  criteria: "Viêm nội tâm mạc do Candida, kể cả van nhân tạo và thiết bị tim cấy ghép.",
  headline: "Caspofungin hoặc amphotericin B liposome ± flucytosin, kèm phẫu thuật",
  blocks: [
    { title: "Khởi đầu – chọn một", items: [
      r(FIRST, "Caspofungin", "70 mg ngày 1; 50 mg/ngày từ ngày 2", S, "Figure 5"),
      r(FIRST, "Amphotericin B liposome ± flucytosin", "3–5 mg/kg/ngày ± flucytosin 25 mg/kg × 4 lần/ngày", S, "Figure 5"),
      r(ALT, "Anidulafungin", "200 mg ngày 1; 100 mg/ngày từ ngày 2", M, "Figure 5"),
      r(ALT, "Micafungin ± fluconazol", "Micafungin 150 mg/ngày ± fluconazol 400 mg × 1–2 lần/ngày", M, "Figure 5"),
      r(ALT, "Caspofungin liều cao", "70–150 mg/ngày", W, "Figure 5"),
    ] },
    { title: "Van nhân tạo", items: [r(FIRST, "Amphotericin B liposome ± flucytosin", "3–5 mg/kg/ngày ± flucytosin 25 mg/kg × 4 lần/ngày", S, "Figure 5")] },
    { title: "Phẫu thuật, thiết bị", items: [
      r(DO, "Phẫu thuật van trong tuần đầu sau chẩn đoán hoặc sớm hơn.", undefined, S, "Endocarditis"),
      r(DO, "Rút máy tạo nhịp, máy khử rung cấy ghép, thiết bị hỗ trợ tim.", undefined, S, "Endocarditis"),
    ] },
    { title: "Duy trì", items: [
      r("Duy trì", "Fluconazol (chủng nhạy, đủ điều kiện chuyển uống)", "400–800 mg/ngày", S, "Figure 5"),
      r("Thời gian", "Ít nhất 6 tuần sau phẫu thuật, dài hơn khi có biến chứng như áp xe quanh van; điều trị duy trì tối thiểu 12 tuần.", undefined, S, "Endocarditis; Figure 5"),
      r("Không phẫu thuật được", "Không mổ được hoặc không lấy được vật liệu cấy ghép: cân nhắc fluconazol ức chế suốt đời.", "400–800 mg/ngày", undefined, "Figure 5"),
    ] },
  ],
  avoid: [
    r("Không khuyến cáo", "Khởi đầu bằng azol", undefined, undefined, "Endocarditis"),
    r("Hạn chế", "Amphotericin B liposome dưới 3 mg/kg/ngày khi độc thận", undefined, W, "Endocarditis"),
  ],
  notes: ["Phối hợp echinocandin với azol, hoặc amphotericin B liposome với echinocandin: khuyến cáo mức vừa.", ...COMMON_NOTES],
};

const CNS: CandidaForm = {
  id: "cns",
  label: "Thần kinh trung ương",
  criteria: "Nhiễm Candida thần kinh trung ương, kể cả thiết bị thần kinh và áp xe.",
  headline: "Amphotericin B liposome ± flucytosin; không dùng echinocandin",
  blocks: [
    { title: "Khởi đầu", items: [
      r(FIRST, "Amphotericin B liposome ± flucytosin", "3–5 mg/kg/ngày ± flucytosin 37,5 mg/kg × 4 lần/ngày", S, "Figure 3"),
      r(ALT, "Amphotericin B deoxycholat ± flucytosin (chỉ khi không có dạng liposome)", "0,5–1 mg/kg/ngày ± flucytosin 37,5 mg/kg × 4 lần/ngày", M, "Figure 3"),
    ] },
    { title: "Phẫu thuật", items: [
      r(DO, "Lấy bỏ toàn bộ thiết bị nhiễm khuẩn, kèm thuốc kháng nấm tĩnh mạch.", undefined, S, "Figure 3; CNS infection"),
      r(DO, "Áp xe: dẫn lưu hoặc cắt bỏ nếu được.", undefined, S, "Figure 3"),
    ] },
    { title: "Củng cố đường uống", items: [r("Củng cố", "Fluconazol ± flucytosin (chủng nhạy)", "Fluconazol 800 mg/ngày ± flucytosin 37,5 mg/kg × 4 lần/ngày", S, "Figure 3")] },
    { title: "Cứu vãn", items: [
      r(ALT, "Fluconazol ± flucytosin", "Fluconazol 400–800 mg/ngày ± flucytosin 37,5 mg/kg × 4 lần/ngày", M, "Figure 3"),
      r(ALT, "Voriconazol", VORI, M, "Figure 3"),
      r(ALT, "Caspofungin", "70 mg ngày 1; 50 mg/ngày từ ngày 2", W, "Figure 3"),
      r(ALT, "Caspofungin nội tủy, trong não thất", "10 mg/ngày", W, "Figure 3"),
      r(ALT, "Amphotericin B trong não thất", "1 mg mỗi tuần", W, "Figure 3"),
      r("Tăng áp lực nội sọ", "Dẫn lưu não thất hoặc đặt shunt", undefined, W, "Figure 3"),
    ] },
  ],
  avoid: [r("Không khuyến cáo", "Echinocandin làm điều trị khởi đầu", undefined, X, "Figure 3")],
  notes: ["Thời gian: cá thể hóa, ít nhất đến khi hết triệu chứng, dịch não tủy trở về bình thường và hình ảnh cải thiện.", ...COMMON_NOTES],
};

const OCULAR: CandidaForm = {
  id: "ocular",
  label: "Mắt",
  criteria: "Viêm nội nhãn, viêm hắc võng mạc, viêm giác mạc do Candida.",
  headline: "Fluconazol, voriconazol hoặc amphotericin B liposome; bàn sớm cắt dịch kính",
  blocks: [
    { title: "Viêm nội nhãn – chọn một", lead: "Chủng nhạy azol: ưu tiên fluconazol hoặc voriconazol; amphotericin B liposome khi kháng các thuốc khác.", items: [
      r(FIRST, "Fluconazol", "200–400 mg/ngày", S, "Figure 4"),
      r(FIRST, "Amphotericin B liposome", "3 mg/kg/ngày", S, "Figure 4"),
      r(FIRST, "Voriconazol", VORI, S, "Figure 4"),
      r(ALT, "Amphotericin B deoxycholat tiêm nội nhãn", "Liều và thời gian thay đổi theo từng ca", M, "Figure 4"),
      r(DO, "Bàn sớm cắt dịch kính cùng bác sĩ nhãn khoa.", undefined, S, "Figure 4"),
    ] },
    { title: "Thời gian", items: [
      r("Viêm nội nhãn", "Thường 4–6 tuần, cá thể hóa.", undefined, undefined, "Figure 4"),
      r("Viêm hắc võng mạc có triệu chứng thị giác hoặc tổn thương hoàng điểm", "4–6 tuần thuốc toàn thân.", undefined, undefined, "Ocular candidiasis"),
      r("Viêm hắc võng mạc không triệu chứng, không tổn thương hoàng điểm", "2 tuần có thể đủ khi nấm huyết đáp ứng và không có ổ sâu khác; xử trí như nấm huyết.", undefined, undefined, "Ocular candidiasis; Figure 4"),
    ] },
    { title: "Viêm giác mạc", items: [
      r("Tại chỗ", "Azol hoặc polyen tại chỗ (amphotericin B hoặc natamycin).", undefined, undefined, "Ocular candidiasis"),
      r("Toàn thân", "Nếu cần, chọn azol trước.", undefined, undefined, "Ocular candidiasis"),
      r("Tiến triển", "Ghép giác mạc.", undefined, undefined, "Ocular candidiasis"),
    ] },
  ],
  avoid: [r("Tránh", "Echinocandin cho viêm nội nhãn (thấm kém vào buồng sau)", undefined, undefined, "Ocular candidiasis")],
  notes: ["Echinocandin có thể dùng cho viêm hắc võng mạc khu trú không triệu chứng nếu chủng nhạy echinocandin.", ...COMMON_NOTES],
};

const ABDOMINAL: CandidaForm = {
  id: "abdominal",
  label: "Ổ bụng",
  criteria: "Nhiễm Candida ổ bụng, có hoặc không có nấm huyết.",
  headline: "Kiểm soát ổ nhiễm và echinocandin",
  blocks: [
    { title: "Echinocandin – chọn một", lead: "Echinocandin là lựa chọn đầu tay cho mọi thể nhiễm Candida xâm lấn trừ thần kinh trung ương và mắt. Liều theo phác đồ nấm huyết.", items: ECHINO },
    { title: "Xử trí kèm theo", items: [r(DO, "Kiểm soát ổ nhiễm: dẫn lưu, phẫu thuật.", undefined, S, "Source control")] },
    { title: "Dự phòng sau phẫu thuật bụng", lead: "Thủng tiêu hóa tái phát hoặc rò miệng nối sau phẫu thuật bụng gần đây.", items: [
      r("Dự phòng", "Fluconazol", "Nạp 12 mg/kg; sau đó 6 mg/kg × 1 lần/ngày", M, "Prophylaxis in abdominal surgery"),
      r("Dự phòng", "Echinocandin, khi gần đây đã dùng azol hoặc dịch tễ tại chỗ chủ yếu chủng kháng azol", undefined, undefined, "Prophylaxis in abdominal surgery"),
    ] },
  ],
  avoid: [],
  notes: COMMON_NOTES,
};

const BONE: CandidaForm = {
  id: "bone",
  label: "Xương khớp",
  criteria: "Viêm xương tủy, viêm khớp do Candida.",
  headline: "Kiểm soát ổ nhiễm và echinocandin",
  blocks: [
    { title: "Echinocandin – chọn một", lead: "Echinocandin là lựa chọn đầu tay cho mọi thể nhiễm Candida xâm lấn trừ thần kinh trung ương và mắt. Liều theo phác đồ nấm huyết.", items: ECHINO },
    { title: "Xử trí kèm theo", items: [r(DO, "Kiểm soát ổ nhiễm.", undefined, S, "Source control")] },
  ],
  avoid: [],
  notes: COMMON_NOTES,
};

export const CANDIDA_FORMS: CandidaForm[] = [CANDIDAEMIA, EMPIRIC, NEUTROPENIA, ENDOCARDITIS, CNS, OCULAR, ABDOMINAL, BONE];

const INITIAL: Record<string, string> = { "v8-3": "candidaemia", "v8-121": "neutropenia", "v8-122": "endocarditis", "v8-48": "abdominal", "v8-124": "bone" };
export const isCandidaDisease = (diseaseId: string) => diseaseId in INITIAL;
export const initialCandidaForm = (diseaseId: string) => INITIAL[diseaseId] ?? "candidaemia";
