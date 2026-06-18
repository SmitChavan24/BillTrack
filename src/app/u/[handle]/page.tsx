import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { PERSONAS, type PersonaKey } from "@/lib/personas";
import PublicPayClient from "@/components/PublicPayClient";
import CopyUpi from "@/components/CopyUpi";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.billtrack.me";

type PublicProfile = {
  handle: string;
  full_name: string | null;
  upi_id: string | null;
  primary_persona: string | null;
};

async function getProfile(handle: string): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_profile", { p_handle: handle });
  return (data?.[0] as PublicProfile) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProfile(handle);
  if (!p) {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }
  const name = p.full_name || p.handle;
  const title = `Pay ${name} via UPI`;
  const description = `Send a secure UPI payment to ${name} on BillTrack — no app, no fees. Open the page and pay in one tap.`;
  return {
    title,
    description,
    alternates: { canonical: `/u/${p.handle}` },
    openGraph: {
      title: `${title} · BillTrack`,
      description,
      url: `${SITE_URL}/u/${p.handle}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · BillTrack`,
      description,
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const p = await getProfile(handle);
  if (!p) notFound();

  const name = p.full_name || p.handle;
  const personaLabel = p.primary_persona
    ? PERSONAS[p.primary_persona as PersonaKey]?.label
    : null;

  const qrDataUrl = p.upi_id
    ? await QRCode.toDataURL(
        `upi://pay?pa=${encodeURIComponent(p.upi_id)}&pn=${encodeURIComponent(name)}&cu=INR`,
        { width: 240, margin: 1, color: { dark: "#0f172a", light: "#ffffff" } },
      )
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    url: `${SITE_URL}/u/${p.handle}`,
    paymentAccepted: "UPI",
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 p-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl">
        {/* Header */}
        <div className="bg-brand-600 px-6 py-7 text-center text-white">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm opacity-80">Pay securely via UPI</p>
          <p className="mt-1 text-lg font-semibold">{name}</p>
          {personaLabel && (
            <p className="mt-0.5 text-xs opacity-70">{personaLabel}</p>
          )}
        </div>

        <div className="space-y-5 px-6 py-6">
          {p.upi_id ? (
            <>
              <PublicPayClient upiId={p.upi_id} payeeName={name} />

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">or scan to pay</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl!}
                alt={`UPI QR code for ${name}`}
                className="mx-auto h-44 w-44 rounded-xl border border-slate-200"
              />

              <CopyUpi upiId={p.upi_id} />
            </>
          ) : (
            <p className="rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
              {name} hasn&apos;t set up payments yet.
            </p>
          )}

          {/* Viral CTA — the payer is a potential user */}
          <Link
            href="/signup"
            className="block rounded-2xl bg-brand-50 px-4 py-4 text-center ring-1 ring-brand-100 transition hover:bg-brand-100"
          >
            <p className="text-sm font-semibold text-brand-700">
              Want a page like this?
            </p>
            <p className="mt-0.5 text-xs text-brand-600/80">
              Collect payments &amp; send WhatsApp reminders — free. Create yours
              in a minute →
            </p>
          </Link>
        </div>

        {/* Trust footer */}
        <div className="border-t border-slate-100 px-6 py-4 text-center">
          <p className="text-xs font-medium text-slate-500">
            🛡️ Secured by BillTrack
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Payments go directly to {name} via UPI.
          </p>
        </div>
      </div>
    </main>
  );
}
