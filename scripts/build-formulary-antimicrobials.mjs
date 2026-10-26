/*
  Tao chi muc nho cac san pham khang khuan/khang nam trong danh muc thuoc BV199
  (data/drug-products.json, nhap tu danh-muc-thuoc-bv199.xlsx bang scripts/import-drugs.mjs)
  de trang Khang sinh kinh nghiem kiem tra "co trong danh muc BV199" ma khong phai
  nap toan bo 2.000+ san pham.

  Loc so bo bang tu khoa goc hoat chat; viec gan voi hoat chat cu the thuc hien luc
  chay bang lib/antibiotics/drug-links.ts (findDrugs).

  Chay: node scripts/build-formulary-antimicrobials.mjs
*/

import fs from "fs";
import path from "path";

const INPUT = path.resolve("data/drug-products.json");
const OUTPUT = path.resolve("data/antibiotics/bv199-formulary-antimicrobials.json");

const ROOTS = [
  "cef", "ceph", "penem", "cilin", "cillin", "penicil", "bactam", "clavulan",
  "mycin", "micin", "floxacin", "cyclin", "sulfa", "trimethoprim", "vancomycin",
  "teicoplanin", "linezolid", "colistin", "polymyxin", "fosfomycin", "metronidazol",
  "tinidazol", "ornidazol", "secnidazol", "rifampi", "isoniazid", "ethambutol",
  "pyrazinamid", "nitrofurantoin", "fusidic", "aztreonam", "daptomycin",
  "amphotericin", "nystatin", "griseofulvin", "fungin", "conazol",
];

function norm(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

const products = JSON.parse(fs.readFileSync(INPUT, "utf8"));

const items = products
  .filter((p) => ROOTS.some((root) => norm(p.ingredientName).includes(root)))
  .map((p) => ({
    id: p.id,
    brandName: p.brandName,
    ingredientName: p.ingredientName,
    strength: p.strength,
    route: p.route,
    dosageForm: p.dosageForm,
    sourceSheet: p.sourceSheet,
  }))
  .sort((a, b) => a.ingredientName.localeCompare(b.ingredientName, "vi"));

const out = {
  source: "data/drug-products.json (nhập từ danh-muc-thuoc-bv199.xlsx)",
  note: "Chỉ mục sinh tự động bằng scripts/build-formulary-antimicrobials.mjs. Không sửa tay.",
  totalProducts: products.length,
  count: items.length,
  items,
};

fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 1) + "\n");
console.log(`Wrote ${items.length}/${products.length} products -> ${path.relative(process.cwd(), OUTPUT)}`);
