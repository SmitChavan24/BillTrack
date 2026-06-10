import type { Metadata } from "next";
import AuthScreen from "@/components/AuthScreen";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to BillTrack — send WhatsApp payment reminders and collect money via UPI, free.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
