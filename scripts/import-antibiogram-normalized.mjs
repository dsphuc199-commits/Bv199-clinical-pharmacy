/*
  Nhap goi du lieu vi sinh da chuan hoa (BV199, 04/2025 – 03/2026) vao web app.

  Cach chay:
    node scripts/import-antibiogram-normalized.mjs <workbook.xlsx>
    node scripts/import-antibiogram-normalized.mjs <thu-muc-goi-du-lieu> [workbook.xlsx]
  Thu muc can co: isolates.csv, ast_results.csv, ref_intrinsic_resistance.csv,
  antibiogram_long.csv (doi chieu S/I/R). Tham so thu 2 (tuy chon): file workbook .xlsx
  de doi chieu tung o cua bang khang sinh do tich luy.

  Quy tac (CLSI M39):
  - Chi tinh phan lap dau tien cua moi loai o moi nguoi benh (first_isolate = Y).
  - %S = S / (S + I + R); I tinh la khong nhay.
  - n < 30 danh dau lowN.

  Rieng tu: chi ghi so lieu tong hop. Khong dua isolates.csv, ast_results.csv,
  ma nguoi benh, ma benh pham hay STT goc vao kho ma (kho ma cong khai).
*/

import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2] ?? process.env.ANTIBIOGRAM_SRC;
if (!SRC) {
  console.error("Thieu duong dan workbook hoac thu muc goi du lieu.");
  process.exit(1);
}
const OUT = path.resolve("data/antibiotics/antibiogram-bv199.json");
const sourceIsWorkbook = /\.xlsx$/i.test(SRC);
const XLSX_PATH = process.argv[3] ?? process.env.ANTIBIOGRAM_XLSX ?? (sourceIsWorkbook ? SRC : undefined);
const XLSX = sourceIsWorkbook || XLSX_PATH ? (await import("xlsx")).default : null;
const workbook = sourceIsWorkbook ? XLSX.readFile(SRC) : null;

function readRows(name, sheetName) {
  if (workbook) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) throw new Error(`Workbook thieu bang ${sheetName}.`);
    return XLSX.utils.sheet_to_json(sheet, { defval: "" }).map((row) => Object.fromEntries(
      Object.entries(row).map(([column, value]) => [column, String(value).trim()])
    ));
  }
  const text = fs.readFileSync(path.join(SRC, name), "utf8").replace(/^﻿/, "");
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  const head = lines[0].split(",");
  return lines.slice(1).map((line) => {
    if (line.includes("\"")) throw new Error(`${name}: dong co dau ngoac kep, can bo phan tich CSV day du`);
    const cells = line.split(",");
    return Object.fromEntries(head.map((h, i) => [h, (cells[i] ?? "").trim()]));
  });
}

/* Ma kháng sinh trong goi du lieu -> ma/ten dang dung trong web app. */
const ANTIBIOTICS = {
  PEN: ["penicillin", "Penicillin"],
  AMP: ["ampicillin", "Ampicillin"],
  AMC: ["amoxicillin-clavulanate", "Amoxicillin/clavulanate"],
  SAM: ["ampicillin-sulbactam", "Ampicillin/sulbactam"],
  TZP: ["piperacillin-tazobactam", "Piperacillin/tazobactam"],
  KZ: ["cefazolin", "Cefazolin"],
  CXM: ["cefuroxime", "Cefuroxime"],
  FOX: ["cefoxitin", "Cefoxitin"],
  CTX: ["cefotaxime", "Cefotaxime"],
  CRO: ["ceftriaxone", "Ceftriaxone"],
  CAZ: ["ceftazidime", "Ceftazidime"],
  FEP: ["cefepime", "Cefepime"],
  IMP: ["imipenem", "Imipenem"],
  MEM: ["meropenem", "Meropenem"],
  "CN/GEN": ["gentamicin", "Gentamicin"],
  TOB: ["tobramycin", "Tobramycin"],
  AMK: ["amikacin", "Amikacin"],
  CIP: ["ciprofloxacin", "Ciprofloxacin"],
  LVX: ["levofloxacin", "Levofloxacin"],
  SXT: ["trimethoprim-sulfamethoxazole", "Trimethoprim/sulfamethoxazole"],
  TCY: ["tetracycline", "Tetracycline"],
  DOX: ["doxycycline", "Doxycycline"],
  ERY: ["erythromycin", "Erythromycin"],
  CLI: ["clindamycin", "Clindamycin"],
  VAN: ["vancomycin", "Vancomycin"],
  LZD: ["linezolid", "Linezolid"],
};

const ORGANISM_ID_OVERRIDE = {
  "Enterobacterales (chưa định danh loài)": "enterobacterales",
};
const slug = (s) =>
  ORGANISM_ID_OVERRIDE[s] ??
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase()
    .replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const SOURCE_SCOPES = ["Toàn viện", "HSCC", "Khối nội", "Khối ngoại"];
const C9_LABEL = "Khoa Vật lý trị liệu – Phục hồi chức năng (C9)";
const SCOPES = [...SOURCE_SCOPES, C9_LABEL];
const DEPARTMENT_NOTE = "Mã A thuộc Khối Nội và mã B thuộc Khối Ngoại. A7 được tính trong Khối Nội và có bảng HSCC riêng để tra cứu. C9 là Khoa Vật lý trị liệu – Phục hồi chức năng.";
const wardOf = (iso) => iso.khoa.trim().toUpperCase();
function divisionOf(iso) {
  const ward = wardOf(iso);
  if (/^A\d+$/.test(ward)) return "Khối nội";
  if (/^B\d+$/.test(ward)) return "Khối ngoại";
  if (ward === "C9") return C9_LABEL;
  return iso.nhom_khoa;
}
function scopesOf(iso) {
  const division = divisionOf(iso);
  const scopes = ["Toàn viện", division];
  if (wardOf(iso) === "A7") scopes.push("HSCC");
  return scopes;
}
const ALL_SPECIMENS = "Tất cả";
/* Lam tron 1 chu so thap phan kieu ROUND cua Excel (diem giua lam tron len: 27/48 = 56,3),
   trung bang khang sinh do trong workbook. */
const pct = (a, b) => {
  if (!b) return 0;
  const num = a * 1000;
  let q = Math.floor(num / b);
  if (2 * (num - q * b) >= b) q += 1;
  return q / 10;
};

const isolatesAll = readRows("isolates.csv", "DATA_PHAN_LAP");
const isolates = isolatesAll.filter((r) => r.first_isolate === "Y");
const ast = readRows("ast_results.csv", "AST_LONG");
const intrinsic = new Set(
  readRows("ref_intrinsic_resistance.csv", "DM_KHANG_TU_NHIEN").map((r) => `${r.nhom_bao_cao}|${r.ma_khang_sinh}`)
);

for (const r of isolatesAll) {
  if (!SCOPES.includes(r.nhom_khoa)) throw new Error(`Nhom khoa la: ${r.nhom_khoa} (${r.isolate_id})`);
}
const byIsolate = new Map(isolates.map((r) => [r.isolate_id, r]));
const unknownCodes = new Set(ast.map((r) => r.ma_khang_sinh).filter((c) => !ANTIBIOTICS[c]));
if (unknownCodes.size) throw new Error(`Ma khang sinh chua anh xa: ${[...unknownCodes].join(", ")}`);

/* Gom S/I/R theo pham vi x benh pham x loai x khang sinh. */
const cells = new Map();
const add = (key, base, result) => {
  if (!cells.has(key)) cells.set(key, { ...base, S: 0, I: 0, R: 0 });
  cells.get(key)[result] += 1;
};
for (const row of ast) {
  const iso = byIsolate.get(row.isolate_id);
  if (!iso) continue;
  if (!["S", "I", "R"].includes(row.ket_qua)) throw new Error(`Ket qua la: ${row.ket_qua}`);
  const [antibioticId, antibioticName] = ANTIBIOTICS[row.ma_khang_sinh];
  for (const department of scopesOf(iso)) {
    for (const specimen of [ALL_SPECIMENS, iso.nhom_benh_pham]) {
      const base = {
        department, specimen,
        organismId: slug(iso.loai_chuan), organismName: iso.loai_chuan, group: iso.nhom_bao_cao,
        code: row.ma_khang_sinh, antibioticId, antibioticName,
      };
      add(`${department}__${specimen}__${base.organismId}__${antibioticId}`, base, row.ket_qua);
    }
  }
}

/* =========================================================
   QUY TAC DIEN GIAI CLSI M100 (khoang giay khuech tan)
   Chi ap len phan hien thi; so S/I/R goc va doi chieu Excel giu nguyen.
   - nobp: khong co diem gay CLSI cho cap vi khuan – khang sinh -> khong hien %S.
   - note: van hien %S nhung kem chu thich bat buoc.
   Nguon: Schuetz AN et al. J Clin Microbiol 2025;63(9):e01623-23 (M100 Ed32–33);
   tom tat thay doi M100 Ed36 (2026) cho Acinetobacter.
========================================================= */
const CLSI_RULES = [
  { group: "Pseudomonas aeruginosa", code: "CN/GEN", kind: "nobp", mark: "†",
    text: "CLSI M100 bỏ điểm gãy gentamicin cho P. aeruginosa từ ấn bản 33; không diễn giải, không dùng điều trị." },
  { group: "Acinetobacter baumannii", code: "CXM", kind: "nobp", mark: "†",
    text: "CLSI M100 không có điểm gãy cefuroxim cho Acinetobacter." },
  { group: "Acinetobacter baumannii", code: "FOX", kind: "nobp", mark: "†",
    text: "CLSI M100 không có điểm gãy cefoxitin cho Acinetobacter." },
  { group: "Acinetobacter baumannii", code: "TCY", kind: "nobp", mark: "†",
    text: "CLSI M100 ấn bản 36 (2026) bỏ điểm gãy tetracyclin cho Acinetobacter." },
  { group: "Streptococcus spp.", code: "FOX", kind: "nobp", mark: "†",
    text: "CLSI M100 không có điểm gãy cefoxitin cho Streptococcus." },
  { group: "Pseudomonas aeruginosa", code: "AMK", kind: "note", mark: "u",
    text: "Điểm gãy amikacin cho P. aeruginosa chỉ áp dụng cho chủng phân lập từ nước tiểu (CLSI M100 từ ấn bản 33)." },
  { group: "Proteus mirabilis", code: "IMP", kind: "note", mark: "p",
    text: "P. mirabilis thường có MIC imipenem tăng do cơ chế không phải carbapenemase; đánh giá nhóm carbapenem theo meropenem." },
  { group: "Streptococcus spp.", code: "PEN", kind: "note", mark: "s",
    text: "Nhóm gộp phế cầu, liên cầu tan huyết beta và viridans. Với phế cầu, khoanh giấy chỉ dùng oxacillin 1 µg để sàng lọc; vùng ức chế ≤19 mm cần làm MIC penicillin." },
];
const clsiRule = (group, code) => CLSI_RULES.find((r) => r.group === group && r.code === code);

const records = [...cells.values()].map((c) => {
  const n = c.S + c.I + c.R;
  const rec = {
    id: `${c.department}__${c.specimen}__${c.organismId}__${c.antibioticId}`,
    department: c.department,
    specimen: c.specimen,
    organismId: c.organismId,
    organismName: c.organismName,
    organismGroup: c.group,
    antibioticId: c.antibioticId,
    antibioticName: c.antibioticName,
    n, sCount: c.S, iCount: c.I, rCount: c.R,
    susceptiblePercent: pct(c.S, n),
    increasedExposurePercent: pct(c.I, n),
    resistantPercent: pct(c.R, n),
    lowN: n < 30,
  };
  if (intrinsic.has(`${c.group}|${c.code}`)) rec.intrinsicResistance = true;
  const rule = clsiRule(c.group, c.code);
  if (rule) {
    rec.clsiNote = rule.text;
    if (rule.kind === "nobp") rec.noBreakpoint = true;
  }
  return rec;
}).sort((a, b) => a.id.localeCompare(b.id, "vi"));

/* Doi chieu S/I/R theo phan nhom cua workbook goc, truoc khi ap dung danh muc khoa BV199. */
const groupSum = new Map();
for (const row of ast) {
  const iso = byIsolate.get(row.isolate_id);
  if (!iso) continue;
  for (const scope of ["Toàn viện", iso.nhom_khoa]) {
    const key = `${scope}|${iso.nhom_bao_cao}|${row.ma_khang_sinh}`;
    const v = groupSum.get(key) ?? { S: 0, I: 0, R: 0 };
    v[row.ket_qua] += 1;
    groupSum.set(key, v);
  }
}
/* So S/I/R phai trung tung dong; %S duoc doi chieu tung o voi workbook Excel o phan bang ben duoi. */
const reference = readRows("antibiogram_long.csv", "AB_LONG");
const mismatches = [];
for (const r of reference) {
  const key = `${r.pham_vi}|${r.nhom_bao_cao}|${r.ma_khang_sinh}`;
  const v = groupSum.get(key) ?? { S: 0, I: 0, R: 0 };
  if (v.S !== Number(r.n_S) || v.I !== Number(r.n_I) || v.R !== Number(r.n_R)) {
    mismatches.push(`${r.pham_vi} | ${r.nhom_bao_cao} | ${r.ma_khang_sinh}: tinh lai ${v.S}/${v.I}/${v.R}, goi ${r.n_S}/${r.n_I}/${r.n_R}`);
  }
}
if (mismatches.length || groupSum.size !== reference.length) {
  console.error(`Lech so lieu (${mismatches.length}; nhom tinh lai ${groupSum.size}, goi ${reference.length}):\n` + mismatches.slice(0, 20).join("\n"));
  process.exit(1);
}

const organisms = [...new Map(records.map((r) => [r.organismId, { id: r.organismId, name: r.organismName, group: r.organismGroup }])).values()]
  .sort((a, b) => a.name.localeCompare(b.name, "vi"));
const specimens = [ALL_SPECIMENS, ...[...new Set(isolates.map((r) => r.nhom_benh_pham))].sort((a, b) => a.localeCompare(b, "vi"))];

const database = {
  metadata: {
    hospital: "Bệnh viện 199 – Bộ Công an",
    source: "Kết quả kháng sinh đồ từ tháng 04/2025 đến hết tháng 03/2026, đã chuẩn hóa tên vi khuẩn, nhóm khoa và nhóm bệnh phẩm.",
    period: { id: "2025-04_2026-03", label: "04/2025 – 03/2026" },
    method: "Kháng sinh đồ bằng khoanh giấy khuếch tán, diễn giải theo CLSI M100. Tổng hợp theo CLSI M39: chỉ tính phân lập đầu tiên của mỗi loài ở mỗi người bệnh; %S = S/(S+I+R), I tính là không nhạy.",
    breakpointNote: "Từ CLSI M100 ấn bản 33, vùng ức chế aminoglycosid cho Enterobacterales tăng: amikacin 30 µg S ≥20, I 17–19, R ≤16 mm; gentamicin 10 µg S ≥18, I 15–17, R ≤14 mm. Khoảng I rộng hơn làm tăng tỷ lệ I của amikacin; mức I của aminoglycosid có ý nghĩa khi thuốc cô đặc trong nước tiểu.",
    status: "Chưa thẩm định cho hỗ trợ quyết định lâm sàng.",
    departmentNote: DEPARTMENT_NOTE,
    intrinsicNote: "Kháng tự nhiên chưa đối chiếu với CLSI M100 và EUCAST Expected Resistant Phenotypes.",
    isolateCount: isolates.length,
    rawIsolateCount: isolatesAll.length,
    minN: 30,
    departments: SCOPES,
    specimens,
    organisms,
    privacy: "Dữ liệu web chỉ gồm số liệu tổng hợp, không chứa họ tên, mã người bệnh hay mã bệnh phẩm.",
  },
  records,
};

/* =========================================================
   BANG KHANG SINH DO TICH LUY (cung mau workbook Excel)
   Quy tac giong cong thuc trong workbook:
   - R neu khang tu nhien; "-" neu khong co phan lap duoc thu;
   - %S = ROUND(S/thu*100, 1) (lam tron kieu Excel), them "*" neu so thu < 70% N;
   - N them "ᵃ" neu < 30; cefoxitin o tu cau them "b";
   - To xanh: %S >= 60, N >= 30, so thu >= 70% N.
========================================================= */
const OUT_TABLES = path.resolve("data/antibiotics/antibiogram-bv199-tables.json");
const MIN_N = 30, MIN_TESTED = 0.7, GREEN = 60;
const GRAM_NEG = {
  groups: ["Escherichia coli", "Klebsiella pneumoniae", "Enterobacter spp. (gồm K. aerogenes)", "Proteus mirabilis", "Pseudomonas aeruginosa", "Acinetobacter baumannii", "Trực khuẩn Gram âm khác"],
  codes: ["AMP", "AMC", "SAM", "TZP", "KZ", "CXM", "FOX", "CTX", "CRO", "CAZ", "FEP", "IMP", "MEM", "CN/GEN", "TOB", "AMK", "CIP", "LVX", "SXT", "TCY"],
};
const GRAM_POS = {
  groups: ["Staphylococcus aureus", "Staphylococcus coagulase âm (CoNS)", "Enterococcus spp.", "Streptococcus spp."],
  codes: ["PEN", "AMP", "FOX", "CTX", "CIP", "LVX", "SXT", "TCY", "DOX", "ERY", "CLI", "VAN", "LZD"],
};
const STAPH = new Set(["Staphylococcus aureus", "Staphylococcus coagulase âm (CoNS)"]);
const abName = Object.fromEntries(readRows("ref_antibiotics.csv", "DM_KHANG_SINH").map((r) => [r.ma_khang_sinh, r.ten_en]));
const excelRound1 = (a, b) => {
  const num = a * 1000;
  let q = Math.floor(num / b);
  if (2 * (num - q * b) >= b) q += 1;
  return q / 10;
};
const astByIsolate = new Map();
for (const row of ast) {
  if (!astByIsolate.has(row.isolate_id)) astByIsolate.set(row.isolate_id, []);
  astByIsolate.get(row.isolate_id).push(row);
}

function buildPanel(subset, panel, scopeN, applyClsi) {
  const rows = [];
  for (const group of panel.groups) {
    const isos = subset.filter((i) => i.nhom_bao_cao === group);
    if (!isos.length) continue;
    const N = isos.length;
    const cells = panel.codes.map((code) => {
      if (intrinsic.has(`${group}|${code}`)) return { t: "R" };
      const rule = applyClsi ? clsiRule(group, code) : undefined;
      let s = 0, tested = 0;
      for (const iso of isos) {
        for (const r of astByIsolate.get(iso.isolate_id) ?? []) {
          if (r.ma_khang_sinh !== code) continue;
          tested += 1;
          if (r.ket_qua === "S") s += 1;
        }
      }
      if (!tested) return { t: "-" };
      if (rule?.kind === "nobp") return { t: "-", k: rule.mark, c: rule.text };
      const p = excelRound1(s, tested);
      const lowTested = tested < MIN_TESTED * N;
      const text = `${p}${lowTested ? "*" : ""}${code === "FOX" && STAPH.has(group) ? "b" : ""}`;
      const cell = { t: text, s, n: tested };
      if (rule) { cell.k = rule.mark; cell.c = rule.text; }
      if (p >= GREEN && N >= MIN_N && !lowTested) cell.g = 1;
      return cell;
    });
    rows.push({ group, n: N, nText: `${N}${N < MIN_N ? "ᵃ" : ""}`, share: excelRound1(N, scopeN), cells });
  }
  return { columns: panel.codes.map((code) => ({ code, name: abName[code] })), rows };
}

const SCOPE_LABEL = { "Toàn viện": "TOÀN VIỆN", HSCC: "HSCC", "Khối nội": "KHỐI NỘI", "Khối ngoại": "KHỐI NGOẠI" };
function buildTables(sourceLayout = false) {
  const groupOf = sourceLayout ? (iso) => iso.nhom_khoa : divisionOf;
  const groups = sourceLayout ? SOURCE_SCOPES : SCOPES;
  const list = SOURCE_SCOPES.map((scope) => {
    const subset = sourceLayout
      ? (scope === "Toàn viện" ? isolates : isolates.filter((iso) => groupOf(iso) === scope))
      : isolates.filter((iso) => scopesOf(iso).includes(scope));
    return { id: slug(scope), kind: "scope", label: scope, heading: SCOPE_LABEL[scope], n: subset.length, subset };
  });
  const byWard = new Map();
  for (const iso of isolates) {
    const ward = wardOf(iso);
    if (!byWard.has(ward)) byWard.set(ward, []);
    byWard.get(ward).push(iso);
  }
  for (const [ward, subset] of [...byWard].sort(([a, as], [b, bs]) =>
    groups.indexOf(groupOf(as[0])) - groups.indexOf(groupOf(bs[0])) || a.localeCompare(b, "vi")
  )) {
    const label = !sourceLayout && ward === "C9" ? C9_LABEL : `Khoa ${ward}`;
    const group = !sourceLayout && ward === "C9" ? undefined : groupOf(subset[0]);
    list.push({ id: `khoa-${slug(ward)}`, kind: "ward", label, heading: label.toUpperCase(), group, n: subset.length, subset });
  }
  return list.map(({ subset, ...t }) => ({
    ...t,
    title: `BẢNG KHÁNG SINH ĐỒ TÍCH LŨY CHO CÁC VI KHUẨN PHÂN LẬP – BỆNH VIỆN 199 – ${t.heading} (n=${t.n})`,
    gramNegative: buildPanel(subset, GRAM_NEG, t.n, !sourceLayout),
    gramPositive: buildPanel(subset, GRAM_POS, t.n, !sourceLayout),
  }));
}
const tables = buildTables();

/* Doi chieu tung o voi workbook Excel (neu co duong dan file .xlsx o tham so thu 2). */
if (XLSX_PATH) {
  const sourceTables = buildTables(true);
  const wb = workbook && XLSX_PATH === SRC ? workbook : XLSX.readFile(XLSX_PATH);
  const sheetRows = (n) => XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: "" });
  const blocks = [];
  for (const [sheet] of [["BANG_TOAN_VIEN"], ["BANG_HSCC"], ["BANG_KHOI_NOI"], ["BANG_KHOI_NGOAI"], ["BANG_THEO_KHOA"]]) {
    let cur = null;
    for (const row of sheetRows(sheet)) {
      const a = String(row[0]);
      if (a.startsWith("BẢNG KHÁNG SINH ĐỒ")) { cur = { title: a, rows: [] }; blocks.push(cur); continue; }
      if (cur) cur.rows.push(row.map((c) => String(c)));
    }
  }
  const diff = [];
  let compared = 0;
  if (blocks.length !== sourceTables.length) diff.push(`So bang: Excel ${blocks.length}, nguon ${sourceTables.length}`);
  for (const t of sourceTables) {
    const b = blocks.find((x) => x.title === t.title);
    if (!b) { diff.push(`Khong thay bang trong Excel: ${t.title}`); continue; }
    for (const panel of [t.gramNegative, t.gramPositive]) {
      const header = b.rows.find((r) => r[0] === "Vi khuẩn" && r[3] === panel.columns[0].name);
      if (!header) { if (panel.rows.length) diff.push(`${t.heading}: thieu tieu de cot ${panel.columns[0].name}`); continue; }
      panel.columns.forEach((c, i) => { if (header[3 + i] !== c.name) diff.push(`${t.heading}: cot ${i} Excel "${header[3 + i]}" web "${c.name}"`); });
      for (const r of panel.rows) {
        const x = b.rows.find((row) => row[0] === r.group && row[3 + panel.columns.length - 1] !== undefined && header && b.rows.indexOf(row) > b.rows.indexOf(header));
        if (!x) { diff.push(`${t.heading}: Excel thieu dong ${r.group}`); continue; }
        const mine = [r.nText, String(r.share), ...r.cells.map((c) => c.t)];
        const theirs = x.slice(1, 3 + panel.columns.length);
        mine.forEach((v, i) => { compared += 1; if (v !== theirs[i]) diff.push(`${t.heading} | ${r.group} | cot ${i}: Excel "${theirs[i]}" web "${v}"`); });
      }
    }
  }
  if (diff.length) { console.error(`Lech voi Excel (${diff.length}):\n` + diff.slice(0, 30).join("\n")); process.exit(1); }
  console.log(`Doi chieu Excel goc: ${sourceTables.length} bang, ${compared} o khop.`);
}

fs.writeFileSync(OUT, JSON.stringify(database, null, 1) + "\n");
fs.writeFileSync(OUT_TABLES, JSON.stringify({
  period: "01/04/2025 – 31/03/2026",
  minN: MIN_N, minTestedRatio: MIN_TESTED, greenThreshold: GREEN,
  method: database.metadata.method,
  breakpointNote: database.metadata.breakpointNote,
  clsiNotes: [...new Map(CLSI_RULES.map((r) => [r.mark, r])).values()].map(({ mark, kind }) => ({
    mark,
    text: kind === "nobp"
      ? "Không có điểm gãy CLSI M100 cho cặp vi khuẩn – kháng sinh này, không diễn giải: " +
        CLSI_RULES.filter((r) => r.mark === mark).map((r) => `${r.group} – ${abName[r.code]}`).join("; ") + "."
      : CLSI_RULES.find((r) => r.mark === mark).text,
  })),
  tables,
}) + "\n");
console.log(`OK: ${isolates.length}/${isolatesAll.length} phan lap dau tien, ${records.length} dong, ${organisms.length} loai; doi chieu ${reference.length} dong khop 100%.`);
console.log(`OK: ${tables.length} bang khang sinh do tich luy.`);
