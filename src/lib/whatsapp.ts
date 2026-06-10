import { type PersonaKey } from "./personas";
import { formatINR } from "./bills";
import type { Bill } from "./types";

export function buildPayLink(baseUrl: string, billId: string) {
  return `${baseUrl.replace(/\/$/, "")}/pay/${billId}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Persona-specific opening + closing lines, wrapped around a shared, clean body.
const TONE: Record<PersonaKey, { open: string; close: string }> = {
  landlord: {
    open: "I hope you are doing well. This is a gentle reminder regarding your upcoming rent payment.",
    close: "Thank you for being a valued tenant.\nWarm regards,",
  },
  pg_owner: {
    open: "This is a friendly reminder regarding your monthly stay charges.",
    close: "Thank you for staying with us.\nRegards,",
  },
  wholesaler: {
    open: "This is a reminder regarding the pending payment for the goods supplied to you.",
    close: "We appreciate your prompt settlement and continued business.\nRegards,",
  },
  retailer: {
    open: "Greetings! This is a gentle reminder about the outstanding balance on your account with us.",
    close: "Thank you for your continued patronage.\nRegards,",
  },
  contractor: {
    open: "This is a reminder regarding the payment due for the work completed.",
    close: "We appreciate your timely payment.\nRegards,",
  },
  freelancer: {
    open: "I hope you're well. This is a friendly reminder for the payment of the invoice below.",
    close: "Thank you for working with me — I truly appreciate it.\nBest regards,",
  },
  tutor: {
    open: "This is a gentle reminder regarding the upcoming fee for the classes.",
    close: "Thank you for your continued support.\nWarm regards,",
  },
  service_pro: {
    open: "Thank you for choosing our services. This is a courteous reminder regarding your pending payment.",
    close: "We look forward to serving you again.\nRegards,",
  },
};

export function buildMessageText(
  bill: Bill,
  persona: PersonaKey,
  payeeName: string,
  baseUrl: string,
  upiId?: string,
) {
  const tone = TONE[persona];
  const payLink = buildPayLink(baseUrl, bill.id);
  const domain = baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const lines = [
    `Dear ${bill.payer_name},`,
    ``,
    tone.open,
    ``,
    `*Payment for:* ${bill.description}`,
    `*Amount:* ${formatINR(bill.amount)}`,
    `*Due date:* ${formatDate(bill.due_date)}`,
  ];

  if (upiId) {
    lines.push(`*UPI ID:* ${upiId}`);
  }

  lines.push(
    ``,
    `🔗 *Pay online:* ${payLink}`,
    ``,
    tone.close,
    payeeName,
    ``,
    `✅ Verified by BillTrack · ${domain}`,
  );

  return lines.join("\n");
}

// Full wa.me link — opens WhatsApp on the user's own phone with the message pre-filled.
export function buildWhatsAppLink(
  bill: Bill,
  persona: PersonaKey,
  payeeName: string,
  baseUrl: string,
  upiId?: string,
) {
  const text = buildMessageText(bill, persona, payeeName, baseUrl, upiId);
  const phone = bill.payer_phone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function buildReceiptLink(baseUrl: string, billId: string) {
  return `${baseUrl.replace(/\/$/, "")}/receipt/${billId}`;
}

export function buildReceiptMessageText(
  bill: Bill,
  payeeName: string,
  baseUrl: string,
) {
  const receiptLink = buildReceiptLink(baseUrl, bill.id);
  const domain = baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const lines = [
    `Dear ${bill.payer_name},`,
    ``,
    `We have successfully received your payment. Thank you!`,
    ``,
    `*Payment for:* ${bill.description}`,
    `*Amount paid:* ${formatINR(bill.amount)}`,
    `*Status:* ✅ Paid`,
    ``,
    `🔗 *View your official receipt:* ${receiptLink}`,
    ``,
    `Best regards,`,
    payeeName,
    ``,
    `✅ Verified by BillTrack · ${domain}`,
  ];

  return lines.join("\n");
}

export function buildWhatsAppReceiptLink(
  bill: Bill,
  payeeName: string,
  baseUrl: string,
) {
  const text = buildReceiptMessageText(bill, payeeName, baseUrl);
  const phone = bill.payer_phone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
