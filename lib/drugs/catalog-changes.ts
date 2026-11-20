import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { BASE_DRUGS, DRUG_FIELD_KEYS, DRUG_FIELD_MAX_LENGTH, DRUG_FIELDS, baseDrug, drugFields } from "./catalog";
import { drugFieldsSchema, type DrugCatalog } from "./catalog-store";

export class DrugCatalogError extends Error {}

export function publishedRevision(catalog: DrugCatalog, id: string): string {
  const published = catalog.approved.find((drug) => drug.id === id);
  if (published) return published.revision;
  const base = baseDrug(id);
  return base ? createHash("sha256").update(JSON.stringify(base)).digest("hex") : "";
}

const formDataSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("save"), id: z.string().max(64), draftRevision: z.string().max(36),
    baseRevision: z.string().max(64), active: z.enum(["yes", "no"]), reason: z.string().trim().min(1).max(512),
  }),
  z.object({ intent: z.enum(["approve", "discard"]), id: z.string().min(1).max(64), draftRevision: z.uuid() }),
]);

function normalizeCode(code: string) {
  return code.trim().toLowerCase();
}

function validateCode(catalog: DrugCatalog, id: string, code: string) {
  const own = catalog.approved.find((drug) => drug.id === id)?.fields ?? baseDrug(id);
  if (own && normalizeCode(own.drugCode) === normalizeCode(code)) return;
  const published = new Map(catalog.approved.map(({ id: key, fields }) => [key, fields.drugCode]));
  const duplicate = [...published].some(([key, value]) => key !== id && normalizeCode(value) === normalizeCode(code)) ||
    BASE_DRUGS.some((drug) => drug.id !== id && !published.has(drug.id) && normalizeCode(drug.drugCode) === normalizeCode(code));
  if (duplicate) throw new DrugCatalogError("Mã thuốc đã được dùng trong danh mục.");
}

export function updateDrugCatalog(catalog: DrugCatalog, form: FormData, actor: string): { data: DrugCatalog; id: string } {
  const result = formDataSchema.safeParse(Object.fromEntries(form));
  if (!result.success) throw new DrugCatalogError("Kiểm tra thông tin thuốc và ghi rõ nguồn hoặc lý do thay đổi.");
  const input = result.data;
  const id = input.id || `bv199-${randomUUID()}`;
  const draft = catalog.drafts.find((drug) => drug.id === id);
  const timestamp = new Date().toISOString();
  const revision = publishedRevision(catalog, id);
  let approved = catalog.approved;
  let drafts = catalog.drafts.filter((drug) => drug.id !== id);
  let event: DrugCatalog["audit"][number];

  if (input.intent === "save") {
    if (input.id && !revision && !draft) throw new DrugCatalogError("Không tìm thấy thuốc.");
    if (input.draftRevision !== (draft?.revision ?? "")) {
      throw new DrugCatalogError("Bản nháp vừa thay đổi. Tải lại trang để kiểm tra trước khi lưu.");
    }
    if (input.baseRevision !== revision) {
      throw new DrugCatalogError("Thông tin đã duyệt vừa thay đổi. Tải lại và đối chiếu trước khi lưu.");
    }
    const fieldsResult = drugFieldsSchema.safeParse(Object.fromEntries(DRUG_FIELD_KEYS.map((key) => [key, form.get(key)])));
    if (!fieldsResult.success) throw new DrugCatalogError(`Mỗi trường thông tin thuốc được nhập tối đa ${DRUG_FIELD_MAX_LENGTH} ký tự.`);
    const fields = fieldsResult.data;
    for (const key of ["drugCode", "brandName", "ingredientName", "strength"] as const) {
      if (!fields[key]) throw new DrugCatalogError(`Điền trường ${DRUG_FIELDS[key]}.`);
    }
    validateCode(catalog, id, fields.drugCode);
    drafts = [{
      id, fields, active: input.active === "yes", revision: randomUUID(),
      reason: input.reason, actor, timestamp, baseRevision: revision,
    }, ...drafts];
    event = { id: randomUUID(), drugId: id, brandName: fields.brandName, actor, timestamp, action: "saved", reason: input.reason };
  } else {
    if (!draft || draft.revision !== input.draftRevision) {
      throw new DrugCatalogError("Bản nháp vừa thay đổi. Tải lại trang để xem bản mới nhất.");
    }
    event = {
      id: randomUUID(), drugId: id, brandName: draft.fields.brandName, actor, timestamp,
      action: input.intent === "approve" ? "approved" : "discarded", reason: draft.reason,
    };
    if (input.intent === "approve") {
      if (draft.baseRevision !== revision) {
        throw new DrugCatalogError("Danh mục đã thay đổi. Đối chiếu và lưu lại bản nháp trước khi duyệt.");
      }
      validateCode(catalog, id, draft.fields.drugCode);
      const published = {
        id, fields: draft.fields, active: draft.active, reason: draft.reason,
        revision: randomUUID(), actor, timestamp,
      };
      const previous = editableDrug(catalog, id);
      event.fields = DRUG_FIELD_KEYS.flatMap((key) => {
        const before = previous?.fields[key] ?? "";
        const after = draft.fields[key];
        return before === after ? [] : [{ key, before, after }];
      });
      if (previous?.active !== draft.active) event.active = { before: previous?.active ?? null, after: draft.active };
      approved = [...approved.filter((drug) => drug.id !== id), published];
    }
  }

  return { id, data: { approved, drafts, audit: [event, ...catalog.audit] } };
}

export function editableDrug(catalog: DrugCatalog, id: string) {
  const approved = catalog.approved.find((drug) => drug.id === id);
  if (approved) return { fields: approved.fields, active: approved.active };
  const base = baseDrug(id);
  return base && { fields: drugFields(base), active: true };
}
