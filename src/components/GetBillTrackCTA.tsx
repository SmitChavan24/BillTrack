import Link from "next/link";

// Conversion CTA shown to the *payer* on public-facing pay & receipt pages.
// The payer is usually a small business too — this turns every transaction into
// a chance to recruit a new BillTrack user (the viral loop). Server component:
// it's a plain link, so it stays in the static/streamed payload.
export default function GetBillTrackCTA() {
  return (
    <Link
      href="/signup"
      className="mt-4 block rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-center transition hover:bg-brand-100"
    >
      <p className="text-sm font-semibold text-brand-700">
        Collect payments like this — free
      </p>
      <p className="mt-0.5 text-xs text-brand-600/80">
        Create your own BillTrack page in under a minute →
      </p>
    </Link>
  );
}
