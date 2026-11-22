import type { resolve } from "@/lib/intl-rules";

export type CholangitisResult = ReturnType<typeof resolve>;
export type OrganStatus = "pending" | "yes" | "no";
export type SourceControl = "pending" | "controlled" | "uncontrolled";
export type CourseException = "pending" | "none" | "gram-positive" | "abscess";

export type TG18SeverityAssessment = {
  organFindings: readonly string[];
  noOrganDysfunction: boolean;
  moderateFindings: readonly string[];
  moderateReviewed: boolean;
};

export function tg18Severity({ organFindings, noOrganDysfunction, moderateFindings, moderateReviewed }: TG18SeverityAssessment) {
  if (organFindings.length > 0) return "iii";
  if (!noOrganDysfunction) return "pending";
  if (moderateFindings.length >= 2) return "ii";
  return moderateReviewed ? "i" : "pending";
}

export function tg18Diagnosis(inflammation: boolean, cholestasis: boolean, imaging: boolean) {
  if (inflammation && cholestasis && imaging) return "Đủ tiêu chuẩn chẩn đoán xác định theo TG18";
  if (inflammation && (cholestasis || imaging)) return "Đủ tiêu chuẩn nghi ngờ theo TG18";
  return "Chưa đủ tiêu chuẩn theo dữ liệu đã chọn";
}

const anaerobicBackbones = new Set(["Piperacillin/tazobactam", "Meropenem", "Ertapenem", "Ampicillin/sulbactam"]);
const pseudomonalBackbones = new Set(["Piperacillin/tazobactam", "Cefepim", "Ceftazidim", "Meropenem", "Aztreonam"]);

export function cholangitisChoices(result: CholangitisResult, antipseudomonal: boolean) {
  const items = (prefix: string) => result.blocks.find(({ title }) => title.startsWith(prefix))?.items ?? [];
  const inSpectrum = ({ role }: { role: string }) => !antipseudomonal || pseudomonalBackbones.has(role);
  return {
    base: items("Thuốc nền").filter(inSpectrum),
    alternatives: items("Thay thế có điều kiện").filter(inSpectrum),
    anaerobic: items("Phối hợp kỵ khí")[0],
    enterococcus: items("Phối hợp bao phủ Enterococcus")[0],
    vre: items("Thay thế vancomycin"),
  };
}

export function cholangitisCombination(role: string, junction: string, gramPositive: boolean, gramPending: boolean) {
  const coversAnaerobes = anaerobicBackbones.has(role);
  const addAnaerobic = junction === "present" && !coversAnaerobes;
  const pending = gramPending || (junction === "pending" && !coversAnaerobes) || (role === "Aztreonam" && !gramPositive);
  return {
    addAnaerobic,
    mode: pending ? "Cần xác nhận phối hợp" : addAnaerobic || gramPositive ? "Phối hợp" : "Đơn trị theo dữ kiện đã chọn",
  };
}

export function cholangitisCourse(control: SourceControl, exception: CourseException) {
  if (exception === "abscess") return { title: "Cá thể hóa vì có áp-xe gan", detail: "Theo TG18, tiếp tục đến khi theo dõi lâm sàng, xét nghiệm và hình ảnh xác nhận ổ áp-xe đã hết." };
  if (exception === "gram-positive") return {
    title: "Cá thể hóa theo tác nhân trong máu",
    detail: "TG18 nêu tối thiểu 2 tuần với cầu khuẩn như Enterococcus hoặc Streptococcus. Đánh giá viêm nội tâm mạc, tác nhân và kiểm soát ổ nhiễm để chốt thời gian.",
  };
  if (control === "uncontrolled") return { title: "Chưa tính mốc 4–7 ngày", detail: "Đánh giá lại dẫn lưu và xử trí tắc mật hoặc sỏi tồn dư trước khi chốt thời gian điều trị." };
  if (control === "controlled" && exception === "none") return { title: "4–7 ngày sau khi kiểm soát ổ nhiễm", detail: "Mốc tham khảo theo TG18 khi đã đánh giá các yếu tố cần kéo dài." };
  return { title: "Chờ xác nhận thời gian", detail: "Mốc tham khảo của TG18 là 4–7 ngày sau kiểm soát ổ nhiễm. Xác nhận tình trạng dẫn lưu và các yếu tố cần kéo dài." };
}
