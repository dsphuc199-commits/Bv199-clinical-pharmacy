import assert from "node:assert/strict";
import { test } from "node:test";
import { updateEvidenceLibrary } from "../../lib/admin/guideline-library-changes";
import { EMPTY_EVIDENCE_LIBRARY, publishedEvidence } from "../../lib/admin/guideline-library";

function form(values: Record<string, string>) {
  const result = new FormData();
  for (const [name, value] of Object.entries(values)) result.set(name, value);
  return result;
}

const metadata = {
  title: "Hướng dẫn thử", issuer: "Đơn vị thử nghiệm", url: "https://example.org/source.pdf",
  version: "Phiên bản 1", issuedOn: "2026-11-20", effectiveOn: "", scope: "Đối chiếu nguồn",
  diseaseId: "v8-24", visible: "yes",
};
const saved = { intent: "save", kind: "guidelines", id: "", draftRevision: "", basedOn: "", reason: "Thêm bản đối chiếu" };

test("drafts do not appear in the library, while approval exposes only the reference fields", () => {
  const created = updateEvidenceLibrary(EMPTY_EVIDENCE_LIBRARY, form({ ...metadata, ...saved }), "editor");
  assert.equal(publishedEvidence(created.data).length, 0);
  const publish = { intent: "publish", kind: saved.kind, id: created.id, draftRevision: created.data.drafts[0].revision };
  assert.throws(() => updateEvidenceLibrary(created.data, form({ ...publish, kind: "references" }), "reviewer"), /không khớp/);
  const approved = updateEvidenceLibrary(created.data, form(publish), "reviewer");
  assert.equal(approved.data.drafts.length, 0);
  assert.deepEqual(approved.data.audit.map(({ actor, action }) => [actor, action]), [["reviewer", "published"], ["editor", "saved"]]);
  assert.deepEqual(publishedEvidence(approved.data), [{
    id: created.id, kind: "guidelines", fields: { ...metadata, visible: true },
  }]);
});

test("archiving hides the latest record, retains its approved history and rejects outdated edits", () => {
  const created = updateEvidenceLibrary(EMPTY_EVIDENCE_LIBRARY, form({ ...metadata, ...saved, kind: "references", version: "" }), "editor");
  const publish = { intent: "publish", kind: "references", id: created.id, draftRevision: created.data.drafts[0].revision };
  const first = updateEvidenceLibrary(created.data, form(publish), "reviewer");
  const firstRelease = first.data.releases[0];
  const draft = updateEvidenceLibrary(first.data, form({
    ...metadata, ...saved, kind: "references", id: created.id, version: "", visible: "no",
    basedOn: firstRelease.revision, reason: "Đưa tài liệu vào lưu trữ",
  }), "editor");
  assert.equal(publishedEvidence(draft.data).length, 1);
  assert.throws(() => updateEvidenceLibrary(draft.data, form(publish), "reviewer"), /Bản nháp vừa thay đổi/);
  const archived = updateEvidenceLibrary(draft.data, form({ ...publish, draftRevision: draft.data.drafts[0].revision }), "reviewer");
  assert.deepEqual(publishedEvidence(archived.data), []);
  assert.equal(archived.data.releases.length, 2);
  assert.equal(archived.data.releases[1].revision, firstRelease.revision);
  assert.throws(() => updateEvidenceLibrary(archived.data, form({
    ...metadata, ...saved, kind: "references", id: created.id, basedOn: firstRelease.revision,
  }), "editor"), /đã phát hành vừa thay đổi/);
});

test("the form requires an HTTPS source, a valid disease and a version for guidelines", () => {
  for (const url of ["javascript:alert(1)", "not-a-url", "https://user:pass@example.org/source.pdf"]) {
    assert.throws(() => updateEvidenceLibrary(EMPTY_EVIDENCE_LIBRARY, form({ ...metadata, ...saved, url }), "editor"), /HTTPS/);
  }
  assert.throws(() => updateEvidenceLibrary(EMPTY_EVIDENCE_LIBRARY, form({ ...metadata, ...saved, diseaseId: "missing" }), "editor"), /bệnh cảnh/);
  assert.throws(() => updateEvidenceLibrary(EMPTY_EVIDENCE_LIBRARY, form({ ...metadata, ...saved, version: "" }), "editor"), /phiên bản/);
});
