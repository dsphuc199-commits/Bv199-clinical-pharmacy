/* =========================================================
   NGUỒN 2
   BÁO CÁO KKS BV199
========================================================= */

export type ReportCell =
  | {
      type: "percent";
      value: number;
    }
  | {
      type: "intrinsic";
    }
  | {
      type: "na";
    };

export type ReportRow = {
  id: string;

  block:
    | "HSCC"
    | "Khối nội"
    | "Khối ngoại";

  organismId: string;

  organismName: string;

  isolates: number;

  panel:
    | "gram-negative"
    | "gram-positive";

  results: Record<
    string,
    ReportCell
  >;
};

/* =========================================================
   HÀM VIẾT TẮT
========================================================= */

const P = (
  value: number
): ReportCell => ({
  type: "percent",
  value,
});

const IR = (): ReportCell => ({
  type: "intrinsic",
});

const NA = (): ReportCell => ({
  type: "na",
});

/* =========================================================
   PANEL GRAM ÂM
========================================================= */

export const gramNegativePanel = [
  {
    id: "amikacin",
    name: "Amikacin",
  },

  {
    id: "gentamicin",
    name: "Gentamicin",
  },

  {
    id: "tobramycin",
    name: "Tobramycin",
  },

  {
    id: "ampicillin",
    name: "Ampicillin",
  },

  {
    id: "amoxicillin-clavulanate",
    name: "Amoxicillin/clavulanate",
  },

  {
    id: "ampicillin-sulbactam",
    name: "Ampicillin/sulbactam",
  },

  {
    id: "piperacillin-tazobactam",
    name: "Piperacillin/tazobactam",
  },

  {
    id: "cefazolin",
    name: "Cefazolin",
  },

  {
    id: "cefepime",
    name: "Cefepime",
  },

  {
    id: "cefoxitin",
    name: "Cefoxitin",
  },

  {
    id: "ceftazidime",
    name: "Ceftazidime",
  },

  {
    id: "cefotaxime",
    name: "Cefotaxime",
  },

  {
    id: "cefuroxime",
    name: "Cefuroxime",
  },

  {
    id: "imipenem",
    name: "Imipenem",
  },

  {
    id: "meropenem",
    name: "Meropenem",
  },

  {
    id: "ciprofloxacin",
    name: "Ciprofloxacin",
  },

  {
    id: "levofloxacin",
    name: "Levofloxacin",
  },

  {
    id: "trimethoprim-sulfamethoxazole",
    name: "Sulfamethoxazole/trimethoprim",
  },

  {
    id: "tetracycline",
    name: "Tetracycline",
  },
];

/* =========================================================
   PANEL GRAM DƯƠNG
========================================================= */

export const gramPositivePanel = [
  {
    id: "penicillin",
    name: "Penicillin",
  },

  {
    id: "ampicillin",
    name: "Ampicillin",
  },

  {
    id: "amoxicillin-clavulanate",
    name: "Amoxicillin/clavulanate",
  },

  {
    id: "ampicillin-sulbactam",
    name: "Ampicillin/sulbactam",
  },

  {
    id: "piperacillin-tazobactam",
    name: "Piperacillin/tazobactam",
  },

  {
    id: "cefoxitin",
    name: "Cefoxitin",
  },

  {
    id: "ceftazidime",
    name: "Ceftazidime",
  },

  {
    id: "cefotaxime",
    name: "Cefotaxime",
  },

  {
    id: "cefuroxime",
    name: "Cefuroxime",
  },

  {
    id: "cefepime",
    name: "Cefepime",
  },

  {
    id: "imipenem",
    name: "Imipenem",
  },

  {
    id: "meropenem",
    name: "Meropenem",
  },

  {
    id: "trimethoprim-sulfamethoxazole",
    name: "Sulfamethoxazole/trimethoprim",
  },

  {
    id: "erythromycin",
    name: "Erythromycin",
  },

  {
    id: "clindamycin",
    name: "Clindamycin",
  },

  {
    id: "tetracycline",
    name: "Tetracycline",
  },

  {
    id: "doxycycline",
    name: "Doxycycline",
  },

  {
    id: "linezolid",
    name: "Linezolid",
  },
];

/* =========================================================
   DỮ LIỆU BÁO CÁO
========================================================= */

export const reportRows:
  ReportRow[] = [

    /* =====================================================
       HSCC
    ===================================================== */

    {
      id: "hscc-a-baumannii",

      block: "HSCC",

      organismId:
        "acinetobacter-baumannii",

      organismName:
        "Acinetobacter baumannii",

      isolates: 12,

      panel: "gram-negative",

      results: {
        amikacin: P(8),

        gentamicin: P(18),

        tobramycin: P(20),

        ampicillin: IR(),

        "amoxicillin-clavulanate":
          IR(),

        "ampicillin-sulbactam":
          P(50),

        "piperacillin-tazobactam":
          P(25),

        cefazolin: NA(),

        cefepime: P(17),

        cefoxitin: NA(),

        ceftazidime: P(18),

        cefotaxime: NA(),

        cefuroxime: NA(),

        imipenem: P(25),

        meropenem: P(27),

        ciprofloxacin: P(25),

        levofloxacin: P(33),

        "trimethoprim-sulfamethoxazole":
          P(27),

        tetracycline: NA(),
      },
    },

    {
      id: "hscc-klebsiella",

      block: "HSCC",

      organismId:
        "klebsiella-spp",

      organismName:
        "Klebsiella spp.",

      isolates: 11,

      panel: "gram-negative",

      results: {
        amikacin: P(22),

        gentamicin: P(13),

        tobramycin: P(0),

        ampicillin: NA(),

        "amoxicillin-clavulanate":
          P(13),

        "ampicillin-sulbactam":
          P(13),

        "piperacillin-tazobactam":
          P(22),

        cefazolin: P(13),

        cefepime: P(18),

        cefoxitin: P(25),

        ceftazidime: P(0),

        cefotaxime: P(20),

        cefuroxime: P(36),

        imipenem: P(33),

        meropenem: P(18),

        ciprofloxacin: P(20),

        levofloxacin: P(56),

        "trimethoprim-sulfamethoxazole":
          P(20),

        tetracycline: NA(),
      },
    },

    {
      id: "hscc-pseudomonas",

      block: "HSCC",

      organismId:
        "pseudomonas-aeruginosa",

      organismName:
        "Pseudomonas aeruginosa",

      isolates: 23,

      panel: "gram-negative",

      results: {
        amikacin: NA(),

        gentamicin: NA(),

        tobramycin: P(36),

        ampicillin: IR(),

        "amoxicillin-clavulanate":
          IR(),

        "ampicillin-sulbactam":
          IR(),

        "piperacillin-tazobactam":
          P(76),

        cefazolin: NA(),

        cefepime: P(50),

        cefoxitin: NA(),

        ceftazidime: P(57),

        cefotaxime: IR(),

        cefuroxime: NA(),

        imipenem: P(43),

        meropenem: P(52),

        ciprofloxacin: P(32),

        levofloxacin: P(17),

        "trimethoprim-sulfamethoxazole":
          IR(),

        tetracycline: IR(),
      },
    },

    /* =====================================================
       KHỐI NỘI
    ===================================================== */

    {
      id: "noi-a-baumannii",

      block: "Khối nội",

      organismId:
        "acinetobacter-baumannii",

      organismName:
        "Acinetobacter baumannii",

      isolates: 10,

      panel: "gram-negative",

      results: {
        amikacin: P(70),

        gentamicin: P(67),

        tobramycin: P(70),

        ampicillin: IR(),

        "amoxicillin-clavulanate":
          IR(),

        "ampicillin-sulbactam":
          P(86),

        "piperacillin-tazobactam":
          P(67),

        cefazolin: NA(),

        cefepime: P(70),

        cefoxitin: NA(),

        ceftazidime: P(67),

        cefotaxime: NA(),

        cefuroxime: NA(),

        imipenem: P(70),

        meropenem: P(70),

        ciprofloxacin: P(60),

        levofloxacin: P(70),

        "trimethoprim-sulfamethoxazole":
          P(67),

        tetracycline: NA(),
      },
    },

    {
      id: "noi-e-coli",

      block: "Khối nội",

      organismId:
        "escherichia-coli",

      organismName:
        "Escherichia coli",

      isolates: 21,

      panel: "gram-negative",

      results: {
        amikacin: P(43),

        gentamicin: P(67),

        tobramycin: P(62),

        ampicillin: P(11),

        "amoxicillin-clavulanate":
          P(24),

        "ampicillin-sulbactam":
          P(57),

        "piperacillin-tazobactam":
          P(86),

        cefazolin: P(27),

        cefepime: P(70),

        cefoxitin: P(50),

        ceftazidime: NA(),

        cefotaxime: P(74),

        cefuroxime: P(40),

        imipenem: P(95),

        meropenem: P(100),

        ciprofloxacin: P(19),

        levofloxacin: P(29),

        "trimethoprim-sulfamethoxazole":
          P(42),

        tetracycline: P(52),
      },
    },

    {
      id: "noi-klebsiella",

      block: "Khối nội",

      organismId:
        "klebsiella-spp",

      organismName:
        "Klebsiella spp.",

      isolates: 26,

      panel: "gram-negative",

      results: {
        amikacin: P(44),

        gentamicin: P(80),

        tobramycin: P(65),

        ampicillin: P(0),

        "amoxicillin-clavulanate":
          P(38),

        "ampicillin-sulbactam":
          P(56),

        "piperacillin-tazobactam":
          P(54),

        cefazolin: P(29),

        cefepime: P(60),

        cefoxitin: P(53),

        ceftazidime: NA(),

        cefotaxime: P(58),

        cefuroxime: P(52),

        imipenem: P(73),

        meropenem: P(62),

        ciprofloxacin: P(46),

        levofloxacin: P(62),

        "trimethoprim-sulfamethoxazole":
          P(69),

        tetracycline: P(73),
      },
    },

    {
      id: "noi-pseudomonas",

      block: "Khối nội",

      organismId:
        "pseudomonas-aeruginosa",

      organismName:
        "Pseudomonas aeruginosa",

      isolates: 15,

      panel: "gram-negative",

      results: {
        amikacin: NA(),

        gentamicin: NA(),

        tobramycin: P(69),

        ampicillin: IR(),

        "amoxicillin-clavulanate":
          IR(),

        "ampicillin-sulbactam":
          IR(),

        "piperacillin-tazobactam":
          P(73),

        cefazolin: NA(),

        cefepime: P(60),

        cefoxitin: NA(),

        ceftazidime: P(71),

        cefotaxime: IR(),

        cefuroxime: NA(),

        imipenem: P(60),

        meropenem: P(67),

        ciprofloxacin: P(64),

        levofloxacin: P(57),

        "trimethoprim-sulfamethoxazole":
          IR(),

        tetracycline: IR(),
      },
    },

    /* =====================================================
       KHỐI NGOẠI
    ===================================================== */

    {
      id: "ngoai-e-coli",

      block: "Khối ngoại",

      organismId:
        "escherichia-coli",

      organismName:
        "Escherichia coli",

      isolates: 25,

      panel: "gram-negative",

      results: {
        amikacin: P(54),

        gentamicin: P(50),

        tobramycin: P(48),

        ampicillin: P(4),

        "amoxicillin-clavulanate":
          P(35),

        "ampicillin-sulbactam":
          P(54),

        "piperacillin-tazobactam":
          P(88),

        cefazolin: P(37),

        cefepime: P(63),

        cefoxitin: P(68),

        ceftazidime: NA(),

        cefotaxime: P(48),

        cefuroxime: P(50),

        imipenem: P(96),

        meropenem: P(92),

        ciprofloxacin: P(29),

        levofloxacin: P(44),

        "trimethoprim-sulfamethoxazole":
          P(52),

        tetracycline: P(46),
      },
    },

    {
      id: "ngoai-klebsiella",

      block: "Khối ngoại",

      organismId:
        "klebsiella-spp",

      organismName:
        "Klebsiella spp.",

      isolates: 20,

      panel: "gram-negative",

      results: {
        amikacin: P(35),

        gentamicin: P(37),

        tobramycin: P(20),

        ampicillin: P(8),

        "amoxicillin-clavulanate":
          P(36),

        "ampicillin-sulbactam":
          P(44),

        "piperacillin-tazobactam":
          P(45),

        cefazolin: P(11),

        cefepime: P(25),

        cefoxitin: P(39),

        ceftazidime: NA(),

        cefotaxime: P(25),

        cefuroxime: P(15),

        imipenem: P(58),

        meropenem: P(47),

        ciprofloxacin: P(21),

        levofloxacin: P(25),

        "trimethoprim-sulfamethoxazole":
          P(56),

        tetracycline: P(45),
      },
    },

    {
      id: "ngoai-pseudomonas",

      block: "Khối ngoại",

      organismId:
        "pseudomonas-aeruginosa",

      organismName:
        "Pseudomonas aeruginosa",

      isolates: 7,

      panel: "gram-negative",

      results: {
        amikacin: NA(),

        gentamicin: NA(),

        tobramycin: P(100),

        ampicillin: IR(),

        "amoxicillin-clavulanate":
          IR(),

        "ampicillin-sulbactam":
          IR(),

        "piperacillin-tazobactam":
          P(100),

        cefazolin: NA(),

        cefepime: P(86),

        cefoxitin: NA(),

        ceftazidime: P(100),

        cefotaxime: IR(),

        cefuroxime: NA(),

        imipenem: P(100),

        meropenem: P(71),

        ciprofloxacin: P(100),

        levofloxacin: P(86),

        "trimethoprim-sulfamethoxazole":
          IR(),

        tetracycline: IR(),
      },
    },

    /* =====================================================
       STAPHYLOCOCCUS
    ===================================================== */

    {
      id: "noi-staphylococcus",

      block: "Khối nội",

      organismId:
        "staphylococcus-spp",

      organismName:
        "Staphylococcus spp.",

      isolates: 16,

      panel: "gram-positive",

      results: {
        penicillin: P(7),

        ampicillin: P(44),

        "amoxicillin-clavulanate":
          P(44),

        "ampicillin-sulbactam":
          P(44),

        "piperacillin-tazobactam":
          P(44),

        cefoxitin: P(44),

        ceftazidime: P(44),

        cefotaxime: P(44),

        cefuroxime: P(44),

        cefepime: P(44),

        imipenem: P(44),

        meropenem: P(44),

        "trimethoprim-sulfamethoxazole":
          P(71),

        erythromycin: P(19),

        clindamycin: P(13),

        tetracycline: P(56),

        doxycycline: P(85),

        linezolid: P(100),
      },
    },

    {
      id: "ngoai-staphylococcus",

      block: "Khối ngoại",

      organismId:
        "staphylococcus-spp",

      organismName:
        "Staphylococcus spp.",

      isolates: 37,

      panel: "gram-positive",

      results: {
        penicillin: P(11),

        ampicillin: P(36),

        "amoxicillin-clavulanate":
          P(36),

        "ampicillin-sulbactam":
          P(36),

        "piperacillin-tazobactam":
          P(36),

        cefoxitin: P(36),

        ceftazidime: P(36),

        cefotaxime: P(36),

        cefuroxime: P(36),

        cefepime: P(36),

        imipenem: P(36),

        meropenem: P(36),

        "trimethoprim-sulfamethoxazole":
          P(89),

        erythromycin: P(32),

        clindamycin: P(43),

        tetracycline: P(50),

        doxycycline: P(76),

        linezolid: P(100),
      },
    },
  ];