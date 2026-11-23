"use client";

import { useState } from "react";
import { HV_COURSE, PATHOGENS, hvDiagnosis } from "./pneumonia-intl";
import { Legend, ReadHint, Row, Rx, RxToolStyle, Seg, byAllergy, SourceList } from "./rx-tool";
import { citeIntlSources } from "@/lib/antibiotics/source-citation";

const LEGEND: [string, string][] = [
  ["Mạnh · Có ĐK", "Mức khuyến cáo GRADE: mạnh – áp dụng cho phần lớn người bệnh, có điều kiện – cân nhắc theo từng người bệnh"],
  ["Cao → Rất thấp", "Độ tin cậy của bằng chứng"],
  ["IDSA 2026", "Hướng dẫn điều trị vi khuẩn Gram âm kháng thuốc: xếp ưu tiên/thay thế theo đồng thuận chuyên gia, không xếp mức GRADE"],
];

const SOURCES = citeIntlSources(["idsa-amr-2026", "atsidsa-hapvap-2016"]);

export default function PneumoniaIntl({ kind }: { kind: "hap" | "vap" }) {
  const [allergy, setAllergy] = useState<"no" | "yes">("no");
  const [pathogenId, setPathogenId] = useState("pa");
  const pathogen = PATHOGENS.find(({ id }) => id === pathogenId) ?? PATHOGENS[0];
  const options = byAllergy(pathogen.items, allergy === "yes");
  const diagnostics = hvDiagnosis(kind).filter(({ role }) => role !== "Bệnh phẩm" && role !== "Cấy máu");

  return (
    <section className="sa24">
      <details className="sa24-more">
        <summary>Điều trị đích khi đã có tác nhân</summary>
        <div className="sa24-form">
          <Row label="Tác nhân">
            <select value={pathogenId} onChange={(event) => setPathogenId(event.target.value)} aria-label="Tác nhân">
              {PATHOGENS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
            </select>
          </Row>
          <Row label="Dị ứng beta-lactam">
            <Seg label="Dị ứng beta-lactam" value={allergy} onChange={setAllergy} options={[{ id: "no", label: "Không" }, { id: "yes", label: "Có" }]} />
          </Row>
        </div>
        <section className="sa24-out" aria-live="polite">
          <div className="sa24-dx">
            <p><b>Hướng dẫn</b> {pathogen.source === "2016" ? "IDSA/ATS 2016" : pathogen.source === "2026" ? "IDSA 2026 – vi khuẩn Gram âm kháng thuốc" : "IDSA/ATS 2016; IDSA 2026"}</p>
          </div>
          <h4>Phác đồ đích</h4>
          <p className="sa24-tip">Phác đồ đích áp dụng khi đã định danh và có kháng sinh đồ xác nhận nhạy. Liều cho người lớn, chức năng thận và gan bình thường.</p>
          {options.state === "filtered" && <p className="sa24-warn">Với vi khuẩn kháng carbapenem, phần lớn thuốc hiệu quả là beta-lactam – cần đánh giá kỹ loại và mức độ dị ứng.</p>}
          {options.state === "only-bl" && <p className="sa24-warn">Các lựa chọn hiệu quả đều là beta-lactam – đánh giá loại, mức độ dị ứng và hội chẩn trước khi dùng.</p>}
          <ReadHint />
          <Rx items={options.shown} />
          {(pathogen.notes ?? []).map((note) => <p key={note} className="sa24-tip">{note}</p>)}
          <Legend rows={LEGEND} />
        </section>
      </details>
      <details className="sa24-more">
        <summary>Liều, xuống thang, thời gian điều trị</summary>
        <Rx items={HV_COURSE} />
      </details>
      <details className="sa24-more">
        <summary>Xét nghiệm vi sinh và chỉ điểm sinh học</summary>
        <Rx items={diagnostics} />
      </details>
      <SourceList sources={SOURCES} application={{ setting: "Hoa Kỳ", localReferences: "kháng sinh đồ của bệnh viện" }} />
      <RxToolStyle />
    </section>
  );
}
