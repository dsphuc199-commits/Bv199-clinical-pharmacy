"use client";
/* Viem xuong tuy – cong cu chon khang sinh theo nguon quoc te:
   nguoi lon WikiGuidelines 2022 (cap nhat 2025); tre 1 thang – < 18 tuoi PIDS/IDSA 2021. Du lieu: osteomyelitis-intl.ts */
import { useState } from "react";
import {
  ADULT_TYPES, P_AGENTS, P_CRITICAL, P_DEFINITIVE, P_DVT, P_KINGELLA, P_OTHER, P_PRINCIPLES, P_ROUTE, P_SURGERY, P_TIMING,
  W_GPOS_NOTE, W_PRINCIPLES, W_ROUTE, W_TIMING, W_ULCER, adultDuration, adultEmpiric, adultOral, pedsDuration, pedsEmpiric,
  type AdultType, type MrsaRate, type Severity,
} from "./osteomyelitis-intl";
import type { RxItem } from "./septic-arthritis-pids2023";
import { GRADE_LEGEND, Legend, ReadHint, Row, Rx, RxToolStyle, Seg, byAllergy } from "./rx-tool";

type Src = "wiki" | "pids";
type Stage = "empiric" | "directed";

const WIKI_LEGEND: [string, string][] = [
  ["KC rõ", "Khuyến cáo rõ: có bằng chứng tiến cứu, có đối chứng, lặp lại được, xác nhận giả thuyết"],
  ["TQ lâm sàng", "Tổng quan lâm sàng: bằng chứng chưa đủ để đưa khuyến cáo rõ; trình bày lựa chọn hợp lý đã có dữ liệu"],
  ["Không nhãn", "Thuốc trong bảng lựa chọn hoặc bảng liều của hướng dẫn"],
];

export default function OsteomyelitisIntl() {
  const [src, setSrc] = useState<Src>("wiki");
  const [type, setType] = useState<AdultType>("native");
  const [mrsaRisk, setMrsaRisk] = useState(false);
  const [pseudo, setPseudo] = useState(false);
  const [anaer, setAnaer] = useState(false);
  const [stage, setStage] = useState<Stage>("empiric");
  const [mrsa, setMrsa] = useState<MrsaRate>("low");
  const [clinda, setClinda] = useState<MrsaRate>("low");
  const [sev, setSev] = useState<Severity>("stable");
  const [kk, setKk] = useState(false);
  const [other, setOther] = useState(false);
  const [agentId, setAgentId] = useState("mssa");
  const [allergy, setAllergy] = useState<"no" | "yes">("no");
  const al = allergy === "yes";
  const wiki = src === "wiki";

  let timing: RxItem[] = [];
  let start: RxItem[] = [];
  let principle: RxItem[] = [];
  let extra: RxItem[] = [];
  let oral: RxItem[] = [];
  let route: RxItem[] = [];
  let dur: RxItem[] = [];
  let notes: string[] = [];
  let dx = "";
  let who = "";
  let covers = "";

  if (wiki) {
    who = "Người lớn";
    const t = ADULT_TYPES.find((x) => x.id === type)!;
    dx = `Viêm xương tủy – ${t.label.charAt(0).toLowerCase() + t.label.slice(1)}`;
    if (type === "ulcer") {
      start = W_ULCER;
    } else {
      timing = W_TIMING;
      const e = adultEmpiric(type, { mrsa: mrsaRisk, pseudo, anaer });
      start = e.items;
      notes = e.notes;
      oral = adultOral(type);
      route = W_ROUTE;
      covers = `Cầu khuẩn Gram dương (nhất là S. aureus) và trực khuẩn Gram âm${mrsaRisk ? "; MRSA" : ""}${pseudo ? "; P. aeruginosa" : ""}${anaer ? "; vi khuẩn kỵ khí" : ""}`;
    }
    dur = adultDuration(type);
  } else {
    who = "Trẻ 1 tháng – < 18 tuổi (không áp dụng sơ sinh)";
    route = P_ROUTE;
    if (stage === "empiric") {
      dx = "Viêm xương tủy cấp đường máu, chưa có kết quả cấy";
      timing = P_TIMING;
      start = pedsEmpiric(mrsa, clinda, sev);
      extra = [...(sev === "severe" ? P_CRITICAL : []), ...(kk ? [P_KINGELLA] : []), ...(other ? [P_OTHER] : [])];
      covers = `S. aureus${mrsa === "high" ? " (kể cả MRSA)" : ""}${kk ? "; K. kingae" : ""}`;
      dur = pedsDuration(true);
    } else {
      const a = P_AGENTS.find((x) => x.id === agentId) ?? P_AGENTS[0];
      dx = `Viêm xương tủy cấp đường máu do ${a.label.startsWith("Phế") || a.label.startsWith("Không") ? a.label.charAt(0).toLowerCase() + a.label.slice(1) : a.label}`;
      principle = [P_DEFINITIVE];
      start = a.iv;
      oral = a.oral;
      extra = a.sa ? [P_DVT] : [];
      dur = pedsDuration(a.sa);
    }
  }

  /* Dong nguyen tac tach khoi bang thuoc (khong co cot lieu). */
  principle = [...principle, ...start.filter((i) => i.role === "Nguyên tắc")];
  start = start.filter((i) => i.role !== "Nguyên tắc");
  const s = byAllergy(start, al);
  const o = byAllergy(oral, al);
  const pickSrc = (v: Src) => { setSrc(v); setStage("empiric"); };

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo chẩn đoán</p>
        <h3>Viêm xương tủy</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Hướng dẫn</li><li>Thể bệnh hoặc giai đoạn</li><li>Yếu tố nguy cơ / tác nhân</li><li>Dị ứng beta-lactam</li><li>Kết quả: thuốc, liều, chuyển uống, thời gian</li>
        </ol>
      </header>

      <div className="sa24-form">
        <Row label="Hướng dẫn">
          <Seg label="Hướng dẫn" value={src} onChange={pickSrc} options={[{ id: "wiki", label: "WikiGuidelines 2022/2025 · người lớn" }, { id: "pids", label: "PIDS/IDSA 2021 · trẻ 1 tháng – < 18 tuổi" }] as const} />
        </Row>
        {wiki ? (
          <>
            <Row label="Thể bệnh">
              <select value={type} onChange={(e) => setType(e.target.value as AdultType)} aria-label="Thể bệnh">
                {ADULT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </Row>
            {type !== "ulcer" && (
              <Row label="Yếu tố nguy cơ">
                <label className="sa24-chk"><input type="checkbox" checked={mrsaRisk} onChange={(e) => setMrsaRisk(e.target.checked)} /> MRSA: mang MRSA, từng nhiễm MRSA, tiếp xúc cơ sở y tế có MRSA lưu hành</label>
                <label className="sa24-chk"><input type="checkbox" checked={pseudo} onChange={(e) => setPseudo(e.target.checked)} /> P. aeruginosa: nhiều đợt kháng sinh trước, từng cấy ra P. aeruginosa, vết thương hoại tử, phẫu thuật gần đây, viêm tai ngoài ác tính</label>
                {(type === "native") && <label className="sa24-chk"><input type="checkbox" checked={anaer} onChange={(e) => setAnaer(e.target.checked)} /> Vết thương hoại tử hoặc nghi nhiễm kỵ khí</label>}
              </Row>
            )}
          </>
        ) : (
          <>
            <Row label="Giai đoạn">
              <Seg label="Giai đoạn" value={stage} onChange={setStage} options={[{ id: "empiric", label: "Kinh nghiệm – chưa có kết quả cấy" }, { id: "directed", label: "Đích – đã có tác nhân" }] as const} />
            </Row>
            {stage === "empiric" ? (
              <>
                <Row label="Tỷ lệ MRSA tại chỗ">
                  <Seg label="Tỷ lệ MRSA" value={mrsa} onChange={setMrsa} options={[{ id: "low", label: "< 10–20%" }, { id: "high", label: "≥ 10–20%" }] as const} />
                </Row>
                {mrsa === "high" && (
                  <Row label="S. aureus kháng clindamycin">
                    <Seg label="Kháng clindamycin" value={clinda} onChange={setClinda} options={[{ id: "low", label: "< 10–20%" }, { id: "high", label: "≥ 10–20%" }] as const} />
                  </Row>
                )}
                <Row label="Mức độ">
                  <Seg label="Mức độ" value={sev} onChange={setSev} options={[{ id: "stable", label: "Ổn định, không nhiễm độc" }, { id: "severe", label: "Vừa – nặng, nguy kịch" }] as const} />
                  <label className="sa24-chk"><input type="checkbox" checked={kk} onChange={(e) => setKk(e.target.checked)} /> Trẻ tuổi mẫu giáo hoặc nghi K. kingae</label>
                  <label className="sa24-chk"><input type="checkbox" checked={other} onChange={(e) => setOther(e.target.checked)} /> Bệnh hemoglobin, nuôi bò sát, tiêm chủng chưa đủ</label>
                </Row>
              </>
            ) : (
              <Row label="Tác nhân">
                <select value={agentId} onChange={(e) => setAgentId(e.target.value)} aria-label="Tác nhân">
                  {P_AGENTS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </Row>
            )}
          </>
        )}
        <Row label="Dị ứng beta-lactam">
          <Seg label="Dị ứng beta-lactam" value={allergy} onChange={setAllergy} options={[{ id: "no", label: "Không" }, { id: "yes", label: "Có" }] as const} />
        </Row>
      </div>

      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {dx}</p>
          <p><b>Người bệnh</b> {who}{al ? ", dị ứng beta-lactam" : ""}</p>
          {covers && <p><b>Cần bao phủ</b> {covers}</p>}
          <p><b>Hướng dẫn</b> {wiki ? "WikiGuidelines 2022, cập nhật 2025" : "PIDS/IDSA 2021"}</p>
        </div>

        <Legend rows={wiki ? WIKI_LEGEND : GRADE_LEGEND} />

        {timing.length > 0 && (<><h4>Thời điểm khởi trị</h4><Rx items={timing} /></>)}

        <h4>{wiki ? (type === "ulcer" ? "Chỉ định kháng sinh" : "Kháng sinh kinh nghiệm – đường tĩnh mạch") : stage === "empiric" ? "Kháng sinh kinh nghiệm – đường tĩnh mạch" : "Phác đồ đích – đường tĩnh mạch"}</h4>
        {principle.length > 0 && <Rx items={principle} />}
        {s.state === "only-bl" && <p className="sa24-warn">Hướng dẫn chưa nêu thuốc thay thế cho người dị ứng beta-lactam ở tình huống này; đánh giá loại, mức độ dị ứng và hội chẩn trước khi dùng.</p>}
        <ReadHint />
        <Rx items={s.shown} />
        {wiki && type !== "ulcer" && <p className="sa24-tip">Luôn điều chỉnh theo độ nhạy tại chỗ và kết quả cấy.</p>}
        {notes.map((n) => <p key={n} className="sa24-tip">{n}</p>)}
        {extra.length > 0 && (<><h4>Tình huống đặc biệt</h4><Rx items={extra.filter((i) => i.dose)} /><Rx items={extra.filter((i) => !i.dose)} /></>)}

        {route.length > 0 && (<><h4>Chuyển đường uống</h4><Rx items={route} /></>)}
        {o.shown.length > 0 && (<><h4>{wiki ? "Kháng sinh uống (kinh nghiệm hoặc nối tiếp)" : "Thuốc uống nối tiếp"}</h4><Rx items={o.shown} /></>)}
        {wiki && type !== "ulcer" && <p className="sa24-tip">{W_GPOS_NOTE}</p>}

        {!wiki && (<><h4>Can thiệp ngoại khoa</h4><Rx items={P_SURGERY} /></>)}

        <h4>Thời gian điều trị</h4>
        <Rx items={dur} />
      </section>

      <details className="sa24-more">
        <summary>Nguyên tắc chung ({wiki ? "WikiGuidelines" : "PIDS/IDSA 2021"})</summary>
        {(wiki ? W_PRINCIPLES : P_PRINCIPLES).map((p) => (<div key={p.title} className="sa24-pblock"><h5>{p.title}</h5><Rx items={p.items} /></div>))}
      </details>

      <p className="sa24-src">Nguồn: {wiki
        ? "WikiGuidelines – Spellberg B và cs. JAMA Netw Open 2022;5(5):e2211321; cập nhật 2025: Am J Med 2026;139(4):395–398"
        : "PIDS/IDSA 2021 – Hướng dẫn chẩn đoán và điều trị viêm xương tủy cấp đường máu ở trẻ em (J Pediatric Infect Dis Soc 2021;10(8):801–844)"}. Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt.</p>

      <RxToolStyle />
    </article>
  );
}
