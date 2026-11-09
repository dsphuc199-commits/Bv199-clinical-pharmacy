/*
  Xem To HDSD da luu trong kho file rieng tu cua web app (Vercel Blob, private).
  Duong dan duoc bao ve boi proxy.ts (bat buoc dang nhap). Ban sao tu Cong Cuc Quan ly Duoc.
*/
import type { NextRequest } from "next/server";
import { get } from "@vercel/blob";
import leafletFiles from "@/data/leaflet-files.json";

type StoredFile = { path?: string; error?: string };
const FILES = leafletFiles as Record<string, StoredFile[]>;

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/hdsd/[davId]/[index]">) {
  const { davId, index } = await ctx.params;
  const file = FILES[davId]?.[Number(index)];
  if (!file?.path) return new Response("Không tìm thấy tờ hướng dẫn sử dụng", { status: 404 });

  try {
    const blob = await get(file.path, { access: "private" });
    if (!blob?.stream) return new Response("Không tìm thấy tờ hướng dẫn sử dụng", { status: 404 });
    return new Response(blob.stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="HDSD-${davId}-${Number(index) + 1}.pdf"`,
        // Chi trinh duyet cua nguoi dung luu tam (noi dung yeu cau dang nhap).
        "Cache-Control": "private, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Không tải được tờ hướng dẫn sử dụng. Thử lại sau.", { status: 502 });
  }
}
