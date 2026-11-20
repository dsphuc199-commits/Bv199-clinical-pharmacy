"use client";
/* Pseudomonas aeruginosa (nhạy thuốc, kháng carbapenem, DTR) – công cụ chọn kháng sinh theo IDSA 2026 AMR Guidance,
   Section 4 (Question 4.1–4.7), Table 1, Table 2. */
import { useState } from "react";
import { PA_BREAKPOINTS, PA_DEFS, PA_GENERAL, PA_MONITOR, paDx, paPlan, type PaCarb, type PaPheno, type PaSite } from "./pa-idsa2026";
import { Row, Rx, RxToolStyle, Seg, SourceList } from "./rx-tool";
import { citeIntlSources } from "@/lib/antibiotics/source-citation";

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}

export default function PaeruginosaIdsa2026() {
  const [pheno, setPheno] = useState<PaPheno>("susceptible");
  const [severe, setSevere] = useState(false);
  const [site, setSite] = useState<PaSite>("other");
  const [pneumonia, setPneumonia] = useState(false);
  const [carb, setCarb] = useState<PaCarb>("none");
  const [noActiveBL, setNoActiveBL] = useState(false);
  const input = { pheno, severe: pheno === "crpa" && severe, site, pneumonia: site === "other" && pneumonia, carb, noActiveBL };
  const o = paPlan(input);
  const dtr = pheno === "dtr";

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Điều trị đích – đã xác định tác nhân</p>
        <h3>Pseudomonas aeruginosa – nhạy thuốc, kháng carbapenem, DTR</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Kiểu hình kháng thuốc</li><li>Vị trí nhiễm khuẩn</li><li>Carbapenemase</li><li>Thuốc, liều</li><li>Theo dõi kháng thuốc</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Kiểu hình">
          <Seg label="Kiểu hình" value={pheno} onChange={setPheno} options={[
            { id: "susceptible", label: "Nhạy beta-lactam truyền thống và carbapenem" },
            { id: "crpa", label: "Kháng carbapenem, nhạy beta-lactam truyền thống" },
            { id: "dtr", label: "DTR" },
          ] as const} />
          {dtr && <p className="sa24-tip">DTR: không nhạy tất cả aztreonam, cefepim, ceftazidim, ciprofloxacin, imipenem, levofloxacin, meropenem, piperacilin-tazobactam.</p>}
        </Row>
        {pheno === "crpa" && (
          <Row label="Người bệnh">
            <Chk on={severe} set={setSevere}>Bệnh nguy kịch hoặc ổ nhiễm khuẩn chưa kiểm soát</Chk>
          </Row>
        )}
        {dtr && (
          <>
            <Row label="Carbapenemase">
              <Seg label="Carbapenemase" value={carb} onChange={setCarb} options={[
                { id: "none", label: "Không phát hiện / chưa làm" },
                { id: "kpc", label: "KPC" },
                { id: "mbl", label: "MBL (NDM, VIM, IMP)" },
              ] as const} />
            </Row>
            <Row label="Vị trí nhiễm khuẩn">
              <Seg label="Vị trí nhiễm khuẩn" value={site} onChange={setSite} options={[
                { id: "uuti", label: "Viêm bàng quang không biến chứng" },
                { id: "cuti", label: "Tiết niệu phức tạp" },
                { id: "other", label: "Ngoài tiết niệu" },
              ] as const} />
              {site === "other" && <Chk on={pneumonia} set={setPneumonia}>Viêm phổi</Chk>}
              {carb !== "none" && <p className="sa24-tip">Chủng sinh carbapenemase: lựa chọn theo IDSA Question 4.4, áp dụng cho mọi vị trí.</p>}
            </Row>
            <Row label="Kháng sinh đồ">
              <Chk on={noActiveBL} set={setNoActiveBL}>Không beta-lactam mới nào nhạy in vitro</Chk>
            </Row>
          </>
        )}
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {paDx(input)}</p>
          <p><b>Phác đồ</b> {o.headline}</p>
          <p><b>Cách dùng</b> {o.usage}</p>
          <p><b>Hướng dẫn</b> IDSA 2026 – vi khuẩn Gram âm kháng thuốc, Section 4</p>
        </div>
        {o.blocks.map((b) => (
          <div key={b.title}>
            <h4>{b.title}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            <Rx items={b.items} />
          </div>
        ))}
        {o.avoid.length > 0 && (<><h4>Không dùng</h4><Rx items={o.avoid} /></>)}
        {o.notes.length > 0 && (<><h4>Lưu ý</h4><ul className="pa-notes">{o.notes.map((n) => <li key={n}>{n}</li>)}</ul></>)}
        <h4>Theo dõi, xuất hiện kháng thuốc</h4>
        <Rx items={PA_MONITOR} />
        <h4>Định nghĩa, kháng sinh đồ</h4>
        <Rx items={PA_DEFS} />
        <h4>Ngưỡng nhạy CLSI 2026 với P. aeruginosa (µg/mL)</h4>
        <table className="sa24-rx pa-bp"><tbody>
          {PA_BREAKPOINTS.map(([d, v]) => <tr key={d}><th scope="row">{d}</th><td>{v}</td></tr>)}
        </tbody></table>
        <h4>Nguyên tắc chung</h4>
        <ul className="pa-notes">{PA_GENERAL.map((n) => <li key={n}>{n}</li>)}</ul>
      </section>
      <SourceList sources={[...citeIntlSources(["idsa-amr-2026"]), { key: "clsi-m100-2026", label: "M100: Performance Standards for Antimicrobial Susceptibility Testing", detail: "Clinical and Laboratory Standards Institute · Ấn bản 36", year: 2026, url: "https://clsi.org/shop/standards/m100/" }]} notes={["IDSA xếp ưu tiên, thay thế theo đồng thuận chuyên gia, không xếp mức GRADE.","Hướng dẫn quốc tế (bối cảnh Hoa Kỳ), chưa phải phác đồ BV199 phê duyệt; đối chiếu kháng sinh đồ và danh mục thuốc tại chỗ."]} />
      <RxToolStyle />
      <style>{`.pa-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }
        .pa-bp th { width: 60%; }`}</style>
    </article>
  );
}
