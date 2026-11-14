"use client";
/* Nhiem khuan huyet do Gram am – cong cu chon khang sinh theo nguon quoc te:
   kinh nghiem (nguon tiet nieu, IDSA 2025 cUTI) va dieu tri dich theo kieu hinh khang thuoc (IDSA 2026 AMR). */
import { useState } from "react";
import { COURSE, EMP_STEPS, PHENO_LABEL, defPlan, empPlan, type Block, type Pheno, type Sev } from "./gnb-bsi-intl";
import { Row, Rx, RxToolStyle, Seg } from "./rx-tool";
import type { RxItem } from "./septic-arthritis-pids2023";

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}
function Out({ blocks, avoid, notes }: { blocks: Block[]; avoid: RxItem[]; notes: string[] }) {
  return (
    <>
      {blocks.map((b) => (
        <div key={b.title}>
          <h4>{b.title}</h4>
          {b.lead && <p className="sa24-lead">{b.lead}</p>}
          <Rx items={b.items} />
        </div>
      ))}
      {avoid.length > 0 && (<><h4>Không dùng</h4><Rx items={avoid} /></>)}
      {notes.length > 0 && (<><h4>Lưu ý</h4><ul className="gb-notes">{notes.map((n) => <li key={n}>{n}</li>)}</ul></>)}
    </>
  );
}

const SEV_TEXT: Record<Sev, string> = { shock: "sốc nhiễm khuẩn", sepsis: "sepsis không sốc", none: "không sepsis" };

export default function GnbBsiIntl() {
  const [stage, setStage] = useState<"emp" | "def">("emp");
  const [sev, setSev] = useState<Sev>("sepsis");
  const [oral, setOral] = useState(false);
  const [priorEsbl, setPriorEsbl] = useState(false);
  const [priorFqR, setPriorFqR] = useState(false);
  const [fq12m, setFq12m] = useState(false);
  const [priorPtzR, setPriorPtzR] = useState(false);
  const [pheno, setPheno] = useState<Pheno>("esbl");
  const [urinary, setUrinary] = useState(true);
  const [severe, setSevere] = useState(false);
  const [hypoalb, setHypoalb] = useState(false);
  const [ecoli, setEcoli] = useState(false);

  const emp = empPlan({ sev, oral: sev === "none" && oral, priorEsbl, priorFqR, fq12m, priorPtzR });
  const def = defPlan({ pheno, urinary, severe, hypoalb, ecoli });
  const o = stage === "emp" ? emp : def;
  const dx = stage === "emp"
    ? `Nhiễm khuẩn huyết Gram âm nghi từ đường tiết niệu, ${SEV_TEXT[sev]}, chưa có kết quả cấy`
    : `Nhiễm khuẩn huyết do ${PHENO_LABEL[pheno]}${pheno === "esbl" || pheno === "pa-dtr" ? (urinary ? ", nguồn tiết niệu" : ", nguồn ngoài tiết niệu") : ""}`;

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo chẩn đoán</p>
        <h3>Nhiễm khuẩn huyết do vi khuẩn Gram âm – người lớn</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Giai đoạn</li><li>Mức độ nặng</li><li>Nguy cơ kháng thuốc hoặc kiểu hình kháng</li><li>Thuốc, liều</li><li>Xuống thang, thời gian</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Giai đoạn">
          <Seg label="Giai đoạn" value={stage} onChange={setStage} options={[{ id: "emp", label: "Kinh nghiệm (nguồn tiết niệu)" }, { id: "def", label: "Đích – đã biết kiểu hình kháng" }] as const} />
          {stage === "emp" && <p className="sa24-tip">IDSA 2025 chỉ khuyến cáo kháng sinh kinh nghiệm khi nguồn là đường tiết niệu. Nguồn khác: điều trị kinh nghiệm theo hướng dẫn của bệnh nguyên phát (viêm phổi, nhiễm khuẩn ổ bụng…).</p>}
        </Row>
        {stage === "emp" ? (
          <>
            <Row label="Mức độ nặng">
              <Seg label="Mức độ nặng" value={sev} onChange={setSev} options={[{ id: "shock", label: "Sốc nhiễm khuẩn" }, { id: "sepsis", label: "Sepsis không sốc" }, { id: "none", label: "Không sepsis" }] as const} />
              {sev === "none" && <Chk on={oral} set={setOral}>Điều trị đường uống</Chk>}
            </Row>
            <Row label="Nguy cơ kháng thuốc">
              <Chk on={priorEsbl} set={setPriorEsbl}>Cấy nước tiểu gần đây có vi khuẩn sinh ESBL</Chk>
              <Chk on={priorFqR} set={setPriorFqR}>Cấy nước tiểu gần đây kháng fluoroquinolon</Chk>
              <Chk on={fq12m} set={setFq12m}>Đã dùng fluoroquinolon trong 12 tháng qua</Chk>
              <Chk on={priorPtzR} set={setPriorPtzR}>Cấy nước tiểu gần đây kháng piperacilin-tazobactam</Chk>
            </Row>
          </>
        ) : (
          <>
            <Row label="Kiểu hình kháng">
              <select className="gb-sel" value={pheno} onChange={(e) => setPheno(e.target.value as Pheno)} aria-label="Kiểu hình kháng">
                {(Object.keys(PHENO_LABEL) as Pheno[]).map((k) => <option key={k} value={k}>{PHENO_LABEL[k]}</option>)}
              </select>
            </Row>
            {(pheno === "esbl" || pheno === "pa-dtr") && (
              <Row label="Người bệnh">
                <Chk on={urinary} set={setUrinary}>Nguồn nhiễm khuẩn là đường tiết niệu</Chk>
                {pheno === "esbl" && <Chk on={severe} set={setSevere}>Bệnh nặng (nguy kịch)</Chk>}
                {pheno === "esbl" && !urinary && <Chk on={hypoalb} set={setHypoalb}>Albumin máu &lt; 2,5 g/dL</Chk>}
                {pheno === "esbl" && urinary && <Chk on={ecoli} set={setEcoli}>Tác nhân là E. coli</Chk>}
              </Row>
            )}
          </>
        )}
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {dx}</p>
          <p><b>Phác đồ</b> {o.headline}</p>
          <p><b>Hướng dẫn</b> {stage === "emp" ? "IDSA 2025 – nhiễm khuẩn tiết niệu phức tạp, câu hỏi lâm sàng 1" : "IDSA 2026 – vi khuẩn Gram âm kháng thuốc"}</p>
        </div>
        {stage === "emp" && (<><h4>Quy trình 4 bước chọn kháng sinh kinh nghiệm</h4><Rx items={EMP_STEPS} /></>)}
        <Out blocks={o.blocks} avoid={o.avoid} notes={o.notes} />
        <h4>Thời gian, chuyển đường uống</h4>
        <Rx items={COURSE} />
      </section>
      <p className="sa24-src">Nguồn: IDSA 2025 – Hướng dẫn nhiễm khuẩn tiết niệu phức tạp: lựa chọn kháng sinh (Trautner BW và cs.), Bảng 1.1, 2.1 (liều dùng trong thử nghiệm lâm sàng), 3.1; IDSA 2026 – Hướng dẫn điều trị nhiễm khuẩn Gram âm kháng thuốc (Tamma PD và cs., Clin Infect Dis 2026; doi:10.1093/cid/ciag481), Section 1–6, Table 1 – không xếp mức GRADE. Hướng dẫn quốc tế (bối cảnh Hoa Kỳ), chưa phải phác đồ BV199 phê duyệt; đối chiếu kháng sinh đồ và danh mục thuốc tại chỗ.</p>
      <RxToolStyle />
      <style>{`.gb-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }
        .gb-sel { width: 100%; max-width: 520px; padding: 7px 10px; border: 1px solid #cfdde6; border-radius: 8px; font-size: 13.5px; background: #fff; color: #10243e; }`}</style>
    </article>
  );
}
