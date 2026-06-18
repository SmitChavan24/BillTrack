"use client";

import Link from "next/link";
import { useState } from "react";

// Dashboard card that surfaces the user's public pay page so they actually
// claim a handle and share it. No handle yet → a prompt to claim one; handle
// set → the live link with a one-tap copy.
export default function MyPublicPageCard({ handle }: { handle: string | null }) {
  const [copied, setCopied] = useState(false);

  if (!handle) {
    return (
      <Link
        href="/settings"
        className="block rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 transition hover:bg-brand-100"
      >
        🔗 Claim your free public pay page — share one link, get paid by anyone →
      </Link>
    );
  }

  const path = `billtrack.me/u/${handle}`;

  function copy() {
    navigator.clipboard?.writeText(`https://${path}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">Your public pay page</p>
        <a
          href={`https://${path}`}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-sm font-semibold text-brand-700"
        >
          {path}
        </a>
      </div>
      <button
        onClick={copy}
        className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
