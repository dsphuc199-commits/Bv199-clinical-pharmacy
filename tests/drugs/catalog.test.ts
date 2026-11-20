import assert from "node:assert/strict";
import { test } from "node:test";
import { BASE_DRUGS, catalogProducts, drugFields, drugMatches, getCatalogProduct } from "../../lib/drugs/catalog";
import { publishedRevision, updateDrugCatalog } from "../../lib/drugs/catalog-changes";
import { EMPTY_DRUG_CATALOG } from "../../lib/drugs/catalog-store";

function form(values: Record<string, string>) {
  const fields = new FormData();
  for (const [key, value] of Object.entries(values)) fields.set(key, value);
  return fields;
}

const sample = BASE_DRUGS[0];
const save = { intent: "save", id: "", draftRevision: "", baseRevision: "", active: "yes", reason: "Dữ liệu kiểm thử" };

test("a new drug is available to public lookup only once approved", () => {
  const created = updateDrugCatalog(EMPTY_DRUG_CATALOG, form({
    ...drugFields(sample), ...save, drugCode: "FIXTURE-NEW-PRODUCT-X12", brandName: "Biệt dược thử",
  }), "editor");
  const draft = created.data.drafts[0];
  assert.equal(created.data.approved.length, 0);
  assert.equal(getCatalogProduct(created.id), undefined);
  assert.equal(catalogProducts(created.data.approved).some((drug) => drug.id === created.id), false);

  const published = updateDrugCatalog(created.data, form({
    intent: "approve", id: created.id, draftRevision: draft.revision,
  }), "reviewer");
  const drug = getCatalogProduct(created.id, published.data.approved[0]);
  assert.ok(drug && drugMatches(drug, "biet duoc thu"));
  assert.equal(drug.registryMatches, false);
  assert.equal(published.data.drafts.length, 0);
  assert.deepEqual(published.data.audit.map(({ actor, action }) => [actor, action]), [["reviewer", "approved"], ["editor", "saved"]]);
});

test("an existing drug stays unchanged until approval and identity changes do not inherit its product references", () => {
  const initial = {
    ...drugFields(sample), ...save, id: sample.id, baseRevision: publishedRevision(EMPTY_DRUG_CATALOG, sample.id),
    strength: `${sample.strength} (kiểm thử)`,
  };
  const first = updateDrugCatalog(EMPTY_DRUG_CATALOG, form(initial), "editor");
  assert.equal(getCatalogProduct(sample.id)?.strength, sample.strength);
  const updated = updateDrugCatalog(first.data, form({
    ...initial, draftRevision: first.data.drafts[0].revision, active: "no",
  }), "editor");
  const approval = { intent: "approve", id: sample.id, draftRevision: first.data.drafts[0].revision };
  assert.throws(() => updateDrugCatalog(updated.data, form(approval), "reviewer"), /vừa thay đổi/);
  const published = updateDrugCatalog(updated.data, form({ ...approval, draftRevision: updated.data.drafts[0].revision }), "reviewer");
  const [drug] = published.data.approved;
  assert.equal(getCatalogProduct(sample.id, drug)?.registryMatches, false);
  assert.equal(catalogProducts(published.data.approved).find((item) => item.id === sample.id)?.active, false);
  assert.deepEqual(published.data.audit[0].fields, [{ key: "strength", before: sample.strength, after: initial.strength }]);
  assert.deepEqual(published.data.audit[0].active, { before: true, after: false });
  assert.equal(getCatalogProduct(sample.id, { ...drug, fields: drugFields(sample) })?.registryMatches, true);
  assert.throws(() => updateDrugCatalog(published.data, form(initial), "editor"), /đã duyệt vừa thay đổi/);
});

test("a duplicate product code is rejected and discarded drafts do not change the catalog", () => {
  assert.throws(() => updateDrugCatalog(EMPTY_DRUG_CATALOG, form({
    ...drugFields(sample), ...save,
  }), "editor"), /Mã thuốc đã được dùng/);
  const created = updateDrugCatalog(EMPTY_DRUG_CATALOG, form({
    ...drugFields(sample), ...save, drugCode: "FIXTURE-DISCARD-PRODUCT",
  }), "editor");
  const discarded = updateDrugCatalog(created.data, form({
    intent: "discard", id: created.id, draftRevision: created.data.drafts[0].revision,
  }), "reviewer");
  assert.equal(discarded.data.approved.length, 0);
  assert.equal(discarded.data.drafts.length, 0);
  assert.equal(discarded.data.audit[0].action, "discarded");
});
