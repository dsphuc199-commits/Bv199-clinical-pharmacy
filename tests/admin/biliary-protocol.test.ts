import assert from "node:assert/strict";
import { test } from "node:test";
import { GASTRO } from "../../data/antibiotics/empiric/regimens/gastro";
import { updateBiliaryHistory } from "../../lib/admin/biliary-protocol-changes";
import { biliaryPublication, EMPTY_BILIARY_HISTORY } from "../../lib/admin/biliary-protocol-store";
import {
  BILIARY_BASE_CONTENT, BILIARY_BASE_REVISION, BILIARY_EDIT_GROUPS,
  biliaryChanges, biliaryDurationText, biliaryPublishedGroups,
} from "../../lib/antibiotics/biliary-protocol";
import { structureOf } from "../../lib/antibiotics/regimen-structure";

function form(values: Record<string, string>) {
  const result = new FormData();
  for (const [key, value] of Object.entries(values)) result.set(key, value);
  return result;
}

const first = BILIARY_EDIT_GROUPS[0].rows[0];
const sampleDose = "Cách dùng cập nhật trong bài kiểm thử";
const input = {
  intent: "save", basedOn: BILIARY_BASE_REVISION, revision: "", reason: "Kiểm thử phiên bản",
  sourceTitle: BILIARY_BASE_CONTENT.source.title, sourceLocator: BILIARY_BASE_CONTENT.source.locator,
  sourceUrl: BILIARY_BASE_CONTENT.source.url, mildDuration: BILIARY_BASE_CONTENT.mildDuration,
  moderateSevereDuration: BILIARY_BASE_CONTENT.moderateSevereDuration,
  ...Object.fromEntries(BILIARY_EDIT_GROUPS.flatMap(({ rows }) => rows.map((row) => [`dose:${row.id}`, row.baseline]))),
};

test("the pilot preserves all options in the current biliary guideline", () => {
  const rows = BILIARY_EDIT_GROUPS.flatMap((group) => group.rows);
  assert.equal(BILIARY_EDIT_GROUPS.length, 8);
  assert.equal(rows.length, 17);
  assert.equal(new Set(rows.map(({ id }) => id)).size, rows.length);
  assert.ok(rows.every(({ baseline }) => baseline.length > 0));
});

test("approval exposes the edited dose and duration without leaking the draft or audit metadata", () => {
  const draft = updateBiliaryHistory(EMPTY_BILIARY_HISTORY, form({
    ...input, [`dose:${first.id}`]: sampleDose, mildDuration: "Thời gian trong dữ liệu kiểm thử",
  }), "editor");
  assert.equal(biliaryPublication(draft.data), null);
  assert.ok(draft.data.draft);
  const changes = biliaryChanges(BILIARY_BASE_CONTENT, draft.data.draft.content);
  assert.equal(changes.length, 2);
  assert.deepEqual(changes[0], { label: first.drug, before: first.baseline, after: sampleDose });

  const release = updateBiliaryHistory(draft.data, form({ intent: "publish", revision: draft.data.draft.revision }), "reviewer");
  assert.equal(release.data.draft, null);
  assert.equal(release.data.releases[0].actor, "reviewer");
  assert.equal(release.data.releases[0].preparedBy, "editor");
  const publication = biliaryPublication(release.data);
  assert.ok(publication);
  assert.deepEqual(Object.keys(publication), ["revision", "timestamp", "content"]);
  assert.match(biliaryDurationText(publication.content)[0], /Thời gian trong dữ liệu kiểm thử/);

  const regimen = GASTRO.find((item) => item.id === BILIARY_EDIT_GROUPS[0].id)!;
  const source = structureOf(regimen).groups;
  const groups = biliaryPublishedGroups(regimen.id, source, publication.content);
  assert.equal(groups[0].rule, source[0].rule);
  assert.equal(groups[0].options[0].name, source[0].options[0].name);
  assert.equal(groups[0].options[0].raw, sampleDose);
  assert.equal(groups[0].raw[0].dose, sampleDose);
  assert.equal(source[0].options[0].raw, first.baseline);
  assert.throws(() => updateBiliaryHistory(release.data, form(input), "editor"), /Bản đang dùng vừa thay đổi/);
});

test("a stale draft, unsafe source, missing dosage or empty revision is rejected", () => {
  assert.throws(() => updateBiliaryHistory(EMPTY_BILIARY_HISTORY, form(input), "editor"), /Chưa có nội dung thay đổi/);
  assert.throws(() => updateBiliaryHistory(EMPTY_BILIARY_HISTORY, form({ ...input, sourceUrl: "javascript:alert(1)" }), "editor"), /HTTPS/);
  const missing = form(input);
  missing.delete(`dose:${first.id}`);
  assert.throws(() => updateBiliaryHistory(EMPTY_BILIARY_HISTORY, missing, "editor"), /Nhập đủ/);
  const draft = updateBiliaryHistory(EMPTY_BILIARY_HISTORY, form({ ...input, sourceLocator: "Vị trí đối chiếu thử" }), "editor");
  assert.ok(draft.data.draft);
  assert.throws(() => updateBiliaryHistory(draft.data, form({ intent: "publish", revision: "10000000-0000-4000-8000-000000000000" }), "reviewer"), /Bản nháp vừa thay đổi/);
});
