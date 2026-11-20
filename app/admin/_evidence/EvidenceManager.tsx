import Link from "next/link";
import EvidenceDetails from "@/components/antibiotics/EvidenceDetails";
import { DISEASES } from "@/data/antibiotics/empiric/catalog";
import { currentAdmin } from "@/lib/auth/admin";
import { EVIDENCE_LABELS, evidenceLibraryConfigured, latestEvidenceRecords, readEvidenceLibrary, type EvidenceKind } from "@/lib/admin/guideline-library";
import { EvidenceForm, EvidenceReview } from "./EvidenceForm";

const box = "rounded-2xl border border-slate-200 bg-white p-5";
const link = "font-semibold text-teal-800 hover:underline";
const diseases = DISEASES.map(({ id, title }) => ({ id, title })).sort((left, right) => left.title.localeCompare(right.title, "vi"));
const formatDate = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
const events = { saved: "Lưu bản nháp", published: "Đã duyệt", discarded: "Bỏ bản nháp" };

export type EvidenceSearch = { q?: string; add?: string; edit?: string };

function href(kind: EvidenceKind, params: Record<string, string>) {
  return `/admin/${kind}?${new URLSearchParams(params)}`;
}

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

export default async function EvidenceManager({ kind, searchParams }: { kind: EvidenceKind; searchParams: Promise<EvidenceSearch> }) {
  if (!await currentAdmin()) return null;
  const params = await searchParams;
  const configured = evidenceLibraryConfigured();
  const snapshot = configured ? await readEvidenceLibrary().catch(() => null) : null;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 150) : "";
  const edit = typeof params.edit === "string" ? params.edit : "";
  const companion = kind === "references" ? "guidelines" : "references";
  const header = (
    <header className="grid gap-3">
      <Link href="/admin" className={link}>← Quản trị hệ thống</Link>
      <h1 className="text-3xl font-bold text-slate-900">{EVIDENCE_LABELS[kind]}</h1>
      <div className="flex flex-wrap gap-4">
        <Link href={`/admin/${companion}`} className={link}>{EVIDENCE_LABELS[companion]}</Link>
        <Link href="/antibiotics/empiric/sources/approved" className={link}>Thư viện đã duyệt</Link>
      </div>
    </header>
  );

  if (!snapshot) return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      {header}
      <p role="status" className="rounded-lg bg-amber-50 p-4 text-amber-900">
        {configured ? "Chưa kết nối được kho tài liệu." : "Chưa cấu hình kho tài liệu."}
      </p>
    </main>
  );

  const drafts = snapshot.data.drafts.filter((record) => record.kind === kind);
  const releases = snapshot.data.releases.filter((record) => record.kind === kind);
  const draft = drafts.find((record) => record.id === edit);
  const previous = releases.find((record) => record.id === edit);
  const selected = draft ?? previous;
  const baseRevision = previous?.revision ?? "";
  const stale = !!draft && draft.basedOn !== baseRevision;
  const term = normalize(q);
  const records = latestEvidenceRecords(releases).filter(({ fields }) =>
    normalize([fields.title, fields.issuer, fields.version, fields.scope].join(" ")).includes(term)
  );
  const audit = snapshot.data.audit.filter((event) => event.kind === kind).slice(0, 20);

  return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      {header}
      <section className={box}>
        <form action={`/admin/${kind}`} className="flex flex-wrap items-end gap-3">
          <label className="grid min-w-48 flex-1 gap-1 text-sm font-semibold">
            Tìm tài liệu
            <input name="q" defaultValue={q} maxLength={150} placeholder="Tên tài liệu, tổ chức hoặc phiên bản" className="rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <button className="rounded-lg border border-slate-300 px-4 py-2 font-semibold">Tìm</button>
          <Link href={href(kind, { add: "1", q })} className="rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white">
            {kind === "guidelines" ? "Thêm phiên bản" : "Thêm tài liệu"}
          </Link>
        </form>
      </section>

      {(params.add === "1" || selected) && (
        <section className={box}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold">{selected ? `Sửa ${selected.fields.title}` : kind === "guidelines" ? "Thêm phiên bản" : "Thêm tài liệu"}</h2>
            <Link href={href(kind, { q })} className={link}>Đóng biểu mẫu</Link>
          </div>
          <EvidenceForm key={selected?.revision ?? "new"} kind={kind} id={selected?.id ?? ""} fields={selected?.fields}
            reason={draft?.reason} basedOn={baseRevision} draftRevision={draft?.revision ?? ""} diseases={diseases} />
        </section>
      )}
      {edit && !selected && <p role="status">Không tìm thấy tài liệu hoặc bản nháp.</p>}

      {draft && (
        <section className={box}>
          <h2 className="text-lg font-bold">Kiểm tra bản nháp</h2>
          {stale && <p role="status" className="mt-2 text-sm text-amber-900">Thông tin đã phát hành vừa thay đổi. Đối chiếu và lưu lại bản nháp trước khi duyệt.</p>}
          <div className={previous ? "mt-4 grid gap-4 md:grid-cols-2" : "mt-4"}>
            {previous && <div className="grid gap-2 rounded-xl bg-slate-50 p-4"><h3 className="font-semibold">Bản đã duyệt</h3><EvidenceDetails fields={previous.fields} /></div>}
            <div className="grid gap-2 rounded-xl bg-teal-50 p-4">
              <h3 className="font-semibold">{draft.fields.title}</h3>
              <EvidenceDetails fields={draft.fields} />
              <p className="text-sm">{draft.fields.visible ? "Hiển thị trong thư viện sau khi duyệt" : "Lưu trữ sau khi duyệt"}</p>
              <p className="text-sm">{draft.reason}</p>
            </div>
          </div>
          <EvidenceReview kind={kind} id={draft.id} revision={draft.revision} stale={stale} />
        </section>
      )}

      <section className={box}>
        <h2 className="text-lg font-bold">Bản nháp chờ duyệt</h2>
        {drafts.length === 0 ? <p className="mt-2 text-sm text-slate-600">Chưa có bản nháp.</p> : (
          <ul className="mt-2 divide-y divide-slate-100">
            {drafts.map((record) => <li key={record.id} className="flex flex-wrap justify-between gap-2 py-2">
              <span>{record.fields.title}{record.fields.version && ` · ${record.fields.version}`}</span>
              <Link href={href(kind, { edit: record.id, q })} className={link}>Mở bản nháp</Link>
            </li>)}
          </ul>
        )}
      </section>

      <section className={box}>
        <h2 className="text-lg font-bold">Danh mục đã duyệt</h2>
        {records.length === 0 ? <p className="mt-2 text-sm text-slate-600">{q ? "Không tìm thấy tài liệu phù hợp." : "Chưa có tài liệu được duyệt qua trang quản trị."}</p> : (
          <ul className="mt-2 divide-y divide-slate-100">
            {records.map((record) => <li key={record.id} className="grid gap-2 py-3">
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="font-semibold">{record.fields.title}</h3>
                <Link href={href(kind, { edit: record.id, q })} className={link}>Sửa<span className="sr-only"> {record.fields.title}</span></Link>
              </div>
              <EvidenceDetails fields={record.fields} />
              <p className="text-sm text-slate-600">{record.fields.visible ? "Đang hiển thị" : "Đã lưu trữ"}</p>
              {releases.some((older) => older.id === record.id && older.revision !== record.revision) && (
                <details>
                  <summary className={link}>Lịch sử phiên bản</summary>
                  <ol className="mt-2 grid gap-3">
                    {releases.filter((item) => item.id === record.id).map((item) => <li key={item.revision} className="grid gap-1 rounded-xl bg-slate-50 p-3 text-sm">
                      <strong>{item.fields.title} · {formatDate.format(new Date(item.timestamp))}</strong>
                      <span>{item.actor} · {item.reason}</span>
                      <EvidenceDetails fields={item.fields} />
                    </li>)}
                  </ol>
                </details>
              )}
            </li>)}
          </ul>
        )}
      </section>

      <section className={box}>
        <h2 className="text-lg font-bold">Nhật ký gần đây</h2>
        {audit.length === 0 ? <p className="mt-2 text-sm text-slate-600">Chưa có thay đổi.</p> : (
          <ol className="mt-2 divide-y divide-slate-100">
            {audit.map((event) => <li key={event.id} className="grid gap-1 py-2 text-sm">
              <strong>{events[event.action]} · {event.title}</strong>
              <span>{event.actor} · {formatDate.format(new Date(event.timestamp))}</span>
              <span>{event.reason}</span>
            </li>)}
          </ol>
        )}
      </section>
    </main>
  );
}
