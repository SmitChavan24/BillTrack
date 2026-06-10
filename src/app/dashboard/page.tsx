import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import DashboardClient from "@/components/DashboardClient";
import type { Bill, Profile } from "@/lib/types";

export default async function DashboardPage() {
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

  // No personas chosen yet → finish onboarding.
  if (!profile || (profile.personas ?? []).length === 0) {
    redirect("/signup/personas");
  }

  const { data: bills } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  return (
    <>
      <AppHeader name={profile.full_name} />
      <main className="mx-auto max-w-2xl px-5 py-6">
        <DashboardClient
          bills={(bills ?? []) as Bill[]}
          profile={profile as Profile}
        />
      </main>
    </>
  );
}
