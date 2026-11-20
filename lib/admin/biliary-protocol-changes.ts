import { randomUUID } from "node:crypto";
import { z } from "zod";
import { BILIARY_BASE_CONTENT, BILIARY_BASE_REVISION, BILIARY_EDIT_GROUPS, biliaryChanges } from "@/lib/antibiotics/biliary-protocol";
import { protocolContentSchema, type BiliaryProtocolHistory } from "./biliary-protocol-store";

export class BiliaryProtocolError extends Error {}

const formSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("save"), revision: z.union([z.literal(""), z.uuid()]),
    basedOn: z.union([z.literal(BILIARY_BASE_REVISION), z.uuid()]), reason: z.string().trim().min(1).max(1000),
  }),
  z.object({ intent: z.enum(["publish", "discard"]), revision: z.uuid() }),
]);

export function updateBiliaryHistory(history: BiliaryProtocolHistory, form: FormData, actor: string) {
  const result = formSchema.safeParse(Object.fromEntries(form));
  if (!result.success) throw new BiliaryProtocolError("Kiểm tra biểu mẫu và nhập lý do thay đổi.");
  const input = result.data;
  const latest = history.releases[0];
  const currentRevision = latest?.revision ?? BILIARY_BASE_REVISION;
  const current = latest?.content ?? BILIARY_BASE_CONTENT;
  const timestamp = new Date().toISOString();
  const draft = history.draft;
  if (input.revision !== (draft?.revision ?? "")) {
    throw new BiliaryProtocolError("Bản nháp vừa thay đổi. Tải lại trang trước khi tiếp tục.");
  }

  if (input.intent === "save") {
    if (input.basedOn !== currentRevision) throw new BiliaryProtocolError("Bản đang dùng vừa thay đổi. Tải lại và đối chiếu.");
    const doses = Object.fromEntries(BILIARY_EDIT_GROUPS.flatMap(({ rows }) => rows.map(({ id }) => [id, form.get(`dose:${id}`)])));
    const result = protocolContentSchema.safeParse({
      doses,
      mildDuration: form.get("mildDuration"),
      moderateSevereDuration: form.get("moderateSevereDuration"),
      source: { title: form.get("sourceTitle"), locator: form.get("sourceLocator"), url: form.get("sourceUrl") },
    });
    if (!result.success) throw new BiliaryProtocolError("Nhập đủ cách dùng, thời gian và vị trí trích dẫn kèm đường dẫn HTTPS.");
    const content = result.data;
    for (const { rows } of BILIARY_EDIT_GROUPS) {
      for (const row of rows) if (content.doses[row.id] === row.baseline) delete content.doses[row.id];
    }
    if (biliaryChanges(current, content).length === 0) throw new BiliaryProtocolError("Chưa có nội dung thay đổi so với bản đang dùng.");
    return {
      intent: input.intent,
      data: { ...history, draft: { revision: randomUUID(), basedOn: currentRevision, timestamp, actor, reason: input.reason, content } },
    };
  }

  if (!draft) throw new BiliaryProtocolError("Không tìm thấy bản nháp.");
  if (input.intent === "discard") return { intent: input.intent, data: { ...history, draft: null } };
  if (draft.basedOn !== currentRevision) throw new BiliaryProtocolError("Bản đang dùng vừa thay đổi. Đối chiếu và lưu lại bản nháp trước khi duyệt.");
  return {
    intent: input.intent,
    data: {
      draft: null,
      releases: [{ revision: randomUUID(), timestamp, actor, preparedBy: draft.actor, reason: draft.reason, content: draft.content }, ...history.releases],
    },
  };
}
