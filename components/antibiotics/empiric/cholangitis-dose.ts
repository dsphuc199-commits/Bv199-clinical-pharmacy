import { parseDose, type DoseParts } from "./rx-dose-parts";

type TableDose = {
  dose: string;
  loadingDose?: string;
  route?: string;
  frequency?: string;
  dosesPerDay?: number;
  qualifier?: string;
};

function regularSchedule(parts: DoseParts): TableDose {
  const interval = Number(parts.freq?.match(/^mỗi (\d+) giờ$/u)?.[1]);
  return {
    dose: parts.dose,
    route: parts.route,
    frequency: parts.freq,
    dosesPerDay: interval > 0 && 24 % interval === 0 ? 24 / interval : undefined,
  };
}

export function cholangitisTableDose(text: string): TableDose {
  const standard = parseDose(text);
  if (standard) return regularSchedule(standard);

  const phases = text.split(" liều đầu, sau đó ");
  if (phases.length === 2) {
    const [firstDose, maintenance] = phases;
    const loading = parseDose(firstDose);
    const ongoing = parseDose(maintenance);
    if (loading?.route && ongoing?.route === loading.route && ongoing.freq) {
      return { ...regularSchedule(ongoing), loadingDose: loading.dose };
    }
  }

  const loadingPrefix = "Nếu nhiễm nặng có chỉ định liều nạp, tham khảo ";
  if (text.startsWith(loadingPrefix)) {
    const loading = parseDose(text.slice(loadingPrefix.length));
    if (loading?.freq === "một lần") {
      return {
        dose: loading.dose,
        route: loading.route,
        frequency: "Nạp một lần khi có chỉ định. Duy trì theo chức năng thận và TDM.",
        qualifier: "Liều nạp tham khảo cho nhiễm nặng.",
      };
    }
  }

  const qualifierIndex = text.indexOf(" theo UCSF khi ");
  if (qualifierIndex > 0) {
    const schedule = parseDose(text.slice(0, qualifierIndex));
    if (schedule) return { ...regularSchedule(schedule), qualifier: text.slice(qualifierIndex + 1) };
  }

  return { dose: text };
}
