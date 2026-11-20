import Link from "next/link";
import { DISEASES } from "@/data/antibiotics/empiric/catalog";
import type { EvidenceFields } from "@/lib/admin/guideline-library";

const diseaseTitles = new Map(DISEASES.map(({ id, title }) => [id, title]));
const localDate = (date: string) => date.split("-").reverse().join("/");

export default function EvidenceDetails({ fields }: { fields: EvidenceFields }) {
  const disease = diseaseTitles.get(fields.diseaseId);
  return (
    <div className="grid gap-2 text-sm text-slate-700">
      <p>{[fields.issuer, fields.version].filter(Boolean).join(" · ")}</p>
      {(fields.issuedOn || fields.effectiveOn) && <p>{[
        fields.issuedOn && `Ban hành ${localDate(fields.issuedOn)}`,
        fields.effectiveOn && `Hiệu lực ${localDate(fields.effectiveOn)}`,
      ].filter(Boolean).join(" · ")}</p>}
      <p>{fields.scope}</p>
      <div className="flex flex-wrap gap-3">
        <a href={fields.url} target="_blank" rel="noreferrer" className="font-semibold text-teal-800 hover:underline">Mở tài liệu gốc</a>
        {disease && <Link href={`/antibiotics/empiric/guideline-v9?disease=${encodeURIComponent(fields.diseaseId)}`} className="font-semibold text-teal-800 hover:underline">
          Xem {disease}
        </Link>}
      </div>
    </div>
  );
}
