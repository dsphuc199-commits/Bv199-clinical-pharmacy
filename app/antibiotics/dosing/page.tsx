"use client";

/*
  FILE: app/antibiotics/dosing/page.tsx
  Hieu chinh lieu khang sinh theo chuc nang than.
  Du lieu: data/renal-dosing.ts (nguon duy nhat, dung chung voi /calculators/renal).
  Khong tu tao lieu: thuoc chua co du lieu -> bao "chua co du lieu".
*/

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import BackBar from "@/components/antibiotics/links/BackBar";
import {
  antibiogramHref,
  antibiogramIdFor,
  safeInternalPath,
} from "@/lib/antibiotics/drug-links";

import { renalDosingGaps } from "@/data/renal-dosing-gaps";
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

/*
  Tham so URL (tu module Kinh nghiem / Theo tac nhan):
    drug       ingredientId trong data/renal-dosing.ts
    indication indicationId (chi dinh) neu da khop nguyen van
    why        ly do chon san chi dinh
    regimen    doan phac do goc (hien de doi chieu, khong dung de tinh lieu)
    context    mat benh · tinh huong
    from, fromLabel  duong quay lai
  useSearchParams can Suspense khi build tinh (Next 16).
*/
export default function AntibioticDosingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 p-4 md:p-6" />}>
      <DosingFromUrl />
    </Suspense>
  );
}

function DosingFromUrl() {
  const params = useSearchParams();
  /* Doi URL (bam lien ket khac) -> khoi tao lai trang thai theo tham so moi. */
  return <DosingContent key={params.toString()} params={params} />;
}

type UrlParams = { get(name: string): string | null };

function initialSelection(params: UrlParams) {
  const drug = params.get("drug") ?? "";
  const group = DRUG_GROUPS.find((item) => item.ingredientId === drug);
  if (!group) return { drugId: "", profileId: "", picked: false };

  const indication = params.get("indication");
  const profile = indication
    ? group.profiles.find((item) => item.indicationId === indication)
    : undefined;

  return { drugId: group.ingredientId, profileId: profile?.id ?? "", picked: !!profile };
}

function DosingContent({ params }: { params: UrlParams }) {
  const [initial] = useState(() => initialSelection(params));
  const requestedDrug = params.get("drug");
  const regimenText = params.get("regimen");
  const contextText = params.get("context");
  const pickReason = params.get("why");
  const from = safeInternalPath(params.get("from"));
  const fromLabel = params.get("fromLabel");

  const [search, setSearch] = useState("");
  const [drugId, setDrugId] = useState(initial.drugId);
  const [profileId, setProfileId] = useState(initial.profileId);
  const [profileTouched, setProfileTouched] = useState(false);

  const [crclInput, setCrclInput] = useState(() => {
    /* ?crcl= tu Bo loc lam sang (module Kinh nghiem). */
    const raw = params.get("crcl");
    const value = Number(raw);
    return raw && Number.isFinite(value) && value >= 0 ? String(value) : "";
  });

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

    /* Buoc 4D.3 – cong chan an toan (khong doi cong thuc):
       - Cockcroft-Gault chi dung cho nguoi lon (trang da ghi "chi dung cho nguoi lon").
       - Ham calculateCrClCG tra 0 khi tuoi >= 140; IBW = 0 khi chieu cao rat thap ->
         khong duoc hien thi CrCl = 0 nhu ket qua hop le. */
    if (a < 18) {
      return { blocked: "Người bệnh dưới 18 tuổi: Cockcroft-Gault không áp dụng – không tính. Bảng liều theo CrCl của module là liều người lớn." } as const;
    }
    if (a >= 140) {
      return { blocked: "Tuổi ngoài miền xác định của công thức Cockcroft-Gault – không tính." } as const;
    }

    const scrMgDl = convertCreatinineToMgDl(s, scrUnit);
    const ibw = calculateIBW(sex, h);
    if (!(ibw > 0)) {
      return { blocked: "Chiều cao quá thấp để tính cân nặng lý tưởng (IBW) – không tính. Nhập CrCl trực tiếp theo đánh giá lâm sàng." } as const;
    }
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

    const crcl = calculateCrClCG(a, used, scrMgDl, sex);
    if (!(crcl > 0) || !Number.isFinite(crcl)) {
      return { blocked: "Không tính được CrCl hợp lệ từ dữ liệu đã nhập – kiểm tra lại." } as const;
    }

    return {
      blocked: undefined,
      crcl,
      method,
      used,
      ibw,
      shortHeight: h < 152.4,
    };
  }, [age, weight, height, scr, scrUnit, sex]);

  const crclValue = useMemo(() => {
    /* Che do tinh CrCl: chi dung ket qua tinh hop le; KHONG lay lai so CrCl nhap truoc do
       (hoac tu URL) khi du lieu tinh con thieu/khong hop le. */
    if (showCalc) return calc && !calc.blocked ? calc.crcl : null;

    const n = Number(crclInput);

    return crclInput.trim() !== "" && Number.isFinite(n) && n >= 0
      ? n
      : null;
  }, [showCalc, calc, crclInput]);

  /* Don vi xuat hien trong chuyen luan (chi canh bao, khong quy doi). */
  const unitMix = (() => {
    if (!profile) return "";
    const text = JSON.stringify(profile);
    const found = [
      /triệu đvqt|MIU|đơn vị quốc tế/.test(text) ? "MIU" : "",
      /CBA/.test(text) ? "mg CBA" : "",
      /CMS/.test(text) ? "mg CMS" : "",
    ].filter(Boolean);
    return found.length > 1 ? found.join(", ") : "";
  })();

  const range =
    profile && crclValue !== null
      ? profile.ranges.find((item) => matchesRange(crclValue, item))
      : undefined;

  function chooseDrug(id: string) {
    setDrugId(id);
    setProfileId("");
    setProfileTouched(true);
  }

  /* Duong dan trang hien tai, de Antibiogram quay lai dung thuoc dang xem. */
  const selfParams = new URLSearchParams();
  if (drugId) selfParams.set("drug", drugId);
  if (profile) selfParams.set("indication", profile.indicationId);
  if (from) selfParams.set("from", from);
  if (fromLabel) selfParams.set("fromLabel", fromLabel);
  const selfQuery = selfParams.toString();
  const selfHref = `/antibiotics/dosing${selfQuery ? `?${selfQuery}` : ""}`;

  const abId = group ? antibiogramIdFor(group.ingredientId) : undefined;
  const showRegimen =
    !!regimenText && !profileTouched && drugId === initial.drugId;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <BackBar
          from={from}
          fromLabel={fromLabel}
          fallbackHref="/antibiotics"
          fallbackLabel="Kháng sinh & AMS"
          links={[
            { href: "/antibiotics/empiric/guideline-v9", label: "Kinh nghiệm" },
            { href: "/antibiotics/organism", label: "Theo tác nhân" },
            {
              href: antibiogramHref(
                { antibioticId: abId },
                { from: selfHref, fromLabel: `Hiệu chỉnh liều${group ? ` – ${group.ingredientName}` : ""}` }
              ),
              label: abId && group ? `Antibiogram · ${group.ingredientName}` : "Antibiogram BV199",
            },
          ]}
        />

        {requestedDrug && !initial.drugId && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            Chưa có dữ liệu hiệu chỉnh liều cho hoạt chất được chọn. Không tự
            suy ra liều; tra nguồn gốc hoặc hỏi dược sĩ lâm sàng.
          </div>
        )}

        {(contextText || showRegimen) && (
          <section className="mb-4 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm leading-6 text-slate-800">
            <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
              Từ phác đồ
            </p>
            {contextText && <p className="mt-1 font-semibold">{contextText}</p>}
            {showRegimen && (
              <p className="mt-1 break-words">
                <span className="text-slate-500">Liều trong phác đồ (nguyên văn): </span>
                {regimenText}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-600">
              Bảng dưới là liều theo chức năng thận từ nguồn của module Hiệu
              chỉnh liều; đối chiếu với liều trong phác đồ trước khi áp dụng.
            </p>
          </section>
        )}

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

              {matches.length > 0 && (
                <select
                  size={Math.min(8, Math.max(matches.length, 2))}
                  value={drugId}
                  onChange={(e) => chooseDrug(e.target.value)}
                  aria-label="Danh sách kháng sinh"
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-1 text-sm"
                >
                  {matches.map((item) => (
                    <option
                      key={item.ingredientId}
                      value={item.ingredientId}
                      className="rounded-md px-3 py-1.5"
                    >
                      {item.ingredientName}
                      {item.profiles.length > 1
                        ? ` (${item.profiles.length} chỉ định)`
                        : ""}
                    </option>
                  ))}
                </select>
              )}

              <p className="mt-2 text-xs text-slate-500">
                {matches.length}/{DRUG_GROUPS.length} hoạt chất
              </p>

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
                    onChange={(e) => {
                      setProfileId(e.target.value);
                      setProfileTouched(true);
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
                  >
                    {group.profiles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.indicationLabel} — {item.source.organization}{" "}
                        {item.source.year}
                      </option>
                    ))}
                  </select>

                  {!profileTouched &&
                    drugId === initial.drugId &&
                    (initial.picked || !!requestedDrug) && (
                    <p className="mt-2 rounded-lg bg-slate-100 p-2 text-xs leading-5 text-slate-700">
                      {initial.picked
                        ? `Đã chọn sẵn chỉ định vì ${pickReason ?? "khớp phác đồ"}. Kiểm tra lại trước khi dùng.`
                        : "Phác đồ không đủ thông tin để chọn chỉ định: chọn chỉ định phù hợp ở trên."}
                    </p>
                  )}
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
                    {calc?.blocked ? (
                      <span className="font-semibold text-red-700">{calc.blocked}</span>
                    ) : calc ? (
                      <>
                        CrCl ≈ <strong>{roundNumber(calc.crcl, 1)} mL/phút</strong>{" "}
                        (Cockcroft-Gault, dùng {calc.method}{" "}
                        {roundNumber(calc.used, 1)} kg; IBW{" "}
                        {roundNumber(calc.ibw, 1)} kg).
                        {calc.shortHeight && (
                          <span className="block font-semibold text-amber-800">
                            Chiều cao &lt; 152,4 cm: công thức Devine (IBW) có hạn chế – đối chiếu lâm sàng.
                          </span>
                        )}
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

            {/* Buoc 4D.3: canh bao don vi khi cung mot chuyen luan dung nhieu don vi (vd. colistin) */}
            {unitMix && (
              <div role="alert" className="mt-3 rounded-lg border border-red-300 border-l-4 border-l-red-700 bg-red-50 p-3 text-sm leading-6 text-red-900">
                <strong>Kiểm tra đơn vị trước khi kê:</strong> chuyên luận này dùng nhiều đơn vị ({unitMix}).
                Bảng liều theo CrCl ghi theo triệu đơn vị quốc tế (MIU); công thức Garonzik và ghi chú lọc máu ghi theo
                mg CBA (colistin base activity); mg CMS là colistimethat natri. Không cộng gộp, không tự quy đổi – ứng dụng
                không tính liều theo đơn vị.
              </div>
            )}

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

              {crclValue !== null && !range && profile.ranges.length > 0 && (
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
            {profile.ranges.length > 0 && (
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
            )}

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

              {profile.rangeNote && (
                <p className="rounded-lg bg-slate-50 p-3 text-slate-700">
                  <strong>Cách phân mức: </strong>
                  {profile.rangeNote}
                </p>
              )}

              {profile.renalNarrative && profile.renalNarrative.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-slate-800">
                  <strong>Hiệu chỉnh liều theo Dược thư (dạng mô tả): </strong>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {profile.renalNarrative.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
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
                  ? "Bảng liều đã đối chiếu với ảnh trang nguồn; chưa được BV199 phê duyệt."
                  : "Trích từ văn bản nguồn, chưa đối chiếu ảnh trang; chưa được dược sĩ lâm sàng BV199 xác nhận."}
              </p>
            </div>
          </section>
        )}

        {!profile && (
          <p className="mt-5 rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
            Chọn một kháng sinh ở trên để xem liều hiệu chỉnh.
          </p>
        )}

        <details className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-800">
          <summary className="cursor-pointer font-semibold">
            Thuốc có trong danh mục nhưng Dược thư 2023 không có chuyên luận (
            {renalDosingGaps.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {renalDosingGaps.map((gap) => (
              <li key={gap.name}>
                <strong>{gap.name}: </strong>
                {gap.reason} {gap.suggestion}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </main>
  );
}
