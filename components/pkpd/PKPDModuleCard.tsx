import Link from "next/link";

import type {
  PKPDModule,
} from "@/lib/types/pkpd";

type Props = {
  module: PKPDModule;
};

export default function PKPDModuleCard({
  module,
}: Props) {
  return (
    <Link
      href={`/pkpd/learn/${module.slug}`}
      className="pkpd-module-card"
    >
      <div className="pkpd-module-icon">
        PK
      </div>

      <div className="pkpd-module-card-content">

        <span className="pkpd-module-category">
          {module.category}
        </span>

        <h3>
          {module.shortTitle}
        </h3>

        <p>
          {module.description}
        </p>

        <div className="pkpd-module-keywords">

          {module.keywords
            .slice(0, 5)
            .map((keyword) => (
              <span key={keyword}>
                {keyword}
              </span>
            ))}

        </div>

      </div>

      <span className="pkpd-module-arrow">
        →
      </span>
    </Link>
  );
}