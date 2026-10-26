"use client";

/*
  FILE: components/antibiotics/empiric/ClinicalFilters.tsx
  Bo loc lam sang (Buoc 4A): muc do, nguy co khang thuoc, di ung penicillin,
  chuc nang than (CrCl), danh muc BV199. Trang thai dung chung qua context cho
  BytRegimenView (loc tinh huong/phuong an) va DrugActionLinks (danh dau thuoc).
*/

import { createContext, useContext, type ReactNode } from "react";

import {
  DEFAULT_FILTERS,
  isFilterActive,
  parseCrcl,
  type ClinicalFilterState,
} from "@/lib/antibiotics/clinical-filters";

const Ctx = createContext<ClinicalFilterState | null>(null);

export function ClinicalFilterProvider({
  value,
  children,
}: {
  value: ClinicalFilterState;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* null: trang khong co bo loc (vd. trang Theo tac nhan). */
export function useClinicalFilters(): ClinicalFilterState | null {
  return useContext(Ctx);
}

type Props = {
  value: ClinicalFilterState;
  onChange: (next: ClinicalFilterState) => void;
};

function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="cf199-field">
      <span className="cf199-label">{label}</span>
      <div className="cf199-seg" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            className={value === option.value ? "active" : ""}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ClinicalFilterPanel({ value, onChange }: Props) {
  const set = (patch: Partial<ClinicalFilterState>) => onChange({ ...value, ...patch });
  const crcl = parseCrcl(value.crcl);

  return (
    <details className="cf199">
      <summary>
        Bộ lọc lâm sàng
        <span className="cf199-hint"> · mức độ, kháng thuốc, dị ứng, CrCl, danh mục BV199</span>
        {isFilterActive(value) && <span className="cf199-on">đang lọc</span>}
      </summary>

      <div className="cf199-grid">
        <Seg
          label="Mức độ"
          value={value.severity}
          onChange={(severity) => set({ severity })}
          options={[
            { value: "all", label: "Tất cả" },
            { value: "mild", label: "Nhẹ / ngoại trú" },
            { value: "severe", label: "Nặng / ICU" },
          ]}
        />
        <Seg
          label="Nguy cơ kháng thuốc"
          value={value.mdr}
          onChange={(mdr) => set({ mdr })}
          options={[
            { value: "all", label: "Tất cả" },
            { value: "low", label: "Không nguy cơ" },
            { value: "high", label: "Có nguy cơ" },
          ]}
        />

        <div className="cf199-field">
          <span className="cf199-label">Dị ứng</span>
          <label className="cf199-check">
            <input
              type="checkbox"
              checked={value.penicillinAllergy}
              onChange={(e) =>
                set({
                  penicillinAllergy: e.target.checked,
                  hidePenicillin: e.target.checked ? value.hidePenicillin : false,
                })
              }
            />
            Dị ứng penicillin (đánh dấu thuốc)
          </label>
          {value.penicillinAllergy && (
            <label className="cf199-check">
              <input
                type="checkbox"
                checked={value.hidePenicillin}
                onChange={(e) => set({ hidePenicillin: e.target.checked })}
              />
              Ẩn phương án chứa penicillin
            </label>
          )}
        </div>

        <div className="cf199-field">
          <label className="cf199-label" htmlFor="cf199-crcl">
            Chức năng thận – CrCl (mL/phút)
          </label>
          <input
            id="cf199-crcl"
            className="cf199-input"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Ví dụ: 35"
            value={value.crcl}
            onChange={(e) => set({ crcl: e.target.value })}
          />
          {value.crcl.trim() !== "" && crcl === null && (
            <span className="cf199-warn">CrCl không hợp lệ.</span>
          )}
        </div>

        <div className="cf199-field">
          <span className="cf199-label">Danh mục thuốc BV199</span>
          <label className="cf199-check">
            <input
              type="checkbox"
              checked={value.formularyOnly}
              onChange={(e) => set({ formularyOnly: e.target.checked })}
            />
            Chỉ hiện phương án có thuốc trong danh mục
          </label>
        </div>
      </div>

      <p className="cf199-note">
        Lọc mức độ và nguy cơ theo từ khóa trong tên tình huống của nguồn; tình huống
        không ghi mức độ/nguy cơ vẫn hiển thị. Dị ứng: chỉ đánh dấu, không tự đổi
        thuốc – xem module Dị ứng kháng sinh. Liều theo CrCl lấy nguyên văn từ module
        Hiệu chỉnh liều. Bộ lọc áp dụng cho phác đồ dạng bảng; module CAP, HAP/VAP
        dùng bộ chọn nhanh riêng.
      </p>
      {isFilterActive(value) && (
        <button type="button" className="cf199-reset" onClick={() => onChange(DEFAULT_FILTERS)}>
          Xóa bộ lọc
        </button>
      )}

      <style>{`
        .cf199 { border: 1px solid #cfe3e8; border-radius: 12px; background: #fbfdfe; padding: 10px 14px; }
        .cf199 > summary { cursor: pointer; font-weight: 700; font-size: 13px; color: #17364b; }
        .cf199-hint { font-weight: 400; color: #647b8c; font-size: 12px; }
        .cf199-on { margin-left: 8px; padding: 2px 8px; border-radius: 99px; background: #087f89; color: #fff; font-size: 11px; }
        .cf199-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 10px; }
        .cf199-field { display: grid; gap: 6px; align-content: start; }
        .cf199-label { font-size: 11px; font-weight: 700; color: #4b6576; text-transform: uppercase; letter-spacing: .3px; }
        .cf199-seg { display: flex; flex-wrap: wrap; gap: 4px; }
        .cf199-seg button { min-height: 34px; padding: 6px 10px; border: 1px solid #cfdde6; border-radius: 8px; background: #fff; color: #17364b; font-size: 12px; cursor: pointer; }
        .cf199-seg button.active { background: #087f89; border-color: #087f89; color: #fff; font-weight: 700; }
        .cf199-check { display: flex; gap: 8px; align-items: center; font-size: 12px; color: #17364b; min-height: 30px; }
        .cf199-input { min-height: 36px; padding: 6px 10px; border: 1px solid #cfdde6; border-radius: 8px; font-size: 13px; max-width: 160px; }
        .cf199-warn { color: #b42318; font-size: 11px; }
        .cf199-note { margin: 10px 0 0; color: #647b8c; font-size: 11px; line-height: 1.6; }
        .cf199-reset { margin-top: 8px; border: 0; background: none; color: #087f89; font-weight: 700; font-size: 12px; cursor: pointer; padding: 0; }
      `}</style>
    </details>
  );
}
