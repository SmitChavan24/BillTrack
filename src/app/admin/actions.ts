"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// After a user pays for Pro on pay.billtrack.me, an admin switches it on here.
export async function setUserPlan(userId: string, plan: "free" | "paid", months = 1) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // admin_set_plan() is security-definer and re-checks is_admin() in the database.
  const { error } = await supabase.rpc("admin_set_plan", {
    p_user: userId,
    p_plan: plan,
    p_months: months,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

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
