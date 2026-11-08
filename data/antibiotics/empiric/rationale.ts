/*
  FILE: data/antibiotics/empiric/rationale.ts

  Tang 3 – "Vì sao chọn phác đồ này?" (mac dinh an).
  Moi tieu chi: Tiêu chí -> Ý nghĩa lâm sàng -> Ảnh hưởng đến lựa chọn kháng sinh, kem nguon.
  Chi soan cho nhanh co can cu trong van ban da doc; nhanh chua soan tra ve ban "Cần thẩm định"
  chi gom dieu kien ap dung theo nguon (khong tu suy dien y nghia).
*/

import {
  OS_GRAMNEG, OS_MRSA, OS_MSSA, OS_POLY, OS_PSEUDO,
  SA_CULTURE, SA_EMPIRIC, SA_GC, SA_MRSA, SA_PSEUDO,
} from "./regimens/musculoskeletal";
import { DOCS } from "./regimens/sources";
import type { Regimen } from "./regimens/types";
import { RATIONALE_708 } from "./rationale-708";
import { RATIONALE_OTHER } from "./rationale-other";

export type ClinicalCriterion = {
  condition: string;
  clinicalMeaning?: string;
  treatmentImplication?: string;
  sources?: string[];
};

export type Rationale = {
  status: "authored" | "requires_review";
  items: ClinicalCriterion[];
  reassessment?: string[];
};

const Q708 = (loc: string) => `QĐ 708/QĐ-BYT (2015) – ${loc}`;

const AUTHORED: Record<string, Record<string, Omit<Rationale, "status">>> = {
  "v8-33": {
    [SA_EMPIRIC]: {
      items: [
        { condition: "Viêm khớp cấp, chưa có kết quả cấy; hoặc nhuộm Gram dịch khớp thấy cầu khuẩn Gram dương.",
          clinicalMeaning: "Thể không do lậu cầu chủ yếu do tụ cầu vàng (50–70%) và liên cầu (khoảng 20%).",
          treatmentImplication: "Khởi trị bằng kháng sinh chống tụ cầu (oxacilin hoặc nafcilin); clindamycin là lựa chọn thay thế.",
          sources: [Q708("Viêm khớp nhiễm khuẩn, mục 2b, 4.2.1a; tr. 162, 164")] },
        { condition: "Đã lấy cấy máu, cấy dịch khớp, soi tươi và nhuộm Gram trước liều kháng sinh đầu.",
          clinicalMeaning: "Bệnh phẩm trước kháng sinh quyết định khả năng định danh tác nhân.",
          treatmentImplication: "Cho phép chuyển sang điều trị đích theo kháng sinh đồ.",
          sources: [Q708("Viêm khớp nhiễm khuẩn, mục 4.1; tr. 163")] },
      ],
      reassessment: ["Sau 5–7 ngày điều trị đúng thuốc kèm hút dẫn lưu mà không cải thiện: chỉ định nội soi rửa khớp hoặc phẫu thuật."],
    },
    [SA_MRSA]: {
      items: [
        { condition: "Dịch tễ tại cộng đồng hoặc bệnh viện gợi ý tụ cầu vàng kháng kháng sinh, hoặc kháng sinh đồ xác định MRSA.",
          clinicalMeaning: "MRSA kháng toàn bộ beta-lactam; phác đồ ban đầu không bao phủ.",
          treatmentImplication: "Chọn một thuốc chống MRSA: vancomycin, daptomycin hoặc teicoplanin.",
          sources: [Q708("Viêm khớp nhiễm khuẩn, mục 4.2.1a; tr. 164"), Q708("Đề kháng của vi khuẩn Gram dương; tr. 57")] },
      ],
    },
    [SA_PSEUDO]: {
      items: [
        { condition: "Nghi ngờ hoặc xác định nhiễm trực khuẩn mủ xanh.",
          clinicalMeaning: "Tác nhân Gram âm không được bao phủ bởi kháng sinh chống tụ cầu.",
          treatmentImplication: "Phối hợp ceftazidim với một aminoglycosid; sau khoảng 2 tuần chuyển ciprofloxacin uống.",
          sources: [Q708("Viêm khớp nhiễm khuẩn, mục 4.2.1a; tr. 164")] },
      ],
    },
    [SA_CULTURE]: {
      items: [
        { condition: "Đã có kết quả cấy máu hoặc dịch khớp kèm kháng sinh đồ.",
          clinicalMeaning: "Xác định tác nhân và độ nhạy cảm.",
          treatmentImplication: "Chọn phác đồ đúng tác nhân; tiếp tục phác đồ ban đầu nếu đáp ứng tốt.",
          sources: [Q708("Viêm khớp nhiễm khuẩn, mục 4.2.1a; tr. 164")] },
      ],
    },
    [SA_GC]: {
      items: [
        { condition: "Hội chứng nhiễm lậu cầu lan tỏa hoặc viêm khớp kèm triệu chứng niệu sinh dục.",
          clinicalMeaning: "Lậu cầu chiếm 70–75% nhiễm khuẩn khớp ở người lớn dưới 40 tuổi.",
          treatmentImplication: "Chọn theo độ nhạy penicilin; nghi kháng: ceftriaxon. Nghi đồng nhiễm Chlamydia: phối hợp thêm doxycyclin, tetracyclin hoặc erythromycin.",
          sources: [Q708("Viêm khớp nhiễm khuẩn, mục 2a, 3a, 4.2.1b; tr. 162–165")] },
      ],
    },
  },
  "v8-32": {
    [OS_MSSA]: {
      items: [
        { condition: "Viêm xương tủy, chưa có kháng sinh đồ hoặc tụ cầu vàng nhạy methicilin.",
          clinicalMeaning: "Tụ cầu vàng là tác nhân hàng đầu của viêm xương tủy.",
          treatmentImplication: "Khởi trị nafcilin hoặc oxacilin đường tĩnh mạch liều cao.",
          sources: [Q708("Viêm xương tủy, mục 2a, 4.2.1a; tr. 166–167")] },
        { condition: "Dị ứng hoặc không đáp ứng các kháng sinh chống tụ cầu.",
          clinicalMeaning: "Không dùng được hoặc thất bại với lựa chọn chuẩn.",
          treatmentImplication: "Chọn clindamycin, levofloxacin ± rifampicin, hoặc acid fusidic kết hợp rifampicin.",
          sources: [Q708("Viêm xương tủy, mục 4.2.1a; tr. 168")] },
      ],
    },
    [OS_MRSA]: {
      items: [
        { condition: "Nghi ngờ hoặc xác định tụ cầu vàng kháng methicilin.",
          clinicalMeaning: "MRSA kháng toàn bộ beta-lactam.",
          treatmentImplication: "Chọn vancomycin, daptomycin, teicoplanin hoặc linezolid; rifampicin không dùng đơn độc.",
          sources: [Q708("Viêm xương tủy, mục 4.2.1a; tr. 167"), Q708("Phối hợp kháng sinh; tr. 30")] },
      ],
    },
    [OS_PSEUDO]: {
      items: [
        { condition: "Nghi ngờ hoặc xác định trực khuẩn mủ xanh.",
          clinicalMeaning: "Cần thuốc có hoạt tính trên P. aeruginosa.",
          treatmentImplication: "Phối hợp ceftazidim với aminoglycosid khoảng 2 tuần, sau đó ciprofloxacin uống.",
          sources: [Q708("Viêm xương tủy, mục 4.2.1a; tr. 168")] },
      ],
    },
    [OS_POLY]: {
      items: [
        { condition: "Viêm xương dài sau đóng đinh nội tủy.",
          clinicalMeaning: "Thường đồng nhiễm S. aureus, trực khuẩn Gram âm và P. aeruginosa.",
          treatmentImplication: "Phối hợp vancomycin (hoặc linezolid) với ceftazidim; tháo bỏ vật cấy ghép khi có chỉ định.",
          sources: [Q708("Viêm xương tủy, mục 4.2.1a, 4.2.2; tr. 168")] },
      ],
    },
    [OS_GRAMNEG]: {
      items: [
        { condition: "Tác nhân là trực khuẩn Gram âm đường ruột.",
          clinicalMeaning: "Phần lớn còn nhạy cephalosporin thế hệ 3–4 hoặc fluoroquinolon.",
          treatmentImplication: "Chọn cephalosporin thế hệ 3 hoặc 4 tĩnh mạch, hoặc levofloxacin. Viêm xương mạn tính hoặc trên nền đái tháo đường: điều trị theo vi khuẩn học và kháng sinh đồ.",
          sources: [Q708("Viêm xương tủy, mục 4.2.1a; tr. 168")] },
      ],
    },
  },
};

/** Luon tra ve mot khoi; nhanh chua soan -> chi dieu kien ap dung theo nguon, nhan Cần thẩm định. */
/**
 * Nhanh chua soan: chi hien dieu kien ap dung va vi tri nguon lay tu chinh du lieu phac do
 * (khong suy dien y nghia lam sang).
 */
function fallback(scenario: string, regimens?: Regimen[]): Rationale {
  const items: ClinicalCriterion[] = [{ condition: scenario }];
  if (regimens?.length) {
    const seen = new Set<string>();
    for (const r of regimens) {
      if (r.condition && !seen.has(r.condition)) { seen.add(r.condition); items.push({ condition: r.condition }); }
    }
    const src = [...new Set(regimens.map((r) => `${DOCS[r.source.doc] ? `QĐ ${DOCS[r.source.doc].number}` : r.source.doc} – ${r.source.section}; ${r.source.page}`))];
    items[0] = { condition: scenario, sources: src };
  }
  return { status: "requires_review", items };
}

export function getRationale(diseaseId: string, scenario: string, regimens?: Regimen[]): Rationale {
  const a = AUTHORED[diseaseId]?.[scenario];
  if (a) return { status: "authored", ...a };
  for (const table of [RATIONALE_708, RATIONALE_OTHER]) {
    const d = table[diseaseId];
    const b = d?.branches[scenario];
    if (d && b) return { status: "authored", items: [...b, ...(d.common ?? [])], reassessment: d.reassessment };
  }
  return fallback(scenario, regimens);
}

export function authoredRationaleCount(): { diseases: number; branches: number } {
  const ds = [...Object.values(AUTHORED), ...[RATIONALE_708, RATIONALE_OTHER].flatMap((t) => Object.values(t).map((d) => d.branches))];
  return { diseases: ds.length, branches: ds.reduce((n, d) => n + Object.keys(d).length, 0) };
}
