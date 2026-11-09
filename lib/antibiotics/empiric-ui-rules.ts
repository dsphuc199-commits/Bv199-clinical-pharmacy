/*
  FILE: lib/antibiotics/empiric-ui-rules.ts

  Cau hinh hien thi TOAN CUC cho module Khang sinh dieu tri kinh nghiem (Master Prompt V4.0).
  CHI la presentation layer: khong dung de xoa/sua du lieu nguon. Cac component dung chung
  (TreatmentPanel, DoseTable, ClinicalNotes qua clinicalText, tong quan mat benh) doc truc tiep.
*/

export const EMPIRIC_TREATMENT_UI_RULES = {
  // Dieu tri cot loi
  showStandardDose: true,
  showAdministrationRoute: true,
  showDosingInterval: true,
  showTreatmentDuration: true,
  showCommonPathogens: true,
  showEssentialWarnings: true,

  // Module rieng (hieu chinh lieu, tuong tac, TDM)
  showDoseAdjustmentTables: false,
  /** Nut "Hiệu chỉnh liều" / "Tương tác thuốc" trong tung the phac do: an (da co module rieng, chi lien ket). */
  showDrugToolsInRegimen: false,
  /** Nhan "Khác biệt liều BYT – quốc tế" tren the: an (doi chieu chi tiet da co ben duoi the). */
  showSourceDifferenceBadge: false,
  /** "(Phụ lục n)", "(Bảng x)", "(Mục x)" trong cau hien thi: an (vi tri giu trong du lieu). */
  showAppendixInline: false,
  showDrugInteractionTables: false,
  showDetailedTDM: false,
  showDetailedPKPDCalculations: false,

  // Dinh dang lieu
  /** Tong lieu/ngay tinh tu lieu moi lan x khoang cach (vd "= 8 g/ngày") – an. */
  showCalculatedDailyDose: false,
  /** Lieu nguon ghi theo ngay (g/ngày, mg/kg/ngày) va lieu toi da – luon giu. */
  preserveSourceDoseExpression: true,
  preserveMaximumDailyDose: true,

  // Nguon
  showPageNumbersInline: false,
  showChapterNumbersInline: false,
  showInlineCitationMarkers: false,
  showReferenceDrawer: true,

  // Tieu chi
  showCriteriaByDefault: false,
  explainClinicalRationale: true,
  preserveCriteriaSourceLinks: true,

  // Bo cuc
  useSharedDiseaseLayout: true,
  useSharedRegimenCards: true,
  preventDuplicatedHeadings: true,
  preserveDiseaseNavigation: true,
} as const;

/** Duong dan module chuyen biet (lien ket nho thay cho noi dung trung lap). */
export const SPECIALIZED_MODULE_LINKS = {
  doseAdjustment: { href: "/antibiotics/dosing", label: "Hiệu chỉnh liều" },
  interactions: { href: "/tuong-tac-thuoc", label: "Tương tác thuốc" },
} as const;

/**
 * Bo ma trich dan trang/chuong/van ban khoi cau hien thi (khong dong vao du lieu goc;
 * noi goi giu nguyen van trong muc "Nguồn và căn cứ").
 */
export function stripInlineCitations(text: string): string {
  const R = EMPIRIC_TREATMENT_UI_RULES;
  let t = text;
  if (!R.showPageNumbersInline) {
    t = t
      // "(QĐ 708 tr. 43)", "(tr. 165)", "(tr. 97 và 105 theo bản PDF)"
      .replace(/\(\s*(?:QĐ\s*[\d/A-ZĐ-]+\s*,?\s*)?tr\.\s*[\d–\-, và]+(?:\s*theo bản PDF)?\s*\)/giu, "")
      // ", tr. 97 và 105 theo bản PDF" / " tr. 26"
      .replace(/,?\s*tr\.\s*\d+(?:\s*[–-]\s*\d+)?(?:\s*(?:,|và)\s*\d+(?:\s*[–-]\s*\d+)?)*(?:\s*theo bản PDF)?/giu, "");
  }
  if (!R.showChapterNumbersInline) {
    t = t.replace(/,?\s*Chương\s+\d+(?=[\s,;.)]|$)/gu, "");
  }
  if (!R.showAppendixInline) {
    t = t
      // "(Phụ lục 1; Clcr 10–30: …)" -> "(Clcr 10–30: …)": chi bo vi tri, giu noi dung lam sang sau dau ";"
      .replace(/\(\s*(?:Phụ lục|Bảng|Mục|mục)\s+[^;()]*;\s*/gu, "(")
      // "(Phụ lục 1)", "(Phụ lục 1, tr. 60–63)", "(Bảng 5.1)", "(Mục 5.2)", "(Mục 4.5, Bảng 4.4)"
      .replace(/\(\s*(?:Phụ lục|Bảng|Mục|mục)\s+[^();]*\)/gu, "")
      // "theo Phụ lục 1", ", Phụ lục 10", "Phụ lục 1 –"
      .replace(/,?\s*(?:theo\s+)?Phụ lục\s+\d+[A-Za-z]?(?:\s*[–-]\s*(?=\S))?/gu, "");
  }
  return t.replace(/\(\s*[,;]?\s*\)/g, "").replace(/[ \t]{2,}/g, " ").replace(/\s+([,;.)])/g, "$1");
}
