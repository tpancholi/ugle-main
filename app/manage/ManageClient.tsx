"use client";

import { useActionState } from "react";
import {
  cancelRenewal,
  requestManageLink,
  type ManageState,
} from "@/app/actions/manage-license";

const initial: ManageState = { success: false, message: "" };

export function ManageClient({
  mode,
  token,
}: {
  mode: "request" | "cancel";
  token?: string;
}) {
  const action = mode === "cancel" ? cancelRenewal : requestManageLink;
  const [state, formAction, pending] = useActionState(action, initial);

  if (mode === "request") {
    return (
      <form action={formAction} className="space-y-3">
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-ugle-light/70 px-3 py-2.5 text-sm outline-none focus:border-ugle-green"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex px-5 py-2.5 bg-ugle-slate text-white text-sm font-bold rounded-[10px] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Email manage link"}
        </button>
        {state.message && (
          <p
            className={`text-sm ${state.success ? "text-[#5DA233]" : "text-red-600"}`}
          >
            {state.message}
          </p>
        )}
      </form>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="token" value={token} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex px-5 py-2.5 border border-ugle-light text-ugle-slate text-sm font-bold rounded-[10px] disabled:opacity-60"
      >
        {pending ? "Updating…" : "Cancel renewal reminders"}
      </button>
      {state.message && (
        <p
          className={`text-sm ${state.success ? "text-[#5DA233]" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
