/* Module Nhiễm khuẩn tai mũi họng – nạp dữ liệu (JSON có citation) và danh mục nguồn. */
import type { Disease, Source } from "@/types/ent";
import registry from "./sources.registry.json";
import pta from "./diseases/pta.json";
import rpa from "./diseases/rpa.json";
import dni from "./diseases/dni.json";
import gas from "./diseases/gas-pharyngitis.json";
import strep from "./diseases/strep-pharyngitis.json";
import aomAdult from "./diseases/aom-adult.json";
import aomPeds from "./diseases/aom-peds.json";
import abrsPeds from "./diseases/abrs-peds.json";
import abrsAdult from "./diseases/abrs-adult.json";

export const SOURCES = registry.sources as Source[];
export const SOURCES_VERSION = registry.version;
export const DISEASES = [pta, rpa, dni, gas, strep, aomAdult, aomPeds, abrsPeds, abrsAdult] as unknown as Disease[];
export const ENT_IDS = DISEASES.map((d) => d.id);

export function getDisease(id: string): Disease | undefined {
  return DISEASES.find((d) => d.id === id);
}
/** Bệnh tham chiếu chéo (ví dụ strep-pharyngitis dùng dữ liệu gas-pharyngitis). */
export function resolveDisease(id: string): { page: Disease; data: Disease } | undefined {
  const page = getDisease(id);
  if (!page) return undefined;
  const data = page.crossRef ? getDisease(page.crossRef) ?? page : page;
  return { page, data };
}
export function getSource(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}

/** Mặt bệnh Tai Mũi Họng trong Phác đồ kinh nghiệm (catalog v8-*) -> trang module ENT hiển thị ở tab Quốc tế. */
export const ENT_EMPIRIC_MAP: Record<string, { id: string; label: string }[]> = {
  "v8-7": [{ id: "abrs-adult", label: "Người lớn (AAO-HNSF 2025)" }, { id: "abrs-peds", label: "Trẻ 1–18 tuổi (AAP 2013)" }],
  "v8-58": [{ id: "abrs-adult", label: "Người lớn (AAO-HNSF 2025)" }],
  "v8-8": [{ id: "gas-pharyngitis", label: "Trẻ em và người lớn (IDSA 2012, CDC 2025)" }],
  "v8-54": [{ id: "gas-pharyngitis", label: "Trẻ em và người lớn (IDSA 2012, CDC 2025)" }],
  "v8-60": [{ id: "aom-peds", label: "Trẻ em (AAP 2013)" }, { id: "aom-adult", label: "Người lớn" }],
  "v8-99": [{ id: "aom-peds", label: "Trẻ em (AAP 2013)" }],
  "v8-56": [{ id: "pta", label: "Áp xe quanh amidan" }],
  "v8-57": [{ id: "rpa", label: "Áp xe sau họng" }],
  "v8-66": [{ id: "dni", label: "Nhiễm khuẩn khoang cổ sâu" }],
};
