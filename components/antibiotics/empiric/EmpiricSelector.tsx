"use client";

/*
  FILE: components/antibiotics/empiric/EmpiricSelector.tsx

  Form thong tin benh nhan -> chuyen toi NHANH phac do phu hop trong module.
  Khong tu chon thuoc. Thieu du lieu hoac ngoai pham vi -> bao khong du dieu kien.
*/

import { useState } from "react";

import {
  DEFAULT_CONTEXT,
  selectScenario,
  type ModuleKey,
  type PatientContext,
  type SelectionResult,
  type Setting,
  type UnitResistance,
} from "../../../lib/antibiotics/select-regimens";

type Props = {
  moduleKey: ModuleKey;
  diseaseTitle: string;
  onApply: (scenarioId: string | null) => void;
};

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="sel199-check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export default function EmpiricSelector({
  moduleKey,
  diseaseTitle,
  onApply,
}: Props) {
  const [ctx, setCtx] = useState<PatientContext>({
    ...DEFAULT_CONTEXT,
    setting: moduleKey === "cap" ? "outpatient" : "ward",
  });
  const [result, setResult] = useState<SelectionResult | null>(null);

  function patch(update: Partial<PatientContext>) {
    setCtx((current) => ({ ...current, ...update }));
    setResult(null);
  }

  function run() {
    const next = selectScenario(moduleKey, ctx, diseaseTitle);

    setResult(next);
    onApply(next.eligible ? next.scenarioId : null);
  }

  const isEnt = moduleKey === "ent";
  const isCap = moduleKey === "cap";
  const isHap = moduleKey === "hap";
  const isVap = moduleKey === "vap";

  const t = diseaseTitle.toLocaleLowerCase("vi");
  const isSinus = isEnt && t.includes("viêm xoang cấp");
  const isStrep = isEnt && t.includes("họng") && t.includes("liên cầu");
  const isAom = isEnt && t.includes("viêm tai giữa cấp");

  return (
    <section className="sel199">
      <style>{`
        .sel199 {
          background: #ffffff;
          border: 1px solid #dce6ed;
          border-radius: 12px;
          padding: 14px;
          display: grid;
          gap: 10px;
          min-width: 0;
          color: #17364b;
        }
        .sel199 * { box-sizing: border-box; }
        .sel199-label {
          font-size: 11px;
          font-weight: 700;
          color: #087f89;
        }
        .sel199 summary {
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
        }
        .sel199-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 8px;
          margin-top: 10px;
        }
        .sel199-field {
          display: grid;
          gap: 4px;
          font-size: 12px;
        }
        .sel199-field select {
          padding: 9px;
          border: 1px solid #dce6ed;
          border-radius: 8px;
          font-size: 13px;
          background: #fff;
        }
        .sel199-check {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          font-size: 12px;
          line-height: 1.6;
          padding: 8px;
          background: #f4f9fb;
          border-radius: 8px;
        }
        .sel199-check input { margin-top: 3px; }
        .sel199-btn {
          padding: 11px 14px;
          border: 0;
          border-radius: 9px;
          background: #087f89;
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          width: 100%;
        }
        .sel199-result {
          padding: 11px;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.8;
        }
        .sel199-ok { background: #e4f6f2; }
        .sel199-no { background: #fdeaea; }
        .sel199-result ul { margin: 6px 0 0; padding-left: 18px; }
        @media (min-width: 700px) {
          .sel199-btn { width: auto; }
        }
      `}</style>

      <details>
        <summary>
          Chọn nhánh phác đồ theo thông tin người bệnh
        </summary>

        <div className="sel199-label" style={{ marginTop: 8 }}>
          BỘ CHỌN NHÁNH · KHÔNG TỰ CHỌN THUỐC
        </div>

        <div className="sel199-grid">
          <Check
            label="Người lớn (≥ 18 tuổi)"
            checked={ctx.isAdult}
            onChange={(value) => patch({ isAdult: value })}
          />

          {isCap && (
            <label className="sel199-field">
              Nơi điều trị
              <select
                value={ctx.setting}
                onChange={(event) =>
                  patch({ setting: event.target.value as Setting })
                }
              >
                <option value="outpatient">Ngoại trú</option>
                <option value="ward">Nội trú – không ICU</option>
                <option value="icu">ICU / CAP nặng</option>
              </select>
            </label>
          )}

          {(isHap || isVap) && (
            <Check
              label="Bệnh nặng (suy hô hấp, sốc nhiễm khuẩn…)"
              checked={ctx.severe}
              onChange={(value) => patch({ severe: value })}
            />
          )}

          {isCap && ctx.setting === "outpatient" && (
            <>
              <Check
                label="> 65 tuổi hoặc có bệnh đồng mắc (tim, phổi, gan, thận mạn, đái tháo đường, nghiện rượu, ung thư)"
                checked={ctx.elderlyOrComorbid}
                onChange={(value) => patch({ elderlyOrComorbid: value })}
              />
              <Check
                label="Suy giảm miễn dịch"
                checked={ctx.immunosuppressed}
                onChange={(value) => patch({ immunosuppressed: value })}
              />
              <Check
                label="Đã dùng kháng sinh trong 3 tháng trước"
                checked={ctx.recentAntibiotic}
                onChange={(value) => patch({ recentAntibiotic: value })}
              />
              <Check
                label="Nguy cơ S. pneumoniae kháng thuốc / mầm bệnh kháng thuốc"
                checked={ctx.mdrRisk}
                onChange={(value) => patch({ mdrRisk: value })}
              />
            </>
          )}

          {(isHap || isVap) && (
            <>
              <Check
                label="Có yếu tố nguy cơ vi khuẩn Gram âm đa kháng"
                checked={ctx.mdrRisk}
                onChange={(value) => patch({ mdrRisk: value })}
              />
              <Check
                label="Có yếu tố nguy cơ MRSA"
                checked={ctx.mrsaRisk}
                onChange={(value) => patch({ mrsaRisk: value })}
              />
            </>
          )}

          {isVap && (
            <label className="sel199-field">
              Tỷ lệ Gram âm kháng thuốc định đơn trị tại đơn vị
              <select
                value={ctx.unitResistance}
                onChange={(event) =>
                  patch({
                    unitResistance: event.target.value as UnitResistance,
                  })
                }
              >
                <option value="unknown">Chưa biết</option>
                <option value="lt10">&lt; 10%</option>
                <option value="gt10">&gt; 10%</option>
              </select>
            </label>
          )}

          {(isSinus || isAom) && (
            <Check
              label="Đã đánh giá và quyết định dùng kháng sinh"
              checked={ctx.antibioticIndicated}
              onChange={(value) => patch({ antibioticIndicated: value })}
            />
          )}

          {isStrep && (
            <Check
              label="Đã xác nhận liên cầu nhóm A (test nhanh/cấy)"
              checked={ctx.gasConfirmed}
              onChange={(value) => patch({ gasConfirmed: value })}
            />
          )}

          <Check
            label="Tiền sử dị ứng penicillin/β-lactam"
            checked={ctx.penicillinAllergy}
            onChange={(value) => patch({ penicillinAllergy: value })}
          />
          <Check
            label="Suy giảm chức năng thận"
            checked={ctx.renalImpaired}
            onChange={(value) => patch({ renalImpaired: value })}
          />
          <Check
            label="Thai kỳ"
            checked={ctx.pregnant}
            onChange={(value) => patch({ pregnant: value })}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <button type="button" className="sel199-btn" onClick={run}>
            Chọn nhánh phác đồ phù hợp
          </button>
        </div>

        {result && (
          <div
            className={
              "sel199-result " + (result.eligible ? "sel199-ok" : "sel199-no")
            }
            style={{ marginTop: 10 }}
          >
            <strong>
              {result.eligible
                ? "Nhánh được chọn"
                : "Không đủ điều kiện gợi ý"}
            </strong>
            <div>{result.reason}</div>
            <ul>
              {result.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </details>
    </section>
  );
}
