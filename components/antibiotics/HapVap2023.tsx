
"use client";

import { useState, type CSSProperties } from "react";

/*
 BV199 - HAP / VAP
 File: components/antibiotics/HapVap2023.tsx

 Nguon:
 Khuyen cao chan doan va dieu tri VPBV,
 viem phoi lien quan tho may, cap nhat 2023.
 Hoi Ho hap Viet Nam va Hoi HSCC & Chong doc VN.
 Bang 3.1 (HAP), Bang 3.2 (VAP).

 Vi du to hop phac do de tra cuu.
 Chua phe duyet BV199.
*/

type Kind = "hap" | "vap";

type Drug = {
  name: string;
  dose: string;
  route: string;
  caution?: string;
};

type Regimen = {
  id: string;
  name: string;
  drugs: Drug[];
  indication: string;
  notes: string[];
  source: string;
};

type Scenario = {
  id: string;
  title: string;
  description: string;
  regimens: Regimen[];
};

const DRUGS = {
  piptazo: {
    name: "Piperacillin/tazobactam",
    dose:
      "4,5 g mỗi 6 giờ, truyền kéo dài 3 giờ theo bảng; chỉnh theo thận",
    route: "IV",
  },
  cefepime: {
    name: "Cefepim",
    dose:
      "2 g mỗi 8 giờ, truyền kéo dài 3 giờ theo bảng; chỉnh theo thận",
    route: "IV",
    caution: "Theo dõi nguy cơ độc tính thần kinh.",
  },
  ceftazidime: {
    name: "Ceftazidim",
    dose:
      "2 g mỗi 8 giờ, truyền kéo dài theo bảng; chỉnh theo thận",
    route: "IV",
  },
  meropenem: {
    name: "Meropenem",
    dose:
      "1–2 g mỗi 8 giờ trong bệnh cảnh nặng theo bảng; xác minh liều, thời gian truyền, Clcr và PK/PD",
    route: "IV",
  },
  imipenem: {
    name: "Imipenem/cilastatin",
    dose:
      "Xác minh liều riêng theo mức độ nặng và CrCl trước sử dụng",
    route: "IV",
    caution: "Lưu ý nguy cơ độc tính thần kinh.",
  },
  levofloxacin: {
    name: "Levofloxacin",
    dose:
      "750 mg mỗi 24 giờ ở chế độ được nêu trong bảng; điều chỉnh khi suy thận",
    route: "IV",
    caution:
      "Đánh giá nguy cơ QT, ADR và đề kháng.",
  },
  ciprofloxacin: {
    name: "Ciprofloxacin",
    dose:
      "400 mg mỗi 8 giờ theo bảng; điều chỉnh theo chức năng thận",
    route: "IV",
  },
  amikacin: {
    name: "Amikacin",
    dose:
      "20 mg/kg mỗi 24 giờ là liều tham khảo trong bảng; cá thể hóa theo cân nặng, thận và TDM",
    route: "IV",
    caution:
      "Không đơn trị HAP/VAP. Nguy cơ độc tính thận và tai.",
  },
  vancomycin: {
    name: "Vancomycin",
    dose:
      "Liều nạp/duy trì cá thể hóa theo cân nặng, chức năng thận và AUC mục tiêu",
    route: "IV",
    caution:
      "Theo dõi AUC24/MIC mục tiêu 400–600 khi phù hợp; không suy ra liều chỉ từ tần suất cố định.",
  },
  linezolid: {
    name: "Linezolid",
    dose: "600 mg mỗi 12 giờ",
    route: "IV",
    caution:
      "Kiểm tra tiểu cầu, tương tác serotonergic và thời gian điều trị.",
  },
};

const HAP: Scenario[] = [
  {
    id: "hap-low",
    title: "Không nặng – không nguy cơ đa kháng",
    description:
      "Lựa chọn một thuốc nền có phổ thích hợp; xem xét dữ liệu nhạy cảm của đơn vị.",
    regimens: [
      {
        id: "hap-pip",
        name: "Piperacillin/tazobactam đơn trị",
        drugs: [DRUGS.piptazo],
        indication:
          "Một trong các phác đồ đơn trị khi không có chỉ định cần mở rộng phối hợp.",
        notes: [
          "Đánh giá tình hình nhạy cảm Pseudomonas tại bệnh viện.",
          "Không mặc định phối hợp thêm cefepim.",
        ],
        source: "HAP 2023 – Bảng 3.1",
      },
      {
        id: "hap-cef",
        name: "Cefepim đơn trị",
        drugs: [DRUGS.cefepime],
        indication:
          "Phương án thay thế piperacillin/tazobactam trong bệnh cảnh phù hợp.",
        notes: [
          "Theo dõi chức năng thận và độc tính thần kinh.",
        ],
        source: "HAP 2023 – Bảng 3.1",
      },
      {
        id: "hap-mero",
        name: "Meropenem đơn trị – lựa chọn có điều kiện",
        drugs: [DRUGS.meropenem],
        indication:
          "Khi phổ tác dụng hoặc nguy cơ vi khuẩn kháng thuốc khiến lựa chọn này phù hợp.",
        notes: [
          "Không sử dụng carbapenem mặc định cho mọi HAP nguy cơ thấp.",
          "Liều thông thường và liều bệnh nặng không được xem là tương đương.",
        ],
        source: "HAP 2023 – Bảng 3.1",
      },
    ],
  },
  {
    id: "hap-mdr",
    title: "Nặng hoặc có nguy cơ Gram âm đa kháng",
    description:
      "Đánh giá nhu cầu phối hợp hai thuốc có hoạt tính Gram âm thuộc những nhóm thích hợp, sau đó xuống thang theo vi sinh.",
    regimens: [
      {
        id: "hap-cef-levo",
        name: "Cefepim + levofloxacin",
        drugs: [
          DRUGS.cefepime,
          DRUGS.levofloxacin,
        ],
        indication:
          "Ví dụ tổ hợp beta-lactam chống Pseudomonas + fluoroquinolon khi có chỉ định hai thuốc Gram âm.",
        notes: [
          "Kiểm tra tỷ lệ nhạy cảm của cả hai thuốc.",
          "Không duy trì phối hợp kéo dài khi có thể xuống thang.",
        ],
        source: "HAP 2023 – Bảng 3.1",
      },
      {
        id: "hap-pip-cipro",
        name: "Piperacillin/tazobactam + ciprofloxacin",
        drugs: [
          DRUGS.piptazo,
          DRUGS.ciprofloxacin,
        ],
        indication:
          "Một tổ hợp beta-lactam + fluoroquinolon khác khi phù hợp với dịch tễ và nguy cơ MDR.",
        notes: [
          "Không xem các phác đồ là xếp hạng ưu tiên.",
        ],
        source: "HAP 2023 – Bảng 3.1",
      },
      {
        id: "hap-mero-amik",
        name: "Meropenem + amikacin",
        drugs: [
          DRUGS.meropenem,
          DRUGS.amikacin,
        ],
        indication:
          "Một phương án phối hợp khi nguy cơ Gram âm đa kháng khiến sử dụng hai nhóm thuốc phù hợp.",
        notes: [
          "Aminoglycosid cần cá thể hóa bằng TDM.",
          "Không dùng amikacin đơn trị.",
          "Đánh giá xuống thang sớm theo cấy và AST.",
        ],
        source: "HAP 2023 – Bảng 3.1",
      },
    ],
  },
  {
    id: "hap-mrsa",
    title: "Có nguy cơ MRSA",
    description:
      "Bổ sung một thuốc chống MRSA vào phác đồ Gram âm nền phù hợp. Việc cần một hay hai thuốc Gram âm phải đánh giá độc lập.",
    regimens: [
      {
        id: "hap-cef-vanco",
        name: "Cefepim + vancomycin",
        drugs: [
          DRUGS.cefepime,
          DRUGS.vancomycin,
        ],
        indication:
          "Ví dụ khi cần một thuốc nền Gram âm và bổ sung bao phủ MRSA.",
        notes: [
          "Vancomycin không thay thế cefepim trong bao phủ Gram âm.",
          "Kiểm tra nguy cơ và kết quả MRSA trước khi duy trì.",
        ],
        source: "HAP 2023 – Bảng 3.1",
      },
      {
        id: "hap-pip-line",
        name: "Piperacillin/tazobactam + linezolid",
        drugs: [
          DRUGS.piptazo,
          DRUGS.linezolid,
        ],
        indication:
          "Phương án dùng một thuốc nền Gram âm kết hợp một thuốc chống MRSA.",
        notes: [
          "Theo dõi tác dụng không mong muốn của linezolid.",
          "Không mặc định đồng thời dùng linezolid và vancomycin.",
        ],
        source: "HAP 2023 – Bảng 3.1",
      },
      {
        id: "hap-mdr-mrsa",
        name: "Cefepim + levofloxacin + vancomycin",
        drugs: [
          DRUGS.cefepime,
          DRUGS.levofloxacin,
          DRUGS.vancomycin,
        ],
        indication:
          "Ví dụ khi đồng thời cần hai thuốc Gram âm và bao phủ MRSA.",
        notes: [
          "Chỉ cân nhắc khi các nguy cơ tương ứng đều hiện diện.",
          "Không dùng ba thuốc như phác đồ thường quy cho mọi HAP có MRSA.",
        ],
        source: "HAP 2023 – Bảng 3.1",
      },
    ],
  },
];

const VAP: Scenario[] = [
  {
    id: "vap-low",
    title: "Không nguy cơ MDR – đủ dữ liệu nhạy cảm",
    description:
      "Có thể cân nhắc một thuốc Gram âm nền nếu không có nguy cơ MDR và dữ liệu nhạy cảm của đơn vị đáp ứng điều kiện hướng dẫn.",
    regimens: [
      {
        id: "vap-pip",
        name: "Piperacillin/tazobactam đơn trị",
        drugs: [DRUGS.piptazo],
        indication:
          "Ví dụ thuốc nhóm B dùng đơn trị khi các điều kiện về nguy cơ và kháng sinh đồ phù hợp.",
        notes: [
          "Không sử dụng đơn trị chỉ vì người bệnh chưa có kết quả cấy.",
          "Đánh giá riêng nguy cơ MRSA.",
        ],
        source: "VAP 2023 – Bảng 3.2",
      },
      {
        id: "vap-cef",
        name: "Cefepim đơn trị",
        drugs: [DRUGS.cefepime],
        indication:
          "Một phương án thuốc nhóm B khác khi đơn trị phù hợp.",
        notes: [
          "Cần đối chiếu tình hình nhạy cảm Pseudomonas của đơn vị.",
        ],
        source: "VAP 2023 – Bảng 3.2",
      },
      {
        id: "vap-mero",
        name: "Meropenem đơn trị – có điều kiện",
        drugs: [DRUGS.meropenem],
        indication:
          "Chỉ khi phổ tác dụng và nguy cơ đề kháng khiến lựa chọn carbapenem phù hợp.",
        notes: [
          "Không sử dụng carbapenem mặc định cho mọi VAP.",
        ],
        source: "VAP 2023 – Bảng 3.2",
      },
    ],
  },
  {
    id: "vap-mdr",
    title: "Nguy cơ Gram âm/Pseudomonas đa kháng",
    description:
      "Cân nhắc phối hợp thuốc nhóm B với thuốc nhóm C khi có chỉ định dùng hai thuốc chống Gram âm.",
    regimens: [
      {
        id: "vap-cef-levo",
        name: "Cefepim + levofloxacin",
        drugs: [
          DRUGS.cefepime,
          DRUGS.levofloxacin,
        ],
        indication:
          "Một ví dụ ghép nhóm B + C theo cách phân nhóm của Bảng 3.2.",
        notes: [
          "Không ghép hai beta-lactam với nhau.",
          "Đánh giá độc lập nguy cơ MRSA.",
        ],
        source: "VAP 2023 – Bảng 3.2",
      },
      {
        id: "vap-pip-cipro",
        name: "Piperacillin/tazobactam + ciprofloxacin",
        drugs: [
          DRUGS.piptazo,
          DRUGS.ciprofloxacin,
        ],
        indication:
          "Một phương án beta-lactam chống Pseudomonas kết hợp fluoroquinolon.",
        notes: [
          "Chỉ áp dụng khi có cơ sở lựa chọn thuốc và phối hợp.",
        ],
        source: "VAP 2023 – Bảng 3.2",
      },
      {
        id: "vap-mero-amik",
        name: "Meropenem + amikacin",
        drugs: [
          DRUGS.meropenem,
          DRUGS.amikacin,
        ],
        indication:
          "Tổ hợp beta-lactam + aminoglycosid khi cần phối hợp hai thuốc chống Gram âm.",
        notes: [
          "Aminoglycosid không được dùng đơn độc.",
          "Theo dõi TDM và độc tính thận, tai.",
        ],
        source: "VAP 2023 – Bảng 3.2",
      },
    ],
  },
  {
    id: "vap-mrsa",
    title: "Có nguy cơ MRSA",
    description:
      "Bổ sung một thuốc nhóm A chống MRSA vào phác đồ Gram âm thích hợp.",
    regimens: [
      {
        id: "vap-cef-vanco",
        name: "Cefepim + vancomycin",
        drugs: [
          DRUGS.cefepime,
          DRUGS.vancomycin,
        ],
        indication:
          "Ví dụ nhóm B + A khi cần một thuốc Gram âm nền và bao phủ MRSA.",
        notes: [
          "Không áp dụng nếu đồng thời cần hai thuốc Gram âm nhưng chưa được đánh giá.",
          "TDM vancomycin theo thực hành phù hợp.",
        ],
        source: "VAP 2023 – Bảng 3.2",
      },
      {
        id: "vap-pip-line",
        name: "Piperacillin/tazobactam + linezolid",
        drugs: [
          DRUGS.piptazo,
          DRUGS.linezolid,
        ],
        indication:
          "Ví dụ nhóm B + A với thuốc chống MRSA khác.",
        notes: [
          "Kiểm tra tương tác và nguy cơ giảm tiểu cầu.",
        ],
        source: "VAP 2023 – Bảng 3.2",
      },
      {
        id: "vap-three",
        name: "Meropenem + amikacin + vancomycin",
        drugs: [
          DRUGS.meropenem,
          DRUGS.amikacin,
          DRUGS.vancomycin,
        ],
        indication:
          "Ví dụ nhóm B + C + A chỉ khi có cả nguy cơ Gram âm đa kháng và MRSA.",
        notes: [
          "Không phải phác đồ mặc định cho người bệnh VAP.",
          "Đánh giá nguy cơ độc tính thận và nhu cầu duy trì aminoglycosid.",
          "Cần kháng sinh đồ và thẩm định chuyên môn.",
        ],
        source: "VAP 2023 – Bảng 3.2",
      },
    ],
  },
];

const box: CSSProperties = {
  border: "1px solid #dce6ed",
  borderRadius: 12,
  background: "#fff",
  padding: 15,
  minWidth: 0,
};

export default function HapVap2023({
  kind,
}: {
  kind: Kind;
}) {
  const scenarios = kind === "hap" ? HAP : VAP;

  const [scenarioId, setScenarioId] = useState("");
  const [openedId, setOpenedId] =
    useState<string | null>(null);

  const scenario =
    scenarios.find((s) => s.id === scenarioId) ??
    scenarios[0];

  function selectScenario(id: string) {
    setScenarioId(id);
    setOpenedId(null);
  }

  return (
    <div style={{ display: "grid", gap: 12, minWidth: 0 }}>
      <section style={box}>
        <div style={{
          color: "#087e87",
          fontSize: 11,
          fontWeight: 700,
        }}>
          KHUYẾN CÁO CHUYÊN NGÀNH VIỆT NAM · 2023
        </div>

        <h3 style={{ fontSize: 19, margin: "8px 0" }}>
          {kind === "hap"
            ? "Viêm phổi bệnh viện (HAP)"
            : "Viêm phổi liên quan thở máy (VAP)"}
        </h3>

        <p style={{
          fontSize: 12,
          lineHeight: 1.7,
          color: "#627b8a",
          marginBottom: 0,
        }}>
          Hội Hô hấp Việt Nam và Hội Hồi sức cấp cứu
          và Chống độc Việt Nam, cập nhật 2023.
          Đây là hướng dẫn hội chuyên ngành,
          không phải quyết định phê duyệt của BV199.
        </p>
      </section>

      <section style={box}>
        <h3 style={{ fontSize: 16, margin: "0 0 12px" }}>
          Chọn tình huống điều trị
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 8,
        }}>
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectScenario(item.id)}
              aria-pressed={scenario.id === item.id}
              style={{
                textAlign: "left",
                cursor: "pointer",
                borderRadius: 9,
                padding: 11,
                border:
                  scenario.id === item.id
                    ? "1px solid #079b9b"
                    : "1px solid #dce6ed",
                background:
                  scenario.id === item.id
                    ? "#e5f7f4"
                    : "#fff",
                color: "#17364b",
                fontWeight:
                  scenario.id === item.id ? 700 : 400,
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        <p style={{
          fontSize: 12,
          lineHeight: 1.8,
          color: "#647b8a",
          marginBottom: 0,
        }}>
          {scenario.description}
        </p>
      </section>

      <section style={box}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12,
        }}>
          <h3 style={{ fontSize: 19, margin: 0 }}>
            Lựa chọn kháng sinh
          </h3>

          <span style={{
            color: "#087e87",
            fontSize: 12,
          }}>
            {scenario.regimens.length} tổ hợp tham khảo
          </span>
        </div>

        <div style={{
          background: "#f1f8fa",
          borderRadius: 9,
          padding: 12,
          fontSize: 12,
          lineHeight: 1.8,
          marginBottom: 13,
        }}>
          {kind === "hap"
            ? "HAP: chọn phác đồ theo mức độ nặng, nguy cơ đa kháng và nguy cơ MRSA."
            : "VAP: nhóm B là thuốc Gram âm nền; nhóm C là thuốc Gram âm thứ hai khi cần; nhóm A bổ sung chống MRSA khi có chỉ định."}

          <div style={{ marginTop: 5 }}>
            Các phác đồ bên dưới là các tổ hợp khác
            nhau, không phải thuốc cần sử dụng cùng lúc.
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {scenario.regimens.map((regimen) => {
            const open = openedId === regimen.id;

            return (
              <article
                key={regimen.id}
                style={{
                  border: open
                    ? "1px solid #079b9b"
                    : "1px solid #dce6ed",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setOpenedId(
                      open ? null : regimen.id
                    )
                  }
                  style={{
                    border: 0,
                    width: "100%",
                    background:
                      open ? "#e8f7f4" : "#fff",
                    color: "#17364b",
                    padding: 13,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <strong style={{ fontSize: 14 }}>
                      {regimen.name}
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
                    padding: 13,
                    borderTop: "1px solid #dce6ed",
                    fontSize: 13,
                    lineHeight: 1.85,
                  }}>
                    <div style={{
                      display: "grid",
                      gap: 8,
                    }}>
                      {regimen.drugs.map((drug, index) => (
                        <div
                          key={`${regimen.id}-${index}`}
                          style={{
                            background: "#f4f9fb",
                            borderRadius: 9,
                            padding: 11,
                          }}
                        >
                          <b>
                            Thuốc {index + 1}:{" "}
                            {drug.name}
                          </b>

                          <div>
                            <b>Liều:</b> {drug.dose}
                          </div>

                          <div>
                            <b>Đường dùng:</b> {drug.route}
                          </div>

                          {drug.caution && (
                            <div>
                              <b>Lưu ý:</b>{" "}
                              {drug.caution}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <p>
                      <b>Điều kiện áp dụng:</b>{" "}
                      {regimen.indication}
                    </p>

                    <div style={{
                      background: "#fff7e8",
                      borderRadius: 9,
                      padding: 11,
                    }}>
                      <b>Điểm cần kiểm tra</b>

                      <ul style={{
                        marginBottom: 0,
                        paddingLeft: 20,
                      }}>
                        {regimen.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{
                      marginTop: 11,
                      fontSize: 12,
                      color: "#657b8d",
                    }}>
                      Nguồn: {regimen.source}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section style={box}>
        <details>
          <summary style={{
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}>
            Kiểm tra nguy cơ đa kháng và MRSA
          </summary>

          <ul style={{
            fontSize: 13,
            lineHeight: 1.9,
          }}>
            <li>
              Kháng sinh IV trong 90 ngày trước đó.
            </li>
            <li>
              Tiền sử phân lập/cư trú vi khuẩn đa kháng.
            </li>
            <li>
              Sốc nhiễm khuẩn, ARDS, thời gian nằm viện,
              thay thế thận và mức độ nặng.
            </li>
            <li>
              Kháng sinh đồ BV199 và tỷ lệ nhạy cảm
              Pseudomonas tại đơn vị.
            </li>
            <li>
              Nguy cơ MRSA được đánh giá riêng,
              không mặc định có ở mọi HAP/VAP.
            </li>
          </ul>
        </details>
      </section>

      <section style={box}>
        <details>
          <summary style={{
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}>
            Theo dõi, xuống thang và thời gian điều trị
          </summary>

          <ul style={{
            fontSize: 13,
            lineHeight: 1.9,
          }}>
            <li>
              Đánh giá lại sau 48–72 giờ.
            </li>
            <li>
              Xuống thang hoặc điều chỉnh theo
              cấy, AST/MIC và diễn biến lâm sàng.
            </li>
            <li>
              Thời gian thông thường khoảng 7 ngày
              khi đáp ứng phù hợp, nhưng cần cá thể hóa
              theo biến chứng và căn nguyên.
            </li>
            <li>
              Không duy trì hai thuốc chống Gram âm
              nếu đã xác định không còn chỉ định.
            </li>
            <li>
              Cần hiệu chỉnh liều theo CrCl, ARC,
              AKI, RRT và tối ưu PK/PD.
            </li>
          </ul>
        </details>
      </section>

      <section style={box}>
        <details>
          <summary style={{
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}>
            Nguồn tài liệu và tình trạng thẩm định
          </summary>

          <div style={{
            fontSize: 13,
            lineHeight: 1.85,
            marginTop: 10,
          }}>
            <b>
              Khuyến cáo chẩn đoán và điều trị
              viêm phổi bệnh viện và viêm phổi
              liên quan thở máy – 2023.
            </b>

            <div>HAP: Bảng 3.1, trang 53–56.</div>
            <div>VAP: Bảng 3.2, trang 60–62.</div>

            <p>
              Các tổ hợp trên được cụ thể hóa từ
              các nhóm lựa chọn trong bảng hướng dẫn.
              Không mặc định là các phác đồ ưu tiên
              chính thức tại BV199.
            </p>

            <p style={{ color: "#8b611c" }}>
              Liều thuốc phải được xác minh,
              điều chỉnh và thẩm định trước áp dụng.
              Phần điều trị theo kết quả vi sinh
              chưa được mã hóa đầy đủ.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
