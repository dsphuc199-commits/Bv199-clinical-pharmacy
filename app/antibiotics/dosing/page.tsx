"use client";

/*
  FILE: app/antibiotics/dosing/page.tsx
  Hieu chinh lieu khang sinh theo chuc nang than.
  Du lieu: data/renal-dosing.ts (nguon duy nhat, dung chung voi /calculators/renal).
  Khong tu tao lieu: thuoc chua co du lieu -> bao "chua co du lieu".
*/

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  renalDosingDatabase,
  type RenalDoseProfile,
  type RenalDoseRange,
} from "@/data/renal-dosing";

import {
  calculateAdjBW,
  calculateCrClCG,
  calculateIBW,
  convertCreatinineToMgDl,
  roundNumber,
  type CreatinineUnit,
  type Sex,
} from "@/lib/calculations/renal";

/* ---------- tien ich ---------- */

function normalizeText(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function matchesRange(crcl: number, range: RenalDoseRange) {
  if (range.minCrCl !== undefined) {
    if (range.minInclusive === false) {
      if (crcl <= range.minCrCl) return false;
    } else if (crcl < range.minCrCl) {
      return false;
    }
  }

  if (range.maxCrCl !== undefined) {
    if (range.maxInclusive === false) {
      if (crcl >= range.maxCrCl) return false;
    } else if (crcl > range.maxCrCl) {
      return false;
    }
  }

  return true;
}

type DrugGroup = {
  ingredientId: string;
  ingredientName: string;
  keywords: string[];
  profiles: RenalDoseProfile[];
};

const DRUG_GROUPS: DrugGroup[] = (() => {
  const map = new Map<string, DrugGroup>();

  for (const profile of renalDosingDatabase) {
    const existing = map.get(profile.ingredientId);

    if (existing) {
      existing.profiles.push(profile);
      for (const keyword of profile.keywords) {
        if (!existing.keywords.includes(keyword)) {
          existing.keywords.push(keyword);
        }
      }
    } else {
      map.set(profile.ingredientId, {
        ingredientId: profile.ingredientId,
        ingredientName: profile.ingredientName,
        keywords: [...profile.keywords],
        profiles: [profile],
      });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.ingredientName.localeCompare(b.ingredientName, "vi")
  );
})();

/* ---------- trang ---------- */

export default function AntibioticDosingPage() {
  const [search, setSearch] = useState("");
  const [drugId, setDrugId] = useState("");
  const [profileId, setProfileId] = useState("");

  const [crclInput, setCrclInput] = useState("");

  const [showCalc, setShowCalc] = useState(false);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [scr, setScr] = useState("");
  const [scrUnit, setScrUnit] = useState<CreatinineUnit>("mg/dL");

  const matches = useMemo(() => {
    const q = normalizeText(search);

    if (!q) return DRUG_GROUPS;

    return DRUG_GROUPS.filter((group) =>
      [group.ingredientName, group.ingredientId, ...group.keywords].some(
        (text) => normalizeText(text).includes(q)
      )
    );
  }, [search]);

  const group = DRUG_GROUPS.find((item) => item.ingredientId === drugId);

  const profile: RenalDoseProfile | undefined = group
    ? group.profiles.find((item) => item.id === profileId) ??
      group.profiles[0]
    : undefined;

  /* CrCl tinh tu Cockcroft-Gault */
  const calc = useMemo(() => {
    const a = Number(age);
    const w = Number(weight);
    const h = Number(height);
    const s = Number(scr);

    if (!(a > 0 && w > 0 && h > 0 && s > 0)) return null;

    const scrMgDl = convertCreatinineToMgDl(s, scrUnit);
    const ibw = calculateIBW(sex, h);
    const adjbw = calculateAdjBW(w, ibw);

    /* Can nang dung: thuc te neu <= IBW; hieu chinh neu > 120% IBW; nguoc lai IBW */
    let used = w;
    let method = "cân nặng thực tế";

    if (w > ibw * 1.2) {
      used = adjbw;
      method = "cân nặng hiệu chỉnh (AdjBW)";
    } else if (w > ibw) {
      used = ibw;
      method = "cân nặng lý tưởng (IBW)";
    }

    return {
      crcl: calculateCrClCG(a, used, scrMgDl, sex),
      method,
      used,
      ibw,
    };
  }, [age, weight, height, scr, scrUnit, sex]);

  const crclValue = useMemo(() => {
    if (showCalc && calc) return calc.crcl;

    const n = Number(crclInput);

    return crclInput.trim() !== "" && Number.isFinite(n) && n >= 0
      ? n
      : null;
  }, [showCalc, calc, crclInput]);

  const range =
    profile && crclValue !== null
      ? profile.ranges.find((item) => matchesRange(crclValue, item))
      : undefined;

  function chooseDrug(id: string) {
    setDrugId(id);
    setProfileId("");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Kháng sinh &amp; AMS
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            Hiệu chỉnh liều kháng sinh
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Chọn kháng sinh, chọn chỉ định, nhập CrCl (hoặc tính từ creatinin)
            để xem liều theo chức năng thận. Chỉ hiển thị thuốc đã có dữ liệu
            kèm nguồn.
          </p>
        </header>

        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-6 text-amber-900">
          Nội dung tham khảo, chưa thay thế đánh giá của bác sĩ và dược sĩ
          lâm sàng. Dữ liệu chưa được Hội đồng thuốc và điều trị BV199 phê
          duyệt. Hiện có {DRUG_GROUPS.length} hoạt chất.
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 1. THUOC */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                1. Kháng sinh
              </label>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoạt chất…"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {matches.map((item) => (
                  <button
                    key={item.ingredientId}
                    type="button"
                    onClick={() => chooseDrug(item.ingredientId)}
                    className={
                      "rounded-full border px-3 py-1.5 text-sm " +
                      (item.ingredientId === drugId
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-teal-600")
                    }
                  >
                    {item.ingredientName}
                  </button>
                ))}
              </div>

              {matches.length === 0 && (
                <p className="mt-3 rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
                  Chưa có dữ liệu hiệu chỉnh liều cho thuốc này. Kiểm tra
                  trực tiếp nguồn (Dược thư, nhãn thuốc) hoặc hỏi dược sĩ
                  lâm sàng.
                </p>
              )}

              {group && group.profiles.length > 1 && (
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    2. Chỉ định / nguồn
                  </label>

                  <select
                    value={profile?.id ?? ""}
                    onChange={(e) => setProfileId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
                  >
                    {group.profiles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.indicationLabel} — {item.source.organization}{" "}
                        {item.source.year}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 2. CrCl */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700">
                  3. Chức năng thận (CrCl, mL/phút)
                </label>

                <button
                  type="button"
                  onClick={() => setShowCalc((value) => !value)}
                  className="text-xs font-semibold text-teal-700 underline"
                >
                  {showCalc ? "Nhập CrCl trực tiếp" : "Tính CrCl (Cockcroft-Gault)"}
                </button>
              </div>

              {!showCalc && (
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={crclInput}
                  onChange={(e) => setCrclInput(e.target.value)}
                  placeholder="Ví dụ: 45"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
              )}

              {showCalc && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <label className="grid gap-1">
                    Tuổi
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </label>

                  <label className="grid gap-1">
                    Giới
                    <select
                      value={sex}
                      onChange={(e) => setSex(e.target.value as Sex)}
                      className="rounded-lg border border-slate-300 px-3 py-2"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </label>

                  <label className="grid gap-1">
                    Cân nặng (kg)
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </label>

                  <label className="grid gap-1">
                    Chiều cao (cm)
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </label>

                  <label className="grid gap-1">
                    Creatinin huyết thanh
                    <input
                      type="number"
                      value={scr}
                      onChange={(e) => setScr(e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </label>

                  <label className="grid gap-1">
                    Đơn vị
                    <select
                      value={scrUnit}
                      onChange={(e) =>
                        setScrUnit(e.target.value as CreatinineUnit)
                      }
                      className="rounded-lg border border-slate-300 px-3 py-2"
                    >
                      <option value="mg/dL">mg/dL</option>
                      <option value="µmol/L">µmol/L</option>
                    </select>
                  </label>

                  <div className="col-span-2 rounded-lg bg-slate-100 p-3 text-xs leading-6 text-slate-700">
                    {calc ? (
                      <>
                        CrCl ≈ <strong>{roundNumber(calc.crcl, 1)} mL/phút</strong>{" "}
                        (Cockcroft-Gault, dùng {calc.method}{" "}
                        {roundNumber(calc.used, 1)} kg; IBW{" "}
                        {roundNumber(calc.ibw, 1)} kg).
                      </>
                    ) : (
                      "Nhập đủ tuổi, cân nặng, chiều cao, creatinin để tính."
                    )}
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs leading-6 text-slate-500">
                Công thức này chỉ dùng cho người lớn có creatinin ổn định.
                Người bệnh nặng, AKI, lọc máu, béo phì, cao tuổi suy kiệt:
                đánh giá lâm sàng riêng. Máy tính đầy đủ:{" "}
                <Link
                  href="/calculators/renal"
                  className="font-semibold text-teal-700 underline"
                >
                  /calculators/renal
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* KET QUA */}
        {profile && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              {profile.ingredientName}
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {profile.indicationLabel}
            </p>

            {/* Ket qua theo CrCl */}
            <div className="mt-4">
              {crclValue === null && (
                <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
                  Nhập CrCl để xem liều hiệu chỉnh.
                </p>
              )}

              {crclValue !== null && range && (
                <div className="rounded-xl border-2 border-teal-600 bg-teal-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                    {range.label} · CrCl {roundNumber(crclValue, 1)} mL/phút
                  </p>

                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {range.dose} · {range.interval}
                  </p>

                  {range.note && (
                    <p className="mt-1 text-sm text-slate-700">{range.note}</p>
                  )}
                </div>
              )}

              {crclValue !== null && !range && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  Nguồn dữ liệu không có mức liều cho CrCl này. Không tự suy
                  ra liều; tham khảo trực tiếp nguồn hoặc dược sĩ lâm sàng.
                </p>
              )}
            </div>

            {/* Lieu chuan */}
            <dl className="mt-5 grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-semibold text-slate-500">
                  Liều chuẩn
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {profile.normalDose}
                </dd>
              </div>

              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-semibold text-slate-500">
                  Khoảng cách liều
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {profile.normalInterval}
                </dd>
              </div>

              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-semibold text-slate-500">
                  Đường dùng
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {profile.route ?? "—"}
                </dd>
              </div>
            </dl>

            {/* Bang day du cac muc CrCl */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left text-xs text-slate-600">
                    <th className="border border-slate-200 px-3 py-2">CrCl</th>
                    <th className="border border-slate-200 px-3 py-2">Liều</th>
                    <th className="border border-slate-200 px-3 py-2">
                      Khoảng cách
                    </th>
                    <th className="border border-slate-200 px-3 py-2">
                      Ghi chú
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {profile.ranges.map((item) => (
                    <tr
                      key={item.label}
                      className={item === range ? "bg-teal-50 font-semibold" : ""}
                    >
                      <td className="border border-slate-200 px-3 py-2">
                        {item.label}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        {item.dose}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        {item.interval}
                      </td>
                      <td className="border border-slate-200 px-3 py-2">
                        {item.note ?? ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Thong tin them */}
            <div className="mt-5 grid gap-3 text-sm">
              {profile.adultDoseText && (
                <details className="rounded-lg border border-slate-200 p-3" open>
                  <summary className="cursor-pointer font-semibold">
                    Liều người lớn theo chỉ định
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                    {profile.adultDoseText.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </details>
              )}

              {profile.pediatricDoseText && (
                <details className="rounded-lg border border-slate-200 p-3">
                  <summary className="cursor-pointer font-semibold">
                    Liều trẻ em
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                    {profile.pediatricDoseText.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </details>
              )}

              {profile.dialysisNote && (
                <p className="rounded-lg bg-slate-50 p-3 text-slate-700">
                  <strong>Thẩm tách: </strong>
                  {profile.dialysisNote}
                </p>
              )}

              {profile.hepaticNote && (
                <p className="rounded-lg bg-slate-50 p-3 text-slate-700">
                  <strong>Suy gan: </strong>
                  {profile.hepaticNote}
                </p>
              )}

              {profile.elderlyNote && (
                <p className="rounded-lg bg-slate-50 p-3 text-slate-700">
                  <strong>Người cao tuổi: </strong>
                  {profile.elderlyNote}
                </p>
              )}
            </div>

            {/* Nguon */}
            <div className="mt-5 border-t border-slate-200 pt-3 text-xs leading-6 text-slate-600">
              <p>
                <strong>Nguồn: </strong>
                {profile.source.organization} — {profile.source.title} (
                {profile.source.year})
                {profile.source.page ? `, ${profile.source.page}` : ""}.
                {profile.source.url && (
                  <>
                    {" "}
                    <a
                      href={profile.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-teal-700 underline"
                    >
                      Mở nguồn
                    </a>
                  </>
                )}
              </p>

              <p>
                <strong>Trạng thái: </strong>
                {profile.verification === "da-doi-chieu-nguon"
                  ? "Đã đối chiếu với trang nguồn; chưa được BV199 phê duyệt."
                  : "Chưa được dược sĩ lâm sàng BV199 xác nhận."}
              </p>
            </div>
          </section>
        )}

        {!profile && (
          <p className="mt-5 rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
            Chọn một kháng sinh ở trên để xem liều hiệu chỉnh.
          </p>
        )}
      </div>
    </main>
  );
}
