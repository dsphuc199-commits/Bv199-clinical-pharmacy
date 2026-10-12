import type {
  LASAPair,
} from "@/lib/types/antibiotics";


export const lasaPairs:
  LASAPair[] = [

  {
    id:
      "curam-625-curam-1000",

    drugAId:
      "curam-625",

    drugBId:
      "curam-1000",

    type:
      "same-name-strength",

    reasons: [
      "Cùng tên thương mại",
      "Khác hàm lượng",
      "Bao bì có nguy cơ nhầm lẫn",
    ],

    riskStage: [
      "prescribing",
      "dispensing",
      "administration",
    ],

    prevention: [
      "Kiểm tra hàm lượng",
      "Đọc đầy đủ tên thuốc và hàm lượng",
      "Đối chiếu đơn thuốc trước cấp phát",
    ],

    sourceIds: [
      "bv199-lasa-2025-2026",
    ],

    active:
      true,
  },


  {
    id:
      "tobradex-tobrex",

    drugAId:
      "tobradex",

    drugBId:
      "tobrex",

    type:
      "sound-alike",

    reasons: [
      "Tên thuốc gần giống",
      "Cùng sử dụng tại mắt",
      "Thành phần khác nhau",
    ],

    riskStage: [
      "prescribing",
      "dispensing",
      "administration",
    ],

    prevention: [
      "Kiểm tra hoạt chất",
      "Kiểm tra chỉ định",
      "Đọc đầy đủ tên thuốc",
    ],

    sourceIds: [
      "bv199-lasa-2025-2026",
    ],

    active:
      true,
  },

];