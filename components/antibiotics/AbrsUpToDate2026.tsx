
"use client";

import { useState } from "react";

import DrugActionLinks from "./links/DrugActionLinks";

/*
  BV199 - KHOA DUOC
  VIEM MUI XOANG CAP DO VI KHUAN - NGUOI LON

  File:
  components/antibiotics/AbrsUpToDate2026.tsx

  Nguon:
  UpToDate 2026
  Graphic 106156 - Version 16.0

  Pham vi:
  - Nguoi lon
  - Mien dich binh thuong
  - Ngoai tru
  - Khong bien chung

  Khong ap dung module nay cho noi tru,
  suy giam mien dich hoac bien chung.
*/

type Answer = "" | "yes" | "no";

type Regimen = {
  id: string;
  title: string;
  medicines: string[];
  condition: string;
  caution?: string;
};

const SOURCE =
  "UpToDate 2026, Graphic 106156, Version 16.0";

const INITIAL: Record<string, Regimen[]> = {
  normal: [
    {
      id: "amox500",
      title: "Amoxicillin 500 mg mỗi 8 giờ",
      medicines: [
        "Amoxicillin 500 mg uống mỗi 8 giờ.",
      ],
      condition:
        "Không dị ứng penicillin, không có yếu tố nguy cơ phế cầu giảm nhạy hoặc kết cục xấu.",
    },
    {
      id: "amox875",
      title: "Amoxicillin 875 mg mỗi 12 giờ",
      medicines: [
        "Amoxicillin 875 mg uống mỗi 12 giờ.",
      ],
      condition:
        "Phương án liều khác thay cho amoxicillin 500 mg mỗi 8 giờ.",
    },
    {
      id: "clav500",
      title: "Amoxicillin/clavulanat 500/125 mg",
      medicines: [
        "Amoxicillin/clavulanat 500/125 mg uống mỗi 8 giờ.",
      ],
      condition:
        "Một lựa chọn đơn trị dạng phối hợp cố định.",
    },
    {
      id: "clav875",
      title: "Amoxicillin/clavulanat 875/125 mg",
      medicines: [
        "Amoxicillin/clavulanat 875/125 mg uống mỗi 12 giờ.",
      ],
      condition:
        "Phương án liều chuẩn khác.",
    },
  ],

  highRisk: [
    {
      id: "highClav",
      title: "Amoxicillin/clavulanat liều cao",
      medicines: [
        "Dạng giải phóng kéo dài 2.000/125 mg uống mỗi 12 giờ.",
      ],
      condition:
        "Có yếu tố nguy cơ phế cầu giảm nhạy hoặc kết cục xấu.",
      caution:
        "Chỉ sử dụng đúng dạng giải phóng kéo dài. Không thay bằng viên thông thường theo tỷ lệ mg. Kiểm tra chức năng thận.",
    },
  ],

  allergyCanCeph: [
    {
      id: "doxyA",
      title: "Doxycyclin đơn trị",
      medicines: [
        "Doxycyclin 100 mg uống mỗi 12 giờ HOẶC 200 mg uống mỗi 24 giờ.",
      ],
      condition:
        "Một lựa chọn khi dị ứng penicillin.",
      caution: "Tránh sử dụng trong thai kỳ.",
    },
    {
      id: "cefixime",
      title: "Cefixim + clindamycin",
      medicines: [
        "Cefixim 400 mg uống mỗi 24 giờ.",
        "Clindamycin 300 mg uống mỗi 6 giờ.",
      ],
      condition:
        "Dị ứng penicillin nhưng đã đánh giá có thể sử dụng cephalosporin.",
      caution:
        "Hai thuốc sử dụng phối hợp. Clindamycin làm tăng nguy cơ nhiễm C. difficile.",
    },
    {
      id: "cefpodoxime",
      title: "Cefpodoxim + clindamycin",
      medicines: [
        "Cefpodoxim 200 mg uống mỗi 12 giờ.",
        "Clindamycin 300 mg uống mỗi 6 giờ.",
      ],
      condition:
        "Lựa chọn phối hợp khác, thay cefixim bằng cefpodoxim.",
      caution:
        "Không phối hợp cefixim với cefpodoxim.",
    },
  ],

  allergyNoCeph: [
    {
      id: "doxyB",
      title: "Doxycyclin đơn trị",
      medicines: [
        "Doxycyclin 100 mg uống mỗi 12 giờ HOẶC 200 mg uống mỗi 24 giờ.",
      ],
      condition:
        "Dị ứng penicillin, không thể sử dụng cephalosporin.",
      caution: "Tránh dùng trong thai kỳ.",
    },
  ],
};

const FAILURE: Regimen[] = [
  {
    id: "failureClav",
    title: "Amoxicillin/clavulanat liều cao",
    medicines: [
      "Dạng giải phóng kéo dài 2.000/125 mg uống mỗi 12 giờ.",
    ],
    condition:
      "Cân nhắc khi chưa sử dụng chính chế độ này và không có chống chỉ định.",
  },
  {
    id: "failureLevo",
    title: "Levofloxacin – lựa chọn hạn chế",
    medicines: [
      "Levofloxacin 750 mg HOẶC 500 mg uống mỗi 24 giờ.",
    ],
    condition:
      "Chỉ cân nhắc khi không có lựa chọn phù hợp khác và lợi ích vượt nguy cơ.",
    caution:
      "Cảnh báo ADR nghiêm trọng của fluoroquinolon. Tránh trong thai kỳ. Kiểm tra CrCl, QT, tương tác.",
  },
  {
    id: "failureMoxi",
    title: "Moxifloxacin – lựa chọn hạn chế",
    medicines: [
      "Moxifloxacin 400 mg uống mỗi 24 giờ.",
    ],
    condition:
      "Một fluoroquinolon hô hấp thay thế khi phù hợp.",
    caution:
      "Không phối hợp với levofloxacin. Đánh giá QT và các cảnh báo an toàn.",
  },
  {
    id: "failureCefixime",
    title: "Cefixim + clindamycin",
    medicines: [
      "Cefixim 400 mg uống mỗi 24 giờ.",
      "Clindamycin 300 mg uống mỗi 6 giờ.",
    ],
    condition:
      "Chỉ khi có thể dùng cephalosporin, cần đổi nhóm thuốc và phác đồ này chưa được sử dụng ban đầu.",
    caution:
      "Đánh giá nguy cơ C. difficile.",
  },
  {
    id: "failureCefpodoxime",
    title: "Cefpodoxim + clindamycin",
    medicines: [
      "Cefpodoxim 200 mg uống mỗi 12 giờ.",
      "Clindamycin 300 mg uống mỗi 6 giờ.",
    ],
    condition:
      "Một tổ hợp thay thế khi có thể dùng cephalosporin.",
    caution:
      "Không dùng đồng thời cefixim và cefpodoxim.",
  },
];

const RISKS = [
  "Tỷ lệ phế cầu không nhạy penicillin tại khu vực >10%.",
  "Tuổi từ 65 trở lên.",
  "Nhập viện trong 3 tháng gần đây.",
  "Dùng kháng sinh trong 3 tháng gần đây.",
  "Suy giảm miễn dịch.",
  "Nhiều bệnh đồng mắc: đái tháo đường, tim, gan, thận...",
  "Nhiễm khuẩn nặng hoặc nguy cơ biến chứng sinh mủ.",
];

function RegimenCards({
  title,
  plans,
}: {
  title: string;
  plans: Regimen[];
}) {
  const [openId, setOpenId] = useState("");

  return (
    <section className="abrs-card">
      <h3>{title}</h3>

      <p className="abrs-muted">
        Mỗi thẻ là một lựa chọn riêng biệt.
        Dấu + trong tên phác đồ có nghĩa là phối hợp.
      </p>

      {plans.map((plan) => {
        const open = plan.id === openId;

        return (
          <div className="abrs-regimen" key={plan.id}>
            <button
              type="button"
              className="abrs-regimen-button"
              aria-expanded={open}
              onClick={() =>
                setOpenId(open ? "" : plan.id)
              }
            >
              <strong>{plan.title}</strong>
              <span>{open ? "−" : "+"}</span>
            </button>

            {open && (
              <div className="abrs-regimen-body">
                <strong>Thuốc và liều</strong>

                {plan.medicines.map((medicine, i) => (
                  <div
                    key={i}
                    className="abrs-medicine"
                  >
                    {medicine}
                  </div>
                ))}

                <DrugActionLinks
                  compact
                  texts={plan.medicines}
                  scenario={plan.title}
                />

                <p>
                  <b>Điều kiện:</b> {plan.condition}
                </p>

                {plan.caution && (
                  <div className="abrs-warning">
                    <b>Lưu ý:</b> {plan.caution}
                  </div>
                )}

                <p className="abrs-muted">
                  Nguồn: {SOURCE}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function ChoiceButtons({
  value,
  onChange,
  yesLabel = "Có",
  noLabel = "Không",
}: {
  value: Answer;
  onChange: (value: Answer) => void;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <div className="abrs-buttons">
      <button
        type="button"
        className={
          value === "yes"
            ? "abrs-choice active"
            : "abrs-choice"
        }
        onClick={() => onChange("yes")}
      >
        {yesLabel}
      </button>

      <button
        type="button"
        className={
          value === "no"
            ? "abrs-choice active"
            : "abrs-choice"
        }
        onClick={() => onChange("no")}
      >
        {noLabel}
      </button>
    </div>
  );
}

export default function AbrsUpToDate2026() {
  const [indication, setIndication] =
    useState<Answer>("");

  const [allergy, setAllergy] =
    useState<Answer>("");

  const [canCeph, setCanCeph] =
    useState<Answer>("");

  const [highRisk, setHighRisk] =
    useState<Answer>("");

  const [improved, setImproved] =
    useState<Answer>("");

  const [confirmed, setConfirmed] =
    useState<Answer>("");

  const [complicated, setComplicated] =
    useState<Answer>("");

  const [secondImproved, setSecondImproved] =
    useState<Answer>("");

  const [showRisks, setShowRisks] = useState(false);

  function resetFollowUp() {
    setImproved("");
    setConfirmed("");
    setComplicated("");
    setSecondImproved("");
  }

  function resetAll() {
    setAllergy("");
    setCanCeph("");
    setHighRisk("");
    resetFollowUp();
  }

  const initialKey =
    allergy === "yes"
      ? canCeph === "yes"
        ? "allergyCanCeph"
        : canCeph === "no"
        ? "allergyNoCeph"
        : ""
      : allergy === "no"
      ? highRisk === "yes"
        ? "highRisk"
        : highRisk === "no"
        ? "normal"
        : ""
      : "";

  const initialPlans = initialKey
    ? INITIAL[initialKey]
    : [];

  const failurePlans = FAILURE.filter((plan) => {
    if (
      allergy === "yes" &&
      plan.id === "failureClav"
    ) {
      return false;
    }

    if (
      allergy === "yes" &&
      canCeph === "no" &&
      (plan.id === "failureCefixime" ||
        plan.id === "failureCefpodoxime")
    ) {
      return false;
    }

    if (
      initialPlans.some(
        (item) =>
          item.id === "highClav" &&
          plan.id === "failureClav"
      )
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="abrs-module">
      <style>{`
        .abrs-module {
          display: grid;
          gap: 12px;
          min-width: 0;
          color: #17364b;
          font-family: inherit;
        }

        .abrs-module * {
          box-sizing: border-box;
        }

        .abrs-card {
          padding: 15px;
          background: #fff;
          border: 1px solid #dce6ed;
          border-radius: 12px;
          min-width: 0;
        }

        .abrs-card h2 {
          font-size: 19px;
          margin: 7px 0;
        }

        .abrs-card h3 {
          font-size: 16px;
          margin: 0 0 10px;
        }

        .abrs-kicker {
          font-size: 11px;
          font-weight: 700;
          color: #087f89;
          letter-spacing: .4px;
        }

        .abrs-muted {
          color: #61798b;
          font-size: 12px;
          line-height: 1.75;
        }

        .abrs-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .abrs-choice {
          padding: 11px 13px;
          border: 1px solid #d4e2e9;
          border-radius: 9px;
          background: #fff;
          color: #17364b;
          font-size: 13px;
          cursor: pointer;
        }

        .abrs-choice.active {
          background: #e3f6f2;
          border-color: #079f9b;
          font-weight: 700;
        }

        .abrs-warning {
          margin: 10px 0;
          background: #fff6e8;
          border-radius: 9px;
          padding: 12px;
          font-size: 12px;
          line-height: 1.8;
        }

        .abrs-info {
          margin: 10px 0;
          background: #eef8f8;
          border-radius: 9px;
          padding: 12px;
          font-size: 12px;
          line-height: 1.8;
        }

        .abrs-regimen {
          border: 1px solid #dce6ed;
          border-radius: 9px;
          overflow: hidden;
          margin-top: 8px;
        }

        .abrs-regimen-button {
          border: none;
          width: 100%;
          background: #fff;
          color: #17364b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          text-align: left;
          padding: 13px;
          cursor: pointer;
          font-size: 13px;
        }

        .abrs-regimen-button span {
          color: #087f89;
          font-size: 20px;
        }

        .abrs-regimen-body {
          padding: 13px;
          border-top: 1px solid #dce6ed;
          line-height: 1.8;
          font-size: 13px;
        }

        .abrs-medicine {
          padding: 10px;
          margin: 7px 0;
          border-radius: 8px;
          background: #f3f8fa;
          font-weight: 600;
        }

        .abrs-risk-button {
          border: none;
          padding: 5px 0;
          background: transparent;
          color: #087f89;
          font-weight: 700;
          cursor: pointer;
        }

        .abrs-module ul {
          padding-left: 20px;
          font-size: 13px;
          line-height: 1.85;
        }

        .abrs-module summary {
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .abrs-module a {
          color: #087f89;
        }

        @media (max-width: 650px) {
          .abrs-card {
            padding: 12px;
          }
        }
      `}</style>

      <section className="abrs-card">
        <div className="abrs-kicker">
          UPTODATE · 2026 · GRAPHIC 106156
        </div>

        <h2>
          Viêm mũi xoang cấp do vi khuẩn – Ngoại trú
        </h2>

        <p className="abrs-muted">
          Người lớn, không biến chứng, miễn dịch bình
          thường. Chỉ sử dụng sơ đồ lựa chọn thuốc
          khi đã xác định có chỉ định kháng sinh.
        </p>

        <div className="abrs-warning">
          Không áp dụng cho nội trú, trẻ em,
          người suy giảm miễn dịch hoặc
          nghi biến chứng hốc mắt/nội sọ.
        </div>
      </section>

      <section className="abrs-card">
        <h3>1. Đã có chỉ định kháng sinh?</h3>

        <p className="abrs-muted">
          Cần cân nhắc điều trị khi không bảo đảm
          theo dõi, bệnh tiến triển xấu trong thời gian
          theo dõi hoặc triệu chứng không thay đổi
          sau 7 ngày theo dõi, theo điều kiện của nguồn.
        </p>

        <ChoiceButtons
          value={indication}
          onChange={(value) => {
            setIndication(value);
            resetAll();
          }}
          yesLabel="Đã có chỉ định"
          noLabel="Chưa có chỉ định"
        />

        {indication === "no" && (
          <div className="abrs-info">
            Theo dõi và điều trị triệu chứng.
            Chưa lựa chọn kháng sinh trong công cụ này.
          </div>
        )}
      </section>

      {indication === "yes" && (
        <>
          <section className="abrs-card">
            <h3>2. Tiền sử dị ứng penicillin</h3>

            <ChoiceButtons
              value={allergy}
              onChange={(value) => {
                setAllergy(value);
                setCanCeph("");
                setHighRisk("");
                resetFollowUp();
              }}
              yesLabel="Có dị ứng"
              noLabel="Không dị ứng"
            />

            {allergy === "yes" && (
              <>
                <h3 style={{ marginTop: 18 }}>
                  Có thể sử dụng cephalosporin?
                </h3>

                <p className="abrs-muted">
                  Cần đánh giá loại phản ứng dị ứng,
                  mức độ nặng và tính an toàn trước
                  khi sử dụng cephalosporin.
                </p>

                <ChoiceButtons
                  value={canCeph}
                  onChange={(value) => {
                    setCanCeph(value);
                    resetFollowUp();
                  }}
                  yesLabel="Có thể dùng"
                  noLabel="Không thể dùng"
                />
              </>
            )}

            {allergy === "no" && (
              <>
                <h3 style={{ marginTop: 18 }}>
                  Có nguy cơ kháng thuốc hoặc tiên lượng xấu?
                </h3>

                <button
                  type="button"
                  className="abrs-risk-button"
                  onClick={() =>
                    setShowRisks((value) => !value)
                  }
                >
                  {showRisks
                    ? "− Thu gọn 7 yếu tố nguy cơ"
                    : "+ Xem 7 yếu tố nguy cơ"}
                </button>

                {showRisks && (
                  <ul>
                    {RISKS.map((risk) => (
                      <li key={risk}>{risk}</li>
                    ))}
                  </ul>
                )}

                <ChoiceButtons
                  value={highRisk}
                  onChange={(value) => {
                    setHighRisk(value);
                    resetFollowUp();
                  }}
                  yesLabel="Có nguy cơ"
                  noLabel="Không có nguy cơ"
                />
              </>
            )}
          </section>

          {initialKey && (
            <>
              <RegimenCards
                key={initialKey}
                title="3. Lựa chọn kháng sinh ban đầu"
                plans={initialPlans}
              />

              <section className="abrs-card">
                <h3>4. Đánh giá đáp ứng điều trị</h3>

                <p className="abrs-muted">
                  Khi cải thiện, hoàn thành tổng thời gian
                  điều trị ban đầu thường là 5–7 ngày.
                </p>

                <ChoiceButtons
                  value={improved}
                  onChange={(value) => {
                    setImproved(value);
                    setConfirmed("");
                    setComplicated("");
                    setSecondImproved("");
                  }}
                  yesLabel="Có cải thiện"
                  noLabel="Không cải thiện"
                />

                {improved === "yes" && (
                  <div className="abrs-info">
                    Tiếp tục đến đủ tổng thời gian điều trị
                    5–7 ngày khi phù hợp tình trạng lâm sàng.
                  </div>
                )}
              </section>

              {improved === "no" && (
                <>
                  <section className="abrs-card">
                    <h3>5. Xác nhận lại chẩn đoán</h3>

                    <p className="abrs-muted">
                      Đánh giá tuân thủ, chẩn đoán thay thế,
                      thuốc đã dùng và dấu hiệu biến chứng.
                    </p>

                    <ChoiceButtons
                      value={confirmed}
                      onChange={(value) => {
                        setConfirmed(value);
                        setComplicated("");
                        setSecondImproved("");
                      }}
                      yesLabel="Vẫn xác nhận ABRS"
                      noLabel="Nghi chẩn đoán khác"
                    />

                    {confirmed === "no" && (
                      <div className="abrs-warning">
                        Đánh giá và điều trị theo nguyên nhân
                        thay thế. Không tự động bắt đầu
                        đợt kháng sinh khác.
                      </div>
                    )}

                    {confirmed === "yes" && (
                      <>
                        <h3 style={{ marginTop: 18 }}>
                          Có nghi biến chứng?
                        </h3>

                        <ChoiceButtons
                          value={complicated}
                          onChange={(value) => {
                            setComplicated(value);
                            setSecondImproved("");
                          }}
                        />

                        {complicated === "yes" && (
                          <div className="abrs-warning">
                            Cần đánh giá khẩn, xem xét
                            chẩn đoán hình ảnh, hội chẩn
                            và chuyển tuyến hoặc nhập viện
                            phù hợp. Không dùng nhánh
                            ngoại trú không biến chứng.
                          </div>
                        )}
                      </>
                    )}
                  </section>

                  {confirmed === "yes" &&
                    complicated === "no" && (
                      <>
                        <RegimenCards
                          key="failure"
                          title="6. Phác đồ thay thế khi thất bại"
                          plans={failurePlans}
                        />

                        <section className="abrs-card">
                          <div className="abrs-warning">
                            Các thuốc trên không phải lựa
                            chọn ngang nhau. Cần xem thuốc
                            đã sử dụng, loại dị ứng, nguy cơ
                            ADR và khả năng đổi nhóm thuốc.
                            Đặc biệt hạn chế fluoroquinolon.
                          </div>

                          <h3>7. Theo dõi sau thay đổi điều trị</h3>

                          <ChoiceButtons
                            value={secondImproved}
                            onChange={setSecondImproved}
                            yesLabel="Có cải thiện"
                            noLabel="Không cải thiện"
                          />

                          {secondImproved === "yes" && (
                            <div className="abrs-info">
                              Theo nhánh đáp ứng sau
                              điều trị thay thế của nguồn,
                              thời gian điều trị tổng cộng
                              có thể là 7–10 ngày.
                              Cá thể hóa theo diễn biến.
                            </div>
                          )}

                          {secondImproved === "no" && (
                            <div className="abrs-warning">
                              Cân nhắc chẩn đoán hình ảnh
                              và/hoặc chuyển Tai Mũi Họng
                              để đánh giá chuyên sâu,
                              lấy mẫu vi sinh và xử trí
                              nguyên nhân thất bại.
                            </div>
                          )}
                        </section>
                      </>
                    )}
                </>
              )}
            </>
          )}
        </>
      )}

      <section className="abrs-card">
        <details>
          <summary>
            Chống chỉ định, cảnh báo và ngoại lệ
          </summary>

          <ul>
            <li>
              Tránh doxycyclin và fluoroquinolon
              trong thai kỳ.
            </li>
            <li>
              Fluoroquinolon hô hấp chỉ nên sử dụng
              khi các lựa chọn thích hợp khác không
              thể dùng và lợi ích vượt nguy cơ.
            </li>
            <li>
              Clindamycin tăng nguy cơ nhiễm
              Clostridioides difficile.
            </li>
            <li>
              Lựa chọn thuốc cần xét đến dị ứng,
              bệnh đồng mắc, ADR, tuân thủ và
              ưu tiên của người bệnh.
            </li>
            <li>
              Dấu hiệu nghi biến chứng:
              nhiễm độc toàn thân, rối loạn tri giác,
              dấu thần kinh, nhiễm khuẩn lan
              da, mô mềm hoặc xương.
            </li>
            <li>
              Nếu đã dùng fluoroquinolon hô hấp
              ban đầu mà không cải thiện, cần
              tìm nguyên nhân khác hoặc đánh giá
              chuyên khoa, không chỉ đổi kháng sinh.
            </li>
            <li>
              Kiểm tra CrCl, chế phẩm, tương tác
              và antibiogram BV199 trước áp dụng.
            </li>
          </ul>
        </details>
      </section>

      <section className="abrs-card">
        <details>
          <summary>Tài liệu tham khảo</summary>

          <p className="abrs-muted">{SOURCE}</p>

          <p className="abrs-muted">
            Sơ đồ điều trị ngoại trú, trang 2;
            chú thích điều kiện và an toàn,
            trang 3 của PDF người dùng cung cấp.
          </p>

          <p className="abrs-muted">
            Đây là dữ liệu hỗ trợ tra cứu,
            chưa phải phác đồ nội viện BV199
            được phê duyệt.
          </p>
        </details>
      </section>
    </div>
  );
}
