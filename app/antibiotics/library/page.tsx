
"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
} from "react";

import {
  protocols,
  validateProtocols,
  type Module,
  type Regimen,
} from "../../../data/antibiotics/catalog";

const LABELS: Record<Module, string> = {
  empiric: "Điều trị kinh nghiệm",
  organism: "Theo tác nhân",
  antifungal: "Kháng nấm",
  prophylaxis: "KSDP",
};

const MODULES: Module[] = [
  "empiric",
  "organism",
  "antifungal",
  "prophylaxis",
];

const card: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #dbe5eb",
  borderRadius: 14,
  padding: 18,
};

const control: CSSProperties = {
  width: "100%",
  border: "1px solid #cbd9e4",
  borderRadius: 9,
  padding: "11px 12px",
  background: "#ffffff",
  color: "#173549",
  boxSizing: "border-box",
};

function Regimens({
  title,
  items,
}: {
  title: string;
  items: Regimen[];
}) {
  return (
    <section style={{ marginTop: 21 }}>
      <h3 style={{
        fontSize: 17,
        margin: "0 0 12px",
      }}>
        {title}
      </h3>

      {items.length === 0 && (
        <div style={{
          background: "#fff7e7",
          padding: 12,
          borderRadius: 9,
          fontSize: 13,
          lineHeight: 1.6,
        }}>
          Chưa có phác đồ được trích xuất và
          kiểm tra từ nguồn. Không tự đề xuất thuốc.
        </div>
      )}

      {items.map((r, index) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #e0e7ed",
            borderRadius: 10,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <div style={{
            fontWeight: 700,
            color: "#0b6574",
            fontSize: 15,
          }}>
            {index + 1}. {r.drugs.join(" + ")}
          </div>

          <div style={{
            color: "#5d7282",
            fontSize: 12,
            marginTop: 4,
          }}>
            {r.label}
          </div>

          <div style={{
            fontSize: 13,
            lineHeight: 1.85,
            marginTop: 8,
          }}>
            <div>
              <b>Liều người lớn: </b>
              {r.adultDose || "Chưa có dữ liệu"}
            </div>

            <div>
              <b>Đường dùng: </b>
              {r.route || "Cần xác minh từ nguồn"}
            </div>

            <div>
              <b>Thời điểm dùng: </b>
              {r.timing || "Chưa có dữ liệu"}
            </div>

            <div>
              <b>Nhắc liều: </b>
              {r.redose || "Chưa có dữ liệu"}
            </div>

            <div>
              <b>Thời gian/ngừng: </b>
              {r.duration || "Chưa có dữ liệu"}
            </div>

            {r.conditions.length > 0 && (
              <div>
                <b>Điều kiện: </b>
                {r.conditions.join("; ")}
              </div>
            )}

            <div style={{
              color: "#637789",
              marginTop: 4,
            }}>
              <b>Vị trí nguồn: </b>
              {r.sourceSection}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function BV199Library() {
  const [module, setModule] =
    useState<Module>("prophylaxis");

  const [specialty, setSpecialty] =
    useState("all");

  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] =
    useState("ksdp-cesarean");

  const list = useMemo(
    () => protocols.filter(p => p.module === module),
    [module]
  );

  const specialties = [
    ...new Set(list.map(p => p.specialty)),
  ];

  const filtered = list.filter(p => {
    const validSpecialty =
      specialty === "all" ||
      p.specialty === specialty;

    const searchText = [
      p.name,
      p.scenario,
      p.specialty,
      p.indication,
    ].join(" ").toLocaleLowerCase("vi");

    return (
      validSpecialty &&
      searchText.includes(
        query.toLocaleLowerCase("vi")
      )
    );
  });

  const selected =
    filtered.find(p => p.id === selectedId) ||
    filtered[0];

  const errors = validateProtocols(protocols);

  return (
    <main style={{
      maxWidth: 1340,
      margin: "0 auto",
      padding: "24px 16px 60px",
      fontFamily: "Arial, sans-serif",
      color: "#173549",
    }}>
      <div style={{
        fontSize: 12,
        color: "#057f88",
        fontWeight: 700,
        letterSpacing: 1,
      }}>
        KHOA DƯỢC · BỆNH VIỆN 199
      </div>

      <h1 style={{
        fontSize: 26,
        margin: "9px 0",
      }}>
        Tra cứu kháng nhiễm khuẩn
      </h1>

      <p style={{
        color: "#647b8b",
        fontSize: 14,
      }}>
        Điều trị kinh nghiệm, điều trị theo tác nhân,
        kháng nấm và kháng sinh dự phòng.
      </p>

      <div style={{
        background: "#fff6e6",
        padding: 13,
        borderRadius: 10,
        fontSize: 13,
        lineHeight: 1.7,
        margin: "14px 0 18px",
      }}>
        <b>Dữ liệu đang xây dựng:</b>
        {" "}Chưa phải phác đồ BV199 được phê duyệt.
        Bộ dữ liệu mẫu chưa bao gồm toàn bộ các mặt bệnh.
        {" "}
        {errors.length > 0
          ? `Có ${errors.length} lỗi cấu trúc cần xử lý.`
          : "Không phát hiện lỗi cấu trúc trong dữ liệu mẫu."}
      </div>

      <div style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 17,
      }}>
        {MODULES.map(m => (
          <button
            type="button"
            key={m}
            onClick={() => {
              setModule(m);
              setSpecialty("all");
              setQuery("");
              setSelectedId("");
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 9,
              border:
                module === m
                  ? "1px solid #008f95"
                  : "1px solid #dce5eb",
              background:
                module === m
                  ? "#e3f7f5"
                  : "#ffffff",
              color: "#173549",
              fontWeight: module === m ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 16,
        alignItems: "start",
      }}>
        <section style={card}>
          <h2 style={{
            fontSize: 18,
            marginTop: 0,
          }}>
            1. Chọn bệnh cảnh
          </h2>

          <input
            style={control}
            placeholder="Tìm mặt bệnh, phẫu thuật..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          <label style={{
            display: "block",
            fontSize: 13,
            margin: "14px 0 6px",
            fontWeight: 700,
          }}>
            Chuyên khoa
          </label>

          <select
            style={control}
            value={specialty}
            onChange={e => {
              setSpecialty(e.target.value);
              setSelectedId("");
            }}
          >
            <option value="all">
              Tất cả chuyên khoa
            </option>

            {specialties.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <p style={{
            fontSize: 12,
            color: "#637789",
          }}>
            Tìm thấy {filtered.length} bệnh cảnh
          </p>

          <div style={{
            display: "grid",
            gap: 8,
            maxHeight: 550,
            overflowY: "auto",
          }}>
            {filtered.map(p => (
              <button
                type="button"
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderRadius: 10,
                  border:
                    selected?.id === p.id
                      ? "1px solid #00999b"
                      : "1px solid #e0e7ed",
                  background:
                    selected?.id === p.id
                      ? "#e8f8f5"
                      : "white",
                  color: "#173549",
                  cursor: "pointer",
                }}
              >
                <b>{p.name}</b>

                <div style={{
                  color: "#687f91",
                  fontSize: 12,
                  marginTop: 5,
                }}>
                  {p.specialty}
                </div>

                <div style={{
                  color: "#687f91",
                  fontSize: 12,
                  marginTop: 4,
                }}>
                  {p.scenario}
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <p>Không có dữ liệu phù hợp.</p>
            )}
          </div>
        </section>

        <article style={card}>
          {!selected ? (
            <p>Chọn bệnh cảnh bên trái.</p>
          ) : (
            <>
              <div style={{
                fontSize: 12,
                color: "#07838c",
                fontWeight: 700,
              }}>
                {LABELS[selected.module].toUpperCase()}
              </div>

              <h2 style={{
                fontSize: 23,
                margin: "10px 0",
              }}>
                {selected.name}
              </h2>

              <p style={{
                fontSize: 13,
                color: "#526c7d",
              }}>
                <b>Bệnh cảnh: </b>
                {selected.scenario}
              </p>

              <div style={{
                background: "#eef6f8",
                borderRadius: 9,
                padding: 13,
                lineHeight: 1.7,
                fontSize: 14,
              }}>
                <b>Chỉ định / phân tầng: </b>
                {selected.indication}
              </div>

              <Regimens
                title="2. Lựa chọn theo nguồn"
                items={selected.preferred}
              />

              <Regimens
                title="3. Lựa chọn thay thế"
                items={selected.alternatives}
              />

              <section style={{
                marginTop: 20,
                fontSize: 13,
                lineHeight: 1.8,
              }}>
                <b>4. Lưu ý lâm sàng</b>

                <ul style={{ paddingLeft: 21 }}>
                  {selected.notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </section>

              <div style={{
                borderTop: "1px solid #e0e7ed",
                paddingTop: 14,
                fontSize: 12,
                lineHeight: 1.9,
              }}>
                <b>5. Nguồn tài liệu</b>

                <div>{selected.source.title}</div>

                <div>
                  <b>Đơn vị: </b>
                  {selected.source.publisher}
                </div>

                <div>
                  <b>Phiên bản: </b>
                  {selected.source.year}
                </div>

                <div>
                  <b>Vị trí: </b>
                  {selected.source.location}
                </div>

                {selected.source.url && (
                  <a
                    href={selected.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#087f8b" }}
                  >
                    Xem tài liệu nguồn
                  </a>
                )}

                <div style={{
                  marginTop: 9,
                  color:
                    selected.bv199Approved &&
                    selected.review === "approved"
                      ? "#08735f"
                      : "#9c650b",
                }}>
                  <b>Trạng thái: </b>
                  {selected.bv199Approved &&
                  selected.review === "approved"
                    ? "Đã phê duyệt"
                    : "Chờ thẩm định – chưa phải phác đồ BV199"}
                </div>
              </div>
            </>
          )}
        </article>
      </div>
    </main>
  );
}
