"use client";

/*
  FILE: components/antibiotics/empiric/GuidelineTabs.tsx
  Guideline Version Engine (Buoc 4A): noi dung Tab 2 (Quoc te), Tab 3 (So sanh),
  Tab 4 (Nguon, phien ban). Tab 1 (BYT) dung BytRegimenView va cac module co san.
  Khong tron phac do giua cac nguon; moi muc ghi ro guideline va vi tri.
*/

import type { ReactNode } from "react";

import { getComparison } from "@/data/antibiotics/empiric/comparison";
import {
  DOSE_REFERENCES,
  INTL_GUIDELINES,
  getIntlEntry,
  type IntlGuideline,
  type IntlRec,
  type IntlRegimen,
} from "@/data/antibiotics/empiric/international";
import { structureOptionLines } from "@/lib/antibiotics/regimen-structure";
import DoseTable from "../treatment/DoseTable";
import ClinicalNotes from "../treatment/ClinicalNotes";
import {
  DOCS,
  MODULE_SUPERSEDES,
  SUPERSEDED_LOG,
  getRegimensForDisease,
  isConcreteRegimen,
  type DocId,
} from "@/data/antibiotics/empiric/regimens";
import { FORMULARY_SOURCE } from "@/lib/antibiotics/formulary";
import { SOURCE_ROLE_TEXT, sourceRole, confirmedLifecycle } from "@/lib/antibiotics/source-governance";

import DrugActionLinks from "../links/DrugActionLinks";
import { EvidencePanel } from "./EvidencePanel";
import InternationalDoseReview from "./InternationalDoseReview";
import SepticArthritisSeimc2024 from "./SepticArthritisSeimc2024";
import OsteomyelitisIntl from "./OsteomyelitisIntl";
import CopdGold2026 from "./CopdGold2026";
import PneumoniaIntl from "./PneumoniaIntl";
import LungAbscessInternational from "./LungAbscessInternational";
import EsblIdsa2026 from "./EsblIdsa2026";
import GnbBsiIntl from "./GnbBsiIntl";
import { INTERNATIONAL_DOSE_REVIEWS } from "@/data/antibiotics/empiric/international-dose-review";
import { capitalizeBullet, clinicalText } from "@/lib/antibiotics/presentation-text";

export type TabKey = "vn" | "intl" | "compare" | "sources";

/* Master Task 6: chi 3 tab; "Nguon, phien ban" chuyen vao accordion duoi ket qua (?tab=sources mo accordion). */
export const TAB_LABELS: Record<Exclude<TabKey, "sources">, { short: string; long: string }> = {
  vn: { short: "Việt Nam", long: "Hướng dẫn Việt Nam" },
  intl: { short: "Quốc tế", long: "Quốc tế" },
  compare: { short: "Đối chiếu", long: "Đối chiếu" },
};

const STATUS_TEXT: Record<IntlGuideline["status"], string> = {
  extracted: "Đã trích khuyến cáo",
  identified: "Hướng dẫn liên quan",
  module: "Nội dung trong module riêng",
};

/* Van ban VN dung trong module rieng (khong nam trong thu vien regimens/). */
const MODULE_DOCS: Record<string, { doc?: DocId; label?: string }[]> = {
  "v8-1": [{ doc: "byt2147" }],
  "v8-4": [{ label: "Hội Hô hấp Việt Nam & Hội Hồi sức cấp cứu và Chống độc Việt Nam – Khuyến cáo VPBV/VPLQTM (10/2023) – hội chuyên ngành, không phải văn bản BYT" }],
  "v8-5": [{ label: "Hội Hô hấp Việt Nam & Hội Hồi sức cấp cứu và Chống độc Việt Nam – Khuyến cáo VPBV/VPLQTM (10/2023) – hội chuyên ngành, không phải văn bản BYT" }],
};

function docTime(doc: DocId): number {
  const raw = DOCS[doc]?.date ?? "";
  const full = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (full) return Date.UTC(+full[3], +full[2] - 1, +full[1]);
  const year = raw.match(/(19|20)\d{2}/);
  return year ? Date.UTC(+year[0], 0, 1) : 0;
}

export function vnDocsFor(diseaseId: string): DocId[] {
  const set = new Set<DocId>(getRegimensForDisease(diseaseId).map((r) => r.source.doc));
  for (const item of MODULE_DOCS[diseaseId] ?? []) if (item.doc) set.add(item.doc);
  return Array.from(set).sort((a, b) => docTime(b) - docTime(a));
}

/* Muc do hoan thien thuc te cua mat benh (dung cho bao cao, Tab 4). */
export function completeness(diseaseId: string) {
  const regimens = getRegimensForDisease(diseaseId);
  const bytDocs = vnDocsFor(diseaseId);
  const bytDoses =
    regimens.some(isConcreteRegimen) || (MODULE_DOCS[diseaseId] ?? []).some((m) => m.doc);
  const intl = getIntlEntry(diseaseId);
  const intlVerified =
    !!intl &&
    intl.guidelineIds.some((id) => INTL_GUIDELINES[id]?.status !== "identified");
  const comparison = !!getComparison(diseaseId);
  return {
    byt: bytDocs.length > 0,
    bytDoses,
    intlVerified,
    comparison,
    complete: bytDocs.length > 0 && intlVerified && comparison,
  };
}

/* Giao dien toi gian: hien 4 khuyen cao dau, phan con lai thu gon. */
const REC_LIMIT = 4;

const KIND_TEXT: Record<NonNullable<IntlRegimen["kind"]>, string> = {
  empiric: "Kinh nghiệm",
  "pathogen-directed": "Điều trị đích (đã biết tác nhân)",
  "trial-dosing": "Liều trong thử nghiệm lâm sàng – không phải khuyến cáo",
};

function RecItem({ rec }: { rec: IntlRec }) {
  return (
    <li>
      {clinicalText(capitalizeBullet(rec.text))}
      <details className="gt199-loc"><summary>Xem chứng cứ</summary>
        {rec.grade ? `${rec.grade} · ` : ""}
        {rec.locator}
      </details>
    </li>
  );
}

/* ---------------- Tab 2 ---------------- */

export function IntlTab({ diseaseId, moduleContent }: { diseaseId: string; moduleContent?: ReactNode }) {
  if (diseaseId === "v8-9") return <LungAbscessInternational />;
  /* Viem khop nhiem khuan: cong cu chon khang sinh (GEIO–SEIMC 2024, PIDS/IDSA 2023) thay cho phan doc khuyen cao. */
  /* Viem xuong tuy: cong cu chon khang sinh (WikiGuidelines 2022/2025 nguoi lon, PIDS/IDSA 2021 tre em). */
  /* Dot cap COPD: cong cu chon khang sinh theo GOLD 2026. */
  /* Viem phoi: cong cu chon khang sinh (ATS/IDSA 2019 VPCD; IDSA/ATS 2016 VPBV, VPLQTM; IDSA 2026 vi khuan khang thuoc). */
  if (diseaseId === "v8-1" || diseaseId === "v8-4" || diseaseId === "v8-5") return <section className="bv199-panel gt199"><PneumoniaIntl kind={diseaseId === "v8-1" ? "cap" : diseaseId === "v8-4" ? "hap" : "vap"} /><GtStyle /></section>;
  /* Enterobacterales sinh ESBL: cong cu chon khang sinh theo IDSA 2026 (Section 1, Table 1). */
  /* Nhiem khuan huyet Gram am: kinh nghiem (IDSA 2025 cUTI, nguon tiet nieu) va dieu tri dich theo kieu hinh (IDSA 2026). */
  if (diseaseId === "v8-14") return <section className="bv199-panel gt199"><GnbBsiIntl /><GtStyle /></section>;
  if (diseaseId === "v8-43") return <section className="bv199-panel gt199"><EsblIdsa2026 /><GtStyle /></section>;
  if (diseaseId === "v8-6") return <section className="bv199-panel gt199"><CopdGold2026 /><GtStyle /></section>;
  if (diseaseId === "v8-32") return <section className="bv199-panel gt199"><OsteomyelitisIntl /><GtStyle /></section>;
  if (diseaseId === "v8-33") return <section className="bv199-panel gt199"><SepticArthritisSeimc2024 /><GtStyle /></section>;
  const entry = getIntlEntry(diseaseId);

  if (!entry) {
    return (
      <section className="bv199-panel gt199">
        <div className="bv199-label">KHUYẾN CÁO QUỐC TẾ</div>
        <div className="gt199-note">
          Mặt bệnh này hiện áp dụng theo hướng dẫn của Bộ Y tế (tab Việt Nam).
        </div>
        <GtStyle />
      </section>
    );
  }

  return (
    <section className="bv199-panel gt199">
      <div className="bv199-label">KHUYẾN CÁO QUỐC TẾ</div>
      <p className="gt199-scope"><strong>Phạm vi:</strong> {diseaseId === "v8-33" ? "Viêm khớp nhiễm khuẩn khớp tự nhiên: GEIO–SEIMC/SEIP/SECOT 2024 cho người lớn và trẻ em; PIDS/IDSA 2023 cho trẻ từ 1 tháng đến 17 tuổi." : clinicalText(entry.scope)}</p>
      {/* v8-33: nhanh Gram am GEIO–SEIMC da nam trong cong cu chon khang sinh – khong lap lai. */}
      <InternationalDoseReview diseaseId={diseaseId} exclude={diseaseId === "v8-33" ? ["arthritis-seimc-adult-gramnegative"] : []} />

      {entry.guidelineIds.map((gid) => {
        const g = INTL_GUIDELINES[gid];
        const recs = entry.recommendations.filter((r) => r.guidelineId === gid);
        /* Thu tu: kinh nghiem -> dieu tri dich -> lieu thu nghiem (thu gon, van hien nhan). */
        const KIND_ORDER = ["empiric", undefined, "pathogen-directed", "trial-dosing"];
        const regs = entry.regimens
          .filter((r) => r.guidelineId === gid)
          .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
        const recsShown = recs.slice(0, REC_LIMIT);
        const recsMore = recs.slice(REC_LIMIT);
        if (!g) return null;
        return (
          <article key={gid} className="gt199-guide">
            <h3>
              {g.org} · {g.published}
            </h3>

            {recs.length > 0 && (
              <details className="gt199-more"><summary>Nguyên tắc điều trị và điều kiện áp dụng ({recs.length})</summary><ul className="gt199-recs">
                {recsShown.map((rec) => (
                  <RecItem key={rec.text} rec={rec} />
                ))}
              </ul></details>
            )}
            {recsMore.length > 0 && (
              <details className="gt199-more">
                <summary>Thêm {recsMore.length} khuyến cáo</summary>
                <ul className="gt199-recs">
                  {recsMore.map((rec) => (
                    <RecItem key={rec.text} rec={rec} />
                  ))}
                </ul>
              </details>
            )}

            {regs.map((reg) => {
              const body = (
                <>
                  {/* Master Task 6: dong co lieu tach duoc -> bang; dong mo ta / chua chac cau truc -> nguyen van */}
                  {reg.options.map((option) => {
                    const s = structureOptionLines([option]);
                    return <DoseTable key={option} groups={s.groups} status={s.status} />;
                  })}
                  {reg.note && <ClinicalNotes items={[reg.note]}/>}
                  {/* Vi tri (bang/trang) cua tung phac do giu trong du lieu; nguon chung nam o khoi "Nguồn và đối chiếu" cua huong dan. */}
                  <DrugActionLinks compact navigation={false} texts={reg.options} scenario={`${g.org}: ${reg.scenario}`} />
                </>
              );
              const kindLabel = reg.kind && (
                <span className={`gt199-kind gt199-kind-${reg.kind}`}>{KIND_TEXT[reg.kind]}</span>
              );
              /* Buoc 4D.4: lieu thu nghiem khong phai khuyen cao -> thu gon, nhan van hien. */
              return (
                <details key={reg.scenario} name={`international-${diseaseId}-${gid}`} className="gt199-reg">
                  <summary>
                    <span className="gt199-kind">Phác đồ</span>
                    {kindLabel}
                    <strong>{reg.scenario}</strong>
                  </summary>
                  {body}
                </details>
              );
            })}
          </article>
        );
      })}

      {moduleContent}

      {/* Khong hien danh sach "noi dung chua trich xuat" (ghi chu quy trinh, khong phai van phong dieu tri). */}
      {/* Mot khoi nguon duy nhat: to chuc, ten huong dan, nam (moi nhat truoc). */}
      <details className="gt199-cite">
        <summary>Nguồn và đối chiếu</summary>
        <ul>
          {entry.guidelineIds
            .map((gid) => INTL_GUIDELINES[gid])
            .filter((g): g is NonNullable<typeof g> => !!g)
            .sort((a, b) => (Number(String(b.published).match(/\d{4}/)?.[0]) || 0) - (Number(String(a.published).match(/\d{4}/)?.[0]) || 0))
            .map((g) => {
              const label = `${g.org}. ${g.title} (${String(g.published).match(/\d{4}/)?.[0] ?? g.published})`;
              return <li key={g.title}>{g.url ? <a href={g.url} target="_blank" rel="noopener noreferrer">{label}</a> : label}</li>;
            })}
        </ul>
      </details>
      <GtStyle />
    </section>
  );
}

/* ---------------- Tab 3 ---------------- */

export function CompareTab({ diseaseId }: { diseaseId: string }) {
  if (diseaseId === "v8-6") return <section className="bv199-panel gt199"><p className="gt199-note">Phác đồ tab Việt Nam áp dụng QĐ 2131/QĐ-BYT ngày 14/7/2026.</p></section>;
  const c = getComparison(diseaseId);
  if (!c) {
    return (
      <section className="bv199-panel gt199">
        <div className="bv199-label">SO SÁNH HAI NGUỒN</div>
        <div className="gt199-note">
          Mặt bệnh này hiện áp dụng theo hướng dẫn của Bộ Y tế (tab Việt Nam).
        </div>
        <GtStyle />
      </section>
    );
  }

  const block = (title: string, items: string[], tone: string) => (
    <div className={`gt199-cmp gt199-cmp-${tone}`}>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => clinicalText(capitalizeBullet(item))).filter(Boolean).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="bv199-panel gt199">
      <div className="bv199-label">SO SÁNH HAI NGUỒN</div>
      <div className="gt199-cmp-grid">
        {block("Điểm giống", c.similar, "same")}
        {block("Điểm khác", c.different, "diff")}
        {block("Điều kiện áp dụng", c.conditions, "cond")}
      </div>
      <p className="gt199-note">
        So sánh chỉ dựa trên nội dung đang hiển thị ở Tab 1 và Tab 2; không tạo phác đồ
        mới từ hai nguồn.
      </p>
      {/* Quy tac chung: vi tri nguon (muc, bang, trang) gom vao "Nguon va can cu", mac dinh dong. */}
      <details className="gt199-cite">
        <summary>Nguồn và căn cứ</summary>
        <p><strong>Việt Nam:</strong> {clinicalText(c.vn)}</p>
        <p><strong>Quốc tế:</strong> {clinicalText(c.intl)}</p>
      </details>
      <GtStyle />
    </section>
  );
}

/* ---------------- Tab 4 ---------------- */

export function SourcesTab({ diseaseId, extra }: { diseaseId: string; extra?: ReactNode }) {
  const docs = vnDocsFor(diseaseId);
  const superseded = SUPERSEDED_LOG.filter((s) => s.diseaseId === diseaseId);
  const moduleRules = MODULE_SUPERSEDES.filter((s) => s.diseaseId === diseaseId);
  const entry = getIntlEntry(diseaseId);
  const state = completeness(diseaseId);
  const moduleLabels = (MODULE_DOCS[diseaseId] ?? []).filter((m) => m.label);

  return (
    <section className="bv199-panel gt199">
      <div className="bv199-label">NGUỒN TÀI LIỆU, PHIÊN BẢN, NGÀY CẬP NHẬT</div>

      <EvidencePanel diseaseId={diseaseId} />

      <div className="gt199-state">
        <span className={state.byt ? "ok" : "no"}>BYT: {state.byt ? (state.bytDoses ? "có, có liều" : "có, không nêu liều") : "chưa có"}</span>
        <span className={state.intlVerified ? "ok" : "no"}>Quốc tế: {state.intlVerified ? "đã xác minh" : "CHƯA XÁC MINH"}</span>
        <span className={state.comparison ? "ok" : "no"}>So sánh: {state.comparison ? "có" : "chưa"}</span>
      </div>

      <h4>1. Văn bản Bộ Y tế</h4>
      {docs.length === 0 ? (
        <p className="gt199-note">Không có văn bản BYT trong cơ sở dữ liệu cho mặt bệnh này.</p>
      ) : (
        <ul className="gt199-src">
          {docs.map((doc) => {
            const info = DOCS[doc];
            const lifecycle = confirmedLifecycle(doc);
            const dropped = moduleRules.some((m) => m.dropped === doc) || superseded.some((s) => s.dropped.includes(doc));
            const role = dropped
              ? "Có quy tắc ẩn phần trùng trong dữ liệu; cần phân biệt với quyết định thay thế chính thức"
              : "Cần thẩm định phạm vi áp dụng; không suy từ năm xuất bản";
            return (
              <li key={doc}>
                <strong>QĐ {info.number}</strong> ({info.date}) – {info.title}
                <span className="gt199-role">{lifecycle ? SOURCE_ROLE_TEXT[lifecycle.role] : SOURCE_ROLE_TEXT.REVIEW_REQUIRED} · {role}</span>
                {lifecycle && <span className="gt199-loc">{lifecycle.scope} · kiểm tra {lifecycle.checkedOn} · <a href={lifecycle.url} target="_blank" rel="noopener noreferrer">Nguồn chính thức</a></span>}
                <span className="gt199-loc">{info.validity}</span>
              </li>
            );
          })}
        </ul>
      )}

      {(superseded.length > 0 || moduleRules.length > 0) && (
        <>
          <h4>Lịch sử: nội dung đã được thay thế</h4>
          <ul className="gt199-src">
            {moduleRules.map((m) => (
              <li key={`m-${m.dropped}`}>{m.reason}</li>
            ))}
            {superseded
              .filter((s) => !moduleRules.some((m) => m.kept === s.kept))
              .map((s) => (
                <li key={`s-${s.kept}`}>
                  Giữ QĐ {DOCS[s.kept].number}; ẩn phần trùng của {s.dropped.map((d) => `QĐ ${DOCS[d].number}`).join(", ")} (quy tắc văn bản mới nhất thay văn bản cũ).
                </li>
              ))}
          </ul>
        </>
      )}

      {diseaseId === "v8-1" && (
        <details className="gt199-more">
          <summary>Lịch sử hướng dẫn · QĐ4815/2020</summary>
          <p>QĐ2147/QĐ-BYT thay thế QĐ4815/2020 từ15/7/2026 trong phạm vi CAP người lớn. Không đưa bản2020 vào khu vực nguồn hiện hành.</p>
          <a href={confirmedLifecycle("byt4815-2020")?.url} target="_blank" rel="noopener noreferrer">Thông báo thay thế chính thức</a>
        </details>
      )}

      {moduleLabels.length > 0 && (
        <>
          <h4>2. Hướng dẫn Việt Nam bổ sung</h4>
          <ul className="gt199-src">
            {moduleLabels.map((m) => (
              <li key={m.label}>{m.label}</li>
            ))}
          </ul>
        </>
      )}

      <h4>{moduleLabels.length > 0 ? "3" : "2"}. Hướng dẫn quốc tế</h4>
      {!entry ? (
        <p className="gt199-note">CHƯA XÁC MINH – chưa có nguồn quốc tế đã đọc cho mặt bệnh này.</p>
      ) : (
        <ul className="gt199-src">
          {entry.guidelineIds.map((gid) => {
            const g = INTL_GUIDELINES[gid];
            return (
              <li key={gid}>
                <strong>{g.org}</strong> – {g.title}. {g.citation}. Công bố {g.published}.
                <span className="gt199-role">{SOURCE_ROLE_TEXT[confirmedLifecycle(gid)?.role ?? sourceRole({originalRead:g.status !== "identified",publicationConfirmed:g.status !== "identified",scopeConfirmed:false})]} · {STATUS_TEXT[g.status]} · kiểm tra {confirmedLifecycle(gid)?.checkedOn ?? g.checkedOn}</span>
                {confirmedLifecycle(gid) && <span className="gt199-loc">{confirmedLifecycle(gid)?.scope}</span>}
                <span className="gt199-loc">{g.checkNote}</span>
              </li>
            );
          })}
          {(entry.gaps ?? []).map((gap) => (
            <li key={gap} className="gt199-gap">{gap}</li>
          ))}
        </ul>
      )}

      <h4>{moduleLabels.length > 0 ? "4" : "3"}. Đối chiếu liều và thông tin thuốc</h4>
      <ul className="gt199-src">
        {DOSE_REFERENCES.map((ref) => (
          <li key={ref.name}>
            <strong>{ref.name}</strong> – {ref.use}
            <span className="gt199-loc">{ref.status}</span>
          </li>
        ))}
        <li>
          <strong>Danh mục thuốc BV199</strong> – {FORMULARY_SOURCE}
          <span className="gt199-loc">Dùng cho bộ lọc danh mục; chưa ghi kỳ hiệu lực của danh mục.</span>
        </li>
      </ul>

      {extra}
      {INTERNATIONAL_DOSE_REVIEWS.some(r => r.diseaseIds.includes(diseaseId)) && <details className="gt199-more">
        <summary>Nguồn bổ sung cho bảng liều tham khảo</summary>
        <ul className="gt199-src">{INTERNATIONAL_DOSE_REVIEWS.filter(r=>r.diseaseIds.includes(diseaseId)).map(r=><li key={r.id}><strong>{r.source} · {r.published}</strong><p>{r.locator}</p><a href={r.url} target="_blank" rel="noopener noreferrer">Mở tài liệu</a></li>)}</ul>
      </details>}
      <GtStyle />
    </section>
  );
}

function GtStyle() {
  return (
    <style>{`
      .gt199 h3 { font-size: 14px; margin: 0 0 4px; line-height: 1.5; }
      .gt199 h4 { font-size: 13px; margin: 14px 0 6px; color: #17364b; }
      .gt199-banner { margin: 8px 0; padding: 10px 12px; border-radius: 10px; background: #eef4ff; border: 1px solid #c7d7fe; color: #1e3a8a; font-size: 12px; line-height: 1.6; }
      .gt199-scope { font-size: 12px; color: #33505f; line-height: 1.7; margin: 6px 0 10px; }
      .gt199-guide { border: 1px solid #dbe6ed; border-radius: 10px; padding: 12px; margin-bottom: 10px; }
      .gt199-cite { font-size: 11px; color: #647b8c; margin: 0 0 8px; line-height: 1.6; overflow-wrap: break-word; }
      .gt199-status { display: inline-block; margin-left: 8px; padding: 1px 8px; border-radius: 99px; font-size: 10px; font-weight: 700; vertical-align: middle; }
      .gt199-status-extracted { background: #dcfce7; color: #166534; }
      .gt199-status-identified { background: #fef3c7; color: #92400e; }
      .gt199-status-module { background: #e0f2fe; color: #075985; }
      .gt199-recs, .gt199-reg ul, .gt199-src, .gt199-cmp ul { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.7; }
      .gt199-recs li, .gt199-src li { margin-bottom: 6px; }
      .gt199-loc { display: block; font-size: 11px; color: #647b8c; }
      .gt199-kind { display: inline-block; margin-bottom: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 800; }
      .gt199-kind-empiric { background: #dcfce7; color: #166534; }
      .gt199-kind-pathogen-directed { background: #dbeafe; color: #1e40af; }
      .gt199-kind-trial-dosing { background: #fee2e2; color: #991b1b; }
      .gt199-role { display: inline-block; margin-left: 6px; font-size: 11px; font-weight: 700; color: #087f89; }
      .gt199-reg { margin-top: 10px; padding: 10px; border-radius: 9px; background: #f5f9fb; font-size: 13px; }
      .gt199-note { font-size: 11px; color: #647b8c; line-height: 1.6; margin: 6px 0 0; }
      details.gt199-reg > summary { cursor: pointer; list-style: revert; }
      .gt199-more { margin-top: 6px; font-size: 12.5px; }
      .gt199-more > summary, .gt199-links > summary { cursor: pointer; color: #087f89; font-weight: 700; font-size: 12px; }
      .gt199-links { margin-top: 6px; }
      .gt199-gap { color: #92400e; }
      .gt199-gaps > summary, .gt199-cite > summary { cursor: pointer; }
      .gt199-cite > summary { font-weight: 700; color: #1e3a5f; font-size: 12px; }
      details.gt199-cite[open] { padding: 8px 10px; border: 1px solid #dce6ed; border-radius: 8px; background: #f7fafc; }
      .gt199 :is(summary):focus-visible { outline: 3px solid #087f89; outline-offset: 3px; }
      .gt199-cmp-grid { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
      .gt199-cmp { border-radius: 10px; padding: 10px 12px; border: 1px solid #dbe6ed; }
      .gt199-cmp h4 { margin: 0 0 6px; }
      .gt199-cmp-same { background: #f0fdf4; border-color: #bbf7d0; }
      .gt199-cmp-diff { background: #fff7ed; border-color: #fed7aa; }
      .gt199-cmp-cond { background: #f8fafc; }
      .gt199-state { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0 4px; }
      .gt199-state span { padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 700; }
      .gt199-state .ok { background: #dcfce7; color: #166534; }
      .gt199-state .no { background: #fee2e2; color: #991b1b; }
    `}</style>
  );
}
