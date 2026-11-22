/* TỰ ĐỘNG SINH bởi scripts/build-intl-index.ts – KHÔNG sửa tay. Chạy: npm run build:intl-index */
import g0 from "./nhiem-khuan-huyet-so-sinh.json";
import g1 from "./sot-giam-bach-cau-trung-tinh-nguy-co-cao.json";
import g2 from "./sot-giam-bach-cau-trung-tinh.json";
import g3 from "./viem-duong-mat-cap.json";
import g4 from "./viem-phoi-cong-dong-o-tre-em.json";
import g5 from "./viem-phoi-so-sinh.json";

/** JSON hướng dẫn quốc tế theo disease_id (chưa parse – IntlGuidelineView parse lại bằng zod). */
export const INTL_GUIDELINE_JSON: Record<string, unknown> = {
  "v8-103": g0, // nhiem-khuan-huyet-so-sinh.json – draft_ai
  "v8-116": g1, // sot-giam-bach-cau-trung-tinh-nguy-co-cao.json – draft_ai
  "v8-113": g2, // sot-giam-bach-cau-trung-tinh.json – draft_ai
  "v8-24": g3, // viem-duong-mat-cap.json – draft_ai
  "v8-101": g4, // viem-phoi-cong-dong-o-tre-em.json – draft_ai
  "v8-102": g5, // viem-phoi-so-sinh.json – draft_ai
};
