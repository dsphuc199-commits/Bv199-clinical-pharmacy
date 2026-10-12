/* =========================================================
   PK/PD CALCULATORS
   BV199 Clinical Pharmacy

   MỤC ĐÍCH
   ---------------------------------------------------------
   - Tính AUC24/MIC khi đã có AUC24 và MIC
   - Tính Cmax/MIC khi đã có Cmax và MIC
   - Kiểm tra giá trị %fT>MIC đã được xác định từ PK/TDM

   QUAN TRỌNG
   ---------------------------------------------------------
   File này KHÔNG:
   - tự mô phỏng nồng độ thuốc từ liều
   - tự tính AUC chỉ từ tổng liều
   - tự tính fT>MIC chỉ từ liều + MIC
   - thay thế phần mềm Bayesian/TDM

   Nguồn chuyên môn nền:
   - Bộ Y tế: QĐ 708/QĐ-BYT
   - CLSI M100 Ed36
   - ASHP/IDSA/PIDS/SIDP Vancomycin Consensus
   - ACCP/IDSA/ESCMID/SCCM/SIDP beta-lactam consensus
========================================================= */

/* =========================================================
   TYPES
========================================================= */

export type PkPdMode =
  | "beta-lactam"
  | "vancomycin"
  | "aminoglycoside";

export type TargetStatus =
  | "below"
  | "target"
  | "above"
  | "informational"
  | "invalid";

export type CalculationResult = {
  index: string;

  value: number;

  unit: string;

  status: TargetStatus;

  title: string;

  interpretation: string;

  warning?: string;
};

/* =========================================================
   BASIC VALIDATION
========================================================= */

export function isPositiveNumber(
  value: number
) {
  return (
    Number.isFinite(
      value
    ) &&
    value > 0
  );
}

export function isValidPercent(
  value: number
) {
  return (
    Number.isFinite(
      value
    ) &&
    value >= 0 &&
    value <= 100
  );
}

/* =========================================================
   AUC / MIC
========================================================= */

export function calculateAucMic(
  auc24: number,
  mic: number
) {
  if (
    !isPositiveNumber(
      auc24
    ) ||
    !isPositiveNumber(
      mic
    )
  ) {
    return null;
  }

  return (
    auc24 /
    mic
  );
}

/* =========================================================
   CMAX / MIC
========================================================= */

export function calculateCmaxMic(
  cmax: number,
  mic: number
) {
  if (
    !isPositiveNumber(
      cmax
    ) ||
    !isPositiveNumber(
      mic
    )
  ) {
    return null;
  }

  return (
    cmax /
    mic
  );
}

/* =========================================================
   VANCOMYCIN
========================================================= */

export function interpretVancomycinAucMic(
  value: number
): CalculationResult {
  if (
    !Number.isFinite(
      value
    ) ||
    value <= 0
  ) {
    return {
      index:
        "AUC24/MIC",

      value:
        0,

      unit:
        "tỷ số",

      status:
        "invalid",

      title:
        "Dữ liệu không hợp lệ",

      interpretation:
        "Không thể diễn giải AUC24/MIC.",
    };
  }

  if (
    value < 400
  ) {
    return {
      index:
        "AUC24/MIC",

      value,

      unit:
        "tỷ số",

      status:
        "below",

      title:
        "Dưới khoảng mục tiêu",

      interpretation:
        "AUC24/MIC thấp hơn 400. Trong nhiễm MRSA nặng, mức phơi nhiễm này thấp hơn khoảng mục tiêu consensus 400–600.",

      warning:
        "Không tự tăng liều chỉ dựa trên kết quả này; cần đánh giá chức năng thận, thời điểm lấy mẫu và phương pháp ước tính AUC.",
    };
  }

  if (
    value > 600
  ) {
    return {
      index:
        "AUC24/MIC",

      value,

      unit:
        "tỷ số",

      status:
        "above",

      title:
        "Trên khoảng mục tiêu",

      interpretation:
        "AUC24/MIC cao hơn 600. Trong nhiễm MRSA nặng, mức phơi nhiễm này cao hơn khoảng mục tiêu consensus.",

      warning:
        "Cần đánh giá nguy cơ độc tính, đặc biệt độc tính thận, và xem xét lại chế độ liều bằng phương pháp TDM phù hợp.",
    };
  }

  return {
    index:
      "AUC24/MIC",

    value,

    unit:
      "tỷ số",

    status:
      "target",

    title:
      "Trong khoảng mục tiêu",

    interpretation:
      "AUC24/MIC nằm trong khoảng 400–600 được khuyến cáo cho nhiễm MRSA nặng trong bối cảnh phù hợp.",

    warning:
      "Target này không áp dụng máy móc cho mọi chỉ định vancomycin.",
  };
}

/* =========================================================
   AMINOGLYCOSIDE
========================================================= */

export function interpretAminoglycoside(
  cmax: number,
  mic: number
): CalculationResult | null {
  const ratio =
    calculateCmaxMic(
      cmax,
      mic
    );

  if (
    ratio === null
  ) {
    return null;
  }

  return {
    index:
      "Cmax/MIC",

    value:
      ratio,

    unit:
      "tỷ số",

    status:
      "informational",

    title:
      "Đã tính Cmax/MIC",

    interpretation:
      "Cmax/MIC phản ánh mức nồng độ đỉnh tương đối so với MIC. Mục tiêu cụ thể phải được diễn giải theo aminoglycoside, chỉ định, chế độ liều và protocol TDM.",

    warning:
      "Không dùng một ngưỡng Cmax/MIC duy nhất cho mọi aminoglycoside và mọi loại nhiễm khuẩn.",
  };
}

/* =========================================================
   BETA-LACTAM
========================================================= */

export function interpretBetaLactamFtMic(
  ftMic: number
): CalculationResult | null {
  if (
    !isValidPercent(
      ftMic
    )
  ) {
    return null;
  }

  return {
    index:
      "fT>MIC",

    value:
      ftMic,

    unit:
      "%",

    status:
      "informational",

    title:
      "Đã ghi nhận mức đạt fT>MIC",

    interpretation:
      "Đây là tỷ lệ phần trăm khoảng liều mà nồng độ thuốc tự do duy trì trên MIC. Mục tiêu cụ thể phụ thuộc loại beta-lactam, mức độ nặng, vị trí nhiễm, MIC và protocol PK/PD.",

    warning:
      "Không nên kết luận đạt hoặc không đạt chỉ dựa trên một target chung cho tất cả beta-lactam.",
  };
}