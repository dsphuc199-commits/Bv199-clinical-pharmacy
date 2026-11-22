import Link from "next/link";
import { DISEASES } from "@/data/antibiotics/empiric/catalog";
import { currentAdmin } from "@/lib/auth/admin";
import { adminStorageConfigured } from "@/lib/admin/private-json-store";
import { readBiliaryHistory } from "@/lib/admin/biliary-protocol-store";
import { isCurrentDocument, readWatch } from "@/lib/admin/guideline-watch";
import { BILIARY_BASE_CONTENT, BILIARY_BASE_REVISION, BILIARY_DISEASE_ID, BILIARY_EDIT_GROUPS, biliaryChanges } from "@/lib/antibiotics/biliary-protocol";
import { ProtocolForm, ProtocolReview } from "./ProtocolForm";
import ProtocolPicker from "./ProtocolPicker";
import ProposalDetails from "../guideline-watch/ProposalDetails";

const box = "rounded-2xl border border-slate-200 bg-white p-5";
const link = "font-semibold text-teal-800 hover:underline";
const formatDate = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
const protocolDiseases = DISEASES.map(({ id, title, specialty }) => ({ id, title, specialty }));
const protocolById = new Map(protocolDiseases.map((disease) => [disease.id, disease]));

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

export default async function AdminProtocolsPage({ searchParams }: { searchParams: Promise<{ disease?: string | string[]; proposal?: string | string[] }> }) {
  if (!await currentAdmin()) return null;
  const { disease, proposal } = await searchParams;
  const selected = protocolById.get(typeof disease === "string" ? disease : disease === undefined ? BILIARY_DISEASE_ID : "");
  const pilot = selected?.id === BILIARY_DISEASE_ID;
  const header = (
    <>
      <header className="grid gap-3">
        <Link href="/admin" className={link}>← Quản trị hệ thống</Link>
        <h1 className="text-3xl font-bold text-slate-900">Quản trị phác đồ</h1>
      </header>
      <section className={box} aria-label="Chọn phác đồ">
        <ProtocolPicker key={selected?.id} diseases={protocolDiseases} currentId={selected?.id ?? ""} />
        {!selected && <p role="status" className="mt-3 text-sm text-amber-900">Không tìm thấy bệnh cảnh đã chọn. Hãy chọn lại trong danh sách.</p>}
      </section>
      {selected && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{selected.title}</h2>
            <p className="text-sm text-slate-600">{selected.specialty} · {pilot ? "Thí điểm soạn và duyệt" : "Tra cứu"}</p>
          </div>
          <Link href={`/antibiotics/empiric/guideline-v9?disease=${encodeURIComponent(selected.id)}${pilot ? "&tab=vn" : ""}`} className={link}>
            Mở phác đồ đang hiển thị
          </Link>
        </div>
      )}
    </>
  );
  if (!pilot) return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      {header}
      {selected && <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        Quy trình soạn và duyệt đang thí điểm ở Viêm đường mật cấp.{" "}
        <Link href="/admin/protocols?disease=v8-24" className={link}>Mở phần thí điểm</Link>
      </p>}
    </main>
  );

  const configured = adminStorageConfigured();
  const snapshot = configured ? await readBiliaryHistory().catch(() => null) : null;
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
  const watch = typeof proposal === "string" && /^[a-f0-9]{24}$/.test(proposal) ? await readWatch().catch(() => null) : null;
  const tracked = watch?.data.documents.find((entry) => entry.id === proposal && entry.topic === "biliary");
  const proposalIsStale = !!watch && tracked?.analysis?.status === "done" &&
    (tracked.analysis.proposal.basedOn !== currentRevision || !isCurrentDocument(watch.data, tracked.id));
  return (
    <main className="mx-auto grid max-w-5xl gap-5 p-6">
      {header}
      <Link className={link} href="/admin/guideline-watch">Mở hàng chờ cập nhật hướng dẫn</Link>
      <section className={box}>
        <h2 className="text-lg font-bold">Bản đang dùng</h2>
        <p className="mt-2 text-sm">
          {latest ? `Khoa Dược duyệt ${formatDate.format(new Date(latest.timestamp))}` : "Bản gốc theo Quyết định 708/QĐ-BYT"}
        </p>
        <p className="mt-1 text-sm text-slate-700">{current.source.title} · {current.source.locator}</p>
        <a className={`mt-2 inline-block ${link}`} href={current.source.url} target="_blank" rel="noreferrer">Mở tài liệu đối chiếu</a>
      </section>
      {tracked?.analysis?.status === "done" && (
        <section className={box} aria-label="Đề xuất AI chờ thẩm định">
          <h2 className="text-lg font-bold">Đề xuất AI · Chờ thẩm định</h2>
          <p className="mt-1 text-sm font-semibold text-slate-700">{tracked.title}</p>
          {proposalIsStale && <p role="status" className="mt-2 text-sm text-amber-900">Bản đang dùng hoặc tài liệu nguồn đã đổi. Rà soát lại trước khi sử dụng đề xuất.</p>}
          <ProposalDetails entry={tracked} />
          <nav aria-label="Dữ liệu BV199 để đối chiếu" className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/drugs" className={link}>Danh mục thuốc</Link>
            <Link href="/antibiotics/antibiogram" className={link}>Dữ liệu kháng sinh đồ BV199</Link>
          </nav>
        </section>
      )}
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
