
"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Tab = "overview" | "calculator" | "ast" | "practice";

const card: CSSProperties = {
  padding: 22,
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid #dbe4ee",
  boxShadow: "0 2px 9px rgba(15, 23, 42, 0.04)",
};

const heading: CSSProperties = {
  fontSize: 21,
  fontWeight: 750,
  margin: "0 0 14px",
  color: "#0f2942",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 9,
  fontSize: 15,
  color: "#0f172a",
  background: "#ffffff",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 650,
  marginBottom: 7,
  color: "#334155",
};

const explanation: CSSProperties = {
  lineHeight: 1.8,
  color: "#475569",
  fontSize: 15,
};

const formulas = [
  {
    name: "fT>MIC",
    group: "Kháng sinh phụ thuộc thời gian",
    meaning:
      "Tỷ lệ thời gian trong khoảng liều mà nồng độ thuốc tự do vượt MIC.",
    examples: "Penicillin, cephalosporin, meropenem.",
    note:
      "Mục tiêu PK/PD phụ thuộc từng kháng sinh, vi khuẩn và tình trạng người bệnh.",
  },
  {
    name: "fAUC/MIC",
    group: "Kháng sinh phụ thuộc mức phơi nhiễm",
    meaning:
      "Tỷ số diện tích dưới đường cong nồng độ thuốc tự do theo thời gian so với MIC.",
    examples: "Một số fluoroquinolone; chỉ số đích tùy kháng sinh.",
    note:
      "Phải xác định AUC toàn phần hay tự do và khoảng thời gian AUC.",
  },
  {
    name: "Cmax/MIC",
    group: "Kháng sinh phụ thuộc nồng độ",
    meaning:
      "Tỷ số nồng độ đỉnh của thuốc so với MIC của vi khuẩn.",
    examples: "Aminoglycoside.",
    note:
      "Cần xác định nồng độ đỉnh được đo ở thời điểm nào và mục tiêu áp dụng.",
  },
];

const astItems = [
  {
    code: "S",
    title: "Susceptible - Nhạy",
    color: "#047857",
    description:
      "Khả năng điều trị thành công cao khi dùng chế độ liều được xác định phù hợp với điểm gãy.",
  },
  {
    code: "I",
    title: "Intermediate hoặc Susceptible, increased exposure",
    color: "#a16207",
    description:
      "Ý nghĩa phụ thuộc hệ thống: CLSI dùng Intermediate; EUCAST dùng Susceptible, increased exposure. Không được đồng nhất hai định nghĩa.",
  },
  {
    code: "R",
    title: "Resistant - Kháng",
    color: "#b91c1c",
    description:
      "Khả năng điều trị thành công thấp với các chế độ phơi nhiễm liên quan đến điểm gãy tương ứng.",
  },
  {
    code: "SDD",
    title: "Susceptible-Dose Dependent",
    color: "#1d4ed8",
    description:
      "Phân loại của CLSI cho một số cặp kháng sinh - vi khuẩn; cần dùng chế độ liều phù hợp được CLSI quy định.",
  },
];

function readPositive(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function numberText(value: number | null, digits = 2): string {
  return value === null || !Number.isFinite(value)
    ? "Chưa đủ dữ liệu hợp lệ"
    : value.toLocaleString("vi-VN", {
        maximumFractionDigits: digits,
      });
}

function Field({
  title,
  value,
  onChange,
  unit,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{title}</span>
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
        placeholder={unit}
      />
      <span style={{ fontSize: 12, color: "#64748b" }}>{unit}</span>
    </label>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 15,
        border: "1px solid #bfdbfe",
        background: "#eff6ff",
        borderRadius: 12,
        lineHeight: 1.7,
        color: "#1e40af",
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

export default function PkpdPage() {
  const [tab, setTab] = useState<Tab>("overview");

  const [mic, setMic] = useState("1");
  const [cmax, setCmax] = useState("16");
  const [auc, setAuc] = useState("100");
  const [halfLife, setHalfLife] = useState("2");
  const [interval, setInterval] = useState("8");
  const [freeFraction, setFreeFraction] = useState("100");

  const result = useMemo(() => {
    const m = readPositive(mic);
    const peak = readPositive(cmax);
    const area = readPositive(auc);
    const half = readPositive(halfLife);
    const tau = readPositive(interval);
    const fractionInput = readPositive(freeFraction);

    if (
      m === null ||
      peak === null ||
      area === null ||
      half === null ||
      tau === null ||
      fractionInput === null ||
      fractionInput > 100
    ) {
      return null;
    }

    const fu = fractionInput / 100;
    const freePeak = peak * fu;

    // Mô hình đơn giản: C(t) = Cmax * exp(-k*t).
    // Giả định Cmax là đỉnh ngay đầu khoảng liều.
    const k = Math.log(2) / half;

    const timeAbove =
      freePeak <= m
        ? 0
        : Math.min(tau, Math.log(freePeak / m) / k);

    const ftMic = (timeAbove / tau) * 100;

    return {
      ftMic,
      timeAbove,
      cmaxMic: peak / m,
      freeCmaxMic: freePeak / m,
      aucMic: area / m,
      freeAucMic: (area * fu) / m,
    };
  }, [mic, cmax, auc, halfLife, interval, freeFraction]);

  const tabs: { id: Tab; name: string }[] = [
    { id: "overview", name: "Kiến thức PK/PD" },
    { id: "calculator", name: "Công cụ tính" },
    { id: "ast", name: "MIC và CLSI/EUCAST" },
    { id: "practice", name: "Ứng dụng lâm sàng" },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "26px 18px 70px",
        background: "#f4f7fb",
        color: "#0f172a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1150, margin: "0 auto" }}>
        <header
          style={{
            padding: "26px",
            borderRadius: 18,
            background: "linear-gradient(115deg, #0b3767, #1478a6)",
            color: "white",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            BỆNH VIỆN 199 - KHOA DƯỢC
          </div>

          <h1 style={{ margin: "0 0 12px", fontSize: 30 }}>
            Hệ thống kiến thức và ứng dụng PK/PD
          </h1>

          <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.95 }}>
            Dược động học - Dược lực học kháng sinh
            <br />
            Hỗ trợ đào tạo, phân tích phơi nhiễm và tư duy tối ưu
            hóa sử dụng kháng sinh.
          </p>
        </header>

        <nav
          aria-label="Các mục PK/PD"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 9,
            marginBottom: 22,
          }}
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              style={{
                padding: "12px 17px",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                cursor: "pointer",
                fontWeight: 700,
                background: tab === item.id ? "#0b5590" : "#ffffff",
                color: tab === item.id ? "#ffffff" : "#334155",
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {tab === "overview" && (
          <section style={{ display: "grid", gap: 17 }}>
            <div style={card}>
              <h2 style={heading}>1. Bản chất PK và PD</h2>
              <p style={explanation}>
                <strong>PK - Pharmacokinetics:</strong> Cơ thể
                hấp thu, phân bố, chuyển hóa và thải trừ thuốc
                như thế nào.
              </p>
              <p style={explanation}>
                <strong>PD - Pharmacodynamics:</strong> Mối
                liên hệ giữa phơi nhiễm thuốc và tác dụng
                kháng khuẩn.
              </p>
              <p style={explanation}>
                <strong>PK/PD:</strong> Liên kết mức phơi nhiễm
                của kháng sinh với độ nhạy cảm của vi khuẩn,
                thường thông qua MIC.
              </p>
            </div>

            {formulas.map((item, index) => (
              <article key={item.name} style={card}>
                <h2 style={heading}>
                  {index + 2}. {item.name}
                </h2>
                <p>
                  <strong>{item.group}</strong>
                </p>
                <p style={explanation}>{item.meaning}</p>
                <p style={explanation}>
                  <strong>Ví dụ:</strong> {item.examples}
                </p>
                <Notice>{item.note}</Notice>
              </article>
            ))}

            <div style={card}>
              <h2 style={heading}>Các thông số cần nắm</h2>
              <p style={explanation}>
                <strong>CL:</strong> Độ thanh thải, phản ánh
                khả năng loại bỏ thuốc khỏi cơ thể.
              </p>
              <p style={explanation}>
                <strong>Vd:</strong> Thể tích phân bố biểu kiến.
              </p>
              <p style={explanation}>
                <strong>t1/2:</strong> Thời gian bán thải.
              </p>
              <p style={explanation}>
                <strong>AUC:</strong> Diện tích dưới đường cong
                nồng độ - thời gian.
              </p>
              <p style={explanation}>
                <strong>MIC:</strong> Nồng độ ức chế tối thiểu
                của kháng sinh đối với vi khuẩn.
              </p>
              <p style={explanation}>
                <strong>fu:</strong> Phần thuốc không gắn
                protein huyết tương.
              </p>
            </div>
          </section>
        )}

        {tab === "calculator" && (
          <section style={{ display: "grid", gap: 20 }}>
            <div style={card}>
              <h2 style={heading}>2. Công cụ minh họa PK/PD</h2>
              <Notice>
                Đây là mô hình giáo dục đơn giản, không phải
                phần mềm tính liều đã thẩm định. Không sử dụng
                kết quả trực tiếp để kê đơn hoặc điều chỉnh
                liều cho người bệnh.
              </Notice>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 18,
                  marginTop: 22,
                }}
              >
                <Field
                  title="MIC"
                  value={mic}
                  onChange={setMic}
                  unit="mg/L"
                />
                <Field
                  title="Cmax toàn phần"
                  value={cmax}
                  onChange={setCmax}
                  unit="mg/L"
                />
                <Field
                  title="AUC toàn phần"
                  value={auc}
                  onChange={setAuc}
                  unit="mg·h/L, cùng khoảng thời gian cần đánh giá"
                />
                <Field
                  title="Thời gian bán thải"
                  value={halfLife}
                  onChange={setHalfLife}
                  unit="giờ"
                />
                <Field
                  title="Khoảng cách hai liều"
                  value={interval}
                  onChange={setInterval}
                  unit="giờ"
                />
                <Field
                  title="Tỷ lệ thuốc tự do"
                  value={freeFraction}
                  onChange={setFreeFraction}
                  unit="%, lớn hơn 0 và không quá 100"
                />
              </div>
            </div>

            <div style={card}>
              <h2 style={heading}>Kết quả mô phỏng</h2>

              {result === null ? (
                <Notice>
                  Vui lòng nhập đầy đủ các giá trị dương,
                  hợp lệ. Tỷ lệ thuốc tự do phải từ trên 0%
                  đến 100%.
                </Notice>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 12,
                  }}
                >
                  {[
                    {
                      title: "fT>MIC",
                      value: numberText(result.ftMic) + "%",
                    },
                    {
                      title: "Thời gian trên MIC",
                      value: numberText(result.timeAbove) + " giờ",
                    },
                    {
                      title: "Cmax/MIC toàn phần",
                      value: numberText(result.cmaxMic),
                    },
                    {
                      title: "fCmax/MIC",
                      value: numberText(result.freeCmaxMic),
                    },
                    {
                      title: "AUC/MIC toàn phần",
                      value: numberText(result.aucMic) + " giờ",
                    },
                    {
                      title: "fAUC/MIC",
                      value: numberText(result.freeAucMic) + " giờ",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      style={{
                        background: "#f0f7ff",
                        border: "1px solid #d6e7fc",
                        borderRadius: 12,
                        padding: 17,
                      }}
                    >
                      <div style={{ fontSize: 13, color: "#475569" }}>
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 750,
                          marginTop: 10,
                          color: "#075985",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 20 }}>
                <h3>Mô hình toán học</h3>
                <p style={explanation}>
                  k = ln(2) / t1/2
                </p>
                <p style={explanation}>
                  Cfree(t) = fu × Cmax × e^(-kt)
                </p>
                <p style={explanation}>
                  fT&gt;MIC = thời gian Cfree(t) vượt MIC
                  chia cho khoảng cách liều, nhân 100%.
                </p>
                <p style={explanation}>
                  fAUC/MIC = fu × AUC / MIC (giả định fu
                  không đổi).
                </p>
                <p style={explanation}>
                  fCmax/MIC = fu × Cmax / MIC.
                </p>

                <Notice>
                  Công thức fT&gt;MIC giả định thải trừ bậc một,
                  mô hình một ngăn và đỉnh nồng độ xuất hiện
                  ngay đầu khoảng liều. Không mô phỏng giai
                  đoạn truyền, hấp thu, phân bố, tích lũy hoặc
                  động học phi tuyến. AUC do người dùng nhập
                  không được suy ra từ Cmax và t1/2; kết quả
                  các chỉ số có thể không nhất quán nếu dữ
                  liệu đầu vào khác mô hình.
                </Notice>
              </div>
            </div>
          </section>
        )}

        {tab === "ast" && (
          <section style={{ display: "grid", gap: 17 }}>
            <div style={card}>
              <h2 style={heading}>
                3. MIC, kháng sinh đồ và điểm gãy lâm sàng
              </h2>
              <p style={explanation}>
                MIC là nồng độ ức chế tối thiểu được xác định
                trong điều kiện xét nghiệm chuẩn hóa. MIC cần
                được diễn giải theo cặp kháng sinh - vi khuẩn,
                hệ thống điểm gãy và phiên bản tài liệu.
              </p>
              <Notice>
                Không sử dụng một ngưỡng MIC chung cho mọi
                kháng sinh hoặc mọi loài vi khuẩn. CLSI và
                EUCAST có thể có điểm gãy hoặc cách phân loại
                khác nhau.
              </Notice>
            </div>

            {astItems.map((item) => (
              <article key={item.code} style={card}>
                <h2 style={{ ...heading, color: item.color }}>
                  {item.code} - {item.title}
                </h2>
                <p style={explanation}>{item.description}</p>
              </article>
            ))}

            <div style={card}>
              <h2 style={heading}>
                Kiểm tra trước khi diễn giải AST
              </h2>
              <p style={explanation}>
                1. Xác định đúng vi khuẩn và kháng sinh.
              </p>
              <p style={explanation}>
                2. Kiểm tra MIC và phương pháp xét nghiệm.
              </p>
              <p style={explanation}>
                3. Chọn CLSI hoặc EUCAST và phiên bản đang
                áp dụng.
              </p>
              <p style={explanation}>
                4. Kiểm tra điểm gãy, chế độ phơi nhiễm và
                chỉ định phù hợp.
              </p>
              <p style={explanation}>
                5. Đánh giá vị trí nhiễm khuẩn, chức năng
                thận, mức độ nặng và khả năng đạt mục tiêu
                PK/PD.
              </p>
            </div>
          </section>
        )}

        {tab === "practice" && (
          <section style={{ display: "grid", gap: 17 }}>
            <div style={card}>
              <h2 style={heading}>
                4. Quy trình ứng dụng PK/PD trong lâm sàng
              </h2>

              {[
                [
                  "Bước 1 - Xác định nhiễm khuẩn",
                  "Chẩn đoán hội chứng nhiễm khuẩn, ổ nhiễm, mức độ nặng và nhu cầu kiểm soát nguồn nhiễm.",
                ],
                [
                  "Bước 2 - Đánh giá vi sinh",
                  "Xem kết quả cấy, tác nhân, MIC, AST và độ tin cậy của mẫu bệnh phẩm.",
                ],
                [
                  "Bước 3 - Đánh giá người bệnh",
                  "Xem chức năng thận, gan, cân nặng, albumin, hồi sức, CRRT/ECMO và các yếu tố thay đổi PK.",
                ],
                [
                  "Bước 4 - Chọn mục tiêu PK/PD",
                  "Xác định chỉ số đặc trưng và mục tiêu phù hợp với kháng sinh, vi khuẩn, ổ nhiễm và bằng chứng.",
                ],
                [
                  "Bước 5 - Đánh giá chế độ liều",
                  "Xem liều, khoảng cách liều, thời gian truyền, đường dùng và khả năng đạt phơi nhiễm đích.",
                ],
                [
                  "Bước 6 - Theo dõi và tái đánh giá",
                  "Đánh giá đáp ứng, độc tính, dữ liệu vi sinh mới và TDM nếu có chỉ định, phương pháp phù hợp.",
                ],
              ].map(([step, description]) => (
                <div
                  key={step}
                  style={{
                    padding: "15px 0",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <strong>{step}</strong>
                  <p style={{ ...explanation, marginBottom: 0 }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div style={card}>
              <h2 style={heading}>
                Tình huống: Meropenem và MIC
              </h2>

              <p style={explanation}>
                Giả sử một chủng vi khuẩn có MIC của meropenem
                là 2 mg/L. Để đánh giá phơi nhiễm, chỉ biết
                MIC là chưa đủ.
              </p>
              <p style={explanation}>
                Cần có thông tin về chế độ liều, thời gian
                truyền, độ thanh thải, chức năng thận và mục
                tiêu fT&gt;MIC đã chọn.
              </p>
              <Notice>
                100% fT&gt;4×MIC là một mục tiêu phơi nhiễm
                tăng cường được sử dụng trong một số bối cảnh
                nghiên cứu hoặc người bệnh nặng, không mặc
                nhiên là mục tiêu bắt buộc cho mọi bệnh nhân
                và không chứng minh vi khuẩn đa kháng.
              </Notice>
            </div>
          </section>
        )}

        <footer
          style={{
            marginTop: 26,
            padding: 18,
            textAlign: "center",
            color: "#64748b",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          Bệnh viện 199 - Khoa Dược
          <br />
          Phát triển bởi Dược sĩ Phan Phúc
          <br />
          Tài liệu hỗ trợ chuyên môn, không thay thế
          đánh giá và quyết định điều trị của bác sĩ.
        </footer>
      </div>
    </main>
  );
}
