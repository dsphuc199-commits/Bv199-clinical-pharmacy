// ============================================================
// BV199 CLINICAL PHARMACY
// RENAL FUNCTION CALCULATIONS
// ============================================================

export type Sex = "male" | "female";

export type CreatinineUnit =
  | "mg/dL"
  | "µmol/L";

export type WeightMethod =
  | "actual"
  | "ideal"
  | "adjusted";


// ============================================================
// HELPER
// ============================================================

export function roundNumber(
  value: number,
  decimals = 1
) {
  const factor = 10 ** decimals;

  return (
    Math.round(value * factor) /
    factor
  );
}


// ============================================================
// CREATININE CONVERSION
// µmol/L → mg/dL
//
// 1 mg/dL creatinine ≈ 88.4 µmol/L
// ============================================================

export function convertCreatinineToMgDl(
  value: number,
  unit: CreatinineUnit
) {
  if (value <= 0) return 0;

  if (unit === "mg/dL") {
    return value;
  }

  return value / 88.4;
}


// ============================================================
// BMI
//
// BMI = weight(kg) / height(m)^2
// ============================================================

export function calculateBMI(
  weightKg: number,
  heightCm: number
) {
  if (
    weightKg <= 0 ||
    heightCm <= 0
  ) {
    return 0;
  }

  const heightM =
    heightCm / 100;

  return (
    weightKg /
    (heightM * heightM)
  );
}


// ============================================================
// IDEAL BODY WEIGHT - DEVINE
//
// Male:
// 50 + 2.3 kg per inch over 5 ft
//
// Female:
// 45.5 + 2.3 kg per inch over 5 ft
//
// Với chiều cao < 152.4 cm,
// công thức Devine có hạn chế.
// App sẽ cảnh báo trên UI.
// ============================================================

export function calculateIBW(
  sex: Sex,
  heightCm: number
) {
  if (heightCm <= 0) {
    return 0;
  }

  const heightInches =
    heightCm / 2.54;

  const inchesOverFiveFeet =
    heightInches - 60;

  const base =
    sex === "male"
      ? 50
      : 45.5;

  const ibw =
    base +
    2.3 * inchesOverFiveFeet;

  return Math.max(ibw, 0);
}


// ============================================================
// ADJUSTED BODY WEIGHT
//
// AdjBW = IBW + 0.4 × (ABW - IBW)
// ============================================================

export function calculateAdjBW(
  actualWeightKg: number,
  idealWeightKg: number
) {
  if (
    actualWeightKg <= 0 ||
    idealWeightKg <= 0
  ) {
    return 0;
  }

  return (
    idealWeightKg +
    0.4 *
      (
        actualWeightKg -
        idealWeightKg
      )
  );
}


// ============================================================
// COCKCROFT-GAULT
//
// CrCl =
// ((140-age) × weight) /
// (72 × SCr)
//
// Female × 0.85
//
// SCr must be mg/dL
// ============================================================

export function calculateCrClCG(
  age: number,
  weightKg: number,
  scrMgDl: number,
  sex: Sex
) {
  if (
    age <= 0 ||
    age >= 140 ||
    weightKg <= 0 ||
    scrMgDl <= 0
  ) {
    return 0;
  }

  let result =
    (
      (140 - age) *
      weightKg
    ) /
    (
      72 *
      scrMgDl
    );

  if (sex === "female") {
    result *= 0.85;
  }

  return result;
}


// ============================================================
// CKD-EPI 2021 - CREATININE
//
// eGFR =
// 142 × min(Scr/k,1)^alpha
// × max(Scr/k,1)^-1.200
// × 0.9938^Age
// × 1.012 if female
//
// Unit:
// mL/min/1.73 m²
//
// Race-free equation.
// ============================================================

export function calculateEgfrCKDEPI2021(
  age: number,
  scrMgDl: number,
  sex: Sex
) {
  if (
    age <= 0 ||
    scrMgDl <= 0
  ) {
    return 0;
  }

  const kappa =
    sex === "female"
      ? 0.7
      : 0.9;

  const alpha =
    sex === "female"
      ? -0.241
      : -0.302;

  const scrRatio =
    scrMgDl / kappa;

  const minPart =
    Math.min(
      scrRatio,
      1
    );

  const maxPart =
    Math.max(
      scrRatio,
      1
    );

  let egfr =
    142 *
    Math.pow(
      minPart,
      alpha
    ) *
    Math.pow(
      maxPart,
      -1.2
    ) *
    Math.pow(
      0.9938,
      age
    );

  if (sex === "female") {
    egfr *= 1.012;
  }

  return egfr;
}


// ============================================================
// BMI CLASSIFICATION
// ============================================================

export function classifyBMI(
  bmi: number
) {
  if (bmi <= 0) {
    return "";
  }

  if (bmi < 18.5) {
    return "Thiếu cân";
  }

  if (bmi < 25) {
    return "Bình thường";
  }

  if (bmi < 30) {
    return "Thừa cân";
  }

  return "Béo phì";
}


// ============================================================
// CrCl CATEGORY
//
// Đây chỉ là phân tầng để hiển thị hỗ trợ.
// Không dùng thay thế CKD staging.
// ============================================================

export function classifyCrCl(
  crcl: number
) {
  if (crcl <= 0) {
    return "";
  }

  if (crcl >= 90) {
    return "≥ 90 mL/phút";
  }

  if (crcl >= 60) {
    return "60–89 mL/phút";
  }

  if (crcl >= 30) {
    return "30–59 mL/phút";
  }

  if (crcl >= 15) {
    return "15–29 mL/phút";
  }

  return "< 15 mL/phút";
}


// ============================================================
// eGFR CATEGORY
//
// Chỉ phân tầng theo giá trị G;
// chẩn đoán CKD cần bối cảnh và thời gian.
// ============================================================

export function classifyEgfr(
  egfr: number
) {
  if (egfr <= 0) {
    return "";
  }

  if (egfr >= 90) {
    return "G1";
  }

  if (egfr >= 60) {
    return "G2";
  }

  if (egfr >= 45) {
    return "G3a";
  }

  if (egfr >= 30) {
    return "G3b";
  }

  if (egfr >= 15) {
    return "G4";
  }

  return "G5";
}