import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PersonaPicker from "@/components/PersonaPicker";
import type { PersonaKey } from "@/lib/personas";

export default async function PersonasPage() {
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

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <PersonaPicker initial={(profile?.personas ?? []) as PersonaKey[]} />
    </main>
  );
}
