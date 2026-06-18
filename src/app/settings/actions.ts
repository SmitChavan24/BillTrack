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
  const handleRaw = String(formData.get("handle") ?? "").trim().toLowerCase();
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

  // Public page handle (optional). 3–30 chars: letters, numbers, hyphens; must
  // start and end alphanumeric. Empty clears it.
  const RESERVED = ["admin", "billtrack", "support", "help", "app", "api"];
  let handle: string | null = null;
  if (handleRaw) {
    if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(handleRaw)) {
      return { error: "Page link must be 3–30 letters, numbers or hyphens." };
    }
    if (RESERVED.includes(handleRaw)) {
      return { error: "That page link is reserved — try another." };
    }
    handle = handleRaw;
  }

  const langRaw = String(formData.get("language") ?? "en");
  const language: "en" | "hi" | "hinglish" =
    langRaw === "hi" || langRaw === "hinglish" ? langRaw : "en";

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name,
      upi_id,
      handle,
      language,
      personas,
      primary_persona: personas[0],
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That page link is already taken — try another." };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { saved: true };
}
