"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { BlobPreconditionFailedError } from "@vercel/blob";
import { AccountChangeError, applyAccountChange, parseAccountChange } from "@/lib/auth/account-changes";
import { readAccountRegistry, writeAccountRegistry } from "@/lib/auth/account-store";
import { authConfig, readSignedSession, SESSION_COOKIE } from "@/lib/auth/session";

export type AccountFormState = { saved?: boolean; message?: string };

export async function saveAccount(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  const config = authConfig();
  const claims = readSignedSession((await cookies()).get(SESSION_COOKIE)?.value, config);
  if (!claims?.admin) return { message: "Hãy đăng nhập lại bằng tài khoản quản trị." };

  try {
    const change = parseAccountChange(form);
    const snapshot = await readAccountRegistry();
    const data = applyAccountChange(snapshot.data, config, claims, change);
    await writeAccountRegistry({ ...snapshot, data });
  } catch (error) {
    if (error instanceof AccountChangeError) return { message: error.message };
    if (error instanceof BlobPreconditionFailedError) {
      return { message: "Danh sách tài khoản vừa thay đổi. Tải lại trang trước khi lưu." };
    }
    return { message: "Chưa lưu được tài khoản. Kiểm tra kết nối lưu trữ rồi thử lại." };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/audit-log");
  return { saved: true, message: "Đã lưu thay đổi." };
}
