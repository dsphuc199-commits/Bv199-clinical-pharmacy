"use client";
/* Enterobacterales sinh ESBL – cong cu chon khang sinh theo IDSA 2026 (Section 1, Table 1). */
import { useState } from "react";
import { ESBL_PRINCIPLES, esblPlan, type EsblSite } from "./esbl-idsa2026";
import { Row, Rx, RxToolStyle, Seg } from "./rx-tool";

const SITE_LABEL: Record<EsblSite, string> = {
  uuti: "Viêm bàng quang không biến chứng",
  cuti: "Nhiễm khuẩn tiết niệu phức tạp, viêm thận – bể thận",
  other: "Nhiễm khuẩn ngoài đường tiết niệu",
};

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}

export default function EsblIdsa2026() {
  const [site, setSite] = useState<EsblSite>("other");
  const [ecoli, setEcoli] = useState(false);
  const [severe, setSevere] = useState(false);
  const [bacteremia, setBacteremia] = useState(false);
  const [hypoalb, setHypoalb] = useState(false);
  const o = esblPlan({ site, ecoli, severe, bacteremia, hypoalb });
  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Điều trị đích – đã xác định tác nhân</p>
        <h3>Enterobacterales sinh ESBL – người lớn</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Vị trí nhiễm khuẩn</li><li>Mức độ nặng, nhiễm khuẩn huyết</li><li>Loài vi khuẩn</li><li>Thuốc, liều, chuyển uống</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Vị trí nhiễm khuẩn">
          <Seg label="Vị trí nhiễm khuẩn" value={site} onChange={setSite} options={[
            { id: "uuti", label: "Bàng quang không biến chứng" },
            { id: "cuti", label: "Tiết niệu phức tạp" },
            { id: "other", label: "Ngoài tiết niệu" },
          ] as const} />
          {site === "other" && <p className="sa24-tip">Nhiễm khuẩn huyết, nhiễm khuẩn ổ bụng, da – mô mềm, viêm phổi.</p>}
        </Row>
        <Row label="Người bệnh">
          {site === "cuti" && <Chk on={severe} set={setSevere}>Bệnh nặng (nguy kịch)</Chk>}
          {site === "cuti" && <Chk on={bacteremia} set={setBacteremia}>Có nhiễm khuẩn huyết kèm theo</Chk>}
          {site === "other" && <Chk on={severe} set={setSevere}>Bệnh nặng (nguy kịch)</Chk>}
          {site === "other" && <Chk on={hypoalb} set={setHypoalb}>Albumin máu &lt; 2,5 g/dL</Chk>}
          {site !== "other" && <Chk on={ecoli} set={setEcoli}>Tác nhân là E. coli</Chk>}
          {site === "other" && <p className="sa24-tip">Không có lựa chọn riêng theo loài vi khuẩn cho nhiễm khuẩn ngoài đường tiết niệu.</p>}
        </Row>
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {`Nhiễm khuẩn do Enterobacterales sinh ESBL – ${SITE_LABEL[site].toLowerCase()}`}</p>
          <p><b>Phác đồ</b> {o.headline}</p>
          <p><b>Cách dùng</b> Đơn trị – chọn một thuốc trong nhóm phù hợp; không phối hợp thường quy.</p>
          <p><b>Hướng dẫn</b> IDSA 2026 – vi khuẩn Gram âm kháng thuốc, Section 1</p>
        </div>
        {o.blocks.map((b) => (
          <div key={b.title}>
            <h4>{b.title}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            <Rx items={b.items} />
          </div>
        ))}
        {o.avoid.length > 0 && (<><h4>Không dùng</h4><Rx items={o.avoid} /></>)}
        {o.notes.length > 0 && (<><h4>Lưu ý</h4><ul className="sa24-notes">{o.notes.map((n) => <li key={n}>{n}</li>)}</ul></>)}
        <h4>Nguyên tắc chung</h4>
        <ul className="sa24-notes">{ESBL_PRINCIPLES.map((n) => <li key={n}>{n}</li>)}</ul>
      </section>
      <p className="sa24-src">Nguồn: IDSA 2026 – Hướng dẫn điều trị nhiễm khuẩn Gram âm kháng thuốc (Tamma PD và cs., Clin Infect Dis 2026; doi:10.1093/cid/ciag481), Section 1 và Table 1. IDSA xếp ưu tiên/thay thế theo đồng thuận chuyên gia, không xếp mức GRADE; hướng dẫn không đưa ra khuyến cáo cụ thể về thời gian điều trị. Hướng dẫn quốc tế (bối cảnh Hoa Kỳ), chưa phải phác đồ BV199 phê duyệt; đối chiếu kháng sinh đồ và danh mục thuốc tại chỗ.</p>
      <RxToolStyle />
      <style>{`.sa24-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }`}</style>
    </article>
  );
}
