/*
  FILE: components/antibiotics/empiric/DtrPseudomonasIdsa2026.tsx

  P. aeruginosa DTR theo IDSA 2026 Guidance on the Treatment of
  Antimicrobial-Resistant Gram-Negative Infections (Section 4; Table 1, v5.0).
  Cong bo 30/07/2026, cap nhat den 01/03/2026. doi:10.1093/cid/ciag481.
  Doc tu idsociety.org ngay 25/10/2026. Lieu = Table 1, nguoi lon, chuc nang
  gan than binh thuong; dich nguyen nghia, khong tu quy doi.
  Nguon quoc te: chua co trong van ban BYT, chua tham dinh BV199.
*/

import DrugActionLinks from "../links/DrugActionLinks";

const IDSA_URL = "https://www.idsociety.org/practice-guideline/amr-guidance/";
const TABLE1_URL =
  "https://www.idsociety.org/globalassets/idsa/practice-guidelines/amr-guidance/5.0/table-1.pdf";

const SITES: { site: string; preferred: string; alternative?: string }[] = [
  {
    site: "Viêm bàng quang không biến chứng (hiếm gặp với DTR)",
    preferred:
      "Một trong: amikacin hoặc tobramycin liều duy nhất; cefiderocol; ceftazidim-avibactam; ceftolozan-tazobactam; imipenem-relebactam; hoặc colistin.",
  },
  {
    site: "Nhiễm khuẩn tiết niệu phức tạp / viêm thận – bể thận",
    preferred:
      "Ưu tiên: cefiderocol, ceftazidim-avibactam, ceftolozan-tazobactam hoặc imipenem-relebactam.",
    alternative: "Thay thế: amikacin hoặc tobramycin 1 lần/ngày.",
  },
  {
    site: "Nhiễm khuẩn ngoài đường tiết niệu (kể cả viêm phổi)",
    preferred:
      "Ưu tiên: ceftazidim-avibactam, ceftolozan-tazobactam hoặc imipenem-relebactam. Với viêm phổi do DTR, ceftolozan-tazobactam là lựa chọn ưu tiên.",
    alternative: "Thay thế: cefiderocol.",
  },
];

const DOSES: { drug: string; dose: string }[] = [
  {
    drug: "Ceftolozan-tazobactam",
    dose: "Viêm bàng quang không biến chứng: 1,5 g (1 g ceftolozan + 0,5 g tazobactam) TM mỗi 8 giờ, truyền trong 1 giờ. Các nhiễm khuẩn khác: 3 g (2 g ceftolozan + 1 g tazobactam) TM mỗi 8 giờ, truyền trong 3 giờ.",
  },
  {
    drug: "Ceftazidim-avibactam",
    dose: "2,5 g (2 g ceftazidim + 0,5 g avibactam) TM mỗi 8 giờ, truyền trong 3 giờ.",
  },
  {
    drug: "Imipenem-cilastatin-relebactam",
    dose: "1,25 g (500 mg imipenem + 500 mg cilastatin + 250 mg relebactam) TM mỗi 6 giờ, truyền trong 30 phút.",
  },
  {
    drug: "Cefiderocol",
    dose: "2 g TM mỗi 8 giờ, truyền trong 3 giờ.",
  },
  {
    drug: "Amikacin",
    dose: "Viêm bàng quang không biến chứng: 15 mg/kg TM liều duy nhất. NKTN phức tạp: 15 mg/kg TM một lần; liều và khoảng cách liều tiếp theo dựa trên đánh giá dược động học.",
  },
  {
    drug: "Tobramycin",
    dose: "Viêm bàng quang không biến chứng: 5 mg/kg/liều TM liều duy nhất. NKTN phức tạp: 7 mg/kg TM một lần; liều và khoảng cách liều tiếp theo dựa trên đánh giá dược động học.",
  },
  {
    drug: "Colistin / polymyxin B",
    dose: "IDSA không ghi liều trong Table 1; tham khảo đồng thuận quốc tế về polymyxin (Tsuji BT và cs., Pharmacotherapy 2019;39:10–39).",
  },
];

const PRINCIPLES: string[] = [
  "Định nghĩa DTR: chủng không nhạy với TẤT CẢ các thuốc aztreonam, cefepim, ceftazidim, ciprofloxacin, imipenem, levofloxacin, meropenem và piperacilin-tazobactam.",
  "Không khuyến cáo phối hợp kháng sinh khi đã xác nhận chủng nhạy với một thuốc có tác dụng. Chỉ cân nhắc thêm tobramycin vào một beta-lactam mới khi không có beta-lactam nào có tác dụng in vitro. Không dùng đơn trị aminoglycosid cho nhiễm khuẩn ngoài đường tiết niệu.",
  "Polymyxin B được ưu tiên hơn colistin vì dùng ở dạng có hoạt tính. Riêng đường tiết niệu, colistin (không phải polymyxin B) chuyển thành dạng hoạt tính trong đường tiết niệu.",
  "Cefiderocol: nên dành cho các nhiễm khuẩn kháng thuốc khác; được ưu tiên cho chủng sinh metallo-beta-lactamase (MBL). Không dùng ceftolozan-tazobactam cho chủng sinh KPC, vì tazobactam không ức chế KPC.",
  "Chủng DTR có thể ít nhạy với imipenem-relebactam hơn so với ceftolozan-tazobactam và ceftazidim-avibactam. Đã ghi nhận xuất hiện kháng thuốc trong quá trình điều trị bằng ceftazidim-avibactam hoặc ceftolozan-tazobactam.",
  "Không khuyến cáo dùng thường quy kháng sinh khí dung cho viêm phổi do DTR khi đã có beta-lactam toàn thân còn nhạy.",
];

const box = {
  border: "1px solid #dbe6ed",
  borderRadius: 9,
  padding: 12,
  background: "#fff",
} as const;

export default function DtrPseudomonasIdsa2026() {
  return (
    <div style={{ display: "grid", gap: 12, fontSize: 13, lineHeight: 1.65 }}>
      <p className="bv199-muted" style={{ margin: 0 }}>
        IDSA 2026 Guidance on the Treatment of Antimicrobial-Resistant
        Gram-Negative Infections, mục 4: P. aeruginosa DTR. Công bố 30/07/2026
        (thay bản 4.0 ngày 07/08/2024). Đây là nguồn quốc tế, không có trong
        văn bản BYT và chưa được BV199 thẩm định.
      </p>

      <div className="bv199-warning">
        Chỉ áp dụng khi kháng sinh đồ xác nhận chủng là DTR và thuốc được chọn
        còn nhạy. Thuốc mới cần được làm kháng sinh đồ riêng. Kiểm tra thuốc có
        trong danh mục BV199 hay không trước khi lựa chọn.
      </div>

      <div style={box}>
        <strong>Lựa chọn theo vị trí nhiễm khuẩn</strong>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          {SITES.map((row) => (
            <li key={row.site} style={{ marginBottom: 6 }}>
              <strong>{row.site}:</strong> {row.preferred}
              {row.alternative ? ` ${row.alternative}` : ""}
            </li>
          ))}
        </ul>
      </div>

      <div style={box}>
        <strong>
          Liều người lớn (IDSA 2026, Table 1 – giả định chức năng gan, thận bình
          thường)
        </strong>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          {DOSES.map((row) => (
            <li key={row.drug} style={{ marginBottom: 6 }}>
              <strong>{row.drug}:</strong> {row.dose}
            </li>
          ))}
        </ul>
        <DrugActionLinks
          compact
          texts={DOSES.map((row) => `${row.drug}: ${row.dose}`)}
          scenario="P. aeruginosa DTR – IDSA 2026"
        />
        <p className="bv199-muted" style={{ margin: "8px 0 0" }}>
          Các thuốc phối hợp mới (ceftolozan-tazobactam, ceftazidim-avibactam,
          imipenem-relebactam, cefiderocol) chưa có dữ liệu trong module Hiệu
          chỉnh liều nên không có nút liên kết.
        </p>
        <p className="bv199-muted" style={{ margin: "8px 0 0" }}>
          Theo IDSA, liều gợi ý của một số thuốc có thể khác liều FDA khuyến
          cáo, và bảng không có liều trẻ em. Bệnh nhân suy thận cần hiệu chỉnh
          liều theo tờ thông tin sản phẩm hoặc hỏi dược sĩ lâm sàng.
        </p>
      </div>

      <div style={box}>
        <strong>Nguyên tắc chính</strong>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          {PRINCIPLES.map((text) => (
            <li key={text} style={{ marginBottom: 6 }}>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <a href={IDSA_URL} target="_blank" rel="noopener noreferrer">
          Xem IDSA AMR Guidance 2026
        </a>
        {" · "}
        <a href={TABLE1_URL} target="_blank" rel="noopener noreferrer">
          Table 1 – liều dùng
        </a>
      </div>
    </div>
  );
}
