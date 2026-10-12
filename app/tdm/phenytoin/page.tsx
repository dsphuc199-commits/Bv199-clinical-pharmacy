import TdmDrugPage from "@/components/tdm/TdmDrugPage";

import {
  getTdmModule,
} from "@/data/tdm/tdm-modules";

export default function PhenytoinPage() {
  const module =
    getTdmModule(
      "phenytoin"
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