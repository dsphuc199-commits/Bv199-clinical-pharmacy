import TdmDrugPage from "@/components/tdm/TdmDrugPage";

import {
  getTdmModule,
} from "@/data/tdm/tdm-modules";

export default function ColistinPage() {
  const module =
    getTdmModule(
      "colistin"
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