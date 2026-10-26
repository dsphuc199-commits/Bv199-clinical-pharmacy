"use client";

/*
  FILE: components/antibiotics/selection/SelectionEngine.tsx
  Giao dien NHIEM VU 4B – lua chon khang sinh theo nguoi benh.
  Logic: lib/antibiotics/selection-engine.ts (ham thuan, da kiem thu).
  1. Tim benh (ten / ICD-10)  2. Nhap bien bat buoc theo tung benh
  3. Loc tu dong  4. Toi da 3 nhom ket qua, kem nguon, danh muc BV199, link lieu/antibiogram.
*/

import Link from "next/link";
import { useMemo, useState } from "react";

import { ClinicalFilterProvider } from "@/components/antibiotics/empiric/ClinicalFilters";
import { AbxLinkProvider } from "@/components/antibiotics/links/AbxLinkContext";
import DrugActionLinks from "@/components/antibiotics/links/DrugActionLinks";
import DoseTable from "@/components/antibiotics/treatment/DoseTable";
import { structureForOption } from "@/lib/antibiotics/regimen-structure";
import { DISEASES } from "@/data/antibiotics/empiric/catalog";
import { APPROVAL_TEXT } from "@/data/antibiotics/empiric/approvals";
import { icdOf } from "@/data/antibiotics/empiric/icd10";
import { DEFAULT_FILTERS } from "@/lib/antibiotics/clinical-filters";
import { empiricHref, findDrugs } from "@/lib/antibiotics/drug-links";
import { formularyProducts } from "@/lib/antibiotics/formulary";
import { diseaseProfile } from "@/lib/antibiotics/disease-profile";
import {
  evaluate,
  questionsFor,
  searchDiseases,
  type Eligibility,
  type Option,
  type PatientInput,
  type Question,
  type QuestionKey,
} from "@/lib/antibiotics/selection-engine";

const GROUP_TITLE: Record<string, string> = {
  main: "Lựa chọn ưu tiên",
  alternative: "Lựa chọn thay thế",
  special: "Trường hợp đặc biệt",
};

const ELIG_TEXT: Record<Eligibility, string> = {
  ELIGIBLE: "Đủ điều kiện",
  CONDITIONAL: "Có điều kiện",
  NOT_ELIGIBLE: "Không phù hợp",
  SAFETY_BLOCKED: "Khóa an toàn",
};

const GROUP_TONE: Record<string, string> = {
  main: "se-g-main",
  alternative: "se-g-alt",
  special: "se-g-special",
};

function FormularyLine({ option }: { option: Option }) {
  const drugs = findDrugs(option.drugs.map((d) => `${d.name}: ${d.dose}`));
  if (drugs.length === 0) {
    return <p className="se-muted">Danh mục BV199: không nhận diện được hoạt chất cụ thể (nguồn chỉ nêu nhóm thuốc).</p>;
  }
  return (
    <p className="se-form">
      <strong>Danh mục BV199:</strong>{" "}
      {drugs.map((d, i) => {
        const products = formularyProducts(d.ingredientId);
        const routes = Array.from(new Set(products.map((p) => p.route).filter(Boolean))).join(", ");
        return (
          <span key={d.ingredientId} className={products.length ? "se-in" : "se-out"}>
            {i > 0 ? " · " : ""}
            {d.name} {products.length ? `✓ (${products.length} SP${routes ? `; ${routes}` : ""})` : "✗ không có trong danh mục"}
          </span>
        );
      })}
    </p>
  );
}

function OptionCard({ option, sourceHref, population }: { option: Option; sourceHref: string; population?: "adult" | "child" }) {
  const structure = structureForOption(option.id, option.drugs);
  const critical = (option.alerts ?? []).filter((a) => a.level === "critical");
  const high = (option.alerts ?? []).filter((a) => a.level !== "critical");
  const checklists = high.filter((a) => a.checklist);
  const elig = option.eligibility ?? "CONDITIONAL";
  return (
    <article className={`se-opt se-opt-${elig}`}>
      <header className="se-opt-head">
        <h4>{option.title}</h4>
        <span className={`se-elig se-elig-${elig}`}>{ELIG_TEXT[elig]}</span>
      </header>
      {/* Master Task 6: bang lieu co cau truc (nhom AND/OR, moi thuoc mot hang; loc theo doi tuong) */}
      <DoseTable groups={structure.groups} status={structure.status} population={population} />
      {option.doseEvidence === "MISSING_DOSE_EVIDENCE" && (
        <p className="se-nodose" role="note">
          <strong>Chưa có liều từ nguồn (MISSING_DOSE_EVIDENCE)</strong> – hệ thống không đề xuất liều.
          {option.missingDoseReason ? ` ${option.missingDoseReason}` : ""}
        </p>
      )}
      {option.supplement && (
        <div className={`se-supp se-supp-${option.supplement.kind}`}>
          <p className="se-supp-head">
            {option.supplement.complete ? "Liều bổ sung có dẫn nguồn" : "Thông tin liều một phần (không đủ để dùng làm liều)"}
            {" · "}
            {option.supplement.kind === "same-document" ? "cùng văn bản BYT" : "guideline quốc tế"}
          </p>
          <ul className="se-drugs">
            {option.supplement.items.map((it) => (
              <li key={it.drug}>
                <strong>{it.drug}</strong>
                <span>{it.dose}</span>
              </li>
            ))}
          </ul>
          {option.supplement.scope && <p className="se-muted">{option.supplement.scope}</p>}
          <p className="se-src">
            Nguồn:{" "}
            {option.supplement.url ? (
              <a href={option.supplement.url} target="_blank" rel="noreferrer">{option.supplement.source}</a>
            ) : (
              option.supplement.source
            )}
          </p>
        </div>
      )}
      <p className="se-dur"><span>Thời gian</span> {option.duration}</p>
      {critical.map((alert) => (
        <div key={alert.title} className="se-alert se-alert-critical" role="alert">
          <strong>NGUY CƠ CAO – {alert.title}</strong>
          <p>{alert.text}</p>
        </div>
      ))}
      {option.conditions && option.conditions.length > 0 && (
        <ul className="se-cond" aria-label="Điều kiện cần xác nhận">
          {option.conditions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
      {checklists.map((alert) => (
        <details key={alert.title} className="se-alert se-alert-high" open>
          <summary>{alert.title}</summary>
          <ul>
            {alert.checklist!.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      ))}
      <div className="se-actions">
        <DrugActionLinks compact texts={option.drugs.map((d) => `${d.name}: ${d.dose} ${d.route ?? ""}`)} scenario={option.title} />
        <Link className="se-srclink" href={sourceHref}>Nguồn</Link>
      </div>
      <details className="se-more">
        <summary>Chi tiết</summary>
        <p><strong>Lý do:</strong> {option.reason}</p>
        {high.filter((a) => !a.checklist).map((alert) => (
          <p key={alert.title} className="se-high-line"><strong>{alert.title}:</strong> {alert.text}</p>
        ))}
        {option.warnings.length > 0 && (
          <ul className="se-warnlist">
            {option.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
        <FormularyLine option={option} />
        <p className="se-src">Nguồn: {option.source}</p>
      </details>
    </article>
  );
}

function QuestionField({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: PatientInput[QuestionKey];
  onChange: (v: string | number | undefined) => void;
}) {
  const id = `se-q-${q.key}`;
  return (
    <div className={`se-q ${q.required && (value === undefined || value === "") ? "se-q-missing" : ""}`}>
      <label className="se-q-label" htmlFor={id}>
        {q.label}
        {q.required ? <span className="se-req"> *</span> : <span className="se-opt-tag"> (tùy chọn)</span>}
      </label>
      {q.kind === "number" ? (
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          className="se-input"
          value={typeof value === "number" ? value : ""}
          placeholder="Ví dụ: 35"
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        />
      ) : q.options.length <= 3 ? (
        <div className="se-seg" role="radiogroup" aria-label={q.label} id={id}>
          {q.options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={value === o.value}
              className={value === o.value ? "active" : ""}
              onClick={() => onChange(value === o.value ? undefined : o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <select
          id={id}
          className="se-input"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value || undefined)}
        >
          <option value="">– Chọn –</option>
          {q.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      {q.help && q.help.length > 0 && (
        <details className="se-help">
          <summary>Tiêu chí của nguồn</summary>
          <ul>
            {q.help.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

const STATUS_MARK: Record<string, string> = { available: "✓", partial: "◐", mentioned: "•", missing: "–" };

function DiseaseDetail({ diseaseId }: { diseaseId: string }) {
  const p = diseaseProfile(diseaseId);
  if (!p) return null;
  return (
    <details className="se-detail">
      <summary>Chi tiết bệnh · {p.coverage}/20 mục có dữ liệu</summary>
      <ul>
        {p.fields.map((f) => (
          <li key={f.key} className={`se-f-${f.status}`}>
            <span className="se-f-mark" aria-hidden>{STATUS_MARK[f.status]}</span>
            <span className="se-f-label">{f.label}</span>
            <span className="se-f-val">{f.value || "Chưa có"}{f.source ? <em> · {f.source}</em> : null}</span>
          </li>
        ))}
      </ul>
      <p className="se-muted">✓ có dữ liệu · ◐ một phần · • có đề cập trong nguồn · – chưa có (không tự suy diễn)</p>
    </details>
  );
}

export default function SelectionEngine({ initialDisease }: { initialDisease?: string }) {
  const [diseaseId, setDiseaseId] = useState<string | undefined>(
    initialDisease && DISEASES.some((d) => d.id === initialDisease) ? initialDisease : undefined
  );
  const [query, setQuery] = useState("");
  const [input, setInput] = useState<PatientInput>({});

  const disease = DISEASES.find((d) => d.id === diseaseId);
  const matches = useMemo(() => searchDiseases(query), [query]);
  const questions = diseaseId ? questionsFor(diseaseId, input) : [];
  const result = diseaseId ? evaluate(diseaseId, input) : undefined;

  function choose(id: string) {
    setDiseaseId(id);
    setInput({});
    setQuery("");
    window.history.replaceState(null, "", `/antibiotics/empiric/select?disease=${encodeURIComponent(id)}`);
  }

  function setField(key: QuestionKey, value: string | number | undefined) {
    setInput((prev) => {
      const next: PatientInput = { ...prev, [key]: value };
      // Doi bien phia truoc -> xoa lua chon tinh huong de tranh giu lua chon khong con hop le.
      if (key !== "scenario" && key !== "crcl") delete next.scenario;
      if (key === "renal" && value !== "impaired") delete next.crcl;
      if (key === "population" && value === "child") delete next.pregnant;
      return next;
    });
  }

  const selfHref = diseaseId ? `/antibiotics/empiric/select?disease=${diseaseId}` : "/antibiotics/empiric/select";
  const crcl = input.renal === "impaired" && typeof input.crcl === "number" ? String(input.crcl) : "";

  return (
    <AbxLinkProvider
      value={{
        from: selfHref,
        fromLabel: disease ? `Chọn kháng sinh – ${disease.title}` : "Chọn kháng sinh",
        diseaseId,
        context: disease?.title,
      }}
    >
      <ClinicalFilterProvider
        value={{ ...DEFAULT_FILTERS, crcl, penicillinAllergy: input.penicillinAllergy === "yes" }}
      >
        <div className="se-layout">
          {/* ===== CỘT NHẬP ===== */}
          <section className="se-panel se-inputs" aria-label="Thông tin người bệnh">
            <div className="se-step">1. Mặt bệnh</div>
            <div className="se-search">
              <input
                type="search"
                className="se-input"
                placeholder={disease ? `Đổi bệnh – đang chọn: ${disease.title}` : "Tìm tên bệnh hoặc mã ICD-10 (vd. J18, A41.9)"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Tìm mặt bệnh"
              />
              {query.trim() && (
                <ul className="se-results" role="listbox">
                  {matches.length === 0 && <li className="se-muted">Không tìm thấy mặt bệnh.</li>}
                  {matches.map((d) => (
                    <li key={d.id}>
                      <button type="button" onClick={() => choose(d.id)}>
                        <strong>{d.title}</strong>
                        <span>
                          {d.specialty}
                          {icdOf(d.id).length ? ` · ICD-10 ${icdOf(d.id).join(", ")}` : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {disease && (
              <>
                <div className="se-chosen">
                  <strong>{disease.title}</strong>
                  <span>
                    {disease.specialty}
                    {icdOf(disease.id).length ? ` · ICD-10 ${icdOf(disease.id).join(", ")}` : ""}
                  </span>
                </div>

                <DiseaseDetail diseaseId={disease.id} />

                <div className="se-step">2. Thông tin người bệnh</div>
                <p className="se-muted">* bắt buộc · “Không rõ” không được hiểu là âm tính.</p>
                {questions.map((q) => (
                  <QuestionField key={q.key} q={q} value={input[q.key]} onChange={(v) => setField(q.key, v)} />
                ))}
                {Object.keys(input).length > 0 && (
                  <button type="button" className="se-link" onClick={() => setInput({})}>
                    Nhập lại từ đầu
                  </button>
                )}
              </>
            )}
          </section>

          {/* ===== CỘT KẾT QUẢ ===== */}
          <section className="se-panel se-out" aria-live="polite" aria-label="Kết quả">
            <div className="se-step">3. Kết quả</div>
            {!disease && <p className="se-muted">Chọn mặt bệnh để bắt đầu.</p>}

            {result?.status === "need-input" && (
              <div className="se-need">
                <strong>Chưa đủ dữ liệu bắt buộc – chưa đưa khuyến cáo.</strong>
                <ul>
                  {result.missing.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                <span className="se-muted">Còn {result.candidates} tình huống của nguồn có thể phù hợp.</span>
              </div>
            )}

            {result?.status === "no-match" && <div className="se-need">{result.message}</div>}

            {result?.status === "ready" && (
              <>
                <div className="se-status">
                  <span className={`se-cert ${result.certainty === "complete" ? "ok" : "lim"}`}>
                    {result.certainty === "complete" ? "Đủ dữ liệu" : "Có giới hạn"}
                  </span>
                  {result.clinicalUse !== "approved" && (
                    <span className="se-approval" title={APPROVAL_TEXT.NOT_APPROVED}>Chưa phê duyệt HĐT&ĐT – không tự động áp dụng</span>
                  )}
                  {result.eligibilityCount && (
                    <span className="se-count">
                      {result.eligibilityCount.ELIGIBLE} đủ điều kiện · {result.eligibilityCount.CONDITIONAL} có điều kiện
                      {result.eligibilityCount.SAFETY_BLOCKED > 0 ? ` · ${result.eligibilityCount.SAFETY_BLOCKED} khóa an toàn` : ""}
                    </span>
                  )}
                </div>
                <p className="se-scn"><strong>Tình huống:</strong> {result.scenarioLabel}</p>
                {result.unknowns && result.unknowns.length > 0 && (
                  <p className="se-unknown">Chưa rõ: {result.unknowns.join(", ")} – các phương án liên quan ở mức Có điều kiện.</p>
                )}
                {result.limits.length > 0 && (
                  <ul className="se-limits">
                    {result.limits.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}

                {result.groups.map((g) => (
                  <div key={g.kind} className={`se-group ${GROUP_TONE[g.kind]}`}>
                    <h3>{GROUP_TITLE[g.kind] ?? g.label}</h3>
                    {g.options.map((o) => (
                      <OptionCard key={o.id} option={o} population={input.population} sourceHref={`${empiricHref(diseaseId)}&tab=sources`} />
                    ))}
                  </div>
                ))}

                {result.excluded.length > 0 && (
                  <details className="se-help se-excluded" open={result.excluded.some((e) => e.eligibility === "SAFETY_BLOCKED")}>
                    <summary>Không đề xuất ({result.excluded.length}): bị loại hoặc khóa an toàn</summary>
                    <ul>
                      {result.excluded.map((e) => (
                        <li key={e.title + e.reason}>
                          <span className={`se-elig se-elig-${e.eligibility ?? "NOT_ELIGIBLE"}`}>{ELIG_TEXT[e.eligibility ?? "NOT_ELIGIBLE"]}</span>{" "}
                          <strong>{e.title}</strong> – {e.reason}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                <details className="se-help">
                  <summary>Giới hạn áp dụng và nguồn</summary>
                  {result.pool && result.pool.length > 0 && (
                    <div>
                      <strong>Danh sách thuốc để xây dựng tổ hợp (theo quy tắc của nguồn)</strong>
                      {result.pool.map((p) => (
                        <div key={p.title}>
                          <em>{p.title}</em>
                          <ul>
                            {p.drugs.map((d) => (
                              <li key={d.name + d.dose}>
                                {d.name}: {d.dose}
                                {d.route ? ` · ${d.route}` : ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.warnings.length > 0 && (
                    <ul>
                      {result.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  )}
                  <p className="se-src">
                    {result.sourceSummary}. Thông tin hỗ trợ quyết định, chưa phải phác đồ được BV199 phê duyệt.
                  </p>
                </details>
                <div className="se-links">
                  <Link href={empiricHref(diseaseId)}>Phác đồ đầy đủ</Link>
                  {result.intlAvailable && <Link href={`${empiricHref(diseaseId)}&tab=intl`}>Quốc tế</Link>}
                  <Link href={`${empiricHref(diseaseId)}&tab=compare`}>So sánh hướng dẫn</Link>
                </div>
              </>
            )}
          </section>
        </div>

        <style>{`
          .se-layout { display: grid; grid-template-columns: minmax(280px, 380px) minmax(0, 1fr); gap: 14px; align-items: start; }
          .se-panel { background: #fff; border: 1px solid #dbe6ed; border-radius: 12px; padding: 14px; min-width: 0; }
          .se-inputs { position: sticky; top: 10px; max-height: calc(100vh - 20px); overflow-y: auto; }
          .se-step { font-size: 11px; font-weight: 800; letter-spacing: .5px; color: #087f89; text-transform: uppercase; margin: 4px 0 8px; }
          .se-input { width: 100%; min-height: 42px; padding: 9px 12px; border: 1px solid #cedce6; border-radius: 9px; font-size: 14px; background: #fff; color: #17364b; box-sizing: border-box; }
          .se-search { position: relative; }
          .se-results { list-style: none; margin: 6px 0 0; padding: 4px; border: 1px solid #dbe6ed; border-radius: 10px; max-height: 320px; overflow-y: auto; background: #fff; }
          .se-results button { width: 100%; text-align: left; border: 0; background: none; padding: 9px 10px; border-radius: 8px; cursor: pointer; display: grid; gap: 2px; color: #17364b; }
          .se-results button:hover { background: #eef8f8; }
          .se-results span { font-size: 11px; color: #647b8c; }
          .se-chosen { margin: 10px 0; padding: 10px 12px; border-radius: 10px; background: #e8f6f4; display: grid; gap: 2px; }
          .se-chosen span { font-size: 11px; color: #4b6576; }
          .se-q { margin-bottom: 12px; padding-left: 8px; border-left: 3px solid transparent; }
          .se-q-missing { border-left-color: #f59e0b; }
          .se-q-label { display: block; font-size: 12px; font-weight: 700; color: #17364b; margin-bottom: 6px; }
          .se-req { color: #b42318; }
          .se-opt-tag { font-weight: 400; color: #647b8c; }
          .se-seg { display: flex; flex-wrap: wrap; gap: 4px; }
          .se-seg button { flex: 1 1 auto; min-height: 38px; padding: 6px 10px; border: 1px solid #cfdde6; border-radius: 8px; background: #fff; color: #17364b; font-size: 12px; cursor: pointer; }
          .se-seg button.active { background: #087f89; border-color: #087f89; color: #fff; font-weight: 700; }
          .se-help, .se-warn { margin-top: 6px; font-size: 12px; color: #33505f; }
          .se-help summary, .se-warn summary { cursor: pointer; font-weight: 700; color: #087f89; }
          .se-warn summary { color: #b45309; }
          .se-help ul, .se-warn ul, .se-need ul, .se-limits { margin: 6px 0; padding-left: 18px; line-height: 1.6; }
          .se-muted { font-size: 12px; color: #647b8c; line-height: 1.6; margin: 4px 0; }
          .se-link { border: 0; background: none; color: #087f89; font-weight: 700; font-size: 12px; cursor: pointer; padding: 0; }
          .se-need { padding: 12px; border-radius: 10px; background: #fff7e9; border: 1px solid #f1dfc0; font-size: 13px; color: #5c4310; }
          .se-cert { display: inline-block; padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: 800; }
          .se-cert.ok { background: #dcfce7; color: #166534; }
          .se-approval { display: inline-block; padding: 4px 10px; border: 1px solid #fdba74; border-radius: 99px; background: #fff7ed; color: #9a3412; font-size: 11.5px; font-weight: 700; }
          .se-review { display: inline-block; margin: 6px 0 0; padding: 4px 10px; border-radius: 99px; background: #b91c1c; color: #fff; font-size: 12px; font-weight: 800; }
          .se-alert { border-radius: 8px; padding: 8px 10px; margin: 6px 0; font-size: 12.5px; line-height: 1.5; overflow-wrap: anywhere; }
          .se-alert p { margin: 4px 0; }
          .se-alert ul { margin: 4px 0; padding-left: 18px; }
          .se-alert-critical { background: #fef2f2; border: 1px solid #fca5a5; border-left: 4px solid #b91c1c; color: #7f1d1d; }
          .se-alert-high { background: #fffbeb; border: 1px solid #fcd34d; color: #78350f; }
          .se-alert-high summary { cursor: pointer; font-weight: 700; }
          .se-cert.lim { background: #fef3c7; color: #92400e; }
          .se-scn { font-size: 13px; margin: 10px 0 4px; }
          .se-limits { font-size: 12px; color: #92400e; background: #fffbeb; border-radius: 8px; padding: 8px 8px 8px 24px; }
          .se-group { margin-top: 14px; border-radius: 12px; padding: 10px 12px; border: 1px solid #dbe6ed; }
          .se-group h3 { margin: 0; font-size: 15px; }
          .se-g-main { background: #f3fbf9; border-color: #b9e3dc; }
          .se-g-alt { background: #f8fafc; }
          .se-g-special { background: #fffaf0; border-color: #f3dfb6; }
          .se-opt { margin-top: 10px; padding: 10px 12px; border-radius: 10px; background: #fff; border: 1px solid #e2eaf0; font-size: 13px; line-height: 1.55; }
          .se-opt-head { display: flex; gap: 8px; align-items: flex-start; justify-content: space-between; }
          .se-opt h4 { margin: 0 0 6px; font-size: 14px; }
          .se-opt p { margin: 4px 0; }
          .se-elig { flex: none; display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 800; white-space: nowrap; }
          .se-elig-ELIGIBLE { background: #dcfce7; color: #166534; }
          .se-elig-CONDITIONAL { background: #fef3c7; color: #92400e; }
          .se-elig-NOT_ELIGIBLE { background: #e5e7eb; color: #374151; }
          .se-elig-SAFETY_BLOCKED { background: #7f1d1d; color: #fff; }
          .se-drugs { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
          .se-drugs li { display: grid; grid-template-columns: minmax(110px, 32%) minmax(0, 1fr); gap: 8px; padding: 6px 8px; border-radius: 8px; background: #f5f9fb; font-size: 12.5px; overflow-wrap: anywhere; }
          .se-nodose { margin: 6px 0; padding: 6px 8px; border-radius: 8px; border: 1px dashed #b45309; background: #fff7ed; color: #7c2d12; font-size: 12px; overflow-wrap: anywhere; }
          .se-supp { margin: 6px 0; padding: 6px 8px; border-radius: 8px; border-left: 3px solid #0e7490; background: #f0f9ff; font-size: 12px; }
          .se-supp-international { border-left-color: #7c3aed; background: #faf5ff; }
          .se-supp-head { font-weight: 700; color: #164e63; margin-bottom: 2px; }
          .se-supp .se-src a { color: #087f89; text-decoration: underline; }
          .se-dur { font-size: 12.5px; }
          .se-dur span { font-weight: 700; color: #4b6576; margin-right: 4px; }
          .se-cond { margin: 6px 0; padding: 6px 8px 6px 22px; border-radius: 8px; background: #fffbeb; color: #78350f; font-size: 12px; }
          .se-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; margin-top: 6px; }
          .se-srclink { font-size: 11px; font-weight: 700; color: #087f89; }
          .se-more { margin-top: 6px; font-size: 12px; color: #33505f; }
          .se-more summary { cursor: pointer; font-weight: 700; color: #647b8c; }
          .se-warnlist { margin: 4px 0; padding-left: 18px; }
          .se-high-line { color: #78350f; }
          .se-status { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
          .se-count { font-size: 12px; color: #33505f; }
          .se-unknown { margin: 6px 0; font-size: 12px; color: #92400e; }
          .se-detail { margin: 6px 0 10px; font-size: 12px; }
          .se-detail summary { cursor: pointer; font-weight: 700; color: #087f89; }
          .se-detail ul { list-style: none; margin: 6px 0; padding: 0; display: grid; gap: 3px; }
          .se-detail li { display: grid; grid-template-columns: 14px minmax(90px, 40%) minmax(0, 1fr); gap: 6px; overflow-wrap: anywhere; }
          .se-f-label { font-weight: 700; color: #17364b; }
          .se-f-val em { color: #647b8c; font-style: normal; }
          .se-f-missing { color: #94a3b8; }
          .se-f-missing .se-f-label { color: #94a3b8; }
          .se-flag { color: #b42318; font-weight: 700; font-size: 12px; }
          .se-form { font-size: 12px; }
          .se-in { color: #166534; }
          .se-out { color: #991b1b; }
          .se-src { font-size: 11px; color: #647b8c; margin-top: 8px; overflow-wrap: anywhere; }
          .se-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
          .se-links a { display: inline-flex; align-items: center; min-height: 38px; padding: 8px 12px; border: 1px solid #b9dfe0; border-radius: 9px; background: #eef8f8; color: #076c75; font-size: 12px; font-weight: 700; text-decoration: none; }
          @media (max-width: 860px) {
            .se-layout { grid-template-columns: minmax(0, 1fr); }
            .se-inputs { position: static; max-height: none; overflow: visible; }
            .se-drugs li { grid-template-columns: minmax(0, 1fr); gap: 2px; }
          }
        `}</style>
      </ClinicalFilterProvider>
    </AbxLinkProvider>
  );
}
