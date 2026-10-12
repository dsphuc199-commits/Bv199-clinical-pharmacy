import type {
  InfectionGuidance,
} from "./types";

export const pneumoniaGuidance:
  InfectionGuidance[] = [

  {
    id:
      "cap-non-severe",

    name:
      "Viêm phổi cộng đồng",

    site:
      "pneumonia",

    acquisition:
      "community",

    severity:
      "non-severe",

    suspectedOrganisms: [],

    riskFactors: [],

    empiricRegimens: [],

    monitoring: [],

    sourceIds: [],
  },

  {
    id:
      "hap",

    name:
      "Viêm phổi bệnh viện",

    site:
      "pneumonia",

    acquisition:
      "hospital",

    severity:
      "both",

    suspectedOrganisms: [],

    riskFactors: [],

    empiricRegimens: [],

    monitoring: [],

    sourceIds: [],
  },

];