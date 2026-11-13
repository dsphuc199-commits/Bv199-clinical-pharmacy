"use client";
/* Viem phoi – cong cu chon khang sinh theo nguon quoc te.
   kind "cap": ATS/IDSA 2019 + Lo trinh IDSA; "hap" | "vap": IDSA/ATS 2016 + IDSA 2026 (vi khuan Gram am khang thuoc). */
import { useState } from "react";
import {
  CAP_DIAG, CAP_MAJOR, CAP_MINOR, HV_COURSE, PATHOGENS,
  capDuration, capPlans, capSpecial, capVirus, hvDiagnosis, hvGrades, hvPlan, type Plan,
} from "./pneumonia-intl";
import { Grade, Legend, ReadHint, Row, Rx, RxToolStyle, Seg, byAllergy } from "./rx-tool";

type Kind = "cap" | "hap" | "vap";
const L_GRADE: [string, string][] = [
  ["Mạnh · Có ĐK", "Mức khuyến cáo GRADE: mạnh – áp dụng cho phần lớn người bệnh; có điều kiện – cân nhắc theo từng người bệnh"],
  ["Cao → Rất thấp", "Độ tin cậy của bằng chứng"],
];
const L_PW: [string, string] = ["Lộ trình IDSA", "Bổ sung thực hành của Lộ trình lâm sàng IDSA, ngoài hướng dẫn ATS/IDSA 2019"];
const L_AMR: [string, string] = ["IDSA 2026", "Hướng dẫn điều trị vi khuẩn Gram âm kháng thuốc: xếp ưu tiên/thay thế theo đồng thuận chuyên gia, không xếp mức GRADE"];

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}

/* Loc phac do theo di ung beta-lactam: bo phac do "std", hien phac do "alt", trong khoi bo thuoc beta-lactam. */
function filterPlans(plans: Plan[], al: boolean): Plan[] {
  return plans
    .filter((p) => (al ? p.al !== "std" : p.al !== "alt"))
    .map((p) => ({ ...p, blocks: p.blocks.map((b) => ({ ...b, items: byAllergy(b.items, al).shown })).filter((b) => b.items.length) }));
}

/* Cach dung phac do: noi ro so thuoc dung dong thoi; danh so tung nhom, moi nhom chon mot thuoc. */
function leadOf(p: Plan): string {
  if (p.lead) return p.lead;
  const n = p.blocks.length;
  if (n >= 2) return `Phối hợp ${n} thuốc, dùng đồng thời: mỗi nhóm đánh số dưới đây chọn đúng một thuốc. Ví dụ: ${p.blocks.map((b) => b.items[0]?.text).join(" + ")}.`;
  const k = p.blocks[0]?.items.length ?? 0;
  return k > 1 ? "Đơn trị: chỉ dùng một thuốc – chọn một trong các thuốc dưới đây." : "Dùng thuốc dưới đây.";
}
function PlanCard({ p }: { p: Plan }) {
  const multi = p.blocks.length >= 2;
  return (
    <div className="pn-plan">
      {p.title && <div className="pn-plan-h"><span>{p.title}</span><Grade g={p.grade} /></div>}
      {(p.blocks.length > 0 || p.lead) && <p className="pn-lead">{leadOf(p)}</p>}
      {p.blocks.map((b, k) => (
        <div key={b.title + k} className="pn-block">
          {multi && k > 0 && <div className="pn-plus" aria-hidden="true">+</div>}
          {multi ? <p className="pn-block-t"><span className="pn-num">{k + 1}</span>Thuốc {k + 1}: {b.title || "chọn một"} – chọn một</p> : b.title && <p className="pn-block-t">{b.title}</p>}
          <Rx items={b.items} />
        </div>
      ))}
      {p.note && <p className="sa24-tip">{p.note}</p>}
    </div>
  );
}
function Plans({ plans }: { plans: Plan[] }) {
  return <>{plans.map((p, k) => (<div key={p.title}>{k > 0 && <div className="pn-or"><span>hoặc</span></div>}<PlanCard p={p} /></div>))}</>;
}

function CapTool({ al }: { al: boolean }) {
  const [setting, setSetting] = useState<"out" | "in">("in");
  const [major, setMajor] = useState<boolean[]>(CAP_MAJOR.map(() => false));
  const [minor, setMinor] = useState<boolean[]>(CAP_MINOR.map(() => false));
  const [comorb, setComorb] = useState(false);
  const [macLow, setMacLow] = useState(false);
  const [mrsaPrior, setMrsaPrior] = useState(false);
  const [paPrior, setPaPrior] = useState(false);
  const [recentHosp, setRecentHosp] = useState(false);
  const [localMrsa, setLocalMrsa] = useState(false);
  const [localPa, setLocalPa] = useState(false);
  const [nasalPcr, setNasalPcr] = useState(false);
  const [noMacFq, setNoMacFq] = useState(false);
  const [virus, setVirus] = useState(false);
  const nMaj = major.filter(Boolean).length;
  const nMin = minor.filter(Boolean).length;
  const severe = setting === "in" && (nMaj >= 1 || nMin >= 3);
  const o = capPlans({ setting, severe, comorb, macLow, mrsaPrior, paPrior, recentHosp, localMrsa, localPa, nasalPcr, noMacFq });
  const plans = filterPlans(o.plans, al);
  const ctx = { setting, severe, comorb, virus };
  const vr = capVirus(ctx);
  const noAbx = virus && !vr.abx;
  const extra = [o.mrsa, o.pa].filter((x): x is Plan => !!x).map((p) => filterPlans([p], al)[0] ?? { ...p, blocks: [] });
  const toggle = (arr: boolean[], set: (v: boolean[]) => void, k: number) => set(arr.map((x, j) => (j === k ? !x : x)));
  const dx = setting === "out"
    ? `Viêm phổi cộng đồng, điều trị ngoại trú, ${comorb ? "có" : "không có"} bệnh đồng mắc`
    : `Viêm phổi cộng đồng, điều trị nội trú, ${severe ? "mức độ nặng" : "không nặng"}`;
  return (
    <>
      <div className="sa24-form">
        <Row label="Nơi điều trị"><Seg label="Nơi điều trị" value={setting} onChange={setSetting} options={[{ id: "out", label: "Ngoại trú" }, { id: "in", label: "Nội trú" }] as const} /></Row>
        {setting === "out" ? (
          <Row label="Người bệnh">
            <Chk on={comorb} set={setComorb}>Có bệnh đồng mắc: bệnh tim, phổi, gan hoặc thận mạn; đái tháo đường; nghiện rượu; ung thư; cắt lách</Chk>
            {!comorb && <Chk on={macLow} set={setMacLow}>Tỷ lệ phế cầu kháng macrolid tại chỗ dưới 25%</Chk>}
          </Row>
        ) : (
          <>
            <Row label="Mức độ nặng">
              <p className="sa24-tip">Viêm phổi nặng khi có 1 tiêu chuẩn chính hoặc ít nhất 3 tiêu chuẩn phụ. Hiện có: {nMaj} chính, {nMin} phụ.</p>
              {CAP_MAJOR.map((m, k) => <Chk key={m} on={major[k]} set={() => toggle(major, setMajor, k)}>{`Chính – ${m.charAt(0).toLowerCase()}${m.slice(1)}`}</Chk>)}
              {CAP_MINOR.map((m, k) => <Chk key={m} on={minor[k]} set={() => toggle(minor, setMinor, k)}>{`Phụ – ${m.charAt(0).toLowerCase()}${m.slice(1)}`}</Chk>)}
            </Row>
            <Row label="Nguy cơ MRSA, P. aeruginosa">
              <Chk on={mrsaPrior} set={setMrsaPrior}>Đã từng phân lập MRSA từ bệnh phẩm hô hấp</Chk>
              <Chk on={paPrior} set={setPaPrior}>Đã từng phân lập P. aeruginosa từ bệnh phẩm hô hấp</Chk>
              <Chk on={recentHosp} set={setRecentHosp}>Nằm viện và dùng kháng sinh đường tiêm trong 90 ngày qua</Chk>
              {recentHosp && <Chk on={localMrsa} set={setLocalMrsa}>Dữ liệu tại chỗ xác nhận đây là yếu tố nguy cơ MRSA</Chk>}
              {recentHosp && <Chk on={localPa} set={setLocalPa}>Dữ liệu tại chỗ xác nhận đây là yếu tố nguy cơ P. aeruginosa</Chk>}
              {recentHosp && localMrsa && !severe && <Chk on={nasalPcr} set={setNasalPcr}>Có xét nghiệm PCR MRSA ngoáy mũi nhanh</Chk>}
            </Row>
            {!severe && <Row label="Chống chỉ định"><Chk on={noMacFq} set={setNoMacFq}>Chống chỉ định cả macrolid và fluoroquinolon</Chk></Row>}
          </>
        )}
        <Row label="Virus hô hấp"><Chk on={virus} set={setVirus}>Xét nghiệm virus hô hấp dương tính (cúm, RSV hoặc virus khác)</Chk></Row>
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {dx}</p>
          <p><b>Phác đồ</b> {noAbx ? "Đề nghị không kê kháng sinh kinh nghiệm; chỉ dùng phác đồ dưới đây khi nghi đồng nhiễm vi khuẩn." : o.headline}</p>
          <p><b>Thời gian</b> {severe ? "Từ 5 ngày trở lên, sau khi đạt ổn định lâm sàng (Mạnh · thấp)." : "Dưới 5 ngày, tối thiểu 3 ngày, khi đạt ổn định lâm sàng và không có yếu tố cần điều trị dài hơn (Có ĐK · thấp)."}</p>
          {setting === "in" && <p><b>Corticoid</b> {severe ? "Đề nghị dùng sớm; không áp dụng cho viêm phổi nặng do cúm (Có ĐK · thấp)." : "Không dùng, trừ khi có chỉ định khác (Mạnh · thấp)."}</p>}
          <p><b>Hướng dẫn</b> ATS/IDSA 2019; ATS 2025; Lộ trình lâm sàng IDSA</p>
        </div>
        <Legend rows={[...L_GRADE, L_PW]} />
        {virus && (<><h4>Xét nghiệm virus hô hấp dương tính</h4><Rx items={vr.items} /></>)}
        <h4>{noAbx ? "Kháng sinh kinh nghiệm – chỉ khi nghi đồng nhiễm vi khuẩn" : "Kháng sinh kinh nghiệm"}</h4>
        {al && <p className="sa24-warn">Dị ứng penicilin nhẹ – vừa thường dung nạp beta-lactam không phải penicilin; phản ứng tức thì có thể dung nạp cephalosporin thế hệ 3–4 hoặc carbapenem; tránh mọi beta-lactam khi từng có hội chứng Stevens-Johnson hoặc hoại tử thượng bì nhiễm độc (Lộ trình IDSA).</p>}
        {plans.length ? <Plans plans={plans} /> : <p className="sa24-warn">Hướng dẫn không nêu phác đồ thay thế cho người dị ứng beta-lactam ở tình huống này – đánh giá loại, mức độ dị ứng trước khi chọn thuốc.</p>}
        {o.notes.map((n) => <p key={n} className="sa24-tip">{n}</p>)}
        {extra.length > 0 && (<><h4>Điều chỉnh theo nguy cơ MRSA, P. aeruginosa</h4>{extra.map((p) => <PlanCard key={p.title} p={p} />)}</>)}
        <h4>Tình huống đặc biệt</h4>
        <Rx items={capSpecial(ctx)} />
        <h4>{setting === "in" ? "Thời gian điều trị và chuyển đường uống" : "Thời gian điều trị"}</h4>
        <Rx items={capDuration(ctx)} />
      </section>
      <details className="sa24-more"><summary>Xét nghiệm vi sinh và đánh giá mức độ nặng</summary><Rx items={CAP_DIAG} /></details>
    </>
  );
}

function HvTool({ kind, al }: { kind: "hap" | "vap"; al: boolean }) {
  const [stage, setStage] = useState<"empiric" | "directed">("empiric");
  const [ivAbx, setIvAbx] = useState(false);
  const [shock, setShock] = useState(false);
  const [ards, setArds] = useState(false);
  const [hosp5, setHosp5] = useState(false);
  const [rrt, setRrt] = useState(false);
  const [mrsaUnit, setMrsaUnit] = useState(false);
  const [mrsaColon, setMrsaColon] = useState(false);
  const [gnUnit, setGnUnit] = useState(false);
  const [structural, setStructural] = useState(false);
  const [gram, setGram] = useState(false);
  const [pid, setPid] = useState("pa");
  const e = hvPlan({ kind, ivAbx, shock, ards, hosp5, rrt, mrsaUnit, mrsaColon, gnUnit, structural, gram });
  const plan = filterPlans([e.plan], al)[0];
  const p = PATHOGENS.find((x) => x.id === pid) ?? PATHOGENS[0];
  const pd = byAllergy(p.items, al);
  const name = kind === "hap" ? "Viêm phổi bệnh viện (không thở máy)" : "Viêm phổi liên quan thở máy";
  return (
    <>
      <div className="sa24-form">
        <Row label="Giai đoạn"><Seg label="Giai đoạn" value={stage} onChange={setStage} options={[{ id: "empiric", label: "Kinh nghiệm – chưa có kết quả cấy" }, { id: "directed", label: "Đích – đã có tác nhân" }] as const} /></Row>
        {stage === "empiric" ? (kind === "hap" ? (
          <>
            <Row label="Người bệnh">
              <Chk on={shock} set={setShock}>Sốc nhiễm khuẩn hoặc cần hỗ trợ thông khí do viêm phổi</Chk>
              <Chk on={ivAbx} set={setIvAbx}>Đã dùng kháng sinh tĩnh mạch trong 90 ngày qua</Chk>
              <Chk on={mrsaColon} set={setMrsaColon}>Đã từng phát hiện MRSA (cấy hoặc sàng lọc)</Chk>
              <Chk on={structural} set={setStructural}>Giãn phế quản hoặc xơ nang</Chk>
              <Chk on={gram} set={setGram}>Nhuộm Gram đờm đạt chuẩn: nhiều trực khuẩn Gram âm, chiếm ưu thế</Chk>
            </Row>
            <Row label="Dịch tễ khoa"><Chk on={mrsaUnit} set={setMrsaUnit}>Tỷ lệ MRSA trong S. aureus trên 20% hoặc chưa có số liệu</Chk></Row>
          </>
        ) : (
          <>
            <Row label="Nguy cơ đa kháng">
              <Chk on={ivAbx} set={setIvAbx}>Đã dùng kháng sinh tĩnh mạch trong 90 ngày qua</Chk>
              <Chk on={shock} set={setShock}>Sốc nhiễm khuẩn khi khởi phát viêm phổi</Chk>
              <Chk on={ards} set={setArds}>ARDS trước khi khởi phát viêm phổi</Chk>
              <Chk on={hosp5} set={setHosp5}>Nằm viện từ 5 ngày trở lên trước khi khởi phát viêm phổi</Chk>
              <Chk on={rrt} set={setRrt}>Lọc máu cấp trước khi khởi phát viêm phổi</Chk>
            </Row>
            <Row label="Dịch tễ ICU">
              <Chk on={mrsaUnit} set={setMrsaUnit}>Tỷ lệ MRSA trong S. aureus trên 10–20% hoặc chưa có số liệu</Chk>
              <Chk on={gnUnit} set={setGnUnit}>Trên 10% vi khuẩn Gram âm kháng thuốc định dùng đơn trị, hoặc chưa có số liệu</Chk>
              <Chk on={structural} set={setStructural}>Người bệnh giãn phế quản hoặc xơ nang</Chk>
            </Row>
          </>
        )) : (
          <Row label="Tác nhân">
            <select value={pid} onChange={(ev) => setPid(ev.target.value)} aria-label="Tác nhân">
              {PATHOGENS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select>
          </Row>
        )}
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {stage === "empiric" ? `${name}, chưa có kết quả cấy` : `${name} do ${p.label}`}</p>
          {stage === "empiric" && <p><b>Phác đồ</b> {e.headline}</p>}
          {stage === "empiric" && <p><b>Căn cứ</b> {e.why.length ? `Có ${e.why.join("; ")}.` : "Không có yếu tố nguy cơ đa kháng, MRSA."}</p>}
          <p><b>Hướng dẫn</b> {stage === "empiric" || p.source === "2016" ? "IDSA/ATS 2016" : p.source === "2026" ? "IDSA 2026 – vi khuẩn Gram âm kháng thuốc" : "IDSA/ATS 2016; IDSA 2026"}</p>
        </div>
        <Legend rows={stage === "empiric" ? L_GRADE : [...L_GRADE, L_AMR]} />
        {stage === "empiric" ? (
          <>
            <h4>Kháng sinh kinh nghiệm</h4>
            {al && <p className="sa24-warn">Dị ứng penicilin nặng có thể dùng aztreonam thay beta-lactam, kèm thuốc phủ MSSA.</p>}
            {plan && <PlanCard p={plan} />}
            {e.notes.map((n) => <p key={n} className="sa24-tip">{n}</p>)}
            <h4>Tiêu chí áp dụng</h4>
            <Rx items={hvGrades(kind)} />
          </>
        ) : (
          <>
            <h4>Phác đồ đích</h4>
            {pd.state === "filtered" && <p className="sa24-warn">Với vi khuẩn kháng carbapenem, phần lớn thuốc hiệu quả là beta-lactam – cần đánh giá kỹ loại và mức độ dị ứng.</p>}
            {pd.state === "only-bl" && <p className="sa24-warn">Các lựa chọn hiệu quả đều là beta-lactam – đánh giá loại, mức độ dị ứng và hội chẩn trước khi dùng.</p>}
            <ReadHint />
            <Rx items={pd.shown} />
            {(p.notes ?? []).map((n) => <p key={n} className="sa24-tip">{n}</p>)}
            <p className="sa24-tip">Phác đồ đích áp dụng khi đã định danh và có kháng sinh đồ xác nhận nhạy. Liều cho người lớn, chức năng thận và gan bình thường.</p>
          </>
        )}
        <h4>Liều, xuống thang, thời gian điều trị</h4>
        <Rx items={HV_COURSE} />
      </section>
      <details className="sa24-more"><summary>Xét nghiệm vi sinh và chỉ điểm sinh học</summary><Rx items={hvDiagnosis(kind)} /></details>
    </>
  );
}

const TITLE: Record<Kind, string> = { cap: "Viêm phổi cộng đồng – người lớn", hap: "Viêm phổi bệnh viện – người lớn", vap: "Viêm phổi liên quan thở máy – người lớn" };
const SRC: Record<Kind, string> = {
  cap: "ATS/IDSA 2019 – Chẩn đoán và điều trị viêm phổi cộng đồng ở người lớn (Am J Respir Crit Care Med 2019;200:e45–e67); ATS 2025 – cập nhật siêu âm phổi, kháng sinh khi virus dương tính, thời gian kháng sinh, corticoid (Am J Respir Crit Care Med 212(1):24–44; DOI 10.1164/rccm.202507-1692ST; ATS phê duyệt 05/2025, IDSA không phê duyệt); IDSA – Lộ trình lâm sàng viêm phổi cộng đồng",
  hap: "IDSA/ATS 2016 – Điều trị viêm phổi bệnh viện và viêm phổi liên quan thở máy ở người lớn (Clin Infect Dis 2016;63:e61–e111); IDSA 2026 – Điều trị nhiễm khuẩn Gram âm kháng thuốc",
  vap: "IDSA/ATS 2016 – Điều trị viêm phổi bệnh viện và viêm phổi liên quan thở máy ở người lớn (Clin Infect Dis 2016;63:e61–e111); IDSA 2026 – Điều trị nhiễm khuẩn Gram âm kháng thuốc",
};

export default function PneumoniaIntl({ kind }: { kind: Kind }) {
  const [allergy, setAllergy] = useState<"no" | "yes">("no");
  const al = allergy === "yes";
  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo chẩn đoán</p>
        <h3>{TITLE[kind]}</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          {kind === "cap"
            ? <><li>Nơi điều trị</li><li>Mức độ nặng</li><li>Nguy cơ MRSA, P. aeruginosa</li><li>Dị ứng beta-lactam</li><li>Phác đồ, liều, thời gian</li></>
            : <><li>Giai đoạn</li><li>Yếu tố nguy cơ, dịch tễ khoa</li><li>Tác nhân (giai đoạn đích)</li><li>Dị ứng beta-lactam</li><li>Phác đồ, liều, thời gian</li></>}
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Dị ứng beta-lactam"><Seg label="Dị ứng beta-lactam" value={allergy} onChange={setAllergy} options={[{ id: "no", label: "Không" }, { id: "yes", label: "Có" }] as const} /></Row>
      </div>
      {kind === "cap" ? <CapTool al={al} /> : <HvTool kind={kind} al={al} />}
      <p className="sa24-src">Nguồn: {SRC[kind]}. Hướng dẫn quốc tế (bối cảnh Hoa Kỳ), chưa phải phác đồ BV199 phê duyệt; đối chiếu kháng sinh đồ tại chỗ.</p>
      <RxToolStyle />
      <style>{`
        .pn-plan { border: 1px solid #d6e6ea; border-radius: 10px; background: #fff; padding: 10px 12px; display: grid; gap: 8px; }
        .pn-plan-h { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-weight: 800; color: #0b3a5b; font-size: 14.5px; }
        .pn-block { display: grid; gap: 4px; }
        .pn-block-t { margin: 0; font-size: 13px; font-weight: 800; color: #0b3a5b; }
        .pn-plan .sa24-rx { border: 0; border-top: 1px solid #edf2f6; border-radius: 0; }
        .pn-lead { margin: 0; font-size: 13.5px; font-weight: 700; color: #0b6b3a; background: #eef8f2; border-radius: 8px; padding: 6px 10px; }
        .pn-plus { text-align: center; font-size: 20px; font-weight: 800; color: #087f89; line-height: 1; margin: 2px 0; }
        .pn-num { display: inline-grid; place-items: center; width: 18px; height: 18px; margin-right: 6px; border-radius: 50%; background: #087f89; color: #fff; font-size: 11px; }
        .pn-or { display: flex; align-items: center; gap: 8px; margin: 6px 0; color: #6b8293; font-size: 12px; font-weight: 700; text-transform: uppercase; }
        .pn-or::before, .pn-or::after { content: ""; flex: 1; border-top: 1px dashed #cfdde6; }
      `}</style>
    </article>
  );
}
