import type { Metadata } from "next";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { buildUPILink } from "@/lib/upi";
import Link from "next/link";
import { formatINR } from "@/lib/bills";
import CopyUpi from "@/components/CopyUpi";
import PaidButton from "@/components/PaidButton";
import ShareAppButton from "@/components/ShareAppButton";

export const dynamic = "force-dynamic";

type Payment = {
  payer_name: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  payee_name: string;
  upi_id: string | null;
  payment_claimed_at: string | null;
};

async function getPayment(id: string): Promise<Payment | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_payment", { p_bill_id: id });
  return (data?.[0] as Payment) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getPayment(id);
  // Personal payment links must never be indexed — but they still need rich
  // Open Graph tags so the WhatsApp preview card renders.
  const noindex = { index: false, follow: false } as const;
  if (!p) return { title: "Payment request", robots: noindex };

  const title = `Pay ${formatINR(p.amount)} to ${p.payee_name}`;
  const description = `${p.description} · Tap to pay securely via UPI`;
  return {
    title,
    description,
    robots: noindex,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PayByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPayment(id);

  if (!p || !p.upi_id) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6">
        <p className="text-slate-500">
          This payment link is invalid or no longer available.
        </p>
      </main>
    );
  }

  const paid = p.status === "paid";
  const upiLink = buildUPILink(p.upi_id, p.amount, p.description, p.payee_name);
  const qrDataUrl = await QRCode.toDataURL(upiLink, {
    width: 240,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  const dueFormatted = new Date(p.due_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 p-5">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl">
        {/* Header with trust badge */}
        <div className="bg-brand-600 px-6 py-7 text-center text-white">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <p className="text-sm opacity-80">Verified payment request from</p>
          <p className="mt-1 text-lg font-semibold">{p.payee_name}</p>
          <p className="mt-4 text-4xl font-bold tracking-tight">
            {formatINR(p.amount)}
          </p>
          <p className="mt-1 text-sm opacity-90">{p.description}</p>
          <p className="mt-1 text-xs opacity-60">Due {dueFormatted}</p>
        </div>

        <div className="space-y-5 px-6 py-6">
          {paid ? (
            <div className="rounded-2xl bg-brand-50 py-4 text-center font-semibold text-brand-700">
              ✓ This bill is already marked as paid
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-slate-500">
                Hi {p.payer_name}, complete your payment below.
              </p>

              {/* UPI ID — for cross-checking */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-400">Paying to UPI ID</p>
                <p className="mt-0.5 font-semibold text-slate-800">{p.upi_id}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Verify this matches {p.payee_name}&apos;s UPI ID before paying
                </p>
              </div>

              <a
                href={upiLink}
                className="block w-full rounded-2xl bg-brand-600 py-3.5 text-center font-semibold text-white transition hover:bg-brand-700"
              >
                Pay {formatINR(p.amount)} via UPI
              </a>
              <p className="text-center text-xs text-slate-400">
                Opens GPay, PhonePe, Paytm or any UPI app
              </p>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">or scan to pay</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="UPI QR code"
                className="mx-auto h-44 w-44 rounded-xl border border-slate-200"
              />

              <CopyUpi upiId={p.upi_id} />

              {/* How does this work? */}
              <details className="group rounded-xl border border-slate-200">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-600 transition hover:text-slate-800">
                  🔒 How does this work?
                </summary>
                <div className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-500">
                  <p>
                    This is a standard UPI payment. When you tap &quot;Pay&quot;,
                    your UPI app opens with {p.payee_name}&apos;s details pre-filled.
                    You authorise the payment with your own PIN — nothing is charged automatically.
                  </p>
                  <p className="mt-2">
                    BillTrack does not store any card numbers, bank details,
                    or payment credentials. We only generate the UPI link to
                    make your payment easier.
                  </p>
                </div>
              </details>

              <div className="border-t border-slate-100 pt-4">
                <PaidButton
                  billId={id}
                  alreadyClaimed={!!p.payment_claimed_at}
                />
                <p className="mt-2 text-center text-xs text-slate-400">
                  Already paid? Tap above so {p.payee_name} knows.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Trust footer */}
        <div className="border-t border-slate-100 px-6 py-4 text-center">
          <p className="text-xs text-slate-400">
            Your payment goes directly to {p.payee_name} via UPI.
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            🛡️ Secured by BillTrack
          </p>
          <ShareAppButton />
        </div>
      </div>
    </main>
  );
}
