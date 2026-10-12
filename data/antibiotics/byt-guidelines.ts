
/**
 * KHO DỮ LIỆU HƯỚNG DẪN ĐIỀU TRỊ BV199
 *
 * Vị trí:
 * data/antibiotics/byt-guidelines.ts
 *
 * BYT và GUIDELINE quốc tế phải được nhập riêng.
 * Không tự tạo phác đồ hoặc liều khi thiếu nguồn.
 */

export type SourceKind = "BYT" | "GUIDELINE";

export type ReviewStatus =
  | "not_found"
  | "source_found"
  | "extracted"
  | "checked"
  | "pending_approval"
  | "approved";

export type DrugDose = {
  ingredient: string;
  dose: string | null;
  route: string | null;
  interval: string | null;
  infusionTime: string | null;
  duration: string | null;
  renalAdjustment: string | null;
  notes: string[];
};

export type TreatmentRegimen = {
  id: string;
  role:
    | "preferred"
    | "alternative"
    | "equivalent"
    | "conditional";
  label: string;
  conditions: string[];
  drugs: DrugDose[];
};

export type EvidenceSource = {
  title: string;
  organization: string;
  decisionNumber: string | null;
  publicationDate: string | null;
  version: string | null;
  section: string | null;
  page: string | null;
  url: string | null;
  checkedAt: string | null;
};

export type TreatmentGuideline = {
  id: string;

  // Phải khớp mã bệnh trong dữ liệu hiện tại.
  diseaseId: string;
  diseaseName: string;

  // Một mặt bệnh có thể có nhiều bệnh cảnh.
  scenarioId: string;
  scenarioName: string;

  specialty: string;
  sourceKind: SourceKind;

  population: string | null;
  setting: string | null;
  severity: string | null;

  diagnosis: string[];
  antibioticIndication: string | null;
  expectedPathogens: string[];
  riskFactors: string[];

  regimens: TreatmentRegimen[];

  monitoring: string[];
  reassessment: string[];
  deescalation: string[];

  evidence: EvidenceSource;
  reviewStatus: ReviewStatus;

  approvedForBV199: boolean;
  approvalReference: string | null;
};

/**
 * DỮ LIỆU ĐƯỢC THẨM ĐỊNH
 *
 * Chưa điền thuốc ở đây vì chưa hoàn tất
 * việc xác minh toàn văn hướng dẫn BYT
 * và guideline quốc tế cho 144 mặt bệnh.
 *
 * Sau khi đối chiếu, thêm từng bản ghi
 * theo đúng cấu trúc TreatmentGuideline.
 */
export const BYT_GUIDELINES: TreatmentGuideline[] = [];

export const INTERNATIONAL_GUIDELINES:
  TreatmentGuideline[] = [];

/**
 * Truy xuất theo mã bệnh và bệnh cảnh.
 * Không dùng trùng tên bệnh để ghép nhầm.
 */
export function findGuidelines(
  diseaseId: string,
  scenarioId?: string
) {
  const filter = (items: TreatmentGuideline[]) =>
    items.filter((item) => {
      const sameDisease =
        item.diseaseId === diseaseId;

      const sameScenario =
        !scenarioId ||
        item.scenarioId === scenarioId;

      return sameDisease && sameScenario;
    });

  return {
    byt: filter(BYT_GUIDELINES),
    international: filter(
      INTERNATIONAL_GUIDELINES
    ),
  };
}

/**
 * KIỂM TRA DỮ LIỆU TRƯỚC XUẤT BẢN
 */
export function validateGuidelines(
  items: TreatmentGuideline[]
): string[] {
  const errors: string[] = [];
  const used = new Set<string>();

  for (const item of items) {
    if (used.has(item.id)) {
      errors.push(`Trùng mã: ${item.id}`);
    }
    used.add(item.id);

    if (
      !item.diseaseId ||
      !item.scenarioId ||
      !item.evidence.title
    ) {
      errors.push(
        `${item.id}: thiếu bệnh cảnh hoặc nguồn`
      );
    }

    if (
      item.sourceKind === "BYT" &&
      item.evidence.organization !==
        "Bộ Y tế"
    ) {
      errors.push(
        `${item.id}: kiểm tra nhãn nguồn BYT`
      );
    }

    if (
      item.approvedForBV199 &&
      (
        item.reviewStatus !== "approved" ||
        !item.approvalReference
      )
    ) {
      errors.push(
        `${item.id}: thiếu hồ sơ phê duyệt BV199`
      );
    }

    for (const regimen of item.regimens) {
      if (!regimen.drugs.length) {
        errors.push(
          `${item.id}: phác đồ không có thuốc`
        );
      }

      for (const drug of regimen.drugs) {
        if (!drug.ingredient.trim()) {
          errors.push(
            `${item.id}: thiếu tên hoạt chất`
          );
        }
      }
    }
  }

  return errors;
}
