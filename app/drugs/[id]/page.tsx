import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, FileText, Tag } from "lucide-react";
import drugData from "@/data/drug-products.json";
import { clinicalMonographs } from "@/data/clinical-monographs";
import { DAV_LOOKUP_URL, REGISTRY_SYNCED_AT, STATUS_LABEL, formatDate, getLeafletSibling, getRegistry, registryStatus, type RegistryStatus } from "@/lib/drugs/registry";
import { LEAFLET_GROUPS, LEAFLET_SECTIONS, getLeaflet, getStoredFiles, getWebLeaflet } from "@/lib/drugs/leaflets";
import { formatLeaflet } from "@/lib/drugs/format-leaflet";
import LeafletSections from "@/components/drugs/LeafletSections";

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

const STATUS_TONE: Record<RegistryStatus, string> = {
  "con-hieu-luc": "dt-ok",
  "sap-het-han": "dt-warn",
  "cho-gia-han": "dt-warn",
  "het-han": "dt-bad",
  "da-rut": "dt-bad",
  "khong-tim-thay": "dt-mute",
  "chua-dong-bo": "dt-mute",
};

const METHOD_LABEL = { text: "đọc trực tiếp từ PDF", ocr: "nhận dạng chữ từ bản scan", mixed: "đọc PDF kết hợp nhận dạng chữ", web: "trang web" } as const;

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
  // Thu tu nguon: HDSD Cuc QLD -> trang web (khop SDK hoac ten + nha san xuat) -> thuoc cung hoat chat trong danh muc.
  const web = davOk ? null : await getWebLeaflet(drug.id);
  const sibling = davOk || web ? null : getLeafletSibling(drug.id);
  const ref = sibling ? (sibling.src === "dav" ? await getLeaflet(getRegistry(sibling.id)?.davId) : await getWebLeaflet(sibling.id)) : null;
  const shown = davOk ? leaflet : web ?? (ref && !ref.failed ? ref : null);
  const kind: "dav" | "web" | "ref" | null = !shown ? null : shown === leaflet ? "dav" : shown === web ? "web" : "ref";
  const sections = shown?.sections ?? {};
  const shownSections = LEAFLET_SECTIONS.filter((s) => sections[s.key]);
  const sourceLabel = { dav: "HDSD Cục QLD", web: "HDSD tham khảo (web)", ref: "HDSD thuốc cùng hoạt chất" } as const;

  return (
    <main className="dt">
      <div className="dt-wrap">
        <Link href="/drugs" className="dt-back">
          <ArrowLeft size={17} aria-hidden />
          Danh mục thuốc
        </Link>

        {/* 1. Dau trang: nhan dien thuoc + hanh dong chinh + canh bao */}
        <header className="dt-card dt-hero">
          <p className="dt-eyebrow">Danh mục thuốc · Bệnh viện 199</p>
          <h1>{drug.brandName}</h1>
          <p className="dt-sub">{[drug.ingredientName, drug.strength].filter(Boolean).join(" · ")}</p>
          <div className="dt-tags">
            {drug.dosageForm && <span className="dt-tag">{drug.dosageForm}</span>}
            {drug.route && <span className="dt-tag">{drug.route}</span>}
            <span className={`dt-tag ${STATUS_TONE[status]}`}>{STATUS_LABEL[status]}</span>
            <span className={`dt-tag ${kind ? "dt-info" : "dt-mute"}`}>{kind ? sourceLabel[kind] : "Chưa có HDSD"}</span>
          </div>

          {(stored.length > 0 || (reg?.mauNhan.length ?? 0) > 0) && (
            <div className="dt-actions">
              {stored.map((f, i) => (
                <a key={f.href} className="dt-btn" href={f.href} target="_blank" rel="noreferrer">
                  <FileText size={16} aria-hidden />
                  Tờ HDSD{stored.length > 1 ? ` ${i + 1}` : ""} (PDF{f.pages ? ` · ${f.pages} trang` : ""})
                </a>
              ))}
              {reg?.mauNhan.map((f, i) => (
                <a key={f.url} className="dt-btn dt-btn-sub" href={f.url} target="_blank" rel="noreferrer">
                  <Tag size={16} aria-hidden />
                  Mẫu nhãn{reg.mauNhan.length > 1 ? ` ${i + 1}` : ""}
                </a>
              ))}
            </div>
          )}

          <StatusAlert status={status} drug={drug} reg={reg} />
        </header>

        {/* 2. Thong tin san pham */}
        <section className="dt-card">
          <h2>Thông tin sản phẩm</h2>
          <dl className="dt-dl">
            <Item term="Hoạt chất" value={drug.ingredientName} wide />
            <Item term="Hàm lượng" value={drug.strength} />
            <Item term="Dạng bào chế" value={drug.dosageForm} />
            <Item term="Đường dùng" value={drug.route} />
            <Item term="Quy cách đóng gói" value={drug.packageSize} />
            <Item term="Số đăng ký / GPNK" value={drug.registrationNumber} />
            <Item term="Đơn vị tính" value={drug.unit} />
            <Item term="Nhà sản xuất" value={[drug.manufacturer, drug.country].filter(Boolean).join(" – ")} wide />
            <Item term="Mã thuốc" value={drug.drugCode} />
          </dl>
        </section>

        {/* 3. Huong dan su dung */}
        <section className="dt-card">
          <h2>Hướng dẫn sử dụng</h2>

          {kind === "dav" && shown && (
            <Note>
              <strong>CẦN THẨM ĐỊNH.</strong> Trích tự động ({shown.method ? METHOD_LABEL[shown.method] : "tự động"}
              {shown.confidence ? `, độ chính xác ~${shown.confidence}%` : ""}) từ Tờ HDSD công bố trên Cổng Cục Quản lý Dược. Đối chiếu{" "}
              <a href={stored[0]?.href ?? shown.source?.url} target="_blank" rel="noreferrer">bản gốc</a> trước khi dùng cho quyết định điều trị, nhất là liều dùng.
            </Note>
          )}
          {kind === "web" && shown && (
            <Note>
              <strong>CẦN THẨM ĐỊNH.</strong> Nguồn tham khảo:{" "}
              <a href={shown.source?.url} target="_blank" rel="noreferrer">{siteDomain(shown.source?.url)}</a>
              {shown.matchedBy === "ten-nha-san-xuat" ? " (khớp tên thuốc và nhà sản xuất)" : ""}
            </Note>
          )}
          {kind === "ref" && sibling && ref && (
            <Note>
              <strong>CẦN THẨM ĐỊNH – THAM KHẢO THUỐC CÙNG HOẠT CHẤT.</strong> Thuốc này chưa có Tờ HDSD riêng; dưới đây là HDSD của{" "}
              <Link href={`/drugs/${encodeURIComponent(sibling.id)}`}>{sibling.brand}</Link>
              {[sibling.strength, sibling.form].filter(Boolean).length ? ` (${[sibling.strength, sibling.form].filter(Boolean).join(", ")})` : ""}.{" "}
              <strong>Hàm lượng, dạng bào chế và liều có thể khác.</strong> Nguồn: {sibling.src === "dav" ? "Cổng Cục Quản lý Dược" : siteDomain(ref.source?.url)}.
            </Note>
          )}

          {!shown && (
            <div className="dt-empty">
              <p><strong>Chưa có Tờ hướng dẫn sử dụng.</strong></p>
              <p>
                {leaflet?.failed
                  ? "File HDSD trên Cổng Cục Quản lý Dược đang lỗi phía máy chủ của Cổng; chưa tìm thấy nguồn công khai khác khớp thuốc này."
                  : "Cục Quản lý Dược chưa công bố HDSD cho số đăng ký này và chưa tìm thấy nguồn công khai khớp thuốc. Tham khảo HDSD kèm sản phẩm hoặc hồ sơ thầu."}
              </p>
            </div>
          )}

          {shown && (
            <LeafletSections
              sections={[
                ...shownSections.map((s) => ({ key: s.key, title: s.title, group: LEAFLET_GROUPS[s.group], open: s.open, blocks: formatLeaflet(sections[s.key]) })),
                ...(shown.rawText ? [{ key: "rawText", title: "Toàn văn trích được", group: "Khác", blocks: formatLeaflet(shown.rawText) }] : []),
              ]}
            />
          )}

          {monograph && (
            <div className="dt-mono">
              <p className="dt-mono-t">Chỉ định (chuyên luận đã thẩm định)</p>
              <p>{monograph.indications}</p>
            </div>
          )}
        </section>

        {/* 4. Dang ky luu hanh (hanh chinh) - thu gon */}
        <details className="dt-card dt-reg">
          <summary>
            <span>
              <span className="dt-reg-t">Đăng ký lưu hành – Cục Quản lý Dược</span>
              <span className="dt-reg-s">
                {STATUS_LABEL[status]}
                {reg?.ngayHetHan ? ` · hết hạn ${formatDate(reg.ngayHetHan)}` : ""} · đối chiếu ngày {formatDate(REGISTRY_SYNCED_AT)}
              </span>
            </span>
            <span className="dt-caret" aria-hidden>▾</span>
          </summary>
          {reg ? (
            <dl className="dt-dl">
              <Item term="Tên thuốc" value={reg.tenThuoc} />
              <Item term="Số đăng ký" value={[reg.soDangKy, reg.soDangKyCu && `(cũ: ${reg.soDangKyCu})`].filter(Boolean).join(" ")} />
              <Item term="Hoạt chất – hàm lượng" value={reg.hamLuong || reg.hoatChat} wide />
              <Item term="Dạng bào chế" value={reg.dangBaoChe} />
              <Item term="Quy cách đóng gói" value={reg.dongGoi} />
              <Item term="Cơ sở sản xuất" value={[reg.coSoSanXuat, reg.nuocSanXuat].filter(Boolean).join(" – ")} wide />
              <Item term="Cơ sở đăng ký" value={reg.coSoDangKy} wide />
              <Item term="Ngày cấp – hết hạn" value={`${formatDate(reg.ngayCap)} – ${formatDate(reg.ngayHetHan)}`} />
              <Item term="Quyết định cấp" value={reg.soQuyetDinh} />
              <Item term="Tiêu chuẩn – tuổi thọ" value={[reg.tieuChuan, reg.tuoiTho && `${reg.tuoiTho} tháng`].filter(Boolean).join(" – ")} />
            </dl>
          ) : (
            <p className="dt-muted">Không tìm thấy số đăng ký trên Cổng tra cứu thuốc.</p>
          )}
          <p className="dt-links">
            {reg?.hdsd.map((f, i) => (
              <a key={f.url} href={f.url} target="_blank" rel="noreferrer">HDSD bản gốc trên Cổng{reg.hdsd.length > 1 ? ` ${i + 1}` : ""}</a>
            ))}
            <a href={DAV_LOOKUP_URL} target="_blank" rel="noreferrer">Tra cứu trên Cổng Cục QLD</a>
          </p>
        </details>
      </div>

      <style>{`
        .dt { min-height: 100vh; background: #f4f7fa; }
        .dt-wrap { max-width: 980px; margin: 0 auto; padding: 24px 16px 48px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
        .dt-wrap > * { min-width: 0; }
        .dt-back { justify-self: start; display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px 8px 12px; border: 1px solid #dbe4ea; border-radius: 999px; background: #fff; color: #0b3a5b; font-size: 14px; font-weight: 700; box-shadow: 0 1px 2px rgba(16,36,62,.05); transition: border-color .15s, color .15s; }
        .dt-back:hover { border-color: #087f89; color: #087f89; }
        .dt-card { background: #fff; border: 1px solid #e3eaf0; border-radius: 18px; padding: 22px 24px; box-shadow: 0 2px 12px rgba(16,36,62,.04); }
        .dt-card h2 { margin: 0 0 14px; font-size: 18px; font-weight: 800; color: #10243e; }
        .dt-eyebrow { margin: 0; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #087f89; }
        .dt-hero h1 { margin: 6px 0 0; font-size: 28px; line-height: 1.25; font-weight: 800; color: #0f2236; }
        .dt-sub { margin: 6px 0 0; font-size: 16px; color: #4b6576; }
        .dt-tags { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 6px; }
        .dt-tag { border-radius: 999px; padding: 5px 11px; font-size: 12.5px; font-weight: 700; background: #eef3f7; color: #36506a; }
        .dt-ok { background: #e6f6ee; color: #12623c; }
        .dt-warn { background: #fff3d6; color: #7a4b00; }
        .dt-bad { background: #fde4e4; color: #8f1d1d; }
        .dt-mute { background: #eef1f4; color: #5b6b7a; }
        .dt-info { background: #e3f0fb; color: #0b3a5b; }
        .dt-actions { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
        .dt-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 14px; border-radius: 10px; background: #0b3a5b; color: #fff; font-size: 14px; font-weight: 700; }
        .dt-btn:hover { background: #087f89; }
        .dt-btn-sub { background: #fff; color: #0b3a5b; border: 1px solid #cfdbe4; }
        .dt-btn-sub:hover { background: #f4f8fb; }
        .dt-alert { margin-top: 16px; border-radius: 12px; padding: 12px 14px; font-size: 14px; line-height: 1.6; border: 1px solid; }
        .dt-alert.dt-bad { border-color: #f3c6c6; }
        .dt-alert.dt-warn { border-color: #f1d48a; }
        .dt-alert.dt-mute { border-color: #d8dee4; }
        .dt-dl { margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 24px; }
        .dt-dl > div { padding: 10px 0; border-bottom: 1px solid #eef2f5; min-width: 0; }
        .dt-dl > div.wide { grid-column: 1 / -1; }
        .dt-dl dt { font-size: 12px; font-weight: 700; color: #7a8fa0; text-transform: uppercase; letter-spacing: .03em; }
        .dt-dl dd { margin: 3px 0 0; font-size: 14.5px; line-height: 1.55; color: #1f3347; overflow-wrap: anywhere; }
        .dt-note { margin: 0 0 4px; border-radius: 12px; padding: 10px 14px; background: #fff8e6; border: 1px solid #f3dc9a; color: #5c3d00; font-size: 13.5px; line-height: 1.6; }
        .dt-note a { font-weight: 700; text-decoration: underline; }
        .dt-empty { border: 1px dashed #cfdbe4; border-radius: 12px; padding: 16px; color: #4b6576; font-size: 14px; line-height: 1.6; }
        .dt-empty p { margin: 0; }
        .dt-empty p + p { margin-top: 4px; }
        .dt-mono { margin-top: 14px; border-radius: 12px; background: #f4f8fb; padding: 12px 14px; font-size: 14px; line-height: 1.6; }
        .dt-mono p { margin: 0; }
        .dt-mono-t { font-weight: 800; margin-bottom: 4px !important; }
        .dt-reg summary { list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 12px; cursor: pointer; }
        .dt-reg summary::-webkit-details-marker { display: none; }
        .dt-reg-t { display: block; font-size: 16px; font-weight: 800; color: #10243e; }
        .dt-reg-s { display: block; margin-top: 2px; font-size: 13px; color: #6b8293; }
        .dt-caret { color: #6b8293; transition: transform .15s; }
        .dt-reg:not([open]) .dt-caret { transform: rotate(-90deg); }
        .dt-reg[open] summary { margin-bottom: 10px; }
        .dt-muted { color: #6b8293; font-size: 14px; }
        .dt-links { margin: 14px 0 0; display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: 13.5px; }
        .dt-links a { color: #087f89; font-weight: 700; }
        .dt :is(a, summary, button):focus-visible { outline: 3px solid #087f89; outline-offset: 2px; border-radius: 6px; }
        /* Dien thoai: thanh tren cung da co nut quay lai -> an nut trung. */
        @media (max-width: 800px) { .dt-back { display: none; } }
        @media (max-width: 640px) {
          .dt-wrap { padding: 14px 12px 40px; gap: 12px; }
          .dt-card { padding: 16px; border-radius: 14px; }
          .dt-hero h1 { font-size: 23px; }
          .dt-sub { font-size: 14.5px; }
          .dt-dl { gap: 0 14px; }
          .dt-dl dd { font-size: 14px; }
          .dt-btn { flex: 1 1 auto; justify-content: center; }
        }
      `}</style>
    </main>
  );
}

function StatusAlert({ status, drug, reg }: { status: RegistryStatus; drug: DrugProduct; reg: ReturnType<typeof getRegistry> }) {
  const box = (tone: string, children: ReactNode) => <div role="alert" className={`dt-alert ${tone}`}>{children}</div>;
  if (status === "da-rut") return box("dt-bad", <>Số đăng ký <strong>đã bị rút</strong> theo Cục Quản lý Dược. Kiểm tra quyết định rút số đăng ký trước khi cung ứng, cấp phát.</>);
  if (status === "het-han") return box("dt-bad", <>Số đăng ký đã <strong>hết hiệu lực</strong>. Kiểm tra hồ sơ gia hạn hoặc quy định chuyển tiếp trước khi mua sắm, cấp phát.</>);
  if (status === "cho-gia-han" && reg)
    return box("dt-warn", <>Số đăng ký hết hạn ngày {formatDate(reg.ngayHetHan)}; đã <strong>nộp hồ sơ gia hạn</strong>{reg.ngayNopGiaHan ? ` (ngày ${formatDate(reg.ngayNopGiaHan)})` : ""}. Đối chiếu quy định về lưu hành trong thời gian chờ gia hạn.</>);
  if (status === "sap-het-han") return box("dt-warn", <>Số đăng ký <strong>sắp hết hiệu lực</strong> ({formatDate(reg?.ngayHetHan ?? null)}). Theo dõi gia hạn khi lập kế hoạch mua sắm.</>);
  if (reg?.thayTheSdk) return box("dt-mute", <>Số đăng ký trong danh mục ({reg.thayTheSdk}) đã được thay bằng <strong>{reg.soDangKy}</strong>. Cần cập nhật danh mục.</>);
  if (status === "khong-tim-thay") return box("dt-mute", <>Không tìm thấy số đăng ký “{drug.registrationNumber}” trên Cổng tra cứu (có thể là thuốc nhập khẩu theo giấy phép, đã đổi số hoặc nhập sai).</>);
  return null;
}

/* "https://www.thuocbietduoc.com.vn/..." -> "thuocbietduoc.com.vn" */
function siteDomain(url?: string): string {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "trang thông tin thuốc";
  } catch {
    return "trang thông tin thuốc";
  }
}

function Item({ term, value, wide }: { term: string; value?: string | null; wide?: boolean }) {
  return (
    <div className={wide ? "wide" : undefined}>
      <dt>{term}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className="dt-note">{children}</p>;
}
