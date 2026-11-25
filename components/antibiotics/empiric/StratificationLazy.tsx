"use client";
/*
  Khung phân tầng nạp theo nhu cầu: file này (cùng toàn bộ dữ liệu phân tầng) chỉ được tải khi trang cần hiển thị
  khung – trang phác đồ import qua next/dynamic.
*/
import StratificationPanel from "./StratificationPanel";
import { stratificationFor } from "../../../data/antibiotics/empiric/stratification";
import type { ComponentProps } from "react";

type Props = { diseaseId: string } & Omit<ComponentProps<typeof StratificationPanel>, "data">;

export default function StratificationLazy({ diseaseId, ...rest }: Props) {
  const data = stratificationFor(diseaseId);
  return data ? <StratificationPanel data={data} {...rest} /> : null;
}
