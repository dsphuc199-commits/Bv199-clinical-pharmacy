"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import drugData from "../../data/drug-products.json";

type DrugProduct = {
  id: string;
  drugCode: string;
  brandName: string;
  ingredientName: string;
  ingredientId: string;
  strength: string;
  route: string;
  dosageForm: string;
  packageSize: string;
  registrationNumber: string;
  manufacturer: string;
  country: string;
  unit: string;
  sourceSheet: string;
};

export default function DrugsPage() {
  const drugs = drugData as DrugProduct[];

  const [search, setSearch] = useState("");
  const [route, setRoute] = useState("Tất cả");

  const routes = useMemo(() => {
    const values = drugs
      .map((drug) => drug.route)
      .filter((value) => value && value.trim() !== "");

    return ["Tất cả", ...Array.from(new Set(values)).sort()];
  }, [drugs]);

  const filteredDrugs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return drugs.filter((drug) => {
      const matchRoute =
        route === "Tất cả" || drug.route === route;

      const matchSearch =
        keyword === "" ||
        drug.brandName?.toLowerCase().includes(keyword) ||
        drug.ingredientName?.toLowerCase().includes(keyword) ||
        drug.drugCode?.toLowerCase().includes(keyword) ||
        drug.strength?.toLowerCase().includes(keyword) ||
        drug.manufacturer?.toLowerCase().includes(keyword) ||
        drug.registrationNumber?.toLowerCase().includes(keyword);

      return matchRoute && matchSearch;
    });
  }, [drugs, search, route]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
            Bệnh viện 199 - Bộ Công an
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Danh mục thuốc Bệnh viện 199
          </h1>

          <p className="mt-2 text-slate-600">
            Tra cứu thuốc theo tên thuốc, hoạt chất, mã thuốc,
            hàm lượng, số đăng ký hoặc nhà sản xuất.
          </p>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tìm kiếm thuốc
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ví dụ: Meropenem, Atropin, paracetamol..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Đường dùng
            </label>

            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
            >
              {routes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <div className="rounded-xl bg-blue-50 px-4 py-3">
            <span className="text-sm text-slate-600">
              Tổng số thuốc
            </span>
            <div className="text-2xl font-bold text-blue-700">
              {drugs.length.toLocaleString("vi-VN")}
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 px-4 py-3">
            <span className="text-sm text-slate-600">
              Kết quả tìm thấy
            </span>
            <div className="text-2xl font-bold text-emerald-700">
              {filteredDrugs.length.toLocaleString("vi-VN")}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">Tên thuốc</th>
                  <th className="px-4 py-3">Hoạt chất</th>
                  <th className="px-4 py-3">Hàm lượng</th>
                  <th className="px-4 py-3">Đường dùng</th>
                  <th className="px-4 py-3">Dạng bào chế</th>
                  <th className="px-4 py-3">Nhà sản xuất</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredDrugs.slice(0, 100).map((drug, index) => (
                  <tr
                    key={drug.id}
                    className="hover:bg-blue-50"
                  >
                    <td className="px-4 py-4 text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4">
    <Link
  href={`/drugs/${encodeURIComponent(drug.id)}`}
  className="font-semibold text-blue-700 hover:underline"
>
  {drug.brandName || "Chưa có dữ liệu"}
</Link>
                      <div className="mt-1 text-xs text-slate-500">
                        Mã: {drug.drugCode || "—"}
                      </div>
                    </td>

                    <td className="max-w-md px-4 py-4 text-slate-700">
                      {drug.ingredientName || "—"}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {drug.strength || "—"}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {drug.route || "—"}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {drug.dosageForm || "—"}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {drug.manufacturer || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDrugs.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              Không tìm thấy thuốc phù hợp.
            </div>
          )}

          {filteredDrugs.length > 100 && (
            <div className="border-t border-slate-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
              Tìm thấy {filteredDrugs.length.toLocaleString("vi-VN")} thuốc.
              Hiện đang hiển thị 100 kết quả đầu tiên. Hãy nhập từ khóa
              để thu hẹp kết quả.
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
          <strong>Lưu ý:</strong> Danh mục này phục vụ tra cứu thuốc tại
          Bệnh viện 199. Thông tin liều dùng, hiệu chỉnh liều, tương tác
          thuốc và cảnh báo lâm sàng sẽ được xây dựng và thẩm định riêng.
        </div>
      </div>
    </main>
  );
}