"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type { Bill, Language } from "@/lib/types";
import { effectiveStatus, formatINR } from "@/lib/bills";
import { buildWhatsAppLink, buildPayLink, buildWhatsAppReceiptLink } from "@/lib/whatsapp";
import { setBillStatus, markReminded, deleteBill, renewBill } from "@/app/bills/actions";
import PersonaBadge from "./PersonaBadge";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
  paid: "bg-brand-100 text-brand-700",
};

const REPEAT_LABEL: Record<string, string> = {
  none: "",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

export default function BillCard({
  bill,
  upiId,
  payeeName,
  language,
}: {
  bill: Bill;
  upiId: string;
  payeeName: string;
  language: Language;
}) {
  const status = effectiveStatus(bill);
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [origin, setOrigin] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const isPaid = status === "paid";

  useEffect(() => setOrigin(window.location.origin), []);

  const due = new Date(bill.due_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  const ready = !!upiId && !!origin;
  const waLink = ready
    ? buildWhatsAppLink(bill, bill.category, payeeName, origin, upiId, language)
    : "";
  const payPageLink = origin ? buildPayLink(origin, bill.id) : "";

  const repeatLabel = REPEAT_LABEL[bill.repeat_interval ?? "none"];

  function copyPayLink() {
    navigator.clipboard?.writeText(payPageLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    });
  }

  // Native share sheet (WhatsApp, SMS, anywhere) with clipboard fallback.
  async function sharePayLink() {
    if (!payPageLink) return;
    const shareData = {
      title: `Payment request from ${payeeName}`,
      text: `${bill.description} — ${formatINR(bill.amount)}`,
      url: payPageLink,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      return; // user dismissed the share sheet
    }
    copyPayLink();
  }

  function handleRenew() {
    startTransition(async () => {
      const result = await renewBill(bill.id);
      if (result?.success) setRenewed(true);
      else if (result?.error) alert(result.error);
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-slate-800">
              {bill.payer_name}
            </p>
            <PersonaBadge persona={bill.category} />
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {bill.description}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tracking-tight">
            {formatINR(bill.amount)}
          </p>
          <div className="mt-1 flex items-center justify-end gap-1.5">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}
            >
              {status === "overdue" ? "Overdue" : status === "paid" ? "Paid" : "Pending"}
            </span>
            {repeatLabel && (
              <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                ↻ {repeatLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Due {due}</span>
        {bill.reminder_sent_at && (
          <span>
            Reminder opened{" "}
            {new Date(bill.reminder_sent_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
      </div>

      {bill.payment_claimed_at && !isPaid && (
        <div className="mt-3 rounded-xl bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
          🔔 {bill.payer_name.split(" ")[0]} reported they&apos;ve paid — confirm
          &amp; mark as paid.
        </div>
      )}

      {!isPaid &&
        (upiId ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={waLink || undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => startTransition(() => markReminded(bill.id))}
              className="rounded-xl bg-[#25D366] py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-95"
            >
              WhatsApp reminder
            </a>
            <button
              onClick={sharePayLink}
              disabled={!payPageLink}
              className="rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {linkCopied ? "✓ Link copied!" : "Share pay link"}
            </button>
          </div>
        ) : (
          <Link
            href="/settings"
            className="mt-4 block rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-center text-sm font-medium text-amber-800"
          >
            Add your UPI ID to enable reminders & pay link →
          </Link>
        ))}

      {/* Paid bill actions: WhatsApp receipt and Renew button */}
      {isPaid && (
        <div className={`mt-4 grid gap-2 ${!renewed ? "grid-cols-2" : "grid-cols-1"}`}>
          <a
            href={origin ? buildWhatsAppReceiptLink(bill, payeeName, origin, language) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl bg-[#25D366] py-2.5 text-center text-sm font-semibold text-white transition hover:brightness-95"
          >
            Send receipt
          </a>
          {!renewed && (
            <button
              onClick={handleRenew}
              disabled={pending}
              className="w-full rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 py-2.5 text-center text-sm font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-100 disabled:opacity-50"
            >
              {pending
                ? "Creating…"
                : bill.repeat_interval && bill.repeat_interval !== "none"
                  ? `↻ Create next ${REPEAT_LABEL[bill.repeat_interval].toLowerCase()}`
                  : "↻ Create similar"}
            </button>
          )}
        </div>
      )}
      {renewed && (
        <p className="mt-4 rounded-xl bg-brand-50 py-2.5 text-center text-sm font-semibold text-brand-700">
          ✓ Next bill created
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-3 text-xs font-medium">
          <Link href={`/bills/${bill.id}`} className="text-slate-500 hover:text-slate-800">
            Edit
          </Link>
          {origin && (
            <a
              href={payPageLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-800"
            >
              Preview
            </a>
          )}
          {confirmDelete ? (
            <button
              onClick={() => startTransition(() => deleteBill(bill.id))}
              className="text-red-600"
            >
              Confirm delete
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-slate-400 hover:text-red-500"
            >
              Delete
            </button>
          )}
        </div>
        <button
          onClick={() =>
            startTransition(() =>
              setBillStatus(bill.id, isPaid ? "pending" : "paid"),
            )
          }
          disabled={pending}
          className="text-xs font-semibold text-brand-600 hover:underline disabled:opacity-50"
        >
          {isPaid ? "Mark as unpaid" : "Mark as paid"}
        </button>
      </div>
    </div>
  );
}
