"use client";

/*
  FILE: components/antibiotics/empiric/BytRegimenView.tsx

  Phac do khang sinh kinh nghiem theo van ban BYT cho MOT mat benh – trinh bay bang template
  chuan components/antibiotics/treatment/TreatmentPanel.tsx (dung chung 69 benh).

  Phan loai theo VAI TRO NGUON GHI (khong tu xep hang):
    - Nguon co ca "uu tien" (first/severe) va "thay the" (alternative) -> Lua chon uu tien / Lua chon thay the.
    - Chi co mot muc ngang hang -> Cac lua chon duoc khuyen cao (Lua chon 1, 2…).
    - Di ung (allergy) -> muc rieng co dieu kien; theo tac nhan (pathogen) / kem theo (adjunct) -> muc phu.
  Chi hien phien ban hien hanh (getRegimensForDisease da loai van ban bi thay the); lich su/doi chieu
  phien ban o muc "Nguon, phien ban" cuoi trang (ReconciliationBox).
*/

import { useMemo, useState } from "react";

import {
  DOCS,
  getRegimensForDisease,
  type Regimen,
  type RegimenRole,
} from "../../../data/antibiotics/empiric/regimens";
import { getReconciliationNote } from "../../../data/antibiotics/empiric/source-reconciliation";
import { safetyAlertsFor } from "../../../data/antibiotics/empiric/safety-alerts";
import {
  doseEvidenceOf,
  doseSupplementFor,
  missingDoseReason,
  MISSING_DOSE_REASON,
} from "../../../data/antibiotics/empiric/dose-supplements";
import { structureOf } from "../../../lib/antibiotics/regimen-structure";
import { anyInFormulary, betaLactamFlags, mdrOf, severityOf } from "../../../lib/antibiotics/clinical-filters";
import TreatmentPanel, { cardLabel, type TxCard, type TxSection } from "../treatment/TreatmentPanel";
import { useClinicalFilters } from "./ClinicalFilters";
import { DOSE_CONFLICTS } from "@/data/antibiotics/empiric/dose-conflicts";
import { findDrugs } from "@/lib/antibiotics/drug-links";
import DoseConflictComparison from "./DoseConflictComparison";
import CopdByt2026 from "../CopdByt2026";
import { DiseaseMonitoring, DiseaseOverviewSummary, hasDiseaseOverview } from "./DiseaseOverview";
import { getRationale } from "../../../data/antibiotics/empiric/rationale";
import { EMPIRIC_TREATMENT_UI_RULES } from "@/lib/antibiotics/empiric-ui-rules";

export function therapyNames(regimen: Regimen): string {
  const structured = structureOf(regimen).groups.flatMap(g => g.options.map(o => o.name.replace(/\s*\(liều như trên\)$/i, "")));
  const names = structured.length ? structured : findDrugs(regimen.drugs.map(d => `${d.name}: ${d.dose}`)).map(d => d.name);
  return [...new Set(names.length ? names : regimen.drugs.map(d => d.name))].join(", ");
}

/* Doi chieu van ban/phien ban (lich su) – hien o muc "Nguon, phien ban" cuoi trang, thu gon. */
export function ReconciliationBox({ diseaseId }: { diseaseId: string }) {
  const note = getReconciliationNote(diseaseId);
  if (!note) return null;
  return (
    <details
      role="note"
      className="byt199-recon"
      style={{ background: "#f5f9fb", border: "1px solid #dce6ed", color: "#17364b", borderRadius: 8, padding: "8px 12px", fontSize: 12, lineHeight: 1.6, margin: "6px 0" }}
    >
      <summary style={{ fontWeight: 700, cursor: "pointer" }}>Đối chiếu văn bản và phiên bản</summary>
      <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
        {note.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div>
        Nguồn:{" "}
        {note.sources.map((source, index) => (
          <span key={source.label}>
            {index > 0 ? " · " : ""}
            {source.url ? (
              <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>
            ) : (
              source.label
            )}
          </span>
        ))}
      </div>
    </details>
  );
}

type Props = {
  diseaseId: string;
  diseaseTitle?: string;
  /* Hien ca phuong an khong lieu ngay tu dau (benh khong co phuong an co lieu). */
  showAllByDefault?: boolean;
};

const PREFERRED: RegimenRole[] = ["first", "severe"];

function year(doc: Regimen["source"]["doc"]): string {
  return DOCS[doc].date.match(/\d{4}/)?.[0] ?? DOCS[doc].date;
}

/* Lieu bo sung co dan nguon / ly do thieu lieu (tach rieng, khong sua nguyen van BYT). */
function SupplementBox({ regimen }: { regimen: Regimen }) {
  const sup = doseSupplementFor(regimen.id);
  const missing = doseEvidenceOf(regimen) === "MISSING_DOSE_EVIDENCE";
  if (!sup && !missing) return null;
  const box = { fontSize: 12.5, lineHeight: 1.5, borderRadius: 8, padding: "6px 10px", background: "#f0f9ff", borderLeft: "3px solid #0e7490", overflowWrap: "anywhere" as const };
  return (
    <div className="byt199-supp" style={box}>
      {missing && <ul style={{ margin: 0, paddingLeft: 18, color: "#7c2d12" }}>
        <li><strong>Thuốc được đề cập:</strong> {therapyNames(regimen)}.</li>
        <li><strong>Thông tin liều cần làm rõ:</strong> {missingDoseReason(regimen.id)}</li>
      </ul>}
      {sup && (
        <details>
          <summary>Thông tin liều bổ sung · chờ thẩm định</summary>
          <p style={{ margin: 0, fontWeight: 800 }}>
            {sup.coversAll ? "Liều bổ sung có dẫn nguồn" : "Thông tin liều một phần"} ·{" "}
            {sup.kind === "same-document" ? "cùng văn bản BYT" : "hướng dẫn quốc tế – cần thẩm định"}
          </p>
          <ul style={{ margin: "4px 0", paddingLeft: 18 }}>
            {sup.items.map((it) => (
              <li key={it.drug}>
                <strong>{it.drug}:</strong> {it.dose}
              </li>
            ))}
          </ul>
          {sup.scope && <p style={{ margin: 0 }}>{sup.scope}</p>}
          {sup.stillMissing?.map((m) => (
            <p key={m} style={{ margin: 0, color: "#7c2d12" }}>Còn thiếu: {m}</p>
          ))}
          <p style={{ margin: 0, fontSize: 11.5, color: "#4b6576" }}>
            Nguồn:{" "}
            {sup.source.url ? (
              <a href={sup.source.url} target="_blank" rel="noopener noreferrer">{sup.source.title}</a>
            ) : (
              sup.source.title
            )}{" "}
            · {sup.source.locator}
          </p>
        </details>
      )}
    </div>
  );
}

/* Nhan benh canh co dieu kien lam sang giup chon thuoc (khong chi nhac lai ten benh). */
const INFORMATIVE_LABEL = /[<>≤≥]|\d|trẻ em|người lớn|sơ sinh|mức độ|nặng|có thai|có |không |kèm|nghi |khi |sau |hít|dị ứng|kháng /iu;

/* Du lieu dieu tri -> the trinh bay (khong doi noi dung chuyen mon). */
function toCard(regimen: Regimen): TxCard {
  const alerts = safetyAlertsFor(regimen.id);
  const structure = structureOf(regimen);
  const flags: TxCard["flags"] = [];
  if (alerts.some((a) => a.autoRecommend === "block")) {
    flags.push({ text: "Khóa đề xuất tự động", title: "Engine không tự đề xuất phương án này cho đến khi HĐT&ĐT quyết định", tone: "lock" });
  } else if (alerts.some((a) => a.blockFor?.includes("child"))) {
    /* Nguon chi ghi lieu co dinh cho nguoi lon (khong phai chong chi dinh o tre em):
       nhan trung tinh, chi tiet trong canh bao an toan cua the. */
    flags.push({ text: "Liều người lớn", title: "Nguồn chỉ nêu liều cố định cho người lớn, không có liều trẻ em đã xác minh; trẻ em tính liều theo cân nặng theo hướng dẫn nhi khoa.", tone: "info" });
  }
  if (EMPIRIC_TREATMENT_UI_RULES.showSourceDifferenceBadge && (regimen.notes ?? []).some((n) => n.startsWith("ĐỐI CHIẾU LIỀU"))) {
    flags.push({ text: "Khác biệt liều BYT – quốc tế", title: "Chi tiết trong Lưu ý lâm sàng", tone: "warn" });
  }
  return {
    id: regimen.id,
    condition: regimen.condition ?? (regimen.role === "allergy" ? "Áp dụng khi dị ứng hoặc không dung nạp (theo nguồn)" : undefined),
    groups: structure.groups,
    status: structure.status,
    sourceDoseAbsent: /không nêu liều|chỉ nêu (?:nhóm|tên) thuốc/iu.test(MISSING_DOSE_REASON[regimen.id] ?? ""),
    duration: regimen.duration,
    hideDailyDose: regimen.id === "r-sa-empiric-1",
    alerts: alerts.map((a) => ({ id: a.id, level: a.level, title: a.title, text: a.text, checklist: a.checklist, sources: a.sources })),
    flags,
    extra: <SupplementBox regimen={regimen} />,
    linkTexts: regimen.drugs.map((d) => `${d.name}: ${d.dose}`),
    linkScenario: regimen.scenario,
    sources: [`QĐ ${DOCS[regimen.source.doc].number} (${DOCS[regimen.source.doc].date}) — ${regimen.source.section}; ${regimen.source.page}`],
  };
}

/* Phan loai theo vai tro nguon ghi – KHONG tu xep hang khi nguon khong phan cap. */
export function sectionsFor(items: Regimen[]): { sections: TxSection[]; regimenOf: Map<string, Regimen> } {
  const regimenOf = new Map(items.map((r) => [r.id, r]));
  const pref = items.filter((r) => PREFERRED.includes(r.role));
  const alt = items.filter((r) => r.role === "alternative");
  const allergy = items.filter((r) => r.role === "allergy");
  const pathogen = items.filter((r) => r.role === "pathogen");
  const adjunct = items.filter((r) => r.role === "adjunct");
  const crit = (rs: Regimen[]) => rs.some((r) => safetyAlertsFor(r.id).some((a) => a.level === "critical" || !!a.checklist));
  const sections: TxSection[] = [];
  const hierarchical = pref.length > 0 && alt.length > 0;
  if (hierarchical) {
    sections.push({ key: "pref", title: "Lựa chọn ưu tiên", itemLabel: "Phác đồ", cards: pref.map(toCard) });
    sections.push({ key: "alt", title: "Lựa chọn thay thế", itemLabel: "Phác đồ", cards: alt.map(toCard) });
  } else {
    const equal = pref.length > 0 ? pref : alt;
    if (equal.length > 0) sections.push({ key: "equal", title: equal.length > 1 ? "Các lựa chọn được khuyến cáo" : "Phác đồ khuyến cáo", itemLabel: "Lựa chọn", cards: equal.map(toCard) });
  }
  if (allergy.length > 0) sections.push({ key: "allergy", title: "Lựa chọn khi dị ứng hoặc không dung nạp", itemLabel: "Lựa chọn", cards: allergy.map(toCard), startAt: 1 });
  const mainCount = sections.reduce((n, s) => n + s.cards.length, 0);
  if (pathogen.length > 0) {
    sections.push(
      mainCount > 0
        ? { key: "pathogen", title: "Điều trị theo tác nhân nghi ngờ", itemLabel: "Phác đồ", cards: pathogen.map(toCard), collapsible: true, defaultOpen: crit(pathogen) }
        : { key: "pathogen", title: pathogen.length > 1 ? "Các lựa chọn được khuyến cáo" : "Phác đồ khuyến cáo", itemLabel: "Lựa chọn", cards: pathogen.map(toCard) }
    );
  }
  if (adjunct.length > 0) sections.push({ key: "adjunct", title: "Điều trị phối hợp kèm theo", itemLabel: "Phác đồ", cards: adjunct.map(toCard), collapsible: mainCount > 0, defaultOpen: crit(adjunct) });
  return { sections, regimenOf };
}

export default function BytRegimenView(props: Props) {
  if (props.diseaseId === "v8-6") return <CopdByt2026 />;
  /* Template chung: Tong quan (tang 1) – Phac do (tang 2, 3) – Theo doi (tang 4); tu dong khi co du lieu overview. */
  if (hasDiseaseOverview(props.diseaseId)) {
    return (
      <>
        <DiseaseOverviewSummary diseaseId={props.diseaseId} />
        <GenericBytRegimenView {...props} />
        <DiseaseMonitoring diseaseId={props.diseaseId} />
      </>
    );
  }
  return <GenericBytRegimenView {...props} />;
}

function GenericBytRegimenView({ diseaseId, showAllByDefault }: Props) {
  const allRegimens = useMemo(() => getRegimensForDisease(diseaseId), [diseaseId]);
  // Listing an activity is distinct from supplying a verified prescribing dose.
  // Keep all source groups reachable; DoseTable marks missing/unverified fields.
  void showAllByDefault;
  const clin = useClinicalFilters();

  /* Mac dinh chi hien phuong an co lieu (nguyen van hoac bo sung co dan nguon). */
  const regimens = allRegimens;

  /* Tinh huong theo thu tu nguon; bo loc lam sang (di ung, danh muc, muc do, nguy co). */
  const scenarios = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, Regimen[]>();
    for (const r of regimens) {
      if (!map.has(r.scenario)) {
        order.push(r.scenario);
        map.set(r.scenario, []);
      }
      map.get(r.scenario)!.push(r);
    }
    return order.map((name) => ({ name, items: map.get(name)! }));
  }, [regimens]);

  const visible = useMemo(() => {
    if (!clin) return scenarios;
    return scenarios
      .map((s) => ({
        ...s,
        items: s.items.filter((item) => {
          const texts = item.drugs.map((d) => `${d.name}: ${d.dose}`);
          if (clin.hidePenicillin && betaLactamFlags(texts).penicillin) return false;
          if (clin.formularyOnly && anyInFormulary(texts) === false) return false;
          return true;
        }),
      }))
      .filter((s) => {
        if (s.items.length === 0) return false;
        const sev = severityOf(s.name, s.items.every((i) => i.role === "severe") ? "severe" : undefined);
        if (clin.severity !== "all" && sev !== "unspecified" && sev !== clin.severity) return false;
        const mdr = mdrOf(s.name);
        if (clin.mdr !== "all" && mdr !== "unspecified" && mdr !== clin.mdr) return false;
        return true;
      });
  }, [scenarios, clin]);
  const filteredOut = scenarios.reduce((n, s) => n + s.items.length, 0) - visible.reduce((n, s) => n + s.items.length, 0);

  const [activeName, setActiveName] = useState<string | null>(null);
  const active = visible.find((s) => s.name === activeName) ?? visible[0] ?? null;
  const { sections, regimenOf } = useMemo(() => sectionsFor(active?.items ?? []), [active]);

  /* Luu y lam sang: chi cua phac do dang xem; gan nhan "Phac do N". */
  const notes: string[] = [];
  /* Doi chieu lieu BYT – quoc te (ghi chu dai): tach rieng, thu gon trong muc Luu y. */
  const totalCards = sections.reduce((n, s) => n + s.cards.length, 0);
  for (const s of sections) {
    s.cards.forEach((card, i) => {
      const own = cardLabel(s, i);
      /* Nhieu muc -> ghi ca ten muc de khong nham "Phac do 1" giua uu tien va thay the. */
      const label = own ? (sections.length > 1 ? `${s.title} – ${own}` : own) : s.title;
      for (const n of regimenOf.get(card.id)?.notes ?? []) {
        if (n.startsWith("ĐỐI CHIẾU LIỀU")) continue;
        const text = n.replace(/^ĐỐI CHIẾU LIỀU – /, "");
        notes.push(totalCards > 1 ? `${label}: ${text}` : text);
      }
    });
  }
  const sources = Array.from(
    new Set((active?.items ?? []).map((r) => `QĐ ${DOCS[r.source.doc].number} (${year(r.source.doc)}) – ${r.source.section}, ${r.source.page}`))
  );
  const docTag = Array.from(new Set((active?.items ?? allRegimens).map((r) => `QĐ ${DOCS[r.source.doc].number}`))).join("; ");

  const lockedScenario = (items: Regimen[]) => items.some((r) => safetyAlertsFor(r.id).some((a) => a.autoRecommend === "block"));

  return (
    <div className="byt199" data-disease={diseaseId}>
      <TreatmentPanel
        scenarios={visible.map((s) => {
          const label = diseaseId === "v8-9" && s.name === "Áp xe phổi: phối hợp beta-lactam + aminoglycosid" ? "Áp xe phổi" : s.name;
          /* Mot benh canh duy nhat: chi giu lam "tieu chi" khi nhan mang dieu kien lam sang (tuoi, doi tuong, muc do, yeu to nguy co...). */
          const informative = visible.length > 1 || INFORMATIVE_LABEL.test(s.name);
          return { value:s.name,label:lockedScenario(s.items)?`${label} · có phương án bị khóa`:label,criteria:informative?[s.name]:[],regimenIds:s.items.map(r=>r.id),sources:[...new Set(s.items.map(r=>`QĐ ${DOCS[r.source.doc].number} — ${r.source.section}, ${r.source.page}`))] };
        })}
        scenario={active?.name}
        onScenario={setActiveName}
        scenarioHint={clin && filteredOut > 0 ? `Bộ lọc đang ẩn ${filteredOut} phương án.` : undefined}
        sourceTag={allRegimens.length > 0 ? `Bộ Y tế · ${docTag}` : undefined}
        sections={sections}
        emptyText={
          allRegimens.length === 0
            ? "Không có phác đồ kháng sinh kinh nghiệm trong các văn bản BYT đã đọc."
            : visible.length === 0 && scenarios.length > 0
              ? "Không có bệnh cảnh phù hợp bộ lọc."
              : "Văn bản BYT chỉ nêu tên thuốc/nhóm thuốc, không nêu liều."
        }
        notes={notes}
        comparison={<DoseConflictComparison conflicts={DOSE_CONFLICTS.filter(c => (active?.items ?? []).some(r => c.regimenIds.includes(r.id)))} />}
        sources={sources}
        rationale={active ? getRationale(diseaseId, active.name, active.items) : undefined}
      />
      <style>{`
        .byt199 { min-width: 0; }
        .byt199-missing-options { font-size: 13px; line-height: 1.7; margin-top: 12px; }
        .byt199-missing-options ul { padding-left: 22px; }
        .byt199-missing-options li + li { margin-top: 10px; }
        .byt199-reset { margin-top: 10px; border: 0; background: none; padding: 0; color: #087f89; font-weight: 700; font-size: 12.5px; text-decoration: underline; cursor: pointer; text-align: left; }
      `}</style>
    </div>
  );
}
