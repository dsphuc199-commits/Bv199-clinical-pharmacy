/* TỰ ĐỘNG SINH bởi scripts/build-intl-index.ts – KHÔNG sửa tay. Chạy: npm run build:intl-index */
import g0 from "./sot-giam-bach-cau-trung-tinh-nguy-co-cao.json";
import g1 from "./sot-giam-bach-cau-trung-tinh.json";

/** JSON hướng dẫn quốc tế theo disease_id (chưa parse – IntlGuidelineView parse lại bằng zod). */
export const INTL_GUIDELINE_JSON: Record<string, unknown> = {
  "v8-116": g0, // sot-giam-bach-cau-trung-tinh-nguy-co-cao.json – draft_ai
  "v8-113": g1, // sot-giam-bach-cau-trung-tinh.json – draft_ai
};
