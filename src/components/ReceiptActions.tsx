"use client";

import { useState } from "react";

export default function ReceiptActions({
  receiptUrl,
  payeeName,
  amountLabel,
}: {
  receiptUrl: string;
  payeeName: string;
  amountLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  function handlePrint() {
    if (typeof window !== "undefined") window.print();
  }

  async function handleShare() {
    const shareData = {
      title: `Receipt from ${payeeName}`,
      text: `Payment receipt for ${amountLabel} from ${payeeName}`,
      url: receiptUrl,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return; // user dismissed the share sheet
      }
    }
    navigator.clipboard?.writeText(receiptUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={handlePrint}
        className="rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        🖨️ Print / PDF
      </button>
      <button
        onClick={handleShare}
        className="rounded-xl bg-brand-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {copied ? "✓ Copied!" : "Share receipt"}
      </button>
    </div>
  );
}
