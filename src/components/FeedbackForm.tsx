"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitFeedback, type FeedbackState } from "@/app/feedback/actions";

export default function FeedbackForm() {
  const [state, action, pending] = useActionState<FeedbackState, FormData>(
    submitFeedback,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Have feedback or need help?
      </label>
      <textarea
        name="message"
        rows={4}
        placeholder="Tell us what's working, what's broken, or what you'd like to see…"
        className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
      {state?.error && (
        <p className="mt-2 text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="mt-2 text-sm text-brand-600">
          Thanks! We&apos;ve received your message and will reply here.
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
