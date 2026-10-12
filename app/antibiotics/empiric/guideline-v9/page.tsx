
"use client";

import { useMemo, useState } from "react";

import CapByt2026 from "../../../../components/antibiotics/CapByt2026";
import HapVap2023 from "../../../../components/antibiotics/HapVap2023";
import EntEmpiricGuidelines, {
  isEntDisease,
} from "../../../../components/antibiotics/EntEmpiricGuidelines";
import AbrsUpToDate2026 from "../../../../components/antibiotics/AbrsUpToDate2026";

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
  5. Tai Mui Hong - 16 ten mat benh
  6. Viem xoang cap ngoai tru - UpToDate 2026
  7. Phan biet ngoai tru va noi tru
  8. Giu nguyen cac module khac

  Chu y:
  Khong mac dinh phac do trong app da duoc
  Hoi dong chuyen mon BV199 phe duyet.
*/

type Disease = {
  id: string;
  title: string;
  specialty: string;
};

const RAW_DISEASES = `
Viêm phổi cộng đồng|Hô hấp
Nhiễm khuẩn tiết niệu phức tạp / ESBL|Tiết niệu
Nhiễm Candida huyết (candidemia)|Nhiễm nấm
Viêm phổi bệnh viện|Hô hấp
Viêm phổi liên quan thở máy|Hô hấp
Đợt cấp COPD do vi khuẩn|Hô hấp
Viêm xoang cấp do vi khuẩn|Tai Mũi Họng
Viêm họng liên cầu|Tai Mũi Họng
Áp xe phổi|Hô hấp
Giãn phế quản bội nhiễm|Hô hấp
Sepsis chưa rõ nguồn|Hồi sức tích cực
Sốc nhiễm khuẩn|Hồi sức tích cực
Nhiễm khuẩn huyết do S. aureus|Hồi sức tích cực
Nhiễm khuẩn huyết do Gram âm|Hồi sức tích cực
Nhiễm khuẩn liên quan catheter|Hồi sức tích cực
Viêm bàng quang không biến chứng|Tiết niệu
Viêm thận bể thận|Tiết niệu
Viêm tuyến tiền liệt cấp|Tiết niệu
Nhiễm khuẩn tiết niệu liên quan sonde|Tiết niệu
Viêm ruột thừa phức tạp|Ngoại tổng hợp – Tiêu hóa
Viêm phúc mạc thứ phát|Ngoại tổng hợp – Tiêu hóa
Áp xe ổ bụng|Ngoại tổng hợp – Tiêu hóa
Viêm túi mật cấp|Ngoại tổng hợp – Tiêu hóa
Viêm đường mật cấp|Ngoại tổng hợp – Tiêu hóa
Nhiễm C. difficile|Tiêu hóa
Nhiễm khuẩn đường ruột xâm lấn|Tiêu hóa
Viêm mô tế bào không mủ|Da – mô mềm
Viêm mô tế bào có mủ / áp xe|Da – mô mềm
Nhiễm khuẩn da mô mềm hoại tử|Ngoại chấn thương
Nhiễm khuẩn bàn chân đái tháo đường|Nội tiết – Ngoại chấn thương
Nhiễm khuẩn vết mổ|Ngoại tổng hợp
Viêm xương tủy|Cơ xương khớp
Viêm khớp nhiễm khuẩn|Cơ xương khớp
Nhiễm khuẩn khớp nhân tạo|Ngoại chấn thương
Nhiễm khuẩn cột sống|Cơ xương khớp
Viêm màng não vi khuẩn|Thần kinh
Áp xe não|Thần kinh
Nhiễm khuẩn dẫn lưu não thất|Thần kinh
Viêm nội tâm mạc nhiễm khuẩn|Tim mạch
Nhiễm khuẩn thiết bị tim mạch|Tim mạch
MRSA|Điều trị theo tác nhân
VRE|Điều trị theo tác nhân
Enterobacterales sinh ESBL|Điều trị theo tác nhân
Enterobacterales kháng carbapenem CRE|Điều trị theo tác nhân
Acinetobacter baumannii kháng carbapenem|Điều trị theo tác nhân
Pseudomonas aeruginosa DTR|Điều trị theo tác nhân
Stenotrophomonas maltophilia|Điều trị theo tác nhân
Candida ổ bụng|Nhiễm nấm
Candida tiết niệu|Nhiễm nấm
Aspergillus phổi xâm lấn|Nhiễm nấm
Cryptococcus viêm màng não|Nhiễm nấm
Mucormycosis|Nhiễm nấm
Pneumocystis jirovecii pneumonia|Nhiễm nấm
Viêm họng do liên cầu nhóm A|Tai Mũi Họng
Viêm amidan cấp do vi khuẩn|Tai Mũi Họng
Áp xe quanh amidan|Tai Mũi Họng
Áp xe sau họng|Tai Mũi Họng
Viêm xoang cấp do vi khuẩn ở người lớn|Tai Mũi Họng
Viêm xoang mạn đợt cấp nghi nhiễm khuẩn|Tai Mũi Họng
Viêm tai giữa cấp|Tai Mũi Họng
Viêm tai ngoài cấp|Tai Mũi Họng
Viêm tai ngoài ác tính|Tai Mũi Họng
Viêm xương chũm|Tai Mũi Họng
Viêm thanh thiệt cấp|Tai Mũi Họng
Viêm tuyến nước bọt cấp sinh mủ|Tai Mũi Họng
Nhiễm khuẩn khoang cổ sâu|Tai Mũi Họng
Viêm tai giữa mạn chảy mủ|Tai Mũi Họng
Nhiễm khuẩn bàn chân đái tháo đường không biến chứng|Nội tiết
Nhiễm khuẩn bàn chân đái tháo đường mức độ trung bình/nặng|Nội tiết
Viêm xương tủy liên quan bàn chân đái tháo đường|Nội tiết
Nhiễm khuẩn ở người bệnh đái tháo đường có DKA/HHS|Nội tiết
Nhiễm Candida âm hộ–âm đạo ở người bệnh đái tháo đường|Nhiễm nấm
Nhiễm khuẩn tiết niệu ở người bệnh đái tháo đường|Nội tiết
Viêm tuyến giáp cấp sinh mủ|Nội tiết
Nhiễm nấm xâm lấn ở người bệnh suy giảm miễn dịch do bệnh nội tiết|Nhiễm nấm
Áp xe quanh chóp răng|Răng Hàm Mặt
Nhiễm khuẩn răng lan tỏa|Răng Hàm Mặt
Viêm mô tế bào vùng hàm mặt|Răng Hàm Mặt
Viêm quanh thân răng|Răng Hàm Mặt
Viêm xương hàm|Răng Hàm Mặt
Nhiễm khuẩn vùng sàn miệng (Ludwig)|Răng Hàm Mặt
Viêm xoang do răng|Răng Hàm Mặt
Viêm kết mạc do vi khuẩn|Mắt
Viêm giác mạc do vi khuẩn|Mắt
Viêm nội nhãn sau phẫu thuật|Mắt
Viêm mô tế bào trước vách hốc mắt|Mắt
Viêm mô tế bào hốc mắt|Mắt
Viêm túi lệ cấp|Mắt
Nhiễm nấm giác mạc|Nhiễm nấm
Viêm vùng chậu|Sản phụ khoa
Viêm nội mạc tử cung hậu sản|Sản phụ khoa
Nhiễm khuẩn hậu sản|Sản phụ khoa
Viêm màng ối|Sản phụ khoa
Áp xe phần phụ|Sản phụ khoa
Viêm âm đạo do vi khuẩn|Sản phụ khoa
Nhiễm Candida âm hộ–âm đạo|Nhiễm nấm
Nhiễm khuẩn tiết niệu thai kỳ|Sản phụ khoa
Viêm tuyến Bartholin|Sản phụ khoa
Viêm tai giữa cấp ở trẻ em|Nhi khoa
Viêm xoang cấp ở trẻ em|Nhi khoa
Viêm phổi cộng đồng ở trẻ em|Nhi khoa
Viêm phổi sơ sinh|Nhi khoa
Nhiễm khuẩn huyết sơ sinh|Nhi khoa
Viêm màng não ở trẻ em|Nhi khoa
Nhiễm khuẩn tiết niệu ở trẻ em|Nhi khoa
Viêm xương tủy ở trẻ em|Nhi khoa
Viêm mô tế bào ở trẻ em|Nhi khoa
Nhiễm khuẩn huyết liên quan catheter trung tâm|Hồi sức tích cực
Nhiễm khuẩn tiết niệu liên quan ống thông|Hồi sức tích cực
Nhiễm khuẩn vị trí mở khí quản|Hồi sức tích cực
Nhiễm khuẩn liên quan ECMO|Hồi sức tích cực
Nhiễm khuẩn thiết bị cấy ghép|Hồi sức tích cực
Sốt giảm bạch cầu trung tính|Hồi sức tích cực
Nhiễm khuẩn sau ghép tạng|Miễn dịch – Ghép tạng
Sốt giảm bạch cầu trung tính nguy cơ thấp|Huyết học
Sốt giảm bạch cầu trung tính nguy cơ cao|Huyết học
Nhiễm nấm xâm lấn ở bệnh nhân huyết học|Nhiễm nấm
Dự phòng Pneumocystis ở người suy giảm miễn dịch|Nhiễm nấm
Nhiễm trùng cơ hội ở người HIV|Truyền nhiễm
Nhiễm khuẩn trên người dùng corticosteroid kéo dài|Truyền nhiễm
Candidemia có giảm bạch cầu trung tính|Nhiễm nấm
Candida nội tâm mạc|Nhiễm nấm
Candida viêm nội nhãn|Nhiễm nấm
Candida viêm xương khớp|Nhiễm nấm
Candida đường tiết niệu có triệu chứng|Nhiễm nấm
Aspergillosis xoang xâm lấn|Nhiễm nấm
Aspergillosis phổi mạn tính|Nhiễm nấm
Cryptococcus ngoài thần kinh trung ương|Nhiễm nấm
Nhiễm nấm Histoplasma|Nhiễm nấm
Nhiễm nấm Talaromyces|Nhiễm nấm
Nhiễm nấm Fusarium|Nhiễm nấm
Uốn ván|Truyền nhiễm
Bạch hầu|Truyền nhiễm
Ho gà|Truyền nhiễm
Thương hàn|Truyền nhiễm
Nhiễm Leptospira|Truyền nhiễm
Nhiễm Rickettsia|Truyền nhiễm
Sốt mò|Truyền nhiễm
Nhiễm khuẩn sau vết cắn động vật|Truyền nhiễm
Nhiễm khuẩn sau phơi nhiễm nước biển|Truyền nhiễm
Viêm màng não do lao|Lao
Lao phổi|Lao
Nhiễm khuẩn cơ hội do Nocardia|Truyền nhiễm
Nhiễm trùng đường mật ở người ghép gan|Miễn dịch – Ghép tạng
`;

const DISEASES: Disease[] = RAW_DISEASES.trim()
  .split("\n")
  .map((line, index) => {
    const [title, specialty] = line.trim().split("|");

    return {
      id: `v8-${index + 1}`,
      title: title.trim(),
      specialty: specialty.trim(),
    };
  });

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

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

const PRIORITY_SPECIALTIES = [
  "Hô hấp",
  "Tai Mũi Họng",
  "Hồi sức tích cực",
  "Nội tiết",
  "Tiết niệu",
  "Ngoại tổng hợp",
  "Ngoại chấn thương",
  "Tim mạch",
];

export default function GuidelinePage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("v8-1");
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

    return names.sort((a, b) => {
      const rankA = PRIORITY_SPECIALTIES.findIndex((item) =>
        a.startsWith(item)
      );

      const rankB = PRIORITY_SPECIALTIES.findIndex((item) =>
        b.startsWith(item)
      );

      const aIndex = rankA < 0 ? 99 : rankA;
      const bIndex = rankB < 0 ? 99 : rankB;

      return aIndex - bIndex || a.localeCompare(b, "vi");
    });
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

  function chooseDisease(disease: Disease) {
    setSelectedId(disease.id);
    setAbrsSetting("outpatient");
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
          Chọn mặt bệnh theo chuyên khoa,
          phân tầng điều trị và đối chiếu hướng dẫn
          Việt Nam – quốc tế.
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
          </div>

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
          ) : isEnt ? (
            <EntEmpiricGuidelines
              key={selected.id}
              diseaseName={selected.title}
            />
          ) : isAdultCAP(selected) ? (
            <CapByt2026 />
          ) : isHAP(selected) ? (
            <HapVap2023 kind="hap" />
          ) : isVAP(selected) ? (
            <HapVap2023 kind="vap" />
          ) : (
            <section className="bv199-panel">
              <div className="bv199-label">
                HƯỚNG DẪN ĐIỀU TRỊ
              </div>

              <div className="bv199-warning">
                Chưa nhập phác đồ kháng sinh kinh nghiệm
                đã xác minh cho mặt bệnh này.

                <p>
                  Cần đối chiếu chẩn đoán, mức độ nặng,
                  tác nhân nghi ngờ, điều kiện phối hợp,
                  liều, đường dùng, thời gian điều trị
                  và tài liệu nguồn.
                </p>
              </div>
            </section>
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
