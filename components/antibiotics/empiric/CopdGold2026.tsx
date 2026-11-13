"use client";
/* Dot cap COPD – cong cu chon khang sinh theo GOLD 2026. Du lieu: copd-gold2026.ts */
import { useState } from "react";
import {
  CULTURE_TRIGGERS, GOLD_BIOMARKER, GOLD_CULTURE, GOLD_PRINCIPLE, GOLD_PREVENTION, GOLD_ROUTE, NO_INDICATION_HINT, ROME, SYMPTOMS,
  goldCotherapy, goldDuration, goldEmpiric, goldIndication, type Setting, type Severity, type Sym,
} from "./copd-gold2026";
import { Row, Rx, RxToolStyle, Seg, byAllergy } from "./rx-tool";

export default function CopdGold2026() {
  const [sym, setSym] = useState<Record<Sym, boolean>>({ dyspnea: false, fever: false, volume: false, purulence: false });
  const [prior, setPrior] = useState(false);
  const [vent, setVent] = useState(false);
  const [sev, setSev] = useState<Severity>("moderate");
  const [setting, setSetting] = useState<Setting>("out");
  const [culture, setCulture] = useState<string[]>([]);
  const [allergy, setAllergy] = useState<"no" | "yes">("no");
  const al = allergy === "yes";

  const ind = goldIndication(sym, prior, vent);
  const rx = byAllergy(goldEmpiric(), al);
  const drugs = rx.shown;
  const needCulture = culture.length > 0 || vent;
  const rome = ROME.find((r) => r.id === sev)!;
  const toggle = (k: string) => setCulture((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo chẩn đoán</p>
        <h3>Đợt cấp bệnh phổi tắc nghẽn mạn tính (COPD)</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Chỉ định kháng sinh</li><li>Mức độ (Rome) và nơi điều trị</li><li>Yếu tố cần cấy đờm</li><li>Dị ứng beta-lactam</li><li>Kết quả: thuốc, liều, thời gian</li>
        </ol>
      </header>

      <div className="sa24-form">
        <Row label="Triệu chứng đợt cấp">
          <div className="sa24-seg" role="group" aria-label="Triệu chứng">
            {SYMPTOMS.map((s) => (
              <button key={s.id} type="button" className={sym[s.id] ? "on" : undefined} aria-pressed={sym[s.id]} onClick={() => setSym((v) => ({ ...v, [s.id]: !v[s.id] }))}>{s.label}</button>
            ))}
          </div>
          <label className="sa24-chk"><input type="checkbox" checked={prior} onChange={(e) => setPrior(e.target.checked)} /> Cấy đờm dương tính trong đợt cấp trước</label>
          <label className="sa24-chk"><input type="checkbox" checked={vent} onChange={(e) => setVent(e.target.checked)} /> Cần thông khí cơ học (xâm nhập hoặc không xâm nhập)</label>
        </Row>
        <Row label="Mức độ (Rome)">
          <Seg label="Mức độ" value={sev} onChange={setSev} options={ROME} />
          <p className="sa24-tip">{rome.criteria}</p>
        </Row>
        <Row label="Nơi điều trị">
          <Seg label="Nơi điều trị" value={setting} onChange={setSetting} options={[{ id: "out", label: "Ngoại trú" }, { id: "in", label: "Nội trú" }] as const} />
        </Row>
        <Row label="Yếu tố cần cấy đờm">
          {CULTURE_TRIGGERS.map((c) => (
            <label key={c} className="sa24-chk"><input type="checkbox" checked={culture.includes(c) || (c.includes("thông khí") && vent)} disabled={c.includes("thông khí")} onChange={() => toggle(c)} /> {c}</label>
          ))}
        </Row>
        <Row label="Dị ứng beta-lactam">
          <Seg label="Dị ứng beta-lactam" value={allergy} onChange={setAllergy} options={[{ id: "no", label: "Không" }, { id: "yes", label: "Có" }] as const} />
        </Row>
      </div>

      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> Đợt cấp COPD mức độ {rome.label.toLowerCase()}, điều trị {setting === "out" ? "ngoại trú" : "nội trú"}</p>
          <p><b>Người bệnh</b> Người lớn{al ? ", dị ứng beta-lactam" : ""}</p>
          <p><b>Chỉ định kháng sinh</b> {ind.yes ? `Có – ${ind.reasons.join("; ")}` : "Chưa đủ tiêu chí"}</p>
          <p><b>Hướng dẫn</b> GOLD 2026 (v1.3)</p>
        </div>

        {!ind.yes ? (
          <>
            <p className="sa24-warn">Chưa có chỉ định kháng sinh theo GOLD. {NO_INDICATION_HINT(sym)} Chỉ định khi: ≥ 2 trong 4 triệu chứng (tăng khó thở, sốt, tăng lượng đờm, tăng đờm mủ) và có tăng đờm mủ; hoặc cấy đờm dương tính đợt trước; hoặc cần thông khí cơ học.</p>
            <h4>Chỉ điểm sinh học</h4>
            <Rx items={GOLD_BIOMARKER} />
          </>
        ) : (
          <>
            <h4>Kháng sinh kinh nghiệm</h4>
            <Rx items={[GOLD_PRINCIPLE]} />
            {rx.state === "filtered" && <p className="sa24-warn">Đã ẩn aminopenicilin + acid clavulanic; còn lại các nhóm không phải beta-lactam GOLD nêu.</p>}
            <Rx items={drugs} />
            <p className="sa24-tip">Liều lấy từ phác đồ QĐ 2131/QĐ-BYT (tab Việt Nam), người lớn chức năng thận bình thường.</p>
            {needCulture && (<><h4>Cấy đờm – nguy cơ Gram âm, vi khuẩn kháng thuốc</h4><Rx items={[GOLD_CULTURE]} /></>)}
            <h4>Đường dùng</h4>
            <Rx items={setting === "out" ? GOLD_ROUTE.slice(0, 1) : GOLD_ROUTE} />
            <h4>Thời gian điều trị</h4>
            <Rx items={goldDuration(setting)} />
            <h4>Chỉ điểm sinh học</h4>
            <Rx items={GOLD_BIOMARKER.slice(0, 2)} />
          </>
        )}

        <h4>Điều trị kèm theo</h4>
        <Rx items={goldCotherapy(sev)} />
      </section>

      <details className="sa24-more">
        <summary>Dự phòng đợt cấp bằng kháng sinh dài hạn (GOLD 2026)</summary>
        <Rx items={GOLD_PREVENTION} />
      </details>

      <p className="sa24-src">Nguồn: GOLD 2026 – Global Strategy for Prevention, Diagnosis and Management of COPD, v1.3 (08/12/2025): quản lý đợt cấp và dự phòng đợt cấp. GOLD không gán mức bằng chứng cho các khuyến cáo kháng sinh trong đợt cấp. Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt.</p>

      <RxToolStyle />
    </article>
  );
}
