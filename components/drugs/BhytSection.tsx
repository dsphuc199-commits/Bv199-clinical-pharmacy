/*
  Mục "Bảo hiểm y tế" trên trang thuốc – Thông tư 20/2022/TT-BYT, Phụ lục I, nguyên văn:
  STT, nhóm, dấu (*) phải hội chẩn, từng đường dùng × hạng bệnh viện được sử dụng và thanh toán, điều kiện / tỷ lệ (cột 8).
  Dòng đường dùng ứng với chế phẩm được tô đậm (không ẩn dòng khác).
*/
import { Check, Minus } from "lucide-react";
import { BHYT_SOURCE, HANG_LABELS, routeMatches, type BhytItem } from "@/lib/drugs/bhyt";

/* BV199 là bệnh viện hạng I → cột 4 của Phụ lục I ("Bệnh viện hạng đặc biệt và hạng I sử dụng các thuốc quy định tại cột 4"). */
const BV199_COL = 0;

/* Điều 3 khoản 2 và Điều 5 khoản 7 Thông tư 20/2022/TT-BYT (nguyên văn). */
const RULE_INDICATION = "Quỹ bảo hiểm y tế thanh toán trong trường hợp chỉ định thuốc phù hợp với chỉ định của một trong các tài liệu sau: tờ hướng dẫn sử dụng thuốc kèm theo hồ sơ đăng ký thuốc đã được Bộ Y tế cấp phép; tờ hướng dẫn sử dụng thuốc kèm theo hồ sơ đăng ký thuốc của thuốc biệt dược gốc, sinh phẩm tham chiếu đã được Bộ Y tế cấp phép; hướng dẫn chẩn đoán và điều trị của Bộ Y tế; Dược thư Quốc gia Việt Nam phiên bản mới nhất.";
const RULE_CONSULT = "Các thuốc có ký hiệu dấu sao (*) là thuốc phải được hội chẩn trước khi sử dụng, trừ trường hợp cấp cứu. Đối với thuốc kháng sinh có ký hiệu dấu sao (*), quỹ bảo hiểm y tế thanh toán khi thực hiện đúng quy trình hội chẩn khi kê đơn theo quy định về Hướng dẫn thực hiện quản lý sử dụng kháng sinh trong bệnh viện của Bộ Y tế.";

export default function BhytSection({ items, productRoute }: { items: BhytItem[]; productRoute?: string | null }) {
  const consult = items.some((i) => i.consult);
  return (
    <section id="bhyt" className="dt-card">
      <div className="dt-head">
        <h2>Bảo hiểm y tế</h2>
        <span className="dt-src">Thông tư 20/2022/TT-BYT, Phụ lục I</span>
      </div>
      {consult && <p className="bh-consult"><strong>(*) Phải hội chẩn trước khi sử dụng, trừ trường hợp cấp cứu.</strong></p>}
      <div className="bh-list">
        {items.map((it) => (
          <div key={`${it.stt}-${it.sub}`} className="bh-item">
            <p className="bh-title">
              <span className="bh-stt">STT {it.stt}</span> {it.name}{it.consult ? " (*)" : ""}
              <span className="bh-group">{[it.group, it.sub].filter(Boolean).join(" › ")}</span>
            </p>
            <p className="bh-sum">
              <strong>Tại BV199 (hạng I):</strong>{" "}
              {it.routes.some((r) => r.hang[BV199_COL])
                ? it.routes.map((r) => `${r.route}: ${r.hang[BV199_COL] ? "có trong phạm vi thanh toán" : "không có ở hạng I"}`).join(" · ")
                : "không có trong phạm vi thanh toán của bệnh viện hạng I"}
              {it.routes.some((r) => r.hang[BV199_COL] && r.note) ? ". Kèm điều kiện ở cột cuối." : "."}
            </p>
            <div className="bh-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Đường dùng</th>
                    {HANG_LABELS.map((h, k) => <th key={h} scope="col" className={`bh-h${k === BV199_COL ? " bh-me" : ""}`}>{h}{k === BV199_COL && <span className="bh-me-tag">BV199</span>}</th>)}
                    <th scope="col">Điều kiện, tỷ lệ thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {it.routes.map((r, i) => (
                    <tr key={i} className={routeMatches(productRoute, r.route) ? "on" : undefined}>
                      <th scope="row">{r.route}</th>
                      {r.hang.map((h, k) => (
                        <td key={k} className={`bh-h${k === BV199_COL ? " bh-me" : ""}`} aria-label={`${HANG_LABELS[k]}: ${h ? "được thanh toán" : "không"}`}>
                          {h ? <Check size={16} className="bh-yes" aria-hidden /> : <Minus size={14} className="bh-no" aria-hidden />}
                        </td>
                      ))}
                      <td>{r.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <details className="bh-rules">
        <summary>Nguyên tắc chung (Điều 3, Điều 5)</summary>
        <p>{RULE_INDICATION}</p>
        {consult && <p>{RULE_CONSULT}</p>}
        <p className="bh-src">{BHYT_SOURCE}</p>
      </details>
      <style>{`
        .bh-consult { margin: 0 0 10px; border-radius: 10px; padding: 8px 12px; background: #fff3d6; border: 1px solid #f1d48a; color: #6b4300; font-size: 14px; }
        .bh-list { display: grid; gap: 14px; }
        .bh-title { margin: 0 0 6px; font-size: 15px; font-weight: 800; color: #10243e; }
        .bh-stt { display: inline-block; margin-right: 4px; padding: 1px 8px; border-radius: 999px; background: #e7f0f7; color: #0b3a5b; font-size: 12px; }
        .bh-group { display: block; margin-top: 2px; font-size: 12.5px; font-weight: 600; color: #6b8293; }
        .bh-table { overflow-x: auto; border: 1px solid #dfe8ee; border-radius: 10px; }
        .bh-table table { width: 100%; min-width: 560px; border-collapse: collapse; font-size: 13.5px; }
        .bh-table th, .bh-table td { border-top: 1px solid #e3eaf0; padding: 7px 9px; text-align: left; vertical-align: top; line-height: 1.5; }
        .bh-table thead th { border-top: 0; background: #f1f6f9; font-weight: 700; color: #10243e; font-size: 12.5px; }
        .bh-table tbody th { font-weight: 700; color: #1f3347; white-space: nowrap; }
        .bh-table .bh-h { text-align: center; width: 76px; }
        .bh-table .bh-me { background: #e6f4ef; }
        .bh-table thead .bh-me { background: #cfeadf; color: #0b4d34; }
        .bh-me-tag { display: block; margin-top: 2px; font-size: 11px; font-weight: 800; color: #0b6b45; }
        .bh-sum { margin: 0 0 6px; font-size: 13.5px; line-height: 1.55; color: #1f3347; }
        .bh-table tr.on { background: #eef8f6; }
        .bh-yes { color: #12623c; display: inline-block; }
        .bh-no { color: #b7c3cd; display: inline-block; }
        .bh-rules { margin-top: 12px; font-size: 13.5px; line-height: 1.6; color: #36506a; }
        .bh-rules summary { cursor: pointer; font-weight: 700; color: #0b3a5b; }
        .bh-rules p { margin: 6px 0 0; }
        .bh-src { font-size: 12.5px; color: #6b8293; }
      `}</style>
    </section>
  );
}
