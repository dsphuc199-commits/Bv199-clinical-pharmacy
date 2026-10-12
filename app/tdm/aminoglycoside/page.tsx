import TdmDrugPage from "@/components/tdm/TdmDrugPage";

import {
  getTdmModule,
} from "@/data/tdm/tdm-modules";

export default function AminoglycosidePage() {
  const module =
    getTdmModule(
      "aminoglycoside"
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