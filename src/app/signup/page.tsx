import type { Metadata } from "next";
import AuthScreen from "@/components/AuthScreen";

export const metadata: Metadata = {
  title: "Create your free account",
  description:
    "Start sending WhatsApp payment reminders and collecting UPI payments with BillTrack — free, no app to install.",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
