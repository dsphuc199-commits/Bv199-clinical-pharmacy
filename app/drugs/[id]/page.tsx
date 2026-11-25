import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowLeft, Baby, ExternalLink, FileText, FlaskConical, Shuffle, Tag } from "lucide-react";
import { getCatalogProduct, type DrugProduct } from "@/lib/drugs/catalog";
import { loadDrugPublications } from "@/lib/drugs/catalog-store";
import { clinicalMonographs } from "@/data/clinical-monographs";
import { DAV_LOOKUP_URL, REGISTRY_SYNCED_AT, STATUS_LABEL, formatDate, getRegistry, registryStatus, type RegistryStatus } from "@/lib/drugs/registry";
import { getIntlReferences, getStoredFiles } from "@/lib/drugs/leaflets";
import { DTQG_BOOK, dtqgFor, flaggedSections, loadMonograph, textOk, type MonoKey } from "@/lib/drugs/dtqg";
import type { DtqgBlock } from "@/lib/dosing/catalog";
import { lasaFor } from "@/lib/drugs/lasa-match";
import { bhytFor } from "@/lib/drugs/bhyt";
import BhytSection from "@/components/drugs/BhytSection";
import DtqgProse from "@/components/dosing/DtqgProse";
import { fixSubscripts } from "@/lib/dosing/dtqg-text";

export const dynamic = "force-dynamic";

/*
  Trang thông tin thuốc – chỉ nội dung từ nguồn chính thức, nguyên văn:
  1. Tờ HDSD gốc (PDF) do Cục Quản lý Dược công bố – mở bằng một chạm; không hiển thị chữ trích tự động.
  2. Dược thư quốc gia Việt Nam 2023 – liều ở người suy thận, thời kỳ mang thai và cho con bú (trích nguyên văn, có số trang).
  3. Danh mục thuốc BV199, đăng ký lưu hành (Cổng Cục QLD), danh mục LASA của Khoa Dược.
  HDSD lấy từ trang web và HDSD của thuốc cùng hoạt chất không dùng (không bảo đảm chính xác).
*/

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

const pageLabel = (p: { printed: number[] }) => (p.printed.length > 1 ? `tr. ${p.printed[0]}–${p.printed[p.printed.length - 1]}` : `tr. ${p.printed[0]}`);

export default async function DrugDetailPage({ params }: Props) {
  const { id } = await params;
  const publications = await loadDrugPublications().catch(() => null);
  if (!publications) return <p role="status" className="p-6">Tạm thời chưa tải được danh mục thuốc. Hãy tải lại trang.</p>;
  const drug = getCatalogProduct(id, publications.find((item) => item.id === id));
  if (!drug) notFound();

  const monograph = clinicalMonographs[drug.ingredientId?.toLowerCase()] ?? null;
  const reg = drug.registryMatches ? getRegistry(drug.id) : null;
  const status = drug.registryMatches ? registryStatus(drug.id) : "chua-dong-bo";
  const stored = getStoredFiles(reg?.davId);
  /* Tờ HDSD gốc: bản sao đã lưu (mở nhanh); không có thì liên kết tới file trên Cổng Cục QLD. */
  const leafletLinks = stored.length
    ? stored.map((f, i) => ({ href: f.href, label: `Tờ HDSD gốc${stored.length > 1 ? ` ${i + 1}` : ""}`, note: f.pages ? `PDF · ${f.pages} trang` : "PDF" }))
    : (reg?.hdsd ?? []).map((f, i) => ({ href: f.url, label: `Tờ HDSD gốc${(reg?.hdsd.length ?? 0) > 1 ? ` ${i + 1}` : ""}`, note: "Cổng Cục QLD" }));
  const intl = drug.registryMatches ? getIntlReferences(drug.id) : [];
  const { renal, pregnancy, mono: monoRef } = dtqgFor(drug.ingredientName);
  const mono = monoRef ? await loadMonograph(monoRef.id) : null;
  const ms = mono?.sections ?? {};
  /* Mục chưa đạt kiểm tra nguyên văn: không hiện chữ, chỉ số trang Dược thư. */
  const flagged = mono ? flaggedSections(mono.id) : new Set<MonoKey>();
  const monoPages = mono ? pageLabel(mono.pages) : "";
  const P = (k: MonoKey) => <Verified blocks={ms[k] ?? []} ok={!flagged.has(k)} pages={monoPages} />;
  const renalOk = !!renal && textOk(renal.content, [...renal.contraindications, ...renal.cautions]);
  const monoSrc = mono ? `Dược thư quốc gia 2023 – ${mono.name}, ${pageLabel(mono.pages)}` : "";
  const lasa = lasaFor(drug.brandName);
  const bhyt = bhytFor(drug.ingredientName);
  const sections = [
    (ms.chiDinh || monograph) && { id: "chi-dinh", label: "Chỉ định" },
    ms.lieuDung && { id: "lieu-dung", label: "Liều dùng" },
    renal && { id: "suy-than", label: "Suy thận" },
    ms.chongChiDinh && { id: "chong-chi-dinh", label: "Chống chỉ định" },
    ms.thanTrong && { id: "than-trong", label: "Thận trọng" },
    pregnancy && { id: "thai-ky", label: "Thai kỳ, cho con bú" },
    ms.tuongTac && { id: "tuong-tac", label: "Tương tác" },
    ms.adr && { id: "adr", label: "Tác dụng không mong muốn" },
    ms.quaLieu && { id: "qua-lieu", label: "Quá liều" },
    bhyt.length > 0 && { id: "bhyt", label: "BHYT" },
    { id: "san-pham", label: "Sản phẩm" },
    { id: "dang-ky", label: "Đăng ký lưu hành" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <main className="dt">
      <div className="dt-wrap">
        <Link href="/drugs" className="dt-back">
          <ArrowLeft size={17} aria-hidden />
          Danh mục thuốc
        </Link>

        {/* 1. Nhận diện thuốc, cảnh báo an toàn, tài liệu gốc */}
        <header className="dt-card dt-hero">
          <p className="dt-eyebrow">Danh mục thuốc · Bệnh viện 199</p>
          <h1>{drug.brandName}</h1>
          <p className="dt-sub">{[drug.ingredientName, drug.strength].filter(Boolean).join(" · ")}</p>
          <div className="dt-tags">
            {!drug.active && <span className="dt-tag dt-bad">Ngừng sử dụng tại BV199</span>}
            {drug.dosageForm && <span className="dt-tag">{drug.dosageForm}</span>}
            {drug.route && <span className="dt-tag">{drug.route}</span>}
            <span className={`dt-tag ${STATUS_TONE[status]}`}>{STATUS_LABEL[status]}</span>
          </div>

          {lasa.length > 0 && (
            <div className="dt-alert dt-lasa" role="note">
              <p className="dt-alert-t"><AlertTriangle size={16} aria-hidden /> Thuốc nhìn giống, đọc giống (LASA)</p>
              <ul>
                {lasa.map((g) => (
                  <li key={g.id}>
                    <strong>{g.kind === "look" ? "Nhìn giống" : "Đọc giống"}:</strong> {g.drugs.map((d) => d.name).join(" – ")}. {g.difference}
                  </li>
                ))}
              </ul>
              <Link href="/safety/lasa">Danh mục LASA của Khoa Dược</Link>
            </div>
          )}

          <StatusAlert status={status} drug={drug} reg={reg} />

          <div className="dt-docs">
            {leafletLinks.map((f) => (
              <a key={f.href} className="dt-btn" href={f.href} target="_blank" rel="noreferrer">
                <FileText size={16} aria-hidden />
                <span>{f.label}<small>{f.note}</small></span>
              </a>
            ))}
            {reg?.mauNhan.map((f, i) => (
              <a key={f.url} className="dt-btn dt-btn-sub" href={f.url} target="_blank" rel="noreferrer">
                <Tag size={16} aria-hidden />
                <span>Mẫu nhãn{reg.mauNhan.length > 1 ? ` ${i + 1}` : ""}<small>Cổng Cục QLD</small></span>
              </a>
            ))}
            {renal && (
              <Link className="dt-btn dt-btn-sub" href={`/hieu-chinh-lieu?drug=${encodeURIComponent(renal.id)}`}>
                <FlaskConical size={16} aria-hidden />
                <span>Hiệu chỉnh liều theo CrCl<small>Công cụ tính</small></span>
              </Link>
            )}
            {pregnancy && (
              <Link className="dt-btn dt-btn-sub" href={`/safety/pregnancy?thuoc=${encodeURIComponent(pregnancy.id)}`}>
                <Baby size={16} aria-hidden />
                <span>Thai kỳ và cho con bú<small>Module an toàn</small></span>
              </Link>
            )}
            <Link className="dt-btn dt-btn-sub" href="/tuong-tac-thuoc">
              <Shuffle size={16} aria-hidden />
              <span>Kiểm tra tương tác thuốc<small>Danh mục Bộ Y tế</small></span>
            </Link>
          </div>
          {leafletLinks.length === 0 && (
            <p className="dt-nodoc">Cổng Cục Quản lý Dược chưa có tờ HDSD cho số đăng ký này. Đối chiếu tờ HDSD kèm sản phẩm.</p>
          )}
          {intl.length > 0 && (
            <div className="dt-intl">
              <p className="dt-intl-t">Tài liệu sản phẩm của cơ quan quản lý nước ngoài (tiếng Anh)</p>
              <ul>
                {intl.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noreferrer">{r.title} <ExternalLink size={12} aria-hidden /></a> <span>– {r.agency}</span>
                  </li>
                ))}
              </ul>
              <p className="dt-intl-n">Cùng sản phẩm, cùng nhà sản xuất. Chỉ định và liều có thể khác tờ HDSD được phê duyệt tại Việt Nam.</p>
            </div>
          )}
        </header>

        {sections.length > 2 && (
          <nav className="dt-nav" aria-label="Mục trong trang">
            {sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}
          </nav>
        )}

        {/* 2. Dược thư quốc gia 2023 – nguyên văn, theo thứ tự kê đơn: chỉ định → liều → suy thận → chống chỉ định → … */}
        {ms.chiDinh ? (
          <section id="chi-dinh" className="dt-card">
            <SectionHead title="Chỉ định" source={monoSrc} />
            {P("chiDinh")}
          </section>
        ) : monograph && (
          <section id="chi-dinh" className="dt-card">
            <SectionHead title="Chỉ định" source="Chuyên luận đã thẩm định" />
            <p className="dt-text">{monograph.indications}</p>
          </section>
        )}

        {ms.lieuDung && (
          <section id="lieu-dung" className="dt-card">
            <SectionHead title="Liều lượng và cách dùng" source={monoSrc} />
            {P("lieuDung")}
          </section>
        )}

        {renal && (
          <section id="suy-than" className="dt-card">
            <SectionHead title="Liều ở người suy thận" source={`Dược thư quốc gia 2023 – ${renal.name}, ${pageLabel(renal.pages)}`} />
            {!renalOk && <Verified blocks={[]} ok={false} pages={pageLabel(renal.pages)} />}
            {renalOk && renal.contraindications.length > 0 && (
              <div className="dt-ci">
                <p className="dt-ci-t">Chống chỉ định liên quan chức năng thận</p>
                <ul>{renal.contraindications.map((c) => <li key={c}>{fixSubscripts(c)}</li>)}</ul>
              </div>
            )}
            {renalOk && renal.noAdjust && <p className="dt-okline">Không cần hiệu chỉnh liều theo chức năng thận.</p>}
            {renalOk && renal.content.length > 0 && <DtqgProse blocks={renal.content} />}
            {renalOk && renal.cautions.length > 0 && (
              <div className="dt-caution">
                <p className="dt-ci-t">Thận trọng</p>
                <ul>{renal.cautions.map((c) => <li key={c}>{fixSubscripts(c)}</li>)}</ul>
              </div>
            )}
          </section>
        )}

        {ms.chongChiDinh && (
          <section id="chong-chi-dinh" className="dt-card dt-card-ci">
            <SectionHead title="Chống chỉ định" source={monoSrc} />
            {P("chongChiDinh")}
          </section>
        )}

        {ms.thanTrong && <Fold id="than-trong" title="Thận trọng" source={monoSrc}>{P("thanTrong")}</Fold>}

        {pregnancy && (
          <section id="thai-ky" className="dt-card">
            <SectionHead title="Thời kỳ mang thai và cho con bú" source={`Dược thư quốc gia 2023 – ${pregnancy.name}, ${pageLabel(pregnancy.pages)}`} />
            <div className="dt-two">
              <div>
                <h3>Thời kỳ mang thai</h3>
                <Verified blocks={pregnancy.pregnancy} ok={textOk(pregnancy.pregnancy)} pages={pageLabel(pregnancy.pages)} />
              </div>
              <div>
                <h3>Thời kỳ cho con bú</h3>
                <Verified blocks={pregnancy.lactation} ok={textOk(pregnancy.lactation)} pages={pageLabel(pregnancy.pages)} />
              </div>
            </div>
          </section>
        )}

        {ms.tuongTac && <Fold id="tuong-tac" title="Tương tác thuốc" source={monoSrc}>{P("tuongTac")}</Fold>}
        {ms.adr && (
          <Fold id="adr" title="Tác dụng không mong muốn" source={monoSrc}>
            {P("adr")}
            {ms.adrXuTri && <><h3 className="dt-sub3">Hướng dẫn cách xử trí ADR</h3>{P("adrXuTri")}</>}
          </Fold>
        )}
        {ms.quaLieu && <Fold id="qua-lieu" title="Quá liều và xử trí" source={monoSrc}>{P("quaLieu")}</Fold>}

        {bhyt.length > 0 && <BhytSection items={bhyt} productRoute={drug.route} />}

        {(mono || renal || pregnancy) && (
          <p className="dt-srcnote">
            Trích nguyên văn: {DTQG_BOOK}. Thông tin riêng của chế phẩm (hàm lượng, tá dược, cách pha): xem tờ HDSD gốc.
          </p>
        )}

        {/* 3. Thông tin sản phẩm trong danh mục BV199 */}
        <section id="san-pham" className="dt-card">
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

        {/* 4. Đăng ký lưu hành (hành chính) – thu gọn */}
        <details id="dang-ky" className="dt-card dt-reg">
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
            <a href={DAV_LOOKUP_URL} target="_blank" rel="noreferrer">Tra cứu trên Cổng Cục QLD</a>
          </p>
        </details>
      </div>

      <style>{`
        .dt { min-height: 100vh; background: #f4f7fa; }
        .dt-wrap { max-width: 980px; margin: 0 auto; padding: 24px 16px 48px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
        .dt-wrap > * { min-width: 0; }
        .dt-back { justify-self: start; display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px 8px 12px; border: 1px solid #dbe4ea; border-radius: 999px; background: #fff; color: #0b3a5b; font-size: 14px; font-weight: 700; box-shadow: 0 1px 2px rgba(16,36,62,.05); }
        .dt-back:hover { border-color: #087f89; color: #087f89; }
        .dt-card { background: #fff; border: 1px solid #e3eaf0; border-radius: 18px; padding: 22px 24px; box-shadow: 0 2px 12px rgba(16,36,62,.04); scroll-margin-top: 80px; }
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
        .dt-docs { margin-top: 16px; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
        .dt-btn { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; background: #0b3a5b; color: #fff; font-size: 14px; font-weight: 700; line-height: 1.3; }
        .dt-btn small { display: block; font-size: 12px; font-weight: 600; opacity: .8; }
        .dt-btn:hover { background: #087f89; }
        .dt-btn-sub { background: #fff; color: #0b3a5b; border: 1px solid #cfdbe4; }
        .dt-btn-sub:hover { background: #f4f8fb; }
        .dt-nodoc { margin: 12px 0 0; font-size: 14px; color: #4b6576; }
        .dt-alert { margin-top: 16px; border-radius: 12px; padding: 12px 14px; font-size: 14px; line-height: 1.6; border: 1px solid; }
        .dt-alert.dt-bad { border-color: #f3c6c6; }
        .dt-alert.dt-warn { border-color: #f1d48a; }
        .dt-alert.dt-mute { border-color: #d8dee4; }
        .dt-lasa { background: #fff6e8; border-color: #f2c98a; color: #5c3d00; }
        .dt-lasa ul { margin: 4px 0 6px; padding-left: 18px; list-style: disc; }
        .dt-lasa a { font-weight: 700; text-decoration: underline; color: #7a4b00; }
        .dt-alert-t { margin: 0; display: flex; align-items: center; gap: 6px; font-weight: 800; }
        .dt-nav { position: sticky; top: 8px; z-index: 5; display: flex; gap: 6px; overflow-x: auto; padding: 6px; border-radius: 14px; background: rgba(255,255,255,.95); border: 1px solid #e3eaf0; box-shadow: 0 2px 10px rgba(16,36,62,.06); }
        .dt-nav a { flex: none; padding: 7px 12px; border-radius: 999px; font-size: 13.5px; font-weight: 700; color: #0b3a5b; background: #eef4f8; }
        .dt-nav a:hover { background: #dcecf3; color: #087f89; }
        .dt-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 4px 12px; margin-bottom: 12px; }
        .dt-head h2 { margin: 0; }
        .dt-src { font-size: 12.5px; font-weight: 700; color: #087f89; background: #e7f5f5; border-radius: 999px; padding: 4px 10px; }
        .dt-ci, .dt-caution { margin-bottom: 12px; border-radius: 12px; padding: 10px 14px; font-size: 14.5px; line-height: 1.6; }
        .dt-ci { background: #fdecec; border: 1px solid #f3c6c6; color: #6e1a1a; }
        .dt-caution { margin: 12px 0 0; background: #fff8e6; border: 1px solid #f3dc9a; color: #5c3d00; }
        .dt-ci-t { margin: 0 0 2px; font-weight: 800; }
        .dt-ci ul, .dt-caution ul { margin: 0; padding-left: 18px; list-style: disc; }
        .dt-okline { margin: 0 0 10px; font-weight: 700; color: #12623c; }
        .dt-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .dt-two h3 { margin: 0 0 8px; font-size: 15px; font-weight: 800; color: #0b3a5b; }
        .dt-text { margin: 0; font-size: 15px; line-height: 1.7; color: #24384c; }
        .dt-srcnote { margin: -4px 4px 0; font-size: 12.5px; line-height: 1.6; color: #5b6b7a; }
        .dt-intl { margin: 14px 0 0; border: 1px solid #cfe0ea; border-radius: 12px; padding: 12px 14px; background: #f5f9fc; font-size: 14px; line-height: 1.6; }
        .dt-intl-t { margin: 0 0 6px; font-weight: 800; color: #0b3a5b; }
        .dt-intl ul { margin: 0; padding-left: 18px; list-style: disc; }
        .dt-intl a { color: #087f89; font-weight: 700; text-decoration: underline; }
        .dt-intl li span { color: #6b8293; }
        .dt-intl-n { margin: 8px 0 0; font-size: 12.5px; color: #5b6b7a; }
        .dt-dl { margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 24px; }
        .dt-dl > div { padding: 10px 0; border-bottom: 1px solid #eef2f5; min-width: 0; }
        .dt-dl > div.wide { grid-column: 1 / -1; }
        .dt-dl dt { font-size: 12px; font-weight: 700; color: #7a8fa0; text-transform: uppercase; letter-spacing: .03em; }
        .dt-dl dd { margin: 3px 0 0; font-size: 14.5px; line-height: 1.55; color: #1f3347; overflow-wrap: anywhere; }
        .dt-card-ci { border-color: #f3c6c6; }
        .dt-hold { margin: 0; border-radius: 12px; padding: 10px 14px; background: #f4f7fa; border: 1px dashed #c9d6e0; color: #36506a; font-size: 14px; line-height: 1.6; }
        .dt-fold summary { list-style: none; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; cursor: pointer; }
        .dt-fold summary::-webkit-details-marker { display: none; }
        .dt-fold-t { font-size: 18px; font-weight: 800; color: #10243e; margin-right: auto; }
        .dt-fold:not([open]) .dt-caret { transform: rotate(-90deg); }
        .dt-fold-b { margin-top: 12px; }
        .dt-sub3 { margin: 14px 0 8px; font-size: 15px; font-weight: 800; color: #0b3a5b; }
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
        @media (max-width: 800px) { .dt-back { display: none; } }
        @media (max-width: 640px) {
          .dt-wrap { padding: 14px 12px 40px; gap: 12px; }
          .dt-card { padding: 16px; border-radius: 14px; }
          .dt-hero h1 { font-size: 23px; }
          .dt-sub { font-size: 14.5px; }
          .dt-dl { gap: 0 14px; }
          .dt-dl dd { font-size: 14px; }
          .dt-two { grid-template-columns: minmax(0, 1fr); }
          .dt-docs { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </main>
  );
}

/** Mục dài (thận trọng, tương tác, ADR, quá liều): thu gọn, bấm để mở. */
function Fold({ id, title, source, children }: { id: string; title: string; source: string; children: ReactNode }) {
  return (
    <details id={id} className="dt-card dt-fold">
      <summary>
        <span className="dt-fold-t">{title}</span>
        <span className="dt-src">{source}</span>
        <span className="dt-caret" aria-hidden>▾</span>
      </summary>
      <div className="dt-fold-b">{children}</div>
    </details>
  );
}

/** Nguyên văn Dược thư nếu đã đạt kiểm tra; chưa đạt thì chỉ chỉ số trang để tra bản in. */
function Verified({ blocks, ok, pages }: { blocks: DtqgBlock[]; ok: boolean; pages: string }) {
  if (ok && blocks.length) return <DtqgProse blocks={blocks} />;
  return (
    <p className="dt-hold">
      Mục này có công thức, ký hiệu hoặc chữ chưa trích được chính xác từ bản điện tử nên không hiển thị. Tra Dược thư quốc gia 2023, {pages}.
    </p>
  );
}

function SectionHead({ title, source }: { title: string; source: string }) {
  return (
    <div className="dt-head">
      <h2>{title}</h2>
      <span className="dt-src">{source}</span>
    </div>
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

function Item({ term, value, wide }: { term: string; value?: string | null; wide?: boolean }) {
  return (
    <div className={wide ? "wide" : undefined}>
      <dt>{term}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}
