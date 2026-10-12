
"use client";

import type { CSSProperties } from "react";

import {
  findGuidelines,
  type SourceKind,
  type TreatmentGuideline,
  type TreatmentRegimen,
} from "../../data/antibiotics/byt-guidelines";

const box: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #dce7ef",
  borderRadius: 12,
  padding: 16,
};

function RegimenCard({
  regimen,
}: {
  regimen: TreatmentRegimen;
}) {
  const roleNames = {
    preferred: "Lựa chọn ưu tiên",
    alternative: "Lựa chọn thay thế",
    equivalent: "Lựa chọn tương đương",
    conditional: "Lựa chọn có điều kiện",
  };

  return (
    <div style={{
      border: "1px solid #dbe5ec",
      borderRadius: 10,
      padding: 14,
      marginTop: 10,
      background: "#f7fafc",
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: "#087886",
      }}>
        {roleNames[regimen.role]}
      </div>

      <h4 style={{
        margin: "7px 0 10px",
        fontSize: 16,
      }}>
        {regimen.label}
      </h4>

      {regimen.conditions.length > 0 && (
        <p style={{ fontSize: 13 }}>
          <b>Điều kiện:</b>{" "}
          {regimen.conditions.join("; ")}
        </p>
      )}

      {regimen.drugs.map((drug, index) => (
        <div key={index} style={{
          borderTop: "1px solid #dce7ef",
          paddingTop: 10,
          marginTop: 10,
          lineHeight: 1.8,
          fontSize: 13,
        }}>
          <b>{drug.ingredient}</b>

          <div>
            Liều: {drug.dose ?? "Chưa có dữ liệu"}
          </div>

          <div>
            Đường dùng:{" "}
            {drug.route ?? "Chưa có dữ liệu"}
          </div>

          <div>
            Khoảng cách:{" "}
            {drug.interval ?? "Chưa có dữ liệu"}
          </div>

          <div>
            Thời gian truyền:{" "}
            {drug.infusionTime ?? "Chưa có dữ liệu"}
          </div>

          <div>
            Thời gian điều trị:{" "}
            {drug.duration ?? "Chưa có dữ liệu"}
          </div>

          {drug.renalAdjustment && (
            <div>
              Hiệu chỉnh liều:{" "}
              {drug.renalAdjustment}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GuidelineRow({
  sourceKind,
  data,
}: {
  sourceKind: SourceKind;
  data: TreatmentGuideline[];
}) {
  const isBYT = sourceKind === "BYT";

  return (
    <section style={box}>
      <h3 style={{
        margin: "0 0 12px",
        fontSize: 17,
        color: "#086c7b",
      }}>
        {isBYT
          ? "HÀNG 1 – BỘ Y TẾ VIỆT NAM"
          : "HÀNG 2 – GUIDELINE QUỐC TẾ"}
      </h3>

      {data.length === 0 ? (
        <div style={{
          background: "#fff7e8",
          padding: 13,
          borderRadius: 8,
          fontSize: 13,
          lineHeight: 1.7,
        }}>
          Chưa có phác đồ được xác minh
          cho mặt bệnh và bệnh cảnh này.

          Không tự động đề xuất thuốc,
          liều hoặc thời gian điều trị.
        </div>
      ) : (
        data.map((item) => (
          <div key={item.id} style={{
            marginBottom: 18,
            lineHeight: 1.8,
            fontSize: 13,
          }}>
            <h4 style={{ fontSize: 16 }}>
              {item.scenarioName}
            </h4>

            <div>
              <b>Tài liệu:</b>{" "}
              {item.evidence.title}
            </div>

            <div>
              <b>Cơ quan:</b>{" "}
              {item.evidence.organization}
            </div>

            <div>
              <b>Số quyết định:</b>{" "}
              {item.evidence.decisionNumber ??
                "Không áp dụng"}
            </div>

            <div>
              <b>Phiên bản:</b>{" "}
              {item.evidence.version ??
                "Chưa xác minh"}
            </div>

            <div>
              <b>Vị trí nguồn:</b>{" "}
              {item.evidence.section ??
                "Chưa có"}
              {" · "}
              {item.evidence.page ?? ""}
            </div>

            <div>
              <b>Chỉ định kháng sinh:</b>{" "}
              {item.antibioticIndication ??
                "Chưa có dữ liệu"}
            </div>

            {item.regimens.length === 0 ? (
              <p style={{
                color: "#996516",
                background: "#fff7e8",
                padding: 11,
                borderRadius: 8,
              }}>
                Chưa có lựa chọn kháng sinh
                được trích xuất và thẩm định.
              </p>
            ) : (
              item.regimens.map((regimen) => (
                <RegimenCard
                  key={regimen.id}
                  regimen={regimen}
                />
              ))
            )}

            {item.monitoring.length > 0 && (
              <p>
                <b>Theo dõi:</b>{" "}
                {item.monitoring.join("; ")}
              </p>
            )}

            {item.deescalation.length > 0 && (
              <p>
                <b>Xuống thang:</b>{" "}
                {item.deescalation.join("; ")}
              </p>
            )}

            {item.evidence.url && (
              <a
                href={item.evidence.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#087886" }}
              >
                Xem tài liệu gốc
              </a>
            )}

            <div style={{
              marginTop: 10,
              color: item.approvedForBV199 &&
                item.reviewStatus === "approved"
                  ? "#147458"
                  : "#97631c",
            }}>
              {item.approvedForBV199 &&
              item.reviewStatus === "approved" &&
              item.approvalReference
                ? "Đã có hồ sơ phê duyệt BV199"
                : "Dữ liệu tham khảo – chưa phê duyệt BV199"}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default function BytGuidelinePanel({
  diseaseId,
  scenarioId,
}: {
  diseaseId: string;
  scenarioId?: string;
}) {
  const result = findGuidelines(
    diseaseId,
    scenarioId
  );

  return (
    <div style={{
      display: "grid",
      gap: 14,
      marginTop: 24,
    }}>
      <h2 style={{
        margin: 0,
        fontSize: 21,
      }}>
        Đối chiếu điều trị kháng sinh
      </h2>

      <p style={{
        margin: 0,
        fontSize: 13,
        color: "#607587",
      }}>
        Hai nguồn độc lập theo cùng
        mặt bệnh và bệnh cảnh lâm sàng.
      </p>

      <GuidelineRow
        sourceKind="BYT"
        data={result.byt}
      />

      <GuidelineRow
        sourceKind="GUIDELINE"
        data={result.international}
      />

      <section style={{
        ...box,
        background: "#f3f8fa",
        fontSize: 13,
        lineHeight: 1.8,
      }}>
        <h3 style={{
          fontSize: 17,
          marginTop: 0,
        }}>
          Đối chiếu áp dụng tại BV199
        </h3>

        <div>
          Kiểm tra thuốc trong danh mục bệnh viện.
        </div>

        <div>
          Đối chiếu antibiogram và nguy cơ
          vi khuẩn kháng thuốc.
        </div>

        <div>
          Đánh giá chức năng thận, gan,
          dị ứng, ADR, PK/PD và TDM.
        </div>

        <div>
          Phác đồ chỉ trở thành hướng dẫn
          BV199 sau khi được phê duyệt.
        </div>
      </section>
    </div>
  );
}
