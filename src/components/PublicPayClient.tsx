"use client";

import { useState } from "react";

// Amount-aware UPI pay button for the public /u/<handle> page. The amount is
// optional: when left blank we omit `am` from the deep link so the payer types
// it in their own UPI app; when filled we pre-fill it.
export default function PublicPayClient({
  upiId,
  payeeName,
}: {
  upiId: string;
  payeeName: string;
}) {
  const [amount, setAmount] = useState("");
  const num = Number(amount);
  const hasAmount = amount.trim() !== "" && Number.isFinite(num) && num > 0;

  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    cu: "INR",
    tn: `Payment to ${payeeName}`,
  });
  if (hasAmount) params.set("am", num.toFixed(2));
  const payHref = `upi://pay?${params.toString()}`;

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          Amount (optional)
        </span>
        <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
          <span className="text-slate-400">₹</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            placeholder="Enter amount"
            className="w-full bg-transparent px-2 py-3 text-sm outline-none"
          />
        </div>
      </label>

      <a
        href={payHref}
        className="block w-full rounded-2xl bg-brand-600 py-3.5 text-center font-semibold text-white transition hover:bg-brand-700"
      >
        Pay {hasAmount ? `₹${num.toLocaleString("en-IN")} ` : ""}via UPI
      </a>
      <p className="text-center text-xs text-slate-400">
        Opens GPay, PhonePe, Paytm or any UPI app
        {hasAmount ? "" : " — you can enter the amount there"}.
      </p>
    </div>
  );
}
