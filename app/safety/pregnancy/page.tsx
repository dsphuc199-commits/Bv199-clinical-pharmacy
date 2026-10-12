"use client";

import { useState } from "react";

export default function PregnancyPage() {
  const [drug, setDrug] = useState("");

  return (
    <div className="clinical-page">

      <div className="clinical-page-header">

        <span className="section-kicker">
          AN TOÀN THUỐC
        </span>

        <h1>
          Thai kỳ & cho con bú
        </h1>

        <p>
          Tra cứu thông tin sử dụng thuốc trong thai kỳ
          và thời kỳ cho con bú.
        </p>

      </div>


      <section className="clinical-card">

        <div className="clinical-card-heading">
          <div>
            <span className="step-number">
              01
            </span>

            <h2>
              Tra cứu thuốc
            </h2>
          </div>
        </div>


        <div className="clinical-form-grid">

          <label className="clinical-field clinical-field-wide">

            <span>
              Hoạt chất / biệt dược
            </span>

            <input
              type="text"
              value={drug}
              onChange={(event) =>
                setDrug(event.target.value)
              }
              placeholder="Ví dụ: Amoxicillin"
            />

          </label>

        </div>


        {!drug ? (
          <div className="clinical-empty">

            <div className="clinical-empty-icon">
              TK
            </div>

            <strong>
              Nhập tên thuốc
            </strong>

            <p>
              Hệ thống sẽ hiển thị thông tin thai kỳ
              và cho con bú.
            </p>

          </div>
        ) : (
          <div className="clinical-warning">

            <strong>
              Dữ liệu chuyên môn chưa được liên kết
            </strong>

            <p>
              Ở bước tiếp theo, dữ liệu sẽ được liên kết
              với nguồn tham khảo đã được xác thực.
            </p>

          </div>
        )}

      </section>

    </div>
  );
}