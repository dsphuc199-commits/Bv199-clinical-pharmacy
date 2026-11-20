import Link from "next/link";
import { currentAdmin } from "@/lib/auth/admin";
import { adminStorageConfigured } from "@/lib/admin/private-json-store";
import { readBiliaryHistory } from "@/lib/admin/biliary-protocol-store";
import { BILIARY_BASE_CONTENT, BILIARY_BASE_REVISION, BILIARY_EDIT_GROUPS, biliaryChanges } from "@/lib/antibiotics/biliary-protocol";
import { ProtocolForm, ProtocolReview } from "./ProtocolForm";

const box = "rounded-2xl border border-slate-200 bg-white p-5";
const link = "font-semibold text-teal-800 hover:underline";
const formatDate = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

function Changes({ entries }: { entries: ReturnType<typeof biliaryChanges> }) {
  return (
    <ul className="mt-3 divide-y divide-slate-200 text-sm">
      {entries.map(({ label, before, after }) => (
        <li key={label} className="grid gap-2 py-3">
          <h3 className="font-semibold">{label}</h3>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div><dt className="font-semibold text-slate-600">Trước</dt><dd className="whitespace-pre-wrap break-words">{before}</dd></div>
            <div><dt className="font-semibold text-teal-800">Sau</dt><dd className="whitespace-pre-wrap break-words">{after}</dd></div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

export default async function AdminProtocolsPage() {
  if (!await currentAdmin()) return null;
  const configured = adminStorageConfigured();
  const snapshot = configured ? await readBiliaryHistory().catch(() => null) : null;
  const header = (
    <header className="grid gap-3">
      <Link href="/admin" className={link}>← Quản trị hệ thống</Link>
      <h1 className="text-3xl font-bold text-slate-900">Quản trị phác đồ</h1>
      <h2 className="text-xl font-semibold">Viêm đường mật cấp</h2>
      <Link href="/antibiotics/empiric/guideline-v9?disease=v8-24&tab=vn" className={link}>Mở phác đồ đang hiển thị</Link>
    </header>
  );
  if (!snapshot) return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      {header}
      <p role="status" className="rounded-lg bg-amber-50 p-4 text-amber-900">
        {configured ? "Chưa kết nối được kho phác đồ." : "Chưa cấu hình kho phác đồ."}
      </p>
    </main>
  );

  const { draft, releases } = snapshot.data;
  const latest = releases[0];
  const current = latest?.content ?? BILIARY_BASE_CONTENT;
  const currentRevision = latest?.revision ?? BILIARY_BASE_REVISION;
  const stale = !!draft && draft.basedOn !== currentRevision;
  return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      {header}
      <section className={box}>
        <h2 className="text-lg font-bold">Bản đang dùng</h2>
        <p className="mt-2 text-sm">
          {latest ? `Khoa Dược duyệt ${formatDate.format(new Date(latest.timestamp))}` : "Bản gốc theo Quyết định 708/QĐ-BYT"}
        </p>
        <p className="mt-1 text-sm text-slate-700">{current.source.title} · {current.source.locator}</p>
        <a className={`mt-2 inline-block ${link}`} href={current.source.url} target="_blank" rel="noreferrer">Mở tài liệu đối chiếu</a>
      </section>
      {draft && (
        <section className={box}>
          <h2 className="text-lg font-bold">So sánh bản nháp với bản đang dùng</h2>
          <p className="mt-2 text-sm text-slate-700">{draft.reason}</p>
          {stale && <p role="status" className="mt-2 text-sm text-amber-900">Bản đang dùng đã thay đổi. Đối chiếu và lưu lại bản nháp trước khi duyệt.</p>}
          <Changes entries={biliaryChanges(current, draft.content)} />
          <ProtocolReview key={draft.revision} revision={draft.revision} stale={stale} />
        </section>
      )}
      <section className={box}>
        <h2 className="mb-3 text-lg font-bold">{draft ? "Sửa bản nháp" : "Soạn bản nháp"}</h2>
        <p className="mb-4 text-sm text-slate-700">Chọn nhóm thuốc để sửa liều, đường dùng hoặc khoảng cách liều. Thời gian điều trị được nhập theo mức độ bệnh.</p>
        <ProtocolForm key={draft?.revision ?? currentRevision} content={draft?.content ?? current} basedOn={currentRevision}
          revision={draft?.revision ?? ""} reason={draft?.reason ?? ""} groups={BILIARY_EDIT_GROUPS} />
      </section>
      <section className={box}>
        <h2 className="text-lg font-bold">Lịch sử phát hành</h2>
        <ol className="mt-3 divide-y divide-slate-200">
          {releases.map((release, index) => (
            <li key={release.revision} className="py-3">
              <details>
                <summary className="cursor-pointer font-semibold">{formatDate.format(new Date(release.timestamp))} · {release.content.source.title}</summary>
                <p className="mt-2 text-sm">Soạn bởi {release.preparedBy} · Duyệt bởi {release.actor} · {release.reason}</p>
                <Changes entries={biliaryChanges(releases[index + 1]?.content ?? BILIARY_BASE_CONTENT, release.content)} />
              </details>
            </li>
          ))}
          <li className="py-3 text-sm">Bản gốc · {BILIARY_BASE_CONTENT.source.title} · {BILIARY_BASE_CONTENT.source.locator}</li>
        </ol>
      </section>
    </main>
  );
}
