import Link from "next/link";
import {
  notFound,
} from "next/navigation";

import PKPDModuleView from "@/components/pkpd/PKPDModuleView";

import {
  getPKPDModule,
  pkpdModules,
} from "@/data/pkpd";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return pkpdModules.map(
    (module) => ({
      slug: module.slug,
    })
  );
}

export default async function PKPDLearningPage({
  params,
}: Props) {

  const {
    slug,
  } = await params;

  const module =
    getPKPDModule(slug);

  if (!module) {
    notFound();
  }

  return (
    <div className="pkpd-detail-shell">

      <div className="pkpd-back-row">

        <Link
          href="/pkpd"
          className="pkpd-back-link"
        >
          ← Quay lại Học & tra cứu PK/PD
        </Link>

      </div>


      <PKPDModuleView
        module={module}
      />

    </div>
  );
}