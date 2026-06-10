"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PERSONA_KEYS, type PersonaKey } from "@/lib/personas";

export async function savePersonas(_prev: unknown, formData: FormData) {
  const selected = formData
    .getAll("personas")
    .map(String)
    .filter((p): p is PersonaKey => (PERSONA_KEYS as string[]).includes(p));

  if (selected.length === 0) {
    return { error: "Pick at least one persona to continue." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ personas: selected, primary_persona: selected[0] })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
