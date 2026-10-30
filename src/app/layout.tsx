import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorker from "@/components/ServiceWorker";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = "https://www.billtrack.me";
const SITE_DESCRIPTION =
  "BillTrack lets landlords, shopkeepers, tutors and freelancers send free payment reminders on WhatsApp and collect money instantly with UPI pay links. Free plan, no app to install.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BillTrack — WhatsApp Payment Reminders & UPI Pay Links",
    template: "%s · BillTrack",
  },
  description: SITE_DESCRIPTION,
  applicationName: "BillTrack",
  keywords: [
    "payment reminder app",
    "WhatsApp payment reminder",
    "UPI payment link",
    "rent reminder app",
    "bill reminder for small business",
    "free invoice and payment reminder India",
    "collect payments UPI",
    "GPay PhonePe Paytm payment link",
  ],
  authors: [{ name: "BillTrack" }],
  creator: "BillTrack",
  publisher: "BillTrack",
  category: "finance",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "BillTrack",
    url: SITE_URL,
    title: "BillTrack — WhatsApp Payment Reminders & UPI Pay Links",
    description: SITE_DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "BillTrack — WhatsApp Payment Reminders & UPI Pay Links",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BillTrack" },
};

export const viewport: Viewport = {
  themeColor: "#0F6E56",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900">
        {children}
        <PwaInstallPrompt />
        <ServiceWorker />
      </body>
    </html>
  );
}
