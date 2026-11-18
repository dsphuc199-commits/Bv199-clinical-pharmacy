/* Kiểm thử luồng chọn module nhiễm khuẩn tiết niệu. Chạy: npm run test:uti */
import assert from "node:assert/strict";
import test from "node:test";
import { CONDITIONS, REGIMENS, UTI_BRIEFS, publicRegimens } from "../../data/uti-antibiotics";
import { formsOf, populationsOf, resolveCondition, searchConditions, sitesOf } from "../../lib/uti/flow";

function allPaths() {
  const out: { site: string; form: string; population: string }[] = [];
  for (const site of sitesOf(CONDITIONS)) for (const form of formsOf(CONDITIONS, site)) for (const population of populationsOf(CONDITIONS, site, form)) out.push({ site, form, population });
  return out;
}

test("mọi tổ hợp hợp lệ đều ra đúng một thể bệnh có nội dung", () => {
  const seen = new Set<string>();
  for (const p of allPaths()) {
    const c = resolveCondition(CONDITIONS, p.site, p.form, p.population);
    assert.ok(c, `Ngõ cụt: ${JSON.stringify(p)}`);
    assert.ok(REGIMENS.some((r) => r.conditionId === c.id) || c.notes.length > 0, `Không có nội dung: ${c.id}`);
    seen.add(c.id);
  }
  assert.equal(seen.size, CONDITIONS.length, "Có thể bệnh không chọn được qua luồng");
});

test("mỗi bước luôn có lựa chọn", () => {
  assert.ok(sitesOf(CONDITIONS).length > 0);
  for (const site of sitesOf(CONDITIONS)) {
    assert.ok(formsOf(CONDITIONS, site).length > 0, site);
    for (const form of formsOf(CONDITIONS, site)) assert.ok(populationsOf(CONDITIONS, site, form).length > 0, form);
  }
});

test("bỏ qua bước đối tượng khi chỉ có một lựa chọn; chờ chọn khi có nhiều lựa chọn", () => {
  assert.equal(resolveCondition(CONDITIONS, "Viêm thận bể thận cấp", "Kháng sinh đường tiêm", null)?.id, "pyelo-iv");
  assert.equal(resolveCondition(CONDITIONS, "Viêm bàng quang cấp", "Viêm bàng quang cấp", null), null);
  assert.equal(resolveCondition(CONDITIONS, "Viêm bàng quang cấp", "Viêm bàng quang cấp", "Nam giới")?.id, "cystitis-male");
});

test("tổ hợp không hợp lệ không ra kết quả", () => {
  assert.equal(resolveCondition(CONDITIONS, "Viêm bàng quang cấp", "Chlamydia", null), null);
});

test("tìm theo kháng sinh và thể bệnh, không phân biệt dấu", () => {
  const ids = searchConditions(CONDITIONS, REGIMENS, "nitrofurantoin").map((c) => c.id);
  assert.deepEqual(ids.sort(), ["cystitis-common", "cystitis-pregnancy", "stone-uti-oral"]);
  assert.ok(searchConditions(CONDITIONS, REGIMENS, "viem than be than").length > 0);
  assert.deepEqual(searchConditions(CONDITIONS, REGIMENS, "   "), []);
});

test("mỗi vị trí nhiễm khuẩn đều có tổng quan", () => {
  for (const site of sitesOf(CONDITIONS)) assert.ok(UTI_BRIEFS[site]?.length, site);
});

test("dữ liệu gửi xuống trình duyệt không chứa sourceText", () => {
  for (const r of publicRegimens()) assert.equal("sourceText" in r, false);
});
