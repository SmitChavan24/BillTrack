"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FeedbackState = { error?: string; success?: boolean } | null;

export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const message = String(formData.get("message") ?? "").trim();
  if (!message) return { error: "Please write a message first." };
  if (message.length > 2000) return { error: "Message is too long (max 2000 characters)." };

  const { error } = await supabase
    .from("feedback")
    .insert({ user_id: user.id, message });
  if (error) return { error: error.message };

  revalidatePath("/feedback");
  return { success: true };
}
