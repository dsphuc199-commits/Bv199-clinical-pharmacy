"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { currentAdmin } from "@/lib/auth/admin";
import { gatewayToken } from "@/lib/admin/guideline-watch-ai";
import { checkWatch, prepareWatchProposal, watchError } from "@/lib/admin/guideline-watch";

export type WatchFormState = { message?: string; saved?: boolean };

export async function runWatchAction(_previous: WatchFormState, form: FormData): Promise<WatchFormState> {
  if (!await currentAdmin()) return { message: "Cần quyền Quản trị Khoa Dược." };
  const intent = form.get("intent");
  try {
    if (intent === "check") {
      const state = await checkWatch();
      revalidatePath("/admin/guideline-watch");
      const ok = state.checks.filter(({ status }) => status === "ok").length;
      return { saved: ok > 0, message: `Đã kiểm tra ${ok}/${state.checks.length} nguồn thành công.` };
    }
    const id = form.get("documentId");
    if (intent !== "review" || typeof id !== "string" || !/^[a-f0-9]{24}$/.test(id)) return { message: "Tài liệu không hợp lệ." };
    const token = gatewayToken((await headers()).get("x-vercel-oidc-token"));
    if (!token) return { message: "Chưa kết nối AI Gateway. Vẫn có thể mở tài liệu gốc để đối chiếu." };
    await prepareWatchProposal(id, token);
    revalidatePath("/admin/guideline-watch");
    revalidatePath("/admin/protocols");
    return { saved: true, message: "Đã cập nhật trạng thái đối chiếu bên dưới." };
  } catch (error) {
    return { message: watchError(error, "Chưa hoàn thành thao tác. Hãy kiểm tra kho lưu trữ rồi thử lại.") };
  }
}
