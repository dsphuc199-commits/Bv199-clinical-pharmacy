
"use client";

import { useMemo, useState } from "react";

import CapByt2026 from "../../../../components/antibiotics/CapByt2026";
import HapVap2023 from "../../../../components/antibiotics/HapVap2023";
import EntEmpiricGuidelines, {
  isEntDisease,
} from "../../../../components/antibiotics/EntEmpiricGuidelines";
import AbrsUpToDate2026 from "../../../../components/antibiotics/AbrsUpToDate2026";

import BytRegimenView from "../../../../components/antibiotics/empiric/BytRegimenView";
import EmpiricSelector from "../../../../components/antibiotics/empiric/EmpiricSelector";
import type { ModuleKey } from "../../../../lib/antibiotics/select-regimens";
import DiseaseProfile, {
  StatusBadge,
} from "../../../../components/antibiotics/empiric/DiseaseProfile";
import {
  DISEASES,
  getPopulationHint,
  getStream,
  normalize,
} from "../../../../data/antibiotics/empiric/catalog";
import { getGroupsForDisease } from "../../../../data/antibiotics/empiric/groups";
import { getRegimensForDisease } from "../../../../data/antibiotics/empiric/regimens";
import {
  BYT_REGIMEN_STATUS,
  DEFAULT_STATUS,
  DISEASE_STATUS,
  ENT_MODULE_STATUS,
} from "../../../../data/antibiotics/empiric/status";
import type { Disease } from "../../../../data/antibiotics/empiric/types";

/*
  KHOA DUOC - BENH VIEN 199
  DIEU TRI KHANG SINH KINH NGHIEM

  FILE:
  app/antibiotics/empiric/guideline-v9/page.tsx

  PHIEN BAN TICH HOP:
  1. Danh muc mat benh theo chuyen khoa
  2. Tim kiem, loc va thu gon danh muc
  3. CAP - BYT 2026
  4. HAP/VAP - Khuyen cao Viet Nam 2023
  5. Tai Mui Hong
  6. Viem xoang cap ngoai tru - UpToDate 2026
  7. Phan biet ngoai tru va noi tru
  8. Giu nguyen cac module khac
  11. Phac do BYT chi tiet (BytRegimenView) tu data/antibiotics/empiric/regimens
  9. Danh muc (chi mat benh co phac do BYT) o data/antibiotics/empiric/catalog.ts
  10. Ho so mat benh A-F + trang thai du lieu 0-5 (DiseaseProfile)

  Chu y:
  Khong mac dinh phac do trong app da duoc
  Hoi dong chuyen mon BV199 phe duyet.
*/


function isAdultCAP(disease: Disease): boolean {
  const title = normalize(disease.title);

  return (
    (title === "viem phoi cong dong" ||
      title === "viem phoi cong dong (cap) o nguoi lon" ||
      title === "viem phoi mac phai cong dong o nguoi lon") &&
    !normalize(disease.specialty).includes("nhi khoa")
  );
}

function isHAP(disease: Disease): boolean {
  return normalize(disease.title) === "viem phoi benh vien";
}

function isVAP(disease: Disease): boolean {
  return normalize(disease.title) === "viem phoi lien quan tho may";
}

function isAdultABRS(disease: Disease): boolean {
  if (disease.specialty !== "Tai Mũi Họng") {
    return false;
  }

  const title = normalize(disease.title);

  return (
    title === "viem xoang cap do vi khuan" ||
    title === "viem xoang cap do vi khuan o nguoi lon"
  );
}

const VI_COLLATOR = new Intl.Collator("vi", { sensitivity: "base", numeric: true });

export default function GuidelinePage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("v8-1");
  const [pickedScenario, setPickedScenario] = useState<string | null>(null);
  const [mobileListMode, setMobileListMode] = useState<"specialty" | "disease">("specialty");
  const [specialtyFilter, setSpecialtyFilter] =
    useState("Tất cả");

  const [showCatalog, setShowCatalog] = useState(true);

  const [openedGroups, setOpenedGroups] = useState<string[]>([
    "Hô hấp",
  ]);

  const [abrsSetting, setAbrsSetting] =
    useState<"outpatient" | "inpatient">("outpatient");

  const specialties = useMemo(() => {
    const names = Array.from(
      new Set(DISEASES.map((disease) => disease.specialty))
    );

    return names.sort((a, b) => VI_COLLATOR.compare(a, b));
  }, []);

  const filtered = useMemo(() => {
    return DISEASES.filter((disease) => {
      const matchesSpecialty =
        specialtyFilter === "Tất cả" ||
        disease.specialty === specialtyFilter;

      const text = normalize(
        disease.title + " " + disease.specialty
      );

      const matchesQuery = text.includes(
        normalize(query)
      );

      return matchesSpecialty && matchesQuery;
    });
  }, [query, specialtyFilter]);

  const groups = useMemo(() => {
    return specialties
      .map((specialty) => ({
        specialty,
        diseases: filtered.filter(
          (disease) => disease.specialty === specialty
        ),
      }))
      .filter((group) => group.diseases.length > 0);
  }, [filtered, specialties]);

  const selected =
    DISEASES.find((disease) => disease.id === selectedId) ??
    DISEASES[0];

  const isEnt =
    selected.specialty === "Tai Mũi Họng" &&
    isEntDisease(selected.title);

  const isAbrs = isAdultABRS(selected);

  const hasModule =
    isAbrs ||
    isEnt ||
    isAdultCAP(selected) ||
    isHAP(selected) ||
    isVAP(selected);

  const hasBytRegimen = getRegimensForDisease(selected.id).length > 0;

  const statusEntry =
    DISEASE_STATUS[selected.id] ??
    (isEnt
      ? ENT_MODULE_STATUS
      : hasBytRegimen
        ? BYT_REGIMEN_STATUS
        : DEFAULT_STATUS);

  const stream = getStream(selected);
  const linkedGroups = getGroupsForDisease(selected.id);

  const moduleKey: ModuleKey | null = isEnt
    ? "ent"
    : isAdultCAP(selected)
      ? "cap"
      : isHAP(selected)
        ? "hap"
        : isVAP(selected)
          ? "vap"
          : null;

  function chooseDisease(disease: Disease) {
    setPickedScenario(null);
    setSelectedId(disease.id);
    setAbrsSetting("outpatient");
  }

  function selectById(id: string) {
    const target = DISEASES.find((disease) => disease.id === id);

    if (!target) return;

    chooseDisease(target);

    setOpenedGroups((current) =>
      current.includes(target.specialty)
        ? current
        : [...current, target.specialty]
    );
  }

  function titleOf(id: string): string {
    return DISEASES.find((disease) => disease.id === id)?.title ?? id;
  }

  function toggleGroup(name: string) {
    setOpenedGroups((current) =>
      current.includes(name)
        ? current.filter((value) => value !== name)
        : [...current, name]
    );
  }

  function changeSpecialty(name: string) {
    setSpecialtyFilter(name);

    setOpenedGroups(
      name === "Tất cả" ? ["Hô hấp"] : [name]
    );
  }

  return (
    <main className="bv199-empiric">
      <style>{`
        .bv199-empiric {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 16px 18px 72px;
          font-family: Arial, sans-serif;
          color: #17364b;
          box-sizing: border-box;
        }

        .bv199-empiric * {
          box-sizing: border-box;
        }

        .bv199-empiric-heading {
          margin-bottom: 16px;
        }

        .bv199-empiric-kicker {
          color: #087f89;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .6px;
        }

        .bv199-empiric-heading h1 {
          margin: 7px 0;
          font-size: 24px;
          font-weight: 650;
        }

        .bv199-empiric-subtitle {
          margin: 0;
          font-size: 13px;
          color: #61798b;
          line-height: 1.6;
        }

        .bv199-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .bv199-status {
          color: #647b8c;
          font-size: 12px;
        }

        .bv199-toggle {
          cursor: pointer;
          background: #fff;
          border: 1px solid #cedde5;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 12px;
          color: #087f89;
          font-weight: 700;
        }

        .bv199-layout {
          display: grid;
          grid-template-columns:
            minmax(245px, 30%) minmax(0, 1fr);
          gap: 14px;
          align-items: start;
        }

        .bv199-layout.collapsed {
          grid-template-columns: minmax(0, 1fr);
        }

        .bv199-panel {
          min-width: 0;
          padding: 14px;
          background: #fff;
          border: 1px solid #dbe6ed;
          border-radius: 12px;
        }

        .bv199-catalog {
          position: sticky;
          top: 10px;
        }

        .bv199-catalog h2 {
          font-size: 16px;
          margin: 0 0 12px;
        }

        .bv199-search,
        .bv199-select {
          display: block;
          width: 100%;
          padding: 11px;
          border: 1px solid #cedce6;
          border-radius: 8px;
          background: white;
          font: inherit;
          font-size: 13px;
          color: #17364b;
        }

        .bv199-select {
          margin-top: 9px;
        }

        .bv199-catalog-tools {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin: 11px 0;
          color: #647b8c;
          font-size: 11px;
        }

        .bv199-link-button {
          border: 0;
          background: transparent;
          cursor: pointer;
          color: #087f89;
          font-size: 11px;
        }

        .bv199-group-list {
          max-height: calc(100vh - 300px);
          min-height: 160px;
          overflow-y: auto;
          display: grid;
          align-content: start;
          gap: 7px;
          padding-right: 3px;
        }

        .bv199-group {
          border: 1px solid #dbe6ed;
          border-radius: 8px;
          overflow: hidden;
        }

        .bv199-group-header {
          width: 100%;
          border: 0;
          background: #f6f9fb;
          padding: 11px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          gap: 8px;
          color: #17364b;
          font-weight: 700;
          font-size: 12px;
        }

        .bv199-count {
          color: #647b8c;
          font-size: 11px;
          font-weight: 400;
        }

        .bv199-disease-list {
          padding: 5px;
          display: grid;
          gap: 4px;
        }

        .bv199-disease {
          width: 100%;
          text-align: left;
          border: 1px solid transparent;
          background: #fff;
          padding: 10px;
          border-radius: 7px;
          cursor: pointer;
          color: #17364b;
          font-size: 12px;
          line-height: 1.5;
        }

        .bv199-disease:hover {
          background: #f1f8fa;
        }

        .bv199-disease.selected {
          border-color: #079f9b;
          background: #e3f6f2;
          font-weight: 700;
        }

        .bv199-treatment {
          display: grid;
          gap: 12px;
          min-width: 0;
          align-content: start;
        }

        .bv199-disease-heading h2 {
          font-size: 21px;
          margin: 7px 0;
        }

        .bv199-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .4px;
          color: #087f89;
        }

        .bv199-muted {
          color: #647b8c;
          font-size: 12px;
          line-height: 1.7;
        }

        .bv199-warning {
          padding: 12px;
          background: #fff7e9;
          border: 1px solid #f1dfc0;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.8;
        }

        .bv199-setting {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 12px;
        }

        .bv199-setting-button {
          width: 100%;
          cursor: pointer;
          text-align: left;
          border: 1px solid #dce6ed;
          background: #fff;
          border-radius: 9px;
          padding: 12px;
          font-size: 13px;
          color: #17364b;
        }

        .bv199-setting-button.active {
          background: #e4f6f2;
          border-color: #079b9b;
          font-weight: 700;
        }

        .bv199-empiric summary {
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
        }

        .bv199-empiric a {
          color: #087f89;
        }

        @media (max-width: 1000px) {
          .bv199-layout {
            grid-template-columns:
              minmax(220px, 32%) minmax(0, 1fr);
          }

          .bv199-layout.collapsed {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 760px) {
          .bv199-empiric {
            padding: 12px 10px 65px;
          }

          .bv199-layout,
          .bv199-layout.collapsed {
            grid-template-columns: minmax(0, 1fr);
          }

          .bv199-catalog {
            position: static;
          }

          .bv199-group-list {
            max-height: 300px;
          }

          .bv199-disease-heading h2 {
            font-size: 19px;
          }
        }

        @media (max-width: 440px) {
          .bv199-setting {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="bv199-empiric-heading">
        <div className="bv199-empiric-kicker">
          KHOA DƯỢC · BỆNH VIỆN 199
        </div>

        <h1>Điều trị kháng sinh kinh nghiệm</h1>

        <p className="bv199-empiric-subtitle">
          Chỉ gồm các mặt bệnh có phác đồ kháng sinh trong
          hướng dẫn của Bộ Y tế. Chuyên khoa và mặt bệnh
          xếp theo thứ tự A–Z.
        </p>
      </header>

      <div className="bv199-toolbar">
        <div className="bv199-status">
          {DISEASES.length} mục trong thư viện ·
          Dữ liệu đang thẩm định
        </div>

        <button
          type="button"
          className="bv199-toggle"
          onClick={() =>
            setShowCatalog((current) => !current)
          }
        >
          {showCatalog
            ? "◀ Thu gọn danh mục"
            : "▶ Hiện danh mục"}
        </button>
      </div>

      <div
        className={
          showCatalog
            ? "bv199-layout"
            : "bv199-layout collapsed"
        }
      >
        {showCatalog && (
          <aside className="bv199-panel bv199-catalog">
            <h2>Danh mục theo chuyên khoa</h2>
            <div className="bv199-mobile-mode-tabs" role="group" aria-label="Kiểu danh mục">
              <button type="button" className={mobileListMode === "specialty" ? "active" : ""} onClick={() => setMobileListMode("specialty")}>Theo chuyên khoa</button>
              <button type="button" className={mobileListMode === "disease" ? "active" : ""} onClick={() => setMobileListMode("disease")}>Theo mặt bệnh</button>
            </div>

            <input
              type="search"
              className="bv199-search"
              value={query}
              placeholder="Tìm tên bệnh hoặc chuyên khoa..."
              aria-label="Tìm mặt bệnh"
              onChange={(event) =>
                setQuery(event.target.value)
              }
            />

            <select
              className="bv199-select"
              value={specialtyFilter}
              aria-label="Lọc chuyên khoa"
              onChange={(event) =>
                changeSpecialty(event.target.value)
              }
            >
              <option value="Tất cả">
                Tất cả chuyên khoa
              </option>

              {specialties.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <div className="bv199-catalog-tools">
              <span>
                {filtered.length} / {DISEASES.length} mục
              </span>

              <div>
                <button
                  type="button"
                  className="bv199-link-button"
                  onClick={() =>
                    setOpenedGroups(
                      groups.map((group) => group.specialty)
                    )
                  }
                >
                  Mở tất cả
                </button>

                {" · "}

                <button
                  type="button"
                  className="bv199-link-button"
                  onClick={() => setOpenedGroups([])}
                >
                  Thu gọn
                </button>
              </div>
            </div>

            <div className={mobileListMode === "disease" ? "bv199-group-list bv199-mobile-hide-groups" : "bv199-group-list"}>
              {groups.map((group) => {
                const expanded =
                  query.trim().length > 0 ||
                  openedGroups.includes(group.specialty);

                return (
                  <div
                    className="bv199-group"
                    key={group.specialty}
                  >
                    <button
                      type="button"
                      className="bv199-group-header"
                      aria-expanded={expanded}
                      onClick={() =>
                        toggleGroup(group.specialty)
                      }
                    >
                      <span>
                        {expanded ? "▾" : "▸"}{" "}
                        {group.specialty}
                      </span>

                      <span className="bv199-count">
                        {group.diseases.length}
                      </span>
                    </button>

                    {expanded && (
                      <div className="bv199-disease-list">
                        {group.diseases.map((disease) => (
                          <button
                            type="button"
                            key={disease.id}
                            className={
                              selected.id === disease.id
                                ? "bv199-disease selected"
                                : "bv199-disease"
                            }
                            onClick={() =>
                              chooseDisease(disease)
                            }
                          >
                            {disease.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {groups.length === 0 && (
                <div className="bv199-muted">
                  Không tìm thấy mặt bệnh phù hợp.
                </div>
              )}
            </div>
            {mobileListMode === "disease" && <div className="bv199-mobile-flat-diseases">
              {filtered.map((disease) => <button type="button" key={disease.id} className={selected.id === disease.id ? "active" : ""} onClick={() => chooseDisease(disease)}>
                <strong>{disease.title}</strong><span>{disease.specialty}</span>
              </button>)}
            </div>}
          </aside>
        )}

        <section className="bv199-treatment">
          <div className="bv199-panel bv199-disease-heading">
            <div className="bv199-label">
              MẶT BỆNH ĐANG CHỌN
            </div>

            <h2>{selected.title}</h2>

            <div className="bv199-muted">
              Chuyên khoa: {selected.specialty}
            </div>

            <div style={{ marginTop: 8 }}>
              <StatusBadge status={statusEntry.status} />
            </div>
          </div>

          {/* PHAC DO THEO VAN BAN BO Y TE */}
          <BytRegimenView key={selected.id} diseaseId={selected.id} />

          {/* VIEM XOANG CAP - UPTODATE 2026 */}
          {isAbrs ? (
            <>
              <section className="bv199-panel">
                <div className="bv199-label">
                  PHÂN LOẠI NƠI ĐIỀU TRỊ
                </div>

                <div className="bv199-setting">
                  <button
                    type="button"
                    className={
                      abrsSetting === "outpatient"
                        ? "bv199-setting-button active"
                        : "bv199-setting-button"
                    }
                    aria-pressed={
                      abrsSetting === "outpatient"
                    }
                    onClick={() =>
                      setAbrsSetting("outpatient")
                    }
                  >
                    Ngoại trú – Không biến chứng
                  </button>

                  <button
                    type="button"
                    className={
                      abrsSetting === "inpatient"
                        ? "bv199-setting-button active"
                        : "bv199-setting-button"
                    }
                    aria-pressed={
                      abrsSetting === "inpatient"
                    }
                    onClick={() =>
                      setAbrsSetting("inpatient")
                    }
                  >
                    Nội trú – Nặng hoặc biến chứng
                  </button>
                </div>
              </section>

              {abrsSetting === "outpatient" ? (
                <AbrsUpToDate2026
                  key={`${selected.id}-outpatient`}
                />
              ) : (
                <section className="bv199-panel">
                  <div className="bv199-label">
                    NỘI TRÚ – CẦN HƯỚNG DẪN RIÊNG
                  </div>

                  <h3 style={{ margin: "10px 0" }}>
                    Viêm xoang cấp nặng hoặc có biến chứng
                  </h3>

                  <div className="bv199-warning">
                    PDF UpToDate Graphic 106156,
                    Version 16.0 mà bạn cung cấp
                    chỉ áp dụng cho ABRS ngoại trú,
                    không biến chứng, người lớn
                    có miễn dịch bình thường.

                    <p>
                      Tài liệu này không cung cấp
                      phác đồ kháng sinh IV hoàn chỉnh
                      cho bệnh nội trú hoặc biến chứng.
                    </p>

                    <p style={{ marginBottom: 0 }}>
                      Vì vậy phần mềm không tự gán
                      thuốc hoặc liều điều trị nội trú
                      từ hướng dẫn ngoại trú.
                    </p>
                  </div>

                  <h4>
                    Đánh giá trước khi lựa chọn phác đồ
                  </h4>

                  <ul style={{
                    fontSize: 13,
                    lineHeight: 1.85,
                  }}>
                    <li>
                      Đánh giá nhiễm độc toàn thân,
                      sốc nhiễm khuẩn và dấu hiệu nặng.
                    </li>

                    <li>
                      Kiểm tra biến chứng hốc mắt:
                      phù nề, đau mắt, hạn chế vận nhãn,
                      nhìn đôi hoặc giảm thị lực.
                    </li>

                    <li>
                      Kiểm tra dấu hiệu nội sọ:
                      đau đầu dữ dội, thay đổi tri giác,
                      dấu thần kinh khu trú hoặc co giật.
                    </li>

                    <li>
                      Đánh giá chẩn đoán hình ảnh
                      và lấy bệnh phẩm vi sinh
                      khi có chỉ định.
                    </li>

                    <li>
                      Hội chẩn Tai Mũi Họng,
                      Mắt, Hồi sức hoặc Ngoại thần kinh
                      tùy biến chứng.
                    </li>

                    <li>
                      Xem xét kiểm soát ổ nhiễm
                      và dẫn lưu khi có chỉ định.
                    </li>
                  </ul>

                  <div className="bv199-warning">
                    <strong>
                      Trạng thái dữ liệu:
                    </strong>{" "}
                    Chưa tích hợp phác đồ nội trú
                    đã được kiểm chứng và thẩm định.
                    Cần bổ sung nguồn riêng trước khi
                    đưa vào hỗ trợ kê đơn.
                  </div>
                </section>
              )}
            </>
          ) : moduleKey ? (
            <>
              <EmpiricSelector
                key={selected.id}
                moduleKey={moduleKey}
                diseaseTitle={selected.title}
                onApply={setPickedScenario}
              />

              {moduleKey === "ent" ? (
                <EntEmpiricGuidelines
                  key={`${selected.id}-${pickedScenario ?? "none"}`}
                  diseaseName={selected.title}
                  initialScenarioId={pickedScenario ?? undefined}
                />
              ) : moduleKey === "cap" ? (
                <CapByt2026
                  key={`${selected.id}-${pickedScenario ?? "none"}`}
                  initialScenarioId={pickedScenario ?? undefined}
                />
              ) : (
                <HapVap2023
                  key={`${selected.id}-${pickedScenario ?? "none"}`}
                  kind={moduleKey}
                  initialScenarioId={pickedScenario ?? undefined}
                />
              )}
            </>
          ) : (
            <DiseaseProfile
              key={selected.id}
              disease={selected}
              stream={stream}
              population={getPopulationHint(selected)}
              status={statusEntry.status}
              sourceLabel={statusEntry.sourceLabel}
              statusNote={statusEntry.note}
              groups={linkedGroups}
              hasModule={false}
              onSelectDisease={selectById}
              titleOf={titleOf}
            />
          )}

          {/* NGUON QUOC TE KHAC */}
          {!isAbrs && !isEnt && (
            <section className="bv199-panel">
              <div className="bv199-label">
                GUIDELINE QUỐC TẾ
              </div>

              {isAdultCAP(selected) ? (
                <>
                  <p className="bv199-muted">
                    Viêm phổi cộng đồng ở người lớn:
                    NICE NG250, 2025.
                  </p>

                  <a
                    href="https://www.nice.org.uk/guidance/ng250/chapter/recommendations"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem hướng dẫn NICE
                  </a>
                </>
              ) : isHAP(selected) || isVAP(selected) ? (
                <>
                  <p className="bv199-muted">
                    Viêm phổi bệnh viện / liên quan
                    thở máy: đối chiếu hướng dẫn
                    ATS/IDSA và khuyến cáo điều trị
                    vi khuẩn đa kháng hiện hành.
                  </p>

                  <a
                    href="https://www.idsociety.org/practice-guideline/hap_vap/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem hướng dẫn ATS/IDSA
                  </a>
                </>
              ) : (
                <div className="bv199-warning">
                  Chưa có phác đồ quốc tế
                  đã được xác minh cho mặt bệnh
                  này trong cơ sở dữ liệu.
                </div>
              )}
            </section>
          )}

          {/* KIEM TRA AN TOAN */}
          <section className="bv199-panel">
            <details>
              <summary>
                Kiểm tra danh mục thuốc và dữ liệu BV199
              </summary>

              <div className="bv199-muted">
                <p>
                  Đối chiếu thuốc sẵn có,
                  antibiogram BV199,
                  vi sinh – AST/MIC, chức năng thận,
                  PK/PD, TDM, ADR và tương tác thuốc.
                </p>

                <p>
                  {hasModule
                    ? "Mặt bệnh đã có nội dung tra cứu. Các phác đồ chưa mặc định được BV199 phê duyệt."
                    : "Mặt bệnh chưa được nhập đủ dữ liệu điều trị đã xác minh."}
                </p>

                <p>
                  Phần mềm là công cụ hỗ trợ quyết định,
                  không thay thế đánh giá của
                  bác sĩ và dược sĩ lâm sàng.
                </p>
              </div>
            </details>
          </section>
        </section>
      </div>
    </main>
  );
}
