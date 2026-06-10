import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/AppHeader";
import BillForm from "@/components/BillForm";
import type { Bill } from "@/lib/types";
import type { PersonaKey } from "@/lib/personas";

export default async function EditBillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: bill }] = await Promise.all([
    supabase.from("profiles").select("personas").eq("id", user.id).single(),
    supabase.from("bills").select("*").eq("id", id).eq("user_id", user.id).single(),
  ]);

  if (!bill) notFound();

  const personas = (profile?.personas ?? []) as PersonaKey[];

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 py-6">
        <Link href="/dashboard" className="text-sm text-slate-500">
          ← Back
        </Link>
        <h1 className="mb-5 mt-2 text-2xl font-bold tracking-tight">Edit bill</h1>
        <BillForm personas={personas} bill={bill as Bill} />
      </main>
    </>
  );
}
