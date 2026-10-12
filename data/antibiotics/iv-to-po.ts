export type IVPOConversion = {
  id: string;

  ingredientId: string;
  ingredientName: string;

  ivDrug: string;
  poDrug: string;

  oralBioavailability?: string;

  conversionRatio?: string;

  ivDoseExample?: string;
  poDoseExample?: string;

  requiredCriteria: string[];

  exclusionCriteria: string[];

  notes?: string[];

  source: {
    organization: string;
    title: string;
    year: number;
    url?: string;
  };
};

export const ivToPoData: IVPOConversion[] = [
  {
    id: "levofloxacin",

    ingredientId: "levofloxacin",

    ingredientName: "Levofloxacin",

    ivDrug: "Levofloxacin IV",

    poDrug: "Levofloxacin PO",

    oralBioavailability:
      "Xấp xỉ 99%",

    conversionRatio:
      "1 : 1",

    ivDoseExample:
      "500 mg IV mỗi 24 giờ",

    poDoseExample:
      "500 mg PO mỗi 24 giờ",

    requiredCriteria: [
      "Huyết động ổn định",
      "Tình trạng nhiễm khuẩn đang cải thiện",
      "Người bệnh tỉnh táo và có thể dùng thuốc đường uống",
      "Không nôn kéo dài",
      "Không có bằng chứng liệt ruột hoặc kém hấp thu đáng kể",
      "Không có chỉ định bắt buộc phải tiếp tục điều trị đường tĩnh mạch",
    ],

    exclusionCriteria: [
      "Sốc hoặc huyết động không ổn định",
      "Không thể sử dụng đường uống",
      "Nôn kéo dài",
      "Liệt ruột hoặc hội chứng kém hấp thu nặng",
      "Viêm màng não hoặc nhiễm khuẩn cần nồng độ thuốc đặc biệt tại mô đích",
      "Bệnh cảnh lâm sàng yêu cầu tiếp tục điều trị IV",
    ],

    notes: [
      "Cần đánh giá toàn bộ bệnh cảnh lâm sàng trước khi chuyển.",
      "Liều cụ thể còn phụ thuộc chỉ định, chức năng thận và các yếu tố người bệnh.",
    ],

    source: {
      organization:
        "FDA / Product Information",

      title:
        "Levofloxacin prescribing information",

      year:
        2025,

      url:
        "https://www.accessdata.fda.gov/",
    },
  },

  {
    id: "ciprofloxacin",

    ingredientId:
      "ciprofloxacin",

    ingredientName:
      "Ciprofloxacin",

    ivDrug:
      "Ciprofloxacin IV",

    poDrug:
      "Ciprofloxacin PO",

    oralBioavailability:
      "Khoảng 70%",

    conversionRatio:
      "Liều IV và PO không hoàn toàn tương đương theo mg; lựa chọn phác đồ tương ứng theo chỉ định.",

    ivDoseExample:
      "400 mg IV mỗi 12 giờ",

    poDoseExample:
      "500–750 mg PO mỗi 12 giờ",

    requiredCriteria: [
      "Huyết động ổn định",
      "Triệu chứng nhiễm khuẩn cải thiện",
      "Sử dụng được đường uống",
      "Không nôn kéo dài",
      "Không có rối loạn hấp thu đáng kể",
      "Không có chỉ định bắt buộc dùng IV",
    ],

    exclusionCriteria: [
      "Sốc hoặc không ổn định huyết động",
      "Không sử dụng được đường uống",
      "Kém hấp thu nặng",
      "Nôn kéo dài",
      "Bệnh cảnh cần nồng độ IV đặc biệt",
    ],

    notes: [
      "Đánh giá tương tác với cation đa hóa trị khi dùng đường uống.",
      "Hiệu chỉnh liều theo chức năng thận khi cần.",
    ],

    source: {
      organization:
        "FDA / Product Information",

      title:
        "Ciprofloxacin prescribing information",

      year:
        2025,

      url:
        "https://www.accessdata.fda.gov/",
    },
  },

  {
    id: "moxifloxacin",

    ingredientId:
      "moxifloxacin",

    ingredientName:
      "Moxifloxacin",

    ivDrug:
      "Moxifloxacin IV",

    poDrug:
      "Moxifloxacin PO",

    oralBioavailability:
      "Khoảng 90%",

    conversionRatio:
      "1 : 1",

    ivDoseExample:
      "400 mg IV mỗi 24 giờ",

    poDoseExample:
      "400 mg PO mỗi 24 giờ",

    requiredCriteria: [
      "Huyết động ổn định",
      "Đáp ứng lâm sàng thuận lợi",
      "Có thể sử dụng đường uống",
      "Không nôn kéo dài",
      "Không có kém hấp thu rõ",
    ],

    exclusionCriteria: [
      "Không ổn định huyết động",
      "Không thể sử dụng đường uống",
      "Kém hấp thu nặng",
      "Bệnh cảnh bắt buộc dùng IV",
    ],

    notes: [
      "Cần lưu ý nguy cơ kéo dài QT và các chống chỉ định liên quan.",
    ],

    source: {
      organization:
        "FDA / Product Information",

      title:
        "Moxifloxacin prescribing information",

      year:
        2025,

      url:
        "https://www.accessdata.fda.gov/",
    },
  },

  {
    id: "metronidazole",

    ingredientId:
      "metronidazole",

    ingredientName:
      "Metronidazole",

    ivDrug:
      "Metronidazole IV",

    poDrug:
      "Metronidazole PO",

    oralBioavailability:
      "Rất cao, gần 100%",

    conversionRatio:
      "Thông thường có thể chuyển tương đương theo tổng liều ngày tùy chỉ định.",

    ivDoseExample:
      "500 mg IV mỗi 8 giờ",

    poDoseExample:
      "500 mg PO mỗi 8 giờ",

    requiredCriteria: [
      "Huyết động ổn định",
      "Dùng được đường uống",
      "Không nôn kéo dài",
      "Không có rối loạn hấp thu đáng kể",
      "Tình trạng nhiễm khuẩn cải thiện",
    ],

    exclusionCriteria: [
      "Không thể dùng đường uống",
      "Nôn kéo dài",
      "Kém hấp thu nặng",
      "Bệnh cảnh lâm sàng yêu cầu IV",
    ],

    notes: [
      "Có thể là ứng viên tốt cho chuyển IV sang PO do sinh khả dụng đường uống cao.",
    ],

    source: {
      organization:
        "Product Information",

      title:
        "Metronidazole prescribing information",

      year:
        2025,

      url:
        "https://www.accessdata.fda.gov/",
    },
  },

  {
    id: "linezolid",

    ingredientId:
      "linezolid",

    ingredientName:
      "Linezolid",

    ivDrug:
      "Linezolid IV",

    poDrug:
      "Linezolid PO",

    oralBioavailability:
      "Xấp xỉ 100%",

    conversionRatio:
      "1 : 1",

    ivDoseExample:
      "600 mg IV mỗi 12 giờ",

    poDoseExample:
      "600 mg PO mỗi 12 giờ",

    requiredCriteria: [
      "Huyết động ổn định",
      "Người bệnh sử dụng được đường uống",
      "Không nôn kéo dài",
      "Không có kém hấp thu đáng kể",
      "Không có chống chỉ định đường uống",
    ],

    exclusionCriteria: [
      "Không sử dụng được đường uống",
      "Nôn kéo dài",
      "Kém hấp thu nặng",
      "Tình trạng lâm sàng đòi hỏi IV",
    ],

    notes: [
      "Sinh khả dụng đường uống gần hoàn toàn nên thường có thể chuyển IV sang PO theo cùng liều.",
      "Theo dõi huyết học khi điều trị kéo dài.",
    ],

    source: {
      organization:
        "FDA / Product Information",

      title:
        "Linezolid prescribing information",

      year:
        2025,

      url:
        "https://www.accessdata.fda.gov/",
    },
  },
];