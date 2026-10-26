/*
  FILE: data/antibiotics/empiric/icd10.ts

  Ma ICD-10 (phien ban WHO) dung de TIM KIEM mat benh. Chi gan ma khi mat benh
  tuong ung ro rang voi mot nhom ma; mat benh khong co ma ro rang (vd. VPBV,
  VPLQTM, phan nhom theo tac nhan da khang, ban chan DTD) de trong.
  Khong dung de ma hoa benh an – doi chieu bo ma ICD-10 Bo Y te hien hanh.
*/

export const ICD10: Record<string, string[]> = {
  "v8-1": ["J13", "J14", "J15", "J18"],
  "v8-101": ["J13", "J14", "J15", "J18"],
  "v8-102": ["P23"],
  "v8-6": ["J44.0", "J44.1"],
  "v8-9": ["J85"],
  "v8-10": ["J47"],
  "v8-11": ["A41.9"],
  "v8-12": ["R57.2"],
  "v8-13": ["A41.0", "A41.1"],
  "v8-14": ["A41.5"],
  "v8-103": ["P36"],
  "v8-2": ["N39.0"],
  "v8-16": ["N30.0"],
  "v8-17": ["N10"],
  "v8-97": ["O23"],
  "v8-21": ["K65.0"],
  "v8-24": ["K83.0"],
  "v8-25": ["A04.7"],
  "v8-27": ["L03"],
  "v8-107": ["L03"],
  "v8-28": ["L02"],
  "v8-32": ["M86"],
  "v8-33": ["M00"],
  "v8-36": ["G00"],
  "v8-104": ["G00"],
  "v8-39": ["I33.0"],
  "v8-3": ["B37.7"],
  "v8-121": ["B37.7"],
  "v8-122": ["B37.6"],
  "v8-50": ["B44.0"],
  "v8-51": ["B45.1"],
  "v8-128": ["B45"],
  "v8-52": ["B46"],
  "v8-53": ["B59"],
  "v8-96": ["B37.3"],
  "v8-129": ["B39"],
  "v8-7": ["J01"],
  "v8-58": ["J01"],
  "v8-8": ["J02.0"],
  "v8-54": ["J02.0"],
  "v8-60": ["H66.0"],
  "v8-99": ["H66.0"],
  "v8-56": ["J36"],
  "v8-57": ["J39.0"],
  "v8-83": ["H10.0"],
  "v8-85": ["H44.0"],
  "v8-87": ["H05.0"],
  "v8-88": ["H04.3"],
  "v8-92": ["O86"],
  "v8-95": ["N76.0"],
  "v8-113": ["D70"],
  "v8-116": ["D70"],
  "v8-135": ["A01.0"],
  "v8-141": ["A17.0"],
  "v8-142": ["A15", "A16"],
};

export function icdOf(diseaseId: string): string[] {
  return ICD10[diseaseId] ?? [];
}
