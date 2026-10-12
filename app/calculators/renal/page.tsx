"use client";

import {
  useMemo,
  useState,
} from "react";

import drugData
  from "@/data/drug-products.json";

import {
  renalDosingDatabase,
  type RenalDoseProfile,
  type RenalDoseRange,
} from "@/data/renal-dosing";

/* =========================================================
   TYPES
========================================================= */

type Sex =
  | "male"
  | "female";

type CreatinineUnit =
  | "umol"
  | "mgdl";

type WeightMethod =
  | "abw"
  | "ibw"
  | "adjbw";

type DialysisMode =
  | "none"
  | "hd"
  | "crrt"
  | "pd";

type Drug = {
  id: string;

  drugCode?: string;

  brandName?: string;

  ingredientName?: string;

  ingredientId?: string;

  strength?: string;

  route?: string;

  dosageForm?: string;

  packageSize?: string;

  registrationNumber?: string;

  manufacturer?: string;

  country?: string;

  unit?: string;

  sourceSheet?: string;
};

const hospitalDrugs =
  drugData as Drug[];

/* =========================================================
   BASIC HELPERS
========================================================= */

function round1(
  value: number
) {
  return (
    Math.round(
      value * 10
    ) / 10
  );
}

function round2(
  value: number
) {
  return (
    Math.round(
      value * 100
    ) / 100
  );
}

function normalizeText(
  value?: string
) {
  return (
    value ?? ""
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(/đ/g, "d")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   SCr CONVERSION
========================================================= */

function convertSCrToMgDl(
  value: number,
  unit: CreatinineUnit
) {
  if (
    value <= 0
  ) {
    return null;
  }

  if (
    unit === "mgdl"
  ) {
    return value;
  }

  /*
   * µmol/L → mg/dL
   * divide by 88.4
   */
  return value / 88.4;
}

/* =========================================================
   BMI
========================================================= */

function calculateBMI(
  weightKg: number,
  heightCm: number
) {
  if (
    weightKg <= 0 ||
    heightCm <= 0
  ) {
    return null;
  }

  const heightM =
    heightCm / 100;

  return round1(
    weightKg /
      (
        heightM *
        heightM
      )
  );
}

/* =========================================================
   IBW - DEVINE
========================================================= */

function calculateIBW(
  sex: Sex,
  heightCm: number
) {
  if (
    heightCm <= 0
  ) {
    return null;
  }

  const heightInches =
    heightCm / 2.54;

  const difference =
    heightInches - 60;

  const ibw =
    sex === "male"
      ? 50 +
        2.3 *
          difference
      : 45.5 +
        2.3 *
          difference;

  return round1(
    Math.max(
      ibw,
      1
    )
  );
}

/* =========================================================
   ADJUSTED BODY WEIGHT
========================================================= */

function calculateAdjBW(
  actualWeight: number,
  idealWeight: number
) {
  if (
    actualWeight <= 0 ||
    idealWeight <= 0
  ) {
    return null;
  }

  return round1(
    idealWeight +
      0.4 *
        (
          actualWeight -
          idealWeight
        )
  );
}

/* =========================================================
   BSA - MOSTELLER
========================================================= */

function calculateBSA(
  weightKg: number,
  heightCm: number
) {
  if (
    weightKg <= 0 ||
    heightCm <= 0
  ) {
    return null;
  }

  return round2(
    Math.sqrt(
      (
        heightCm *
        weightKg
      ) /
        3600
    )
  );
}

/* =========================================================
   COCKCROFT-GAULT
========================================================= */

function calculateCrCl({
  age,
  weightKg,
  serumCreatinineMgDl,
  sex,
}: {
  age: number;

  weightKg: number;

  serumCreatinineMgDl:
    number;

  sex: Sex;
}) {
  if (
    age <= 0 ||
    age >= 140 ||
    weightKg <= 0 ||
    serumCreatinineMgDl <= 0
  ) {
    return null;
  }

  let result =
    (
      (
        140 -
        age
      ) *
      weightKg
    ) /
    (
      72 *
      serumCreatinineMgDl
    );

  if (
    sex === "female"
  ) {
    result *= 0.85;
  }

  return round1(
    result
  );
}

/* =========================================================
   CKD-EPI 2021 CREATININE
========================================================= */

function calculateCkdEpi2021({
  age,
  sex,
  serumCreatinineMgDl,
}: {
  age: number;

  sex: Sex;

  serumCreatinineMgDl:
    number;
}) {
  if (
    age < 18 ||
    serumCreatinineMgDl <= 0
  ) {
    return null;
  }

  const k =
    sex === "female"
      ? 0.7
      : 0.9;

  const alpha =
    sex === "female"
      ? -0.241
      : -0.302;

  const ratio =
    serumCreatinineMgDl /
    k;

  const minimum =
    Math.min(
      ratio,
      1
    );

  const maximum =
    Math.max(
      ratio,
      1
    );

  let egfr =
    142 *
    Math.pow(
      minimum,
      alpha
    ) *
    Math.pow(
      maximum,
      -1.2
    ) *
    Math.pow(
      0.9938,
      age
    );

  if (
    sex === "female"
  ) {
    egfr *= 1.012;
  }

  return round1(
    egfr
  );
}

/* =========================================================
   DE-INDEX eGFR
========================================================= */

function calculateAbsoluteEgfr(
  indexedEgfr: number,
  bsa: number
) {
  if (
    indexedEgfr <= 0 ||
    bsa <= 0
  ) {
    return null;
  }

  return round1(
    indexedEgfr *
      (
        bsa /
        1.73
      )
  );
}

/* =========================================================
   GFR CATEGORY

   Không gọi đây là "chẩn đoán CKD",
   vì CKD cần bằng chứng mạn tính.
========================================================= */

function getGfrCategory(
  egfr: number | null
) {
  if (
    egfr === null
  ) {
    return "--";
  }

  if (
    egfr >= 90
  ) {
    return "G1";
  }

  if (
    egfr >= 60
  ) {
    return "G2";
  }

  if (
    egfr >= 45
  ) {
    return "G3a";
  }

  if (
    egfr >= 30
  ) {
    return "G3b";
  }

  if (
    egfr >= 15
  ) {
    return "G4";
  }

  return "G5";
}

/* =========================================================
   RENAL RANGE MATCH
========================================================= */

function matchesRenalRange(
  crcl: number,
  range: RenalDoseRange
) {
  if (
    range.minCrCl !==
    undefined
  ) {
    if (
      range.minInclusive ===
      false
    ) {
      if (
        crcl <=
        range.minCrCl
      ) {
        return false;
      }
    } else {
      if (
        crcl <
        range.minCrCl
      ) {
        return false;
      }
    }
  }

  if (
    range.maxCrCl !==
    undefined
  ) {
    if (
      range.maxInclusive ===
      false
    ) {
      if (
        crcl >=
        range.maxCrCl
      ) {
        return false;
      }
    } else {
      if (
        crcl >
        range.maxCrCl
      ) {
        return false;
      }
    }
  }

  return true;
}

/* =========================================================
   MATCH DRUG → RENAL DATABASE
========================================================= */

function getProfilesForDrug(
  drug: Drug | undefined
) {
  if (!drug) {
    return [];
  }

  const ingredientId =
    normalizeText(
      drug.ingredientId
    );

  const ingredientName =
    normalizeText(
      drug.ingredientName
    );

  return renalDosingDatabase.filter(
    (profile) => {
      const profileId =
        normalizeText(
          profile.ingredientId
        );

      if (
        ingredientId ===
        profileId
      ) {
        return true;
      }

      return profile.keywords.some(
        (keyword) => {
          const normalizedKeyword =
            normalizeText(
              keyword
            );

          return (
            ingredientName.includes(
              normalizedKeyword
            ) ||
            ingredientId.includes(
              normalizedKeyword
            )
          );
        }
      );
    }
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function RenalPage() {
  /* PATIENT */

  const [
    age,
    setAge,
  ] = useState("");

  const [
    sex,
    setSex,
  ] =
    useState<Sex>(
      "male"
    );

  const [
    actualWeight,
    setActualWeight,
  ] = useState("");

  const [
    height,
    setHeight,
  ] = useState("");

  const [
    serumCreatinine,
    setSerumCreatinine,
  ] = useState("");

  const [
    creatinineUnit,
    setCreatinineUnit,
  ] =
    useState<CreatinineUnit>(
      "umol"
    );

  const [
    weightMethod,
    setWeightMethod,
  ] =
    useState<WeightMethod>(
      "abw"
    );

  const [
    dialysisMode,
    setDialysisMode,
  ] =
    useState<DialysisMode>(
      "none"
    );

  /* DRUG */

  const [
    drugSearch,
    setDrugSearch,
  ] = useState("");

  const [
    selectedDrugId,
    setSelectedDrugId,
  ] = useState("");

  const [
    selectedProfileId,
    setSelectedProfileId,
  ] = useState("");

  /* =======================================================
     PARSED NUMBERS
  ======================================================= */

  const patient =
    useMemo(
      () => ({
        age:
          Number(age),

        weight:
          Number(
            actualWeight
          ),

        height:
          Number(height),

        creatinine:
          Number(
            serumCreatinine
          ),
      }),
      [
        age,
        actualWeight,
        height,
        serumCreatinine,
      ]
    );

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const scrMgDl =
    useMemo(
      () =>
        convertSCrToMgDl(
          patient.creatinine,
          creatinineUnit
        ),
      [
        patient.creatinine,
        creatinineUnit,
      ]
    );

  const bmi =
    useMemo(
      () =>
        calculateBMI(
          patient.weight,
          patient.height
        ),
      [
        patient.weight,
        patient.height,
      ]
    );

  const ibw =
    useMemo(
      () =>
        calculateIBW(
          sex,
          patient.height
        ),
      [
        sex,
        patient.height,
      ]
    );

  const adjBW =
    useMemo(
      () =>
        ibw !== null
          ? calculateAdjBW(
              patient.weight,
              ibw
            )
          : null,
      [
        patient.weight,
        ibw,
      ]
    );

  const bsa =
    useMemo(
      () =>
        calculateBSA(
          patient.weight,
          patient.height
        ),
      [
        patient.weight,
        patient.height,
      ]
    );

  const selectedWeight =
    useMemo(
      () => {
        if (
          weightMethod ===
          "ibw"
        ) {
          return (
            ibw ??
            patient.weight
          );
        }

        if (
          weightMethod ===
          "adjbw"
        ) {
          return (
            adjBW ??
            patient.weight
          );
        }

        return patient.weight;
      },
      [
        weightMethod,
        patient.weight,
        ibw,
        adjBW,
      ]
    );

  const crcl =
    useMemo(
      () => {
        if (
          scrMgDl === null
        ) {
          return null;
        }

        return calculateCrCl({
          age:
            patient.age,

          weightKg:
            selectedWeight,

          serumCreatinineMgDl:
            scrMgDl,

          sex,
        });
      },
      [
        patient.age,
        selectedWeight,
        scrMgDl,
        sex,
      ]
    );

  const egfr =
    useMemo(
      () => {
        if (
          scrMgDl === null
        ) {
          return null;
        }

        return calculateCkdEpi2021({
          age:
            patient.age,

          sex,

          serumCreatinineMgDl:
            scrMgDl,
        });
      },
      [
        patient.age,
        sex,
        scrMgDl,
      ]
    );

  const absoluteEgfr =
    useMemo(
      () => {
        if (
          egfr === null ||
          bsa === null
        ) {
          return null;
        }

        return calculateAbsoluteEgfr(
          egfr,
          bsa
        );
      },
      [
        egfr,
        bsa,
      ]
    );

  /* =======================================================
     DRUG SEARCH
  ======================================================= */

  const drugResults =
    useMemo(
      () => {
        const q =
          normalizeText(
            drugSearch
          );

        if (!q) {
          return [];
        }

        return hospitalDrugs
          .filter(
            (drug) => {
              const text =
                normalizeText(
                  [
                    drug.brandName,
                    drug.ingredientName,
                    drug.strength,
                    drug.drugCode,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      " "
                    )
                );

              return text.includes(
                q
              );
            }
          )
          .slice(
            0,
            15
          );
      },
      [
        drugSearch,
      ]
    );

  const selectedDrug =
    useMemo(
      () =>
        hospitalDrugs.find(
          (drug) =>
            drug.id ===
            selectedDrugId
        ),
      [
        selectedDrugId,
      ]
    );

  const availableProfiles =
    useMemo(
      () =>
        getProfilesForDrug(
          selectedDrug
        ),
      [
        selectedDrug,
      ]
    );

  const selectedProfile:
    RenalDoseProfile |
    undefined =
    useMemo(
      () => {
        if (
          selectedProfileId
        ) {
          return availableProfiles.find(
            (profile) =>
              profile.id ===
              selectedProfileId
          );
        }

        return availableProfiles[0];
      },
      [
        availableProfiles,
        selectedProfileId,
      ]
    );

  const renalRecommendation =
    useMemo(
      () => {
        if (
          crcl === null ||
          !selectedProfile
        ) {
          return undefined;
        }

        return selectedProfile.ranges.find(
          (range) =>
            matchesRenalRange(
              crcl,
              range
            )
        );
      },
      [
        crcl,
        selectedProfile,
      ]
    );

  const validPatient =
    patient.age >= 18 &&
    patient.weight > 0 &&
    patient.height > 0 &&
    patient.creatinine > 0;

  /* =======================================================
     CLEAR
  ======================================================= */

  function clearAll() {
    setAge("");

    setSex(
      "male"
    );

    setActualWeight("");

    setHeight("");

    setSerumCreatinine("");

    setCreatinineUnit(
      "umol"
    );

    setWeightMethod(
      "abw"
    );

    setDialysisMode(
      "none"
    );

    setDrugSearch("");

    setSelectedDrugId("");

    setSelectedProfileId("");
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="mb-8">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Công cụ lâm sàng
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Chức năng thận & Hiệu chỉnh liều
          </h1>

          <p className="mt-3 max-w-4xl leading-7 text-slate-600">
            Tính BMI, IBW, AdjBW,
            BSA, CrCl theo Cockcroft–Gault
            và eGFR CKD-EPI 2021;
            đồng thời đối chiếu dữ liệu
            hiệu chỉnh liều đã được
            thẩm định.
          </p>

        </header>

        {/* =================================================
            PATIENT + RESULT
        ================================================= */}

        <div className="grid gap-6 xl:grid-cols-2">

          {/* PATIENT */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold text-slate-900">
                01. Thông tin người bệnh
              </h2>

              <button
                type="button"
                onClick={
                  clearAll
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Xóa dữ liệu
              </button>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <InputField
                label="Tuổi"
                value={
                  age
                }
                onChange={
                  setAge
                }
                placeholder="Ví dụ: 68"
                unit="tuổi"
              />

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Giới tính
                </label>

                <select
                  value={
                    sex
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setSex(
                        event
                          .target
                          .value as Sex
                      )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                >

                  <option value="male">
                    Nam
                  </option>

                  <option value="female">
                    Nữ
                  </option>

                </select>

              </div>

              <InputField
                label="Cân nặng thực tế"
                value={
                  actualWeight
                }
                onChange={
                  setActualWeight
                }
                placeholder="Ví dụ: 70"
                unit="kg"
              />

              <InputField
                label="Chiều cao"
                value={
                  height
                }
                onChange={
                  setHeight
                }
                placeholder="Ví dụ: 165"
                unit="cm"
              />

            </div>

            {/* CREATININE */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Creatinin huyết thanh
              </label>

              <div className="grid gap-3 sm:grid-cols-[1fr_150px]">

                <input
                  type="number"
                  min="0"
                  step="any"
                  value={
                    serumCreatinine
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setSerumCreatinine(
                        event
                          .target
                          .value
                      )
                  }
                  placeholder={
                    creatinineUnit ===
                    "umol"
                      ? "Ví dụ: 106"
                      : "Ví dụ: 1.2"
                  }
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500"
                />

                <select
                  value={
                    creatinineUnit
                  }
                  onChange={
                    (
                      event
                    ) =>
                      setCreatinineUnit(
                        event
                          .target
                          .value as
                          CreatinineUnit
                      )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                >

                  <option value="umol">
                    µmol/L
                  </option>

                  <option value="mgdl">
                    mg/dL
                  </option>

                </select>

              </div>

              {scrMgDl !==
                null && (

                <p className="mt-2 text-xs text-slate-500">
                  SCr quy đổi:
                  {" "}
                  <strong>
                    {round2(
                      scrMgDl
                    )}{" "}
                    mg/dL
                  </strong>
                </p>

              )}

            </div>

            {/* WEIGHT METHOD */}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <p className="font-semibold text-slate-900">
                Cân nặng sử dụng cho Cockcroft–Gault
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Chọn theo bối cảnh người bệnh,
                thuốc và quy trình hiệu chỉnh
                liều của đơn vị.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">

                <WeightButton
                  active={
                    weightMethod ===
                    "abw"
                  }
                  title="ABW"
                  subtitle={
                    patient.weight >
                    0
                      ? `${patient.weight} kg`
                      : "Cân nặng thực tế"
                  }
                  onClick={
                    () =>
                      setWeightMethod(
                        "abw"
                      )
                  }
                />

                <WeightButton
                  active={
                    weightMethod ===
                    "ibw"
                  }
                  title="IBW"
                  subtitle={
                    ibw !== null
                      ? `${ibw} kg`
                      : "Cân nặng lý tưởng"
                  }
                  onClick={
                    () =>
                      setWeightMethod(
                        "ibw"
                      )
                  }
                />

                <WeightButton
                  active={
                    weightMethod ===
                    "adjbw"
                  }
                  title="AdjBW"
                  subtitle={
                    adjBW !== null
                      ? `${adjBW} kg`
                      : "Cân nặng hiệu chỉnh"
                  }
                  onClick={
                    () =>
                      setWeightMethod(
                        "adjbw"
                      )
                  }
                />

              </div>

            </div>

            {/* DIALYSIS */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Điều trị thay thế thận
              </label>

              <select
                value={
                  dialysisMode
                }
                onChange={
                  (
                    event
                  ) =>
                    setDialysisMode(
                      event
                        .target
                        .value as
                        DialysisMode
                    )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >

                <option value="none">
                  Không
                </option>

                <option value="hd">
                  Thẩm tách máu ngắt quãng
                </option>

                <option value="crrt">
                  CRRT
                </option>

                <option value="pd">
                  Thẩm phân phúc mạc
                </option>

              </select>

            </div>

          </section>

          {/* RESULT */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              02. Kết quả chức năng thận
            </h2>

            {!validPatient ? (

              <div className="mt-6 flex min-h-[350px] items-center justify-center rounded-2xl bg-slate-50 p-8 text-center">

                <div>

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 font-bold text-teal-700">
                    Rx
                  </div>

                  <p className="mt-4 font-semibold text-slate-700">
                    Chưa có kết quả
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Nhập đầy đủ tuổi,
                    giới tính, cân nặng,
                    chiều cao và creatinin.
                  </p>

                </div>

              </div>

            ) : (

              <div className="mt-6 space-y-5">

                <div className="grid gap-3 sm:grid-cols-2">

                  <ResultCard
                    label="BMI"
                    value={
                      bmi !== null
                        ? `${bmi} kg/m²`
                        : "--"
                    }
                  />

                  <ResultCard
                    label="BSA"
                    value={
                      bsa !== null
                        ? `${bsa} m²`
                        : "--"
                    }
                  />

                  <ResultCard
                    label="IBW"
                    value={
                      ibw !== null
                        ? `${ibw} kg`
                        : "--"
                    }
                  />

                  <ResultCard
                    label="AdjBW"
                    value={
                      adjBW !== null
                        ? `${adjBW} kg`
                        : "--"
                    }
                  />

                </div>

                <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">

                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    Cockcroft–Gault
                  </p>

                  <p className="mt-2 text-3xl font-bold text-teal-950">
                    {crcl !== null
                      ? `${crcl} mL/phút`
                      : "--"}
                  </p>

                  <p className="mt-2 text-sm text-teal-800">
                    Cân nặng sử dụng:
                    {" "}
                    <strong>
                      {selectedWeight >
                      0
                        ? `${round1(
                            selectedWeight
                          )} kg`
                        : "--"}
                    </strong>
                  </p>

                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                    CKD-EPI 2021
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-950">
                    {egfr !== null
                      ? `${egfr} mL/phút/1,73 m²`
                      : "--"}
                  </p>

                  <p className="mt-2 text-sm text-blue-800">
                    Phân nhóm GFR:
                    {" "}
                    <strong>
                      {getGfrCategory(
                        egfr
                      )}
                    </strong>
                  </p>

                  <p className="mt-1 text-sm text-blue-800">
                    eGFR khử chuẩn hóa:
                    {" "}
                    <strong>
                      {absoluteEgfr !==
                      null
                        ? `${absoluteEgfr} mL/phút`
                        : "--"}
                    </strong>
                  </p>

                </div>

              </div>

            )}

          </section>

        </div>

        {/* =================================================
            DRUG DOSING
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              03. Hiệu chỉnh liều
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Chọn thuốc trong danh mục BV199
            </h2>

          </div>

          {/* SEARCH DRUG */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tìm thuốc
            </label>

            <input
              type="text"
              value={
                drugSearch
              }
              onChange={
                (
                  event
                ) => {
                  setDrugSearch(
                    event
                      .target
                      .value
                  );

                  setSelectedDrugId(
                    ""
                  );

                  setSelectedProfileId(
                    ""
                  );
                }
              }
              placeholder="Ví dụ: meropenem..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500"
            />

            {drugSearch &&
              !selectedDrugId &&
              drugResults.length >
                0 && (

              <div className="mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">

                {drugResults.map(
                  (drug) => (

                    <button
                      key={
                        drug.id
                      }
                      type="button"
                      onClick={
                        () => {
                          setSelectedDrugId(
                            drug.id
                          );

                          setDrugSearch(
                            drug.brandName ??
                              drug.ingredientName ??
                              ""
                          );

                          setSelectedProfileId(
                            ""
                          );
                        }
                      }
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
                    >

                      <p className="font-semibold text-slate-900">
                        {
                          drug.brandName
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          drug.ingredientName
                        }

                        {drug.strength
                          ? ` • ${drug.strength}`
                          : ""}

                        {drug.route
                          ? ` • ${drug.route}`
                          : ""}
                      </p>

                    </button>

                  )
                )}

              </div>

            )}

          </div>

          {/* SELECTED DRUG */}

          {selectedDrug && (

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Thuốc đã chọn
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {
                  selectedDrug.brandName
                }
              </h3>

              <p className="mt-1 font-semibold text-blue-700">
                {
                  selectedDrug.ingredientName
                }
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {selectedDrug.strength && (
                  <Badge>
                    {
                      selectedDrug.strength
                    }
                  </Badge>
                )}

                {selectedDrug.route && (
                  <Badge>
                    {
                      selectedDrug.route
                    }
                  </Badge>
                )}

                {selectedDrug.dosageForm && (
                  <Badge>
                    {
                      selectedDrug.dosageForm
                    }
                  </Badge>
                )}

              </div>

            </div>

          )}

          {/* PROFILE */}

          {selectedDrug &&
            availableProfiles.length >
              0 && (

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Chỉ định / phác đồ
              </label>

              <select
                value={
                  selectedProfile
                    ?.id ??
                  ""
                }
                onChange={
                  (
                    event
                  ) =>
                    setSelectedProfileId(
                      event
                        .target
                        .value
                    )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >

                {availableProfiles.map(
                  (
                    profile
                  ) => (

                    <option
                      key={
                        profile.id
                      }
                      value={
                        profile.id
                      }
                    >
                      {
                        profile.indicationLabel
                      }
                    </option>

                  )
                )}

              </select>

            </div>

          )}

          {/* NO DATA */}

          {selectedDrug &&
            availableProfiles.length ===
              0 && (

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">

              <p className="font-bold text-amber-950">
                Chưa có dữ liệu hiệu chỉnh liều đã thẩm định
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-900">
                Thuốc có trong Drug Master BV199,
                nhưng chưa có dữ liệu renal dosing
                trong cơ sở dữ liệu lâm sàng.
                Không tự suy diễn liều.
              </p>

            </div>

          )}

          {/* RECOMMENDATION */}

          {selectedProfile &&
            crcl !== null && (

            <div className="mt-6">

              <div className="grid gap-4 lg:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 p-5">

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Liều khi chức năng thận bình thường
                  </p>

                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {
                      selectedProfile.normalDose
                    }
                    {" • "}
                    {
                      selectedProfile.normalInterval
                    }
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {
                      selectedProfile.indicationLabel
                    }
                  </p>

                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    Khuyến nghị theo CrCl
                  </p>

                  {dialysisMode !==
                  "none" ? (

                    <>

                      <p className="mt-2 font-bold text-amber-900">
                        Người bệnh đang điều trị thay thế thận
                      </p>

                      <p className="mt-2 text-sm leading-6 text-amber-800">
                        Không áp dụng máy móc
                        bảng CrCl thông thường.
                        Cần sử dụng khuyến cáo
                        riêng cho phương thức
                        thay thế thận.
                      </p>

                      {selectedProfile.dialysisNote && (

                        <p className="mt-2 text-sm leading-6 text-amber-800">
                          {
                            selectedProfile.dialysisNote
                          }
                        </p>

                      )}

                    </>

                  ) : renalRecommendation ? (

                    <>

                      <p className="mt-2 text-sm font-semibold text-emerald-800">
                        {
                          renalRecommendation.label
                        }
                      </p>

                      <p className="mt-2 text-2xl font-bold text-emerald-950">
                        {
                          renalRecommendation.dose
                        }
                        {" • "}
                        {
                          renalRecommendation.interval
                        }
                      </p>

                      {renalRecommendation.note && (

                        <p className="mt-3 text-sm leading-6 text-emerald-800">
                          {
                            renalRecommendation.note
                          }
                        </p>

                      )}

                    </>

                  ) : (

                    <p className="mt-2 text-sm text-slate-600">
                      Không tìm thấy khoảng CrCl phù hợp.
                    </p>

                  )}

                </div>

              </div>

              {/* SOURCE */}

              <div className="mt-4 rounded-xl bg-slate-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Nguồn
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {
                    selectedProfile.source
                      .organization
                  }
                  {" – "}
                  {
                    selectedProfile.source
                      .title
                  }
                  {" ("}
                  {
                    selectedProfile.source
                      .year
                  }
                  {")"}
                </p>

                <a
                  href={
                    selectedProfile.source
                      .url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline"
                >
                  Mở tài liệu nguồn →
                </a>

              </div>

            </div>

          )}

        </section>

        {/* =================================================
            CLINICAL NOTES
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <h2 className="font-bold text-amber-950">
            Lưu ý lâm sàng
          </h2>

          <div className="mt-3 space-y-2 text-sm leading-6 text-amber-900">

            <p>
              • Cockcroft–Gault và CKD-EPI
              không phải là hai giá trị có thể
              thay thế cho nhau trong mọi nhãn thuốc.
            </p>

            <p>
              • Khi đưa ra quyết định chỉnh liều,
              ưu tiên phương pháp đánh giá chức năng
              thận đã được sử dụng trong nhãn thuốc
              hoặc guideline của chính thuốc đó.
            </p>

            <p>
              • Không sử dụng máy tính này một cách
              máy móc ở suy thận cấp, creatinin đang
              thay đổi nhanh, thai kỳ, khối cơ bất
              thường hoặc người bệnh đang điều trị
              thay thế thận.
            </p>

            <p>
              • Kết quả hỗ trợ quyết định lâm sàng,
              không thay thế đánh giá của bác sĩ
              hoặc dược sĩ lâm sàng.
            </p>

          </div>

        </section>

        {/* =================================================
            METHOD
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Phương pháp
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">

            <MethodCard
              title="Cockcroft–Gault"
              text="Ước tính độ thanh thải creatinin theo tuổi, giới, cân nặng và SCr. Nhiều nhãn thuốc lịch sử sử dụng CrCl để xây dựng khuyến cáo chỉnh liều."
            />

            <MethodCard
              title="CKD-EPI 2021"
              text="Phương trình eGFR creatinine không sử dụng hệ số chủng tộc; kết quả chuẩn hóa theo diện tích bề mặt cơ thể 1,73 m²."
            />

          </div>

        </section>

      </div>

    </main>
  );
}

/* =========================================================
   UI COMPONENTS
========================================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
  unit,
}: {
  label: string;

  value: string;

  onChange:
    (
      value: string
    ) => void;

  placeholder: string;

  unit: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex">

        <input
          type="number"
          min="0"
          step="any"
          value={
            value
          }
          onChange={
            (
              event
            ) =>
              onChange(
                event
                  .target
                  .value
              )
          }
          placeholder={
            placeholder
          }
          className="min-w-0 flex-1 rounded-l-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500"
        />

        <div className="flex items-center rounded-r-xl border border-l-0 border-slate-300 bg-slate-50 px-3 text-xs text-slate-500">
          {unit}
        </div>

      </div>

    </div>
  );
}

function WeightButton({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;

  title: string;

  subtitle: string;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={
        active
          ? "rounded-xl border border-teal-500 bg-teal-50 p-4 text-left"
          : "rounded-xl border border-slate-200 bg-white p-4 text-left hover:bg-slate-50"
      }
    >

      <p className="font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {subtitle}
      </p>

    </button>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function Badge({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function MethodCard({
  title,
  text,
}: {
  title: string;

  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <p className="font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>
  );
}