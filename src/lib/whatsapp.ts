import { type PersonaKey } from "./personas";
import { formatINR } from "./bills";
import type { Bill, Language } from "./types";

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

// Shared chrome (greeting, field labels, sign-off) per language. The English
// copy is kept identical to the original so `en` output is byte-for-byte the
// same as before this file was localized.
const LABELS: Record<
  Language,
  {
    greeting: string;
    paymentFor: string;
    amount: string;
    dueDate: string;
    upiId: string;
    payOnline: string;
    verified: string;
    receivedThanks: string;
    amountPaid: string;
    status: string;
    paidValue: string;
    viewReceipt: string;
    bestRegards: string;
  }
> = {
  en: {
    greeting: "Dear",
    paymentFor: "*Payment for:*",
    amount: "*Amount:*",
    dueDate: "*Due date:*",
    upiId: "*UPI ID:*",
    payOnline: "🔗 *Pay online:*",
    verified: "✅ Verified by BillTrack",
    receivedThanks: "We have successfully received your payment. Thank you!",
    amountPaid: "*Amount paid:*",
    status: "*Status:*",
    paidValue: "✅ Paid",
    viewReceipt: "🔗 *View your official receipt:*",
    bestRegards: "Best regards,",
  },
  hi: {
    greeting: "प्रिय",
    paymentFor: "*भुगतान किसके लिए:*",
    amount: "*राशि:*",
    dueDate: "*देय तिथि:*",
    upiId: "*UPI ID:*",
    payOnline: "🔗 *ऑनलाइन भुगतान करें:*",
    verified: "✅ BillTrack द्वारा सत्यापित",
    receivedThanks: "हमें आपका भुगतान सफलतापूर्वक प्राप्त हो गया है। धन्यवाद!",
    amountPaid: "*भुगतान की गई राशि:*",
    status: "*स्थिति:*",
    paidValue: "✅ भुगतान प्राप्त",
    viewReceipt: "🔗 *अपनी आधिकारिक रसीद देखें:*",
    bestRegards: "सादर,",
  },
  hinglish: {
    greeting: "Namaste",
    paymentFor: "*Payment kiske liye:*",
    amount: "*Amount:*",
    dueDate: "*Due date:*",
    upiId: "*UPI ID:*",
    payOnline: "🔗 *Online pay karein:*",
    verified: "✅ BillTrack se verified",
    receivedThanks: "Aapka payment hamein successfully mil gaya hai. Dhanyavaad!",
    amountPaid: "*Amount paid:*",
    status: "*Status:*",
    paidValue: "✅ Paid",
    viewReceipt: "🔗 *Apni receipt dekhein:*",
    bestRegards: "Dhanyavaad,",
  },
};

// Persona-specific opening + closing lines, per language.
const TONE: Record<
  PersonaKey,
  Record<Language, { open: string; close: string }>
> = {
  landlord: {
    en: {
      open: "I hope you are doing well. This is a gentle reminder regarding your upcoming rent payment.",
      close: "Thank you for being a valued tenant.\nWarm regards,",
    },
    hi: {
      open: "आशा है आप सकुशल होंगे। यह आपके आगामी किराए के भुगतान के लिए एक विनम्र अनुस्मारक है।",
      close: "एक अच्छे किरायेदार होने के लिए धन्यवाद।\nसादर,",
    },
    hinglish: {
      open: "Aasha hai aap theek honge. Yeh aapke aane wale rent payment ke liye ek vinamra reminder hai.",
      close: "Acche kirayedar hone ke liye dhanyavaad.\nSadar,",
    },
  },
  pg_owner: {
    en: {
      open: "This is a friendly reminder regarding your monthly stay charges.",
      close: "Thank you for staying with us.\nRegards,",
    },
    hi: {
      open: "यह आपके मासिक ठहरने के शुल्क के लिए एक मित्रवत अनुस्मारक है।",
      close: "हमारे साथ ठहरने के लिए धन्यवाद।\nसादर,",
    },
    hinglish: {
      open: "Yeh aapke monthly stay charges ke liye ek friendly reminder hai.",
      close: "Hamare saath rehne ke liye dhanyavaad.\nSadar,",
    },
  },
  wholesaler: {
    en: {
      open: "This is a reminder regarding the pending payment for the goods supplied to you.",
      close: "We appreciate your prompt settlement and continued business.\nRegards,",
    },
    hi: {
      open: "यह आपको आपूर्ति किए गए माल के लंबित भुगतान के संबंध में एक अनुस्मारक है।",
      close: "समय पर भुगतान और निरंतर व्यापार के लिए धन्यवाद।\nसादर,",
    },
    hinglish: {
      open: "Yeh aapko supply kiye gaye maal ke pending payment ke baare mein reminder hai.",
      close: "Time par payment aur continued business ke liye dhanyavaad.\nSadar,",
    },
  },
  retailer: {
    en: {
      open: "Greetings! This is a gentle reminder about the outstanding balance on your account with us.",
      close: "Thank you for your continued patronage.\nRegards,",
    },
    hi: {
      open: "नमस्ते! यह आपके खाते पर बकाया राशि के संबंध में एक विनम्र अनुस्मारक है।",
      close: "आपके निरंतर संरक्षण के लिए धन्यवाद।\nसादर,",
    },
    hinglish: {
      open: "Namaste! Yeh aapke account par baaki udhaar ke baare mein ek vinamra reminder hai.",
      close: "Aapke continued support ke liye dhanyavaad.\nSadar,",
    },
  },
  contractor: {
    en: {
      open: "This is a reminder regarding the payment due for the work completed.",
      close: "We appreciate your timely payment.\nRegards,",
    },
    hi: {
      open: "यह पूर्ण किए गए कार्य के लिए देय भुगतान के संबंध में एक अनुस्मारक है।",
      close: "समय पर भुगतान के लिए धन्यवाद।\nसादर,",
    },
    hinglish: {
      open: "Yeh complete kiye gaye kaam ke due payment ke liye reminder hai.",
      close: "Time par payment ke liye dhanyavaad.\nSadar,",
    },
  },
  freelancer: {
    en: {
      open: "I hope you're well. This is a friendly reminder for the payment of the invoice below.",
      close: "Thank you for working with me — I truly appreciate it.\nBest regards,",
    },
    hi: {
      open: "आशा है आप अच्छे होंगे। यह नीचे दिए गए इनवॉइस के भुगतान के लिए एक मित्रवत अनुस्मारक है।",
      close: "मेरे साथ काम करने के लिए धन्यवाद — मैं वास्तव में इसकी सराहना करता हूँ।\nसादर,",
    },
    hinglish: {
      open: "Aasha hai aap acche honge. Yeh neeche diye gaye invoice ke payment ke liye ek friendly reminder hai.",
      close: "Mere saath kaam karne ke liye dhanyavaad — main iski sachchi kadar karta hoon.\nSadar,",
    },
  },
  tutor: {
    en: {
      open: "This is a gentle reminder regarding the upcoming fee for the classes.",
      close: "Thank you for your continued support.\nWarm regards,",
    },
    hi: {
      open: "यह कक्षाओं के आगामी शुल्क के संबंध में एक विनम्र अनुस्मारक है।",
      close: "आपके निरंतर सहयोग के लिए धन्यवाद।\nसादर,",
    },
    hinglish: {
      open: "Yeh classes ki aane wali fees ke liye ek vinamra reminder hai.",
      close: "Aapke continued support ke liye dhanyavaad.\nSadar,",
    },
  },
  service_pro: {
    en: {
      open: "Thank you for choosing our services. This is a courteous reminder regarding your pending payment.",
      close: "We look forward to serving you again.\nRegards,",
    },
    hi: {
      open: "हमारी सेवाएँ चुनने के लिए धन्यवाद। यह आपके लंबित भुगतान के संबंध में एक विनम्र अनुस्मारक है।",
      close: "हम फिर से आपकी सेवा के लिए तत्पर हैं।\nसादर,",
    },
    hinglish: {
      open: "Hamari service choose karne ke liye dhanyavaad. Yeh aapke pending payment ke liye ek vinamra reminder hai.",
      close: "Hum dobara aapki seva ke liye tatpar hain.\nSadar,",
    },
  },
};

export function buildMessageText(
  bill: Bill,
  persona: PersonaKey,
  payeeName: string,
  baseUrl: string,
  upiId?: string,
  lang: Language = "en",
) {
  const tone = TONE[persona][lang];
  const L = LABELS[lang];
  const payLink = buildPayLink(baseUrl, bill.id);
  const domain = baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const lines = [
    `${L.greeting} ${bill.payer_name},`,
    ``,
    tone.open,
    ``,
    `${L.paymentFor} ${bill.description}`,
    `${L.amount} ${formatINR(bill.amount)}`,
    `${L.dueDate} ${formatDate(bill.due_date)}`,
  ];

  if (upiId) {
    lines.push(`${L.upiId} ${upiId}`);
  }

  lines.push(
    ``,
    `${L.payOnline} ${payLink}`,
    ``,
    tone.close,
    payeeName,
    ``,
    `${L.verified} · ${domain}`,
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
  lang: Language = "en",
) {
  const text = buildMessageText(bill, persona, payeeName, baseUrl, upiId, lang);
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
  lang: Language = "en",
) {
  const L = LABELS[lang];
  const receiptLink = buildReceiptLink(baseUrl, bill.id);
  const domain = baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const lines = [
    `${L.greeting} ${bill.payer_name},`,
    ``,
    L.receivedThanks,
    ``,
    `${L.paymentFor} ${bill.description}`,
    `${L.amountPaid} ${formatINR(bill.amount)}`,
    `${L.status} ${L.paidValue}`,
    ``,
    `${L.viewReceipt} ${receiptLink}`,
    ``,
    L.bestRegards,
    payeeName,
    ``,
    `${L.verified} · ${domain}`,
  ];

  return lines.join("\n");
}

export function buildWhatsAppReceiptLink(
  bill: Bill,
  payeeName: string,
  baseUrl: string,
  lang: Language = "en",
) {
  const text = buildReceiptMessageText(bill, payeeName, baseUrl, lang);
  const phone = bill.payer_phone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
