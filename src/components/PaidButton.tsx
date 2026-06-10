"use client";

import { useState, useTransition } from "react";
import { claimPayment } from "@/app/pay/[id]/actions";

export default function PaidButton({
  billId,
  alreadyClaimed,
}: {
  billId: string;
  alreadyClaimed: boolean;
}) {
  const [done, setDone] = useState(alreadyClaimed);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="rounded-2xl bg-brand-50 py-3 text-center text-sm font-medium text-brand-700">
        ✓ Thanks! We&apos;ve let them know you&apos;ve paid.
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const res = await claimPayment(billId);
          if (!res?.error) setDone(true);
        })
      }
      disabled={pending}
      className="w-full rounded-2xl border border-brand-200 bg-white py-3 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:opacity-60"
    >
      {pending ? "Please wait…" : "I've paid ✓"}
    </button>
  );
}
