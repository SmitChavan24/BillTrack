import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import SettingsForm from "@/components/SettingsForm";
import type { Profile } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/signup/personas");

  return (
    <>
      <AppHeader name={profile.full_name} />
      <main className="mx-auto max-w-2xl px-5 py-6">
        <Link href="/dashboard" className="text-sm text-slate-500">
          ← Back
        </Link>
        <h1 className="mb-5 mt-2 text-2xl font-bold tracking-tight">Settings</h1>
        <SettingsForm profile={profile as Profile} />
      </main>
    </>
  );
}
