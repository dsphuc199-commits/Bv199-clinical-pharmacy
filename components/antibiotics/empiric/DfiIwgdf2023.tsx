"use client";
/* Nhiem trung ban chan dai thao duong – cong cu chon khang sinh theo IWGDF/IDSA 2023. Du lieu: dfi-iwgdf2023.ts */
import { useState } from "react";
import { BONE_OPTS, GRADE_OPTS, MILD_FACTORS, MOD_FACTORS, dfiPlan, type BoneStatus, type DfiGrade, type MildFactor, type ModFactor } from "./dfi-iwgdf2023";
import { Row, Rx, RxToolStyle, Seg, SourceList } from "./rx-tool";

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}
const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function DfiIwgdf2023() {
  const [grade, setGrade] = useState<DfiGrade>("3");
  const [osteo, setOsteo] = useState(false);
  const [mild, setMild] = useState<MildFactor[]>([]);
  const [mod, setMod] = useState<ModFactor[]>([]);
  const [pseudoPrev, setPseudoPrev] = useState(false);
  const [pad, setPad] = useState(false);
  const [debrided, setDebrided] = useState(false);
  const [bone, setBone] = useState<BoneStatus>("none");
  const g = GRADE_OPTS.find((x) => x.id === grade)!;
  const infected = grade !== "1";
  const o = dfiPlan({ grade, osteo: infected && osteo, mild, mod, pseudoPrev, pad, debrided, bone });

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo chẩn đoán</p>
        <h3>Nhiễm trùng bàn chân đái tháo đường</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Phân độ IWGDF/IDSA</li><li>Yếu tố bổ sung</li><li>Phác đồ kinh nghiệm</li><li>Thời gian</li><li>Phẫu thuật, nhập viện</li>
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Phân độ">
          <Seg label="Phân độ" value={grade} onChange={setGrade} options={GRADE_OPTS} />
          <p className="sa24-tip">{g.criteria}</p>
        </Row>
        {infected && (
          <Row label="Yếu tố bổ sung">
            {grade === "2"
              ? MILD_FACTORS.map((f) => <Chk key={f.id} on={mild.includes(f.id)} set={() => setMild((a) => toggle(a, f.id))}>{f.label}</Chk>)
              : MOD_FACTORS.map((f) => <Chk key={f.id} on={mod.includes(f.id)} set={() => setMod((a) => toggle(a, f.id))}>{f.label}</Chk>)}
            {grade !== "2" && <Chk on={pseudoPrev} set={setPseudoPrev}>Đã phân lập P. aeruginosa từ vị trí nhiễm trong vài tuần trước</Chk>}
            <Chk on={pad} set={setPad}>Bệnh động mạch ngoại biên</Chk>
            {grade !== "2" && <Chk on={debrided} set={setDebrided}>Đã cắt lọc phẫu thuật</Chk>}
            <Chk on={osteo} set={setOsteo}>Viêm xương (O)</Chk>
          </Row>
        )}
        {infected && osteo && (
          <Row label="Xương">
            <Seg label="Xử trí xương" value={bone} onChange={setBone} options={BONE_OPTS} />
          </Row>
        )}
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Phân độ</b> {g.label}{infected && osteo ? " (O)" : ""}</p>
          <p><b>Phác đồ</b> {o.headline}</p>
          <p><b>Hướng dẫn</b> IWGDF/IDSA 2023</p>
        </div>
        {o.blocks.map((b) => (
          <div key={b.title}>
            <h4>{b.title}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            <Rx items={b.items} />
          </div>
        ))}
        {o.avoid.length > 0 && (<><h4>Không khuyến cáo</h4><Rx items={o.avoid} /></>)}
        {o.notes.length > 0 && (<><h4>Lưu ý</h4><ul className="sp-notes">{o.notes.map((n) => <li key={n}>{n}</li>)}</ul></>)}
      </section>
      <SourceList sources={["IWGDF/IDSA 2023 – Guidelines on the diagnosis and treatment of diabetes-related foot infections"]} notes={["Mức khuyến cáo GRADE: mạnh hoặc có điều kiện; độ tin cậy cao, trung bình, thấp; thực hành tốt nhất.","Liều theo hướng dẫn quốc gia.","Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt."]} />
      <RxToolStyle />
      <style>{`.sp-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }`}</style>
    </article>
  );
}
