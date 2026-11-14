"use client";
/* Nhiem khuan huyet do S. aureus – cong cu phan tang nguy co, tham do, phan loai cuoi cung (IDSA/ESCMID 2026 CS 1)
   va lieu, theo doi vancomycin khi nghi/xac dinh MRSA nang (ASHP/IDSA/PIDS/SIDP 2020). */
import { useState } from "react";
import { ADULT_INITIAL, NEO_NOTE, PED_BARRIERS, PED_INITIAL, RISKS, VANCO, VANCO_COMMON, VANCO_POP, sabPlan, type Final, type RiskId, type VancoPop } from "./sab-intl";
import { Row, Rx, RxToolStyle, Seg } from "./rx-tool";

type Age = "adult" | "child" | "neo";

export default function SabIntl() {
  const [age, setAge] = useState<Age>("adult");
  const [sel, setSel] = useState<RiskId[]>([]);
  const [final, setFinal] = useState<Final>("pending");
  const [pop, setPop] = useState<VancoPop>("std");
  const toggle = (id: RiskId, on: boolean) => setSel((s) => (on ? [...s, id] : s.filter((x) => x !== id)));
  const chooseAge = (a: Age) => { setAge(a); setPop(a === "adult" ? "std" : a === "child" ? "ped" : "neo"); };
  const p = sabPlan(sel, final);
  const adult = age === "adult";

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Phân tầng nguy cơ – thăm dò – điều trị</p>
        <h3>Nhiễm khuẩn huyết do Staphylococcus aureus</h3>
        <ol className="sa24-flow" aria-label="Trình tự đánh giá">
          <li>Đánh giá ban đầu</li><li>Phân tầng nguy cơ</li><li>Thăm dò cá thể hóa</li><li>Phân loại cuối cùng, thời gian</li><li>Vancomycin khi MRSA</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Đối tượng">
          <Seg label="Đối tượng" value={age} onChange={chooseAge} options={[{ id: "adult", label: "Người lớn" }, { id: "child", label: "Trẻ em (≥ 28 ngày)" }, { id: "neo", label: "Sơ sinh (< 28 ngày)" }] as const} />
        </Row>
        {adult && (
          <>
            <Row label="Yếu tố nguy cơ chính">
              {RISKS.filter((x) => x.key).map((x) => (
                <label key={x.id} className="sa24-chk"><input type="checkbox" checked={sel.includes(x.id)} onChange={(e) => toggle(x.id, e.target.checked)} /> {x.label}{x.ie ? " *" : ""}</label>
              ))}
            </Row>
            <Row label="Yếu tố nguy cơ khác">
              {RISKS.filter((x) => !x.key).map((x) => (
                <label key={x.id} className="sa24-chk"><input type="checkbox" checked={sel.includes(x.id)} onChange={(e) => toggle(x.id, e.target.checked)} /> {x.label}{x.ie ? " *" : ""}</label>
              ))}
              <p className="sa24-tip">* Đặc điểm tăng nguy cơ viêm nội tâm mạc. Khởi phát cộng đồng (định nghĩa thống nhất trong các nghiên cứu): mẫu cấy máu dương tính đầu tiên lấy trước hoặc trong 48 giờ sau nhập viện.</p>
            </Row>
            <Row label="Kết quả thăm dò">
              <Seg label="Kết quả thăm dò" value={final} onChange={setFinal} options={[{ id: "pending", label: "Đang đánh giá" }, { id: "nofocus", label: "Không có ổ nhiễm sâu" }, { id: "focus", label: "Có ổ nhiễm sâu, di bệnh" }] as const} />
            </Row>
          </>
        )}
      </div>

      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> Nhiễm khuẩn huyết do S. aureus – {adult ? "người lớn" : age === "child" ? "trẻ em" : "sơ sinh"}</p>
          <p><b>Phân tầng</b> {adult ? p.headline : "Mọi trẻ đều cần đánh giá tìm ổ nhiễm sâu – chưa xác định được nhóm trẻ nguy cơ thấp"}</p>
          <p><b>Hướng dẫn</b> IDSA/ESCMID 2026 – Consensus Statement 1; vancomycin: ASHP/IDSA/PIDS/SIDP 2020</p>
        </div>
        {adult ? (
          <>
            <h4>Đánh giá ban đầu – mọi người bệnh</h4>
            <Rx items={ADULT_INITIAL} />
            <h4>{p.level === "low" ? "Nguy cơ thấp – theo dõi" : "Nguy cơ tăng – thăm dò cá thể hóa"}</h4>
            <Rx items={p.workup} />
            <h4>Phân loại cuối cùng, thời gian điều trị</h4>
            <Rx items={p.final} />
            <h4>Lưu ý</h4>
            <ul className="sab-notes">{p.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          </>
        ) : (
          <>
            {age === "neo" && <p className="sa24-lead">{NEO_NOTE}</p>}
            <h4>Đánh giá, xử trí</h4>
            <Rx items={PED_INITIAL} />
            <h4>Lưu ý</h4>
            <ul className="sab-notes"><li>{PED_BARRIERS}</li><li>Thời gian điều trị ở trẻ em: thuộc Consensus Statement 6–7, chưa trích trong công cụ này.</li></ul>
          </>
        )}

        <h4>Vancomycin – khi nghi ngờ hoặc xác định MRSA nặng</h4>
        <p className="sa24-lead">IDSA/ESCMID 2026 Part 1 chưa đưa khuyến cáo chọn thuốc cho MSSA/MRSA. Phần dưới chỉ là liều và theo dõi nồng độ vancomycin theo ASHP 2020 (chức năng thận bình thường, trừ các mục lọc máu).</p>
        <Row label="Nhóm người bệnh">
          <Seg label="Nhóm người bệnh" value={pop} onChange={setPop} options={VANCO_POP} />
        </Row>
        <Rx items={VANCO[pop]} />
        <h4>Nguyên tắc chung vancomycin</h4>
        <Rx items={VANCO_COMMON} />
      </section>
      <p className="sa24-src">Nguồn: IDSA/ESCMID 2026 Consensus Statement 1 – Risk Stratification of Patients with S. aureus Bacteremia (Kaasch AJ, Strnad L và cs.), Table 1, Figure 1, Implementation considerations – phương pháp đồng thuận (&gt; 75% hội đồng), không xếp mức bằng chứng; ASHP/IDSA/PIDS/SIDP 2020 – Therapeutic monitoring of vancomycin for serious MRSA infections (Rybak MJ và cs., Am J Health-Syst Pharm 2020;77:835–864), Table 2 – mức khuyến cáo A/B/C, chất lượng bằng chứng I/II/III. CS = Consensus Statement; KC = khuyến cáo. Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt.</p>
      <RxToolStyle />
      <style>{`.sab-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }`}</style>
    </article>
  );
}
