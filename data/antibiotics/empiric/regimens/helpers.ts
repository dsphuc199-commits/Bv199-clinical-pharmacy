/*
  FILE: data/antibiotics/empiric/regimens/helpers.ts
  Ham tao nhanh du lieu phac do (chi giam so dong chu, khong doi noi dung).
*/

import type { DocId, DrugItem, Regimen, RegimenRole } from "./types";

export function d(name: string, dose: string): DrugItem {
  return { name, dose };
}

type Opts = {
  duration?: string;
  notes?: string[];
};

export function makeRegimen(
  doc: DocId,
  section: string,
  page: string
) {
  return (
    id: string,
    diseaseIds: string[],
    scenario: string,
    role: RegimenRole,
    drugs: DrugItem[],
    opts: Opts = {}
  ): Regimen => ({
    id,
    diseaseIds,
    scenario,
    role,
    drugs,
    duration: opts.duration,
    notes: opts.notes,
    source: { doc, section, page },
  });
}

/** Phiên bản cho phép đổi mục/trang từng phác đồ. */
export function maker(doc: DocId) {
  return (
    section: string,
    page: string,
    id: string,
    diseaseIds: string[],
    scenario: string,
    role: RegimenRole,
    drugs: DrugItem[],
    opts: Opts = {}
  ): Regimen => ({
    id,
    diseaseIds,
    scenario,
    role,
    drugs,
    duration: opts.duration,
    notes: opts.notes,
    source: { doc, section, page },
  });
}

/** Dùng khi nguồn BYT chỉ nêu tên thuốc/nhóm thuốc mà không có liều. */
export const NO_DOSE = "Nguồn BYT không nêu liều";
