"use server";

import { BlobPreconditionFailedError } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { currentAdmin } from "@/lib/auth/admin";
import { DrugCatalogError, updateDrugCatalog } from "@/lib/drugs/catalog-changes";
import { readDrugCatalog, writeDrugCatalog } from "@/lib/drugs/catalog-store";

export type DrugFormState = { message?: string; saved?: boolean; draftId?: string };

export async function changeDrug(_previous: DrugFormState, form: FormData): Promise<DrugFormState> {
  const admin = await currentAdmin();
  if (!admin) return { message: "Hãy đăng nhập lại bằng tài khoản Quản trị Khoa Dược." };
  const intent = form.get("intent");
  let id: string;
  try {
    const snapshot = await readDrugCatalog();
    const change = updateDrugCatalog(snapshot.data, form, admin.user);
    id = change.id;
    await writeDrugCatalog({ ...snapshot, data: change.data });
  } catch (error) {
    if (error instanceof DrugCatalogError) return { message: error.message };
    if (error instanceof BlobPreconditionFailedError) return { message: "Danh mục vừa thay đổi. Tải lại trang rồi thử lại." };
    return { message: "Chưa lưu được thay đổi. Kiểm tra kết nối kho lưu trữ rồi thử lại." };
  }

  revalidatePath("/admin/drugs");
  if (intent === "approve") {
    revalidatePath("/drugs");
    revalidatePath(`/drugs/${encodeURIComponent(id)}`);
    return { saved: true, message: "Đã duyệt và cập nhật danh mục tra cứu." };
  }
  if (intent === "discard") return { saved: true, message: "Đã bỏ bản nháp." };
  return { saved: true, message: "Đã lưu bản nháp.", draftId: id };
}
