import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PERSONAS } from "@/lib/personas";
import { USE_CASES, USE_CASE_SLUGS, getUseCase } from "@/lib/useCases";

const SITE_URL = "https://www.billtrack.me";

// Only the use-case slugs below are valid pages; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return USE_CASE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) return {};
  return {
    title: uc.seoTitle,
    description: uc.metaDescription,
    alternates: { canonical: `/${uc.slug}` },
    openGraph: {
      title: `${uc.seoTitle} · BillTrack`,
      description: uc.metaDescription,
      url: `${SITE_URL}/${uc.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${uc.seoTitle} · BillTrack`,
      description: uc.metaDescription,
    },
  };
}

const STEPS = [
  { n: "1", title: "Add the bill", body: "Enter who owes you, how much, and when it's due." },
  { n: "2", title: "Send the reminder", body: "Tap once to send a polished WhatsApp reminder from your own number." },
  { n: "3", title: "Get paid over UPI", body: "Your customer taps the link and pays instantly — straight to your account." },
];

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) notFound();

  const persona = PERSONAS[uc.persona];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: uc.seoTitle,
        description: uc.metaDescription,
        url: `${SITE_URL}/${uc.slug}`,
        isPartOf: { "@type": "WebSite", name: "BillTrack", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: uc.seoTitle, item: `${SITE_URL}/${uc.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: uc.faqs.map((f) => ({
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
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
            ₹
          </span>
          <span className="font-bold tracking-tight">BillTrack</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
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
            {uc.eyebrow}
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {uc.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 lg:text-lg">
            {uc.intro}
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

        {/* Benefits */}
        <section className="bg-slate-50 py-14">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="text-center text-2xl font-bold tracking-tight">
              Why {persona.label.toLowerCase()}s choose BillTrack
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {uc.benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-2xl" aria-hidden>
                    {b.icon}
                  </div>
                  <h3 className="mt-3 font-semibold text-slate-800">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="text-center text-2xl font-bold tracking-tight">
              How it works
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

        {/* Bill types */}
        <section className="bg-slate-50 py-14">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Made for what you collect
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              From your first {persona.payerTerm.toLowerCase()} to your hundredth,
              BillTrack handles every kind of {persona.billTerm.toLowerCase()}.
            </p>
            <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2.5">
              {persona.billTypes.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {t}
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
              {uc.faqs.map((f) => (
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
              {uc.ctaLine}
            </h2>
            <p className="mt-3 text-white/85">
              It&apos;s free, takes under a minute, and your{" "}
              {persona.payerTerm.toLowerCase()}s will thank you for it.
            </p>
            <Link
              href="/signup"
              className="mt-7 inline-block rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Create your free account
            </Link>
          </div>
        </section>

        {/* Related use cases — internal linking for SEO */}
        <section className="py-14">
          <div className="mx-auto max-w-5xl px-5 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              BillTrack works for every kind of business
            </h2>
            <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2.5">
              {USE_CASES.filter((o) => o.slug !== uc.slug).map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/${o.slug}`}
                    className="inline-block rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                  >
                    {PERSONAS[o.persona].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 text-sm text-slate-500 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
              ₹
            </span>
            <span className="font-semibold text-slate-700">BillTrack</span>
          </Link>
          <p>© {new Date().getFullYear()} BillTrack · Made in India 🇮🇳</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-slate-800">
              Sign in
            </Link>
            <Link href="/signup" className="hover:text-slate-800">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
