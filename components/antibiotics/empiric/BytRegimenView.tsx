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

type Props = {
  diseaseId: string;
  diseaseTitle?: string;
};

const NO_DOSE_MARK = "Nguồn BYT không nêu liều";

/* Vai tro hien san (nhom chinh) va thu tu hien thi. */
const PRIMARY_ROLES: RegimenRole[] = ["first", "severe", "pathogen"];
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
  return regimen.drugs.some((drug) => drug.dose.includes(NO_DOSE_MARK));
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

  return (
    <article className={`byt199-card byt199-card-${regimen.role}`}>
      <header className="byt199-card-head">
        <span className={`byt199-role byt199-role-${regimen.role}`}>
          {ROLE_TEXT[regimen.role]}
        </span>
        {noDose && <span className="byt199-flag">Nguồn không nêu liều</span>}
        <span className="byt199-src-chip" title={doc.title}>
          {docShort(regimen.source.doc)} · {regimen.source.section} ·{" "}
          {regimen.source.page}
        </span>
      </header>

      <ul className="byt199-drugs">
        {regimen.drugs.map((drug, index) => (
          <li key={`${regimen.id}-${index}`}>
            <span className="byt199-drug-name">{drug.name}</span>
            <span className="byt199-drug-dose">{drug.dose}</span>
          </li>
        ))}
      </ul>

      {regimen.duration && (
        <div className="byt199-duration">
          <span>Thời gian</span>
          <strong>{regimen.duration}</strong>
        </div>
      )}

      {regimen.notes && regimen.notes.length > 0 && (
        <details className="byt199-notes">
          <summary>Lưu ý ({regimen.notes.length})</summary>
          <ul>
            {regimen.notes.map((note, index) => (
              <li key={`${regimen.id}-n${index}`}>{note}</li>
            ))}
          </ul>
        </details>
      )}

      <details className="byt199-doc">
        <summary>Văn bản và hiệu lực</summary>
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

export default function BytRegimenView({ diseaseId, diseaseTitle }: Props) {
  const allRegimens = useMemo(
    () => getRegimensForDisease(diseaseId),
    [diseaseId]
  );
  const [showAll, setShowAll] = useState(false);

  /* Mac dinh chi hien phuong an CU THE (thuoc + lieu so). Phuong an chi neu ten
     nhom thuoc / khong neu lieu bi an, bam de hien. */
  const regimens = useMemo(
    () => (showAll ? allRegimens : allRegimens.filter(isConcreteRegimen)),
    [allRegimens, showAll]
  );
  const hiddenCount = allRegimens.length - allRegimens.filter(isConcreteRegimen).length;

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

  const visibleScenarios = useMemo(() => {
    const q = normalizeText(query.trim());

    return scenarios.filter((scenario) => {
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
  }, [scenarios, query, population]);

  const rolesPresent = useMemo(() => {
    const set = new Set<RegimenRole>();
    for (const regimen of regimens) set.add(regimen.role);
    return ROLE_ORDER.filter((role) => set.has(role));
  }, [regimens]);

  if (regimens.length === 0) {
    return (
      <section className="byt199" data-disease={diseaseId}>
        <div className="byt199-label">PHÁC ĐỒ BỘ Y TẾ</div>
        <div className="byt199-warn">
          {allRegimens.length === 0
            ? "Không có phác đồ kháng sinh kinh nghiệm cho mặt bệnh này trong các văn bản BYT đã đọc."
            : "Văn bản BYT cho mặt bệnh này chỉ nêu tên thuốc hoặc nhóm thuốc, không kèm liều cụ thể. Xem nội dung chi tiết trong phần module bên dưới (nếu có)."}
        </div>
        {hiddenCount > 0 && (
          <button
            type="button"
            className="byt199-reset"
            onClick={() => setShowAll(true)}
          >
            Hiện {hiddenCount} phương án chưa đủ liều
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
  const primary =
    roleFilter === "all"
      ? roleItems.filter((item) => PRIMARY_ROLES.includes(item.role))
      : roleItems;
  const secondary =
    roleFilter === "all"
      ? roleItems.filter((item) => !PRIMARY_ROLES.includes(item.role))
      : [];
  const shownPrimary = primary.length > 0 ? primary : roleItems;
  const shownSecondary = primary.length > 0 ? secondary : [];
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

      {scenarios.length > 1 && (
        <div className="byt199-filters">
          <input
            type="search"
            className="byt199-search"
            placeholder="Tìm theo thuốc hoặc tình huống (ví dụ: vancomycin, trẻ em, ICU)"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Tìm trong phác đồ"
          />

          <div className="byt199-chips" role="group" aria-label="Nhóm đối tượng">
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
          <div className="byt199-hint">
            Nhóm đối tượng chỉ lọc theo từ khóa trong tên tình huống của nguồn.
          </div>
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
                const index = scenarios.indexOf(scenario);
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

        <div className="byt199-cards">
          {shownPrimary.map((regimen) => (
            <RegimenCard key={regimen.id} regimen={regimen} />
          ))}
        </div>

        {shownSecondary.length > 0 && (
          <details className="byt199-more">
            <summary>
              Thay thế, dị ứng, điều trị kèm theo ({shownSecondary.length})
            </summary>
            <div className="byt199-cards">
              {shownSecondary.map((regimen) => (
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
            ? "Ẩn các phương án chưa đủ liều"
            : `Đang ẩn ${hiddenCount} phương án chỉ nêu tên nhóm thuốc hoặc không nêu liều – bấm để hiện`}
        </button>
      )}

      {filtering && (
        <button type="button" className="byt199-reset" onClick={resetFilters}>
          Xóa tất cả bộ lọc
        </button>
      )}

      <div className="byt199-foot">
        Hỗ trợ tra cứu, không phải y lệnh. Liều ghi nguyên văn theo nguồn; cần
        đối chiếu kháng sinh đồ, chức năng thận/gan, dị ứng, danh mục BV199 và
        thẩm định của dược sĩ lâm sàng. Chưa phác đồ nào được BV199 phê duyệt.
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
        }
      `}</style>
    </section>
  );
}
