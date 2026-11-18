import { REGIMENS } from "./regimens";
import type { PublicRegimen } from "./types";

export { CONDITIONS } from "./conditions";
export { REGIMENS };
export { TIER_LABEL, UTI_CONFIG } from "./config";
export * from "./types";

/* Bỏ sourceText trước khi gửi dữ liệu xuống trình duyệt. */
export function publicRegimens(): PublicRegimen[] {
  return REGIMENS.map((r) => ({
    id: r.id, conditionId: r.conditionId, tier: r.tier, antibiotic: r.antibiotic, dose: r.dose, route: r.route,
    interval: r.interval, duration: r.duration, applicability: r.applicability, note: r.note,
  }));
}
