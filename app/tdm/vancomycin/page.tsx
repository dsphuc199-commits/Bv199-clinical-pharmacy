import TdmDrugPage from "@/components/tdm/TdmDrugPage";

import {
  getTdmModule,
} from "@/data/tdm/tdm-modules";

export default function VancomycinPage() {
  const module =
    getTdmModule(
      "vancomycin"
    );

  if (!module) {
    return null;
  }

  return (
    <TdmDrugPage
      module={
        module
      }
    />
  );
}