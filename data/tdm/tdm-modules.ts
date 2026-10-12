/* =========================================================
   TDM MODULE CONFIG
   BV199 CLINICAL PHARMACY
========================================================= */

export type TdmDrugId =
  | "vancomycin"
  | "aminoglycoside"
  | "colistin"
  | "phenytoin"
  | "tacrolimus";

export type TdmStatus =
  | "ready"
  | "developing";

export type TdmModule = {
  id: TdmDrugId;

  code: string;

  name: string;

  subtitle: string;

  description: string;

  href: string;

  pkpdIndex?: string;

  status: TdmStatus;

  statusLabel: string;

  externalTool?: {
    name: string;
    url: string;
  };

  overview: {
    indication: string[];
    monitoring: string[];
    safety: string[];
  };

  workflow: {
    title: string;
    description: string;
  }[];
};

export const tdmModules: TdmModule[] = [
  {
    id: "vancomycin",

    code: "VA",

    name: "Vancomycin",

    subtitle: "AUC-guided TDM",

    description:
      "Theo dõi phơi nhiễm vancomycin, chức năng thận, thời điểm lấy mẫu và tối ưu liều bằng SmartDose AI.",

    href: "/tdm/vancomycin",

    pkpdIndex: "AUC24/MIC",

    status: "ready",

    statusLabel: "Đã triển khai",

    externalTool: {
      name: "SmartDose AI",
      url:
        "https://testapp.lynx-dose.com/patients-list",
    },

    overview: {
      indication: [
        "Nhiễm MRSA nặng",
        "Chức năng thận không ổn định",
        "Nguy cơ độc tính thận",
        "Béo phì",
        "Đáp ứng lâm sàng kém",
      ],

      monitoring: [
        "Liều và khoảng cách liều",
        "Thời gian truyền",
        "Thời điểm lấy mẫu",
        "Nồng độ vancomycin",
        "AUC24",
        "MIC khi phù hợp",
      ],

      safety: [
        "Theo dõi creatinin huyết thanh",
        "Đánh giá thay đổi chức năng thận",
        "Rà soát thuốc có nguy cơ độc thận",
      ],
    },

    workflow: [
      {
        title: "Xác định chỉ định TDM",
        description:
          "Đánh giá tình trạng nhiễm khuẩn, chức năng thận và các yếu tố nguy cơ.",
      },
      {
        title: "Chuẩn hóa regimen",
        description:
          "Xác nhận liều, khoảng cách liều và thời gian truyền thực tế.",
      },
      {
        title: "Kiểm tra thời điểm lấy mẫu",
        description:
          "Đối chiếu thời điểm truyền thuốc và thời điểm lấy mẫu thực tế.",
      },
      {
        title: "Phân tích SmartDose AI",
        description:
          "Nhập dữ liệu vào SmartDose để thực hiện phân tích PK/Bayesian.",
      },
      {
        title: "Đánh giá và can thiệp",
        description:
          "Kết hợp AUC, đáp ứng, độc tính và tình trạng người bệnh.",
      },
    ],
  },

  {
    id: "aminoglycoside",

    code: "AG",

    name: "Aminoglycoside",

    subtitle: "TDM theo nồng độ",

    description:
      "Theo dõi aminoglycoside với trọng tâm nồng độ thuốc, chức năng thận và mục tiêu PK/PD.",

    href:
      "/tdm/aminoglycoside",

    pkpdIndex:
      "Cmax/MIC",

    status:
      "developing",

    statusLabel:
      "Đang hoàn thiện",

    overview: {
      indication: [
        "Điều trị aminoglycoside cần theo dõi nồng độ",
        "Suy giảm hoặc thay đổi chức năng thận",
        "Điều trị kéo dài",
        "Nguy cơ độc tính",
      ],

      monitoring: [
        "Liều",
        "Khoảng cách liều",
        "Cmax khi phù hợp",
        "Cmin khi phù hợp",
        "MIC",
        "Chức năng thận",
      ],

      safety: [
        "Độc tính thận",
        "Độc tính tai",
        "Tích lũy thuốc",
      ],
    },

    workflow: [
      {
        title:
          "Xác định thuốc và regimen",
        description:
          "Amikacin, gentamicin hoặc tobramycin và chế độ liều đang sử dụng.",
      },
      {
        title:
          "Kiểm tra chức năng thận",
        description:
          "Đánh giá CrCl và xu hướng thay đổi creatinin.",
      },
      {
        title:
          "Xác nhận thời điểm lấy mẫu",
        description:
          "Phân biệt mẫu peak/trough theo protocol áp dụng.",
      },
      {
        title:
          "Diễn giải nồng độ",
        description:
          "Đánh giá phơi nhiễm và mối liên hệ với MIC.",
      },
      {
        title:
          "Hiệu chỉnh & theo dõi lại",
        description:
          "Đề xuất regimen và kế hoạch lấy mẫu tiếp theo.",
      },
    ],
  },

  {
    id: "colistin",

    code: "CO",

    name: "Colistin",

    subtitle: "PK/PD & monitoring",

    description:
      "Theo dõi colistin/CMS, liều nạp, liều duy trì, chức năng thận, RRT và độc tính.",

    href:
      "/tdm/colistin",

    pkpdIndex:
      "fAUC/MIC",

    status:
      "developing",

    statusLabel:
      "Đang hoàn thiện",

    overview: {
      indication: [
        "Nhiễm khuẩn Gram âm đa kháng",
        "Điều trị colistin/CMS",
        "Chức năng thận thay đổi",
        "Lọc máu hoặc CRRT",
      ],

      monitoring: [
        "Liều nạp",
        "Liều duy trì",
        "CrCl",
        "RRT",
        "MIC",
      ],

      safety: [
        "Độc tính thận",
        "Độc tính thần kinh",
        "Thuốc độc thận phối hợp",
      ],
    },

    workflow: [
      {
        title:
          "Xác định chỉ định",
        description:
          "Đánh giá tác nhân, MIC và lý do lựa chọn colistin.",
      },
      {
        title:
          "Đánh giá chức năng thận",
        description:
          "Xác định CrCl, AKI và tình trạng RRT.",
      },
      {
        title:
          "Kiểm tra liều",
        description:
          "Đánh giá liều nạp và liều duy trì.",
      },
      {
        title:
          "Theo dõi hiệu quả",
        description:
          "Theo dõi đáp ứng lâm sàng và vi sinh.",
      },
      {
        title:
          "Theo dõi độc tính",
        description:
          "Đánh giá thận, thần kinh và thuốc phối hợp.",
      },
    ],
  },

  {
    id:
      "phenytoin",

    code:
      "PH",

    name:
      "Phenytoin",

    subtitle:
      "Therapeutic Drug Monitoring",

    description:
      "Theo dõi nồng độ phenytoin, albumin, nồng độ toàn phần/tự do và nguy cơ độc tính.",

    href:
      "/tdm/phenytoin",

    status:
      "developing",

    statusLabel:
      "Đang hoàn thiện",

    overview: {
      indication: [
        "Kiểm soát cơn chưa đạt",
        "Nghi ngờ độc tính",
        "Thay đổi liều",
        "Thay đổi albumin hoặc bệnh lý ảnh hưởng gắn protein",
      ],

      monitoring: [
        "Liều phenytoin",
        "Nồng độ toàn phần",
        "Nồng độ tự do nếu có",
        "Albumin",
        "Thời điểm lấy mẫu",
      ],

      safety: [
        "Triệu chứng thần kinh",
        "Tương tác thuốc",
        "Nồng độ cao",
      ],
    },

    workflow: [
      {
        title:
          "Đánh giá chỉ định",
        description:
          "Kiểm tra kiểm soát cơn và nghi ngờ độc tính.",
      },
      {
        title:
          "Kiểm tra liều",
        description:
          "Xác nhận regimen và thời gian dùng.",
      },
      {
        title:
          "Kiểm tra lấy mẫu",
        description:
          "Đối chiếu thời điểm lấy mẫu với liều.",
      },
      {
        title:
          "Diễn giải nồng độ",
        description:
          "Kết hợp albumin, nồng độ toàn phần và tự do.",
      },
      {
        title:
          "Theo dõi",
        description:
          "Đánh giá đáp ứng và độc tính sau hiệu chỉnh.",
      },
    ],
  },

  {
    id:
      "tacrolimus",

    code:
      "TC",

    name:
      "Tacrolimus",

    subtitle:
      "Therapeutic Drug Monitoring",

    description:
      "Theo dõi nồng độ tacrolimus, trough, chức năng cơ quan và các yếu tố ảnh hưởng phơi nhiễm.",

    href:
      "/tdm/tacrolimus",

    status:
      "developing",

    statusLabel:
      "Đang hoàn thiện",

    overview: {
      indication: [
        "Theo dõi sau ghép",
        "Thay đổi liều",
        "Thay đổi thuốc tương tác",
        "Thay đổi chức năng gan hoặc thận",
      ],

      monitoring: [
        "Liều tacrolimus",
        "C0/trough",
        "Thời điểm lấy mẫu",
        "Tương tác thuốc",
        "Chức năng thận",
      ],

      safety: [
        "Độc tính thận",
        "Độc tính thần kinh",
        "Tăng huyết áp",
        "Rối loạn điện giải",
      ],
    },

    workflow: [
      {
        title:
          "Xác nhận regimen",
        description:
          "Liều và thời gian dùng tacrolimus.",
      },
      {
        title:
          "Kiểm tra thời điểm lấy mẫu",
        description:
          "Đảm bảo mẫu trough phù hợp.",
      },
      {
        title:
          "Đánh giá tương tác",
        description:
          "Rà soát thuốc và yếu tố ảnh hưởng chuyển hóa.",
      },
      {
        title:
          "Diễn giải nồng độ",
        description:
          "Đối chiếu mục tiêu theo bối cảnh lâm sàng.",
      },
      {
        title:
          "Theo dõi sau hiệu chỉnh",
        description:
          "Đánh giá lại nồng độ và độc tính.",
      },
    ],
  },
];

export function getTdmModule(
  id: string
) {
  return (
    tdmModules.find(
      (
        module
      ) =>
        module.id ===
        id
    ) ?? null
  );
}