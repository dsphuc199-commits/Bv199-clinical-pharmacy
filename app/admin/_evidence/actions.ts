"use server";

import { BlobPreconditionFailedError } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { currentAdmin } from "@/lib/auth/admin";
import { EvidenceChangeError, updateEvidenceLibrary } from "@/lib/admin/guideline-library-changes";
import { readEvidenceLibrary, writeEvidenceLibrary } from "@/lib/admin/guideline-library";

export type EvidenceFormState = { message?: string; saved?: boolean; draftId?: string };

export async function saveEvidence(_previous: EvidenceFormState, form: FormData): Promise<EvidenceFormState> {
  const admin = await currentAdmin();
  if (!admin) return { message: "Hãy đăng nhập lại bằng tài khoản Quản trị Khoa Dược." };

  try {
    const snapshot = await readEvidenceLibrary();
    const change = updateEvidenceLibrary(snapshot.data, form, admin.user);
    await writeEvidenceLibrary({ ...snapshot, data: change.data });
    revalidatePath(`/admin/${change.kind}`);
    if (change.intent === "publish") {
      revalidatePath("/antibiotics/empiric/sources/approved");
      return { saved: true, message: "Đã duyệt và cập nhật thư viện." };
    }
    if (change.intent === "discard") return { saved: true, message: "Đã bỏ bản nháp." };
    return { saved: true, message: "Đã lưu bản nháp.", draftId: change.id };
  } catch (error) {
    if (error instanceof EvidenceChangeError) return { message: error.message };
    if (error instanceof BlobPreconditionFailedError) return { message: "Danh mục vừa thay đổi. Tải lại trang rồi thử lại." };
    return { message: "Chưa lưu được thay đổi. Kiểm tra kết nối kho lưu trữ rồi thử lại." };
  }
}
