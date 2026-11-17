/*
  Liều kháng sinh theo Dược thư quốc gia Việt Nam, lần xuất bản thứ ba (2023) – Bộ Y tế, Hội đồng Dược thư quốc gia.
  Trích NGUYÊN VĂN mục "Liều lượng và cách dùng" của từng chuyên luận, chọn câu theo chỉ định tai mũi họng
  (viêm tai giữa, viêm xoang, viêm họng/amidan, viêm miệng hầu) và liều thường dùng.
  page = số trang in, đọc từ header của từng trang PDF (độ lệch giữa trang PDF và trang in thay đổi trong sách: đầu sách +6, cuối sách +5); pdfPage = số trang trong file PDF.
  Kiểm tra tự động: mỗi câu được so nguyên văn với văn bản trích từ PDF (68 câu).
*/
export type DtqgInd = "aom" | "abrs" | "phar" | "deep" | "gen";
export type DtqgEntDose = { ind: DtqgInd[]; pop: "adult" | "child"; label: string; text: string; page: number; pdfPage: number; table?: boolean; caution?: boolean };
export type DtqgEntDrug = { name: string; entries: DtqgEntDose[] };

export const DTQG_SOURCE = "Dược thư quốc gia Việt Nam, lần xuất bản thứ ba (2023)";

export const DTQG_ENT: Record<string, DtqgEntDrug> = {
  "amox": {
    "name": "Amoxicilin",
    "entries": [
      {
        "ind": [
          "aom",
          "abrs",
          "gen"
        ],
        "pop": "adult",
        "label": "Liều thường dùng (gồm viêm tai giữa, viêm xoang) – đường uống",
        "text": "Người lớn và trẻ em ≥ 12 tuổi: 500 mg mỗi 8 giờ, có thể tăng liều tới 1 g mỗi 8 giờ trong các nhiễm khuẩn nặng",
        "pdfPage": 200,
        "page": 206
      },
      {
        "ind": [
          "aom",
          "abrs",
          "gen"
        ],
        "pop": "child",
        "label": "Liều thường dùng (gồm viêm tai giữa, viêm xoang) – đường uống",
        "text": "trẻ sơ sinh 7 - 28 ngày tuổi: 30 mg/kg mỗi 8 giờ (tối đa 125 mg); trẻ em 1 - 11 tháng tuổi: 125 mg mỗi 8 giờ, khi cần có thể tăng liều tới 30 mg/kg mỗi 8 giờ; trẻ em 1 - 4 tuổi: 250 mg mỗi 8 giờ, khi cần có thể tăng liều tới 30 mg/kg mỗi 8 giờ; trẻ em 5 - 11 tuổi: 500 mg mỗi 8 giờ, khi cần có thể tăng liều tới 30 mg/kg mỗi 8 giờ (tối đa 1 g mỗi liều).",
        "pdfPage": 200,
        "page": 206
      }
    ]
  },
  "coamox": {
    "name": "Amoxicilin và kali clavulanat",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Liều thường dùng – người lớn và trẻ em ≥ 40 kg",
        "text": "Đường uống: 250 mg/125 mg mỗi 8 giờ hoặc 500 mg/125 mg mỗi 12 giờ, có thể tăng liều tới 500 mg/125 mg mỗi 8 giờ hoặc 875 mg/125 mg mỗi 12 giờ trong các nhiễm khuẩn nặng và nhiễm khuẩn hô hấp dưới",
        "pdfPage": 204,
        "page": 210
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Tiêm hoặc truyền tĩnh mạch – người lớn và trẻ em ≥ 40 kg",
        "text": "Tiêm hoặc truyền tĩnh mạch: 1 000 mg/200 mg amoxicilin/acid clavulanic mỗi 8 giờ.",
        "pdfPage": 204,
        "page": 210
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Liều thường dùng – trẻ em < 40 kg, đường uống",
        "text": "Trẻ sơ sinh và trẻ em dưới 12 tuần tuổi: 30 mg amoxicilin/ kg/ngày, chia làm 2 lần (nên dùng hỗn dịch chứa 125 mg amoxicilin/ 5 ml); trẻ em trên 12 tuần tuổi: 20 mg amoxicilin/kg/ngày, chia làm 2 lần (dạng hỗn dịch chứa 125 mg hoặc 250 mg amoxicilin/5 ml) hoặc 25 mg amoxicilin/kg/ngày, chia làm 2 lần (dạng hỗn dịch chứa 200 mg hoặc 400 mg amoxicilin/5 ml)",
        "pdfPage": 205,
        "page": 211
      },
      {
        "ind": [
          "abrs"
        ],
        "pop": "child",
        "label": "Viêm xoang – trẻ em < 40 kg, đường uống",
        "text": "đối với viêm xoang, nhiễm khuẩn hô hấp dưới và các nhiễm khuẩn nặng ở trẻ em trên 12 tuần tuổi: 40 mg amoxicilin/kg/ngày, chia làm 2 lần (dạng hỗn dịch chứa 125 mg hoặc 250 mg amoxicilin/5 ml) hoặc 45 mg amoxicilin/kg/ngày, chia làm 2 lần (dạng hỗn dịch chứa 200 mg hoặc 400 mg amoxicilin/5 ml).",
        "pdfPage": 205,
        "page": 211
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Tiêm hoặc truyền tĩnh mạch – trẻ em < 40 kg",
        "text": "Trẻ dưới 3 tháng tuổi hoặc cân nặng dưới 4 kg: 25 mg/5 mg/kg cách 12 giờ một lần; trẻ em từ 3 tháng tuổi trở lên: 25 mg/5 mg/kg, cách 8 giờ một lần; trẻ em 3 tháng - 17 tuổi: liều tương đương 30 mg/kg mỗi 8 giờ (tối đa 1 000 mg/200 mg mỗi 8 giờ).",
        "pdfPage": 205,
        "page": 211
      }
    ]
  },
  "sam": {
    "name": "Ampicilin và sulbactam",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Cách tính liều",
        "text": "Liều thuốc được tính theo tổng lượng ampicilin và sulbactam theo tỷ lệ cố định (2 : 1).",
        "pdfPage": 213,
        "page": 219
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Người lớn – tiêm, truyền tĩnh mạch",
        "text": "Nhiễm khuẩn thông thường gây ra bởi vi khuẩn nhạy cảm: Từ 1,5 g đến 3 g, cứ 6 giờ/lần. Liều tối đa không vượt quá 12 g/ngày.",
        "pdfPage": 213,
        "page": 219
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Cách tính liều",
        "text": "Liều thuốc được tính theo tổng lượng ampicilin và sulbactam theo tỷ lệ cố định (2 : 1).",
        "pdfPage": 213,
        "page": 219
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Trẻ em",
        "text": "Trẻ từ 40 kg trở lên: Có thể dùng liều như người lớn. Trẻ từ 1 tuổi trở lên: 300 mg/kg/ngày, truyền tĩnh mạch, chia làm 4 liều cách đều 6 giờ. Theo đề nghị của Hội nhi khoa Viện hàn lâm Mỹ, liều dùng cho trẻ từ 1 tháng tuổi trở lên: 100 - 150 mg/kg/ngày, chia đều thành 4 liều trong ngày với nhiễm khuẩn nhẹ và vừa; 200 - 300 mg/kg/ngày, chia đều thành 4 liều trong ngày với nhiễm khuẩn nặng.",
        "pdfPage": 213,
        "page": 219
      }
    ]
  },
  "azi": {
    "name": "Azithromycin",
    "entries": [
      {
        "ind": [
          "phar"
        ],
        "pop": "adult",
        "label": "Viêm họng và viêm amidan – người lớn",
        "text": "Liều thông thường là liều đơn 500 mg vào ngày đầu tiên, sau đó dùng liều 250 mg × 1 lần/ngày vào ngày 2 - 5 (tổng liều 1,5 g trong 5 ngày).",
        "pdfPage": 255,
        "page": 261
      },
      {
        "ind": [
          "abrs"
        ],
        "pop": "adult",
        "label": "Viêm xoang cấp – người lớn",
        "text": "Liều thông thường là 500 mg × 1 lần/ngày trong vòng 3 ngày. Trong trường hợp sử dụng hỗn dịch giải phóng kéo dài, dùng liều 2 g duy nhất.",
        "pdfPage": 255,
        "page": 261
      },
      {
        "ind": [
          "aom"
        ],
        "pop": "child",
        "label": "Viêm tai giữa cấp – trẻ em",
        "text": "Trẻ ≥ 6 tháng dùng liều duy nhất 30 mg/kg (tối đa 1,5 g) hoặc dùng liều 10 mg/kg × 1 lần/ngày trong vòng 3 ngày. Ngoài ra, cũng có thể dùng liều 10 mg/kg × 1 lần/ngày vào ngày đầu tiên, sau đó dùng liều 5 mg/kg × 1 lần/ngày vào ngày 2 - 5.",
        "pdfPage": 255,
        "page": 261
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "child",
        "label": "Viêm họng và viêm amidan – trẻ em",
        "text": "Liều thông thường cho trẻ ≥ 2 tuổi là 12 mg/kg (tối đa 500 mg) × 1 lần/ngày trong vòng 5 ngày.",
        "pdfPage": 256,
        "page": 262
      },
      {
        "ind": [
          "abrs"
        ],
        "pop": "child",
        "label": "Viêm xoang cấp – trẻ em",
        "text": "Liều thông thường cho trẻ ≥ 6 tháng là 10 mg/kg × 1 lần/ngày trong vòng 3 ngày.",
        "pdfPage": 256,
        "page": 262
      }
    ]
  },
  "bpg": {
    "name": "Benzathin penicilin G",
    "entries": [
      {
        "ind": [
          "phar"
        ],
        "pop": "adult",
        "label": "Nhiễm khuẩn đường hô hấp trên do liên cầu – người lớn",
        "text": "Nhiễm khuẩn đường hô hấp trên do liên cầu khuẩn Streptococci: Tiêm bắp liều duy nhất 1 200 000 đơn vị.",
        "pdfPage": 276,
        "page": 282
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "child",
        "label": "Nhiễm khuẩn đường hô hấp trên do liên cầu – trẻ em",
        "text": "Trẻ cân nặng dưới 27 kg: Tiêm bắp liều duy nhất 300 000 - 600 000 đơn vị. Trẻ cân nặng trên 27 kg: Tiêm bắp liều duy nhất 900 000 đơn vị.",
        "pdfPage": 276,
        "page": 282
      }
    ]
  },
  "cefadroxil": {
    "name": "Cefadroxil",
    "entries": [
      {
        "ind": [
          "phar"
        ],
        "pop": "adult",
        "label": "Viêm họng, viêm amidan do Streptococcus pyogenes – người lớn",
        "text": "Người lớn: 1 g/ngày, dùng 1 lần hoặc chia 2 lần, uống ít nhất trong 10 ngày.",
        "pdfPage": 375,
        "page": 381
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "child",
        "label": "Viêm họng, viêm amidan do Streptococcus pyogenes – trẻ em",
        "text": "Trẻ em: 30 mg/kg/ngày, dùng 1 lần hay chia 2 lần, uống ít nhất trong 10 ngày.",
        "pdfPage": 375,
        "page": 381
      }
    ]
  },
  "cefalexin": {
    "name": "Cefalexin",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Liều thường dùng – người lớn",
        "text": "Liều thường dùng là 250 mg mỗi 6 giờ hoặc 500 mg mỗi 12 giờ.",
        "pdfPage": 377,
        "page": 383
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "adult",
        "label": "Viêm họng và viêm amiđan – người lớn",
        "text": "Viêm họng và viêm amiđan: Liều 500 mg mỗi 12 giờ, dùng thuốc ít nhất 10 ngày.",
        "pdfPage": 377,
        "page": 383
      },
      {
        "ind": [
          "aom"
        ],
        "pop": "child",
        "label": "Viêm tai giữa cấp – trẻ em",
        "text": "Viêm tai giữa cấp: 75 - 100 mg/kg/ngày, chia đều uống trong 4 lần.",
        "pdfPage": 378,
        "page": 384
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "child",
        "label": "Viêm họng và viêm amiđan – trẻ em",
        "text": "Dùng cefalexin điều trị viêm họng do liên cầu khuẩn ở trẻ > 01 tuổi với liều 25 - 50 mg/kg/ngày, chia làm 2 lần cách nhau 12 giờ, dùng ít nhất 10 ngày.",
        "pdfPage": 378,
        "page": 384
      }
    ]
  },
  "cefdinir": {
    "name": "Cefdinir",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Liều thường dùng – người lớn và trẻ em ≥ 13 tuổi",
        "text": "Người lớn và trẻ em ≥ 13 tuổi: 600 mg/ngày, dùng một lần hoặc chia làm hai lần mỗi ngày.",
        "pdfPage": 390,
        "page": 396
      },
      {
        "ind": [
          "abrs"
        ],
        "pop": "adult",
        "label": "Viêm xoang hàm cấp – người lớn và trẻ em ≥ 13 tuổi (bảng liều)",
        "text": "300 mg mỗi 12 giờ hoặc 600 mg mỗi 24 giờ; 10 ngày.",
        "table": true,
        "pdfPage": 390,
        "page": 396
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "adult",
        "label": "Viêm amiđan/viêm họng – người lớn và trẻ em ≥ 13 tuổi (bảng liều)",
        "text": "300 mg mỗi 12 giờ trong 5 - 10 ngày, hoặc 600 mg mỗi 24 giờ trong 10 ngày.",
        "table": true,
        "pdfPage": 390,
        "page": 396
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Liều thường dùng – trẻ em từ 6 tháng đến 12 tuổi",
        "text": "Trẻ em từ 6 tháng đến 12 tuổi: 14 mg/kg/ngày, dùng một lần hoặc chia làm 2 lần/ngày.",
        "pdfPage": 390,
        "page": 396
      },
      {
        "ind": [
          "aom"
        ],
        "pop": "child",
        "label": "Viêm tai giữa cấp – trẻ em 6 tháng đến 12 tuổi (bảng liều)",
        "text": "7 mg/kg mỗi 12 giờ trong 5 - 10 ngày, hoặc 14 mg/kg mỗi 24 giờ trong 10 ngày.",
        "table": true,
        "pdfPage": 390,
        "page": 396
      },
      {
        "ind": [
          "abrs"
        ],
        "pop": "child",
        "label": "Viêm xoang hàm cấp – trẻ em 6 tháng đến 12 tuổi (bảng liều)",
        "text": "7 mg/kg mỗi 12 giờ hoặc 14 mg/kg mỗi 24 giờ; 10 ngày.",
        "table": true,
        "pdfPage": 390,
        "page": 396
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "child",
        "label": "Viêm amiđan/viêm họng – trẻ em 6 tháng đến 12 tuổi (bảng liều)",
        "text": "7 mg/kg mỗi 12 giờ trong 5 - 10 ngày, hoặc 14 mg/kg mỗi 24 giờ trong 10 ngày.",
        "table": true,
        "pdfPage": 390,
        "page": 396
      }
    ]
  },
  "cefixim": {
    "name": "Cefixim",
    "entries": [
      {
        "ind": [
          "aom",
          "phar",
          "gen"
        ],
        "pop": "adult",
        "label": "Viêm họng, viêm tai giữa – người lớn",
        "text": "Trong điều trị viêm họng, phế quản cấp và mạn, viêm tai giữa, nhiễm khuẩn tiết niệu: Liều thường dùng ở người lớn là 400 mg uống 1 lần/ngày hoặc 200 mg uống 2 lần cách nhau 12 giờ. Đối với các loại nhiễm khuẩn do Streptococcus pyogenes, thời gian dùng thuốc ít nhất là 10 ngày.",
        "pdfPage": 398,
        "page": 404
      },
      {
        "ind": [
          "aom",
          "phar",
          "gen"
        ],
        "pop": "child",
        "label": "Trẻ em",
        "text": "Trẻ em trên 12 tuổi hoặc cân nặng trên 50 kg dùng liều như người lớn. Trẻ em trên 6 tháng tuổi đến 12 tuổi có thể dùng dạng hỗn dịch liều 8 mg/kg uống 1 lần/ngày hoặc 4 mg/kg uống 2 lần/ngày, mỗi lần cách nhau 12 giờ.",
        "pdfPage": 398,
        "page": 404
      },
      {
        "ind": [
          "aom",
          "phar",
          "gen"
        ],
        "pop": "adult",
        "label": "Thời gian điều trị",
        "text": "Thời gian điều trị thông thường cho nhiễm khuẩn đường tiết niệu không biến chứng và nhiễm khuẩn đường hô hấp trên là từ 5 - 10 ngày (nếu do Streptococcus beta tan huyết nhóm A phải điều trị ít nhất 10 ngày để phòng thấp tim hoặc viêm cầu thận); đối với nhiễm khuẩn đường hô hấp dưới và viêm tai giữa là từ 10 - 14 ngày.",
        "pdfPage": 398,
        "page": 404
      },
      {
        "ind": [
          "aom",
          "phar",
          "gen"
        ],
        "pop": "child",
        "label": "Thời gian điều trị",
        "text": "Thời gian điều trị thông thường cho nhiễm khuẩn đường tiết niệu không biến chứng và nhiễm khuẩn đường hô hấp trên là từ 5 - 10 ngày (nếu do Streptococcus beta tan huyết nhóm A phải điều trị ít nhất 10 ngày để phòng thấp tim hoặc viêm cầu thận); đối với nhiễm khuẩn đường hô hấp dưới và viêm tai giữa là từ 10 - 14 ngày.",
        "pdfPage": 398,
        "page": 404
      }
    ]
  },
  "cefotaxim": {
    "name": "Cefotaxim",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Người lớn và trẻ em trên 50 kg",
        "text": "Liều thường dùng với nhiễm khuẩn không nghiêm trọng: 1 g mỗi 12 giờ; với nhiễm khuẩn trung bình đến nặng: 1 - 2 g mỗi 8 giờ; với nhiễm khuẩn nặng: 2 - 3 g mỗi 6 - 8 giờ, tối đa 12 g/ngày.",
        "pdfPage": 402,
        "page": 408
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Trẻ 1 tháng - 12 tuổi hoặc trẻ dưới 50 kg",
        "text": "Liều thường dùng với nhiễm khuẩn không nghiêm trọng: 50 - 100 mg/kg/ngày, có thể tăng lên đến 200 mg/kg/ngày trong trường hợp nhiễm khuẩn nặng hoặc nghiêm trọng. Tổng liều hàng ngày được chia thành các liều nhỏ, cách nhau mỗi 8 - 12 giờ (tối đa mỗi 6 giờ).",
        "pdfPage": 402,
        "page": 408
      }
    ]
  },
  "cefpodoxim": {
    "name": "Cefpodoxim proxetil",
    "entries": [
      {
        "ind": [
          "phar"
        ],
        "pop": "adult",
        "label": "Viêm họng và/hoặc viêm amidan – người lớn và trẻ em trên 12 tuổi",
        "text": "Viêm họng và/hoặc viêm amidan: 100 mg mỗi 12 giờ (tổng liều 1 ngày là 200 mg) trong 5 đến 10 ngày.",
        "pdfPage": 410,
        "page": 416
      },
      {
        "ind": [
          "abrs"
        ],
        "pop": "adult",
        "label": "Viêm xoang hàm cấp tính – người lớn và trẻ em trên 12 tuổi",
        "text": "Viêm xoang hàm cấp tính: 200 mg mỗi 12 giờ (tổng liều 1 ngày là 400 mg) trong 10 ngày.",
        "pdfPage": 410,
        "page": 416
      },
      {
        "ind": [
          "aom"
        ],
        "pop": "child",
        "label": "Viêm tai giữa cấp tính – trẻ em từ 2 tháng đến 12 tuổi",
        "text": "Viêm tai giữa cấp tính: 5 mg/kg mỗi 12 giờ, tối đa 200 mg/lần (tổng liều 1 ngày là 10 mg/kg/ngày, tối đa 400 mg/ngày) trong 5 ngày.",
        "pdfPage": 410,
        "page": 416
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "child",
        "label": "Viêm họng và/hoặc viêm amidan – trẻ em từ 2 tháng đến 12 tuổi",
        "text": "Viêm họng và/hoặc viêm amidan: 5 mg/kg mỗi 12 giờ, tối đa 100 mg/lần (tổng liều 1 ngày là 10 mg/kg/ngày, tối đa 200 mg/ngày) trong 5 đến 10 ngày.",
        "pdfPage": 410,
        "page": 416
      },
      {
        "ind": [
          "abrs"
        ],
        "pop": "child",
        "label": "Viêm xoang hàm cấp tính – trẻ em từ 2 tháng đến 12 tuổi",
        "text": "Viêm xoang hàm cấp tính: 5 mg/kg mỗi 12 giờ, tối đa 200 mg/ liều (tổng liều 1 ngày là 10 mg/kg/ngày, tối đa 400 mg/ngày) trong 10 ngày.",
        "pdfPage": 410,
        "page": 416
      }
    ]
  },
  "ceftriaxon": {
    "name": "Ceftriaxon",
    "entries": [
      {
        "ind": [
          "aom"
        ],
        "pop": "adult",
        "label": "Viêm tai giữa cấp – người lớn và trẻ em > 12 tuổi hoặc ≥ 50 kg",
        "text": "Viêm tai giữa cấp: Tiêm bắp 1 liều đơn 1 - 2 g ceftriaxon.",
        "pdfPage": 420,
        "page": 426
      },
      {
        "ind": [
          "aom"
        ],
        "pop": "child",
        "label": "Viêm tai giữa cấp – trẻ em ≤ 12 tuổi (< 50 kg)",
        "text": "Viêm tai giữa cấp: Tiêm bắp 1 liều đơn 50 mg/kg ceftriaxon.",
        "pdfPage": 421,
        "page": 427
      }
    ]
  },
  "cefuroxim": {
    "name": "Cefuroxim",
    "entries": [
      {
        "ind": [
          "aom",
          "abrs",
          "phar",
          "gen"
        ],
        "pop": "adult",
        "label": "Nhiễm khuẩn tai mũi họng (viêm họng, viêm tai giữa, viêm xoang) – người lớn",
        "text": "Nhiễm khuẩn da và mô mềm không biến chứng, nhiễm khuẩn tai mũi họng (viêm họng, viêm tai giữa, viêm xoang): Uống 250 mg hoặc 500 mg, 12 giờ một lần. Thời gian điều trị 10 ngày.",
        "pdfPage": 424,
        "page": 430
      },
      {
        "ind": [
          "aom",
          "abrs",
          "phar",
          "gen"
        ],
        "pop": "child",
        "label": "Trẻ em – đường uống (cefuroxim axetil)",
        "text": "Trẻ em từ 3 tháng - 1 tuổi: 10 mg/kg/lần (tối đa 125 mg/lần), 12 giờ một lần. Trẻ em từ 2 - 12 tuổi: 15 mg/kg/lần (tối đa 250 mg/lần), 12 giờ một lần. Trẻ em từ 12 - 17 tuổi: 250 mg/lần, 12 giờ một lần.",
        "pdfPage": 424,
        "page": 430
      }
    ]
  },
  "clari": {
    "name": "Clarithromycin",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Người lớn",
        "text": "Người lớn: Uống 250 - 500 mg/lần, cách 12 giờ một lần hoặc viên giải phóng kéo dài 1 000 mg (2 viên 500 mg)/lần, 1 lần/ngày; trong 7 - 14 ngày.",
        "pdfPage": 459,
        "page": 465
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Trẻ em",
        "text": "Trẻ em từ sáu tháng tuổi trở lên: Uống 7,5 mg/kg/lần, cách 12 giờ một lần (tối đa 500 mg/lần).",
        "pdfPage": 459,
        "page": 465
      }
    ]
  },
  "clinda": {
    "name": "Clindamycin",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Liều thường dùng – người lớn",
        "text": "Uống: 150 - 450 mg/lần, cách 6 - 8 giờ/lần; liều tối đa: 1,8 g/ngày. Tiêm bắp và tiêm tĩnh mạch: 0,6 - 1,2 g/ngày, chia làm 2 - 4 lần; trong nhiễm khuẩn nặng có thể dùng 2,7 g/ngày và liều tối đa là 4,8 g/ngày cho những trường hợp nguy hiểm đến tính mạng.",
        "pdfPage": 462,
        "page": 468
      },
      {
        "ind": [
          "phar",
          "deep"
        ],
        "pop": "adult",
        "label": "Viêm miệng hầu – người lớn",
        "text": "Viêm miệng hầu: Uống 150 - 450 mg/lần, cách 6 giờ/lần, trong 7 ngày, tối đa 1,8 g/ngày. Tiêm tĩnh mạch 600 - 900 mg/lần, cách 8 giờ một lần.",
        "pdfPage": 462,
        "page": 468
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Liều thường dùng – trẻ em",
        "text": "Uống: 8 - 20 mg/kg/ngày dạng hydroclorid và 8 - 25 mg/kg/ngày dạng palmitat, chia 3 - 4 lần (liều tối thiểu của dạng palmitat là 37,5 mg, 3 lần/ngày). Tiêm bắp và tiêm tĩnh mạch: Trẻ em > 1 tháng tuổi: 20 - 40 mg/kg/ngày, chia 3 - 4 lần.",
        "pdfPage": 462,
        "page": 468
      },
      {
        "ind": [
          "phar",
          "deep"
        ],
        "pop": "child",
        "label": "Viêm miệng hầu – trẻ em",
        "text": "Viêm miệng hầu: Uống 10 - 20 mg/kg/ngày, chia 3 - 4 liều bằng nhau. Tiêm tĩnh mạch: 15 - 25 mg/kg/ngày, chia 3 - 4 liều bằng nhau.",
        "pdfPage": 462,
        "page": 468
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "adult",
        "label": "Thời gian điều trị",
        "text": "Trong nhiễm khuẩn do Streptococcus beta tan huyết nhóm A, điều trị clindamycin phải tiếp tục ít nhất 10 ngày.",
        "pdfPage": 462,
        "page": 468
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "child",
        "label": "Thời gian điều trị",
        "text": "Trong nhiễm khuẩn do Streptococcus beta tan huyết nhóm A, điều trị clindamycin phải tiếp tục ít nhất 10 ngày.",
        "pdfPage": 462,
        "page": 468
      }
    ]
  },
  "doxy": {
    "name": "Doxycyclin",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Người lớn",
        "text": "Người lớn: 100 mg/lần cho mỗi 12 giờ trong ngày đầu, sau đó 100 mg/ngày, uống 1 lần hoặc chia 2 lần. Những trường hợp bệnh nặng những ngày sau 100 mg/lần cho mỗi 12 giờ.",
        "pdfPage": 639,
        "page": 645
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Trẻ em trên 8 tuổi",
        "text": "Trẻ em trên 8 tuổi nặng dưới 45 kg: 4,4 mg/kg/ngày (không quá 200 mg/ngày), chia thành 2 liều bằng nhau, cứ 12 giờ một lần trong ngày đầu, những ngày sau uống một nửa liều này (2,2 mg/ kg/ngày), một lần duy nhất; không vượt quá 200 mg/ngày. Đối với bệnh nặng, uống liều 2,2 mg/kg/lần, cứ 12 giờ một lần. Với trẻ trên 8 tuổi nặng trên 45 kg: Liều giống như người lớn.",
        "pdfPage": 639,
        "page": 645
      }
    ]
  },
  "ery": {
    "name": "Erythromycin",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Người lớn",
        "text": "Liều uống tương ứng với erythromycin là 250 mg/lần, cách 6 giờ một lần hoặc 333 mg cách 8 giờ một lần hoặc 500 mg/lần, cách 12 giờ/lần. Đối với các nhiễm khuẩn nặng có thể tăng tới 4 g/ngày, chia làm nhiều lần; chú ý khi dùng liều trên 1g/ngày phải chia đều liều uống thành 3 lần hoặc nhiều lần hơn.",
        "pdfPage": 683,
        "page": 689
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Trẻ em",
        "text": "Liều thường dùng khoảng 30 - 50 mg/kg/ngày, chia 2 - 4 lần. Trong trường hợp nhiễm khuẩn nặng, liều có thể tăng lên gấp đôi, nhưng không vượt quá 4 g/ngày.",
        "pdfPage": 683,
        "page": 689
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Trẻ em – theo tuổi",
        "text": "Liều thường dùng cho trẻ từ 1 tháng tuổi đến dưới 2 tuổi: 125 mg/lần, ngày 4 lần; trẻ em từ 2 - 8 tuổi: 250 mg/lần, ngày 4 lần. Trẻ trên 8 tuổi: 250 mg - 500 mg/lần, ngày 4 lần hoặc có thể cho dùng liều như liều thường dùng của người lớn. Tăng liều gấp đôi với nhiễm khuẩn nặng.",
        "pdfPage": 683,
        "page": 689
      }
    ]
  },
  "levo": {
    "name": "Levofloxacin",
    "entries": [
      {
        "ind": [
          "abrs"
        ],
        "pop": "adult",
        "label": "Viêm xoang cấp – người lớn (nhóm chỉ định chỉ nên sử dụng khi không có lựa chọn khác thay thế)",
        "text": "Viêm xoang cấp: 500 mg/lần/ngày × 10 - 14 ngày.",
        "pdfPage": 1005,
        "page": 1010
      },
      {
        "ind": [
          "abrs",
          "gen"
        ],
        "pop": "child",
        "label": "Trẻ em",
        "text": "Lưu ý levofloxacin không được dùng cho trẻ em trừ trường hợp bệnh than, bệnh dịch hạch hoặc dùng ngoài (dạng thuốc nhỏ mắt).",
        "caution": true,
        "pdfPage": 1005,
        "page": 1010
      }
    ]
  },
  "moxi": {
    "name": "Moxifloxacin",
    "entries": [
      {
        "ind": [
          "abrs",
          "gen"
        ],
        "pop": "adult",
        "label": "Người lớn",
        "text": "Người lớn: Liều thường dùng là 400 mg/lần/ngày.",
        "pdfPage": 1148,
        "page": 1153
      },
      {
        "ind": [
          "abrs"
        ],
        "pop": "adult",
        "label": "Thời gian điều trị nhiễm khuẩn xoang cấp",
        "text": "10 ngày với nhiễm khuẩn xoang cấp",
        "pdfPage": 1149,
        "page": 1154
      }
    ]
  },
  "penv": {
    "name": "Phenoxymethylpenicilin (Penicilin V)",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Liều thông thường – người lớn và trẻ em trên 12 tuổi",
        "text": "Người lớn và trẻ em trên 12 tuổi: Liều thông thường 250 - 500 mg/ lần, 6 giờ/lần, nếu nặng có thể lên tới liều 1 g/lần, 6 giờ/lần.",
        "pdfPage": 1297,
        "page": 1302
      },
      {
        "ind": [
          "phar"
        ],
        "pop": "adult",
        "label": "Nhiễm liên cầu beta tan huyết nhóm A nhẹ và vừa – người lớn và trẻ em trên 12 tuổi",
        "text": "Điều trị nhiễm liên cầu khuẩn beta tan huyết nhóm A nhẹ và vừa (viêm đường hô hấp trên…): 125 - 250 mg/lần, 6 - 8 giờ/lần trong 10 ngày.",
        "pdfPage": 1297,
        "page": 1302
      },
      {
        "ind": [
          "aom",
          "phar",
          "gen"
        ],
        "pop": "child",
        "label": "Viêm amidan, viêm tai giữa, viêm họng do liên cầu nhóm A hoặc nhiễm khuẩn khác – trẻ em dưới 12 tuổi",
        "text": "Điều trị viêm amidan, viêm tai giữa, viêm miệng, viêm họng bởi Streptococcus nhóm A hoặc những nhiễm khuẩn khác: Trẻ 1 tháng - 11 tháng: 62,5 mg/lần, 4 lần/ngày. Trẻ 1 - 5 tuổi: 125 mg/lần, 4 lần/ngày. Trẻ 6 - 11 tuổi: 250 mg/lần, 4 lần/ngày. Trường hợp nặng có thể tăng liều tới 12,5 mg/kg (tối đa 1 g) chia 4 lần/ngày.",
        "pdfPage": 1297,
        "page": 1302
      }
    ]
  },
  "vanco": {
    "name": "Vancomycin",
    "entries": [
      {
        "ind": [
          "gen"
        ],
        "pop": "adult",
        "label": "Nhiễm khuẩn toàn thân do vi khuẩn Gram dương – người lớn, chức năng thận bình thường",
        "text": "Người lớn: Truyền tĩnh mạch 500 mg mỗi 6 giờ hoặc 1 g mỗi 12 giờ; hoặc 15 - 20 mg/kg mỗi 8 - 12 giờ. Trên bệnh nhân nặng, có thể dùng liều nạp 25 - 30 mg/kg, liều duy trì nên được điều chỉnh dựa vào nồng độ đáy của thuốc trong huyết tương.",
        "pdfPage": 1638,
        "page": 1643
      },
      {
        "ind": [
          "gen"
        ],
        "pop": "child",
        "label": "Nhiễm khuẩn toàn thân do vi khuẩn Gram dương – trẻ em, chức năng thận bình thường",
        "text": "Trẻ em: Truyền tĩnh mạch 10 mg/kg mỗi 6 giờ. Hoặc liều dùng theo lứa tuổi như sau: Trẻ em ≥ 12 tuổi: Dùng liều như người lớn. Trẻ em 1 tháng - < 12 tuổi: Truyền tĩnh mạch 10 - 15 mg/kg mỗi 6 giờ, tổng liều 1 ngày không vượt quá 2 g.",
        "pdfPage": 1638,
        "page": 1643
      }
    ]
  }
};

/** Nhận diện chuyên luận Dược thư từ tên thuốc trong phác đồ (một dòng có thể chứa nhiều thuốc). */
const MATCH: [RegExp, string][] = [
  [/amoxicillin[-s]*clavulan|co-amoxiclav|amoxicillin có hoặc không kèm clavulan/i, "coamox"],
  [/amoxicillin(?![-s]*clavulan)/i, "amox"],
  [/ampicillin[-s]*sulbactam/i, "sam"],
  [/azithromycin/i, "azi"],
  [/benzathin/i, "bpg"],
  [/cefadroxil/i, "cefadroxil"],
  [/cefalexin|cephalexin/i, "cefalexin"],
  [/cefdinir/i, "cefdinir"],
  [/cefixim/i, "cefixim"],
  [/cefotaxim/i, "cefotaxim"],
  [/cefpodoxim/i, "cefpodoxim"],
  [/ceftriaxon/i, "ceftriaxon"],
  [/cefuroxim/i, "cefuroxim"],
  [/clarithromycin/i, "clari"],
  [/clindamycin/i, "clinda"],
  [/doxycyclin/i, "doxy"],
  [/erythromycin/i, "ery"],
  [/levofloxacin/i, "levo"],
  [/moxifloxacin/i, "moxi"],
  [/penicillin v|phenoxymethyl/i, "penv"],
  [/vancomycin/i, "vanco"],
];
export function dtqgKeys(drug: string): string[] {
  return MATCH.filter(([re]) => re.test(drug)).map(([, k]) => k)
    .filter((k, i, a) => !(k === "amox" && a.includes("coamox")) && a.indexOf(k) === i);
}

/** Chỉ định Dược thư tương ứng từng bệnh trong module tai mũi họng. */
export const DISEASE_IND: Record<string, DtqgInd> = {
  "aom-peds": "aom", "aom-adult": "aom",
  "abrs-peds": "abrs", "abrs-adult": "abrs",
  "gas-pharyngitis": "phar", "strep-pharyngitis": "phar",
  pta: "deep", rpa: "deep", dni: "deep",
};

/** Câu Dược thư cho một thuốc theo bệnh và đối tượng: ưu tiên câu đúng chỉ định, kèm liều thường dùng khi không có câu riêng. */
export function dtqgFor(key: string, ind: DtqgInd, pop: "adult" | "child"): DtqgEntDose[] {
  const d = DTQG_ENT[key];
  if (!d) return [];
  const own = d.entries.filter((e) => e.pop === pop);
  const specific = own.filter((e) => e.ind.includes(ind));
  const general = own.filter((e) => e.ind.includes("gen") && !specific.includes(e));
  return ind === "deep" ? [...general, ...specific] : specific.length ? specific : general;
}
