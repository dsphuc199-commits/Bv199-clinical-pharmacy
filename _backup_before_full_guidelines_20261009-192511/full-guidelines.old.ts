/* =========================================================
   BV199 CLINICAL PHARMACY
   FULL GUIDELINES EXTENSION
   - Giữ nguyên database gốc trong full-guidelines-base.ts
   - Bổ sung Tai Mũi Họng
   ========================================================= */

import {
  allSyndromes as baseSyndromesRaw,
  guidelineSources as baseGuidelineSourcesRaw,
  pathogenGuidance as pathogenGuidanceRaw,
} from "./full-guidelines-base";

/* =========================================================
   TYPES
========================================================= */

export type VerificationLevel =
  | "VERIFIED_EXACT"
  | "VERIFIED_SUMMARY"
  | "INDEXED";

export type SourceKind =
  | "hospital"
  | "national"
  | "international";

export type GuidelineSource = {
  id: string;
  name: string;
  year: number;
  kind: SourceKind;
  url?: string;
};

export type TreatmentOption = {
  title: string;
  drugs: string[];
  notes?: string[];
};

export type ClinicalSyndrome = {
  id: string;

  category: string;

  title: string;

  population: string;

  setting: string[];

  severity: string[];

  verification: VerificationLevel;

  commonPathogens: string[];

  assessment: string[];

  sourceControl?: string[];

  firstLine: TreatmentOption[];

  alternatives?: TreatmentOption[];

  duration: string[];

  reassessment: string[];

  deEscalation: string[];

  renalAdjustment: boolean;

  tdm?: string[];

  sourceIds: string[];

  requiresBV199Validation: boolean;
};

export type PathogenGuidance = {
  id: string;

  name: string;

  group: string;

  phenotype?: string;

  commonSites: string[];

  verification: VerificationLevel;

  preferred: string[];

  avoid: string[];

  notes: string[];

  sourceIds: string[];

  requiresBV199Validation: boolean;
};

/* =========================================================
   BASE DATABASE
========================================================= */

const baseSyndromes =
  baseSyndromesRaw as ClinicalSyndrome[];

const baseGuidelineSources =
  baseGuidelineSourcesRaw as GuidelineSource[];

export const pathogenGuidance =
  pathogenGuidanceRaw as PathogenGuidance[];

/* =========================================================
   EXTRA SOURCES - ENT
========================================================= */

const entSources: GuidelineSource[] = [
  {
    id: "aao-hns-sinusitis-2025",
    name: "AAO-HNS Adult Sinusitis 2025",
    year: 2025,
    kind: "international",
    url:
      "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/cpg-adult-sinusitis/",
  },

  {
    id: "idsa-rhinosinusitis",
    name: "IDSA Acute Bacterial Rhinosinusitis",
    year: 2012,
    kind: "international",
    url:
      "https://www.idsociety.org/practice-guideline/rhinosinusitis/",
  },

  {
    id: "idsa-gas-2025",
    name: "IDSA GAS Pharyngitis 2025",
    year: 2025,
    kind: "international",
    url:
      "https://www.idsociety.org/practice-guideline/streptococcal-pharyngitis2/",
  },

  {
    id: "aao-hns-otitis-externa",
    name: "AAO-HNS Acute Otitis Externa",
    year: 2014,
    kind: "international",
  },
];

/* =========================================================
   HELPER
========================================================= */

function entSyndrome(
  value: Partial<ClinicalSyndrome> &
    Pick<ClinicalSyndrome, "id" | "title">
): ClinicalSyndrome {
  return {
    id:
      value.id,

    category:
      "Tai Mũi Họng",

    title:
      value.title,

    population:
      "Người lớn",

    setting:
      value.setting ??
      ["Ngoại trú"],

    severity:
      value.severity ??
      ["Theo phân tầng"],

    verification:
      value.verification ??
      "VERIFIED_SUMMARY",

    commonPathogens:
      value.commonPathogens ??
      [],

    assessment:
      value.assessment ??
      [
        "Đánh giá chẩn đoán lâm sàng.",
        "Đánh giá mức độ nặng.",
        "Đánh giá dị ứng kháng sinh.",
        "Đánh giá chức năng thận và gan.",
        "Xem lại kháng sinh đã sử dụng.",
      ],

    sourceControl:
      value.sourceControl,

    firstLine:
      value.firstLine ??
      [
        {
          title:
            "Nguyên tắc điều trị",

          drugs: [
            "Điều trị theo chẩn đoán, mức độ và guideline.",
          ],
        },
      ],

    alternatives:
      value.alternatives,

    duration:
      value.duration ??
      [
        "Cá thể hóa theo bệnh, vị trí nhiễm và đáp ứng.",
      ],

    reassessment:
      value.reassessment ??
      [
        "Đánh giá lại nếu không cải thiện.",
        "Đánh giá ngay khi xuất hiện dấu hiệu biến chứng.",
      ],

    deEscalation:
      value.deEscalation ??
      [
        "Ngừng hoặc thu hẹp kháng sinh khi không còn chỉ định.",
      ],

    renalAdjustment:
      value.renalAdjustment ??
      true,

    tdm:
      value.tdm,

    sourceIds:
      value.sourceIds ??
      [],

    requiresBV199Validation:
      true,
  };
}

/* =========================================================
   TAI MŨI HỌNG
========================================================= */

const entSyndromes:
  ClinicalSyndrome[] = [

  /* =======================================================
     01. VIÊM MŨI XOANG CẤP DO VIRUS
  ======================================================= */

  entSyndrome({
    id:
      "acute-viral-rhinosinusitis",

    title:
      "Viêm mũi xoang cấp do virus",

    setting: [
      "Ngoại trú",
    ],

    severity: [
      "Nhẹ",
    ],

    commonPathogens: [
      "Virus đường hô hấp",
    ],

    assessment: [
      "Đánh giá thời gian triệu chứng.",
      "Đánh giá nghẹt mũi.",
      "Đánh giá chảy mũi.",
      "Đánh giá đau hoặc đè nặng vùng mặt.",
      "Tìm biến chứng ổ mắt.",
      "Tìm biến chứng nội sọ.",
      "Phân biệt với viêm mũi xoang cấp do vi khuẩn.",
    ],

    firstLine: [
      {
        title:
          "Điều trị",

        drugs: [
          "Không sử dụng kháng sinh thường quy.",
          "Điều trị triệu chứng phù hợp.",
        ],
      },
    ],

    duration: [
      "Theo diễn biến triệu chứng.",
    ],

    reassessment: [
      "Đánh giá lại nếu triệu chứng kéo dài.",
      "Đánh giá lại nếu triệu chứng nặng lên.",
      "Đánh giá ngay nếu xuất hiện biến chứng.",
    ],

    deEscalation: [
      "Không khởi trị kháng sinh nếu chưa có bằng chứng phù hợp với nhiễm khuẩn.",
    ],

    renalAdjustment:
      false,

    sourceIds: [
      "aao-hns-sinusitis-2025",
    ],
  }),

  /* =======================================================
     02. VIÊM MŨI XOANG CẤP DO VI KHUẨN
  ======================================================= */

  entSyndrome({
    id:
      "acute-bacterial-rhinosinusitis",

    title:
      "Viêm mũi xoang cấp do vi khuẩn",

    setting: [
      "Ngoại trú",
      "Nội trú nếu biến chứng",
    ],

    commonPathogens: [
      "Streptococcus pneumoniae",
      "Haemophilus influenzae",
      "Moraxella catarrhalis",
    ],

    assessment: [
      "Triệu chứng kéo dài khoảng ≥10 ngày không cải thiện.",
      "Hoặc diễn tiến xấu sau giai đoạn ban đầu đã cải thiện.",
      "Đánh giá sốt.",
      "Đánh giá đau mặt khu trú.",
      "Đánh giá dịch mũi mủ.",
      "Đánh giá dị ứng beta-lactam.",
      "Đánh giá kháng sinh đã dùng gần đây.",
      "Tìm biến chứng ổ mắt.",
      "Tìm biến chứng nội sọ.",
    ],

    firstLine: [
      {
        title:
          "Lựa chọn ưu tiên",

        drugs: [
          "Amoxicillin/clavulanate thường là lựa chọn ưu tiên khi đã quyết định dùng kháng sinh.",
          "Không sử dụng kháng sinh cho mọi trường hợp viêm xoang cấp.",
        ],
      },
    ],

    alternatives: [
      {
        title:
          "Dị ứng beta-lactam",

        drugs: [
          "Chọn thuốc thay thế dựa trên loại phản ứng dị ứng, mức độ bệnh và guideline.",
        ],
      },
    ],

    duration: [
      "Ưu tiên liệu trình ngắn phù hợp ở người lớn đáp ứng tốt.",
      "Cá thể hóa khi có biến chứng hoặc suy giảm miễn dịch.",
    ],

    reassessment: [
      "Đánh giá lại khi không cải thiện.",
      "Đánh giá lại khi bệnh xấu đi.",
      "Xem xét vi khuẩn kháng thuốc.",
      "Xem xét chẩn đoán khác.",
      "Xem xét biến chứng.",
    ],

    sourceIds: [
      "aao-hns-sinusitis-2025",
      "idsa-rhinosinusitis",
    ],
  }),

  /* =======================================================
     03. VIÊM MŨI XOANG MẠN
  ======================================================= */

  entSyndrome({
    id:
      "chronic-rhinosinusitis-exacerbation",

    title:
      "Viêm mũi xoang mạn - đợt cấp nghi nhiễm khuẩn",

    setting: [
      "Ngoại trú",
      "Tai Mũi Họng",
    ],

    commonPathogens: [
      "Phụ thuộc tiền sử sử dụng kháng sinh",
      "Staphylococcus aureus",
      "Gram âm ở người bệnh đã can thiệp xoang hoặc sử dụng nhiều kháng sinh",
    ],

    assessment: [
      "Xác nhận chẩn đoán viêm mũi xoang mạn.",
      "Đánh giá polyp mũi.",
      "Đánh giá tiền sử phẫu thuật xoang.",
      "Đánh giá kháng sinh đã sử dụng.",
      "Cân nhắc nội soi.",
      "Cân nhắc cấy định hướng ở bệnh khó trị hoặc tái phát.",
    ],

    firstLine: [
      {
        title:
          "Nguyên tắc",

        drugs: [
          "Không sử dụng kháng sinh kéo dài thường quy chỉ vì có viêm xoang mạn.",
          "Chỉ cân nhắc kháng sinh khi có bằng chứng đợt cấp nhiễm khuẩn.",
          "Ưu tiên điều trị theo vi sinh ở bệnh khó trị hoặc tái phát nhiều.",
        ],
      },
    ],

    sourceIds: [
      "aao-hns-sinusitis-2025",
    ],
  }),

  /* =======================================================
     04. VIÊM HỌNG / VIÊM AMIDAN CẤP
  ======================================================= */

  entSyndrome({
    id:
      "acute-pharyngotonsillitis",

    title:
      "Viêm họng / viêm amidan cấp",

    setting: [
      "Ngoại trú",
    ],

    commonPathogens: [
      "Phần lớn do virus",
      "Streptococcus pyogenes",
    ],

    assessment: [
      "Đánh giá dấu hiệu gợi ý virus.",
      "Sử dụng clinical scoring system phù hợp.",
      "Xác định người bệnh cần xét nghiệm GAS.",
      "RADT hoặc xét nghiệm GAS khi có chỉ định.",
      "Đánh giá dị ứng penicillin.",
      "Tìm dấu hiệu áp xe quanh amidan.",
    ],

    firstLine: [
      {
        title:
          "Không có bằng chứng GAS",

        drugs: [
          "Không dùng kháng sinh thường quy.",
          "Điều trị triệu chứng.",
        ],
      },

      {
        title:
          "Xác định GAS",

        drugs: [
          "Penicillin nếu không dị ứng.",
          "Hoặc amoxicillin nếu không dị ứng.",
        ],
      },
    ],

    sourceIds: [
      "idsa-gas-2025",
    ],
  }),

  /* =======================================================
     05. VIÊM HỌNG DO GAS
  ======================================================= */

  entSyndrome({
    id:
      "gas-pharyngitis",

    title:
      "Viêm họng do Streptococcus nhóm A",

    setting: [
      "Ngoại trú",
    ],

    commonPathogens: [
      "Streptococcus pyogenes",
    ],

    assessment: [
      "Sử dụng clinical scoring system.",
      "Xét nghiệm GAS khi có chỉ định.",
      "Đánh giá dị ứng penicillin.",
      "Phân biệt nhiễm trùng thật với người mang GAS.",
    ],

    firstLine: [
      {
        title:
          "Lựa chọn ưu tiên",

        drugs: [
          "Penicillin.",
          "Hoặc amoxicillin.",
        ],
      },
    ],

    alternatives: [
      {
        title:
          "Dị ứng penicillin",

        drugs: [
          "Chọn thuốc thay thế theo loại phản ứng dị ứng.",
          "Đối chiếu tình hình kháng macrolide địa phương.",
        ],
      },
    ],

    sourceIds: [
      "idsa-gas-2025",
    ],
  }),

  /* =======================================================
     06. ÁP XE QUANH AMIDAN
  ======================================================= */

  entSyndrome({
    id:
      "peritonsillar-abscess",

    title:
      "Áp xe quanh amidan",

    setting: [
      "Cấp cứu",
      "Tai Mũi Họng",
    ],

    severity: [
      "Nặng",
    ],

    commonPathogens: [
      "Streptococcus pyogenes",
      "Streptococcus anginosus group",
      "Staphylococcus aureus",
      "Vi khuẩn kỵ khí vùng miệng - họng",
    ],

    assessment: [
      "Đau họng thường lệch một bên.",
      "Khít hàm.",
      "Giọng ngậm hột thị.",
      "Lệch lưỡi gà.",
      "Đánh giá đường thở.",
      "Đánh giá lan khoang cổ sâu.",
    ],

    sourceControl: [
      "Hội chẩn Tai Mũi Họng.",
      "Chọc hút hoặc rạch dẫn lưu khi có chỉ định.",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Phủ Streptococcus.",
          "Phủ vi khuẩn kỵ khí vùng miệng - họng.",
          "Beta-lactam/beta-lactamase inhibitor thường được cân nhắc.",
        ],
      },
    ],

    duration: [
      "Theo source control và đáp ứng lâm sàng.",
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  /* =======================================================
     07. NHIỄM KHUẨN KHOANG CỔ SÂU
  ======================================================= */

  entSyndrome({
    id:
      "deep-neck-space-infection",

    title:
      "Nhiễm khuẩn khoang cổ sâu",

    setting: [
      "Cấp cứu",
      "Nội trú",
      "Tai Mũi Họng",
    ],

    severity: [
      "Nặng",
    ],

    commonPathogens: [
      "Streptococcus spp.",
      "Staphylococcus aureus",
      "Vi khuẩn kỵ khí khoang miệng",
      "Gram âm tùy nguồn nhiễm",
    ],

    assessment: [
      "Đánh giá đường thở ngay.",
      "CT cổ có cản quang khi phù hợp.",
      "Tìm nguồn từ răng.",
      "Tìm nguồn từ amidan.",
      "Tìm nguồn từ tuyến nước bọt.",
      "Đánh giá nguy cơ lan trung thất.",
      "Lấy mủ để cấy khi dẫn lưu.",
    ],

    sourceControl: [
      "Bảo vệ đường thở khi cần.",
      "Dẫn lưu ổ áp xe.",
      "Loại bỏ nguồn nhiễm.",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Phủ Streptococcus.",
          "Phủ Staphylococcus.",
          "Phủ vi khuẩn kỵ khí khoang miệng.",
          "Mở rộng Gram âm hoặc MRSA khi có yếu tố nguy cơ.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  /* =======================================================
     08. VIÊM NẮP THANH QUẢN
  ======================================================= */

  entSyndrome({
    id:
      "adult-epiglottitis",

    title:
      "Viêm nắp thanh quản ở người lớn",

    setting: [
      "Cấp cứu",
      "ICU",
    ],

    severity: [
      "Nặng",
      "Nguy cơ tắc đường thở",
    ],

    commonPathogens: [
      "Haemophilus influenzae",
      "Streptococcus pneumoniae",
      "Streptococcus pyogenes",
      "Staphylococcus aureus",
    ],

    assessment: [
      "Ưu tiên đánh giá đường thở.",
      "Hội chẩn Tai Mũi Họng.",
      "Hội chẩn Gây mê/Hồi sức nếu có nguy cơ tắc đường thở.",
      "Cấy máu khi phù hợp.",
    ],

    firstLine: [
      {
        title:
          "Kháng sinh kinh nghiệm",

        drugs: [
          "Cephalosporin thế hệ 3.",
          "Cân nhắc phủ MRSA khi có yếu tố nguy cơ.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  /* =======================================================
     09. VIÊM TAI NGOÀI CẤP
  ======================================================= */

  entSyndrome({
    id:
      "acute-otitis-externa",

    title:
      "Viêm tai ngoài cấp",

    setting: [
      "Ngoại trú",
      "Tai Mũi Họng",
    ],

    severity: [
      "Nhẹ / trung bình",
    ],

    commonPathogens: [
      "Pseudomonas aeruginosa",
      "Staphylococcus aureus",
    ],

    assessment: [
      "Khám ống tai.",
      "Đánh giá màng nhĩ.",
      "Đánh giá đái tháo đường.",
      "Đánh giá suy giảm miễn dịch.",
      "Đánh giá tình trạng lan ngoài ống tai.",
    ],

    firstLine: [
      {
        title:
          "Điều trị",

        drugs: [
          "Điều trị tại chỗ là nền tảng khi nhiễm khuẩn còn khu trú.",
          "Không sử dụng kháng sinh toàn thân thường quy cho viêm tai ngoài không biến chứng.",
        ],
      },
    ],

    renalAdjustment:
      false,

    sourceIds: [
      "aao-hns-otitis-externa",
    ],
  }),

  /* =======================================================
     10. VIÊM TAI NGOÀI HOẠI TỬ
  ======================================================= */

  entSyndrome({
    id:
      "necrotizing-otitis-externa",

    title:
      "Viêm tai ngoài ác tính / viêm tai ngoài hoại tử",

    setting: [
      "Nội trú",
      "Tai Mũi Họng",
    ],

    severity: [
      "Nặng",
    ],

    commonPathogens: [
      "Pseudomonas aeruginosa",
      "Staphylococcus aureus",
      "Nấm ở một số người bệnh",
    ],

    assessment: [
      "Đánh giá đái tháo đường.",
      "Đánh giá suy giảm miễn dịch.",
      "Đánh giá đau tai nhiều hoặc đau về đêm.",
      "Tìm mô hạt ống tai.",
      "CT/MRI khi phù hợp.",
      "Cấy bệnh phẩm trước điều trị khi có thể.",
      "Đánh giá tổn thương dây thần kinh sọ.",
    ],

    firstLine: [
      {
        title:
          "Điều trị",

        drugs: [
          "Kháng sinh toàn thân có hoạt tính với Pseudomonas.",
          "Chuyển điều trị đích theo cấy và AST.",
        ],
      },
    ],

    duration: [
      "Thường cần điều trị kéo dài.",
      "Theo lâm sàng, dấu viêm và hình ảnh.",
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  /* =======================================================
     11. VIÊM TAI GIỮA CẤP
  ======================================================= */

  entSyndrome({
    id:
      "acute-otitis-media-adult",

    title:
      "Viêm tai giữa cấp ở người lớn",

    setting: [
      "Ngoại trú",
      "Tai Mũi Họng",
    ],

    commonPathogens: [
      "Streptococcus pneumoniae",
      "Haemophilus influenzae",
      "Moraxella catarrhalis",
    ],

    assessment: [
      "Soi tai.",
      "Xác định dịch tai giữa.",
      "Đánh giá màng nhĩ phồng.",
      "Đánh giá thủng màng nhĩ.",
      "Đánh giá viêm xương chũm.",
      "Đánh giá kháng sinh đã sử dụng gần đây.",
    ],

    firstLine: [
      {
        title:
          "Điều trị",

        drugs: [
          "Amoxicillin thường là lựa chọn đầu khi có chỉ định dùng kháng sinh.",
          "Amoxicillin/clavulanate khi có yếu tố gợi ý vi khuẩn sinh beta-lactamase hoặc thất bại điều trị phù hợp.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  /* =======================================================
     12. VIÊM XƯƠNG CHŨM
  ======================================================= */

  entSyndrome({
    id:
      "mastoiditis",

    title:
      "Viêm xương chũm",

    setting: [
      "Nội trú",
      "Tai Mũi Họng",
    ],

    severity: [
      "Nặng",
    ],

    commonPathogens: [
      "Streptococcus pneumoniae",
      "Streptococcus pyogenes",
      "Staphylococcus aureus",
      "Pseudomonas aeruginosa ở bệnh tai mạn hoặc đã can thiệp",
    ],

    assessment: [
      "Khám Tai Mũi Họng.",
      "CT xương thái dương khi phù hợp.",
      "Tìm áp xe dưới màng xương.",
      "Tìm biến chứng nội sọ.",
      "Cấy dịch tai hoặc bệnh phẩm phẫu thuật khi có.",
    ],

    sourceControl: [
      "Hội chẩn Tai Mũi Họng.",
      "Dẫn lưu hoặc mastoidectomy khi có chỉ định.",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Cephalosporin thế hệ 3 hoặc beta-lactam phù hợp.",
          "Thêm phủ MRSA hoặc Pseudomonas theo yếu tố nguy cơ.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  /* =======================================================
     13. VIÊM TAI GIỮA MẠN MỦ
  ======================================================= */

  entSyndrome({
    id:
      "chronic-suppurative-otitis-media",

    title:
      "Viêm tai giữa mạn mủ",

    setting: [
      "Tai Mũi Họng",
      "Ngoại trú",
      "Nội trú nếu biến chứng",
    ],

    commonPathogens: [
      "Pseudomonas aeruginosa",
      "Staphylococcus aureus",
      "Proteus spp.",
      "Gram âm khác",
    ],

    assessment: [
      "Đánh giá thủng màng nhĩ.",
      "Đánh giá cholesteatoma.",
      "Đánh giá tiền sử phẫu thuật tai.",
      "Đánh giá biến chứng xương chũm.",
      "Cấy dịch tai trong bệnh dai dẳng hoặc tái phát.",
    ],

    firstLine: [
      {
        title:
          "Nguyên tắc",

        drugs: [
          "Làm sạch tai và điều trị tại chỗ khi phù hợp.",
          "Kháng sinh toàn thân khi có lan rộng hoặc biến chứng.",
          "Điều trị đích theo cấy nếu bệnh kéo dài.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  /* =======================================================
     14. VIÊM THANH QUẢN CẤP
  ======================================================= */

  entSyndrome({
    id:
      "acute-laryngitis",

    title:
      "Viêm thanh quản cấp",

    setting: [
      "Ngoại trú",
    ],

    severity: [
      "Nhẹ",
    ],

    commonPathogens: [
      "Phần lớn do virus",
    ],

    assessment: [
      "Đánh giá khàn tiếng.",
      "Đánh giá khó thở.",
      "Đánh giá dấu hiệu viêm nắp thanh quản.",
      "Đánh giá thời gian kéo dài triệu chứng.",
    ],

    firstLine: [
      {
        title:
          "Điều trị",

        drugs: [
          "Không dùng kháng sinh thường quy trong viêm thanh quản cấp không biến chứng.",
          "Điều trị hỗ trợ và nghỉ giọng.",
        ],
      },
    ],

    renalAdjustment:
      false,

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  /* =======================================================
     15. ÁP XE SAU HỌNG
  ======================================================= */

  entSyndrome({
    id:
      "retropharyngeal-abscess",

    title:
      "Áp xe sau họng",

    setting: [
      "Cấp cứu",
      "Nội trú",
      "Tai Mũi Họng",
    ],

    severity: [
      "Nặng",
    ],

    commonPathogens: [
      "Streptococcus spp.",
      "Staphylococcus aureus",
      "Vi khuẩn kỵ khí vùng miệng - họng",
    ],

    assessment: [
      "Đánh giá đường thở.",
      "CT cổ có cản quang khi phù hợp.",
      "Đánh giá lan xuống trung thất.",
      "Lấy bệnh phẩm khi dẫn lưu.",
    ],

    sourceControl: [
      "Bảo vệ đường thở khi cần.",
      "Dẫn lưu ngoại khoa khi có chỉ định.",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Phủ Streptococcus.",
          "Phủ Staphylococcus.",
          "Phủ vi khuẩn kỵ khí.",
          "Thêm MRSA coverage khi có yếu tố nguy cơ.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),

  /* =======================================================
     16. ÁP XE CẠNH HỌNG
  ======================================================= */

  entSyndrome({
    id:
      "parapharyngeal-abscess",

    title:
      "Áp xe cạnh họng",

    setting: [
      "Cấp cứu",
      "Nội trú",
      "Tai Mũi Họng",
    ],

    severity: [
      "Nặng",
    ],

    commonPathogens: [
      "Streptococcus spp.",
      "Staphylococcus aureus",
      "Vi khuẩn kỵ khí",
    ],

    assessment: [
      "Đánh giá đường thở.",
      "CT cổ có cản quang khi phù hợp.",
      "Đánh giá lan mạch cảnh.",
      "Đánh giá lan trung thất.",
      "Lấy mủ cấy khi can thiệp.",
    ],

    sourceControl: [
      "Dẫn lưu khi có chỉ định.",
      "Hội chẩn Tai Mũi Họng.",
    ],

    firstLine: [
      {
        title:
          "Điều trị kinh nghiệm",

        drugs: [
          "Phủ Gram dương vùng hầu họng.",
          "Phủ vi khuẩn kỵ khí.",
          "Mở rộng MRSA/Gram âm theo yếu tố nguy cơ.",
        ],
      },
    ],

    sourceIds: [
      "bach-mai-2023",
      "xanh-pon-2025",
    ],
  }),
];

/* =========================================================
   FINAL DATABASE
========================================================= */

export const allSyndromes:
  ClinicalSyndrome[] = [
    ...baseSyndromes,
    ...entSyndromes,
  ];

/* =========================================================
   SOURCES
========================================================= */

export const guidelineSources:
  GuidelineSource[] = [
    ...baseGuidelineSources,
    ...entSources,
  ];

export const sourceMap =
  Object.fromEntries(
    guidelineSources.map(
      (source) => [
        source.id,
        source,
      ]
    )
  );

/* =========================================================
   CATEGORIES
========================================================= */

export const syndromeCategories = [
  "Tất cả",

  ...Array.from(
    new Set(
      allSyndromes.map(
        (item) =>
          item.category
      )
    )
  ),
];

/* =========================================================
   COUNTS
========================================================= */

export const categoryCounts =
  Object.fromEntries(
    syndromeCategories
      .filter(
        (item) =>
          item !==
          "Tất cả"
      )
      .map(
        (category) => [
          category,

          allSyndromes.filter(
            (item) =>
              item.category ===
              category
          ).length,
        ]
      )
  );

/* =========================================================
   PATHOGEN GROUPS
========================================================= */

export const pathogenGroups = [
  "Tất cả",

  ...Array.from(
    new Set(
      pathogenGuidance.map(
        (item) =>
          item.group
      )
    )
  ),
];