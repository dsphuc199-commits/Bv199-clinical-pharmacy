/* =========================================================
   TYPES
========================================================= */

export type Susceptibility =
  | "S"
  | "I"
  | "R"
  | "NA";

export type AntibioticOption = {
  id: string;

  ingredientId: string;

  label: string;

  spectrumRank: number;

  route?: string;

  notes?: string[];
};

export type DeescalationRule = {
  id: string;

  organismId: string;

  organismName: string;

  gram?: string;

  infectionSites?: string[];

  currentTherapyKeywords: string[];

  preferredOptions: AntibioticOption[];

  retainBroadCoverageWhen?: string[];

  exclusions?: string[];

  source: {
    organization: string;

    title: string;

    year: number;

    url?: string;
  };
};

/* =========================================================
   ANTIBIOTIC MASTER FOR DE-ESCALATION
   spectrumRank:
   số càng lớn = phổ càng rộng
========================================================= */

export const deescalationAntibiotics: AntibioticOption[] = [
  {
    id: "meropenem",
    ingredientId: "meropenem",
    label: "Meropenem",
    spectrumRank: 10,
    route: "IV",
  },

  {
    id: "imipenem",
    ingredientId: "imipenem",
    label: "Imipenem/cilastatin",
    spectrumRank: 10,
    route: "IV",
  },

  {
    id: "piperacillin-tazobactam",
    ingredientId: "piperacillin-tazobactam",
    label: "Piperacillin/tazobactam",
    spectrumRank: 9,
    route: "IV",
  },

  {
    id: "cefepime",
    ingredientId: "cefepime",
    label: "Cefepime",
    spectrumRank: 8,
    route: "IV",
  },

  {
    id: "ceftazidime",
    ingredientId: "ceftazidime",
    label: "Ceftazidime",
    spectrumRank: 8,
    route: "IV",
  },

  {
    id: "ceftriaxone",
    ingredientId: "ceftriaxone",
    label: "Ceftriaxone",
    spectrumRank: 5,
    route: "IV",
  },

  {
    id: "cefotaxime",
    ingredientId: "cefotaxime",
    label: "Cefotaxime",
    spectrumRank: 5,
    route: "IV",
  },

  {
    id: "ampicillin-sulbactam",
    ingredientId: "ampicillin-sulbactam",
    label: "Ampicillin/sulbactam",
    spectrumRank: 5,
    route: "IV",
  },

  {
    id: "amoxicillin-clavulanate",
    ingredientId: "amoxicillin-clavulanate",
    label: "Amoxicillin/clavulanate",
    spectrumRank: 4,
    route: "PO/IV",
  },

  {
    id: "ampicillin",
    ingredientId: "ampicillin",
    label: "Ampicillin",
    spectrumRank: 3,
    route: "IV/PO",
  },

  {
    id: "amoxicillin",
    ingredientId: "amoxicillin",
    label: "Amoxicillin",
    spectrumRank: 3,
    route: "PO",
  },

  {
    id: "cefazolin",
    ingredientId: "cefazolin",
    label: "Cefazolin",
    spectrumRank: 3,
    route: "IV",
  },

  {
    id: "oxacillin",
    ingredientId: "oxacillin",
    label: "Oxacillin",
    spectrumRank: 3,
    route: "IV",
  },

  {
    id: "vancomycin",
    ingredientId: "vancomycin",
    label: "Vancomycin",
    spectrumRank: 7,
    route: "IV",
  },

  {
    id: "linezolid",
    ingredientId: "linezolid",
    label: "Linezolid",
    spectrumRank: 7,
    route: "IV/PO",
  },

  {
    id: "levofloxacin",
    ingredientId: "levofloxacin",
    label: "Levofloxacin",
    spectrumRank: 6,
    route: "IV/PO",
  },

  {
    id: "ciprofloxacin",
    ingredientId: "ciprofloxacin",
    label: "Ciprofloxacin",
    spectrumRank: 6,
    route: "IV/PO",
  },
];

/* =========================================================
   ORGANISMS
========================================================= */

export const deescalationOrganisms = [
  {
    id: "ecoli",
    name: "Escherichia coli",
  },

  {
    id: "klebsiella-pneumoniae",
    name: "Klebsiella pneumoniae",
  },

  {
    id: "pseudomonas-aeruginosa",
    name: "Pseudomonas aeruginosa",
  },

  {
    id: "mssa",
    name: "Staphylococcus aureus (MSSA)",
  },

  {
    id: "mrsa",
    name: "Staphylococcus aureus (MRSA)",
  },

  {
    id: "enterococcus-faecalis",
    name: "Enterococcus faecalis",
  },
];

/* =========================================================
   DE-ESCALATION RULES
========================================================= */

export const deescalationRules: DeescalationRule[] = [
  /* =======================================================
     E. COLI
  ======================================================= */

  {
    id: "ecoli-general",

    organismId: "ecoli",

    organismName: "Escherichia coli",

    gram: "Gram âm",

    infectionSites: [
      "Nhiễm khuẩn tiết niệu",
      "Nhiễm khuẩn huyết",
      "Nhiễm khuẩn ổ bụng",
    ],

    currentTherapyKeywords: [
      "meropenem",
      "imipenem",
      "piperacillin-tazobactam",
      "cefepime",
    ],

    preferredOptions: [
      {
        id: "ceftriaxone",
        ingredientId: "ceftriaxone",
        label: "Ceftriaxone",
        spectrumRank: 5,
        route: "IV",
      },

      {
        id: "cefotaxime",
        ingredientId: "cefotaxime",
        label: "Cefotaxime",
        spectrumRank: 5,
        route: "IV",
      },

      {
        id: "amoxicillin-clavulanate",
        ingredientId: "amoxicillin-clavulanate",
        label: "Amoxicillin/clavulanate",
        spectrumRank: 4,
        route: "PO/IV",
      },
    ],

    retainBroadCoverageWhen: [
      "Nghi ngờ hoặc xác định ESBL/CRE và không có lựa chọn hẹp hơn phù hợp",
      "Sốc nhiễm khuẩn hoặc huyết động chưa ổn định",
      "Chưa kiểm soát được ổ nhiễm",
      "Nhiễm đa vi khuẩn cần phổ rộng hơn",
    ],

    exclusions: [
      "Kháng sinh đồ chưa đầy đủ",
      "Kết quả vi sinh không phù hợp bệnh cảnh lâm sàng",
    ],

    source: {
      organization:
        "Antimicrobial Stewardship Program",

      title:
        "De-escalation framework – local implementation template",

      year:
        2026,
    },
  },

  /* =======================================================
     KLEBSIELLA
  ======================================================= */

  {
    id: "klebsiella-general",

    organismId: "klebsiella-pneumoniae",

    organismName:
      "Klebsiella pneumoniae",

    gram: "Gram âm",

    infectionSites: [
      "Nhiễm khuẩn tiết niệu",
      "Viêm phổi",
      "Nhiễm khuẩn huyết",
    ],

    currentTherapyKeywords: [
      "meropenem",
      "imipenem",
      "piperacillin-tazobactam",
      "cefepime",
    ],

    preferredOptions: [
      {
        id: "ceftriaxone",
        ingredientId: "ceftriaxone",
        label: "Ceftriaxone",
        spectrumRank: 5,
        route: "IV",
      },

      {
        id: "cefotaxime",
        ingredientId: "cefotaxime",
        label: "Cefotaxime",
        spectrumRank: 5,
        route: "IV",
      },
    ],

    retainBroadCoverageWhen: [
      "ESBL hoặc cơ chế đề kháng khiến cephalosporin thế hệ 3 không phù hợp",
      "CRE",
      "Sốc nhiễm khuẩn hoặc huyết động chưa ổn định",
      "Chưa kiểm soát ổ nhiễm",
    ],

    source: {
      organization:
        "Antimicrobial Stewardship Program",

      title:
        "De-escalation framework – local implementation template",

      year:
        2026,
    },
  },

  /* =======================================================
     PSEUDOMONAS
  ======================================================= */

  {
    id: "pseudomonas-general",

    organismId:
      "pseudomonas-aeruginosa",

    organismName:
      "Pseudomonas aeruginosa",

    gram: "Gram âm",

    infectionSites: [
      "Viêm phổi bệnh viện",
      "Nhiễm khuẩn huyết",
      "Nhiễm khuẩn tiết niệu phức tạp",
    ],

    currentTherapyKeywords: [
      "meropenem",
      "imipenem",
      "piperacillin-tazobactam",
      "cefepime",
      "ceftazidime",
    ],

    preferredOptions: [
      {
        id: "cefepime",
        ingredientId: "cefepime",
        label: "Cefepime",
        spectrumRank: 8,
        route: "IV",
      },

      {
        id: "ceftazidime",
        ingredientId: "ceftazidime",
        label: "Ceftazidime",
        spectrumRank: 8,
        route: "IV",
      },

      {
        id: "piperacillin-tazobactam",
        ingredientId:
          "piperacillin-tazobactam",
        label:
          "Piperacillin/tazobactam",
        spectrumRank: 9,
        route: "IV",
      },
    ],

    retainBroadCoverageWhen: [
      "Kháng sinh đồ chưa xác định được lựa chọn đơn trị phù hợp",
      "Nguy cơ kháng cao hoặc MDR/XDR",
      "Sốc nhiễm khuẩn",
      "Nhiễm khuẩn chưa kiểm soát",
    ],

    source: {
      organization:
        "Antimicrobial Stewardship Program",

      title:
        "Pseudomonas-directed de-escalation template",

      year:
        2026,
    },
  },

  /* =======================================================
     MSSA
  ======================================================= */

  {
    id: "mssa-general",

    organismId: "mssa",

    organismName:
      "Staphylococcus aureus (MSSA)",

    gram: "Gram dương",

    infectionSites: [
      "Nhiễm khuẩn huyết",
      "Nhiễm khuẩn da mô mềm",
    ],

    currentTherapyKeywords: [
      "vancomycin",
      "linezolid",
    ],

    preferredOptions: [
      {
        id: "oxacillin",
        ingredientId: "oxacillin",
        label: "Oxacillin",
        spectrumRank: 3,
        route: "IV",
      },

      {
        id: "cefazolin",
        ingredientId: "cefazolin",
        label: "Cefazolin",
        spectrumRank: 3,
        route: "IV",
      },
    ],

    retainBroadCoverageWhen: [
      "Chưa xác nhận MSSA",
      "Dị ứng beta-lactam nghiêm trọng cần đánh giá lựa chọn thay thế",
    ],

    source: {
      organization:
        "Antimicrobial Stewardship Program",

      title:
        "MSSA targeted therapy framework",

      year:
        2026,
    },
  },

  /* =======================================================
     MRSA
  ======================================================= */

  {
    id: "mrsa-general",

    organismId: "mrsa",

    organismName:
      "Staphylococcus aureus (MRSA)",

    gram: "Gram dương",

    currentTherapyKeywords: [
      "vancomycin",
      "linezolid",
    ],

    preferredOptions: [
      {
        id: "vancomycin",
        ingredientId: "vancomycin",
        label: "Vancomycin",
        spectrumRank: 7,
        route: "IV",
      },

      {
        id: "linezolid",
        ingredientId: "linezolid",
        label: "Linezolid",
        spectrumRank: 7,
        route: "IV/PO",
      },
    ],

    retainBroadCoverageWhen: [
      "MRSA đã được xác định",
      "Cần lựa chọn thuốc dựa trên vị trí nhiễm và đặc điểm người bệnh",
    ],

    source: {
      organization:
        "Antimicrobial Stewardship Program",

      title:
        "MRSA targeted therapy framework",

      year:
        2026,
    },
  },

  /* =======================================================
     ENTEROCOCCUS FAECALIS
  ======================================================= */

  {
    id: "enterococcus-faecalis-general",

    organismId:
      "enterococcus-faecalis",

    organismName:
      "Enterococcus faecalis",

    gram: "Gram dương",

    currentTherapyKeywords: [
      "vancomycin",
      "linezolid",
      "piperacillin-tazobactam",
    ],

    preferredOptions: [
      {
        id: "ampicillin",
        ingredientId: "ampicillin",
        label: "Ampicillin",
        spectrumRank: 3,
        route: "IV/PO",
      },
    ],

    retainBroadCoverageWhen: [
      "Kháng ampicillin",
      "Dị ứng beta-lactam nghiêm trọng",
      "Vị trí nhiễm hoặc bệnh cảnh cần phác đồ đặc biệt",
    ],

    source: {
      organization:
        "Antimicrobial Stewardship Program",

      title:
        "Enterococcus targeted therapy framework",

      year:
        2026,
    },
  },
];