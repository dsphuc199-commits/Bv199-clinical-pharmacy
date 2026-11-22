import assert from "node:assert/strict";
import { test } from "node:test";
import { GET as scheduledWatch } from "../../app/api/internal/guideline-watch/route";
import { reviewPublicGuideline, validateFindings } from "../../lib/admin/guideline-watch-ai";
import { fetchOfficial, parseWatchHtml, WATCH_SOURCES } from "../../lib/admin/guideline-watch-sources";
import { isCurrentDocument, mergeChecks, type WatchState } from "../../lib/admin/guideline-watch";
import { BILIARY_BASE_CONTENT } from "../../lib/antibiotics/biliary-protocol";

const cap = WATCH_SOURCES[2];
const capHtml = "<h1>Viêm phổi mắc phải cộng đồng ở người lớn</h1><p>Quyết định 2147/QĐ-BYT thay thế QĐ 4815/QĐ-BYT năm 2020.</p>";
const empty: WatchState = { checks: [], documents: [] };

test("recognizes the adult CAP replacement without sending it for AI review", () => {
  const [document] = parseWatchHtml(cap, capHtml);
  assert.equal(document.topic, "cap");
  assert.equal(document.fullText, "manual");
  assert.match(document.replacement ?? "", /4815/);
  assert.equal(parseWatchHtml(cap, `${capHtml}<p>Cập nhật giao diện</p>`)[0].id, document.id);
  assert.throws(() => parseWatchHtml(cap, capHtml.replace("thay thế", "tham khảo")));
});

test("keeps earlier findings after a source error and rejects stale scans", () => {
  const start = "2026-01-01T00:00:00.000Z";
  const next = "2026-01-02T00:00:00.000Z";
  const documents = parseWatchHtml(cap, capHtml);
  const id = documents[0].id;
  const first = mergeChecks(empty, [{ sourceId: cap.id, documents }], start);
  const failed = mergeChecks(first, [{ sourceId: cap.id, error: "Source unavailable" }], next);
  assert.equal(isCurrentDocument(first, id), true);
  assert.equal(isCurrentDocument(failed, id), false);
  assert.equal(failed.checks[0].lastSuccess, start);
  assert.deepEqual(failed.documents, first.documents);
  assert.deepEqual(mergeChecks(failed, [{ sourceId: cap.id, documents }], start), failed);
});

test("refuses a redirect outside the official source list", async () => {
  let requests = 0;
  const redirect: typeof fetch = async () => {
    requests++;
    return new Response(null, { status: 302, headers: { location: "http://127.0.0.1/" } });
  };
  await assert.rejects(fetchOfficial(cap.url, redirect), /ngoài danh sách/);
  assert.equal(requests, 1);
});

const quote = "Synthetic test passage includes the reference number 17.";
const evidence = [{ id: "p1", locator: "Trang PDF 1", text: quote }];
const finding = { kind: "mild_duration", population: "Dữ liệu kiểm thử", grade: "", passageId: "p1", value: "Mã kiểm thử 17", quote };

test("compares against the local baseline and rejects unverifiable numbers, quotes and grades", () => {
  const [validated] = validateFindings({ findings: [finding] }, evidence, BILIARY_BASE_CONTENT);
  assert.equal(validated.before, BILIARY_BASE_CONTENT.mildDuration);
  assert.equal(validated.locator, evidence[0].locator);
  for (const changes of [{ value: "Mã kiểm thử 18" }, { quote: `${quote} Invented.` }, { grade: "High" }]) {
    assert.throws(() => validateFindings({ findings: [{ ...finding, ...changes }] }, evidence, BILIARY_BASE_CONTENT), /chưa đối chiếu được/);
  }
});

test("sends the gateway public passages and title only", async (t) => {
  const [document] = parseWatchHtml(cap, capHtml);
  const passages = [...evidence, { id: "p2", locator: "Trang PDF 2", text: "Another synthetic excerpt for the test only." }];
  const mock = t.mock.method(globalThis, "fetch", async (_input: unknown, options?: RequestInit) => {
    const payload = JSON.parse(String(options?.body));
    assert.deepEqual(JSON.parse(payload.messages[1].content), { publicTitle: document.title, publishedPassages: passages });
    assert.equal(JSON.stringify(payload).includes(BILIARY_BASE_CONTENT.mildDuration), false);
    return Response.json({ choices: [{ message: { content: '{"findings":[]}' } }] });
  });
  assert.deepEqual((await reviewPublicGuideline(document, passages, "test-token")).value, { findings: [] });
  assert.equal(mock.mock.callCount(), 1);
});

test("the scheduled route rejects unauthenticated requests", async () => {
  const response = await scheduledWatch(new Request("https://example.test/api/internal/guideline-watch"));
  assert.equal(response.status, 401);
});
