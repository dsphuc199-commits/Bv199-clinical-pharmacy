import { randomUUID } from "node:crypto";
import { z } from "zod";
import { DISEASES } from "@/data/antibiotics/empiric/catalog";
import { evidenceFields, recordKind, type EvidenceLibrary } from "./guideline-library";

export class EvidenceChangeError extends Error {}

const diseaseIds = new Set(DISEASES.map(({ id }) => id));
const formSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("save"), kind: recordKind,
    id: z.union([z.literal(""), z.uuid()]),
    draftRevision: z.union([z.literal(""), z.uuid()]),
    basedOn: z.union([z.literal(""), z.uuid()]),
    reason: z.string().trim().min(1).max(1000),
  }),
  z.object({ intent: z.enum(["publish", "discard"]), kind: recordKind, id: z.uuid(), draftRevision: z.uuid() }),
]);

function readFields(form: FormData) {
  const { visible, ...values } = Object.fromEntries(form);
  const fields = evidenceFields.safeParse({ ...values, visible: visible === "yes" });
  if (!fields.success || (visible !== "yes" && visible !== "no")) {
    throw new EvidenceChangeError("Kiểm tra tên tài liệu, tổ chức, phạm vi và đường dẫn HTTPS.");
  }
  if (fields.data.diseaseId && !diseaseIds.has(fields.data.diseaseId)) {
    throw new EvidenceChangeError("Chọn bệnh cảnh khớp với danh mục hiện tại.");
  }
  return fields.data;
}

export function updateEvidenceLibrary(library: EvidenceLibrary, form: FormData, actor: string) {
  const result = formSchema.safeParse(Object.fromEntries(form));
  if (!result.success) throw new EvidenceChangeError("Kiểm tra biểu mẫu và nhập lý do thay đổi.");
  const input = result.data;
  const id = input.id || randomUUID();
  const draft = library.drafts.find((record) => record.id === id);
  const latest = library.releases.find((record) => record.id === id);
  const currentRevision = latest?.revision ?? "";
  const timestamp = new Date().toISOString();
  if ([draft, latest].some((record) => record && record.kind !== input.kind)) {
    throw new EvidenceChangeError("Mục tài liệu không khớp với bản đang sửa.");
  }
  if (input.draftRevision !== (draft?.revision ?? "")) {
    throw new EvidenceChangeError("Bản nháp vừa thay đổi. Tải lại trang trước khi tiếp tục.");
  }

  let drafts = library.drafts.filter((record) => record.id !== id);
  let releases = library.releases;
  let audit: EvidenceLibrary["audit"][number];
  if (input.intent === "save") {
    if (input.id && !latest && !draft) throw new EvidenceChangeError("Không tìm thấy tài liệu.");
    if (input.basedOn !== currentRevision) throw new EvidenceChangeError("Bản đã phát hành vừa thay đổi. Tải lại trang để đối chiếu.");
    const fields = readFields(form);
    if (input.kind === "guidelines" && !fields.version) throw new EvidenceChangeError("Nhập số hiệu hoặc phiên bản hướng dẫn.");
    drafts = [{
      id, kind: input.kind, fields, revision: randomUUID(), timestamp, actor, reason: input.reason, basedOn: currentRevision,
    }, ...drafts];
    audit = { id: randomUUID(), kind: input.kind, action: "saved", title: fields.title, reason: input.reason, timestamp, actor };
  } else {
    if (!draft) throw new EvidenceChangeError("Không tìm thấy bản nháp.");
    if (input.intent === "publish") {
      if (draft.basedOn !== currentRevision) throw new EvidenceChangeError("Bản đã phát hành vừa thay đổi. Đối chiếu và lưu lại bản nháp.");
      releases = [{
        id, kind: draft.kind, fields: draft.fields, revision: randomUUID(), timestamp, actor, reason: draft.reason,
      }, ...releases];
    }
    audit = {
      id: randomUUID(), kind: draft.kind, action: input.intent === "publish" ? "published" : "discarded",
      title: draft.fields.title, reason: draft.reason, timestamp, actor,
    };
  }

  return { id, kind: input.kind, intent: input.intent, data: { drafts, releases, audit: [audit, ...library.audit] } };
}
