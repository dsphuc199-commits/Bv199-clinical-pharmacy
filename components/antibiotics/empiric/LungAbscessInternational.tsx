/**
 * Supplementary references for routes and conditional clindamycin use:
 * https://medicalguidelines.msf.org/en/viewport/EssDr/english/metronidazole-injectable-16682959.html
 * https://www.merckmanuals.com/professional/pulmonary-disorders/lung-abscess/lung-abscess
 * https://australianprescriber.tg.org.au/articles/aspiration-pneumonia-and-pneumonitis.html
 * https://medicalguidelines.msf.org/sites/default/files/pdf/guideline-339-en.pdf
 */
import ClinicalReferenceDose from "../treatment/ClinicalReferenceDose";
import RegimenDrugTools from "../treatment/RegimenDrugTools";

export default function LungAbscessInternational() {
  return <section className="bv199-panel la-intl" aria-label="Khuyến cáo quốc tế về áp xe phổi người lớn">
    <div className="bv199-label">KHUYẾN CÁO QUỐC TẾ</div>
    <h3>Áp xe phổi do vi khuẩn ở người lớn</h3>
    <p className="la-origin">UpToDate 2026</p>
    <details className="la-treatment" open>
      <summary>Điều trị kháng sinh ban đầu</summary>
      <p>Lựa chọn kháng sinh theo bệnh cảnh lâm sàng và nguy cơ tác nhân gây bệnh. Các phác đồ dưới đây là lựa chọn thay thế; dấu “+” biểu thị các thuốc cần phối hợp.</p>
      <h4>Lựa chọn ban đầu cho phần lớn trường hợp</h4>
      <ClinicalReferenceDose rows={[{name:'Ampicillin–sulbactam',dose:'3 g',route:'Tĩnh mạch',interval:'Mỗi 6 giờ'}]} />
      <h4>Dị ứng penicillin — lựa chọn 1: moxifloxacin đơn trị</h4>
      <ClinicalReferenceDose rows={[{name:'Moxifloxacin',dose:'400 mg',route:'Uống hoặc tĩnh mạch',interval:'1 lần/ngày'}]} />
      <div className="tp-or"><span>Hoặc</span></div>
      <h4>Dị ứng penicillin — lựa chọn 2: levofloxacin phối hợp metronidazol</h4>
      <ClinicalReferenceDose rows={[{name:'Levofloxacin',dose:'750 mg',route:'Uống hoặc tĩnh mạch',interval:'1 lần/ngày'},{name:'Metronidazol',dose:'500 mg',route:'Uống hoặc truyền tĩnh mạch',interval:'Mỗi 8 giờ'}]} />
      <h4>Nguy cơ vi khuẩn Gram âm kháng thuốc</h4>
      <ClinicalReferenceDose rule="one-of" rows={[{name:'Imipenem',dose:'500 mg hoặc 1 g',route:'Tĩnh mạch',interval:'Mỗi 6 giờ'},{name:'Meropenem',dose:'1 g',route:'Tĩnh mạch',interval:'Mỗi 8 giờ'}]} />
      <ul className="la-notes">
        <li><strong>Metronidazol</strong>
          <ul>
            <li>Lựa chọn đường uống khi người bệnh dung nạp và hấp thu qua đường tiêu hóa; sử dụng đường truyền tĩnh mạch khi không thể dùng đường uống.</li>
            <li>Trong phác đồ này, metronidazol được phối hợp với levofloxacin, không sử dụng đơn trị.</li>
          </ul>
        </li>
        <li><strong>Cá thể hóa điều trị</strong>
          <ul>
            <li>Cá thể hóa liều theo chức năng thận.</li>
            <li>Kiểm tra chế phẩm, chống chỉ định và thời gian truyền trước khi kê đơn hoặc thẩm định y lệnh.</li>
          </ul>
        </li>
        <li><strong>Lựa chọn thay thế ở người bệnh nội trú</strong>
          <ul>
            <li>Có thể lựa chọn ceftriaxon hoặc một cephalosporin thế hệ ba khác phối hợp metronidazol.</li>
            <li>Liều cho lựa chọn này không được nêu trong sơ đồ điều trị.</li>
          </ul>
        </li>
        <li><strong>Chuyển đường dùng và thời gian điều trị</strong>
          <ul>
            <li>Chuyển từ đường tĩnh mạch sang uống khi có cải thiện lâm sàng và đã hết sốt, bạch cầu trở về bình thường; chọn thuốc có phổ tương tự.</li>
            <li>Thời gian điều trị thường khoảng 3–4 tuần, điều chỉnh theo đáp ứng lâm sàng và hình ảnh học; không áp dụng một thời gian cố định cho mọi người bệnh.</li>
          </ul>
        </li>
      </ul>
      <h4>Clindamycin đơn trị: lựa chọn thay thế có điều kiện</h4>
      <RegimenDrugTools name="Clindamycin" texts={["Clindamycin 600 mg truyền tĩnh mạch mỗi 8 giờ"]} />
      <ul className="la-notes">
        <li><strong>Điều kiện lựa chọn</strong>
          <ul>
            <li>Có thể cân nhắc ở người bệnh dị ứng penicillin khi tác nhân gây bệnh nghi ngờ hoặc xác định còn nhạy cảm và không cần bao phủ trực khuẩn Gram âm hiếu khí.</li>
            <li>Không sử dụng đơn trị khi nghi ngờ nhiễm phối hợp trực khuẩn Gram âm hiếu khí; lựa chọn phác đồ theo nguy cơ tác nhân và kết quả vi sinh.</li>
          </ul>
        </li>
        <li><strong>Liều khởi đầu ở người lớn:</strong> 600 mg truyền tĩnh mạch mỗi 8 giờ.</li>
        <li><strong>Hạn chế sử dụng:</strong> Clindamycin hiện ít được ưu tiên do nguy cơ nhiễm <i>Clostridioides difficile</i> và đề kháng kháng sinh.</li>
      </ul>
    </details>
    <h4>Đánh giá ban đầu và theo dõi</h4>
    <ul className="la-notes">
      <li><strong>Đánh giá ban đầu</strong>
        <ul>
          <li>Chẩn đoán dựa trên bệnh cảnh phù hợp và hình ảnh thành mỏng có mức khí–dịch.</li>
          <li>Lấy cấy máu, nhuộm Gram và cấy đờm trước điều trị nếu có thể; điều chỉnh kháng sinh theo kết quả vi sinh.</li>
        </ul>
      </li>
      <li><strong>Theo dõi đáp ứng</strong>
        <ul>
          <li>Đánh giá lại sau 3–4 ngày: triệu chứng, dấu hiệu sinh tồn và số lượng bạch cầu.</li>
          <li>Hình ảnh có thể cải thiện chậm hơn: đông đặc khoảng 7–10 ngày; hang áp xe có thể mất 3–7 tuần để đóng.</li>
        </ul>
      </li>
    </ul>
    <h4>Khi đáp ứng kém hoặc diễn biến nặng hơn</h4>
    <ul className="la-notes">
      <li><strong>Đánh giá lại tác nhân và chẩn đoán</strong>
        <ul>
          <li>Rà soát kết quả cấy máu và đờm, điều chỉnh kháng sinh.</li>
          <li>Đánh giá vi khuẩn kháng thuốc, nấm, tác nhân khác và chẩn đoán không nhiễm trùng.</li>
        </ul>
      </li>
      <li><strong>Tìm và xử trí tắc nghẽn đường thở</strong>
        <ul>
          <li>Chụp CT ngực và cân nhắc nội soi phế quản để tìm tắc nghẽn đường thở, lấy bệnh phẩm.</li>
          <li>Xử trí dị vật hoặc tổn thương tắc nghẽn khi phù hợp.</li>
        </ul>
      </li>
      <li><strong>Cân nhắc can thiệp khi áp xe còn tồn tại sau đánh giá lại</strong>
        <ul>
          <li>Hội chẩn về dẫn lưu qua da hoặc đường phế quản.</li>
          <li>Phẫu thuật chỉ ở một số trường hợp.</li>
        </ul>
      </li>
    </ul>
    <style>{`
      .la-intl { color: #17364b; font-size: 13px; line-height: 1.75; min-width: 0; }
      .la-intl h3 { font-size: 17px; margin: 10px 0; }
      .la-intl h4 { margin: 18px 0 8px; font-size: 14px; }
      .la-origin { background: #fffbeb; border-left: 3px solid #d97706; padding: 10px 12px; }
      .la-intl ul { padding-left: 22px; margin: 10px 0; }
      .la-intl .la-notes, .la-intl .la-notes ul { list-style: none; padding-left: 0; }
      .la-intl .la-notes li { position: relative; padding-left: 20px; }
      .la-intl .la-notes > li::before { content: "−"; position: absolute; left: 0; font-weight: 700; }
      .la-intl .la-notes ul > li::before { content: "•"; position: absolute; left: 0; }
      .la-intl .la-notes ul { margin: 6px 0 0; }
      .la-intl li + li { margin-top: 8px; }
      .la-intl details { margin: 12px 0; }
      .la-intl summary { cursor: pointer; font-weight: 700; color: #0b6b8a; }
      .la-scroll { max-width: 100%; overflow-x: auto; }
      .la-intl table { width: 100%; min-width: 700px; border-collapse: collapse; font-size: 13px; }
      .la-intl table.tx-table { min-width:0; }
      .la-intl th, .la-intl td { text-align: left; padding: 10px; border-bottom: 1px solid #dfe8ee; vertical-align: top; }
      .la-intl thead { background: #eef6f8; }
      .la-intl tbody th { width: 25%; font-weight: 600; }
      .la-intl caption { text-align: left; margin: 8px 0; font-size: 12px; color: #526c7c; }
      .la-intl summary:focus-visible { outline: 3px solid #087f89; outline-offset: 3px; }
    `}</style>
  </section>;
}
