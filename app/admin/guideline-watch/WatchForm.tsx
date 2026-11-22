"use client";

import { useActionState } from "react";
import { runWatchAction } from "./actions";

export default function WatchForm({ documentId, label }: { documentId?: string; label: string }) {
  const [state, action, pending] = useActionState(runWatchAction, {});
  return (
    <form action={action} className="flex flex-wrap items-center gap-2" aria-busy={pending}>
      <input type="hidden" name="intent" value={documentId ? "review" : "check"} />
      {documentId && <input type="hidden" name="documentId" value={documentId} />}
      <button type="submit" disabled={pending} className="rounded-lg bg-teal-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Đang xử lý…" : label}
      </button>
      {state.message && <p role="status" className={state.saved ? "text-sm text-teal-800" : "text-sm text-amber-900"}>{state.message}</p>}
    </form>
  );
}
