
"use client";

import { useState, type CSSProperties } from "react";

/*
 BV199 - VIEM PHOI CONG DONG NGUOI LON
 File: components/antibiotics/CapByt2026.tsx
 Nguon: QD 2147/QD-BYT, 15/07/2026
 Muc 5.3, Bang 5.1 va Phu luc 1

 Du lieu tham khao, cho tham dinh BV199.
 Khong tu dong ke don.
*/

type Drug = {
  name: string;
  dose: string;
  route?: string;
  caution?: string;
};

type Regimen = {
  id: string;
  name: string;
  drugs: Drug[];
  indication: string;
  caution?: string;
  source: string;
};

type Scenario = {
  id: string;
  name: string;
  description: string;
  regimens: Regimen[];
  alerts: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "low",
    name: "Ngoại trú – nguy cơ thấp",
    description:
      "CAP người lớn đủ điều kiện điều trị ngoại trú, không có bệnh đồng mắc hoặc yếu tố nguy cơ kháng thuốc đáng kể.",
    regimens: [
      {
        id: "cap-amox",
        name: "Amoxicillin đơn trị",
        drugs: [
          {
            name: "Amoxicillin",
            dose: "1 g mỗi 8 giờ",
            route: "Uống",
          },
        ],
        indication:
          "Khi phù hợp với CAP nguy cơ thấp, không dị ứng penicillin.",
        source: "BYT 2026 – Mục 5.3.1",
      },
      {
        id: "cap-doxy",
        name: "Doxycyclin đơn trị",
        drugs: [
          {
            name: "Doxycyclin",
            dose: "100 mg mỗi 12 giờ",
            route: "Uống",
          },
        ],
        indication:
          "Lựa chọn khác khi phù hợp với người bệnh và căn nguyên nghi ngờ.",
        caution:
          "Đánh giá thai kỳ, chống chỉ định và tương tác thuốc.",
        source: "BYT 2026 – Mục 5.3.1",
      },
      {
        id: "cap-azithro",
        name: "Azithromycin đơn trị – có điều kiện",
        drugs: [
          {
            name: "Azithromycin",
            dose:
              "500 mg ngày đầu, sau đó 250 mg/ngày; hoặc 500 mg/ngày trong 3 ngày theo chế độ được chọn",
            route: "Uống",
          },
        ],
        indication:
          "Chỉ khi phù hợp với căn nguyên nghi ngờ và mức đề kháng macrolid.",
        caution:
          "Không sử dụng macrolid đơn trị thường quy khi đề kháng phế cầu cao hoặc thiếu dữ liệu phù hợp. Kiểm tra QT và tương tác.",
        source: "BYT 2026 – Mục 5.3.1",
      },
      {
        id: "cap-clarithro",
        name: "Clarithromycin đơn trị – có điều kiện",
        drugs: [
          {
            name: "Clarithromycin",
            dose: "500 mg mỗi 12 giờ",
            route: "Uống, dạng thông thường",
          },
        ],
        indication:
          "Áp dụng điều kiện lựa chọn macrolid tương tự azithromycin.",
        caution:
          "Kiểm tra tương tác CYP3A4, QT và dạng bào chế.",
        source: "BYT 2026 – Mục 5.3.1",
      },
    ],
    alerts: [
      "Không dùng đồng thời các thuốc đơn trị chỉ vì chúng cùng xuất hiện trong danh sách.",
      "Cần phân biệt CAP do vi khuẩn với các nguyên nhân khác và đánh giá chỉ định kháng sinh.",
    ],
  },
  {
    id: "risk",
    name: "Ngoại trú – có bệnh đồng mắc/nguy cơ",
    description:
      "Có bệnh đồng mắc hoặc yếu tố nguy cơ kháng thuốc, nhưng vẫn đủ điều kiện điều trị ngoại trú.",
    regimens: [
      {
        id: "risk-amox-azi",
        name: "Amoxicillin/clavulanat + azithromycin",
        drugs: [
          {
            name: "Amoxicillin/acid clavulanic",
            dose:
              "Chọn hàm lượng và liều theo Phụ lục 1, chế phẩm và chức năng thận",
            route: "Uống",
          },
          {
            name: "Azithromycin",
            dose:
              "500 mg ngày đầu, sau đó 250 mg/ngày; hoặc chế độ thay thế theo nguồn",
            route: "Uống",
          },
        ],
        indication:
          "Phác đồ beta-lactam kết hợp macrolid cho bệnh cảnh phù hợp.",
        caution:
          "Đây là hai thuốc dùng phối hợp. Không bổ sung thêm clarithromycin.",
        source: "BYT 2026 – Mục 5.3.1",
      },
      {
        id: "risk-amox-doxy",
        name: "Amoxicillin/clavulanat + doxycyclin",
        drugs: [
          {
            name: "Amoxicillin/acid clavulanic",
            dose:
              "Theo Phụ lục 1, hàm lượng chế phẩm và chức năng thận",
            route: "Uống",
          },
          {
            name: "Doxycyclin",
            dose: "100 mg mỗi 12 giờ",
            route: "Uống",
          },
        ],
        indication:
          "Phác đồ phối hợp khi cần bao phủ căn nguyên phù hợp và macrolid không thích hợp.",
        source: "BYT 2026 – Mục 5.3.1",
      },
      {
        id: "risk-cefp-azi",
        name: "Cefpodoxim + azithromycin",
        drugs: [
          {
            name: "Cefpodoxim",
            dose: "200 mg mỗi 12 giờ",
            route: "Uống",
          },
          {
            name: "Azithromycin",
            dose:
              "500 mg ngày đầu, sau đó 250 mg/ngày; hoặc chế độ khác theo nguồn",
            route: "Uống",
          },
        ],
        indication:
          "Một phương án cụ thể hóa lựa chọn cephalosporin đường uống phối hợp macrolid.",
        source: "BYT 2026 – Mục 5.3.1; Phụ lục 1",
      },
      {
        id: "risk-levo",
        name: "Levofloxacin đơn trị – có điều kiện",
        drugs: [
          {
            name: "Levofloxacin",
            dose:
              "Xác minh chế độ liều CAP theo Phụ lục 1 trước sử dụng; cần hiệu chỉnh khi suy thận",
            route: "Uống hoặc IV tùy bệnh cảnh",
          },
        ],
        indication:
          "Lựa chọn fluoroquinolon hô hấp khi có căn cứ sử dụng đơn trị.",
        caution:
          "Đánh giá nguy cơ ADR, QT, bệnh nền, tương tác và các hạn chế sử dụng fluoroquinolon.",
        source: "BYT 2026 – Mục 5.3.1",
      },
      {
        id: "risk-moxi",
        name: "Moxifloxacin đơn trị – có điều kiện",
        drugs: [
          {
            name: "Moxifloxacin",
            dose:
              "Xác minh chế độ liều CAP theo Phụ lục 1 và thông tin sản phẩm trước sử dụng",
            route: "Uống hoặc IV tùy bệnh cảnh",
          },
        ],
        indication:
          "Phương án khác thuộc nhóm fluoroquinolon hô hấp.",
        caution:
          "Không xem levofloxacin và moxifloxacin là hai thành phần phối hợp.",
        source: "BYT 2026 – Mục 5.3.1",
      },
    ],
    alerts: [
      "Không ghép hai beta-lactam hoặc hai macrolid với nhau từ các phương án khác nhau.",
      "Đánh giá nhập viện nếu có suy hô hấp, tổn thương rộng hoặc tiến triển nhanh.",
    ],
  },
  {
    id: "ward",
    name: "Nội trú – không ICU",
    description:
      "CAP cần nhập viện, chưa có chỉ định ICU; đánh giá riêng nguy cơ MRSA và Pseudomonas.",
    regimens: [
      {
        id: "ward-ctx-azi",
        name: "Ceftriaxon + azithromycin",
        drugs: [
          {
            name: "Ceftriaxon",
            dose: "1–2 g mỗi 24 giờ theo bệnh cảnh",
            route: "IV",
          },
          {
            name: "Azithromycin",
            dose:
              "Cần xác minh chế độ liều và đường dùng theo Bảng 4.4/Phụ lục 1",
            route: "Uống hoặc IV",
          },
        ],
        indication:
          "Phác đồ beta-lactam kết hợp macrolid khi phù hợp với CAP nhập viện.",
        source: "BYT 2026 – Mục 5.3.2; Phụ lục 1",
      },
      {
        id: "ward-ctax-azi",
        name: "Cefotaxim + azithromycin",
        drugs: [
          {
            name: "Cefotaxim",
            dose: "1–2 g mỗi 8 giờ",
            route: "IV",
          },
          {
            name: "Azithromycin",
            dose:
              "Đối chiếu đường dùng và liều trong bảng gốc",
            route: "Uống hoặc IV",
          },
        ],
        indication:
          "Phương án thay ceftriaxon bằng cefotaxim, không phải dùng cả hai.",
        source: "BYT 2026 – Mục 5.3.2; Phụ lục 1",
      },
      {
        id: "ward-amp-azi",
        name: "Ampicillin/sulbactam + azithromycin",
        drugs: [
          {
            name: "Ampicillin/sulbactam",
            dose:
              "Đối chiếu liều cụ thể trong Phụ lục 1, chức năng thận và chế phẩm",
            route: "IV",
          },
          {
            name: "Azithromycin",
            dose:
              "Đối chiếu chế độ liều theo đường dùng",
            route: "Uống hoặc IV",
          },
        ],
        indication:
          "Phương án phối hợp beta-lactam/ức chế beta-lactamase với macrolid.",
        source: "BYT 2026 – Mục 5.3.2",
      },
      {
        id: "ward-levo",
        name: "Levofloxacin đơn trị – có điều kiện",
        drugs: [
          {
            name: "Levofloxacin",
            dose:
              "Xác minh chế độ liều CAP trong Phụ lục 1; hiệu chỉnh theo CrCl",
            route: "IV hoặc uống",
          },
        ],
        indication:
          "Chỉ sử dụng đơn trị nếu phù hợp với mức độ bệnh, không áp dụng cho CAP nặng.",
        source: "BYT 2026 – Mục 5.3.2",
      },
    ],
    alerts: [
      "Lựa chọn ceftriaxon, cefotaxim hoặc ampicillin/sulbactam là các phác đồ thay thế nhau.",
      "Không sử dụng fluoroquinolon hô hấp đơn trị cho CAP nặng.",
      "Không mở rộng phổ Pseudomonas nếu không có yếu tố nguy cơ cần bao phủ.",
    ],
  },
  {
    id: "icu",
    name: "CAP nặng – ICU",
    description:
      "CAP nặng, suy hô hấp, sốc nhiễm khuẩn hoặc cần điều trị hồi sức tích cực.",
    regimens: [
      {
        id: "icu-ctx-azi",
        name: "Ceftriaxon + azithromycin",
        drugs: [
          {
            name: "Ceftriaxon",
            dose: "1–2 g mỗi 24 giờ; chọn liều theo bệnh cảnh",
            route: "IV",
          },
          {
            name: "Azithromycin",
            dose:
              "Xác minh chế độ liều CAP nặng theo bảng gốc",
            route: "IV hoặc uống khi thích hợp",
          },
        ],
        indication:
          "Ví dụ phác đồ nền beta-lactam + macrolid khi không có chỉ định bao phủ Pseudomonas.",
        source: "BYT 2026 – Mục 5.3.2.2; Bảng 5.1",
      },
      {
        id: "icu-ctx-levo",
        name: "Ceftriaxon + levofloxacin",
        drugs: [
          {
            name: "Ceftriaxon",
            dose: "1–2 g mỗi 24 giờ",
            route: "IV",
          },
          {
            name: "Levofloxacin",
            dose:
              "Xác minh liều theo Phụ lục 1, chức năng thận và mức độ nặng",
            route: "IV",
          },
        ],
        indication:
          "Phương án beta-lactam + fluoroquinolon hô hấp khi phù hợp.",
        source: "BYT 2026 – Bảng 5.1",
      },
      {
        id: "icu-pseudo",
        name: "Cefepim + levofloxacin – nguy cơ Pseudomonas",
        drugs: [
          {
            name: "Cefepim",
            dose:
              "Xác minh liều, chế độ truyền và CrCl theo bệnh cảnh nặng",
            route: "IV",
          },
          {
            name: "Levofloxacin",
            dose:
              "Theo liều áp dụng cho nguy cơ Pseudomonas và chức năng thận",
            route: "IV",
          },
        ],
        indication:
          "Chỉ khi có nguy cơ Pseudomonas và cần phác đồ phối hợp phù hợp.",
        caution:
          "Không xem ceftriaxon là thuốc chống Pseudomonas. Cần đối chiếu antibiogram và kết quả vi sinh.",
        source: "BYT 2026 – Bảng 5.1",
      },
      {
        id: "icu-mrsa",
        name: "Ceftriaxon + azithromycin + vancomycin",
        drugs: [
          {
            name: "Ceftriaxon",
            dose: "1–2 g mỗi 24 giờ",
            route: "IV",
          },
          {
            name: "Azithromycin",
            dose:
              "Xác minh chế độ liều CAP nặng theo nguồn",
            route: "IV hoặc uống khi phù hợp",
          },
          {
            name: "Vancomycin",
            dose:
              "Cá thể hóa theo cân nặng, chức năng thận và theo dõi AUC khi áp dụng",
            route: "IV",
          },
        ],
        indication:
          "Ví dụ phác đồ nền CAP nặng có bổ sung thuốc chống MRSA khi có chỉ định.",
        caution:
          "Vancomycin là thuốc bổ sung khi nghi MRSA, không được thêm thường quy cho mọi CAP nặng.",
        source: "BYT 2026 – Bảng 5.1",
      },
    ],
    alerts: [
      "Phác đồ chống MRSA và chống Pseudomonas là hai quyết định độc lập.",
      "Nếu đồng thời có nguy cơ MRSA và Pseudomonas, cần đánh giá lại toàn bộ phác đồ nền.",
      "Đánh giá chức năng thận, MIC/AST, PK/PD, ARC, RRT và tình trạng sốc.",
    ],
  },
];

const panel: CSSProperties = {
  border: "1px solid #dce6ed",
  borderRadius: 12,
  background: "#fff",
  padding: 15,
  minWidth: 0,
};

export default function CapByt2026() {
  const [scenarioId, setScenarioId] = useState("ward");
  const [opened, setOpened] = useState<string | null>(null);

  const scenario =
    SCENARIOS.find((s) => s.id === scenarioId) ??
    SCENARIOS[0];

  return (
    <div style={{ display: "grid", gap: 12, minWidth: 0 }}>
      <section style={panel}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#087e87",
        }}>
          BỘ Y TẾ VIỆT NAM · 2026
        </div>

        <h3 style={{ margin: "7px 0", fontSize: 19 }}>
          Viêm phổi cộng đồng – Người lớn
        </h3>

        <div style={{
          fontSize: 12,
          color: "#61798b",
        }}>
          Quyết định 2147/QĐ-BYT, ngày 15/7/2026
        </div>
      </section>

      <section style={panel}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>
          Chọn bệnh cảnh
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(165px, 1fr))",
          gap: 8,
        }}>
          {SCENARIOS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                setScenarioId(item.id);
                setOpened(null);
              }}
              aria-pressed={scenarioId === item.id}
              style={{
                textAlign: "left",
                cursor: "pointer",
                borderRadius: 9,
                padding: 11,
                border:
                  scenarioId === item.id
                    ? "1px solid #079b9b"
                    : "1px solid #dce6ed",
                background:
                  scenarioId === item.id
                    ? "#e5f7f4"
                    : "#fff",
                fontWeight:
                  scenarioId === item.id ? 700 : 400,
                color: "#17364b",
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        <p style={{
          color: "#63798b",
          fontSize: 12,
          lineHeight: 1.7,
          marginBottom: 0,
        }}>
          {scenario.description}
        </p>
      </section>

      <section style={panel}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 11,
        }}>
          <h3 style={{ margin: 0, fontSize: 19 }}>
            Lựa chọn kháng sinh
          </h3>

          <span style={{
            fontSize: 12,
            color: "#087e87",
          }}>
            {scenario.regimens.length} phác đồ tham khảo
          </span>
        </div>

        <div style={{
          display: "grid",
          gap: 8,
        }}>
          {scenario.regimens.map((r) => {
            const open = opened === r.id;

            return (
              <article
                key={r.id}
                style={{
                  border: open
                    ? "1px solid #0c9a9b"
                    : "1px solid #dce6ed",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setOpened(open ? null : r.id)
                  }
                  style={{
                    width: "100%",
                    border: 0,
                    cursor: "pointer",
                    textAlign: "left",
                    padding: 13,
                    background:
                      open ? "#eaf8f5" : "#fff",
                    color: "#17364b",
                  }}
                >
                  <span style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <strong style={{ fontSize: 14 }}>
                      {r.name}
                    </strong>

                    <span style={{
                      color: "#087e87",
                      fontSize: 20,
                    }}>
                      {open ? "−" : "+"}
                    </span>
                  </span>
                </button>

                {open && (
                  <div style={{
                    borderTop: "1px solid #dce6ed",
                    padding: 13,
                    lineHeight: 1.8,
                    fontSize: 13,
                  }}>
                    <div style={{
                      display: "grid",
                      gap: 8,
                    }}>
                      {r.drugs.map((d, index) => (
                        <div
                          key={`${r.id}-${index}`}
                          style={{
                            padding: 11,
                            borderRadius: 9,
                            background: "#f5f9fb",
                          }}
                        >
                          <b>
                            {r.drugs.length > 1
                              ? `Thuốc ${index + 1}: `
                              : "Thuốc: "}
                            {d.name}
                          </b>

                          <div>
                            <b>Liều:</b> {d.dose}
                          </div>

                          {d.route && (
                            <div>
                              <b>Đường dùng:</b> {d.route}
                            </div>
                          )}

                          {d.caution && (
                            <div>
                              <b>Lưu ý:</b> {d.caution}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <p>
                      <b>Khi nào lựa chọn:</b>{" "}
                      {r.indication}
                    </p>

                    {r.caution && (
                      <p style={{
                        padding: 11,
                        background: "#fff6e8",
                        borderRadius: 8,
                      }}>
                        <b>Cảnh báo:</b> {r.caution}
                      </p>
                    )}

                    <div style={{
                      fontSize: 12,
                      color: "#62798c",
                    }}>
                      Nguồn: {r.source}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <p style={{
          color: "#647a89",
          fontSize: 12,
          lineHeight: 1.8,
          marginBottom: 0,
        }}>
          Các phác đồ là phương án khác nhau,
          không phải thứ tự ưu tiên. Các tổ hợp
          cụ thể cần được đối chiếu bảng gốc và
          đánh giá chuyên môn trước khi sử dụng.
        </p>
      </section>

      <section style={panel}>
        <details>
          <summary style={{
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}>
            Điều kiện an toàn và đánh giá lại
          </summary>

          <ul style={{
            fontSize: 13,
            lineHeight: 1.9,
          }}>
            {scenario.alerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}

            <li>
              Đánh giá đáp ứng sau 48–72 giờ;
              xuống thang khi có kết quả vi sinh.
            </li>

            <li>
              Kiểm tra thời gian điều trị theo
              tình trạng ổn định lâm sàng,
              căn nguyên và biến chứng.
            </li>

            <li>
              Cân nhắc chuyển IV–PO khi đáp ứng
              điều kiện ổn định và dùng được đường uống.
            </li>
          </ul>
        </details>
      </section>

      <section style={panel}>
        <details>
          <summary style={{
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}>
            Nguồn và trạng thái thẩm định
          </summary>

          <div style={{
            fontSize: 13,
            lineHeight: 1.9,
            marginTop: 10,
          }}>
            <b>
              Bộ Y tế – Quyết định 2147/QĐ-BYT
              ngày 15/7/2026.
            </b>

            <div>
              Điều trị kinh nghiệm: Mục 5.3,
              Bảng 5.1.
            </div>

            <div>
              Liều và chức năng thận: Phụ lục 1.
            </div>

            <div>
              Chuyển IV–PO: Mục 4.5, Bảng 4.4.
            </div>

            <p style={{ color: "#8b611c" }}>
              Đây là dữ liệu hỗ trợ tra cứu,
              chưa phải phác đồ BV199 được phê duyệt.
              Chưa mã hóa toàn bộ nội dung tài liệu.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
