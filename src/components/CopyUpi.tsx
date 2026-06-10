"use client";

import { useState } from "react";

export default function CopyUpi({ upiId }: { upiId: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      onClick={copy}
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm transition hover:bg-slate-50"
    >
      <span className="text-slate-500">UPI ID</span>
      <span className="font-medium text-slate-800">
        {copied ? "Copied!" : upiId}
      </span>
    </button>
  );
}
