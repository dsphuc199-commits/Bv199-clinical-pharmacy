
export type Module =
  | "empiric"
  | "organism"
  | "antifungal"
  | "prophylaxis";

export type Review = "pending" | "approved";

export type Regimen = {
  id: string;
  label: string;
  drugs: string[];
  adultDose: string | null;
  route: string | null;
  timing: string | null;
  redose: string | null;
  duration: string | null;
  conditions: string[];
  sourceSection: string;
};

export type Protocol = {
  id: string;
  module: Module;
  specialty: string;
  name: string;
  scenario: string;
  indication: string;
  preferred: Regimen[];
  alternatives: Regimen[];
  notes: string[];
  source: {
    title: string;
    publisher: string;
    year: string;
    location: string;
    url: string | null;
  };
  review: Review;
  bv199Approved: boolean;
};

const ksdpsource = {
  title:
    "Khuyến cáo lựa chọn kháng sinh trong một số loại phẫu thuật",
  publisher:
    "Tài liệu Word được cung cấp; tham khảo Chợ Rẫy 2024 và các nguồn khác",
  year: "Chưa xác minh năm ban hành tài liệu tổng hợp",
  location: "Bảng lựa chọn trang 1–5; bảng liều trang 6",
  url: null,
};

export const protocols: Protocol[] = [
  {
    id: "ksdp-cesarean",
    module: "prophylaxis",
    specialty: "Sản phụ khoa",
    name: "Mổ lấy thai",
    scenario: "Dự phòng nhiễm khuẩn vết mổ; người lớn",
    indication: "Có KSDP theo bảng nguồn.",
    preferred: [
      {
        id: "csection-1",
        label: "Lựa chọn trong nguồn",
        drugs: ["Cefazolin"],
        adultDose:
          "2 g; nguồn ghi 3 g nếu cân nặng >120 kg",
        route: null,
        timing: null,
        redose: "4 giờ theo bảng nguồn",
        duration: null,
        conditions: [],
        sourceSection: "Trang 4 và trang 6",
      },
    ],
    alternatives: [
      {
        id: "csection-alt1",
        label: "Thay thế khi dị ứng beta-lactam",
        drugs: ["Clindamycin", "Aminoglycosid"],
        adultDose:
          "Clindamycin 900 mg; nếu chọn gentamicin, bảng nguồn ghi 5 mg/kg. Cần xác minh thuốc phối hợp cụ thể.",
        route: null,
        timing: null,
        redose:
          "Clindamycin 6 giờ; aminoglycosid chưa có dữ liệu nhắc liều trong nguồn",
        duration: null,
        conditions: [
          "Đánh giá loại phản ứng dị ứng trước sử dụng",
        ],
        sourceSection: "Trang 4 và trang 6",
      },
    ],
    notes: [
      "Nguồn chưa ghi rõ thời điểm dùng trước rạch da.",
      "Nguồn chưa quy định thời gian ngừng KSDP.",
      "Chưa được xác nhận là phác đồ BV199 đã phê duyệt.",
    ],
    source: {
      ...ksdpsource,
      location: "Trang 4 và trang 6",
    },
    review: "pending",
    bv199Approved: false,
  },

  {
    id: "ksdp-appendix",
    module: "prophylaxis",
    specialty: "Ngoại tổng hợp – Tiết niệu",
    name: "Cắt ruột thừa viêm không biến chứng",
    scenario:
      "Dự phòng phẫu thuật; không áp dụng cho nhiễm khuẩn ổ bụng biến chứng",
    indication: "Có lựa chọn KSDP trong bảng nguồn.",
    preferred: [
      {
        id: "appendix-1",
        label: "Lựa chọn trong nguồn",
        drugs: ["Cefoxitin"],
        adultDose: "2 g",
        route: null,
        timing: null,
        redose: "2 giờ",
        duration: null,
        conditions: [],
        sourceSection: "Trang 2 và trang 6",
      },
      {
        id: "appendix-2",
        label: "Lựa chọn trong nguồn",
        drugs: ["Cefotetan"],
        adultDose: "2 g",
        route: null,
        timing: null,
        redose: "6 giờ",
        duration: null,
        conditions: [],
        sourceSection: "Trang 2 và trang 6",
      },
      {
        id: "appendix-3",
        label: "Lựa chọn phối hợp trong nguồn",
        drugs: ["Cefazolin", "Metronidazol"],
        adultDose:
          "Cefazolin 2 g (nguồn ghi 3 g nếu >120 kg) + metronidazol 500 mg",
        route: null,
        timing: null,
        redose:
          "Cefazolin 4 giờ; metronidazol 8–12 giờ theo bảng nguồn",
        duration: null,
        conditions: [],
        sourceSection: "Trang 2 và trang 6",
      },
    ],
    alternatives: [],
    notes: [
      "Phác đồ thay thế trong tài liệu gốc cần đối chiếu lại cách trình bày dấu phối hợp và dấu hoặc.",
      "Nếu ruột thừa thủng, áp xe hoặc viêm phúc mạc, cần đánh giá điều trị nhiễm khuẩn ổ bụng, không áp dụng máy móc bảng KSDP.",
    ],
    source: {
      ...ksdpsource,
      location: "Trang 2 và trang 6",
    },
    review: "pending",
    bv199Approved: false,
  },

  {
    id: "cap",
    module: "empiric",
    specialty: "Hô hấp",
    name: "Viêm phổi cộng đồng",
    scenario:
      "Người lớn; cần phân tầng theo mức độ và yếu tố nguy cơ",
    indication:
      "Xác định chẩn đoán và bệnh cảnh trước khi chọn kháng sinh.",
    preferred: [],
    alternatives: [],
    notes: [
      "Chưa trích xuất phác đồ được kiểm chứng từ hướng dẫn chuyên biệt.",
      "Không tự điền thuốc và liều từ suy đoán.",
    ],
    source: {
      title:
        "WHO AWaRe Antibiotic Book và hướng dẫn CAP chuyên khoa",
      publisher: "WHO / hướng dẫn chuyên khoa",
      year: "Chưa gắn phiên bản",
      location: "Chưa nhập",
      url:
        "https://www.who.int/publications/i/item/9789240062382",
    },
    review: "pending",
    bv199Approved: false,
  },

  {
    id: "esbl",
    module: "organism",
    specialty: "Điều trị theo tác nhân",
    name: "Enterobacterales sinh ESBL",
    scenario:
      "Phân theo vị trí nhiễm khuẩn, MIC/AST và mức độ nặng",
    indication:
      "Điều trị theo tác nhân đã xác định; không thay thế hướng dẫn điều trị kinh nghiệm.",
    preferred: [],
    alternatives: [],
    notes: [
      "Chưa nhập lựa chọn thuốc theo vị trí nhiễm khuẩn từ IDSA AMR.",
      "Cần đối chiếu kháng sinh đồ và dữ liệu BV199.",
    ],
    source: {
      title:
        "IDSA Guidance on Treatment of Antimicrobial-Resistant Gram-Negative Infections",
      publisher: "IDSA",
      year: "Cần xác minh phiên bản hiện hành",
      location: "Phần ESBL-E",
      url:
        "https://www.idsociety.org/practice-guideline/amr-guidance",
    },
    review: "pending",
    bv199Approved: false,
  },

  {
    id: "candida",
    module: "antifungal",
    specialty: "Hồi sức tích cực",
    name: "Nhiễm Candida xâm lấn",
    scenario:
      "Phân theo candidemia, vị trí nhiễm, loài Candida và kháng nấm đồ",
    indication:
      "Phải xác định bệnh cảnh; điều trị nhiễm nấm không đồng nghĩa với dự phòng kháng nấm.",
    preferred: [],
    alternatives: [],
    notes: [
      "Chưa nhập thuốc, liều hoặc thời gian từ hướng dẫn chuyên biệt.",
      "Dự phòng kháng nấm sẽ là bệnh cảnh riêng.",
    ],
    source: {
      title:
        "IDSA Clinical Practice Guideline for the Management of Candidiasis",
      publisher: "IDSA",
      year: "2016; cần đối chiếu cập nhật liên quan",
      location: "Theo hội chứng bệnh",
      url:
        "https://www.idsociety.org/practice-guideline/candidiasis/",
    },
    review: "pending",
    bv199Approved: false,
  },
];

export function validateProtocols(items: Protocol[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const regimenIds = new Set<string>();

  for (const p of items) {
    if (ids.has(p.id)) {
      errors.push(`Trùng mã bệnh cảnh: ${p.id}`);
    }

    ids.add(p.id);

    if (!p.source.title || !p.source.location) {
      errors.push(`${p.id}: thiếu thông tin nguồn`);
    }

    if (p.bv199Approved && p.review !== "approved") {
      errors.push(`${p.id}: công bố khi chưa phê duyệt`);
    }

    for (const r of [
      ...p.preferred,
      ...p.alternatives,
    ]) {
      if (regimenIds.has(r.id)) {
        errors.push(`Trùng mã phác đồ: ${r.id}`);
      }
      regimenIds.add(r.id);

      if (!r.id || !r.drugs.length || !r.sourceSection) {
        errors.push(
          `${p.id}: phác đồ thiếu cấu trúc hoặc nguồn`
        );
      }

      if (r.adultDose && !/\d/.test(r.adultDose)) {
        errors.push(`${p.id}: kiểm tra định dạng liều`);
      }
    }
  }

  return errors;
}
