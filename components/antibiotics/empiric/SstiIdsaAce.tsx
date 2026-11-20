"use client";
/* Nhiem khuan da – mo mem – cong cu chon khang sinh theo IDSA 2014 va ACE Singapore 2026 (kem Supplement 2). Du lieu: ssti-idsa2014-ace2026.ts */
import { useState } from "react";
import {
  ACE_SEVERE, AGE_OPTS, BITE_OPTS, CULTURE_OPTS, FORM_OPTS, FORM_TIP, IMP_OPTS, PATHOGEN_OPTS, READ_HINT, RED_FLAGS, REFERRAL,
  SEV2_OPTS, SEV3_OPTS, SEV_TIP, SIRS_IDSA, SITE_OPTS, SYSTEMIC, groupRows, sstiPlan,
  type StrategyKind,
  type Age, type BiteKind, type Culture, type Form, type ImpSub, type Pathogen, type Sev, type SsiSite,
} from "./ssti-idsa2014-ace2026";
import { Row, Rx, RxToolStyle, Seg, SourceList } from "./rx-tool";
import { citeIntlSources } from "@/lib/antibiotics/source-citation";

const STRAT_LABEL: Record<StrategyKind, string> = { mono: "ĐƠN TRỊ", combo: "PHỐI HỢP", mixed: "ĐƠN TRỊ / PHỐI HỢP", none: "KHÔNG KHÁNG SINH" };

/* Nhan da the hien don tri/phoi hop: bo phan lap o dau tieu de. */
const stratTitle = (t: string) => { const x = t.replace(/^(Đơn trị|Phối hợp|Không dùng kháng sinh) – /, ""); return x[0].toUpperCase() + x.slice(1); };

function Chk({ on, set, children }: { on: boolean; set: (v: boolean) => void; children: string }) {
  return <label className="sa24-chk"><input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} /> {children}</label>;
}

export default function SstiIdsaAce({ initialForm = "cellulitis", initialAge = "adult" }: { initialForm?: Form; initialAge?: Age }) {
  const [form, setFormRaw] = useState<Form>(initialForm);
  const [age, setAge] = useState<Age>(initialAge);
  const [sev, setSev] = useState<Sev>("mild");
  const [aceSevere, setAceSevere] = useState(false);
  const [highRisk, setHighRisk] = useState(false);
  const [pcnAllergy, setPcnAllergy] = useState(false);
  const [impSub, setImpSub] = useState<ImpSub>("impetigo");
  const [mrsa, setMrsa] = useState(false);
  const [culture, setCulture] = useState<Culture>("none");
  const [recurrent, setRecurrent] = useState(false);
  const [site, setSite] = useState<SsiSite>("clean");
  const [pathogen, setPathogen] = useState<Pathogen>("empiric");
  const [bite, setBite] = useState<BiteKind>("animal");
  const [infected, setInfected] = useState(true);
  const [immuno, setImmuno] = useState(false);
  const setForm = (f: Form) => { setFormRaw(f); setSev("mild"); setAceSevere(false); };

  const graded = form === "impetigo" || form === "purulent" || form === "cellulitis";
  const sevOpts = form === "impetigo" ? SEV2_OPTS : SEV3_OPTS;
  const o = sstiPlan({ form, age, sev, aceSevere, highRisk, pcnAllergy, impSub, mrsa, culture, recurrent, site, pathogen, bite, infected, immuno });
  const formLabel = FORM_OPTS.find((x) => x.id === form)!.label;
  const sevLabel = graded ? sevOpts.find((x) => x.id === sev)?.label : undefined;
  const mrsaLabel = form === "cellulitis"
    ? "Nguy cơ MRSA: chấn thương xuyên, nhiễm MRSA nơi khác, mang MRSA ở mũi, tiêm chích ma túy, chảy mủ"
    : form === "ssi" ? "Nguy cơ MRSA cao: mang MRSA ở mũi, tiền sử nhiễm MRSA, mới nằm viện, mới dùng kháng sinh" : "Nghi ngờ hoặc xác định MRSA";

  return (
    <article className="sa24">
      <header>
        <p className="sa24-eyebrow">Lựa chọn kháng sinh theo chẩn đoán</p>
        <h3>Nhiễm khuẩn da – mô mềm</h3>
        <ol className="sa24-flow" aria-label="Trình tự lựa chọn">
          <li>Dấu hiệu cảnh báo</li><li>Thể bệnh</li><li>Mức độ</li><li>Phác đồ, liều</li><li>Thời gian, chuyển tuyến</li>
        </ol>
      </header>
      <p className="sa24-warn" role="alert">{RED_FLAGS}</p>
      <div className="sa24-form">
        <Row label="Thể bệnh">
          <Seg label="Thể bệnh" value={form} onChange={setForm} options={FORM_OPTS} />
          <p className="sa24-tip">{FORM_TIP[form]}</p>
        </Row>
        <Row label="Đối tượng">
          <Seg label="Đối tượng" value={age} onChange={setAge} options={AGE_OPTS} />
        </Row>
        {form === "impetigo" && (
          <Row label="Tổn thương">
            <Seg label="Tổn thương" value={impSub} onChange={setImpSub} options={IMP_OPTS} />
          </Row>
        )}
        {graded && (
          <Row label="Mức độ">
            <Seg label="Mức độ" value={sev} onChange={setSev} options={sevOpts} />
            {form !== "impetigo" && <p className="sa24-tip">IDSA: {SEV_TIP[form][sev]} {SIRS_IDSA}</p>}
            <p className="sa24-tip">ACE – nặng khi có bệnh cảnh toàn thân hoặc: {ACE_SEVERE[form]}. {SYSTEMIC}</p>
          </Row>
        )}
        {form === "purulent" && sev !== "mild" && (
          <Row label="Kết quả cấy">
            <Seg label="Kết quả cấy" value={culture} onChange={setCulture} options={CULTURE_OPTS} />
          </Row>
        )}
        {form === "ssi" && (
          <Row label="Vị trí phẫu thuật">
            <Seg label="Vị trí phẫu thuật" value={site} onChange={setSite} options={SITE_OPTS} />
          </Row>
        )}
        {form === "nec" && (
          <Row label="Tác nhân">
            <Seg label="Tác nhân" value={pathogen} onChange={setPathogen} options={PATHOGEN_OPTS} />
          </Row>
        )}
        {form === "bite" && (
          <Row label="Loại vết cắn">
            <Seg label="Loại vết cắn" value={bite} onChange={setBite} options={BITE_OPTS} />
          </Row>
        )}
        <Row label="Yếu tố bổ sung">
          {graded && sev === "mild" && <Chk on={aceSevere} set={setAceSevere}>Có tiêu chí nặng khác theo ACE (không đáp ứng điều trị đầu tay, lan rộng, tiến triển nhanh…)</Chk>}
          {graded && <Chk on={highRisk} set={setHighRisk}>Nguy cơ biến chứng cao: suy giảm miễn dịch, đái tháo đường, bệnh da kèm theo</Chk>}
          {(form === "impetigo" && impSub !== "folliculitis") || (form === "cellulitis" && sev !== "severe") || form === "ssi" ? <Chk on={mrsa} set={setMrsa}>{mrsaLabel}</Chk> : null}
          {(form === "purulent" || form === "cellulitis") && <Chk on={recurrent} set={setRecurrent}>Tái phát</Chk>}
          {form === "pyo" && <Chk on={immuno} set={setImmuno}>Suy giảm miễn dịch, bệnh nền, chấn thương hở vào cơ</Chk>}
          {form === "bite" && <Chk on={infected} set={setInfected}>Vết cắn đã nhiễm khuẩn</Chk>}
          {form !== "pyo" && <Chk on={pcnAllergy} set={setPcnAllergy}>Dị ứng penicilin</Chk>}
        </Row>
      </div>
      <section className="sa24-out" aria-live="polite">
        <div className="sa24-dx">
          <p><b>Chẩn đoán</b> {form === "impetigo" ? IMP_OPTS.find((x) => x.id === impSub)!.label : formLabel}{sevLabel ? ` – ${sevLabel.toLowerCase()}` : ""}{age === "child" ? " (trẻ em)" : ""}</p>
          <p><b>Phác đồ</b> {o.headline}</p>
          <p><b>Hướng dẫn</b> {graded ? "ACE 2026; IDSA 2014" : "IDSA 2014"}</p>
        </div>
        {o.strategy && (
          <div className={`ssti-strat ssti-strat-${o.strategy.kind}`}>
            <p className="ssti-strat-head"><span className="ssti-badge">{STRAT_LABEL[o.strategy.kind]}</span> {stratTitle(o.strategy.title)}</p>
            <p className="ssti-strat-sub">Lúc nào đơn trị, lúc nào phối hợp</p>
            <ul>{o.strategy.rules.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        )}
        <p className="sa24-tip">{READ_HINT}</p>
        {o.blocks.map((b) => (
          <div key={b.title}>
            <h4>{b.title}</h4>
            {b.lead && <p className="sa24-lead">{b.lead}</p>}
            {groupRows(b.items).map((g) => (
              <div key={g.kind} className="ssti-grp">
                {g.label && <p className={`ssti-grp-h ssti-grp-${g.kind}`}>{g.label}</p>}
                <Rx items={g.items} />
              </div>
            ))}
          </div>
        ))}
        {o.avoid.length > 0 && (<><h4>Không khuyến cáo</h4><Rx items={o.avoid} /></>)}
        {o.notes.length > 0 && (<><h4>Lưu ý</h4><ul className="sp-notes">{o.notes.map((n) => <li key={n}>{n}</li>)}</ul></>)}
        <details className="sa24-more">
          <summary>Cân nhắc chuyển tuyến chuyên khoa, tuyến cuối (ACE)</summary>
          <ul className="sp-notes">{REFERRAL.map((n) => <li key={n}>{n}</li>)}</ul>
          <p className="sa24-tip">Nhiễm trùng bàn chân đái tháo đường: xem mặt bệnh riêng (IWGDF/IDSA 2023).</p>
        </details>
      </section>
      <SourceList sources={[...citeIntlSources(["idsa-ssti-2014", "ace-ssti-2026"]), { key: "dailymed-labels", label: "Thông tin kê đơn theo từng chế phẩm", detail: "DailyMed · Thư viện Y khoa Quốc gia Hoa Kỳ", url: "https://dailymed.nlm.nih.gov/dailymed/" }]} notes={["IDSA: mức khuyến cáo theo GRADE (mạnh, yếu; chất lượng bằng chứng cao, trung bình, thấp). ACE không xếp mức khuyến cáo.","Liều của ACE theo tờ hướng dẫn sử dụng được HSA Singapore phê duyệt, đối chiếu UpToDate, MIMS.","Liều đối chiếu với thông tin kê đơn của FDA: linezolid, daptomycin, ceftarolin, piperacilin-tazobactam, ampicilin-sulbactam, ertapenem, meropenem, imipenem-cilastatin, cefotaxim, metronidazol, clindamycin, vancomycin, gentamicin, doxycyclin.","Liều trẻ em theo nhãn thuốc: linezolid, ampicilin-sulbactam, imipenem-cilastatin, ertapenem, cefotaxim, gentamicin, doxycyclin.","Đối chiếu ngày 16/11/2026.","Hướng dẫn quốc tế, chưa phải phác đồ BV199 phê duyệt."]} />
      <RxToolStyle />
      <style>{`.ssti-strat { border: 1px solid #cfdde6; border-left: 5px solid #0b3a5b; border-radius: 10px; background: #fff; padding: 10px 12px; display: grid; gap: 4px; }
.ssti-strat-mono { border-left-color: #0b6b3a; } .ssti-strat-combo { border-left-color: #1d4f8a; } .ssti-strat-mixed { border-left-color: #8a5a00; } .ssti-strat-none { border-left-color: #6b8293; }
.ssti-strat-head { margin: 0; font-size: 14.5px; font-weight: 800; color: #0f2236; line-height: 1.5; }
.ssti-badge { display: inline-block; border-radius: 6px; padding: 1px 8px; margin-right: 6px; font-size: 12px; font-weight: 800; letter-spacing: .03em; color: #fff; background: #0b3a5b; }
.ssti-strat-mono .ssti-badge { background: #0b6b3a; } .ssti-strat-combo .ssti-badge { background: #1d4f8a; } .ssti-strat-mixed .ssti-badge { background: #8a5a00; } .ssti-strat-none .ssti-badge { background: #6b8293; }
.ssti-strat-sub { margin: 4px 0 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; color: #4b6576; }
.ssti-strat ul { margin: 0; padding-left: 18px; display: grid; gap: 3px; font-size: 13px; line-height: 1.55; color: #33505f; }
.ssti-grp { display: grid; gap: 4px; margin-top: 6px; }
.ssti-grp-h { margin: 4px 0 0; font-size: 13px; font-weight: 800; color: #0b6b3a; }
.ssti-grp-combo { color: #1d4f8a; } .ssti-grp-either { color: #8a5a00; }
.sp-notes { margin: 0; padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.55; color: #33505f; }`}</style>
    </article>
  );
}
