import assert from "node:assert/strict";
import { test } from "node:test";
import { load } from "cheerio";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import DoseAdjustModule from "../../components/dosing/DoseAdjustModule";
import { DTQG_SOURCE, doseEntries } from "../../lib/dosing/catalog";

const entries = doseEntries();
const citation = "Bộ Y tế – Hội đồng Dược thư quốc gia Việt Nam. Dược thư quốc gia Việt Nam, lần xuất bản thứ ba (2023).";

test(`hiển thị đúng trích dẫn cho toàn bộ ${entries.length} mục Hiệu chỉnh liều`, () => {
  for (const entry of entries) {
    const markup = renderToStaticMarkup(createElement(DoseAdjustModule, {
      entries,
      params: new URLSearchParams({ drug: entry.key }),
      source: DTQG_SOURCE,
    }));
    const $ = load(markup.match(/<article\b[\s\S]*?<\/article>/)?.[0] ?? "");
    const references = $(".da-doc footer p");

    assert.equal($(".da-doc-h h2").text(), entry.name, entry.key);
    assert.doesNotMatch($(".da-doc").text(), /Trạng thái:|Chưa được dược sĩ lâm sàng BV199 xác nhận/, entry.key);

    if (entry.dtqg) {
      const { name, pages } = entry.dtqg;
      assert.equal(references.length, 1, entry.key);
      assert.equal(references.text(), `Tài liệu tham khảo: ${citation} Chuyên luận ${name}, trang ${pages.printed.join("–")}.`, entry.key);
    } else {
      assert.equal(references.length, 0, entry.key);
    }
  }
});
