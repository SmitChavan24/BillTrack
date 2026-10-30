"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PERSONA_KEYS, type PersonaKey } from "@/lib/personas";
import { friendlyBillError } from "@/lib/plan";
import type { RepeatInterval } from "@/lib/types";

const REPEAT_VALUES: RepeatInterval[] = ["none", "weekly", "monthly", "quarterly", "yearly"];

function parseBill(formData: FormData) {
  const category = String(formData.get("category") ?? "");
  const repeat = String(formData.get("repeat_interval") ?? "none");
  let payer_phone = String(formData.get("payer_phone") ?? "").replace(/\D/g, "");
  if (payer_phone.length === 10) {
    payer_phone = "91" + payer_phone;
  }
  
  return {
    payer_name: String(formData.get("payer_name") ?? "").trim(),
    payer_phone,
    description: String(formData.get("description") ?? "").trim(),
    amount: Number(formData.get("amount") ?? 0),
    due_date: String(formData.get("due_date") ?? ""),
    category: (PERSONA_KEYS as string[]).includes(category)
      ? (category as PersonaKey)
      : null,
    repeat_interval: (REPEAT_VALUES as string[]).includes(repeat)
      ? (repeat as RepeatInterval)
      : ("none" as RepeatInterval),
  };
}

function validate(bill: ReturnType<typeof parseBill>) {
  if (!bill.payer_name) return "Payer name is required.";
  if (bill.payer_phone.length < 10) return "Enter a valid phone with country code.";
  if (!bill.description) return "Description is required.";
  if (!bill.amount || bill.amount <= 0) return "Amount must be greater than 0.";
  if (!bill.due_date) return "Due date is required.";
  if (!bill.category) return "Pick a valid category.";
  return null;
}

export async function createBill(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bill = parseBill(formData);
  const error = validate(bill);
  if (error) return { error };

  const { error: dbErr } = await supabase
    .from("bills")
    .insert({ ...bill, user_id: user.id });
  if (dbErr) return { error: friendlyBillError(dbErr.message) };

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateBill(id: string, _prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bill = parseBill(formData);
  const error = validate(bill);
  if (error) return { error };

  const { error: dbErr } = await supabase
    .from("bills")
    .update(bill)
    .eq("id", id)
    .eq("user_id", user.id);
  if (dbErr) return { error: dbErr.message };

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function setBillStatus(id: string, status: "pending" | "paid") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("bills")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function markReminded(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("bills")
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function deleteBill(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("bills").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Compute the next due date from a given date and interval.
function nextDueDate(current: string, interval: RepeatInterval): string {
  const d = new Date(current);
  switch (interval) {
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "quarterly":
      d.setMonth(d.getMonth() + 3);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      break;
    default:
      // "none" → push 30 days as a reasonable default for manual renewal
      d.setDate(d.getDate() + 30);
  }
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Create a new bill based on an existing one, with the next due date.
export async function renewBill(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: original } = await supabase
    .from("bills")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!original) return { error: "Bill not found" };

  const interval = original.repeat_interval ?? "none";
  const newDue = nextDueDate(original.due_date, interval);

  const { error: dbErr } = await supabase.from("bills").insert({
    user_id: user.id,
    payer_name: original.payer_name,
    payer_phone: original.payer_phone,
    description: original.description,
    amount: original.amount,
    due_date: newDue,
    category: original.category,
    repeat_interval: interval,
    parent_bill_id: id,
    status: "pending",
  });
  if (dbErr) return { error: friendlyBillError(dbErr.message) };

  revalidatePath("/dashboard");
  return { success: true };
}
