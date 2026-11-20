import { GASTRO } from "@/data/antibiotics/empiric/regimens/gastro";
import { parseDrugSegment, structureOf, type DrugGroup } from "./regimen-structure";

export const BILIARY_DISEASE_ID = "v8-24";
export const BILIARY_BASE_REVISION = "byt708-biliary-2015";
export const BILIARY_SOURCE = {
  title: "Quyết định 708/QĐ-BYT (02/03/2015)",
  locator: "Mục 4b, trang 183 và Bảng II.15, trang 184",
  url: "https://www.benhvien103.vn/vanban/QD-708-BYT-huongdansudungkhangsinh.pdf#page=185",
};

export type BiliaryContent = {
  doses: Record<string, string>;
  mildDuration: string;
  moderateSevereDuration: string;
  source: typeof BILIARY_SOURCE;
};

export type BiliaryPublication = {
  revision: string;
  timestamp: string;
  content: BiliaryContent;
};

function doseKey(regimenId: string, name: string) {
  return `${regimenId}:${name.normalize("NFC").trim().toLowerCase()}`;
}

export const BILIARY_EDIT_GROUPS = GASTRO.filter((regimen) => regimen.diseaseIds.includes(BILIARY_DISEASE_ID)).map((regimen) => ({
  id: regimen.id,
  title: regimen.scenario,
  rows: structureOf(regimen).groups.flatMap((group) => group.options.map((option) => ({
    id: doseKey(regimen.id, option.name), drug: option.name, baseline: option.raw,
  }))),
}));

export const BILIARY_BASE_CONTENT: BiliaryContent = {
  doses: {},
  mildDuration: "5–7 ngày",
  moderateSevereDuration: "7–14 ngày, có thể dài hơn tùy đáp ứng lâm sàng",
  source: BILIARY_SOURCE,
};

export function biliaryDurationText(content: BiliaryContent) {
  return [
    `Thể nhẹ: ${content.mildDuration}.`,
    `Thể trung bình và nặng: ${content.moderateSevereDuration}.`,
  ];
}

export function biliaryChanges(before: BiliaryContent, after: BiliaryContent) {
  const entries = BILIARY_EDIT_GROUPS.flatMap(({ rows }) => rows.map(({ id, drug, baseline }) => ({
    label: drug, before: before.doses[id] ?? baseline, after: after.doses[id] ?? baseline,
  })));
  return [
    ...entries,
    { label: "Thời gian thể nhẹ", before: before.mildDuration, after: after.mildDuration },
    { label: "Thời gian thể trung bình và nặng", before: before.moderateSevereDuration, after: after.moderateSevereDuration },
    { label: "Tên tài liệu", before: before.source.title, after: after.source.title },
    { label: "Vị trí trích dẫn", before: before.source.locator, after: after.source.locator },
    { label: "Đường dẫn nguồn", before: before.source.url, after: after.source.url },
  ].filter((entry) => entry.before !== entry.after);
}

export function biliaryPublishedGroups(regimenId: string, groups: DrugGroup[], content: BiliaryContent): DrugGroup[] {
  return groups.map((group) => {
    if (!group.options.some((option) => content.doses[doseKey(regimenId, option.name)] !== undefined)) return group;
    const options = group.options.map((option) => {
      const approvedDose = content.doses[doseKey(regimenId, option.name)];
      if (approvedDose === undefined) return option;
      return { ...parseDrugSegment(option.name, approvedDose, option.population, option.populationLabel), context: option.context };
    });
    return { ...group, options, raw: options.map((option) => ({ name: option.name, dose: option.raw })) };
  });
}
