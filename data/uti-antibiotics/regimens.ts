/* Ghép phác đồ hiển thị với đoạn nguồn, chỉ dùng phía máy chủ và trong script kiểm tra. */
import { PUBLIC_REGIMENS } from "./public-regimens";
import { SOURCE_TEXT } from "./source-text";
import type { Regimen } from "./types";

export const REGIMENS: Regimen[] = PUBLIC_REGIMENS.map((r) => ({ ...r, sourceText: SOURCE_TEXT[r.id] }));
