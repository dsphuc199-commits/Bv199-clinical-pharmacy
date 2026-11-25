/* Nhãn tab của trang phác đồ kinh nghiệm – tách khỏi GuidelineTabs (module nặng) để trang không phải nạp nó khi mở. */
export type TabKey = "vn" | "intl" | "compare" | "sources";

/* Master Task 6: chi 3 tab; "Nguon, phien ban" chuyen vao accordion duoi ket qua (?tab=sources mo accordion). */
export const TAB_LABELS: Record<Exclude<TabKey, "sources">, { short: string; long: string }> = {
  vn: { short: "Việt Nam", long: "Hướng dẫn Việt Nam" },
  intl: { short: "Quốc tế", long: "Quốc tế" },
  compare: { short: "Đối chiếu", long: "Đối chiếu" },
};
