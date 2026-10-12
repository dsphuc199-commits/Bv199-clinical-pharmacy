import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

const INPUT_FILE = path.resolve(
  "data-source/danh-muc-thuoc-bv199.xlsx"
);

const OUTPUT_FILE = path.resolve(
  "data/drug-products.json"
);

const SHEETS = [
  "PL Gói 1",
  "PL gói 2",
  "PL gói 3",
];

function clean(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function pick(row, names) {
  const keys = Object.keys(row);

  for (const name of names) {
    const target = normalize(name);

    const key = keys.find(
      (k) => normalize(k) === target
    );

    if (key && clean(row[key]) !== "") {
      return row[key];
    }
  }

  return "";
}

function isBV199(value) {
  const text = normalize(value);

  return (
    text.includes("22. bv199") ||
    text.includes("benh vien 199") ||
    text.includes("bv199")
  );
}

function numberValue(value) {
  if (
    value === null ||
    value === undefined ||
    clean(value) === ""
  ) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  const text = clean(value)
    .replace(/\s/g, "")
    .replace(/[^\d.,-]/g, "");

  let result = Number(text);

  if (!Number.isNaN(result)) {
    return result;
  }

  result = Number(
    text
      .replace(/\./g, "")
      .replace(/,/g, ".")
  );

  return Number.isNaN(result)
    ? null
    : result;
}

function mapDrug(row, sheetName, index) {
  return {
    id: `${sheetName}-${index}`,

    drugCode: clean(
      pick(row, ["Mã thuốc"])
    ),

    drugName: clean(
      pick(row, ["Tên thuốc"])
    ),

    activeIngredient: clean(
      pick(row, [
        "Tên hoạt chất/Tên thành phần của thuốc",
        "Tên hoạt chất",
        "Hoạt chất",
      ])
    ),

    strength: clean(
      pick(row, [
        "Nồng độ, hàm lượng",
        "Hàm lượng",
      ])
    ),

    route: clean(
      pick(row, ["Đường dùng"])
    ),

    dosageForm: clean(
      pick(row, ["Dạng bào chế"])
    ),

    packaging: clean(
      pick(row, [
        "Quy cách",
        "Quy cách đóng gói",
      ])
    ),

    drugGroup: clean(
      pick(row, ["Nhóm thuốc"])
    ),

    registrationNumber: clean(
      pick(row, [
        "GĐKLH hoặc GPNK",
        "Số đăng ký",
      ])
    ),

    manufacturer: clean(
      pick(row, [
        "Tên cơ sở sản xuất",
        "Cơ sở sản xuất",
      ])
    ),

    origin: clean(
      pick(row, [
        "Xuất xứ",
        "Xuất xứ",
      ])
    ),

    unit: clean(
      pick(row, ["Đơn vị tính"])
    ),

    unitPrice: numberValue(
      pick(row, [
        "Đơn giá trúng thầu (VND)",
        "Đơn giá trúng thầu",
      ])
    ),

    contractor: clean(
      pick(row, ["Tên nhà thầu"])
    ),

    facility: clean(
      pick(row, ["Cơ sở y tế"])
    ),

    sourceSheet: sheetName,
  };
}

console.log("Đang đọc file Excel...");

if (!fs.existsSync(INPUT_FILE)) {
  console.error("Không tìm thấy:");
  console.error(INPUT_FILE);
  process.exit(1);
}

const workbook = XLSX.readFile(
  INPUT_FILE,
  {
    raw: false,
    cellText: true,
  }
);

const allDrugs = [];

for (const sheetName of SHEETS) {
  const sheet =
    workbook.Sheets[sheetName];

  if (!sheet) {
    console.log(
      `Không tìm thấy sheet: ${sheetName}`
    );
    continue;
  }

  const rows =
    XLSX.utils.sheet_to_json(
      sheet,
      {
        defval: "",
        raw: false,
      }
    );

  const bv199Rows =
    rows.filter(
      (row) =>
        isBV199(
          pick(row, ["Cơ sở y tế"])
        )
    );

  console.log(
    `${sheetName}: ${bv199Rows.length} dòng BV199`
  );

  bv199Rows.forEach(
    (row, index) => {
      const drug =
        mapDrug(
          row,
          sheetName,
          index
        );

      if (
        drug.drugName ||
        drug.activeIngredient
      ) {
        allDrugs.push(drug);
      }
    }
  );
}

const unique = new Map();

for (const drug of allDrugs) {
  const key = [
    normalize(drug.drugCode),
    normalize(drug.drugName),
    normalize(drug.activeIngredient),
    normalize(drug.strength),
    normalize(drug.dosageForm),
    normalize(drug.manufacturer),
  ].join("|");

  if (!unique.has(key)) {
    unique.set(key, drug);
  }
}

const drugs =
  Array.from(unique.values());

drugs.sort(
  (a, b) =>
    a.activeIngredient.localeCompare(
      b.activeIngredient,
      "vi"
    )
);

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(
    drugs,
    null,
    2
  ),
  "utf8"
);

console.log("");
console.log("IMPORT THÀNH CÔNG");
console.log(
  `Tổng dòng BV199: ${allDrugs.length}`
);
console.log(
  `Sau loại trùng: ${drugs.length}`
);
console.log(
  "Đã tạo data/drug-products.json"
);