
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Microscope, Search, ChevronRight, BookOpen,
  Pill, Info, AlertTriangle, RotateCcw,
  ClipboardCheck, ExternalLink, ShieldCheck,
  Filter, CheckCircle2
} from "lucide-react";

/* ============================================
   BV199 - KHOA DƯỢC
   MODULE LỰA CHỌN KHÁNG SINH THEO TÁC NHÂN
   Nguồn nền: CMDT 2026 - Table 35-5
   ============================================ */

type Organism = {
  id: string;
  name: string;
  vietnamese: string;
  gram: string;
  category: string;
};

type Recommendation = {
  id: string;
  organismId: string;
  site: string;
  phenotype: string;
  title: string;
  firstChoice: string[];
  alternatives: string[];
  combination: string;
  rationale: string;
  caution: string;
  source: string;
  status: "reference" | "reviewed";
};

const SOURCE_NAME =
  "Current Medical Diagnosis & Treatment 2026, Table 35–5";

const SOURCE_URL =
  "https://accessmedicine.mhmedical.com/";

/*
  Danh mục tác nhân giúp tìm kiếm nhanh.
  Không phải tất cả tác nhân dưới đây đều
  có phác đồ đã thẩm định trong module.
*/
const ORGANISMS: Organism[] = [
  {
    id: "ecoli", name: "Escherichia coli",
    vietnamese: "Trực khuẩn E. coli",
    gram: "Gram âm", category: "Enterobacterales"
  },
  {
    id: "klebsiella", name: "Klebsiella pneumoniae",
    vietnamese: "Trực khuẩn Klebsiella",
    gram: "Gram âm", category: "Enterobacterales"
  },
  {
    id: "pseudomonas", name: "Pseudomonas aeruginosa",
    vietnamese: "Trực khuẩn mủ xanh",
    gram: "Gram âm", category: "Không lên men"
  },
  {
    id: "acinetobacter", name: "Acinetobacter baumannii",
    vietnamese: "Acinetobacter",
    gram: "Gram âm", category: "Không lên men"
  },
  {
    id: "enterobacter", name: "Enterobacter cloacae complex",
    vietnamese: "Nhóm Enterobacter",
    gram: "Gram âm", category: "Enterobacterales"
  },
  {
    id: "stenotrophomonas", name: "Stenotrophomonas maltophilia",
    vietnamese: "S. maltophilia",
    gram: "Gram âm", category: "Không lên men"
  },
  {
    id: "staphaureus", name: "Staphylococcus aureus",
    vietnamese: "Tụ cầu vàng",
    gram: "Gram dương", category: "Tụ cầu"
  },
  {
    id: "efaecalis", name: "Enterococcus faecalis",
    vietnamese: "Liên cầu ruột E. faecalis",
    gram: "Gram dương", category: "Enterococcus"
  },
  {
    id: "efaecium", name: "Enterococcus faecium",
    vietnamese: "Liên cầu ruột E. faecium",
    gram: "Gram dương", category: "Enterococcus"
  },
  {
    id: "pneumococcus", name: "Streptococcus pneumoniae",
    vietnamese: "Phế cầu",
    gram: "Gram dương", category: "Liên cầu"
  },
  {
    id: "haemophilus", name: "Haemophilus influenzae",
    vietnamese: "H. influenzae",
    gram: "Gram âm", category: "Hô hấp"
  },
  {
    id: "legionella", name: "Legionella spp.",
    vietnamese: "Legionella",
    gram: "Không điển hình", category: "Hô hấp"
  },
  {
    id: "bacteroides", name: "Bacteroides fragilis",
    vietnamese: "Vi khuẩn kỵ khí đường ruột",
    gram: "Gram âm", category: "Kỵ khí"
  },
  {
    id: "listeria", name: "Listeria monocytogenes",
    vietnamese: "Listeria",
    gram: "Gram dương", category: "Trực khuẩn"
  },
  {
    id: "moraxella", name: "Moraxella catarrhalis",
    vietnamese: "Moraxella",
    gram: "Gram âm", category: "Hô hấp"
  }
];

/*
  Bản biên soạn lâm sàng minh họa.
  Không sao chép nguyên văn Table 35–5.

  status = reference: chỉ là thông tin
  tham khảo, chưa được BV199 phê duyệt.
  status = reviewed: dành cho hồ sơ
  đã được bệnh viện thẩm định sau này.
*/
const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "ecoli-uti",
    organismId: "ecoli",
    site: "Viêm bàng quang không biến chứng",
    phenotype: "Chưa xác định",
    title: "E. coli trong viêm bàng quang không biến chứng",
    firstChoice: ["Nitrofurantoin"],
    alternatives: [
      "Fosfomycin",
      "TMP-SMX khi phù hợp tính nhạy cảm",
      "Một số beta-lactam đường uống theo hướng dẫn"
    ],
    combination:
      "Không khuyến cáo phối hợp thường quy các thuốc trên.",
    rationale:
      "Lựa chọn điều trị phải phù hợp với nhiễm khuẩn tiết niệu dưới, tính nhạy cảm và đối tượng người bệnh.",
    caution:
      "Không áp dụng nitrofurantoin cho viêm thận - bể thận hoặc nhiễm khuẩn huyết. Cần đánh giá chức năng thận, thai kỳ và các yếu tố phức tạp.",
    source: SOURCE_NAME,
    status: "reference"
  },
  {
    id: "staph-mssa",
    organismId: "staphaureus",
    site: "Nhiễm khuẩn xâm lấn",
    phenotype: "MSSA",
    title: "Staphylococcus aureus nhạy methicillin (MSSA)",
    firstChoice: [
      "Oxacillin hoặc nafcillin",
      "Cefazolin"
    ],
    alternatives: [
      "Lựa chọn khác tùy vị trí nhiễm khuẩn và dị ứng"
    ],
    combination:
      "Không mặc định phối hợp hai beta-lactam với nhau.",
    rationale:
      "Beta-lactam có hoạt tính kháng MSSA thường được ưu tiên khi phù hợp. Cần xác định loại nhiễm khuẩn để chọn chế độ điều trị.",
    caution:
      "Nếu nhiễm khuẩn huyết, cần đánh giá cấy máu kiểm tra, ổ nhiễm, viêm nội tâm mạc và thời gian điều trị.",
    source: SOURCE_NAME,
    status: "reference"
  },
  {
    id: "staph-mrsa",
    organismId: "staphaureus",
    site: "Nhiễm khuẩn xâm lấn",
    phenotype: "MRSA",
    title: "Staphylococcus aureus kháng methicillin (MRSA)",
    firstChoice: [
      "Vancomycin khi phù hợp bệnh cảnh"
    ],
    alternatives: [
      "Daptomycin cho các chỉ định phù hợp, không dùng cho viêm phổi",
      "Linezolid cho một số vị trí nhiễm khuẩn phù hợp"
    ],
    combination:
      "Không mặc định phối hợp vancomycin với linezolid hoặc daptomycin.",
    rationale:
      "Vị trí nhiễm khuẩn quyết định tính phù hợp của từng thuốc. Cần phối hợp AST và theo dõi hiệu quả.",
    caution:
      "Daptomycin không sử dụng điều trị viêm phổi. Vancomycin cần tối ưu phơi nhiễm và theo dõi độc tính thận.",
    source: SOURCE_NAME,
    status: "reference"
  },
  {
    id: "pseudo",
    organismId: "pseudomonas",
    site: "Nhiễm khuẩn xâm lấn",
    phenotype: "Nhạy cảm còn duy trì",
    title: "Pseudomonas aeruginosa",
    firstChoice: [
      "Một beta-lactam kháng Pseudomonas còn nhạy trên AST"
    ],
    alternatives: [
      "Cefepime",
      "Ceftazidime",
      "Piperacillin/tazobactam",
      "Meropenem",
      "Các thuốc mới khi kiểu hình đề kháng phù hợp"
    ],
    combination:
      "Phối hợp ban đầu chỉ cân nhắc theo nguy cơ đề kháng, mức độ nặng và khả năng đạt điều trị phù hợp; không mặc định duy trì hai thuốc khi đã có AST.",
    rationale:
      "Ưu tiên lựa chọn thuốc có hoạt tính được xác nhận, đạt đích PK/PD và thấm tốt tới vị trí nhiễm khuẩn.",
    caution:
      "Chưa cung cấp phác đồ riêng cho DTR-Pseudomonas. Nếu đa kháng, cần đối chiếu IDSA AMR Guidance và cơ chế đề kháng.",
    source: SOURCE_NAME,
    status: "reference"
  },
  {
    id: "efaecalis",
    organismId: "efaecalis",
    site: "Nhiễm khuẩn xâm lấn",
    phenotype: "Nhạy ampicillin",
    title: "Enterococcus faecalis",
    firstChoice: ["Ampicillin"],
    alternatives: [
      "Vancomycin nếu phù hợp tính nhạy cảm và tình trạng dị ứng"
    ],
    combination:
      "Một số nhiễm khuẩn nặng, đặc biệt viêm nội tâm mạc, cần phác đồ phối hợp đặc hiệu; không áp dụng phối hợp đó cho mọi nhiễm khuẩn Enterococcus.",
    rationale:
      "Ampicillin là lựa chọn đáng cân nhắc khi chủng còn nhạy; phân biệt nhiễm khuẩn thực sự với định cư.",
    caution:
      "Viêm nội tâm mạc cần hướng dẫn chuyên biệt về phối hợp, liều, thời gian và nguy cơ độc thận.",
    source: SOURCE_NAME,
    status: "reference"
  },
  {
    id: "legionella-pneumonia",
    organismId: "legionella",
    site: "Viêm phổi",
    phenotype: "Chưa xác định",
    title: "Viêm phổi do Legionella",
    firstChoice: [
      "Azithromycin",
      "Levofloxacin khi phù hợp"
    ],
    alternatives: [
      "Doxycycline trong các trường hợp được lựa chọn"
    ],
    combination:
      "Không mặc định phối hợp macrolide và fluoroquinolone.",
    rationale:
      "Cần sử dụng thuốc có hoạt tính trên tác nhân nội bào và đánh giá mức độ nặng.",
    caution:
      "Xem xét QTc, tương tác thuốc và chức năng thận khi lựa chọn phác đồ.",
    source: SOURCE_NAME,
    status: "reference"
  }
];

const SITES = [
  "Tất cả",
  "Viêm bàng quang không biến chứng",
  "Nhiễm khuẩn xâm lấn",
  "Viêm phổi"
];

const PHENOTYPES = [
  "Tất cả", "Chưa xác định", "MSSA", "MRSA",
  "Nhạy ampicillin", "Nhạy cảm còn duy trì",
  "ESBL", "AmpC", "CRE", "CRAB", "VRE"
];

function searchable(value: string) {
  return value.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function isRecommendation(value: unknown): value is Recommendation {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<Recommendation>;
  return typeof r.id === "string" &&
    typeof r.organismId === "string" &&
    typeof r.site === "string" &&
    typeof r.phenotype === "string" &&
    typeof r.title === "string" &&
    Array.isArray(r.firstChoice) &&
    r.firstChoice.every(x => typeof x === "string") &&
    Array.isArray(r.alternatives) &&
    r.alternatives.every(x => typeof x === "string") &&
    typeof r.combination === "string" &&
    typeof r.rationale === "string" &&
    typeof r.caution === "string" &&
    typeof r.source === "string" &&
    (r.status === "reference" || r.status === "reviewed");
}

export default function PathogensPage() {
  const [query, setQuery] = useState("");
  const [gram, setGram] = useState("Tất cả");
  const [selectedId, setSelectedId] = useState("");
  const [site, setSite] = useState("Tất cả");
  const [phenotype, setPhenotype] = useState("Tất cả");
  const [hasAST, setHasAST] = useState("unknown");
  const [mode, setMode] = useState<"search"|"source">("search");
  const [external, setExternal] = useState<Recommendation[]>([]);
  const [importState, setImportState] = useState("");

  // Nạp dữ liệu nội bộ tùy chọn.
  // Không phụ thuộc file này để trang hoạt động.
  useEffect(() => {
    let mounted = true;
    fetch("/data/organism-therapy.json")
      .then(r => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((json: unknown) => {
        if (!mounted || !json) return;
        if (!Array.isArray(json) ||
            !json.every(isRecommendation)) {
          setImportState("Dữ liệu bổ sung chưa đúng định dạng.");
          return;
        }
        const validIds = new Set(ORGANISMS.map(o => o.id));
        const accepted = json.filter(
          r => validIds.has(r.organismId)
        );
        setExternal(accepted);
        setImportState(
          `Đã nạp ${accepted.length} bản ghi bổ sung.`
        );
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => ORGANISMS.filter(o =>
    (gram === "Tất cả" || o.gram === gram) &&
    searchable(
      o.name + " " + o.vietnamese + " " + o.category
    ).includes(searchable(query))
  ), [gram, query]);

  const recommendations = useMemo(() => {
    const combined = [
      ...INITIAL_RECOMMENDATIONS, ...external
    ];

    return combined.filter(r =>
      r.organismId === selectedId &&
      (site === "Tất cả" || r.site === site) &&
      (phenotype === "Tất cả" ||
       r.phenotype === phenotype)
    );
  }, [selectedId, site, phenotype, external]);

  const organism = ORGANISMS.find(o => o.id === selectedId);

  function reset() {
    setQuery("");
    setGram("Tất cả");
    setSelectedId("");
    setSite("Tất cả");
    setPhenotype("Tất cả");
    setHasAST("unknown");
  }

  return (
    <main className="path-page">
      <div className="path-container">

        <nav className="path-breadcrumb">
          <Link href="/">Trang chủ</Link>
          <ChevronRight size={14}/>
          <Link href="/antibiotics">Kháng sinh & AMS</Link>
          <ChevronRight size={14}/>
          <strong>Theo tác nhân gây bệnh</strong>
        </nav>

        <header className="path-heading">
          <div className="path-logo">
            <Microscope size={26}/>
          </div>
          <div>
            <h1>Lựa chọn kháng sinh theo tác nhân</h1>
            <p>
              Hỗ trợ tra cứu điều trị hướng đích
              theo vi sinh, kháng sinh đồ và vị trí nhiễm khuẩn
            </p>
          </div>
        </header>

        <div className="path-tabs">
          <button
            className={mode === "search" ? "active" : ""}
            onClick={() => setMode("search")}
          >
            <Search size={17}/>
            Tra cứu tác nhân
          </button>
          <button
            className={mode === "source" ? "active" : ""}
            onClick={() => setMode("source")}
          >
            <BookOpen size={17}/>
            Nguồn & nguyên tắc
          </button>
        </div>

        {mode === "search" ? (
          <>
            <section className="path-panel">
              <div className="path-section">
                <span>01</span>
                <h2>Lựa chọn tác nhân gây bệnh</h2>
              </div>

              <div className="path-toolbar">
                <label className="path-search">
                  <Search size={18}/>
                  <input value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Tìm E. coli, Klebsiella, MRSA, Pseudomonas..."
                  />
                </label>
                <label className="path-filter">
                  <Filter size={17}/>
                  <select value={gram}
                    onChange={e => setGram(e.target.value)}>
                    <option>Tất cả</option>
                    <option>Gram âm</option>
                    <option>Gram dương</option>
                    <option>Không điển hình</option>
                  </select>
                </label>
              </div>

              <div className="path-organisms">
                {filtered.map(o => (
                  <button key={o.id}
                    className={
                      "path-organism " +
                      (selectedId === o.id ? "selected" : "")
                    }
                    onClick={() => {
                      setSelectedId(o.id);
                      setSite("Tất cả");
                      setPhenotype("Tất cả");
                    }}>
                    <div>
                      <b><i>{o.name}</i></b>
                      <small>{o.vietnamese}</small>
                    </div>
                    <span>{o.gram}</span>
                  </button>
                ))}
                {filtered.length === 0 &&
                  <p className="path-muted">
                    Không tìm thấy tác nhân phù hợp.
                  </p>
                }
              </div>
            </section>

            {organism ? (
              <>
                <section className="path-panel">
                  <div className="path-section">
                    <span>02</span>
                    <h2>Thông tin lâm sàng và vi sinh</h2>
                  </div>

                  <div className="path-selected">
                    <Microscope size={22}/>
                    <div>
                      <strong><i>{organism.name}</i></strong>
                      <small>
                        {organism.gram} · {organism.category}
                      </small>
                    </div>
                  </div>

                  <div className="path-grid">
                    <label>
                      <span>Vị trí nhiễm khuẩn</span>
                      <select value={site}
                        onChange={e => setSite(e.target.value)}>
                        {SITES.map(s =>
                          <option key={s}>{s}</option>
                        )}
                      </select>
                    </label>

                    <label>
                      <span>Kiểu hình đề kháng</span>
                      <select value={phenotype}
                        onChange={e => setPhenotype(e.target.value)}>
                        {PHENOTYPES.map(s =>
                          <option key={s}>{s}</option>
                        )}
                      </select>
                    </label>

                    <label>
                      <span>Kết quả kháng sinh đồ</span>
                      <select value={hasAST}
                        onChange={e => setHasAST(e.target.value)}>
                        <option value="unknown">
                          Chưa có / chưa nhập AST
                        </option>
                        <option value="available">
                          Đã có AST - cần đối chiếu
                        </option>
                      </select>
                    </label>
                  </div>

                  {hasAST === "unknown" && (
                    <div className="path-warning">
                      <AlertTriangle size={18}/>
                      Chưa có dữ liệu S/I/R hoặc MIC.
                      Lựa chọn bên dưới chỉ là tài liệu
                      tham khảo, không xác nhận thuốc
                      còn nhạy với chủng phân lập.
                    </div>
                  )}

                  {hasAST === "available" && (
                    <div className="path-note">
                      <Info size={18}/>
                      Đã có AST nhưng module chưa nhận
                      các giá trị S/I/R và MIC cụ thể.
                      Cần kiểm tra breakpoint,
                      liều tối ưu và vị trí nhiễm khuẩn.
                    </div>
                  )}
                </section>

                <section className="path-panel">
                  <div className="path-section">
                    <span>03</span>
                    <h2>Thông tin lựa chọn điều trị</h2>
                  </div>

                  {recommendations.length === 0 ? (
                    <div className="path-empty">
                      <AlertTriangle size={34}/>
                      <h3>Chưa có phác đồ phù hợp đã nhập</h3>
                      <p>
                        Không tự suy luận lựa chọn
                        kháng sinh từ tên vi khuẩn.
                        Cần tra cứu hướng dẫn theo
                        bệnh cảnh và kiểu hình đề kháng.
                      </p>
                    </div>
                  ) : recommendations.map(r => (
                    <article className="path-result" key={r.id}>
                      <div className="path-result-head">
                        <div>
                          <small>
                            {r.site} · {r.phenotype}
                          </small>
                          <h3>{r.title}</h3>
                        </div>
                        <span className="path-status">
                          {r.status === "reviewed"
                            ? "Có nhãn thẩm định"
                            : "Tài liệu tham khảo"}
                        </span>
                      </div>

                      <div className="path-two">
                        <div className="path-therapy">
                          <label>Kháng sinh ưu tiên theo nguồn</label>
                          {r.firstChoice.map((drug, i) =>
                            <p key={i}>
                              <Pill size={15}/>
                              {drug}
                            </p>
                          )}
                        </div>

                        <div className="path-therapy">
                          <label>Thuốc / phương án thay thế</label>
                          {r.alternatives.map((drug, i) =>
                            <p key={i}>
                              <Pill size={15}/>
                              {drug}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="path-information">
                        <h4>Phối hợp kháng sinh</h4>
                        <p>{r.combination}</p>
                        <h4>Cơ sở lựa chọn</h4>
                        <p>{r.rationale}</p>
                      </div>

                      <div className="path-warning">
                        <AlertTriangle size={18}/>
                        <span>{r.caution}</span>
                      </div>

                      <div className="path-reference">
                        <BookOpen size={16}/>
                        <span>{r.source}</span>
                      </div>
                    </article>
                  ))}

                  <p className="path-muted">
                    Chỉ các bệnh cảnh đã biên soạn mới có
                    nội dung điều trị. Danh sách tác nhân
                    không đồng nghĩa tất cả tác nhân đã
                    được số hóa phác đồ.
                  </p>
                </section>
              </>
            ) : (
              <div className="path-empty">
                <Microscope size={42}/>
                <h3>Chọn một tác nhân để bắt đầu</h3>
                <p>
                  Chọn vi khuẩn, sau đó đối chiếu
                  vị trí nhiễm khuẩn, kháng sinh đồ
                  và kiểu hình đề kháng.
                </p>
              </div>
            )}
          </>
        ) : (
          <section className="path-panel">
            <div className="path-section">
              <span><BookOpen size={17}/></span>
              <h2>Nguồn tài liệu & nguyên tắc áp dụng</h2>
            </div>

            <div className="path-reference-block">
              <b>Current Medical Diagnosis & Treatment 2026</b>
              <p>
                Chapter 35 - Selected Principles
                of Antimicrobial Therapy, Table 35–5.
              </p>
              <a href={SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer">
                Mở AccessMedicine
                <ExternalLink size={15}/>
              </a>
            </div>

            <div className="path-reference-block">
              <b>IDSA Guidance on AMR</b>
              <p>
                Dùng để đối chiếu các nhiễm khuẩn
                do vi khuẩn Gram âm kháng thuốc
                và lựa chọn hướng đích.
              </p>
              <a href="https://www.idsociety.org/practice-guideline/amr-guidance/"
                target="_blank"
                rel="noopener noreferrer">
                Mở IDSA
                <ExternalLink size={15}/>
              </a>
            </div>

            <div className="path-reference-block">
              <b>Bộ Y tế Việt Nam</b>
              <p>
                QĐ 708/QĐ-BYT về sử dụng kháng sinh,
                QĐ 5631/QĐ-BYT về quản lý sử dụng
                kháng sinh trong bệnh viện.
              </p>
            </div>

            <div className="path-note">
              <ShieldCheck size={19}/>
              Cần thẩm định tại Hội đồng Thuốc và
              điều trị hoặc Hội đồng chuyên môn
              trước khi ban hành thành phác đồ
              điều trị nội bộ BV199.
            </div>

            <div className="path-note">
              <Info size={18}/>
              Dữ liệu mở rộng có thể đặt tại
              public/data/organism-therapy.json,
              theo cấu trúc Recommendation.
              Chỉ nhập những bản ghi đã được
              biên soạn và kiểm tra nguồn.
            </div>

            {importState &&
              <p className="path-muted">{importState}</p>
            }
          </section>
        )}

        <div className="path-footer">
          <span>
            Khoa Dược · Bệnh viện 199 ·
            Công cụ hỗ trợ Dược lâm sàng
          </span>
          <button onClick={reset}>
            <RotateCcw size={15}/>
            Đặt lại
          </button>
        </div>
      </div>

      <style>{`
        .path-page {
          min-height:100vh;
          padding:24px;
          background:#f6f9fc;
          color:#10233e;
          font-family:Arial,sans-serif;
        }
        .path-container {
          max-width:1320px;
          margin:auto;
        }
        .path-breadcrumb {
          display:flex;
          flex-wrap:wrap;
          align-items:center;
          gap:9px;
          font-size:12px;
          color:#6c819c;
          margin-bottom:22px;
        }
        .path-breadcrumb a {
          text-decoration:none;
          color:#075985;
        }
        .path-breadcrumb strong {
          color:#10233e;
        }
        .path-heading {
          display:flex;
          align-items:center;
          gap:15px;
          margin-bottom:22px;
        }
        .path-logo {
          display:grid;
          place-items:center;
          width:50px;
          height:50px;
          flex-shrink:0;
          border-radius:12px;
          background:#dceeff;
          color:#075985;
        }
        .path-heading h1 {
          font-size:26px;
          margin:0 0 7px;
          letter-spacing:-.5px;
          font-weight:800;
        }
        .path-heading p {
          margin:0;
          color:#70849f;
          font-size:13px;
          line-height:1.6;
        }
        .path-tabs {
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-bottom:15px;
        }
        .path-tabs button {
          display:flex;
          align-items:center;
          gap:9px;
          background:#fff;
          border:1px solid #dce6f0;
          border-radius:9px;
          padding:12px 16px;
          color:#123758;
          font-size:13px;
          font-weight:700;
          cursor:pointer;
        }
        .path-tabs button.active {
          background:#075985;
          color:#fff;
          border-color:#075985;
        }
        .path-panel {
          border:1px solid #dfe8f2;
          background:#fff;
          border-radius:14px;
          padding:20px;
          margin-bottom:16px;
        }
        .path-section {
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:16px;
        }
        .path-section>span {
          display:grid;
          place-items:center;
          min-width:33px;
          min-height:33px;
          border-radius:9px;
          background:#e7f3fe;
          color:#075985;
          font-size:12px;
          font-weight:800;
        }
        .path-section h2 {
          font-size:17px;
          margin:0;
        }
        .path-toolbar {
          display:grid;
          grid-template-columns:minmax(0,1fr) 190px;
          gap:12px;
          margin-bottom:16px;
        }
        .path-search,.path-filter {
          display:flex;
          align-items:center;
          gap:10px;
          padding:0 13px;
          min-height:47px;
          box-sizing:border-box;
          border:1px solid #d1dfed;
          border-radius:10px;
          color:#6d87a3;
        }
        .path-search input,.path-filter select {
          flex:1;
          min-width:0;
          border:0;
          outline:none;
          background:transparent;
          color:#10233e;
          font-size:13px;
        }
        .path-organisms {
          display:grid;
          grid-template-columns:
            repeat(3,minmax(0,1fr));
          gap:10px;
          max-height:330px;
          overflow-y:auto;
        }
        .path-organism {
          display:flex;
          align-items:center;
          justify-content:space-between;
          text-align:left;
          gap:10px;
          border:1px solid #e0e8f0;
          border-radius:10px;
          padding:13px;
          background:#fff;
          cursor:pointer;
        }
        .path-organism.selected {
          border-color:#0284c7;
          background:#edf8ff;
        }
        .path-organism b {
          display:block;
          font-size:13px;
        }
        .path-organism small {
          display:block;
          color:#7b8da5;
          margin-top:6px;
          font-size:11px;
        }
        .path-organism>span {
          font-size:10px;
          color:#5b7a98;
          background:#f1f6fa;
          border-radius:6px;
          padding:5px 7px;
          white-space:nowrap;
        }
        .path-selected {
          display:flex;
          align-items:center;
          gap:12px;
          padding:15px;
          background:#eff7fe;
          border-radius:10px;
          margin-bottom:18px;
          color:#075985;
        }
        .path-selected strong {
          display:block;
          font-size:16px;
        }
        .path-selected small {
          display:block;
          margin-top:5px;
          color:#69839d;
          font-size:12px;
        }
        .path-grid {
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:13px;
        }
        .path-grid label>span {
          display:block;
          margin-bottom:8px;
          font-size:12px;
          font-weight:700;
        }
        .path-grid select {
          width:100%;
          min-height:44px;
          padding:0 10px;
          border:1px solid #d2deea;
          border-radius:9px;
          background:white;
          color:#10233e;
          font-size:12px;
        }
        .path-warning,.path-note {
          display:flex;
          align-items:flex-start;
          gap:10px;
          padding:12px 14px;
          border:1px solid #f1d6a7;
          background:#fff8ed;
          border-radius:9px;
          color:#88521e;
          font-size:12px;
          line-height:1.75;
          margin-top:15px;
        }
        .path-note {
          background:#eef7ff;
          border-color:#cce4fa;
          color:#355c7e;
        }
        .path-warning svg,.path-note svg {
          flex-shrink:0;
        }
        .path-empty {
          padding:45px 20px;
          min-height:220px;
          box-sizing:border-box;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          background:#f4f9fe;
          border:1px solid #dce8f4;
          border-radius:12px;
          color:#075985;
        }
        .path-empty h3 {
          font-size:17px;
          margin:14px 0 6px;
          color:#10233e;
        }
        .path-empty p {
          font-size:13px;
          max-width:500px;
          line-height:1.75;
          color:#6c839d;
        }
        .path-result {
          border:1px solid #dfe8f2;
          border-radius:12px;
          padding:17px;
          margin-bottom:12px;
        }
        .path-result-head {
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
          margin-bottom:15px;
        }
        .path-result-head small {
          font-size:11px;
          color:#7188a2;
        }
        .path-result-head h3 {
          font-size:18px;
          margin:8px 0 0;
        }
        .path-status {
          background:#f0f4f8;
          border-radius:8px;
          color:#60758c;
          font-size:11px;
          padding:7px 10px;
        }
        .path-two {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:13px;
        }
        .path-therapy {
          padding:15px;
          border:1px solid #dce7f1;
          border-radius:10px;
          background:#fcfeff;
        }
        .path-therapy label {
          display:block;
          color:#587492;
          font-size:12px;
          font-weight:700;
          margin-bottom:12px;
        }
        .path-therapy p {
          display:flex;
          align-items:flex-start;
          gap:9px;
          font-size:13px;
          line-height:1.7;
          color:#075985;
          margin:10px 0;
        }
        .path-therapy svg {
          flex-shrink:0;
          margin-top:3px;
        }
        .path-information {
          margin-top:17px;
        }
        .path-information h4 {
          font-size:13px;
          margin:15px 0 6px;
          color:#123758;
        }
        .path-information p {
          font-size:13px;
          margin:0;
          color:#4c627a;
          line-height:1.8;
        }
        .path-reference {
          display:flex;
          align-items:center;
          gap:8px;
          color:#63819e;
          font-size:11px;
          margin-top:15px;
        }
        .path-reference-block {
          padding:16px 0;
          border-bottom:1px solid #e3eaf1;
        }
        .path-reference-block b {
          font-size:14px;
        }
        .path-reference-block p {
          color:#607890;
          font-size:13px;
          line-height:1.7;
        }
        .path-reference-block a {
          display:inline-flex;
          align-items:center;
          gap:7px;
          color:#075985;
          font-size:12px;
          text-decoration:none;
          font-weight:700;
        }
        .path-muted {
          color:#7287a0;
          font-size:12px;
          line-height:1.8;
        }
        .path-footer {
          display:flex;
          justify-content:space-between;
          gap:12px;
          align-items:center;
          color:#7588a1;
          font-size:11px;
          padding:15px 0;
          border-top:1px solid #e0e8f1;
        }
        .path-footer button {
          display:flex;
          align-items:center;
          gap:7px;
          background:#fff;
          border:1px solid #d5e2ee;
          color:#075985;
          border-radius:8px;
          padding:9px 12px;
          cursor:pointer;
        }
        @media(max-width:1000px) {
          .path-organisms {
            grid-template-columns:repeat(2,minmax(0,1fr));
          }
          .path-grid {
            grid-template-columns:repeat(2,minmax(0,1fr));
          }
        }
        @media(max-width:650px) {
          .path-page {padding:14px}
          .path-heading h1 {font-size:21px}
          .path-toolbar,.path-grid,.path-two {
            grid-template-columns:1fr;
          }
          .path-organisms {
            grid-template-columns:1fr;
            max-height:390px;
          }
          .path-panel {padding:14px}
          .path-result-head h3 {font-size:16px}
        }
      `}</style>
    </main>
  );
}
