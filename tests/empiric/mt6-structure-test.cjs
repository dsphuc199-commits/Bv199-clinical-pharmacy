// Unit test Master Task 6 – du lieu phac do co cau truc (AND/OR, moi thuoc mot doi tuong, truong lieu rieng).
// Chay: node tests/empiric/mt6-structure-test.cjs
const fs = require("fs"), path = require("path");
const load = require("./tsrun.cjs");
const S = load("lib/antibiotics/regimen-structure.ts");
const R = load("data/antibiotics/empiric/regimens/index.ts");
const C = load("data/antibiotics/empiric/catalog.ts");
const A = load("data/antibiotics/empiric/safety-alerts.ts");
const I = load("data/antibiotics/empiric/international.ts");
const CAP = load("components/antibiotics/CapByt2026.tsx");
const HV = load("components/antibiotics/HapVap2023.tsx");
let pass = 0, fail = 0;
const check = (n, ok, d) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"}  ${n}${!ok && d !== undefined ? "  — " + JSON.stringify(d).slice(0, 400) : ""}`); };
const byId = new Map(R.ALL_REGIMENS.map((r) => [r.id, r]));
const st = (id) => S.structureOf(byId.get(id));
const shown = new Map();
for (const d of C.DISEASES) for (const r of R.getRegimensForDisease(d.id)) shown.set(r.id, r);
const all = [...shown.values()].map((r) => ({ r, s: S.structureOf(r) }));

/* ---------- 1. Bao toan nguyen van & khong tao so lieu ---------- */
const before = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "byt-regimens-baseline.json"), "utf8"));
check("300 phương án BYT gốc vẫn còn đủ (lớp cấu trúc không sửa dữ liệu nguồn)", R.ALL_REGIMENS.length === before.regimens.length && before.regimens.length === 300);
check(`Tách cấu trúc được cho toàn bộ ${shown.size} phương án đang hiển thị`, all.length === shown.size && all.every(({ s }) => s.groups.length > 0));
const rawLost = all.filter(({ r, s }) => {
  const raws = s.groups.flatMap((g) => g.raw);
  return raws.length !== r.drugs.length || raws.some((x, i) => x.name !== r.drugs[i].name || x.dose !== r.drugs[i].dose);
});
check("Mỗi phương án giữ đủ nguyên văn từng mục thuốc (kể cả mục 'hoặc …' đã gộp nhóm)", rawLost.length === 0, rawLost.map((x) => x.r.id));

const norm = (t) => (t ?? "").replace(/\s+/g, " ").trim();
const invented = [];
for (const { r, s } of all) {
  const full = norm(r.drugs.map((d) => `${d.name} ${d.dose}`).join(" "));
  for (const g of s.groups) for (const o of g.options) {
    for (const k of ["dose", "interval", "infusionDuration", "maxDose", "dailyDose", "course", "context"]) {
      const v = norm(o[k]);
      if (v && !full.includes(v)) invented.push(`${r.id}:${o.name}:${k}=${v}`);
    }
    // so trong don vi (mg, g, ...) cung phai co trong nguyen van
    if (o.doseUnit && !/^(?:triệu đơn vị|triệu UI|MIU|MUI|UI|IU|đơn vị|mcg|µg|mg|g)(?:\/kg)?(?:\/ngày|\/lần)?$/i.test(o.doseUnit)) invented.push(`${r.id}:${o.name}:unit=${o.doseUnit}`);
  }
}
check("Không tạo số liệu: mọi liều/khoảng cách/thời gian truyền/liều tối đa đều là chuỗi con của nguyên văn", invented.length === 0, invented.slice(0, 10));

/* ---------- 2. Gan nham lieu giua cac thuoc ---------- */
const DL = load("lib/antibiotics/drug-links.ts");
const misattrib = [];
for (const { r, s } of all) for (const g of s.groups) {
  if (g.ambiguous) continue;
  for (const o of g.options) {
    // Doan nguyen van cua thuoc khong duoc chua ten hoat chat KHAC (neu co -> phai danh dau mo ho).
    const ids = DL.findDrugs([o.raw]).map((d) => d.ingredientId);
    const foreign = ids.filter((id) => o.ingredientIds.length > 0 && !o.ingredientIds.includes(id));
    if (foreign.length > 0) misattrib.push(`${r.id}:${o.name}:${foreign.join(",")}`);
  }
}
check("Không nhóm rõ ràng nào chứa liều của thuốc khác trong cùng một hàng", misattrib.length === 0, misattrib.slice(0, 10));
const cef = S.structureForOption("module-risk-cef-other", CAP.CAP_SCENARIOS.flatMap((x) => x.regimens).find((x) => x.id === "risk-cef-other").drugs);
const doxyRows = cef.groups.flatMap((g) => g.options).filter((o) => /doxycyclin/i.test(o.name) && o.dose === "500 mg");
check("CAP 'Azithromycin HOẶC doxycyclin': không gán liều 500 mg của azithromycin cho doxycyclin; dòng mơ hồ → NEEDS_STRUCTURED_REVIEW", doxyRows.length === 0 && cef.status === "NEEDS_STRUCTURED_REVIEW", cef.status);

/* ---------- 3. Cau truc AND/OR ---------- */
const lp = st("r-lungabs-pen");
check("Áp xe phổi: beta-lactam + aminoglycosid = 2 nhóm phối hợp (AND); nhóm 2 'chọn 1' gentamycin/amikacin", lp.groups.length === 2 && lp.groups[1].rule === "one-of" && lp.groups[1].options.map((o) => o.name.toLowerCase()).join(",") === "gentamycin,amikacin");
const vap = st("r-vap-mdr");
check("VAP đa kháng: nhóm A (chọn 1 trong 5) + nhóm B (chọn 1 trong 5) – không biến thành 10 thuốc bắt buộc", vap.groups.length === 2 && vap.groups.every((g) => g.rule === "one-of" && g.options.length === 5) && vap.status !== "NEEDS_STRUCTURED_REVIEW", vap.groups.map((g) => [g.rule, g.options.length]));
const copd = st("r-copd23-out-low");
check("COPD ngoại trú: macrolid 'hoặc' cephalosporin → MỘT nhóm chọn 1 (6 lựa chọn)", copd.groups.length === 1 && copd.groups[0].rule === "one-of" && copd.groups[0].options.length === 6);
const mrsa = st("r-sa-mrsa");
check("Viêm khớp MRSA: 'Một trong' vancomycin/daptomycin/teicoplanin → chọn 1 trong 3", mrsa.groups[0].rule === "one-of" && mrsa.groups[0].options.length === 3);
const tb = st("r-tb-a1");
check("Lao A1: tấn công HRZE = 4 thuốc dùng đồng thời (AND), duy trì RHE = 3 thuốc; liều duy trì theo nguồn 'như trên'",
  tb.groups.length === 2 && tb.groups.every((g) => g.rule === "all") && tb.groups[0].options.length === 4 && tb.groups[1].options.length === 3 &&
  tb.groups[1].options.every((o) => o.dose && o.flags.some((f) => /như trên/.test(f))));
check("Lao: giai đoạn duy trì là NỐI TIẾP (phase), không phải phối hợp đồng thời với giai đoạn tấn công", tb.groups[1].phase === true && !tb.groups[1].optional);
const staph = st("r-lungabs-staph");
check("Nhóm có điều kiện ('Kết hợp amikacin khi nghi tụ cầu kháng thuốc') → tùy chọn, ghi rõ điều kiện", staph.groups[1].optional && /tụ cầu kháng thuốc/.test(staph.groups[1].condition ?? ""));
const sepsis = st("r-sepsis-a");
check("Sepsis nhóm 1 + phối hợp: 2 nhóm chọn 1 (không phải tất cả thuốc bắt buộc)", sepsis.groups.length === 2 && sepsis.groups.every((g) => g.rule === "one-of"));

/* ---------- 4. NEEDS_STRUCTURED_REVIEW cho truong hop khong chac ---------- */
check("'Beta-lactam-clavulanat + metronidazol' một liều chung → NEEDS_STRUCTURED_REVIEW", st("r-lungabs-anaer").status === "NEEDS_STRUCTURED_REVIEW");
check("Rifampicin đứng riêng trong danh sách 'chọn 1' (không đơn trị) → NEEDS_STRUCTURED_REVIEW", st("r-os-mrsa").status === "NEEDS_STRUCTURED_REVIEW");
check("Lựa chọn thuốc lồng trong ngoặc ở tên ('Penicilin G (hoặc amoxicilin-clavulanat …)') → NEEDS_STRUCTURED_REVIEW", st("r-lungabs-pen").groups[0].ambiguous === true);
check("Phác đồ không có liều số → NO_DOSE (không vẽ bảng liều)", st("r-ker-gramneg").status === "NO_DOSE");

/* ---------- 5. Doi tuong ---------- */
const clox = st("r-abscess-4416-clox");
const g0 = clox.groups[0];
check("Cloxacilin: liều tách theo đối tượng (by-population) người lớn / trẻ em", g0.rule === "by-population" && g0.options.some((o) => o.population === "adult") && g0.options.some((o) => o.population === "child"));
check("Đang xem người lớn → không hiện hàng liều trẻ em", S.optionsFor(g0, "adult").every((o) => o.population === "adult" || o.population === "any"));
check("Đang xem trẻ em → không hiện hàng liều người lớn", S.optionsFor(g0, "child").every((o) => o.population !== "adult"));

/* ---------- 6. Truong lieu ---------- */
const ceft = st("r-sa-pseudo").groups[0].options[0];
check("Khoảng cách lấy theo vị trí xuất hiện đầu tiên (ceftazidim '2 g/lần x 2–3 lần/ngày', không lấy 'mỗi 8 giờ' ở phần sau)", /2–3 lần\/ngày/.test(ceft.interval ?? ""), ceft.interval);
const vmd = vap.groups[0].options.find((o) => /imipenem/i.test(o.name));
check("Imipenem VAP: tách liều, đường, khoảng cách, thời gian truyền, liều tối đa", vmd.dose === "0,5–1" && vmd.doseUnit === "g" && vmd.interval === "mỗi 6 giờ" && /3–4 giờ/.test(vmd.infusionDuration ?? "") && /4 g\/ngày/.test(vmd.maxDose ?? ""));
const oxa = st("r-sa-empiric-1").groups[0];
check("Oxacilin hoặc nafcilin cùng liều → chọn 1, có tổng liều/ngày (8 g/ngày)", oxa.rule === "one-of" && oxa.options.every((o) => o.dose === "2" && o.dailyDose === "8 g/ngày"));
const py = st("r-py-iv-bl");
check("Kiểm tra tương thích chế phẩm: amoxicilin-clavulanat 875/125 mg + đường tĩnh mạch → cờ KIỂM TRA CHẾ PHẨM", py.groups.flatMap((g) => g.options).some((o) => o.flags.some((f) => f.startsWith("KIỂM TRA CHẾ PHẨM"))));

/* ---------- 7. Safety Gate khong doi ---------- */
const locked = [...shown.keys()].filter((id) => A.autoRecommendBlocks(id).length > 0);
check("12 phương án vẫn khóa đề xuất tự động (lớp cấu trúc không gỡ khóa)", locked.length === 12);

/* ---------- 8. Module CAP/HAP-VAP va quoc te ---------- */
const mods = [...CAP.CAP_SCENARIOS.flatMap((x) => x.regimens), ...HV.HAPVAP_SCENARIOS.hap.flatMap((x) => x.regimens), ...HV.HAPVAP_SCENARIOS.vap.flatMap((x) => x.regimens)];
const modStructs = mods.map((m) => S.structureForOption(`module-${m.id}`, m.drugs));
check(`Module CAP/HAP/VAP: ${mods.length} phác đồ đều có cấu trúc (mỗi thuốc của module là một nhóm phối hợp)`, modStructs.every((x, i) => x.groups.length === mods[i].drugs.length));
const cap1 = S.structureForOption("module-ward-ertapenem", CAP.CAP_SCENARIOS.flatMap((x) => x.regimens).find((x) => x.id === "ward-ertapenem").drugs);
check("CAP 'Ertapenem + macrolid hoặc quinolon': ertapenem + (chọn 1: azithromycin/levofloxacin/moxifloxacin)", cap1.groups.length === 2 && cap1.groups[1].rule === "one-of" && cap1.groups[1].options.length === 3);
const intlBad = [];
for (const e of I.INTL_ENTRIES) for (const reg of e.regimens) for (const line of reg.options) {
  const s = S.structureOptionLines([line]);
  for (const o of s.groups.flatMap((g) => g.options)) if (o.dose && !norm(line).includes(norm(o.dose))) intlBad.push(`${e.diseaseId}:${o.name}`);
}
check("Khuyến cáo quốc tế: liều tách được đều là chuỗi con của dòng nguồn", intlBad.length === 0, intlBad.slice(0, 5));

const sum = S.structureSummary([...shown.values()]);
console.log(`\nPhân loại cấu trúc ${shown.size} phương án: ${JSON.stringify(sum)}`);
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
