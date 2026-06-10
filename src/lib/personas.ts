type RepeatInterval = "none" | "weekly" | "monthly" | "quarterly" | "yearly";

export const PERSONAS = {
  landlord: {
    label: "Landlord",
    billTerm: "Rent",
    payerTerm: "Tenant",
    color: "blue",
    group: "Property",
    billTypes: ["Rent", "Maintenance", "Society dues", "Advance", "Deposit"],
    defaultRepeat: "monthly" as RepeatInterval,
  },
  pg_owner: {
    label: "PG / Hostel owner",
    billTerm: "Stay fee",
    payerTerm: "Resident",
    color: "purple",
    group: "Property",
    billTypes: ["Monthly stay", "Meals", "Electricity", "Laundry", "Security deposit"],
    defaultRepeat: "monthly" as RepeatInterval,
  },
  wholesaler: {
    label: "Wholesaler / Supplier",
    billTerm: "Trade invoice",
    payerTerm: "Retailer",
    color: "teal",
    group: "Trade & supply",
    billTypes: ["Trade invoice", "Bulk order", "Restocking order", "Credit note"],
    defaultRepeat: "none" as RepeatInterval,
  },
  retailer: {
    label: "Shop / Retailer",
    billTerm: "Monthly tab",
    payerTerm: "Customer",
    color: "amber",
    group: "Trade & supply",
    billTypes: ["Monthly account", "Credit balance", "Product order"],
    defaultRepeat: "monthly" as RepeatInterval,
  },
  contractor: {
    label: "Contractor / Vendor",
    billTerm: "Work order",
    payerTerm: "Client",
    color: "rose",
    group: "Trade & supply",
    billTypes: ["Advance payment", "Milestone 1", "Milestone 2", "Final payment", "Material cost"],
    defaultRepeat: "none" as RepeatInterval,
  },
  freelancer: {
    label: "Freelancer",
    billTerm: "Invoice",
    payerTerm: "Client",
    color: "pink",
    group: "Services & freelance",
    billTypes: ["Project invoice", "Retainer", "Milestone payment", "Revision fee"],
    defaultRepeat: "none" as RepeatInterval,
  },
  tutor: {
    label: "Tutor / Coach",
    billTerm: "Course fee",
    payerTerm: "Student",
    color: "green",
    group: "Services & freelance",
    billTypes: ["Monthly fee", "Course fee", "Workshop fee", "Batch fee"],
    defaultRepeat: "monthly" as RepeatInterval,
  },
  service_pro: {
    label: "Service professional",
    billTerm: "Service fee",
    payerTerm: "Customer",
    color: "slate",
    group: "Services & freelance",
    billTypes: ["Consultation fee", "Service charge", "Monthly subscription", "Repair bill"],
    defaultRepeat: "none" as RepeatInterval,
  },
} as const;

export type PersonaKey = keyof typeof PERSONAS;

export const PERSONA_KEYS = Object.keys(PERSONAS) as PersonaKey[];

export const PERSONA_GROUPS = PERSONA_KEYS.reduce<Record<string, PersonaKey[]>>(
  (acc, key) => {
    const group = PERSONAS[key].group;
    (acc[group] ??= []).push(key);
    return acc;
  },
  {},
);

// Tailwind classes keyed by persona color (kept static so Tailwind picks them up).
export const PERSONA_BADGE: Record<PersonaKey, string> = {
  landlord: "bg-blue-100 text-blue-700 ring-blue-200",
  pg_owner: "bg-purple-100 text-purple-700 ring-purple-200",
  wholesaler: "bg-teal-100 text-teal-700 ring-teal-200",
  retailer: "bg-amber-100 text-amber-700 ring-amber-200",
  contractor: "bg-rose-100 text-rose-700 ring-rose-200",
  freelancer: "bg-pink-100 text-pink-700 ring-pink-200",
  tutor: "bg-green-100 text-green-700 ring-green-200",
  service_pro: "bg-slate-100 text-slate-700 ring-slate-200",
};
