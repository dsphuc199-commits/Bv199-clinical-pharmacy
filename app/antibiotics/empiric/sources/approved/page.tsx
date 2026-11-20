import Link from "next/link";
import EvidenceDetails from "@/components/antibiotics/EvidenceDetails";
import { EVIDENCE_LABELS, loadPublishedEvidence, recordKind } from "@/lib/admin/guideline-library";

export const dynamic = "force-dynamic";

export default async function ApprovedEvidencePage() {
  const records = await loadPublishedEvidence().catch(() => null);
  return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      <Link href="/antibiotics/empiric/sources" className="font-semibold text-teal-800">← Nguồn hướng dẫn gốc</Link>
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Thư viện tài liệu Khoa Dược</h1>
        <p className="mt-2 text-slate-700">Tài liệu đã duyệt để tra cứu và đối chiếu theo phạm vi ghi trên từng mục.</p>
      </header>
      {!records ? <p role="status">Tạm thời chưa tải được thư viện. Hãy tải lại trang.</p> :
        records.length === 0 ? <p>Chưa có tài liệu được phát hành qua trang quản trị.</p> :
        recordKind.options.map((kind) => {
          const group = records.filter((record) => record.kind === kind);
          if (group.length === 0) return null;
          return (
            <section className="grid gap-3" key={kind}>
              <h2 className="text-xl font-bold">{EVIDENCE_LABELS[kind]}</h2>
              <ul className="grid gap-3 md:grid-cols-2">
                {group.map(({ id, fields }) => <li key={id} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="font-bold">{fields.title}</h3>
                  <EvidenceDetails fields={fields} />
                </li>)}
              </ul>
            </section>
          );
        })
      }
    </main>
  );
}
