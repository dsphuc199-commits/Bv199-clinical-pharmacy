"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import drugData from "@/data/drug-products.json";
import type { LeafletSource, RegistryStatus } from "@/lib/drugs/registry";

type RegistryMap = Record<string, { s: RegistryStatus; h: LeafletSource }>;

/* Bo loc theo doi chieu Cong Cuc QLD. */
const STATUS_FILTERS: { value: string; label: string; test: (r?: { s: RegistryStatus; h: LeafletSource }) => boolean }[] = [
  { value: "", label: "Tất cả", test: () => true },
  { value: "hdsd", label: "Có HDSD (Cục QLD)", test: (r) => r?.h === "dav" },
  { value: "hdsd-web", label: "Có thông tin HDSD (web)", test: (r) => r?.h === "web" },
  { value: "hdsd-ref", label: "HDSD tham khảo (cùng hoạt chất)", test: (r) => r?.h === "ref" },
  { value: "hdsd-intl", label: "Tài liệu quốc tế (tiếng Anh)", test: (r) => r?.h === "intl" },
  { value: "chua-hdsd", label: "Chưa có HDSD", test: (r) => !r?.h },
  { value: "canh-bao", label: "SĐK hết hạn / đã rút", test: (r) => r?.s === "het-han" || r?.s === "da-rut" },
  { value: "cho-gia-han", label: "SĐK hết hạn – chờ gia hạn", test: (r) => r?.s === "cho-gia-han" },
  { value: "sap-het-han", label: "SĐK sắp hết hạn (≤ 6 tháng)", test: (r) => r?.s === "sap-het-han" },
  { value: "khong-tim-thay", label: "Không tìm thấy SĐK", test: (r) => r?.s === "khong-tim-thay" },
];

const BADGE: Partial<Record<RegistryStatus, { text: string; style: React.CSSProperties }>> = {
  "da-rut": { text: "Đã rút SĐK", style: { background: "#fde2e2", color: "#8f1d1d" } },
  "het-han": { text: "SĐK hết hiệu lực", style: { background: "#fde2e2", color: "#8f1d1d" } },
  "cho-gia-han": { text: "SĐK chờ gia hạn", style: { background: "#fff1cc", color: "#7a4b00" } },
  "sap-het-han": { text: "SĐK sắp hết hạn", style: { background: "#fff1cc", color: "#7a4b00" } },
  "khong-tim-thay": { text: "Không tìm thấy SĐK", style: { background: "#eef1f4", color: "#4a5a69" } },
};

function StatusBadges({ r }: { r?: { s: RegistryStatus; h: LeafletSource } }) {
  const b = r && BADGE[r.s];
  const pill: React.CSSProperties = { borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700 };
  return <>
    {b && <span style={{ ...pill, ...b.style }}>{b.text}</span>}
    {r?.h === "dav" && <span style={{ ...pill, background: "#e3eefb", color: "#0b3a5b" }}>Có HDSD</span>}
    {r?.h === "web" && <span style={{ ...pill, background: "#eef2f7", color: "#3c5266" }}>HDSD (web)</span>}
    {r?.h === "ref" && <span style={{ ...pill, background: "#f4f0fa", color: "#5a3d7a" }}>HDSD cùng hoạt chất</span>}
    {r?.h === "intl" && <span style={{ ...pill, background: "#eef6f2", color: "#2f5d47" }}>Tài liệu quốc tế</span>}
  </>;
}

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

export default function DrugsClient({ registry, syncedAt }: { registry: RegistryMap; syncedAt: string }) {
  const [keyword, setKeyword] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const statusTest = (STATUS_FILTERS.find((f) => f.value === statusFilter) ?? STATUS_FILTERS[0]).test;
  const [expandedDrug, setExpandedDrug] = useState<string | null>(null);

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

      if (!statusTest(registry[drug.id])) return false;

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
  }, [keyword, selectedRoute, statusTest, registry]);

  return (
    <main className="bv199-drugs-page min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        <div className="bv199-drugs-heading mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Danh mục thuốc Bệnh viện 199
          </h1>

          <p className="mt-2 text-slate-600">
            Tra cứu theo tên thuốc, hoạt chất,
            hàm lượng, đường dùng, số đăng ký
            hoặc nhà sản xuất.
          </p>
        </div>

        <section className="bv199-drug-search-panel rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-4">

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

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Số đăng ký (Cục QLD)
              </label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
                {STATUS_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Tình trạng số đăng ký và Tờ hướng dẫn sử dụng đối chiếu Cổng tra cứu thuốc – Cục Quản lý Dược, cập nhật {syncedAt.split("-").reverse().join("/")}.</p>

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
              setStatusFilter("");
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Xóa bộ lọc
          </button>

        </div>

        <div className="bv199-compact-drug-list">
          {results.slice(0, 100).map((drug, index) => {
            const key = drug.id || String(index);
            const expanded = expandedDrug === key;
            return <article className="bv199-compact-drug" key={key}>
              <button type="button" className="bv199-compact-drug-summary" onClick={() => setExpandedDrug(expanded ? null : key)} aria-expanded={expanded}>
                <span className="bv199-compact-drug-text"><strong>{drug.brandName || "Chưa có tên thuốc"}</strong>
                  <small>{drug.ingredientName || "Chưa có dữ liệu hoạt chất"}</small></span>
                <ChevronRight size={19} className={expanded ? "bv199-rotate" : ""} />
              </button>
              <div className="bv199-compact-tags">
                {drug.strength && <span>{drug.strength}</span>}
                {drug.route && <span>{drug.route}</span>}
                {drug.dosageForm && <span>{drug.dosageForm}</span>}
                <StatusBadges r={registry[drug.id]} />
              </div>
              {expanded && <Link href={`/drugs/${encodeURIComponent(drug.id)}`} className="mt-3 inline-block text-sm font-bold text-[#087f89]">Xem chi tiết, SĐK và HDSD →</Link>}
              {expanded && <div className="bv199-compact-details">
                <Info title="Mã thuốc" value={drug.drugCode}/><Info title="Hoạt chất" value={drug.ingredientName}/>
                <Info title="Hàm lượng" value={drug.strength}/><Info title="Đường dùng" value={drug.route}/>
                <Info title="Dạng bào chế" value={drug.dosageForm}/><Info title="Quy cách" value={drug.packageSize}/>
                <Info title="SĐK / GPNK" value={drug.registrationNumber}/><Info title="Nhà sản xuất" value={drug.manufacturer}/>
                <Info title="Xuất xứ" value={drug.country}/><Info title="Đơn vị" value={drug.unit}/>
                <Info title="Nguồn dữ liệu" value={drug.sourceSheet}/>
              </div>}
            </article>;
          })}
        </div>

        <div className="bv199-original-drug-list space-y-4">

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
                      <Link href={`/drugs/${encodeURIComponent(drug.id)}`} className="hover:text-[#087f89] hover:underline">
                        {drug.brandName ||
                          "Chưa có tên thuốc"}
                      </Link>
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
                      <span className="bv199-status-badges contents"><StatusBadges r={registry[drug.id]} /></span>
                    </div>
                  </div>

                  <Link href={`/drugs/${encodeURIComponent(drug.id)}`} className="self-start whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0b3a5b] hover:bg-slate-50">
                    Chi tiết, SĐK, HDSD →
                  </Link>

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