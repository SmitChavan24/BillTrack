import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/bills";
import ShareAppButton from "@/components/ShareAppButton";
import ReceiptActions from "@/components/ReceiptActions";
import GetBillTrackCTA from "@/components/GetBillTrackCTA";

export const dynamic = "force-dynamic";

type Payment = {
  payer_name: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  payee_name: string;
  payment_claimed_at: string | null;
  created_at?: string;
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
  // Private financial document — never index, but keep OG tags for WhatsApp previews.
  const noindex = { index: false, follow: false } as const;
  if (!p) return { title: "Receipt", robots: noindex };

  const title = `Receipt for ${formatINR(p.amount)} from ${p.payee_name}`;
  const description = `Official receipt for ${p.description}.`;
  return {
    title,
    description,
    robots: noindex,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ReceiptByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPayment(id);

  if (!p) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6">
        <p className="text-slate-500">
          This receipt is invalid or no longer available.
        </p>
      </main>
    );
  }

  const dateFormatted = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 p-5 print:bg-white print:p-0">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl print:shadow-none print:rounded-none">
        
        {/* Header - Success */}
        <div className="bg-brand-600 px-6 py-8 text-center text-white print:bg-white print:text-slate-900 print:border-b print:border-slate-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-600 print:bg-brand-50">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-xl font-bold tracking-tight">Payment Successful</p>
          <p className="mt-1 text-sm opacity-90 print:text-slate-500">{dateFormatted}</p>
        </div>

        {/* Receipt Details */}
        <div className="px-6 py-6 space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500">Amount Paid</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-slate-800">
              {formatINR(p.amount)}
            </p>
          </div>

          <div className="space-y-4 rounded-2xl bg-slate-50 p-4 print:bg-transparent print:p-0">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Paid to</span>
              <span className="font-semibold text-slate-800 text-right">{p.payee_name}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Paid by</span>
              <span className="font-semibold text-slate-800 text-right">{p.payer_name}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">For</span>
              <span className="font-semibold text-slate-800 text-right">{p.description}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Receipt ID</span>
              <span className="font-mono text-xs text-slate-500 break-all text-right">{id.split('-')[0].toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Receipt actions (Hidden in Print Mode) */}
        <div className="px-6 pb-6 print:hidden">
          <ReceiptActions
            receiptUrl={`https://www.billtrack.me/receipt/${id}`}
            payeeName={p.payee_name}
            amountLabel={formatINR(p.amount)}
          />
        </div>

        {/* Trust footer */}
        <div className="border-t border-slate-100 px-6 py-4 text-center print:hidden">
          <p className="text-xs text-slate-400">
            Official receipt generated by {p.payee_name}.
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            🛡️ Secured by BillTrack
          </p>
          <GetBillTrackCTA />
          <ShareAppButton />
        </div>
        
        {/* Print-only footer */}
        <div className="hidden print:block border-t border-slate-200 pt-6 mt-6 px-6 text-center text-xs text-slate-500">
          <p>Generated via BillTrack</p>
          <p>www.billtrack.me</p>
        </div>
      </div>
    </main>
  );
}
