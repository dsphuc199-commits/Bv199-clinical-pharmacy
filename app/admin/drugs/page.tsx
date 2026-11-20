import Link from "next/link";
import { currentAdmin } from "@/lib/auth/admin";
import { catalogProducts, drugMatches, getCatalogProduct, DRUG_FIELDS, DRUG_FIELD_KEYS, DRUG_FIELD_MAX_LENGTH } from "@/lib/drugs/catalog";
import { editableDrug, publishedRevision } from "@/lib/drugs/catalog-changes";
import { drugCatalogConfigured, readDrugCatalog } from "@/lib/drugs/catalog-store";
import { DrugDraftActions, DrugEditor } from "./DrugEditor";

const box = "rounded-2xl border border-slate-200 bg-white p-5";
const link = "font-semibold text-teal-800 hover:underline";
const pageSize = 24;
const required = new Set(["drugCode", "brandName", "ingredientName", "strength"]);
const inputs = DRUG_FIELD_KEYS.map((key) => ({ key, label: DRUG_FIELDS[key], required: required.has(key), maxLength: DRUG_FIELD_MAX_LENGTH }));
const date = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
const auditLabels = { saved: "Lưu bản nháp", approved: "Đã duyệt", discarded: "Bỏ bản nháp" };
const usageLabel = (active: boolean | null) => active === null ? "—" : active ? "Đang sử dụng" : "Ngừng sử dụng";

function href(params: Record<string, string>) {
  return `/admin/drugs?${new URLSearchParams(params)}`;
}

type Params = { q?: string; page?: string; edit?: string; add?: string };

export default async function AdminDrugsPage({ searchParams }: { searchParams: Promise<Params> }) {
  if (!await currentAdmin()) return null;
  const params = await searchParams;
  const configured = drugCatalogConfigured();
  const snapshot = configured ? await readDrugCatalog().catch(() => null) : null;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";
  const edit = typeof params.edit === "string" ? params.edit : "";
  const title = (
    <header className="grid gap-3">
      <Link href="/admin" className={link}>← Quản trị hệ thống</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-slate-900">Quản trị danh mục thuốc</h1>
        <Link href="/drugs" className={link}>Xem danh mục tra cứu</Link>
      </div>
    </header>
  );

  if (!snapshot) return (
    <main className="mx-auto grid max-w-6xl gap-5 p-6">
      {title}
      <p role="status" className="rounded-lg bg-amber-50 p-4 text-amber-900">
        {configured ? "Chưa kết nối được kho danh mục thuốc." : "Chưa cấu hình kho danh mục thuốc."}
      </p>
    </main>
  );

  const catalog = snapshot.data;
  const published = edit ? editableDrug(catalog, edit) : undefined;
  const draft = catalog.drafts.find((item) => item.id === edit);
  const editor = draft ?? published;
  const baseRevision = edit ? publishedRevision(catalog, edit) : "";
  const stale = !!draft && draft.baseRevision !== baseRevision;
  const focusedDraft = draft?.revision ?? "";
  const changedFields = draft ? DRUG_FIELD_KEYS.filter((key) => (published?.fields[key] ?? "") !== draft.fields[key]) : [];
  const matching = catalogProducts(catalog.approved).filter((drug) => !query || drugMatches(drug, query));
  const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
  const parsedPage = typeof params.page === "string" ? Number.parseInt(params.page, 10) : 1;
  const page = Math.max(1, Math.min(pageCount, parsedPage || 1));
  const rows = matching.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="mx-auto grid max-w-6xl gap-5 p-6">
      {title}
      <section className={box}>
        <form action="/admin/drugs" className="flex flex-wrap items-end gap-3">
          <label className="grid min-w-48 flex-1 gap-1 text-sm font-semibold">
            Tìm thuốc
            <input name="q" defaultValue={query} maxLength={120} placeholder="Tên thuốc, hoạt chất hoặc mã thuốc" className="rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <button className="rounded-lg border border-slate-300 px-4 py-2 font-semibold">Tìm</button>
          <Link href={href({ add: "1", q: query })} className="rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white">Thêm thuốc</Link>
        </form>
      </section>

      {(params.add === "1" || editor) && (
        <section className={box}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{editor ? `Sửa ${editor.fields.brandName}` : "Thêm thuốc"}</h2>
            <div className="flex flex-wrap gap-3">
              {published && <Link href={`/drugs/${encodeURIComponent(edit)}`} className={link}>Xem bản đang hiển thị</Link>}
              <Link href={href({ q: query, page: String(page) })} className={link}>Đóng biểu mẫu</Link>
            </div>
          </div>
          <DrugEditor key={`${edit}:${focusedDraft}`} id={editor ? edit : ""} inputs={inputs} fields={editor?.fields}
            active={editor?.active ?? true} reason={draft?.reason ?? ""} baseRevision={editor ? baseRevision : ""} draftRevision={focusedDraft} />
        </section>
      )}
      {edit && !editor && <p role="status">Không tìm thấy thuốc hoặc bản nháp.</p>}

      {draft && (
        <section className={box}>
          <h2 className="text-lg font-bold">Kiểm tra bản nháp trước khi duyệt</h2>
          <p className="mt-2 text-sm text-slate-700">{draft.reason}</p>
          {stale && <p role="status" className="mt-2 text-sm text-amber-900">Danh mục đã thay đổi. Đối chiếu và lưu lại bản nháp trước khi duyệt.</p>}
          {published && getCatalogProduct(draft.id)?.registryMatches && !getCatalogProduct(draft.id, draft)?.registryMatches && (
            <p className="mt-2 text-sm text-amber-900">Thông tin nhận diện thuốc đã thay đổi. Số đăng ký và tờ hướng dẫn sử dụng sẽ cần đối chiếu lại.</p>
          )}
          <dl className="mt-3 grid gap-2 text-sm">
            {changedFields.map((key) => (
              <div key={key}>
                <dt className="font-semibold">{DRUG_FIELDS[key]}</dt>
                <dd>{published?.fields[key] || "—"} → {draft.fields[key] || "—"}</dd>
              </div>
            ))}
            {draft.active !== (published?.active ?? true) && (
              <div><dt className="font-semibold">Trạng thái sử dụng</dt><dd>{usageLabel(published?.active ?? null)} → {usageLabel(draft.active)}</dd></div>
            )}
          </dl>
          <DrugDraftActions id={draft.id} revision={draft.revision} stale={stale} />
        </section>
      )}

      <section className={box}>
        <h2 className="text-lg font-bold">Bản nháp chờ duyệt</h2>
        {catalog.drafts.length === 0 ? <p className="mt-2 text-sm text-slate-600">Chưa có bản nháp.</p> : (
          <ul className="mt-2 divide-y divide-slate-100">
            {catalog.drafts.map((item) => (
              <li key={item.id} className="flex flex-wrap justify-between gap-2 py-2">
                <span>{item.fields.brandName} · {item.fields.drugCode}</span>
                <Link href={href({ edit: item.id, q: query, page: String(page) })} className={link}>Mở bản nháp</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={box}>
        <h2 className="text-lg font-bold">Danh mục ({matching.length} thuốc)</h2>
        {rows.length === 0 ? <p className="mt-2 text-sm text-slate-600">Không tìm thấy thuốc phù hợp.</p> : (
          <ul className="mt-2 divide-y divide-slate-100">
            {rows.map((drug) => (
              <li key={drug.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-semibold">{drug.brandName} · {drug.strength}</p>
                  <p className="text-sm text-slate-600">{drug.drugCode} · {drug.ingredientName} · {usageLabel(drug.active)}</p>
                </div>
                <Link href={href({ edit: drug.id, q: query, page: String(page) })} className={link}>Sửa thuốc<span className="sr-only"> {drug.brandName}</span></Link>
              </li>
            ))}
          </ul>
        )}
        {pageCount > 1 && (
          <nav className="mt-4 flex flex-wrap gap-4 text-sm" aria-label="Trang danh mục">
            {page > 1 && <Link className={link} href={href({ q: query, page: String(page - 1) })}>Trang trước</Link>}
            <span>Trang {page} / {pageCount}</span>
            {page < pageCount && <Link className={link} href={href({ q: query, page: String(page + 1) })}>Trang sau</Link>}
          </nav>
        )}
      </section>

      <section className={box}>
        <h2 className="text-lg font-bold">Nhật ký danh mục thuốc</h2>
        {catalog.audit.length === 0 ? <p className="mt-2 text-sm text-slate-600">Chưa có thay đổi.</p> : (
          <ul className="mt-2 divide-y divide-slate-100">
            {catalog.audit.slice(0, 20).map((item) => (
              <li key={item.id} className="grid gap-1 py-2 text-sm">
                <strong>{auditLabels[item.action]} · {item.brandName}</strong>
                <span>{item.actor} · {date.format(new Date(item.timestamp))}</span>
                <span>{item.reason}</span>
                {(!!item.fields?.length || item.active) && (
                  <details>
                    <summary className={link}>Xem nội dung thay đổi</summary>
                    <ul className="mt-2 grid gap-1">
                      {item.fields?.map(({ key, before, after }) => <li key={key}><strong>{DRUG_FIELDS[key]}</strong> · {before || "—"} → {after || "—"}</li>)}
                      {item.active && <li><strong>Trạng thái sử dụng</strong> · {usageLabel(item.active.before)} → {usageLabel(item.active.after)}</li>}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
