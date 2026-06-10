"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Called from the PUBLIC pay page by an anonymous payer. claim_payment() is a
// security-definer RPC that only stamps payment_claimed_at — it can't change
// the amount or mark the bill paid, so this is safe to expose to anon.
export async function claimPayment(billId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("claim_payment", { p_bill_id: billId });
  if (error) return { error: error.message };
  revalidatePath(`/pay/${billId}`);
  return { success: true };
}
