"use client";

import { useId, useState } from "react";
import { COPD_COLISTIN_SOURCE, COPD_DRUGS, COPD_GROUPS, COPD_REGIMENS, COPD_REVIEWS, COPD_SOURCES, COPD_SOURCE_URL, hasCopdSymptomIndication, type CopdRegimen, type DrugId, type GroupId, type ReviewId, type Setting, type SourceId } from "@/data/antibiotics/copd-2131";
import Link from "next/link";
import { citeSource } from "@/lib/antibiotics/source-citation";
import { clinicalText } from "@/lib/antibiotics/presentation-text";
import { getModuleRationale } from "@/data/antibiotics/empiric/rationale-modules";
import { RationaleAccordion } from "./treatment/TreatmentPanel";
import { copdStyles } from "./copd-2131-styles";
import { EMPIRIC_TREATMENT_UI_RULES, SPECIALIZED_MODULE_LINKS } from "@/lib/antibiotics/empiric-ui-rules";
import SettingTabs from "./treatment/SettingTabs";
import PatientGroupSelect from "./treatment/PatientGroupSelect";
import { patientGroupsFor } from "@/lib/antibiotics/patient-groups";
import { TxStyle } from "./treatment/DoseTable";
import ClinicalNotes from "./treatment/ClinicalNotes";

/* Nguon chi ghi quyet dinh (co quan, so, ten, nam); vi tri muc/bang giu trong du lieu COPD_SOURCES. */
const COPD_CITATION = citeSource("QĐ 2131/QĐ-BYT").label;
/* Mot khoi "Nguồn và đối chiếu" duy nhat (cuoi nhanh, `cite`); cac vi tri khac chi hien "Chi tiết cần thẩm định" khi co.
   Lieu duy tri theo Clcr cua colistin: xem module Hieu chinh lieu (khong lap bang o day). */
function Sources({ reviews = [], cite = false }: { ids: SourceId[]; reviews?: ReviewId[]; cite?: boolean }) {
  if (!cite && !reviews.includes("colistin")) return null;
  return <details className="c26-source"><summary>{cite ? "Nguồn và đối chiếu" : "Colistin – liều nạp và liều duy trì"}</summary>
    {cite && <p><a href={COPD_SOURCE_URL} download>{COPD_CITATION}</a></p>}
    {reviews.includes("colistin") && <div className="c26-evidence-only"><strong>Colistin — liều theo QĐ 2131/QĐ-BYT</strong>
      <p>Theo văn bản: {clinicalText(COPD_COLISTIN_SOURCE.table)}</p>
      <p>Liều nạp theo cân nặng:</p><dl className="c26-renal">{COPD_COLISTIN_SOURCE.loading.map(([weight, dose]) => <div key={weight}><dt>{weight}</dt><dd>{dose}</dd></div>)}</dl>
      <p>Liều duy trì theo chức năng thận: xem module <Link href={SPECIALIZED_MODULE_LINKS.doseAdjustment.href}>{SPECIALIZED_MODULE_LINKS.doseAdjustment.label}</Link>.</p>
      <p>Giữ nguyên ký hiệu MUI của nguồn; không quy đổi giữa mg và MUI khi chưa xác định rõ chế phẩm và quy ước hoạt lực.</p>
    </div>}
  </details>;
}

function DrugTools({ drugId }: { drugId: DrugId }) {
  const drug = COPD_DRUGS[drugId];
  return <div className="c26-tools">
    <details><summary>Hiệu chỉnh liều <span className="c26-sr">{drug.name}</span></summary>
      <p><strong>{drug.name} — người lớn không lọc máu.</strong> Clcr (mL/phút), ưu tiên ước tính bằng Cockcroft–Gault. Xác định liều nền trước khi áp dụng.</p>
      {drug.renal.length > 0 && <dl className="c26-renal">{drug.renal.map(([clcr, dose]) => <div key={clcr}><dt>Clcr {clcr}</dt><dd>{dose}</dd></div>)}</dl>}
      {drug.renalNote && <p>{drug.renalNote}</p>}<Sources ids={["renal"]} reviews={drugId === "colistin" ? ["colistin"] : []} />
    </details>
    <details><summary>Tương tác thuốc <span className="c26-sr">{drug.name}</span></summary>
      <ClinicalNotes items={drug.interactions}/>
      {drug.cautions && <><strong>Lưu ý an toàn</strong><ClinicalNotes items={drug.cautions}/></>}
      <Sources ids={["interaction"]} />
    </details>
  </div>;
}

export function CopdRegimenCard({ regimen, index, hideDuration=false, durationColumn=false }: { regimen: CopdRegimen; index: number; hideDuration?:boolean; durationColumn?:boolean }) {
  return <article className="c26-card" aria-label={`Phác đồ ${index + 1}`} data-regimen={regimen.id}>
    {regimen.kind === "combination" && <p className="c26-condition"><strong>Phối hợp có điều kiện</strong></p>}
    {regimen.condition && <p className="c26-condition"><strong>Điều kiện:</strong> {regimen.condition}</p>}
    {regimen.drugs.map((dose, i) => <div key={dose.drugId} className="c26-drug-block">
      {i>0&&<div className="tx-join" aria-label="Phối hợp với">+ Phối hợp</div>}
      <table className="tx-table tx-table-no-relation c26-dose-table"><thead><tr><th className="tx-drug-heading">Hoạt chất</th><th>Cách dùng</th>{durationColumn&&<th>Thời gian</th>}</tr></thead><tbody><tr className="tx-row">
        <td data-label="Hoạt chất" className="tx-drug"><strong>{COPD_DRUGS[dose.drugId].name}</strong></td>
        <td data-label="Cách dùng"><span data-dose="">{dose.dose}</span> · <span data-route="">{dose.route}</span> · <span data-interval="">{dose.interval}</span></td>
        {durationColumn&&<td data-label="Thời gian">{regimen.duration}</td>}
      </tr></tbody></table>
      {dose.note && <p className="c26-dose-note">{dose.note}</p>}{EMPIRIC_TREATMENT_UI_RULES.showDrugToolsInRegimen && <DrugTools drugId={dose.drugId} />}
    </div>)}
    {!hideDuration && !durationColumn && <p className="c26-duration"><strong>Thời gian điều trị:</strong> {regimen.duration}.</p>}

    <Sources ids={regimen.sourceIds} reviews={regimen.reviewIds} />
  </article>;
}

function FollowUp({ setting }: { setting: Setting }) {
  return <section className="c26-followup"><h4>Hiệu chỉnh và đánh giá lại</h4><ul className="c26-notes">
    <li><strong>Trước khi kê đơn</strong><ul>
      <li>Đối chiếu dị ứng, chức năng thận, bệnh đồng mắc, tác nhân trước đó và độ nhạy kháng sinh tại địa phương.</li>
      <li>Nếu đã dùng kháng sinh trong 3 tháng trước, chọn kháng sinh khác nhóm vừa dùng.</li>
      <li>Hiệu chỉnh liều theo chức năng thận và kiểm tra tương tác: xem module <Link href={SPECIALIZED_MODULE_LINKS.doseAdjustment.href}>{SPECIALIZED_MODULE_LINKS.doseAdjustment.label}</Link> và <Link href={SPECIALIZED_MODULE_LINKS.interactions.href}>{SPECIALIZED_MODULE_LINKS.interactions.label}</Link>. Các điểm “Cần thẩm định” không được dùng làm gợi ý kê đơn tự động.</li>
    </ul></li>
    <li><strong>Đánh giá đáp ứng {setting === "outpatient" ? "sau 3–5 ngày" : "sau 48–72 giờ"}</strong><ul>
      <li>{setting === "outpatient" ? "Nếu cải thiện: tiếp tục kháng sinh, thời gian điều trị thường 5–7 ngày. Azithromycin dùng liệu trình riêng đã nêu ở phác đồ." : "Theo dõi giảm khó thở và giảm đờm mủ. Nếu cải thiện: tiếp tục kháng sinh, thời gian điều trị thường 7–10 ngày."}</li>
      <li>Nếu không cải thiện: nhuộm Gram, cấy đờm hoặc phân tích kết quả đã có; đánh giá lại thuốc giãn phế quản, corticosteroid và bệnh đồng mắc hoặc nguyên nhân khác gây chậm đáp ứng.</li>
      {setting === "inpatient" && <><li>Đổi kháng sinh theo kháng sinh đồ khi lâm sàng không cải thiện và vi khuẩn kháng kháng sinh đang dùng; ưu tiên phổ hẹp khi phù hợp.</li><li>Cân nhắc chuyển tĩnh mạch sang uống khi người bệnh sử dụng được thuốc đường uống.</li></>}
    </ul></li>
  </ul></section>;
}

export default function CopdAntibioticDecision() {
  const uid = useId();
  const [setting, setSetting] = useState<Setting>("outpatient");
  const [groupId, setGroupId] = useState<GroupId | null>(null);
  const [baseId, setBaseId] = useState<DrugId | "">("");
  const [symptoms, setSymptoms] = useState({ purulent: false, increasedDyspnea: false, increasedSputum: false });
  const [assessed, setAssessed] = useState(false);
  const [ventilated, setVentilated] = useState(false);
  const group = COPD_GROUPS.find(g => g.id === groupId);
  const branch = setting;
  const regimens = COPD_REGIMENS.filter(r => r.groupId === groupId && (groupId !== "in-mdr" || r.drugs[0].drugId === baseId));
  const commonDuration=regimens.length>0&&new Set(regimens.map(r=>r.duration)).size===1?regimens[0].duration:undefined;
  function toggleBranch(next: Setting) { setSetting(next); setGroupId(null); setBaseId(""); setVentilated(false); setAssessed(false); setSymptoms({purulent:false,increasedDyspnea:false,increasedSputum:false}); }
  return <section className="bv199-panel copd26" aria-label="Kháng sinh điều trị đợt cấp COPD">
    <SettingTabs items={[{value:'outpatient',label:'Ngoại trú'},{value:'inpatient',label:'Nội trú'}]} value={setting} onChange={next=>toggleBranch(next as Setting)}>
    <section className="c26-indication" aria-labelledby={`${uid}-indication`}>
      <h3 id={`${uid}-indication`}>Chỉ định kháng sinh</h3>
      <p><strong>Đờm mủ VÀ (tăng khó thở HOẶC tăng lượng đờm).</strong></p>
      <Sources ids={["text-out", "text-in", "flow-out"]} reviews={["symptom"]} />
      <details className="c26-symptoms"><summary>Kiểm tra tiêu chí triệu chứng</summary>
        <fieldset><legend>Triệu chứng tăng so với thường ngày</legend>
          {([["purulent", "Đờm mủ"], ["increasedDyspnea", "Tăng khó thở"], ["increasedSputum", "Tăng lượng đờm"]] as const).map(([key, label]) => <label key={key}><input type="checkbox" checked={symptoms[key]} onChange={event => { setSymptoms({ ...symptoms, [key]: event.target.checked }); setAssessed(true); }} />{label}</label>)}
        </fieldset>
        {assessed && <p role="status">{hasCopdSymptomIndication(symptoms) ? "Đạt tiêu chí triệu chứng để chỉ định kháng sinh." : "Chưa đạt tiêu chí triệu chứng; cần đánh giá lâm sàng và nguyên nhân khác. Đờm mủ đơn độc chưa đủ tiêu chí."}</p>}
      </details>
    </section>
    <div className="c26-branches"><div className="c26-branch-body">
        {branch === "inpatient" && <div className="c26-inpatient-indication"><h3>Chỉ định trong nhánh nội trú</h3>
          <p>Đạt tiêu chí triệu chứng ở trên <strong>HOẶC cần thông khí cơ học xâm nhập hoặc không xâm nhập.</strong></p>
          <label><input type="checkbox" checked={ventilated} onChange={event => setVentilated(event.target.checked)} />Cần thông khí cơ học xâm nhập hoặc không xâm nhập</label>
          {ventilated && <p role="status">Có chỉ định kháng sinh liên quan đến thông khí cơ học trong nhánh nội trú.</p>}
          <p>Nếu nghi viêm phổi (sốt, đông đặc trên X-quang) hoặc nhiễm khuẩn nơi khác: đánh giá và điều trị theo bệnh lý tương ứng.</p>
        </div>}
        <PatientGroupSelect key={setting} groups={patientGroupsFor(COPD_GROUPS.filter(g=>g.setting===setting).map(g=>({value:g.id,label:g.title,setting:g.setting,criteria:g.criteria,regimenIds:COPD_REGIMENS.filter(r=>r.groupId===g.id).map(r=>r.id),sources:[...new Set([...g.sourceIds,...g.reviewIds.flatMap(id=>COPD_REVIEWS[id].sources)])].map(id=>COPD_SOURCES[id]),reviewNotes:[]})))} value={groupId??''} onChange={value=>{setGroupId(COPD_GROUPS.find(g=>g.id===value&&g.setting===setting)?.id??null);setBaseId('');}}/>
        {group && <section className="c26-group" aria-label={group.title}>
          <h4>Kháng sinh theo kinh nghiệm</h4>
          {groupId === "in-mdr" && <label className="c26-base-picker">Chọn thuốc nền để xem phác đồ phối hợp có điều kiện<select value={baseId} onChange={event => setBaseId(event.target.value as DrugId | "")}><option value="">Chọn kháng sinh có phổ trên P. aeruginosa</option>{[...new Set(COPD_REGIMENS.filter(r => r.groupId === "in-mdr").map(r => r.drugs[0].drugId))].map(id => <option key={id} value={id}>{COPD_DRUGS[id].name}</option>)}</select></label>}
          <div className="c26-regimens">{regimens.map((r, i) => <div key={r.id}>{i > 0 && <div className="c26-or"><span>Hoặc</span></div>}<CopdRegimenCard regimen={r} index={i} hideDuration={!!commonDuration} durationColumn={!commonDuration&&regimens.length>1}/></div>)}</div>
          {commonDuration && <p className="c26-duration"><strong>Thời gian điều trị:</strong> {commonDuration}.</p>}
          {groupId === "in-mdr" && !baseId && <p>Chưa chọn thuốc nền. Phối hợp chỉ được cân nhắc khi điều kiện lâm sàng và kháng sinh đồ phù hợp.</p>}
          <Sources ids={group.sourceIds} reviews={group.reviewIds} />
          {(() => { const ra = getModuleRationale("copd", group.id); return ra ? <RationaleAccordion rationale={ra} /> : null; })()}
        </section>}
        {group && <FollowUp setting={branch} />}
        <Sources cite ids={branch === "outpatient" ? ["text-out", "flow-out", "risk", "renal", "interaction"] : ["text-in", "flow-in", "table-in", "renal", "interaction"]} />
      </div></div>
    </SettingTabs>
    <TxStyle/><style>{copdStyles}</style>
  </section>;
}
