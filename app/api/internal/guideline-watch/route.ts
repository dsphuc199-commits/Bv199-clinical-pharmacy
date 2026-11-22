import { createHash, timingSafeEqual } from "node:crypto";
import { gatewayToken } from "@/lib/admin/guideline-watch-ai";
import { checkWatch, reviewNextWatchEntry } from "@/lib/admin/guideline-watch";

export const maxDuration = 120;

function digest(value: string) { return createHash("sha256").update(value).digest(); }

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !timingSafeEqual(digest(request.headers.get("authorization") ?? ""), digest(`Bearer ${secret}`))) {
    return new Response(null, { status: 401 });
  }
  try {
    const state = await checkWatch();
    const token = gatewayToken(request.headers.get("x-vercel-oidc-token"));
    if (token) await reviewNextWatchEntry(state, token);
    return Response.json({ checked: state.checks.length, reachable: state.checks.filter(({ status }) => status === "ok").length });
  } catch {
    return Response.json({ error: "Guideline watch could not complete" }, { status: 503 });
  }
}
