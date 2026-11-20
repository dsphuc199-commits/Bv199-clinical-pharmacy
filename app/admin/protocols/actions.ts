"use server";

import { BlobPreconditionFailedError } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { BiliaryProtocolError, updateBiliaryHistory } from "@/lib/admin/biliary-protocol-changes";
import { readBiliaryHistory, writeBiliaryHistory } from "@/lib/admin/biliary-protocol-store";
import { currentAdmin } from "@/lib/auth/admin";

export type ProtocolFormState = { message?: string; saved?: boolean };

export async function saveProtocol(_previous: ProtocolFormState, form: FormData): Promise<ProtocolFormState> {
  const admin = await currentAdmin();
  if (!admin) return { message: "Hãy đăng nhập lại bằng tài khoản Quản trị Khoa Dược." };

  let intent: "save" | "publish" | "discard";
  try {
    const snapshot = await readBiliaryHistory();
    const change = updateBiliaryHistory(snapshot.data, form, admin.user);
    intent = change.intent;
    await writeBiliaryHistory({ ...snapshot, data: change.data });
  } catch (error) {
    if (error instanceof BiliaryProtocolError) return { message: error.message };
    if (error instanceof BlobPreconditionFailedError) return { message: "Phác đồ vừa thay đổi. Tải lại trang rồi thử lại." };
    return { message: "Chưa lưu được thay đổi. Kiểm tra kết nối kho lưu trữ rồi thử lại." };
  }

  revalidatePath("/admin/protocols");
  if (intent === "publish") {
    revalidatePath("/antibiotics/empiric/guideline-v9", "layout");
    return { saved: true, message: "Đã duyệt và phát hành phác đồ." };
  }
  return { saved: true, message: intent === "save" ? "Đã lưu bản nháp." : "Đã bỏ bản nháp." };
}
