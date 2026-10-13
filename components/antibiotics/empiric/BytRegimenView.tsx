"use client";

/*
  FILE: components/antibiotics/empiric/BytRegimenView.tsx

  Hien thi phac do khang sinh kinh nghiem trich tu van ban BYT cho MOT mat benh.
  Moi phuong an ghi ro: van ban (so quyet dinh, ngay), muc/bang, trang.
  Khong tu chon thuoc, khong thay the danh gia cua bac si / duoc si lam sang.
*/

import { useMemo, useState } from "react";

import {
  DOCS,
  ROLE_TEXT,
  getRegimensForDisease,
  type Regimen,
} from "../../../data/antibiotics/empiric/regimens";

type Props = {
  diseaseId: string;
};

const NO_DOSE_MARK = "Nguồn BYT không nêu liều";

function hasNoDose(regimen: Regimen): boolean {
  return regimen.drugs.some((drug) => drug.dose.includes(NO_DOSE_MARK));
}

export default function BytRegimenView({ diseaseId }: Props) {
  const regimens = useMemo(
    () => getRegimensForDisease(diseaseId),
    [diseaseId]
  );

  const scenarios = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, Regimen[]>();

    for (const regimen of regimens) {
      const list = map.get(regimen.scenario);
      if (list) {
        list.push(regimen);
      } else {
        order.push(regimen.scenario);
        map.set(regimen.scenario, [regimen]);
      }
    }

    return order.map((name) => ({ name, items: map.get(name) ?? [] }));
  }, [regimens]);

  const [activeIndex, setActiveIndex] = useState(0);

  if (regimens.length === 0) {
    return (
      <section className="byt199">
        <div className="byt199-label">PHÁC ĐỒ BỘ Y TẾ</div>
        <div className="byt199-warn">
          Không có phác đồ kháng sinh kinh nghiệm cho mặt bệnh này trong các
          văn bản BYT đã đọc.
        </div>
      </section>
    );
  }

  const safeIndex = Math.min(activeIndex, scenarios.length - 1);
  const active = scenarios[safeIndex];

  return (
    <section className="byt199">
      <div className="byt199-label">PHÁC ĐỒ THEO VĂN BẢN BỘ Y TẾ</div>

      <p className="byt199-muted">
        {scenarios.length} tình huống · {regimens.length} phương án. Liều và
        thời gian được ghi nguyên văn theo nguồn; ứng dụng không tự quy đổi
        hay hiệu chỉnh liều.
      </p>

      {scenarios.length > 1 && (
        <div className="byt199-tabs" role="tablist" aria-label="Tình huống">
          {scenarios.map((scenario, index) => (
            <button
              key={scenario.name}
              type="button"
              role="tab"
              aria-selected={index === safeIndex}
              className={index === safeIndex ? "active" : ""}
              onClick={() => setActiveIndex(index)}
            >
              {scenario.name}
            </button>
          ))}
        </div>
      )}

      <h3 className="byt199-scenario">{active.name}</h3>

      <div className="byt199-cards">
        {active.items.map((regimen) => {
          const doc = DOCS[regimen.source.doc];

          return (
            <article key={regimen.id} className="byt199-card">
              <div className="byt199-badges">
                <span className={`byt199-role byt199-role-${regimen.role}`}>
                  {ROLE_TEXT[regimen.role]}
                </span>
                {hasNoDose(regimen) && (
                  <span className="byt199-flag">Nguồn không nêu liều</span>
                )}
              </div>

              <ul className="byt199-drugs">
                {regimen.drugs.map((drug, index) => (
                  <li key={`${regimen.id}-${index}`}>
                    <strong>{drug.name}</strong>
                    <span>{drug.dose}</span>
                  </li>
                ))}
              </ul>

              {regimen.duration && (
                <div className="byt199-duration">
                  <strong>Thời gian:</strong> {regimen.duration}
                </div>
              )}

              {regimen.notes && regimen.notes.length > 0 && (
                <ul className="byt199-notes">
                  {regimen.notes.map((note, index) => (
                    <li key={`${regimen.id}-n${index}`}>{note}</li>
                  ))}
                </ul>
              )}

              <div className="byt199-source">
                Nguồn: QĐ {doc.number} ({doc.date}) – {regimen.source.section},{" "}
                {regimen.source.page}
                <details>
                  <summary>Văn bản và hiệu lực</summary>
                  <div>
                    {doc.title} – {doc.issuer}. {doc.validity}
                  </div>
                </details>
              </div>
            </article>
          );
        })}
      </div>

      <div className="byt199-warn">
        Hỗ trợ tra cứu, không phải y lệnh. Cần đối chiếu kháng sinh đồ, chức
        năng thận/gan, dị ứng, danh mục thuốc BV199 và thẩm định của dược sĩ
        lâm sàng. Chưa có phác đồ nào mặc định được BV199 phê duyệt.
      </div>

      <style>{`
        .byt199 {
          background: #ffffff;
          border: 1px solid #dce6ed;
          border-radius: 12px;
          padding: 14px;
          display: grid;
          gap: 10px;
          min-width: 0;
          color: #17364b;
        }
        .byt199 * { box-sizing: border-box; }
        .byt199-label {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #0b6b8a;
        }
        .byt199-muted { margin: 0; font-size: 13px; color: #55707f; }
        .byt199-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
        .byt199-tabs button {
          border: 1px solid #c5d6e0;
          background: #f4f8fb;
          color: #17364b;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 13px;
          text-align: left;
          cursor: pointer;
          max-width: 100%;
        }
        .byt199-tabs button.active {
          background: #0b6b8a;
          border-color: #0b6b8a;
          color: #ffffff;
        }
        .byt199-scenario { margin: 0; font-size: 16px; line-height: 1.35; }
        .byt199-cards { display: grid; gap: 10px; }
        .byt199-card {
          border: 1px solid #dce6ed;
          border-radius: 10px;
          padding: 10px 12px;
          display: grid;
          gap: 8px;
          background: #fbfdfe;
          min-width: 0;
        }
        .byt199-badges { display: flex; flex-wrap: wrap; gap: 6px; }
        .byt199-role, .byt199-flag {
          font-size: 12px;
          font-weight: 700;
          border-radius: 999px;
          padding: 2px 9px;
        }
        .byt199-role { background: #e3f1f7; color: #0b5370; }
        .byt199-role-first { background: #dff3e6; color: #17603a; }
        .byt199-role-severe { background: #fde7e4; color: #8a2a1d; }
        .byt199-role-allergy { background: #fff1d6; color: #7a4d00; }
        .byt199-flag { background: #fff1d6; color: #7a4d00; }
        .byt199-drugs, .byt199-notes { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
        .byt199-drugs li { display: grid; gap: 2px; font-size: 14px; overflow-wrap: anywhere; }
        .byt199-drugs li span { color: #33505f; }
        .byt199-duration { font-size: 14px; overflow-wrap: anywhere; }
        .byt199-notes li {
          font-size: 13px;
          color: #55707f;
          padding-left: 10px;
          border-left: 3px solid #dce6ed;
          overflow-wrap: anywhere;
        }
        .byt199-source { font-size: 12px; color: #55707f; overflow-wrap: anywhere; }
        .byt199-source details { margin-top: 4px; }
        .byt199-warn {
          background: #fff8e6;
          border: 1px solid #f0d58c;
          color: #6b4b00;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
        }
        @media (prefers-color-scheme: dark) {
          .byt199 { background: #12202a; border-color: #2a3f4d; color: #e4eef4; }
          .byt199-card { background: #172a36; border-color: #2a3f4d; }
          .byt199-drugs li span, .byt199-notes li, .byt199-muted, .byt199-source { color: #a9c0cc; }
          .byt199-tabs button { background: #1b3140; border-color: #2a3f4d; color: #e4eef4; }
          .byt199-tabs button.active { background: #1c88ad; border-color: #1c88ad; color: #ffffff; }
        }
      `}</style>
    </section>
  );
}
