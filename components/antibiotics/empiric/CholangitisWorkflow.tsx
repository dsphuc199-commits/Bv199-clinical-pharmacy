import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  cholangitisChoices, cholangitisCombination, cholangitisCourse, tg18Diagnosis, tg18Severity,
  type CholangitisResult, type CourseException, type OrganStatus, type SourceControl, type TG18SeverityAssessment,
} from "@/lib/antibiotics/cholangitis-plan";
import type { IntlGuideline } from "@/schema/intl-guideline";
import CholangitisCards from "./CholangitisCards";

const field = "mt-1 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900";
const diagnosisCriteria = [
  { id: "a", name: "A · Viêm toàn thân", detail: "Sốt >38 °C hoặc rét run. Bạch cầu <4.000 hoặc >10.000/mm³, hoặc CRP ≥1 mg/dL." },
  { id: "b", name: "B · Ứ mật", detail: "Bilirubin toàn phần ≥2 mg/dL, hoặc ALP, GGT, AST hay ALT >1,5 lần giới hạn trên bình thường." },
  { id: "c", name: "C · Hình ảnh", detail: "Giãn đường mật hoặc thấy nguyên nhân như sỏi, hẹp hay stent trên hình ảnh." },
] as const;
const gradeLabels = { i: "Độ I · nhẹ", ii: "Độ II · trung bình", iii: "Độ III · nặng" };

const organCriteria = [
  { id: "cardiovascular", name: "Tuần hoàn", detail: "Hạ huyết áp cần dopamin ≥5 µg/kg/phút hoặc noradrenalin ở bất kỳ liều nào." },
  { id: "neurologic", name: "Thần kinh", detail: "Rối loạn ý thức." },
  { id: "respiratory", name: "Hô hấp", detail: "PaO₂/FiO₂ <300." },
  { id: "renal", name: "Thận", detail: "Thiểu niệu hoặc creatinin huyết thanh >2,0 mg/dL." },
  { id: "hepatic", name: "Gan", detail: "PT-INR >1,5." },
  { id: "hematologic", name: "Huyết học", detail: "Tiểu cầu <100.000/mm³." },
];

const moderateCriteria = [
  { id: "wbc", name: "Bạch cầu", detail: ">12.000 hoặc <4.000/mm³." },
  { id: "fever", name: "Nhiệt độ", detail: "≥39 °C." },
  { id: "age", name: "Tuổi", detail: "≥75 tuổi." },
  { id: "bilirubin", name: "Bilirubin toàn phần", detail: "≥5 mg/dL." },
  { id: "albumin", name: "Albumin huyết thanh", detail: "<0,7 × giới hạn dưới bình thường của labo." },
];

function CriteriaChecklist({ criteria, selected, onChange }: {
  criteria: typeof organCriteria;
  selected: readonly string[];
  onChange: (selected: string[]) => void;
}) {
  return (
    <ul className="m-0 grid list-none gap-1 p-0">
      {criteria.map(({ id, name, detail }) => (
        <li key={id}>
          <label className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 hover:bg-white has-[:checked]:bg-teal-100">
            <input
              type="checkbox"
              className="mt-0.5 shrink-0 accent-teal-800"
              checked={selected.includes(id)}
              onChange={(e) => onChange(e.target.checked ? [...selected, id] : selected.filter((criterion) => criterion !== id))}
            />
            <span className="min-w-0 text-xs leading-relaxed text-slate-700">
              <strong className="text-sm text-slate-900">{name}</strong>{" "}{detail}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}

export function CholangitisAssessment({ apply, manualControl }: { apply: (severity: string) => void; manualControl: ReactNode }) {
  const [findings, setFindings] = useState({ a: false, b: false, c: false });
  const [manual, setManual] = useState(false);
  const [assessment, setAssessment] = useState<TG18SeverityAssessment>({
    organFindings: [], noOrganDysfunction: false, moderateFindings: [], moderateReviewed: false,
  });
  const grade = tg18Severity(assessment);

  const updateAssessment = (next: TG18SeverityAssessment) => {
    setAssessment(next);
    apply(tg18Severity(next));
  };

  return (
    <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4" aria-label="Phân độ nặng theo TG18">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="!m-0 !text-base !font-bold">Xác định độ nặng theo TG18</h4>
        {manualControl && (
          <button type="button" className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 hover:border-teal-400"
            onClick={() => {
              setManual(!manual);
              if (manual) apply(grade);
            }}
          >
            {manual ? "Phân độ theo tiêu chí" : "Chọn độ đã xác định"}
          </button>
        )}
      </div>
      {manual ? manualControl : (
        <>
          <div className="grid gap-2.5 lg:grid-cols-2">
            <fieldset className="grid min-w-0 content-start gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 pb-2.5">
              <legend className="px-1 text-sm font-bold text-slate-900">{gradeLabels.iii}</legend>
              <p className="m-0 px-2 text-xs leading-relaxed text-slate-700">Tích các dấu hiệu suy cơ quan mới xuất hiện. Một dấu hiệu đủ để xếp Độ III.</p>
              <CriteriaChecklist criteria={organCriteria} selected={assessment.organFindings} onChange={(organFindings) => updateAssessment({ ...assessment, organFindings, noOrganDysfunction: false })} />
              <label className="flex items-start gap-2 border-t border-slate-200 px-2 pt-2 text-xs font-semibold text-slate-800">
                <input type="checkbox" className="mt-0.5 shrink-0 accent-teal-800" checked={assessment.noOrganDysfunction} disabled={assessment.organFindings.length > 0}
                  onChange={(e) => updateAssessment({ ...assessment, noOrganDysfunction: e.target.checked })} />
                Đã đánh giá và không có dấu hiệu suy cơ quan
              </label>
            </fieldset>
            <fieldset className="grid min-w-0 content-start gap-1.5 rounded-xl border border-teal-100 bg-teal-50/50 px-2.5 pb-2.5">
              <legend className="px-1 text-sm font-bold text-slate-900">{gradeLabels.ii}</legend>
              <p className="m-0 px-2 text-xs leading-relaxed text-slate-700">Xếp Độ II khi có ít nhất 2 tiêu chí và đã loại trừ Độ III.</p>
              <CriteriaChecklist criteria={moderateCriteria} selected={assessment.moderateFindings} onChange={(moderateFindings) => updateAssessment({ ...assessment, moderateFindings, moderateReviewed: false })} />
              <label className="flex items-start gap-2 border-t border-teal-100 px-2 pt-2 text-xs font-semibold text-slate-800">
                <input type="checkbox" className="mt-0.5 shrink-0 accent-teal-800" checked={assessment.moderateReviewed}
                  onChange={(e) => updateAssessment({ ...assessment, moderateReviewed: e.target.checked })} />
                Đã đối chiếu đủ 5 tiêu chí Độ II
              </label>
              <p className="m-0 px-2 text-xs leading-relaxed text-slate-700"><strong>Độ I · nhẹ</strong> khi đã loại trừ suy cơ quan và chỉ có 0–1 tiêu chí Độ II sau đánh giá.</p>
            </fieldset>
          </div>
          <p role="status" className="m-0 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-950">
            <strong>{grade === "pending" ? "Chưa đủ dữ kiện phân độ" : gradeLabels[grade]}</strong>
            <span className="ml-2 text-xs">{assessment.organFindings.length > 0
              ? `${assessment.organFindings.length}/6 dấu hiệu suy cơ quan`
              : `${assessment.moderateFindings.length}/5 tiêu chí Độ II`}</span>
          </p>
        </>
      )}
      <details className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-900">Đối chiếu chẩn đoán TG18</summary>
        <div className="mt-2 grid gap-2">
          <fieldset className="grid gap-2 md:grid-cols-3" aria-label="Tiêu chí chẩn đoán TG18">
            {diagnosisCriteria.map(({ id, name, detail }) => (
              <label key={id} className="grid content-start gap-1 rounded-lg bg-slate-50 p-2.5">
                <span className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={findings[id]} onChange={(e) => setFindings({ ...findings, [id]: e.target.checked })} />{name}</span>
                <span className="text-xs leading-relaxed text-slate-700">{detail}</span>
              </label>
            ))}
          </fieldset>
          <p className="m-0 text-teal-900" role="status">{tg18Diagnosis(findings.a, findings.b, findings.c)}</p>
        </div>
      </details>
    </section>
  );
}

export function CholangitisPlan({ result, severity, setting, junction, sources }: {
  result: CholangitisResult; severity: string; setting: string; junction: string; sources: IntlGuideline["sources"];
}) {
  const [selected, setSelected] = useState("");
  const [selectVre, setSelectVre] = useState("");
  const [needsPseudomonas, setNeedsPseudomonas] = useState(false);
  const [gram, setGram] = useState<OrganStatus>("pending");
  const [renal, setRenal] = useState<"pending" | "stable" | "adjust">("pending");
  const [control, setControl] = useState<SourceControl>("pending");
  const [exception, setException] = useState<CourseException>("pending");
  const communityMild = setting === "community" && (severity === "i" || severity === "ii");
  const choices = cholangitisChoices(result, communityMild && needsPseudomonas);
  const options = [...choices.base, ...choices.alternatives];
  const fallback = communityMild && !needsPseudomonas ? options.find((drug) => drug.role === "Ceftriaxon") : undefined;
  const base = options.find((drug) => drug.role === selected) ?? fallback ?? options[0];
  const vre = choices.vre.find((drug) => drug.role === selectVre) ?? choices.vre[0];
  const gramAgent = vre ?? (setting === "community" || gram === "yes" ? choices.enterococcus : undefined);
  const gramPending = setting === "healthcare" && !vre && gram === "pending";
  const course = cholangitisCourse(control, exception);
  const drainage = result.before.find(({ id }) => id.startsWith("drainage-"));
  const drainageInfo = drainage && <div className="rounded-lg bg-white px-3 py-2 text-sm"><strong>{drainage.title}</strong>{drainage.bullets.map(({ text }) => <p key={text} className="m-0 mt-1">{text}</p>)}</div>;
  if (!result.primary || severity === "pending" || setting === "pending") return (
    <div className="my-3 grid gap-2 rounded-xl border border-teal-100 bg-teal-50 p-3 text-sm text-teal-950">
      <p role="status" className="m-0">
        {severity === "pending" ? "Xác định độ nặng theo TG18 để xem phương án kháng sinh."
          : setting === "pending" ? "Chọn bối cảnh mắc bệnh để xem phương án kháng sinh."
          : "Chưa có phương án kháng sinh khớp dữ kiện đã chọn."}
      </p>
      {drainageInfo}
    </div>
  );
  const combination = base ? cholangitisCombination(base.role, junction, Boolean(gramAgent), gramPending) : null;
  const drugs = base ? [base, ...(gramAgent ? [gramAgent] : []), ...(combination?.addAnaerobic && choices.anaerobic ? [choices.anaerobic] : [])] : [];
  const drugCards = renal === "adjust" ? drugs.map((drug) => ({ ...drug, dose: undefined, administration: undefined })) : drugs;
  return (
    <section className="my-3 grid gap-3 rounded-2xl border border-teal-200 bg-teal-50/50 p-3 sm:p-4" aria-label="Phương án kháng sinh đang xem">
      <header>
        <h4 className="!m-0 !text-base">Phương án kháng sinh đang xem</h4>
        {result.summary.map(({ label, text }) => <p key={label} className="m-0 mt-1 text-sm text-slate-700"><strong>{label}</strong> · {text}</p>)}
      </header>
      {drainageInfo}
      <div className="grid gap-3 sm:grid-cols-2">
        {communityMild && <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={needsPseudomonas} onChange={(e) => setNeedsPseudomonas(e.target.checked)} />Cần bao phủ Pseudomonas sau đánh giá</label>}
        {setting === "healthcare" && !vre && <label className="block text-sm font-semibold">Chỉ định phủ Enterococcus hoặc Gram dương kháng thuốc
          <select className={field} value={gram} onChange={(e) => setGram(e.target.value as OrganStatus)}>
            <option value="pending">Chưa đánh giá</option><option value="yes">Có chỉ định phối hợp vancomycin</option><option value="no">Không phối hợp theo đánh giá</option>
          </select>
        </label>}
        {vre && <label className="block text-sm font-semibold">Chọn thuốc thay vancomycin
          <select className={field} value={vre.role} onChange={(e) => setSelectVre(e.target.value)}>
            {choices.vre.map(({ role }) => <option key={role}>{role}</option>)}
          </select>
        </label>}
        {base && <label className="block text-sm font-semibold">Thuốc nền hoặc thuốc thay thế
          <select className={field} value={base.role} onChange={(e) => setSelected(e.target.value)}>
            {choices.base.length > 0 && <optgroup label="Thuốc nền trong nhánh đã chọn">{choices.base.map(({ role }) => <option key={role}>{role}</option>)}</optgroup>}
            {choices.alternatives.length > 0 && <optgroup label="Thay thế có điều kiện">{choices.alternatives.map(({ role }) => <option key={role}>{role}</option>)}</optgroup>}
          </select>
        </label>}
      </div>
      {choices.alternatives.length > 0 && (
        <div className="grid gap-1.5">
          <p className="m-0 text-xs font-semibold text-slate-700">Thay thế có điều kiện</p>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Thuốc thay thế có điều kiện">
            {choices.alternatives.map(({ role }) => (
              <button key={role} type="button" aria-pressed={role === base?.role} onClick={() => setSelected(role)}
                className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-900 aria-pressed:bg-teal-100">
                {role}
              </button>
            ))}
          </div>
        </div>
      )}
      {base && combination ? (
        <div className="grid gap-2">
          <label className="block text-sm font-semibold sm:max-w-sm">Chức năng thận để đối chiếu liều
            <select className={field} value={renal} onChange={(e) => setRenal(e.target.value as typeof renal)}>
              <option value="pending">Chưa đánh giá · xem liều tham khảo</option>
              <option value="stable">Ổn định, CrCl &gt;60 mL/phút, chưa lọc máu</option>
              <option value="adjust">CrCl ≤60, thận không ổn định hoặc đang lọc máu</option>
            </select>
          </label>
          <p className="m-0 text-sm font-bold text-teal-900" aria-live="polite">{combination.mode} · {drugs.map(({ role }) => role).join(" + ")}</p>
          {renal === "adjust" && (
            <p className="m-0 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950" role="status">
              Cần đối chiếu liều từng thuốc theo CrCl, diễn biến thận và phương thức lọc máu. <Link href="/antibiotics/dosing" className="font-semibold underline">Mở hiệu chỉnh liều BV199</Link>.
            </p>
          )}
          <CholangitisCards items={drugCards} sources={sources} />
          {combination.mode === "Cần xác nhận phối hợp" && <p className="m-0 text-xs leading-relaxed text-amber-950">{gramPending ? "Cần xác nhận chỉ định phủ Gram dương. " : ""}{junction === "pending" ? "Cần xác nhận có miệng nối mật–ruột. " : ""}{base.role === "Aztreonam" && !gramAgent ? "Đánh giá thuốc phủ Gram dương phù hợp khi dùng aztreonam. " : ""}</p>}
          {renal !== "adjust" && <p className="m-0 text-xs leading-relaxed text-slate-700">Liều tham khảo người lớn có chức năng thận ổn định, chủ yếu CrCl &gt;60 mL/phút, chưa lọc máu. Đối chiếu vi sinh, dị ứng và hiệu chỉnh theo chức năng cơ quan trước khi kê.</p>}
        </div>
      ) : <p className="m-0 text-sm text-amber-950" role="status">TG18 không liệt kê thuốc nền kháng Pseudomonas cho nhánh này. Rà phân độ, vi sinh và hội chẩn để chọn phác đồ.</p>}
      <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <h4 className="!m-0">Thời gian dùng</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-sm font-semibold">Kiểm soát ổ nhiễm
            <select className={field} value={control} onChange={(e) => setControl(e.target.value as SourceControl)}>
              <option value="pending">Chưa xác nhận</option><option value="controlled">Đã kiểm soát ổ nhiễm</option><option value="uncontrolled">Chưa kiểm soát hoặc còn tắc mật</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Yếu tố ảnh hưởng thời gian
            <select className={field} value={exception} onChange={(e) => setException(e.target.value as CourseException)}>
              <option value="pending">Chưa đánh giá đủ</option><option value="none">Đã rà và không có yếu tố kéo dài</option><option value="gram-positive">Cấy máu có cầu khuẩn Gram dương</option><option value="abscess">Có áp-xe gan</option>
            </select>
          </label>
        </div>
        <div role="status" className="text-sm"><strong className="text-teal-900">{course.title}</strong><p className="m-0 mt-1 text-slate-700">{course.detail}</p></div>
      </div>
    </section>
  );
}
