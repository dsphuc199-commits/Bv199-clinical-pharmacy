/* Nhãn tab của trang phác đồ kinh nghiệm – tách khỏi GuidelineTabs (module nặng) để trang không phải nạp nó khi mở. */
export type TabKey = "vn" | "intl" | "sources";

/* 2 tab: Việt Nam, Quốc tế. Tab "Đối chiếu" đã bỏ (đường dẫn cũ ?tab=compare mở tab Việt Nam);
   "Nguồn, phiên bản" nằm trong accordion dưới kết quả (?tab=sources mở accordion). */
export const TAB_LABELS: Record<Exclude<TabKey, "sources">, { short: string; long: string }> = {
  vn: { short: "Việt Nam", long: "Hướng dẫn Việt Nam" },
  intl: { short: "Quốc tế", long: "Quốc tế" },
};
