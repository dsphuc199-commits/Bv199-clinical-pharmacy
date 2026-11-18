import { PUBLIC_REGIMENS } from "./public-regimens";
import type { PublicRegimen } from "./types";

export { CONDITIONS } from "./conditions";
export { REGIMENS } from "./regimens";
export { UTI_BRIEFS } from "./briefs";
export { TIER_LABEL, UTI_CONFIG } from "./config";
export * from "./types";

/* Dữ liệu gửi xuống trình duyệt, không có sourceText. */
export function publicRegimens(): PublicRegimen[] {
  return PUBLIC_REGIMENS;
}
