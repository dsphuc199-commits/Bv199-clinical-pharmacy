"use client";

/*
  FILE: components/antibiotics/empiric/BytRegimenView.tsx

  Hien thi phac do khang sinh kinh nghiem trich tu van ban BYT cho MOT mat benh.
  Bo cuc chon nhanh:
    Buoc 1 - chon tinh huong (danh sach doc, cuon duoc)
    Buoc 2 - phac do uu tien hien san; thay the/di ung/kem theo gap trong muc rieng
  Moi phuong an ghi nhan van ban nguon (so quyet dinh, nam, muc/bang, trang).
  Khong tu chon thuoc, khong thay the danh gia cua bac si / duoc si lam sang.
*/

import { useMemo, useState } from "react";

import {
  DOCS,
  ROLE_TEXT,
  getRegimensForDisease,
  isConcreteRegimen,
  type Regimen,
  type RegimenRole,
} from "../../../data/antibiotics/empiric/regimens";
import { getReconciliationNote } from "../../../data/antibiotics/empiric/source-reconciliation";
import DrugActionLinks from "../links/DrugActionLinks";
import DoseTable from "../treatment/DoseTable";
import { structureOf } from "../../../lib/antibiotics/regimen-structure";
import { safetyAlertsFor } from "../../../data/antibiotics/empiric/safety-alerts";
import { APPROVAL_TEXT, regimenApproval } from "../../../data/antibiotics/empiric/approvals";
import {
  doseEvidenceOf,
  doseSupplementFor,
  missingDoseReason,
} from "../../../data/antibiotics/empiric/dose-supplements";
import { useClinicalFilters } from "./ClinicalFilters";
import {
  anyInFormulary,
  betaLactamFlags,
  mdrOf,
  severityOf,
} from "../../../lib/antibiotics/clinical-filters";

/* Ghi chu doi chieu nguon (van ban BYT moi/cu, hoi chuyen nganh, quoc te).
   Style inline vi nhanh "khong co phuong an" khong nap khoi <style> ben duoi. */
function ReconciliationBox({ diseaseId }: { diseaseId: string }) {
  const note = getReconciliationNote(diseaseId);
  if (!note) return null;

  /* Master Task 5: thu gon – canh bao trong yeu da hien tren the phac do. */
  return (
    <details
      role="note"
      className="byt199-recon"
      style={{
        background: "#eef6fb",
        border: "1px solid #b9d7ea",
        color: "#17364b",
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 12,
        lineHeight: 1.6,
        margin: "4px 0",
      }}
    >
      <summary style={{ fontWeight: 700 }}>Nguồn và phiên bản · {note.title.replace(/^Đối chiếu nguồn – /, "")}</summary>
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
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
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
  /* Benh co module rieng chua phac do co lieu (vd. CAP – QĐ 2147): thay thong bao "khong co lieu". */
  moduleNote?: string;
};

const NO_DOSE_MARK = "Nguồn BYT không nêu liều";

/* Vai tro hien san (nhom chinh) va thu tu hien thi. */
const PREFERRED_ROLES: RegimenRole[] = ["first", "severe"];
const ALT_ROLES: RegimenRole[] = ["alternative", "allergy"];
const ROLE_ORDER: RegimenRole[] = [
  "first",
  "severe",
  "pathogen",
  "alternative",
  "allergy",
  "adjunct",
];

/*
  Phan nhom doi tuong chi dua tren TU KHOA trong ten tinh huong cua nguon.
  Khong suy luan lam sang: "chua neu" nghia la ten tinh huong khong ghi nhom tuoi.
*/
type Population = "all" | "child" | "obstetric" | "unspecified";

function classifyPopulation(text: string): Exclude<Population, "all"> {
  const t = text.toLocaleLowerCase("vi");
  if (/trẻ|sơ sinh|nhũ nhi|tháng tuổi|nhi khoa/.test(t)) return "child";
  if (/thai|hậu sản|sản khoa|sản phụ/.test(t)) return "obstetric";
  return "unspecified";
}

const POP_LABEL: Record<Population, string> = {
  all: "Tất cả",
  child: "Trẻ em / sơ sinh",
  obstetric: "Thai kỳ / sản",
  unspecified: "Không nêu nhóm tuổi",
};

type RoleFilter = "all" | RegimenRole;

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function hasNoDose(regimen: Regimen): boolean {
  return regimen.drugs.some((drug) => drug.dose.includes(NO_DOSE_MARK)) || doseEvidenceOf(regimen) === "MISSING_DOSE_EVIDENCE";
}

/* Master Task 5 – Final: lieu bo sung co dan nguon (tach rieng, khong sua nguyen van BYT). */
function SupplementBox({ regimen }: { regimen: Regimen }) {
  const sup = doseSupplementFor(regimen.id);
  const missing = doseEvidenceOf(regimen) === "MISSING_DOSE_EVIDENCE";
  if (!sup && !missing) return null;
  return (
    <div className="byt199-supp">
      {missing && (
        <p className="byt199-supp-missing">
          <strong>MISSING_DOSE_EVIDENCE</strong> – {missingDoseReason(regimen.id)}
        </p>
      )}
      {sup && (
        <>
          <p className="byt199-supp-head">
            {sup.coversAll ? "Liều bổ sung có dẫn nguồn" : "Thông tin liều một phần"} ·{" "}
            {sup.kind === "same-document" ? "cùng văn bản BYT" : "guideline quốc tế – cần thẩm định"}
          </p>
          <ul>
            {sup.items.map((it) => (
              <li key={it.drug}>
                <strong>{it.drug}:</strong> {it.dose}
              </li>
            ))}
          </ul>
          {sup.scope && <p>{sup.scope}</p>}
          {sup.stillMissing?.map((m) => (
            <p key={m} className="byt199-supp-missing">Còn thiếu: {m}</p>
          ))}
          <p className="byt199-supp-src">
            Nguồn:{" "}
            {sup.source.url ? (
              <a href={sup.source.url} target="_blank" rel="noopener noreferrer">{sup.source.title}</a>
            ) : (
              sup.source.title
            )}{" "}
            · {sup.source.locator} (xác minh {sup.checkedOn})
          </p>
        </>
      )}
    </div>
  );
}

function docShort(docId: Regimen["source"]["doc"]): string {
  const doc = DOCS[docId];
  const year = doc.date.match(/(\d{4})/)?.[1] ?? "";
  const number = doc.number.split("/")[0].split(" ")[0];
  return year ? `QĐ ${number}/${year}` : `QĐ ${number}`;
}

function RegimenCard({ regimen }: { regimen: Regimen }) {
  const doc = DOCS[regimen.source.doc];
  const noDose = hasNoDose(regimen);
  /* Buoc 4D.2: canh bao an toan hien ngay tren the; phe duyet HĐT&ĐT tach rieng. */
  const alerts = safetyAlertsFor(regimen.id);
  const conflictCount = (regimen.notes ?? []).filter((note) => note.startsWith("ĐỐI CHIẾU LIỀU")).length;
  const approval = regimenApproval(regimen.id, regimen.diseaseIds);
  /* Buoc 4D.4: nhan khoa de xuat tu dong */
  const locked = alerts.some((a) => a.autoRecommend === "block");
  const childBlocked = alerts.some((a) => a.blockFor?.includes("child"));
  const structure = structureOf(regimen);

  return (
    <article className={`byt199-card byt199-card-${regimen.role}`}>
      <header className="byt199-card-head">
        <span className={`byt199-role byt199-role-${regimen.role}`}>
          {ROLE_TEXT[regimen.role]}
        </span>
        {noDose && structure.status !== "NO_DOSE" && <span className="byt199-flag">Thiếu liều một phần</span>}
        {approval !== "APPROVED_FOR_CLINICAL_USE" && (
          <span className="byt199-approval" title={APPROVAL_TEXT[approval]}>Chưa phê duyệt HĐT&ĐT</span>
        )}
        {locked && (
          <span className="byt199-locked" title="Engine không tự đề xuất phương án này cho đến khi HĐT&ĐT quyết định">
            Khóa đề xuất tự động
          </span>
        )}
        {!locked && childBlocked && (
          <span className="byt199-locked" title="Liều cố định người lớn – bộ chọn không đề xuất cho trẻ em">
            Không dùng cho trẻ em
          </span>
        )}
        {conflictCount > 0 && (
          <span className="byt199-conflict" title="Liều/khuyến cáo khác nhau giữa BYT và quốc tế – chi tiết trong Lưu ý">
            Liều khác nguồn ({conflictCount})
          </span>
        )}
      </header>

      {alerts.length > 0 && (
        <div className="byt199-alerts">
          {alerts.map((alert) =>
            alert.level === "critical" ? (
              <div key={alert.id} className="byt199-alert byt199-alert-critical" role="alert">
                <strong>NGUY CƠ CAO – {alert.title}</strong>
                <p>{alert.text}</p>
                <span className="byt199-alert-src">Nguồn: {alert.sources.join("; ")}</span>
              </div>
            ) : (
              <details key={alert.id} className="byt199-alert byt199-alert-high" open={!!alert.checklist}>
                <summary>{alert.title}</summary>
                <p>{alert.text}</p>
                {alert.checklist && (
                  <ul className="byt199-checklist">
                    {alert.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <span className="byt199-alert-src">Nguồn: {alert.sources.join("; ")}</span>
              </details>
            )
          )}
        </div>
      )}

      {/* Master Task 6: thuoc va lieu theo du lieu co cau truc (nhom AND/OR, moi thuoc mot hang) */}
      <DoseTable groups={structure.groups} status={structure.status} duration={regimen.duration} />

      <SupplementBox regimen={regimen} />

      <DrugActionLinks
        compact
        texts={regimen.drugs.map((drug) => `${drug.name}: ${drug.dose}`)}
        scenario={regimen.scenario}
      />

      {regimen.notes && regimen.notes.length > 0 && (
        <details className="byt199-notes">
          <summary>Lưu ý điều trị ({regimen.notes.length})</summary>
          <ul>
            {regimen.notes.map((note, index) => (
              <li key={`${regimen.id}-n${index}`}>{note}</li>
            ))}
          </ul>
        </details>
      )}

      <details className="byt199-doc">
        <summary>
          Nguồn: {docShort(regimen.source.doc)} · {regimen.source.section} · {regimen.source.page}
        </summary>
        <div>
          <strong>
            QĐ {doc.number} ({doc.date})
          </strong>{" "}
          – {doc.title}. {doc.validity}
        </div>
      </details>
    </article>
  );
}

export default function BytRegimenView({ diseaseId, diseaseTitle, showAllByDefault, moduleNote }: Props) {
  const allRegimens = useMemo(
    () => getRegimensForDisease(diseaseId),
    [diseaseId]
  );
  const [showAll, setShowAll] = useState(showAllByDefault ?? false);
  const clin = useClinicalFilters();

  /* Mac dinh chi hien phuong an CU THE (thuoc + lieu so). Phuong an chi neu ten
     nhom thuoc / khong neu lieu bi an, bam de hien. */
  /* Master Task 5 – Final: phuong an co lieu bo sung du (cung van ban/quoc te) cung hien san. */
  const hasDose = (r: Regimen) => isConcreteRegimen(r) || doseEvidenceOf(r) === "SUPPLEMENTED";
  const regimens = useMemo(
    () => (showAll ? allRegimens : allRegimens.filter(hasDose)),
    [allRegimens, showAll]
  );
  const hiddenCount = allRegimens.length - allRegimens.filter(hasDose).length;

  const scenarios = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, Regimen[]>();

    for (const regimen of regimens) {
      const list = map.get(regimen.scenario);
      if (list) {
        list.push(regimen);
      } else {
        order.push(regimen.scenario);
        map.set(regimen.scenario, [regimen]);
      }
    }

    return order.map((name) => ({
      name,
      items: (map.get(name) ?? [])
        .slice()
        .sort(
          (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
        ),
    }));
  }, [regimens]);

  const sourceChips = useMemo(() => {
    const seen = new Map<string, string>();
    for (const regimen of regimens) {
      seen.set(regimen.source.doc, docShort(regimen.source.doc));
    }
    return Array.from(seen.values());
  }, [regimens]);

  const [activeName, setActiveName] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [population, setPopulation] = useState<Population>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const popCounts = useMemo(() => {
    const counts: Record<Population, number> = {
      all: scenarios.length,
      child: 0,
      obstetric: 0,
      unspecified: 0,
    };
    for (const scenario of scenarios) {
      counts[classifyPopulation(scenario.name)] += 1;
    }
    return counts;
  }, [scenarios]);
  const popGroups = (["child", "obstetric", "unspecified"] as Population[]).filter((key) => popCounts[key] > 0).length;

  /* Bo loc lam sang: loc phuong an (di ung, danh muc) roi loc tinh huong (muc do, nguy co). */
  const clinicalScenarios = useMemo(() => {
    if (!clin) return scenarios;
    return scenarios
      .map((scenario) => ({
        ...scenario,
        items: scenario.items.filter((item) => {
          const texts = item.drugs.map((drug) => `${drug.name}: ${drug.dose}`);
          if (clin.hidePenicillin && betaLactamFlags(texts).penicillin) return false;
          if (clin.formularyOnly && anyInFormulary(texts) === false) return false;
          return true;
        }),
      }))
      .filter((scenario) => {
        if (scenario.items.length === 0) return false;
        const roles = scenario.items.map((item) => item.role);
        const sev = severityOf(scenario.name, roles.every((role) => role === "severe") ? "severe" : undefined);
        if (clin.severity !== "all" && sev !== "unspecified" && sev !== clin.severity) return false;
        const mdr = mdrOf(scenario.name);
        if (clin.mdr !== "all" && mdr !== "unspecified" && mdr !== clin.mdr) return false;
        return true;
      });
  }, [scenarios, clin]);

  const clinicalHidden =
    scenarios.reduce((n, s) => n + s.items.length, 0) -
    clinicalScenarios.reduce((n, s) => n + s.items.length, 0);

  const visibleScenarios = useMemo(() => {
    const q = normalizeText(query.trim());

    return clinicalScenarios.filter((scenario) => {
      if (
        population !== "all" &&
        classifyPopulation(scenario.name) !== population
      ) {
        return false;
      }

      if (!q) return true;

      const haystack = normalizeText(
        scenario.name +
          " " +
          scenario.items
            .map((item) =>
              item.drugs.map((drug) => drug.name + " " + drug.dose).join(" ")
            )
            .join(" ")
      );

      return haystack.includes(q);
    });
  }, [clinicalScenarios, query, population]);

  const rolesPresent = useMemo(() => {
    const set = new Set<RegimenRole>();
    for (const regimen of regimens) set.add(regimen.role);
    return ROLE_ORDER.filter((role) => set.has(role));
  }, [regimens]);

  if (regimens.length === 0) {
    return (
      <section className="byt199" data-disease={diseaseId}>
        <div className="byt199-label">PHÁC ĐỒ BỘ Y TẾ</div>
        <ReconciliationBox diseaseId={diseaseId} />
        {moduleNote ? (
          <div role="note" style={{ fontSize: 13, color: "#17364b", background: "#eef6fb", border: "1px solid #b9d7ea", borderRadius: 8, padding: "8px 12px" }}>{moduleNote}</div>
        ) : (
          <div className="byt199-warn">
            {allRegimens.length === 0
              ? "Không có phác đồ kháng sinh kinh nghiệm cho mặt bệnh này trong các văn bản BYT đã đọc."
              : "Văn bản BYT chỉ nêu tên thuốc/nhóm thuốc, không kèm liều (MISSING_DOSE_EVIDENCE)."}
          </div>
        )}
        {hiddenCount > 0 && (
          <button
            type="button"
            className="byt199-reset"
            onClick={() => setShowAll(true)}
          >
            Hiện {hiddenCount} phương án chưa có liều (MISSING_DOSE_EVIDENCE)
          </button>
        )}
      </section>
    );
  }

  const active =
    visibleScenarios.find((scenario) => scenario.name === activeName) ??
    visibleScenarios[0] ??
    null;

  const roleItems = active
    ? roleFilter === "all"
      ? active.items
      : active.items.filter((item) => item.role === roleFilter)
    : [];
  /* Master Task 6: tach ro Uu tien | Thay the | Theo tac nhan/kem theo (theo vai tro nguon ghi). */
  const preferred = roleItems.filter((item) => PREFERRED_ROLES.includes(item.role));
  const alternatives = roleItems.filter((item) => ALT_ROLES.includes(item.role));
  const special = roleItems.filter((item) => !PREFERRED_ROLES.includes(item.role) && !ALT_ROLES.includes(item.role));
  /* Tinh huong chi co phac do theo tac nhan (ten tinh huong la tac nhan) -> hien san. */
  const specialOnly = preferred.length === 0 && alternatives.length === 0;
  const specialCritical = special.filter((r) => safetyAlertsFor(r.id).some((a) => a.level === "critical")).length;
  const specialChecklist = special.some((r) => safetyAlertsFor(r.id).some((a) => !!a.checklist));
  const filtering =
    query.trim() !== "" || population !== "all" || roleFilter !== "all";

  function resetFilters() {
    setQuery("");
    setPopulation("all");
    setRoleFilter("all");
  }

  return (
    <section className="byt199" data-disease={diseaseId}>
      <div className="byt199-top">
        <div>
          <div className="byt199-label">PHÁC ĐỒ THEO VĂN BẢN BỘ Y TẾ</div>
          {diseaseTitle && (
            <div className="byt199-title">{diseaseTitle}</div>
          )}
        </div>
        <div className="byt199-count">
          {scenarios.length} tình huống · {regimens.length} phương án
        </div>
      </div>

      <div className="byt199-sources">
        <span>Tài liệu:</span>
        {sourceChips.map((chip) => (
          <span key={chip} className="byt199-doc-chip">
            {chip}
          </span>
        ))}
        <span className="byt199-unverified">Hiệu lực chưa xác minh</span>
      </div>

      <ReconciliationBox diseaseId={diseaseId} />

      {clin && clinicalHidden > 0 && (
        <div className="byt199-warn" role="status">
          Bộ lọc lâm sàng đang ẩn {clinicalHidden} phương án. Tình huống không ghi
          mức độ/nguy cơ vẫn được hiển thị.
        </div>
      )}

      {/* Giao dien toi gian: o tim chi khi nhieu tinh huong; chip doi tuong chi khi co >= 2 nhom. */}
      {(scenarios.length > 5 || popGroups > 1) && (
        <div className="byt199-filters">
          {scenarios.length > 5 && (
            <input
              type="search"
              className="byt199-search"
              placeholder="Tìm thuốc hoặc tình huống (vd. vancomycin, trẻ em, ICU)"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Tìm trong phác đồ"
            />
          )}

          {popGroups > 1 && (
            <div
              className="byt199-chips"
              role="group"
              aria-label="Nhóm đối tượng"
              title="Lọc theo từ khóa đối tượng trong tên tình huống của nguồn"
            >
              {(Object.keys(POP_LABEL) as Population[])
                .filter((key) => key === "all" || popCounts[key] > 0)
                .map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={population === key ? "active" : ""}
                    onClick={() => setPopulation(key)}
                  >
                    {POP_LABEL[key]} ({popCounts[key]})
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {scenarios.length > 1 && (
        <div className="byt199-step">
          <div className="byt199-step-title">
            <span className="byt199-step-no">1</span> Chọn tình huống
            <span className="byt199-step-count">
              {visibleScenarios.length}/{scenarios.length}
            </span>
          </div>

          {visibleScenarios.length === 0 ? (
            <div className="byt199-empty">
              Không có tình huống khớp bộ lọc.{" "}
              <button type="button" onClick={resetFilters}>
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="byt199-scenarios" role="tablist">
              {visibleScenarios.map((scenario) => {
                /* So thu tu theo nguon (bo loc lam sang tao doi tuong moi -> tim theo ten). */
                const index = scenarios.findIndex((s) => s.name === scenario.name);
                const isActive = active?.name === scenario.name;

                return (
                  <button
                    key={scenario.name}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={isActive ? "active" : ""}
                    onClick={() => setActiveName(scenario.name)}
                  >
                    <span className="byt199-sc-no">{index + 1}</span>
                    <span className="byt199-sc-name">{scenario.name}</span>
                    {/* Master Task 5 – Final: canh bao khoa hien ngay tren tab, khong can mo tinh huong */}
                    {scenario.items.some((r) => safetyAlertsFor(r.id).some((a) => a.autoRecommend === "block")) && (
                      <span className="byt199-sc-lock" title="Tình huống có phương án bị khóa đề xuất tự động">Khóa</span>
                    )}
                    <span className="byt199-sc-n">{scenario.items.length}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="byt199-step">
        <div className="byt199-step-title">
          <span className="byt199-step-no">
            {scenarios.length > 1 ? 2 : 1}
          </span>{" "}
          Phác đồ
        </div>
        {active ? (
          <>
        <div className="byt199-scenario">{active.name}</div>

        {rolesPresent.length > 1 && (
          <div className="byt199-chips" role="group" aria-label="Vai trò phác đồ">
            <button
              type="button"
              className={roleFilter === "all" ? "active" : ""}
              onClick={() => setRoleFilter("all")}
            >
              Tất cả
            </button>
            {rolesPresent.map((role) => (
              <button
                key={role}
                type="button"
                className={roleFilter === role ? "active" : ""}
                onClick={() => setRoleFilter(role)}
              >
                {ROLE_TEXT[role]}
              </button>
            ))}
          </div>
        )}

        {roleFilter !== "all" && roleItems.length === 0 && (
          <div className="byt199-empty">
            Nguồn không có phương án &quot;{ROLE_TEXT[roleFilter]}&quot; cho tình
            huống này. Không tự suy ra thuốc thay thế.{" "}
            <button type="button" onClick={() => setRoleFilter("all")}>
              Xem tất cả vai trò
            </button>
          </div>
        )}

        {preferred.length > 0 && (
          <section className="byt199-sec">
            <h4 className="byt199-sec-title">Lựa chọn ưu tiên</h4>
            <div className="byt199-cards">
              {preferred.map((regimen) => (
                <RegimenCard key={regimen.id} regimen={regimen} />
              ))}
            </div>
          </section>
        )}

        {alternatives.length > 0 && (
          <section className="byt199-sec">
            <h4 className="byt199-sec-title">Lựa chọn thay thế</h4>
            <div className="byt199-cards">
              {alternatives.map((regimen) => (
                <RegimenCard key={regimen.id} regimen={regimen} />
              ))}
            </div>
          </section>
        )}

        {special.length > 0 && (
          /* Buoc 4D.3: khong giau canh bao nguy co cao/checklist trong nhom thu gon. */
          <details className="byt199-more" open={specialOnly || specialCritical > 0 || specialChecklist}>
            <summary>
              Theo tác nhân nghi ngờ / điều trị kèm ({special.length})
              {specialCritical > 0 && (
                <span className="byt199-more-alert"> · {specialCritical} phương án có cảnh báo NGUY CƠ CAO</span>
              )}
            </summary>
            <div className="byt199-cards">
              {special.map((regimen) => (
                <RegimenCard key={regimen.id} regimen={regimen} />
              ))}
            </div>
          </details>
        )}
          </>
        ) : (
          <div className="byt199-empty">Chọn một tình huống ở bước 1.</div>
        )}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          className="byt199-reset"
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll
            ? "Ẩn phương án chưa có liều"
            : `Hiện ${hiddenCount} phương án chưa có liều (MISSING_DOSE_EVIDENCE)`}
        </button>
      )}

      {filtering && (
        <button type="button" className="byt199-reset" onClick={resetFilters}>
          Xóa tất cả bộ lọc
        </button>
      )}

      <div className="byt199-foot">
        Hỗ trợ tra cứu, không phải y lệnh · liều nguyên văn nguồn · chưa được HĐT&ĐT BV199 phê duyệt.
      </div>

      <style>{`
        .byt199 {
          background: #ffffff;
          border: 1px solid #dce6ed;
          border-radius: 12px;
          padding: 14px;
          display: grid;
          gap: 12px;
          min-width: 0;
          color: #17364b;
        }
        .byt199 * { box-sizing: border-box; }
        .byt199 ul { margin: 0; padding: 0; list-style: none; }
        .byt199 summary { cursor: pointer; }
        .byt199-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          flex-wrap: wrap;
        }
        .byt199-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #0b6b8a;
        }
        .byt199-title { font-size: 15px; font-weight: 700; margin-top: 2px; }
        .byt199-count {
          font-size: 12px;
          color: #55707f;
          background: #f1f6f9;
          border-radius: 999px;
          padding: 3px 10px;
          white-space: nowrap;
        }
        .byt199-sources {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #55707f;
        }
        .byt199-doc-chip {
          background: #e3f1f7;
          color: #0b5370;
          font-weight: 700;
          border-radius: 6px;
          padding: 2px 8px;
        }
        .byt199-unverified { color: #8a5a00; font-weight: 600; }
        .byt199-step { display: grid; gap: 8px; }
        .byt199-step-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
        }
        .byt199-step-no {
          display: inline-grid;
          place-items: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0b6b8a;
          color: #fff;
          font-size: 11px;
        }
        .byt199-scenarios {
          display: grid;
          gap: 4px;
          max-height: 228px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .byt199-scenarios button {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          width: 100%;
          text-align: left;
          border: 1px solid #dce6ed;
          background: #f7fafc;
          color: #17364b;
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 13px;
          line-height: 1.35;
          cursor: pointer;
        }
        .byt199-scenarios button:hover { border-color: #0b6b8a; }
        .byt199-scenarios button.active {
          background: #0b6b8a;
          border-color: #0b6b8a;
          color: #ffffff;
        }
        .byt199-sc-lock {
          flex: 0 0 auto;
          font-size: 10.5px;
          font-weight: 800;
          color: #fff;
          background: #9f1239;
          border-radius: 999px;
          padding: 1px 7px;
        }
        .byt199-sc-no {
          flex: 0 0 auto;
          min-width: 18px;
          font-weight: 800;
          opacity: 0.8;
        }
        .byt199-sc-name { min-width: 0; overflow-wrap: anywhere; }
        .byt199-filters { display: grid; gap: 8px; }
        .byt199-search {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid #c5d6e0;
          border-radius: 8px;
          font-size: 14px;
          background: #fff;
          color: #17364b;
        }
        .byt199-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .byt199-chips button {
          border: 1px solid #c5d6e0;
          background: #f4f8fb;
          color: #17364b;
          border-radius: 999px;
          padding: 4px 11px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .byt199-chips button.active {
          background: #0b6b8a;
          border-color: #0b6b8a;
          color: #fff;
        }
        .byt199-hint { font-size: 11px; color: #6d8593; }
        .byt199-step-count {
          margin-left: auto;
          font-size: 11px;
          font-weight: 600;
          color: #55707f;
        }
        .byt199-sc-n {
          margin-left: auto;
          flex: 0 0 auto;
          font-size: 11px;
          opacity: 0.75;
        }
        .byt199-empty {
          font-size: 13px;
          background: #f1f6f9;
          border-radius: 8px;
          padding: 10px 12px;
          line-height: 1.5;
        }
        .byt199-empty button, .byt199-reset {
          border: 0;
          background: none;
          color: #0b6b8a;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-size: 12px;
        }
        .byt199-scenario {
          font-size: 15px;
          font-weight: 700;
          line-height: 1.35;
          padding: 8px 10px;
          background: #eef6f9;
          border-left: 4px solid #0b6b8a;
          border-radius: 4px 8px 8px 4px;
          overflow-wrap: anywhere;
        }
        .byt199-cards { display: grid; gap: 10px; }
        .byt199-sec { display: grid; gap: 6px; }
        .byt199-sec-title { margin: 4px 0 0; font-size: 13px; font-weight: 800; color: #0b6b8a; text-transform: uppercase; letter-spacing: .03em; }
        .byt199-card {
          border: 1px solid #dce6ed;
          border-radius: 10px;
          padding: 10px 12px;
          display: grid;
          gap: 8px;
          background: #ffffff;
          min-width: 0;
        }
        .byt199-card-first { border-left: 4px solid #1e8a52; }
        .byt199-card-severe { border-left: 4px solid #c0392b; }
        .byt199-card-pathogen { border-left: 4px solid #0b6b8a; }
        .byt199-card-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
        }
        .byt199-role, .byt199-flag {
          font-size: 12px;
          font-weight: 700;
          border-radius: 999px;
          padding: 2px 9px;
        }
        .byt199-role { background: #e3f1f7; color: #0b5370; }
        .byt199-role-first { background: #dff3e6; color: #17603a; }
        .byt199-role-severe { background: #fde7e4; color: #8a2a1d; }
        .byt199-role-allergy { background: #fff1d6; color: #7a4d00; }
        .byt199-flag { background: #fff1d6; color: #7a4d00; }
        .byt199-approval, .byt199-conflict { font-size: 11px; font-weight: 700; border-radius: 999px; padding: 3px 8px; }
        .byt199-approval { background: #fff; color: #9a3412; border: 1px solid #fdba74; }
        .byt199-conflict { background: #fef3c7; color: #92400e; }
        .byt199-locked { font-size: 11px; font-weight: 800; border-radius: 999px; padding: 3px 8px; background: #7f1d1d; color: #fff; }
        .byt199-alerts { display: grid; gap: 6px; }
        .byt199-more-alert { color: #b91c1c; font-weight: 800; }
        .byt199-alert { border-radius: 8px; padding: 8px 10px; font-size: 12.5px; line-height: 1.5; overflow-wrap: anywhere; }
        .byt199-alert p { margin: 4px 0; }
        .byt199-alert-critical { background: #fef2f2; border: 1px solid #fca5a5; border-left: 4px solid #b91c1c; color: #7f1d1d; }
        .byt199-alert-critical strong { color: #991b1b; }
        .byt199-alert-high { background: #fffbeb; border: 1px solid #fcd34d; color: #78350f; }
        .byt199-alert-high summary { cursor: pointer; font-weight: 700; }
        .byt199-alert-src { display: block; font-size: 11px; opacity: .8; }
        .byt199-checklist { margin: 4px 0; padding-left: 0; list-style: none; display: grid; gap: 4px; }
        .byt199-checklist li { padding-left: 22px; position: relative; }
        .byt199-checklist li::before { content: ""; position: absolute; left: 2px; top: 3px; width: 12px; height: 12px; border: 1.5px solid #92400e; border-radius: 3px; }
        .byt199-src-chip {
          margin-left: auto;
          font-size: 11px;
          font-weight: 700;
          color: #0b5370;
          background: #f1f6f9;
          border-radius: 6px;
          padding: 2px 8px;
          overflow-wrap: anywhere;
          text-align: right;
        }
        .byt199-drugs { display: grid; gap: 0; }
        .byt199-drugs li {
          display: grid;
          gap: 2px;
          padding: 7px 0;
          border-top: 1px dashed #e3ecf1;
          overflow-wrap: anywhere;
        }
        .byt199-drugs li:first-child { border-top: 0; padding-top: 0; }
        .byt199-drug-name { font-size: 15px; font-weight: 800; }
        .byt199-drug-dose { font-size: 14px; color: #33505f; line-height: 1.45; }
        .byt199-supp { margin-top: 8px; padding: 8px 10px; border-radius: 10px; background: #f0f9ff; border-left: 3px solid #0e7490; font-size: 12.5px; line-height: 1.5; overflow-wrap: anywhere; }
        .byt199-supp ul { margin: 4px 0; padding-left: 18px; }
        .byt199-supp p { margin: 2px 0; }
        .byt199-supp-head { font-weight: 800; color: #164e63; }
        .byt199-supp-missing { color: #7c2d12; }
        .byt199-supp-src { font-size: 11.5px; color: #4b6576; }
        .byt199-supp-src a { color: #087f89; text-decoration: underline; }
        .byt199-duration {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 10px;
          align-items: baseline;
          font-size: 13px;
          background: #f1f6f9;
          border-radius: 8px;
          padding: 6px 10px;
          overflow-wrap: anywhere;
        }
        .byt199-duration span { color: #55707f; font-weight: 700; }
        .byt199-notes, .byt199-doc { font-size: 12px; color: #55707f; }
        .byt199-notes summary, .byt199-doc summary { font-weight: 700; }
        .byt199-notes ul { display: grid; gap: 6px; margin-top: 6px; }
        .byt199-notes li {
          padding-left: 10px;
          border-left: 3px solid #dce6ed;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }
        .byt199-doc div { margin-top: 6px; line-height: 1.5; overflow-wrap: anywhere; }
        .byt199-more > summary {
          font-size: 13px;
          font-weight: 700;
          color: #0b6b8a;
          padding: 8px 0;
        }
        .byt199-more .byt199-cards { margin-top: 6px; }
        .byt199-warn, .byt199-foot {
          background: #fff8e6;
          border: 1px solid #f0d58c;
          color: #6b4b00;
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 12px;
          line-height: 1.5;
        }
        @media (prefers-color-scheme: dark) {
          .byt199 { background: #12202a; border-color: #2a3f4d; color: #e4eef4; }
          .byt199-card { background: #172a36; border-color: #2a3f4d; }
          .byt199-count, .byt199-duration, .byt199-src-chip { background: #1b3140; color: #cfe3ee; }
          .byt199-scenario { background: #172a36; }
          .byt199-scenarios button { background: #172a36; border-color: #2a3f4d; color: #e4eef4; }
          .byt199-scenarios button.active { background: #1c88ad; border-color: #1c88ad; color: #fff; }
          .byt199-drug-dose, .byt199-notes, .byt199-doc, .byt199-sources { color: #a9c0cc; }
          .byt199-drugs li { border-color: #2a3f4d; }
          .byt199-doc-chip { background: #1b3140; color: #cfe3ee; }
          .byt199-search { background: #172a36; border-color: #2a3f4d; color: #e4eef4; }
          .byt199-chips button { background: #1b3140; border-color: #2a3f4d; color: #e4eef4; }
          .byt199-chips button.active { background: #1c88ad; border-color: #1c88ad; color: #fff; }
          .byt199-empty { background: #1b3140; }
          .byt199-alert-critical { background: #3b1414; border-color: #7f1d1d; color: #fecaca; }
          .byt199-alert-critical strong { color: #fca5a5; }
          .byt199-alert-high { background: #3a2a0c; border-color: #92400e; color: #fde68a; }
          .byt199-approval { background: #172a36; color: #fdba74; border-color: #9a3412; }
          .byt199-conflict { background: #3a2a0c; color: #fde68a; }
        }
      `}</style>
    </section>
  );
}
