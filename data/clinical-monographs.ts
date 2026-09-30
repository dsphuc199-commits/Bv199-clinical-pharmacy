export type ClinicalMonograph = {
  ingredientId: string;
  genericName: string;
  indications: string;
  adultDosing: string;
  renalDosing: string;
  administration: string;
  contraindications: string;
  warnings: string;
  adverseEffects: string;
  interactions: string;
  pregnancyLactation: string;
  monitoring: string;
  pkpd: string;
  references: string[];
};

export const clinicalMonographs: Record<string, ClinicalMonograph> = {
  meropenem: {
    ingredientId: "meropenem",
    genericName: "Meropenem",
    indications: "Theo SmPC Meronem IV: điều trị viêm phổi nặng, bao gồm viêm phổi bệnh viện và viêm phổi liên quan thở máy; nhiễm khuẩn phế quản-phổi ở bệnh nhân xơ nang; nhiễm khuẩn đường tiết niệu phức tạp; nhiễm khuẩn ổ bụng phức tạp; nhiễm khuẩn trong và sau sinh; nhiễm khuẩn da và mô mềm phức tạp; viêm màng não cấp do vi khuẩn. Có thể sử dụng trong xử trí bệnh nhân giảm bạch cầu trung tính có sốt nghi do nhiễm khuẩn và điều trị nhiễm khuẩn huyết liên quan hoặc nghi liên quan đến các nhiễm khuẩn nêu trên.",
    adultDosing: "Chưa có dữ liệu đã thẩm định",
    renalDosing: "Chưa có dữ liệu đã thẩm định",
    administration: "Chưa có dữ liệu đã thẩm định",
    contraindications: "Chưa có dữ liệu đã thẩm định",
    warnings: "Chưa có dữ liệu đã thẩm định",
    adverseEffects: "Chưa có dữ liệu đã thẩm định",
    interactions: "Chưa có dữ liệu đã thẩm định",
    pregnancyLactation: "Chưa có dữ liệu đã thẩm định",
    monitoring: "Chưa có dữ liệu đã thẩm định",
    pkpd: "Chưa có dữ liệu đã thẩm định",
    references: [],
  },
};