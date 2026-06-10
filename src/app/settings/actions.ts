"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PERSONA_KEYS, type PersonaKey } from "@/lib/personas";

export async function saveSettings(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = String(formData.get("full_name") ?? "").trim();
  const upi_id = String(formData.get("upi_id") ?? "").trim();
  const personas = formData
    .getAll("personas")
    .map(String)
    .filter((p): p is PersonaKey => (PERSONA_KEYS as string[]).includes(p));

  if (personas.length === 0) {
    return { error: "Keep at least one persona selected." };
  }
  if (upi_id && !upi_id.includes("@")) {
    return { error: "UPI ID should look like name@bank." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, upi_id, personas, primary_persona: personas[0] })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { saved: true };
}
