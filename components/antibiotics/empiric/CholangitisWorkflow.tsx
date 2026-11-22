import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  cholangitisChoices, cholangitisCombination, cholangitisCourse, tg18Diagnosis, tg18Severity,
  type CholangitisResult, type CourseException, type OrganStatus, type SourceControl, type TG18SeverityAssessment,
} from "@/lib/antibiotics/cholangitis-plan";
import { effectiveState, resolve, type OutItem } from "@/lib/intl-rules";
import type { IntlGuideline } from "@/schema/intl-guideline";
import CholangitisAntibioticTable, { type CholangitisAntibioticGroup } from "./CholangitisAntibioticTable";
import { Seg } from "./rx-tool";

const field = "mt-1 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900";
const diagnosisCriteria = [
  { id: "a", name: "A · Viêm toàn thân", detail: "Sốt >38 °C hoặc rét run. Bạch cầu <4.000 hoặc >10.000/mm³, hoặc CRP ≥1 mg/dL." },
  { id: "b", name: "B · Ứ mật", detail: "Bilirubin toàn phần ≥2 mg/dL, hoặc ALP, GGT, AST hay ALT >1,5 lần giới hạn trên bình thường." },
  { id: "c", name: "C · Hình ảnh", detail: "Giãn đường mật hoặc thấy nguyên nhân như sỏi, hẹp hay stent trên hình ảnh." },
] as const;
const gradeLabels = { i: "Độ I · nhẹ", ii: "Độ II · trung bình", iii: "Độ III · nặng" };
type TG18Grade = keyof typeof gradeLabels;
const gradeGuide = [
  { id: "i", criteria: "Đã đánh giá đủ, không có suy cơ quan và có 0–1 tiêu chí Độ II." },
  { id: "ii", criteria: "Có ít nhất 2/5 tiêu chí Độ II và đã loại trừ suy cơ quan." },
  { id: "iii", criteria: "Có ít nhất 1 dấu hiệu suy cơ quan mới xuất hiện." },
] as const;

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

function CholangitisOverview({ guideline, setting, severity }: { guideline: IntlGuideline; setting: string; severity: string }) {
  const healthcare = setting === "healthcare";
  const overview = useMemo(() => {
    const context = healthcare ? "healthcare" : "community";
    const resultFor = (grade: TG18Grade) => resolve(guideline, effectiveState(guideline.axes, { severity: grade, setting: context }));
    const mild = cholangitisChoices(resultFor("i"), false);
    if (healthcare) return { healthcare: mild, community: null };

    const moderate = resultFor("ii");
    const standard = cholangitisChoices(moderate, false);
    const broad = cholangitisChoices(moderate, true);
    const broadRoles = [...broad.base, ...broad.alternatives].map(({ role }) => role);
    const standardRoles = standard.base.filter(({ role }) => !broadRoles.includes(role)).map(({ role }) => role);
    return {
      healthcare: null,
      community: { mild, standardRoles, broadRoles, severe: cholangitisChoices(resultFor("iii"), false) },
    };
  }, [guideline, healthcare]);
  const community = overview.community;
  const enterococcusAgent = community?.severe.enterococcus?.role;
  const treatment = community && {
    i: community.mild.baseLead,
    ii: [
      community.standardRoles.length > 0 && `${community.standardRoles.join(" hoặc ")} khi phổ phù hợp.`,
      community.broadRoles.length > 0 && `Khi cần kháng Pseudomonas, cân nhắc ${community.broadRoles.join(", ")}.`,
    ].filter(Boolean).join(" "),
    iii: [
      community.severe.base.length > 0 && `Thuốc nền kháng Pseudomonas gồm ${community.severe.base.map(({ role }) => role).join(", ")}. Cân nhắc carbapenem khi có chỉ định.`,
      enterococcusAgent && `Phối hợp ${enterococcusAgent} để bao phủ Enterococcus.`,
    ].filter(Boolean).join(" "),
  };

  return (
    <div className="@container grid gap-2" role="region" aria-label="Tổng quan phân độ và kháng sinh TG18">
      <p className="m-0 text-xs font-semibold text-teal-900">
        {healthcare ? "Phân độ TG18 · Liên quan chăm sóc y tế" : "Kháng sinh tham khảo · Mắc phải cộng đồng"}
      </p>
      <ol className="m-0 grid list-none gap-2 p-0 @min-[42rem]:grid-cols-3">
        {gradeGuide.map(({ id, criteria }) => (
          <li key={id} aria-current={severity === id ? true : undefined}
            className="grid min-w-0 content-start gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 aria-[current=true]:border-teal-600 aria-[current=true]:bg-teal-50">
            <h5 className="m-0 text-sm font-bold text-slate-900">{gradeLabels[id]}</h5>
            <p className="m-0 text-xs leading-relaxed text-slate-700">{criteria}</p>
            {treatment?.[id] && <p className="m-0 break-words border-t border-slate-200 pt-1.5 text-xs leading-relaxed text-slate-800">{treatment[id]}</p>}
          </li>
        ))}
      </ol>
      {overview.healthcare && (
        <div className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-xs leading-relaxed text-teal-950">
          <p className="m-0"><strong>Kháng sinh tham khảo ở cả ba độ</strong> · {overview.healthcare.baseLead}</p>
          {overview.healthcare.base.length > 0 && <p className="m-0 mt-1">Thuốc nền gồm {overview.healthcare.base.map(({ role }) => role).join(", ")}. Đánh giá chỉ định phủ Enterococcus hoặc Gram dương kháng thuốc.</p>}
        </div>
      )}
    </div>
  );
}

export function CholangitisAssessment({ apply, manualControl, guideline, severity, setting }: {
  apply: (severity: string) => void; manualControl: ReactNode; guideline: IntlGuideline; severity: string; setting: string;
}) {
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
      <CholangitisOverview guideline={guideline} severity={severity} setting={setting} />
      {manual ? manualControl : (
        <>
          <div className="grid gap-2.5 lg:grid-cols-2">
            <fieldset className="grid min-w-0 content-start gap-1.5 rounded-xl border border-teal-100 bg-teal-50/50 px-2.5 pb-2.5">
              <legend className="px-1 text-sm font-bold text-slate-900">Tiêu chí Độ II</legend>
              <CriteriaChecklist criteria={moderateCriteria} selected={assessment.moderateFindings} onChange={(moderateFindings) => updateAssessment({ ...assessment, moderateFindings, moderateReviewed: false })} />
              <label className="flex items-start gap-2 border-t border-teal-100 px-2 pt-2 text-xs font-semibold text-slate-800">
                <input type="checkbox" className="mt-0.5 shrink-0 accent-teal-800" checked={assessment.moderateReviewed}
                  onChange={(e) => updateAssessment({ ...assessment, moderateReviewed: e.target.checked })} />
                Đã đối chiếu đủ 5 tiêu chí Độ II
              </label>
            </fieldset>
            <fieldset className="grid min-w-0 content-start gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 pb-2.5">
              <legend className="px-1 text-sm font-bold text-slate-900">Dấu hiệu suy cơ quan · Độ III</legend>
              <CriteriaChecklist criteria={organCriteria} selected={assessment.organFindings} onChange={(organFindings) => updateAssessment({ ...assessment, organFindings, noOrganDysfunction: false })} />
              <label className="flex items-start gap-2 border-t border-slate-200 px-2 pt-2 text-xs font-semibold text-slate-800">
                <input type="checkbox" className="mt-0.5 shrink-0 accent-teal-800" checked={assessment.noOrganDysfunction} disabled={assessment.organFindings.length > 0}
                  onChange={(e) => updateAssessment({ ...assessment, noOrganDysfunction: e.target.checked })} />
                Đã đánh giá và không có dấu hiệu suy cơ quan
              </label>
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

type RenalStatus = "pending" | "stable" | "adjust";

type CholangitisPlanProps = {
  guideline: IntlGuideline;
  result: CholangitisResult;
  severity: string;
  setting: string;
  junction: string;
  sources: IntlGuideline["sources"];
};

const gradeOptions = gradeGuide.map(({ id }) => ({ id, label: gradeLabels[id] }));
const isTG18Grade = (value: string): value is TG18Grade => gradeOptions.some(({ id }) => id === value);

export function CholangitisPlan(props: CholangitisPlanProps) {
  const [renal, setRenal] = useState<RenalStatus>("pending");
  return <CholangitisGradePlan key={props.severity + "-" + props.setting} {...props} renal={renal} setRenal={setRenal} />;
}

function CholangitisGradePlan({ guideline, result, severity, setting, junction, sources, renal, setRenal }: CholangitisPlanProps & {
  renal: RenalStatus;
  setRenal: (value: RenalStatus) => void;
}) {
  const [tableGrade, setTableGrade] = useState<TG18Grade>(isTG18Grade(severity) ? severity : "i");
  const [selected, setSelected] = useState("");
  const [selectVre, setSelectVre] = useState("");
  const [needsPseudomonas, setNeedsPseudomonas] = useState(false);
  const [gram, setGram] = useState<OrganStatus>("pending");
  const [control, setControl] = useState<SourceControl>("pending");
  const [exception, setException] = useState<CourseException>("pending");
  const context = setting === "healthcare" ? "healthcare" : "community";
  const canChoose = Boolean(result.primary) && severity === tableGrade && (setting === "community" || setting === "healthcare");
  const communityNonSevere = setting === "community" && (severity === "i" || severity === "ii");
  const reference = useMemo(() => {
    const scenario = { severity: tableGrade, setting: context, anastomosis: "present" };
    const standard = resolve(guideline, effectiveState(guideline.axes, scenario));
    const vre = resolve(guideline, effectiveState(guideline.axes, { ...scenario, vre_community: true, vre_risk: true }));
    return { choices: cholangitisChoices(standard, false), vre: cholangitisChoices(vre, false).vre, notes: standard.notes };
  }, [guideline, tableGrade, context]);

  const actual = cholangitisChoices(result, communityNonSevere && needsPseudomonas);
  const choices = canChoose ? actual : reference.choices;
  const options = [...choices.base, ...choices.alternatives];
  const base = canChoose ? options.find((item) => item.role === selected) : undefined;
  const needsVre = canChoose && actual.vre.length > 0;
  const vre = needsVre ? actual.vre.find((item) => item.role === selectVre) : undefined;
  const gramAgent = needsVre ? vre : setting === "community" || gram === "yes" ? actual.enterococcus : undefined;
  const gramPending = needsVre ? !vre : setting === "healthcare" && gram === "pending";
  const gramPrompt = needsVre ? "Chọn một thuốc bao phủ VRE trong bảng. " : "Xác nhận chỉ định phủ Gram dương. ";

  const combinationFor = (role: string) => {
    const choice = cholangitisCombination(role, junction, Boolean(gramAgent), gramPending);
    const adjuncts = [gramAgent, choice.addAnaerobic ? actual.anaerobic : undefined].filter((item) => item !== undefined);
    return { mode: choice.mode, adjuncts };
  };
  const plan = base && combinationFor(base.role);
  const selectedRoles = base && plan ? [base.role, ...plan.adjuncts.map(({ role }) => role)] : vre ? [vre.role] : [];

  function backboneRelation(item: OutItem) {
    if (canChoose) {
      const { mode, adjuncts } = combinationFor(item.role);
      return [mode, ...adjuncts.map(({ role }) => role)].join(" · ");
    }

    const needsAnaerobes = cholangitisCombination(item.role, "present", false, false).addAnaerobic;
    const gramRelation = context === "healthcare" ? "Đánh giá chỉ định phối hợp phủ Gram dương."
      : tableGrade === "iii" ? "Phối hợp thuốc phủ Enterococcus."
        : "Đơn trị khi thuốc đủ phổ.";
    return needsAnaerobes ? gramRelation + " Thêm metronidazol nếu có miệng nối mật–ruột." : gramRelation;
  }

  const adjuncts = [reference.choices.anaerobic, needsVre ? undefined : reference.choices.enterococcus].filter((item) => item !== undefined);
  const groups: CholangitisAntibioticGroup[] = [
    { label: "Thuốc nền · chọn một", items: choices.base, relation: backboneRelation, choose: canChoose ? setSelected : undefined },
    { label: "Thuốc thay thế · thay cho thuốc nền khi phù hợp", items: choices.alternatives, relation: backboneRelation, choose: canChoose ? setSelected : undefined },
    {
      label: "Thuốc bổ sung để phối hợp",
      items: adjuncts,
      relation: (item) => item === reference.choices.anaerobic
        ? "Thêm khi có miệng nối mật–ruột và thuốc nền thiếu phổ kỵ khí."
        : context === "healthcare" ? "Thêm khi có chỉ định phủ Enterococcus hoặc Gram dương kháng thuốc."
          : "Phối hợp phủ Enterococcus ở Độ III mắc phải cộng đồng.",
    },
    { label: "Khi cần bao phủ VRE · chọn một thuốc thay vancomycin", items: needsVre ? actual.vre : reference.vre, relation: () => "Thay vancomycin trong phối hợp với thuốc nền.", choose: needsVre ? setSelectVre : undefined },
  ];

  const renalAdjustment = renal === "adjust";
  const course = cholangitisCourse(control, exception);
  const drainage = result.before.find(({ id }) => id.startsWith("drainage-"));
  const notes = canChoose ? result.notes : reference.notes;

  return (
    <section className="my-3 grid min-w-0 gap-3 rounded-2xl border border-teal-200 bg-teal-50/50 p-3 sm:p-4" aria-label="Bảng kháng sinh theo từng độ TG18">
      <header className="grid gap-1">
        <h4 className="!m-0 !text-base !font-bold">Bảng kháng sinh theo từng độ TG18</h4>
        <p className="m-0 text-sm text-slate-700">
          <strong>{gradeLabels[tableGrade]}</strong> · {context === "healthcare" ? "Liên quan chăm sóc y tế" : "Mắc phải cộng đồng"} · {canChoose ? "Ca đang đánh giá" : "Xem tham khảo"}
        </p>
        <Seg label="Xem bảng theo độ" value={tableGrade} options={gradeOptions} onChange={setTableGrade} />
        <Link href="/antibiotics/antibiogram" className="w-fit text-xs font-semibold text-teal-800 underline underline-offset-2">Đối chiếu kháng sinh đồ BV199</Link>
      </header>

      {!canChoose && (
        <p className="m-0 text-sm text-slate-700" role="status">
          {isTG18Grade(severity) && tableGrade !== severity
            ? <>Phân độ ca đang đánh giá là <strong>{gradeLabels[severity]}</strong>. Mở bảng đúng độ để chọn thuốc cho ca này.</>
            : "Xác định độ nặng và bối cảnh mắc bệnh ở trên để chọn thuốc trực tiếp trong bảng."}
        </p>
      )}
      {drainage && tableGrade === severity && (
        <div className="rounded-lg bg-white px-3 py-2 text-sm">
          <strong>{drainage.title}</strong>
          {drainage.bullets.map(({ text }) => <p key={text} className="m-0 mt-1">{text}</p>)}
        </div>
      )}
      {canChoose && communityNonSevere && (
        <label className="flex items-start gap-2 text-sm font-semibold">
          <input className="mt-0.5 accent-teal-800" type="checkbox" checked={needsPseudomonas} onChange={(e) => setNeedsPseudomonas(e.target.checked)} />
          Cần bao phủ Pseudomonas sau đánh giá
        </label>
      )}
      {canChoose && setting === "healthcare" && !needsVre && (
        <label className="block text-sm font-semibold sm:max-w-md">Chỉ định phủ Enterococcus hoặc Gram dương kháng thuốc
          <select className={field} value={gram} onChange={(e) => setGram(e.target.value as OrganStatus)}>
            <option value="pending">Chưa đánh giá</option>
            <option value="yes">Có chỉ định phối hợp vancomycin</option>
            <option value="no">Không phối hợp theo đánh giá</option>
          </select>
          <span className="mt-1 block text-xs font-normal text-slate-700">Đánh giá tình trạng định cư hoặc nghi ngờ Gram dương kháng thuốc, gồm Enterococcus và MRSA.</span>
        </label>
      )}

      <label className="block text-sm font-semibold sm:max-w-md">Chức năng thận để đối chiếu liều
        <select className={field} value={renal} onChange={(e) => setRenal(e.target.value as RenalStatus)}>
          <option value="pending">Chưa đánh giá · xem liều tham khảo</option>
          <option value="stable">Ổn định, CrCl &gt;60 mL/phút, chưa lọc máu</option>
          <option value="adjust">CrCl ≤60, thận không ổn định hoặc đang lọc máu</option>
        </select>
      </label>
      {renalAdjustment ? (
        <p className="m-0 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950" role="status">
          Đối chiếu liều từng thuốc theo CrCl, diễn biến thận và phương thức lọc máu. <Link href="/antibiotics/dosing" className="font-semibold underline">Mở hiệu chỉnh liều BV199</Link>.
        </p>
      ) : <p className="m-0 text-xs leading-relaxed text-slate-700">Liều tham khảo cho người lớn có CrCl &gt;60 mL/phút ổn định và chưa lọc máu. Hàm lượng ghi theo danh mục BV199 hoặc nhãn chế phẩm.</p>}

      {base && plan ? (
        <div className="grid gap-1 rounded-lg border border-teal-200 bg-white px-3 py-2">
          <p className="m-0 text-sm font-bold text-teal-900" aria-live="polite">{plan.mode} · {selectedRoles.join(" + ")}</p>
          {plan.mode === "Cần xác nhận phối hợp" && (
            <p className="m-0 text-xs leading-relaxed text-amber-950">
              {gramPending && gramPrompt}
              {junction === "pending" && cholangitisCombination(base.role, "present", false, false).addAnaerobic && "Xác nhận tình trạng miệng nối mật–ruột. "}
              {base.role === "Aztreonam" && !gramAgent && "Đánh giá bổ sung phủ Gram dương khi dùng aztreonam."}
            </p>
          )}
        </div>
      ) : canChoose && options.length > 0 ? (
        <p className="m-0 text-sm text-slate-700" role="status">Chọn một thuốc nền hoặc thuốc thay thế trong bảng để xem phương án phối hợp.</p>
      ) : null}

      {options.length > 0 ? (
        <CholangitisAntibioticTable groups={groups} sources={sources} selected={selectedRoles} renalAdjustment={renalAdjustment} />
      ) : (
        <p className="m-0 text-sm text-slate-700" role="status">
          {severity === "i" && needsPseudomonas ? "TG18 không liệt kê thuốc nền kháng Pseudomonas ở Độ I mắc phải cộng đồng. Rà lại phân độ và vi sinh để chọn phác đồ."
            : "Chưa có thuốc nền khớp bệnh cảnh đã chọn."}
        </p>
      )}

      {notes.length > 0 && (!canChoose || !needsPseudomonas) && (
        <details className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <summary className="cursor-pointer font-semibold text-slate-900">Lựa chọn khác được TG18 liệt kê</summary>
          <ul className="m-0 mt-2 list-disc space-y-1 pl-5 leading-relaxed text-slate-700">
            {notes.map(({ text }) => <li key={text}>{text}</li>)}
          </ul>
        </details>
      )}

      {canChoose && (
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
      )}
    </section>
  );
}
