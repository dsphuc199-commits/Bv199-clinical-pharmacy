/* =========================================================
   SMARTDOSE AI CONFIG
   BV199 CLINICAL PHARMACY

   SmartDose AI đảm nhiệm:
   - Bayesian / PK modeling
   - Ước tính AUC
   - Mô phỏng nồng độ
   - Hỗ trợ lựa chọn regimen

   App BV199 đảm nhiệm:
   - Quy trình TDM
   - Chuẩn hóa dữ liệu đầu vào
   - Checklist lấy mẫu
   - Đối chiếu SOP
   - Ghi nhận kết quả và can thiệp DSLS
========================================================= */

export const smartDoseConfig = {
  name: "SmartDose AI",

  provider:
    "LynxDose",

  baseUrl:
    "https://testapp.lynx-dose.com",

  patientsListUrl:
    "https://testapp.lynx-dose.com/patients-list",

  description:
    "Nền tảng hỗ trợ mô hình dược động học, Bayesian/TDM và tối ưu hóa liều.",

  usageAtBV199:
    "Sử dụng kết hợp với quy trình giám sát nồng độ vancomycin của Bệnh viện 199.",

  openMode:
    "external",

  safetyNote:
    "Không nhập hoặc sao chép dữ liệu người bệnh sang hệ thống khác ngoài quy trình được bệnh viện cho phép.",
} as const;

/* =========================================================
   HELPER
========================================================= */

export function openSmartDose() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.open(
    smartDoseConfig.patientsListUrl,
    "_blank",
    "noopener,noreferrer"
  );
}