import type {
  HospitalDrug,
} from "@/lib/types/antibiotics";

export const hospitalDrugs:
  HospitalDrug[] = [

  {
    id: "tobradex",

    genericName:
      "Tobramycin + Dexamethasone",

    brandName:
      "TobraDex",

    strength:
      "",

    dosageForm:
      "Thuốc nhỏ mắt",

    routes: [
      "Ophthalmic",
    ],

    isAntibiotic:
      true,

    isLASA:
      true,

    active:
      true,
  },

  {
    id: "tobrex",

    genericName:
      "Tobramycin",

    brandName:
      "Tobrex",

    strength:
      "",

    dosageForm:
      "Thuốc nhỏ mắt",

    routes: [
      "Ophthalmic",
    ],

    isAntibiotic:
      true,

    isLASA:
      true,

    active:
      true,
  },
];