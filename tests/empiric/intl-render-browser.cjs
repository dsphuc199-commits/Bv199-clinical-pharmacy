// So sánh render JSON mẫu chuẩn (IntlGuidelineView, /antibiotics/empiric/intl-preview) với công cụ viết tay
// (tab Quốc tế, guideline-v9) cho cùng chuỗi thao tác. So innerText của .sa24-out (đã chuẩn hóa khoảng trắng).
// Chạy (cần dev server):  node tests/empiric/intl-render-browser.cjs
//   PLAYWRIGHT_MODULE=<đường dẫn playwright hoặc playwright-core>  CHROME_PATH=<chrome.exe>
//   BV199_COOKIE_FILE=<cookie Netscape có bv199_session> hoặc BV199_SESSION=<giá trị>  STANDARDIZE_BASE_URL (mặc định http://localhost:3000)
const fs = require("fs"), path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"));
const base = process.env.STANDARDIZE_BASE_URL || "http://localhost:3000";
let pass = 0, fail = 0;
const check = (name, ok, detail) => { if (ok) pass++; else fail++; console.log(`${ok ? "PASS" : "FAIL"} ${name}${!ok && detail ? "\n     " + detail : ""}`); };

const btn = (name) => (s) => s.getByRole("button", { name, exact: true }).click();
const chk = (label) => (s) => s.getByLabel(label, { exact: false }).click();
const sel = (value) => (s) => s.locator("select").first().selectOption(value);

/* Khác biệt đã biết (docs/intl-format-spec.md mục 3): dòng "Phân tầng" nguy cơ tăng (UI nội suy số yếu tố),
   dòng "Viêm nội tâm mạc" (UI liệt kê yếu tố), thứ tự dòng addon trong block "Nguy cơ tăng". */
const KNOWN = [/^Nguy cơ tăng – /, /^Viêm nội tâm mạc\t?/, /^Có đặc điểm tăng nguy cơ viêm nội tâm mạc/];
const SCEN = {
  "v8-14": { ref: "nkh-gram-am", cases: [
    ["mặc định", []],
    ["sốc nhiễm khuẩn", [btn("Sốc nhiễm khuẩn")]],
    ["không sepsis – TM", [btn("Không sepsis")]],
    ["không sepsis – uống", [btn("Không sepsis"), chk("Điều trị đường uống")]],
    ["sepsis + ESBL + FQ 12 tháng", [chk("Cấy nước tiểu gần đây có vi khuẩn sinh ESBL"), chk("Đã dùng fluoroquinolon trong 12 tháng qua")]],
    ["không sepsis TM + loại cả 3 nhóm", [btn("Không sepsis"), chk("Cấy nước tiểu gần đây có vi khuẩn sinh ESBL"), chk("Cấy nước tiểu gần đây kháng fluoroquinolon"), chk("Cấy nước tiểu gần đây kháng piperacilin-tazobactam")]],
    ["đích ESBL tiết niệu", [btn("Đích – đã biết kiểu hình kháng")]],
    ["đích ESBL ngoài tiết niệu + albumin thấp", [btn("Đích – đã biết kiểu hình kháng"), chk("Nguồn nhiễm khuẩn là đường tiết niệu"), chk("Albumin máu < 2,5 g/dL")]],
    ["đích KPC", [btn("Đích – đã biết kiểu hình kháng"), sel("kpc")]],
    ["đích P. aeruginosa DTR ngoài tiết niệu", [btn("Đích – đã biết kiểu hình kháng"), sel("pa-dtr"), chk("Nguồn nhiễm khuẩn là đường tiết niệu")]],
    ["đích CRAB", [btn("Đích – đã biết kiểu hình kháng"), sel("crab")]],
  ] },
  "v8-13": { ref: "nkh-s-aureus", cases: [
    ["người lớn nguy cơ thấp", []],
    ["nguy cơ thấp, không ổ sâu, lọc máu chu kỳ", [btn("Không có ổ nhiễm sâu"), btn("Lọc máu chu kỳ")]],
    ["trẻ em", [btn("Trẻ em (≥ 28 ngày)"), btn("Trẻ ≥ 3 tháng")]],
    ["sơ sinh", [btn("Sơ sinh (< 28 ngày)"), btn("Sơ sinh – < 3 tháng")]],
    ["nguy cơ tăng: dụng cụ trong tim + chưa rõ ổ (khác biệt đã biết)", [chk("Có dụng cụ trong tim"), chk("Chưa xác định được ổ nhiễm khuẩn")], "known"],
    ["nguy cơ tăng: van tim + có ổ sâu, CRRT (khác biệt đã biết)", [chk("Bệnh lý van tim dễ mắc"), btn("Có ổ nhiễm sâu, di bệnh"), btn("Lọc máu liên tục (CRRT)")], "known"],
  ] },
};

function cookie() {
  if (process.env.BV199_SESSION) return process.env.BV199_SESSION;
  const f = process.env.BV199_COOKIE_FILE;
  if (!f) return null;
  const line = fs.readFileSync(f, "utf8").split(/\r?\n/).find((l) => l.includes("bv199_session"));
  return line ? line.split("\t").pop() : null;
}
const norm = (t) => t.replace(/\r/g, "").split("\n").map((l) => l.replace(/[ \u00a0]+/g, " ").trim()).filter(Boolean);

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 1600 } });
    const c = cookie();
    if (c) await ctx.addCookies([{ name: "bv199_session", value: c, domain: new URL(base).hostname, path: "/" }]);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    const run = async (url, scope, acts, intlTab) => {
      await page.goto(url, { waitUntil: "networkidle" });
      if (intlTab) { await page.getByRole("tab", { name: /Quốc tế/ }).first().click(); }
      const s = page.locator(scope).first();
      await s.waitFor();
      for (const a of acts) await a(s);
      await page.waitForTimeout(150);
      return norm(await s.locator(".sa24-out").innerText());
    };
    for (const [disease, { ref, cases }] of Object.entries(SCEN)) {
      for (const [name, acts, mode] of cases) {
        const hand = await run(`${base}/antibiotics/empiric/guideline-v9?disease=${disease}`, ".sa24", acts, true);
        const json = await run(`${base}/antibiotics/empiric/intl-preview?ref=${ref}`, ".igv", acts, false);
        if (mode === "known") {
          const f = (xs) => xs.filter((l) => !KNOWN.some((k) => k.test(l))).sort();
          const a = f(hand), b = f(json);
          const diff = a.filter((l, i) => l !== b[i]);
          check(`${disease} ${name}: cùng nội dung sau khi bỏ khác biệt đã biết (không xét thứ tự)`, a.length === b.length && !diff.length, `viết tay ${a.length} dòng / JSON ${b.length} dòng; khác: ${diff.slice(0, 3).join(" | ")}`);
        } else {
          const i = hand.findIndex((l, k) => l !== json[k]);
          check(`${disease} ${name}: innerText giống hệt (${hand.length} dòng)`, i === -1 && hand.length === json.length, i === -1 ? `số dòng ${hand.length}/${json.length}` : `dòng ${i}: viết tay «${hand[i]}» ≠ JSON «${json[i]}»`);
        }
      }
    }
    check("Không có lỗi console/pageerror", errors.length === 0, errors.slice(0, 3).join(" | "));
  } finally {
    await browser.close();
  }
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); console.log(`${pass} passed, ${fail + 1} failed`); process.exit(1); });
