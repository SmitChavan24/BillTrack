import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import BillForm from "@/components/BillForm";
import type { PersonaKey } from "@/lib/personas";

export default async function NewBillPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("personas")
    .eq("id", user.id)
    .single();

  const personas = (profile?.personas ?? []) as PersonaKey[];
  if (personas.length === 0) redirect("/signup/personas");

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 py-6">
        <Link href="/dashboard" className="text-sm text-slate-500">
          ← Back
        </Link>
        <h1 className="mb-5 mt-2 text-2xl font-bold tracking-tight">New bill</h1>
        <BillForm personas={personas} />
      </main>
    </>
  );
}
