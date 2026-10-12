/* ============================================================================
 BV199 CLINICAL PHARMACY – FULL GUIDELINE REGISTRY
 Standalone: KHÔNG import full-guidelines-base.ts.
 Phạm vi: người lớn; 3 tài liệu bệnh viện người dùng cung cấp + nguồn quốc gia
 và quốc tế chọn lọc, rà soát đến 2026-10-09.

 QUY TẮC AN TOÀN
 - Clinical decision support, không thay thế bác sĩ/DSLS.
 - Mọi lựa chọn cần đối chiếu: dị ứng, CrCl/eGFR, gan, thai kỳ, tương tác,
   source control, kháng sinh 90 ngày, AST trước đó, antibiogram BV199.
 - status=INDEXED chỉ là chỉ mục mặt bệnh, KHÔNG phải phác đồ hoàn chỉnh.
============================================================================ */

export type VerificationLevel = "VERIFIED_EXACT" | "GUIDELINE_SYNTHESIS" | "INDEXED";
export type SourceKind = "hospital" | "national" | "international";

export type GuidelineSource = {
  id: string;
  name: string;
  year: number;
  kind: SourceKind;
  url?: string;
  note?: string;
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
  evidenceNotes?: string[];
  tags?: string[];
};

export type PathogenGuidance = {
  id: string;
  name: string;
  group: string;
  commonSites: string[];
  preferred: string[];
  avoid: string[];
  notes: string[];
  sourceIds: string[];
  requiresBV199Validation: boolean;
};

export const guidelineSources: GuidelineSource[] = [
  {
    "id": "BM2023",
    "name": "Bệnh viện Bạch Mai – Hướng dẫn sử dụng kháng sinh trong lâm sàng",
    "year": 2023,
    "kind": "hospital",
    "note": "Tài liệu người dùng tải lên."
  },
  {
    "id": "XP2025",
    "name": "Bệnh viện Đa khoa Xanh Pôn – Hướng dẫn sử dụng kháng sinh",
    "year": 2025,
    "kind": "hospital",
    "note": "Tài liệu người dùng tải lên."
  },
  {
    "id": "UMC2023",
    "name": "Bệnh viện Đại học Y Dược TP.HCM – Hướng dẫn sử dụng kháng sinh",
    "year": 2023,
    "kind": "hospital",
    "note": "Tài liệu người dùng tải lên."
  },
  {
    "id": "BYT708",
    "name": "Bộ Y tế – Quyết định 708/QĐ-BYT",
    "year": 2015,
    "kind": "national",
    "url": "https://kcb.vn/van-ban/tai-lieu-huong-dan-su-dung-khang-sinh.html"
  },
  {
    "id": "BYT5631",
    "name": "Bộ Y tế – Quyết định 5631/QĐ-BYT",
    "year": 2020,
    "kind": "national",
    "url": "https://thuvienphapluat.vn/van-ban/The-thao-Y-te/Quyet-dinh-5631-QD-BYT-2020-tai-lieu-Huong-dan-quan-ly-su-dung-khang-sinh-trong-benh-vien-461349.aspx"
  },
  {
    "id": "WHO_AWARE2022",
    "name": "WHO AWaRe Antibiotic Book",
    "year": 2022,
    "kind": "international",
    "url": "https://www.who.int/publications/i/item/9789240062382"
  },
  {
    "id": "WHO_MENINGITIS2025",
    "name": "WHO Meningitis Guidelines",
    "year": 2025,
    "kind": "international",
    "url": "https://www.who.int/publications/i/item/9789240108042"
  },
  {
    "id": "WHO_STI_GCS2024",
    "name": "WHO Gonorrhoea/Chlamydia/Syphilis Recommendations",
    "year": 2024,
    "kind": "international",
    "url": "https://www.who.int/publications/i/item/9789240090767"
  },
  {
    "id": "WHO_STI_TMC2024",
    "name": "WHO Trichomonas/M. genitalium/Candida/BV/HPV Recommendations",
    "year": 2024,
    "kind": "international",
    "url": "https://www.who.int/publications/i/item/9789240096370"
  },
  {
    "id": "SSC2021",
    "name": "Surviving Sepsis Campaign",
    "year": 2021,
    "kind": "international",
    "url": "https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-guidelines-2021"
  },
  {
    "id": "CAP2019",
    "name": "ATS/IDSA Community-Acquired Pneumonia",
    "year": 2019,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults"
  },
  {
    "id": "HAPVAP2016",
    "name": "ATS/IDSA HAP/VAP",
    "year": 2016,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/hap_vap/"
  },
  {
    "id": "CUTI2025",
    "name": "IDSA Complicated UTI Guideline",
    "year": 2025,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/"
  },
  {
    "id": "AMR2026",
    "name": "IDSA AMR Guidance – Gram-negative infections",
    "year": 2026,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/amr-guidance"
  },
  {
    "id": "SINUS2025",
    "name": "AAO-HNS Adult Sinusitis Update",
    "year": 2025,
    "kind": "international",
    "url": "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/cpg-adult-sinusitis/"
  },
  {
    "id": "GAS2025",
    "name": "IDSA GAS Pharyngitis Update",
    "year": 2025,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/streptococcal-pharyngitis2/"
  },
  {
    "id": "IAI2024",
    "name": "IDSA Complicated Intra-abdominal Infections Update – Part 1",
    "year": 2024,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/intra-abdominal-infections/"
  },
  {
    "id": "DFI2023",
    "name": "IWGDF/IDSA Diabetes-related Foot Infections",
    "year": 2023,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/diabetic-foot-infections/"
  },
  {
    "id": "IE2023",
    "name": "ESC Infective Endocarditis Guidelines",
    "year": 2023,
    "kind": "international",
    "url": "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/endocarditis/"
  },
  {
    "id": "SSTI2014",
    "name": "IDSA Skin and Soft Tissue Infections",
    "year": 2014,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/"
  },
  {
    "id": "VO2015",
    "name": "IDSA Native Vertebral Osteomyelitis",
    "year": 2015,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/vertebral-osteomyelitis/"
  },
  {
    "id": "CANDIDA2016",
    "name": "IDSA Candidiasis",
    "year": 2016,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/candidiasis/"
  },
  {
    "id": "ASPERGILLUS2016",
    "name": "IDSA Aspergillosis",
    "year": 2016,
    "kind": "international",
    "url": "https://www.idsociety.org/practice-guideline/aspergillosis"
  },
  {
    "id": "CLSI2026",
    "name": "CLSI M100 Ed36",
    "year": 2026,
    "kind": "international",
    "url": "https://clsi.org/shop/standards/m100/"
  }
];

export const sourceMap: Record<string, GuidelineSource> = Object.fromEntries(
  guidelineSources.map((source) => [source.id, source])
);

type SyndromeSeed = {
  id: string;
  category: string;
  title: string;
  pathogens: string[];
  sources: string[];
  status: VerificationLevel;
  treatment: string[];
  duration: string[];
  severity: string[];
  setting: string[];
  notes: string[];
};

const seeds: SyndromeSeed[] = [
  {
    "category": "Nhiễm khuẩn huyết",
    "title": "Sepsis – nguồn cộng đồng",
    "pathogens": [
      "S. pneumoniae",
      "S. aureus",
      "E. coli",
      "K. pneumoniae"
    ],
    "sources": [
      "UMC2023",
      "XP2025",
      "BM2023",
      "SSC2021",
      "BYT5631"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Lấy cấy máu/bệnh phẩm trước kháng sinh nếu không trì hoãn điều trị.",
      "Khởi trị sớm theo nguồn nghi ngờ, mức độ nặng và antibiogram.",
      "Thêm phủ MRSA/Pseudomonas chỉ khi có yếu tố nguy cơ; de-escalate khi có AST."
    ],
    "duration": [
      "Theo ổ nhiễm; nhiều trường hợp 7–10 ngày nếu source control tốt."
    ],
    "severity": [
      "Nặng",
      "Sốc"
    ],
    "setting": [
      "Cấp cứu",
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "sepsis-nguon-cong-dong"
  },
  {
    "category": "Nhiễm khuẩn huyết",
    "title": "Sepsis – nguồn bệnh viện / nguy cơ MDR",
    "pathogens": [
      "ESBL-E",
      "CRE",
      "P. aeruginosa",
      "A. baumannii",
      "MRSA"
    ],
    "sources": [
      "UMC2023",
      "XP2025",
      "BM2023",
      "SSC2021",
      "AMR2026",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Rà soát vi sinh/AST trước đây, kháng sinh 90 ngày, thiết bị và antibiogram BV199.",
      "Chọn beta-lactam phổ phù hợp nguồn; thêm MRSA khi có chỉ định.",
      "Nếu nghi ESBL/CRE/DTR-Pseudomonas/CRAB, dùng guidance AMR 2026 + AST thay vì phác đồ cố định."
    ],
    "duration": [],
    "severity": [
      "Nặng",
      "Sốc"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "sepsis-nguon-benh-vien-nguy-co-mdr"
  },
  {
    "category": "Nhiễm khuẩn huyết",
    "title": "Sốc nhiễm khuẩn",
    "pathogens": [
      "Gram âm",
      "Gram dương",
      "Nấm ở nhóm nguy cơ"
    ],
    "sources": [
      "SSC2021",
      "XP2025",
      "BM2023",
      "BYT5631"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Kháng sinh IV càng sớm càng tốt sau nhận diện sốc, song song hồi sức.",
      "Bao phủ đủ phổ ngay từ đầu dựa trên nguồn và nguy cơ MDR.",
      "Source control khẩn khi có chỉ định."
    ],
    "duration": [],
    "severity": [
      "Sốc"
    ],
    "setting": [
      "Cấp cứu",
      "ICU"
    ],
    "notes": [],
    "id": "soc-nhiem-khuan"
  },
  {
    "category": "Nhiễm khuẩn huyết",
    "title": "Nhiễm khuẩn huyết liên quan catheter / CRBSI",
    "pathogens": [
      "S. aureus",
      "CoNS",
      "Enterococcus spp.",
      "Gram âm",
      "Candida spp."
    ],
    "sources": [
      "XP2025",
      "BM2023",
      "BYT5631"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu ngoại vi và từ catheter theo quy trình.",
      "Đánh giá rút catheter/source control.",
      "Phác đồ kinh nghiệm phụ thuộc huyết động, MRSA, Gram âm và nguy cơ Candida; chuyển điều trị đích."
    ],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "nhiem-khuan-huyet-lien-quan-catheter-crbsi"
  },
  {
    "category": "Nhiễm khuẩn huyết",
    "title": "Bacteremia Gram âm không biến chứng",
    "pathogens": [
      "Enterobacterales",
      "P. aeruginosa"
    ],
    "sources": [
      "AMR2026",
      "CLSI2026",
      "BYT5631"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị theo AST, vị trí nguồn và khả năng đạt nồng độ tại ổ nhiễm.",
      "Có thể IV→PO khi ổn định, source control đạt và thuốc uống còn nhạy/đủ sinh khả dụng.",
      "Không coi S+I là tỷ lệ nhạy cảm nếu labo báo S/I/R theo CLSI."
    ],
    "duration": [
      "Nhiều trường hợp chọn lọc có thể dùng liệu trình ngắn; theo nguồn."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "bacteremia-gram-am-khong-bien-chung"
  },
  {
    "category": "Nhiễm khuẩn huyết",
    "title": "Bacteremia do Staphylococcus aureus",
    "pathogens": [
      "MSSA",
      "MRSA"
    ],
    "sources": [
      "BM2023",
      "XP2025",
      "IE2023",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu kiểm tra lại, tìm ổ sâu và đánh giá viêm nội tâm mạc.",
      "MSSA: ưu tiên beta-lactam kháng tụ cầu khi phù hợp; MRSA: chọn theo vị trí, MIC/AST và TDM.",
      "Không áp dụng liệu trình ngắn kiểu bacteremia Gram âm."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "bacteremia-do-staphylococcus-aureus"
  },
  {
    "category": "Nhiễm khuẩn huyết",
    "title": "Bacteremia do Enterococcus",
    "pathogens": [
      "E. faecalis",
      "E. faecium"
    ],
    "sources": [
      "BM2023",
      "IE2023",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phân biệt loài, đánh giá VRE và viêm nội tâm mạc.",
      "Điều trị theo AST và nguồn; hội chẩn nếu bacteremia dai dẳng."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "bacteremia-do-enterococcus"
  },
  {
    "category": "Nhiễm khuẩn huyết",
    "title": "Candidemia",
    "pathogens": [
      "Candida spp."
    ],
    "sources": [
      "BM2023",
      "XP2025",
      "CANDIDA2016"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Echinocandin thường là lựa chọn khởi đầu ở bệnh nặng/chưa biết độ nhạy.",
      "Cấy máu theo dõi, source control catheter; step-down fluconazole khi ổn định và isolate nhạy."
    ],
    "duration": [
      "Ít nhất 14 ngày sau cấy âm và hết triệu chứng ở candidemia không biến chứng."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "candidemia"
  },
  {
    "category": "Hô hấp",
    "title": "Viêm phổi cộng đồng – ngoại trú nguy cơ thấp",
    "pathogens": [
      "S. pneumoniae",
      "H. influenzae",
      "M. pneumoniae",
      "C. pneumoniae"
    ],
    "sources": [
      "XP2025",
      "BM2023",
      "CAP2019",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chỉ điều trị kháng sinh khi chẩn đoán CAP phù hợp.",
      "Ưu tiên phổ hẹp theo guideline và dữ liệu địa phương; không mở rộng MRSA/Pseudomonas nếu không có nguy cơ."
    ],
    "duration": [
      "Tối thiểu 5 ngày và đạt ổn định lâm sàng."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "viem-phoi-cong-dong-ngoai-tru-nguy-co-thap"
  },
  {
    "category": "Hô hấp",
    "title": "Viêm phổi cộng đồng – nội trú không ICU",
    "pathogens": [
      "S. pneumoniae",
      "H. influenzae",
      "Tác nhân không điển hình"
    ],
    "sources": [
      "XP2025",
      "UMC2023",
      "BM2023",
      "CAP2019"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Beta-lactam + macrolide hoặc respiratory fluoroquinolone khi phù hợp.",
      "Chỉ phủ MRSA/Pseudomonas nếu có yếu tố nguy cơ được xác nhận."
    ],
    "duration": [
      "≥5 ngày; dựa vào ổn định lâm sàng."
    ],
    "severity": [
      "Trung bình"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-phoi-cong-dong-noi-tru-khong-icu"
  },
  {
    "category": "Hô hấp",
    "title": "Viêm phổi cộng đồng nặng / ICU",
    "pathogens": [
      "S. pneumoniae",
      "Legionella spp.",
      "S. aureus",
      "Gram âm"
    ],
    "sources": [
      "XP2025",
      "UMC2023",
      "BM2023",
      "CAP2019"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Beta-lactam + macrolide hoặc beta-lactam + respiratory fluoroquinolone.",
      "Bổ sung MRSA/Pseudomonas khi có nguy cơ; lấy cấy để de-escalation."
    ],
    "duration": [
      "Theo đáp ứng, biến chứng và tác nhân."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "ICU"
    ],
    "notes": [],
    "id": "viem-phoi-cong-dong-nang-icu"
  },
  {
    "category": "Hô hấp",
    "title": "Viêm phổi bệnh viện (HAP)",
    "pathogens": [
      "Enterobacterales",
      "P. aeruginosa",
      "A. baumannii",
      "MRSA"
    ],
    "sources": [
      "XP2025",
      "UMC2023",
      "BM2023",
      "HAPVAP2016",
      "AMR2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chọn anti-pseudomonal beta-lactam dựa trên antibiogram đơn vị và nguy cơ kháng.",
      "Thêm MRSA khi có yếu tố nguy cơ hoặc tỷ lệ MRSA địa phương cao/không rõ.",
      "De-escalate khi có AST."
    ],
    "duration": [
      "Thường 7 ngày nếu đáp ứng tốt."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-phoi-benh-vien-hap"
  },
  {
    "category": "Hô hấp",
    "title": "Viêm phổi liên quan thở máy (VAP)",
    "pathogens": [
      "P. aeruginosa",
      "A. baumannii",
      "Enterobacterales",
      "MRSA"
    ],
    "sources": [
      "XP2025",
      "BM2023",
      "HAPVAP2016",
      "AMR2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Lấy bệnh phẩm hô hấp trước điều trị nếu có thể.",
      "Phác đồ kinh nghiệm dựa trên antibiogram ICU, kháng sinh 90 ngày trước và nguy cơ MDR.",
      "Thu hẹp phổ khi có vi sinh."
    ],
    "duration": [
      "Thường 7 ngày nếu đáp ứng tốt."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "ICU"
    ],
    "notes": [],
    "id": "viem-phoi-lien-quan-tho-may-vap"
  },
  {
    "category": "Hô hấp",
    "title": "Viêm phổi hít",
    "pathogens": [
      "S. pneumoniae",
      "H. influenzae",
      "Enterobacterales",
      "Kỵ khí khi áp xe/empyema"
    ],
    "sources": [
      "UMC2023",
      "BM2023",
      "CAP2019"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị như CAP/HAP theo bối cảnh.",
      "Không mặc định phủ kỵ khí cho mọi aspiration pneumonia; cân nhắc khi áp xe, hoại tử hoặc empyema."
    ],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-phoi-hit"
  },
  {
    "category": "Hô hấp",
    "title": "Áp xe phổi",
    "pathogens": [
      "Kỵ khí",
      "S. anginosus group",
      "S. aureus",
      "Gram âm"
    ],
    "sources": [
      "XP2025",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phác đồ có hoạt tính với hệ vi khuẩn miệng-kỵ khí và tác nhân theo nguy cơ.",
      "Đánh giá dẫn lưu, tắc nghẽn, ung thư và dị vật."
    ],
    "duration": [
      "Thường nhiều tuần; theo hình ảnh và lâm sàng."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "ap-xe-phoi"
  },
  {
    "category": "Hô hấp",
    "title": "Đợt cấp COPD có chỉ định kháng sinh",
    "pathogens": [
      "H. influenzae",
      "S. pneumoniae",
      "M. catarrhalis",
      "Pseudomonas ở nhóm nguy cơ"
    ],
    "sources": [
      "XP2025",
      "BM2023",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chỉ dùng khi có tiêu chuẩn lâm sàng phù hợp, đặc biệt đờm mủ và/hoặc cần thông khí.",
      "Chọn phổ theo mức độ, nguy cơ Pseudomonas và kháng sinh gần đây."
    ],
    "duration": [
      "Thường 5–7 ngày."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "dot-cap-copd-co-chi-dinh-khang-sinh"
  },
  {
    "category": "Hô hấp",
    "title": "Đợt cấp giãn phế quản",
    "pathogens": [
      "P. aeruginosa",
      "H. influenzae",
      "S. aureus",
      "Enterobacterales"
    ],
    "sources": [
      "XP2025",
      "BM2023",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Ưu tiên cấy đờm và vi sinh trước đây.",
      "Nếu tiền sử Pseudomonas, chọn thuốc còn hoạt tính theo AST."
    ],
    "duration": [
      "Thường 7–14 ngày; cá thể hóa."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "dot-cap-gian-phe-quan"
  },
  {
    "category": "Hô hấp",
    "title": "Viêm phế quản cấp",
    "pathogens": [
      "Virus đường hô hấp"
    ],
    "sources": [
      "BM2023",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không dùng kháng sinh thường quy ở viêm phế quản cấp không biến chứng.",
      "Đánh giá CAP, ho gà hoặc bệnh nền nếu diễn tiến bất thường."
    ],
    "duration": [
      "Không kháng sinh thường quy."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "viem-phe-quan-cap"
  },
  {
    "category": "Hô hấp",
    "title": "Tràn mủ màng phổi / empyema",
    "pathogens": [
      "Streptococcus spp.",
      "S. aureus",
      "Gram âm",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Dẫn lưu/source control là bắt buộc khi có chỉ định.",
      "Phổ thuốc theo CAP/HAP và nguy cơ kỵ khí/MRSA."
    ],
    "duration": [
      "Theo source control; dài hơn pneumonia đơn thuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "tran-mu-mang-phoi-empyema"
  },
  {
    "category": "Hô hấp",
    "title": "Ho gà",
    "pathogens": [
      "Bordetella pertussis"
    ],
    "sources": [
      "BM2023",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị macrolide phù hợp khi chẩn đoán hoặc nghi cao, chủ yếu giảm lây truyền.",
      "Thực hiện kiểm soát lây nhiễm và dự phòng người tiếp xúc khi có chỉ định."
    ],
    "duration": [
      "Theo phác đồ pertussis."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "ho-ga"
  },
  {
    "category": "Hô hấp",
    "title": "Nhiễm phổi do Stenotrophomonas maltophilia",
    "pathogens": [
      "S. maltophilia"
    ],
    "sources": [
      "BM2023",
      "AMR2026",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phân biệt colonization và infection.",
      "Chọn thuốc theo AST/guidance AMR hiện hành; không suy diễn hoạt tính beta-lactam thông thường."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "nhiem-phoi-do-stenotrophomonas-maltophilia"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm mũi xoang cấp do virus",
    "pathogens": [
      "Virus"
    ],
    "sources": [
      "SINUS2025",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không dùng kháng sinh thường quy; điều trị triệu chứng và theo dõi."
    ],
    "duration": [
      "Không kháng sinh."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "viem-mui-xoang-cap-do-virus"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm mũi xoang cấp do vi khuẩn",
    "pathogens": [
      "S. pneumoniae",
      "H. influenzae",
      "M. catarrhalis"
    ],
    "sources": [
      "SINUS2025",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chẩn đoán dựa trên kéo dài/diễn tiến xấu/phân tầng; watchful waiting ở ca chọn lọc.",
      "Amoxicillin ± clavulanate là lựa chọn nền tảng khi quyết định dùng kháng sinh; điều chỉnh theo dị ứng/nguy cơ kháng."
    ],
    "duration": [
      "Liệu trình ngắn phù hợp ở người lớn không biến chứng."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "viem-mui-xoang-cap-do-vi-khuan"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm mũi xoang mạn – đợt cấp nghi nhiễm khuẩn",
    "pathogens": [
      "S. aureus",
      "Gram âm sau can thiệp",
      "Hệ vi khuẩn hô hấp"
    ],
    "sources": [
      "SINUS2025",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không dùng kháng sinh kéo dài thường quy chỉ vì viêm xoang mạn.",
      "Khó trị/tái phát: ưu tiên nội soi-cấy và điều trị đích."
    ],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-mui-xoang-man-dot-cap-nghi-nhiem-khuan"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm họng / viêm amidan cấp",
    "pathogens": [
      "Virus",
      "S. pyogenes"
    ],
    "sources": [
      "GAS2025",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Nếu dấu hiệu virus rõ: không xét nghiệm/kháng sinh GAS thường quy.",
      "Dùng thang điểm để quyết định xét nghiệm; chỉ điều trị khi GAS được xác nhận hoặc theo thuật toán đã phê duyệt."
    ],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "viem-hong-viem-amidan-cap"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm họng do GAS",
    "pathogens": [
      "Streptococcus pyogenes"
    ],
    "sources": [
      "GAS2025",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Penicillin hoặc amoxicillin là lựa chọn ưu tiên nếu không dị ứng.",
      "Dị ứng beta-lactam: phân tầng kiểu phản ứng trước khi chọn thuốc thay thế."
    ],
    "duration": [
      "Theo phác đồ GAS chuẩn."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "viem-hong-do-gas"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Áp xe quanh amidan",
    "pathogens": [
      "S. pyogenes",
      "S. anginosus group",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Source control bằng chọc hút/rạch dẫn lưu khi có chỉ định.",
      "Kháng sinh bao phủ Streptococcus và kỵ khí; đánh giá đường thở."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Cấp cứu",
      "Nội trú"
    ],
    "notes": [],
    "id": "ap-xe-quanh-amidan"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Nhiễm khuẩn khoang cổ sâu",
    "pathogens": [
      "Streptococcus spp.",
      "S. aureus",
      "Kỵ khí",
      "Gram âm"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Đánh giá đường thở và CT cản quang khi phù hợp.",
      "Dẫn lưu ổ áp xe; bao phủ Gram dương, kỵ khí; mở rộng MRSA/Gram âm theo nguy cơ."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Cấp cứu",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-khoang-co-sau"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm nắp thanh quản ở người lớn",
    "pathogens": [
      "H. influenzae",
      "S. pneumoniae",
      "S. pyogenes",
      "S. aureus"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Ưu tiên bảo vệ đường thở và hội chẩn TMH/Gây mê.",
      "Kháng sinh IV phổ phù hợp; cân nhắc MRSA theo nguy cơ."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Cấp cứu",
      "ICU"
    ],
    "notes": [],
    "id": "viem-nap-thanh-quan-o-nguoi-lon"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm tai ngoài cấp",
    "pathogens": [
      "P. aeruginosa",
      "S. aureus"
    ],
    "sources": [
      "BM2023",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị tại chỗ là nền tảng khi còn khu trú.",
      "Không dùng kháng sinh toàn thân thường quy nếu không lan rộng/yếu tố nguy cơ."
    ],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "viem-tai-ngoai-cap"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm tai ngoài hoại tử",
    "pathogens": [
      "P. aeruginosa",
      "S. aureus",
      "Nấm"
    ],
    "sources": [
      "BM2023",
      "AMR2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy bệnh phẩm; đánh giá đái tháo đường/suy giảm miễn dịch và xương nền sọ.",
      "Kháng sinh toàn thân kháng Pseudomonas theo AST; hội chẩn TMH/Truyền nhiễm."
    ],
    "duration": [
      "Thường kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-tai-ngoai-hoai-tu"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm tai giữa cấp ở người lớn",
    "pathogens": [
      "S. pneumoniae",
      "H. influenzae",
      "M. catarrhalis"
    ],
    "sources": [
      "BM2023",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Xác nhận bằng soi tai và dịch tai giữa.",
      "Khi có chỉ định, amoxicillin là nền tảng; mở rộng khi thất bại/nguy cơ beta-lactamase."
    ],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "viem-tai-giua-cap-o-nguoi-lon"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm tai giữa mạn mủ",
    "pathogens": [
      "P. aeruginosa",
      "S. aureus",
      "Proteus spp."
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Làm sạch tai và điều trị tại chỗ khi phù hợp.",
      "Cấy ở bệnh dai dẳng/tái phát; toàn thân nếu lan rộng/biến chứng."
    ],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-tai-giua-man-mu"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm xương chũm",
    "pathogens": [
      "S. pneumoniae",
      "S. pyogenes",
      "S. aureus",
      "Pseudomonas ở bệnh tai mạn"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Hội chẩn TMH; CT xương thái dương khi phù hợp.",
      "Kháng sinh IV; thêm MRSA/Pseudomonas theo nguy cơ; source control khi có chỉ định."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-xuong-chum"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Áp xe sau họng",
    "pathogens": [
      "Streptococcus spp.",
      "S. aureus",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Đánh giá đường thở, CT cổ và lan trung thất.",
      "Kháng sinh IV rộng + dẫn lưu khi có chỉ định."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Cấp cứu",
      "Nội trú"
    ],
    "notes": [],
    "id": "ap-xe-sau-hong"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Áp xe cạnh họng",
    "pathogens": [
      "Streptococcus spp.",
      "S. aureus",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Đánh giá đường thở, mạch cảnh, lan trung thất.",
      "Kháng sinh IV + dẫn lưu khi có chỉ định."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Cấp cứu",
      "Nội trú"
    ],
    "notes": [],
    "id": "ap-xe-canh-hong"
  },
  {
    "category": "Tai Mũi Họng",
    "title": "Viêm thanh quản cấp",
    "pathogens": [
      "Virus"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không dùng kháng sinh thường quy nếu không có bằng chứng nhiễm khuẩn đặc hiệu.",
      "Đánh giá lại nếu khó thở hoặc kéo dài bất thường."
    ],
    "duration": [
      "Không kháng sinh thường quy."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú"
    ],
    "notes": [],
    "id": "viem-thanh-quan-cap"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm màng não mủ cộng đồng người lớn",
    "pathogens": [
      "S. pneumoniae",
      "N. meningitidis",
      "Listeria monocytogenes ở nhóm nguy cơ"
    ],
    "sources": [
      "XP2025",
      "BM2023",
      "WHO_MENINGITIS2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Khởi trị ngay sau cấy máu; không trì hoãn vì chờ LP/CT nếu có chống chỉ định.",
      "Phác đồ kinh nghiệm phải bao phủ pneumococcus; bổ sung Listeria theo tuổi/miễn dịch; chỉnh theo vi sinh."
    ],
    "duration": [
      "Theo tác nhân; thường 7–21 ngày."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-mang-nao-mu-cong-dong-nguoi-lon"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm màng não sau phẫu thuật thần kinh / liên quan shunt",
    "pathogens": [
      "Staphylococcus spp.",
      "Gram âm gồm Pseudomonas"
    ],
    "sources": [
      "XP2025",
      "BM2023",
      "AMR2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Lấy CSF/bệnh phẩm từ thiết bị khi phù hợp; đánh giá loại bỏ/thay shunt.",
      "Bao phủ MRSA + Gram âm kháng thuốc; chỉnh theo AST."
    ],
    "duration": [
      "Theo tác nhân/thiết bị."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-mang-nao-sau-phau-thuat-than-kinh-lien-quan-shunt"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm não HSV",
    "pathogens": [
      "HSV"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Acyclovir IV sớm khi nghi ngờ; không chờ PCR nếu nghi lâm sàng cao.",
      "Hiệu chỉnh theo thận và đảm bảo đủ dịch."
    ],
    "duration": [
      "Theo phác đồ HSV encephalitis."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-nao-hsv"
  },
  {
    "category": "Thần kinh",
    "title": "Áp xe não",
    "pathogens": [
      "S. anginosus group",
      "Kỵ khí",
      "S. aureus",
      "Gram âm theo nguồn"
    ],
    "sources": [
      "XP2025",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "MRI/CT + hội chẩn ngoại thần kinh; lấy bệnh phẩm khi dẫn lưu.",
      "Kháng sinh theo nguồn (răng/TMH, hậu phẫu, chấn thương, huyết sinh); chỉnh theo cấy."
    ],
    "duration": [
      "Thường 4–8 tuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "ap-xe-nao"
  },
  {
    "category": "Thần kinh",
    "title": "Áp xe ngoài màng cứng nội sọ",
    "pathogens": [
      "S. aureus",
      "Streptococcus spp.",
      "Gram âm"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Hội chẩn ngoại thần kinh/TMH và source control.",
      "Kháng sinh IV dựa theo nguồn và vi sinh."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "ap-xe-ngoai-mang-cung-noi-so"
  },
  {
    "category": "Thần kinh",
    "title": "Tụ mủ dưới màng cứng",
    "pathogens": [
      "Streptococcus spp.",
      "S. aureus",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Dẫn lưu ngoại khoa thường cần thiết.",
      "Kháng sinh IV phổ phù hợp theo nguồn/cấy."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "tu-mu-duoi-mang-cung"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm não do Naegleria fowleri",
    "pathogens": [
      "Naegleria fowleri"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Bệnh hiếm, tối khẩn; hội chẩn truyền nhiễm và dùng phác đồ chuyên biệt cập nhật.",
      "Không áp dụng thuật toán kháng sinh thường quy."
    ],
    "duration": [
      "Theo chuyên biệt."
    ],
    "severity": [
      "Tối khẩn"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-nao-do-naegleria-fowleri"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm não do Acanthamoeba / Balamuthia",
    "pathogens": [
      "Acanthamoeba spp.",
      "Balamuthia mandrillaris"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị phối hợp chuyên biệt dựa trên chẩn đoán xác định.",
      "Hội chẩn trung tâm chuyên sâu."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-nao-do-acanthamoeba-balamuthia"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm não do Trichinella",
    "pathogens": [
      "Trichinella spiralis"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị ký sinh trùng và hỗ trợ theo hướng dẫn chuyên biệt; đánh giá tim-thần kinh."
    ],
    "duration": [
      "Theo bệnh cảnh."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-nao-do-trichinella"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm màng não tăng bạch cầu ái toan",
    "pathogens": [
      "Angiostrongylus cantonensis"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chẩn đoán căn nguyên; điều trị hỗ trợ/chuyên biệt.",
      "Không dùng kháng sinh thường quy nếu không có bội nhiễm."
    ],
    "duration": [
      "Theo căn nguyên."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-mang-nao-tang-bach-cau-ai-toan"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm não / màng não do Rickettsia",
    "pathogens": [
      "Rickettsia spp."
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị theo căn nguyên nghi ngờ/xác định và dịch tễ; không trì hoãn ở bệnh nặng."
    ],
    "duration": [
      "Theo căn nguyên."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-nao-mang-nao-do-rickettsia"
  },
  {
    "category": "Thần kinh",
    "title": "Toxoplasmosis TKTW ở HIV",
    "pathogens": [
      "Toxoplasma gondii"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị chuyên biệt khi hình ảnh/miễn dịch phù hợp; theo dõi đáp ứng.",
      "Đánh giá dự phòng thứ phát và ART."
    ],
    "duration": [
      "Tấn công + duy trì."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "toxoplasmosis-tktw-o-hiv"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm màng não do Cryptococcus",
    "pathogens": [
      "Cryptococcus spp."
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị induction–consolidation–maintenance; quản lý áp lực nội sọ.",
      "Theo tình trạng HIV/ghép tạng."
    ],
    "duration": [
      "Nhiều tháng."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-mang-nao-do-cryptococcus"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm màng não do Candida",
    "pathogens": [
      "Candida spp."
    ],
    "sources": [
      "BM2023",
      "CANDIDA2016"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Kháng nấm IV + source control thiết bị nếu có; chọn theo loài/độ nhạy."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-mang-nao-do-candida"
  },
  {
    "category": "Thần kinh",
    "title": "Lao màng não",
    "pathogens": [
      "Mycobacterium tuberculosis"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chuyển sang phác đồ lao chuẩn + corticosteroid bổ trợ khi chỉ định.",
      "Không xử lý trong thuật toán kháng sinh thường quy."
    ],
    "duration": [
      "Theo phác đồ lao TKTW."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "lao-mang-nao"
  },
  {
    "category": "Thần kinh",
    "title": "Bệnh Lyme thần kinh",
    "pathogens": [
      "Borrelia burgdorferi"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "benh-lyme-than-kinh"
  },
  {
    "category": "Thần kinh",
    "title": "Viêm não do Schistosoma",
    "pathogens": [
      "Schistosoma spp."
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "viem-nao-do-schistosoma"
  },
  {
    "category": "Tim mạch",
    "title": "Viêm nội tâm mạc nhiễm khuẩn – van tự nhiên",
    "pathogens": [
      "Viridans streptococci",
      "S. aureus",
      "Enterococcus spp."
    ],
    "sources": [
      "UMC2023",
      "XP2025",
      "BM2023",
      "IE2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Lấy ≥3 bộ cấy máu trước kháng sinh nếu huyết động cho phép.",
      "Siêu âm tim và điều trị đích theo tác nhân, van, MIC/AST.",
      "Hội chẩn Endocarditis Team khi có biến chứng/chỉ định mổ."
    ],
    "duration": [
      "Thường 4–6 tuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-noi-tam-mac-nhiem-khuan-van-tu-nhien"
  },
  {
    "category": "Tim mạch",
    "title": "Viêm nội tâm mạc van nhân tạo",
    "pathogens": [
      "Staphylococcus spp.",
      "Enterococcus spp.",
      "Streptococcus spp."
    ],
    "sources": [
      "UMC2023",
      "BM2023",
      "IE2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu, TEE và đánh giá phẫu thuật sớm.",
      "Phác đồ phụ thuộc thời điểm sau thay van, tác nhân và kháng thuốc."
    ],
    "duration": [
      "Thường ≥6 tuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-noi-tam-mac-van-nhan-tao"
  },
  {
    "category": "Tim mạch",
    "title": "Viêm nội tâm mạc liên quan thiết bị tim",
    "pathogens": [
      "S. aureus",
      "CoNS"
    ],
    "sources": [
      "IE2023",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu và đánh giá loại bỏ toàn bộ hệ thống thiết bị khi chỉ định.",
      "Kháng sinh theo tác nhân + source control."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-noi-tam-mac-lien-quan-thiet-bi-tim"
  },
  {
    "category": "Tim mạch",
    "title": "Viêm nội tâm mạc cấy máu âm tính",
    "pathogens": [
      "Coxiella burnetii",
      "Bartonella spp.",
      "Brucella spp.",
      "T. whipplei"
    ],
    "sources": [
      "IE2023",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Xác nhận lấy cấy đúng, xem kháng sinh trước đó, làm huyết thanh/PCR chuyên biệt.",
      "Điều trị theo căn nguyên; hội chẩn chuyên khoa."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-noi-tam-mac-cay-mau-am-tinh"
  },
  {
    "category": "Tim mạch",
    "title": "Nhiễm khuẩn thiết bị hỗ trợ tim / mạch máu",
    "pathogens": [
      "S. aureus",
      "CoNS",
      "Gram âm",
      "Candida"
    ],
    "sources": [
      "IE2023",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu, cấy mô/thiết bị và đánh giá source control.",
      "Kháng sinh theo vật liệu, mức xâm lấn và AST."
    ],
    "duration": [],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-thiet-bi-ho-tro-tim-mach-mau"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Nhiễm khuẩn ổ bụng cộng đồng",
    "pathogens": [
      "Enterobacterales",
      "Streptococcus spp.",
      "Kỵ khí"
    ],
    "sources": [
      "UMC2023",
      "XP2025",
      "BM2023",
      "IAI2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Source control sớm.",
      "Bao phủ Enterobacterales + kỵ khí theo mức độ/nguy cơ ESBL; thu hẹp khi có cấy."
    ],
    "duration": [
      "Liệu trình ngắn sau source control tốt."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-o-bung-cong-dong"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Nhiễm khuẩn ổ bụng liên quan chăm sóc y tế",
    "pathogens": [
      "ESBL-E",
      "Enterococcus spp.",
      "Pseudomonas",
      "Candida ở nhóm nguy cơ"
    ],
    "sources": [
      "UMC2023",
      "XP2025",
      "BM2023",
      "IAI2024",
      "AMR2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Source control + cấy ổ nhiễm.",
      "Phổ dựa trên vi sinh/kháng sinh trước đây; chỉ thêm Enterococcus/MRSA/Candida khi có yếu tố nguy cơ."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-o-bung-lien-quan-cham-soc-y-te"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Viêm ruột thừa cấp",
    "pathogens": [
      "Enterobacterales",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023",
      "IAI2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phẫu thuật hoặc chiến lược không mổ ở ca chọn lọc.",
      "Kháng sinh theo không biến chứng vs thủng/áp xe; không kéo dài không cần thiết sau source control."
    ],
    "duration": [
      "Ngắn sau source control."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-ruot-thua-cap"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Viêm túi mật cấp",
    "pathogens": [
      "Enterobacterales",
      "Enterococcus chọn lọc",
      "Kỵ khí chọn lọc"
    ],
    "sources": [
      "UMC2023",
      "XP2025",
      "BM2023",
      "IAI2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phân tầng mức độ, đánh giá dẫn lưu/phẫu thuật.",
      "Phổ theo cộng đồng/chăm sóc y tế và nguy cơ ESBL."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-tui-mat-cap"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Viêm đường mật cấp",
    "pathogens": [
      "Enterobacterales",
      "Enterococcus spp."
    ],
    "sources": [
      "UMC2023",
      "XP2025",
      "BM2023",
      "IAI2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Kháng sinh sớm + giải áp đường mật khi tắc nghẽn/sepsis.",
      "Chọn phổ theo mức độ và nguy cơ MDR."
    ],
    "duration": [
      "Ngắn hơn khi dẫn lưu thành công."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-duong-mat-cap"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Áp xe gan",
    "pathogens": [
      "Enterobacterales",
      "S. anginosus group",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu; chọc hút/dẫn lưu khi phù hợp; phân biệt mủ và amip.",
      "Bao phủ Gram âm + kỵ khí ở áp xe mủ, sau đó điều trị đích."
    ],
    "duration": [
      "Nhiều tuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "ap-xe-gan"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Viêm phúc mạc thứ phát",
    "pathogens": [
      "Enterobacterales",
      "Kỵ khí",
      "Enterococcus chọn lọc"
    ],
    "sources": [
      "UMC2023",
      "BM2023",
      "IAI2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Source control khẩn.",
      "Kháng sinh IV theo cộng đồng/chăm sóc y tế và nguy cơ ESBL."
    ],
    "duration": [
      "Ngắn sau source control."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-phuc-mac-thu-phat"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Viêm phúc mạc tự phát ở xơ gan",
    "pathogens": [
      "Enterobacterales",
      "Streptococcus spp."
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chọc dịch báng trước kháng sinh nếu không trì hoãn.",
      "Cephalosporin thế hệ 3 hoặc lựa chọn theo nguy cơ MDR; albumin khi đủ tiêu chuẩn."
    ],
    "duration": [
      "Thường 5–7 ngày."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-phuc-mac-tu-phat-o-xo-gan"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Viêm túi thừa đại tràng",
    "pathogens": [
      "Enterobacterales",
      "Kỵ khí"
    ],
    "sources": [
      "XP2025",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không phải mọi ca không biến chứng đều cần kháng sinh.",
      "Khi dùng, bao phủ Gram âm + kỵ khí."
    ],
    "duration": [
      "Ngắn nếu đáp ứng."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-tui-thua-dai-trang"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Tiêu chảy nhiễm khuẩn",
    "pathogens": [
      "Campylobacter",
      "Salmonella",
      "Shigella",
      "Vibrio",
      "C. difficile"
    ],
    "sources": [
      "XP2025",
      "BM2023",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Bù dịch là nền tảng; xét nghiệm phân khi nặng/có máu/suy giảm miễn dịch.",
      "Không dùng kháng sinh cho mọi tiêu chảy; tránh kháng sinh khi nghi STEC."
    ],
    "duration": [
      "Theo tác nhân."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "tieu-chay-nhiem-khuan"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Nhiễm Clostridioides difficile",
    "pathogens": [
      "C. difficile"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Ngừng kháng sinh không cần thiết; phân tầng severe/fulminant.",
      "Điều trị đặc hiệu theo guideline hiện hành; đánh giá tái phát."
    ],
    "duration": [
      "Theo đợt đầu/tái phát."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-clostridioides-difficile"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Nhiễm Helicobacter pylori",
    "pathogens": [
      "H. pylori"
    ],
    "sources": [
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chọn phác đồ diệt trừ theo tiền sử macrolide, dữ liệu kháng clarithromycin và thuốc sẵn có.",
      "Luôn xác nhận tiệt trừ sau điều trị."
    ],
    "duration": [
      "Theo phác đồ diệt trừ."
    ],
    "severity": [
      "Ổn định"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-helicobacter-pylori"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Viêm tụy hoại tử nhiễm trùng",
    "pathogens": [
      "Enterobacterales",
      "Enterococcus",
      "Gram dương",
      "Nấm chọn lọc"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không dùng kháng sinh dự phòng cho hoại tử vô khuẩn.",
      "Khi nghi/xác định nhiễm trùng, kháng sinh thấm mô tốt + chiến lược can thiệp step-up."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-tuy-hoai-tu-nhiem-trung"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Áp xe ổ bụng sau phẫu thuật",
    "pathogens": [
      "Enterobacterales",
      "Pseudomonas",
      "Enterococcus",
      "Kỵ khí",
      "Candida chọn lọc"
    ],
    "sources": [
      "BM2023",
      "IAI2024",
      "AMR2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Dẫn lưu + cấy ổ mủ.",
      "Kháng sinh theo chăm sóc y tế/kháng sinh trước đó; thu hẹp theo AST."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "ap-xe-o-bung-sau-phau-thuat"
  },
  {
    "category": "Ổ bụng - tiêu hóa - hệ mật",
    "title": "Nhiễm khuẩn đường mật sau ERCP/stent",
    "pathogens": [
      "Enterobacterales",
      "Enterococcus",
      "Pseudomonas"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Đánh giá tắc stent và source control.",
      "Kháng sinh theo vi sinh/chăm sóc y tế và AST."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-duong-mat-sau-ercp-stent"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Viêm bàng quang cấp không biến chứng",
    "pathogens": [
      "E. coli",
      "Klebsiella spp.",
      "S. saprophyticus"
    ],
    "sources": [
      "BM2023",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chọn thuốc theo kháng sinh đồ địa phương và chống chỉ định cá thể.",
      "Tránh fluoroquinolone khi có lựa chọn hẹp hiệu quả hơn."
    ],
    "duration": [
      "Liệu trình ngắn theo thuốc."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-bang-quang-cap-khong-bien-chung"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Viêm thận – bể thận cấp",
    "pathogens": [
      "E. coli",
      "Klebsiella spp.",
      "Proteus spp."
    ],
    "sources": [
      "BM2023",
      "CUTI2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy nước tiểu trước điều trị; đánh giá sepsis/tắc nghẽn.",
      "Chọn theo mức độ, vi sinh trước đây và nguy cơ kháng; IV→PO khi ổn định."
    ],
    "duration": [
      "5–7 ngày FQ hoặc khoảng 7 ngày thuốc khác ở nhiều ca cải thiện."
    ],
    "severity": [
      "Trung bình",
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-than-be-than-cap"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Nhiễm khuẩn tiết niệu phức tạp (cUTI)",
    "pathogens": [
      "Enterobacterales",
      "Pseudomonas",
      "Enterococcus chọn lọc"
    ],
    "sources": [
      "CUTI2025",
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Bước 1: phân tầng sepsis.",
      "Bước 2: xem cấy trước đây/nguy cơ kháng; tránh thuốc đã có isolate kháng.",
      "Bước 3: tránh FQ nếu đã phơi nhiễm trong 12 tháng khi có lựa chọn khác; bước 4: dùng antibiogram."
    ],
    "duration": [
      "5–7 ngày FQ hoặc 7 ngày non-FQ trong nhiều ca cải thiện."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-tiet-nieu-phuc-tap-cuti"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Urosepsis",
    "pathogens": [
      "Enterobacterales",
      "Pseudomonas",
      "Enterococcus"
    ],
    "sources": [
      "BM2023",
      "CUTI2025",
      "SSC2021"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu + nước tiểu, đánh giá tắc nghẽn/source control.",
      "Kháng sinh IV theo sepsis + nguy cơ MDR; giải áp nếu tắc nghẽn nhiễm khuẩn."
    ],
    "duration": [
      "Theo đáp ứng/source control."
    ],
    "severity": [
      "Nặng",
      "Sốc"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "urosepsis"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Áp xe thận / quanh thận",
    "pathogens": [
      "S. aureus",
      "Enterobacterales"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "CT và đánh giá dẫn lưu.",
      "Kháng sinh IV theo nguồn huyết sinh vs đường niệu; điều trị đích."
    ],
    "duration": [
      "Nhiều tuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "ap-xe-than-quanh-than"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Viêm tuyến tiền liệt cấp",
    "pathogens": [
      "Enterobacterales",
      "Pseudomonas"
    ],
    "sources": [
      "BM2023",
      "CUTI2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy nước tiểu; tránh xoa bóp tuyến tiền liệt.",
      "Thuốc phải đạt nồng độ mô tiền liệt; IV nếu sepsis, sau đó step-down."
    ],
    "duration": [
      "Dài hơn cUTI thông thường."
    ],
    "severity": [
      "Trung bình",
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-tuyen-tien-liet-cap"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Viêm tuyến tiền liệt mạn do vi khuẩn",
    "pathogens": [
      "Enterobacterales"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Xác nhận căn nguyên và ổ bất thường.",
      "Điều trị đích với thuốc thấm mô tốt theo AST."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Ổn định"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-tuyen-tien-liet-man-do-vi-khuan"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Viêm mào tinh hoàn / tinh hoàn",
    "pathogens": [
      "C. trachomatis",
      "N. gonorrhoeae",
      "Enterobacterales"
    ],
    "sources": [
      "BM2023",
      "WHO_STI_GCS2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phân tầng theo tuổi/nguy cơ STI vs tác nhân đường niệu.",
      "Điều trị theo căn nguyên; xét nghiệm và quản lý bạn tình khi nghi STI."
    ],
    "duration": [
      "Theo căn nguyên."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-mao-tinh-hoan-tinh-hoan"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Nhiễm khuẩn niệu liên quan catheter",
    "pathogens": [
      "Enterobacterales",
      "Pseudomonas",
      "Enterococcus"
    ],
    "sources": [
      "CUTI2025",
      "BYT5631"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không điều trị bacteriuria không triệu chứng chỉ vì catheter, trừ chỉ định đặc biệt.",
      "Thay/rút catheter khi phù hợp; cấy từ catheter mới và điều trị theo triệu chứng/AST."
    ],
    "duration": [
      "Theo mức độ."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-nieu-lien-quan-catheter"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Vi khuẩn niệu không triệu chứng",
    "pathogens": [
      "Enterobacterales và khác"
    ],
    "sources": [
      "BM2023",
      "WHO_AWARE2022"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không điều trị thường quy ngoại trừ chỉ định được guideline xác định như thai kỳ hoặc một số can thiệp tiết niệu.",
      "Tránh biến colonization thành chỉ định kháng sinh."
    ],
    "duration": [
      "Không kháng sinh nếu không có chỉ định."
    ],
    "severity": [
      "Ổn định"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "vi-khuan-nieu-khong-trieu-chung"
  },
  {
    "category": "Tiết niệu - sinh dục nam",
    "title": "Áp xe tuyến tiền liệt",
    "pathogens": [
      "Enterobacterales",
      "S. aureus"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Hình ảnh và dẫn lưu khi phù hợp.",
      "Kháng sinh đạt nồng độ mô theo AST."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "ap-xe-tuyen-tien-liet"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Viêm vùng chậu (PID)",
    "pathogens": [
      "N. gonorrhoeae",
      "C. trachomatis",
      "Kỵ khí",
      "M. genitalium"
    ],
    "sources": [
      "BM2023",
      "WHO_STI_GCS2024",
      "WHO_STI_TMC2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị kinh nghiệm sớm khi đủ tiêu chuẩn; bao phủ lậu, Chlamydia và kỵ khí theo phác đồ chuẩn.",
      "Xét nghiệm STI và quản lý bạn tình."
    ],
    "duration": [
      "Theo phác đồ PID."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-vung-chau-pid"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Lậu cầu",
    "pathogens": [
      "Neisseria gonorrhoeae"
    ],
    "sources": [
      "WHO_STI_GCS2024",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Dùng phác đồ WHO 2024 và dữ liệu kháng lậu địa phương.",
      "NAAT/cấy khi thất bại hoặc nghi kháng; quản lý bạn tình."
    ],
    "duration": [
      "Theo vị trí nhiễm."
    ],
    "severity": [
      "Ổn định"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "lau-cau"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Chlamydia",
    "pathogens": [
      "Chlamydia trachomatis"
    ],
    "sources": [
      "WHO_STI_GCS2024",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị theo WHO 2024; lựa chọn phụ thuộc thai kỳ, vị trí nhiễm và tuân thủ.",
      "Quản lý bạn tình."
    ],
    "duration": [
      "Theo phác đồ."
    ],
    "severity": [
      "Ổn định"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "chlamydia"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Giang mai",
    "pathogens": [
      "Treponema pallidum"
    ],
    "sources": [
      "WHO_STI_GCS2024",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phân giai đoạn trước điều trị.",
      "Penicillin là nền tảng, đặc biệt trong thai kỳ; xử trí dị ứng ở thai phụ theo chuyên khoa."
    ],
    "duration": [
      "Theo giai đoạn."
    ],
    "severity": [
      "Ổn định"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "giang-mai"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Trichomoniasis",
    "pathogens": [
      "Trichomonas vaginalis"
    ],
    "sources": [
      "WHO_STI_TMC2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Metronidazole/tinidazole theo WHO 2024; điều trị bạn tình và xét nghiệm STI khác."
    ],
    "duration": [
      "Theo phác đồ."
    ],
    "severity": [
      "Ổn định"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "trichomoniasis"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Mycoplasma genitalium",
    "pathogens": [
      "M. genitalium"
    ],
    "sources": [
      "WHO_STI_TMC2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Ưu tiên chiến lược dựa trên xét nghiệm/kháng macrolide nếu có.",
      "Không dùng azithromycin đơn liều theo thói quen."
    ],
    "duration": [
      "Theo phác đồ nhiều bước."
    ],
    "severity": [
      "Ổn định"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "mycoplasma-genitalium"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Bacterial vaginosis",
    "pathogens": [
      "Dysbiosis âm đạo"
    ],
    "sources": [
      "WHO_STI_TMC2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị khi có triệu chứng theo WHO 2024; metronidazole là lựa chọn nền tảng trong nhiều phác đồ."
    ],
    "duration": [
      "Theo phác đồ."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "bacterial-vaginosis"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Vulvovaginal candidiasis",
    "pathogens": [
      "Candida albicans",
      "non-albicans Candida"
    ],
    "sources": [
      "WHO_STI_TMC2024",
      "CANDIDA2016"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phân loại không biến chứng vs tái phát/nặng/non-albicans.",
      "Điều trị tại chỗ hoặc azole uống khi phù hợp; thai kỳ dùng lựa chọn an toàn."
    ],
    "duration": [
      "Theo phân loại."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "vulvovaginal-candidiasis"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Viêm nội mạc tử cung hậu sản",
    "pathogens": [
      "Polymicrobial"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Kháng sinh IV phổ rộng bao phủ hệ vi khuẩn sinh dục.",
      "Đánh giá retained products/áp xe nếu không đáp ứng."
    ],
    "duration": [
      "Đến khi hết sốt/cải thiện."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-noi-mac-tu-cung-hau-san"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Chorioamnionitis / nhiễm khuẩn ối",
    "pathogens": [
      "Polymicrobial"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Kháng sinh sớm + xử trí sản khoa; không trì hoãn cuộc sinh chỉ để hoàn tất kháng sinh."
    ],
    "duration": [
      "Theo diễn tiến sản khoa."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "chorioamnionitis-nhiem-khuan-oi"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Nhiễm khuẩn sau mổ lấy thai",
    "pathogens": [
      "S. aureus",
      "Streptococcus spp.",
      "Gram âm",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023",
      "XP2025",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Đánh giá vết mổ, debridement/source control và nguy cơ necrotizing infection.",
      "Kháng sinh theo độ sâu/mức độ; phủ MRSA nếu nguy cơ."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-sau-mo-lay-thai"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Sảy thai nhiễm khuẩn / septic abortion",
    "pathogens": [
      "Polymicrobial"
    ],
    "sources": [
      "BM2023",
      "SSC2021"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Hồi sức sepsis + kháng sinh IV rộng + lấy bỏ mô/source control khẩn."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Nặng",
      "Sốc"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "say-thai-nhiem-khuan-septic-abortion"
  },
  {
    "category": "Sản - phụ khoa - STI",
    "title": "Nhiễm khuẩn hậu sản",
    "pathogens": [
      "Polymicrobial"
    ],
    "sources": [
      "XP2025",
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-hau-san"
  },
  {
    "category": "Da - mô mềm",
    "title": "Viêm mô tế bào không mủ",
    "pathogens": [
      "Beta-hemolytic streptococci",
      "MSSA"
    ],
    "sources": [
      "BM2023",
      "XP2025",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Hướng Streptococcus; thêm MSSA tùy bối cảnh.",
      "Chỉ phủ MRSA khi có yếu tố nguy cơ."
    ],
    "duration": [
      "Thường khoảng 5 ngày nếu cải thiện."
    ],
    "severity": [
      "Nhẹ",
      "Trung bình"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-mo-te-bao-khong-mu"
  },
  {
    "category": "Da - mô mềm",
    "title": "Viêm quầng",
    "pathogens": [
      "Streptococcus spp."
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Beta-lactam phù hợp; xử trí cửa ngõ nhiễm/phù bạch huyết."
    ],
    "duration": [
      "Ngắn nếu đáp ứng."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-quang"
  },
  {
    "category": "Da - mô mềm",
    "title": "Áp xe da",
    "pathogens": [
      "S. aureus including MRSA"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Rạch dẫn lưu là điều trị chính.",
      "Kháng sinh bổ sung khi SIRS, bệnh nặng, suy giảm miễn dịch, thất bại hoặc nhiều ổ."
    ],
    "duration": [
      "Ngắn sau dẫn lưu nếu cần."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "ap-xe-da"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nhọt / hậu bối",
    "pathogens": [
      "S. aureus"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Dẫn lưu khi có ổ mủ; không tự động dùng kháng sinh toàn thân ở ca đơn giản."
    ],
    "duration": [
      "Ngắn."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhot-hau-boi"
  },
  {
    "category": "Da - mô mềm",
    "title": "Chốc lở / ecthyma",
    "pathogens": [
      "S. aureus",
      "S. pyogenes"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Tại chỗ khi khu trú; toàn thân khi nhiều tổn thương/ecthyma."
    ],
    "duration": [
      "Khoảng 5–7 ngày."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "choc-lo-ecthyma"
  },
  {
    "category": "Da - mô mềm",
    "title": "Viêm cân mạc hoại tử",
    "pathogens": [
      "Polymicrobial",
      "GAS",
      "S. aureus",
      "Clostridium spp."
    ],
    "sources": [
      "BM2023",
      "XP2025",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Mổ thám sát/debridement ngay; không chờ hình ảnh nếu nghi cao.",
      "Kháng sinh rộng bao phủ MRSA + Gram âm + kỵ khí; khi GAS xác định dùng phác đồ có penicillin + ức chế độc tố."
    ],
    "duration": [
      "Đến khi source control hoàn tất/cải thiện."
    ],
    "severity": [
      "Tối khẩn"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-can-mac-hoai-tu"
  },
  {
    "category": "Da - mô mềm",
    "title": "Hoại thư sinh hơi / myonecrosis",
    "pathogens": [
      "Clostridium spp.",
      "Polymicrobial"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phẫu thuật khẩn + kháng sinh IV rộng; điều trị chuyên biệt theo căn nguyên."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Tối khẩn"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "hoai-thu-sinh-hoi-myonecrosis"
  },
  {
    "category": "Da - mô mềm",
    "title": "Pyomyositis",
    "pathogens": [
      "S. aureus",
      "Streptococcus spp.",
      "Gram âm chọn lọc"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "MRI khi cần; dẫn lưu ổ mủ và cấy.",
      "Kháng sinh chống S. aureus, mở rộng Gram âm ở suy giảm miễn dịch/trauma."
    ],
    "duration": [
      "Nhiều tuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "pyomyositis"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nhiễm khuẩn bàn chân đái tháo đường",
    "pathogens": [
      "Gram dương",
      "Gram âm ở ca mạn/nặng",
      "Kỵ khí khi thiếu máu/hoại tử"
    ],
    "sources": [
      "UMC2023",
      "BM2023",
      "DFI2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chẩn đoán lâm sàng và phân mức độ IWGDF/IDSA.",
      "Không dùng kháng sinh cho loét không nhiễm.",
      "Lấy mẫu mô sâu; source control, off-loading, đánh giá tưới máu."
    ],
    "duration": [
      "Mô mềm thường 1–2 tuần; viêm xương dài hơn."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-ban-chan-dai-thao-duong"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nhiễm khuẩn vết mổ",
    "pathogens": [
      "S. aureus",
      "Gram âm/kỵ khí tùy vị trí"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Mở dẫn lưu khi có ổ mủ; đánh giá độ sâu/cơ quan-khoang.",
      "Kháng sinh khi có chỉ định toàn thân hoặc nhiễm sâu; phổ phụ thuộc vị trí."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-vet-mo"
  },
  {
    "category": "Da - mô mềm",
    "title": "Vết cắn chó/mèo",
    "pathogens": [
      "Pasteurella spp.",
      "Capnocytophaga",
      "Streptococcus",
      "S. aureus",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Rửa sạch, debridement, đánh giá uốn ván/dại.",
      "Dự phòng/điều trị ở vết nguy cơ cao; amoxicillin-clavulanate thường là nền tảng nếu phù hợp."
    ],
    "duration": [
      "3–5 ngày dự phòng; dài hơn nếu nhiễm."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "vet-can-cho-meo"
  },
  {
    "category": "Da - mô mềm",
    "title": "Vết cắn người",
    "pathogens": [
      "Eikenella corrodens",
      "Streptococcus",
      "S. aureus",
      "Kỵ khí"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Rửa/debridement; đánh giá khớp/gân ở clenched-fist injury.",
      "Bao phủ Eikenella + kỵ khí."
    ],
    "duration": [
      "Theo độ sâu."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "vet-can-nguoi"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nhiễm Vibrio vulnificus vết thương",
    "pathogens": [
      "Vibrio vulnificus"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Hỏi phơi nhiễm nước biển/hải sản; debridement sớm nếu hoại tử.",
      "Điều trị chuyên biệt khẩn; nguy cơ cao ở bệnh gan."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-vibrio-vulnificus-vet-thuong"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nhiễm Aeromonas vết thương",
    "pathogens": [
      "Aeromonas hydrophila"
    ],
    "sources": [
      "BM2023",
      "SSTI2014",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Hỏi phơi nhiễm nước ngọt; cấy/debridement.",
      "Chọn theo AST vì có kháng tự nhiên với một số beta-lactam."
    ],
    "duration": [
      "Theo đáp ứng."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-aeromonas-vet-thuong"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nhiễm khuẩn loét tỳ đè",
    "pathogens": [
      "Polymicrobial"
    ],
    "sources": [
      "BM2023",
      "SSTI2014"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không điều trị colonization bề mặt.",
      "Debridement/source control; toàn thân khi cellulitis lan, osteomyelitis hoặc sepsis."
    ],
    "duration": [
      "Theo độ sâu."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-loet-ty-de"
  },
  {
    "category": "Da - mô mềm",
    "title": "Viêm nang lông",
    "pathogens": [
      "S. aureus"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-nang-long"
  },
  {
    "category": "Da - mô mềm",
    "title": "Erythrasma",
    "pathogens": [
      "Corynebacterium minutissimum"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "erythrasma"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nấm da thân",
    "pathogens": [
      "Dermatophytes"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nam-da-than"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nấm da bẹn",
    "pathogens": [
      "Dermatophytes"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nam-da-ben"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nấm da đầu",
    "pathogens": [
      "Dermatophytes"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nam-da-dau"
  },
  {
    "category": "Da - mô mềm",
    "title": "Nấm móng",
    "pathogens": [
      "Dermatophytes",
      "Candida"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Ổn định"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "nam-mong"
  },
  {
    "category": "Da - mô mềm",
    "title": "Herpes simplex da-niêm",
    "pathogens": [
      "HSV"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "herpes-simplex-da-niem"
  },
  {
    "category": "Da - mô mềm",
    "title": "Bệnh Zona",
    "pathogens": [
      "VZV"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "benh-zona"
  },
  {
    "category": "Da - mô mềm",
    "title": "Thủy đậu",
    "pathogens": [
      "VZV"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "thuy-dau"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm xương tủy cấp đường máu",
    "pathogens": [
      "S. aureus",
      "Streptococcus spp.",
      "Gram âm theo nguy cơ"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Lấy cấy máu và mẫu xương/mủ khi có thể.",
      "Kháng sinh chống S. aureus; mở rộng theo nguy cơ và điều trị đích."
    ],
    "duration": [
      "Thường 4–6 tuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-xuong-tuy-cap-duong-mau"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm xương tủy mạn",
    "pathogens": [
      "S. aureus",
      "Gram âm",
      "Polymicrobial"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Debridement và lấy mẫu xương sâu trước kháng sinh nếu ổn định.",
      "Điều trị kéo dài theo AST, implant và source control."
    ],
    "duration": [
      "Thường ≥6 tuần."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-xuong-tuy-man"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm xương đốt sống / spondylodiscitis",
    "pathogens": [
      "S. aureus",
      "Streptococcus spp.",
      "Enterobacterales",
      "Brucella/TB"
    ],
    "sources": [
      "BM2023",
      "VO2015"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu + MRI; nếu ổn định, ưu tiên chẩn đoán vi sinh trước kháng sinh.",
      "Sinh thiết khi cần; điều trị đích; ngoại khoa nếu mất vững/chèn ép/áp xe."
    ],
    "duration": [
      "Thường 6 tuần cho vi khuẩn điển hình."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-xuong-dot-song-spondylodiscitis"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm xương ức sau mổ",
    "pathogens": [
      "S. aureus",
      "CoNS",
      "Gram âm"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Debridement + cấy mô sâu; đánh giá mediastinitis/implant.",
      "Kháng sinh IV theo cấy/source control."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-xuong-uc-sau-mo"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm khớp nhiễm khuẩn – khớp tự nhiên",
    "pathogens": [
      "S. aureus",
      "Streptococcus spp.",
      "Gram âm"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chọc hút khớp trước kháng sinh nếu có thể; dẫn lưu/rửa khớp khi cần.",
      "Kháng sinh chống Gram dương, mở rộng Gram âm theo nguy cơ; điều trị đích."
    ],
    "duration": [
      "Thường 2–4 tuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-khop-nhiem-khuan-khop-tu-nhien"
  },
  {
    "category": "Xương - khớp",
    "title": "Nhiễm khuẩn khớp nhân tạo (PJI)",
    "pathogens": [
      "S. aureus",
      "CoNS",
      "Streptococcus",
      "Enterococcus",
      "Gram âm"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chiến lược DAIR vs one-/two-stage theo thời gian, implant, tác nhân.",
      "Lấy nhiều mẫu mô; điều trị theo biofilm/ngoại khoa."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "nhiem-khuan-khop-nhan-tao-pji"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm bao hoạt dịch nhiễm khuẩn",
    "pathogens": [
      "S. aureus",
      "Streptococcus spp."
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chọc hút/cấy; dẫn lưu nếu mủ.",
      "Kháng sinh chống tụ cầu/liên cầu, chỉnh theo cấy."
    ],
    "duration": [
      "Theo đáp ứng."
    ],
    "severity": [
      "Trung bình"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-bao-hoat-dich-nhiem-khuan"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm khớp do lậu cầu",
    "pathogens": [
      "N. gonorrhoeae"
    ],
    "sources": [
      "BM2023",
      "WHO_STI_GCS2024"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "NAAT/cấy từ niêm mạc và khớp; điều trị theo guideline cập nhật.",
      "Quản lý bạn tình."
    ],
    "duration": [
      "Theo disseminated gonococcal infection."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-khop-do-lau-cau"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm xương do Candida",
    "pathogens": [
      "Candida spp."
    ],
    "sources": [
      "BM2023",
      "CANDIDA2016"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy/giải phẫu bệnh; đánh giá phẫu thuật.",
      "Kháng nấm kéo dài theo loài/độ nhạy."
    ],
    "duration": [
      "Nhiều tháng."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-xuong-do-candida"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm khớp do Candida",
    "pathogens": [
      "Candida spp."
    ],
    "sources": [
      "BM2023",
      "CANDIDA2016"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Dẫn lưu + kháng nấm theo loài/độ nhạy."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-khop-do-candida"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm xương ở bệnh hồng cầu hình liềm",
    "pathogens": [
      "Salmonella spp.",
      "S. aureus"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu/xương; bao phủ S. aureus và Salmonella theo dịch tễ/AST."
    ],
    "duration": [
      "Theo osteomyelitis."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-xuong-o-benh-hong-cau-hinh-liem"
  },
  {
    "category": "Xương - khớp",
    "title": "Viêm xương chấn thương hở / có implant",
    "pathogens": [
      "S. aureus",
      "Gram âm",
      "Polymicrobial"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Debridement + mẫu sâu; đánh giá giữ/tháo implant.",
      "Điều trị đích theo cấy."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-xuong-chan-thuong-ho-co-implant"
  },
  {
    "category": "Mắt",
    "title": "Viêm bờ mi",
    "pathogens": [
      "S. aureus",
      "Dysbiosis tuyến Meibomius"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Vệ sinh bờ mi là nền tảng; kháng sinh tại chỗ chỉ ở trường hợp phù hợp."
    ],
    "duration": [
      "Theo đáp ứng."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-bo-mi"
  },
  {
    "category": "Mắt",
    "title": "Chắp / lẹo",
    "pathogens": [
      "S. aureus"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chườm ấm; rạch dẫn lưu nếu cần; kháng sinh không phải lúc nào cũng cần."
    ],
    "duration": [
      "Ngắn."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "chap-leo"
  },
  {
    "category": "Mắt",
    "title": "Viêm kết mạc cấp",
    "pathogens": [
      "Virus",
      "S. aureus",
      "S. pneumoniae",
      "H. influenzae"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phân biệt virus vs vi khuẩn; nhiều trường hợp tự giới hạn.",
      "Kháng sinh tại chỗ khi nghi vi khuẩn, đặc biệt nhóm nguy cơ."
    ],
    "duration": [
      "Ngắn."
    ],
    "severity": [
      "Nhẹ"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-ket-mac-cap"
  },
  {
    "category": "Mắt",
    "title": "Viêm giác mạc do vi khuẩn",
    "pathogens": [
      "Pseudomonas",
      "S. aureus",
      "Streptococcus spp."
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấp cứu mắt; cạo giác mạc/cấy ở ca nặng.",
      "Kháng sinh nhỏ mắt nồng độ cao theo nhãn khoa/căn nguyên."
    ],
    "duration": [
      "Theo đáp ứng."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-giac-mac-do-vi-khuan"
  },
  {
    "category": "Mắt",
    "title": "Viêm nội nhãn",
    "pathogens": [
      "CoNS",
      "S. aureus",
      "Streptococcus spp.",
      "Gram âm"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấp cứu nhãn khoa; lấy dịch kính + tiêm nội nhãn kháng sinh.",
      "Đánh giá vitrectomy."
    ],
    "duration": [
      "Theo nhãn khoa."
    ],
    "severity": [
      "Tối khẩn"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-noi-nhan"
  },
  {
    "category": "Mắt",
    "title": "Hoại tử võng mạc cấp",
    "pathogens": [
      "HSV",
      "VZV"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Kháng virus toàn thân ± nội nhãn theo nhãn khoa; không dùng kháng sinh."
    ],
    "duration": [
      "Theo phác đồ kháng virus."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "hoai-tu-vong-mac-cap"
  },
  {
    "category": "Mắt",
    "title": "Viêm võng mạc CMV",
    "pathogens": [
      "CMV"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Ganciclovir/valganciclovir hoặc lựa chọn khác theo miễn dịch/nhãn khoa; tối ưu ART ở HIV."
    ],
    "duration": [
      "Induction + maintenance."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-vong-mac-cmv"
  },
  {
    "category": "Mắt",
    "title": "Viêm màng bồ đào nghi nhiễm",
    "pathogens": [
      "HSV",
      "VZV",
      "CMV",
      "Toxoplasma"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "INDEXED",
    "treatment": [],
    "duration": [],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "viem-mang-bo-dao-nghi-nhiem"
  },
  {
    "category": "Ung thư - suy giảm miễn dịch",
    "title": "Sốt giảm bạch cầu hạt – nguy cơ cao",
    "pathogens": [
      "Pseudomonas",
      "Enterobacterales",
      "Gram dương"
    ],
    "sources": [
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Khởi trị anti-pseudomonal beta-lactam IV sớm sau cấy máu.",
      "Không thêm vancomycin thường quy; chỉ khi có chỉ định cụ thể."
    ],
    "duration": [
      "Theo hồi phục ANC, ổ nhiễm và vi sinh."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "sot-giam-bach-cau-hat-nguy-co-cao"
  },
  {
    "category": "Ung thư - suy giảm miễn dịch",
    "title": "Sốt giảm bạch cầu hạt – nguy cơ thấp",
    "pathogens": [
      "Enterobacterales",
      "Gram dương"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Dùng thang điểm nguy cơ và khả năng theo dõi ngoại trú.",
      "Có thể phác đồ uống ở người bệnh chọn lọc; tái đánh giá sớm."
    ],
    "duration": [
      "Theo đáp ứng/ANC."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "sot-giam-bach-cau-hat-nguy-co-thap"
  },
  {
    "category": "Ung thư - suy giảm miễn dịch",
    "title": "Sốt kéo dài ở giảm bạch cầu hạt – nghi nấm",
    "pathogens": [
      "Aspergillus",
      "Candida",
      "Mucorales"
    ],
    "sources": [
      "BM2023",
      "ASPERGILLUS2016",
      "CANDIDA2016"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Đánh giá CT phổi/xoang, biomarker và pre-emptive/empiric theo nguy cơ.",
      "Chọn kháng nấm theo dự phòng đã dùng, hình ảnh và nguy cơ mold."
    ],
    "duration": [
      "Theo chẩn đoán."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "sot-keo-dai-o-giam-bach-cau-hat-nghi-nam"
  },
  {
    "category": "Ung thư - suy giảm miễn dịch",
    "title": "Nhiễm khuẩn ở người dùng corticosteroid kéo dài",
    "pathogens": [
      "PJP",
      "TB",
      "Strongyloides",
      "Nấm xâm lấn",
      "Vi khuẩn"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Đánh giá loại/liều ức chế miễn dịch, dự phòng PJP và nhiễm trùng cơ hội.",
      "Không tự mở rộng kháng sinh nếu chưa có hội chứng nhiễm khuẩn."
    ],
    "duration": [
      "Theo căn nguyên."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "nhiem-khuan-o-nguoi-dung-corticosteroid-keo-dai"
  },
  {
    "category": "Ung thư - suy giảm miễn dịch",
    "title": "Nhiễm khuẩn ở bệnh nhân ung thư đặc",
    "pathogens": [
      "Gram âm",
      "Gram dương",
      "Nấm tùy miễn dịch"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phân tầng neutropenia, thiết bị, mucositis, tắc nghẽn và phẫu thuật.",
      "Phác đồ theo hội chứng cụ thể."
    ],
    "duration": [
      "Theo ổ nhiễm."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "nhiem-khuan-o-benh-nhan-ung-thu-dac"
  },
  {
    "category": "Ung thư - suy giảm miễn dịch",
    "title": "Nhiễm khuẩn ở ghép tạng",
    "pathogens": [
      "Vi khuẩn",
      "CMV",
      "Nấm",
      "PJP"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Đánh giá thời gian sau ghép, mức ức chế miễn dịch và dự phòng.",
      "Hội chẩn ghép/Truyền nhiễm; bắt buộc rà tương tác."
    ],
    "duration": [
      "Theo căn nguyên."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "nhiem-khuan-o-ghep-tang"
  },
  {
    "category": "Ung thư - suy giảm miễn dịch",
    "title": "Nhiễm khuẩn catheter ở bệnh nhân ung thư",
    "pathogens": [
      "CoNS",
      "S. aureus",
      "Gram âm",
      "Candida"
    ],
    "sources": [
      "XP2025",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Cấy máu catheter + ngoại vi; đánh giá rút catheter.",
      "Kháng sinh theo huyết động/tác nhân/source control."
    ],
    "duration": [
      "Theo tác nhân."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "nhiem-khuan-catheter-o-benh-nhan-ung-thu"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Pneumocystis jirovecii pneumonia (PJP)",
    "pathogens": [
      "Pneumocystis jirovecii"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "TMP-SMX là nền tảng nếu dung nạp; corticosteroid bổ trợ khi giảm oxy máu đủ tiêu chuẩn.",
      "Đánh giá dự phòng thứ phát và ART."
    ],
    "duration": [
      "Khoảng 21 ngày ở HIV."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "pneumocystis-jirovecii-pneumonia-pjp"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Toxoplasmosis não ở HIV",
    "pathogens": [
      "Toxoplasma gondii"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phác đồ chuyên biệt + theo dõi đáp ứng hình ảnh/lâm sàng.",
      "Duy trì thứ phát đến hồi phục miễn dịch."
    ],
    "duration": [
      "Tấn công + duy trì."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "toxoplasmosis-nao-o-hiv"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Cryptococcal meningitis ở HIV",
    "pathogens": [
      "Cryptococcus neoformans"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Induction amphotericin-based + flucytosine khi khả dụng; quản lý áp lực nội sọ.",
      "Consolidation + maintenance; thời điểm ART theo guideline."
    ],
    "duration": [
      "Nhiều tháng."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "cryptococcal-meningitis-o-hiv"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Talaromycosis",
    "pathogens": [
      "Talaromyces marneffei"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Kháng nấm hệ thống theo mức độ; induction amphotericin B ở bệnh nặng rồi azole.",
      "Tối ưu ART."
    ],
    "duration": [
      "Theo giai đoạn."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "talaromycosis"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Histoplasmosis ở HIV",
    "pathogens": [
      "Histoplasma capsulatum"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Amphotericin B cho bệnh nặng; itraconazole cho bước tiếp theo/phù hợp."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "histoplasmosis-o-hiv"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "MAC lan tỏa ở HIV",
    "pathogens": [
      "M. avium complex"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phối hợp macrolide + ethambutol và thuốc thứ ba theo mức độ/kháng.",
      "Tối ưu ART."
    ],
    "duration": [
      "≥12 tháng và đến hồi phục miễn dịch."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "mac-lan-toa-o-hiv"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "CMV ở HIV",
    "pathogens": [
      "CMV"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị theo cơ quan đích bằng ganciclovir/valganciclovir hoặc lựa chọn khác.",
      "Theo dõi độc tính tủy/thận."
    ],
    "duration": [
      "Induction + maintenance."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "cmv-o-hiv"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Herpes simplex nặng ở HIV",
    "pathogens": [
      "HSV-1",
      "HSV-2"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Acyclovir/valacyclovir theo mức độ; IV nếu nội tạng/nặng.",
      "Đánh giá kháng acyclovir nếu không đáp ứng."
    ],
    "duration": [
      "Theo vị trí."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "herpes-simplex-nang-o-hiv"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Herpes zoster ở HIV",
    "pathogens": [
      "VZV"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Kháng virus sớm; IV nếu lan tỏa/nội tạng/mắt/TKTW.",
      "Cách ly phù hợp."
    ],
    "duration": [
      "Theo mức độ."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "herpes-zoster-o-hiv"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Cystoisosporiasis",
    "pathogens": [
      "Cystoisospora belli"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "TMP-SMX là nền tảng; bù dịch và tối ưu ART."
    ],
    "duration": [
      "Dài hơn ở HIV."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "cystoisosporiasis"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Leishmaniasis ở HIV",
    "pathogens": [
      "Leishmania spp."
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị chuyên biệt theo loài/vùng địa lý; hội chẩn truyền nhiễm."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "leishmaniasis-o-hiv"
  },
  {
    "category": "HIV / nhiễm trùng cơ hội",
    "title": "Lao ở người nhiễm HIV",
    "pathogens": [
      "M. tuberculosis"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Điều trị theo chương trình lao; chú ý rifamycin-ART và IRIS.",
      "Không xử lý bằng thuật toán kháng sinh thường quy."
    ],
    "duration": [
      "Theo phác đồ lao."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Ngoại trú",
      "Nội trú"
    ],
    "notes": [],
    "id": "lao-o-nguoi-nhiem-hiv"
  },
  {
    "category": "Nấm xâm lấn",
    "title": "Candidemia",
    "pathogens": [
      "Candida spp."
    ],
    "sources": [
      "BM2023",
      "XP2025",
      "CANDIDA2016"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Echinocandin thường khởi đầu ở bệnh nặng/chưa biết độ nhạy.",
      "Cấy máu theo dõi, source control; step-down fluconazole khi ổn định/isolate nhạy."
    ],
    "duration": [
      "≥14 ngày sau cấy âm + hết triệu chứng ở candidemia không biến chứng."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "candidemia-162"
  },
  {
    "category": "Nấm xâm lấn",
    "title": "Candida xâm lấn ổ bụng",
    "pathogens": [
      "Candida spp."
    ],
    "sources": [
      "CANDIDA2016",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Source control + kháng nấm khi có chỉ định.",
      "Lựa chọn theo mức độ/phơi nhiễm azole."
    ],
    "duration": [
      "Theo source control."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "candida-xam-lan-o-bung"
  },
  {
    "category": "Nấm xâm lấn",
    "title": "Candida niệu có triệu chứng",
    "pathogens": [
      "Candida spp."
    ],
    "sources": [
      "CANDIDA2016",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Loại bỏ catheter/tắc nghẽn; không điều trị candiduria không triệu chứng trừ chỉ định đặc biệt.",
      "Thuốc phải đạt nồng độ niệu; chọn theo loài/độ nhạy."
    ],
    "duration": [
      "Theo vị trí."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "candida-nieu-co-trieu-chung"
  },
  {
    "category": "Nấm xâm lấn",
    "title": "Aspergillosis phổi xâm lấn",
    "pathogens": [
      "Aspergillus spp."
    ],
    "sources": [
      "ASPERGILLUS2016",
      "BM2023",
      "XP2025"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Voriconazole ưu tiên theo IDSA 2016; isavuconazole là lựa chọn thay thế phù hợp.",
      "TDM azole khi chỉ định; rà tương tác."
    ],
    "duration": [
      "Thường ≥6–12 tuần."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "aspergillosis-phoi-xam-lan"
  },
  {
    "category": "Nấm xâm lấn",
    "title": "Aspergillus xoang xâm lấn",
    "pathogens": [
      "Aspergillus spp."
    ],
    "sources": [
      "ASPERGILLUS2016",
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Kháng nấm hệ thống + phẫu thuật/debridement khi cần.",
      "Hội chẩn TMH + Truyền nhiễm."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "aspergillus-xoang-xam-lan"
  },
  {
    "category": "Nấm xâm lấn",
    "title": "Mucormycosis",
    "pathogens": [
      "Mucorales"
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Tối khẩn: debridement + liposomal amphotericin B theo chuyên khoa.",
      "Giảm yếu tố nguy cơ, kiểm soát đường huyết/toan ceton."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Tối khẩn"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "mucormycosis"
  },
  {
    "category": "Nấm xâm lấn",
    "title": "Cryptococcosis ngoài TKTW",
    "pathogens": [
      "Cryptococcus spp."
    ],
    "sources": [
      "BM2023"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phân tầng phổi nhẹ vs lan tỏa; loại trừ TKTW ở nhóm nguy cơ.",
      "Kháng nấm theo miễn dịch/mức độ."
    ],
    "duration": [
      "Kéo dài."
    ],
    "severity": [
      "Theo phân tầng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "cryptococcosis-ngoai-tktw"
  },
  {
    "category": "Nấm xâm lấn",
    "title": "Nhiễm nấm xâm lấn ở ICU",
    "pathogens": [
      "Candida",
      "Aspergillus",
      "Mucorales"
    ],
    "sources": [
      "XP2025",
      "BM2023",
      "CANDIDA2016",
      "ASPERGILLUS2016"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Không dùng kháng nấm kinh nghiệm chỉ dựa vào colonization.",
      "Đánh giá yếu tố nguy cơ, biomarker/hình ảnh và nguồn; ưu tiên chẩn đoán hướng đích."
    ],
    "duration": [
      "Theo chẩn đoán."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "nhiem-nam-xam-lan-o-icu"
  },
  {
    "category": "Vi khuẩn đa kháng",
    "title": "Nhiễm Enterobacterales sinh ESBL",
    "pathogens": [
      "ESBL-producing Enterobacterales"
    ],
    "sources": [
      "AMR2026",
      "BM2023",
      "UMC2023",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Theo vị trí/mức độ/AST; carbapenem thường ưu tiên cho nhiễm ngoài niệu nặng.",
      "Step-down uống chỉ khi thuốc phù hợp vị trí, còn nhạy và bệnh nhân ổn định."
    ],
    "duration": [
      "Theo vị trí."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "nhiem-enterobacterales-sinh-esbl"
  },
  {
    "category": "Vi khuẩn đa kháng",
    "title": "Nhiễm Enterobacterales kháng carbapenem (CRE)",
    "pathogens": [
      "CRE"
    ],
    "sources": [
      "AMR2026",
      "BM2023",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Xác định cơ chế carbapenemase nếu có thể; chọn beta-lactam mới theo enzyme/AST.",
      "Tránh colistin khi có beta-lactam mới hiệu quả/an toàn hơn."
    ],
    "duration": [
      "Theo vị trí."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "nhiem-enterobacterales-khang-carbapenem-cre"
  },
  {
    "category": "Vi khuẩn đa kháng",
    "title": "Pseudomonas aeruginosa DTR",
    "pathogens": [
      "DTR P. aeruginosa"
    ],
    "sources": [
      "AMR2026",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Chọn theo AST và vị trí; ưu tiên beta-lactam mới còn hoạt tính khi phù hợp.",
      "Tối ưu PK/PD; không phối hợp kéo dài nếu đã có beta-lactam hoạt tính và ổn định."
    ],
    "duration": [
      "Theo vị trí."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "pseudomonas-aeruginosa-dtr"
  },
  {
    "category": "Vi khuẩn đa kháng",
    "title": "Acinetobacter baumannii kháng carbapenem (CRAB)",
    "pathogens": [
      "CRAB"
    ],
    "sources": [
      "AMR2026",
      "BM2023",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Phác đồ dựa trên sulbactam là nền tảng khi phù hợp; phối hợp theo guidance 2026 + AST.",
      "Theo dõi độc tính."
    ],
    "duration": [
      "Theo vị trí."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "acinetobacter-baumannii-khang-carbapenem-crab"
  },
  {
    "category": "Vi khuẩn đa kháng",
    "title": "MRSA xâm lấn",
    "pathogens": [
      "MRSA"
    ],
    "sources": [
      "BM2023",
      "XP2025",
      "CLSI2026"
    ],
    "status": "GUIDELINE_SYNTHESIS",
    "treatment": [
      "Vancomycin AUC-guided hoặc lựa chọn thay thế theo vị trí; daptomycin không dùng cho pneumonia.",
      "Tìm source control và ổ sâu trong bacteremia."
    ],
    "duration": [
      "Theo vị trí."
    ],
    "severity": [
      "Nặng"
    ],
    "setting": [
      "Nội trú",
      "ICU"
    ],
    "notes": [],
    "id": "mrsa-xam-lan"
  }
];

const commonAssessment = [
  "Xác định hội chứng, vị trí nhiễm và mức độ nặng.",
  "Lấy bệnh phẩm phù hợp trước kháng sinh nếu không làm trì hoãn điều trị cấp cứu.",
  "Đánh giá dị ứng; CrCl/eGFR; chức năng gan; thai kỳ/cho con bú khi liên quan.",
  "Rà soát kháng sinh 90 ngày, vi sinh/AST trước đó và yếu tố nguy cơ MDR.",
  "Đối chiếu antibiogram BV199 và tiêu chuẩn CLSI đang được labo áp dụng.",
];

const commonReassessment = [
  "Đánh giá sớm ở bệnh nặng; thường trong 24–48 giờ.",
  "Đánh giá toàn bộ phác đồ sau 48–72 giờ hoặc ngay khi có vi sinh.",
  "Khi có định danh/AST: chuyển điều trị đích, thu hẹp phổ hoặc ngừng thuốc không còn cần thiết.",
  "Nếu đáp ứng kém: đánh giá lại chẩn đoán, source control, ổ sâu, thiết bị và PK/PD.",
];

const commonDeEscalation = [
  "Ngừng kháng sinh nếu chẩn đoán nhiễm khuẩn không còn phù hợp.",
  "Ưu tiên phổ hẹp nhất còn hiệu quả theo AST và vị trí nhiễm.",
  "Chuyển IV→PO khi ổn định, đường tiêu hóa hoạt động và có thuốc uống phù hợp.",
  "Dùng thời gian điều trị ngắn nhất có bằng chứng khi source control và đáp ứng đạt.",
];

const defaultTreatment = [
  "Mặt bệnh đã được lập chỉ mục từ tài liệu nguồn nhưng chưa nên coi là phác đồ production.",
  "Mở tài liệu nguồn đúng chương/trang và đối chiếu guideline chuyên biệt trước khi phê duyệt tại BV199.",
];

function toClinicalSyndrome(seed: SyndromeSeed): ClinicalSyndrome {
  const therapy = seed.treatment.length ? seed.treatment : defaultTreatment;
  const duration = seed.duration.length
    ? seed.duration
    : ["Cá thể hóa theo vị trí nhiễm, source control, đáp ứng và guideline nguồn."];

  const tdmNeeded = therapy.some((x) =>
    /vancomycin|amikacin|gentamicin|tobramycin|voriconazole|teicoplanin|colistin/i.test(x)
  );

  return {
    id: seed.id,
    category: seed.category,
    title: seed.title,
    population: "Người lớn",
    setting: seed.setting,
    severity: seed.severity,
    verification: seed.status,
    commonPathogens: seed.pathogens,
    assessment: commonAssessment,
    sourceControl: [
      "Tìm và xử trí ổ nhiễm cần dẫn lưu, lấy bỏ dị vật/thiết bị hoặc can thiệp ngoại khoa khi có chỉ định.",
    ],
    firstLine: [
      {
        title: seed.status === "INDEXED" ? "Chỉ mục – cần đối chiếu nguồn" : "Nguyên tắc / lựa chọn điều trị",
        drugs: therapy,
      },
    ],
    alternatives: [
      {
        title: "Khi dị ứng, kháng thuốc hoặc thất bại",
        drugs: [
          "Không thay thuốc theo tên nhóm đơn thuần; phân tầng kiểu dị ứng và dùng dữ liệu AST.",
          "Nếu nghi/xác định MDR, đối chiếu guidance AMR hiện hành và hội chẩn DSLS/Truyền nhiễm.",
        ],
      },
    ],
    duration,
    reassessment: commonReassessment,
    deEscalation: commonDeEscalation,
    renalAdjustment: true,
    tdm: tdmNeeded
      ? [
          "Đánh giá TDM khi thuốc/chỉ định yêu cầu; ưu tiên quy trình BV199 đã được phê duyệt.",
          "PK/PD hỗ trợ tối ưu liều nhưng không thay thế breakpoint CLSI hoặc AST.",
        ]
      : undefined,
    sourceIds: seed.sources,
    requiresBV199Validation: true,
    evidenceNotes: seed.notes,
    tags: [seed.category, ...seed.pathogens],
  };
}

export const allSyndromes: ClinicalSyndrome[] = seeds.map(toClinicalSyndrome);

export const syndromeCategories = [
  "Tất cả",
  ...Array.from(new Set(allSyndromes.map((item) => item.category))),
];

export const categoryCounts: Record<string, number> = Object.fromEntries(
  syndromeCategories
    .filter((category) => category !== "Tất cả")
    .map((category) => [
      category,
      allSyndromes.filter((item) => item.category === category).length,
    ])
);

export const pathogenGuidance: PathogenGuidance[] = [
  {
    "id": "ecoli",
    "name": "Escherichia coli",
    "group": "Gram âm",
    "commonSites": [
      "Tiết niệu",
      "Ổ bụng",
      "Nhiễm khuẩn huyết"
    ],
    "preferred": [
      "Ưu tiên điều trị theo AST và vị trí nhiễm.",
      "Nếu ESBL/CRE: chuyển sang phenotype tương ứng."
    ],
    "avoid": [
      "Không suy diễn nhạy cảm từ cùng nhóm thuốc khi CLSI không cho phép."
    ],
    "notes": [
      "Đối chiếu antibiogram BV199."
    ],
    "sourceIds": [
      "CLSI2026",
      "AMR2026"
    ],
    "requiresBV199Validation": true
  },
  {
    "id": "klebsiella",
    "name": "Klebsiella pneumoniae",
    "group": "Gram âm",
    "commonSites": [
      "Hô hấp",
      "Tiết niệu",
      "Huyết",
      "Ổ bụng"
    ],
    "preferred": [
      "Theo AST; đánh giá ESBL/CRE."
    ],
    "avoid": [
      "Tránh lựa chọn thuần kinh nghiệm nếu có AST gần đây."
    ],
    "notes": [
      "Nếu CRE, xác định cơ chế carbapenemase khi có thể."
    ],
    "sourceIds": [
      "AMR2026",
      "CLSI2026"
    ],
    "requiresBV199Validation": true
  },
  {
    "id": "pseudomonas",
    "name": "Pseudomonas aeruginosa",
    "group": "Gram âm không lên men",
    "commonSites": [
      "HAP/VAP",
      "cUTI",
      "Vết thương",
      "Huyết"
    ],
    "preferred": [
      "Theo AST và local antibiogram; tối ưu PK/PD beta-lactam."
    ],
    "avoid": [
      "Không duy trì phối hợp hai thuốc kéo dài khi đã có một beta-lactam hoạt tính mà không còn lý do khác."
    ],
    "notes": [
      "Nếu DTR, dùng IDSA AMR 2026."
    ],
    "sourceIds": [
      "AMR2026",
      "CLSI2026"
    ],
    "requiresBV199Validation": true
  },
  {
    "id": "acinetobacter",
    "name": "Acinetobacter baumannii",
    "group": "Gram âm không lên men",
    "commonSites": [
      "HAP/VAP",
      "Huyết",
      "Vết thương"
    ],
    "preferred": [
      "Nếu CRAB, dùng guidance AMR 2026; phác đồ dựa trên sulbactam khi phù hợp."
    ],
    "avoid": [
      "Không mặc định colistin đơn trị."
    ],
    "notes": [
      "Đối chiếu AST BV199."
    ],
    "sourceIds": [
      "AMR2026",
      "CLSI2026"
    ],
    "requiresBV199Validation": true
  },
  {
    "id": "staph-aureus",
    "name": "Staphylococcus aureus",
    "group": "Gram dương",
    "commonSites": [
      "Huyết",
      "Da mô mềm",
      "Xương khớp",
      "Nội tâm mạc"
    ],
    "preferred": [
      "MSSA: beta-lactam kháng tụ cầu khi phù hợp.",
      "MRSA: vancomycin AUC-guided hoặc lựa chọn theo vị trí."
    ],
    "avoid": [
      "Daptomycin không dùng cho pneumonia."
    ],
    "notes": [
      "Bacteremia cần tìm ổ sâu."
    ],
    "sourceIds": [
      "BM2023",
      "CLSI2026"
    ],
    "requiresBV199Validation": true
  },
  {
    "id": "enterococcus",
    "name": "Enterococcus spp.",
    "group": "Gram dương",
    "commonSites": [
      "Tiết niệu",
      "Ổ bụng",
      "Nội tâm mạc",
      "Huyết"
    ],
    "preferred": [
      "Theo loài và AST; phân biệt E. faecalis/E. faecium."
    ],
    "avoid": [
      "Không điều trị colonization không triệu chứng."
    ],
    "notes": [
      "Nội tâm mạc cần phác đồ chuyên biệt."
    ],
    "sourceIds": [
      "IE2023",
      "CLSI2026"
    ],
    "requiresBV199Validation": true
  },
  {
    "id": "pneumococcus",
    "name": "Streptococcus pneumoniae",
    "group": "Gram dương",
    "commonSites": [
      "CAP",
      "Meningitis",
      "Tai xoang"
    ],
    "preferred": [
      "Theo hội chứng và breakpoint phù hợp vị trí."
    ],
    "avoid": [
      "Không dùng breakpoint non-meningitis để suy diễn cho meningitis."
    ],
    "notes": [
      "CLSI có breakpoint khác theo hội chứng."
    ],
    "sourceIds": [
      "CLSI2026",
      "CAP2019",
      "WHO_MENINGITIS2025"
    ],
    "requiresBV199Validation": true
  },
  {
    "id": "gas",
    "name": "Streptococcus pyogenes (GAS)",
    "group": "Gram dương",
    "commonSites": [
      "Viêm họng",
      "Da mô mềm",
      "Necrotizing fasciitis"
    ],
    "preferred": [
      "Penicillin/amoxicillin là nền tảng cho viêm họng GAS nếu không dị ứng.",
      "Nhiễm xâm lấn cần xử trí theo hội chứng/source control."
    ],
    "avoid": [
      "Không điều trị viêm họng do virus."
    ],
    "notes": [
      "Áp dụng IDSA GAS 2025 cho chẩn đoán chọn lọc."
    ],
    "sourceIds": [
      "GAS2025",
      "SSTI2014"
    ],
    "requiresBV199Validation": true
  }
];

export const pathogenGroups = [
  "Tất cả",
  ...Array.from(new Set(pathogenGuidance.map((item) => item.group))),
];

export const fullGuidelineMeta = {
  generatedFor: "BV199 Clinical Pharmacy",
  scope: "Adult infectious syndromes",
  totalSyndromes: allSyndromes.length,
  totalSources: guidelineSources.length,
  lastClinicalSourceReview: "2026-10-09",
  sourcePriority: [
    "Quy trình/phác đồ BV199 đã phê duyệt",
    "Antibiogram BV199 + AST người bệnh + CLSI đang áp dụng",
    "Tài liệu bệnh viện người dùng cung cấp",
    "Hướng dẫn Bộ Y tế",
    "Guideline quốc tế cập nhật",
  ],
  safety: "Clinical decision support only; requires BV199 approval before production use.",
};
