"use client";
/* Viem phoi – cong cu chon khang sinh theo nguon quoc te.
   kind "cap": ATS/IDSA 2019 + Lo trinh IDSA; "hap" | "vap": IDSA/ATS 2016 + IDSA 2026 (vi khuan Gram am khang thuoc). */
import { useState } from "react";
import {
  CAP_DIAG, CAP_DURATION, CAP_MAJOR, CAP_MINOR, CAP_SPECIAL, HV_COURSE, PATHOGENS,
  capRegimen, hvDiagnosis, hvEmpiric, hvGrades,
} from "./pneumonia-intl";
import { GRADE_LEGEND, Legend, Row, Rx, RxToolStyle, Seg, byAllergy } from "./rx-tool";

type Kind = "cap" | "hap" | "vap";
const LEGEND: [string, string][] = [
  ...GRADE_LEGEND.filter(([k]) => k !== "TH tốt" && k !== "Không nhãn"),
  ["IDSA 2026", "Hướng dẫn điều trị vi khuẩn Gram âm kháng thuốc: xếp “ưu tiên/thay thế” theo đồng thuận chuyên gia, không xếp mức GRADE"],
  ["Lộ trình IDSA", "Bổ sung thực hành của Lộ trình lâm sàng IDSA (VPCD), ngoài nội dung hướng dẫn ATS/IDSA 2019"],
  ["Không nhãn", "Nội dung trong bảng thuốc hoặc phần phân tích của hướng dẫn, không xếp mức"],
];

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
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
  const nMaj = major.filter(Boolean).length;
  const nMin = minor.filter(Boolean).length;
  const severe = setting === "in" && (nMaj >= 1 || nMin >= 3);
  const r = capRegimen({ setting, severe, comorb, macLow, mrsaPrior, paPrior, recentHosp, localMrsa, localPa, nasalPcr, noMacFq });
  const s = byAllergy(r.items, al);
  const dx = setting === "out" ? `Viêm phổi cộng đồng điều trị ngoại trú${comorb ? ", có bệnh đồng mắc" : ", không bệnh đồng mắc"}` : `Viêm phổi cộng đồng nội trú – ${severe ? "nặng" : "không nặng"} (${nMaj} tiêu chuẩn chính, ${nMin} tiêu chuẩn phụ)`;
  const toggle = (arr: boolean[], set: (v: boolean[]) => void, k: number) => set(arr.map((x, j) => (j === k ? !x : x)));
  return (
    <>
      <div className="sa24-form">
        <Row label="Nơi điều trị"><Seg label="Nơi điều trị" value={setting} onChange={setSetting} options={[{ id: "out", label: "Ngoại trú" }, { id: "in", label: "Nội trú" }] as const} /></Row>
        {setting === "out" ? (
          <Row label="Người bệnh">
            <Chk on={comorb} set={setComorb}>Bệnh đồng mắc: tim, phổi, gan, thận mạn; đái tháo đường; nghiện rượu; ung thư; không có lách</Chk>
            {!comorb && <Chk on={macLow} set={setMacLow}>Tỷ lệ phế cầu kháng macrolid tại chỗ &lt; 25%</Chk>}
          </Row>
        ) : (
          <>
            <Row label="Mức độ nặng (1 chính hoặc ≥ 3 phụ)">
              <p className="sa24-tip"><b>Tiêu chuẩn chính</b></p>
              {CAP_MAJOR.map((m, k) => <Chk key={m} on={major[k]} set={() => toggle(major, setMajor, k)}>{m}</Chk>)}
              <p className="sa24-tip"><b>Tiêu chuẩn phụ</b></p>
              {CAP_MINOR.map((m, k) => <Chk key={m} on={minor[k]} set={() => toggle(minor, setMinor, k)}>{m}</Chk>)}
            </Row>
            <Row label="Nguy cơ MRSA, P. aeruginosa">
              <Chk on={mrsaPrior} set={setMrsaPrior}>Từng phân lập MRSA từ đường hô hấp</Chk>
              <Chk on={paPrior} set={setPaPrior}>Từng phân lập P. aeruginosa từ đường hô hấp</Chk>
              <Chk on={recentHosp} set={setRecentHosp}>Nằm viện và dùng kháng sinh đường tiêm trong 90 ngày</Chk>
              {recentHosp && <Chk on={localMrsa} set={setLocalMrsa}>Yếu tố nguy cơ MRSA đã được xác nhận bằng dữ liệu tại chỗ</Chk>}
              {recentHosp && <Chk on={localPa} set={setLocalPa}>Yếu tố nguy cơ P. aeruginosa đã được xác nhận bằng dữ liệu tại chỗ</Chk>}
              {recentHosp && localMrsa && !severe && <Chk on={nasalPcr} set={setNasalPcr}>Có xét nghiệm PCR MRSA ngoáy mũi nhanh</Chk>}
            </Row>
            {!severe && <Row label="Chống chỉ định"><Chk on={noMacFq} set={setNoMacFq}>Chống chỉ định cả macrolid và fluoroquinolon</Chk></Row>}
          </>
        )}
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {dx}</p>
          <p><b>Người bệnh</b> Người lớn, miễn dịch bình thường{al ? ", dị ứng beta-lactam" : ""}</p>
          <p><b>Hướng dẫn</b> ATS/IDSA 2019; Lộ trình lâm sàng VPCD của IDSA</p>
        </div>
        <Legend rows={LEGEND.filter(([k]) => k !== "IDSA 2026")} />
        <h4>Kháng sinh kinh nghiệm</h4>
        {s.state === "filtered" && <p className="sa24-warn">Đã ẩn phác đồ có beta-lactam; còn lại các lựa chọn không phải beta-lactam. Lộ trình IDSA: dị ứng penicilin nhẹ – vừa thường dung nạp beta-lactam không phải penicilin; phản ứng tức thì có thể dung nạp cephalosporin thế hệ 3–4 hoặc carbapenem; tránh mọi beta-lactam khi từng có Stevens-Johnson, hoại tử thượng bì nhiễm độc.</p>}
        {s.state === "only-bl" && <p className="sa24-warn">Hướng dẫn không nêu lựa chọn riêng cho dị ứng beta-lactam ở tình huống này – đánh giá loại, mức độ dị ứng trước khi dùng.</p>}
        <Rx items={s.shown} />
        {r.adds.length > 0 && (<><h4>Điều chỉnh theo nguy cơ MRSA, P. aeruginosa</h4><Rx items={r.adds} /></>)}
        {r.notes.map((n) => <p key={n} className="sa24-tip">{n}</p>)}
        <h4>Tình huống đặc biệt</h4>
        <Rx items={CAP_SPECIAL} />
        <h4>Thời gian và chuyển đường uống</h4>
        <Rx items={CAP_DURATION} />
      </section>
      <details className="sa24-more"><summary>Chẩn đoán vi sinh và phân tầng (ATS/IDSA 2019)</summary><Rx items={CAP_DIAG} /></details>
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
  const [pid, setPid] = useState("pa");
  const e = hvEmpiric({ kind, ivAbx, shock, ards, hosp5, rrt, mrsaUnit, mrsaColon, gnUnit, structural });
  const g = byAllergy(e.gn, al);
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
              <Chk on={shock} set={setShock}>Nguy cơ tử vong cao: cần hỗ trợ thông khí do viêm phổi, hoặc sốc nhiễm khuẩn</Chk>
              <Chk on={ivAbx} set={setIvAbx}>Dùng kháng sinh tĩnh mạch trong 90 ngày</Chk>
              <Chk on={mrsaColon} set={setMrsaColon}>Từng phát hiện MRSA (cấy hoặc sàng lọc)</Chk>
              <Chk on={structural} set={setStructural}>Giãn phế quản, xơ nang; hoặc nhuộm Gram đờm thấy nhiều trực khuẩn Gram âm ưu thế</Chk>
            </Row>
            <Row label="Dịch tễ tại khoa"><Chk on={mrsaUnit} set={setMrsaUnit}>Tỷ lệ MRSA trong S. aureus &gt; 20% hoặc chưa biết</Chk></Row>
          </>
        ) : (
          <>
            <Row label="Yếu tố nguy cơ đa kháng">
              <Chk on={ivAbx} set={setIvAbx}>Dùng kháng sinh tĩnh mạch trong 90 ngày</Chk>
              <Chk on={shock} set={setShock}>Sốc nhiễm khuẩn tại thời điểm VPLQTM</Chk>
              <Chk on={ards} set={setArds}>ARDS trước VPLQTM</Chk>
              <Chk on={hosp5} set={setHosp5}>Nằm viện ≥ 5 ngày trước khi xuất hiện VPLQTM</Chk>
              <Chk on={rrt} set={setRrt}>Lọc máu cấp trước VPLQTM</Chk>
            </Row>
            <Row label="Dịch tễ tại ICU">
              <Chk on={mrsaUnit} set={setMrsaUnit}>Tỷ lệ MRSA trong S. aureus &gt; 10–20% hoặc chưa biết</Chk>
              <Chk on={gnUnit} set={setGnUnit}>&gt; 10% Gram âm kháng thuốc định dùng đơn trị, hoặc chưa có dữ liệu</Chk>
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
          <p><b>Người bệnh</b> Người lớn, không suy giảm miễn dịch{al ? ", dị ứng beta-lactam" : ""}</p>
          {stage === "empiric" && <p><b>Cần bao phủ</b> {`S. aureus${e.mrsa ? " (kể cả MRSA)" : " (MSSA)"}, P. aeruginosa và trực khuẩn Gram âm – ${e.dual ? "hai thuốc kháng Pseudomonas khác nhóm" : "một thuốc kháng Pseudomonas"}`}</p>}
          <p><b>Hướng dẫn</b> {stage === "empiric" ? "IDSA/ATS 2016" : p.source === "2016" ? "IDSA/ATS 2016" : p.source === "2026" ? "IDSA 2026 (vi khuẩn Gram âm kháng thuốc)" : "IDSA/ATS 2016; IDSA 2026"}</p>
        </div>
        <Legend rows={LEGEND.filter(([k]) => k !== "Lộ trình IDSA")} />
        {stage === "empiric" ? (
          <>
            <h4>Kháng sinh Gram âm, kháng Pseudomonas</h4>
            {g.state === "filtered" && <p className="sa24-warn">Đã ẩn beta-lactam. Dị ứng penicilin nặng: có thể dùng aztreonam thay beta-lactam, khi đó phải thêm thuốc phủ MSSA.</p>}
            <Rx items={g.shown} />
            {e.gp.length > 0 && (<><h4>Thuốc chống MRSA</h4><Rx items={e.gp} /></>)}
            {e.notes.map((n) => <p key={n} className="sa24-tip">{n}</p>)}
            <h4>Căn cứ lựa chọn</h4>
            <Rx items={hvGrades(kind)} />
          </>
        ) : (
          <>
            <h4>Phác đồ đích</h4>
            {pd.state === "filtered" && <p className="sa24-warn">Đã ẩn beta-lactam; còn lại các lựa chọn không phải beta-lactam. Với vi khuẩn kháng carbapenem, đánh giá kỹ loại và mức độ dị ứng vì phần lớn thuốc hiệu quả là beta-lactam.</p>}
            {pd.state === "only-bl" && <p className="sa24-warn">Các lựa chọn hiệu quả đều là beta-lactam – đánh giá loại, mức độ dị ứng và hội chẩn dị ứng trước khi dùng.</p>}
            <Rx items={pd.shown} />
            {(p.notes ?? []).map((n) => <p key={n} className="sa24-tip">{n}</p>)}
            <p className="sa24-tip">Liều IDSA 2026: người lớn, chức năng thận và gan bình thường. Phác đồ đích giả định đã có định danh và kháng sinh đồ xác nhận nhạy.</p>
          </>
        )}
        <h4>Liều, xuống thang, thời gian</h4>
        <Rx items={HV_COURSE} />
      </section>
      <details className="sa24-more"><summary>Chẩn đoán vi sinh và chỉ điểm sinh học (IDSA/ATS 2016)</summary><Rx items={hvDiagnosis(kind)} /></details>
    </>
  );
}

const TITLE: Record<Kind, string> = { cap: "Viêm phổi cộng đồng – người lớn", hap: "Viêm phổi bệnh viện – người lớn", vap: "Viêm phổi liên quan thở máy – người lớn" };
const SRC: Record<Kind, string> = {
  cap: "ATS/IDSA 2019 – Chẩn đoán và điều trị viêm phổi cộng đồng ở người lớn (Am J Respir Crit Care Med 2019;200:e45–e67); IDSA – Lộ trình lâm sàng VPCD",
  hap: "IDSA/ATS 2016 – Điều trị viêm phổi bệnh viện và viêm phổi liên quan thở máy ở người lớn (Clin Infect Dis 2016;63:e61–e111); IDSA 2026 – Điều trị nhiễm khuẩn Gram âm kháng thuốc (Clin Infect Dis 2026)",
  vap: "IDSA/ATS 2016 – Điều trị viêm phổi bệnh viện và viêm phổi liên quan thở máy ở người lớn (Clin Infect Dis 2016;63:e61–e111); IDSA 2026 – Điều trị nhiễm khuẩn Gram âm kháng thuốc (Clin Infect Dis 2026)",
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
            ? <><li>Nơi điều trị</li><li>Mức độ nặng</li><li>Nguy cơ MRSA, P. aeruginosa</li><li>Dị ứng beta-lactam</li><li>Kết quả: thuốc, liều, thời gian</li></>
            : <><li>Giai đoạn</li><li>Yếu tố nguy cơ và dịch tễ khoa</li><li>Tác nhân (giai đoạn đích)</li><li>Dị ứng beta-lactam</li><li>Kết quả: thuốc, liều, thời gian</li></>}
        </ol>
      </header>
      <div className="sa24-form">
        <Row label="Dị ứng beta-lactam"><Seg label="Dị ứng beta-lactam" value={allergy} onChange={setAllergy} options={[{ id: "no", label: "Không" }, { id: "yes", label: "Có" }] as const} /></Row>
      </div>
      {kind === "cap" ? <CapTool al={al} /> : <HvTool kind={kind} al={al} />}
      <p className="sa24-src">Nguồn: {SRC[kind]}. Hướng dẫn quốc tế (bối cảnh Hoa Kỳ), chưa phải phác đồ BV199 phê duyệt; đối chiếu kháng sinh đồ tại chỗ.</p>
      <RxToolStyle />
    </article>
  );
}
