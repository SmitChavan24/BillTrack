import AuthForm from "@/components/AuthForm";

type Mode = "login" | "signup";

const BENEFITS = [
  {
    icon: "💬",
    title: "Reminders on WhatsApp",
    body: "Send polite, ready-made payment reminders from your own number — no awkward follow-ups.",
  },
  {
    icon: "📲",
    title: "Get paid via UPI",
    body: "Customers pay in one tap with GPay, PhonePe, Paytm or any UPI app. Money lands in your account.",
  },
  {
    icon: "🆓",
    title: "Free & nothing to install",
    body: "Works right in your browser. No app, no setup fees, no monthly charges.",
  },
];

export default function AuthScreen({ mode }: { mode: Mode }) {
  return (
    <main className="min-h-dvh lg:grid lg:grid-cols-2">
      {/* Left: brand + value proposition */}
      <section className="flex flex-col justify-between bg-brand-600 px-6 py-8 text-white lg:px-12 lg:py-12">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl font-bold">
              ₹
            </span>
            <span className="text-lg font-bold tracking-tight">BillTrack</span>
          </div>

          <h2 className="mt-8 text-2xl font-bold leading-snug tracking-tight lg:mt-12 lg:text-3xl">
            Get paid faster, without chasing your customers.
          </h2>
          <p className="mt-3 text-sm text-white/80 lg:text-base">
            BillTrack helps landlords, shopkeepers, tutors and freelancers send
            payment reminders on WhatsApp and collect money instantly over UPI.
          </p>

          <ul className="mt-8 space-y-4 lg:mt-10">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-3">
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-lg"
                >
                  {b.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{b.title}</p>
                  <p className="mt-0.5 text-sm text-white/75">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mx-auto mt-8 hidden w-full max-w-md text-xs text-white/60 lg:mx-0 lg:block">
          Trusted by small businesses across India · 100% free to use
        </p>
      </section>

      {/* Right: the form */}
      <section className="flex items-center justify-center px-6 py-10 lg:px-12">
        <AuthForm mode={mode} />
      </section>
    </main>
  );
}
