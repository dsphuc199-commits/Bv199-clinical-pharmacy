import XLSX from "xlsx";
import fs from "fs";
import path from "path";

/* =========================================================
   1. FILE INPUT / OUTPUT
========================================================= */

const INPUT_FILE = path.resolve(
  "data-source/antibiogram-bv199.xlsx"
);

const OUTPUT_FILE = path.resolve(
  "data/antibiotics/antibiogram-bv199.json"
);

const SHEET_NAME = "File gốc";

/* =========================================================
   2. THỜI GIAN DỮ LIỆU
========================================================= */

const PERIOD = {
  id: "2025-04_2026-03",
  label: "04/2025 – 03/2026",
};

/* =========================================================
   3. DANH MỤC KHÁNG SINH TRONG FILE EXCEL
========================================================= */

const ANTIBIOTICS = {
  AMP: {
    id: "ampicillin",
    name: "Ampicillin",
  },

  AMC: {
    id: "amoxicillin-clavulanate",
    name: "Amoxicillin/clavulanate",
  },

  SAM: {
    id: "ampicillin-sulbactam",
    name: "Ampicillin/sulbactam",
  },

  TZP: {
    id: "piperacillin-tazobactam",
    name: "Piperacillin/tazobactam",
  },

  FOX: {
    id: "cefoxitin",
    name: "Cefoxitin",
  },

  CRO: {
    id: "ceftriaxone",
    name: "Ceftriaxone",
  },

  CAZ: {
    id: "ceftazidime",
    name: "Ceftazidime",
  },

  CTX: {
    id: "cefotaxime",
    name: "Cefotaxime",
  },

  CXM: {
    id: "cefuroxime",
    name: "Cefuroxime",
  },

  FEP: {
    id: "cefepime",
    name: "Cefepime",
  },

  IMP: {
    id: "imipenem",
    name: "Imipenem",
  },

  MEM: {
    id: "meropenem",
    name: "Meropenem",
  },

  "CN/GEN": {
    id: "gentamicin",
    name: "Gentamicin",
  },

  TOB: {
    id: "tobramycin",
    name: "Tobramycin",
  },

  AMK: {
    id: "amikacin",
    name: "Amikacin",
  },

  TCY: {
    id: "tetracycline",
    name: "Tetracycline",
  },

  DOX: {
    id: "doxycycline",
    name: "Doxycycline",
  },

  CIP: {
    id: "ciprofloxacin",
    name: "Ciprofloxacin",
  },

  LVX: {
    id: "levofloxacin",
    name: "Levofloxacin",
  },

  SXT: {
    id: "trimethoprim-sulfamethoxazole",
    name: "Trimethoprim/sulfamethoxazole",
  },

  PEN: {
    id: "penicillin",
    name: "Penicillin",
  },

  ERY: {
    id: "erythromycin",
    name: "Erythromycin",
  },

  CLI: {
    id: "clindamycin",
    name: "Clindamycin",
  },

  VAN: {
    id: "vancomycin",
    name: "Vancomycin",
  },

  KZ: {
    id: "cefazolin",
    name: "Cefazolin",
  },

  LZD: {
    id: "linezolid",
    name: "Linezolid",
  },
};

/* =========================================================
   4. HÀM LÀM SẠCH
========================================================= */

function clean(value) {
  if (
    value === null ||
    value === undefined
  ) {
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
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(/đ/g, "d");
}

/* =========================================================
   5. CHUẨN HÓA S / I / R
========================================================= */

function normalizeAST(value) {
  const result =
    clean(value).toUpperCase();

  if (result === "S") {
    return "S";
  }

  if (result === "I") {
    return "I";
  }

  if (result === "R") {
    return "R";
  }

  return null;
}

/* =========================================================
   6. CHUẨN HÓA VI KHUẨN
========================================================= */

function normalizeOrganism(value) {
  const raw = clean(value);

  const x = normalize(raw)
    .replace(/\s+/g, "");

  const map = {
    "e.coli": {
      id: "escherichia-coli",
      name: "Escherichia coli",
    },

    "k.pneumoniae": {
      id: "klebsiella-pneumoniae",
      name: "Klebsiella pneumoniae",
    },

    "k.aerogenes": {
      id: "klebsiella-aerogenes",
      name: "Klebsiella aerogenes",
    },

    "p.aeruginosa": {
      id: "pseudomonas-aeruginosa",
      name: "Pseudomonas aeruginosa",
    },

    "a.baumannii": {
      id: "acinetobacter-baumannii",
      name: "Acinetobacter baumannii",
    },

    "a.baumanii": {
      id: "acinetobacter-baumannii",
      name: "Acinetobacter baumannii",
    },

    "s.aureus": {
      id: "staphylococcus-aureus",
      name: "Staphylococcus aureus",
    },

    "s.epidermidis": {
      id: "staphylococcus-epidermidis",
      name: "Staphylococcus epidermidis",
    },

    "s.capitis": {
      id: "staphylococcus-capitis",
      name: "Staphylococcus capitis",
    },

    "s.captis": {
      id: "staphylococcus-capitis",
      name: "Staphylococcus capitis",
    },

    "s.maltophilia": {
      id: "stenotrophomonas-maltophilia",
      name: "Stenotrophomonas maltophilia",
    },

    "p.mirabilis": {
      id: "proteus-mirabilis",
      name: "Proteus mirabilis",
    },

    "enterococcus": {
      id: "enterococcus-spp",
      name: "Enterococcus spp.",
    },
  };

  if (map[x]) {
    return map[x];
  }

  return {
    id: normalize(raw)
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      ),

    name:
      raw ||
      "Không xác định",
  };
}

/* =========================================================
   7. CHUẨN HÓA BỆNH PHẨM
========================================================= */

function normalizeSpecimen(value) {
  const raw = clean(value);

  const x = normalize(raw);

  if (
    x.includes("nuoc tieu")
  ) {
    return "Nước tiểu";
  }

  if (
    x.includes("dam") ||
    x.includes("dom") ||
    x.includes("drpq")
  ) {
    return "Hô hấp";
  }

  if (
    x.includes("mau")
  ) {
    return "Máu";
  }

  if (
    x.includes("mu") ||
    x.includes("vet thuong") ||
    x.includes("to chuc")
  ) {
    return "Mủ / vết thương";
  }

  if (
    x.includes("dich")
  ) {
    return "Dịch";
  }

  return (
    raw ||
    "Khác"
  );
}

/* =========================================================
   8. KIỂM TRA FILE
========================================================= */

if (
  !fs.existsSync(
    INPUT_FILE
  )
) {
  console.error("");
  console.error(
    "❌ KHÔNG TÌM THẤY FILE:"
  );

  console.error(
    INPUT_FILE
  );

  process.exit(1);
}

/* =========================================================
   9. ĐỌC EXCEL
========================================================= */

const workbook =
  XLSX.readFile(
    INPUT_FILE,
    {
      raw: false,
      cellText: true,
    }
  );

const worksheet =
  workbook.Sheets[
    SHEET_NAME
  ];

if (!worksheet) {
  console.error(
    `❌ Không tìm thấy sheet: ${SHEET_NAME}`
  );

  console.log(
    workbook.SheetNames
  );

  process.exit(1);
}

/*
  header:1 = đọc theo vị trí cột.

  Quan trọng vì cột chứa tên vi khuẩn
  trong file gốc không có header.
*/

const matrix =
  XLSX.utils.sheet_to_json(
    worksheet,
    {
      header: 1,
      defval: "",
      raw: false,
    }
  );

const header =
  matrix[0];

/* =========================================================
   10. XÁC ĐỊNH CỘT KHÁNG SINH
========================================================= */

const antibioticColumns =
  {};

for (
  const [
    abbreviation,
    antibiotic,
  ]
  of Object.entries(
    ANTIBIOTICS
  )
) {
  const index =
    header.findIndex(
      (value) =>
        clean(value) ===
        abbreviation
    );

  if (
    index >= 0
  ) {
    antibioticColumns[
      abbreviation
    ] = {
      index,
      ...antibiotic,
    };
  }
}

/* =========================================================
   11. LẤY CÁC PHÂN LẬP THẬT
========================================================= */

const rawRows =
  matrix
    .slice(1)
    .filter(
      (row) => {
        const stt =
          Number(
            row[0]
          );

        const organism =
          clean(
            row[6]
          );

        return (
          Number.isFinite(
            stt
          ) &&
          stt > 0 &&
          organism !== ""
        );
      }
    );

console.log("");
console.log(
  `Số phân lập đọc được: ${rawRows.length}`
);

/* =========================================================
   12. TẠO RECORD KHÔNG ĐỊNH DANH
========================================================= */

const isolates =
  rawRows.map(
    (
      row,
      index
    ) => {
      const organism =
        normalizeOrganism(
          row[6]
        );

      const ast = {};

      for (
        const column
        of Object.values(
          antibioticColumns
        )
      ) {
        const result =
          normalizeAST(
            row[
              column.index
            ]
          );

        if (
          result
        ) {
          ast[
            column.id
          ] = result;
        }
      }

      return {
        id:
          `isolate-${index + 1}`,

        department:
          clean(
            row[3]
          ),

        specimen:
          normalizeSpecimen(
            row[4]
          ),

        specimenCode:
          clean(
            row[5]
          ),

        organismId:
          organism.id,

        organismName:
          organism.name,

        organismType:
          clean(
            row[7]
          ),

        ast,
      };
    }
  );

/*
  Lưu ý:
  KHÔNG đưa Họ tên hoặc Năm sinh
  vào dữ liệu web.
*/

/* =========================================================
   13. TỔNG HỢP ANTIBIOGRAM
========================================================= */

const aggregate =
  new Map();

function addAggregate({
  department,
  specimen,
  isolate,
  antibiotic,
  astResult,
}) {
  const key = [
    department,
    specimen,
    isolate.organismId,
    antibiotic.id,
  ].join("|");

  if (
    !aggregate.has(key)
  ) {
    aggregate.set(
      key,
      {
        id:
          key.replace(
            /\|/g,
            "__"
          ),

        department,

        specimen,

        organismId:
          isolate.organismId,

        organismName:
          isolate.organismName,

        antibioticId:
          antibiotic.id,

        antibioticName:
          antibiotic.name,

        n: 0,

        sCount: 0,

        iCount: 0,

        rCount: 0,
      }
    );
  }

  const target =
    aggregate.get(key);

  target.n += 1;

  if (
    astResult === "S"
  ) {
    target.sCount +=
      1;
  }

  if (
    astResult === "I"
  ) {
    target.iCount +=
      1;
  }

  if (
    astResult === "R"
  ) {
    target.rCount +=
      1;
  }
}

/* =========================================================
   14. TẠO 4 MỨC TỔNG HỢP
========================================================= */

for (
  const isolate
  of isolates
) {
  for (
    const [
      antibioticId,
      astResult,
    ]
    of Object.entries(
      isolate.ast
    )
  ) {
    const antibiotic =
      Object.values(
        antibioticColumns
      ).find(
        (item) =>
          item.id ===
          antibioticId
      );

    if (!antibiotic) {
      continue;
    }

    const scopes = [
      /*
        Toàn viện – tất cả bệnh phẩm
      */
      {
        department:
          "Toàn viện",

        specimen:
          "Tất cả",
      },

      /*
        Theo khoa
      */
      {
        department:
          isolate.department ||
          "Không xác định",

        specimen:
          "Tất cả",
      },

      /*
        Theo bệnh phẩm
      */
      {
        department:
          "Toàn viện",

        specimen:
          isolate.specimen,
      },

      /*
        Theo khoa + bệnh phẩm
      */
      {
        department:
          isolate.department ||
          "Không xác định",

        specimen:
          isolate.specimen,
      },
    ];

    for (
      const scope
      of scopes
    ) {
      addAggregate({
        ...scope,

        isolate,

        antibiotic,

        astResult,
      });
    }
  }
}

/* =========================================================
   15. TÍNH %
========================================================= */

const records =
  Array.from(
    aggregate.values()
  ).map(
    (item) => {
      const pct = (
        value
      ) => {
        if (
          item.n === 0
        ) {
          return 0;
        }

        return (
          Math.round(
            (
              value /
              item.n
            ) *
              1000
          ) /
          10
        );
      };

      return {
        ...item,

        susceptiblePercent:
          pct(
            item.sCount
          ),

        increasedExposurePercent:
          pct(
            item.iCount
          ),

        resistantPercent:
          pct(
            item.rCount
          ),

        susceptibleTotalPercent:
          pct(
            item.sCount +
              item.iCount
          ),

        lowN:
          item.n < 30,
      };
    }
  );

/* =========================================================
   16. METADATA
========================================================= */

const departments =
  Array.from(
    new Set(
      isolates
        .map(
          (item) =>
            item.department
        )
        .filter(Boolean)
    )
  ).sort();

const specimens =
  Array.from(
    new Set(
      isolates.map(
        (item) =>
          item.specimen
      )
    )
  ).sort();

const organisms =
  Array.from(
    new Map(
      isolates.map(
        (item) => [
          item.organismId,

          {
            id:
              item.organismId,

            name:
              item.organismName,
          },
        ]
      )
    ).values()
  ).sort(
    (a, b) =>
      a.name.localeCompare(
        b.name,
        "vi"
      )
  );

/* =========================================================
   17. OUTPUT
========================================================= */

const output = {
  metadata: {
    hospital:
      "Bệnh viện 199 – Bộ Công an",

    source:
      "Kết quả kháng sinh đồ từ tháng 04/2025 đến hết tháng 03/2026",

    period:
      PERIOD,

    isolateCount:
      isolates.length,

    departments,

    specimens,

    organisms,

    privacy:
      "Dữ liệu web không chứa họ tên và năm sinh.",
  },

  records,
};

/* =========================================================
   18. SAVE JSON
========================================================= */

fs.mkdirSync(
  path.dirname(
    OUTPUT_FILE
  ),
  {
    recursive: true,
  }
);

fs.writeFileSync(
  OUTPUT_FILE,

  JSON.stringify(
    output,
    null,
    2
  ),

  "utf8"
);

console.log("");
console.log(
  "========================================"
);

console.log(
  "✅ IMPORT ANTIBIOGRAM THÀNH CÔNG"
);

console.log(
  "========================================"
);

console.log(
  `Số phân lập: ${isolates.length}`
);

console.log(
  `Số bản ghi tổng hợp: ${records.length}`
);

console.log("");
console.log(
  "Đã tạo:"
);

console.log(
  "data/antibiotics/antibiogram-bv199.json"
);