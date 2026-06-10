"use client";

import { useState } from "react";

export default function ShareAppButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = "https://www.billtrack.me";
    const text = "Check out BillTrack - Free WhatsApp reminders and UPI payment links for small businesses.";
    
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "BillTrack",
          text,
          url,
        });
        return;
      } catch {
        // User dismissed share sheet, fallback to copy
      }
    }

    // Fallback to clipboard
    navigator.clipboard?.writeText(`${text} ${url}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleShare}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
      </svg>
      {copied ? "Link Copied!" : "Share BillTrack"}
    </button>
  );
}
