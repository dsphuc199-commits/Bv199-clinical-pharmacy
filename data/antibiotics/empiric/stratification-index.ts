/*
  FILE: data/antibiotics/empiric/stratification-index.ts

  Chỉ mục NHẸ cho trang phác đồ kinh nghiệm: trang chỉ cần biết bệnh nào có khung phân tầng / có cột quốc tế / là bệnh
  module Tai mũi họng để chọn cách hiển thị, không cần nạp toàn bộ dữ liệu phân tầng (hàng MB) ngay khi mở trang.
  Dữ liệu đầy đủ nạp theo nhu cầu (components/antibiotics/empiric/StratificationLazy.tsx).
  Đồng bộ với stratification.ts và EntEmpiricGuidelines: tests/empiric/stratification.test.ts kiểm tra khớp tuyệt đối.
*/
const STRAT = ["v8-11", "v8-12", "v8-1", "v8-4", "v8-5", "v8-16", "v8-17", "v8-2", "v8-21", "v8-24", "v8-27", "v8-28", "v8-36", "v8-38", "v8-39",
  "v8-7", "v8-58", "v8-8", "v8-54", "v8-60", "v8-99", "v8-56", "v8-57", "v8-66", "v9-1"];
/** Bệnh có khung phân tầng. */
export const STRAT_IDS: ReadonlySet<string> = new Set(STRAT);
/** Bệnh có khung phân tầng kèm cột khuyến cáo quốc tế (tab Quốc tế dùng khung thay cho nội dung cũ). */
export const INTL_STRAT_IDS: ReadonlySet<string> = new Set(STRAT);
/** Bệnh thuộc module Tai mũi họng (EntEmpiricGuidelines). */
export const ENT_EMPIRIC_IDS: ReadonlySet<string> = new Set(["v8-56", "v8-57", "v8-66", "v8-54", "v8-8", "v8-60", "v8-7", "v8-58"]);
