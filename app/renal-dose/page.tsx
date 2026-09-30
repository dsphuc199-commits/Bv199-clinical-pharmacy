"use client";
"use client";

import { useMemo, useState } from "react";

type Sex = "male" | "female";
type ScrUnit = "mg/dL" | "umol/L";

type RenalRule = {
  minCrCl: number;
  maxCrCl: number;
  recommendation: string;
};

type DrugRule = {
  name: string;
  note?: string;
  rules: RenalRule[];
};

const renalDoseDatabase: DrugRule[] = [
  {
    name: "Meropenem",
    note:
      "Dữ liệu minh họa. Cần thay bằng khuyến cáo đã được bệnh viện phê duyệt trước khi sử dụng lâm sàng.",
    rules: [
      {
        minCrCl: 50,
        maxCrCl: Infinity,
        recommendation: "Chưa cần hiệu chỉnh theo chức năng thận trong bảng minh họa.",
      },
      {
        minCrCl: 26,
        maxCrCl: 49.999,
        recommendation: "Cần xem xét giảm liều hoặc kéo dài khoảng cách dùng thuốc.",
      },
      {
        minCrCl: 10,
        maxCrCl: 25.999,
        recommendation: "Cần hiệu chỉnh liều đáng kể theo chức năng thận.",
      },
      {
        minCrCl: 0,
        maxCrCl: 9.999,
        recommendation:
          "Suy thận nặng. Cần cá thể hóa chế độ liều và đánh giá tình trạng lọc máu.",
      },
    ],
  },
  {
    name: "Levofloxacin",
    note:
      "Dữ liệu minh họa. Cần nhập regimen cụ thể và nguồn chính thức trước khi dùng thực tế.",
    rules: [
      {
        minCrCl: 50,
        maxCrCl: Infinity,
        recommendation: "Không cần hiệu chỉnh trong bảng minh họa.",
      },
      {
        minCrCl: 20,
        maxCrCl: 49.999,
        recommendation: "Cần hiệu chỉnh liều hoặc khoảng cách liều.",
      },
      {
        minCrCl: 0,
        maxCrCl: 19.999,
        recommendation:
          "Cần hiệu chỉnh rõ rệt; nếu lọc máu phải áp dụng phác đồ riêng.",
      },
    ],
  },
  {
    name: "Ciprofloxacin",
    note:
      "Dữ liệu minh họa. Chế độ liều phụ thuộc chỉ định, đường dùng và mức độ nhiễm khuẩn.",
    rules: [
      {
        minCrCl: 50,
        maxCrCl: Infinity,
        recommendation: "Không cần hiệu chỉnh trong bảng minh họa.",
      },
      {
        minCrCl: 30,
        maxCrCl: 49.999,
        recommendation: "Cần đánh giá hiệu chỉnh tùy chế độ liều.",
      },
      {
        minCrCl: 0,
        maxCrCl: 29.999,
        recommendation: "Cần giảm tổng liều hoặc kéo dài khoảng cách liều.",
      },
    ],
  },
];

export default function RenalDosePage() {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [weight, setWeight] = useState("");
  const [scr, setScr] = useState("");
  const [scrUnit, setScrUnit] = useState<ScrUnit>("mg/dL");
  const [drugName, setDrugName] = useState("Meropenem");
  const [showResult, setShowResult] = useState(false);

  const scrMgDl = useMemo(() => {
    const value = Number(scr);

    if (!value || value <= 0) return null;

    return scrUnit === "umol/L" ? value / 88.4 : value;
  }, [scr, scrUnit]);

  const crcl = useMemo(() => {
    const ageValue = Number(age);
    const weightValue = Number(weight);

    if (
      !ageValue ||
      !weightValue ||
      !scrMgDl ||
      ageValue <= 0 ||
      weightValue <= 0 ||
      scrMgDl <= 0
    ) {
      return null;
    }

    let result =
      ((140 - ageValue) * weightValue) / (72 * scrMgDl);

    if (sex === "female") {
      result *= 0.85;
    }

    return result;
  }, [age, weight, scrMgDl, sex]);

  const selectedDrug = renalDoseDatabase.find(
    (drug) => drug.name === drugName
  );

  const renalRecommendation = useMemo(() => {
    if (crcl === null || !selectedDrug) return null;

    return selectedDrug.rules.find(
      (rule) => crcl >= rule.minCrCl && crcl <= rule.maxCrCl
    );
  }, [crcl, selectedDrug]);

  function handleCalculate() {
    setShowResult(true);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-blue-800 text-white">
        <div className="mx-auto max-w-5xl px-6 py-7">
          <h1 className="text-3xl font-bold">
            Hiệu chỉnh liều theo chức năng thận
          </h1>

          <p className="mt-2 text-blue-100">
            Ước tính độ thanh thải creatinin theo Cockcroft–Gault
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-6 py-8 md:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            Thông tin bệnh nhân
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-medium">Tuổi</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ví dụ: 65"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Giới tính</label>

              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as Sex)}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium">
                Cân nặng (kg)
              </label>

              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ví dụ: 60"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">
                Creatinin huyết thanh
              </label>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  step="any"
                  value={scr}
                  onChange={(e) => setScr(e.target.value)}
                  placeholder={scrUnit === "mg/dL" ? "Ví dụ: 1.2" : "Ví dụ: 106"}
                  className="col-span-2 rounded-lg border px-4 py-3"
                />

                <select
                  value={scrUnit}
                  onChange={(e) =>
                    setScrUnit(e.target.value as ScrUnit)
                  }
                  className="rounded-lg border px-3 py-3"
                >
                  <option value="mg/dL">mg/dL</option>
                  <option value="umol/L">µmol/L</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block font-medium">Thuốc</label>

              <select
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              >
                {renalDoseDatabase.map((drug) => (
                  <option key={drug.name} value={drug.name}>
                    {drug.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Tính CrCl và đánh giá liều
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">Kết quả</h2>

          {!showResult ? (
            <p className="text-slate-500">
              Nhập thông tin bệnh nhân và bấm nút tính.
            </p>
          ) : crcl === null ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
              Vui lòng nhập đầy đủ và đúng các thông số.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl bg-blue-50 p-5">
                <p className="text-sm text-slate-600">
                  Creatinine clearance
                </p>

                <p className="mt-1 text-4xl font-bold text-blue-800">
                  {crcl.toFixed(1)}
                  <span className="ml-2 text-lg font-medium">
                    mL/phút
                  </span>
                </p>
              </div>

              {scrUnit === "umol/L" && scrMgDl !== null && (
                <div>
                  <p className="text-sm text-slate-500">
                    Creatinin quy đổi
                  </p>
                  <p className="font-semibold">
                    {scrMgDl.toFixed(2)} mg/dL
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500">Thuốc</p>
                <p className="text-xl font-semibold">{drugName}</p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <p className="font-semibold text-amber-900">
                  Khuyến cáo theo chức năng thận
                </p>

                <p className="mt-2 leading-7 text-amber-900">
                  {renalRecommendation?.recommendation ??
                    "Chưa có dữ liệu phù hợp."}
                </p>
              </div>

              {selectedDrug?.note && (
                <div className="rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
                  {selectedDrug.note}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-10">
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
          Công cụ này hiện đang ở giai đoạn phát triển. Không sử dụng dữ liệu
          minh họa để quyết định điều trị. Cần đối chiếu chỉ định, mức độ nhiễm
          khuẩn, cân nặng sử dụng trong Cockcroft–Gault, chức năng thận ổn định,
          RRT/CRRT và tài liệu được phê duyệt trước khi đưa ra khuyến cáo liều.
        </div>
      </div>
    </main>
  );
}