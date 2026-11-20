import type { ReactNode } from "react";
import type { Citation } from "@/lib/antibiotics/source-citation";
import ClinicalSourceRows from "./ClinicalSourceRows";

export default function ClinicalSources({ sources, children }: { sources: readonly Citation[]; children?: ReactNode }) {
  if (sources.length === 0 && !children) return null;

  return (
    <details className="clinical-references">
      <summary>Tài liệu tham khảo</summary>
      <div className="clinical-references-content">
        <ClinicalSourceRows sources={sources} />
        {children}
      </div>
    </details>
  );
}
