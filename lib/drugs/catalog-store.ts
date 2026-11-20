import { z } from "zod";
import { adminStorageConfigured, readPrivateJson, writePrivateJson, type PrivateSnapshot } from "@/lib/admin/private-json-store";
import { DRUG_FIELD_KEYS, DRUG_FIELD_MAX_LENGTH, type DrugPublication } from "./catalog";

export const drugFieldsSchema = z.record(z.enum(DRUG_FIELD_KEYS), z.string().trim().max(DRUG_FIELD_MAX_LENGTH));
const change = z.object({
  id: z.string().min(1),
  fields: drugFieldsSchema,
  active: z.boolean(),
  revision: z.uuid(),
  reason: z.string().min(1).max(512),
  actor: z.string(),
  timestamp: z.iso.datetime(),
});

const catalog = z.object({
  approved: z.array(change),
  drafts: z.array(change.extend({ baseRevision: z.string() })),
  audit: z.array(z.object({
    id: z.uuid(),
    drugId: z.string(),
    brandName: z.string(),
    actor: z.string(),
    timestamp: z.iso.datetime(),
    action: z.enum(["saved", "approved", "discarded"]),
    reason: z.string(),
    fields: z.array(z.object({ key: z.enum(DRUG_FIELD_KEYS), before: z.string(), after: z.string() })).optional(),
    active: z.object({ before: z.boolean().nullable(), after: z.boolean() }).optional(),
  })),
});

export type DrugCatalog = z.infer<typeof catalog>;
export const EMPTY_DRUG_CATALOG: DrugCatalog = { approved: [], drafts: [], audit: [] };
export const drugCatalogConfigured = adminStorageConfigured;
const PATH = "bv199-admin/drug-catalog-v1.json";

export function readDrugCatalog(): Promise<PrivateSnapshot<DrugCatalog>> {
  return readPrivateJson(PATH, (data) => catalog.parse(data), EMPTY_DRUG_CATALOG);
}

export function writeDrugCatalog(snapshot: PrivateSnapshot<DrugCatalog>): Promise<void> {
  return writePrivateJson(PATH, snapshot);
}

export async function loadDrugPublications(): Promise<DrugPublication[]> {
  if (!drugCatalogConfigured()) return [];
  const { data } = await readDrugCatalog();
  return data.approved.map(({ id, fields, active }) => ({ id, fields, active }));
}
