/*
  Nhap goi du lieu vi sinh da chuan hoa (BV199, 04/2025 – 03/2026) vao web app.

  Cach chay:
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
  console.error("Thieu duong dan thu muc goi du lieu.");
  process.exit(1);
}
const OUT = path.resolve("data/antibiotics/antibiogram-bv199.json");

function readCsv(name) {
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

const SCOPES = ["Toàn viện", "HSCC", "Khối nội", "Khối ngoại"];
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

const isolatesAll = readCsv("isolates.csv");
const isolates = isolatesAll.filter((r) => r.first_isolate === "Y");
const ast = readCsv("ast_results.csv");
const intrinsic = new Set(
  readCsv("ref_intrinsic_resistance.csv").map((r) => `${r.nhom_bao_cao}|${r.ma_khang_sinh}`)
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
  for (const department of ["Toàn viện", iso.nhom_khoa]) {
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
  return rec;
}).sort((a, b) => a.id.localeCompare(b.id, "vi"));

/* Doi chieu: gop theo nhom bao cao, tat ca benh pham -> phai trung antibiogram_long.csv. */
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
const reference = readCsv("antibiogram_long.csv");
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
    method: "CLSI M39: chỉ tính phân lập đầu tiên của mỗi loài ở mỗi người bệnh; %S = S/(S+I+R), I tính là không nhạy.",
    status: "Chưa thẩm định cho hỗ trợ quyết định lâm sàng.",
    departmentNote: "Nhóm khoa (HSCC, Khối nội, Khối ngoại) suy ra từ báo cáo trước; chờ khoa và Kiểm soát nhiễm khuẩn xác nhận.",
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

fs.writeFileSync(OUT, JSON.stringify(database, null, 1) + "\n");
console.log(`OK: ${isolates.length}/${isolatesAll.length} phan lap dau tien, ${records.length} dong, ${organisms.length} loai; doi chieu ${reference.length} dong khop 100%.`);

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
const abName = Object.fromEntries(readCsv("ref_antibiotics.csv").map((r) => [r.ma_khang_sinh, r.ten_en]));
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
const wardOf = (iso) => iso.khoa.trim().toUpperCase();

function buildPanel(subset, panel, scopeN) {
  const rows = [];
  for (const group of panel.groups) {
    const isos = subset.filter((i) => i.nhom_bao_cao === group);
    if (!isos.length) continue;
    const N = isos.length;
    const cells = panel.codes.map((code) => {
      if (intrinsic.has(`${group}|${code}`)) return { t: "R" };
      let s = 0, tested = 0;
      for (const iso of isos) {
        for (const r of astByIsolate.get(iso.isolate_id) ?? []) {
          if (r.ma_khang_sinh !== code) continue;
          tested += 1;
          if (r.ket_qua === "S") s += 1;
        }
      }
      if (!tested) return { t: "-" };
      const p = excelRound1(s, tested);
      const lowTested = tested < MIN_TESTED * N;
      const text = `${p}${lowTested ? "*" : ""}${code === "FOX" && STAPH.has(group) ? "b" : ""}`;
      const cell = { t: text, s, n: tested };
      if (p >= GREEN && N >= MIN_N && !lowTested) cell.g = 1;
      return cell;
    });
    rows.push({ group, n: N, nText: `${N}${N < MIN_N ? "ᵃ" : ""}`, share: excelRound1(N, scopeN), cells });
  }
  return { columns: panel.codes.map((code) => ({ code, name: abName[code] })), rows };
}

const SCOPE_LABEL = { "Toàn viện": "TOÀN VIỆN", HSCC: "HSCC", "Khối nội": "KHỐI NỘI", "Khối ngoại": "KHỐI NGOẠI" };
const tableList = [];
for (const scope of SCOPES) {
  const subset = scope === "Toàn viện" ? isolates : isolates.filter((i) => i.nhom_khoa === scope);
  tableList.push({ id: slug(scope), kind: "scope", label: scope, heading: SCOPE_LABEL[scope], n: subset.length, subset });
}
const wards = [...new Set(isolates.map(wardOf))].sort((a, b) => {
  const ga = SCOPES.indexOf(isolates.find((i) => wardOf(i) === a).nhom_khoa);
  const gb = SCOPES.indexOf(isolates.find((i) => wardOf(i) === b).nhom_khoa);
  return ga - gb || a.localeCompare(b, "vi");
});
for (const ward of wards) {
  const subset = isolates.filter((i) => wardOf(i) === ward);
  tableList.push({ id: `khoa-${slug(ward)}`, kind: "ward", label: `Khoa ${ward}`, heading: `KHOA ${ward}`, group: subset[0].nhom_khoa, n: subset.length, subset });
}
const tables = tableList.map(({ subset, ...t }) => ({
  ...t,
  title: `BẢNG KHÁNG SINH ĐỒ TÍCH LŨY CHO CÁC VI KHUẨN PHÂN LẬP – BỆNH VIỆN 199 – ${t.heading} (n=${t.n})`,
  gramNegative: buildPanel(subset, GRAM_NEG, t.n),
  gramPositive: buildPanel(subset, GRAM_POS, t.n),
}));

/* Doi chieu tung o voi workbook Excel (neu co duong dan file .xlsx o tham so thu 2). */
const XLSX_PATH = process.argv[3] ?? process.env.ANTIBIOGRAM_XLSX;
if (XLSX_PATH) {
  const XLSX = (await import("xlsx")).default;
  const wb = XLSX.readFile(XLSX_PATH);
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
  if (blocks.length !== tables.length) diff.push(`So bang: Excel ${blocks.length}, web ${tables.length}`);
  for (const t of tables) {
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
  console.log(`Doi chieu Excel: ${tables.length} bang, ${compared} o khop.`);
}

fs.writeFileSync(OUT_TABLES, JSON.stringify({
  period: "01/04/2025 – 31/03/2026",
  minN: MIN_N, minTestedRatio: MIN_TESTED, greenThreshold: GREEN,
  tables,
}) + "\n");
console.log(`OK: ${tables.length} bang khang sinh do tich luy.`);
