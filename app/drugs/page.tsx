"use client";

import { useMemo, useState } from "react";
import drugData from "@/data/drug-products.json";

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

const drugs = drugData as Drug[];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export default function DrugsPage() {
  const [keyword, setKeyword] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");

  const routes = useMemo(() => {
    return Array.from(
      new Set(
        drugs
          .map((drug) => drug.route)
          .filter(
            (route): route is string =>
              Boolean(route)
          )
      )
    ).sort((a, b) => a.localeCompare(b, "vi"));
  }, []);

  const results = useMemo(() => {
    const q = normalizeText(keyword.trim());

    return drugs.filter((drug) => {
      if (
        selectedRoute &&
        drug.route !== selectedRoute
      ) {
        return false;
      }

      if (!q) return true;

      const text = normalizeText(
        [
          drug.drugCode,
          drug.brandName,
          drug.ingredientName,
          drug.ingredientId,
          drug.strength,
          drug.route,
          drug.dosageForm,
          drug.packageSize,
          drug.registrationNumber,
          drug.manufacturer,
          drug.country,
        ]
          .filter(Boolean)
          .join(" ")
      );

      return text.includes(q);
    });
  }, [keyword, selectedRoute]);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Danh mục thuốc Bệnh viện 199
          </h1>

          <p className="mt-2 text-slate-600">
            Tra cứu theo tên thuốc, hoạt chất,
            hàm lượng, đường dùng, số đăng ký
            hoặc nhà sản xuất.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-3">

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tìm thuốc
              </label>

              <input
                type="text"
                value={keyword}
                onChange={(e) =>
                  setKeyword(e.target.value)
                }
                placeholder="Ví dụ: meropenem, ceftriaxone..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Đường dùng
              </label>

              <select
                value={selectedRoute}
                onChange={(e) =>
                  setSelectedRoute(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="">
                  Tất cả
                </option>

                {routes.map((route) => (
                  <option
                    key={route}
                    value={route}
                  >
                    {route}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </section>

        <div className="my-6 flex items-center justify-between">

          <p className="text-sm text-slate-600">
            Tổng danh mục:{" "}
            <strong>{drugs.length}</strong>
            {" • "}
            Kết quả:{" "}
            <strong>{results.length}</strong>
          </p>

          <button
            type="button"
            onClick={() => {
              setKeyword("");
              setSelectedRoute("");
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Xóa bộ lọc
          </button>

        </div>

        <div className="space-y-4">

          {results
            .slice(0, 100)
            .map((drug, index) => (

              <article
                key={drug.id || index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >

                <div className="flex flex-col gap-4 md:flex-row md:justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {drug.brandName ||
                        "Chưa có tên thuốc"}
                    </h2>

                    {drug.ingredientName && (
                      <p className="mt-1 font-semibold text-blue-700">
                        {drug.ingredientName}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {drug.strength && (
                        <Badge>
                          {drug.strength}
                        </Badge>
                      )}

                      {drug.route && (
                        <Badge>
                          {drug.route}
                        </Badge>
                      )}

                      {drug.dosageForm && (
                        <Badge>
                          {drug.dosageForm}
                        </Badge>
                      )}
                    </div>
                  </div>

                </div>

                <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">

                  <Info
                    title="Mã thuốc"
                    value={drug.drugCode}
                  />

                  <Info
                    title="Hoạt chất"
                    value={drug.ingredientName}
                  />

                  <Info
                    title="Hàm lượng"
                    value={drug.strength}
                  />

                  <Info
                    title="Đường dùng"
                    value={drug.route}
                  />

                  <Info
                    title="Dạng bào chế"
                    value={drug.dosageForm}
                  />

                  <Info
                    title="Quy cách"
                    value={drug.packageSize}
                  />

                  <Info
                    title="SĐK / GPNK"
                    value={drug.registrationNumber}
                  />

                  <Info
                    title="Nhà sản xuất"
                    value={drug.manufacturer}
                  />

                  <Info
                    title="Xuất xứ"
                    value={drug.country}
                  />

                  <Info
                    title="Đơn vị"
                    value={drug.unit}
                  />

                  <Info
                    title="Nguồn dữ liệu"
                    value={drug.sourceSheet}
                  />

                </div>

              </article>

            ))}
        </div>

        {results.length > 100 && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Có {results.length} kết quả.
            Hệ thống đang hiển thị 100 thuốc đầu tiên.
            Hãy nhập tên thuốc hoặc hoạt chất để thu hẹp.
          </div>
        )}

      </div>
    </main>
  );
}

function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-700">
        {value}
      </p>
    </div>
  );
}