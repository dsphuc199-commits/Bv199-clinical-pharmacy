/* Thể bệnh nhiễm khuẩn tiết niệu. Nội dung chép từ nguồn; trường không có trong nguồn = null. */
import type { Condition } from "./types";

const PYELO = "Viêm thận bể thận cấp";
const CYSTITIS = "Viêm bàng quang cấp";
const URETHRITIS = "Viêm niệu đạo cấp không do lậu";
const STONE = "Sỏi thận tiết niệu nhiễm trùng";
const GENERAL = "Người bệnh chung";
const ONE_OF = "Chọn một trong các thuốc";

const c = (o: Partial<Condition> & Pick<Condition, "id" | "name" | "nameEn" | "group" | "form">): Condition => ({
  classification: null, severity: null, population: GENERAL, choiceRule: ONE_OF, notes: [], noSpecificRegimen: false, ...o,
});

const PYELO_CULTURE = "Cần cấy vi khuẩn niệu, máu (nếu có sốt cao) trước khi bắt đầu dùng kháng sinh. Trong khi chờ đợi kết quả cấy vi khuẩn có thể bắt đầu dùng kháng sinh ngay.";
const PYELO_ADJUST = "Nếu sau 3 - 5 ngày điều trị, triệu chứng lâm sàng không đỡ cần điều chỉnh kháng sinh theo kết quả cấy vi khuẩn và kháng sinh đồ.";
const PYELO_FAIL = "Nếu vẫn sốt, vi khuẩn niệu tồn tại 48 giờ đến 72 giờ, hoặc tiếp tục có dấu hiệu nhiễm khuẩn sau 3 ngày điều trị, cần tìm kiếm tắc nghẽn, ổ nhiễm khuẩn lan rộng hoặc hình thành ổ áp xe thận.";
const PYELO_DRAIN = "Siêu âm, chụp cắt lớp (CT) thận có thể phát hiện được vị trí tắc nghẽn và ổ áp xe quanh thận để có chỉ định ngoại khoa dẫn lưu.";
const PYELO_FLUID = "Bù đủ dịch bằng đường uống và/hoặc đường truyền tĩnh mạch, đảm bảo lượng nước tiểu > 50 ml/giờ.";
const PYELO_RETREAT = "Nếu không có bất thường ở hệ tiết niệu: điều trị lại bằng kháng sinh khác phối hợp trong 2 tuần.";
const PYELO_RELAPSE = "Nếu người bệnh tái phát với vi khuẩn cùng loại: tiếp tục điều trị trong 6 tuần.";
const CYSTITIS_WATER = "Nên uống đủ nước để lượng nước tiểu ít nhất đạt > 1,5 lít/24 giờ. Không nhịn tiểu quá 6 giờ.";
const BL_ALLERGY = "Nhóm beta-lactam: thuốc có khả năng gây sốc phản vệ nên chống chỉ định khi có tiền sử dị ứng với penicilin hoặc các thuốc trong nhóm. Giảm liều khi mức lọc cầu thận < 30 ml/phút đối với những sản phẩm có acid clavulanic và sulbactam.";
const SULFA = "Nhóm sulfamid: thuốc ít có tác dụng phụ. Đôi khi có phản ứng dị ứng nặng kiểu hội chứng Stevens-Johnson, giảm bạch cầu hạt. Chống chỉ định dùng thuốc khi có suy gan, suy thận nặng, phụ nữ có thai, quá mẫn cảm với thuốc.";
const FQ = "Nhóm fluoroquinolon: không dùng nhóm quinolon cho phụ nữ có thai, cho con bú, trẻ em dưới 15 tuổi, người có tiền sử co giật và có tiền sử dị ứng với thuốc.";
const FQ_STONE = "Fluoroquinolon có thể gây ra rối loạn tiêu hóa như nôn, buồn nôn và không được dùng cho phụ nữ có thai, trẻ em dưới 15 tuổi.";

export const CONDITIONS: Condition[] = [
  c({ id: "pyelo-oral", name: "Viêm thận bể thận cấp không biến chứng, triệu chứng không nặng", nameEn: "uncomplicated acute pyelonephritis", group: PYELO, form: "Không biến chứng, triệu chứng không nặng – đường uống", classification: "Không biến chứng", severity: "Triệu chứng không nặng",
    notes: [PYELO_CULTURE, PYELO_ADJUST, "Kết hợp giảm đau chống co thắt: drotaverin, hyoscin, metamizol.", "Uống nhiều nước hoặc truyền dịch đủ để đảm bảo lượng nước tiểu nhiều ≥ 1500 - 2000 ml/24 giờ.", "Nếu tình trạng lâm sàng không tiến triển tốt (hội chứng nhiễm khuẩn rõ, vẫn sốt, tiểu đục, đau, mất nước...) nên chuyển vào điều trị nội trú hoặc lên tuyến trên."] }),
  c({ id: "pyelo-iv", name: "Viêm thận bể thận cấp – điều trị kháng sinh đường tiêm", nameEn: "acute pyelonephritis, parenteral therapy", group: PYELO, form: "Kháng sinh đường tiêm",
    notes: ["Nếu sốt cao rét run cần điều trị nội trú.", PYELO_CULTURE, PYELO_ADJUST, PYELO_FAIL, PYELO_DRAIN, PYELO_FLUID, PYELO_RETREAT, PYELO_RELAPSE] }),
  c({ id: "pyelo-gram-neg", name: "Viêm thận bể thận cấp – cấy nước tiểu có trực khuẩn Gram âm", nameEn: "Gram-negative bacilli on urine culture", group: PYELO, form: "Cấy nước tiểu có trực khuẩn Gram âm", notes: [PYELO_ADJUST, PYELO_FAIL, PYELO_DRAIN] }),
  c({ id: "pyelo-gram-pos", name: "Viêm thận bể thận cấp – cấy nước tiểu có vi khuẩn Gram dương", nameEn: "Gram-positive bacteria on urine culture", group: PYELO, form: "Cấy nước tiểu có vi khuẩn Gram dương", choiceRule: null, notes: [PYELO_ADJUST, PYELO_FAIL, PYELO_DRAIN] }),
  c({ id: "pyelo-pregnancy", name: "Viêm thận bể thận cấp ở người có thai", nameEn: "acute pyelonephritis in pregnancy", group: PYELO, form: "Người có thai", population: "Phụ nữ có thai", choiceRule: null,
    notes: ["Thường gặp ở 3 tháng cuối.", "Thận trọng khi sử dụng thuốc kháng sinh.", "Fluoroquinolon không được dùng cho phụ nữ có thai."] }),
  c({ id: "pyelo-recurrent", name: "Viêm thận bể thận cấp tái phát nhiều lần", nameEn: "recurrent acute pyelonephritis", group: PYELO, form: "Tái phát nhiều lần", choiceRule: null, noSpecificRegimen: true,
    notes: ["Mỗi lần tái phát sẽ làm biến dạng đài thận, tái phát nhiều lần sẽ gây xơ hóa và teo nhu mô thận.", "Nên điều trị kháng sinh kéo dài để dự phòng tái phát và tìm nguyên nhân."] }),
  c({ id: "pyelo-anuria", name: "Viêm thận bể thận cấp vô niệu", nameEn: "acute pyelonephritis with anuria", group: PYELO, form: "Vô niệu", choiceRule: null, noSpecificRegimen: true,
    notes: ["Có thể do tắc nghẽn ở thận duy nhất có chức năng hoạt động hoặc do sốc nhiễm khuẩn.", "Cả hai trường hợp đều rất nặng và tiên lượng tử vong cao.", "Giải quyết nguyên nhân tắc nghẽn là chỉ định cấp cứu."] }),

  c({ id: "cystitis-common", name: "Viêm bàng quang cấp thể thông thường", nameEn: "acute cystitis", group: CYSTITIS, form: "Viêm bàng quang cấp", population: "Thể thông thường", notes: [CYSTITIS_WATER, BL_ALLERGY, SULFA, FQ] }),
  c({ id: "cystitis-pregnancy", name: "Viêm bàng quang cấp ở phụ nữ có thai", nameEn: "acute cystitis in pregnancy", group: CYSTITIS, form: "Viêm bàng quang cấp", population: "Phụ nữ có thai", notes: [CYSTITIS_WATER, BL_ALLERGY, FQ] }),
  c({ id: "cystitis-male", name: "Viêm bàng quang cấp ở nam giới", nameEn: "acute cystitis in men", group: CYSTITIS, form: "Viêm bàng quang cấp", population: "Nam giới",
    notes: ["Điều quan trọng là cần tìm nguyên nhân liên quan như viêm tuyến tiền liệt, viêm tinh hoàn, mào tinh hoàn… để có lựa chọn kháng sinh và thời gian điều trị cho thích hợp.", "Khi chưa rõ có nguyên nhân liên quan, thời gian dùng thuốc cũng nên kéo dài hơn.", CYSTITIS_WATER, BL_ALLERGY, SULFA, FQ] }),
  c({ id: "cystitis-predisposed", name: "Viêm bàng quang cấp có nguyên nhân thuận lợi", nameEn: "acute cystitis with predisposing factors", group: CYSTITIS, form: "Có nguyên nhân thuận lợi", choiceRule: null, noSpecificRegimen: true,
    notes: ["Loại bỏ các nguyên nhân gây tắc đường bài niệu.", "Thời gian dùng kháng sinh nên kéo dài từ 7 - 10 ngày.", CYSTITIS_WATER] }),

  c({ id: "urethritis-chlamydia", name: "Viêm niệu đạo cấp do Chlamydia", nameEn: "Chlamydia urethritis", group: URETHRITIS, form: "Chlamydia", notes: ["Điều trị cho cả người cùng quan hệ tình dục và người bệnh."] }),
  c({ id: "urethritis-trichomonas", name: "Viêm niệu đạo cấp do Trichomonas", nameEn: "Trichomonas urethritis", group: URETHRITIS, form: "Trichomonas", choiceRule: null, notes: ["Điều trị cho cả người cùng quan hệ tình dục và người bệnh."] }),
  c({ id: "urethritis-fungal", name: "Viêm niệu đạo cấp do nấm", nameEn: "fungal urethritis", group: URETHRITIS, form: "Nấm", notes: ["Các thuốc chống nấm hiếm khi gây dị ứng. Tác dụng độc với gan, thận đã được ghi nhận. Vì vậy cần theo dõi chức năng gan, thận khi dùng thuốc."] }),
  c({ id: "urethritis-bacterial", name: "Viêm niệu đạo cấp do các vi khuẩn thông thường", nameEn: "bacterial urethritis", group: URETHRITIS, form: "Vi khuẩn thông thường", choiceRule: null, notes: ["Cần giữ vệ sinh bộ phận sinh dục ngoài và điều trị phối hợp viêm âm đạo."] }),

  c({ id: "stone-uti-oral", name: "Sỏi thận tiết niệu có nhiễm khuẩn tiết niệu (tiểu buốt, rắt, có thể đục)", nameEn: "urinary stones with urinary tract infection", group: STONE, form: "Tiểu buốt, rắt, có thể đục", notes: ["Trimethoprim - sulfamethoxazol: lưu ý phản ứng dị ứng chậm."] }),
  c({ id: "stone-complicated", name: "Sỏi thận tiết niệu nhiễm trùng có biến chứng", nameEn: "complicated infected urinary stones", group: STONE, form: "Có biến chứng", classification: "Có biến chứng", notes: [FQ_STONE] }),
  c({ id: "stone-pyelo", name: "Sỏi thận tiết niệu có viêm thận bể thận cấp", nameEn: "urinary stones with acute pyelonephritis", group: STONE, form: "Có viêm thận bể thận cấp", classification: "Có biến chứng",
    notes: ["Biểu hiện: sốt cao rét run, bạch cầu máu cao, tiểu buốt rắt đục, đau hố thận, cấy vi khuẩn máu và niệu dương tính.", PYELO_FAIL, PYELO_DRAIN] }),
];
