import { useState } from "react";
import Link from "next/link";
import {
  cholangitisChoices, cholangitisCombination, cholangitisCourse, tg18Diagnosis, tg18Severity,
  type CholangitisResult, type CourseException, type ModerateCount, type OrganStatus, type SourceControl,
} from "@/lib/antibiotics/cholangitis-plan";
import type { IntlGuideline } from "@/schema/intl-guideline";
import CholangitisCards from "./CholangitisCards";

const field = "mt-1 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900";
const criteria = [
  { id: "a", name: "A · Viêm toàn thân", detail: "Sốt >38 °C hoặc rét run. Bạch cầu <4.000 hoặc >10.000/mm³, hoặc CRP ≥1 mg/dL." },
  { id: "b", name: "B · Ứ mật", detail: "Bilirubin toàn phần ≥2 mg/dL, hoặc ALP, GGT, AST hay ALT >1,5 lần giới hạn trên bình thường." },
  { id: "c", name: "C · Hình ảnh", detail: "Giãn đường mật hoặc thấy nguyên nhân như sỏi, hẹp hay stent trên hình ảnh." },
] as const;
const gradeLabels = { i: "Độ I · nhẹ", ii: "Độ II · trung bình", iii: "Độ III · nặng" };

export function CholangitisAssessment({ apply }: { apply: (severity: string) => void }) {
  const [findings, setFindings] = useState({ a: false, b: false, c: false });
  const [organ, setOrgan] = useState<OrganStatus>("pending");
  const [moderate, setModerate] = useState<ModerateCount>("pending");
  const grade = tg18Severity(organ, moderate);
  return (
    <details className="mb-3 rounded-xl border border-slate-200 bg-white p-3">
      <summary className="cursor-pointer font-bold text-slate-900">Đối chiếu dấu hiệu, xét nghiệm và hình ảnh</summary>
      <div className="mt-3 grid gap-3 text-sm">
        <fieldset className="grid gap-2 md:grid-cols-3">
          {criteria.map(({ id, name, detail }) => (
            <label key={id} className="grid content-start gap-1 rounded-lg bg-slate-50 p-2.5">
              <span className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={findings[id]} onChange={(e) => setFindings({ ...findings, [id]: e.target.checked })} />{name}</span>
              <span className="text-xs leading-relaxed text-slate-700">{detail}</span>
            </label>
          ))}
        </fieldset>
        <p className="m-0 text-teal-900" role="status">{tg18Diagnosis(findings.a, findings.b, findings.c)}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="font-semibold">Suy ít nhất một cơ quan theo TG18</span>
            <select className={field} value={organ} onChange={(e) => setOrgan(e.target.value as OrganStatus)}>
              <option value="pending">Chưa đánh giá</option><option value="yes">Có</option><option value="no">Không</option>
            </select>
            <span className="mt-1 block text-xs leading-relaxed text-slate-700">Tụt huyết áp cần dopamin ≥5 µg/kg/phút hoặc noradrenalin bất kỳ liều nào, giảm ý thức, PaO₂/FiO₂ &lt;300, thiểu niệu hoặc creatinin &gt;2 mg/dL, PT-INR &gt;1,5, tiểu cầu &lt;100.000/mm³.</span>
          </label>
          <label className="block">
            <span className="font-semibold">Số tiêu chí Độ II</span>
            <select className={field} value={moderate} onChange={(e) => setModerate(e.target.value as ModerateCount)} disabled={organ === "yes"}>
              <option value="pending">Chưa đối chiếu đủ</option><option value="low">0 hoặc 1 tiêu chí</option><option value="high">Ít nhất 2 tiêu chí</option>
            </select>
            <span className="mt-1 block text-xs leading-relaxed text-slate-700">Bạch cầu &gt;12.000 hoặc &lt;4.000/mm³, sốt ≥39 °C, tuổi ≥75, bilirubin toàn phần ≥5 mg/dL hoặc albumin dưới 0,7 lần giới hạn dưới bình thường.</span>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {grade === "pending" ? <p className="m-0 text-slate-600">Cần thêm dữ kiện để phân độ.</p> : (
            <button type="button" onClick={() => apply(grade)} className="rounded-lg bg-teal-800 px-3 py-2 font-semibold text-white">Áp dụng {gradeLabels[grade]}</button>
          )}
          <a className="font-semibold text-teal-800 underline" href="https://doi.org/10.1002/jhbp.512" target="_blank" rel="noreferrer">Tiêu chuẩn TG18</a>
        </div>
      </div>
    </details>
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
      <p role="status" className="m-0">Chọn phân độ TG18 và bối cảnh mắc bệnh để hiện phương án tham khảo.</p>
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
