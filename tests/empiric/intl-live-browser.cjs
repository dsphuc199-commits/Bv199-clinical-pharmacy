// Kiểm tra trang thật (dev hoặc production) của các bệnh hiển thị bằng JSON hướng dẫn quốc tế (IntlGuidelineView).
// Dùng: node tests/empiric/intl-live-browser.cjs <disease_id> [disease_id ...]
//   STANDARDIZE_BASE_URL (mặc định http://localhost:3000; production: https://bv199-clinical-pharmacy.vercel.app)
//   BV199_COOKIE_FILE=<cookie Netscape có bv199_session cho đúng domain> hoặc BV199_SESSION=<giá trị>
//   PLAYWRIGHT_MODULE, CHROME_PATH như các test *-browser.cjs khác.
// Với mỗi bệnh: mở tab Quốc tế; xác nhận tiêu đề, nhãn nháp/thẩm định, số khối khuyến cáo (h4), đổi lựa chọn trục
// đầu tiên có ≥ 2 giá trị → nội dung thay đổi; không lỗi console. In kết quả từng mục.
const fs = require("fs"), path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"));
const base = process.env.STANDARDIZE_BASE_URL || "http://localhost:3000";
const ids = process.argv.slice(2);
let pass = 0, fail = 0;
const check = (name, ok, detail) => { if (ok) pass++; else fail++; console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` – ${detail}` : ""}`); };
function cookie() {
  if (process.env.BV199_SESSION) return process.env.BV199_SESSION;
  const f = process.env.BV199_COOKIE_FILE;
  if (!f) return null;
  const line = fs.readFileSync(f, "utf8").split(/\r?\n/).find((l) => l.includes("bv199_session"));
  return line ? line.split("\t").pop() : null;
}
(async () => {
  if (!ids.length) { console.log("Cần ít nhất 1 disease_id."); console.log("0 passed, 1 failed"); process.exit(1); }
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 1600 } });
    const c = cookie();
    if (c) await ctx.addCookies([{ name: "bv199_session", value: c, domain: new URL(base).hostname, path: "/" }]);
    const page = await ctx.newPage();
    for (const id of ids) {
      const errors = [];
      const onErr = (e) => errors.push(e.message || e.text());
      page.on("pageerror", onErr);
      const onCon = (m) => { if (m.type() === "error") errors.push(m.text() + (m.location()?.url ? ` [${m.location().url}]` : "")); };
      page.on("console", onCon);
      const onRes = (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); };
      page.on("response", onRes);
      const url = `${base}/antibiotics/empiric/guideline-v9?disease=${id}`;
      try {
        const res = await page.goto(url, { waitUntil: "networkidle" });
        check(`${id}: mở ${url}`, res && res.ok() && !page.url().includes("/login"), `HTTP ${res && res.status()} → ${page.url()}`);
        await page.getByRole("tab", { name: /Quốc tế/ }).first().click();
        const v = page.locator("article.igv").first();
        await v.waitFor({ timeout: 15000 });
        check(`${id}: có tiêu đề`, (await v.locator("h3").innerText()).trim().length > 0, await v.locator("h3").innerText());
        check(`${id}: không lỗi dữ liệu`, (await v.getAttribute("data-intl-error")) === null);
        const state = await v.getAttribute("data-review");
        const pending = await v.locator("[data-intl-pending]").count();
        if (state === "draft_ai") check(`${id}: nhãn bản nháp hoặc 'Đang chờ thẩm định'`, (await v.getByText("Bản nháp AI – chưa kiểm duyệt").count()) > 0 || pending > 0, state);
        else check(`${id}: nhãn thẩm định`, (await v.locator(".igv-verified").count()) > 0, state);
        if (!pending) {
          const out = v.locator(".sa24-out");
          const h4 = await out.locator("h4").count();
          check(`${id}: số khối khuyến cáo (h4)`, h4 > 0 || (await out.locator(".sa24-warn").count()) > 0, String(h4));
          const before = await out.innerText();
          const segs = v.locator(".sa24-form .sa24-seg");
          let changed = null;
          for (let i = 0; i < (await segs.count()) && changed === null; i++) {
            const btns = segs.nth(i).locator("button");
            const n = await btns.count();
            for (let k = 0; k < n; k++) {
              if ((await btns.nth(k).getAttribute("aria-pressed")) === "true") continue;
              await btns.nth(k).click(); await page.waitForTimeout(200);
              changed = (await out.innerText()) !== before;
              break;
            }
          }
          if (changed === null && (await v.locator(".sa24-form select").count())) {
            const sel = v.locator(".sa24-form select").first();
            const vals = await sel.locator("option").evaluateAll((o) => o.map((x) => x.value));
            const cur = await sel.inputValue();
            const other = vals.find((x) => x !== cur);
            if (other) { await sel.selectOption(other); await page.waitForTimeout(200); changed = (await out.innerText()) !== before; }
          }
          check(`${id}: đổi lựa chọn trục cho kết quả khác`, changed !== false, changed === null ? "không có trục để đổi" : String(changed));
        }
      } catch (e) {
        check(`${id}: chạy kiểm tra`, false, e.message.split("\n")[0]);
      }
      check(`${id}: không lỗi console`, errors.length === 0, errors.slice(0, 2).join(" | "));
      page.off("pageerror", onErr); page.off("console", onCon); page.off("response", onRes);
    }
  } finally {
    await browser.close();
  }
  console.log(`${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
