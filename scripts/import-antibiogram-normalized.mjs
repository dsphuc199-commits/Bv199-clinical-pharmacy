/*
  Nhap goi du lieu vi sinh da chuan hoa (BV199, 04/2025 – 03/2026) vao web app.

  Cach chay:
    node scripts/import-antibiogram-normalized.mjs <thu-muc-goi-du-lieu>
  Thu muc can co: isolates.csv, ast_results.csv, ref_intrinsic_resistance.csv,
  antibiogram_long.csv va antibiogram.json (dung de doi chieu).

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
/* Lam tron 1 chu so thap phan, diem giua ve so chan (trung workbook goc: 27/48 = 56,2). */
const pct = (a, b) => {
  if (!b) return 0;
  const num = a * 1000;
  let q = Math.floor(num / b);
  const rem = num - q * b;
  if (2 * rem > b || (2 * rem === b && q % 2 === 1)) q += 1;
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
const reference = readCsv("antibiogram_long.csv");
const pctJson = new Map(
  JSON.parse(fs.readFileSync(path.join(SRC, "antibiogram.json"), "utf8")).data
    .map((d) => [`${d.scope}|${d.organism_group}|${d.antibiotic_code}`, d.pct_S])
);
const mismatches = [];
for (const r of reference) {
  const key = `${r.pham_vi}|${r.nhom_bao_cao}|${r.ma_khang_sinh}`;
  const v = groupSum.get(key) ?? { S: 0, I: 0, R: 0 };
  const pctRef = pctJson.get(key);
  if (v.S !== Number(r.n_S) || v.I !== Number(r.n_I) || v.R !== Number(r.n_R) || pct(v.S, v.S + v.I + v.R) !== pctRef) {
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
