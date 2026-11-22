import Link from "next/link";
import { headers } from "next/headers";
import { currentAdmin } from "@/lib/auth/admin";
import { adminStorageConfigured } from "@/lib/admin/private-json-store";
import { gatewayToken } from "@/lib/admin/guideline-watch-ai";
import { isCurrentDocument, readWatch, readyForReview } from "@/lib/admin/guideline-watch";
import { WATCH_SOURCES } from "@/lib/admin/guideline-watch-sources";
import WatchForm from "./WatchForm";
import ProposalDetails from "./ProposalDetails";

export const maxDuration = 120;

const box = "rounded-2xl border border-slate-200 bg-white p-4 sm:p-5";
const link = "font-semibold text-teal-800 underline underline-offset-2";
const formatDate = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });

export default async function GuidelineWatchPage() {
  if (!await currentAdmin()) return null;
  const configured = adminStorageConfigured();
  const snapshot = configured ? await readWatch().catch(() => null) : null;
  const state = snapshot?.data;
  const aiAvailable = Boolean(gatewayToken((await headers()).get("x-vercel-oidc-token")));

  return (
    <main className="mx-auto grid max-w-6xl gap-5 p-4 sm:p-6">
      <header className="grid gap-2">
        <Link href="/admin" className={link}>← Quản trị hệ thống</Link>
        <h1 className="text-3xl font-bold text-slate-900">Theo dõi cập nhật hướng dẫn</h1>
        <p className="max-w-3xl text-slate-700">Thí điểm đối chiếu kháng sinh trong viêm đường mật cấp và nhận diện văn bản thay thế về viêm phổi cộng đồng người lớn.</p>
      </header>

      <section className={box} aria-labelledby="watch-sources">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="watch-sources" className="text-lg font-bold">Nguồn đang theo dõi</h2>
            <p className="mt-1 text-sm text-slate-600">{process.env.CRON_SECRET ? "Đã cấu hình kiểm tra hằng ngày theo giờ Việt Nam." : "Chưa cấu hình lịch tự động."}{" "}
              {aiAvailable ? "Đã cấu hình AI Gateway cho tài liệu công khai. Khoa Dược thẩm định đề xuất trong app." : "Chưa kết nối AI Gateway."}</p>
          </div>
          {configured && <WatchForm label="Kiểm tra nguồn ngay" />}
        </div>
        {!state ? (
          <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-amber-900">{configured ? "Chưa đọc được kho rà soát." : "Chưa cấu hình kho rà soát."}</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {WATCH_SOURCES.map((source) => {
              const check = state.checks.find(({ sourceId }) => sourceId === source.id);
              return (
                <li key={source.id} className="min-w-0 rounded-lg border border-slate-200 p-3 text-sm">
                  <a className={link} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
                  <p className="mt-1 text-slate-600">{source.region} · {check ? formatDate.format(new Date(check.at)) : "Chưa kiểm tra"}</p>
                  {check?.status === "ok" && <p className="mt-1 text-teal-900">Đọc được nguồn · {check.active.length} mục khớp phạm vi</p>}
                  {check?.status === "failed" && <p className="mt-1 text-amber-900">{check.error}{check.lastSuccess && ` Lần đọc được gần nhất ${formatDate.format(new Date(check.lastSuccess))}.`}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {state && (
        <section className={box} aria-labelledby="watch-documents">
          <h2 id="watch-documents" className="text-lg font-bold">Hàng chờ đối chiếu</h2>
          {state.documents.length === 0 && <p className="mt-2 text-sm text-slate-700">Chưa ghi nhận tài liệu trong phạm vi theo dõi.</p>}
          <div className="mt-3 grid gap-3">
            {state.documents.map((entry) => {
              const current = isCurrentDocument(state, entry.id);
              const analysis = entry.analysis;
              return (
                <article key={entry.id} className="grid min-w-0 gap-2 rounded-xl border border-slate-200 p-3 sm:p-4">
                  <p className="text-xs font-semibold text-teal-800">{entry.topic === "biliary" ? "Viêm đường mật cấp" : "Viêm phổi cộng đồng người lớn"} · Ghi nhận {formatDate.format(new Date(entry.detectedAt))}</p>
                  <h3 className="break-words font-bold text-slate-900"><a href={entry.url} className={link} target="_blank" rel="noreferrer">{entry.title}</a></h3>
                  {entry.replacement && <p className="text-sm text-teal-900">{entry.replacement}</p>}
                  {entry.notice && <p className="text-sm font-semibold text-amber-900">{entry.notice === "withdrawal" ? "Thông báo thu hồi · Ưu tiên rà soát" : "Văn bản đính chính · Chờ đối chiếu"}</p>}
                  {!current && !entry.replacement && <p className="text-sm text-slate-600">Nguồn cần rà soát lại hoặc đã có phiên bản mới hơn trong hàng chờ.</p>}
                  {!entry.replacement && entry.fullText === "manual" && <p className="text-sm text-amber-900">Chờ xác minh toàn văn. Mở tài liệu gốc để đối chiếu.</p>}
                  {analysis?.status === "running" && <p className="text-sm text-slate-600">Đang xử lý hoặc chờ tải lại trạng thái.</p>}
                  {analysis?.status === "failed" && <p className="text-sm text-amber-900">{analysis.message}</p>}
                  {analysis?.status === "done" && (
                    <details className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <summary className="cursor-pointer font-semibold text-amber-950">Đề xuất AI · Chờ thẩm định</summary>
                      <ProposalDetails entry={entry} />
                      <Link className={`mt-2 inline-block ${link}`} href={`/admin/protocols?disease=v8-24&proposal=${entry.id}`}>Đối chiếu trong quản trị phác đồ</Link>
                    </details>
                  )}
                  {aiAvailable && current && readyForReview(entry) && <WatchForm documentId={entry.id} label={analysis ? "Đối chiếu lại bằng AI" : "Soạn đề xuất AI"} />}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
