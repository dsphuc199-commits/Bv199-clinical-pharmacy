// Test đơn vị lib/intl-rules.ts (matches, effectiveState, combos, resolve) và chuỗi công cụ JSON hướng dẫn quốc tế.
const path = require("path"), fs = require("fs"), { spawnSync } = require("child_process");
const load = require("./tsrun.cjs");
const L = load("lib/intl-rules.ts");
const ROOT = path.resolve(__dirname, "..", "..");
const ref = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, "data/guidelines/intl/_reference", f), "utf8"));
let pass = 0, fail = 0;
const check = (name, ok) => { if (ok) pass++; else fail++; console.log(`${ok ? "PASS" : "FAIL"} ${name}`); };

/* matches */
check("when rỗng/undefined luôn đúng", L.matches({ a: "x" }, undefined) && L.matches({ a: "x" }, {}));
check("so khớp chuỗi", L.matches({ a: "x" }, { a: "x" }) && !L.matches({ a: "y" }, { a: "x" }));
check("so khớp boolean, không nhầm chuỗi 'true'", L.matches({ b: true }, { b: true }) && !L.matches({ b: "true" }, { b: true }) && !L.matches({ b: false }, { b: true }));
check("mảng = thuộc tập", L.matches({ a: "y" }, { a: ["x", "y"] }) && !L.matches({ a: "z" }, { a: ["x", "y"] }));
check("multi includes_any / includes_none / is_empty", L.matches({ m: ["p", "q"] }, { m: { includes_any: ["q", "r"] } }) && !L.matches({ m: ["p"] }, { m: { includes_any: ["q"] } }) && L.matches({ m: ["p"] }, { m: { includes_none: ["q"] } }) && !L.matches({ m: ["q"] }, { m: { includes_none: ["q"] } }) && L.matches({ m: [] }, { m: { is_empty: true } }) && !L.matches({ m: ["p"] }, { m: { is_empty: true } }));
check("multi: các điều kiện con kết hợp AND", L.matches({ m: ["p"] }, { m: { is_empty: false, includes_none: ["u"] } }) && !L.matches({ m: ["u"] }, { m: { is_empty: false, includes_none: ["u"] } }));
check("trục không có trong state → không khớp", !L.matches({}, { a: "x" }));
check("AND giữa các trục", L.matches({ a: "x", b: true }, { a: "x", b: true }) && !L.matches({ a: "x", b: false }, { a: "x", b: true }));

/* effectiveState */
const axes = [
  { id: "s", type: "seg", default: "e", options: [{ id: "e" }, { id: "d" }], placement: "form" },
  { id: "o", type: "check", default: false, visible_when: { s: "d" }, placement: "form" },
];
check("trục ẩn nhận default dù raw có giá trị", L.effectiveState(axes, { s: "e", o: true }).o === false && L.effectiveState(axes, { s: "d", o: true }).o === true);
check("combos tôn trọng visible_when (3 tổ hợp)", [...L.combos(axes)].length === 3);

/* JSON mẫu chuẩn */
const gnb = ref("nkh-gram-am.json"), gnbFull = ref("full/nkh-gram-am.full.json"), sab = ref("nkh-s-aureus.json");
check("Gram âm: 82 tổ hợp hợp lệ", [...L.combos(gnb.axes)].length === 82);
let same = true, single = true;
for (const c of L.combos(gnb.axes)) {
  if (JSON.stringify(L.rendered(gnb, c)) !== JSON.stringify(L.rendered(gnbFull, c))) same = false;
  if (!L.resolve(gnb, c).primary) single = false;
}
check("Gram âm: dạng gọn (show_when) mở rộng giống hệt bản đầy đủ ở mọi tổ hợp", same);
check("Gram âm: mọi tổ hợp có đúng 1 luật primary", single);
const exclAll = L.resolve(gnb, { stage: "emp", sev: "none", oral: false, priorEsbl: true, priorFqR: true, fq12m: false, priorPtzR: true });
check("Gram âm: loại cả 3 nhóm → không còn ceftriaxon/piperacilin/fluoroquinolon trong nhóm ưu tiên", !exclAll.blocks[0].items.some((i) => /Ceftriaxon|Piperacilin|Ciprofloxacin/.test(i.text)) && exclAll.avoid.length === 4);
const sabDev = L.resolve(sab, { age: "adult", risks: ["device"], final: "pending", vpop: "std" });
check("S. aureus: addon nối vào block cùng tiêu đề (Yếu tố chính, Viêm nội tâm mạc)", sabDev.blocks.filter((b) => b.title === "Nguy cơ tăng – thăm dò cá thể hóa").length === 1 && ["Yếu tố chính", "Viêm nội tâm mạc"].every((r) => sabDev.blocks.find((b) => b.title === "Nguy cơ tăng – thăm dò cá thể hóa").items.some((i) => i.role === r)));
const sabNeo = L.resolve(sab, { age: "neo", risks: ["device"], final: "focus", vpop: "neo" });
check("S. aureus: trục ẩn (risks, final) không ảnh hưởng nhánh sơ sinh", sabNeo.primary && sabNeo.primary.id === "neonate" && sabNeo.before.some((s) => s.id === "neo-note"));
check("S. aureus: section theo trục output (vancomycin lọc máu)", L.resolve(sab, { age: "adult", risks: [], final: "pending", vpop: "ihd" }).after.some((s) => s.id === "vanco-ihd"));

/* IntlGuidelineView (render tĩnh) */
const React = require("react"), { renderToStaticMarkup } = require("react-dom/server");
const View = load("components/antibiotics/empiric/IntlGuidelineView.tsx").default;
const html = renderToStaticMarkup(React.createElement(View, { data: sab }));
check("View: bản nháp hiện nhãn nổi bật và dòng cần xác nhận", html.includes("Bản nháp AI – chưa kiểm duyệt") && html.includes("Cần dược sĩ/bác sĩ xác nhận trước khi áp dụng") && html.includes("Đánh giá ban đầu – mọi người bệnh"));
check("View: hiện danh sách nguồn (tổ chức, năm, URL, ngày truy cập)", html.includes("Truy cập 2026-11-14") && html.includes("https://doi.org/10.1093/ajhp/zxaa036"));
const bad = renderToStaticMarkup(React.createElement(View, { data: { ...sab, rules: "x" } }));
check("View: dữ liệu lỗi → chỉ báo lỗi, không render một phần", bad.includes("data-intl-error") && !bad.includes("Đánh giá ban đầu – mọi người bệnh") && !bad.includes("class=\"sa24-out\""));
const verified = renderToStaticMarkup(React.createElement(View, { data: { ...sab, review: { state: "pharmacist_verified", verified_by: "DS A", verified_date: "2026-11-01", next_review: null } } }));
check("View: bản đã thẩm định hiện nhãn, người, ngày", verified.includes("Dược sĩ đã thẩm định") && verified.includes("DS A · 2026-11-01") && !verified.includes("Bản nháp AI"));
const off = spawnSync(process.execPath, ["-e", `const load=require(${JSON.stringify(path.join(__dirname, "tsrun.cjs"))});const React=require("react");const {renderToStaticMarkup:r}=require("react-dom/server");const V=load("components/antibiotics/empiric/IntlGuidelineView.tsx").default;const d=require(${JSON.stringify(path.join(ROOT, "data/guidelines/intl/_reference/nkh-s-aureus.json"))});process.stdout.write(r(React.createElement(V,{data:d})));`], { cwd: ROOT, encoding: "utf8", env: { ...process.env, NEXT_PUBLIC_SHOW_DRAFT_GUIDELINES: "0" } });
check("View: NEXT_PUBLIC_SHOW_DRAFT_GUIDELINES=0 → ẩn nội dung nháp, chỉ hiện 'Đang chờ thẩm định'", off.status === 0 && off.stdout.includes("Đang chờ thẩm định") && !off.stdout.includes("Đánh giá ban đầu – mọi người bệnh"));

/* chuỗi công cụ (tsx) */
const tsx = (args) => spawnSync(process.execPath, [path.join(ROOT, "node_modules/tsx/dist/cli.mjs"), ...args], { cwd: ROOT, encoding: "utf8" });
const v = tsx(["scripts/validate-guidelines.ts", "--include-reference", "data/guidelines/intl/_reference"]);
check("validate:guidelines --include-reference trên _reference: thoát 0", v.status === 0 && /4\/4 tệp đạt/.test(v.stdout));
const idx = tsx(["scripts/build-intl-index.ts", "--check"]);
check("data/guidelines/intl/index.ts đồng bộ với các JSON", idx.status === 0);

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
