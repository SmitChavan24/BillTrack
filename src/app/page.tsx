import type { Metadata } from "next";
import Link from "next/link";
import { FREE_BILL_LIMIT, PRO_PRICE, UPGRADE_URL } from "@/lib/plan";

export const metadata: Metadata = {
  title: "BillTrack — WhatsApp Payment Reminders & UPI Pay Links",
  description:
    "Send free payment reminders on WhatsApp and collect money instantly with UPI. Built for landlords, shopkeepers, tutors and freelancers in India. Free plan, no app to install.",
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    icon: "💬",
    title: "WhatsApp reminders",
    body: "Send polite, ready-made payment reminders from your own number. Each persona gets a professional message — no awkward follow-ups.",
  },
  {
    icon: "📲",
    title: "UPI pay links",
    body: "Your customer taps once and pays with GPay, PhonePe, Paytm or any UPI app. The money lands straight in your account.",
  },
  {
    icon: "🧾",
    title: "Track every bill",
    body: "See what's pending, overdue and collected at a glance. Mark bills paid and know exactly who still owes you.",
  },
  {
    icon: "🆓",
    title: "Free plan, no install",
    body: "Works right in your browser, on any phone. Start free with up to 10 active bills. No card, no setup fees.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Add a bill",
    body: "Enter who owes you, how much, and when it's due.",
  },
  {
    n: "2",
    title: "Send on WhatsApp",
    body: "Tap to open WhatsApp with a polished reminder and a secure UPI pay link.",
  },
  {
    n: "3",
    title: "Get paid",
    body: "Your customer pays over UPI in one tap. Mark it paid and move on.",
  },
];

const PERSONAS = [
  { label: "Landlords", slug: "rent-payment-reminders" },
  { label: "PG owners", slug: "pg-hostel-fee-reminders" },
  { label: "Wholesalers", slug: "wholesale-supplier-payment-reminders" },
  { label: "Retailers", slug: "shop-udhaar-credit-reminders" },
  { label: "Contractors", slug: "contractor-payment-reminders" },
  { label: "Freelancers", slug: "freelancer-invoice-reminders" },
  { label: "Tutors", slug: "tuition-coaching-fee-reminders" },
  { label: "Service professionals", slug: "service-business-payment-reminders" },
];

const FAQS = [
  {
    q: "Is BillTrack free?",
    a: "Yes. The Free plan includes WhatsApp reminders, UPI pay links and up to 10 active (unpaid) bills at a time. For unlimited bills and customers, upgrade to BillTrack Pro for ₹199/month. BillTrack never takes a commission on the payments you collect.",
  },
  {
    q: "How do I pay for BillTrack Pro?",
    a: "Upgrade at pay.billtrack.me using the email address of your BillTrack account. Payments are processed securely by Razorpay (UPI, cards, netbanking, wallets). Pro is activated on your account within 24 hours and does not renew automatically. Larger businesses can contact us for custom pricing.",
  },
  {
    q: "Do my customers need to install anything?",
    a: "No. They receive a normal WhatsApp message with a secure link. Tapping it opens any UPI app they already use — GPay, PhonePe, Paytm and more.",
  },
  {
    q: "How does the money reach me?",
    a: "Payments go directly to your own UPI ID. BillTrack never holds your money and never stores any bank or card details.",
  },
  {
    q: "Who is BillTrack for?",
    a: "Anyone who collects recurring or one-off payments — landlords, PG owners, shopkeepers, wholesalers, tutors, freelancers, contractors and service professionals.",
  },
];

export default function Home() {
  // Signed-in visitors are redirected to /dashboard by middleware, so this page
  // stays a static, CDN-cacheable marketing page for crawlers and logged-out users.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "BillTrack",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web, Android, iOS",
        description:
          "Send free payment reminders on WhatsApp and collect money instantly with UPI pay links.",
        offers: [
          { "@type": "Offer", name: "Free", price: "0", priceCurrency: "INR" },
          { "@type": "Offer", name: "Pro", price: "199", priceCurrency: "INR", url: UPGRADE_URL },
        ],
        url: "https://www.billtrack.me",
      },
      {
        "@type": "Organization",
        name: "BillTrack",
        url: "https://www.billtrack.me",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
            ₹
          </span>
          <span className="font-bold tracking-tight">BillTrack</span>
        </div>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <a href="#pricing" className="text-slate-600 hover:text-slate-900">
            Pricing
          </a>
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
          >
            Get started free
          </Link>
        </nav>
      </header>

      <main>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-12 pt-10 text-center lg:pt-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-600">
          Free plan for small businesses in India
        </p>
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Send payment reminders on WhatsApp. Get paid faster over UPI.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 lg:text-lg">
          BillTrack helps landlords, shopkeepers, tutors and freelancers chase
          payments without the awkward follow-ups — polite WhatsApp reminders and
          one-tap UPI pay links. Start free.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700 sm:w-auto"
          >
            Create your free account
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl border border-slate-200 px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          No card required · No app to install · Works on any phone
        </p>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Everything you need to collect payments
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="text-2xl" aria-hidden>
                  {f.icon}
                </div>
                <h3 className="mt-3 font-semibold text-slate-800">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            How BillTrack works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
                  {s.n}
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">{s.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      {/* Personas */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Built for the way you do business
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Whatever you collect — rent, fees, dues or invoices — BillTrack
            speaks your customer&apos;s language.
          </p>
          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {PERSONAS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  className="inline-block rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-800">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Start collecting payments the easy way
          </h2>
          <p className="mt-3 text-white/85">
            It&apos;s free, takes under a minute, and your customers will thank
            you for it.
          </p>
          <Link
            href="/signup"
            className="mt-7 inline-block rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Create your free account
          </Link>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
              ₹
            </span>
            <span className="font-semibold text-slate-700">BillTrack</span>
          </div>
          <p>© {new Date().getFullYear()} BillTrack · Made in India 🇮🇳</p>
          <div className="flex gap-4">
            <a href="#pricing" className="hover:text-slate-800">
              Pricing
            </a>
            <a href={`${UPGRADE_URL}/terms`} className="hover:text-slate-800">
              Terms
            </a>
            <a href={`${UPGRADE_URL}/privacy`} className="hover:text-slate-800">
              Privacy
            </a>
            <a href={`${UPGRADE_URL}/refunds`} className="hover:text-slate-800">
              Refunds
            </a>
            <a href={`${UPGRADE_URL}/contact`} className="hover:text-slate-800">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-14">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Simple pricing
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Start free. Upgrade when you have more customers to track.
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800">Free</h3>
            <p className="mt-2 text-3xl font-bold tracking-tight">₹0</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
              <li>✓ WhatsApp payment reminders</li>
              <li>✓ UPI pay links and public pay page</li>
              <li>✓ Track pending, overdue and paid bills</li>
              <li>✓ Up to {FREE_BILL_LIMIT} active bills at a time</li>
            </ul>
            <Link
              href="/signup"
              className="mt-6 rounded-xl border border-slate-200 px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Create your free account
            </Link>
          </div>
          <div className="flex flex-col rounded-2xl border-2 border-brand-600 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-brand-700">Pro</h3>
            <p className="mt-2 text-3xl font-bold tracking-tight">
              ₹{PRO_PRICE}
              <span className="text-base font-normal text-slate-500"> / month</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
              <li>✓ Everything in Free</li>
              <li>
                ✓ <strong>Unlimited bills and customers</strong>
              </li>
              <li>✓ Paid month by month, no automatic renewal</li>
              <li>✓ Custom pricing for larger businesses</li>
            </ul>
            <a
              href={UPGRADE_URL}
              className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-brand-700"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
