export interface DrugProduct {
  id: string;

  // Mã thuốc trong danh mục BV199
  drugCode: string;

  // Tên biệt dược / tên chế phẩm
  brandName: string;

  // Hoạt chất
  ingredientName: string;
  ingredientId: string;

  // Thông tin chế phẩm
  strength: string;
  route: string;
  dosageForm: string;
  packageSize: string;

  // Số đăng ký / giấy phép
  registrationNumber: string;

  // Nhà sản xuất
  manufacturer: string;
  country: string;

  // Đơn vị tính
  unit: string;

  // Sheet nguồn trong Excel
  sourceSheet: string;

  // Cảnh báo
  highAlert?: boolean;
  lasa?: boolean;

  // Có cần hiệu chỉnh liều theo chức năng thận
  renalAdjustmentRequired?: boolean;
}


// ========================================
// THÔNG TIN LÂM SÀNG THEO HOẠT CHẤT
// ========================================

export interface ClinicalMonograph {
  ingredientId: string;

  genericName: string;
  vietnameseName?: string;

  indications: ClinicalSection[];

  adultDosing: ClinicalSection[];
  pediatricDosing: ClinicalSection[];

  renalDosing: ClinicalSection[];
  hepaticDosing: ClinicalSection[];

  administration: ClinicalSection[];

  contraindications: ClinicalSection[];

  warnings: ClinicalSection[];

  adverseEffects: ClinicalSection[];

  interactions: ClinicalSection[];

  pregnancy: ClinicalSection[];

  lactation: ClinicalSection[];

  monitoring: ClinicalSection[];

  references: DrugReference[];

  review: ReviewStatus;
}


// ========================================
// TỪNG NỘI DUNG LÂM SÀNG
// ========================================

export interface ClinicalSection {
  title: string;
  content: string;

  // ID tài liệu chứng minh nội dung này
  referenceIds: string[];
}


// ========================================
// TÀI LIỆU THAM KHẢO
// ========================================

export interface DrugReference {
  id: string;

  title: string;

  source:
    | "HDSD"
    | "Dược thư Quốc gia Việt Nam"
    | "UpToDate"
    | "Lexidrug"
    | "Micromedex"
    | "DailyMed"
    | "FDA"
    | "Guideline"
    | "Nghiên cứu"
    | "Khác";

  year?: number;

  url?: string;

  accessedDate?: string;
}


// ========================================
// TRẠNG THÁI THẨM ĐỊNH
// ========================================

export interface ReviewStatus {
  status:
    | "draft"
    | "review"
    | "approved"
    | "expired";

  preparedBy?: string;

  reviewedBy?: string;

  approvedBy?: string;

  updatedAt?: string;

  nextReviewDate?: string;
}