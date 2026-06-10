"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function replyToFeedback(id: string, reply: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const trimmed = reply.trim();
  if (!trimmed) return { error: "Reply cannot be empty" };

  // admin_reply_feedback() is security-definer and re-checks is_admin() in the
  // database, so a non-admin calling this still gets rejected server-side.
  const { error } = await supabase.rpc("admin_reply_feedback", {
    p_id: id,
    p_reply: trimmed,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}
