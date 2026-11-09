
"use client";

import { icdOf } from "@/data/antibiotics/empiric/icd10";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AbxLinkProvider } from "../../../../components/antibiotics/links/AbxLinkContext";
import {
  DISEASE_ORGANISM,
  antibiogramHref,
  empiricHref,
  organismHref,
} from "../../../../lib/antibiotics/drug-links";

import CapByt2026 from "../../../../components/antibiotics/CapByt2026";
import CopdByt2026 from "../../../../components/antibiotics/CopdByt2026";
import HapVap2023 from "../../../../components/antibiotics/HapVap2023";
import EntEmpiricGuidelines, {
  isEntDisease,
} from "../../../../components/antibiotics/EntEmpiricGuidelines";
import SettingTabs from "@/components/antibiotics/treatment/SettingTabs";
import AbrsUpToDate2026 from "../../../../components/antibiotics/AbrsUpToDate2026";

import BytRegimenView from "../../../../components/antibiotics/empiric/BytRegimenView";
import { DiseaseMonitoring, DiseaseOverviewSummary } from "../../../../components/antibiotics/empiric/DiseaseOverview";
import EmpiricSelector from "../../../../components/antibiotics/empiric/EmpiricSelector";
import { evidenceFor } from "../../../../lib/antibiotics/evidence-status";
import DtrPseudomonasIdsa2026 from "../../../../components/antibiotics/empiric/DtrPseudomonasIdsa2026";
import type { ModuleKey } from "../../../../lib/antibiotics/select-regimens";
import {
  DISEASES,
  normalize,
} from "../../../../data/antibiotics/empiric/catalog";
import {
  getConcreteRegimensForDisease,
} from "../../../../data/antibiotics/empiric/regimens";
import {
  ClinicalFilterPanel,
  ClinicalFilterProvider,
} from "../../../../components/antibiotics/empiric/ClinicalFilters";
import {
  CompareTab,
  IntlTab,
  TAB_LABELS,
  type TabKey,
} from "../../../../components/antibiotics/empiric/GuidelineTabs";
import {
  DEFAULT_FILTERS,
  type ClinicalFilterState,
} from "../../../../lib/antibiotics/clinical-filters";
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

/* Nhan ngan muc do bang chung (chi tiet: muc Nguon / trang Bang chung). */

/* useSearchParams can Suspense khi build tinh (Next 16). */
export default function GuidelinePage() {
  return (
    <Suspense fallback={<main className="bv199-empiric" />}>
      <GuidelineContent />
    </Suspense>
  );
}

function GuidelineContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  /* ?disease=v8-N: mo dung mat benh khi quay lai tu module khac. */
  const [selectedId, setSelectedId] = useState(() => {
    const fromUrl = searchParams.get("disease");
    return fromUrl && DISEASES.some((disease) => disease.id === fromUrl)
      ? fromUrl
      : "v8-1";
  });
  const [pickedScenario, setPickedScenario] = useState<string | null>(null);
  /* Danh muc khong loc theo chuyen khoa nua (toi gian) – giu bien de logic loc giu nguyen. */
  const specialtyFilter = "Tất cả";

  const [showCatalog, setShowCatalog] = useState(true);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  /* Man hinh hep + da chon benh qua URL: CSS dua phac do len truoc danh muc (xem .bv199-url-selected). */
  const [urlSelected] = useState(() => !!searchParams.get("disease"));

  /* Buoc 4A: tab nguon va bo loc lam sang. */
  const [tab, setTab] = useState<TabKey>(() => {
    /* ?tab=intl|compare|sources: mo dung tab (vd. tu trang Chon khang sinh). */
    const fromUrl = searchParams.get("tab");
    return fromUrl && fromUrl in TAB_LABELS ? (fromUrl as TabKey) : "vn";
  });
  /* ?tab=sources (lien ket cu) -> mo accordion Nguon. */
  const [filters, setFilters] = useState<ClinicalFilterState>(DEFAULT_FILTERS);

  const [openedGroups, setOpenedGroups] = useState<string[]>(()=>[...new Set(["Hô hấp",DISEASES.find(d=>d.id===searchParams.get('disease'))?.specialty??DISEASES[0].specialty])]);

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
    setMobileCatalogOpen(false);
    setPickedScenario(null);
    setSelectedId(disease.id);
    setAbrsSetting("outpatient");
    setTab("vn");

    /* Ghi mat benh vao URL (khong tai lai trang) de nut "Quay lai" o module khac
       va nut Back cua trinh duyet tro ve dung mat benh. */
    window.history.replaceState(null, "", empiricHref(disease.id));

    /* Man hinh hep: cuon ve dau phan chi tiet de thay ngay mat benh moi. */
    if (typeof window !== "undefined" && window.innerWidth < 900) {
      window.setTimeout(() => {
        document
          .querySelector(".bv199-disease-heading")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  }



  function changeSource(next:TabKey) {
    if(next===tab)return;
    setTab(next);setPickedScenario(null);setAbrsSetting('outpatient');
  }

  function toggleGroup(name: string) {
    setOpenedGroups((current) =>
      current.includes(name)
        ? current.filter((value) => value !== name)
        : [...current, name]
    );
  }


  /* Noi dung module ABRS (UpToDate) – hien o Tab Quoc te. */
  const abrsContent = (<SettingTabs items={[{value:"outpatient",label:"Ngoại trú"},{value:"inpatient",label:"Nội trú"}]} value={abrsSetting} onChange={next=>setAbrsSetting(next as "outpatient"|"inpatient")} >{abrsSetting === "outpatient" ? <>
<AbrsUpToDate2026
                  key={`${selected.id}-outpatient`}
                />
</> : <>
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
</>}</SettingTabs>);

  /* Benh khong co phuong an BYT co lieu (vd. QĐ 1530) -> hien du phuong an, kem co "khong neu lieu". */
  const vnShowAll = !isAdultCAP(selected) && getConcreteRegimensForDisease(selected.id).length === 0;

  const evidence = evidenceFor(selected.id);
  const backPath = empiricHref(selected.id);
  const organismLink = DISEASE_ORGANISM[selected.id];

  return (
    <AbxLinkProvider
      value={{
        from: backPath,
        fromLabel: selected.title,
        diseaseId: selected.id,
        context: selected.title,
        hideDrugNavigation: true,
      }}
    >
    <ClinicalFilterProvider value={filters}>
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

        .bv199-module-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .bv199-module-links a {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 8px 12px;
          border: 1px solid #b9dfe0;
          border-radius: 9px;
          background: #eef8f8;
          color: #076c75;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }

        .bv199-module-links a:hover {
          background: #dff2f1;
        }

        .bv199-crumb { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin: 0 0 10px; }
        .bv199-crumb h1 { margin: 0; font-size: 12px; font-weight: 600; color: #5b7384; letter-spacing: .01em; }
        .bv199-crumb .bv199-toggle { font-size: 12px; padding: 4px 10px; }
        .bv199-dh-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; }
        .bv199-disease-heading h2 { margin: 0 0 2px; font-size: 22px; font-weight: 800; color: #12324a; }
        .bv199-tools { margin-top: 8px; font-size: 12.5px; }
        .bv199-tools > summary { cursor: pointer; color: #087f89; font-weight: 700; }
        .bv199-tools .cf199 { margin-top: 6px; }
        .bv199-statusline { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 8px; font-size: 12px; }
        .bv199-notapproved { font-weight: 800; color: #9a3412; background: #fff7ed; border: 1px solid #fdba74; border-radius: 999px; padding: 2px 9px; }
        .bv199-approved { font-weight: 800; color: #166534; background: #f0fdf4; border: 1px solid #86efac; border-radius: 999px; padding: 2px 9px; }
        .bv199-ev { color: #4b6576; }
        .bv199-ev-NEEDS_REVIEW, .bv199-ev-MISSING_EVIDENCE { color: #92400e; font-weight: 700; }
        .bv199-quicklinks { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 8px; font-size: 12.5px; }
        .bv199-quicklinks a { color: #076c75; font-weight: 700; text-decoration: none; }
        .bv199-quicklinks a:hover { text-decoration: underline; }

        .bv199-tabs {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 4px;
          padding: 4px;
          border-radius: 12px;
          background: #e8f0f4;
          position: sticky;
          top: 6px;
          z-index: 5;
        }

        .bv199-tabs button {
          min-height: 42px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #33505f;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          padding: 6px 8px;
        }

        .bv199-tabs button.active {
          background: #fff;
          color: #076c75;
          box-shadow: 0 1px 3px rgba(15, 50, 70, .15);
        }

        .bv199-tab-short { display: none; }

        .bv199-subhead {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #f1dfc0;
          background: #fff7e9;
          font-size: 12px;
          line-height: 1.6;
          color: #5c4310;
        }

        @media (max-width: 760px) {
          .bv199-tab-long { display: none; }
          .bv199-tab-short { display: inline; }
          .bv199-tabs button { font-size: 12px; padding: 6px 4px; }
        }

        .bv199-module-hint {
          margin: 8px 0 0;
          color: #647b8c;
          font-size: 11px;
          line-height: 1.6;
        }

        @media (max-width: 520px) {
          .bv199-module-links {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .bv199-module-links a {
            justify-content: center;
            text-align: center;
          }

          .bv199-module-links a:first-child,
          .bv199-module-links a:last-child {
            grid-column: 1 / -1;
          }
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

          /* Da mo dung mat benh qua URL: hien phac do truoc, danh muc xuong cuoi */
          .bv199-url-selected .bv199-catalog {
            order: 2;
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

        /* ===== CDSS dot 2: toi gian – it khung, it vien; desktop dung toan chieu rong ===== */
        .bv199-empiric { max-width: 1680px; }
        .bv199-layout { grid-template-columns: 250px minmax(0, 1fr); gap: 22px; }
        .bv199-layout.collapsed { grid-template-columns: minmax(0, 1fr); }
        .bv199-catalog { padding: 0 14px 0 0; background: transparent; border: 0; border-right: 1px solid #e3ebf1; border-radius: 0; }
        .bv199-catalog h2 { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: #4b6576; margin: 0 0 8px; }
        .bv199-search { padding: 7px 10px; font-size: 13px; }
        .bv199-group-list { gap: 0; margin-top: 8px; max-height: calc(100vh - 170px); padding-right: 0; }
        .bv199-group { border: 0; border-radius: 0; overflow: visible; }
        .bv199-group-header { background: transparent; padding: 9px 2px 5px; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #4b6576; }
        .bv199-disease-list { padding: 0 0 4px; gap: 0; }
        .bv199-disease { padding: 6px 10px; border: 0; border-left: 3px solid transparent; border-radius: 0; font-size: 13px; line-height: 1.4; }
        .bv199-disease.selected { border-left-color: #0b6b8a; background: #eaf5f8; color: #0b4f66; }
        .bv199-treatment { gap: 12px; }
        .bv199-disease-heading { background: transparent; border: 0; padding: 0; }
        .bv199-disease-heading h2 { font-size: 24px; }
        .bv199-tabs { display: flex; gap: 22px; padding: 0; background: transparent; border-radius: 0; border-bottom: 1px solid #dce6ed; position: static; }
        .bv199-tabs button { min-height: 36px; border-radius: 0; padding: 6px 2px; border-bottom: 2px solid transparent; margin-bottom: -1px; }
        .bv199-tabs button.active { background: transparent; box-shadow: none; color: #0b6b8a; border-bottom-color: #0b6b8a; }
        .bv199-sources-acc { background: transparent; border: 0; padding: 0; font-size: 12.5px; }
        .bv199-sources-acc > summary { color: #4b6576; font-weight: 700; }
        @media (max-width: 1100px) {
          .bv199-layout { grid-template-columns: 220px minmax(0, 1fr); }
        }

        /* ===== CDSS dot 3: bam theo mau – nen xam nhat, khung trang rieng, bo chuyen nguon nho ===== */
        .bv199-empiric { background: #f4f7f9; border-radius: 0; }
        .bv199-catalog { background: #fff; border: 1px solid #dfe8ee; border-radius: 10px; padding: 12px; }
        .bv199-catalog h2 { text-transform: none; letter-spacing: 0; font-size: 14px; color: #12324a; }
        .bv199-group-header { text-transform: none; letter-spacing: 0; font-size: 12.5px; font-weight: 700; color: #12324a; padding: 10px 2px 4px; }
        .bv199-count { font-size: 11px; color: #6b8293; }
        .bv199-crumb-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .bv199-crumb-actions .bv199-toggle, .bv199-tools > summary { white-space: nowrap; }
        .bv199-crumb h1 { min-width: 0; }
        .bv199-tools { position: relative; margin: 0; }
        .bv199-tools > summary { list-style: none; font-size: 12px; padding: 4px 10px; border: 1px solid #cedde5; border-radius: 8px; background: #fff; }
        .bv199-tools > summary::-webkit-details-marker { display: none; }
        .bv199-tools-pop { position: absolute; right: 0; top: calc(100% + 6px); z-index: 20; width: min(420px, 90vw); background: #fff; border: 1px solid #dfe8ee; border-radius: 10px; padding: 12px; box-shadow: 0 8px 24px rgba(15, 50, 70, .14); }
        .bv199-tools-pop .bv199-quicklinks { margin: 0 0 8px; }
        .bv199-disease-heading { padding: 2px 0 0; }
        .bv199-tabs { display: inline-flex; gap: 0; margin-top: 10px; border: 1px solid #cedde5; border-radius: 8px; overflow: hidden; background: #fff; border-bottom: 1px solid #cedde5; }
        .bv199-tabs button { min-height: 30px; padding: 4px 14px; border: 0; border-right: 1px solid #e3ebf1; margin: 0; font-size: 12.5px; color: #33505f; }
        .bv199-tabs button:last-child { border-right: 0; }
        .bv199-tabs button.active { background: #0b6b8a; color: #fff; border-bottom: 0; }
        .bv199-sources-acc { padding: 0 2px; }
        @media (max-width: 760px) {
          .bv199-layout, .bv199-layout.collapsed { grid-template-columns: minmax(0, 1fr); }
          .bv199-catalog { border-right: 0; border-top: 1px solid #e3ebf1; padding: 12px 0 0; }
          .bv199-group-list { max-height: none; }
          .bv199-disease-heading h2 { font-size: 20px; }
          .bv199-tabs { gap: 16px; }
        }
        /* UI9: preserve BV199 navigation, one white clinical content column. */
        .bv199-empiric { background:#fff; font-family:"Segoe UI",Arial,sans-serif; }.bv199-treatment { display:block; min-width:0; }.bv199-disease-heading h2 { color:#10243e; font-size:26px; }
        .bv199-catalog { border-radius:6px; border-color:#e0e8ed; }.bv199-disease.selected { background:#ddf3ef; border-left-color:#009b91; }
        .bv199-tab-short { display:none; }.bv199-tab-long { display:inline; }.bv199-tabs { gap:0; }
        .bv199-catalog-mobile { display:none; }
        #bv199-tabpanel > .bv199-panel { border:0; border-radius:0; background:white; padding:0; }
        #bv199-tabpanel .gt199,#bv199-tabpanel .la-intl { border:0; border-radius:0; box-shadow:none; }
        #bv199-tabpanel .gt199-guide,#bv199-tabpanel .gt199-reg,#bv199-tabpanel .abrs-card { border:0; border-bottom:1px solid #dfe8ee; border-radius:0; padding:14px 0; background:white; }
        #bv199-tabpanel .gt199-cmp-grid { grid-template-columns:minmax(0,1fr); }
        #bv199-tabpanel .gt199-cmp { border-radius:0; border:0; border-bottom:1px solid #dfe8ee; padding:12px 0; }
        #bv199-tabpanel .dtr-guidance>div:not(.bv199-warning) { border:0!important; border-bottom:1px solid #dfe8ee!important; border-radius:0!important; padding:12px 0!important; }
        @media(max-width:760px) {
          .bv199-catalog-desktop { display:none; }.bv199-catalog-mobile { display:inline-block; }
          .bv199-layout .bv199-catalog { display:none; }.bv199-layout.bv199-mobile-catalog-open .bv199-catalog { display:block; order:-1; }
          .bv199-disease-heading h2 { font-size:22px; }.bv199-tabs { width:100%; gap:0; }.bv199-tabs button { flex:1; padding:7px 5px; font-size:11.5px; }
          .bv199-tab-short { display:none; }.bv199-tab-long { display:inline; }
        }
      `}</style>

      <div className="bv199-crumb">
        <h1>Kháng sinh &amp; AMS / Điều trị kinh nghiệm</h1>
        <div className="bv199-crumb-actions">
        {/* Chuc nang phu: menu thu gon tren dong duong dan */}
        <details className="bv199-tools">
          <summary>Công cụ</summary>
          <div className="bv199-tools-pop">
            <nav className="bv199-quicklinks" aria-label="Module liên quan">
              <Link href={`/antibiotics/empiric/select?disease=${encodeURIComponent(selected.id)}`}>Chọn theo người bệnh</Link>
              <Link href={organismHref(organismLink?.organismQuery, { from: backPath, fromLabel: selected.title })}>Theo tác nhân</Link>
              <Link href={antibiogramHref({ organismId: organismLink?.antibiogramId }, { from: backPath, fromLabel: selected.title })}>Kháng sinh đồ BV199</Link>
              <Link href={`/antibiotics/dosing?from=${encodeURIComponent(backPath)}&fromLabel=${encodeURIComponent(selected.title)}`}>Điều chỉnh liều theo chức năng thận</Link>
            </nav>
            <ClinicalFilterPanel value={filters} onChange={setFilters} />
          </div>
        </details>
        <button type="button" className="bv199-toggle bv199-catalog-desktop" aria-expanded={showCatalog} aria-controls="bv199-catalog" onClick={() => setShowCatalog((current) => !current)}>
          {showCatalog ? "Ẩn danh mục" : "Hiện danh mục"}
        </button>
        <button type="button" className="bv199-toggle bv199-catalog-mobile" aria-expanded={mobileCatalogOpen} aria-controls="bv199-catalog" onClick={()=>{setShowCatalog(true);setMobileCatalogOpen(open=>!open);}}>Danh mục bệnh</button>
        </div>
      </div>

      <div
        className={
          (showCatalog ? "bv199-layout" : "bv199-layout collapsed") +
          (urlSelected ? " bv199-url-selected" : "") + (mobileCatalogOpen ? " bv199-mobile-catalog-open" : "")
        }
      >
        {showCatalog && (
          <aside id="bv199-catalog" className="bv199-panel bv199-catalog">
            <h2>Danh mục bệnh lý</h2>

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

            <div className="bv199-group-list">
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
                        {String(group.diseases.length).padStart(2, "0")}
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
          </aside>
        )}

        <section className="bv199-treatment">
          <div className="bv199-panel bv199-disease-heading">
            <div className="bv199-dh-row">
              <div>
                <h2>{selected.id === "v8-6" ? "Kháng sinh điều trị đợt cấp COPD" : selected.title}</h2>
                <div className="bv199-muted">
                  {selected.specialty}
                  {icdOf(selected.id).length ? " · ICD-10: " + icdOf(selected.id).join(", ") : ""}
                </div>
              </div>
              {/* Trang thai phe duyet: MOT vi tri duy nhat cho ca trang */}
              {evidence?.approval.status === "APPROVED_FOR_CLINICAL_USE" && (
                  <span className="bv199-approved">Đã phê duyệt HĐT&amp;ĐT</span>
                )}
            </div>
            {/* Nguon hien thi: Bo Y te | Quoc te | Doi chieu (bo chuyen nho, khong chiem mot hang rieng) */}
            <div className="bv199-tabs" role="tablist" aria-label="Nguồn hướng dẫn">
              {(Object.keys(TAB_LABELS) as (keyof typeof TAB_LABELS)[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`bv199-tab-${key}`}
                  aria-selected={tab === key}
                  aria-controls="bv199-tabpanel"
                  className={tab === key ? "active" : ""}
                  tabIndex={tab === key ? 0 : -1}
                  onClick={() => changeSource(key)}
                  onKeyDown={event=>{const keys:TabKey[]=['vn','intl','compare'];const index=keys.indexOf(key);const next=event.key==='ArrowRight'?(index+1)%keys.length:event.key==='ArrowLeft'?(index-1+keys.length)%keys.length:event.key==='Home'?0:event.key==='End'?keys.length-1:undefined;if(next!==undefined){event.preventDefault();changeSource(keys[next]);document.getElementById(`bv199-tab-${keys[next]}`)?.focus();}}}
                  title={TAB_LABELS[key].long}
                >
                  <span className="bv199-tab-short">{TAB_LABELS[key].short}</span>
                  <span className="bv199-tab-long">{TAB_LABELS[key].long}</span>
                </button>
              ))}
            </div>


          </div>


          <div key={`${selected.id}-${tab}`} id="bv199-tabpanel" role="tabpanel" aria-labelledby={`bv199-tab-${tab}`} className="bv199-treatment">
          {tab === "vn" && (
            <>
              {/* PHAC DO THEO VAN BAN BO Y TE.
                  CAP: QĐ 2147/2026 (module) la van ban BYT hien hanh -> chi hien module, khong hien khung BYT cu. */}
              {/* Module rieng (COPD, CAP, HAP, VAP): cung bo cuc 5 tang – tong quan, phac do, theo doi. */}
              {selected.id === "v8-6" && <><DiseaseOverviewSummary diseaseId="v8-6" /><CopdByt2026 /><DiseaseMonitoring diseaseId="v8-6" /></>}
              {selected.id !== "v8-6" && moduleKey !== "cap" && moduleKey !== "hap" && moduleKey !== "vap" && (
                <BytRegimenView
                  key={selected.id}
                  diseaseId={selected.id}
                  diseaseTitle={selected.title}
                  showAllByDefault={vnShowAll}
                />
              )}

              {(moduleKey === "cap" || moduleKey === "hap" || moduleKey === "vap") && (
                <>
                  <DiseaseOverviewSummary diseaseId={selected.id} />
                  {moduleKey === "cap" ? (
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
                  <DiseaseMonitoring diseaseId={selected.id} />
                </>
              )}
            </>
          )}

          {tab === "intl" && (
            <IntlTab
              diseaseId={selected.id}
              moduleContent={
                isAbrs ? (
                  abrsContent
                ) : moduleKey === "ent" ? (
                  <>
                    <EmpiricSelector
                      key={selected.id}
                      moduleKey="ent"
                      diseaseTitle={selected.title}
                      onApply={setPickedScenario}
                    />
                    <EntEmpiricGuidelines
                      key={`${selected.id}-${pickedScenario ?? "none"}`}
                      diseaseName={selected.title}
                      initialScenarioId={pickedScenario ?? undefined}
                    />
                  </>
                ) : selected.id === "v8-46" ? (
                  <DtrPseudomonasIdsa2026 />
                ) : undefined
              }
            />
          )}

          {tab === "compare" && <CompareTab diseaseId={selected.id} />}

          </div>


        </section>
      </div>
    </main>
    </ClinicalFilterProvider>
    </AbxLinkProvider>
  );
}
