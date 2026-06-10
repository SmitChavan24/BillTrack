import type { PersonaKey } from "./personas";

export interface UseCase {
  slug: string;
  persona: PersonaKey;
  /** Short SEO <title> — the "%s · BillTrack" template appends the brand. */
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  benefits: { icon: string; title: string; body: string }[];
  faqs: { q: string; a: string }[];
  ctaLine: string;
}

export const USE_CASES: UseCase[] = [
  {
    slug: "rent-payment-reminders",
    persona: "landlord",
    seoTitle: "Rent Payment Reminders on WhatsApp",
    metaDescription:
      "Send polite rent reminders to tenants on WhatsApp and collect rent instantly over UPI. Free rent reminder tool for landlords in India — no app, no fees.",
    eyebrow: "For landlords & property owners",
    h1: "Send rent reminders on WhatsApp. Collect rent over UPI.",
    intro:
      "Chasing tenants for rent every month is awkward. BillTrack sends a polite, professional rent reminder from your own WhatsApp number with a one-tap UPI pay link, so your tenant pays in seconds and the money lands straight in your bank account.",
    benefits: [
      {
        icon: "🏠",
        title: "Monthly rent on autopilot",
        body: "Set rent, maintenance and society dues once. Each month, send a ready-made reminder in a single tap — no more typing the same message.",
      },
      {
        icon: "💬",
        title: "Polite, professional tone",
        body: "Reminders are worded to keep your tenant relationship warm — firm enough to get paid, friendly enough to avoid friction.",
      },
      {
        icon: "📲",
        title: "One-tap UPI rent payment",
        body: "Your tenant taps the link and pays with GPay, PhonePe or Paytm. Rent reaches you directly — no gateway, no cut.",
      },
    ],
    faqs: [
      {
        q: "Is this rent reminder tool really free for landlords?",
        a: "Yes. Sending WhatsApp rent reminders and UPI pay links is completely free. There are no monthly charges and no commission on the rent you collect.",
      },
      {
        q: "Do my tenants need to install an app to pay rent?",
        a: "No. Your tenant just taps the link in WhatsApp, which opens their existing UPI app (GPay, PhonePe, Paytm) with your details pre-filled. Nothing to install.",
      },
      {
        q: "Can I track which tenants have paid rent?",
        a: "Yes. Your dashboard shows pending, overdue and collected rent at a glance, so you always know exactly who still owes you.",
      },
    ],
    ctaLine: "Start collecting rent the easy way",
  },
  {
    slug: "pg-hostel-fee-reminders",
    persona: "pg_owner",
    seoTitle: "PG & Hostel Fee Reminders on WhatsApp",
    metaDescription:
      "Collect monthly PG and hostel fees without chasing residents. Send WhatsApp reminders with UPI pay links — free for PG and hostel owners in India.",
    eyebrow: "For PG & hostel owners",
    h1: "Collect PG & hostel fees without chasing residents.",
    intro:
      "Running a PG or hostel means dozens of monthly payments to track — stay fees, meals, electricity, laundry. BillTrack lets you send each resident a friendly WhatsApp reminder with a UPI pay link, so fees come in on time without the monthly follow-up.",
    benefits: [
      {
        icon: "🛏️",
        title: "Every charge in one place",
        body: "Monthly stay, meals, electricity, laundry and deposits — track them all per resident and send reminders in seconds.",
      },
      {
        icon: "💬",
        title: "Friendly reminders that work",
        body: "A warm, professional message from your own number nudges residents to pay without making things awkward.",
      },
      {
        icon: "📲",
        title: "Instant UPI payment",
        body: "Residents pay in one tap from any UPI app. The money reaches your account directly — no platform fees.",
      },
    ],
    faqs: [
      {
        q: "Can I manage fees for many residents at once?",
        a: "Yes. Add each resident's recurring charges once, then send personalised WhatsApp reminders to everyone in just a few taps each month.",
      },
      {
        q: "Is there any fee on the money I collect?",
        a: "No. BillTrack is free and takes no commission. Residents pay you directly over UPI, so you keep 100% of every fee.",
      },
      {
        q: "Do residents need to be tech-savvy to pay?",
        a: "Not at all. They tap the link, their UPI app opens with your details filled in, and they confirm with their PIN. It works on any phone.",
      },
    ],
    ctaLine: "Start collecting PG fees the easy way",
  },
  {
    slug: "shop-udhaar-credit-reminders",
    persona: "retailer",
    seoTitle: "Shop Udhaar & Credit Reminders on WhatsApp",
    metaDescription:
      "Recover shop udhaar and credit balances faster. Send polite WhatsApp reminders with UPI pay links to customers — free khata reminder tool for shopkeepers.",
    eyebrow: "For shops & retailers",
    h1: "Recover shop udhaar with a polite WhatsApp nudge.",
    intro:
      "Every shopkeeper carries customer udhaar in a khata. BillTrack turns that khata into gentle WhatsApp reminders with a UPI pay link, so customers clear their credit balance from their phone — no awkward in-person asking, no money left on the books.",
    benefits: [
      {
        icon: "🧾",
        title: "Your khata, organised",
        body: "Track each customer's monthly account and credit balance digitally, and see exactly who owes you what.",
      },
      {
        icon: "💬",
        title: "Ask for money, politely",
        body: "Send a respectful reminder from your own number so you recover udhaar without straining the customer relationship.",
      },
      {
        icon: "📲",
        title: "Clear dues over UPI",
        body: "Customers tap the link and settle their balance instantly with any UPI app. The amount reaches you directly.",
      },
    ],
    faqs: [
      {
        q: "How does this help recover udhaar faster?",
        a: "A polite WhatsApp reminder with a ready-to-pay UPI link removes the friction. Customers can clear their balance in seconds instead of waiting for their next shop visit.",
      },
      {
        q: "Is the khata reminder tool free?",
        a: "Yes, completely free. There are no charges to send reminders and no commission on the money your customers pay you.",
      },
      {
        q: "Will my customers find the reminders pushy?",
        a: "No. The messages are worded to be courteous and professional, so you keep goodwill while still getting paid.",
      },
    ],
    ctaLine: "Start recovering udhaar the easy way",
  },
  {
    slug: "wholesale-supplier-payment-reminders",
    persona: "wholesaler",
    seoTitle: "Wholesale & Supplier Payment Reminders",
    metaDescription:
      "Get retailers to clear trade invoices on time. Send WhatsApp payment reminders with UPI links for bulk orders and credit — free for wholesalers and suppliers.",
    eyebrow: "For wholesalers & suppliers",
    h1: "Get retailers to clear trade invoices on time.",
    intro:
      "Supplying goods on credit means waiting on payments from dozens of retailers. BillTrack sends a clear, professional WhatsApp reminder for each trade invoice with a UPI pay link, so retailers settle bulk orders faster and your working capital keeps moving.",
    benefits: [
      {
        icon: "📦",
        title: "Track every trade invoice",
        body: "Bulk orders, restocking and credit notes — keep tabs on what each retailer owes and when it's due.",
      },
      {
        icon: "💬",
        title: "Professional follow-ups",
        body: "Send a businesslike reminder that protects the relationship while making it clear payment is due.",
      },
      {
        icon: "📲",
        title: "Faster settlement over UPI",
        body: "Retailers pay invoices in one tap. Funds land straight in your account — no gateway fees eating your margins.",
      },
    ],
    faqs: [
      {
        q: "Can I send reminders for large invoice amounts?",
        a: "Yes. UPI pay links work for your trade invoices, and the reminder clearly shows the amount, description and due date so there's no confusion.",
      },
      {
        q: "Does BillTrack take a commission on payments?",
        a: "No. Retailers pay you directly over UPI. BillTrack is free and never takes a cut, so your margins stay intact.",
      },
      {
        q: "Can I track outstanding payments from many retailers?",
        a: "Yes. The dashboard shows pending, overdue and collected invoices at a glance, so you can prioritise follow-ups.",
      },
    ],
    ctaLine: "Start collecting trade payments the easy way",
  },
  {
    slug: "contractor-payment-reminders",
    persona: "contractor",
    seoTitle: "Contractor & Vendor Payment Reminders",
    metaDescription:
      "Collect advances, milestone payments and final dues from clients. Send WhatsApp reminders with UPI pay links — free payment tool for contractors and vendors.",
    eyebrow: "For contractors & vendors",
    h1: "Get paid for every milestone, on time.",
    intro:
      "Project work means money spread across advances, milestones and a final payment. BillTrack helps you send a professional WhatsApp reminder for each stage with a UPI pay link, so clients release payments on schedule and your cash flow stays healthy.",
    benefits: [
      {
        icon: "🏗️",
        title: "Bill by milestone",
        body: "Advance, milestone payments, material costs and final settlement — track each stage of the job separately.",
      },
      {
        icon: "💬",
        title: "Clear, professional reminders",
        body: "A well-worded message keeps things businesslike and reminds the client exactly what's due and why.",
      },
      {
        icon: "📲",
        title: "One-tap UPI payment",
        body: "Clients pay each stage instantly from their UPI app, and the money reaches you directly with no fees.",
      },
    ],
    faqs: [
      {
        q: "Can I track payments across project stages?",
        a: "Yes. Create a separate bill for each advance, milestone and final payment, and see at a glance which stages are paid and which are pending.",
      },
      {
        q: "Is the payment reminder tool free for contractors?",
        a: "Yes. Sending reminders and UPI pay links is completely free, and there's no commission on the payments you receive.",
      },
      {
        q: "How do clients pay me?",
        a: "They tap the UPI link in your WhatsApp message, their payment app opens with your details pre-filled, and they pay in seconds — directly to your account.",
      },
    ],
    ctaLine: "Start collecting project payments the easy way",
  },
  {
    slug: "freelancer-invoice-reminders",
    persona: "freelancer",
    seoTitle: "Freelancer Invoice Reminders on WhatsApp",
    metaDescription:
      "Stop chasing clients for invoices. Send polite WhatsApp payment reminders with UPI pay links and get paid faster — free invoice reminder tool for freelancers.",
    eyebrow: "For freelancers",
    h1: "Stop chasing clients. Get your invoices paid faster.",
    intro:
      "Following up on unpaid invoices is the worst part of freelancing. BillTrack sends a friendly, professional WhatsApp reminder with a UPI pay link, so your client pays in one tap — and you get back to the work you actually enjoy.",
    benefits: [
      {
        icon: "🧾",
        title: "Invoices & retainers tracked",
        body: "Project invoices, retainers, milestone payments and revision fees — keep every client's dues in one place.",
      },
      {
        icon: "💬",
        title: "Polite nudges that get paid",
        body: "Send a warm, professional reminder from your own number that gets results without sounding desperate.",
      },
      {
        icon: "📲",
        title: "Instant UPI payment",
        body: "Clients pay your invoice in one tap from any UPI app. The money reaches you directly — you keep 100%.",
      },
    ],
    faqs: [
      {
        q: "How does this help me get paid faster?",
        a: "A friendly WhatsApp reminder with a ready-to-pay UPI link removes every excuse and step, so clients pay your invoice in seconds rather than weeks.",
      },
      {
        q: "Is it free for freelancers?",
        a: "Yes. BillTrack is free to use and takes no commission. Clients pay you directly over UPI, so the full invoice amount is yours.",
      },
      {
        q: "Can I send reminders for retainer or recurring work?",
        a: "Yes. You can track retainers and recurring invoices and send a reminder each cycle in just a couple of taps.",
      },
    ],
    ctaLine: "Start getting invoices paid the easy way",
  },
  {
    slug: "tuition-coaching-fee-reminders",
    persona: "tutor",
    seoTitle: "Tuition & Coaching Fee Reminders on WhatsApp",
    metaDescription:
      "Collect monthly tuition and coaching fees without awkward follow-ups. Send WhatsApp reminders with UPI pay links — free fee reminder tool for tutors and coaches.",
    eyebrow: "For tutors & coaches",
    h1: "Collect tuition fees without the awkward follow-up.",
    intro:
      "Reminding parents and students about fees every month is uncomfortable. BillTrack sends a polite WhatsApp reminder with a UPI pay link, so course and batch fees come in on time while you focus on teaching, not collecting.",
    benefits: [
      {
        icon: "📚",
        title: "Every batch & student tracked",
        body: "Monthly fees, course fees, workshop and batch fees — track who has paid across all your students.",
      },
      {
        icon: "💬",
        title: "Gentle fee reminders",
        body: "A warm, respectful message to parents or students gets the fee paid without any awkwardness.",
      },
      {
        icon: "📲",
        title: "One-tap UPI fee payment",
        body: "Parents pay in seconds from any UPI app, and the fee reaches your account directly with no charges.",
      },
    ],
    faqs: [
      {
        q: "Can I collect fees from many students each month?",
        a: "Yes. Set each student's monthly or batch fee once, then send WhatsApp reminders to everyone in a few taps every cycle.",
      },
      {
        q: "Is the fee reminder tool free for tutors?",
        a: "Yes, completely free. There are no charges to send reminders and no commission on the fees you collect.",
      },
      {
        q: "Do parents need a special app to pay the fee?",
        a: "No. Parents tap the link, their existing UPI app opens with your details pre-filled, and they pay with their PIN. It works on any phone.",
      },
    ],
    ctaLine: "Start collecting fees the easy way",
  },
  {
    slug: "service-business-payment-reminders",
    persona: "service_pro",
    seoTitle: "Service Business Payment Reminders",
    metaDescription:
      "Collect consultation fees, service charges and repair bills on time. Send WhatsApp reminders with UPI pay links — free payment tool for service professionals.",
    eyebrow: "For service professionals",
    h1: "Get paid for every service, without the chase.",
    intro:
      "Whether you bill consultation fees, service charges or repair bills, getting paid shouldn't be a hassle. BillTrack sends your customer a professional WhatsApp reminder with a UPI pay link, so they pay on the spot and you move on to the next job.",
    benefits: [
      {
        icon: "🛠️",
        title: "Every service billed",
        body: "Consultation fees, service charges, subscriptions and repair bills — track what each customer owes in one place.",
      },
      {
        icon: "💬",
        title: "Courteous reminders",
        body: "Send a polished, professional reminder from your own number that gets you paid while keeping customers happy.",
      },
      {
        icon: "📲",
        title: "Instant UPI payment",
        body: "Customers pay in one tap from any UPI app. The money reaches you directly — no gateway, no commission.",
      },
    ],
    faqs: [
      {
        q: "Can I send reminders for repeat or subscription services?",
        a: "Yes. You can track monthly subscriptions and recurring services and send a reminder each cycle in just a couple of taps.",
      },
      {
        q: "Is BillTrack free for service professionals?",
        a: "Yes. Sending reminders and UPI pay links is free, and there's no commission on the payments your customers make.",
      },
      {
        q: "How do customers pay me?",
        a: "They tap the UPI link in your WhatsApp message, their payment app opens with your details pre-filled, and they pay in seconds — straight to your account.",
      },
    ],
    ctaLine: "Start collecting service payments the easy way",
  },
];

export const USE_CASE_SLUGS = USE_CASES.map((u) => u.slug);

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
