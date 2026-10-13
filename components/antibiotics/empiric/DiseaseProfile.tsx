"use client";

/*
  FILE: components/antibiotics/empiric/DiseaseProfile.tsx

  Ho so mat benh theo khung A-F cua prompt chuan (Nhan dien, Tai lieu goc,
  Danh gia truoc dieu tri, Lua chon dieu tri, Theo doi, Nguon chung cu).
  Phan nao CHUA co du lieu da xac minh thi hien ro "chua nhap" - khong tu dien.
*/

import type { ReactNode } from "react";

import {
  DATA_STATUS_LABEL,
  SOURCE_LABEL_TEXT,
  STREAM_TEXT,
  type CanonicalGroup,
  type DataStatus,
  type Disease,
  type SourceLabel,
  type Stream,
} from "../../../data/antibiotics/empiric/types";

type Props = {
  disease: Disease;
  stream: Stream;
  population: string;
  status: DataStatus;
  sourceLabel: SourceLabel;
  statusNote: string;
  groups: CanonicalGroup[];
  hasModule: boolean;
  onSelectDisease: (id: string) => void;
  titleOf: (id: string) => string;
};

const BADGE_COLORS: Record<DataStatus, { bg: string; fg: string }> = {
  0: { bg: "#eef1f4", fg: "#51606d" },
  1: { bg: "#fde8e8", fg: "#9b2c2c" },
  2: { bg: "#fff3d6", fg: "#8a5a00" },
  3: { bg: "#e3effd", fg: "#1c4e9a" },
  4: { bg: "#e0f5ea", fg: "#16643d" },
  5: { bg: "#d4f1e4", fg: "#0b5a37" },
};

function Block({
  code,
  title,
  children,
}: {
  code: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="dp-block">
      <summary>
        <span className="dp-code">{code}</span> {title}
      </summary>
      <div className="dp-body">{children}</div>
    </details>
  );
}

function Pending({ items }: { items: string[] }) {
  return (
    <ul className="dp-pending">
      {items.map((item) => (
        <li key={item}>
          {item}: <em>chưa nhập dữ liệu đã xác minh</em>
        </li>
      ))}
    </ul>
  );
}

export function StatusBadge({ status }: { status: DataStatus }) {
  const color = BADGE_COLORS[status];

  return (
    <span
      className="dp-badge"
      style={{ background: color.bg, color: color.fg }}
      title={DATA_STATUS_LABEL[status]}
    >
      {status === 0 ? "Trạng thái 0" : `Trạng thái ${status}/5`} ·{" "}
      {DATA_STATUS_LABEL[status]}
    </span>
  );
}

export default function DiseaseProfile({
  disease,
  stream,
  population,
  status,
  sourceLabel,
  statusNote,
  groups,
  hasModule,
  onSelectDisease,
  titleOf,
}: Props) {
  return (
    <section className="bv199-panel dp-root">
      <style>{`
        .dp-root { display: grid; gap: 10px; }
        .dp-badge {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.5;
        }
        .dp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 8px;
        }
        .dp-cell {
          background: #f4f9fb;
          border-radius: 9px;
          padding: 10px;
          font-size: 12px;
          line-height: 1.6;
        }
        .dp-cell b { display: block; color: #087f89; font-size: 11px; }
        .dp-block {
          border: 1px solid #dce6ed;
          border-radius: 9px;
          overflow: hidden;
        }
        .dp-block summary {
          padding: 11px;
          background: #f6f9fb;
          font-size: 13px;
        }
        .dp-code {
          display: inline-block;
          min-width: 22px;
          text-align: center;
          background: #087f89;
          color: #fff;
          border-radius: 5px;
          font-size: 11px;
          padding: 1px 5px;
          margin-right: 5px;
        }
        .dp-body {
          padding: 11px;
          font-size: 12px;
          line-height: 1.8;
        }
        .dp-pending { margin: 0; padding-left: 18px; }
        .dp-pending em { color: #8a5a00; }
        .dp-link {
          border: 0;
          background: transparent;
          color: #087f89;
          cursor: pointer;
          padding: 0;
          font-size: 12px;
          text-decoration: underline;
        }
      `}</style>

      <div className="bv199-label">
        HƯỚNG DẪN ĐIỀU TRỊ · HỒ SƠ MẶT BỆNH
      </div>

      <div>
        <StatusBadge status={status} />
      </div>

      <div className="bv199-warning">
        {hasModule
          ? "Mặt bệnh đã có module tra cứu bên trên. Hồ sơ dưới đây cho biết phạm vi dữ liệu và những phần còn thiếu."
          : "Chưa nhập phác đồ kháng sinh kinh nghiệm đã xác minh cho mặt bệnh này. Không tự suy từ hướng dẫn của bệnh khác."}
        <div>{statusNote}</div>
      </div>

      <Block code="A" title="Nhận diện mặt bệnh">
        <div className="dp-grid">
          <div className="dp-cell">
            <b>ID trong app</b>
            {disease.id}
          </div>
          <div className="dp-cell">
            <b>Chuyên khoa</b>
            {disease.specialty}
          </div>
          <div className="dp-cell">
            <b>Luồng điều trị</b>
            {STREAM_TEXT[stream]}
          </div>
          <div className="dp-cell">
            <b>Đối tượng (gợi ý từ tên/chuyên khoa)</b>
            {population}
          </div>
          <div className="dp-cell">
            <b>Nhãn nguồn hiện có</b>
            {SOURCE_LABEL_TEXT[sourceLabel]}
          </div>
          <div className="dp-cell">
            <b>Ngoại trú / nội trú / ICU</b>
            Chưa xác định
          </div>
        </div>

        {groups.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <b>Mặt bệnh liên kết (đề xuất, chưa gộp nội dung):</b>
            <ul>
              {groups.map((group) => (
                <li key={group.code}>
                  {group.code} –{" "}
                  {group.type === "duplicate-candidate"
                    ? "ứng viên trùng"
                    : "cùng họ bệnh"}
                  . {group.note}
                  <div>
                    {group.ids
                      .filter((id) => id !== disease.id)
                      .map((id) => (
                        <span key={id}>
                          <button
                            type="button"
                            className="dp-link"
                            onClick={() => onSelectDisease(id)}
                          >
                            {titleOf(id)}
                          </button>{" "}
                        </span>
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Block>

      <Block code="B" title="Tài liệu gốc">
        <Pending
          items={[
            "Tên đầy đủ văn bản",
            "Số và ngày quyết định",
            "Đơn vị ban hành",
            "Tình trạng hiệu lực đã kiểm tra",
            "Quyết định sửa đổi/thay thế",
            "Chương, mục, bảng, số trang",
            "URL chính thức",
            "Ngày kiểm tra nguồn",
          ]}
        />
      </Block>

      <Block code="C" title="Đánh giá trước điều trị">
        <Pending
          items={[
            "Tiêu chuẩn chẩn đoán",
            "Chỉ định / không chỉ định kháng sinh",
            "Mức độ nặng và thang điểm",
            "Tác nhân nghi ngờ",
            "Nguy cơ đa kháng và tiền sử kháng sinh",
            "Dị ứng thuốc",
            "Chức năng thận, gan, thai kỳ, bệnh đồng mắc",
            "Chỉ định lấy mẫu vi sinh",
          ]}
        />
      </Block>

      <Block code="D" title="Lựa chọn điều trị kinh nghiệm">
        <Pending
          items={[
            "Phác đồ đầu tay (thuốc, liều, đường dùng, tần suất, thời gian)",
            "Phác đồ thay thế",
            "Nhánh dị ứng beta-lactam",
            "Nhánh nguy cơ MRSA / Pseudomonas / ESBL / CRE",
            "Nhánh nhiễm khuẩn nặng, sốc nhiễm khuẩn",
            "Nhánh suy thận, AKI, ARC, RRT",
            "Điều chỉnh theo kết quả AST/MIC",
          ]}
        />
      </Block>

      <Block code="E" title="Theo dõi và đánh giá lại">
        <Pending
          items={[
            "Chỉ số theo dõi và thời điểm đánh giá đáp ứng",
            "Điều kiện xuống thang và chuyển IV–PO",
            "Thất bại điều trị và hướng xử trí",
            "Hội chẩn, chuyển khám, kiểm soát ổ nhiễm",
          ]}
        />
      </Block>

      <Block code="F" title="Nguồn chứng cứ và trạng thái thẩm định">
        <p style={{ marginTop: 0 }}>
          {DATA_STATUS_LABEL[status]}. Trạng thái 5 chỉ được đặt khi có hồ sơ
          thẩm định của bộ phận chuyên môn BV199.
        </p>
      </Block>
    </section>
  );
}
