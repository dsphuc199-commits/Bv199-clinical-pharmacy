import type { WatchEntry } from "@/lib/admin/guideline-watch";

export default function ProposalDetails({ entry }: { entry: WatchEntry }) {
  if (entry.analysis?.status !== "done") return null;
  const { findings } = entry.analysis.proposal;
  if (findings.length === 0) return <p className="text-sm text-slate-700">AI chưa xác định được điểm phù hợp để đề xuất sửa liều hoặc thời gian trong đợt thí điểm.</p>;
  return (
    <ul className="mt-2 divide-y divide-slate-200">
      {findings.map(({ label, before, value, population, grade, locator }, index) => (
        <li key={`${locator}-${index}`} className="grid gap-2 py-3 text-sm">
          <h4 className="font-semibold text-slate-900">{label}</h4>
          <dl className="grid gap-2 sm:grid-cols-2">
            {before && <div><dt className="font-semibold">BV199 đang dùng tại thời điểm rà soát</dt><dd>{before}</dd></div>}
            <div><dt className="font-semibold">Nguồn mới để đối chiếu</dt><dd>{value}</dd></div>
          </dl>
          <p className="text-slate-700">{population}{grade && ` · ${grade}`}</p>
          <a href={entry.pdfUrl ?? entry.url} target="_blank" rel="noreferrer" className="font-semibold text-teal-800 underline">{locator} · Mở tài liệu gốc</a>
        </li>
      ))}
    </ul>
  );
}
