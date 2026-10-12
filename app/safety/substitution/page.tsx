"use client";

import { useState } from "react";

export default function SubstitutionPage() {
  const [drug, setDrug] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="clinical-page">

      <div className="clinical-page-header">
        <span className="section-kicker">
          DƯỢC LÂM SÀNG
        </span>

        <h1>
          Thay thế thuốc
        </h1>

        <p>
          Hỗ trợ đánh giá lựa chọn thuốc thay thế dựa trên
          chỉ định, nhóm điều trị, an toàn và đặc điểm người bệnh.
        </p>
      </div>


      <div className="ams-workspace">

        <section className="clinical-card">

          <div className="clinical-card-heading">
            <div>
              <span className="step-number">
                01
              </span>

              <h2>
                Thuốc cần thay thế
              </h2>
            </div>
          </div>


          <div className="clinical-form-grid">

            <label className="clinical-field clinical-field-wide">
              <span>
                Tên thuốc
              </span>

              <input
                type="text"
                value={drug}
                onChange={(event) =>
                  setDrug(event.target.value)
                }
                placeholder="Ví dụ: Ceftriaxone"
              />
            </label>


            <label className="clinical-field clinical-field-wide">
              <span>
                Lý do thay thế
              </span>

              <select
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
              >
                <option value="">
                  Chọn lý do
                </option>

                <option value="stock">
                  Hết thuốc / thiếu thuốc
                </option>

                <option value="allergy">
                  Dị ứng
                </option>

                <option value="adr">
                  ADR
                </option>

                <option value="resistance">
                  Kháng thuốc
                </option>

                <option value="response">
                  Không đáp ứng
                </option>

                <option value="iv-po">
                  Chuyển IV → PO
                </option>
              </select>
            </label>

          </div>

        </section>


        <section className="clinical-card">

          <div className="clinical-card-heading">
            <div>
              <span className="step-number">
                02
              </span>

              <h2>
                Gợi ý thay thế
              </h2>
            </div>
          </div>


          {!drug || !reason ? (
            <div className="clinical-empty">

              <div className="clinical-empty-icon">
                TH
              </div>

              <strong>
                Chưa đủ dữ liệu
              </strong>

              <p>
                Nhập thuốc và lý do thay thế để tiếp tục đánh giá.
              </p>

            </div>
          ) : (
            <div className="clinical-warning">

              <strong>
                Chưa liên kết dữ liệu thay thế thuốc
              </strong>

              <p>
                Sau khi kết nối danh mục thuốc BV199,
                hệ thống sẽ đề xuất lựa chọn thay thế theo
                nhóm điều trị và bối cảnh lâm sàng.
              </p>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}