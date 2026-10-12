
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Microscope,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  BookOpen,
  RotateCcw,
  ExternalLink,
  AlertTriangle,
  X,
} from "lucide-react";

/* =====================================================
   BV199 CLINICAL PHARMACY
   LỰA CHỌN KHÁNG SINH THEO TÁC NHÂN

   Current Medical Diagnosis & Treatment 2026
   Selected Principles of Antimicrobial Therapy
   Table 35–5

   54 dòng tác nhân
   9 nhóm vi sinh
   17 chú thích

   BẢO TOÀN DANH PHÁP VÀ TRÌNH BÀY NGUỒN

   Không phải phác đồ đã được BV199 phê duyệt.
===================================================== */

type OrganismRow = {
  id: string;
  group: string;
  agent: string;
  first: string;
  alternative: string;
  notes: number[];
  page: number;
};

/*
   GROUP: giữ tên tiếng Anh đúng nhóm nguồn.

   AGENT: giữ tên tiếng Anh / danh pháp khoa học.

   FIRST: thuốc lựa chọn đầu tiên.

   ALTERNATIVE: thuốc thay thế.

   NOTES: số chú thích tương ứng.

   PAGE: trang trong PDF 4 trang.
*/

const RAW = `
Gram-Negative Cocci|Moraxella catarrhalis|Cefuroxime axetil; amoxicillin-clavulanic acid|Ceftriaxone; a fluoroquinolone [1]; a macrolide [2]; a tetracycline [3]; TMP-SMX [4]|1,2,3,4|1
Gram-Negative Cocci|Neisseria gonorrhoeae (gonococcus)|Ceftriaxone ± doxycycline [5]|Gentamicin + azithromycin OR cefixime ± doxycycline [5]|5|1
Gram-Negative Cocci|Neisseria meningitidis (meningococcus)|Penicillin [6]|Ceftriaxone; ampicillin|6|1
Gram-Positive Cocci|Enterococcus faecalis|Ampicillin ± gentamicin [7] OR ampicillin ± ceftriaxone|Vancomycin ± gentamicin|7|1
Gram-Positive Cocci|Enterococcus faecium|Vancomycin ± gentamicin [7]|Linezolid [8]; daptomycin [8]; tigecycline [8]; tedizolid [8]; oritavancin [8]|7,8|1
Gram-Positive Cocci|Staphylococcus, methicillin-resistant|Vancomycin|TMP-SMX [4]; doxycycline; minocycline; linezolid [8]; tedizolid [8]; daptomycin [8]; telavancin [8]; dalbavancin [8]; oritavancin [8]; ceftaroline; delafloxacin|4,8|1
Gram-Positive Cocci|Staphylococcus, methicillin-susceptible|Cefazolin OR penicillinase-resistant penicillin [9]|Vancomycin; a cephalosporin [10]; clindamycin; amoxicillin-clavulanic acid; ampicillin-sulbactam|9,10|1
Gram-Positive Cocci|Streptococcus, hemolytic, groups A, B, C, G|Penicillin [6]|Macrolide [2]; a cephalosporin [10]; vancomycin; clindamycin|2,6,10|1
Gram-Positive Cocci|Streptococcus pneumoniae (pneumococcus)|Penicillin [6,11]|A cephalosporin [10]; vancomycin; clindamycin; a tetracycline [3]; respiratory fluoroquinolones [1]|1,3,6,10,11|1
Gram-Positive Cocci|Viridans streptococci|Penicillin [6]|Cephalosporin [10]; vancomycin|6,10|1
Gram-Negative Rods|Acinetobacter|Imipenem; meropenem; ampicillin-sulbactam|Tigecycline; minocycline; aminoglycosides [12]; polymyxin B; cefiderocol; sulbactam/durlobactam|12|1
Gram-Negative Rods|Bacteroides, GI strains|Metronidazole|Ampicillin-sulbactam; piperacillin-tazobactam; ertapenem||1
Gram-Negative Rods|Brucella|Doxycycline + rifampin|TMP-SMX [4] ± gentamicin; ciprofloxacin + rifampin|4|1
Gram-Negative Rods|Burkholderia pseudomallei (melioidosis) and Burkholderia mallei (glanders)|Ceftazidime initially FOLLOWED BY TMP-SMX [4]|Meropenem initially FOLLOWED BY amoxicillin-clavulanic acid|4|1
Gram-Negative Rods|Campylobacter jejuni|Azithromycin|A fluoroquinolone [1]|1|1
Gram-Negative Rods|Enterobacter|Ertapenem; imipenem; meropenem; cefepime|Aminoglycoside; a fluoroquinolone [1]; TMP-SMX [4]|1,4|1
Gram-Negative Rods|Escherichia coli (complicated, hospitalized)|Ceftriaxone ONLY IF high local susceptibility rates; otherwise select an alternative|Ertapenem [13]; aminoglycosides [12]; aztreonam; piperacillin-tazobactam; ceftazidime-avibactam [13,14]; ceftolozane-tazobactam [13]; meropenem/vaborbactam [14]; imipenem/cilastatin-relebactam [13,14]|12,13,14|2
Gram-Negative Rods|Escherichia coli (uncomplicated outpatient UTI)|Nitrofurantoin|Fluoroquinolones [1]; fosfomycin; TMP-SMX [4]; oral cephalosporin|1,4|2
Gram-Negative Rods|Haemophilus (respiratory infections, otitis)|Amoxicillin-clavulanate|Doxycycline; azithromycin; ceftriaxone; cefuroxime sodium; cefuroxime axetil; TMP-SMX [4]|4|2
Gram-Negative Rods|Haemophilus (serious infection)|Ceftriaxone|Aztreonam||2
Gram-Negative Rods|Helicobacter pylori|PPI + clarithromycin + amoxicillin + metronidazole ONLY IF high local susceptibility rates; otherwise select an alternative|PPI + bismuth subsalicylate + tetracycline + metronidazole||2
Gram-Negative Rods|Klebsiella|Ceftriaxone ONLY IF high local susceptibility rates; otherwise select an alternative|Cefepime; TMP-SMX [4]; aminoglycoside [12]; ertapenem [13]; fluoroquinolone [1]; aztreonam; piperacillin-tazobactam; ceftazidime-avibactam [13,14]; ceftolozane-tazobactam [13]; meropenem/vaborbactam [14]; imipenem/cilastatin-relebactam [13,14]|1,4,12,13,14|2
Gram-Negative Rods|Legionella species (pneumonia)|Azithromycin OR fluoroquinolones [1] ± rifampin|Doxycycline ± rifampin|1|2
Gram-Negative Rods|Prevotella, oropharyngeal strains|Clindamycin|Metronidazole||2
Gram-Negative Rods|Proteus mirabilis|Ampicillin|TMP-SMX [4]; a fluoroquinolone [1]; a cephalosporin [10]; ertapenem OR meropenem [13]|1,4,10,13|2
Gram-Negative Rods|Proteus vulgaris and other species (Morganella, Providencia)|Ceftriaxone|Ertapenem OR meropenem; TMP-SMX [4]; a fluoroquinolone [1]|1,4|2
Gram-Negative Rods|Pseudomonas aeruginosa|Piperacillin-tazobactam OR ceftazidime OR cefepime OR imipenem OR meropenem OR doripenem OR aztreonam|Ceftazidime-avibactam [13,15]; ceftolozane-tazobactam [13,15]; cefiderocol [15]; imipenem/cilastatin-relebactam [15]|13,15|2
Gram-Negative Rods|Salmonella (bacteremia)|Ceftriaxone|A fluoroquinolone [1]|1|2
Gram-Negative Rods|Serratia|Ceftriaxone; piperacillin-tazobactam|TMP-SMX [4]; a fluoroquinolone [1]; a carbapenem|1,4|2
Gram-Negative Rods|Shigella|Azithromycin OR ciprofloxacin OR ceftriaxone|TMP-SMX [4]|4|2
Gram-Negative Rods|Vibrio (cholera, sepsis)|A tetracycline [3]|Azithromycin; a fluoroquinolone [1]; ceftriaxone|1,3|2
Gram-Negative Rods|Yersinia pestis (plague)|A fluoroquinolone [1] OR streptomycin OR gentamicin|TMP-SMX; tetracycline [3]|1,3|2
Gram-Positive Rods|Actinomyces|Penicillin [6]|Tetracycline [3]; clindamycin|3,6|2
Gram-Positive Rods|Bacillus (including anthrax)|Penicillin [6]|A macrolide [2]; a fluoroquinolone [1]|1,2,6|2
Gram-Positive Rods|Clostridium (eg, gas gangrene, tetanus)|Penicillin [6]|Metronidazole; clindamycin; imipenem OR meropenem|6|2
Gram-Positive Rods|Corynebacterium diphtheria|Macrolide [2]|Penicillin [6]|2,6|2
Gram-Positive Rods|Corynebacterium jeikeium|Vancomycin|Linezolid||2
Gram-Positive Rods|Listeria|Ampicillin ± aminoglycoside [12]|TMP-SMX [4]|4,12|2
Acid-Fast Rods|Mycobacterium avium complex|Clarithromycin OR azithromycin + ethambutol, ± rifabutin|Amikacin; ciprofloxacin||3
Acid-Fast Rods|Mycobacterium fortuitum-chelonae|Cefoxitin + clarithromycin|Amikacin; rifampin; sulfonamide; doxycycline; linezolid||3
Acid-Fast Rods|Mycobacterium kansasii|INH + rifampin ± ethambutol|Clarithromycin; azithromycin; ethionamide; cycloserine||3
Acid-Fast Rods|Mycobacterium leprae|Dapsone + rifampin ± clofazimine|Minocycline; ofloxacin; clarithromycin||3
Acid-Fast Rods|Mycobacterium tuberculosis|Isoniazid (INH) + rifampin + pyrazinamide ± ethambutol|Other antituberculous drugs (see Part 9)|16|3
Acid-Fast Rods|Nocardia|TMP-SMX [4]|Minocycline; imipenem OR meropenem; linezolid|4|3
Spirochetes|Borrelia burgdorferi (Lyme disease)|Doxycycline; amoxicillin; cefuroxime axetil|Ceftriaxone; penicillin; azithromycin||3
Spirochetes|Borrelia recurrentis (relapsing fever)|Doxycycline [3]|Penicillin [6]|3,6|3
Spirochetes|Leptospira|Penicillin [6]|Doxycycline [3]; ceftriaxone|3,6|3
Spirochetes|Treponema pallidum (syphilis)|Penicillin [6]|Doxycycline|6|3
Spirochetes|Treponema pertenue (yaws)|Penicillin [6]|Doxycycline|6|3
Mycoplasmas|Mycoplasmas|Azithromycin OR doxycycline|A fluoroquinolone [1]|1|3
Chlamydiae|C pneumoniae|Doxycycline [3]|Azithromycin; a fluoroquinolone [1,17]|1,3,17|3
Chlamydiae|C psittaci|Doxycycline|Azithromycin; clarithromycin||3
Chlamydiae|C trachomatis (urethritis or pelvic inflammatory disease)|Doxycycline|Azithromycin; levofloxacin||3
Rickettsiae|Rickettsiae|Doxycycline [3]|A fluoroquinolone [1]|1,3|3
`;

/* =====================================================
   17 CHÚ THÍCH TABLE 35–5
   DIỄN GIẢI TIẾNG VIỆT
===================================================== */

const FOOTNOTES: Record<number, string> = {
  1: "Fluoroquinolones gồm ciprofloxacin, levofloxacin, moxifloxacin và các thuốc khác. Levofloxacin và moxifloxacin có hoạt tính trên các tác nhân hô hấp. Delafloxacin có hoạt tính trên MRSA.",
  2: "Azithromycin được tài liệu ưu tiên trong nhóm macrolide nhờ đặc điểm an toàn và ít tương tác thuốc.",
  3: "Các tetracycline có hoạt tính gần tương tự trên nhiều tác nhân. Minocycline và doxycycline có hoạt tính trên S. aureus tốt hơn tetracycline.",
  4: "TMP-SMX là phối hợp trimethoprim và sulfamethoxazole theo tỷ lệ 1:5.",
  5: "Bổ sung doxycycline khi chưa loại trừ nhiễm Chlamydia.",
  6: "Penicillin G được ưu tiên khi sử dụng đường tiêm; penicillin V khi sử dụng đường uống.",
  7: "Chỉ bổ sung gentamicin đối với nhiễm Enterococcus nặng, ví dụ viêm nội tâm mạc hoặc viêm màng não.",
  8: "Linezolid, tedizolid, tigecycline, daptomycin, telavancin, dalbavancin và oritavancin được đề cập cho trường hợp kháng vancomycin hoặc không dung nạp vancomycin. Cần đối chiếu vị trí nhiễm khuẩn và chỉ định riêng của từng thuốc.",
  9: "Penicillin kháng penicillinase: nafcillin hoặc oxacillin đường tiêm; dicloxacillin, cloxacillin hoặc oxacillin đường uống.",
  10: "Phần lớn cephalosporin đường tĩnh mạch, ngoại trừ ceftazidime, có hoạt tính trên liên cầu và MSSA.",
  11: "Điều trị phế cầu giảm nhạy hoặc kháng penicillin phụ thuộc mức độ đề kháng và vị trí nhiễm khuẩn. Cần đối chiếu MIC, breakpoint và chế độ liều.",
  12: "Aminoglycosides gồm gentamicin, tobramycin, amikacin và plazomicin; lựa chọn theo tính nhạy cảm địa phương.",
  13: "Nguồn đề cập sử dụng carbapenem cho chủng sinh ESBL và một số lựa chọn thay thế trong điều kiện cụ thể. Cần đối chiếu khuyến cáo AMR và AST hiện hành.",
  14: "Cân nhắc những lựa chọn được đánh dấu ở một số nhiễm Enterobacterales sinh carbapenemase. Cần xác định cơ chế carbapenemase.",
  15: "Một số thuốc mới, bao gồm ceftolozane-tazobactam, cefiderocol hoặc imipenem/cilastatin-relebactam, có thể còn hoạt tính trên P. aeruginosa đa kháng tùy kháng sinh đồ.",
  16: "Đề kháng thuốc trong Mycobacterium tuberculosis thường gặp; cần thực hiện xét nghiệm tính nhạy cảm.",
  17: "Ciprofloxacin có hoạt tính chống Chlamydia kém hơn levofloxacin hoặc ofloxacin.",
};

/* =====================================================
   NHÓM VI SINH - GIỮ NGUYÊN TIẾNG ANH
===================================================== */

const GROUP_ORDER = [
  "Gram-Negative Cocci",
  "Gram-Positive Cocci",
  "Gram-Negative Rods",
  "Gram-Positive Rods",
  "Acid-Fast Rods",
  "Spirochetes",
  "Mycoplasmas",
  "Chlamydiae",
  "Rickettsiae",
];

/* =====================================================
   TÊN KHOA HỌC CẦN IN NGHIÊNG

   Chỉ in nghiêng thành phần tên chi / loài.
   Mô tả bệnh cảnh và nhóm không in nghiêng.
===================================================== */

const SCIENTIFIC_PARTS = [
  "Moraxella catarrhalis",
  "Neisseria gonorrhoeae",
  "Neisseria meningitidis",
  "Enterococcus faecalis",
  "Enterococcus faecium",
  "Staphylococcus",
  "Streptococcus pneumoniae",
  "Streptococcus",
  "Acinetobacter",
  "Bacteroides",
  "Brucella",
  "Burkholderia pseudomallei",
  "Burkholderia mallei",
  "Campylobacter jejuni",
  "Enterobacter",
  "Escherichia coli",
  "Haemophilus",
  "Helicobacter pylori",
  "Klebsiella",
  "Legionella",
  "Prevotella",
  "Proteus mirabilis",
  "Proteus vulgaris",
  "Morganella",
  "Providencia",
  "Pseudomonas aeruginosa",
  "Salmonella",
  "Serratia",
  "Shigella",
  "Vibrio",
  "Yersinia pestis",
  "Actinomyces",
  "Bacillus",
  "Clostridium",
  "Corynebacterium diphtheria",
  "Corynebacterium jeikeium",
  "Listeria",
  "Mycobacterium avium",
  "Mycobacterium fortuitum",
  "Mycobacterium kansasii",
  "Mycobacterium leprae",
  "Mycobacterium tuberculosis",
  "Nocardia",
  "Borrelia burgdorferi",
  "Borrelia recurrentis",
  "Leptospira",
  "Treponema pallidum",
  "Treponema pertenue",
  "C pneumoniae",
  "C psittaci",
  "C trachomatis",
];

/*
  Khớp phần tên dài trước, tránh in nghiêng
  lặp lại trên các tên ngắn cùng chi.
*/

const SORTED_SCIENTIFIC_PARTS = [
  ...SCIENTIFIC_PARTS,
].sort((a, b) => b.length - a.length);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SCIENTIFIC_REGEX = new RegExp(
  "(" +
    SORTED_SCIENTIFIC_PARTS
      .map(escapeRegExp)
      .join("|") +
  ")",
  "g"
);

/*
  Hiển thị đúng kiểu chữ:

  - Danh pháp khoa học: italic.
  - Mô tả: upright.
  - Tên nhóm: upright.
*/

function ScientificName({ name }: { name: string }) {
  const parts = name.split(SCIENTIFIC_REGEX);

  return (
    <>
      {parts.map((part, index) => {
        const isScientific =
          SCIENTIFIC_PARTS.includes(part);

        if (isScientific) {
          return <i key={index}>{part}</i>;
        }

        return (
          <span key={index}>{part}</span>
        );
      })}
    </>
  );
}

/* =====================================================
   CHUYỂN RAW DATA THÀNH OBJECT
===================================================== */

const ROWS: OrganismRow[] = RAW.trim()
  .split("\n")
  .map((line, index) => {
    const [
      group,
      agent,
      first,
      alternative,
      notes,
      page,
    ] = line.split("|");

    return {
      id: "organism-" + index,
      group: group.trim(),
      agent: agent.trim(),
      first: first.trim(),
      alternative: alternative.trim(),
      notes: notes
        ? notes.split(",").map(Number)
        : [],
      page: Number(page),
    };
  });

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function hasSpecialCondition(row: OrganismRow) {
  return /ONLY IF|FOLLOWED BY|±|\[13\]|\[14\]|\[15\]/i.test(
    row.first + " " + row.alternative
  );
}

/* =====================================================
   COMPONENT CHÍNH
===================================================== */

export default function OrganismPage() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] =
    useState("all");

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [expandedGroups, setExpandedGroups] =
    useState<string[]>(GROUP_ORDER);

  const [showAllNotes, setShowAllNotes] =
    useState(false);

  const filteredRows = useMemo(() => {
    const q = normalizeText(search);

    return ROWS.filter((row) => {
      const groupMatches =
        groupFilter === "all" ||
        row.group === groupFilter;

      const text = normalizeText(
        [
          row.group,
          row.agent,
          row.first,
          row.alternative,
        ].join(" ")
      );

      return groupMatches && text.includes(q);
    });
  }, [search, groupFilter]);

  const groupedRows = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      group,
      items: filteredRows.filter(
        (row) => row.group === group
      ),
    })).filter((item) => item.items.length > 0);
  }, [filteredRows]);

  const selected = ROWS.find(
    (row) => row.id === selectedId
  );

  const selectedVisible =
    selected &&
    filteredRows.some(
      (row) => row.id === selected.id
    )
      ? selected
      : null;

  function toggleGroup(name: string) {
    setExpandedGroups((previous) =>
      previous.includes(name)
        ? previous.filter((g) => g !== name)
        : [...previous, name]
    );
  }

  function resetFilters() {
    setSearch("");
    setGroupFilter("all");
    setSelectedId(null);
    setExpandedGroups(GROUP_ORDER);
  }

  return (
    <main className="org3-page">
      <div className="org3-container">

        {/* BREADCRUMB */}
        <nav className="org3-breadcrumb">
          <Link href="/">
            Trang chủ
          </Link>

          <ChevronRight size={14} />

          <Link href="/antibiotics">
            Kháng sinh & AMS
          </Link>

          <ChevronRight size={14} />

          <strong>Theo tác nhân</strong>
        </nav>

        {/* TITLE */}
        <div className="org3-heading">
          <div className="org3-heading-icon">
            <Microscope size={24} />
          </div>

          <div>
            <h1>
              Lựa chọn kháng sinh theo tác nhân
            </h1>

            <p>
              Current Medical Diagnosis & Treatment
              2026 · Table 35–5
            </p>
          </div>
        </div>

        {/* SOURCE NOTICE */}
        <div className="org3-notice">
          <Info size={17} />

          <span>
            Tra cứu theo tác nhân gây bệnh.
            Cần đối chiếu vị trí nhiễm khuẩn,
            AST/MIC, mức độ đề kháng và hướng
            dẫn hiện hành trước khi lựa chọn thuốc.
          </span>
        </div>

        {/* MAIN LAYOUT */}
        <div className="org3-layout">

          {/* LEFT PANEL */}
          <aside className="org3-sidebar">

            <div className="org3-sidebar-header">
              <div>
                <strong>
                  Danh mục tác nhân
                </strong>

                <small>
                  {filteredRows.length} / {ROWS.length} mục
                </small>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                title="Đặt lại"
                aria-label="Đặt lại"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* SEARCH */}
            <div className="org3-filters">

              <div className="org3-search">
                <Search size={17} />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Tìm tác nhân hoặc kháng sinh..."
                  aria-label="Tìm kiếm"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <select
                value={groupFilter}
                onChange={(e) => {
                  setGroupFilter(e.target.value);
                  setExpandedGroups(GROUP_ORDER);
                }}
                aria-label="Lọc nhóm vi sinh"
              >
                <option value="all">
                  All groups
                </option>

                {GROUP_ORDER.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* GROUPED ORGANISMS */}
            <div className="org3-organism-list">
              {groupedRows.map((section) => {
                const opened = expandedGroups.includes(
                  section.group
                );

                return (
                  <div
                    key={section.group}
                    className="org3-group"
                  >
                    <button
                      type="button"
                      className="org3-group-title"
                      onClick={() =>
                        toggleGroup(section.group)
                      }
                    >
                      <span>
                        {section.group}
                      </span>

                      <small>
                        {section.items.length}
                      </small>

                      {opened ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>

                    {opened && (
                      <div className="org3-group-items">
                        {section.items.map((row) => (
                          <button
                            type="button"
                            key={row.id}
                            className={
                              "org3-organism " +
                              (selectedVisible?.id ===
                              row.id
                                ? "active"
                                : "")
                            }
                            onClick={() =>
                              setSelectedId(row.id)
                            }
                          >
                            <span>
                              <ScientificName
                                name={row.agent}
                              />
                            </span>

                            <ChevronRight size={14} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredRows.length === 0 && (
                <p className="org3-empty">
                  Không tìm thấy tác nhân phù hợp.
                </p>
              )}
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="org3-detail">

            {selectedVisible ? (
              <>
                <div className="org3-detail-header">
                  <div>
                    <small>
                      {selectedVisible.group}
                      {" · "}PDF page{" "}
                      {selectedVisible.page}
                    </small>

                    <h2>
                      <ScientificName
                        name={selectedVisible.agent}
                      />
                    </h2>
                  </div>

                  <span className="org3-table-ref">
                    Table 35–5
                  </span>
                </div>

                {/* FIRST AND ALTERNATIVE */}
                <div className="org3-treatment-grid">

                  <article className="org3-treatment first">
                    <h3>
                      First Choice
                      <small>
                        Thuốc lựa chọn đầu tiên
                      </small>
                    </h3>

                    <p>
                      {selectedVisible.first}
                    </p>
                  </article>

                  <article className="org3-treatment">
                    <h3>
                      Alternatives
                      <small>
                        Thuốc thay thế
                      </small>
                    </h3>

                    <p>
                      {selectedVisible.alternative}
                    </p>
                  </article>
                </div>

                {hasSpecialCondition(
                  selectedVisible
                ) && (
                  <div className="org3-alert">
                    <AlertTriangle size={17} />

                    <span>
                      Lựa chọn này có điều kiện
                      liên quan phối hợp thuốc,
                      tính nhạy cảm hoặc kiểu hình
                      đề kháng. Cần đối chiếu chú
                      thích và kết quả vi sinh.
                    </span>
                  </div>
                )}

                {/* FOOTNOTES */}
                {selectedVisible.notes.length > 0 && (
                  <div className="org3-notes">
                    <h3>
                      Chú thích liên quan
                    </h3>

                    {[
                      ...new Set(selectedVisible.notes),
                    ].map((n) => (
                      <div
                        key={n}
                        className="org3-note-item"
                      >
                        <span>{n}</span>

                        <p>
                          {FOOTNOTES[n]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* SYMBOL LEGEND */}
                <details className="org3-legend">
                  <summary>
                    Giải thích ký hiệu
                  </summary>

                  <p>
                    <b>OR</b>: hoặc.
                    {" · "}
                    <b>+</b>: phối hợp.
                    {" · "}
                    <b>±</b>: có thể phối hợp
                    tùy điều kiện.
                    {" · "}
                    <b>FOLLOWED BY</b>:
                    dùng theo trình tự điều trị.
                    {" · "}
                    <b>;</b>: phân cách các lựa chọn.
                  </p>
                </details>

                {/* SOURCE */}
                <div className="org3-source">
                  <BookOpen size={16} />

                  <span>
                    CMDT 2026 · Chapter 35 ·
                    Table 35–5
                  </span>

                  <a
                    href="https://accessmedicine.mhmedical.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AccessMedicine
                    <ExternalLink size={14} />
                  </a>
                </div>
              </>
            ) : (
              <div className="org3-placeholder">
                <Microscope size={38} />

                <h2>
                  Chọn tác nhân gây bệnh
                </h2>

                <p>
                  Danh sách bên trái giữ nguyên
                  danh pháp khoa học.
                  Chọn một tác nhân để xem
                  thuốc ưu tiên, thuốc thay thế
                  và chú thích tương ứng.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ALL FOOTNOTES */}
        <section className="org3-allnotes">
          <button
            type="button"
            onClick={() =>
              setShowAllNotes(!showAllNotes)
            }
          >
            <BookOpen size={16} />

            {showAllNotes ? "Ẩn" : "Xem"}
            {" "}toàn bộ 17 chú thích

            <ChevronDown size={15} />
          </button>

          {showAllNotes && (
            <div className="org3-notes-grid">
              {Object.entries(FOOTNOTES).map(
                ([n, text]) => (
                  <div key={n}>
                    <strong>[{n}]</strong>
                    <p>{text}</p>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <p className="org3-footer-note">
          Nguồn: Current Medical Diagnosis &
          Treatment 2026, Table 35–5.
          Nội dung tra cứu chuyên môn,
          chưa phải phác đồ điều trị
          đã được Bệnh viện 199 phê duyệt.
        </p>
      </div>

      {/* =================================================
         CSS TOÀN BỘ
      ================================================= */}
      <style>{`
        .org3-page {
          min-height: 100vh;
          padding: 20px 22px 30px;
          background: #f7f9fc;
          color: #10223e;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px;
        }

        .org3-container {
          max-width: 1450px;
          margin: 0 auto;
        }

        .org3-breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 22px;
          color: #6d8299;
          font-size: 12px;
        }

        .org3-breadcrumb a {
          color: #075985;
          text-decoration: none;
        }

        .org3-breadcrumb strong {
          color: #10223e;
        }

        .org3-heading {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 15px;
        }

        .org3-heading-icon {
          width: 48px;
          height: 48px;
          flex: none;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #e0f0ff;
          color: #075985;
        }

        .org3-heading h1 {
          margin: 0 0 7px;
          font-size: 24px;
          line-height: 1.25;
          font-weight: 750;
          color: #10223e;
        }

        .org3-heading p {
          margin: 0;
          color: #72859d;
          font-size: 12px;
        }

        .org3-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          margin-bottom: 15px;
          background: #edf6ff;
          border: 1px solid #d6e7f8;
          border-radius: 9px;
          color: #426887;
          font-size: 12px;
          line-height: 1.65;
        }

        .org3-notice svg {
          flex: none;
        }

        /* MAIN LAYOUT */
        .org3-layout {
          display: grid;
          grid-template-columns:
            minmax(265px, 33%)
            minmax(0, 1fr);
          gap: 15px;
          align-items: start;
        }

        .org3-sidebar,
        .org3-detail,
        .org3-allnotes {
          background: #ffffff;
          border: 1px solid #dde7f0;
          border-radius: 12px;
          overflow: hidden;
        }

        /* SIDEBAR */
        .org3-sidebar {
          position: sticky;
          top: 12px;
        }

        .org3-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 15px 15px 9px;
        }

        .org3-sidebar-header > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .org3-sidebar-header strong {
          font-size: 14px;
          color: #16314c;
        }

        .org3-sidebar-header small {
          font-size: 11px;
          color: #72849a;
        }

        .org3-sidebar-header button {
          background: transparent;
          border: 0;
          color: #6883a0;
          cursor: pointer;
        }

        /* SEARCH */
        .org3-filters {
          display: grid;
          gap: 9px;
          padding: 8px 13px 13px;
          border-bottom: 1px solid #e7edf4;
        }

        .org3-search {
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #ccdaea;
          border-radius: 9px;
          padding: 0 12px;
          color: #6f8aa6;
        }

        .org3-search input {
          flex: 1;
          min-width: 0;
          height: 42px;
          border: 0;
          outline: 0;
          background: transparent;
          color: #10223e;
          font-size: 12px;
        }

        .org3-search button {
          border: 0;
          background: transparent;
          color: #71859c;
          cursor: pointer;
        }

        .org3-filters select {
          width: 100%;
          height: 40px;
          border: 1px solid #d1dfeb;
          border-radius: 9px;
          padding: 0 11px;
          background: #fff;
          color: #28465f;
          font-size: 12px;
        }

        /* GROUP LIST */
        .org3-organism-list {
          max-height: calc(100vh - 300px);
          min-height: 250px;
          overflow-y: auto;
          padding: 7px 8px 12px;
        }

        .org3-group {
          margin-bottom: 5px;
        }

        .org3-group-title {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px 11px;
          border: 0;
          border-radius: 8px;
          background: #f2f6fa;
          color: #315875;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .org3-group-title > span {
          flex: 1;
        }

        .org3-group-title small {
          padding: 3px 7px;
          border-radius: 7px;
          background: #e3edf5;
          color: #476780;
          font-size: 10px;
        }

        .org3-group-items {
          padding: 4px 0;
        }

        /* SCIENTIFIC NAMES */
        .org3-organism {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 11px 12px 11px 18px;
          border: 0;
          border-left: 3px solid transparent;
          background: #ffffff;
          color: #263c54;
          text-align: left;
          cursor: pointer;
          font-size: 13px;
          font-style: normal;
          line-height: 1.5;
        }

        .org3-organism > span {
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .org3-organism i,
        .org3-detail h2 i {
          font-style: italic;
          font-weight: inherit;
        }

        .org3-organism svg {
          flex: none;
          color: #a9bbca;
        }

        .org3-organism:hover {
          background: #f5f9fd;
        }

        .org3-organism.active {
          background: #e9f5ff;
          border-left-color: #0875ae;
          color: #075985;
          font-weight: 700;
        }

        .org3-empty {
          padding: 18px;
          color: #72869d;
          font-size: 12px;
        }

        /* DETAIL PANEL */
        .org3-detail {
          min-height: 430px;
          padding: 23px;
        }

        .org3-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding-bottom: 17px;
          margin-bottom: 17px;
          border-bottom: 1px solid #e7edf3;
        }

        .org3-detail-header small {
          font-size: 11px;
          color: #6b8299;
        }

        .org3-detail-header h2 {
          margin: 9px 0 0;
          font-size: 22px;
          line-height: 1.4;
          font-weight: 650;
          overflow-wrap: anywhere;
        }

        .org3-table-ref {
          flex: none;
          border: 1px solid #d5e5f3;
          background: #f3f9ff;
          color: #376787;
          border-radius: 7px;
          padding: 7px 9px;
          font-size: 11px;
        }

        /* FIRST CHOICE / ALTERNATIVE */
        .org3-treatment-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .org3-treatment {
          border: 1px solid #dce6f0;
          background: #fcfdff;
          border-radius: 11px;
          padding: 16px;
          min-width: 0;
        }

        .org3-treatment.first {
          background: #f5fbff;
          border-color: #c6e1f5;
        }

        .org3-treatment h3 {
          margin: 0 0 13px;
          color: #075985;
          font-size: 14px;
          font-weight: 700;
        }

        .org3-treatment h3 small {
          display: block;
          margin-top: 5px;
          color: #6a829b;
          font-size: 11px;
          font-weight: 400;
        }

        .org3-treatment p {
          margin: 0;
          color: #243a52;
          font-size: 14px;
          line-height: 1.9;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        /* CLINICAL NOTICE */
        .org3-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 15px;
          padding: 13px 14px;
          border: 1px solid #efdbb8;
          background: #fff9ef;
          border-radius: 9px;
          color: #80552b;
          font-size: 12px;
          line-height: 1.75;
        }

        .org3-alert svg {
          flex: none;
        }

        /* NOTES */
        .org3-notes {
          margin-top: 22px;
        }

        .org3-notes h3 {
          font-size: 14px;
          margin: 0 0 13px;
          color: #173651;
        }

        .org3-note-item {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding: 12px 0;
          border-top: 1px solid #edf1f5;
        }

        .org3-note-item > span {
          flex: none;
          min-width: 27px;
          height: 26px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #edf5fc;
          color: #075985;
          font-size: 11px;
          font-weight: 700;
        }

        .org3-note-item p {
          margin: 0;
          color: #526c84;
          font-size: 12px;
          line-height: 1.8;
        }

        /* SYMBOLS */
        .org3-legend {
          margin-top: 18px;
          padding-top: 15px;
          border-top: 1px solid #e7edf3;
          color: #567189;
        }

        .org3-legend summary {
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .org3-legend p {
          font-size: 12px;
          line-height: 1.8;
        }

        /* SOURCE */
        .org3-source {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 20px;
          color: #6b859e;
          font-size: 11px;
        }

        .org3-source a {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-left: auto;
          color: #075985;
          font-weight: 700;
          text-decoration: none;
        }

        /* EMPTY DETAIL */
        .org3-placeholder {
          min-height: 370px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #0875ae;
        }

        .org3-placeholder h2 {
          font-size: 18px;
          margin: 15px 0 8px;
          color: #173651;
        }

        .org3-placeholder p {
          max-width: 400px;
          color: #72869d;
          font-size: 12px;
          line-height: 1.8;
        }

        /* ALL NOTES */
        .org3-allnotes {
          margin-top: 16px;
          padding: 15px;
        }

        .org3-allnotes > button {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 13px;
          border: 1px solid #d8e6f2;
          border-radius: 9px;
          background: #f1f8ff;
          color: #075985;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .org3-notes-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 13px;
          margin-top: 15px;
        }

        .org3-notes-grid > div {
          padding: 14px;
          border: 1px solid #e5ecf3;
          border-radius: 9px;
        }

        .org3-notes-grid strong {
          color: #075985;
          font-size: 12px;
        }

        .org3-notes-grid p {
          margin: 6px 0 0;
          color: #587188;
          font-size: 12px;
          line-height: 1.8;
        }

        .org3-footer-note {
          margin: 17px 0 0;
          color: #74889d;
          font-size: 11px;
          line-height: 1.8;
        }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .org3-layout {
            grid-template-columns:
              minmax(245px, 37%)
              minmax(0, 1fr);
          }

          .org3-treatment-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .org3-page {
            padding: 13px;
          }

          .org3-layout {
            grid-template-columns: 1fr;
          }

          .org3-sidebar {
            position: static;
          }

          .org3-organism-list {
            max-height: 300px;
          }

          .org3-detail {
            padding: 15px;
            min-height: 320px;
          }

          .org3-detail-header h2 {
            font-size: 19px;
          }

          .org3-heading h1 {
            font-size: 20px;
          }

          .org3-notes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
