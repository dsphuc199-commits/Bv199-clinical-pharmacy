import Link from "next/link";
import { notFound } from "next/navigation";
import drugData from "@/data/drug-products.json";
import { clinicalMonographs } from "@/data/clinical-monographs";
import { DAV_LOOKUP_URL, REGISTRY_SYNCED_AT, STATUS_LABEL, formatDate, getRegistry, registryStatus, type RegistryStatus } from "@/lib/drugs/registry";
import { LEAFLET_SECTIONS, getLeaflet, getStoredFiles, getWebLeaflet } from "@/lib/drugs/leaflets";
import { formatLeaflet } from "@/lib/drugs/format-leaflet";
import LeafletSections from "@/components/drugs/LeafletSections";
import { ArrowLeft } from "lucide-react";

type DrugProduct = {
  id: string;
  drugCode: string;
  brandName: string;
  ingredientName: string;
  ingredientId: string;
  strength: string;
  route: string;
  dosageForm: string;
  packageSize: string;
  registrationNumber: string;
  manufacturer: string;
  country: string;
  unit: string;
  sourceSheet: string;
};

type Props = { params: Promise<{ id: string }> };

const STATUS_STYLE: Record<RegistryStatus, string> = {
  "con-hieu-luc": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "sap-het-han": "bg-amber-50 text-amber-900 border-amber-300",
  "cho-gia-han": "bg-amber-50 text-amber-900 border-amber-300",
  "het-han": "bg-red-50 text-red-800 border-red-200",
  "da-rut": "bg-red-100 text-red-900 border-red-300",
  "khong-tim-thay": "bg-slate-100 text-slate-700 border-slate-300",
  "chua-dong-bo": "bg-slate-100 text-slate-700 border-slate-300",
};

const METHOD_LABEL = { text: "đọc trực tiếp từ PDF", ocr: "nhận dạng chữ (OCR) từ bản scan", mixed: "đọc PDF kết hợp OCR", web: "trang web" } as const;

export default async function DrugDetailPage({ params }: Props) {
  const { id } = await params;
  const drug = (drugData as DrugProduct[]).find((item) => String(item.id) === decodeURIComponent(id));
  if (!drug) notFound();

  const monograph = clinicalMonographs[drug.ingredientId?.toLowerCase()] ?? null;
  const reg = getRegistry(drug.id);
  const status = registryStatus(drug.id);
  const leaflet = await getLeaflet(reg?.davId);
  const davOk = !!leaflet && !leaflet.failed;
  const stored = getStoredFiles(reg?.davId);
  // Khong co HDSD Cuc QLD trich duoc -> dung thong tin tu trang web khop so dang ky.
  const web = davOk ? null : await getWebLeaflet(drug.id);
  const shown = davOk ? leaflet : web;
  const sections = shown?.sections ?? {};
  const shownSections = LEAFLET_SECTIONS.filter((s) => sections[s.key]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/drugs"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-2 pl-3 pr-4 text-sm font-semibold text-[#0b3a5b] shadow-sm transition hover:border-[#087f89] hover:text-[#087f89] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#087f89]"
        >
          <ArrowLeft size={17} aria-hidden />
          Danh mục thuốc
        </Link>

        {/* Thong tin trong danh muc benh vien */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-blue-700">BỆNH VIỆN 199 - BỘ CÔNG AN</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{drug.brandName}</h1>
          <p className="mt-2 text-lg text-slate-600">{drug.ingredientName}</p>
          <span className={`mt-3 inline-block rounded-full border px-3 py-1 text-sm font-semibold ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field title="Mã thuốc" value={drug.drugCode} />
            <Field title="Hàm lượng" value={drug.strength} />
            <Field title="Đường dùng" value={drug.route} />
            <Field title="Dạng bào chế" value={drug.dosageForm} />
            <Field title="Quy cách đóng gói" value={drug.packageSize} />
            <Field title="Số đăng ký / GPNK" value={drug.registrationNumber} />
            <Field title="Nhà sản xuất" value={drug.manufacturer} />
            <Field title="Nước sản xuất" value={drug.country} />
          </div>
        </div>

        {/* Doi chieu Cong tra cuu Cuc Quan ly Duoc */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Thông tin đăng ký lưu hành (Cục Quản lý Dược)</h2>
          <p className="mt-1 text-sm text-slate-500">Đối chiếu theo số đăng ký trên Cổng tra cứu thuốc – Cục Quản lý Dược, cập nhật ngày {formatDate(REGISTRY_SYNCED_AT)}.</p>

          {status === "da-rut" && <Alert tone="red">Số đăng ký này <strong>đã bị rút</strong> theo Cục Quản lý Dược. Kiểm tra quyết định rút số đăng ký trước khi tiếp tục cung ứng, cấp phát.</Alert>}
          {status === "het-han" && <Alert tone="red">Số đăng ký đã <strong>hết hiệu lực</strong> theo dữ liệu Cục Quản lý Dược. Kiểm tra hồ sơ gia hạn hoặc quy định chuyển tiếp trước khi mua sắm, cấp phát.</Alert>}
          {status === "cho-gia-han" && reg && <Alert tone="amber">Số đăng ký đã hết hạn ngày {formatDate(reg.ngayHetHan)}; cơ sở đăng ký <strong>đã nộp hồ sơ gia hạn</strong>{reg.hoSoGiaHan ? ` (mã hồ sơ ${reg.hoSoGiaHan}` : ""}{reg.ngayNopGiaHan ? `${reg.hoSoGiaHan ? ", " : " ("}ngày nộp ${formatDate(reg.ngayNopGiaHan)})` : reg.hoSoGiaHan ? ")" : ""}. Đối chiếu quy định hiện hành về lưu hành thuốc trong thời gian chờ gia hạn khi mua sắm, cấp phát.</Alert>}
          {reg?.thayTheSdk && <Alert tone="slate">Số đăng ký trong danh mục bệnh viện (<strong>{reg.thayTheSdk}</strong>) đã được thay bằng số đăng ký mới <strong>{reg.soDangKy}</strong>. Thông tin dưới đây theo số đăng ký mới; cần cập nhật danh mục.</Alert>}
          {status === "sap-het-han" && <Alert tone="amber">Số đăng ký <strong>sắp hết hiệu lực</strong> (trong vòng 6 tháng). Theo dõi gia hạn khi lập kế hoạch mua sắm.</Alert>}
          {status === "khong-tim-thay" && <Alert tone="slate">Không tìm thấy số đăng ký “{drug.registrationNumber}” trên Cổng tra cứu. Có thể là thuốc nhập khẩu theo giấy phép (GPNK), số đăng ký đã đổi, hoặc nhập sai. Cần kiểm tra thủ công.</Alert>}

          {reg && (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field title="Tên thuốc" value={reg.tenThuoc} />
              <Field title="Số đăng ký" value={[reg.soDangKy, reg.soDangKyCu && `(cũ: ${reg.soDangKyCu})`].filter(Boolean).join(" ")} />
              <Field title="Hoạt chất – hàm lượng" value={reg.hamLuong || reg.hoatChat} />
              <Field title="Dạng bào chế" value={reg.dangBaoChe} />
              <Field title="Quy cách đóng gói" value={reg.dongGoi} />
              <Field title="Tiêu chuẩn – tuổi thọ" value={[reg.tieuChuan, reg.tuoiTho && `${reg.tuoiTho} tháng`].filter(Boolean).join(" – ")} />
              <Field title="Cơ sở sản xuất" value={[reg.coSoSanXuat, reg.nuocSanXuat].filter(Boolean).join(" – ")} />
              <Field title="Cơ sở đăng ký" value={reg.coSoDangKy} />
              <Field title="Ngày cấp – hết hạn SĐK" value={`${formatDate(reg.ngayCap)} – ${formatDate(reg.ngayHetHan)}`} />
              <Field title="Quyết định cấp" value={reg.soQuyetDinh} />
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {stored.map((f, i) => (
              <ExtLink key={f.href} href={f.href}>
                Xem Tờ HDSD{stored.length > 1 ? ` ${i + 1}` : ""} (PDF{f.pages ? `, ${f.pages} trang` : ""}{f.bytes ? `, ${(f.bytes / 1e6).toFixed(1)} MB` : ""})
              </ExtLink>
            ))}
            {!stored.length && reg?.hdsd.map((f, i) => (
              <ExtLink key={f.url} href={f.url} subtle={leaflet?.failed}>
                {leaflet?.failed ? "HDSD gốc (Cổng Cục QLD đang báo lỗi file)" : `Xem HDSD gốc${reg.hdsd.length > 1 ? ` ${i + 1}` : ""} trên Cổng Cục QLD`}
              </ExtLink>
            ))}
            {reg?.mauNhan.map((f, i) => <ExtLink key={f.url} href={f.url} subtle>Xem mẫu nhãn{reg.mauNhan.length > 1 ? ` ${i + 1}` : ""}</ExtLink>)}
            <ExtLink href={DAV_LOOKUP_URL} subtle>Tra cứu trên Cổng Cục QLD</ExtLink>
          </div>
          {stored.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Tờ HDSD là bản sao lưu trên hệ thống từ file công bố trên Cổng tra cứu thuốc – Cục Quản lý Dược{stored.some((f) => f.compressed) ? " (bản scan đã nén ảnh để mở nhanh trên điện thoại)" : ""}.{" "}
              {reg?.hdsd.map((f, i) => <a key={f.url} className="underline" href={f.url} target="_blank" rel="noreferrer">Bản gốc trên Cổng{reg.hdsd.length > 1 ? ` ${i + 1}` : ""}</a>)}
            </p>
          )}
        </section>

        {/* Noi dung tu To huong dan su dung */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Thông tin theo Tờ hướng dẫn sử dụng</h2>

          {!reg?.hdsd.length && (
            <p className="mt-2 text-slate-600">
              Cục Quản lý Dược chưa công bố Tờ hướng dẫn sử dụng cho số đăng ký này trên Cổng tra cứu.
              {!web && " Chưa tìm thấy trang thông tin thuốc nào khớp số đăng ký. Tham khảo HDSD kèm theo sản phẩm hoặc hồ sơ thầu."}
            </p>
          )}

          {reg && reg.hdsd.length > 0 && leaflet?.failed && (
            <p className="mt-2 text-slate-600">
              File HDSD trên Cổng Cục Quản lý Dược hiện không mở được (lỗi phía máy chủ của Cổng).
              {!web && " Chưa tìm thấy trang thông tin thuốc nào khớp số đăng ký. Dùng HDSD kèm sản phẩm."}
            </p>
          )}

          {reg && reg.hdsd.length > 0 && !leaflet && !web && <p className="mt-2 text-slate-600">Chưa trích nội dung. Xem bản gốc bằng nút “Xem HDSD gốc” ở trên.</p>}

          {shown && (
            <>
              {shown === leaflet ? (
                <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  <strong>CẦN THẨM ĐỊNH.</strong> Nội dung được trích tự động ({shown.method ? METHOD_LABEL[shown.method] : "tự động"}
                  {shown.confidence ? `, độ tin cậy nhận dạng ~${shown.confidence}%` : ""}) từ{" "}
                  <a className="font-semibold underline" href={stored[0]?.href ?? shown.source?.url} target="_blank" rel="noreferrer">{shown.source?.title || "Tờ hướng dẫn sử dụng"}</a>{" "}
                  công bố trên Cổng Cục Quản lý Dược. Có thể sai ký tự, sai số hoặc lệch bảng, đặc biệt ở liều dùng. <strong>Luôn đối chiếu bản gốc trước khi dùng cho quyết định điều trị.</strong>
                  {shown.totalPages && shown.pages && shown.totalPages > shown.pages ? ` Chỉ trích ${shown.pages}/${shown.totalPages} trang đầu.` : ""}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
                  <strong>CẦN THẨM ĐỊNH.</strong> Nguồn tham khảo:{" "}
                  <a className="font-semibold underline" href={shown.source?.url} target="_blank" rel="noreferrer">{siteDomain(shown.source?.url)}</a>
                </div>
              )}

              <LeafletSections
                sections={[
                  ...shownSections.map((s) => ({ key: s.key, title: s.title, open: s.open, blocks: formatLeaflet(sections[s.key]) })),
                  ...(shown.rawText ? [{ key: "rawText", title: "Toàn văn trích được", blocks: formatLeaflet(shown.rawText) }] : []),
                ]}
              />
            </>
          )}

          {monograph && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold">Chỉ định (chuyên luận đã thẩm định)</div>
              <div className="mt-1 text-sm text-slate-700">{monograph.indications}</div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* "https://www.thuocbietduoc.com.vn/..." -> "thuocbietduoc.com.vn" */
function siteDomain(url?: string): string {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "trang thông tin thuốc";
  } catch {
    return "trang thông tin thuốc";
  }
}

function Field({ title, value }: { title: string; value?: string | null }) {
  return (
    <div>
      <strong>{title}:</strong>
      <p>{value || "Chưa có dữ liệu"}</p>
    </div>
  );
}

function Alert({ tone, children }: { tone: "red" | "amber" | "slate"; children: React.ReactNode }) {
  const cls = tone === "red" ? "border-red-200 bg-red-50 text-red-900" : tone === "amber" ? "border-amber-300 bg-amber-50 text-amber-950" : "border-slate-300 bg-slate-50 text-slate-800";
  return <div role="alert" className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${cls}`}>{children}</div>;
}

function ExtLink({ href, children, subtle }: { href: string; children: React.ReactNode; subtle?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className={subtle ? "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" : "rounded-lg bg-[#0b3a5b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#087f89]"}>
      {children}
    </a>
  );
}
