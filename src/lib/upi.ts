// Free UPI deep link — opens any UPI app (GPay, PhonePe, Paytm) on a phone.
export function buildUPILink(
  upiId: string,
  amount: number,
  note: string,
  payeeName = "BillTrack",
) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

// Branded, shareable payment page on our own domain. This is the link that goes
// into WhatsApp — it renders as a normal https preview and opens a clean
// "Pay ₹X to <name>" page (with a Pay button + QR), instead of a raw upi:// blob.
export function buildPayPageUrl(
  baseUrl: string,
  args: {
    upiId: string;
    payeeName: string;
    amount: number;
    note: string;
    payerName?: string;
  },
) {
  const params = new URLSearchParams({
    pa: args.upiId,
    pn: args.payeeName,
    am: String(args.amount),
    tn: args.note,
  });
  if (args.payerName) params.set("to", args.payerName);
  return `${baseUrl.replace(/\/$/, "")}/pay?${params.toString()}`;
}
