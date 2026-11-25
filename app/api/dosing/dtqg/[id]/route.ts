/*
  Nguyên văn mục liều ở người suy thận (Dược thư quốc gia 2023) của một thuốc – module Hiệu chỉnh liều tải khi người dùng
  chọn thuốc, thay vì gửi toàn văn của mọi thuốc ngay lúc mở trang. Được bảo vệ bởi proxy.ts (bắt buộc đăng nhập).
*/
import type { NextRequest } from "next/server";
import dtqg from "@/data/renal-dtqg.json";
import type { DtqgItem } from "@/lib/dosing/catalog";

const BY_ID = new Map((dtqg as { items: DtqgItem[] }).items.map((it) => [it.id, it.content]));

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const content = BY_ID.get(id);
  if (!content) return Response.json({ error: "Không tìm thấy" }, { status: 404 });
  return Response.json({ content }, { headers: { "Cache-Control": "private, max-age=86400" } });
}
